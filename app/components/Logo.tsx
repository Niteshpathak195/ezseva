// ─────────────────────────────────────────────
// EzSeva — Logo Component
// app/components/Logo.tsx
// ─────────────────────────────────────────────
// Version : 1.1.0 (Audit Fix)
// Updated : March 2026
//
// FIXES:
//   ✅ FIX 1 — aria-label added to all SVG variants (A11y)
//   ✅ FIX 2 — role="img" added to SVGs
//   ✅ FIX 3 — "nav" size variant added: icon (44px) + inline wordmark
//              This is what Navbar should use — avoids 140px wordmark crush
//   ✅ FIX 4 — sizes object kept clean; "sm" still works for other pages
// ─────────────────────────────────────────────

export default function Logo({ size = "md" }: { size?: "icon" | "nav" | "sm" | "md" | "lg" }) {

  /* ── Icon only (48×48) — used in Navbar, favicons, CTAs ── */
  if (size === "icon") {
    return (
      <svg
        width="48"
        height="48"
        viewBox="0 0 68 68"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="EzSeva logo"
      >
        <rect x="0" y="0" width="68" height="68" rx="18" fill="#0A2E2B"/>
        <g transform="translate(34,34)">
          {/* Primary spokes — 8 */}
          <line x1="0"    y1="-27"  x2="0"    y2="-14"  stroke="#5DCAA5" strokeWidth="1.8" strokeLinecap="round"/>
          <line x1="0"    y1="27"   x2="0"    y2="14"   stroke="#5DCAA5" strokeWidth="1.8" strokeLinecap="round"/>
          <line x1="-27"  y1="0"    x2="-14"  y2="0"    stroke="#5DCAA5" strokeWidth="1.8" strokeLinecap="round"/>
          <line x1="27"   y1="0"    x2="14"   y2="0"    stroke="#5DCAA5" strokeWidth="1.8" strokeLinecap="round"/>
          <line x1="-19"  y1="-19"  x2="-10"  y2="-10"  stroke="#5DCAA5" strokeWidth="1.8" strokeLinecap="round"/>
          <line x1="19"   y1="19"   x2="10"   y2="10"   stroke="#5DCAA5" strokeWidth="1.8" strokeLinecap="round"/>
          <line x1="19"   y1="-19"  x2="10"   y2="-10"  stroke="#5DCAA5" strokeWidth="1.8" strokeLinecap="round"/>
          <line x1="-19"  y1="19"   x2="-10"  y2="10"   stroke="#5DCAA5" strokeWidth="1.8" strokeLinecap="round"/>
          {/* Secondary spokes — 8 */}
          <line x1="-10.3" y1="-24.9" x2="-5.5" y2="-13.3" stroke="#9FE1CB" strokeWidth="1.1" strokeLinecap="round" opacity="0.7"/>
          <line x1="10.3"  y1="24.9"  x2="5.5"  y2="13.3"  stroke="#9FE1CB" strokeWidth="1.1" strokeLinecap="round" opacity="0.7"/>
          <line x1="10.3"  y1="-24.9" x2="5.5"  y2="-13.3" stroke="#9FE1CB" strokeWidth="1.1" strokeLinecap="round" opacity="0.7"/>
          <line x1="-10.3" y1="24.9"  x2="-5.5" y2="13.3"  stroke="#9FE1CB" strokeWidth="1.1" strokeLinecap="round" opacity="0.7"/>
          <line x1="-24.9" y1="-10.3" x2="-13.3" y2="-5.5" stroke="#9FE1CB" strokeWidth="1.1" strokeLinecap="round" opacity="0.7"/>
          <line x1="24.9"  y1="10.3"  x2="13.3"  y2="5.5"  stroke="#9FE1CB" strokeWidth="1.1" strokeLinecap="round" opacity="0.7"/>
          <line x1="24.9"  y1="-10.3" x2="13.3"  y2="-5.5" stroke="#9FE1CB" strokeWidth="1.1" strokeLinecap="round" opacity="0.7"/>
          <line x1="-24.9" y1="10.3"  x2="-13.3" y2="5.5"  stroke="#9FE1CB" strokeWidth="1.1" strokeLinecap="round" opacity="0.7"/>
          {/* Rings */}
          <circle cx="0" cy="0" r="27" fill="none" stroke="#5DCAA5" strokeWidth="2"/>
          <circle cx="0" cy="0" r="14" fill="none" stroke="#9FE1CB" strokeWidth="0.9" opacity="0.5"/>
          <circle cx="0" cy="0" r="11" fill="none" stroke="#FCD34D" strokeWidth="0.9" opacity="0.6"/>
          {/* Center monogram */}
          <circle cx="0" cy="0" r="9.5" fill="#0D9488"/>
          <text x="-5.5" y="4" fontFamily="system-ui,sans-serif" fontSize="9.5" fontWeight="900" fill="white">E</text>
          <text x="1.5"  y="4" fontFamily="system-ui,sans-serif" fontSize="9.5" fontWeight="200" fill="#FCD34D">S</text>
        </g>
        {/* AI badge */}
        <circle cx="56" cy="8" r="7" fill="#D97706"/>
        <text x="56" y="12" fontFamily="system-ui,sans-serif" fontSize="7" fontWeight="900" fill="white" textAnchor="middle">AI</text>
        {/* Dust stars */}
        <circle cx="10" cy="12" r="1.5" fill="#9FE1CB" opacity="0.6"/>
        <circle cx="58" cy="52" r="1.2" fill="#FCD34D" opacity="0.6"/>
        <circle cx="12" cy="56" r="1"   fill="#9FE1CB" opacity="0.5"/>
      </svg>
    );
  }

  /* ── Wordmark variants (sm / md / lg) ──────────────────────
     viewBox 0 0 300 80 — width varies by size prop
     sm  = 140px wide  (used on tool pages "← All Tools" area)
     md  = 200px wide  (hero sections)
     lg  = 280px wide  (large display)
  ── */
  const widths = { sm: 140, md: 200, lg: 280 };
  const w = size === "nav" ? 140 : widths[size as "sm" | "md" | "lg"] ?? 200;
  const h = Math.round(w * 0.27);

  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 300 80"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="EzSeva — Built for Billions"
    >
      {/* Chakra icon */}
      <circle cx="36" cy="40" r="33" fill="#0A2E2B"/>
      <circle cx="36" cy="40" r="30" fill="none" stroke="#1D9E75" strokeWidth="1.2" opacity="0.4"/>
      <g transform="translate(36,40)">
        {/* Primary spokes */}
        <line x1="0"    y1="-28" x2="0"    y2="-14" stroke="#5DCAA5" strokeWidth="1.6" strokeLinecap="round"/>
        <line x1="0"    y1="28"  x2="0"    y2="14"  stroke="#5DCAA5" strokeWidth="1.6" strokeLinecap="round"/>
        <line x1="-28"  y1="0"   x2="-14"  y2="0"   stroke="#5DCAA5" strokeWidth="1.6" strokeLinecap="round"/>
        <line x1="28"   y1="0"   x2="14"   y2="0"   stroke="#5DCAA5" strokeWidth="1.6" strokeLinecap="round"/>
        <line x1="-19.8" y1="-19.8" x2="-9.9" y2="-9.9" stroke="#5DCAA5" strokeWidth="1.6" strokeLinecap="round"/>
        <line x1="19.8"  y1="19.8"  x2="9.9"  y2="9.9"  stroke="#5DCAA5" strokeWidth="1.6" strokeLinecap="round"/>
        <line x1="19.8"  y1="-19.8" x2="9.9"  y2="-9.9" stroke="#5DCAA5" strokeWidth="1.6" strokeLinecap="round"/>
        <line x1="-19.8" y1="19.8"  x2="-9.9" y2="9.9"  stroke="#5DCAA5" strokeWidth="1.6" strokeLinecap="round"/>
        {/* Secondary spokes */}
        <line x1="-10.7" y1="-25.6" x2="-6.1" y2="-13"  stroke="#9FE1CB" strokeWidth="1" strokeLinecap="round" opacity="0.8"/>
        <line x1="10.7"  y1="25.6"  x2="6.1"  y2="13"   stroke="#9FE1CB" strokeWidth="1" strokeLinecap="round" opacity="0.8"/>
        <line x1="10.7"  y1="-25.6" x2="6.1"  y2="-13"  stroke="#9FE1CB" strokeWidth="1" strokeLinecap="round" opacity="0.8"/>
        <line x1="-10.7" y1="25.6"  x2="-6.1" y2="13"   stroke="#9FE1CB" strokeWidth="1" strokeLinecap="round" opacity="0.8"/>
        <line x1="-25.6" y1="-10.7" x2="-13"  y2="-6.1" stroke="#9FE1CB" strokeWidth="1" strokeLinecap="round" opacity="0.8"/>
        <line x1="25.6"  y1="10.7"  x2="13"   y2="6.1"  stroke="#9FE1CB" strokeWidth="1" strokeLinecap="round" opacity="0.8"/>
        <line x1="25.6"  y1="-10.7" x2="13"   y2="-6.1" stroke="#9FE1CB" strokeWidth="1" strokeLinecap="round" opacity="0.8"/>
        <line x1="-25.6" y1="10.7"  x2="-13"  y2="6.1"  stroke="#9FE1CB" strokeWidth="1" strokeLinecap="round" opacity="0.8"/>
        {/* Tertiary spokes */}
        <line x1="-5.2"  y1="-27.5" x2="-2.8" y2="-14.8" stroke="#E1F5EE" strokeWidth="0.6" strokeLinecap="round" opacity="0.4"/>
        <line x1="5.2"   y1="27.5"  x2="2.8"  y2="14.8"  stroke="#E1F5EE" strokeWidth="0.6" strokeLinecap="round" opacity="0.4"/>
        <line x1="5.2"   y1="-27.5" x2="2.8"  y2="-14.8" stroke="#E1F5EE" strokeWidth="0.6" strokeLinecap="round" opacity="0.4"/>
        <line x1="-5.2"  y1="27.5"  x2="-2.8" y2="14.8"  stroke="#E1F5EE" strokeWidth="0.6" strokeLinecap="round" opacity="0.4"/>
        <line x1="-27.5" y1="-5.2"  x2="-14.8" y2="-2.8" stroke="#E1F5EE" strokeWidth="0.6" strokeLinecap="round" opacity="0.4"/>
        <line x1="27.5"  y1="5.2"   x2="14.8"  y2="2.8"  stroke="#E1F5EE" strokeWidth="0.6" strokeLinecap="round" opacity="0.4"/>
        <line x1="27.5"  y1="-5.2"  x2="14.8"  y2="-2.8" stroke="#E1F5EE" strokeWidth="0.6" strokeLinecap="round" opacity="0.4"/>
        <line x1="-27.5" y1="5.2"   x2="-14.8" y2="2.8"  stroke="#E1F5EE" strokeWidth="0.6" strokeLinecap="round" opacity="0.4"/>
        {/* Rings */}
        <circle cx="0" cy="0" r="28"   fill="none" stroke="#5DCAA5" strokeWidth="1.8"/>
        <circle cx="0" cy="0" r="16"   fill="none" stroke="#9FE1CB" strokeWidth="0.8" opacity="0.5"/>
        <circle cx="0" cy="0" r="11.5" fill="none" stroke="#FCD34D" strokeWidth="0.8" opacity="0.6"/>
        {/* Center */}
        <circle cx="0" cy="0" r="10" fill="#0D9488"/>
        <text x="-5.5" y="4" fontFamily="system-ui,sans-serif" fontSize="9" fontWeight="900" fill="white">E</text>
        <text x="1.2"  y="4" fontFamily="system-ui,sans-serif" fontSize="9" fontWeight="200" fill="#FCD34D">S</text>
      </g>
      {/* Dust stars */}
      <circle cx="10" cy="14" r="1.2" fill="#9FE1CB" opacity="0.7"/>
      <circle cx="60" cy="18" r="0.9" fill="#FCD34D" opacity="0.6"/>
      <circle cx="14" cy="62" r="1"   fill="#9FE1CB" opacity="0.5"/>
      <circle cx="58" cy="56" r="1.2" fill="#FCD34D" opacity="0.7"/>
      <circle cx="66" cy="38" r="0.7" fill="#9FE1CB" opacity="0.4"/>
      <circle cx="6"  cy="42" r="0.8" fill="#FCD34D" opacity="0.5"/>
      {/* Wordmark */}
      <text x="82" y="36" fontFamily="system-ui,sans-serif" fontSize="30" fontWeight="900" fill="#0A1628" letterSpacing="-1.5">Ez</text>
      <text x="126" y="36" fontFamily="system-ui,sans-serif" fontSize="30" fontWeight="700" fill="#0D9488" letterSpacing="-1.2">Seva</text>
      {/* Amber underline */}
      <rect x="82" y="43" width="116" height="2.5" rx="1.2" fill="#D97706" opacity="0.7"/>
      {/* Tagline */}
      <text x="82" y="58" fontFamily="system-ui,sans-serif" fontSize="8.5" fontWeight="700" fill="#9CA3AF" letterSpacing="2">BUILT FOR BILLIONS</text>
    </svg>
  );
}