import { ProfilePhoto } from "./ui";

export function HeroSection() {
  return (
    <section
      id="hero"
      className="flex flex-col items-center justify-center text-center pt-24 md:pt-32 pb-10 px-0 md:px-5 w-full max-w-5xl mx-auto"
    >
      {/* Profile Photo */}
      <div
        className="reveal reveal-up reveal-delay-1 flex justify-center"
        style={{ marginBottom: "1.25rem" }}
      >
        <div style={{ position: "relative", width: "clamp(120px, 20vw, 150px)", height: "clamp(120px, 20vw, 150px)" }} className="mascot-container">
          {/* Gradient glow ring */}
          <div
            style={{
              position: "absolute",
              inset: "-2px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #ff4d4d 0%, #00e5cc 100%)",
              zIndex: 0,
              opacity: 0.9,
            }}
          />
          {/* Theme-aware separator */}
          <div
            style={{
              position: "absolute",
              inset: "2px",
              borderRadius: "50%",
              background: "var(--bg)",
              zIndex: 1,
              transition: "background-color 0.3s ease"
            }}
          />
          {/* Photo Container */}
          <div
            style={{
              position: "absolute",
              inset: "4px",
              borderRadius: "50%",
              overflow: "hidden",
              zIndex: 2,
            }}
          >
            <ProfilePhoto />
          </div>
        </div>
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

      {/* Name */}
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

      {/* Tagline */}
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
        Full-Stack Engineer &nbsp;·&nbsp;{" "}
        <span className="hidden md:inline">Product Builder &nbsp;·&nbsp; </span>
        Founder's Dev
      </p>

      {/* Main Hook */}
      <h2
        className="reveal reveal-up reveal-delay-5 px-2 md:px-0"
        style={{
          fontSize: "clamp(2.2rem, 8vw, 3.8rem)",
          fontWeight: 900,
          color: "var(--text-primary)",
          lineHeight: 1.1,
          maxWidth: "46rem",
          marginBottom: "1.5rem",
          letterSpacing: "-0.025em",
          textWrap: "balance" as any,
        }}
      >
        I help <span style={{ color: "var(--coral)" }}>founders</span> build and
        launch <span style={{ color: "var(--coral)" }}>MVPs</span> in 14-30 days.
      </h2>

      {/* Subtext */}
      <p
        className="reveal reveal-up reveal-delay-6 px-8 md:px-0"
        style={{
          fontSize: "clamp(0.95rem, 1.6vw, 1.1rem)",
          color: "var(--text-secondary)",
          lineHeight: 1.6,
          maxWidth: "34rem",
          marginBottom: "2.75rem",
        }}
      >
        From idea to deployed product — backend, frontend, and infrastructure
        handled.
      </p>

      {/* CTA Button */}
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
