import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Page Object cho màn hình Giao việc (/giao-viec - Tab GIAO VIỆC)
 */
export class TaskAssignmentPage extends BasePage {
  // Navigation Tabs
  readonly tabGiaoViec: Locator;
  readonly tabHoSoTN: Locator;
  readonly tabTruongBPKtra: Locator;
  readonly tabQlyCTTinh: Locator;

  // Header Utility Buttons
  readonly btnPrint: Locator;
  readonly btnImport: Locator;
  readonly btnExport: Locator;
  readonly btnHelp: Locator;

  // Topbar Status Chips
  readonly chipChuaGiaoViec: Locator;
  readonly chipDangLam: Locator;
  readonly chipTreHan: Locator;
  readonly chipKiemNhanh: Locator;
  readonly chipThieuHS: Locator;

  // Date Filter (.from-to-date-filter)
  readonly dateTypeTrigger: Locator;
  readonly dateFromTrigger: Locator;
  readonly dateToTrigger: Locator;
  readonly dateClearButton: Locator;
  readonly dateCalendar: Locator;

  // Search & Action Bar
  readonly searchInput: Locator;
  readonly clearFilterButton: Locator;
  readonly btnTaoHoSoNK: Locator;

  // List Toolbar & Accordion Controls
  readonly toolbarInfo: Locator;
  readonly btnExpandAll: Locator;
  readonly btnCollapseAll: Locator;

  // YCTN Cards, Sample Blocks & Criteria Table
  readonly yctnCards: Locator;
  readonly sampleBlocks: Locator;
  readonly ctTables: Locator;
  readonly ctRows: Locator;

  // Reassign KNV Warning Modal (Ảnh 1)
  readonly reassignModal: Locator;
  readonly reassignTitle: Locator;
  readonly reassignMessage: Locator;
  readonly reassignDetails: Locator;
  readonly btnReassignCancel: Locator;
  readonly btnReassignConfirm: Locator;
  readonly btnReassignClose: Locator;

  // Create Hồ sơ TN Modal (Ảnh 2 & Khối 6)
  readonly nkModal: Locator;
  readonly nkModalAlert: Locator;
  readonly nkModalWarning: Locator;
  readonly nkModalInfo: Locator;
  readonly nkGroups: Locator;
  readonly btnNkCancel: Locator;
  readonly btnNkConfirm: Locator;
  readonly btnNkClose: Locator;

  constructor(page: Page) {
    super(page);

    // Tabs
    this.tabGiaoViec = page.locator('header.header .tabs button.tab', { hasText: /Giao Việc/i });
    this.tabHoSoTN = page.locator('header.header .tabs button.tab', { hasText: /Hồ sơ TN/i });
    this.tabTruongBPKtra = page.locator('header.header .tabs button.tab', { hasText: /Trưởng BP ktra/i });
    this.tabQlyCTTinh = page.locator('header.header .tabs button.tab', { hasText: /Qly CT tính/i });

    // Header right buttons
    this.btnPrint = page.locator('header.header .header-right button[title="In thông tin YCTN đã chọn"]');
    this.btnImport = page.locator('header.header .header-right button[title="Import KQ từ file Excel"]');
    this.btnExport = page.locator('header.header .header-right button[title="Export YCTN ra Excel"]');
    this.btnHelp = page.locator('header.header .header-right button.help-btn');

    // Status chips
    this.chipChuaGiaoViec = page.locator('.bg-topbar button.bg-chiptab', { hasText: 'Chưa giao việc' });
    this.chipDangLam = page.locator('.bg-topbar button.bg-chiptab', { hasText: 'Đang làm' });
    this.chipTreHan = page.locator('.bg-topbar button.bg-chiptab', { hasText: 'Trễ hạn' });
    this.chipKiemNhanh = page.locator('.bg-topbar button.bg-chiptab', { hasText: 'Kiểm nhanh' });
    this.chipThieuHS = page.locator('.bg-topbar button.bg-chiptab', { hasText: 'Thiếu HS' });

    // Date filter
    this.dateTypeTrigger = page.locator('button.from-to-date-filter__label-trigger');
    this.dateFromTrigger = page.locator('button.date-filter-segment__trigger').nth(0);
    this.dateToTrigger = page.locator('button.date-filter-segment__trigger').nth(1);
    this.dateClearButton = page.locator('button.from-to-date-filter__clear');
    this.dateCalendar = page.locator('.date-calendar');

    // Search & Create NK
    this.searchInput = page.locator('input[placeholder*="Tìm: mã YCTN"]');
    this.clearFilterButton = page.locator('button.clear-btn', { hasText: 'Hủy' });
    this.btnTaoHoSoNK = page.locator('button', { hasText: 'Tạo hồ sơ NK' });

    // Toolbar
    this.toolbarInfo = page.locator('.gviec-toolbar .gviec-info');
    this.btnExpandAll = page.locator('.gviec-toolbar button', { hasText: 'Mở tất cả' });
    this.btnCollapseAll = page.locator('.gviec-toolbar button', { hasText: 'Thu gọn tất cả' });

    // Body content
    this.yctnCards = page.locator('.gviec-body .yctn-card');
    this.sampleBlocks = page.locator('.gviec-body .sample-block');
    this.ctTables = page.locator('.gviec-body table.ct-table');
    this.ctRows = page.locator('.gviec-body table.ct-table tbody tr');

    // Reassign KNV Modal
    this.reassignModal = page.locator('.modal.reassign-modal');
    this.reassignTitle = this.reassignModal.locator('.modal-title');
    this.reassignMessage = this.reassignModal.locator('.reassign-message');
    this.reassignDetails = this.reassignModal.locator('.reassign-details');
    this.btnReassignCancel = this.reassignModal.locator('.modal-foot button', { hasText: 'Hủy' });
    this.btnReassignConfirm = this.reassignModal.locator('.modal-foot button', { hasText: 'Đồng ý giao lại' });
    this.btnReassignClose = this.reassignModal.locator('.modal-close');

    // Create Hồ sơ TN Modal
    this.nkModal = page.locator('.modal').filter({ has: page.locator('.modal-title', { hasText: 'Tạo hồ sơ TN' }) });
    this.nkModalAlert = this.nkModal.locator('.nk-modal-alert');
    this.nkModalWarning = this.nkModal.locator('.nk-modal-warning');
    this.nkModalInfo = this.nkModal.locator('.modal-info');
    this.nkGroups = this.nkModal.locator('.nk-group');
    this.btnNkCancel = this.nkModal.locator('.modal-foot button', { hasText: 'Hủy' });
    this.btnNkConfirm = this.nkModal.locator('.modal-foot button.btn-primary');
    this.btnNkClose = this.nkModal.locator('.modal-close');
  }

  /**
   * Điều hướng tới màn Giao việc (/giao-viec)
   */
  async open(path = '/giao-viec'): Promise<void> {
    await this.navigateTo(path);
    await expect(this.tabGiaoViec).toBeVisible({ timeout: 15000 });
    await expect(this.yctnCards.first()).toBeVisible({ timeout: 15000 });
  }

  async goto(): Promise<void> {
    await this.open('/giao-viec');
  }

  /**
   * Tìm kiếm theo từ khóa
   */
  async searchByKeyword(keyword: string): Promise<void> {
    await this.searchInput.fill(keyword);
    await this.page.waitForTimeout(400);
  }

  /**
   * Nhấn nút Hủy bộ lọc
   */
  async clearAllFilters(): Promise<void> {
    if (await this.clearFilterButton.isEnabled()) {
      await this.clearFilterButton.click();
      await this.page.waitForTimeout(400);
    }
  }

  /**
   * Chọn loại ngày lọc: 'Ngày nhận' | 'Ngày trả'
   */
  async selectDateFilterType(type: 'Ngày nhận' | 'Ngày trả'): Promise<void> {
    const currentText = (await this.dateTypeTrigger.innerText()).trim();
    if (currentText !== type) {
      await this.dateTypeTrigger.click();
      const option = this.page.locator('.popover__option[role="option"]', { hasText: type }).first();
      await expect(option).toBeVisible({ timeout: 5000 });
      await option.click();
      await expect(this.dateTypeTrigger).toHaveText(type);
      await this.page.waitForTimeout(200);
    }
  }

  /**
   * Chọn ngày (1..28) trong lịch đang mở
   */
  async pickDayInOpenCalendar(day: number): Promise<void> {
    await expect(this.dateCalendar).toBeVisible({ timeout: 5000 });
    const dayCell = this.dateCalendar
      .locator('button.date-calendar__cell')
      .filter({ hasText: new RegExp(`^${day}$`) })
      .first();
    await expect(dayCell).toBeVisible();
    await dayCell.click();
    await this.page.waitForTimeout(300);
  }

  /**
   * Chọn ngày bắt đầu (TỪ)
   */
  async setFromDateDay(day: number): Promise<void> {
    await this.dateFromTrigger.click();
    await this.page.waitForTimeout(200);
    if (!(await this.dateCalendar.isVisible())) {
      await this.dateFromTrigger.click();
    }
    await this.pickDayInOpenCalendar(day);
  }

  /**
   * Chọn ngày kết thúc (ĐẾN)
   */
  async setToDateDay(day: number): Promise<void> {
    await this.dateToTrigger.click();
    await this.page.waitForTimeout(200);
    if (!(await this.dateCalendar.isVisible())) {
      await this.dateToTrigger.click();
    }
    await this.pickDayInOpenCalendar(day);
  }

  /**
   * Xóa bộ lọc ngày
   */
  async clearDateFilter(): Promise<void> {
    if (await this.dateClearButton.isVisible()) {
      await this.dateClearButton.click();
      await this.page.waitForTimeout(300);
    }
  }

  /**
   * Chọn Kiểm nghiệm viên (KNV) trên một dòng chỉ tiêu (tr)
   */
  async selectKnvForRow(row: Locator, knvName: string): Promise<void> {
    const trigger = row.locator('.knv-select-search .select-search-trigger');
    await trigger.scrollIntoViewIfNeeded();
    await trigger.click();
    const menu = this.page.locator('.select-search-menu[role="listbox"]');
    await expect(menu).toBeVisible({ timeout: 5000 });
    const searchBox = menu.locator('.select-search-search input');
    if (await searchBox.isVisible()) {
      await searchBox.fill(knvName);
      await this.page.waitForTimeout(250);
    }
    const option = menu.locator('button.select-search-option[role="option"]', { hasText: knvName }).first();
    await expect(option).toBeVisible({ timeout: 5000 });
    await option.click();
    await this.page.waitForTimeout(400);
  }

  /**
   * Xóa (hủy gán) KNV trên một dòng chỉ tiêu (tr)
   */
  async clearKnvForRow(row: Locator): Promise<void> {
    const clearBtn = row.locator('.knv-select-search .select-search-clear');
    await expect(clearBtn).toBeVisible({ timeout: 5000 });
    await clearBtn.click();
    await this.page.waitForTimeout(400);
  }

  /**
   * Tìm index của dòng chỉ tiêu theo điều kiện để cố định dòng bằng .nth(index)
   */
  async findCriterionRowIndex(options: {
    hsClass?: 'hs-none' | 'hs-red' | 'hs-green';
    unassignedOnly?: boolean;
  }): Promise<number> {
    return await this.page.evaluate(({ hsClass, unassignedOnly }) => {
      const rows = Array.from(document.querySelectorAll('.gviec-body table.ct-table tbody tr'));
      return rows.findIndex((tr) => {
        if (hsClass && !tr.querySelector(`.${hsClass}`)) return false;
        if (unassignedOnly && !(tr.textContent || '').includes('— chưa gán —')) return false;
        return true;
      });
    }, options);
  }

  /**
   * Bỏ tích toàn bộ các checkbox chỉ tiêu đang được tích trên trang
   */
  async uncheckAllCriteria(): Promise<void> {
    const checkedBoxes = this.page.locator('.gviec-body table.ct-table tbody input.cb:checked:not(:disabled)');
    const count = await checkedBoxes.count();
    for (let i = count - 1; i >= 0; i--) {
      await checkedBoxes.nth(i).uncheck();
    }
  }
}

