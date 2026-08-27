/**
 * i18n hardening utilities — language detection, format safety,
 * and translation quality guards.
 *
 * Tadbuy supports 8 languages; this module centralizes how we detect,
 * persist, and validate the user's language choice.
 */

import i18n from './i18n';

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸', dir: 'ltr' as const },
  { code: 'es', name: 'Español', flag: '🇪🇸', dir: 'ltr' as const },
  { code: 'fr', name: 'Français', flag: '🇫🇷', dir: 'ltr' as const },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪', dir: 'ltr' as const },
  { code: 'pt', name: 'Português', flag: '🇵🇹', dir: 'ltr' as const },
  { code: 'ja', name: '日本語', flag: '🇯🇵', dir: 'ltr' as const },
  { code: 'zh', name: '中文', flag: '🇨🇳', dir: 'ltr' as const },
  { code: 'ar', name: 'العربية', flag: '🇸🇦', dir: 'rtl' as const },
] as const;

export type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number]['code'];

const STORAGE_KEY = 'tadbuy_lang';

export function isSupportedLanguage(code: string | null | undefined): code is LanguageCode {
  if (!code) return false;
  return SUPPORTED_LANGUAGES.some((l) => l.code === code);
}

/**
 * Safely read the user's language from localStorage, navigator, or HTML
 * lang attribute. Falls back to 'en' if nothing is set or invalid.
 */
export function detectBrowserLanguage(): LanguageCode {
  if (typeof window === 'undefined') return 'en';
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (isSupportedLanguage(stored)) return stored;
  } catch { /* storage blocked */ }

  // 1) Check <html lang> attribute
  const htmlLang = document.documentElement?.lang;
  if (isSupportedLanguage(htmlLang)) return htmlLang;

  // 2) Check navigator languages
  const nav = (navigator.languages && navigator.languages.length > 0)
    ? navigator.languages
    : [navigator.language].filter(Boolean) as string[];

  for (const candidate of nav) {
    const short = candidate.split('-')[0]?.toLowerCase() ?? '';
    if (isSupportedLanguage(short)) return short;
  }
  return 'en';
}

export function setLanguage(code: LanguageCode): void {
  if (!isSupportedLanguage(code)) return;
  i18n.changeLanguage(code);
  try { localStorage.setItem(STORAGE_KEY, code); } catch { /* noop */ }
  if (typeof document !== 'undefined') {
    document.documentElement.lang = code;
    const lang = SUPPORTED_LANGUAGES.find((l) => l.code === code);
    document.documentElement.dir = lang?.dir ?? 'ltr';
  }
}

export function getCurrentLanguage(): LanguageCode {
  return isSupportedLanguage(i18n.language) ? (i18n.language as LanguageCode) : 'en';
}

export function getLanguageDirection(): 'ltr' | 'rtl' {
  const code = getCurrentLanguage();
  return SUPPORTED_LANGUAGES.find((l) => l.code === code)?.dir ?? 'ltr';
}

/**
 * Safely format a number using the current locale's conventions.
 * Falls back to the en-US format if the locale is unavailable.
 */
export function formatLocalizedNumber(
  value: number,
  options: Intl.NumberFormatOptions = {}
): string {
  const locale = getCurrentLanguage();
  try {
    return new Intl.NumberFormat(locale, options).format(value);
  } catch {
    return new Intl.NumberFormat('en-US', options).format(value);
  }
}

/**
 * Format a date in the user's locale (medium style, e.g. "Aug 26, 2026").
 */
export function formatLocalizedDate(
  date: Date | number,
  options: Intl.DateTimeFormatOptions = { dateStyle: 'medium' }
): string {
  const locale = getCurrentLanguage();
  const d = typeof date === 'number' ? new Date(date) : date;
  try {
    return new Intl.DateTimeFormat(locale, options).format(d);
  } catch {
    return new Intl.DateTimeFormat('en-US', options).format(d);
  }
}

/**
 * Detect a missing translation by comparing the requested key against
 * the English fallback. Returns true if the current language has the
 * same string as English (i.e. likely a missing translation).
 */
export function isLikelyMissingTranslation(key: string): boolean {
  if (!i18n.isInitialized) return false;
  const current = i18n.t(key, { lng: getCurrentLanguage() });
  const fallback = i18n.t(key, { lng: 'en' });
  return current === fallback && getCurrentLanguage() !== 'en';
}
