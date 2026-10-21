import { motion } from "motion/react";
import { Card, CardTitle } from "@/components/ui";
import { Badge } from "@/components/ui/Badge";
import { Alert } from "@/components/ui/Alert";
import { ShieldAlert } from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { PlacementRequestInbox } from "@/components/publisher/PlacementRequestInbox";
import { VendorProfileCard } from "@/components/publisher/VendorProfileCard";
import { VendorInventoryManager } from "@/components/publisher/VendorInventoryManager";
import { ArtMarketplaceScene } from "@/components/illustrations";
import { PreviewReadinessPanel } from "@/components/PreviewReadinessPanel";

// The preview has no approved vendor, earnings, fill-rate, or payout records.
// Keep the portal focused on legitimate profile and private-draft preparation.

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function PublisherPortal() {
  usePageTitle('Publisher Portal');

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Publisher workspace</h1>
          <p className="text-sm text-muted mt-1">Prepare a profile and draft inventory for channels you control. No vendor listings, audience analytics, or payouts are live in this preview.</p>
        </div>
        <div aria-hidden className="pointer-events-none hidden shrink-0 select-none items-center lg:flex">
          <ArtMarketplaceScene className="opacity-90" />
        </div>
      </div>

      <PreviewReadinessPanel compact />

      <Alert variant="warning" title="No live publisher supply or earnings data">
        Listings are private drafts until backend storage and operator approval are available. There is no connected earnings ledger, fill-rate measurement, or payout service. Do not enter a payout address or expect payment in this preview.
      </Alert>

      <VendorProfileCard />
      <VendorInventoryManager />
      <PlacementRequestInbox />
      <Alert variant="info">
        Phase 2 community distribution is vendor-assisted. Add only inventory you control, follow each community&apos;s rules, disclose sponsorship, and submit evidence after publication. Payouts and audience metrics remain staged until the backend ledger is live.
      </Alert>

      <Card className="glass-panel border-blue/20">
        <div className="flex items-center gap-2 mb-2"><ShieldAlert className="w-4 h-4 text-blue" /><CardTitle className="mb-0">Publisher readiness</CardTitle></div>
        <p className="text-xs leading-relaxed text-muted">The portal supports preparing a profile and private inventory drafts. Revenue, fill rates, embed delivery, payout history, and withdrawals are unavailable until approved publisher supply, a durable backend, verified measurement, and an authorized payment ledger exist.</p>
        <div className="mt-3 flex flex-wrap gap-2 text-[10px]">
          <Badge variant="outline">No live publisher listings</Badge>
          <Badge variant="outline">No earnings ledger</Badge>
          <Badge variant="outline">No payouts</Badge>
        </div>
      </Card>
    </motion.div>
  );
}