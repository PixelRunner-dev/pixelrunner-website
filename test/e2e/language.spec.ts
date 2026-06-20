import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.route('**/api/v1/prices', (route) =>
    route.fulfill({ json: { USD: 64000, EUR: 55815 } })
  );
});

test('switching language updates html lang and persists across reload', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('html')).toHaveAttribute('lang', 'en');

  await page.getByTestId('language-select').selectOption('nl');
  await expect(page.locator('html')).toHaveAttribute('lang', 'nl');

  await page.reload();
  await expect(page.getByTestId('language-select')).toHaveValue('nl');
  await expect(page.locator('html')).toHaveAttribute('lang', 'nl');
});
