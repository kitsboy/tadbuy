import { test, expect } from '@playwright/test';

/**
 * The Buy Ads fee lines must never render a fee we did not measure.
 *
 * Regression guard for the current planning preview: public fee rates stay
 * unavailable when mempool.space is blocked, and no payment picker or checkout
 * presents an unmeasured fee as a quote. Fee data is informational only; this
 * build cannot create an invoice or payment request.
 *
 * Only the blocked-host half is asserted here: it needs no egress, so it is
 * deterministic in CI. The reachable half (the rendered value must equal
 * mempool.space's answer at that moment) is verified by the card's browser
 * probe, which cannot run hermetically.
 */

const FEE_HOST = '**://mempool.space/**';

async function openBuyAdsWithFeeHostBlocked(page: import('@playwright/test').Page) {
  await page.route(FEE_HOST, (route) => route.abort());
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  const skip = page.getByText('Skip for now', { exact: true });
  if (await skip.isVisible().catch(() => false)) await skip.click();

  // Buy Ads is a lazily-imported route and the dev server may still be
  // compiling it — poll the rendered body instead of asserting on one node.
  await expect
    .poll(
      async () => (await page.evaluate(() => document.body.innerText)).includes(
        'Fee rates unavailable from mempool.space right now'
      ),
      { timeout: 150_000, intervals: [2_000] }
    )
    .toBe(true);
}

test.describe('Buy Ads fee lines are measured or unavailable — never a placeholder', () => {
  // The first load compiles the lazily-imported Buy Ads route on a cold dev
  // server, which can take longer than Playwright's 30s default test timeout.
  test.describe.configure({ timeout: 180_000 });

  test('budget step shows no sat/vB (and no derived ₿ estimate) when the fee host is blocked', async ({ page }) => {
    await openBuyAdsWithFeeHostBlocked(page);

    const body = await page.evaluate(() => document.body.innerText);
    expect(body).not.toMatch(/sat\/vB/);
    expect(body).not.toMatch(/₿ est\./);
  });

  test('local preview confirmation makes no payment request and shows no fabricated fee quote', async ({ page }) => {
    await openBuyAdsWithFeeHostBlocked(page);
    await page.getByRole('button', { name: 'Review local preview' }).click();

    await expect(page.getByText('This build cannot accept payment')).toBeVisible();
    await expect(page.getByText(/No invoice, payment QR, on-chain request/)).toBeVisible();
    await expect(page.getByText(/Preview, not a payment authorization/)).toBeVisible();

    const body = await page.evaluate(() => document.body.innerText);
    expect(body).not.toMatch(/sat\/vB/);
    expect(body).not.toMatch(/Est\. fee for/);
    expect(body).not.toMatch(/Turbo 5|Fast 4|Std 3|Eco 2/);
  });
});
