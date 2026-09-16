import { Filter } from 'lucide-react';
import { Card, CardTitle } from '@/components/ui';
import { Alert } from '@/components/ui/Alert';
import { cn } from '@/lib/utils';

interface FunnelStep {
  name: string;
  count: number;
  dropoff: number;
}

// Labelled demo sample — the platform has no analytics backend on the static host,
// so this widget renders representative numbers and never makes a request.
const SAMPLE: FunnelStep[] = [
  { name: 'Impressions', count: 48200, dropoff: 0 },
  { name: 'Clicks', count: 7320, dropoff: 84 },
  { name: 'Conversions', count: 1280, dropoff: 82 },
  { name: 'Completed', count: 940, dropoff: 26 },
];

export function ConversionFunnel({ className }: { className?: string }) {
  const maxCount = SAMPLE[0].count;

  return (
    <Card className={cn('glass-panel', className)}>
      <CardTitle className="flex items-center gap-2">
        <Filter className="w-4 h-4" /> Conversion Funnel
      </CardTitle>
      <div className="space-y-3">
        {SAMPLE.map((step, i) => {
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
      <Alert variant="info" title="Demo sample" className="mt-4">
        Representative figures. Live analytics connect once the platform API is online.
      </Alert>
    </Card>
  );
}