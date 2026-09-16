import { test, expect } from '@playwright/test';

/**
 * The Buy Ads fee lines must never render a fee we did not measure.
 *
 * Regression guard for: `BuyAds.tsx` initialised its `mempoolFees` state to a
 * hardcoded `{ fastestFee: 5, halfHourFee: 4, hourFee: 3 }` and assigned any
 * JSON body straight from the fetch, so the payment step's Network Fee card
 * rendered `~0.00000700 ₿ / Estimated (5 sat/vB)` with mempool.space blocked,
 * and `~NaN ₿ / Estimated (undefined sat/vB)` against a reshaped (404 JSON)
 * response — an invented number shown as a measurement. Both now render the
 * explicit unavailable state, because `useMempoolFees` holds `null` until a
 * complete, positive snapshot is accepted.
 *
 * Only the blocked-host half is asserted here: it needs no egress, so it is
 * deterministic in CI. The reachable half (the rendered value must equal
 * mempool.space's answer at that moment) is verified by the card's browser
 * probe, which cannot run hermetically.
 */
test.describe('Buy Ads fee lines are measured or unavailable — never a placeholder', () => {
  test('budget step shows no sat/vB (and no derived ₿ estimate) when the fee host is blocked', async ({ page }) => {
    await page.route('**://mempool.space/**', (route) => route.abort());

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

    const body = await page.evaluate(() => document.body.innerText);
    expect(body).not.toMatch(/sat\/vB/);
    expect(body).not.toMatch(/₿ est\./);
  });
});
