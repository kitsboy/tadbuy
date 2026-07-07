import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  trend,
  color = 'text-accent',
  className,
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  sub?: string;
  trend?: { value: number; label: string };
  color?: string;
  className?: string;
}) {
  return (
    <div className={cn('glass-panel rounded-xl p-4 hover:border-accent/20 transition-all hover:-translate-y-0.5', className)}>
      <div className="flex items-start justify-between mb-3">
        <Icon className={cn('w-5 h-5', color)} />
        {trend && (
          <span className={cn(
            'text-[10px] font-bold px-2 py-0.5 rounded-full',
            trend.value >= 0 ? 'bg-green/15 text-green' : 'bg-red/15 text-red'
          )}>
            {trend.value >= 0 ? '+' : ''}{trend.value}% {trend.label}
          </span>
        )}
      </div>
      <div className="text-2xl font-extrabold tracking-tight tabular-nums">{value}</div>
      <div className="text-[10px] text-muted uppercase tracking-widest font-bold mt-1">{label}</div>
      {sub && <div className="text-[10px] text-muted/70 mt-0.5">{sub}</div>}
    </div>
  );
}