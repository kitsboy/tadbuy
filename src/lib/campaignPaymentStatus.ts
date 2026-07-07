/** Honest payment outcome labels — aligned with /beta reality */

export type PaymentOutcome = 'live' | 'demo' | 'pending';

export function resolvePaymentOutcome(
  paymentMethod: string,
  lightningVerified: boolean,
): PaymentOutcome {
  if (paymentMethod === 'lightning' && lightningVerified) return 'live';
  if (paymentMethod === 'fedimint') return 'demo'; // until M4 mint live
  if (paymentMethod === 'btc') return 'pending';
  return 'demo';
}

export function outcomeHeadline(outcome: PaymentOutcome): string {
  switch (outcome) {
    case 'live': return 'Your campaign is live!';
    case 'pending': return 'Payment pending — campaign saved';
    case 'demo': return 'Campaign saved (demo mode)';
  }
}

export function outcomeDescription(outcome: PaymentOutcome): string {
  switch (outcome) {
    case 'live':
      return 'PPQ.AI is distributing your ad. Settlement confirmed via Lightning.';
    case 'pending':
      return 'We saved your campaign. It activates once on-chain payment confirms (typically ~10 min).';
    case 'demo':
      return 'Your campaign is saved in demo mode. Real settlement starts when M4 Fedimint + Umbrel connect — see /beta.';
  }
}

export function outcomeBadge(outcome: PaymentOutcome): { label: string; variant: 'success' | 'warning' | 'info' } {
  switch (outcome) {
    case 'live': return { label: 'Live', variant: 'success' };
    case 'pending': return { label: 'Awaiting payment', variant: 'warning' };
    case 'demo': return { label: 'Demo mode', variant: 'info' };
  }
}