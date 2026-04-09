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
// Narrowed to provide high-end Business, Venture, Fintech, and Tech strategy
const RSS_SOURCES = [
  // AFRICAN BUSINESS & TECH PLATFORMS
  { url: 'https://techcabal.com/feed/', category: 'Nigeria' },
  { url: 'https://techpoint.africa/feed/', category: 'Nigeria' },
  { url: 'https://businessday.ng/feed/', category: 'Business' },
  { url: 'https://weetracker.com/feed/', category: 'Venture' },
  { url: 'https://technologytimes.ng/feed/', category: 'Nigeria' },
  { url: 'https://www.techcityng.com/feed/', category: 'Tech' },
  { url: 'https://news.google.com/rss/search?q=site:techafricanews.com+tech+business', category: 'Innovation' },
  { url: 'https://nairametrics.com/feed/', category: 'Business' },

  // STOCK MARKET TRENDS & ANALYSIS (NIGERIA)
  { url: 'https://news.google.com/rss/search?q=nigeria+stock+market+ngx+simply+wall+st', category: 'Finance' },
  { url: 'https://news.google.com/rss/search?q=nigeria+trading+economics+stocks', category: 'Finance' },
  
  // AGRICULTURAL TRENDS & AGRIBUSINESS
  { url: 'https://news.google.com/rss/search?q=nigeria+agriculture+cropsense+agritech', category: 'Agriculture' },
  { url: 'https://news.google.com/rss/search?q=nigeria+ministry+of+agriculture+fmafs', category: 'Agriculture' },
  { url: 'https://news.google.com/rss/search?q=nigeria+investment+promotion+commission+nipc+business', category: 'Agriculture' },
  
  // GOVERNMENT GRANTS, LOANS, & SMALL BUSINESS OPPORTUNITIES
  { url: 'https://news.google.com/rss/search?q=nigeria+federal+government+grant+presidential', category: 'Grants' },
  { url: 'https://news.google.com/rss/search?q=bank+of+industry+boi+intervention+portal+msme', category: 'Grants' },
  { url: 'https://news.google.com/rss/search?q=smedan+loans+matching+fund+nigeria+business', category: 'Grants' },
  { url: 'https://news.google.com/rss/search?q=nirsal+microfinance+bank+agsmeis+loans', category: 'Grants' },
  { url: 'https://news.google.com/rss/search?q=nelfund+student+loans+nigeria', category: 'Grants' },
  
  // PRIVATE & NON-PROFIT GRANTS
  { url: 'https://news.google.com/rss/search?q=tony+elumelu+foundation+tef+grants+entrepreneurs', category: 'Grants' },
  { url: 'https://news.google.com/rss/search?q=fundsforngos+nigeria+youth+futures+fund+nyff', category: 'Grants' },
  { url: 'https://news.google.com/rss/search?q=scholarshipair+nigeria+entrepreneurship', category: 'Grants' },

  // GLOBAL TECH
  { url: 'https://news.google.com/rss/search?q=cnn+business+tech+news', category: 'Tech' },
  { url: 'https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=19854910', category: 'Business' } // CNBC Tech
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

    // Google News special handling: redirect following
    if (url.includes('news.google.com')) {
      const metaUrl = $('meta[property="og:url"]').attr('content') || $('a[jsname="t79S7c"]').attr('href');
      if (metaUrl && metaUrl !== url) {
        resp = await fetch(metaUrl, {
          headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' },
          signal: AbortSignal.timeout(10000),
        });
        if (!resp.ok) throw new Error(`Redirect HTTP ${resp.status}`);
        html = await resp.text();
        $ = cheerio.load(html);
      }
    }

    // ELITE IMAGE ENGINE: Detecting generic logos more aggressively
    let image = $('meta[property="og:image"]').attr('content') || 
                $('meta[name="twitter:image"]').attr('content') || 
                $('meta[name="image"]').attr('content');

    const isGeneric = !image || 
                     image.includes('googleusercontent') || 
                     image.includes('gstatic') || 
                     image.includes('news.google') || 
                     image.includes('youtube.com/img') ||
                     image.includes('/logo') ||
                     image.includes('favicon') ||
                     image.includes('icon-') ||
                     image.length < 25; // Too short to be a valid absolute URL
    
    if (isGeneric) {
      // PREMIUM CURATED STOCK POOLS
      const pools: Record<string, string[]> = {
        'Innovation': ['1451187580241-7f57548a608d', '1485827404703-89b55fcc595e', '1519389950473-47ba0277781c', '1526628953301-3e589a6a127e'],
        'Business': ['1460925895917-afdab827c52f', '1504384308090-c564bd4668a3', '1507679799987-c7377f0f49f9', '1553484771-3710605d0b92'],
        'AI': ['1677442136019-21780ecad995', '1485827404703-89b55fcc595e', '1531297484001-80022131f5a1', '1620712946101-da6128032483'],
        'Nigeria': ['1550005810-ca9161a0215a', '1520110120302-851250430b42', '1611273298532-a31c62b0f89d', '1589133860010-388e40439603'],
        'Fintech': ['1551288049-bebda4e38f71', '1563986768609-322da13575f3', '1550565114-1f061e808383', '1526304640581-d334cd06f69d'],
        'Venture': ['1460925895917-afdab827c52f', '1454165833467-cd356ed9942e', '1553484771-3710605d0b92', '1552664730-d307ca884978']
      };
      const pool = pools[category] || pools['Business'];
      const photoId = pool[Math.floor(Math.random() * pool.length)];
      image = `https://images.unsplash.com/photo-${photoId}?q=80&w=1200&auto=format&fit=crop`;
    }

    $('script, style, iframe, nav, footer, header, aside, .ad, .social, [class*="ad-"], [id*="ad-"]').remove();
    const title = $('h1').first().text().trim() || $('title').text().trim();
    const content = $('article, main, .post-content, .article-body, #article-body').text() || $('body').text();
    const cleaned = content.replace(/\s+/g, ' ').replace(/\n+/g, ' ').trim().slice(0, 4000);

    if (!cleaned || cleaned.length < 300) return null;
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
    ? `Analysis based on video: ${data.url}`
    : `Analysis based on findings: ${data.url}`;

  const today = new Date().toISOString();
  const tags = buildTags(category);

  return `
You are Samuel Stanley, a developer and tech enthusiast running "Stanley's Log". 
This is your personal blog where you share your genuine opinions, perspectives, and advice.

${sourceNote}

${isYT ? `Raw Source Transcript:` : `Source Content:`}
${data.content}

CRITICAL INSTRUCTIONS FOR TONE AND STYLE:
1. FIRST-PERSON PERSPECTIVE: Write completely in the first-person ("I", "my view", "from my perspective", "as a developer"). This must sound exactly like a real human expressing their own thoughts. 
2. HIGHLY HUMAN & AUTHENTIC: Do NOT sound like an AI. Avoid robotic structures, typical AI buzzwords ("In conclusion", "delve into", "multifaceted", "a testament to"), and overly formal phrasing. Write conversationally but professionally, like a passionate developer talking to a colleague.
3. YOUR VOICE: You are lending your voice as a software developer to help people, startups, and businesses grow. Share your candid opinion on the source content. Provide your unique take.
4. FOCUS AREAS: Depending on the article's core subject, naturally tie your thoughts to its SPECIFIC nuances (e.g., specific stock trends, practical agritech tools, precise grant application logic). 
   **CRITICAL AVOID REPETITION:** DO NOT repeat generic, pre-packaged narratives about "Nigerian youth empowerment" or "the vast potential of the startup ecosystem" in every single article. Every post MUST have a completely unique angle and observation derived purely from the fresh source data.
5. NO GENERIC AI SUMMARIES: Do not just summarize the article. Use the article as a springboard to share YOUR original, unrepeated opinion on the matter. You can disagree, be critical, or be excited about it.

FORMATTING AND STRUCTURE:
- Use natural headings (not robotic ones).
- Keep paragraphs relatively short and readable.
- If relevant, include a section on how this directly impacts Nigerian startups or small businesses.
- Inject 2-3 relevant images from the list below naturally into the flow using standard Markdown: ![A descriptive caption](url)

STOCK IMAGE POOL (Use these URLs in the body):
- https://images.unsplash.com/photo-1454165833467-cd356ed9942e?q=80&w=1200&auto=format&fit=crop (Business Strategy)
- https://images.unsplash.com/photo-1526304640581-d334cd06f69d?q=80&w=1200&auto=format&fit=crop (Finance/Data)
- https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop (Modern Innovation)
- https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop (Growth/Charts)
- https://images.unsplash.com/photo-1550005810-ca9161a0215a?q=80&w=1200&auto=format&fit=crop (Nigeria/Infrastructure)

FORMAT: Start with exactly this YAML frontmatter:
---
title: "[Write a catchy, non-clickbaity, human-sounding title, max 70 chars]"
date: "${today}"
excerpt: "[Write a highly conversational, personal hook...]"
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
    Finance: '["Finance", "Stock Market", "NGX", "Investment"]',
    Agriculture: '["Agriculture", "Agritech", "Farming", "Nigeria"]',
    Grants: '["Grants", "Funding", "Small Business", "Nigeria"]',
    Tech: '["Tech", "Innovation", "Digital"]',
    Venture: '["Venture Capital", "Startups", "Investment"]',
    Innovation: '["Innovation", "Technology", "Future"]',
    Fintech: '["Fintech", "Finance", "Banking", "Nigeria"]',
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
    'gemini-flash-latest',       // Priority 1
    'gemini-2.5-flash',         // Priority 2
    'gemini-flash-lite-latest',  // Priority 3
    'gemini-1.5-flash',         // Standard fallback
    'gemini-1.5-flash-latest',
    'gemini-2.0-flash-exp',
    'gemini-1.5-pro',
    'gemini-pro'
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
