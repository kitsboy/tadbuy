import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '../ui';

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  actionLabel,
  children,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: () => void;
  actionLabel?: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] py-16 px-6 text-center',
        className
      )}
    >
      {/* Subtle radial accent behind the icon */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 25%, rgba(244,114,182,0.10), transparent 60%)',
        }}
      />
      <div className="relative">
        <div className="relative mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-zinc-950 shadow-lg">
          <span className="absolute inset-0 -z-10 rounded-2xl bg-accent/20 blur-xl" />
          <Icon className="h-7 w-7 text-accent" />
        </div>
        <h3 className="mb-2 text-lg font-extrabold text-white">{title}</h3>
        <p className="mx-auto mb-6 max-w-sm text-sm leading-relaxed text-zinc-400">{description}</p>
        {children}
        {action && actionLabel && (
          <Button onClick={action} className="mt-2">
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
}