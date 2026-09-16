import { Info, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ASSUMED_TX_VBYTES, useMempoolFees } from '@/hooks/useMempoolFees';

interface MempoolFeeTipProps {
  budgetBtc?: number;
  paymentMethod?: string;
  className?: string;
}

/** Compact mempool fee tip for the budget step — suggests Lightning vs on-chain. */
export function MempoolFeeTip({ budgetBtc = 0, paymentMethod, className }: MempoolFeeTipProps) {
  /**
   * `null` until a live fetch succeeds — a fee we have not measured must never
   * render as a fee we have.
   *
   * The old initial state was a hardcoded `5 / 4 / 3 / 2` and the first fetch
   * went to `/api/mempool/fees`, which on this static host answers
   * `404 application/json` — so `r.json()` *resolved* to `{error, message, hint}`
   * instead of throwing, the `.catch` fallback never ran, and the live budget
   * step rendered `Eco 2 · Std · Fast · Turbo sat/vB · ~NaN ₿ est. (140 vB)`.
   * One live source now (see `useMempoolFees`): mempool.space, the only
   * price/fee host our CSP allows.
   */
  const fees = useMempoolFees();

  const estOnChainFeeBtc = fees ? (fees.hourFee * ASSUMED_TX_VBYTES) / 100_000_000 : null;
  // Suggest Lightning when the on-chain fee is a real share of the budget.
  // Compared in BTC on purpose: no fiat price is invented to make the call.
  const feeShare =
    estOnChainFeeBtc !== null && budgetBtc > 0 ? estOnChainFeeBtc / budgetBtc : null;
  const suggestLightning = paymentMethod !== 'btc' && feeShare !== null && feeShare > 0.02;

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
          {suggestLightning && feeShare !== null
            ? `On-chain fees are ~${(feeShare * 100).toFixed(1)}% of this budget — Lightning skips them entirely.`
            : 'On-chain fees from mempool.space'}
        </p>
        <p className="text-[10px] opacity-90 font-mono">
          {fees && estOnChainFeeBtc !== null
            ? `Eco ${fees.economyFee ?? fees.hourFee} · Std ${fees.hourFee} · Fast ${fees.halfHourFee} · Turbo ${fees.fastestFee} sat/vB · ~${estOnChainFeeBtc.toFixed(8)} ₿ est. (${ASSUMED_TX_VBYTES} vB)`
            : 'Fee rates unavailable from mempool.space right now'}
        </p>
      </div>
    </div>
  );
}
