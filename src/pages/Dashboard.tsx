import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Card, CardTitle, Button, InfoTooltip } from "@/components/ui";
import { Monitor, Link as LinkIcon, Download } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: 'Mon', impressions: 4000 },
  { name: 'Tue', impressions: 3000 },
  { name: 'Wed', impressions: 5000 },
  { name: 'Thu', impressions: 2780 },
  { name: 'Fri', impressions: 6890 },
  { name: 'Sat', impressions: 4390 },
  { name: 'Sun', impressions: 7490 },
];

export default function Dashboard() {
  const [settlements, setSettlements] = useState([]);

  useEffect(() => {
    fetch("/api/settlements")
      .then(res => res.json())
      .then(data => setSettlements(data));
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Dashboard Overview</h1>
          <p className="text-sm text-muted mt-1">Synced with dev.giveabit.io · tools.giveabit.io/stranded · Real-time pipes (connect to activate)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardTitle>Ad Impressions Trend</CardTitle>
          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="name" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip contentStyle={{ backgroundColor: '#111', border: 'none' }} />
                <Line type="monotone" dataKey="impressions" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <CardTitle>Wallet Status</CardTitle>
          <div className="text-xl font-extrabold my-4 text-green">Connected</div>
          <div className="text-[11px] text-muted font-mono truncate mb-4">bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh</div>
          <Button variant="secondary" size="sm" className="w-full">Manage Profile</Button>
        </Card>
      </div>

      <Card>
        <CardTitle>Recent Settlements</CardTitle>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-muted text-left">
              <th className="p-4">ID</th>
              <th className="p-4">Amount (BTC)</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {settlements.slice(-5).map((s: any) => (
              <tr key={s.id} className="border-t border-border">
                <td className="p-4">{s.id}</td>
                <td className="p-4 font-mono">{s.amount.toFixed(8)}</td>
                <td className="p-4">{s.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </motion.div>
  );
}
