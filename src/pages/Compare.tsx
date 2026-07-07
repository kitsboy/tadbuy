import { motion } from 'motion/react';
import { Check, X, Scale } from 'lucide-react';
import { Card, CardTitle } from '@/components/ui';
import { Badge } from '@/components/ui/Badge';
import { usePageMeta } from '@/hooks/usePageMeta';

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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-6 pb-16 p-4 md:p-8"
    >
      <div>
        <Badge variant="accent" className="mb-3">
          <Scale className="w-3.5 h-3.5" />
          Comparison
        </Badge>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
          Tadbuy vs Traditional DSP
        </h1>
        <p className="text-sm text-muted mt-2 max-w-2xl">
          See how Bitcoin-native ad buying stacks up against legacy demand-side platforms
          built on surveillance capitalism and fiat settlement delays.
        </p>
      </div>

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

      <Card>
        <CardTitle>Why switch?</CardTitle>
        <p className="text-sm text-muted leading-relaxed">
          Traditional DSPs take weeks to settle, charge opaque fees, and build audiences from
          cross-site tracking. Tadbuy settles in sats, publishes every fee upfront, and targets
          without surveillance — aligned with Bitcoin&apos;s values of sovereignty and privacy.
        </p>
      </Card>
    </motion.div>
  );
}