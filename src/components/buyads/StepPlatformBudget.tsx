import type { ReactNode } from "react";
import { Card, CardTitle, Button, Input, FormGroup, Label, InfoTooltip } from "@/components/ui";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

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
  return (
    <Card className="glass-panel">
      <FormGroup className="mb-5">
        <Label>Campaign name</Label>
        <Input
          value={campaignName}
          onChange={e => setCampaignName(e.target.value)}
          placeholder="e.g. Summer Bitcoin Push"
        />
      </FormGroup>
      <div className="flex items-center gap-2 mb-3">
        <CardTitle className="mb-0">1. Pick your platforms</CardTitle>
        <InfoTooltip content="Choose where your ads will appear. Each platform has different audiences and costs (CPM)." />
      </div>
      <div className="text-xs text-muted mb-3">Select one or more platforms. Your budget will be distributed evenly.</div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4.5">
        {platforms.map(p => {
          const isSelected = selectedPlatforms.includes(p.id);
          return (
            <button
              key={p.id}
              onClick={() => onTogglePlatform(p.id)}
              className={cn(
                "bg-surface border-2 rounded-xl p-3.5 text-center cursor-pointer transition-all hover:border-muted relative overflow-hidden group",
                isSelected ? "border-accent bg-accent/10 shadow-[0_0_15px_rgba(247,147,26,0.1)]" : "border-border"
              )}
            >
              {isSelected && <CheckCircle2 className="absolute top-1.5 right-1.5 w-4 h-4 text-accent" />}
              <div className={cn("flex justify-center mb-2 transition-colors", isSelected ? "text-accent" : "text-muted group-hover:text-text")}>{p.icon}</div>
              <div className="text-[11px] font-bold text-text">{p.name}</div>
              <div className="text-[10px] text-green font-mono mt-0.5">~${p.cpm.toFixed(2)} CPM</div>
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2 mb-3">
        <CardTitle className="mb-0">2. Budget</CardTitle>
        <InfoTooltip content="Set how much you want to spend. We calculate estimates based on current Bitcoin rates and platform costs." />
      </div>
      <div className="flex flex-wrap gap-2 mb-3.5">
        {[
          { label: `${symbol}10`, btc: 10 / rate },
          { label: `${symbol}50`, btc: 50 / rate },
          { label: `${symbol}100`, btc: 100 / rate },
          { label: `${symbol}500`, btc: 500 / rate },
        ].map(preset => (
          <button
            key={preset.label}
            onClick={() => onBtcChange(preset.btc)}
            className="bg-surface border border-border text-muted rounded-full px-3.5 py-1.5 text-xs font-bold transition-all hover:border-accent hover:text-accent"
          >
            {preset.label} (~{preset.btc.toFixed(4)} BTC)
          </button>
        ))}
      </div>
      <div className="flex items-end gap-2.5 mb-1.5">
        <FormGroup className="flex-1 mb-0">
          <Label>Amount (BTC)</Label>
          <Input type="number" value={btcAmount.toFixed(5)} onChange={e => onBtcChange(parseFloat(e.target.value) || 0)} step="0.0001" min="0.0001" />
        </FormGroup>
        <div className="bg-accent/15 border border-accent/40 text-accent rounded-lg px-3.5 py-2.5 font-mono text-xs whitespace-nowrap">
          ₿ BTC
        </div>
        <FormGroup className="flex-1 mb-0">
          <Label>Or in {currency}</Label>
          <Input type="number" value={fiatAmount.toFixed(2)} onChange={e => onFiatChange(parseFloat(e.target.value) || 0)} />
        </FormGroup>
      </div>
      <div className="text-[11px] text-muted font-mono mt-1.5">
        ≈ {btcAmount.toFixed(4)} BTC · {Math.round(btcAmount * 100000000).toLocaleString()} sats · {symbol}{fiatAmount.toFixed(2)} {currency}
      </div>

      <div className="mt-4">
        <div className="flex items-center gap-2 mb-3">
          <CardTitle className="mb-0">3. Pay with</CardTitle>
          <InfoTooltip content="Choose your preferred Bitcoin payment method. Lightning is fastest for small amounts." />
        </div>
        <div className="grid grid-cols-3 gap-2.5 mb-4.5">
          {paymentMethods.map(pm => (
            <button
              key={pm.id}
              onClick={() => setPaymentMethod(pm.id)}
              className={cn(
                "bg-surface border-2 rounded-xl p-3.5 text-center cursor-pointer transition-all hover:border-muted",
                paymentMethod === pm.id ? cn(pm.border, pm.bg) : "border-border"
              )}
            >
              <div className="text-2xl mb-1.5 flex justify-center">{pm.icon}</div>
              <div className={cn("text-[11px] font-bold", paymentMethod === pm.id ? pm.color : "text-text")}>{pm.name}</div>
              <div className="text-[10px] text-muted">{pm.sub}</div>
            </button>
          ))}
        </div>

        {paymentMethod === 'btc' && (
          <div className="bg-accent/5 border border-accent/20 rounded-lg p-3 text-xs text-accent">
            ₿ On-chain Bitcoin. Confirmed in ~10 min. Recommended for budgets over $50.
          </div>
        )}
        {paymentMethod === 'lightning' && (
          <div className="bg-lightning/5 border border-lightning/20 rounded-lg p-3.5 text-xs text-lightning flex items-start gap-2.5">
            <span className="text-xl leading-none">⚡</span>
            <div>Lightning Network — Instant settlement, near-zero fees. Best for small spends ($1–$500). Requires Lightning wallet (Phoenix, Breez, Zeus, etc.)</div>
          </div>
        )}
        {paymentMethod === 'bolt12' && (
          <div className="bg-purple/5 border border-purple/20 rounded-lg p-3.5 text-xs text-purple flex items-start gap-2.5">
            <span className="text-xl leading-none">🔮</span>
            <div>BOLT 12 Offers — Supports recurring payments, invoice reuse, and enhanced privacy. Works with compatible wallets (CLN, Phoenix 2.0+). Ideal for recurring ad campaigns.</div>
          </div>
        )}
      </div>
    </Card>
  );
}
