import { useState } from 'react';
import { cn } from '@/lib/utils';

type Unit = 'sats' | 'bits' | 'btc' | 'fiat';

const UNITS: { id: Unit; label: string }[] = [
  { id: 'sats', label: 'sats' },
  { id: 'bits', label: 'bits' },
  { id: 'btc', label: '₿' },
  { id: 'fiat', label: 'fiat' },
];

export function CurrencyDisplay({
  sats,
  btcRate,
  fiatSymbol = '$',
  className,
}: {
  sats: number;
  btcRate: number;
  fiatSymbol?: string;
  className?: string;
}) {
  const [unit, setUnit] = useState<Unit>('sats');

  const btc = sats / 100_000_000;
  const bits = sats / 100;
  const fiat = btc * btcRate;

  const display = {
    sats: `${sats.toLocaleString()} sats`,
    bits: `${bits.toLocaleString()} bits`,
    btc: `${btc.toFixed(8)} ₿`,
    fiat: `${fiatSymbol}${fiat.toFixed(2)}`,
  }[unit];

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className="font-mono font-bold text-accent">{display}</span>
      <div className="flex gap-0.5">
        {UNITS.map(u => (
          <button
            key={u.id}
            onClick={() => setUnit(u.id)}
            className={cn(
              'px-1.5 py-0.5 rounded text-[9px] font-bold transition-colors',
              unit === u.id ? 'bg-accent/20 text-accent' : 'text-muted hover:text-text'
            )}
          >
            {u.label}
          </button>
        ))}
      </div>
    </div>
  );
}