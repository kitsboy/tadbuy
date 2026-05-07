import { useParams } from 'react-router-dom';
import { campaigns } from '@/data/campaigns';
import { Card, CardTitle } from '@/components/ui';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const data = [
  { name: 'Mon', impressions: 4000, clicks: 240 },
  { name: 'Tue', impressions: 3000, clicks: 139 },
  { name: 'Wed', impressions: 2000, clicks: 980 },
  { name: 'Thu', impressions: 2780, clicks: 390 },
  { name: 'Fri', impressions: 1890, clicks: 480 },
  { name: 'Sat', impressions: 2390, clicks: 380 },
  { name: 'Sun', impressions: 3490, clicks: 430 },
];

export default function MetricsEmbed() {
  const { id } = useParams();
  const campaign = campaigns.find(c => c.id === id);

  if (!campaign) return <div className="p-4 text-red">Campaign not found</div>;

  return (
    <div className="p-4 bg-bg min-h-screen">
      <Card className="h-full border-accent/20 shadow-[0_0_20px_rgba(247,147,26,0.05)]">
        <div className="flex justify-between items-center mb-4">
          <div>
            <CardTitle className="text-sm mb-0">{campaign.name}</CardTitle>
            <div className="text-[10px] text-muted uppercase tracking-widest font-bold">Real-time Metrics</div>
          </div>
          <div className="text-right">
            <div className="text-lg font-extrabold text-accent">{campaign.impressions.toLocaleString()}</div>
            <div className="text-[9px] text-muted uppercase tracking-tighter">Total Impressions</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-surface/50 p-2 rounded-lg border border-border/50">
            <div className="text-[8px] text-muted uppercase font-bold">Clicks</div>
            <div className="text-sm font-bold">{campaign.clicks.toLocaleString()}</div>
          </div>
          <div className="bg-surface/50 p-2 rounded-lg border border-border/50">
            <div className="text-[8px] text-muted uppercase font-bold">CTR</div>
            <div className="text-sm font-bold text-green">{campaign.ctr}%</div>
          </div>
          <div className="bg-surface/50 p-2 rounded-lg border border-border/50">
            <div className="text-[8px] text-muted uppercase font-bold">Spend</div>
            <div className="text-sm font-bold text-accent">{campaign.spendBtc.toFixed(4)} ₿</div>
          </div>
        </div>

        <div className="h-[180px] w-full">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#71717a', fontSize: 10 }} 
              />
              <YAxis hide />
              <Tooltip 
                contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px', fontSize: '10px' }}
                itemStyle={{ color: '#f7931a' }}
              />
              <Bar dataKey="impressions" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === data.length - 1 ? '#f7931a' : '#27272a'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <img src="https://camtaylor.ca/wp-content/uploads/2019/02/Bitcoin.svg.png" alt="BTC" className="w-3 h-3" referrerPolicy="no-referrer" />
            <span className="text-[9px] font-bold text-muted uppercase tracking-widest">Powered by Tadbuy</span>
          </div>
          <div className="text-[9px] text-muted italic">Live updates via Hubhash</div>
        </div>
      </Card>
    </div>
  );
}
