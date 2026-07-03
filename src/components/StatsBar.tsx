import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface Stat {
  label: string;
  value: string;
  suffix?: string;
}

const STATS: Stat[] = [
  { label: 'Campaigns Launched', value: '12,847', suffix: '+' },
  { label: 'Sats Processed', value: '4.2', suffix: 'B+' },
  { label: 'Publishers', value: '340', suffix: '+' },
  { label: 'Avg Settlement', value: '<1', suffix: 's' },
];

export function StatsBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 10 }}
      transition={{ duration: 0.4 }}
      className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-xl overflow-hidden mb-8 border border-border"
    >
      {STATS.map((stat, i) => (
        <div
          key={stat.label}
          className="bg-card px-4 py-5 text-center hover:bg-surface/80 transition-colors"
          style={{ animationDelay: `${i * 80}ms` }}
        >
          <div className="text-xl md:text-2xl font-extrabold tracking-tight text-accent font-mono">
            {stat.value}
            {stat.suffix && <span className="text-sm text-muted">{stat.suffix}</span>}
          </div>
          <div className="text-[10px] md:text-xs text-muted font-bold uppercase tracking-widest mt-1">
            {stat.label}
          </div>
        </div>
      ))}
    </motion.div>
  );
}