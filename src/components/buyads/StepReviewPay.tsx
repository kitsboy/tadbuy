import type { ReactNode } from "react";
import { Card, CardTitle, Button, InfoTooltip } from "@/components/ui";
import { Alert } from "@/components/ui/Alert";
import { StatCard } from "@/components/ui/StatCard";
import { Users, Zap } from "lucide-react";
import { formatBtc, formatSats } from "@/lib/utils";

interface PlatformData {
  id: string;
  name: string;
  icon: ReactNode;
  cpm: number;
}

interface EstimatesData {
  platformBreakdown: Array<PlatformData & { weight: number; impressions: number; budget: number }>;
}

interface TargetingSettings {
  interests: string;
  devices: string[];
}

interface StepReviewPayProps {
  estimates: EstimatesData;
  btcAmount: number;
  fiatAmount: number;
  campaignName: string;
  selectedPlatformsData: PlatformData[];
  onDeploy: () => void;
  symbol: string;
  projectId: string;
  targeting: TargetingSettings;
  mode: 'simple' | 'complex';
  variants: Array<{ id: string }>;
  deployLabel?: string;
}

export default function StepReviewPay({
  estimates,
  btcAmount,
  fiatAmount,
  campaignName,
  selectedPlatformsData,
  onDeploy,
  symbol,
  projectId,
  targeting,
  mode,
  variants,
  deployLabel = 'Review local campaign preview',
}: StepReviewPayProps) {
  const budgetSats = Math.round(btcAmount * 100_000_000);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <StatCard
          icon={Zap}
          label="Proposed budget · unpaid"
          value={formatBtc(btcAmount, 6)}
          sub={`${formatSats(budgetSats)} sats · planning only`}
          color="text-accent"
        />
        <StatCard
          icon={Users}
          label="Platform concepts"
          value={selectedPlatformsData.length}
          sub={selectedPlatformsData.map(platform => platform.name).join(', ') || 'None'}
          color="text-purple"
        />
      </div>

      <Alert variant="warning" title="Local planning preview only">
        CPM and performance inputs are illustrative assumptions. No audience, delivery, clicks, conversions, vendor inventory, or campaign launch is connected or measured here.
      </Alert>

      <Card className="border-accent/30 shadow-[0_0_30px_-10px_rgba(247,147,26,0.15)]">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <CardTitle className="mb-0">Campaign plan preview</CardTitle>
            <InfoTooltip content="This summary is a local planning draft—not an order, quote, payment, or delivery report." />
          </div>
          <div className="rounded border border-border bg-surface px-2 py-1 text-[10px] font-mono text-muted">Preview: {projectId}</div>
        </div>

        <div className="space-y-1 rounded-xl border border-border bg-surface p-4">
          <div className="flex justify-between gap-3 py-1 text-[13px]">
            <span className="text-muted">Campaign concept</span>
            <span className="text-right font-bold text-text">{campaignName}</span>
          </div>
          <div className="flex justify-between gap-3 py-1 text-[13px]">
            <span className="text-muted">Selected platform concepts</span>
            <span className="text-right font-bold text-text">{selectedPlatformsData.map(platform => platform.name).join(', ') || 'None'}</span>
          </div>
          <div className="flex justify-between gap-3 py-1 text-[13px]">
            <span className="text-muted">Proposed budget · unpaid</span>
            <span>{symbol}{fiatAmount.toFixed(2)} · {btcAmount.toFixed(8)} ₿</span>
          </div>

          <div className="mt-3 space-y-2 border-t border-border/50 pt-3">
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted">Planning inputs · not audience data</div>
            <div className="flex justify-between gap-3 text-[11px]"><span className="text-muted">Interest</span><span className="text-right">{targeting.interests}</span></div>
            <div className="flex justify-between gap-3 text-[11px]"><span className="text-muted">Devices</span><span className="text-right">{targeting.devices.join(', ') || 'None'}</span></div>
          </div>

          {mode === 'complex' && (
            <div className="mt-3 space-y-1 border-t border-border/50 pt-3">
              <div className="mb-1 text-[10px] font-bold uppercase tracking-wider text-muted">Illustrative budget split · not an order</div>
              {estimates.platformBreakdown.map(platform => (
                <div key={platform.id} className="flex justify-between gap-3 text-[11px]">
                  <span>{platform.name}</span>
                  <span>{platform.weight.toFixed(0)}% · example split</span>
                </div>
              ))}
              {variants.length > 1 && <div className="text-[10px] text-muted">Creative variants · no test is running</div>}
              <div className="text-[10px] italic text-muted">No automatic rebalancing or delivery occurs.</div>
            </div>
          )}

          <div className="mt-3 border-t border-border/50 pt-3 text-[11px] text-muted">
            Example schedule: 3–5 days · illustrative · not scheduled
          </div>
        </div>
      </Card>

      <Button
        className="w-full bg-gradient-to-r from-accent to-accent2 text-black border-0 hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(247,147,26,0.3)]"
        size="lg"
        onClick={onDeploy}
      >
        {deployLabel}
      </Button>
    </div>
  );
}
