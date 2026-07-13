import { Link } from 'react-router-dom';
import { Check, X, Scale } from 'lucide-react';
import { Card, CardTitle } from '@/components/ui';
import { Badge } from '@/components/ui/Badge';
import { PageShell } from '@/components/PageShell';
import { usePageMeta } from '@/hooks/usePageMeta';
import { AD_PLATFORMS } from '@/data/platforms';

const ROWS = [
  { feature: 'Payment currency', tadbuy: 'Bitcoin / sats only', traditional: 'USD, credit cards, invoicing' },
  { feature: 'Settlement speed', tadbuy: '< 1 second (Lightning)', traditional: '30–90 day net terms' },
  { feature: 'Platform fees', tadbuy: '15% transparent', traditional: '20–40% + hidden margins' },
  { feature: 'User tracking', tadbuy: 'No surveillance pixels', traditional: 'Cross-site cookies & ID graphs' },
  { feature: 'Data ownership', tadbuy: 'Self-custodial spend', traditional: 'Platform holds your budget' },
  { feature: 'Audience targeting', tadbuy: 'Geo + interest (PPQ.AI)', traditional: 'Behavioral profiling' },
  { feature: 'Publisher payout', tadbuy: 'Instant Lightning sats', traditional: 'Monthly ACH/wire' },
  { feature: 'Minimum spend', tadbuy: '~$5 equivalent in sats', traditional: '$500–$10,000 minimums' },
  { feature: 'Agent API', tadbuy: 'Nostr + REST agents', traditional: 'Locked enterprise APIs' },
  { feature: 'Chargebacks', tadbuy: 'None (Bitcoin finality)', traditional: 'Disputes & clawbacks' },
] as const;

function Cell({ value, highlight }: { value: string; highlight?: boolean }) {
  return (
    <td className={`px-4 py-3 text-xs ${highlight ? 'text-accent font-semibold' : 'text-muted'}`}>
      {value}
    </td>
  );
}

export default function Compare() {
  usePageMeta('Compare', 'Tadbuy vs traditional DSP — Bitcoin-native advertising without surveillance.');

  return (
    <PageShell
      title="Tadbuy vs Traditional DSP"
      description="See how Bitcoin-native ad buying stacks up against legacy demand-side platforms built on surveillance capitalism and fiat settlement delays."
      badge={<Badge variant="accent" className="gap-1.5"><Scale className="w-3.5 h-3.5" /> Comparison</Badge>}
      breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Compare' }]}
      maxWidth="max-w-5xl"
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
        <CardTitle>Why switch?</CardTitle>
        <p className="text-sm text-muted leading-relaxed">
          Traditional DSPs take weeks to settle, charge opaque fees, and build audiences from
          cross-site tracking. Tadbuy settles in sats, publishes every fee upfront, and targets
          without surveillance — aligned with Bitcoin&apos;s values of sovereignty and privacy.
        </p>
        <Link to="/platforms" className="text-sm text-accent hover:underline mt-3 inline-block">Explore all platform guides →</Link>
      </Card>
    </PageShell>
  );
}