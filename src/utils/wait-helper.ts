import { Page, Locator } from '@playwright/test';

/**
 * Helper hỗ trợ Smart Wait trong Playwright
 * TUYỆT ĐỐI KHÔNG dùng sleep/hard timeout cố định
 */
export class WaitHelper {
  /**
   * Chờ trang hoàn tất tải tài nguyên (DOM + Network idle)
   */
  public static async waitForPageLoaded(page: Page): Promise<void> {
    await page.waitForLoadState('domcontentloaded');
  }

  /**
   * Chờ element ở trạng thái hiển thị (visible)
   */
  public static async waitForVisible(locator: Locator, timeout = 10000): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout });
  }

  /**
   * Chờ element ẩn hoặc biến mất khỏi DOM (hidden)
   */
  public static async waitForHidden(locator: Locator, timeout = 10000): Promise<void> {
    await locator.waitFor({ state: 'hidden', timeout });
  }
}

