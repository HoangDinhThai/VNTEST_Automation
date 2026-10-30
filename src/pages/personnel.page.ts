import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { Logger } from '../utils/logger';

/**
 * PersonnelPage: Đại diện cho màn hình Quản lý Nhân sự của hệ thống VNTEST LIMS
 * Đường dẫn: /nhan-su
 * Tuân thủ quy chuẩn POM: Locators semantic ở đầu class, method mô tả hành vi người dùng, KHÔNG chứa assertion.
 */
export class PersonnelPage extends BasePage {
  // ==========================================
  // TAB & THANH CÔNG CỤ (HEADER & TOOLBAR)
  // ==========================================
  readonly personnelTab: Locator;
  readonly bottomNavTab: Locator;
  readonly deptAllChip: Locator;
  readonly dept1Chip: Locator;
  readonly statusFilterDropdown: Locator;
  readonly searchInput: Locator;
  readonly clearSearchButton: Locator;
  readonly addPersonnelButton: Locator;
  readonly editPersonnelButton: Locator;
  readonly resetPasswordButton: Locator;
  readonly deletePersonnelButton: Locator;

  // ==========================================
  // BẢNG DỮ LIỆU NHÂN SỰ (DATA TABLE)
  // ==========================================
  readonly table: Locator;
  readonly tableHeaders: Locator;
  readonly rows: Locator;
  readonly firstRow: Locator;
  readonly secondRow: Locator;
  readonly selectAllCheckbox: Locator;
  readonly firstRowCheckbox: Locator;
  readonly secondRowCheckbox: Locator;
  readonly firstRowViewButton: Locator;

  // ==========================================
  // PHÂN TRANG & QUẢN LÝ CỘT (FOOTER & PAGER)
  // ==========================================
  readonly paginationInfo: Locator;
  readonly manageColumnsButton: Locator;
  readonly manageColumnsPopover: Locator;
  readonly pageSizeDropdown: Locator;
  readonly prevPageButton: Locator;
  readonly nextPageButton: Locator;

  // ==========================================
  // HỘP THOẠI THÊM MỚI NHÂN SỰ (ADD MODAL)
  // ==========================================
  readonly addModal: Locator;
  readonly addModalTitle: Locator;
  readonly addModalNotice: Locator;
  readonly addModalCloseButton: Locator;
  readonly addModalCancelButton: Locator;
  readonly addModalSaveButton: Locator;

  // Trường nhập liệu form Thêm mới
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly genderSelect: Locator;
  readonly dobTrigger: Locator;
  readonly citizenIdInput: Locator;
  readonly citizenIdIssuedAtTrigger: Locator;
  readonly citizenIdIssuedPlaceInput: Locator;
  readonly personalPhoneInput: Locator;
  readonly companyPhoneInput: Locator;
  readonly permanentAddressTextarea: Locator;
  readonly bankAccountInput: Locator;
  readonly bankNameInput: Locator;
  readonly emergencyPhoneInput: Locator;
  readonly emergencyRelationInput: Locator;
  readonly departmentSelect: Locator;
  readonly positionInput: Locator;
  readonly concurrentPositionInput: Locator;
  readonly probationStartedAtTrigger: Locator;
  readonly joinedAtTrigger: Locator;
  readonly contractTypeSelect: Locator;
  readonly contractEndedAtTrigger: Locator;
  readonly statusSelect: Locator;
  readonly addQualificationButton: Locator;
  readonly addDocumentButton: Locator;
  readonly socialInsuranceInput: Locator;
  readonly specialtyInput: Locator;
  readonly submittedDocumentsTextarea: Locator;
  readonly attachmentsInput: Locator;
  readonly formErrors: Locator;

  // ==========================================
  // HỘP THOẠI CHỈNH SỬA NHÂN SỰ (EDIT MODAL)
  // ==========================================
  readonly editModal: Locator;
  readonly editModalTitle: Locator;
  readonly editModalCloseButton: Locator;
  readonly editModalCancelButton: Locator;
  readonly editModalSaveButton: Locator;
  readonly editCodeInput: Locator;
  readonly editPositionReasonInput: Locator;

  // ==========================================
  // HỘP THOẠI ĐẶT LẠI MẬT KHẨU (RESET PASSWORD)
  // ==========================================
  readonly resetPasswordModal: Locator;
  readonly resetPasswordModalTitle: Locator;
  readonly resetPasswordModalInfo: Locator;
  readonly resetPasswordModalConfirmButton: Locator;
  readonly resetPasswordModalCancelButton: Locator;
  readonly resetPasswordModalCloseButton: Locator;

  // ==========================================
  // HỘP THOẠI XÁC NHẬN XÓA (DELETE MODAL)
  // ==========================================
  readonly deleteModal: Locator;
  readonly deleteModalTitle: Locator;
  readonly deleteModalInfo: Locator;
  readonly deleteModalConfirmButton: Locator;
  readonly deleteModalCancelButton: Locator;
  readonly deleteModalCloseButton: Locator;

  // ==========================================
  // BỘ LỌC TRẠNG THÁI (STATUS FILTER)
  // ==========================================
  readonly statusFilterPopover: Locator;
  readonly statusOptions: Locator;

  // ==========================================
  // NGĂN CHI TIẾT NHÂN SỰ (DETAIL DRAWER)
  // ==========================================
  readonly detailDrawer: Locator;
  readonly detailDrawerContent: Locator;
  readonly detailDrawerCloseButton: Locator;
  readonly detailHeader: Locator;
  readonly detailAvatar: Locator;
  readonly detailTitleName: Locator;
  readonly detailStatusBadge: Locator;
  readonly detailMetaCode: Locator;
  readonly detailMetaPosition: Locator;
  readonly detailMetaDept: Locator;
  readonly detailHeaderCloseButton: Locator;
  readonly detailInfoTab: Locator;
  readonly detailHistoryTab: Locator;
  readonly detailHistoryBadge: Locator;
  readonly detailInfoBody: Locator;
  readonly detailHistoryBody: Locator;
  readonly detailPositionHistorySec: Locator;
  readonly detailInfoHistorySec: Locator;
  readonly detailDeleteButton: Locator;
  readonly detailResetPasswordButton: Locator;
  readonly detailEditButton: Locator;
  readonly detailFooterCloseButton: Locator;

  constructor(page: Page) {
    super(page);

    // Tab & Toolbar
    this.personnelTab = page.locator('.tabs button.tab, button.tab').filter({ hasText: /nhân sự/i }).first();
    this.bottomNavTab = page.locator('button.module').filter({ hasText: /nhân sự/i }).first();
    this.deptAllChip = page.locator('button.bg-chiptab').filter({ hasText: /tất cả/i }).first();
    this.dept1Chip = page.locator('button.bg-chiptab').filter({ hasText: /phòng\/ban 1/i }).first();
    this.statusFilterDropdown = page.locator('.popover__trigger').filter({ hasText: /tt:/i }).first();
    this.searchInput = page.locator('.user-list-search input, input[placeholder*="Tìm theo mã nhân sự"]').first();
    this.clearSearchButton = page.locator('.user-list-search button.clear-btn, button.clear-btn').first();
    this.addPersonnelButton = page.locator('.user-list-actions button.btn-primary').filter({ hasText: /thêm/i }).first();
    this.editPersonnelButton = page.locator('.user-list-actions button.btn').filter({ hasText: /sửa/i }).first();
    this.resetPasswordButton = page.locator('.user-list-actions button.btn').filter({ hasText: /đặt lại mật khẩu/i }).first();
    this.deletePersonnelButton = page.locator('.user-list-actions button.btn-danger').filter({ hasText: /xóa/i }).first();

    // Data Table
    this.table = page.locator('table.px-tbl').first();
    this.tableHeaders = page.locator('table.px-tbl thead th');
    this.rows = page.locator('table.px-tbl tbody tr');
    this.firstRow = this.rows.first();
    this.secondRow = this.rows.nth(1);
    this.selectAllCheckbox = page.locator('table.px-tbl thead th input[type="checkbox"]').first();
    this.firstRowCheckbox = this.firstRow.locator('input[type="checkbox"]').first();
    this.secondRowCheckbox = this.secondRow.locator('input[type="checkbox"]').first();
    this.firstRowViewButton = this.firstRow.locator('button.px-view-button, button:has(svg.lucide-eye)').first();

    // Footer & Pager
    this.paginationInfo = page.locator('.pager-left span').first();
    this.manageColumnsButton = page.locator('button.px-column-manager-trigger').first();
    this.manageColumnsPopover = page.locator('.px-column-manager').first();
    this.pageSizeDropdown = page.locator('.pager-right .popover__trigger.dd').first();
    this.prevPageButton = page.locator('.pager-right .page-btn.nav').first();
    this.nextPageButton = page.locator('.pager-right .page-btn.nav').nth(1);

    // Modal Thêm nhân sự
    this.addModal = page.locator('.modal.ns-add-modal').first();
    this.addModalTitle = page.locator('#add-user-title').first();
    this.addModalNotice = page.locator('.ns-add-notice').first();
    this.addModalCloseButton = this.addModal.locator('button.modal-close').first();
    this.addModalCancelButton = this.addModal.locator('footer button.btn').filter({ hasText: /hủy/i }).first();
    this.addModalSaveButton = this.addModal.locator('footer button.btn-primary').filter({ hasText: /lưu/i }).first();

    // Form inputs
    this.nameInput = page.locator('#name').first();
    this.emailInput = page.locator('#email').first();
    this.genderSelect = page.locator('#gender').first();
    this.dobTrigger = page.locator('#date-of-birth').first();
    this.citizenIdInput = page.locator('#citizen-id').first();
    this.citizenIdIssuedAtTrigger = page.locator('#citizen-id-issued-at').first();
    this.citizenIdIssuedPlaceInput = page.locator('#citizen-id-issued-place').first();
    this.personalPhoneInput = page.locator('#personal-phone').first();
    this.companyPhoneInput = page.locator('#company-phone').first();
    this.permanentAddressTextarea = page.locator('#permanent-address').first();
    this.bankAccountInput = page.locator('#bank-account').first();
    this.bankNameInput = page.locator('#bank-name').first();
    this.emergencyPhoneInput = page.locator('#emergency-phone').first();
    this.emergencyRelationInput = page.locator('#emergency-relation').first();
    this.departmentSelect = page.locator('#department').first();
    this.positionInput = page.locator('#position').first();
    this.concurrentPositionInput = page.locator('#concurrent-position').first();
    this.probationStartedAtTrigger = page.locator('#probation-started-at').first();
    this.joinedAtTrigger = page.locator('#joined-at').first();
    this.contractTypeSelect = page.locator('#contract-type').first();
    this.contractEndedAtTrigger = page.locator('#contract-ended-at').first();
    this.statusSelect = page.locator('#status').first();
    this.addQualificationButton = page.locator('button').filter({ hasText: /\+ ?thêm bằng cấp/i }).first();
    this.addDocumentButton = page.locator('button').filter({ hasText: /\+ ?thêm tài liệu/i }).first();
    this.socialInsuranceInput = page.locator('#social-insurance-number').first();
    this.specialtyInput = page.locator('#specialty').first();
    this.submittedDocumentsTextarea = page.locator('#submitted-documents').first();
    this.attachmentsInput = page.locator('#attachments').first();
    this.formErrors = page.locator('.ns-add-error');

    // Modal Chỉnh sửa
    this.editModal = page.locator('.modal.ns-edit-modal').first();
    this.editModalTitle = page.locator('#edit-user-title').first();
    this.editModalCloseButton = this.editModal.locator('button.modal-close').first();
    this.editModalCancelButton = this.editModal.locator('footer button.btn').filter({ hasText: /hủy/i }).first();
    this.editModalSaveButton = this.editModal.locator('footer button.btn-primary').filter({ hasText: /lưu/i }).first();
    this.editCodeInput = page.locator('#code').first();
    this.editPositionReasonInput = page.locator('#position-change-reason').first();

    // Modal Đặt lại mật khẩu
    this.resetPasswordModal = page.locator('.modal.user-confirm-modal').filter({ hasText: /đặt lại mật khẩu/i }).first();
    this.resetPasswordModalTitle = this.resetPasswordModal.locator('.modal-title').first();
    this.resetPasswordModalInfo = this.resetPasswordModal.locator('.modal-info').first();
    this.resetPasswordModalConfirmButton = this.resetPasswordModal.locator('button.btn-primary').filter({ hasText: /đặt lại mật khẩu/i }).first();
    this.resetPasswordModalCancelButton = this.resetPasswordModal.locator('button.btn').filter({ hasText: /hủy/i }).first();
    this.resetPasswordModalCloseButton = this.resetPasswordModal.locator('button.modal-close').first();

    // Modal Xác nhận xóa
    this.deleteModal = page.locator('.modal.user-confirm-modal').filter({ hasText: /xóa nhân sự/i }).first();
    this.deleteModalTitle = this.deleteModal.locator('.modal-title').first();
    this.deleteModalInfo = this.deleteModal.locator('.modal-info').first();
    this.deleteModalConfirmButton = this.deleteModal.locator('button.btn-danger').filter({ hasText: /xóa/i }).first();
    this.deleteModalCancelButton = this.deleteModal.locator('button.btn').filter({ hasText: /hủy/i }).first();
    this.deleteModalCloseButton = this.deleteModal.locator('button.modal-close').first();

    // Status Filter Popover
    this.statusFilterPopover = page.locator('.popover__panel.dd-menu[role="listbox"]').first();
    this.statusOptions = page.locator('.popover__panel.dd-menu .popover__option');

    // Detail Drawer
    this.detailDrawer = page.locator('aside.detail-panel.ns-detail-drawer').first();
    this.detailDrawerContent = page.locator('.ns-detail-info-body').first();
    this.detailDrawerCloseButton = page.locator('.ns-detail-drawer button.dp-close, .ns-detail-drawer button.modal-close, .ns-detail-drawer button[aria-label="Đóng"], .ns-detail-drawer footer button:has-text("Đóng")').first();
    this.detailHeader = page.locator('.ns-detail-drawer.open .dp-header').first();
    this.detailAvatar = page.locator('.ns-detail-drawer.open .dp-avatar').first();
    this.detailTitleName = page.locator('.ns-detail-drawer.open .dp-title .name').first();
    this.detailStatusBadge = page.locator('.ns-detail-drawer.open .dp-header .stat').first();
    this.detailMetaCode = page.locator('.ns-detail-drawer.open .dp-meta .mono').first();
    this.detailMetaPosition = page.locator('.ns-detail-drawer.open .dp-meta .dp-meta-item').nth(1);
    this.detailMetaDept = page.locator('.ns-detail-drawer.open .dp-meta .dp-meta-item').nth(2);
    this.detailHeaderCloseButton = page.locator('.ns-detail-drawer.open .dp-header .dp-close').first();
    this.detailInfoTab = page.locator('.ns-detail-drawer.open .dp-tabs .dp-tab').filter({ hasText: /thông tin/i }).first();
    this.detailHistoryTab = page.locator('.ns-detail-drawer.open .dp-tabs .dp-tab').filter({ hasText: /lịch sử/i }).first();
    this.detailHistoryBadge = this.detailHistoryTab.locator('.badge, span:not(.lucide)').first();
    this.detailInfoBody = page.locator('.ns-detail-drawer.open .ns-detail-info-body').first();
    this.detailHistoryBody = page.locator('.ns-detail-drawer.open .ns-detail-history-body').first();
    this.detailPositionHistorySec = page.locator('.ns-detail-drawer.open .ns-detail-sec').filter({ hasText: /lịch sử chức vụ/i }).first();
    this.detailInfoHistorySec = page.locator('.ns-detail-drawer.open .ns-detail-sec').filter({ hasText: /lịch sử thay đổi thông tin/i }).first();
    this.detailDeleteButton = page.locator('.ns-detail-drawer.open .dp-footer button').filter({ hasText: /xóa/i }).first();
    this.detailResetPasswordButton = page.locator('.ns-detail-drawer.open .dp-footer button').filter({ hasText: /đổi mật khẩu/i }).first();
    this.detailEditButton = page.locator('.ns-detail-drawer.open .dp-footer button').filter({ hasText: /chỉnh sửa/i }).first();
    this.detailFooterCloseButton = page.locator('.ns-detail-drawer.open .dp-footer button').filter({ hasText: /^đóng$/i }).first();
  }

  /**
   * Mở màn hình danh sách Nhân sự
   */
  async open(url = '/nhan-su'): Promise<void> {
    await this.navigateTo(url);
  }

  /**
   * Tìm kiếm theo từ khóa
   */
  async search(keyword: string): Promise<void> {
    Logger.info(`Tìm kiếm nhân sự với từ khóa: "${keyword}"`);
    const searchRes = this.page.waitForResponse(res => res.url().includes('api/users') && (res.url().includes('q=') || res.status() === 200), { timeout: 8000 }).catch(() => null);
    await this.searchInput.fill(keyword);
    await this.searchInput.press('Enter');
    await searchRes;
    await this.page.waitForTimeout(500);
  }

  /**
   * Xóa nội dung tìm kiếm bằng nút Hủy
   */
  async clearSearch(): Promise<void> {
    Logger.info('Nhấn nút "Hủy" trên ô tìm kiếm');
    const resetRes = this.page.waitForResponse(res => res.url().includes('api/users') && res.status() === 200, { timeout: 8000 }).catch(() => null);
    await this.clearSearchButton.click();
    await resetRes;
    await this.page.waitForTimeout(500);
  }

  /**
   * Lọc theo chip Phòng/ban
   */
  async filterByDepartmentChip(dept: 'all' | 'dept1'): Promise<void> {
    if (dept === 'all') {
      Logger.info('Lọc tất cả phòng ban');
      await this.deptAllChip.click();
    } else {
      Logger.info('Lọc Phòng/ban 1');
      await this.dept1Chip.click();
    }
  }

  /**
   * Tích chọn 1 dòng theo index (bắt đầu từ 0)
   */
  async selectRow(index: number): Promise<void> {
    Logger.info(`Tích chọn dòng thứ ${index + 1}`);
    const rowCb = this.rows.nth(index).locator('input[type="checkbox"]').first();
    await rowCb.check();
  }

  /**
   * Bỏ tích chọn 1 dòng theo index
   */
  async unselectRow(index: number): Promise<void> {
    Logger.info(`Bỏ chọn dòng thứ ${index + 1}`);
    const rowCb = this.rows.nth(index).locator('input[type="checkbox"]').first();
    await rowCb.uncheck();
  }

  /**
   * Tích chọn tất cả các dòng qua checkbox header
   */
  async selectAll(): Promise<void> {
    Logger.info('Tích chọn ô "Chọn tất cả" trên header bảng');
    await this.firstRow.waitFor({ state: 'visible', timeout: 10000 });
    await this.selectAllCheckbox.check();
  }

  /**
   * Bỏ chọn tất cả các dòng qua checkbox header
   */
  async unselectAll(): Promise<void> {
    Logger.info('Bỏ tích chọn ô "Chọn tất cả" trên header bảng');
    await this.selectAllCheckbox.uncheck();
  }

  /**
   * Mở hộp thoại Thêm nhân sự mới
   */
  async openAddModal(): Promise<void> {
    Logger.info('Nhấn nút "Thêm" để mở hộp thoại thêm mới nhân sự');
    await this.addPersonnelButton.click();
    await this.addModal.waitFor({ state: 'visible' });
    await this.departmentSelect.locator('option').nth(1).waitFor({ state: 'attached', timeout: 5000 }).catch(() => {});
  }

  /**
   * Đóng hộp thoại Thêm nhân sự bằng nút Hủy
   */
  async cancelAddModal(): Promise<void> {
    Logger.info('Nhấn nút "Hủy" để đóng hộp thoại thêm nhân sự');
    await this.addModalCancelButton.click();
  }

  /**
   * Đóng hộp thoại Thêm nhân sự bằng nút X (close)
   */
  async closeAddModal(): Promise<void> {
    Logger.info('Nhấn nút "Đóng" [×] trên hộp thoại thêm nhân sự');
    await this.addModalCloseButton.click();
  }

  /**
   * Thêm 1 dòng bằng cấp / chứng chỉ mới
   */
  async addQualificationRow(): Promise<void> {
    Logger.info('Nhấn nút "+ Thêm bằng cấp/chứng chỉ"');
    await this.addQualificationButton.click();
  }

  /**
   * Thêm 1 dòng tài liệu khác mới
   */
  async addDocumentRow(): Promise<void> {
    Logger.info('Nhấn nút "+ Thêm tài liệu"');
    await this.addDocumentButton.click();
  }

  /**
   * Nhấn nút Lưu trên form Thêm mới để submit hoặc kích hoạt validation
   */
  async submitAddForm(): Promise<void> {
    Logger.info('Nhấn nút "Lưu" trên form thêm nhân sự');
    await this.addModalSaveButton.click();
  }

  /**
   * Mở hộp thoại Chỉnh sửa nhân sự (yêu cầu đã chọn 1 dòng)
   */
  async openEditModal(): Promise<void> {
    Logger.info('Nhấn nút "Sửa" trên thanh công cụ');
    await this.editPersonnelButton.click();
  }

  /**
   * Đóng hộp thoại Chỉnh sửa bằng nút Hủy
   */
  async cancelEditModal(): Promise<void> {
    Logger.info('Nhấn nút "Hủy" trên hộp thoại chỉnh sửa');
    await this.editModalCancelButton.click();
  }

  /**
   * Mở hộp thoại Đặt lại mật khẩu (yêu cầu đã chọn dòng)
   */
  async openResetPasswordModal(): Promise<void> {
    Logger.info('Nhấn nút "Đặt lại mật khẩu" trên thanh công cụ');
    await this.resetPasswordButton.click();
  }

  /**
   * Đóng hộp thoại Đặt lại mật khẩu bằng nút Hủy
   */
  async cancelResetPasswordModal(): Promise<void> {
    Logger.info('Nhấn nút "Hủy" trên hộp thoại đặt lại mật khẩu');
    await this.resetPasswordModalCancelButton.click();
  }

  /**
   * Mở hộp thoại Xác nhận xóa (yêu cầu đã chọn dòng)
   */
  async openDeleteModal(): Promise<void> {
    Logger.info('Nhấn nút "Xóa" trên thanh công cụ');
    await this.deletePersonnelButton.click();
  }

  /**
   * Đóng hộp thoại Xác nhận xóa bằng nút Hủy
   */
  async cancelDeleteModal(): Promise<void> {
    Logger.info('Nhấn nút "Hủy" trên hộp thoại xóa');
    await this.deleteModalCancelButton.click();
  }

  /**
   * Mở dropdown bộ lọc trạng thái
   */
  async openStatusFilter(): Promise<void> {
    Logger.info('Mở dropdown bộ lọc trạng thái');
    await this.statusFilterDropdown.click();
    await this.statusFilterPopover.waitFor({ state: 'visible' });
  }

  /**
   * Chọn một trạng thái cụ thể trong dropdown lọc
   */
  async selectStatusFilter(statusText: string): Promise<void> {
    Logger.info(`Chọn trạng thái lọc: "${statusText}"`);
    await this.openStatusFilter();
    const option = this.statusOptions.filter({ hasText: new RegExp(`^\\s*${statusText}\\s*$`, 'i') }).first();
    const apiPromise = this.page.waitForResponse(res => res.url().includes('api/users'));
    await option.click();
    await apiPromise;
    await this.page.waitForTimeout(400);
  }

  /**
   * Mở ngăn Chi tiết nhân sự bằng nút mắt (view button) tại dòng chỉ định
   */
  async openDetail(rowIndex = 0): Promise<void> {
    Logger.info(`Nhấn biểu tượng xem chi tiết (mắt) tại dòng ${rowIndex + 1}`);
    const viewBtn = this.rows.nth(rowIndex).locator('button.px-view-button, button:has(svg.lucide-eye)').first();
    await viewBtn.click();
    await this.page.waitForSelector('.ns-detail-drawer.open', { timeout: 10000 });
  }

  /**
   * Đóng ngăn Chi tiết nhân sự
   */
  async closeDetail(): Promise<void> {
    Logger.info('Đóng ngăn chi tiết nhân sự');
    const closeBtn = this.page.locator('.ns-detail-drawer.open button.dp-close, .ns-detail-drawer.open footer button:has-text("Đóng")').first();
    if (await closeBtn.isVisible()) {
      await closeBtn.click();
      await this.page.locator('.ns-detail-drawer').waitFor({ state: 'attached' });
      await this.page.waitForTimeout(300);
    }
  }

  /**
   * Chuyển sang Tab "Thông tin" trong ngăn chi tiết
   */
  async switchToInfoTab(): Promise<void> {
    Logger.info('Chuyển sang tab "Thông tin" trong ngăn chi tiết');
    await this.detailInfoTab.click();
    await this.detailInfoBody.waitFor({ state: 'visible' });
  }

  /**
   * Chuyển sang Tab "Lịch sử" trong ngăn chi tiết
   */
  async switchToHistoryTab(): Promise<void> {
    Logger.info('Chuyển sang tab "Lịch sử" trong ngăn chi tiết');
    await this.detailHistoryTab.click();
    await this.detailHistoryBody.waitFor({ state: 'visible' });
  }

  /**
   * Lấy giá trị của một trường dữ liệu trong Tab "Thông tin" theo nhãn (label)
   */
  async getDetailFieldValue(label: string): Promise<string> {
    const fieldContainer = this.page.locator('.ns-detail-drawer.open .ns-detail-grid > div').filter({
      has: this.page.locator(`.lbl:has-text("${label}")`)
    }).first();
    return (await fieldContainer.locator('strong').innerText()).trim();
  }

  /**
   * Mở popover Quản lý cột
   */
  async openManageColumns(): Promise<void> {
    Logger.info('Nhấn nút "Quản lý cột"');
    await this.manageColumnsButton.click();
  }

  /**
   * Chọn ngày sinh là Hôm nay thông qua custom datepicker
   */
  async selectDateOfBirthToday(): Promise<void> {
    Logger.info('Chọn ngày sinh là Hôm nay qua custom datepicker');
    await this.dobTrigger.click();
    const todayBtn = this.page.locator('.popover__panel .date-calendar__foot-btn--primary').filter({ hasText: /hôm nay/i }).first();
    await todayBtn.click();
  }

  /**
   * Điền thông tin form Thêm mới nhân sự
   */
  async fillAddPersonnelForm(data: {
    name: string;
    email: string;
    gender?: 'male' | 'female' | 'other';
    citizenId: string;
    phone: string;
    department?: string;
    position: string;
    contractType?: 'probation' | 'fixed_term' | 'indefinite';
    status?: 'probation' | 'working' | 'long_leave' | 'resigned' | 'contract_terminated';
    issuedPlace?: string;
    companyPhone?: string;
    permanentAddress?: string;
    bankAccount?: string;
    bankName?: string;
    emergencyPhone?: string;
    emergencyRelation?: string;
    concurrentPosition?: string;
    socialInsurance?: string;
    specialty?: string;
  }): Promise<void> {
    Logger.info(`Điền thông tin thêm nhân sự: ${data.name} - ${data.email}`);
    await this.nameInput.fill(data.name);
    await this.emailInput.fill(data.email);
    if (data.gender) {
      await this.genderSelect.selectOption(data.gender);
    }
    await this.selectDateOfBirthToday();
    await this.citizenIdInput.fill(data.citizenId);
    await this.personalPhoneInput.fill(data.phone);
    if (data.department) {
      await this.departmentSelect.selectOption(data.department);
    } else {
      await this.departmentSelect.selectOption('1');
    }
    await this.positionInput.fill(data.position);
    if (data.contractType) {
      await this.contractTypeSelect.selectOption(data.contractType);
    } else {
      await this.contractTypeSelect.selectOption('fixed_term');
    }
    if (data.status) {
      await this.statusSelect.selectOption(data.status);
    } else {
      await this.statusSelect.selectOption('working');
    }
    if (data.issuedPlace) {
      await this.citizenIdIssuedPlaceInput.fill(data.issuedPlace);
    }
    if (data.companyPhone) {
      await this.companyPhoneInput.fill(data.companyPhone);
    }
    if (data.permanentAddress) {
      await this.permanentAddressTextarea.fill(data.permanentAddress);
    }
    if (data.bankAccount) {
      await this.bankAccountInput.fill(data.bankAccount);
    }
    if (data.bankName) {
      await this.bankNameInput.fill(data.bankName);
    }
    if (data.emergencyPhone) {
      await this.emergencyPhoneInput.fill(data.emergencyPhone);
    }
    if (data.emergencyRelation) {
      await this.emergencyRelationInput.fill(data.emergencyRelation);
    }
    if (data.concurrentPosition) {
      await this.concurrentPositionInput.fill(data.concurrentPosition);
    }
    if (data.socialInsurance) {
      await this.socialInsuranceInput.fill(data.socialInsurance);
    }
    if (data.specialty) {
      await this.specialtyInput.fill(data.specialty);
    }
  }

  /**
   * Điền thông tin chỉnh sửa nhân sự
   */
  async fillEditPersonnelForm(data: {
    name?: string;
    phone?: string;
    position?: string;
    positionChangeReason?: string;
  }): Promise<void> {
    Logger.info('Điền thông tin chỉnh sửa nhân sự');
    if (data.name) {
      await this.nameInput.fill(data.name);
    }
    if (data.phone) {
      await this.personalPhoneInput.fill(data.phone);
    }
    if (data.position) {
      await this.positionInput.fill(data.position);
      if (data.positionChangeReason) {
        await this.editPositionReasonInput.fill(data.positionChangeReason);
      }
    }
  }

  /**
   * Nhấn nút Lưu trên form Chỉnh sửa
   */
  async submitEditForm(): Promise<void> {
    Logger.info('Nhấn nút "Lưu" trên form chỉnh sửa');
    await this.editModalSaveButton.click();
  }

  /**
   * Xác nhận đặt lại mật khẩu trong hộp thoại
   */
  async confirmResetPassword(): Promise<void> {
    Logger.info('Nhấn nút "Đặt lại mật khẩu" trong hộp thoại xác nhận');
    await this.resetPasswordModalConfirmButton.click();
  }

  /**
   * Xác nhận xóa nhân sự trong hộp thoại
   */
  async confirmDelete(): Promise<void> {
    Logger.info('Nhấn nút "Xóa" trong hộp thoại xác nhận');
    await this.deleteModalConfirmButton.click();
  }
}

