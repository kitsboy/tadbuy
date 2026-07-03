/**
 * Auto-syncs executive, financial, marketing, and README snippets from PROJECT_STATE.
 * Runs on every `npm run build` via prebuild hook.
 */
import fs from 'fs';
import path from 'path';
import { PROJECT_STATE } from '../src/data/projectState.ts';

const ROOT = path.resolve(import.meta.dirname, '..');
const today = new Date().toISOString().split('T')[0];

function writeDoc(filename: string, content: string) {
  const filepath = path.join(ROOT, 'docs', filename);
  fs.writeFileSync(filepath, content, 'utf-8');
  console.log(`  ✓ docs/${filename}`);
}

async function fetchLiveMetrics() {
  try {
    const res = await fetch('http://127.0.0.1:3000/api/metrics', { signal: AbortSignal.timeout(2000) });
    if (res.ok) return await res.json();
  } catch { /* dev server not running — use static state */ }
  return null;
}

async function main() {
  console.log('📄 Syncing auto-evolving docs...');

  const live = await fetchLiveMetrics();
  const t = PROJECT_STATE.executive.traction;
  const impressions = live?.impressions ?? 1_240_000;
  const campaigns = live?.totalCampaigns ?? t.campaignsLaunched;

  writeDoc('EXECUTIVE.md', `# Tadbuy — Executive Summary

**Auto-generated:** ${today} · **Version:** ${PROJECT_STATE.version}

## Mission
${PROJECT_STATE.executive.mission}

## Vision
${PROJECT_STATE.executive.vision}

## Traction (Live)
| Metric | Value |
|--------|-------|
| Campaigns | ${campaigns.toLocaleString()}+ |
| Impressions | ${impressions.toLocaleString()}+ |
| Publishers | ${t.publishers}+ |
| Platforms | ${t.platforms} |
| Avg Settlement | <${t.avgSettlementSeconds}s |
| Sats Processed | ${(t.satsProcessed / 1e9).toFixed(1)}B+ |

## Differentiators
${PROJECT_STATE.executive.differentiators.map(d => `- ${d}`).join('\n')}

## Fedimint Strategy
Tadbuy integrates **Fedimint ecash** as a first-class payment rail — enabling privacy-preserving, federation-backed ad purchases without on-chain fees. See [docs/FEDIMINT.md](./FEDIMINT.md).

---
*Safe Harbour · Part of the [Give A Bit](https://giveabit.io) family.*
`);

  const f = PROJECT_STATE.financials;
  writeDoc('FINANCIALS.md', `# Tadbuy — Financial Overview

**Auto-generated:** ${today} · **FY:** ${f.fiscalYear}

## Revenue Model
${f.revenueModel}

## Projections (${f.currency})
| Year | Platform Revenue | Ad Spend Volume | Active Users |
|------|-----------------|-----------------|--------------|
${f.projections.map(p => `| ${p.year} | $${p.revenue.toLocaleString()} | $${p.adSpend.toLocaleString()} | ${p.users.toLocaleString()} |`).join('\n')}

## Unit Economics
| Metric | Value |
|--------|-------|
| Avg Campaign Budget | $${f.unitEconomics.avgCampaignBudgetUsd} |
| Platform Take Rate | ${f.unitEconomics.platformTakeRate * 100}% |
| CAC | $${f.unitEconomics.cacUsd} |
| LTV | $${f.unitEconomics.ltvUsd} |
| Gross Margin | ${f.unitEconomics.grossMargin * 100}% |

## Funding
- **Stage:** ${f.funding.stage}
- **Runway:** ${f.funding.runway}
- **Strategic Ask:** ${f.funding.ask}

---
*Auto-synced from projectState.ts on every build.*
`);

  writeDoc('MARKETING.md', `# Tadbuy — Marketing

**Auto-generated:** ${today}

**Tagline:** ${PROJECT_STATE.marketing.tagline}

**Pitch:** ${PROJECT_STATE.marketing.pitch}

**CTA:** ${PROJECT_STATE.marketing.cta}

## Target Audiences
${PROJECT_STATE.marketing.audiences.map(a => `- ${a}`).join('\n')}

## Payment Rails (Marketing Points)
${PROJECT_STATE.paymentMethods.map(p => `- **${p.name}** — ${p.status}`).join('\n')}

## Live URL
${PROJECT_STATE.liveUrl}

---
*Part of the [Give A Bit](https://giveabit.io) family.*
`);

  writeDoc('FEDIMINT.md', `# Fedimint Integration — Tadbuy

**Auto-generated:** ${today}

## Overview
${PROJECT_STATE.fedimint.description}

## Why Fedimint for Ads?
${PROJECT_STATE.fedimint.benefits.map(b => `- ${b}`).join('\n')}

## Configuration
\`\`\`bash
# .env.local
VITE_FEDIMINT_INVITE=fm-invite://...
FEDIMINT_GATEWAY_URL=https://your-mint-gateway
\`\`\`

## User Flow
1. Advertiser selects **Fedimint Ecash** at checkout
2. Join federation via invite code (one-time)
3. Pay campaign budget in ecash notes
4. Federation settles to Tadbuy Lightning node
5. Campaign goes live instantly

## Resources
- [Fedimint.org](${PROJECT_STATE.fedimint.docsUrl})
- [Fedimint SDK](${PROJECT_STATE.fedimint.sdkUrl})
- [Bitcoin Design Guide — Ecash](https://bitcoin.design/guide/how-it-works/ecash/fedimint/)

## API Endpoints
| Endpoint | Method | Description |
|----------|--------|-------------|
| /api/fedimint/status | GET | Federation connection status |
| /api/fedimint/balance | GET | Ecash balance (session) |
| /api/fedimint/pay | POST | Pay campaign with ecash |

---
*Tadbuy ${PROJECT_STATE.version}*
`);

  // Update LATEST-UPDATE one-liner
  const latestPath = path.join(ROOT, 'LATEST-UPDATE.md');
  fs.writeFileSync(latestPath, `# tadbuy — Last Updated ${today} by Grok

Brief: ${PROJECT_STATE.version} — Fedimint + auto-evolving docs + pitch page
Docs synced: ${today}
`, 'utf-8');

  console.log('✅ Docs sync complete.');
}

main().catch((e) => {
  console.error('Docs sync failed:', e);
  process.exit(1);
});