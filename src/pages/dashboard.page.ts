import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * DashboardPage: Đại diện cho màn hình Tổng quan / Dashboard VNTEST LIMS sau khi đăng nhập
 */
export class DashboardPage extends BasePage {
  readonly brandLogo: Locator;
  readonly pageHeader: Locator;
  readonly userNameBadge: Locator;

  constructor(page: Page) {
    super(page);
    this.brandLogo = page.getByText('VNTEST').first();
    this.pageHeader = page.getByText('TỔNG QUAN').first();
    this.userNameBadge = page.getByText('Admin User').first();
  }
}
