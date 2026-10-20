import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { Logger } from '../utils/logger';

/**
 * DashboardPage: Đại diện cho màn hình trang chủ / bảng điều khiển sau khi đăng nhập
 */
export class DashboardPage extends BasePage {
  readonly welcomeHeading: Locator;
  readonly userProfileButton: Locator;
  readonly logoutButton: Locator;
  readonly sidebarMenu: Locator;

  constructor(page: Page) {
    super(page);
    this.welcomeHeading = page.getByRole('heading', { level: 1 })
      .or(page.locator('.dashboard-title, .page-header'));
    this.userProfileButton = page.getByRole('button', { name: /tài khoản|profile|user/i })
      .or(page.locator('.user-avatar, .profile-dropdown'));
    this.logoutButton = page.getByRole('menuitem', { name: /đăng xuất|logout|sign out/i })
      .or(page.getByRole('button', { name: /đăng xuất|logout|sign out/i }));
    this.sidebarMenu = page.getByRole('navigation')
      .or(page.locator('.sidebar, .ant-layout-sider'));
  }

  /**
   * Mở menu người dùng
   */
  async openUserProfile(): Promise<void> {
    Logger.info('Mở menu thông tin người dùng');
    await this.userProfileButton.click();
  }

  /**
   * Đăng xuất khỏi hệ thống
   */
  async logout(): Promise<void> {
    Logger.info('Thực hiện đăng xuất');
    await this.openUserProfile();
    await this.logoutButton.click();
  }
}

