import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

// ─── Types ───────────────────────────────────────────────────────────────────
export interface BlogPost {
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
  if (!fs.existsSync(BLOG_DIR)) fs.mkdirSync(BLOG_DIR, { recursive: true });
}

function parsePost(fileName: string): BlogPost {
  const slug = fileName.replace(/\.md$/, '');
  const fullPath = path.join(BLOG_DIR, fileName);
  const raw = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(raw);

  return {
    slug,
    title:      data.title     ?? 'Untitled',
    date:       data.date      ?? new Date().toISOString(),
    excerpt:    data.excerpt   ?? '',
    category:   data.category  ?? 'Tech',
    tags:       data.tags      ?? [],
    readTime:   data.readTime  ?? '5 min read',
    sourceUrl:  data.sourceUrl ?? '',
    coverImage: data.coverImage ?? data.image ?? '',
    content,
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────

/** Return all posts sorted newest-first */
export function getAllPosts(): BlogPost[] {
  ensureDir();
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith('.md'))
    .map(parsePost)
    .sort((a, b) => (new Date(a.date) < new Date(b.date) ? 1 : -1));
}

/** Return a single post by slug, or null if not found */
export function getPostBySlug(slug: string): BlogPost | null {
  try {
    ensureDir();
    return parsePost(`${slug}.md`);
  } catch {
    return null;
  }
}
