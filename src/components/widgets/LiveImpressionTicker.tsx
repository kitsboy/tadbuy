import { useEffect, useState } from 'react';
import { Activity } from 'lucide-react';

interface LiveStats {
  impressionsPerMinute: number;
  clicksPerMinute: number;
  activeCampaigns: number;
}

export function LiveImpressionTicker() {
  const [stats, setStats] = useState<LiveStats | null>(null);

  useEffect(() => {
    const fetchLive = () => {
      fetch('/api/analytics/live')
        .then(r => r.json())
        .then(setStats)
        .catch(() => {});
    };
    fetchLive();
    const interval = setInterval(fetchLive, 15000);
    return () => clearInterval(interval);
  }, []);

  if (!stats) return null;

  return (
    <span className="flex items-center gap-1.5 text-[10px] font-mono text-muted">
      <Activity className="w-3 h-3 text-green animate-pulse" />
      <strong className="text-green">{stats.impressionsPerMinute.toLocaleString()}</strong>
      <span>imp/min</span>
      <span className="text-border">·</span>
      <span>{stats.activeCampaigns} live</span>
    </span>
  );
}