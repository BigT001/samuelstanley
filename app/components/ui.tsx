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

// ─── CV Viewer Modal ───────────────────────────────────────────────────────
export function CVModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
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
        className="relative w-full max-w-5xl glass-card animate-fade-in-up"
        style={{ 
          height: "90vh", 
          display: "flex",
          flexDirection: "column",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          overflow: "hidden",
          borderRadius: "24px"
        }}
      >
        {/* Header */}
        <div style={{ padding: "1.25rem 2rem", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--surface)" }}>
          <div className="flex items-center gap-3">
             <SectionHeading>Resume / CV</SectionHeading>
          </div>
          <div className="flex items-center gap-4">
             <a 
               href="/Samuel-Stanley-Resume.pdf" 
               download="Samuel_Stanley_CV.pdf"
               className="px-6 py-2.5 rounded-full font-bold text-xs transition-all duration-200 flex items-center gap-2 group"
               style={{ 
                 background: "var(--coral)", 
                 color: "white",
               }}
             >
               Download PDF
             </a>
             <button 
               onClick={onClose}
               className="text-secondary hover:text-primary transition-colors text-xl p-2"
             >
               ✕
             </button>
          </div>
        </div>

        {/* PDF Frame */}
        <div style={{ flex: 1, background: "#333", position: "relative" }}>
          <iframe 
            src="/Samuel-Stanley-Resume.pdf" 
            style={{ width: "100%", height: "100%", border: "none" }}
            title="Samuel Stanley Resume"
          />
        </div>
      </div>
    </div>
  );
}
