import type { ReactNode } from 'react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const config = {
  success: { icon: CheckCircle2, bg: 'bg-green/10 border-green/30 text-green' },
  warning: { icon: AlertTriangle, bg: 'bg-lightning/10 border-lightning/30 text-lightning' },
  error: { icon: AlertCircle, bg: 'bg-red/10 border-red/30 text-red' },
  info: { icon: Info, bg: 'bg-blue/10 border-blue/30 text-blue' },
} as const;

export function Alert({
  variant = 'info',
  title,
  children,
  onDismiss,
  className,
}: {
  variant?: keyof typeof config;
  title?: string;
  children: ReactNode;
  onDismiss?: () => void;
  className?: string;
}) {
  const { icon: Icon, bg } = config[variant];
  return (
    <div
      role="alert"
      className={cn('flex gap-3 p-4 rounded-xl border', bg, className)}
    >
      <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        {title && <div className="text-sm font-bold mb-1">{title}</div>}
        <div className="text-xs leading-relaxed opacity-90">{children}</div>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="p-1 rounded-lg hover:bg-white/10 transition-colors flex-shrink-0"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}