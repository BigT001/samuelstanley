"use client";

import { useState } from "react";
import { SectionHeading } from "./ui";
import confetti from "canvas-confetti";

type Field = { label: string; id: string; name: string; type: string; placeholder: string; rows?: number };

const fields: Field[] = [
  { label: "Your Name",    id: "name",    name: "name",    type: "text",  placeholder: "e.g. Samuel Stanley" },
  { label: "Your Email",   id: "email",   name: "email",   type: "email", placeholder: "samuel@example.com" },
  { label: "Subject",      id: "subject", name: "subject", type: "text",  placeholder: "Project enquiry, collaboration, etc." },
  { label: "Your Message", id: "message", name: "message", type: "textarea", placeholder: "Tell me about your project...", rows: 5 },
];

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "rgba(10,15,26,0.7)",
  border: "1px solid rgba(136,146,176,0.18)",
  borderRadius: "10px",
  padding: "0.75rem 1rem",
  color: "#f0f4ff",
  fontSize: "16px",
  outline: "none",
  fontFamily: "var(--font-inter)",
  transition: "border-color 0.2s",
};

const socials = [
  { label: "Email",     href: "mailto:stanley.samuel.stanley@gmail.com", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>,  color: "#ff4d4d" },
  { label: "LinkedIn",  href: "https://www.linkedin.com/in/samuel-stanley-345174234/", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>, color: "#0077b5" },
  { label: "Instagram", href: "https://www.instagram.com/samuel.g.stanley?igsh=NnIwMXcwb2pqY3I3&utm_source=qr",   icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>,  color: "#E4405F" },
];

export function ContactForm({ onHideSuccess }: { onHideSuccess?: () => void }) {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const target = e.currentTarget;
    const formData = new FormData(target);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setSent(true);
        setLoading(false);
        target.reset();

        // 🎉 Confetti explosion
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.7 },
          colors: ["#ff4d4d", "#00e5cc", "#ffffff"],
          zIndex: 10000,
        });

        // Auto-hide success message after 6 seconds
        setTimeout(() => {
          setSent(false);
          if (onHideSuccess) onHideSuccess();
        }, 6000);
      } else {
        setError(data.message || "Submission failed. Please check your access key.");
        setLoading(false);
      }
    } catch (err) {
      setError("Network error. Please try again later.");
      setLoading(false);
    }
  };

  return (
    <div style={{ width: "100%" }}>
      {/* Success Popup */}
      {sent && (
        <div 
          className="animate-fade-in-up"
          style={{ 
            position: "fixed", 
            bottom: "3rem", 
            right: "3rem", 
            zIndex: 1000,
          }}
        >
          <div
            style={{
              padding: "1rem 2rem",
              background: "rgba(10, 15, 26, 0.95)",
              border: "1px solid #00e5cc",
              borderRadius: "16px",
              boxShadow: "0 10px 40px rgba(0, 229, 204, 0.25)",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              backdropFilter: "blur(20px)",
            }}
          >
            <span style={{ fontSize: "1.5rem" }}>🚀</span>
            <div>
              <p style={{ color: "white", fontWeight: 700, margin: 0, fontSize: "0.9rem" }}>Message Transmitted!</p>
              <p style={{ color: "#00e5cc", fontSize: "0.75rem", margin: 0, fontWeight: 500 }}>I'll get back to you shortly.</p>
            </div>
            <button 
              onClick={() => setSent(false)}
              style={{ background: "none", border: "none", color: "#8892b0", cursor: "pointer", padding: "0.5rem" }}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <input type="hidden" name="access_key" value="31f519d2-5d52-4ef7-8632-30f33aa7bf35" />
        <input type="checkbox" name="botcheck" style={{ display: "none" }} />

        {fields.map((f) => (
          <div key={f.id}>
            <label
              htmlFor={f.id}
              style={{ display: "block", fontSize: "0.8rem", color: "#8892b0", fontWeight: 600, marginBottom: "0.4rem", letterSpacing: "0.04em" }}
            >
              {f.label}
            </label>
            {f.id === "message" ? (
              <textarea
                id={f.id}
                name="message"
                placeholder={f.placeholder}
                rows={f.rows}
                required
                className="light-mode-input"
                style={{ ...inputStyle, resize: "vertical" }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#ff2222";
                  e.currentTarget.style.boxShadow = "0 0 20px rgba(255, 34, 34, 0.15)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "rgba(136,146,176,0.18)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            ) : (
              <input
                id={f.id}
                name={f.name}
                type={f.type}
                placeholder={f.placeholder}
                required
                className="light-mode-input"
                style={inputStyle}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#ff2222";
                  e.currentTarget.style.boxShadow = "0 0 20px rgba(255, 34, 34, 0.15)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "rgba(136,146,176,0.18)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            )}
          </div>
        ))}

        {error && (
          <p style={{ color: "#ff4d4d", fontSize: "0.85rem", fontWeight: 500 }}>
            ⚠️ {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "0.85rem 2rem",
            background: loading ? "rgba(255,77,77,0.5)" : "linear-gradient(135deg, #ff4d4d 0%, #cc2020 100%)",
            color: "white",
            border: "none",
            borderRadius: "10px",
            fontWeight: 700,
            fontSize: "0.85rem",
            textTransform: "uppercase",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "all 0.2s ease",
            letterSpacing: "0.05em",
            boxShadow: loading ? "none" : "0 4px 20px rgba(255, 77, 77, 0.2)",
            marginTop: "0.5rem"
          }}
        >
          {loading ? "Transmitting..." : "Send Message →"}
        </button>
      </form>
    </div>
  );
}

export function ContactSection() {

  return (
    <section
      id="contact"
      className="reveal reveal-up w-full max-w-6xl mx-auto px-4 md:px-8"
      style={{ paddingBottom: "4rem", position: "relative" }}
    >


      <div 
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "center" }}
        className="contact-grid"
      >

        {/* Info & Socials — Centered Vertically on the Left */}
        <div className="reveal reveal-up reveal-delay-1">
          <div style={{ marginBottom: "1rem" }}>
            <SectionHeading>Get In Touch</SectionHeading>
          </div>
          
          <p style={{ color: "var(--text-secondary)", fontSize: "clamp(0.95rem, 2vw, 1.05rem)", lineHeight: 1.8, marginBottom: "2rem" }}>
            I am currently accepting offers for <span style={{ color: "var(--text-primary)", fontWeight: 700 }}>project-based freelance work</span>, 
            <span style={{ color: "var(--text-primary)", fontWeight: 700 }}> remote engineering roles</span>, and 
            <span style={{ color: "var(--text-primary)", fontWeight: 700 }}> flexible hybrid positions</span>.
            <br /><br />
            If you need a dedicated full-stack engineer to architect and ship your next high-performance product, 
            reach out below—my inbox is always open.
          </p>

          {/* Desktop socials only */}
          <div className="hidden md:flex reveal reveal-up reveal-delay-2" style={{ flexDirection: "row", gap: "0.85rem", flexWrap: "wrap" }}>
            {socials.map((s) => (
              <SocialItem key={s.label} s={s} />
            ))}
          </div>
        </div>

        <div className="reveal reveal-up reveal-delay-3" style={{ width: "100%" }}>
          <ContactForm />
        </div>
      </div>

      {/* Mobile socials only — at the very bottom */}
      <div className="md:hidden flex justify-center mt-6 reveal reveal-up reveal-delay-4" style={{ gap: "1rem", flexWrap: "wrap" }}>
        {socials.map((s) => (
          <SocialItem key={s.label} s={s} />
        ))}
      </div>
    </section>
  );
}

function SocialItem({ s }: { s: typeof socials[0] }) {
  return (
    <a
      href={s.href}
      target={s.label !== "Email" ? "_blank" : undefined}
      rel="noopener noreferrer"
      title={s.label}
      className="social-link-icon"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "52px",
        height: "52px",
        borderRadius: "14px",
        textDecoration: "none",
        color: "#f0f4ff",
        transition: "all 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "#ff2222";
        e.currentTarget.style.background = "rgba(15,22,40,0.85)";
        e.currentTarget.style.boxShadow = "inset 0 0 0 1px #ff2222, 0 0 35px rgba(255, 34, 34, 0.2)";
        e.currentTarget.style.transform = "translateY(-3px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <span style={{ color: s.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {s.icon}
      </span>
    </a>
  );
}
