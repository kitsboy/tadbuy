import { useEffect, useState } from 'react';
import { Layers } from 'lucide-react';
import { Card, CardTitle } from '@/components/ui';
import { Progress } from '@/components/ui/Progress';
import { cn } from '@/lib/utils';

interface PlatformStat {
  id: string;
  name: string;
  spendSats: number;
  impressions: number;
  ctr: number;
  share: number;
}

export function PlatformBreakdown({ className }: { className?: string }) {
  const [platforms, setPlatforms] = useState<PlatformStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v3/analytics/platforms')
      .then(r => r.json())
      .then(d => setPlatforms(d.platforms ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const variants: Array<'accent' | 'green' | 'blue' | 'lightning'> = ['accent', 'green', 'blue', 'lightning'];

  return (
    <Card className={cn('glass-panel', className)}>
      <CardTitle className="flex items-center gap-2">
        <Layers className="w-4 h-4" /> Platform Breakdown
      </CardTitle>
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 bg-surface rounded-lg animate-pulse" />
          ))}
        </div>
      ) : platforms.length ? (
        <div className="space-y-4">
          {platforms.map((p, i) => (
            <div key={p.id}>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-bold">{p.name}</span>
                <span className="text-muted font-mono">
                  {p.ctr.toFixed(1)}% CTR · {p.share}% share
                </span>
              </div>
              <Progress
                value={p.share}
                variant={variants[i % variants.length]}
                showLabel={false}
              />
              <div className="flex justify-between text-[10px] text-muted mt-1">
                <span>{p.impressions.toLocaleString()} imp</span>
                <span>{p.spendSats.toLocaleString()} sats</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-muted">No platform data available.</p>
      )}
    </Card>
  );
}