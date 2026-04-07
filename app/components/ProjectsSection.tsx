import { SectionHeading } from "./ui";
import { projects } from "./data";
import Link from "next/link";

const statusColors: Record<string, string> = {
  "Live":        "#27c93f",
  "In Progress": "#febc2e",
  "Ongoing":     "#febc2e",
  "Completed":   "#00e5cc",
  "Open Source": "#9b7dff",
  "Beta":        "#ff4d4d",
};

export function ProjectsSection() {
  return (
    <section
      id="projects"
      className="reveal reveal-up w-full max-w-6xl mx-auto px-4 md:px-8"
      style={{ paddingBottom: "4rem" }}
    >
      <div style={{ marginBottom: "1.75rem" }}>
        <SectionHeading>Recent Projects</SectionHeading>
      </div>

      <div
        style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.25rem" }}
        className="projects-grid"
      >
        {projects.slice(0, 6).map((p, i) => (
          <div
            key={i}
            className={`glass-card project-card reveal reveal-up reveal-delay-${i + 1}`}
            style={{ 
              padding: "1.5rem", 
              display: "flex", 
              flexDirection: "column", 
              gap: "0.75rem", 
              position: "relative", 
              overflow: "hidden",
              transition: "all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1)",
              border: "1px solid rgba(136,146,176,0.15)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = p.color;
              e.currentTarget.style.boxShadow = `0 10px 30px ${p.color}22`;
              e.currentTarget.style.transform = "translateY(-5px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(136,146,176,0.15)";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            {/* Top accent bar */}
            <div
              style={{
                position: "absolute",
                top: 0, left: 0, right: 0,
                height: "3px",
                background: `linear-gradient(90deg, ${p.color}, transparent)`,
              }}
            />

            {/* Header row */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.5rem" }}>
              <div>
                <h3 style={{ fontWeight: 700, fontSize: "1.05rem", color: "var(--text-primary)", marginBottom: "0.25rem" }}>
                  {p.title}
                </h3>
                <span style={{ fontSize: "0.72rem", color: "var(--text-secondary)", fontWeight: 500 }}>{p.tag}</span>
              </div>
              {/* Status badge */}
              <span
                style={{
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  padding: "0.2rem 0.55rem",
                  borderRadius: "999px",
                  background: `${statusColors[p.status] || "#8892b0"}22`,
                  color: statusColors[p.status] || "#8892b0",
                  border: `1px solid ${statusColors[p.status] || "#8892b0"}44`,
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                {p.status}
              </span>
            </div>

            {/* Description */}
            <p style={{ color: "var(--text-secondary)", fontSize: "0.87rem", lineHeight: 1.65, flex: 1 }}>
              {p.desc}
            </p>

            {/* Tech tags */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
              {p.tech.map((t) => (
                <span
                  key={t}
                  style={{
                    fontSize: "0.7rem",
                    padding: "0.15rem 0.5rem",
                    borderRadius: "4px",
                    background: "rgba(136,146,176,0.08)",
                    border: "1px solid rgba(136,146,176,0.15)",
                    color: "var(--text-secondary)",
                  }}
                >
                  {t}
                </span>
              ))}
            </div>

            <div style={{ display: "flex", gap: "0.75rem", paddingTop: "0.25rem", borderTop: "1px solid rgba(136,146,176,0.1)", minHeight: "30px", alignItems: "center" }}>
              {/* Live Demo — hidden for opnmrt, show launching soon instead */}
              {p.slug === "opnmrt" ? (
                <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#facc15", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#facc15", display: "inline-block", boxShadow: "0 0 6px #facc15", animation: "status-pulse 2s infinite" }} />
                  Launching Soon
                </span>
              ) : p.link && p.link !== "#" ? (
                <a
                  href={p.link}
                  className="coral-link"
                  style={{ fontSize: "0.82rem", marginRight: "0.5rem" }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ↗ Live Demo
                </a>
              ) : null}
              
              {/* Re-enabled Case Study for headline projects */}
              {p.slug && ["OPNMRT", "EMPI Costumes", "Study Express UK", "Stanley’s Log"].includes(p.title) && (
                <Link
                  href={`/project/${p.slug}`}
                  className="coral-link"
                  style={{ fontSize: "0.82rem", marginRight: "1rem" }}
                >
                  ↗ Case Study
                </Link>
              )}
              {p.repo && p.repo !== "#" && (
                <a
                  href={p.repo}
                  style={{ fontSize: "0.82rem", color: "var(--text-secondary)", textDecoration: "none", transition: "color 0.2s" }}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
                >
                  ⌥ Source
                </a>
              )}
              {/* Optional: Placeholder if both are hidden, so spacing looks okay, though minHeight handles it */}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
