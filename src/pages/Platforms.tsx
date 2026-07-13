import { Link } from 'react-router-dom';
import { LayoutGrid, ArrowRight, Bitcoin } from 'lucide-react';
import { Card, Button } from '@/components/ui';
import { PageShell, StatusPill } from '@/components/PageShell';
import { usePageMeta } from '@/hooks/usePageMeta';
import { AD_PLATFORMS } from '@/data/platforms';
import { FeeBreakdown } from '@/components/FeeBreakdown';

export default function Platforms() {
  usePageMeta(
    'Ad Platforms',
    'How budgeting, payouts, and Bitcoin payments work on Twitter/X, Meta, YouTube, Nostr, and more.',
  );

  return (
    <PageShell
      title="Ad Platforms Hub"
      description="Understand how each network bills advertisers, pays publishers, and settles in Bitcoin via Tadbuy."
      badge={<StatusPill status="beta" />}
      breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Platforms' }]}
      showDemoBadge
      maxWidth="max-w-5xl"
      faq={[
        { question: 'How do I pay for ads?', answer: 'Pay in Bitcoin via Lightning, on-chain, or Fedimint ecash. Tadbuy applies a transparent 15% platform fee.' },
        { question: 'How do publishers get paid?', answer: 'Direct inventory publishers receive Lightning sats when thresholds are met. Platform-owned inventory follows each network billing rules with Bitcoin funding via Tadbuy.' },
      ]}
    >
      <Card className="glass-panel border-accent/20">
        <div className="flex items-start gap-3">
          <Bitcoin className="w-6 h-6 text-accent shrink-0" />
          <div>
            <h2 className="text-sm font-bold text-text mb-1">Money flow</h2>
            <p className="text-xs text-muted leading-relaxed">
              <strong className="text-text">Advertiser</strong> pays Tadbuy in sats →{' '}
              <strong className="text-text">Tadbuy</strong> allocates budget per platform rules →{' '}
              <strong className="text-text">Publisher</strong> receives Lightning rev-share on direct inventory.
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
              <div>{p.billingModel} · min ~${p.minSpendUsd}</div>
              <div>Publisher payout: {p.payoutMethod}</div>
            </div>
            <Link to={`/platforms/${p.slug}`}>
              <Button variant="secondary" className="w-full gap-2 text-xs">
                Budget & payout guide <ArrowRight className="w-3.5 h-3.5" />
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
        <Link to="/"><Button>Start a campaign</Button></Link>
        <Link to="/publisher"><Button variant="secondary">Publisher payout setup</Button></Link>
        <Link to="/ppq"><Button variant="secondary">PPQ budget optimizer</Button></Link>
      </div>
    </PageShell>
  );
}