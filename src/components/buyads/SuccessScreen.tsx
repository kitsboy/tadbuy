import type { ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Smartphone } from "lucide-react";
import { Button } from "@/components/ui";
import { Alert } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { type PaymentOutcome, outcomeBadge } from "@/lib/campaignPaymentStatus";

interface PlatformData {
  id: string;
  name: string;
  icon: ReactNode;
  cpm: number;
}

interface SuccessScreenProps {
  projectId: string;
  campaignName: string;
  btcAmount: number;
  selectedPlatformsData: PlatformData[];
  outcome: PaymentOutcome;
  onReset: () => void;
}

export default function SuccessScreen({
  projectId,
  campaignName,
  btcAmount,
  selectedPlatformsData,
  outcome,
  onReset,
}: SuccessScreenProps) {
  const reducedMotion = usePrefersReducedMotion();
  const badge = outcomeBadge(outcome);

  return (
    <AnimatePresence>
      <motion.div
        key="success-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: reducedMotion ? 0 : 0.4 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-bg overflow-hidden"
      >
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: reducedMotion ? 0 : [0, 0.6, 0.3] }}
          transition={{ duration: 2, ease: 'easeOut' }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent/10 blur-3xl" />
        </motion.div>

        <motion.div
          initial={reducedMotion ? false : { opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 22, delay: 0.1 }}
          className="relative z-10 text-center px-6 max-w-md w-full"
        >
          <motion.div
            initial={reducedMotion ? false : { scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.15 }}
            className="mx-auto mb-6 relative w-28 h-28"
          >
            <div className="absolute inset-0 rounded-full bg-accent/15" />
            <div className="absolute inset-2 flex items-center justify-center rounded-full border-4 border-accent bg-accent/10">
              <Smartphone className="h-12 w-12 text-accent" strokeWidth={1.5} />
            </div>
          </motion.div>

          <Badge variant={badge.variant} className="mb-4">{badge.label}</Badge>

          <h1 className="mb-2 text-3xl font-extrabold tracking-tight sm:text-4xl">Campaign preview ready</h1>
          <p className="mb-2 text-sm leading-relaxed text-muted">
            Your campaign plan is shown locally in this browser. Nothing was submitted, paid for, activated, or published.
          </p>
          <Alert variant="warning" title="Not a payment receipt or campaign launch" className="mb-4 text-left">
            No sats moved, no invoice was created, no server-side campaign was saved, and publishers were not contacted.
          </Alert>
          <p className="mb-6 text-[10px] font-mono text-muted">Local preview reference: {projectId}</p>

          <div className="bg-surface border border-border rounded-2xl p-5 mb-6 text-left space-y-3 tadbuy-receipt-total">
            <div className="text-[10px] uppercase tracking-widest text-muted font-bold">Local preview · not saved as a campaign or receipt</div>
            <div className="flex justify-between text-sm">
              <span className="text-muted">Name</span>
              <span className="font-bold">{campaignName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted">Proposed budget · unpaid</span>
              <span className="font-bold text-accent">{Math.round(btcAmount * 100_000_000).toLocaleString()} sats</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted">Campaign state</span>
              <span className="font-bold text-lightning">Preview only · not submitted</span>
            </div>
            <div className="border-t border-border/50 pt-2 text-xs leading-relaxed text-muted">
              Selected platforms: {selectedPlatformsData.map(platform => platform.name).join(', ') || 'None'} · planning estimates are not shown as delivery results.
            </div>
          </div>

          <Button variant="secondary" size="lg" className="w-full" onClick={onReset}>
            <Smartphone className="h-4 w-4" /> Edit local draft
          </Button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}