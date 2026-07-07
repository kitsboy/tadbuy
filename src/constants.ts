// ─── App-wide constants ──────────────────────────────────────────────────────
// APP_VERSION is auto-synced from package.json on every push (see .githooks/pre-push).

export { APP_VERSION, APP_VERSION_RAW } from './version';

export const BITCOIN_ADDRESS =
  "bc1qhm5ndfjhqxdk3cx0pngyps4f5nnwdckulmge6c8keyf2pk0neqtshjn8ad";

export const BITCOIN_URI = `bitcoin:${BITCOIN_ADDRESS}`;

export const CONTACT_EMAIL = "hello@giveabit.io";
export const SUPPORT_EMAIL = "Kimi@giveabit.io";
export const TWITTER_HANDLE = "@give_bit";
