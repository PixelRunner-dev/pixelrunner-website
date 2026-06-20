import { expect, test } from '@playwright/test';

// Deterministic price so the badge renders a known sats figure.
test.beforeEach(async ({ page }) => {
  await page.route('**/api/v1/prices', (route) =>
    route.fulfill({ json: { USD: 64000, EUR: 55815 } })
  );
});

test.skip('home page loads with hero, price and applets', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByTestId('hero-title')).toBeVisible();

  const heroCta = page.getByTestId('hero-cta-buy');
  await expect(heroCta).toBeVisible();

  const badge = page.getByTestId('price-badge');
  await expect(badge.getByTestId('price-eur')).toBeVisible();
  await expect(badge.getByTestId('sats')).toHaveText('376 300');
});

test('applet thumbnails point at the CDN url pattern', async ({ page }) => {
  await page.goto('/');
  const firstImg = page.locator('[data-test="applet-grid"] img').first();
  await expect(firstImg).toHaveAttribute(
    'src',
    /^https:\/\/applets\.pixelrunner\.dev\/[^/]+\.webp$/
  );
});

test('skip link is the first focusable element and targets #main', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  const skip = page.locator('a.skip-link');
  await expect(skip).toBeFocused();
  await expect(skip).toHaveAttribute('href', '#main');
});

test('html lang attribute reflects the active language', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');

  await page.getByTestId('language-select').selectOption('nl');
  await expect(page.locator('html')).toHaveAttribute('lang', 'nl');
});
