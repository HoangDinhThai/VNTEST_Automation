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

  // ==========================================
  // KHỐI 01: BỐ CỤC & HIỂN THỊ
  // ==========================================
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

  // ==========================================
  // KHỐI 02: TÌM KIẾM & BỘ LỌC
  // ==========================================
  test('TC_LEAD_002: Tìm kiếm Lead theo tên khách hàng', {
    tag: ['@normal', '@major']
  }, async ({ leadsPage }) => {
    Logger.step(1, 'Nhập từ khóa tìm kiếm tên khách hàng');
    await leadsPage.search('Trần Đăng Tuấn');

    Logger.step('Verify', 'Thẻ lead tương ứng hiển thị trong kết quả');
    await expect(leadsPage.firstLeadCard).toContainText('Trần Đăng Tuấn', { timeout: 10000 });
  });

  test('TC_LEAD_003: Xóa từ khóa tìm kiếm bằng nút "Hủy"', {
    tag: ['@low', '@minor']
  }, async ({ leadsPage }) => {
    Logger.step(1, 'Nhập từ khóa tìm kiếm');
    await leadsPage.search('Test Keyword');

    Logger.step(2, 'Nhấn nút "Hủy" trên thanh tìm kiếm');
    await leadsPage.clearSearch();

    Logger.step('Verify', 'Ô tìm kiếm được làm trống');
    await expect(leadsPage.searchInput).toHaveValue('');
  });

  test('TC_LEAD_004: Lọc danh sách theo chip trạng thái', {
    tag: ['@normal', '@major']
  }, async ({ leadsPage }) => {
    Logger.step(1, 'Nhấn chọn chip trạng thái "Chưa LH"');
    await leadsPage.filterNotContactedChip.click();

    Logger.step('Verify', 'Chip "Chưa LH" ở trạng thái kích hoạt (active)');
    await expect(leadsPage.filterNotContactedChip).toHaveClass(/active/);
  });

  // ==========================================
  // KHỐI 03: XEM CHI TIẾT LEAD
  // ==========================================
  test('TC_LEAD_005: Chọn thẻ Lead để xem chi tiết bên phải', {
    tag: ['@high', '@major']
  }, async ({ leadsPage }) => {
    Logger.step(1, 'Lấy tên khách hàng từ thẻ Lead đầu tiên');
    const firstCard = leadsPage.firstLeadCard;
    await expect(firstCard).toBeVisible();

    Logger.step(2, 'Nhấn chọn thẻ Lead đầu tiên');
    await firstCard.click();

    Logger.step('Verify', 'Khung chi tiết bên phải hiển thị nút "Chỉnh sửa"');
    await expect(leadsPage.editLeadButton).toBeVisible();
  });

  // ==========================================
  // KHỐI 04: THÊM MỚI LEAD - RÀNG BUỘC DỮ LIỆU
  // ==========================================
  test('TC_LEAD_006: Mở và đóng hộp thoại Thêm mới Lead bằng nút "Hủy"', {
    tag: ['@low', '@minor']
  }, async ({ leadsPage }) => {
    Logger.step(1, 'Mở hộp thoại Thêm mới Lead');
    await leadsPage.openCreateModal();
    await expect(leadsPage.modalTitle).toBeVisible();

    Logger.step(2, 'Nhấn nút "Hủy" để đóng');
    await leadsPage.closeCreateModal();

    Logger.step('Verify', 'Hộp thoại được đóng lại');
    await expect(leadsPage.modal).toBeHidden();
  });

  test('TC_LEAD_007: Bỏ trống toàn bộ các trường bắt buộc khi tạo Lead', {
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

  test('TC_LEAD_008: Bỏ trống riêng trường Tên khách hàng', {
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

  test('TC_LEAD_009: Bỏ trống riêng trường Số điện thoại', {
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

  test('TC_LEAD_010: Chưa chọn Dịch vụ quan tâm', {
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

  // ==========================================
  // KHỐI 05: THÊM MỚI LEAD THÀNH CÔNG & KIỂM TRA HIỂN THỊ CÁC KHỐI
  // ==========================================
  test('TC_LEAD_011: Thêm mới Lead thành công và kiểm tra hiển thị đồng bộ ở cả 3 khối', {
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

    Logger.step('Verify', 'Hiển thị thông báo "Tạo khách hàng tiềm năng thành công." và thẻ mới xuất hiện');
    await expect(leadsPage.successToast).toBeVisible({ timeout: 10000 });
    await expect(leadsPage.firstLeadCard).toContainText(customerName, { timeout: 10000 });

    Logger.step(4, 'Nhấn chọn thẻ Lead vừa tạo');
    await leadsPage.firstLeadCard.click();

    Logger.step('Verify Khối 1', 'Kiểm tra Khối Header liên hệ (Tên, Công ty, SĐT, Email)');
    await expect(leadsPage.detailCustomerName).toHaveText(customerName);
    await expect(leadsPage.detailCompany).toHaveText(company);
    // Số điện thoại được hệ thống tự động format có dấu cách (vd: 0989 406 258)
    const formattedPhone = phone.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
    await expect(leadsPage.detailContacts).toContainText(formattedPhone);
    await expect(leadsPage.detailContacts).toContainText(email);

    Logger.step('Verify Khối 2', 'Kiểm tra Khối Thuộc tính Lead & Dịch vụ quan tâm (Nguồn, Giá trị, Dịch vụ, Nhu cầu)');
    await expect(leadsPage.detailSource).toContainText('Facebook');
    await expect(leadsPage.detailEstimatedValue).toContainText('50.000.000');
    await expect(leadsPage.detailServices).toContainText('KN Thực phẩm');
    await expect(leadsPage.detailServices).toContainText('KN Hóa chất');
    await expect(leadsPage.detailSpecificDemand).toContainText(demand);

    Logger.step('Verify Khối 3', 'Kiểm tra Khối Lịch sử trao đổi (Giao việc, chuyển người phụ trách, thời gian thực hiện)');
    await expect(leadsPage.timelineSection).toBeVisible();
    await expect(leadsPage.timelineAssigneeText).toBeVisible({ timeout: 10000 });
    await expect(leadsPage.timelineFirstAssignItem).toContainText('Giao việc');
    await expect(leadsPage.timelineFirstAssignItem).toContainText('Chuyển người phụ trách từ');
    await expect(leadsPage.timelineFirstAssignItem).toContainText('Thực hiện lúc');
  });

  // ==========================================
  // KHỐI 06: GHI NHẬN LỊCH SỬ TRAO ĐỔI (TIMELINE NOTE)
  // ==========================================
  test('TC_LEAD_012: Mở và đóng hộp thoại Ghi nhận lịch sử trao đổi bằng nút "Hủy"', {
    tag: ['@low', '@minor']
  }, async ({ leadsPage }) => {
    Logger.step(1, 'Chọn một thẻ Lead để hiển thị chi tiết');
    await leadsPage.firstLeadCard.click();
    await expect(leadsPage.recordNoteButton).toBeVisible();

    Logger.step(2, 'Nhấn nút "Ghi nhận"');
    await leadsPage.openRecordNoteDialog();
    await expect(leadsPage.noteDialogTitle).toBeVisible();

    Logger.step(3, 'Nhấn nút "Hủy" trên hộp thoại');
    await leadsPage.closeRecordNoteDialog();

    Logger.step('Verify', 'Hộp thoại ghi nhận lịch sử trao đổi được đóng lại');
    await expect(leadsPage.noteDialog).toBeHidden();
  });

  test('TC_LEAD_013: Bỏ trống trường Nội dung trao đổi khi ghi nhận', {
    tag: ['@normal', '@minor']
  }, async ({ leadsPage }) => {
    Logger.step(1, 'Chọn một thẻ Lead và mở hộp thoại Ghi nhận');
    await leadsPage.firstLeadCard.click();
    await leadsPage.openRecordNoteDialog();

    Logger.step(2, 'Nhấn nút "Lưu" mà không nhập nội dung trao đổi');
    await leadsPage.submitRecordNote();

    Logger.step('Verify', 'Hiển thị cảnh báo "Vui lòng nhập nội dung trao đổi."');
    await expect(leadsPage.noteContentError).toBeVisible();

    Logger.step('Teardown', 'Đóng hộp thoại ghi nhận');
    await leadsPage.closeRecordNoteDialog();
  });

  test('TC_LEAD_014: Ghi nhận lịch sử trao đổi thành công và cập nhật timeline', {
    tag: ['@high', '@major']
  }, async ({ leadsPage }) => {
    Logger.step(1, 'Chọn thẻ Lead đầu tiên');
    await leadsPage.firstLeadCard.click();
    await expect(leadsPage.recordNoteButton).toBeVisible();

    Logger.step(2, 'Mở hộp thoại Ghi nhận');
    await leadsPage.openRecordNoteDialog();

    Logger.step(3, 'Nhập nội dung trao đổi và nhấn nút "Lưu"');
    const timestamp = Date.now();
    const noteContent = `Khách hàng đồng ý báo giá gói kiểm nghiệm [${timestamp}]`;
    await leadsPage.submitRecordNote(noteContent);

    Logger.step('Verify 1', 'Hiển thị toast thông báo "Ghi nhận lịch sử liên hệ thành công."');
    await expect(leadsPage.noteSuccessToast).toBeVisible({ timeout: 10000 });

    Logger.step('Verify 2', 'Bản ghi lịch sử mới xuất hiện ngay đầu danh sách Lịch sử trao đổi');
    await expect(leadsPage.timelineFirstItem).toContainText('Đã LH', { timeout: 10000 });
    await expect(leadsPage.timelineFirstItem).toContainText(noteContent);
    await expect(leadsPage.timelineFirstItem).toContainText('Admin User');
    await expect(leadsPage.timelineFirstItem).toContainText('Thực hiện lúc');
  });

  // ==========================================
  // KHỐI 07: PHÂN CÔNG NGƯỜI PHỤ TRÁCH
  // ==========================================
  test('TC_LEAD_015: Mở và đóng hộp thoại Phân công người phụ trách bằng nút "Hủy"', {
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

  test('TC_LEAD_016: Tìm kiếm nhân viên phụ trách trong danh sách phân công', {
    tag: ['@normal', '@minor']
  }, async ({ leadsPage }) => {
    Logger.step(1, 'Mở hộp thoại Phân công');
    await leadsPage.openAssignDialog();

    Logger.step(2, 'Nhập từ khóa tìm kiếm nhân viên');
    await leadsPage.searchAssignee('Trần Văn Minh');

    Logger.step('Verify', 'Danh sách chỉ hiển thị nhân viên phù hợp với từ khóa');
    await expect(leadsPage.assignOptionsMenu).toContainText('Trần Văn Minh');
    await expect(leadsPage.assignOptionsMenu).toContainText('NS-002');

    Logger.step('Teardown', 'Đóng hộp thoại phân công');
    await leadsPage.closeAssignDialog();
  });

  test('TC_LEAD_017: Phân công người phụ trách mới thành công và cập nhật đồng bộ các khối', {
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

    Logger.step('Verify 2', 'Khối chi tiết cập nhật trường NGƯỜI PHỤ TRÁCH thành tên nhân viên mới');
    await expect(leadsPage.detailAssignee).toContainText(newStaff);

    Logger.step('Verify 3', 'Bản ghi Giao việc mới xuất hiện ngay đầu Timeline với người phụ trách mới');
    await expect(leadsPage.timelineFirstItem).toContainText('Giao việc');
    await expect(leadsPage.timelineFirstItem).toContainText(`sang [${newStaff}]`);
    await expect(leadsPage.timelineFirstItem).toContainText('Admin User');

    Logger.step('Verify 4', 'Thẻ Lead ngoài danh sách hiển thị tên nhân viên phụ trách mới');
    await expect(leadsPage.firstLeadCard).toContainText(newStaff);
  });
});
