import Image from "next/image";
import { ContactForm } from "./ContactSection";
import { useEffect } from "react";

// ─── Profile Photo ─────────────────────────────────────────────────────────
export function ProfilePhoto() {
  return (
    <div
      style={{ position: "relative", width: "clamp(120px, 20vw, 150px)", height: "clamp(120px, 20vw, 150px)" }}
      className="mascot-container"
    >
      {/* Gradient glow ring - Thinner */}
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
      {/* Theme-aware separator - Thinner */}
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
      {/* Photo */}
      <div
        style={{
          position: "absolute",
          inset: "4px",
          borderRadius: "50%",
          overflow: "hidden",
          zIndex: 2,
        }}
      >
        <Image
          src="/sampic.jpeg"
          alt="Samuel Stanley — Full Stack Developer"
          fill
          sizes="150px"
          style={{ objectFit: "cover", objectPosition: "center top" }}
          priority
        />
      </div>
    </div>
  );
}

// ─── Section Heading ───────────────────────────────────────────────────────
export function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="section-heading">
      <span className="section-chevron" aria-hidden="true">❯</span>
      {children}
    </h2>
  );
}

// ─── Contact Modal ─────────────────────────────────────────────────────────
export function ContactModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-xl animate-fade-in"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div 
        className="relative w-full max-w-xl glass-card animate-fade-in-up"
        style={{ 
          maxHeight: "90vh", 
          overflowY: "auto", 
          padding: "2.5rem",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
        }}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-secondary hover:text-primary transition-colors text-xl p-2"
        >
          ✕
        </button>

        <div className="mb-8">
          <SectionHeading>Schedule Interview</SectionHeading>
          <p className="text-secondary text-sm leading-relaxed mt-2">
            Fill out the form below to book a time or discuss your project. I usually respond within 24 hours.
          </p>
        </div>

        <ContactForm onHideSuccess={onClose} />
      </div>
    </div>
  );
}
