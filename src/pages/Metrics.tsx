import { motion } from "motion/react";
import { Card, CardTitle, Button, Select, InfoTooltip } from "@/components/ui";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Twitter, Facebook, Youtube, Zap, MessageSquare, Smartphone, Monitor, Tablet, Globe, ArrowUpRight, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { usePageTitle } from "@/hooks/usePageTitle";

const data = [
  { name: 'Mar 1', spend: 4000, sats: 120000 },
  { name: 'Mar 2', spend: 3000, sats: 180000 },
  { name: 'Mar 3', spend: 2000, sats: 220000 },
  { name: 'Mar 4', spend: 2780, sats: 160000 },
  { name: 'Mar 5', spend: 1890, sats: 280000 },
  { name: 'Mar 6', spend: 2390, sats: 340000 },
  { name: 'Mar 7', spend: 3490, sats: 360000 },
];

export default function Metrics() {
  usePageTitle('Metrics & Analytics');
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Ad Metrics Report", 10, 10);
    autoTable(doc, {
      head: [['Date', 'Spend (Sats)']],
      body: data.map(d => [d.name, d.sats]),
    });
    doc.save("metrics-report.pdf");
  };

  const downloadCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Date,Spend (Sats)\n" + 
      data.map(d => `${d.name},${d.sats}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "metrics-report.csv");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Ad Metrics & Analytics</h1>
          <p className="text-sm text-muted mt-1">All currencies · All platforms · Live + historical · Pipes to dev.giveabit.io</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={downloadPDF} className="flex items-center gap-2"><Download className="w-4 h-4" /> PDF</Button>
          <Button variant="secondary" onClick={downloadCSV} className="flex items-center gap-2"><Download className="w-4 h-4" /> CSV</Button>
          <Select className="w-auto">
            <option>All Platforms</option>
            <option>Twitter/X</option>
            <option>Nostr</option>
            <option>Facebook</option>
          </Select>
          <Select className="w-auto">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>This month</option>
            <option>All time</option>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="glass-panel relative group hover:border-green/50 transition-all duration-300 before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-green before:rounded-t-xl shadow-lg">
          <div className="text-[10px] text-muted uppercase tracking-widest font-bold mb-2 flex items-center">
            Impressions
            <InfoTooltip content="Total number of times your ad was served to users." />
          </div>
          <div className="text-3xl font-extrabold my-1 text-green group-hover:scale-105 transition-transform origin-left">1.24M</div>
          <div className="text-[11px] text-muted font-mono">total reach</div>
          <div className="text-[11px] font-bold text-green mt-3 flex items-center gap-1.5 bg-green/10 w-fit px-2 py-0.5 rounded-full">
            <ArrowUpRight className="w-3 h-3" /> +8.1% WoW
          </div>
        </Card>
        <Card className="glass-panel relative group hover:border-blue/50 transition-all duration-300 before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-blue before:rounded-t-xl shadow-lg">
          <div className="text-[10px] text-muted uppercase tracking-widest font-bold mb-2 flex items-center">
            Clicks
            <InfoTooltip content="Number of times users clicked on your ad to visit your destination." />
          </div>
          <div className="text-3xl font-extrabold my-1 text-blue group-hover:scale-105 transition-transform origin-left">14,820</div>
          <div className="text-[11px] text-muted font-mono">unique: 12,440</div>
          <div className="text-[11px] font-bold text-green mt-3 flex items-center gap-1.5 bg-green/10 w-fit px-2 py-0.5 rounded-full">
            <ArrowUpRight className="w-3 h-3" /> +18.2% WoW
          </div>
        </Card>
        <Card className="glass-panel relative group hover:border-accent/50 transition-all duration-300 before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-accent before:rounded-t-xl shadow-lg">
          <div className="text-[10px] text-muted uppercase tracking-widest font-bold mb-2 flex items-center">
            Avg CTR
            <InfoTooltip content="Click-Through Rate: The percentage of impressions that resulted in a click (Clicks / Impressions)." />
          </div>
          <div className="text-3xl font-extrabold my-1 text-accent group-hover:scale-105 transition-transform origin-left">1.20%</div>
          <div className="text-[11px] text-muted font-mono">industry avg: 0.9%</div>
          <div className="text-[11px] font-bold text-green mt-3 flex items-center gap-1.5 bg-green/10 w-fit px-2 py-0.5 rounded-full">
            <ArrowUpRight className="w-3 h-3" /> above benchmark
          </div>
        </Card>
        <Card className="glass-panel relative group hover:border-purple/50 transition-all duration-300 before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-purple before:rounded-t-xl shadow-lg">
          <div className="text-[10px] text-muted uppercase tracking-widest font-bold mb-2 flex items-center">
            Conversions
            <InfoTooltip content="Number of desired actions (e.g., signups, purchases) completed after clicking an ad." />
          </div>
          <div className="text-3xl font-extrabold my-1 text-purple group-hover:scale-105 transition-transform origin-left">842</div>
          <div className="text-[11px] text-muted font-mono">CVR: 5.68%</div>
          <div className="text-[11px] font-bold text-green mt-3 flex items-center gap-1.5 bg-green/10 w-fit px-2 py-0.5 rounded-full">
            <ArrowUpRight className="w-3 h-3" /> +3.2% WoW
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="glass-panel border-border/40 bg-surface/10 backdrop-blur-xl">
          <CardTitle className="flex items-center">
            Spend breakdown — multi-currency
            <InfoTooltip content="Real-time conversion of your ad spend across multiple global currencies and Bitcoin." />
          </CardTitle>
          <div className="grid gap-3 text-[13px]">
            {[
              { label: 'Bitcoin (BTC)', value: '0.04230000 ₿', color: 'text-accent', font: 'font-mono' },
              { label: 'Satoshis (sats)', value: '4,230,000 ⚡', color: 'text-lightning', font: 'font-mono' },
              { label: 'US Dollar', value: '$407.53', color: 'text-text', font: 'font-sans' },
              { label: 'Euro', value: '€376.15', color: 'text-text', font: 'font-sans' },
              { label: 'British Pound', value: '£321.95', color: 'text-text', font: 'font-sans' },
              { label: 'Australian Dollar', value: 'A$620.44', color: 'text-text', font: 'font-sans' },
              { label: 'Nigerian Naira', value: '₦632,410', color: 'text-text', font: 'font-sans' },
              { label: 'Brazilian Real', value: 'R$2,118', color: 'text-text', font: 'font-sans' },
            ].map(item => (
              <div key={item.label} className="flex justify-between p-3 bg-card/50 rounded-xl border border-border/50 hover:border-accent/30 transition-colors group">
                <span className="text-muted group-hover:text-text transition-colors">{item.label}</span>
                <span className={`font-bold ${item.color} ${item.font}`}>{item.value}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="glass-panel border-border/40 bg-surface/10 backdrop-blur-xl">
          <CardTitle className="flex items-center">
            Performance by platform
            <InfoTooltip content="How your ads are performing across different social networks and protocols." />
          </CardTitle>
          <div className="grid gap-5 mb-10">
            {[
              { name: 'Twitter/X', icon: Twitter, stats: '10.4% CTR · $115.70 spend', pct: 78, color: 'bg-green', text: 'text-green' },
              { name: 'Nostr', icon: Zap, stats: '8.0% CTR · $81.92 spend', pct: 62, color: 'bg-accent', text: 'text-accent' },
              { name: 'Facebook', icon: Facebook, stats: '2.1% CTR · $85.22 spend', pct: 45, color: 'bg-blue', text: 'text-blue' },
              { name: 'YouTube', icon: Youtube, stats: '0.18% CTR · $210 spend', pct: 30, color: 'bg-purple', text: 'text-purple' },
              { name: 'Reddit', icon: MessageSquare, stats: '3.4% CTR · $44.20 spend', pct: 38, color: 'bg-muted', text: 'text-muted' },
            ].map(p => (
              <div key={p.name} className="group">
                <div className="flex justify-between text-xs mb-2">
                  <span className="flex items-center gap-2 font-bold group-hover:text-accent transition-colors"><p.icon className="w-4 h-4" /> {p.name}</span>
                  <span className={`${p.text} font-mono`}>{p.stats}</span>
                </div>
                <div className="bg-surface rounded-full h-2 overflow-hidden border border-border/30">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${p.pct}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full rounded-full transition-all ${p.color} shadow-[0_0_10px_rgba(0,0,0,0.2)]`} 
                  />
                </div>
              </div>
            ))}
          </div>

          <CardTitle className="flex items-center">
            Daily spend trend (sats)
            <InfoTooltip content="Visual representation of your daily ad spend denominated in Satoshis (sats)." />
          </CardTitle>
          <div className="h-48 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSats" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f7931a" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f7931a" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3a" vertical={false} />
                <XAxis dataKey="name" stroke="#6b6b8a" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#6b6b8a" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `${val / 1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#16161f', borderColor: '#2a2a3a', borderRadius: '8px' }}
                  itemStyle={{ color: '#f7931a' }}
                />
                <Area type="monotone" dataKey="sats" stroke="#f7931a" strokeWidth={2} fillOpacity={1} fill="url(#colorSats)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-panel">
          <CardTitle className="flex items-center">
            Audience breakdown
            <InfoTooltip content="Geographic distribution of the users who are seeing and interacting with your ads." />
          </CardTitle>
          <div className="grid gap-3 text-[13px]">
            {[
              { name: 'United States', pct: 42, color: 'bg-blue' },
              { name: 'United Kingdom', pct: 18, color: 'bg-blue' },
              { name: 'Canada', pct: 12, color: 'bg-blue' },
              { name: 'Australia', pct: 9, color: 'bg-blue' },
              { name: 'Other', pct: 19, color: 'bg-muted' },
            ].map(item => (
              <div key={item.name}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5 text-muted" /> {item.name}</span>
                  <span>{item.pct}%</span>
                </div>
                <div className="bg-surface rounded h-1.5 overflow-hidden">
                  <div className={`h-full rounded transition-all ${item.color}`} style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
        
        <Card className="glass-panel">
          <CardTitle className="flex items-center">
            Device split
            <InfoTooltip content="The types of devices users are using when they interact with your ads." />
          </CardTitle>
          <div className="grid gap-3 text-[13px] mb-8">
            {[
              { name: 'Mobile', icon: Smartphone, pct: 64, color: 'bg-green' },
              { name: 'Desktop', icon: Monitor, pct: 31, color: 'bg-accent' },
              { name: 'Tablet', icon: Tablet, pct: 5, color: 'bg-muted' },
            ].map(item => (
              <div key={item.name}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="flex items-center gap-1.5"><item.icon className="w-3.5 h-3.5 text-muted" /> {item.name}</span>
                  <span>{item.pct}%</span>
                </div>
                <div className="bg-surface rounded h-1.5 overflow-hidden">
                  <div className={`h-full rounded transition-all ${item.color}`} style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
          
          <CardTitle className="flex items-center">
            Age breakdown
            <InfoTooltip content="Demographic distribution by age of your ad audience." />
          </CardTitle>
          <div className="grid gap-3 text-[13px]">
            {[
              { name: '18–24', pct: 22, color: 'bg-purple' },
              { name: '25–34', pct: 38, color: 'bg-purple' },
              { name: '35–44', pct: 28, color: 'bg-purple' },
              { name: '45+', pct: 12, color: 'bg-muted' },
            ].map(item => (
              <div key={item.name}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span>{item.name}</span>
                  <span>{item.pct}%</span>
                </div>
                <div className="bg-surface rounded h-1.5 overflow-hidden">
                  <div className={`h-full rounded transition-all ${item.color}`} style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="glass-panel">
          <CardTitle className="flex items-center">
            Key KPIs
            <InfoTooltip content="Key Performance Indicators: Essential metrics to measure the success of your campaigns." />
          </CardTitle>
          <div className="grid gap-2.5 text-[13px]">
            {[
              { label: 'ROAS', value: '4.2x', color: 'text-green font-bold', desc: 'Return On Ad Spend: Revenue generated for every dollar spent on ads.' },
              { label: 'Avg CPC', value: '$0.027 · 28 sats', desc: 'Cost Per Click: The average amount you pay for each click on your ad.' },
              { label: 'Avg CPM', value: '$0.33', desc: 'Cost Per Mille: The cost you pay for 1,000 ad impressions.' },
              { label: 'CPA', value: '$0.48 · 499 sats', desc: 'Cost Per Action: The average cost to acquire a conversion.' },
              { label: 'Bounce rate', value: '38.2%', desc: 'The percentage of visitors who leave after viewing only one page.' },
              { label: 'Avg session', value: '2m 14s', desc: 'The average duration of a user session on your site.' },
              { label: 'Frequency', value: '2.4x / user', desc: 'The average number of times each unique user has seen your ad.' },
              { label: 'Viewability', value: '72%', color: 'text-green font-bold', desc: 'The percentage of ads that were actually seen by users.' },
            ].map(item => (
              <div key={item.label} className="flex justify-between p-2.5 bg-surface rounded-lg group relative">
                <span className="text-muted flex items-center">
                  {item.label}
                  <InfoTooltip content={item.desc} />
                </span>
                <span className={item.color}>{item.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </motion.div>
  );
}
