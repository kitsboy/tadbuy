import { useState } from 'react';
import { motion } from "motion/react";
import { Card, CardTitle } from "@/components/ui";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";

const data = [
  { name: 'Mon', impressions: 4000, clicks: 2400 },
  { name: 'Tue', impressions: 3000, clicks: 1398 },
  { name: 'Wed', impressions: 5000, clicks: 3800 },
  { name: 'Thu', impressions: 2780, clicks: 1908 },
  { name: 'Fri', impressions: 6890, clicks: 4800 },
  { name: 'Sat', impressions: 4390, clicks: 2800 },
  { name: 'Sun', impressions: 7490, clicks: 5200 },
];

export default function CampaignAnalytics() {
  const [platform, setPlatform] = useState('all');
  const [dateRange, setDateRange] = useState('7d');

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold tracking-tight">Campaign Analytics</h1>
        <div className="flex gap-2">
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-panel">
          <CardTitle>Impressions vs Clicks</CardTitle>
          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
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
              <LineChart data={data}>
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
