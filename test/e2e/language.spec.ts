import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.route('**/api/v1/prices', (route) =>
    route.fulfill({ json: { USD: 64000, EUR: 55815 } })
  );
});

test('switching language translates the page and persists across reload', async ({ page }) => {
  await page.goto('/');

  // Default English.
  await expect(page.getByRole('heading', { name: 'Where to buy' })).toBeVisible();

  await page.getByTestId('language-select').selectOption('nl');

  // Dutch copy now renders.
  await expect(page.getByRole('heading', { name: 'Waar te koop' })).toBeVisible();

  // Choice persists after a reload.
  await page.reload();
  await expect(page.getByTestId('language-select')).toHaveValue('nl');
  await expect(page.getByRole('heading', { name: 'Waar te koop' })).toBeVisible();
});
