// Native .env loader for CLI execution
if (!process.env.GEMINI_API_KEY) {
  try {
    const envPath = path.join(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
      for (const line of lines) {
        const parts = line.split('=');
        if (parts.length >= 2) {
          const key = parts[0].trim();
          const val = parts.slice(1).join('=').trim().replace(/^["']|["']$/g, '');
          if (key && !process.env[key]) process.env[key] = val;
        }
      }
    }
  } catch (e) {}
}
import fs from 'fs';
import path from 'path';
import * as cheerio from 'cheerio';
import Parser from 'rss-parser';
import { YoutubeTranscript } from 'youtube-transcript';
import { GoogleGenerativeAI } from '@google/generative-ai';

// ─── Init ────────────────────────────────────────────────────────────────────
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const rssParser = new Parser();
const INSIGHT_DIR = path.join(process.cwd(), 'content', 'insight');
const HISTORY_FILE = path.join(process.cwd(), 'scripts', 'insight-history.json');

// ─── Content Filtering ────────────────────────────────────────────────────────
const NEGATIVE_KEYWORDS = [
  'geopolitical', 'ceasefire', 'war', 'israel', 'iran', 'lebanon', 'hezbollah',
  'military', 'diplomacy', 'nuclear', 'sanctions', 'ministry', 'government',
  'politics', 'election', 'protest', 'governor', 'senate', 'presidency'
];

// ─── News & Strategy Sources ──────────────────────────────────────────────────
const RSS_SOURCES = [
  // NIGERIA & AFRICA STARTUPS, VENTURE, & FINTECH (Primary Focus)
  { url: 'https://techcabal.com/feed/', category: 'Venture' },
  { url: 'https://techpoint.africa/feed/', category: 'Nigeria' },
  { url: 'https://benjamindada.com/feed/', category: 'Fintech' },
  { url: 'https://nairametrics.com/category/tech/feed/', category: 'Fintech' },
  { url: 'https://businessday.ng/category/technology/feed/', category: 'Business' },
  { url: 'https://weetracker.com/feed/', category: 'Venture' },
  { url: 'https://disrupt-africa.com/feed/', category: 'Venture' },
  
  // STRATEGY & GLOBAL BUILDER SOURCES
  { url: 'https://hackernoon.com/feed', category: 'Strategy' },
  { url: 'https://dev.to/feed', category: 'Architecture' },
  
  // TOPIC SEARCHES
  { url: 'https://news.google.com/rss/search?q=africa+startups+funding+strategy', category: 'Venture' },
  { url: 'https://news.google.com/rss/search?q=nigeria+fintech+business+model', category: 'Fintech' },
  { url: 'https://news.google.com/rss/search?q=software+architecture+startup+pivot', category: 'Architecture' }
];

interface ScrapedData {
  title: string;
  url: string;
  content: string;
  image?: string;
  sourceType: 'article' | 'youtube';
}

interface InsightAgentResult {
  slug: string;
  filePath: string;
  title: string;
  message: string;
}

function isYouTubeUrl(url: string): boolean {
  return /(?:youtube\.com\/watch|youtu\.be\/)/.test(url);
}

function extractYouTubeId(url: string): string | null {
  const match = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

async function scrapeArticle(url: string, category: string): Promise<ScrapedData | null> {
  try {
    console.log(`  → Scraping article for Founder's Insight: ${url}`);
    let resp = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' },
      signal: AbortSignal.timeout(12000),
    });

    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    let html = await resp.text();
    let $ = cheerio.load(html);

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

    let image = $('meta[property="og:image"]').attr('content') || 
                $('meta[name="twitter:image"]').attr('content');

    const isGeneric = !image || image.length < 25 || image.includes('gstatic') || image.includes('favicon');
    
    if (isGeneric) {
      const pools: Record<string, string[]> = {
        'Strategy': ['1460925895917-afdab827c52f', '1504384308090-c564bd4668a3', '1553484771-3710605d0b92'],
        'Venture': ['1552664730-d307ca884978', '1454165833467-cd356ed9942e', '1460925895917-afdab827c52f'],
        'Fintech': ['1551288049-bebda4e38f71', '1563986768609-322da13575f3', '1526304640581-d334cd06f69d'],
        'Architecture': ['1555066931-4365d14bab8c', '1517694712282-14f494bc6f0e', '1498050108023-c5249f4df085'],
        'Nigeria': ['1550005810-ca9161a0215a', '1520110120302-851250430b42', '1611273298532-a31c62b0f89d']
      };
      const pool = pools[category] || pools['Strategy'];
      const photoId = pool[Math.floor(Math.random() * pool.length)];
      image = `https://images.unsplash.com/photo-${photoId}?q=80&w=1200&auto=format&fit=crop`;
    }

    $('script, style, iframe, nav, footer, header, aside, .ad').remove();
    const title = $('h1').first().text().trim() || $('title').text().trim();
    const content = $('article, main, .post-content, .article-body').text() || $('body').text();
    const cleaned = content.replace(/\s+/g, ' ').replace(/\n+/g, ' ').trim().slice(0, 4000);

    if (!cleaned || cleaned.length < 300) return null;
    return { title, url: resp.url, content: cleaned, image, sourceType: 'article' };
  } catch (err) {
    console.error(`  ✗ Failed to scrape ${url}:`, err);
    return null;
  }
}

async function scrapeYouTube(url: string): Promise<ScrapedData | null> {
  try {
    const videoId = extractYouTubeId(url);
    if (!videoId) throw new Error('Could not extract YouTube ID');
    console.log(`  → Fetching YouTube transcript for video: ${videoId}`);

    const segments = await YoutubeTranscript.fetchTranscript(videoId);
    if (!segments || segments.length === 0) throw new Error('Transcript is empty');

    const rawTranscript = segments.map((s) => s.text).join(' ');
    const title = `YouTube Strategy TearDown — ${videoId}`;
    const content = rawTranscript.slice(0, 12000);
    const image = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

    return { title, url, content, image, sourceType: 'youtube' };
  } catch (err) {
    console.error(`  ✗ YouTube scrape failed for ${url}:`, err);
    return null;
  }
}

function getSourceHistory(): string[] {
  try {
    if (fs.existsSync(HISTORY_FILE)) {
      const data = JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf-8'));
      return Array.isArray(data) ? data : [];
    }
  } catch (e) {}
  return [];
}

function saveSourceToHistory(url: string) {
  try {
    const history = getSourceHistory();
    const domain = new URL(url).hostname;
    const newHistory = [domain, ...history].slice(0, 15);
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(newHistory, null, 2));
  } catch (e) {}
}

async function getTrendingUrl(): Promise<{ url: string; category: string } | null> {
  const history = getSourceHistory();
  const shuffledSources = [...RSS_SOURCES].sort(() => Math.random() - 0.5);
  
  for (const source of shuffledSources) {
    const domain = new URL(source.url).hostname;
    if (history.includes(domain) && Math.random() > 0.2) continue;

    try {
      console.log(`  → Fetching Founder's Insight feed: ${source.url}`);
      const feed = await rssParser.parseURL(source.url);
      if (!feed.items?.length) continue;

      const validItems = feed.items.filter(item => {
        const text = (item.title + ' ' + (item.contentSnippet || '')).toLowerCase();
        return !NEGATIVE_KEYWORDS.some(word => text.includes(word));
      });

      if (!validItems.length) continue;

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

function buildPrompt(data: ScrapedData, category: string): string {
  const isYT = data.sourceType === 'youtube';
  const sourceNote = isYT ? `Practical insight derived from video: ${data.url}` : `Practical insight derived from: ${data.url}`;
  const today = new Date().toISOString();
  const tags = JSON.stringify([category, 'Founder Advice', 'Startup Playbook', 'Growth Strategy']);

  return `
You are **FOUNDERS ADVISOR** — a battle-tested strategic advisor to startup founders, executives, operators, and ambitious builders.

YOUR PURPOSE:
You do NOT write generic news articles, news summaries, or corporate blog posts. 
Your objective is to give founders **actionable strategic advice, practical execution playbooks, startup ideas, growth tips, and decision-making frameworks** to help them build, scale, and navigate complex business challenges.

${sourceNote}

${isYT ? `Raw Case Study Context:` : `Case Study / Topic Context:`}
${data.content}

================================================================================
FOUNDERS ADVISOR — STRATEGIC ADVICE & PLAYBOOK SYSTEM
================================================================================

1. ROLE & IDENTITY:
- Voice: Direct, highly practical, battle-tested, sharp, encouraging yet realistic, witty, never fluff, never academic, never corporate PR.
- Frame of Mind: "An experienced founder/advisor sitting down with another founder to solve a pressing startup execution problem over coffee."

2. THE 7 STRATEGIC ADVISORY PILLARS:
- MARKET: Identifying real customer pain, TAM calculation, timing, and distribution control.
- PRODUCT: Finding product-market fit, pain frequency, eliminating useless features, triggers for switching.
- BUSINESS MODEL: Unit economics (CAC vs LTV), cash flow velocity, retention loops, pricing power.
- COMPETITION: Moats that actually work (network effects, switching costs, distribution control vs fake moats).
- DISTRIBUTION: Scalable customer acquisition, viral mechanics, B2B sales playbooks, WhatsApp/mobile-first tactics.
- OPERATIONS: Hiring first 10 core employees, managing runway, engineering velocity, delegation.
- TECHNOLOGY: Pragmatic tech stack choices, buy vs build, avoiding premature optimization.

3. WRITING STYLE & FORMAT:
- Make the title a clear, compelling Founder Guide / Playbook (e.g. "How to Validate a B2B Startup Idea in 14 Days", "The Unit Economics Playbook for Early-Stage Fintechs", "Why Your First 100 Customers Must Be Acquired Manually").
- Include hyper-local builder context where appropriate (e.g., African tech realities, WhatsApp-first sales, Gbagada workstations, Akure developer hustle, bootstrapping vs VC runway).
- Strictly NO AI BUZZWORDS: "In conclusion", "delve", "multifaceted", "testament", "nuanced", "paradigm shift", "vital role", "landscape", "beacon".

4. REQUIRED ARTICLE STRUCTURE:
Your article must follow this practical founder guide layout:
- ## The Core Strategic Dilemma
- ## What Most Founders Get Wrong (The Hidden Assumption)
- ## First-Principles Strategic Framework
- ## The Step-by-Step Execution Playbook
- ## Metrics That Actually Matter
- ## Founder's Bottom Line & Action Plan

================================================================================
OUTPUT FORMAT (MUST USE EXACT FRONTMATTER):
================================================================================
---
title: "[Compelling Founder Playbook / Strategic Guide Title]"
date: "${today}"
excerpt: "[1-2 sentence practical hook explaining what the founder will learn and execute.]"
category: "${category}"
tags: ${tags}
image: "${data.image || 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200&auto=format&fit=crop'}"
readTime: "[X min read]"
sourceUrl: "${data.url}"
---

[Write the full, deeply practical Founders Advisor Guide here in Markdown. Include 2-3 inline stock images from below where natural using: ![Description](url)]

STOCK IMAGE POOL:
- https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200&auto=format&fit=crop (Team Strategy Session)
- https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop (Growth Charts)
- https://images.unsplash.com/photo-1517694712282-14f494bc6f0e?q=80&w=1200&auto=format&fit=crop (Coding / Execution)
- https://images.unsplash.com/photo-1550005810-ca9161a0215a?q=80&w=1200&auto=format&fit=crop (Nigeria / African Hustle)
- https://images.unsplash.com/photo-1526304640581-d334cd06f69d?q=80&w=1200&auto=format&fit=crop (Finance & Revenue)
`;
}

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

      if (text.trimStart().startsWith('```')) {
        const lines = text.split('\n');
        if (lines[0].startsWith('```')) lines.shift();
        if (lines[lines.length - 1].trim() === '```') lines.pop();
        text = lines.join('\n');
      }
      return text;
    } catch (err: any) {
      const isRetryable = err.message.includes('429') || err.message.includes('503') || err.message.includes('Quota');
      if (isRetryable && attempt < maxRetries - 1) {
        const delay = initialDelay * Math.pow(2, attempt);
        console.warn(`    ⚠️ ${modelName} limit hit. Retrying in ${delay/1000}s...`);
        await new Promise(r => setTimeout(r, delay));
        attempt++;
        continue;
      }
      throw err;
    }
  }
  throw new Error(`Model ${modelName} failed after ${maxRetries} attempts`);
}

async function generateInsight(data: ScrapedData, category: string): Promise<string> {
  console.log(`  → Generating Founder's Insight post with Gemini... (${data.sourceType})`);
  
  const modelsToTry = [
    'gemini-flash-latest',
    'gemini-2.5-flash',
    'gemini-flash-lite-latest',
    'gemini-2.5-flash-latest',
    'gemini-1.5-pro'
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
      console.warn(`    ⚠️ ${modelName} fallback failed: ${lastErrorMsg}`);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  throw new Error(`Critical: Exhausted models. Last error: ${lastErrorMsg}`);
}

function saveInsight(title: string, markdown: string): InsightAgentResult {
  if (!fs.existsSync(INSIGHT_DIR)) {
    fs.mkdirSync(INSIGHT_DIR, { recursive: true });
  }

  const safeTitle = title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 50)
    .replace(/-+$/, '');
  const dateStr = new Date().toISOString().split('T')[0];
  const slug = `${dateStr}-${safeTitle}`;
  const filePath = path.join(INSIGHT_DIR, `${slug}.md`);

  fs.writeFileSync(filePath, markdown, 'utf-8');
  console.log(`  ✅ Saved Founder's Insight: ${filePath}`);
  return { slug, filePath, title, message: 'Success' };
}

export async function runInsightAgent(targetUrl?: string): Promise<InsightAgentResult> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not set. Add it to your .env file.');
  }

  let finalData: ScrapedData | null = null;
  let finalCategory = 'Strategy';
  let retries = 5;

  if (targetUrl) {
    const url = targetUrl;
    finalCategory = isYouTubeUrl(url) ? 'Strategy' : 'Venture';
    console.log(`\n▶ Running Founder's Insight agent on URL: ${url}`);
    finalData = isYouTubeUrl(url) ? await scrapeYouTube(url) : await scrapeArticle(url, finalCategory);
    if (!finalData?.content) throw new Error(`Failed to extract content from: ${url}`);
  } else {
    console.log('\n▶ Random mode — picking trending startup topic for Founder\'s Insight...');
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
        break;
      }
      
      retries--;
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  if (!finalData?.content) {
    throw new Error('Could not extract content from any trending sources after multiple attempts.');
  }

  const markdown = await generateInsight(finalData, finalCategory);
  const titleMatch = markdown.match(/title:\s*"?(.+?)"?\s*\n/);
  const title = titleMatch?.[1] ?? (finalData ? finalData.title : 'Untitled');
  return saveInsight(title, markdown);
}

if (process.env.AGENT_CLI === 'true') {
  const urlArg = process.argv[2];
  console.log('Founder\'s Insight AI Agent — Starting...');
  runInsightAgent(urlArg)
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
