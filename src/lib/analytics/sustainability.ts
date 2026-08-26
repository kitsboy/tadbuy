/**
 * Sustainability Score — Show carbon footprint of ad delivery
 * 
 * Compares the environmental impact of Bitcoin-based ad delivery
 * vs. traditional Proof-of-Stake chains. Bitcoin uses ~0.5% of global
 * electricity; PoS chains use a fraction of that.
 */

export interface SustainabilityMetrics {
  network: 'bitcoin' | 'lightning' | 'liquid' | 'fedimint' | 'ethereum' | 'solana';
  energyPerTxKwh: number;
  carbonPerTxKg: number;
  co2PerDollar: number; // kg CO2 per $1 of volume
  renewabilityPct: number; // % renewable energy
  score: number; // 0-100 (higher = greener)
  notes: string;
}

export const SUSTAINABILITY_DATA: Record<string, SustainabilityMetrics> = {
  bitcoin: {
    network: 'bitcoin',
    energyPerTxKwh: 1200,
    carbonPerTxKg: 600,
    co2PerDollar: 0.0002,
    renewabilityPct: 60, // estimated
    score: 70,
    notes: 'Proof of Work with increasing renewable energy adoption',
  },
  lightning: {
    network: 'lightning',
    energyPerTxKwh: 0.0001, // virtually no on-chain cost per payment
    carbonPerTxKg: 0.00005,
    co2PerDollar: 0.0000001,
    renewabilityPct: 60,
    score: 95,
    notes: 'Layer 2 with near-zero per-transaction energy cost',
  },
  liquid: {
    network: 'liquid',
    energyPerTxKwh: 0.01,
    carbonPerTxKg: 0.005,
    co2PerDollar: 0.000001,
    renewabilityPct: 60,
    score: 92,
    notes: 'Federated sidechain with efficient consensus',
  },
  fedimint: {
    network: 'fedimint',
    energyPerTxKwh: 0.001,
    carbonPerTxKg: 0.0005,
    co2PerDollar: 0.0000005,
    renewabilityPct: 80,
    score: 98,
    notes: 'Federated Chaumian ecash with minimal energy use',
  },
  ethereum: {
    network: 'ethereum',
    energyPerTxKwh: 0.03,
    carbonPerTxKg: 0.01,
    co2PerDollar: 0.000005,
    renewabilityPct: 50,
    score: 88,
    notes: 'Proof of Stake post-merge',
  },
  solana: {
    network: 'solana',
    energyPerTxKwh: 0.001,
    carbonPerTxKg: 0.0005,
    co2PerDollar: 0.0000003,
    renewabilityPct: 50,
    score: 90,
    notes: 'Proof of Stake with high throughput',
  },
};

/** Calculate sustainability for a campaign using multiple networks */
export interface CampaignSustainability {
  totalScore: number;
  co2SavedVsEthereum: number;
  breakdown: Array<{ network: string; txCount: number; co2: number }>;
  recommendation: string;
}

export function calculateCampaignSustainability(
  networkUsage: Record<string, number>
): CampaignSustainability {
  let totalScore = 0;
  let totalCo2 = 0;
  const breakdown: CampaignSustainability['breakdown'] = [];
  
  for (const [network, txCount] of Object.entries(networkUsage)) {
    const data = SUSTAINABILITY_DATA[network];
    if (!data) continue;
    
    const co2 = data.carbonPerTxKg * txCount;
    totalScore += data.score * txCount;
    totalCo2 += co2;
    breakdown.push({ network, txCount, co2 });
  }
  
  const totalTx = Object.values(networkUsage).reduce((s, n) => s + n, 0);
  const avgScore = totalTx > 0 ? totalScore / totalTx : 0;
  
  // Compare to using Ethereum (the most common alternative for ad delivery)
  const ethereumCo2 = SUSTAINABILITY_DATA.ethereum.carbonPerTxKg * totalTx;
  const co2Saved = Math.max(0, ethereumCo2 - totalCo2);
  
  let recommendation = 'Consider Lightning for high-frequency micropayments';
  if (avgScore > 95) recommendation = 'Excellent! Most transactions on Lightning/Fedimint';
  else if (avgScore < 70) recommendation = 'Consider using Lightning or Liquid to reduce environmental impact';
  
  return {
    totalScore: Math.round(avgScore),
    co2SavedVsEthereum: Math.round(co2Saved),
    breakdown,
    recommendation,
  };
}

/** Format sustainability score for display */
export function formatSustainability(metrics: SustainabilityMetrics): string {
  return `${metrics.network.toUpperCase()}: ${metrics.score}/100 green | ` +
         `${metrics.carbonPerTxKg} kg CO2/tx | ` +
         `${metrics.renewabilityPct}% renewable`;
}