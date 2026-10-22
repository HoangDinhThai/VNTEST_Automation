import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { Logger } from '../utils/logger';

/**
 * Page Object Model cho màn hình Tiếp nhận Yêu cầu thử nghiệm (/tiep-nhan-yctn)
 * Lưu ý: KHÔNG sử dụng expect() trong Page Object.
 */
export class TestRequestReceptionPage extends BasePage {
  // ==========================================
  // 1. THANH TAB CHUYỂN ĐỔI
  // ==========================================
  readonly bgAndYctnTab: Locator;
  readonly receiveYctnTab: Locator;

  // ==========================================
  // 2. THANH CHIP TRẠNG THÁI & BỘ LỌC NGÀY
  // ==========================================
  readonly chipAll: Locator;
  readonly chipYctnPending: Locator;
  readonly chipYctnSupplement: Locator;
  readonly chipYctnApproved: Locator;
  readonly chipUnattached: Locator;

  readonly dateTypeFilterButton: Locator;
  readonly fromDateButton: Locator;
  readonly toDateButton: Locator;
  readonly clearDateFilterButton: Locator;
  readonly searchInput: Locator;

  // ==========================================
  // 3. CÁC NÚT HÀNH ĐỘNG TRÊN THANH CÔNG CỤ (4 NÚT)
  // ==========================================
  readonly approveButton: Locator;
  readonly requestSupplementButton: Locator;
  readonly editButton: Locator;
  readonly attachButton: Locator;

  // ==========================================
  // 4. BẢNG DANH SÁCH BÊN TRÁI & PHÂN TRANG
  // ==========================================
  readonly table: Locator;
  readonly tableHeaders: Locator;
  readonly selectAllCheckbox: Locator;
  readonly rows: Locator;
  readonly firstRow: Locator;
  readonly paginationInfo: Locator;
  readonly manageColumnsButton: Locator;
  readonly manageColumnsPopover: Locator;

  // ==========================================
  // 5. KHUNG CHI TIẾT / FORM BÊN PHẢI (8 PHẦN)
  // ==========================================
  readonly emptyDetailPlaceholder: Locator;
  readonly form: Locator;
  readonly readonlyBanner: Locator;
  readonly cancelFormButton: Locator;
  readonly saveFormButton: Locator;

  readonly section1General: Locator;
  readonly section2Invoice: Locator;
  readonly section3Additional: Locator;
  readonly section4Other: Locator;
  readonly section5Criteria: Locator;
  readonly section6Internal: Locator;
  readonly section7Summary: Locator;
  readonly section8Regulations: Locator;

  // Các trường trong Phần 1 (Thông tin chung)
  readonly quotationCodeInput: Locator;
  readonly yctnCodeInput: Locator;

  // Các trường trong Phần 6 (Thông tin nội bộ)
  readonly internalTestingDaysInput: Locator;
  readonly internalEarlyDaysInput: Locator;
  readonly internalExcludeWeekendCheckbox: Locator;
  readonly internalReceivedDateTrigger: Locator;
  readonly internalDueDateInput: Locator;
  readonly internalAnalysisDueDateTrigger: Locator;
  readonly internalSessionMorningRadio: Locator;
  readonly internalSessionAfternoonRadio: Locator;
  readonly internalCertificateVilasRadio: Locator;
  readonly internalCertificateVimcertsRadio: Locator;
  readonly internalNoteTextarea: Locator;

  // ==========================================
  // 6. CÁC HỘP THOẠI (DUYỆT, YC BỔ SUNG, ĐÍNH KÈM) & TOAST
  // ==========================================
  // Hộp thoại Duyệt YCTN
  readonly approveModal: Locator;
  readonly approveModalTitle: Locator;
  readonly approveModalEffects: Locator;
  readonly approveModalTableRows: Locator;
  readonly approveModalCancelButton: Locator;
  readonly approveModalConfirmButton: Locator;

  // Hộp thoại Yêu cầu bổ sung
  readonly supplementModal: Locator;
  readonly supplementModalTitle: Locator;
  readonly supplementModalHint: Locator;
  readonly supplementReasonTextarea: Locator;
  readonly supplementCharCount: Locator;
  readonly supplementModalCancelButton: Locator;
  readonly supplementModalConfirmButton: Locator;

  // Hộp thoại Tệp đính kèm
  readonly attachmentModal: Locator;
  readonly attachmentModalTitle: Locator;
  readonly attachmentModalInfo: Locator;
  readonly attachmentDropzone: Locator;
  readonly attachmentFileInput: Locator;
  readonly attachmentEmptyNote: Locator;
  readonly attachmentModalCancelButton: Locator;
  readonly attachmentModalSaveButton: Locator;

  readonly toastMessages: Locator;

  constructor(page: Page) {
    super(page);

    // 1. Thanh tab
    this.bgAndYctnTab = page.locator('button.tab', { hasText: 'BG & YCTN' });
    this.receiveYctnTab = page.locator('button.tab', { hasText: 'TIẾP NHẬN YCTN' });

    // 2. Chip trạng thái & Bộ lọc
    this.chipAll = page.locator('button.bg-chiptab').filter({ hasText: /^Tất cả/ });
    this.chipYctnPending = page.locator('button.bg-chiptab').filter({ hasText: /^YCTN CD/ });
    this.chipYctnSupplement = page.locator('button.bg-chiptab').filter({ hasText: /^YCTN BS/ });
    this.chipYctnApproved = page.locator('button.bg-chiptab').filter({ hasText: /^YCTN DD/ });
    this.chipUnattached = page.locator('button.bg-chiptab').filter({ hasText: /^Chưa Attach/ });

    this.dateTypeFilterButton = page.locator('button.from-to-date-filter__label-trigger');
    this.fromDateButton = page.locator('button.date-filter-segment__trigger').nth(0);
    this.toDateButton = page.locator('button.date-filter-segment__trigger').nth(1);
    this.clearDateFilterButton = page.locator('button.from-to-date-filter__clear').first();
    this.searchInput = page.locator('input[placeholder*="mã YCTN, mã BG"]');

    // 3. Các nút hành động trên thanh công cụ
    this.approveButton = page.getByRole('button', { name: 'Duyệt', exact: true }).first();
    this.requestSupplementButton = page.getByRole('button', { name: 'YC Bổ sung', exact: true }).first();
    this.editButton = page.getByRole('button', { name: 'Sửa', exact: true }).first();
    this.attachButton = page.getByRole('button', { name: 'Đính kèm', exact: true }).first();

    // 4. Bảng danh sách
    this.table = page.locator('table').first();
    this.tableHeaders = this.table.locator('thead th');
    this.selectAllCheckbox = this.table.locator('thead input.cb').first();
    this.rows = this.table.locator('tbody tr');
    this.firstRow = this.rows.first();
    this.paginationInfo = page.locator('text=/Hiện \\d+–\\d+ \\/ \\d+ YCTN/i').first();
    this.manageColumnsButton = page.locator('button.px-column-manager-trigger').first();
    this.manageColumnsPopover = page.locator('.popover__content, .px-column-manager-popover').first();

    // 5. Khung chi tiết / Form bên phải (8 phần)
    this.emptyDetailPlaceholder = page.locator('text=Chưa chọn báo giá/yêu cầu thử nghiệm.').first();
    this.form = page.locator('form').first();
    this.readonlyBanner = page.locator('[role="status"], .trq-banner').filter({ hasText: /không cho phép sửa/i }).first();
    this.cancelFormButton = page.locator('form button').filter({ hasText: /^Huỷ$|^Hủy$/ }).first();
    this.saveFormButton = page.locator('form button.btn-primary').filter({ hasText: /^Lưu$/ }).first();

    this.section1General = page.locator('.trq-section').nth(0);
    this.section2Invoice = page.locator('.trq-section').nth(1);
    this.section3Additional = page.locator('.trq-section').nth(2);
    this.section4Other = page.locator('.trq-section').nth(3);
    this.section5Criteria = page.locator('.trq-section').nth(4);
    this.section6Internal = page.locator('.trq-section').nth(5);
    this.section7Summary = page.locator('.trq-section').nth(6);
    this.section8Regulations = page.locator('.trq-section').nth(7);

    // Phần 1
    this.quotationCodeInput = this.section1General.locator('label:has-text("Mã báo giá") input');
    this.yctnCodeInput = this.section1General.locator('label:has-text("Mã yêu cầu thử nghiệm") input');

    // Phần 6: Thông tin nội bộ
    this.internalTestingDaysInput = this.section6Internal.locator('label:has-text("Số ngày kiểm") input[type="number"]').first();
    this.internalEarlyDaysInput = this.section6Internal.locator('label:has-text("Số ngày trả sớm") input[type="number"]').first();
    this.internalExcludeWeekendCheckbox = this.section6Internal.locator('label:has-text("Ngày làm việc") input[type="checkbox"]');
    this.internalReceivedDateTrigger = this.section6Internal.locator('label:has-text("Ngày nhận") .custom-date-input__trigger');
    this.internalDueDateInput = this.section6Internal.locator('label:has-text("Ngày hẹn trả") input').first();
    this.internalAnalysisDueDateTrigger = this.section6Internal.locator('label:has-text("Ngày hẹn trả phân tích") .custom-date-input__trigger');
    this.internalSessionMorningRadio = this.section6Internal.locator('input[name="test-request-analysis-session"][value="morning"]');
    this.internalSessionAfternoonRadio = this.section6Internal.locator('input[name="test-request-analysis-session"][value="afternoon"]');
    this.internalCertificateVilasRadio = this.section6Internal.locator('label:has-text("Vilas") input[type="radio"]');
    this.internalCertificateVimcertsRadio = this.section6Internal.locator('label:has-text("Vimcerts") input[type="radio"]');
    this.internalNoteTextarea = this.section6Internal.locator('label:has-text("Lưu ý phiếu kiểm nghiệm") textarea');

    // 6. Hộp thoại Duyệt YCTN
    this.approveModal = page.locator('.modal.test-request-approve-modal');
    this.approveModalTitle = this.approveModal.locator('#test-request-approve-title');
    this.approveModalEffects = this.approveModal.locator('.test-request-approve-effects li');
    this.approveModalTableRows = this.approveModal.locator('.test-request-action-table tbody tr');
    this.approveModalCancelButton = this.approveModal.locator('footer button').filter({ hasText: /^Hủy$|^Huỷ$/ }).first();
    this.approveModalConfirmButton = this.approveModal.locator('footer button.btn-primary').filter({ hasText: /^Duyệt$/ }).first();

    // Hộp thoại Yêu cầu bổ sung
    this.supplementModal = page.locator('.modal.test-request-supplement-modal');
    this.supplementModalTitle = this.supplementModal.locator('#test-request-supplement-title');
    this.supplementModalHint = this.supplementModal.locator('.test-request-supplement-hint');
    this.supplementReasonTextarea = this.supplementModal.locator('#test-request-supplement-reason');
    this.supplementCharCount = this.supplementModal.locator('.test-request-supplement-count');
    this.supplementModalCancelButton = this.supplementModal.locator('footer button').filter({ hasText: /^Hủy$|^Huỷ$/ }).first();
    this.supplementModalConfirmButton = this.supplementModal.locator('footer button.btn-warn').filter({ hasText: /YC Bổ sung/i }).first();

    // Hộp thoại Tệp đính kèm
    this.attachmentModal = page.locator('.modal.test-request-attachment-modal');
    this.attachmentModalTitle = this.attachmentModal.locator('#test-request-attachment-title');
    this.attachmentModalInfo = this.attachmentModal.locator('.modal-info');
    this.attachmentDropzone = this.attachmentModal.locator('button.test-request-attachment-dropzone');
    this.attachmentFileInput = this.attachmentModal.locator('input.test-request-attachment-input[type="file"]');
    this.attachmentEmptyNote = this.attachmentModal.locator('.test-request-attachment-note');
    this.attachmentModalCancelButton = this.attachmentModal.locator('footer button').filter({ hasText: /^Hủy$|^Huỷ$/ }).first();
    this.attachmentModalSaveButton = this.attachmentModal.locator('footer button.btn-primary').filter({ hasText: /^Lưu$/ }).first();

    this.toastMessages = page.locator('.toast, [role="status"], [role="alert"]');
  }

  /**
   * Điều hướng tới trang Tiếp nhận Yêu cầu thử nghiệm
   */
  async open(path = '/tiep-nhan-yctn'): Promise<void> {
    Logger.info(`Điều hướng tới trang Tiếp nhận YCTN: ${path}`);
    await this.page.goto(path);
  }

  /**
   * Lọc danh sách theo chip trạng thái trên màn Tiếp nhận YCTN
   */
  async filterByStatusChip(
    chip: 'all' | 'pending' | 'supplement' | 'approved' | 'unattached'
  ): Promise<void> {
    Logger.info(`Lọc danh sách Tiếp nhận YCTN theo chip: ${chip}`);
    const map: Record<string, Locator> = {
      all: this.chipAll,
      pending: this.chipYctnPending,
      supplement: this.chipYctnSupplement,
      approved: this.chipYctnApproved,
      unattached: this.chipUnattached,
    };
    await map[chip].click();
    await this.page.waitForTimeout(800);
  }

  /**
   * Tìm kiếm hồ sơ YCTN theo từ khóa
   */
  async search(keyword: string): Promise<void> {
    Logger.info(`Tìm kiếm YCTN với từ khóa: "${keyword}"`);
    await this.searchInput.fill(keyword);
    await this.searchInput.press('Enter');
    await this.page.waitForTimeout(800);
  }

  /**
   * Xóa từ khóa tìm kiếm
   */
  async clearSearch(): Promise<void> {
    Logger.info('Xóa từ khóa tìm kiếm');
    await this.searchInput.fill('');
    await this.searchInput.press('Enter');
    await this.page.waitForTimeout(800);
  }

  /**
   * Chọn loại ngày lọc ("Ngày nhận" hoặc "Ngày trả") trên thanh bộ lọc
   */
  async selectDateFilterType(type: 'Ngày nhận' | 'Ngày trả'): Promise<void> {
    Logger.info(`Chọn loại bộ lọc ngày: "${type}"`);
    await this.dateTypeFilterButton.click();
    await this.page.waitForTimeout(300);
    await this.page.locator('.popover__option[role="option"]').filter({ hasText: type }).first().click();
    await this.page.waitForTimeout(500);
  }

  /**
   * Chọn ngày "Hôm nay" cho mốc "Từ" (from) hoặc "Đến" (to) trên bộ lọc ngày
   */
  async selectFilterDateToday(segment: 'from' | 'to'): Promise<void> {
    Logger.info(`Chọn ngày "Hôm nay" cho mốc lọc: ${segment === 'from' ? 'TỪ' : 'ĐẾN'}`);
    const trigger = segment === 'from' ? this.fromDateButton : this.toDateButton;
    await trigger.click();
    await this.page.waitForTimeout(400);
    if (!(await this.page.locator('.date-calendar').isVisible().catch(() => false))) {
      await trigger.click();
      await this.page.waitForTimeout(400);
    }
    const todayBtn = this.page.locator('button').filter({ hasText: /^Hôm nay$/ }).first();
    if (await todayBtn.isVisible().catch(() => false)) {
      await todayBtn.click();
    } else {
      await this.page.locator('.calendar-day:not(.muted), .dp-day').first().click();
    }
    await this.page.waitForTimeout(800);
  }

  /**
   * Chọn ngày cụ thể trong tháng hiện tại trên lịch bộ lọc cho mốc "Từ" (from) hoặc "Đến" (to)
   */
  async selectFilterDateByDay(segment: 'from' | 'to', day: number): Promise<string> {
    Logger.info(`Chọn ngày ${day} trong tháng cho mốc lọc: ${segment === 'from' ? 'TỪ' : 'ĐẾN'}`);
    const trigger = segment === 'from' ? this.fromDateButton : this.toDateButton;
    await trigger.click();
    await this.page.waitForTimeout(400);
    if (!(await this.page.locator('.date-calendar').isVisible().catch(() => false))) {
      await trigger.click();
      await this.page.waitForTimeout(400);
    }
    const dayBtn = this.page
      .locator('.date-calendar button.date-calendar__cell')
      .filter({ hasText: new RegExp(`^${day}$`) })
      .first();
    await dayBtn.click();
    await this.page.waitForTimeout(800);
    return (await trigger.locator('.date-filter-segment__value').innerText()).trim();
  }

  /**
   * Chuyển chuỗi ngày "dd/mm/yyyy" thành timestamp (ms) để so sánh toán học
   */
  parseDateDMY(dateStr: string): number {
    const [dd, mm, yyyy] = dateStr.trim().split('/').map(Number);
    return new Date(yyyy, mm - 1, dd).getTime();
  }

  /**
   * Nhấn nút "Hủy lọc theo ngày." [×] để xóa bộ lọc ngày
   */
  async clearDateFilter(): Promise<void> {
    Logger.info('Xóa bộ lọc theo ngày');
    if (await this.clearDateFilterButton.isVisible().catch(() => false)) {
      await this.clearDateFilterButton.click();
      await this.page.waitForTimeout(800);
    }
  }

  /**
   * Bấm vào dòng thứ index (0-based) để xem chi tiết bên phải
   */
  async clickRowToViewDetail(index = 0): Promise<void> {
    Logger.info(`Bấm chọn dòng thứ ${index + 1} để xem chi tiết`);
    await this.rows.nth(index).locator('td').nth(1).click();
    await this.page.waitForTimeout(600);
  }

  /**
   * Tích chọn checkbox tại dòng thứ index (0-based)
   */
  async checkRow(index = 0): Promise<void> {
    Logger.info(`Tích chọn checkbox dòng thứ ${index + 1}`);
    const cb = this.rows.nth(index).locator('input.cb');
    if (!(await cb.isChecked())) {
      await cb.check();
      await this.page.waitForTimeout(300);
    }
  }

  /**
   * Bỏ tích chọn checkbox tại dòng thứ index (0-based)
   */
  async uncheckRow(index = 0): Promise<void> {
    Logger.info(`Bỏ tích chọn checkbox dòng thứ ${index + 1}`);
    const cb = this.rows.nth(index).locator('input.cb');
    if (await cb.isChecked()) {
      await cb.uncheck();
      await this.page.waitForTimeout(300);
    }
  }

  /**
   * Nhấn nút "Sửa" trên thanh công cụ để mở chế độ chỉnh sửa
   */
  async openEditForm(): Promise<void> {
    Logger.info('Nhấn nút "Sửa" trên thanh công cụ Tiếp nhận YCTN');
    await this.editButton.click();
    await this.page.waitForTimeout(600);
  }

  /**
   * Nhấn nút "Huỷ" trên form chỉnh sửa
   */
  async cancelForm(): Promise<void> {
    Logger.info('Nhấn nút "Huỷ" trên form');
    await this.cancelFormButton.click();
    await this.page.waitForTimeout(500);
  }

  /**
   * Nhấn nút "Lưu" trên form chỉnh sửa
   */
  async submitForm(): Promise<void> {
    Logger.info('Nhấn nút "Lưu" trên form');
    await this.saveFormButton.click();
    await this.page.waitForTimeout(800);
  }

  /**
   * Chọn Ngày nhận tại Phần 6 (Thông tin nội bộ) là "Hôm nay"
   */
  async selectInternalReceivedDateToday(): Promise<void> {
    Logger.info('Chọn Ngày nhận tại Phần 6 (Thông tin nội bộ) là "Hôm nay"');
    await this.internalReceivedDateTrigger.click();
    await this.page.waitForTimeout(400);
    const todayBtn = this.page.locator('button').filter({ hasText: /^Hôm nay$/ }).first();
    if (await todayBtn.isVisible().catch(() => false)) {
      await todayBtn.click();
    } else {
      await this.page.locator('.calendar-day:not(.muted), .dp-day').first().click();
    }
    await this.page.waitForTimeout(400);
  }
}

