import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { Logger } from '../utils/logger';

/**
 * Page Object cho màn hình Trưởng BP Kiểm tra (/truong-bo-phan-kiem-tra)
 * Tuân thủ mô hình POM chuẩn: Locators semantic ở đầu class, method mô tả hành vi người dùng, KHÔNG chứa assertion.
 */
export class TruongBpKtraPage extends BasePage {
  // ============================================================
  // 1. Navigation Tabs trên Header
  // ============================================================
  readonly tabGiaoViec: Locator;
  readonly tabHoSoTN: Locator;
  readonly tabTruongBPKtra: Locator;
  readonly tabQlyCTTinh: Locator;

  // ============================================================
  // 2. Khối THÔNG TIN KẾT QUẢ (Top Section Card)
  // ============================================================
  readonly ttkqSection: Locator;
  readonly yctnAccordionHead: Locator;
  readonly yctnCodeText: Locator;
  readonly yctnBadge: Locator;
  readonly sampleCard: Locator;
  readonly sampleBadgeM1: Locator;
  readonly sampleCodeText: Locator;
  readonly sampleProgressText: Locator;
  readonly ctTable: Locator;
  readonly ctTableHeaders: Locator;
  readonly ctTableRows: Locator;
  readonly ctRowDvt: Locator;
  readonly ctRowPpThu: Locator;
  readonly ctRowKq: Locator;
  readonly ctRowLod: Locator;
  readonly ctRowLoq: Locator;
  readonly ctRowVl: Locator;

  // ============================================================
  // 3. Khối Danh sách Hồ sơ TN & Bộ lọc / Tìm kiếm
  // ============================================================
  readonly chipChoDuyet: Locator;
  readonly chipDaDuyet: Locator;
  readonly chipTraLai: Locator;
  readonly searchInput: Locator;
  readonly btnClearSearch: Locator;
  readonly btnApprove: Locator;
  readonly btnReject: Locator;
  readonly hsTable: Locator;
  readonly hsTableHeaders: Locator;
  readonly hsTableRows: Locator;
  readonly selectAllCheckbox: Locator;
  readonly rowCheckboxes: Locator;
  readonly btnManageColumns: Locator;

  // ============================================================
  // 4. Khối BIÊN BẢN THỬ NGHIỆM CHI TIẾT
  // ============================================================
  readonly detailContainer: Locator;
  readonly btnSave: Locator;
  readonly btnThemHoaChat: Locator;
  readonly chemicalTable: Locator;
  readonly chemicalRows: Locator;
  readonly formulaPicker: Locator;
  readonly formulaSelect: Locator;
  readonly decimalInput: Locator;
  readonly sampleResultTable: Locator;
  readonly sampleResultHeaders: Locator;
  readonly sampleResultRows: Locator;
  readonly averageRow: Locator;
  readonly btnSignatureUpload: Locator;

  // ============================================================
  // 5. Modal Trả lại Hồ sơ thử nghiệm (.tp-return-modal)
  // ============================================================
  readonly returnModal: Locator;
  readonly returnModalTitle: Locator;
  readonly returnModalBody: Locator;
  readonly returnReasonTextarea: Locator;
  readonly btnReturnClose: Locator;
  readonly btnReturnCancel: Locator;
  readonly btnReturnConfirm: Locator;

  constructor(page: Page) {
    super(page);

    // 1. Header Navigation Tabs
    this.tabGiaoViec = page.locator('header.header .tabs button.tab, button.tab:has-text("GIAO VIỆC")').first();
    this.tabHoSoTN = page.locator('header.header .tabs button.tab, button.tab:has-text("HỒ SƠ TN")').first();
    this.tabTruongBPKtra = page.locator('header.header .tabs button.tab, button.tab:has-text("TRƯỞNG BP KTRA")').first();
    this.tabQlyCTTinh = page.locator('header.header .tabs button.tab, button.tab:has-text("QLY CT TÍNH")').first();

    // 2. Khối THÔNG TIN KẾT QUẢ
    this.ttkqSection = page.locator('div, section').filter({ hasText: 'THÔNG TIN KẾT QUẢ' }).first();
    this.yctnAccordionHead = page.locator('.yctn-head').first();
    this.yctnCodeText = this.yctnAccordionHead.locator('span').first();
    this.yctnBadge = this.yctnAccordionHead.locator('.yctn-badge, span:has-text("KIỂM NHANH")').first();
    this.sampleCard = page.locator('.sample-card, .yctn-sample, [class*="sample"]').first();
    this.sampleBadgeM1 = page.locator('span, div, .badge').filter({ hasText: /^M1/ }).first();
    this.sampleCodeText = page.locator('text=/S\\d+\\.\\d+/').first();
    this.sampleProgressText = page.locator('text=/\\d+ CT của bạn/i').first();
    this.ctTable = page.locator('table.ct-table, table:has(th:has-text("CHỈ TIÊU"))').first();
    this.ctTableHeaders = this.ctTable.locator('thead th');
    this.ctTableRows = this.ctTable.locator('tbody tr');
    this.ctRowDvt = this.ctTableRows.first().locator('td').nth(1).locator('.ct-input, input');
    this.ctRowPpThu = this.ctTableRows.first().locator('td').nth(2).locator('.ct-input, input');
    this.ctRowKq = this.ctTableRows.first().locator('td').nth(3).locator('.ct-input, input');
    this.ctRowLod = this.ctTableRows.first().locator('td').nth(4);
    this.ctRowLoq = this.ctTableRows.first().locator('td').nth(5);
    this.ctRowVl = this.ctTableRows.first().locator('td').nth(6);

    // 3. Khối Danh sách Hồ sơ TN & Bộ lọc / Tìm kiếm
    this.chipChoDuyet = page.getByRole('button', { name: /Chờ duyệt/i }).first();
    this.chipDaDuyet = page.getByRole('button', { name: /Đã duyệt/i }).first();
    this.chipTraLai = page.locator('button').filter({ hasText: /^Trả lại\s*\d+/i }).first();
    this.searchInput = page.locator('input[placeholder*="Find: mã hồ sơ, mã PKQ"]').first();
    this.btnClearSearch = page.locator('button.clear-btn, button:has-text("Hủy")').first();
    this.btnApprove = page.getByRole('button', { name: /^Duyệt$/i }).first();
    this.btnReject = page.getByRole('button', { name: /^Trả lại$/i }).first();
    this.hsTable = page.locator('table').filter({ has: page.locator('th:has-text("MÃ HỒ SƠ TN")') }).first();
    this.hsTableHeaders = this.hsTable.locator('thead th');
    this.hsTableRows = this.hsTable.locator('tbody tr');
    this.selectAllCheckbox = this.hsTable.locator('thead input[type="checkbox"]').first();
    this.rowCheckboxes = this.hsTable.locator('tbody input[type="checkbox"]');
    this.btnManageColumns = page.locator('button:has-text("Quản lý cột")').first();

    // 4. Khối BIÊN BẢN THỬ NGHIỆM CHI TIẾT
    this.detailContainer = page.locator('.hs-detail-container, .bb-detail-container, [class*="detail"]').first();
    this.btnSave = page.locator('button:has-text("Lưu")').first();
    this.btnThemHoaChat = page.locator('button.hs-add-btn:has-text("Thêm hóa chất"), button:has-text("+ Thêm hóa chất")').first();
    this.chemicalTable = page.locator('table').nth(2);
    this.chemicalRows = this.chemicalTable.locator('tbody tr');
    this.formulaPicker = page.locator('.hs-formula-picker').first();
    this.formulaSelect = page.locator('select.hs-formula-select').first();
    this.decimalInput = page.locator('input.hs-decimal-input, input[placeholder="0 - 10"]').first();
    this.sampleResultTable = page.locator('table').nth(3);
    this.sampleResultHeaders = this.sampleResultTable.locator('thead th');
    this.sampleResultRows = this.sampleResultTable.locator('tbody tr');
    this.averageRow = this.sampleResultTable.locator('tr:has-text("TB")').first();
    this.btnSignatureUpload = page.locator('button:has-text("+ Tải ảnh chữ ký")').first();

    // 5. Modal Trả lại Hồ sơ thử nghiệm (.tp-return-modal)
    this.returnModal = page.locator('.tp-return-modal').first();
    this.returnModalTitle = this.returnModal.locator('.modal-title').first();
    this.returnModalBody = this.returnModal.locator('.tp-return-body').first();
    this.returnReasonTextarea = this.returnModal.locator('textarea').first();
    this.btnReturnClose = this.returnModal.locator('button.modal-close').first();
    this.btnReturnCancel = this.returnModal.locator('button', { hasText: 'Đóng' }).first();
    this.btnReturnConfirm = this.returnModal.locator('button', { hasText: 'Xác nhận trả lại' }).first();
  }

  // ============================================================
  // Action Methods
  // ============================================================

  /**
   * Điều hướng trực tiếp tới màn hình Trưởng BP Kiểm tra
   */
  async open(path = '/truong-bo-phan-kiem-tra'): Promise<void> {
    Logger.info(`Điều hướng tới màn hình Trưởng BP Kiểm tra: ${path}`);
    await this.page.goto(path);
  }

  /**
   * Đóng/mở accordion thẻ YCTN
   */
  async toggleYctnAccordion(): Promise<void> {
    Logger.info('Nhấn vào thanh tiêu đề YCTN để đóng/mở nội dung chi tiết');
    await this.yctnAccordionHead.click();
  }

  /**
   * Chuyển đổi chip trạng thái (Chờ duyệt / Đã duyệt / Trả lại)
   */
  async selectStatusChip(status: 'cho-duyet' | 'da-duyet' | 'tra-lai'): Promise<void> {
    Logger.info(`Chọn chip trạng thái: "${status}"`);
    if (status === 'cho-duyet') {
      await this.chipChoDuyet.click();
    } else if (status === 'da-duyet') {
      await this.chipDaDuyet.click();
    } else if (status === 'tra-lai') {
      await this.chipTraLai.click();
    }
  }

  /**
   * Tìm kiếm theo từ khóa
   */
  async search(keyword: string): Promise<void> {
    Logger.info(`Tìm kiếm hồ sơ với từ khóa: "${keyword}"`);
    await this.searchInput.fill(keyword);
    await this.searchInput.press('Enter');
  }

  /**
   * Xóa từ khóa tìm kiếm bằng nút "Hủy"
   */
  async clearSearch(): Promise<void> {
    Logger.info('Nhấn nút "Hủy" để xóa bộ lọc tìm kiếm');
    await this.btnClearSearch.click();
  }

  /**
   * Tích chọn checkbox của một hồ sơ theo index
   */
  async checkHsRow(index: number): Promise<void> {
    Logger.info(`Tích chọn checkbox hồ sơ tại dòng index: ${index}`);
    await this.rowCheckboxes.nth(index).check();
  }

  /**
   * Bỏ tích chọn checkbox của một hồ sơ theo index
   */
  async uncheckHsRow(index: number): Promise<void> {
    Logger.info(`Bỏ tích chọn checkbox hồ sơ tại dòng index: ${index}`);
    await this.rowCheckboxes.nth(index).uncheck();
  }

  /**
   * Tích chọn/bỏ tích chọn checkbox chọn tất cả trên thead
   */
  async toggleSelectAllCheckbox(): Promise<void> {
    Logger.info('Nhấn chọn checkbox chọn tất cả (Select All) trên bảng');
    await this.selectAllCheckbox.click();
  }

  /**
   * Chọn một dòng hồ sơ để xem chi tiết biên bản
   */
  async selectHsRow(index: number): Promise<void> {
    Logger.info(`Nhấn chọn xem chi tiết hồ sơ tại dòng index: ${index}`);
    await this.hsTableRows.nth(index).click();
  }

  /**
   * Nhấn nút "Duyệt" hồ sơ
   */
  async clickApprove(): Promise<void> {
    Logger.info('Nhấn nút "Duyệt" hồ sơ thử nghiệm');
    await this.btnApprove.click();
  }

  /**
   * Nhấn nút "Trả lại" hồ sơ
   */
  async clickReject(): Promise<void> {
    Logger.info('Nhấn nút "Trả lại" hồ sơ thử nghiệm');
    await this.btnReject.click();
  }

  /**
   * Nhập lý do trả lại trong popup
   */
  async fillRejectReason(reason: string): Promise<void> {
    Logger.info(`Nhập lý do trả lại: "${reason}"`);
    await this.returnReasonTextarea.fill(reason);
  }

  /**
   * Nhấn nút "Xác nhận trả lại" trong popup
   */
  async confirmReject(): Promise<void> {
    Logger.info('Nhấn nút "Xác nhận trả lại" trong popup');
    await this.btnReturnConfirm.click();
  }

  /**
   * Nhấn nút "Đóng" đóng popup trả lại
   */
  async closeRejectModal(): Promise<void> {
    Logger.info('Nhấn nút "Đóng" để thoát popup trả lại');
    await this.btnReturnCancel.click();
  }

  /**
   * Chọn công thức tính từ dropdown
   */
  async selectFormula(valueOrLabel: string): Promise<void> {
    Logger.info(`Chọn công thức tính: "${valueOrLabel}"`);
    await this.formulaSelect.selectOption({ label: valueOrLabel }).catch(async () => {
      await this.formulaSelect.selectOption(valueOrLabel);
    });
  }

  /**
   * Nhập số chữ số làm tròn (0 đến 10)
   */
  async setDecimalRounding(digits: number | string): Promise<void> {
    Logger.info(`Nhập số chữ số thập phân làm tròn: ${digits}`);
    await this.decimalInput.fill(String(digits));
  }

  /**
   * Nhấn nút "Lưu" để lưu các thay đổi trên biên bản
   */
  async clickSave(): Promise<void> {
    Logger.info('Nhấn nút "Lưu" trên biên bản thử nghiệm');
    await this.btnSave.click();
  }

  /**
   * Nhập giá trị vào ô tham số tính toán của dòng mẫu
   */
  async setSampleParam(rowIndex: number, inputIndex: number, value: string): Promise<void> {
    Logger.info(`Nhập tham số dòng mẫu ${rowIndex}, input ${inputIndex}: "${value}"`);
    const row = this.sampleResultRows.nth(rowIndex);
    const inputs = row.locator('input.hs-inp.mono');
    await inputs.nth(inputIndex).fill(value);
  }

  /**
   * Nhập ghi chú cho dòng mẫu
   */
  async setSampleNote(rowIndex: number, note: string): Promise<void> {
    Logger.info(`Nhập ghi chú dòng mẫu ${rowIndex}: "${note}"`);
    const row = this.sampleResultRows.nth(rowIndex);
    const noteInput = row.locator('input[placeholder="Ghi chú"], input.hs-inp:not(.mono)');
    await noteInput.fill(note);
  }
}
