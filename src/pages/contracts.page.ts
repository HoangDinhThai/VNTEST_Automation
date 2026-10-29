import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { Logger } from '../utils/logger';

/**
 * ContractsPage: Page Object Model đại diện cho module Quản lý Hợp đồng (/hop-dong)
 * Hệ thống VNTEST LIMS
 */
export class ContractsPage extends BasePage {
  // ------------------------------------------------------------
  // Sub-tabs & Badges
  // ------------------------------------------------------------
  readonly subtabDraft: Locator;
  readonly subtabSigned: Locator;
  readonly subtabDraftBadge: Locator;
  readonly subtabSignedBadge: Locator;
  readonly moduleHeaderBadge: Locator;

  // ------------------------------------------------------------
  // Toolbar thao tác
  // ------------------------------------------------------------
  readonly btnAdd: Locator;
  readonly btnEdit: Locator;
  readonly btnDelete: Locator;
  readonly btnConvertSigned: Locator;
  readonly btnColumnMgmt: Locator;
  readonly selectionStatusText: Locator;

  // ------------------------------------------------------------
  // Tìm kiếm & Bộ lọc
  // ------------------------------------------------------------
  readonly searchInput: Locator;
  readonly searchClearButton: Locator;
  readonly contractTypeFilterTrigger: Locator;
  readonly statusFilterTrigger: Locator;
  readonly dateTypeTrigger: Locator;
  readonly dateFromTrigger: Locator;
  readonly dateToTrigger: Locator;
  readonly dateClearButton: Locator;
  readonly dateCalendar: Locator;
  readonly btnCalendarToday: Locator;
  readonly btnCalendarClear: Locator;

  // ------------------------------------------------------------
  // Bảng dữ liệu danh sách hợp đồng
  // ------------------------------------------------------------
  readonly table: Locator;
  readonly tableHeaders: Locator;
  readonly headerCheckbox: Locator;
  readonly rows: Locator;
  readonly firstRow: Locator;
  readonly firstRowCheckbox: Locator;
  readonly firstRowViewButton: Locator;
  readonly emptyTableMessage: Locator;

  // ------------------------------------------------------------
  // Modal Soạn thảo Hợp đồng nháp (.hd-fullscreen)
  // ------------------------------------------------------------
  readonly draftModal: Locator;
  readonly draftModalTitle: Locator;
  readonly draftCustomerTrigger: Locator;
  readonly draftQuotationTrigger: Locator;
  readonly draftContractNumberInput: Locator;
  readonly draftBtnAutoNumber: Locator;
  readonly draftContractTypeSelect: Locator;
  readonly draftContractNameInput: Locator;
  readonly draftSalutationSelect: Locator;
  readonly draftRepresentativeNameInput: Locator;
  readonly draftPositionInput: Locator;
  readonly draftCustomerTaxCodeInput: Locator;
  readonly draftCustomerPhoneInput: Locator;
  readonly draftCustomerEmailInput: Locator;
  readonly draftSignDateInput: Locator;
  readonly draftValidityDaysInput: Locator;
  readonly draftExpireDateInput: Locator;
  readonly draftDeadlineDateInput: Locator;
  readonly draftPreviewContainer: Locator;
  readonly draftBtnSave: Locator;
  readonly draftBtnExportWord: Locator;
  readonly draftBtnPrint: Locator;
  readonly draftBtnClose: Locator;

  // ------------------------------------------------------------
  // Modal Quản lý Hợp đồng đã ký (.contract-signed-modal - 5 sections)
  // ------------------------------------------------------------
  readonly signedModal: Locator;
  readonly signedModalTitle: Locator;
  readonly signedDraftSourceTrigger: Locator;
  readonly signedContractNumberInput: Locator;
  readonly signedContractTypeSelect: Locator;
  readonly signedContractNameInput: Locator;
  readonly signedCustomerTrigger: Locator;
  readonly signedCustomerIdInput: Locator;
  readonly signedSignDateInput: Locator;
  readonly signedValidityDaysInput: Locator;
  readonly signedPriceVatInput: Locator;
  readonly signedDeductionInput: Locator;
  readonly signedStatusSelect: Locator;
  readonly signedRevenueCheckbox: Locator;
  readonly signedScanUploadButton: Locator;
  readonly signedScanFileInput: Locator;
  readonly signedWordFileNotice: Locator;
  readonly signedScanFileNotice: Locator;
  readonly signedNoteTextarea: Locator;
  readonly signedBtnSave: Locator;
  readonly signedBtnCancel: Locator;
  readonly signedBtnClose: Locator;

  // ------------------------------------------------------------
  // Popup Cảnh báo Thay đổi Chưa lưu ("Đóng hộp thoại?")
  // ------------------------------------------------------------
  readonly guardDialog: Locator;
  readonly guardDialogTitle: Locator;
  readonly guardDialogMessage: Locator;
  readonly guardBtnContinue: Locator;
  readonly guardBtnClose: Locator;

  // ------------------------------------------------------------
  // Slide-over Detail Panel (.contract-detail-panel)
  // ------------------------------------------------------------
  readonly detailPanel: Locator;
  readonly detailTitle: Locator;
  readonly detailMetadataLine: Locator;
  readonly detailBadgeStatus: Locator;
  readonly detailHistoryTable: Locator;
  readonly detailHistoryRows: Locator;
  readonly detailCurrentContractRow: Locator;
  readonly detailHistoryTotal: Locator;
  readonly detailPaymentSummary: Locator;
  readonly detailAttachmentSection: Locator;
  readonly detailDownloadButtons: Locator;
  readonly detailNoteTextarea: Locator;
  readonly detailBtnSaveNote: Locator;
  readonly detailBtnEdit: Locator;
  readonly detailBtnClose: Locator;
  readonly detailHeaderCloseBtn: Locator;

  constructor(page: Page) {
    super(page);

    // Sub-tabs
    this.subtabDraft = page.locator('button.hd-subtab').filter({ hasText: /Hợp đồng nháp/i }).first();
    this.subtabSigned = page.locator('button.hd-subtab').filter({ hasText: /Hợp đồng ký/i }).first();
    this.subtabDraftBadge = this.subtabDraft.locator('.hd-badge');
    this.subtabSignedBadge = this.subtabSigned.locator('.hd-badge');
    this.moduleHeaderBadge = page.locator('.tabs-header, .module-tabs, .header-tabs').locator('.badge, .tab.active .badge').first();

    // Toolbar
    this.btnAdd = page.locator('.toolbar button, .actions button, button.btn').filter({ hasText: /^Thêm$/ }).first();
    this.btnEdit = page.locator('.toolbar button, .actions button, button.btn').filter({ hasText: /^Sửa$/ }).first();
    this.btnDelete = page.locator('.toolbar button, .actions button, button.btn').filter({ hasText: /^Xóa$/ }).first();
    this.btnConvertSigned = page.locator('.toolbar button, .actions button, button.btn').filter({ hasText: /^Chuyển HĐ ký$/ }).first();
    this.btnColumnMgmt = page.locator('button').filter({ hasText: /^Quản lý cột$/ }).first();
    this.selectionStatusText = page.locator('.selection-status, .filters-status, div').filter({ hasText: /Đang chọn \d+ HĐ/i }).first();

    // Tìm kiếm & Bộ lọc
    this.searchInput = page.locator('input[placeholder*="Tìm mã HĐ, số HĐ, tên HĐ, tên KH"]').first();
    this.searchClearButton = page.locator('button.clear-btn, button:has-text("Hủy")').first();
    this.contractTypeFilterTrigger = page.locator('button.popover__trigger.dd, button').filter({ hasText: /Loại HĐ:/i }).first();
    this.statusFilterTrigger = page.locator('button.popover__trigger.dd, button').filter({ hasText: /TT:/i }).first();
    this.dateTypeTrigger = page.locator('button.from-to-date-filter__label-trigger').first();
    this.dateFromTrigger = page.locator('.date-filter-segment__trigger').filter({ hasText: /Từ/i }).first();
    this.dateToTrigger = page.locator('.date-filter-segment__trigger').filter({ hasText: /Đến/i }).first();
    this.dateClearButton = page.locator('button.from-to-date-filter__clear, .from-to-date-filter button:has-text("×")').first();
    this.dateCalendar = page.locator('.date-calendar').first();
    this.btnCalendarToday = page.locator('.date-calendar__foot-btn--primary, button:has-text("Hôm nay")').first();
    this.btnCalendarClear = page.locator('.date-calendar__foot-btn, button:has-text("Xóa")').first();

    // Bảng dữ liệu
    this.table = page.locator('table').first();
    this.tableHeaders = page.locator('table thead th');
    this.headerCheckbox = page.locator('table thead th input[type="checkbox"]').first();
    this.rows = page.locator('table tbody tr');
    this.firstRow = page.locator('table tbody tr').first();
    this.firstRowCheckbox = this.firstRow.locator('input[type="checkbox"]').first();
    this.firstRowViewButton = this.firstRow.locator('.px-view-button').first();
    this.emptyTableMessage = page.locator('text=/Không tìm thấy hợp đồng nào phù hợp/i').first();

    // Modal Soạn thảo HĐ nháp
    this.draftModal = page.locator('.hd-fullscreen');
    this.draftModalTitle = this.draftModal.locator('h2, .hd-fullscreen-title').first();
    this.draftCustomerTrigger = this.draftModal.locator('.select-search-trigger').filter({ hasText: /Chọn khách hàng/i }).first();
    this.draftQuotationTrigger = this.draftModal.locator('.select-search-trigger').filter({ hasText: /Chọn báo giá/i }).first();
    this.draftContractNumberInput = this.draftModal.locator('.addkh-field').filter({ hasText: /Số hợp đồng/i }).locator('input').first();
    this.draftBtnAutoNumber = this.draftModal.locator('button:has-text("Auto")').first();
    this.draftContractTypeSelect = this.draftModal.locator('select').first();
    this.draftContractNameInput = this.draftModal.locator('.addkh-field').filter({ hasText: /Tên hợp đồng/i }).locator('input').first();
    this.draftSalutationSelect = this.draftModal.locator('select').filter({ hasText: /Ông|Bà/i }).first();
    this.draftRepresentativeNameInput = this.draftModal.locator('input[placeholder*="NGUYỄN VĂN A"]').first();
    this.draftPositionInput = this.draftModal.locator('input').filter({ has: page.locator('xpath=preceding::label[contains(text(), "CHỨC VỤ")]') }).first();
    this.draftCustomerTaxCodeInput = this.draftModal.locator('input').filter({ has: page.locator('xpath=preceding::label[contains(text(), "MÃ SỐ THUẾ")]') }).first();
    this.draftCustomerPhoneInput = this.draftModal.locator('input').filter({ has: page.locator('xpath=preceding::label[contains(text(), "ĐIỆN THOẠI")]') }).first();
    this.draftCustomerEmailInput = this.draftModal.locator('input[placeholder*="qa@congty.com"]').first();
    this.draftSignDateInput = this.draftModal.locator('input[type="date"], input[placeholder="dd/mm/yyyy"]').first();
    this.draftValidityDaysInput = this.draftModal.locator('input[type="number"]').first();
    this.draftExpireDateInput = this.draftModal.locator('input').filter({ has: page.locator('xpath=preceding::label[contains(text(), "HẾT HIỆU LỰC")]') }).first();
    this.draftDeadlineDateInput = this.draftModal.locator('input').filter({ has: page.locator('xpath=preceding::label[contains(text(), "NGÀY HẾT HẠN")]') }).first();
    this.draftPreviewContainer = this.draftModal.locator('.hd-preview-contract, .contract-preview-body, .preview-box').first();
    this.draftBtnSave = this.draftModal.locator('button:has-text("Lưu nháp")').first();
    this.draftBtnExportWord = this.draftModal.locator('button:has-text("Xuất Word")').first();
    this.draftBtnPrint = this.draftModal.locator('button:has-text("In")').first();
    this.draftBtnClose = this.draftModal.locator('button:has-text("Đóng"), button.btn-close').first();

    // Modal Hợp đồng đã ký
    this.signedModal = page.locator('.contract-signed-modal');
    this.signedModalTitle = this.signedModal.locator('h2, .modal-title, strong').first();
    this.signedDraftSourceTrigger = this.signedModal.locator('.draft-select-trigger').first();
    this.signedContractNumberInput = this.signedModal.locator('input').filter({ has: page.locator('xpath=preceding::label[contains(text(), "SỐ HỢP ĐỒNG")]') }).first();
    this.signedContractTypeSelect = this.signedModal.locator('select').first();
    this.signedContractNameInput = this.signedModal.locator('input').filter({ has: page.locator('xpath=preceding::label[contains(text(), "TÊN HỢP ĐỒNG")]') }).first();
    this.signedCustomerTrigger = this.signedModal.locator('.select-search-trigger').filter({ hasText: /Chọn khách hàng/i }).first();
    this.signedCustomerIdInput = this.signedModal.locator('input[disabled], input[readonly]').filter({ has: page.locator('xpath=preceding::label[contains(text(), "MÃ KHÁCH HÀNG")]') }).first();
    this.signedSignDateInput = this.signedModal.locator('input[type="date"]').first();
    this.signedValidityDaysInput = this.signedModal.locator('input[type="number"]').first();
    this.signedPriceVatInput = this.signedModal.locator('input').filter({ has: page.locator('xpath=preceding::label[contains(text(), "GIÁ TRỊ HỢP ĐỒNG SAU VAT")]') }).first();
    this.signedDeductionInput = this.signedModal.locator('input').filter({ has: page.locator('xpath=preceding::label[contains(text(), "GIẢM TRỪ PHÍ")]') }).first();
    this.signedStatusSelect = this.signedModal.locator('select').filter({ hasText: /Chưa thực hiện|Đang thực hiện|Hoàn thành/i }).first();
    this.signedRevenueCheckbox = this.signedModal.locator('input[type="checkbox"]').first();
    this.signedScanUploadButton = this.signedModal.locator('button:has-text("Chọn file")').first();
    this.signedScanFileInput = this.signedModal.locator('input[type="file"]').first();
    this.signedWordFileNotice = this.signedModal.locator('text=/File Word mềm/i').first();
    this.signedScanFileNotice = this.signedModal.locator('text=/Chưa đính kèm file scan/i').first();
    this.signedNoteTextarea = this.signedModal.locator('textarea').first();
    this.signedBtnSave = this.signedModal.locator('button:has-text("Lưu hợp đồng đã ký")').first();
    this.signedBtnCancel = this.signedModal.locator('button:has-text("Hủy")').first();
    this.signedBtnClose = this.signedModal.locator('button.modal-close, button[aria-label="Close"], button:has-text("×")').first();

    // Popup Cảnh báo Thay đổi Chưa lưu
    this.guardDialog = page.locator('.unsaved-changes-dialog, .modal, [role="dialog"]').filter({ hasText: /Đóng hộp thoại\?/i }).first();
    this.guardDialogTitle = this.guardDialog.locator('#unsaved-changes-title, b, h2, .modal-title, strong').filter({ hasText: /Đóng hộp thoại\?/i }).first();
    this.guardDialogMessage = this.guardDialog.locator('text=/Bạn có thay đổi chưa lưu/i').first();
    this.guardBtnContinue = this.guardDialog.locator('button:has-text("Tiếp tục nhập")').first();
    this.guardBtnClose = this.guardDialog.locator('button:has-text("Đóng")').first();

    // Slide-over Detail Panel
    this.detailPanel = page.locator('.contract-detail-panel').first();
    this.detailTitle = this.detailPanel.locator('h2, h3, .detail-title').first();
    this.detailMetadataLine = this.detailPanel.locator('.detail-meta, .metadata').first();
    this.detailBadgeStatus = this.detailPanel.locator('.stat, .status-pill, .badge').first();
    this.detailHistoryTable = this.detailPanel.locator('table').first();
    this.detailHistoryRows = this.detailPanel.locator('table tbody tr');
    this.detailCurrentContractRow = this.detailPanel.locator('table tbody tr').filter({ hasText: /·HD HIỆN TẠI/i }).first();
    this.detailHistoryTotal = this.detailPanel.locator('text=/TỔNG GIÁ TRỊ/i').first();
    this.detailPaymentSummary = this.detailPanel.locator('text=/ĐỢT THANH TOÁN/i').first();
    this.detailAttachmentSection = this.detailPanel.locator('text=/BÁO GIÁ & TÀI LIỆU ĐÍNH KÈM/i').first();
    this.detailDownloadButtons = this.detailPanel.locator('.btn-download-atc, button[title*="Tải về"]');
    this.detailNoteTextarea = this.detailPanel.locator('textarea').first();
    this.detailBtnSaveNote = this.detailPanel.locator('button:has-text("Lưu ghi chú")').first();
    this.detailBtnEdit = this.detailPanel.locator('button:has-text("Chỉnh sửa")').first();
    this.detailBtnClose = this.detailPanel.locator('button:has-text("Đóng")').first();
    this.detailHeaderCloseBtn = this.detailPanel.locator('button.dp-close, button:has-text("×"), .panel-close').first();
  }

  // ------------------------------------------------------------
  // Helper Methods
  // ------------------------------------------------------------

  async open(path = '/hop-dong'): Promise<void> {
    Logger.info(`Mở trang Hợp đồng: ${path}`);
    await this.page.goto(path);
    await this.page.waitForLoadState('networkidle');
  }

  async switchToDraftTab(): Promise<void> {
    Logger.info('Chuyển sang sub-tab: Hợp đồng nháp');
    await this.subtabDraft.click();
    await this.page.waitForTimeout(500);
  }

  async switchToSignedTab(): Promise<void> {
    Logger.info('Chuyển sang sub-tab: Hợp đồng ký');
    await this.subtabSigned.click();
    await this.page.waitForTimeout(500);
  }

  async search(keyword: string): Promise<void> {
    Logger.info(`Tìm kiếm từ khóa: "${keyword}"`);
    await this.searchInput.fill(keyword);
    await this.page.waitForTimeout(600);
  }

  async clearSearch(): Promise<void> {
    Logger.info('Xóa từ khóa tìm kiếm bằng nút "Hủy"');
    if (await this.searchClearButton.isVisible()) {
      await this.searchClearButton.click();
      await this.page.waitForTimeout(500);
    } else {
      await this.searchInput.fill('');
      await this.page.waitForTimeout(500);
    }
  }

  async selectDateFilterType(typeName: 'Ngày ký' | 'Hết hiệu lực' | 'Ngày hết hạn'): Promise<void> {
    Logger.info(`Chọn loại ngày lọc: ${typeName}`);
    await this.dateTypeTrigger.click();
    await this.page.waitForTimeout(300);
    await this.page.locator('.popover [role="option"], .popover button, .popover a, li').filter({ hasText: new RegExp(`^${typeName}$`, 'i') }).first().click();
    await this.page.waitForTimeout(400);
  }

  async selectDateFromToday(): Promise<void> {
    Logger.info('Chọn ngày "Hôm nay" cho mốc TỪ ngày');
    await this.dateFromTrigger.click();
    await this.page.waitForTimeout(400);
    await this.btnCalendarToday.click();
    await this.page.waitForTimeout(500);
  }

  async selectDateToToday(): Promise<void> {
    Logger.info('Chọn ngày "Hôm nay" cho mốc ĐẾN ngày');
    await this.dateToTrigger.click();
    await this.page.waitForTimeout(400);
    await this.btnCalendarToday.click();
    await this.page.waitForTimeout(500);
  }

  async clearDateFilter(): Promise<void> {
    Logger.info('Xóa bộ lọc thời gian theo ngày');
    if (await this.dateClearButton.isVisible()) {
      await this.dateClearButton.click();
      await this.page.waitForTimeout(500);
    }
  }

  async selectContractTypeFilter(typeName: string): Promise<void> {
    Logger.info(`Lọc theo Loại HĐ: ${typeName}`);
    await this.contractTypeFilterTrigger.click();
    await this.page.waitForTimeout(300);
    await this.page.locator('.popover [role="option"], .popover button, .popover a, li').filter({ hasText: typeName }).first().click();
    await this.page.waitForTimeout(500);
  }

  async selectStatusFilter(statusName: string): Promise<void> {
    Logger.info(`Lọc theo Trạng thái: ${statusName}`);
    await this.statusFilterTrigger.click();
    await this.page.waitForTimeout(300);
    await this.page.locator('.popover [role="option"], .popover button, .popover a, li').filter({ hasText: statusName }).first().click();
    await this.page.waitForTimeout(500);
  }

  async selectRow(index: number): Promise<void> {
    Logger.info(`Tích chọn dòng thứ ${index + 1}`);
    await this.rows.nth(index).locator('input[type="checkbox"]').first().check();
    await this.page.waitForTimeout(300);
  }

  async unselectRow(index: number): Promise<void> {
    Logger.info(`Bỏ tích chọn dòng thứ ${index + 1}`);
    await this.rows.nth(index).locator('input[type="checkbox"]').first().uncheck();
    await this.page.waitForTimeout(300);
  }

  async openDetailPanelOfFirstRow(): Promise<void> {
    Logger.info('Mở panel xem chi tiết của dòng đầu tiên');
    await this.firstRowViewButton.click();
    await this.page.waitForTimeout(600);
  }

  async closeDetailPanel(): Promise<void> {
    Logger.info('Đóng panel xem chi tiết');
    if (await this.detailHeaderCloseBtn.isVisible()) {
      await this.detailHeaderCloseBtn.click();
    } else if (await this.detailBtnClose.isVisible()) {
      await this.detailBtnClose.click();
    }
    await this.page.waitForTimeout(500);
  }
}

