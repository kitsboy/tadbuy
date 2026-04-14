import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Megaphone, Layers, BarChart2, Globe, Zap, Network, X } from 'lucide-react';
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
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const actions = [
    { id: 'buy', name: 'Buy Ads', icon: Megaphone, path: '/' },
    { id: 'market', name: 'Marketplace', icon: Globe, path: '/marketplace' },
    { id: 'campaigns', name: 'Campaigns', icon: Layers, path: '/campaigns' },
    { id: 'metrics', name: 'Metrics', icon: BarChart2, path: '/metrics' },
    { id: 'hubhash', name: 'Hubhash', icon: Network, path: '/hubhash' },
    { id: 'publisher', name: 'Publisher Portal', icon: Globe, path: '/publisher' },
  ];

  const filtered = actions.filter(action => 
    action.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (path: string) => {
    navigate(path);
    setIsOpen(false);
    setSearch('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] sm:pt-[20vh] px-4">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -20 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="relative w-full max-w-xl bg-surface border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="flex items-center px-4 py-3 border-b border-white/5">
              <Search className="w-5 h-5 text-muted mr-3" />
              <input 
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Type a command or search..."
                className="flex-1 bg-transparent border-none outline-none text-text placeholder:text-muted text-lg"
              />
              <div className="text-[10px] font-mono text-muted bg-white/5 px-2 py-1 rounded">ESC</div>
            </div>
            <div className="max-h-[60vh] overflow-y-auto p-2">
              {filtered.length === 0 ? (
                <div className="p-4 text-center text-muted text-sm">No results found.</div>
              ) : (
                <div className="space-y-1">
                  {filtered.map((action, index) => (
                    <button
                      key={action.id}
                      onClick={() => handleSelect(action.path)}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-left group"
                    >
                      <div className="bg-white/5 p-2 rounded-lg group-hover:bg-accent/20 group-hover:text-accent transition-colors">
                        <action.icon className="w-4 h-4" />
                      </div>
                      <span className="font-medium">{action.name}</span>
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
