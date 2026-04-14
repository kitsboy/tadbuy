import { motion } from "motion/react";
import { QrCode, RefreshCw, ShieldCheck, ExternalLink, Zap } from "lucide-react";
import { Card, CardTitle } from "@/components/ui";

export default function Bolt12Info() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-8">
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight mb-4">BOLT 12 Offers</h1>
        <p className="text-lg text-muted max-w-2xl">
          Tadbuy utilizes BOLT 12, the next-generation Lightning Network standard, to enable seamless, private, and reusable payments.
        </p>
      </div>

      <div className="bg-purple/10 border border-purple/20 rounded-2xl p-8 mb-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <QrCode className="w-48 h-48 text-purple" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-2xl font-bold text-text mb-4">What is BOLT 12?</h2>
          <p className="text-sm text-muted leading-relaxed mb-6">
            BOLT 11 invoices (the standard Lightning invoices) are single-use and require the receiver to run a web server to generate a new invoice for every payment. 
            <br /><br />
            <strong>BOLT 12 "Offers"</strong> solve this. An Offer is a static string (like a permanent QR code) that a user can scan multiple times. When scanned, the user's wallet automatically requests a fresh invoice directly over the Lightning Network via Onion Messages.
          </p>
          <a href="https://bolt12.org/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-purple text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-purple/80 transition-colors">
            Visit BOLT12.org <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-6">Why Tadbuy uses BOLT 12</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass-panel p-6">
          <RefreshCw className="w-8 h-8 text-accent mb-4" />
          <CardTitle className="text-xl mb-2">Reusable Campaigns</CardTitle>
          <p className="text-sm text-muted leading-relaxed">
            Advertisers can fund their campaigns using a single static Offer. You can save the QR code and send more funds whenever your campaign budget runs low, without needing to log back into the dashboard.
          </p>
        </Card>

        <Card className="glass-panel p-6">
          <ShieldCheck className="w-8 h-8 text-green mb-4" />
          <CardTitle className="text-xl mb-2">Enhanced Privacy</CardTitle>
          <p className="text-sm text-muted leading-relaxed">
            BOLT 12 uses Route Blinding. When you pay a Tadbuy publisher, your node doesn't know their exact identity or IP address, and they don't know yours. It provides ultimate financial privacy.
          </p>
        </Card>

        <Card className="glass-panel p-6">
          <Zap className="w-8 h-8 text-lightning mb-4" />
          <CardTitle className="text-xl mb-2">Serverless Publisher Payouts</CardTitle>
          <p className="text-sm text-muted leading-relaxed">
            Publishers don't need to run complex infrastructure to receive payouts. They simply provide a static BOLT 12 Offer, and Tadbuy streams micro-payments to them as ads are served.
          </p>
        </Card>
      </div>

      <div className="mt-12 pt-8 border-t border-border">
        <h3 className="text-sm font-bold uppercase tracking-widest text-text mb-4">Technical Resources</h3>
        <div className="flex flex-col gap-3">
          <a href="https://github.com/lightning/bolts/pull/798" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-muted hover:text-accent transition-colors">
            <ExternalLink className="w-4 h-4" /> Lightning RFC: BOLT 12 Specification
          </a>
          <a href="https://corelightning.org/docs/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-muted hover:text-accent transition-colors">
            <ExternalLink className="w-4 h-4" /> Core Lightning Implementation Docs
          </a>
        </div>
      </div>
    </motion.div>
  );
}
