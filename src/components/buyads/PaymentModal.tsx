import type { ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { QRCodeSVG } from "qrcode.react";
import { CheckCircle2, Layers, Zap, ShieldAlert } from "lucide-react";
import { Modal, Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import { BITCOIN_ADDRESS, BITCOIN_URI } from "@/constants";

interface MempoolFees {
  fastestFee: number;
  halfHourFee: number;
  hourFee: number;
}

interface PaymentModalProps {
  show: boolean;
  onClose: () => void;
  paymentStatus: string;
  bolt11Invoice: string;
  invoiceSecondsLeft: number;
  invoiceCopied: boolean;
  onCopyInvoice: () => void;
  mempoolFees: MempoolFees;
  btcAmount: number;
  fiatAmount: number;
  paymentMethod: string;
  projectId: string;
  symbol: string;
  onDeploy: () => void;
  onCancelPayment: () => void;
}

const bolt12Offer = "lno1qgsqv... (demo bolt12 offer)";

function formatCountdown(secs: number): string {
  const m = Math.floor(secs / 60).toString().padStart(2, '0');
  const s = (secs % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function PaymentModal({
  show,
  onClose,
  paymentStatus,
  bolt11Invoice,
  invoiceSecondsLeft,
  invoiceCopied,
  onCopyInvoice,
  mempoolFees,
  btcAmount,
  fiatAmount,
  paymentMethod,
  projectId,
  symbol,
  onDeploy,
  onCancelPayment,
}: PaymentModalProps) {
  return (
    <Modal isOpen={show} onClose={onClose}>
      <div className="p-8 text-center relative overflow-hidden">
        <AnimatePresence mode="wait">
          {paymentStatus === 'waiting' ? (
            /* ── WAITING: scan QR, countdown, pulse ── */
            <motion.div
              key="waiting"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="py-6 flex flex-col items-center"
            >
              <div className="flex items-center justify-between w-full mb-5">
                <div>
                  <h2 className="text-xl font-extrabold leading-tight">Scan to pay</h2>
                  <p className="text-xs text-muted mt-0.5">Lightning invoice — open in your wallet</p>
                </div>
                <div className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border",
                  "bg-lightning/10 text-lightning border-lightning/20"
                )}>
                  Instant
                </div>
              </div>

              {/* QR code */}
              <div className="bg-white p-4 rounded-2xl inline-block mb-4 shadow-2xl">
                <QRCodeSVG value={bolt11Invoice} size={200} level="H" includeMargin={false} />
              </div>

              {/* Countdown */}
              <div className="flex items-center gap-2 mb-4">
                <div className={cn(
                  "font-mono text-3xl font-extrabold tabular-nums",
                  invoiceSecondsLeft < 120 ? "text-red-400" : "text-text"
                )}>
                  {formatCountdown(invoiceSecondsLeft)}
                </div>
                <div className="text-xs text-muted leading-tight">
                  until<br />expires
                </div>
              </div>

              {/* Pulsing waiting indicator */}
              <div className="flex items-center gap-2.5 mb-6 px-4 py-2.5 bg-lightning/5 border border-lightning/20 rounded-full">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lightning opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-lightning" />
                </span>
                <span className="text-xs text-lightning font-semibold">Waiting for payment…</span>
              </div>

              {/* Invoice string */}
              <div className="relative w-full mb-5">
                <div className="bg-bg border border-border rounded-xl p-3 font-mono text-[9px] text-muted break-all text-left pr-10 max-h-16 overflow-hidden">
                  {bolt11Invoice}
                </div>
                <button
                  onClick={onCopyInvoice}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-surface rounded-lg transition-colors text-accent"
                >
                  {invoiceCopied ? <CheckCircle2 className="w-4 h-4" /> : <Layers className="w-4 h-4" />}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 w-full mb-2 text-left">
                <div className="bg-surface border border-border rounded-xl p-3">
                  <div className="text-[10px] text-muted uppercase font-bold mb-1">Amount</div>
                  <div className="text-base font-extrabold text-accent">{btcAmount.toFixed(8)} ₿</div>
                  <div className="text-[10px] text-muted">≈ {symbol}{fiatAmount.toFixed(2)}</div>
                </div>
                <div className="bg-surface border border-border rounded-xl p-3">
                  <div className="text-[10px] text-muted uppercase font-bold mb-1">Network</div>
                  <div className="text-base font-extrabold text-lightning">Lightning</div>
                  <div className="text-[10px] text-muted">Near-zero fees</div>
                </div>
              </div>

              <Button
                variant="secondary"
                className="w-full mt-2"
                onClick={onCancelPayment}
              >
                Cancel
              </Button>
            </motion.div>
          ) : paymentStatus === 'processing' ? (
            <motion.div
              key="processing"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="py-12 flex flex-col items-center"
            >
              <div className="relative w-24 h-24 mb-8">
                <motion.div
                  className="absolute inset-0 border-4 border-accent/20 rounded-full"
                />
                <motion.div
                  className="absolute inset-0 border-4 border-t-accent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <Zap className="absolute inset-0 m-auto w-10 h-10 text-accent animate-pulse" />
              </div>
              <h2 className="text-2xl font-extrabold mb-2">Verifying Payment</h2>
              <p className="text-sm text-muted">Checking the {paymentMethod === 'btc' ? 'Bitcoin network' : 'Lightning Network'} for your transaction...</p>
              <div className="mt-8 flex gap-1 justify-center">
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 bg-accent rounded-full"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="invoice"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="text-left">
                  <h2 className="text-2xl font-extrabold leading-tight">
                    {paymentMethod === 'bolt12' ? 'BOLT 12 Offer' : (paymentMethod === 'lightning' ? 'Lightning Invoice' : 'Bitcoin Invoice')}
                  </h2>
                  <p className="text-xs text-muted">Project: <span className="text-text font-mono">{projectId}</span></p>
                </div>
                <div className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                  paymentMethod === 'bolt12' ? "bg-purple/10 text-purple border border-purple/20" :
                  (paymentMethod === 'lightning' ? "bg-lightning/10 text-lightning border border-lightning/20" : "bg-accent/10 text-accent border border-accent/20")
                )}>
                  {paymentMethod === 'bolt12' ? 'Privacy Enabled' : (paymentMethod === 'lightning' ? 'Instant' : 'On-Chain')}
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl inline-block mb-8 shadow-2xl relative group">
                <QRCodeSVG
                  value={paymentMethod === 'zap' ? `nostr:npub1...` : (paymentMethod === 'bolt12' ? bolt12Offer : (paymentMethod === 'lightning' ? bolt11Invoice : `${BITCOIN_URI}?amount=${btcAmount.toFixed(8)}&message=${projectId}`))}
                  size={220}
                  level="H"
                  includeMargin={false}
                />
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center pointer-events-none">
                  <Zap className="w-12 h-12 text-accent drop-shadow-lg" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-surface border border-border rounded-xl p-3 text-left">
                  <div className="text-[10px] text-muted uppercase font-bold mb-1">Amount to send</div>
                  <div className="text-lg font-extrabold text-accent">{btcAmount.toFixed(8)} ₿</div>
                  <div className="text-[10px] text-muted">≈ {symbol}{fiatAmount.toFixed(2)}</div>
                </div>
                <div className="bg-surface border border-border rounded-xl p-3 text-left">
                  <div className="text-[10px] text-muted uppercase font-bold mb-1">Network Fee</div>
                  <div className="text-lg font-extrabold text-green">
                    {paymentMethod === 'btc' ? `~${((mempoolFees.fastestFee * 140) / 100000000).toFixed(8)} ₿` : '0.00000 ₿'}
                  </div>
                  <div className="text-[10px] text-muted">{paymentMethod === 'btc' ? `Estimated (${mempoolFees.fastestFee} sat/vB)` : 'Lightning Free'}</div>
                </div>
              </div>

              <div className="relative mb-6">
                <div className="bg-bg p-4 rounded-xl font-mono text-[10px] text-muted break-all border border-border text-left pr-12">
                  {paymentMethod === 'bolt12' ? bolt12Offer : (paymentMethod === 'lightning' ? bolt11Invoice : BITCOIN_ADDRESS)}
                </div>
                <button
                  onClick={onCopyInvoice}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-surface rounded-lg transition-colors text-accent"
                >
                  {invoiceCopied ? <CheckCircle2 className="w-4 h-4" /> : <Layers className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex gap-3">
                <Button variant="secondary" className="flex-1" onClick={onClose}>
                  Cancel
                </Button>
                <Button className="flex-[2] bg-accent text-black hover:opacity-90" onClick={onDeploy}>
                  {paymentMethod === 'btc' ? 'I have sent the payment' : 'Confirm Payment'}
                </Button>
              </div>

              <p className="mt-6 text-[10px] text-muted flex items-center justify-center gap-1.5">
                <ShieldAlert className="w-3 h-3" />
                Payments are non-reversible. Ensure the amount is exact.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Modal>
  );
}
