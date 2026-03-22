import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.ezseva.in";

  return [
    /* ── Homepage ── */
    { url: baseUrl,                        lastModified: new Date(), changeFrequency: "weekly",  priority: 1.0 },

    /* ── Image Tools ── */
    { url: `${baseUrl}/image-resize`,      lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/photo-joiner`,      lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/image-to-pdf`,      lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/image-crop`,        lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },

    /* ── PDF Tools ── */
    { url: `${baseUrl}/pdf-compress`,      lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/pdf-merge`,         lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/pdf-split`,         lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/pdf-protect`,       lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },

    /* ── Typing Test ── */
    { url: `${baseUrl}/typing-test`,       lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },

    /* ── Guide ── */
    { url: `${baseUrl}/guide`,             lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },

    /* ── AI Tools ── */
    { url: `${baseUrl}/ai-letter`,         lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/ai-resume`,         lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/ai-biodata`,        lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },

    /* ── Static Pages ── */
    { url: `${baseUrl}/privacy`,           lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
    { url: `${baseUrl}/terms`,             lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
    { url: `${baseUrl}/contact`,           lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
    { url: `${baseUrl}/about`,             lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
  ];
}