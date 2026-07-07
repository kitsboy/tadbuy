import { useEffect, useState } from 'react';
import { Zap, Bitcoin, Shield, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

interface RailRecommendation {
  id: string;
  name: string;
  reason: string;
  settlement: string;
  recommended: boolean;
}

interface PaymentRailPickerProps {
  budgetSats: number;
  selected?: string;
  onSelect?: (railId: string) => void;
}

const RAIL_ICONS: Record<string, typeof Zap> = {
  lightning: Zap,
  onchain: Bitcoin,
  fedimint: Shield,
  bolt12: Zap,
};

export function PaymentRailPicker({ budgetSats, selected, onSelect }: PaymentRailPickerProps) {
  const [rails, setRails] = useState<RailRecommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/payments/recommend?budgetSats=${budgetSats}`)
      .then(r => r.json())
      .then(d => setRails(d.rails ?? []))
      .catch(() => {
        const sats = budgetSats || 100_000;
        setRails([
          {
            id: 'lightning',
            name: 'Lightning',
            reason: sats < 1_000_000 ? 'Best for sub-1M sats — instant settlement' : 'Fast for smaller campaigns',
            settlement: 'instant',
            recommended: sats < 1_000_000,
          },
          {
            id: 'fedimint',
            name: 'Fedimint Ecash',
            reason: 'Privacy-preserving ecash for micro-budgets',
            settlement: 'instant',
            recommended: sats < 100_000,
          },
          {
            id: 'onchain',
            name: 'On-chain BTC',
            reason: sats >= 1_000_000 ? 'Recommended for large budgets' : 'Higher fees — use for 1M+ sats',
            settlement: '~10 min',
            recommended: sats >= 1_000_000,
          },
        ]);
      })
      .finally(() => setLoading(false));
  }, [budgetSats]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-xs text-muted py-2">
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
        Finding best payment rail…
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="text-[10px] font-bold text-muted uppercase tracking-wider">Recommended payment rail</div>
      <div className="grid grid-cols-1 gap-2">
        {rails.map(rail => {
          const Icon = RAIL_ICONS[rail.id] ?? Zap;
          const isSelected = selected === rail.id;
          return (
            <button
              key={rail.id}
              type="button"
              onClick={() => onSelect?.(rail.id)}
              className={cn(
                'flex items-start gap-3 p-3 rounded-xl border text-left transition-all',
                isSelected || rail.recommended
                  ? 'border-accent/50 bg-accent/5'
                  : 'border-border bg-surface hover:border-muted'
              )}
            >
              <Icon className={cn('w-5 h-5 shrink-0 mt-0.5', rail.recommended ? 'text-accent' : 'text-muted')} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-text">{rail.name}</span>
                  {rail.recommended && <Badge variant="accent">Recommended</Badge>}
                </div>
                <p className="text-[11px] text-muted mt-0.5">{rail.reason}</p>
                <span className="text-[10px] text-muted">{rail.settlement}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}