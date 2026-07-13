import { test, expect } from '@playwright/test';

test.describe('Buy Ads flow', () => {
  test('homepage loads Buy Ads wizard', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('main')).toBeVisible();
    await expect(page.getByText(/platform|campaign|Budget/i).first()).toBeVisible();
  });

  test('platforms query pre-selects platform', async ({ page }) => {
    await page.goto('/?platforms=nostr');
    await expect(page.getByText('Nostr').first()).toBeVisible();
  });

  test('command menu opens via header search chip', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: /Search/i }).click({ force: true });
    await expect(page.getByPlaceholder('Type a command or search...')).toBeVisible({ timeout: 20_000 });
  });
});