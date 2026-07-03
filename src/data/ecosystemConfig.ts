/**
 * Give A Bit ecosystem config — shared across tadbuy, satohash, giveabit, motopass, openstrata.
 * Fedimint mint runs on M4 (HERMES). App code + docs live on M3 (~/projects/).
 */
export const GIVEABIT_ECOSYSTEM = {
  federation: {
    id: 'giveabit-mint',
    name: 'Give A Bit Mint',
    domain: 'giveabit.io',
    status: 'staged' as const, // staged | beta | live
    /** Set on M4 when mint is created — never commit real invite to git */
    inviteEnvVar: 'VITE_FEDIMINT_INVITE',
    gatewayEnvVar: 'FEDIMINT_GATEWAY_URL',
    /** Future M4 endpoint (Tailscale or mint.giveabit.io) */
    stagedGateway: 'https://mint.giveabit.io',
    fediDeepLink: 'fedi://gateway/mint.giveabit.io',
    docs: 'https://fedimint.org',
  },

  /** All projects that share the Give A Bit Mint */
  projects: [
    { id: 'tadbuy',     name: 'Tadbuy',     url: 'https://tadbuy.giveabit.io',     repo: 'kitsboy/tadbuy' },
    { id: 'giveabit',   name: 'Give A Bit', url: 'https://giveabit.io',           repo: 'kitsboy/giveabit' },
    { id: 'satohash',   name: 'Satohash',   url: 'https://satohash.giveabit.io',  repo: 'kitsboy/satohash' },
    { id: 'motopass',   name: 'MotoPass',   url: 'https://motopass.giveabit.io',  repo: 'kitsboy/motopass' },
    { id: 'openstrata', name: 'OpenStrata', url: 'https://openstrata.giveabit.io', repo: 'kitsboy/openstrata' },
  ],

  infrastructure: {
    m3: {
      role: 'Development (Grok/Cursor)',
      workspace: '~/projects/',
      runs: ['npm run dev', 'git', 'docs', 'UI code'],
      doesNotRun: ['Fedimint guardian', 'Umbrel LND', 'long-running daemons'],
    },
    m4: {
      role: 'Server / HERMES / Kimi',
      workspace: 'Obsidian vault + MASTER-BRAIN',
      runs: ['Fedimint federation', 'Umbrel full node (when ready)', 'Fedi gateway', 'API proxy'],
      refDoc: 'docs/M4-SERVER-REF.md',
    },
    umbrel: {
      status: 'offline' as const, // offline 93d — Rosa t_46208fbe
      purpose: 'LND Lightning node for real invoices',
      envVars: ['UMBREL_LND_CERT', 'UMBREL_LND_MACAROON', 'UMBREL_LND_SOCKET'],
    },
    fedi: {
      status: 'waiting' as const, // Fedi 26.6.0 = FM 0.10; need Guardian 0.11 — Andrea t_8ee7c976
      purpose: 'Mobile/desktop wallet for Fedimint ecash — Cam keeps installed, wait for fm-invite',
      url: 'https://fedi.xyz',
      appVersion: '26.6.0',
      fedimintSdk: '0.10.0',
      guardianTarget: '0.11.0',
    },
  },

  api: {
    status: 'live' as const,
    baseUrl: 'https://api.giveabit.io',
    baseUrlEnvVar: 'VITE_API_BASE_URL',
    cloudflareNote: 'Cloudflare Pages serves static SPA — /api/* proxied to M4 via api.giveabit.io.',
  },
} as const;

export function getDefaultFedimintInvite(): string {
  return import.meta.env.VITE_FEDIMINT_INVITE ?? '';
}

export function getFedimintGateway(): string {
  return import.meta.env.VITE_FEDIMINT_GATEWAY_URL
    ?? GIVEABIT_ECOSYSTEM.federation.stagedGateway;
}