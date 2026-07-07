import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

const variants = {
  default: 'bg-surface text-text border-border',
  accent: 'bg-accent/15 text-accent border-accent/30',
  success: 'bg-green/15 text-green border-green/30',
  warning: 'bg-lightning/15 text-lightning border-lightning/30',
  error: 'bg-red/15 text-red border-red/30',
  info: 'bg-blue/15 text-blue border-blue/30',
  outline: 'bg-transparent text-muted border-border',
} as const;

export function Badge({
  children,
  variant = 'default',
  className,
  dot,
}: {
  children: ReactNode;
  variant?: keyof typeof variants;
  className?: string;
  dot?: boolean;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border',
        variants[variant],
        className
      )}
    >
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />}
      {children}
    </span>
  );
}