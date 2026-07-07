import type { Express } from 'express';

/** Batch 19 — Marketplace live bids & auctions (features 351-375) */

interface LiveBid {
  id: string;
  slotId: string;
  slotName: string;
  bidSats: number;
  budgetSats: number | null;
  userId: string | null;
  placedAt: string;
}

const liveBids: LiveBid[] = [
  { id: 'bid_001', slotId: 'slot_stacker_banner', slotName: 'Stacker News Top Banner', bidSats: 22000, budgetSats: 80000, userId: null, placedAt: new Date(Date.now() - 12 * 60_000).toISOString() },
  { id: 'bid_002', slotId: 'slot_yt_preroll', slotName: 'BTC Sessions Pre-Roll', bidSats: 16800, budgetSats: 50000, userId: null, placedAt: new Date(Date.now() - 45 * 60_000).toISOString() },
  { id: 'bid_003', slotId: 'slot_btc_podcast', slotName: 'Bitcoin Audible Mid-Roll', bidSats: 14500, budgetSats: null, userId: null, placedAt: new Date(Date.now() - 90 * 60_000).toISOString() },
];

const LIVE_SLOTS = [
  { id: 'slot_btc_hero', name: 'Bitcoin.org Homepage Hero', publisher: 'Bitcoin.org', publisherVerified: true, placement: 'Above the fold', format: '728×90 Leaderboard', category: 'Bitcoin & Crypto', audience: '2.4M monthly visitors', geo: ['US', 'EU', 'APAC'], minBidSats: 5000, currentBidSats: 18500, impressionsPerDay: 45000, ctr: 2.1, status: 'available', tags: ['bitcoin', 'finance', 'tech'], platformType: 'Blogs' },
  { id: 'slot_nostr_sidebar', name: 'Nostr.com Sidebar', publisher: 'Nostr.com', publisherVerified: true, placement: 'Article sidebar', format: '300×250 Rectangle', category: 'Social / Nostr', audience: '890K monthly visitors', geo: ['Global'], minBidSats: 2000, currentBidSats: 7200, impressionsPerDay: 18000, ctr: 1.8, status: 'available', tags: ['nostr', 'social', 'decentralized'], platformType: 'Nostr' },
  { id: 'slot_stacker_banner', name: 'Stacker News Top Banner', publisher: 'Stacker News', publisherVerified: true, placement: 'Top of feed', format: '970×250 Billboard', category: 'Bitcoin Community', audience: '320K monthly visitors', geo: ['US', 'EU'], minBidSats: 8000, currentBidSats: 22000, impressionsPerDay: 12000, ctr: 3.2, status: 'hot', tags: ['bitcoin', 'community', 'news'], platformType: 'Blogs', auctionEndsAt: new Date(Date.now() + 2 * 3_600_000).toISOString() },
  { id: 'slot_ln_markets', name: 'LN Markets Sidebar', publisher: 'LN Markets', publisherVerified: false, placement: 'Dashboard sidebar', format: '300×600 Half Page', category: 'Lightning / Finance', audience: '145K monthly visitors', geo: ['Global'], minBidSats: 3500, currentBidSats: 9800, impressionsPerDay: 8500, ctr: 2.7, status: 'available', tags: ['lightning', 'trading', 'finance'], platformType: 'Newsletters' },
  { id: 'slot_btcpay_footer', name: 'BTCPay Server Footer', publisher: 'BTCPay Server', publisherVerified: true, placement: 'Documentation footer', format: '728×90 Leaderboard', category: 'Bitcoin Tools', audience: '280K monthly visitors', geo: ['Global'], minBidSats: 1500, currentBidSats: 4100, impressionsPerDay: 6200, ctr: 1.4, status: 'available', tags: ['payments', 'open-source', 'tools'], platformType: 'Blogs' },
  { id: 'slot_primal_feed', name: 'Primal In-Feed Ad', publisher: 'Primal', publisherVerified: false, placement: 'Social feed', format: 'Native Feed Post', category: 'Social / Nostr', audience: '210K monthly visitors', geo: ['Global'], minBidSats: 4000, currentBidSats: 11200, impressionsPerDay: 15000, ctr: 2.9, status: 'available', tags: ['nostr', 'native', 'social'], platformType: 'Nostr' },
  { id: 'slot_btc_podcast', name: 'Bitcoin Audible Mid-Roll', publisher: 'Bitcoin Audible', publisherVerified: true, placement: 'Mid-roll (ep. 600+)', format: '60s Audio Ad', category: 'Bitcoin Community', audience: '95K listeners/episode', geo: ['US', 'EU'], minBidSats: 6000, currentBidSats: 14500, impressionsPerDay: 9500, ctr: 3.8, status: 'hot', tags: ['podcast', 'bitcoin', 'audio'], platformType: 'Podcasts', auctionEndsAt: new Date(Date.now() + 1.5 * 3_600_000).toISOString() },
  { id: 'slot_yt_preroll', name: 'BTC Sessions Pre-Roll', publisher: 'BTC Sessions', publisherVerified: true, placement: 'YouTube pre-roll', format: '15s Video Ad', category: 'Bitcoin & Crypto', audience: '180K subscribers', geo: ['US', 'CA', 'EU'], minBidSats: 7500, currentBidSats: 16800, impressionsPerDay: 22000, ctr: 4.1, status: 'hot', tags: ['youtube', 'bitcoin', 'education'], platformType: 'YouTube', auctionEndsAt: new Date(Date.now() + 3 * 3_600_000).toISOString() },
  { id: 'slot_newsletter_swan', name: 'Swan Signal Newsletter Sponsor', publisher: 'Swan Bitcoin', publisherVerified: true, placement: 'Newsletter top sponsor', format: 'Sponsored Section', category: 'Bitcoin & Crypto', audience: '42K subscribers', geo: ['US'], minBidSats: 3000, currentBidSats: 8900, impressionsPerDay: 7000, ctr: 5.2, status: 'available', tags: ['newsletter', 'bitcoin', 'finance'], platformType: 'Newsletters' },
];

export function registerBatch19Routes(app: Express) {
  app.get('/api/marketplace/bids', (_req, res) => {
    const sorted = [...liveBids].sort(
      (a, b) => new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime()
    );
    res.json({
      total: sorted.length,
      bids: sorted,
      hotSlots: LIVE_SLOTS.filter(s => s.status === 'hot').map(s => s.id),
    });
  });

  app.get('/api/marketplace/slots/live', (_req, res) => {
    const slots = LIVE_SLOTS.map(slot => {
      const topBid = liveBids
        .filter(b => b.slotId === slot.id)
        .sort((a, b) => b.bidSats - a.bidSats)[0];
      return topBid
        ? { ...slot, currentBidSats: Math.max(slot.currentBidSats, topBid.bidSats) }
        : slot;
    });
    res.json({
      updatedAt: new Date().toISOString(),
      total: slots.length,
      slots,
    });
  });
}