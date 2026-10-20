import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { DashboardPage } from '../pages/dashboard.page';

// Định nghĩa kiểu dữ liệu cho custom fixtures
type CustomFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
};

/**
 * Mở rộng test của Playwright với các Page Objects được khởi tạo sẵn
 */
export const test = base.extend<CustomFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },
  dashboardPage: async ({ page }, use) => {
    const dashboardPage = new DashboardPage(page);
    await use(dashboardPage);
  },
});

export { expect };

