import { useState, useMemo, type FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button, Input, Label, Modal, Select } from "@/components/ui";
import { useToast } from "@/components/Toast";
import {
  Search, Filter, Zap, Users, Globe, TrendingUp,
  CheckCircle, ChevronDown, X, BarChart2,
} from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";

// ─── Types ────────────────────────────────────────────────────────────────────

interface InventorySlot {
  id: string;
  name: string;
  publisher: string;
  publisherVerified: boolean;
  placement: string;
  format: string;
  category: string;
  audience: string;
  geo: string[];
  minBidSats: number;
  currentBidSats: number;
  impressionsPerDay: number;
  ctr: number;
  status: "available" | "hot";
  tags: string[];
  thumbnail: null;
}

// ─── Inventory ────────────────────────────────────────────────────────────────

const INVENTORY: InventorySlot[] = [
  {
    id: "slot_btc_hero",
    name: "Bitcoin.org Homepage Hero",
    publisher: "Bitcoin.org",
    publisherVerified: true,
    placement: "Above the fold",
    format: "728×90 Leaderboard",
    category: "Bitcoin & Crypto",
    audience: "2.4M monthly visitors",
    geo: ["US", "EU", "APAC"],
    minBidSats: 5000,
    currentBidSats: 18500,
    impressionsPerDay: 45000,
    ctr: 2.1,
    status: "available",
    tags: ["bitcoin", "finance", "tech"],
    thumbnail: null,
  },
  {
    id: "slot_nostr_sidebar",
    name: "Nostr.com Sidebar",
    publisher: "Nostr.com",
    publisherVerified: true,
    placement: "Article sidebar",
    format: "300×250 Rectangle",
    category: "Social / Nostr",
    audience: "890K monthly visitors",
    geo: ["Global"],
    minBidSats: 2000,
    currentBidSats: 7200,
    impressionsPerDay: 18000,
    ctr: 1.8,
    status: "available",
    tags: ["nostr", "social", "decentralized"],
    thumbnail: null,
  },
  {
    id: "slot_stacker_banner",
    name: "Stacker News Top Banner",
    publisher: "Stacker News",
    publisherVerified: true,
    placement: "Top of feed",
    format: "970×250 Billboard",
    category: "Bitcoin Community",
    audience: "320K monthly visitors",
    geo: ["US", "EU"],
    minBidSats: 8000,
    currentBidSats: 22000,
    impressionsPerDay: 12000,
    ctr: 3.2,
    status: "hot",
    tags: ["bitcoin", "community", "news"],
    thumbnail: null,
  },
  {
    id: "slot_ln_markets",
    name: "LN Markets Sidebar",
    publisher: "LN Markets",
    publisherVerified: false,
    placement: "Dashboard sidebar",
    format: "300×600 Half Page",
    category: "Lightning / Finance",
    audience: "145K monthly visitors",
    geo: ["Global"],
    minBidSats: 3500,
    currentBidSats: 9800,
    impressionsPerDay: 8500,
    ctr: 2.7,
    status: "available",
    tags: ["lightning", "trading", "finance"],
    thumbnail: null,
  },
  {
    id: "slot_btcpay_footer",
    name: "BTCPay Server Footer",
    publisher: "BTCPay Server",
    publisherVerified: true,
    placement: "Documentation footer",
    format: "728×90 Leaderboard",
    category: "Bitcoin Tools",
    audience: "280K monthly visitors",
    geo: ["Global"],
    minBidSats: 1500,
    currentBidSats: 4100,
    impressionsPerDay: 6200,
    ctr: 1.4,
    status: "available",
    tags: ["payments", "open-source", "tools"],
    thumbnail: null,
  },
  {
    id: "slot_primal_feed",
    name: "Primal In-Feed Ad",
    publisher: "Primal",
    publisherVerified: false,
    placement: "Social feed",
    format: "Native Feed Post",
    category: "Social / Nostr",
    audience: "210K monthly visitors",
    geo: ["Global"],
    minBidSats: 4000,
    currentBidSats: 11200,
    impressionsPerDay: 15000,
    ctr: 2.9,
    status: "available",
    tags: ["nostr", "native", "social"],
    thumbnail: null,
  },
];

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES = [
  "All",
  "Bitcoin & Crypto",
  "Social / Nostr",
  "Lightning / Finance",
  "Bitcoin Tools",
  "Bitcoin Community",
] as const;

const SORT_OPTIONS = [
  { value: "best_ctr",         label: "Best CTR" },
  { value: "lowest_bid",       label: "Lowest Bid" },
  { value: "most_impressions", label: "Most Impressions" },
] as const;

type SortOption = typeof SORT_OPTIONS[number]["value"];
type StatusFilter = "all" | "available" | "hot";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatSats(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k` : String(n);
}

function geoFlag(geo: string): string {
  const map: Record<string, string> = {
    US: "🇺🇸",
    EU: "🇪🇺",
    APAC: "🌏",
    Global: "🌍",
  };
  return map[geo] ?? geo;
}

// ─── Bid Modal ────────────────────────────────────────────────────────────────

function BidModal({ slot, onClose }: { slot: InventorySlot; onClose: () => void }) {
  const { addToast } = useToast();
  const [bidSats, setBidSats] = useState("");
  const [budgetSats, setBudgetSats] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ bid?: string; budget?: string }>({});

  function validate(): boolean {
    const errs: typeof errors = {};
    const bid = Number(bidSats);
    const budget = Number(budgetSats);

    if (!bidSats || isNaN(bid) || bid <= 0) {
      errs.bid = "Enter a valid bid amount.";
    } else if (bid <= slot.currentBidSats) {
      errs.bid = `Bid must exceed current bid of ${slot.currentBidSats.toLocaleString()} sats.`;
    }

    if (budgetSats && (isNaN(budget) || budget <= 0)) {
      errs.budget = "Enter a valid budget or leave blank.";
    } else if (budget > 0 && budget < bid) {
      errs.budget = "Budget must be ≥ your bid amount.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slotId: slot.id,
          slotName: slot.name,
          bidSats: Number(bidSats),
          budgetSats: budgetSats ? Number(budgetSats) : null,
        }),
      });
      addToast(`Bid placed on "${slot.name}" for ${Number(bidSats).toLocaleString()} sats! ⚡`, "success");
      onClose();
    } catch {
      addToast("Failed to place bid. Please try again.", "info");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal isOpen onClose={onClose}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-5 pr-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted">Placing Bid</span>
            {slot.status === "hot" && <span className="text-xs">🔥</span>}
          </div>
          <h2 className="text-lg font-extrabold leading-tight">{slot.name}</h2>
          <p className="text-xs text-muted mt-0.5">{slot.publisher} · {slot.format}</p>
        </div>

        {/* Current bid stat */}
        <div className="bg-black/30 rounded-xl border border-white/5 p-4 mb-5 flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase font-bold tracking-widest text-muted mb-0.5">Current Bid</div>
            <div className="text-2xl font-extrabold text-accent">
              {slot.currentBidSats.toLocaleString()}
              <span className="text-sm font-bold text-muted ml-1">sats</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase font-bold tracking-widest text-muted mb-0.5">Min Bid</div>
            <div className="text-sm font-bold text-text">{slot.minBidSats.toLocaleString()} sats</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Your bid */}
          <div>
            <Label htmlFor="bid-amount">Your Bid (sats)</Label>
            <div className="relative">
              <Zap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-lightning" />
              <Input
                id="bid-amount"
                type="number"
                min={slot.currentBidSats + 1}
                placeholder={`> ${slot.currentBidSats.toLocaleString()}`}
                value={bidSats}
                onChange={e => { setBidSats(e.target.value); setErrors(prev => ({ ...prev, bid: undefined })); }}
                className={`pl-9 ${errors.bid ? "border-red focus-visible:border-red focus-visible:ring-red/30" : ""}`}
              />
            </div>
            {errors.bid && <p className="text-[11px] text-red mt-1.5">{errors.bid}</p>}
          </div>

          {/* Budget cap */}
          <div>
            <Label htmlFor="budget-cap">Budget Cap (sats) <span className="normal-case text-muted font-normal">— optional</span></Label>
            <Input
              id="budget-cap"
              type="number"
              min={1}
              placeholder="Total sats to spend on this slot"
              value={budgetSats}
              onChange={e => { setBudgetSats(e.target.value); setErrors(prev => ({ ...prev, budget: undefined })); }}
              className={errors.budget ? "border-red focus-visible:border-red focus-visible:ring-red/30" : ""}
            />
            {errors.budget && <p className="text-[11px] text-red mt-1.5">{errors.budget}</p>}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Placing…
                </span>
              ) : (
                <>
                  <Zap className="w-4 h-4" /> Place Bid
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

// ─── Slot Card ────────────────────────────────────────────────────────────────

function SlotCard({ slot, onBid }: { slot: InventorySlot; onBid: (slot: InventorySlot) => void }) {
  const isHot = slot.status === "hot";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`relative rounded-xl overflow-hidden group transition-all duration-300
        ${isHot
          ? "shadow-[0_0_0_1.5px_rgba(255,159,28,0.6),0_0_30px_rgba(255,159,28,0.15)] animate-[hotpulse_2s_ease-in-out_infinite]"
          : "border border-white/10 hover:border-accent/40 hover:shadow-[0_0_28px_rgba(255,159,28,0.1)]"
        }
        bg-surface/60 backdrop-blur-md shadow-xl
      `}
    >
      {/* Hot glow overlay */}
      {isHot && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent" />
        </div>
      )}

      {/* Ambient glow blob */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-accent/5 rounded-full blur-3xl -mr-14 -mt-14 pointer-events-none" />

      <div className="relative z-10 p-5">
        {/* Publisher row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-xs font-bold text-muted truncate">{slot.publisher}</span>
            {slot.publisherVerified && (
              <CheckCircle className="w-3.5 h-3.5 text-blue flex-shrink-0" title="Verified publisher" />
            )}
          </div>
          {/* Status badge */}
          {isHot ? (
            <span className="flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-accent bg-accent/10 border border-accent/30 px-2 py-0.5 rounded-full">
              🔥 Hot
            </span>
          ) : (
            <span className="text-[10px] font-bold uppercase tracking-wider text-green bg-green/10 border border-green/20 px-2 py-0.5 rounded-full">
              Available
            </span>
          )}
        </div>

        {/* Slot name */}
        <h3 className="text-base font-extrabold mb-2.5 group-hover:text-accent transition-colors leading-snug">
          {slot.name}
        </h3>

        {/* Format + Category badges */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className="text-[10px] font-bold bg-accent/10 text-accent border border-accent/20 px-2 py-0.5 rounded">
            {slot.format}
          </span>
          <span className="text-[10px] font-bold bg-surface text-muted border border-border px-2 py-0.5 rounded">
            {slot.category}
          </span>
        </div>

        {/* Placement + Audience */}
        <div className="flex items-center gap-3 text-xs text-muted mb-3">
          <span className="flex items-center gap-1">
            <Globe className="w-3 h-3" /> {slot.placement}
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3" /> {slot.audience}
          </span>
        </div>

        {/* Geo tags */}
        <div className="flex gap-1 flex-wrap mb-4">
          {slot.geo.map(g => (
            <span key={g} className="text-[11px] bg-black/30 border border-white/5 px-1.5 py-0.5 rounded text-text/70">
              {geoFlag(g)} {g}
            </span>
          ))}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-black/25 border border-white/5 rounded-xl p-2.5">
            <div className="text-[9px] uppercase font-bold tracking-widest text-muted mb-0.5 flex items-center gap-1">
              <BarChart2 className="w-2.5 h-2.5" /> Impressions/Day
            </div>
            <div className="text-sm font-bold">{slot.impressionsPerDay.toLocaleString()}</div>
          </div>
          <div className="bg-black/25 border border-white/5 rounded-xl p-2.5">
            <div className="text-[9px] uppercase font-bold tracking-widest text-muted mb-0.5 flex items-center gap-1">
              <TrendingUp className="w-2.5 h-2.5" /> CTR
            </div>
            <div className={`text-sm font-bold ${slot.ctr >= 3 ? "text-green" : slot.ctr >= 2 ? "text-accent" : "text-text"}`}>
              {slot.ctr}%
            </div>
          </div>
        </div>

        {/* Bid info */}
        <div className="flex items-end justify-between mb-4">
          <div>
            <div className="text-[9px] uppercase font-bold tracking-widest text-muted mb-0.5">Current Bid</div>
            <div className="text-xl font-extrabold text-accent leading-none">
              {formatSats(slot.currentBidSats)}
              <span className="text-xs font-bold text-muted ml-1">sats</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[9px] uppercase font-bold tracking-widest text-muted mb-0.5">Min Bid</div>
            <div className="text-xs font-bold text-text/70">{formatSats(slot.minBidSats)} sats</div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex gap-1 flex-wrap mb-4">
          {slot.tags.map(t => (
            <span key={t} className="text-[10px] text-muted/70 bg-black/20 px-1.5 py-0.5 rounded">
              #{t}
            </span>
          ))}
        </div>

        {/* CTA */}
        <Button
          className="w-full group-hover:shadow-[0_0_24px_rgba(255,159,28,0.35)] transition-all flex items-center justify-center gap-2"
          onClick={() => onBid(slot)}
        >
          <Zap className="w-4 h-4" /> Bid Now
        </Button>
      </div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Marketplace() {
  usePageTitle("Marketplace");

  const { addToast: _addToast } = useToast();

  const [searchTerm, setSearchTerm]         = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [statusFilter, setStatusFilter]     = useState<StatusFilter>("all");
  const [sortBy, setSortBy]                 = useState<SortOption>("best_ctr");
  const [bidSlot, setBidSlot]               = useState<InventorySlot | null>(null);

  const filtered = useMemo(() => {
    let items = INVENTORY.filter(item => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.publisher.toLowerCase().includes(q) ||
        item.tags.some(t => t.includes(q));
      const matchesCategory =
        activeCategory === "All" || item.category === activeCategory;
      const matchesStatus =
        statusFilter === "all" || item.status === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    });

    items = [...items].sort((a, b) => {
      if (sortBy === "best_ctr")         return b.ctr - a.ctr;
      if (sortBy === "lowest_bid")       return a.currentBidSats - b.currentBidSats;
      if (sortBy === "most_impressions") return b.impressionsPerDay - a.impressionsPerDay;
      return 0;
    });

    return items;
  }, [searchTerm, activeCategory, statusFilter, sortBy]);

  return (
    <>
      {/* Hot pulse keyframes — injected once */}
      <style>{`
        @keyframes hotpulse {
          0%, 100% { box-shadow: 0 0 0 1.5px rgba(255,159,28,0.6), 0 0 22px rgba(255,159,28,0.12); }
          50%       { box-shadow: 0 0 0 2px rgba(255,159,28,0.9),   0 0 38px rgba(255,159,28,0.28); }
        }
      `}</style>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

        {/* ── Page header ────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">Ad Marketplace</h1>
            <p className="text-sm text-muted mt-1">
              Browse and bid on premium Bitcoin-native ad inventory.
            </p>
          </div>

          {/* Search */}
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <Input
                placeholder="Search slots, publishers, tags…"
                className="pl-10 w-full md:w-72"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="flex items-center gap-1 text-xs text-muted hover:text-text transition-colors border border-border rounded-lg px-3"
              >
                <X className="w-3.5 h-3.5" /> Clear
              </button>
            )}
          </div>
        </div>

        {/* ── Filter bar ─────────────────────────────────────────────── */}
        <div className="glass-panel rounded-xl p-4 space-y-3">

          {/* Category pills */}
          <div className="flex flex-wrap items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-muted flex-shrink-0" />
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all ${
                  activeCategory === cat
                    ? "bg-accent text-black border-accent shadow-[0_0_12px_rgba(255,159,28,0.35)]"
                    : "bg-surface text-muted border-border hover:border-muted hover:text-text"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Status pills + Sort */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Status pills */}
            <div className="flex items-center gap-1.5">
              {(["all", "available", "hot"] as StatusFilter[]).map(s => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1 rounded-full text-[11px] font-bold border transition-all capitalize ${
                    statusFilter === s
                      ? s === "hot"
                        ? "bg-accent/20 text-accent border-accent/50"
                        : "bg-white/10 text-text border-white/20"
                      : "bg-transparent text-muted border-border hover:text-text"
                  }`}
                >
                  {s === "hot" ? "🔥 Hot" : s === "available" ? "✓ Available" : "All Status"}
                </button>
              ))}
            </div>

            {/* Sort dropdown */}
            <div className="relative ml-auto flex items-center gap-2">
              <span className="text-[11px] text-muted font-bold uppercase tracking-wider hidden sm:inline">Sort:</span>
              <div className="relative">
                <Select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as SortOption)}
                  className="pr-8 text-xs py-1.5 min-w-[160px]"
                >
                  {SORT_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </Select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted" />
              </div>
            </div>
          </div>
        </div>

        {/* ── Results count ───────────────────────────────────────────── */}
        <p className="text-xs text-muted">
          {filtered.length === 0
            ? "No slots match your filters."
            : `${filtered.length} slot${filtered.length !== 1 ? "s" : ""} found`}
        </p>

        {/* ── Grid ────────────────────────────────────────────────────── */}
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="col-span-full text-center py-20 text-muted space-y-2"
            >
              <div className="text-4xl">🔍</div>
              <p className="font-bold">No inventory matches your filters.</p>
              <button
                onClick={() => { setSearchTerm(""); setActiveCategory("All"); setStatusFilter("all"); }}
                className="text-xs text-accent underline underline-offset-2 hover:no-underline"
              >
                Reset all filters
              </button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((slot, i) => (
                // eslint-disable-next-line react/no-array-index-key
                <div key={slot.id ?? i}>
                  <SlotCard slot={slot} onBid={setBidSlot} />
                </div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── Bid Modal ──────────────────────────────────────────────────── */}
      {bidSlot && <BidModal slot={bidSlot} onClose={() => setBidSlot(null)} />}
    </>
  );
}
