// ─────────────────────────────────────────────
// EzSeva — Shared Footer Component
// app/components/Footer.tsx
// ─────────────────────────────────────────────
// Version : 1.2.0
// Updated : March 2026
//
// CHANGE:
//   ✅ "About" link added — /about page now exists
//   ✅ All 4 pages live: /privacy /terms /contact /about
// ─────────────────────────────────────────────

export default function Footer() {
  const links = [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms",   href: "/terms"   },
    { label: "Contact", href: "/contact" },
    { label: "About",   href: "/about"   },
  ];

  return (
    <footer className="footer">
      <div className="footer-inner container">
        <p className="footer-copy">
          © {new Date().getFullYear()} EzSeva.in — Built for Billions.
        </p>
        <nav className="footer-links" aria-label="Footer navigation">
          {links.map((l) => (
            <a key={l.href} href={l.href}>{l.label}</a>
          ))}
        </nav>
      </div>
    </footer>
  );
}