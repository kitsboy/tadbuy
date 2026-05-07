import { useState, useEffect, type FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Card, CardTitle, Button, Input, Label, FormGroup, Modal } from "@/components/ui";
import { Zap, ArrowDownCircle, ArrowUpCircle, Copy, CheckCircle2, QrCode, X } from "lucide-react";
import { useToast } from "@/components/Toast";
import { QRCodeSVG } from "qrcode.react";

export default function Wallet() {
  const [balance, setBalance] = useState<number | null>(null);
  const [invoice, setInvoice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const { addToast } = useToast();

  // Withdraw modal state
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawAddress, setWithdrawAddress] = useState('');
  const [withdrawLoading, setWithdrawLoading] = useState(false);

  useEffect(() => {
    fetch("/api/lightning/info")
      .then(res => res.json())
      .then(info => setBalance(info.confirmed_balance))
      .catch(() => {
        // API unavailable — show placeholder balance
        setBalance(0);
      });
  }, []);

  const handleCreateInvoice = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/lightning/invoice", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amountSats: 1000, description: "Tadbuy Wallet Funding" })
      });
      const inv = await response.json();
      setInvoice(inv.request);
      setShowQR(true);
      addToast("Invoice created successfully", "success");
    } catch {
      addToast("Failed to create invoice", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!invoice) return;
    navigator.clipboard.writeText(invoice);
    setCopied(true);
    addToast("Invoice copied to clipboard", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWithdrawSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!withdrawAmount || !withdrawAddress) {
      addToast("Please fill in all fields", "error");
      return;
    }
    setWithdrawLoading(true);
    try {
      const res = await fetch('/api/settle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseInt(withdrawAmount, 10),
          address: withdrawAddress,
          paymentType: 'lightning',
        }),
      });
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      addToast("Withdrawal submitted successfully", "success");
      setShowWithdrawModal(false);
      setWithdrawAmount('');
      setWithdrawAddress('');
    } catch (err) {
      addToast("Withdrawal failed — please try again", "error");
    } finally {
      setWithdrawLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Lightning Wallet</h1>
        <p className="text-sm text-muted mt-1">Manage your on-chain and Lightning balance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Balance Card */}
        <Card className="glass-panel p-6">
          <CardTitle>Balance</CardTitle>
          <div className="text-4xl font-extrabold my-4 text-accent">
            {balance !== null ? balance.toLocaleString() : (
              <span className="inline-block w-24 h-10 bg-surface rounded-lg animate-pulse" />
            )}
            {balance !== null && <span className="text-xl text-muted ml-2">sats</span>}
          </div>
          <div className="flex gap-3">
            <Button className="flex-1 gap-2" onClick={handleCreateInvoice} disabled={loading}>
              <ArrowDownCircle className="w-4 h-4" />
              {loading ? "Generating..." : "Fund Wallet"}
            </Button>
            <Button variant="secondary" className="flex-1 gap-2" onClick={() => setShowWithdrawModal(true)}>
              <ArrowUpCircle className="w-4 h-4" /> Withdraw
            </Button>
          </div>
        </Card>

        {/* Quick Stats */}
        <Card className="glass-panel p-6">
          <CardTitle>Network</CardTitle>
          <div className="space-y-3 mt-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted">Status</span>
              <span className="text-green font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" />
                Online
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted">Protocol</span>
              <span className="font-mono text-accent">Lightning ⚡</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted">Min Invoice</span>
              <span className="font-mono">1 sat</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted">Settlement</span>
              <span className="font-mono text-lightning">Instant</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Invoice Card — only appears after generation */}
      {invoice && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="glass-panel p-6">
            <div className="flex items-center justify-between mb-6">
              <CardTitle className="mb-0">Funding Invoice</CardTitle>
              <button
                onClick={() => setShowQR(v => !v)}
                className="flex items-center gap-1.5 text-[11px] font-bold text-muted hover:text-accent transition-colors border border-border hover:border-accent/50 px-2.5 py-1 rounded-lg"
              >
                <QrCode className="w-3.5 h-3.5" />
                {showQR ? "Hide QR" : "Show QR"}
              </button>
            </div>

            {/* QR Code — toggleable */}
            {showQR && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex justify-center mb-6"
              >
                <div className="bg-white p-3 rounded-2xl shadow-2xl inline-block">
                  <QRCodeSVG
                    value={invoice}
                    size={200}
                    level="H"
                    includeMargin={false}
                  />
                </div>
              </motion.div>
            )}

            {/* Raw invoice string */}
            <div className="relative mb-4">
              <div className="bg-surface p-4 rounded-xl font-mono text-xs break-all border border-border text-muted leading-relaxed pr-12">
                {invoice}
              </div>
              <button
                onClick={handleCopy}
                className="absolute top-3 right-3 p-1.5 rounded-lg bg-surface border border-border hover:border-accent/50 hover:text-accent text-muted transition-all"
                title="Copy invoice"
              >
                {copied
                  ? <CheckCircle2 className="w-4 h-4 text-green" />
                  : <Copy className="w-4 h-4" />
                }
              </button>
            </div>

            <div className="flex gap-3">
              <Button
                variant="secondary"
                size="sm"
                className="flex-1 gap-2"
                onClick={handleCopy}
              >
                {copied ? <CheckCircle2 className="w-4 h-4 text-green" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied!" : "Copy Invoice"}
              </Button>
              <Button
                variant="lightning"
                size="sm"
                className="flex-1 gap-2"
                onClick={() => {
                  if (invoice) window.open(`lightning:${invoice}`, '_blank');
                }}
              >
                <Zap className="w-4 h-4" />
                Open in Wallet
              </Button>
            </div>

            <p className="text-[10px] text-muted mt-4 text-center">
              Invoice expires in 1 hour · 1,000 sats · Scan with any Lightning wallet
            </p>
          </Card>
        </motion.div>
      )}
      {/* Withdraw Modal */}
      <Modal isOpen={showWithdrawModal} onClose={() => setShowWithdrawModal(false)}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-extrabold">Withdraw Funds</h2>
            <button onClick={() => setShowWithdrawModal(false)} className="text-muted hover:text-text transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleWithdrawSubmit} className="space-y-4">
            <FormGroup>
              <Label>Amount (sats)</Label>
              <Input
                type="number"
                placeholder="e.g. 10000"
                min="1"
                value={withdrawAmount}
                onChange={e => setWithdrawAmount(e.target.value)}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label>Lightning Address or BOLT11 Invoice</Label>
              <Input
                type="text"
                placeholder="user@wallet.com or lnbc..."
                value={withdrawAddress}
                onChange={e => setWithdrawAddress(e.target.value)}
                required
              />
              <p className="text-[10px] text-muted mt-1">
                Enter a Lightning address (e.g. you@walletofsatoshi.com) or paste a BOLT11 invoice.
              </p>
            </FormGroup>
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="secondary"
                className="flex-1"
                onClick={() => setShowWithdrawModal(false)}
                disabled={withdrawLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 gap-2 bg-lightning text-black hover:opacity-90"
                disabled={withdrawLoading}
              >
                <Zap className="w-4 h-4" />
                {withdrawLoading ? "Sending..." : "Withdraw"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </motion.div>
  );
}
