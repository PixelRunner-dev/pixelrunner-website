import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.route('**/api/v1/prices', (route) =>
    route.fulfill({ json: { USD: 64000, EUR: 55815 } })
  );
});

test('footer links navigate to separate privacy and terms pages', async ({ page }) => {
  await page.goto('/');

  await page.getByTestId('privacy-link').click();
  await expect(page).toHaveURL(/#\/privacy$/);
  await expect(page.getByRole('heading', { name: 'Privacy Policy', level: 1 })).toBeVisible();

  await page.goBack();
  await expect(page.getByRole('heading', { name: 'Pixel Runner', level: 1 })).toBeVisible();

  await page.getByTestId('terms-link').click();
  await expect(page).toHaveURL(/#\/terms$/);
  await expect(page.getByRole('heading', { name: 'Terms & Conditions', level: 1 })).toBeVisible();
});

test('documentation link points at the docs site', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('docs-link')).toHaveAttribute('href', 'https://docs.pixelrunner.dev');
});
