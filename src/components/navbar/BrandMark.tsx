import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

export function BrandMark({
  compact = false,
  onClick,
}: {
  compact?: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      to="/"
      onClick={onClick}
      className={cn(
        'flex items-center min-h-11 rounded-xl transition-opacity hover:opacity-90',
        compact ? 'gap-2' : 'gap-3'
      )}
      aria-label="Tadbuy home"
    >
      <span className="relative shrink-0">
        <img
          src="/favicon.png"
          alt=""
          className={cn('object-contain', compact ? 'w-8 h-8' : 'w-9 h-9')}
        />
        <span className="absolute -inset-1 rounded-full bg-accent/20 blur-md -z-10 opacity-60" />
      </span>
      <span className="leading-none">
        <span className={cn('block font-bold tracking-tight text-text', compact ? 'text-lg' : 'text-xl')}>
          Tadbuy
        </span>
        <span className="block text-[11px] text-muted font-mono tracking-wider mt-0.5">
          by giveabit.io
        </span>
      </span>
    </Link>
  );
}
