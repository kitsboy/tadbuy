import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, Megaphone, Layers, BarChart2, Globe, Zap, Network, Brain, Plug, Shield,
  FlaskConical, Presentation, Wallet, MapPin, FileText, Code2, Receipt, BookOpen, Target,
  Clock,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const RECENT_KEY = 'tadbuy_recent_pages';
const MAX_RECENT = 5;

type RecentPage = { path: string; name: string; visitedAt: number };

const COMMAND_ACTIONS = [
  { id: 'buy', name: 'Buy Ads', icon: Megaphone, path: '/', group: 'Campaigns' },
  { id: 'market', name: 'Marketplace', icon: Globe, path: '/marketplace', group: 'Campaigns' },
  { id: 'campaigns', name: 'Campaigns', icon: Layers, path: '/campaigns', group: 'Campaigns' },
  { id: 'metrics', name: 'Metrics', icon: BarChart2, path: '/metrics', group: 'Analytics' },
  { id: 'geo', name: 'Global Reach', icon: MapPin, path: '/geo', group: 'Analytics' },
  { id: 'platforms', name: 'Ad Platforms', icon: Globe, path: '/platforms', group: 'Campaigns' },
  { id: 'analytics', name: 'Campaign Analytics', icon: Target, path: '/analytics', group: 'Analytics' },
  { id: 'wallet', name: 'Wallet', icon: Wallet, path: '/wallet', group: 'Payments' },
  { id: 'settlements', name: 'Settlements', icon: Receipt, path: '/settlements', group: 'Payments' },
  { id: 'hubhash', name: 'Hubhash', icon: Network, path: '/hubhash', group: 'Tools' },
  { id: 'publisher', name: 'Publisher Portal', icon: Globe, path: '/publisher', group: 'Publisher' },
  { id: 'api', name: 'API Reference', icon: Code2, path: '/api-docs', group: 'Developer' },
  { id: 'docs', name: 'Documentation', icon: BookOpen, path: '/docs', group: 'Developer' },
  { id: 'pitch', name: 'Investor Pitch', icon: Presentation, path: '/pitch', group: 'Info' },
  { id: 'beta', name: 'BETA Status', icon: FlaskConical, path: '/beta', group: 'Info' },
  { id: 'intel', name: 'PPQ Intelligence', icon: Brain, path: '/intelligence', group: 'Info' },
  { id: 'integrations', name: 'Integrations', icon: Plug, path: '/integrations', group: 'Info' },
  { id: 'enterprise', name: 'Enterprise', icon: Shield, path: '/enterprise', group: 'Info' },
  { id: 'dashboard', name: 'Dashboard', icon: BarChart2, path: '/dashboard', group: 'Campaigns' },
  { id: 'bolt12', name: 'BOLT12 Info', icon: Zap, path: '/bolt12', group: 'Payments' },
  { id: 'ppq', name: 'PPQ Guide', icon: FileText, path: '/ppq', group: 'Info' },
] as const;

export default function CommandMenu({ onClose }: { onClose: () => void }) {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const [recentPages, setRecentPages] = useLocalStorage<RecentPage[]>(RECENT_KEY, []);
  const filtered = useMemo(() => COMMAND_ACTIONS.filter(action => action.name.toLowerCase().includes(search.toLowerCase())), [search]);

  useEffect(() => {
    const match = COMMAND_ACTIONS.find(action => action.path === location.pathname);
    if (!match || recentPages[0]?.path === match.path) return;

    setRecentPages([
      { path: match.path, name: match.name, visitedAt: Date.now() },
      ...recentPages.filter(page => page.path !== match.path),
    ].slice(0, MAX_RECENT));
  }, [location.pathname, recentPages, setRecentPages]);

  const recentActions = search.trim()
    ? []
    : recentPages.map(page => COMMAND_ACTIONS.find(action => action.path === page.path)).filter((action): action is (typeof COMMAND_ACTIONS)[number] => Boolean(action));

  const handleSelect = (path: string) => {
    navigate(path);
    onClose();
    setSearch('');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[15vh] sm:pt-[20vh]">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/85" onClick={onClose} />
        <motion.div initial={{ opacity: 0, scale: 0.95, y: -20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -20 }} transition={{ duration: 0.15 }} className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-surface shadow-2xl" role="dialog" aria-modal="true" aria-label="Command menu">
          <div className="flex items-center border-b border-white/5 px-4 py-3">
            <Search className="mr-3 h-5 w-5 text-muted" />
            <input autoFocus value={search} onChange={event => setSearch(event.target.value)} placeholder="Type a command or search..." className="flex-1 border-none bg-transparent text-lg text-text outline-none placeholder:text-muted" aria-label="Search commands" />
            <span className="rounded bg-white/5 px-2 py-1 font-mono text-[10px] text-muted">ESC</span>
          </div>
          <div className="max-h-[60vh] overflow-y-auto p-2">
            {filtered.length === 0 ? <div className="p-4 text-center text-sm text-muted">No results found.</div> : (
              <div className="space-y-1">
                {recentActions.length > 0 && <>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-muted"><Clock className="h-3 w-3" /> Recent</div>
                  {recentActions.map(action => <button key={`recent-${action.id}`} onClick={() => handleSelect(action.path)} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-text transition-colors hover:bg-white/5"><action.icon className="h-4 w-4 text-accent/70" /><span className="flex-1">{action.name}</span><span className="text-[10px] text-muted/60">{action.group}</span></button>)}
                  <div className="my-2 border-t border-white/5" />
                </>}
                {filtered.map(action => <button key={action.id} onClick={() => handleSelect(action.path)} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-text transition-colors hover:bg-white/5"><action.icon className="h-4 w-4 text-muted" /><span className="flex-1">{action.name}</span><span className="text-[10px] text-muted/60">{action.group}</span></button>)}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
