import { useEffect, useRef, useState } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import {
  SUPPORTED_LANGUAGES,
  LanguageCode,
  isSupportedLanguage,
  setLanguage as persistLanguage,
} from '@/lib/i18nUtils';
import { cn } from '@/lib/utils';

const FLAGS: Record<LanguageCode, string> = {
  en: '🇺🇸',
  es: '🇪🇸',
  fr: '🇫🇷',
  de: '🇩🇪',
  zh: '🇨🇳',
  ar: '🇸🇦',
  pt: '🇵🇹',
  ja: '🇯🇵',
};

const SHORT: Record<LanguageCode, string> = {
  en: 'EN',
  es: 'ES',
  fr: 'FR',
  de: 'DE',
  zh: '中',
  ar: 'ع',
  pt: 'PT',
  ja: '日',
};

function readCurrentLang(): LanguageCode {
  if (typeof document === 'undefined') return 'en';
  const htmlLang = document.documentElement?.lang;
  if (isSupportedLanguage(htmlLang)) return htmlLang;
  try {
    const stored = localStorage.getItem('tadbuy_lang');
    if (isSupportedLanguage(stored)) return stored;
  } catch { /* noop */ }
  return 'en';
}

export function LanguageSwitcher() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<LanguageCode>(readCurrentLang);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click / Escape.
  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const changeLanguage = (code: string) => {
    if (!isSupportedLanguage(code)) return;
    persistLanguage(code);
    setCurrent(code);
    setOpen(false);
  };

  const meta = SUPPORTED_LANGUAGES.find((l) => l.code === current) ?? SUPPORTED_LANGUAGES[0];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Change language — ${meta.name}`}
        className="flex items-center gap-1 rounded-lg border border-transparent px-2 py-1 text-[10px] font-mono text-muted transition-colors hover:border-white/10 hover:bg-white/[0.03] hover:text-white"
      >
        <Globe className="h-3 w-3" />
        <span className="hidden sm:inline">{FLAGS[meta.code]}</span>
        <span>{SHORT[meta.code]}</span>
        <ChevronDown
          className={cn('h-2.5 w-2.5 transition-transform', open && 'rotate-180')}
          aria-hidden
        />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute right-0 top-9 z-50 min-w-[200px] overflow-hidden rounded-xl border border-white/10 bg-zinc-950/95 p-1 shadow-2xl backdrop-blur-md"
        >
          {SUPPORTED_LANGUAGES.map((lang) => {
            const active = current === lang.code;
            return (
              <button
                key={lang.code}
                role="option"
                aria-selected={active}
                onClick={() => changeLanguage(lang.code)}
                className={cn(
                  'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs transition-colors',
                  active
                    ? 'bg-accent/10 text-accent'
                    : 'text-zinc-300 hover:bg-white/5 hover:text-white'
                )}
              >
                <span aria-hidden className="text-base leading-none">
                  {FLAGS[lang.code]}
                </span>
                <span className="font-mono text-[10px] uppercase text-zinc-500">
                  {lang.code}
                </span>
                <span className="flex-1 truncate">{lang.name}</span>
                {active && <Check className="h-3.5 w-3.5 text-accent" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
