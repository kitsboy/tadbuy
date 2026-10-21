import { test, expect } from '@playwright/test';

test.describe('preview readiness and launch boundaries', () => {
  test.setTimeout(120_000);
  test('campaign preview shows readiness and never claims a live payment', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.getByTestId('preview-readiness-panel').first()).toBeVisible({ timeout: 60_000 });
    await expect(page.getByTestId('preview-readiness-panel').first()).toContainText('No live buying or settlement');
    await expect(page.getByRole('heading', { name: 'Campaign planning preview' })).toBeVisible();
    await expect(page.getByText('Payment disabled in this preview', { exact: true })).toBeVisible();
  });

  test('publisher workspace contains no fabricated revenue, payout, or embed actions', async ({ page }) => {
    await page.goto('/publisher', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { name: 'Publisher workspace' })).toBeVisible({ timeout: 60_000 });
    await expect(page.getByTestId('preview-readiness-panel')).toBeVisible();
    await expect(page.getByText('No live publisher supply or earnings data')).toBeVisible();
    await expect(page.getByRole('button', { name: /withdraw/i })).toHaveCount(0);
    await expect(page.getByText(/^(Total Revenue|Earnings Trend|Payout History|Embed Code)$/i)).toHaveCount(0);
  });

  test('geo planning labels static values as examples and does not claim live activity', async ({ page }) => {
    await page.goto('/geo', { waitUntil: 'domcontentloaded' });
    const sampleNotice = page.locator('.geo-sample-data-notice');
    await expect(sampleNotice).toBeVisible({ timeout: 60_000 });
    await expect(sampleNotice).toContainText('not live Tadbuy results');
    await expect(page.getByText('Sample map · not live')).toBeVisible();
    await expect(page.getByText('Example spend by market (USD)')).toBeVisible();
    await expect(page.getByText('LIVE', { exact: true })).toHaveCount(0);
  });

  test('measurement page reports data sources as unavailable, not measured sample metrics', async ({ page }) => {
    await page.goto('/metrics', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { name: 'Measurement readiness' })).toBeVisible({ timeout: 60_000 });
    await expect(page.getByText('No live campaign reporting is connected')).toBeVisible();
    await expect(page.locator('[data-testid="metric-unavailable-card"]')).toHaveCount(4);
    await expect(page.getByText('1.24M')).toHaveCount(0);
  });
});
