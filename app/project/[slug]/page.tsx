"use client";

import { use, useState, useEffect, useRef } from "react";
import { notFound } from "next/navigation";
import { projects } from "../../components/data";
import Link from "next/link";
import Image from "next/image";
import projectGallery from "../../project-gallery.generated.json";
import { ContactModal } from "../../components/ui";
import { Starfield } from "../../components/Starfield";
import {
  GitBranch,
  Star,
  GitFork,
  Layers,
  ArrowLeft,
  Globe,
  Code2,
  BarChart3,
  Activity,
  Cpu,
  Zap,
  Clock,
  ChevronRight,
  Copy,
  Check,
  Mail,
  ArrowUpRight,
  BookOpen,
  Menu,
  X,
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

type ProjectIdentity = {
  accent: string;
  accent2: string;
  background: string;
  surface: string;
  text: string;
  muted: string;
  font: string;
  displayFont: string;
  image?: string;
  eyebrow: string;
  buildNotes: Array<{ title: string; text: string }>;
};

type ProjectRecord = {
  title: string;
  slug: string;
  tag: string;
  desc: string;
  tech: string[];
  color?: string;
  link?: string;
  homepage?: string;
  repo?: string;
  status?: string;
  stars?: number;
  forks?: number;
  language?: string | null;
  lastPushedAt?: string | Date | null;
  isGithub?: boolean;
};

type ProjectScreenshot = {
  id: string;
  label: string;
  description: string;
  src: string;
  width: number;
  height: number;
  capturedAt?: string;
};

type GithubProjectRecord = {
  repoName: string;
  displayTitle?: string | null;
  statusLabel?: string | null;
  language?: string | null;
  displayDesc?: string | null;
  description?: string | null;
  displayTags?: string[];
  homepage?: string | null;
  repoUrl?: string | null;
  stars?: number;
  forks?: number;
  lastPushedAt?: string | null;
};

const PROJECT_THEMES: Record<string, ProjectIdentity> = {
  "opnmrt": {
    accent: "#10b981",
    accent2: "#60a5fa",
    background: "#060a10",
    surface: "#0a0f18",
    text: "#f8fafc",
    muted: "#9ca3af",
    font: "Inter, ui-sans-serif, system-ui, sans-serif",
    displayFont: "Inter, ui-sans-serif, system-ui, sans-serif",
    image: "/opnmrt/Screenshot 2026-04-01 161854.png",
    eyebrow: "Open Merchant Retail Technology",
    buildNotes: [
      { title: "One engine, separate stores", text: "The application keeps each merchant’s catalogue, orders and settings within a clear tenant boundary." },
      { title: "Payments stay with the seller", text: "Merchants connect their own payment account. OPNMRT does not sit between a seller and their revenue." },
      { title: "Built around local trade", text: "Storefront, stock and delivery tools are designed for the way independent businesses actually operate." },
    ],
  },
  "empi-costumes": {
    accent: "#b28a5b",
    accent2: "#e8cda8",
    background: "#140f0d",
    surface: "#211815",
    text: "#fffaf2",
    muted: "#c7b8a7",
    font: "Georgia, 'Times New Roman', serif",
    displayFont: "Georgia, 'Times New Roman', serif",
    image: "/empiimages/Screenshot 2026-04-01 070059.png",
    eyebrow: "Costume atelier · Lagos",
    buildNotes: [
      { title: "Rental is not regular retail", text: "Availability, return dates and damage deposits are treated as first-class parts of an order." },
      { title: "Bespoke requests need context", text: "Measurements and references travel with the request, so the studio does not have to reconstruct a brief from chat messages." },
      { title: "The studio has one order view", text: "Sales, rentals and custom work meet in the same operational queue for the team." },
    ],
  },
  "study-express-uk": {
    accent: "#008200",
    accent2: "#4d8eff",
    background: "#f7faf7",
    surface: "#ffffff",
    text: "#111827",
    muted: "#6b7280",
    font: "Inter, ui-sans-serif, system-ui, sans-serif",
    displayFont: "Inter, ui-sans-serif, system-ui, sans-serif",
    image: "/studyexpress/Screenshot 2026-04-01 093838.png",
    eyebrow: "Professional learning · United Kingdom",
    buildNotes: [
      { title: "Courses and events share a home", text: "Learners can move between self-paced programmes, live events and corporate training without changing platforms." },
      { title: "Roles remain explicit", text: "Learner, instructor and administrator journeys are separated so each dashboard stays focused." },
      { title: "Designed for decisions", text: "Course information, accreditation and enrolment actions are surfaced before secondary content." },
    ],
  },
  "stanleys-log": {
    accent: "#d6ff4b",
    accent2: "#62e9d5",
    background: "#080a08",
    surface: "#10130f",
    text: "#f4f7ed",
    muted: "#9ca68e",
    font: "'Courier New', ui-monospace, monospace",
    displayFont: "Arial Black, Inter, ui-sans-serif, sans-serif",
    image: "/stanleyslog/image.png",
    eyebrow: "Automated field notes",
    buildNotes: [
      { title: "Research runs on a schedule", text: "A GitHub Actions job gathers source material and prepares drafts without keeping a server awake." },
      { title: "Publishing is still inspectable", text: "Posts live as files in the repository, so every change has a visible history and can be corrected." },
      { title: "Failure is expected", text: "The pipeline can move between model options when one is unavailable instead of dropping the entire run." },
    ],
  },
  "portfolio-v2": {
    accent: "#ff705d",
    accent2: "#b189ff",
    background: "#08090d",
    surface: "#101218",
    text: "#f7f7f4",
    muted: "#9ca3af",
    font: "Inter, ui-sans-serif, system-ui, sans-serif",
    displayFont: "Inter, ui-sans-serif, system-ui, sans-serif",
    eyebrow: "Digital experience",
    buildNotes: [
      { title: "One site, several working systems", text: "Portfolio, publishing, project sync and monitoring share a codebase without sharing responsibilities." },
      { title: "Repository-backed work", text: "Visible GitHub projects are synced into the portfolio and can be curated without duplicating the source data." },
      { title: "Mobile comes first", text: "Navigation and content density are tuned for a small screen before desktop enhancements are added." },
    ],
  },
};

function getProjectTheme(slug?: string) {
  if (slug && PROJECT_THEMES[slug]) return PROJECT_THEMES[slug];

  const generatedIdentities = [
    { accent: "#7c9cff", accent2: "#70e1c8", background: "#090b12", surface: "#111522", font: "Inter, ui-sans-serif, system-ui, sans-serif" },
    { accent: "#f0b35a", accent2: "#ef7e6c", background: "#120e0a", surface: "#1d1710", font: "Georgia, 'Times New Roman', serif" },
    { accent: "#c6f36b", accent2: "#66d9cc", background: "#090c08", surface: "#12170f", font: "'Courier New', ui-monospace, monospace" },
    { accent: "#d89cff", accent2: "#7aa9ff", background: "#0e0912", surface: "#18101e", font: "ui-rounded, 'Arial Rounded MT Bold', system-ui, sans-serif" },
  ];
  const identityIndex = [...(slug || "project")].reduce((total, character) => total + character.charCodeAt(0), 0) % generatedIdentities.length;
  const generated = generatedIdentities[identityIndex];

  return {
    ...generated,
    text: "#f8fafc",
    muted: "#9ca3af",
    displayFont: generated.font,
    eyebrow: "Product engineering",
    buildNotes: [
      { title: "Repository-led profile", text: "The technology, activity and links on this page come from the project’s GitHub record." },
      { title: "A focused implementation", text: "The interface describes what is visible in the repository instead of making claims the code cannot prove." },
    ],
  };
}

export default function ProjectCaseStudy({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const [showModal, setShowModal] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [activeSection, setActiveSection] = useState("overview");
  const [copied, setCopied] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);

  const staticProject = projects.find((candidate) => candidate.slug === resolvedParams.slug);
  const [project, setProject] = useState<ProjectRecord | null>(staticProject || null);
  const [loading, setLoading] = useState(true);
  // Related projects (excluding current)
  const relatedProjects = projects.filter((p) => p.slug !== resolvedParams.slug).slice(0, 3);

  // Initialize project + theme
  useEffect(() => {
    const savedTheme = (localStorage.getItem("theme") as "dark" | "light") || "dark";
    const slug = resolvedParams.slug;
    const themeFrame = window.requestAnimationFrame(() => setTheme(savedTheme));

    fetch("/api/github/projects")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.projects) {
          const dbProj = (data.projects as GithubProjectRecord[]).find((candidate) => candidate.repoName === slug);
          if (dbProj) {
            setProject({
              title: dbProj.displayTitle || dbProj.repoName.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()),
              slug: dbProj.repoName,
              tag: dbProj.statusLabel || dbProj.language || "GitHub Repo",
              desc: dbProj.displayDesc || dbProj.description || "",
              tech: dbProj.displayTags?.length ? dbProj.displayTags : (dbProj.language ? [dbProj.language] : []),
              color: dbProj.repoName === "opnmrt" ? "#ff4d4d" : "#6b8cff",
              link: dbProj.homepage || dbProj.repoUrl || "#",
              homepage: dbProj.homepage || undefined,
              repo: dbProj.repoUrl || "#",
              status: dbProj.statusLabel || "Live",
              stars: dbProj.stars,
              forks: dbProj.forks,
              language: dbProj.language,
              lastPushedAt: dbProj.lastPushedAt,
              isGithub: true,
            });
          } else if (!projects.some((candidate) => candidate.slug === slug)) {
            setLoading(false);
          }
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));

    return () => window.cancelAnimationFrame(themeFrame);
  }, [resolvedParams.slug]);

  // Sync theme to DOM
  useEffect(() => {
    if (theme === "light") {
      document.documentElement.classList.add("light-mode");
    } else {
      document.documentElement.classList.remove("light-mode");
    }
  }, [theme]);

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
  if (!project) notFound();

  const projectTheme = getProjectTheme(project?.slug);
  const accentColor = projectTheme.accent;
  const hasLiveLink = project?.link && project.link !== "#";
  const galleryItems = ((projectGallery as Record<string, ProjectScreenshot[]>)[project.slug] || []);
  const previewTarget = project.homepage || (staticProject?.link && staticProject.link !== "#" ? staticProject.link : project.repo);
  const automaticScreenshotUrl = previewTarget
    ? `https://api.microlink.io/?url=${encodeURIComponent(previewTarget)}&screenshot=true&meta=false&embed=screenshot.url&viewport.width=1440&viewport.height=1000`
    : null;

  return (
    <div
      className="project-native relative min-h-screen transition-colors duration-300"
      style={{
        "--project-accent": projectTheme.accent,
        "--project-accent-2": projectTheme.accent2,
        "--project-bg": projectTheme.background,
        "--project-surface": projectTheme.surface,
        "--project-text": projectTheme.text,
        "--project-muted": projectTheme.muted,
        "--project-font": projectTheme.font,
        "--project-display-font": projectTheme.displayFont,
      } as React.CSSProperties}
    >
      <Starfield />
      <ContactModal isOpen={showModal} onClose={() => setShowModal(false)} />

      {/* Reading progress */}
      <div className="fixed top-0 left-0 w-full h-[3px] z-[1000] bg-transparent">
        <div ref={progressRef} className="h-full project-progress transition-all ease-linear" />
      </div>



      {/* ── PROJECT-AWARE EDITORIAL HERO ── */}
      <section
        className="case-hero"
      >
        <div className="case-hero-noise" aria-hidden="true" />
        <div className="case-hero-orb case-hero-orb-one" aria-hidden="true" />
        <div className="case-hero-orb case-hero-orb-two" aria-hidden="true" />

        <div className="case-hero-shell">
          <div className="case-hero-copy">
            <Link href="/?tab=projects" className="case-back-link">
              <ArrowLeft className="w-3.5 h-3.5" />
              Selected work
            </Link>

            <div className="case-kicker">
              <span>{projectTheme.eyebrow}</span>
              <span className="case-kicker-line" />
              <span>Case study</span>
            </div>

            <h1 className="case-title">{project?.title}</h1>
            <p className="case-description">{project?.desc}</p>

            <div className="case-meta-row">
              <span className="case-tag">{project?.tag}</span>
              <span className="case-status">
                <span
                  className="case-status-dot"
                  style={{
                    backgroundColor: ["Live", "Active"].includes(project.status || "") ? "#43d17b" : "#f4bd50",
                  }}
                />
                {project?.status}
              </span>
            </div>

            <div className="case-actions">
              {hasLiveLink && (
                <a href={project.link} target="_blank" rel="noopener noreferrer" className="case-primary-action">
                  Explore the product
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              )}
              <button onClick={() => scrollToSection("overview")} className="case-secondary-action">
                Read the story
                <span aria-hidden="true">↓</span>
              </button>
            </div>
          </div>

          <div className="case-visual-wrap" aria-label={`${project?.title} product preview`}>
            <div className="case-visual-index" aria-hidden="true">
              {String(projects.findIndex((item) => item.slug === project?.slug) + 1).padStart(2, "0")}
            </div>
            <div className="case-product-window">
              <div className="case-window-bar">
                <div className="case-window-dots"><i /><i /><i /></div>
                <span>{project?.title?.toLowerCase().replace(/\s+/g, "")}.product</span>
                <span className="case-window-secure">● live</span>
              </div>
              <div className="case-window-content">
                {projectTheme.image ? (
                  <Image
                    src={projectTheme.image}
                    alt={`${project?.title} interface preview`}
                    fill
                    priority
                    sizes="(max-width: 900px) 92vw, 56vw"
                  />
                ) : automaticScreenshotUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={automaticScreenshotUrl}
                    alt={`${project.title} homepage preview`}
                    className="case-automatic-screenshot"
                    loading="eager"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="case-interface-fallback">
                    <div className="case-interface-nav" />
                    <div className="case-interface-grid">
                      <div className="case-interface-main">
                        <span>{projectTheme.eyebrow}</span>
                        <strong>{project?.title}</strong>
                        <i />
                        <i />
                      </div>
                      <div className="case-interface-side">
                        <i /><i /><i />
                      </div>
                    </div>
                  </div>
                )}
                <div className="case-window-sheen" />
              </div>
            </div>
            <div className="case-floating-note case-floating-note-top">
              <span>Built for</span>
              <strong>clarity + scale</strong>
            </div>
            <div className="case-floating-note case-floating-note-bottom">
              <Zap className="w-4 h-4" />
              <span>Fast by design</span>
            </div>
          </div>
        </div>

        <div className="case-hero-footer">
          <span>Strategy</span><i />
          <span>Interface</span><i />
          <span>Engineering</span>
          <button onClick={() => scrollToSection("overview")} aria-label="Scroll to project overview">Scroll to discover ↓</button>
        </div>
      </section>

      {/* ── MOBILE SIDEBAR DRAWER ── */}
      <div className="md:hidden">
        {/* Backdrop overlay */}
        <div
          onClick={() => setMobileNavOpen(false)}
          className={`fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
            mobileNavOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        />

        {/* Drawer panel — slides in from left */}
        <div
          className={`mobile-drawer fixed top-0 left-0 h-full w-[75vw] max-w-[280px] z-[100] flex flex-col
            shadow-[4px_0_50px_rgba(0,0,0,0.6)]
            transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]
            ${ mobileNavOpen ? "translate-x-0" : "-translate-x-full" }`}
        >
          {/* Drawer header */}
          <div className="mobile-drawer-header flex items-center justify-between px-4 pt-5 pb-3.5">
            <div className="flex items-center gap-2">
              <div
                className="w-1.5 h-1.5 rounded-full animate-pulse shrink-0"
                style={{ backgroundColor: "var(--coral)", boxShadow: "0 0 6px var(--coral)" }}
              />
              <span className="mobile-drawer-label text-[9px] font-black uppercase tracking-[0.28em]">Case Study</span>
            </div>
            <button
              onClick={() => setMobileNavOpen(false)}
              className="mobile-drawer-close p-1 rounded-lg transition-all duration-200"
              aria-label="Close navigation"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Project name */}
          <div className="mobile-drawer-project px-4 py-3">
            <p className="mobile-drawer-subtext text-[9px] font-mono uppercase tracking-widest mb-0.5">Viewing</p>
            <p className="mobile-drawer-title text-sm font-black leading-tight truncate">{project?.title}</p>
          </div>

          {/* Section Navigation */}
          <nav className="flex-1 overflow-y-auto px-2.5 py-3 space-y-0.5">
            <p className="mobile-drawer-label text-[8px] font-black uppercase tracking-[0.28em] px-3 mb-2.5">Sections</p>
            {SECTIONS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => { scrollToSection(id); setMobileNavOpen(false); }}
                className={`drawer-nav-item w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left text-xs font-bold tracking-tight transition-all duration-200 ${
                  activeSection === id
                    ? "drawer-nav-active"
                    : "drawer-nav-inactive"
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 shrink-0 transition-colors duration-200 ${
                    activeSection === id ? "text-[var(--coral)]" : ""
                  }`}
                />
                <span>{label}</span>
                {activeSection === id && (
                  <span
                    className="ml-auto w-1 h-1 rounded-full shrink-0"
                    style={{ backgroundColor: "var(--coral)" }}
                  />
                )}
              </button>
            ))}
          </nav>

          {/* Bottom actions */}
          <div className="mobile-drawer-footer px-3 py-4 space-y-2">
            <button
              onClick={() => { setShowModal(true); setMobileNavOpen(false); }}
              className="w-full py-2.5 rounded-lg bg-[var(--coral)] text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-[0_0_16px_rgba(255,77,77,0.3)] transition-all duration-200 active:scale-[0.98]"
            >
              Hire Samuel
            </button>
            <div className="flex gap-1.5">
              <button
                onClick={copyLink}
                className="mobile-drawer-btn flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all duration-200"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                {copied ? "Copied" : "Share"}
              </button>
              <button
                onClick={toggleTheme}
                className="mobile-drawer-btn px-3.5 py-2 rounded-lg text-xs transition-all duration-200"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? "☀️" : "🌙"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── SECTION NAV (Sticky) ── */}
      <div className="case-sticky-nav sticky top-0 z-50 bg-[var(--bg)]/95 backdrop-blur-xl border-b border-white/5 shadow-lg transition-all duration-300">

        {/* ─ MOBILE: Slim topbar with hamburger ─ */}
        <div className="md:hidden flex items-center justify-between px-4 h-12">
          {/* Left: Back */}
          <Link
            href="/?tab=projects"
            className="group flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-white/55 hover:text-white transition-all duration-200"
          >
            <ArrowLeft className="w-3 h-3 transition-transform group-hover:-translate-x-0.5 duration-200" />
            Back
          </Link>

          {/* Center: Active section label */}
          <span className="text-[9px] font-black uppercase tracking-[0.22em] text-white/25">
            {SECTIONS.find(s => s.id === activeSection)?.label ?? "Overview"}
          </span>

          {/* Right: Hamburger */}
          <button
            onClick={() => setMobileNavOpen(true)}
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 border border-white/8 text-white/55 hover:text-white transition-all duration-200 active:scale-95"
            aria-label="Open navigation"
          >
            <Menu className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* ─ DESKTOP: Single-line layout ─ */}
        <div className="hidden md:flex items-center justify-between max-w-7xl mx-auto px-8">
          {/* Left: Back Link */}
          <Link
            href="/?tab=projects"
            className="group flex items-center gap-2 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/60 hover:text-white transition-all duration-200 shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1 duration-300" />
            Back
          </Link>

          {/* Center: Section Menu */}
          <nav className="flex items-center gap-0 overflow-x-auto scrollbar-none mx-4">
            {SECTIONS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => scrollToSection(id)}
                className={`flex items-center gap-1.5 px-4 py-4 text-[10px] font-black uppercase tracking-[0.15em] border-b-2 transition-all duration-200 whitespace-nowrap ${
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

          {/* Right: Actions */}
          <div className="flex items-center gap-2.5 py-3 shrink-0">
            <button
              onClick={copyLink}
              className="p-2 rounded-lg bg-white/5 border border-white/5 text-white/60 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 active:scale-95"
              aria-label="Share page"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-white/5 border border-white/5 text-white/60 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 text-xs active:scale-95"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>

            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 rounded-lg bg-[var(--coral)] hover:bg-[var(--coral)]/90 text-white text-[9px] font-black uppercase tracking-[0.15em] shadow-[0_0_15px_rgba(255,77,77,0.2)] transition-all duration-300 hover:scale-105 active:scale-95"
            >
              Hire Samuel
            </button>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <main className="case-study-main relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-16">
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
                {!["opnmrt", "samuelstanley", "empi-costumes", "study-express-uk", "stanleys-log"].includes(project.slug) && (
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

              {galleryItems.length > 0 ? (
                <ProjectGallery projectTitle={project.title} items={galleryItems} />
              ) : automaticScreenshotUrl && previewTarget ? (
                <AutomaticProjectPreview
                  project={project}
                  screenshotUrl={automaticScreenshotUrl}
                  targetUrl={previewTarget}
                />
              ) : (
                <div className="native-repository-preview">
                  <GitBranch className="w-6 h-6" />
                  <p className="native-repository-label">Repository project</p>
                  <h3>{project?.title}</h3>
                  <p>{project?.desc || "This project does not publish a separate live preview."}</p>
                  <div>
                    {project?.tech?.map((technology: string) => <span key={technology}>{technology}</span>)}
                  </div>
                  {project?.repo && project.repo !== "#" && (
                    <a href={project.repo} target="_blank" rel="noopener noreferrer">
                      Open repository <ArrowUpRight className="w-4 h-4" />
                    </a>
                  )}
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projectTheme.buildNotes.map((card, i) => (
                  <div key={i} className="group p-6 rounded-2xl border border-white/8 bg-white/2 hover:bg-white/4 hover:border-white/15 transition-all duration-300 space-y-3 reveal">
                    <span className="native-note-number">{String(i + 1).padStart(2, "0")}</span>
                    <h3 className="text-base font-black tracking-tight text-white">{card.title}</h3>
                    <p className="text-sm text-white/50 leading-relaxed">{card.text}</p>
                  </div>
                ))}
              </div>

              <p className="native-source-note reveal">
                This section is written from the implementation notes for {project?.title}. Repository activity and technology labels are synced from GitHub.
              </p>
            </section>

            {/* ── SECTION: METRICS ── */}
            <section id="metrics" className="scroll-mt-32">
              <SectionHeader
                icon={<BarChart3 className="w-5 h-5" />}
                label="05"
                title="Repository Snapshot"
                color={accentColor}
              />

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  {
                    icon: <Code2 className="w-5 h-5" />,
                    value: project?.language || project?.tech?.[0] || "—",
                    label: "Primary language",
                  },
                  {
                    icon: <Star className="w-5 h-5" />,
                    value: typeof project?.stars === "number" ? project.stars : "—",
                    label: "GitHub stars",
                  },
                  {
                    icon: <GitFork className="w-5 h-5" />,
                    value: typeof project?.forks === "number" ? project.forks : "—",
                    label: "GitHub forks",
                  },
                  {
                    icon: <Activity className="w-5 h-5" />,
                    value: project?.status || "Live",
                    label: "Status",
                  },
                ].map((metric, i) => (
                  <div key={i} className="native-repo-stat p-5 rounded-2xl text-center space-y-2 reveal">
                    <div className="flex justify-center native-repo-stat-icon">{metric.icon}</div>
                    <div className="text-xl font-black font-mono">{metric.value}</div>
                    <div className="text-[10px] uppercase tracking-widest text-white/30">{metric.label}</div>
                  </div>
                ))}
              </div>

              {project?.repo && project.repo !== "#" && (
                <a className="native-repo-link" href={project.repo} target="_blank" rel="noopener noreferrer">
                  <GitBranch className="w-4 h-4" />
                  View the source repository
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              )}

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
                {relatedProjects.map((rp) => {
                  const relatedTheme = getProjectTheme(rp.slug);
                  return <Link
                    key={rp.slug}
                    href={`/project/${rp.slug}`}
                    className="group relative p-5 rounded-2xl border border-white/8 bg-white/2 hover:bg-white/5 hover:border-white/20 transition-all duration-300 overflow-hidden reveal"
                  >
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ background: `radial-gradient(ellipse at top left, ${relatedTheme.accent}20 0%, transparent 70%)` }}
                    />
                    <div className="relative z-10">
                      <div
                        className="w-10 h-10 rounded-xl mb-4 flex items-center justify-center text-lg font-black"
                        style={{ background: `${relatedTheme.accent}20`, border: `1px solid ${relatedTheme.accent}30` }}
                      >
                        {getTechIcon(rp.tech?.[0] || "")}
                      </div>
                      <div
                        className="text-[10px] font-black uppercase tracking-[0.25em] mb-2"
                        style={{ color: relatedTheme.accent }}
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
                })}
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

                  {/* GitHub stats removed */}

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
      <section className="case-study-cta relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pb-24 mt-16">
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

function AutomaticProjectPreview({
  project,
  screenshotUrl,
  targetUrl,
}: {
  project: ProjectRecord;
  screenshotUrl: string;
  targetUrl: string;
}) {
  return (
    <a
      className="automatic-project-preview"
      href={targetUrl}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="automatic-project-browser">
        <span><i /><i /><i /></span>
        <small>{new URL(targetUrl, "https://samuelstanley.com").hostname}</small>
        <ArrowUpRight className="w-4 h-4" />
      </div>
      <div className="automatic-project-image-wrap">
        {/* Dynamic screenshot-service URLs cannot be passed through next/image safely. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={screenshotUrl}
          alt={`${project.title} live homepage`}
          className="automatic-project-image"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      </div>
      <span className="automatic-project-caption">
        <span>
          <small>Automatically captured</small>
          <strong>{project.title} homepage</strong>
        </span>
        <em>Open live product ↗</em>
      </span>
    </a>
  );
}

function ProjectGallery({
  projectTitle,
  items,
}: {
  projectTitle: string;
  items: ProjectScreenshot[];
}) {
  const [selected, setSelected] = useState<ProjectScreenshot | null>(null);
  const featured = items[0];
  const supporting = items.slice(1);

  useEffect(() => {
    if (!selected) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [selected]);

  return (
    <>
      <div className="project-gallery">
        <button className="project-gallery-feature" onClick={() => setSelected(featured)}>
          <Image
            src={featured.src}
            width={featured.width}
            height={featured.height}
            sizes="(max-width: 1024px) 100vw, 850px"
            alt={`${projectTitle}: ${featured.label}`}
            className="project-gallery-image"
          />
          <span className="project-gallery-overlay">
            <span>
              <small>Featured screen</small>
              <strong>{featured.label}</strong>
            </span>
            <span className="project-gallery-expand">View full screen ↗</span>
          </span>
        </button>

        {supporting.length > 0 && (
          <div className="project-gallery-grid">
            {supporting.map((item, index) => (
              <button
                key={item.id}
                className={`project-gallery-card ${item.height > item.width ? "is-portrait" : ""}`}
                onClick={() => setSelected(item)}
              >
                <div className="project-gallery-media">
                  <Image
                    src={item.src}
                    width={item.width}
                    height={item.height}
                    sizes="(max-width: 640px) 100vw, 420px"
                    alt={`${projectTitle}: ${item.label}`}
                    className="project-gallery-image"
                  />
                </div>
                <span className="project-gallery-caption">
                  <small>{String(index + 2).padStart(2, "0")}</small>
                  <span>
                    <strong>{item.label}</strong>
                    <em>{item.description}</em>
                  </span>
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {selected && (
        <div
          className="project-gallery-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${selected.label} screenshot`}
          onClick={() => setSelected(null)}
        >
          <button className="project-gallery-close" onClick={() => setSelected(null)} aria-label="Close screenshot">
            <X className="w-5 h-5" />
          </button>
          <div className="project-gallery-lightbox-inner" onClick={(event) => event.stopPropagation()}>
            <Image
              src={selected.src}
              width={selected.width}
              height={selected.height}
              sizes="96vw"
              alt={`${projectTitle}: ${selected.label}`}
              className="project-gallery-lightbox-image"
              priority
            />
            <div>
              <strong>{selected.label}</strong>
              <p>{selected.description}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

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
        <strong className="text-white">OPNMRT</strong> started with a practical question: can an independent seller run a proper online store without giving up their brand, customer data or a percentage of every sale?
      </p>
      <p>The result is a shared commerce engine that gives each merchant a separate storefront, catalogue and operating space. It is closer to infrastructure for sellers than a marketplace competing for their customers.</p>
      <SectionTitle>How it is put together</SectionTitle>
      <ul className="space-y-4">
        <BulletPoint color={accentColor}><strong className="text-white">Tenant boundaries:</strong> every store is identified in the data model, so catalogue and order queries always run in the correct merchant context.</BulletPoint>
        <BulletPoint color={accentColor}><strong className="text-white">Store identity:</strong> merchants can work from an OPNMRT subdomain or connect a domain they already own.</BulletPoint>
        <BulletPoint color={accentColor}><strong className="text-white">Split responsibilities:</strong> the Next.js storefront, NestJS API and shared packages live in one workspace without becoming one large application.</BulletPoint>
      </ul>
      <SectionTitle>Money goes directly to the merchant</SectionTitle>
      <ul className="space-y-4">
        <BulletPoint color={accentColor}>A seller connects their own Paystack or Flutterwave account.</BulletPoint>
        <BulletPoint color={accentColor}>OPNMRT confirms the transaction and updates the order, but it does not hold the seller&apos;s funds.</BulletPoint>
      </ul>
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
        EMPI Costumes needed more than a product grid. A costume can be sold, rented for specific dates, or made from a client&apos;s measurements—and the studio still needs one reliable view of the work.
      </p>
      <SectionTitle>One shop, three kinds of order</SectionTitle>
      <p>The bespoke flow keeps measurements and visual references with the request. Rentals carry their availability and return obligations. Regular purchases stay quick. Those paths meet in a unified order view for the studio team.</p>
      <SectionTitle>What the team works with</SectionTitle>
      <ul className="space-y-4">
        <BulletPoint color={accentColor}>Invoices that account for custom work and rental deposits.</BulletPoint>
        <BulletPoint color={accentColor}>Live order updates in the studio dashboard.</BulletPoint>
        <BulletPoint color={accentColor}>Paystack verification tied back to the correct order.</BulletPoint>
      </ul>
    </div>
  );
}

function StudyExpressOverview({ accentColor }: { accentColor: string }) {
  return (
    <div className="space-y-6 text-white/70 text-lg leading-relaxed">
      <p className="text-xl md:text-2xl font-semibold text-white/80">
        Study Express UK brings courses, professional events and corporate training into one place. The important work was making a broad catalogue feel straightforward to someone deciding what to learn next.
      </p>
      <SectionTitle>Different jobs, different views</SectionTitle>
      <p>Learners need enrolment and progress. Instructors need course delivery tools. Administrators need oversight. Authentication separates those responsibilities without sending people through unrelated screens.</p>
      <SectionTitle>The working parts</SectionTitle>
      <ul className="space-y-4">
        <BulletPoint color={accentColor}>Course enrolment and learner progress.</BulletPoint>
        <BulletPoint color={accentColor}>Bookings for physical, online and hybrid events.</BulletPoint>
        <BulletPoint color={accentColor}>Separate learner, instructor and administrator access.</BulletPoint>
      </ul>
    </div>
  );
}

function StanleysLogOverview({ accentColor }: { accentColor: string }) {
  return (
    <div className="space-y-6 text-white/70 text-lg leading-relaxed">
      <p className="text-xl md:text-2xl font-semibold text-white/80">
        <strong className="text-white">Stanley&apos;s Log</strong> is a publishing experiment: can research, drafting and deployment run on a dependable schedule while every published article remains easy to inspect and edit?
      </p>
      <SectionTitle>The publishing loop</SectionTitle>
      <ul className="space-y-4">
        <BulletPoint color={accentColor}>A scheduled GitHub Action starts the research run.</BulletPoint>
        <BulletPoint color={accentColor}>Sources are checked against existing posts before a draft is created.</BulletPoint>
        <BulletPoint color={accentColor}>The finished article is committed as content, leaving an ordinary Git history rather than a hidden publishing database.</BulletPoint>
        <BulletPoint color={accentColor}>A protected control screen shows what ran and allows a manual retry.</BulletPoint>
      </ul>
    </div>
  );
}

function GenericOverview({ project, accentColor }: { project: ProjectRecord; accentColor: string }) {
  return (
    <div className="space-y-6 text-white/70 text-lg leading-relaxed">
      <p className="text-xl md:text-2xl font-semibold text-white/80">
        <strong className="text-white">{project?.title}</strong> — {project?.desc || "a software project synced from the public repository."}
      </p>
      <p>This page deliberately stays close to the repository record. It does not invent traffic, test coverage or architectural claims that are not part of the published project information.</p>
      <SectionTitle>What is visible</SectionTitle>
      <ul className="space-y-4">
        {project?.tech?.map((technology: string) => (
          <BulletPoint key={technology} color={accentColor}>{technology} is listed in the project&apos;s curated technology set.</BulletPoint>
        ))}
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
