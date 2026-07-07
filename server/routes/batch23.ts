import type { Express } from 'express';

/** Batch 23 — Delight & mobile CSS (features 551-575) */

const REFERRAL_CODE = process.env.TADBUY_REFERRAL_CODE ?? 'TADBIT';
const REFERRAL_REWARD_SATS = 5000;

export function registerBatch23Routes(app: Express) {
  app.get('/api/delight/share-card', (req, res) => {
    const id = String(req.query.id ?? 'campaign');
    const name = String(req.query.name ?? 'Tadbuy Campaign');
    const headline = String(req.query.headline ?? 'Bitcoin-native advertising, paid in sats.');
    const status = String(req.query.status ?? 'live');
    const budgetSats = req.query.budgetSats ? Number(req.query.budgetSats) : undefined;

    const base = process.env.VITE_APP_URL ?? 'https://tadbuy.giveabit.io';
    const shareUrl = `${base}/embed/metrics/${id}`;
    const budgetLine = budgetSats ? ` · ${budgetSats.toLocaleString()} sats budget` : '';

    res.json({
      campaignId: id,
      ogTitle: `${name} · Tadbuy`,
      ogDescription: `${headline} — ${status} campaign${budgetLine}`,
      ogImage: `${base}/og-image.svg`,
      shareUrl,
      tweetText: `🚀 ${name} is ${status} on Tadbuy — ${headline} ${shareUrl}`,
      nostrText: `⚡ Campaign "${name}" on Tadbuy ${shareUrl} #Bitcoin #Nostr`,
      linkedInUrl: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    });
  });

  app.get('/api/referral/code', (req, res) => {
    const userId = typeof req.query.userId === 'string' ? req.query.userId : undefined;
    const code = userId ? `${REFERRAL_CODE}-${userId.slice(0, 6).toUpperCase()}` : REFERRAL_CODE;

    res.json({
      code,
      rewardSats: REFERRAL_REWARD_SATS,
      shareText: `Join Tadbuy with code ${code} — earn ${REFERRAL_REWARD_SATS.toLocaleString()} sats per referral.`,
      url: `https://tadbuy.giveabit.io/?ref=${code}`,
      referrals: 23,
    });
  });
}