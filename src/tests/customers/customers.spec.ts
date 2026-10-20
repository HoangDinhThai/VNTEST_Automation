import { test, expect } from '../../fixtures/base.fixture';
import { Logger } from '../../utils/logger';
import users from '../../../test-data/users.json';
import { TestDataGenerator } from '../../utils/test-data-generator';

test.describe('Module Quản lý Khách hàng - Hệ thống VNTEST LIMS', () => {
  test.beforeEach(async ({ loginPage, customersPage, page }) => {
    Logger.step('Setup', 'Đăng nhập và điều hướng tới trang danh sách Khách hàng');
    await loginPage.open('/dang-nhap');
    await loginPage.login(users.validUser.username, users.validUser.password);
    await page.waitForURL('https://vntest-lims.pirago.work/', { timeout: 15000 });

    await customersPage.open('/khach-hang');
    await expect(customersPage.customersTab).toBeVisible({ timeout: 15000 });
  });

  // ==========================================
  // KHỐI 01: BỐ CỤC & HIỂN THỊ
  // ==========================================
  test('TC_CUST_001: Hiển thị đầy đủ các thành phần màn hình danh sách Khách hàng', {
    tag: ['@normal', '@minor']
  }, async ({ customersPage }) => {
    Logger.step(1, 'Kiểm tra tab, thanh công cụ và các nút thao tác');
    await expect(customersPage.customersTab).toBeVisible();
    await expect(customersPage.addCustomerButton).toBeVisible();
    await expect(customersPage.editCustomerButton).toBeVisible();
    await expect(customersPage.deleteCustomerButton).toBeVisible();
    await expect(customersPage.changeSaleButton).toBeVisible();

    Logger.step(2, 'Kiểm tra bảng dữ liệu danh sách khách hàng');
    await expect(customersPage.table).toBeVisible();
    await expect(customersPage.firstRow).toBeVisible();
  });

  test('TC_CUST_002: Trạng thái ban đầu của các nút thao tác hàng loạt khi chưa chọn dòng', {
    tag: ['@normal', '@minor']
  }, async ({ customersPage }) => {
    Logger.step('Verify', 'Nút "Sửa", "Xóa", "Đổi sale" ở trạng thái vô hiệu hóa (disabled)');
    await expect(customersPage.editCustomerButton).toHaveClass(/disabled/);
    await expect(customersPage.deleteCustomerButton).toHaveClass(/disabled/);
    await expect(customersPage.changeSaleButton).toHaveClass(/disabled/);
  });

  // ==========================================
  // KHỐI 02: THÊM MỚI KHÁCH HÀNG
  // ==========================================
  test('TC_CUST_003: Mở và đóng hộp thoại Thêm Khách hàng mới bằng nút "Hủy"', {
    tag: ['@low', '@minor']
  }, async ({ customersPage }) => {
    Logger.step(1, 'Nhấn nút "Thêm" trên thanh công cụ');
    await customersPage.openCreateModal();
    await expect(customersPage.modalTitle).toBeVisible();

    Logger.step(2, 'Nhấn nút "Hủy" trên hộp thoại');
    await customersPage.closeCreateModal();

    Logger.step('Verify', 'Hộp thoại thêm mới được đóng lại');
    await expect(customersPage.modal).toBeHidden();
  });

  test('TC_CUST_004: Bỏ trống toàn bộ các trường bắt buộc khi tạo mới', {
    tag: ['@high', '@major']
  }, async ({ customersPage }) => {
    Logger.step(1, 'Mở hộp thoại Thêm Khách hàng mới');
    await customersPage.openCreateModal();

    Logger.step(2, 'Nhấn nút "Lưu" mà không điền thông tin');
    await customersPage.submitCreateForm();

    Logger.step('Verify', 'Hiển thị cảnh báo lỗi bắt buộc người liên hệ');
    await expect(customersPage.contactRequiredError).toBeVisible();

    Logger.step('Teardown', 'Đóng modal');
    await customersPage.closeCreateModal();
  });

  test('TC_CUST_005: Bỏ trống thông tin Người liên hệ khi tạo mới khách hàng', {
    tag: ['@high', '@major']
  }, async ({ customersPage }) => {
    Logger.step(1, 'Mở hộp thoại và chỉ nhập Tên công ty, MST');
    await customersPage.openCreateModal();
    await customersPage.companyNameInput.fill('Công ty TNHH Thử nghiệm ABC');
    await customersPage.taxCodeInput.fill('0109999888');

    Logger.step(2, 'Nhấn nút "Lưu" mà chưa thêm người liên hệ');
    await customersPage.submitCreateForm();

    Logger.step('Verify', 'Hiển thị cảnh báo "Cần nhập ít nhất một người liên hệ."');
    await expect(customersPage.contactRequiredError).toBeVisible();

    Logger.step('Teardown', 'Đóng modal');
    await customersPage.closeCreateModal();
  });

  test('TC_CUST_006: Thêm mới khách hàng Doanh nghiệp thành công', {
    tag: ['@high', '@critical']
  }, async ({ customersPage }) => {
    const timestamp = Date.now();
    const companyName = `Công ty TNHH Kiểm nghiệm Auto ${timestamp}`;
    const taxCode = `01${Math.floor(10000000 + Math.random() * 90000000)}`;
    const contactName = 'Nguyễn Văn Auto';
    const contactPhone = TestDataGenerator.generatePhoneNumber();
    const contactEmail = `auto_${timestamp}@vntest.vn`;

    Logger.step(1, 'Mở hộp thoại Thêm Khách hàng mới');
    await customersPage.openCreateModal();

    Logger.step(2, 'Điền đầy đủ thông tin hợp lệ ở tất cả các trường');
    await customersPage.fillCustomerForm({
      sale: 'Admin User',
      source: 'TTK',
      companyName,
      taxCode,
      address: 'Tòa nhà VNTEST, Số 88 Đường Cầu Giấy, Hà Nội',
      contactName,
      contactPhone,
      contactEmail,
    });

    Logger.step(3, 'Nhấn nút "Lưu"');
    await customersPage.submitCreateForm();

    Logger.step('Verify 1', 'Hiển thị thông báo "Đã lưu khách hàng mới."');
    await expect(customersPage.createSuccessToast).toBeVisible({ timeout: 10000 });

    Logger.step('Verify 2', 'Bản ghi khách hàng mới xuất hiện ngay đầu danh sách với trạng thái "Chưa hợp tác"');
    await expect(customersPage.firstRow).toContainText(companyName, { timeout: 10000 });
    await expect(customersPage.firstRow).toContainText('Chưa hợp tác');
  });

  test('TC_CUST_032: Chuyển đổi qua lại giữa nhóm khách hàng Doanh nghiệp và Cá nhân trên form tạo mới', {
    tag: ['@normal', '@minor']
  }, async ({ customersPage }) => {
    Logger.step(1, 'Mở hộp thoại Thêm Khách hàng mới');
    await customersPage.openCreateModal();

    Logger.step(2, 'Nhấn nút chuyển sang nhóm "Cá nhân"');
    await customersPage.selectPersonalCustomerType();

    Logger.step('Verify 1', 'Form hiển thị các trường của Cá nhân và ẩn các trường Doanh nghiệp');
    await expect(customersPage.personalFullNameInput).toBeVisible();
    await expect(customersPage.personalPhoneInput).toBeVisible();
    await expect(customersPage.companyNameInput).toBeHidden();

    Logger.step(3, 'Nhấn nút chuyển lại nhóm "Doanh nghiệp"');
    await customersPage.selectBusinessCustomerType();

    Logger.step('Verify 2', 'Form quay về hiển thị các trường của Doanh nghiệp');
    await expect(customersPage.companyNameInput).toBeVisible();
    await expect(customersPage.taxCodeInput).toBeVisible();

    Logger.step('Teardown', 'Đóng hộp thoại');
    await customersPage.closeCreateModal();
  });

  test('TC_CUST_033: Bỏ trống các trường bắt buộc khi tạo mới khách hàng Cá nhân', {
    tag: ['@high', '@major']
  }, async ({ customersPage }) => {
    Logger.step(1, 'Mở hộp thoại Thêm Khách hàng mới và chọn nhóm "Cá nhân"');
    await customersPage.openCreateModal();
    await customersPage.selectPersonalCustomerType();

    Logger.step(2, 'Nhấn nút "Lưu" khi chưa nhập dữ liệu');
    await customersPage.submitCreateForm();

    Logger.step('Verify', 'Hiển thị thông báo cảnh báo kiểm tra trường bắt buộc');
    await expect(customersPage.requiredFieldsError).toBeVisible({ timeout: 10000 });

    Logger.step('Teardown', 'Đóng hộp thoại');
    await customersPage.closeCreateModal();
  });

  test('TC_CUST_034: Thêm mới khách hàng Cá nhân thành công', {
    tag: ['@high', '@critical']
  }, async ({ customersPage }) => {
    const timestamp = Date.now();
    const fullName = `Nguyễn Văn Test Cá Nhân ${timestamp}`;
    const phone = TestDataGenerator.generatePhoneNumber();
    const email = `canhan_${timestamp}@vntest.vn`;

    Logger.step(1, 'Mở hộp thoại Thêm Khách hàng mới và chọn nhóm "Cá nhân"');
    await customersPage.openCreateModal();
    await customersPage.selectPersonalCustomerType();

    Logger.step(2, 'Điền đầy đủ thông tin hợp lệ vào form Cá nhân');
    await customersPage.fillPersonalCustomerForm({
      sale: 'Admin User',
      source: 'TTK',
      fullName,
      phone,
      email,
      idNumber: '001203004567',
      address: 'Số 10 Phố Huế, Hoàn Kiếm, Hà Nội',
    });

    Logger.step(3, 'Nhấn nút "Lưu"');
    await customersPage.submitCreateForm();

    Logger.step('Verify 1', 'Hiển thị thông báo "Đã lưu khách hàng mới."');
    await expect(customersPage.createSuccessToast).toBeVisible({ timeout: 10000 });

    Logger.step('Verify 2', 'Bản ghi mới hiển thị ngay đầu danh sách với Nhóm KH là "Cá nhân"');
    await expect(customersPage.firstRow).toContainText(fullName, { timeout: 10000 });
    await expect(customersPage.firstRow).toContainText('Cá nhân');
    await expect(customersPage.firstRow).toContainText('Chưa hợp tác');
  });

  test('TC_CUST_035: Thêm mới khách hàng Cá nhân bằng nút "Lưu & tạo tiếp"', {
    tag: ['@normal', '@major']
  }, async ({ customersPage }) => {
    const timestamp = Date.now();
    const fullName = `Trần Thị Tiếp ${timestamp}`;
    const phone = TestDataGenerator.generatePhoneNumber();

    Logger.step(1, 'Mở hộp thoại Thêm Khách hàng mới và chọn nhóm "Cá nhân"');
    await customersPage.openCreateModal();
    await customersPage.selectPersonalCustomerType();

    Logger.step(2, 'Điền thông tin hợp lệ vào form Cá nhân');
    await customersPage.fillPersonalCustomerForm({
      sale: 'Admin User',
      source: 'TTK',
      fullName,
      phone,
    });

    Logger.step(3, 'Nhấn nút "Lưu & tạo tiếp"');
    await customersPage.submitCreateAndContinue();

    Logger.step('Verify 1', 'Hộp thoại vẫn mở để người dùng tiếp tục nhập bản ghi mới');
    await expect(customersPage.modal).toBeVisible();

    Logger.step('Teardown', 'Đóng hộp thoại tạo mới');
    await customersPage.closeCreateModal();

    Logger.step('Verify 2', 'Bản ghi khách hàng mới vừa tạo đã xuất hiện trên danh sách');
    await expect(customersPage.firstRow).toContainText(fullName, { timeout: 10000 });
    await expect(customersPage.firstRow).toContainText('Cá nhân');
  });

  // ==========================================
  // KHỐI 03: XEM CHI TIẾT KHÁCH HÀNG
  // ==========================================
  test('TC_CUST_007: Mở và đóng ngăn Chi tiết Khách hàng', {
    tag: ['@high', '@critical']
  }, async ({ customersPage }) => {
    Logger.step(1, 'Nhấn nút "Xem chi tiết" tại dòng đầu tiên');
    await customersPage.openDetail(0);

    Logger.step('Verify 1', 'Ngăn chi tiết mở ra ở trạng thái hiển thị');
    await expect(customersPage.detailPanel).toHaveClass(/open/);
    await expect(customersPage.detailCompanyName).toBeVisible();

    Logger.step(2, 'Nhấn nút "Đóng" [×] trên ngăn chi tiết');
    await customersPage.closeDetail();

    Logger.step('Verify 2', 'Ngăn chi tiết được đóng lại');
    await expect(customersPage.detailPanel).not.toHaveClass(/open/);
  });

  test('TC_CUST_008: Kiểm tra tính toàn vẹn thông tin khách hàng trong ngăn chi tiết', {
    tag: ['@high', '@major']
  }, async ({ customersPage }) => {
    Logger.step(1, 'Lấy tên công ty tại dòng đầu tiên');
    const companyText = await customersPage.firstRow.locator('td').nth(10).innerText();

    Logger.step(2, 'Mở ngăn chi tiết');
    await customersPage.openDetail(0);

    Logger.step('Verify', 'Tên công ty và các tab nghiệp vụ hiển thị đầy đủ trong ngăn chi tiết');
    await expect(customersPage.detailCompanyName).toContainText(companyText.trim());
    await expect(customersPage.detailInfoTab).toBeVisible();
    await expect(customersPage.detailHistoryTab).toBeVisible();
    await expect(customersPage.detailChangeLogTab).toBeVisible();

    Logger.step('Teardown', 'Đóng ngăn chi tiết');
    await customersPage.closeDetail();
  });

  // ==========================================
  // KHỐI 04: CHỈNH SỬA KHÁCH HÀNG
  // ==========================================
  test('TC_CUST_009: Kích hoạt nút "Sửa" khi chọn dòng khách hàng trong danh sách', {
    tag: ['@normal', '@minor']
  }, async ({ customersPage }) => {
    Logger.step(1, 'Tick chọn ô checkbox tại dòng khách hàng đầu tiên');
    await customersPage.selectCustomerRow(0);

    Logger.step('Verify', 'Nút "Sửa" trên thanh công cụ chuyển sang trạng thái kích hoạt');
    await expect(customersPage.editCustomerButton).not.toHaveClass(/disabled/);
  });

  test('TC_CUST_010: Mở và đóng hộp thoại Sửa khách hàng bằng nút "Hủy"', {
    tag: ['@low', '@minor']
  }, async ({ customersPage }) => {
    Logger.step(1, 'Chọn dòng khách hàng và nhấn nút "Sửa"');
    await customersPage.selectCustomerRow(0);
    await customersPage.openEditModal();
    await expect(customersPage.modalTitle).toContainText('Sửa khách hàng');

    Logger.step(2, 'Nhấn nút "Hủy" trên hộp thoại sửa');
    await customersPage.closeEditModal();

    Logger.step('Verify', 'Hộp thoại sửa được đóng lại');
    await expect(customersPage.modal).toBeHidden();
  });

  test('TC_CUST_011: Cập nhật thông tin khách hàng thành công', {
    tag: ['@high', '@critical']
  }, async ({ customersPage }) => {
    const timestamp = Date.now();
    const updatedName = `Khách hàng Đã Cập Nhật ${timestamp}`;

    Logger.step(1, 'Chọn dòng khách hàng đầu tiên và mở hộp thoại Sửa');
    await customersPage.selectCustomerRow(0);
    await customersPage.openEditModal();

    Logger.step(2, 'Chỉnh sửa thông tin Tên khách hàng');
    if (await customersPage.personalFullNameInput.isVisible()) {
      await customersPage.personalFullNameInput.fill(updatedName);
    } else {
      await customersPage.companyNameInput.fill(updatedName);
    }

    Logger.step(3, 'Nhấn nút "Cập nhật"');
    await customersPage.submitEditForm();

    Logger.step('Verify', 'Hộp thoại sửa đóng lại và thông tin mới được cập nhật trên danh sách');
    await expect(customersPage.modal).toBeHidden({ timeout: 10000 });
    await expect(customersPage.firstRow).toContainText(updatedName, { timeout: 10000 });
  });

  // ==========================================
  // KHỐI 05: XÓA KHÁCH HÀNG
  // ==========================================
  test('TC_CUST_012: Vô hiệu hóa nút "Xóa" đối với khách hàng đã hợp tác', {
    tag: ['@high', '@major']
  }, async ({ customersPage }) => {
    Logger.step(1, 'Tìm và chọn một khách hàng có trạng thái "Đã hợp tác"');
    // Tìm dòng có trạng thái Đã hợp tác
    const cooperativedRow = customersPage.rows.filter({ hasText: 'Đã hợp tác' }).first();
    await expect(cooperativedRow).toBeVisible();
    await cooperativedRow.locator('input[type="checkbox"]').click();

    Logger.step('Verify', 'Nút "Xóa" bị vô hiệu hóa kèm thuộc tính title cảnh báo');
    await expect(customersPage.deleteCustomerButton).toHaveClass(/disabled/);
    await expect(customersPage.deleteCustomerButton).toHaveAttribute(
      'title',
      'Chỉ được xóa khách hàng chưa hợp tác.'
    );
  });

  test('TC_CUST_013: Mở và hủy xác nhận xóa khách hàng bằng nút "Hủy"', {
    tag: ['@low', '@minor']
  }, async ({ customersPage }) => {
    // Tạo 1 khách hàng mới để có trạng thái Chưa hợp tác
    const timestamp = Date.now();
    const companyName = `KH Test Xoa Huy ${timestamp}`;
    const taxCode = `01${Math.floor(10000000 + Math.random() * 90000000)}`;

    Logger.step('Setup', 'Tạo khách hàng mới ở trạng thái Chưa hợp tác');
    await customersPage.openCreateModal();
    await customersPage.fillCustomerForm({
      companyName,
      taxCode,
      contactName: 'Người Liên Hệ Test',
      contactPhone: '0912345678',
    });
    await customersPage.submitCreateForm();
    await expect(customersPage.firstRow).toContainText(companyName, { timeout: 10000 });

    Logger.step(1, 'Chọn khách hàng vừa tạo và nhấn nút "Xóa"');
    await customersPage.selectCustomerRow(0);
    await customersPage.openDeleteDialog();
    await expect(customersPage.deleteModalTitle).toBeVisible();

    Logger.step(2, 'Nhấn nút "Hủy" trên hộp thoại xác nhận xóa');
    await customersPage.cancelDelete();

    Logger.step('Verify', 'Hộp thoại xóa đóng lại và bản ghi vẫn còn trong bảng');
    await expect(customersPage.deleteModal).toBeHidden();
    await expect(customersPage.firstRow).toContainText(companyName);

    Logger.step('Teardown', 'Dọn dẹp xóa bản ghi vừa tạo');
    await customersPage.selectCustomerRow(0);
    await customersPage.openDeleteDialog();
    await customersPage.confirmDelete();
    await expect(customersPage.deleteSuccessToast).toBeVisible({ timeout: 10000 });
  });

  test('TC_CUST_014: Xóa khách hàng chưa hợp tác thành công', {
    tag: ['@high', '@critical']
  }, async ({ customersPage }) => {
    // Tạo 1 khách hàng mới để xóa
    const timestamp = Date.now();
    const companyName = `KH Test Xoa Thanh Cong ${timestamp}`;
    const taxCode = `01${Math.floor(10000000 + Math.random() * 90000000)}`;

    Logger.step('Setup', 'Tạo khách hàng mới để thực hiện xóa');
    await customersPage.openCreateModal();
    await customersPage.fillCustomerForm({
      companyName,
      taxCode,
      contactName: 'Người Liên Hệ Xóa',
      contactPhone: '0987654321',
    });
    await customersPage.submitCreateForm();
    await expect(customersPage.firstRow).toContainText(companyName, { timeout: 10000 });

    Logger.step(1, 'Chọn checkbox của khách hàng vừa tạo');
    await customersPage.selectCustomerRow(0);

    Logger.step(2, 'Nhấn nút "Xóa" trên thanh công cụ');
    await customersPage.openDeleteDialog();
    await expect(customersPage.deleteModalTitle).toBeVisible();

    Logger.step(3, 'Nhấn nút "Xác nhận xóa"');
    await customersPage.confirmDelete();

    Logger.step('Verify', 'Hiển thị thông báo "Đã xóa thành công." và bản ghi biến mất khỏi bảng');
    await expect(customersPage.deleteSuccessToast).toBeVisible({ timeout: 10000 });
    await expect(customersPage.firstRow).not.toContainText(companyName);
  });

  // ==========================================
  // KHỐI 06: TÌM KIẾM & BỘ LỌC DỮ LIỆU
  // ==========================================
  test('TC_CUST_015: Tìm kiếm khách hàng theo Tên công ty', {
    tag: ['@high', '@critical']
  }, async ({ customersPage }) => {
    Logger.step(1, 'Nhập từ khóa tìm kiếm tên công ty vào ô tìm kiếm');
    await customersPage.search('Guitar');

    Logger.step('Verify', 'Bảng lọc và hiển thị đúng bản ghi khách hàng theo tên công ty');
    await expect(customersPage.firstRow).toContainText('Guitar');
  });

  test('TC_CUST_016: Tìm kiếm khách hàng theo Mã số thuế (MST)', {
    tag: ['@high', '@major']
  }, async ({ customersPage }) => {
    Logger.step(1, 'Nhập mã số thuế công ty vào ô tìm kiếm');
    await customersPage.search('0092345234');

    Logger.step('Verify', 'Bảng lọc và hiển thị bản ghi có mã số thuế trùng khớp');
    await expect(customersPage.firstRow).toContainText('0092345234');
  });

  test('TC_CUST_017: Tìm kiếm khách hàng theo Số điện thoại người liên hệ', {
    tag: ['@high', '@major']
  }, async ({ customersPage }) => {
    Logger.step(1, 'Nhập số điện thoại liên hệ vào ô tìm kiếm');
    await customersPage.search('0968576758');

    Logger.step('Verify', 'Bảng lọc và hiển thị đúng bản ghi có số điện thoại liên hệ');
    await expect(customersPage.firstRow).toContainText('0968576758');
  });

  test('TC_CUST_018: Tìm kiếm với từ khóa không tồn tại trong hệ thống', {
    tag: ['@normal', '@minor']
  }, async ({ customersPage }) => {
    Logger.step(1, 'Nhập từ khóa không có trong hệ thống');
    await customersPage.search('KH_KHONG_TON_TAI_999999');

    Logger.step('Verify', 'Bảng hiển thị thông báo "Không có khách hàng phù hợp."');
    await expect(customersPage.table).toContainText('Không có khách hàng phù hợp.');
  });

  test('TC_CUST_019: Xóa từ khóa tìm kiếm để hoàn nguyên danh sách', {
    tag: ['@normal', '@minor']
  }, async ({ customersPage }) => {
    Logger.step(1, 'Tìm kiếm bản ghi với từ khóa');
    await customersPage.search('Guitar');
    await expect(customersPage.rows).toHaveCount(1);

    Logger.step(2, 'Xóa từ khóa tìm kiếm');
    await customersPage.clearSearch();

    Logger.step('Verify', 'Danh sách khách hàng hiển thị lại toàn bộ bản ghi');
    expect(await customersPage.rows.count()).toBeGreaterThan(1);
  });

  test('TC_CUST_020: Lọc danh sách theo Nhóm khách hàng "Doanh nghiệp"', {
    tag: ['@high', '@major']
  }, async ({ customersPage }) => {
    Logger.step(1, 'Mở bộ lọc Nhóm KH và chọn "Doanh nghiệp"');
    await customersPage.filterByCustomerGroup('Doanh nghiệp');

    Logger.step('Verify', 'Danh sách hiển thị các khách hàng thuộc nhóm Doanh nghiệp');
    await expect(customersPage.firstRow).toContainText(/DN|Doanh nghiệp/);
  });

  test('TC_CUST_021: Lọc danh sách theo Nhóm khách hàng "Cá nhân"', {
    tag: ['@high', '@major']
  }, async ({ customersPage }) => {
    Logger.step(1, 'Mở bộ lọc Nhóm KH và chọn "Cá nhân"');
    await customersPage.filterByCustomerGroup('Cá nhân');

    Logger.step('Verify', 'Danh sách hiển thị các khách hàng thuộc nhóm Cá nhân');
    await expect(customersPage.firstRow).toContainText('Cá nhân');
  });

  test('TC_CUST_022: Lọc danh sách theo Trạng thái "Đã hợp tác"', {
    tag: ['@high', '@major']
  }, async ({ customersPage }) => {
    Logger.step(1, 'Mở bộ lọc Trạng thái và chọn "Đã hợp tác"');
    await customersPage.filterByStatus('Đã hợp tác');

    Logger.step('Verify', 'Danh sách hiển thị các khách hàng có trạng thái Đã hợp tác');
    await expect(customersPage.firstRow).toContainText('Đã hợp tác');
  });

  test('TC_CUST_023: Lọc danh sách theo Trạng thái "Chưa hợp tác"', {
    tag: ['@high', '@major']
  }, async ({ customersPage }) => {
    Logger.step(1, 'Mở bộ lọc Trạng thái và chọn "Chưa hợp tác"');
    await customersPage.filterByStatus('Chưa hợp tác');

    Logger.step('Verify', 'Danh sách hiển thị các khách hàng có trạng thái Chưa hợp tác');
    await expect(customersPage.firstRow).toContainText('Chưa hợp tác');
  });

  test('TC_CUST_024: Lọc khách hàng theo khoảng Ngày liên hệ và xóa bộ lọc ngày', {
    tag: ['@normal', '@minor']
  }, async ({ customersPage }) => {
    Logger.step(1, 'Mở hộp thoại lịch "Từ" và chọn ngày "Hôm nay"');
    await customersPage.filterDateFromToday();

    Logger.step(2, 'Xóa điều kiện lọc ngày để quay về trạng thái mặc định');
    await customersPage.clearDateFilter();

    Logger.step('Verify', 'Điều kiện lọc ngày hiển thị giá trị mặc định dd/mm/yyyy');
    await expect(customersPage.dateFromTrigger).toContainText('dd/mm/yyyy');
  });

  test('TC_CUST_025: Kết hợp tìm kiếm từ khóa với bộ lọc Trạng thái', {
    tag: ['@high', '@major']
  }, async ({ customersPage }) => {
    Logger.step(1, 'Nhập từ khóa tìm kiếm');
    await customersPage.search('Guitar');

    Logger.step(2, 'Chọn bộ lọc Trạng thái "Đã hợp tác"');
    await customersPage.filterByStatus('Đã hợp tác');

    Logger.step('Verify', 'Danh sách hiển thị đúng bản ghi thỏa mãn đồng thời cả 2 điều kiện');
    await expect(customersPage.firstRow).toContainText('Guitar');
    await expect(customersPage.firstRow).toContainText('Đã hợp tác');
  });

  // ==========================================
  // KHỐI 07: ĐỔI NGƯỜI PHỤ TRÁCH (ĐỔI SALE)
  // ==========================================
  test('TC_CUST_026: Mở và đóng hộp thoại Đổi người phụ trách bằng nút "Hủy"', {
    tag: ['@low', '@minor']
  }, async ({ customersPage }) => {
    Logger.step(1, 'Chọn một khách hàng và nhấn nút "Đổi sale"');
    await customersPage.selectCustomerRow(0);
    await customersPage.openChangeSaleModal();
    await expect(customersPage.changeSaleModalTitle).toBeVisible();

    Logger.step(2, 'Nhấn nút "Hủy" trên hộp thoại');
    await customersPage.closeChangeSaleModal();

    Logger.step('Verify', 'Hộp thoại đổi người phụ trách đóng lại');
    await expect(customersPage.changeSaleModal).toBeHidden();
  });

  test('TC_CUST_027: Đóng hộp thoại Đổi người phụ trách bằng nút "Đóng" [×]', {
    tag: ['@low', '@minor']
  }, async ({ customersPage }) => {
    Logger.step(1, 'Chọn một khách hàng và nhấn nút "Đổi sale"');
    await customersPage.selectCustomerRow(0);
    await customersPage.openChangeSaleModal();

    Logger.step(2, 'Nhấn nút "Đóng" [×] ở góc trên');
    await customersPage.closeChangeSaleModalByIcon();

    Logger.step('Verify', 'Hộp thoại đổi người phụ trách đóng lại');
    await expect(customersPage.changeSaleModal).toBeHidden();
  });

  test('TC_CUST_028: Bỏ trống toàn bộ các trường bắt buộc khi đổi người phụ trách', {
    tag: ['@high', '@major']
  }, async ({ customersPage }) => {
    Logger.step(1, 'Chọn một khách hàng và mở hộp thoại Đổi người phụ trách');
    await customersPage.selectCustomerRow(0);
    await customersPage.openChangeSaleModal();

    Logger.step(2, 'Nhấn nút "Xác nhận chuyển" khi chưa nhập dữ liệu');
    await customersPage.submitChangeSale();

    Logger.step('Verify', 'Hiển thị cảnh báo lỗi bắt buộc cho cả Người phụ trách mới và Lý do');
    await expect(customersPage.changeSaleSelectRequiredError).toBeVisible();
    await expect(customersPage.changeSaleReasonRequiredError).toBeVisible();

    Logger.step('Teardown', 'Đóng hộp thoại');
    await customersPage.closeChangeSaleModal();
  });

  test('TC_CUST_029: Bỏ trống trường Lý do khi đổi người phụ trách', {
    tag: ['@high', '@major']
  }, async ({ customersPage }) => {
    Logger.step(1, 'Chọn một khách hàng và mở hộp thoại');
    await customersPage.selectCustomerRow(0);
    await customersPage.openChangeSaleModal();

    Logger.step(2, 'Chọn người phụ trách mới nhưng để trống Lý do');
    await customersPage.selectNewSale('Bùi Thị Thảo');
    await customersPage.submitChangeSale();

    Logger.step('Verify', 'Hiển thị cảnh báo "Vui lòng nhập lý do chuyển người phụ trách."');
    await expect(customersPage.changeSaleReasonRequiredError).toBeVisible();

    Logger.step('Teardown', 'Đóng hộp thoại');
    await customersPage.closeChangeSaleModal();
  });

  test('TC_CUST_030: Đổi người phụ trách cho một khách hàng thành công', {
    tag: ['@high', '@critical']
  }, async ({ customersPage }) => {
    Logger.step(1, 'Chọn một khách hàng và mở hộp thoại Đổi người phụ trách');
    await customersPage.selectCustomerRow(0);
    await customersPage.openChangeSaleModal();

    Logger.step(2, 'Chọn người phụ trách mới và nhập lý do');
    await customersPage.selectNewSale('Bùi Thị Thảo');
    await customersPage.fillChangeSaleReason('Chuyển giao khách hàng cho sale phụ trách khu vực');

    Logger.step(3, 'Nhấn nút "Xác nhận chuyển"');
    await customersPage.submitChangeSale();

    Logger.step('Verify 1', 'Hiển thị thông báo "Đã chuyển người phụ trách khách hàng."');
    await expect(customersPage.changeSaleSuccessToast).toBeVisible({ timeout: 10000 });

    Logger.step('Verify 2', 'Hộp thoại đóng lại và cột Tên sale hiển thị người phụ trách mới');
    await expect(customersPage.changeSaleModal).toBeHidden();
    await expect(customersPage.firstRow).toContainText('Bùi Thị Thảo');
  });

  test('TC_CUST_031: Đổi người phụ trách hàng loạt cho nhiều khách hàng', {
    tag: ['@high', '@critical']
  }, async ({ customersPage }) => {
    Logger.step(1, 'Tick chọn 2 khách hàng trong danh sách');
    await customersPage.selectCustomerRow(0);
    await customersPage.selectCustomerRow(1);

    Logger.step(2, 'Nhấn nút "Đổi sale" trên thanh công cụ');
    await customersPage.openChangeSaleModal();

    Logger.step('Verify 1', 'Tiêu đề phụ hiển thị đúng số lượng khách hàng đã chọn');
    await expect(customersPage.changeSaleModalInfo).toContainText('2 khách hàng');

    Logger.step(3, 'Chọn người phụ trách mới và nhập lý do');
    await customersPage.selectNewSale('Admin User');
    await customersPage.fillChangeSaleReason('Điều chuyển công tác hàng loạt');

    Logger.step(4, 'Nhấn nút "Xác nhận chuyển"');
    await customersPage.submitChangeSale();

    Logger.step('Verify 2', 'Hiển thị thông báo "Đã chuyển người phụ trách khách hàng."');
    await expect(customersPage.changeSaleSuccessToast).toBeVisible({ timeout: 10000 });
  });

  // ==========================================
  // KHỐI 08: KIỂM TRA TRÙNG LẶP THÔNG TIN (CHECK TRÙNG)
  // ==========================================
  test('TC_CUST_036: Trạng thái ban đầu của các nút "Check trùng" khi chưa nhập dữ liệu', {
    tag: ['@normal', '@minor']
  }, async ({ customersPage }) => {
    Logger.step(1, 'Mở hộp thoại Thêm Khách hàng mới (mặc định form Doanh nghiệp)');
    await customersPage.openCreateModal();

    Logger.step('Verify 1', 'Nút "Check trùng MST" thông tin công ty và xuất hóa đơn đều bị vô hiệu hóa');
    await expect(customersPage.checkCompanyMstButton).toBeDisabled();
    await expect(customersPage.checkInvoiceMstButton).toBeDisabled();

    Logger.step(2, 'Chuyển sang nhóm "Cá nhân"');
    await customersPage.selectPersonalCustomerType();

    Logger.step('Verify 2', 'Nút "Check trùng SĐT" thông tin cá nhân bị vô hiệu hóa');
    await expect(customersPage.checkPersonalPhoneButton).toBeDisabled();
    await expect(customersPage.checkInvoiceMstButton).toBeDisabled();

    Logger.step('Teardown', 'Đóng hộp thoại');
    await customersPage.closeCreateModal();
  });

  test('TC_CUST_037: Kiểm tra trùng MST công ty khi Mã số thuế KHÔNG trùng lặp', {
    tag: ['@high', '@major']
  }, async ({ customersPage }) => {
    const uniqueTaxCode = `01${Math.floor(10000000 + Math.random() * 90000000)}`;

    Logger.step(1, 'Mở hộp thoại Thêm Khách hàng mới');
    await customersPage.openCreateModal();

    Logger.step(2, 'Nhập mã số thuế công ty mới chưa từng tồn tại');
    await customersPage.taxCodeInput.fill(uniqueTaxCode);

    Logger.step('Verify 1', 'Nút "Check trùng MST" được kích hoạt');
    await expect(customersPage.checkCompanyMstButton).toBeEnabled();

    Logger.step(3, 'Nhấn nút "Check trùng MST"');
    await customersPage.clickCheckCompanyMst();

    Logger.step('Verify 2', 'Hiển thị thông báo "Không tìm thấy khách hàng trùng."');
    await expect(customersPage.noDuplicateToast).toBeVisible({ timeout: 10000 });

    Logger.step('Teardown', 'Đóng hộp thoại');
    await customersPage.closeCreateModal();
  });

  test('TC_CUST_038: Kiểm tra trùng MST công ty khi Mã số thuế ĐÃ TỒN TẠI trên hệ thống', {
    tag: ['@high', '@critical']
  }, async ({ customersPage }) => {
    const existingTaxCode = '0092345234';

    Logger.step(1, 'Mở hộp thoại Thêm Khách hàng mới');
    await customersPage.openCreateModal();

    Logger.step(2, 'Nhập mã số thuế công ty đã tồn tại trong hệ thống');
    await customersPage.taxCodeInput.fill(existingTaxCode);

    Logger.step(3, 'Nhấn nút "Check trùng MST"');
    await customersPage.clickCheckCompanyMst();

    Logger.step('Verify', 'Hiển thị thông báo tìm thấy khách hàng trùng kèm mã KH và tên công ty');
    await expect(customersPage.duplicateFoundToast).toBeVisible({ timeout: 10000 });
    await expect(customersPage.duplicateFoundToast).toContainText('KH-0175');

    Logger.step('Teardown', 'Đóng hộp thoại');
    await customersPage.closeCreateModal();
  });

  test('TC_CUST_039: Kiểm tra trùng MST xuất hóa đơn khi Mã số thuế ĐÃ TỒN TẠI trên hệ thống', {
    tag: ['@high', '@major']
  }, async ({ customersPage }) => {
    const existingTaxCode = '0092345234';

    Logger.step(1, 'Mở hộp thoại Thêm Khách hàng mới');
    await customersPage.openCreateModal();

    Logger.step(2, 'Nhập mã số thuế xuất hóa đơn đã tồn tại trong hệ thống');
    await customersPage.invoiceTaxCodeInput.fill(existingTaxCode);

    Logger.step('Verify 1', 'Nút "Check trùng MST" thông tin xuất hóa đơn được kích hoạt');
    await expect(customersPage.checkInvoiceMstButton).toBeEnabled();

    Logger.step(3, 'Nhấn nút "Check trùng MST" của khối Thông tin xuất hóa đơn');
    await customersPage.clickCheckInvoiceMst();

    Logger.step('Verify 2', 'Hiển thị thông báo tìm thấy khách hàng trùng');
    await expect(customersPage.duplicateFoundToast).toBeVisible({ timeout: 10000 });

    Logger.step('Teardown', 'Đóng hộp thoại');
    await customersPage.closeCreateModal();
  });

  test('TC_CUST_040: Kiểm tra trùng Số điện thoại khách hàng Cá nhân khi SĐT ĐÃ TỒN TẠI trên hệ thống', {
    tag: ['@high', '@critical']
  }, async ({ customersPage }) => {
    const existingPhone = '0869889070';

    Logger.step(1, 'Mở hộp thoại Thêm Khách hàng mới và chuyển sang nhóm "Cá nhân"');
    await customersPage.openCreateModal();
    await customersPage.selectPersonalCustomerType();

    Logger.step(2, 'Nhập số điện thoại cá nhân đã tồn tại trong hệ thống');
    await customersPage.personalPhoneInput.fill(existingPhone);

    Logger.step('Verify 1', 'Nút "Check trùng SĐT" được kích hoạt');
    await expect(customersPage.checkPersonalPhoneButton).toBeEnabled();

    Logger.step(3, 'Nhấn nút "Check trùng SĐT"');
    await customersPage.clickCheckPersonalPhone();

    Logger.step('Verify 2', 'Hiển thị thông báo tìm thấy khách hàng trùng kèm thông tin khách hàng');
    await expect(customersPage.duplicateFoundToast).toBeVisible({ timeout: 10000 });

    Logger.step('Teardown', 'Đóng hộp thoại');
    await customersPage.closeCreateModal();
  });

  test('TC_CUST_041: Kiểm tra trùng Số điện thoại khách hàng Cá nhân khi SĐT KHÔNG trùng lặp', {
    tag: ['@high', '@major']
  }, async ({ customersPage }) => {
    const uniquePhone = TestDataGenerator.generatePhoneNumber();

    Logger.step(1, 'Mở hộp thoại Thêm Khách hàng mới và chuyển sang nhóm "Cá nhân"');
    await customersPage.openCreateModal();
    await customersPage.selectPersonalCustomerType();

    Logger.step(2, 'Nhập số điện thoại cá nhân mới chưa từng tồn tại');
    await customersPage.personalPhoneInput.fill(uniquePhone);

    Logger.step(3, 'Nhấn nút "Check trùng SĐT"');
    await customersPage.clickCheckPersonalPhone();

    Logger.step('Verify', 'Hiển thị thông báo "Không tìm thấy khách hàng trùng."');
    await expect(customersPage.noDuplicateToast).toBeVisible({ timeout: 10000 });

    Logger.step('Teardown', 'Đóng hộp thoại');
    await customersPage.closeCreateModal();
  });
});

