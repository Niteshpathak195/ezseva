"use client";

// ─────────────────────────────────────────────────────────────────────────────
// EzSeva — AI Resume Builder (Coming Soon)
// app/ai-resume/page.tsx
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const ACCENT    = "#0D9488";
const GRAD_FROM = "#0D9488";
const GRAD_TO   = "#059669";

const FEATURES = [
  { icon: "🎯", title: "ATS-Optimised",         desc: "Passes applicant tracking systems used by top employers and government portals." },
  { icon: "🏛️", title: "Govt Job Formats",       desc: "Special templates for UPSC, SSC, Railway, Bank and state PSC applications." },
  { icon: "⚡", title: "AI Auto-Fill",            desc: "Enter your basic details — AI writes your summary, skills and experience sections." },
  { icon: "🎨", title: "10+ Clean Templates",     desc: "Professional designs that print perfectly on A4 paper." },
  { icon: "📄", title: "Export PDF Instantly",    desc: "No email required. Download directly to your device." },
  { icon: "🔄", title: "Update Anytime",          desc: "Come back and edit — your draft is saved locally in your browser." },
];

const OTHER_TOOLS = [
  { icon: "🖼️", title: "Image Resize",    href: "/image-resize",  desc: "SSC, Railway, VYAPAM sizes"  },
  { icon: "🪪",  title: "Photo+Signature", href: "/photo-joiner",  desc: "Merge for govt forms"         },
  { icon: "📄",  title: "Image to PDF",    href: "/image-to-pdf",  desc: "Combine images into PDF"      },
  { icon: "🎨",  title: "Image Crop",      href: "/image-crop",    desc: "Crop to any dimension"        },
  { icon: "🗜️", title: "PDF Compress",    href: "/pdf-compress",  desc: "Shrink PDF file size"         },
  { icon: "📑",  title: "PDF Merge",       href: "/pdf-merge",     desc: "Combine PDFs into one"        },
  { icon: "✂️",  title: "PDF Split",       href: "/pdf-split",     desc: "Extract PDF pages"            },
  { icon: "🔒",  title: "PDF Protect",     href: "/pdf-protect",   desc: "Password protect PDF"         },
  { icon: "⌨️",  title: "Typing Test",     href: "/typing-test",   desc: "CPCT, SSC, Railway practice" },
];

/* ── Particle background ── */
function ParticleBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animId: number;
    const pts: { x: number; y: number; r: number; vx: number; vy: number; a: number }[] = [];
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);
    for (let i = 0; i < 28; i++) {
      pts.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2.5 + 0.5,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        a: Math.random() * 0.35 + 0.08,
      });
    }
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach((p) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = ACCENT + Math.round(p.a * 255).toString(16).padStart(2, "0");
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);
  return (
    <canvas
      ref={canvasRef}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
    />
  );
}

/* ── Countdown hook ── */
function useCountdown() {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const target = new Date();
    target.setDate(target.getDate() + 30);
    const tick = () => {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) return;
      setT({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

/* ══════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════ */
export default function AIResumePage() {
  const countdown                   = useCountdown();
  const [email, setEmail]           = useState("");
  const [submitted, setSubmitted]   = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const handleNotify = () => {
    if (!email.trim() || !email.includes("@")) return;
    // TODO: POST to /api/waitlist when backend is ready
    setSubmitted(true);
    setEmail("");
  };

  return (
    <>
      <Navbar />
      <main style={{ background: "var(--bg-subtle)", minHeight: "100vh", fontFamily: "var(--font)" }}>

        {/* ── Top Ad ── */}
        <div aria-hidden="true" style={{ background: "var(--bg-subtle)" }}>
          <ins className="adsbygoogle" style={{ display: "block", minHeight: "90px" }}
            data-ad-format="auto" data-full-width-responsive="true" />
        </div>

        {/* ════════════════════════════════════════
            HERO
        ════════════════════════════════════════ */}
        <section style={{
          position: "relative", overflow: "hidden",
          background: `linear-gradient(135deg, ${GRAD_FROM}18 0%, ${GRAD_TO}10 50%, var(--bg-subtle) 100%)`,
          borderBottom: `1px solid ${ACCENT}22`,
          padding: "56px 24px 52px",
          textAlign: "center",
        }}>
          <ParticleBg />

          {/* Decorative rings */}
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "600px", height: "600px", borderRadius: "50%", border: `1px solid ${ACCENT}10`, pointerEvents: "none" }} />
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "380px", height: "380px", borderRadius: "50%", border: `1px solid ${ACCENT}16`, pointerEvents: "none" }} />

          <div style={{ position: "relative", maxWidth: "620px", margin: "0 auto" }}>

            {/* Back button */}
            <div style={{ marginBottom: "28px" }}>
              <a
                href="/"
                style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12.5px", fontWeight: 700, color: "var(--text-muted)", textDecoration: "none", padding: "7px 16px", borderRadius: "99px", border: "1.5px solid var(--border-light)", background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", transition: "all 0.15s ease" }}
                onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = ACCENT + "55"; el.style.color = ACCENT; el.style.background = ACCENT + "0D"; }}
                onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "var(--border-light)"; el.style.color = "var(--text-muted)"; el.style.background = "#fff"; }}
              >
                ← All Tools
              </a>
            </div>

            {/* Coming Soon badge */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: `${ACCENT}14`, border: `1.5px solid ${ACCENT}38`, borderRadius: "99px", padding: "6px 18px", marginBottom: "22px" }}>
              <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: ACCENT, display: "inline-block", animation: "pulseDot 1.5s ease-in-out infinite" }} />
              <span style={{ fontSize: "11px", fontWeight: 800, color: ACCENT, letterSpacing: "1.5px", textTransform: "uppercase" }}>
                Coming Soon
              </span>
            </div>

            {/* Floating icon */}
            <div style={{ fontSize: "64px", marginBottom: "16px", display: "block", animation: "floatIcon 3s ease-in-out infinite" }}>
              📋
            </div>

            {/* H1 */}
            <h1 style={{ fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 900, letterSpacing: "-1.2px", color: "var(--text-primary)", lineHeight: 1.1, marginBottom: "12px" }}>
              AI Resume Builder
            </h1>

            {/* Tagline */}
            <p style={{ fontSize: "17px", fontWeight: 700, color: ACCENT, marginBottom: "12px", letterSpacing: "-0.2px" }}>
              Your perfect resume — built in 2 minutes.
            </p>

            {/* Description */}
            <p style={{ fontSize: "14.5px", color: "var(--text-muted)", lineHeight: 1.75, maxWidth: "480px", margin: "0 auto 32px" }}>
              Create a professional, ATS-friendly resume tailored for government jobs, private sector, and fresher applications. AI fills in the right keywords and formats everything perfectly.
            </p>

            {/* Countdown timer */}
            <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginBottom: "32px", flexWrap: "wrap" }}>
              {[
                { val: countdown.d, label: "Days"    },
                { val: countdown.h, label: "Hours"   },
                { val: countdown.m, label: "Minutes" },
                { val: countdown.s, label: "Seconds" },
              ].map(({ val, label }) => (
                <div key={label} style={{ minWidth: "68px", background: "#fff", border: `1.5px solid ${ACCENT}28`, borderRadius: "var(--radius-lg)", padding: "12px 8px", textAlign: "center", boxShadow: `0 4px 16px ${ACCENT}0E` }}>
                  <div style={{ fontSize: "26px", fontWeight: 900, color: ACCENT, lineHeight: 1, fontVariantNumeric: "tabular-nums", letterSpacing: "-1px" }}>
                    {String(val).padStart(2, "0")}
                  </div>
                  <div style={{ fontSize: "9.5px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.8px", marginTop: "4px" }}>
                    {label}
                  </div>
                </div>
              ))}
            </div>

            {/* Waitlist form */}
            {!submitted ? (
              <div style={{ display: "flex", gap: "8px", maxWidth: "420px", margin: "0 auto", flexWrap: "wrap" }}>
                <input
                  type="email"
                  className="input"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleNotify()}
                  style={{ flex: 1, minWidth: "200px", borderRadius: "var(--radius-md)", fontSize: "14px" }}
                />
                <button
                  onClick={handleNotify}
                  style={{ padding: "11px 22px", background: ACCENT, color: "#fff", border: "none", borderRadius: "var(--radius-md)", fontSize: "13.5px", fontWeight: 800, cursor: "pointer", whiteSpace: "nowrap", fontFamily: "var(--font)", transition: "opacity 0.15s", boxShadow: `0 4px 14px ${ACCENT}38` }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                >
                  🔔 Notify Me
                </button>
              </div>
            ) : (
              <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "var(--brand-light)", border: "1.5px solid var(--brand-border)", borderRadius: "var(--radius-lg)", padding: "12px 22px", fontSize: "13.5px", fontWeight: 700, color: "var(--brand)" }}>
                ✅ You are on the waitlist! We will notify you at launch.
              </div>
            )}
            <p style={{ fontSize: "11px", color: "var(--text-hint)", marginTop: "10px" }}>
              No spam. One email at launch. Unsubscribe anytime.
            </p>

          </div>
        </section>

        <div className="container-sm" style={{ padding: "40px 20px 0" }}>

          {/* ════════════════════════════════════════
              FEATURES GRID
          ════════════════════════════════════════ */}
          <div style={{ marginBottom: "48px" }}>
            <div style={{ textAlign: "center", marginBottom: "28px" }}>
              <p style={{ fontSize: "10.5px", fontWeight: 900, color: ACCENT, textTransform: "uppercase", letterSpacing: "2px", marginBottom: "8px" }}>
                What to Expect
              </p>
              <h2 style={{ fontSize: "clamp(20px, 3vw, 28px)", fontWeight: 900, color: "var(--text-primary)", letterSpacing: "-0.6px" }}>
                Everything built in
              </h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "12px" }}>
              {FEATURES.map((f, i) => (
                <div
                  key={i}
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  style={{
                    background: "#fff",
                    border: `1.5px solid ${hoveredIdx === i ? ACCENT + "55" : "var(--border-light)"}`,
                    borderRadius: "var(--radius-xl)",
                    padding: "20px",
                    transition: "all 0.2s ease",
                    transform: hoveredIdx === i ? "translateY(-3px)" : "none",
                    boxShadow: hoveredIdx === i ? `0 8px 24px ${ACCENT}12` : "var(--shadow-sm)",
                    cursor: "default",
                  }}
                >
                  <div style={{ fontSize: "26px", marginBottom: "10px" }}>{f.icon}</div>
                  <h3 style={{ fontSize: "13.5px", fontWeight: 800, color: "var(--text-primary)", marginBottom: "5px" }}>{f.title}</h3>
                  <p style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: 1.6 }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Mid Ad ── */}
          <div aria-hidden="true" style={{ margin: "0 0 40px" }}>
            <ins className="adsbygoogle" style={{ display: "block", minHeight: "250px" }}
              data-ad-format="auto" data-full-width-responsive="true" />
          </div>

          {/* ════════════════════════════════════════
              OTHER TOOLS
          ════════════════════════════════════════ */}
          <div style={{ marginBottom: "40px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "18px", flexWrap: "wrap", gap: "8px" }}>
              <div>
                <p style={{ fontSize: "10.5px", fontWeight: 900, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "4px" }}>
                  While You Wait
                </p>
                <h2 style={{ fontSize: "19px", fontWeight: 900, color: "var(--text-primary)", letterSpacing: "-0.4px" }}>
                  Explore Free Tools — Ready Now
                </h2>
              </div>
              <a
                href="/"
                style={{ fontSize: "12.5px", fontWeight: 700, color: ACCENT, textDecoration: "none", display: "flex", alignItems: "center", gap: "4px", padding: "7px 14px", border: `1.5px solid ${ACCENT}38`, borderRadius: "var(--radius-md)", background: `${ACCENT}08`, transition: "all 0.15s" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = `${ACCENT}14`; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = `${ACCENT}08`; }}
              >
                View All Tools →
              </a>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(148px, 1fr))", gap: "10px" }}>
              {OTHER_TOOLS.map((t) => (
                <a key={t.href} href={t.href} className="tool-card" style={{ padding: "14px", textDecoration: "none" }}>
                  <div className="tool-card-icon" style={{ marginBottom: "8px" }}>{t.icon}</div>
                  <div style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "3px" }}>{t.title}</div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{t.desc}</div>
                </a>
              ))}
            </div>
          </div>

          {/* ── Trust strip ── */}
          <div style={{ background: `linear-gradient(135deg, ${ACCENT}0C, var(--brand-light))`, border: `1.5px solid ${ACCENT}1A`, borderRadius: "var(--radius-xl)", padding: "24px 28px", marginBottom: "40px", display: "flex", gap: "20px", flexWrap: "wrap", alignItems: "center", justifyContent: "center" }}>
            {[
              { icon: "🔒", text: "100% Private — files never leave your device" },
              { icon: "₹0", text: "Free forever — no hidden charges"             },
              { icon: "⚡", text: "Instant — no waiting, no queue"               },
              { icon: "📱", text: "Works on mobile and desktop"                  },
            ].map(({ icon, text }) => (
              <div key={text} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12.5px", fontWeight: 600, color: "var(--text-secondary)" }}>
                <span style={{ fontSize: "16px" }}>{icon}</span>
                {text}
              </div>
            ))}
          </div>

        </div>

        {/* ── Bottom Ad ── */}
        <div aria-hidden="true">
          <ins className="adsbygoogle" style={{ display: "block", minHeight: "90px" }}
            data-ad-format="auto" data-full-width-responsive="true" />
        </div>

        <Footer />
      </main>

      <style>{`
        @keyframes pulseDot {
          0%, 100% { opacity: 1;   transform: scale(1);    }
          50%       { opacity: 0.5; transform: scale(0.75); }
        }
        @keyframes floatIcon {
          0%, 100% { transform: translateY(0px);  }
          50%       { transform: translateY(-8px); }
        }
      `}</style>
    </>
  );
}

/*
export const metadata = {
  title: "AI Resume Builder — Coming Soon | EzSeva",
  description: "Build an ATS-optimised resume for government and private sector jobs in minutes. AI-powered, free forever. Launching soon on EzSeva.",
  openGraph: {
    title: "AI Resume Builder — Coming Soon | EzSeva",
    description: "Your perfect resume built in 2 minutes. Launching soon.",
    url: "https://ezseva.in/ai-resume",
    siteName: "EzSeva",
  },
  alternates: { canonical: "https://ezseva.in/ai-resume" },
};
*/