import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Card, CardTitle, Button } from "@/components/ui";
import { Monitor, TrendingUp, DollarSign, MousePointerClick, Zap } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

const data = [
  { name: 'Mon', impressions: 4000, clicks: 240, conversions: 12 },
  { name: 'Tue', impressions: 3000, clicks: 198, conversions: 8 },
  { name: 'Wed', impressions: 5000, clicks: 320, conversions: 15 },
  { name: 'Thu', impressions: 2780, clicks: 150, conversions: 5 },
  { name: 'Fri', impressions: 6890, clicks: 450, conversions: 22 },
  { name: 'Sat', impressions: 4390, clicks: 280, conversions: 14 },
  { name: 'Sun', impressions: 7490, clicks: 510, conversions: 28 },
];

const MetricCard = ({ title, value, icon: Icon, trend }: { title: string, value: string, icon: any, trend?: string }) => (
  <Card className="glass-panel p-4">
    <div className="flex items-center justify-between mb-2">
      <div className="text-muted text-xs font-bold uppercase tracking-wider">{title}</div>
      <Icon className="w-4 h-4 text-accent" />
    </div>
    <div className="text-2xl font-extrabold tracking-tight">{value}</div>
    {trend && <div className="text-[10px] text-green mt-1 font-mono">{trend}</div>}
  </Card>
);

export default function Dashboard() {
  const [metrics, setMetrics] = useState({
    impressions: 0,
    clicks: 0,
    ctr: 0,
    spend: 0,
    trend: [] as any[]
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await fetch("/api/metrics");
        const data = await res.json();
        setMetrics(data);
      } catch (err) {
        console.error("Failed to fetch metrics", err);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Real-Time Ad Performance</h1>
          <p className="text-sm text-muted mt-1">Live metrics from your active campaigns.</p>
        </div>
        <Button size="sm" className="gap-2" onClick={() => window.location.reload()}><Zap className="w-4 h-4" /> Refresh Data</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Impressions" value={metrics.impressions.toLocaleString()} icon={Monitor} />
        <MetricCard title="Clicks" value={metrics.clicks.toLocaleString()} icon={MousePointerClick} />
        <MetricCard title="CTR" value={`${metrics.ctr}%`} icon={TrendingUp} />
        <MetricCard title="Spend (Sats)" value={metrics.spend.toLocaleString()} icon={DollarSign} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 glass-panel">
          <CardTitle>Performance Trend</CardTitle>
          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics.trend}>
                <defs>
                  <linearGradient id="colorImpressions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff9f1c" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ff9f1c" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="impressions" stroke="#ff9f1c" fillOpacity={1} fill="url(#colorImpressions)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="glass-panel">
          <CardTitle>Wallet Status</CardTitle>
          <div className="text-xl font-extrabold my-4 text-green">Connected</div>
          <div className="text-[11px] text-muted font-mono truncate mb-4">bc1qhm5ndfjhqxdk3cx0pngyps4f5nnwdckulmge6c8keyf2pk0neqtshjn8ad</div>
          <Button variant="secondary" size="sm" className="w-full">Manage Profile</Button>
        </Card>
      </div>
    </motion.div>
  );
}

