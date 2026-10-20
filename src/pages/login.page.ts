import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { Logger } from '../utils/logger';

/**
 * LoginPage: Đại diện cho màn hình đăng nhập
 * Tuân thủ quy chuẩn: Locators khai báo ở đầu class, method mô tả hành vi người dùng, KHÔNG chứa assertion.
 */
export class LoginPage extends BasePage {
  // Locators tuân thủ thứ tự ưu tiên: getByRole, getByLabel, getByPlaceholder...
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.getByRole('textbox', { name: /tên đăng nhập|username|email/i })
      .or(page.getByPlaceholder(/tên đăng nhập|username|email/i))
      .or(page.locator('input[type="text"], input[type="email"]'));

    this.passwordInput = page.getByRole('textbox', { name: /mật khẩu|password/i })
      .or(page.getByPlaceholder(/mật khẩu|password/i))
      .or(page.locator('input[type="password"]'));

    this.loginButton = page.getByRole('button', { name: /đăng nhập|login|sign in/i });
    this.errorMessage = page.getByRole('alert')
      .or(page.locator('.alert-danger, .error-message, .ant-message-error'));
    this.successMessage = page.locator('.alert-success, .success-message, .ant-message-success');
  }

  /**
   * Mở trang đăng nhập
   */
  async open(url = '/login'): Promise<void> {
    await this.navigateTo(url);
  }

  /**
   * Nhập tên đăng nhập
   */
  async enterUsername(username: string): Promise<void> {
    Logger.info(`Nhập username: ${username}`);
    await this.usernameInput.fill(username);
  }

  /**
   * Nhập mật khẩu
   */
  async enterPassword(password: string): Promise<void> {
    Logger.info('Nhập mật khẩu');
    await this.passwordInput.fill(password);
  }

  /**
   * Nhấn nút đăng nhập
   */
  async clickLoginButton(): Promise<void> {
    Logger.info('Nhấn nút "Đăng nhập"');
    await this.loginButton.click();
  }

  /**
   * Thực hiện toàn bộ luồng đăng nhập
   */
  async login(username: string, password: string): Promise<void> {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLoginButton();
  }
}

