import { getInsightBySlug, getAllInsights, type InsightPost } from "@/lib/insight";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { marked } from "marked";
import { Starfield } from "@/app/components/Starfield";
import { ClientReveal } from "@/app/components/ClientReveal";

// ─── Static Params ────────────────────────────────────────────────────────────
export async function generateStaticParams() {
  return getAllInsights().map((post) => ({ slug: post.slug }));
}

// ─── Metadata ─────────────────────────────────────────────────────────────────
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getInsightBySlug(slug);
  if (!post) return {};
  
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://samuelstanley.com';
  const url = `${siteUrl}/insight/${slug}`;

  return {
    title: `${post.title} | Founder's Insight`,
    description: post.excerpt,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: url,
      type: 'article',
      publishedTime: post.date,
      authors: ['Founders Insight'],
      tags: post.tags,
    },
  };
}

// ─── Category colour ─────────────────────────────────────────────────────────
const CATEGORY_COLORS: Record<string, string> = {
  Strategy: "#f59e0b", Venture: "#10b981", Fintech: "#3b82f6",
  Architecture: "#ec4899", Nigeria: "#06b6d4", Business: "#8b5cf6",
};
function accentFor(cat: string) { return CATEGORY_COLORS[cat] ?? "#f59e0b"; }

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function InsightPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getInsightBySlug(slug);
  if (!post) notFound();

  const accent = accentFor(post.category);

  // Custom renderer for marked
  const renderer = new marked.Renderer();
  renderer.image = ({ href, title, text }) => {
    return `
      <div class="my-8 relative group bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-lg">
        <img 
          src="${href}" 
          alt="${text}" 
          title="${title || ''}"
          onerror="this.closest('div').style.display='none';" 
          class="w-full h-auto object-cover block"
          loading="lazy"
        />
        ${text ? `<p class="text-center text-xs text-[var(--text-secondary)] py-2 border-t border-[var(--border)] bg-black/20">${text}</p>` : ''}
      </div>
    `;
  };

  const htmlContent = marked.parse(post.content, { renderer }) as string;
  const allInsights = getAllInsights();
  const relatedInsights = allInsights.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)] transition-colors duration-300 relative selection:bg-amber-500/20 selection:text-amber-300">
      <Starfield />
      <ClientReveal />

      {/* Reading Progress Indicator */}
      <div className="fixed top-0 left-0 w-full h-1 z-50 bg-black/10 dark:bg-white/5">
        <div 
          className="h-full transition-all duration-150"
          style={{ backgroundColor: accent, width: "100%" }}
        />
      </div>

      <main className="max-w-4xl mx-auto px-5 py-12 md:py-20 relative z-10 space-y-12">
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Link 
            href="/?tab=insight" 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--coral)] transition-all"
          >
            ← Back to Founder's Insight
          </Link>
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[var(--text-secondary)]">
            Founders Insight Strategic Teardown
          </span>
        </div>

        {/* Article Header */}
        <header className="space-y-6 text-center md:text-left border-b border-[var(--border)] pb-10">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
            <span 
              className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border shadow-sm"
              style={{ color: accent, borderColor: `${accent}40`, backgroundColor: `${accent}15` }}
            >
              {post.category}
            </span>
            <span className="text-xs text-[var(--text-secondary)] font-mono">• {post.readTime}</span>
            <span className="text-xs text-[var(--text-secondary)] font-mono">• {new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight text-[var(--text-primary)]">
            {post.title}
          </h1>

          <p className="text-base md:text-xl text-[var(--text-secondary)] leading-relaxed max-w-3xl">
            {post.excerpt}
          </p>

          {post.coverImage && (
            <div className="mt-8 rounded-3xl overflow-hidden border border-[var(--border)] shadow-2xl max-h-[450px]">
              <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
            </div>
          )}
        </header>

        {/* Article Content */}
        <article 
          className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-black prose-headings:tracking-tight prose-a:text-amber-400 prose-img:rounded-2xl"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />

        {/* Source attribution if available */}
        {post.sourceUrl && (
          <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-secondary)]">Primary Intelligence Source</span>
            <p className="text-xs text-[var(--text-primary)] font-bold truncate">
              <a href={post.sourceUrl} target="_blank" rel="noopener noreferrer" className="hover:underline text-amber-400">
                {post.sourceUrl} ↗
              </a>
            </p>
          </div>
        )}

        {/* Related Insights */}
        {relatedInsights.length > 0 && (
          <section className="pt-12 border-t border-[var(--border)] space-y-6">
            <h3 className="text-xl font-black tracking-tight">More Founder's Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {relatedInsights.map((ri) => (
                <Link
                  key={ri.slug}
                  href={`/insight/${ri.slug}`}
                  className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--coral)] transition-all space-y-2 flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-amber-400">{ri.category}</span>
                    <h4 className="font-extrabold text-sm line-clamp-2">{ri.title}</h4>
                  </div>
                  <span className="text-[10px] font-bold text-[var(--text-secondary)]">Read Breakdown →</span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
