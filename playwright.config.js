// @ts-check
import { defineConfig, devices } from '@playwright/test';

// dynamically adjust viewport from environment
const width = parseInt(process.env.VIEWPORT_WIDTH || '1920', 10);
const height = parseInt(process.env.VIEWPORT_HEIGHT || '1080', 10);

export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,

  /* Fail build if .only left on CI */
  forbidOnly: !!process.env.CI,

  /* Retry failed tests on CI */
  retries: process.env.CI ? 2 : 0,

  /* Worker threads */
  workers: process.env.CI ? 2 : undefined,

  grep: /@runThis/,  // Это будет фильтровать ВСЕ тесты с тегом @runThis


  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results.json' }],
    ['junit', { outputFile: 'test-results.xml' }]
  ],

  // Default options for all tests
  use: {
    baseURL: 'https://demoqa.com',
    viewport: { width, height },
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
    actionTimeout: 10000,
    navigationTimeout: 30000,
    extraHTTPHeaders: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  },

  /* Configure browsers (Chrome + Firefox) */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], viewport: { width, height } },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'], viewport: { width, height } },
    },
    // Optional: uncomment to include Safari
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
