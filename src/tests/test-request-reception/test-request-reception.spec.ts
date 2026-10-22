import { test, expect } from '../../fixtures/base.fixture';
import { Logger } from '../../utils/logger';
import users from '../../../test-data/users.json';

test.describe('Module Tiếp nhận Yêu cầu thử nghiệm (/tiep-nhan-yctn) - Hệ thống VNTEST LIMS', () => {
  test.beforeEach(async ({ testRequestReceptionPage }) => {
    Logger.step('Setup', 'Điều hướng tới màn hình Tiếp nhận YCTN');
    await testRequestReceptionPage.open('/tiep-nhan-yctn');
    await expect(testRequestReceptionPage.receiveYctnTab).toBeVisible({ timeout: 15000 });
    await expect(testRequestReceptionPage.table).toBeVisible({ timeout: 15000 });
  });

  // ==========================================
  // KHỐI 01: BỐ CỤC & HIỂN THỊ GIAO DIỆN TIẾP NHẬN YCTN
  // ==========================================
  test('TC_TNYCTN_001: Hiển thị đúng cấu trúc 2 tab chuyển đổi ("BG & YCTN" và "TIẾP NHẬN YCTN" đang kích hoạt) và điều hướng qua lại', {
    tag: ['@smoke', '@high', '@critical']
  }, async ({ testRequestReceptionPage, page }) => {
    Logger.step(1, 'Kiểm tra tab "TIẾP NHẬN YCTN" đang ở trạng thái kích hoạt (active)');
    await expect(testRequestReceptionPage.receiveYctnTab).toHaveClass(/active/);
    await expect(testRequestReceptionPage.bgAndYctnTab).toBeVisible();

    Logger.step(2, 'Nhấn sang tab "BG & YCTN" và quay lại tab "TIẾP NHẬN YCTN"');
    await testRequestReceptionPage.bgAndYctnTab.click();
    await expect(page).toHaveURL(/.*\/yeu-cau-thu-nghiem/);

    await testRequestReceptionPage.receiveYctnTab.click();
    await expect(page).toHaveURL(/.*\/tiep-nhan-yctn/);
    await expect(testRequestReceptionPage.receiveYctnTab).toHaveClass(/active/);
  });

  test('TC_TNYCTN_002: Hiển thị đầy đủ 5 chip lọc trạng thái, bộ lọc ngày và 4 nút hành động trên thanh công cụ', {
    tag: ['@smoke', '@high', '@major']
  }, async ({ testRequestReceptionPage }) => {
    Logger.step(1, 'Kiểm tra hiển thị 5 chip lọc trạng thái ("Tất cả", "YCTN CD", "YCTN BS", "YCTN DD", "Chưa Attach")');
    await expect(testRequestReceptionPage.chipAll).toBeVisible();
    await expect(testRequestReceptionPage.chipAll).toHaveClass(/active/);
    await expect(testRequestReceptionPage.chipYctnPending).toBeVisible();
    await expect(testRequestReceptionPage.chipYctnSupplement).toBeVisible();
    await expect(testRequestReceptionPage.chipYctnApproved).toBeVisible();
    await expect(testRequestReceptionPage.chipUnattached).toBeVisible();

    Logger.step(2, 'Kiểm tra hiển thị bộ lọc khoảng ngày và ô tìm kiếm');
    await expect(testRequestReceptionPage.dateTypeFilterButton).toContainText('Ngày nhận');
    await expect(testRequestReceptionPage.fromDateButton).toContainText('dd/mm/yyyy');
    await expect(testRequestReceptionPage.toDateButton).toContainText('dd/mm/yyyy');
    await expect(testRequestReceptionPage.searchInput).toBeVisible();

    Logger.step(3, 'Kiểm tra hiển thị 4 nút hành động ("Duyệt", "YC Bổ sung", "Sửa", "Đính kèm")');
    await expect(testRequestReceptionPage.approveButton).toBeVisible();
    await expect(testRequestReceptionPage.requestSupplementButton).toBeVisible();
    await expect(testRequestReceptionPage.editButton).toBeVisible();
    await expect(testRequestReceptionPage.attachButton).toBeVisible();
  });

  test('TC_TNYCTN_003: Hiển thị bảng danh sách với tiêu đề cột 2 tầng, thông tin phân trang và khung chi tiết trống mặc định', {
    tag: ['@smoke', '@normal', '@minor']
  }, async ({ testRequestReceptionPage }) => {
    Logger.step(1, 'Kiểm tra các cột tiêu đề của bảng danh sách bên trái');
    await expect(testRequestReceptionPage.selectAllCheckbox).toBeVisible();
    await expect(testRequestReceptionPage.tableHeaders.nth(1)).toContainText('Mã BG');
    await expect(testRequestReceptionPage.tableHeaders.nth(1)).toContainText('Mã YCTN');
    await expect(testRequestReceptionPage.tableHeaders.nth(2)).toContainText('Tên khách hàng');
    await expect(testRequestReceptionPage.tableHeaders.nth(2)).toContainText('Tên mẫu');
    await expect(testRequestReceptionPage.tableHeaders.nth(3)).toContainText('Ngày nhận');
    await expect(testRequestReceptionPage.tableHeaders.nth(3)).toContainText('Ngày trả');
    await expect(testRequestReceptionPage.tableHeaders.nth(4)).toContainText('Trạng thái');
    await expect(testRequestReceptionPage.tableHeaders.nth(4)).toContainText('SL');

    Logger.step(2, 'Kiểm tra chân bảng và thông báo mặc định bên khung phải');
    await expect(testRequestReceptionPage.paginationInfo).toBeVisible();
    await expect(testRequestReceptionPage.manageColumnsButton).toBeVisible();
    await expect(testRequestReceptionPage.emptyDetailPlaceholder).toBeVisible();
  });

  // ==========================================
  // KHỐI 02: TRẠNG THÁI 4 NÚT THANH CÔNG CỤ THEO LỰA CHỌN & TRẠNG THÁI HỒ SƠ
  // ==========================================
  test('TC_TNYCTN_004: Kiểm tra trạng thái 4 nút khi chưa tích chọn dòng nào trong bảng', {
    tag: ['@high', '@major']
  }, async ({ testRequestReceptionPage }) => {
    Logger.step(1, 'Quan sát trạng thái các nút trên thanh công cụ khi chưa chọn dòng nào');

    Logger.step('Verify', 'Cả 4 nút "Duyệt", "YC Bổ sung", "Sửa", "Đính kèm" đều ở trạng thái vô hiệu hóa');
    await expect(testRequestReceptionPage.approveButton).toBeDisabled();
    await expect(testRequestReceptionPage.requestSupplementButton).toBeDisabled();
    await expect(testRequestReceptionPage.editButton).toBeDisabled();
    await expect(testRequestReceptionPage.attachButton).toBeDisabled();
  });

  test('TC_TNYCTN_005: Kiểm tra trạng thái 4 nút khi tích chọn 1 dòng ở trạng thái "YCTN CD" (Chờ duyệt)', {
    tag: ['@high', '@critical']
  }, async ({ testRequestReceptionPage }) => {
    Logger.step(1, 'Lọc theo chip "YCTN CD" và tích chọn dòng đầu tiên');
    await testRequestReceptionPage.filterByStatusChip('pending');
    await testRequestReceptionPage.checkRow(0);

    Logger.step('Verify', 'Cả 4 nút "Duyệt", "YC Bổ sung", "Sửa", "Đính kèm" đều được kích hoạt (enabled)');
    await expect(testRequestReceptionPage.approveButton).toBeEnabled();
    await expect(testRequestReceptionPage.requestSupplementButton).toBeEnabled();
    await expect(testRequestReceptionPage.editButton).toBeEnabled();
    await expect(testRequestReceptionPage.attachButton).toBeEnabled();
  });

  test('TC_TNYCTN_006: Kiểm tra trạng thái 4 nút khi tích chọn 1 dòng ở trạng thái "YCTN BS" (Yêu cầu bổ sung)', {
    tag: ['@high', '@major']
  }, async ({ testRequestReceptionPage }) => {
    Logger.step(1, 'Lọc theo chip "YCTN BS" và tích chọn dòng đầu tiên');
    await testRequestReceptionPage.filterByStatusChip('supplement');
    await testRequestReceptionPage.checkRow(0);

    Logger.step('Verify', 'Các nút "Sửa" và "Đính kèm" được bật; các nút "Duyệt" và "YC Bổ sung" bị vô hiệu hóa');
    await expect(testRequestReceptionPage.editButton).toBeEnabled();
    await expect(testRequestReceptionPage.attachButton).toBeEnabled();
    await expect(testRequestReceptionPage.approveButton).toBeDisabled();
    await expect(testRequestReceptionPage.requestSupplementButton).toBeDisabled();
  });

  test('TC_TNYCTN_007: Kiểm tra trạng thái 4 nút khi tích chọn 1 dòng ở trạng thái "YCTN DD" (Đã duyệt)', {
    tag: ['@high', '@major']
  }, async ({ testRequestReceptionPage }) => {
    Logger.step(1, 'Lọc theo chip "YCTN DD" và tích chọn dòng đầu tiên');
    await testRequestReceptionPage.filterByStatusChip('approved');
    await testRequestReceptionPage.checkRow(0);

    Logger.step('Verify', 'Cả 4 nút "Duyệt", "YC Bổ sung", "Sửa", "Đính kèm" đều bị vô hiệu hóa');
    await expect(testRequestReceptionPage.approveButton).toBeDisabled();
    await expect(testRequestReceptionPage.requestSupplementButton).toBeDisabled();
    await expect(testRequestReceptionPage.editButton).toBeDisabled();
    await expect(testRequestReceptionPage.attachButton).toBeDisabled();
  });

  test('TC_TNYCTN_008: Kiểm tra trạng thái 4 nút khi tích chọn nhiều dòng "YCTN CD" cùng lúc (Multi-select)', {
    tag: ['@normal', '@minor']
  }, async ({ testRequestReceptionPage }) => {
    Logger.step(1, 'Lọc theo chip "YCTN CD" và tích chọn 2 dòng đầu tiên');
    await testRequestReceptionPage.filterByStatusChip('pending');
    await testRequestReceptionPage.checkRow(0);
    await testRequestReceptionPage.checkRow(1);

    Logger.step('Verify', 'Bật các nút "Duyệt" và "YC Bổ sung" hàng loạt; vô hiệu hóa các nút "Sửa" và "Đính kèm"');
    await expect(testRequestReceptionPage.approveButton).toBeEnabled();
    await expect(testRequestReceptionPage.requestSupplementButton).toBeEnabled();
    await expect(testRequestReceptionPage.editButton).toBeDisabled();
    await expect(testRequestReceptionPage.attachButton).toBeDisabled();
  });

  // ==========================================
  // KHỐI 03: TÌM KIẾM, BỘ LỌC CHIP & QUẢN LÝ CỘT
  // ==========================================
  test('TC_TNYCTN_009: Lọc danh sách theo từng chip trạng thái ("YCTN CD", "YCTN BS", "YCTN DD", "Chưa Attach", "Tất cả")', {
    tag: ['@high', '@major']
  }, async ({ testRequestReceptionPage }) => {
    Logger.step(1, 'Nhấn chọn chip "YCTN CD"');
    await testRequestReceptionPage.filterByStatusChip('pending');
    await expect(testRequestReceptionPage.chipYctnPending).toHaveClass(/active/);
    await expect(testRequestReceptionPage.firstRow).toContainText('YCTN CD');

    Logger.step(2, 'Nhấn chọn chip "YCTN BS"');
    await testRequestReceptionPage.filterByStatusChip('supplement');
    await expect(testRequestReceptionPage.chipYctnSupplement).toHaveClass(/active/);
    await expect(testRequestReceptionPage.firstRow).toContainText('YCTN BS');

    Logger.step(3, 'Nhấn chọn chip "YCTN DD"');
    await testRequestReceptionPage.filterByStatusChip('approved');
    await expect(testRequestReceptionPage.chipYctnApproved).toHaveClass(/active/);
    await expect(testRequestReceptionPage.firstRow).toContainText('YCTN DD');

    Logger.step(4, 'Nhấn chọn chip "Chưa Attach" rồi quay về "Tất cả"');
    await testRequestReceptionPage.filterByStatusChip('unattached');
    await expect(testRequestReceptionPage.chipUnattached).toHaveClass(/active/);
    expect(await testRequestReceptionPage.rows.count()).toBeGreaterThan(0);

    await testRequestReceptionPage.filterByStatusChip('all');
    await expect(testRequestReceptionPage.chipAll).toHaveClass(/active/);
  });

  test('TC_TNYCTN_010: Tìm kiếm hồ sơ theo Mã Báo giá (MÃ BG) và theo Mã YCTN (TR...), sau đó xóa từ khóa', {
    tag: ['@high', '@major']
  }, async ({ testRequestReceptionPage }) => {
    Logger.step(1, 'Lọc sang chip "YCTN DD" để lấy Mã BG và Mã YCTN của dòng đầu tiên');
    await testRequestReceptionPage.filterByStatusChip('approved');
    const bgCode = (await testRequestReceptionPage.firstRow.locator('td').nth(1).locator('.top').innerText()).trim();
    const trCode = (await testRequestReceptionPage.firstRow.locator('td').nth(1).locator('.bot').innerText()).trim();

    Logger.step(2, `Tìm kiếm theo Mã Báo giá "${bgCode}"`);
    await testRequestReceptionPage.search(bgCode);
    await expect(testRequestReceptionPage.firstRow).toContainText(bgCode);

    Logger.step(3, `Tìm kiếm theo Mã YCTN "${trCode}"`);
    await testRequestReceptionPage.search(trCode);
    await expect(testRequestReceptionPage.firstRow).toContainText(trCode);

    Logger.step(4, 'Xóa từ khóa tìm kiếm');
    await testRequestReceptionPage.clearSearch();
    await expect(testRequestReceptionPage.searchInput).toHaveValue('');
  });

  test('TC_TNYCTN_011: Tìm kiếm hồ sơ theo Tên khách hàng và kiểm tra khi nhập từ khóa không tồn tại', {
    tag: ['@normal', '@minor']
  }, async ({ testRequestReceptionPage }) => {
    Logger.step(1, 'Tìm kiếm theo tên khách hàng "Nam Phong"');
    await testRequestReceptionPage.search('Nam Phong');
    await expect(testRequestReceptionPage.firstRow).toContainText('Nam Phong');

    Logger.step(2, 'Tìm kiếm với từ khóa không tồn tại trong hệ thống');
    await testRequestReceptionPage.search('MA_YCTN_KHONG_TON_TAI_999999');
    await expect(testRequestReceptionPage.rows.filter({ hasText: 'BG-' })).toHaveCount(0);

    Logger.step('Teardown', 'Xóa từ khóa tìm kiếm');
    await testRequestReceptionPage.clearSearch();
  });

  test('TC_TNYCTN_012: Mở và kiểm tra popover "Quản lý cột" ở chân bảng', {
    tag: ['@low', '@minor']
  }, async ({ testRequestReceptionPage }) => {
    Logger.step(1, 'Nhấn nút "Quản lý cột" ở chân bảng');
    await testRequestReceptionPage.manageColumnsButton.click();

    Logger.step('Verify', 'Popover quản lý cột hiển thị trên giao diện');
    await expect(testRequestReceptionPage.manageColumnsPopover).toBeVisible();
  });

  // ==========================================
  // KHỐI 04: XEM CHI TIẾT HỒ SƠ 8 PHẦN BÊN KHUNG PHẢI
  // ==========================================
  test('TC_TNYCTN_013: Bấm chọn một dòng để hiển thị đầy đủ 8 phần thông tin chi tiết bên khung phải (có "6. Thông tin nội bộ")', {
    tag: ['@high', '@major']
  }, async ({ testRequestReceptionPage }) => {
    Logger.step(1, 'Bấm vào dòng đầu tiên trong bảng danh sách');
    await testRequestReceptionPage.clickRowToViewDetail(0);

    Logger.step('Verify', 'Khung bên phải hiển thị đầy đủ 8 phần cấu trúc (bao gồm phần 6. Thông tin nội bộ)');
    await expect(testRequestReceptionPage.section1General).toContainText('Thông tin chung');
    await expect(testRequestReceptionPage.section2Invoice).toContainText('Thông tin xuất hóa đơn');
    await expect(testRequestReceptionPage.section3Additional).toContainText('Dịch vụ bổ sung');
    await expect(testRequestReceptionPage.section4Other).toContainText('Thông tin khác');
    await expect(testRequestReceptionPage.section5Criteria).toContainText('Chỉ tiêu phân tích');
    await expect(testRequestReceptionPage.section6Internal).toContainText('Thông tin nội bộ');
    await expect(testRequestReceptionPage.section7Summary).toContainText('Tổng hợp thanh toán');
    await expect(testRequestReceptionPage.section8Regulations).toContainText('Quy định gửi mẫu');
  });

  test('TC_TNYCTN_014: Hiển thị banner cảnh báo chỉ đọc khi xem hồ sơ ở trạng thái "YCTN DD" (Đã duyệt)', {
    tag: ['@normal', '@major']
  }, async ({ testRequestReceptionPage }) => {
    Logger.step(1, 'Lọc theo chip "YCTN DD" và bấm xem dòng đầu tiên');
    await testRequestReceptionPage.filterByStatusChip('approved');
    await testRequestReceptionPage.clickRowToViewDetail(0);

    Logger.step('Verify', 'Hiển thị thông báo "Hồ sơ ở trạng thái YCTN đã duyệt — không cho phép sửa."');
    await expect(testRequestReceptionPage.readonlyBanner).toBeVisible();
    await expect(testRequestReceptionPage.readonlyBanner).toContainText('Hồ sơ ở trạng thái YCTN đã duyệt — không cho phép sửa.');
  });

  // ==========================================
  // KHỐI 05: CHỈNH SỬA HỒ SƠ & TỰ ĐỘNG TÍNH NGÀY TẠI "6. THÔNG TIN NỘI BỘ"
  // ==========================================
  test('TC_TNYCTN_015: Tích chọn hồ sơ "YCTN CD", nhấn nút "Sửa" để mở chế độ chỉnh sửa và nhấn nút "Huỷ"', {
    tag: ['@normal', '@minor']
  }, async ({ testRequestReceptionPage }) => {
    Logger.step(1, 'Lọc theo chip "YCTN CD", tích chọn dòng đầu tiên và nhấn nút "Sửa"');
    await testRequestReceptionPage.filterByStatusChip('pending');
    await testRequestReceptionPage.checkRow(0);
    await testRequestReceptionPage.openEditForm();

    Logger.step('Verify 1', 'Các trường trong "6. Thông tin nội bộ" được mở khóa và hiển thị nút "Huỷ", "Lưu"');
    await expect(testRequestReceptionPage.internalTestingDaysInput).toBeEnabled();
    await expect(testRequestReceptionPage.internalEarlyDaysInput).toBeEnabled();
    await expect(testRequestReceptionPage.saveFormButton).toBeVisible();
    await expect(testRequestReceptionPage.cancelFormButton).toBeVisible();

    Logger.step(2, 'Nhấn nút "Huỷ" ở cuối form');
    await testRequestReceptionPage.cancelForm();

    Logger.step('Verify 2', 'Thoát khỏi chế độ sửa (ẩn nút "Lưu" và "Huỷ")');
    await expect(testRequestReceptionPage.saveFormButton).toBeHidden();
  });

  test('TC_TNYCTN_016: Kiểm tra "6. Thông tin nội bộ" — Tự động tính "Ngày hẹn trả" và "Ngày hẹn trả phân tích" khi đổi Số ngày kiểm & Số ngày trả sớm', {
    tag: ['@high', '@critical']
  }, async ({ testRequestReceptionPage }) => {
    Logger.step(1, 'Lọc theo chip "YCTN CD", tích chọn dòng đầu tiên và nhấn nút "Sửa"');
    await testRequestReceptionPage.filterByStatusChip('pending');
    await testRequestReceptionPage.checkRow(0);
    await testRequestReceptionPage.openEditForm();

    Logger.step(2, 'Chọn Ngày nhận là "Hôm nay", nhập Số ngày kiểm = 10 và Số ngày trả sớm = 0, ghi nhận Ngày hẹn trả ban đầu');
    await testRequestReceptionPage.selectInternalReceivedDateToday();
    await testRequestReceptionPage.internalTestingDaysInput.fill('10');
    await testRequestReceptionPage.internalTestingDaysInput.blur();
    await testRequestReceptionPage.internalEarlyDaysInput.fill('0');
    await testRequestReceptionPage.internalEarlyDaysInput.blur();
    const dueDate10Days = await testRequestReceptionPage.internalDueDateInput.inputValue();
    expect(dueDate10Days).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);

    Logger.step(3, 'Tăng Số ngày kiểm lên 15 ngày và nhập Số ngày trả sớm = 3 ngày');
    await testRequestReceptionPage.internalTestingDaysInput.fill('15');
    await testRequestReceptionPage.internalTestingDaysInput.blur();
    await testRequestReceptionPage.internalEarlyDaysInput.fill('3');
    await testRequestReceptionPage.internalEarlyDaysInput.blur();

    Logger.step('Verify 1', 'Ngày hẹn trả tự động cập nhật sang ngày mới và Ngày hẹn trả phân tích được tính tự động');
    const dueDate15Days = await testRequestReceptionPage.internalDueDateInput.inputValue();
    expect(dueDate15Days).not.toBe(dueDate10Days);
    const analysisDateText = (await testRequestReceptionPage.internalAnalysisDueDateTrigger.innerText()).trim();
    expect(analysisDateText).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);

    Logger.step(4, 'Tích chọn "Không tính T7, CN", chọn buổi "Chiều" và chứng nhận "Vimcerts"');
    await testRequestReceptionPage.internalExcludeWeekendCheckbox.check();
    await testRequestReceptionPage.internalSessionAfternoonRadio.check();
    await testRequestReceptionPage.internalCertificateVimcertsRadio.check();

    await expect(testRequestReceptionPage.internalExcludeWeekendCheckbox).toBeChecked();
    await expect(testRequestReceptionPage.internalSessionAfternoonRadio).toBeChecked();
    await expect(testRequestReceptionPage.internalCertificateVimcertsRadio).toBeChecked();

    await testRequestReceptionPage.cancelForm();
  });

  test('TC_TNYCTN_017: Chỉnh sửa thông tin nội bộ của hồ sơ "YCTN CD" và nhấn nút "Lưu" cập nhật thành công', {
    tag: ['@high', '@critical']
  }, async ({ testRequestReceptionPage }) => {
    const timestamp = Date.now().toString().slice(-5);
    const internalNote = `Lưu ý nội bộ Auto Test ${timestamp}`;

    Logger.step(1, 'Lọc theo chip "YCTN CD", tích chọn dòng đầu tiên và nhấn nút "Sửa"');
    await testRequestReceptionPage.filterByStatusChip('pending');
    await testRequestReceptionPage.checkRow(0);
    await testRequestReceptionPage.openEditForm();

    Logger.step(2, 'Nhập "Lưu ý phiếu kiểm nghiệm" tại Phần 6 và nhấn nút "Lưu"');
    await testRequestReceptionPage.internalNoteTextarea.fill(internalNote);
    await testRequestReceptionPage.submitForm();

    Logger.step('Verify', 'Hiển thị thông báo "Đã cập nhật báo giá." và lưu đúng nội dung vừa sửa');
    await expect(testRequestReceptionPage.toastMessages.filter({ hasText: 'Đã cập nhật báo giá.' })).toBeVisible({ timeout: 10000 });
    await expect(testRequestReceptionPage.internalNoteTextarea).toHaveValue(internalNote);
  });

  // ==========================================
  // KHỐI 06: HỘP THOẠI TỆP ĐÍNH KÈM ("ĐÍNH KÈM")
  // ==========================================
  test('TC_TNYCTN_018: Mở hộp thoại "Tệp đính kèm", kiểm tra giao diện tải tệp và đóng hộp thoại bằng nút "Hủy"', {
    tag: ['@normal', '@major']
  }, async ({ testRequestReceptionPage }) => {
    Logger.step(1, 'Lọc theo chip "YCTN CD", tích chọn dòng đầu tiên và nhấn nút "Đính kèm"');
    await testRequestReceptionPage.filterByStatusChip('pending');
    const bgCode = (await testRequestReceptionPage.firstRow.locator('td').nth(1).locator('.top').innerText()).trim();
    await testRequestReceptionPage.checkRow(0);
    await testRequestReceptionPage.attachButton.click();

    Logger.step('Verify 1', 'Hộp thoại "Tệp đính kèm" hiển thị đúng Mã BG, vùng kéo thả tệp và nút "Hủy", "Lưu"');
    await expect(testRequestReceptionPage.attachmentModal).toBeVisible();
    await expect(testRequestReceptionPage.attachmentModalTitle).toHaveText('Tệp đính kèm');
    await expect(testRequestReceptionPage.attachmentModalInfo).toContainText(bgCode);
    await expect(testRequestReceptionPage.attachmentDropzone).toContainText('Chỉ chấp nhận PDF, JPG, PNG. Dung lượng tối đa 100MB cho mỗi tệp.');
    await expect(testRequestReceptionPage.attachmentModalSaveButton).toBeVisible();

    Logger.step(2, 'Đính kèm thử 1 tệp ảnh PNG hợp lệ vào vùng chọn tệp');
    const pngBuffer = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      'base64'
    );
    await testRequestReceptionPage.attachmentFileInput.setInputFiles({
      name: 'bien-ban-ban-giao-mau.png',
      mimeType: 'image/png',
      buffer: pngBuffer,
    });
    await expect(testRequestReceptionPage.attachmentModal).toContainText('bien-ban-ban-giao-mau.png');

    Logger.step(3, 'Nhấn nút "Hủy" và xác nhận nút "Đóng" trên hộp thoại cảnh báo thay đổi chưa lưu ("Đóng hộp thoại?")');
    await testRequestReceptionPage.attachmentModalCancelButton.click();
    const discardDialog = testRequestReceptionPage.page.locator('[role="dialog"]').filter({ hasText: 'Đóng hộp thoại?' });
    await expect(discardDialog).toBeVisible();
    await discardDialog.locator('button').filter({ hasText: /^Đóng$/ }).click();
    await expect(testRequestReceptionPage.attachmentModal).toBeHidden();
  });

  // ==========================================
  // KHỐI 07: LUỒNG NGHIỆP VỤ "YC BỔ SUNG" (YCTN BS) & "DUYỆT" (YCTN DD - SINH MÃ TR...)
  // ==========================================
  test('TC_TNYCTN_019: Kiểm tra hộp thoại "Yêu cầu bổ sung" (validate bắt buộc nhập Lý do) và chuyển hồ sơ sang trạng thái "YCTN BS"', {
    tag: ['@high', '@critical']
  }, async ({ testRequestsPage, testRequestReceptionPage }) => {
    const timestamp = Date.now().toString().slice(-5);
    const sampleName = `Mẫu YC Bổ Sung ${timestamp}`;

    Logger.step(1, 'Tạo mới 1 hồ sơ và gửi sang trạng thái "YCTN CD" để kiểm thử độc lập');
    await testRequestsPage.open();
    await testRequestsPage.openCreateForm();
    await testRequestsPage.selectCustomerByIndex(0);
    await testRequestsPage.selectReceivedDateToday();
    await testRequestsPage.contactNameInput.fill('Lê Văn Bổ Sung');
    await testRequestsPage.contactPhoneInput.fill('0933445566');
    await testRequestsPage.addSampleMatrixByIndex(0);
    await testRequestsPage.sampleArticles.first().locator('input[placeholder="Tên mẫu"]').fill(sampleName);
    await testRequestsPage.openAnalytePickerForSample(0);
    await testRequestsPage.selectAnalytesAndConfirm([0]);
    await testRequestsPage.submitForm();
    await expect(testRequestsPage.toastMessages.filter({ hasText: 'Đã lưu báo giá.' })).toBeVisible({ timeout: 10000 });

    await testRequestsPage.filterByStatusChip('draft');
    const bgCode = (await testRequestsPage.firstRow.locator('td').nth(1).locator('.top').innerText()).trim();
    await testRequestsPage.checkRow(0);
    await testRequestsPage.confirmCustomerButton.click();
    await testRequestsPage.actionModalConfirmButton.click();
    await expect(testRequestsPage.actionModal).toBeHidden({ timeout: 10000 });

    await testRequestsPage.filterByStatusChip('confirmed');
    await testRequestsPage.checkRow(0);
    await testRequestsPage.sendYctnButton.click();
    await testRequestsPage.actionModalConfirmButton.click();
    await expect(testRequestsPage.actionModal).toBeHidden({ timeout: 10000 });

    Logger.step(2, 'Mở màn Tiếp nhận YCTN, lọc chip "YCTN CD", chọn hồ sơ vừa tạo và nhấn nút "YC Bổ sung"');
    await testRequestReceptionPage.open();
    await testRequestReceptionPage.filterByStatusChip('pending');
    await expect(testRequestReceptionPage.firstRow).toContainText(bgCode);
    await testRequestReceptionPage.checkRow(0);
    await testRequestReceptionPage.requestSupplementButton.click();

    Logger.step('Verify 1', 'Khi chưa nhập Lý do: nút "YC Bổ sung" trong hộp thoại bị vô hiệu hóa và bộ đếm hiển thị "0/1000"');
    await expect(testRequestReceptionPage.supplementModal).toBeVisible();
    await expect(testRequestReceptionPage.supplementModalTitle).toHaveText('Yêu cầu bổ sung');
    await expect(testRequestReceptionPage.supplementCharCount).toHaveText('0/1000');
    await expect(testRequestReceptionPage.supplementModalConfirmButton).toBeDisabled();

    Logger.step(3, 'Nhập Lý do yêu cầu bổ sung và nhấn xác nhận "YC Bổ sung"');
    const reason = 'Vui lòng bổ sung tiêu chuẩn so sánh và khối lượng mẫu.';
    await testRequestReceptionPage.supplementReasonTextarea.fill(reason);
    await expect(testRequestReceptionPage.supplementModalConfirmButton).toBeEnabled();
    await expect(testRequestReceptionPage.supplementCharCount).toHaveText(`${reason.length}/1000`);
    await testRequestReceptionPage.supplementModalConfirmButton.click();

    Logger.step('Verify 2', 'Hiển thị thông báo "Đã chuyển 1 hồ sơ sang YCTN BS." và bản ghi xuất hiện trong chip "YCTN BS"');
    await expect(
      testRequestReceptionPage.toastMessages.filter({ hasText: /Đã chuyển 1 hồ sơ sang YCTN BS/i })
    ).toBeVisible({ timeout: 10000 });
    await testRequestReceptionPage.filterByStatusChip('supplement');
    await expect(testRequestReceptionPage.firstRow).toContainText(bgCode);
    await expect(testRequestReceptionPage.firstRow).toContainText('YCTN BS');
  });

  test('TC_TNYCTN_020: Thực hiện luồng "Duyệt" hồ sơ từ "YCTN CD" sang "YCTN DD" — tự động sinh Mã YCTN (TR...)', {
    tag: ['@high', '@critical']
  }, async ({ testRequestsPage, testRequestReceptionPage }) => {
    const timestamp = Date.now().toString().slice(-5);
    const sampleName = `Mẫu Duyệt YCTN ${timestamp}`;

    Logger.step(1, 'Tạo mới 1 hồ sơ và gửi sang trạng thái "YCTN CD" để kiểm thử luồng Duyệt');
    await testRequestsPage.open();
    await testRequestsPage.openCreateForm();
    await testRequestsPage.selectCustomerByIndex(0);
    await testRequestsPage.selectReceivedDateToday();
    await testRequestsPage.contactNameInput.fill('Phạm Văn Duyệt');
    await testRequestsPage.contactPhoneInput.fill('0977889900');
    await testRequestsPage.addSampleMatrixByIndex(0);
    await testRequestsPage.sampleArticles.first().locator('input[placeholder="Tên mẫu"]').fill(sampleName);
    await testRequestsPage.openAnalytePickerForSample(0);
    await testRequestsPage.selectAnalytesAndConfirm([0]);
    await testRequestsPage.submitForm();
    await expect(testRequestsPage.toastMessages.filter({ hasText: 'Đã lưu báo giá.' })).toBeVisible({ timeout: 10000 });

    await testRequestsPage.filterByStatusChip('draft');
    const bgCode = (await testRequestsPage.firstRow.locator('td').nth(1).locator('.top').innerText()).trim();
    await testRequestsPage.checkRow(0);
    await testRequestsPage.confirmCustomerButton.click();
    await testRequestsPage.actionModalConfirmButton.click();
    await expect(testRequestsPage.actionModal).toBeHidden({ timeout: 10000 });

    await testRequestsPage.filterByStatusChip('confirmed');
    await testRequestsPage.checkRow(0);
    await testRequestsPage.sendYctnButton.click();
    await testRequestsPage.actionModalConfirmButton.click();
    await expect(testRequestsPage.actionModal).toBeHidden({ timeout: 10000 });

    Logger.step(2, 'Mở màn Tiếp nhận YCTN, lọc chip "YCTN CD", tích chọn hồ sơ và nhấn nút "Duyệt"');
    await testRequestReceptionPage.open();
    await testRequestReceptionPage.filterByStatusChip('pending');
    await expect(testRequestReceptionPage.firstRow).toContainText(bgCode);
    await testRequestReceptionPage.checkRow(0);
    await testRequestReceptionPage.approveButton.click();

    Logger.step('Verify 1', 'Hộp thoại "Duyệt YCTN" hiển thị đầy đủ 5 dòng mô tả hệ quả nghiệp vụ và thông tin hồ sơ');
    await expect(testRequestReceptionPage.approveModal).toBeVisible();
    await expect(testRequestReceptionPage.approveModalTitle).toHaveText('Duyệt YCTN');
    await expect(testRequestReceptionPage.approveModalEffects).toHaveCount(5);
    await expect(testRequestReceptionPage.approveModalTableRows.first()).toContainText(bgCode);

    Logger.step(3, 'Nhấn nút "Duyệt" trong hộp thoại xác nhận');
    await testRequestReceptionPage.approveModalConfirmButton.click();

    Logger.step('Verify 2', 'Hiển thị thông báo "Đã duyệt 1 YCTN.", chuyển sang chip "YCTN DD" và tự động sinh Mã YCTN (TR...)');
    await expect(
      testRequestReceptionPage.toastMessages.filter({ hasText: /Đã duyệt 1 YCTN/i })
    ).toBeVisible({ timeout: 10000 });
    await testRequestReceptionPage.filterByStatusChip('approved');
    await expect(testRequestReceptionPage.firstRow).toContainText(bgCode);
    await expect(testRequestReceptionPage.firstRow).toContainText('YCTN DD');

    const generatedTrCode = (await testRequestReceptionPage.firstRow.locator('td').nth(1).locator('.bot').innerText()).trim();
    expect(generatedTrCode).toMatch(/^TR\d+$/);
  });

  // ==========================================
  // BỘ LỌC NGÀY NHẬN & NGÀY TRẢ (8 KỊCH BẢN CHI TIẾT)
  // ==========================================
  test('TC_TNYCTN_021: Lọc Tiếp nhận YCTN theo "Ngày nhận" — Chỉ chọn "Từ ngày" (không chọn "Đến ngày")', {
    tag: ['@high', '@major']
  }, async ({ testRequestReceptionPage }) => {
    Logger.step(1, 'Chọn tiêu chí lọc "Ngày nhận", chọn "Từ ngày" = ngày 12 trong tháng và giữ trống "Đến ngày"');
    await testRequestReceptionPage.selectDateFilterType('Ngày nhận');
    const fromDateStr = await testRequestReceptionPage.selectFilterDateByDay('from', 12);

    Logger.step('Verify', 'Mốc "Đến" giữ nguyên dd/mm/yyyy và mọi dòng hiển thị đều có Ngày nhận >= Từ ngày');
    await expect(testRequestReceptionPage.toDateButton).toContainText('dd/mm/yyyy');
    const fromTs = testRequestReceptionPage.parseDateDMY(fromDateStr);
    const count = await testRequestReceptionPage.rows.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < Math.min(count, 5); i++) {
      const rowDateStr = (await testRequestReceptionPage.rows.nth(i).locator('td').nth(3).locator('.top').innerText()).trim();
      expect(testRequestReceptionPage.parseDateDMY(rowDateStr)).toBeGreaterThanOrEqual(fromTs);
    }
    await testRequestReceptionPage.clearDateFilter();
  });

  test('TC_TNYCTN_022: Lọc Tiếp nhận YCTN theo "Ngày nhận" — Chỉ chọn "Đến ngày" (không chọn "Từ ngày")', {
    tag: ['@high', '@major']
  }, async ({ testRequestReceptionPage }) => {
    Logger.step(1, 'Chọn tiêu chí lọc "Ngày nhận", giữ trống "Từ ngày" và chọn "Đến ngày" = Hôm nay');
    await testRequestReceptionPage.selectDateFilterType('Ngày nhận');
    await testRequestReceptionPage.selectFilterDateToday('to');
    const toDateStr = (await testRequestReceptionPage.toDateButton.locator('.date-filter-segment__value').innerText()).trim();

    Logger.step('Verify', 'Mốc "Từ" giữ nguyên dd/mm/yyyy và mọi dòng hiển thị đều có Ngày nhận <= Đến ngày');
    await expect(testRequestReceptionPage.fromDateButton).toContainText('dd/mm/yyyy');
    const toTs = testRequestReceptionPage.parseDateDMY(toDateStr);
    const count = await testRequestReceptionPage.rows.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < Math.min(count, 5); i++) {
      const rowDateStr = (await testRequestReceptionPage.rows.nth(i).locator('td').nth(3).locator('.top').innerText()).trim();
      expect(testRequestReceptionPage.parseDateDMY(rowDateStr)).toBeLessThanOrEqual(toTs);
    }
    await testRequestReceptionPage.clearDateFilter();
  });

  test('TC_TNYCTN_023: Lọc Tiếp nhận YCTN theo "Ngày nhận" — Chọn "Từ ngày" và "Đến ngày" trùng cùng 1 ngày', {
    tag: ['@high', '@major']
  }, async ({ testRequestReceptionPage }) => {
    Logger.step(1, 'Chọn tiêu chí lọc "Ngày nhận", chọn cả "Từ ngày" và "Đến ngày" = Hôm nay');
    await testRequestReceptionPage.selectDateFilterType('Ngày nhận');
    await testRequestReceptionPage.selectFilterDateToday('from');
    await testRequestReceptionPage.selectFilterDateToday('to');
    const sameDateStr = (await testRequestReceptionPage.fromDateButton.locator('.date-filter-segment__value').innerText()).trim();

    Logger.step('Verify', 'Mọi dòng hiển thị trong bảng đều có Ngày nhận trùng khớp đúng ngày đã chọn');
    const count = await testRequestReceptionPage.rows.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < Math.min(count, 5); i++) {
      await expect(testRequestReceptionPage.rows.nth(i).locator('td').nth(3).locator('.top')).toHaveText(sameDateStr);
    }
    await testRequestReceptionPage.clearDateFilter();
  });

  test('TC_TNYCTN_024: Lọc Tiếp nhận YCTN theo "Ngày nhận" — Chọn khoảng "Từ ngày" đến "Đến ngày" (Từ ngày < Đến ngày)', {
    tag: ['@high', '@major']
  }, async ({ testRequestReceptionPage }) => {
    Logger.step(1, 'Chọn tiêu chí lọc "Ngày nhận", chọn "Từ ngày" = ngày 10 và "Đến ngày" = ngày 25 trong tháng');
    await testRequestReceptionPage.selectDateFilterType('Ngày nhận');
    const fromDateStr = await testRequestReceptionPage.selectFilterDateByDay('from', 10);
    const toDateStr = await testRequestReceptionPage.selectFilterDateByDay('to', 25);

    Logger.step('Verify', 'Mọi dòng hiển thị đều có Ngày nhận nằm trong khoảng [Từ ngày, Đến ngày]');
    const fromTs = testRequestReceptionPage.parseDateDMY(fromDateStr);
    const toTs = testRequestReceptionPage.parseDateDMY(toDateStr);
    const count = await testRequestReceptionPage.rows.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < Math.min(count, 5); i++) {
      const rowDateStr = (await testRequestReceptionPage.rows.nth(i).locator('td').nth(3).locator('.top').innerText()).trim();
      const rowTs = testRequestReceptionPage.parseDateDMY(rowDateStr);
      expect(rowTs).toBeGreaterThanOrEqual(fromTs);
      expect(rowTs).toBeLessThanOrEqual(toTs);
    }
    await testRequestReceptionPage.clearDateFilter();
  });

  test('TC_TNYCTN_025: Lọc Tiếp nhận YCTN theo "Ngày trả" — Chỉ chọn "Từ ngày" (không chọn "Đến ngày")', {
    tag: ['@high', '@major']
  }, async ({ testRequestReceptionPage }) => {
    Logger.step(1, 'Chuyển tiêu chí lọc sang "Ngày trả", chọn "Từ ngày" = ngày 15 trong tháng và giữ trống "Đến ngày"');
    await testRequestReceptionPage.selectDateFilterType('Ngày trả');
    await expect(testRequestReceptionPage.dateTypeFilterButton).toContainText('Ngày trả');
    const fromDateStr = await testRequestReceptionPage.selectFilterDateByDay('from', 15);

    Logger.step('Verify', 'Mốc "Đến" giữ nguyên dd/mm/yyyy và mọi dòng hiển thị đều có Ngày trả >= Từ ngày');
    await expect(testRequestReceptionPage.toDateButton).toContainText('dd/mm/yyyy');
    const fromTs = testRequestReceptionPage.parseDateDMY(fromDateStr);
    const count = await testRequestReceptionPage.rows.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < Math.min(count, 5); i++) {
      const rowDueStr = (await testRequestReceptionPage.rows.nth(i).locator('td').nth(3).locator('.bot').innerText()).trim();
      expect(testRequestReceptionPage.parseDateDMY(rowDueStr)).toBeGreaterThanOrEqual(fromTs);
    }
    await testRequestReceptionPage.clearDateFilter();
  });

  test('TC_TNYCTN_026: Lọc Tiếp nhận YCTN theo "Ngày trả" — Chỉ chọn "Đến ngày" (không chọn "Từ ngày")', {
    tag: ['@high', '@major']
  }, async ({ testRequestReceptionPage }) => {
    Logger.step(1, 'Chuyển tiêu chí lọc sang "Ngày trả", giữ trống "Từ ngày" và chọn "Đến ngày" = ngày 25 trong tháng');
    await testRequestReceptionPage.selectDateFilterType('Ngày trả');
    const toDateStr = await testRequestReceptionPage.selectFilterDateByDay('to', 25);

    Logger.step('Verify', 'Mốc "Từ" giữ nguyên dd/mm/yyyy và mọi dòng hiển thị đều có Ngày trả <= Đến ngày');
    await expect(testRequestReceptionPage.fromDateButton).toContainText('dd/mm/yyyy');
    const toTs = testRequestReceptionPage.parseDateDMY(toDateStr);
    const count = await testRequestReceptionPage.rows.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < Math.min(count, 5); i++) {
      const rowDueStr = (await testRequestReceptionPage.rows.nth(i).locator('td').nth(3).locator('.bot').innerText()).trim();
      expect(testRequestReceptionPage.parseDateDMY(rowDueStr)).toBeLessThanOrEqual(toTs);
    }
    await testRequestReceptionPage.clearDateFilter();
  });

  test('TC_TNYCTN_027: Lọc Tiếp nhận YCTN theo "Ngày trả" — Chọn "Từ ngày" và "Đến ngày" trùng cùng 1 ngày', {
    tag: ['@high', '@major']
  }, async ({ testRequestReceptionPage }) => {
    Logger.step(1, 'Chuyển tiêu chí lọc sang "Ngày trả", chọn cả "Từ ngày" và "Đến ngày" = ngày 22 trong tháng');
    await testRequestReceptionPage.selectDateFilterType('Ngày trả');
    const sameDateStr = await testRequestReceptionPage.selectFilterDateByDay('from', 22);
    await testRequestReceptionPage.selectFilterDateByDay('to', 22);

    Logger.step('Verify', 'Mọi dòng hiển thị trong bảng đều có Ngày trả trùng khớp đúng ngày 22 đã chọn');
    const count = await testRequestReceptionPage.rows.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < Math.min(count, 5); i++) {
      await expect(testRequestReceptionPage.rows.nth(i).locator('td').nth(3).locator('.bot')).toHaveText(sameDateStr);
    }
    await testRequestReceptionPage.clearDateFilter();
  });

  test('TC_TNYCTN_028: Lọc Tiếp nhận YCTN theo "Ngày trả" — Chọn khoảng "Từ ngày" đến "Đến ngày" (Từ ngày < Đến ngày) và xóa bộ lọc ngày', {
    tag: ['@high', '@major']
  }, async ({ testRequestReceptionPage }) => {
    Logger.step(1, 'Chuyển tiêu chí lọc sang "Ngày trả", chọn "Từ ngày" = ngày 12 và "Đến ngày" = ngày 25 trong tháng');
    await testRequestReceptionPage.selectDateFilterType('Ngày trả');
    const fromDateStr = await testRequestReceptionPage.selectFilterDateByDay('from', 12);
    const toDateStr = await testRequestReceptionPage.selectFilterDateByDay('to', 25);

    Logger.step('Verify 1', 'Mọi dòng hiển thị đều có Ngày trả nằm trong khoảng [Từ ngày, Đến ngày]');
    const fromTs = testRequestReceptionPage.parseDateDMY(fromDateStr);
    const toTs = testRequestReceptionPage.parseDateDMY(toDateStr);
    const count = await testRequestReceptionPage.rows.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < Math.min(count, 5); i++) {
      const rowDueStr = (await testRequestReceptionPage.rows.nth(i).locator('td').nth(3).locator('.bot').innerText()).trim();
      const rowTs = testRequestReceptionPage.parseDateDMY(rowDueStr);
      expect(rowTs).toBeGreaterThanOrEqual(fromTs);
      expect(rowTs).toBeLessThanOrEqual(toTs);
    }

    Logger.step(2, 'Nhấn nút "Hủy lọc theo ngày." [×] để đặt lại bộ lọc về mặc định');
    await testRequestReceptionPage.clearDateFilter();
    await expect(testRequestReceptionPage.fromDateButton).toContainText('dd/mm/yyyy');
    await expect(testRequestReceptionPage.toDateButton).toContainText('dd/mm/yyyy');
  });
});
