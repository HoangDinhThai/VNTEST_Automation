import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { Logger } from '../utils/logger';

/**
 * CollaboratorsPage: Đại diện cho khối màn hình Quản lý Cộng tác viên (Cá nhân & tỷ lệ hoa hồng)
 * Vị trí: Bảng danh sách phía dưới tại đường dẫn /doi-tac
 * Tuân thủ quy chuẩn POM: Locators semantic ở đầu class, method mô tả hành vi người dùng, KHÔNG chứa assertion.
 */
export class CollaboratorsPage extends BasePage {
  // Điều hướng & Khối danh sách Cộng tác viên (Lower Section)
  readonly partnersTab: Locator;
  readonly sectionHeader: Locator;
  readonly toolbar: Locator;

  // Thanh công cụ khối CTV
  readonly addCtvButton: Locator;
  readonly editCtvButton: Locator;
  readonly deleteCtvButton: Locator;
  readonly searchInput: Locator;
  readonly commissionFilterButton: Locator;
  readonly dateTypeFilterButton: Locator;
  readonly dateFromTrigger: Locator;
  readonly dateToTrigger: Locator;

  // Bảng dữ liệu CTV
  readonly table: Locator;
  readonly rows: Locator;
  readonly firstRow: Locator;
  readonly firstRowCheckbox: Locator;
  readonly firstRowViewButton: Locator;
  readonly selectAllCheckbox: Locator;

  // Hộp thoại Thêm mới / Chỉnh sửa CTV (Modal)
  readonly modal: Locator;
  readonly modalTitle: Locator;
  readonly modalCloseButton: Locator;
  readonly businessTypeButton: Locator;
  readonly personalTypeButton: Locator;
  readonly saleSelect: Locator;
  readonly contactDateTrigger: Locator;
  readonly fullNameInput: Locator;
  readonly idCardInput: Locator;
  readonly permanentAddressInput: Locator;
  readonly bankAccountInput: Locator;
  readonly bankNameInput: Locator;
  readonly phoneInput: Locator;
  readonly emailInput: Locator;
  readonly commissionFixedOption: Locator;
  readonly commissionProgressiveOption: Locator;
  readonly commissionRateInput: Locator;
  readonly commissionExpiryTrigger: Locator;
  readonly noteTextarea: Locator;
  readonly modalCancelButton: Locator;
  readonly modalSaveButton: Locator;
  readonly modalSaveAndContinueButton: Locator;
  readonly modalUpdateButton: Locator;
  readonly invalidFormError: Locator;
  readonly emailFormatError: Locator;
  readonly createSuccessToast: Locator;
  readonly updateSuccessToast: Locator;

  // Ngăn Chi tiết CTV (Detail Panel / Drawer)
  readonly detailPanel: Locator;
  readonly detailCloseButton: Locator;
  readonly detailTitle: Locator;
  readonly detailInfoTab: Locator;
  readonly detailHistoryTab: Locator;
  readonly detailChangeLogTab: Locator;

  // Hộp thoại Xác nhận xóa CTV
  readonly deleteModal: Locator;
  readonly deleteModalTitle: Locator;
  readonly deleteModalCancelButton: Locator;
  readonly deleteModalConfirmButton: Locator;
  readonly deleteSuccessToast: Locator;

  // Phân trang & Quản lý cột
  readonly paginationInfo: Locator;
  readonly manageColumnsButton: Locator;
  readonly manageColumnsModal: Locator;
  readonly manageColumnsCloseButton: Locator;

  constructor(page: Page) {
    super(page);

    // Tab chính & Khối CTV
    this.partnersTab = page.locator('button.tab, .tab').filter({ hasText: /đối tác & ctv/i }).first();
    this.sectionHeader = page.locator('.partner-list-section__header').nth(1);
    this.toolbar = page.locator('.partner-list-toolbar').nth(1);

    // Thanh công cụ khối CTV
    this.addCtvButton = this.toolbar.getByRole('button', { name: /Thêm/i });
    this.editCtvButton = this.toolbar.getByRole('button', { name: /^Sửa$/ });
    this.deleteCtvButton = this.toolbar.getByRole('button', { name: /xóa/i });
    this.searchInput = this.toolbar.locator('input[type="search"]');
    this.commissionFilterButton = this.toolbar.locator('.popover__trigger').filter({ hasText: /Loại HH/i }).first();
    this.dateTypeFilterButton = this.toolbar.locator('.from-to-date-filter__label-trigger').first();
    this.dateFromTrigger = this.toolbar.locator('.date-filter-segment__trigger').first();
    this.dateToTrigger = this.toolbar.locator('.date-filter-segment__trigger').nth(1);

    // Bảng dữ liệu CTV
    this.table = page.locator('table').nth(1);
    this.rows = this.table.locator('tbody tr');
    this.firstRow = this.rows.first();
    this.firstRowCheckbox = this.firstRow.locator('input[type="checkbox"]');
    this.firstRowViewButton = this.firstRow.locator('button').first();
    this.selectAllCheckbox = this.table.locator('thead th input[type="checkbox"]').first();

    // Hộp thoại Thêm mới / Chỉnh sửa
    this.modal = page.locator('.modal, [role="dialog"]').filter({ hasText: /cộng tác viên|đối tác/i }).first();
    this.modalTitle = this.modal.locator('h2, h3, h4, .modal-title, [class*="modal__title"]').first();
    this.modalCloseButton = this.modal.locator('.btn-close, .modal-close, [aria-label="Close"], button[aria-label="Đóng"]').first();
    this.businessTypeButton = this.modal.locator('button, label').filter({ hasText: /^Doanh nghiệp$/ }).first();
    this.personalTypeButton = this.modal.locator('button, label').filter({ hasText: /^Cá nhân$/ }).first();
    this.saleSelect = this.modal.locator('select').first();
    this.contactDateTrigger = this.modal.locator('.date-picker, input[placeholder*="dd/MM/yyyy"]').first();
    this.fullNameInput = this.modal.locator('label:has-text("HỌ VÀ TÊN") input').first();
    this.idCardInput = this.modal.locator('label:has-text("SỐ CĂN CƯỚC CÔNG DÂN") input').first();
    this.permanentAddressInput = this.modal.locator('label:has-text("ĐỊA CHỈ THƯỜNG TRÚ") input').first();
    this.bankAccountInput = this.modal.locator('label:has-text("SỐ TÀI KHOẢN NGÂN HÀNG") input').first();
    this.bankNameInput = this.modal.locator('label:has-text("TÊN NGÂN HÀNG") input').first();
    this.phoneInput = this.modal.locator('label:has-text("SỐ ĐIỆN THOẠI") input').first();
    this.emailInput = this.modal.locator('label:has-text("EMAIL") input').first();
    this.commissionFixedOption = this.modal.locator('text=Cố định').first();
    this.commissionProgressiveOption = this.modal.locator('text=Lũy tiến').first();
    this.commissionRateInput = this.modal.locator('label:has-text("TỶ LỆ HOA HỒNG") input').first();
    this.commissionExpiryTrigger = this.modal.locator('label:has-text("NGÀY HẾT HẠN HOA HỒNG") input, label:has-text("NGÀY HẾT HẠN HOA HỒNG") button').first();
    this.noteTextarea = this.modal.locator('textarea').first();
    this.modalCancelButton = this.modal.getByRole('button', { name: 'Hủy', exact: true });
    this.modalSaveButton = this.modal.getByRole('button', { name: 'Lưu', exact: true });
    this.modalSaveAndContinueButton = this.modal.getByRole('button', { name: 'Lưu & tạo tiếp', exact: true });
    this.modalUpdateButton = this.modal.getByRole('button', { name: 'Cập nhật', exact: true });
    this.invalidFormError = page.getByText('Thông tin nhập chưa hợp lệ. Vui lòng kiểm tra lại.');
    this.emailFormatError = page.getByText('Email không đúng định dạng.');
    this.createSuccessToast = page.getByText('Đã lưu cộng tác viên mới.');
    this.updateSuccessToast = page.getByText(/Đã cập nhật|Đã lưu/i);

    // Ngăn Chi tiết (Drawer)
    this.detailPanel = page.locator('aside.detail-panel.open');
    this.detailCloseButton = this.detailPanel.locator('button.dp-close, button[aria-label="Đóng"], button').first();
    this.detailTitle = this.detailPanel.locator('.dp-title, h3, h2, .name').first();
    this.detailInfoTab = this.detailPanel.locator('.dp-tab, button').filter({ hasText: 'THÔNG TIN' }).first();
    this.detailHistoryTab = this.detailPanel.locator('.dp-tab, button').filter({ hasText: 'LỊCH SỬ GD' }).first();
    this.detailChangeLogTab = this.detailPanel.locator('.dp-tab, button').filter({ hasText: 'LỊCH SỬ THAY ĐỔI' }).first();

    // Hộp thoại Xác nhận xóa CTV
    this.deleteModal = page.locator('.modal, [role="dialog"]').filter({ hasText: /xóa cộng tác viên|xoá cộng tác viên/i }).first();
    this.deleteModalTitle = this.deleteModal.locator('h2, h3, h4, .modal-title, [class*="modal__title"]').first();
    this.deleteModalCancelButton = this.deleteModal.getByRole('button', { name: 'Hủy', exact: true });
    this.deleteModalConfirmButton = this.deleteModal.locator('button').filter({ hasText: /Xóa|Xoá/i }).last();
    this.deleteSuccessToast = page.getByText(/Đã xóa thành công \d+ cộng tác viên|Đã xóa thành công/i);

    // Phân trang & Quản lý cột
    this.paginationInfo = page.locator('.partner-list-section').nth(1).locator('.pagination-info, [class*="pagination"]').first();
    this.manageColumnsButton = page.locator('.partner-list-section, div').filter({ hasText: /Hiện \d+-\d+ \/ \d+ CTV/i }).locator('button:has-text("Quản lý cột")').first();
    this.manageColumnsModal = page.locator('.modal, [role="dialog"]').filter({ hasText: /quản lý cột/i }).first();
    this.manageColumnsCloseButton = this.manageColumnsModal.locator('button').filter({ hasText: /đóng|hủy/i }).first();
  }

  /**
   * Mở trang Đối tác & CTV
   */
  async open(url = '/doi-tac'): Promise<void> {
    Logger.info(`Điều hướng tới màn hình Quản lý Đối tác & CTV: ${url}`);
    await this.navigateTo(url);
  }

  /**
   * Tìm kiếm CTV theo từ khóa và nhấn Enter
   */
  async search(keyword: string): Promise<void> {
    Logger.info(`Tìm kiếm cộng tác viên với từ khóa: "${keyword}"`);
    await this.searchInput.fill(keyword);
    await this.searchInput.press('Enter');
    await this.page.waitForTimeout(600);
  }

  /**
   * Xóa từ khóa tìm kiếm CTV để trở về danh sách ban đầu
   */
  async clearSearch(): Promise<void> {
    Logger.info('Xóa ô tìm kiếm để làm mới danh sách cộng tác viên');
    await this.searchInput.fill('');
    await this.searchInput.press('Enter');
    await this.page.waitForTimeout(600);
  }

  /**
   * Lọc theo Loại hoa hồng (Tất cả, Cố định, Lũy tiến)
   */
  async filterByCommissionType(optionText: string): Promise<void> {
    Logger.info(`Chọn bộ lọc Loại hoa hồng CTV: "${optionText}"`);
    await this.commissionFilterButton.click();
    await this.page.waitForTimeout(300);
    await this.page.locator('.popover__option, [role="option"]').filter({ hasText: optionText }).first().click();
    await this.page.waitForTimeout(600);
  }

  /**
   * Chuyển đổi tiêu chí lọc ngày CTV (Ngày LH / Ngày hết hạn HH)
   */
  async selectDateFilterType(typeName: string): Promise<void> {
    Logger.info(`Chọn tiêu chí lọc ngày CTV: "${typeName}"`);
    await this.dateTypeFilterButton.click();
    await this.page.waitForTimeout(300);
    await this.page.locator('.popover__option, [role="option"]').filter({ hasText: typeName }).first().click();
    await this.page.waitForTimeout(600);
  }

  /**
   * Tích chọn một dòng CTV theo chỉ số index (0-based)
   */
  async selectRow(index = 0): Promise<void> {
    Logger.info(`Tích chọn dòng cộng tác viên thứ ${index + 1}`);
    await this.rows.nth(index).locator('input[type="checkbox"]').check();
    await this.page.waitForTimeout(300);
  }

  /**
   * Bỏ tích chọn một dòng CTV theo chỉ số index (0-based)
   */
  async unselectRow(index = 0): Promise<void> {
    Logger.info(`Bỏ chọn dòng cộng tác viên thứ ${index + 1}`);
    await this.rows.nth(index).locator('input[type="checkbox"]').uncheck();
    await this.page.waitForTimeout(300);
  }

  /**
   * Mở hộp thoại Thêm mới Cộng tác viên
   */
  async openCreateModal(): Promise<void> {
    Logger.info('Nhấn nút "Thêm" để mở hộp thoại Thêm Cộng tác viên mới');
    await this.addCtvButton.click();
    await this.page.waitForTimeout(400);
  }

  /**
   * Đóng hộp thoại tạo mới / chỉnh sửa CTV bằng nút Hủy
   */
  async closeCreateModal(): Promise<void> {
    Logger.info('Nhấn nút "Hủy" trên hộp thoại CTV');
    await this.modalCancelButton.click();
    await this.page.waitForTimeout(300);
  }

  /**
   * Mở hộp thoại Sửa Cộng tác viên
   */
  async openEditModal(): Promise<void> {
    Logger.info('Nhấn nút "Sửa" trên thanh công cụ CTV');
    await this.editCtvButton.click();
    await this.page.waitForTimeout(500);
  }

  /**
   * Mở hộp thoại Xác nhận xóa CTV
   */
  async openDeleteModal(): Promise<void> {
    Logger.info('Nhấn nút "Xóa" trên thanh công cụ CTV');
    await this.deleteCtvButton.click();
    await this.page.waitForTimeout(400);
  }

  /**
   * Xác nhận xóa cộng tác viên
   */
  async confirmDelete(): Promise<void> {
    Logger.info('Nhấn nút xác nhận xóa trên hộp thoại CTV');
    await this.deleteModalConfirmButton.click();
    await this.page.waitForTimeout(800);
  }

  /**
   * Đóng hộp thoại xác nhận xóa CTV bằng nút Hủy
   */
  async cancelDelete(): Promise<void> {
    Logger.info('Nhấn nút "Hủy" trên hộp thoại xác nhận xóa CTV');
    await this.deleteModalCancelButton.click();
    await this.page.waitForTimeout(300);
  }

  /**
   * Mở ngăn xem chi tiết CTV tại dòng index (0-based)
   */
  async openDetailDrawer(index = 0): Promise<void> {
    Logger.info(`Nhấn biểu tượng con mắt tại dòng CTV thứ ${index + 1} để xem chi tiết`);
    await this.rows.nth(index).locator('button').first().click();
    await this.page.waitForTimeout(500);
  }

  /**
   * Đóng ngăn xem chi tiết CTV
   */
  async closeDetailDrawer(): Promise<void> {
    Logger.info('Đóng ngăn chi tiết CTV');
    await this.detailCloseButton.click();
    await this.page.waitForTimeout(300);
  }

  /**
   * Điền thông tin tạo mới Cộng tác viên (Cá nhân) và gửi form
   */
  async createCollaborator(data: {
    fullName: string;
    idCard: string;
    phone: string;
    commissionRate: string;
    email?: string;
    permanentAddress?: string;
  }): Promise<void> {
    Logger.info(`Nhập thông tin tạo mới Cộng tác viên: ${data.fullName}`);
    await this.saleSelect.selectOption({ index: 1 });
    await this.fullNameInput.fill(data.fullName);
    await this.idCardInput.fill(data.idCard);
    await this.phoneInput.fill(data.phone);
    await this.commissionRateInput.fill(data.commissionRate);

    if (data.email) {
      await this.emailInput.fill(data.email);
    }
    if (data.permanentAddress) {
      await this.permanentAddressInput.fill(data.permanentAddress);
    }

    Logger.info('Nhấn nút "Lưu" trên form tạo mới cộng tác viên');
    await this.modalSaveButton.click();
    await this.page.waitForTimeout(800);
  }

  /**
   * Nhấn nút Lưu trên modal tạo mới CTV
   */
  async submitForm(): Promise<void> {
    Logger.info('Nhấn nút "Lưu" trên hộp thoại CTV');
    await this.modalSaveButton.click();
    await this.page.waitForTimeout(500);
  }

  /**
   * Nhấn nút Cập nhật trên modal chỉnh sửa CTV
   */
  async submitUpdateForm(): Promise<void> {
    Logger.info('Nhấn nút "Cập nhật" trên hộp thoại chỉnh sửa CTV');
    await this.modalUpdateButton.click();
    await this.page.waitForTimeout(800);
  }
}
