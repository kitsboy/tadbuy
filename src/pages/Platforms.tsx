import { Link } from 'react-router-dom';
import { LayoutGrid, ArrowRight, Bitcoin } from 'lucide-react';
import { Card, Button } from '@/components/ui';
import { PageShell, StatusPill } from '@/components/PageShell';
import { ArtGlobeZap } from '@/components/illustrations';
import { usePageMeta } from '@/hooks/usePageMeta';
import { AD_PLATFORMS } from '@/data/platforms';
import { FeeBreakdown } from '@/components/FeeBreakdown';

export default function Platforms() {
  usePageMeta(
    'Ad Platforms',
    'Illustrative platform guides for the Tadbuy roadmap. No provider buying, publisher payouts, or Bitcoin payments are connected in this preview.',
  );

  return (
    <PageShell
      title="Platform examples & roadmap"
      description="Illustrative network and publisher-channel guidance only. Tadbuy has no connected provider integrations, live buying, publisher payouts, or Bitcoin campaign settlement."
      badge={<StatusPill status="planned" />}
      breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Platforms' }]}
      showDemoBadge
      maxWidth="max-w-5xl"
      art={<ArtGlobeZap className="opacity-90" />}
      faq={[
        { question: 'How do I pay for ads?', answer: 'Campaign payments are not available in this preview. Bitcoin and Lightning are design goals; no invoice or campaign payment can be created here.' },
        { question: 'How do publishers get paid?', answer: 'Publisher onboarding, earnings records, and payouts are not connected. Draft profile data does not activate inventory or establish a payout obligation.' },
      ]}
    >
      <Card className="glass-panel border-accent/20">
        <div className="flex items-start gap-3">
          <Bitcoin className="w-6 h-6 text-accent shrink-0" />
          <div>
            <h2 className="text-sm font-bold text-text mb-1">Money flow</h2>
            <p className="text-xs text-muted leading-relaxed">
              <strong className="text-text">Current preview:</strong> no connected buying, payment, allocation, delivery, or publisher payout flow.{' '}
              Bitcoin-native settlement is a future design goal, subject to verified infrastructure and explicit release gates.
            </p>
            <Link to="/compare" className="text-xs text-accent hover:underline mt-2 inline-block">Compare vs traditional DSP →</Link>
          </div>
        </div>
      </Card>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {AD_PLATFORMS.map(p => (
          <Card key={p.id} className="glass-panel hover:border-accent/30 transition-colors flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <p.icon className={`w-5 h-5 ${p.color}`} />
              <span className="font-bold text-sm">{p.name}</span>
              <StatusPill status={p.integrationStatus} />
            </div>
            <p className="text-xs text-muted flex-1 mb-3">{p.description}</p>
            <div className="text-[10px] text-muted font-mono space-y-1 mb-4">
              <div>Example billing model: {p.billingModel} · indicative minimum ~${p.minSpendUsd}</div>
              <div>Example payout concept: {p.payoutMethod} · not connected</div>
            </div>
            <Link to={`/platforms/${p.slug}`}>
              <Button variant="secondary" className="w-full gap-2 text-xs">
                View illustrative guide <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </Card>
        ))}
      </div>

      <Card className="glass-panel">
        <div className="flex items-center gap-2 mb-3">
          <LayoutGrid className="w-5 h-5 text-blue" />
          <h2 className="text-sm font-bold">Sample fee on $100 campaign</h2>
        </div>
        <FeeBreakdown budgetSats={Math.round((100 / 100_000) * 100_000_000)} budgetUsd={100} />
      </Card>

      <div className="flex flex-wrap gap-3">
        <Link to="/"><Button>Plan a campaign preview</Button></Link>
        <Link to="/publisher"><Button variant="secondary">Publisher workspace</Button></Link>
        <Link to="/ppq"><Button variant="secondary">PPQ planning guide</Button></Link>
      </div>
    </PageShell>
  );
}