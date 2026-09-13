import { test, expect } from '@playwright/test';

const publicRoutes = ['/', '/marketplace', '/platforms', '/compare', '/404'];

test.describe('public route smoke checks', () => {
  for (const route of publicRoutes) {
    test(`${route} renders without a route error`, async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      await page.goto(route, { waitUntil: 'domcontentloaded' });
      await expect(page.locator('#main-content')).toBeVisible({ timeout: 20_000 });
      await expect(page.getByText('Something went wrong')).toHaveCount(0);
      expect(errors).toEqual([]);
    });
  }
});
