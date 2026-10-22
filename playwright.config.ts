import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '.env') });

const authDir = path.resolve(__dirname, '.auth');
const authFile = path.join(authDir, 'user.json');
if (!fs.existsSync(authDir)) {
  fs.mkdirSync(authDir, { recursive: true });
}
if (!fs.existsSync(authFile)) {
  fs.writeFileSync(authFile, JSON.stringify({ cookies: [], origins: [] }));
}

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
  // Cấu hình các projects: Setup Authentication 1 lần, Auth Specs độc lập, và Toàn bộ Specs chức năng
  projects: [
    // 1. Chạy xác thực 1 lần duy nhất để tạo storageState
    {
      name: 'setup',
      testMatch: /.*auth\.setup\.ts/,
    },
    // 2. Chạy riêng bộ kiểm thử Đăng nhập (không dùng storageState để kiểm tra form login)
    {
      name: 'auth-spec',
      testMatch: /src\/tests\/auth\/.*\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
      },
    },
    // 3. Chạy toàn bộ các test suite chức năng với storageState tái sử dụng
    {
      name: 'chromium',
      testIgnore: [/src\/tests\/auth\/.*\.spec\.ts/, /.*auth\.setup\.ts/],
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        storageState: authFile,
      },
    },
  ],
  outputDir: 'test-results',
});

