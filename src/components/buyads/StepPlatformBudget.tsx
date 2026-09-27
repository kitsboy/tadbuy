import type { ReactNode } from "react";
import { Card, CardTitle, Input, FormGroup, Label, InfoTooltip } from "@/components/ui";
import { Alert } from "@/components/ui/Alert";
import { Chip } from "@/components/ui/Chip";
import { Progress } from "@/components/ui/Progress";
import { cn, formatSats } from "@/lib/utils";

interface Platform {
  id: string;
  name: string;
  icon: ReactNode;
  cpm: number;
}

interface PaymentMethod {
  id: string;
  name: string;
  sub: string;
  icon: ReactNode;
  color: string;
  border: string;
  bg: string;
}

interface StepPlatformBudgetProps {
  platforms: Platform[];
  paymentMethods: PaymentMethod[];
  selectedPlatforms: string[];
  onTogglePlatform: (id: string) => void;
  btcAmount: number;
  fiatAmount: number;
  currency: string;
  symbol: string;
  rate: number;
  onBtcChange: (val: number) => void;
  onFiatChange: (val: number) => void;
  paymentMethod: string;
  setPaymentMethod: (id: string) => void;
  campaignName: string;
  setCampaignName: (name: string) => void;
}

export default function StepPlatformBudget({
  platforms,
  paymentMethods,
  selectedPlatforms,
  onTogglePlatform,
  btcAmount,
  fiatAmount,
  currency,
  symbol,
  rate,
  onBtcChange,
  onFiatChange,
  paymentMethod,
  setPaymentMethod,
  campaignName,
  setCampaignName,
}: StepPlatformBudgetProps) {
  const BUDGET_MAX_SATS = 10_000_000;
  const hasLiveRate = rate > 0;
  const budgetSats = Math.round(btcAmount * 100_000_000);
  const budgetPct = Math.min(100, (budgetSats / BUDGET_MAX_SATS) * 100);

  return (
    <Card className="glass-panel">
      <FormGroup className="mb-5">
        <Label>Campaign concept name</Label>
        <Input value={campaignName} onChange={event => setCampaignName(event.target.value)} placeholder="e.g. Bitcoin education campaign" />
      </FormGroup>

      <Alert variant="warning" title="Planning preview · no delivery or payment">
        Platform costs below are seeded assumptions, not quotes. This build does not buy ads, contact publishers, measure an audience, or accept Bitcoin.
      </Alert>

      <div className="mb-3 flex items-center gap-2">
        <CardTitle className="mb-0">1. Choose platform concepts</CardTitle>
        <InfoTooltip content="Availability, audience, and costs are not verified live inventory or a quote." />
      </div>
      <p className="mb-3 text-xs text-muted">Choose concepts for this local draft. No provider campaign is created.</p>

      {selectedPlatforms.length === 0 && (
        <div className="mb-4 rounded-xl border-2 border-dashed border-accent/30 bg-accent/5 p-6 text-center">
          <div className="mb-2 text-2xl">👇</div>
          <p className="text-sm font-bold text-text">Pick at least one platform to continue</p>
          <p className="mt-1 text-[11px] text-muted">Tap any platform below to add it to this planning draft.</p>
        </div>
      )}

      <div className="mb-4 flex flex-wrap gap-2">
        {platforms.map(platform => {
          const selected = selectedPlatforms.includes(platform.id);
          return (
            <Chip
              key={platform.id}
              active={selected}
              onClick={() => onTogglePlatform(platform.id)}
              className={cn("min-w-[7rem] flex-col items-center gap-1 px-4 py-3 transition-all", !selected && "hover:scale-105 hover:border-accent/40")}
            >
              <span className={cn("flex justify-center", selected ? "text-accent" : "text-muted")}>{platform.icon}</span>
              <span className="text-[11px] font-bold">{platform.name}</span>
              <span className="text-center text-[10px] text-muted">Example CPM · not a quote</span>
            </Chip>
          );
        })}
      </div>
      {selectedPlatforms.length > 0 && (
        <p className="mb-4 text-[10px] text-muted">{selectedPlatforms.length} concept{selectedPlatforms.length === 1 ? '' : 's'} selected · illustrative budget split only</p>
      )}

      <div className="mb-3 flex items-center gap-2">
        <CardTitle className="mb-0">2. Proposed budget</CardTitle>
        <InfoTooltip content="Set a proposed budget for planning. Fiat conversion uses a public reference rate when available; this is not a quote or payment authorization." />
      </div>
      <div className="mb-3.5 flex flex-wrap gap-2">
        {[
          { label: `${symbol}10`, btc: 10 / rate },
          { label: `${symbol}50`, btc: 50 / rate },
          { label: `${symbol}100`, btc: 100 / rate },
          { label: `${symbol}500`, btc: 500 / rate },
        ].map(preset => (
          <button
            key={preset.label}
            disabled={!hasLiveRate}
            onClick={() => onBtcChange(preset.btc)}
            className="rounded-full border border-border bg-surface px-3.5 py-1.5 text-xs font-bold text-muted transition-all hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-50"
          >
            {preset.label}{hasLiveRate ? ` (~${preset.btc.toFixed(4)} BTC)` : ' (rate loading…)'}
          </button>
        ))}
      </div>
      <div className="mb-1.5 flex items-end gap-2.5">
        <FormGroup className="mb-0 flex-1">
          <Label>Proposed amount (BTC)</Label>
          <Input type="number" value={btcAmount.toFixed(5)} onChange={event => onBtcChange(parseFloat(event.target.value) || 0)} step="0.0001" min="0.0001" />
        </FormGroup>
        <div className="whitespace-nowrap rounded-lg border border-accent/40 bg-accent/15 px-3.5 py-2.5 font-mono text-xs text-accent">₿ BTC</div>
        <FormGroup className="mb-0 flex-1">
          <Label>Indicative value in {currency}</Label>
          <Input type="number" value={fiatAmount.toFixed(2)} onChange={event => onFiatChange(parseFloat(event.target.value) || 0)} />
        </FormGroup>
      </div>
      <div className="mb-2 mt-4">
        <Progress value={budgetPct} showLabel variant="accent" />
        <div className="mt-1 text-[10px] text-muted">Example scale only · no credit, spend, or campaign balance exists.</div>
      </div>
      <div className="mt-1.5 font-mono text-[11px] text-muted">
        Proposed budget: {btcAmount.toFixed(4)} BTC · {formatSats(budgetSats, { compact: false })} sats · {symbol}{fiatAmount.toFixed(2)} {currency} · unpaid
      </div>

      <div className="mt-4">
        <div className="mb-3 flex items-center gap-2">
          <CardTitle className="mb-0">3. Payment preference · disabled</CardTitle>
          <InfoTooltip content="This selects a design preference only. No payment service is connected in this build." />
        </div>
        <div className="mb-3 rounded-xl border border-lightning/25 bg-lightning/5 p-3 text-[11px] leading-relaxed text-muted">
          <strong className="text-lightning">Preview only.</strong> These are future checkout concepts. Payment is disabled; selecting a rail cannot create an invoice, request, or payment.
        </div>
        <div className="mb-4.5 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {paymentMethods.map(method => (
            <button
              key={method.id}
              type="button"
              onClick={() => setPaymentMethod(method.id)}
              className={cn("cursor-pointer rounded-xl border-2 bg-surface p-3.5 text-center transition-all hover:border-muted", paymentMethod === method.id ? cn(method.border, method.bg) : "border-border")}
            >
              <div className="mb-1.5 flex justify-center text-2xl">{method.icon}</div>
              <div className={cn("text-[11px] font-bold", paymentMethod === method.id ? method.color : "text-text")}>{method.name}</div>
              <div className="text-[10px] text-muted">Unavailable in this preview</div>
            </button>
          ))}
        </div>

        {paymentMethod === 'btc' && <div className="rounded-lg border border-accent/20 bg-accent/5 p-3 text-xs text-accent">₿ On-chain Bitcoin is a planned option. No deposit address, confirmation tracker, or campaign activation is connected.</div>}
        {paymentMethod === 'lightning' && <div className="flex items-start gap-2.5 rounded-lg border border-lightning/20 bg-lightning/5 p-3.5 text-xs text-lightning"><span className="text-xl leading-none">⚡</span><div>Lightning is the intended fast Bitcoin rail, but Tadbuy cannot accept or verify a payment in this preview. No invoice is created and no campaign is activated.</div></div>}
        {paymentMethod === 'bolt12' && <div className="flex items-start gap-2.5 rounded-lg border border-purple/20 bg-purple/5 p-3.5 text-xs text-purple"><span className="text-xl leading-none">🔮</span><div>BOLT 12 is shown as a future rail only. No offer is generated or verified by this preview.</div></div>}
      </div>
    </Card>
  );
}
