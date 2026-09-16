import { Receipt } from 'lucide-react';
import { formatSats } from '@/lib/utils';

interface FeeBreakdownProps {
  amountSats: number;
  className?: string;
}

export function FeeBreakdown({ amountSats, className }: FeeBreakdownProps) {
  // Fees are computed locally — the platform has no /api/payments/fees endpoint on
  // the static host, so no request is made. 15% platform fee is the stated rate.
  const platformFeeSats = Math.round(amountSats * 0.15);
  const fees = {
    amountSats,
    platformFeePct: 15,
    platformFeeSats,
    publisherSats: amountSats - platformFeeSats,
    totalSats: amountSats,
  };

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