import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Card, CardTitle } from "@/components/ui";
import { cn } from "@/lib/utils";
import { BITCOIN_ADDRESS } from "@/constants";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Activity, Clock, CheckCircle2, AlertCircle } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Settlement {
  id: string;
  amount: number;
  paymentType: string;
  address: string;
  txid: string;
  status: "completed" | "pending";
}

// Skeleton row
const SkeletonRow = () => (
  <tr className="border-t border-border/50">
    {Array.from({ length: 6 }).map((_, i) => (
      <td key={i} className="p-4">
        <div className="h-3.5 bg-surface rounded animate-pulse" style={{ width: `${50 + (i * 13) % 40}%` }} />
      </td>
    ))}
  </tr>
);

export default function Settlements() {
  usePageTitle("Settlements");

  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [loading, setLoading]         = useState(true);
  const [wsStatus, setWsStatus]       = useState<"connecting" | "live" | "error">("connecting");
  const socketRef = useRef<WebSocket | null>(null);

  // Allow user to track any Bitcoin address — defaults to the project address
  const [trackedAddress, setTrackedAddress] = useState(BITCOIN_ADDRESS);
  const [addressInput, setAddressInput]     = useState(BITCOIN_ADDRESS);

  // ── REST fetch ──────────────────────────────────────────────────────────────
  useEffect(() => {
    fetch("/api/settlements")
      .then(res => { if (!res.ok) throw new Error("API unavailable"); return res.json(); })
      .then((data: Settlement[]) => setSettlements(data))
      .catch(() => setSettlements([]))   // fail silently — empty state is handled
      .finally(() => setLoading(false));
  }, []);

  // ── Mempool WebSocket — watch OUR address only ──────────────────────────────
  useEffect(() => {
    let socket: WebSocket;
    let retryTimeout: ReturnType<typeof setTimeout>;

    const connect = () => {
      try {
        socket = new WebSocket("wss://mempool.space/api/v1/ws");
        socketRef.current = socket;

        socket.onopen = () => {
          setWsStatus("live");
          // Track only our specific address — not all global mempool activity
          socket.send(JSON.stringify({
            action: "track-address",
            data: trackedAddress,
          }));
        };

        socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data as string);
            // Only surface events for our tracked address
            if (data["address-transactions"]) {
              const tx = data["address-transactions"][0];
              if (tx) {
                setSettlements(prev => [{
                  id: tx.txid.slice(0, 8).toUpperCase(),
                  amount: (tx.vout?.reduce((a: number, v: { value: number }) => a + v.value, 0) ?? 0) / 1e8,
                  paymentType: "on-chain",
                  address: trackedAddress,
                  txid: tx.txid,
                  status: "pending",
                }, ...prev]);
              }
            }
          } catch {
            // Malformed message — ignore silently
          }
        };

        socket.onerror = () => setWsStatus("error");

        socket.onclose = () => {
          setWsStatus("error");
          // Auto-reconnect after 10s
          retryTimeout = setTimeout(connect, 10_000);
        };
      } catch {
        setWsStatus("error");
      }
    };

    connect();

    return () => {
      clearTimeout(retryTimeout);
      socketRef.current?.close();
    };
  }, [trackedAddress]); // Re-connect whenever the tracked address changes

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

      {/* Address Tracker */}
      <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
        <input
          type="text"
          value={addressInput}
          onChange={e => setAddressInput(e.target.value)}
          placeholder="Enter Bitcoin address to track…"
          className="flex-1 font-mono text-xs bg-surface border border-border rounded-xl px-4 py-2.5 focus:border-accent outline-none"
        />
        <button
          onClick={() => {
            const trimmed = addressInput.trim();
            if (trimmed) {
              setTrackedAddress(trimmed);
              setSettlements([]);
              setWsStatus("connecting");
            }
          }}
          className="px-4 py-2.5 bg-accent text-black font-bold text-xs rounded-xl hover:bg-accent/80 transition-colors whitespace-nowrap"
        >
          Track Address
        </button>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Settlement History</h1>
          <p className="text-sm text-muted mt-1">On-chain payments and Lightning payouts for your address.</p>
        </div>
        {/* WS status badge */}
        <div className={cn(
          "flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full border font-mono",
          wsStatus === "live"       && "text-green  bg-green/10  border-green/20",
          wsStatus === "connecting" && "text-lightning bg-lightning/10 border-lightning/20",
          wsStatus === "error"      && "text-red    bg-red/10    border-red/20",
        )}>
          <Activity className="w-3 h-3" />
          {wsStatus === "live" ? "Mempool Live" : wsStatus === "connecting" ? "Connecting…" : "WS Error"}
        </div>
      </div>

      <Card className="glass-panel overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-muted text-left text-[11px] uppercase tracking-wider border-b border-border">
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Amount (BTC)</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3 hidden md:table-cell">Address</th>
              <th className="px-4 py-3 hidden lg:table-cell">TXID</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 4 }, (_, i) => React.createElement(SkeletonRow, { key: i }))
            ) : settlements.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-16 text-center text-muted">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-surface/50 border border-border flex items-center justify-center">
                      <Clock className="w-7 h-7 text-muted" />
                    </div>
                    <div className="font-bold text-text">No settlements yet</div>
                    <div className="text-xs max-w-sm mx-auto leading-relaxed">
                      Your completed payments and publisher payouts will appear here when the mempool confirms them.
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              settlements.map(s => (
                <tr key={s.id} className="border-t border-border/50 hover:bg-surface/30 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-muted">{s.id}</td>
                  <td className="px-4 py-3 font-mono text-xs font-bold">{s.amount.toFixed(8)}</td>
                  <td className="px-4 py-3 text-xs capitalize">{s.paymentType}</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted hidden md:table-cell">
                    {s.address.slice(0, 12)}…{s.address.slice(-6)}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted hidden lg:table-cell">
                    {s.txid ? `${s.txid.slice(0, 10)}…` : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      "flex items-center gap-1 text-[10px] font-bold w-fit px-2 py-0.5 rounded-full border",
                      s.status === "completed"
                        ? "text-green bg-green/10 border-green/20"
                        : "text-lightning bg-lightning/10 border-lightning/20"
                    )}>
                      {s.status === "completed"
                        ? <CheckCircle2 className="w-3 h-3" />
                        : <AlertCircle  className="w-3 h-3" />}
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>

      {/* Address being tracked */}
      <CardTitle className="text-[10px]">
        Tracking address:&nbsp;
        <span className="font-mono text-muted normal-case tracking-normal font-normal">
          {BITCOIN_ADDRESS}
        </span>
      </CardTitle>
    </motion.div>
  );
}
