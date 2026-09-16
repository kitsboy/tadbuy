import { test, expect } from '@playwright/test';

/**
 * Legal ruling t_699c5355 (2026-09-16): the demo campaigns feed both `/campaigns` and the
 * embed routes. `/campaigns` labels its sample data twice, but the embeds — built to be
 * iframed off-site — rendered an unlabelled "SPONSORED / @give_bit · Promoted" card naming a
 * real third-party destination, and a metrics card asserting "REAL-TIME METRICS" over figures
 * that were never measured.
 *
 * These guards encode the ruled wording. If one goes red, DO NOT "fix" it by restoring the
 * retired claim (`REAL-TIME METRICS`, `Live updates via Hubhash`, a real brand domain) —
 * assert the honest wording instead.
 */
const BADGE = 'Illustrative — not a real campaign';

test.describe('demo campaign embeds carry the illustrative label', () => {
  for (const id of ['2', '3']) {
    test(`/embed/ad/${id} is labelled and names no third-party destination`, async ({ page }) => {
      await page.goto(`/embed/ad/${id}`, { waitUntil: 'domcontentloaded' });
      await expect(page.getByText(BADGE)).toBeVisible({ timeout: 20_000 });

      const text = await page.locator('body').innerText();
      expect(text).not.toContain('nostr.com');
      expect(text).not.toContain('youtube.com');
      // the honest self-demo (our own property) and the sponsored framing stay
      expect(text).toContain('giveabit.io');
      expect(text.toUpperCase()).toContain('SPONSORED');
    });
  }

  test('/embed/metrics/2 demotes liveness wording and labels the sample figures', async ({ page }) => {
    await page.goto('/embed/metrics/2', { waitUntil: 'domcontentloaded' });
    await expect(page.getByText(BADGE)).toBeVisible({ timeout: 20_000 });

    const text = await page.locator('body').innerText();
    expect(text).not.toMatch(/REAL-TIME METRICS/i);
    expect(text).not.toContain('Live updates via Hubhash');
    expect(text.toUpperCase()).toContain('SAMPLE METRICS');
  });
});
