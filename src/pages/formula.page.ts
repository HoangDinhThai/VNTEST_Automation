import { type Locator, type Page } from '@playwright/test';
import { BasePage } from './base.page';
import { Logger } from '../utils/logger';

/**
 * Page Object Model cho Module Quản lý Công thức tính (/quan-ly-cong-thuc-tinh)
 * Hệ thống VNTEST LIMS
 */
export class FormulaPage extends BasePage {
  // Navigation & Tabs
  readonly formulaTab: Locator;
  readonly statusAllTab: Locator;
  readonly statusPendingTab: Locator;
  readonly statusApprovedTab: Locator;
  readonly statusSuspendedTab: Locator;

  // Thanh công cụ chính (Toolbar)
  readonly addButton: Locator;
  readonly deleteButton: Locator;
  readonly pauseButton: Locator;
  readonly approveButton: Locator;
  readonly cancelButton: Locator;
  readonly searchInput: Locator;

  // Bảng dữ liệu công thức tính
  readonly table: Locator;
  readonly tableHeader: Locator;
  readonly rows: Locator;
  readonly firstRow: Locator;
  readonly firstRowNameCell: Locator;
  readonly columnManageButton: Locator;

  // Form Thêm / Chỉnh sửa công thức (Inline Detail Panel)
  readonly formContainer: Locator;
  readonly formTitle: Locator;
  readonly nameInput: Locator;
  readonly analysisGroupSelect: Locator;
  readonly resultUnitInput: Locator;
  readonly testMethodInput: Locator;
  readonly noteTextarea: Locator;

  // Phần Cấu hình biến số
  readonly unifiedEditor: Locator;
  readonly unifiedRows: Locator;
  readonly addVariableButton: Locator;
  readonly addExpressionButton: Locator;

  // Phần Giải thích nguyên tắc tính toán & Hành động
  readonly calculationPrincipleTextarea: Locator;
  readonly saveButton: Locator;

  constructor(page: Page) {
    super(page);

    // Navigation & Tabs
    this.formulaTab = page.locator('button.tab, .tab').filter({ hasText: /qly ct tính/i }).first();
    this.statusAllTab = page.locator('button, .tab').filter({ hasText: /tất cả/i }).first();
    this.statusPendingTab = page.locator('button, .tab').filter({ hasText: /chờ duyệt/i }).first();
    this.statusApprovedTab = page.locator('button, .tab').filter({ hasText: /đã duyệt/i }).first();
    this.statusSuspendedTab = page.locator('button, .tab').filter({ hasText: /tạm dừng/i }).first();

    // Toolbar
    this.addButton = page.getByRole('button', { name: /^Thêm$/i }).first();
    this.deleteButton = page.getByRole('button', { name: /^Xóa$/i }).first();
    this.pauseButton = page.getByRole('button', { name: /^Tạm dừng$/i }).first();
    this.approveButton = page.getByRole('button', { name: /^Duyệt$/i }).first();
    this.cancelButton = page.getByRole('button', { name: /^Hủy$/i }).first();
    this.searchInput = page.locator('input[type="search"], input[placeholder*="Tìm" i]').first();

    // Bảng công thức
    this.table = page.locator('table.px-tbl, table').first();
    this.tableHeader = page.locator('table thead, .tbl-head').first();
    this.rows = page.locator('table tbody tr');
    this.firstRow = this.rows.first();
    this.firstRowNameCell = this.firstRow.locator('td').nth(1);
    this.columnManageButton = page.getByRole('button', { name: /quản lý cột/i }).first();

    // Form thêm/sửa công thức
    this.formContainer = page.locator('.formula-detail-content, .formula-inline-form').first();
    this.formTitle = page.locator('.formula-detail-header .modal-title').first();
    this.nameInput = page.locator('#formula-inline-name');
    this.analysisGroupSelect = page.locator('#formula-inline-analysis-group');
    this.resultUnitInput = page.locator('#formula-inline-result-unit');
    this.testMethodInput = page.locator('#formula-inline-test-method');
    this.noteTextarea = page.locator('#formula-inline-note');

    // Phần cấu hình biến số
    this.unifiedEditor = page.locator('.formula-unified-editor').first();
    this.unifiedRows = page.locator('.formula-unified-row');
    this.addVariableButton = page.locator('button.formula-add-row').filter({ hasText: /thêm biến/i }).first();
    this.addExpressionButton = page.locator('button.formula-add-row').filter({ hasText: /thêm công thức/i }).first();

    // Nguyên tắc tính & Lưu
    this.calculationPrincipleTextarea = page.locator('#formula-inline-calculation-principle');
    this.saveButton = page.locator('button:has-text("Lưu công thức")').first();
  }

  /**
   * Điều hướng trực tiếp tới trang Quản lý công thức tính
   */
  async open(): Promise<void> {
    Logger.info('Điều hướng tới trang Quản lý công thức tính: /quan-ly-cong-thuc-tinh');
    await this.page.goto('/quan-ly-cong-thuc-tinh');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Mở form thêm mới công thức tính bằng nút "Thêm"
   */
  async openAddFormulaForm(): Promise<void> {
    Logger.info('Nhấn nút "Thêm" trên thanh công cụ để mở form cấu hình công thức');
    await this.addButton.click();
    await this.page.waitForTimeout(500);
  }

  /**
   * Nhập thông tin Phần 1: Thông tin chung
   */
  async fillGeneralInfo(data: {
    name: string;
    group: string;
    resultUnit: string;
    method?: string;
    note?: string;
  }): Promise<void> {
    Logger.info(`Nhập thông tin chung công thức: ${data.name}`);
    await this.nameInput.fill(data.name);
    await this.analysisGroupSelect.selectOption(data.group);
    await this.resultUnitInput.fill(data.resultUnit);

    if (data.method) {
      await this.testMethodInput.fill(data.method);
    }
    if (data.note) {
      await this.noteTextarea.fill(data.note);
    }
  }

  /**
   * Cấu hình Biến số đầu vào tại một dòng rowIndex (0-based)
   */
  async configureVariableRow(
    rowIndex: number,
    data: {
      code: string;
      desc?: string;
      unit?: string;
      defaultValue?: string;
    }
  ): Promise<void> {
    Logger.info(`Cấu hình biến số tại dòng ${rowIndex + 1}: mã = ${data.code}`);
    const row = this.unifiedRows.nth(rowIndex);

    // Điền mã biến (ID)
    const codeInput = row.locator('.formula-unified-code-field input');
    await codeInput.fill(data.code);

    if (data.desc) {
      const descInput = row.locator('.formula-unified-description-field input');
      await descInput.fill(data.desc);
    }

    if (data.unit) {
      const unitInput = row.locator('.formula-unified-unit-field input');
      await unitInput.fill(data.unit);
    }

    if (data.defaultValue) {
      const defaultInput = row.locator('.formula-unified-default-value-field input');
      await defaultInput.fill(data.defaultValue);
    }
  }

  /**
   * Cấu hình Biểu thức tính toán tại một dòng rowIndex (0-based)
   */
  async configureExpressionRow(
    rowIndex: number,
    data: {
      code: string;
      desc?: string;
      unit?: string;
      expression: string;
      isReportResult?: boolean;
    }
  ): Promise<void> {
    Logger.info(`Cấu hình biểu thức tính tại dòng ${rowIndex + 1}: mã = ${data.code}, biểu thức = ${data.expression}`);
    const row = this.unifiedRows.nth(rowIndex);

    // Điền mã công thức (ID)
    const codeInput = row.locator('.formula-unified-code-field input');
    await codeInput.fill(data.code);

    if (data.desc) {
      const descInput = row.locator('.formula-unified-description-field input');
      await descInput.fill(data.desc);
    }

    if (data.unit) {
      const unitInput = row.locator('.formula-unified-unit-field input');
      await unitInput.fill(data.unit);
    }

    // Nhập biểu thức toán học
    const exprInput = row.locator('.formula-expression-input');
    await exprInput.fill(data.expression);

    // Radio xuất phiếu kết quả nếu chỉ định
    if (data.isReportResult) {
      const reportRadio = row.locator('input[name="formula-result-report"]');
      await reportRadio.check();
    }
  }

  /**
   * Thêm một biến số mới vào danh sách
   */
  async clickAddVariable(): Promise<void> {
    Logger.info('Nhấn nút "+ Thêm biến"');
    await this.addVariableButton.click();
    await this.page.waitForTimeout(300);
  }

  /**
   * Thêm một công thức/biểu thức mới vào danh sách
   */
  async clickAddExpression(): Promise<void> {
    Logger.info('Nhấn nút "+ Thêm công thức"');
    await this.addExpressionButton.click();
    await this.page.waitForTimeout(300);
  }

  /**
   * Xóa một dòng cấu hình biến/công thức theo rowIndex (0-based)
   */
  async removeRow(rowIndex: number): Promise<void> {
    Logger.info(`Xóa dòng biến/công thức thứ ${rowIndex + 1}`);
    const row = this.unifiedRows.nth(rowIndex);
    await row.locator('button.formula-remove').click();
    await this.page.waitForTimeout(300);
  }

  /**
   * Điền nguyên tắc tính toán
   */
  async fillCalculationPrinciple(text: string): Promise<void> {
    Logger.info('Nhập giải thích nguyên tắc tính toán');
    await this.calculationPrincipleTextarea.fill(text);
  }

  /**
   * Nhấn nút "Lưu công thức"
   */
  async submitFormula(): Promise<void> {
    Logger.info('Nhấn nút "Lưu công thức"');
    await this.saveButton.click();
    await this.page.waitForTimeout(1000);
  }

  /**
   * Chọn một dòng công thức tính trong bảng để xem chi tiết
   */
  async selectFormulaRow(index = 0): Promise<void> {
    Logger.info(`Chọn dòng công thức thứ ${index + 1} trong bảng`);
    await this.rows.nth(index).click();
    await this.page.waitForTimeout(500);
  }
}
