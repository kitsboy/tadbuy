import { useEffect, useState } from 'react';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';

interface PricePoint { t: number; price: number }

export function BtcPriceChart({ className }: { className?: string }) {
  const [data, setData] = useState<PricePoint[]>([]);

  useEffect(() => {
    // CoinGecko market_chart lacks CORS headers for some egress IPs; Coinbase
    // exchange candles API is CORS-open and returns daily OHLCV.
    fetch('https://api.exchange.coinbase.com/products/BTC-USD/candles?granularity=86400')
      .then(r => r.json())
      .then(rows => {
        const points = (rows ?? []).slice(-8).map((row: number[]) => ({
          t: row[0],
          price: Math.round(row[4]),
        }));
        setData(points);
      })
      .catch(() => {});
  }, []);

  const latest = data[data.length - 1]?.price ?? 0;
  const first = data[0]?.price ?? latest;
  const change = first > 0 ? ((latest - first) / first) * 100 : 0;

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted">7D BTC</span>
        <span className={`text-[10px] font-mono font-bold ${change >= 0 ? 'text-green' : 'text-red'}`}>
          {change >= 0 ? '+' : ''}{change.toFixed(1)}%
        </span>
      </div>
      <div className="h-10">
      <ResponsiveContainer width="100%" height={40}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="btcGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff9f1c" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#ff9f1c" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Tooltip
            contentStyle={{ background: '#27272a', border: '1px solid #3f3f46', borderRadius: 8, fontSize: 11 }}
            formatter={(v: number) => [`$${v.toLocaleString()}`, 'BTC']}
            labelFormatter={() => ''}
          />
          <Area type="monotone" dataKey="price" stroke="#ff9f1c" fill="url(#btcGrad)" strokeWidth={1.5} dot={false} />
        </AreaChart>
      </ResponsiveContainer>
      </div>
    </div>
  );
}