export function FooterSection() {
  return (
    <>
      {/* CTA cards */}
      <section
        id="links"
        className="reveal reveal-up w-full max-w-6xl mx-auto px-4 md:px-8"
        style={{ paddingBottom: "4rem" }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem" }} className="cta-grid">
          <a href="mailto:samuel@samuelstanley.dev" className="cta-card" id="cta-email">
            <span style={{ fontSize: "1.75rem", color: "#ff4d4d" }}>✉</span>
            <span style={{ fontWeight: 700, fontSize: "0.95rem", color: "#f0f4ff" }}>Email Me</span>
            <span style={{ fontSize: "0.82rem", color: "#8892b0" }}>Let&apos;s work together</span>
          </a>
          <a href="https://github.com/samuelstanley" target="_blank" rel="noopener noreferrer" className="cta-card" id="cta-github">
            <span style={{ fontSize: "1.75rem", color: "#ff4d4d" }}>⌥</span>
            <span style={{ fontWeight: 700, fontSize: "0.95rem", color: "#f0f4ff" }}>GitHub</span>
            <span style={{ fontSize: "0.82rem", color: "#8892b0" }}>View the source</span>
          </a>
          <a href="https://linkedin.com/in/samuelstanley" target="_blank" rel="noopener noreferrer" className="cta-card" id="cta-linkedin">
            <span style={{ fontSize: "1.75rem", color: "#ff4d4d" }}>in</span>
            <span style={{ fontWeight: 700, fontSize: "0.95rem", color: "#f0f4ff" }}>LinkedIn</span>
            <span style={{ fontSize: "0.82rem", color: "#8892b0" }}>Connect with me</span>
          </a>
          <a href="/Samuel-Stanley-CV.pdf" target="_blank" rel="noopener noreferrer" className="cta-card" id="cta-cv">
            <span style={{ fontSize: "1.75rem", color: "#ff4d4d" }}>📎</span>
            <span style={{ fontWeight: 700, fontSize: "0.95rem", color: "#f0f4ff" }}>Resume</span>
            <span style={{ fontSize: "0.82rem", color: "#8892b0" }}>View & Download CV</span>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          width: "100%",
          borderTop: "1px solid rgba(136,146,176,0.12)",
          padding: "1.5rem 2rem",
          textAlign: "center",
          color: "#8892b0",
          fontSize: "0.82rem",
        }}
      >
        © 2026 Samuel Stanley. Built with Next.js, TypeScript &amp; passion.{" "}
        <a href="mailto:samuel@samuelstanley.dev" className="coral-link" style={{ fontSize: "0.82rem" }}>
          @samuelstanley
        </a>{" "}
        and his keyboard.
      </footer>
    </>
  );
}
