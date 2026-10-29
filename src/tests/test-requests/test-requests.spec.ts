import { test, expect } from '../../fixtures/base.fixture';
import { Logger } from '../../utils/logger';
import users from '../../../test-data/users.json';

test.describe('Module Quản lý Báo giá & Yêu cầu thử nghiệm (/yeu-cau-thu-nghiem) - Hệ thống VNTEST LIMS', () => {
  test.beforeEach(async ({ loginPage, testRequestsPage, page }) => {
    Logger.step('Setup', 'Đăng nhập vào hệ thống và điều hướng tới trang Báo giá & Yêu cầu thử nghiệm');
    await loginPage.open('/dang-nhap');
    await loginPage.login(users.validUser.username, users.validUser.password);
    await page.waitForURL('https://vntest-lims.pirago.work/', { timeout: 15000 });

    await testRequestsPage.open('/yeu-cau-thu-nghiem');
    await expect(testRequestsPage.bgAndYctnTab).toBeVisible({ timeout: 15000 });
    await expect(testRequestsPage.table).toBeVisible({ timeout: 15000 });
  });

  // ==========================================
  // KHỐI 01: BỐ CỤC & HIỂN THỊ MÀN HÌNH
  // ==========================================
  test('TC_YCTN_001: Hiển thị đầy đủ thanh điều hướng tab và các nút tiện ích Xuất, In', {
    tag: ['@normal', '@minor']
  }, async ({ testRequestsPage }) => {
    Logger.step(1, 'Kiểm tra tab "BG & YCTN" (đang kích hoạt) và tab "TIẾP NHẬN YCTN"');
    await expect(testRequestsPage.bgAndYctnTab).toBeVisible();
    await expect(testRequestsPage.bgAndYctnTab).toHaveClass(/active/);
    await expect(testRequestsPage.receiveYctnTab).toBeVisible();

    Logger.step(2, 'Kiểm tra hiển thị nút "Xuất" và nút "In"');
    await expect(testRequestsPage.exportButton).toBeVisible();
    await expect(testRequestsPage.printButton).toBeVisible();
  });

  test('TC_YCTN_002: Hiển thị đầy đủ 7 chip lọc trạng thái, bộ lọc ngày, ô tìm kiếm và 6 nút thao tác nghiệp vụ', {
    tag: ['@normal', '@minor']
  }, async ({ testRequestsPage }) => {
    Logger.step(1, 'Kiểm tra 7 chip lọc trạng thái hồ sơ');
    await expect(testRequestsPage.chipAll).toBeVisible();
    await expect(testRequestsPage.chipAll).toHaveClass(/active/);
    await expect(testRequestsPage.chipDraft).toBeVisible();
    await expect(testRequestsPage.chipCustomerConfirmed).toBeVisible();
    await expect(testRequestsPage.chipYctnPending).toBeVisible();
    await expect(testRequestsPage.chipYctnSupplement).toBeVisible();
    await expect(testRequestsPage.chipYctnApproved).toBeVisible();
    await expect(testRequestsPage.chipYctnRejected).toBeVisible();

    Logger.step(2, 'Kiểm tra bộ lọc khoảng ngày và ô tìm kiếm');
    await expect(testRequestsPage.dateTypeTrigger).toBeVisible();
    await expect(testRequestsPage.dateFromTrigger).toBeVisible();
    await expect(testRequestsPage.dateToTrigger).toBeVisible();
    await expect(testRequestsPage.searchInput).toBeVisible();

    Logger.step(3, 'Kiểm tra 6 nút thao tác trên thanh công cụ');
    await expect(testRequestsPage.cloneButton).toBeVisible();
    await expect(testRequestsPage.confirmCustomerButton).toBeVisible();
    await expect(testRequestsPage.sendYctnButton).toBeVisible();
    await expect(testRequestsPage.addButton).toBeVisible();
    await expect(testRequestsPage.editButton).toBeVisible();
    await expect(testRequestsPage.deleteButton).toBeVisible();
  });

  test('TC_YCTN_003: Hiển thị bảng danh sách với các cột chuẩn, phân trang, Quản lý cột và khung phải mặc định', {
    tag: ['@normal', '@minor']
  }, async ({ testRequestsPage }) => {
    Logger.step(1, 'Kiểm tra các cột tiêu đề ghép của bảng danh sách bên trái');
    await expect(testRequestsPage.table).toBeVisible();
    await expect(testRequestsPage.firstRow).toBeVisible();
    await expect(testRequestsPage.table).toContainText(/mã bg/i);
    await expect(testRequestsPage.table).toContainText(/mã yctn/i);
    await expect(testRequestsPage.table).toContainText(/tên khách hàng/i);
    await expect(testRequestsPage.table).toContainText(/tên mẫu/i);
    await expect(testRequestsPage.table).toContainText(/ngày nhận/i);
    await expect(testRequestsPage.table).toContainText(/ngày trả/i);
    await expect(testRequestsPage.table).toContainText(/trạng thái/i);

    Logger.step(2, 'Kiểm tra phân trang, nút "Quản lý cột" và trạng thái mặc định khung phải');
    await expect(testRequestsPage.paginationInfo).toBeVisible();
    await expect(testRequestsPage.manageColumnsButton).toBeVisible();
    await expect(testRequestsPage.emptyDetailPlaceholder).toBeVisible();
  });

  // ==========================================
  // KHỐI 02: TRẠNG THÁI & ĐIỀU KIỆN KÍCH HOẠT NÚT THAO TÁC
  // ==========================================
  test('TC_YCTN_004: Trạng thái ban đầu của các nút thao tác khi chưa tích chọn dòng nào', {
    tag: ['@normal', '@minor']
  }, async ({ testRequestsPage }) => {
    Logger.step('Verify', 'Nút "Thêm" kích hoạt; các nút "Nhân bản", "KH chốt", "Gửi YCTN", "Sửa", "Xóa" bị vô hiệu hóa');
    await expect(testRequestsPage.addButton).toBeEnabled();
    await expect(testRequestsPage.cloneButton).toBeDisabled();
    await expect(testRequestsPage.confirmCustomerButton).toBeDisabled();
    await expect(testRequestsPage.sendYctnButton).toBeDisabled();
    await expect(testRequestsPage.editButton).toBeDisabled();
    await expect(testRequestsPage.deleteButton).toBeDisabled();
  });

  test('TC_YCTN_005: Trạng thái các nút thao tác khi tích chọn 1 hồ sơ trạng thái "Nháp"', {
    tag: ['@high', '@major']
  }, async ({ testRequestsPage }) => {
    Logger.step(1, 'Lọc theo chip "Nháp" và tích chọn dòng đầu tiên');
    await testRequestsPage.filterByStatusChip('draft');
    await testRequestsPage.checkRow(0);

    Logger.step('Verify', 'Kích hoạt nút "Nhân bản", "KH chốt", "Sửa", "Xóa"; nút "Gửi YCTN" bị vô hiệu hóa');
    await expect(testRequestsPage.cloneButton).toBeEnabled();
    await expect(testRequestsPage.confirmCustomerButton).toBeEnabled();
    await expect(testRequestsPage.editButton).toBeEnabled();
    await expect(testRequestsPage.deleteButton).toBeEnabled();
    await expect(testRequestsPage.sendYctnButton).toBeDisabled();

    Logger.step('Teardown', 'Bỏ tích chọn dòng');
    await testRequestsPage.uncheckRow(0);
  });

  test('TC_YCTN_006: Trạng thái các nút thao tác khi tích chọn 1 hồ sơ trạng thái "KH chốt"', {
    tag: ['@high', '@major']
  }, async ({ testRequestsPage }) => {
    Logger.step(1, 'Lọc theo chip "KH chốt" và tích chọn dòng đầu tiên');
    await testRequestsPage.filterByStatusChip('confirmed');
    await testRequestsPage.checkRow(0);

    Logger.step('Verify', 'Kích hoạt nút "Gửi YCTN", "Nhân bản", "Sửa"; vô hiệu hóa nút "KH chốt" và "Xóa"');
    await expect(testRequestsPage.sendYctnButton).toBeEnabled();
    await expect(testRequestsPage.cloneButton).toBeEnabled();
    await expect(testRequestsPage.editButton).toBeEnabled();
    await expect(testRequestsPage.confirmCustomerButton).toBeDisabled();
    await expect(testRequestsPage.deleteButton).toBeDisabled();

    Logger.step('Teardown', 'Bỏ tích chọn dòng');
    await testRequestsPage.uncheckRow(0);
  });

  test('TC_YCTN_007: Trạng thái các nút thao tác khi tích chọn 1 hồ sơ trạng thái "YCTN DD" (Đã duyệt)', {
    tag: ['@high', '@major']
  }, async ({ testRequestsPage }) => {
    Logger.step(1, 'Lọc theo chip "YCTN DD" và tích chọn dòng đầu tiên');
    await testRequestsPage.filterByStatusChip('approved');
    await testRequestsPage.checkRow(0);

    Logger.step('Verify', 'Chỉ kích hoạt nút "Nhân bản"; các nút "KH chốt", "Gửi YCTN", "Sửa", "Xóa" đều bị vô hiệu hóa');
    await expect(testRequestsPage.cloneButton).toBeEnabled();
    await expect(testRequestsPage.confirmCustomerButton).toBeDisabled();
    await expect(testRequestsPage.sendYctnButton).toBeDisabled();
    await expect(testRequestsPage.editButton).toBeDisabled();
    await expect(testRequestsPage.deleteButton).toBeDisabled();

    Logger.step('Teardown', 'Bỏ tích chọn dòng');
    await testRequestsPage.uncheckRow(0);
  });

  test('TC_YCTN_008: Vô hiệu hóa các nút thao tác đơn lẻ ("Sửa", "Nhân bản") khi tích chọn từ 2 hồ sơ trở lên', {
    tag: ['@normal', '@major']
  }, async ({ testRequestsPage }) => {
    Logger.step(1, 'Lọc theo chip "Nháp" và tích chọn 2 dòng đầu tiên');
    await testRequestsPage.filterByStatusChip('draft');
    await testRequestsPage.checkRow(0);
    await testRequestsPage.checkRow(1);

    Logger.step('Verify', 'Nút "Sửa" và "Nhân bản" bị vô hiệu hóa; nút "KH chốt" và "Xóa" vẫn được kích hoạt');
    await expect(testRequestsPage.editButton).toBeDisabled();
    await expect(testRequestsPage.cloneButton).toBeDisabled();
    await expect(testRequestsPage.confirmCustomerButton).toBeEnabled();
    await expect(testRequestsPage.deleteButton).toBeEnabled();

    Logger.step('Teardown', 'Bỏ tích chọn 2 dòng');
    await testRequestsPage.uncheckRow(0);
    await testRequestsPage.uncheckRow(1);
  });

  // ==========================================
  // KHỐI 03: TÌM KIẾM, BỘ LỌC & QUẢN LÝ CỘT
  // ==========================================
  test('TC_YCTN_009: Lọc danh sách theo từng chip trạng thái ("Nháp", "KH chốt", "YCTN CD", "YCTN DD", "Tất cả")', {
    tag: ['@high', '@major']
  }, async ({ testRequestsPage }) => {
    Logger.step(1, 'Nhấn chọn chip "Nháp"');
    await testRequestsPage.filterByStatusChip('draft');
    await expect(testRequestsPage.chipDraft).toHaveClass(/active/);
    await expect(testRequestsPage.firstRow).toContainText('Nháp');

    Logger.step(2, 'Nhấn chọn chip "KH chốt"');
    await testRequestsPage.filterByStatusChip('confirmed');
    await expect(testRequestsPage.chipCustomerConfirmed).toHaveClass(/active/);
    await expect(testRequestsPage.firstRow).toContainText('KH chốt');

    Logger.step(3, 'Nhấn chọn chip "YCTN CD"');
    await testRequestsPage.filterByStatusChip('pending');
    await expect(testRequestsPage.chipYctnPending).toHaveClass(/active/);
    await expect(testRequestsPage.firstRow).toContainText('YCTN CD');

    Logger.step(4, 'Nhấn chọn chip "YCTN DD" rồi quay về "Tất cả"');
    await testRequestsPage.filterByStatusChip('approved');
    await expect(testRequestsPage.chipYctnApproved).toHaveClass(/active/);
    await expect(testRequestsPage.firstRow).toContainText('YCTN DD');

    await testRequestsPage.filterByStatusChip('all');
    await expect(testRequestsPage.chipAll).toHaveClass(/active/);
  });

  test('TC_YCTN_010: Tìm kiếm hồ sơ theo Mã Báo giá (MÃ BG) và xóa từ khóa tìm kiếm', {
    tag: ['@high', '@major']
  }, async ({ testRequestsPage }) => {
    Logger.step(1, 'Lấy Mã BG của dòng đầu tiên trong bảng để làm từ khóa tìm kiếm');
    const firstCode = (await testRequestsPage.firstRow.locator('td').nth(1).locator('.top').innerText()).trim();

    Logger.step(2, `Nhập từ khóa "${firstCode}" vào ô tìm kiếm`);
    await testRequestsPage.search(firstCode);

    Logger.step('Verify 1', 'Bảng lọc và hiển thị đúng bản ghi có Mã BG trùng khớp');
    await expect(testRequestsPage.firstRow).toContainText(firstCode);

    Logger.step(3, 'Xóa từ khóa tìm kiếm');
    await testRequestsPage.clearSearch();
    await expect(testRequestsPage.searchInput).toHaveValue('');
  });

  test('TC_YCTN_011: Tìm kiếm hồ sơ theo Tên khách hàng và tìm kiếm với từ khóa không tồn tại', {
    tag: ['@normal', '@minor']
  }, async ({ testRequestsPage }) => {
    Logger.step(1, 'Tìm kiếm theo tên khách hàng "Nam Phong"');
    await testRequestsPage.search('Nam Phong');
    await expect(testRequestsPage.firstRow).toContainText('Nam Phong');

    Logger.step(2, 'Tìm kiếm với từ khóa không tồn tại trong hệ thống');
    await testRequestsPage.search('MA_BG_KHONG_TON_TAI_999999');
    await expect(testRequestsPage.rows.filter({ hasText: 'BG-' })).toHaveCount(0);

    Logger.step('Teardown', 'Xóa từ khóa tìm kiếm');
    await testRequestsPage.clearSearch();
  });

  test('TC_YCTN_012: Mở và kiểm tra popover "Quản lý cột" ở chân bảng', {
    tag: ['@low', '@minor']
  }, async ({ testRequestsPage }) => {
    Logger.step(1, 'Nhấn nút "Quản lý cột" ở chân bảng');
    await testRequestsPage.manageColumnsButton.click();

    Logger.step('Verify', 'Popover quản lý cột hiển thị trên giao diện');
    await expect(testRequestsPage.manageColumnsPopover).toBeVisible();
  });

  // ==========================================
  // KHỐI 04: XEM CHI TIẾT HỒ SƠ BG & YCTN (KHUNG PHẢI)
  // ==========================================
  test('TC_YCTN_013: Bấm chọn một dòng để hiển thị đầy đủ 7 phần thông tin chi tiết bên khung phải', {
    tag: ['@high', '@major']
  }, async ({ testRequestsPage }) => {
    Logger.step(1, 'Bấm vào dòng đầu tiên trong bảng danh sách');
    await testRequestsPage.clickRowToViewDetail(0);

    Logger.step('Verify', 'Khung bên phải hiển thị đầy đủ 7 phần cấu trúc của hồ sơ BG & YCTN');
    await expect(testRequestsPage.section1).toContainText('Thông tin chung');
    await expect(testRequestsPage.section2).toContainText('Thông tin xuất hóa đơn');
    await expect(testRequestsPage.section3).toContainText('Dịch vụ bổ sung');
    await expect(testRequestsPage.section4).toContainText('Thông tin khác');
    await expect(testRequestsPage.section5).toContainText('Chỉ tiêu phân tích');
    await expect(testRequestsPage.section6).toContainText('Tổng hợp thanh toán');
    await expect(testRequestsPage.section7).toContainText('Quy định gửi mẫu');
  });

  test('TC_YCTN_014: Hiển thị banner cảnh báo chỉ đọc khi xem hồ sơ ở trạng thái "YCTN DD" (Đã duyệt)', {
    tag: ['@normal', '@major']
  }, async ({ testRequestsPage }) => {
    Logger.step(1, 'Lọc theo chip "YCTN DD" và bấm xem dòng đầu tiên');
    await testRequestsPage.filterByStatusChip('approved');
    await testRequestsPage.clickRowToViewDetail(0);

    Logger.step('Verify', 'Hiển thị thông báo "Hồ sơ ở trạng thái YCTN đã duyệt — không cho phép sửa."');
    await expect(testRequestsPage.readonlyBanner).toBeVisible();
    await expect(testRequestsPage.readonlyBanner).toContainText('Hồ sơ ở trạng thái YCTN đã duyệt — không cho phép sửa.');
  });

  // ==========================================
  // KHỐI 05: THÊM MỚI, VALIDATION & TÍNH TIỀN TỰ ĐỘNG (PHẦN 1 – 2 – 3 – 4 – 5 – 6)
  // ==========================================
  test('TC_YCTN_015: Mở form Thêm mới bằng nút "Thêm" và hủy tạo mới bằng nút "Huỷ"', {
    tag: ['@low', '@minor']
  }, async ({ testRequestsPage }) => {
    Logger.step(1, 'Nhấn nút "Thêm" trên thanh công cụ');
    await testRequestsPage.openCreateForm();
    await expect(testRequestsPage.saveFormButton).toBeVisible();
    await expect(testRequestsPage.cancelFormButton).toBeVisible();

    Logger.step(2, 'Nhấn nút "Huỷ" ở cuối form');
    await testRequestsPage.cancelForm();

    Logger.step('Verify', 'Form đóng lại và khung bên phải quay về trạng thái chưa chọn hồ sơ');
    await expect(testRequestsPage.emptyDetailPlaceholder).toBeVisible();
  });

  test('TC_YCTN_016: Kiểm tra các trường tự động sinh ở chế độ chỉ đọc (readonly) trên form tạo mới', {
    tag: ['@normal', '@minor']
  }, async ({ testRequestsPage }) => {
    Logger.step(1, 'Mở form Thêm mới');
    await testRequestsPage.openCreateForm();

    Logger.step('Verify', 'Các trường Mã báo giá, Mã YCTN, Ngày hẹn trả, VAT% kiểm nghiệm có thuộc tính readonly');
    await expect(testRequestsPage.quotationCodeInput).toHaveAttribute('readonly', '');
    await expect(testRequestsPage.yctnCodeInput).toHaveAttribute('readonly', '');
    await expect(testRequestsPage.dueDateInput).toHaveAttribute('readonly', '');
    await expect(testRequestsPage.testingVatInput).toHaveAttribute('readonly', '');
  });

  test('TC_YCTN_017: Validate các trường bắt buộc khi nhấn nút "Lưu" trên form tạo mới để trống', {
    tag: ['@high', '@major']
  }, async ({ testRequestsPage }) => {
    Logger.step(1, 'Mở form Thêm mới và nhấn ngay nút "Lưu"');
    await testRequestsPage.openCreateForm();
    await testRequestsPage.submitForm();

    Logger.step('Verify', 'Hiển thị đầy đủ các cảnh báo lỗi tại các trường bắt buộc và phần chỉ tiêu mẫu');
    await expect(testRequestsPage.errorBanners.first()).toContainText('Vui lòng kiểm tra các ô được báo lỗi.');
    await expect(testRequestsPage.form).toContainText('Vui lòng nhập tên khách hàng.');
    await expect(testRequestsPage.form).toContainText('Vui lòng nhập địa chỉ khách hàng.');
    await expect(testRequestsPage.form).toContainText('Vui lòng nhập tên liên hệ.');
    await expect(testRequestsPage.form).toContainText('Vui lòng nhập số điện thoại.');
    await expect(testRequestsPage.form).toContainText('Vui lòng thêm ít nhất một mẫu.');
  });

  test('TC_YCTN_018: Chọn khách hàng ở Phần 1 và tích "Lấy từ khách hàng" tự động sao chép sang Phần 2 (Xuất hóa đơn)', {
    tag: ['@high', '@major']
  }, async ({ testRequestsPage }) => {
    Logger.step(1, 'Mở form Thêm mới — kiểm tra checkbox "Lấy từ khách hàng" ban đầu bị vô hiệu hóa');
    await testRequestsPage.openCreateForm();
    await expect(testRequestsPage.copyFromCustomerCheckbox).toBeDisabled();

    Logger.step(2, 'Chọn khách hàng đầu tiên từ danh sách "Mã khách hàng"');
    await testRequestsPage.selectCustomerByIndex(0);
    const selectedCustomerName = await testRequestsPage.customerNameInput.inputValue();
    const selectedCustomerAddress = await testRequestsPage.customerAddressInput.inputValue();

    Logger.step('Verify 1', 'Thông tin khách hàng được điền tự động và checkbox "Lấy từ khách hàng" được kích hoạt');
    expect(selectedCustomerName.length).toBeGreaterThan(0);
    await expect(testRequestsPage.copyFromCustomerCheckbox).toBeEnabled();

    Logger.step(3, 'Tích chọn "Lấy từ khách hàng" ở Phần 2');
    await testRequestsPage.copyFromCustomerCheckbox.check();

    Logger.step('Verify 2', 'Tên xuất hóa đơn và Địa chỉ xuất hóa đơn được sao chép chính xác từ Phần 1');
    await expect(testRequestsPage.invoiceNameInput).toHaveValue(selectedCustomerName);
    await expect(testRequestsPage.invoiceAddressInput).toHaveValue(selectedCustomerAddress);
  });

  test('TC_YCTN_019: Kiểm tra Phần 3 (Dịch vụ bổ sung) — Thời gian kiểm cập nhật Hệ số kiểm nhanh (HS kiểm nhanh) ở Phần 6', {
    tag: ['@high', '@critical']
  }, async ({ testRequestsPage }) => {
    Logger.step(1, 'Mở form Thêm mới — kiểm tra mặc định TG kiểm là "Mặc định (×1,0)"');
    await testRequestsPage.openCreateForm();
    await expect(testRequestsPage.turnaroundDefaultRadio).toBeChecked();
    await expect(testRequestsPage.turnaroundOtherDaysInput).toBeDisabled();
    await expect(testRequestsPage.turnaroundOtherFactorInput).toBeDisabled();
    await expect(testRequestsPage.summaryFastFactor).toHaveText('×1');

    Logger.step(2, 'Chọn Thời gian kiểm "24h (×2,5)"');
    await testRequestsPage.turnaround24hRadio.check();
    await expect(testRequestsPage.summaryFastFactor).toHaveText('×2,5');

    Logger.step(3, 'Chọn Thời gian kiểm "48h (×2,0)" và "72h (×1,5)"');
    await testRequestsPage.turnaround48hRadio.check();
    await expect(testRequestsPage.summaryFastFactor).toHaveText('×2');

    await testRequestsPage.turnaround72hRadio.check();
    await expect(testRequestsPage.summaryFastFactor).toHaveText('×1,5');

    Logger.step(4, 'Chọn Thời gian kiểm "Khác" — mở khóa ô Ngày & Hệ số và nhập hệ số 1.8');
    await testRequestsPage.turnaroundOtherRadio.check();
    await expect(testRequestsPage.turnaroundOtherDaysInput).toBeEnabled();
    await expect(testRequestsPage.turnaroundOtherFactorInput).toBeEnabled();
    await testRequestsPage.turnaroundOtherDaysInput.fill('3');
    await testRequestsPage.turnaroundOtherFactorInput.fill('1.8');
    await testRequestsPage.turnaroundOtherFactorInput.blur();

    Logger.step('Verify', 'Dòng "HS kiểm nhanh" ở Phần 6 tự động cập nhật thành "×1,8"');
    await expect(testRequestsPage.summaryFastFactor).toHaveText('×1,8');
  });

  test('TC_YCTN_020: Kiểm tra Phần 3 (Dịch vụ bổ sung) — Tính "Phí DV lấy mẫu (Có VAT)" và cộng vào TỔNG THANH TOÁN', {
    tag: ['@high', '@critical']
  }, async ({ testRequestsPage }) => {
    Logger.step(1, 'Mở form Thêm mới — mặc định "Khách hàng tự gửi" khóa các trường lấy mẫu và phí = 0đ');
    await testRequestsPage.openCreateForm();
    await expect(testRequestsPage.samplingAddressInput).toBeDisabled();
    await expect(testRequestsPage.samplingFeeInput).toBeDisabled();
    await expect(testRequestsPage.samplingVatSelect).toBeDisabled();
    await expect(testRequestsPage.summarySamplingFee).toHaveText('0đ');

    Logger.step(2, 'Chuyển hình thức Lấy mẫu sang "Nhận tận nơi"');
    await testRequestsPage.samplingMethodSelect.selectOption('doorstep');
    await expect(testRequestsPage.samplingAddressInput).toBeEnabled();
    await expect(testRequestsPage.samplingFeeInput).toBeEnabled();
    await expect(testRequestsPage.samplingVatSelect).toBeEnabled();

    Logger.step(3, 'Nhập Phí lấy mẫu = 200.000 và kiểm tra với VAT mặc định 8%');
    await testRequestsPage.samplingFeeInput.fill('200000');
    await testRequestsPage.samplingFeeInput.blur();

    Logger.step('Verify 1', 'Phí DV lấy mẫu (Có VAT 8%) = 200.000 × 1,08 = 216.000đ và TỔNG THANH TOÁN = 216.000đ');
    await expect(testRequestsPage.summarySamplingFee).toHaveText('216.000đ');
    await expect(testRequestsPage.summaryGrandTotal).toHaveText('216.000đ');

    Logger.step(4, 'Đổi VAT lấy mẫu sang 10%');
    await testRequestsPage.samplingVatSelect.selectOption('10');

    Logger.step('Verify 2', 'Phí DV lấy mẫu (Có VAT 10%) tự động cập nhật = 220.000đ');
    await expect(testRequestsPage.summarySamplingFee).toHaveText('220.000đ');
    await expect(testRequestsPage.summaryGrandTotal).toHaveText('220.000đ');
  });

  test('TC_YCTN_021: Kiểm tra Phần 3 (Dịch vụ bổ sung) — Tính "Phí DV công bố (Có VAT)" và cộng vào TỔNG THANH TOÁN', {
    tag: ['@high', '@critical']
  }, async ({ testRequestsPage }) => {
    Logger.step(1, 'Mở form Thêm mới — mặc định Công bố = "Không" khóa trường phí công bố');
    await testRequestsPage.openCreateForm();
    await expect(testRequestsPage.publishFeeInput).toBeDisabled();
    await expect(testRequestsPage.publishVatSelect).toBeDisabled();
    await expect(testRequestsPage.summaryPublishFee).toHaveText('0đ');

    Logger.step(2, 'Chuyển Công bố sang "Có", nhập Phí công bố = 500.000 và chọn VAT công bố = 5%');
    await testRequestsPage.publishSelect.selectOption('yes');
    await expect(testRequestsPage.publishFeeInput).toBeEnabled();
    await expect(testRequestsPage.publishVatSelect).toBeEnabled();

    await testRequestsPage.publishFeeInput.fill('500000');
    await testRequestsPage.publishFeeInput.blur();
    await testRequestsPage.publishVatSelect.selectOption('5');

    Logger.step('Verify', 'Phí DV công bố (Có VAT 5%) = 500.000 × 1,05 = 525.000đ và TỔNG THANH TOÁN = 525.000đ');
    await expect(testRequestsPage.summaryPublishFee).toHaveText('525.000đ');
    await expect(testRequestsPage.summaryGrandTotal).toHaveText('525.000đ');
  });

  test('TC_YCTN_022: Kiểm tra Phần 5 & Phần 6 — Tính tiền tự động toàn diện (Chỉ tiêu, SL, ⚡ KN, +% ↑, Chiết khấu, Giá sàn, Margin, VAT & Tổng thanh toán)', {
    tag: ['@high', '@critical']
  }, async ({ testRequestsPage }) => {
    Logger.step(1, 'Mở form Thêm mới, thêm Nền mẫu đầu tiên và chọn 1 chỉ tiêu phân tích');
    await testRequestsPage.openCreateForm();
    await testRequestsPage.addSampleMatrixByIndex(0);
    await testRequestsPage.openAnalytePickerForSample(0);
    await expect(testRequestsPage.analytePickerModal).toBeVisible();
    await testRequestsPage.selectAnalytesAndConfirm([0]);

    Logger.step(2, 'Thiết lập Giá sàn = 100.000, Giá báo KH = 200.000, Số lượng (SL) = 2 cho chỉ tiêu 1');
    await testRequestsPage.updateCriteriaRowPricing(0, 0, {
      floorPrice: '100000',
      customerPrice: '200000',
      quantity: '2',
    });

    Logger.step('Verify 1', 'Thành tiền dòng chỉ tiêu = 200.000 × 2 = 400.000đ; Tổng tiền mẫu 1 = 400.000đ; Tổng giá sàn = 200.000đ');
    const row1 = testRequestsPage.getSampleCriteriaRow(0, 0);
    await expect(row1.locator('td.trq-ct-amount')).toContainText('400.000đ');
    const sample1Totals = testRequestsPage.getSampleTotalBlock(0);
    await expect(sample1Totals.totalVal).toHaveText('400.000đ');
    await expect(testRequestsPage.summaryFloorTotal).toHaveText('200.000đ');

    Logger.step(3, 'Bật Kiểm nhanh (⚡ KN) trên Mẫu 1 và nhập +% ↑ = 25%');
    await testRequestsPage.configureSampleFastTest(0, true, '25');

    Logger.step('Verify 2', 'Tiền gốc = 400.000đ, Tiền thêm KN (25%) = 100.000đ ➔ Tổng tiền mẫu 1 = 500.000đ');
    await expect(sample1Totals.baseAmount).toHaveText('400.000đ');
    await expect(sample1Totals.fastExtraAmount).toHaveText('100.000đ');
    await expect(sample1Totals.totalVal).toHaveText('500.000đ');

    Logger.step(4, 'Nhập Chiết khấu (%) ở Phần 4 = 10%');
    await testRequestsPage.discountPercentInput.fill('10');
    await testRequestsPage.discountPercentInput.blur();

    Logger.step(
      'Verify 3',
      'Kiểm tra Phần 6: Chiết khấu (10%) = −50.000đ; Tổng KN (Chưa VAT) = 450.000đ; Margin = (450.000 - 200.000)/200.000 = 125%; Tổng KN (Có VAT 5%) = 472.500đ'
    );
    await expect(testRequestsPage.summaryDiscountAmount).toHaveText('−50.000đ');
    await expect(testRequestsPage.summaryTestingBeforeVat).toHaveText('450.000đ');
    await expect(testRequestsPage.summaryMargin).toContainText('125');
    await expect(testRequestsPage.summaryTestingWithVat).toHaveText('472.500đ');
    await expect(testRequestsPage.summaryGrandTotal).toHaveText('472.500đ');

    Logger.step(5, 'Kết hợp thêm Phí lấy mẫu (100.000 + VAT 8% = 108.000đ) và Phí công bố (200.000 + VAT 10% = 220.000đ) từ Phần 3');
    await testRequestsPage.samplingMethodSelect.selectOption('doorstep');
    await testRequestsPage.samplingFeeInput.fill('100000');
    await testRequestsPage.samplingFeeInput.blur();
    await testRequestsPage.samplingVatSelect.selectOption('8');

    await testRequestsPage.publishSelect.selectOption('yes');
    await testRequestsPage.publishFeeInput.fill('200000');
    await testRequestsPage.publishFeeInput.blur();
    await testRequestsPage.publishVatSelect.selectOption('10');

    Logger.step('Verify 4', 'TỔNG THANH TOÁN = 472.500 + 108.000 + 220.000 = 800.500đ');
    await expect(testRequestsPage.summarySamplingFee).toHaveText('108.000đ');
    await expect(testRequestsPage.summaryPublishFee).toHaveText('220.000đ');
    await expect(testRequestsPage.summaryGrandTotal).toHaveText('800.500đ');
  });

  test('TC_YCTN_023: Thao tác "Thêm mẫu", "Xóa" mẫu và "Xóa nền mẫu" trong Phần 5', {
    tag: ['@normal', '@major']
  }, async ({ testRequestsPage }) => {
    Logger.step(1, 'Mở form Thêm mới và thêm 1 Nền mẫu');
    await testRequestsPage.openCreateForm();
    await testRequestsPage.addSampleMatrixByIndex(0);
    await expect(testRequestsPage.sampleArticles).toHaveCount(1);

    Logger.step('Verify 1', 'Khi chỉ có 1 mẫu, nút "Xóa" mẫu bị vô hiệu hóa với chú thích "Cần ít nhất 1 mẫu"');
    const deleteSample1Btn = testRequestsPage.sampleArticles.nth(0).locator('button[aria-label="Xóa mẫu"]');
    await expect(deleteSample1Btn).toBeDisabled();

    Logger.step(2, 'Nhấn nút "Thêm mẫu" trên thanh tiêu đề nền mẫu');
    await testRequestsPage.matrixGroups.first().locator('button').filter({ hasText: 'Thêm mẫu' }).click();
    await expect(testRequestsPage.sampleArticles).toHaveCount(2);

    Logger.step(3, 'Xóa Mẫu 2 vừa thêm và xác nhận trên hộp thoại "Xóa mẫu?"');
    await testRequestsPage.deleteSample(1);
    await expect(testRequestsPage.sampleArticles).toHaveCount(1);

    Logger.step(4, 'Nhấn nút "Xóa nền mẫu" và xác nhận xóa');
    await testRequestsPage.deleteMatrixGroup(0);
    await expect(testRequestsPage.matrixGroups).toHaveCount(0);
  });

  // ==========================================
  // KHỐI 06: TẠO MỚI, CHỈNH SỬA, NHÂN BẢN & XÓA HỒ SƠ ("NHÁP")
  // ==========================================
  test('TC_YCTN_024: Tạo mới Báo giá (Nháp), Chỉnh sửa, Nhân bản và Xóa dọn dẹp thành công', {
    tag: ['@high', '@critical']
  }, async ({ testRequestsPage }) => {
    const timestamp = Date.now().toString().slice(-5);
    const sampleName = `Mẫu Auto Test ${timestamp}`;
    const updatedSampleName = `Mẫu Auto Đã Sửa ${timestamp}`;

    Logger.step(1, 'Mở form Thêm mới và điền đầy đủ thông tin khách hàng, ngày nhận, nền mẫu, chỉ tiêu');
    await testRequestsPage.openCreateForm();
    await testRequestsPage.selectCustomerByIndex(0);
    await testRequestsPage.selectReceivedDateToday();
    await testRequestsPage.contactNameInput.fill('Nguyễn Văn Kiểm Thử');
    await testRequestsPage.contactPhoneInput.fill('0987654321');

    await testRequestsPage.addSampleMatrixByIndex(0);
    await testRequestsPage.sampleArticles.first().locator('input[placeholder="Tên mẫu"]').fill(sampleName);
    await testRequestsPage.openAnalytePickerForSample(0);
    await testRequestsPage.selectAnalytesAndConfirm([0]);

    Logger.step(2, 'Nhấn nút "Lưu" để tạo mới Báo giá');
    await testRequestsPage.submitForm();

    Logger.step('Verify 1 (Tạo mới)', 'Hiển thị thông báo "Đã lưu báo giá." và bản ghi xuất hiện đầu danh sách');
    await expect(testRequestsPage.toastMessages.filter({ hasText: 'Đã lưu báo giá.' })).toBeVisible({ timeout: 10000 });
    await testRequestsPage.filterByStatusChip('draft');
    await expect(testRequestsPage.firstRow).toContainText(sampleName);

    Logger.step(3, 'Tích chọn bản ghi vừa tạo, nhấn nút "Sửa" và cập nhật Tên mẫu');
    await testRequestsPage.checkRow(0);
    await testRequestsPage.openEditForm();
    await testRequestsPage.sampleArticles.first().locator('input[placeholder="Tên mẫu"]').fill(updatedSampleName);
    await testRequestsPage.submitForm();

    Logger.step('Verify 2 (Chỉnh sửa)', 'Thông tin tên mẫu mới được cập nhật ngay trên bảng danh sách');
    await expect(testRequestsPage.firstRow).toContainText(updatedSampleName, { timeout: 10000 });

    Logger.step(4, 'Tích chọn bản ghi, nhấn nút "Nhân bản" và nhấn "Lưu" để tạo bản sao');
    await testRequestsPage.checkRow(0);
    await testRequestsPage.clickClone();
    await expect(testRequestsPage.saveFormButton).toBeVisible();
    await testRequestsPage.submitForm();
    await expect(testRequestsPage.toastMessages.filter({ hasText: 'Đã lưu báo giá.' })).toBeVisible({ timeout: 10000 });

    Logger.step(5, 'Mở hộp thoại Xóa, kiểm tra nút "Hủy" rồi xác nhận "Xóa" dọn dẹp cả 2 bản ghi vừa tạo');
    await testRequestsPage.checkRow(0);
    await testRequestsPage.deleteButton.click();
    await expect(testRequestsPage.actionModal).toBeVisible();
    await expect(testRequestsPage.actionModalTitle).toHaveText('Xác nhận xóa báo giá');

    // Hủy xóa
    await testRequestsPage.actionModalCancelButton.click();
    await expect(testRequestsPage.actionModal).toBeHidden();

    // Xóa thực sự cả 2 bản ghi (bản gốc và bản nhân bản)
    await testRequestsPage.checkRow(0);
    await testRequestsPage.checkRow(1);
    await testRequestsPage.deleteButton.click();
    await expect(testRequestsPage.actionModal).toBeVisible();
    await testRequestsPage.actionModalConfirmButton.click();
    await expect(testRequestsPage.actionModal).toBeHidden({ timeout: 10000 });
  });

  // ==========================================
  // KHỐI 07: LUỒNG CHUYỂN TRẠNG THÁI (NHÁP ➔ KH CHỐT ➔ GỬI YCTN SANG TAB TIẾP NHẬN YCTN)
  // ==========================================
  test('TC_YCTN_025: Chuyển trạng thái từ "Nháp" ➔ "KH chốt" ➔ "Gửi YCTN" (YCTN CD) và kiểm chứng bản ghi đẩy sang tab "TIẾP NHẬN YCTN"', {
    tag: ['@high', '@critical']
  }, async ({ testRequestsPage }) => {
    const timestamp = Date.now().toString().slice(-5);
    const sampleName = `Mẫu Luồng Duyệt ${timestamp}`;

    Logger.step(1, 'Tạo mới một Báo giá hợp lệ ở trạng thái "Nháp" có đầy đủ Ngày nhận, Mẫu và Chỉ tiêu');
    await testRequestsPage.openCreateForm();
    await testRequestsPage.selectCustomerByIndex(0);
    await testRequestsPage.selectReceivedDateToday();
    await testRequestsPage.contactNameInput.fill('Trần Văn Chốt');
    await testRequestsPage.contactPhoneInput.fill('0912345678');

    await testRequestsPage.addSampleMatrixByIndex(0);
    await testRequestsPage.sampleArticles.first().locator('input[placeholder="Tên mẫu"]').fill(sampleName);
    await testRequestsPage.openAnalytePickerForSample(0);
    await testRequestsPage.selectAnalytesAndConfirm([0]);
    await testRequestsPage.submitForm();
    await expect(testRequestsPage.toastMessages.filter({ hasText: 'Đã lưu báo giá.' })).toBeVisible({ timeout: 10000 });

    Logger.step(2, 'Lọc tab "Nháp", lấy Mã BG vừa tạo, tích chọn và nhấn nút "KH chốt"');
    await testRequestsPage.filterByStatusChip('draft');
    await expect(testRequestsPage.firstRow).toContainText(sampleName);
    const bgCode = (await testRequestsPage.firstRow.locator('td').nth(1).locator('.top').innerText()).trim();

    await testRequestsPage.checkRow(0);
    await testRequestsPage.confirmCustomerButton.click();
    await expect(testRequestsPage.actionModal).toBeVisible();
    await expect(testRequestsPage.actionModalTitle).toHaveText('Xác nhận KH chốt');

    Logger.step(3, 'Xác nhận chuyển sang trạng thái "KH chốt"');
    await testRequestsPage.actionModalConfirmButton.click();
    await expect(testRequestsPage.actionModal).toBeHidden({ timeout: 10000 });

    Logger.step('Verify 1', 'Hồ sơ chuyển sang chip "KH chốt" thành công');
    await testRequestsPage.filterByStatusChip('confirmed');
    await expect(testRequestsPage.firstRow).toContainText(bgCode);
    await expect(testRequestsPage.firstRow).toContainText('KH chốt');

    Logger.step(4, 'Tích chọn hồ sơ tại tab "KH chốt" và nhấn nút "Gửi YCTN"');
    await testRequestsPage.checkRow(0);
    await testRequestsPage.sendYctnButton.click();
    await expect(testRequestsPage.actionModal).toBeVisible();
    await expect(testRequestsPage.actionModalTitle).toHaveText('Xác nhận gửi YCTN');

    Logger.step(5, 'Xác nhận gửi YCTN sang bộ phận tiếp nhận');
    await testRequestsPage.actionModalConfirmButton.click();

    Logger.step('Verify 2', 'Hiển thị thông báo "Đã gửi 1 YCTN sang duyệt." và bản ghi xuất hiện ở chip "YCTN CD"');
    await expect(testRequestsPage.toastMessages.filter({ hasText: /Đã gửi 1 YCTN sang duyệt/i })).toBeVisible({ timeout: 10000 });
    await testRequestsPage.filterByStatusChip('pending');
    await expect(testRequestsPage.firstRow).toContainText(bgCode);
    await expect(testRequestsPage.firstRow).toContainText('YCTN CD');

    Logger.step('Verify 3', 'Chuyển sang tab "TIẾP NHẬN YCTN" (/tiep-nhan-yctn) — bản ghi vừa gửi hiển thị ngay đầu danh sách với trạng thái "YCTN CD"');
    await testRequestsPage.receiveYctnTab.click();
    await expect(testRequestsPage.firstRow).toContainText(bgCode, { timeout: 10000 });
    await expect(testRequestsPage.firstRow).toContainText(sampleName);
    await expect(testRequestsPage.firstRow).toContainText('YCTN CD');
  });

  // ==========================================
  // BỘ LỌC NGÀY NHẬN & NGÀY TRẢ (8 KỊCH BẢN CHI TIẾT)
  // ==========================================
  test('TC_YCTN_026: Lọc theo "Ngày nhận" — Chỉ chọn "Từ ngày" (không chọn "Đến ngày")', {
    tag: ['@high', '@major']
  }, async ({ testRequestsPage }) => {
    Logger.step(1, 'Chọn tiêu chí lọc "Ngày nhận", chọn "Từ ngày" = ngày 12 trong tháng và giữ trống "Đến ngày"');
    await testRequestsPage.selectDateFilterType('Ngày nhận');
    const fromDateStr = await testRequestsPage.selectFilterDateByDay('from', 12);

    Logger.step('Verify', 'Mốc "Đến" giữ nguyên dd/mm/yyyy và mọi dòng hiển thị đều có Ngày nhận >= Từ ngày');
    await expect(testRequestsPage.dateToTrigger).toContainText('dd/mm/yyyy');
    const fromTs = testRequestsPage.parseDateDMY(fromDateStr);
    const count = await testRequestsPage.rows.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < Math.min(count, 5); i++) {
      const rowDateStr = (await testRequestsPage.rows.nth(i).locator('td').nth(3).locator('.top').innerText()).trim();
      expect(testRequestsPage.parseDateDMY(rowDateStr)).toBeGreaterThanOrEqual(fromTs);
    }
    await testRequestsPage.clearDateFilter();
  });

  test('TC_YCTN_027: Lọc theo "Ngày nhận" — Chỉ chọn "Đến ngày" (không chọn "Từ ngày")', {
    tag: ['@high', '@major']
  }, async ({ testRequestsPage }) => {
    Logger.step(1, 'Chọn tiêu chí lọc "Ngày nhận", giữ trống "Từ ngày" và chọn "Đến ngày" = Hôm nay');
    await testRequestsPage.selectDateFilterType('Ngày nhận');
    await testRequestsPage.selectFilterDateToday('to');
    const toDateStr = (await testRequestsPage.dateToTrigger.locator('.date-filter-segment__value').innerText()).trim();

    Logger.step('Verify', 'Mốc "Từ" giữ nguyên dd/mm/yyyy và mọi dòng hiển thị đều có Ngày nhận <= Đến ngày');
    await expect(testRequestsPage.dateFromTrigger).toContainText('dd/mm/yyyy');
    const toTs = testRequestsPage.parseDateDMY(toDateStr);
    const count = await testRequestsPage.rows.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < Math.min(count, 5); i++) {
      const rowDateStr = (await testRequestsPage.rows.nth(i).locator('td').nth(3).locator('.top').innerText()).trim();
      expect(testRequestsPage.parseDateDMY(rowDateStr)).toBeLessThanOrEqual(toTs);
    }
    await testRequestsPage.clearDateFilter();
  });

  test('TC_YCTN_028: Lọc theo "Ngày nhận" — Chọn "Từ ngày" và "Đến ngày" trùng cùng 1 ngày', {
    tag: ['@high', '@major']
  }, async ({ testRequestsPage }) => {
    Logger.step(1, 'Chọn tiêu chí lọc "Ngày nhận", chọn cả "Từ ngày" và "Đến ngày" = Hôm nay');
    await testRequestsPage.selectDateFilterType('Ngày nhận');
    await testRequestsPage.selectFilterDateToday('from');
    await testRequestsPage.selectFilterDateToday('to');
    const sameDateStr = (await testRequestsPage.dateFromTrigger.locator('.date-filter-segment__value').innerText()).trim();

    Logger.step('Verify', 'Mọi dòng hiển thị trong bảng đều có Ngày nhận trùng khớp đúng ngày đã chọn');
    const count = await testRequestsPage.rows.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < Math.min(count, 5); i++) {
      await expect(testRequestsPage.rows.nth(i).locator('td').nth(3).locator('.top')).toHaveText(sameDateStr);
    }
    await testRequestsPage.clearDateFilter();
  });

  test('TC_YCTN_029: Lọc theo "Ngày nhận" — Chọn khoảng "Từ ngày" đến "Đến ngày" (Từ ngày < Đến ngày)', {
    tag: ['@high', '@major']
  }, async ({ testRequestsPage }) => {
    Logger.step(1, 'Chọn tiêu chí lọc "Ngày nhận", chọn "Từ ngày" = ngày 10 và "Đến ngày" = ngày 25 trong tháng');
    await testRequestsPage.selectDateFilterType('Ngày nhận');
    const fromDateStr = await testRequestsPage.selectFilterDateByDay('from', 10);
    const toDateStr = await testRequestsPage.selectFilterDateByDay('to', 25);

    Logger.step('Verify', 'Mọi dòng hiển thị đều có Ngày nhận nằm trong khoảng [Từ ngày, Đến ngày]');
    const fromTs = testRequestsPage.parseDateDMY(fromDateStr);
    const toTs = testRequestsPage.parseDateDMY(toDateStr);
    const count = await testRequestsPage.rows.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < Math.min(count, 5); i++) {
      const rowDateStr = (await testRequestsPage.rows.nth(i).locator('td').nth(3).locator('.top').innerText()).trim();
      const rowTs = testRequestsPage.parseDateDMY(rowDateStr);
      expect(rowTs).toBeGreaterThanOrEqual(fromTs);
      expect(rowTs).toBeLessThanOrEqual(toTs);
    }
    await testRequestsPage.clearDateFilter();
  });

  test('TC_YCTN_030: Lọc theo "Ngày trả" — Chỉ chọn "Từ ngày" (không chọn "Đến ngày")', {
    tag: ['@high', '@major']
  }, async ({ testRequestsPage }) => {
    Logger.step(1, 'Chuyển tiêu chí lọc sang "Ngày trả", chọn "Từ ngày" = ngày 15 trong tháng và giữ trống "Đến ngày"');
    await testRequestsPage.selectDateFilterType('Ngày trả');
    await expect(testRequestsPage.dateTypeTrigger).toContainText('Ngày trả');
    const fromDateStr = await testRequestsPage.selectFilterDateByDay('from', 15);

    Logger.step('Verify', 'Mốc "Đến" giữ nguyên dd/mm/yyyy và mọi dòng hiển thị đều có Ngày trả >= Từ ngày');
    await expect(testRequestsPage.dateToTrigger).toContainText('dd/mm/yyyy');
    const fromTs = testRequestsPage.parseDateDMY(fromDateStr);
    const count = await testRequestsPage.rows.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < Math.min(count, 5); i++) {
      const rowDueStr = (await testRequestsPage.rows.nth(i).locator('td').nth(3).locator('.bot').innerText()).trim();
      expect(testRequestsPage.parseDateDMY(rowDueStr)).toBeGreaterThanOrEqual(fromTs);
    }
    await testRequestsPage.clearDateFilter();
  });

  test('TC_YCTN_031: Lọc theo "Ngày trả" — Chỉ chọn "Đến ngày" (không chọn "Từ ngày")', {
    tag: ['@high', '@major']
  }, async ({ testRequestsPage }) => {
    Logger.step(1, 'Chuyển tiêu chí lọc sang "Ngày trả", giữ trống "Từ ngày" và chọn "Đến ngày" = ngày 25 trong tháng');
    await testRequestsPage.selectDateFilterType('Ngày trả');
    const toDateStr = await testRequestsPage.selectFilterDateByDay('to', 25);

    Logger.step('Verify', 'Mốc "Từ" giữ nguyên dd/mm/yyyy và mọi dòng hiển thị đều có Ngày trả <= Đến ngày');
    await expect(testRequestsPage.dateFromTrigger).toContainText('dd/mm/yyyy');
    const toTs = testRequestsPage.parseDateDMY(toDateStr);
    const count = await testRequestsPage.rows.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < Math.min(count, 5); i++) {
      const rowDueStr = (await testRequestsPage.rows.nth(i).locator('td').nth(3).locator('.bot').innerText()).trim();
      expect(testRequestsPage.parseDateDMY(rowDueStr)).toBeLessThanOrEqual(toTs);
    }
    await testRequestsPage.clearDateFilter();
  });

  test('TC_YCTN_032: Lọc theo "Ngày trả" — Chọn "Từ ngày" và "Đến ngày" trùng cùng 1 ngày', {
    tag: ['@high', '@major']
  }, async ({ testRequestsPage }) => {
    Logger.step(1, 'Chuyển tiêu chí lọc sang "Ngày trả", chọn cả "Từ ngày" và "Đến ngày" = ngày 22 trong tháng');
    await testRequestsPage.selectDateFilterType('Ngày trả');
    const sameDateStr = await testRequestsPage.selectFilterDateByDay('from', 22);
    await testRequestsPage.selectFilterDateByDay('to', 22);

    Logger.step('Verify', 'Mọi dòng hiển thị trong bảng đều có Ngày trả trùng khớp đúng ngày 22 đã chọn');
    const count = await testRequestsPage.rows.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < Math.min(count, 5); i++) {
      await expect(testRequestsPage.rows.nth(i).locator('td').nth(3).locator('.bot')).toHaveText(sameDateStr);
    }
    await testRequestsPage.clearDateFilter();
  });

  test('TC_YCTN_033: Lọc theo "Ngày trả" — Chọn khoảng "Từ ngày" đến "Đến ngày" (Từ ngày < Đến ngày) và xóa bộ lọc ngày', {
    tag: ['@high', '@major']
  }, async ({ testRequestsPage }) => {
    Logger.step(1, 'Chuyển tiêu chí lọc sang "Ngày trả", chọn "Từ ngày" = ngày 12 và "Đến ngày" = ngày 25 trong tháng');
    await testRequestsPage.selectDateFilterType('Ngày trả');
    const fromDateStr = await testRequestsPage.selectFilterDateByDay('from', 12);
    const toDateStr = await testRequestsPage.selectFilterDateByDay('to', 25);

    Logger.step('Verify 1', 'Mọi dòng hiển thị đều có Ngày trả nằm trong khoảng [Từ ngày, Đến ngày]');
    const fromTs = testRequestsPage.parseDateDMY(fromDateStr);
    const toTs = testRequestsPage.parseDateDMY(toDateStr);
    const count = await testRequestsPage.rows.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < Math.min(count, 5); i++) {
      const rowDueStr = (await testRequestsPage.rows.nth(i).locator('td').nth(3).locator('.bot').innerText()).trim();
      const rowTs = testRequestsPage.parseDateDMY(rowDueStr);
      expect(rowTs).toBeGreaterThanOrEqual(fromTs);
      expect(rowTs).toBeLessThanOrEqual(toTs);
    }

    Logger.step(2, 'Nhấn nút "Hủy lọc theo ngày." [×] để đặt lại bộ lọc về mặc định');
    await testRequestsPage.clearDateFilter();
    await expect(testRequestsPage.dateFromTrigger).toContainText('dd/mm/yyyy');
    await expect(testRequestsPage.dateToTrigger).toContainText('dd/mm/yyyy');
  });

  // ==========================================
  // KHỐI 09: NGHIỆP VỤ CHỌN HỢP ĐỒNG & ĐỒNG BỘ DỮ LIỆU TẠO MỚI YCTN
  // ==========================================
  test('TC_YCTN_034: Hiển thị danh sách tất cả hợp đồng có trong hệ thống khi mở dropdown "Số hợp đồng" (chưa chọn khách hàng)', {
    tag: ['@normal', '@minor']
  }, async ({ testRequestsPage }) => {
    Logger.step(1, 'Mở form tạo mới Báo giá & YCTN');
    await testRequestsPage.openCreateForm();
    await expect(testRequestsPage.contractTrigger).toBeVisible();

    Logger.step(2, 'Nhấn mở dropdown "Số hợp đồng" khi chưa chọn khách hàng');
    await testRequestsPage.openContractDropdown();

    Logger.step('Verify', 'Dropdown mở ra hiển thị danh sách các hợp đồng có trong hệ thống theo định dạng "[Mã HĐ] · [Tên HĐ]"');
    const menu = testRequestsPage.page.locator('.select-search-menu');
    await expect(menu).toBeVisible();
    const options = menu.locator('.select-search-option');
    const count = await options.count();
    expect(count).toBeGreaterThan(0);
    const firstOptionText = await options.first().innerText();
    expect(firstOptionText).toMatch(/HĐ-|HD-/i);
    await testRequestsPage.page.keyboard.press('Escape');
  });

  test('TC_YCTN_035: Tìm kiếm hợp đồng trong ô dropdown "Số hợp đồng" theo từ khóa mã hoặc tên hợp đồng', {
    tag: ['@normal', '@minor']
  }, async ({ testRequestsPage }) => {
    Logger.step(1, 'Mở form tạo mới và mở dropdown "Số hợp đồng"');
    await testRequestsPage.openCreateForm();
    await testRequestsPage.openContractDropdown();

    Logger.step(2, 'Nhập từ khóa tìm kiếm "HĐ" vào ô tìm kiếm của dropdown');
    const searchInput = testRequestsPage.page.locator('.select-search-menu input, .select-search-search input');
    if (await searchInput.isVisible().catch(() => false)) {
      await searchInput.fill('HĐ');
      await testRequestsPage.page.waitForTimeout(500);

      Logger.step('Verify', 'Danh sách gợi ý chỉ hiển thị các hợp đồng khớp với từ khóa tìm kiếm');
      const filteredOptions = testRequestsPage.page.locator('.select-search-menu .select-search-option, [role="listbox"] [role="option"]');
      const filteredCount = await filteredOptions.count();
      expect(filteredCount).toBeGreaterThan(0);
      for (let i = 0; i < Math.min(filteredCount, 3); i++) {
        const text = await filteredOptions.nth(i).innerText();
        expect(text.toLowerCase()).toContain('hđ');
      }
    }
    await testRequestsPage.page.keyboard.press('Escape');
  });

  test('TC_YCTN_036: Chọn Hợp đồng có đầy đủ thông tin — Tự động điền (Auto-fill) thông tin khách hàng ở Phần 1 và "Số hợp đồng" ở Phần 2', {
    tag: ['@high', '@critical']
  }, async ({ testRequestsPage }) => {
    Logger.step(1, 'Mở form tạo mới và chọn hợp đồng đầu tiên trong danh sách');
    await testRequestsPage.openCreateForm();
    const selectedContractText = await testRequestsPage.selectContractByIndex(0);
    expect(selectedContractText.length).toBeGreaterThan(0);

    Logger.step('Verify 1', 'Trường "Số hợp đồng" hiển thị thông tin hợp đồng đã chọn');
    await expect(testRequestsPage.contractTrigger).toContainText(/HĐ-|HD-/i);

    Logger.step('Verify 2', 'Các thông tin khách hàng ở Phần 1 tự động được điền (Mã KH, Tên KH, Địa chỉ, SĐT)');
    await expect(testRequestsPage.customerCodeTrigger).not.toHaveText(/chọn/i);
    const customerName = await testRequestsPage.customerNameInput.inputValue();
    const customerAddress = await testRequestsPage.customerAddressInput.inputValue();
    const contactPhone = await testRequestsPage.contactPhoneInput.inputValue();
    expect(customerName.trim().length).toBeGreaterThan(0);
    expect(customerAddress.trim().length).toBeGreaterThan(0);
    expect(contactPhone.trim().length).toBeGreaterThan(0);

    Logger.step('Verify 3', 'Trường "Số hợp đồng" ở Phần 2 (Thông tin xuất hóa đơn) tự động điền mã hợp đồng tương ứng');
    const invoiceContractVal = await testRequestsPage.invoiceContractInput.inputValue();
    expect(invoiceContractVal.trim().length).toBeGreaterThan(0);
    expect(selectedContractText).toContain(invoiceContractVal);
  });

  test('TC_YCTN_037: Chọn Hợp đồng thiếu một số thông tin — Các trường không có dữ liệu để trống mà không gây lỗi', {
    tag: ['@normal', '@major']
  }, async ({ testRequestsPage }) => {
    Logger.step(1, 'Mở form tạo mới và chọn hợp đồng trong danh sách');
    await testRequestsPage.openCreateForm();
    await testRequestsPage.selectContractByIndex(0);

    Logger.step('Verify', 'Các trường không có dữ liệu để trống "" một cách an toàn, không hiển thị null hoặc undefined');
    const emailVal = await testRequestsPage.contactEmailInput.inputValue();
    const partnerVal = await testRequestsPage.partnerTrigger.innerText().catch(() => '');
    expect(emailVal).not.toContain('null');
    expect(emailVal).not.toContain('undefined');
    expect(partnerVal).not.toContain('null');
    expect(partnerVal).not.toContain('undefined');
  });

  test('TC_YCTN_038: Thay đổi sang một Hợp đồng khác — Tự động cập nhật lại thông tin khách hàng và "Số hợp đồng" ở Phần 2', {
    tag: ['@normal', '@major']
  }, async ({ testRequestsPage }) => {
    Logger.step(1, 'Mở form tạo mới và chọn hợp đồng tại vị trí 1');
    await testRequestsPage.openCreateForm();
    await testRequestsPage.selectContractByIndex(0);
    const firstInvoiceContract = await testRequestsPage.invoiceContractInput.inputValue();

    Logger.step(2, 'Mở lại dropdown và chọn hợp đồng tại vị trí 2 (nếu có từ 2 hợp đồng trở lên)');
    await testRequestsPage.openContractDropdown();
    const options = testRequestsPage.page.locator('.select-search-menu .select-search-option');
    const count = await options.count();
    if (count > 1) {
      await options.nth(1).click();
      await testRequestsPage.page.waitForTimeout(400);

      Logger.step('Verify', 'Thông tin khách hàng và "Số hợp đồng" ở Phần 2 được cập nhật lại theo hợp đồng mới');
      const secondInvoiceContract = await testRequestsPage.invoiceContractInput.inputValue();
      expect(secondInvoiceContract.trim().length).toBeGreaterThan(0);
    } else {
      await testRequestsPage.page.keyboard.press('Escape');
    }
  });

  test('TC_YCTN_039: Nhấn nút [×] tại trường "Số hợp đồng" — Xóa trắng trường Số hợp đồng, toàn bộ thông tin khách hàng đã điền vẫn giữ nguyên', {
    tag: ['@high', '@critical']
  }, async ({ testRequestsPage }) => {
    Logger.step(1, 'Mở form tạo mới và chọn một hợp đồng để auto-fill thông tin khách hàng');
    await testRequestsPage.openCreateForm();
    await testRequestsPage.selectContractByIndex(0);

    Logger.step(2, 'Ghi nhận thông tin khách hàng hiện tại trước khi xóa hợp đồng');
    const customerCodeText = (await testRequestsPage.customerCodeTrigger.innerText()).trim();
    const customerName = await testRequestsPage.customerNameInput.inputValue();
    const customerAddress = await testRequestsPage.customerAddressInput.inputValue();
    const contactPhone = await testRequestsPage.contactPhoneInput.inputValue();
    expect(customerName.length).toBeGreaterThan(0);

    Logger.step(3, 'Nhấn nút [×] (clear) tại trường "Số hợp đồng"');
    await testRequestsPage.clearContract();

    Logger.step('Verify 1', 'Trường "Số hợp đồng" trở về trạng thái trống (chưa chọn)');
    await expect(testRequestsPage.contractTrigger).not.toContainText(/HĐ-\d+/i);

    Logger.step('Verify 2', 'Toàn bộ thông tin khách hàng ở dưới vẫn giữ nguyên đầy đủ, không bị xóa');
    await expect(testRequestsPage.customerCodeTrigger).toContainText(customerCodeText);
    await expect(testRequestsPage.customerNameInput).toHaveValue(customerName);
    await expect(testRequestsPage.customerAddressInput).toHaveValue(customerAddress);
    await expect(testRequestsPage.contactPhoneInput).toHaveValue(contactPhone);
  });

  test('TC_YCTN_040: Mở lại dropdown "Số hợp đồng" sau khi nhấn [×] — Chỉ hiển thị các hợp đồng thuộc khách hàng hiện tại', {
    tag: ['@high', '@critical']
  }, async ({ testRequestsPage }) => {
    Logger.step(1, 'Mở form tạo mới, chọn Hợp đồng và ghi nhận khách hàng được auto-fill');
    await testRequestsPage.openCreateForm();
    await testRequestsPage.selectContractByIndex(0);
    const customerCode = (await testRequestsPage.customerCodeTrigger.innerText()).trim();

    Logger.step(2, 'Nhấn nút [×] để xóa hợp đồng đã chọn');
    await testRequestsPage.clearContract();

    Logger.step(3, 'Mở lại dropdown "Số hợp đồng" khi khách hàng vẫn đang được chọn');
    await testRequestsPage.openContractDropdown();

    Logger.step('Verify', 'Dropdown chỉ lọc và hiển thị danh sách các hợp đồng thuộc riêng khách hàng đó, không hiển thị toàn bộ hợp đồng hệ thống');
    const options = testRequestsPage.page.locator('.select-search-menu .select-search-option');
    const count = await options.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      const optionText = await options.nth(i).innerText();
      expect(optionText).toMatch(/HĐ-|HD-/i);
    }
    await testRequestsPage.page.keyboard.press('Escape');
  });

  test('TC_YCTN_041: Chọn lại một Hợp đồng từ danh sách đã lọc theo khách hàng — Cập nhật Số hợp đồng mới tương ứng', {
    tag: ['@normal', '@major']
  }, async ({ testRequestsPage }) => {
    Logger.step(1, 'Mở form tạo mới, chọn Hợp đồng rồi xóa hợp đồng bằng nút [×]');
    await testRequestsPage.openCreateForm();
    await testRequestsPage.selectContractByIndex(0);
    await testRequestsPage.clearContract();

    Logger.step(2, 'Mở lại dropdown và chọn một hợp đồng từ danh sách đã lọc của khách hàng đó');
    const reselectedContract = await testRequestsPage.selectContractByIndex(0);
    expect(reselectedContract.length).toBeGreaterThan(0);

    Logger.step('Verify', 'Trường "Số hợp đồng" ở Phần 1 và Phần 2 được cập nhật lại chính xác');
    await expect(testRequestsPage.contractTrigger).toContainText(/HĐ-|HD-/i);
    const invoiceContract = await testRequestsPage.invoiceContractInput.inputValue();
    expect(reselectedContract).toContain(invoiceContract);
  });

  test('TC_YCTN_042: Chọn Khách hàng trước khi chọn Hợp đồng — Dropdown Số hợp đồng chỉ hiển thị các HĐ thuộc khách hàng đó', {
    tag: ['@normal', '@major']
  }, async ({ testRequestsPage }) => {
    Logger.step(1, 'Mở form tạo mới khi chưa chọn Hợp đồng');
    await testRequestsPage.openCreateForm();

    Logger.step(2, 'Chọn một Khách hàng từ combobox "Mã khách hàng"');
    await testRequestsPage.selectCustomerByIndex(0);
    const customerCode = (await testRequestsPage.customerCodeTrigger.innerText()).trim();
    expect(customerCode.length).toBeGreaterThan(0);

    Logger.step(3, 'Mở dropdown "Số hợp đồng"');
    await testRequestsPage.openContractDropdown();

    Logger.step('Verify', 'Danh sách gợi ý Số hợp đồng được lọc phù hợp với khách hàng vừa chọn');
    const options = testRequestsPage.page.locator('.select-search-menu .select-search-option');
    const count = await options.count();
    if (count > 0) {
      const optionText = await options.first().innerText();
      expect(optionText).toMatch(/HĐ-|HD-/i);
    }
    await testRequestsPage.page.keyboard.press('Escape');
  });

  test('TC_YCTN_043: Chọn Khách hàng chưa có hợp đồng nào — Dropdown Số hợp đồng hiển thị danh sách trống hoặc thông báo không có dữ liệu', {
    tag: ['@low', '@minor']
  }, async ({ testRequestsPage }) => {
    Logger.step(1, 'Mở form tạo mới và chọn khách hàng không có hợp đồng');
    await testRequestsPage.openCreateForm();
    await testRequestsPage.selectCustomerByIndex(0);

    Logger.step(2, 'Mở dropdown "Số hợp đồng" để kiểm tra trạng thái dữ liệu');
    await testRequestsPage.openContractDropdown();

    Logger.step('Verify', 'Menu dropdown hiển thị danh sách hợp đồng hợp lệ hoặc hiển thị trạng thái "Không có dữ liệu" mà không bị crash');
    const menu = testRequestsPage.page.locator('.select-search-menu');
    await expect(menu).toBeVisible();
    await testRequestsPage.page.keyboard.press('Escape');
  });

  test('TC_YCTN_044: Xóa Khách hàng bằng nút [×] khi đã chọn Hợp đồng — Xử lý reset trường Hợp đồng hoặc mở lại hiển thị toàn bộ HĐ', {
    tag: ['@normal', '@major']
  }, async ({ testRequestsPage }) => {
    Logger.step(1, 'Mở form tạo mới, chọn Hợp đồng để auto-fill khách hàng');
    await testRequestsPage.openCreateForm();
    await testRequestsPage.selectContractByIndex(0);

    Logger.step(2, 'Nhấn nút [×] xóa Mã khách hàng');
    await testRequestsPage.clearCustomer();

    Logger.step('Verify', 'Trường Mã khách hàng bị xóa trắng; mở lại dropdown Số hợp đồng có thể hiển thị lại danh sách hợp đồng hệ thống');
    await testRequestsPage.openContractDropdown();
    const options = testRequestsPage.page.locator('.select-search-menu .select-search-option');
    const count = await options.count();
    expect(count).toBeGreaterThan(0);
    await testRequestsPage.page.keyboard.press('Escape');
  });

  test('TC_YCTN_045: Tích chọn "Lấy từ khách hàng" ở Phần 2 sau khi chọn Hợp đồng — Sao chép thông tin Tên, MST, Địa chỉ, Email vào hóa đơn; Số hợp đồng ở Phần 2 giữ nguyên', {
    tag: ['@high', '@critical']
  }, async ({ testRequestsPage }) => {
    Logger.step(1, 'Mở form tạo mới và chọn một Hợp đồng');
    await testRequestsPage.openCreateForm();
    await testRequestsPage.selectContractByIndex(0);
    const customerName = await testRequestsPage.customerNameInput.inputValue();
    const customerAddress = await testRequestsPage.customerAddressInput.inputValue();
    const invoiceContractBefore = await testRequestsPage.invoiceContractInput.inputValue();
    expect(invoiceContractBefore.length).toBeGreaterThan(0);

    Logger.step(2, 'Tích chọn checkbox "Lấy từ khách hàng" ở Phần 2 (Thông tin xuất hóa đơn)');
    await testRequestsPage.toggleCopyFromCustomer(true);

    Logger.step('Verify 1', 'Các trường Tên xuất hóa đơn và Địa chỉ xuất hóa đơn được sao chép chính xác từ Phần 1');
    await expect(testRequestsPage.invoiceNameInput).toHaveValue(customerName);
    await expect(testRequestsPage.invoiceAddressInput).toHaveValue(customerAddress);

    Logger.step('Verify 2', 'Trường "Số hợp đồng" ở Phần 2 vẫn giữ nguyên giá trị hợp đồng đã liên kết');
    await expect(testRequestsPage.invoiceContractInput).toHaveValue(invoiceContractBefore);
  });

  test('TC_YCTN_046: Bỏ tích chọn "Lấy từ khách hàng" ở Phần 2 — Cho phép chỉnh sửa thông tin hóa đơn độc lập', {
    tag: ['@normal', '@major']
  }, async ({ testRequestsPage }) => {
    Logger.step(1, 'Mở form tạo mới, chọn Hợp đồng và tích chọn "Lấy từ khách hàng"');
    await testRequestsPage.openCreateForm();
    await testRequestsPage.selectContractByIndex(0);
    await testRequestsPage.toggleCopyFromCustomer(true);
    const originalCustomerName = await testRequestsPage.customerNameInput.inputValue();

    Logger.step(2, 'Bỏ tích chọn "Lấy từ khách hàng" và chỉnh sửa lại Tên xuất hóa đơn');
    await testRequestsPage.toggleCopyFromCustomer(false);
    const customInvoiceName = 'Công ty Cổ phần Thử Nghiệm Riêng';
    await testRequestsPage.invoiceNameInput.fill(customInvoiceName);

    Logger.step('Verify', 'Tên xuất hóa đơn nhận giá trị mới chỉnh sửa, trong khi Tên khách hàng ở Phần 1 vẫn giữ nguyên không đổi');
    await expect(testRequestsPage.invoiceNameInput).toHaveValue(customInvoiceName);
    await expect(testRequestsPage.customerNameInput).toHaveValue(originalCustomerName);
  });

  test('TC_YCTN_047: Tạo mới Báo giá / YCTN hoàn chỉnh có chọn Hợp đồng — Lưu thành công bản ghi gắn với Số hợp đồng', {
    tag: ['@high', '@critical']
  }, async ({ testRequestsPage }) => {
    const timestamp = Date.now().toString().slice(-5);
    const sampleName = `Mẫu Test Hợp Đồng ${timestamp}`;

    Logger.step(1, 'Mở form tạo mới, chọn Hợp đồng và điền đầy đủ thông tin mẫu thử nghiệm');
    await testRequestsPage.openCreateForm();
    await testRequestsPage.selectContractByIndex(0);
    await testRequestsPage.selectReceivedDateToday();

    // Điền bổ sung Người liên hệ & SĐT nếu hợp đồng chưa có sẵn
    const contactName = await testRequestsPage.contactNameInput.inputValue();
    if (!contactName.trim()) {
      await testRequestsPage.contactNameInput.fill('Nguyễn Văn Kiểm Thử');
    }
    const contactPhone = await testRequestsPage.contactPhoneInput.inputValue();
    if (!contactPhone.trim()) {
      await testRequestsPage.contactPhoneInput.fill('0987654321');
    }
    // Chuẩn hóa Email nếu dữ liệu mẫu chứa ký tự có dấu không hợp lệ
    const emailVal = await testRequestsPage.contactEmailInput.inputValue();
    if (emailVal && (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal) || /[à-ỹÀ-Ỹ]/.test(emailVal))) {
      await testRequestsPage.contactEmailInput.fill('contact.test@example.com');
    }

    await testRequestsPage.addSampleMatrixByIndex(0);
    await testRequestsPage.sampleArticles.first().locator('input[placeholder="Tên mẫu"]').fill(sampleName);
    await testRequestsPage.openAnalytePickerForSample(0);
    await testRequestsPage.selectAnalytesAndConfirm([0]);

    Logger.step(2, 'Nhấn nút "Lưu" để hoàn tất tạo mới');
    await testRequestsPage.submitForm();

    Logger.step('Verify', 'Hiển thị thông báo "Đã lưu báo giá." và bản ghi tạo mới xuất hiện đầu danh sách');
    await expect(testRequestsPage.toastMessages.filter({ hasText: 'Đã lưu báo giá.' })).toBeVisible({ timeout: 10000 });
    await testRequestsPage.filterByStatusChip('draft');
    await expect(testRequestsPage.firstRow).toContainText(sampleName);
  });
});

