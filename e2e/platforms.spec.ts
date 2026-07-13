import { test, expect } from '@playwright/test';

test.describe('Platforms hub', () => {
  test('platforms index lists all 8 networks', async ({ page }) => {
    await page.goto('/platforms', { waitUntil: 'networkidle' });
    await expect(page.getByText('Ad Platforms Hub')).toBeVisible({ timeout: 20_000 });
    await expect(page.getByText('Twitter/X').first()).toBeVisible();
    await expect(page.getByText('Nostr').first()).toBeVisible();
    await expect(page.getByText('TikTok').first()).toBeVisible();
  });

  test('platform detail page loads', async ({ page }) => {
    await page.goto('/platforms/nostr');
    await expect(page.locator('h1')).toContainText('Nostr', { timeout: 15_000 });
    await expect(page.getByText(/ZAP|Bitcoin/i).first()).toBeVisible();
  });

  test('compare page has per-platform table', async ({ page }) => {
    await page.goto('/compare');
    await expect(page.getByText('Per-platform')).toBeVisible();
    await expect(page.getByRole('link', { name: 'LinkedIn' })).toBeVisible();
  });
});