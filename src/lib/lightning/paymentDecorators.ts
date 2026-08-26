/**
 * Lightning Payment Decorators — Add metadata to payments for accounting
 * 
 * Allows attaching structured metadata to Lightning payments for tracking
 * which campaign, creative, and publisher a payment is for.
 */

export interface PaymentDecorator {
  decoratorId: string;
  paymentHash: string;
  metadata: {
    campaignId: string;
    creativeId: string;
    publisherPubkey: string;
    impressionCount: number;
    paymentType: 'ppq' | 'ppi' | 'retainer' | 'tip';
    invoiceType: 'bolt11' | 'bolt12' | 'lnurl';
    memo?: string;
  };
  createdAt: number;
  verified: boolean;
}

/** Attach decorator to a payment */
export function decoratePayment(
  paymentHash: string,
  campaignId: string,
  creativeId: string,
  publisherPubkey: string,
  impressionCount: number,
  paymentType: PaymentDecorator['metadata']['paymentType'],
  invoiceType: PaymentDecorator['metadata']['invoiceType'] = 'bolt11'
): PaymentDecorator {
  return {
    decoratorId: `dec_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    paymentHash,
    metadata: {
      campaignId,
      creativeId,
      publisherPubkey,
      impressionCount,
      paymentType,
      invoiceType,
    },
    createdAt: Date.now(),
    verified: false,
  };
}

/** Parse decorator from payment metadata */
export function parseDecorator(decorator: PaymentDecorator): string {
  return `${decorator.metadata.paymentType} | Campaign: ${decorator.metadata.campaignId} | ` +
         `Creative: ${decorator.metadata.creativeId} | Publisher: ${decorator.metadata.publisherPubkey.slice(0, 8)}... | ` +
         `Impressions: ${decorator.metadata.impressionCount}`;
}

/** Mock decorated payments */
export const MOCK_DECORATED_PAYMENTS: PaymentDecorator[] = [
  decoratePayment('abc123', 'cmp_001', 'creative_001', 'npub1publisher1...', 1000, 'ppq'),
  decoratePayment('def456', 'cmp_002', 'creative_002', 'npub1publisher2...', 500, 'ppi'),
];