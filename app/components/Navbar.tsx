"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import { TOOLS, NAV_ITEMS, CATEGORY_META, TOOL_COUNT, type Category } from "../data/tools";
import { SITE } from "../data/site-content";
import { useLocale } from "../context/LocaleContext";

function useHoverDelay(openDelay = 120, closeDelay = 220) {
  const openTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelOpen = useCallback(() => {
    if (openTimerRef.current) clearTimeout(openTimerRef.current);
  }, []);

  const cancelClose = useCallback(() => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
  }, []);

  const scheduleOpen = useCallback(
    (cb: () => void) => {
      cancelOpen();
      openTimerRef.current = setTimeout(cb, openDelay);
    },
    [openDelay, cancelOpen]
  );

  const scheduleClose = useCallback(
    (cb: () => void) => {
      cancelClose();
      closeTimerRef.current = setTimeout(cb, closeDelay);
    },
    [closeDelay, cancelClose]
  );

  useEffect(
    () => () => {
      if (openTimerRef.current) clearTimeout(openTimerRef.current);
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    },
    []
  );

  return { scheduleOpen, scheduleClose, cancelOpen, cancelClose };
}

function ChevronDown({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      className={className}
      style={style}
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <polyline points="2 3.5 5 6.5 8 3.5" />
    </svg>
  );
}

function MegaDropdown({
  catConfig,
  isOpen,
}: {
  catConfig: { label: string; cat: Category; icon: string };
  isOpen: boolean;
}) {
  const tools = TOOLS.filter((t) => t.cat === catConfig.cat);
  const meta = CATEGORY_META[catConfig.cat as keyof typeof CATEGORY_META];

  return (
    <div className={`ez-nav-dropdown-bridge${isOpen ? "" : ""}`}>
      <div
        className="ez-nav-dropdown-panel"
        role="menu"
        aria-label={`${catConfig.label} tools`}
        style={
          {
            "--tool-accent": meta?.accent,
          } as React.CSSProperties
        }
      >
        <div className="ez-nav-dropdown-head">
          <div
            className="ez-nav-dropdown-cat-icon"
            style={{ background: meta?.accentSoft, color: meta?.accent }}
          >
            {catConfig.icon}
          </div>
          <span
            className="ez-nav-dropdown-label"
            style={{ color: meta?.accent }}
          >
            {catConfig.label}
          </span>
          <span className="ez-nav-dropdown-count">
            {tools.length} tools
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {tools.map((tool) => (
            <a
              key={tool.href}
              href={tool.href}
              role="menuitem"
              className="ez-nav-dropdown-tool"
              style={
                {
                  "--tool-accent": meta?.accent,
                  "--tool-icon-bg": meta?.accentSoft,
                } as React.CSSProperties
              }
            >
              <div className="ez-nav-tool-icon">{tool.icon}</div>
              <div className="ez-nav-tool-body">
                <div className="ez-nav-tool-title">
                  {tool.title}
                  {tool.hot && (
                    <span className="ez-nav-badge-hot">HOT</span>
                  )}
                </div>
                <span className="ez-nav-tool-desc">{tool.desc}</span>
              </div>
              <span className="ez-nav-tool-uses">{tool.uses}</span>
            </a>
          ))}
        </div>

        <div className="ez-nav-dropdown-footer">
          <a href={`/#tools?cat=${catConfig.cat}`}>
            View all {catConfig.label} →
          </a>
        </div>
      </div>
    </div>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const { lang, setLang, t, locales } = useLocale();
  const [openDrop, setOpenDrop] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExp, setMobileExp] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const { scheduleOpen, scheduleClose, cancelOpen, cancelClose } =
    useHoverDelay();

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDrop(null);
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const handleMouseEnter = (label: string) => {
    cancelClose();
    scheduleOpen(() => setOpenDrop(label));
  };

  const handleMouseLeave = () => {
    cancelOpen();
    scheduleClose(() => setOpenDrop(null));
  };

  const toggleDrop = (label: string) => {
    cancelOpen();
    cancelClose();
    setOpenDrop((prev) => (prev === label ? null : label));
  };

  const closeAll = () => {
    cancelOpen();
    cancelClose();
    setOpenDrop(null);
    setMobileOpen(false);
    setMobileExp(null);
  };

  const isActive = (href: string) => pathname === href;

  return (
    <header
      ref={navRef}
      className={`ez-nav-header${scrolled ? " is-scrolled" : ""}`}
    >
      {/* Utility strip — trust + quick links */}
      <div className="ez-nav-utility hide-mobile">
        <div className="container ez-nav-utility-inner">
          <span className="ez-nav-trust">
            <span className="ez-nav-trust-dot" aria-hidden />
            {t("nav.trust", { count: TOOL_COUNT })}
          </span>
          <div className="ez-nav-utility-links">
            <a href="/about">{t("nav.about")}</a>
            <a href="/contact">{t("nav.contact")}</a>
            <a
              href="https://care.ezseva.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("nav.care")}
            </a>
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className="ez-nav-main">
        <div className="container ez-nav-inner">
          <a
            href="/"
            onClick={closeAll}
            aria-label="EzSeva — Home"
            style={{ textDecoration: "none", flexShrink: 0 }}
          >
            <Logo size="nav" />
          </a>

          <nav
            aria-label="Primary navigation"
            className="ez-nav-center hide-mobile"
          >
            <div className="ez-nav-pills">
              {NAV_ITEMS.map((item) => {
                const label =
                  item.cat === "Image"
                    ? t("nav.imageTools")
                    : item.cat === "PDF"
                    ? t("nav.pdfTools")
                    : item.label;
                return (
                <div
                  key={item.label}
                  className={`ez-nav-dropdown-wrap${openDrop === item.label ? " is-open" : ""}`}
                  onMouseEnter={() => handleMouseEnter(item.label)}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    type="button"
                    className={`ez-nav-link${openDrop === item.label ? " is-open" : ""}`}
                    aria-haspopup="true"
                    aria-expanded={openDrop === item.label}
                    onClick={() => toggleDrop(item.label)}
                  >
                    <span className="ez-nav-link-icon">{item.icon}</span>
                    {label}
                    <ChevronDown className="ez-nav-link-chevron" />
                  </button>
                  <MegaDropdown
                    catConfig={item}
                    isOpen={openDrop === item.label}
                  />
                </div>
              );})}

              <a
                href="/typing-test"
                className={`ez-nav-link${isActive("/typing-test") ? " is-active" : ""}`}
              >
                <span className="ez-nav-link-icon">⌨️</span>
                {t("nav.typingTest")}
              </a>

              <a
                href="/guide"
                className={`ez-nav-link${isActive("/guide") ? " is-active" : ""}`}
              >
                {t("nav.guide")}
              </a>
            </div>
          </nav>

          <div className="ez-nav-actions">
            <div
              className="ez-nav-lang hide-mobile"
              role="group"
              aria-label={t("lang.toggle")}
              style={{ display: "flex", gap: 4, marginRight: 4 }}
            >
              {locales.map((loc) => (
                <button
                  key={loc.id}
                  type="button"
                  onClick={() => setLang(loc.id)}
                  aria-pressed={lang === loc.id}
                  style={{
                    padding: "5px 10px",
                    borderRadius: "var(--radius-sm)",
                    border: `1.5px solid ${lang === loc.id ? "var(--brand)" : "var(--border-light)"}`,
                    background: lang === loc.id ? "var(--brand-light)" : "#fff",
                    fontSize: "11px",
                    fontWeight: 800,
                    cursor: "pointer",
                    fontFamily: "var(--font)",
                    color: lang === loc.id ? "var(--brand)" : "var(--text-muted)",
                  }}
                >
                  {loc.short}
                </button>
              ))}
            </div>

            <a
              href="/#tools"
              className="ez-nav-search hide-mobile"
              aria-label={t("nav.browseTools")}
              title={t("nav.browseTools")}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                aria-hidden
              >
                <circle cx="6.5" cy="6.5" r="5" />
                <line x1="10.5" y1="10.5" x2="14" y2="14" />
              </svg>
            </a>

            <a href="/photo-joiner" className="ez-nav-cta hide-mobile">
              Start free →
            </a>

            <button
              type="button"
              onClick={() => setMobileOpen((p) => !p)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              className="ez-nav-hamburger show-mobile"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                aria-hidden
              >
                {mobileOpen ? (
                  <>
                    <line x1="3" y1="3" x2="15" y2="15" />
                    <line x1="15" y1="3" x2="3" y2="15" />
                  </>
                ) : (
                  <>
                    <line x1="2" y1="5" x2="16" y2="5" />
                    <line x1="2" y1="9" x2="16" y2="9" />
                    <line x1="2" y1="13" x2="16" y2="13" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          id="mobile-menu"
          role="navigation"
          aria-label="Mobile navigation"
          className="ez-nav-mobile"
        >
          <div className="ez-nav-mobile-trust">
            <span className="ez-nav-trust-dot" aria-hidden />
            {t("nav.trust", { count: TOOL_COUNT })}
          </div>
          <div style={{ display: "flex", gap: 8, padding: "8px 16px 12px" }}>
            {locales.map((loc) => (
              <button
                key={loc.id}
                type="button"
                onClick={() => setLang(loc.id)}
                aria-pressed={lang === loc.id}
                style={{
                  flex: 1,
                  padding: "8px",
                  borderRadius: "var(--radius-sm)",
                  border: `1.5px solid ${lang === loc.id ? "var(--brand)" : "var(--border-light)"}`,
                  background: lang === loc.id ? "var(--brand-light)" : "#fff",
                  fontWeight: 800,
                  fontSize: 12,
                }}
              >
                {loc.label}
              </button>
            ))}
          </div>

          {NAV_ITEMS.map((item) => {
            const isExpanded = mobileExp === item.label;
            const tools = TOOLS.filter((t) => t.cat === item.cat);
            return (
              <div key={item.label}>
                <button
                  type="button"
                  onClick={() =>
                    setMobileExp(isExpanded ? null : item.label)
                  }
                  aria-expanded={isExpanded}
                  className={`ez-nav-mobile-item${isExpanded ? " is-expanded" : ""}`}
                >
                  <span>{item.icon}</span>
                  <span style={{ flex: 1 }}>{item.label}</span>
                  <ChevronDown
                    className="ez-nav-link-chevron"
                    style={{
                      transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  />
                </button>
                {isExpanded && (
                  <div className="ez-nav-mobile-sub">
                    {tools.map((tool) => (
                      <a
                        key={tool.href}
                        href={tool.href}
                        onClick={closeAll}
                        className="ez-nav-mobile-tool"
                      >
                        <span style={{ fontSize: 18 }}>{tool.icon}</span>
                        <div>
                          <div
                            style={{
                              fontSize: 13,
                              fontWeight: 700,
                              color: "var(--text-primary)",
                            }}
                          >
                            {tool.title}
                          </div>
                          <div
                            style={{
                              fontSize: 11,
                              color: "var(--text-muted)",
                            }}
                          >
                            {tool.desc}
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          <a
            href="/typing-test"
            onClick={closeAll}
            className={`ez-nav-mobile-item${isActive("/typing-test") ? " is-expanded" : ""}`}
          >
            ⌨️ Typing Test
          </a>
          <a
            href="/guide"
            onClick={closeAll}
            className={`ez-nav-mobile-item${isActive("/guide") ? " is-expanded" : ""}`}
          >
            📖 How to Use
          </a>

          <a href="/photo-joiner" onClick={closeAll} className="ez-nav-mobile-cta">
            Start free →
          </a>
        </div>
      )}
    </header>
  );
}
