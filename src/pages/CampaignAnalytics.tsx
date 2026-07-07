import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useApiFetch } from '@/hooks/useApiFetch';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui';
import { motion } from "motion/react";
import { Card, CardTitle } from "@/components/ui";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";
import { LiveImpressionTicker } from '@/components/widgets/LiveImpressionTicker';
import { Download, Loader2 } from 'lucide-react';

interface CampaignAnalyticsData {
  campaignId: string;
  name: string;
  status: string;
  impressions: number;
  clicks: number;
  ctr: number;
  spendSats: number;
  trend: Array<{ name: string; impressions: number; clicks: number }>;
  demo?: boolean;
}

const fallbackData = [
  { name: 'Mon', impressions: 4000, clicks: 2400 },
  { name: 'Tue', impressions: 3000, clicks: 1398 },
  { name: 'Wed', impressions: 5000, clicks: 3800 },
  { name: 'Thu', impressions: 2780, clicks: 1908 },
  { name: 'Fri', impressions: 6890, clicks: 4800 },
  { name: 'Sat', impressions: 4390, clicks: 2800 },
  { name: 'Sun', impressions: 7490, clicks: 5200 },
];

export default function CampaignAnalytics() {
  usePageTitle('Campaign Analytics');
  const [searchParams] = useSearchParams();
  const campaignId = searchParams.get('campaign');
  const [platform, setPlatform] = useState('all');
  const [dateRange, setDateRange] = useState('7d');
  const [exporting, setExporting] = useState(false);

  const apiUrl = campaignId
    ? `/api/analytics/campaign/${campaignId}?range=${dateRange}&platform=${platform}`
    : null;

  const { data, loading } = useApiFetch<CampaignAnalyticsData>(apiUrl);
  const chartData = data?.trend ?? fallbackData;

  const handleExport = async () => {
    if (!campaignId) return;
    setExporting(true);
    try {
      const res = await fetch(`/api/analytics/export/${campaignId}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `campaign-${campaignId}-analytics.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Campaign Analytics</h1>
          {campaignId ? (
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <Badge variant="accent">Campaign</Badge>
              <span className="text-xs font-mono text-muted">{campaignId}</span>
              {data?.name && <span className="text-xs text-text font-bold">{data.name}</span>}
              {data?.demo && <Badge variant="warning">Demo data</Badge>}
              <LiveImpressionTicker />
            </div>
          ) : (
            <p className="text-xs text-muted mt-1">Add ?campaign=id to the URL for campaign-specific metrics</p>
          )}
        </div>
        <div className="flex gap-2">
          {campaignId && (
            <Button variant="secondary" size="sm" onClick={handleExport} disabled={exporting} className="gap-1.5">
              {exporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
              Export CSV
            </Button>
          )}
          <select value={platform} onChange={e => setPlatform(e.target.value)} className="bg-surface border border-border rounded-lg p-2 text-sm">
            <option value="all">All Platforms</option>
            <option value="dev.giveabit.io">dev.giveabit.io</option>
            <option value="tools.giveabit.io">tools.giveabit.io</option>
          </select>
          <select value={dateRange} onChange={e => setDateRange(e.target.value)} className="bg-surface border border-border rounded-lg p-2 text-sm">
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
        </div>
      </div>

      {data && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Impressions', value: data.impressions.toLocaleString() },
            { label: 'Clicks', value: data.clicks.toLocaleString() },
            { label: 'CTR', value: `${data.ctr.toFixed(2)}%` },
            { label: 'Spend', value: `${data.spendSats.toLocaleString()} sats` },
          ].map(stat => (
            <Card key={stat.label} className="glass-panel p-3">
              <div className="text-[10px] text-muted uppercase font-bold">{stat.label}</div>
              <div className="text-lg font-extrabold text-accent">{stat.value}</div>
            </Card>
          ))}
        </div>
      )}

      {loading && campaignId && (
        <div className="flex items-center gap-2 text-sm text-muted">
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading campaign analytics…
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-panel">
          <CardTitle>Impressions vs Clicks</CardTitle>
          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                <Legend />
                <Bar dataKey="impressions" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="clicks" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="glass-panel">
          <CardTitle>Performance Trends</CardTitle>
          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="impressions" stroke="#ff9f1c" strokeWidth={3} dot={{ fill: '#ff9f1c', strokeWidth: 2 }} activeDot={{ r: 8, fill: '#ff9f1c' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </motion.div>
  );
}