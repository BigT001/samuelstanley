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
const HISTORY_FILE = path.join(process.cwd(), 'scripts', 'agent-history.json');

// ─── Content Filtering ────────────────────────────────────────────────────────
const NEGATIVE_KEYWORDS = [
  'geopolitical', 'ceasefire', 'war', 'israel', 'iran', 'lebanon', 'hezbollah',
  'military', 'diplomacy', 'nuclear', 'sanctions', 'ministry', 'government',
  'politics', 'election', 'protest', 'governor', 'senate', 'presidency'
];

// ─── News Sources ─────────────────────────────────────────────────────────────
const RSS_SOURCES = [
  // NIGERIA TECH & STARTUPS (Highest Priority)
  { url: 'https://techcabal.com/feed/', category: 'Nigeria' },
  { url: 'https://techpoint.africa/feed/', category: 'Nigeria' },
  { url: 'https://benjamindada.com/feed/', category: 'Nigeria' },
  { url: 'https://www.techcityng.com/feed/', category: 'Nigeria' },
  { url: 'https://technologytimes.ng/feed/', category: 'Nigeria' },
  { url: 'https://nairametrics.com/category/tech/feed/', category: 'Fintech' },
  
  // BUSINESS & VENTURE (AFRICA FOCUS)
  { url: 'https://businessday.ng/category/technology/feed/', category: 'Business' },
  { url: 'https://weetracker.com/feed/', category: 'Venture' },
  { url: 'https://disrupt-africa.com/feed/', category: 'Venture' },
  
  // PRACTICAL DEV & ENGINEERING
  { url: 'https://dev.to/feed', category: 'Engineering' },
  { url: 'https://hashnode.com/res/rss.xml', category: 'Engineering' },
  { url: 'https://hackernoon.com/feed', category: 'Tech' },

  // SPECIFIC NIGERIAN OPPORTUNITIES
  { url: 'https://news.google.com/rss/search?q=nigeria+startups+funding+tech', category: 'Venture' },
  { url: 'https://news.google.com/rss/search?q=nigeria+fintech+innovation', category: 'Fintech' },
  { url: 'https://news.google.com/rss/search?q=nigeria+software+engineering+jobs+trends', category: 'Engineering' }
];

// ─── Types ────────────────────────────────────────────────────────────────────
interface ScrapedData {
  title: string;
  url: string;
  content: string;
  image?: string;
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
        'Nigeria': ['1550005810-ca9161a0215a', '1520110120302-851250430b42', '1611273298532-a31c62b0f89d', '1589133860010-388e40439603', '1541915085-30100f92dd24'],
        'Fintech': ['1551288049-bebda4e38f71', '1563986768609-322da13575f3', '1550565114-1f061e808383', '1526304640581-d334cd06f69d'],
        'Venture': ['1460925895917-afdab827c52f', '1454165833467-cd356ed9942e', '1553484771-3710605d0b92', '1552664730-d307ca884978'],
        'Engineering': ['1498050108023-c5249f4df085', '1555066931-4365d14bab8c', '1517694712282-14f494bc6f0e', '1587629990302-cd30be059f13']
      };
      const pool = pools[category] || pools['Nigeria'];
      const photoId = pool[Math.floor(Math.random() * pool.length)];
      image = `https://images.unsplash.com/photo-${photoId}?q=80&w=1200&auto=format&fit=crop`;
    }

    // ENSURE IMAGE IS NEVER EMPTY
    if (!image) {
      image = 'https://images.unsplash.com/photo-1550005810-ca9161a0215a?q=80&w=1200&auto=format&fit=crop';
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

/** Get list of recently used sources */
function getSourceHistory(): string[] {
  try {
    if (fs.existsSync(HISTORY_FILE)) {
      const data = JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf-8'));
      return Array.isArray(data) ? data : [];
    }
  } catch (e) {
    console.warn('  ⚠ Failed to read history file.');
  }
  return [];
}

/** Save source to history */
function saveSourceToHistory(url: string) {
  try {
    const history = getSourceHistory();
    const domain = new URL(url).hostname;
    const newHistory = [domain, ...history].slice(0, 15); // Track last 15 domains
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(newHistory, null, 2));
  } catch (e) {
    console.warn('  ⚠ Failed to save history.');
  }
}

/** Pick a random trending URL from RSS sources with filtering */
async function getTrendingUrl(): Promise<{ url: string; category: string } | null> {
  const history = getSourceHistory();
  
  // Shuffle sources to ensure variety
  const shuffledSources = [...RSS_SOURCES].sort(() => Math.random() - 0.5);
  
  for (const source of shuffledSources) {
    const domain = new URL(source.url).hostname;
    
    // Skip if we used this domain very recently (unless we run out of options)
    if (history.includes(domain) && Math.random() > 0.2) continue;

    try {
      console.log(`  → Fetching from source: ${source.url}`);
      const feed = await rssParser.parseURL(source.url);
      if (!feed.items?.length) continue;

      // Filter items for negative keywords
      const validItems = feed.items.filter(item => {
        const text = (item.title + ' ' + (item.contentSnippet || '')).toLowerCase();
        return !NEGATIVE_KEYWORDS.some(word => text.includes(word));
      });

      if (!validItems.length) continue;

      // Pick one of the top 5 valid items
      const item = validItems[Math.floor(Math.random() * Math.min(5, validItems.length))];
      if (item.link) {
        saveSourceToHistory(item.link);
        return { url: item.link, category: source.category };
      }
    } catch (err) {
      console.error(`  ✗ RSS fetch failed for ${source.url}`);
    }
  }
  return null;
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
You are Samuel Stanley, a software developer, technical founder, and creative thinker based in Nigeria. 
This is "Stanley's Log", your personal space for candid reflections on technology, building products, and navigating the Nigerian ecosystem.

${sourceNote}

${isYT ? `Raw Source Transcript:` : `Source Content:`}
${data.content}

CRITICAL INSTRUCTIONS FOR TONE AND STYLE:
1. **Developer Perspective**: Write as a person who builds things. Talk about the "how", the "tech stack", the "user experience", or the "execution". Avoid high-level corporate jargon like "strategic innovation", "geopolitical corridors", or "C-suite imperatives".
2. **Dynamic Human Voice**: Be authentic, slightly informal, and opinionated. Sometimes you're excited, sometimes skeptical, sometimes just tired from a long day of debugging. Avoid sounding like a template. Use varied sentence structures. 
3. **Avoid the "Geopolitics" Trap**: Do NOT turn this into a political or geopolitical analysis. If the source material is political, pivot immediately to how it affects developers, small business owners, or the local tech market.
4. **Concrete & Hyper-Local**: Use specific Nigerian references that feel lived-in. Stay away from the "generic tech" clichés like "Yaba" or "Silicon Lagoon". Instead, pivot to something more specific and varied: the tech scene in Akure, the hustle in Onitsha, the "Sapa" struggle, the "No gree for anybody" mindset, the specific vibe of a gbagada workstation, the cold mornings in Jos, or the chaotic energy of a bus park in Owerri. Be a resident of the whole country, not just one neighborhood.
5. **No AI Buzzwords**: Avoid: "In conclusion", "delve", "multifaceted", "testament", "nuanced", "strategic", "paradigm shift", "vital role". Just talk like a human.
6. **Randomized Opening**: Do NOT always start your thoughts with "I was just reading...". Start with the problem, a feeling, a memory, or a direct reaction.

FORMATTING:
- Use natural headings that reflect your personal opinion (e.g., "The Problem with X", "Why I'm Excited About Y").
- Keep it punchy. Use short paragraphs.
- Inject 2-3 relevant images from the list below naturally using Markdown: ![A descriptive caption](url)

STOCK IMAGE POOL (Body Usage):
- https://images.unsplash.com/photo-1550005810-ca9161a0215a?q=80&w=1200&auto=format&fit=crop (Nigeria Scenes)
- https://images.unsplash.com/photo-1517694712282-14f494bc6f0e?q=80&w=1200&auto=format&fit=crop (Coding/Laptop)
- https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop (Lines of Code)
- https://images.unsplash.com/photo-1526304640581-d334cd06f69d?q=80&w=1200&auto=format&fit=crop (Data/Finance)
- https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop (Graph/Success)

FORMAT: Start with exactly this YAML frontmatter:
---
title: "[Catchy, human title - avoid corporate speak]"
date: "${today}"
excerpt: "[A 1-2 sentence hook. Vary your style. Avoid always starting with the same phrase. Be punchy.]"
category: "${category}"
tags: ${tags}
image: "${data.image || 'https://images.unsplash.com/photo-1550005810-ca9161a0215a?q=80&w=1200&auto=format&fit=crop'}"
readTime: "[X min read]"
sourceUrl: "${data.url}"
---

Write the blog post body below. No code blocks for the whole file. Use "I", "me", and "my" to maintain the personal blog feel.

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
    Finance: '["Finance", "Stock Market", "Investment"]',
    Agriculture: '["Agriculture", "Agritech", "Farmed"]',
    Grants: '["Grants", "Funding", "Nigeria"]',
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
