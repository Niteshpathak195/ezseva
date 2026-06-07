import Logo from "../Logo";
import { MARCOM } from "../../data/site-content";
import { TOOL_COUNT } from "../../data/tools";

/** Homepage CTA band — pairs with HomeFooter (not shared Footer.tsx) */
export default function SiteClose() {
  const ctaNote = `${TOOL_COUNT} tools · ₹0 · No signup`;

  return (
    <div className="ez-site-close">
      <section aria-label="Call to action" className="ez-cta-band">
        <div className="ez-cta-grid">
          <Logo size="icon" />
          <div className="ez-cta-copy">
            <h2 className="ez-cta-title">{MARCOM.ctaTitle}</h2>
            <p className="ez-cta-sub">{MARCOM.ctaSub}</p>
          </div>
          <div className="ez-cta-actions">
            <a href="#tools" className="btn-cta">
              {MARCOM.ctaButton}
            </a>
            <span className="ez-cta-note">{ctaNote}</span>
          </div>
        </div>
      </section>
    </div>
  );
}
