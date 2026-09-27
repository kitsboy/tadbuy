import { test, expect } from '@playwright/test';

test.describe('Buy Ads preview boundaries', () => {
  test('labels planning inputs and local draft as non-operational', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const skip = page.getByText('Skip for now', { exact: true });
    if (await skip.isVisible().catch(() => false)) await skip.click();
    await expect(page.getByRole('heading', { name: 'Campaign planning preview' })).toBeVisible({ timeout: 60_000 });

    await expect(page.getByText('Payment disabled in this preview')).toBeVisible();
    await expect(page.getByText('Local creative suggestion')).toBeVisible();
    await expect(page.getByText('Draft notes only', { exact: true })).toBeVisible();
    await expect(page.getByText('Planning assumptions · not reach')).toBeVisible();
    await expect(page.getByText('Unavailable in this preview').first()).toBeVisible();

    await page.getByRole('button', { name: 'Review local preview' }).click();
    await expect(page.getByText('This build cannot accept payment')).toBeVisible();
    await page.locator('input[type="checkbox"]').last().check();
    await page.getByRole('button', { name: 'Continue to local preview' }).click();
    await expect(page.getByRole('heading', { name: 'Campaign preview ready' })).toBeVisible();
    await expect(page.getByText('Not a payment receipt or campaign launch')).toBeVisible();
    await expect(page.getByText('Local preview · not saved as a campaign or receipt')).toBeVisible();
  });
});
