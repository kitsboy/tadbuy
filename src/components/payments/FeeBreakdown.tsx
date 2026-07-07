import { useEffect, useState } from 'react';
import { Loader2, Receipt } from 'lucide-react';
import { formatSats } from '@/lib/utils';

interface FeeBreakdownData {
  amountSats: number;
  platformFeePct: number;
  platformFeeSats: number;
  publisherSats: number;
  totalSats: number;
}

interface FeeBreakdownProps {
  amountSats: number;
  className?: string;
}

export function FeeBreakdown({ amountSats, className }: FeeBreakdownProps) {
  const [fees, setFees] = useState<FeeBreakdownData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!amountSats) return;
    setLoading(true);
    fetch(`/api/payments/fees?amountSats=${amountSats}`)
      .then(r => r.json())
      .then(setFees)
      .catch(() => {
        const platformFeeSats = Math.round(amountSats * 0.15);
        setFees({
          amountSats,
          platformFeePct: 15,
          platformFeeSats,
          publisherSats: amountSats - platformFeeSats,
          totalSats: amountSats,
        });
      })
      .finally(() => setLoading(false));
  }, [amountSats]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-xs text-muted py-2">
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
        Calculating fees…
      </div>
    );
  }

  if (!fees) return null;

  return (
    <div className={className}>
      <div className="flex items-center gap-2 mb-2">
        <Receipt className="w-4 h-4 text-accent" />
        <span className="text-[10px] font-bold text-muted uppercase tracking-wider">Fee breakdown</span>
      </div>
      <div className="space-y-1.5 text-left">
        <div className="flex justify-between text-xs">
          <span className="text-muted">Ad spend (to publishers)</span>
          <span className="font-mono font-bold text-text">{formatSats(fees.publisherSats)}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-muted">Tadbuy platform fee ({fees.platformFeePct}%)</span>
          <span className="font-mono font-bold text-accent">{formatSats(fees.platformFeeSats)}</span>
        </div>
        <div className="h-px bg-border my-1" />
        <div className="flex justify-between text-xs">
          <span className="font-bold text-text">Total</span>
          <span className="font-mono font-extrabold text-accent">{formatSats(fees.totalSats)}</span>
        </div>
      </div>
    </div>
  );
}