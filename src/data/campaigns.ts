import React from 'react';
import { Twitter, Facebook, Instagram, Zap, Youtube, MessageSquare, Linkedin, Music } from "lucide-react";

export interface Campaign {
  id: number;
  name: string;
  dates: string;
  platforms: string[]; // Store as IDs
  status: 'Live' | 'Paused' | 'Draft';
  spendBtc: number;
  spendUsd: number;
  impressions: number;
  clicks: number;
  ctr: number;
  cpc: string;
  pacing: number;
  payment: string;
  headline?: string;
  description?: string;
  url?: string;
  bgHue?: number;
  bgLightness?: number;
  textColor?: string;
}

export const campaigns: Campaign[] = [
  { 
    id: 1, 
    name: 'GiveaBit_BTC_Q2_A', 
    dates: 'Apr 1 – Apr 30', 
    platforms: ['twitter', 'facebook'], 
    status: 'Live', 
    spendBtc: 0.0120, 
    spendUsd: 115.70, 
    impressions: 46284, 
    clicks: 4812, 
    ctr: 10.4, 
    cpc: '0.0000025 ₿', 
    pacing: 40, 
    payment: '⚡ Lightning',
    headline: "Stack Sats Smarter — giveabit.io",
    description: "Bitcoin tools for the people. No banks. No middlemen.",
    url: "https://giveabit.io",
    bgHue: 240,
    bgLightness: 96,
    textColor: "#18181b"
  },
  { 
    id: 2, 
    name: 'Nostr_Bitcoin_Push', 
    dates: 'Mar 20 – Apr 10', 
    platforms: ['nostr', 'reddit'], 
    status: 'Live', 
    spendBtc: 0.0085, 
    spendUsd: 81.92, 
    impressions: 102500, 
    clicks: 8200, 
    ctr: 8.0, 
    cpc: '0.000001 ₿', 
    pacing: 85, 
    payment: '🔮 BOLT 12',
    headline: "Zap the Future",
    description: "Decentralized advertising on Nostr. Pure signal, no noise.",
    url: "https://nostr.com",
    bgHue: 45,
    bgLightness: 90,
    textColor: "#18181b"
  },
  { 
    id: 3, 
    name: 'YT_Awareness_Test', 
    dates: 'Apr 5 – Apr 20', 
    platforms: ['youtube'], 
    status: 'Paused', 
    spendBtc: 0.0218, 
    spendUsd: 210.12, 
    impressions: 987440, 
    clicks: 1808, 
    ctr: 0.18, 
    cpc: '0.000012 ₿', 
    pacing: 62, 
    payment: '₿ On-chain',
    headline: "Bitcoin is Hope",
    description: "Watch the latest documentary on the orange pill.",
    url: "https://youtube.com",
    bgHue: 0,
    bgLightness: 95,
    textColor: "#18181b"
  },
  { 
    id: 4, 
    name: 'LinkedIn_B2B_Draft', 
    dates: 'Not started', 
    platforms: ['linkedin'], 
    status: 'Draft', 
    spendBtc: 0.0000, 
    spendUsd: 0.00, 
    impressions: 0, 
    clicks: 0, 
    ctr: 0, 
    cpc: '—', 
    pacing: 0, 
    payment: '⚡ Lightning',
    headline: "B2B Bitcoin Solutions",
    description: "Integrate Lightning into your enterprise stack today.",
    url: "https://enterprise.btc",
    bgHue: 210,
    bgLightness: 92,
    textColor: "#18181b"
  },
];

export const getPlatformIcon = (id: string) => {
  switch (id) {
    case 'twitter': return Twitter;
    case 'facebook': return Facebook;
    case 'instagram': return Instagram;
    case 'nostr': return Zap;
    case 'youtube': return Youtube;
    case 'reddit': return MessageSquare;
    case 'linkedin': return Linkedin;
    case 'tiktok': return Music;
    default: return Zap;
  }
};
