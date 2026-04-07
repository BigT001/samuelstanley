"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { BlogPost } from "@/lib/blog";
import { Starfield } from "../components/Starfield";
import { HireMeSection } from "../components/HireMeSection";

// ─── Category colour map ──────────────────────────────────────────────────────
const CATEGORY_COLORS: Record<string, string> = {
  AI:          "#9b7dff",
  Engineering: "#6b8cff",
  Nigeria:     "#4ecdc4",
  Business:    "#febc2e",
  Career:      "#ff7c5c",
  DevOps:      "#ff7c5c",
  TypeScript:  "#5cb8ff",
  Tech:        "#ff4d4d",
};

function accentFor(category: string): string {
  return CATEGORY_COLORS[category] ?? "#ff4d4d";
}

// ─── Category Pill ────────────────────────────────────────────────────────────
function CategoryPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={active ? { background: "var(--coral)", color: "#fff", borderColor: "var(--coral)" } : {}}
      className="px-4 py-1.5 rounded-full text-sm font-medium border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all duration-200"
    >
      {label}
    </button>
  );
}

// ─── Featured Card ────────────────────────────────────────────────────────────
function FeaturedCard({ post }: { post: BlogPost }) {
  const accent = accentFor(post.category);
  return (
    <Link href={`/blog/${post.slug}`} className="group block h-full">
      <div
        className="relative h-full overflow-hidden rounded-2xl p-8 md:p-10 transition-all duration-300 hover:-translate-y-1 border border-[var(--border)]"
        style={{ background: "var(--surface)", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}
      >
        <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full opacity-10 blur-3xl pointer-events-none group-hover:opacity-20 transition-opacity duration-300" style={{ background: accent }} />

        <span className="inline-block text-[10px] font-bold tracking-[0.18em] uppercase px-3 py-1 rounded-full mb-5" style={{ background: `${accent}22`, color: accent }}>
          ★ Featured
        </span>

        <div className="flex flex-wrap gap-2 items-center mb-4">
          <span className="text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full" style={{ background: `${accent}20`, color: accent }}>
            {post.category}
          </span>
          <span className="text-xs text-[var(--text-secondary)]">
            {new Date(post.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
          </span>
          <span className="text-xs text-[var(--text-secondary)]">· {post.readTime}</span>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-3 leading-tight group-hover:text-[var(--coral)] transition-colors duration-200">
          {post.title}
        </h2>

        <p className="text-[var(--text-secondary)] leading-relaxed mb-6 max-w-2xl">{post.excerpt}</p>

        <div className="flex flex-wrap gap-2 mb-6">
          {post.tags.map((tag) => (
            <span key={tag} className="text-xs px-2.5 py-1 rounded-full border border-[var(--border)] text-[var(--text-secondary)]">{tag}</span>
          ))}
        </div>

        <span className="inline-flex items-center gap-2 text-sm font-semibold transition-all duration-200 group-hover:gap-3" style={{ color: accent }}>
          Read article
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
        </span>
      </div>
    </Link>
  );
}

// ─── Regular Post Card ────────────────────────────────────────────────────────
function PostCard({ post }: { post: BlogPost }) {
  const accent = accentFor(post.category);
  return (
    <Link href={`/blog/${post.slug}`} className="group block h-full">
      <div
        className="relative h-full overflow-hidden rounded-2xl p-6 flex flex-col transition-all duration-300 hover:-translate-y-1 border border-[var(--border)] hover:border-[var(--coral)]"
        style={{ background: "var(--surface)", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}
      >
        <div className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-2xl" style={{ background: `linear-gradient(to right, transparent, ${accent}, transparent)` }} />

        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full" style={{ background: `${accent}18`, color: accent }}>{post.category}</span>
        </div>

        <h3 className="text-base font-bold text-[var(--text-primary)] mb-2 leading-snug flex-1 group-hover:text-[var(--coral)] transition-colors duration-200">
          {post.title}
        </h3>

        <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-5 line-clamp-3">{post.excerpt}</p>

        <div className="flex flex-wrap gap-1.5 mb-5">
          {post.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-[11px] px-2 py-0.5 rounded-full border border-[var(--border)] text-[var(--text-secondary)]">{tag}</span>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between text-xs text-[var(--text-secondary)]">
          <span>{new Date(post.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
          <span className="font-semibold flex items-center gap-1 group-hover:gap-2 transition-all" style={{ color: accent }}>
            {post.readTime}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </span>
        </div>
      </div>
    </Link>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyState({ hasSearch }: { hasSearch: boolean }) {
  return (
    <div className="text-center py-24 rounded-2xl border border-[var(--border)]" style={{ background: "var(--surface)" }}>
      <div className="text-4xl mb-4">{hasSearch ? "🔍" : "✍️"}</div>
      <p className="text-[var(--text-secondary)] mb-2 font-medium">
        {hasSearch ? "No articles match your search." : "No articles published yet."}
      </p>
      <p className="text-sm text-[var(--text-secondary)]">
        {hasSearch ? "Try a different search or category." : "The AI agent will publish the first post soon."}
      </p>
    </div>
  );
}

// ─── Main Client Component ────────────────────────────────────────────────────
export function BlogClient({ posts }: { posts: BlogPost[] }) {
  const categories = ["All", ...Array.from(new Set(posts.map((p) => p.category)))];
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = posts.filter((p) => {
    const matchesCategory = activeCategory === "All" || p.category === activeCategory;
    const q = search.toLowerCase();
    const matchesSearch = !q || p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q) || p.tags.some((t) => t.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });

  // The first 2 results are "featured", the rest go in the grid
  const featured = filtered.slice(0, 2);
  const rest = filtered.slice(2);

  const sectionRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.target.classList.toggle("visible", e.isIntersecting)),
      { threshold: 0.05 }
    );
    sectionRef.current?.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [filtered]);

  return (
    <div className="relative min-h-screen">
      <Starfield />

      {/* Back nav */}
      <nav className="relative z-10 px-6 pt-6">
        <div className="max-w-6xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--coral)] transition-colors duration-200">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
            Back to Portfolio
          </Link>
        </div>
      </nav>

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="mb-14">
          <h1 className="text-4xl md:text-6xl font-extrabold text-[var(--text-primary)] tracking-tight leading-none mb-4">
            Stanley’s <span style={{ color: "var(--coral)" }}>Log</span>
          </h1>
          <p className="text-lg text-[var(--text-secondary)] max-w-xl leading-relaxed">
            Latest insights into high-performance technology, digital innovation, and the evolving tech landscape — curated for anyone curious about building the future.
          </p>
        </header>

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <div className="relative flex-1">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search articles…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-[var(--border)] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-[var(--coral)] transition-colors"
              style={{ background: "var(--surface)" }}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <CategoryPill key={cat} label={cat} active={cat === activeCategory} onClick={() => setActiveCategory(cat)} />
            ))}
          </div>
        </div>

        <div ref={sectionRef}>
          {filtered.length === 0 ? (
            <EmptyState hasSearch={!!search || activeCategory !== "All"} />
          ) : (
            <>
              {/* Featured grid */}
              {featured.length > 0 && (
                <section className="mb-12">
                  <div className="grid md:grid-cols-2 gap-6">
                    {featured.map((post) => (
                      <div key={post.slug} className="reveal reveal-up"><FeaturedCard post={post} /></div>
                    ))}
                  </div>
                </section>
              )}

              {/* Divider */}
              {rest.length > 0 && (
                <div className="flex items-center gap-4 mb-10 reveal reveal-up">
                  <div className="h-px flex-1 bg-[var(--border)]" />
                  <span className="text-xs text-[var(--text-secondary)] font-medium tracking-wider uppercase">All Articles</span>
                  <div className="h-px flex-1 bg-[var(--border)]" />
                </div>
              )}

              {/* Regular grid */}
              {rest.length > 0 && (
                <section>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rest.map((post) => (
                      <div key={post.slug} className="reveal reveal-up"><PostCard post={post} /></div>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>

        {/* Hire Me Footer */}
        <div className="mt-10">
          <HireMeSection />
        </div>
      </main>
    </div>
  );
}
