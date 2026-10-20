import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { Logger } from '../utils/logger';

/**
 * SingleCriteriaPage: Đại diện cho màn hình Quản lý Chỉ tiêu lẻ (/chi-tieu-le)
 * Thiết kế giao diện 2 khung (Master-Detail / analyte-split):
 * - Khung bên trái (Left Pane): Quản lý Nền mẫu (Thêm, Sửa, Xóa nền mẫu)
 * - Khung bên phải (Right Pane): Quản lý Chỉ tiêu lẻ thuộc nền mẫu đã chọn (Thêm, Sửa, Xóa chỉ tiêu)
 * Tuân thủ quy chuẩn POM: Locators semantic ở đầu class, method mô tả hành vi người dùng, KHÔNG chứa assertion.
 */
export class SingleCriteriaPage extends BasePage {
  // Tab chính ở Header
  readonly singleCriteriaTab: Locator;
  readonly packageCriteriaTab: Locator;

  // ==========================================
  // KHUNG BÊN TRÁI: QUẢN LÝ NỀN MẪU
  // ==========================================
  readonly leftPane: Locator;
  readonly matrixToolbar: Locator;
  readonly addMatrixButton: Locator;
  readonly editMatrixButton: Locator;
  readonly deleteMatrixButton: Locator;

  // Bảng Nền mẫu
  readonly matrixTable: Locator;
  readonly matrixRows: Locator;
  readonly firstMatrixRow: Locator;
  readonly firstMatrixCheckbox: Locator;
  readonly firstMatrixNameCell: Locator;
  readonly matrixSelectAllCheckbox: Locator;

  // Hộp thoại Thêm Nền mẫu
  readonly createMatrixModal: Locator;
  readonly createMatrixModalTitle: Locator;
  readonly createMatrixCloseButton: Locator;
  readonly createMatrixNameInput: Locator;
  readonly createMatrixCancelButton: Locator;
  readonly createMatrixSaveButton: Locator;
  readonly createMatrixNameRequiredError: Locator;

  // Hộp thoại Sửa Nền mẫu
  readonly editMatrixModal: Locator;
  readonly editMatrixModalTitle: Locator;
  readonly editMatrixCloseButton: Locator;
  readonly editMatrixNameInput: Locator;
  readonly editMatrixCancelButton: Locator;
  readonly editMatrixSaveButton: Locator;

  // Hộp thoại Xác nhận Xóa Nền mẫu
  readonly deleteMatrixModal: Locator;
  readonly deleteMatrixModalTitle: Locator;
  readonly deleteMatrixCloseButton: Locator;
  readonly deleteMatrixInfo: Locator;
  readonly deleteMatrixCancelButton: Locator;
  readonly deleteMatrixConfirmButton: Locator;

  // ==========================================
  // KHUNG BÊN PHẢI: QUẢN LÝ CHỈ TIÊU LẺ
  // ==========================================
  readonly rightPane: Locator;
  readonly criteriaToolbar: Locator;
  readonly criteriaSearchInput: Locator;
  readonly criteriaSearchClearButton: Locator;
  readonly analysisGroupFilterDropdown: Locator;
  readonly addCriteriaButton: Locator;
  readonly editCriteriaButton: Locator;
  readonly changeAnalystButton: Locator;
  readonly deleteCriteriaButton: Locator;

  // Bảng Chỉ tiêu lẻ
  readonly criteriaTable: Locator;
  readonly criteriaRows: Locator;
  readonly firstCriteriaRow: Locator;
  readonly firstCriteriaCheckbox: Locator;
  readonly criteriaSelectAllCheckbox: Locator;

  // Hộp thoại Thêm mới & Chỉnh sửa Chỉ tiêu (Chung cấu trúc Form)
  readonly criteriaModal: Locator;
  readonly createCriteriaModalTitle: Locator;
  readonly editCriteriaModalTitle: Locator;
  readonly criteriaModalCloseButton: Locator;

  // Form Fields - Thông tin chỉ tiêu
  readonly criteriaCodeInput: Locator;
  readonly matrixReadOnlyInput: Locator;
  readonly criteriaNameInput: Locator;
  readonly analysisGroupSelect: Locator;
  readonly analystSelectTrigger: Locator;
  readonly subcontractCheckbox: Locator;
  readonly noteTextarea: Locator;

  // Form Fields - Giá và thời gian kiểm
  readonly floorPriceInput: Locator;
  readonly salePriceInput: Locator;
  readonly turnaroundTimeInput: Locator;

  // Form Fields - Phương pháp thử
  readonly testingMethodInput: Locator;
  readonly resultUnitInput: Locator;

  // Form Fields - LOD / LOQ và chứng nhận
  readonly lodInput: Locator;
  readonly loqInput: Locator;
  readonly vilasCheckbox: Locator;
  readonly vilasLodInput: Locator;
  readonly vilasLoqInput: Locator;
  readonly assignedCheckbox: Locator;
  readonly assignedLodInput: Locator;
  readonly assignedLoqInput: Locator;
  readonly vimcertCheckbox: Locator;
  readonly vimcertLodInput: Locator;
  readonly vimcertLoqInput: Locator;

  // Form Action Buttons
  readonly criteriaModalCancelButton: Locator;
  readonly createCriteriaSubmitButton: Locator;
  readonly editCriteriaSubmitButton: Locator;

  // Form Validation Errors
  readonly criteriaCodeRequiredError: Locator;
  readonly criteriaNameRequiredError: Locator;
  readonly analysisGroupRequiredError: Locator;
  readonly floorPriceRequiredError: Locator;
  readonly salePriceRequiredError: Locator;
  readonly turnaroundTimeRequiredError: Locator;
  readonly testingMethodRequiredError: Locator;

  // Hộp thoại Xác nhận Xóa Chỉ tiêu
  readonly deleteCriteriaModal: Locator;
  readonly deleteCriteriaModalTitle: Locator;
  readonly deleteCriteriaCloseButton: Locator;
  readonly deleteCriteriaInfo: Locator;
  readonly deleteCriteriaCancelButton: Locator;
  readonly deleteCriteriaConfirmButton: Locator;

  constructor(page: Page) {
    super(page);

    // Tab Header
    this.singleCriteriaTab = page.locator('button.tab').filter({ hasText: /^Chỉ tiêu lẻ/i }).first();
    this.packageCriteriaTab = page.locator('button.tab').filter({ hasText: /^Gói chỉ tiêu/i }).first();

    // ==========================================
    // KHUNG BÊN TRÁI: QUẢN LÝ NỀN MẪU
    // ==========================================
    this.leftPane = page.locator('.analyte-pane--left');
    this.matrixToolbar = this.leftPane.locator('.analyte-toolbar');
    this.addMatrixButton = this.matrixToolbar.getByRole('button', { name: /^Thêm$/i });
    this.editMatrixButton = this.matrixToolbar.getByRole('button', { name: /^Sửa$/i });
    this.deleteMatrixButton = this.matrixToolbar.getByRole('button', { name: /^Xóa$/i });

    // Bảng Nền mẫu
    this.matrixTable = this.leftPane.locator('.sample-matrix-table table.px-tbl');
    this.matrixRows = this.matrixTable.locator('tbody tr');
    this.firstMatrixRow = this.matrixRows.first();
    this.firstMatrixCheckbox = this.firstMatrixRow.locator('input.cb');
    this.firstMatrixNameCell = this.firstMatrixRow.locator('td.sample-matrix-name-cell');
    this.matrixSelectAllCheckbox = this.matrixTable.locator('thead th.col-checkbox input.cb');

    // Hộp thoại Thêm Nền mẫu
    this.createMatrixModal = page.locator('.modal.sample-matrix-create-dialog');
    this.createMatrixModalTitle = page.locator('#sample-matrix-create-title');
    this.createMatrixCloseButton = this.createMatrixModal.locator('button.modal-close');
    this.createMatrixNameInput = page.locator('#sample-matrix-name');
    this.createMatrixCancelButton = this.createMatrixModal.locator('.modal-foot').getByRole('button', { name: /^Hủy$/i });
    this.createMatrixSaveButton = this.createMatrixModal.locator('.modal-foot').getByRole('button', { name: /^Lưu$/i });
    this.createMatrixNameRequiredError = this.createMatrixModal.locator('.form-field-error');

    // Hộp thoại Sửa Nền mẫu
    this.editMatrixModal = page.locator('.modal.sample-matrix-edit-dialog');
    this.editMatrixModalTitle = page.locator('#sample-matrix-edit-title');
    this.editMatrixCloseButton = this.editMatrixModal.locator('button.modal-close');
    this.editMatrixNameInput = page.locator('#sample-matrix-edit-name');
    this.editMatrixCancelButton = this.editMatrixModal.locator('.modal-foot').getByRole('button', { name: /^Hủy$/i });
    this.editMatrixSaveButton = this.editMatrixModal.locator('.modal-foot').getByRole('button', { name: /^Lưu$/i });

    // Hộp thoại Xóa Nền mẫu
    this.deleteMatrixModal = page.locator('.modal.sample-matrix-delete-dialog');
    this.deleteMatrixModalTitle = this.deleteMatrixModal.locator('.modal-title');
    this.deleteMatrixCloseButton = this.deleteMatrixModal.locator('button.modal-close');
    this.deleteMatrixInfo = this.deleteMatrixModal.locator('.modal-info');
    this.deleteMatrixCancelButton = this.deleteMatrixModal.locator('.modal-foot').getByRole('button', { name: /^Hủy$/i });
    this.deleteMatrixConfirmButton = this.deleteMatrixModal.locator('.modal-foot').getByRole('button', { name: /^Xóa/i });

    // ==========================================
    // KHUNG BÊN PHẢI: QUẢN LÝ CHỈ TIÊU LẺ
    // ==========================================
    this.rightPane = page.locator('.analyte-pane--right');
    this.criteriaToolbar = this.rightPane.locator('.analyte-toolbar');
    this.criteriaSearchInput = this.criteriaToolbar.locator('input[type="text"]');
    this.criteriaSearchClearButton = this.criteriaToolbar.locator('button.clear-btn');
    this.analysisGroupFilterDropdown = this.criteriaToolbar.locator('button.popover__trigger').filter({ hasText: /Nhóm PT/i }).first();
    this.addCriteriaButton = this.criteriaToolbar.getByRole('button', { name: /^Thêm CT$/i });
    this.editCriteriaButton = this.criteriaToolbar.getByRole('button', { name: /^Sửa CT$/i });
    this.changeAnalystButton = this.criteriaToolbar.getByRole('button', { name: /^Đổi KNV phụ trách$/i });
    this.deleteCriteriaButton = this.criteriaToolbar.getByRole('button', { name: /^Xóa CT$/i });

    // Bảng Chỉ tiêu lẻ
    this.criteriaTable = this.rightPane.locator('.analyte-table table.px-tbl');
    this.criteriaRows = this.criteriaTable.locator('tbody tr');
    this.firstCriteriaRow = this.criteriaRows.first();
    this.firstCriteriaCheckbox = this.firstCriteriaRow.locator('input.cb');
    this.criteriaSelectAllCheckbox = this.criteriaTable.locator('thead th.col-checkbox input.cb');

    // Hộp thoại Thêm mới & Sửa Chỉ tiêu
    this.criteriaModal = page.locator('.modal.analyte-create-modal');
    this.createCriteriaModalTitle = page.locator('#analyte-create-title');
    this.editCriteriaModalTitle = page.locator('#analyte-edit-title');
    this.criteriaModalCloseButton = this.criteriaModal.locator('button.modal-close');

    // Form fields
    this.criteriaCodeInput = this.criteriaModal.locator('input.analyte-create-input-code');
    this.matrixReadOnlyInput = this.criteriaModal.locator('input.is-readonly');
    this.criteriaNameInput = this.criteriaModal.locator('input[placeholder*="Ví dụ: Pb"]');
    this.analysisGroupSelect = this.criteriaModal.locator('select.form-control').first();
    this.analystSelectTrigger = this.criteriaModal.locator('.select-search-trigger');
    this.subcontractCheckbox = this.criteriaModal.locator('label.analyte-create-check input.cb').first();
    this.noteTextarea = this.criteriaModal.locator('textarea.analyte-create-textarea');

    // Giá và thời gian kiểm
    this.floorPriceInput = this.criteriaModal.locator('input.analyte-create-price-control[placeholder="0"]').nth(0);
    this.salePriceInput = this.criteriaModal.locator('input.analyte-create-price-control[placeholder="0"]').nth(1);
    this.turnaroundTimeInput = this.criteriaModal.locator('input.analyte-create-price-control[placeholder="5"]');

    // Phương pháp thử
    this.testingMethodInput = this.criteriaModal.locator('input[placeholder*="TCVN"]');
    this.resultUnitInput = this.criteriaModal.locator('input[placeholder*="mg/kg"]');

    // LOD / LOQ & Chứng nhận
    this.lodInput = this.criteriaModal.locator('.analyte-create-grid-3 input[type="number"]').nth(0);
    this.loqInput = this.criteriaModal.locator('.analyte-create-grid-3 input[type="number"]').nth(1);
    this.vilasCheckbox = this.criteriaModal.locator('.analyte-create-cert-grid').locator('.analyte-create-check input.cb').nth(0);
    this.vilasLodInput = this.criteriaModal.locator('.analyte-create-cert-grid input[type="number"]').nth(0);
    this.vilasLoqInput = this.criteriaModal.locator('.analyte-create-cert-grid input[type="number"]').nth(1);
    this.assignedCheckbox = this.criteriaModal.locator('.analyte-create-cert-grid').locator('.analyte-create-check input.cb').nth(1);
    this.assignedLodInput = this.criteriaModal.locator('.analyte-create-cert-grid input[type="number"]').nth(2);
    this.assignedLoqInput = this.criteriaModal.locator('.analyte-create-cert-grid input[type="number"]').nth(3);
    this.vimcertCheckbox = this.criteriaModal.locator('.analyte-create-cert-grid').locator('.analyte-create-check input.cb').nth(2);
    this.vimcertLodInput = this.criteriaModal.locator('.analyte-create-cert-grid input[type="number"]').nth(4);
    this.vimcertLoqInput = this.criteriaModal.locator('.analyte-create-cert-grid input[type="number"]').nth(5);

    // Form Action buttons
    this.criteriaModalCancelButton = this.criteriaModal.locator('.modal-foot').getByRole('button', { name: /^Hủy$/i });
    this.createCriteriaSubmitButton = this.criteriaModal.locator('.modal-foot').getByRole('button', { name: /^Lưu chỉ tiêu$/i });
    this.editCriteriaSubmitButton = this.criteriaModal.locator('.modal-foot').getByRole('button', { name: /^Lưu thay đổi$/i });

    // Form Validation errors
    this.criteriaCodeRequiredError = this.criteriaModal.locator('.analyte-create-error').filter({ hasText: /mã chỉ tiêu/i });
    this.criteriaNameRequiredError = this.criteriaModal.locator('.analyte-create-error').filter({ hasText: /tên chỉ tiêu/i });
    this.analysisGroupRequiredError = this.criteriaModal.locator('.analyte-create-error').filter({ hasText: /nhóm phân tích/i });
    this.floorPriceRequiredError = this.criteriaModal.locator('.analyte-create-error').filter({ hasText: /giá sàn/i });
    this.salePriceRequiredError = this.criteriaModal.locator('.analyte-create-error').filter({ hasText: /giá bán/i });
    this.turnaroundTimeRequiredError = this.criteriaModal.locator('.analyte-create-error').filter({ hasText: /thời gian kiểm/i });
    this.testingMethodRequiredError = this.criteriaModal.locator('.analyte-create-error').filter({ hasText: /phương pháp/i });

    // Hộp thoại Xóa Chỉ tiêu
    this.deleteCriteriaModal = page.locator('.modal.analyte-delete-dialog');
    this.deleteCriteriaModalTitle = this.deleteCriteriaModal.locator('.modal-title');
    this.deleteCriteriaCloseButton = this.deleteCriteriaModal.locator('button.modal-close');
    this.deleteCriteriaInfo = this.deleteCriteriaModal.locator('.modal-info');
    this.deleteCriteriaCancelButton = this.deleteCriteriaModal.locator('.modal-foot').getByRole('button', { name: /^Hủy$/i });
    this.deleteCriteriaConfirmButton = this.deleteCriteriaModal.locator('.modal-foot').getByRole('button', { name: /^Xóa/i });
  }

  // ==========================================
  // HÀNH ĐỘNG ĐIỀU HƯỚNG
  // ==========================================
  async open(): Promise<void> {
    await this.navigateTo('/chi-tieu-le');
  }

  // ==========================================
  // HÀNH ĐỘNG NỀN MẪU (LEFT PANE)
  // ==========================================
  async openCreateMatrixModal(): Promise<void> {
    Logger.info('Nhấn nút "Thêm" nền mẫu');
    await this.addMatrixButton.click();
  }

  async closeCreateMatrixModal(): Promise<void> {
    Logger.info('Đóng hộp thoại thêm nền mẫu bằng nút "Hủy"');
    await this.createMatrixCancelButton.click();
  }

  async enterMatrixName(name: string): Promise<void> {
    Logger.info(`Nhập tên nền mẫu: ${name}`);
    await this.createMatrixNameInput.fill(name);
  }

  async submitCreateMatrix(): Promise<void> {
    Logger.info('Nhấn nút "Lưu" thêm mới nền mẫu');
    await this.createMatrixSaveButton.click();
  }

  async createSampleMatrix(name: string): Promise<void> {
    await this.openCreateMatrixModal();
    await this.enterMatrixName(name);
    await this.submitCreateMatrix();
  }

  async selectMatrixCheckbox(matrixName: string): Promise<void> {
    Logger.info(`Tích chọn checkbox nền mẫu: ${matrixName}`);
    const row = this.matrixRows.filter({ hasText: matrixName }).first();
    await row.locator('input.cb').check();
  }

  async clickMatrixRow(matrixName: string): Promise<void> {
    Logger.info(`Bấm vào dòng nền mẫu "${matrixName}" để tải danh sách chỉ tiêu`);
    const row = this.matrixRows.filter({ hasText: matrixName }).first();
    await row.locator('td.sample-matrix-name-cell').click();
  }

  async openEditMatrixModal(): Promise<void> {
    Logger.info('Nhấn nút "Sửa" nền mẫu');
    await this.editMatrixButton.click();
  }

  async editMatrixName(newName: string): Promise<void> {
    Logger.info(`Sửa tên nền mẫu thành: ${newName}`);
    await this.editMatrixNameInput.fill(newName);
  }

  async submitEditMatrix(): Promise<void> {
    Logger.info('Nhấn nút "Lưu" cập nhật nền mẫu');
    await this.editMatrixSaveButton.click();
  }

  async openDeleteMatrixModal(): Promise<void> {
    Logger.info('Nhấn nút "Xóa" nền mẫu');
    await this.deleteMatrixButton.click();
  }

  async cancelDeleteMatrix(): Promise<void> {
    Logger.info('Nhấn nút "Hủy" trong hộp thoại xóa nền mẫu');
    await this.deleteMatrixCancelButton.click();
  }

  async confirmDeleteMatrix(): Promise<void> {
    Logger.info('Nhấn nút "Xóa" xác nhận xóa nền mẫu');
    await this.deleteMatrixConfirmButton.click();
  }

  // ==========================================
  // HÀNH ĐỘNG CHỈ TIÊU LẺ (RIGHT PANE)
  // ==========================================
  async openCreateCriteriaModal(): Promise<void> {
    Logger.info('Nhấn nút "Thêm CT"');
    await this.addCriteriaButton.click();
  }

  async closeCreateCriteriaModal(): Promise<void> {
    Logger.info('Đóng hộp thoại thêm chỉ tiêu bằng nút "Hủy"');
    await this.criteriaModalCancelButton.click();
  }

  async fillCriteriaForm(data: {
    code: string;
    name: string;
    group: string;
    floorPrice: string;
    salePrice: string;
    turnaroundDays: string;
    method: string;
    unit?: string;
    note?: string;
  }): Promise<void> {
    Logger.info(`Điền thông tin chỉ tiêu: Mã=${data.code}, Tên=${data.name}, Nhóm=${data.group}`);
    await this.criteriaCodeInput.fill(data.code);
    await this.criteriaNameInput.fill(data.name);
    await this.analysisGroupSelect.selectOption(data.group);
    await this.floorPriceInput.fill(data.floorPrice);
    await this.salePriceInput.fill(data.salePrice);
    await this.turnaroundTimeInput.fill(data.turnaroundDays);
    await this.testingMethodInput.fill(data.method);

    if (data.unit) {
      await this.resultUnitInput.fill(data.unit);
    }
    if (data.note) {
      await this.noteTextarea.fill(data.note);
    }
  }

  async submitCreateCriteria(): Promise<void> {
    Logger.info('Nhấn nút "Lưu chỉ tiêu"');
    await this.createCriteriaSubmitButton.click();
  }

  async selectCriteriaCheckbox(codeOrName: string): Promise<void> {
    Logger.info(`Tích chọn checkbox chỉ tiêu: ${codeOrName}`);
    const row = this.criteriaRows.filter({ hasText: codeOrName }).first();
    await row.locator('input.cb').check();
  }

  async openEditCriteriaModal(): Promise<void> {
    Logger.info('Nhấn nút "Sửa CT"');
    await this.editCriteriaButton.click();
  }

  async submitEditCriteria(): Promise<void> {
    Logger.info('Nhấn nút "Lưu thay đổi" cập nhật chỉ tiêu');
    await this.editCriteriaSubmitButton.click();
  }

  async openDeleteCriteriaModal(): Promise<void> {
    Logger.info('Nhấn nút "Xóa CT"');
    await this.deleteCriteriaButton.click();
  }

  async cancelDeleteCriteria(): Promise<void> {
    Logger.info('Nhấn nút "Hủy" trong hộp thoại xóa chỉ tiêu');
    await this.deleteCriteriaCancelButton.click();
  }

  async confirmDeleteCriteria(): Promise<void> {
    Logger.info('Nhấn nút "Xóa" xác nhận xóa chỉ tiêu');
    await this.deleteCriteriaConfirmButton.click();
  }

  async searchCriteria(query: string): Promise<void> {
    Logger.info(`Tìm kiếm chỉ tiêu: "${query}"`);
    await this.criteriaSearchInput.fill(query);
  }

  async clearCriteriaSearch(): Promise<void> {
    Logger.info('Xóa ô tìm kiếm bằng nút "Hủy"');
    await this.criteriaSearchClearButton.click();
  }
}
