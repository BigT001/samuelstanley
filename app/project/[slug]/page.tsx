"use client";

import { use, useState, useEffect, useRef } from "react";
import { notFound } from "next/navigation";
import { projects } from "../../components/data";
import Link from "next/link";
import { ContactModal } from "../../components/ui";

export default function ProjectCaseStudy({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const [showModal, setShowModal] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [mounted, setMounted] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);
  
  const project = projects.find((p) => p.slug === resolvedParams.slug);

  useEffect(() => {
    const savedTheme = (localStorage.getItem("theme") as "dark" | "light") || "dark";
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
    setTheme(prev => {
      const nextTheme = prev === "dark" ? "light" : "dark";
      localStorage.setItem("theme", nextTheme);
      return nextTheme;
    });
  };

  // Optimized Progress Indicator
  useEffect(() => {
    let ticking = false;
    const updateProgress = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollHeight > 0 ? (window.scrollY / scrollHeight) * 100 : 0;
      if (progressRef.current) progressRef.current.style.width = `${progress}%`;
      ticking = false;
    };
    const onScroll = () => { if (!ticking) { window.requestAnimationFrame(updateProgress); ticking = true; }};
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Intersection Observer for Reveal Animations
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    if (!els.length) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => e.isIntersecting ? e.target.classList.add("visible") : e.target.classList.remove("visible")),
      { threshold: 0.1 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [project]);

  if (!project) notFound();

  return (
    <div className={`min-h-screen relative w-full overflow-x-hidden font-sans transition-colors duration-700 ${theme === 'light' ? 'bg-[#fcfcff] text-[#111827]' : 'bg-[#050810] text-[#f0f4ff]'}`}>
      <ContactModal isOpen={showModal} onClose={() => setShowModal(false)} />

      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 z-[1000] bg-transparent">
        <div ref={progressRef} className="h-full bg-accent transition-all ease-linear" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 px-6 py-4 flex justify-between items-center bg-surface/40 backdrop-blur-md border-b border-border/10">
        <Link href="/#projects" className="text-[11px] font-black uppercase tracking-[0.3em] text-primary/70 hover:text-accent transition-all flex items-center gap-2">
          ← Back
        </Link>
        <button 
          onClick={toggleTheme} 
          className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-accent hover:bg-surface transition-all"
        >
          {theme === 'dark' ? '☀' : '🌙'}
        </button>
      </nav>

      <main className="relative z-10 pt-32 pb-32">
        {/* BLOG HEADER */}
        <header className="max-w-3xl mx-auto px-6 pt-10 pb-16 text-center reveal reveal-up">
          <div className="flex justify-center mb-6">
             <span className="px-4 py-1.5 bg-accent/10 border border-accent/20 text-accent text-[10px] font-black uppercase tracking-[0.3em] rounded-full">
               {project.tag}
             </span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-8 tracking-tight leading-[1.1]">
            {project.title}
          </h1>
          <p className="text-xl md:text-3xl opacity-70 leading-relaxed font-serif italic max-w-2xl mx-auto">
            "{project.desc}"
          </p>
          
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 mt-12 text-[11px] font-bold uppercase tracking-[0.2em] opacity-50">
             <span>Status: {project.status}</span>
             <span className="w-1 h-1 bg-current rounded-full hidden md:block" />
             <span>Samuel Stanley</span>
             <span className="w-1 h-1 bg-current rounded-full hidden md:block" />
             <span>Case Study</span>
          </div>
        </header>

        {/* HERO IMAGE PLACEHOLDER / DIVIDER */}
        <div className="w-full max-w-5xl mx-auto px-6 mb-20 reveal reveal-up">
          <div className="w-full h-[300px] md:h-[500px] rounded-3xl bg-gradient-to-br from-surface to-[#0a0f1a] border border-border/20 flex flex-col items-center justify-center relative overflow-hidden group">
             <div className="absolute inset-0 bg-accent/5 opacity-50 mix-blend-overlay" />
             <div className="w-32 h-32 blur-[80px] bg-accent rounded-full opacity-30 group-hover:scale-150 transition-transform duration-1000" />
             <span className="absolute text-[10px] font-black uppercase tracking-[0.5em] text-accent/50">Architectural Diagram</span>
          </div>
        </div>

        {/* ARTICLE BODY */}
        <article className="max-w-[720px] mx-auto px-6 text-lg md:text-xl leading-relaxed md:leading-loose font-medium opacity-90 pb-20 space-y-12">
          
          {project.slug === "opnmrt" ? (
             <>
                <p className="text-2xl md:text-3xl leading-relaxed font-semibold">
                  OPNMRT was built for high-scale independence. In a world where marketplaces own your data and take heavy commissions, OPNMRT provides the weaponry for merchants to operate their own sovereign commerce ecosystems.
                </p>

                <h2 className="text-3xl md:text-4xl font-black tracking-tight mt-16 mb-2">The Sovereignty Engine</h2>
                <p>
                  Every merchant deserves an orchestration engine that answers to them, not a platform algorithm. The architecture of OPNMRT relies on isolating merchant data into multi-tenant edge nodes, meaning complete ownership and lightning-fast load times globally.
                </p>

                {/* Breakout element */}
                <div className="my-16 -mx-6 md:-mx-20 p-8 md:p-12 bg-surface/30 border border-border/20 rounded-3xl reveal reveal-scale">
                   <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-accent mb-6">Split-Routing Logic</h3>
                   <code className="block text-xs md:text-sm font-mono leading-relaxed overflow-x-auto text-primary/80">
{`// Direct Subaccount Routing Architecture
async function executeSovereignPayment(order, merchant) {
  const transaction = await gateway.split({
    mainAccount: merchant.paymentKeys.subaccountId,
    commission: 0, // Zero Commission Model
    revenue: order.totalAmount,
    currency: 'NGN'
  });
  return emitEvent('payment.sovereign_success', transaction);
}`}
                   </code>
                </div>

                <p>
                  Funds route directly to merchant subaccounts via <strong>Flutterwave & Paystack</strong>. OPNMRT never touches the checkout capital, ensuring immediate liquidity for small businesses to restock and scale without waiting for platform payouts.
                </p>

                <h2 className="text-3xl md:text-4xl font-black tracking-tight mt-16 mb-2">Hyper-Local Logistics with Radar</h2>
                <p>
                  Traditional delivery systems ignore the nuances of local geography. We built <strong>Radar</strong> to match merchants with rider pools specifically filtered by Local Government Area (LGA). 
                </p>
                <p>
                  This pairs merchants with delivery riders from their immediate vicinity. By avoiding cross-city dispatch errors, we ensured sub-hour turnarounds while lowering the overall carbon footprint per delivery.
                </p>

                <blockquote className="border-l-[3px] border-accent pl-8 py-2 my-16 text-3xl font-serif italic text-primary/80 reveal reveal-left">
                  "Logistics must be hyper-local. Global mapping solutions often fail the last-mile test in emerging markets."
                </blockquote>

                <h2 className="text-3xl md:text-4xl font-black tracking-tight mt-16 mb-2">BigT: Autonomous AI Audits</h2>
                <p>
                  BigT is the autonomous heart of the engine. It uses Vision LLMs to title products, set price benchmarks, and write multi-channel SEO descriptions from a single raw image.
                </p>
                <p>
                  Beyond listings, BigT conducts continuous crawling of store telemetry. It flags low inventory, suspicious transactions, and pricing discrepancies in real-time before they impact the merchant's bottom line.
                </p>
             </>
          ) : project.slug === "admin-support-hq" ? (
             <>
                <p className="text-2xl md:text-3xl leading-relaxed font-semibold">
                  The Admin Support HQ is the nerve center of the OPNMRT ecosystem. Managing high-trust scalable commerce requires a resilient control center engineered for secure, rapid operational oversight.
                </p>

                <h2 className="text-3xl md:text-4xl font-black tracking-tight mt-16 mb-2">Zero-Trust Security</h2>
                <p>
                  We implemented strict Role-Based Access Control (RBAC) alongside hardware-bound session tracking. This ensures that sensitive merchant data remains completely isolated and audit-ready. 
                </p>
                
                <blockquote className="border-l-[3px] border-accent pl-8 py-2 my-16 text-3xl font-serif italic text-primary/80 reveal reveal-left">
                  "Trust is earned through rigorous verification and uncompromised security. This dashboard enforces both."
                </blockquote>

                <p>
                  Customer support engineers and compliance teams can moderate financial disputes and review flagged activities without ever requiring or exposing direct connection strings to the production databases.
                </p>

                <h2 className="text-3xl md:text-4xl font-black tracking-tight mt-16 mb-2">Verification Pipelines</h2>
                <p>
                  High-stakes operational workflows, including manual payment receipt scanning, merchant KYC validation, and rider vetting, are entirely streamlined. The architecture handles massive throughput securely, enabling human administrators to process verifications in seconds rather than minutes.
                </p>
             </>
          ) : project.slug === "portfolio-v2" ? (
             <>
                <p className="text-2xl md:text-3xl leading-relaxed font-semibold">
                  Portfolio v2 is built to feel like high-end operational software rather than a traditional brochure. It combines deep space aesthetics, scroll-linked animations, and rigorous performance optimization into a unified narrative.
                </p>

                <blockquote className="border-l-[3px] border-accent pl-8 py-2 my-16 text-3xl font-serif italic text-primary/80 reveal reveal-left">
                  "Software should look as precise and limitless as the code that powers it."
                </blockquote>

                <h2 className="text-3xl md:text-4xl font-black tracking-tight mt-16 mb-2">Architectural Rendering</h2>
                <p>
                  The case study engine itself uses a modular layout paired with an intersection-observer sequence. This gracefully reveals complex technical specifications alongside reactive reading progress bars, resulting in an immersive reading experience.
                </p>

                <h2 className="text-3xl md:text-4xl font-black tracking-tight mt-16 mb-2">Deep Space CSS Optimization</h2>
                <p>
                  To achieve the signature look, I engineered a multi-layered, hardware-accelerated starfield. It is implemented entirely and natively in CSS. 
                </p>
                <p>
                  By shedding Javascript overhead for ambient background effects, the site achieves buttery-smooth 60fps scrolling—even on mobile devices—while fully integrating with a dynamic Light/Dark mode global switch.
                </p>
             </>
          ) : (
             <>
                <p className="text-2xl md:text-3xl leading-relaxed font-semibold">
                  Architectural mapping for {project.title} is currently in synchronization mode. Deep technical audit pending.
                </p>
                <p>
                  Please check back later as the system logs are compiled into a comprehensive engineering narrative.
                </p>
             </>
          )}

          {/* TECH STACK LOGS */}
          <div className="mt-24 pt-12 border-t border-border/20 reveal reveal-up">
             <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-6 opacity-60">Deployed Stack Technologies</h4>
             <div className="flex flex-wrap gap-3">
               {project.tech.map(t => (
                  <span key={t} className="px-5 py-2.5 bg-surface border border-border/30 rounded-full text-[11px] font-bold uppercase tracking-widest text-primary/80 hover:border-accent/40 transition-all cursor-default">{t}</span>
               ))}
             </div>
          </div>
        </article>

        {/* BOTTOM CTA */}
        <div className="max-w-3xl mx-auto px-6 mt-16 text-center reveal reveal-up">
           <div className="p-12 md:p-16 bg-surface/40 border border-border/20 rounded-[2rem] md:rounded-[3rem]">
              <span className="text-accent text-[10px] font-black uppercase tracking-[0.4em] mb-6 block">Ready to scale?</span>
              <h3 className="text-4xl md:text-5xl font-black tracking-tight mb-10 leading-tight">Let's discuss your next architectural leap.</h3>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                 <button 
                   onClick={() => setShowModal(true)} 
                   className="px-10 py-5 bg-accent text-white font-black uppercase tracking-[0.2em] text-xs rounded-full hover:scale-105 active:scale-95 transition-all shadow-xl shadow-accent/20"
                 >
                   Schedule Walkthrough
                 </button>
                 <Link href="/#projects" className="px-10 py-5 border border-border/40 text-primary font-black uppercase tracking-[0.2em] text-xs rounded-full hover:bg-surface transition-all">
                   View Portfolio
                 </Link>
              </div>
           </div>
        </div>

      </main>

      <footer className="py-12 border-t border-border/10 text-center opacity-40">
         <p className="text-[9px] font-black uppercase tracking-[0.5em]">2026 Sovereign Systems Architecture</p>
      </footer>
    </div>
  );
}
