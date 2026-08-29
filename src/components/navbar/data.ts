import type { LucideIcon } from 'lucide-react';
import {
  Megaphone,
  Globe,
  Layers,
  Wallet,
  BarChart2,
  LayoutDashboard,
  MapPin,
  TrendingUp,
  Store,
  Network,
  BarChart,
  Activity,
} from 'lucide-react';

export type NavItem = {
  name: string;
  path: string;
  icon: LucideIcon;
  description: string;
};

/** Always-visible desktop links — keep this short so labels never squash. */
export const PRIMARY_NAV: NavItem[] = [
  { name: 'Buy Ads', path: '/', icon: Megaphone, description: 'Launch Bitcoin-native ad campaigns' },
  { name: 'Marketplace', path: '/marketplace', icon: Globe, description: 'Browse advertising inventory' },
  { name: 'Campaigns', path: '/campaigns', icon: Layers, description: 'View and optimize live campaigns' },
  { name: 'Wallet', path: '/wallet', icon: Wallet, description: 'Lightning, on-chain, and ecash' },
];

export const MORE_NAV: NavItem[] = [
  { name: 'Metrics', path: '/metrics', icon: BarChart2, description: 'Performance analytics and insights' },
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, description: 'Real-time ad performance' },
  { name: 'Geo Reach', path: '/geo', icon: MapPin, description: 'Geographic targeting tools' },
  { name: 'Platforms', path: '/platforms', icon: TrendingUp, description: 'Network rates and payout rules' },
  { name: 'Publisher', path: '/publisher', icon: Store, description: 'Publisher portal and slots' },
  { name: 'Hubhash', path: '/hubhash', icon: Network, description: 'Social and escrow campaigns' },
  { name: 'Analytics', path: '/analytics', icon: BarChart, description: 'Campaign-level reporting' },
  { name: 'Settlements', path: '/settlements', icon: Activity, description: 'Payout and spend history' },
];

export const ALL_NAV: NavItem[] = [...PRIMARY_NAV, ...MORE_NAV];
