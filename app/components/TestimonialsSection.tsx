import { SectionHeading } from "./ui";
import { testimonials } from "./data";

export function TestimonialsSection() {
  // Split into two groups for the two rows
  const topRow = [...testimonials.slice(0, 3), ...testimonials.slice(0, 3)];
  const bottomRow = [...testimonials.slice(3, 6), ...testimonials.slice(3, 6)];

  return (
    <section
      id="testimonials"
      className="reveal reveal-up w-full"
      style={{ paddingTop: "4rem", paddingBottom: "4rem" }}
    >
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div style={{ marginBottom: "2rem" }}>
          <SectionHeading>What People Say</SectionHeading>
        </div>

        {/* Top Row — scrolling Right */}
        <div className="testimonial-track-container scroll-right">
          <div className="testimonial-track">
            {topRow.map((t, i) => (
              <TestimonialCard key={`top-${i}`} t={t} />
            ))}
          </div>
        </div>

        {/* Bottom Row — scrolling Left */}
        <div className="testimonial-track-container scroll-left" style={{ marginTop: "1rem" }}>
          <div className="testimonial-track">
            {bottomRow.map((t, i) => (
              <TestimonialCard key={`bottom-${i}`} t={t} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ t }: { t: typeof testimonials[0] }) {
  return (
    <div className="testimonial-card infinite-card">
      <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "1.25rem" }}>
        {t.text}
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <div
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${t.color}33, ${t.color}66)`,
            border: `1.5px solid ${t.color}44`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.6rem",
            fontWeight: 700,
            color: t.color,
            flexShrink: 0,
          }}
        >
          {t.avatar}
        </div>
        <span style={{ color: "var(--coral)", fontSize: "0.8rem", fontWeight: 700 }}>
          {t.handle}
        </span>
      </div>
    </div>
  );
}
