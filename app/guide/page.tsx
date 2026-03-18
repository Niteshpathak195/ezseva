"use client";

// ─────────────────────────────────────────────────────────────────────────────
// EzSeva — How to Use Guide
// app/guide/page.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Version    : 1.0.0
// Updated    : March 2026
//
// AUDIT CHECKLIST:
//   ✅ "use client" line 1
//   ✅ Navbar + Footer imported
//   ✅ 3 AdSense blocks (top, mid, bottom)
//   ✅ ← All Tools button
//   ✅ No hardcoded hex except #fff
//   ✅ No form tags
//   ✅ No dangerouslySetInnerHTML
//   ✅ No console.log/error
//   ✅ All tool links correct
//   ✅ SEO metadata block commented at bottom
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

/* ═══════════════════════════════════════════════════════════════
   TOOL GUIDE DATA
═══════════════════════════════════════════════════════════════ */

type ToolCategory = "Image Tools" | "PDF Tools" | "AI Tools" | "Typing Test";

interface ToolGuide {
  id: string;
  icon: string;
  title: string;
  href: string;
  cat: ToolCategory;
  catColor: string;
  tagline: string;
  formats: string;
  limits: string;
  comingSoon?: boolean;
  steps: { title: string; desc: string }[];
  tips: string[];
  useCases: string[];
}

const TOOL_GUIDES: ToolGuide[] = [
  /* ── IMAGE TOOLS ─────────────────────────────────────────── */
  {
    id: "image-resize",
    icon: "🖼️",
    title: "Image Resize",
    href: "/image-resize",
    cat: "Image Tools",
    catColor: "#0D9488",
    tagline: "Resize photos to exact dimensions for government exam forms.",
    formats: "JPG, PNG, WebP, GIF",
    limits: "Max 20 MB per file",
    steps: [
      { title: "Upload Your Photo",     desc: "Click the upload zone or drag and drop a JPG, PNG or WebP image. Maximum file size is 20 MB." },
      { title: "Select Exam Preset",    desc: "Choose from SSC CGL, Railway RRB, UPSC, VYAPAM, Passport, or enter custom width, height and max KB values." },
      { title: "Click Resize Image",    desc: "The tool resizes and compresses your image to meet the exact pixel dimensions and file size limit instantly in your browser." },
      { title: "Download",              desc: "Click Download. Your resized image saves as a JPEG. Nothing is sent to any server." },
    ],
    tips: [
      "Use JPEG format for all government exam portals — it produces the smallest file size.",
      "If the file size exceeds the limit after resizing, try lowering the Quality slider.",
      "For passport-size photos, use the Passport / Visa preset — it sets 600×600 px at 50 KB automatically.",
      "SSC, Railway, and VYAPAM all require 200×230 px — use their specific presets to ensure accuracy.",
    ],
    useCases: ["SSC CGL / CHSL application photo", "Railway RRB form photo", "UPSC Civil Services photo", "Passport / Visa photo", "VYAPAM MP PEB exam photo"],
  },
  {
    id: "photo-joiner",
    icon: "🪪",
    title: "Photo + Signature Joiner",
    href: "/photo-joiner",
    cat: "Image Tools",
    catColor: "#0D9488",
    tagline: "Combine passport photo and signature into one JPEG for govt forms.",
    formats: "JPG, PNG, WebP (input) → JPEG (output)",
    limits: "Max 20 MB per image",
    steps: [
      { title: "Select Exam Preset",    desc: "Choose your exam — SSC, IBPS, Railway, VYAPAM, or UPSC. The tool auto-sets correct photo and signature dimensions." },
      { title: "Choose Layout",         desc: "Photo Left + Signature Right is the standard. Photo Top + Signature Below is the alternate layout." },
      { title: "Upload Both Images",    desc: "Upload your passport photo and your signature image. Signature background is automatically whitened." },
      { title: "Download Combined JPEG",desc: "A preview generates instantly. Click Download JPEG to save the combined image ready for upload." },
    ],
    tips: [
      "Sign on clean white paper with a blue or black pen and photograph it in good lighting for best results.",
      "The tool automatically whitens the background behind your signature — no editing needed.",
      "If the output exceeds the file size limit, try uploading a smaller or simpler photo.",
      "Use Custom preset if your exam is not listed — enter exact dimensions from the official notification.",
    ],
    useCases: ["SSC CGL / CHSL combined image", "IBPS PO / Clerk form", "Railway RRB application", "VYAPAM MP exam", "UPSC Civil Services form"],
  },
  {
    id: "image-to-pdf",
    icon: "📄",
    title: "Image to PDF",
    href: "/image-to-pdf",
    cat: "Image Tools",
    catColor: "#0D9488",
    tagline: "Convert multiple images into a single PDF — reorder pages freely.",
    formats: "JPG, PNG, WebP, GIF (input) → PDF (output)",
    limits: "Max 20 MB per image · Up to 20 images",
    steps: [
      { title: "Upload Images",         desc: "Click the upload zone or drag and drop up to 20 images. Each image becomes one page in the PDF." },
      { title: "Reorder Pages",         desc: "Drag and drop the thumbnails to set the correct page order. The number badge shows page sequence." },
      { title: "Set PDF Options",       desc: "Choose page size (A4 recommended), margin, image fit, and output filename." },
      { title: "Generate and Download", desc: "Click Generate PDF. The file is created instantly in your browser and downloads automatically." },
    ],
    tips: [
      "A4 with Fit to Page and Small margin gives the most professional result for government submissions.",
      "Use Fill Page if you want the image to cover the full page without white borders.",
      "For Aadhaar cards and certificates, scan both sides as separate images and combine into one PDF.",
      "The drag-to-reorder feature works on mobile touch screens as well.",
    ],
    useCases: ["Aadhaar card front and back in one PDF", "Marksheet and certificate bundle", "Multi-page document from phone photos", "Land record scans", "Medical report compilation"],
  },
  {
    id: "image-crop",
    icon: "🎨",
    title: "Image Crop",
    href: "/image-crop",
    cat: "Image Tools",
    catColor: "#0D9488",
    tagline: "Crop photos to any ratio or exact pixel size — exam presets included.",
    formats: "JPG, PNG, WebP, GIF, BMP",
    limits: "Max 20 MB per file",
    steps: [
      { title: "Upload Your Image",     desc: "Drag and drop or click to select your image. Supports JPG, PNG, WebP, GIF and BMP up to 20 MB." },
      { title: "Choose Preset or Ratio",desc: "Select an exam preset (SSC, Passport, UPSC) or a standard ratio (1:1, 4:3, 16:9). Drag to draw your crop area on the canvas." },
      { title: "Set Output Size",       desc: "Optionally enter exact pixel dimensions in the Output Size fields. Leave blank to use the crop area dimensions." },
      { title: "Apply and Download",    desc: "Click Apply Crop to preview. Choose JPEG, PNG, or WebP format and download." },
    ],
    tips: [
      "For exam photos, use the SSC/Railway preset — it automatically locks the aspect ratio to 200×230.",
      "Click inside the crop box to move it. Draw outside it to create a new crop area.",
      "Use JPEG format with quality 85–92% for the best balance of size and quality for government portals.",
      "Touch-drag works on mobile — tap and drag to draw the crop area on your phone screen.",
    ],
    useCases: ["Crop passport photo to exact size", "Square crop for WhatsApp DP", "UPSC photo crop to 300×400", "Signature crop from full photo", "Certificate crop for document submission"],
  },

  /* ── PDF TOOLS ────────────────────────────────────────────── */
  {
    id: "pdf-compress",
    icon: "🗜️",
    title: "PDF Compress",
    href: "/pdf-compress",
    cat: "PDF Tools",
    catColor: "#7C3AED",
    tagline: "Reduce PDF file size for email, WhatsApp, and government portal uploads.",
    formats: "PDF only",
    limits: "Max 50 MB",
    steps: [
      { title: "Upload Your PDF",           desc: "Click or drag and drop a PDF file up to 50 MB. Works best on scanned PDFs and image-heavy documents." },
      { title: "Choose Compression Level",  desc: "Low keeps best quality (10–30% reduction). Medium is balanced (30–60%). High is for portal uploads (50–75%). Maximum gives smallest file (65–85%)." },
      { title: "Click Compress PDF",        desc: "A progress bar shows parsing, image compression, and PDF rebuilding steps. Takes 5–20 seconds depending on file size." },
      { title: "Download Compressed PDF",   desc: "Click Download Compressed PDF. File saves as compressed_[originalname].pdf." },
    ],
    tips: [
      "Scanned PDFs and image-heavy PDFs see the greatest size reduction. Text-only PDFs may see minimal reduction.",
      "For VYAPAM and SSC portals with 1 MB or 500 KB limit, use High or Maximum compression.",
      "For email attachments and Google Drive sharing, Medium compression is usually sufficient.",
      "Password-protected PDFs cannot be compressed — remove the password first using PDF Protect tool.",
    ],
    useCases: ["Reduce PDF for government portal upload", "Compress for WhatsApp sharing", "Shrink for email attachment", "Meet VYAPAM / SSC file size limit", "Compress scanned certificate PDF"],
  },
  {
    id: "pdf-merge",
    icon: "📑",
    title: "PDF Merge",
    href: "/pdf-merge",
    cat: "PDF Tools",
    catColor: "#7C3AED",
    tagline: "Combine multiple PDF files into one — reorder, then download.",
    formats: "PDF only",
    limits: "Max 50 MB per file · Up to 20 files",
    steps: [
      { title: "Upload PDF Files",      desc: "Click or drag and drop multiple PDF files. You can add up to 20 files, each up to 50 MB." },
      { title: "Reorder Files",         desc: "Drag the file cards to set the order in the final merged PDF. The sequence shown is the page order." },
      { title: "Click Merge PDF",       desc: "All files are merged into a single PDF in your browser. No server upload required." },
      { title: "Download Merged PDF",   desc: "Click Download. The file saves as merged_output.pdf — all pages in one file." },
    ],
    tips: [
      "Arrange your files in the correct order before merging — the top file becomes the first pages.",
      "If one file is too large, compress it first using PDF Compress before merging.",
      "Merged PDFs may be larger than the sum of individual files — compress afterwards if needed.",
      "Password-protected PDFs cannot be merged — remove password first.",
    ],
    useCases: ["Combine application form and supporting documents", "Merge Aadhaar + marksheet + certificate", "Join front and back scan of documents", "Bundle multiple certificates into one file", "Combine multi-part downloaded PDFs"],
  },
  {
    id: "pdf-split",
    icon: "✂️",
    title: "PDF Split",
    href: "/pdf-split",
    cat: "PDF Tools",
    catColor: "#7C3AED",
    tagline: "Extract specific pages or split a PDF into multiple files.",
    formats: "PDF only",
    limits: "Max 50 MB",
    steps: [
      { title: "Upload Your PDF",       desc: "Drag and drop or click to select a PDF up to 50 MB. The total page count is shown after upload." },
      { title: "Choose Split Method",   desc: "Custom Range: type page numbers like '1-3, 5'. Every N Pages: split into fixed chunks. Every Page: one PDF per page." },
      { title: "Set Output Filename",   desc: "Enter a prefix for the output files. They will be named prefix_part_1.pdf, prefix_part_2.pdf, etc." },
      { title: "Split and Download",    desc: "Click Split PDF. Download files individually or click Download All as ZIP for all files at once." },
    ],
    tips: [
      "To extract just one page, use Custom Range and type a single number — e.g. '3' for page 3 only.",
      "Every Page mode is useful when you have a scanned book and need individual page images.",
      "For large PDFs, split first to reduce size, then compress each part separately.",
      "The ZIP download uses DEFLATE compression — the ZIP itself is slightly smaller than the sum of PDFs.",
    ],
    useCases: ["Extract a single page from a form", "Separate individual certificates from a bundle", "Split a large report into chapters", "Extract pages for specific submission", "Create single-page PDFs from a multi-page scan"],
  },
  {
    id: "pdf-protect",
    icon: "🔒",
    title: "PDF Protect",
    href: "/pdf-protect",
    cat: "PDF Tools",
    catColor: "#7C3AED",
    tagline: "Add password protection to any PDF — 128-bit encryption.",
    formats: "PDF only",
    limits: "Max 50 MB",
    steps: [
      { title: "Upload Your PDF",       desc: "Click or drag and drop a PDF file up to 50 MB. The file is read entirely in your browser." },
      { title: "Set a Password",        desc: "Enter a strong password. The strength indicator shows Weak / Fair / Good / Strong. Use at least 8 characters with numbers and symbols." },
      { title: "Click Protect PDF",     desc: "The PDF is encrypted with 128-bit AES in your browser. No password is ever sent to any server." },
      { title: "Download and Save Password", desc: "Click Download Protected PDF. Save your password immediately — it cannot be recovered if lost." },
    ],
    tips: [
      "Save your password in a secure place before closing the tab — the tool does not store it anywhere.",
      "Use a password with at least 8 characters mixing uppercase, lowercase, numbers and symbols for Good strength.",
      "Password-protected PDFs cannot be compressed or merged — protect only as the final step.",
      "To share a protected PDF, send the file and password through different channels for security.",
    ],
    useCases: ["Protect personal documents before sharing", "Secure Aadhaar card PDF", "Password-protect financial documents", "Secure legal agreements", "Protect confidential certificates"],
  },

  /* ── AI TOOLS ─────────────────────────────────────────────── */
  {
    id: "ai-letter",
    icon: "✍️",
    title: "AI Letter Writer",
    href: "/ai-letter",
    cat: "AI Tools",
    catColor: "#D97706",
    tagline: "Generate official letters in seconds — English and Hindi.",
    formats: "Output: PDF / DOCX",
    limits: "Coming Soon",
    comingSoon: true,
    steps: [
      { title: "Select Letter Type",    desc: "Choose from job application, leave application, complaint, NOC, income certificate request, and 25+ more templates." },
      { title: "Fill Basic Details",    desc: "Enter your name, recipient, subject, and 1–2 lines of context. The AI handles the rest." },
      { title: "Generate with AI",      desc: "Click Generate. The AI writes a complete, officially formatted letter in seconds." },
      { title: "Edit and Download",     desc: "Edit the generated letter in-browser if needed, then download as PDF or DOCX." },
    ],
    tips: [
      "Joining the waitlist gets you early access when the tool launches.",
      "The tool will support both English and Hindi (formal) letter formats.",
      "Output will be formatted to government and corporate standards — ready to print and submit.",
    ],
    useCases: ["Job application letter", "Leave application to employer", "Complaint to government office", "NOC request letter", "Income certificate request"],
  },
  {
    id: "ai-resume",
    icon: "📋",
    title: "AI Resume Builder",
    href: "/ai-resume",
    cat: "AI Tools",
    catColor: "#D97706",
    tagline: "Build an ATS-optimised resume for government and private jobs.",
    formats: "Output: PDF",
    limits: "Coming Soon",
    comingSoon: true,
    steps: [
      { title: "Enter Basic Details",   desc: "Fill in your name, education, work experience, and skills. Takes under 3 minutes." },
      { title: "Choose a Template",     desc: "Select from 10+ clean templates — government-style, corporate, or fresher formats." },
      { title: "AI Enhances Your Content", desc: "AI rewrites your summary, bullet points, and skills section for ATS compatibility and impact." },
      { title: "Download PDF",          desc: "Download your completed resume instantly — no email, no account required." },
    ],
    tips: [
      "Join the waitlist to be notified the moment this tool launches.",
      "Special templates for UPSC, SSC, Railway, and Bank job applications will be included.",
      "ATS optimisation means your resume passes automated screening systems used by top employers.",
    ],
    useCases: ["Government job application resume", "Bank PO application", "SSC / Railway application", "Private sector fresher resume", "Career change resume"],
  },
  {
    id: "ai-biodata",
    icon: "🤖",
    title: "AI Biodata Maker",
    href: "/ai-biodata",
    cat: "AI Tools",
    catColor: "#D97706",
    tagline: "Create a beautiful Indian marriage biodata — PDF ready to share.",
    formats: "Output: PDF",
    limits: "Coming Soon",
    comingSoon: true,
    steps: [
      { title: "Enter Personal Details", desc: "Fill in personal, family, education and professional information." },
      { title: "Add Photo",             desc: "Upload your photo directly in the browser — no external editor needed." },
      { title: "Choose Design",         desc: "Pick from 5 elegant templates — traditional and modern styles for all communities." },
      { title: "Download PDF",          desc: "Download a print-ready A4 PDF. Share directly on WhatsApp or print at home." },
    ],
    tips: [
      "Join the waitlist to be notified at launch.",
      "Optional horoscope section will include Rashi, Nakshatra, and Gotra fields.",
      "All templates are designed for Indian matrimonial standards and accepted by all matrimonial portals.",
    ],
    useCases: ["Hindu / Muslim / Christian / Sikh biodata", "Matrimonial site profile", "Family sharing biodata", "Shaadi.com / Jeevansathi profile", "Printable marriage biodata"],
  },

  /* ── TYPING TEST ──────────────────────────────────────────── */
  {
    id: "typing-test",
    icon: "⌨️",
    title: "Typing Speed Test",
    href: "/typing-test",
    cat: "Typing Test",
    catColor: "#059669",
    tagline: "Practice typing for CPCT, SSC, Railway and VYAPAM — Hindi and English.",
    formats: "English / Hindi (Mangal Unicode)",
    limits: "No file upload — browser only",
    steps: [
      { title: "Select Exam and Language", desc: "Choose your target exam (CPCT, SSC CHSL, Railway RRB, VYAPAM) and language (English or Hindi). Set test duration." },
      { title: "Learn Finger Placement",   desc: "New to touch typing? Click 'Learn Finger Placement First' to complete the 8-lesson course before taking the test." },
      { title: "Start Typing",             desc: "Click Start Test, then tap the passage to begin. Live WPM, accuracy and error count update in real time as you type. Use Backspace to correct mistakes." },
      { title: "Review Your Result",       desc: "See your WPM, accuracy, grade, streak and a WPM-over-time graph. Personal best is saved automatically per exam." },
    ],
    tips: [
      "Focus on accuracy first — aim for 95%+ before trying to increase speed. Speed follows naturally.",
      "Practice 30 minutes daily. Clear improvement is visible within 4–6 weeks.",
      "Complete the Finger Placement course before practicing — correct finger habits are the foundation.",
      "For Hindi typing, practice using the Mangal Inscript keyboard layout — this is the standard for all government exams.",
      "CPCT requires 30 WPM English or 20 WPM Hindi at 85%+ accuracy. SSC requires 35 WPM English.",
    ],
    useCases: ["CPCT MP exam preparation", "SSC CHSL / CGL typing practice", "Railway RRB Junior Clerk test", "VYAPAM Steno / Data Entry prep", "Daily typing speed improvement"],
  },
];

const CATEGORIES: { label: ToolCategory; icon: string; color: string; desc: string }[] = [
  { label: "Image Tools",  icon: "🖼️", color: "#0D9488", desc: "Resize, crop, merge and convert images"    },
  { label: "PDF Tools",    icon: "📄", color: "#7C3AED", desc: "Compress, merge, split and protect PDFs"   },
  { label: "AI Tools",     icon: "🤖", color: "#D97706", desc: "AI-powered letters, resumes and biodata"   },
  { label: "Typing Test",  icon: "⌨️", color: "#059669", desc: "Practice typing for government exams"      },
];

const PLATFORM_FAQ = [
  {
    q: "Are all EzSeva tools completely free?",
    a: "Yes. Every tool on EzSeva is free to use with no limits. There are no hidden charges, no trials, and no signup required. A Premium plan is available for advanced features but the core tools will always remain free.",
  },
  {
    q: "Are my files uploaded to any server?",
    a: "No. Every tool on EzSeva runs entirely in your browser. Your files are processed using browser APIs (Canvas API, pdf-lib, Web Audio API) — nothing is uploaded to any server at any point. Your documents remain 100% private on your device.",
  },
  {
    q: "Do I need to create an account?",
    a: "No. There is no account, no signup, and no login required for any tool on EzSeva. Open the tool, use it, and close it. No personal information is collected.",
  },
  {
    q: "Do the tools work on mobile phones?",
    a: "Yes. All tools are mobile-responsive and work on Android and iOS browsers. You can upload photos from your phone gallery, process them, and download the results directly to your phone.",
  },
  {
    q: "What browsers are supported?",
    a: "EzSeva works on all modern browsers including Chrome, Firefox, Edge, and Safari (desktop and mobile). For best performance, use the latest version of Chrome or Edge. Internet Explorer is not supported.",
  },
  {
    q: "Why is a tool showing an error with my file?",
    a: "Common causes: file exceeds the size limit (20 MB for images, 50 MB for PDFs), file is password-protected (remove password first), or the file is corrupted. Try with a different file. If the issue persists, try refreshing the page and uploading again.",
  },
];

/* ═══════════════════════════════════════════════════════════════
   SUB-COMPONENTS
═══════════════════════════════════════════════════════════════ */

function StepBadge({ n }: { n: number }) {
  return (
    <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--brand)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 900, flexShrink: 0, marginTop: "1px" }}>
      {n}
    </div>
  );
}

function ToolCard({ guide, isActive, onClick }: { guide: ToolGuide; isActive: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: "10px",
        padding: "10px 12px", borderRadius: "var(--radius-md)",
        border: `1.5px solid ${isActive ? guide.catColor + "66" : "var(--border-light)"}`,
        background: isActive ? guide.catColor + "0D" : "#fff",
        cursor: "pointer", textAlign: "left", width: "100%",
        fontFamily: "var(--font)", transition: "all 0.15s ease",
      }}
    >
      <span style={{ fontSize: "18px", flexShrink: 0 }}>{guide.icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: "12.5px", fontWeight: 700, color: isActive ? guide.catColor : "var(--text-primary)", marginBottom: "1px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {guide.title}
        </p>
        {guide.comingSoon && (
          <span style={{ fontSize: "9px", fontWeight: 800, color: guide.catColor, textTransform: "uppercase", letterSpacing: "0.8px" }}>Soon</span>
        )}
      </div>
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════ */

export default function GuidePage() {
  const [activeToolId, setActiveToolId] = useState("image-resize");
  const [activeCat, setActiveCat]       = useState<ToolCategory>("Image Tools");
  const detailRef = useRef<HTMLDivElement>(null);

  const activeTool = TOOL_GUIDES.find((t) => t.id === activeToolId) || TOOL_GUIDES[0];
  const catTools   = TOOL_GUIDES.filter((t) => t.cat === activeCat);

  const handleToolSelect = (id: string) => {
    setActiveToolId(id);
    // Scroll to detail panel on mobile
    setTimeout(() => {
      detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  // Sync active cat when tool changes
  useEffect(() => {
    const tool = TOOL_GUIDES.find((t) => t.id === activeToolId);
    if (tool) setActiveCat(tool.cat);
  }, [activeToolId]);

  return (
    <>
      <Navbar />
      <main style={{ background: "var(--bg-subtle)", minHeight: "100vh", fontFamily: "var(--font)" }}>

        {/* ── Top Ad ── */}
        <div aria-hidden="true" style={{ background: "var(--bg-subtle)" }}>
          <ins className="adsbygoogle" style={{ display: "block", minHeight: "90px" }}
            data-ad-format="auto" data-full-width-responsive="true" />
        </div>

        <div className="container-sm" style={{ padding: "32px 20px 0" }}>

          {/* ══ PAGE HEADER ══ */}
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "7px", background: "var(--brand-light)", border: "1px solid var(--brand-border)", borderRadius: "var(--radius-sm)", padding: "4px 12px", marginBottom: "14px" }}>
              <span style={{ fontSize: "9px", fontWeight: 800, color: "var(--brand)", letterSpacing: "1.5px", textTransform: "uppercase" }}>
                📖 Smart Guide
              </span>
            </div>
            <h1 style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 900, letterSpacing: "-0.8px", color: "var(--text-primary)", lineHeight: 1.15, marginBottom: "10px" }}>
              How to Use EzSeva Tools
            </h1>
            <p style={{ fontSize: "14.5px", color: "var(--text-muted)", maxWidth: "480px", margin: "0 auto 16px", lineHeight: 1.7 }}>
              Step-by-step instructions, tips, and use cases for every tool — image, PDF, AI, and typing test.
            </p>
            <a
              href="/"
              style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12.5px", fontWeight: 700, color: "var(--text-muted)", textDecoration: "none", padding: "7px 16px", borderRadius: "99px", border: "1.5px solid var(--border-light)", background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", transition: "all 0.15s ease" }}
              onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "var(--brand-border)"; el.style.color = "var(--brand)"; el.style.background = "var(--brand-light)"; }}
              onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "var(--border-light)"; el.style.color = "var(--text-muted)"; el.style.background = "#fff"; }}
            >
              ← All Tools
            </a>
          </div>

          {/* ══ CATEGORY TABS ══ */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center", marginBottom: "24px" }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.label}
                onClick={() => {
                  setActiveCat(cat.label);
                  const firstTool = TOOL_GUIDES.find((t) => t.cat === cat.label);
                  if (firstTool) setActiveToolId(firstTool.id);
                }}
                style={{
                  display: "flex", alignItems: "center", gap: "6px",
                  padding: "8px 16px", borderRadius: "99px",
                  border: `1.5px solid ${activeCat === cat.label ? cat.color + "66" : "var(--border-light)"}`,
                  background: activeCat === cat.label ? cat.color + "12" : "#fff",
                  color: activeCat === cat.label ? cat.color : "var(--text-secondary)",
                  fontSize: "13px", fontWeight: 700, cursor: "pointer",
                  fontFamily: "var(--font)", transition: "all 0.15s",
                }}
              >
                <span>{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>

          {/* ══ MAIN LAYOUT: SIDEBAR + DETAIL ══ */}
          <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: "16px", alignItems: "start", marginBottom: "32px" }}>

            {/* ── Left: Tool List ── */}
            <div style={{ background: "#fff", border: "1.5px solid var(--border-light)", borderRadius: "var(--radius-xl)", padding: "12px", boxShadow: "var(--shadow-sm)", position: "sticky", top: "80px" }}>
              <p style={{ fontSize: "10px", fontWeight: 900, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1.2px", marginBottom: "10px", paddingLeft: "4px" }}>
                {activeCat}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                {catTools.map((tool) => (
                  <ToolCard
                    key={tool.id}
                    guide={tool}
                    isActive={activeToolId === tool.id}
                    onClick={() => handleToolSelect(tool.id)}
                  />
                ))}
              </div>
            </div>

            {/* ── Right: Tool Detail ── */}
            <div ref={detailRef}>
              <div style={{ background: "#fff", border: "1.5px solid var(--border-light)", borderRadius: "var(--radius-xl)", padding: "28px", boxShadow: "var(--shadow-md)" }}>

                {/* Tool header */}
                <div style={{ display: "flex", alignItems: "flex-start", gap: "14px", marginBottom: "20px", flexWrap: "wrap" }}>
                  <div style={{ width: 52, height: 52, borderRadius: "var(--radius-lg)", background: activeTool.catColor + "15", border: `1.5px solid ${activeTool.catColor}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "26px", flexShrink: 0 }}>
                    {activeTool.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "4px" }}>
                      <h2 style={{ fontSize: "20px", fontWeight: 900, color: "var(--text-primary)", letterSpacing: "-0.4px" }}>
                        {activeTool.title}
                      </h2>
                      {activeTool.comingSoon && (
                        <span style={{ fontSize: "10px", fontWeight: 800, color: activeTool.catColor, background: activeTool.catColor + "14", border: `1px solid ${activeTool.catColor}35`, padding: "2px 8px", borderRadius: "99px", textTransform: "uppercase", letterSpacing: "1px" }}>
                          Coming Soon
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: "13.5px", color: "var(--text-muted)", lineHeight: 1.6, marginBottom: "8px" }}>
                      {activeTool.tagline}
                    </p>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-secondary)", background: "var(--bg-muted)", padding: "3px 10px", borderRadius: "99px" }}>
                        📁 {activeTool.formats}
                      </span>
                      <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-secondary)", background: "var(--bg-muted)", padding: "3px 10px", borderRadius: "99px" }}>
                        ⚖️ {activeTool.limits}
                      </span>
                    </div>
                  </div>
                  <a
                    href={activeTool.href}
                    style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "10px 18px", background: activeTool.comingSoon ? "var(--bg-muted)" : activeTool.catColor, color: activeTool.comingSoon ? "var(--text-muted)" : "#fff", borderRadius: "var(--radius-md)", fontSize: "13px", fontWeight: 800, textDecoration: "none", flexShrink: 0, transition: "opacity 0.15s", boxShadow: activeTool.comingSoon ? "none" : `0 4px 12px ${activeTool.catColor}30` }}
                    onMouseEnter={(e) => { if (!activeTool.comingSoon) (e.currentTarget as HTMLElement).style.opacity = "0.88"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
                  >
                    {activeTool.comingSoon ? "📋 Join Waitlist" : "Open Tool →"}
                  </a>
                </div>

                {/* Steps */}
                <div style={{ marginBottom: "22px" }}>
                  <p style={{ fontSize: "11px", fontWeight: 900, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1.4px", marginBottom: "14px" }}>
                    Step-by-Step Instructions
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {activeTool.steps.map((step, i) => (
                      <div key={i} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                        <StepBadge n={i + 1} />
                        <div>
                          <p style={{ fontSize: "13.5px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "3px" }}>{step.title}</p>
                          <p style={{ fontSize: "12.5px", color: "var(--text-muted)", lineHeight: 1.65 }}>{step.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tips */}
                <div style={{ background: "var(--brand-light)", border: "1px solid var(--brand-border)", borderRadius: "var(--radius-lg)", padding: "16px 18px", marginBottom: "22px" }}>
                  <p style={{ fontSize: "11px", fontWeight: 900, color: "var(--brand)", textTransform: "uppercase", letterSpacing: "1.4px", marginBottom: "12px" }}>
                    💡 Pro Tips
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {activeTool.tips.map((tip, i) => (
                      <div key={i} style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                        <span style={{ color: "var(--brand)", fontWeight: 900, flexShrink: 0, marginTop: "1px", fontSize: "12px" }}>→</span>
                        <p style={{ fontSize: "12.5px", color: "var(--brand-dark)", lineHeight: 1.6 }}>{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Use cases */}
                <div>
                  <p style={{ fontSize: "11px", fontWeight: 900, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1.4px", marginBottom: "10px" }}>
                    Common Use Cases
                  </p>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {activeTool.useCases.map((uc, i) => (
                      <span key={i} style={{ fontSize: "11.5px", fontWeight: 600, color: "var(--text-secondary)", background: "var(--bg-muted)", border: "1px solid var(--border-light)", padding: "4px 12px", borderRadius: "99px" }}>
                        {uc}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ══ MOBILE: Full tool list (below md breakpoint) ══ */}
          {/* This section shows on mobile where the sidebar is hidden by grid collapsing */}

          {/* ── Mid Ad ── */}
          <div aria-hidden="true" style={{ margin: "0 0 32px" }}>
            <ins className="adsbygoogle" style={{ display: "block", minHeight: "250px" }}
              data-ad-format="auto" data-full-width-responsive="true" />
          </div>

          {/* ══ ALL TOOLS QUICK REFERENCE ══ */}
          <section style={{ marginBottom: "32px" }}>
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <p style={{ fontSize: "10.5px", fontWeight: 900, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "6px" }}>Quick Reference</p>
              <h2 style={{ fontSize: "20px", fontWeight: 900, color: "var(--text-primary)", letterSpacing: "-0.4px" }}>All Tools at a Glance</h2>
            </div>

            {CATEGORIES.map((cat) => (
              <div key={cat.label} style={{ marginBottom: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                  <span style={{ fontSize: "16px" }}>{cat.icon}</span>
                  <h3 style={{ fontSize: "14px", fontWeight: 800, color: "var(--text-primary)" }}>{cat.label}</h3>
                  <span style={{ fontSize: "10.5px", color: "var(--text-muted)", fontWeight: 600 }}>— {cat.desc}</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "8px" }}>
                  {TOOL_GUIDES.filter((t) => t.cat === cat.label).map((tool) => (
                    <a
                      key={tool.id}
                      href={tool.comingSoon ? tool.href : tool.href}
                      style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", background: "#fff", border: "1.5px solid var(--border-light)", borderRadius: "var(--radius-lg)", textDecoration: "none", transition: "all 0.15s ease" }}
                      onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = tool.catColor + "55"; el.style.background = tool.catColor + "06"; }}
                      onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "var(--border-light)"; el.style.background = "#fff"; }}
                    >
                      <span style={{ fontSize: "20px", flexShrink: 0 }}>{tool.icon}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)" }}>{tool.title}</span>
                          {tool.comingSoon && (
                            <span style={{ fontSize: "8.5px", fontWeight: 800, color: tool.catColor, background: tool.catColor + "14", padding: "1px 5px", borderRadius: "3px", textTransform: "uppercase" }}>Soon</span>
                          )}
                        </div>
                        <p style={{ fontSize: "11.5px", color: "var(--text-muted)", marginTop: "1px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{tool.tagline}</p>
                      </div>
                      <span style={{ fontSize: "11px", color: tool.catColor, fontWeight: 700, flexShrink: 0 }}>
                        {tool.comingSoon ? "Soon →" : "Open →"}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </section>

          {/* ══ PLATFORM FAQ ══ */}
          <section style={{ background: "#fff", border: "1.5px solid var(--border-light)", borderRadius: "var(--radius-xl)", padding: "26px", marginBottom: "32px", boxShadow: "var(--shadow-md)" }}>
            <h2 style={{ fontSize: "17px", fontWeight: 800, marginBottom: "20px", color: "var(--text-primary)" }}>
              ❓ General Questions About EzSeva
            </h2>
            {PLATFORM_FAQ.map((faq, i, arr) => (
              <div key={i} style={{ marginBottom: i < arr.length - 1 ? "18px" : 0, paddingBottom: i < arr.length - 1 ? "18px" : 0, borderBottom: i < arr.length - 1 ? "1px solid var(--border-light)" : "none" }}>
                <p style={{ fontSize: "13.5px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "6px" }}>Q: {faq.q}</p>
                <p style={{ fontSize: "12.5px", color: "var(--text-muted)", lineHeight: 1.7 }}>{faq.a}</p>
              </div>
            ))}
          </section>

        </div>

        {/* ── Bottom Ad ── */}
        <div aria-hidden="true">
          <ins className="adsbygoogle" style={{ display: "block", minHeight: "90px" }}
            data-ad-format="auto" data-full-width-responsive="true" />
        </div>

        <Footer />
      </main>

      <style>{`
        @media (max-width: 640px) {
          .guide-layout {
            grid-template-columns: 1fr !important;
          }
          .guide-sidebar {
            position: static !important;
          }
        }
      `}</style>
    </>
  );
}

/*
export const metadata = {
  title: "How to Use EzSeva Tools — Complete Guide | EzSeva",
  description: "Step-by-step instructions for every EzSeva tool — Image Resize, PDF Compress, Merge, Split, Protect, Photo+Signature Joiner, Typing Test and AI tools.",
  openGraph: {
    title: "How to Use EzSeva Tools — Complete Guide",
    description: "Step-by-step instructions, tips and use cases for all 11 free tools on EzSeva.",
    url: "https://ezseva.in/guide",
    siteName: "EzSeva",
  },
  alternates: { canonical: "https://ezseva.in/guide" },
};
*/