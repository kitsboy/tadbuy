import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Activity, Map, Gift, Leaf, Bot } from 'lucide-react';
import { Card, CardTitle, Button, Input } from '@/components/ui';
import { usePageMeta } from '@/hooks/usePageMeta';
import { PageShell } from '@/components/PageShell';
import { Link } from 'react-router-dom';

export default function Enterprise() {
  usePageMeta('Enterprise', 'Status page, roadmap, referral program, AI strategist, and enterprise security features.');

  const [status, setStatus] = useState<{ status: string; uptime: number; services: Record<string, string> } | null>(null);
  const [roadmap, setRoadmap] = useState<{ id: string; title: string; votes: number; status: string }[]>([]);
  const [lighthouse, setLighthouse] = useState<{ performance: number; accessibility: number; seo: number } | null>(null);
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiAnswer, setAiAnswer] = useState('');

  useEffect(() => {
    fetch('/api/v4/status').then(r => r.json()).then(setStatus).catch(() => {});
    fetch('/api/v4/roadmap').then(r => r.json()).then(d => setRoadmap(d.items ?? [])).catch(() => {});
    fetch('/api/v4/lighthouse').then(r => r.json()).then(setLighthouse).catch(() => {});
  }, []);

  const askStrategist = async () => {
    const res = await fetch('/api/v4/ai/strategist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: aiQuestion }),
    });
    const data = await res.json();
    setAiAnswer(data.answer);
  };

  return (
    <PageShell
      title="Enterprise & Scale"
      description="Security, observability, and growth tools."
      breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Enterprise' }]}
      maxWidth="max-w-5xl"
      showDemoBadge
    >
      {status && (
        <Card className="glass-panel border-green/20">
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-green" />
            System Status — <span className="text-green capitalize">{status.status}</span>
          </CardTitle>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-2">
            {Object.entries(status.services).map(([k, v]) => (
              <div key={k} className="text-center p-2 rounded-lg bg-surface border border-border">
                <div className={`w-2 h-2 rounded-full mx-auto mb-1 ${v === 'up' ? 'bg-green' : 'bg-red'}`} />
                <div className="text-[10px] font-bold uppercase">{k}</div>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted mt-3 font-mono">{status.uptime}% uptime · Fedimint operational</p>
        </Card>
      )}

      {lighthouse && (
        <div className="grid grid-cols-3 gap-4">
          {(['performance', 'accessibility', 'seo'] as const).map(k => (
            <Card key={k} className="text-center p-4">
              <div className="text-2xl font-extrabold text-accent">{lighthouse[k]}</div>
              <div className="text-[10px] text-muted uppercase">{k}</div>
            </Card>
          ))}
        </div>
      )}

      <Card className="glass-panel">
        <CardTitle className="flex items-center gap-2"><Map className="w-4 h-4" /> Public Roadmap</CardTitle>
        <div className="space-y-2">
          {roadmap.map(item => (
            <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-surface border border-border">
              <span className="text-sm font-medium">{item.title}</span>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted">{item.votes} votes</span>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-accent/10 text-accent">{item.status}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="glass-panel">
        <CardTitle className="flex items-center gap-2"><Bot className="w-4 h-4 text-purple" /> AI Campaign Strategist</CardTitle>
        <div className="flex gap-2 mb-3">
          <Input value={aiQuestion} onChange={e => setAiQuestion(e.target.value)} placeholder="How should I launch my first Bitcoin ad?" className="flex-1" />
          <Button onClick={askStrategist}>Ask</Button>
        </div>
        {aiAnswer && <p className="text-sm text-muted bg-surface p-3 rounded-lg border border-border">{aiAnswer}</p>}
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        <Card className="glass-panel">
          <CardTitle className="flex items-center gap-2"><Gift className="w-4 h-4 text-accent" /> Referral Program</CardTitle>
          <p className="text-sm text-muted">Earn 5,000 sats per referral. Code: <strong className="text-accent font-mono">TADBIT</strong></p>
        </Card>
        <Card className="glass-panel">
          <CardTitle className="flex items-center gap-2"><Leaf className="w-4 h-4 text-green" /> Carbon Offset</CardTitle>
          <p className="text-sm text-muted">Offset campaign carbon via Bitcoin mining credits.</p>
        </Card>
      </div>

      <div className="text-center">
        <Link to="/pitch"><Button variant="secondary">View Investor Pitch →</Button></Link>
      </div>
    </PageShell>
  );
}