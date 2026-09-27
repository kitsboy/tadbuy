import { Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ASSUMED_TX_VBYTES, useMempoolFees } from '@/hooks/useMempoolFees';

interface MempoolFeeTipProps {
  className?: string;
}

/** Public on-chain fee reference for planning; this preview does not accept payments. */
export function MempoolFeeTip({ className }: MempoolFeeTipProps) {
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

  return (
    <div
      className={cn(
        'rounded-lg border p-3 text-xs flex items-start gap-2.5',
        'bg-accent/5 border-accent/20 text-accent',
        className
      )}
    >
      <Info className="w-4 h-4 shrink-0 mt-0.5" />
      <div className="space-y-1">
        <p className="font-semibold leading-snug">
          Public on-chain fee reference · planning only
        </p>
        <p className="text-[10px] opacity-90 font-mono">
          {fees && estOnChainFeeBtc !== null
            ? `Public rates: eco ${fees.economyFee ?? fees.hourFee} · standard ${fees.hourFee} · fast ${fees.halfHourFee} · fastest ${fees.fastestFee} sat/vB · assumed ${ASSUMED_TX_VBYTES} vB fee ${estOnChainFeeBtc.toFixed(8)} ₿; not a quote or payment estimate.`
            : 'Fee rates unavailable from mempool.space right now'}
        </p>
      </div>
    </div>
  );
}
