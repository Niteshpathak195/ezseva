"use client";

// ─────────────────────────────────────────────────────────────────────────────
// EzSeva — AI Tools Coming Soon Page
// Usage: One page serves all 3 AI tools via slug
//
// ROUTES (create these 3 files, each just imports this component):
//   app/ai-letter/page.tsx   → <ComingSoonPage slug="ai-letter"  />
//   app/ai-resume/page.tsx   → <ComingSoonPage slug="ai-resume"  />
//   app/ai-biodata/page.tsx  → <ComingSoonPage slug="ai-biodata" />
//
// OR use Next.js dynamic route:
//   app/[aiTool]/page.tsx    → read params.aiTool
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

/* ── Tool config per slug ── */

type ToolSlug = "ai-letter" | "ai-resume" | "ai-biodata";

interface AIToolConfig {
  icon: string;
  title: string;
  tagline: string;
  description: string;
  accentColor: string;
  gradientFrom: string;
  gradientTo: string;
  features: { icon: string; title: string; desc: string }[];
  estimatedLaunch: string;
  waitlistLabel: string;
}

const TOOL_CONFIGS: Record<ToolSlug, AIToolConfig> = {
  "ai-letter": {
    icon: "✍️",
    title: "AI Letter Writer",
    tagline: "Official letters written in seconds.",
    description:
      "Generate professional application letters, complaint letters, government correspondence, and more — in both English and Hindi. Powered by AI, formatted to official standards.",
    accentColor: "#7C3AED",
    gradientFrom: "#7C3AED",
    gradientTo: "#0D9488",
    estimatedLaunch: "Coming Soon",
    waitlistLabel: "Notify me when Letter Writer launches",
    features: [
      { icon: "📝", title: "30+ Letter Templates",    desc: "Job application, leave, complaint, NOC, income certificate request and more." },
      { icon: "🌐", title: "English & Hindi",          desc: "Full support for both languages. Official tone guaranteed." },
      { icon: "⚡", title: "One-Click Generate",       desc: "Fill 3 fields, get a perfect letter. No writing skills needed." },
      { icon: "📄", title: "Download as PDF / DOCX",   desc: "Ready to print and submit — formatted to government standards." },
      { icon: "🔒", title: "100% Private",             desc: "Your details never stored. AI runs per-request, no history saved." },
      { icon: "✏️", title: "Edit Before Download",    desc: "Full in-browser editing after AI generation." },
    ],
  },
  "ai-resume": {
    icon: "📋",
    title: "AI Resume Builder",
    tagline: "Your perfect resume — built in 2 minutes.",
    description:
      "Create a professional, ATS-friendly resume tailored for government jobs, private sector, and fresher applications. AI fills in the right keywords and formats everything perfectly.",
    accentColor: "#0D9488",
    gradientFrom: "#0D9488",
    gradientTo: "#059669",
    estimatedLaunch: "Coming Soon",
    waitlistLabel: "Notify me when Resume Builder launches",
    features: [
      { icon: "🎯", title: "ATS-Optimised",            desc: "Passes applicant tracking systems used by top employers and portals." },
      { icon: "🏛️", title: "Govt Job Formats",         desc: "Special templates for UPSC, SSC, Railway, Bank and state PSC applications." },
      { icon: "⚡", title: "AI Auto-Fill",              desc: "Enter your basic details — AI writes your summary, skills and experience sections." },
      { icon: "🎨", title: "10+ Clean Templates",       desc: "Professional designs that print perfectly on A4." },
      { icon: "📄", title: "Export PDF Instantly",      desc: "No email required. Download directly to your device." },
      { icon: "🔄", title: "Update Anytime",            desc: "Come back and edit — your draft is saved locally in your browser." },
    ],
  },
  "ai-biodata": {
    icon: "🤖",
    title: "AI Biodata Maker",
    tagline: "Marriage biodata — beautiful, ready to share.",
    description:
      "Create a well-formatted marriage biodata with family details, horoscope section, photo placeholder, and personal information — designed for Indian matrimonial requirements.",
    accentColor: "#D97706",
    gradientFrom: "#D97706",
    gradientTo: "#DC2626",
    estimatedLaunch: "Coming Soon",
    waitlistLabel: "Notify me when Biodata Maker launches",
    features: [
      { icon: "💍", title: "Matrimonial Format",        desc: "Standard Indian biodata format accepted by all matrimonial sites and families." },
      { icon: "📸", title: "Photo Placeholder",         desc: "Add your photo directly in the browser — no external editor needed." },
      { icon: "⭐", title: "Horoscope Section",         desc: "Optional Kundli details section — Rashi, Nakshatra, Gotra fields included." },
      { icon: "🎨", title: "5 Elegant Designs",         desc: "Traditional and modern designs — suitable for all communities." },
      { icon: "📄", title: "Download as PDF",            desc: "Print-ready A4 PDF. Looks professional, shares easily on WhatsApp." },
      { icon: "🔒", title: "Fully Private",             desc: "Nothing uploaded to any server. All processing in your browser." },
    ],
  },
};

/* ── Other tools to show at bottom ── */

const OTHER_TOOLS = [
  { icon: "🖼️", title: "Image Resize",    href: "/image-resize",  desc: "SSC, Railway, VYAPAM sizes"     },
  { icon: "🪪", title: "Photo+Signature", href: "/photo-joiner",  desc: "Merge for govt forms"            },
  { icon: "📄", title: "Image to PDF",    href: "/image-to-pdf",  desc: "Combine images into PDF"         },
  { icon: "🎨", title: "Image Crop",      href: "/image-crop",    desc: "Crop to any dimension"           },
  { icon: "🗜️", title: "PDF Compress",   href: "/pdf-compress",  desc: "Shrink PDF file size"            },
  { icon: "📑", title: "PDF Merge",       href: "/pdf-merge",     desc: "Combine PDFs into one"           },
  { icon: "✂️", title: "PDF Split",       href: "/pdf-split",     desc: "Extract PDF pages"               },
  { icon: "🔒", title: "PDF Protect",     href: "/pdf-protect",   desc: "Password protect PDF"            },
  { icon: "⌨️", title: "Typing Test",     href: "/typing-test",   desc: "CPCT, SSC, Railway practice"    },
];

/* ── Animated counter hook ── */
function useCountdown(targetDate: string) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
  useEffect(() => {
    // Fake launch ~30 days from now for "Coming Soon" feel
    const target = new Date();
    target.setDate(target.getDate() + 30);
    const tick = () => {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) return;
      setTimeLeft({
        days:  Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        mins:  Math.floor((diff % 3600000) / 60000),
        secs:  Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);
  return timeLeft;
}

/* ── Particle canvas for background ── */
function ParticleBg({ color }: { color: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animId: number;
    const particles: { x: number; y: number; r: number; vx: number; vy: number; alpha: number }[] = [];
    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    for (let i = 0; i < 28; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2.5 + 0.5,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        alpha: Math.random() * 0.4 + 0.1,
      });
    }
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = color + Math.round(p.alpha * 255).toString(16).padStart(2, "0");
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, [color]);
  return (
    <canvas
      ref={canvasRef}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
    />
  );
}

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT — export this from each AI tool's page.tsx
══════════════════════════════════════════════════════════════ */

export function ComingSoonPage({ slug }: { slug: ToolSlug }) {
  const config   = TOOL_CONFIGS[slug] || TOOL_CONFIGS["ai-letter"];
  const countdown = useCountdown(config.estimatedLaunch);
  const [email, setEmail]       = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  const handleNotify = () => {
    if (!email.trim() || !email.includes("@")) return;
    // In production: POST to /api/waitlist or a Google Form
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
            HERO — Full bleed gradient
        ════════════════════════════════════════ */}
        <section style={{
          position: "relative", overflow: "hidden",
          background: `linear-gradient(135deg, ${config.gradientFrom}18 0%, ${config.gradientTo}10 50%, var(--bg-subtle) 100%)`,
          borderBottom: `1px solid ${config.accentColor}22`,
          padding: "56px 24px 48px",
          textAlign: "center",
        }}>
          {/* Particle background */}
          <ParticleBg color={config.accentColor} />

          {/* Decorative rings */}
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "600px", height: "600px", borderRadius: "50%", border: `1px solid ${config.accentColor}12`, pointerEvents: "none" }} />
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "400px", height: "400px", borderRadius: "50%", border: `1px solid ${config.accentColor}18`, pointerEvents: "none" }} />

          <div style={{ position: "relative", maxWidth: "620px", margin: "0 auto" }}>

            {/* Back button */}
            <div style={{ marginBottom: "28px" }}>
              <a href="/" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12.5px", fontWeight: 700, color: "var(--text-muted)", textDecoration: "none", padding: "7px 16px", borderRadius: "99px", border: "1.5px solid var(--border-light)", background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", transition: "all 0.15s ease" }}
                onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = config.accentColor + "66"; el.style.color = config.accentColor; el.style.background = config.accentColor + "0D"; }}
                onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "var(--border-light)"; el.style.color = "var(--text-muted)"; el.style.background = "#fff"; }}
              >
                ← All Tools
              </a>
            </div>

            {/* Coming Soon pill */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: `${config.accentColor}15`, border: `1.5px solid ${config.accentColor}40`, borderRadius: "99px", padding: "6px 18px", marginBottom: "22px" }}>
              <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: config.accentColor, display: "inline-block", animation: "pulseDot 1.5s ease-in-out infinite" }} />
              <span style={{ fontSize: "11.5px", fontWeight: 800, color: config.accentColor, letterSpacing: "1.5px", textTransform: "uppercase" }}>
                Coming Soon
              </span>
            </div>

            {/* Icon */}
            <div style={{ fontSize: "64px", marginBottom: "16px", display: "block", animation: "floatIcon 3s ease-in-out infinite" }}>
              {config.icon}
            </div>

            {/* Title */}
            <h1 style={{ fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 900, letterSpacing: "-1.2px", color: "var(--text-primary)", lineHeight: 1.1, marginBottom: "12px" }}>
              {config.title}
            </h1>

            {/* Tagline */}
            <p style={{ fontSize: "17px", fontWeight: 700, color: config.accentColor, marginBottom: "12px", letterSpacing: "-0.2px" }}>
              {config.tagline}
            </p>

            {/* Description */}
            <p style={{ fontSize: "14.5px", color: "var(--text-muted)", lineHeight: 1.75, maxWidth: "480px", margin: "0 auto 32px" }}>
              {config.description}
            </p>

            {/* Countdown */}
            <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginBottom: "32px", flexWrap: "wrap" }}>
              {[
                { val: countdown.days,  label: "Days"    },
                { val: countdown.hours, label: "Hours"   },
                { val: countdown.mins,  label: "Minutes" },
                { val: countdown.secs,  label: "Seconds" },
              ].map(({ val, label }) => (
                <div key={label} style={{ minWidth: "68px", background: "#fff", border: `1.5px solid ${config.accentColor}30`, borderRadius: "var(--radius-lg)", padding: "12px 8px", textAlign: "center", boxShadow: `0 4px 16px ${config.accentColor}10` }}>
                  <div style={{ fontSize: "26px", fontWeight: 900, color: config.accentColor, lineHeight: 1, fontVariantNumeric: "tabular-nums", letterSpacing: "-1px" }}>
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
                  style={{ padding: "11px 22px", background: config.accentColor, color: "#fff", border: "none", borderRadius: "var(--radius-md)", fontSize: "13.5px", fontWeight: 800, cursor: "pointer", whiteSpace: "nowrap", fontFamily: "var(--font)", transition: "opacity 0.15s", boxShadow: `0 4px 14px ${config.accentColor}40` }}
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
              <p style={{ fontSize: "10.5px", fontWeight: 900, color: config.accentColor, textTransform: "uppercase", letterSpacing: "2px", marginBottom: "8px" }}>
                What to Expect
              </p>
              <h2 style={{ fontSize: "clamp(20px, 3vw, 28px)", fontWeight: 900, color: "var(--text-primary)", letterSpacing: "-0.6px" }}>
                Everything you need, built in
              </h2>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "12px" }}>
              {config.features.map((f, i) => (
                <div
                  key={i}
                  onMouseEnter={() => setHoveredFeature(i)}
                  onMouseLeave={() => setHoveredFeature(null)}
                  style={{
                    background: "#fff",
                    border: `1.5px solid ${hoveredFeature === i ? config.accentColor + "60" : "var(--border-light)"}`,
                    borderRadius: "var(--radius-xl)",
                    padding: "20px",
                    transition: "all 0.2s ease",
                    transform: hoveredFeature === i ? "translateY(-3px)" : "none",
                    boxShadow: hoveredFeature === i ? `0 8px 24px ${config.accentColor}15` : "var(--shadow-sm)",
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
              OTHER TOOLS — Explore
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
              <a href="/" style={{ fontSize: "12.5px", fontWeight: 700, color: config.accentColor, textDecoration: "none", display: "flex", alignItems: "center", gap: "4px", padding: "7px 14px", border: `1.5px solid ${config.accentColor}40`, borderRadius: "var(--radius-md)", background: `${config.accentColor}08`, transition: "all 0.15s" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = `${config.accentColor}15`; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = `${config.accentColor}08`; }}
              >
                View All Tools →
              </a>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(148px, 1fr))", gap: "10px" }}>
              {OTHER_TOOLS.map((t) => (
                <a
                  key={t.href}
                  href={t.href}
                  className="tool-card"
                  style={{ padding: "14px", textDecoration: "none" }}
                >
                  <div className="tool-card-icon" style={{ marginBottom: "8px" }}>{t.icon}</div>
                  <div style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "3px" }}>{t.title}</div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{t.desc}</div>
                </a>
              ))}
            </div>
          </div>

          {/* ════════════════════════════════════════
              TRUST STRIP
          ════════════════════════════════════════ */}
          <div style={{ background: `linear-gradient(135deg, ${config.accentColor}10, var(--brand-light))`, border: `1.5px solid ${config.accentColor}20`, borderRadius: "var(--radius-xl)", padding: "24px 28px", marginBottom: "40px", display: "flex", gap: "20px", flexWrap: "wrap", alignItems: "center", justifyContent: "center" }}>
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
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(0.75); }
        }
        @keyframes floatIcon {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-8px); }
        }
      `}</style>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════
   DEFAULT EXPORT — for ai-letter/page.tsx
   Copy this file and change the slug for ai-resume and ai-biodata
══════════════════════════════════════════════════════════════ */

export default function AILetterComingSoon() {
  return <ComingSoonPage slug="ai-letter" />;
}

/*
 * ─────────────────────────────────────────────────────────────
 * HOW TO USE FOR OTHER AI TOOLS:
 *
 * app/ai-resume/page.tsx:
 * ─────────────────────────
 * "use client";
 * import { ComingSoonPage } from "../ai-letter/page";
 * export default function AIResumeComingSoon() {
 *   return <ComingSoonPage slug="ai-resume" />;
 * }
 *
 * app/ai-biodata/page.tsx:
 * ─────────────────────────
 * "use client";
 * import { ComingSoonPage } from "../ai-letter/page";
 * export default function AIBiodataComingSoon() {
 *   return <ComingSoonPage slug="ai-biodata" />;
 * }
 * ─────────────────────────────────────────────────────────────
 *
 * SEO (add to each tool's layout.tsx):
 *
 * ai-letter:
 * export const metadata = {
 *   title: "AI Letter Writer — Coming Soon | EzSeva",
 *   description: "AI-powered letter writing for government applications, job letters, complaints and more. Launching soon on EzSeva.",
 *   alternates: { canonical: "https://ezseva.in/ai-letter" },
 * };
 *
 * ai-resume:
 * export const metadata = {
 *   title: "AI Resume Builder — Coming Soon | EzSeva",
 *   description: "Build an ATS-optimised resume for government and private sector jobs in minutes. Launching soon.",
 *   alternates: { canonical: "https://ezseva.in/ai-resume" },
 * };
 *
 * ai-biodata:
 * export const metadata = {
 *   title: "AI Biodata Maker — Coming Soon | EzSeva",
 *   description: "Create a professional Indian marriage biodata with AI. Beautiful templates, PDF download. Launching soon.",
 *   alternates: { canonical: "https://ezseva.in/ai-biodata" },
 * };
 */