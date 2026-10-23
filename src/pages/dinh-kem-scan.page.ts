import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { Logger } from '../utils/logger';

/**
 * Page Object Model cho màn hình Đính kèm scan (/dinh-kem-scan)
 * Hệ thống VNTEST LIMS
 */
export class DinhKemScanPage extends BasePage {
  // ------------------------------------------------------------
  // Tabs điều hướng cấp cao
  // ------------------------------------------------------------
  readonly tabRaSoatKq: Locator;
  readonly tabDuyetPkq: Locator;
  readonly tabDinhKemScan: Locator;

  // ------------------------------------------------------------
  // Toolbar thao tác & Bộ lọc
  // ------------------------------------------------------------
  readonly btnPrint: Locator;
  readonly btnChuaTraKq: Locator;
  readonly btnChuaAttach: Locator;
  readonly dateTypeTrigger: Locator;
  readonly dateFromTrigger: Locator;
  readonly dateToTrigger: Locator;
  readonly dateCalendar: Locator;
  readonly btnCalendarToday: Locator;
  readonly btnCalendarClear: Locator;
  readonly searchInput: Locator;
  readonly btnAttachFile: Locator;

  // ------------------------------------------------------------
  // Bảng danh sách phiếu kết quả
  // ------------------------------------------------------------
  readonly listTable: Locator;
  readonly tableThead: Locator;
  readonly headerCheckbox: Locator;
  readonly listRows: Locator;
  readonly paginationInfo: Locator;
  readonly btnColumnMgmt: Locator;
  readonly btnResetColumns: Locator;
  readonly pageSizeDropdown: Locator;

  // ------------------------------------------------------------
  // Modal Đính kèm file scan
  // ------------------------------------------------------------
  readonly modalAttach: Locator;
  readonly modalAttachTitle: Locator;
  readonly modalAttachInfo: Locator;
  readonly modalAttachFileCount: Locator;
  readonly modalAttachFileInput: Locator;
  readonly modalAttachFilesList: Locator;
  readonly btnModalAttachSave: Locator;
  readonly btnModalAttachCancel: Locator;
  readonly btnModalAttachClose: Locator;

  // ------------------------------------------------------------
  // Modal Cập nhật ý kiến điều phối
  // ------------------------------------------------------------
  readonly modalYKien: Locator;
  readonly modalYKienTitle: Locator;
  readonly modalYKienPkqCode: Locator;
  readonly modalYKienTextarea: Locator;
  readonly modalYKienCharCount: Locator;
  readonly btnModalYKienSave: Locator;
  readonly btnModalYKienCancel: Locator;
  readonly btnModalYKienClose: Locator;

  // ------------------------------------------------------------
  // Khung xem trước bản in (Right pane - .pkq-print-preview)
  // ------------------------------------------------------------
  readonly previewContainer: Locator;
  readonly previewHeader: Locator;
  readonly previewLogo: Locator;
  readonly previewStamps: Locator;
  readonly previewDocCode: Locator;
  readonly previewTitle: Locator;
  readonly previewSectionGeneral: Locator;
  readonly previewInfoRows: Locator;
  readonly previewSectionResult: Locator;
  readonly previewTable: Locator;
  readonly previewTableRows: Locator;
  readonly previewNotes: Locator;
  readonly previewSignatures: Locator;

  constructor(page: Page) {
    super(page);

    // High-level tabs
    this.tabRaSoatKq = page.locator('button.tab, .tab').filter({ hasText: 'RÀ SOÁT KQ' }).first();
    this.tabDuyetPkq = page.locator('button.tab, .tab').filter({ hasText: 'DUYỆT PKQ' }).first();
    this.tabDinhKemScan = page.locator('button.tab, .tab').filter({ hasText: 'ĐÍNH KÈM SCAN' }).first();

    // Toolbar & Filter controls
    this.btnPrint = page.locator('button').filter({ hasText: 'Print' }).first();
    this.btnChuaTraKq = page.locator('.bg-chiptab, button').filter({ hasText: 'Chưa trả KQ' }).first();
    this.btnChuaAttach = page.locator('.bg-chiptab, button').filter({ hasText: 'Chưa Attach' }).first();
    this.dateTypeTrigger = page.locator('.from-to-date-filter__label-trigger').first();
    this.dateFromTrigger = page.locator('.date-filter-segment__trigger').filter({ hasText: /Từ/i }).first();
    this.dateToTrigger = page.locator('.date-filter-segment__trigger').filter({ hasText: /Đến/i }).first();
    this.dateCalendar = page.locator('.date-calendar').first();
    this.btnCalendarToday = page.locator('.date-calendar__foot-btn--primary, button:has-text("Hôm nay")').first();
    this.btnCalendarClear = page.locator('.date-calendar__foot-btn, button:has-text("Xóa")').first();
    this.searchInput = page.locator('input[placeholder*="Tìm: mã YCTN"], input[placeholder*="Tìm:"]').first();
    this.btnAttachFile = page.locator('button, .btn').filter({ hasText: 'Attach file' }).first();

    // Bảng danh sách phiếu
    this.listTable = page.locator('table').first();
    this.tableThead = this.listTable.locator('thead');
    this.headerCheckbox = this.tableThead.locator('th input[type="checkbox"]').first();
    this.listRows = this.listTable.locator('tbody tr');
    this.paginationInfo = page.locator('.page-btn, [class*="pagination"]').first();
    this.btnColumnMgmt = page.locator('.px-column-manager-trigger, button:has-text("Quản lý cột")').first();
    this.btnResetColumns = page.locator('button:has-text("ĐẶT LẠI"), button:has-text("Đặt lại")').first();
    this.pageSizeDropdown = page.locator('.popover__trigger.dd').first();

    // Modal Attach file scan
    this.modalAttach = page.locator('.modal, [class*="modal"], [role="dialog"]').filter({ hasText: 'Đính kèm file scan' }).first();
    this.modalAttachTitle = this.modalAttach.locator('.modal-title, [class*="title"], h3, h4').first();
    this.modalAttachInfo = this.modalAttach.locator('[class*="info"], text=/Mã phiếu:/i').first();
    this.modalAttachFileCount = this.modalAttach.locator('text=/\/10 file/i').first();
    this.modalAttachFileInput = this.modalAttach.locator('input[type="file"]').first();
    this.modalAttachFilesList = this.modalAttach.locator('[class*="file-list"], [class*="attached-files"]').first();
    this.btnModalAttachSave = this.modalAttach.locator('button').filter({ hasText: /^Lưu$/ }).first();
    this.btnModalAttachCancel = this.modalAttach.locator('button').filter({ hasText: /^Hủy$/ }).first();
    this.btnModalAttachClose = this.modalAttach.locator('button.btn-close, [aria-label="Close"], [class*="close"]').first();

    // Modal Ý kiến điều phối
    this.modalYKien = page.locator('.modal, [class*="modal"], [role="dialog"]').filter({ hasText: 'Cập nhật ý kiến điều phối' }).first();
    this.modalYKienTitle = this.modalYKien.locator('.modal-title, [class*="title"], h3, h4').first();
    this.modalYKienPkqCode = this.modalYKien.locator('text=/DV15/i').first();
    this.modalYKienTextarea = this.modalYKien.locator('textarea').first();
    this.modalYKienCharCount = this.modalYKien.locator('text=/\/1000/').first();
    this.btnModalYKienSave = this.modalYKien.locator('button').filter({ hasText: 'Lưu ý kiến' }).first();
    this.btnModalYKienCancel = this.modalYKien.locator('button').filter({ hasText: /^Hủy$/ }).first();
    this.btnModalYKienClose = this.modalYKien.locator('button.btn-close, [aria-label="Close"], [class*="close"]').first();

    // Khung xem trước bản in (Right pane)
    this.previewContainer = page.locator('.pkq-print-preview').first();
    this.previewHeader = this.previewContainer.locator('.pkq-pp-header').first();
    this.previewLogo = this.previewContainer.locator('.pkq-pp-logo').first();
    this.previewStamps = this.previewContainer.locator('.pkq-pp-stamp');
    this.previewDocCode = this.previewContainer.locator('.pkq-pp-vilas strong').first();
    this.previewTitle = this.previewContainer.locator('.pkq-pp-title').first();
    this.previewSectionGeneral = this.previewContainer.locator('.pkq-pp-sec').filter({ hasText: /GENERAL|THÔNG TIN CHUNG/i }).first();
    this.previewInfoRows = this.previewContainer.locator('.pkq-pp-info-row');
    this.previewSectionResult = this.previewContainer.locator('.pkq-pp-sec').filter({ hasText: /RESULT|KẾT QUẢ/i }).first();
    this.previewTable = this.previewContainer.locator('.pkq-pp-tbl').first();
    this.previewTableRows = this.previewTable.locator('tbody tr');
    this.previewNotes = this.previewContainer.locator('.pkq-pp-note, [class*="note"]').first();
    this.previewSignatures = this.previewContainer.locator('.pkq-pp-signs').first();
  }

  // ------------------------------------------------------------
  // Helper methods cho bảng danh sách phiếu
  // ------------------------------------------------------------

  /** Mở trang Đính kèm scan */
  async open(url = '/dinh-kem-scan'): Promise<void> {
    Logger.info(`Điều hướng tới màn hình Đính kèm scan: ${url}`);
    await this.page.goto(url);
    await this.page.waitForLoadState('domcontentloaded');
  }

  /** Lấy tổng số dòng trong bảng danh sách */
  async getRowCount(): Promise<number> {
    return await this.listRows.count();
  }

  /** Lấy checkbox chọn dòng theo index */
  getRowCheckbox(rowIndex: number): Locator {
    return this.listRows.nth(rowIndex).locator('td').first().locator('input[type="checkbox"]');
  }

  /** Lấy mã PKQ (DV...) của dòng theo index */
  async getRowMaPkq(rowIndex: number): Promise<string> {
    const bot = this.listRows.nth(rowIndex).locator('td:nth-child(2) .bot');
    return (await bot.innerText()).trim();
  }

  /** Lấy mã YCTN (TR...) của dòng theo index */
  async getRowMaYctn(rowIndex: number): Promise<string> {
    const top = this.listRows.nth(rowIndex).locator('td:nth-child(2) .top');
    return (await top.innerText()).trim();
  }

  /** Lấy tên khách hàng của dòng theo index */
  async getRowTenKh(rowIndex: number): Promise<string> {
    const top = this.listRows.nth(rowIndex).locator('td:nth-child(3) .top');
    return (await top.innerText()).trim();
  }

  /** Lấy tên mẫu của dòng theo index */
  async getRowTenMau(rowIndex: number): Promise<string> {
    const bot = this.listRows.nth(rowIndex).locator('td:nth-child(3) .bot');
    return (await bot.innerText()).trim();
  }

  /** Lấy checkbox cột "ĐÃ TRẢ" của dòng theo index */
  getRowDaTraCheckbox(rowIndex: number): Locator {
    return this.listRows.nth(rowIndex).locator('td:nth-child(6) input[type="checkbox"]');
  }

  /** Lấy checkbox cột "FILE SCAN" của dòng theo index */
  getRowFileScanCheckbox(rowIndex: number): Locator {
    return this.listRows.nth(rowIndex).locator('td:nth-child(7) input[type="checkbox"]');
  }

  /** Lấy ô cột "LINK WEB" của dòng theo index */
  getRowLinkWebCell(rowIndex: number): Locator {
    return this.listRows.nth(rowIndex).locator('td:nth-child(8)');
  }

  /** Lấy nút bút chì sửa LINK WEB của dòng theo index */
  getRowLinkWebPencil(rowIndex: number): Locator {
    return this.listRows.nth(rowIndex).locator('td:nth-child(8) button[title*="đường dẫn"], td:nth-child(8) button').first();
  }

  /** Lấy ô input sửa inline LINK WEB của dòng theo index */
  getRowLinkWebInput(rowIndex: number): Locator {
    return this.listRows.nth(rowIndex).locator('td:nth-child(8) input.scan-lookup-input');
  }

  /** Lấy nút Lưu inline LINK WEB của dòng theo index */
  getRowLinkWebSaveBtn(rowIndex: number): Locator {
    return this.listRows.nth(rowIndex).locator('td:nth-child(8) button[title="Lưu đường dẫn"]');
  }

  /** Lấy nút Hủy inline LINK WEB của dòng theo index */
  getRowLinkWebCancelBtn(rowIndex: number): Locator {
    return this.listRows.nth(rowIndex).locator('td:nth-child(8) button[title="Hủy sửa"]');
  }

  /** Lấy ô cột "Ý KIẾN" của dòng theo index */
  getRowYKienCell(rowIndex: number): Locator {
    return this.listRows.nth(rowIndex).locator('td:nth-child(9)');
  }

  /** Lấy số lượng trên badge "Chưa trả KQ" */
  async getBadgeChuaTraCount(): Promise<number> {
    const text = await this.btnChuaTraKq.innerText();
    const match = text.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  }

  /** Lấy số lượng trên badge "Chưa Attach" */
  async getBadgeChuaAttachCount(): Promise<number> {
    const text = await this.btnChuaAttach.innerText();
    const match = text.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  }

  /** Tìm dòng theo mã phiếu kết quả (DV...) */
  async findRowIndexByMaPkq(maPkq: string): Promise<number> {
    const count = await this.listRows.count();
    for (let i = 0; i < count; i++) {
      const code = await this.getRowMaPkq(i);
      if (code.includes(maPkq)) return i;
    }
    return -1;
  }
}
