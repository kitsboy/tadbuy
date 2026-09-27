import { test, expect } from '@playwright/test';

test.describe('Marketplace sample placement preview', () => {
  test('saves a local-only example and does not expose vendor lifecycle actions', async ({ page }) => {
    await page.goto('/marketplace', { waitUntil: 'networkidle' });

    await expect(page.getByTestId('marketplace-sample-notice')).toContainText('sample listings only');
    await expect(page.getByTestId('marketplace-sample-notice')).toContainText('no vendor is contacted');
    await page.getByRole('button', { name: 'Preview request' }).first().click();

    await expect(page.getByRole('heading', { name: 'Preview a placement request' })).toBeVisible();
    await page.getByLabel('Advertiser or project name').fill('Example advertiser');
    await page.getByLabel('Example message · not sent').fill('This is a local sample only.');
    await page.getByRole('button', { name: 'Save local preview' }).click();

    await expect(page.getByText('Sample request saved locally — no vendor was notified and no payment was made.')).toBeVisible();
    await page.goto('/publisher', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { name: 'Publisher Portal' })).toBeVisible({ timeout: 60_000 });
    await expect(page.getByText('Local sample · simulation only')).toBeVisible({ timeout: 20_000 });
    await expect(page.getByText('No vendor response, delivery state, or evidence record exists.')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Accept request' })).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Mark published' })).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Submit proof' })).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Mark proof reviewed' })).toHaveCount(0);
  });
});
