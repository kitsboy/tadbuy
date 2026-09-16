import { useState } from 'react';
import { Activity, Map, Gift, Leaf, Bot } from 'lucide-react';
import { Card, CardTitle, Input } from '@/components/ui';
import { usePageMeta } from '@/hooks/usePageMeta';
import { PageShell } from '@/components/PageShell';
import { Link } from 'react-router-dom';

// Labelled demo state — the platform has no status/roadmap/AI backend on the static
// host, so these surfaces render representative content and never make a request.
const ROADMAP_SAMPLE = [
  { id: '1', title: 'Nostr-native ad delivery', votes: 320, status: 'In progress' },
  { id: '2', title: 'Fedimint ecash settlements', votes: 210, status: 'Planned' },
  { id: '3', title: 'Self-custodial wallet dashboard', votes: 188, status: 'Planned' },
  { id: '4', title: 'Publisher placement marketplace', votes: 144, status: 'Planned' },
];

export default function Enterprise() {
  usePageMeta('Enterprise', 'Status page, roadmap, referral program, AI strategist, and enterprise security features.');

  const roadmap = ROADMAP_SAMPLE;
  const [aiQuestion, setAiQuestion] = useState('');

  return (
    <PageShell
      title="Enterprise & Scale"
      description="Security, observability, and growth tools."
      breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Enterprise' }]}
      maxWidth="max-w-5xl"
      showDemoBadge
    >
      <Card className="glass-panel border-green/20">
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-green" />
          System Status
        </CardTitle>
        <p className="text-xs text-muted mt-1">
          This build is a demo-mode preview — a live status endpoint connects once the platform API is online.
        </p>
      </Card>

      <div className="grid grid-cols-3 gap-4">
        {(['performance', 'accessibility', 'seo'] as const).map(k => (
          <Card key={k} className="text-center p-4">
            <div className="text-2xl font-extrabold text-accent">—</div>
            <div className="text-[10px] text-muted uppercase">{k}</div>
          </Card>
        ))}
      </div>

      <Card className="glass-panel">
        <CardTitle className="flex items-center gap-2"><Map className="w-4 h-4" /> Public Roadmap</CardTitle>
        <p className="text-xs text-muted mb-3">Sample roadmap — live voting connects once the API is online.</p>
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
          <span className="text-xs text-muted self-center">Preview — no backend yet</span>
        </div>
        <p className="text-xs text-muted">
          The AI strategist connects once the platform API is online. In the meantime, use the campaign builder on the
          home page for a guided, demo-mode launch.
        </p>
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
        <Link to="/pitch"><button className="px-4 py-2 rounded-lg bg-accent text-white text-sm font-semibold">View Investor Pitch →</button></Link>
      </div>
    </PageShell>
  );
}