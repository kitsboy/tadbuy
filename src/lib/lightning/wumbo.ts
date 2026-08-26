/**
 * Lightning RFC-0024 (Wumbo) Support — Handle >1M sat channel capacities
 * 
 * RFC-0024 introduces "wumbo" channels allowing channel capacities beyond
 * the historical 0.16777 BTC (16,777,215 sat) limit. LND added this support
 * via `wumbo-channels` and CLN via `option_wumbo_channels`. This module
 * abstracts the validation logic and provides UI helpers.
 * 
 * Reference: https://github.com/lightning/bolts/blob/master/02-peer-protocol.md
 */

export const WUMBO_MIN_CAPACITY_SATS = 16_777_215; // 0.16777215 BTC
export const WUMBO_MAX_CAPACITY_SATS = 1_000_000_000_000; // 10M BTC (theoretical)

export interface ChannelCapacity {
  capacitySats: number;
  isWumbo: boolean;
  maxPushSats: number;
  minReserveSats: number;
  reserveRatio: number;
  effectiveCapacity: number;
  restrictions: string[];
}

/** Determine if a channel is wumbo (capacity exceeds 0.167 BTC) */
export function isWumboChannel(capacitySats: number): boolean {
  return capacitySats > WUMBO_MIN_CAPACITY_SATS;
}

/** Calculate max pushable sats for a given channel capacity */
export function calculateMaxPush(capacitySats: number): number {
  // Max push is generally capacity minus reserve, minus fees
  // Typical reserve ratio is 1% with minimum 1000 sats
  const reserveSats = Math.max(1_000, Math.floor(capacitySats * 0.01));
  return capacitySats - reserveSats;
}

/** Validate a channel open request against wumbo rules */
export function validateWumboChannel(
  capacitySats: number,
  pushSats: number = 0,
  hasWumboFeature: boolean = true
): ChannelCapacity {
  const restrictions: string[] = [];
  
  if (isWumboChannel(capacitySats) && !hasWumboFeature) {
    restrictions.push(
      `Channel capacity ${capacitySats.toLocaleString()} sats exceeds standard 0.16777 BTC limit. ` +
      'Both peers must support RFC-0024 (wumbo) for this to work.'
    );
  }
  
  if (capacitySats > WUMBO_MAX_CAPACITY_SATS) {
    restrictions.push(
      `Channel capacity exceeds theoretical max of ${WUMBO_MAX_CAPACITY_SATS.toLocaleString()} sats`
    );
  }
  
  if (pushSats > calculateMaxPush(capacitySats)) {
    restrictions.push(
      `Push amount ${pushSats.toLocaleString()} sats exceeds max push of ` +
      `${calculateMaxPush(capacitySats).toLocaleString()} sats`
    );
  }
  
  return {
    capacitySats,
    isWumbo: isWumboChannel(capacitySats),
    maxPushSats: calculateMaxPush(capacitySats),
    minReserveSats: Math.max(1_000, Math.floor(capacitySats * 0.01)),
    reserveRatio: 0.01,
    effectiveCapacity: capacitySats - Math.max(1_000, Math.floor(capacitySats * 0.01)),
    restrictions,
  };
}

/** Format capacity for display with wumbo badge */
export function formatChannelCapacity(capacitySats: number): string {
  const btc = capacitySats / 100_000_000;
  const wumbo = isWumboChannel(capacitySats) ? ' 🐋' : '';
  return `${capacitySats.toLocaleString()} sats (${btc.toFixed(4)} BTC)${wumbo}`;
}

/** Mock data: wumbo channels in the Lightning network */
export const MOCK_WUMBO_CHANNELS: ChannelCapacity[] = [
  validateWumboChannel(500_000_000, 0, true),    // 5 BTC wumbo
  validateWumboChannel(1_000_000_000, 100_000_000, true), // 10 BTC wumbo
  validateWumboChannel(2_500_000_000, 500_000_000, true), // 25 BTC wumbo
  validateWumboChannel(10_000_000, 5_000_000, false),      // 0.1 BTC standard
  validateWumboChannel(100_000_000, 30_000_000, true),      // 1 BTC wumbo
];