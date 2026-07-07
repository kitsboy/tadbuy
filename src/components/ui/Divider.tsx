import { cn } from '@/lib/utils';

export function Divider({ label, className }: { label?: string; className?: string }) {
  if (label) {
    return (
      <div className={cn('flex items-center gap-3 my-4', className)}>
        <div className="flex-1 h-px bg-border" />
        <span className="text-[10px] font-bold text-muted uppercase tracking-widest">{label}</span>
        <div className="flex-1 h-px bg-border" />
      </div>
    );
  }
  return <div className={cn('h-px bg-border my-4', className)} />;
}