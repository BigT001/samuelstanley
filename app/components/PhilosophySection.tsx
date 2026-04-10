import { SectionHeading } from "./ui";
import { philosophies } from "./data";

export function PhilosophySection() {
  return (
    <section
      id="philosophy"
      className="reveal reveal-up w-full"
      style={{ paddingTop: "3.5rem", paddingBottom: "3.5rem" }}
    >
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div style={{ marginBottom: "2rem", textAlign: "left" }}>
          <SectionHeading>Development Philosophy</SectionHeading>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", marginTop: "0.4rem", maxWidth: "40rem" }}>
            The core principles that guide every line of code I write and every system I architect.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {philosophies.map((p, i) => (
            <div 
              key={i} 
              className="glass-card" 
              style={{ 
                padding: "1.25rem 1.5rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
                height: "100%",
                transition: "all 0.25s ease",
                border: "1px solid var(--border)",
                background: "var(--surface)",
                borderRadius: "16px"
              }}
            >
              <div 
                style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "0.75rem"
                }}
              >
                <div
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "8px",
                    background: `linear-gradient(135deg, ${p.color}22, ${p.color}44)`,
                    border: `1px solid ${p.color}33`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1rem",
                    flexShrink: 0
                  }}
                >
                  {p.icon}
                </div>
                <h3 style={{ color: p.color, fontSize: "0.95rem", fontWeight: 800 }}>
                  {p.title}
                </h3>
              </div>
              
              <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                {p.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
