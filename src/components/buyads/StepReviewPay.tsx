import type { ReactNode } from "react";
import { Card, CardTitle, Button, InfoTooltip } from "@/components/ui";
import { cn } from "@/lib/utils";

interface PlatformData {
  id: string;
  name: string;
  icon: ReactNode;
  cpm: number;
}

interface EstimatesData {
  totalImpressions: number;
  totalClicks: number;
  cpbtc: number;
  platformBreakdown: Array<PlatformData & { weight: number; impressions: number; budget: number }>;
  audience: {
    malePct: number;
    femalePct: number;
    topInterestPct: number;
  };
}

interface TargetingSettings {
  interests: string;
  ageMin: number;
  ageMax: number;
  sex: 'all' | 'male' | 'female';
  countries: string[];
  languages: string[];
  devices: string[];
  networks: string[];
  pixelUrl: string;
  education: string;
  income: string;
  behaviors: string;
  industries: string;
}

interface StepReviewPayProps {
  estimates: EstimatesData;
  btcAmount: number;
  fiatAmount: number;
  campaignName: string;
  selectedPlatformsData: PlatformData[];
  onDeploy: () => void;
  paymentMethod: string;
  symbol: string;
  rate: number;
  projectId: string;
  targeting: TargetingSettings;
  mode: 'simple' | 'complex';
  variants: Array<{ id: string }>;
  ppqAutoRebalance: boolean;
  deployLabel?: string;
}

export default function StepReviewPay({
  estimates,
  btcAmount,
  fiatAmount,
  campaignName,
  selectedPlatformsData,
  onDeploy,
  paymentMethod,
  symbol,
  rate,
  projectId,
  targeting,
  mode,
  variants,
  ppqAutoRebalance,
  deployLabel = '⚡ Deploy via PPQ.AI — Pay with Bitcoin',
}: StepReviewPayProps) {
  return (
    <>
      <Card className="border-accent/30 shadow-[0_0_30px_-10px_rgba(247,147,26,0.15)]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CardTitle className="mb-0">Live estimate</CardTitle>
            <InfoTooltip content="Real-time projection of your campaign's reach based on current budget and targeting." />
          </div>
          <div className="text-[10px] font-mono bg-surface px-2 py-1 rounded border border-border text-muted">
            ID: {projectId}
          </div>
        </div>
        <div className="bg-green/5 border border-green/20 rounded-xl p-4">
          <div className="flex justify-between py-1 text-[13px] items-center">
            <span className="text-muted">Platforms ({selectedPlatformsData.length})</span>
            <span className="text-accent font-bold text-right flex gap-1">
              {selectedPlatformsData.map((p, i) => (
                <span key={i} className="w-4 h-4 [&>svg]:w-4 [&>svg]:h-4">{p.icon}</span>
              ))}
            </span>
          </div>
          <div className="flex justify-between py-1 text-[13px]">
            <span className="text-muted">Budget</span>
            <span>{symbol}{fiatAmount.toFixed(2)} ({btcAmount.toFixed(4)} ₿)</span>
          </div>
          <div className="flex justify-between py-1 text-[13px]">
            <span className="text-muted">Avg CPM</span>
            <span>~${(selectedPlatformsData.reduce((acc, p) => acc + p.cpm, 0) / selectedPlatformsData.length).toFixed(2)} USD</span>
          </div>
          <div className="flex justify-between py-1 text-[13px]">
            <span className="text-muted">Est. impressions</span>
            <span className="text-green font-bold">~{estimates.totalImpressions.toLocaleString()}</span>
          </div>
          <div className="flex justify-between py-1 text-[13px]">
            <span className="text-muted">Est. clicks (CTR 1.2%)</span>
            <span className="text-green font-bold">~{estimates.totalClicks.toLocaleString()}</span>
          </div>

          <div className="mt-3 pt-3 border-t border-green/10 space-y-2">
            <div className="text-[10px] uppercase tracking-wider text-muted font-bold">Audience Details</div>
            <div className="flex justify-between text-[11px]">
              <span className="text-muted">Gender split</span>
              <span>{estimates.audience.malePct}% M / {estimates.audience.femalePct}% F</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-muted">Interest affinity ({targeting.interests})</span>
              <span className="text-accent">{estimates.audience.topInterestPct}% high</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-muted">Device reach</span>
              <span>{targeting.devices.join(', ')}</span>
            </div>
          </div>

          {mode === 'complex' && (
            <div className="mt-2 pt-2 border-t border-green/10 space-y-1">
              <div className="text-[10px] uppercase tracking-wider text-muted font-bold mb-1">Platform Split</div>
              {estimates.platformBreakdown.map(p => (
                <div key={p.id} className="flex justify-between text-[11px]">
                  <span className="flex items-center gap-1">{p.icon} {p.name} ({p.weight}%)</span>
                  <span>~{p.impressions.toLocaleString()} imp</span>
                </div>
              ))}
              {variants.length > 1 && (
                <div className="flex justify-between text-[11px] text-accent mt-1">
                  <span>A/B Testing Enabled</span>
                  <span>50/50 Split</span>
                </div>
              )}
              {ppqAutoRebalance && (
                <div className="text-[10px] text-blue italic mt-1">
                  PPQ.AI Auto-Rebalance active
                </div>
              )}
            </div>
          )}
          <div className="flex justify-between py-1 text-[13px]">
            <span className="text-muted">Est. duration</span>
            <span>3–5 days</span>
          </div>
          <div className="flex justify-between pt-3 mt-2 border-t border-green/20 font-extrabold text-[15px]">
            <span>Total (BTC)</span>
            <span className="text-accent">{btcAmount.toFixed(8)} ₿</span>
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
    </>
  );
}
