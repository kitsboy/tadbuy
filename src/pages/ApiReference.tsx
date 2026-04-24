import { motion } from "motion/react";
import { Code, Terminal, ExternalLink, Copy, CheckCircle2 } from "lucide-react";
import { Card, CardTitle } from "@/components/ui";
import { useState } from "react";
import { usePageTitle } from "@/hooks/usePageTitle";

export default function ApiReference() {
  usePageTitle('API Reference');
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-8">
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight mb-4">API Reference</h1>
        <p className="text-lg text-muted max-w-2xl">
          Integrate Tadbuy programmatically. Manage campaigns, fetch real-time metrics, and automate publisher settlements using our REST API.
        </p>
      </div>

      <Card className="glass-panel p-6 border-accent/20">
        <div className="flex items-center gap-3 mb-4">
          <ShieldIcon />
          <CardTitle className="text-xl m-0">Authentication</CardTitle>
        </div>
        <p className="text-sm text-muted mb-4 leading-relaxed">
          Tadbuy uses LSATs (Lightning Service Authentication Tokens) and Macaroons for API authentication. 
          You must include your Macaroon in the <code className="bg-bg px-1.5 py-0.5 rounded text-accent">Grpc-Metadata-macaroon</code> header.
        </p>
        <div className="bg-bg p-4 rounded-xl border border-border font-mono text-xs text-muted relative group">
          <pre>
{`curl -X GET https://api.tadbuy.giveabit.io/v1/campaigns \\
  -H "Grpc-Metadata-macaroon: YOUR_MACAROON_HEX"`}
          </pre>
          <button 
            onClick={() => handleCopy('curl -X GET https://api.tadbuy.giveabit.io/v1/campaigns -H "Grpc-Metadata-macaroon: YOUR_MACAROON_HEX"', 'auth')}
            className="absolute top-3 right-3 p-1.5 bg-surface rounded-md hover:bg-white/10 transition-colors"
          >
            {copied === 'auth' ? <CheckCircle2 className="w-4 h-4 text-green" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </Card>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Endpoints</h2>

        {/* Endpoint 1 */}
        <div className="bg-surface/30 border border-border rounded-xl overflow-hidden">
          <div className="flex items-center gap-3 bg-surface/50 p-4 border-b border-border">
            <span className="bg-green/10 text-green font-bold text-[10px] px-2 py-1 rounded uppercase tracking-widest">POST</span>
            <code className="font-mono text-sm font-bold">/v1/campaigns</code>
          </div>
          <div className="p-6">
            <p className="text-sm text-muted mb-4">Creates a new ad campaign and returns a BOLT 11 or BOLT 12 payment request for funding.</p>
            <h4 className="text-xs font-bold uppercase tracking-widest text-text mb-2">Request Body (JSON)</h4>
            <pre className="bg-bg p-4 rounded-xl border border-border font-mono text-xs text-muted overflow-x-auto">
{`{
  "name": "My API Campaign",
  "budget_sats": 50000,
  "platforms": ["twitter", "nostr"],
  "targeting": {
    "interests": ["bitcoin", "tech"]
  }
}`}
            </pre>
          </div>
        </div>

        {/* Endpoint 2 */}
        <div className="bg-surface/30 border border-border rounded-xl overflow-hidden">
          <div className="flex items-center gap-3 bg-surface/50 p-4 border-b border-border">
            <span className="bg-blue/10 text-blue font-bold text-[10px] px-2 py-1 rounded uppercase tracking-widest">GET</span>
            <code className="font-mono text-sm font-bold">/v1/metrics/:campaign_id</code>
          </div>
          <div className="p-6">
            <p className="text-sm text-muted mb-4">Fetches real-time performance metrics for a specific campaign.</p>
            <h4 className="text-xs font-bold uppercase tracking-widest text-text mb-2">Response (JSON)</h4>
            <pre className="bg-bg p-4 rounded-xl border border-border font-mono text-xs text-muted overflow-x-auto">
{`{
  "id": "camp_98234",
  "status": "live",
  "impressions": 14502,
  "clicks": 342,
  "spend_sats": 12500
}`}
            </pre>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-8 border-t border-border">
        <a href="https://swagger.io/specification/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-muted hover:text-accent transition-colors">
          <ExternalLink className="w-4 h-4" /> View full OpenAPI Specification
        </a>
      </div>
    </motion.div>
  );
}

function ShieldIcon() {
  return (
    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
      <Terminal className="w-5 h-5 text-accent" />
    </div>
  );
}
