import { useEffect, useState } from 'react';

interface PriceTickerProps {
  rates: Record<string, number>; // { USD: 96420, CAD: 130500, EUR: 88200, GBP: 75600 }
}

export function PriceTicker({ rates }: PriceTickerProps) {
  const [fee, setFee] = useState<number | null>(null);

  useEffect(() => {
    fetch('https://mempool.space/api/v1/fees/recommended')
      .then(r => r.json())
      .then(d => setFee(d.fastestFee))
      .catch(() => {});
  }, []);

  const items = [
    { label: 'BTC/USD', value: `$${Math.round(rates.USD).toLocaleString()}` },
    { label: 'BTC/EUR', value: `€${Math.round(rates.EUR).toLocaleString()}` },
    { label: 'BTC/GBP', value: `£${Math.round(rates.GBP).toLocaleString()}` },
    { label: 'BTC/CAD', value: `C$${Math.round(rates.CAD).toLocaleString()}` },
    ...(fee !== null ? [{ label: '⚡ Fee', value: `${fee} sat/vB` }] : []),
  ];

  // Duplicate for seamless loop
  const allItems = [...items, ...items];

  return (
    <>
      <style>{`
        @keyframes ticker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .ticker-track { animation: ticker 30s linear infinite; }
      `}</style>
      <div
        className="h-7 overflow-hidden flex items-center border-b border-border"
        style={{ backgroundColor: '#27272a' }}
      >
        <div className="ticker-track flex items-center whitespace-nowrap">
          {allItems.map((item, i) => (
            <span key={i} className="flex items-center gap-2 px-4 text-[11px] font-mono">
              <span style={{ color: '#a1a1aa' }}>{item.label}</span>
              <span style={{ color: '#ff9f1c' }} className="font-bold">{item.value}</span>
              <span style={{ color: '#3f3f46' }}>·</span>
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
