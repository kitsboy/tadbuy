/**
 * LNURL-Pay Instant Checkout — Parse lightning:lnurl1... URIs for one-tap funding
 * 
 * LNURL specification: https://lnurl.com/specs/withdrawals/
 * Supports payout, withdraw, and invoice requests.
 */

export interface LNURLPayResult {
  status: 'ok' | 'error';
  callback: string;
  k1: string;
  minSats: number;
  maxSats: number;
  defaultDescription?: string;
}

/** Parse an LNURL string (lightning:...) */
export function parseLNURL(lnurl: string): { type: string; data: string } | null {
  try {
    // Remove lightning: prefix
    const urlString = lnurl.replace('lightning:', '');
    // Nostr NWC or other lightning URL format
    const url = new URL('https://' + urlString);
    return { type: url.pathname.slice(1), data: url.searchParams.get('amount') || '' };
  } catch {
    return null;
  }
}

/** Generate LNURL withdraw callback parameters */
export function generateLNURLWithdrawParams(
  amountSats: number,
  callbackUrl: string,
  memo: string = 'Tadbuy ad payout'
): string {
  const k1 = Buffer.from(`${amountSats}_${Date.now()}_${Math.random().toString(36)}`).toString('base64');
  return `?amount=${amountSats}&k1=${k1}&memo=${encodeURIComponent(memo)}`;
}

/** Simulate LNURL withdrawal for demo */
export async function simulateLNURLWithdraw(
  amountSats: number,
  callbackUrl: string
): Promise<{ success: boolean; preimage?: string; bolt11?: string }> {
  // In production, this would:
  // 1. Call the LNURL callback URL
  // 2. Verify the k1 challenge
  // 3. Create an invoice for the amount
  // 4. Return the payment preimage and BOLT11 invoice
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const preimage = `0x${Math.random().toString(16).slice(2, 64)}`;
  const bolt11 = `lnbc1${Math.random().toString(36).slice(2, 50)}`;
  
  return { success: true, preimage, bolt11 };
}

/** Format LNURL amount display */
export function formatLNURLAmount(sats: number): string {
  if (sats >= 1_000_000) return `${(sats / 1_000_000).toFixed(2)}M sats`;
  if (sats >= 1_000) return `${(sats / 1_000).toFixed(1)}k sats`;
  return `${sats} sats`;
}

/** LNURL status display component types */
export type LNURLStatus = 'pending' | 'success' | 'error' | 'timeout';

export interface LNURLStatusInfo {
  status: LNURLStatus;
  message: string;
  amount?: number;
}

/** Mock LNURL pay result for dashboard */
export const MOCK_LNURL_PAY: LNURLPayResult = {
  status: 'ok',
  callback: 'https://example.com/lnurl/callback',
  k1: 'k1_test_12345',
  minSats: 1000,
  maxSats: 10000000,
  defaultDescription: 'Tadbuy ad funding',
};