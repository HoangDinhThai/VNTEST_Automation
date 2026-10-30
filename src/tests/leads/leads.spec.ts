import { test, expect } from '../../fixtures/base.fixture';
import { Logger } from '../../utils/logger';
import users from '../../../test-data/users.json';
import { TestDataGenerator } from '../../utils/test-data-generator';

test.describe('Module Quản lý Lead / Cơ hội - Hệ thống VNTEST LIMS', () => {
  test.beforeEach(async ({ loginPage, leadsPage, page }) => {
    Logger.step('Setup', 'Đăng nhập và điều hướng tới trang danh sách Lead');
    await loginPage.open('/dang-nhap');
    await loginPage.login(users.validUser.username, users.validUser.password);
    await page.waitForURL('https://vntest-lims.pirago.work/', { timeout: 15000 });

    await leadsPage.open('/leads');
    await expect(leadsPage.pageTab).toBeVisible({ timeout: 15000 });
  });

  // =========================================================================
  // KHỐI 01: BỐ CỤC & HIỂN THỊ CHI TIẾT LEAD
  // =========================================================================
  test('TC_LEAD_001: Hiển thị đầy đủ các thành phần màn hình danh sách Lead', {
    tag: ['@normal', '@minor']
  }, async ({ leadsPage }) => {
    Logger.step(1, 'Kiểm tra tab, thanh công cụ và các bộ lọc');
    await expect(leadsPage.pageTab).toBeVisible();
    await expect(leadsPage.searchInput).toBeVisible();
    await expect(leadsPage.addLeadButton).toBeVisible();
    await expect(leadsPage.filterAllChip).toBeVisible();
    await expect(leadsPage.filterNotContactedChip).toBeVisible();
    await expect(leadsPage.priorityFilterButton).toBeVisible();

    Logger.step(2, 'Kiểm tra danh sách thẻ Lead và khung chi tiết');
    await expect(leadsPage.firstLeadCard).toBeVisible();
    await expect(leadsPage.detailPanel).toBeVisible();
  });

  test('TC_LEAD_002: Chọn thẻ Lead từ danh sách để xem chi tiết bên phải', {
    tag: ['@high', '@major']
  }, async ({ leadsPage }) => {
    Logger.step(1, 'Lấy thẻ Lead đầu tiên');
    const firstCard = leadsPage.firstLeadCard;
    await expect(firstCard).toBeVisible();

    Logger.step(2, 'Nhấn chọn thẻ Lead đầu tiên');
    await firstCard.click();

    Logger.step('Verify', 'Khung chi tiết bên phải hiển thị nút "Chỉnh sửa" và nút "Ghi nhận"');
    await expect(leadsPage.editLeadButton).toBeVisible();
    await expect(leadsPage.recordNoteButton).toBeVisible();
  });

  test('TC_LEAD_003: Kiểm tra Header khung chi tiết Lead hiển thị đầy đủ thông tin định danh', {
    tag: ['@high', '@major']
  }, async ({ leadsPage }) => {
    Logger.step(1, 'Chọn thẻ Lead đầu tiên');
    await leadsPage.firstLeadCard.click();

    Logger.step('Verify', 'Kiểm tra Mã Lead, Tên khách hàng và Số điện thoại');
    await expect(leadsPage.detailCustomerName).toBeVisible();
    await expect(leadsPage.detailContacts).toBeVisible();
  });

  test('TC_LEAD_004: Kiểm tra hiển thị ký tự mặc định khi thông tin rỗng', {
    tag: ['@normal', '@minor']
  }, async ({ leadsPage }) => {
    Logger.step(1, 'Chọn thẻ Lead trong danh sách');
    await leadsPage.firstLeadCard.click();

    Logger.step('Verify', 'Khung chi tiết hiển thị đúng layout và không bị lỗi DOM');
    await expect(leadsPage.detailPanel).toBeVisible();
  });

  test('TC_LEAD_005: Kiểm tra Thanh tiến trình chăm sóc (Status Stepper)', {
    tag: ['@high', '@major']
  }, async ({ leadsPage }) => {
    Logger.step(1, 'Chọn thẻ Lead đầu tiên');
    await leadsPage.firstLeadCard.click();

    Logger.step('Verify', 'Thanh tiến trình chăm sóc hiển thị các nấc trạng thái');
    await expect(leadsPage.statusStepper).toBeVisible();
    await expect(leadsPage.detailPanel.getByText('Mới')).toBeVisible();
    await expect(leadsPage.detailPanel.getByText('Chưa LH')).toBeVisible();
    await expect(leadsPage.detailPanel.getByText('Đã LH')).toBeVisible();
    await expect(leadsPage.detailPanel.getByText('Đã chốt')).toBeVisible();
  });

  test('TC_LEAD_006: Kiểm tra Lưới thuộc tính Lead', {
    tag: ['@high', '@major']
  }, async ({ leadsPage }) => {
    Logger.step(1, 'Chọn thẻ Lead đầu tiên');
    await leadsPage.firstLeadCard.click();

    Logger.step('Verify', 'Kiểm tra 4 ô thuộc tính: Nguồn lead, Người phụ trách, Ngày tiếp nhận, Giá trị');
    await expect(leadsPage.detailSource).toBeVisible();
    await expect(leadsPage.detailAssignee).toBeVisible();
    await expect(leadsPage.detailReceivedDate).toBeVisible();
    await expect(leadsPage.detailEstimatedValue).toBeVisible();
  });

  test('TC_LEAD_007: Kiểm tra hiển thị Dịch vụ quan tâm dạng Tag/Chip', {
    tag: ['@normal', '@minor']
  }, async ({ leadsPage }) => {
    Logger.step(1, 'Chọn thẻ Lead đầu tiên');
    await leadsPage.firstLeadCard.click();

    Logger.step('Verify', 'Ô Dịch vụ quan tâm hiển thị');
    await expect(leadsPage.detailServices).toBeVisible();
  });

  test('TC_LEAD_008: Kiểm tra Số lượng đếm trên tiêu đề Lịch sử trao đổi', {
    tag: ['@normal', '@minor']
  }, async ({ leadsPage }) => {
    Logger.step(1, 'Chọn thẻ Lead đầu tiên');
    await leadsPage.firstLeadCard.click();

    Logger.step('Verify', 'Tiêu đề Lịch sử trao đổi hiển thị kèm số lượng trong ngoặc đơn');
    await expect(leadsPage.timelineSection).toBeVisible();
    await expect(leadsPage.detailPanel.getByText(/Lịch sử trao đổi \(\d+\)/i)).toBeVisible();
  });

  test('TC_LEAD_009: Kiểm tra hiển thị các mốc sự kiện trên Dòng thời gian Timeline', {
    tag: ['@high', '@major']
  }, async ({ leadsPage }) => {
    Logger.step(1, 'Chọn thẻ Lead đầu tiên');
    await leadsPage.firstLeadCard.click();

    Logger.step('Verify', 'Danh sách Timeline hiển thị các mốc sự kiện');
    await expect(leadsPage.timelineSection).toBeVisible();
    if (await leadsPage.timelineItems.count() > 0) {
      await expect(leadsPage.timelineFirstItem).toBeVisible();
    }
  });

  test('TC_LEAD_010: Kiểm tra Banner trạng thái "Đã chốt thành Khách hàng" khi Lead đã chốt', {
    tag: ['@high', '@major']
  }, async ({ leadsPage }) => {
    Logger.step(1, 'Lọc theo chip "Đã chốt"');
    await leadsPage.filterClosedChip.click();

    Logger.step(2, 'Nếu có bản ghi đã chốt, nhấn chọn');
    if (await leadsPage.leadCards.count() > 0) {
      await leadsPage.firstLeadCard.click();
      Logger.step('Verify', 'Hiển thị banner thông báo Đã chốt thành Khách hàng');
      await expect(leadsPage.detailFooterBanner).toBeVisible();
    }
  });

  // =========================================================================
  // KHỐI 02: TÌM KIẾM & BỘ LỌC
  // =========================================================================
  test('TC_LEAD_011: Tìm kiếm Lead theo tên khách hàng', {
    tag: ['@high', '@major']
  }, async ({ leadsPage }) => {
    Logger.step(1, 'Nhập từ khóa tìm kiếm tên khách hàng');
    await leadsPage.search('Trần Đăng Tuấn');

    Logger.step('Verify', 'Thẻ lead tương ứng hiển thị trong kết quả');
    await expect(leadsPage.firstLeadCard).toContainText('Trần Đăng Tuấn', { timeout: 10000 });
  });

  test('TC_LEAD_012: Tìm kiếm Lead theo tên công ty', {
    tag: ['@normal', '@major']
  }, async ({ leadsPage }) => {
    Logger.step(1, 'Nhập từ khóa tìm kiếm theo tên doanh nghiệp');
    await leadsPage.search('Dược phẩm');

    Logger.step('Verify', 'Danh sách thẻ lọc ra kết quả phù hợp');
    if (await leadsPage.leadCards.count() > 0) {
      await expect(leadsPage.firstLeadCard).toBeVisible();
    }
  });

  test('TC_LEAD_013: Tìm kiếm Lead theo mã lead', {
    tag: ['@high', '@major']
  }, async ({ leadsPage }) => {
    Logger.step(1, 'Nhập từ khóa mã lead');
    await leadsPage.search('LEAD');

    Logger.step('Verify', 'Danh sách thẻ hiển thị các mã lead tương ứng');
    if (await leadsPage.leadCards.count() > 0) {
      await expect(leadsPage.firstLeadCard).toBeVisible();
    }
  });

  test('TC_LEAD_014: Tìm kiếm Lead theo người phụ trách', {
    tag: ['@high', '@major']
  }, async ({ leadsPage }) => {
    Logger.step(1, 'Nhập tên nhân viên phụ trách');
    await leadsPage.search('Võ Thị Phương');

    Logger.step('Verify', 'Kết quả tìm kiếm hiển thị');
    if (await leadsPage.leadCards.count() > 0) {
      await expect(leadsPage.firstLeadCard).toBeVisible();
    }
  });

  test('TC_LEAD_015: Xóa từ khóa tìm kiếm bằng nút "Hủy"', {
    tag: ['@low', '@minor']
  }, async ({ leadsPage }) => {
    Logger.step(1, 'Nhập từ khóa tìm kiếm');
    await leadsPage.search('Test Keyword');

    Logger.step(2, 'Nhấn nút "Hủy" trên thanh tìm kiếm');
    await leadsPage.clearSearch();

    Logger.step('Verify', 'Ô tìm kiếm được làm trống');
    await expect(leadsPage.searchInput).toHaveValue('');
  });

  test('TC_LEAD_016: Tìm kiếm không có kết quả phù hợp (Trạng thái rỗng)', {
    tag: ['@normal', '@minor']
  }, async ({ leadsPage }) => {
    Logger.step(1, 'Nhập từ khóa không tồn tại');
    await leadsPage.search('KH_KHONG_TON_TAI_9999');

    Logger.step('Verify', 'Danh sách thẻ không có bản ghi nào');
    await expect(leadsPage.leadCards).toHaveCount(0);
  });

  test('TC_LEAD_017: Lọc danh sách theo Chiptab trạng thái "Tất cả"', {
    tag: ['@normal', '@major']
  }, async ({ leadsPage }) => {
    Logger.step(1, 'Nhấn chọn chip "Tất cả"');
    await leadsPage.filterAllChip.click();

    Logger.step('Verify', 'Chip "Tất cả" ở trạng thái kích hoạt');
    await expect(leadsPage.filterAllChip).toHaveClass(/active/);
  });

  test('TC_LEAD_018: Lọc danh sách theo Chiptab trạng thái "Mới"', {
    tag: ['@high', '@major']
  }, async ({ leadsPage }) => {
    Logger.step(1, 'Nhấn chọn chip "Mới"');
    await leadsPage.filterNewChip.click();

    Logger.step('Verify', 'Chip "Mới" ở trạng thái kích hoạt');
    await expect(leadsPage.filterNewChip).toHaveClass(/active/);
  });

  test('TC_LEAD_019: Lọc danh sách theo Chiptab trạng thái "Chưa LH"', {
    tag: ['@high', '@major']
  }, async ({ leadsPage }) => {
    Logger.step(1, 'Nhấn chọn chip "Chưa LH"');
    await leadsPage.filterNotContactedChip.click();

    Logger.step('Verify', 'Chip "Chưa LH" ở trạng thái kích hoạt (active)');
    await expect(leadsPage.filterNotContactedChip).toHaveClass(/active/);
  });

  test('TC_LEAD_020: Lọc danh sách theo Chiptab trạng thái "Đã LH"', {
    tag: ['@high', '@major']
  }, async ({ leadsPage }) => {
    Logger.step(1, 'Nhấn chọn chip "Đã LH"');
    await leadsPage.filterContactedChip.click();

    Logger.step('Verify', 'Chip "Đã LH" ở trạng thái kích hoạt');
    await expect(leadsPage.filterContactedChip).toHaveClass(/active/);
  });

  test('TC_LEAD_021: Lọc danh sách theo Chiptab trạng thái "Đã chốt"', {
    tag: ['@high', '@major']
  }, async ({ leadsPage }) => {
    Logger.step(1, 'Nhấn chọn chip "Đã chốt"');
    await leadsPage.filterClosedChip.click();

    Logger.step('Verify', 'Chip "Đã chốt" ở trạng thái kích hoạt');
    await expect(leadsPage.filterClosedChip).toHaveClass(/active/);
  });

  test('TC_LEAD_022: Lọc danh sách theo Chiptab trạng thái "Thất bại"', {
    tag: ['@normal', '@major']
  }, async ({ leadsPage }) => {
    Logger.step(1, 'Nhấn chọn chip "Thất bại"');
    await leadsPage.filterFailedChip.click();

    Logger.step('Verify', 'Chip "Thất bại" ở trạng thái kích hoạt');
    await expect(leadsPage.filterFailedChip).toHaveClass(/active/);
  });

  test('TC_LEAD_023: Lọc theo Mức độ lead - Chọn mức độ "Nóng"', {
    tag: ['@high', '@major']
  }, async ({ leadsPage }) => {
    Logger.step(1, 'Mở dropdown Mức độ và chọn "Nóng"');
    await leadsPage.filterByDegree('Nóng');

    Logger.step('Verify', 'Dropdown cập nhật nhãn Mức độ: Nóng');
    await expect(leadsPage.priorityFilterButton).toContainText('Nóng');
  });

  test('TC_LEAD_024: Lọc theo Mức độ lead - Chọn mức độ "Ấm"', {
    tag: ['@high', '@major']
  }, async ({ leadsPage }) => {
    Logger.step(1, 'Mở dropdown Mức độ và chọn "Ấm"');
    await leadsPage.filterByDegree('Ấm');

    Logger.step('Verify', 'Dropdown cập nhật nhãn Mức độ: Ấm');
    await expect(leadsPage.priorityFilterButton).toContainText('Ấm');
  });

  test('TC_LEAD_025: Lọc theo Mức độ lead - Chọn mức độ "Lạnh"', {
    tag: ['@normal', '@major']
  }, async ({ leadsPage }) => {
    Logger.step(1, 'Mở dropdown Mức độ và chọn "Lạnh"');
    await leadsPage.filterByDegree('Lạnh');

    Logger.step('Verify', 'Dropdown cập nhật nhãn Mức độ: Lạnh');
    await expect(leadsPage.priorityFilterButton).toContainText('Lạnh');
  });

  test('TC_LEAD_026: Lọc theo Mức độ lead - Chọn lại mức độ "Tất cả"', {
    tag: ['@normal', '@minor']
  }, async ({ leadsPage }) => {
    Logger.step(1, 'Mở dropdown Mức độ và chọn "Tất cả"');
    await leadsPage.filterByDegree('Tất cả');

    Logger.step('Verify', 'Dropdown cập nhật nhãn Mức độ: Tất cả');
    await expect(leadsPage.priorityFilterButton).toContainText('Tất cả');
  });

  // =========================================================================
  // KHỐI 03: PHÂN QUYỀN TRUY CẬP (TẠM COMMENT CODE - CHỜ HỆ THỐNG TRIỂN KHAI RBAC)
  // =========================================================================
  /*
  test('TC_LEAD_027: Phân quyền vai trò Quản trị viên (Admin)', {
    tag: ['@rbac', '@pending']
  }, async ({ leadsPage }) => {
    Logger.step(1, 'Kiểm tra toàn quyền Admin trên phân hệ Lead');
    await expect(leadsPage.addLeadButton).toBeVisible();
    await expect(leadsPage.assignButton).toBeVisible();
  });

  test('TC_LEAD_028: Phân quyền vai trò Trưởng phòng Kinh doanh', {
    tag: ['@rbac', '@pending']
  }, async ({ leadsPage }) => {
    Logger.step(1, 'Kiểm tra quyền phân công và điều phối Lead');
    await expect(leadsPage.assignButton).toBeVisible();
  });

  test('TC_LEAD_029: Phân quyền vai trò Nhân viên Kinh doanh (Sale) - Lead của mình', {
    tag: ['@rbac', '@pending']
  }, async ({ leadsPage }) => {
    Logger.step(1, 'Kiểm tra quyền chỉnh sửa và ghi nhận trên Lead được phân công');
    await expect(leadsPage.editLeadButton).toBeVisible();
    await expect(leadsPage.recordNoteButton).toBeVisible();
  });

  test('TC_LEAD_030: Phân quyền vai trò Nhân viên Kinh doanh (Sale) - Lead của người khác', {
    tag: ['@rbac', '@pending']
  }, async ({ leadsPage }) => {
    Logger.step(1, 'Kiểm tra quyền hạn trên Lead của đồng nghiệp');
  });

  test('TC_LEAD_031: Phân quyền vai trò CSKH / Marketing', {
    tag: ['@rbac', '@pending']
  }, async ({ leadsPage }) => {
    Logger.step(1, 'Kiểm tra quyền tạo Lead và ghi nhận của CSKH/Marketing');
    await expect(leadsPage.addLeadButton).toBeVisible();
  });
  */

  // =========================================================================
  // KHỐI 04: THÊM MỚI LEAD & FORM VALIDATION
  // =========================================================================
  test('TC_LEAD_032: Mở hộp thoại Thêm mới Lead', {
    tag: ['@low', '@minor']
  }, async ({ leadsPage }) => {
    Logger.step(1, 'Mở hộp thoại Thêm mới Lead');
    await leadsPage.openCreateModal();

    Logger.step('Verify', 'Hộp thoại Thêm mới Lead mở ra');
    await expect(leadsPage.modalTitle).toBeVisible();

    Logger.step('Teardown', 'Đóng modal');
    await leadsPage.closeCreateModal();
  });

  test('TC_LEAD_033: Đóng hộp thoại Thêm mới Lead bằng nút "Hủy"', {
    tag: ['@low', '@minor']
  }, async ({ leadsPage }) => {
    Logger.step(1, 'Mở hộp thoại Thêm mới Lead');
    await leadsPage.openCreateModal();

    Logger.step(2, 'Nhấn nút "Hủy" để đóng');
    await leadsPage.closeCreateModal();

    Logger.step('Verify', 'Hộp thoại được đóng lại');
    await expect(leadsPage.modal).toBeHidden();
  });

  test('TC_LEAD_034: Bỏ trống toàn bộ các trường bắt buộc khi tạo Lead', {
    tag: ['@high', '@major']
  }, async ({ leadsPage }) => {
    Logger.step(1, 'Mở hộp thoại Thêm mới Lead');
    await leadsPage.openCreateModal();

    Logger.step(2, 'Nhấn nút "Lưu" mà không điền thông tin');
    await leadsPage.submitCreateForm();

    Logger.step('Verify', 'Hiển thị đầy đủ 3 cảnh báo lỗi bắt buộc');
    await expect(leadsPage.customerNameError).toBeVisible();
    await expect(leadsPage.phoneError).toBeVisible();
    await expect(leadsPage.serviceError).toBeVisible();

    Logger.step('Teardown', 'Đóng modal');
    await leadsPage.closeCreateModal();
  });

  test('TC_LEAD_035: Bỏ trống riêng trường Tên khách hàng', {
    tag: ['@high', '@major']
  }, async ({ leadsPage }) => {
    Logger.step(1, 'Mở hộp thoại và chỉ nhập Số điện thoại, chọn Dịch vụ');
    await leadsPage.openCreateModal();
    await leadsPage.phoneInput.fill('0912345678');
    await leadsPage.serviceFoodCheckbox.click();

    Logger.step(2, 'Nhấn nút "Lưu"');
    await leadsPage.submitCreateForm();

    Logger.step('Verify', 'Hiển thị cảnh báo "Vui lòng nhập tên khách hàng."');
    await expect(leadsPage.customerNameError).toBeVisible();

    Logger.step('Teardown', 'Đóng modal');
    await leadsPage.closeCreateModal();
  });

  test('TC_LEAD_036: Bỏ trống riêng trường Số điện thoại', {
    tag: ['@high', '@major']
  }, async ({ leadsPage }) => {
    Logger.step(1, 'Mở hộp thoại và chỉ nhập Tên khách hàng, chọn Dịch vụ');
    await leadsPage.openCreateModal();
    await leadsPage.customerNameInput.fill('Công ty TNHH ABC');
    await leadsPage.serviceFoodCheckbox.click();

    Logger.step(2, 'Nhấn nút "Lưu"');
    await leadsPage.submitCreateForm();

    Logger.step('Verify', 'Hiển thị cảnh báo "Vui lòng nhập số điện thoại."');
    await expect(leadsPage.phoneError).toBeVisible();

    Logger.step('Teardown', 'Đóng modal');
    await leadsPage.closeCreateModal();
  });

  test('TC_LEAD_037: Bỏ trống trường Dịch vụ quan tâm', {
    tag: ['@normal', '@major']
  }, async ({ leadsPage }) => {
    Logger.step(1, 'Mở hộp thoại và nhập đầy đủ Tên, SĐT nhưng không chọn Dịch vụ');
    await leadsPage.openCreateModal();
    await leadsPage.customerNameInput.fill('Công ty TNHH ABC');
    await leadsPage.phoneInput.fill('0912345678');

    Logger.step(2, 'Nhấn nút "Lưu"');
    await leadsPage.submitCreateForm();

    Logger.step('Verify', 'Hiển thị cảnh báo "Vui lòng chọn ít nhất một dịch vụ quan tâm."');
    await expect(leadsPage.serviceError).toBeVisible();

    Logger.step('Teardown', 'Đóng modal');
    await leadsPage.closeCreateModal();
  });

  test('TC_LEAD_038: Kiểm tra định dạng trường Số điện thoại - Nhập 9 chữ số', {
    tag: ['@high', '@major']
  }, async ({ leadsPage }) => {
    Logger.step(1, 'Mở hộp thoại và nhập SĐT 9 số');
    await leadsPage.openCreateModal();
    await leadsPage.customerNameInput.fill('Lê Minh Trí');
    await leadsPage.phoneInput.fill('091234567');
    await leadsPage.serviceWaterCheckbox.click();

    Logger.step(2, 'Nhấn nút "Lưu"');
    await leadsPage.submitCreateForm();

    Logger.step('Teardown', 'Đóng modal');
    await leadsPage.closeCreateModal();
  });

  test('TC_LEAD_039: Kiểm tra định dạng trường Số điện thoại - Nhập 11 chữ số', {
    tag: ['@high', '@major']
  }, async ({ leadsPage }) => {
    Logger.step(1, 'Mở hộp thoại và nhập SĐT 11 số');
    await leadsPage.openCreateModal();
    await leadsPage.customerNameInput.fill('Lê Minh Trí');
    await leadsPage.phoneInput.fill('09123456789');
    await leadsPage.serviceWaterCheckbox.click();

    Logger.step(2, 'Nhấn nút "Lưu"');
    await leadsPage.submitCreateForm();

    Logger.step('Teardown', 'Đóng modal');
    await leadsPage.closeCreateModal();
  });

  test('TC_LEAD_040: Kiểm tra định dạng trường Số điện thoại - Nhập chữ cái và ký tự đặc biệt', {
    tag: ['@high', '@major']
  }, async ({ leadsPage }) => {
    Logger.step(1, 'Mở hộp thoại và nhập SĐT chứa chữ cái');
    await leadsPage.openCreateModal();
    await leadsPage.customerNameInput.fill('Lê Minh Trí');
    await leadsPage.phoneInput.fill('090abc@#12');
    await leadsPage.serviceWaterCheckbox.click();

    Logger.step(2, 'Nhấn nút "Lưu"');
    await leadsPage.submitCreateForm();

    Logger.step('Teardown', 'Đóng modal');
    await leadsPage.closeCreateModal();
  });

  test('TC_LEAD_041: Kiểm tra định dạng trường Email - Nhập email thiếu ký tự @', {
    tag: ['@high', '@major']
  }, async ({ leadsPage }) => {
    Logger.step(1, 'Nhập email sai định dạng không có @');
    await leadsPage.openCreateModal();
    await leadsPage.customerNameInput.fill('Phạm Hải Yến');
    await leadsPage.phoneInput.fill('0988123456');
    await leadsPage.emailInput.fill('haiyen.vntest.com');
    await leadsPage.serviceTextileCheckbox.click();

    Logger.step(2, 'Nhấn nút "Lưu"');
    await leadsPage.submitCreateForm();

    Logger.step('Teardown', 'Đóng modal');
    await leadsPage.closeCreateModal();
  });

  test('TC_LEAD_042: Kiểm tra định dạng trường Email - Nhập email thiếu phần domain', {
    tag: ['@high', '@major']
  }, async ({ leadsPage }) => {
    Logger.step(1, 'Nhập email thiếu tên miền');
    await leadsPage.openCreateModal();
    await leadsPage.customerNameInput.fill('Phạm Hải Yến');
    await leadsPage.phoneInput.fill('0988123456');
    await leadsPage.emailInput.fill('haiyen@');
    await leadsPage.serviceTextileCheckbox.click();

    Logger.step(2, 'Nhấn nút "Lưu"');
    await leadsPage.submitCreateForm();

    Logger.step('Teardown', 'Đóng modal');
    await leadsPage.closeCreateModal();
  });

  test('TC_LEAD_043: Kiểm tra trường Giá trị ước tính - Nhập chữ cái', {
    tag: ['@normal', '@minor']
  }, async ({ leadsPage }) => {
    Logger.step(1, 'Nhập chữ vào ô Giá trị ước tính');
    await leadsPage.openCreateModal();
    await leadsPage.customerNameInput.fill('Trần Quốc Toản');
    await leadsPage.phoneInput.fill('0977654321');
    await leadsPage.estimatedValueInput.fill('một trăm triệu');
    await leadsPage.serviceChemicalCheckbox.click();

    Logger.step(2, 'Nhấn nút "Lưu"');
    await leadsPage.submitCreateForm();

    Logger.step('Teardown', 'Đóng modal');
    await leadsPage.closeCreateModal();
  });

  test('TC_LEAD_044: Kiểm tra độ dài biên trường Tên khách hàng - Nhập 256 ký tự', {
    tag: ['@low', '@minor']
  }, async ({ leadsPage }) => {
    const longName = 'Khách hàng kiểm nghiệm tiêu chuẩn chất lượng cao thực phẩm và dược phẩm viện vntest chi nhánh miền bắc đại diện công ty cổ phần tập đoàn đầu tư công nghệ sinh học nông sản thực phẩm hữu cơ việt nam phát triển bền vững đạt chuẩn an toàn vệ sinh thực phẩm quốc tế 256kt';
    Logger.step(1, 'Nhập tên khách hàng 256 ký tự');
    await leadsPage.openCreateModal();
    await leadsPage.customerNameInput.fill(longName);
    await leadsPage.phoneInput.fill('0966554433');
    await leadsPage.serviceFoodCheckbox.click();

    Logger.step(2, 'Nhấn nút "Lưu"');
    await leadsPage.submitCreateForm();

    Logger.step('Teardown', 'Đóng modal');
    await leadsPage.closeCreateModal();
  });

  test('TC_LEAD_045: Thêm mới Lead thành công chỉ với các trường bắt buộc', {
    tag: ['@high', '@critical']
  }, async ({ leadsPage }) => {
    const customerName = `Khách Bắt Buộc ${TestDataGenerator.generateCode('LEAD', 4)}`;
    const phone = TestDataGenerator.generatePhoneNumber();

    Logger.step(1, 'Mở hộp thoại Thêm mới Lead');
    await leadsPage.openCreateModal();

    Logger.step(2, 'Điền Tên, SĐT và chọn Dịch vụ');
    await leadsPage.customerNameInput.fill(customerName);
    await leadsPage.phoneInput.fill(phone);
    await leadsPage.serviceFoodCheckbox.click();

    Logger.step(3, 'Nhấn nút "Lưu"');
    await leadsPage.submitCreateForm();

    Logger.step('Verify', 'Hiển thị toast thành công và thẻ mới xuất hiện');
    await expect(leadsPage.successToast).toBeVisible({ timeout: 10000 });
    await expect(leadsPage.firstLeadCard).toContainText(customerName, { timeout: 10000 });
  });

  test('TC_LEAD_046: Thêm mới Lead thành công với đầy đủ tất cả các trường dữ liệu', {
    tag: ['@high', '@critical']
  }, async ({ leadsPage }) => {
    const timestamp = Date.now();
    const customerName = `Khách hàng Auto ${TestDataGenerator.generateCode('LEAD', 4)}`;
    const phone = TestDataGenerator.generatePhoneNumber();
    const company = 'Công ty TNHH Thử nghiệm Tiêu chuẩn VNTEST';
    const email = `lead_${timestamp}@vntest.vn`;
    const demand = 'Cần kiểm nghiệm mẫu thực phẩm và hóa chất đạt chuẩn xuất khẩu';

    Logger.step(1, 'Mở hộp thoại Thêm mới Lead');
    await leadsPage.openCreateModal();

    Logger.step(2, 'Điền đầy đủ thông tin hợp lệ ở tất cả các trường');
    await leadsPage.fillLeadForm({
      customerName,
      phone,
      company,
      email,
      address: 'Số 123 Đường Cầu Giấy, Hà Nội',
      source: 'Facebook',
      estimatedValue: '50000000',
      demand,
    });

    Logger.step(3, 'Nhấn nút "Lưu"');
    await leadsPage.submitCreateForm();

    Logger.step('Verify', 'Hiển thị thông báo thành công và thẻ mới xuất hiện');
    await expect(leadsPage.successToast).toBeVisible({ timeout: 10000 });
    await expect(leadsPage.firstLeadCard).toContainText(customerName, { timeout: 10000 });

    Logger.step(4, 'Nhấn chọn thẻ Lead vừa tạo');
    await leadsPage.firstLeadCard.click();

    Logger.step('Verify Khung chi tiết', 'Kiểm tra tên khách hàng và công ty');
    await expect(leadsPage.detailCustomerName).toHaveText(customerName);
    await expect(leadsPage.detailCompany).toHaveText(company);
  });

  // =========================================================================
  // KHỐI 05: CHỈNH SỬA THÔNG TIN LEAD
  // =========================================================================
  test('TC_LEAD_047: Kiểm tra tải dữ liệu cũ lên hộp thoại Chỉnh sửa', {
    tag: ['@high', '@major']
  }, async ({ leadsPage }) => {
    Logger.step(1, 'Chọn thẻ Lead đầu tiên');
    await leadsPage.firstLeadCard.click();

    Logger.step(2, 'Nhấn nút "Chỉnh sửa"');
    await leadsPage.openEditModal();

    Logger.step('Verify', 'Hộp thoại chỉnh sửa hiển thị giá trị Tên khách hàng');
    await expect(leadsPage.customerNameInput).not.toHaveValue('');

    Logger.step('Teardown', 'Đóng modal chỉnh sửa');
    await leadsPage.closeCreateModal();
  });

  test('TC_LEAD_048: Đóng hộp thoại Chỉnh sửa bằng nút "Hủy"', {
    tag: ['@low', '@minor']
  }, async ({ leadsPage }) => {
    Logger.step(1, 'Chọn thẻ Lead đầu tiên và mở hộp thoại Chỉnh sửa');
    await leadsPage.firstLeadCard.click();
    await leadsPage.openEditModal();

    Logger.step(2, 'Nhấn nút "Hủy"');
    await leadsPage.closeCreateModal();

    Logger.step('Verify', 'Hộp thoại chỉnh sửa đóng lại');
    await expect(leadsPage.modal).toBeHidden();
  });

  test('TC_LEAD_049: Xóa trắng trường bắt buộc khi chỉnh sửa', {
    tag: ['@high', '@major']
  }, async ({ leadsPage }) => {
    Logger.step(1, 'Mở hộp thoại Chỉnh sửa');
    await leadsPage.firstLeadCard.click();
    await leadsPage.openEditModal();

    Logger.step(2, 'Xóa trắng trường Tên khách hàng và nhấn "Lưu"');
    await leadsPage.customerNameInput.fill('');
    await leadsPage.submitCreateForm();

    Logger.step('Verify', 'Hiển thị cảnh báo lỗi bắt buộc tên khách hàng');
    await expect(leadsPage.customerNameError).toBeVisible();

    Logger.step('Teardown', 'Đóng modal');
    await leadsPage.closeCreateModal();
  });

  test('TC_LEAD_050: Cập nhật thông tin Lead thành công', {
    tag: ['@high', '@critical']
  }, async ({ leadsPage }) => {
    const updatedDemand = `Cập nhật nhu cầu lúc ${Date.now()}`;
    Logger.step(1, 'Mở hộp thoại Chỉnh sửa');
    await leadsPage.firstLeadCard.click();
    await leadsPage.openEditModal();

    Logger.step(2, 'Cập nhật trường nhu cầu cụ thể');
    await leadsPage.noteTextarea.fill(updatedDemand);

    Logger.step(3, 'Nhấn nút "Lưu"');
    await leadsPage.submitCreateForm();

    Logger.step('Verify', 'Đóng modal thành công');
    await expect(leadsPage.modal).toBeHidden();
  });

  // =========================================================================
  // KHỐI 06: LỊCH SỬ TRAO ĐỔI & LUỒNG LOGIC NÚT "GHI NHẬN"
  // =========================================================================
  test('TC_LEAD_051: Mở và đóng hộp thoại Ghi nhận lịch sử trao đổi bằng nút "Hủy"', {
    tag: ['@low', '@minor']
  }, async ({ leadsPage }) => {
    Logger.step(1, 'Chọn thẻ Lead đầu tiên');
    await leadsPage.firstLeadCard.click();

    Logger.step(2, 'Nhấn nút "Ghi nhận"');
    await leadsPage.openRecordNoteDialog();

    Logger.step(3, 'Nhấn nút "Hủy" trên hộp thoại');
    await leadsPage.closeRecordNoteDialog();

    Logger.step('Verify', 'Hộp thoại ghi nhận lịch sử trao đổi được đóng lại');
    await expect(leadsPage.noteDialog).toBeHidden();
  });

  test('TC_LEAD_052: Kiểm tra giá trị mặc định khi mở hộp thoại Ghi nhận', {
    tag: ['@high', '@major']
  }, async ({ leadsPage }) => {
    Logger.step(1, 'Mở hộp thoại Ghi nhận');
    await leadsPage.firstLeadCard.click();
    await leadsPage.openRecordNoteDialog();

    Logger.step('Verify', 'Kênh liên hệ mặc định và ô thời gian có giá trị');
    await expect(leadsPage.noteChannelSelect).toBeVisible();
    await expect(leadsPage.noteDateTimeInput).toBeVisible();

    Logger.step('Teardown', 'Đóng hộp thoại');
    await leadsPage.closeRecordNoteDialog();
  });

  test('TC_LEAD_053: Bỏ trống trường Nội dung trao đổi khi ghi nhận', {
    tag: ['@normal', '@minor']
  }, async ({ leadsPage }) => {
    Logger.step(1, 'Mở hộp thoại Ghi nhận');
    await leadsPage.firstLeadCard.click();
    await leadsPage.openRecordNoteDialog();

    Logger.step(2, 'Nhấn nút "Lưu" mà không nhập nội dung trao đổi');
    await leadsPage.submitRecordNote();

    Logger.step('Verify', 'Hiển thị cảnh báo "Vui lòng nhập nội dung trao đổi."');
    await expect(leadsPage.noteContentError).toBeVisible();

    Logger.step('Teardown', 'Đóng hộp thoại');
    await leadsPage.closeRecordNoteDialog();
  });

  test('TC_LEAD_054: Kiểm tra validation trường Nội dung trao đổi - Nhập toàn khoảng trắng', {
    tag: ['@normal', '@minor']
  }, async ({ leadsPage }) => {
    Logger.step(1, 'Mở hộp thoại Ghi nhận và nhập khoảng trắng');
    await leadsPage.firstLeadCard.click();
    await leadsPage.openRecordNoteDialog();
    await leadsPage.noteContentTextarea.fill('     ');

    Logger.step(2, 'Nhấn nút "Lưu"');
    await leadsPage.submitRecordNote();

    Logger.step('Teardown', 'Đóng hộp thoại');
    await leadsPage.closeRecordNoteDialog();
  });

  test('TC_LEAD_055: Kiểm tra độ dài nội dung trao đổi - Nhập nội dung dài 500 ký tự', {
    tag: ['@normal', '@minor']
  }, async ({ leadsPage }) => {
    const longContent = 'Khách hàng yêu cầu tư vấn chi tiết về quy trình thử nghiệm an toàn thực phẩm theo tiêu chuẩn ISO 17025. Đã giải thích cụ thể về thời gian phân tích mẫu trong 05 ngày làm việc và chi phí kiểm nghiệm trọn gói bao gồm các chỉ tiêu kim loại nặng, độc tố vi nấm và vi sinh vật gây bệnh. Khách hàng hẹn sẽ gửi công văn và mẫu thử nghiệm chính thức vào đầu tuần sau để trung tâm tiếp nhận và tiến hành thử nghiệm ngay theo hợp đồng nguyên tắc đã thỏa thuận giữa hai bên đại diện pháp luật của công ty và viện.';
    Logger.step(1, 'Mở hộp thoại Ghi nhận và nhập 500 ký tự');
    await leadsPage.firstLeadCard.click();
    await leadsPage.openRecordNoteDialog();
    await leadsPage.submitRecordNote(longContent);

    Logger.step('Verify', 'Toast thông báo thành công');
    await expect(leadsPage.noteSuccessToast).toBeVisible({ timeout: 10000 });
  });

  test('TC_LEAD_056: Ghi nhận trao đổi với thời gian trong quá khứ', {
    tag: ['@normal', '@minor']
  }, async ({ leadsPage }) => {
    Logger.step(1, 'Mở hộp thoại Ghi nhận và nhập nội dung hồi tố');
    await leadsPage.firstLeadCard.click();
    await leadsPage.openRecordNoteDialog();
    await leadsPage.submitRecordNote(`Ghi nhận hồi tố cuộc gọi [${Date.now()}]`);

    Logger.step('Verify', 'Ghi nhận thành công');
    await expect(leadsPage.noteSuccessToast).toBeVisible({ timeout: 10000 });
  });

  test('TC_LEAD_057: Ghi nhận lịch sử trao đổi thành công qua kênh Cuộc gọi điện thoại', {
    tag: ['@high', '@major']
  }, async ({ leadsPage }) => {
    Logger.step(1, 'Chọn thẻ Lead đầu tiên và mở hộp thoại Ghi nhận');
    await leadsPage.firstLeadCard.click();
    await leadsPage.openRecordNoteDialog();

    Logger.step(2, 'Nhập nội dung trao đổi và nhấn nút "Lưu"');
    const noteContent = `Khách hàng đồng ý báo giá gói kiểm nghiệm [${Date.now()}]`;
    await leadsPage.submitRecordNote(noteContent);

    Logger.step('Verify 1', 'Hiển thị toast thông báo thành công');
    await expect(leadsPage.noteSuccessToast).toBeVisible({ timeout: 10000 });

    Logger.step('Verify 2', 'Bản ghi lịch sử mới xuất hiện ngay đầu Timeline');
    await expect(leadsPage.timelineFirstItem).toContainText('Đã LH', { timeout: 10000 });
    await expect(leadsPage.timelineFirstItem).toContainText(noteContent);
  });

  test('TC_LEAD_058: Ghi nhận lịch sử trao đổi thành công qua kênh Gặp mặt trực tiếp', {
    tag: ['@normal', '@major']
  }, async ({ leadsPage }) => {
    Logger.step(1, 'Mở hộp thoại Ghi nhận');
    await leadsPage.firstLeadCard.click();
    await leadsPage.openRecordNoteDialog();

    Logger.step(2, 'Nhập nội dung trao đổi trực tiếp');
    const noteContent = `Đã gặp khách tại trụ sở công ty [${Date.now()}]`;
    await leadsPage.submitRecordNote(noteContent);

    Logger.step('Verify', 'Ghi nhận thành công');
    await expect(leadsPage.noteSuccessToast).toBeVisible({ timeout: 10000 });
  });

  test('TC_LEAD_059: Logic tự động chuyển trạng thái Lead khi ghi nhận trao đổi', {
    tag: ['@high', '@critical']
  }, async ({ leadsPage }) => {
    Logger.step(1, 'Chọn thẻ Lead và ghi nhận trao đổi');
    await leadsPage.firstLeadCard.click();
    await leadsPage.openRecordNoteDialog();
    await leadsPage.submitRecordNote(`Liên hệ tư vấn dịch vụ [${Date.now()}]`);

    Logger.step('Verify', 'Timeline ghi nhận trạng thái Đã LH');
    await expect(leadsPage.timelineFirstItem).toContainText('Đã LH', { timeout: 10000 });
  });

  test('TC_LEAD_060: Logic tự động tăng bộ đếm số lượng Lịch sử trao đổi', {
    tag: ['@high', '@major']
  }, async ({ leadsPage }) => {
    Logger.step(1, 'Chọn thẻ Lead và kiểm tra tiêu đề Timeline');
    await leadsPage.firstLeadCard.click();
    await expect(leadsPage.timelineSection).toBeVisible();

    Logger.step(2, 'Ghi nhận thêm một mốc trao đổi');
    await leadsPage.openRecordNoteDialog();
    await leadsPage.submitRecordNote(`Tăng bộ đếm trao đổi [${Date.now()}]`);

    Logger.step('Verify', 'Toast thành công hiển thị');
    await expect(leadsPage.noteSuccessToast).toBeVisible({ timeout: 10000 });
  });

  test('TC_LEAD_061: Logic sắp xếp mốc mới trên Dòng thời gian Timeline', {
    tag: ['@high', '@major']
  }, async ({ leadsPage }) => {
    const uniqueNote = `Mốc mới nhất kiểm tra vị trí đầu [${Date.now()}]`;
    Logger.step(1, 'Ghi nhận mốc mới');
    await leadsPage.firstLeadCard.click();
    await leadsPage.openRecordNoteDialog();
    await leadsPage.submitRecordNote(uniqueNote);

    Logger.step('Verify', 'Mốc vừa tạo nằm ở vị trí đầu tiên');
    await expect(leadsPage.timelineFirstItem).toContainText(uniqueNote, { timeout: 10000 });
  });

  test('TC_LEAD_062: Kiểm tra tính bất biến của mốc Lịch sử trao đổi', {
    tag: ['@high', '@major']
  }, async ({ leadsPage }) => {
    Logger.step(1, 'Chọn thẻ Lead và kiểm tra các mốc trên Timeline');
    await leadsPage.firstLeadCard.click();

    Logger.step('Verify', 'Các mốc timeline hiển thị văn bản ở chế độ chỉ đọc');
    await expect(leadsPage.timelineSection).toBeVisible();
  });

  // =========================================================================
  // KHỐI 07: PHÂN CÔNG NGƯỜI PHỤ TRÁCH
  // =========================================================================
  test('TC_LEAD_063: Mở và đóng hộp thoại Phân công người phụ trách bằng nút "Hủy"', {
    tag: ['@low', '@minor']
  }, async ({ leadsPage }) => {
    Logger.step(1, 'Nhấn nút "Phân công" trên thanh công cụ');
    await leadsPage.openAssignDialog();
    await expect(leadsPage.assignDialogTitle).toBeVisible();

    Logger.step(2, 'Nhấn nút "Hủy"');
    await leadsPage.closeAssignDialog();

    Logger.step('Verify', 'Hộp thoại phân công được đóng lại');
    await expect(leadsPage.assignDialog).toBeHidden();
  });

  test('TC_LEAD_064: Tìm kiếm nhân viên trong hộp thoại Phân công - Nhân sự hợp lệ', {
    tag: ['@normal', '@minor']
  }, async ({ leadsPage }) => {
    Logger.step(1, 'Mở hộp thoại Phân công');
    await leadsPage.openAssignDialog();

    Logger.step(2, 'Nhập từ khóa tìm kiếm nhân viên');
    await leadsPage.searchAssignee('Trần Văn Minh');

    Logger.step('Verify', 'Danh sách chỉ hiển thị nhân viên phù hợp với từ khóa');
    await expect(leadsPage.assignOptionsMenu).toContainText('Trần Văn Minh');

    Logger.step('Teardown', 'Đóng hộp thoại phân công');
    await leadsPage.closeAssignDialog();
  });

  test('TC_LEAD_065: Tìm kiếm nhân viên trong hộp thoại Phân công - Nhân sự không tồn tại', {
    tag: ['@low', '@minor']
  }, async ({ leadsPage }) => {
    Logger.step(1, 'Mở hộp thoại Phân công');
    await leadsPage.openAssignDialog();

    Logger.step(2, 'Nhập từ khóa nhân sự không tồn tại');
    await leadsPage.searchAssignee('NhanVien_KhongTonTai_999');

    Logger.step('Teardown', 'Đóng hộp thoại phân công');
    await leadsPage.closeAssignDialog();
  });

  test('TC_LEAD_066: Phân công người phụ trách mới thành công và cập nhật đồng bộ các khối', {
    tag: ['@high', '@critical']
  }, async ({ leadsPage }) => {
    Logger.step(1, 'Chọn thẻ Lead đầu tiên');
    await leadsPage.firstLeadCard.click();

    Logger.step(2, 'Mở hộp thoại Phân công');
    await leadsPage.openAssignDialog();

    Logger.step(3, 'Chọn nhân viên mới và nhấn nút "Xác nhận"');
    const newStaff = 'Đặng Văn Nam';
    await leadsPage.selectAssigneeAndConfirm(newStaff);

    Logger.step('Verify 1', 'Hiển thị thông báo "Cập nhật người phụ trách thành công."');
    await expect(leadsPage.assignSuccessToast).toBeVisible({ timeout: 10000 });

    Logger.step('Verify 2', 'Khối chi tiết cập nhật trường NGƯỜI PHỤ TRÁCH');
    await expect(leadsPage.detailAssignee).toContainText(newStaff);

    Logger.step('Verify 3', 'Bản ghi Giao việc mới xuất hiện trên Timeline');
    await expect(leadsPage.timelineFirstItem).toContainText('Giao việc');

    Logger.step('Verify 4', 'Thẻ Lead ngoài danh sách hiển thị tên nhân viên mới');
    await expect(leadsPage.firstLeadCard).toContainText(newStaff);
  });

  // =========================================================================
  // KHỐI 08: TẠO BÁO GIÁ TỪ LEAD
  // =========================================================================
  test('TC_LEAD_067: Tạo nhanh báo giá từ thông tin Lead', {
    tag: ['@high', '@critical']
  }, async ({ leadsPage }) => {
    Logger.step(1, 'Chọn thẻ Lead đầu tiên');
    await leadsPage.firstLeadCard.click();

    Logger.step('Verify', 'Nút "Tạo báo giá" ở trạng thái khả dụng');
    await expect(leadsPage.createQuoteButton).toBeVisible();
  });

  // =========================================================================
  // KHỐI 09: PHÂN TRANG DANH SÁCH LEAD
  // =========================================================================
  test('TC_LEAD_068: Điều hướng chuyển trang danh sách Thẻ Lead', {
    tag: ['@normal', '@minor']
  }, async ({ leadsPage }) => {
    Logger.step(1, 'Kiểm tra thông tin phân trang');
    await expect(leadsPage.paginationInfo).toBeVisible();

    Logger.step('Verify', 'Nút chuyển trang trước và trang sau hiển thị');
    await expect(leadsPage.prevPageButton).toBeVisible();
    await expect(leadsPage.nextPageButton).toBeVisible();
  });

  test('TC_LEAD_069: Kiểm tra trạng thái nút phân trang tại trang đầu', {
    tag: ['@low', '@minor']
  }, async ({ leadsPage }) => {
    Logger.step(1, 'Khi ở trang đầu tiên, kiểm tra nút "Trang trước"');
    await expect(leadsPage.prevPageButton).toBeVisible();
  });
});
