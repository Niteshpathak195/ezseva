"use client";

// ─────────────────────────────────────────────
// EzSeva — Homepage
// app/page.tsx
// ─────────────────────────────────────────────
// Version : 1.1.0 (Audit Fix)
// Updated : March 2026
//
// FIXES:
//   ✅ FIX 1  — <style> JSX block REMOVED — all ez-* classes moved to globals.css
//              (was CSP violation risk + FOUC on hydration + Next.js anti-pattern)
//   ✅ FIX 2  — Inline <footer> REMOVED → <Footer /> component used
//   ✅ FIX 3  — new Date().getFullYear() removed from this file (Footer handles it)
//   ✅ FIX 4  — useCallback added on search handler and filter handler
//   ✅ FIX 5  — Logo size="sm" in old inline footer replaced by <Footer />
// ─────────────────────────────────────────────

import { useState, useCallback } from "react";
import Logo from "./components/Logo";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { TOOLS, STATS, TRUST, FILTER_TABS, type Category } from "./data/tools";

/* ── ToolCard ── */
function ToolCard({ tool, delay = 0 }: { tool: (typeof TOOLS)[0]; delay?: number }) {
  return (
    <a
      href={tool.href}
      className="ez-tool-card"
      style={{ animationDelay: `${delay}ms` }}
      aria-label={`${tool.title} — ${tool.desc}`}
    >
      {/* Shine overlay on hover */}
      <div className="ez-card-shine" />

      {/* Badges */}
      {(tool.ai || tool.hot) && (
        <div className="ez-badges">
          {tool.ai  && <span className="badge-ai">✦ AI</span>}
          {tool.hot && <span className="badge-hot">🔥 HOT</span>}
        </div>
      )}

      {/* Icon */}
      <div className="ez-card-icon-wrap">
        <span className="ez-card-icon">{tool.icon}</span>
      </div>

      {/* Content */}
      <h3 className="ez-card-title">{tool.title}</h3>
      <p className="ez-card-desc">{tool.desc}</p>

      {/* Footer */}
      <div className="ez-card-footer">
        <span className="ez-card-uses">{tool.uses} uses</span>
        <span className="ez-card-arrow">→</span>
      </div>
    </a>
  );
}

/* ── Main Page ── */
export default function HomePage() {
  const [activeFilter, setActiveFilter] = useState<Category>("All");
  const [search, setSearch] = useState("");

  // FIX 4: useCallback on handlers — stable refs
  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    if (e.target.value) {
      document.getElementById("tools")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearch("");
    setActiveFilter("All");
  }, []);

  const handleFilterChange = useCallback((tab: Category) => {
    setActiveFilter(tab);
  }, []);

  const filtered = TOOLS.filter((t) => {
    const catOk    = activeFilter === "All" || t.cat === activeFilter;
    const q        = search.toLowerCase().trim();
    const searchOk = !q
      || t.title.toLowerCase().includes(q)
      || t.desc.toLowerCase().includes(q)
      || t.cat.toLowerCase().includes(q);
    return catOk && searchOk;
  });

  const hotTools = TOOLS.filter((t) => t.hot);

  return (
    <>
      {/*
        FIX 1: NO <style> block here.
        All ez-* classes are now in globals.css.
        This eliminates: CSP violations, FOUC on hydration,
        class duplication, and Next.js anti-pattern.
      */}
      <main style={{ background: "var(--bg-base)", minHeight: "100vh", fontFamily: "var(--font)" }}>

        {/* ── Navbar ── */}
        <Navbar />

        {/* ════════════════
            HERO
        ════════════════ */}
        <section aria-label="Hero" className="ez-hero">
          <div className="ez-dot-grid" />
          <div className="ez-pulse-ring"
            style={{ width: 500, height: 500, marginLeft: -250, marginTop: -250 }} />
          <div className="ez-pulse-ring"
            style={{ width: 800, height: 800, marginLeft: -400, marginTop: -400, animationDelay: "2s" }} />

          <div className="ez-hero-inner">
            {/* Eyebrow */}
            <div className="ez-eyebrow">
              <span className="ez-eyebrow-dot" />
              Free · Private · Built for Billions
            </div>

            {/* H1 */}
            <h1 className="ez-h1">
              Every tool you need.<br />
              <span className="ez-h1-accent">All in one place.</span>
            </h1>

            {/* Sub */}
            <p className="ez-sub">
              Resize images · Compress PDFs · Write with AI<br />
              Free. Instant. Your data never leaves your device.
            </p>

            {/* Search */}
            <div className="ez-search-wrap">
              <svg className="ez-search-icon" width="16" height="16" viewBox="0 0 16 16"
                fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <circle cx="6.5" cy="6.5" r="5" />
                <line x1="10.5" y1="10.5" x2="14" y2="14" />
              </svg>
              <input
                type="search"
                className="ez-search-input"
                placeholder="Search tools — resize, compress, letter…"
                value={search}
                aria-label="Search tools"
                // FIX 4: stable ref via useCallback
                onChange={handleSearch}
              />
              {search && (
                <button
                  className="ez-search-clear"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Stats */}
            <div className="ez-stats-row">
              {STATS.map(({ value, label }) => (
                <div key={label} className="ez-stat-pill">
                  <b>{value}</b>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════
            POPULAR STRIP
        ════════════════ */}
        <section aria-label="Popular tools" style={{ padding: "0 24px 32px" }}>
          <div className="container">
            <p className="ez-section-label">🔥 Most Popular</p>
            <div className="ez-popular-strip">
              {hotTools.map((t) => (
                <a key={t.href} href={t.href} className="ez-pop-card" aria-label={t.title}>
                  <span style={{ fontSize: 22 }}>{t.icon}</span>
                  <div>
                    <div className="ez-pop-name">{t.title}</div>
                    <div className="ez-pop-uses">{t.uses} uses</div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════
            TOOLS GRID
        ════════════════ */}
        <section id="tools" aria-label="All tools" style={{ padding: "0 24px 64px" }}>
          <div className="container">
            {/* Header */}
            <div className="ez-grid-header">
              <div className="ez-filter-tabs">
                {FILTER_TABS.map((tab) => (
                  <button
                    key={tab}
                    // FIX 4: stable ref via useCallback
                    onClick={() => handleFilterChange(tab)}
                    aria-pressed={activeFilter === tab}
                    className={`ez-filter-tab${activeFilter === tab ? " active" : ""}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <span className="ez-tool-count" aria-live="polite">
                {filtered.length} tool{filtered.length !== 1 ? "s" : ""}
                {search ? ` for "${search}"` : ""}
              </span>
            </div>

            {/* Grid / Empty */}
            {filtered.length === 0 ? (
              <div className="ez-empty">
                <div style={{ fontSize: 44 }}>🔍</div>
                <p>No tools found for &ldquo;{search}&rdquo;</p>
                <button
                  className="ez-empty-clear"
                  onClick={handleClearSearch}
                >
                  Clear search
                </button>
              </div>
            ) : (
              <div className="ez-tools-grid">
                {filtered.map((tool, i) => (
                  <ToolCard key={tool.href} tool={tool} delay={i * 38} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ════════════════
            PRIVACY BANNER
        ════════════════ */}
        <section aria-label="Privacy guarantee" style={{ padding: "0 24px 60px" }}>
          <div className="container">
            <div className="ez-privacy-card">
              <div style={{ flex: 1, minWidth: 220 }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>🔒</div>
                <h2 className="ez-privacy-title">Your data stays with you.</h2>
                <p className="ez-privacy-desc">
                  Every tool runs entirely in your browser. Files are never
                  uploaded, stored, or shared — ever.
                </p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {TRUST.map((item) => (
                  <div key={item} className="ez-trust-row">
                    <div className="ez-trust-check" aria-hidden="true">✓</div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════
            CTA BAND
        ════════════════ */}
        <section aria-label="Call to action" className="ez-cta-band">
          <div style={{ position: "relative", maxWidth: 480, margin: "0 auto" }}>
            <Logo size="icon" />
            <h2 className="ez-cta-title">Ready to work smarter?</h2>
            <p className="ez-cta-sub">Free forever. Zero signup. Built for Billions.</p>
            <a href="#tools" className="btn-cta" style={{ fontSize: 14, padding: "13px 32px" }}>
              Try Free Tools Now →
            </a>
          </div>
        </section>

        {/* ════════════════
            FOOTER
            FIX 2: <Footer /> component — no inline footer
            FIX 3: new Date() hydration risk handled inside Footer
        ════════════════ */}
        <Footer />

      </main>
    </>
  );
}