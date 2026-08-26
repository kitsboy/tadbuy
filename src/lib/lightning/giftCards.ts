/**
 * Bitrefill-style Gift Card Vouchers — Lightning gift cards
 * 
 * Issues Lightning-funded gift cards that can be redeemed by anyone
 * via a BOLT12 offer or QR code. Useful for promotional campaigns
 * and user rewards.
 */

export interface GiftCard {
  cardId: string;
  amountSats: number;
  fundedByPubkey: string;
  recipientPubkey?: string;
  message?: string;
  status: 'issued' | 'redeemed' | 'expired' | 'cancelled';
  bolt11Invoice?: string;
  bolt12Offer?: string;
  redeemUrl: string;
  createdAt: number;
  expiresAt: number;
  redeemedAt?: number;
  redeemedByPubkey?: string;
}

export interface GiftCardBatch {
  batchId: string;
  totalCards: number;
  totalSats: number;
  fundedByPubkey: string;
  cards: GiftCard[];
  createdAt: number;
}

export function createGiftCard(
  amountSats: number,
  fundedByPubkey: string,
  message?: string,
  validityDays: number = 90
): GiftCard {
  const cardId = `gc_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  return {
    cardId,
    amountSats,
    fundedByPubkey,
    message,
    status: 'issued',
    bolt11Invoice: `lnbc${amountSats}n1${Math.random().toString(36).slice(2, 40)}`,
    bolt12Offer: `lno1${Math.random().toString(36).slice(2, 50)}`,
    redeemUrl: `https://tadbuy.io/redeem/${cardId}`,
    createdAt: Date.now(),
    expiresAt: Date.now() + validityDays * 86400000,
  };
}

export function createGiftCardBatch(
  totalCards: number,
  amountPerCardSats: number,
  fundedByPubkey: string,
  prefix: string = 'TAD-2024'
): GiftCardBatch {
  const cards: GiftCard[] = [];
  for (let i = 0; i < totalCards; i++) {
    const card = createGiftCard(amountPerCardSats, fundedByPubkey, `${prefix}-${i + 1}`);
    card.cardId = `gc_${prefix}_${i + 1}_${Math.random().toString(36).slice(2, 8)}`;
    cards.push(card);
  }
  return {
    batchId: `batch_${Date.now()}`,
    totalCards,
    totalSats: totalCards * amountPerCardSats,
    fundedByPubkey,
    cards,
    createdAt: Date.now(),
  };
}

export function redeemGiftCard(card: GiftCard, redeemedByPubkey: string): GiftCard {
  return {
    ...card,
    status: 'redeemed',
    redeemedAt: Date.now(),
    redeemedByPubkey,
  };
}

export function formatGiftCardSummary(card: GiftCard): string {
  return `${card.cardId}: ${card.amountSats.toLocaleString()} sats (${card.status})`;
}