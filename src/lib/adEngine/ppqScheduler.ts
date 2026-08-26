/**
 * Batched PPQ Query Scheduler — Schedule queries in batches
 * 
 * Schedules Pay-Per-Query (PPQ) ad requests in batches to:
 * 1. Reduce mempool spam (batches into single on-chain transaction)
 * 2. Lower fees (better fee economy of scale)
 * 3. Improve privacy (batch payments hide individual queries)
 */

export interface PpqQuery {
  queryId: string;
  campaignId: string;
  userQuery: string;
  matchedKeyword: string;
  bidSats: number;
  timestamp: number;
  zapperPubkey?: string;
}

export interface PpqBatch {
  batchId: string;
  queries: PpqQuery[];
  totalSats: number;
  createdAt: number;
  scheduledFor: number;
  status: 'pending' | 'scheduled' | 'processing' | 'settled' | 'failed';
  onchainTxid?: string;
  paymentBolt11?: string;
}

/** Schedule a PPQ query (will be batched with other queries) */
export function schedulePpqQuery(
  query: Omit<PpqQuery, 'queryId' | 'timestamp'>
): PpqQuery {
  return {
    ...query,
    queryId: `ppq_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    timestamp: Date.now(),
  };
}

/** Batch a list of queries into a settlement batch */
export function batchQueries(
  queries: PpqQuery[],
  scheduledFor: number = Date.now() + 5 * 60_000 // 5 minutes from now
): PpqBatch {
  return {
    batchId: `batch_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    queries,
    totalSats: queries.reduce((s, q) => s + q.bidSats, 0),
    createdAt: Date.now(),
    scheduledFor,
    status: 'pending',
  };
}

/** Process a batch (create Lightning invoice for settlement) */
export async function processBatch(batch: PpqBatch): Promise<PpqBatch> {
  // In production, this would:
  // 1. Aggregate all PPQ queries
  // 2. Generate a single Lightning invoice or BOLT12 offer
  // 3. Create a single on-chain transaction
  // 4. Update the campaign with paid query data
  
  return {
    ...batch,
    status: 'processing',
    paymentBolt11: `lnbc1${batch.totalSats}n1${Math.random().toString(36).slice(2, 50)}`,
  };
}

/** Simulate batched queries for demo */
export function simulatePpqBatch(count: number = 50): PpqBatch {
  const keywords = ['bitcoin', 'lightning', 'crypto', 'blockchain', 'defi', 'nostr'];
  const queries: PpqQuery[] = Array.from({ length: count }, (_, i) => ({
    queryId: `ppq_${i}_${Date.now()}`,
    campaignId: `cmp_${i % 5}`,
    userQuery: `${keywords[i % keywords.length]} advertising example ${i}`,
    matchedKeyword: keywords[i % keywords.length],
    bidSats: Math.floor(Math.random() * 10) + 1,
    timestamp: Date.now() - i * 1000,
  }));

  return batchQueries(queries, Date.now() + 300_000);
}

/** Format batch for display */
export function formatBatch(batch: PpqBatch): string {
  return `Batch ${batch.batchId}: ${batch.queries.length} queries, ${batch.totalSats} sats total, ` +
         `status: ${batch.status}, scheduled: ${new Date(batch.scheduledFor).toLocaleString()}`;
}