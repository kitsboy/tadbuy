import { useEffect, useState } from 'react';
import { Slider } from '@/components/ui/Slider';

interface Fees { fastestFee: number; halfHourFee: number; hourFee: number; economyFee: number }

export function FeeEstimator({
  onFeeChange,
  className,
}: {
  onFeeChange?: (satPerVb: number) => void;
  className?: string;
}) {
  const [fees, setFees] = useState<Fees>({ fastestFee: 5, halfHourFee: 4, hourFee: 3, economyFee: 2 });
  const [custom, setCustom] = useState(5);

  useEffect(() => {
    fetch('https://mempool.space/api/v1/fees/recommended')
      .then(r => r.json())
      .then(setFees)
      .catch(() => {});
  }, []);

  useEffect(() => {
    onFeeChange?.(custom);
  }, [custom, onFeeChange]);

  const presets = [
    { label: 'Eco', value: fees.economyFee, time: '~1h' },
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
              custom === p.value
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
        value={custom}
        onChange={setCustom}
        label={`Custom feerate: ${custom} sat/vB`}
      />
      <p className="text-[10px] text-muted mt-2">
        Est. fee for 140 vB tx: ~{((custom * 140) / 100_000_000).toFixed(8)} ₿
        <span className="ml-2 text-accent">RBF enabled</span>
      </p>
    </div>
  );
}