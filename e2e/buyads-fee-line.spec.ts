import { test, expect } from '@playwright/test';

/**
 * The Buy Ads fee lines must never render a fee we did not measure.
 *
 * Regression guard for: `BuyAds.tsx` initialised its `mempoolFees` state to a
 * hardcoded `{ fastestFee: 5, halfHourFee: 4, hourFee: 3 }` and assigned any
 * JSON body straight from the fetch, so the payment step's Network Fee card
 * rendered `~0.00000700 ₿ / Estimated (5 sat/vB)` with mempool.space blocked,
 * and `~NaN ₿ / Estimated (undefined sat/vB)` against a reshaped (404 JSON)
 * response — an invented number shown as a measurement. `FeeEstimator` (the
 * on-chain rate picker on the "Pay with" step) carried its own private copy of
 * the same hardcoded `{ 5, 4, 3, 2 }` and its own fetch, so selecting Bitcoin
 * re-introduced the placeholder. All of them now read the one live source
 * (`useMempoolFees`), which holds `null` until a complete, positive snapshot is
 * accepted, and render an explicit unavailable state otherwise.
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

  test('the on-chain rate picker shows no invented sat/vB when the fee host is blocked', async ({ page }) => {
    await openBuyAdsWithFeeHostBlocked(page);

    // "Pay with" step → Bitcoin (on-chain) renders FeeEstimator.
    await page.getByRole('button', { name: /Bitcoin/ }).first().click();

    await expect
      .poll(
        async () => (await page.evaluate(() => document.body.innerText)).includes(
          'No estimate is shown for a rate we have not measured'
        ),
        { timeout: 30_000, intervals: [1_000] }
      )
      .toBe(true);

    const body = await page.evaluate(() => document.body.innerText);
    expect(body).not.toMatch(/sat\/vB/);
    expect(body).not.toMatch(/Est\. fee for/);
    // The old hardcoded placeholder rates must not appear anywhere.
    expect(body).not.toMatch(/Turbo 5|Fast 4|Std 3|Eco 2/);
  });
});
