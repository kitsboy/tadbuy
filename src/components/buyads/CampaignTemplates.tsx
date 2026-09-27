import { Megaphone, ShoppingCart, RotateCcw } from 'lucide-react';
import { Card, CardTitle } from '@/components/ui';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

export interface CampaignTemplate {
  id: string;
  name: string;
  description: string;
  icon: 'awareness' | 'sales' | 'consideration';
  platforms: string[];
  budgetSats: number;
  headline: string;
  copy: string;
  hashtags?: string[];
}

const ICONS = {
  awareness: Megaphone,
  sales: ShoppingCart,
  consideration: RotateCcw,
} as const;

// Static local example copy only; applying a template creates no offer, audience,
// campaign, discount, tracking, payment, or provider-side delivery.
const TEMPLATES: CampaignTemplate[] = [
  {
    id: 'awareness',
    name: 'Brand Awareness',
    description: 'Example copy for an awareness concept · no reach estimate',
    icon: 'awareness',
    platforms: ['twitter', 'nostr', 'instagram'],
    budgetSats: 500_000,
    headline: 'Stack sats, not surveillance',
    copy: 'A sample message for a Bitcoin-native campaign concept. No audience or payment is connected.',
    hashtags: ['#bitcoin', '#nostr'],
  },
  {
    id: 'sales',
    name: 'Direct Sales',
    description: 'Example offer copy · no active discount or conversion goal',
    icon: 'sales',
    platforms: ['facebook', 'tiktok', 'reddit'],
    budgetSats: 750_000,
    headline: 'Explore a Bitcoin-native offer',
    copy: 'A sample promotional draft. No offer, discount, deadline, or Lightning checkout is active.',
    hashtags: ['#sats', '#deal'],
  },
  {
    id: 'follow_up',
    name: 'Follow-up concept',
    description: 'Example follow-up message · no visitor tracking',
    icon: 'consideration',
    platforms: ['twitter', 'facebook', 'nostr'],
    budgetSats: 300_000,
    headline: 'Discover the Bitcoin-native option',
    copy: 'An example follow-up message for an audience you reach through your own channels. This preview does not track visitors or connect to a purchase flow.',
    hashtags: ['#bitcoin'],
  },
];

interface CampaignTemplatesProps {
  onApply: (template: CampaignTemplate) => void;
  selectedId?: string | null;
}

export function CampaignTemplates({ onApply, selectedId }: CampaignTemplatesProps) {
  const templates = TEMPLATES;

  return (
    <Card className="glass-panel mb-4">
      <div className="flex items-center justify-between mb-3">
        <CardTitle className="mb-0">Example campaign drafts</CardTitle>
        <Badge variant="outline">Local examples</Badge>
      </div>
      <p className="text-xs text-muted mb-3">Choose a starting point for this browser-only draft. Platform selections and example budgets are not live inventory, offers, or quotes.</p>
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