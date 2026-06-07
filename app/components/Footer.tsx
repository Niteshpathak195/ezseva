"use client";

import { SITE } from "../data/site-content";
import { useLocale } from "../context/LocaleContext";

const MINI_LINKS = [
  { key: "footer.privacy", href: "/privacy" },
  { key: "footer.terms", href: "/terms" },
  { key: "footer.contact", href: "/contact" },
] as const;

/**
 * Tool & inner pages — compact 2-line footer.
 * Homepage uses HomeFooter instead (see app/page.tsx).
 */
export default function Footer() {
  const { t } = useLocale();

  return (
    <footer className="ez-footer-mini" aria-label="Site footer">
      <div className="ez-footer-mini-inner">
        <p className="ez-footer-mini-copy">
          {t("footer.rights", { year: new Date().getFullYear() })} · {SITE.location}
        </p>
        <nav className="ez-footer-mini-nav" aria-label="Footer links">
          {MINI_LINKS.map((l) => (
            <a key={l.href} href={l.href}>
              {t(l.key)}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
