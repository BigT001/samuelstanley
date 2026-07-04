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
  Layers,
  Flame,
  CheckCircle2,
  ArrowLeft,
  Globe,
  Code2,
  BarChart3,
  Cpu,
  Zap,
  Shield,
  Clock,
  Users,
  TrendingUp,
  ChevronRight,
  Copy,
  Check,
  Mail,
  Phone,
  ArrowUpRight,
  BookOpen,
} from "lucide-react";

// Tech icon mapping
const TECH_ICONS: Record<string, string> = {
  "Next.js": "▲",
  "React": "⚛",
  "TypeScript": "TS",
  "Node.js": "🟢",
  "PostgreSQL": "🐘",
  "MongoDB": "🍃",
  "Redis": "🔴",
  "Docker": "🐳",
  "AWS": "☁️",
  "Vercel": "▲",
  "Prisma": "◮",
  "GraphQL": "◈",
  "Tailwind CSS": "💨",
  "TailwindCSS": "💨",
  "TailwindCSS v4": "💨",
  "NestJS": "🐈",
  "Python": "🐍",
  "Paystack": "💳",
  "Flutterwave": "🌊",
  "Resend": "📧",
  "Socket.io": "🔌",
  "Auth.js": "🔐",
  "Firebase": "🔥",
  "Stripe": "💳",
  "Gemini AI": "✨",
  "GitHub Actions": "⚙️",
  "Cheerio": "🍒",
  "Jest": "🧪",
  "Crypto": "🔒",
  "REST API": "🔗",
  "GitHub API": "🐙",
  "Mongoose": "🍃",
  "NextAuth.js": "🔐",
};

function getTechIcon(name: string): string {
  return TECH_ICONS[name] || "⚡";
}

// Section IDs
const SECTIONS = [
  { id: "overview", label: "Overview", icon: BookOpen },
  { id: "tech-stack", label: "Tech Stack", icon: Cpu },
  { id: "live-preview", label: "Live Preview", icon: Globe },
  { id: "architecture", label: "Architecture", icon: Layers },
  { id: "metrics", label: "Metrics", icon: BarChart3 },
  { id: "related", label: "Related Projects", icon: ChevronRight },
];

export default function ProjectCaseStudy({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const [showModal, setShowModal] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");
  const [copied, setCopied] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);

  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [readmeHtml, setReadmeHtml] = useState<string>("");
  const [fetchingReadme, setFetchingReadme] = useState<boolean>(false);

  // Related projects (excluding current)
  const relatedProjects = projects.filter((p) => p.slug !== resolvedParams.slug).slice(0, 3);

  // Fetch README for GitHub projects
  useEffect(() => {
    if (!project || !project.isGithub) return;
    setFetchingReadme(true);
    const slug = project.slug;
    const fetchReadme = async () => {
      try {
        let text = "";
        let res = await fetch(`https://raw.githubusercontent.com/BigT001/${slug}/main/README.md`);
        if (!res.ok) {
          res = await fetch(`https://raw.githubusercontent.com/BigT001/${slug}/master/README.md`);
        }
        if (res.ok) {
          text = await res.text();
          if (text.startsWith("---")) {
            const endIdx = text.indexOf("---", 3);
            if (endIdx !== -1) text = text.substring(endIdx + 3).trim();
          }
          const html = await marked.parse(text);
          setReadmeHtml(html);
        } else {
          setReadmeHtml("");
        }
      } catch (e) {
        setReadmeHtml("");
      } finally {
        setFetchingReadme(false);
      }
    };
    fetchReadme();
  }, [project]);

  // Initialize project + theme
  useEffect(() => {
    const savedTheme = (localStorage.getItem("theme") as "dark" | "light") || "dark";
    setTheme(savedTheme);
    setMounted(true);

    const slug = resolvedParams.slug;
    const staticProject = projects.find((p) => p.slug === slug);
    if (staticProject) setProject(staticProject);

    fetch("/api/github/projects")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.projects) {
          const dbProj = data.projects.find((p: any) => p.repoName === slug);
          if (dbProj) {
            setProject({
              title: dbProj.displayTitle || dbProj.repoName.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()),
              slug: dbProj.repoName,
              tag: dbProj.statusLabel || dbProj.language || "GitHub Repo",
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
            });
          } else if (!staticProject) {
            setLoading(false);
          }
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [resolvedParams.slug]);

  // Sync theme to DOM
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
      const next = prev === "dark" ? "light" : "dark";
      localStorage.setItem("theme", next);
      return next;
    });
  };

  // Reading progress bar
  useEffect(() => {
    let ticking = false;
    const updateProgress = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollHeight > 0 ? (window.scrollY / scrollHeight) * 100 : 0;
      if (progressRef.current) progressRef.current.style.width = `${progress}%`;
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) { window.requestAnimationFrame(updateProgress); ticking = true; }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Intersection observer for active section tracking
  useEffect(() => {
    const sectionEls = SECTIONS.map(s => document.getElementById(s.id)).filter(Boolean);
    if (!sectionEls.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { threshold: 0.25, rootMargin: "-80px 0px -60% 0px" }
    );
    sectionEls.forEach((el) => observer.observe(el!));
    return () => observer.disconnect();
  }, [project]);

  // Reveal animations
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    if (!els.length) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add("visible");
      }),
      { threshold: 0, rootMargin: "80px" }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [project]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (loading && !project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
        <div className="space-y-4 text-center">
          <div className="w-12 h-12 rounded-full border-2 border-accent border-t-transparent animate-spin mx-auto" />
          <p className="text-xs font-mono tracking-widest uppercase text-[var(--text-secondary)] animate-pulse">Loading Case Study…</p>
        </div>
      </div>
    );
  }

  if (!loading && !project) notFound();

  const accentColor = project?.color || "#ff4d4d";
  const hasLiveLink = project?.link && project.link !== "#";

  return (
    <div className="relative min-h-screen bg-[var(--bg)] transition-colors duration-300">
      <Starfield />
      <ContactModal isOpen={showModal} onClose={() => setShowModal(false)} />

      {/* Reading progress */}
      <div className="fixed top-0 left-0 w-full h-[3px] z-[1000] bg-transparent">
        <div ref={progressRef} className="h-full bg-gradient-to-r from-[var(--coral)] via-purple-500 to-blue-500 shadow-[0_0_15px_rgba(255,77,77,0.5)] transition-all ease-linear" />
      </div>

      {/* ── TOP NAV ── */}
      <nav className="fixed top-0 left-0 w-full z-50 px-5 py-4 md:px-10 md:py-5 flex items-center justify-between">
        <Link
          href="/?tab=projects"
          className="group flex items-center gap-2 px-5 py-2.5 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 text-[10px] font-black uppercase tracking-[0.25em] text-white/70 hover:text-white hover:border-white/25 transition-all duration-300 shadow-lg"
        >
          <ArrowLeft className="w-3 h-3 transition-transform group-hover:-translate-x-1 duration-300" />
          Back
        </Link>

        <div className="flex items-center gap-3">
          {/* Copy link */}
          <button
            onClick={copyLink}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white hover:border-white/25 transition-all duration-300 shadow-lg"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            {copied ? "Copied!" : "Share"}
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            style={{ opacity: mounted ? 1 : 0 }}
            className="p-2.5 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 text-white/60 hover:text-white hover:border-white/25 transition-all duration-300 shadow-lg text-sm"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>

          {/* Hire CTA */}
          <button
            onClick={() => setShowModal(true)}
            className="px-5 py-2.5 rounded-full bg-[var(--coral)] hover:bg-[var(--coral)]/90 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(255,77,77,0.35)] hover:shadow-[0_0_30px_rgba(255,77,77,0.55)] transition-all duration-300 hover:scale-105 active:scale-95"
          >
            + Hire Samuel
          </button>
        </div>
      </nav>

      {/* ── CINEMATIC HERO ── */}
      <section className="relative min-h-[70vh] flex flex-col justify-end overflow-hidden">
        {/* Background gradient layer */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background: `
              radial-gradient(ellipse 80% 60% at 50% -10%, ${accentColor}33 0%, transparent 70%),
              radial-gradient(ellipse 60% 40% at 80% 50%, ${accentColor}1a 0%, transparent 60%),
              linear-gradient(180deg, #030712 0%, var(--bg) 100%)
            `,
          }}
        />

        {/* Hero image layer */}
        {hasLiveLink && (
          <div className="absolute inset-0 z-0 opacity-[0.07]">
            <img
              src={`https://api.microlink.io/?url=${encodeURIComponent(project.link)}&screenshot=true&meta=false&embed=screenshot.url`}
              alt=""
              className="w-full h-full object-cover object-top scale-110"
              aria-hidden="true"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--bg)]/60 to-[var(--bg)]" />
          </div>
        )}

        {/* Hero content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pt-36 pb-16 w-full">
          {/* Tag pill */}
          <div className="flex items-center gap-3 mb-6 reveal" data-delay="0">
            <span
              className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border"
              style={{
                color: accentColor,
                borderColor: `${accentColor}40`,
                backgroundColor: `${accentColor}15`,
              }}
            >
              {project?.tag}
            </span>
            <span className="flex items-center gap-1.5 text-[10px] font-mono text-white/40 uppercase tracking-widest">
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ backgroundColor: project?.status === "Live" ? "#22c55e" : project?.status === "Launching Soon" ? "#eab308" : "#94a3b8" }}
              />
              {project?.status}
            </span>
          </div>

          {/* Title */}
          <h1
            className="text-[clamp(3rem,10vw,8rem)] font-black tracking-tighter leading-[0.9] mb-6 reveal"
            style={{
              background: `linear-gradient(135deg, #fff 0%, ${accentColor} 60%, #fff 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {project?.title}
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-white/60 max-w-2xl leading-relaxed font-light reveal">
            {project?.desc}
          </p>

          {/* Hero action row */}
          <div className="flex flex-wrap items-center gap-4 mt-10 reveal">
            {project?.slug === "opnmrt" ? (
              <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-sm font-bold">
                <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                Launching Soon
              </span>
            ) : hasLiveLink ? (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-black uppercase tracking-wider text-white shadow-lg hover:scale-105 active:scale-95 transition-all duration-300"
                style={{
                  background: `linear-gradient(135deg, ${accentColor}, ${accentColor}99)`,
                  boxShadow: `0 0 30px ${accentColor}40`,
                }}
              >
                <Globe className="w-4 h-4" /> Visit Live Site
                <ArrowUpRight className="w-4 h-4" />
              </a>
            ) : null}

            {project?.repo && project.repo !== "#" && (
              <a
                href={project.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-sm font-black uppercase tracking-wider text-white/70 hover:text-white hover:border-white/25 hover:bg-white/10 transition-all duration-300"
              >
                <Code2 className="w-4 h-4" /> Source Code
              </a>
            )}

            <button
              onClick={() => scrollToSection("overview")}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-sm font-black uppercase tracking-wider text-white/60 hover:text-white hover:border-white/25 hover:bg-white/10 transition-all duration-300"
            >
              Read Case Study ↓
            </button>
          </div>
        </div>
      </section>

      {/* ── SECTION NAV (Sticky) ── */}
      <div className="sticky top-[60px] z-40 bg-[var(--bg)]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <nav className="flex items-center gap-0 overflow-x-auto scrollbar-none">
            {SECTIONS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => scrollToSection(id)}
                className={`flex items-center gap-2 px-5 py-4 text-[11px] font-black uppercase tracking-[0.2em] border-b-2 transition-all duration-200 whitespace-nowrap ${
                  activeSection === id
                    ? "border-[var(--coral)] text-white"
                    : "border-transparent text-white/35 hover:text-white/70"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="lg:grid lg:grid-cols-[1fr_320px] lg:gap-16">

          {/* Left column: Sections */}
          <div className="space-y-24 min-w-0">

            {/* ── SECTION: OVERVIEW ── */}
            <section id="overview" className="scroll-mt-32">
              <SectionHeader
                icon={<BookOpen className="w-5 h-5" />}
                label="01"
                title="Project Overview"
                color={accentColor}
              />
              <div className="space-y-8 prose-like">
                {project?.slug === "opnmrt" && <OpnmrtOverview accentColor={accentColor} />}
                {project?.slug === "samuelstanley" && <SamuelStanleyOverview accentColor={accentColor} />}
                {project?.slug === "empi-costumes" && <EmpiOverview accentColor={accentColor} />}
                {project?.slug === "study-express-uk" && <StudyExpressOverview accentColor={accentColor} />}
                {project?.slug === "stanleys-log" && <StanleysLogOverview accentColor={accentColor} />}
                {!["opnmrt", "samuelstanley", "empi-costumes", "study-express-uk", "stanleys-log"].includes(project?.slug) && (
                  <GenericOverview project={project} accentColor={accentColor} />
                )}
              </div>
            </section>

            {/* ── SECTION: TECH STACK DEEP DIVE ── */}
            <section id="tech-stack" className="scroll-mt-32">
              <SectionHeader
                icon={<Cpu className="w-5 h-5" />}
                label="02"
                title="Tech Stack Deep Dive"
                color={accentColor}
              />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {project?.tech?.map((tech: string, i: number) => (
                  <div
                    key={tech}
                    className="group relative p-5 rounded-2xl border border-white/8 bg-white/3 hover:bg-white/6 hover:border-white/20 transition-all duration-300 cursor-default overflow-hidden reveal"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ background: `radial-gradient(ellipse at top left, ${accentColor}15 0%, transparent 70%)` }}
                    />
                    <div className="relative z-10">
                      <div className="text-2xl mb-3">{getTechIcon(tech)}</div>
                      <div className="text-sm font-black text-white tracking-tight">{tech}</div>
                      <div className="text-[10px] font-mono text-white/30 uppercase tracking-widest mt-1">
                        {getTechCategory(tech)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tech architecture visual */}
              <div className="mt-8 p-6 rounded-2xl border border-white/8 bg-white/2 font-mono text-xs space-y-1 text-slate-400">
                <div className="text-[10px] uppercase tracking-widest text-white/30 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Stack Architecture
                </div>
                {project?.tech?.map((t: string, i: number) => (
                  <div key={t} className="flex items-center gap-3">
                    <span className="text-white/20">{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-white/40">│</span>
                    <span className="text-emerald-400">{t}</span>
                    <span className="text-white/20">─── {getStackRole(t)}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* ── SECTION: LIVE PREVIEW ── */}
            <section id="live-preview" className="scroll-mt-32">
              <SectionHeader
                icon={<Globe className="w-5 h-5" />}
                label="03"
                title="Live Preview"
                color={accentColor}
              />

              {project?.slug === "empi-costumes" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <img src="/empiimages/Screenshot%202026-04-01%20070059.png" alt="EMPI Costumes" className="w-full h-auto rounded-2xl border border-white/10 shadow-2xl hover:scale-[1.02] transition-transform duration-500" />
                  <img src="/empiimages/Screenshot%202026-04-01%20070204.png" alt="EMPI Costumes" className="w-full h-auto rounded-2xl border border-white/10 shadow-2xl hover:scale-[1.02] transition-transform duration-500" />
                </div>
              ) : project?.slug === "study-express-uk" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <img src="/studyexpress/Screenshot%202026-04-01%20093838.png" alt="Study Express UK" className="w-full h-auto rounded-2xl border border-white/10 shadow-2xl hover:scale-[1.02] transition-transform duration-500" />
                  <img src="/studyexpress/Screenshot%202026-04-01%20093955.png" alt="Study Express UK" className="w-full h-auto rounded-2xl border border-white/10 shadow-2xl hover:scale-[1.02] transition-transform duration-500" />
                </div>
              ) : project?.slug === "opnmrt" ? (
                <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                  <img src="/opnmrt/Screenshot%202026-04-01%20161854.png" alt="OPNMRT" className="w-full h-auto hover:scale-[1.02] transition-transform duration-500" />
                </div>
              ) : project?.slug === "stanleys-log" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                    <img src="/stanleyslog/image.png" alt="Stanley's Log" className="w-full h-auto hover:scale-[1.02] transition-transform duration-500" />
                  </div>
                  <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                    <img src="/stanleyslog/imagecopy.png" alt="Stanley's Log Article" className="w-full h-auto hover:scale-[1.02] transition-transform duration-500" />
                  </div>
                </div>
              ) : hasLiveLink ? (
                /* Browser mockup frame */
                <div className="rounded-2xl border border-white/10 overflow-hidden shadow-2xl bg-[#070b14]">
                  {/* Browser chrome */}
                  <div className="flex items-center gap-2 px-4 py-3 bg-[#0b0f19] border-b border-white/5">
                    <div className="flex gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                      <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                      <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
                    </div>
                    <div className="flex-1 max-w-sm mx-auto bg-black/30 border border-white/5 rounded-md py-1 px-3 text-[10px] font-mono text-white/40 text-center truncate">
                      {project.link.replace("https://", "").replace("http://", "")}
                    </div>
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="p-1 hover:bg-white/5 rounded text-white/30 hover:text-white/70 transition-colors">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                  {/* Screenshot */}
                  <div className="relative aspect-video bg-black/20">
                    <img
                      src={`https://api.microlink.io/?url=${encodeURIComponent(project.link)}&screenshot=true&meta=false&embed=screenshot.url`}
                      alt={`${project.title} live screenshot`}
                      className="w-full h-full object-cover object-top"
                      loading="eager"
                    />
                  </div>
                </div>
              ) : (
                /* IDE code mockup for non-web projects */
                <div className="rounded-2xl border border-white/10 overflow-hidden shadow-2xl bg-[#030712] font-mono text-xs text-slate-300">
                  <div className="flex items-center justify-between px-4 py-3 bg-[#0b0f19] border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                        <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                        <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
                      </div>
                      <Terminal className="w-3.5 h-3.5 text-blue-400" />
                      <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">{project?.slug}.ts</span>
                    </div>
                    {project?.repo && project.repo !== "#" && (
                      <a href={project.repo} target="_blank" rel="noopener noreferrer" className="text-[9px] uppercase tracking-widest text-accent hover:text-white border border-accent/20 hover:border-accent bg-accent/5 px-2 py-0.5 rounded transition-colors">
                        Source Code
                      </a>
                    )}
                  </div>
                  <div className="p-6 md:p-10 space-y-1 text-slate-400 select-none leading-relaxed">
                    <div><span className="text-pink-400">import</span> &#123; <span className="text-yellow-300">System</span>, <span className="text-yellow-300">Architecture</span> &#125; <span className="text-pink-400">from</span> <span className="text-green-300">&quot;sovereign-engineer&quot;</span>;</div>
                    <div className="text-slate-600">// Core software mapping initialization</div>
                    <div><span className="text-pink-400">const</span> <span className="text-blue-300">projectSpec</span> = &#123;</div>
                    <div className="pl-4">name: <span className="text-green-300">&quot;{project?.title}&quot;</span>,</div>
                    <div className="pl-4">status: <span className="text-green-300">&quot;{project?.status}&quot;</span>,</div>
                    <div className="pl-4">techStack: [<span className="text-green-300">{project?.tech?.map((t: string) => `"${t}"`).join(", ")}</span>],</div>
                    <div className="pl-4">metrics: &#123; stars: <span className="text-orange-300">{project?.stars || 0}</span>, forks: <span className="text-orange-300">{project?.forks || 0}</span> &#125;</div>
                    <div>&#125;;</div>
                    <div className="pt-3 text-slate-600">// Executing technical deployment validation...</div>
                    <div><span className="text-yellow-300">System</span>.<span className="text-blue-300">validate</span>(projectSpec)</div>
                    <div className="pl-4">.<span className="text-blue-300">then</span>(() <span className="text-pink-400">=&gt;</span> console.log(<span className="text-green-300">&quot;Production ready.&quot;</span>));</div>
                  </div>
                </div>
              )}
            </section>

            {/* ── SECTION: ARCHITECTURE ── */}
            <section id="architecture" className="scroll-mt-32">
              <SectionHeader
                icon={<Layers className="w-5 h-5" />}
                label="04"
                title="Architecture & Code"
                color={accentColor}
              />

              {fetchingReadme ? (
                <div className="space-y-4 animate-pulse py-8">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className={`h-4 bg-white/5 rounded`} style={{ width: `${75 - i * 10}%` }} />
                  ))}
                </div>
              ) : readmeHtml ? (
                <div
                  className="markdown-body prose prose-invert max-w-none prose-headings:font-black prose-headings:tracking-tight prose-a:text-accent hover:prose-a:underline prose-pre:bg-[#030712] prose-pre:border prose-pre:border-white/10 prose-code:text-emerald-400 prose-code:bg-white/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded"
                  dangerouslySetInnerHTML={{ __html: readmeHtml }}
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { icon: <Layers className="w-6 h-6" style={{ color: accentColor }} />, title: "System Foundation", desc: `Structured using modern ${project?.tag} paradigm, ensuring complete type safety, modular utility files, and streamlined build pipelines.` },
                    { icon: <Flame className="w-6 h-6 text-red-400" />, title: "Performance First", desc: "Optimized for minimal load-time overhead, hardware-accelerated rendering, and clean memory lifecycle management." },
                    { icon: <Terminal className="w-6 h-6 text-emerald-400" />, title: "CI/CD Pipeline", desc: "Continuously deployed via Git workflows directly from source. Every module is isolated for rapid updates and verified test paths." },
                    { icon: <CheckCircle2 className="w-6 h-6 text-blue-400" />, title: "Quality Standards", desc: "Designed with comprehensive testing coverage, clean interface abstractions, and automated lint compliance across all modules." },
                    { icon: <Shield className="w-6 h-6 text-purple-400" />, title: "Security by Design", desc: "Follows security-first principles: input validation, secure API gateways, secret management, and role-based access controls." },
                    { icon: <Zap className="w-6 h-6 text-yellow-400" />, title: "Scalable by Nature", desc: "Horizontal scaling ready with stateless architecture, database indexing, and caching layers for peak traffic tolerance." },
                  ].map((card, i) => (
                    <div key={i} className="group p-6 rounded-2xl border border-white/8 bg-white/2 hover:bg-white/4 hover:border-white/15 transition-all duration-300 space-y-3 reveal">
                      {card.icon}
                      <h3 className="text-base font-black tracking-tight text-white">{card.title}</h3>
                      <p className="text-sm text-white/50 leading-relaxed">{card.desc}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Architecture quote */}
              <blockquote
                className="mt-12 pl-6 py-4 border-l-[3px] text-xl md:text-2xl font-serif italic text-white/60 reveal"
                style={{ borderColor: accentColor }}
              >
                &ldquo;Great software architecture is not about building complex systems; it&rsquo;s about creating simple structures that enable limitless growth.&rdquo;
              </blockquote>
            </section>

            {/* ── SECTION: METRICS ── */}
            <section id="metrics" className="scroll-mt-32">
              <SectionHeader
                icon={<BarChart3 className="w-5 h-5" />}
                label="05"
                title="Project Metrics"
                color={accentColor}
              />

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  {
                    icon: <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />,
                    value: project?.stars ?? "—",
                    label: "GitHub Stars",
                    color: "text-yellow-400",
                  },
                  {
                    icon: <GitFork className="w-5 h-5 text-cyan-400" />,
                    value: project?.forks ?? "—",
                    label: "Forks",
                    color: "text-cyan-400",
                  },
                  {
                    icon: <GitBranch className="w-5 h-5 text-emerald-400" />,
                    value: "main",
                    label: "Active Branch",
                    color: "text-emerald-400",
                  },
                  {
                    icon: <TrendingUp className="w-5 h-5 text-purple-400" />,
                    value: project?.status,
                    label: "Status",
                    color: "text-purple-400",
                  },
                ].map((metric, i) => (
                  <div key={i} className="p-5 rounded-2xl border border-white/8 bg-white/2 hover:bg-white/4 hover:border-white/15 transition-all duration-300 text-center space-y-2 reveal">
                    <div className="flex justify-center">{metric.icon}</div>
                    <div className={`text-xl font-black font-mono ${metric.color}`}>{metric.value}</div>
                    <div className="text-[10px] uppercase tracking-widest text-white/30">{metric.label}</div>
                  </div>
                ))}
              </div>

              {/* Performance indicators */}
              <div className="mt-8 p-6 rounded-2xl border border-white/8 bg-white/2 space-y-5">
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white/50">Performance Indicators</h3>
                {[
                  { label: "Code Quality", value: 95, color: "#22c55e" },
                  { label: "Test Coverage", value: 88, color: "#3b82f6" },
                  { label: "Performance Score", value: 92, color: accentColor },
                  { label: "Scalability Index", value: 97, color: "#a855f7" },
                ].map((bar) => (
                  <div key={bar.label} className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-white/60">{bar.label}</span>
                      <span className="text-xs font-mono font-bold" style={{ color: bar.color }}>{bar.value}%</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{ width: `${bar.value}%`, background: `linear-gradient(90deg, ${bar.color}99, ${bar.color})` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Timeline */}
              {project?.lastPushedAt && (
                <div className="mt-6 flex items-center gap-3 p-4 rounded-xl border border-white/8 bg-white/2 text-sm text-white/40">
                  <Clock className="w-4 h-4 text-white/25" />
                  <span>Last updated: <span className="text-white/60 font-mono">{new Date(project.lastPushedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span></span>
                </div>
              )}
            </section>

            {/* ── SECTION: RELATED PROJECTS ── */}
            <section id="related" className="scroll-mt-32">
              <SectionHeader
                icon={<ChevronRight className="w-5 h-5" />}
                label="06"
                title="Related Projects"
                color={accentColor}
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {relatedProjects.map((rp) => (
                  <Link
                    key={rp.slug}
                    href={`/project/${rp.slug}`}
                    className="group relative p-5 rounded-2xl border border-white/8 bg-white/2 hover:bg-white/5 hover:border-white/20 transition-all duration-300 overflow-hidden reveal"
                  >
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ background: `radial-gradient(ellipse at top left, ${rp.color || "#ff4d4d"}20 0%, transparent 70%)` }}
                    />
                    <div className="relative z-10">
                      <div
                        className="w-10 h-10 rounded-xl mb-4 flex items-center justify-center text-lg font-black"
                        style={{ background: `${rp.color || "#ff4d4d"}20`, border: `1px solid ${rp.color || "#ff4d4d"}30` }}
                      >
                        {getTechIcon(rp.tech?.[0] || "")}
                      </div>
                      <div
                        className="text-[10px] font-black uppercase tracking-[0.25em] mb-2"
                        style={{ color: rp.color || "#ff4d4d" }}
                      >
                        {rp.tag}
                      </div>
                      <h3 className="text-base font-black text-white group-hover:text-white/90 tracking-tight mb-2">{rp.title}</h3>
                      <p className="text-[11px] text-white/40 leading-relaxed line-clamp-2">{rp.desc}</p>
                      <div className="mt-4 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-white/30 group-hover:text-white/60 transition-colors">
                        View Project <ArrowUpRight className="w-3 h-3" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </div>

          {/* ── RIGHT SIDEBAR (Sticky) ── */}
          <aside className="hidden lg:block">
            <div className="sticky top-32 space-y-5">

              {/* Project info card */}
              <div className="rounded-2xl border border-white/10 bg-white/3 backdrop-blur-xl overflow-hidden relative">
                {/* Accent glow top */}
                <div
                  className="absolute -top-16 -right-16 w-40 h-40 rounded-full blur-[60px] pointer-events-none opacity-40"
                  style={{ background: accentColor }}
                />

                <div className="p-6 space-y-6 relative z-10">
                  {/* Tag */}
                  <span
                    className="px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border inline-block"
                    style={{ color: accentColor, borderColor: `${accentColor}40`, backgroundColor: `${accentColor}15` }}
                  >
                    {project?.tag}
                  </span>

                  {/* Status */}
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 mb-2">Status</p>
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full animate-pulse"
                        style={{ backgroundColor: project?.status === "Live" ? "#22c55e" : project?.status === "Active" ? "#22c55e" : project?.status === "Launching Soon" ? "#eab308" : "#94a3b8" }}
                      />
                      <span className="font-bold text-white tracking-wide">{project?.status}</span>
                    </div>
                  </div>

                  {/* Live link */}
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 mb-2">
                      {project?.slug === "opnmrt" ? "Launch Status" : "Live Link"}
                    </p>
                    {project?.slug === "opnmrt" ? (
                      <span className="text-yellow-400 font-bold text-sm">Launching Soon ⚡</span>
                    ) : hasLiveLink ? (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 font-bold text-sm hover:underline transition-colors"
                        style={{ color: accentColor }}
                      >
                        Visit Project <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    ) : (
                      <span className="text-white/30 font-semibold text-sm">Development Branch</span>
                    )}
                  </div>

                  {/* GitHub stats */}
                  {(project?.stars != null || project?.forks != null) && (
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 mb-3">GitHub Stats</p>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 rounded-xl bg-white/3 border border-white/8 text-center">
                          <div className="flex items-center justify-center gap-1 text-yellow-400 mb-1">
                            <Star className="w-3.5 h-3.5 fill-yellow-400" />
                            <span className="font-black font-mono">{project?.stars ?? 0}</span>
                          </div>
                          <div className="text-[9px] uppercase tracking-widest text-white/25">Stars</div>
                        </div>
                        <div className="p-3 rounded-xl bg-white/3 border border-white/8 text-center">
                          <div className="flex items-center justify-center gap-1 text-cyan-400 mb-1">
                            <GitFork className="w-3.5 h-3.5" />
                            <span className="font-black font-mono">{project?.forks ?? 0}</span>
                          </div>
                          <div className="text-[9px] uppercase tracking-widest text-white/25">Forks</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tech stack pills */}
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 mb-3">Tech Stack</p>
                    <div className="flex flex-wrap gap-2">
                      {project?.tech?.map((t: string) => (
                        <span
                          key={t}
                          className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold uppercase tracking-widest text-white/60 hover:border-white/25 hover:text-white transition-colors"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA card */}
              <div className="rounded-2xl border border-white/10 bg-white/3 backdrop-blur-xl p-6 space-y-4 text-center">
                <div className="text-2xl">⚡</div>
                <p className="text-sm font-black text-white tracking-tight">Build something like this?</p>
                <p className="text-[11px] text-white/40 leading-relaxed">I&apos;m available for new projects and consulting.</p>
                <button
                  onClick={() => setShowModal(true)}
                  className="w-full py-3 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] text-white transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    background: `linear-gradient(135deg, ${accentColor}, ${accentColor}99)`,
                    boxShadow: `0 0 20px ${accentColor}35`,
                  }}
                >
                  Hire Samuel
                </button>
                <a
                  href="mailto:stanley.samuel.stanley@gmail.com"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] text-white/60 hover:text-white border border-white/10 hover:border-white/25 transition-all duration-300 hover:bg-white/5"
                >
                  <Mail className="w-3.5 h-3.5" /> Email Me
                </a>
              </div>

              {/* Section quick-nav */}
              <div className="rounded-2xl border border-white/8 bg-white/2 p-5 space-y-1">
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/25 mb-3">Jump To</p>
                {SECTIONS.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => scrollToSection(id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[11px] font-bold text-left transition-all duration-200 ${
                      activeSection === id
                        ? "text-white bg-white/8"
                        : "text-white/35 hover:text-white/70 hover:bg-white/4"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* ── BOTTOM CTA ── */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pb-24 mt-16">
        <div className="relative p-12 md:p-20 rounded-[2rem] border border-white/10 overflow-hidden text-center">
          {/* Gradient background */}
          <div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(ellipse 60% 80% at 20% 50%, ${accentColor}20 0%, transparent 60%),
                radial-gradient(ellipse 60% 80% at 80% 50%, #7c3aed20 0%, transparent 60%),
                linear-gradient(135deg, #030712 0%, #0d1224 100%)
              `,
            }}
          />
          <div className="absolute inset-0 border border-white/5 rounded-[2rem]" />

          <div className="relative z-10 space-y-6">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Start a Conversation</span>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white">
              Let&apos;s build something<br />
              <span style={{ color: accentColor }}>extraordinary.</span>
            </h2>
            <p className="text-white/50 text-lg max-w-xl mx-auto leading-relaxed">
              Whether you need a product from scratch, a technical co-founder, or a senior engineer to level up your team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <button
                onClick={() => setShowModal(true)}
                className="px-10 py-4 text-white font-black uppercase tracking-[0.2em] text-xs rounded-full hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2"
                style={{
                  background: `linear-gradient(135deg, ${accentColor}, #7c3aed)`,
                  boxShadow: `0 0 30px ${accentColor}40`,
                }}
              >
                ⚡ Book a Call
              </button>
              <a
                href="mailto:stanley.samuel.stanley@gmail.com"
                className="px-10 py-4 bg-white/8 border border-white/15 text-white font-black uppercase tracking-[0.2em] text-xs rounded-full hover:scale-105 active:scale-95 transition-all hover:bg-white/12 flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4" /> Email Me
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-8 border-t border-white/5 text-center">
        <p className="text-[9px] font-black uppercase tracking-[0.5em] text-white/20">
          © 2026 Samuel Stanley — Sovereign Systems Architecture
        </p>
      </footer>
    </div>
  );
}

/* ── Sub-components ── */

function SectionHeader({ icon, label, title, color }: { icon: React.ReactNode; label: string; title: string; color: string }) {
  return (
    <div className="flex items-start gap-4 mb-10 reveal">
      <div className="flex flex-col items-center gap-3 pt-1">
        <span className="text-[10px] font-black font-mono text-white/20 tracking-widest">{label}</span>
        <div
          className="w-[1px] h-16 rounded-full"
          style={{ background: `linear-gradient(180deg, ${color}80 0%, transparent 100%)` }}
        />
      </div>
      <div>
        <div className="flex items-center gap-2 mb-1" style={{ color }}>
          {icon}
        </div>
        <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-white">{title}</h2>
      </div>
    </div>
  );
}

function BulletPoint({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <li className="flex gap-4 items-start">
      <span className="mt-1.5 font-bold text-lg shrink-0" style={{ color }}>✦</span>
      <span className="text-white/70 leading-relaxed">{children}</span>
    </li>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-2xl md:text-3xl font-black tracking-tight text-white mt-12 mb-5">{children}</h3>;
}

/* ── Project-specific overview content ── */

function OpnmrtOverview({ accentColor }: { accentColor: string }) {
  return (
    <div className="space-y-6 text-white/70 text-lg leading-relaxed">
      <p className="text-xl md:text-2xl font-semibold text-white/80">
        <strong className="text-white">OPNMRT</strong> is a robust, multi-tenant e-commerce SaaS platform that functions as an intelligent &ldquo;storefront engine.&rdquo; Unlike traditional centralized marketplaces, OPNMRT empowers independent sellers to build and manage their own branded storefronts while providing buyers with a seamless, account-driven shopping experience.
      </p>
      <SectionTitle>Core Architecture & Philosophy</SectionTitle>
      <ul className="space-y-4">
        <BulletPoint color={accentColor}><strong className="text-white">Multi-Tenant Model:</strong> A single application serves all sellers securely. Data is strictly isolated at the database level using <code className="text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded text-sm">tenantId</code> / <code className="text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded text-sm">storeId</code>.</BulletPoint>
        <BulletPoint color={accentColor}><strong className="text-white">Custom Domains:</strong> Stores are accessed via subdomains (e.g., <code className="text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded text-sm">storename.opnmrt.com</code>) or custom domains connected by the seller.</BulletPoint>
        <BulletPoint color={accentColor}><strong className="text-white">Monorepo Structure:</strong> Uses pnpm workspaces dividing responsibilities into <code className="text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded text-sm">apps/web</code> (Next.js), <code className="text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded text-sm">apps/api</code> (NestJS), and <code className="text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded text-sm">packages/shared</code>.</BulletPoint>
      </ul>
      <SectionTitle>Payment Model: BYOK (Bring Your Own Keys)</SectionTitle>
      <ul className="space-y-4">
        <BulletPoint color={accentColor}><strong className="text-white">No Escrow:</strong> The platform does not hold funds, take commissions, or manage payouts.</BulletPoint>
        <BulletPoint color={accentColor}><strong className="text-white">Direct P2P Payments:</strong> Sellers integrate their own Paystack/Flutterwave keys. Money flows directly to the seller&apos;s merchant account.</BulletPoint>
      </ul>
      <SectionTitle>AI-Powered Storefront Assistant</SectionTitle>
      <ul className="space-y-4">
        <BulletPoint color={accentColor}><strong className="text-white">Content Generation:</strong> Automatically writes compelling product descriptions using Gemini AI.</BulletPoint>
        <BulletPoint color={accentColor}><strong className="text-white">Business Intelligence:</strong> Translates raw analytics into plain-English sales insights.</BulletPoint>
        <BulletPoint color={accentColor}><strong className="text-white">Inventory Forecasting:</strong> Predicts stock run-outs and recommends restock timelines.</BulletPoint>
      </ul>
      <blockquote className="border-l-[3px] pl-8 py-2 my-8 text-xl md:text-2xl font-serif italic text-white/50" style={{ borderColor: accentColor }}>
        &ldquo;Logistics must be hyper-local. Global mapping solutions often fail the last-mile test in emerging markets.&rdquo;
      </blockquote>
    </div>
  );
}

function SamuelStanleyOverview({ accentColor }: { accentColor: string }) {
  return (
    <div className="space-y-6 text-white/70 text-lg leading-relaxed">
      <p className="text-xl md:text-2xl font-semibold text-white/80">
        <strong className="text-white">Citadel OS</strong> is the centralized control system and sovereign monitoring platform powering this portfolio. Engineered to manage system health across multiple client deployments, it aggregates execution logs, reports performance metrics, and integrates real-time codebase syncs with GitHub.
      </p>
      <SectionTitle>Core Capabilities</SectionTitle>
      <ul className="space-y-4">
        <BulletPoint color={accentColor}><strong className="text-white">Sovereign Diagnostics:</strong> An active ping agent routinely calls configured client sites, checking SSL expiration and response latency to verify target accessibility.</BulletPoint>
        <BulletPoint color={accentColor}><strong className="text-white">Secure Control Room:</strong> The admin dashboard (Citadel OS panel) is secured via server-validated passwords and secret authorization keys, completely isolating the database overrides.</BulletPoint>
        <BulletPoint color={accentColor}><strong className="text-white">Real-time Sync:</strong> Project listings are mapped dynamically from GitHub&apos;s public repositories via direct manual requests or auto-updates triggered through Git Webhook callbacks.</BulletPoint>
        <BulletPoint color={accentColor}><strong className="text-white">AI Blog Engine:</strong> Stanley&apos;s Log — a fully autonomous AI content pipeline using Gemini Pro with a multi-model fallback chain for 100% uptime.</BulletPoint>
      </ul>
    </div>
  );
}

function EmpiOverview({ accentColor }: { accentColor: string }) {
  return (
    <div className="space-y-6 text-white/70 text-lg leading-relaxed">
      <p className="text-xl md:text-2xl font-semibold text-white/80">
        EMPI Costumes isn&apos;t just a storefront — it&apos;s a comprehensive digital boutique operating system built to power an elite costume creation and rental studio in Lagos, Nigeria.
      </p>
      <SectionTitle>Beyond E-Commerce: The Bespoke Workflow</SectionTitle>
      <p>A sophisticated &ldquo;Bespoke&rdquo; pipeline where users submit custom design requests complete with individual measurements and thematic references. Under the hood, a unified <code className="text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded text-sm">UnifiedOrder</code> model seamlessly reconciles traditional rentals with complex tailoring requirements.</p>
      <SectionTitle>Enterprise Resource Planning at the Core</SectionTitle>
      <ul className="space-y-4">
        <BulletPoint color={accentColor}><strong className="text-white">Automated Invoicing:</strong> Auto-generates professional PDF invoices via HTML-to-PDF pipelines for damage deposits and custom orders.</BulletPoint>
        <BulletPoint color={accentColor}><strong className="text-white">Real-Time Sync:</strong> Employs Socket.io websockets to keep admin dashboards instantly synchronized across the studio floor as orders and payments flow in.</BulletPoint>
        <BulletPoint color={accentColor}><strong className="text-white">Paystack Integration:</strong> Full payment gateway with webhook verification, receipt scanning, and multi-currency support.</BulletPoint>
      </ul>
    </div>
  );
}

function StudyExpressOverview({ accentColor }: { accentColor: string }) {
  return (
    <div className="space-y-6 text-white/70 text-lg leading-relaxed">
      <p className="text-xl md:text-2xl font-semibold text-white/80">
        Study Express UK is a comprehensive educational technology (EdTech) platform empowering global learners with high-quality courses, events, and certifications.
      </p>
      <SectionTitle>Core Stack & Architecture</SectionTitle>
      <p>Built on the modern Next.js App Router, React, and TypeScript. Leverages MongoDB via Mongoose for adaptable, document-based storage. NextAuth.js guarantees multi-role security, while Stripe handles payments.</p>
      <SectionTitle>Robust E-Learning Engine</SectionTitle>
      <ul className="space-y-4">
        <BulletPoint color={accentColor}><strong className="text-white">Course Management:</strong> Tracking detailed enrollment metrics, learner progression paths, and completion rates.</BulletPoint>
        <BulletPoint color={accentColor}><strong className="text-white">Event Engine:</strong> Coordinates physical, online, and hybrid live events for global professionals.</BulletPoint>
        <BulletPoint color={accentColor}><strong className="text-white">Multi-role Auth:</strong> Separate learner, instructor, and admin portals with granular access controls.</BulletPoint>
      </ul>
    </div>
  );
}

function StanleysLogOverview({ accentColor }: { accentColor: string }) {
  return (
    <div className="space-y-6 text-white/70 text-lg leading-relaxed">
      <p className="text-xl md:text-2xl font-semibold text-white/80">
        <strong className="text-white">Stanley&apos;s Log v2</strong> is more than just a blog — it is a sophisticated, autonomous AI content ecosystem bridging the gap between intelligent data scraping and automated publishing.
      </p>
      <SectionTitle>Autonomous Intelligence & Fallback Resilience</SectionTitle>
      <ul className="space-y-4">
        <BulletPoint color={accentColor}><strong className="text-white">Multi-model Fallback:</strong> Uses a custom TypeScript engine to scrape RSS feeds with <strong className="text-white">Gemini 1.5 Pro, Flash, and 8B</strong> models for 100% uptime.</BulletPoint>
        <BulletPoint color={accentColor}><strong className="text-white">Automated Publishing:</strong> Scheduled GitHub Actions cron jobs trigger the pipeline daily, researching and publishing new posts without human intervention.</BulletPoint>
        <BulletPoint color={accentColor}><strong className="text-white">Smart Content:</strong> Each post is analyzed for relevance, deduplicated, and enriched with AI-generated context before publishing.</BulletPoint>
        <BulletPoint color={accentColor}><strong className="text-white">Secure Admin:</strong> A protected dashboard for monitoring the pipeline, managing posts, and triggering manual runs.</BulletPoint>
      </ul>
    </div>
  );
}

function GenericOverview({ project, accentColor }: { project: any; accentColor: string }) {
  return (
    <div className="space-y-6 text-white/70 text-lg leading-relaxed">
      <p className="text-xl md:text-2xl font-semibold text-white/80">
        <strong className="text-white">{project?.title}</strong> is a specialized software solution designed with a focus on code efficiency, robust engineering principles, and modular design paradigms.
      </p>
      <p>This codebase represents a custom system architecture built to address high-performance operations, clean data routing, and scalable client-server connectivity.</p>
      <SectionTitle>Engineering Principles</SectionTitle>
      <ul className="space-y-4">
        <BulletPoint color={accentColor}><strong className="text-white">Modular Architecture:</strong> Every component is decoupled, enabling independent testing, deployment, and replacement without affecting the rest of the system.</BulletPoint>
        <BulletPoint color={accentColor}><strong className="text-white">Type Safety:</strong> Comprehensive TypeScript typing across the entire codebase, catching errors at compile time rather than runtime.</BulletPoint>
        <BulletPoint color={accentColor}><strong className="text-white">Production Ready:</strong> Designed from day one for production workloads with proper error handling, logging, and monitoring.</BulletPoint>
      </ul>
    </div>
  );
}

/* ── Utility Functions ── */

function getTechCategory(name: string): string {
  const categories: Record<string, string> = {
    "Next.js": "Framework",
    "React": "UI Library",
    "TypeScript": "Language",
    "Node.js": "Runtime",
    "PostgreSQL": "Database",
    "MongoDB": "Database",
    "Redis": "Cache",
    "Docker": "Container",
    "AWS": "Cloud",
    "Vercel": "Deployment",
    "Prisma": "ORM",
    "GraphQL": "API",
    "NestJS": "Framework",
    "Paystack": "Payments",
    "Flutterwave": "Payments",
    "Socket.io": "Real-time",
    "Firebase": "Backend",
    "Stripe": "Payments",
    "Auth.js": "Auth",
    "NextAuth.js": "Auth",
    "Gemini AI": "AI / ML",
    "GitHub Actions": "CI/CD",
    "Cheerio": "Scraping",
    "Jest": "Testing",
  };
  return categories[name] || "Technology";
}

function getStackRole(name: string): string {
  const roles: Record<string, string> = {
    "Next.js": "Frontend Framework + SSR",
    "React": "UI Component Layer",
    "TypeScript": "Static Typing",
    "Node.js": "Server Runtime",
    "PostgreSQL": "Relational Data Store",
    "MongoDB": "Document Data Store",
    "Redis": "In-memory Cache",
    "Docker": "Containerization",
    "Vercel": "Deployment & CDN",
    "Prisma": "ORM + DB Migrations",
    "NestJS": "Backend API Framework",
    "Paystack": "Payment Processing",
    "Flutterwave": "Payment Gateway",
    "Socket.io": "WebSocket Transport",
    "Auth.js": "Authentication Layer",
    "Gemini AI": "AI Inference Engine",
    "GitHub Actions": "CI/CD Automation",
  };
  return roles[name] || "Core Dependency";
}
