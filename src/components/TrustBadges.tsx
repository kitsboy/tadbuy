import { Shield, Zap, Eye, Lock } from 'lucide-react';

const BADGES = [
  { icon: Zap, label: 'Lightning Native', desc: 'Instant sats settlement' },
  { icon: Shield, label: 'No Banks', desc: 'Bitcoin-only payments' },
  { icon: Eye, label: 'Zero Pixels', desc: 'Privacy-first ads' },
  { icon: Lock, label: 'Self-Custody', desc: 'Your keys, your budget' },
];

export function TrustBadges() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
      {BADGES.map((badge) => (
        <div
          key={badge.label}
          className="flex items-center gap-3 p-3 rounded-xl border border-border/60 bg-surface/50 hover:border-accent/30 hover:bg-surface transition-all group"
        >
          <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0 group-hover:bg-accent/20 transition-colors">
            <badge.icon className="w-4 h-4 text-accent" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-text truncate">{badge.label}</div>
            <div className="text-[10px] text-muted truncate">{badge.desc}</div>
          </div>
        </div>
      ))}
    </div>
  );
}