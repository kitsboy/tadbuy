import { useEffect, useState } from 'react';
import { Timer } from 'lucide-react';

const NEXT_HALVING_HEIGHT = 1_050_000;

export function HalvingCountdown({ currentHeight }: { currentHeight: number | null }) {
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    if (currentHeight) setRemaining(NEXT_HALVING_HEIGHT - currentHeight);
  }, [currentHeight]);

  if (!remaining || remaining <= 0) return null;

  const days = Math.floor((remaining * 10) / 60 / 24);

  return (
    <div className="flex items-center gap-2 text-[10px] font-mono text-muted bg-surface px-2.5 py-1 rounded-full border border-border">
      <Timer className="w-3 h-3 text-accent" />
      <span>Halving in <strong className="text-accent">{remaining.toLocaleString()}</strong> blocks (~{days}d)</span>
    </div>
  );
}