import { Bitcoin, ShieldAlert, Zap } from "lucide-react";
import { Modal, Button } from "@/components/ui";
import { DemoModeBadge } from "@/components/payments/DemoModeBadge";
import { TermsAcceptance } from "@/components/TermsAcceptance";
import { useState } from "react";

interface PaymentModalProps {
  show: boolean;
  onClose: () => void;
  btcAmount: number;
  paymentMethod: string;
  onContinue: () => void;
}

const railLabels: Record<string, { label: string; icon: typeof Zap }> = {
  lightning: { label: 'Lightning · staged', icon: Zap },
  btc: { label: 'Bitcoin on-chain · staged', icon: Bitcoin },
  fedimint: { label: 'Fedimint · staged', icon: ShieldAlert },
  bolt12: { label: 'BOLT 12 · research', icon: Zap },
  zap: { label: 'Nostr Zap · not checkout', icon: Zap },
};

export default function PaymentModal({
  show,
  onClose,
  btcAmount,
  paymentMethod,
  onContinue,
}: PaymentModalProps) {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const amountSats = Math.round(btcAmount * 100_000_000);
  const rail = railLabels[paymentMethod] ?? { label: 'Bitcoin payment rail', icon: Bitcoin };
  const RailIcon = rail.icon;

  return (
    <Modal
      isOpen={show}
      onClose={onClose}
      title="Review campaign preview"
      description="Local-only planning preview · no order or payment"
      size="lg"
      closeOnBackdrop
      showClose
    >
      <div className="p-5 sm:p-7 space-y-5">
        <div className="flex justify-center"><DemoModeBadge /></div>

        <Bitcoin className="mx-auto h-11 w-11 text-accent" aria-hidden="true" />
        <div className="text-center">
          <h2 className="text-xl font-extrabold">This build cannot accept payment</h2>
          <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-muted">
            Continue only to view a local campaign preview. No invoice, payment QR, on-chain request, Fedimint token, or vendor order will be created. No sats will move and nothing will be published.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-surface p-4">
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted">Proposed budget · not paid</div>
            <div className="mt-1 font-mono text-xl font-extrabold text-accent">{amountSats.toLocaleString()} sats</div>
            <div className="mt-1 text-[10px] text-muted">Amount used for this preview only</div>
          </div>
          <div className="rounded-xl border border-border bg-surface p-4">
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted">Selected rail · unavailable</div>
            <div className="mt-2 flex items-center gap-2 font-bold text-text"><RailIcon className="h-4 w-4 text-lightning" />{rail.label}</div>
            <div className="mt-1 text-[10px] text-muted">No payment service is connected</div>
          </div>
        </div>

        <TermsAcceptance accepted={termsAccepted} onChange={setTermsAccepted} className="text-left" paymentPreview />

        <div className="rounded-xl border border-lightning/25 bg-lightning/5 p-3 text-[11px] leading-relaxed text-muted">
          <div className="mb-1 flex items-center gap-2 font-bold text-text"><ShieldAlert className="h-4 w-4 text-lightning" /> Preview, not a payment authorization</div>
          Continuing does not charge a wallet, create a Tadbuy balance, save a server-side campaign, or guarantee publisher inventory. Your editable campaign draft stays on this device.
        </div>

        <div className="flex flex-col-reverse gap-3 sm:flex-row">
          <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>Back to campaign</Button>
          <Button
            type="button"
            className="flex-[2]"
            onClick={onContinue}
            disabled={!termsAccepted}
          >
            Continue to local preview
          </Button>
        </div>
        <div className="text-center text-[10px] text-muted">Bitcoin-first design · payment is disabled in this preview build</div>
      </div>
    </Modal>
  );
}
