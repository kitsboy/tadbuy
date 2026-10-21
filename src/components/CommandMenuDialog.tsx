import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, Clock } from 'lucide-react';

type RecentPage = { path: string; name: string; visitedAt: number };
type CommandAction = { id: string; name: string; path: string; group: string };

export default function CommandMenuDialog({
  isOpen,
  onClose,
  onNavigate,
  recentPages,
  actions,
}: {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
  recentPages: RecentPage[];
  actions: readonly CommandAction[];
}) {
  const [search, setSearch] = useState('');
  const filtered = useMemo(
    () => actions.filter(action => action.name.toLowerCase().includes(search.toLowerCase())),
    [actions, search],
  );
  const recentActions = search.trim()
    ? []
    : recentPages
        .map(page => actions.find(action => action.path === page.path))
        .filter((action): action is CommandAction => Boolean(action));

  const handleSelect = (path: string) => {
    onNavigate(path);
    setSearch('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[15vh] sm:pt-[20vh]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/85"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.15 }}
            className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-surface shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="Command menu"
          >
            <div className="flex items-center border-b border-white/5 px-4 py-3">
              <Search className="mr-3 h-5 w-5 text-muted" />
              <input
                autoFocus
                value={search}
                onChange={event => setSearch(event.target.value)}
                placeholder="Type a command or search..."
                className="flex-1 border-none bg-transparent text-lg text-text outline-none placeholder:text-muted"
                aria-label="Search commands"
              />
              <button type="button" onClick={onClose} className="rounded p-1 text-muted hover:text-text" aria-label="Close command menu">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto p-2">
              {filtered.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted">No results found.</div>
              ) : (
                <div className="space-y-1">
                  {recentActions.length > 0 && (
                    <>
                      <div className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-muted">
                        <Clock className="h-3 w-3" /> Recent
                      </div>
                      {recentActions.map(action => (
                        <button key={`recent-${action.id}`} onClick={() => handleSelect(action.path)} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-text transition-colors hover:bg-white/5">
                          <span className="flex-1">{action.name}</span>
                          <span className="text-[10px] text-muted/60">{action.group}</span>
                        </button>
                      ))}
                      <div className="my-2 border-t border-white/5" />
                    </>
                  )}
                  {filtered.map(action => (
                    <button key={action.id} onClick={() => handleSelect(action.path)} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-text transition-colors hover:bg-white/5">
                      <span className="flex-1">{action.name}</span>
                      <span className="text-[10px] text-muted/60">{action.group}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
