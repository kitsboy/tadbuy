import { Link } from 'react-router-dom';
import { Activity, Bitcoin, CheckCircle2, Circle, ShieldAlert } from 'lucide-react';
import { Alert } from '@/components/ui/Alert';
import { Card, CardTitle } from '@/components/ui';

const READY = [
  'Explore illustrative placement concepts and market data',
  'Optionally publish a Nostr note with your own browser signer; this is not a paid ad placement',
];

const GATES = [
  { title: 'Bitcoin node', detail: 'Finish blockchain sync, then verify network, sync height, and node health locally. Keep RPC/gRPC private; a synced node does not accept or account for Tadbuy campaign funds.', icon: Bitcoin },
  { title: 'Lightning service + ledger', detail: 'Separately verify the Lightning daemon, liquidity and recovery plan; then approve a payment service, authoritative settlement signal, reconciled ledger, limits, monitoring, and rollback.', icon: Activity },
  { title: 'Publisher pilot + release', detail: 'Approved vendors, controlled inventory, commercial rules, security review, support ownership, and explicit release approval are still required.', icon: ShieldAlert },
];

export function PreviewReadinessPanel({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <Card className="border-accent/25 bg-surface/70" data-testid="preview-readiness-panel">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-1 text-[10px] font-bold uppercase tracking-widest text-accent">Launch readiness · preview build</div>
            <CardTitle className="mb-1 text-sm">No live buying or settlement</CardTitle>
            <p className="text-[11px] leading-relaxed text-muted">Node sync is not visible here. Once it finishes, verify Bitcoin node health and network locally; Lightning service readiness, payment verification, ledger, and release approval are separate gates.</p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3 text-[11px] font-bold">
            <Link to="/beta" className="text-accent hover:underline">Readiness details</Link>
            <Link to="/wallet" className="text-accent hover:underline">Bitcoin rails</Link>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="border-accent/25 bg-surface/70" data-testid="preview-readiness-panel">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="mb-1 text-[10px] font-bold uppercase tracking-widest text-accent">Launch readiness · preview build</div>
          <CardTitle className="mb-0">What works now / what must be ready first</CardTitle>
        </div>
        <span className="rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 text-[10px] font-bold text-accent">No campaign payments</span>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section aria-labelledby="readiness-usable-heading" className="rounded-xl border border-green/20 bg-green/5 p-4">
          <h3 id="readiness-usable-heading" className="mb-3 flex items-center gap-2 text-xs font-extrabold text-green">
            <CheckCircle2 className="h-4 w-4" /> Usable in this preview
          </h3>
          <ul className="space-y-2 text-[11px] leading-relaxed text-muted">
            {READY.map(item => <li key={item} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green" />{item}</li>)}
          </ul>
        </section>

        <section aria-labelledby="readiness-gates-heading" className="rounded-xl border border-border bg-black/10 p-4">
          <h3 id="readiness-gates-heading" className="mb-3 flex items-center gap-2 text-xs font-extrabold text-text">
            <Circle className="h-4 w-4 text-accent" /> Gates before live buying
          </h3>
          <ul className="space-y-3">
            {GATES.map(({ title, detail, icon: Icon }) => (
              <li key={title} className="flex gap-2.5 text-[11px] leading-relaxed text-muted">
                <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
                <span><strong className="text-text">{title}:</strong> {detail}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="mt-4 rounded-xl border border-border bg-black/10 p-4" aria-labelledby="umbrel-post-sync-heading">
        <h3 id="umbrel-post-sync-heading" className="mb-2 text-xs font-extrabold text-text">After Umbrel finishes syncing · verify locally</h3>
        <ol className="list-decimal space-y-1 pl-4 text-[11px] leading-relaxed text-muted">
          <li>Confirm the intended Bitcoin network (mainnet only when explicitly approved) and that initial block sync is complete with a current, advancing tip.</li>
          <li>Check Umbrel/Bitcoin Core health, storage space, and backup/recovery status; resolve warnings before connecting any service.</li>
          <li>Separately identify the Lightning implementation and version; verify daemon health, node identity, peers, online channels, and usable inbound/outbound liquidity.</li>
          <li>Do not fund channels or accept campaign funds as part of this readiness check. Keep RPC/gRPC private; never paste seed words, macaroons, certificates, or credentials into Tadbuy or Git.</li>
          <li>Before any real campaign flow: approved private server-side connection, test-only invoice/status and replay/expiry cases, reconciled ledger, refund/support/incident plan, security review, and explicit release approval.</li>
        </ol>
        <p className="mt-2 text-[10px] text-muted">This static preview cannot read node progress or perform these checks for you.</p>
      </section>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-[11px] font-bold">
        <Link to="/beta" className="text-accent hover:underline">See capability status</Link>
        <Link to="/wallet" className="text-accent hover:underline">Review payment readiness</Link>
      </div>
    </Card>
  );
}
