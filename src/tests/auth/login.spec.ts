import { test, expect } from '../../fixtures/base.fixture';
import { Logger } from '../../utils/logger';
import users from '../../../test-data/users.json';

test.describe('Module Đăng nhập', () => {
  test.beforeEach(async ({ loginPage }) => {
    Logger.step('Setup', 'Mở trang đăng nhập');
    await loginPage.open();
  });

  test('Đăng nhập thành công với tài khoản hợp lệ', async ({ loginPage, dashboardPage }) => {
    Logger.step(1, 'Nhập tên đăng nhập hợp lệ');
    await loginPage.enterUsername(users.validUser.username);

    Logger.step(2, 'Nhập mật khẩu hợp lệ');
    await loginPage.enterPassword(users.validUser.password);

    Logger.step(3, 'Nhấn nút "Đăng nhập"');
    await loginPage.clickLoginButton();

    Logger.step('Verify', 'Kiểm tra đăng nhập thành công và hiển thị Dashboard');
    // Web-First assertion
    await expect(dashboardPage.welcomeHeading.or(dashboardPage.userProfileButton)).toBeVisible({
      timeout: 10000,
    });
  });

  test('Đăng nhập thất bại khi nhập sai mật khẩu', async ({ loginPage }) => {
    Logger.step(1, 'Nhập tài khoản đúng nhưng mật khẩu sai');
    await loginPage.enterUsername(users.invalidUser.username);
    await loginPage.enterPassword(users.invalidUser.password);

    Logger.step(2, 'Nhấn nút "Đăng nhập"');
    await loginPage.clickLoginButton();

    Logger.step('Verify', 'Hiển thị thông báo lỗi');
    await expect(loginPage.errorMessage).toBeVisible();
  });

  test('Bỏ trống tên đăng nhập và mật khẩu', async ({ loginPage }) => {
    Logger.step(1, 'Không nhập tài khoản và mật khẩu, nhấn nút "Đăng nhập"');
    await loginPage.clickLoginButton();

    Logger.step('Verify', 'Vẫn ở trang đăng nhập hoặc hiển thị cảnh báo');
    await expect(loginPage.loginButton).toBeVisible();
  });
});

