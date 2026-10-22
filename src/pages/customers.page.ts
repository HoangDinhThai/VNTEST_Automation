import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { Logger } from '../utils/logger';

/**
 * CustomersPage: Đại diện cho màn hình Danh sách Khách hàng của hệ thống VNTEST LIMS
 * Tuân thủ quy chuẩn: Locators semantic ở đầu class, method mô tả hành vi người dùng, KHÔNG chứa assertion.
 */
export class CustomersPage extends BasePage {
  // Tab & Thanh công cụ
  readonly customersTab: Locator;
  readonly addCustomerButton: Locator;
  readonly editCustomerButton: Locator;
  readonly deleteCustomerButton: Locator;
  readonly changeSaleButton: Locator;
  readonly searchInput: Locator;
  readonly customerGroupFilterButton: Locator;
  readonly statusFilterButton: Locator;
  readonly dateFromTrigger: Locator;
  readonly dateToTrigger: Locator;

  // Bảng dữ liệu Khách hàng
  readonly table: Locator;
  readonly rows: Locator;
  readonly firstRow: Locator;
  readonly firstRowCheckbox: Locator;
  readonly firstRowViewButton: Locator;

  // Hộp thoại Thêm mới / Chỉnh sửa Khách hàng (Modal)
  readonly modal: Locator;
  readonly modalTitle: Locator;
  readonly modalCloseButton: Locator;
  readonly businessTypeButton: Locator;
  readonly personalTypeButton: Locator;
  readonly saleSelect: Locator;
  readonly sourceSelect: Locator;
  readonly companyNameInput: Locator;
  readonly taxCodeInput: Locator;
  readonly addressInput: Locator;
  readonly addContactButton: Locator;
  readonly contactNameInput: Locator;
  readonly contactPhoneInput: Locator;
  readonly contactEmailInput: Locator;
  readonly personalFullNameInput: Locator;
  readonly personalPhoneInput: Locator;
  readonly personalEmailInput: Locator;
  readonly personalIdInput: Locator;
  readonly personalAddressInput: Locator;
  readonly modalCancelButton: Locator;
  readonly modalSaveButton: Locator;
  readonly modalSaveAndContinueButton: Locator;
  readonly modalUpdateButton: Locator;
  readonly contactRequiredError: Locator;
  readonly requiredFieldsError: Locator;
  readonly createSuccessToast: Locator;
  readonly updateSuccessToast: Locator;

  // Nút & ô nhập Kiểm tra trùng (Check trùng)
  readonly checkCompanyMstButton: Locator;
  readonly checkInvoiceMstButton: Locator;
  readonly checkPersonalPhoneButton: Locator;
  readonly invoiceTaxCodeInput: Locator;
  readonly duplicateFoundToast: Locator;
  readonly noDuplicateToast: Locator;

  // Ngăn Chi tiết Khách hàng (Detail Panel / Drawer)
  readonly detailPanel: Locator;
  readonly detailCloseButton: Locator;
  readonly detailCompanyName: Locator;
  readonly detailInfoTab: Locator;
  readonly detailHistoryTab: Locator;
  readonly detailChangeLogTab: Locator;

  // Hộp thoại Xác nhận xóa Khách hàng
  readonly deleteModal: Locator;
  readonly deleteModalTitle: Locator;
  readonly deleteCancelButton: Locator;
  readonly deleteConfirmButton: Locator;
  readonly deleteSuccessToast: Locator;

  // Hộp thoại Đổi người phụ trách (Đổi sale)
  readonly changeSaleModal: Locator;
  readonly changeSaleModalTitle: Locator;
  readonly changeSaleModalCloseButton: Locator;
  readonly changeSaleModalInfo: Locator;
  readonly changeSaleSelectTrigger: Locator;
  readonly changeSaleReasonInput: Locator;
  readonly changeSaleCancelButton: Locator;
  readonly changeSaleConfirmButton: Locator;
  readonly changeSaleSelectRequiredError: Locator;
  readonly changeSaleReasonRequiredError: Locator;
  readonly changeSaleSuccessToast: Locator;

  constructor(page: Page) {
    super(page);

    // Tab & Toolbar Actions
    this.customersTab = page.locator('button.tab, .tab').filter({ hasText: /khách hàng/i }).first();
    this.searchInput = page.getByPlaceholder(/Find: Tên Cty, MST, người LH, SĐT/i);
    this.customerGroupFilterButton = page.locator('button.popover__trigger.dd').filter({ hasText: /Tổng KH|Cá nhân|Doanh nghiệp/i }).first();
    this.statusFilterButton = page.locator('button.popover__trigger.dd').filter({ hasText: /Trạng thái/i }).first();
    this.dateFromTrigger = page.locator('.date-filter-segment__trigger').filter({ hasText: /Từ/i }).first();
    this.dateToTrigger = page.locator('.date-filter-segment__trigger').filter({ hasText: /Đến/i }).first();
    this.addCustomerButton = page.getByRole('button', { name: 'Thêm', exact: true });
    this.editCustomerButton = page.locator('.toolbar button, .filters button, button.btn').filter({ hasText: /^Sửa$/ }).first();
    this.deleteCustomerButton = page.locator('.toolbar button, .filters button, button.btn').filter({ hasText: /^Xóa$/ }).first();
    this.changeSaleButton = page.locator('.toolbar button, .filters button, button.btn').filter({ hasText: /^Đổi sale$/ }).first();

    // Table elements
    this.table = page.locator('table');
    this.rows = page.locator('table tbody tr');
    this.firstRow = page.locator('table tbody tr').first();
    this.firstRowCheckbox = this.firstRow.locator('input[type="checkbox"]');
    this.firstRowViewButton = this.firstRow.locator('.px-view-button, button[aria-label="Xem chi tiết"]');

    // Modal Create / Edit
    this.modal = page.locator('.modal.addkh-modal, .modal, [role="dialog"]').filter({ hasText: /khách hàng/i });
    this.modalTitle = this.modal.locator('.modal-title');
    this.modalCloseButton = this.modal.locator('.modal-close');
    this.businessTypeButton = this.modal.locator('button, .addkh-toggle-btn').filter({ hasText: /^Doanh nghiệp$/ }).first();
    this.personalTypeButton = this.modal.locator('button, .addkh-toggle-btn').filter({ hasText: /^Cá nhân$/ }).first();
    this.saleSelect = this.modal.locator('select').nth(0);
    this.sourceSelect = this.modal.locator('select').nth(1);
    this.companyNameInput = page.getByPlaceholder('Ví dụ: Công ty TNHH ABC Việt Nam');
    this.taxCodeInput = page.getByPlaceholder('Nhập 10 hoặc 13 chữ số');
    this.addressInput = page.getByPlaceholder('Ví dụ: Số 12 Nguyễn Trãi, Thanh Xuân, Hà Nội');
    this.addContactButton = this.modal.getByRole('button', { name: /thêm người liên hệ/i });
    this.contactNameInput = page.getByPlaceholder('Họ tên đầy đủ');
    this.contactPhoneInput = page.getByPlaceholder('0912 345 678').first();
    this.contactEmailInput = page.getByPlaceholder('email@company.com');
    this.personalFullNameInput = page.getByPlaceholder('Họ tên đầy đủ');
    this.personalPhoneInput = page.getByPlaceholder('Số điện thoại');
    this.personalEmailInput = page.getByPlaceholder('email@example.com');
    this.personalIdInput = page.getByPlaceholder('12 chữ số');
    this.personalAddressInput = page.getByPlaceholder('Địa chỉ thường trú');
    this.modalCancelButton = this.modal.getByRole('button', { name: 'Hủy', exact: true });
    this.modalSaveButton = this.modal.getByRole('button', { name: 'Lưu', exact: true });
    this.modalSaveAndContinueButton = this.modal.getByRole('button', { name: 'Lưu & tạo tiếp', exact: true });
    this.modalUpdateButton = this.modal.getByRole('button', { name: 'Cập nhật', exact: true });
    this.contactRequiredError = page.getByText('Cần nhập ít nhất một người liên hệ.');
    this.requiredFieldsError = page.getByText('Vui lòng kiểm tra trường bắt buộc.');
    this.createSuccessToast = page.getByText('Đã lưu khách hàng mới.');
    this.updateSuccessToast = page.getByText('Đã cập nhật khách hàng.');

    // Nút & ô nhập Kiểm tra trùng (Check trùng)
    this.checkCompanyMstButton = this.modal.getByRole('button', { name: /check trùng mst/i }).first();
    this.checkInvoiceMstButton = this.modal.getByRole('button', { name: /check trùng mst/i }).last();
    this.checkPersonalPhoneButton = this.modal.getByRole('button', { name: /check trùng sđt/i }).first();
    this.invoiceTaxCodeInput = page.getByPlaceholder('Mã số thuế xuất hóa đơn');
    this.duplicateFoundToast = page.getByText(/tìm thấy khách hàng trùng/i);
    this.noDuplicateToast = page.getByText('Không tìm thấy khách hàng trùng.');

    // Detail Panel
    this.detailPanel = page.locator('.detail-panel');
    this.detailCloseButton = this.detailPanel.locator('button.dp-close, button[aria-label="Đóng"]');
    this.detailCompanyName = this.detailPanel.locator('.dp-title .name, .name').first();
    this.detailInfoTab = this.detailPanel.locator('.dp-tab').filter({ hasText: 'THÔNG TIN' });
    this.detailHistoryTab = this.detailPanel.locator('.dp-tab').filter({ hasText: 'LỊCH SỬ GD' });
    this.detailChangeLogTab = this.detailPanel.locator('.dp-tab').filter({ hasText: 'LỊCH SỬ THAY ĐỔI' });

    // Modal Delete
    this.deleteModal = page.locator('.modal, [role="dialog"]').filter({ hasText: 'Xác nhận xóa khách hàng' });
    this.deleteModalTitle = page.getByText('Xác nhận xóa khách hàng');
    this.deleteCancelButton = this.deleteModal.getByRole('button', { name: 'Hủy', exact: true });
    this.deleteConfirmButton = this.deleteModal.getByRole('button', { name: 'Xác nhận xóa', exact: true });
    this.deleteSuccessToast = page.getByText(/Đã xóa/i);

    // Modal Đổi người phụ trách (Đổi sale)
    this.changeSaleModal = page.locator('.customer-doi-sale-modal');
    this.changeSaleModalTitle = this.changeSaleModal.locator('.modal-title');
    this.changeSaleModalCloseButton = this.changeSaleModal.locator('.modal-close');
    this.changeSaleModalInfo = this.changeSaleModal.locator('.modal-info');
    this.changeSaleSelectTrigger = this.changeSaleModal.locator('.select-search-trigger');
    this.changeSaleReasonInput = this.changeSaleModal.locator('textarea');
    this.changeSaleCancelButton = this.changeSaleModal.getByRole('button', { name: 'Hủy', exact: true });
    this.changeSaleConfirmButton = this.changeSaleModal.getByRole('button', { name: 'Xác nhận chuyển', exact: true });
    this.changeSaleSelectRequiredError = this.changeSaleModal.getByText('Vui lòng chọn người phụ trách mới.');
    this.changeSaleReasonRequiredError = this.changeSaleModal.getByText('Vui lòng nhập lý do chuyển người phụ trách.');
    this.changeSaleSuccessToast = page.getByText('Đã chuyển người phụ trách khách hàng.');
  }

  /**
   * Mở trang danh sách Khách hàng
   */
  async open(url = '/khach-hang'): Promise<void> {
    await this.navigateTo(url);
  }

  /**
   * Mở hộp thoại Thêm Khách hàng mới
   */
  async openCreateModal(): Promise<void> {
    Logger.info('Nhấn nút "Thêm" trên thanh công cụ');
    await this.addCustomerButton.click();
    await this.modalTitle.waitFor({ state: 'visible' });
  }

  /**
   * Đóng hộp thoại Thêm Khách hàng mới bằng nút Hủy
   */
  async closeCreateModal(): Promise<void> {
    Logger.info('Nhấn nút "Hủy" trong hộp thoại thêm khách hàng');
    await this.modalCancelButton.click();
  }

  /**
   * Chọn nhóm khách hàng Cá nhân trên form tạo mới
   */
  async selectPersonalCustomerType(): Promise<void> {
    Logger.info('Chọn nhóm khách hàng "Cá nhân"');
    await this.personalTypeButton.click();
    await this.personalFullNameInput.waitFor({ state: 'visible' });
  }

  /**
   * Chọn nhóm khách hàng Doanh nghiệp trên form tạo mới
   */
  async selectBusinessCustomerType(): Promise<void> {
    Logger.info('Chọn nhóm khách hàng "Doanh nghiệp"');
    await this.businessTypeButton.click();
    await this.companyNameInput.waitFor({ state: 'visible' });
  }

  /**
   * Điền thông tin tạo Khách hàng Cá nhân mới
   */
  async fillPersonalCustomerForm(data: {
    sale?: string;
    source?: string;
    fullName: string;
    phone: string;
    email?: string;
    idNumber?: string;
    address?: string;
  }): Promise<void> {
    Logger.info(`Điền thông tin khách hàng Cá nhân: ${data.fullName}`);
    const saleValue = data.sale || 'Admin User';
    const sourceValue = data.source || 'TTK';
    await this.saleSelect.selectOption({ label: saleValue });
    await this.sourceSelect.selectOption({ label: sourceValue });
    await this.personalFullNameInput.fill(data.fullName);
    await this.personalPhoneInput.fill(data.phone);
    if (data.email) await this.personalEmailInput.fill(data.email);
    if (data.idNumber) await this.personalIdInput.fill(data.idNumber);
    if (data.address) await this.personalAddressInput.fill(data.address);
  }

  /**
   * Nhấn nút Lưu & tạo tiếp
   */
  async submitCreateAndContinue(): Promise<void> {
    Logger.info('Nhấn nút "Lưu & tạo tiếp"');
    await this.modalSaveAndContinueButton.click();
  }

  /**
   * Nhấn nút Check trùng MST thông tin công ty
   */
  async clickCheckCompanyMst(): Promise<void> {
    Logger.info('Nhấn nút "Check trùng MST" thông tin công ty');
    await this.checkCompanyMstButton.click();
  }

  /**
   * Nhấn nút Check trùng MST thông tin xuất hóa đơn
   */
  async clickCheckInvoiceMst(): Promise<void> {
    Logger.info('Nhấn nút "Check trùng MST" thông tin xuất hóa đơn');
    await this.checkInvoiceMstButton.click();
  }

  /**
   * Nhấn nút Check trùng SĐT thông tin cá nhân
   */
  async clickCheckPersonalPhone(): Promise<void> {
    Logger.info('Nhấn nút "Check trùng SĐT" thông tin cá nhân');
    await this.checkPersonalPhoneButton.click();
  }

  /**
   * Điền thông tin tạo Khách hàng mới
   */
  async fillCustomerForm(data: {
    sale?: string;
    source?: string;
    companyName: string;
    taxCode: string;
    address?: string;
    contactName?: string;
    contactPhone?: string;
    contactEmail?: string;
  }): Promise<void> {
    Logger.info(`Điền thông tin khách hàng: ${data.companyName}`);
    const saleValue = data.sale || 'Admin User';
    const sourceValue = data.source || 'TTK';
    await this.saleSelect.selectOption({ label: saleValue });
    await this.sourceSelect.selectOption({ label: sourceValue });
    await this.companyNameInput.fill(data.companyName);
    await this.taxCodeInput.fill(data.taxCode);
    if (data.address) await this.addressInput.fill(data.address);

    if (data.contactName) {
      Logger.info(`Thêm người liên hệ: ${data.contactName}`);
      await this.addContactButton.click();
      await this.contactNameInput.fill(data.contactName);
      if (data.contactPhone) await this.contactPhoneInput.fill(data.contactPhone);
      if (data.contactEmail) await this.contactEmailInput.fill(data.contactEmail);
    }
  }

  /**
   * Nhấn nút Lưu tạo mới khách hàng
   */
  async submitCreateForm(): Promise<void> {
    Logger.info('Nhấn nút "Lưu"');
    await this.modalSaveButton.click();
  }

  /**
   * Mở ngăn Xem chi tiết khách hàng
   */
  async openDetail(rowIndex = 0): Promise<void> {
    Logger.info(`Nhấn nút "Xem chi tiết" tại dòng ${rowIndex + 1}`);
    const row = this.rows.nth(rowIndex);
    await row.locator('.px-view-button, button[aria-label="Xem chi tiết"]').click();
    await this.detailPanel.waitFor({ state: 'visible' });
  }

  /**
   * Đóng ngăn Xem chi tiết khách hàng
   */
  async closeDetail(): Promise<void> {
    Logger.info('Đóng ngăn chi tiết khách hàng');
    await this.detailCloseButton.click();
  }

  /**
   * Chọn checkbox của một dòng khách hàng trong bảng
   */
  async selectCustomerRow(rowIndex = 0): Promise<void> {
    Logger.info(`Chọn dòng khách hàng thứ ${rowIndex + 1}`);
    const rowCheckbox = this.rows.nth(rowIndex).locator('input[type="checkbox"]');
    if (!await rowCheckbox.isChecked()) {
      await rowCheckbox.click();
    }
  }

  /**
   * Mở hộp thoại Sửa khách hàng
   */
  async openEditModal(): Promise<void> {
    Logger.info('Nhấn nút "Sửa" trên thanh công cụ');
    await this.editCustomerButton.click();
    await this.modalTitle.waitFor({ state: 'visible' });
  }

  /**
   * Đóng hộp thoại Sửa khách hàng bằng nút Hủy
   */
  async closeEditModal(): Promise<void> {
    Logger.info('Nhấn nút "Hủy" trong hộp thoại sửa');
    await this.modalCancelButton.click();
  }

  /**
   * Nhấn nút Cập nhật sửa khách hàng
   */
  async submitEditForm(): Promise<void> {
    Logger.info('Nhấn nút "Cập nhật"');
    await this.modal.getByRole('button', { name: /Cập nhật|Lưu/i }).first().click();
  }

  /**
   * Mở hộp thoại Xác nhận xóa khách hàng
   */
  async openDeleteDialog(): Promise<void> {
    Logger.info('Nhấn nút "Xóa" trên thanh công cụ');
    await this.deleteCustomerButton.click();
    await this.deleteModalTitle.waitFor({ state: 'visible' });
  }

  /**
   * Hủy thao tác xóa trong hộp thoại
   */
  async cancelDelete(): Promise<void> {
    Logger.info('Nhấn nút "Hủy" trong hộp thoại xác nhận xóa');
    await this.deleteCancelButton.click();
  }

  /**
   * Xác nhận xóa khách hàng
   */
  async confirmDelete(): Promise<void> {
    Logger.info('Nhấn nút "Xác nhận xóa"');
    await this.deleteConfirmButton.click();
  }

  /**
   * Tìm kiếm khách hàng theo từ khóa
   */
  async search(keyword: string): Promise<void> {
    Logger.info(`Nhập từ khóa tìm kiếm: "${keyword}"`);
    await this.searchInput.fill(keyword);
    await this.page.waitForTimeout(600);
  }

  /**
   * Xóa từ khóa tìm kiếm
   */
  async clearSearch(): Promise<void> {
    Logger.info('Xóa từ khóa tìm kiếm');
    await this.searchInput.fill('');
    await this.page.waitForTimeout(600);
  }

  /**
   * Lọc theo Nhóm khách hàng (Tổng KH, Cá nhân, Doanh nghiệp)
   */
  async filterByCustomerGroup(groupName: string): Promise<void> {
    Logger.info(`Lọc theo Nhóm khách hàng: "${groupName}"`);
    await this.customerGroupFilterButton.click();
    await this.page.locator('[role="option"]').filter({ hasText: groupName }).first().click();
    await this.page.waitForTimeout(600);
  }

  /**
   * Lọc theo Trạng thái (Tất cả, Đã hợp tác, Chưa hợp tác, Đợi Sale, Dừng hợp tác)
   */
  async filterByStatus(statusName: string): Promise<void> {
    Logger.info(`Lọc theo Trạng thái: "${statusName}"`);
    await this.statusFilterButton.click();
    await this.page.locator('[role="option"]').filter({ hasText: statusName }).first().click();
    await this.page.waitForTimeout(600);
  }

  /**
   * Chọn lọc ngày liên hệ Từ "Hôm nay"
   */
  async filterDateFromToday(): Promise<void> {
    Logger.info('Mở lịch và chọn ngày liên hệ Từ "Hôm nay"');
    await this.dateFromTrigger.click();
    await this.page.getByRole('button', { name: 'Hôm nay' }).click();
    await this.page.waitForTimeout(600);
  }

  /**
   * Xóa bộ lọc ngày liên hệ
   */
  async clearDateFilter(): Promise<void> {
    Logger.info('Xóa bộ lọc ngày liên hệ');
    await this.dateFromTrigger.click();
    await this.page.locator('.date-calendar__foot-btn').filter({ hasText: 'Xóa' }).click();
    await this.page.waitForTimeout(600);
  }

  /**
   * Mở hộp thoại Đổi người phụ trách khách hàng
   */
  async openChangeSaleModal(): Promise<void> {
    Logger.info('Nhấn nút "Đổi sale" trên thanh công cụ');
    await this.changeSaleButton.click();
    await this.changeSaleModalTitle.waitFor({ state: 'visible' });
  }

  /**
   * Đóng hộp thoại Đổi người phụ trách bằng nút Hủy
   */
  async closeChangeSaleModal(): Promise<void> {
    Logger.info('Nhấn nút "Hủy" trên hộp thoại Đổi người phụ trách');
    await this.changeSaleCancelButton.click();
  }

  /**
   * Đóng hộp thoại Đổi người phụ trách bằng nút Đóng [×]
   */
  async closeChangeSaleModalByIcon(): Promise<void> {
    Logger.info('Nhấn nút "Đóng" [×] trên hộp thoại Đổi người phụ trách');
    await this.changeSaleModalCloseButton.click();
  }

  /**
   * Chọn người phụ trách mới từ danh sách tìm kiếm
   */
  async selectNewSale(saleName: string): Promise<void> {
    Logger.info(`Chọn người phụ trách mới: "${saleName}"`);
    await this.changeSaleSelectTrigger.click();
    await this.page.waitForTimeout(300);
    // Find the option in the opened menu (skip options with "Người phụ trách hiện tại" if any)
    const option = this.page.locator('.select-search-option, .select-search-menu > div, .select-search-item').filter({ hasText: saleName }).first();
    await option.click();
    await this.page.waitForTimeout(300);
  }

  /**
   * Nhập lý do chuyển người phụ trách
   */
  async fillChangeSaleReason(reason: string): Promise<void> {
    Logger.info(`Nhập lý do chuyển: "${reason}"`);
    await this.changeSaleReasonInput.fill(reason);
  }

  /**
   * Nhấn nút Xác nhận chuyển
   */
  async submitChangeSale(): Promise<void> {
    Logger.info('Nhấn nút "Xác nhận chuyển"');
    await this.changeSaleConfirmButton.click();
  }
}

