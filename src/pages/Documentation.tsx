import { motion } from "motion/react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { BookOpen, Zap, Shield, Network, ExternalLink, ArrowRight } from "lucide-react";
import { Card, CardTitle } from "@/components/ui";
import { Link } from "react-router-dom";

export default function Documentation() {
  usePageTitle('Documentation');
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-8">
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight mb-4">Documentation</h1>
        <p className="text-lg text-muted max-w-2xl">
          Learn how to use Tadbuy to launch privacy-preserving, Bitcoin-native advertising campaigns across the decentralized web.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass-panel p-6 hover:border-accent/50 transition-colors">
          <Zap className="w-8 h-8 text-lightning mb-4" />
          <CardTitle className="text-xl mb-2">Getting Started</CardTitle>
          <p className="text-sm text-muted mb-4 leading-relaxed">
            Launch your first campaign in minutes. Learn how to set budgets, target audiences, and fund your campaign instantly using the Lightning Network.
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
            Monetize your app or website. Learn how to list ad slots, accept direct bids, and receive instant payouts via BOLT 12 or On-Chain Bitcoin.
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

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Core Concepts</h2>
        <div className="space-y-4">
          <div className="bg-surface/50 border border-border rounded-xl p-6">
            <h3 className="text-lg font-bold text-text mb-2">The Tadbuy Architecture</h3>
            <p className="text-sm text-muted leading-relaxed mb-4">
              Tadbuy operates as a decentralized demand-side platform (DSP). Instead of holding your funds in custody, Tadbuy generates 
              cryptographic invoices (BOLT 11 or BOLT 12) that route payments directly to publishers or liquidity pools. 
              This ensures trustless execution and zero counterparty risk.
            </p>
            <a href="https://docs.lightning.engineering/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-bold text-muted hover:text-text transition-colors bg-white/5 px-3 py-1.5 rounded-full">
              <ExternalLink className="w-3 h-3" /> External: Lightning Network Architecture
            </a>
          </div>

          <div className="bg-surface/50 border border-border rounded-xl p-6">
            <h3 className="text-lg font-bold text-text mb-2">Nostr Integration</h3>
            <p className="text-sm text-muted leading-relaxed mb-4">
              Tadbuy leverages the Nostr protocol for decentralized identity and ad delivery verification. By signing campaign 
              events with your Nostr keypair, you establish a verifiable, censorship-resistant reputation as an advertiser.
            </p>
            <a href="https://github.com/nostr-protocol/nostr" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-bold text-muted hover:text-text transition-colors bg-white/5 px-3 py-1.5 rounded-full">
              <ExternalLink className="w-3 h-3" /> External: Nostr Protocol Specs
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
