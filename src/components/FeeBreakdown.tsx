import { Info } from 'lucide-react';
import { Card } from '@/components/ui';
import { PLATFORM_FEE_RATE } from '@/data/platforms';
import { formatSats } from '@/lib/utils';

type FeeBreakdownProps = {
  budgetSats: number;
  budgetUsd?: number;
  currencySymbol?: string;
  compact?: boolean;
  className?: string;
};

export function FeeBreakdown({
  budgetSats,
  budgetUsd,
  currencySymbol = '$',
  compact = false,
  className,
}: FeeBreakdownProps) {
  const feeSats = Math.round(budgetSats * PLATFORM_FEE_RATE);
  const mediaSats = budgetSats - feeSats;
  const feeUsd = budgetUsd != null ? budgetUsd * PLATFORM_FEE_RATE : undefined;
  const mediaUsd = budgetUsd != null && feeUsd != null ? budgetUsd - feeUsd : undefined;

  if (compact) {
    return (
      <p className={`text-[10px] text-muted font-mono ${className ?? ''}`}>
        {formatSats(mediaSats)} media · {formatSats(feeSats)} fee ({(PLATFORM_FEE_RATE * 100).toFixed(0)}%)
      </p>
    );
  }

  return (
    <Card className={`glass-panel tadbuy-jewel-card ${className ?? ''}`}>
      <div className="flex items-center gap-2 mb-3">
        <Info className="w-4 h-4 text-accent" />
        <span className="text-xs font-bold text-text" data-tip="Exactly where your sats go — shown in full, no hidden margins. Media spend buys impressions; the fee covers routing, support, and Bitcoin infrastructure.">
          Fee breakdown
        </span>
      </div>
      <div className="space-y-2 text-xs">
        <div className="flex justify-between">
          <span className="text-muted">Media spend</span>
          <span className="font-mono text-text">
            {formatSats(mediaSats)}
            {mediaUsd != null && <span className="text-muted ml-1">({currencySymbol}{mediaUsd.toFixed(2)})</span>}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted">Tadbuy platform fee ({(PLATFORM_FEE_RATE * 100).toFixed(0)}%)</span>
          <span className="font-mono text-accent">
            {formatSats(feeSats)}
            {feeUsd != null && <span className="text-muted ml-1">({currencySymbol}{feeUsd.toFixed(2)})</span>}
          </span>
        </div>
        <div className="border-t border-border pt-2 flex justify-between font-bold">
          <span className="text-text">Total</span>
          <span className="font-mono text-text">
            {formatSats(budgetSats)}
            {budgetUsd != null && <span className="text-muted ml-1">({currencySymbol}{budgetUsd.toFixed(2)})</span>}
          </span>
        </div>
      </div>

      {/* Interactive split graph — where your sats go, at a glance */}
      <div
        className="tadbuy-split-graph"
        role="img"
        aria-label={`Media spend ${mediaSats} sats, platform fee ${feeSats} sats`}
      >
        <div
          className="tadbuy-split-graph__bar"
          data-tip={`Media spend: ${formatSats(mediaSats)} sats${mediaUsd != null ? ` (${currencySymbol}${mediaUsd.toFixed(2)})` : ''} — this is the part that actually buys your impressions.`}
        >
          <div className="tadbuy-split-graph__fill tadbuy-split-graph__fill--media" style={{ height: `${(mediaSats / budgetSats) * 100}%` }} />
        </div>
        <div
          className="tadbuy-split-graph__bar"
          data-tip={`Platform fee: ${formatSats(feeSats)} sats (${(PLATFORM_FEE_RATE * 100).toFixed(0)}%)${feeUsd != null ? ` (${currencySymbol}${feeUsd.toFixed(2)})` : ''} — the honest cost of routing, support, and Bitcoin infrastructure.`}
        >
          <div className="tadbuy-split-graph__fill tadbuy-split-graph__fill--fee" style={{ height: `${(feeSats / budgetSats) * 100}%` }} />
        </div>
        <div className="tadbuy-split-graph__legend">
          <div><span className="inline-block w-2 h-2 rounded-full mr-1.5 align-middle" style={{ background: '#f472b6' }} />Media</div>
          <div><span className="inline-block w-2 h-2 rounded-full mr-1.5 align-middle" style={{ background: '#facc15' }} />Fee</div>
          <strong>{formatSats(mediaSats)} / {formatSats(feeSats)}</strong>
        </div>
      </div>

      <p className="text-[10px] text-muted mt-3 leading-relaxed">
        No hidden margins. Publishers receive their rev-share from media spend; fee covers routing, support, and Bitcoin infrastructure.
      </p>
    </Card>
  );
}