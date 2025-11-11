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

  /* Reporter */
  reporter: [['html', { open: 'never' }]],

  // Default options for all tests
  use: {
    baseURL: 'https://demoqa.com',
    viewport: { width, height },
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
},

  /* Configure browsers (Chrome + Firefox) */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    // Optional: uncomment to include Safari
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],

  // Optional: uncomment if testing local dev server later
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
