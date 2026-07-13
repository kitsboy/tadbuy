import { Link, useParams, Navigate } from 'react-router-dom';
import { Bitcoin, Wallet, TrendingUp } from 'lucide-react';
import { Card, CardTitle, Button } from '@/components/ui';
import { PageShell, StatusPill } from '@/components/PageShell';
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
    platform ? `${platform.name} Ads — Budget & Payout` : 'Platform',
    platform?.description ?? 'Ad platform guide',
  );

  if (!platform) return <Navigate to="/platforms" replace />;

  const cpm = cpmWithFee(platform.cpmUsdBase);
  const sampleBudgetUsd = platform.recommendedBudgetUsd;
  const sampleSats = usdToMinSats(sampleBudgetUsd, 100_000);

  return (
    <PageShell
      title={`${platform.name} — Budget & Payout`}
      description={platform.description}
      badge={<StatusPill status={platform.integrationStatus} />}
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Platforms', href: '/platforms' },
        { label: platform.name },
      ]}
      showDemoBadge
      actions={
        <Link to={`/?platforms=${platform.id}`}>
          <Button className="gap-2 text-xs"><TrendingUp className="w-4 h-4" /> Buy on {platform.name}</Button>
        </Link>
      }
      faq={[
        { question: `What is the minimum spend on ${platform.name}?`, answer: `Approximately $${platform.minSpendUsd} USD equivalent in sats.` },
        { question: `How does ${platform.name} billing work?`, answer: platform.budgetingNotes },
        { question: 'How do publishers get paid?', answer: platform.payoutNotes },
      ]}
    >
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="glass-panel">
          <CardTitle className="text-xs uppercase tracking-widest text-muted">Billing model</CardTitle>
          <p className="text-2xl font-extrabold text-accent">{platform.billingModel}</p>
          <p className="text-xs text-muted mt-1">~${cpm.toFixed(2)} CPM (incl. {(PLATFORM_FEE_RATE * 100).toFixed(0)}% fee)</p>
        </Card>
        <Card className="glass-panel">
          <CardTitle className="text-xs uppercase tracking-widest text-muted">Min spend</CardTitle>
          <p className="text-2xl font-extrabold text-text">${platform.minSpendUsd}</p>
          <p className="text-xs text-muted mt-1">Recommended: ${platform.recommendedBudgetUsd}</p>
        </Card>
        <Card className="glass-panel">
          <CardTitle className="text-xs uppercase tracking-widest text-muted">Publisher threshold</CardTitle>
          <p className="text-2xl font-extrabold text-lightning">{platform.publisherPayoutThresholdSats.toLocaleString()} sats</p>
          <p className="text-xs text-muted mt-1">{platform.revSharePct}% rev-share to publishers</p>
        </Card>
      </div>

      <Card className="glass-panel">
        <CardTitle>Budgeting</CardTitle>
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

      <Link to="/platforms"><Button variant="secondary">← All platforms</Button></Link>
    </PageShell>
  );
}