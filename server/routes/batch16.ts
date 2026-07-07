import type { Express } from 'express';
import { SupabaseCampaignRepository } from '../../src/lib/db/supabaseAdmin.ts';

/** Batch 16 — Campaign builder (enhancements 11-20) */
export function registerBatch16Routes(app: Express) {
  const campaignRepo = new SupabaseCampaignRepository();

  app.get('/api/campaigns/templates', (_req, res) => {
    res.json({
      templates: [
        {
          id: 'awareness',
          name: 'Brand Awareness',
          description: 'Maximize reach across social & Nostr',
          icon: 'awareness',
          platforms: ['twitter', 'nostr', 'instagram'],
          budgetSats: 500_000,
          headline: 'Stack sats, not surveillance',
          copy: 'Reach privacy-conscious audiences. Pay in Lightning.',
          hashtags: ['#bitcoin', '#nostr'],
        },
        {
          id: 'sales',
          name: 'Direct Sales',
          description: 'Conversion-focused with urgency',
          icon: 'sales',
          platforms: ['facebook', 'tiktok', 'reddit'],
          budgetSats: 750_000,
          headline: 'Get 20% off — pay with Bitcoin',
          copy: 'Limited-time offer. Lightning checkout in seconds.',
          hashtags: ['#sats', '#deal'],
        },
        {
          id: 'retargeting',
          name: 'Retargeting',
          description: 'Re-engage visitors who bounced',
          icon: 'retargeting',
          platforms: ['twitter', 'facebook', 'nostr'],
          budgetSats: 300_000,
          headline: 'Still thinking about it?',
          copy: 'Come back and complete your purchase with sats.',
          hashtags: ['#retarget'],
        },
      ],
    });
  });

  app.post('/api/campaigns/validate', (req, res) => {
    const { step, selectedPlatforms, btcAmount, headline, budgetSats } = req.body ?? {};
    const errors: string[] = [];
    const sats = budgetSats ?? Math.round((btcAmount ?? 0) * 100_000_000);

    if (step === 1 || step === undefined) {
      if (!selectedPlatforms?.length) errors.push('Select at least one platform');
      if (!sats || sats < 10_000) errors.push('Minimum budget is 10,000 sats');
    }
    if (step === 3) {
      if (!headline?.trim()) errors.push('Headline is required');
    }

    res.json({ valid: errors.length === 0, errors, warnings: [] });
  });

  app.post('/api/campaigns/duplicate/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const original = await campaignRepo.getById(id);
      if (!original) {
        return res.status(404).json({ error: 'Campaign not found' });
      }
      const { id: _omit, ...rest } = original;
      const duplicate = await campaignRepo.create({
        ...rest,
        name: `${original.name} (copy)`,
        status: 'draft',
        createdAt: new Date().toISOString(),
        impressions: 0,
        clicks: 0,
        spendBtc: 0,
        spendUsd: 0,
      });
      res.json({ success: true, campaign: duplicate });
    } catch {
      res.json({
        success: true,
        campaign: {
          id: `dup_${id}_${Date.now()}`,
          name: `Campaign copy`,
          status: 'draft',
          budgetSats: 500_000,
          sourceId: id,
        },
        demo: true,
      });
    }
  });
}