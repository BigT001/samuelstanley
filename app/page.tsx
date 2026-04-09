"use client";

import { useEffect, useState } from "react";

import { Starfield }           from "./components/Starfield";
import { HeroSection }         from "./components/HeroSection";
import { PhilosophySection }   from "./components/PhilosophySection";
import { QuickStartSection }   from "./components/QuickStartSection";
import { ServicesSection, TechStackSection } from "./components/ServicesSection";
import { ProjectsSection }     from "./components/ProjectsSection";
import { ContactSection }      from "./components/ContactSection";
import { FooterSection }       from "./components/FooterSection";

export default function Home() {
  const [scrolled, setScrolled] = useState(false);

  // Scroll watcher (for hiding the nav on scroll)
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

      {/* Floating Navigation */}
      <nav className="fixed top-0 left-0 w-full z-[1000] px-6 py-5 pointer-events-none">
        <div className="max-w-7xl mx-auto flex justify-between items-center pointer-events-auto">
          {/* Nav links — hide on scroll */}
          <div
            style={{
              opacity: scrolled ? 0 : 1,
              transform: scrolled ? "translateY(-12px)" : "translateY(0)",
              transition: "opacity 0.35s ease, transform 0.35s ease",
              pointerEvents: scrolled ? "none" : "auto",
            }}
            className="flex items-center gap-4"
          >
            {/* Blog */}
            <a
              href="/blog"
              className="text-sm font-bold tracking-wide text-red-500 hover:text-red-400 transition-colors"
            >
              Blog
            </a>

            {/* Resume */}
            <a
              href="/Samuel-Stanley-CV.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-bold tracking-wide text-[var(--text-primary)] hover:text-[var(--coral)] transition-colors"
            >
              Resume
            </a>

            {/* Agent UI — dev only */}
            {process.env.NODE_ENV === "development" && (
              <a
                href="/agent"
                className="text-sm font-semibold tracking-wide text-[var(--text-secondary)] hover:text-blue-400 transition-colors"
              >
                Agent UI
              </a>
            )}
          </div>
        </div>
      </nav>

      {/* ── Page Content ── */}
      <main className="relative z-10 flex flex-col items-center w-full">
        <HeroSection />
        <PhilosophySection />
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
