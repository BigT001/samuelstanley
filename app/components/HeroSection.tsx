import { ProfilePhoto } from "./ui";

export function HeroSection() {
  return (
    <section
      id="hero"
      className="flex flex-col items-center justify-center text-center pt-24 md:pt-32 pb-10 px-5 w-full max-w-5xl mx-auto"
    >
      {/* Profile Photo */}
      <div
        className="reveal reveal-up reveal-delay-1 flex justify-center"
        style={{ marginBottom: "1.25rem" }}
      >
        <ProfilePhoto />
      </div>

      {/* Status Badge */}
      <div
        className="flex justify-center reveal reveal-up reveal-delay-2"
        style={{ marginBottom: "2rem" }}
      >
        <div className="status-badge">
          <div className="pulse-dot" />
          <span>Available for Work</span>
        </div>
      </div>

      {/* Name — two-tone restored, beautiful large display */}
      <h1
        className="reveal reveal-up reveal-delay-3"
        style={{
          fontSize: "clamp(1.9rem, 5vw, 2.9rem)",
          fontWeight: 800,
          letterSpacing: "-0.02em",
          lineHeight: 1.05,
          marginBottom: "1.5rem",
          display: "flex",
          alignItems: "baseline",
          gap: "0.3em",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <span style={{ color: "var(--text-primary)" }}>Samuel</span>
        <span style={{ color: "var(--coral)" }}>Stanley</span>
      </h1>

      {/* Divider tagline — punchy single line */}
      <p
        className="reveal reveal-up reveal-delay-4"
        style={{
          fontSize: "clamp(0.65rem, 1.6vw, 0.78rem)",
          fontWeight: 700,
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          color: "var(--text-secondary)",
          marginBottom: "2rem",
        }}
      >
        Full-Stack Engineer &nbsp;·&nbsp; Product Builder &nbsp;·&nbsp;
        Founder's Dev
      </p>

      {/* Main hook — outcome-driven, bold, clean */}
      <h2
        className="reveal reveal-up reveal-delay-5"
        style={{
          fontSize: "clamp(1.75rem, 4.2vw, 3rem)",
          fontWeight: 800,
          color: "var(--text-primary)",
          lineHeight: 1.2,
          maxWidth: "58rem",
          marginBottom: "1.25rem",
          letterSpacing: "-0.015em",
          textWrap: "balance" as any,
        }}
      >
        I help <span style={{ color: "var(--coral)" }}>founders</span> build and
        launch <span style={{ color: "var(--coral)" }}>MVPs</span> in 14–30
        days.
      </h2>

      {/* Subtext — short, punchy, single block */}
      <p
        className="reveal reveal-up reveal-delay-6"
        style={{
          fontSize: "clamp(0.95rem, 1.6vw, 1.1rem)",
          color: "var(--text-secondary)",
          lineHeight: 1.75,
          maxWidth: "34rem",
          marginBottom: "2.75rem",
        }}
      >
        From idea to deployed product — backend, frontend, and infrastructure
        handled.
      </p>

      {/* Main CTA */}
      <div
        className="reveal reveal-up reveal-delay-7"
        style={{ marginBottom: "4rem" }}
      >
        <a href="#contact" className="cta-button-primary">
          Start Your Project
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </a>
      </div>

      {/* NEW badge */}
      <div className="reveal reveal-up" style={{ transitionDelay: "0.42s" }}>
        <button className="new-badge" aria-label="Latest announcement">
          <span className="badge-tag">New</span>
          <span>Portfolio v2 with AI Ecosystem is live!</span>
          <span style={{ color: "#8892b0" }}>→</span>
        </button>
      </div>
    </section>
  );
}
