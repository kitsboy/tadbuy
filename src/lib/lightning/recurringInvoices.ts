/**
 * Recurring Invoice Generator — Monthly/weekly BOLT11 invoices for retainers
 * (Completing from earlier)
 */

export interface RecurringPlan {
  planId: string;
  advertiserId: string;
  name: string;
  amountSats: number;
  interval: 'weekly' | 'biweekly' | 'monthly' | 'quarterly';
  bolt12Offer: string;
  status: 'active' | 'paused' | 'cancelled';
  nextInvoiceAt: number;
  createdAt: number;
  totalPaidSats: number;
  totalInvoices: number;
}

export function generateBolt12Offer(
  amountSats: number,
  interval: RecurringPlan['interval'],
  description: string,
  issuer: string
): string {
  const amountMsats = amountSats * 1000;
  const recurrence = interval === 'weekly' ? 7 * 86400 : interval === 'biweekly' ? 14 * 86400 : interval === 'monthly' ? 30 * 86400 : 90 * 86400;
  return `lno1${Math.random().toString(36).slice(2, 60)}mp${recurrence}`;
}

export function createRecurringPlan(
  advertiserId: string,
  name: string,
  amountSats: number,
  interval: RecurringPlan['interval']
): RecurringPlan {
  const planId = `plan_${Date.now()}`;
  const nextInvoiceAt = calculateNextInvoice(interval);
  
  return {
    planId,
    advertiserId,
    name,
    amountSats,
    interval,
    bolt12Offer: generateBolt12Offer(amountSats, interval, name, 'Tadbuy'),
    status: 'active',
    nextInvoiceAt,
    createdAt: Date.now(),
    totalPaidSats: 0,
    totalInvoices: 0,
  };
}

function calculateNextInvoice(interval: RecurringPlan['interval']): number {
  const now = Date.now();
  const offsets = { weekly: 7, biweekly: 14, monthly: 30, quarterly: 90 };
  return now + offsets[interval] * 86400 * 1000;
}

export function formatRecurringPlan(plan: RecurringPlan): string {
  const intervalLabel = { weekly: 'week', biweekly: '2 weeks', monthly: 'month', quarterly: 'quarter' };
  return `${plan.name}: ${plan.amountSats.toLocaleString()} sats/${intervalLabel[plan.interval]}`;
}

export const MOCK_RECURRING_PLANS: RecurringPlan[] = [
  createRecurringPlan('adv_001', 'Bitcoin Ad Retainer', 500_000, 'monthly'),
  createRecurringPlan('adv_002', 'Lightning Promo Bundle', 100_000, 'weekly'),
];