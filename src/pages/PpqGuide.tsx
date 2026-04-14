import { motion } from "motion/react";
import { BrainCircuit, Lock, Zap, ExternalLink, Activity } from "lucide-react";
import { Card, CardTitle } from "@/components/ui";

export default function PpqGuide() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-8">
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight mb-4">PPQ.AI Guide</h1>
        <p className="text-lg text-muted max-w-2xl">
          Privacy-Preserving Quantization (PPQ) is Tadbuy's proprietary AI engine. It optimizes your ad delivery without compromising user privacy.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card className="glass-panel p-6 text-center flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-purple/10 flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-purple" />
          </div>
          <h3 className="font-bold text-text mb-2">Zero PII</h3>
          <p className="text-xs text-muted">No cookies, no tracking pixels, no personal data. Models are trained on aggregated, anonymized edge data.</p>
        </Card>
        
        <Card className="glass-panel p-6 text-center flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
            <BrainCircuit className="w-6 h-6 text-accent" />
          </div>
          <h3 className="font-bold text-text mb-2">Federated Learning</h3>
          <p className="text-xs text-muted">The AI model learns locally on publisher nodes and only shares quantized weight updates with the central network.</p>
        </Card>

        <Card className="glass-panel p-6 text-center flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-green/10 flex items-center justify-center mb-4">
            <Activity className="w-6 h-6 text-green" />
          </div>
          <h3 className="font-bold text-text mb-2">Auto-Rebalancing</h3>
          <p className="text-xs text-muted">PPQ automatically shifts your budget to the platforms and creatives generating the highest CTR in real-time.</p>
        </Card>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-bold mb-4">How PPQ.AI Works</h2>
          <div className="bg-surface/30 border border-border rounded-xl p-6 text-sm text-muted leading-relaxed space-y-4">
            <p>
              Traditional ad networks rely on invasive tracking cookies to build profiles on users. Tadbuy flips this model. 
              Using <strong>Federated Learning</strong> and <strong>Quantization</strong>, our AI models are pushed to the edge (the publisher's site).
            </p>
            <p>
              When a user interacts with an ad, the model learns from the context of the page and the interaction, but the user's data never leaves their device. 
              Instead, the model computes a tiny, encrypted update (a quantized gradient) and sends only that mathematical update back to Tadbuy.
            </p>
            <p>
              This allows us to achieve highly targeted, high-conversion ad placements while guaranteeing mathematical privacy for the end-user.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Configuration Options</h2>
          <div className="grid gap-4">
            <div className="bg-surface/50 border border-border rounded-xl p-5 flex gap-4">
              <Zap className="w-6 h-6 text-lightning shrink-0" />
              <div>
                <h4 className="font-bold text-text mb-1">Auto-Rebalance</h4>
                <p className="text-xs text-muted">When enabled, PPQ will automatically pause underperforming variants and reallocate budget to the highest converting ads.</p>
              </div>
            </div>
            <div className="bg-surface/50 border border-border rounded-xl p-5 flex gap-4">
              <BrainCircuit className="w-6 h-6 text-purple shrink-0" />
              <div>
                <h4 className="font-bold text-text mb-1">Sentiment Filter</h4>
                <p className="text-xs text-muted">Uses NLP to analyze the context of the publisher's page. Prevents your ads from appearing next to negative or brand-damaging content.</p>
              </div>
            </div>
          </div>
        </section>

        <div className="pt-8 border-t border-border flex flex-col gap-3">
          <h3 className="text-sm font-bold uppercase tracking-widest text-text">Further Reading</h3>
          <a href="https://federated.withgoogle.com/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-muted hover:text-accent transition-colors">
            <ExternalLink className="w-4 h-4" /> Google AI: Federated Learning Overview
          </a>
          <a href="https://arxiv.org/abs/1712.05877" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-muted hover:text-accent transition-colors">
            <ExternalLink className="w-4 h-4" /> Research Paper: Deep Learning with Differential Privacy
          </a>
        </div>
      </div>
    </motion.div>
  );
}
