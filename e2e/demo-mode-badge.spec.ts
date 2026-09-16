import { test, expect } from '@playwright/test';

/**
 * Demo mode is pinned at build time (VITE_DEMO_PAYMENTS, default demo) — the
 * money UI's badge must not depend on the shape of an unrelated HTTP route.
 *
 * Regression guard for: the badge used to be driven by `/api/feature-flags`,
 * which on the static host answers `404 application/json`; `r.json()` then
 * resolved to an object without `demoPayments`, so the badge silently vanished
 * on every money surface while payment behaviour was unchanged.
 */
test.describe('demo-mode badge is pinned, not fetched', () => {
  test('/marketplace renders the pinned badge and never calls /api/feature-flags', async ({ page }) => {
    const flagCalls: string[] = [];
    page.on('request', (request) => {
      if (request.url().includes('/api/feature-flags')) flagCalls.push(request.url());
    });

    await page.goto('/marketplace', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-demo-mode="pinned"]')).toBeVisible({ timeout: 20_000 });
    await expect(page.getByText(/Demo mode/i).first()).toBeVisible();
    expect(flagCalls).toEqual([]);
  });
});
