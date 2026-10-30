import { test, expect } from '../../fixtures/base.fixture';
import { Logger } from '../../utils/logger';
import users from '../../../test-data/users.json';

test.describe('Module Quản lý Nhân sự - Hệ thống VNTEST LIMS', () => {
  test.beforeEach(async ({ loginPage, personnelPage, page }) => {
    Logger.step('Setup', 'Đăng nhập và điều hướng tới trang danh sách Nhân sự');
    await loginPage.open('/dang-nhap');
    await loginPage.login(users.validUser.username, users.validUser.password);
    await page.waitForURL('https://vntest-lims.pirago.work/', { timeout: 15000 });

    await personnelPage.open('/nhan-su');
    await expect(personnelPage.personnelTab).toBeVisible({ timeout: 15000 });
    await expect(personnelPage.table).toBeVisible({ timeout: 15000 });
    await expect(personnelPage.firstRow).toBeVisible({ timeout: 15000 });
  });

  // ==========================================
  // KHỐI 01: BỐ CỤC & HIỂN THỊ
  // ==========================================
  test('TC_NS_001: Hiển thị đầy đủ tiêu đề tab "NHÂN SỰ", các chip phòng ban, bộ lọc và ô tìm kiếm', {
    tag: ['@normal', '@minor']
  }, async ({ personnelPage }) => {
    Logger.step(1, 'Kiểm tra tab chính Nhân sự và các chip danh mục');
    await expect(personnelPage.personnelTab).toBeVisible();
    await expect(personnelPage.deptAllChip).toBeVisible();
    await expect(personnelPage.dept1Chip).toBeVisible();

    Logger.step(2, 'Kiểm tra bộ lọc trạng thái và ô tìm kiếm');
    await expect(personnelPage.statusFilterDropdown).toBeVisible();
    await expect(personnelPage.searchInput).toBeVisible();
    await expect(personnelPage.clearSearchButton).toBeVisible();
  });

  test('TC_NS_002: Hiển thị đầy đủ 4 nút thao tác chính trên thanh công cụ', {
    tag: ['@normal', '@minor']
  }, async ({ personnelPage }) => {
    Logger.step('Verify', 'Kiểm tra hiển thị nút "Thêm", "Sửa", "Đặt lại mật khẩu", "Xóa"');
    await expect(personnelPage.addPersonnelButton).toBeVisible();
    await expect(personnelPage.editPersonnelButton).toBeVisible();
    await expect(personnelPage.resetPasswordButton).toBeVisible();
    await expect(personnelPage.deletePersonnelButton).toBeVisible();
  });

  test('TC_NS_003: Hiển thị bảng danh sách nhân sự với đầy đủ các cột dữ liệu chuẩn', {
    tag: ['@normal', '@minor']
  }, async ({ personnelPage }) => {
    Logger.step('Verify', 'Bảng dữ liệu nhân sự hiển thị các cột tiêu đề chuẩn');
    await expect(personnelPage.table).toBeVisible();
    await expect(personnelPage.firstRow).toBeVisible();
    await expect(personnelPage.table).toContainText(/mã ns/i);
    await expect(personnelPage.table).toContainText(/họ và tên/i);
    await expect(personnelPage.table).toContainText(/giới tính/i);
    await expect(personnelPage.table).toContainText(/ngày sinh/i);
    await expect(personnelPage.table).toContainText(/cccd/i);
    await expect(personnelPage.table).toContainText(/sđt cá nhân/i);
    await expect(personnelPage.table).toContainText(/email/i);
    await expect(personnelPage.table).toContainText(/phòng\/ban/i);
    await expect(personnelPage.table).toContainText(/chức vụ/i);
  });

  test('TC_NS_004: Hiển thị thông tin phân trang và nút "Quản lý cột" ở chân bảng', {
    tag: ['@normal', '@minor']
  }, async ({ personnelPage }) => {
    Logger.step('Verify', 'Thông tin tổng số nhân sự và nút "Quản lý cột" hiển thị đúng chuẩn');
    await expect(personnelPage.paginationInfo).toBeVisible();
    await expect(personnelPage.paginationInfo).toContainText(/nhân sự/i);
    await expect(personnelPage.manageColumnsButton).toBeVisible();
    await expect(personnelPage.pageSizeDropdown).toBeVisible();
  });

  // ==========================================
  // KHỐI 02: TRẠNG THÁI & ĐIỀU KIỆN KÍCH HOẠT NÚT THAO TÁC
  // ==========================================
  test('TC_NS_005: Trạng thái ban đầu của các nút thao tác khi chưa chọn dòng nào', {
    tag: ['@normal', '@minor']
  }, async ({ personnelPage }) => {
    Logger.step('Verify', 'Nút "Thêm" kích hoạt, các nút "Sửa", "Đặt lại mật khẩu", "Xóa" bị vô hiệu hóa');
    await expect(personnelPage.addPersonnelButton).toBeEnabled();
    await expect(personnelPage.editPersonnelButton).toHaveClass(/disabled/);
    await expect(personnelPage.resetPasswordButton).toHaveClass(/disabled/);
    await expect(personnelPage.deletePersonnelButton).toHaveClass(/disabled/);
  });

  test('TC_NS_006: Kích hoạt toàn bộ các nút thao tác khi tích chọn duy nhất 1 nhân sự', {
    tag: ['@high', '@major']
  }, async ({ personnelPage }) => {
    Logger.step(1, 'Tích chọn dòng nhân sự đầu tiên');
    await personnelPage.selectRow(0);

    Logger.step('Verify', 'Nút "Sửa", "Đặt lại mật khẩu", "Xóa" đều chuyển sang trạng thái kích hoạt');
    await expect(personnelPage.editPersonnelButton).not.toHaveClass(/disabled/);
    await expect(personnelPage.resetPasswordButton).not.toHaveClass(/disabled/);
    await expect(personnelPage.deletePersonnelButton).not.toHaveClass(/disabled/);

    Logger.step('Teardown', 'Bỏ chọn dòng nhân sự');
    await personnelPage.unselectRow(0);
  });

  test('TC_NS_007: Trạng thái các nút thao tác khi chọn từ 2 nhân sự trở lên', {
    tag: ['@high', '@major']
  }, async ({ personnelPage }) => {
    Logger.step(1, 'Tích chọn 2 dòng nhân sự liên tiếp');
    await personnelPage.selectRow(0);
    await personnelPage.selectRow(1);

    Logger.step('Verify', 'Nút "Sửa" bị vô hiệu hóa, nút "Đặt lại mật khẩu" và "Xóa" vẫn kích hoạt');
    await expect(personnelPage.editPersonnelButton).toHaveClass(/disabled/);
    await expect(personnelPage.resetPasswordButton).not.toHaveClass(/disabled/);
    await expect(personnelPage.deletePersonnelButton).not.toHaveClass(/disabled/);

    Logger.step('Teardown', 'Bỏ chọn cả 2 dòng');
    await personnelPage.unselectRow(0);
    await personnelPage.unselectRow(1);
  });

  test('TC_NS_008: Bỏ chọn dòng đưa các nút thao tác về trạng thái vô hiệu hóa ban đầu', {
    tag: ['@normal', '@minor']
  }, async ({ personnelPage }) => {
    Logger.step(1, 'Tích chọn rồi bỏ chọn dòng nhân sự đầu tiên');
    await personnelPage.selectRow(0);
    await expect(personnelPage.editPersonnelButton).not.toHaveClass(/disabled/);

    await personnelPage.unselectRow(0);

    Logger.step('Verify', 'Các nút quay về trạng thái vô hiệu hóa');
    await expect(personnelPage.editPersonnelButton).toHaveClass(/disabled/);
    await expect(personnelPage.resetPasswordButton).toHaveClass(/disabled/);
    await expect(personnelPage.deletePersonnelButton).toHaveClass(/disabled/);
  });

  test('TC_NS_009: Chọn tất cả các dòng qua checkbox trên header bảng', {
    tag: ['@normal', '@major']
  }, async ({ personnelPage }) => {
    Logger.step(1, 'Tích chọn ô "Chọn tất cả" trên header bảng');
    await personnelPage.selectAll();

    Logger.step('Verify', 'Dòng đầu tiên và dòng thứ 2 đều được tích chọn');
    await expect(personnelPage.firstRowCheckbox).toBeChecked();
    await expect(personnelPage.secondRowCheckbox).toBeChecked();
    await expect(personnelPage.deletePersonnelButton).not.toHaveClass(/disabled/);

    Logger.step('Teardown', 'Bỏ chọn tất cả');
    await personnelPage.unselectAll();
    await expect(personnelPage.firstRowCheckbox).not.toBeChecked();
  });

  // ==========================================
  // KHỐI 03: HỘP THOẠI THÊM MỚI NHÂN SỰ
  // ==========================================
  test('TC_NS_010: Mở và kiểm tra cấu trúc tiêu đề cùng thông báo tự tạo mã/mật khẩu', {
    tag: ['@normal', '@minor']
  }, async ({ personnelPage }) => {
    Logger.step(1, 'Nhấn nút "Thêm" trên thanh công cụ');
    await personnelPage.openAddModal();

    Logger.step('Verify', 'Hộp thoại hiển thị tiêu đề và thông báo hướng dẫn');
    await expect(personnelPage.addModal).toBeVisible();
    await expect(personnelPage.addModalTitle).toContainText('Thêm nhân sự');
    await expect(personnelPage.addModalNotice).toContainText('Mã số nhân sự và mật khẩu được hệ thống tự tạo khi lưu');

    Logger.step('Teardown', 'Đóng hộp thoại');
    await personnelPage.cancelAddModal();
    await expect(personnelPage.addModal).toBeHidden();
  });

  test('TC_NS_011: Đóng hộp thoại "Thêm nhân sự" bằng nút "Hủy"', {
    tag: ['@low', '@minor']
  }, async ({ personnelPage }) => {
    Logger.step(1, 'Mở hộp thoại Thêm nhân sự');
    await personnelPage.openAddModal();
    await expect(personnelPage.addModal).toBeVisible();

    Logger.step(2, 'Nhấn nút "Hủy" trên hộp thoại');
    await personnelPage.cancelAddModal();

    Logger.step('Verify', 'Hộp thoại được đóng lại');
    await expect(personnelPage.addModal).toBeHidden();
  });

  test('TC_NS_012: Đóng hộp thoại "Thêm nhân sự" bằng biểu tượng đóng [×]', {
    tag: ['@low', '@minor']
  }, async ({ personnelPage }) => {
    Logger.step(1, 'Mở hộp thoại Thêm nhân sự');
    await personnelPage.openAddModal();
    await expect(personnelPage.addModal).toBeVisible();

    Logger.step(2, 'Nhấn nút đóng [×]');
    await personnelPage.closeAddModal();

    Logger.step('Verify', 'Hộp thoại được đóng lại');
    await expect(personnelPage.addModal).toBeHidden();
  });

  // ==========================================
  // KHỐI 04: VALIDATION DỮ LIỆU THÊM MỚI NHÂN SỰ
  // ==========================================
  test('TC_NS_013: Bỏ trống toàn bộ các trường bắt buộc khi nhấn nút "Lưu"', {
    tag: ['@high', '@major']
  }, async ({ personnelPage }) => {
    Logger.step(1, 'Mở hộp thoại Thêm nhân sự');
    await personnelPage.openAddModal();

    Logger.step(2, 'Nhấn nút "Lưu" mà không điền thông tin');
    await personnelPage.submitAddForm();

    Logger.step('Verify', 'Hiển thị đầy đủ thông báo lỗi màu đỏ tại 9 trường bắt buộc');
    await expect(personnelPage.addModal).toContainText('Vui lòng nhập họ và tên.');
    await expect(personnelPage.addModal).toContainText('Vui lòng nhập email.');
    await expect(personnelPage.addModal).toContainText('Vui lòng chọn giới tính.');
    await expect(personnelPage.addModal).toContainText('Vui lòng chọn ngày sinh.');
    await expect(personnelPage.addModal).toContainText('Vui lòng nhập CCCD.');
    await expect(personnelPage.addModal).toContainText('Vui lòng nhập số điện thoại cá nhân.');
    await expect(personnelPage.addModal).toContainText('Vui lòng chọn phòng/ban.');
    await expect(personnelPage.addModal).toContainText('Vui lòng nhập chức vụ.');
    await expect(personnelPage.addModal).toContainText('Vui lòng chọn loại hợp đồng.');

    Logger.step('Teardown', 'Đóng hộp thoại');
    await personnelPage.cancelAddModal();
  });

  test('TC_NS_013_A: Kiểm tra thông báo lỗi khi thêm dòng Bằng cấp/chứng chỉ nhưng bỏ trống thông tin bắt buộc', {
    tag: ['@high', '@major']
  }, async ({ personnelPage }) => {
    Logger.step(1, 'Mở hộp thoại Thêm nhân sự');
    await personnelPage.openAddModal();

    Logger.step(2, 'Nhấn nút "+ Thêm bằng cấp/chứng chỉ"');
    await personnelPage.addQualificationRow();

    Logger.step(3, 'Nhấn nút "Lưu" mà không điền thông tin bằng cấp');
    await personnelPage.submitAddForm();

    Logger.step('Verify', 'Hiển thị lỗi bắt buộc tại dòng bằng cấp');
    await expect(personnelPage.addModal).toContainText('Vui lòng nhập tên bằng cấp hoặc chứng chỉ.');
    await expect(personnelPage.addModal).toContainText('Vui lòng chọn ngày cấp.');

    Logger.step('Teardown', 'Đóng hộp thoại');
    await personnelPage.cancelAddModal();
  });

  test('TC_NS_013_B: Kiểm tra thông báo lỗi khi thêm dòng Tài liệu khác nhưng bỏ trống tên tài liệu', {
    tag: ['@high', '@major']
  }, async ({ personnelPage }) => {
    Logger.step(1, 'Mở hộp thoại Thêm nhân sự');
    await personnelPage.openAddModal();

    Logger.step(2, 'Nhấn nút "+ Thêm tài liệu"');
    await personnelPage.addDocumentRow();

    Logger.step(3, 'Nhấn nút "Lưu" mà không điền tên tài liệu');
    await personnelPage.submitAddForm();

    Logger.step('Verify', 'Hiển thị lỗi bắt buộc tại dòng tài liệu');
    await expect(personnelPage.addModal).toContainText('Vui lòng nhập tên tài liệu.');

    Logger.step('Teardown', 'Đóng hộp thoại');
    await personnelPage.cancelAddModal();
  });

  test('TC_NS_013_C: Kiểm tra thông báo lỗi khi nhập Email không đúng định dạng', {
    tag: ['@high', '@major']
  }, async ({ personnelPage }) => {
    Logger.step(1, 'Mở hộp thoại Thêm nhân sự và nhập email sai định dạng');
    await personnelPage.openAddModal();
    await personnelPage.emailInput.fill('invalid-email-address');

    Logger.step(2, 'Nhấn nút "Lưu" để kích hoạt kiểm tra định dạng');
    await personnelPage.submitAddForm();

    Logger.step('Verify', 'Hiển thị câu cảnh báo lỗi định dạng email');
    await expect(personnelPage.addModal).toContainText('Email không đúng định dạng.');

    Logger.step('Teardown', 'Đóng hộp thoại');
    await personnelPage.cancelAddModal();
  });

  test('TC_NS_013_D: Kiểm tra thông báo lỗi khi nhập CCCD không đủ 12 chữ số', {
    tag: ['@high', '@major']
  }, async ({ personnelPage, page }) => {
    Logger.step(1, 'Mở hộp thoại Thêm nhân sự và điền các trường với CCCD dưới 12 chữ số');
    await personnelPage.openAddModal();
    await personnelPage.fillAddPersonnelForm({
      name: 'Test CCCD Validation',
      email: 'valid_cccd_test@vntest.vn',
      gender: 'male',
      citizenId: '001203456', // < 12 chữ số
      phone: '0981234567',
      department: '1',
      position: 'Kiểm nghiệm viên',
      contractType: 'fixed_term',
      status: 'working'
    });

    Logger.step(2, 'Nhấn nút "Lưu" để kích hoạt kiểm tra độ dài CCCD');
    await personnelPage.submitAddForm();

    Logger.step('Verify', 'Hiển thị câu cảnh báo lỗi CCCD phải gồm đúng 12 chữ số');
    await expect(personnelPage.addModal).toContainText('CCCD phải gồm đúng 12 chữ số.');

    Logger.step('Teardown', 'Đóng hộp thoại');
    await personnelPage.cancelAddModal();
  });

  // =========================================================================
  // CÁC TEST CASES MAX LENGTH (TẠM THỜI COMMENT DO ĐẶC TẢ HỆ THỐNG CHƯA NÊU RÕ)
  // =========================================================================
  // test('TC_NS_MAX_01: Nhập trường "Họ và tên" vượt quá giới hạn ký tự tối đa (256 ký tự)', async ({ personnelPage }) => {
  //   // TODO: Bật lại khi SRS đặc tả rõ maxlength của Họ và tên (ví dụ: 255 ký tự)
  //   await personnelPage.openAddModal();
  //   await personnelPage.nameInput.fill('A'.repeat(256));
  //   await personnelPage.submitAddForm();
  //   await expect(personnelPage.addModal.locator('.ns-add-error')).toContainText(/quá 255 ký tự/i);
  //   await personnelPage.cancelAddModal();
  // });
  //
  // test('TC_NS_MAX_02: Nhập trường "Chức vụ" vượt quá giới hạn ký tự tối đa (256 ký tự)', async ({ personnelPage }) => {
  //   // TODO: Bật lại khi SRS đặc tả rõ maxlength của Chức vụ (ví dụ: 255 ký tự)
  //   await personnelPage.openAddModal();
  //   await personnelPage.positionInput.fill('B'.repeat(256));
  //   await personnelPage.submitAddForm();
  //   await expect(personnelPage.addModal.locator('.ns-add-error')).toContainText(/quá 255 ký tự/i);
  //   await personnelPage.cancelAddModal();
  // });
  //
  // test('TC_NS_MAX_03: Nhập trường "Địa chỉ thường trú" vượt quá giới hạn ký tự tối đa (500 ký tự)', async ({ personnelPage }) => {
  //   // TODO: Bật lại khi SRS đặc tả rõ maxlength của Địa chỉ thường trú (ví dụ: 500 ký tự)
  //   await personnelPage.openAddModal();
  //   await personnelPage.permanentAddressTextarea.fill('C'.repeat(501));
  //   await personnelPage.submitAddForm();
  //   await expect(personnelPage.addModal.locator('.ns-add-error')).toContainText(/quá 500 ký tự/i);
  //   await personnelPage.cancelAddModal();
  // });

  test('TC_NS_014: Kiểm tra các trường thông tin bắt buộc phải có dấu sao đỏ', {
    tag: ['@normal', '@minor']
  }, async ({ personnelPage }) => {
    Logger.step(1, 'Mở hộp thoại Thêm nhân sự');
    await personnelPage.openAddModal();

    Logger.step('Verify', 'Các nhãn trường Họ tên, Email, Giới tính, Ngày sinh, CCCD, SĐT cá nhân, Phòng/ban, Chức vụ, Loại HĐ, Trạng thái có dấu *');
    await expect(personnelPage.addModal.locator('label[for="name"]')).toContainText('*');
    await expect(personnelPage.addModal.locator('label[for="email"]')).toContainText('*');
    await expect(personnelPage.addModal.locator('label[for="gender"]')).toContainText('*');
    await expect(personnelPage.addModal.locator('label[for="date-of-birth"]')).toContainText('*');
    await expect(personnelPage.addModal.locator('label[for="citizen-id"]')).toContainText('*');
    await expect(personnelPage.addModal.locator('label[for="personal-phone"]')).toContainText('*');
    await expect(personnelPage.addModal.locator('label[for="department"]')).toContainText('*');
    await expect(personnelPage.addModal.locator('label[for="position"]')).toContainText('*');
    await expect(personnelPage.addModal.locator('label[for="contract-type"]')).toContainText('*');
    await expect(personnelPage.addModal.locator('label[for="status"]')).toContainText('*');

    Logger.step('Teardown', 'Đóng hộp thoại');
    await personnelPage.cancelAddModal();
  });

  test('TC_NS_015: Thêm mới nhân sự thành công khi điền đầy đủ và hợp lệ các trường bắt buộc', {
    tag: ['@high', '@critical']
  }, async ({ personnelPage, page }) => {
    const ts = Date.now().toString().slice(-6);
    const testName = `QA Auto ${ts}`;
    const testEmail = `qa${ts}@vntest.vn`;
    const testCccd = `001203${ts}`;
    const testPhone = `0981${ts}`;

    Logger.step(1, 'Nhấn nút "Thêm" để mở hộp thoại thêm mới nhân sự');
    await personnelPage.openAddModal();
    await expect(personnelPage.addModal).toBeVisible();

    Logger.step(2, 'Điền đầy đủ và hợp lệ toàn bộ các trường bắt buộc');
    await personnelPage.fillAddPersonnelForm({
      name: testName,
      email: testEmail,
      gender: 'male',
      citizenId: testCccd,
      phone: testPhone,
      department: '1',
      position: 'Kiểm nghiệm viên',
      contractType: 'fixed_term',
      status: 'working'
    });

    Logger.step(3, 'Nhấn nút "Lưu" để tạo mới nhân sự');
    const createResPromise = page.waitForResponse(res => res.url().includes('api/users') && res.request().method() === 'POST');
    await personnelPage.submitAddForm();
    const createRes = await createResPromise;
    expect(createRes.status()).toBe(201);

    Logger.step('Verify', 'Hộp thoại đóng và bản ghi mới hiển thị trên danh sách kèm mã NS tự sinh');
    await expect(personnelPage.addModal).toBeHidden({ timeout: 8000 });

    await personnelPage.search(testName);
    const row = personnelPage.rows.first();
    await expect(row).toContainText(testName);
    await expect(row).toContainText(testEmail);
    await expect(row).toContainText(/NS-/i);

    Logger.step('Teardown', 'Dọn dẹp: Xóa nhân sự test vừa tạo');
    await row.locator('input[type="checkbox"]').check();
    await expect(personnelPage.deletePersonnelButton).not.toHaveClass(/disabled/);
    await personnelPage.openDeleteModal();
    await expect(personnelPage.deleteModal).toBeVisible();
    const deleteResPromise = page.waitForResponse(res => res.url().includes('api/users') && (res.request().method() === 'DELETE' || res.status() === 200));
    await personnelPage.confirmDelete();
    await deleteResPromise;
    await expect(personnelPage.deleteModal).toBeHidden();
    await personnelPage.clearSearch();
  });

  // ==========================================
  // KHỐI 05: HỘP THOẠI CHỈNH SỬA NHÂN SỰ
  // ==========================================
  test('TC_NS_016: Mở hộp thoại "Chỉnh sửa nhân sự" khi chọn 1 nhân sự và nhấn nút "Sửa"', {
    tag: ['@high', '@major']
  }, async ({ personnelPage }) => {
    Logger.step(1, 'Tích chọn dòng nhân sự đầu tiên');
    await personnelPage.selectRow(0);

    Logger.step(2, 'Nhấn nút "Sửa" trên thanh công cụ');
    await personnelPage.openEditModal();

    Logger.step('Verify', 'Hộp thoại chỉnh sửa nhân sự hiển thị đúng tiêu đề');
    await expect(personnelPage.editModal).toBeVisible();
    await expect(personnelPage.editModalTitle).toContainText('Chỉnh sửa nhân sự');

    Logger.step('Teardown', 'Đóng hộp thoại chỉnh sửa');
    await personnelPage.cancelEditModal();
    await personnelPage.unselectRow(0);
  });

  test('TC_NS_017: Kiểm tra trường "Mã NS" ở chế độ chỉ đọc (readonly) không thể sửa', {
    tag: ['@high', '@major']
  }, async ({ personnelPage }) => {
    Logger.step(1, 'Tích chọn dòng nhân sự đầu tiên và mở form Chỉnh sửa');
    await personnelPage.selectRow(0);
    await personnelPage.openEditModal();

    Logger.step('Verify', 'Trường Mã NS có thuộc tính readonly');
    await expect(personnelPage.editCodeInput).toBeVisible();
    await expect(personnelPage.editCodeInput).toHaveAttribute('readonly', '');

    Logger.step('Teardown', 'Đóng form chỉnh sửa');
    await personnelPage.cancelEditModal();
    await personnelPage.unselectRow(0);
  });

  test('TC_NS_018: Kiểm tra trường "Lý do chỉnh sửa chức vụ" bị vô hiệu hóa khi chưa đổi chức vụ', {
    tag: ['@normal', '@minor']
  }, async ({ personnelPage }) => {
    Logger.step(1, 'Tích chọn dòng nhân sự đầu tiên và mở form Chỉnh sửa');
    await personnelPage.selectRow(0);
    await personnelPage.openEditModal();

    Logger.step('Verify', 'Trường Lý do chỉnh sửa chức vụ bị vô hiệu hóa (disabled)');
    await expect(personnelPage.editPositionReasonInput).toBeVisible();
    await expect(personnelPage.editPositionReasonInput).toBeDisabled();

    Logger.step('Teardown', 'Đóng form chỉnh sửa');
    await personnelPage.cancelEditModal();
    await personnelPage.unselectRow(0);
  });

  test('TC_NS_019: Đóng hộp thoại "Chỉnh sửa nhân sự" bằng nút "Hủy"', {
    tag: ['@low', '@minor']
  }, async ({ personnelPage }) => {
    Logger.step(1, 'Tích chọn dòng và mở form Chỉnh sửa');
    await personnelPage.selectRow(0);
    await personnelPage.openEditModal();
    await expect(personnelPage.editModal).toBeVisible();

    Logger.step(2, 'Nhấn nút "Hủy" trên form');
    await personnelPage.cancelEditModal();

    Logger.step('Verify', 'Hộp thoại chỉnh sửa được đóng lại');
    await expect(personnelPage.editModal).toBeHidden();

    Logger.step('Teardown', 'Bỏ chọn dòng');
    await personnelPage.unselectRow(0);
  });

  test('TC_NS_028: Chỉnh sửa thông tin nhân sự thành công và kiểm tra hiển thị đồng bộ tại danh sách và drawer chi tiết', {
    tag: ['@high', '@critical']
  }, async ({ personnelPage, page }) => {
    const ts = Date.now().toString().slice(-6);
    const testName = `QA Edit ${ts}`;
    const testEmail = `qa_edit${ts}@vntest.vn`;
    const testCccd = `001204${ts}`;
    const testPhone = `0982${ts}`;
    const updatedPhone = `0983${ts}`;

    Logger.step('Setup', 'Tạo 1 nhân sự test để chuẩn bị chỉnh sửa');
    await personnelPage.openAddModal();
    await personnelPage.fillAddPersonnelForm({
      name: testName,
      email: testEmail,
      gender: 'female',
      citizenId: testCccd,
      phone: testPhone,
      department: '1',
      position: 'Chuyên viên QA',
      contractType: 'fixed_term',
      status: 'working'
    });
    const createResPromise = page.waitForResponse(res => res.url().includes('api/users') && res.request().method() === 'POST');
    await personnelPage.submitAddForm();
    await createResPromise;
    await expect(personnelPage.addModal).toBeHidden();

    Logger.step(1, 'Tìm kiếm và chọn nhân sự test vừa tạo');
    await personnelPage.search(testName);
    const row = personnelPage.rows.first();
    await expect(row).toContainText(testName);
    await row.locator('input[type="checkbox"]').check();

    Logger.step(2, 'Nhấn nút "Sửa" và cập nhật số điện thoại cá nhân mới');
    await expect(personnelPage.editPersonnelButton).not.toHaveClass(/disabled/);
    await personnelPage.openEditModal();
    await expect(personnelPage.editModal).toBeVisible();
    await personnelPage.fillEditPersonnelForm({ phone: updatedPhone });

    Logger.step(3, 'Nhấn nút "Lưu" trên form chỉnh sửa');
    const updateResPromise = page.waitForResponse(res => res.url().includes('api/users/') && res.request().method() === 'POST');
    await personnelPage.submitEditForm();
    const updateRes = await updateResPromise;
    expect(updateRes.status()).toBe(200);
    await expect(personnelPage.editModal).toBeHidden();

    Logger.step('Verify 1', 'Số điện thoại mới hiển thị cập nhật ngay trên dòng danh sách');
    await expect(row).toContainText(updatedPhone);

    Logger.step('Verify 2', 'Mở ngăn Chi tiết nhân sự (drawer) và kiểm tra thông tin đồng bộ');
    await row.locator('button.px-view-button, button:has(svg.lucide-eye)').click();
    await page.waitForSelector('.ns-detail-info-body', { timeout: 10000 });
    await expect(personnelPage.detailDrawer).toContainText(testName);
    await expect(personnelPage.detailDrawer).toContainText(updatedPhone);
    await personnelPage.closeDetail();

    Logger.step('Teardown', 'Dọn dẹp: Xóa nhân sự test');
    if (!await row.locator('input[type="checkbox"]').isChecked()) {
      await row.locator('input[type="checkbox"]').check();
    }
    await expect(personnelPage.deletePersonnelButton).not.toHaveClass(/disabled/);
    await personnelPage.openDeleteModal();
    await expect(personnelPage.deleteModal).toBeVisible();
    const deleteResPromise = page.waitForResponse(res => res.url().includes('api/users') && (res.request().method() === 'DELETE' || res.status() === 200));
    await personnelPage.confirmDelete();
    await deleteResPromise;
    await expect(personnelPage.deleteModal).toBeHidden();
    await personnelPage.clearSearch();
  });

  // ==========================================
  // KHỐI 06: HỘP THOẠI XÁC NHẬN ĐẶT LẠI MẬT KHẨU
  // ==========================================
  test('TC_NS_020: Mở hộp thoại "Xác nhận đặt lại mật khẩu" khi chọn nhân sự', {
    tag: ['@high', '@major']
  }, async ({ personnelPage }) => {
    Logger.step(1, 'Tích chọn dòng nhân sự đầu tiên');
    await personnelPage.selectRow(0);

    Logger.step(2, 'Nhấn nút "Đặt lại mật khẩu"');
    await personnelPage.openResetPasswordModal();

    Logger.step('Verify', 'Hộp thoại xác nhận đặt lại mật khẩu hiển thị tiêu đề và thông báo');
    await expect(personnelPage.resetPasswordModal).toBeVisible();
    await expect(personnelPage.resetPasswordModalTitle).toContainText('Xác nhận đặt lại mật khẩu');
    await expect(personnelPage.resetPasswordModalInfo).toContainText('Mật khẩu mới sẽ được tạo và gửi qua email cho 1 nhân sự');

    Logger.step('Teardown', 'Đóng hộp thoại');
    await personnelPage.cancelResetPasswordModal();
    await personnelPage.unselectRow(0);
  });

  test('TC_NS_021: Đóng hộp thoại "Xác nhận đặt lại mật khẩu" bằng nút "Hủy"', {
    tag: ['@low', '@minor']
  }, async ({ personnelPage }) => {
    Logger.step(1, 'Tích chọn dòng và mở hộp thoại đặt lại mật khẩu');
    await personnelPage.selectRow(0);
    await personnelPage.openResetPasswordModal();
    await expect(personnelPage.resetPasswordModal).toBeVisible();

    Logger.step(2, 'Nhấn nút "Hủy"');
    await personnelPage.cancelResetPasswordModal();

    Logger.step('Verify', 'Hộp thoại xác nhận được đóng');
    await expect(personnelPage.resetPasswordModal).toBeHidden();

    Logger.step('Teardown', 'Bỏ chọn dòng');
    await personnelPage.unselectRow(0);
  });

  test('TC_NS_029: Xác nhận "Đặt lại mật khẩu" nhân sự thành công', {
    tag: ['@high', '@major']
  }, async ({ personnelPage, page }) => {
    const ts = Date.now().toString().slice(-6);
    const testName = `QA Reset ${ts}`;
    const testEmail = `qa_reset${ts}@vntest.vn`;
    const testCccd = `001205${ts}`;
    const testPhone = `0984${ts}`;

    Logger.step('Setup', 'Tạo 1 nhân sự test để chuẩn bị đặt lại mật khẩu');
    await personnelPage.openAddModal();
    await personnelPage.fillAddPersonnelForm({
      name: testName,
      email: testEmail,
      gender: 'male',
      citizenId: testCccd,
      phone: testPhone,
      department: '1',
      position: 'Kỹ thuật viên',
      contractType: 'fixed_term',
      status: 'working'
    });
    const createResPromise = page.waitForResponse(res => res.url().includes('api/users') && res.request().method() === 'POST');
    await personnelPage.submitAddForm();
    await createResPromise;
    await expect(personnelPage.addModal).toBeHidden();

    Logger.step(1, 'Tìm kiếm và chọn nhân sự');
    await personnelPage.search(testName);
    const row = personnelPage.rows.first();
    await expect(row).toContainText(testName);
    await row.locator('input[type="checkbox"]').check();

    Logger.step(2, 'Nhấn nút "Đặt lại mật khẩu" để mở popup xác nhận');
    await expect(personnelPage.resetPasswordButton).not.toHaveClass(/disabled/);
    await personnelPage.openResetPasswordModal();
    await expect(personnelPage.resetPasswordModal).toBeVisible();

    Logger.step(3, 'Nhấn nút "Đặt lại mật khẩu" trong popup xác nhận');
    const resetResPromise = page.waitForResponse(res => res.url().includes('reset-password') || res.url().includes('password') || (res.request().method() === 'POST' && res.url().includes('api/users')));
    await personnelPage.confirmResetPassword();
    const resetRes = await resetResPromise;
    expect(resetRes.status()).toBe(200);

    Logger.step('Verify', 'Popup xác nhận đặt lại mật khẩu đóng lại');
    await expect(personnelPage.resetPasswordModal).toBeHidden();

    Logger.step('Teardown', 'Dọn dẹp: Xóa nhân sự test');
    if (!await row.locator('input[type="checkbox"]').isChecked()) {
      await row.locator('input[type="checkbox"]').check();
    }
    await expect(personnelPage.deletePersonnelButton).not.toHaveClass(/disabled/);
    await personnelPage.openDeleteModal();
    await expect(personnelPage.deleteModal).toBeVisible();
    const deleteResPromise = page.waitForResponse(res => res.url().includes('api/users') && (res.request().method() === 'DELETE' || res.status() === 200));
    await personnelPage.confirmDelete();
    await deleteResPromise;
    await expect(personnelPage.deleteModal).toBeHidden();
    await personnelPage.clearSearch();
  });

  // ==========================================
  // KHỐI 07: HỘP THOẠI XÁC NHẬN XÓA NHÂN SỰ
  // ==========================================
  test('TC_NS_022: Mở hộp thoại "Xác nhận xóa nhân sự" khi chọn nhân sự và nhấn "Xóa"', {
    tag: ['@high', '@critical']
  }, async ({ personnelPage }) => {
    Logger.step(1, 'Tích chọn dòng nhân sự đầu tiên');
    await personnelPage.selectRow(0);

    Logger.step(2, 'Nhấn nút "Xóa" trên thanh công cụ');
    await personnelPage.openDeleteModal();

    Logger.step('Verify', 'Hộp thoại xác nhận xóa hiển thị tiêu đề, cảnh báo không thể hoàn tác');
    await expect(personnelPage.deleteModal).toBeVisible();
    await expect(personnelPage.deleteModalTitle).toContainText('Xác nhận xóa nhân sự');
    await expect(personnelPage.deleteModalInfo).toContainText('Bạn sắp xóa 1 nhân sự. Thao tác này không thể hoàn tác.');
    await expect(personnelPage.deleteModalConfirmButton).toContainText(/xóa 1 nhân sự/i);

    Logger.step('Teardown', 'Đóng hộp thoại xác nhận');
    await personnelPage.cancelDeleteModal();
    await personnelPage.unselectRow(0);
  });

  test('TC_NS_023: Đóng hộp thoại "Xác nhận xóa nhân sự" bằng nút "Hủy"', {
    tag: ['@low', '@minor']
  }, async ({ personnelPage }) => {
    Logger.step(1, 'Tích chọn dòng và mở hộp thoại xóa');
    await personnelPage.selectRow(0);
    await personnelPage.openDeleteModal();
    await expect(personnelPage.deleteModal).toBeVisible();

    Logger.step(2, 'Nhấn nút "Hủy"');
    await personnelPage.cancelDeleteModal();

    Logger.step('Verify', 'Hộp thoại xác nhận xóa được đóng lại an toàn');
    await expect(personnelPage.deleteModal).toBeHidden();

    Logger.step('Teardown', 'Bỏ chọn dòng');
    await personnelPage.unselectRow(0);
  });

  test('TC_NS_030: Xác nhận "Xóa 1 nhân sự" thành công và kiểm tra bản ghi bị loại bỏ khỏi hệ thống', {
    tag: ['@high', '@critical']
  }, async ({ personnelPage, page }) => {
    const ts = Date.now().toString().slice(-6);
    const testName = `QA Del ${ts}`;
    const testEmail = `qa_del${ts}@vntest.vn`;
    const testCccd = `001206${ts}`;
    const testPhone = `0985${ts}`;

    Logger.step('Setup', 'Tạo 1 nhân sự test để chuẩn bị kiểm thử thao tác xóa');
    await personnelPage.openAddModal();
    await personnelPage.fillAddPersonnelForm({
      name: testName,
      email: testEmail,
      gender: 'female',
      citizenId: testCccd,
      phone: testPhone,
      department: '1',
      position: 'Thử nghiệm viên',
      contractType: 'probation',
      status: 'probation'
    });
    const createResPromise = page.waitForResponse(res => res.url().includes('api/users') && res.request().method() === 'POST');
    await personnelPage.submitAddForm();
    await createResPromise;
    await expect(personnelPage.addModal).toBeHidden();

    Logger.step(1, 'Tìm kiếm nhân sự test và tích chọn');
    await personnelPage.search(testName);
    const row = personnelPage.rows.first();
    await expect(row).toContainText(testName);
    await row.locator('input[type="checkbox"]').check();

    Logger.step(2, 'Nhấn nút "Xóa" trên thanh công cụ');
    await expect(personnelPage.deletePersonnelButton).not.toHaveClass(/disabled/);
    await personnelPage.openDeleteModal();
    await expect(personnelPage.deleteModal).toBeVisible();

    Logger.step(3, 'Nhấn nút "Xóa 1 nhân sự" trong popup xác nhận');
    const deleteResPromise = page.waitForResponse(res => res.url().includes('api/users') && (res.request().method() === 'DELETE' || res.status() === 200));
    await personnelPage.confirmDelete();
    const deleteRes = await deleteResPromise;
    expect(deleteRes.status()).toBe(200);

    Logger.step('Verify', 'Popup đóng lại và bản ghi biến mất hoàn toàn khỏi danh sách');
    await expect(personnelPage.deleteModal).toBeHidden();
    await expect(personnelPage.table.locator('tbody')).not.toContainText(testName);
    await personnelPage.clearSearch();
  });

  // ==========================================
  // KHỐI 08: NGĂN CHI TIẾT NHÂN SỰ & HIỂN THỊ DỮ LIỆU (DETAIL DRAWER)
  // ==========================================
  test('TC_NS_024: Mở ngăn chi tiết nhân sự khi nhấn biểu tượng mắt (view) trên dòng', {
    tag: ['@high', '@major']
  }, async ({ personnelPage }) => {
    Logger.step(1, 'Nhấn biểu tượng xem chi tiết (mắt) tại dòng đầu tiên');
    await personnelPage.openDetail(0);

    Logger.step('Verify', 'Ngăn chi tiết nhân sự hiển thị đầy đủ các phần thông tin');
    await expect(personnelPage.detailDrawer).toBeVisible();
    await expect(personnelPage.detailDrawerContent).toContainText('Thông tin cá nhân');
    await expect(personnelPage.detailDrawerContent).toContainText('Thông tin công việc');

    Logger.step('Teardown', 'Đóng ngăn chi tiết');
    await personnelPage.closeDetail();
  });

  test('TC_NS_031: Kiểm tra bố cục đầy đủ của Drawer Chi tiết: Header, 2 Tab và 4 nút tác vụ chân trang', {
    tag: ['@normal', '@major']
  }, async ({ personnelPage }) => {
    Logger.step(1, 'Nhấn biểu tượng xem chi tiết (mắt) tại dòng đầu tiên');
    await personnelPage.openDetail(0);

    Logger.step('Verify 1', 'Header Drawer hiển thị đầy đủ Avatar, Tên, Badge trạng thái, Mã NS, Chức vụ, Phòng/ban');
    await expect(personnelPage.detailAvatar).toBeVisible();
    await expect(personnelPage.detailTitleName).toBeVisible();
    await expect(personnelPage.detailStatusBadge).toBeVisible();
    await expect(personnelPage.detailMetaCode).toContainText(/NS-/i);
    await expect(personnelPage.detailHeaderCloseButton).toBeVisible();

    Logger.step('Verify 2', 'Thanh điều hướng hiển thị đủ 2 tab: "Thông tin" và "Lịch sử"');
    await expect(personnelPage.detailInfoTab).toBeVisible();
    await expect(personnelPage.detailInfoTab).toHaveClass(/active/);
    await expect(personnelPage.detailHistoryTab).toBeVisible();

    Logger.step('Verify 3', 'Chân Drawer (Footer) hiển thị đầy đủ 4 nút tác vụ');
    await expect(personnelPage.detailDeleteButton).toBeVisible();
    await expect(personnelPage.detailResetPasswordButton).toBeVisible();
    await expect(personnelPage.detailEditButton).toBeVisible();
    await expect(personnelPage.detailFooterCloseButton).toBeVisible();

    Logger.step('Teardown', 'Đóng Drawer bằng nút "Đóng" ở chân trang');
    await personnelPage.detailFooterCloseButton.click();
    await expect(personnelPage.detailDrawer).not.toHaveClass(/open/);
  });

  test('TC_NS_032: Kiểm tra chuyển đổi qua lại giữa Tab "Thông tin" và Tab "Lịch sử" trong Drawer', {
    tag: ['@normal', '@major']
  }, async ({ personnelPage }) => {
    Logger.step(1, 'Mở Drawer chi tiết nhân sự');
    await personnelPage.openDetail(0);
    await expect(personnelPage.detailInfoTab).toHaveClass(/active/);

    Logger.step(2, 'Nhấn chọn Tab "Lịch sử"');
    await personnelPage.switchToHistoryTab();

    Logger.step('Verify 1', 'Tab "Lịch sử" ở trạng thái active và hiển thị 2 khối: Lịch sử chức vụ & Lịch sử thay đổi thông tin');
    await expect(personnelPage.detailHistoryTab).toHaveClass(/active/);
    await expect(personnelPage.detailPositionHistorySec).toBeVisible();
    await expect(personnelPage.detailInfoHistorySec).toBeVisible();

    Logger.step(3, 'Nhấn chọn lại Tab "Thông tin"');
    await personnelPage.switchToInfoTab();

    Logger.step('Verify 2', 'Tab "Thông tin" kích hoạt trở lại và hiển thị nội dung hồ sơ nhân sự');
    await expect(personnelPage.detailInfoTab).toHaveClass(/active/);
    await expect(personnelPage.detailInfoBody).toBeVisible();

    Logger.step('Teardown', 'Đóng Drawer');
    await personnelPage.closeDetail();
  });

  test('TC_NS_041: Kiểm tra hiển thị dấu gạch ngang "—" cho toàn bộ các trường để trống trong Drawer', {
    tag: ['@high', '@major']
  }, async ({ personnelPage, page }) => {
    const ts = Date.now().toString().slice(-6);
    const testName = `QA Empty ${ts}`;
    const testEmail = `qaempty${ts}@vntest.vn`;
    const testCccd = `001208${ts}`;
    const testPhone = `0987${ts}`;

    Logger.step('Setup', 'Tạo 1 nhân sự test chỉ điền các trường bắt buộc');
    await personnelPage.openAddModal();
    await personnelPage.fillAddPersonnelForm({
      name: testName,
      email: testEmail,
      gender: 'male',
      citizenId: testCccd,
      phone: testPhone,
      department: '1',
      position: 'Kỹ thuật viên',
      contractType: 'fixed_term',
      status: 'working'
    });
    const createResPromise = page.waitForResponse(res => res.url().includes('api/users') && res.request().method() === 'POST');
    await personnelPage.submitAddForm();
    await createResPromise;
    await expect(personnelPage.addModal).toBeHidden();

    Logger.step(1, 'Tìm kiếm nhân sự test vừa tạo và mở Drawer Chi tiết');
    await personnelPage.search(testName);
    const row = personnelPage.rows.first();
    await row.locator('button.px-view-button, button:has(svg.lucide-eye)').click();
    await page.waitForSelector('.ns-detail-drawer.open', { timeout: 10000 });

    Logger.step('Verify', 'Các trường không bắt buộc đều hiển thị ký tự gạch ngang "—"');
    const emptyFields = [
      'Ngày cấp',
      'Nơi cấp',
      'Số điện thoại do VNTEST cấp',
      'Địa chỉ thường trú',
      'Số tài khoản',
      'Ngân hàng',
      'Số điện thoại người thân',
      'Quan hệ',
      'Kiêm nhiệm',
      'Ngày thử việc',
      'Ngày vào chính thức',
      'Ngày chấm dứt hợp đồng',
      'Chuyên ngành',
      'Mã số BHXH',
      'Mã số thuế cá nhân',
      'Mã BHYT'
    ];
    for (const field of emptyFields) {
      const val = await personnelPage.getDetailFieldValue(field);
      expect(val).toBe('—');
    }

    Logger.step('Teardown', 'Đóng Drawer và xóa nhân sự test');
    await personnelPage.closeDetail();
    await row.locator('input[type="checkbox"]').check();
    await personnelPage.openDeleteModal();
    const deleteResPromise = page.waitForResponse(res => res.url().includes('api/users') && (res.request().method() === 'DELETE' || res.status() === 200));
    await personnelPage.confirmDelete();
    await deleteResPromise;
    await expect(personnelPage.deleteModal).toBeHidden();
    await personnelPage.clearSearch();
  });

  test('TC_NS_042: Kiểm tra hiển thị đầy đủ và chính xác tất cả các trường khi có dữ liệu trong Drawer', {
    tag: ['@high', '@major']
  }, async ({ personnelPage, page }) => {
    const ts = Date.now().toString().slice(-6);
    const testName = `QA Full ${ts}`;
    const testEmail = `qafull${ts}@vntest.vn`;
    const testCccd = `001209${ts}`;
    const testPhone = `0988${ts}`;
    const companyPhone = `0243${ts}`;
    const address = `123 Phố Test, Hà Nội`;
    const bankAccount = `1903345${ts}`;
    const bankName = `Techcombank`;
    const emergencyPhone = `0912${ts}`;
    const emergencyRelation = `Mẹ`;
    const concurrentPos = `Phó phòng`;
    const socialInsurance = `BH${ts}`;
    const specialty = `Hóa phân tích`;

    Logger.step('Setup', 'Tạo 1 nhân sự test điền đầy đủ cả trường bắt buộc và trường tùy chọn');
    await personnelPage.openAddModal();
    await personnelPage.fillAddPersonnelForm({
      name: testName,
      email: testEmail,
      gender: 'female',
      citizenId: testCccd,
      phone: testPhone,
      department: '1',
      position: 'Kiểm nghiệm viên',
      contractType: 'fixed_term',
      status: 'working',
      companyPhone,
      permanentAddress: address,
      bankAccount,
      bankName,
      emergencyPhone,
      emergencyRelation,
      concurrentPosition: concurrentPos,
      socialInsurance,
      specialty
    });
    const createResPromise = page.waitForResponse(res => res.url().includes('api/users') && res.request().method() === 'POST');
    await personnelPage.submitAddForm();
    await createResPromise;
    await expect(personnelPage.addModal).toBeHidden();

    Logger.step(1, 'Tìm kiếm nhân sự test vừa tạo và mở Drawer Chi tiết');
    await personnelPage.search(testName);
    const row = personnelPage.rows.first();
    await row.locator('button.px-view-button, button:has(svg.lucide-eye)').click();
    await page.waitForSelector('.ns-detail-drawer.open', { timeout: 10000 });

    Logger.step('Verify', 'Các trường dữ liệu đều hiển thị đúng giá trị đã nhập');
    expect(await personnelPage.getDetailFieldValue('Họ và tên')).toBe(testName);
    expect(await personnelPage.getDetailFieldValue('Giới tính')).toBe('Nữ');
    expect(await personnelPage.getDetailFieldValue('Số điện thoại do VNTEST cấp')).toBe(companyPhone);
    expect(await personnelPage.getDetailFieldValue('Địa chỉ thường trú')).toBe(address);
    expect(await personnelPage.getDetailFieldValue('Số tài khoản')).toBe(bankAccount);
    expect(await personnelPage.getDetailFieldValue('Ngân hàng')).toBe(bankName);
    expect(await personnelPage.getDetailFieldValue('Số điện thoại người thân')).toBe(emergencyPhone);
    expect(await personnelPage.getDetailFieldValue('Quan hệ')).toBe(emergencyRelation);
    expect(await personnelPage.getDetailFieldValue('Kiêm nhiệm')).toBe(concurrentPos);
    expect(await personnelPage.getDetailFieldValue('Mã số BHXH')).toBe(socialInsurance);
    expect(await personnelPage.getDetailFieldValue('Chuyên ngành')).toBe(specialty);

    Logger.step('Teardown', 'Đóng Drawer và xóa nhân sự test');
    await personnelPage.closeDetail();
    await row.locator('input[type="checkbox"]').check();
    await personnelPage.openDeleteModal();
    const deleteResPromise = page.waitForResponse(res => res.url().includes('api/users') && (res.request().method() === 'DELETE' || res.status() === 200));
    await personnelPage.confirmDelete();
    await deleteResPromise;
    await expect(personnelPage.deleteModal).toBeHidden();
    await personnelPage.clearSearch();
  });

  // ==========================================
  // KHỐI 09: TAB LỊCH SỬ & NHẬT KÝ KIỂM TOÁN (AUDIT LOG)
  // ==========================================
  test('TC_NS_033: Cập nhật thông tin nhân sự và kiểm tra ghi nhận tại Tab "Lịch sử"', {
    tag: ['@high', '@critical']
  }, async ({ personnelPage, page }) => {
    const ts = Date.now().toString().slice(-6);
    const testName = `QA Log ${ts}`;
    const testEmail = `qalog${ts}@vntest.vn`;
    const testCccd = `001210${ts}`;
    const testPhone = `0971${ts}`;
    const updatedPhone = `0972${ts}`;

    Logger.step('Setup', 'Tạo 1 nhân sự test để chuẩn bị sửa thông tin');
    await personnelPage.openAddModal();
    await personnelPage.fillAddPersonnelForm({
      name: testName,
      email: testEmail,
      gender: 'male',
      citizenId: testCccd,
      phone: testPhone,
      department: '1',
      position: 'Kỹ thuật viên',
      contractType: 'fixed_term',
      status: 'working'
    });
    const createResPromise = page.waitForResponse(res => res.url().includes('api/users') && res.request().method() === 'POST');
    await personnelPage.submitAddForm();
    await createResPromise;

    Logger.step(1, 'Tìm kiếm nhân sự test và cập nhật số điện thoại cá nhân mới');
    await personnelPage.search(testName);
    const row = personnelPage.rows.first();
    await row.locator('input[type="checkbox"]').check();
    await personnelPage.openEditModal();
    await personnelPage.fillEditPersonnelForm({ phone: updatedPhone });
    const updateResPromise = page.waitForResponse(res => res.url().includes('api/users/') && res.request().method() === 'POST');
    await personnelPage.submitEditForm();
    await updateResPromise;

    Logger.step('Verify 1', 'Số điện thoại mới hiển thị cập nhật ngay trên dòng danh sách');
    await expect(row).toContainText(updatedPhone);

    Logger.step(2, 'Mở Drawer Chi tiết nhân sự');
    await row.locator('button.px-view-button, button:has(svg.lucide-eye)').click();
    await page.waitForSelector('.ns-detail-drawer.open', { timeout: 10000 });

    Logger.step('Verify 2', 'Tab "Thông tin" hiển thị đúng Số điện thoại cá nhân mới');
    expect(await personnelPage.getDetailFieldValue('Số điện thoại cá nhân')).toBe(updatedPhone);

    Logger.step(3, 'Chuyển sang Tab "Lịch sử"');
    await personnelPage.switchToHistoryTab();

    Logger.step('Verify 3', 'Tab "Lịch sử" ghi nhận sự kiện cập nhật của tài khoản Admin User');
    await expect(personnelPage.detailInfoHistorySec).toContainText('Admin User');

    Logger.step('Teardown', 'Đóng Drawer và xóa nhân sự test');
    await personnelPage.closeDetail();
    if (!await row.locator('input[type="checkbox"]').isChecked()) {
      await row.locator('input[type="checkbox"]').check();
    }
    await personnelPage.openDeleteModal();
    const deleteResPromise = page.waitForResponse(res => res.url().includes('api/users') && (res.request().method() === 'DELETE' || res.status() === 200));
    await personnelPage.confirmDelete();
    await deleteResPromise;
    await personnelPage.clearSearch();
  });

  test('TC_NS_034: Thay đổi chức vụ kèm lý do giải trình và kiểm tra ghi nhận chính xác tại khối "Lịch sử chức vụ"', {
    tag: ['@high', '@critical']
  }, async ({ personnelPage, page }) => {
    const ts = Date.now().toString().slice(-6);
    const testName = `QA Role ${ts}`;
    const testEmail = `qarole${ts}@vntest.vn`;
    const testCccd = `001211${ts}`;
    const testPhone = `0973${ts}`;
    const initialPosition = 'Kiểm nghiệm viên';
    const newPosition = 'Kỹ thuật viên cao cấp';
    const roleReason = `Thăng chức định kỳ đợt ${ts}`;

    Logger.step('Setup', 'Tạo 1 nhân sự test với chức vụ ban đầu là "Kiểm nghiệm viên"');
    await personnelPage.openAddModal();
    await personnelPage.fillAddPersonnelForm({
      name: testName,
      email: testEmail,
      gender: 'male',
      citizenId: testCccd,
      phone: testPhone,
      department: '1',
      position: initialPosition,
      contractType: 'fixed_term',
      status: 'working'
    });
    const createResPromise = page.waitForResponse(res => res.url().includes('api/users') && res.request().method() === 'POST');
    await personnelPage.submitAddForm();
    await createResPromise;

    Logger.step(1, 'Tìm kiếm nhân sự test và mở hộp thoại Chỉnh sửa');
    await personnelPage.search(testName);
    const row = personnelPage.rows.first();
    await row.locator('input[type="checkbox"]').check();
    await personnelPage.openEditModal();

    Logger.step(2, 'Đổi Chức vụ sang mới và nhập Lý do chỉnh sửa chức vụ');
    await personnelPage.fillEditPersonnelForm({
      position: newPosition,
      positionChangeReason: roleReason
    });
    const updateResPromise = page.waitForResponse(res => res.url().includes('api/users/') && res.request().method() === 'POST');
    await personnelPage.submitEditForm();
    await updateResPromise;

    Logger.step('Verify 1', 'Màn hình danh sách cập nhật ngay Chức vụ mới');
    await expect(row).toContainText(newPosition);

    Logger.step(3, 'Mở Drawer Chi tiết nhân sự và chuyển sang Tab "Lịch sử"');
    await row.locator('button.px-view-button, button:has(svg.lucide-eye)').click();
    await page.waitForSelector('.ns-detail-drawer.open', { timeout: 10000 });
    await personnelPage.switchToHistoryTab();

    Logger.step('Verify 2', 'Khối "Lịch sử chức vụ" ghi nhận chức vụ mới và lý do giải trình');
    await expect(personnelPage.detailPositionHistorySec).toContainText(newPosition);
    await expect(personnelPage.detailPositionHistorySec).toContainText(roleReason);

    Logger.step('Teardown', 'Đóng Drawer và xóa nhân sự test');
    await personnelPage.closeDetail();
    if (!await row.locator('input[type="checkbox"]').isChecked()) {
      await row.locator('input[type="checkbox"]').check();
    }
    await personnelPage.openDeleteModal();
    const deleteResPromise = page.waitForResponse(res => res.url().includes('api/users') && (res.request().method() === 'DELETE' || res.status() === 200));
    await personnelPage.confirmDelete();
    await deleteResPromise;
    await personnelPage.clearSearch();
  });

  // ==========================================
  // KHỐI 10: TÌM KIẾM & BỘ LỌC DANH SÁCH (SEARCH & STATUS FILTER)
  // ==========================================
  test('TC_NS_025: Nhập từ khóa tìm kiếm nhân sự và kiểm tra kích hoạt nút "Hủy"', {
    tag: ['@normal', '@major']
  }, async ({ personnelPage }) => {
    Logger.step(1, 'Nhập từ khóa tìm kiếm vào ô');
    await personnelPage.searchInput.fill('Hoàng Đình Thái');

    Logger.step('Verify', 'Nút "Hủy" tìm kiếm được kích hoạt');
    await expect(personnelPage.clearSearchButton).toBeEnabled();

    Logger.step(2, 'Nhấn nút "Hủy" để xóa từ khóa');
    await personnelPage.clearSearch();

    Logger.step('Verify', 'Ô tìm kiếm trống và nút "Hủy" bị vô hiệu hóa trở lại');
    await expect(personnelPage.searchInput).toHaveValue('');
    await expect(personnelPage.clearSearchButton).toBeDisabled();
  });

  test('TC_NS_026: Lọc theo danh mục chip Phòng/ban 1 và quay lại Tất cả', {
    tag: ['@normal', '@major']
  }, async ({ personnelPage }) => {
    Logger.step(1, 'Nhấn chọn chip "Phòng/ban 1"');
    await personnelPage.filterByDepartmentChip('dept1');

    Logger.step('Verify', 'Chip Phòng/ban 1 có trạng thái kích hoạt (active)');
    await expect(personnelPage.dept1Chip).toHaveClass(/active/);

    Logger.step(2, 'Nhấn chọn lại chip "Tất cả"');
    await personnelPage.filterByDepartmentChip('all');

    Logger.step('Verify', 'Chip Tất cả có trạng thái kích hoạt (active)');
    await expect(personnelPage.deptAllChip).toHaveClass(/active/);
  });

  test('TC_NS_035: Mở dropdown bộ lọc trạng thái và kiểm tra đầy đủ 6 tùy chọn', {
    tag: ['@normal', '@major']
  }, async ({ personnelPage }) => {
    Logger.step(1, 'Nhấn vào nút dropdown TT: Tất cả');
    await personnelPage.openStatusFilter();

    Logger.step('Verify', 'Popover mở ra hiển thị đúng 6 tùy chọn trạng thái và tùy chọn "Tất cả" đang active');
    await expect(personnelPage.statusFilterPopover).toBeVisible();
    await expect(personnelPage.statusOptions).toHaveCount(6);
    await expect(personnelPage.statusOptions.filter({ hasText: /^Tất cả$/ })).toHaveClass(/is-active/);
    await expect(personnelPage.statusOptions.filter({ hasText: /^Thử việc$/ })).toBeVisible();
    await expect(personnelPage.statusOptions.filter({ hasText: /^Đang làm việc$/ })).toBeVisible();
    await expect(personnelPage.statusOptions.filter({ hasText: /^Nghỉ phép dài hạn$/ })).toBeVisible();
    await expect(personnelPage.statusOptions.filter({ hasText: /^Đã nghỉ việc$/ })).toBeVisible();
    await expect(personnelPage.statusOptions.filter({ hasText: /^Đã chấm dứt HĐLĐ$/ })).toBeVisible();

    Logger.step('Teardown', 'Đóng popover');
    await personnelPage.statusFilterDropdown.click();
  });

  test('TC_NS_036: Lọc danh sách nhân sự theo trạng thái "Đang làm việc"', {
    tag: ['@high', '@major']
  }, async ({ personnelPage }) => {
    Logger.step(1, 'Chọn trạng thái "Đang làm việc" trong dropdown lọc');
    await personnelPage.selectStatusFilter('Đang làm việc');

    Logger.step('Verify', 'Nhãn nút đổi thành "TT: Đang làm việc" và các dòng đều hiển thị badge "Đang làm việc"');
    await expect(personnelPage.statusFilterDropdown).toContainText('TT: Đang làm việc');
    const count = await personnelPage.rows.count();
    if (count > 0) {
      await expect(personnelPage.rows.first()).toContainText('Đang làm việc');
    }

    Logger.step('Teardown', 'Khôi phục về trạng thái "Tất cả"');
    await personnelPage.selectStatusFilter('Tất cả');
  });

  test('TC_NS_037: Lọc danh sách nhân sự theo trạng thái "Thử việc"', {
    tag: ['@high', '@major']
  }, async ({ personnelPage }) => {
    Logger.step(1, 'Chọn trạng thái "Thử việc" trong dropdown lọc');
    await personnelPage.selectStatusFilter('Thử việc');

    Logger.step('Verify', 'Nhãn nút đổi thành "TT: Thử việc"');
    await expect(personnelPage.statusFilterDropdown).toContainText('TT: Thử việc');

    Logger.step('Teardown', 'Khôi phục về trạng thái "Tất cả"');
    await personnelPage.selectStatusFilter('Tất cả');
  });

  test('TC_NS_038: Lọc danh sách theo các trạng thái còn lại (Nghỉ phép dài hạn, Đã nghỉ việc, Đã chấm dứt HĐLĐ)', {
    tag: ['@normal', '@major']
  }, async ({ personnelPage }) => {
    Logger.step(1, 'Chọn trạng thái "Nghỉ phép dài hạn"');
    await personnelPage.selectStatusFilter('Nghỉ phép dài hạn');
    await expect(personnelPage.statusFilterDropdown).toContainText('TT: Nghỉ phép dài hạn');

    Logger.step(2, 'Chọn trạng thái "Đã nghỉ việc"');
    await personnelPage.selectStatusFilter('Đã nghỉ việc');
    await expect(personnelPage.statusFilterDropdown).toContainText('TT: Đã nghỉ việc');

    Logger.step(3, 'Chọn trạng thái "Đã chấm dứt HĐLĐ"');
    await personnelPage.selectStatusFilter('Đã chấm dứt HĐLĐ');
    await expect(personnelPage.statusFilterDropdown).toContainText('TT: Đã chấm dứt HĐLĐ');

    Logger.step('Teardown', 'Khôi phục về trạng thái "Tất cả"');
    await personnelPage.selectStatusFilter('Tất cả');
  });

  test('TC_NS_039: Chọn lại trạng thái "Tất cả" để khôi phục toàn bộ danh sách nhân sự', {
    tag: ['@normal', '@major']
  }, async ({ personnelPage }) => {
    Logger.step(1, 'Đang từ trạng thái lọc "Đang làm việc" chọn lại "Tất cả"');
    await personnelPage.selectStatusFilter('Đang làm việc');
    await expect(personnelPage.statusFilterDropdown).toContainText('TT: Đang làm việc');

    await personnelPage.selectStatusFilter('Tất cả');

    Logger.step('Verify', 'Nút hiển thị lại "TT: Tất cả" và bảng khôi phục đầy đủ nhân sự');
    await expect(personnelPage.statusFilterDropdown).toContainText('TT: Tất cả');
    await expect(personnelPage.firstRow).toBeVisible();
  });

  test('TC_NS_040: Lọc kết hợp đa điều kiện: Chip "Phòng/ban 1" + Trạng thái "Đang làm việc"', {
    tag: ['@high', '@major']
  }, async ({ personnelPage }) => {
    Logger.step(1, 'Nhấn chọn chip "Phòng/ban 1"');
    await personnelPage.filterByDepartmentChip('dept1');

    Logger.step(2, 'Chọn trạng thái lọc "Đang làm việc"');
    await personnelPage.selectStatusFilter('Đang làm việc');

    Logger.step('Verify', 'Cả chip Phòng/ban 1 active và nút hiển thị "TT: Đang làm việc"');
    await expect(personnelPage.dept1Chip).toHaveClass(/active/);
    await expect(personnelPage.statusFilterDropdown).toContainText('TT: Đang làm việc');

    Logger.step('Teardown', 'Khôi phục chip Tất cả và trạng thái Tất cả');
    await personnelPage.filterByDepartmentChip('all');
    await personnelPage.selectStatusFilter('Tất cả');
  });

  // ==========================================
  // KHỐI 11: QUẢN LÝ CỘT (MANAGE COLUMNS)
  // ==========================================
  test('TC_NS_027: Mở popover "Quản lý cột" từ nút ở chân bảng', {
    tag: ['@normal', '@minor']
  }, async ({ personnelPage }) => {
    Logger.step(1, 'Nhấn nút "Quản lý cột"');
    await personnelPage.openManageColumns();

    Logger.step('Verify', 'Popover quản lý cột hiển thị');
    await expect(personnelPage.manageColumnsPopover).toBeVisible();
  });

  // =========================================================================
  // KHỐI 12: PHÂN QUYỀN TRUY CẬP (ACCESS CONTROL / RBAC)
  // (TẠM THỜI COMMENT TOÀN BỘ DO HỆ THỐNG HIỆN TẠI CHƯA TRIỂN KHAI PHÂN QUYỀN)
  // =========================================================================
  //
  // test('TC_NS_RBAC_01: Quyền truy cập - Tài khoản Quản trị viên (Admin) / Quản lý HR có quyền truy cập đầy đủ vào /nhan-su', {
  //   tag: ['@high', '@critical']
  // }, async ({ page, personnelPage }) => {
  //   // TODO: Bật lại khi hệ thống triển khai phân quyền theo vai trò người dùng (RBAC)
  //   Logger.step(1, 'Đăng nhập bằng tài khoản có quyền Quản trị viên / Quản lý HR');
  //   // await authPage.login(adminUser.username, adminUser.password);
  //
  //   Logger.step(2, 'Điều hướng tới tuyến đường quản lý nhân sự /nhan-su');
  //   await personnelPage.navigate();
  //
  //   Logger.step('Verify', 'Truy cập thành công, tab NHÂN SỰ active và hiển thị đầy đủ danh sách cùng thanh công cụ');
  //   await expect(personnelPage.headerPersonnelTab).toBeVisible();
  //   await expect(personnelPage.addPersonnelButton).toBeVisible();
  //   await expect(personnelPage.table).toBeVisible();
  // });
  //
  // test('TC_NS_RBAC_02: Quyền truy cập - Tài khoản Kỹ thuật viên (KNV / Lab) cố tình truy cập bằng URL trực tiếp bị chặn', {
  //   tag: ['@high', '@critical']
  // }, async ({ page }) => {
  //   // TODO: Bật lại khi hệ thống triển khai phân quyền theo vai trò người dùng (RBAC)
  //   Logger.step(1, 'Đăng nhập bằng tài khoản Kỹ thuật viên phòng LAB (không có quyền quản lý nhân sự)');
  //   // await authPage.login(technicianUser.username, technicianUser.password);
  //
  //   Logger.step(2, 'Cố tình truy cập trực tiếp bằng đường dẫn URL /nhan-su');
  //   await page.goto('/nhan-su');
  //
  //   Logger.step('Verify', 'Hệ thống chặn truy cập (Hiển thị trang lỗi 403 Forbidden hoặc chuyển hướng về trang chủ /dashboard)');
  //   // await expect(page).toHaveURL(/\/(dashboard|403|access-denied)/);
  //   // await expect(page.locator('.forbidden-message, .error-content')).toContainText(/không có quyền|403|truy cập bị từ chối/i);
  // });
  //
  // test('TC_NS_RBAC_03: Quyền truy cập - Tài khoản Nhân viên kinh doanh (Sale) cố tình truy cập bằng URL trực tiếp bị chặn', {
  //   tag: ['@high', '@critical']
  // }, async ({ page }) => {
  //   // TODO: Bật lại khi hệ thống triển khai phân quyền theo vai trò người dùng (RBAC)
  //   Logger.step(1, 'Đăng nhập bằng tài khoản Nhân viên kinh doanh thông thường');
  //   // await authPage.login(salesUser.username, salesUser.password);
  //
  //   Logger.step(2, 'Cố tình truy cập trực tiếp bằng đường dẫn URL /nhan-su');
  //   await page.goto('/nhan-su');
  //
  //   Logger.step('Verify', 'Hệ thống chặn truy cập (Hiển thị trang lỗi 403 Forbidden hoặc chuyển hướng về trang chủ /dashboard)');
  //   // await expect(page).toHaveURL(/\/(dashboard|403|access-denied)/);
  //   // await expect(page.locator('.forbidden-message, .error-content')).toContainText(/không có quyền|403|truy cập bị từ chối/i);
  // });
  //
  // test('TC_NS_RBAC_04: Phiên làm việc - Khách chưa đăng nhập cố tình truy cập trực tiếp /nhan-su bị chuyển hướng về /dang-nhap', {
  //   tag: ['@high', '@critical']
  // }, async ({ page }) => {
  //   // TODO: Bật lại khi hệ thống triển khai phân quyền theo vai trò người dùng (RBAC)
  //   Logger.step(1, 'Xóa toàn bộ phiên đăng nhập (cookies / local storage / session storage)');
  //   await page.context().clearCookies();
  //
  //   Logger.step(2, 'Cố tình truy cập trực tiếp vào tuyến đường bảo vệ /nhan-su');
  //   await page.goto('/nhan-su');
  //
  //   Logger.step('Verify', 'Hệ thống chặn truy cập và tự động chuyển hướng về trang đăng nhập /dang-nhap');
  //   await expect(page).toHaveURL(/\/dang-nhap/);
  // });
});
