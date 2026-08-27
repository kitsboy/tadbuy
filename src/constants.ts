// ─── App-wide constants ──────────────────────────────────────────────────────
// APP_VERSION is auto-synced from package.json on every push (see .githooks/pre-push).

export { APP_VERSION, APP_VERSION_RAW } from './version';

/** Breez Spark (Config A, 2026-08-27) — giveabit.io/wallets.json */
export const BITCOIN_ADDRESS =
  "bc1p0ch84fknrxsspzknggrusuzvdl5q2tm52q093q3dvsrw4awdt6tsjmdy5y";

export const BITCOIN_URI = `bitcoin:${BITCOIN_ADDRESS}`;

export const LIGHTNING_ADDRESS = "tadbuy@breez.tips";

export const LIGHTNING_URI = `lightning:${LIGHTNING_ADDRESS}`;

export const CONTACT_EMAIL = "hello@giveabit.io";
export const SUPPORT_EMAIL = "Kimi@giveabit.io";
export const TWITTER_HANDLE = "@give_bit";
