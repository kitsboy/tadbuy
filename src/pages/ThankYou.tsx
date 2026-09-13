import { Link } from "react-router-dom";
import { usePageMeta } from '@/hooks/usePageMeta';
import { CheckCircle2, Zap, ShieldCheck, ArrowRight, BookOpen, Store } from "lucide-react";
import { Button } from "@/components/ui";
import { EmptyState } from "@/components/ui/EmptyState";

export default function ThankYou() {
  usePageMeta('Thank you — Tadbuy', 'Your Tadbuy inquiry is received. Real people review campaigns that settle in Bitcoin and Lightning — no middleman, no KYC gate.');
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <EmptyState
        icon={CheckCircle2}
        title="Thank you."
        description="Your Tadbuy request is in. Here is what happens next — and how your ads settle, honestly."
        className="max-w-xl"
      >
        <div className="text-left w-full max-w-md mx-auto space-y-4 mb-6">
          <div className="rounded-2xl border border-border bg-card p-5">
            <h2 className="flex items-center gap-2 text-sm font-bold mb-2">
              <ShieldCheck className="w-4 h-4 text-accent" />
              Your request is being reviewed
            </h2>
            <p className="text-xs text-muted leading-relaxed">
              A real person on the Tadbuy team reviews your inquiry — campaign brief, publisher
              interest, or API partnership — and comes back with a clear next step: an estimate, a
              draft campaign, or the docs you need.
            </p>
            <ul className="mt-3 space-y-2 text-xs text-muted">
              <li className="flex items-start gap-2"><Zap className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" /> <span><strong className="text-text">Lightning rails</strong> — campaigns and payouts settle in Bitcoin &amp; Lightning. No credit card, no KYC gate.</span></li>
              <li className="flex items-start gap-2"><ShieldCheck className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" /> <span><strong className="text-text">Honest estimates</strong> — you see the media cost; Tadbuy takes a clear, small fee. No hidden ad-tech take.</span></li>
            </ul>
          </div>
          <p className="text-xs text-muted leading-relaxed rounded-2xl border border-border bg-card p-4">
            Every campaign and settlement is verifiable: invoices, proofs, and payout history live
            in your wallet and dashboard — Bitcoin-native, self-custody, auditable. Pending stays
            pending honestly; nothing is ever marked confirmed early.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link to="/">
            <Button className="gap-2">
              Start a campaign <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link to="/docs">
            <Button variant="secondary" className="gap-2">
              <BookOpen className="w-4 h-4" /> Read the docs
            </Button>
          </Link>
          <Link to="/marketplace">
            <Button variant="secondary" className="gap-2">
              <Store className="w-4 h-4" /> Browse marketplace
            </Button>
          </Link>
        </div>
      </EmptyState>
    </div>
  );
}