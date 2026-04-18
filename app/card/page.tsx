"use client";

import { useEffect, useRef, useState, useCallback } from "react";

/* ─── COLOURS (Aligned with Samuel Stanley branding but luxury-focused) ─── */
const C = {
  black:  "#050810", // brand navy black
  red:    "#FF4D4D", // brand coral red
  redL:   "#FF6B6B", // lighter highlight
  redD:   "#CC0000", // deep red for accents
  text:   "#F0F4FF", // off-white
  muted:  "#8892B0", // blue-gray
};

const D = {
  name:      "Samuel Stanley",
  firstName: "Samuel",
  lastName:  "Stanley",
  title:     "Full Stack Software Engineer",
  tagline:   "Building Tomorrow's Digital Infrastructure",
  phone:     "+234 814 000 0000",
  email:     "info.samuelstanley@gmail.com",
  web:       "www.samuelstanley.com",
  location:  "Lagos, Nigeria",
  github:    "samuelstanley",
  linkedin:  "samuel-stanley",
};

const PW = 1050;
const PH =  600;

/* ─── CANVAS UTILS ──────────────────────────────────────────────────── */
function rrect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y); ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r); ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h); ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r); ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

function drawContactIcon(ctx: CanvasRenderingContext2D, type: string, cx: number, cy: number, r: number, s: (v:number)=>number) {
  const ic = r * 0.55;
  ctx.save();
  ctx.strokeStyle = C.red;
  ctx.lineWidth = s(1.4);
  ctx.lineCap = "round"; ctx.lineJoin = "round";
  
  if (type === "phone") {
    ctx.beginPath(); ctx.arc(cx, cy, ic * 0.8, 0, Math.PI * 1.8); ctx.stroke();
    ctx.strokeRect(cx - ic * 0.5, cy + ic * 0.3, ic, ic * 0.4);
  } else if (type === "email") {
    ctx.strokeRect(cx - ic, cy - ic * 0.7, ic * 2, ic * 1.4);
    ctx.beginPath(); ctx.moveTo(cx - ic, cy - ic * 0.7); ctx.lineTo(cx, cy); ctx.lineTo(cx + ic, cy - ic * 0.7); ctx.stroke();
  } else if (type === "web") {
    ctx.beginPath(); ctx.arc(cx, cy, ic, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx - ic, cy); ctx.lineTo(cx + ic, cy); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(cx, cy, ic * 0.5, ic, 0, 0, Math.PI * 2); ctx.stroke();
  } else if (type === "loc") {
    ctx.beginPath(); ctx.arc(cx, cy - ic*0.2, ic*0.7, 0, Math.PI*2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx-ic*0.4, cy+ic*0.2); ctx.lineTo(cx, cy+ic); ctx.lineTo(cx+ic*0.4, cy+ic*0.2); ctx.stroke();
  }
  ctx.restore();
}

/* ════════════════════════════════════════════════════════════════════
   FRONT DESIGN: "Red Emperor" Executive Edition
   ─────────────────────────────────────────────
   • Fills space with authority and balance.
   • Thin Red border around the whole card.
   • Vertical Red divider.
   • LUXURY SERIF TYPOGRAPHY (Playfair Display).
   • Transparent logo integration.
════════════════════════════════════════════════════════════════════ */
function drawFront(
  ctx: CanvasRenderingContext2D,
  W: number, H: number, sc: number,
  logo: HTMLImageElement | null
) {
  const s = (v: number) => Math.round(v * sc);
  const CR = s(14); // Elegant radius

  ctx.clearRect(0, 0, W, H);
  rrect(ctx, 0, 0, W, H, CR); ctx.save(); ctx.clip();

  /* ── Background ── */
  ctx.fillStyle = C.black;
  ctx.fillRect(0, 0, W, H);

  /* ── Subtle Texture (Diagonal Micro-Carbon) ── */
  ctx.strokeStyle = "rgba(255,255,255,0.012)";
  ctx.lineWidth = s(0.5);
  for (let i = -H; i < W + H; i += s(5)) {
    ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i + H, H); ctx.stroke();
  }

  /* ── Red Border Line (Inset 10px) ── */
  const BI = s(10);
  ctx.strokeStyle = C.red;
  ctx.lineWidth = s(1.4);
  rrect(ctx, BI, BI, W - BI * 2, H - BI * 2, CR - s(4));
  ctx.stroke();

  /* ── Vertical Divider ── */
  const SPLIT = Math.round(W * 0.54);
  const vGrad = ctx.createLinearGradient(SPLIT, s(35), SPLIT, H - s(35));
  vGrad.addColorStop(0, "rgba(255,77,77,0)");
  vGrad.addColorStop(0.5, C.red);
  vGrad.addColorStop(1, "rgba(255,77,77,0)");
  ctx.fillStyle = vGrad;
  ctx.fillRect(SPLIT - s(0.5), s(35), s(1), H - s(70));

  /* ── LEFT SECTION (Logo & Brand) ── */
  const LP = s(42);
  
  // Logo masked as circle
  if (logo) {
    const LS = s(75);
    const LX = LP;
    const LY = s(42);
    ctx.save();
    ctx.beginPath(); ctx.arc(LX + LS/2, LY + LS/2, LS/2, 0, Math.PI * 2); ctx.clip();
    ctx.drawImage(logo, LX, LY, LS, LS);
    ctx.restore();
    // Inner frame
    ctx.strokeStyle = "rgba(255,77,77,0.3)"; ctx.lineWidth = s(1); ctx.stroke();
  }

  // Brand Name in Playfair Serif
  ctx.textAlign = "left"; ctx.textBaseline = "top";
  ctx.fillStyle = C.text;
  ctx.font = `700 ${s(32)}px 'Playfair Display', serif`;
  ctx.fillText(D.firstName.toUpperCase(), LP, s(130));

  ctx.fillStyle = C.red;
  ctx.font = `400 ${s(32)}px 'Playfair Display', serif`;
  ctx.fillText(D.lastName.toUpperCase(), LP, s(166));

  // Tagline
  ctx.fillStyle = "rgba(255,255,255,0.3)";
  ctx.font = `italic 400 ${s(10.5)}px 'Playfair Display', serif`;
  ctx.letterSpacing = `${s(0.5)}px`;
  ctx.fillText(D.tagline, LP, s(210));

  /* ── RIGHT SECTION (Details) ── */
  const RX = SPLIT + s(40);
  const RY = s(42);

  // Focus Name
  ctx.fillStyle = C.text;
  ctx.font = `600 ${s(19)}px 'Playfair Display', serif`;
  ctx.fillText(D.name, RX, RY);

  // Ruler below name
  const rGrad = ctx.createLinearGradient(RX, 0, RX + s(150), 0);
  rGrad.addColorStop(0, C.red);
  rGrad.addColorStop(1, "rgba(255,77,77,0)");
  ctx.fillStyle = rGrad;
  ctx.fillRect(RX, RY + s(30), s(150), s(1));

  // Professional Title
  ctx.fillStyle = C.muted;
  ctx.font = `500 ${s(10)}px Inter, sans-serif`;
  ctx.letterSpacing = `${s(1)}px`;
  ctx.fillText(D.title.toUpperCase(), RX, RY + s(38));

  // Contacts
  const contacts = [
    { type: "phone", val: D.phone },
    { type: "email", val: D.email },
    { type: "web",   val: D.web   },
    { type: "loc",   val: D.location },
  ];

  const rowH = s(44);
  const gridY = RY + s(75);

  contacts.forEach((item, i) => {
    const cy = gridY + (i * rowH);
    const ir = s(14);
    
    // Icon
    ctx.beginPath(); ctx.arc(RX + ir, cy, ir, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,77,77,0.12)"; ctx.fill();
    ctx.strokeStyle = "rgba(255,77,77,0.3)"; ctx.lineWidth = s(1); ctx.stroke();
    drawContactIcon(ctx, item.type, RX + ir, cy, ir, s);

    // Text
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.font = `400 ${s(11)}px Inter, sans-serif`;
    ctx.textBaseline = "middle";
    ctx.fillText(item.val, RX + ir * 2 + s(14), cy);
  });

  ctx.restore();
}

/* ════════════════════════════════════════════════════════════════════
   BACK DESIGN: Bold High-Contrast Identity
════════════════════════════════════════════════════════════════════ */
function drawBack(ctx: CanvasRenderingContext2D, W: number, H: number, sc: number, logo: HTMLImageElement | null) {
  const s = (v: number) => Math.round(v * sc);
  ctx.clearRect(0, 0, W, H);
  rrect(ctx, 0, 0, W, H, s(14)); ctx.save(); ctx.clip();
  ctx.fillStyle = C.black; ctx.fillRect(0, 0, W, H);

  // Border
  const BI = s(10);
  ctx.strokeStyle = C.red; ctx.lineWidth = s(1.4);
  rrect(ctx, BI, BI, W - BI * 2, H - BI * 2, s(10)); ctx.stroke();

  if (logo) {
    const LS = s(100);
    ctx.save();
    ctx.beginPath(); ctx.arc(W/2, H/2 - s(30), LS/2, 0, Math.PI*2); ctx.clip();
    ctx.drawImage(logo, W/2 - LS/2, H/2 - LS/2 - s(30), LS, LS);
    ctx.restore();
  }

  ctx.textAlign = "center"; ctx.textBaseline = "top";
  ctx.fillStyle = C.text;
  ctx.font = `700 ${s(30)}px 'Playfair Display', serif`;
  ctx.fillText(D.name.toUpperCase(), W/2, H/2 + s(40));

  ctx.fillStyle = C.red;
  ctx.font = `600 ${s(11)}px Inter, sans-serif`;
  ctx.letterSpacing = `${s(5)}px`;
  ctx.fillText(D.web.toUpperCase(), W/2, H/2 + s(85));

  ctx.restore();
}

/* ════════════════════════════════════════════════════════════════════
   COMPONENT
════════════════════════════════════════════════════════════════════ */
export default function CardPage() {
  const frontRef = useRef<HTMLCanvasElement>(null);
  const backRef  = useRef<HTMLCanvasElement>(null);
  const logoRef  = useRef<HTMLImageElement | null>(null);

  const [loaded, setLoaded] = useState(false);
  const [rendered, setRendered] = useState(false);
  const [dl,     setDl]     = useState(false);

  const DW = 520; 
  const DH = Math.round(PH * DW / PW);
  const DS = DW / PW;

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@400;500;600;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    const img = new Image();
    img.onload = () => { logoRef.current = img; setLoaded(true); };
    img.onerror = () => { logoRef.current = null; setLoaded(true); };
    img.src = "/card-logo.png";
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const paint = () => {
      const fc = frontRef.current; const bc = backRef.current;
      if (!fc || !bc) return;
      fc.width = DW; fc.height = DH; bc.width = DW; bc.height = DH;
      const fctx = fc.getContext("2d"); const bctx = bc.getContext("2d");
      if (fctx) drawFront(fctx, DW, DH, DS, logoRef.current);
      if (bctx) drawBack(bctx, DW, DH, DS, logoRef.current);
      setRendered(true);
    };
    // Wait for fonts to potentially load
    setTimeout(paint, 800);
  }, [loaded, DW, DH, DS]);

  const handleDownload = useCallback(async () => {
    setDl(true);
    const PS = PW/DW * DS;
    const save = (cvs: HTMLCanvasElement, name: string) => {
      const a = document.createElement("a"); a.download = name; a.href = cvs.toDataURL("image/png"); a.click();
    };
    const fc = document.createElement("canvas"); fc.width = PW; fc.height = PH;
    const fCtx = fc.getContext("2d");
    if (fCtx) { drawFront(fCtx, PW, PH, PS, logoRef.current); save(fc, "SamuelStanley-Front.png"); }
    await new Promise(r => setTimeout(r, 600));
    const bc = document.createElement("canvas"); bc.width = PW; bc.height = PH;
    const bCtx = bc.getContext("2d");
    if (bCtx) { drawBack(bCtx, PW, PH, PS, logoRef.current); save(bc, "SamuelStanley-Back.png"); }
    setDl(false);
  }, [rendered, DS, DW]);

  return (
    <div className="pg">
      <style>{CSS}</style>
      <header className="header">
        <h1>Professional Executive Card</h1>
        <p>Expert Engineering 3.5″ × 2″ · 300 DPI</p>
      </header>

      <div className="preview-container">
        {[frontRef, backRef].map((ref, i) => (
          <div key={i} className="card-box">
            <span className="side-label">{i === 0 ? "FRONT" : "BACK"}</span>
            <div className="canvas-wrap">
              {!rendered && <div className="loader">Building UI...</div>}
              <canvas ref={ref} style={{ opacity: rendered ? 1 : 0 }} />
            </div>
          </div>
        ))}
      </div>

      <div className="action-row">
        <button onClick={handleDownload} className="btn-primary" disabled={!rendered || dl}>
          {dl ? "Processing..." : "Download 300 DPI PNGs"}
        </button>
        <button onClick={() => window.print()} className="btn-secondary">Print to PDF</button>
      </div>
    </div>
  );
}

const CSS = `
  :root { --red: #FF4D4D; --bg: #050810; }
  body { background: var(--bg); margin: 0; font-family: 'Inter', sans-serif; color: #F0F4FF; }
  .pg { display: flex; flex-direction: column; align-items: center; padding: 4rem 2rem; gap: 4rem; }
  .header { text-align: center; }
  .header h1 { font-family: 'Playfair Display', serif; font-size: 2.4rem; font-weight: 700; margin-bottom: 0.5rem; }
  .header p { font-size: 0.75rem; color: #8892B0; letter-spacing: 0.3em; text-transform: uppercase; font-weight: 600; }
  .preview-container { display: flex; flex-direction: column; gap: 3rem; }
  .card-box { display: flex; flex-direction: column; gap: 1rem; align-items: center; }
  .side-label { font-size: 0.7rem; font-weight: 800; letter-spacing: 0.4em; color: #1F2937; }
  .canvas-wrap { border-radius: 16px; overflow: hidden; box-shadow: 0 50px 100px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.05); position: relative; }
  .loader { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: #080C16; color: #4B5563; font-size: 0.7rem; letter-spacing: 0.2rem; text-transform: uppercase; }
  canvas { display: block; transition: opacity 1s ease; }
  .action-row { display: flex; gap: 1.5rem; }
  button { padding: 1.2rem 3rem; border-radius: 8px; font-weight: 700; cursor: pointer; font-family: inherit; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.1em; transition: all 0.3s; }
  .btn-primary { background: var(--red); color: white; border: none; box-shadow: 0 10px 30px rgba(255,77,77,0.3); }
  .btn-primary:hover { transform: translateY(-4px); box-shadow: 0 15px 45px rgba(255,77,77,0.5); }
  .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; box-shadow: none; }
  .btn-secondary { background: transparent; border: 1.5px solid #1A202E; color: #8892B0; }
  .btn-secondary:hover { border-color: #374151; color: white; background: rgba(255,255,255,0.03); }
`;
