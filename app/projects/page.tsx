"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { projects } from "../components/data";
import { SectionHeading } from "../components/ui";
import { Starfield } from "../components/Starfield";

const statusColors: Record<string, string> = {
  "Live":        "#27c93f",
  "In Progress": "#febc2e",
  "Completed":   "#00e5cc",
  "Open Source": "#9b7dff",
  "Beta":        "#ff4d4d",
};

export default function AllProjectsPage() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [mounted, setMounted] = useState(false);

  // Initial load from storage
  useEffect(() => {
    const savedTheme = (localStorage.getItem("theme") as "dark" | "light") || "dark";
    setTheme(savedTheme);
    setMounted(true);
  }, []);

  // Sync state to DOM whenever theme changes
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
    <main className="min-h-screen relative w-full overflow-hidden transition-colors duration-300">
      {/* Starfield background */}
      <Starfield />

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

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-24">
        {/* Navigation */}
        <div className="mb-16">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-[#8892b0] hover:text-[#ff4d4d] transition-colors mb-12 text-sm font-semibold tracking-wide uppercase"
          >
            ← Back to Home
          </Link>

          <div style={{ display: "flex", alignItems: "flex-end", gap: "1rem" }}>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight" style={{ color: "var(--text-primary)" }}>
              All Projects
            </h1>
            <span className="text-[#8892b0] text-xl font-medium pb-2">/ {projects.length} works</span>
          </div>
          <p className="text-xl text-[#8892b0] mt-6 max-w-2xl leading-relaxed">
            A comprehensive collection of my engineering work, ranging from large-scale SaaS engines to open-source developer toolkits.
          </p>
        </div>

        {/* Grid */}
        <div
          style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.25rem" }}
          className="projects-grid"
        >
          {projects.map((p, i) => (
            <div
              key={i}
              className="glass-card project-card reveal reveal-up"
              style={{ 
                padding: "1.5rem", 
                display: "flex", 
                flexDirection: "column", 
                gap: "0.75rem", 
                position: "relative", 
                overflow: "hidden",
                animationDelay: `${i * 0.05}s`,
                transition: "all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1)",
                border: "1px solid rgba(136,146,176,0.15)"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = p.color;
                e.currentTarget.style.boxShadow = `0 10px 30px ${p.color}22`;
                e.currentTarget.style.transform = "translateY(-5px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(136,146,176,0.15)";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {/* Top accent bar */}
              <div
                style={{
                  position: "absolute",
                  top: 0, left: 0, right: 0,
                  height: "3px",
                  background: `linear-gradient(90deg, ${p.color}, transparent)`,
                }}
              />

              {/* Header row */}
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.5rem" }}>
                <div>
                  <h3 style={{ fontWeight: 700, fontSize: "1.2rem", color: "var(--text-primary)", marginBottom: "0.25rem" }}>
                    {p.title}
                  </h3>
                  <span style={{ fontSize: "0.75rem", color: "#8892b0", fontWeight: 600 }}>{p.tag}</span>
                </div>
                {/* Status badge */}
                <span
                  style={{
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    padding: "0.2rem 0.55rem",
                    borderRadius: "999px",
                    background: `${statusColors[p.status] || "#8892b0"}22`,
                    color: statusColors[p.status] || "#8892b0",
                    border: `1px solid ${statusColors[p.status] || "#8892b0"}44`,
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                >
                  {p.status}
                </span>
              </div>

              {/* Description */}
              <p style={{ color: "#8892b0", fontSize: "0.9rem", lineHeight: 1.7, flex: 1, margin: "0.5rem 0" }}>
                {p.desc}
              </p>

              {/* Tech tags */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                {p.tech.map((t) => (
                  <span
                    key={t}
                    style={{
                      fontSize: "0.7rem",
                      padding: "0.2rem 0.6rem",
                      borderRadius: "6px",
                      background: "rgba(136,146,176,0.06)",
                      border: "1px solid rgba(136,146,176,0.12)",
                      color: "#94a3b8",
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* Links */}
              <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid rgba(136,146,176,0.1)" }}>
                {p.link && p.link !== "#" && (
                  <a
                    href={p.link}
                    className="coral-link"
                    style={{ fontSize: "0.85rem" }}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    ↗ Live Demo
                  </a>
                )}
                
                {p.slug && (
                  <Link
                    href={`/project/${p.slug}`}
                    className="coral-link"
                    style={{ fontSize: "0.85rem" }}
                  >
                    ↗ Case Study
                  </Link>
                )}
                {p.repo && p.repo !== "#" && (
                  <a
                    href={p.repo}
                    style={{ fontSize: "0.85rem", color: "#8892b0", textDecoration: "none", transition: "color 0.2s" }}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    ⌥ Source
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
