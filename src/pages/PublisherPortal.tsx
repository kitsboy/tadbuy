import { useState, type ElementType, type FormEvent } from "react";
import { motion } from "motion/react";
import { Card, CardTitle, Button } from "@/components/ui";
import {
  DollarSign, Monitor, Zap, TrendingUp, BarChart2,
  Copy, Check, ArrowUpRight, Settings, Code2,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { usePageTitle } from "@/hooks/usePageTitle";

// ─── Data ─────────────────────────────────────────────────────────────────────
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

const SLOTS = [
  { id: 'slot_1', name: 'Homepage Hero',  placement: 'Above the fold',   format: '728×90 Leaderboard',  status: 'active',   fillRate: 87, revenueSats: 42000 },
  { id: 'slot_2', name: 'Sidebar Right',  placement: 'Article sidebar',  format: '300×250 Rectangle',   status: 'active',   fillRate: 64, revenueSats: 18500 },
  { id: 'slot_3', name: 'Footer Banner',  placement: 'Page footer',      format: '468×60 Banner',       status: 'inactive', fillRate: 0,  revenueSats: 0     },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const TOTAL_SATS   = SLOTS.reduce((s, sl) => s + sl.revenueSats, 0);
const AVG_FILL     = Math.round(SLOTS.filter(s => s.status === 'active').reduce((a, s) => a + s.fillRate, 0) / SLOTS.filter(s => s.status === 'active').length);
const ACTIVE_COUNT = SLOTS.filter(s => s.status === 'active').length;
const THIS_MONTH   = 124_200; // sats

// ─── Sub-components ───────────────────────────────────────────────────────────
interface StatCardProps { label: string; value: string; icon: ElementType; color: string; }
const StatCard = ({ label, value, icon: Icon, color }: StatCardProps) => (
  <Card className="glass-panel p-4">
    <div className="flex items-center justify-between mb-2">
      <div className="text-muted text-xs font-bold uppercase tracking-wider">{label}</div>
      <Icon className={`w-4 h-4 ${color}`} />
    </div>
    <div className={`text-2xl font-extrabold tracking-tight ${color}`}>{value}</div>
  </Card>
);

// ─── Embed Snippet ────────────────────────────────────────────────────────────
function EmbedSnippet({ slotId }: { slotId: string }) {
  const [copied, setCopied] = useState(false);
  const snippet = `<script src="https://tadbuy.io/embed.js" data-slot="${slotId}"><\/script>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(snippet).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="relative group">
      <pre className="text-[11px] font-mono bg-surface border border-border rounded-xl px-4 py-3 overflow-x-auto text-accent whitespace-pre-wrap break-all leading-relaxed pr-10">
        {snippet}
      </pre>
      <button
        onClick={handleCopy}
        className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-surface hover:bg-white/5 border border-border text-muted hover:text-white transition-colors"
        title="Copy to clipboard"
      >
        {copied
          ? <Check className="w-3.5 h-3.5 text-green" />
          : <Copy className="w-3.5 h-3.5" />
        }
      </button>
    </div>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ message, visible }: { message: string; visible: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 16 }}
      className="fixed bottom-6 right-6 z-50 bg-zinc-900 border border-border px-4 py-3 rounded-xl shadow-2xl text-sm font-medium flex items-center gap-2 pointer-events-none"
    >
      <Check className="w-4 h-4 text-green" />
      {message}
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function PublisherPortal() {
  usePageTitle('Publisher Portal');

  // Payment settings
  const [lightningAddress, setLightningAddress] = useState('publisher@walletofsatoshi.com');
  const [toastVisible, setToastVisible]         = useState(false);
  const [toastMsg, setToastMsg]                 = useState('');

  // Embed snippet: track selected slot
  const [selectedSlot, setSelectedSlot] = useState(SLOTS[0].id);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  };

  const handleSavePayment = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/publisher/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'publisher_default', // TODO: use real Firebase auth uid
          lightningAddress,
        }),
      });
      if (res.ok) {
        showToast('Lightning address saved successfully! ⚡');
      } else {
        showToast('Failed to save. Please try again.');
      }
    } catch {
      showToast('Failed to save. Please try again.');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Publisher Portal</h1>
        <p className="text-sm text-muted mt-1">Manage your ad slots and track earnings in real time.</p>
      </div>

      {/* ── Revenue Summary ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Revenue"   value={`${TOTAL_SATS.toLocaleString()} sats`} icon={DollarSign} color="text-green"     />
        <StatCard label="This Month"      value={`${THIS_MONTH.toLocaleString()} sats`} icon={Zap}        color="text-lightning" />
        <StatCard label="Avg Fill Rate"   value={`${AVG_FILL}%`}                         icon={TrendingUp} color="text-blue"      />
        <StatCard label="Active Slots"    value={`${ACTIVE_COUNT} / ${SLOTS.length}`}   icon={Monitor}    color="text-accent"    />
      </div>

      {/* ── Charts row ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Earnings Chart */}
        <Card className="glass-panel">
          <div className="flex items-center justify-between mb-4">
            <CardTitle className="mb-0">
              <BarChart2 className="w-4 h-4 inline mr-1.5" />Earnings Trend (7d)
            </CardTitle>
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
                <YAxis stroke="#a1a1aa" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '11px' }}
                  formatter={(v: number) => [`${v.toLocaleString()} sats`, 'Earned']}
                />
                <Area type="monotone" dataKey="sats" stroke="#4ade80" fill="url(#earnGrad)" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Payout History */}
        <Card className="glass-panel">
          <div className="flex items-center justify-between mb-4">
            <CardTitle className="mb-0">Payout History</CardTitle>
            <Button size="sm" className="gap-2">
              <Zap className="w-3.5 h-3.5" /> Withdraw
            </Button>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-muted text-left text-[11px] uppercase tracking-wider border-b border-border">
                <th className="pb-3 pr-4">ID</th>
                <th className="pb-3 pr-4">Date</th>
                <th className="pb-3 pr-4">Amount</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {PAYOUT_HISTORY.map(p => (
                <tr key={p.id} className="border-t border-border/50 hover:bg-surface/30 transition-colors">
                  <td className="py-2.5 pr-4 font-mono text-[11px] text-muted">{p.id}</td>
                  <td className="py-2.5 pr-4 text-xs">{p.date}</td>
                  <td className="py-2.5 pr-4 font-mono text-xs text-green font-bold">{p.amount} BTC</td>
                  <td className="py-2.5">
                    <span className="text-[10px] font-bold text-green bg-green/10 border border-green/20 px-2 py-0.5 rounded-full">
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      {/* ── Ad Slot Management ──────────────────────────────────────────────── */}
      <Card className="glass-panel">
        <div className="flex items-center justify-between mb-5">
          <CardTitle className="mb-0">
            <Monitor className="w-4 h-4 inline mr-1.5" />Ad Slot Management
          </CardTitle>
          <Button size="sm" variant="secondary" className="gap-1.5 text-[11px]">
            <Monitor className="w-3.5 h-3.5" /> Add Slot
          </Button>
        </div>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-muted text-left text-[11px] uppercase tracking-wider border-b border-border">
                <th className="pb-3 pr-6">Slot Name</th>
                <th className="pb-3 pr-6">Placement</th>
                <th className="pb-3 pr-6">Format</th>
                <th className="pb-3 pr-6">Status</th>
                <th className="pb-3 pr-6">Fill Rate</th>
                <th className="pb-3">Revenue (sats)</th>
              </tr>
            </thead>
            <tbody>
              {SLOTS.map(slot => (
                <tr key={slot.id} className="border-t border-border/50 hover:bg-surface/30 transition-colors group">
                  <td className="py-3.5 pr-6">
                    <div className="font-semibold text-sm">{slot.name}</div>
                    <div className="text-[10px] text-muted font-mono">{slot.id}</div>
                  </td>
                  <td className="py-3.5 pr-6 text-xs text-muted">{slot.placement}</td>
                  <td className="py-3.5 pr-6 text-xs font-mono text-muted">{slot.format}</td>
                  <td className="py-3.5 pr-6">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      slot.status === 'active'
                        ? 'text-green bg-green/10 border-green/20'
                        : 'text-muted bg-surface border-border'
                    }`}>
                      {slot.status === 'active' && <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" />}
                      {slot.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-3.5 pr-6">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-surface rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-accent transition-all"
                          style={{ width: `${slot.fillRate}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono font-bold">{slot.fillRate}%</span>
                    </div>
                  </td>
                  <td className="py-3.5">
                    <span className={`text-sm font-bold font-mono ${slot.revenueSats > 0 ? 'text-green' : 'text-muted'}`}>
                      {slot.revenueSats > 0 ? slot.revenueSats.toLocaleString() : '—'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden space-y-3">
          {SLOTS.map(slot => (
            <div key={slot.id} className="flex items-start justify-between p-3 bg-surface rounded-xl border border-border hover:border-accent/30 transition-colors">
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold">{slot.name}</div>
                <div className="text-[10px] text-muted font-mono mt-0.5">{slot.placement} · {slot.format}</div>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-16 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-accent" style={{ width: `${slot.fillRate}%` }} />
                  </div>
                  <span className="text-[10px] font-mono">{slot.fillRate}% fill</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1.5 ml-3 shrink-0">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  slot.status === 'active' ? 'text-green bg-green/10 border-green/20' : 'text-muted bg-surface border-border'
                }`}>{slot.status === 'active' ? 'Active' : 'Inactive'}</span>
                <span className={`text-xs font-mono font-bold ${slot.revenueSats > 0 ? 'text-green' : 'text-muted'}`}>
                  {slot.revenueSats > 0 ? `${slot.revenueSats.toLocaleString()} sats` : '—'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* ── Embed Code ──────────────────────────────────────────────────────── */}
      <Card className="glass-panel">
        <div className="flex items-center gap-2 mb-5">
          <Code2 className="w-4 h-4 text-accent" />
          <CardTitle className="mb-0">Embed Code</CardTitle>
        </div>
        <p className="text-xs text-muted mb-4 leading-relaxed">
          Copy the snippet below and paste it into your site's HTML where you want the ad to appear.
          Switch slots using the selector.
        </p>

        {/* Slot selector */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          {SLOTS.map(s => (
            <button
              key={s.id}
              onClick={() => setSelectedSlot(s.id)}
              className={`text-[11px] font-mono px-3 py-1.5 rounded-lg border transition-colors ${
                selectedSlot === s.id
                  ? 'border-accent bg-accent/10 text-accent'
                  : 'border-border bg-surface text-muted hover:border-white/20 hover:text-white'
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>

        <EmbedSnippet slotId={selectedSlot} />

        <p className="text-[10px] text-muted mt-3 font-mono flex items-center gap-1.5">
          <ArrowUpRight className="w-3 h-3" />
          Slot ID: <span className="text-white/70">{selectedSlot}</span>
        </p>
      </Card>

      {/* ── Payment Settings ────────────────────────────────────────────────── */}
      <Card className="glass-panel">
        <div className="flex items-center gap-2 mb-5">
          <Settings className="w-4 h-4 text-accent" />
          <CardTitle className="mb-0">Payment Settings</CardTitle>
        </div>
        <p className="text-xs text-muted mb-5 leading-relaxed">
          Payouts are sent automatically to your Lightning address. Minimum payout: 10,000 sats.
        </p>

        <form onSubmit={handleSavePayment} className="space-y-4 max-w-md">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">
              Lightning Address
            </label>
            <div className="relative">
              <Zap className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-lightning pointer-events-none" />
              <input
                type="text"
                value={lightningAddress}
                onChange={e => setLightningAddress(e.target.value)}
                placeholder="you@walletofsatoshi.com"
                className="w-full bg-surface border border-border rounded-xl pl-8 pr-4 py-2.5 text-sm font-mono placeholder:text-muted/50 focus:outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/20 transition-colors"
              />
            </div>
            <p className="text-[10px] text-muted mt-1.5">
              Accepts any Lightning Address (LNURL-pay compatible).
            </p>
          </div>

          <Button type="submit" size="sm" className="gap-2">
            <Check className="w-3.5 h-3.5" /> Save Settings
          </Button>
        </form>
      </Card>

      {/* Toast */}
      <Toast message={toastMsg} visible={toastVisible} />
    </motion.div>
  );
}
