import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  testDir: './src/tests',
  // Chạy tuần tự 1 worker cho module auth để tránh nghẽn server dev & xung đột session
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.RETRIES !== undefined ? parseInt(process.env.RETRIES) : (process.env.CI ? 2 : 0),
  workers: process.env.WORKERS ? parseInt(process.env.WORKERS) : 1,
  timeout: 60000,
  expect: {
    timeout: 15000,
  },
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['allure-playwright', { outputFolder: 'allure-results' }],
  ],
  use: {
    baseURL: process.env.BASE_URL || 'https://vntest-lims.pirago.work',
    // Rule: Viewport bắt buộc 1920x1080 cho desktop UI testing
    viewport: { width: 1920, height: 1080 },
    // Rule: Mở browser thật (headed) khi debug local, headless trên CI hoặc khi HEADLESS=true
    headless: process.env.HEADLESS !== undefined ? process.env.HEADLESS === 'true' : !!process.env.CI,
    launchOptions: {
      args: ['--ignore-certificate-errors'],
    },
    actionTimeout: 15000,
    navigationTimeout: 30000,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    ignoreHTTPSErrors: true,
  },
  // Chỉ cấu hình duy nhất Google Chrome (Chromium) theo yêu cầu
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
      },
    },
  ],
  outputDir: 'test-results',
});

