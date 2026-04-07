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

      {/* NEW badge */}
      <div className="reveal reveal-up reveal-delay-6">
        <button className="new-badge" aria-label="Latest announcement">
          <span className="badge-tag">New</span>
          <span>Samuel Stanley is open for new projects in 2026</span>
          <span style={{ color: "#8892b0" }}>→</span>
        </button>
      </div>
    </section>
  );
}
