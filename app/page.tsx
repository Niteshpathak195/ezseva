"use client";

import { useState, useCallback } from "react";
import Logo from "./components/Logo";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HeroMockup from "./components/marketing/HeroMockup";
import CategoryCards from "./components/marketing/CategoryCards";
import ExamMarquee from "./components/marketing/ExamMarquee";
import HowItWorks from "./components/marketing/HowItWorks";
import { TOOLS, STATS, TRUST, FILTER_TABS, type Category } from "./data/tools";

function ToolCard({ tool, delay = 0 }: { tool: (typeof TOOLS)[0]; delay?: number }) {
  return (
    <a
      href={tool.href}
      className="ez-tool-card"
      style={{ animationDelay: `${delay}ms` }}
      aria-label={`${tool.title} — ${tool.desc}`}
    >
      <div className="ez-card-shine" />
      {tool.hot && (
        <div className="ez-badges">
          <span className="badge-hot">🔥 HOT</span>
        </div>
      )}
      <div className="ez-card-icon-wrap">
        <span className="ez-card-icon">{tool.icon}</span>
      </div>
      <h3 className="ez-card-title">{tool.title}</h3>
      <p className="ez-card-desc">{tool.desc}</p>
      <div className="ez-card-footer">
        <span className="ez-card-uses">{tool.uses} uses</span>
        <span className="ez-card-arrow">→</span>
      </div>
    </a>
  );
}

export default function HomePage() {
  const [activeFilter, setActiveFilter] = useState<Category>("All");
  const [search, setSearch] = useState("");

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
    const catOk = activeFilter === "All" || t.cat === activeFilter;
    const q = search.toLowerCase().trim();
    const searchOk =
      !q ||
      t.title.toLowerCase().includes(q) ||
      t.desc.toLowerCase().includes(q) ||
      t.cat.toLowerCase().includes(q);
    return catOk && searchOk;
  });

  const hotTools = TOOLS.filter((t) => t.hot);

  return (
    <main style={{ background: "var(--bg-base)", minHeight: "100vh" }}>
      <Navbar />

      {/* ── HERO v2 ── */}
      <section aria-label="Hero" className="ez-hero-v2">
        <div className="ez-dot-grid" />
        <div className="ez-hero-grid-v2">
          <div className="ez-hero-copy">
            <div className="ez-eyebrow">
              <span className="ez-eyebrow-dot" />
              Free · Private · Built for Billions
            </div>

            <h1 className="ez-h1-v2">
              Every exam form.
              <br />
              <span className="ez-h1-gradient">Every PDF. One place.</span>
            </h1>

            <p className="ez-sub">
              Resize photos for SSC & Railway · Compress PDFs · Practice typing —
              free, instant, and 100% in your browser.
            </p>

            <div className="ez-search-wrap">
              <svg className="ez-search-icon" width="16" height="16" viewBox="0 0 16 16"
                fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <circle cx="6.5" cy="6.5" r="5" />
                <line x1="10.5" y1="10.5" x2="14" y2="14" />
              </svg>
              <input
                type="search"
                className="ez-search-input"
                placeholder="Search tools — resize, compress, typing…"
                value={search}
                aria-label="Search tools"
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

            <div className="ez-stats-row">
              {STATS.map(({ value, label }) => (
                <div key={label} className="ez-stat-pill">
                  <b>{value}</b>
                  <span>{label}</span>
                </div>
              ))}
            </div>

            <div className="ez-hero-quick-cta">
              <a href="/photo-joiner" className="ez-btn-gradient">
                🪪 Photo + Signature
              </a>
              <a href="/image-resize" className="ez-btn-ghost">
                Start free →
              </a>
            </div>
          </div>

          <HeroMockup />
        </div>
      </section>

      {/* ── Categories ── */}
      <section aria-label="Tool categories" style={{ padding: "48px 24px" }}>
        <div className="container">
          <div className="ez-section-head">
            <h2>Pick your category</h2>
            <p>9 free tools — image, PDF, and typing. One click to start.</p>
          </div>
          <CategoryCards />
        </div>
      </section>

      <ExamMarquee />

      {/* ── Popular ── */}
      <section aria-label="Popular tools" style={{ padding: "40px 24px 32px" }}>
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

      {/* ── All tools ── */}
      <section id="tools" aria-label="All tools" style={{ padding: "0 24px 64px" }}>
        <div className="container">
          <div className="ez-grid-header">
            <div className="ez-filter-tabs">
              {FILTER_TABS.map((tab) => (
                <button
                  key={tab}
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

          {filtered.length === 0 ? (
            <div className="ez-empty">
              <div style={{ fontSize: 44 }}>🔍</div>
              <p>No tools found for &ldquo;{search}&rdquo;</p>
              <button className="ez-empty-clear" onClick={handleClearSearch}>
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

      {/* ── How it works ── */}
      <section aria-label="How it works" style={{ padding: "0 24px 56px", background: "var(--bg-subtle)" }}>
        <div className="container">
          <div className="ez-section-head">
            <h2>How EzSeva works</h2>
            <p>Three steps. Zero signup. Less clicks than any other tool site.</p>
          </div>
          <HowItWorks />
        </div>
      </section>

      {/* ── Privacy ── */}
      <section aria-label="Privacy guarantee" style={{ padding: "0 24px 60px" }}>
        <div className="container">
          <div className="ez-privacy-v2">
            <div style={{ flex: 1, minWidth: 220 }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>🔒</div>
              <h2 className="ez-privacy-title">Your data stays with you.</h2>
              <p className="ez-privacy-desc">
                Every tool runs entirely in your browser. Files are never uploaded,
                stored, or shared — ever.
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

      {/* ── CTA ── */}
      <section aria-label="Call to action" className="ez-cta-band">
        <div style={{ position: "relative", maxWidth: 480, margin: "0 auto", textAlign: "center" }}>
          <Logo size="icon" />
          <h2 className="ez-cta-title">Ready to work smarter?</h2>
          <p className="ez-cta-sub">Free forever. Zero signup. Built for Billions.</p>
          <a href="#tools" className="btn-cta" style={{ fontSize: 14, padding: "13px 32px" }}>
            Try Free Tools Now →
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}
