import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { Logger } from '../utils/logger';

/** Trạng thái phiếu kết quả hiển thị trên danh sách */
export type PkqStatus = 'Xong trước' | 'Đến hẹn' | 'Quá hẹn' | 'Draft' | 'In';
/** Chế độ hiển thị ngôn ngữ của phiếu */
export type PkqLang = 'VN' | 'EN' | 'Song ngữ';
/** Cột của bảng Kết quả thử nghiệm (theo thứ tự ô <td>) */
export type CtColumn = 'chiTieu' | 'donVi' | 'phuongPhap' | 'ketQua' | 'lod' | 'loq' | 'vilas' | 'tcqc' | 'thauPhu' | 'ghiChu';

/** Các trạng thái được phép chỉnh sửa trên màn Rà soát KQ */
export const EDITABLE_STATUSES: PkqStatus[] = ['Xong trước', 'Đến hẹn', 'Quá hẹn'];

/**
 * Page Object cho màn hình Rà soát kết quả (/ra-soat-kq)
 * Tuân thủ mô hình POM chuẩn: Locators semantic ở đầu class, method mô tả hành vi người dùng, KHÔNG chứa assertion.
 */
export class RaSoatKqPage extends BasePage {
  // ============================================================
  // 1. Header: Tab, Print, Xem trước
  // ============================================================
  readonly tabRaSoatKq: Locator;
  readonly tabDuyetPkq: Locator;
  readonly btnPrint: Locator;
  readonly previewToggle: Locator;
  readonly previewPage: Locator;

  // ============================================================
  // 2. Bộ lọc, tìm kiếm & danh sách bên trái
  // ============================================================
  readonly searchInput: Locator;
  readonly btnClearSearch: Locator;
  readonly listTable: Locator;
  readonly listRows: Locator;
  readonly listHeaderCheckbox: Locator;
  readonly listPager: Locator;
  readonly emptyListText: Locator;

  // ============================================================
  // 3. Thanh công cụ nút bấm
  // ============================================================
  readonly btnSave: Locator;
  readonly btnMerge: Locator;
  readonly btnSplit: Locator;
  readonly btnSend: Locator;

  // ============================================================
  // 4. Form chi tiết phiếu (panel giữa)
  // ============================================================
  readonly form: Locator;
  readonly langSelect: Locator;
  readonly statusBadge: Locator;
  readonly certChips: Locator;
  readonly ycKhInput: Locator;
  readonly yKienInput: Locator;
  readonly lockBanner: Locator;
  readonly fieldsets: Locator;

  // Ảnh đính kèm
  readonly imgSectionHead: Locator;
  readonly imgFileInput: Locator;
  readonly imgDeleteButtons: Locator;

  // Bảng Kết quả thử nghiệm
  readonly ctTable: Locator;
  readonly ctRows: Locator;
  readonly ctHeaders: Locator;
  readonly btnAddCriteria: Locator;
  readonly btnTogglePin: Locator;
  readonly ctPins: Locator;

  // Ghi chú phiếu & gợi ý
  readonly btnAddNote: Locator;
  readonly btnPickNote: Locator;
  readonly noteRows: Locator;
  readonly notePopover: Locator;
  readonly hintSection: Locator;
  readonly hintTextareas: Locator;

  // ============================================================
  // 5. Hộp thoại Gộp mẫu / Tách phiếu / Xác nhận gửi duyệt
  // ============================================================
  readonly mergeModal: Locator;
  readonly mergeNameVn: Locator;
  readonly mergeNameEn: Locator;
  readonly mergeDescription: Locator;
  readonly mergeReason: Locator;
  readonly mergeCancel: Locator;
  readonly mergeConfirm: Locator;
  readonly mergeClose: Locator;

  readonly splitModal: Locator;
  readonly splitCheckboxes: Locator;
  readonly splitCancel: Locator;
  readonly splitConfirm: Locator;
  readonly splitClose: Locator;

  readonly sendModal: Locator;
  readonly sendCancel: Locator;
  readonly sendConfirm: Locator;

  constructor(page: Page) {
    super(page);

    // 1. Header
    this.tabRaSoatKq = page.locator('button.tab', { hasText: 'RÀ SOÁT KQ' }).first();
    this.tabDuyetPkq = page.locator('button.tab', { hasText: 'DUYỆT PKQ' }).first();
    this.btnPrint = page.locator('button[title="In PKQ đang chọn"]').first();
    this.previewToggle = page.locator('.xpkq-toggle').first();
    this.previewPage = page.locator('.pkq-pp-page:visible').first();

    // 2. Bộ lọc & danh sách
    this.searchInput = page.locator('input[placeholder*="Tìm: mã YCTN"]').first();
    this.btnClearSearch = page.locator('button.clear-btn').first();
    this.listTable = page.locator('.xpkq-left table').first();
    this.listRows = this.listTable.locator('tbody tr.px-row');
    this.listHeaderCheckbox = this.listTable.locator('thead input.cb').first();
    this.listPager = page.locator('.xpkq-left .pager-left').first();
    this.emptyListText = page.getByText('Không có PKQ phù hợp.').first();

    // 3. Thanh công cụ
    this.btnSave = page.getByRole('button', { name: 'Lưu', exact: true }).first();
    this.btnMerge = page.getByRole('button', { name: 'Gộp mẫu', exact: true }).first();
    this.btnSplit = page.getByRole('button', { name: 'Tách phiếu', exact: true }).first();
    this.btnSend = page.getByRole('button', { name: 'Gửi duyệt', exact: true }).first();

    // 4. Form chi tiết
    this.form = page.locator('.pkq-form').first();
    this.langSelect = page.locator('select.pkq-lang').first();
    this.statusBadge = this.form.locator('.pkq-header-row1 .stat').first();
    this.certChips = this.form.locator('button.pkq-nktn-chip');
    this.ycKhInput = this.form.locator('.pkq-yc-row').filter({ hasText: 'YC của KH' }).locator('input');
    this.yKienInput = this.form.locator('.pkq-yc-row').filter({ hasText: 'Ý kiến' }).locator('input');
    this.lockBanner = page.getByText(/Phiếu kết quả ở trạng thái (Draft|In) không thể cập nhật hoặc thay đổi thông tin\./).first();
    this.fieldsets = this.form.locator('fieldset.pkq-readonly-fieldset');

    this.imgSectionHead = this.form.locator('.pkq-sec-head').filter({ hasText: 'Hình ảnh đính kèm' }).first();
    this.imgFileInput = this.form.locator('input[type="file"]').first();
    this.imgDeleteButtons = this.form.locator('button.pkq-img-del-btn');

    this.ctTable = this.form.locator('table.pkq-ct-tbl').first();
    this.ctRows = this.ctTable.locator('tbody tr');
    this.ctHeaders = this.ctTable.locator('thead th');
    this.btnAddCriteria = this.form.locator('button.pkq-add-btn').first();
    this.btnTogglePin = this.form.locator('button.pkq-pin-btn').first();
    this.ctPins = this.ctTable.locator('.pkq-pin');

    this.btnAddNote = this.form.getByRole('button', { name: '+ Thêm ghi chú' }).first();
    this.btnPickNote = this.form.getByRole('button', { name: /Chọn ghi chú có sẵn/ }).first();
    this.noteRows = this.form.locator('.pkq-note-row');
    this.notePopover = page.locator('.popover__panel').first();
    this.hintSection = this.form.locator('.pkq-sec-hint').first();
    this.hintTextareas = this.hintSection.locator('textarea');

    // 5. Hộp thoại
    this.mergeModal = page.locator('section.modal[aria-labelledby="test-result-merge-title"]').first();
    this.mergeNameVn = this.mergeModal.locator('input[placeholder^="Nhập tên mẫu thử nghiệm"]');
    this.mergeNameEn = this.mergeModal.locator('input[placeholder^="Sample name in English"]');
    this.mergeDescription = this.mergeModal.locator('textarea');
    this.mergeReason = this.mergeModal.locator('input[placeholder^="Ví dụ: Gộp mẫu"]');
    this.mergeCancel = this.mergeModal.locator('.modal-foot button', { hasText: 'Hủy' });
    this.mergeConfirm = this.mergeModal.locator('.modal-foot button.btn-primary');
    this.mergeClose = this.mergeModal.locator('button.modal-close');

    this.splitModal = page.locator('section.modal[aria-labelledby="test-result-split-title"]').first();
    this.splitCheckboxes = this.splitModal.locator('tbody input[type="checkbox"]');
    this.splitCancel = this.splitModal.locator('.modal-foot button', { hasText: 'Hủy' });
    this.splitConfirm = this.splitModal.locator('.modal-foot button.btn-primary');
    this.splitClose = this.splitModal.locator('button.modal-close');

    this.sendModal = page.locator('section.modal, .modal').filter({ hasText: 'Xác nhận gửi duyệt phiếu kết quả' }).first();
    this.sendCancel = this.sendModal.getByRole('button', { name: 'Hủy', exact: true });
    this.sendConfirm = this.sendModal.getByRole('button', { name: 'Xác nhận gửi duyệt' });
  }

  // ============================================================
  // Điều hướng & danh sách
  // ============================================================

  /** Điều hướng tới màn hình Rà soát KQ và đợi danh sách tải xong */
  async open(path = '/ra-soat-kq'): Promise<void> {
    Logger.info(`Điều hướng tới màn hình Rà soát KQ: ${path}`);
    await this.page.goto(path);
    await this.waitForList();
  }

  /** Đợi danh sách phiếu kết quả hiển thị dữ liệu */
  async waitForList(): Promise<void> {
    await this.listTable.waitFor({ state: 'visible', timeout: 20000 });
    await this.page.waitForLoadState('networkidle');
    await this.listRows.first().waitFor({ state: 'visible', timeout: 20000 });
  }

  /** Tải lại trang để bỏ toàn bộ thay đổi chưa lưu */
  async reload(): Promise<void> {
    Logger.info('Tải lại trang Rà soát KQ');
    await this.page.reload();
    await this.waitForList();
  }

  /** Dòng danh sách theo mã phiếu (DVxxxxxxxxx/xx) */
  rowByCode(code: string): Locator {
    return this.listRows.filter({ hasText: code }).first();
  }

  /** Dòng danh sách đầu tiên theo trạng thái */
  rowByStatus(status: PkqStatus): Locator {
    return this.listRows.filter({ has: this.page.locator('.stat', { hasText: new RegExp(`^\\s*${status}\\s*$`) }) }).first();
  }

  /** Tất cả dòng danh sách theo trạng thái */
  rowsByStatus(status: PkqStatus): Locator {
    return this.listRows.filter({ has: this.page.locator('.stat', { hasText: new RegExp(`^\\s*${status}\\s*$`) }) });
  }

  /** Lấy mã phiếu (DV...) từ một dòng */
  async getRowPkqCode(row: Locator): Promise<string> {
    const text = (await row.innerText()).replace(/\s+/g, ' ');
    const match = text.match(/DV\d+\/\d+/);
    return match ? match[0] : '';
  }

  /** Lấy mã YCTN (TR...) từ một dòng */
  async getRowYctnCode(row: Locator): Promise<string> {
    const text = (await row.innerText()).replace(/\s+/g, ' ');
    const match = text.match(/TR\d+/);
    return match ? match[0] : '';
  }

  /** Lấy trạng thái từ một dòng */
  async getRowStatus(row: Locator): Promise<string> {
    return (await row.locator('.stat').first().innerText()).trim();
  }

  /** Nhấn vào một dòng để mở chi tiết phiếu ở panel giữa */
  async selectRow(row: Locator): Promise<string> {
    const code = await this.getRowPkqCode(row);
    Logger.info(`Chọn xem chi tiết phiếu: ${code}`);
    await row.locator('td').nth(1).click();
    await this.form.locator('.pkq-header-row1 .pkq-hdr-dv', { hasText: code }).waitFor({ state: 'visible', timeout: 15000 });
    return code;
  }

  /** Mở chi tiết phiếu theo mã phiếu */
  async selectRowByCode(code: string): Promise<void> {
    await this.selectRow(this.rowByCode(code));
  }

  /** Tích chọn checkbox của một dòng */
  async checkRow(row: Locator): Promise<void> {
    await row.locator('input.cb').check();
  }

  /** Bỏ tích chọn checkbox của một dòng */
  async uncheckRow(row: Locator): Promise<void> {
    await row.locator('input.cb').uncheck();
  }

  /** Bỏ tích chọn toàn bộ các dòng đang được chọn */
  async uncheckAllRows(): Promise<void> {
    const checked = this.listRows.locator('input.cb:checked');
    while ((await checked.count()) > 0) {
      await checked.first().uncheck();
    }
  }

  /** Số dòng đang được tích chọn */
  async countCheckedRows(): Promise<number> {
    return await this.listRows.locator('input.cb:checked').count();
  }

  /** Chip trạng thái theo tên */
  chip(status: PkqStatus): Locator {
    return this.page.locator('button.bg-chiptab', { hasText: status }).first();
  }

  /** Nhấn chip trạng thái để lọc (nhấn lần nữa để bỏ lọc) */
  async clickChip(status: PkqStatus): Promise<void> {
    Logger.info(`Nhấn chip trạng thái: ${status}`);
    await this.chip(status).click();
    await this.page.waitForTimeout(800);
    await this.page.waitForLoadState('networkidle');
  }

  /** Đọc số lượng hiển thị trên chip trạng thái */
  async getChipCount(status: PkqStatus): Promise<number> {
    const text = await this.chip(status).innerText();
    const match = text.match(/(\d+)\s*$/);
    return match ? parseInt(match[1], 10) : -1;
  }

  /** Danh sách trạng thái các dòng đang hiển thị */
  async getListStatuses(): Promise<string[]> {
    const texts = await this.listRows.locator('.stat').allInnerTexts();
    return texts.map(t => t.trim());
  }

  /** Tìm kiếm theo từ khóa */
  async search(keyword: string): Promise<void> {
    Logger.info(`Tìm kiếm: "${keyword}"`);
    await this.searchInput.fill(keyword);
    await this.page.waitForLoadState('networkidle');
  }

  /** Nhấn nút "Hủy" xóa tìm kiếm */
  async clearSearch(): Promise<void> {
    Logger.info('Nhấn nút "Hủy" để xóa tìm kiếm');
    await this.btnClearSearch.click();
    await this.page.waitForLoadState('networkidle');
  }

  /** Tìm một dòng đầu tiên có trạng thái được phép sửa (ưu tiên Xong trước) */
  async findEditableRow(): Promise<Locator | null> {
    for (const status of EDITABLE_STATUSES) {
      const row = this.rowByStatus(status);
      if ((await row.count()) > 0) return row;
    }
    return null;
  }

  /** Mở phiếu đầu tiên ở trạng thái được phép sửa, trả về mã phiếu (null nếu không có) */
  async openEditableRecord(): Promise<string | null> {
    const row = await this.findEditableRow();
    if (!row) return null;
    return await this.selectRow(row);
  }

  /** Mở phiếu đầu tiên theo trạng thái, trả về mã phiếu (null nếu không có) */
  async openRecordByStatus(status: PkqStatus): Promise<string | null> {
    const row = this.rowByStatus(status);
    if ((await row.count()) === 0) return null;
    return await this.selectRow(row);
  }

  /**
   * Tìm cặp phiếu ở trạng thái được phép sửa, cùng mã YCTN (điều kiện để Gộp mẫu).
   * Trả về cặp mã phiếu hoặc null nếu dữ liệu không có.
   */
  async findMergeablePair(): Promise<[string, string] | null> {
    const total = await this.listRows.count();
    const map = new Map<string, string[]>();
    for (let i = 0; i < total; i++) {
      const row = this.listRows.nth(i);
      const status = await this.getRowStatus(row);
      if (!EDITABLE_STATUSES.includes(status as PkqStatus)) continue;
      const tr = await this.getRowYctnCode(row);
      const dv = await this.getRowPkqCode(row);
      map.set(tr, [...(map.get(tr) || []), dv]);
    }
    // Ưu tiên TR152300006 nếu có (ví dụ 2 mẫu cà chua & bắp cải)
    if (map.has('TR152300006') && (map.get('TR152300006') || []).length >= 2) {
      const codes = map.get('TR152300006')!;
      return [codes[0], codes[1]];
    }
    for (const codes of map.values()) {
      if (codes.length >= 2) return [codes[0], codes[1]];
    }
    return null;
  }

  /** Tìm 2 phiếu ở trạng thái được phép sửa nhưng khác mã YCTN */
  async findDifferentYctnPair(): Promise<[string, string] | null> {
    const total = await this.listRows.count();
    const seen = new Map<string, string>();
    for (let i = 0; i < total; i++) {
      const row = this.listRows.nth(i);
      const status = await this.getRowStatus(row);
      if (!EDITABLE_STATUSES.includes(status as PkqStatus)) continue;
      const tr = await this.getRowYctnCode(row);
      const dv = await this.getRowPkqCode(row);
      if (!seen.has(tr)) seen.set(tr, dv);
      if (seen.size >= 2) return [...seen.values()].slice(0, 2) as [string, string];
    }
    return null;
  }

  /** Tìm phiếu ở trạng thái được phép tách (có từ 2 chỉ tiêu trở lên) */
  async findSplittableRecord(): Promise<string | null> {
    const total = await this.listRows.count();
    for (let i = 0; i < total; i++) {
      const row = this.listRows.nth(i);
      const status = await this.getRowStatus(row);
      if (!EDITABLE_STATUSES.includes(status as PkqStatus)) continue;
      await this.checkRow(row);
      const disabled = await this.btnSplit.isDisabled();
      await this.uncheckRow(row);
      if (!disabled) return await this.getRowPkqCode(row);
    }
    return null;
  }

  // ============================================================
  // Form chi tiết
  // ============================================================

  /** Chọn chế độ ngôn ngữ của phiếu (VN / EN / Song ngữ) */
  async selectLanguage(lang: PkqLang): Promise<void> {
    Logger.info(`Chọn chế độ ngôn ngữ phiếu: ${lang}`);
    await this.langSelect.selectOption(lang);
  }

  /** Khối trường theo nhãn (vd: "Tên KH", "Ngày trả KQ") */
  field(label: string): Locator {
    return this.form
      .locator('.pkq-field, .pkq-field-half')
      .filter({ has: this.page.locator('label.pkq-label', { hasText: label }) })
      .first();
  }

  /** Ô nhập của trường song ngữ theo ngôn ngữ (VN / EN) */
  bilingualInput(label: string, lang: 'VN' | 'EN'): Locator {
    return this.field(label)
      .locator('.pkq-bi-cell')
      .filter({ has: this.page.locator('.pkq-bi-tag', { hasText: new RegExp(`^${lang}$`) }) })
      .locator('input, textarea')
      .first();
  }

  /** Ô nhập của trường đơn ngữ (ngày, số lượng) */
  singleInput(label: string): Locator {
    return this.field(label).locator('input').first();
  }

  /** Các thẻ ngôn ngữ (VN / EN) đang hiển thị ở một trường */
  async getFieldLangTags(label: string): Promise<string[]> {
    const tags = await this.field(label).locator('.pkq-bi-tag').allInnerTexts();
    return tags.map(t => t.trim());
  }

  /** Nhập giá trị vào trường song ngữ */
  async fillBilingual(label: string, lang: 'VN' | 'EN', value: string): Promise<void> {
    Logger.info(`Nhập "${label}" (${lang}): "${value}"`);
    await this.bilingualInput(label, lang).fill(value);
  }

  /** Nhập giá trị vào trường đơn ngữ */
  async fillSingle(label: string, value: string): Promise<void> {
    Logger.info(`Nhập "${label}": "${value}"`);
    await this.singleInput(label).fill(value);
  }

  /** Nhấn nút "Lưu" */
  async clickSave(): Promise<void> {
    Logger.info('Nhấn nút "Lưu"');
    await this.btnSave.click();
  }

  /** Thông báo lưu thành công của một phiếu */
  saveSuccessToast(code: string): Locator {
    return this.page.getByText(`Đã lưu thay đổi phiếu kết quả ${code} thành công`).first();
  }

  /** Thông báo lỗi khi lưu */
  get saveErrorToast(): Locator {
    return this.page.getByText('Lỗi khi lưu phiếu kết quả').first();
  }

  /** Số lượng ảnh hiển thị trên tiêu đề "Hình ảnh đính kèm (n/10)" */
  async getImageCount(): Promise<number> {
    const text = await this.imgSectionHead.innerText();
    const match = text.match(/\((\d+)\/10\)/);
    return match ? parseInt(match[1], 10) : -1;
  }

  /** Tải ảnh lên bằng dữ liệu bộ nhớ (không cần file thật) */
  async uploadImages(files: { name: string; mimeType: string; buffer: Buffer }[]): Promise<void> {
    Logger.info(`Tải lên ${files.length} tệp đính kèm`);
    await this.imgFileInput.setInputFiles(files);
  }

  /** Nhấn công tắc "Xem trước" */
  async togglePreview(): Promise<void> {
    Logger.info('Nhấn công tắc "Xem trước"');
    await this.previewToggle.click();
  }

  /** Công tắc "Xem trước" có đang bật không */
  async isPreviewOn(): Promise<boolean> {
    const cls = (await this.previewToggle.getAttribute('class')) || '';
    return /\bon\b/.test(cls);
  }

  /** Nhấn nút "Print" (đã chặn hộp thoại in của trình duyệt, trả về số lần gọi in) */
  async clickPrintAndCount(): Promise<number> {
    await this.page.evaluate(() => {
      (window as any).__printCalls = 0;
      window.print = () => {
        (window as any).__printCalls += 1;
      };
    });
    Logger.info('Nhấn nút "Print"');
    await this.btnPrint.click();
    return await this.page.evaluate(() => (window as any).__printCalls as number);
  }

  // ============================================================
  // Chứng nhận & Ý kiến
  // ============================================================

  /** Thẻ chứng nhận theo tên (Quản lý NN, CN HQ, Vimcerts, ...) */
  certChip(name: string): Locator {
    return this.certChips.filter({ hasText: new RegExp(`^\\s*${name}\\s*$`) }).first();
  }

  /** Nhấn thẻ chứng nhận */
  async clickCertChip(name: string): Promise<void> {
    Logger.info(`Nhấn thẻ chứng nhận: ${name}`);
    await this.certChip(name).click();
  }

  /** Thẻ chứng nhận đang ở trạng thái chọn không (dựa trên thay đổi class) */
  async getCertChipClass(name: string): Promise<string> {
    return (await this.certChip(name).getAttribute('class')) || '';
  }

  // ============================================================
  // Bảng Kết quả thử nghiệm
  // ============================================================

  private static readonly COLUMN_INDEX: Record<CtColumn, number> = {
    chiTieu: 3,
    donVi: 4,
    phuongPhap: 5,
    ketQua: 6,
    lod: 7,
    loq: 8,
    vilas: 9,
    tcqc: 10,
    thauPhu: 11,
    ghiChu: 12,
  };

  /** Ô <td> của bảng kết quả theo dòng và cột */
  ctCell(rowIndex: number, column: CtColumn): Locator {
    return this.ctRows.nth(rowIndex).locator('td').nth(RaSoatKqPage.COLUMN_INDEX[column]);
  }

  /** Ô nhập của bảng kết quả (cột song ngữ chọn theo VN/EN, cột đơn lấy input đầu tiên) */
  ctInput(rowIndex: number, column: CtColumn, lang: 'VN' | 'EN' = 'VN'): Locator {
    const cell = this.ctCell(rowIndex, column);
    if (['chiTieu', 'donVi', 'ketQua'].includes(column)) {
      return cell.locator(lang === 'VN' ? '.pkq-bi-vn input' : '.pkq-bi-en input').first();
    }
    return cell.locator('input').first();
  }

  /** Nhập giá trị vào một ô của bảng kết quả */
  async fillCt(rowIndex: number, column: CtColumn, value: string, lang: 'VN' | 'EN' = 'VN'): Promise<void> {
    Logger.info(`Nhập bảng kết quả dòng ${rowIndex + 1}, cột ${column} (${lang}): "${value}"`);
    await this.ctInput(rowIndex, column, lang).fill(value);
  }

  /** Nhấn nút "+ Thêm chỉ tiêu" */
  async clickAddCriteria(): Promise<void> {
    Logger.info('Nhấn nút "+ Thêm chỉ tiêu"');
    await this.btnAddCriteria.click();
  }

  /** Nhấn nút xóa (×) ở cuối dòng chỉ tiêu */
  async deleteCriteria(rowIndex: number): Promise<void> {
    Logger.info(`Nhấn nút xóa chỉ tiêu dòng ${rowIndex + 1}`);
    await this.ctRows.nth(rowIndex).locator('button.pkq-x').click();
  }

  /** Nhấn nút "📌 Hiện ghi chú / Ẩn ghi chú" */
  async clickTogglePin(): Promise<void> {
    Logger.info('Nhấn nút ẩn/hiện ghi chú chỉ tiêu');
    await this.btnTogglePin.click();
  }

  // ============================================================
  // Ghi chú phiếu
  // ============================================================

  /** Nhấn nút "+ Thêm ghi chú" */
  async clickAddNote(): Promise<void> {
    Logger.info('Nhấn nút "+ Thêm ghi chú"');
    await this.btnAddNote.click();
  }

  /** Nhập nội dung ghi chú tại một dòng ghi chú */
  async fillNote(index: number, vn: string, en?: string): Promise<void> {
    Logger.info(`Nhập ghi chú dòng ${index + 1}: VN="${vn}", EN="${en || ''}"`);
    const vnInput = this.noteRows.nth(index).locator('input[placeholder="Ghi chú VN"], input.pkq-inp').first();
    await vnInput.fill(vn);
    if (en) {
      const enInput = this.noteRows.nth(index).locator('input[placeholder="Note EN"]');
      if (await enInput.isVisible().catch(() => false)) {
        await enInput.fill(en);
      }
    }
  }

  /** Nhấn nút xóa (×) của một dòng ghi chú */
  async deleteNote(index: number): Promise<void> {
    Logger.info(`Nhấn nút xóa ghi chú dòng ${index + 1}`);
    await this.noteRows.nth(index).locator('button.pkq-x').click();
  }

  /** Nhấn nút "Chọn ghi chú có sẵn" để mở danh sách */
  async openNotePicker(): Promise<void> {
    Logger.info('Nhấn nút "Chọn ghi chú có sẵn"');
    await this.btnPickNote.click();
  }

  /** Chọn một ghi chú có sẵn theo nội dung hiển thị */
  async pickNote(text: string): Promise<void> {
    Logger.info(`Chọn ghi chú có sẵn: "${text}"`);
    await this.notePopover.getByText(text, { exact: false }).first().click();
  }

  // ============================================================
  // Hộp thoại Gộp mẫu / Tách phiếu / Gửi duyệt
  // ============================================================

  /** Nhấn nút "Gộp mẫu" */
  async clickMerge(): Promise<void> {
    Logger.info('Nhấn nút "Gộp mẫu"');
    await this.btnMerge.click();
  }

  /** Nhấn nút "Tách phiếu" */
  async clickSplit(): Promise<void> {
    Logger.info('Nhấn nút "Tách phiếu"');
    await this.btnSplit.click();
  }

  /** Nhấn nút "Gửi duyệt" */
  async clickSend(): Promise<void> {
    Logger.info('Nhấn nút "Gửi duyệt"');
    await this.btnSend.click();
  }

  /** Chọn hai phiếu (tích checkbox) rồi mở hộp thoại Gộp mẫu */
  async openMergeModal(codeA: string, codeB: string): Promise<void> {
    await this.uncheckAllRows();
    await this.checkRow(this.rowByCode(codeA));
    await this.checkRow(this.rowByCode(codeB));
    await this.clickMerge();
    await this.mergeModal.waitFor({ state: 'visible', timeout: 10000 });
  }

  /** Chọn một phiếu (tích checkbox) rồi mở hộp thoại Tách phiếu */
  async openSplitModal(code: string): Promise<void> {
    await this.uncheckAllRows();
    await this.checkRow(this.rowByCode(code));
    await this.clickSplit();
    await this.splitModal.waitFor({ state: 'visible', timeout: 10000 });
  }

  /** Chọn một phiếu (tích checkbox) rồi mở hộp thoại Xác nhận gửi duyệt */
  async openSendModal(code: string): Promise<void> {
    await this.uncheckAllRows();
    await this.checkRow(this.rowByCode(code));
    await this.clickSend();
    await this.sendModal.waitFor({ state: 'visible', timeout: 10000 });
  }

  /** Nội dung văn bản của hộp thoại (gộp khoảng trắng) */
  async getModalText(modal: Locator): Promise<string> {
    return (await modal.innerText()).replace(/\s+/g, ' ').trim();
  }
}

