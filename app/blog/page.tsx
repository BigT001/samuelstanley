// ─── SERVER COMPONENT — reads real markdown posts from content/blog/ ───────────
// The client filtering/search logic lives in BlogClient below.

import { getAllPosts, type BlogPost } from '@/lib/blog';
import { BlogClient } from './BlogClient';

export const dynamic = 'force-dynamic'; // always re-render so new posts appear instantly

export const metadata = {
  title: 'Stanley’s Log | Samuel Stanley',
  description: 'Engineering insights, latest tech trends, and digital innovation — a source for staying ahead in the tech world.',
  alternates: {
    canonical: 'https://samuelstanley.com/blog',
  },
  openGraph: {
    title: 'Stanley’s Log',
    description: 'Practical technology insights and tech news curated for everyone.',
    url: 'https://samuelstanley.com/blog',
    siteName: 'Samuel Stanley Portfolio',
    type: 'website',
  },
};

export default function BlogPage() {
  // Read from real filesystem
  const posts = getAllPosts();
  return <BlogClient posts={posts} />;
}
