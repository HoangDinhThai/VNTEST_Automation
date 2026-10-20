import { test, expect } from '../../fixtures/base.fixture';
import { Logger } from '../../utils/logger';
import users from '../../../test-data/users.json';

test.describe('Module Quản lý Công thức tính (/quan-ly-cong-thuc-tinh) - Hệ thống VNTEST LIMS', () => {
  test.beforeEach(async ({ loginPage, formulaPage, page }) => {
    Logger.step('Setup', 'Đăng nhập vào hệ thống và điều hướng tới trang Quản lý công thức tính');
    await loginPage.open('/dang-nhap');
    await loginPage.login(users.validUser.username, users.validUser.password);
    await page.waitForURL('https://vntest-lims.pirago.work/', { timeout: 15000 });

    await formulaPage.open();
    await expect(formulaPage.formulaTab).toBeVisible({ timeout: 15000 });
  });

  // ==========================================
  // KHỐI 01: BỐ CỤC & HIỂN THỊ MÀN HÌNH
  // ==========================================
  test('TC_FORMULA_001: Hiển thị đầy đủ tab Header, các chip trạng thái và thanh công cụ', {
    tag: ['@normal', '@minor']
  }, async ({ formulaPage }) => {
    Logger.step(1, 'Kiểm tra tab Header QLY CT TÍNH');
    await expect(formulaPage.formulaTab).toBeVisible();
    await expect(formulaPage.formulaTab).toHaveClass(/active/);

    Logger.step(2, 'Kiểm tra 4 chip lọc trạng thái');
    await expect(formulaPage.statusAllTab).toBeVisible();
    await expect(formulaPage.statusPendingTab).toBeVisible();
    await expect(formulaPage.statusApprovedTab).toBeVisible();
    await expect(formulaPage.statusSuspendedTab).toBeVisible();

    Logger.step(3, 'Kiểm tra thanh công cụ');
    await expect(formulaPage.addButton).toBeVisible();
    await expect(formulaPage.deleteButton).toBeVisible();
    await expect(formulaPage.pauseButton).toBeVisible();
    await expect(formulaPage.approveButton).toBeVisible();
    await expect(formulaPage.cancelButton).toBeVisible();
  });

  test('TC_FORMULA_002: Hiển thị bảng danh sách công thức tính với các cột tiêu đề chuẩn', {
    tag: ['@normal', '@minor']
  }, async ({ formulaPage }) => {
    Logger.step('Verify 1', 'Bảng danh sách công thức tính hiển thị');
    await expect(formulaPage.table).toBeVisible();

    Logger.step('Verify 2', 'Bảng chứa ít nhất một dòng dữ liệu');
    await expect(formulaPage.firstRow).toBeVisible();

    Logger.step('Verify 3', 'Nút Quản lý cột hiển thị ở chân bảng');
    await expect(formulaPage.columnManageButton).toBeVisible();
  });

  test('TC_FORMULA_003: Trạng thái ban đầu của các nút thao tác khi chưa chọn dòng công thức', {
    tag: ['@normal', '@minor']
  }, async ({ formulaPage }) => {
    Logger.step('Verify 1', 'Nút "Thêm" ở trạng thái kích hoạt (enabled)');
    await expect(formulaPage.addButton).toBeEnabled();

    Logger.step('Verify 2', 'Các nút "Xóa", "Tạm dừng", "Duyệt" bị vô hiệu hóa (disabled)');
    await expect(formulaPage.deleteButton).toBeDisabled();
    await expect(formulaPage.pauseButton).toBeDisabled();
    await expect(formulaPage.approveButton).toBeDisabled();
  });

  // ==========================================
  // KHỐI 02: TƯƠNG TÁC LỌC TRẠNG THÁI & CHỌN DÒNG
  // ==========================================
  test('TC_FORMULA_004: Lọc danh sách công thức theo chip trạng thái "Chờ duyệt"', {
    tag: ['@normal', '@major']
  }, async ({ formulaPage }) => {
    Logger.step(1, 'Nhấn chip "Chờ duyệt"');
    await formulaPage.statusPendingTab.click();

    Logger.step('Verify', 'Chip "Chờ duyệt" ở trạng thái kích hoạt');
    await expect(formulaPage.statusPendingTab).toHaveClass(/active/);
    await expect(formulaPage.table).toBeVisible();
  });

  test('TC_FORMULA_005: Lọc danh sách công thức theo chip trạng thái "Đã duyệt"', {
    tag: ['@normal', '@major']
  }, async ({ formulaPage }) => {
    Logger.step(1, 'Nhấn chip "Đã duyệt"');
    await formulaPage.statusApprovedTab.click();

    Logger.step('Verify', 'Chip "Đã duyệt" ở trạng thái kích hoạt');
    await expect(formulaPage.statusApprovedTab).toHaveClass(/active/);
    await expect(formulaPage.table).toBeVisible();
  });

  test('TC_FORMULA_006: Lọc danh sách công thức theo chip "Tạm dừng" và quay lại "Tất cả"', {
    tag: ['@normal', '@minor']
  }, async ({ formulaPage }) => {
    Logger.step(1, 'Nhấn chip "Tạm dừng"');
    await formulaPage.statusSuspendedTab.click();
    await expect(formulaPage.statusSuspendedTab).toHaveClass(/active/);

    Logger.step(2, 'Nhấn chọn lại chip "Tất cả"');
    await formulaPage.statusAllTab.click();
    await expect(formulaPage.statusAllTab).toHaveClass(/active/);
  });

  test('TC_FORMULA_007: Chọn một dòng công thức để xem chi tiết bên khung phải', {
    tag: ['@high', '@major']
  }, async ({ formulaPage }) => {
    Logger.step(1, 'Bấm chọn dòng công thức đầu tiên');
    await formulaPage.selectFormulaRow(0);

    Logger.step('Verify', 'Khung chi tiết bên phải hiển thị nội dung công thức đã chọn');
    await expect(formulaPage.formContainer).toBeVisible();
  });

  // ==========================================
  // KHỐI 03: GIAO DIỆN & CẤU TRÚC FORM THÊM MỚI CÔNG THỨC
  // ==========================================
  test('TC_FORMULA_008: Mở form Thêm công thức tính và kiểm tra hiển thị đầy đủ 3 phần cấu hình', {
    tag: ['@high', '@major']
  }, async ({ formulaPage }) => {
    Logger.step(1, 'Nhấn nút "Thêm" trên thanh công cụ');
    await formulaPage.openAddFormulaForm();

    Logger.step('Verify 1', 'Tiêu đề form hiển thị "Thêm mới công thức tính"');
    await expect(formulaPage.formTitle).toContainText('Thêm mới công thức tính');

    Logger.step('Verify 2', 'Phần 1: Thông tin chung hiển thị đầy đủ các trường');
    await expect(formulaPage.nameInput).toBeVisible();
    await expect(formulaPage.analysisGroupSelect).toBeVisible();
    await expect(formulaPage.resultUnitInput).toBeVisible();
    await expect(formulaPage.testMethodInput).toBeVisible();
    await expect(formulaPage.noteTextarea).toBeVisible();

    Logger.step('Verify 3', 'Phần 2: Cấu hình biến số hiển thị');
    await expect(formulaPage.unifiedEditor).toBeVisible();
    await expect(formulaPage.addVariableButton).toBeVisible();
    await expect(formulaPage.addExpressionButton).toBeVisible();

    Logger.step('Verify 4', 'Phần 3: Giải thích nguyên tắc tính toán và nút Lưu');
    await expect(formulaPage.calculationPrincipleTextarea).toBeVisible();
    await expect(formulaPage.saveButton).toBeVisible();
  });

  test('TC_FORMULA_009: Kiểm tra cấu hình mặc định ban đầu của khối Cấu hình biến số', {
    tag: ['@normal', '@minor']
  }, async ({ formulaPage }) => {
    Logger.step(1, 'Mở form Thêm công thức tính');
    await formulaPage.openAddFormulaForm();

    Logger.step('Verify', 'Form có sẵn 2 dòng mặc định: 1 Biến số và 1 Công thức tính');
    await expect(formulaPage.unifiedRows).toHaveCount(2);

    // Dòng 1 là Biến 1
    const row1 = formulaPage.unifiedRows.nth(0);
    await expect(row1).toContainText('Biến 1');

    // Dòng 2 là Công thức tính 2
    const row2 = formulaPage.unifiedRows.nth(1);
    await expect(row2).toContainText('Công thức tính 2');
  });

  test('TC_FORMULA_010: Thêm mới một dòng Biến số bằng nút "+ Thêm biến"', {
    tag: ['@normal', '@major']
  }, async ({ formulaPage }) => {
    Logger.step(1, 'Mở form Thêm công thức');
    await formulaPage.openAddFormulaForm();
    await expect(formulaPage.unifiedRows).toHaveCount(2);

    Logger.step(2, 'Nhấn nút "+ Thêm biến"');
    await formulaPage.clickAddVariable();

    Logger.step('Verify', 'Số lượng dòng cấu hình tăng lên 3');
    await expect(formulaPage.unifiedRows).toHaveCount(3);
  });

  test('TC_FORMULA_011: Thêm mới một dòng Công thức bằng nút "+ Thêm công thức"', {
    tag: ['@normal', '@major']
  }, async ({ formulaPage }) => {
    Logger.step(1, 'Mở form Thêm công thức');
    await formulaPage.openAddFormulaForm();
    await expect(formulaPage.unifiedRows).toHaveCount(2);

    Logger.step(2, 'Nhấn nút "+ Thêm công thức"');
    await formulaPage.clickAddExpression();

    Logger.step('Verify', 'Số lượng dòng cấu hình tăng lên 3');
    await expect(formulaPage.unifiedRows).toHaveCount(3);
  });

  test('TC_FORMULA_012: Xóa một dòng cấu hình biến số bằng nút "×"', {
    tag: ['@normal', '@major']
  }, async ({ formulaPage }) => {
    Logger.step(1, 'Mở form Thêm công thức và thêm 1 biến');
    await formulaPage.openAddFormulaForm();
    await formulaPage.clickAddVariable();
    await expect(formulaPage.unifiedRows).toHaveCount(3);

    Logger.step(2, 'Xóa dòng biến thứ 3');
    await formulaPage.removeRow(2);

    Logger.step('Verify', 'Số lượng dòng giảm trở lại 2');
    await expect(formulaPage.unifiedRows).toHaveCount(2);
  });

  // ==========================================
  // KHỐI 04: VALIDATION DỮ LIỆU & RÀNG BUỘC
  // ==========================================
  test('TC_FORMULA_013: Nút "Lưu công thức" bị vô hiệu hóa khi để trống các trường bắt buộc', {
    tag: ['@high', '@major']
  }, async ({ formulaPage }) => {
    Logger.step(1, 'Mở form Thêm công thức');
    await formulaPage.openAddFormulaForm();

    Logger.step('Verify', 'Nút "Lưu công thức" ở trạng thái vô hiệu hóa (disabled)');
    await expect(formulaPage.saveButton).toBeDisabled();
  });

  // ==========================================
  // KHỐI 05: LUỒNG TẠO MỚI CÔNG THỨC THÀNH CÔNG (HAPPY PATH)
  // ==========================================
  test('TC_FORMULA_014: Thêm mới công thức tính toán thành công với biến số và biểu thức tính', {
    tag: ['@high', '@critical']
  }, async ({ formulaPage, page }) => {
    const timestamp = Date.now();
    const formulaName = `CT Thử Nghiệm Tự Động ${timestamp}`;

    Logger.step(1, 'Mở form Thêm công thức tính');
    await formulaPage.openAddFormulaForm();

    Logger.step(2, 'Nhập Thông tin chung');
    await formulaPage.fillGeneralInfo({
      name: formulaName,
      group: 'HCB',
      resultUnit: 'mg/kg',
      method: 'TCVN 1234:2026',
      note: 'Công thức kiểm thử tự động hệ thống'
    });

    Logger.step(3, 'Cấu hình Biến số đầu vào (m1)');
    await formulaPage.configureVariableRow(0, {
      code: 'm1',
      desc: 'Khối lượng mẫu cân',
      unit: 'g',
      defaultValue: '10'
    });

    Logger.step(4, 'Cấu hình Biểu thức tính toán (X = m1 * 2.5)');
    await formulaPage.configureExpressionRow(1, {
      code: 'X',
      desc: 'Hàm lượng tính toán',
      unit: 'mg/kg',
      expression: 'm1 * 2.5',
      isReportResult: true
    });

    Logger.step(5, 'Nhập giải thích nguyên tắc tính toán');
    await formulaPage.fillCalculationPrinciple('Hàm lượng tính bằng khối lượng mẫu nhân hệ số pha loãng.');

    Logger.step('Verify 1', 'Nút "Lưu công thức" chuyển sang trạng thái kích hoạt (enabled)');
    await expect(formulaPage.saveButton).toBeEnabled();

    Logger.step(6, 'Nhấn nút "Lưu công thức" và kiểm tra phản hồi API');
    const [response] = await Promise.all([
      page.waitForResponse(res => res.url().includes('formula') && res.request().method() === 'POST'),
      formulaPage.submitFormula()
    ]);

    Logger.step('Verify 2', 'API tạo công thức tính trả về mã 201 Created thành công');
    expect(response.status()).toBe(201);
  });
});

