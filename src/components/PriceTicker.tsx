import { useEffect, useState } from 'react';

interface PriceTickerProps {
  rates: Record<string, number>; // { USD: 96420, CAD: 130500, EUR: 88200, GBP: 75600 }
}

export function PriceTicker({ rates }: PriceTickerProps) {
  const [priceData, setPriceData] = useState<Record<string, number> | null>(null);
  const [fee, setFee] = useState<number | null>(null);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        // Fetch Bitcoin price from mempool.space API
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
        }
      } catch (e) {
        console.error('Failed to fetch BTC prices:', e);
      }

      // Fetch fee data
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
    const interval = setInterval(fetchPrices, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const displayRates = priceData || rates;

  const items = [
    { label: '₿ BTC/USD', value: `$${displayRates.USD?.toLocaleString()}` },
    { label: '₿ BTC/EUR', value: `€${displayRates.EUR?.toLocaleString()}` },
    { label: '₿ BTC/GBP', value: `£${displayRates.GBP?.toLocaleString()}` },
    { label: '₿ BTC/CAD', value: `C$${displayRates.CAD?.toLocaleString()}` },
    { label: '₿ BTC/JPY', value: `¥${displayRates.JPY?.toLocaleString()}` },
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
        .ticker-wrap:hover .ticker-track { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) {
          .ticker-track { animation: none; }
        }
      `}</style>
      <div
        className="ticker-wrap h-7 overflow-hidden flex items-center border-b border-border"
        style={{ backgroundColor: '#27272a' }}
        aria-label="Live Bitcoin price ticker"
        role="marquee"
      >
        <div className="ticker-track flex items-center whitespace-nowrap">
          {allItems.map((item, i) => (
            <span
              key={`${item.label}-${i}`}
              className="mx-4 text-xs font-mono font-semibold text-zinc-400 hover:text-accent transition-colors cursor-default select-none"
              title={item.label}
            >
              {item.label}: {item.value}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}