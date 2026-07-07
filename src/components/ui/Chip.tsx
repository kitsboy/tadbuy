import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Chip({
  children,
  onRemove,
  active,
  onClick,
  className,
}: {
  children: ReactNode;
  onRemove?: () => void;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  const Comp = onClick ? 'button' : 'span';
  return (
    <Comp
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all',
        active
          ? 'bg-accent/15 text-accent border-accent/40'
          : 'bg-surface text-muted border-border hover:border-muted hover:text-text',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          className="p-0.5 rounded-full hover:bg-white/10 transition-colors"
          aria-label="Remove"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </Comp>
  );
}