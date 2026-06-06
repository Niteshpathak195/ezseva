import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      /* Removed AI tools — redirect to homepage until relaunch */
      { source: "/ai-letter",    destination: "/", permanent: false },
      { source: "/ai-resume",    destination: "/", permanent: false },
      { source: "/ai-biodata",   destination: "/", permanent: false },
      /* EzSevaBot — out of scope */
      { source: "/bot-landing",  destination: "/", permanent: false },
      { source: "/bot/:path*",   destination: "/", permanent: false },
    ];
  },
};

export default nextConfig;
