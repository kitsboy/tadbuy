import { useState } from "react";
import { motion } from "motion/react";
import { Card, CardTitle, Button } from "@/components/ui";
import { DollarSign, Monitor, Zap, TrendingUp, ArrowUpRight, BarChart2 } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { usePageTitle } from "@/hooks/usePageTitle";

const EARNINGS_TREND = [
  { day: 'Mon', sats: 12400 },
  { day: 'Tue', sats: 9800  },
  { day: 'Wed', sats: 18200 },
  { day: 'Thu', sats: 14100 },
  { day: 'Fri', sats: 22300 },
  { day: 'Sat', sats: 19800 },
  { day: 'Sun', sats: 27600 },
];

const PAYOUT_HISTORY = [
  { id: 'PAY-001', date: '2026-04-22', amount: 0.00042, status: 'Confirmed', slots: 3 },
  { id: 'PAY-002', date: '2026-04-18', amount: 0.00081, status: 'Confirmed', slots: 4 },
  { id: 'PAY-003', date: '2026-04-14', amount: 0.00036, status: 'Confirmed', slots: 2 },
  { id: 'PAY-004', date: '2026-04-09', amount: 0.00120, status: 'Confirmed', slots: 4 },
];

const AD_SLOTS = [
  { name: 'Header Banner',    impressions: 24_200, ctr: '2.8%', status: 'Active'  },
  { name: 'Sidebar Native',   impressions: 11_400, ctr: '1.4%', status: 'Active'  },
  { name: 'Footer Text Link', impressions:  8_900, ctr: '0.9%', status: 'Paused'  },
  { name: 'In-content Card',  impressions: 18_600, ctr: '3.1%', status: 'Active'  },
];

export default function PublisherPortal() {
  usePageTitle('Publisher Portal');
  const [earnings] = useState(0.00442);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Publisher Portal</h1>
        <p className="text-sm text-muted mt-1">Manage your ad slots and track earnings in real time.</p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Earned',   value: `${earnings} BTC`,   icon: DollarSign,  color: 'text-green'    },
          { label: 'Active Slots',   value: '3 / 4',             icon: Monitor,     color: 'text-accent'   },
          { label: 'This Week',      value: '124,200 sats',       icon: Zap,         color: 'text-lightning'},
          { label: 'Avg CTR',        value: '2.05%',              icon: TrendingUp,  color: 'text-blue'     },
        ].map(stat => (
          <Card key={stat.label} className="glass-panel p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-muted text-xs font-bold uppercase tracking-wider">{stat.label}</div>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <div className={`text-2xl font-extrabold tracking-tight ${stat.color}`}>{stat.value}</div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Earnings Chart */}
        <Card className="glass-panel">
          <div className="flex items-center justify-between mb-4">
            <CardTitle className="mb-0"><BarChart2 className="w-4 h-4 inline mr-1.5" />Earnings Trend (7d)</CardTitle>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={EARNINGS_TREND}>
                <defs>
                  <linearGradient id="earnGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#4ade80" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4ade80" stopOpacity={0}   />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" stroke="#a1a1aa" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#a1a1aa" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '11px' }} formatter={(v: number) => [`${v.toLocaleString()} sats`, 'Earned']} />
                <Area type="monotone" dataKey="sats" stroke="#4ade80" fill="url(#earnGrad)" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Ad Slots */}
        <Card className="glass-panel">
          <div className="flex items-center justify-between mb-4">
            <CardTitle className="mb-0"><Monitor className="w-4 h-4 inline mr-1.5" />Ad Slots</CardTitle>
            <Button size="sm" variant="secondary" className="gap-1.5 text-[11px]">
              <Monitor className="w-3.5 h-3.5" /> Add Slot
            </Button>
          </div>
          <div className="space-y-2">
            {AD_SLOTS.map(slot => (
              <div key={slot.name} className="flex items-center justify-between p-3 bg-surface rounded-xl border border-border hover:border-accent/30 transition-colors">
                <div>
                  <div className="text-sm font-bold">{slot.name}</div>
                  <div className="text-[10px] text-muted font-mono">{slot.impressions.toLocaleString()} impr · {slot.ctr} CTR</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${slot.status === 'Active' ? 'text-green bg-green/10 border-green/20' : 'text-muted bg-surface border-border'}`}>
                    {slot.status}
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-muted" />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Payout History */}
      <Card className="glass-panel">
        <div className="flex items-center justify-between mb-4">
          <CardTitle className="mb-0">Payout History</CardTitle>
          <Button size="sm" className="gap-2">
            <DollarSign className="w-4 h-4" /> Withdraw
          </Button>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-muted text-left text-[11px] uppercase tracking-wider border-b border-border">
              <th className="pb-3 pr-4">ID</th>
              <th className="pb-3 pr-4">Date</th>
              <th className="pb-3 pr-4">Amount</th>
              <th className="pb-3 pr-4">Slots</th>
              <th className="pb-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {PAYOUT_HISTORY.map(p => (
              <tr key={p.id} className="border-t border-border/50 hover:bg-surface/30 transition-colors">
                <td className="py-3 pr-4 font-mono text-xs text-muted">{p.id}</td>
                <td className="py-3 pr-4 text-xs">{p.date}</td>
                <td className="py-3 pr-4 font-mono text-xs text-green font-bold">{p.amount} BTC</td>
                <td className="py-3 pr-4 text-xs">{p.slots} active</td>
                <td className="py-3">
                  <span className="text-[10px] font-bold text-green bg-green/10 border border-green/20 px-2 py-0.5 rounded-full">
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </motion.div>
  );
}
