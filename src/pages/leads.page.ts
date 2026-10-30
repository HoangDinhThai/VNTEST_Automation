import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { Logger } from '../utils/logger';

/**
 * LeadsPage: Đại diện cho màn hình Quản lý Lead / Cơ hội của hệ thống VNTEST LIMS
 * Tuân thủ quy chuẩn: Locators semantic ở đầu class, method mô tả hành vi người dùng, KHÔNG chứa assertion.
 */
export class LeadsPage extends BasePage {
  // Thanh công cụ & Bộ lọc
  readonly pageTab: Locator;
  readonly addLeadButton: Locator;
  readonly searchInput: Locator;
  readonly clearSearchButton: Locator;
  readonly filterAllChip: Locator;
  readonly filterNewChip: Locator;
  readonly filterNotContactedChip: Locator;
  readonly filterContactedChip: Locator;
  readonly filterClosedChip: Locator;
  readonly filterFailedChip: Locator;
  readonly priorityFilterButton: Locator;
  readonly priorityMenu: Locator;

  // Danh sách Thẻ Lead
  readonly leadCards: Locator;
  readonly firstLeadCard: Locator;
  readonly paginationInfo: Locator;
  readonly nextPageButton: Locator;
  readonly prevPageButton: Locator;

  // Khung chi tiết Lead (Panel bên phải)
  readonly detailPanel: Locator;
  readonly detailLeadCode: Locator;
  readonly detailCustomerName: Locator;
  readonly detailCompany: Locator;
  readonly detailContacts: Locator;
  readonly detailDegreeChip: Locator;
  readonly detailStatusChip: Locator;
  readonly statusStepper: Locator;
  readonly detailSource: Locator;
  readonly detailAssignee: Locator;
  readonly detailReceivedDate: Locator;
  readonly detailEstimatedValue: Locator;
  readonly detailServices: Locator;
  readonly detailSpecificDemand: Locator;
  readonly detailFooterBanner: Locator;
  readonly emptyState: Locator;
  readonly editLeadButton: Locator;
  readonly recordNoteButton: Locator;
  readonly createQuoteButton: Locator;

  // Lịch sử trao đổi (Timeline & Giao việc)
  readonly timelineSection: Locator;
  readonly timelineHeader: Locator;
  readonly timelineItems: Locator;
  readonly timelineFirstItem: Locator;
  readonly timelineFirstAssignItem: Locator;
  readonly timelineAssigneeText: Locator;

  // Hộp thoại Thêm mới Lead (Modal)
  readonly modal: Locator;
  readonly modalTitle: Locator;
  readonly sourceSelect: Locator;
  readonly customerNameInput: Locator;
  readonly phoneInput: Locator;
  readonly companyInput: Locator;
  readonly emailInput: Locator;
  readonly taxCodeInput: Locator;
  readonly addressInput: Locator;
  readonly estimatedValueInput: Locator;
  readonly noteTextarea: Locator;
  readonly serviceFoodCheckbox: Locator;
  readonly serviceWaterCheckbox: Locator;
  readonly serviceTextileCheckbox: Locator;
  readonly serviceChemicalCheckbox: Locator;
  readonly modalCancelButton: Locator;
  readonly modalSaveButton: Locator;

  // Thông báo lỗi & Toast thành công
  readonly customerNameError: Locator;
  readonly phoneError: Locator;
  readonly serviceError: Locator;
  readonly successToast: Locator;

  // Hộp thoại Ghi nhận lịch sử trao đổi
  readonly noteDialog: Locator;
  readonly noteDialogTitle: Locator;
  readonly noteChannelSelect: Locator;
  readonly noteDateTimeInput: Locator;
  readonly noteContentTextarea: Locator;
  readonly noteCancelButton: Locator;
  readonly noteSaveButton: Locator;
  readonly noteContentError: Locator;
  readonly noteSuccessToast: Locator;

  // Hộp thoại Phân công người phụ trách
  readonly assignButton: Locator;
  readonly assignDialog: Locator;
  readonly assignDialogTitle: Locator;
  readonly assignDialogCloseButton: Locator;
  readonly assignSelectTrigger: Locator;
  readonly assignSearchInput: Locator;
  readonly assignOptionsMenu: Locator;
  readonly assignCancelButton: Locator;
  readonly assignConfirmButton: Locator;
  readonly assignSuccessToast: Locator;

  constructor(page: Page) {
    super(page);

    // Toolbar & Filters
    this.pageTab = page.locator('button.tab, .tab').filter({ hasText: /lead \/ cơ hội/i });
    this.addLeadButton = page.getByRole('button', { name: 'Thêm lead' });
    this.searchInput = page.getByPlaceholder(/tên, công ty, mã lead/i);
    this.clearSearchButton = page.locator('.clear-btn');
    this.filterAllChip = page.locator('.lead-chip').filter({ hasText: 'Tất cả' });
    this.filterNewChip = page.locator('.lead-chip').filter({ hasText: 'Mới' });
    this.filterNotContactedChip = page.locator('.lead-chip').filter({ hasText: 'Chưa LH' });
    this.filterContactedChip = page.locator('.lead-chip').filter({ hasText: 'Đã LH' });
    this.filterClosedChip = page.locator('.lead-chip').filter({ hasText: 'Đã chốt' });
    this.filterFailedChip = page.locator('.lead-chip').filter({ hasText: 'Thất bại' });
    this.priorityFilterButton = page.locator('.popover__trigger.dd');
    this.priorityMenu = page.locator('.popover__menu, .dropdown-menu, [role="menu"]');

    // Lead Cards & Pagination
    this.leadCards = page.locator('.lead-card');
    this.firstLeadCard = page.locator('.lead-card').first();
    this.paginationInfo = page.getByText(/Hiện \d+–\d+ \/ \d+ lead/);
    this.nextPageButton = page.locator('button[aria-label="Trang sau."], button[aria-label="Trang sau"]');
    this.prevPageButton = page.locator('button[aria-label="Trang trước."], button[aria-label="Trang trước"]');

    // Detail Panel
    this.detailPanel = page.locator('aside.lead-detail-panel');
    this.detailLeadCode = page.locator('aside.lead-detail-panel .lead-detail-header__code, aside.lead-detail-panel [class*="code"]').first();
    this.detailCustomerName = page.locator('aside.lead-detail-panel .lead-detail-header__name');
    this.detailCompany = page.locator('aside.lead-detail-panel .lead-detail-header__company');
    this.detailContacts = page.locator('aside.lead-detail-panel .lead-detail-header__contacts');
    this.detailDegreeChip = page.locator('aside.lead-detail-panel [class*="badge"], aside.lead-detail-panel [class*="degree"]').first();
    this.detailStatusChip = page.locator('aside.lead-detail-panel [class*="status"], aside.lead-detail-panel [class*="chip"]').first();
    this.statusStepper = page.locator('aside.lead-detail-panel [class*="stepper"], aside.lead-detail-panel .step-wizard, aside.lead-detail-panel nav');
    this.detailSource = page.locator('aside.lead-detail-panel .lead-detail-attr-item, aside.lead-detail-panel .ml-info').filter({ hasText: 'NGUỒN LEAD' });
    this.detailAssignee = page.locator('aside.lead-detail-panel .lead-detail-attr-item, aside.lead-detail-panel .ml-info').filter({ hasText: 'NGƯỜI PHỤ TRÁCH' });
    this.detailReceivedDate = page.locator('aside.lead-detail-panel .lead-detail-attr-item, aside.lead-detail-panel .ml-info').filter({ hasText: 'NGÀY TIẾP NHẬN' });
    this.detailEstimatedValue = page.locator('aside.lead-detail-panel .lead-detail-attr-item, aside.lead-detail-panel .ml-info').filter({ hasText: 'GIÁ TRỊ ƯỚC TÍNH' });
    this.detailServices = page.locator('aside.lead-detail-panel .lead-detail-attr-item, aside.lead-detail-panel .ml-info').filter({ hasText: 'DỊCH VỤ QUAN TÂM' });
    this.detailSpecificDemand = page.locator('aside.lead-detail-panel [class*="demand"], aside.lead-detail-panel .ml-sec').filter({ hasText: 'NHU CẦU CỤ THỂ' });
    this.detailFooterBanner = page.locator('aside.lead-detail-panel').getByText(/đã chốt thành khách hàng/i);
    this.emptyState = page.getByText(/không tìm thấy|không có dữ liệu|danh sách trống/i);
    this.editLeadButton = page.getByRole('button', { name: 'Chỉnh sửa' });
    this.recordNoteButton = page.getByRole('button', { name: 'Ghi nhận' });
    this.createQuoteButton = page.getByRole('button', { name: 'Tạo báo giá' });

    // Timeline Lịch sử trao đổi
    this.timelineSection = page.locator('aside.lead-detail-panel .lead-timeline-section');
    this.timelineHeader = page.locator('aside.lead-detail-panel .lead-timeline-section__header');
    this.timelineItems = page.locator('aside.lead-detail-panel .lead-timeline-item');
    this.timelineFirstItem = page.locator('aside.lead-detail-panel .lead-timeline-item').first();
    this.timelineFirstAssignItem = page.locator('aside.lead-detail-panel .lead-timeline-item--assign').first();
    this.timelineAssigneeText = page.getByText(/Chuyển người phụ trách từ/i).first();

    // Modal Create Lead
    this.modal = page.locator('.modal, [role="dialog"], div[class*="modal"]');
    this.modalTitle = this.modal.getByText('Thêm mới Lead');
    this.sourceSelect = this.modal.locator('select').nth(1);
    this.customerNameInput = page.getByPlaceholder('Nhập họ tên hoặc tên tổ chức');
    this.phoneInput = page.getByPlaceholder('Nhập số điện thoại');
    this.companyInput = page.getByPlaceholder('Nhập tên đơn vị công tác');
    this.emailInput = page.getByPlaceholder('Ví dụ: abc@gmail.com');
    this.taxCodeInput = page.getByPlaceholder('Nhập mã số thuế');
    this.addressInput = page.getByPlaceholder('Nhập địa chỉ liên hệ');
    this.estimatedValueInput = page.getByPlaceholder('Nhập giá trị hợp đồng');
    this.noteTextarea = page.getByPlaceholder('Nhập nhu cầu cụ thể của khách hàng');
    this.serviceFoodCheckbox = this.modal.getByText('KN Thực phẩm', { exact: true });
    this.serviceWaterCheckbox = this.modal.getByText('KN Nước', { exact: true });
    this.serviceTextileCheckbox = this.modal.getByText('KN Dệt may', { exact: true });
    this.serviceChemicalCheckbox = this.modal.getByText('KN Hóa chất', { exact: true });
    this.modalCancelButton = this.modal.getByRole('button', { name: 'Hủy', exact: true });
    this.modalSaveButton = this.modal.getByRole('button', { name: 'Lưu', exact: true });

    // Validation & Notifications
    this.customerNameError = page.getByText('Vui lòng nhập tên khách hàng.');
    this.phoneError = page.getByText('Vui lòng nhập số điện thoại.');
    this.serviceError = page.getByText('Vui lòng chọn ít nhất một dịch vụ quan tâm.');
    this.successToast = page.getByText('Tạo khách hàng tiềm năng thành công.');

    // Modal Ghi nhận lịch sử trao đổi
    this.noteDialog = page.locator('.modal, [role="dialog"], div[class*="modal"]').filter({ hasText: 'Ghi nhận lịch sử trao đổi' });
    this.noteDialogTitle = page.getByText('Ghi nhận lịch sử trao đổi');
    this.noteChannelSelect = this.noteDialog.locator('select');
    this.noteDateTimeInput = this.noteDialog.locator('input[type="datetime-local"]');
    this.noteContentTextarea = page.getByPlaceholder('Nhập nội dung tư vấn, trao đổi...');
    this.noteCancelButton = this.noteDialog.getByRole('button', { name: 'Hủy', exact: true });
    this.noteSaveButton = this.noteDialog.getByRole('button', { name: 'Lưu', exact: true });
    this.noteContentError = page.getByText('Vui lòng nhập nội dung trao đổi.');
    this.noteSuccessToast = page.getByText('Ghi nhận lịch sử liên hệ thành công.');

    // Modal Phân công người phụ trách
    this.assignButton = page.getByRole('button', { name: 'Phân công' });
    this.assignDialog = page.locator('.modal.lead-assign-dialog');
    this.assignDialogTitle = page.locator('.lead-assign-dialog .modal-title');
    this.assignDialogCloseButton = page.locator('.lead-assign-dialog .modal-close');
    this.assignSelectTrigger = page.locator('#lead-assignee .select-search-trigger');
    this.assignSearchInput = page.locator('.select-search-menu input, #lead-assignee input');
    this.assignOptionsMenu = page.locator('.select-search-menu');
    this.assignCancelButton = this.assignDialog.getByRole('button', { name: 'Hủy', exact: true });
    this.assignConfirmButton = this.assignDialog.getByRole('button', { name: 'Xác nhận', exact: true });
    this.assignSuccessToast = page.getByText('Cập nhật người phụ trách thành công.');
  }

  /**
   * Mở trang danh sách Lead
   */
  async open(url = '/leads'): Promise<void> {
    await this.navigateTo(url);
  }

  /**
   * Nhập từ khóa tìm kiếm
   */
  async search(keyword: string): Promise<void> {
    Logger.info(`Tìm kiếm từ khóa: ${keyword}`);
    await this.searchInput.fill(keyword);
  }

  /**
   * Xóa từ khóa tìm kiếm bằng nút Hủy
   */
  async clearSearch(): Promise<void> {
    Logger.info('Nhấn nút "Hủy" trên thanh tìm kiếm');
    await this.clearSearchButton.click();
  }

  /**
   * Lọc theo mức độ nhiệt của Lead (Nóng / Ấm / Lạnh / Tất cả)
   */
  async filterByDegree(degree: 'Tất cả' | 'Nóng' | 'Ấm' | 'Lạnh'): Promise<void> {
    Logger.info(`Lọc theo mức độ: ${degree}`);
    await this.priorityFilterButton.click();
    await this.priorityMenu.getByText(degree, { exact: true }).click();
  }

  /**
   * Mở hộp thoại Chỉnh sửa Lead
   */
  async openEditModal(): Promise<void> {
    Logger.info('Nhấn nút "Chỉnh sửa"');
    await this.editLeadButton.click();
    await this.modal.waitFor({ state: 'visible' });
  }

  /**
   * Mở hộp thoại Thêm mới Lead
   */
  async openCreateModal(): Promise<void> {
    Logger.info('Nhấn nút "Thêm lead"');
    await this.addLeadButton.click();
    await this.modalTitle.waitFor({ state: 'visible' });
  }

  /**
   * Đóng hộp thoại Thêm mới Lead bằng nút Hủy
   */
  async closeCreateModal(): Promise<void> {
    Logger.info('Nhấn nút "Hủy" trong hộp thoại thêm mới');
    await this.modalCancelButton.click();
  }

  /**
   * Lưu form thêm mới Lead
   */
  async submitCreateForm(): Promise<void> {
    Logger.info('Nhấn nút "Lưu"');
    await this.modalSaveButton.click();
  }

  /**
   * Điền thông tin tạo Lead mới
   */
  async fillLeadForm(data: {
    customerName: string;
    phone: string;
    company?: string;
    email?: string;
    address?: string;
    estimatedValue?: string;
    source?: string;
    demand?: string;
  }): Promise<void> {
    Logger.info(`Điền thông tin Lead: ${data.customerName} - ${data.phone}`);
    await this.customerNameInput.fill(data.customerName);
    await this.phoneInput.fill(data.phone);
    if (data.company) await this.companyInput.fill(data.company);
    if (data.email) await this.emailInput.fill(data.email);
    if (data.address) await this.addressInput.fill(data.address);
    if (data.estimatedValue) await this.estimatedValueInput.fill(data.estimatedValue);
    if (data.source) await this.sourceSelect.selectOption({ label: data.source });
    if (data.demand) await this.noteTextarea.fill(data.demand);

    // Chọn dịch vụ quan tâm
    await this.serviceFoodCheckbox.click();
    await this.serviceChemicalCheckbox.click();
  }

  /**
   * Mở hộp thoại Ghi nhận lịch sử trao đổi
   */
  async openRecordNoteDialog(): Promise<void> {
    Logger.info('Nhấn nút "Ghi nhận"');
    await this.recordNoteButton.click();
    await this.noteDialogTitle.waitFor({ state: 'visible' });
  }

  /**
   * Đóng hộp thoại Ghi nhận lịch sử trao đổi bằng nút Hủy
   */
  async closeRecordNoteDialog(): Promise<void> {
    Logger.info('Nhấn nút "Hủy" trong hộp thoại ghi nhận');
    await this.noteCancelButton.click();
  }

  /**
   * Điền và lưu nội dung ghi nhận lịch sử trao đổi
   */
  async submitRecordNote(content?: string, channel?: string): Promise<void> {
    if (channel) {
      Logger.info(`Chọn kênh liên hệ: ${channel}`);
      await this.noteChannelSelect.selectOption({ label: channel });
    }
    if (content !== undefined) {
      Logger.info(`Nhập nội dung trao đổi: ${content}`);
      await this.noteContentTextarea.fill(content);
    }
    Logger.info('Nhấn nút "Lưu" trên hộp thoại ghi nhận');
    await this.noteSaveButton.click();
  }

  /**
   * Mở hộp thoại Phân công người phụ trách
   */
  async openAssignDialog(): Promise<void> {
    Logger.info('Nhấn nút "Phân công" trên thanh công cụ');
    await this.assignButton.click();
    await this.assignDialogTitle.waitFor({ state: 'visible' });
  }

  /**
   * Đóng hộp thoại Phân công bằng nút Hủy hoặc nút Đóng
   */
  async closeAssignDialog(): Promise<void> {
    Logger.info('Đóng hộp thoại phân công');
    if (await this.assignOptionsMenu.isVisible()) {
      await this.assignDialogCloseButton.click();
    } else {
      await this.assignCancelButton.click();
    }
  }

  /**
   * Tìm kiếm nhân viên trong danh sách phân công
   */
  async searchAssignee(keyword: string): Promise<void> {
    Logger.info(`Mở danh sách và tìm kiếm nhân viên: ${keyword}`);
    await this.assignSelectTrigger.click();
    await this.assignSearchInput.fill(keyword);
  }

  /**
   * Chọn nhân viên và xác nhận phân công
   */
  async selectAssigneeAndConfirm(staffName: string): Promise<void> {
    Logger.info(`Chọn nhân viên: ${staffName}`);
    await this.assignSelectTrigger.click();
    await this.assignOptionsMenu.getByText(staffName, { exact: false }).first().click();
    Logger.info('Nhấn nút "Xác nhận" phân công');
    await this.assignConfirmButton.click();
  }
}
