import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.route('**/api/v1/prices', (route) =>
    route.fulfill({ json: { USD: 64000, EUR: 55815 } })
  );
});

test('selecting a category tab filters the applet grid', async ({ page }) => {
  await page.goto('/');

  const cards = page.locator('[data-test="applet-grid"] .applet');
  const allCount = await cards.count();

  await page.locator('[data-tag="clock"]').click();
  await expect(page.locator('[data-tag="clock"]')).toHaveClass(/tab-active/);

  const filtered = await cards.count();
  expect(filtered).toBeGreaterThan(0);
  expect(filtered).toBeLessThan(allCount);
});
