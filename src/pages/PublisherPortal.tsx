import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Card, CardTitle, Button } from "@/components/ui";
import { adSlots } from "@/data/adSlots";
import { cn } from "@/lib/utils";
import { Plus, DollarSign, Users, Layout, Zap } from "lucide-react";

interface Bid {
  id: number;
  slotName: string;
  amount: number;
  time: string;
}

export default function PublisherPortal() {
  const [bids, setBids] = useState<Bid[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newBid: Bid = {
        id: Date.now(),
        slotName: adSlots[Math.floor(Math.random() * adSlots.length)].name,
        amount: Math.random() * 0.002,
        time: new Date().toLocaleTimeString(),
      };
      setBids(prev => [newBid, ...prev].slice(0, 5));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const settle = async (amount: number, address: string, paymentType: string) => {
    const response = await fetch("/api/settle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, address, paymentType }),
    });
    const data = await response.json();
    alert(`Settlement initiated! TXID: ${data.txid}`);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Publisher Portal</h1>
          <p className="text-sm text-muted mt-1">List your ad slots and manage direct bids from advertisers.</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> List New Slot
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="md:col-span-3">
          <CardTitle className="flex items-center gap-2 mb-6"><Layout className="w-5 h-5 text-accent" /> Your Ad Slots</CardTitle>
          <table className="w-full text-[13px] border-collapse">
            <thead>
              <tr className="bg-surface/40">
                <th className="text-left p-4 text-[10px] uppercase tracking-widest text-muted border-b border-border font-bold">Slot Name</th>
                <th className="text-left p-4 text-[10px] uppercase tracking-widest text-muted border-b border-border font-bold">Site</th>
                <th className="text-left p-4 text-[10px] uppercase tracking-widest text-muted border-b border-border font-bold">Type</th>
                <th className="text-left p-4 text-[10px] uppercase tracking-widest text-muted border-b border-border font-bold">Status</th>
                <th className="text-left p-4 text-[10px] uppercase tracking-widest text-muted border-b border-border font-bold">Current Bid</th>
                <th className="text-right p-4 text-[10px] uppercase tracking-widest text-muted border-b border-border font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {adSlots.map(slot => (
                <tr key={slot.id} className="border-b border-border/50 hover:bg-surface/50">
                  <td className="p-4 font-bold">{slot.name}</td>
                  <td className="p-4 font-mono text-muted">{slot.site}</td>
                  <td className="p-4 capitalize">{slot.type}</td>
                  <td className="p-4">
                    <span className={cn(
                      "px-2 py-1 rounded-full text-[10px] font-bold uppercase",
                      slot.status === 'available' ? "bg-green/10 text-green" :
                      slot.status === 'bidding' ? "bg-accent/10 text-accent" :
                      "bg-muted/10 text-muted"
                    )}>{slot.status}</span>
                  </td>
                  <td className="p-4 font-mono font-bold text-accent">{slot.currentBid.toFixed(4)} ₿</td>
                  <td className="p-4 text-right flex gap-2 justify-end">
                    <Button variant="secondary" size="sm">Manage</Button>
                    <Button variant="primary" size="sm" onClick={() => {
                      const type = prompt("Enter payment type (on-chain/lightning):", "on-chain");
                      if (type) settle(slot.currentBid, 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', type);
                    }}>Settle</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card>
          <CardTitle className="flex items-center gap-2 mb-6"><Zap className="w-5 h-5 text-accent" /> Live Bids</CardTitle>
          <div className="space-y-4">
            {bids.length === 0 && <div className="text-xs text-muted text-center py-4">Waiting for bids...</div>}
            {bids.map(bid => (
              <motion.div 
                key={bid.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-3 bg-surface rounded-xl border border-border flex justify-between items-center"
              >
                <div>
                  <div className="text-[10px] font-bold text-muted">{bid.slotName}</div>
                  <div className="text-xs font-bold text-accent">{bid.amount.toFixed(4)} ₿</div>
                </div>
                <div className="text-[9px] text-muted">{bid.time}</div>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>
    </motion.div>
  );
}
