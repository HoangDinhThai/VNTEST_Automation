import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { Logger } from '../utils/logger';

/**
 * LoginPage: Đại diện cho màn hình đăng nhập hệ thống VNTEST LIMS
 * Tuân thủ mô hình POM chuẩn: Locators semantic ở đầu class, method mô tả hành vi người dùng, KHÔNG chứa assertion.
 */
export class LoginPage extends BasePage {
  readonly heading: Locator;
  readonly subtitle: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly rememberCheckbox: Locator;
  readonly loginButton: Locator;
  readonly forgotPasswordButton: Locator;
  readonly passwordToggleButton: Locator;
  readonly globalErrorMessage: Locator;
  readonly emailErrorMessage: Locator;
  readonly passwordErrorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: 'Đăng nhập' });
    this.subtitle = page.getByText('Nhập email và mật khẩu để tiếp tục.');
    this.emailInput = page.locator('#email');
    this.passwordInput = page.locator('#password');
    this.rememberCheckbox = page.locator('#remember');
    this.loginButton = page.locator('button[type="submit"]');
    this.forgotPasswordButton = page.getByRole('button', { name: /quên mật khẩu/i });
    this.passwordToggleButton = page.locator('button.login-icon-button');
    this.globalErrorMessage = page.getByText('Email hoặc mật khẩu không đúng.');
    this.emailErrorMessage = page.getByText('Vui lòng nhập email.');
    this.passwordErrorMessage = page.getByText('Vui lòng nhập mật khẩu.');
  }

  /**
   * Mở trang đăng nhập
   */
  async open(url = '/dang-nhap'): Promise<void> {
    await this.navigateTo(url);
  }

  /**
   * Nhập Email đăng nhập
   */
  async enterEmail(email: string): Promise<void> {
    Logger.info(`Nhập email: ${email}`);
    await this.emailInput.fill(email);
  }

  /**
   * Nhập Mật khẩu
   */
  async enterPassword(password: string): Promise<void> {
    Logger.info('Nhập mật khẩu');
    await this.passwordInput.fill(password);
  }

  /**
   * Nhấn phím Enter tại ô Mật khẩu để submit
   */
  async pressEnterOnPassword(): Promise<void> {
    Logger.info('Nhấn phím "Enter" trên bàn phím tại trường Mật khẩu');
    await this.passwordInput.press('Enter');
  }

  /**
   * Nhấn nút "Đăng nhập"
   */
  async clickLoginButton(): Promise<void> {
    Logger.info('Nhấn nút "Đăng nhập"');
    await this.loginButton.click();
  }

  /**
   * Bật/tắt ẩn hiện mật khẩu
   */
  async togglePasswordVisibility(): Promise<void> {
    Logger.info('Nhấn biểu tượng ẩn/hiện mật khẩu');
    await this.passwordToggleButton.click();
  }

  /**
   * Tích chọn ô Ghi nhớ đăng nhập
   */
  async checkRememberMe(): Promise<void> {
    Logger.info('Tích chọn ô "Ghi nhớ đăng nhập"');
    await this.rememberCheckbox.check();
  }

  /**
   * Bỏ tích chọn ô Ghi nhớ đăng nhập
   */
  async uncheckRememberMe(): Promise<void> {
    Logger.info('Bỏ tích chọn ô "Ghi nhớ đăng nhập"');
    await this.rememberCheckbox.uncheck();
  }

  /**
   * Thực hiện toàn bộ luồng đăng nhập
   */
  async login(email: string, password: string): Promise<void> {
    await this.enterEmail(email);
    await this.enterPassword(password);
    await this.clickLoginButton();
  }
}
