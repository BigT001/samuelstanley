"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useCallback } from "react";
import type { BlogPost } from "@/lib/blog";
import BlogImage from "@/app/components/BlogImage";
import { Starfield } from "../components/Starfield";
import { HireMeSection } from "../components/HireMeSection";

// ─── Category colour map ──────────────────────────────────────────────────────
const CATEGORY_COLORS: Record<string, string> = {
  Innovation:   "#9b7dff",
  AI:           "#6b8cff",
  Nigeria:      "#4ecdc4",
  Business:     "#febc2e",
  Fintech:      "#ff7c5c",
  Finance:      "#febc2e",
  Agriculture:  "#59d976",
  Grants:       "#a78bfa",
  Entertainment:"#ff4d4d",
  Engineering:  "#5cb8ff",
  Tech:         "#ff4d4d",
  Venture:      "#f97316",
};

function accentFor(cat: string) {
  return CATEGORY_COLORS[cat] ?? "#ff4d4d";
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

// ─── Hero Card — full-width editorial ────────────────────────────────────────
function HeroCard({ post }: { post: BlogPost }) {
  const accent = accentFor(post.category);
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <div
        className="relative overflow-hidden rounded-3xl border transition-all duration-500 hover:-translate-y-1"
        style={{
          background: "var(--surface)",
          borderColor: "var(--border)",
          boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
        }}
      >
        {/* Ambient glow */}
        <div
          className="absolute -top-32 -right-32 w-80 h-80 rounded-full opacity-10 blur-3xl pointer-events-none group-hover:opacity-20 transition-opacity duration-500"
          style={{ background: accent }}
        />

        <div className="grid md:grid-cols-[1fr_1.1fr] gap-0">
          {/* Image */}
          <div className="relative overflow-hidden rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none" style={{ minHeight: 300 }}>
            <BlogImage src={post.coverImage || ""} alt={post.title} category={post.category} aspect="aspect-[4/3]" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/30 hidden md:block pointer-events-none" />
            <div className="absolute top-5 left-5 flex gap-2 flex-wrap">
              <span
                className="text-[10px] font-black tracking-[0.15em] uppercase px-3 py-1.5 rounded-full text-white"
                style={{ background: `${accent}dd`, backdropFilter: "blur(6px)" }}
              >
                ★ Editor&apos;s Pick
              </span>
              <span
                className="text-[10px] font-bold tracking-wide uppercase px-3 py-1.5 rounded-full text-white"
                style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)" }}
              >
                {post.category}
              </span>
            </div>
          </div>

          {/* Text */}
          <div className="flex flex-col justify-between p-8 md:p-10 lg:p-12">
            <div>
              <div className="flex items-center gap-3 mb-6 text-xs text-[var(--text-secondary)]">
                <span>{formatDate(post.date)}</span>
                <span>·</span>
                <span>{post.readTime}</span>
              </div>
              <h2
                className="text-2xl md:text-3xl lg:text-[2.2rem] font-extrabold text-[var(--text-primary)] leading-tight tracking-tight mb-5 group-hover:text-[var(--coral)] transition-colors duration-300"
              >
                {post.title}
              </h2>
              <p className="text-sm md:text-base text-[var(--text-secondary)] leading-relaxed mb-8 line-clamp-3">
                {post.excerpt}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {post.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="text-[10px] px-2.5 py-1 rounded-full border border-[var(--border)] text-[var(--text-secondary)]">
                    {tag}
                  </span>
                ))}
              </div>
              <span
                className="flex-shrink-0 ml-4 hidden sm:inline-flex items-center gap-2 text-sm font-bold transition-all duration-200 group-hover:gap-3"
                style={{ color: accent }}
              >
                Read
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </span>
            </div>
          </div>
        </div>

        {/* Bottom underline on hover */}
        <div
          className="absolute bottom-0 left-0 h-[3px] w-0 group-hover:w-full transition-all duration-500 rounded-b-3xl"
          style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
        />
      </div>
    </Link>
  );
}

// ─── Secondary Card ───────────────────────────────────────────────────────────
function SecondaryCard({ post }: { post: BlogPost }) {
  const accent = accentFor(post.category);
  return (
    <Link href={`/blog/${post.slug}`} className="group block h-full">
      <div
        className="relative h-full overflow-hidden rounded-2xl border flex flex-col transition-all duration-300 hover:-translate-y-1"
        style={{ background: "var(--surface)", borderColor: "var(--border)" }}
      >
        {/* Hover top accent */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-2xl"
          style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
        />

        <div className="relative overflow-hidden" style={{ height: 210 }}>
          <BlogImage src={post.coverImage || ""} alt={post.title} category={post.category} aspect="aspect-video" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
          <div className="absolute bottom-3 left-4 right-4 flex justify-between items-center">
            <span
              className="text-[9px] font-bold tracking-wide uppercase px-2.5 py-1 rounded-full text-white"
              style={{ background: `${accent}cc`, backdropFilter: "blur(4px)" }}
            >
              {post.category}
            </span>
            <span className="text-[10px] text-white/70 font-medium">{post.readTime}</span>
          </div>
        </div>

        <div className="p-5 flex flex-col flex-1">
          <h3 className="text-[15px] font-bold text-[var(--text-primary)] mb-2 leading-snug flex-1 group-hover:text-[var(--coral)] transition-colors duration-200 line-clamp-2">
            {post.title}
          </h3>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4 line-clamp-2">{post.excerpt}</p>
          <div className="flex items-center justify-between text-[10px] text-[var(--text-secondary)] mt-auto">
            <span>{formatDate(post.date)}</span>
            <span className="font-bold flex items-center gap-1 group-hover:gap-2 transition-all" style={{ color: accent }}>
              Read
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─── Grid Post Card ───────────────────────────────────────────────────────────
function PostCard({ post, index }: { post: BlogPost; index: number }) {
  const accent = accentFor(post.category);
  return (
    <Link href={`/blog/${post.slug}`} className="group block h-full">
      <article
        className="relative h-full overflow-hidden rounded-2xl border flex flex-col transition-all duration-300 hover:-translate-y-1"
        style={{
          background: "var(--surface)",
          borderColor: "var(--border)",
          transitionDelay: `${(index % 3) * 40}ms`,
        }}
      >
        {/* Hover glow ring */}
        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{ boxShadow: `inset 0 0 0 1px ${accent}55` }}
        />
        <div className="relative flex-shrink-0 overflow-hidden">
          <BlogImage src={post.coverImage || ""} alt={post.title} category={post.category} aspect="aspect-[16/9]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
          <div className="absolute bottom-2.5 left-3">
            <span
              className="text-[9px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full text-white"
              style={{ background: `${accent}cc`, backdropFilter: "blur(4px)" }}
            >
              {post.category}
            </span>
          </div>
        </div>
        <div className="p-4 flex flex-col flex-1">
          <h3 className="text-sm font-bold text-[var(--text-primary)] mb-2 leading-snug flex-1 group-hover:text-[var(--coral)] transition-colors duration-200 line-clamp-2">
            {post.title}
          </h3>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-3 line-clamp-2">{post.excerpt}</p>
          <div className="flex items-center justify-between text-[10px] text-[var(--text-secondary)] mt-auto">
            <span>{formatDate(post.date)}</span>
            <span className="font-semibold" style={{ color: accent }}>{post.readTime}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}

// ─── Category Filter Panel ────────────────────────────────────────────────────
function CategoryFilter({
  categories,
  active,
  onChange,
  counts,
}: {
  categories: string[];
  active: string;
  onChange: (c: string) => void;
  counts: Record<string, number>;
}) {
  const [open, setOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <>
      {/* ── DESKTOP: scrollable horizontal tab bar ── */}
      <div className="hidden md:block relative">
        <div className="absolute right-0 top-0 bottom-0 w-8 pointer-events-none bg-gradient-to-l from-[var(--bg)] to-transparent z-10 rounded-r-lg" />
        <div ref={scrollRef} className="flex gap-2 overflow-x-auto pb-0.5" style={{ scrollbarWidth: "none" }}>
          {categories.map((cat) => {
            const accent = cat === "All" ? "#ff4d4d" : accentFor(cat);
            const isActive = cat === active;
            return (
              <button
                key={cat}
                onClick={() => onChange(cat)}
                className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 border whitespace-nowrap"
                style={
                  isActive
                    ? { background: accent, color: "#fff", borderColor: accent, boxShadow: `0 0 14px ${accent}55` }
                    : { background: "var(--surface)", color: "var(--text-secondary)", borderColor: "var(--border)" }
                }
              >
                {cat}
                {counts[cat] !== undefined && (
                  <span
                    className="text-[9px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center"
                    style={
                      isActive
                        ? { background: "rgba(255,255,255,0.25)", color: "#fff" }
                        : { background: "rgba(136,146,176,0.12)", color: "var(--text-secondary)" }
                    }
                  >
                    {counts[cat]}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── MOBILE: toggle button + dropdown ── */}
      <div className="md:hidden">
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all duration-200 w-full justify-between"
          style={{
            background: "var(--surface)",
            borderColor: open ? "var(--coral)" : "var(--border)",
            color: "var(--text-primary)",
            boxShadow: open ? "0 0 0 3px rgba(255,77,77,0.1)" : "none",
          }}
        >
          <div className="flex items-center gap-2">
            {/* Filter icon */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="16" y2="12" /><line x1="11" y1="18" x2="13" y2="18" />
            </svg>
            <span>
              {active === "All" ? "Filter by Topic" : active}
            </span>
            {active !== "All" && (
              <span
                className="text-[9px] font-black px-1.5 py-0.5 rounded-full text-white"
                style={{ background: accentFor(active) }}
              >
                {counts[active]}
              </span>
            )}
          </div>
          {/* Chevron */}
          <svg
            className="transition-transform duration-300"
            style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>

        {/* Dropdown panel */}
        {open && (
          <div
            className="mt-2 rounded-2xl border p-3 grid grid-cols-2 gap-2"
            style={{ background: "var(--surface)", borderColor: "var(--border)", boxShadow: "0 16px 40px rgba(0,0,0,0.25)" }}
          >
            {categories.map((cat) => {
              const accent = cat === "All" ? "#ff4d4d" : accentFor(cat);
              const isActive = cat === active;
              return (
                <button
                  key={cat}
                  onClick={() => { onChange(cat); setOpen(false); }}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 border"
                  style={
                    isActive
                      ? { background: `${accent}22`, borderColor: accent, color: accent }
                      : { background: "transparent", borderColor: "var(--border)", color: "var(--text-secondary)" }
                  }
                >
                  <span>{cat}</span>
                  <span
                    className="text-[9px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center"
                    style={
                      isActive
                        ? { background: accent, color: "#fff" }
                        : { background: "rgba(136,146,176,0.12)", color: "var(--text-secondary)" }
                    }
                  >
                    {counts[cat] ?? 0}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

// ─── Section Divider ──────────────────────────────────────────────────────────
function SectionDivider({ label, count }: { label: string; count?: number }) {
  return (
    <div className="flex items-center gap-4 mb-8">
      <div className="h-px flex-1" style={{ background: "var(--border)" }} />
      <span className="flex items-center gap-2 text-[11px] font-bold tracking-[0.15em] uppercase text-[var(--text-secondary)]">
        {label}
        {count !== undefined && (
          <span className="text-[9px] font-black px-2 py-0.5 rounded-full" style={{ background: "rgba(136,146,176,0.12)", color: "var(--text-secondary)" }}>
            {count}
          </span>
        )}
      </span>
      <div className="h-px flex-1" style={{ background: "var(--border)" }} />
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyState({ hasSearch }: { hasSearch: boolean }) {
  return (
    <div className="text-center py-28 rounded-3xl border col-span-full" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
      <div className="text-5xl mb-5">{hasSearch ? "🔍" : "✍️"}</div>
      <p className="text-[var(--text-primary)] font-bold text-lg mb-2">
        {hasSearch ? "No articles match." : "Nothing published yet."}
      </p>
      <p className="text-sm text-[var(--text-secondary)]">
        {hasSearch ? "Try a different search or pick another category." : "The AI agent will publish the first post soon."}
      </p>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export function BlogClient({ posts }: { posts: BlogPost[] }) {
  const allCategories = Array.from(new Set(posts.map((p) => p.category)));
  const categories = ["All", ...allCategories];

  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  const filtered = posts.filter((p) => {
    const matchCat = activeCategory === "All" || p.category === activeCategory;
    const q = search.toLowerCase();
    const matchSearch = !q || p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q) || p.tags.some((t) => t.toLowerCase().includes(q));
    return matchCat && matchSearch;
  });

  const counts: Record<string, number> = { All: posts.length };
  allCategories.forEach((cat) => { counts[cat] = posts.filter((p) => p.category === cat).length; });

  const hero = filtered[0] ?? null;
  const secondary = filtered.slice(1, 3);
  const grid = filtered.slice(3);

  const sectionRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.target.classList.toggle("visible", e.isIntersecting)),
      { threshold: 0.05 }
    );
    sectionRef.current?.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [filtered]);

  const handleCategoryChange = useCallback((cat: string) => {
    setActiveCategory(cat);
    setSearch("");
  }, []);

  return (
    <div className="relative min-h-screen">
      <Starfield />

      {/* Nav */}
      <nav className="relative z-10 px-6 pt-6">
        <div className="max-w-6xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--coral)] transition-colors group">
            <svg className="group-hover:-translate-x-1 transition-transform duration-200" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Portfolio
          </Link>
        </div>
      </nav>

      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-10">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <header className="mb-12">

          {/* Title row */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "var(--coral)" }} />
                <span className="text-xs font-bold tracking-widest uppercase text-[var(--text-secondary)]">Personal Blog</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-[var(--text-primary)] tracking-tight leading-none">
                Stanley&apos;s{" "}
                <span style={{ color: "var(--coral)" }}>Log</span>
              </h1>
              <p className="text-base text-[var(--text-secondary)] max-w-lg leading-relaxed mt-4">
                My honest take on tech, business, and what&apos;s actually happening in the Nigerian ecosystem — from a developer&apos;s perspective.
              </p>
            </div>

            {/* Quick stats */}
            <div className="flex gap-6 md:flex-shrink-0 md:pb-1">
              <div className="text-center">
                <div className="text-3xl font-black text-[var(--text-primary)]">{posts.length}</div>
                <div className="text-xs text-[var(--text-secondary)] mt-0.5 font-medium">Articles</div>
              </div>
              <div className="w-px" style={{ background: "var(--border)" }} />
              <div className="text-center">
                <div className="text-3xl font-black text-[var(--text-primary)]">{allCategories.length}</div>
                <div className="text-xs text-[var(--text-secondary)] mt-0.5 font-medium">Topics</div>
              </div>
            </div>
          </div>

          {/* ── Big Search Bar ───────────────────────────────────────────── */}
          <div className="relative mb-5">
            <svg
              className="absolute left-5 top-1/2 -translate-y-1/2 transition-colors duration-200"
              style={{ color: searchFocused ? "var(--coral)" : "var(--text-secondary)" }}
              width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search by title, topic, or keyword…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="w-full rounded-2xl pl-14 pr-14 py-4 text-base text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none transition-all duration-200 border"
              style={{
                background: "var(--surface)",
                borderColor: searchFocused ? "var(--coral)" : "var(--border)",
                boxShadow: searchFocused ? "0 0 0 3px rgba(255,77,77,0.12), 0 4px 20px rgba(0,0,0,0.1)" : "0 2px 12px rgba(0,0,0,0.06)",
              }}
            />
            {search ? (
              <button
                onClick={() => setSearch("")}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--coral)] transition-colors"
                aria-label="Clear search"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12" /></svg>
              </button>
            ) : (
              <div className="absolute right-5 top-1/2 -translate-y-1/2 text-xs text-[var(--text-secondary)] font-medium hidden sm:block opacity-50">
                {filtered.length} result{filtered.length !== 1 ? "s" : ""}
              </div>
            )}
          </div>

          {/* ── Category Filter ──────────────────────────────────────────── */}
          <CategoryFilter
            categories={categories}
            active={activeCategory}
            onChange={handleCategoryChange}
            counts={counts}
          />
        </header>

        {/* ── Content ────────────────────────────────────────────────────── */}
        <div ref={sectionRef}>
          {filtered.length === 0 ? (
            <EmptyState hasSearch={!!search || activeCategory !== "All"} />
          ) : (
            <>
              {/* Hero post */}
              {hero && (
                <section className="mb-8 reveal reveal-up">
                  <HeroCard post={hero} />
                </section>
              )}

              {/* Secondary pair */}
              {secondary.length > 0 && (
                <section className="mb-10">
                  <div className={`grid gap-6 ${secondary.length === 1 ? "md:grid-cols-1 max-w-xl" : "md:grid-cols-2"}`}>
                    {secondary.map((post, i) => (
                      <div key={post.slug} className={`reveal reveal-up reveal-delay-${i + 1}`}>
                        <SecondaryCard post={post} />
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* All posts grid */}
              {grid.length > 0 && (
                <section>
                  <SectionDivider label="All Articles" count={filtered.length} />
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {grid.map((post, i) => (
                      <div key={post.slug} className="reveal reveal-up">
                        <PostCard post={post} index={i} />
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>

        {/* Hire Me section */}
        <div className="mt-20">
          <HireMeSection />
        </div>
      </main>
    </div>
  );
}
