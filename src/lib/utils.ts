import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format satoshi amounts with k/M suffixes. */
export function formatSats(n: number, { compact = true }: { compact?: boolean } = {}): string {
  if (!Number.isFinite(n)) return '0';
  const abs = Math.abs(n);
  const sign = n < 0 ? '-' : '';
  if (compact) {
    if (abs >= 1_000_000) return `${sign}${(abs / 1_000_000).toFixed(abs % 1_000_000 === 0 ? 0 : 1)}M`;
    if (abs >= 1_000) return `${sign}${(abs / 1_000).toFixed(abs % 1_000 === 0 ? 0 : 1)}k`;
  }
  return `${sign}${abs.toLocaleString()}`;
}

/** Format BTC with configurable decimal places (default 8). */
export function formatBtc(btc: number, decimals = 8): string {
  if (!Number.isFinite(btc)) return '0';
  return `${btc.toFixed(decimals)} ₿`;
}

/** Truncate Bitcoin addresses, Lightning invoices, or pubkeys for display. */
export function truncateAddress(
  address: string,
  { start = 6, end = 4, fallback = '—' }: { start?: number; end?: number; fallback?: string } = {}
): string {
  if (!address?.trim()) return fallback;
  const trimmed = address.trim();
  if (trimmed.length <= start + end + 3) return trimmed;
  return `${trimmed.slice(0, start)}…${trimmed.slice(-end)}`;
}
