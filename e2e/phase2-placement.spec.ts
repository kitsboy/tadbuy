import { test, expect } from '@playwright/test';

test.describe('Phase 2 community placement pilot', () => {
  test.setTimeout(90_000);

  test('moves a vendor-assisted request through the proof lifecycle', async ({ page }) => {
    await page.goto('/marketplace', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'Request placement' }).first().click();

    await expect(page.getByRole('heading', { name: 'Request this community placement' })).toBeVisible();
    await page.getByLabel('Advertiser or project name').fill('Give A Bit pilot');
    await page.getByLabel('Message to vendor').fill('Please review this community placement for the next approved issue.');
    await page.getByRole('button', { name: 'Send placement request' }).click();

    await expect(page.getByText('Placement request saved for vendor review')).toBeVisible();
    await page.goto('/publisher', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { name: 'Publisher Portal' })).toBeVisible({ timeout: 60_000 });
    await expect(page.getByText('Community placement requests')).toBeVisible({ timeout: 20_000 });
    await expect(page.getByText('Give A Bit pilot')).toBeVisible();

    await page.getByRole('button', { name: 'Accept request' }).click();
    await expect(page.getByLabel('Placement delivery status').getByText('Accepted', { exact: true })).toBeVisible();

    await page.getByRole('button', { name: 'Mark published' }).click();
    await expect(page.getByLabel('Placement delivery status').getByText('Published', { exact: true })).toBeVisible();

    await page.getByRole('button', { name: 'Submit proof' }).click();
    await page.getByLabel('Published URL or event reference').fill('https://community.example/pilot-proof');
    await page.getByLabel('Screenshot reference').fill('pilot-proof.png');
    await page.getByLabel('Vendor note').fill('Sponsored placement disclosed according to community rules.');
    await page.getByLabel('I confirm the sponsorship disclosure was applied according to the community or property rules.').check();
    await page.getByRole('button', { name: 'Submit proof' }).click();
    await expect(page.getByLabel('Placement delivery status').getByText('Proof submitted', { exact: true })).toBeVisible();

    await page.getByRole('button', { name: 'Mark proof reviewed' }).click();
    await expect(page.getByLabel('Placement delivery status').getByText('Verified', { exact: true })).toBeVisible();
    await expect(page.getByText('Submitted evidence')).toBeVisible();
    await expect(page.getByText('Sponsorship disclosure confirmed')).toBeVisible();
    await expect(page.getByText('https://community.example/pilot-proof')).toBeVisible();
    await expect(page.getByText('Sponsored placement disclosed according to community rules.')).toBeVisible();
  });
});
