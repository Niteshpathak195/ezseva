"use client";

import RelatedTools from "./RelatedTools";
import {
  getToolByHref,
  TOOL_PAGE_COPY,
  CATEGORY_META,
} from "../../data/tools";
import { EXAM_DISCLAIMER } from "../../data/site-content";
import { useLocale } from "../../context/LocaleContext";
import Navbar from "../Navbar";
import Footer from "../Footer";

const TRUST_KEYS = [
  { icon: "🔒", key: "shell.private" },
  { icon: "⚡", key: "shell.instant" },
  { icon: "📱", key: "shell.mobile" },
  { icon: "₹", key: "shell.free" },
] as const;

interface Props {
  toolHref: string;
  children: React.ReactNode;
  showRelated?: boolean;
}

export default function ToolPageShell({
  toolHref,
  children,
  showRelated = true,
}: Props) {
  const { t } = useLocale();
  const tool = getToolByHref(toolHref);
  const copy = TOOL_PAGE_COPY[toolHref];
  const catKey = tool?.cat ?? "Image";
  const meta = CATEGORY_META[catKey as keyof typeof CATEGORY_META];

  const headline = copy?.headline ?? tool?.title ?? "EzSeva Tool";
  const subtitle =
    copy?.subtitle ??
    tool?.desc ??
    "Free, private, and instant — runs entirely in your browser.";

  return (
    <>
      <Navbar />

      <main
        className="ez-tool-page"
        style={
          {
            "--tool-accent": meta?.accent ?? "var(--brand)",
            "--tool-accent-soft": meta?.accentSoft ?? "var(--brand-light)",
            "--tool-grad": meta?.grad ?? "var(--grad-brand)",
          } as React.CSSProperties
        }
      >
        <div aria-hidden="true" className="ez-tool-ad-top">
          <ins
            className="adsbygoogle"
            style={{ display: "block", minHeight: "90px" }}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        </div>

        <header className="ez-tool-hero">
          <div className="ez-tool-hero-bg" aria-hidden="true" />
          <div className="container-sm ez-tool-hero-inner">
            <nav className="ez-tool-breadcrumb" aria-label="Breadcrumb">
              <a href="/">{t("shell.home")}</a>
              <span aria-hidden="true">/</span>
              <span>{meta?.label ?? t("shell.breadcrumbTools")}</span>
              <span aria-hidden="true">/</span>
              <span className="ez-tool-breadcrumb-current">{tool?.title}</span>
            </nav>

            <div className="ez-tool-hero-row">
              <div className="ez-tool-hero-icon" aria-hidden="true">
                {tool?.icon ?? "⚡"}
              </div>
              <div className="ez-tool-hero-copy">
                <div className="ez-tool-eyebrow">
                  <span className="ez-tool-eyebrow-dot" />
                  {t("shell.freeNoSignup", { cat: meta?.label ?? "Tool" })}
                </div>
                <h1 className="ez-tool-h1">{headline}</h1>
                <p className="ez-tool-sub">{subtitle}</p>
                <div className="ez-tool-trust">
                  {TRUST_KEYS.map((pill) => (
                    <span key={pill.key} className="ez-tool-trust-pill">
                      {pill.icon} {t(pill.key)}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <a href="/" className="ez-tool-back">
              {t("shell.allTools")}
            </a>
          </div>
        </header>

        <div className="container-sm ez-tool-body">{children}</div>

        <div className="container-sm">
          <p className="ez-tool-disclaimer" role="note">
            {EXAM_DISCLAIMER}
          </p>
        </div>

        {showRelated && (
          <div className="container-sm">
            <RelatedTools excludeHref={toolHref} />
          </div>
        )}

        <div aria-hidden="true" className="ez-tool-ad-bottom">
          <ins
            className="adsbygoogle"
            style={{ display: "block", minHeight: "90px" }}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        </div>
      </main>

      <Footer />
    </>
  );
}
