import { Link } from "react-router-dom";
import { usePageMeta } from '@/hooks/usePageMeta';
import { CheckCircle2, Zap, ShieldCheck, ArrowRight, BookOpen, Store } from "lucide-react";
import { Button } from "@/components/ui";
import { EmptyState } from "@/components/ui/EmptyState";
import { ArtRocket } from "@/components/illustrations";

export default function ThankYou() {
  usePageMeta('Thank you — Tadbuy', 'Your inquiry confirmation. Tadbuy campaign payments, vendor orders, and campaign delivery are not connected in this preview.');
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <EmptyState
        icon={CheckCircle2}
        title="Thank you."
        description="Your inquiry confirmation is shown. Campaign orders, publisher placements, and payments are not created by this preview."
        className="max-w-xl"
        art={<ArtRocket className="h-24" />}
      >
        <div className="text-left w-full max-w-md mx-auto space-y-4 mb-6">
          <div className="rounded-2xl border border-border bg-card p-5">
            <h2 className="flex items-center gap-2 text-sm font-bold mb-2">
              <ShieldCheck className="w-4 h-4 text-accent" />
              Inquiry status
            </h2>
            <p className="text-xs text-muted leading-relaxed">
              If this confirmation followed a request form, check that form&apos;s result for whether it was received. Campaign planning and preview interactions do not contact a vendor or create an order.
            </p>
            <ul className="mt-3 space-y-2 text-xs text-muted">
              <li className="flex items-start gap-2"><Zap className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" /> <span><strong className="text-text">Lightning readiness</strong> — no Tadbuy invoice, payment verification, or campaign settlement is connected in this preview.</span></li>
              <li className="flex items-start gap-2"><ShieldCheck className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" /> <span><strong className="text-text">Planning only</strong> — example budgets and fee assumptions are not a quote or an active charge.</span></li>
            </ul>
          </div>
          <p className="text-xs text-muted leading-relaxed rounded-2xl border border-border bg-card p-4">
            This confirmation does not establish that a campaign order or placement request was saved. Check the form-specific status and contact the Tadbuy team if you need to verify an inquiry; no wallet, invoice, payout history, or settlement record is available here.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link to="/">
            <Button className="gap-2">
              Plan a campaign preview <ArrowRight className="w-4 h-4" />
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