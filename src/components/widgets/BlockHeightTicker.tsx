import { useEffect, useState } from 'react';
import { Box, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SafeLink } from '@/components/SafeLink';

export function BlockHeightTicker({ className }: { className?: string }) {
  const [height, setHeight] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeight = async () => {
      try {
        // Try the platform's API first, fall back to mempool.space.
        let res = await fetch('/api/blockchain/info');
        if (!res.ok) {
          res = await fetch('https://mempool.space/api/blocks/tip/height');
        }
        if (res.ok) {
          const data = await res.json();
          const h = typeof data === 'number' ? data : data.height ?? data.tipHeight ?? null;
          if (typeof h === 'number') {
            setHeight(h);
          }
        }
      } catch {
        // Silent fail — keep showing the last known height.
      } finally {
        setLoading(false);
      }
    };
    fetchHeight();
    const interval = setInterval(fetchHeight, 60_000);
    return () => clearInterval(interval);
  }, []);

  if (loading && height === null) {
    return (
      <span className={cn('inline-flex items-center gap-1.5 text-[10px] font-mono text-muted', className)}>
        <Loader2 className="h-3 w-3 animate-spin text-muted" />
        Block …
      </span>
    );
  }

  if (height === null) return null;

  return (
    <SafeLink
      href="https://mempool.space"
      showIcon
      className={cn(
        'group inline-flex items-center gap-1.5 rounded-full border border-white/5 bg-white/[0.02] px-2.5 py-1 font-mono text-[10px] text-muted transition-colors hover:border-accent/30 hover:text-accent',
        className
      )}
      title="Bitcoin block height (click to view mempool)"
    >
      <Box className="h-3 w-3 text-accent" />
      <span>Block</span>
      <strong className="font-bold text-white group-hover:text-accent tabular-nums">
        {height.toLocaleString()}
      </strong>
    </SafeLink>
  );
}