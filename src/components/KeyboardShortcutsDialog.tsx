import type { ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Keyboard } from 'lucide-react';

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
  return <kbd className="inline-flex min-w-[1.5rem] items-center justify-center rounded-md border border-white/15 bg-white/10 px-1.5 py-0.5 font-mono text-[10px] text-text">{children}</kbd>;
}

export default function KeyboardShortcutsDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80" onClick={onClose} aria-hidden />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.15 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="shortcuts-title"
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-surface shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
              <div className="flex items-center gap-2"><Keyboard className="h-4 w-4 text-accent" /><h2 id="shortcuts-title" className="text-sm font-bold text-text">Keyboard shortcuts</h2></div>
              <button type="button" onClick={onClose} className="touch-target rounded-lg p-1.5 text-muted transition-colors hover:bg-white/5 hover:text-text" aria-label="Close shortcuts"><X className="h-4 w-4" /></button>
            </div>
            <ul className="max-h-[60vh] space-y-1 overflow-y-auto p-3">
              {SHORTCUTS.map(shortcut => (
                <li key={shortcut.description} className="flex items-center justify-between gap-4 rounded-xl px-3 py-2.5 hover:bg-white/5">
                  <span className="text-sm text-muted">{shortcut.description}</span>
                  <span className="flex shrink-0 items-center gap-1">{shortcut.keys.map(key => <span key={`${shortcut.description}-${key}`} className="inline-flex"><KeyBadge>{key}</KeyBadge></span>)}</span>
                </li>
              ))}
            </ul>
            <p className="border-t border-white/5 px-4 py-3 text-[10px] text-muted">Press <KeyBadge>?</KeyBadge> anytime to toggle this panel.</p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
