import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { Logger } from '../utils/logger';

/**
 * Page Object Model cho màn hình Duyệt phiếu kết quả (/duyet-pkq)
 * Hệ thống VNTEST LIMS
 */
export class DuyetPkqPage extends BasePage {
  // ------------------------------------------------------------
  // Tabs điều hướng cấp cao
  // ------------------------------------------------------------
  readonly tabRaSoatKq: Locator;
  readonly tabDuyetPkq: Locator;
  readonly tabDinhKemScan: Locator;

  // ------------------------------------------------------------
  // Toolbar thao tác
  // ------------------------------------------------------------
  readonly btnPrint: Locator;
  readonly dateFromTrigger: Locator;
  readonly dateToTrigger: Locator;
  readonly btnTraLai: Locator;
  readonly btnKyDuyet: Locator;

  // ------------------------------------------------------------
  // Bảng danh sách phiếu kết quả
  // ------------------------------------------------------------
  readonly listTable: Locator;
  readonly tableThead: Locator;
  readonly headerCheckbox: Locator;
  readonly listRows: Locator;
  readonly paginationInfo: Locator;
  readonly btnColumnMgmt: Locator;
  readonly columnMgmtPopover: Locator;
  readonly btnResetColumns: Locator;
  readonly pageSizeSelect: Locator;

  // ------------------------------------------------------------
  // Modal Ký duyệt
  // ------------------------------------------------------------
  readonly modalKyDuyet: Locator;
  readonly modalKyDuyetTitle: Locator;
  readonly modalKyDuyetCodes: Locator;
  readonly btnModalKyDuyetConfirm: Locator;
  readonly btnModalKyDuyetCancel: Locator;
  readonly btnModalKyDuyetClose: Locator;

  // ------------------------------------------------------------
  // Modal Trả lại
  // ------------------------------------------------------------
  readonly modalTraLai: Locator;
  readonly modalTraLaiTitle: Locator;
  readonly modalTraLaiCodes: Locator;
  readonly inputTraLaiReason: Locator;
  readonly charCountTraLai: Locator;
  readonly btnModalTraLaiConfirm: Locator;
  readonly btnModalTraLaiCancel: Locator;
  readonly btnModalTraLaiClose: Locator;

  // ------------------------------------------------------------
  // Modal Cập nhật ý kiến điều phối
  // ------------------------------------------------------------
  readonly modalYKien: Locator;
  readonly modalYKienTitle: Locator;
  readonly modalYKienPkqCode: Locator;
  readonly modalYKienYctnCode: Locator;
  readonly inputYKien: Locator;
  readonly charCountYKien: Locator;
  readonly btnModalYKienSave: Locator;
  readonly btnModalYKienCancel: Locator;
  readonly btnModalYKienClose: Locator;

  // ------------------------------------------------------------
  // Khung xem trước bản in (Print Preview Paper)
  // ------------------------------------------------------------
  readonly previewContainer: Locator;
  readonly previewPage: Locator;
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

    // Tabs
    this.tabRaSoatKq = page.locator('button.tab, nav a, button', { hasText: 'RÀ SOÁT KQ' }).first();
    this.tabDuyetPkq = page.locator('button.tab, nav a, button', { hasText: 'DUYỆT PKQ' }).first();
    this.tabDinhKemScan = page.locator('button.tab, nav a, button', { hasText: 'ĐÍNH KÈM SCAN' }).first();

    // Toolbar
    this.btnPrint = page.getByRole('button', { name: 'Print' }).first();
    this.dateFromTrigger = page.locator('.from-to-date-filter, .date-filter-segment__trigger').first();
    this.dateToTrigger = page.locator('.from-to-date-filter, .date-filter-segment__trigger').nth(1);
    this.btnTraLai = page.getByRole('button', { name: 'Trả lại' }).first();
    this.btnKyDuyet = page.getByRole('button', { name: 'Ký duyệt' }).first();

    // Table
    this.listTable = page.locator('table').first();
    this.tableThead = this.listTable.locator('thead');
    this.headerCheckbox = this.tableThead.locator('input[type="checkbox"]').first();
    this.listRows = this.listTable.locator('tbody tr');
    this.paginationInfo = page.getByText(/Hiện \d+–\d+ \/ \d+ PKQ/).first();
    this.btnColumnMgmt = page.getByRole('button', { name: 'Quản lý cột' }).first();
    this.columnMgmtPopover = page.locator('.popover, .dropdown-menu, [class*="column-manage"], [class*="column-menu"]').first();
    this.btnResetColumns = page.getByRole('button', { name: 'ĐẶT LẠI' }).first();
    this.pageSizeSelect = page.locator('.page-size-select, select, [class*="pagination"] select').first();

    // Modal Ký duyệt
    this.modalKyDuyet = page.locator('.modal, [role="dialog"]').filter({ hasText: 'Xác nhận ký duyệt phiếu kết quả' }).first();
    this.modalKyDuyetTitle = this.modalKyDuyet.locator('#comment-modal-title, .modal-title, .modal-head').first();
    this.modalKyDuyetCodes = this.modalKyDuyet.locator('.mono.accent, strong.accent, .modal-body');
    this.btnModalKyDuyetConfirm = this.modalKyDuyet.getByRole('button', { name: 'Xác nhận ký duyệt' }).first();
    this.btnModalKyDuyetCancel = this.modalKyDuyet.getByRole('button', { name: 'Hủy' }).first();
    this.btnModalKyDuyetClose = this.modalKyDuyet.locator('.modal-close, [aria-label="Đóng"], .btn-close').first();

    // Modal Trả lại
    this.modalTraLai = page.locator('.modal, [role="dialog"]').filter({ hasText: 'Xác nhận trả lại phiếu kết quả' }).first();
    this.modalTraLaiTitle = this.modalTraLai.locator('.modal-title, .modal-head').first();
    this.modalTraLaiCodes = this.modalTraLai.locator('.mono.accent, strong.accent, .modal-body');
    this.inputTraLaiReason = this.modalTraLai.locator('textarea');
    this.charCountTraLai = this.modalTraLai.getByText(/\/1000/).first();
    this.btnModalTraLaiConfirm = this.modalTraLai.getByRole('button', { name: 'Xác nhận trả lại' }).first();
    this.btnModalTraLaiCancel = this.modalTraLai.getByRole('button', { name: 'Hủy' }).first();
    this.btnModalTraLaiClose = this.modalTraLai.locator('.modal-close, [aria-label="Đóng"], .btn-close').first();

    // Modal Ý kiến
    this.modalYKien = page.locator('.test-result-comment-modal, .modal').filter({ hasText: 'Cập nhật ý kiến điều phối' }).first();
    this.modalYKienTitle = this.modalYKien.locator('#comment-modal-title, .modal-title').first();
    this.modalYKienPkqCode = this.modalYKien.locator('.test-result-comment-info .mono.accent').first();
    this.modalYKienYctnCode = this.modalYKien.locator('.test-result-comment-info .mono:not(.accent)').first();
    this.inputYKien = this.modalYKien.locator('#test-result-comment-textarea, textarea').first();
    this.charCountYKien = this.modalYKien.locator('.char-count').first();
    this.btnModalYKienSave = this.modalYKien.getByRole('button', { name: 'Lưu ý kiến' }).first();
    this.btnModalYKienCancel = this.modalYKien.locator('.modal-foot button').first();
    this.btnModalYKienClose = this.modalYKien.locator('button.modal-close, [aria-label="Đóng"]').first();

    // Khung xem trước bản in
    this.previewContainer = page.locator('.pkq-print-preview').first();
    this.previewPage = this.previewContainer.locator('.pkq-pp-page').first();
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

  /** Mở trang Duyệt PKQ */
  async open(url = '/duyet-pkq'): Promise<void> {
    Logger.info(`Điều hướng tới màn hình Duyệt PKQ: ${url}`);
    await this.page.goto(url);
    await this.page.waitForLoadState('domcontentloaded');
  }

  /** Lấy tổng số dòng trong bảng danh sách */
  async getRowCount(): Promise<number> {
    return await this.listRows.count();
  }

  /** Lấy dòng theo mã phiếu kết quả (DV...) */
  getRowByPkqCode(code: string): Locator {
    return this.listRows.filter({ hasText: code }).first();
  }

  /** Lấy mã PKQ của một dòng */
  async getRowPkqCode(row: Locator): Promise<string> {
    const text = await row.locator('td').nth(1).locator('.bot.mono, div:nth-child(2)').innerText();
    return text.trim();
  }

  /** Lấy mã YCTN của một dòng */
  async getRowYctnCode(row: Locator): Promise<string> {
    const text = await row.locator('td').nth(1).locator('.top.mono, div:first-child').innerText();
    return text.trim();
  }

  /** Lấy Tên khách hàng của một dòng */
  async getRowCustomerName(row: Locator): Promise<string> {
    const text = await row.locator('td').nth(2).locator('.top, div:first-child').innerText();
    return text.trim();
  }

  /** Lấy Tên mẫu của một dòng */
  async getRowSampleName(row: Locator): Promise<string> {
    const text = await row.locator('td').nth(2).locator('.bot, div:nth-child(2)').innerText();
    return text.trim();
  }

  /** Lấy Ngày nhận của một dòng */
  async getRowReceiveDate(row: Locator): Promise<string> {
    const text = await row.locator('td').nth(3).locator('.top.mono, div:first-child').innerText();
    return text.trim();
  }

  /** Lấy Ngày trả của một dòng */
  async getRowReturnDate(row: Locator): Promise<string> {
    const text = await row.locator('td').nth(3).locator('.bot.mono, div:nth-child(2)').innerText();
    return text.trim();
  }

  /** Lấy Trạng thái của một dòng */
  async getRowStatus(row: Locator): Promise<string> {
    const text = await row.locator('td').nth(6).locator('.stat, [class*="stat"]').innerText();
    return text.trim();
  }

  /** Lấy ô Ý kiến của một dòng */
  getRowCommentCell(row: Locator): Locator {
    return row.locator('td').nth(7).locator('.comment-cell-action, [class*="comment"]').first();
  }

  /** Tích chọn một dòng */
  async selectRow(row: Locator): Promise<void> {
    const cb = row.locator('input[type="checkbox"]').first();
    if (!(await cb.isChecked())) {
      await cb.check();
    }
  }

  /** Bỏ chọn một dòng */
  async uncheckRow(row: Locator): Promise<void> {
    const cb = row.locator('input[type="checkbox"]').first();
    if (await cb.isChecked()) {
      await cb.uncheck();
    }
  }

  /** Tích chọn Header checkbox (chọn tất cả) */
  async checkAll(): Promise<void> {
    if (!(await this.headerCheckbox.isChecked())) {
      await this.headerCheckbox.check();
    }
  }

  /** Bỏ chọn Header checkbox */
  async uncheckAll(): Promise<void> {
    if (await this.headerCheckbox.isChecked()) {
      await this.headerCheckbox.uncheck();
    }
  }

  /** Lấy số lượng hàng đang được tích chọn */
  async getCheckedRowCount(): Promise<number> {
    return await this.listRows.locator('input[type="checkbox"]:checked').count();
  }

  /** Nhấn chọn một dòng để hiển thị bản in xem trước */
  async clickRowToPreview(row: Locator): Promise<void> {
    // Click vào cột Tên KH để tránh bấm trúng checkbox
    await row.locator('td').nth(2).click();
    await this.page.waitForTimeout(300);
  }

  // ------------------------------------------------------------
  // Helper methods cho Khung xem trước bản in (Print Preview)
  // ------------------------------------------------------------

  /** Lấy giá trị của một dòng thông tin trong Mục I theo số thứ tự (1..9) */
  async getPreviewInfoValue(num: number): Promise<string> {
    const row = this.previewInfoRows.filter({ has: this.page.locator('.num', { hasText: `${num}.` }) }).first();
    const val = row.locator('.val');
    return (await val.innerText()).trim();
  }

  /** Lấy văn bản tiêu đề của một dòng thông tin trong Mục I theo số thứ tự (1..9) */
  async getPreviewInfoLabel(num: number): Promise<string> {
    const row = this.previewInfoRows.filter({ has: this.page.locator('.num', { hasText: `${num}.` }) }).first();
    const lbl = row.locator('.lbl');
    return (await lbl.innerText()).trim();
  }

  /** Lấy danh sách các chứng nhận hiển thị trên phiếu in (VILAS 1296, VIMCERTS 323...) */
  async getPreviewStamps(): Promise<string[]> {
    const texts = await this.previewStamps.allInnerTexts();
    return texts.map(t => t.trim());
  }

  /** Lấy toàn bộ văn bản của khung xem trước */
  async getPreviewText(): Promise<string> {
    return await this.previewContainer.innerText();
  }

  // ------------------------------------------------------------
  // Helper methods cho Ý kiến điều phối
  // ------------------------------------------------------------

  /** Mở modal cập nhật ý kiến của dòng chỉ định */
  async openCommentModal(row: Locator): Promise<void> {
    Logger.info('Mở modal Cập nhật ý kiến điều phối');
    await this.getRowCommentCell(row).click();
    await this.page.waitForTimeout(300);
  }

  /** Lưu ý kiến qua nút bấm "Lưu ý kiến" */
  async saveComment(text: string): Promise<void> {
    Logger.info(`Nhập ý kiến: "${text}" và bấm Lưu`);
    await this.inputYKien.fill(text);
    await this.btnModalYKienSave.click();
    await this.page.waitForTimeout(500);
  }

  /** Lưu ý kiến bằng phím tắt Ctrl + Enter */
  async saveCommentWithShortcut(text: string): Promise<void> {
    Logger.info(`Nhập ý kiến: "${text}" và nhấn Ctrl+Enter`);
    await this.inputYKien.fill(text);
    await this.page.keyboard.press('Control+Enter');
    await this.page.waitForTimeout(500);
  }

  // ------------------------------------------------------------
  // Helper methods cho Ký duyệt / Trả lại
  // ------------------------------------------------------------

  /** Mở modal Ký duyệt */
  async openKyDuyetModal(): Promise<void> {
    Logger.info('Nhấn nút "Ký duyệt" trên thanh công cụ');
    await this.btnKyDuyet.click();
    await this.page.waitForTimeout(300);
  }

  /** Mở modal Trả lại */
  async openTraLaiModal(): Promise<void> {
    Logger.info('Nhấn nút "Trả lại" trên thanh công cụ');
    await this.btnTraLai.click();
    await this.page.waitForTimeout(300);
  }
}

