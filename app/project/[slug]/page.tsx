"use client";

import { use, useState, useEffect, useRef } from "react";
import { notFound } from "next/navigation";
import { projects } from "../../components/data";
import Link from "next/link";
import { ContactModal } from "../../components/ui";
import { Starfield } from "../../components/Starfield";
import { marked } from "marked";
import { 
  GitBranch, 
  Star, 
  GitFork, 
  ExternalLink, 
  Terminal, 
  BookOpen, 
  Sparkles,
  Layers,
  Flame,
  CheckCircle2
} from "lucide-react";

export default function ProjectCaseStudy({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const [showModal, setShowModal] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [mounted, setMounted] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);

  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [readmeHtml, setReadmeHtml] = useState<string>("");
  const [fetchingReadme, setFetchingReadme] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<"overview" | "dashboard" | "architecture">("overview");

  // Fetch README from GitHub for dynamically loaded repos
  useEffect(() => {
    if (!project || !project.isGithub) return;

    setFetchingReadme(true);
    const slug = project.slug;

    const fetchReadme = async () => {
      try {
        let text = "";
        // Try main branch first
        let res = await fetch(`https://raw.githubusercontent.com/BigT001/${slug}/main/README.md`);
        if (!res.ok) {
          // Try master branch fallback
          res = await fetch(`https://raw.githubusercontent.com/BigT001/${slug}/master/README.md`);
        }

        if (res.ok) {
          text = await res.text();
          // Remove potential YAML frontmatter if present
          if (text.startsWith("---")) {
            const endIdx = text.indexOf("---", 3);
            if (endIdx !== -1) {
              text = text.substring(endIdx + 3).trim();
            }
          }
          const html = await marked.parse(text);
          setReadmeHtml(html);
        } else {
          setReadmeHtml("");
        }
      } catch (e) {
        console.error("Error fetching README:", e);
        setReadmeHtml("");
      } finally {
        setFetchingReadme(false);
      }
    };

    fetchReadme();
  }, [project]);

  // Initialize and load metrics from Database + static fallback
  useEffect(() => {
    const savedTheme =
      (localStorage.getItem("theme") as "dark" | "light") || "dark";
    setTheme(savedTheme);
    setMounted(true);

    const slug = resolvedParams.slug;
    const staticProject = projects.find((p) => p.slug === slug);
    if (staticProject) {
      setProject(staticProject);
    }

    // Fetch live GitHub projects from database to override or resolve
    fetch("/api/github/projects")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.projects) {
          const dbProj = data.projects.find((p: any) => p.repoName === slug);
          if (dbProj) {
            const mapped = {
              title: dbProj.displayTitle || dbProj.repoName.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()),
              slug: dbProj.repoName,
              tag: dbProj.statusLabel ? `${dbProj.statusLabel}` : (dbProj.language || "GitHub Repo"),
              desc: dbProj.displayDesc || `${dbProj.fullName} — ${dbProj.stars} ⭐ · ${dbProj.forks} 🍴`,
              tech: dbProj.displayTags?.length ? dbProj.displayTags : (dbProj.language ? [dbProj.language] : []),
              color: "#6b8cff",
              link: dbProj.homepage || dbProj.repoUrl || "#",
              repo: dbProj.repoUrl || "#",
              status: dbProj.statusLabel || "Live",
              stars: dbProj.stars,
              forks: dbProj.forks,
              lastPushedAt: dbProj.lastPushedAt,
              isGithub: true,
            };
            setProject(mapped);
          } else if (!staticProject) {
            setLoading(false);
          }
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [resolvedParams.slug]);

  useEffect(() => {
    if (!mounted) return;
    if (theme === "light") {
      document.documentElement.classList.add("light-mode");
    } else {
      document.documentElement.classList.remove("light-mode");
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme((prev) => {
      const nextTheme = prev === "dark" ? "light" : "dark";
      localStorage.setItem("theme", nextTheme);
      return nextTheme;
    });
  };

  // Optimized Progress Indicator
  useEffect(() => {
    let ticking = false;
    const updateProgress = () => {
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress =
        scrollHeight > 0 ? (window.scrollY / scrollHeight) * 100 : 0;
      if (progressRef.current) progressRef.current.style.width = `${progress}%`;
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateProgress);
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Intersection Observer for Reveal Animations
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    if (!els.length) return;
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
          } else {
            e.target.classList.remove("visible");
          }
        }),
      { threshold: 0, rootMargin: "100px" },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [project]);

  if (loading && !project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] text-[var(--text-secondary)]">
        <div className="text-xs font-mono tracking-widest uppercase animate-pulse">
          Loading case study data...
        </div>
      </div>
    );
  }

  if (!loading && !project) {
    notFound();
  }

  return (
    <div className="relative min-h-screen transition-colors duration-300">
      <Starfield />
      
      <ContactModal isOpen={showModal} onClose={() => setShowModal(false)} />

      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 z-[1000] bg-transparent">
        <div
          ref={progressRef}
          className="h-full bg-accent shadow-[0_0_15px_rgba(var(--accent),0.6)] transition-all ease-linear"
        />
      </div>

      {/* Navigation - no border, no header feel */}
      <nav className="fixed top-0 left-0 w-full z-50 px-6 py-4 md:px-10 md:py-6 flex justify-between items-center">
        <Link
          href="/?tab=projects"
          className="group relative px-6 py-3 rounded-full bg-surface/30 backdrop-blur-md text-[10px] font-black uppercase tracking-[0.3em] text-primary/80 hover:text-accent shadow-lg hover:shadow-accent/20 transition-all duration-300 flex items-center gap-3 overflow-hidden"
        >
          <span className="relative z-10 transition-transform duration-300 group-hover:-translate-x-1">←</span> 
          <span className="relative z-10">Back</span>
          <div className="absolute inset-0 bg-accent/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        </Link>

        <button
          onClick={() => setShowModal(true)}
          className="px-6 py-3 rounded-full bg-[var(--coral)] hover:bg-[var(--coral)]/90 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-[0_0_15px_rgba(255,77,77,0.3)] transition-all hover:scale-105 active:scale-95"
        >
          + Hire Samuel
        </button>
      </nav>

      {/* Theme Pill Switch */}
      <button 
        className={`theme-pill ${theme}`}
        onClick={toggleTheme}
        aria-label="Toggle theme"
        style={{ opacity: mounted ? 1 : 0 }}
      >
        <div className="pill-thumb" />
        <svg className="pill-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
        <svg className="pill-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
      </button>

      <main className="relative z-10 pt-28 lg:pt-40 pb-32 max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-[1fr_3.5fr] gap-4 lg:gap-20">
          {/* Left Column: Metadata (Sticky, hidden on mobile) */}
          <aside className="hidden lg:block lg:sticky top-40 h-fit space-y-10 reveal reveal-up p-8 md:p-10 rounded-[2.5rem] bg-surface/30 backdrop-blur-xl border border-border/20 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden group">
            <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 mix-blend-overlay pointer-events-none" />
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-accent/20 blur-[100px] rounded-full group-hover:bg-accent/30 transition-colors duration-700 pointer-events-none" />
            
            <div className="relative z-10">
              <span className="px-5 py-2.5 bg-accent/10 border border-accent/30 text-accent text-[11px] font-black uppercase tracking-[0.3em] rounded-full inline-block shadow-[0_0_15px_rgba(var(--accent),0.1)]">
                {project.tag}
              </span>
            </div>

            <div className="relative z-10">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/50 mb-3">
                Status
              </h3>
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse shadow-[0_0_10px_rgba(var(--accent),0.8)]" />
                <p className="font-bold tracking-wide text-lg text-primary/90">{project.status}</p>
              </div>
            </div>

            <div className="relative z-10">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/50 mb-3">
                {project.slug === "opnmrt" ? "Launch Status" : "Live Link"}
              </h3>
              {project.slug === "opnmrt" ? (
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse shadow-[0_0_8px_rgba(250,204,21,0.8)]" />
                  <p className="font-bold tracking-wide text-lg text-yellow-400">Launching Soon</p>
                </div>
              ) : project.link !== "#" ? (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-accent hover:text-primary transition-colors font-bold tracking-wide group/link"
                >
                  Visit Project <span className="text-sm group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform">↗</span>
                </a>
              ) : (
                <p className="opacity-50 font-semibold tracking-wide">Development Branch</p>
              )}
            </div>

            <div className="relative z-10">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/50 mb-4">
                Tech Stack
              </h3>
              <div className="flex flex-wrap gap-3">
                {project.tech.map((t: string) => (
                  <span
                    key={t}
                    className="px-4 py-2 bg-background/60 border border-border/40 rounded-xl text-[10px] font-bold uppercase tracking-widest text-primary/80 shadow-md hover:border-accent/40 hover:text-accent transition-colors backdrop-blur-md"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </aside>

          {/* Right Column: Content */}
          <div className="space-y-10 lg:space-y-20 w-full max-w-[100vw] overflow-hidden lg:overflow-visible">
            {/* Header */}
            <header className="reveal reveal-up relative">
              <div className="absolute -left-12 top-6 w-32 h-32 bg-accent/30 blur-[100px] rounded-full z-0 pointer-events-none" />
              <h1 className="relative z-10 text-5xl md:text-6xl lg:text-7xl font-black mb-4 lg:mb-6 tracking-tighter leading-[1.05] drop-shadow-2xl max-w-full break-words">
                {project.title}
              </h1>
              {/* Mobile-only: site link or Launching Soon under the title */}
              <div className="lg:hidden mb-4">
                {project.slug === "opnmrt" ? (
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse shadow-[0_0_8px_rgba(250,204,21,0.8)]" />
                    <span className="text-sm font-bold text-yellow-400 tracking-wide">Launching Soon</span>
                  </div>
                ) : project.link && project.link !== "#" ? (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-accent text-sm font-bold tracking-wide hover:underline"
                  >
                    ↗ Visit Site
                  </a>
                ) : null}
              </div>
              <div className="w-24 h-1.5 bg-gradient-to-r from-accent to-transparent mb-8 rounded-full" />
              <p className="relative z-10 text-xl md:text-2xl text-primary/70 leading-relaxed font-serif italic">
                {project.desc}
              </p>
            </header>

            {/* Hero Image / Diagram */}
            <div className="reveal reveal-up">
              {project.slug === "empi-costumes" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <img
                    src="/empiimages/Screenshot%202026-04-01%20070059.png"
                    alt="Hero"
                    className="w-full h-auto object-cover rounded-2xl border border-border/20 md:col-span-1 shadow-2xl transition-transform hover:scale-[1.02] duration-500"
                  />
                  <img
                    src="/empiimages/Screenshot%202026-04-01%20070204.png"
                    alt="Screenshot"
                    className="w-full h-auto object-cover rounded-2xl border border-border/20 shadow-lg md:col-span-1 transition-transform hover:scale-[1.02] duration-500"
                  />
                </div>
              ) : project.slug === "study-express-uk" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <img
                    src="/studyexpress/Screenshot%202026-04-01%20093838.png"
                    alt="Study Express Dashboard"
                    className="w-full h-auto object-cover rounded-2xl border border-border/20 md:col-span-1 shadow-2xl transition-transform hover:scale-[1.02] duration-500"
                  />
                  <img
                    src="/studyexpress/Screenshot%202026-04-01%20093955.png"
                    alt="Study Express Interface"
                    className="w-full h-auto object-cover rounded-2xl border border-border/20 shadow-lg md:col-span-1 transition-transform hover:scale-[1.02] duration-500"
                  />
                </div>
              ) : project.slug === "opnmrt" ? (
                <div className="w-full h-auto rounded-3xl border border-border/20 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl">
                  <img
                    src="/opnmrt/Screenshot%202026-04-01%20161854.png"
                    alt="OPNMRT Platform"
                    className="w-full h-auto object-cover transition-transform hover:scale-[1.02] duration-500"
                  />
                </div>
              ) : project.slug === "stanleys-log" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-2xl overflow-hidden border border-border/20 shadow-2xl">
                    <img
                      src="/stanleyslog/image.png"
                      alt="Stanley's Log Index"
                      className="w-full h-auto object-cover transition-transform hover:scale-[1.02] duration-500"
                    />
                  </div>
                  <div className="rounded-2xl overflow-hidden border border-border/20 shadow-2xl">
                    <img
                      src="/stanleyslog/imagecopy.png"
                      alt="Stanley's Log Article"
                      className="w-full h-auto object-cover transition-transform hover:scale-[1.02] duration-500"
                    />
                  </div>
                </div>
              ) : (
                <div className="w-full space-y-8">
                  {/* Browser or Code Preview Frame */}
                  {project.link && project.link !== "#" ? (
                    <div className="w-full rounded-2xl border border-border/20 overflow-hidden shadow-2xl bg-surface/30 backdrop-blur-xl">
                      {/* Browser Header Bar */}
                      <div className="flex items-center gap-2 px-4 py-3 bg-black/40 border-b border-border/10">
                        <div className="flex gap-1.5">
                          <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                          <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                          <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
                        </div>
                        <div className="flex-1 max-w-md mx-auto bg-black/30 border border-white/5 rounded-md py-1 px-3 text-[10px] font-mono text-[var(--text-secondary)] text-center truncate">
                          {project.link.replace("https://", "").replace("http://", "")}
                        </div>
                        <a 
                          href={project.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-1 hover:bg-white/5 rounded text-[var(--text-secondary)] hover:text-white transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                      
                      {/* Web View Screenshot Body */}
                      <div className="relative w-full aspect-video bg-black/20">
                        <img
                          src={`https://api.microlink.io/?url=${encodeURIComponent(project.link)}&screenshot=true&meta=false&embed=screenshot.url`}
                          alt={`${project.title} live screenshot`}
                          className="w-full h-full object-cover object-top"
                          loading="eager"
                        />
                      </div>
                    </div>
                  ) : (
                    /* Elegant IDE Code Mockup for CLI/non-web repos */
                    <div className="w-full rounded-2xl border border-border/20 overflow-hidden shadow-2xl bg-[#030712] font-mono text-xs text-slate-300">
                      {/* Editor Header Bar */}
                      <div className="flex items-center justify-between px-4 py-3 bg-[#0b0f19] border-b border-border/10">
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1.5 mr-2">
                            <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                            <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                            <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
                          </div>
                          <Terminal className="w-3.5 h-3.5 text-blue-400" />
                          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">{project.slug}.ts</span>
                        </div>
                        {project.repo && project.repo !== "#" && (
                          <a 
                            href={project.repo} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[9px] uppercase tracking-widest text-accent hover:text-white transition-colors border border-accent/20 hover:border-accent bg-accent/5 px-2 py-0.5 rounded"
                          >
                            Source Code
                          </a>
                        )}
                      </div>
                      
                      {/* Code Area */}
                      <div className="p-5 md:p-8 space-y-1 text-slate-400 select-none overflow-x-auto leading-relaxed">
                        <div><span className="text-pink-400">import</span> &#123; <span className="text-yellow-300">System</span>, <span className="text-yellow-300">Architecture</span> &#125; <span className="text-pink-400">from</span> <span className="text-green-300">"sovereign-engineer"</span>;</div>
                        <div className="text-slate-600">// Core software mapping initialization</div>
                        <div><span className="text-pink-400">const</span> <span className="text-blue-300">projectSpec</span> = &#123;</div>
                        <div className="pl-4">name: <span className="text-green-300">"{project.title}"</span>,</div>
                        <div className="pl-4">status: <span className="text-green-300">"{project.status}"</span>,</div>
                        <div className="pl-4">repository: <span className="text-green-300">"github.com/BigT001/{project.slug}"</span>,</div>
                        <div className="pl-4">techStack: [<span className="text-green-300">{project.tech.map((t: string) => `"${t}"`).join(", ")}</span>],</div>
                        <div className="pl-4">metrics: &#123; stars: <span className="text-orange-300">{project.stars || 0}</span>, forks: <span className="text-orange-300">{project.forks || 0}</span> &#125;</div>
                        <div>&#125;;</div>
                        <div className="pt-2 text-slate-600">// Executing technical deployment validation...</div>
                        <div><span className="text-yellow-300">System</span>.<span className="text-blue-300">validate</span>(projectSpec)</div>
                        <div className="pl-4">.<span className="text-blue-300">then</span>(() <span className="text-pink-400">=&gt;</span> console.log(<span className="text-green-300">"Production ready."</span>));</div>
                      </div>
                    </div>
                  )}

                  {/* Dynamic Stats Grid for GitHub projects */}
                  {project.isGithub && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="p-4 rounded-xl border border-border/10 bg-surface/20 text-center">
                        <div className="text-[10px] uppercase tracking-wider text-[var(--text-secondary)] mb-1">Stars</div>
                        <div className="text-xl font-black text-yellow-500 flex items-center justify-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-500" />
                          {project.stars ?? 0}
                        </div>
                      </div>
                      <div className="p-4 rounded-xl border border-border/10 bg-surface/20 text-center">
                        <div className="text-[10px] uppercase tracking-wider text-[var(--text-secondary)] mb-1">Forks</div>
                        <div className="text-xl font-black text-cyan-500 flex items-center justify-center gap-1">
                          <GitFork className="w-4 h-4" />
                          {project.forks ?? 0}
                        </div>
                      </div>
                      <div className="p-4 rounded-xl border border-border/10 bg-surface/20 text-center col-span-2">
                        <div className="text-[10px] uppercase tracking-wider text-[var(--text-secondary)] mb-1">Active Architecture</div>
                        <div className="text-xs font-mono font-bold text-emerald-400 flex items-center justify-center gap-1">
                          <GitBranch className="w-3.5 h-3.5" />
                          main
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Segmented Tab Switcher */}
            <div className="flex border-b border-border/10 gap-8 pb-4 relative z-10">
              <button 
                onClick={() => setActiveSection("overview")}
                className={`pb-2 text-xs font-black uppercase tracking-[0.2em] transition-all relative ${activeSection === "overview" ? "text-accent" : "text-primary/40 hover:text-primary/70"}`}
              >
                Overview
                {activeSection === "overview" && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-accent" />}
              </button>
              <button 
                onClick={() => setActiveSection("dashboard")}
                className={`pb-2 text-xs font-black uppercase tracking-[0.2em] transition-all relative ${activeSection === "dashboard" ? "text-accent" : "text-primary/40 hover:text-primary/70"}`}
              >
                Dashboard Preview
                {activeSection === "dashboard" && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-accent" />}
              </button>
              <button 
                onClick={() => setActiveSection("architecture")}
                className={`pb-2 text-xs font-black uppercase tracking-[0.2em] transition-all relative ${activeSection === "architecture" ? "text-accent" : "text-primary/40 hover:text-primary/70"}`}
              >
                Architecture & Code
                {activeSection === "architecture" && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-accent" />}
              </button>
            </div>

            {/* Article Body */}
            <article className="prose-like text-lg md:text-xl leading-[1.8] text-primary/80 space-y-12 reveal reveal-up pt-8">
              {activeSection === "overview" && (
                <>
                  {project.slug === "opnmrt" && (
                    <>
                      <p className="text-2xl md:text-3xl leading-relaxed font-semibold">
                        <strong>OPNMRT</strong> is a robust, multi-tenant e-commerce SaaS platform that functions as an intelligent &quot;storefront engine.&quot; Unlike traditional centralized marketplaces (like Amazon) that act as an intermediary, OPNMRT empowers independent sellers to build and manage their own branded storefronts while providing buyers with a seamless, account-driven shopping experience.
                      </p>
                      <p className="mt-6">
                        At its core, it is a business intelligence and infrastructure software focusing on direct-to-seller interactions, AI-powered insights, and strict data isolation.
                      </p>

                      <h2 className="text-3xl md:text-4xl font-black tracking-tight mt-16 mb-6">
                        1. Core Architecture & Philosophy
                      </h2>
                      <ul className="space-y-4 mb-16 text-primary/80">
                        <li className="flex gap-4 items-start"><span className="text-accent mt-1 font-bold">✦</span><span><strong>Multi-Tenant Model:</strong> A single application serves all sellers securely. However, data is strictly isolated at the database level using <code className="text-accent bg-accent/10 px-2 rounded">tenantId</code> / <code className="text-accent bg-accent/10 px-2 rounded">storeId</code>.</span></li>
                        <li className="flex gap-4 items-start"><span className="text-accent mt-1 font-bold">✦</span><span><strong>Routing & Domains:</strong> Stores are accessed via subdomains (e.g., <code className="text-accent bg-accent/10 px-2 rounded">storename.opnmrt.com</code>) or custom domains connected by the seller. Next.js middleware and NestJS interceptors seamlessly resolve the active tenant from the request domain.</span></li>
                        <li className="flex gap-4 items-start"><span className="text-accent mt-1 font-bold">✦</span><span><strong>Monorepo Structure:</strong> The project uses a monorepo approach (via <code className="text-accent bg-accent/10 px-2 rounded">pnpm</code> workspaces), dividing responsibilities into distinct packages, most notably:
                          <ul className="ml-8 mt-4 space-y-2">
                            <li>- <code className="text-accent bg-accent/10 px-2 rounded">apps/web</code>: The Next.js frontend.</li>
                            <li>- <code className="text-accent bg-accent/10 px-2 rounded">apps/api</code>: The NestJS backend.</li>
                            <li>- <code className="text-accent bg-accent/10 px-2 rounded">packages/shared</code> (<code className="text-accent bg-accent/10 px-2 rounded">@opnmrt/shared</code>): Unified TypeScript interfaces, Zod validation schemas, and utilities used cohesively across the stack.</li>
                          </ul>
                        </span></li>
                      </ul>

                      <h2 className="text-3xl md:text-4xl font-black tracking-tight mt-16 mb-6">
                        2. User Experiences & Roles
                      </h2>
                      <p className="mb-6">The platform is designed around three primary user personas:</p>
                      <ul className="space-y-4 mb-16 text-primary/80">
                        <li className="flex gap-4 items-start"><span className="text-accent mt-1 font-bold">✦</span><span><strong>Sellers (Tenants):</strong> Sellers have full ownership over their brand, products, pricing, and customers. Their dashboard provides comprehensive tools for order fulfillment, inventory management with low-stock alerts, and advanced sales analytics.</span></li>
                        <li className="flex gap-4 items-start"><span className="text-accent mt-1 font-bold">✦</span><span><strong>Buyers:</strong> Buyers enjoy a modern, mobile-first shopping experience. They create accounts scoped simply per store (or platform), tracking their order history, spending metrics, and communicating directly with sellers through an integrated simple chat system to build trust.</span></li>
                        <li className="flex gap-4 items-start"><span className="text-accent mt-1 font-bold">✦</span><span><strong>Super-Admins (Platform Owners):</strong> Admins maintain global governance. Their dashboard allows them to monitor the health of all stores, moderate content, access buyer-seller dispute chats, and manage platform-wide metrics.</span></li>
                      </ul>

                      <h2 className="text-3xl md:text-4xl font-black tracking-tight mt-16 mb-6">
                        3. Payment Model: Bring Your Own Keys (BYOK)
                      </h2>
                      <p className="mb-6">One of OPNMRT&apos;s most distinguishing features is its payment flow:</p>
                      <ul className="space-y-4 mb-16 text-primary/80">
                        <li className="flex gap-4 items-start"><span className="text-accent mt-1 font-bold">✦</span><span><strong>No Escrow:</strong> The platform does not hold funds, take commissions on sales, or manage payouts.</span></li>
                        <li className="flex gap-4 items-start"><span className="text-accent mt-1 font-bold">✦</span><span><strong>Direct P2P Payments:</strong> Sellers securely integrate their own payment gateway API keys (e.g., <strong>Paystack</strong>, <strong>Flutterwave</strong>). When a buyer makes a purchase, the money flows <em>directly</em> to the seller&apos;s merchant account.</span></li>
                        <li className="flex gap-4 items-start"><span className="text-accent mt-1 font-bold">✦</span><span>OPNMRT strictly handles the infrastructure, cart logic, and metadata tracking without touching the actual funds.</span></li>
                      </ul>

                      <h2 className="text-3xl md:text-4xl font-black tracking-tight mt-16 mb-6">
                        4. AI-Powered Assistant (MVP Scope)
                      </h2>
                      <p className="mb-6">The platform integrates advanced AI capabilities (such as the Gemini API or OpenAI) to function as an intelligent &quot;Storefront Assistant&quot; for sellers:</p>
                      <ul className="space-y-4 mb-16 text-primary/80">
                        <li className="flex gap-4 items-start"><span className="text-accent mt-1 font-bold">✦</span><span><strong>Content Generation:</strong> Automatically writes compelling product descriptions.</span></li>
                        <li className="flex gap-4 items-start"><span className="text-accent mt-1 font-bold">✦</span><span><strong>Business Intelligence:</strong> Translates raw analytics into plain-English sales and performance insights.</span></li>
                        <li className="flex gap-4 items-start"><span className="text-accent mt-1 font-bold">✦</span><span><strong>Inventory Forecasting:</strong> Predicts stock run-outs and intelligently recommends restock timelines.</span></li>
                        <li className="flex gap-4 items-start"><span className="text-accent mt-1 font-bold">✦</span><span><strong>Privacy-First:</strong> The AI models only consume pre-aggregated, anonymized data to ensure strict tenant data privacy.</span></li>
                      </ul>

                      <h2 className="text-3xl md:text-4xl font-black tracking-tight mt-16 mb-6">
                        5. Hyper-Local Logistics with Radar
                      </h2>
                      <p className="mb-6">Traditional delivery systems ignore the nuances of local geography. I built <strong>Radar</strong> to match merchants with rider pools specifically filtered by Local Government Area (LGA).</p>
                      <p className="mb-6">This pairs merchants with delivery riders from their immediate vicinity. By avoiding cross-city dispatch errors, we ensured sub-hour turnarounds while lowering the overall carbon footprint per delivery.</p>
                      
                      <blockquote className="border-l-[3px] border-accent pl-8 py-2 my-12 text-2xl md:text-3xl font-serif italic text-primary/80 reveal reveal-left">
                        "Logistics must be hyper-local. Global mapping solutions often fail the last-mile test in emerging markets."
                      </blockquote>
                    </>
                  )}

                  {project.slug === "samuelstanley" && (
                    <>
                      <p className="text-2xl md:text-3xl leading-relaxed font-semibold">
                        <strong>Citadel OS</strong> is the centralized control system and sovereign monitoring platform powering my portfolio. Engineered to manage system health across multiple client deployments, it aggregates execution logs, reports performance metrics, and integrates real-time codebase syncs with GitHub.
                      </p>
                      <p className="mt-6">
                        Rather than a standard static portfolio page, Citadel OS acts as a live demonstrator of enterprise operational software, featuring direct DB connections, automated cron diagnostic routines, and secure API gateways.
                      </p>

                      <h2 className="text-3xl md:text-4xl font-black tracking-tight mt-16 mb-6">
                        1. Core Capabilities & Architecture
                      </h2>
                      <ul className="space-y-4 mb-16 text-primary/80">
                        <li className="flex gap-4 items-start"><span className="text-accent mt-1 font-bold">✦</span><span><strong>Sovereign Diagnostics:</strong> An active ping agent routinely calls configured client sites, checking SSL expiration cycles and response latency times to verify target accessibility.</span></li>
                        <li className="flex gap-4 items-start"><span className="text-accent mt-1 font-bold">✦</span><span><strong>Secure Control Room:</strong> The admin dashboard (Citadel OS panel) is secured via server-validated passwords and secret authorization keys, completely isolating the database overrides.</span></li>
                        <li className="flex gap-4 items-start"><span className="text-accent mt-1 font-bold">✦</span><span><strong>Real-time Synchronizations:</strong> Project listings are mapped dynamically from GitHub's public repositories via direct manual requests or auto-updates triggered through Git Webhook callbacks.</span></li>
                      </ul>
                    </>
                  )}

                  {project.slug === "empi-costumes" && (
                    <>
                      <p className="text-2xl md:text-3xl leading-relaxed font-semibold">
                        EMPI Costumes isn't just a storefront—it's a comprehensive digital boutique operating system built to power an elite costume creation and rental studio in Lagos, Nigeria.
                      </p>

                      <h2 className="text-3xl md:text-4xl font-black tracking-tight mt-16 mb-4">
                        Beyond E-Commerce: The Bespoke Workflow
                      </h2>
                      <p className="mb-6">
                        The studio needed more than off-the-rack sales. I engineered a sophisticated "Bespoke" pipeline where users submit custom design requests complete with individual measurements and thematic references. Under the hood, a unified <code className="text-accent bg-accent/10 px-2 rounded">UnifiedOrder</code> model seamlessly reconciles traditional rentals with complex tailoring requirements.
                      </p>

                      <h2 className="text-3xl md:text-4xl font-black tracking-tight mt-16 mb-4">
                        Enterprise Resource Planning (ERP) at the Core
                      </h2>
                      <p className="mb-6">
                        While the frontend dazzles customers, the backend acts as a full-scale ERP suite for the EMPI team. Built on <strong>Next.js 15+ and MongoDB</strong>, the system provides complete control over logistics, order fulfillment, and financial tracking down to the VAT level.
                      </p>

                      <ul className="space-y-4 mb-16 text-primary/80">
                        <li className="flex gap-4 items-start">
                          <span className="text-accent mt-1 font-bold">✦</span>
                          <span>
                            <strong>Automated Invoicing:</strong> Auto-generates professional PDF invoices via HTML-to-PDF pipelines for damage deposits and custom orders.
                          </span>
                        </li>
                        <li className="flex gap-4 items-start">
                          <span className="text-accent mt-1 font-bold">✦</span>
                          <span>
                            <strong>Real-Time Sync:</strong> Employs Socket.io web-sockets to keep admin dashboards instantly synchronized across the studio floor as orders and payments flow in.
                          </span>
                        </li>
                      </ul>
                    </>
                  )}

                  {project.slug === "study-express-uk" && (
                    <>
                      <p className="text-2xl md:text-3xl leading-relaxed font-semibold">
                        Study Express UK is a comprehensive educational technology (EdTech) platform empowering global learners with high-quality courses, events, and certifications.
                      </p>

                      <h2 className="text-3xl md:text-4xl font-black tracking-tight mt-16 mb-4">
                        Core Stack & Architecture
                      </h2>
                      <p className="mb-6">
                        The platform architecture is built for scale, utilizing the modern Next.js App Router, React, and TypeScript. At its core, it leverages MongoDB via Mongoose for adaptable, document-based storage. NextAuth.js guarantees multi-role security, while Stripe handles payments.
                      </p>

                      <h2 className="text-3xl md:text-4xl font-black tracking-tight mt-16 mb-4">
                        Robust E-Learning Engine
                      </h2>
                      <p className="mb-6">
                        The application supports extensive course management, tracking detailed enrollment metrics, learner progression paths, and completion rates. The built-in event engine coordinates physical, online, and hybrid live events.
                      </p>
                    </>
                  )}

                  {project.slug === "stanleys-log" && (
                    <>
                      <p className="text-2xl md:text-3xl leading-relaxed font-semibold">
                        <strong>Stanley’s Log v2</strong> is more than just a blog — it is a sophisticated, autonomous AI content ecosystem bridging the gap between intelligent data scraping and automated publishing.
                      </p>

                      <h2 className="text-3xl md:text-4xl font-black tracking-tight mt-16 mb-6">
                        1. Autonomous Intelligence & Fallback Resilience
                      </h2>
                      <p className="mb-6">
                        Using a custom TypeScript engine, it scrape RSS feeds. To ensure 100% uptime, I implemented a fallback chain using <strong>Gemini 1.5 Pro, Flash, and 8B</strong>.
                      </p>
                    </>
                  )}

                  {project.slug !== "opnmrt" && project.slug !== "empi-costumes" && project.slug !== "study-express-uk" && project.slug !== "stanleys-log" && project.slug !== "samuelstanley" && (
                    <div className="space-y-4">
                      <p className="text-2xl md:text-3xl leading-relaxed font-semibold text-[var(--text-primary)]">
                        <strong>{project.title}</strong> is a specialized software solution designed with a focus on code efficiency, robust engineering principles, and modular design paradigms.
                      </p>
                      <p className="text-primary/70">
                        This codebase represents a custom system architecture built to address high-performance operations, clean data routing, and scalable client-server connectivity.
                      </p>
                    </div>
                  )}
                </>
              )}

              {activeSection === "dashboard" && (
                <div className="space-y-8 animate-in fade-in duration-300">
                  {project.slug === "samuelstanley" ? (
                    <div className="w-full rounded-2xl border border-border/20 bg-[#070b14] overflow-hidden shadow-2xl font-mono text-xs text-slate-300">
                      <div className="px-6 py-4 bg-[#0e1322] border-b border-border/10 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="font-bold tracking-wider text-slate-200">CITADEL_OS // CLIENT TELEMETRY</span>
                        </div>
                        <span className="text-[10px] text-slate-500">Uptime: 99.98%</span>
                      </div>
                      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-4 rounded-xl bg-black/40 border border-border/5 space-y-2">
                          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Ping Latency</div>
                          <div className="text-2xl font-black text-emerald-400">42 ms</div>
                          <div className="text-[9px] text-slate-400">SSL status: Secure (180d remaining)</div>
                        </div>
                        <div className="p-4 rounded-xl bg-black/40 border border-border/5 space-y-2">
                          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Active Services</div>
                          <div className="text-2xl font-black text-blue-400">4 Monitored</div>
                          <div className="text-[9px] text-slate-400">Database Engine: Prisma / Supabase</div>
                        </div>
                        <div className="p-4 rounded-xl bg-black/40 border border-border/5 space-y-2">
                          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Sync Integrity</div>
                          <div className="text-2xl font-black text-purple-400">34 Repos</div>
                          <div className="text-[9px] text-slate-400">Last Synced: Just now (via API fallback)</div>
                        </div>
                      </div>
                      <div className="mx-6 mb-6 p-4 rounded-xl bg-black/80 border border-border/5 text-[10px] text-emerald-500 space-y-1.5 h-48 overflow-y-auto leading-relaxed select-none">
                        <div>[SYSTEM] Citadel OS Diagnostics v1.2 initialised successfully.</div>
                        <div>[DATABASE] Direct session connection verified to Supabase PostgreSQL (port 5432).</div>
                        <div>[GITHUB_API] Active sync completed for user 'BigT001': 34 public repositories cached.</div>
                        <div>[METRICS_DAEMON] Cache-busting parameter injected. Database metrics loaded dynamically.</div>
                        <div>[MONITOR] SSL certification verification sequence complete for all 3 client registries.</div>
                        <div className="animate-pulse">[TELEMETRY] System state: HEALTHY. Monitoring connection queue...</div>
                      </div>
                    </div>
                  ) : project.slug === "opnmrt" ? (
                    <div className="w-full rounded-2xl border border-border/20 bg-[#080d1a] overflow-hidden shadow-2xl font-sans text-xs text-slate-300">
                      <div className="px-6 py-4 bg-[#0f172a] border-b border-border/10 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="font-extrabold text-[var(--text-primary)] text-sm tracking-tight">OPNMRT Merchant Control</span>
                        </div>
                        <span className="text-[10px] font-mono bg-emerald-950/40 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">Storefront Active</span>
                      </div>
                      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-4 rounded-xl bg-black/30 border border-border/5">
                          <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-1">Gross Revenue</div>
                          <div className="text-xl font-extrabold text-white">₦2,450,900</div>
                          <div className="text-[9px] text-emerald-400 mt-1 font-semibold">↑ 12% this week</div>
                        </div>
                        <div className="p-4 rounded-xl bg-black/30 border border-border/5">
                          <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-1">Store URL</div>
                          <div className="text-[11px] font-bold text-sky-400 truncate">nike-store.opnmrt.com</div>
                          <div className="text-[9px] text-slate-400 mt-1">Status: Custom domains connected</div>
                        </div>
                        <div className="p-4 rounded-xl bg-black/30 border border-border/5">
                          <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-1">BYOK Gateway</div>
                          <div className="text-sm font-bold text-emerald-400 flex items-center gap-1">Paystack Active</div>
                          <div className="text-[9px] text-slate-400 mt-1 font-semibold">Flutterwave Keys configured</div>
                        </div>
                        <div className="p-4 rounded-xl bg-black/30 border border-border/5">
                          <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-1">Product Listings</div>
                          <div className="text-xl font-extrabold text-white">182 Active</div>
                          <div className="text-[9px] text-slate-400 mt-1">4 low-stock alerts</div>
                        </div>
                      </div>
                      <div className="p-6 border-t border-border/10">
                        <div className="text-xs font-extrabold mb-3 text-[var(--text-primary)]">Active Product Catalog</div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between p-3 rounded-lg bg-black/20 border border-border/5">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center font-bold text-slate-400">👟</div>
                              <div>
                                <div className="font-bold">Air Max 90 Premium</div>
                                <div className="text-[9px] text-slate-500">ID: prd_9a081bc</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-white">₦115,000</div>
                              <div className="text-[9px] text-emerald-400">In Stock: 42</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full rounded-2xl border border-border/20 bg-[#070b14] overflow-hidden shadow-2xl font-mono text-xs text-slate-300">
                      <div className="px-6 py-4 bg-[#0e1322] border-b border-border/10 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
                          <span className="font-bold tracking-wider text-slate-200">CORE OPERATION PORTAL // {project.title.toUpperCase()}</span>
                        </div>
                        <span className="text-[10px] text-slate-500">Telemetry Status: OK</span>
                      </div>
                      <div className="p-8 text-center space-y-4">
                        <div className="w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto text-blue-400 animate-bounce">
                          📊
                        </div>
                        <h4 className="font-bold text-slate-200">Production Dashboard Simulated Engine</h4>
                        <p className="text-[11px] text-slate-400 max-w-md mx-auto leading-relaxed">
                          This dashboard encapsulates transactional stats, database execution queues, and server monitoring routes built for {project.title}. Reach out for a full architectural live demo of the dashboard.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeSection === "architecture" && (
                <>
                  {fetchingReadme ? (
                    <div className="space-y-4 animate-pulse py-8">
                      <div className="h-6 bg-white/5 rounded w-1/3" />
                      <div className="h-4 bg-white/5 rounded w-3/4" />
                      <div className="h-4 bg-white/5 rounded w-2/3" />
                      <div className="h-4 bg-white/5 rounded w-1/2" />
                    </div>
                  ) : readmeHtml ? (
                    <div 
                      className="markdown-body prose prose-invert max-w-none prose-headings:font-black prose-headings:tracking-tight prose-a:text-accent hover:prose-a:underline prose-pre:bg-[#030712] prose-pre:border prose-pre:border-border/10 prose-code:text-emerald-400 prose-code:bg-white/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded"
                      dangerouslySetInnerHTML={{ __html: readmeHtml }}
                    />
                  ) : (
                    <div className="space-y-12">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="p-6 rounded-2xl border border-border/10 bg-surface/10 space-y-3">
                          <Layers className="w-6 h-6 text-accent" />
                          <h3 className="text-lg font-black tracking-tight">System Foundation</h3>
                          <p className="text-sm text-primary/70 leading-relaxed">
                            Structured using standard patterns under the <strong>{project.tag}</strong> paradigm, ensuring complete type safety, modular utility files, and streamlined build pipelines.
                          </p>
                        </div>
                        <div className="p-6 rounded-2xl border border-border/10 bg-surface/10 space-y-3">
                          <Flame className="w-6 h-6 text-red-400" />
                          <h3 className="text-lg font-black tracking-tight">Performant Operations</h3>
                          <p className="text-sm text-primary/70 leading-relaxed">
                            Codebase elements are optimized to ensure minimal load-time overhead, hardware-accelerated rendering transitions, and clean memory lifecycle boundaries.
                          </p>
                        </div>
                        <div className="p-6 rounded-2xl border border-border/10 bg-surface/10 space-y-3">
                          <Terminal className="w-6 h-6 text-emerald-400" />
                          <h3 className="text-lg font-black tracking-tight">Version Control Integrity</h3>
                          <p className="text-sm text-primary/70 leading-relaxed">
                            Continuously deployed via git workflows directly from the source repository. Every module is isolated for rapid updates and verified test paths.
                          </p>
                        </div>
                        <div className="p-6 rounded-2xl border border-border/10 bg-surface/10 space-y-3">
                          <CheckCircle2 className="w-6 h-6 text-blue-400" />
                          <h3 className="text-lg font-black tracking-tight">Sovereign Testing Standards</h3>
                          <p className="text-sm text-primary/70 leading-relaxed">
                            Designed to achieve peak coverage metrics, with clean interface abstractions, mock database boundaries, and automated lint compliance.
                          </p>
                        </div>
                      </div>

                      <blockquote className="border-l-[3px] border-accent pl-8 py-2 my-12 text-2xl md:text-3xl font-serif italic text-primary/80 reveal reveal-left">
                        "Great software architecture is not about building complex systems; it is about creating simple structures that enable limitless growth."
                      </blockquote>
                    </div>
                  )}
                </>
              )}
            </article>

            {/* BOTTOM CTA */}
            <div className="text-center mt-32 reveal reveal-up">
              <div className="p-10 md:p-16 bg-surface/40 border border-border/20 rounded-[2rem] md:rounded-[3rem] shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-accent/5 opacity-50 mix-blend-overlay pointer-events-none" />
                <span className="text-accent text-[10px] font-black uppercase tracking-[0.4em] mb-6 block relative z-10">
                  Start a conversation
                </span>
                <h3 className="text-3xl md:text-5xl font-black tracking-tight mb-10 leading-tight relative z-10">
                  Let's discuss your next project.
                </h3>
                <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
                  <button
                    onClick={() => setShowModal(true)}
                    className="px-10 py-5 bg-[var(--coral)] text-white font-black uppercase tracking-[0.2em] text-xs rounded-full hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_0_20px_rgba(255,77,77,0.4)] flex items-center justify-center gap-2"
                  >
                    ⚡ Book a Call
                  </button>
                  <a
                    href="mailto:stanley.samuel.stanley@gmail.com"
                    className="px-10 py-5 bg-primary text-surface font-black uppercase tracking-[0.2em] text-xs rounded-full hover:scale-105 active:scale-95 transition-transform duration-300 shadow-xl flex items-center justify-center gap-2"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                    Email Me
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-12 border-t border-border/10 text-center opacity-40">
        <p className="text-[9px] font-black uppercase tracking-[0.5em]">
          2026 Sovereign Systems Architecture
        </p>
      </footer>
    </div>
  );
}
