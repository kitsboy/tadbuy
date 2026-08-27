import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../locales/en.json';
import es from '../locales/es.json';
import fr from '../locales/fr.json';
import de from '../locales/de.json';
import zh from '../locales/zh.json';
import ar from '../locales/ar.json';
import pt from '../locales/pt.json';
import ja from '../locales/ja.json';

const RTL_LANGS = new Set(['ar', 'he', 'fa', 'ur']);

function applyDir(code: string) {
  if (typeof document === 'undefined') return;
  const dir = RTL_LANGS.has(code) ? 'rtl' : 'ltr';
  document.documentElement.dir = dir;
  document.documentElement.lang = code;
}

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    es: { translation: es },
    fr: { translation: fr },
    de: { translation: de },
    zh: { translation: zh },
    ar: { translation: ar },
    pt: { translation: pt },
    ja: { translation: ja },
  },
  lng: (() => {
    if (typeof window === 'undefined') return 'en';
    try {
      const stored = localStorage.getItem('tadbuy_lang');
      if (stored) return stored;
    } catch { /* noop */ }
    const htmlLang = document.documentElement?.lang;
    if (htmlLang) return htmlLang;
    const nav = navigator.languages && navigator.languages.length > 0
      ? navigator.languages
      : [navigator.language].filter(Boolean) as string[];
    for (const candidate of nav) {
      const short = candidate.split('-')[0]?.toLowerCase();
      if (short) return short;
    }
    return 'en';
  })(),
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

applyDir(i18n.language);
i18n.on('languageChanged', applyDir);

export default i18n;