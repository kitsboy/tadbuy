import { usePageMeta } from "@/hooks/usePageMeta";
import { QrCode, RefreshCw, ShieldCheck, ExternalLink, Zap } from "lucide-react";
import { Card, CardTitle } from "@/components/ui";
import { PageShell } from '@/components/PageShell';
import { ArtLightningFlow } from '@/components/illustrations';
import { SafeLink } from '@/components/SafeLink';

export default function Bolt12Info() {
  usePageMeta('BOLT 12 Offers — Research', 'BOLT 12 protocol overview and future design considerations. No Tadbuy offer or payment flow is connected.');
  return (
    <PageShell
      title="BOLT 12 Offers"
      description="Protocol research only. Tadbuy has no BOLT 12 offer, invoice, payment, or publisher payout integration."
      breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'BOLT 12' }]}
      maxWidth="max-w-4xl"
      art={<ArtLightningFlow className="opacity-90" />}
    >

      <div className="bg-purple/10 border border-purple/20 rounded-2xl p-8 mb-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <QrCode className="w-48 h-48 text-purple" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-2xl font-bold text-text mb-4">What is BOLT 12?</h2>
          <p className="text-sm text-muted leading-relaxed mb-6">
            BOLT 11 invoices are commonly single-use payment requests; exact service and invoice-generation requirements depend on the implementation.
            <br /><br />
            <strong>BOLT 12 Offers</strong> are a Lightning protocol design for requesting invoices from compatible nodes. Actual behavior depends on wallet and node support, routing, connectivity, and implementation; a static offer is not itself a payment or proof of settlement. Tadbuy does not create or accept BOLT 12 payments in this preview.
          </p>
          <SafeLink href="https://bolt12.org/" target="_blank" showIcon className="inline-flex items-center gap-2 bg-purple text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-purple/80 transition-colors">
            Visit BOLT12.org <ExternalLink className="w-4 h-4" />
          </SafeLink>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-2">BOLT 12: a research option, not an integration</h2>
      <p className="mb-6 text-xs text-muted">No Tadbuy Lightning node, offer endpoint, invoice verification, publisher payout, or settlement ledger is connected. Revisit this design only after the node/API, ledger, threat model, and release gates are approved.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass-panel p-6">
          <RefreshCw className="w-8 h-8 text-accent mb-4" />
          <CardTitle className="text-xl mb-2">Reusable Campaigns</CardTitle>
          <p className="text-sm text-muted leading-relaxed">
            A compatible node may expose an Offer for repeated invoice requests. Tadbuy currently has no Offer or campaign-top-up flow; no funds can be sent through this page.
          </p>
        </Card>

        <Card className="glass-panel p-6">
          <ShieldCheck className="w-8 h-8 text-green mb-4" />
          <CardTitle className="text-xl mb-2">Enhanced Privacy</CardTitle>
          <p className="text-sm text-muted leading-relaxed">
            BOLT 12 includes privacy-related protocol mechanisms, including blinded paths in some flows. They do not guarantee anonymity or eliminate metadata, and Tadbuy has not implemented or assessed a BOLT 12 threat model.
          </p>
        </Card>

        <Card className="glass-panel p-6">
          <Zap className="w-8 h-8 text-lightning mb-4" />
          <CardTitle className="text-xl mb-2">Publisher payout design · not available</CardTitle>
          <p className="text-sm text-muted leading-relaxed">
            Tadbuy does not send publisher payouts or stream micro-payments. Future payout handling needs approved vendor identities, a reconciled ledger, settlement controls, and a reviewed Lightning implementation.
          </p>
        </Card>
      </div>

      <div className="mt-12 pt-8 border-t border-border">
        <h3 className="text-sm font-bold uppercase tracking-widest text-text mb-4">Technical Resources</h3>
        <div className="flex flex-col gap-3">
          <SafeLink href="https://github.com/lightning/bolts/pull/798" target="_blank" showIcon className="inline-flex items-center gap-2 text-sm text-muted hover:text-accent transition-colors">
            <ExternalLink className="w-4 h-4" /> Lightning RFC: BOLT 12 Specification
          </SafeLink>
          <SafeLink href="https://corelightning.org/docs/" target="_blank" showIcon className="inline-flex items-center gap-2 text-sm text-muted hover:text-accent transition-colors">
            <ExternalLink className="w-4 h-4" /> Core Lightning Implementation Docs
          </SafeLink>
        </div>
      </div>
    </PageShell>
  );
}
