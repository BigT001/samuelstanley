"use client";

import Link from "next/link";

export function HireMeSection() {
  const emailIcon = (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );

  return (
    <section className="reveal reveal-up mt-16 pt-10 border-t border-[var(--border)]">
      <div 
        className="relative overflow-hidden rounded-2xl p-6 md:p-8"
        style={{ 
          background: "var(--surface)",
          border: "1px solid var(--border)",
        }}
      >
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="text-center md:text-left max-w-lg">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-[var(--border)] text-[var(--text-secondary)] text-[10px] uppercase font-bold tracking-wider mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Available for Hire
            </div>
            
            <h2 className="text-xl md:text-2xl font-bold text-[var(--text-primary)] mb-3 leading-tight">
              Let's build your <span style={{ color: "var(--coral)" }}>next big product.</span>
            </h2>
            
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Accepting project-based freelance, remote engineering roles, and hybrid positions.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <Link 
              href="/#contact"
              className="inline-flex items-center gap-2 px-6 py-3 text-white text-sm font-bold rounded-xl transition-all duration-200 hover:-translate-y-0.5 whitespace-nowrap flex-shrink-0"
              style={{ 
                background: "var(--coral)", 
                boxShadow: "0 4px 15px rgba(255,77,77,0.25)" 
              }}
            >
              Hire Me
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>
            
            <a 
              href="mailto:stanley.samuel.stanley@gmail.com"
              className="inline-flex items-center justify-center p-3 rounded-xl border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--coral)] hover:border-[var(--coral)] transition-all duration-200 hover:-translate-y-0.5 flex-shrink-0"
              title="Email Me"
              style={{ background: "rgba(255,255,255,0.02)" }}
            >
              {emailIcon}
            </a>
          </div>
        </div>
      </div>
      
      <footer className="mt-8 mb-6 text-center">
        <p className="text-[10px] text-[var(--text-secondary)] font-medium opacity-60">
          © {new Date().getFullYear()} Samuel Stanley · Full Stack Engineer
        </p>
      </footer>
    </section>
  );
}
