import { SectionHeading } from "./ui";
import { features, techStack } from "./data";

const serviceIcons = [
  // Full Stack Mastery
  <svg key="0" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ff2222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>,
  // API & Backend
  <svg key="1" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ff2222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>,
  // Persistent Architecture
  <svg key="2" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ff2222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>,
  // UI/UX Excellence
  <svg key="3" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ff2222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>,
  // DevOps & CI/CD
  <svg key="4" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ff2222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>,
  // Custom Integrations
  <svg key="5" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ff2222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
];

export function ServicesSection() {
  return (
    <section
      id="services"
      className="reveal reveal-up w-full max-w-6xl mx-auto px-4 md:px-8"
      style={{ paddingBottom: "4rem" }}
    >
      <SectionHeading>What I Do</SectionHeading>
      <div
        className="features-grid"
        style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}
      >
        {features.map((f, i) => (
          <div
            key={i}
            className={`glass-card reveal reveal-up reveal-delay-${(i % 3) + 1}`}
            style={{ padding: "1.75rem 1.5rem", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}
          >
            <div style={{ marginBottom: "1rem", filter: "drop-shadow(0 0 12px rgba(255, 34, 34, 0.4))", transition: "transform 0.3s ease" }} className="hover:scale-110">
              {serviceIcons[i] || f.icon}
            </div>
            <h3 style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-primary)", marginBottom: "0.6rem" }}>
              {f.title}
            </h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.87rem", lineHeight: 1.65 }}>{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function TechStackSection() {
  const half = Math.ceil(techStack.length / 2);
  const row1 = [...techStack.slice(0, half), ...techStack.slice(0, half), ...techStack.slice(0, half)];
  const row2 = [...techStack.slice(half), ...techStack.slice(half), ...techStack.slice(half)];

  return (
    <section
      id="stack"
      className="reveal reveal-up w-full"
      style={{ paddingBottom: "4rem", overflow: "hidden" }}
    >
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <SectionHeading>Works With Everything</SectionHeading>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginBottom: "2rem", marginTop: "1rem" }}>
          {/* Top Row — scrolling Right */}
          <div className="testimonial-track-container scroll-right">
            <div className="testimonial-track" style={{ gap: "1rem" }}>
              {row1.map((tech, i) => (
                <span key={`r1-${i}`} className="integration-pill" style={{ flexShrink: 0 }}>
                  <span style={{ fontSize: "0.9rem" }}>{tech.emoji}</span>
                  {tech.name}
                </span>
              ))}
            </div>
          </div>

          {/* Bottom Row — scrolling Left */}
          <div className="testimonial-track-container scroll-left">
            <div className="testimonial-track" style={{ gap: "1rem" }}>
              {row2.map((tech, i) => (
                <span key={`r2-${i}`} className="integration-pill" style={{ flexShrink: 0 }}>
                  <span style={{ fontSize: "0.9rem" }}>{tech.emoji}</span>
                  {tech.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="hidden md:flex" style={{ gap: "1rem", flexWrap: "wrap", marginTop: "1.5rem" }}>
          <a href="#projects" className="coral-link" style={{ fontSize: "0.9rem" }}>View my projects →</a>
          <span style={{ color: "var(--text-secondary)", opacity: 0.5 }}>·</span>
          <a href="#contact" className="coral-link" style={{ fontSize: "0.9rem" }}>Get in touch →</a>
        </div>
      </div>
    </section>
  );
}
