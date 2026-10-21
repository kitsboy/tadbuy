import { Link, useParams, Navigate } from 'react-router-dom';
import { Bitcoin, Wallet, TrendingUp, ShieldAlert } from 'lucide-react';
import { Card, CardTitle, Button } from '@/components/ui';
import { PageShell, StatusPill } from '@/components/PageShell';
import { ArtGlobeZap } from '@/components/illustrations';
import { FeeBreakdown } from '@/components/FeeBreakdown';
import { usePageMeta } from '@/hooks/usePageMeta';
import { getPlatformById, usdToMinSats, PLATFORM_FEE_RATE } from '@/data/platforms';

function cpmWithFee(cpmBase: number) {
  return cpmBase * (1 + PLATFORM_FEE_RATE);
}

export default function PlatformDetail() {
  const { slug } = useParams<{ slug: string }>();
  const platform = slug ? getPlatformById(slug) : undefined;

  usePageMeta(
    platform ? `${platform.name} Ads — illustrative guide` : 'Platform',
    platform?.description ?? 'Illustrative ad platform guide; no provider buying or publisher payouts are connected.',
  );

  if (!platform) return <Navigate to="/platforms" replace />;

  const cpm = cpmWithFee(platform.cpmUsdBase);
  const sampleBudgetUsd = platform.recommendedBudgetUsd;
  const sampleSats = usdToMinSats(sampleBudgetUsd, 100_000);

  return (
    <PageShell
      title={`${platform.name} — illustrative guide`}
      description={`${platform.description} Budget and CPM values below are examples, not quotes or live bids.`}
      badge={<StatusPill status={platform.integrationStatus} />}
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Platforms', href: '/platforms' },
        { label: platform.name },
      ]}
      showDemoBadge
      actions={
        <Link to={`/?platforms=${platform.id}`}>
          <Button className="gap-2 text-xs"><TrendingUp className="w-4 h-4" /> Plan example</Button>
        </Link>
      }
      art={<ArtGlobeZap className="opacity-90" />}
      faq={[
        { question: `What is the minimum spend on ${platform.name}?`, answer: `The ~$${platform.minSpendUsd} figure is an illustrative planning value, not a Tadbuy quote or an active provider minimum. Verify current terms directly with the provider.` },
        { question: `How does ${platform.name} billing work?`, answer: platform.budgetingNotes },
        { question: 'How do publishers get paid?', answer: platform.payoutNotes },
      ]}
    >
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="glass-panel">
          <CardTitle className="text-xs uppercase tracking-widest text-muted">Example billing model</CardTitle>
          <p className="text-2xl font-extrabold text-accent">{platform.billingModel}</p>
          <p className="text-xs text-muted mt-1">Illustrative CPM: ~${cpm.toFixed(2)} · not a quote</p>
        </Card>
        <Card className="glass-panel">
          <CardTitle className="text-xs uppercase tracking-widest text-muted">Example minimum</CardTitle>
          <p className="text-2xl font-extrabold text-text">~${platform.minSpendUsd}</p>
          <p className="text-xs text-muted mt-1">Illustrative budget: ~${platform.recommendedBudgetUsd} · verify with provider</p>
        </Card>
        <Card className="glass-panel">
          <CardTitle className="text-xs uppercase tracking-widest text-muted">Publisher payment</CardTitle>
          <p className="text-lg font-extrabold text-muted">Not connected</p>
          <p className="text-xs text-muted mt-1">No Tadbuy rev-share or payout terms are active.</p>
        </Card>
      </div>

      <Card className="glass-panel border-accent/20">
        <CardTitle className="flex items-center gap-2"><ShieldAlert className="h-4 w-4 text-accent" /> Preview only</CardTitle>
        <p className="text-xs text-muted">Tadbuy has no connected {platform.name} buying, provider authorization, live publisher inventory, or payout service. All budgets, fees, and formats on this page are illustrative; verify current provider information independently.</p>
      </Card>

      <Card className="glass-panel">
        <CardTitle>Illustrative budgeting guide</CardTitle>
        <p className="text-sm text-muted leading-relaxed">{platform.budgetingNotes}</p>
        <p className="text-xs text-muted mt-2">Traditional fee range: {platform.traditionalFeeRange}</p>
      </Card>

      <Card className="glass-panel">
        <CardTitle className="flex items-center gap-2"><Wallet className="w-4 h-4" /> Payouts</CardTitle>
        <p className="text-sm text-muted leading-relaxed">{platform.payoutNotes}</p>
        <p className="text-xs text-muted mt-2">Cadence: {platform.payoutCadence}</p>
        <p className="text-xs text-muted">Who holds budget: {platform.whoHoldsBudget}</p>
      </Card>

      <Card className="glass-panel">
        <CardTitle className="flex items-center gap-2"><Bitcoin className="w-4 h-4 text-accent" /> Bitcoin payments</CardTitle>
        <p className="text-sm text-muted leading-relaxed">{platform.bitcoinNotes}</p>
      </Card>

      <Card className="glass-panel">
        <CardTitle>Ad formats</CardTitle>
        <div className="flex flex-wrap gap-2">
          {platform.adFormats.map(f => (
            <span key={f} className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-surface border border-border text-muted">{f}</span>
          ))}
        </div>
      </Card>

      <FeeBreakdown budgetSats={sampleSats} budgetUsd={sampleBudgetUsd} />

      <Link to="/platforms"><Button variant="secondary">← All platform examples</Button></Link>
    </PageShell>
  );
}