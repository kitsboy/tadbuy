import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Card, CardTitle, Button } from "@/components/ui";
import { Zap, ArrowDownCircle, ArrowUpCircle, Copy, CheckCircle2 } from "lucide-react";
import { useToast } from "@/components/Toast";

export default function Wallet() {
  const [balance, setBalance] = useState<number | null>(null);
  const [invoice, setInvoice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    fetch("/api/lightning/info")
      .then(res => res.json())
      .then(info => setBalance(info.confirmed_balance))
      .catch(console.error);
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
      addToast("Invoice created successfully", "success");
    } catch (e) {
      addToast("Failed to create invoice", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <h1 className="text-2xl font-extrabold tracking-tight">Lightning Wallet</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass-panel p-6">
          <CardTitle>Balance</CardTitle>
          <div className="text-4xl font-extrabold my-4 text-accent">{balance !== null ? balance.toLocaleString() : "..."} <span className="text-xl">sats</span></div>
          <div className="flex gap-3">
            <Button className="flex-1 gap-2" onClick={handleCreateInvoice} disabled={loading}>
              <ArrowDownCircle className="w-4 h-4" /> Fund Wallet
            </Button>
            <Button variant="secondary" className="flex-1 gap-2">
              <ArrowUpCircle className="w-4 h-4" /> Withdraw
            </Button>
          </div>
        </Card>
      </div>

      {invoice && (
        <Card className="glass-panel p-6">
          <CardTitle>Funding Invoice</CardTitle>
          <div className="bg-surface p-4 rounded-lg font-mono text-xs break-all mt-4 mb-4 border border-border">
            {invoice}
          </div>
          <Button variant="secondary" size="sm" className="gap-2" onClick={() => { navigator.clipboard.writeText(invoice); addToast("Copied to clipboard", "success"); }}>
            <Copy className="w-4 h-4" /> Copy Invoice
          </Button>
        </Card>
      )}
    </motion.div>
  );
}
