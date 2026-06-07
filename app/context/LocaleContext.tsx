"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { translate, type Lang, LOCALES } from "../data/i18n";

const STORAGE_KEY = "ezseva_lang";

interface LocaleContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
  locales: typeof LOCALES;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Lang | null;
      if (stored === "en" || stored === "hi") setLangState(stored);
    } catch {}
  }, []);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {}
    document.documentElement.lang = next === "hi" ? "hi-IN" : "en-IN";
  }, []);

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) => translate(lang, key, vars),
    [lang]
  );

  const value = useMemo(
    () => ({ lang, setLang, t, locales: LOCALES }),
    [lang, setLang, t]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    return {
      lang: "en" as Lang,
      setLang: () => {},
      t: (key: string, vars?: Record<string, string | number>) => translate("en", key, vars),
      locales: LOCALES,
    };
  }
  return ctx;
}
