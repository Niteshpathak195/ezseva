import { MetadataRoute } from "next";
import { EXAM_LANDING_PAGES } from "./data/exam-presets";

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
    { url: `${baseUrl}/pdf-unlock`,        lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },

    /* ── Practice ── */
    { url: `${baseUrl}/typing-test`,       lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },

    /* ── Exam SEO landing pages ── */
    ...EXAM_LANDING_PAGES.map((p) => ({
      url: `${baseUrl}/exams/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.85,
    })),

    /* ── Guide ── */
    { url: `${baseUrl}/guide`,             lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },

    /* ── Static Pages ── */
    { url: `${baseUrl}/privacy`,           lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
    { url: `${baseUrl}/terms`,             lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
    { url: `${baseUrl}/contact`,           lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
    { url: `${baseUrl}/about`,             lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
  ];
}