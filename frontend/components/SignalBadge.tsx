import { Signal } from '@/lib/types';
import { getSignalColor, getSignalEmoji } from '@/lib/formatters';

interface SignalBadgeProps {
  signal: Signal;
  showEmoji?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function SignalBadge({ signal, showEmoji = true, size = 'md' }: SignalBadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 font-semibold uppercase tracking-wide
        border rounded-full ${getSignalColor(signal)} ${sizeClasses[size]}
      `}
    >
      {showEmoji && <span>{getSignalEmoji(signal)}</span>}
      <span>{signal}</span>
    </span>
  );
}
