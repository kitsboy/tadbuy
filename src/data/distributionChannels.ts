/**
 * Tadbuy's distribution roadmap and the channels that can be coordinated today.
 *
 * Phase 1 deliberately describes vendor-assisted delivery. A channel is not
 * marked automated until Tadbuy has provider permission, a real backend, and
 * verified delivery/reporting contracts.
 */

export type DistributionPhase = 1 | 2 | 3 | 4 | 5;
export type DistributionMode = 'nip07' | 'vendor_assisted' | 'provider_api' | 'future';

export interface DistributionChannel {
  id: string;
  name: string;
  shortName: string;
  phase: DistributionPhase;
  mode: DistributionMode;
  status: 'ready' | 'manual' | 'planned' | 'future';
  description: string;
  proof: string;
  icon: string;
}

export const DISTRIBUTION_CHANNELS: DistributionChannel[] = [
  {
    id: 'nostr',
    name: 'Nostr',
    shortName: 'Nostr',
    phase: 1,
    mode: 'nip07',
    status: 'ready',
    description: 'Publish a clearly disclosed campaign note through a NIP-07 browser signer.',
    proof: 'Signed event ID plus relay acknowledgements',
    icon: '⚡',
  },
  {
    id: 'websites',
    name: 'Websites & blogs',
    shortName: 'Websites',
    phase: 1,
    mode: 'vendor_assisted',
    status: 'manual',
    description: 'Buy a direct placement from an independent site or blog publisher.',
    proof: 'Published URL, placement screenshot, and delivery window',
    icon: '🌐',
  },
  {
    id: 'newsletters',
    name: 'Newsletters',
    shortName: 'Newsletters',
    phase: 1,
    mode: 'vendor_assisted',
    status: 'manual',
    description: 'Coordinate a sponsored section or issue directly with a newsletter owner.',
    proof: 'Issue URL or screenshot, send date, and vendor report',
    icon: '✉️',
  },
  {
    id: 'podcasts',
    name: 'Podcasts',
    shortName: 'Podcasts',
    phase: 1,
    mode: 'vendor_assisted',
    status: 'manual',
    description: 'Book a host-read, pre-roll, or mid-roll placement with an independent show.',
    proof: 'Episode URL, timestamp, and vendor delivery report',
    icon: '🎙️',
  },
  {
    id: 'reddit',
    name: 'Reddit',
    shortName: 'Reddit',
    phase: 2,
    mode: 'vendor_assisted',
    status: 'manual',
    description: 'Coordinate approved community or creator placements through vendors who control the account; Ads API evaluation comes later.',
    proof: 'Community URL or screenshot, publication date, and vendor delivery note',
    icon: '◉',
  },
  {
    id: 'meta',
    name: 'Facebook + Instagram',
    shortName: 'Meta',
    phase: 3,
    mode: 'provider_api',
    status: 'planned',
    description: 'One Meta integration for both Facebook and Instagram after permissions and policy review.',
    proof: 'Meta campaign ID, delivery report, and spend reconciliation',
    icon: '◌',
  },
  {
    id: 'youtube',
    name: 'YouTube',
    shortName: 'YouTube',
    phase: 3,
    mode: 'provider_api',
    status: 'planned',
    description: 'Start with creator sponsorships; add Google Ads execution only after access is approved.',
    proof: 'Video or episode URL, creator confirmation, and measured delivery',
    icon: '▶',
  },
  {
    id: 'spotify',
    name: 'Spotify & audio',
    shortName: 'Spotify',
    phase: 3,
    mode: 'provider_api',
    status: 'planned',
    description: 'A later audio-network integration for campaign management and reporting.',
    proof: 'Provider campaign ID and audio delivery report',
    icon: '♫',
  },
  {
    id: 'pinterest',
    name: 'Pinterest',
    shortName: 'Pinterest',
    phase: 3,
    mode: 'provider_api',
    status: 'planned',
    description: 'A visual-commerce channel for products, design, and evergreen discovery.',
    proof: 'Provider campaign ID and reporting export',
    icon: 'P',
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    shortName: 'LinkedIn',
    phase: 4,
    mode: 'provider_api',
    status: 'planned',
    description: 'Premium B2B distribution once Tadbuy has enterprise advertisers and compliance workflows.',
    proof: 'Provider campaign ID, lead report, and spend reconciliation',
    icon: 'in',
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    shortName: 'TikTok',
    phase: 4,
    mode: 'provider_api',
    status: 'planned',
    description: 'Specialist short-form video channel; not part of the first Bitcoin-native launch.',
    proof: 'Provider campaign ID and creator or delivery report',
    icon: '♪',
  },
  {
    id: 'dooh',
    name: 'Digital out-of-home screens',
    shortName: 'DOOH',
    phase: 5,
    mode: 'future',
    status: 'future',
    description: 'A future screen-owner marketplace and programmatic DOOH exchange layer.',
    proof: 'Playback logs plus independent audience measurement',
    icon: '▣',
  },
];

export const PHASE_ONE_CHANNEL_IDS = ['nostr', 'websites', 'newsletters', 'podcasts'] as const;
export type PhaseOneChannelId = (typeof PHASE_ONE_CHANNEL_IDS)[number];

export function getDistributionChannel(id: string): DistributionChannel | undefined {
  return DISTRIBUTION_CHANNELS.find(channel => channel.id === id);
}

export function getPhaseOneChannels(): DistributionChannel[] {
  return DISTRIBUTION_CHANNELS.filter(channel => channel.phase === 1);
}
