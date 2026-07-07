import { useEffect, useState } from 'react';
import { Info, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MempoolFees {
  fastestFee: number;
  halfHourFee: number;
  hourFee: number;
  economyFee?: number;
}

interface MempoolFeeTipProps {
  budgetBtc?: number;
  paymentMethod?: string;
  className?: string;
}

/** Compact mempool fee tip for the budget step — suggests Lightning vs on-chain. */
export function MempoolFeeTip({ budgetBtc = 0, paymentMethod, className }: MempoolFeeTipProps) {
  const [fees, setFees] = useState<MempoolFees>({
    fastestFee: 5,
    halfHourFee: 4,
    hourFee: 3,
    economyFee: 2,
  });

  useEffect(() => {
    fetch('/api/mempool/fees')
      .then((r) => r.json())
      .then(setFees)
      .catch(() => {
        fetch('https://mempool.space/api/v1/fees/recommended')
          .then((r) => r.json())
          .then(setFees)
          .catch(() => {});
      });
  }, []);

  const estOnChainFeeBtc = ((fees.hourFee * 140) / 100_000_000);
  const budgetUsdApprox = budgetBtc * 100_000; // rough for tip only
  const suggestLightning = budgetUsdApprox < 50 && paymentMethod !== 'btc';

  return (
    <div
      className={cn(
        'rounded-lg border p-3 text-xs flex items-start gap-2.5',
        suggestLightning
          ? 'bg-lightning/5 border-lightning/20 text-lightning'
          : 'bg-accent/5 border-accent/20 text-accent',
        className
      )}
    >
      {suggestLightning ? (
        <Zap className="w-4 h-4 shrink-0 mt-0.5" />
      ) : (
        <Info className="w-4 h-4 shrink-0 mt-0.5" />
      )}
      <div className="space-y-1">
        <p className="font-semibold leading-snug">
          {suggestLightning
            ? 'Mempool is busy — Lightning skips on-chain fees entirely.'
            : 'On-chain fees from mempool.space'}
        </p>
        <p className="text-[10px] opacity-90 font-mono">
          Eco {fees.economyFee ?? 2} · Std {fees.hourFee} · Fast {fees.halfHourFee} · Turbo {fees.fastestFee} sat/vB
          {' · '}~{estOnChainFeeBtc.toFixed(8)} ₿ est. (140 vB)
        </p>
      </div>
    </div>
  );
}