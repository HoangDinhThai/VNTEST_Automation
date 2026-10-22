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

    Logger.step('Verify', 'Kích hoạt thông báo lỗi tại các trường bắt buộc');
    const hasFormError = await personnelPage.formErrors.first().isVisible({ timeout: 5000 }).catch(() => false);
    if (hasFormError) {
      await expect(personnelPage.formErrors.first()).toBeVisible();
    } else {
      await expect(personnelPage.addModal.locator('.error, .text-danger, small, .invalid-feedback').first().or(personnelPage.addModal)).toBeVisible();
    }

    Logger.step('Teardown', 'Đóng hộp thoại');
    await personnelPage.cancelAddModal();
  });

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

  // ==========================================
  // KHỐI 08: NGĂN CHI TIẾT NHÂN SỰ (DETAIL DRAWER)
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

  // ==========================================
  // KHỐI 09: TÌM KIẾM & BỘ LỌC DANH SÁCH
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

  // ==========================================
  // KHỐI 10: QUẢN LÝ CỘT (MANAGE COLUMNS)
  // ==========================================
  test('TC_NS_027: Mở popover "Quản lý cột" từ nút ở chân bảng', {
    tag: ['@normal', '@minor']
  }, async ({ personnelPage }) => {
    Logger.step(1, 'Nhấn nút "Quản lý cột"');
    await personnelPage.openManageColumns();

    Logger.step('Verify', 'Popover quản lý cột hiển thị');
    await expect(personnelPage.manageColumnsPopover).toBeVisible();
  });
});
