export type Lang = "en" | "hi";

export const LOCALES: { id: Lang; label: string; short: string }[] = [
  { id: "en", label: "English", short: "EN" },
  { id: "hi", label: "हिंदी", short: "हिं" },
];

type Dict = Record<string, string>;

const en: Dict = {
  "nav.imageTools": "Image Tools",
  "nav.pdfTools": "PDF Tools",
  "nav.typingTest": "Typing Test",
  "nav.guide": "How to Use",
  "nav.about": "About",
  "nav.contact": "Contact",
  "nav.care": "EzSeva Care →",
  "nav.browseTools": "Browse all tools",
  "nav.trust": "100% in-browser · No signup · {count} free tools",
  "shell.private": "100% Private",
  "shell.instant": "Instant",
  "shell.mobile": "Mobile Ready",
  "shell.free": "Free Forever",
  "shell.home": "Home",
  "shell.allTools": "← All Tools",
  "shell.freeNoSignup": "Free · {cat} · No signup",
  "shell.breadcrumbTools": "Tools",
  "footer.rights": "© {year} EzSeva. Built for billions.",
  "footer.privacy": "Privacy",
  "footer.terms": "Terms",
  "footer.home": "Home",
  "lang.toggle": "Language",
};

const hi: Dict = {
  "nav.imageTools": "इमेज टूल्स",
  "nav.pdfTools": "PDF टूल्स",
  "nav.typingTest": "टाइपिंग टेस्ट",
  "nav.guide": "कैसे उपयोग करें",
  "nav.about": "हमारे बारे में",
  "nav.contact": "संपर्क",
  "nav.care": "EzSeva Care →",
  "nav.browseTools": "सभी टूल्स देखें",
  "nav.trust": "100% ब्राउज़र में · कोई साइनअप नहीं · {count} मुफ़्त टूल",
  "shell.private": "100% निजी",
  "shell.instant": "तुरंत",
  "shell.mobile": "मोबाइल पर",
  "shell.free": "हमेशा मुफ़्त",
  "shell.home": "होम",
  "shell.allTools": "← सभी टूल्स",
  "shell.freeNoSignup": "मुफ़्त · {cat} · कोई साइनअप नहीं",
  "shell.breadcrumbTools": "टूल्स",
  "footer.rights": "© {year} EzSeva. अरबों के लिए बना।",
  "footer.privacy": "गोपनीयता",
  "footer.terms": "नियम",
  "footer.home": "होम",
  "lang.toggle": "भाषा",
};

const MAP: Record<Lang, Dict> = { en, hi };

export function translate(lang: Lang, key: string, vars?: Record<string, string | number>): string {
  let text = MAP[lang][key] ?? MAP.en[key] ?? key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      text = text.replace(`{${k}}`, String(v));
    }
  }
  return text;
}
