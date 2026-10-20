import { Page, Locator } from '@playwright/test';
import { Logger } from '../utils/logger';
import { WaitHelper } from '../utils/wait-helper';

/**
 * BasePage: Lớp cơ sở cho toàn bộ Page Objects
 * Chứa các phương thức tương tác UI chung.
 * TUYỆT ĐỐI KHÔNG chứa assertions trong Page Object!
 */
export abstract class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Điều hướng tới một đường dẫn tương đối hoặc tuyệt đối
   */
  async navigateTo(path = ''): Promise<void> {
    Logger.info(`Điều hướng tới: ${path || '/'}`);
    await this.page.goto(path);
    await WaitHelper.waitForPageLoaded(this.page);
  }

  /**
   * Lấy tiêu đề trang hiện tại
   */
  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Lấy URL hiện tại
   */
  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  /**
   * Chụp ảnh màn hình lưu vào buffer hoặc file
   */
  async takeScreenshot(name: string): Promise<Buffer> {
    Logger.info(`Chụp màn hình: ${name}`);
    return await this.page.screenshot({
      path: `test-results/screenshots/${name}_${Date.now()}.png`,
      fullPage: true,
    });
  }

  /**
   * Cuộn đến vị trí element
   */
  async scrollToElement(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
  }
}

