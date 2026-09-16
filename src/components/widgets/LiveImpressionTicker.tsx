import { Activity } from 'lucide-react';

// Labelled demo sample — the platform has no /api/analytics/live backend on the
// static host, so this ticker renders representative figures and makes no request.
const SAMPLE = { impressionsPerMinute: 1420, clicksPerMinute: 18, activeCampaigns: 6 };

export function LiveImpressionTicker() {
  const stats = SAMPLE;

  return (
    <span className="flex items-center gap-1.5 text-[10px] font-mono text-muted">
      <Activity className="w-3 h-3 text-green animate-pulse" />
      <strong className="text-green">{stats.impressionsPerMinute.toLocaleString()}</strong>
      <span>imp/min</span>
      <span className="text-border">·</span>
      <span>{stats.activeCampaigns} live (demo)</span>
    </span>
  );
}