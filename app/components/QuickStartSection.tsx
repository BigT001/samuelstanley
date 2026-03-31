"use client";

import { useState } from "react";
import { SectionHeading } from "./ui";

const EMAIL = "info.samuelstanley@gmail.com";

const contactCommands = {
  project: {
    command: `$ send-offer --to="${EMAIL}" --type=project`,
    subject: "Project Collaboration Enquiry",
    body: "Hi Samuel,\n\nWe have a project we would like to collaborate on...",
    headline: "project-based freelance work",
    subtext: "If you have a project in mind and need to hire a dedicated full-stack engineer to architect and ship your next high-performance product, reach out below."
  },
  remote: {
    command: `$ send-offer --to="${EMAIL}" --type=remote-role`,
    subject: "Remote Engineering Role",
    body: "Hi Samuel,\n\nWe are looking for a remote full-stack developer...",
    headline: "full-time or part-time remote roles",
    subtext: "Need a globally available, self-directed developer who can integrate seamlessly into your distributed team? Let's connect."
  },
  hybrid: {
    command: `$ send-offer --to="${EMAIL}" --type=hybrid-role`,
    subject: "Hybrid Role Opportunity",
    body: "Hi Samuel,\n\nWe have a hybrid role available and would love to connect...",
    headline: "flexible hybrid positions",
    subtext: "Looking for an engineer who can collaborate in-person when it counts, while maintaining high velocity asynchronously. I'm open to relocation possibilities."
  }
} as const;

type Tab = keyof typeof contactCommands;

export function QuickStartSection() {
  const [activeTab, setActiveTab] = useState<Tab>("project");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(EMAIL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEmailLaunch = () => {
    const { subject, body } = contactCommands[activeTab];
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <section
      id="quickstart"
      className="reveal reveal-up w-full max-w-6xl mx-auto px-4 md:px-8"
      style={{ paddingBottom: "4rem" }}
    >
      <SectionHeading>Quick Start</SectionHeading>

      <div className="terminal-window" style={{ width: "100%" }}>

        {/* ── Terminal bar ─────────────────────────────────── */}
        <div style={{ padding: "0.6rem 1rem", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(0,0,0,0.2)" }}>
          
          {/* Single row: dots + tabs + status(desktop only) */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "nowrap" }}>
            {/* Dots */}
            <div style={{ display: "flex", gap: "5px", alignItems: "center", flexShrink: 0 }}>
              <div className="terminal-dot" style={{ background: "#ff5f56", margin: 0 }} />
              <div className="terminal-dot" style={{ background: "#febc2e", margin: 0 }} />
              <div className="terminal-dot" style={{ background: "#27c93f", margin: 0 }} />
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", gap: "0.4rem", flex: 1 }}>
              {(Object.keys(contactCommands) as Tab[]).map((tab) => (
                <button
                  key={tab}
                  className={`tab-pill ${activeTab === tab ? "active" : ""}`}
                  onClick={() => setActiveTab(tab)}
                  style={{ padding: "0.28rem 0.75rem", fontSize: "0.78rem" }}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Status — hidden on mobile */}
            <div className="hidden md:flex" style={{ gap: "0.5rem", alignItems: "center", flexShrink: 0 }}>
              <span style={{
                background: "rgba(255, 77, 77, 0.15)",
                color: "#ff4d4d",
                fontSize: "0.65rem",
                padding: "0.2rem 0.55rem",
                borderRadius: "4px",
                border: "1px solid rgba(255, 77, 77, 0.25)",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.05em"
              }}>● Available</span>
              <span style={{ fontSize: "0.65rem", color: "var(--text-secondary)", fontWeight: 500 }}>v4.0.0</span>
            </div>
          </div>
        </div>

        {/* ── Terminal body ────────────────────────────────── */}
        <div className="terminal-body">
          {/* Description */}
          <div style={{ color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "1rem", fontSize: "0.9rem", fontFamily: "var(--font-sans)" }}>
            <p style={{ marginBottom: "0.25rem" }}>
              I&apos;m currently accepting offers for{" "}
              <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>
                {contactCommands[activeTab].headline}.
              </span>
            </p>
            <p style={{ marginBottom: "0.5rem" }}>
              {contactCommands[activeTab].subtext}
            </p>
          </div>

          {/* Command box */}
          <div
            style={{
              padding: "0.85rem 1rem",
              background: "rgba(0,0,0,0.3)",
              borderRadius: "8px",
              border: "1px solid rgba(255,255,255,0.05)",
              cursor: "pointer",
              transition: "all 0.3s ease"
            }}
            className="terminal-command-wrap hover:border-coral/40 group hover:shadow-[0_0_15px_rgba(255,77,77,0.1)]"
            onClick={handleEmailLaunch}
          >
            {/* Command text — wraps to show full email */}
            <div style={{ width: "100%", marginBottom: "0.85rem" }}>
              <span style={{ color: "var(--coral)", marginRight: "0.5rem", fontWeight: "bold", fontFamily: "var(--font-mono)" }}>$</span>
              <code style={{
                color: "var(--text-primary)",
                fontFamily: "var(--font-mono)",
                fontSize: "0.82rem",
                wordBreak: "break-all",
                whiteSpace: "pre-wrap",
                lineHeight: 1.7
              }}>
                {contactCommands[activeTab].command}
              </code>
            </div>

            {/* Action buttons — on their own row, right-aligned */}
            <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
              <button
                onClick={(e) => { e.stopPropagation(); handleCopy(); }}
                style={{
                  background: copied ? "rgba(0,229,204,0.1)" : "transparent",
                  border: `1px solid ${copied ? "#00e5cc44" : "rgba(255,255,255,0.08)"}`,
                  cursor: "pointer",
                  color: copied ? "#00e5cc" : "#8892b0",
                  fontSize: "0.75rem",
                  padding: "0.4rem 0.9rem",
                  borderRadius: "6px",
                  transition: "all 0.2s",
                  fontFamily: "var(--font-mono)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  whiteSpace: "nowrap"
                }}
              >
                {copied ? "✓ Copied" : "⎘ Copy"}
              </button>

              <button
                onClick={(e) => { e.stopPropagation(); handleEmailLaunch(); }}
                style={{
                  background: "var(--coral)",
                  border: "none",
                  cursor: "pointer",
                  color: "white",
                  fontSize: "0.75rem",
                  padding: "0.4rem 0.9rem",
                  borderRadius: "6px",
                  transition: "all 0.2s",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  whiteSpace: "nowrap"
                }}
                className="hover:opacity-90 shadow-md hover:shadow-lg hover:shadow-coral/20 hover:-translate-y-0.5"
              >
                ✉ Send Mail
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Info pills */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem 2rem", marginTop: "1.5rem" }}>
        <p className="reveal reveal-up reveal-delay-2" style={{ color: "#4d5b7c", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ color: "#ff4d4d" }}>●</span> Remote &amp; Relocation Possible
        </p>
        <p className="reveal reveal-up reveal-delay-3" style={{ color: "#4d5b7c", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ color: "#00e5cc" }}>●</span> Works Globally
        </p>
        <p className="reveal reveal-up reveal-delay-4" style={{ color: "#4d5b7c", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ color: "#9b7dff" }}>●</span> Multi-timezone Support
        </p>
      </div>
    </section>
  );
}
