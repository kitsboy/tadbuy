import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Search, User, X } from 'lucide-react';
import { BrandMark } from './BrandMark';
import { NavLinkItem } from './NavLinkItem';
import { MORE_NAV, PRIMARY_NAV } from './data';
import { ThemeToggle } from '../ThemeToggle';
import { LanguageSwitcher } from '../LanguageSwitcher';
import { CURRENCY_SYMBOLS } from '@/constants';
import { openCommandMenu } from '@/lib/commandMenu';
import { Button } from '../ui';

export function MobileDrawer({
  open,
  onClose,
  currency,
  setCurrency,
  rate,
}: {
  open: boolean;
  onClose: () => void;
  currency: string;
  setCurrency: (c: string) => void;
  rate: number;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] xl:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/70"
            aria-label="Close menu"
            onClick={onClose}
          />
          <motion.nav
            aria-label="Mobile navigation"
            initial={{ x: '-8%', opacity: 0.6 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-8%', opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="absolute inset-y-0 left-0 right-0 sm:right-auto sm:w-[28rem] bg-card border-r border-border shadow-2xl flex flex-col h-full max-h-dvh pt-safe"
          >
            <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-border">
              <BrandMark compact onClick={onClose} />
              <button
                type="button"
                onClick={onClose}
                className="flex items-center justify-center min-h-11 min-w-11 rounded-xl text-muted hover:text-text hover:bg-surface touch-target"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto px-4 py-5 space-y-6">
              <section>
                <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted px-2 mb-3">
                  Main
                </h2>
                <div className="space-y-1.5">
                  {PRIMARY_NAV.map((item) => (
                    <NavLinkItem key={item.path} item={item} variant="mobile" onClick={onClose} />
                  ))}
                </div>
              </section>

              <section>
                <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted px-2 mb-3">
                  More tools
                </h2>
                <div className="grid grid-cols-1 gap-1.5">
                  {MORE_NAV.map((item) => (
                    <NavLinkItem key={item.path} item={item} variant="mobile" onClick={onClose} />
                  ))}
                </div>
              </section>
            </div>

            <div className="px-4 py-4 border-t border-border space-y-3 bg-card pb-safe">
              <div className="flex items-center justify-between gap-3">
                <label className="flex items-center gap-2 font-mono text-sm text-accent border border-accent/20 bg-accent/5 px-3 py-2.5 rounded-full min-h-11 flex-1">
                  <span>₿</span>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    aria-label="Display currency"
                    className="bg-transparent border-none outline-none text-accent font-bold appearance-none flex-1"
                  >
                    <option value="USD">USD</option>
                    <option value="CAD">CAD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                  <span>
                    {CURRENCY_SYMBOLS[currency] ?? '$'}{Math.round(rate).toLocaleString()}
                  </span>
                </label>
                <div className="flex items-center gap-1">
                  <ThemeToggle />
                  <LanguageSwitcher />
                </div>
              </div>

              <Button
                variant="ghost"
                className="w-full justify-center gap-2 min-h-12"
                onClick={() => { onClose(); openCommandMenu(); }}
              >
                <Search className="w-4 h-4" />
                Search
                <kbd className="font-mono bg-white/10 px-1.5 py-0.5 rounded text-[10px] ml-2">⌘K</kbd>
              </Button>

              <Link
                to="/profile"
                onClick={onClose}
                className="flex items-center justify-center gap-2 w-full min-h-12 px-4 text-sm font-semibold text-text bg-surface rounded-xl border border-border hover:bg-white/5 touch-target"
              >
                <User className="w-4 h-4" />
                My Profile
              </Link>
            </div>
          </motion.nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
