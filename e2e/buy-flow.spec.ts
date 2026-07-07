/**
 * Basic buy-flow smoke tests.
 * Install optional devDependency: npm i -D @playwright/test && npx playwright install
 *
 * Skip entire file when Playwright is not installed (CI without e2e).
 */
// @ts-nocheck

let playwrightAvailable = false;
try {
  require.resolve('@playwright/test');
  playwrightAvailable = true;
} catch {
  playwrightAvailable = false;
}

if (playwrightAvailable) {
  const { test, expect } = require('@playwright/test');

  test.describe('Buy Ads flow', () => {
    test('homepage loads Buy Ads wizard', async ({ page }) => {
      await page.goto('/');
      await expect(page.getByRole('main')).toBeVisible();
      await expect(page.getByText(/Buy Ads|campaign/i).first()).toBeVisible();
    });

    test('command menu opens with keyboard shortcut', async ({ page }) => {
      await page.goto('/');
      const mod = process.platform === 'darwin' ? 'Meta' : 'Control';
      await page.keyboard.press(`${mod}+KeyK`);
      await expect(page.getByPlaceholder(/command|search/i)).toBeVisible();
    });
  });
}