import { type Locator, type Page } from '@playwright/test';
import { BasePage } from './base.page';
import { Logger } from '../utils/logger';

/**
 * Page Object Model cho Module Báo giá & Yêu cầu thử nghiệm (/yeu-cau-thu-nghiem)
 * Hệ thống VNTEST LIMS
 */
export class TestRequestsPage extends BasePage {
  // ==========================================
  // 1. THANH ĐIỀU HƯỚNG TAB & TIỆN ÍCH TRÊN CÙNG
  // ==========================================
  readonly bgAndYctnTab: Locator;
  readonly receiveYctnTab: Locator;
  readonly exportButton: Locator;
  readonly printButton: Locator;

  // ==========================================
  // 2. CHIP LỌC TRẠNG THÁI & BỘ LỌC TÌM KIẾM
  // ==========================================
  readonly chipAll: Locator;
  readonly chipDraft: Locator;
  readonly chipCustomerConfirmed: Locator;
  readonly chipYctnPending: Locator;
  readonly chipYctnSupplement: Locator;
  readonly chipYctnApproved: Locator;
  readonly chipYctnRejected: Locator;

  readonly dateTypeTrigger: Locator;
  readonly dateFromTrigger: Locator;
  readonly dateToTrigger: Locator;
  readonly clearDateFilterButton: Locator;
  readonly searchInput: Locator;
  readonly clearSearchButton: Locator;

  // ==========================================
  // 3. THANH CÔNG CỤ THAO TÁC NGHIỆP VỤ (TOOLBAR)
  // ==========================================
  readonly cloneButton: Locator;
  readonly confirmCustomerButton: Locator;
  readonly sendYctnButton: Locator;
  readonly addButton: Locator;
  readonly editButton: Locator;
  readonly deleteButton: Locator;

  // ==========================================
  // 4. BẢNG DANH SÁCH BÁO GIÁ & YCTN (KHUNG TRÁI)
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
  // 5. KHUNG CHI TIẾT / FORM BÁO GIÁ & YCTN (KHUNG PHẢI)
  // ==========================================
  readonly emptyDetailPlaceholder: Locator;
  readonly form: Locator;
  readonly readonlyBanner: Locator;
  readonly errorBanners: Locator;
  readonly fieldErrors: Locator;
  readonly cancelFormButton: Locator;
  readonly saveFormButton: Locator;

  // Phần 1: Thông tin chung
  readonly section1: Locator;
  readonly quotationCodeInput: Locator;
  readonly yctnCodeInput: Locator;
  readonly saleTrigger: Locator;
  readonly createdDateTrigger: Locator;
  readonly receivedDateTrigger: Locator;
  readonly dueDateInput: Locator;
  readonly contractTrigger: Locator;
  readonly customerCodeTrigger: Locator;
  readonly customerSourceSelect: Locator;
  readonly partnerTrigger: Locator;
  readonly customerNameInput: Locator;
  readonly taxOrIdInput: Locator;
  readonly customerAddressInput: Locator;
  readonly contactNameInput: Locator;
  readonly contactPhoneInput: Locator;
  readonly contactEmailInput: Locator;

  // Phần 2: Thông tin xuất hóa đơn
  readonly section2: Locator;
  readonly copyFromCustomerCheckbox: Locator;
  readonly invoiceNameInput: Locator;
  readonly invoiceContractInput: Locator;
  readonly invoiceEmailInput: Locator;
  readonly invoiceAddressInput: Locator;
  readonly invoiceTaxCodeInput: Locator;

  // Phần 3: Dịch vụ bổ sung
  readonly section3: Locator;
  readonly turnaroundDefaultRadio: Locator;
  readonly turnaroundDefaultDaysInput: Locator;
  readonly turnaround24hRadio: Locator;
  readonly turnaround48hRadio: Locator;
  readonly turnaround72hRadio: Locator;
  readonly turnaroundOtherRadio: Locator;
  readonly turnaroundOtherDaysInput: Locator;
  readonly turnaroundOtherFactorInput: Locator;
  readonly resultLanguageSelect: Locator;
  readonly printCopiesInput: Locator;
  readonly surchargeInput: Locator;
  readonly samplingMethodSelect: Locator;
  readonly samplingAddressInput: Locator;
  readonly samplingNoteInput: Locator;
  readonly samplingQuantityInput: Locator;
  readonly samplingFeeInput: Locator;
  readonly samplingVatSelect: Locator;
  readonly publishSelect: Locator;
  readonly publishFeeInput: Locator;
  readonly publishVatSelect: Locator;

  // Phần 4: Thông tin khác
  readonly section4: Locator;
  readonly testingPurposeSelect: Locator;
  readonly receiveResultAtSelect: Locator;
  readonly sampleRetentionSelect: Locator;
  readonly discountPercentInput: Locator;
  readonly testingVatInput: Locator;
  readonly subcontractorInput: Locator;
  readonly customerRequestTextarea: Locator;

  // Phần 5: Chỉ tiêu phân tích
  readonly section5: Locator;
  readonly matrixSelectTrigger: Locator;
  readonly addMatrixButton: Locator;
  readonly matrixGroups: Locator;
  readonly sampleArticles: Locator;

  // Modal chọn chỉ tiêu / gói chỉ tiêu
  readonly analytePickerModal: Locator;
  readonly analytePickerTitle: Locator;
  readonly analytePickerSearchInput: Locator;
  readonly analytePickerRows: Locator;
  readonly analytePickerCancelButton: Locator;
  readonly analytePickerConfirmButton: Locator;

  // Phần 6: Tổng hợp thanh toán
  readonly section6: Locator;
  readonly summarySamplingFee: Locator;
  readonly summaryPublishFee: Locator;
  readonly summaryFastFactor: Locator;
  readonly summaryDiscountAmount: Locator;
  readonly summaryFloorTotal: Locator;
  readonly summaryTestingBeforeVat: Locator;
  readonly summaryMargin: Locator;
  readonly summaryTestingWithVat: Locator;
  readonly summaryGrandTotal: Locator;

  // Phần 7: Quy định gửi mẫu
  readonly section7: Locator;

  // ==========================================
  // 6. HỘP THOẠI XÁC NHẬN THAO TÁC (XÓA / KH CHỐT / GỬI YCTN) & TOAST
  // ==========================================
  readonly actionModal: Locator;
  readonly actionModalTitle: Locator;
  readonly actionModalInfo: Locator;
  readonly actionModalCancelButton: Locator;
  readonly actionModalConfirmButton: Locator;
  readonly toastMessages: Locator;

  constructor(page: Page) {
    super(page);

    // 1. Tabs & Tiện ích
    this.bgAndYctnTab = page.locator('button.tab').filter({ hasText: /BG & YCTN/i }).first();
    this.receiveYctnTab = page.locator('button.tab').filter({ hasText: /TIẾP NHẬN YCTN/i }).first();
    this.exportButton = page.locator('button.btn').filter({ hasText: /^Xuất$/ }).first();
    this.printButton = page.locator('button.btn').filter({ hasText: /^In$/ }).first();

    // 2. Chip lọc trạng thái & Bộ lọc
    this.chipAll = page.locator('button.bg-chiptab').filter({ hasText: /^Tất cả/i }).first();
    this.chipDraft = page.locator('button.bg-chiptab').filter({ hasText: /^Nháp/i }).first();
    this.chipCustomerConfirmed = page.locator('button.bg-chiptab').filter({ hasText: /^KH chốt/i }).first();
    this.chipYctnPending = page.locator('button.bg-chiptab').filter({ hasText: /^YCTN CD/i }).first();
    this.chipYctnSupplement = page.locator('button.bg-chiptab').filter({ hasText: /^YCTN BS/i }).first();
    this.chipYctnApproved = page.locator('button.bg-chiptab').filter({ hasText: /^YCTN DD/i }).first();
    this.chipYctnRejected = page.locator('button.bg-chiptab').filter({ hasText: /^YCTN TC/i }).first();

    this.dateTypeTrigger = page.locator('.from-to-date-filter__label-trigger').first();
    this.dateFromTrigger = page.locator('.date-filter-segment__trigger').first();
    this.dateToTrigger = page.locator('.date-filter-segment__trigger').nth(1);
    this.clearDateFilterButton = page.locator('button.from-to-date-filter__clear').first();
    this.searchInput = page.locator('input[placeholder*="mã YCTN" i], input[placeholder*="Find:" i]').first();
    this.clearSearchButton = page.locator('.search button, button[aria-label*="Xóa tìm" i]').first();

    // 3. Toolbar buttons
    this.cloneButton = page.getByRole('button', { name: 'Nhân bản', exact: true }).first();
    this.confirmCustomerButton = page.locator('button.btn:not(.bg-chiptab)').filter({ hasText: /^KH chốt$/ }).first();
    this.sendYctnButton = page.getByRole('button', { name: 'Gửi YCTN', exact: true }).first();
    this.addButton = page.locator('button.btn-outline-accent').filter({ hasText: /^Thêm$/ }).first();
    this.editButton = page.getByRole('button', { name: 'Sửa', exact: true }).first();
    this.deleteButton = page.locator('button.btn-danger').filter({ hasText: /^Xóa$/ }).first();

    // 4. Bảng danh sách
    this.table = page.locator('table').first();
    this.tableHeaders = this.table.locator('thead th');
    this.selectAllCheckbox = this.table.locator('thead input.cb').first();
    this.rows = this.table.locator('tbody tr');
    this.firstRow = this.rows.first();
    this.paginationInfo = page.locator('text=/Hiện \\d+–\\d+ \\/ \\d+/i').first();
    this.manageColumnsButton = page.locator('button.px-column-manager-trigger').first();
    this.manageColumnsPopover = page.locator('.popover__content, .px-column-manager-popover').first();

    // 5. Khung chi tiết / Form bên phải
    this.emptyDetailPlaceholder = page.locator('text=Chưa chọn báo giá/yêu cầu thử nghiệm.').first();
    this.form = page.locator('form').first();
    this.readonlyBanner = page.locator('[role="status"], .trq-banner').filter({ hasText: /không cho phép sửa/i }).first();
    this.errorBanners = page.locator('form .trq-banner');
    this.fieldErrors = page.locator('form .trq-error');
    this.cancelFormButton = page.locator('form button').filter({ hasText: /^Huỷ$|^Hủy$/ }).first();
    this.saveFormButton = page.locator('form button.btn-primary').filter({ hasText: /^Lưu$/ }).first();

    // Phần 1: Thông tin chung
    this.section1 = page.locator('.trq-section').nth(0);
    this.quotationCodeInput = this.section1.locator('label:has-text("Mã báo giá") input');
    this.yctnCodeInput = this.section1.locator('label:has-text("Mã yêu cầu thử nghiệm") input');
    this.saleTrigger = this.section1.locator('label:has-text("Sale") .select-search-trigger');
    this.createdDateTrigger = this.section1.locator('label:has-text("Ngày tạo báo giá") .custom-date-input__trigger');
    this.receivedDateTrigger = this.section1.locator('label:has-text("Ngày nhận") .custom-date-input__trigger');
    this.dueDateInput = this.section1.locator('label:has-text("Ngày hẹn trả") input');
    this.contractTrigger = this.section1.locator('label:has-text("Số hợp đồng") .select-search-trigger');
    this.customerCodeTrigger = this.section1.locator('label:has-text("Mã khách hàng") .select-search-trigger');
    this.customerSourceSelect = this.section1.locator('label:has-text("Nguồn khách hàng") select');
    this.partnerTrigger = this.section1.locator('label:has-text("Mã đối tác") .select-search-trigger');
    this.customerNameInput = this.section1.locator('label:has-text("Tên khách hàng") input');
    this.taxOrIdInput = this.section1.locator('label:has-text("MST"), label:has-text("CCCD")').locator('input').first();
    this.customerAddressInput = this.section1.locator('label:has-text("Địa chỉ khách hàng") input');
    this.contactNameInput = this.section1.locator('label:has-text("Tên liên hệ") input');
    this.contactPhoneInput = this.section1.locator('label:has-text("Số điện thoại") input');
    this.contactEmailInput = this.section1.locator('label:has-text("Email") input');

    // Phần 2: Thông tin xuất hóa đơn
    this.section2 = page.locator('.trq-section').nth(1);
    this.copyFromCustomerCheckbox = this.section2.locator('input.trq-copy-check');
    this.invoiceNameInput = this.section2.locator('label:has-text("Tên xuất hóa đơn") input');
    this.invoiceContractInput = this.section2.locator('label:has-text("Số hợp đồng") input');
    this.invoiceEmailInput = this.section2.locator('label:has-text("Email") input');
    this.invoiceAddressInput = this.section2.locator('label:has-text("Địa chỉ xuất hóa đơn") input');
    this.invoiceTaxCodeInput = this.section2.locator('label:has-text("MST xuất hóa đơn") input');

    // Phần 3: Dịch vụ bổ sung
    this.section3 = page.locator('.trq-section').nth(2);
    this.turnaroundDefaultRadio = this.section3.locator('input[name="test-request-turnaround"][value="default"]');
    this.turnaroundDefaultDaysInput = this.section3.locator('label:has(input[value="default"]) input[type="number"]');
    this.turnaround24hRadio = this.section3.locator('input[name="test-request-turnaround"][value="h24"]');
    this.turnaround48hRadio = this.section3.locator('input[name="test-request-turnaround"][value="h48"]');
    this.turnaround72hRadio = this.section3.locator('input[name="test-request-turnaround"][value="h72"]');
    this.turnaroundOtherRadio = this.section3.locator('input[name="test-request-turnaround"][value="other"]');
    this.turnaroundOtherDaysInput = this.section3.locator('label:has(input[value="other"]) input[type="number"]').nth(0);
    this.turnaroundOtherFactorInput = this.section3.locator('label:has(input[value="other"]) input[type="number"]').nth(1);
    this.resultLanguageSelect = this.section3.locator('label:has-text("Ngôn ngữ kết quả") select');
    this.printCopiesInput = this.section3.locator('label:has-text("Số bản in") input');
    this.surchargeInput = this.section3.locator('label:has-text("Phụ phí") input');
    this.samplingMethodSelect = this.section3.locator('label:has-text("Lấy mẫu") select').first();
    this.samplingAddressInput = this.section3.locator('label:has-text("Địa chỉ lấy mẫu") input');
    this.samplingNoteInput = this.section3.locator('label:has-text("Ghi chú lấy mẫu") input');
    this.samplingQuantityInput = this.section3.locator('label:has-text("Số lượng/khối lượng mẫu") input');
    this.samplingFeeInput = this.section3.locator('label:has-text("Phí lấy mẫu") input');
    this.samplingVatSelect = this.section3.locator('label:has-text("VAT lấy mẫu") select');
    this.publishSelect = this.section3.locator('label:has-text("Công bố") select').first();
    this.publishFeeInput = this.section3.locator('label:has-text("Phí công bố") input');
    this.publishVatSelect = this.section3.locator('label:has-text("VAT công bố") select');

    // Phần 4: Thông tin khác
    this.section4 = page.locator('.trq-section').nth(3);
    this.testingPurposeSelect = this.section4.locator('label:has-text("Mục đích kiểm nghiệm") select');
    this.receiveResultAtSelect = this.section4.locator('label:has-text("Nhận kết quả tại") select');
    this.sampleRetentionSelect = this.section4.locator('label:has-text("Mẫu sau thử nghiệm") select');
    this.discountPercentInput = this.section4.locator('label:has-text("Chiết khấu (%)") input');
    this.testingVatInput = this.section4.locator('label:has-text("VAT% kiểm nghiệm") input');
    this.subcontractorInput = this.section4.locator('label:has-text("Thầu phụ") input');
    this.customerRequestTextarea = this.section4.locator('label:has-text("Yêu cầu của khách hàng") textarea');

    // Phần 5: Chỉ tiêu phân tích
    this.section5 = page.locator('.trq-section').nth(4);
    this.matrixSelectTrigger = this.section5.locator('header .select-search-trigger').first();
    this.addMatrixButton = this.section5.locator('header button').filter({ hasText: 'Thêm' }).first();
    this.matrixGroups = this.section5.locator('.trq-s5-group');
    this.sampleArticles = this.section5.locator('article.trq-s5-sample');

    // Modal chọn chỉ tiêu
    this.analytePickerModal = page.locator('.modal.trq-analyte-picker');
    this.analytePickerTitle = this.analytePickerModal.locator('#trq-analyte-picker-title');
    this.analytePickerSearchInput = this.analytePickerModal.locator('.analyte-selector-search input');
    this.analytePickerRows = this.analytePickerModal.locator('.analyte-selector-source tbody tr');
    this.analytePickerCancelButton = this.analytePickerModal.locator('footer button, .modal-foot button').filter({ hasText: /^Hủy$|^Huỷ$/ }).first();
    this.analytePickerConfirmButton = this.analytePickerModal.locator('button.btn-primary').filter({ hasText: /^Xác nhận$/ });

    // Phần 6: Tổng hợp thanh toán
    this.section6 = page.locator('.trq-section').nth(5);
    this.summarySamplingFee = this.section6.locator('.trq-summary__row').filter({ hasText: 'Phí DV lấy mẫu' }).locator('.trq-summary__value');
    this.summaryPublishFee = this.section6.locator('.trq-summary__row').filter({ hasText: 'Phí DV công bố' }).locator('.trq-summary__value');
    this.summaryFastFactor = this.section6.locator('.trq-summary__row').filter({ hasText: 'HS kiểm nhanh' }).locator('.trq-summary__value');
    this.summaryDiscountAmount = this.section6.locator('.trq-summary__row').filter({ hasText: 'Chiết khấu' }).locator('.trq-summary__value');
    this.summaryFloorTotal = this.section6.locator('.trq-summary__row').filter({ hasText: 'Tổng giá sàn' }).locator('.trq-summary__value');
    this.summaryTestingBeforeVat = this.section6.locator('.trq-summary__row').filter({ hasText: 'Tổng KN (Chưa VAT)' }).locator('.trq-summary__value');
    this.summaryMargin = this.section6.locator('.trq-summary__row').filter({ hasText: 'Margin' }).locator('.trq-summary__margin');
    this.summaryTestingWithVat = this.section6.locator('.trq-summary__row').filter({ hasText: 'Tổng KN (Có VAT' }).locator('.trq-summary__value');
    this.summaryGrandTotal = this.section6.locator('.trq-summary__total .trq-summary__grand');

    // Phần 7: Quy định gửi mẫu
    this.section7 = page.locator('.trq-section').nth(6);

    // 6. Action Modal & Toast
    this.actionModal = page.locator('.modal.test-request-action-modal');
    this.actionModalTitle = this.actionModal.locator('#test-request-action-title');
    this.actionModalInfo = this.actionModal.locator('p.modal-info');
    this.actionModalCancelButton = this.actionModal.locator('button').filter({ hasText: /^Hủy$|^Huỷ$/ }).first();
    this.actionModalConfirmButton = this.actionModal.locator('button.btn-primary, button.btn-danger, button:has-text("KH chốt")').last();
    this.toastMessages = page.locator('.toast, [role="status"], [role="alert"]');
  }

  /**
   * Điều hướng tới trang Báo giá & Yêu cầu thử nghiệm
   */
  async open(path = '/yeu-cau-thu-nghiem'): Promise<void> {
    Logger.info(`Điều hướng tới trang Báo giá & YCTN: ${path}`);
    await this.page.goto(path);
  }

  /**
   * Lọc danh sách theo chip trạng thái
   */
  async filterByStatusChip(
    chip: 'all' | 'draft' | 'confirmed' | 'pending' | 'supplement' | 'approved' | 'rejected'
  ): Promise<void> {
    Logger.info(`Lọc danh sách theo chip trạng thái: ${chip}`);
    const map: Record<string, Locator> = {
      all: this.chipAll,
      draft: this.chipDraft,
      confirmed: this.chipCustomerConfirmed,
      pending: this.chipYctnPending,
      supplement: this.chipYctnSupplement,
      approved: this.chipYctnApproved,
      rejected: this.chipYctnRejected,
    };
    await map[chip].click();
    await this.page.waitForTimeout(800);
  }

  /**
   * Tìm kiếm hồ sơ theo từ khóa
   */
  async search(keyword: string): Promise<void> {
    Logger.info(`Tìm kiếm BG/YCTN với từ khóa: "${keyword}"`);
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
    await this.dateTypeTrigger.click();
    await this.page.waitForTimeout(300);
    await this.page.locator('.popover__option[role="option"]').filter({ hasText: type }).first().click();
    await this.page.waitForTimeout(500);
  }

  /**
   * Chọn ngày "Hôm nay" cho mốc "Từ" (from) hoặc "Đến" (to) trên bộ lọc ngày
   */
  async selectFilterDateToday(segment: 'from' | 'to'): Promise<void> {
    Logger.info(`Chọn ngày "Hôm nay" cho mốc lọc: ${segment === 'from' ? 'TỪ' : 'ĐẾN'}`);
    const trigger = segment === 'from' ? this.dateFromTrigger : this.dateToTrigger;
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
    const trigger = segment === 'from' ? this.dateFromTrigger : this.dateToTrigger;
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
   * Nhấn nút "Thêm" trên thanh công cụ để mở form tạo mới
   */
  async openCreateForm(): Promise<void> {
    Logger.info('Nhấn nút "Thêm" trên thanh công cụ');
    await this.addButton.click();
    await this.page.waitForTimeout(600);
  }

  /**
   * Nhấn nút "Sửa" trên thanh công cụ để mở form chỉnh sửa
   */
  async openEditForm(): Promise<void> {
    Logger.info('Nhấn nút "Sửa" trên thanh công cụ');
    await this.editButton.click();
    await this.page.waitForTimeout(600);
  }

  /**
   * Nhấn nút "Nhân bản" trên thanh công cụ
   */
  async clickClone(): Promise<void> {
    Logger.info('Nhấn nút "Nhân bản" trên thanh công cụ');
    await this.cloneButton.click();
    await this.page.waitForTimeout(600);
  }

  /**
   * Nhấn nút "Huỷ" trên form bên phải
   */
  async cancelForm(): Promise<void> {
    Logger.info('Nhấn nút "Huỷ" trên form');
    await this.cancelFormButton.click();
    await this.page.waitForTimeout(500);
  }

  /**
   * Nhấn nút "Lưu" trên form bên phải
   */
  async submitForm(): Promise<void> {
    Logger.info('Nhấn nút "Lưu" trên form');
    await this.saveFormButton.click();
    await this.page.waitForTimeout(800);
  }

  /**
   * Chọn khách hàng từ combobox "Mã khách hàng" trong Phần 1
   */
  async selectCustomerByIndex(optionIndex = 0): Promise<void> {
    Logger.info(`Chọn khách hàng tại vị trí ${optionIndex + 1} trong danh sách`);
    await this.customerCodeTrigger.click();
    await this.page.waitForTimeout(400);
    await this.page.locator('.select-search-menu .select-search-option').nth(optionIndex).click();
    await this.page.waitForTimeout(400);
  }

  /**
   * Chọn Ngày nhận là "Hôm nay" trong Phần 1
   */
  async selectReceivedDateToday(): Promise<void> {
    Logger.info('Chọn Ngày nhận là "Hôm nay"');
    await this.receivedDateTrigger.click();
    await this.page.waitForTimeout(400);
    const todayBtn = this.page.locator('button').filter({ hasText: /^Hôm nay$/ }).first();
    if (await todayBtn.isVisible().catch(() => false)) {
      await todayBtn.click();
    } else {
      await this.page.locator('.calendar-day:not(.muted), .dp-day').first().click();
    }
    await this.page.waitForTimeout(400);
  }

  /**
   * Chọn Nền mẫu và nhấn nút "Thêm" tại Phần 5
   */
  async addSampleMatrixByIndex(optionIndex = 0): Promise<void> {
    Logger.info(`Chọn nền mẫu thứ ${optionIndex + 1} và nhấn nút "Thêm"`);
    await this.matrixSelectTrigger.click();
    await this.page.waitForTimeout(400);
    await this.page.locator('.select-search-menu .select-search-option').nth(optionIndex).click();
    await this.page.waitForTimeout(300);
    await this.addMatrixButton.click();
    await this.page.waitForTimeout(500);
  }

  /**
   * Mở hộp thoại "Thêm chỉ tiêu / gói chỉ tiêu" cho mẫu thứ sampleIndex (0-based)
   */
  async openAnalytePickerForSample(sampleIndex = 0): Promise<void> {
    Logger.info(`Mở hộp thoại chọn chỉ tiêu cho Mẫu ${sampleIndex + 1}`);
    const sample = this.sampleArticles.nth(sampleIndex);
    await sample.locator('button').filter({ hasText: /Thêm chỉ tiêu/i }).click();
    await this.page.waitForTimeout(600);
  }

  /**
   * Tích chọn các chỉ tiêu trong hộp thoại theo danh sách index và nhấn "Xác nhận"
   */
  async selectAnalytesAndConfirm(indices: number[] = [0]): Promise<void> {
    Logger.info(`Chọn chỉ tiêu tại vị trí [${indices.join(', ')}] và nhấn "Xác nhận"`);
    for (const idx of indices) {
      await this.analytePickerRows.nth(idx).locator('input[type="checkbox"]').check();
      await this.page.waitForTimeout(200);
    }
    await this.analytePickerConfirmButton.click();
    await this.page.waitForTimeout(600);
  }

  /**
   * Lấy locator dòng chỉ tiêu thứ rowIndex (0-based) trong mẫu sampleIndex (0-based)
   */
  getSampleCriteriaRow(sampleIndex = 0, rowIndex = 0): Locator {
    return this.sampleArticles.nth(sampleIndex).locator('.trq-ct-table tbody tr').nth(rowIndex);
  }

  /**
   * Cập nhật Giá sàn, Giá báo KH, Số lượng (SL) của một dòng chỉ tiêu trong mẫu
   */
  async updateCriteriaRowPricing(
    sampleIndex: number,
    rowIndex: number,
    data: { floorPrice?: string; customerPrice?: string; quantity?: string }
  ): Promise<void> {
    const row = this.getSampleCriteriaRow(sampleIndex, rowIndex);
    const inputs = row.locator('input');
    if (data.floorPrice !== undefined) {
      Logger.info(`Nhập Giá sàn = ${data.floorPrice}`);
      await inputs.nth(3).fill(data.floorPrice);
      await inputs.nth(3).blur();
      await this.page.waitForTimeout(200);
    }
    if (data.customerPrice !== undefined) {
      Logger.info(`Nhập Giá báo KH = ${data.customerPrice}`);
      await inputs.nth(4).fill(data.customerPrice);
      await inputs.nth(4).blur();
      await this.page.waitForTimeout(200);
    }
    if (data.quantity !== undefined) {
      Logger.info(`Nhập Số lượng (SL) = ${data.quantity}`);
      await inputs.nth(5).fill(data.quantity);
      await inputs.nth(5).blur();
      await this.page.waitForTimeout(200);
    }
  }

  /**
   * Bật/tắt nút Kiểm nhanh (⚡ KN) và nhập % tăng giá (+% ↑) trên Mẫu
   */
  async configureSampleFastTest(sampleIndex = 0, toggleKn = true, plusPercent?: string): Promise<void> {
    const sample = this.sampleArticles.nth(sampleIndex);
    const knBtn = sample.locator('button.trq-toggle');
    const isChecked = (await knBtn.getAttribute('aria-checked')) === 'true';
    if (toggleKn !== isChecked) {
      Logger.info(`${toggleKn ? 'Bật' : 'Tắt'} công tắc ⚡ KN cho Mẫu ${sampleIndex + 1}`);
      await knBtn.click();
      await this.page.waitForTimeout(300);
    }
    if (plusPercent !== undefined) {
      Logger.info(`Nhập +% ↑ cho Mẫu ${sampleIndex + 1}: ${plusPercent}%`);
      const plusInput = sample.locator('input.trq-s5-input--plus');
      await plusInput.fill(plusPercent);
      await plusInput.blur();
      await this.page.waitForTimeout(300);
    }
  }

  /**
   * Lấy thông tin tổng tiền của Mẫu thứ sampleIndex (0-based)
   */
  getSampleTotalBlock(sampleIndex = 0): {
    totalVal: Locator;
    baseAmount: Locator;
    fastExtraAmount: Locator;
    grandTotal: Locator;
  } {
    const sample = this.sampleArticles.nth(sampleIndex);
    const totalBox = sample.locator('.trq-s5-total');
    return {
      totalVal: totalBox.locator('.trq-s5-total-val'),
      baseAmount: totalBox.locator('.trq-s5-total-tip__row').nth(0).locator('.mono'),
      fastExtraAmount: totalBox.locator('.trq-s5-total-tip__row').nth(1).locator('.mono'),
      grandTotal: totalBox.locator('.trq-s5-total-tip__row--grand .mono'),
    };
  }

  /**
   * Xóa mẫu thứ sampleIndex (0-based) và xác nhận hộp thoại "Xóa mẫu?" (nếu hiển thị)
   */
  async deleteSample(sampleIndex: number): Promise<void> {
    Logger.info(`Nhấn nút "Xóa" tại Mẫu ${sampleIndex + 1}`);
    await this.sampleArticles.nth(sampleIndex).locator('button[aria-label="Xóa mẫu"]').click();
    await this.page.waitForTimeout(300);
    const dialog = this.page.locator('[role="dialog"]').last();
    if (await dialog.isVisible().catch(() => false)) {
      await dialog.locator('button').filter({ hasText: /^Xóa$/ }).click();
      await this.page.waitForTimeout(400);
    }
  }

  /**
   * Xóa nhóm nền mẫu thứ groupIndex (0-based) và xác nhận hộp thoại (nếu hiển thị)
   */
  async deleteMatrixGroup(groupIndex = 0): Promise<void> {
    Logger.info(`Nhấn nút "Xóa nền mẫu" tại nhóm ${groupIndex + 1}`);
    await this.matrixGroups.nth(groupIndex).locator('button').filter({ hasText: 'Xóa nền mẫu' }).click();
    await this.page.waitForTimeout(300);
    const dialog = this.page.locator('[role="dialog"]').last();
    if (await dialog.isVisible().catch(() => false)) {
      await dialog.locator('button').filter({ hasText: /^Xóa$/ }).click();
      await this.page.waitForTimeout(400);
    }
  }
}

