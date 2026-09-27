import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { fetchMempoolFeeEstimates, type MempoolFeeEstimates } from '@/lib/bitcoin/l1Advanced';
import { Alert } from '@/components/ui/Alert';
import { Bitcoin, CheckCircle2, Clock3, Layers, LockKeyhole, Shield, Zap } from 'lucide-react';

const tabs = [
  { id: 'l1', label: 'Bitcoin L1', icon: Bitcoin },
  { id: 'lightning', label: 'Lightning', icon: Zap },
  { id: 'fedimint', label: 'Fedimint', icon: Shield },
  { id: 'liquid', label: 'Liquid', icon: Layers },
  { id: 'proof', label: 'Proof & privacy', icon: LockKeyhole },
] as const;

type ProtocolTab = typeof tabs[number]['id'];

type ReadinessState = 'reference' | 'staged' | 'research';

const protocolDetails: Record<ProtocolTab, { title: string; status: string; readiness: ReadinessState; description: string; facts: string[] }> = {
  l1: {
    title: 'Bitcoin on-chain',
    status: 'Reference only · no Tadbuy wallet',
    readiness: 'reference',
    description: 'This preview does not create invoices, track confirmations, or credit a Tadbuy account. A family receive address is not a Tadbuy wallet balance.',
    facts: ['Sats are the base accounting unit', 'No user balance or withdrawal ledger is connected', 'Verify any destination independently before sending funds'],
  },
  lightning: {
    title: 'Lightning Network',
    status: 'Staged · backend not connected',
    readiness: 'staged',
    description: 'No valid BOLT11 invoice is generated or checked in this build. Payment state cannot activate a campaign here.',
    facts: ['No LND payment verification is available on this site', 'No channel liquidity or wallet balance is shown as live', 'Lightning settlement requires an authorized, verified API'],
  },
  fedimint: {
    title: 'Give A Bit Fedimint',
    status: 'Staged · no federation session',
    readiness: 'staged',
    description: 'The shared mint is not connected in this preview. No invite is issued, no federation is joined, and no ecash is created or redeemed.',
    facts: ['Mint readiness depends on confirmed guardian and client compatibility', 'Ecash balances and vouchers are not available here', 'Never paste an invite, seed, or wallet secret into this demo'],
  },
  liquid: {
    title: 'Liquid Network',
    status: 'Research · separate trust model',
    readiness: 'research',
    description: 'Liquid is a separate federated sidechain with its own asset and trust model—not Bitcoin base-layer settlement. No Liquid address or transaction is generated here.',
    facts: ['L-BTC and issued assets are distinct network assets', 'Confidential transactions do not make a fabricated address valid', 'Any integration needs a clear federation and custody disclosure'],
  },
  proof: {
    title: 'Delivery evidence & privacy',
    status: 'Staged · review workflow only',
    readiness: 'staged',
    description: 'A reviewed publication reference can document delivery. This build does not create or verify zk-SNARKs, viewability proofs, impressions, clicks, or conversions.',
    facts: ['Nostr event IDs and relay acknowledgements can prove publication—not audience', 'Vendor-submitted evidence is reviewed separately from payment', 'No synthetic proof is represented as cryptographically verified'],
  },
};

const readinessLabels: Record<ReadinessState, string> = {
  reference: 'Reference',
  staged: 'Staged',
  research: 'Research',
};

export const BitcoinProtocolSuite: React.FC<{ defaultTab?: string }> = ({ defaultTab = 'l1' }) => {
  const [activeTab, setActiveTab] = useState<ProtocolTab>(
    tabs.some(tab => tab.id === defaultTab) ? defaultTab as ProtocolTab : 'l1'
  );
  const [feeEstimates, setFeeEstimates] = useState<MempoolFeeEstimates | null>(null);
  const [feeEstimateUpdatedAt, setFeeEstimateUpdatedAt] = useState<Date | null>(null);
  const [feeEstimateUnavailable, setFeeEstimateUnavailable] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchMempoolFeeEstimates()
      .then(fees => {
        if (!cancelled) {
          setFeeEstimates(fees);
          setFeeEstimateUpdatedAt(new Date());
        }
      })
      .catch(() => {
        if (!cancelled) setFeeEstimateUnavailable(true);
      });
    return () => { cancelled = true; };
  }, []);

  const active = protocolDetails[activeTab];
  const ActiveIcon = tabs.find(tab => tab.id === activeTab)?.icon ?? Bitcoin;

  return (
    <section className="glass-panel rounded-2xl border border-white/10 p-5 md:p-6 space-y-5" aria-labelledby="bitcoin-readiness-title">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Badge variant="warning" className="mb-2">Preview · no protocol transactions</Badge>
          <h2 id="bitcoin-readiness-title" className="text-xl md:text-2xl font-black tracking-tight text-white">
            Bitcoin rails & readiness
          </h2>
          <p className="mt-1 max-w-2xl text-xs md:text-sm leading-relaxed text-zinc-400">
            Bitcoin first, with clear boundaries between public references, staged payment services, and future network research.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-zinc-950/60 px-3 py-2 text-[11px] text-zinc-300">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-accent" />
          <span>Bitcoin-first · sats-denominated</span>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5" aria-label="Protocol maturity summary">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActiveTab(id)}
            aria-label={`${label}: ${readinessLabels[protocolDetails[id].readiness]}`}
            className={`flex min-h-11 items-center gap-2 rounded-xl border px-3 py-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${activeTab === id ? 'border-accent/50 bg-accent/10' : 'border-white/10 bg-zinc-950/40 hover:border-white/25'}`}
          >
            <Icon className={`h-4 w-4 shrink-0 ${activeTab === id ? 'text-accent' : 'text-zinc-400'}`} />
            <span className="min-w-0">
              <span className="block truncate text-[10px] font-bold text-zinc-200">{label}</span>
              <span className="block text-[9px] text-zinc-500">{readinessLabels[protocolDetails[id].readiness]}</span>
            </span>
          </button>
        ))}
      </div>

      <Alert variant="warning" title="No Tadbuy wallet or payment is connected">
        These readiness previews create no payment, invoice, escrow, offer, voucher, cryptographic proof, or balance. No sats move from this page.
      </Alert>

      <div id="protocol-panel" role="tabpanel" aria-label={`${active.title} readiness`} className="rounded-2xl border border-white/10 bg-zinc-950/50 p-4 md:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="rounded-xl border border-accent/20 bg-accent/10 p-2.5 text-accent"><ActiveIcon className="h-5 w-5" /></div>
            <div>
              <h3 className="text-base font-extrabold text-white">{active.title}</h3>
              <p className="mt-1 text-xs text-zinc-400">{active.description}</p>
            </div>
          </div>
          <Badge variant="outline" className="w-fit shrink-0">{active.status}</Badge>
        </div>
        <ul className="mt-4 grid gap-2 sm:grid-cols-3">
          {active.facts.map(fact => (
            <li key={fact} className="rounded-xl border border-white/5 bg-white/[0.02] p-3 text-[11px] leading-relaxed text-zinc-300">{fact}</li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-2 rounded-xl border border-white/10 bg-zinc-950/40 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-xs font-bold text-zinc-200">
          <Clock3 className="h-4 w-4 text-zinc-400" /> Public on-chain fee reference
        </div>
        {feeEstimates ? (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] text-zinc-300" aria-label="Current public mempool fee estimates">
            <span>Fast {feeEstimates.fastestFee} sat/vB</span>
            <span>30m {feeEstimates.halfHourFee} sat/vB</span>
            <span>1h {feeEstimates.hourFee} sat/vB</span>
            <span className="basis-full text-[10px] text-zinc-500">Public reference from mempool.space · fetched {feeEstimateUpdatedAt?.toLocaleTimeString() ?? 'just now'} · not a Tadbuy quote or wallet connection</span>
          </div>
        ) : (
          <span className="text-[11px] text-zinc-500">{feeEstimateUnavailable ? 'Public fee estimate unavailable; no fallback value shown.' : 'Loading public fee reference… no fallback value is used.'}</span>
        )}
      </div>
    </section>
  );
};
