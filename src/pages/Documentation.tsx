import { usePageMeta } from "@/hooks/usePageMeta";
import { BookOpen, Zap, Shield, Network, ExternalLink, ArrowRight, Store } from "lucide-react";
import { Card, CardTitle } from "@/components/ui";
import { Link } from "react-router-dom";
import { PageShell } from '@/components/PageShell';
import { ArtBlueprint } from '@/components/illustrations';
import { SafeLink } from '@/components/SafeLink';

export default function Documentation() {
  usePageMeta('Documentation', 'Bitcoin-native advertising guides, publisher onboarding, and platform billing.');
  return (
    <PageShell
      title="Documentation"
      description="Learn how advertisers and independent vendors coordinate transparent Bitcoin-native campaign placements."
      breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Docs' }]}
      maxWidth="max-w-4xl"
      art={<ArtBlueprint className="opacity-90" />}
    >

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass-panel p-6 hover:border-accent/50 transition-colors">
          <Zap className="w-8 h-8 text-lightning mb-4" />
          <CardTitle className="text-xl mb-2">Getting Started</CardTitle>
          <p className="text-sm text-muted mb-4 leading-relaxed">
            Prepare a local campaign preview with sample budgets and distribution concepts. This preview cannot accept Bitcoin or Lightning payments, create an order, or activate targeting.
          </p>
          <Link to="/" className="text-accent text-sm font-bold flex items-center gap-1 hover:underline">
            Create a Campaign <ArrowRight className="w-4 h-4" />
          </Link>
        </Card>

        <Card className="glass-panel p-6 hover:border-purple/50 transition-colors">
          <Shield className="w-8 h-8 text-purple mb-4" />
          <CardTitle className="text-xl mb-2">Privacy & PPQ.AI</CardTitle>
          <p className="text-sm text-muted mb-4 leading-relaxed">
            Understand how our Privacy-Preserving Quantization (PPQ) AI optimizes your ad spend without relying on invasive tracking cookies or PII.
          </p>
          <Link to="/ppq" className="text-purple text-sm font-bold flex items-center gap-1 hover:underline">
            Read the PPQ.AI Guide <ArrowRight className="w-4 h-4" />
          </Link>
        </Card>

        <Card className="glass-panel p-6 hover:border-blue/50 transition-colors">
          <Network className="w-8 h-8 text-blue mb-4" />
          <CardTitle className="text-xl mb-2">Publisher Portal</CardTitle>
          <p className="text-sm text-muted mb-4 leading-relaxed">
            Prepare private inventory drafts for properties you control. Publisher approval, live listings, payment verification, and payouts are not available in this preview.
          </p>
          <Link to="/publisher" className="text-blue text-sm font-bold flex items-center gap-1 hover:underline">
            Go to Publisher Portal <ArrowRight className="w-4 h-4" />
          </Link>
        </Card>

        <Card className="glass-panel p-6 hover:border-green/50 transition-colors">
          <BookOpen className="w-8 h-8 text-green mb-4" />
          <CardTitle className="text-xl mb-2">Hubhash Crowdfunding</CardTitle>
          <p className="text-sm text-muted mb-4 leading-relaxed">
            Pool funds with other advertisers to launch massive, coordinated campaigns. Learn how Hubhash smart contracts secure your pledges.
          </p>
          <Link to="/hubhash" className="text-green text-sm font-bold flex items-center gap-1 hover:underline">
            Explore Hubhash <ArrowRight className="w-4 h-4" />
          </Link>
        </Card>
      </div>

      <div className="mt-4">
        <Link to="/platforms" className="text-sm text-accent font-bold hover:underline">Platform budgeting & payout guides →</Link>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-6">Core Concepts</h2>
        <div className="space-y-4">
          <div className="bg-surface/50 border border-border rounded-xl p-6">
            <h3 className="text-lg font-bold text-text mb-2">The Tadbuy Architecture</h3>
            <p className="text-sm text-muted leading-relaxed mb-4">
              Tadbuy is currently a static campaign-planning preview, not an operating demand-side platform. No invoice, order, publisher payment, escrow, or campaign activation is connected. Any future Lightning design requires a reviewed payment service, settlement authority, ledger, operational controls, and explicit release approval; it would not be trustless or risk-free by default.
            </p>
            <SafeLink href="https://docs.lightning.engineering/" target="_blank" showIcon className="inline-flex items-center gap-1.5 text-xs font-bold text-muted hover:text-text transition-colors bg-white/5 px-3 py-1.5 rounded-full">
              <ExternalLink className="w-3 h-3" /> Lightning Network Architecture
            </SafeLink>
          </div>

          <div className="bg-surface/50 border border-border rounded-xl p-6">
            <h3 className="text-lg font-bold text-text mb-2">Nostr Integration</h3>
            <p className="text-sm text-muted leading-relaxed mb-4">
              Users may optionally publish a public text note through their own browser signer. A signed Nostr event and relay acknowledgement document publication only; they do not verify advertiser reputation, paid placement, audience, reach, or conversions.
            </p>
            <SafeLink href="https://github.com/nostr-protocol/nostr" target="_blank" showIcon className="inline-flex items-center gap-1.5 text-xs font-bold text-muted hover:text-text transition-colors bg-white/5 px-3 py-1.5 rounded-full">
              <ExternalLink className="w-3 h-3" /> Nostr Protocol Specs
            </SafeLink>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
