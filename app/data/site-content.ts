// ─────────────────────────────────────────────
// EzSeva — Marcomm + Legal content (single source)
// Review: Marcomm & Legal · June 2026
// Publish domain: https://www.ezseva.in
// ─────────────────────────────────────────────

export const SITE = {
  name: "EzSeva",
  tagline: "Built for Billions",
  url: "https://www.ezseva.in",
  domain: "www.ezseva.in",
  email: {
    general: "hello@ezseva.in",
    bugs: "bugs@ezseva.in",
    ideas: "ideas@ezseva.in",
  },
  location: "Rewa, Madhya Pradesh, India",
  legalUpdated: "June 2026",
} as const;

/** External profiles — footer & marcomm */
export const SOCIAL = {
  instagram: {
    label: "Instagram",
    handle: "@ezseva.in",
    url: "https://www.instagram.com/ezseva.in/",
  },
} as const;

/** EzSeva Care — separate product on care.ezseva.com */
export const CARE_PRODUCT = {
  label: "EzSeva Care — clinic & hospital software →",
  url: "https://care.ezseva.com",
} as const;

/** Shown on tool pages — exam presets disclaimer */
export const EXAM_DISCLAIMER =
  "EzSeva is not affiliated with SSC, UPSC, Railway, VYAPAM, IBPS, or any government body. Size presets are based on publicly available exam guidelines — always confirm requirements on the official notification before you submit.";

/** Marcomm — homepage & shared UI */
export const MARCOM = {
  heroEyebrow: "Free · Private · Made for India",
  heroH1Line1: "Every exam form.",
  heroH1Line2: "Every PDF. One place.",
  heroSub:
    "Resize photos for SSC & Railway · Compress PDFs for portals · Practice typing — free, instant, and 100% in your browser.",
  heroSearchPlaceholder: "Search tools — resize, compress, typing…",
  privacyTitle: "Your data stays with you.",
  privacyBody:
    "Every tool runs entirely in your browser. Files are not uploaded to EzSeva servers for processing — your documents stay on your device.",
  ctaTitle: "Ready to work smarter?",
  ctaSub: "Free forever. Zero signup. Built for Billions.",
  ctaButton: "Try Free Tools Now →",
  footerBlurb:
    "Free browser tools for India — resize exam photos, compress PDFs, and practice typing. Processing happens on your device.",
} as const;

export const TRUST_POINTS = [
  "No file upload for tool processing",
  "No account required",
  "Works on mobile browsers",
  "Free to use — supported by ads",
] as const;

export const WHY_EZSEVA = [
  {
    icon: "🛡️",
    title: "Privacy by design",
    desc: "Tools run in your browser. Photos and PDFs are not sent to EzSeva for processing — we cannot access your files.",
  },
  {
    icon: "🎯",
    title: "Built for Indian exams",
    desc: "SSC, Railway, UPSC, VYAPAM, and CPCT presets are researched from official notifications — not generic international sizes.",
  },
  {
    icon: "⚡",
    title: "Zero friction",
    desc: "No signup, no OTP, no watermarks. Open a tool, finish your work, and download — on phone or desktop.",
  },
  {
    icon: "📱",
    title: "Works everywhere",
    desc: "Lightweight tools for cyber cafés, college labs, and home — including slower mobile connections.",
  },
] as const;

export const HOW_IT_WORKS = [
  {
    num: "01",
    title: "Pick a tool",
    desc: "Choose from our free image, PDF, and typing tools. No account needed.",
  },
  {
    num: "02",
    title: "Process in browser",
    desc: "Your file stays on your device. Processing uses your browser — not EzSeva servers.",
  },
  {
    num: "03",
    title: "Download & submit",
    desc: "Get exam-ready output in seconds — resized photo, compressed PDF, typing score, and more.",
  },
] as const;

/* ── Legal: Privacy Policy sections ── */
export const LEGAL_PRIVACY = {
  title: "Privacy Policy",
  intro:
    "EzSeva respects your privacy. This policy explains what happens when you use ezseva.in and our free browser tools.",
  promise: "Your files are processed on your device — not uploaded to us for tool processing.",
  sections: [
    {
      icon: "📁",
      title: "1. File Processing — In Your Browser",
      body: [
        "EzSeva image, PDF, and typing tools run using JavaScript in your web browser. When you select or drag a file, it is read into your browser's memory on your device.",
        "We do not operate a backend that accepts your documents for resize, compress, merge, split, protect, crop, or similar tool operations. Output files are generated locally and downloaded by you.",
        "Because processing is client-side, EzSeva cannot view, store, or recover the content of files you process through our tools.",
      ],
    },
    {
      icon: "📊",
      title: "2. Analytics (Google Analytics)",
      body: [
        "On the live website (www.ezseva.in), we use Google Analytics to understand aggregate traffic — such as page views, device type, and general geography. This helps us improve EzSeva.",
        "Google Analytics may set cookies and collect usage data according to Google's policies. We do not use analytics to read your uploaded files (files are not uploaded for processing).",
        "You may use browser privacy settings or opt-out tools provided by Google to limit analytics tracking.",
      ],
    },
    {
      icon: "📢",
      title: "3. Advertising (Google AdSense)",
      body: [
        "EzSeva is free to use. We display advertisements through Google AdSense on the live site to support operating costs.",
        "Google and its partners may use cookies to serve ads based on your prior visits to EzSeva or other websites. Ad personalization is governed by Google's advertising policies.",
        "You can manage ad personalization in your Google Account settings or use an ad blocker — tools will continue to work.",
      ],
    },
    {
      icon: "🍪",
      title: "4. Cookies",
      body: [
        "EzSeva may use essential cookies for site functionality and third-party cookies from Google Analytics and Google AdSense as described above.",
        "We do not require cookies to process files in our tools — tool processing does not depend on signing in or sending files to our servers.",
      ],
    },
    {
      icon: "👤",
      title: "5. Personal Information",
      body: [
        "You can use all EzSeva tools without creating an account. We do not ask for Aadhaar, phone number, or identity documents to use free tools.",
        "If you email us (hello@ezseva.in), we receive only what you choose to send — typically your email address and message text. Please do not email sensitive documents.",
      ],
    },
    {
      icon: "🔗",
      title: "6. Third-Party Links",
      body: [
        "EzSeva links to external sites such as government portals, EzSeva Care (care.ezseva.com), and Google services. We are not responsible for the privacy practices of third-party websites.",
        "Review the privacy policy of any external site before sharing personal information.",
      ],
    },
    {
      icon: "👶",
      title: "7. Children's Privacy",
      body: [
        "EzSeva tools are general-purpose utilities also used by students. We do not knowingly collect personal information from children through our free tools.",
        "If you believe a child has provided personal data to us by email, contact hello@ezseva.in and we will delete it.",
      ],
    },
    {
      icon: "🇮🇳",
      title: "8. India & Your Rights",
      body: [
        "EzSeva is operated from India. We aim to comply with applicable Indian law, including the Digital Personal Data Protection Act, 2023, for personal data we control (such as support emails).",
        "For privacy questions or data requests related to information you sent us directly, email hello@ezseva.in.",
      ],
    },
    {
      icon: "📝",
      title: "9. Changes to This Policy",
      body: [
        "We may update this Privacy Policy when we add features, change analytics or advertising partners, or update legal requirements. The \"Last updated\" date at the top will change accordingly.",
        "Continued use of EzSeva after an update means you accept the revised policy.",
      ],
    },
  ],
} as const;

/* ── Legal: Terms of Service sections ── */
export const LEGAL_TERMS = {
  title: "Terms of Service",
  intro:
    "By using EzSeva (www.ezseva.in), you agree to these Terms. We have written them in plain language.",
  sections: [
    {
      icon: "✅",
      title: "1. Acceptance",
      body: [
        "By accessing ezseva.in, you agree to these Terms of Service and our Privacy Policy. If you do not agree, please do not use the site.",
      ],
    },
    {
      icon: "🛠️",
      title: "2. What EzSeva Provides",
      body: [
        "EzSeva offers free browser-based utilities: Image Resize, Photo + Signature Joiner, Image to PDF, Image Crop, PDF Compress, PDF Merge, PDF Split, PDF Protect, and Typing Test.",
        "Tools are provided \"as is\" for personal, educational, and professional document preparation. File processing occurs locally in your browser unless explicitly stated otherwise.",
        "We may update, add, or remove tools. We do not guarantee uninterrupted availability.",
      ],
    },
    {
      icon: "📋",
      title: "3. Exam & Government Form Disclaimer",
      body: [
        EXAM_DISCLAIMER,
        "EzSeva is an independent tool publisher. Official exam authorities may change photo sizes, PDF limits, or typing requirements without notice. You are responsible for verifying output against the latest official notification.",
      ],
    },
    {
      icon: "✔️",
      title: "4. Permitted Use",
      list: [
        "Personal document preparation (photos, PDFs, typing practice)",
        "Professional or business document tasks",
        "Educational use",
        "Government and competitive exam form preparation",
      ],
    },
    {
      icon: "🚫",
      title: "5. Prohibited Use",
      list: [
        "Processing or distributing illegal content",
        "Infringing copyright or intellectual property of others",
        "Reverse-engineering or scraping the site to overload our infrastructure",
        "Misrepresenting documents or using EzSeva for fraud",
        "Implying endorsement by SSC, UPSC, Railway, or any government body",
      ],
    },
    {
      icon: "⚠️",
      title: "6. Disclaimer of Warranties",
      body: [
        "EzSeva is provided without warranties of any kind. We do not guarantee that output will be accepted by every portal, exam authority, or third party.",
        "Always review compressed file size, image dimensions, and PDF quality before final submission. We are not liable for rejected applications due to incorrect settings or changed official requirements.",
      ],
    },
    {
      icon: "💡",
      title: "7. Intellectual Property",
      body: [
        "The EzSeva name, logo, website design, and original content are owned by EzSeva. You may not copy or redistribute our branding without written permission.",
        "Files you process remain yours. EzSeva claims no ownership over your content.",
      ],
    },
    {
      icon: "💰",
      title: "8. Free Service & Advertising",
      body: [
        "EzSeva is free to use. We display Google AdSense advertisements on the live site. By using EzSeva, you acknowledge that ads may appear.",
        "Future paid features, if any, will be disclosed separately before you are charged.",
      ],
    },
    {
      icon: "⚖️",
      title: "9. Governing Law",
      body: [
        "These Terms are governed by the laws of India. Disputes shall be subject to the courts of Bhopal, Madhya Pradesh, India, to the extent permitted by law.",
      ],
    },
    {
      icon: "🔄",
      title: "10. Changes",
      body: [
        "We may update these Terms. The \"Last updated\" date will reflect changes. Continued use after updates constitutes acceptance.",
      ],
    },
  ],
} as const;

export const ABOUT_CONTENT = {
  eyebrow: "Our Story",
  title: "About EzSeva",
  subtitle:
    "Free browser tools for India's students, job seekers, and professionals — on any device, without uploading sensitive files to process them.",
  heroTitle: "Built for Billions.",
  heroSub:
    "India's free utility platform for exam photos, PDFs, and typing practice — private, mobile-friendly, and always ₹0.",
  mission: [
    "Millions of Indians resize a photo for a government form, compress a PDF for an upload portal, or practice typing for CPCT — often paying at cyber cafés or uploading sensitive files to sites they do not trust.",
    "EzSeva exists to change that: free tools that run in your browser, with no signup and no file upload for processing. Get your work done, then download.",
  ],
  values: [
    {
      icon: "🔒",
      title: "Privacy First",
      desc: "Tool processing happens on your device. EzSeva does not receive your files for resize, compress, or merge operations.",
    },
    {
      icon: "₹0",
      title: "Free to Use",
      desc: "Core tools remain free. The site is supported by non-intrusive advertising on the live website.",
    },
    {
      icon: "📱",
      title: "Mobile Ready",
      desc: "Built for everyday Indian devices — including budget Android phones and shared cyber café PCs.",
    },
    {
      icon: "🇮🇳",
      title: "India First",
      desc: "VYAPAM photo sizes, SSC presets, Railway formats, CPCT typing — designed for Indian exams and portals from day one.",
    },
  ],
  whoWeAre: [
    "EzSeva is an independent project from Rewa, Madhya Pradesh. We are a small team building practical tools for everyday Indians.",
    "We are not a government agency. We build software that saves time and money — so you can focus on your application, not the paperwork.",
  ],
  toolCategories: [
    {
      icon: "🖼️",
      name: "Image Tools",
      desc: "Resize, crop, merge photo & signature — presets for popular exam and form requirements",
    },
    {
      icon: "📄",
      name: "PDF Tools",
      desc: "Compress, merge, split, and password-protect PDFs — entirely in your browser",
    },
    {
      icon: "⌨️",
      name: "Typing Test",
      desc: "Hindi and English speed practice for CPCT, SSC, Railway, and general skill building",
    },
  ],
} as const;

export const CONTACT_CONTENT = {
  eyebrow: "Get in Touch",
  title: "Contact EzSeva",
  subtitle:
    "Questions, bug reports, or tool ideas — we read every message and aim to reply within 1–2 working days.",
  options: [
    {
      icon: "📧",
      title: "General Enquiries",
      desc: "Partnerships, feedback, or anything else.",
      href: `mailto:${SITE.email.general}`,
      label: "Email Us",
    },
    {
      icon: "🐛",
      title: "Report a Bug",
      desc: "Tell us the tool name, browser, and what went wrong — in text only.",
      href: `mailto:${SITE.email.bugs}?subject=Bug Report — EzSeva`,
      label: "Report Bug",
    },
    {
      icon: "💡",
      title: "Suggest a Tool",
      desc: "Ideas that help Indian exam candidates and form fillers are welcome.",
      href: `mailto:${SITE.email.ideas}?subject=Tool Idea — EzSeva`,
      label: "Share Idea",
    },
  ],
  faqs: [
    {
      q: "My file did not process correctly. What should I do?",
      a: "Refresh the page and try again with a supported format (JPG/PNG for images, PDF for PDF tools). Email bugs@ezseva.in with the tool name and browser — do not attach your file.",
    },
    {
      q: "Can I request a new tool or preset?",
      a: "Yes. Email ideas@ezseva.in with the exam or portal name and required size or format.",
    },
    {
      q: "How do I advertise on EzSeva?",
      a: "We currently use Google AdSense. For direct enquiries, email hello@ezseva.in.",
    },
    {
      q: "How do I report a security concern?",
      a: "Email hello@ezseva.in with subject \"Security Issue\". We respond to good-faith reports promptly.",
    },
  ],
  fileWarning:
    "Please do not email documents or photos. EzSeva cannot process attachments for support — describe the issue in text only.",
} as const;
