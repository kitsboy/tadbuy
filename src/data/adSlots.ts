export interface AdSlot {
  id: number;
  name: string;
  site: string;
  type: 'banner' | 'sidebar' | 'native';
  status: 'available' | 'bidding' | 'occupied';
  currentBid: number;
  dailyTraffic: number;
}

export const adSlots: AdSlot[] = [
  { id: 1, name: 'Header Banner', site: 'bitcoin-news.io', type: 'banner', status: 'available', currentBid: 0.0005, dailyTraffic: 15000 },
  { id: 2, name: 'Sidebar Square', site: 'nostr-relay.com', type: 'sidebar', status: 'bidding', currentBid: 0.0008, dailyTraffic: 8000 },
  { id: 3, name: 'Native Feed', site: 'lightning-wallet.app', type: 'native', status: 'occupied', currentBid: 0.0012, dailyTraffic: 25000 },
  { id: 4, name: 'Footer Banner', site: 'bitcoin-news.io', type: 'banner', status: 'available', currentBid: 0.0003, dailyTraffic: 12000 },
];
