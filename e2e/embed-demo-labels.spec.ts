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

  /**
   * Ruling t_c8ee49fa (2026-09-16): the /campaigns share modal is the publisher-facing control
   * that HANDS OUT the metrics embed. It used to label that embed "real-time" — an express
   * assertion of live measurement sitting directly above the generated iframe, so a publisher
   * copying the embed code on that word would misrepresent it to their own audience (the same
   * class of claim demoted one level down in the embed itself). These two strings are the only
   * real-time occurrences on the page; the sample notices around them stay.
   */
  test('/campaigns share modal hands out the embed with sample wording, never "real-time"', async ({ page }) => {
    await page.goto('/campaigns', { waitUntil: 'domcontentloaded' });

    const shareButton = page.locator('button:has(svg.lucide-share-2)').first();
    await expect(shareButton).toBeVisible({ timeout: 20_000 });
    await shareButton.click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible({ timeout: 10_000 });

    // Rendered text — what a human actually sees. The shared `Label` component applies
    // `uppercase`, so this label carries `normal-case` (the same reason the embed badge does,
    // t_3d8df498): the ruled strings must appear VERBATIM, not re-cased.
    const rendered = await dialog.evaluate((el) => (el as HTMLElement).innerText);
    expect(rendered).toContain('Embed Sample Metrics (iFrame)');
    expect(rendered).toContain('Share sample metrics for');
    expect(rendered).not.toMatch(/real-?time/i);

    // ...and in the source-of-truth DOM text, so the guard still bites if a transform is ever
    // the only thing hiding the claim.
    const textContent = await dialog.evaluate((el) => el.textContent || '');
    expect(textContent).not.toMatch(/real-?time/i);
  });
});
