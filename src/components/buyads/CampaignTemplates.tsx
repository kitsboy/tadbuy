import { useEffect, useState } from 'react';
import { Megaphone, ShoppingCart, RotateCcw, Loader2 } from 'lucide-react';
import { Card, CardTitle } from '@/components/ui';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

export interface CampaignTemplate {
  id: string;
  name: string;
  description: string;
  icon: 'awareness' | 'sales' | 'retargeting';
  platforms: string[];
  budgetSats: number;
  headline: string;
  copy: string;
  hashtags?: string[];
}

const ICONS = {
  awareness: Megaphone,
  sales: ShoppingCart,
  retargeting: RotateCcw,
} as const;

interface CampaignTemplatesProps {
  onApply: (template: CampaignTemplate) => void;
  selectedId?: string | null;
}

export function CampaignTemplates({ onApply, selectedId }: CampaignTemplatesProps) {
  const [templates, setTemplates] = useState<CampaignTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/campaigns/templates')
      .then(r => r.json())
      .then(d => setTemplates(d.templates ?? []))
      .catch(() => {
        setTemplates([
          {
            id: 'awareness',
            name: 'Brand Awareness',
            description: 'Maximize reach across social & Nostr',
            icon: 'awareness',
            platforms: ['twitter', 'nostr', 'instagram'],
            budgetSats: 500_000,
            headline: 'Stack sats, not surveillance',
            copy: 'Reach privacy-conscious audiences. Pay in Lightning.',
            hashtags: ['#bitcoin', '#nostr'],
          },
          {
            id: 'sales',
            name: 'Direct Sales',
            description: 'Conversion-focused with urgency',
            icon: 'sales',
            platforms: ['facebook', 'tiktok', 'reddit'],
            budgetSats: 750_000,
            headline: 'Get 20% off — pay with Bitcoin',
            copy: 'Limited-time offer. Lightning checkout in seconds.',
            hashtags: ['#sats', '#deal'],
          },
          {
            id: 'retargeting',
            name: 'Retargeting',
            description: 'Re-engage visitors who bounced',
            icon: 'retargeting',
            platforms: ['twitter', 'facebook', 'nostr'],
            budgetSats: 300_000,
            headline: 'Still thinking about it?',
            copy: 'Come back and complete your purchase with sats.',
            hashtags: ['#retarget'],
          },
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Card className="glass-panel mb-4">
        <div className="flex items-center gap-2 text-sm text-muted py-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading templates…
        </div>
      </Card>
    );
  }

  return (
    <Card className="glass-panel mb-4">
      <div className="flex items-center justify-between mb-3">
        <CardTitle className="mb-0">Campaign templates</CardTitle>
        <Badge variant="accent">Quick start</Badge>
      </div>
      <p className="text-xs text-muted mb-3">Pick a goal — we&apos;ll pre-fill platforms, budget, and copy.</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {templates.map(t => {
          const Icon = ICONS[t.icon] ?? Megaphone;
          const active = selectedId === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onApply(t)}
              className={cn(
                'text-left p-3 rounded-xl border-2 transition-all hover:border-accent/60',
                active ? 'border-accent bg-accent/10' : 'border-border bg-surface'
              )}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <Icon className={cn('w-4 h-4', active ? 'text-accent' : 'text-muted')} />
                <span className="text-xs font-bold text-text">{t.name}</span>
              </div>
              <p className="text-[10px] text-muted leading-snug">{t.description}</p>
            </button>
          );
        })}
      </div>
    </Card>
  );
}