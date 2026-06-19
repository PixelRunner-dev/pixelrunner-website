import { expect, test } from '@playwright/test';

test('price fetch failure keeps €210 and shows a dash for sats', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (err) => errors.push(err.message));

  await page.route('**/api/v1/prices', (route) => route.abort());
  await page.goto('/');

  const badge = page.getByTestId('price-badge');
  await expect(badge).toContainText('€210');
  await expect(badge.getByTestId('sats')).toHaveText('—');
  await expect(badge.locator('.price-stale')).toBeVisible();

  expect(errors).toEqual([]);
});
