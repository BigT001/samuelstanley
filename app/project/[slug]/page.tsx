"use client";

import { use, useState, useEffect, useRef } from "react";
import { notFound } from "next/navigation";
import { projects } from "../../components/data";
import Link from "next/link";
import { ContactModal } from "../../components/ui";
import { Starfield } from "../../components/Starfield";

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

  const project = projects.find((p) => p.slug === resolvedParams.slug);

  useEffect(() => {
    const savedTheme =
      (localStorage.getItem("theme") as "dark" | "light") || "dark";
    setTheme(savedTheme);
    setMounted(true);
  }, []);

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

  if (!project) notFound();

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
          href="/#projects"
          className="group relative px-6 py-3 rounded-full bg-surface/30 backdrop-blur-md text-[10px] font-black uppercase tracking-[0.3em] text-primary/80 hover:text-accent shadow-lg hover:shadow-accent/20 transition-all duration-300 flex items-center gap-3 overflow-hidden"
        >
          <span className="relative z-10 transition-transform duration-300 group-hover:-translate-x-1">←</span> 
          <span className="relative z-10">Back</span>
          <div className="absolute inset-0 bg-accent/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        </Link>
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
                {project.tech.map((t) => (
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
                <div className="w-full h-[300px] md:h-[400px] rounded-3xl bg-gradient-to-br from-surface to-[#0a0f1a] border border-border/20 flex flex-col items-center justify-center relative overflow-hidden group shadow-2xl">
                  <div className="absolute inset-0 bg-accent/5 opacity-50 mix-blend-overlay" />
                  <div className="w-32 h-32 blur-[80px] bg-accent rounded-full opacity-30 group-hover:scale-150 transition-transform duration-1000" />
                  <span className="absolute text-[10px] font-black uppercase tracking-[0.5em] text-accent/50">
                    Architectural Diagram
                  </span>
                </div>
              )}
            </div>

            {/* Article Body */}
            <article className="prose-like text-lg md:text-xl leading-[1.8] text-primary/80 space-y-12 reveal reveal-up pt-8 border-t border-border/20">
              {project.slug === "opnmrt" ? (
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

                  <h2 className="text-3xl md:text-4xl font-black tracking-tight mt-16 mb-6">
                    6. The Technical Stack
                  </h2>
                  <p className="mb-6">OPNMRT is built using a modern, scalable, and highly performant full-stack architecture:</p>
                  <ul className="space-y-4 mb-16 text-primary/80">
                    <li className="flex gap-4 items-start"><span className="text-accent mt-1 font-bold">✦</span><span><strong>Frontend:</strong> Next.js (App Router), styled with Tailwind CSS, shadcn/ui, Radix UI, and Framer Motion for premium aesthetics. State is managed via React Query (server) and Zustand (client).</span></li>
                    <li className="flex gap-4 items-start"><span className="text-accent mt-1 font-bold">✦</span><span><strong>Backend:</strong> NestJS (Node.js) using Modular, Domain-Driven Design. It exposes a deeply segmented REST API (Public, Seller, Buyer, Admin).</span></li>
                    <li className="flex gap-4 items-start"><span className="text-accent mt-1 font-bold">✦</span><span><strong>Database Layer:</strong> PostgreSQL managed via Prisma ORM (enforcing strict tenant isolation). Redis is utilized for caching session data, AI insights, and rate-limiting.</span></li>
                    <li className="flex gap-4 items-start"><span className="text-accent mt-1 font-bold">✦</span><span><strong>Real-time & Events:</strong> Event-driven side effects (<code className="text-accent bg-accent/10 px-2 rounded">ORDER_CREATED</code>, <code className="text-accent bg-accent/10 px-2 rounded">STOCK_UPDATED</code>) using WebSockets (Socket.IO), Redis Pub/Sub, and background cron jobs.</span></li>
                  </ul>

                  <h2 className="text-3xl md:text-4xl font-black tracking-tight mt-16 mb-6">
                    7. Monetization / Pricing Model
                  </h2>
                  <p className="mb-6">The platform monetizes via software subscriptions rather than transaction fees:</p>
                  <ul className="space-y-4 mb-16 text-primary/80">
                    <li className="flex gap-4 items-start"><span className="text-accent mt-1 font-bold">✦</span><span><strong>Free Tier:</strong> Allows platform subdomain usage, basic analytics, and a limited product count.</span></li>
                    <li className="flex gap-4 items-start"><span className="text-accent mt-1 font-bold">✦</span><span><strong>Paid Tier:</strong> Unlocks custom domains, unlimited products, advanced AI assistant features, and priority support.</span></li>
                  </ul>

                  <blockquote className="border-l-[3px] border-accent pl-8 py-2 my-12 text-2xl md:text-3xl font-serif italic text-primary/80 reveal reveal-left">
                    "OPNMRT is an extremely sophisticated commerce operating system. It elegantly marries the ease of setup found in modern SaaS platforms with the operational independence and lack of fee-sharing found in self-hosted solutions. With built-in AI intelligence, a robust Event-Driven NestJS/Next.js stack, and direct BYOK payment routing, it is built to scale high-end, independent retail operations seamlessly."
                  </blockquote>
                </>
              ) : project.slug === "admin-support-hq" ? (
                <>
                  <p className="text-2xl md:text-3xl leading-relaxed font-semibold">
                    The Admin Support HQ is the nerve center of the OPNMRT
                    ecosystem. Managing high-trust scalable commerce requires a
                    resilient control center engineered for secure, rapid
                    operational oversight.
                  </p>

                  <h2 className="text-3xl md:text-4xl font-black tracking-tight mt-16 mb-2">
                    Zero-Trust Security
                  </h2>
                  <p>
                    We implemented strict Role-Based Access Control (RBAC)
                    alongside hardware-bound session tracking. This ensures that
                    sensitive merchant data remains completely isolated and
                    audit-ready.
                  </p>

                  <blockquote className="border-l-[3px] border-accent pl-8 py-2 my-12 text-2xl md:text-3xl font-serif italic text-primary/80 reveal reveal-left">
                    "Trust is earned through rigorous verification and
                    uncompromised security. This dashboard enforces both."
                  </blockquote>

                  <p>
                    Customer support engineers and compliance teams can moderate
                    financial disputes and review flagged activities without
                    ever requiring or exposing direct connection strings to the
                    production databases.
                  </p>

                  <h2 className="text-3xl md:text-4xl font-black tracking-tight mt-16 mb-2">
                    Verification Pipelines
                  </h2>
                  <p>
                    High-stakes operational workflows, including manual payment
                    receipt scanning, merchant KYC validation, and rider
                    vetting, are entirely streamlined. The architecture handles
                    massive throughput securely, enabling human administrators
                    to process verifications in seconds rather than minutes.
                  </p>
                </>
              ) : project.slug === "portfolio-v2" ? (
                <>
                  <p className="text-2xl md:text-3xl leading-relaxed font-semibold">
                    Portfolio v2 is built to feel like high-end operational
                    software rather than a traditional brochure. It combines
                    deep space aesthetics, scroll-linked animations, and
                    rigorous performance optimization into a unified narrative.
                  </p>

                  <blockquote className="border-l-[3px] border-accent pl-8 py-2 my-12 text-2xl md:text-3xl font-serif italic text-primary/80 reveal reveal-left">
                    "Software should look as precise and limitless as the code
                    that powers it."
                  </blockquote>

                  <h2 className="text-3xl md:text-4xl font-black tracking-tight mt-16 mb-2">
                    Architectural Rendering
                  </h2>
                  <p>
                    The case study engine itself uses a modular layout paired
                    with an intersection-observer sequence. This gracefully
                    reveals complex technical specifications alongside reactive
                    reading progress bars, resulting in an immersive reading
                    experience.
                  </p>

                  <h2 className="text-3xl md:text-4xl font-black tracking-tight mt-16 mb-2">
                    Deep Space CSS Optimization
                  </h2>
                  <p>
                    To achieve the signature look, I engineered a multi-layered,
                    hardware-accelerated starfield. It is implemented entirely
                    and natively in CSS.
                  </p>
                  <p>
                    By shedding Javascript overhead for ambient background
                    effects, the site achieves buttery-smooth 60fps
                    scrolling—even on mobile devices—while fully integrating
                    with a dynamic Light/Dark mode global switch.
                  </p>
                </>
              ) : project.slug === "empi-costumes" ? (
                <>
                  <p className="text-2xl md:text-3xl leading-relaxed font-semibold">
                    EMPI Costumes isn't just a storefront—it's a comprehensive
                    digital boutique operating system built to power an elite
                    costume creation and rental studio in Lagos, Nigeria.
                  </p>

                  <h2 className="text-3xl md:text-4xl font-black tracking-tight mt-16 mb-4">
                    Beyond E-Commerce: The Bespoke Workflow
                  </h2>
                  <p className="mb-6">
                    The studio needed more than off-the-rack sales. I engineered
                    a sophisticated "Bespoke" pipeline where users submit custom
                    design requests complete with individual measurements and
                    thematic references. Under the hood, a unified{" "}
                    <code className="text-accent bg-accent/10 px-2 rounded">
                      UnifiedOrder
                    </code>{" "}
                    model seamlessly reconciles traditional rentals with complex
                    tailoring requirements.
                  </p>
                  <p>
                    The customer experience relies on kinetic scrolling, dynamic
                    currency switches, and responsive themes, creating a premium
                    feel that converts high-end clients.
                  </p>

                  <div className="mt-16 mb-20 reveal reveal-up">
                    <img
                      src="/empiimages/Screenshot%202026-04-01%20071449.png"
                      alt="EMPI ERP Interface"
                      className="w-full h-auto object-cover rounded-3xl border border-border/20 shadow-2xl transition-transform hover:scale-[1.02] duration-500"
                    />
                  </div>

                  <h2 className="text-3xl md:text-4xl font-black tracking-tight mt-16 mb-4">
                    Enterprise Resource Planning (ERP) at the Core
                  </h2>
                  <p className="mb-6">
                    While the frontend dazzles customers, the backend acts as a
                    full-scale ERP suite for the EMPI team. Built on{" "}
                    <strong>Next.js 15+ and MongoDB</strong>, the system
                    provides complete control over logistics, order fulfillment,
                    and financial tracking down to the VAT level.
                  </p>

                  <ul className="space-y-4 mb-16 text-primary/80">
                    <li className="flex gap-4 items-start">
                      <span className="text-accent mt-1 font-bold">✦</span>
                      <span>
                        <strong>Automated Invoicing:</strong> Auto-generates
                        professional PDF invoices via HTML-to-PDF pipelines for
                        damage deposits and custom orders.
                      </span>
                    </li>
                    <li className="flex gap-4 items-start">
                      <span className="text-accent mt-1 font-bold">✦</span>
                      <span>
                        <strong>Real-Time Sync:</strong> Employs Socket.io
                        web-sockets to keep admin dashboards instantly
                        synchronized across the studio floor as orders and
                        payments flow in.
                      </span>
                    </li>
                    <li className="flex gap-4 items-start">
                      <span className="text-accent mt-1 font-bold">✦</span>
                      <span>
                        <strong>Data Integrity:</strong> Monitored by proactive
                        cron-jobs and diagnostic pipelines that ensure absolute
                        database consistency during high-volume periods.
                      </span>
                    </li>
                  </ul>

                  <h2 className="text-3xl md:text-4xl font-black tracking-tight mt-16 mb-4">
                    The Result
                  </h2>
                  <p>
                    By directly integrating Stripe for payments, Cloudinary for
                    asset delivery, and Resend for transactional hooks, EMPI
                    Costumes now operates with the operational efficiency of a
                    tech startup while maintaining the artistic soul of a
                    bespoke design studio.
                  </p>
                </>
              ) : project.slug === "study-express-uk" ? (
                <>
                  <p className="text-2xl md:text-3xl leading-relaxed font-semibold">
                    Study Express UK is a comprehensive educational technology
                    (EdTech) platform empowering global learners with
                    high-quality courses, events, and certifications
                    specifically focused on studying in the UK.
                  </p>

                  <h2 className="text-3xl md:text-4xl font-black tracking-tight mt-16 mb-4">
                    Core Stack & Architecture
                  </h2>
                  <p className="mb-6">
                    The platform architecture is built for scale, utilizing the
                    modern Next.js App Router, React, and TypeScript. At its
                    core, it leverages MongoDB via Mongoose for adaptable,
                    document-based storage. NextAuth.js guarantees multi-role
                    security, while Stripe handles complex event, course, and
                    subscription payments smoothly.
                  </p>

                  <h2 className="text-3xl md:text-4xl font-black tracking-tight mt-16 mb-4">
                    Robust E-Learning Engine
                  </h2>
                  <p className="mb-6">
                    The application supports extensive course management,
                    tracking detailed enrollment metrics, learner progression
                    paths, and completion rates across all content levels. The
                    built-in event management engine easily coordinates
                    physical, online, and hybrid live events with intelligent
                    capacity tracking and rich multi-tiered ticketing (including
                    Free, Premium, and Corporate options).
                  </p>

                  <div className="mt-16 mb-20 reveal reveal-up">
                    <img
                      src="/studyexpress/Screenshot%202026-04-01%20094017.png"
                      alt="Study Express Analytics Dashboard"
                      className="w-full h-auto object-cover rounded-3xl border border-border/20 shadow-2xl transition-transform hover:scale-[1.02] duration-500"
                    />
                  </div>

                  <h2 className="text-3xl md:text-4xl font-black tracking-tight mt-16 mb-4">
                    Multi-Tiered Structure: B2C & B2B
                  </h2>
                  <p className="mb-6">
                    Understanding the diverse user base, the platform
                    effortlessly separates enterprise usage from individual
                    learners. Individual users maintain granular control over
                    their profile and course enrollments, while the B2B suite
                    empowers corporate entities. Companies manage custom
                    &quot;Corporate Staff&quot; profiles and directly deploy
                    team-wide memberships for exclusive training programs.
                  </p>

                  <h2 className="text-3xl md:text-4xl font-black tracking-tight mt-16 mb-4">
                    Comprehensive Administrative Analytics
                  </h2>
                  <p>
                    Ensuring platform health requires profound insights. Custom
                    analytics suites provide top-level executives and
                    sub-administrators real-time data dissecting e-commerce
                    revenue (such as price distribution and course sales)
                    directly beside deep user retention analytics and
                    interactive event performance reports.
                  </p>
                </>
              ) : project.slug === "stanleys-log" ? (
                <>
                  <p className="text-2xl md:text-3xl leading-relaxed font-semibold">
                    <strong>Stanley’s Log v2</strong> is more than just a blog — it is a sophisticated, autonomous AI content ecosystem. It was engineered to bridge the gap between intelligent data scraping and automated, high-end digital publishing.
                  </p>
                  <p className="mt-6">
                    This project demonstrates a full-stack engineering approach to AI integration, prioritizing security, resilience, and operational efficiency through a "Sovereign AI" philosophy.
                  </p>

                  <h2 className="text-3xl md:text-4xl font-black tracking-tight mt-16 mb-6">
                    1. Autonomous Intelligence & Fallback Resilience
                  </h2>
                  <p className="mb-6">
                    The heart of the system is the <strong>Content Agent</strong>. Using a custom TypeScript engine, it intelligently scrapes and resolves complex redirects from Google News and global RSS feeds.
                  </p>
                  <ul className="space-y-4 mb-16 text-primary/80">
                    <li className="flex gap-4 items-start"><span className="text-accent mt-1 font-bold">✦</span><span><strong>Multi-Model Intelligence:</strong> To ensure 100% uptime, I implemented a robust fallback chain using <strong>Gemini 1.5 Pro, Flash, and 8B</strong>. If one model hits a rate limit, the agent automatically "downgrades" or retries to maintain the publishing schedule.</span></li>
                    <li className="flex gap-4 items-start"><span className="text-accent mt-1 font-bold">✦</span><span><strong>Dynamic Scrapers:</strong> The scraper uses advanced Cheerio selectors and mobile User-Agent spoofing to bypass common robot protections, ensuring fresh Nigerian and global tech news is always available.</span></li>
                  </ul>

                  <h2 className="text-3xl md:text-4xl font-black tracking-tight mt-16 mb-6">
                    2. Enterprise Workflow & Dispatch System
                  </h2>
                  <p className="mb-6">
                    One of the most complex challenges was enabling a web-based dashboard on a read-only serverless platform (Vercel). I engineered an <strong>Enterprise Workflow Dispatch</strong> system:
                  </p>
                  <ul className="space-y-4 mb-16 text-primary/80">
                    <li className="flex gap-4 items-start"><span className="text-accent mt-1 font-bold">✦</span><span>When you click "Run Agent" on the live site, the API signals a <strong>GitHub Action Workflow</strong> via a secure, tokenized dispatch.</span></li>
                    <li className="flex gap-4 items-start"><span className="text-accent mt-1 font-bold">✦</span><span>GitHub launches a virtual machine to generate the post, commits it back to the repository, and triggers a fresh Vercel deployment — all without human intervention.</span></li>
                  </ul>

                  <h2 className="text-3xl md:text-4xl font-black tracking-tight mt-16 mb-6">
                    3. Security & Admin Infrastructure
                  </h2>
                  <p className="mb-6">
                    Security was treated as a first-class citizen. I built a private <strong>Admin Gateway</strong> that protects the manual triggers:
                  </p>
                  <ul className="space-y-4 mb-16 text-primary/80">
                    <li className="flex gap-4 items-start"><span className="text-accent mt-1 font-bold">✦</span><span><strong>Lock-Screen Access:</strong> A session-based authentication layer requires a secure <code>AGENT_SECRET</code> before any administrative UI is revealed.</span></li>
                    <li className="flex gap-4 items-start"><span className="text-accent mt-1 font-bold">✦</span><span><strong>Session Management:</strong> Utilizes browser-native <code>sessionStorage</code> to manage access tokens securely without long-term tracking.</span></li>
                  </ul>
                  
                  <blockquote className="border-l-[3px] border-accent pl-8 py-2 my-12 text-2xl md:text-3xl font-serif italic text-primary/80 reveal reveal-left">
                    "Automation without security is a liability. In v2, we ensured that the agent is both incredibly powerful and strictly protected."
                  </blockquote>

                  <h2 className="text-3xl md:text-4xl font-black tracking-tight mt-16 mb-6">
                    4. Professional SEO & Visibility
                  </h2>
                  <p className="mb-6">
                    The blog was optimized for maximum discovery. Every post is automatically wrapped in <strong>Schema.org JSON-LD</strong> structured data (Article schema), with dynamic metadata titles, canonical URLs, and OpenGraph tags to ensure it looks professional in search results and social shares.
                  </p>

                  <blockquote className="border-l-[3px] border-accent pl-8 py-2 my-12 text-2xl md:text-3xl font-serif italic text-primary/80 reveal reveal-left">
                    "Stanley’s Log v2 is a showcase of Sovereign Software Engineering. It demonstrates a mastery of AI workflows, API-driven automation, and secure, high-performance web architecture."
                  </blockquote>
                </>
              ) : (
                <>
                  <p className="text-2xl md:text-3xl leading-relaxed font-semibold">
                    Architectural mapping for {project.title} is currently in
                    synchronization mode. Deep technical audit pending.
                  </p>
                  <p>
                    Please check back later as the system logs are compiled into
                    a comprehensive engineering narrative.
                  </p>
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
                  <Link
                    href="/#projects"
                    className="px-10 py-5 bg-transparent border border-border/40 text-primary font-black uppercase tracking-[0.2em] text-xs rounded-full hover:bg-surface transition-colors duration-300 flex items-center justify-center"
                  >
                    View Portfolio
                  </Link>
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
