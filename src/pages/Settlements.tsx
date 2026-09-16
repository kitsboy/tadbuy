import React, { useState } from "react";
import { motion } from "motion/react";
import { Card, CardTitle } from "@/components/ui";
import { Badge } from "@/components/ui/index";
import { BITCOIN_ADDRESS } from "@/constants";
import { usePageMeta } from "@/hooks/usePageMeta";
import { PageShell } from '@/components/PageShell';
import { FeeBreakdown } from '@/components/FeeBreakdown';
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

// Preview sample rows — labelled in the UI as sample data. No backend exists on
// the static host to produce real settlements (see /beta), and we never invent
// a real-looking chain record as if it settled.
const SAMPLE_SETTLEMENTS: Settlement[] = [
  {
    id: "DEMO-1",
    amount: 0.000125,
    paymentType: "lightning",
    address: "demo…payout-1",
    txid: "",
    status: "completed",
  },
  {
    id: "DEMO-2",
    amount: 0.00005,
    paymentType: "on-chain",
    address: "demo…payout-2",
    txid: "",
    status: "pending",
  },
];

export default function Settlements() {
  usePageMeta('Settlements', 'On-chain and Lightning settlement history for your Bitcoin address.');

  // Preview build: no settlements backend on the static host and the mempool
  // WebSocket is not in connect-src (and would be dead weight on a sample page),
  // so this renders labelled sample rows instead of firing requests that cannot
  // succeed. Real settlements arrive with the backend (see /beta).
  const [settlements, setSettlements] = useState<Settlement[]>(SAMPLE_SETTLEMENTS);
  const [loading, setLoading]         = useState(false);

  // Allow user to track any Bitcoin address — local-only in this preview; we
  // cannot watch the chain without a backend, so switching clears to an honest
  // empty state instead of pretending.
  const [trackedAddress, setTrackedAddress] = useState(BITCOIN_ADDRESS);
  const [addressInput, setAddressInput]     = useState(BITCOIN_ADDRESS);

  return (
    <PageShell
      title="Settlement History"
      description="On-chain payments and Lightning payouts for your address."
      breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Settlements' }]}
      showDemoBadge
      actions={
        <div className="flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full border font-mono text-muted border-border">
          <Activity className="w-3 h-3" />
          Preview — sample data
        </div>
      }
    >
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
              // Local-only: without a chain watcher this preview cannot follow
              // an address, so switching shows the honest empty state.
              setSettlements([]);
            }
          }}
          className="px-4 py-2.5 bg-accent text-black font-bold text-xs rounded-xl hover:bg-accent/80 transition-colors whitespace-nowrap"
        >
          Track Address
        </button>
      </div>

      <FeeBreakdown budgetSats={50_000} budgetUsd={50} compact />

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
                    <div className="font-bold text-text">No settlements shown</div>
                    <div className="text-xs max-w-sm mx-auto leading-relaxed">
                      This preview build has no settlement backend and cannot watch the chain — enter an address only to see how tracking will work. Real completed payments and payouts appear here with the backend.
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              settlements.map(s => (
                <tr key={s.id} className="border-t border-border/50 hover:bg-surface/30 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-muted">{s.id}</td>
                  <td className="px-4 py-3 font-mono text-xs font-bold">{s.amount.toFixed(8)}</td>
                  <td className="px-4 py-3">
                    <Badge variant={s.paymentType === 'lightning' ? 'warning' : 'info'} className="normal-case">
                      {s.paymentType}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted hidden md:table-cell">
                    {s.address.slice(0, 12)}…{s.address.slice(-6)}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted hidden lg:table-cell">
                    {s.txid ? `${s.txid.slice(0, 10)}…` : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={s.status === "completed" ? "success" : "warning"}
                      dot={s.status === "pending"}
                      className="normal-case"
                    >
                      {s.status === "completed"
                        ? <><CheckCircle2 className="w-3 h-3" /> {s.status}</>
                        : <><AlertCircle className="w-3 h-3" /> {s.status}</>
                      }
                    </Badge>
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
          {trackedAddress}
        </span>
      </CardTitle>
    </PageShell>
  );
}
