import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, X, ChevronUp } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const ACTIVITIES = [
  { id: 1, text: "50k impressions bought on Nostr",          time: "Just now", amount: "0.002 ₿" },
  { id: 2, text: "New publisher joined: bitcoinmagazine.com", time: "2m ago",   amount: null       },
  { id: 3, text: "Campaign 'Sats for all' completed",         time: "5m ago",   amount: "0.015 ₿" },
  { id: 4, text: "10k clicks delivered on Damus",             time: "12m ago",  amount: null       },
];

const DEMO_EVENTS = [
  "New bid placed on Marketplace",
  "Campaign funded via Lightning",
  "50k impressions delivered on Nostr",
  "New publisher registered",
  "Settlement confirmed on-chain",
];

export default function LiveActivityWidget() {
  const [activities, setActivities] = useState(ACTIVITIES);
  const [isVisible, setIsVisible]   = useLocalStorage<boolean>('tadbuy_live_widget', true);
  const [mobileExpanded, setMobileExpanded] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const text = DEMO_EVENTS[Math.floor(Math.random() * DEMO_EVENTS.length)];
      const newActivity = {
        id: Date.now(),
        text,
        time: "Just now",
        amount: Math.random() > 0.5 ? `${(Math.random() * 0.005).toFixed(4)} ₿` : null,
      };
      setActivities(prev => [newActivity, ...prev].slice(0, 4));
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  const ActivityList = () => (
    <div className="space-y-3 relative">
      <div className="absolute left-[7px] top-2 bottom-2 w-px bg-white/10" />
      <AnimatePresence initial={false}>
        {activities.map(activity => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: 20, height: 0 }}
            animate={{ opacity: 1, x: 0, height: 'auto' }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative pl-6"
          >
            <div className="absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full bg-surface border-2 border-accent/50 flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-accent" />
            </div>
            <div className="text-sm font-medium leading-tight mb-1">{activity.text}</div>
            <div className="flex items-center gap-2 text-[10px] text-muted font-mono">
              <span>{activity.time}</span>
              {activity.amount && (
                <>
                  <span className="w-1 h-1 rounded-full bg-white/20" />
                  <span className="text-green font-bold">{activity.amount}</span>
                </>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );

  const Header = ({ onClose }: { onClose: () => void }) => (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-accent">
        <div className="w-2 h-2 rounded-full bg-accent animate-pulse shadow-[0_0_8px_rgba(247,147,26,0.8)]" />
        Live Network Pulse
      </div>
      <button onClick={onClose} className="text-muted hover:text-text transition-colors">
        <X className="w-4 h-4" />
      </button>
    </div>
  );

  return (
    <>
      {/* ── Desktop widget (bottom-right) ── */}
      <div className="fixed bottom-6 right-6 z-40 w-80 hidden lg:block">
        <div className="glass-panel rounded-2xl p-4 shadow-2xl">
          <Header onClose={() => setIsVisible(false)} />
          <ActivityList />
        </div>
      </div>

      {/* ── Mobile widget (bottom bar, collapsible) ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden">
        <AnimatePresence>
          {mobileExpanded && (
            <motion.div
              key="mobile-expanded"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="glass-panel border-t border-border p-4 overflow-hidden"
            >
              <ActivityList />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tap bar */}
        <button
          onClick={() => setMobileExpanded(v => !v)}
          className="w-full flex items-center justify-between px-5 py-3 bg-[#18181b]/90 backdrop-blur-xl border-t border-white/10 shadow-2xl"
        >
          <div className="flex items-center gap-2 text-xs font-bold text-accent">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <Zap className="w-3.5 h-3.5" />
            Live Network Pulse
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-muted font-mono">{activities[0]?.text.slice(0, 28)}…</span>
            <ChevronUp className={`w-4 h-4 text-muted transition-transform ${mobileExpanded ? 'rotate-180' : ''}`} />
          </div>
        </button>
      </div>
    </>
  );
}
