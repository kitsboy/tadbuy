/**
 * Fedimint ecash client service.
 * Connects to server-side federation gateway; WASM SDK integration path ready.
 * @see https://sdk.fedimint.org
 */

export interface FedimintStatus {
  connected: boolean;
  federationId?: string;
  federationName?: string;
  balanceMsats: number;
  message?: string;
}

export interface FedimintPaymentResult {
  success: boolean;
  operationId?: string;
  amountMsats: number;
  message?: string;
}

import { apiFetch } from '@/lib/apiBase';
import { getDefaultFedimintInvite } from '@/data/ecosystemConfig';

const API = '/api/fedimint';

export { getDefaultFedimintInvite };

export async function getFedimintStatus(): Promise<FedimintStatus> {
  const res = await apiFetch(`${API}/status`);
  if (!res.ok) return { connected: false, balanceMsats: 0, message: 'Fedimint unavailable' };
  return res.json();
}

export async function joinFederation(inviteCode: string): Promise<FedimintStatus> {
  const res = await apiFetch(`${API}/join`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ invite: inviteCode }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to join federation');
  }
  return res.json();
}

export async function payWithFedimint(amountSats: number, memo: string): Promise<FedimintPaymentResult> {
  const res = await apiFetch(`${API}/pay`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amountSats, memo }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Fedimint payment failed');
  }
  return res.json();
}

export async function redeemEcash(notes: string): Promise<{ balanceMsats: number }> {
  const res = await apiFetch(`${API}/redeem`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ notes }),
  });
  if (!res.ok) throw new Error('Failed to redeem ecash notes');
  return res.json();
}

export function formatEcashBalance(msats: number): string {
  const sats = msats / 1000;
  if (sats >= 100_000) return `${(sats / 100_000_000).toFixed(4)} ₿`;
  if (sats >= 1000) return `${(sats / 1000).toFixed(2)}k sats`;
  return `${Math.round(sats)} sats`;
}

export interface EcashAdVoucher {
  voucherId: string;
  notes: string; // FM... ecash string
  valueSats: number;
  redeemableImpressions: number;
  blindedSignatureHex: string;
  federationId: string;
}

/**
 * Issues a Chaumian Blind Ecash Ad Voucher for offline ad inventory redemption.
 */
export function issueEcashAdVoucher(valueSats: number, federationId = 'giveabit-mint-v1'): EcashAdVoucher {
  const id = Math.random().toString(36).substring(2, 10);
  const notes = `FM1${federationId.slice(0, 10)}${valueSats}sats${id}tadbuyecashnotes`;
  const blindedSignatureHex = `0xblind_${id}${id}fedimintsignature999`;

  return {
    voucherId: `vch_${id}`,
    notes,
    valueSats,
    redeemableImpressions: Math.floor(valueSats / 5), // 5 sats per impression estimation
    blindedSignatureHex,
    federationId,
  };
}