import { test, expect } from '@playwright/test';

const publicRoutes = ['/', '/marketplace', '/platforms', '/compare', '/404'];

test.describe('public route smoke checks', () => {
  for (const route of publicRoutes) {
    test(`${route} renders without a route error or loading Firebase`, async ({ page }) => {
      const errors: string[] = [];
      const firebaseRequests: string[] = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('request', request => {
        if (request.url().includes('/assets/vendor-firebase-')) firebaseRequests.push(request.url());
      });

      await page.goto(route, { waitUntil: 'domcontentloaded' });
      await expect(page.locator('#main-content')).toBeVisible({ timeout: 20_000 });
      await expect(page.getByText('Something went wrong')).toHaveCount(0);
      expect(errors).toEqual([]);
      expect(firebaseRequests).toEqual([]);
    });
  }

  test('marketplace sample inventory is visible on first render', async ({ page }) => {
    await page.goto('/marketplace', { waitUntil: 'domcontentloaded' });
    await expect(page.getByText('Sample · not live').first()).toBeVisible({ timeout: 20_000 });
    await expect(page.getByText('Sample · not live').first()).toBeVisible({ timeout: 300 });
  });
});
