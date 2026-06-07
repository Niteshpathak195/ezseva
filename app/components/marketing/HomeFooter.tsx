import Logo from "../Logo";
import { MARCOM, SITE, SOCIAL, CARE_PRODUCT } from "../../data/site-content";
import { TOOL_COUNT } from "../../data/tools";

const EXPLORE_LINKS = [
  { label: "Browse all tools", href: "/#tools" },
  { label: "How to Use", href: "/guide" },
] as const;

const COMPANY_LINKS = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

const LEGAL_LINKS = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
] as const;

function InstagramIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Homepage-only footer — rich brand block, explore/company/legal, social */
export default function HomeFooter() {
  const navTrust = `100% in-browser · No signup · ${TOOL_COUNT} free tools`;

  return (
    <footer className="ez-footer-shell ez-footer-home" aria-label="Site footer">
      <div className="ez-footer-shell-bg" aria-hidden="true" />

      <div className="ez-footer-container">
        <div className="ez-footer-grid ez-footer-grid--minimal">
          <div className="ez-footer-brand">
            <a href="/" className="ez-footer-logo-link" aria-label="EzSeva home">
              <Logo size="sm" theme="inverse" />
            </a>
            <p className="ez-footer-blurb">{MARCOM.footerBlurb}</p>
            <p className="ez-footer-trust-line">{navTrust}</p>

            <div className="ez-footer-brand-actions">
              <a
                href={CARE_PRODUCT.url}
                className="ez-footer-care-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                {CARE_PRODUCT.label}
              </a>
              <a
                href={SOCIAL.instagram.url}
                className="ez-footer-social-link"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${SOCIAL.instagram.label} ${SOCIAL.instagram.handle}`}
              >
                <InstagramIcon />
                <span>{SOCIAL.instagram.handle}</span>
              </a>
            </div>
          </div>

          <div className="ez-footer-nav-cols">
            <div className="ez-footer-col">
              <h4>Explore</h4>
              <ul className="ez-footer-links">
                {EXPLORE_LINKS.map((l) => (
                  <li key={l.href}>
                    <a href={l.href}>{l.label}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="ez-footer-col">
              <h4>Company</h4>
              <ul className="ez-footer-links">
                {COMPANY_LINKS.map((l) => (
                  <li key={l.href}>
                    <a href={l.href}>{l.label}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="ez-footer-col">
              <h4>Legal</h4>
              <ul className="ez-footer-links">
                {LEGAL_LINKS.map((l) => (
                  <li key={l.href}>
                    <a href={l.href}>{l.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="ez-footer-bottom">
          <span>
            © {new Date().getFullYear()} {SITE.name} · {SITE.location}
          </span>
          <span className="ez-footer-meta-inline">
            {TOOL_COUNT} free tools · ₹0 · {SITE.domain}
          </span>
          <span className="ez-footer-tagline">
            {SITE.tagline} <span aria-hidden="true">🇮🇳</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
