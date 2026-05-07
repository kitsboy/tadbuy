import { useState } from "react";
import { motion } from "motion/react";
import { Card, CardTitle, Button, Input } from "@/components/ui";
import { Search, Filter, Zap, Users, Globe, ArrowUpRight, X } from "lucide-react";
import { Link } from "react-router-dom";
import { usePageTitle } from "@/hooks/usePageTitle";

interface InventoryItem {
  id: number;
  name: string;
  site: string;
  type: string;
  reach: string;
  price: number;
  category: string;
}

const INVENTORY: InventoryItem[] = [
  { id: 1, name: "Bitcoin Magazine Header",    site: "bitcoinmagazine.com",          type: "Banner", reach: "500k/mo", price: 0.005, category: "News"    },
  { id: 2, name: "Nostr Client Sidebar",       site: "damus.io",                     type: "Native", reach: "100k/mo", price: 0.001, category: "Social"  },
  { id: 3, name: "Wallet Transaction Footer",  site: "phoenix.acinq.co",             type: "Text",   reach: "250k/mo", price: 0.002, category: "Finance" },
  { id: 4, name: "Podcast Mid-roll",           site: "stephanlivera.com",            type: "Audio",  reach: "50k/ep",  price: 0.008, category: "Podcast" },
  { id: 5, name: "Dev Documentation Sidebar",  site: "docs.lightning.engineering",   type: "Banner", reach: "30k/mo",  price: 0.003, category: "Tech"    },
  { id: 6, name: "Swan Bitcoin Newsletter",    site: "swanbitcoin.com",              type: "Email",  reach: "80k/mo",  price: 0.004, category: "Finance" },
  { id: 7, name: "Stacker News Top Slot",      site: "stacker.news",                 type: "Native", reach: "60k/mo",  price: 0.002, category: "Social"  },
];

const CATEGORIES = ["All", "News", "Social", "Finance", "Podcast", "Tech"];

export default function Marketplace() {
  usePageTitle('Marketplace');

  const [searchTerm, setSearchTerm]       = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = INVENTORY.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.site.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Ad Marketplace</h1>
          <p className="text-sm text-muted mt-1">Browse and bid on premium Bitcoin-native ad inventory.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <Input
              placeholder="Search inventory..."
              className="pl-10 w-full md:w-64"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="flex items-center gap-1 text-xs text-muted hover:text-text transition-colors border border-border rounded-lg px-3"
            >
              <X className="w-3.5 h-3.5" /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex flex-wrap gap-2">
        <Filter className="w-4 h-4 text-muted self-center" />
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all ${
              activeCategory === cat
                ? "bg-accent text-black border-accent shadow-[0_0_12px_rgba(255,159,28,0.3)]"
                : "bg-surface text-muted border-border hover:border-muted hover:text-text"
            }`}
          >
            {cat}
          </button>
        ))}
        {activeCategory !== "All" && (
          <button
            onClick={() => setActiveCategory("All")}
            className="px-2 text-[10px] text-muted hover:text-text transition-colors"
          >
            Reset
          </button>
        )}
      </div>

      {/* Results count */}
      <p className="text-xs text-muted">
        {filtered.length === 0
          ? "No inventory matches your filters."
          : `${filtered.length} slot${filtered.length !== 1 ? "s" : ""} available`}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(item => (
          <Card key={item.id} className="glass-panel group hover:border-accent/50 transition-all hover:shadow-[0_0_30px_rgba(255,159,28,0.1)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="bg-accent/10 text-accent text-[10px] font-bold uppercase px-2 py-1 rounded border border-accent/20">
                {item.category}
              </div>
              <div className="text-xs font-mono font-bold text-green bg-green/10 px-2 py-1 rounded border border-green/20">
                {item.price} ₿
              </div>
            </div>
            <h3 className="text-lg font-bold mb-1 group-hover:text-accent transition-colors relative z-10">{item.name}</h3>
            <div className="text-xs text-muted mb-4 flex items-center gap-1 relative z-10">
              <Globe className="w-3 h-3" /> {item.site}
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6 relative z-10">
              <div className="bg-black/20 p-3 rounded-xl border border-white/5">
                <div className="text-[9px] text-muted uppercase font-bold mb-1">Reach</div>
                <div className="text-sm font-bold flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-blue" /> {item.reach}</div>
              </div>
              <div className="bg-black/20 p-3 rounded-xl border border-white/5">
                <div className="text-[9px] text-muted uppercase font-bold mb-1">Type</div>
                <div className="text-sm font-bold flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-lightning" /> {item.type}</div>
              </div>
            </div>
            <Link to={`/?slot=${item.id}`} className="w-full">
              <Button className="w-full relative z-10 group-hover:shadow-[0_0_20px_rgba(255,159,28,0.3)] transition-all flex items-center justify-center gap-2">
                <Zap className="w-4 h-4" /> Bid Now <ArrowUpRight className="w-4 h-4" />
              </Button>
            </Link>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}
