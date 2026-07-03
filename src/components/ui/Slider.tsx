import { cn } from '@/lib/utils';

export function Slider({
  min,
  max,
  value,
  onChange,
  label,
  className,
}: {
  min: number;
  max: number;
  value: number;
  onChange: (v: number) => void;
  label?: string;
  className?: string;
}) {
  return (
    <div className={cn('space-y-2', className)}>
      {label && <label className="text-[11px] font-bold text-muted uppercase tracking-wider">{label}</label>}
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-2 bg-surface rounded-lg appearance-none cursor-pointer accent-accent"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
      />
    </div>
  );
}