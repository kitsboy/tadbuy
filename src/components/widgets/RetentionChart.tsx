import { useEffect, useState } from 'react';
import { Users } from 'lucide-react';
import { Card, CardTitle } from '@/components/ui';
import { cn } from '@/lib/utils';

interface Cohort {
  week: string;
  retention: number[];
}

const PERIOD_LABELS = ['D0', 'D7', 'D14', 'D21', 'D28'];

export function RetentionChart({ className }: { className?: string }) {
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v3/analytics/retention')
      .then(r => r.json())
      .then(d => setCohorts(d.cohorts ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <Card className={cn('glass-panel', className)}>
      <CardTitle className="flex items-center gap-2">
        <Users className="w-4 h-4" /> Cohort Retention
      </CardTitle>
      {loading ? (
        <div className="h-32 bg-surface rounded-lg animate-pulse" />
      ) : cohorts.length ? (
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
      ) : (
        <p className="text-xs text-muted">No retention data available.</p>
      )}
    </Card>
  );
}