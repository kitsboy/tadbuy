import type { Express } from 'express';

/** Batch 11 — Publisher & marketplace polish (features 251-275) */

const PUBLISHER_SLOTS = [
  { id: 'slot_1', name: 'Homepage Hero', placement: 'Above the fold', format: '728×90 Leaderboard', status: 'active', fillRate: 87, revenueSats: 42000 },
  { id: 'slot_2', name: 'Sidebar Right', placement: 'Article sidebar', format: '300×250 Rectangle', status: 'active', fillRate: 64, revenueSats: 18500 },
  { id: 'slot_3', name: 'Footer Banner', placement: 'Page footer', format: '468×60 Banner', status: 'inactive', fillRate: 0, revenueSats: 0 },
];

const MARKETPLACE_INVENTORY = [
  { id: 'slot_btc_hero', name: 'Bitcoin.org Homepage Hero', publisher: 'Bitcoin.org', category: 'Bitcoin & Crypto', platformType: 'Blogs', currentBidSats: 18500, ctr: 2.1, status: 'available' },
  { id: 'slot_nostr_sidebar', name: 'Nostr.com Sidebar', publisher: 'Nostr.com', category: 'Social / Nostr', platformType: 'Nostr', currentBidSats: 7200, ctr: 1.8, status: 'available' },
  { id: 'slot_stacker_banner', name: 'Stacker News Top Banner', publisher: 'Stacker News', category: 'Bitcoin Community', platformType: 'Blogs', currentBidSats: 22000, ctr: 3.2, status: 'hot' },
  { id: 'slot_yt_preroll', name: 'BTC Sessions Pre-Roll', publisher: 'BTC Sessions', category: 'Bitcoin & Crypto', platformType: 'YouTube', currentBidSats: 16800, ctr: 4.1, status: 'hot' },
];

const GEO_COUNTRIES = [
  { country: 'United States', code: 'US', flag: '🇺🇸', impressions: 480000, clicks: 5760, ctr: 1.2 },
  { country: 'Germany', code: 'DE', flag: '🇩🇪', impressions: 125000, clicks: 1875, ctr: 1.5 },
  { country: 'United Kingdom', code: 'GB', flag: '🇬🇧', impressions: 98000, clicks: 1470, ctr: 1.5 },
  { country: 'Japan', code: 'JP', flag: '🇯🇵', impressions: 87000, clicks: 1044, ctr: 1.2 },
  { country: 'El Salvador', code: 'SV', flag: '🇸🇻', impressions: 35000, clicks: 420, ctr: 1.2 },
];

export function registerBatch11Routes(app: Express) {
  app.get('/api/publisher/stats', (_req, res) => {
    const totalSats = PUBLISHER_SLOTS.reduce((s, sl) => s + sl.revenueSats, 0);
    const activeSlots = PUBLISHER_SLOTS.filter(s => s.status === 'active');
    const avgFill = activeSlots.length
      ? Math.round(activeSlots.reduce((a, s) => a + s.fillRate, 0) / activeSlots.length)
      : 0;
    res.json({
      totalRevenueSats: totalSats,
      thisMonthSats: 124_200,
      avgFillRate: avgFill,
      activeSlots: activeSlots.length,
      totalSlots: PUBLISHER_SLOTS.length,
    });
  });

  app.get('/api/publisher/slots', (_req, res) => {
    res.json({ slots: PUBLISHER_SLOTS });
  });

  app.get('/api/publisher/earnings', (_req, res) => {
    res.json({
      trend: [
        { day: 'Mon', sats: 12400 },
        { day: 'Tue', sats: 9800 },
        { day: 'Wed', sats: 18200 },
        { day: 'Thu', sats: 14100 },
        { day: 'Fri', sats: 22300 },
        { day: 'Sat', sats: 19800 },
        { day: 'Sun', sats: 27600 },
      ],
      payouts: [
        { id: 'PAY-001', date: '2026-04-22', amount: 0.00042, status: 'Confirmed', slots: 3 },
        { id: 'PAY-002', date: '2026-04-18', amount: 0.00081, status: 'Confirmed', slots: 4 },
      ],
    });
  });

  app.get('/api/marketplace/inventory', (_req, res) => {
    res.json({
      total: MARKETPLACE_INVENTORY.length,
      slots: MARKETPLACE_INVENTORY,
      categories: ['Bitcoin & Crypto', 'Social / Nostr', 'Bitcoin Community', 'Lightning / Finance'],
      platforms: ['All', 'Nostr', 'YouTube', 'Podcasts', 'Newsletters', 'Blogs'],
    });
  });

  app.get('/api/marketplace/featured', (_req, res) => {
    const featuredIds = ['slot_yt_preroll', 'slot_stacker_banner', 'slot_btc_hero'];
    res.json({
      slots: MARKETPLACE_INVENTORY.filter(s => featuredIds.includes(s.id)),
    });
  });

  app.get('/api/geo/stats', (_req, res) => {
    const totalImpressions = GEO_COUNTRIES.reduce((s, c) => s + c.impressions, 0);
    const totalClicks = GEO_COUNTRIES.reduce((s, c) => s + c.clicks, 0);
    res.json({
      countriesReached: GEO_COUNTRIES.length,
      totalImpressions,
      globalCtr: totalImpressions > 0 ? parseFloat(((totalClicks / totalImpressions) * 100).toFixed(2)) : 0,
      topMarket: GEO_COUNTRIES[0],
    });
  });

  app.get('/api/geo/countries', (_req, res) => {
    res.json({ countries: GEO_COUNTRIES });
  });
}