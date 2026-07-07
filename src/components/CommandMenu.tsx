import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, Megaphone, Layers, BarChart2, Globe, Zap, Network, X, Brain, Plug, Shield,
  FlaskConical, Presentation, Wallet, MapPin, FileText, Code2, Receipt, BookOpen, Target,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CommandMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const actions = [
    { id: 'buy', name: 'Buy Ads', icon: Megaphone, path: '/', group: 'Campaigns' },
    { id: 'market', name: 'Marketplace', icon: Globe, path: '/marketplace', group: 'Campaigns' },
    { id: 'campaigns', name: 'Campaigns', icon: Layers, path: '/campaigns', group: 'Campaigns' },
    { id: 'metrics', name: 'Metrics', icon: BarChart2, path: '/metrics', group: 'Analytics' },
    { id: 'geo', name: 'Global Reach', icon: MapPin, path: '/geo', group: 'Analytics' },
    { id: 'analytics', name: 'Campaign Analytics', icon: Target, path: '/analytics', group: 'Analytics' },
    { id: 'wallet', name: 'Wallet', icon: Wallet, path: '/wallet', group: 'Payments' },
    { id: 'settlements', name: 'Settlements', icon: Receipt, path: '/settlements', group: 'Payments' },
    { id: 'hubhash', name: 'Hubhash', icon: Network, path: '/hubhash', group: 'Tools' },
    { id: 'publisher', name: 'Publisher Portal', icon: Globe, path: '/publisher', group: 'Publisher' },
    { id: 'api', name: 'API Reference', icon: Code2, path: '/api-reference', group: 'Developer' },
    { id: 'docs', name: 'Documentation', icon: BookOpen, path: '/docs', group: 'Developer' },
    { id: 'pitch', name: 'Investor Pitch', icon: Presentation, path: '/pitch', group: 'Info' },
    { id: 'beta', name: 'BETA Status', icon: FlaskConical, path: '/beta', group: 'Info' },
    { id: 'intel', name: 'PPQ Intelligence', icon: Brain, path: '/intelligence', group: 'Info' },
    { id: 'integrations', name: 'Integrations', icon: Plug, path: '/integrations', group: 'Info' },
    { id: 'enterprise', name: 'Enterprise', icon: Shield, path: '/enterprise', group: 'Info' },
    { id: 'dashboard', name: 'Dashboard', icon: BarChart2, path: '/dashboard', group: 'Campaigns' },
    { id: 'bolt12', name: 'BOLT12 Info', icon: Zap, path: '/bolt12', group: 'Payments' },
    { id: 'ppq', name: 'PPQ Guide', icon: FileText, path: '/ppq', group: 'Info' },
  ];

  const filtered = actions.filter(a => a.name.toLowerCase().includes(search.toLowerCase()));

  const handleSelect = (path: string) => {
    navigate(path);
    setIsOpen(false);
    setSearch('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] sm:pt-[20vh] px-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/85" onClick={() => setIsOpen(false)} />
          <motion.div initial={{ opacity: 0, scale: 0.95, y: -20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }} transition={{ duration: 0.15 }}
            className="relative w-full max-w-xl bg-surface border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center px-4 py-3 border-b border-white/5">
              <Search className="w-5 h-5 text-muted mr-3" />
              <input autoFocus value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Type a command or search..."
                className="flex-1 bg-transparent border-none outline-none text-text placeholder:text-muted text-lg" />
              <div className="text-[10px] font-mono text-muted bg-white/5 px-2 py-1 rounded">ESC</div>
            </div>
            <div className="max-h-[60vh] overflow-y-auto p-2">
              {filtered.length === 0 ? (
                <div className="p-4 text-center text-muted text-sm">No results found.</div>
              ) : (
                <div className="space-y-1">
                  {filtered.map(action => (
                    <button key={action.id} onClick={() => handleSelect(action.path)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm font-medium text-text hover:bg-white/5 transition-colors">
                      <action.icon className="w-4 h-4 text-muted" />
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