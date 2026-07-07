import { useEffect, useState } from 'react';
import { Globe } from 'lucide-react';
import { Card, CardTitle } from '@/components/ui';
import { cn } from '@/lib/utils';

interface Region {
  code: string;
  name: string;
  intensity: number;
  impressions: number;
}

/** CSS grid heatmap — no D3 required. */
export function GeoHeatmap({ className }: { className?: string }) {
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v3/analytics/geo')
      .then(r => r.json())
      .then(d => setRegions(d.regions ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <Card className={cn('glass-panel', className)}>
      <CardTitle className="flex items-center gap-2">
        <Globe className="w-4 h-4" /> Geo Heatmap
      </CardTitle>
      {loading ? (
        <div className="grid grid-cols-4 gap-2">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="h-12 bg-surface rounded-lg animate-pulse" />
          ))}
        </div>
      ) : regions.length ? (
        <>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-4">
            {regions.map(r => (
              <div
                key={r.code}
                className="rounded-lg p-3 border border-border/50 text-center transition-transform hover:scale-105"
                style={{
                  backgroundColor: `rgba(255, 159, 28, ${0.15 + r.intensity * 0.65})`,
                }}
                title={`${r.name}: ${r.impressions.toLocaleString()} impressions`}
              >
                <div className="text-lg font-extrabold">{r.code}</div>
                <div className="text-[9px] text-muted truncate">{r.name}</div>
                <div className="text-[10px] font-mono font-bold mt-1">
                  {(r.intensity * 100).toFixed(0)}%
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 text-[10px] text-muted">
            <span>Low</span>
            <div className="flex-1 h-2 rounded-full bg-gradient-to-r from-surface via-accent/40 to-accent" />
            <span>High</span>
          </div>
        </>
      ) : (
        <p className="text-xs text-muted">No geo data available.</p>
      )}
    </Card>
  );
}