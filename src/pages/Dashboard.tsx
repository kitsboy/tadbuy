import { useState, useEffect, type ComponentType } from "react";
import { motion } from "motion/react";
import { Card, CardTitle, Button } from "@/components/ui";
import { Monitor, TrendingUp, DollarSign, MousePointerClick, Zap, RefreshCw } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { BITCOIN_ADDRESS } from "@/constants";
import { usePageTitle } from "@/hooks/usePageTitle";

// ─── Types ────────────────────────────────────────────────────────────────────
interface TrendPoint { name: string; impressions: number; clicks: number; }
interface Metrics {
  impressions: number;
  clicks: number;
  ctr: number;
  spend: number;
  trend: TrendPoint[];
}

// Realistic mock data used when API is unavailable
const MOCK_METRICS: Metrics = {
  impressions: 47_382,
  clicks: 1_204,
  ctr: 2.54,
  spend: 0.04230000, // BTC
  trend: [
    { name: 'Mon', impressions: 4200,  clicks: 240 },
    { name: 'Tue', impressions: 3800,  clicks: 195 },
    { name: 'Wed', impressions: 6100,  clicks: 320 },
    { name: 'Thu', impressions: 5200,  clicks: 280 },
    { name: 'Fri', impressions: 8900,  clicks: 450 },
    { name: 'Sat', impressions: 7400,  clicks: 390 },
    { name: 'Sun', impressions: 11882, clicks: 510 },
  ],
};

// ─── Sub-components ───────────────────────────────────────────────────────────
interface MetricCardProps {
  title: string;
  value: string;
  icon: ComponentType<{ className?: string }>;
  trend?: string;
  loading?: boolean;
}

const MetricCard = ({ title, value, icon: Icon, trend, loading }: MetricCardProps) => (
  <Card className="glass-panel p-4">
    <div className="flex items-center justify-between mb-2">
      <div className="text-muted text-xs font-bold uppercase tracking-wider">{title}</div>
      <Icon className="w-4 h-4 text-accent" />
    </div>
    {loading ? (
      <div className="h-8 w-28 bg-surface rounded-lg animate-pulse mt-1" />
    ) : (
      <div className="text-2xl font-extrabold tracking-tight">{value}</div>
    )}
    {trend && !loading && (
      <div className="text-[10px] text-green mt-1 font-mono">{trend}</div>
    )}
  </Card>
);

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Dashboard() {
  usePageTitle('Dashboard');

  const [metrics, setMetrics] = useState<Metrics>(MOCK_METRICS);
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/metrics");
      if (!res.ok) throw new Error("API unavailable");
      const data: Metrics = await res.json();
      setMetrics(data);
      setIsLive(true);
    } catch {
      // Fall back to mock data — page still looks great
      setMetrics(MOCK_METRICS);
      setIsLive(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30_000); // Poll every 30s (not 5s)
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Real-Time Ad Performance</h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-sm text-muted">Live metrics from your active campaigns.</p>
            {!isLive && (
              <span className="text-[10px] font-mono text-lightning bg-lightning/10 border border-lightning/20 px-2 py-0.5 rounded-full">
                Demo data
              </span>
            )}
          </div>
        </div>
        <Button size="sm" className="gap-2" onClick={fetchMetrics} disabled={loading}>
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Impressions" value={metrics.impressions.toLocaleString()} icon={Monitor} trend="↑ 18% vs last week" loading={loading} />
        <MetricCard title="Clicks"      value={metrics.clicks.toLocaleString()}      icon={MousePointerClick} trend="↑ 6% vs last week" loading={loading} />
        <MetricCard title="CTR"         value={`${metrics.ctr}%`}                    icon={TrendingUp} trend="Industry avg: 1.9%" loading={loading} />
        <MetricCard title="Spend (₿)" value={`₿ ${metrics.spend.toFixed(8)}`}         icon={DollarSign} trend={`≈ ${Math.round(metrics.spend * 100_000_000).toLocaleString()} sats`} loading={loading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 glass-panel">
          <div className="flex items-center justify-between">
            <CardTitle className="mb-0">Performance Trend</CardTitle>
            <div className="flex items-center gap-4 text-[11px] font-mono text-muted">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: '#f7931a' }} />Impressions</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: '#10b981' }} />Clicks</span>
            </div>
          </div>
          {loading ? (
            <div className="h-64 mt-5 bg-surface/50 rounded-xl animate-pulse" />
          ) : (
            <div className="h-64 mt-5">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={metrics.trend}>
                  <defs>
                    <linearGradient id="colorImpressions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#f7931a" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f7931a" stopOpacity={0}   />
                    </linearGradient>
                    <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}   />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }} />
                  <Area type="monotone" dataKey="impressions" stroke="#f7931a" fillOpacity={1} fill="url(#colorImpressions)" strokeWidth={3} name="Impressions" />
                  <Area type="monotone" dataKey="clicks"      stroke="#10b981" fillOpacity={1} fill="url(#colorClicks)"      strokeWidth={3} name="Clicks" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>

        <Card className="glass-panel">
          <CardTitle>Wallet Status</CardTitle>
          <div className="flex items-center gap-2 text-xl font-extrabold my-4 text-green">
            <span className="w-2.5 h-2.5 rounded-full bg-green animate-pulse" />
            Connected
          </div>
          <div className="text-[11px] text-muted font-mono truncate mb-1 bg-surface px-3 py-2 rounded-lg border border-border">
            {BITCOIN_ADDRESS}
          </div>
          <p className="text-[10px] text-muted mb-4">On-chain · Mainnet</p>
          <Button variant="secondary" size="sm" className="w-full">
            <Zap className="w-3.5 h-3.5 mr-2" /> Manage Profile
          </Button>
        </Card>
      </div>
    </motion.div>
  );
}
