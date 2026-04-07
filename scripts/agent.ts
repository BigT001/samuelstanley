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
// Covers: global tech, AI, Nigeria business/startups, inspiring dev content
const RSS_SOURCES = [
  // Global Tech & AI
  { url: 'https://news.google.com/rss/search?q=artificial+intelligence+startups&hl=en-US&gl=US', category: 'AI' },
  { url: 'https://news.google.com/rss/search?q=software+engineering+best+practices', category: 'Engineering' },
  { url: 'https://news.google.com/rss/search?q=nextjs+react+typescript+2026', category: 'Engineering' },
  { url: 'https://news.google.com/rss/search?q=web+development+trends', category: 'Engineering' },
  // Nigeria & Africa
  { url: 'https://news.google.com/rss/search?q=nigeria+tech+startups', category: 'Nigeria' },
  { url: 'https://news.google.com/rss/search?q=africa+fintech+startup+funding', category: 'Nigeria' },
  { url: 'https://news.google.com/rss/search?q=nigeria+business+entrepreneurship', category: 'Business' },
  // Business & Entrepreneurship
  { url: 'https://news.google.com/rss/search?q=saas+startup+funding+2026', category: 'Business' },
  { url: 'https://news.google.com/rss/search?q=developer+freelance+career', category: 'Career' },
];

// ─── Types ────────────────────────────────────────────────────────────────────
interface ScrapedData {
  title: string;
  url: string;
  content: string;
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
async function scrapeArticle(url: string): Promise<ScrapedData | null> {
  try {
    console.log(`  → Scraping article: ${url}`);
    const resp = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SamuelBlog/1.0)' },
      signal: AbortSignal.timeout(12000),
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const html = await resp.text();
    const $ = cheerio.load(html);

    $('script, style, iframe, nav, footer, header, aside, [class*="ad"], [id*="ad"]').remove();

    const title = $('h1').first().text().trim() || $('title').text().trim();
    const content = $('article, main, [role="main"]').text() || $('body').text();
    const cleaned = content.replace(/\s+/g, ' ').trim().slice(0, 10000);

    if (!cleaned || cleaned.length < 200) return null;
    return { title, url, content: cleaned, sourceType: 'article' };
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

    return { title, url, content, sourceType: 'youtube' };
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
    ? `This content was transcribed from a YouTube video at ${data.url}.`
    : `This content was sourced from an article at ${data.url}.`;

  const today = new Date().toISOString();
  const tags = buildTags(category);

  return `
You are Samuel Stanley's personal AI content writer. Samuel is a full-stack developer from Lagos, Nigeria.
Your job is to write an engaging, original, and insightful blog post for Samuel's portfolio blog.

${sourceNote}

${isYT ? `Video Transcript:` : `Article Content:`}
${data.content}

REQUIREMENTS:
1. Write 500–900 words. Be substantive and analytical — don't just summarise.
2. Open with a hook that grabs the reader's attention.
3. Add a "Why This Matters" section that makes the practical impact crystal clear.
4. If relevant, include a perspective on how this affects Nigerian developers, startups, or the African tech ecosystem.
5. Write in first-person plural or second-person (e.g., "we", "you as a developer…")
6. Be opinionated and direct. No fluff, no corporate speak.
7. End with a concrete takeaway or action point for the reader.

FORMAT: Start the file with exactly this YAML frontmatter block (fill in the placeholders):
---
title: "[an engaging click-worthy title, max 70 chars]"
date: "${today}"
excerpt: "[a compelling 2-sentence hook that makes people want to read more]"
category: "${category}"
tags: ${tags}
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

/** Call Gemini to generate the article markdown with fallback models */
async function generateArticle(data: ScrapedData, category: string): Promise<string> {
  console.log(`  → Generating article with Gemini... (${data.sourceType})`);
  
  // Confirmed valid models for THIS specific API key (via ListModels)
  const modelsToTry = [
    'gemini-3.1-pro-preview',
    'gemini-flash-latest',
    'gemini-2.5-pro',
    'gemini-2.0-flash'
  ];
  
  const prompt = buildPrompt(data, category);
  let lastErrorMsg = '';
  
  for (const modelName of modelsToTry) {
    try {
      console.log(`    Trying model: ${modelName}...`);
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

      console.log(`    ✅ Generation successful with: ${modelName}`);
      return text;
    } catch (err: any) {
      lastErrorMsg = err.message;
      
      // If it's a rate limit error (429), just wait and try the next one or wait longer
      if (err.message.includes('429') || err.message.includes('Quota')) {
        console.warn(`    ⚠️ Rate limit on ${modelName}. Waiting 5s...`);
        await new Promise(r => setTimeout(r, 5000));
        continue; // go to next model
      }

      console.warn(`    ⚠️ Model ${modelName} failed: ${lastErrorMsg}`);
      
      if (modelName === modelsToTry[modelsToTry.length - 1]) {
        throw new Error(`All Gemini models failed. Last error: ${lastErrorMsg}`);
      }
      
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  throw new Error('Critical: Exhausted all fallback models without success.');
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
    throw new Error('GEMINI_API_KEY is not set. Add it to your .env.local file.');
  }

  let url: string;
  let category = 'Engineering';

  if (targetUrl) {
    url = targetUrl;
    // Auto-detect category for YouTube links
    category = isYouTubeUrl(url) ? 'Engineering' : 'Tech';
    console.log(`\n▶ Running agent on provided URL: ${url}`);
  } else {
    console.log('\n▶ No URL provided — picking a trending topic from RSS...');
    const trending = await getTrendingUrl();
    if (!trending) throw new Error('Could not find a trending topic from any RSS source.');
    url = trending.url;
    category = trending.category;
    console.log(`  Found trending: ${url} [${category}]`);
  }

  // Scrape content
  const data = isYouTubeUrl(url)
    ? await scrapeYouTube(url)
    : await scrapeArticle(url);

  if (!data?.content) {
    throw new Error(`Failed to extract content from: ${url}`);
  }

  // Generate with Gemini
  const markdown = await generateArticle(data, category);

  // Save to disk
  const titleMatch = markdown.match(/title:\s*"?(.+?)"?\s*\n/);
  const title = titleMatch?.[1] ?? data.title;
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
