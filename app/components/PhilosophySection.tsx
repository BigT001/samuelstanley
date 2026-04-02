import { SectionHeading } from "./ui";
import { philosophies } from "./data";

export function PhilosophySection() {
  // Split into two groups for the two rows just like testimonials
  const topRow = [...philosophies.slice(0, 3), ...philosophies.slice(0, 3)];
  const bottomRow = [...philosophies.slice(3, 6), ...philosophies.slice(3, 6)];

  return (
    <section
      id="philosophy"
      className="reveal reveal-up w-full"
      style={{ paddingTop: "4rem", paddingBottom: "4rem" }}
    >
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div style={{ marginBottom: "2rem" }}>
          <SectionHeading>Development Philosophy</SectionHeading>
        </div>

        {/* Top Row — scrolling Right */}
        <div className="testimonial-track-container scroll-right">
          <div className="testimonial-track">
            {topRow.map((p, i) => (
              <PhilosophyCard key={`top-${i}`} p={p} />
            ))}
          </div>
        </div>

        {/* Bottom Row — scrolling Left */}
        <div className="testimonial-track-container scroll-left" style={{ marginTop: "1rem" }}>
          <div className="testimonial-track">
            {bottomRow.map((p, i) => (
              <PhilosophyCard key={`bottom-${i}`} p={p} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PhilosophyCard({ p }: { p: typeof philosophies[0] }) {
  return (
    <div className="testimonial-card infinite-card">
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.85rem" }}>
        <div
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${p.color}33, ${p.color}66)`,
            border: `1.5px solid ${p.color}44`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1rem",
            flexShrink: 0,
          }}
        >
          {p.icon}
        </div>
        <span style={{ color: p.color, fontSize: "0.95rem", fontWeight: 700 }}>
          {p.title}
        </span>
      </div>
      <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
        {p.text}
      </p>
    </div>
  );
}
