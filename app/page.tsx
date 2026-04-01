"use client";

import { useEffect, useState } from "react";

import { Starfield }           from "./components/Starfield";
import { HeroSection }         from "./components/HeroSection";
import { TestimonialsSection } from "./components/TestimonialsSection";
import { QuickStartSection }   from "./components/QuickStartSection";
import { ServicesSection, TechStackSection } from "./components/ServicesSection";
import { ProjectsSection }     from "./components/ProjectsSection";
import { ContactSection }      from "./components/ContactSection";
import { FooterSection }       from "./components/FooterSection";

export default function Home() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // 1. Initial Load: Read from storage once on mount
  useEffect(() => {
    const savedTheme = (localStorage.getItem("theme") as "dark" | "light") || "dark";
    setTheme(savedTheme);
    setMounted(true);
  }, []);

  // 2. React to State: Apply class to doc root whenever theme changes
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

  // Scroll watcher
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Bidirectional scroll-reveal via IntersectionObserver */
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    if (!els.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          } else {
            entry.target.classList.remove("visible");
          }
        });
      },
      { threshold: 0.10, rootMargin: "0px 0px -30px 0px" }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative min-h-screen transition-colors duration-300">
      {/* Starfield background */}
      <Starfield />

      {/* Floating Navigation (No line, no background) */}
      <nav className="fixed top-0 left-0 w-full z-[1000] px-6 py-5 pointer-events-none">
        <div className="max-w-7xl mx-auto flex justify-between items-center pointer-events-auto">
          {/* Status Badge — hides on scroll */}
          <div
            style={{
              opacity: scrolled ? 0 : 1,
              transform: scrolled ? "translateY(-12px)" : "translateY(0)",
              transition: "opacity 0.35s ease, transform 0.35s ease",
              pointerEvents: scrolled ? "none" : "auto",
            }}
          >
            <div className="status-badge">
              <div className="pulse-dot" />
              <span>Available for Work</span>
            </div>
          </div>

          {/* Theme Toggle — docks to edge on mobile when scrolled */}
          <button
            className={`theme-pill-static ${theme}`}
            onClick={toggleTheme}
            aria-label="Toggle theme"
            style={{
              opacity: mounted ? 1 : 0,
              // On mobile when scrolled: shrink down and dock flush to top-right
              ...(scrolled ? {
                transform: "scale(0.8)",
                transformOrigin: "top right",
              } : {}),
              transition: "opacity 0.3s ease, transform 0.35s ease, box-shadow 0.35s ease",
            }}
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
        </div>
      </nav>

      {/* ── Page Content ───────────────────────────────────────────── */}
      <main className="relative z-10 flex flex-col items-center w-full">
        <HeroSection />
        <TestimonialsSection />
        <QuickStartSection />
        <ServicesSection />
        <TechStackSection />
        <ProjectsSection />
        <ContactSection />
        <FooterSection />
      </main>
    </div>
  );
}
