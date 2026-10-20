import { test, expect } from '../../fixtures/base.fixture';
import { Logger } from '../../utils/logger';
import users from '../../../test-data/users.json';

test.describe('Module Quản lý Đối tác (Doanh nghiệp) - Hệ thống VNTEST LIMS', () => {
  test.beforeEach(async ({ loginPage, partnersPage, page }) => {
    Logger.step('Setup', 'Đăng nhập và điều hướng tới trang Đối tác & CTV');
    await loginPage.open('/dang-nhap');
    await loginPage.login(users.validUser.username, users.validUser.password);
    await page.waitForURL('https://vntest-lims.pirago.work/', { timeout: 15000 });

    await partnersPage.open('/doi-tac');
    await expect(partnersPage.partnersTab).toBeVisible({ timeout: 15000 });
    await expect(partnersPage.sectionHeader).toBeVisible({ timeout: 15000 });
  });

  // ==========================================
  // KHỐI 01: BỐ CỤC & HIỂN THỊ
  // ==========================================
  test('TC_PART_001: Hiển thị đầy đủ thanh điều hướng và tab Đối tác & CTV', {
    tag: ['@normal', '@minor']
  }, async ({ partnersPage }) => {
    Logger.step(1, 'Kiểm tra tab chính Đối tác & CTV và tiêu đề khối Đối tác');
    await expect(partnersPage.partnersTab).toBeVisible();
    await expect(partnersPage.partnersTab).toHaveClass(/active/);
    await expect(partnersPage.sectionHeader).toContainText(/đối tác/i);
    await expect(partnersPage.sectionHeader).toContainText('Quản lý đối tác giới thiệu KH & tỷ lệ hoa hồng.');
  });

  test('TC_PART_002: Hiển thị đầy đủ thanh công cụ và các nút thao tác', {
    tag: ['@normal', '@minor']
  }, async ({ partnersPage }) => {
    Logger.step(1, 'Kiểm tra các bộ lọc và ô tìm kiếm');
    await expect(partnersPage.commissionFilterButton).toBeVisible();
    await expect(partnersPage.dateTypeFilterButton).toBeVisible();
    await expect(partnersPage.dateFromTrigger).toBeVisible();
    await expect(partnersPage.dateToTrigger).toBeVisible();
    await expect(partnersPage.searchInput).toBeVisible();

    Logger.step(2, 'Kiểm tra các nút hành động trên thanh công cụ');
    await expect(partnersPage.addPartnerButton).toBeVisible();
    await expect(partnersPage.editPartnerButton).toBeVisible();
    await expect(partnersPage.deletePartnerButton).toBeVisible();
  });

  test('TC_PART_003: Hiển thị bảng dữ liệu danh sách đối tác với các cột chuẩn', {
    tag: ['@normal', '@minor']
  }, async ({ partnersPage }) => {
    Logger.step('Verify', 'Bảng dữ liệu và các dòng đối tác hiển thị');
    await expect(partnersPage.table).toBeVisible();
    await expect(partnersPage.firstRow).toBeVisible();
    await expect(partnersPage.table).toContainText(/tên sale/i);
    await expect(partnersPage.table).toContainText(/mã đt/i);
    await expect(partnersPage.table).toContainText(/phân loại/i);
    await expect(partnersPage.table).toContainText(/loại hh/i);
  });

  // ==========================================
  // KHỐI 02: TRẠNG THÁI NÚT THAO TÁC
  // ==========================================
  test('TC_PART_005: Trạng thái ban đầu của các nút thao tác khi chưa chọn dòng', {
    tag: ['@normal', '@minor']
  }, async ({ partnersPage }) => {
    Logger.step('Verify', 'Nút "Thêm" kích hoạt, nút "Sửa" và "Xoá" ở trạng thái vô hiệu hóa');
    await expect(partnersPage.addPartnerButton).toBeEnabled();
    await expect(partnersPage.editPartnerButton).toBeDisabled();
    await expect(partnersPage.deletePartnerButton).toBeDisabled();
  });

  test('TC_PART_006: Kích hoạt nút "Sửa" và "Xoá" khi tích chọn duy nhất 1 đối tác', {
    tag: ['@high', '@major']
  }, async ({ partnersPage }) => {
    Logger.step(1, 'Tích chọn dòng đối tác đầu tiên');
    await partnersPage.selectRow(0);

    Logger.step('Verify', 'Nút "Sửa" và "Xoá" chuyển sang trạng thái kích hoạt');
    await expect(partnersPage.editPartnerButton).toBeEnabled();
    await expect(partnersPage.deletePartnerButton).toBeEnabled();

    Logger.step('Teardown', 'Bỏ chọn dòng đối tác');
    await partnersPage.unselectRow(0);
  });

  test('TC_PART_007: Trạng thái nút thao tác khi chọn từ 2 đối tác trở lên', {
    tag: ['@high', '@major']
  }, async ({ partnersPage }) => {
    Logger.step(1, 'Tích chọn 2 dòng đối tác liên tiếp');
    await partnersPage.selectRow(0);
    await partnersPage.selectRow(1);

    Logger.step('Verify', 'Nút "Sửa" bị vô hiệu hóa, nút "Xoá" vẫn kích hoạt');
    await expect(partnersPage.editPartnerButton).toBeDisabled();
    await expect(partnersPage.deletePartnerButton).toBeEnabled();

    Logger.step('Teardown', 'Bỏ chọn các dòng');
    await partnersPage.unselectRow(0);
    await partnersPage.unselectRow(1);
  });

  test('TC_PART_008: Bỏ chọn dòng đối tác đưa nút thao tác về trạng thái ban đầu', {
    tag: ['@normal', '@minor']
  }, async ({ partnersPage }) => {
    Logger.step(1, 'Tích chọn 1 dòng đối tác rồi bỏ chọn ngay sau đó');
    await partnersPage.selectRow(0);
    await expect(partnersPage.editPartnerButton).toBeEnabled();

    await partnersPage.unselectRow(0);

    Logger.step('Verify', 'Nút "Sửa" và "Xoá" tự động quay lại trạng thái vô hiệu hóa');
    await expect(partnersPage.editPartnerButton).toBeDisabled();
    await expect(partnersPage.deletePartnerButton).toBeDisabled();
  });

  // ==========================================
  // KHỐI 03: BỘ LỌC & TÌM KIẾM
  // ==========================================
  test('TC_PART_010: Lọc theo Loại hoa hồng "Lũy tiến"', {
    tag: ['@high', '@major']
  }, async ({ partnersPage, page }) => {
    Logger.step(1, 'Chọn bộ lọc Loại hoa hồng là "Lũy tiến"');
    const responsePromise = page.waitForResponse(resp => resp.url().includes('commission_type=progressive'));
    await partnersPage.filterByCommissionType('Lũy tiến');
    await responsePromise;

    Logger.step('Verify', 'Nút lọc hiển thị "Loại HH: Lũy tiến"');
    await expect(partnersPage.commissionFilterButton).toContainText('Lũy tiến');

    Logger.step('Teardown', 'Khôi phục bộ lọc về "Tất cả"');
    await partnersPage.filterByCommissionType('Tất cả');
  });

  test('TC_PART_011: Lọc theo Loại hoa hồng "Cố định"', {
    tag: ['@high', '@major']
  }, async ({ partnersPage, page }) => {
    Logger.step(1, 'Chọn bộ lọc Loại hoa hồng là "Cố định"');
    const responsePromise = page.waitForResponse(resp => resp.url().includes('commission_type=fixed'));
    await partnersPage.filterByCommissionType('Cố định');
    await responsePromise;

    Logger.step('Verify', 'Nút lọc hiển thị "Loại HH: Cố định"');
    await expect(partnersPage.commissionFilterButton).toContainText('Cố định');

    Logger.step('Teardown', 'Khôi phục bộ lọc về "Tất cả"');
    await partnersPage.filterByCommissionType('Tất cả');
  });

  test('TC_PART_017: Tìm kiếm đối tác theo Tên công ty', {
    tag: ['@high', '@major']
  }, async ({ partnersPage, page }) => {
    const keyword = 'Chi';
    Logger.step(1, `Nhập từ khóa "${keyword}" và nhấn Enter`);
    const responsePromise = page.waitForResponse(resp => resp.url().includes('search=Chi'));
    await partnersPage.search(keyword);
    await responsePromise;

    Logger.step('Verify', 'Bảng dữ liệu hiển thị đúng đối tác có tên công ty khớp từ khóa');
    await expect(partnersPage.firstRow).toContainText('Chi');

    Logger.step('Teardown', 'Xóa tìm kiếm');
    await partnersPage.clearSearch();
  });

  test('TC_PART_021: Tìm kiếm với từ khóa không tồn tại', {
    tag: ['@normal', '@minor']
  }, async ({ partnersPage, page }) => {
    const keyword = 'KHONG_CO_DOI_TAC_99999';
    Logger.step(1, `Tìm kiếm với từ khóa không tồn tại "${keyword}"`);
    const responsePromise = page.waitForResponse(resp => resp.url().includes('search='));
    await partnersPage.search(keyword);
    await responsePromise;

    Logger.step('Verify', 'Bảng không có bản ghi phù hợp');
    await partnersPage.clearSearch();
  });

  // ==========================================
  // KHỐI 04: THÊM MỚI ĐỐI TÁC (DOANH NGHIỆP)
  // ==========================================
  test('TC_PART_023: Mở và đóng hộp thoại Thêm Đối tác mới bằng nút "Hủy"', {
    tag: ['@low', '@minor']
  }, async ({ partnersPage }) => {
    Logger.step(1, 'Nhấn nút "Thêm" trên thanh công cụ');
    await partnersPage.openCreateModal();
    await expect(partnersPage.modalTitle).toBeVisible();

    Logger.step(2, 'Nhấn nút "Hủy" trên hộp thoại');
    await partnersPage.closeCreateModal();

    Logger.step('Verify', 'Hộp thoại thêm mới được đóng lại');
    await expect(partnersPage.modal).toBeHidden();
  });

  test('TC_PART_024: Bỏ trống toàn bộ các trường bắt buộc khi tạo mới đối tác Doanh nghiệp', {
    tag: ['@high', '@major']
  }, async ({ partnersPage }) => {
    Logger.step(1, 'Mở hộp thoại Thêm Đối tác mới');
    await partnersPage.openCreateModal();

    Logger.step(2, 'Nhấn nút "Lưu" mà không điền thông tin');
    await partnersPage.submitForm();

    Logger.step('Verify', 'Hiển thị cảnh báo thông tin chưa hợp lệ');
    await expect(partnersPage.invalidFormError).toBeVisible();

    Logger.step('Teardown', 'Đóng modal');
    await partnersPage.closeCreateModal();
  });

  test('TC_PART_025: Kiểm tra định dạng trường Email khi nhập sai', {
    tag: ['@normal', '@minor']
  }, async ({ partnersPage }) => {
    Logger.step(1, 'Mở hộp thoại Thêm Đối tác');
    await partnersPage.openCreateModal();

    Logger.step(2, 'Nhập email sai định dạng và nhấn "Lưu"');
    await partnersPage.contactEmailInput.fill('invalid-email-format');
    await partnersPage.submitForm();

    Logger.step('Verify', 'Hiển thị thông báo "Email không đúng định dạng."');
    await expect(partnersPage.emailFormatError).toBeVisible();

    Logger.step('Teardown', 'Đóng modal');
    await partnersPage.closeCreateModal();
  });

  test('TC_PART_026: Thêm mới đối tác Doanh nghiệp thành công và xóa dọn dẹp dữ liệu', {
    tag: ['@high', '@critical']
  }, async ({ partnersPage }) => {
    const timestamp = Date.now();
    const companyName = `Công ty TNHH Thử Nghiệm Auto ${timestamp}`;
    const contactName = `Nguyễn Văn Test ${timestamp.toString().slice(-4)}`;
    const phone = `098${Math.floor(1000000 + Math.random() * 9000000)}`;

    Logger.step(1, 'Mở hộp thoại và nhập đầy đủ thông tin hợp lệ');
    await partnersPage.openCreateModal();
    await partnersPage.createBusinessPartner({
      companyName,
      contactName,
      phone,
      commissionRate: '10'
    });

    Logger.step('Verify 1', 'Hiển thị thông báo "Đã lưu đối tác mới."');
    await expect(partnersPage.createSuccessToast).toBeVisible({ timeout: 10000 });

    Logger.step('Verify 2', 'Bản ghi đối tác mới xuất hiện ngay đầu bảng danh sách');
    await expect(partnersPage.firstRow).toContainText(companyName, { timeout: 10000 });
    await expect(partnersPage.firstRow).toContainText(contactName);

    Logger.step('Teardown', 'Xóa đối tác vừa tạo để dọn dẹp dữ liệu');
    await partnersPage.selectRow(0);
    await partnersPage.openDeleteModal();
    await partnersPage.confirmDelete();
    await expect(partnersPage.deleteSuccessToast).toBeVisible({ timeout: 10000 });
  });

  // ==========================================
  // KHỐI 05: XEM CHI TIẾT ĐỐI TÁC (DRAWER)
  // ==========================================
  test('TC_PART_032: Mở và đóng ngăn xem chi tiết đối tác', {
    tag: ['@normal', '@major']
  }, async ({ partnersPage }) => {
    Logger.step(1, 'Nhấn biểu tượng con mắt tại dòng đối tác đầu tiên');
    await partnersPage.openDetailDrawer(0);

    Logger.step('Verify 1', 'Ngăn chi tiết (Drawer) trượt mở');
    await expect(partnersPage.detailPanel).toBeVisible({ timeout: 10000 });
    await expect(partnersPage.detailInfoTab).toBeVisible();

    Logger.step(2, 'Nhấn nút đóng ngăn chi tiết');
    await partnersPage.closeDetailDrawer();

    Logger.step('Verify 2', 'Ngăn chi tiết được đóng lại');
    await expect(partnersPage.detailPanel).toBeHidden();
  });

  // ==========================================
  // KHỐI 06: CHỈNH SỬA ĐỐI TÁC
  // ==========================================
  test('TC_PART_035: Mở và đóng hộp thoại Sửa Đối tác bằng nút "Hủy"', {
    tag: ['@normal', '@minor']
  }, async ({ partnersPage }) => {
    Logger.step(1, 'Tích chọn 1 dòng đối tác');
    await partnersPage.selectRow(0);

    Logger.step(2, 'Nhấn nút "Sửa" trên thanh công cụ');
    await partnersPage.openEditModal();
    await expect(partnersPage.modalTitle).toBeVisible();

    Logger.step(3, 'Nhấn nút "Hủy"');
    await partnersPage.closeCreateModal();

    Logger.step('Verify', 'Hộp thoại chỉnh sửa đóng lại');
    await expect(partnersPage.modal).toBeHidden();

    Logger.step('Teardown', 'Bỏ chọn dòng');
    await partnersPage.unselectRow(0);
  });

  // ==========================================
  // KHỐI 07: XÓA ĐỐI TÁC
  // ==========================================
  test('TC_PART_037: Mở và đóng hộp thoại Xác nhận xóa đối tác bằng nút "Hủy"', {
    tag: ['@normal', '@minor']
  }, async ({ partnersPage }) => {
    Logger.step(1, 'Tích chọn 1 dòng đối tác và nhấn nút "Xoá"');
    await partnersPage.selectRow(0);
    await partnersPage.openDeleteModal();

    Logger.step('Verify 1', 'Hộp thoại xác nhận xóa hiển thị');
    await expect(partnersPage.deleteModalTitle).toBeVisible();

    Logger.step(2, 'Nhấn nút "Hủy" trên hộp thoại');
    await partnersPage.cancelDelete();

    Logger.step('Verify 2', 'Hộp thoại xác nhận xóa đóng lại');
    await expect(partnersPage.deleteModal).toBeHidden();

    Logger.step('Teardown', 'Bỏ chọn dòng');
    await partnersPage.unselectRow(0);
  });
});
