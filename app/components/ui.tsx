import Image from "next/image";
import { ContactForm } from "./ContactSection";
import { useEffect } from "react";

// ─── Profile Photo ─────────────────────────────────────────────────────────
export function ProfilePhoto({ className = "" }: { className?: string }) {
  return (
    <div
      style={{ position: "relative", width: "100%", height: "100%" }}
      className={`relative overflow-hidden ${className}`}
    >
      <Image
        src="/sampic.jpeg"
        alt="Samuel Stanley — Full Stack Developer"
        fill
        sizes="(max-width: 768px) 150px, 400px"
        style={{ objectFit: "cover", objectPosition: "center top" }}
        priority
      />
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
        className="absolute inset-0 bg-black/85 backdrop-blur-xl animate-fade-in"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div 
        className="relative w-full max-w-xl animate-fade-in-up bg-[#08080a] border border-white/15 rounded-[28px] backdrop-blur-2xl shadow-2xl overflow-hidden"
        style={{ 
          maxHeight: "90vh", 
          overflowY: "auto", 
          boxShadow: "0 30px 80px -15px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.1)"
        }}
      >
        <div className="p-6 md:p-10">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors text-xl p-2 rounded-full hover:bg-white/10"
          >
            ✕
          </button>
  
          <div className="mb-6">
            <span className="text-[10px] font-black uppercase tracking-[0.35em] text-white/40 block mb-1">Direct Communication</span>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">Start a Conversation</h2>
            <p className="text-white/60 text-sm leading-relaxed mt-2">
              Fill out the form below or message directly. All requests are routed straight to my WhatsApp (<span className="text-white font-bold">08106889242</span>).
            </p>
          </div>

          <div className="mb-6 pb-6 border-b border-white/10 flex flex-col sm:flex-row gap-3">
            <a
              href="https://wa.me/2348106889242?text=Hi%20Samuel,%20I'd%20like%20to%20discuss%20a%20project."
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3 px-4 bg-[#25D366] text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-500/20"
            >
              💬 Chat directly on WhatsApp
            </a>
            <a
              href="mailto:stanley.samuel.stanley@gmail.com"
              className="py-3 px-4 bg-white/5 border border-white/15 text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-white/10 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              ✉️ Send Email
            </a>
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
