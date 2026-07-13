import { Link } from 'react-router-dom';
import { BrainCircuit, Lock, Zap, ExternalLink, Activity } from 'lucide-react';
import { Card } from '@/components/ui';
import { PageShell } from '@/components/PageShell';
import { usePageMeta } from '@/hooks/usePageMeta';
import { AD_PLATFORMS } from '@/data/platforms';

export default function PpqGuide() {
  usePageMeta('PPQ.AI Guide', 'Privacy-preserving budget optimization across ad platforms.');

  return (
    <PageShell
      title="PPQ.AI Guide"
      description="Privacy-Preserving Quantization optimizes delivery and budget allocation without surveillance tracking."
      breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'PPQ.AI' }]}
      maxWidth="max-w-4xl"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-panel p-6 text-center flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-purple/10 flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-purple" />
          </div>
          <h3 className="font-bold text-text mb-2">Zero PII</h3>
          <p className="text-xs text-muted">No cookies, no tracking pixels. Models use aggregated edge data only.</p>
        </Card>
        <Card className="glass-panel p-6 text-center flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
            <BrainCircuit className="w-6 h-6 text-accent" />
          </div>
          <h3 className="font-bold text-text mb-2">Federated Learning</h3>
          <p className="text-xs text-muted">Models learn on publisher nodes; only quantized weight updates sync centrally.</p>
        </Card>
        <Card className="glass-panel p-6 text-center flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-green/10 flex items-center justify-center mb-4">
            <Activity className="w-6 h-6 text-green" />
          </div>
          <h3 className="font-bold text-text mb-2">Auto-Rebalancing</h3>
          <p className="text-xs text-muted">Shifts budget to platforms and creatives with highest CTR in real time.</p>
        </Card>
      </div>

      <Card className="glass-panel">
        <h2 className="text-lg font-bold mb-3">Platform budget rules PPQ uses</h2>
        <div className="space-y-2">
          {AD_PLATFORMS.map(p => (
            <div key={p.id} className="flex justify-between text-xs border-b border-border/50 py-2 last:border-0">
              <Link to={`/platforms/${p.slug}`} className="font-semibold text-accent hover:underline">{p.name}</Link>
              <span className="text-muted">{p.billingModel} · min ${p.minSpendUsd} · {p.revSharePct}% publisher share</span>
            </div>
          ))}
        </div>
        <Link to="/" className="text-xs text-accent hover:underline mt-4 inline-block">Enable PPQ in campaign builder →</Link>
      </Card>

      <Card className="glass-panel text-sm text-muted leading-relaxed space-y-3">
        <p>
          Traditional ad networks rely on invasive cookies. Tadbuy uses federated learning at the edge —
          users never export raw data; only encrypted gradient updates return to the network.
        </p>
        <div className="grid gap-3 pt-2">
          <div className="flex gap-3">
            <Zap className="w-5 h-5 text-lightning shrink-0" />
            <div>
              <h4 className="font-bold text-text text-xs">Auto-Rebalance</h4>
              <p className="text-[11px]">Pauses underperforming variants and reallocates sats to winners.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <BrainCircuit className="w-5 h-5 text-purple shrink-0" />
            <div>
              <h4 className="font-bold text-text text-xs">Sentiment Filter</h4>
              <p className="text-[11px]">Keeps ads off brand-damaging publisher context.</p>
            </div>
          </div>
        </div>
      </Card>

      <div className="flex flex-col gap-2 text-sm">
        <a href="https://federated.withgoogle.com/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-muted hover:text-accent">
          <ExternalLink className="w-4 h-4" /> Federated Learning overview
        </a>
      </div>
    </PageShell>
  );
}