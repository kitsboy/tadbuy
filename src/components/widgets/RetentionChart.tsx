import { Users } from 'lucide-react';
import { Card, CardTitle } from '@/components/ui';
import { cn } from '@/lib/utils';

interface Cohort {
  week: string;
  retention: number[];
}

const PERIOD_LABELS = ['D0', 'D7', 'D14', 'D21', 'D28'];

// Labelled demo sample — no analytics backend on the static host; no request is made.
const SAMPLE: Cohort[] = [
  { week: 'W1', retention: [100, 62, 48, 41, 37] },
  { week: 'W2', retention: [100, 58, 44, 38, 34] },
  { week: 'W3', retention: [100, 61, 45, 39, 33] },
  { week: 'W4', retention: [100, 57, 43, 36, 30] },
];

export function RetentionChart({ className }: { className?: string }) {
  const cohorts = SAMPLE;

  return (
    <Card className={cn('glass-panel', className)}>
      <CardTitle className="flex items-center gap-2">
        <Users className="w-4 h-4" /> Cohort Retention
      </CardTitle>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-muted text-[10px] uppercase tracking-wider">
              <th className="text-left py-2 pr-3 font-bold">Cohort</th>
              {PERIOD_LABELS.map(l => (
                <th key={l} className="text-center py-2 px-1 font-bold">{l}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cohorts.map(c => (
              <tr key={c.week} className="border-t border-border/50">
                <td className="py-2 pr-3 font-bold text-text">{c.week}</td>
                {c.retention.map((pct, i) => (
                  <td key={i} className="py-2 px-1 text-center">
                    <span
                      className="inline-block min-w-[2.5rem] px-1.5 py-1 rounded font-mono font-bold"
                      style={{
                        backgroundColor: `rgba(255, 159, 28, ${pct / 120})`,
                        color: pct > 50 ? '#000' : '#e4e4e7',
                      }}
                    >
                      {pct}%
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[10px] text-muted mt-3">
        Demo sample — live cohort analytics connect once the API is online.
      </p>
    </Card>
  );
}