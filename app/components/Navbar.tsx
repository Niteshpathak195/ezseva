"use client";

// ─────────────────────────────────────────────
// EzSeva — Navbar Component
// app/components/Navbar.tsx
// ─────────────────────────────────────────────

import { useState, useEffect, useRef, useCallback } from "react";
import Logo from "./Logo";
import { TOOLS, NAV_ITEMS, type Category } from "../data/tools";

/* ── useHoverDelay hook ── */
function useHoverDelay(delay = 400) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const open = useCallback((cb: () => void) => {
    timerRef.current = setTimeout(cb, delay);
  }, [delay]);
  const cancel = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);
  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);
  return { open, cancel };
}

/* ── MegaDropdown ── */
function MegaDropdown({
  catConfig,
  isOpen,
}: {
  catConfig: { label: string; cat: Category; icon: string };
  isOpen: boolean;
}) {
  const tools = TOOLS.filter((t) => t.cat === catConfig.cat);

  return (
    <div
      role="menu"
      aria-label={`${catConfig.label} tools`}
      style={{
        position: "absolute",
        top: "calc(100% + 12px)",
        left: "50%",
        transform: isOpen
          ? "translateX(-50%) translateY(0)"
          : "translateX(-50%) translateY(-10px)",
        opacity: isOpen ? 1 : 0,
        pointerEvents: isOpen ? "auto" : "none",
        transition: "opacity 0.2s ease, transform 0.2s ease",
        zIndex: 100,
        background: "#ffffff",
        border: "1.5px solid var(--border-light)",
        borderRadius: "var(--radius-xl)",
        boxShadow:
          "0 24px 64px rgba(13,148,136,.14), 0 4px 20px rgba(0,0,0,.06)",
        padding: "20px",
        minWidth: "320px",
        width: "360px",
      }}
    >
      {/* Arrow tip */}
      <div style={{
        position: "absolute",
        top: "-7px",
        left: "50%",
        transform: "translateX(-50%)",
        width: 14,
        height: 14,
        background: "#fff",
        border: "1.5px solid var(--border-light)",
        borderRight: "none",
        borderBottom: "none",
        rotate: "45deg",
      }} />

      {/* Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        paddingBottom: "12px",
        marginBottom: "8px",
        borderBottom: "1px solid var(--border-light)",
      }}>
        <div style={{
          width: 28, height: 28,
          background: "var(--brand-light)",
          border: "1px solid var(--brand-mid)",
          borderRadius: 8,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 14,
        }}>{catConfig.icon}</div>
        <span style={{
          fontSize: "11px", fontWeight: 800,
          letterSpacing: "1.2px", textTransform: "uppercase",
          color: "var(--brand)",
        }}>{catConfig.label}</span>
        <span style={{
          marginLeft: "auto", fontSize: "10px",
          color: "var(--text-muted)", fontWeight: 600,
          background: "var(--bg-muted)",
          padding: "2px 8px", borderRadius: 10,
        }}>{tools.length} tools</span>
      </div>

      {/* Tool list */}
      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
        {tools.map((tool) => (
          <a
            key={tool.href}
            href={tool.href}
            role="menuitem"
            style={{
              display: "flex", alignItems: "center", gap: "10px",
              padding: "9px 10px", borderRadius: "var(--radius-md)",
              textDecoration: "none",
              transition: "background 0.13s ease",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--brand-light)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
          >
            <div style={{
              width: 36, height: 36,
              borderRadius: 9, background: "var(--brand-light)",
              border: "1px solid var(--brand-mid)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 17, flexShrink: 0,
            }}>{tool.icon}</div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 2 }}>
                <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)" }}>
                  {tool.title}
                </span>
                {tool.ai && (
                  <span style={{
                    fontSize: "8px", fontWeight: 800,
                    background: "#FEF3C7", color: "#92400E",
                    padding: "1px 5px", borderRadius: 3,
                  }}>AI</span>
                )}
                {tool.hot && (
                  <span style={{
                    fontSize: "8px", fontWeight: 800,
                    background: "#FFF1F2", color: "#BE123C",
                    border: "1px solid #FECDD3",
                    padding: "1px 5px", borderRadius: 3,
                  }}>HOT</span>
                )}
              </div>
              <span style={{
                fontSize: "11px", color: "var(--text-muted)",
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                display: "block",
              }}>{tool.desc}</span>
            </div>

            <span style={{ fontSize: "10px", fontWeight: 700, color: "var(--brand)", flexShrink: 0 }}>
              {tool.uses}
            </span>
          </a>
        ))}
      </div>

      {/* View all */}
      <div style={{ borderTop: "1px solid var(--border-light)", marginTop: 10, paddingTop: 10 }}>
        <a
          href={`/#tools?cat=${catConfig.cat}`}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
            fontSize: "12px", fontWeight: 700, color: "var(--brand)", textDecoration: "none",
          }}
        >
          View all {catConfig.label} →
        </a>
      </div>
    </div>
  );
}

/* ── Main Navbar ── */
export default function Navbar() {
  const [openDrop, setOpenDrop]         = useState<string | null>(null);
  const [mobileOpen, setMobileOpen]     = useState(false);
  const [mobileExp, setMobileExp]       = useState<string | null>(null);
  const [scrolled, setScrolled]         = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const { open: delayOpen, cancel: cancelDelay } = useHoverDelay(380);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 4);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDrop(null); setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const handleMouseEnter = (label: string) => {
    cancelDelay(); delayOpen(() => setOpenDrop(label));
  };
  const handleMouseLeave = () => { cancelDelay(); setOpenDrop(null); };
  const closeAll = () => { setOpenDrop(null); setMobileOpen(false); setMobileExp(null); };

  return (
    <header ref={navRef} style={{
      position: "sticky", top: 0, zIndex: 999,
      background: "rgba(255,255,255,0.97)",
      backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
      borderBottom: "1px solid var(--border-light)",
      boxShadow: scrolled ? "0 2px 24px rgba(13,148,136,.09)" : "none",
      transition: "box-shadow 0.25s ease",
      fontFamily: "var(--font)",
    }}>
      {/* ── Desktop Row ── */}
      <div className="container" style={{
        height: 62, display: "flex", alignItems: "center",
        justifyContent: "space-between", gap: 8, padding: "0 20px",
      }}>
        <a href="/" onClick={closeAll} aria-label="EzSeva — Home"
          style={{ textDecoration: "none", flexShrink: 0 }}>
          <Logo size="sm" />
        </a>

        {/* Center nav */}
        <nav aria-label="Primary navigation" className="hide-mobile"
          style={{ display: "flex", alignItems: "center", gap: 2 }}>
          {NAV_ITEMS.map((item) => (
            <div key={item.label} style={{ position: "relative" }}
              onMouseEnter={() => handleMouseEnter(item.label)}
              onMouseLeave={handleMouseLeave}>
              <button
                aria-haspopup="true"
                aria-expanded={openDrop === item.label}
                style={{
                  display: "flex", alignItems: "center", gap: 5,
                  padding: "7px 13px", borderRadius: "var(--radius-md)",
                  border: "none",
                  background: openDrop === item.label ? "var(--brand-light)" : "transparent",
                  color: openDrop === item.label ? "var(--brand)" : "var(--text-secondary)",
                  fontSize: 13, fontWeight: 600, cursor: "pointer",
                  fontFamily: "var(--font)", transition: "all 0.15s ease", whiteSpace: "nowrap",
                }}>
                <span style={{ fontSize: 14 }}>{item.icon}</span>
                {item.label}
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none"
                  stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                  style={{ transform: openDrop === item.label ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s ease" }}>
                  <polyline points="2 3.5 5 6.5 8 3.5" />
                </svg>
              </button>
              <MegaDropdown catConfig={item} isOpen={openDrop === item.label} />
            </div>
          ))}

          <a href="/guide" style={{
            padding: "7px 13px", borderRadius: "var(--radius-md)",
            fontSize: 13, fontWeight: 600, color: "var(--text-secondary)",
            textDecoration: "none", transition: "all 0.15s ease", whiteSpace: "nowrap",
          }}
            onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = "var(--brand-light)"; el.style.color = "var(--brand)"; }}
            onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = "transparent"; el.style.color = "var(--text-secondary)"; }}>
            How to Use
          </a>
        </nav>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          {/* PREMIUM BUTTON — uncomment when premium plan is live
          <a href="/premium" className="btn-cta"
            style={{ fontSize: 12, padding: "8px 16px", whiteSpace: "nowrap" }}
            aria-label="Upgrade to EzSeva Premium">
            ⚡ Go Premium — ₹49/mo
          </a>
          */}

          {/* Hamburger */}
          <button
            onClick={() => setMobileOpen((p) => !p)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            className="show-mobile"
            style={{
              display: "none",
              background: "transparent",
              border: "1px solid var(--border-medium)",
              borderRadius: "var(--radius-sm)",
              width: 36, height: 36,
              alignItems: "center", justifyContent: "center",
              cursor: "pointer", color: "var(--text-secondary)",
              padding: 0, flexShrink: 0,
            }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"
              stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              {mobileOpen ? (
                <><line x1="3" y1="3" x2="15" y2="15" /><line x1="15" y1="3" x2="3" y2="15" /></>
              ) : (
                <><line x1="2" y1="5" x2="16" y2="5" /><line x1="2" y1="9" x2="16" y2="9" /><line x1="2" y1="13" x2="16" y2="13" /></>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* ── Mobile Accordion ── */}
      {mobileOpen && (
        <div id="mobile-menu" role="navigation" aria-label="Mobile navigation"
          style={{ borderTop: "1px solid var(--border-light)", background: "#fff", padding: "10px 16px 16px" }}>
          {NAV_ITEMS.map((item) => {
            const isExpanded = mobileExp === item.label;
            const tools = TOOLS.filter((t) => t.cat === item.cat);
            return (
              <div key={item.label} style={{ marginBottom: 2 }}>
                <button
                  onClick={() => setMobileExp(isExpanded ? null : item.label)}
                  aria-expanded={isExpanded}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", gap: 8,
                    padding: "11px 12px", borderRadius: "var(--radius-md)", border: "none",
                    background: isExpanded ? "var(--brand-light)" : "transparent",
                    color: isExpanded ? "var(--brand)" : "var(--text-secondary)",
                    fontSize: 14, fontWeight: 600, cursor: "pointer",
                    fontFamily: "var(--font)", textAlign: "left",
                  }}>
                  <span>{item.icon}</span>
                  <span style={{ flex: 1 }}>{item.label}</span>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                    style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
                    <polyline points="2 4 6 8 10 4" />
                  </svg>
                </button>
                {isExpanded && (
                  <div style={{ paddingLeft: 12, paddingBottom: 4 }}>
                    {tools.map((tool) => (
                      <a key={tool.href} href={tool.href} onClick={closeAll}
                        style={{
                          display: "flex", alignItems: "center", gap: 10,
                          padding: "9px 10px", borderRadius: "var(--radius-sm)",
                          textDecoration: "none", transition: "background 0.12s",
                        }}>
                        <span style={{ fontSize: 18 }}>{tool.icon}</span>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>{tool.title}</div>
                          <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{tool.desc}</div>
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          <a href="/guide" onClick={closeAll}
            style={{
              display: "block", padding: "11px 12px",
              borderRadius: "var(--radius-md)", fontSize: 14, fontWeight: 600,
              color: "var(--text-secondary)", textDecoration: "none", marginTop: 2,
            }}>
            📖 How to Use
          </a>

          {/* PREMIUM BUTTON — uncomment when premium plan is live
          <div style={{ height: 1, background: "var(--border-light)", margin: "10px 0" }} />
          <a href="/premium" className="btn-cta" onClick={closeAll}
            style={{ display: "block", textAlign: "center", fontSize: 14, padding: 12 }}>
            ⚡ Go Premium — ₹49/mo
          </a>
          */}
        </div>
      )}
    </header>
  );
}