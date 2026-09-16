import { Globe } from 'lucide-react';
import { Card, CardTitle } from '@/components/ui';
import { cn } from '@/lib/utils';

interface Region {
  code: string;
  name: string;
  intensity: number;
  impressions: number;
}

// Labelled demo sample — no analytics backend on the static host; no request is made.
const SAMPLE: Region[] = [
  { code: 'US', name: 'United States', intensity: 0.92, impressions: 182000 },
  { code: 'DE', name: 'Germany', intensity: 0.7, impressions: 96000 },
  { code: 'BR', name: 'Brazil', intensity: 0.58, impressions: 61000 },
  { code: 'JP', name: 'Japan', intensity: 0.5, impressions: 48000 },
  { code: 'GB', name: 'United Kingdom', intensity: 0.44, impressions: 39000 },
  { code: 'CA', name: 'Canada', intensity: 0.38, impressions: 31000 },
  { code: 'IN', name: 'India', intensity: 0.3, impressions: 22000 },
  { code: 'AU', name: 'Australia', intensity: 0.26, impressions: 18000 },
];

/** CSS grid heatmap — no D3 required. */
export function GeoHeatmap({ className }: { className?: string }) {
  const regions = SAMPLE;

  return (
    <Card className={cn('glass-panel', className)}>
      <CardTitle className="flex items-center gap-2">
        <Globe className="w-4 h-4" /> Geo Heatmap
      </CardTitle>
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
      <p className="text-[10px] text-muted mt-3">
        Demo sample — live geo analytics connect once the API is online.
      </p>
    </Card>
  );
}