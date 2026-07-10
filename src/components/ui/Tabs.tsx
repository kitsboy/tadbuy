import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { cn } from '@/lib/utils';

type TabsContextValue = {
  active: string;
  setActive: (v: string) => void;
  baseId: string;
  register: (value: string) => void;
  values: string[];
};

const TabsContext = createContext<TabsContextValue | null>(null);

export function Tabs({
  defaultValue,
  children,
  className,
}: {
  defaultValue: string;
  children: ReactNode;
  className?: string;
}) {
  const [active, setActive] = useState(defaultValue);
  const [values, setValues] = useState<string[]>([]);
  const baseId = useId();
  const register = useCallback((value: string) => {
    setValues((prev) => (prev.includes(value) ? prev : [...prev, value]));
  }, []);
  return (
    <TabsContext.Provider value={{ active, setActive, baseId, register, values }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ children, className }: { children: ReactNode; className?: string }) {
  const ctx = useContext(TabsContext);
  const listRef = useRef<HTMLDivElement>(null);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!ctx || ctx.values.length === 0) return;
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft' && e.key !== 'Home' && e.key !== 'End') return;
    e.preventDefault();
    const idx = Math.max(0, ctx.values.indexOf(ctx.active));
    let next = idx;
    if (e.key === 'ArrowRight') next = (idx + 1) % ctx.values.length;
    if (e.key === 'ArrowLeft') next = (idx - 1 + ctx.values.length) % ctx.values.length;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = ctx.values.length - 1;
    const nextVal = ctx.values[next];
    ctx.setActive(nextVal);
    const btn = listRef.current?.querySelector<HTMLElement>(`[data-tab-value="${nextVal}"]`);
    btn?.focus();
  };

  return (
    <div
      ref={listRef}
      role="tablist"
      onKeyDown={onKeyDown}
      className={cn(
        'inline-flex items-center gap-1 p-1 rounded-xl bg-surface border border-border',
        className
      )}
    >
      {children}
    </div>
  );
}

export function TabsTrigger({
  value,
  children,
  className,
}: {
  value: string;
  children: ReactNode;
  className?: string;
}) {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error('TabsTrigger must be inside Tabs');
  const isActive = ctx.active === value;

  useEffect(() => {
    ctx.register(value);
  }, [ctx.register, value]);

  return (
    <button
      type="button"
      role="tab"
      id={`${ctx.baseId}-tab-${value}`}
      data-tab-value={value}
      aria-selected={isActive}
      aria-controls={`${ctx.baseId}-panel-${value}`}
      tabIndex={isActive ? 0 : -1}
      onClick={() => ctx.setActive(value)}
      className={cn(
        'px-4 py-2 rounded-lg text-xs font-bold transition-all',
        isActive
          ? 'bg-card text-text shadow-sm border border-border'
          : 'text-muted hover:text-text hover:bg-card/50',
        className
      )}
    >
      {children}
    </button>
  );
}

export function TabsContent({
  value,
  children,
  className,
}: {
  value: string;
  children: ReactNode;
  className?: string;
}) {
  const ctx = useContext(TabsContext);
  if (!ctx || ctx.active !== value) return null;
  return (
    <div
      role="tabpanel"
      id={`${ctx.baseId}-panel-${value}`}
      aria-labelledby={`${ctx.baseId}-tab-${value}`}
      tabIndex={0}
      className={cn('mt-4 animate-fade-in', className)}
    >
      {children}
    </div>
  );
}
