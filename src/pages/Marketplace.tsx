import { useState, useMemo, useEffect, type FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button, Input, Label, Modal, Select } from "@/components/ui";
import { Chip, SkeletonCard, EmptyState } from "@/components/ui/index";
import { useToast } from "@/components/Toast";
import {
  Search, Filter, Zap, Globe, ChevronDown, X, Star,
  SlidersHorizontal, ArrowUpDown, ArrowUp, ArrowDown, PackageSearch, Heart, Bookmark,
} from "lucide-react";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import {
  MARKETPLACE_SLOTS,
  FEATURED_SLOT_IDS,
  type MarketplaceSlot,
} from "@/data/marketplaceSlots";
import { MARKETPLACE_PLATFORM_TYPES } from '@/data/platforms';
import { PageShell } from '@/components/PageShell';
import { PlacementRequestModal } from '@/components/marketplace/PlacementRequestModal';
import { usePlacementRequests } from '@/hooks/usePlacementRequests';
import { TrustProofMoments } from '@/components/trust/TrustProofMoments';

const PLATFORM_TABS = ["All", ...MARKETPLACE_PLATFORM_TYPES] as const;
type PlatformTab = typeof PLATFORM_TABS[number];

const CATEGORIES = [
  "All",
  "Bitcoin & Crypto",
  "Social / Nostr",
  "Lightning / Finance",
  "Bitcoin Tools",
  "Bitcoin Community",
] as const;

const VENDOR_ASSISTED_PLATFORMS = new Set(['Nostr', 'Blogs', 'Newsletters', 'Podcasts', 'Reddit']);

function canRequestVendorPlacement(slot: MarketplaceSlot): boolean {
  return VENDOR_ASSISTED_PLATFORMS.has(slot.platformType || '');
}

const SORT_OPTIONS = [
  { value: "price_asc", label: "Example budget ↑" },
  { value: "price_desc", label: "Example budget ↓" },
  { value: "newest", label: "Sample order" },
] as const;

type SortOption = typeof SORT_OPTIONS[number]["value"];

function formatSats(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k` : String(n);
}

function geoFlag(geo: string): string {
  const map: Record<string, string> = {
    US: "🇺🇸", EU: "🇪🇺", APAC: "🌏", Global: "🌍", CA: "🇨🇦",
  };
  return map[geo] ?? geo;
}

function BidModal({ slot, onClose }: { slot: MarketplaceSlot; onClose: () => void }) {
  const { addToast } = useToast();
  const [bidSats, setBidSats] = useState("");
  const [budgetSats, setBudgetSats] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ bid?: string; budget?: string }>({});

  function validate(): boolean {
    const errs: typeof errors = {};
    const bid = Number(bidSats);
    const budget = Number(budgetSats);

    if (!bidSats || !Number.isSafeInteger(bid) || bid < slot.minBidSats) {
      errs.bid = `Enter a whole-sat sample amount of at least ${slot.minBidSats.toLocaleString()} sats.`;
    }
    if (budgetSats && (!Number.isSafeInteger(budget) || budget <= 0)) {
      errs.budget = "Enter a whole-sat sample cap or leave it blank.";
    } else if (budget > 0 && budget < bid) {
      errs.budget = "Sample cap must be at least the sample amount.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      addToast(`Example budget reviewed for “${slot.name}”. Nothing was submitted or charged.`, "info", 3200);
      onClose();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal isOpen onClose={onClose}>
      <div className="p-6">
        <div className="mb-5 pr-6">
          <p className="mb-3 rounded-lg border border-lightning/25 bg-lightning/5 px-3 py-2 text-[11px] leading-relaxed text-lightning">
            Local interaction preview only. This does not create an auction bid, contact a publisher, or move sats.
          </p>
          <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-muted">Example budget · local only</p>
          <h2 className="text-lg font-extrabold leading-tight">{slot.name}</h2>
          <p className="mt-0.5 text-xs text-muted">{slot.publisher} · {slot.format}</p>
        </div>

        <div className="mb-5 flex items-center justify-between rounded-xl border border-white/5 bg-black/30 p-4">
          <div>
            <div className="mb-0.5 text-[10px] font-bold uppercase tracking-widest text-muted">Example budget · not a bid</div>
            <div className="text-2xl font-extrabold text-accent">{slot.currentBidSats.toLocaleString()}<span className="ml-1 text-sm font-bold text-muted">sats</span></div>
          </div>
          <div className="text-right">
            <div className="mb-0.5 text-[10px] font-bold uppercase tracking-widest text-muted">Example floor · not an offer</div>
            <div className="text-sm font-bold text-text">{slot.minBidSats.toLocaleString()} sample sats</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="bid-amount">Example amount (sats)</Label>
            <div className="relative">
              <Zap className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-lightning" />
              <Input
                id="bid-amount"
                type="number"
                min={slot.minBidSats}
                max={Number.MAX_SAFE_INTEGER}
                step={1}
                placeholder={`At least ${slot.minBidSats.toLocaleString()}`}
                value={bidSats}
                onChange={event => { setBidSats(event.target.value); setErrors(prev => ({ ...prev, bid: undefined })); }}
                className={`pl-9 ${errors.bid ? "border-red focus-visible:border-red focus-visible:ring-red/30" : ""}`}
              />
            </div>
            {errors.bid && <p className="mt-1.5 text-[11px] text-red">{errors.bid}</p>}
          </div>

          <div>
            <Label htmlFor="budget-cap">Example cap (sats) <span className="normal-case font-normal text-muted">— optional</span></Label>
            <Input
              id="budget-cap"
              type="number"
              min={1}
              max={Number.MAX_SAFE_INTEGER}
              step={1}
              placeholder="Example cap in sats"
              value={budgetSats}
              onChange={event => { setBudgetSats(event.target.value); setErrors(prev => ({ ...prev, budget: undefined })); }}
              className={errors.budget ? "border-red focus-visible:border-red focus-visible:ring-red/30" : ""}
            />
            {errors.budget && <p className="mt-1.5 text-[11px] text-red">{errors.budget}</p>}
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" className="flex-1" onClick={onClose} disabled={loading}>Cancel</Button>
            <Button type="submit" className="flex flex-1 items-center justify-center gap-2" disabled={loading}>
              {loading ? "Reviewing…" : <><Zap className="h-4 w-4" /> Review example amounts</>}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

function FeaturedCard({ slot, onBid, onRequestPlacement }: { slot: MarketplaceSlot; onBid: (slot: MarketplaceSlot) => void; onRequestPlacement: (slot: MarketplaceSlot) => void }) {
  const [watchlist, setWatchlist] = useLocalStorage<string[]>("tadbuy_marketplace_watchlist", []);
  const saved = watchlist.includes(slot.id);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-accent/40 bg-surface/80 p-6 shadow-[0_0_40px_rgba(255,159,28,0.12)]"
    >
      <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full border border-blue/30 bg-blue/10 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-widest text-blue">
        <Star className="h-3 w-3" /> Sample · not live
      </div>
      <button
        type="button"
        onClick={() => setWatchlist(saved ? watchlist.filter(id => id !== slot.id) : [...watchlist, slot.id])}
        className="absolute left-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-zinc-900/80 transition-all hover:border-accent/50 hover:bg-accent/10"
        aria-label={saved ? 'Remove from watchlist' : 'Save to watchlist'}
        title={saved ? 'Saved' : 'Save to watchlist'}
      >
        <Heart className={`h-4 w-4 ${saved ? 'fill-accent text-accent' : 'text-muted'}`} />
      </button>

      <div className="mt-8 text-xs font-bold text-muted">{slot.publisher} · sample archetype</div>
      <h3 className="text-lg font-extrabold leading-snug">{slot.name}</h3>

      <div className="flex flex-wrap gap-1.5">
        <span className="rounded border border-accent/20 bg-accent/10 px-2 py-0.5 text-[10px] font-bold text-accent">{slot.format}</span>
        <span className="rounded border border-border bg-surface px-2 py-0.5 text-[10px] font-bold text-muted">{slot.placement}</span>
      </div>              <div className="rounded-xl border border-border bg-black/20 px-3 py-2.5 text-[11px] text-muted">
        <span className="font-bold text-text">Illustrative audience · not verified:</span> {slot.audience}
      </div>
      <div className="flex items-center justify-between gap-2 rounded-xl border border-border bg-black/20 px-3 py-2.5">
        <span className="text-[10px] uppercase tracking-wider text-muted">Example budget · not an offer</span>
        <span className="text-sm font-bold text-accent">{formatSats(slot.currentBidSats)} sats</span>
      </div>

      <div className="mt-1 flex flex-col gap-2 sm:flex-row">
        <Button className="flex flex-1 items-center justify-center gap-2" onClick={() => onBid(slot)}>
          <Zap className="h-4 w-4" /> Review example budget
        </Button>
        {canRequestVendorPlacement(slot) ? (
          <Button variant="secondary" className="flex-1" onClick={() => onRequestPlacement(slot)}>
            {slot.durable ? 'Request placement' : 'Preview request'}
          </Button>
        ) : (
          <span className="inline-flex flex-1 items-center justify-center rounded-lg border border-border px-3 py-2 text-center text-[10px] font-bold text-muted">
            Provider access later
          </span>
        )}
      </div>
    </motion.div>
  );
}

function SlotCard({ slot, onBid, onRequestPlacement }: { slot: MarketplaceSlot; onBid: (slot: MarketplaceSlot) => void; onRequestPlacement: (slot: MarketplaceSlot) => void }) {
  const [watchlist, setWatchlist] = useLocalStorage<string[]>("tadbuy_marketplace_watchlist", []);
  const saved = watchlist.includes(slot.id);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group relative overflow-hidden rounded-xl border border-white/10 bg-surface/60 shadow-xl transition-all duration-300 hover:border-accent/40 hover:shadow-[0_0_28px_rgba(255,159,28,0.1)]"
    >
      <div className="pointer-events-none absolute -mr-14 -mt-14 h-40 w-40 rounded-full bg-accent/5 blur-3xl right-0 top-0" />
      <button
        type="button"
        onClick={event => {
          event.stopPropagation();
          setWatchlist(saved ? watchlist.filter(id => id !== slot.id) : [...watchlist, slot.id]);
        }}
        className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-zinc-900/80 transition-all hover:border-accent/50 hover:bg-accent/10"
        aria-label={saved ? 'Remove from watchlist' : 'Save to watchlist'}
        title={saved ? 'Saved' : 'Save to watchlist'}
      >
        <Heart className={`h-4 w-4 ${saved ? 'fill-accent text-accent' : 'text-muted'}`} />
      </button>

      <div className="relative z-10 p-5">
        <div className="mb-3 flex items-center justify-between gap-2">
          <span className="min-w-0 truncate text-xs font-bold text-muted">{slot.publisher} · sample archetype</span>
          <span className="shrink-0 rounded-full border border-blue/20 bg-blue/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue">Sample · not live</span>
        </div>

        <h3 className="mb-2.5 text-base font-extrabold leading-snug transition-colors group-hover:text-accent">{slot.name}</h3>
        <div className="mb-3 flex flex-wrap gap-1.5">
          <span className="rounded border border-accent/20 bg-accent/10 px-2 py-0.5 text-[10px] font-bold text-accent">{slot.format}</span>
          <span className="rounded border border-border bg-surface px-2 py-0.5 text-[10px] font-bold text-muted">{slot.category}</span>
        </div>

        <div className="mb-3 flex items-center gap-3 text-xs text-muted">
          <span className="flex items-center gap-1"><Globe className="h-3 w-3" /> {slot.placement}</span>
        </div>
        <div className="mb-4 flex flex-wrap gap-1">
          {slot.geo.map(geo => (
            <span key={geo} className="rounded border border-white/5 bg-black/30 px-1.5 py-0.5 text-[11px] text-text/70">{geoFlag(geo)} {geo}</span>
          ))}
        </div>

        <div className="mb-4 rounded-xl border border-border bg-black/20 px-3 py-2.5 text-[11px] text-muted">
          <span className="font-bold text-text">Illustrative audience · not verified:</span> {slot.audience}
        </div>
        <div className="mb-4 grid grid-cols-2 gap-2">
          <div className="rounded-lg border border-border bg-black/20 p-3">
            <div className="mb-1 text-[9px] font-bold uppercase tracking-widest text-muted">Example budget · not a bid</div>
            <div className="text-lg font-extrabold leading-none text-accent">{formatSats(slot.currentBidSats)} <span className="text-[10px] font-bold text-muted">sats</span></div>
          </div>
          <div className="rounded-lg border border-border bg-black/20 p-3">
            <div className="mb-1 text-[9px] font-bold uppercase tracking-widest text-muted">Example floor · not an offer</div>
            <div className="text-sm font-bold text-text/70">{formatSats(slot.minBidSats)} sample sats</div>
          </div>
        </div>
        <div className="mb-4 flex flex-wrap gap-1">
          {slot.tags.map(tag => <span key={tag} className="rounded bg-black/20 px-1.5 py-0.5 text-[10px] text-muted/70">#{tag}</span>)}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button variant="secondary" className="flex flex-1 items-center justify-center gap-2" onClick={() => onBid(slot)}>
            <Zap className="h-4 w-4" /> Review example budget
          </Button>
          {canRequestVendorPlacement(slot) ? (
            <Button variant="secondary" className="flex-1" onClick={() => onRequestPlacement(slot)}>
              {slot.durable ? 'Request placement' : 'Preview request'}
            </Button>
          ) : (
            <span className="inline-flex flex-1 items-center justify-center rounded-lg border border-border px-3 py-2 text-center text-[10px] font-bold text-muted">Provider access later</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function Marketplace() {
  usePageMeta('Marketplace', 'Explore illustrative publisher placement concepts and example Bitcoin budgets.');

  const inventory = MARKETPLACE_SLOTS;
  const [searchTerm, setSearchTerm] = useState("");
  const [activePlatform, setActivePlatform] = useState<PlatformTab>("All");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [sortBy, setSortBy] = useState<SortOption>("price_asc");
  const [bidSlot, setBidSlot] = useState<MarketplaceSlot | null>(null);
  const [maxBid, setMaxBid] = useState(50_000);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [watchlist] = useLocalStorage<string[]>("tadbuy_marketplace_watchlist", []);
  const [showWatchlistOnly, setShowWatchlistOnly] = useState(false);
  const [requestSlot, setRequestSlot] = useState<MarketplaceSlot | null>(null);
  const { requestPlacement } = usePlacementRequests();
  const { addToast } = useToast();

  const handlePlacementRequest = async (input: { advertiserLabel: string; budgetSats: number; message: string }) => {
    if (!requestSlot) throw new Error('No placement selected');
    const request = await requestPlacement({ slot: requestSlot, ...input });
    addToast(
      request.durable
        ? 'Placement request sent to the listed vendor. No payment was made.'
        : 'Sample request saved locally — no vendor was notified and no payment was made.',
      request.durable ? 'success' : 'info',
      3200,
    );
    return request;
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  // This build has no live marketplace feed; cards below are sample archetypes.
  const featuredSlots = useMemo(
    () => inventory.filter(slot => FEATURED_SLOT_IDS.includes(slot.id as typeof FEATURED_SLOT_IDS[number])),
    [inventory],
  );
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: inventory.length };
    inventory.forEach(slot => { counts[slot.category] = (counts[slot.category] ?? 0) + 1; });
    return counts;
  }, [inventory]);
  const platformCounts = useMemo(() => {
    const counts: Record<string, number> = { All: inventory.length };
    inventory.forEach(slot => {
      if (slot.platformType) counts[slot.platformType] = (counts[slot.platformType] ?? 0) + 1;
    });
    return counts;
  }, [inventory]);

  const filtered = useMemo(() => {
    let items = inventory.filter(item => {
      const query = searchTerm.toLowerCase();
      const matchesSearch = !query
        || item.name.toLowerCase().includes(query)
        || item.publisher.toLowerCase().includes(query)
        || item.tags.some(tag => tag.includes(query));
      const matchesPlatform = activePlatform === "All" || item.platformType === activePlatform;
      const matchesCategory = activeCategory === "All" || item.category === activeCategory;
      const matchesBudget = item.currentBidSats <= maxBid;
      const matchesWatchlist = !showWatchlistOnly || watchlist.includes(item.id);
      return matchesSearch && matchesPlatform && matchesCategory && matchesBudget && matchesWatchlist;
    });

    items = [...items].sort((a, b) => {
      if (sortBy === "price_asc") return a.currentBidSats - b.currentBidSats;
      if (sortBy === "price_desc") return b.currentBidSats - a.currentBidSats;
      if (sortBy === "newest") return inventory.indexOf(a) - inventory.indexOf(b);
      return 0;
    });
    return items;
  }, [searchTerm, activePlatform, activeCategory, sortBy, maxBid, showWatchlistOnly, watchlist]);

  const clearFilters = () => {
    setSearchTerm("");
    setActivePlatform("All");
    setActiveCategory("All");
    setSortBy("price_asc");
    setMaxBid(50_000);
  };

  return (
    <>
      <PageShell
        title="Ad Marketplace"
        description="Explore sample placement concepts and learn how vendor-assisted campaigns could work."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Marketplace' }]}
        showDemoBadge
        maxWidth="max-w-[1440px]"
      >
        <div className="mb-2 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="flex w-full gap-2 md:ml-auto md:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <Input placeholder="Search sample placements, publishers, tags…" className="w-full pl-10 md:w-72" value={searchTerm} onChange={event => setSearchTerm(event.target.value)} />
            </div>
            {searchTerm && (
              <button onClick={() => setSearchTerm("")} className="flex items-center gap-1 rounded-lg border border-border px-3 text-xs text-muted transition-colors hover:text-text">
                <X className="h-3.5 w-3.5" /> Clear
              </button>
            )}
            <button
              onClick={() => setSidebarOpen(open => !open)}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs transition-all lg:hidden ${sidebarOpen ? "border-accent bg-accent text-black" : "border-border text-muted hover:text-text"}`}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" /> Filters
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-blue/30 bg-blue/5 p-4 sm:p-5" data-testid="marketplace-sample-notice">
          <div className="flex items-start gap-3">
            <div className="rounded-xl border border-blue/20 bg-blue/10 p-2 text-blue"><PackageSearch className="h-4 w-4" /></div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-text">Marketplace preview · sample listings only</p>
              <p className="mt-1 text-xs leading-relaxed text-muted">All listings, publisher archetypes, audience figures, and budgets are illustrative—not verified inventory, reach, vendor relationships, bids, or an auction. Preview requests are saved only in this browser; no vendor is contacted, inventory reserved, or sats moved.</p>
            </div>
          </div>
        </div>

        <section aria-label="Featured example placements">
          <div className="mb-3 flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted">Featured examples · no live inventory</span>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {featuredSlots.map(slot => <FeaturedCard key={slot.id} slot={slot} onBid={setBidSlot} onRequestPlacement={setRequestSlot} />)}
          </div>
        </section>

        <div className="flex flex-wrap gap-2 border-b border-border pb-4">
          {PLATFORM_TABS.map(tab => (
            <Chip key={tab} active={activePlatform === tab} onClick={() => setActivePlatform(tab)}>
              {tab}{platformCounts[tab] !== undefined && <span className="ml-0.5 text-[10px] opacity-70">{platformCounts[tab]}</span>}
            </Chip>
          ))}
        </div>

        <div className="flex gap-6">
          <aside className={`${sidebarOpen ? "block" : "hidden"} w-full shrink-0 space-y-5 lg:block lg:w-56`}>
            <div className="glass-panel space-y-2 rounded-xl p-4">
              <div className="mb-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted"><ArrowUpDown className="h-3 w-3" /> Sort by example budget</div>
              <div className="space-y-1">
                {SORT_OPTIONS.map(option => (
                  <button key={option.value} onClick={() => setSortBy(option.value)} className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-[12px] transition-all ${sortBy === option.value ? "bg-accent/10 font-bold text-accent" : "text-muted hover:bg-white/5 hover:text-text"}`}>
                    {option.label}
                    {sortBy === option.value && (option.value === "price_asc" ? <ArrowUp className="h-3 w-3" /> : option.value === "price_desc" ? <ArrowDown className="h-3 w-3" /> : <span className="h-1.5 w-1.5 rounded-full bg-accent" />)}
                  </button>
                ))}
              </div>
            </div>

            <div className="glass-panel space-y-3 rounded-xl p-4">
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted"><Filter className="h-3 w-3" /> Max example budget</div>
              <input type="range" min={1000} max={50000} step={500} value={maxBid} onChange={event => setMaxBid(Number(event.target.value))} className="h-1.5 w-full cursor-pointer accent-[#ff9f1c]" />
              <div className="flex justify-between font-mono text-[10px] text-muted"><span>1k</span><span className="font-bold text-accent">{formatSats(maxBid)} sats</span><span>50k</span></div>
            </div>

            {watchlist.length > 0 && (
              <div className="glass-panel rounded-xl p-4">
                <button onClick={() => setShowWatchlistOnly(value => !value)} className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-[12px] transition-all ${showWatchlistOnly ? "bg-accent/10 font-bold text-accent" : "text-muted hover:bg-white/5 hover:text-text"}`}>
                  <Bookmark className={`h-3.5 w-3.5 ${showWatchlistOnly ? "fill-current" : ""}`} /> My Watchlist ({watchlist.length})
                </button>
              </div>
            )}

            <div className="glass-panel space-y-1 rounded-xl p-4">
              <div className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted">Categories</div>
              {CATEGORIES.map(category => (
                <button key={category} onClick={() => setActiveCategory(category)} className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-[12px] transition-all ${activeCategory === category ? "bg-accent/10 font-bold text-accent" : "text-muted hover:bg-white/5 hover:text-text"}`}>
                  <span className="truncate">{category}</span>
                  <span className={`ml-1 shrink-0 font-mono text-[10px] ${activeCategory === category ? "text-accent/70" : "text-muted/50"}`}>{categoryCounts[category] ?? 0}</span>
                </button>
              ))}
            </div>
            <button onClick={clearFilters} className="w-full rounded-xl border border-border py-2 text-[11px] text-muted transition-colors hover:border-accent/40 hover:text-accent">Clear all filters</button>
          </aside>

          <div className="min-w-0 flex-1 space-y-4">
            <div className="hidden items-center justify-between lg:flex">
              <p className="text-xs text-muted">{filtered.length === 0 ? "No examples match your filters." : `${filtered.length} example${filtered.length !== 1 ? "s" : ""}`}</p>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted">Sort:</span>
                <div className="relative">
                  <Select value={sortBy} onChange={event => setSortBy(event.target.value as SortOption)} className="min-w-[160px] py-1.5 pr-8 text-xs">
                    {SORT_OPTIONS.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
                  </Select>
                  <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
                </div>
              </div>
            </div>

            <AnimatePresence mode="popLayout">
              {loading ? (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }).map((_, index) => <div key={index}><SkeletonCard /></div>)}</div>
              ) : filtered.length === 0 ? (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <EmptyState icon={PackageSearch} title="No sample listings match your filters" description="Try adjusting your platform, category, or example budget filters." action={clearFilters} actionLabel="Reset all filters" />
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {filtered.map(slot => <SlotCard key={slot.id} slot={slot} onBid={setBidSlot} onRequestPlacement={setRequestSlot} />)}
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8">
          <TrustProofMoments />
        </div>
      </PageShell>

      {bidSlot && <BidModal slot={bidSlot} onClose={() => setBidSlot(null)} />}
      {requestSlot && <PlacementRequestModal slot={requestSlot} onClose={() => setRequestSlot(null)} onCreate={handlePlacementRequest} />}
    </>
  );
}
