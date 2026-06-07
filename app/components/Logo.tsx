"use client";

// EzSeva — Handcrafted logo (v3)
// Brush-stroke monogram · organic squircle · Gen-Z gradient

import { useId } from "react";

type LogoSize = "icon" | "nav" | "sm" | "md" | "lg";

function LogoMark({ size = 40 }: { size?: number }) {
  const uid = useId().replace(/:/g, "");
  const gradMain = `ez-grad-${uid}`;
  const gradShine = `ez-shine-${uid}`;
  const filterGlow = `ez-glow-${uid}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-hidden
      className="ez-logo-svg"
    >
      <defs>
        <linearGradient id={gradMain} x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#14B8A6" />
          <stop offset="48%" stopColor="#0D9488" />
          <stop offset="100%" stopColor="#6366F1" />
        </linearGradient>
        <linearGradient id={gradShine} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.28)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
        <filter id={filterGlow} x="-25%" y="-25%" width="150%" height="150%">
          <feGaussianBlur stdDeviation="1.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Organic squircle — slight asymmetry for handcrafted feel */}
      <path
        d="M10 6.5 C10 4.5 12 3 14.5 3 H33.5 C36.5 3 38.5 4.8 39 7.5 L41.5 18 C42 20.5 44 22.5 44.5 25 V33 C44.5 39 40 43.5 34 43.5 H14 C8 43.5 3.5 39 3.5 33 V15 C3.5 11 5.5 8.5 10 6.5 Z"
        fill={`url(#${gradMain})`}
        filter={`url(#${filterGlow})`}
      />
      <path
        d="M10 6.5 C10 4.5 12 3 14.5 3 H33.5 C36.5 3 38.5 4.8 39 7.5 L41.5 18 C42 20.5 44 22.5 44.5 25 V33 C44.5 39 40 43.5 34 43.5 H14 C8 43.5 3.5 39 3.5 33 V15 C3.5 11 5.5 8.5 10 6.5 Z"
        fill={`url(#${gradShine})`}
      />

      {/* Hand-drawn "e" loop — single brush stroke */}
      <path
        d="M30 22.5 C30 17.5 24 15.5 19.5 18 C15 20.5 14.5 26 18 28.5 C21 30.5 26 29.5 28 26.5"
        fill="none"
        stroke="#fff"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Seva tick — helping hand check */}
      <path
        d="M28.5 26.5 L31.5 29.5 L37 23.5"
        fill="none"
        stroke="#fff"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Craft spark — gold seva dot */}
      <circle cx="36.5" cy="11" r="2.2" fill="#FDE68A" opacity="0.95" />
      <circle cx="36.5" cy="11" r="4.5" fill="#FDE68A" opacity="0.18" />
    </svg>
  );
}

export default function Logo({
  size = "md",
  theme = "light",
}: {
  size?: LogoSize;
  theme?: "light" | "inverse";
}) {
  const inverseClass = theme === "inverse" ? " is-inverse" : "";

  if (size === "nav") {
    return (
      <span
        className={`ez-logo-nav${inverseClass}`}
        aria-label="EzSeva — Built for Billions"
      >
        <span className="ez-logo-mark">
          <LogoMark size={38} />
        </span>
        <span className="ez-logo-word hide-xs">
          <span className="ez-logo-name">
            <span className="ez-logo-ez">Ez</span>
            <span className="ez-logo-seva">Seva</span>
          </span>
          <span className="ez-logo-tag">Built for Billions</span>
        </span>
      </span>
    );
  }

  if (size === "icon") {
    return (
      <span className="ez-logo-icon-wrap" aria-label="EzSeva logo">
        <LogoMark size={52} />
      </span>
    );
  }

  const markSize = size === "lg" ? 56 : size === "sm" ? 36 : 44;

  return (
    <span
      className={`ez-logo-nav${inverseClass}`}
      style={{ gap: 12 }}
      aria-label="EzSeva — Built for Billions"
    >
      <span className="ez-logo-mark">
        <LogoMark size={markSize} />
      </span>
      <span className="ez-logo-word">
        <span
          className="ez-logo-name"
          style={{
            fontSize: size === "lg" ? "1.65rem" : size === "sm" ? "1rem" : "1.25rem",
          }}
        >
          <span className="ez-logo-ez">Ez</span>
          <span className="ez-logo-seva">Seva</span>
        </span>
        <span
          className="ez-logo-tag"
          style={{ fontSize: size === "lg" ? "0.62rem" : "0.55rem" }}
        >
          Built for Billions
        </span>
      </span>
    </span>
  );
}
