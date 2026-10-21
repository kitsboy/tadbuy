import { Link } from 'react-router-dom';
import { Check, X, Scale } from 'lucide-react';
import { Card, CardTitle } from '@/components/ui';
import { Badge } from '@/components/ui/Badge';
import { PageShell } from '@/components/PageShell';
import { usePageMeta } from '@/hooks/usePageMeta';
import { AD_PLATFORMS } from '@/data/platforms';
import { ArtCampaignScene } from '@/components/illustrations';

const ROWS = [
  { feature: 'Payment currency', tadbuy: 'Bitcoin-first design; no Tadbuy checkout connected', traditional: 'Varies by provider' },
  { feature: 'Settlement speed', tadbuy: 'Not available in this preview', traditional: 'Depends on provider and contract' },
  { feature: 'Platform fees', tadbuy: 'Planning assumptions only; not an active rate', traditional: 'Varies by provider and contract' },
  { feature: 'User tracking', tadbuy: 'No Tadbuy campaign tracking configured in this build', traditional: 'Varies by provider' },
  { feature: 'Data ownership', tadbuy: 'Campaign drafts stay in this browser', traditional: 'Varies by provider and product' },
  { feature: 'Audience targeting', tadbuy: 'Local planning inputs only; no audience activation', traditional: 'Varies by provider' },
  { feature: 'Publisher payout', tadbuy: 'Not connected', traditional: 'Varies by provider and contract' },
  { feature: 'Minimum spend', tadbuy: 'Example planning values only; not a quote', traditional: 'Varies by provider' },
  { feature: 'Agent API', tadbuy: 'Roadmap concept; no live buying API', traditional: 'Varies by provider' },
  { feature: 'Chargebacks', tadbuy: 'No Tadbuy payment or refund policy is active', traditional: 'Varies by provider and payment method' },
] as const;

function Cell({ value, highlight }: { value: string; highlight?: boolean }) {
  return (
    <td className={`px-4 py-3 text-xs ${highlight ? 'text-accent font-semibold' : 'text-muted'}`}>
      {value}
    </td>
  );
}

export default function Compare() {
  usePageMeta('Compare', 'Compare Tadbuy’s Bitcoin-first product direction with ad platforms. Tadbuy checkout, buying, targeting, and settlement are not live in this preview.');

  return (
    <PageShell
      title="Tadbuy direction vs traditional DSPs"
      description="A product-direction comparison, not a live service comparison. Tadbuy’s marketplace, checkout, targeting, delivery, and settlement are not connected in this preview; provider capabilities vary."
      badge={<Badge variant="accent" className="gap-1.5"><Scale className="w-3.5 h-3.5" /> Comparison</Badge>}
      breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Compare' }]}
      maxWidth="max-w-5xl"
      art={<ArtCampaignScene className="opacity-90" />}
    >
      <Card className="overflow-x-auto p-0">
        <table className="w-full min-w-[560px] text-left">
          <thead>
            <tr className="border-b border-border bg-surface/50">
              <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-muted">Feature</th>
              <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-accent">
                <span className="flex items-center gap-1"><Check className="w-3 h-3" /> Tadbuy</span>
              </th>
              <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-muted">
                <span className="flex items-center gap-1"><X className="w-3 h-3" /> Traditional DSP</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row, i) => (
              <tr key={row.feature} className={i % 2 === 0 ? 'bg-transparent' : 'bg-surface/30'}>
                <td className="px-4 py-3 text-xs font-bold text-text">{row.feature}</td>
                <Cell value={row.tadbuy} highlight />
                <Cell value={row.traditional} />
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Card className="overflow-x-auto p-0">
        <div className="px-4 py-3 border-b border-border">
          <CardTitle className="mb-0">Per-platform: fees, min spend, payout</CardTitle>
        </div>
        <table className="w-full min-w-[640px] text-left">
          <thead>
            <tr className="border-b border-border bg-surface/50">
              <th className="px-4 py-2 text-[10px] font-bold uppercase text-muted">Platform</th>
              <th className="px-4 py-2 text-[10px] font-bold uppercase text-muted">Billing</th>
              <th className="px-4 py-2 text-[10px] font-bold uppercase text-muted">Min spend</th>
              <th className="px-4 py-2 text-[10px] font-bold uppercase text-muted">Publisher payout</th>
              <th className="px-4 py-2 text-[10px] font-bold uppercase text-muted">Traditional fees</th>
            </tr>
          </thead>
          <tbody>
            {AD_PLATFORMS.map((p, i) => (
              <tr key={p.id} className={i % 2 === 0 ? 'bg-transparent' : 'bg-surface/30'}>
                <td className="px-4 py-2 text-xs font-bold">
                  <Link to={`/platforms/${p.slug}`} className="text-accent hover:underline">{p.name}</Link>
                </td>
                <td className="px-4 py-2 text-xs text-muted">{p.billingModel}</td>
                <td className="px-4 py-2 text-xs text-muted">${p.minSpendUsd}</td>
                <td className="px-4 py-2 text-xs text-muted">{p.payoutMethod}</td>
                <td className="px-4 py-2 text-xs text-muted">{p.traditionalFeeRange}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Card>
        <CardTitle>Product direction</CardTitle>
        <p className="text-sm text-muted leading-relaxed">
          Tadbuy is being designed around transparent, independent placements and Bitcoin-native settlement. Those capabilities are not live in this preview, and this comparison does not claim verified performance, fee, or settlement advantages over other providers.
        </p>
        <Link to="/platforms" className="text-sm text-accent hover:underline mt-3 inline-block">Explore all platform guides →</Link>
      </Card>
    </PageShell>
  );
}