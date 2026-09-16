import { useEffect, useState } from 'react';

/**
 * A mempool.space fee snapshot — or `null` when we have not measured one.
 *
 * One live source: https://mempool.space/api/v1/fees/recommended (the only fee
 * host our CSP allows). A fee we have not measured must never render as a fee
 * we have: the previous shape initialised state to a hardcoded `5 / 4 / 3` and
 * assigned any JSON body straight into state, so a blocked, slow or reshaped
 * response rendered an invented number under an "Estimated (X sat/vB)" label.
 */
export interface MempoolFees {
  fastestFee: number;
  halfHourFee: number;
  hourFee: number;
  economyFee?: number;
}

/** The single fee source for the client. Do not add a second one. */
export const MEMPOOL_FEES_URL = 'https://mempool.space/api/v1/fees/recommended';

/**
 * Assumed size of a simple on-chain ad payment, in vbytes — a stated
 * assumption, not a measurement. Shared so every fee line multiplies by the
 * same number.
 */
export const ASSUMED_TX_VBYTES = 140;

/** Accept only a complete, positive snapshot; anything else is not a measurement. */
export function parseMempoolFees(data: unknown): MempoolFees | null {
  if (!data || typeof data !== 'object') return null;
  const raw = data as Record<string, unknown>;
  const fees: MempoolFees = {
    fastestFee: Number(raw.fastestFee),
    halfHourFee: Number(raw.halfHourFee),
    hourFee: Number(raw.hourFee),
    economyFee: Number(raw.economyFee),
  };
  const complete = [fees.fastestFee, fees.halfHourFee, fees.hourFee].every(
    (v) => Number.isFinite(v) && v > 0
  );
  return complete ? fees : null;
}

/**
 * Live mempool.space fee snapshot, refreshed every 60s.
 *
 * Returns `null` until a complete, positive snapshot has been accepted, and
 * keeps the last measured snapshot (never an invented one) if a later request
 * fails. Callers must render an explicit unavailable state rather than a
 * placeholder when this is `null`.
 */
export function useMempoolFees(): MempoolFees | null {
  const [fees, setFees] = useState<MempoolFees | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadFees = async () => {
      try {
        const res = await fetch(MEMPOOL_FEES_URL, { cache: 'no-store' });
        if (!res.ok) return;
        const clean = parseMempoolFees(await res.json());
        // Accept only a complete, positive snapshot; anything else keeps the
        // last good one (or the unavailable state) rather than showing a hole.
        if (clean && !cancelled) setFees(clean);
      } catch {
        // Network failure: keep the last measured snapshot, or stay unavailable.
      }
    };

    loadFees();
    const interval = setInterval(loadFees, 60_000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return fees;
}
