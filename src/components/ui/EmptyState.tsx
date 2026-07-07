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
    <div className={cn('flex flex-col items-center justify-center text-center py-16 px-6', className)}>
      <div className="w-16 h-16 rounded-2xl bg-surface border border-border flex items-center justify-center mb-5">
        <Icon className="w-8 h-8 text-muted" />
      </div>
      <h3 className="text-lg font-extrabold mb-2">{title}</h3>
      <p className="text-sm text-muted max-w-sm leading-relaxed mb-6">{description}</p>
      {children}
      {action && actionLabel && (
        <Button onClick={action}>{actionLabel}</Button>
      )}
    </div>
  );
}