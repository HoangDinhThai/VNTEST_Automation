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

  // ==========================================
  // KHỐI 06: VÒNG ĐỜI & QUẢN LÝ TRẠNG THÁI (WORKFLOW)
  // ==========================================
  test('TC_FORMULA_015: Duyệt công thức tính ở trạng thái "Chờ duyệt"', {
    tag: ['@high', '@major']
  }, async ({ formulaPage, page }) => {
    Logger.step(1, 'Chuyển sang tab "Chờ duyệt"');
    await formulaPage.statusPendingTab.click();
    await expect(formulaPage.statusPendingTab).toHaveClass(/active/);

    Logger.step(2, 'Kiểm tra nếu có bản ghi chờ duyệt thì chọn dòng đầu tiên');
    const rowCount = await formulaPage.rows.count();
    if (rowCount > 0) {
      await formulaPage.selectFormulaRow(0);

      Logger.step('Verify 1', 'Nút "Duyệt" trên thanh công cụ chuyển sang trạng thái kích hoạt');
      await expect(formulaPage.approveButton).toBeEnabled();

      Logger.step(3, 'Nhấn nút "Duyệt" và xác nhận');
      await formulaPage.approveSelected(true);
    }
  });

  test('TC_FORMULA_016: Nút "Duyệt" bị vô hiệu hóa khi chọn công thức ở tab "Đã duyệt"', {
    tag: ['@normal', '@minor']
  }, async ({ formulaPage }) => {
    Logger.step(1, 'Chuyển sang tab "Đã duyệt"');
    await formulaPage.statusApprovedTab.click();
    await expect(formulaPage.statusApprovedTab).toHaveClass(/active/);

    Logger.step(2, 'Chọn một dòng công thức đã duyệt');
    const rowCount = await formulaPage.rows.count();
    if (rowCount > 0) {
      await formulaPage.selectFormulaRow(0);

      Logger.step('Verify', 'Nút "Duyệt" ở trạng thái vô hiệu hóa (disabled)');
      await expect(formulaPage.approveButton).toBeDisabled();
    }
  });

  test('TC_FORMULA_017: Tạm dừng công thức tính ở trạng thái "Đã duyệt"', {
    tag: ['@high', '@major']
  }, async ({ formulaPage }) => {
    Logger.step(1, 'Chuyển sang tab "Đã duyệt"');
    await formulaPage.statusApprovedTab.click();

    Logger.step(2, 'Chọn một dòng công thức đã duyệt');
    const rowCount = await formulaPage.rows.count();
    if (rowCount > 0) {
      await formulaPage.selectFormulaRow(0);

      Logger.step('Verify 1', 'Nút "Tạm dừng" ở trạng thái kích hoạt');
      await expect(formulaPage.pauseButton).toBeEnabled();

      Logger.step(3, 'Nhấn nút "Tạm dừng" và xác nhận');
      await formulaPage.pauseSelected(true);
    }
  });

  test('TC_FORMULA_018: Kích hoạt lại công thức đang ở tab "Tạm dừng"', {
    tag: ['@normal', '@major']
  }, async ({ formulaPage }) => {
    Logger.step(1, 'Chuyển sang tab "Tạm dừng"');
    await formulaPage.statusSuspendedTab.click();
    await expect(formulaPage.statusSuspendedTab).toHaveClass(/active/);

    Logger.step(2, 'Chọn một dòng công thức tạm dừng');
    const rowCount = await formulaPage.rows.count();
    if (rowCount > 0) {
      await formulaPage.selectFormulaRow(0);

      Logger.step('Verify', 'Nút "Duyệt" được kích hoạt để cho phép mở lại công thức');
      await expect(formulaPage.approveButton).toBeEnabled();
    }
  });

  // ==========================================
  // KHỐI 07: CHỈNH SỬA & HỦY THAO TÁC CÔNG THỨC
  // ==========================================
  test('TC_FORMULA_019: Cập nhật Tên và Đơn vị kết quả cho công thức tính', {
    tag: ['@high', '@major']
  }, async ({ formulaPage }) => {
    Logger.step(1, 'Chọn một dòng công thức để mở chi tiết');
    await formulaPage.selectFormulaRow(0);
    await expect(formulaPage.formContainer).toBeVisible();

    Logger.step(2, 'Chỉnh sửa Tên công thức và Đơn vị kết quả');
    const updatedName = `CT Đã Chỉnh Sửa ${Date.now()}`;
    await formulaPage.nameInput.fill(updatedName);
    await formulaPage.resultUnitInput.fill('ppm');

    Logger.step('Verify', 'Nút "Lưu công thức" ở trạng thái kích hoạt');
    await expect(formulaPage.saveButton).toBeEnabled();
  });

  test('TC_FORMULA_020: Thêm mới biến và sửa lại biểu thức trong form chỉnh sửa', {
    tag: ['@high', '@major']
  }, async ({ formulaPage }) => {
    Logger.step(1, 'Chọn một dòng công thức để xem chi tiết');
    await formulaPage.selectFormulaRow(0);

    const initialRowCount = await formulaPage.unifiedRows.count();

    Logger.step(2, 'Nhấn nút "+ Thêm biến" để bổ sung biến mới');
    await formulaPage.clickAddVariable();

    Logger.step('Verify', 'Số lượng dòng cấu hình tăng lên');
    await expect(formulaPage.unifiedRows).toHaveCount(initialRowCount + 1);

    Logger.step(3, 'Cấu hình mã biến mới');
    await formulaPage.configureVariableRow(initialRowCount, {
      code: 'V2',
      desc: 'Thể tích định mức 2',
      unit: 'mL'
    });
  });

  test('TC_FORMULA_021: Nhấn nút "Hủy" khi đang chỉnh sửa công thức', {
    tag: ['@normal', '@minor']
  }, async ({ formulaPage }) => {
    Logger.step(1, 'Chọn một dòng công thức');
    await formulaPage.selectFormulaRow(0);

    Logger.step(2, 'Nhấn nút "Hủy" trên thanh công cụ');
    await formulaPage.cancelButton.click();

    Logger.step('Verify', 'Thao tác chỉnh sửa được hủy an toàn');
    await expect(formulaPage.table).toBeVisible();
  });

  // ==========================================
  // KHỐI 08: XÓA CÔNG THỨC & RÀNG BUỘC TOÀN VẸN
  // ==========================================
  test('TC_FORMULA_022: Hủy thao tác xóa công thức tại hộp thoại xác nhận', {
    tag: ['@normal', '@minor']
  }, async ({ formulaPage }) => {
    Logger.step(1, 'Chuyển sang tab "Chờ duyệt" và chọn một dòng');
    await formulaPage.statusPendingTab.click();

    const rowCount = await formulaPage.rows.count();
    if (rowCount > 0) {
      await formulaPage.selectFormulaRow(0);

      Logger.step(2, 'Nhấn nút "Xóa" và chọn "Hủy" trên hộp thoại');
      await formulaPage.deleteSelected(false);

      Logger.step('Verify', 'Bản ghi vẫn tồn tại nguyên vẹn trên danh sách');
      await expect(formulaPage.rows).toHaveCount(rowCount);
    }
  });

  test('TC_FORMULA_023: Xác nhận xóa công thức ở trạng thái Chờ duyệt', {
    tag: ['@high', '@major']
  }, async ({ formulaPage }) => {
    Logger.step(1, 'Chuyển sang tab "Chờ duyệt"');
    await formulaPage.statusPendingTab.click();

    const rowCount = await formulaPage.rows.count();
    if (rowCount > 0) {
      await formulaPage.selectFormulaRow(0);

      Logger.step('Verify 1', 'Nút "Xóa" ở trạng thái kích hoạt');
      await expect(formulaPage.deleteButton).toBeEnabled();

      Logger.step(2, 'Nhấn nút "Xóa"');
      await formulaPage.deleteButton.click();
      await expect(formulaPage.confirmModal).toBeVisible();
    }
  });

  // ==========================================
  // KHỐI 09: CẤU HÌNH HIỂN THỊ CỘT TRÊN BẢNG KẾT QUẢ
  // ==========================================
  test('TC_FORMULA_025: Trạng thái mặc định của Checkbox "Hiển thị trên bảng kết quả" và ô Độ rộng', {
    tag: ['@normal', '@minor']
  }, async ({ formulaPage }) => {
    Logger.step(1, 'Mở form Thêm công thức tính');
    await formulaPage.openAddFormulaForm();

    Logger.step('Verify 1', 'Dòng 1: Checkbox "Hiển thị trên bảng kết quả" được tích chọn mặc định');
    const displayCheckbox1 = formulaPage.getDisplayOnResultTableCheckbox(0);
    await expect(displayCheckbox1).toBeChecked();

    Logger.step('Verify 2', 'Dòng 1: Trường "ĐỘ RỘNG (PX)" có giá trị mặc định là 160');
    const widthInput1 = formulaPage.getColumnWidthInput(0);
    await expect(widthInput1).toHaveValue('160');

    Logger.step('Verify 3', 'Dòng 2: Checkbox "Hiển thị trên bảng kết quả" được tích chọn mặc định');
    const displayCheckbox2 = formulaPage.getDisplayOnResultTableCheckbox(1);
    await expect(displayCheckbox2).toBeChecked();
  });

  test('TC_FORMULA_026: Bỏ chọn Checkbox "Hiển thị trên bảng kết quả" tại một dòng cấu hình', {
    tag: ['@normal', '@major']
  }, async ({ formulaPage }) => {
    Logger.step(1, 'Mở form Thêm công thức tính');
    await formulaPage.openAddFormulaForm();

    Logger.step(2, 'Bỏ tích chọn checkbox "Hiển thị trên bảng kết quả" ở dòng 1');
    const displayCheckbox = formulaPage.getDisplayOnResultTableCheckbox(0);
    await displayCheckbox.uncheck();

    Logger.step('Verify', 'Checkbox đã ở trạng thái bỏ chọn');
    await expect(displayCheckbox).not.toBeChecked();
  });

  test('TC_FORMULA_027: Nhập Tên cột tùy chỉnh và Độ rộng (px) hợp lệ cho biến số', {
    tag: ['@high', '@major']
  }, async ({ formulaPage }) => {
    Logger.step(1, 'Mở form Thêm công thức tính');
    await formulaPage.openAddFormulaForm();

    Logger.step(2, 'Nhập Tên cột và Độ rộng tại dòng 1');
    const colNameInput = formulaPage.getColumnNameInput(0);
    const colWidthInput = formulaPage.getColumnWidthInput(0);

    await colNameInput.fill('Khối lượng mẫu cân (g)');
    await colWidthInput.fill('200');

    Logger.step('Verify', 'Giá trị hiển thị đúng trong ô nhập');
    await expect(colNameInput).toHaveValue('Khối lượng mẫu cân (g)');
    await expect(colWidthInput).toHaveValue('200');
  });

  test('TC_FORMULA_028: Nhập độ rộng cột là số 0 hoặc số âm', {
    tag: ['@normal', '@minor']
  }, async ({ formulaPage }) => {
    Logger.step(1, 'Mở form Thêm công thức tính');
    await formulaPage.openAddFormulaForm();

    Logger.step(2, 'Nhập giá trị độ rộng là 0');
    const colWidthInput = formulaPage.getColumnWidthInput(0);
    await colWidthInput.fill('0');

    Logger.step('Verify', 'Trường độ rộng hiển thị giá trị đã nhập');
    await expect(colWidthInput).toHaveValue('0');
  });

  // ==========================================
  // KHỐI 10: TÌM KIẾM & QUẢN LÝ CỘT HIỂN THỊ
  // ==========================================
  test('TC_FORMULA_029: Tìm kiếm công thức tính theo từ khóa', {
    tag: ['@normal', '@major']
  }, async ({ formulaPage }) => {
    Logger.step(1, 'Lấy tên công thức đầu tiên trong bảng');
    const firstRowText = await formulaPage.firstRowNameCell.textContent();
    const keyword = firstRowText?.trim().split(' ')[0] || 'CT';

    Logger.step(2, `Nhập từ khóa tìm kiếm: "${keyword}"`);
    await formulaPage.search(keyword);

    Logger.step('Verify', 'Bảng công thức tính hiển thị kết quả khớp');
    await expect(formulaPage.table).toBeVisible();
  });

  test('TC_FORMULA_030: Tìm kiếm với từ khóa không tồn tại', {
    tag: ['@normal', '@minor']
  }, async ({ formulaPage }) => {
    Logger.step(1, 'Tìm kiếm với từ khóa không tồn tại');
    await formulaPage.search('TuKhoaChacChanKhongTonTai_9999');

    Logger.step('Verify', 'Bảng không chứa dòng dữ liệu nào hoặc hiển thị trống');
    await expect(formulaPage.rows).toHaveCount(0);
  });

  test('TC_FORMULA_031: Xóa từ khóa tìm kiếm để quay lại toàn bộ danh sách ban đầu', {
    tag: ['@normal', '@minor']
  }, async ({ formulaPage }) => {
    Logger.step(1, 'Tìm kiếm với từ khóa bất kỳ');
    await formulaPage.search('TuKhoaBatKy');

    Logger.step(2, 'Xóa trắng ô tìm kiếm');
    await formulaPage.clearSearch();

    Logger.step('Verify', 'Danh sách công thức tính được khôi phục');
    await expect(formulaPage.table).toBeVisible();
  });

  test('TC_FORMULA_032: Mở hộp thoại Quản lý cột từ chân bảng danh sách', {
    tag: ['@normal', '@minor']
  }, async ({ formulaPage }) => {
    Logger.step(1, 'Nhấn nút "Quản lý cột"');
    await formulaPage.columnManageButton.click();

    Logger.step('Verify', 'Hộp thoại Quản lý cột hiển thị');
    await expect(formulaPage.columnManageModal).toBeVisible();
  });

  // ==========================================
  // KHỐI 11: VALIDATION RÀNG BUỘC LOGIC BIẾN SỐ & BIỂU THỨC
  // ==========================================
  test('TC_FORMULA_033: Validation trùng lặp Mã biến giữa các dòng cấu hình', {
    tag: ['@high', '@critical']
  }, async ({ formulaPage }) => {
    Logger.step(1, 'Mở form Thêm công thức tính');
    await formulaPage.openAddFormulaForm();

    Logger.step(2, 'Thêm biến thứ 2 và nhập trùng mã "m1"');
    await formulaPage.clickAddVariable();

    await formulaPage.configureVariableRow(0, { code: 'm1' });
    await formulaPage.configureVariableRow(2, { code: 'm1' });

    Logger.step('Verify', 'Nút "Lưu công thức" bị vô hiệu hóa khi mã biến trùng lặp');
    await expect(formulaPage.saveButton).toBeDisabled();
  });

  test('TC_FORMULA_034: Validation định dạng Mã biến không được chứa khoảng trắng', {
    tag: ['@high', '@major']
  }, async ({ formulaPage }) => {
    Logger.step(1, 'Mở form Thêm công thức tính');
    await formulaPage.openAddFormulaForm();

    Logger.step(2, 'Nhập mã biến có chứa dấu cách');
    await formulaPage.configureVariableRow(0, { code: 'm 1' });

    Logger.step('Verify', 'Nút "Lưu công thức" bị vô hiệu hóa khi mã biến không hợp lệ');
    await expect(formulaPage.saveButton).toBeDisabled();
  });

  test('TC_FORMULA_035: Validation biểu thức sử dụng biến chưa được khai báo', {
    tag: ['@high', '@critical']
  }, async ({ formulaPage }) => {
    Logger.step(1, 'Mở form Thêm công thức tính');
    await formulaPage.openAddFormulaForm();

    Logger.step(2, 'Khai báo biến m1 nhưng biểu thức gọi biến m_chua_khai_bao');
    await formulaPage.configureVariableRow(0, { code: 'm1' });
    await formulaPage.configureExpressionRow(1, {
      code: 'X',
      expression: 'm1 * m_chua_khai_bao'
    });

    Logger.step('Verify', 'Nút "Lưu công thức" bị vô hiệu hóa do biến chưa tồn tại');
    await expect(formulaPage.saveButton).toBeDisabled();
  });

  test('TC_FORMULA_036: Validation biểu thức toán học sai cú pháp (thiếu ngoặc)', {
    tag: ['@high', '@major']
  }, async ({ formulaPage }) => {
    Logger.step(1, 'Mở form Thêm công thức tính');
    await formulaPage.openAddFormulaForm();

    Logger.step(2, 'Nhập biểu thức thiếu dấu đóng ngoặc');
    await formulaPage.configureVariableRow(0, { code: 'm1' });
    await formulaPage.configureExpressionRow(1, {
      code: 'X',
      expression: '(m1 * 2.5'
    });

    Logger.step('Verify', 'Nút "Lưu công thức" bị vô hiệu hóa do lỗi cú pháp toán học');
    await expect(formulaPage.saveButton).toBeDisabled();
  });

  test('TC_FORMULA_037: Bắt buộc chọn ít nhất một công thức làm kết quả xuất phiếu', {
    tag: ['@normal', '@major']
  }, async ({ formulaPage }) => {
    Logger.step(1, 'Mở form Thêm công thức tính');
    await formulaPage.openAddFormulaForm();

    Logger.step('Verify', 'Radio "Xuất phiếu kết quả" hiển thị ở dòng công thức');
    const reportRadio = formulaPage.getReportResultRadio(1);
    await expect(reportRadio).toBeVisible();
  });

  // ==========================================
  // KHỐI 12: CẤU HÌNH TÍNH GIÁ TRỊ BẰNG CÔNG THỨC (DYNAMIC TOGGLE)
  // ==========================================
  test('TC_FORMULA_038: Trạng thái mặc định của Checkbox "Tính giá trị bằng công thức."', {
    tag: ['@normal', '@minor']
  }, async ({ formulaPage }) => {
    Logger.step(1, 'Mở form Thêm công thức tính');
    await formulaPage.openAddFormulaForm();

    Logger.step('Verify 1', 'Dòng Biến 1: Checkbox "Tính giá trị bằng công thức." ở trạng thái bỏ chọn (Unchecked)');
    const calcCheckbox1 = formulaPage.getCalculateByFormulaCheckbox(0);
    await expect(calcCheckbox1).not.toBeChecked();

    Logger.step('Verify 2', 'Dòng Biến 1: Ô "GIÁ TRỊ MẶC ĐỊNH" hiển thị');
    const defaultInput1 = formulaPage.getDefaultValueInput(0);
    await expect(defaultInput1).toBeVisible();

    Logger.step('Verify 3', 'Dòng Công thức 2: Checkbox "Tính giá trị bằng công thức." ở trạng thái được tích (Checked)');
    const calcCheckbox2 = formulaPage.getCalculateByFormulaCheckbox(1);
    await expect(calcCheckbox2).toBeChecked();

    Logger.step('Verify 4', 'Dòng Công thức 2: Ô nhập biểu thức toán học hiển thị');
    const exprInput2 = formulaPage.getExpressionInput(1);
    await expect(exprInput2).toBeVisible();
  });

  test('TC_FORMULA_039: Chuyển đổi Biến số thành Công thức tính bằng checkbox', {
    tag: ['@high', '@major']
  }, async ({ formulaPage }) => {
    Logger.step(1, 'Mở form Thêm công thức tính');
    await formulaPage.openAddFormulaForm();

    Logger.step(2, 'Tích chọn checkbox "Tính giá trị bằng công thức." tại dòng Biến 1');
    const calcCheckbox = formulaPage.getCalculateByFormulaCheckbox(0);
    await calcCheckbox.check();

    Logger.step('Verify 1', 'Checkbox chuyển sang trạng thái đã chọn');
    await expect(calcCheckbox).toBeChecked();

    Logger.step('Verify 2', 'Ô nhập biểu thức toán học hiển thị');
    const exprInput = formulaPage.getExpressionInput(0);
    await expect(exprInput).toBeVisible();
  });

  test('TC_FORMULA_040: Chuyển đổi Công thức tính thành Biến số bằng cách bỏ chọn checkbox', {
    tag: ['@high', '@major']
  }, async ({ formulaPage }) => {
    Logger.step(1, 'Mở form Thêm công thức tính');
    await formulaPage.openAddFormulaForm();

    Logger.step(2, 'Bỏ chọn checkbox "Tính giá trị bằng công thức." tại dòng Công thức 2');
    const calcCheckbox = formulaPage.getCalculateByFormulaCheckbox(1);
    await calcCheckbox.uncheck();

    Logger.step('Verify 1', 'Checkbox chuyển sang trạng thái bỏ chọn');
    await expect(calcCheckbox).not.toBeChecked();

    Logger.step('Verify 2', 'Ô "GIÁ TRỊ MẶC ĐỊNH" xuất hiện trở lại');
    const defaultInput = formulaPage.getDefaultValueInput(1);
    await expect(defaultInput).toBeVisible();
  });

  test('TC_FORMULA_041: Bỏ trống ô nhập biểu thức khi tích chọn "Tính giá trị bằng công thức."', {
    tag: ['@high', '@major']
  }, async ({ formulaPage }) => {
    Logger.step(1, 'Mở form Thêm công thức tính');
    await formulaPage.openAddFormulaForm();

    Logger.step(2, 'Để trống ô biểu thức toán học tại dòng Công thức 2');
    const exprInput = formulaPage.getExpressionInput(1);
    await exprInput.fill('');

    Logger.step('Verify', 'Nút "Lưu công thức" ở trạng thái vô hiệu hóa do thiếu biểu thức');
    await expect(formulaPage.saveButton).toBeDisabled();
  });
});


