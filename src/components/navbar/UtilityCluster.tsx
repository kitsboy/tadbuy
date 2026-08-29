import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LanguageSwitcher } from '../LanguageSwitcher';
import { ThemeToggle } from '../ThemeToggle';
import { NotificationCenter } from '../NotificationCenter';
import { LocalAvatar } from '../LocalAvatar';
import { OnlineIndicator } from '../OnlineIndicator';
import { CURRENCY_SYMBOLS } from '@/constants';
import { openCommandMenu } from '@/lib/commandMenu';
import { cn } from '@/lib/utils';

export function UtilityCluster({
  currency,
  setCurrency,
  rate,
}: {
  currency: string;
  setCurrency: (c: string) => void;
  rate: number;
}) {
  return (
    <div className="flex items-center gap-2 shrink-0">
      <div className="flex items-center gap-1.5 font-mono text-xs text-accent border border-accent/20 bg-accent/5 px-3 py-1.5 rounded-full min-h-10">
        <span aria-hidden>₿</span>
        <span className="w-px h-3 bg-accent/30" />
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          aria-label="Display currency"
          className="bg-transparent border-none outline-none text-accent cursor-pointer appearance-none font-bold pr-1 min-w-[3.25rem]"
        >
          <option value="USD">USD</option>
          <option value="CAD">CAD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
        </select>
        <span className="text-accent/90">
          {CURRENCY_SYMBOLS[currency] ?? '$'}{Math.round(rate).toLocaleString()}
        </span>
      </div>

      <button
        type="button"
        onClick={openCommandMenu}
        aria-label="Open search"
        className={cn(
          'inline-flex items-center justify-center gap-2 min-h-10 min-w-10 px-2.5 rounded-xl',
          'text-muted hover:text-text hover:bg-surface transition-colors'
        )}
      >
        <Search className="w-4 h-4" />
        <span className="hidden 2xl:inline text-sm font-medium">Search</span>
        <kbd className="hidden 2xl:inline font-mono bg-white/10 px-1.5 py-0.5 rounded text-[10px]">⌘K</kbd>
      </button>

      <span className="hidden 2xl:block w-px h-6 bg-border" />

      <OnlineIndicator className="hidden 2xl:flex min-h-10" />
      <ThemeToggle />
      <LanguageSwitcher />
      <NotificationCenter />

      <Link
        to="/profile"
        className="flex items-center justify-center min-h-10 min-w-10 p-1 rounded-xl hover:bg-surface transition-colors"
        aria-label="My profile"
      >
        <LocalAvatar seed="Felix Bitcoin" size={32} className="rounded-full border border-border" />
      </Link>
    </div>
  );
}
