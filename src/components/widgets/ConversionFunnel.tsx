import { useEffect, useState } from 'react';
import { Filter } from 'lucide-react';
import { Card, CardTitle } from '@/components/ui';
import { Alert } from '@/components/ui/Alert';
import { cn } from '@/lib/utils';

interface FunnelStep {
  name: string;
  count: number;
  dropoff: number;
}

interface FunnelData {
  steps: FunnelStep[];
  alert?: string;
}

export function ConversionFunnel({ className }: { className?: string }) {
  const [data, setData] = useState<FunnelData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v3/analytics/funnel')
      .then(r => r.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const maxCount = data?.steps[0]?.count ?? 1;

  return (
    <Card className={cn('glass-panel', className)}>
      <CardTitle className="flex items-center gap-2">
        <Filter className="w-4 h-4" /> Conversion Funnel
      </CardTitle>
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-8 bg-surface rounded-lg animate-pulse" />
          ))}
        </div>
      ) : data?.steps.length ? (
        <>
          <div className="space-y-3">
            {data.steps.map((step, i) => {
              const pct = (step.count / maxCount) * 100;
              return (
                <div key={step.name}>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-muted font-semibold">{step.name}</span>
                    <span className="font-mono tabular-nums">{step.count.toLocaleString()}</span>
                  </div>
                  <div className="h-3 bg-surface rounded-full overflow-hidden border border-border/50">
                    <div
                      className="h-full bg-gradient-to-r from-accent/80 to-accent rounded-full transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  {i > 0 && step.dropoff > 0 && (
                    <div className="text-[10px] text-red mt-1">−{step.dropoff}% dropoff</div>
                  )}
                </div>
              );
            })}
          </div>
          {data.alert && (
            <Alert variant="warning" title="Funnel alert" className="mt-4">
              {data.alert}
            </Alert>
          )}
        </>
      ) : (
        <p className="text-xs text-muted">No funnel data available.</p>
      )}
    </Card>
  );
}