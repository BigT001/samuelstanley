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
      className="fixed inset-0 z-[10000] flex items-center justify-center p-2 md:p-4"
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
        className="relative w-full max-w-xl animate-fade-in-up bg-[var(--surface)] border border-[var(--border)] rounded-[24px] backdrop-blur-xl"
        style={{ 
          maxHeight: "90vh", 
          overflowY: "auto", 
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
        }}
      >
        <div className="p-6 md:p-10">
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
    </div>
  );
}

// ─── CV Download Confirmation Modal ───────────────────────────────────────
export function CVModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4 md:p-6"
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
        className="relative w-full max-w-md animate-fade-in-up bg-[var(--surface)] border border-[var(--border)] rounded-[28px] backdrop-blur-3xl overflow-hidden"
        style={{ 
          boxShadow: "0 40px 100px -20px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 77, 77, 0.05)",
        }}
      >
        <div className="p-8 md:p-10 text-center">
          {/* Icon */}
          <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6 shadow-inner">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--coral)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
          </div>

          <h2 className="text-xl md:text-2xl font-bold text-[var(--text-primary)] mb-3">
            Download Resume?
          </h2>
          <p className="text-secondary text-sm leading-relaxed mb-8 px-4">
            The PDF version of my Professional CV will be downloaded to your device.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              onClick={onClose}
              className="flex-1 px-6 py-3.5 rounded-2xl font-bold text-sm text-secondary hover:text-primary bg-white/5 border border-white/10 transition-all active:scale-95"
            >
              Cancel
            </button>
            <a 
              href="/resume.pdf" 
              download="Samuel_Stanley_CV.pdf"
              onClick={() => {
                // Ensure modal closes after download initiates
                setTimeout(onClose, 200);
              }}
              className="flex-1 px-6 py-3.5 rounded-2xl font-bold text-sm text-white bg-[var(--coral)] transition-all hover:brightness-110 active:scale-95 shadow-lg shadow-coral/20 flex items-center justify-center gap-2"
            >
              Confirm
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
