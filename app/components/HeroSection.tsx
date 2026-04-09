import { ProfilePhoto } from "./ui";

export function HeroSection() {
  return (
    <section
      id="hero"
      className="flex flex-col items-center justify-center text-center pt-24 md:pt-32 pb-6 px-4 w-full max-w-4xl mx-auto"
    >
      {/* Status badge now moved to fixed header in page.tsx */}

      {/* Profile Photo */}
      <div className="reveal reveal-up reveal-delay-1 flex justify-center" style={{ marginBottom: "1rem" }}>
        <ProfilePhoto />
      </div>

      {/* Status Badge - Shows right below avatar on all screens */}
      <div className="flex justify-center reveal reveal-up reveal-delay-2 mb-8">
        <div className="status-badge">
          <div className="pulse-dot" />
          <span>Available for Work</span>
        </div>
      </div>

      {/* Name */}
      <h1
        className="reveal reveal-up reveal-delay-3"
        style={{
          fontSize: "clamp(2.4rem, 6.5vw, 4.5rem)",
          fontWeight: 800,
          letterSpacing: "-0.02em",
          lineHeight: 1.05,
          marginBottom: "1.25rem",
          display: "flex",
          alignItems: "baseline",
          gap: "0.35em",
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
          fontSize: "clamp(0.65rem, 1.8vw, 0.8rem)",
          fontWeight: 800,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "var(--coral)",
          marginBottom: "1.5rem",
        }}
      >
        THE DEVELOPER THAT ACTUALLY SHIPS THINGS.
      </p>

      {/* Description */}
      <p
        className="reveal reveal-up reveal-delay-5"
        style={{
          fontSize: "clamp(0.9rem, 2vw, 1.05rem)",
          color: "var(--text-secondary)",
          lineHeight: 1.7,
          maxWidth: "44rem",
          marginBottom: "2.5rem",
        }}
      >
        Builds your backend, designs your frontend, deploys your infrastructure.
        <br className="hidden md:block" />
        All with clean code, great docs, and zero corporate bloat.
      </p>

      {/* Actions */}
      <div className="reveal reveal-up reveal-delay-6 flex flex-wrap justify-center gap-4 mb-10">
        <a 
          href="/cv/cv.pdf" 
          download="Samuel_Stanley_CV.pdf"
          className="px-8 py-3.5 rounded-full font-bold text-sm transition-all duration-300 flex items-center gap-2 group"
          style={{ 
            background: "var(--coral)", 
            color: "white",
            boxShadow: "0 10px 25px -5px rgba(255, 77, 77, 0.4)"
          }}
        >
          <span>Download CV</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-y-0.5 transition-transform"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        </a>

        <a 
          href="#contact" 
          className="px-8 py-3.5 rounded-full font-bold text-sm transition-all duration-300 border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--border)]"
        >
          Work With Me
        </a>
      </div>

      {/* NEW badge */}
      <div className="reveal reveal-up reveal-delay-7">
        <button className="new-badge" aria-label="Latest announcement">
          <span className="badge-tag">New</span>
          <span>Samuel Stanley Portfolio v2: AI Ecosystem is live!</span>
          <span style={{ color: "#8892b0" }}>→</span>
        </button>
      </div>
    </section>
  );
}
