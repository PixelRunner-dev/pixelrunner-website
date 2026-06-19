import process from 'node:process';
import { defineConfig, devices } from '@playwright/test';

// See https://playwright.dev/docs/test-configuration.
export default defineConfig({
  testDir: './test/e2e',
  timeout: 30 * 1000,
  expect: { timeout: 5000 },
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.GITHUB_ACTIONS ? [['github'], ['html']] : [['html'], ['line']],
  use: {
    baseURL: 'http://localhost:4173',
    testIdAttribute: 'data-test',
    trace: 'on-first-retry',
    headless: !!process.env.CI
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  // Build once, serve the static preview — deterministic and close to production.
  webServer: {
    command: 'npm run build && npm run preview -- --port 4173 --strictPort',
    port: 4173,
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI
  }
});
