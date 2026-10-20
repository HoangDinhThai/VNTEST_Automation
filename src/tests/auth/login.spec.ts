import { test, expect } from '../../fixtures/base.fixture';
import { Logger } from '../../utils/logger';
import users from '../../../test-data/users.json';

test.describe('Module Đăng nhập - Hệ thống VNTEST LIMS', () => {
  test.beforeEach(async ({ loginPage }) => {
    Logger.step('Setup', 'Mở trang đăng nhập VNTEST LIMS');
    await loginPage.open('/dang-nhap');
    await expect(loginPage.heading).toBeVisible();
  });

  // ==========================================
  // KHỐI 01: BỐ CỤC & HIỂN THỊ
  // ==========================================
  test('TC_AUTH_001: Hiển thị đầy đủ các thành phần màn hình đăng nhập', {
    tag: ['@normal', '@minor']
  }, async ({ loginPage }) => {
    Logger.step(1, 'Kiểm tra hiển thị tiêu đề, mô tả và các trường nhập liệu');
    await expect(loginPage.heading).toBeVisible();
    await expect(loginPage.subtitle).toBeVisible();
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.rememberCheckbox).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
    await expect(loginPage.forgotPasswordButton).toBeVisible();
    await expect(loginPage.passwordToggleButton).toBeVisible();
  });

  // ==========================================
  // KHỐI 02: LUỒNG ĐĂNG NHẬP CHÍNH (AUTHENTICATION)
  // ==========================================
  test('TC_AUTH_002: Đăng nhập thành công với tài khoản quản trị viên', {
    tag: ['@high', '@critical']
  }, async ({ loginPage, dashboardPage, page }) => {
    Logger.step(1, 'Nhập Email quản trị viên');
    await loginPage.enterEmail(users.validUser.username);

    Logger.step(2, 'Nhập Mật khẩu hợp lệ');
    await loginPage.enterPassword(users.validUser.password);

    Logger.step(3, 'Nhấn nút "Đăng nhập"');
    await loginPage.clickLoginButton();

    Logger.step('Verify', 'Kiểm tra chuyển hướng về trang chủ Tổng quan và hiển thị Admin User');
    await expect(page).toHaveURL('https://vntest-lims.pirago.work/', { timeout: 15000 });
    await expect(dashboardPage.pageHeader).toBeVisible();
    await expect(dashboardPage.userNameBadge).toBeVisible();
  });

  test('TC_AUTH_003: Đăng nhập thành công khi nhấn phím Enter trên bàn phím', {
    tag: ['@normal', '@major']
  }, async ({ loginPage, dashboardPage, page }) => {
    Logger.step(1, 'Nhập Email hợp lệ');
    await loginPage.enterEmail(users.validUser.username);

    Logger.step(2, 'Nhập Mật khẩu hợp lệ');
    await loginPage.enterPassword(users.validUser.password);

    Logger.step(3, 'Nhấn phím "Enter" tại trường Mật khẩu');
    await loginPage.pressEnterOnPassword();

    Logger.step('Verify', 'Kiểm tra hệ thống tiếp nhận submit và chuyển hướng thành công');
    await expect(page).toHaveURL('https://vntest-lims.pirago.work/', { timeout: 15000 });
    await expect(dashboardPage.pageHeader).toBeVisible();
  });

  test('TC_AUTH_004: Đăng nhập thất bại khi nhập sai mật khẩu', {
    tag: ['@high', '@critical']
  }, async ({ loginPage }) => {
    Logger.step(1, 'Nhập Email hợp lệ nhưng mật khẩu sai');
    await loginPage.enterEmail(users.invalidPasswordUser.username);
    await loginPage.enterPassword(users.invalidPasswordUser.password);

    Logger.step(2, 'Nhấn nút "Đăng nhập"');
    await loginPage.clickLoginButton();

    Logger.step('Verify', 'Hiển thị thông báo "Email hoặc mật khẩu không đúng."');
    await expect(loginPage.globalErrorMessage).toBeVisible({ timeout: 10000 });
  });

  test('TC_AUTH_005: Đăng nhập thất bại khi Email không tồn tại', {
    tag: ['@high', '@major']
  }, async ({ loginPage }) => {
    Logger.step(1, 'Nhập Email không tồn tại trong hệ thống');
    await loginPage.enterEmail(users.nonExistentUser.username);
    await loginPage.enterPassword(users.nonExistentUser.password);

    Logger.step(2, 'Nhấn nút "Đăng nhập"');
    await loginPage.clickLoginButton();

    Logger.step('Verify', 'Hiển thị thông báo lỗi và không chuyển trang');
    await expect(loginPage.globalErrorMessage).toBeVisible({ timeout: 10000 });
    await expect(loginPage.loginButton).toBeVisible();
  });

  // ==========================================
  // KHỐI 03: KIỂM TRA TRƯỜNG EMAIL
  // ==========================================
  test('TC_AUTH_006: Bỏ trống trường Email', {
    tag: ['@high', '@major']
  }, async ({ loginPage }) => {
    Logger.step(1, 'Chỉ nhập mật khẩu và để trống Email');
    await loginPage.enterPassword(users.validUser.password);

    Logger.step(2, 'Nhấn nút "Đăng nhập"');
    await loginPage.clickLoginButton();

    Logger.step('Verify', 'Hiển thị thông báo lỗi "Vui lòng nhập email."');
    await expect(loginPage.emailErrorMessage).toBeVisible();
  });

  test('TC_AUTH_007: Nhập sai định dạng Email', {
    tag: ['@normal', '@minor']
  }, async ({ loginPage }) => {
    Logger.step(1, 'Nhập email không đúng định dạng');
    await loginPage.enterEmail('email_sai_dinh_dang');
    await loginPage.enterPassword(users.validUser.password);

    Logger.step(2, 'Nhấn nút "Đăng nhập"');
    await loginPage.clickLoginButton();

    Logger.step('Verify', 'Kiểm tra trạng thái vi phạm định dạng HTML5 email');
    const isTypeMismatch = await loginPage.emailInput.evaluate(
      (el: HTMLInputElement) => el.validity.typeMismatch
    );
    expect(isTypeMismatch).toBeTruthy();
  });

  // ==========================================
  // KHỐI 04: KIỂM TRA TRƯỜNG MẬT KHẨU
  // ==========================================
  test('TC_AUTH_008: Bỏ trống trường Mật khẩu', {
    tag: ['@high', '@major']
  }, async ({ loginPage }) => {
    Logger.step(1, 'Chỉ nhập Email và để trống Mật khẩu');
    await loginPage.enterEmail(users.validUser.username);

    Logger.step(2, 'Nhấn nút "Đăng nhập"');
    await loginPage.clickLoginButton();

    Logger.step('Verify', 'Hiển thị thông báo lỗi "Vui lòng nhập mật khẩu."');
    await expect(loginPage.passwordErrorMessage).toBeVisible();
  });

  test('TC_AUTH_009: Bỏ trống cả hai trường Email và Mật khẩu', {
    tag: ['@high', '@major']
  }, async ({ loginPage }) => {
    Logger.step(1, 'Không nhập cả hai trường và nhấn nút "Đăng nhập"');
    await loginPage.clickLoginButton();

    Logger.step('Verify', 'Hiển thị đồng thời 2 cảnh báo lỗi');
    await expect(loginPage.emailErrorMessage).toBeVisible();
    await expect(loginPage.passwordErrorMessage).toBeVisible();
  });

  test('TC_AUTH_010: Phân biệt chữ hoa và chữ thường của mật khẩu', {
    tag: ['@normal', '@major']
  }, async ({ loginPage }) => {
    Logger.step(1, 'Nhập mật khẩu bằng chữ thường (password1)');
    await loginPage.enterEmail(users.caseSensitiveUser.username);
    await loginPage.enterPassword(users.caseSensitiveUser.password);

    Logger.step(2, 'Nhấn nút "Đăng nhập"');
    await loginPage.clickLoginButton();

    Logger.step('Verify', 'Từ chối đăng nhập và báo lỗi');
    await expect(loginPage.globalErrorMessage).toBeVisible({ timeout: 10000 });
  });

  // ==========================================
  // KHỐI 05: TÍNH NĂNG PHỤ TRỢ & BẢO MẬT
  // ==========================================
  test('TC_AUTH_011: Mặc định ẩn mật khẩu dưới dạng dấu chấm', {
    tag: ['@high', '@major']
  }, async ({ loginPage }) => {
    Logger.step(1, 'Nhập mật khẩu');
    await loginPage.enterPassword('Password1');

    Logger.step('Verify', 'Thuộc tính type của ô Mật khẩu mặc định là "password"');
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
  });

  test('TC_AUTH_012: Nhấn biểu tượng hiển thị mật khẩu', {
    tag: ['@normal', '@minor']
  }, async ({ loginPage }) => {
    Logger.step(1, 'Nhập mật khẩu');
    await loginPage.enterPassword('Password1');

    Logger.step(2, 'Nhấn biểu tượng hiển thị mật khẩu lần 1');
    await loginPage.togglePasswordVisibility();
    Logger.step('Verify', 'Mật khẩu chuyển sang hiển thị dạng text');
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'text');

    Logger.step(3, 'Nhấn lại biểu tượng hiển thị mật khẩu lần 2');
    await loginPage.togglePasswordVisibility();
    Logger.step('Verify', 'Mật khẩu quay về dạng ẩn password');
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
  });

  test('TC_AUTH_013: Tích chọn ô "Ghi nhớ đăng nhập"', {
    tag: ['@low', '@minor']
  }, async ({ loginPage }) => {
    Logger.step(1, 'Tích chọn ô Ghi nhớ đăng nhập');
    await loginPage.checkRememberMe();

    Logger.step('Verify', 'Checkbox ở trạng thái đã được chọn (checked)');
    await expect(loginPage.rememberCheckbox).toBeChecked();

    Logger.step(2, 'Bỏ tích chọn ô Ghi nhớ đăng nhập');
    await loginPage.uncheckRememberMe();

    Logger.step('Verify', 'Checkbox ở trạng thái chưa được chọn (unchecked)');
    await expect(loginPage.rememberCheckbox).not.toBeChecked();
  });

  test('TC_AUTH_014: Điều hướng trực tiếp khi chưa đăng nhập (Auth Guard)', {
    tag: ['@high', '@critical']
  }, async ({ page }) => {
    Logger.step(1, 'Cố tình truy cập trang chủ / khi chưa đăng nhập');
    await page.goto('https://vntest-lims.pirago.work/');

    Logger.step('Verify', 'Hệ thống tự động chuyển hướng về trang /dang-nhap');
    await expect(page).toHaveURL(/.*dang-nhap.*/, { timeout: 10000 });
  });
});
