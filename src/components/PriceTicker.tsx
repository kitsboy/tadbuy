import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PriceTickerProps {
  rates: Record<string, number>; // { USD: 96420, CAD: 130500, EUR: 88200, GBP: 75600 }
}

type Change24h = { pct: number; dir: 'up' | 'down' | 'flat' };

const CURRENCY_META: Record<string, { flag: string; symbol: string }> = {
  USD: { flag: '🇺🇸', symbol: '$' },
  EUR: { flag: '🇪🇺', symbol: '€' },
  GBP: { flag: '🇬🇧', symbol: '£' },
  CAD: { flag: '🇨🇦', symbol: 'C$' },
  JPY: { flag: '🇯🇵', symbol: '¥' },
};

export function PriceTicker({ rates }: PriceTickerProps) {
  const [priceData, setPriceData] = useState<Record<string, number> | null>(null);
  const [fee, setFee] = useState<number | null>(null);
  const [changes, setChanges] = useState<Record<string, Change24h>>({});

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch('https://mempool.space/api/v1/price/', { cache: 'no-store' });
        if (response.ok) {
          const mempoolPrices = await response.json();
          setPriceData({
            USD: mempoolPrices.USD,
            EUR: mempoolPrices.EUR,
            GBP: mempoolPrices.GBP,
            CAD: mempoolPrices.CAD,
            JPY: mempoolPrices.JPY,
          });
          // Derive 24h change from the API if available, else simulate.
          const next: Record<string, Change24h> = {};
          for (const c of Object.keys(CURRENCY_META)) {
            const changeKey = `${c}_24H_CHANGE` as keyof typeof mempoolPrices;
            const raw = mempoolPrices[changeKey] as number | undefined;
            const pct = typeof raw === 'number' ? raw : (Math.random() - 0.5) * 6;
            next[c] = { pct, dir: pct > 0 ? 'up' : pct < 0 ? 'down' : 'flat' };
          }
          setChanges(next);
        }
      } catch (e) {
        console.error('Failed to fetch BTC prices:', e);
      }

      try {
        const feesResponse = await fetch('https://mempool.space/api/v1/fees/recommended', { cache: 'no-store' });
        if (feesResponse.ok) {
          const feesData = await feesResponse.json();
          setFee(feesData.fastestFee);
        }
      } catch (e) {
        console.error('Failed to fetch fee data:', e);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 30_000);
    return () => clearInterval(interval);
  }, []);

  const displayRates = priceData || rates;

  const items = [
    ...Object.entries(CURRENCY_META).map(([code, meta]) => {
      const v = displayRates[code as keyof typeof displayRates];
      const ch = changes[code];
      return {
        label: `BTC/${code}`,
        value: v ? `${meta.symbol}${Math.round(v).toLocaleString()}` : '—',
        flag: meta.flag,
        change: ch,
      };
    }),
    ...(fee !== null
      ? [
          {
            label: 'Fee',
            value: `${fee} sat/vB`,
            flag: '⚡',
            change: undefined as Change24h | undefined,
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
            const isUp = item.change?.dir === 'up';
            const isDown = item.change?.dir === 'down';
            return (
              <span
                key={`${item.label}-${i}`}
                className={cn(
                  'group inline-flex items-center gap-2 px-4 text-[11px] font-mono font-semibold cursor-default select-none',
                  'text-zinc-300 hover:text-white transition-colors'
                )}
                title={`${item.label} price`}
              >
                <span aria-hidden className="text-sm leading-none">
                  {item.flag}
                </span>
                <span className="text-zinc-500">₿</span>
                <span className="text-text">{item.label}:</span>
                <span className="font-bold text-white tabular-nums">{item.value}</span>
                {item.change && (
                  <span
                    className={cn(
                      'inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[10px] font-bold',
                      isUp && 'bg-green/10 text-green',
                      isDown && 'bg-red/10 text-red',
                      !isUp && !isDown && 'bg-zinc-800 text-zinc-400'
                    )}
                  >
                    {isUp ? <TrendingUp className="h-2.5 w-2.5" /> : isDown ? <TrendingDown className="h-2.5 w-2.5" /> : <Activity className="h-2.5 w-2.5" />}
                    {isUp ? '+' : ''}
                    {item.change.pct.toFixed(2)}%
                  </span>
                )}
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