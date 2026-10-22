import { test as setup } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';
import users from '../../test-data/users.json';
import { Logger } from '../utils/logger';

const authDir = path.resolve(__dirname, '../../.auth');
const authFile = path.join(authDir, 'user.json');

setup('Authenticate once and generate storageState', async ({ page }) => {
  Logger.info('--- KHỞI TẠO PHIÊN ĐĂNG NHẬP CHUNG (GLOBAL AUTH SETUP) ---');

  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  const baseURL = process.env.BASE_URL || 'https://vntest-lims.pirago.work';
  const username = process.env.ADMIN_USERNAME || users.validUser.username;
  const password = process.env.ADMIN_PASSWORD || users.validUser.password;

  Logger.info(`Mở trang đăng nhập: ${baseURL}/dang-nhap`);
  await page.goto(`${baseURL}/dang-nhap`);

  Logger.info(`Điền thông tin đăng nhập: ${username}`);
  await page.locator('#email').fill(username);
  await page.locator('#password').fill(password);
  await page.locator('button[type="submit"]').click();

  Logger.info('Chờ xác thực đăng nhập thành công và lưu storageState...');
  await page.waitForURL(`${baseURL}/**`, { timeout: 20000 });
  await page.waitForTimeout(1000);

  await page.context().storageState({ path: authFile });
  Logger.info(`Đã lưu storageState vào: ${authFile}`);
});

