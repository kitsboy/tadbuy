import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const LANGUAGES = [
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'es', label: 'ES', name: 'Español' },
  { code: 'fr', label: 'FR', name: 'Français' },
  { code: 'de', label: 'DE', name: 'Deutsch' },
  { code: 'zh', label: '中', name: '中文' },
  { code: 'ar', label: 'ع', name: 'العربية' },
  { code: 'pt', label: 'PT', name: 'Português' },
  { code: 'ja', label: '日', name: '日本語' },
];

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const current = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0];

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
    localStorage.setItem('tadbuy_lang', code);
    // Set RTL for Arabic
    document.documentElement.dir = code === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = code;
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 text-[10px] font-mono text-muted hover:text-text px-2 py-1 rounded-lg hover:bg-surface/50 transition-colors border border-transparent hover:border-border"
        aria-label="Change language"
      >
        <Globe className="w-3 h-3" />
        <span>{current.label}</span>
      </button>
      {open && (
        <div className="absolute right-0 top-8 z-50 bg-card border border-border rounded-xl shadow-2xl p-1 min-w-[140px]">
          {LANGUAGES.map(lang => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs rounded-lg transition-colors ${
                i18n.language === lang.code
                  ? 'bg-accent/10 text-accent'
                  : 'text-muted hover:text-text hover:bg-surface/50'
              }`}
            >
              <span className="font-mono w-4">{lang.label}</span>
              <span>{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
