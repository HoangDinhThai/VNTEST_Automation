import { test, expect } from '../../fixtures/base.fixture';
import { Logger } from '../../utils/logger';
import users from '../../../test-data/users.json';

test.describe('Module Quản lý Cộng tác viên (Cá nhân) - Hệ thống VNTEST LIMS', () => {
  test.beforeEach(async ({ collaboratorsPage }) => {
    Logger.step('Setup', 'Điều hướng tới trang Đối tác & CTV');
    await collaboratorsPage.open('/doi-tac');
    await expect(collaboratorsPage.partnersTab).toBeVisible({ timeout: 15000 });
    await expect(collaboratorsPage.sectionHeader).toBeVisible({ timeout: 15000 });
  });

  // ==========================================
  // KHỐI 01: BỐ CỤC & HIỂN THỊ KHỐI CTV
  // ==========================================
  test('TC_CTV_001: Hiển thị đầy đủ tiêu đề khối Cộng tác viên và mô tả chức năng', {
    tag: ['@normal', '@minor']
  }, async ({ collaboratorsPage }) => {
    Logger.step(1, 'Kiểm tra tiêu đề khối Cộng tác viên và dòng mô tả');
    await expect(collaboratorsPage.sectionHeader).toContainText(/cộng tác viên/i);
    await expect(collaboratorsPage.sectionHeader).toContainText('Quản lý cộng tác viên cá nhân & tỷ lệ hoa hồng.');
  });

  test('TC_CTV_002: Hiển thị đầy đủ thanh công cụ và các nút thao tác khối CTV', {
    tag: ['@normal', '@minor']
  }, async ({ collaboratorsPage }) => {
    Logger.step(1, 'Kiểm tra các bộ lọc và ô tìm kiếm của khối CTV');
    await expect(collaboratorsPage.commissionFilterButton).toBeVisible();
    await expect(collaboratorsPage.dateTypeFilterButton).toBeVisible();
    await expect(collaboratorsPage.dateFromTrigger).toBeVisible();
    await expect(collaboratorsPage.dateToTrigger).toBeVisible();
    await expect(collaboratorsPage.searchInput).toBeVisible();

    Logger.step(2, 'Kiểm tra các nút hành động của khối CTV');
    await expect(collaboratorsPage.addCtvButton).toBeVisible();
    await expect(collaboratorsPage.editCtvButton).toBeVisible();
    await expect(collaboratorsPage.deleteCtvButton).toBeVisible();
  });

  test('TC_CTV_003: Hiển thị bảng dữ liệu danh sách CTV với các cột chuẩn', {
    tag: ['@normal', '@minor']
  }, async ({ collaboratorsPage }) => {
    Logger.step('Verify', 'Bảng dữ liệu CTV và các cột hiển thị đúng chuẩn');
    await expect(collaboratorsPage.table).toBeVisible();
    await expect(collaboratorsPage.firstRow).toBeVisible();
    await expect(collaboratorsPage.table).toContainText(/tên sale/i);
    await expect(collaboratorsPage.table).toContainText(/mã ctv/i);
    await expect(collaboratorsPage.table).toContainText(/họ tên/i);
    await expect(collaboratorsPage.table).toContainText(/loại hoa hồng/i);
  });

  // ==========================================
  // KHỐI 02: TRẠNG THÁI NÚT THAO TÁC CTV
  // ==========================================
  test('TC_CTV_005: Trạng thái ban đầu của các nút thao tác CTV khi chưa chọn dòng', {
    tag: ['@normal', '@minor']
  }, async ({ collaboratorsPage }) => {
    Logger.step('Verify', 'Nút "Thêm" kích hoạt, nút "Sửa" và "Xóa" ở trạng thái vô hiệu hóa');
    await expect(collaboratorsPage.addCtvButton).toBeEnabled();
    await expect(collaboratorsPage.editCtvButton).toBeDisabled();
    await expect(collaboratorsPage.deleteCtvButton).toBeDisabled();
  });

  test('TC_CTV_006: Kích hoạt nút "Sửa" và "Xóa" khi tích chọn duy nhất 1 CTV', {
    tag: ['@high', '@major']
  }, async ({ collaboratorsPage }) => {
    Logger.step(1, 'Tích chọn dòng CTV đầu tiên');
    await collaboratorsPage.selectRow(0);

    Logger.step('Verify', 'Nút "Sửa" và "Xóa" chuyển sang trạng thái kích hoạt');
    await expect(collaboratorsPage.editCtvButton).toBeEnabled();
    await expect(collaboratorsPage.deleteCtvButton).toBeEnabled();

    Logger.step('Teardown', 'Bỏ chọn dòng CTV');
    await collaboratorsPage.unselectRow(0);
  });

  test('TC_CTV_007: Trạng thái nút thao tác khi chọn từ 2 CTV trở lên', {
    tag: ['@high', '@major']
  }, async ({ collaboratorsPage }) => {
    Logger.step(1, 'Tích chọn 2 dòng CTV liên tiếp');
    await collaboratorsPage.selectRow(0);
    await collaboratorsPage.selectRow(1);

    Logger.step('Verify', 'Nút "Sửa" bị vô hiệu hóa, nút "Xóa" vẫn kích hoạt');
    await expect(collaboratorsPage.editCtvButton).toBeDisabled();
    await expect(collaboratorsPage.deleteCtvButton).toBeEnabled();

    Logger.step('Teardown', 'Bỏ chọn các dòng');
    await collaboratorsPage.unselectRow(0);
    await collaboratorsPage.unselectRow(1);
  });

  test('TC_CTV_008: Bỏ chọn dòng CTV đưa nút thao tác về trạng thái ban đầu', {
    tag: ['@normal', '@minor']
  }, async ({ collaboratorsPage }) => {
    Logger.step(1, 'Tích chọn 1 dòng CTV rồi bỏ chọn ngay sau đó');
    await collaboratorsPage.selectRow(0);
    await expect(collaboratorsPage.editCtvButton).toBeEnabled();

    await collaboratorsPage.unselectRow(0);

    Logger.step('Verify', 'Nút "Sửa" và "Xóa" tự động quay lại trạng thái vô hiệu hóa');
    await expect(collaboratorsPage.editCtvButton).toBeDisabled();
    await expect(collaboratorsPage.deleteCtvButton).toBeDisabled();
  });

  // ==========================================
  // KHỐI 03: BỘ LỌC & TÌM KIẾM CTV
  // ==========================================
  test('TC_CTV_010: Lọc CTV theo Loại hoa hồng "Cố định"', {
    tag: ['@high', '@major']
  }, async ({ collaboratorsPage, page }) => {
    Logger.step(1, 'Chọn bộ lọc Loại hoa hồng là "Cố định" trên bảng CTV');
    const responsePromise = page.waitForResponse(resp => resp.url().includes('commission_type=fixed'));
    await collaboratorsPage.filterByCommissionType('Cố định');
    await responsePromise;

    Logger.step('Verify', 'Nút lọc hiển thị "Loại HH: Cố định"');
    await expect(collaboratorsPage.commissionFilterButton).toContainText('Cố định');

    Logger.step('Teardown', 'Khôi phục bộ lọc về "Tất cả"');
    await collaboratorsPage.filterByCommissionType('Tất cả');
  });

  test('TC_CTV_011: Lọc CTV theo Loại hoa hồng "Lũy tiến"', {
    tag: ['@high', '@major']
  }, async ({ collaboratorsPage, page }) => {
    Logger.step(1, 'Chọn bộ lọc Loại hoa hồng là "Lũy tiến" trên bảng CTV');
    const responsePromise = page.waitForResponse(resp => resp.url().includes('commission_type=progressive'));
    await collaboratorsPage.filterByCommissionType('Lũy tiến');
    await responsePromise;

    Logger.step('Verify', 'Nút lọc hiển thị "Loại HH: Lũy tiến"');
    await expect(collaboratorsPage.commissionFilterButton).toContainText('Lũy tiến');

    Logger.step('Teardown', 'Khôi phục bộ lọc về "Tất cả"');
    await collaboratorsPage.filterByCommissionType('Tất cả');
  });

  test('TC_CTV_018: Tìm kiếm CTV theo Họ và tên', {
    tag: ['@high', '@major']
  }, async ({ collaboratorsPage, page }) => {
    const keyword = 'Vũ Quốc Cường';
    Logger.step(1, `Tìm kiếm CTV với họ tên "${keyword}"`);
    const responsePromise = page.waitForResponse(resp => resp.url().includes('collaborators') && resp.url().includes('search='));
    await collaboratorsPage.search(keyword);
    await responsePromise;

    Logger.step('Verify', 'Bảng dữ liệu CTV hiển thị đúng bản ghi khớp từ khóa');
    await expect(collaboratorsPage.firstRow).toContainText('Vũ Quốc Cường');

    Logger.step('Teardown', 'Xóa tìm kiếm');
    await collaboratorsPage.clearSearch();
  });

  test('TC_CTV_022: Tìm kiếm CTV với từ khóa không tồn tại', {
    tag: ['@normal', '@minor']
  }, async ({ collaboratorsPage, page }) => {
    const keyword = 'KHONG_CO_CTV_99999';
    Logger.step(1, `Tìm kiếm CTV với từ khóa "${keyword}"`);
    const responsePromise = page.waitForResponse(resp => resp.url().includes('collaborators') && resp.url().includes('search='));
    await collaboratorsPage.search(keyword);
    await responsePromise;

    Logger.step('Verify', 'Bảng dữ liệu CTV không có bản ghi nào');
    await collaboratorsPage.clearSearch();
  });

  // ==========================================
  // KHỐI 04: THÊM MỚI CỘNG TÁC VIÊN (CÁ NHÂN)
  // ==========================================
  test('TC_CTV_024: Mở và đóng hộp thoại Thêm Cộng tác viên mới bằng nút "Hủy"', {
    tag: ['@low', '@minor']
  }, async ({ collaboratorsPage }) => {
    Logger.step(1, 'Nhấn nút "Thêm" trên thanh công cụ CTV');
    await collaboratorsPage.openCreateModal();
    await expect(collaboratorsPage.modalTitle).toBeVisible();

    Logger.step(2, 'Nhấn nút "Hủy" trên hộp thoại');
    await collaboratorsPage.closeCreateModal();

    Logger.step('Verify', 'Hộp thoại thêm mới CTV đóng lại');
    await expect(collaboratorsPage.modal).toBeHidden();
  });

  test('TC_CTV_025: Bỏ trống toàn bộ các trường bắt buộc khi tạo mới CTV', {
    tag: ['@high', '@major']
  }, async ({ collaboratorsPage }) => {
    Logger.step(1, 'Mở hộp thoại Thêm Cộng tác viên');
    await collaboratorsPage.openCreateModal();

    Logger.step(2, 'Nhấn nút "Lưu" mà không điền thông tin');
    await collaboratorsPage.submitForm();

    Logger.step('Verify', 'Hiển thị cảnh báo thông tin chưa hợp lệ');
    await expect(collaboratorsPage.invalidFormError).toBeVisible();

    Logger.step('Teardown', 'Đóng modal');
    await collaboratorsPage.closeCreateModal();
  });

  test('TC_CTV_026: Kiểm tra trường Email khi nhập sai định dạng', {
    tag: ['@normal', '@minor']
  }, async ({ collaboratorsPage }) => {
    Logger.step(1, 'Mở hộp thoại Thêm CTV');
    await collaboratorsPage.openCreateModal();

    Logger.step(2, 'Nhập email sai định dạng và nhấn "Lưu"');
    await collaboratorsPage.emailInput.fill('invalid-ctv-email');
    await collaboratorsPage.emailInput.press('Tab');
    await collaboratorsPage.submitForm();

    Logger.step('Verify', 'Hiển thị thông báo "Email không đúng định dạng."');
    await expect(collaboratorsPage.emailFormatError).toBeVisible();

    Logger.step('Teardown', 'Đóng modal');
    await collaboratorsPage.closeCreateModal();
  });

  test('TC_CTV_027: Thêm mới Cộng tác viên thành công và xóa dọn dẹp dữ liệu', {
    tag: ['@high', '@critical']
  }, async ({ collaboratorsPage }) => {
    const timestamp = Date.now();
    const fullName = `Lê Văn CTV Test ${timestamp.toString().slice(-4)}`;
    const idCard = `00120${Math.floor(1000000 + Math.random() * 9000000)}`;
    const phone = `097${Math.floor(1000000 + Math.random() * 9000000)}`;

    Logger.step(1, 'Mở hộp thoại và nhập đầy đủ thông tin hợp lệ');
    await collaboratorsPage.openCreateModal();
    await collaboratorsPage.createCollaborator({
      fullName,
      idCard,
      phone,
      commissionRate: '12'
    });

    Logger.step('Verify 1', 'Hiển thị thông báo "Đã lưu cộng tác viên mới."');
    await expect(collaboratorsPage.createSuccessToast).toBeVisible({ timeout: 10000 });

    Logger.step('Verify 2', 'Bản ghi CTV mới xuất hiện ngay đầu bảng danh sách CTV');
    await expect(collaboratorsPage.firstRow).toContainText(fullName, { timeout: 10000 });
    await expect(collaboratorsPage.firstRow).toContainText(phone);

    Logger.step('Teardown', 'Xóa CTV vừa tạo để dọn dẹp dữ liệu');
    await collaboratorsPage.selectRow(0);
    await collaboratorsPage.openDeleteModal();
    await collaboratorsPage.confirmDelete();
    await expect(collaboratorsPage.deleteSuccessToast).toBeVisible({ timeout: 10000 });
  });

  // ==========================================
  // KHỐI 05: XEM CHI TIẾT CTV (DRAWER)
  // ==========================================
  test('TC_CTV_031: Mở và đóng ngăn xem chi tiết cộng tác viên', {
    tag: ['@normal', '@major']
  }, async ({ collaboratorsPage }) => {
    Logger.step(1, 'Nhấn biểu tượng con mắt tại dòng CTV đầu tiên');
    await collaboratorsPage.openDetailDrawer(0);

    Logger.step('Verify 1', 'Ngăn chi tiết (Drawer) trượt mở');
    await expect(collaboratorsPage.detailPanel).toBeVisible({ timeout: 10000 });

    Logger.step(2, 'Nhấn nút đóng ngăn chi tiết');
    await collaboratorsPage.closeDetailDrawer();

    Logger.step('Verify 2', 'Ngăn chi tiết được đóng lại');
    await expect(collaboratorsPage.detailPanel).toBeHidden();
  });

  // ==========================================
  // KHỐI 06: CHỈNH SỬA CỘNG TÁC VIÊN
  // ==========================================
  test('TC_CTV_034: Mở và đóng hộp thoại Sửa Cộng tác viên bằng nút "Hủy"', {
    tag: ['@normal', '@minor']
  }, async ({ collaboratorsPage }) => {
    Logger.step(1, 'Tích chọn 1 dòng CTV');
    await collaboratorsPage.selectRow(0);

    Logger.step(2, 'Nhấn nút "Sửa" trên thanh công cụ CTV');
    await collaboratorsPage.openEditModal();
    await expect(collaboratorsPage.modalTitle).toBeVisible();

    Logger.step(3, 'Nhấn nút "Hủy"');
    await collaboratorsPage.closeCreateModal();

    Logger.step('Verify', 'Hộp thoại chỉnh sửa CTV đóng lại');
    await expect(collaboratorsPage.modal).toBeHidden();

    Logger.step('Teardown', 'Bỏ chọn dòng');
    await collaboratorsPage.unselectRow(0);
  });

  // ==========================================
  // KHỐI 07: XÓA CỘNG TÁC VIÊN
  // ==========================================
  test('TC_CTV_036: Mở và đóng hộp thoại Xác nhận xóa CTV bằng nút "Hủy"', {
    tag: ['@normal', '@minor']
  }, async ({ collaboratorsPage }) => {
    Logger.step(1, 'Tích chọn 1 dòng CTV và nhấn nút "Xóa"');
    await collaboratorsPage.selectRow(0);
    await collaboratorsPage.openDeleteModal();

    Logger.step('Verify 1', 'Hộp thoại xác nhận xóa CTV hiển thị');
    await expect(collaboratorsPage.deleteModalTitle).toBeVisible();

    Logger.step(2, 'Nhấn nút "Hủy" trên hộp thoại');
    await collaboratorsPage.cancelDelete();

    Logger.step('Verify 2', 'Hộp thoại xác nhận xóa đóng lại');
    await expect(collaboratorsPage.deleteModal).toBeHidden();

    Logger.step('Teardown', 'Bỏ chọn dòng');
    await collaboratorsPage.unselectRow(0);
  });
});
