import { useEffect, useState } from 'react';
import { Slider } from '@/components/ui/Slider';
import { cn } from '@/lib/utils';
import { ASSUMED_TX_VBYTES, useMempoolFees } from '@/hooks/useMempoolFees';

/**
 * On-chain fee picker for the "Pay with" step of the Buy Ads wizard.
 *
 * The preset rates come from the one live source (`useMempoolFees`), which is
 * `null` until a complete, positive mempool.space snapshot has been accepted.
 * The previous version initialised its own state to a hardcoded
 * `{ fastestFee: 5, halfHourFee: 4, hourFee: 3, economyFee: 2 }` and assigned
 * any JSON body straight from its own fetch, so with the fee host blocked the
 * buttons read "Turbo 5 sat/vB" and the line read "Est. fee for 140 vB tx:
 * ~0.00000700 ₿" — an invented rate presented as a measurement. When there is
 * no measurement the component now says so instead of showing numbers, and the
 * user can still type a custom rate once live rates are in.
 */
export function FeeEstimator({
  onFeeChange,
  className,
}: {
  onFeeChange?: (satPerVb: number) => void;
  className?: string;
}) {
  /** `null` until a complete snapshot is accepted — never a placeholder. */
  const fees = useMempoolFees();
  /** The user's own rate, or `null` while they have not picked one. */
  const [custom, setCustom] = useState<number | null>(null);

  /**
   * The rate actually in play: the user's choice if they made one, otherwise
   * the measured ~30m rate. `null` means we have no rate to offer — no
   * unmeasured number ever reaches the caller.
   */
  const activeFee = custom ?? fees?.hourFee ?? null;

  useEffect(() => {
    if (activeFee !== null) onFeeChange?.(activeFee);
  }, [activeFee, onFeeChange]);

  if (!fees || activeFee === null) {
    return (
      <div
        className={cn(
          'rounded-lg border border-border bg-surface/60 p-3 text-[11px] text-muted',
          className
        )}
      >
        Fee rates unavailable from mempool.space right now — pick a rate once live
        fees load. No estimate is shown for a rate we have not measured.
      </div>
    );
  }

  const presets = [
    { label: 'Eco', value: fees.economyFee ?? fees.hourFee, time: '~1h' },
    { label: 'Std', value: fees.hourFee, time: '~30m' },
    { label: 'Fast', value: fees.halfHourFee, time: '~15m' },
    { label: 'Turbo', value: fees.fastestFee, time: '~10m' },
  ];

  return (
    <div className={className}>
      <div className="flex flex-wrap gap-2 mb-3">
        {presets.map(p => (
          <button
            key={p.label}
            onClick={() => setCustom(p.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
              activeFee === p.value
                ? 'bg-accent/15 border-accent/40 text-accent'
                : 'border-border text-muted hover:text-text'
            }`}
          >
            {p.label} <span className="text-[10px] opacity-70">{p.value} sat/vB</span>
          </button>
        ))}
      </div>
      <Slider
        min={1}
        max={100}
        value={activeFee}
        onChange={setCustom}
        label={`Custom feerate: ${activeFee} sat/vB`}
      />
      <p className="text-[10px] text-muted mt-2">
        Est. fee for {ASSUMED_TX_VBYTES} vB tx: ~{((activeFee * ASSUMED_TX_VBYTES) / 100_000_000).toFixed(8)} ₿
        <span className="ml-2 text-accent">RBF enabled</span>
        <span className="ml-2">· rates from mempool.space (live)</span>
      </p>
    </div>
  );
}
