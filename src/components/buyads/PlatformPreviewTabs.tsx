import { useState, type ReactNode } from 'react';
import { Card, CardTitle } from '@/components/ui';
import { cn } from '@/lib/utils';

interface AdVariant {
  id: string;
  headline: string;
  description: string;
  url: string;
  bgHue: number;
  bgLightness: number;
  textColor: string;
  hashtags: string[];
}

interface PlatformPreviewTabsProps {
  platforms: Array<{ id: string; name: string; icon: ReactNode; cpm: number }>;
  variants: AdVariant[];
  adImage: string | null;
}

export function PlatformPreviewTabs({ platforms, variants, adImage }: PlatformPreviewTabsProps) {
  const [activeId, setActiveId] = useState(platforms[0]?.id ?? '');

  if (!platforms.length) {
    return (
      <Card className="glass-panel">
        <CardTitle>Creative mockup</CardTitle>
        <p className="text-xs text-muted mt-2">Select a platform concept to view a local creative mockup.</p>
      </Card>
    );
  }

  const active = platforms.find(p => p.id === activeId) ?? platforms[0];
  const variant = variants[0];

  return (
    <Card className="glass-panel">
      <CardTitle className="mb-1">Creative mockup · {active.name}</CardTitle>
      <p className="mb-3 text-[10px] text-muted">Illustrative layout only · not formatted for or delivered to the selected platform.</p>
      <div className="flex flex-wrap gap-1.5 mb-4 border-b border-border pb-3">
        {platforms.map(p => (
          <button
            key={p.id}
            type="button"
            onClick={() => setActiveId(p.id)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all',
              active.id === p.id
                ? 'bg-accent/15 text-accent border border-accent/40'
                : 'text-muted hover:text-text hover:bg-surface border border-transparent'
            )}
          >
            <span className="w-4 h-4 [&>svg]:w-4 [&>svg]:h-4">{p.icon}</span>
            {p.name}
          </button>
        ))}
      </div>
      <div className="space-y-4">
        {variants.map(v => (
          <div key={v.id} className="space-y-2">
            {variants.length > 1 && (
              <div className="text-[10px] font-bold text-accent uppercase tracking-widest">Variant {v.id}</div>
            )}
            <div
              className="rounded-xl p-4 min-h-[120px] relative overflow-hidden shadow-inner border border-border transition-colors duration-200"
              style={{ backgroundColor: `hsl(${v.bgHue}, 40%, ${v.bgLightness}%)`, color: v.textColor }}
            >
              <div className="absolute top-2 right-2 bg-black/10 rounded text-[9px] px-1.5 py-0.5 font-bold tracking-wider uppercase opacity-70">
                Sponsored · mockup
              </div>
              <div className="text-[10px] mb-2 flex items-center gap-1.5 opacity-80">
                <span className="w-4 h-4 [&>svg]:w-4 [&>svg]:h-4">{active.icon}</span>
                <strong>Sample advertiser</strong>
                <span className="opacity-70">Preview · {active.name}</span>
              </div>
              <div className="text-[15px] font-bold mb-1 leading-tight">{v.headline || 'Your Headline Here'}</div>
              <div className="text-[13px] leading-relaxed opacity-90">{v.description || 'Your description will appear here.'}</div>
              {adImage && (
                <div className="mt-3 rounded-lg overflow-hidden border border-black/10">
                  <img src={adImage} alt="Local creative mockup" className="w-full h-auto object-cover max-h-[200px]" />
                </div>
              )}
              {v.hashtags.length > 0 && (
                <div className="text-[12px] mt-2 font-medium opacity-80" style={{ color: v.textColor }}>
                  {v.hashtags.join(' ')}
                </div>
              )}
              <div className="text-[11px] mt-3 font-medium opacity-80" style={{ color: v.textColor }}>
                🔗 {v.url.replace(/^https?:\/\//, '') || 'example.com'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}