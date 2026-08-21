import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const INSIGHT_DIR = path.join(process.cwd(), 'content', 'insight');

// ─── Types ───────────────────────────────────────────────────────────────────
export interface InsightPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  readTime: string;
  sourceUrl?: string;
  coverImage?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function ensureDir() {
  if (!fs.existsSync(INSIGHT_DIR)) fs.mkdirSync(INSIGHT_DIR, { recursive: true });
}

function parseInsight(fileName: string): InsightPost {
  const slug = fileName.replace(/\.md$/, '');
  const fullPath = path.join(INSIGHT_DIR, fileName);
  const raw = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(raw);

  return {
    slug,
    title:      data.title     ?? 'Untitled',
    date:       data.date      ?? new Date().toISOString(),
    excerpt:    data.excerpt   ?? '',
    category:   data.category  ?? 'Strategy',
    tags:       data.tags      ?? [],
    readTime:   data.readTime  ?? '5 min read',
    sourceUrl:  data.sourceUrl ?? '',
    coverImage: data.coverImage ?? data.image ?? '',
    content,
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────

/** Return all Founder's Insight posts sorted newest-first */
export function getAllInsights(): InsightPost[] {
  ensureDir();
  return fs
    .readdirSync(INSIGHT_DIR)
    .filter((f) => f.endsWith('.md'))
    .map(parseInsight)
    .sort((a, b) => (new Date(a.date) < new Date(b.date) ? 1 : -1));
}

/** Return a single Founder's Insight post by slug, or null if not found */
export function getInsightBySlug(slug: string): InsightPost | null {
  try {
    ensureDir();
    return parseInsight(`${slug}.md`);
  } catch {
    return null;
  }
}
