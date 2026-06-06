import Logo from "./Logo";
import { TOOLS } from "../data/tools";

const TOOL_LINKS = [
  { label: "Image Resize", href: "/image-resize" },
  { label: "Photo + Signature", href: "/photo-joiner" },
  { label: "PDF Compress", href: "/pdf-compress" },
  { label: "Typing Test", href: "/typing-test" },
];

const COMPANY_LINKS = [
  { label: "About", href: "/about" },
  { label: "How to Use", href: "/guide" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];

export default function Footer() {
  return (
    <footer className="ez-footer-v2">
      <div className="ez-footer-grid">
        <div className="ez-footer-brand">
          <Logo size="sm" />
          <p>
            Free browser tools for India — resize exam photos, compress PDFs, and
            practice typing. Your files never leave your device.
          </p>
          <a
            href="https://care.ezseva.com"
            className="ez-footer-care-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            🏥 EzSeva Care — for clinics & hospitals →
          </a>
        </div>

        <div className="ez-footer-col">
          <h4>Popular tools</h4>
          {TOOL_LINKS.map((l) => (
            <a key={l.href} href={l.href}>{l.label}</a>
          ))}
        </div>

        <div className="ez-footer-col">
          <h4>Company</h4>
          {COMPANY_LINKS.map((l) => (
            <a key={l.href} href={l.href}>{l.label}</a>
          ))}
          <p style={{ marginTop: 14, fontSize: 12, color: "rgba(255,255,255,.35)" }}>
            {TOOLS.length} free tools · ₹0 forever
          </p>
        </div>
      </div>

      <div className="ez-footer-bottom">
        <span>© {new Date().getFullYear()} EzSeva Technologies · Rewa, MP</span>
        <span>Built for Billions 🇮🇳</span>
      </div>
    </footer>
  );
}
