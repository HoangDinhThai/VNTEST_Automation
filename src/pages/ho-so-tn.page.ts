import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { Logger } from '../utils/logger';

/**
 * Page Object cho màn hình Hồ sơ TN (/ho-so-tn - Tab HỒ SƠ TN)
 * Tuân thủ mô hình POM chuẩn: Locators semantic ở đầu class, method mô tả hành vi người dùng, KHÔNG chứa assertion.
 */
export class HoSoTnPage extends BasePage {
  // Navigation Tabs trên Header
  readonly tabGiaoViec: Locator;
  readonly tabHoSoTN: Locator;
  readonly tabTruongBPKtra: Locator;
  readonly tabQlyCTTinh: Locator;

  // Header Utility Buttons
  readonly btnPrint: Locator;
  readonly btnImport: Locator;
  readonly btnExport: Locator;

  // Status Chips
  readonly chipDangTH: Locator;
  readonly chipDaHT: Locator;
  readonly chipChoDuyet: Locator;
  readonly chipTraLai: Locator;
  readonly bpFilterTrigger: Locator;

  // Date Filter & Search Bar
  readonly dateTypeTrigger: Locator;
  readonly dateFromTrigger: Locator;
  readonly dateToTrigger: Locator;
  readonly searchInput: Locator;
  readonly btnClearFilter: Locator;

  // Topbar Action Buttons
  readonly btnSave: Locator;
  readonly btnSubmit: Locator;
  readonly btnCancelHS: Locator;

  // Left List Table
  readonly table: Locator;
  readonly tableHeaders: Locator;
  readonly tableRows: Locator;
  readonly selectAllCheckbox: Locator;
  readonly paginationPageBtns: Locator;
  readonly btnManageColumns: Locator;

  // Right Detail Container
  readonly detailContainer: Locator;
  readonly formulaSelect: Locator;
  readonly btnThemHoaChat: Locator;
  readonly chemicalTable: Locator;
  readonly btnBlank: Locator;
  readonly btnQC: Locator;
  readonly btnTC: Locator;
  readonly btnThemMau: Locator;
  readonly btnDinhKem: Locator;
  readonly sampleTable: Locator;
  readonly sampleRows: Locator;

  // Modal Xác nhận hủy HS
  readonly cancelModal: Locator;
  readonly btnModalClose: Locator;
  readonly btnModalConfirm: Locator;

  constructor(page: Page) {
    super(page);

    // Header tabs
    this.tabGiaoViec = page.locator('header.header .tabs button.tab', { hasText: /Giao Việc/i });
    this.tabHoSoTN = page.locator('header.header .tabs button.tab', { hasText: /Hồ sơ TN/i });
    this.tabTruongBPKtra = page.locator('header.header .tabs button.tab', { hasText: /Trưởng BP ktra/i });
    this.tabQlyCTTinh = page.locator('header.header .tabs button.tab', { hasText: /Qly CT tính/i });

    // Header right buttons
    this.btnPrint = page.locator('header.header .header-right button', { hasText: /Print/i });
    this.btnImport = page.locator('header.header .header-right button', { hasText: /Import/i });
    this.btnExport = page.locator('header.header .header-right button', { hasText: /Export/i });

    // Status chips
    this.chipDangTH = page.locator('button.bg-chiptab', { hasText: /Đang TH/i });
    this.chipDaHT = page.locator('button.bg-chiptab', { hasText: /Đã HT/i });
    this.chipChoDuyet = page.locator('button.bg-chiptab', { hasText: /Chờ duyệt/i });
    this.chipTraLai = page.locator('button.bg-chiptab', { hasText: /Trả lại/i });
    this.bpFilterTrigger = page.locator('button.popover__trigger', { hasText: /BP:/i });

    // Date filter & Search
    this.dateTypeTrigger = page.locator('button.from-to-date-filter__label-trigger');
    this.dateFromTrigger = page.locator('button.date-filter-segment__trigger').nth(0);
    this.dateToTrigger = page.locator('button.date-filter-segment__trigger').nth(1);
    this.searchInput = page.locator('input[placeholder*="Find: mã PKQ"]');
    this.btnClearFilter = page.locator('button.clear-btn', { hasText: 'Hủy' });

    // Action buttons
    this.btnSave = page.locator('button.hs-save-btn, button:has-text("Lưu")').first();
    this.btnSubmit = page.locator('button:has-text("Gửi duyệt")').first();
    this.btnCancelHS = page.locator('button:has-text("Hủy HS")').first();

    // Left Table
    this.table = page.locator('table').first();
    this.tableHeaders = this.table.locator('thead th');
    this.tableRows = this.table.locator('tbody tr');
    this.selectAllCheckbox = this.table.locator('thead input[type="checkbox"]');
    this.paginationPageBtns = page.locator('.page-btn');
    this.btnManageColumns = page.locator('button.px-column-manager-trigger, button:has-text("Quản lý cột")');

    // Right Detail Container
    this.detailContainer = page.locator('.hs-detail-container');
    this.formulaSelect = this.detailContainer.locator('select').first();
    this.btnThemHoaChat = this.detailContainer.locator('button.hs-add-btn', { hasText: /Thêm hóa chất/i });
    this.chemicalTable = this.detailContainer.locator('table').first();
    this.btnBlank = this.detailContainer.locator('button.hs-add-btn', { hasText: /\+ Blank/i });
    this.btnQC = this.detailContainer.locator('button.hs-add-btn', { hasText: /\+ QC/i });
    this.btnTC = this.detailContainer.locator('button.hs-add-btn', { hasText: /\+ TC/i });
    this.btnThemMau = this.detailContainer.locator('button.hs-add-btn', { hasText: /\+ Thêm mẫu/i });
    this.btnDinhKem = this.detailContainer.locator('button.hs-add-btn', { hasText: /\+ Đính kèm/i });
    this.sampleTable = this.detailContainer.locator('table').last();
    this.sampleRows = this.sampleTable.locator('tbody tr');

    // Cancel HS Modal
    this.cancelModal = page.locator('.modal').filter({ hasText: /Xác nhận hủy hồ sơ thử nghiệm/i });
    this.btnModalClose = this.cancelModal.locator('button', { hasText: 'Đóng' });
    this.btnModalConfirm = this.cancelModal.locator('button', { hasText: 'Xác nhận hủy' });
  }

  /**
   * Điều hướng trực tiếp tới màn hình Hồ sơ TN
   */
  async open(path = '/ho-so-tn'): Promise<void> {
    Logger.info(`Điều hướng tới màn hình Hồ sơ TN: ${path}`);
    await this.page.goto(path);
  }

  /**
   * Tìm kiếm theo từ khóa
   */
  async search(keyword: string): Promise<void> {
    Logger.info(`Tìm kiếm từ khóa: "${keyword}"`);
    await this.searchInput.fill(keyword);
    await this.searchInput.press('Enter');
  }

  /**
   * Xóa từ khóa tìm kiếm và bộ lọc
   */
  async clearFilter(): Promise<void> {
    Logger.info('Nhấn nút "Hủy" để xóa bộ lọc');
    await this.btnClearFilter.click();
  }

  /**
   * Chọn hồ sơ theo thứ tự dòng (index)
   */
  async selectRow(index: number): Promise<void> {
    Logger.info(`Chọn hồ sơ tại dòng ${index}`);
    await this.tableRows.nth(index).click();
  }

  /**
   * Tích chọn checkbox của một hồ sơ theo index
   */
  async checkRowCheckbox(index: number): Promise<void> {
    Logger.info(`Tích chọn checkbox dòng ${index}`);
    const cb = this.tableRows.nth(index).locator('input[type="checkbox"]');
    await cb.check();
  }

  /**
   * Bỏ tích chọn checkbox của một hồ sơ theo index
   */
  async uncheckRowCheckbox(index: number): Promise<void> {
    Logger.info(`Bỏ tích chọn checkbox dòng ${index}`);
    const cb = this.tableRows.nth(index).locator('input[type="checkbox"]');
    await cb.uncheck();
  }

  /**
   * Chọn công thức tính theo index
   */
  async selectFormula(index: number): Promise<void> {
    Logger.info(`Chọn công thức tính tại vị trí index: ${index}`);
    await this.formulaSelect.selectOption({ index });
  }

  /**
   * Nhấn các nút thêm mẫu kiểm chuẩn
   */
  async addBlankSample(): Promise<void> {
    Logger.info('Nhấn nút "+ Blank"');
    await this.btnBlank.click();
  }

  async addQCSample(): Promise<void> {
    Logger.info('Nhấn nút "+ QC"');
    await this.btnQC.click();
  }

  async addTCSample(): Promise<void> {
    Logger.info('Nhấn nút "+ TC"');
    await this.btnTC.click();
  }

  /**
   * Nhập giá trị cho ô tham số thử nghiệm
   */
  async fillSampleParam(rowIndex: number, value: string): Promise<void> {
    Logger.info(`Nhập tham số "${value}" vào dòng mẫu ${rowIndex}`);
    const inputs = this.sampleRows.nth(rowIndex).locator('input.hs-inp.mono, input[placeholder="…"]');
    const count = await inputs.count();
    for (let i = 0; i < count; i++) {
      await inputs.nth(i).fill(value);
    }
  }

  /**
   * Nhấn nút Lưu hồ sơ
   */
  async clickSave(): Promise<void> {
    Logger.info('Nhấn nút "Lưu" hồ sơ');
    await this.btnSave.click();
  }

  /**
   * Nhấn nút Gửi duyệt
   */
  async clickSubmit(): Promise<void> {
    Logger.info('Nhấn nút "Gửi duyệt"');
    await this.btnSubmit.click();
  }

  /**
   * Nhấn nút Hủy HS
   */
  async clickCancelHS(): Promise<void> {
    Logger.info('Nhấn nút "Hủy HS"');
    await this.btnCancelHS.click();
  }
}
