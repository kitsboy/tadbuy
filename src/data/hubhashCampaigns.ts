export type HubhashStatus = 'funding' | 'unleashed' | 'refunded';

export interface HubhashCampaign {
  id: string;
  title: string;
  creator: string;
  description: string;
  targetBtc: number;
  raisedBtc: number;
  targetSats: number;
  raisedSats: number;
  hashtags: string[];
  status: HubhashStatus;
  daysLeft: number;
  escrowDemo: boolean;
  refundPolicy: string;
}

export const HUBHASH_CAMPAIGNS: HubhashCampaign[] = [
  {
    id: 'hh_austin_music',
    title: 'Austin Lightning Concert Promo',
    creator: '@localmusic_atx',
    description: 'Raising funds to blast Nostr and Twitter with ads for the upcoming Lightning-powered local music festival in Austin.',
    targetBtc: 0.05,
    raisedBtc: 0.032,
    targetSats: 5_000_000,
    raisedSats: 3_200_000,
    hashtags: ['#AustinMusic', '#LightningNetwork', '#Plebs'],
    status: 'funding',
    daysLeft: 4,
    escrowDemo: true,
    refundPolicy: 'If goal not met by deadline, Lightning sats returned to contributor pubkeys (demo until M4 escrow).',
  },
  {
    id: 'hh_nostr_client',
    title: 'Open Source Nostr Client Launch',
    creator: '@dev_nostr',
    description: 'Fund the launch campaign for a new open-source Nostr client — 1M impressions across Twitter and Reddit.',
    targetBtc: 0.1,
    raisedBtc: 0.1,
    targetSats: 10_000_000,
    raisedSats: 10_000_000,
    hashtags: ['#Nostr', '#FOSS', '#Decentralized'],
    status: 'unleashed',
    daysLeft: 0,
    escrowDemo: true,
    refundPolicy: 'Threshold met — campaign deployed via PPQ.AI.',
  },
  {
    id: 'hh_btc_doc',
    title: 'Bitcoin Circular Economy Documentary',
    creator: '@btc_films',
    description: 'Funding ad spend to promote an indie documentary about circular economies in El Salvador and Costa Rica.',
    targetBtc: 0.25,
    raisedBtc: 0.015,
    targetSats: 25_000_000,
    raisedSats: 1_500_000,
    hashtags: ['#Bitcoin', '#ElSalvador', '#Documentary'],
    status: 'funding',
    daysLeft: 12,
    escrowDemo: true,
    refundPolicy: 'Contributions held in demo escrow; automatic refund if <100% funded at close.',
  },
];