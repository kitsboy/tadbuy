import { cn } from '@/lib/utils';

export function Progress({
  value,
  max = 100,
  className,
  showLabel,
  variant = 'accent',
}: {
  value: number;
  max?: number;
  className?: string;
  showLabel?: boolean;
  variant?: 'accent' | 'green' | 'blue' | 'lightning';
}) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const fills = {
    accent: 'bg-accent',
    green: 'bg-green',
    blue: 'bg-blue',
    lightning: 'bg-lightning',
  };

  return (
    <div className={cn('space-y-1', className)}>
      {showLabel && (
        <div className="flex justify-between text-[10px] font-bold text-muted uppercase tracking-wider">
          <span>Progress</span>
          <span>{Math.round(pct)}%</span>
        </div>
      )}
      <div
        className="h-2 rounded-full bg-surface border border-border overflow-hidden"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <div
          className={cn('h-full rounded-full transition-all duration-500 ease-out', fills[variant])}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}