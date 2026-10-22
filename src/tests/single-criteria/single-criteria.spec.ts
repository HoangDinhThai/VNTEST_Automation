import { test, expect } from '../../fixtures/base.fixture';
import { Logger } from '../../utils/logger';
import users from '../../../test-data/users.json';
import { TestDataGenerator } from '../../utils/test-data-generator';

test.describe('Module Quản lý Chỉ tiêu lẻ (/chi-tieu-le) - Hệ thống VNTEST LIMS', () => {
  test.beforeEach(async ({ loginPage, singleCriteriaPage, page }) => {
    Logger.step('Setup', 'Đăng nhập vào hệ thống và điều hướng tới trang Chỉ tiêu lẻ');
    await loginPage.open('/dang-nhap');
    await loginPage.login(users.validUser.username, users.validUser.password);
    await page.waitForURL('https://vntest-lims.pirago.work/', { timeout: 15000 });

    await singleCriteriaPage.open();
    await expect(singleCriteriaPage.singleCriteriaTab).toBeVisible({ timeout: 15000 });
  });

  // ==========================================
  // KHỐI 01: BỐ CỤC & HIỂN THỊ
  // ==========================================
  test('TC_SC_001: Hiển thị đầy đủ các thành phần màn hình Chỉ tiêu lẻ', {
    tag: ['@normal', '@minor']
  }, async ({ singleCriteriaPage }) => {
    Logger.step(1, 'Kiểm tra tab Header');
    await expect(singleCriteriaPage.singleCriteriaTab).toBeVisible();
    await expect(singleCriteriaPage.singleCriteriaTab).toHaveClass(/active/);
    await expect(singleCriteriaPage.packageCriteriaTab).toBeVisible();

    Logger.step(2, 'Kiểm tra khung Nền mẫu (bên trái)');
    await expect(singleCriteriaPage.leftPane).toBeVisible();
    await expect(singleCriteriaPage.addMatrixButton).toBeVisible();
    await expect(singleCriteriaPage.editMatrixButton).toBeVisible();
    await expect(singleCriteriaPage.deleteMatrixButton).toBeVisible();
    await expect(singleCriteriaPage.matrixTable).toBeVisible();
    await expect(singleCriteriaPage.firstMatrixRow).toBeVisible();

    Logger.step(3, 'Kiểm tra khung Chỉ tiêu lẻ (bên phải)');
    await expect(singleCriteriaPage.rightPane).toBeVisible();
    await expect(singleCriteriaPage.criteriaSearchInput).toBeVisible();
    await expect(singleCriteriaPage.addCriteriaButton).toBeVisible();
    await expect(singleCriteriaPage.editCriteriaButton).toBeVisible();
    await expect(singleCriteriaPage.deleteCriteriaButton).toBeVisible();
  });

  test('TC_SC_002: Trạng thái ban đầu của các nút thao tác khi chưa chọn dòng', {
    tag: ['@normal', '@minor']
  }, async ({ singleCriteriaPage }) => {
    Logger.step('Verify', 'Nút "Sửa" và "Xóa" nền mẫu ở trạng thái vô hiệu hóa (disabled)');
    await expect(singleCriteriaPage.editMatrixButton).toBeDisabled();
    await expect(singleCriteriaPage.deleteMatrixButton).toBeDisabled();

    Logger.step('Verify', 'Nút "Sửa CT", "Xóa CT" và ô tìm kiếm ở trạng thái vô hiệu hóa khi chưa chọn nền mẫu');
    await expect(singleCriteriaPage.editCriteriaButton).toBeDisabled();
    await expect(singleCriteriaPage.deleteCriteriaButton).toBeDisabled();
  });

  // ==========================================
  // KHỐI 02: QUẢN LÝ NỀN MẪU (THÊM, SỬA, XÓA)
  // ==========================================
  test('TC_SC_003: Mở và đóng hộp thoại Thêm Nền mẫu bằng nút "Hủy"', {
    tag: ['@low', '@minor']
  }, async ({ singleCriteriaPage }) => {
    Logger.step(1, 'Nhấn nút "Thêm" nền mẫu trên thanh công cụ');
    await singleCriteriaPage.openCreateMatrixModal();
    await expect(singleCriteriaPage.createMatrixModalTitle).toBeVisible();
    await expect(singleCriteriaPage.createMatrixNameInput).toBeVisible();

    Logger.step(2, 'Nhấn nút "Hủy" trên hộp thoại');
    await singleCriteriaPage.closeCreateMatrixModal();

    Logger.step('Verify', 'Hộp thoại thêm nền mẫu được đóng lại');
    await expect(singleCriteriaPage.createMatrixModal).toBeHidden();
  });

  test('TC_SC_004: Validate trường bắt buộc khi tạo Nền mẫu để trống', {
    tag: ['@high', '@major']
  }, async ({ singleCriteriaPage }) => {
    Logger.step(1, 'Mở hộp thoại Thêm Nền mẫu');
    await singleCriteriaPage.openCreateMatrixModal();

    Logger.step(2, 'Nhấn nút "Lưu" mà không nhập Tên nền mẫu');
    await singleCriteriaPage.submitCreateMatrix();

    Logger.step('Verify', 'Hiển thị cảnh báo lỗi bắt buộc "Vui lòng nhập tên nền mẫu."');
    await expect(singleCriteriaPage.createMatrixNameRequiredError).toBeVisible();
    await expect(singleCriteriaPage.createMatrixNameRequiredError).toHaveText('Vui lòng nhập tên nền mẫu.');

    Logger.step('Teardown', 'Đóng modal');
    await singleCriteriaPage.closeCreateMatrixModal();
  });

  test('TC_SC_005: Thêm mới Nền mẫu thành công', {
    tag: ['@high', '@critical']
  }, async ({ singleCriteriaPage }) => {
    const timestamp = Date.now();
    const matrixName = `Nền mẫu Auto ${timestamp}`;

    Logger.step(1, 'Mở hộp thoại và nhập tên nền mẫu mới');
    await singleCriteriaPage.openCreateMatrixModal();
    await singleCriteriaPage.enterMatrixName(matrixName);

    Logger.step(2, 'Nhấn nút "Lưu"');
    await singleCriteriaPage.submitCreateMatrix();

    Logger.step('Verify', 'Hộp thoại đóng và nền mẫu mới hiển thị trên danh sách bảng bên trái');
    await expect(singleCriteriaPage.createMatrixModal).toBeHidden();
    const createdRow = singleCriteriaPage.matrixRows.filter({ hasText: matrixName }).first();
    await expect(createdRow).toBeVisible();

    Logger.step('Teardown', 'Xóa nền mẫu vừa tạo để làm sạch dữ liệu kiểm thử');
    await createdRow.locator('input.cb').check();
    await singleCriteriaPage.openDeleteMatrixModal();
    await singleCriteriaPage.confirmDeleteMatrix();
    await expect(createdRow).toBeHidden();
  });

  test('TC_SC_006: Sửa tên Nền mẫu thành công', {
    tag: ['@high', '@major']
  }, async ({ singleCriteriaPage }) => {
    const timestamp = Date.now();
    const originalName = `Nền mẫu gốc ${timestamp}`;
    const updatedName = `Nền mẫu sửa ${timestamp}`;

    Logger.step(1, 'Tạo nền mẫu ban đầu');
    await singleCriteriaPage.createSampleMatrix(originalName);
    const targetRow = singleCriteriaPage.matrixRows.filter({ hasText: originalName }).first();
    await expect(targetRow).toBeVisible();

    Logger.step(2, 'Tích chọn checkbox nền mẫu và nhấn nút "Sửa"');
    await targetRow.locator('input.cb').check();
    await singleCriteriaPage.openEditMatrixModal();
    await expect(singleCriteriaPage.editMatrixModalTitle).toBeVisible();

    Logger.step(3, 'Cập nhật tên mới và nhấn nút "Lưu"');
    await singleCriteriaPage.editMatrixName(updatedName);
    await singleCriteriaPage.submitEditMatrix();

    Logger.step('Verify', 'Tên nền mẫu mới được hiển thị trên bảng danh sách');
    await expect(singleCriteriaPage.editMatrixModal).toBeHidden();
    const updatedRow = singleCriteriaPage.matrixRows.filter({ hasText: updatedName }).first();
    await expect(updatedRow).toBeVisible();

    Logger.step('Teardown', 'Dọn dẹp dữ liệu');
    await updatedRow.locator('input.cb').check();
    await singleCriteriaPage.openDeleteMatrixModal();
    await singleCriteriaPage.confirmDeleteMatrix();
    await expect(updatedRow).toBeHidden();
  });

  test('TC_SC_007: Hủy thao tác xóa Nền mẫu trong hộp thoại xác nhận', {
    tag: ['@normal', '@minor']
  }, async ({ singleCriteriaPage }) => {
    const timestamp = Date.now();
    const matrixName = `Nền mẫu Test Hủy ${timestamp}`;

    Logger.step(1, 'Tạo nền mẫu thử nghiệm');
    await singleCriteriaPage.createSampleMatrix(matrixName);
    const targetRow = singleCriteriaPage.matrixRows.filter({ hasText: matrixName }).first();
    await expect(targetRow).toBeVisible();

    Logger.step(2, 'Tích chọn nền mẫu và nhấn nút "Xóa"');
    await targetRow.locator('input.cb').check();
    await singleCriteriaPage.openDeleteMatrixModal();
    await expect(singleCriteriaPage.deleteMatrixModalTitle).toBeVisible();

    Logger.step(3, 'Nhấn nút "Hủy" trên hộp thoại xác nhận');
    await singleCriteriaPage.cancelDeleteMatrix();

    Logger.step('Verify', 'Hộp thoại đóng và nền mẫu vẫn còn tồn tại trên bảng');
    await expect(singleCriteriaPage.deleteMatrixModal).toBeHidden();
    await expect(targetRow).toBeVisible();

    Logger.step('Teardown', 'Xóa thực sự để dọn dẹp');
    await targetRow.locator('input.cb').check();
    await singleCriteriaPage.openDeleteMatrixModal();
    await singleCriteriaPage.confirmDeleteMatrix();
    await expect(targetRow).toBeHidden();
  });

  test('TC_SC_008: Xóa Nền mẫu thành công khỏi hệ thống', {
    tag: ['@high', '@critical']
  }, async ({ singleCriteriaPage }) => {
    const timestamp = Date.now();
    const matrixName = `Nền mẫu cần xóa ${timestamp}`;

    Logger.step(1, 'Tạo nền mẫu cần xóa');
    await singleCriteriaPage.createSampleMatrix(matrixName);
    const targetRow = singleCriteriaPage.matrixRows.filter({ hasText: matrixName }).first();
    await expect(targetRow).toBeVisible();

    Logger.step(2, 'Tích chọn nền mẫu và nhấn nút "Xóa"');
    await targetRow.locator('input.cb').check();
    await singleCriteriaPage.openDeleteMatrixModal();

    Logger.step(3, 'Xác nhận xóa nền mẫu');
    await singleCriteriaPage.confirmDeleteMatrix();

    Logger.step('Verify', 'Nền mẫu biến mất hoàn toàn khỏi danh sách');
    await expect(singleCriteriaPage.deleteMatrixModal).toBeHidden();
    await expect(targetRow).toBeHidden();
  });

  // ==========================================
  // KHỐI 03: QUẢN LÝ CHỈ TIÊU LẺ - THÊM MỚI
  // ==========================================
  test('TC_SC_009: Mở và đóng hộp thoại Thêm Chỉ tiêu bằng nút "Hủy"', {
    tag: ['@low', '@minor']
  }, async ({ singleCriteriaPage }) => {
    Logger.step(1, 'Chọn dòng nền mẫu đầu tiên để kích hoạt nút Thêm CT');
    await singleCriteriaPage.firstMatrixNameCell.click();
    await expect(singleCriteriaPage.addCriteriaButton).toBeEnabled();

    Logger.step(2, 'Nhấn nút "Thêm CT"');
    await singleCriteriaPage.openCreateCriteriaModal();
    await expect(singleCriteriaPage.createCriteriaModalTitle).toBeVisible();
    await expect(singleCriteriaPage.criteriaCodeInput).toBeVisible();

    Logger.step(3, 'Nhấn nút "Hủy" trên modal');
    await singleCriteriaPage.closeCreateCriteriaModal();

    Logger.step('Verify', 'Modal Thêm chỉ tiêu được đóng lại');
    await expect(singleCriteriaPage.criteriaModal).toBeHidden();
  });

  test('TC_SC_010: Validate các trường bắt buộc khi để trống toàn bộ form Thêm Chỉ tiêu', {
    tag: ['@high', '@major']
  }, async ({ singleCriteriaPage }) => {
    Logger.step(1, 'Chọn nền mẫu và mở modal Thêm CT');
    await singleCriteriaPage.firstMatrixNameCell.click();
    await singleCriteriaPage.openCreateCriteriaModal();

    Logger.step(2, 'Nhấn nút "Lưu chỉ tiêu" khi chưa nhập dữ liệu');
    await singleCriteriaPage.submitCreateCriteria();

    Logger.step('Verify', 'Hiển thị đầy đủ thông báo lỗi cho các trường bắt buộc');
    await expect(singleCriteriaPage.criteriaCodeRequiredError).toBeVisible();
    await expect(singleCriteriaPage.criteriaNameRequiredError).toBeVisible();
    await expect(singleCriteriaPage.analysisGroupRequiredError).toBeVisible();
    await expect(singleCriteriaPage.floorPriceRequiredError).toBeVisible();
    await expect(singleCriteriaPage.salePriceRequiredError).toBeVisible();
    await expect(singleCriteriaPage.turnaroundTimeRequiredError).toBeVisible();
    await expect(singleCriteriaPage.testingMethodRequiredError).toBeVisible();

    Logger.step('Teardown', 'Đóng modal');
    await singleCriteriaPage.closeCreateCriteriaModal();
  });

  test('TC_SC_011: Thêm mới Chỉ tiêu lẻ thành công với đầy đủ thông tin hợp lệ', {
    tag: ['@high', '@critical']
  }, async ({ singleCriteriaPage }) => {
    const timestamp = Date.now();
    const matrixName = `Nền mẫu CT Test ${timestamp}`;
    const ctCode = `CT${timestamp.toString().slice(-6)}`;
    const ctName = `Chỉ tiêu Tự động ${timestamp}`;

    Logger.step(1, 'Tạo nền mẫu riêng biệt cho test case');
    await singleCriteriaPage.createSampleMatrix(matrixName);
    const matrixRow = singleCriteriaPage.matrixRows.filter({ hasText: matrixName }).first();
    await expect(matrixRow).toBeVisible();

    Logger.step(2, 'Bấm vào nền mẫu vừa tạo để hiển thị danh sách chỉ tiêu');
    await matrixRow.locator('td.sample-matrix-name-cell').click();
    await expect(singleCriteriaPage.addCriteriaButton).toBeEnabled();

    Logger.step(3, 'Mở modal Thêm CT và nhập đầy đủ thông tin hợp lệ');
    await singleCriteriaPage.openCreateCriteriaModal();
    await singleCriteriaPage.fillCriteriaForm({
      code: ctCode,
      name: ctName,
      group: 'HCB',
      floorPrice: '50000',
      salePrice: '75000',
      turnaroundDays: '4',
      method: 'TCVN 1234:2020',
      unit: 'mg/kg',
      note: 'Chỉ tiêu kiểm thử tự động hệ thống'
    });

    Logger.step(4, 'Nhấn nút "Lưu chỉ tiêu"');
    await singleCriteriaPage.submitCreateCriteria();

    Logger.step('Verify', 'Hộp thoại đóng và chỉ tiêu mới hiển thị trên bảng bên phải');
    await expect(singleCriteriaPage.criteriaModal).toBeHidden();
    const createdCtRow = singleCriteriaPage.criteriaRows.filter({ hasText: ctCode }).first();
    await expect(createdCtRow).toBeVisible();
    await expect(createdCtRow).toContainText(ctName);

    Logger.step('Teardown', 'Xóa nền mẫu (tự động xóa toàn bộ chỉ tiêu thuộc nền mẫu)');
    await matrixRow.locator('input.cb').check();
    await singleCriteriaPage.openDeleteMatrixModal();
    await singleCriteriaPage.confirmDeleteMatrix();
    await expect(matrixRow).toBeHidden();
  });

  // ==========================================
  // KHỐI 04: QUẢN LÝ CHỈ TIÊU LẺ - CẬP NHẬT / SỬA
  // ==========================================
  test('TC_SC_012: Hủy bỏ thao tác chỉnh sửa Chỉ tiêu bằng nút "Hủy"', {
    tag: ['@normal', '@minor']
  }, async ({ singleCriteriaPage }) => {
    const timestamp = Date.now();
    const matrixName = `Nền mẫu Edit Test ${timestamp}`;
    const ctCode = `CT${timestamp.toString().slice(-6)}`;
    const ctName = `Chỉ tiêu Gốc ${timestamp}`;

    Logger.step(1, 'Tạo nền mẫu và chỉ tiêu mẫu');
    await singleCriteriaPage.createSampleMatrix(matrixName);
    const matrixRow = singleCriteriaPage.matrixRows.filter({ hasText: matrixName }).first();
    await matrixRow.locator('td.sample-matrix-name-cell').click();

    await singleCriteriaPage.openCreateCriteriaModal();
    await singleCriteriaPage.fillCriteriaForm({
      code: ctCode,
      name: ctName,
      group: 'QP',
      floorPrice: '60000',
      salePrice: '90000',
      turnaroundDays: '3',
      method: 'ISO 17025'
    });
    await singleCriteriaPage.submitCreateCriteria();
    await expect(singleCriteriaPage.criteriaModal).toBeHidden();

    Logger.step(2, 'Tích chọn chỉ tiêu và nhấn nút "Sửa CT"');
    const ctRow = singleCriteriaPage.criteriaRows.filter({ hasText: ctCode }).first();
    await ctRow.locator('input.cb').check();
    await singleCriteriaPage.openEditCriteriaModal();
    await expect(singleCriteriaPage.editCriteriaModalTitle).toBeVisible();

    Logger.step(3, 'Thay đổi tên và nhấn nút "Hủy" trên modal');
    await singleCriteriaPage.criteriaNameInput.fill(`${ctName} - Thay đổi`);
    await singleCriteriaPage.closeCreateCriteriaModal();

    Logger.step('Verify', 'Hiển thị hộp thoại cảnh báo "Bạn có thay đổi chưa lưu"');
    await expect(singleCriteriaPage.unsavedChangesDialog).toBeVisible();

    Logger.step(4, 'Xác nhận "Đóng" trên hộp thoại cảnh báo để hủy các thay đổi');
    await singleCriteriaPage.discardChangesAndClose();

    Logger.step('Verify', 'Hộp thoại đóng lại và tên chỉ tiêu giữ nguyên giá trị ban đầu');
    await expect(singleCriteriaPage.unsavedChangesDialog).toBeHidden();
    await expect(singleCriteriaPage.criteriaModal).toBeHidden();
    await expect(ctRow).toContainText(ctName);

    Logger.step('Teardown', 'Dọn dẹp nền mẫu');
    await matrixRow.locator('input.cb').check();
    await singleCriteriaPage.openDeleteMatrixModal();
    await singleCriteriaPage.confirmDeleteMatrix();
  });

  test('TC_SC_013: Cập nhật thông tin Chỉ tiêu lẻ thành công', {
    tag: ['@high', '@critical']
  }, async ({ singleCriteriaPage }) => {
    const timestamp = Date.now();
    const matrixName = `Nền mẫu Update Test ${timestamp}`;
    const ctCode = `CT${timestamp.toString().slice(-6)}`;
    const ctName = `Chỉ tiêu Chưa sửa ${timestamp}`;
    const updatedCtName = `Chỉ tiêu Đã sửa ${timestamp}`;

    Logger.step(1, 'Tạo nền mẫu và chỉ tiêu ban đầu');
    await singleCriteriaPage.createSampleMatrix(matrixName);
    const matrixRow = singleCriteriaPage.matrixRows.filter({ hasText: matrixName }).first();
    await matrixRow.locator('td.sample-matrix-name-cell').click();

    await singleCriteriaPage.openCreateCriteriaModal();
    await singleCriteriaPage.fillCriteriaForm({
      code: ctCode,
      name: ctName,
      group: 'SK',
      floorPrice: '100000',
      salePrice: '150000',
      turnaroundDays: '5',
      method: 'AOAC 990.12'
    });
    await singleCriteriaPage.submitCreateCriteria();
    await expect(singleCriteriaPage.criteriaModal).toBeHidden();

    Logger.step(2, 'Tích chọn chỉ tiêu và nhấn nút "Sửa CT"');
    const ctRow = singleCriteriaPage.criteriaRows.filter({ hasText: ctCode }).first();
    await ctRow.locator('input.cb').check();
    await singleCriteriaPage.openEditCriteriaModal();

    Logger.step(3, 'Cập nhật Tên chỉ tiêu, Giá bán và nhấn "Lưu thay đổi"');
    await singleCriteriaPage.criteriaNameInput.fill(updatedCtName);
    await singleCriteriaPage.salePriceInput.fill('180000');
    await singleCriteriaPage.submitEditCriteria();

    Logger.step('Verify', 'Modal đóng và thông tin mới hiển thị trên bảng');
    await expect(singleCriteriaPage.criteriaModal).toBeHidden();
    const updatedRow = singleCriteriaPage.criteriaRows.filter({ hasText: updatedCtName }).first();
    await expect(updatedRow).toBeVisible();

    Logger.step('Teardown', 'Dọn dẹp nền mẫu');
    await matrixRow.locator('input.cb').check();
    await singleCriteriaPage.openDeleteMatrixModal();
    await singleCriteriaPage.confirmDeleteMatrix();
  });

  // ==========================================
  // KHỐI 05: QUẢN LÝ CHỈ TIÊU LẺ - XÓA CHỈ TIÊU
  // ==========================================
  test('TC_SC_014: Hủy bỏ thao tác xóa Chỉ tiêu lẻ trong hộp thoại xác nhận', {
    tag: ['@normal', '@minor']
  }, async ({ singleCriteriaPage }) => {
    const timestamp = Date.now();
    const matrixName = `Nền mẫu Del Cancel ${timestamp}`;
    const ctCode = `CT${timestamp.toString().slice(-6)}`;
    const ctName = `Chỉ tiêu Test Hủy Xóa ${timestamp}`;

    Logger.step(1, 'Tạo nền mẫu và chỉ tiêu mẫu');
    await singleCriteriaPage.createSampleMatrix(matrixName);
    const matrixRow = singleCriteriaPage.matrixRows.filter({ hasText: matrixName }).first();
    await matrixRow.locator('td.sample-matrix-name-cell').click();

    await singleCriteriaPage.openCreateCriteriaModal();
    await singleCriteriaPage.fillCriteriaForm({
      code: ctCode,
      name: ctName,
      group: 'VS',
      floorPrice: '70000',
      salePrice: '95000',
      turnaroundDays: '2',
      method: 'TCVN 7928:2008'
    });
    await singleCriteriaPage.submitCreateCriteria();
    await expect(singleCriteriaPage.criteriaModal).toBeHidden();

    Logger.step(2, 'Tích chọn chỉ tiêu và nhấn nút "Xóa CT"');
    const ctRow = singleCriteriaPage.criteriaRows.filter({ hasText: ctCode }).first();
    await ctRow.locator('input.cb').check();
    await singleCriteriaPage.openDeleteCriteriaModal();
    await expect(singleCriteriaPage.deleteCriteriaModalTitle).toBeVisible();

    Logger.step(3, 'Nhấn nút "Hủy" trên hộp thoại xác nhận');
    await singleCriteriaPage.cancelDeleteCriteria();

    Logger.step('Verify', 'Hộp thoại đóng và bản ghi chỉ tiêu vẫn tồn tại');
    await expect(singleCriteriaPage.deleteCriteriaModal).toBeHidden();
    await expect(ctRow).toBeVisible();

    Logger.step('Teardown', 'Dọn dẹp nền mẫu');
    await matrixRow.locator('input.cb').check();
    await singleCriteriaPage.openDeleteMatrixModal();
    await singleCriteriaPage.confirmDeleteMatrix();
  });

  test('TC_SC_015: Xác nhận xóa Chỉ tiêu lẻ thành công khỏi hệ thống', {
    tag: ['@high', '@critical']
  }, async ({ singleCriteriaPage }) => {
    const timestamp = Date.now();
    const matrixName = `Nền mẫu Del Confirm ${timestamp}`;
    const ctCode = `CT${timestamp.toString().slice(-6)}`;
    const ctName = `Chỉ tiêu Cần Xóa ${timestamp}`;

    Logger.step(1, 'Tạo nền mẫu và chỉ tiêu cần xóa');
    await singleCriteriaPage.createSampleMatrix(matrixName);
    const matrixRow = singleCriteriaPage.matrixRows.filter({ hasText: matrixName }).first();
    await matrixRow.locator('td.sample-matrix-name-cell').click();

    await singleCriteriaPage.openCreateCriteriaModal();
    await singleCriteriaPage.fillCriteriaForm({
      code: ctCode,
      name: ctName,
      group: 'CLY',
      floorPrice: '40000',
      salePrice: '60000',
      turnaroundDays: '1',
      method: 'TCVN 6016:2011'
    });
    await singleCriteriaPage.submitCreateCriteria();
    await expect(singleCriteriaPage.criteriaModal).toBeHidden();

    Logger.step(2, 'Tích chọn chỉ tiêu và mở hộp thoại xóa');
    const ctRow = singleCriteriaPage.criteriaRows.filter({ hasText: ctCode }).first();
    await ctRow.locator('input.cb').check();
    await singleCriteriaPage.openDeleteCriteriaModal();

    Logger.step(3, 'Nhấn nút "Xóa" để xác nhận');
    await singleCriteriaPage.confirmDeleteCriteria();

    Logger.step('Verify', 'Chỉ tiêu đã bị xóa biến mất khỏi bảng');
    await expect(singleCriteriaPage.deleteCriteriaModal).toBeHidden();
    await expect(singleCriteriaPage.criteriaRows.filter({ hasText: ctCode })).toHaveCount(0);

    Logger.step('Teardown', 'Dọn dẹp nền mẫu');
    await matrixRow.locator('input.cb').check();
    await singleCriteriaPage.openDeleteMatrixModal();
    await singleCriteriaPage.confirmDeleteMatrix();
  });

  // ==========================================
  // KHỐI 06: TÌM KIẾM & BỘ LỌC
  // ==========================================
  test('TC_SC_016: Tìm kiếm Chỉ tiêu theo mã hoặc tên chỉ tiêu', {
    tag: ['@normal', '@major']
  }, async ({ singleCriteriaPage }) => {
    Logger.step(1, 'Chọn nền mẫu có dữ liệu để hiển thị bảng chỉ tiêu');
    await singleCriteriaPage.firstMatrixNameCell.click();
    await expect(singleCriteriaPage.criteriaRows.first()).toBeVisible();

    Logger.step(2, 'Lấy mã chỉ tiêu của dòng đầu tiên để làm từ khóa tìm kiếm');
    const rawCode = await singleCriteriaPage.firstCriteriaCodeCell.textContent();
    const searchCode = rawCode?.trim() || 'CT';

    Logger.step(3, `Nhập từ khóa "${searchCode}" vào ô tìm kiếm`);
    await singleCriteriaPage.searchCriteria(searchCode);
    await singleCriteriaPage.page.waitForTimeout(1000);

    Logger.step('Verify', 'Tất cả các dòng kết quả hiển thị đều chứa từ khóa tìm kiếm');
    const rowCount = await singleCriteriaPage.criteriaRows.count();
    expect(rowCount).toBeGreaterThan(0);
    const searchResult = singleCriteriaPage.criteriaRows.filter({ hasText: searchCode });
    await expect(searchResult.first()).toBeVisible();
  });

  test('TC_SC_017: Xóa nội dung tìm kiếm bằng nút "Hủy" trên ô tìm kiếm', {
    tag: ['@low', '@minor']
  }, async ({ singleCriteriaPage }) => {
    Logger.step(1, 'Chọn nền mẫu và nhập từ khóa tìm kiếm');
    await singleCriteriaPage.firstMatrixNameCell.click();
    await singleCriteriaPage.searchCriteria('XYZ_KHONG_TON_TAI_999');
    await singleCriteriaPage.page.waitForTimeout(500);

    Logger.step(2, 'Nhấn nút "Hủy" trên thanh tìm kiếm');
    await expect(singleCriteriaPage.criteriaSearchClearButton).toBeEnabled();
    await singleCriteriaPage.clearCriteriaSearch();

    Logger.step('Verify', 'Ô tìm kiếm được làm trống và danh sách chỉ tiêu được khôi phục');
    await expect(singleCriteriaPage.criteriaSearchInput).toHaveValue('');
    await expect(singleCriteriaPage.firstCriteriaRow).toBeVisible();
  });
});
