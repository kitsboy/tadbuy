import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface PriceTickerProps {
  rates: Record<string, number>; // live BTC/fiat spot from mempool.space, via App
}

const CURRENCY_META: Record<string, { flag: string; symbol: string }> = {
  USD: { flag: '🇺🇸', symbol: '$' },
  EUR: { flag: '🇪🇺', symbol: '€' },
  GBP: { flag: '🇬🇧', symbol: '£' },
  CAD: { flag: '🇨🇦', symbol: 'C$' },
  JPY: { flag: '🇯🇵', symbol: '¥' },
};

export function PriceTicker({ rates }: PriceTickerProps) {
  const [fee, setFee] = useState<number | null>(null);

  useEffect(() => {
    const fetchFees = async () => {
      try {
        const feesResponse = await fetch('https://mempool.space/api/v1/fees/recommended', { cache: 'no-store' });
        if (feesResponse.ok) {
          const feesData = await feesResponse.json();
          setFee(feesData.fastestFee);
        }
      } catch {
        // Fees are optional chrome — omit the chip rather than invent a number.
      }
    };

    fetchFees();
    const interval = setInterval(fetchFees, 30_000);
    return () => clearInterval(interval);
  }, []);

  const items = [
    ...Object.entries(CURRENCY_META).map(([code, meta]) => {
      const v = rates[code];
      return {
        label: `BTC/${code}`,
        value: v && v > 0 ? `${meta.symbol}${Math.round(v).toLocaleString()}` : '—',
        flag: meta.flag,
        title: 'BTC spot from mempool.space (live)',
      };
    }),
    ...(fee !== null
      ? [
          {
            label: 'Fee',
            value: `${fee} sat/vB`,
            flag: '⚡',
            title: 'Fastest mempool fee from mempool.space (live)',
          },
        ]
      : []),
  ];

  // Duplicate for seamless loop
  const allItems = [...items, ...items];

  return (
    <>
      <style>{`
        @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .ticker-track { animation: ticker 45s linear infinite; will-change: transform; }
        .ticker-wrap:hover .ticker-track { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) { .ticker-track { animation: none; } }
      `}</style>
      <div
        className="ticker-wrap h-8 overflow-hidden flex items-center border-b border-white/5 bg-zinc-950/80 backdrop-blur"
        aria-label="Live Bitcoin price ticker"
        role="marquee"
      >
        <div className="ticker-track flex items-center whitespace-nowrap">
          {allItems.map((item, i) => {
            return (
              <span
                key={`${item.label}-${i}`}
                className={cn(
                  'group inline-flex items-center gap-2 px-4 text-[11px] font-mono font-semibold cursor-default select-none',
                  'text-zinc-300 hover:text-white transition-colors'
                )}
                title={item.title}
              >
                <span aria-hidden className="text-sm leading-none">
                  {item.flag}
                </span>
                <span className="text-zinc-500">₿</span>
                <span className="text-text">{item.label}:</span>
                <span className="font-bold text-white tabular-nums">{item.value}</span>
                {item.label === 'Fee' && (
                  <span className="text-[10px] text-amber-300">priority</span>
                )}
                <span className="mx-2 h-3 w-px bg-white/10" aria-hidden />
              </span>
            );
          })}
        </div>
      </div>
    </>
  );
}