import { test, expect } from '@playwright/test';

test.describe('Buy Ads flow', () => {
  test('homepage loads Buy Ads wizard', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('main')).toBeVisible();
    await expect(page.getByText(/platform|campaign|Budget/i).first()).toBeVisible();
  });

  test('platforms query pre-selects platform', async ({ page }) => {
    await page.goto('/?platforms=nostr', { waitUntil: 'networkidle' });
    await expect(page.getByText('Nostr').first()).toBeVisible({ timeout: 60_000 });
  });

  test('command menu opens via header search chip', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: /Search/i }).click({ force: true });
    await expect(page.getByPlaceholder('Type a command or search...')).toBeVisible({ timeout: 20_000 });
  });

  test('command menu opens by keyboard and closes with Escape', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.keyboard.press('Control+k');
    await expect(page.getByRole('dialog', { name: 'Command menu' })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog', { name: 'Command menu' })).toHaveCount(0);
  });

  test('keyboard shortcut help is loaded on demand', async ({ page }) => {
    const helpRequests: string[] = [];
    page.on('request', request => {
      if (request.url().includes('KeyboardShortcutsDialog')) helpRequests.push(request.url());
    });
    await page.goto('/', { waitUntil: 'networkidle' });
    await expect.poll(() => helpRequests.length).toBe(0);
    await page.keyboard.press('?');
    await expect(page.getByRole('dialog', { name: 'Keyboard shortcuts' })).toBeVisible();
    expect(helpRequests).toHaveLength(1);
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog', { name: 'Keyboard shortcuts' })).toHaveCount(0);
  });
});