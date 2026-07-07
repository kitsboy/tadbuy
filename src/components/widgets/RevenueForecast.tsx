import { useEffect, useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardTitle } from '@/components/ui';
import { Badge } from '@/components/ui/Badge';
import { cn, formatSats } from '@/lib/utils';

interface ForecastPoint {
  month: string;
  actual?: number;
  forecast: number;
}

interface ForecastData {
  points: ForecastPoint[];
  growth: number;
  confidence: number;
  currency: string;
}

export function RevenueForecast({ className }: { className?: string }) {
  const [data, setData] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v3/analytics/forecast')
      .then(r => r.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <Card className={cn('glass-panel', className)}>
      <div className="flex items-center justify-between mb-4">
        <CardTitle className="mb-0 flex items-center gap-2">
          <TrendingUp className="w-4 h-4" /> Revenue Forecast
        </CardTitle>
        {data && (
          <Badge variant="success" dot>
            +{data.growth}% projected
          </Badge>
        )}
      </div>
      {loading ? (
        <div className="h-40 bg-surface rounded-lg animate-pulse" />
      ) : data?.points.length ? (
        <>
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <AreaChart data={data.points} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff9f1c" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#ff9f1c" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#6b6b8a" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis
                  stroke="#6b6b8a"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={v => formatSats(v)}
                />
                <Tooltip
                  contentStyle={{ background: '#16161f', border: '1px solid #2a2a3a', borderRadius: 8, fontSize: 11 }}
                  formatter={(v: number) => [`${formatSats(v)} sats`, 'Revenue']}
                />
                <Area
                  type="monotone"
                  dataKey="forecast"
                  stroke="#ff9f1c"
                  strokeWidth={2}
                  fill="url(#forecastGrad)"
                  strokeDasharray="4 4"
                />
                <Area type="monotone" dataKey="actual" stroke="#4ade80" strokeWidth={2} fill="none" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-between text-[10px] text-muted mt-3 pt-3 border-t border-border/50">
            <span>Confidence: <strong className="text-text">{data.confidence}%</strong></span>
            <span className="font-mono">Denominated in sats</span>
          </div>
        </>
      ) : (
        <p className="text-xs text-muted">No forecast data available.</p>
      )}
    </Card>
  );
}