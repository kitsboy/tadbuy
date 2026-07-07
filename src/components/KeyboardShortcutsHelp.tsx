import type { ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Keyboard } from 'lucide-react';
import { useKeyboardShortcutsGuide } from '@/hooks/useKeyboardShortcutsGuide';

const SHORTCUTS = [
  { keys: ['⌘', 'K'], description: 'Open command menu' },
  { keys: ['?'], description: 'Show keyboard shortcuts' },
  { keys: ['Esc'], description: 'Close modal / menu' },
  { keys: ['G', 'H'], description: 'Go to home (Buy Ads)' },
  { keys: ['G', 'C'], description: 'Go to campaigns' },
  { keys: ['G', 'M'], description: 'Go to metrics' },
  { keys: ['G', 'W'], description: 'Go to wallet' },
] as const;

function KeyBadge({ children }: { children: ReactNode }) {
  return (
    <kbd className="inline-flex items-center justify-center min-w-[1.5rem] px-1.5 py-0.5 rounded-md bg-white/10 border border-white/15 text-[10px] font-mono text-text">
      {children}
    </kbd>
  );
}

export default function KeyboardShortcutsHelp() {
  const { open, close } = useKeyboardShortcutsGuide();

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80"
            onClick={close}
            aria-hidden
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.15 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="shortcuts-title"
            className="relative w-full max-w-md bg-surface border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Keyboard className="w-4 h-4 text-accent" />
                <h2 id="shortcuts-title" className="text-sm font-bold text-text">
                  Keyboard shortcuts
                </h2>
              </div>
              <button
                type="button"
                onClick={close}
                className="p-1.5 rounded-lg text-muted hover:text-text hover:bg-white/5 transition-colors touch-target"
                aria-label="Close shortcuts"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <ul className="p-3 space-y-1 max-h-[60vh] overflow-y-auto">
              {SHORTCUTS.map((s) => (
                <li
                  key={s.description}
                  className="flex items-center justify-between gap-4 px-3 py-2.5 rounded-xl hover:bg-white/5"
                >
                  <span className="text-sm text-muted">{s.description}</span>
                  <span className="flex items-center gap-1 shrink-0">
                    {s.keys.map((k) => (
                      <span key={`${s.description}-${k}`} className="inline-flex">
                        <KeyBadge>{k}</KeyBadge>
                      </span>
                    ))}
                  </span>
                </li>
              ))}
            </ul>
            <p className="px-4 py-3 text-[10px] text-muted border-t border-white/5">
              Press <KeyBadge>?</KeyBadge> anytime to toggle this panel.
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}