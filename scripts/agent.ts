import fs from 'fs';
import path from 'path';
import * as cheerio from 'cheerio';
import Parser from 'rss-parser';
import { YoutubeTranscript } from 'youtube-transcript';
import { GoogleGenerativeAI } from '@google/generative-ai';

// ─── Init ────────────────────────────────────────────────────────────────────
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const rssParser = new Parser();
const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

// ─── News Sources ─────────────────────────────────────────────────────────────
// Broadened to include Business, Startups, Tech-in-Entertainment, and African Venture Capital
const RSS_SOURCES = [
  // Global Tech & Business Innovation
  { url: 'https://news.google.com/rss/search?q=future+of+technology+and+business&hl=en-US&gl=US', category: 'Innovation' },
  { url: 'https://news.google.com/rss/search?q=global+venture+capital+trends+startups', category: 'Business' },
  { url: 'https://news.google.com/rss/search?q=generative+ai+business+impact+2026', category: 'AI' },
  // Nigeria & African Startup Ecosystem (Crucial)
  { url: 'https://news.google.com/rss/search?q=nigeria+startups+tech+funding+news', category: 'Nigeria' },
  { url: 'https://news.google.com/rss/search?q=africa+digital+economy+growth', category: 'Nigeria' },
  { url: 'https://news.google.com/rss/search?q=fintech+innovation+africa+growth', category: 'Fintech' },
  // Entertainment & Lifestyle Tech
  { url: 'https://news.google.com/rss/search?q=future+of+entertainment+streaming+ai+gaming', category: 'Entertainment' },
  { url: 'https://news.google.com/rss/search?q=tech+trends+in+media+and+advertising', category: 'Business' },
];

// ─── Types ────────────────────────────────────────────────────────────────────
interface ScrapedData {
  title: string;
  url: string;
  content: string;
  image?: string; // New field for cover images
  sourceType: 'article' | 'youtube';
}

interface AgentResult {
  slug: string;
  filePath: string;
  title: string;
  message: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Detect if a URL is a YouTube video */
function isYouTubeUrl(url: string): boolean {
  return /(?:youtube\.com\/watch|youtu\.be\/)/.test(url);
}

/** Extract YouTube video ID from URL */
function extractYouTubeId(url: string): string | null {
  const match = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

/** Scrape full article text from a web URL */
async function scrapeArticle(url: string, category: string): Promise<ScrapedData | null> {
  try {
    console.log(`  → Scraping article: ${url}`);
    let resp = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1' }, // Better UA
      signal: AbortSignal.timeout(12000),
    });

    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    let html = await resp.text();
    let $ = cheerio.load(html);

    // Google News special handling: it uses meta-refresh redirects
    if (url.includes('news.google.com')) {
      const metaUrl = $('meta[property="og:url"]').attr('content') || $('a[jsname="t79S7c"]').attr('href');
      if (metaUrl && metaUrl !== url) {
        console.log(`    ↳ Following Google News redirect to: ${metaUrl}`);
        resp = await fetch(metaUrl, {
          headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' },
          signal: AbortSignal.timeout(10000),
        });
        if (!resp.ok) throw new Error(`Redirect HTTP ${resp.status}`);
        html = await resp.text();
        $ = cheerio.load(html);
      }
    }

    // SLICK IMAGE ENGINE: Detect generic logos and swap for Unsplash
    let image = $('meta[property="og:image"]').attr('content') || 
                $('meta[name="twitter:image"]').attr('content') || 
                $('meta[name="image"]').attr('content');

    const isGeneric = !image || image.includes('googleusercontent') || image.includes('gstatic') || image.includes('news.google') || image.includes('youtube.com/img');
    
    if (isGeneric) {
      // Intelligent fallbacks based on category
      const feeds: Record<string, string> = {
        'Innovation': '1451187580241-7f57548a608d',
        'Business': '1460925895917-afdab827c52f',
        'AI': '1677442136019-21780ecad995',
        'Nigeria': '1550005810-ca9161a0215a',
        'Fintech': '1551288049-bebda4e38f71',
        'Entertainment': '1470225620780-dba8ba36b745',
        'Engineering': '1581094794329-c8112a89af12'
      };
      const photoId = feeds[category] || '1518770660439-4636190af475';
      image = `https://images.unsplash.com/photo-${photoId}?q=80&w=1200&auto=format&fit=crop`;
    }

    $('script, style, iframe, nav, footer, header, aside, .ad, .social, [class*="ad-"], [id*="ad-"]').remove();

    const title = $('h1').first().text().trim() || $('title').text().trim();
    const content = $('article, main, .post-content, .article-body, #article-body').text() || $('body').text();
    // LEAN MODE: Truncate to 4000 chars to stay under free tier daily token limits
    const cleaned = content.replace(/\s+/g, ' ').replace(/\n+/g, ' ').trim().slice(0, 4000);

    if (!cleaned || cleaned.length < 300) {
      console.warn(`    ⚠ Extracted content too short (${cleaned.length} chars). Possible paywall or bot protection.`);
      return null;
    }

    return { title, url: resp.url, content: cleaned, image, sourceType: 'article' };
  } catch (err) {
    console.error(`  ✗ Failed to scrape ${url}:`, err);
    return null;
  }
}

/** Fetch transcript from a YouTube video and build a ScrapedData object */
async function scrapeYouTube(url: string): Promise<ScrapedData | null> {
  try {
    const videoId = extractYouTubeId(url);
    if (!videoId) throw new Error('Could not extract YouTube ID');
    console.log(`  → Fetching YouTube transcript for video: ${videoId}`);

    const segments = await YoutubeTranscript.fetchTranscript(videoId);
    if (!segments || segments.length === 0) throw new Error('Transcript is empty');

    const rawTranscript = segments.map((s) => s.text).join(' ');
    const title = `YouTube Video — ${videoId}`;
    const content = rawTranscript.slice(0, 12000);
    // YOUTUBE THUMBNAIL: High-quality default image
    const image = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

    return { title, url, content, image, sourceType: 'youtube' };
  } catch (err) {
    console.error(`  ✗ YouTube scrape failed for ${url}:`, err);
    return null;
  }
}

/** Pick a random trending URL from RSS sources */
async function getTrendingUrl(): Promise<{ url: string; category: string } | null> {
  const source = RSS_SOURCES[Math.floor(Math.random() * RSS_SOURCES.length)];
  try {
    const feed = await rssParser.parseURL(source.url);
    if (!feed.items?.length) return null;
    const item = feed.items[Math.floor(Math.random() * Math.min(8, feed.items.length))];
    return item.link ? { url: item.link, category: source.category } : null;
  } catch (err) {
    console.error(`  ✗ RSS fetch failed for ${source.url}:`, err);
    return null;
  }
}

/** Build the prompt for Gemini based on source type */
function buildPrompt(data: ScrapedData, category: string): string {
  const isYT = data.sourceType === 'youtube';
  const sourceNote = isYT
    ? `This analysis is based on a visual report at ${data.url}.`
    : `This analysis is based on report findings at ${data.url}.`;

  const today = new Date().toISOString();
  const tags = buildTags(category);

  return `
You are the primary voice of "Stanley's Log", a high-end publication for technical insights, venture capital, and strategic innovation.
Your goal is to provide profound solutions, honest insights, and sharp criticisms on the latest trends.

${sourceNote}

${isYT ? `Raw Source Transcript:` : `Source Content:`}
${data.content}

REQUIREMENTS:
1. DO NOT center this on "developers". Focus on the broader impacts for industry leaders, entrepreneurs, and thinkers.
2. Write 600–900 words of hard-hitting, analytical content.
3. Be provocative and honest. If a trend is overrated, say so. If a solution is profound, explain why.
4. "The Lagos Perspective": Always tie a portion of the analysis to the Nigerian or African tech/business ecosystem. What does this mean for our local market?
5. "Minimal Developer Pivot": You MAY include a single-sentence technical or developer-centric pivot ONLY if it adds direct value to the solution. Keep it extremely minimal and surgical.
6. Structure:
   - "The Hook": A compelling, intelligent opening.
   - "The Profound Solution": Your unique take on how to solve the problems mentioned in the source.
   - "Honest Insight & Criticism": A sharp, unfiltered look at the flaws or hidden potentials.
   - "Action Point": A concrete strategic takeaway for the reader.
7. Voice: First-person authoritative ("We see...", "The reality is..."). No fluff, no generic corporate jargon.

FORMAT: Start the file with exactly this YAML frontmatter block (fill in the placeholders):
---
title: "[a sharp, authoritative title (e.g. 'The Fallacy of...', 'The Profound Future of...'), max 70 chars]"
date: "${today}"
excerpt: "[a compelling 2-sentence hook that makes people want to read more]"
category: "${category}"
tags: ${tags}
image: "${data.image || ''}"
readTime: "[e.g. 6 min read]"
sourceUrl: "${data.url}"
---

Then write the blog post body in clean markdown. Use ## for section headings, **bold** for emphasis.
DO NOT wrap everything in a \`\`\`markdown code block. Start straight with the frontmatter dashes.
`;
}

/** Choose tags relevant to the category */
function buildTags(category: string): string {
  const tagMap: Record<string, string> = {
    AI: '["AI", "Machine Learning", "Tech"]',
    Engineering: '["Engineering", "Development", "Code"]',
    Nigeria: '["Nigeria", "Africa", "Tech", "Startups"]',
    Business: '["Business", "Startups", "Entrepreneurship"]',
    Career: '["Career", "Freelance", "Developer Life"]',
    DevOps: '["DevOps", "Infrastructure", "Cloud"]',
    TypeScript: '["TypeScript", "JavaScript", "Code"]',
  };
  return tagMap[category] ?? '["Tech", "Development"]';
}

/** 
 * Call Gemini with Exponential Backoff Retries.
 * This handles 429 (Rate Limit) and 503 (Service Unavailable) errors gracefully.
 */
async function callGeminiWithRetry(modelName: string, prompt: string, maxRetries = 3, initialDelay = 5000): Promise<string> {
  let attempt = 0;
  
  while (attempt < maxRetries) {
    try {
      console.log(`    Trying model: ${modelName} (Attempt ${attempt + 1}/${maxRetries})...`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      });
      
      const response = await result.response;
      let text = response.text();

      // Strip wrapping code blocks
      if (text.trimStart().startsWith('```')) {
        const lines = text.split('\n');
        if (lines[0].startsWith('```')) lines.shift();
        if (lines[lines.length - 1].trim() === '```') lines.pop();
        text = lines.join('\n');
      }

      return text;
    } catch (err: any) {
      const isRetryable = err.message.includes('429') || 
                        err.message.includes('503') || 
                        err.message.includes('Quota') ||
                        err.message.includes('exhausted');
      
      if (isRetryable && attempt < maxRetries - 1) {
        const delay = initialDelay * Math.pow(2, attempt);
        console.warn(`    ⚠️ ${modelName} hit a limit or is busy. Retrying in ${delay/1000}s...`);
        await new Promise(r => setTimeout(r, delay));
        attempt++;
        continue;
      }
      
      // If not retryable or max retries reached, throw to let the fallback chain handle it
      throw err;
    }
  }
  throw new Error(`Model ${modelName} failed after ${maxRetries} attempts`);
}

/** 
 * Generate article markdown with a fallback chain of models. 
 * Each model in the chain now has its own internal retry logic.
 */
async function generateArticle(data: ScrapedData, category: string): Promise<string> {
  console.log(`  → Generating article with Gemini... (${data.sourceType})`);
  
  const modelsToTry = [
    'gemini-2.5-flash',
    'gemini-2.0-flash',
    'gemini-1.5-flash'
  ];
  
  const prompt = buildPrompt(data, category);
  let lastErrorMsg = '';
  
  for (const modelName of modelsToTry) {
    try {
      const result = await callGeminiWithRetry(modelName, prompt);
      console.log(`    ✅ Generation successful with: ${modelName}`);
      return result;
    } catch (err: any) {
      lastErrorMsg = err.message;
      console.warn(`    ⚠️ ${modelName} fallback chain failed: ${lastErrorMsg}`);
      
      // Short delay before trying the NEXT model in the chain
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  throw new Error(`Critical: Exhausted all fallback models including retries. Last error: ${lastErrorMsg}`);
}

/** Save the generated markdown to content/blog/ */
function savePost(title: string, markdown: string): AgentResult {
  if (!fs.existsSync(BLOG_DIR)) {
    fs.mkdirSync(BLOG_DIR, { recursive: true });
  }

  const safeTitle = title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 50)
    .replace(/-+$/, '');
  const dateStr = new Date().toISOString().split('T')[0];
  const slug = `${dateStr}-${safeTitle}`;
  const filePath = path.join(BLOG_DIR, `${slug}.md`);

  fs.writeFileSync(filePath, markdown, 'utf-8');
  console.log(`  ✅ Saved: ${filePath}`);
  return { slug, filePath, title, message: 'Success' };
}

// ─── Main Export ──────────────────────────────────────────────────────────────

/**
 * Main agent entry point.
 * @param targetUrl Optional: a specific article URL or YouTube link to process.
 *                  If omitted, the agent picks a trending topic from RSS.
 */
export async function runAgent(targetUrl?: string): Promise<AgentResult> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not set. Add it to your .env file.');
  }

  let finalData: ScrapedData | null = null;
  let finalCategory = 'Engineering';
  let retries = 5;

  if (targetUrl) {
    const url = targetUrl;
    finalCategory = isYouTubeUrl(url) ? 'Engineering' : 'Tech';
    console.log(`\n▶ Running agent on provided URL: ${url}`);
    
    finalData = isYouTubeUrl(url) ? await scrapeYouTube(url) : await scrapeArticle(url, finalCategory);
    if (!finalData?.content) throw new Error(`Failed to extract content from: ${url}`);
  } else {
    console.log('\n▶ Random mode — looking for a trending topic from RSS...');
    
    while (retries > 0) {
      const trending = await getTrendingUrl();
      if (!trending) {
        retries--;
        continue;
      }
      
      const { url, category } = trending;
      finalCategory = category;
      console.log(`  Checking: ${url} [${category}]`);

      const data = isYouTubeUrl(url) ? await scrapeYouTube(url) : await scrapeArticle(url, category);
      if (data?.content) {
        finalData = data;
        break; // Success!
      }
      
      console.warn(`  ⚠ Content extraction failed. Retrying with another URL... (${retries-1} left)`);
      retries--;
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  if (!finalData?.content) {
    throw new Error('Could not extract content from any trending sources after multiple attempts.');
  }

  // Generate with Gemini
  const markdown = await generateArticle(finalData, finalCategory);

  // Save to disk
  const titleMatch = markdown.match(/title:\s*"?(.+?)"?\s*\n/);
  const title = titleMatch?.[1] ?? (finalData ? finalData.title : 'Untitled');
  return savePost(title, markdown);
}

// ─── CLI Entry Point ──────────────────────────────────────────────────────────
// Run with: npx tsx scripts/agent.ts [optional-url]
if (process.env.AGENT_CLI === 'true') {
  const urlArg = process.argv[2];
  console.log('Samuel Stanley AI Blog Agent — Starting...');
  runAgent(urlArg)
    .then((result) => {
      console.log('\n✅ Done!');
      console.log(`   Slug:  ${result.slug}`);
      console.log(`   File:  ${result.filePath}`);
    })
    .catch((err) => {
      console.error('\n❌ Agent failed:', err.message);
      process.exit(1);
    });
}
