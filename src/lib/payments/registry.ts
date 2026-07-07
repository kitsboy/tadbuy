import { Zap, Bitcoin, Sparkles, Shield, Coins, Link2, Eye, Wallet } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface PaymentMethodDef {
  id: string;
  name: string;
  subtitle: string;
  icon: LucideIcon | string;
  color: string;
  border: string;
  bg: string;
  status: 'live' | 'beta' | 'coming';
  description: string;
}

export const PAYMENT_METHODS: PaymentMethodDef[] = [
  {
    id: 'lightning', name: 'Lightning', subtitle: 'Instant / Low fee',
    icon: Zap, color: 'text-lightning', border: 'border-lightning', bg: 'bg-lightning/10',
    status: 'live', description: 'BOLT11 invoices via LND node',
  },
  {
    id: 'fedimint', name: 'Fedimint', subtitle: 'Ecash / Private',
    icon: Shield, color: 'text-green', border: 'border-green', bg: 'bg-green/10',
    status: 'live', description: 'Chaumian ecash via federated mint',
  },
  {
    id: 'bolt12', name: 'BOLT 12', subtitle: 'Offers / Recurring',
    icon: Sparkles, color: 'text-purple', border: 'border-purple', bg: 'bg-purple/10',
    status: 'beta', description: 'Reusable Lightning offers',
  },
  {
    id: 'btc', name: 'Bitcoin', subtitle: 'On-chain',
    icon: '₿', color: 'text-accent', border: 'border-accent', bg: 'bg-accent/10',
    status: 'live', description: 'On-chain with RBF fee control',
  },
  {
    id: 'zap', name: 'Nostr Zap', subtitle: 'Social / Tipping',
    icon: '⚡', color: 'text-purple', border: 'border-purple', bg: 'bg-purple/10',
    status: 'live', description: 'NIP-57 Lightning Zaps',
  },
  {
    id: 'cashu', name: 'Cashu', subtitle: 'Ecash voucher',
    icon: Coins, color: 'text-lightning', border: 'border-lightning', bg: 'bg-lightning/10',
    status: 'beta', description: 'Redeem Cashu ecash tokens',
  },
  {
    id: 'lnurl', name: 'LNURL-pay', subtitle: 'Static / Dynamic',
    icon: Link2, color: 'text-blue', border: 'border-blue', bg: 'bg-blue/10',
    status: 'live', description: 'LNURL-pay endpoints',
  },
  {
    id: 'silent', name: 'Silent Pay', subtitle: 'BIP-352',
    icon: Eye, color: 'text-muted', border: 'border-border', bg: 'bg-surface',
    status: 'beta', description: 'Silent payment addresses',
  },
  {
    id: 'bip47', name: 'BIP-47', subtitle: 'Reusable codes',
    icon: Wallet, color: 'text-accent2', border: 'border-accent2', bg: 'bg-accent2/10',
    status: 'beta', description: 'Payment codes for recurring campaigns',
  },
];

export function getPaymentMethod(id: string): PaymentMethodDef | undefined {
  return PAYMENT_METHODS.find(p => p.id === id);
}

/** Payment rails actually wired at checkout (honest UX) */
export const CHECKOUT_PAYMENT_IDS = ['lightning', 'btc', 'fedimint'] as const;

export function getCheckoutPaymentMethods(): PaymentMethodDef[] {
  return PAYMENT_METHODS.filter(p => (CHECKOUT_PAYMENT_IDS as readonly string[]).includes(p.id));
}

export function getComingSoonPaymentMethods(): PaymentMethodDef[] {
  return PAYMENT_METHODS.filter(p => !(CHECKOUT_PAYMENT_IDS as readonly string[]).includes(p.id));
}