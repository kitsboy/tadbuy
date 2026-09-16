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

// Labelled demo sample — no analytics backend on the static host; no request is made.
const SAMPLE: PlatformStat[] = [
  { id: 'web', name: 'Web', spendSats: 224000, impressions: 412000, ctr: 2.1, share: 52 },
  { id: 'nfc', name: 'NFC', spendSats: 118000, impressions: 184000, ctr: 3.4, share: 27 },
  { id: 'ln', name: 'Lightning', spendSats: 64000, impressions: 96000, ctr: 4.2, share: 15 },
  { id: 'fedimint', name: 'Fedimint', spendSats: 26000, impressions: 41000, ctr: 1.9, share: 6 },
];

export function PlatformBreakdown({ className }: { className?: string }) {
  const platforms = SAMPLE;
  const variants: Array<'accent' | 'green' | 'blue' | 'lightning'> = ['accent', 'green', 'blue', 'lightning'];

  return (
    <Card className={cn('glass-panel', className)}>
      <CardTitle className="flex items-center gap-2">
        <Layers className="w-4 h-4" /> Platform Breakdown
      </CardTitle>
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
      <p className="text-[10px] text-muted mt-3">
        Demo sample — live platform analytics connect once the API is online.
      </p>
    </Card>
  );
}