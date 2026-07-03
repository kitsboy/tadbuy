import { useEffect, useState } from 'react';
import { Box } from 'lucide-react';

export function BlockHeightTicker() {
  const [height, setHeight] = useState<number | null>(null);

  useEffect(() => {
    const fetchHeight = () => {
      fetch('/api/blockchain/info')
        .then(r => r.json())
        .then(d => setHeight(d.height))
        .catch(() => {});
    };
    fetchHeight();
    const interval = setInterval(fetchHeight, 60000);
    return () => clearInterval(interval);
  }, []);

  if (!height) return null;

  return (
    <span className="flex items-center gap-1.5 text-[10px] font-mono text-muted">
      <Box className="w-3 h-3 text-accent" />
      Block <strong className="text-text">{height.toLocaleString()}</strong>
    </span>
  );
}