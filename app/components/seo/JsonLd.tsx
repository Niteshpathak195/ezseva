import { SITE } from "../../data/site-content";

export default function JsonLd() {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: SITE.url,
    logo: `${SITE.url}/favicon.ico`,
    description:
      "Free browser-based image, PDF, and typing tools for India. Processing on your device.",
    email: `mailto:${SITE.email.general}`,
    areaServed: "IN",
    slogan: SITE.tagline,
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: SITE.url,
    description:
      "Free online tools for SSC, Railway, VYAPAM photo resize, PDF compress, merge, and typing test.",
    inLanguage: "en-IN",
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE.url}/#tools`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
    </>
  );
}
