// EzSeva — Premium handcrafted logo (v2)
// Gen-Z gradient mark + Sora wordmark · no AI badge

type LogoSize = "icon" | "nav" | "sm" | "md" | "lg";

function LogoMark({ size = 40 }: { size?: number }) {
  const r = size * 0.22;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-hidden
    >
      <defs>
        <linearGradient id="ez-mark-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22D3EE" />
          <stop offset="45%" stopColor="#00C4B4" />
          <stop offset="100%" stopColor="#6366F1" />
        </linearGradient>
        <filter id="ez-mark-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <rect x="1" y="1" width="46" height="46" rx={r} fill="url(#ez-mark-grad)" filter="url(#ez-mark-glow)" />
      {/* Handcrafted 8-spoke sun — simplified chakra */}
      <g transform="translate(24,24)" stroke="rgba(255,255,255,0.55)" strokeWidth="1.2" strokeLinecap="round">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
          <line
            key={deg}
            x1={0}
            y1={-14}
            x2={0}
            y2={-8}
            transform={`rotate(${deg})`}
          />
        ))}
        <circle cx="0" cy="0" r="10" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
      </g>
      {/* ES monogram */}
      <text
        x="24"
        y="27"
        textAnchor="middle"
        fontFamily="Sora, system-ui, sans-serif"
        fontSize="11"
        fontWeight="800"
        fill="#fff"
        letterSpacing="-0.5"
      >
        ES
      </text>
    </svg>
  );
}

export default function Logo({ size = "md" }: { size?: LogoSize }) {
  if (size === "nav") {
    return (
      <span className="ez-logo-nav" aria-label="EzSeva — Built for Billions">
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
      <span aria-label="EzSeva logo">
        <LogoMark size={48} />
      </span>
    );
  }

  const widths = { sm: 150, md: 210, lg: 290 };
  const w = widths[size as "sm" | "md" | "lg"] ?? 210;
  const markSize = size === "lg" ? 52 : size === "sm" ? 36 : 44;

  return (
    <span
      className="ez-logo-nav"
      style={{ gap: 12 }}
      aria-label="EzSeva — Built for Billions"
    >
      <span className="ez-logo-mark">
        <LogoMark size={markSize} />
      </span>
      <span className="ez-logo-word">
        <span className="ez-logo-name" style={{ fontSize: size === "lg" ? "1.65rem" : size === "sm" ? "1rem" : "1.25rem" }}>
          <span className="ez-logo-ez">Ez</span>
          <span className="ez-logo-seva">Seva</span>
        </span>
        <span className="ez-logo-tag" style={{ fontSize: size === "lg" ? "0.62rem" : "0.55rem" }}>
          Built for Billions
        </span>
      </span>
    </span>
  );
}
