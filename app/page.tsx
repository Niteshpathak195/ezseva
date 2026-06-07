"use client";

import { useState, useCallback } from "react";
import Navbar from "./components/Navbar";
import SiteClose from "./components/marketing/SiteClose";
import HomeFooter from "./components/marketing/HomeFooter";
import HeroMockup from "./components/marketing/HeroMockup";
import CategoryCards from "./components/marketing/CategoryCards";
import ExamMarquee from "./components/marketing/ExamMarquee";
import HowItWorks from "./components/marketing/HowItWorks";
import WhyEzSeva from "./components/marketing/WhyEzSeva";
import ToolsDirectory from "./components/marketing/ToolsDirectory";
import { STATS, TOOL_COUNT, type Category } from "./data/tools";
import { MARCOM, TRUST_POINTS } from "./data/site-content";

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
    document.getElementById("tools")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

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
              {MARCOM.heroEyebrow}
            </div>

            <h1 className="ez-h1-v2">
              {MARCOM.heroH1Line1}
              <br />
              <span className="ez-h1-gradient">{MARCOM.heroH1Line2}</span>
            </h1>

            <p className="ez-sub">{MARCOM.heroSub}</p>

            <div className="ez-search-wrap">
              <svg className="ez-search-icon" width="16" height="16" viewBox="0 0 16 16"
                fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <circle cx="6.5" cy="6.5" r="5" />
                <line x1="10.5" y1="10.5" x2="14" y2="14" />
              </svg>
              <input
                type="search"
                className="ez-search-input"
                placeholder={MARCOM.heroSearchPlaceholder}
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
            <p>{TOOL_COUNT} free tools — image, PDF, and typing. One click to start.</p>
          </div>
          <CategoryCards />
        </div>
      </section>

      <ExamMarquee />

      <ToolsDirectory
        search={search}
        activeFilter={activeFilter}
        onSearchChange={(v) => {
          setSearch(v);
          if (v) {
            document.getElementById("tools")?.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }}
        onFilterChange={handleFilterChange}
        onClear={handleClearSearch}
      />

      {/* ── Why EzSeva ── */}
      <section aria-label="Why EzSeva" style={{ padding: "48px 24px", background: "var(--bg-base)" }}>
        <div className="container">
          <div className="ez-section-head">
            <h2>Why millions choose EzSeva</h2>
            <p>Not another generic tool site — built for Indian students and job seekers.</p>
          </div>
          <WhyEzSeva />
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
              <h2 className="ez-privacy-title">{MARCOM.privacyTitle}</h2>
              <p className="ez-privacy-desc">{MARCOM.privacyBody}</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {TRUST_POINTS.map((item) => (
                <div key={item} className="ez-trust-row">
                  <div className="ez-trust-check" aria-hidden="true">✓</div>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <SiteClose />
      <HomeFooter />
    </main>
  );
}
