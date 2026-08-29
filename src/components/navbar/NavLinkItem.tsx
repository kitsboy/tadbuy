import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import type { NavItem } from './data';

export function NavLinkItem({
  item,
  onClick,
  variant = 'desktop',
}: {
  item: NavItem;
  onClick?: () => void;
  variant?: 'desktop' | 'mobile';
}) {
  const Icon = item.icon;
  const end = item.path === '/';

  if (variant === 'mobile') {
    return (
      <NavLink
        to={item.path}
        end={end}
        onClick={onClick}
        className={({ isActive }) =>
          cn(
            'flex items-center gap-4 px-4 py-3.5 min-h-14 rounded-2xl border transition-colors touch-target touch-manipulation',
            isActive
              ? 'bg-accent/10 border-accent/30 text-text'
              : 'bg-transparent border-transparent text-text hover:bg-surface'
          )
        }
      >
        {({ isActive }) => (
          <>
            <span
              className={cn(
                'flex items-center justify-center w-11 h-11 rounded-xl shrink-0',
                isActive ? 'bg-accent/20 text-accent' : 'bg-surface text-muted'
              )}
            >
              <Icon className="w-5 h-5" />
            </span>
            <span className="min-w-0">
              <span className="block text-base font-semibold leading-tight">{item.name}</span>
              <span className="block text-sm text-muted font-normal mt-0.5 leading-snug">
                {item.description}
              </span>
            </span>
          </>
        )}
      </NavLink>
    );
  }

  return (
    <NavLink
      to={item.path}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          'inline-flex items-center gap-2 px-3.5 py-2 min-h-11 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors',
          isActive
            ? 'bg-surface text-text shadow-sm ring-1 ring-border'
            : 'text-muted hover:text-text hover:bg-surface/70'
        )
      }
    >
      <Icon className="w-4 h-4 shrink-0" />
      {item.name}
    </NavLink>
  );
}
