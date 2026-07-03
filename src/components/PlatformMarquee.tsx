import { Twitter, Facebook, Instagram, Zap, Youtube, MessageSquare, Linkedin, Music } from 'lucide-react';

const PLATFORMS = [
  { name: 'Twitter/X', icon: Twitter, color: 'text-blue' },
  { name: 'Facebook', icon: Facebook, color: 'text-blue' },
  { name: 'Instagram', icon: Instagram, color: 'text-accent2' },
  { name: 'Nostr', icon: Zap, color: 'text-purple' },
  { name: 'YouTube', icon: Youtube, color: 'text-red' },
  { name: 'Reddit', icon: MessageSquare, color: 'text-accent' },
  { name: 'LinkedIn', icon: Linkedin, color: 'text-blue' },
  { name: 'TikTok', icon: Music, color: 'text-text' },
];

export function PlatformMarquee() {
  const items = [...PLATFORMS, ...PLATFORMS];

  return (
    <div className="mb-8 overflow-hidden rounded-xl border border-border bg-surface/30">
      <div className="px-4 py-2 border-b border-border">
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted">
          Deploy to 8 platforms
        </span>
      </div>
      <div className="relative h-12 flex items-center overflow-hidden group">
        <div className="marquee-track flex items-center gap-8 whitespace-nowrap">
          {items.map((p, i) => (
            <span key={`${p.name}-${i}`} className="flex items-center gap-2 text-sm font-semibold text-muted">
              <p.icon className={`w-4 h-4 ${p.color}`} />
              {p.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}