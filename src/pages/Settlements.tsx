import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Card } from "@/components/ui";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/Toast";

export default function Settlements() {
  const [settlements, setSettlements] = useState([]);
  const { addToast } = useToast();

  useEffect(() => {
    fetch("/api/settlements")
      .then(res => res.json())
      .then(data => setSettlements(data));

    // Connect to Mempool.space WebSocket
    const socket = new WebSocket("wss://mempool.space/api/v1/ws");
    socket.onopen = () => {
      console.log("Connected to Mempool WebSocket");
      socket.send(JSON.stringify({ action: "want", data: ["blocks", "mempool-blocks"] }));
    };
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.tx) {
        console.log("New transaction detected:", data.tx.txid);
        addToast(`Settlement completed: ${data.tx.txid}`, 'success');
        // Update settlement status in state here
      }
    };
    return () => socket.close();
  }, [addToast]);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <h1 className="text-2xl font-extrabold tracking-tight">Settlement History</h1>
      <Card className="glass-panel">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-muted text-left">
              <th className="p-4">ID</th>
              <th className="p-4">Amount (BTC)</th>
              <th className="p-4">Type</th>
              <th className="p-4">Address</th>
              <th className="p-4">TXID</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {settlements.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-12 text-center text-muted">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-surface/50 border border-border flex items-center justify-center mb-4">
                      <span className="text-2xl">💸</span>
                    </div>
                    <div className="font-bold text-text mb-1">No settlements yet</div>
                    <div className="text-xs max-w-sm mx-auto">Your completed payments and publisher payouts will appear here.</div>
                  </div>
                </td>
              </tr>
            ) : (
              settlements.map((s: any) => (
                <tr key={s.id} className="border-t border-border">
                  <td className="p-4">{s.id}</td>
                  <td className="p-4 font-mono">{s.amount.toFixed(8)}</td>
                  <td className="p-4">{s.paymentType}</td>
                  <td className="p-4 font-mono text-xs">{s.address}</td>
                  <td className="p-4 font-mono text-xs">{s.txid}</td>
                  <td className={cn("p-4 font-bold", s.status === "completed" ? "text-green-500" : "text-yellow-500")}>{s.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>
    </motion.div>
  );
}
