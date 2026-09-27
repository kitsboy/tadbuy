/** Honest campaign outcome labels for the current local-preview-only checkout. */

export type PaymentOutcome = 'demo';

export function resolvePaymentOutcome(): PaymentOutcome {
  return 'demo';
}

export function outcomeHeadline(_outcome: PaymentOutcome): string {
  return 'Campaign preview ready';
}

export function outcomeDescription(_outcome: PaymentOutcome): string {
  return 'Your campaign plan is previewed locally. No payment was made, no campaign record was created, and nothing was published.';
}

export function outcomeBadge(_outcome: PaymentOutcome): { label: string; variant: 'info' } {
  return { label: 'Local preview · unpaid', variant: 'info' };
}