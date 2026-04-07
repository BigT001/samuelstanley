import { getPostBySlug, getAllPosts, type BlogPost } from "@/lib/blog";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { marked } from "marked";
import { HireMeSection } from "@/app/components/HireMeSection";
import { Starfield } from "@/app/components/Starfield";
import { ClientReveal } from "@/app/components/ClientReveal";

// ─── Static Params ────────────────────────────────────────────────────────────
export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

// ─── Metadata ─────────────────────────────────────────────────────────────────
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://samuelstanley.com';
  const url = `${siteUrl}/blog/${slug}`;
  const ogImage = `${siteUrl}/api/og?title=${encodeURIComponent(post.title)}&category=${encodeURIComponent(post.category)}`;

  return {
    title: `${post.title} | Stanley’s Log`,
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
      authors: ['Samuel Stanley'],
      tags: post.tags,
      images: [{ url: ogImage, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [ogImage],
    },
  };
}

// ─── Category colour ─────────────────────────────────────────────────────────
const CATEGORY_COLORS: Record<string, string> = {
  AI: "#9b7dff", Engineering: "#6b8cff", Nigeria: "#4ecdc4",
  Business: "#febc2e", Career: "#ff7c5c", DevOps: "#ff7c5c",
  TypeScript: "#5cb8ff", Tech: "#ff4d4d",
};
function accentFor(cat: string) { return CATEGORY_COLORS[cat] ?? "#ff4d4d"; }

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const accent = accentFor(post.category);
  const contentHtml = await marked.parse(post.content ?? "");

  // Related posts: same category, different slug
  const related = getAllPosts()
    .filter((p) => p.slug !== slug && p.category === post.category)
    .slice(0, 2);

  return (
    <div className="relative min-h-screen" style={{ background: "var(--bg)" }}>
      <Starfield />
      <ClientReveal />

      {/* Subtle glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] pointer-events-none opacity-10 blur-3xl" style={{ background: accent }} />

      {/* Nav */}
      <nav className="relative z-10 px-6 pt-6 pb-2">
        <div className="max-w-3xl mx-auto">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--coral)] transition-colors duration-200 group">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-0.5 transition-transform">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Blog
          </Link>
        </div>
      </nav>

      {/* Article */}
      <article className="relative z-10 max-w-3xl mx-auto px-6 py-10">
        {/* Header */}
        <header className="mb-10">
          <div className="flex flex-wrap items-center gap-2.5 mb-6">
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full" style={{ background: `${accent}20`, color: accent }}>
              {post.category}
            </span>
            <span className="text-xs text-[var(--text-secondary)]">
              {new Date(post.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
            </span>
            <span className="text-xs text-[var(--text-secondary)]">· {post.readTime}</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold text-[var(--text-primary)] leading-tight tracking-tight mb-6">
            {post.title}
          </h1>

          <p className="text-lg text-[var(--text-secondary)] leading-relaxed border-l-2 pl-5 py-0.5 italic mb-6" style={{ borderColor: accent }}>
            {post.excerpt}
          </p>

          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className="text-xs px-2.5 py-1 rounded-full border border-[var(--border)] text-[var(--text-secondary)]">{tag}</span>
            ))}
          </div>
        </header>

        {post.coverImage && (
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl mb-12 border border-[var(--border)] shadow-xl shadow-black/20">
            <img 
              src={post.coverImage} 
              alt={post.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>
        )}

        {/* Divider */}
        <div className="w-full h-px mb-10 opacity-40" style={{ background: `linear-gradient(to right, ${accent}, transparent)` }} />

        {/* Markdown content */}
        <div
          className="blog-prose"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />

        {/* Source attribution */}
        {post.sourceUrl && (
          <div className="mt-8 p-4 rounded-xl border border-[var(--border)] text-sm text-[var(--text-secondary)]" style={{ background: "var(--surface)" }}>
            📰 Originally sourced from:{" "}
            <a href={post.sourceUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--coral)] underline underline-offset-2 transition-colors break-all">
              {post.sourceUrl}
            </a>
          </div>
        )}

        {/* Related Posts */}
        {related.length > 0 && (
          <section className="mt-8 pt-8 border-t border-[var(--border)] opacity-80">
            <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4">Related from {post.category}</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {related.map((rp) => {
                const rAccent = accentFor(rp.category);
                return (
                  <Link key={rp.slug} href={`/blog/${rp.slug}`} className="group block p-4 rounded-xl border border-[var(--border)] hover:border-[var(--coral)] transition-all duration-200 hover:-translate-y-0.5" style={{ background: "var(--surface)" }}>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-2 inline-block" style={{ background: `${rAccent}20`, color: rAccent }}>{rp.category}</span>
                    <h3 className="text-xs font-semibold text-[var(--text-primary)] group-hover:text-[var(--coral)] transition-colors leading-snug line-clamp-2">{rp.title}</h3>
                    <div className="flex items-center justify-between mt-2.5">
                      <span className="text-[9px] text-[var(--text-secondary)]">{rp.readTime}</span>
                      <span className="text-[9px] text-[var(--coral)] font-bold group-hover:translate-x-1 transition-transform">Read →</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        <div className="w-full h-px my-10 bg-[var(--border)] opacity-20" />

        {/* Hire Me / Footer */}
        <div className="max-w-3xl mx-auto">
          <HireMeSection />
        </div>
      </article>

      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": post.title,
            "description": post.excerpt,
            "image": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://samuelstanley.com'}/api/og?title=${encodeURIComponent(post.title)}`,
            "datePublished": post.date,
            "author": {
              "@type": "Person",
              "name": "Samuel Stanley",
              "url": "https://samuelstanley.com"
            },
            "publisher": {
              "@type": "Organization",
              "name": "Samuel Stanley",
              "logo": {
                "@type": "ImageObject",
                "url": "https://samuelstanley.com/logo.png"
              }
            },
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://samuelstanley.com'}/blog/${slug}`
            }
          })
        }}
      />
    </div>
  );
}
