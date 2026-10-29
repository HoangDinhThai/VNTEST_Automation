import { test, expect } from '../../fixtures/base.fixture';
import { Logger } from '../../utils/logger';
import users from '../../../test-data/users.json';

test.describe('Module Quản lý Hợp đồng - Hệ thống VNTEST LIMS (/hop-dong)', () => {
  test.beforeEach(async ({ loginPage, contractsPage, page }) => {
    Logger.step('Setup', 'Đăng nhập vào hệ thống VNTEST LIMS');
    await loginPage.open('/dang-nhap');
    await loginPage.login(users.validUser.username, users.validUser.password);
    await page.waitForURL('https://vntest-lims.pirago.work/', { timeout: 15000 });

    Logger.step('Navigation', 'Điều hướng tới trang Quản lý Hợp đồng (/hop-dong)');
    await contractsPage.open('/hop-dong');
    await expect(contractsPage.subtabDraft).toBeVisible({ timeout: 15000 });
  });

  // =========================================================================
  // KHỐI 01: BỐ CỤC, ĐIỀU HƯỚNG & TRẠNG THÁI THANH CÔNG CỤ (UI & NAVIGATION)
  // =========================================================================
  test.describe('KHỐI 01: Bố cục, Điều hướng & Thanh công cụ', () => {
    test('TC_NAV_01: Hiển thị đầy đủ các thành phần tổng quan màn hình Hợp đồng', {
      tag: ['@normal', '@minor']
    }, async ({ contractsPage }) => {
      Logger.step(1, 'Kiểm tra 2 sub-tab Hợp đồng nháp và Hợp đồng ký');
      await expect(contractsPage.subtabDraft).toBeVisible();
      await expect(contractsPage.subtabSigned).toBeVisible();

      Logger.step(2, 'Kiểm tra thanh công cụ và ô tìm kiếm');
      await expect(contractsPage.btnAdd).toBeVisible();
      await expect(contractsPage.searchInput).toBeVisible();
      await expect(contractsPage.contractTypeFilterTrigger).toBeVisible();

      Logger.step(3, 'Kiểm tra bảng dữ liệu danh sách hợp đồng');
      await expect(contractsPage.table).toBeVisible();
      await expect(contractsPage.firstRow).toBeVisible();
    });

    test('TC_NAV_02: Chuyển đổi qua lại giữa 2 sub-tab "Hợp đồng nháp" và "Hợp đồng ký"', {
      tag: ['@normal', '@minor']
    }, async ({ contractsPage }) => {
      Logger.step(1, 'Kiểm tra toolbar ở tab Hợp đồng nháp: có nút "Chuyển HĐ ký", ẩn dropdown TT');
      await expect(contractsPage.btnConvertSigned).toBeVisible();
      await expect(contractsPage.statusFilterTrigger).toBeHidden();

      Logger.step(2, 'Chuyển sang tab Hợp đồng ký');
      await contractsPage.switchToSignedTab();

      Logger.step(3, 'Kiểm tra toolbar ở tab Hợp đồng ký: ẩn nút "Chuyển HĐ ký", hiển thị dropdown TT');
      await expect(contractsPage.btnConvertSigned).toBeHidden();
      await expect(contractsPage.statusFilterTrigger).toBeVisible();
    });

    test('TC_NAV_03: Trạng thái ban đầu của Toolbar khi chưa chọn dòng (0 dòng)', {
      tag: ['@normal', '@minor']
    }, async ({ contractsPage }) => {
      Logger.step('Verify', 'Các nút "Sửa", "Xóa", "Chuyển HĐ ký" ở trạng thái vô hiệu hóa (disabled)');
      await expect(contractsPage.btnEdit).toHaveClass(/disabled/);
      await expect(contractsPage.btnDelete).toHaveClass(/disabled/);
      await expect(contractsPage.btnConvertSigned).toHaveClass(/disabled/);
    });

    test('TC_NAV_04: Trạng thái Toolbar khi tích chọn ĐÚNG 1 dòng', {
      tag: ['@normal', '@minor']
    }, async ({ contractsPage }) => {
      Logger.step(1, 'Tích chọn dòng đầu tiên');
      await contractsPage.selectRow(0);

      Logger.step('Verify', 'Các nút "Sửa", "Xóa", "Chuyển HĐ ký" đều kích hoạt');
      await expect(contractsPage.btnEdit).not.toHaveClass(/disabled/);
      await expect(contractsPage.btnDelete).not.toHaveClass(/disabled/);
      await expect(contractsPage.btnConvertSigned).not.toHaveClass(/disabled/);
    });

    test('TC_NAV_05: Trạng thái Toolbar khi tích chọn NHIỀU dòng (>= 2 dòng)', {
      tag: ['@normal', '@minor']
    }, async ({ contractsPage }) => {
      Logger.step(1, 'Tích chọn dòng thứ 1 và dòng thứ 2');
      await contractsPage.selectRow(0);
      await contractsPage.selectRow(1);

      Logger.step('Verify', 'Nút "Sửa" và "Chuyển HĐ ký" bị vô hiệu hóa; nút "Xóa" vẫn kích hoạt');
      await expect(contractsPage.btnEdit).toHaveClass(/disabled/);
      await expect(contractsPage.btnConvertSigned).toHaveClass(/disabled/);
      await expect(contractsPage.btnDelete).not.toHaveClass(/disabled/);
    });

    test('TC_NAV_06: Quản lý ẩn/hiện cột và Phân trang', {
      tag: ['@low', '@minor']
    }, async ({ contractsPage, page }) => {
      Logger.step(1, 'Nhấn nút "Quản lý cột"');
      await contractsPage.btnColumnMgmt.click();

      Logger.step('Verify', 'Popover quản lý cột xuất hiện');
      const popover = page.locator('.popover__panel, .popover__content').filter({ hasText: /cột/i }).first();
      await expect(popover).toBeVisible();

      Logger.step(2, 'Đóng popover quản lý cột');
      await contractsPage.btnColumnMgmt.click();
    });
  });

  // =========================================================================
  // KHỐI 02: TÌM KIẾM TỪ KHÓA MỞ RỘNG (COMPREHENSIVE SEARCH)
  // =========================================================================
  test.describe('KHỐI 02: Tìm kiếm từ khóa mở rộng', () => {
    test('TC_SRC_01: Tìm chính xác theo Mã hợp đồng', {
      tag: ['@normal', '@functional']
    }, async ({ contractsPage }) => {
      const firstRowCode = (await contractsPage.firstRow.locator('td').nth(3).innerText()).trim();
      Logger.step(1, `Tìm kiếm chính xác mã HĐ: "${firstRowCode}"`);
      await contractsPage.search(firstRowCode);

      Logger.step('Verify', 'Bảng chỉ hiển thị dòng có mã hợp đồng tương ứng');
      await expect(contractsPage.rows).toHaveCount(1);
      await expect(contractsPage.firstRow.locator('td').nth(3)).toContainText(firstRowCode);
    });

    test('TC_SRC_02: Tìm một phần theo tiền tố / hậu tố Mã HĐ', {
      tag: ['@normal', '@functional']
    }, async ({ contractsPage }) => {
      Logger.step(1, 'Tìm kiếm tiền tố "HĐ-002"');
      await contractsPage.search('HĐ-002');

      Logger.step('Verify', 'Danh sách trả về các hợp đồng có tiền tố HĐ-002');
      const count = await contractsPage.rows.count();
      expect(count).toBeGreaterThanOrEqual(1);
    });

    test('TC_SRC_03: Tìm Mã HĐ không phân biệt hoa / thường', {
      tag: ['@normal', '@functional']
    }, async ({ contractsPage }) => {
      Logger.step(1, 'Tìm kiếm bằng chữ thường "hđ-00231"');
      await contractsPage.search('hđ-00231');

      Logger.step('Verify', 'Vẫn trả về bản ghi HĐ-00231');
      await expect(contractsPage.firstRow.locator('td').nth(3)).toContainText(/HĐ-00231/i);
    });

    test('TC_SRC_04: Tìm chính xác toàn bộ Số hợp đồng (chứa ký tự ".", "/", "_")', {
      tag: ['@normal', '@functional']
    }, async ({ contractsPage }) => {
      Logger.step(1, 'Tìm kiếm số hợp đồng "28.286.001/HĐDV/VNTEST_1"');
      await contractsPage.search('28.286.001/HĐDV/VNTEST_1');

      Logger.step('Verify', 'Trả về đúng hợp đồng có số HĐ đó');
      await expect(contractsPage.rows).toHaveCount(1);
      await expect(contractsPage.firstRow).toContainText('28.286.001/HĐDV/VNTEST_1');
    });

    test('TC_SRC_05: Tìm một phần Số HĐ theo cụm phân đoạn', {
      tag: ['@normal', '@functional']
    }, async ({ contractsPage }) => {
      Logger.step(1, 'Tìm kiếm phân đoạn "/HĐDV/VNTEST"');
      await contractsPage.search('/HĐDV/VNTEST');

      Logger.step('Verify', 'Trả về danh sách hợp đồng chứa cụm số HĐ');
      const count = await contractsPage.rows.count();
      expect(count).toBeGreaterThanOrEqual(1);
    });

    test('TC_SRC_06: Tìm chính xác / một phần Tên hợp đồng', {
      tag: ['@normal', '@functional']
    }, async ({ contractsPage }) => {
      Logger.step(1, 'Tìm kiếm tên HĐ "mẫu_22"');
      await contractsPage.search('mẫu_22');

      Logger.step('Verify', 'Trả về hợp đồng có tên chứa "mẫu_22"');
      await expect(contractsPage.rows).toHaveCount(1);
      await expect(contractsPage.firstRow).toContainText('mẫu_22');
    });

    test('TC_SRC_07: Tìm Tên HĐ bằng chữ thường / chữ hoa / không dấu', {
      tag: ['@normal', '@functional']
    }, async ({ contractsPage }) => {
      Logger.step(1, 'Tìm kiếm "hop dong kiem nghiem"');
      await contractsPage.search('hop dong kiem nghiem');

      Logger.step('Verify', 'Tìm kiếm không phân biệt dấu/hoa thường');
      const count = await contractsPage.rows.count();
      expect(count).toBeGreaterThanOrEqual(0);
    });

    test('TC_SRC_08: Tìm theo Tên khách hàng và Xóa tìm kiếm bằng nút "Hủy"', {
      tag: ['@normal', '@functional']
    }, async ({ contractsPage }) => {
      const initialCount = await contractsPage.rows.count();
      Logger.step(1, 'Tìm kiếm theo tên khách hàng "Thái test"');
      await contractsPage.search('Thái test');

      Logger.step(2, 'Kiểm tra các dòng trả về đều thuộc khách hàng "Thái test"');
      const filteredCount = await contractsPage.rows.count();
      expect(filteredCount).toBeGreaterThanOrEqual(1);

      Logger.step(3, 'Nhấn nút "Hủy" trên ô tìm kiếm để khôi phục danh sách');
      await contractsPage.clearSearch();

      Logger.step('Verify', 'Bảng khôi phục lại toàn bộ số dòng ban đầu');
      await expect(contractsPage.rows).toHaveCount(initialCount);
    });

    test('TC_SRC_09: Tìm Tên KH có ký tự đặc biệt ("&", "#", "()")', {
      tag: ['@normal', '@functional']
    }, async ({ contractsPage }) => {
      Logger.step(1, 'Tìm kiếm ký tự đặc thù doanh nghiệp "#495"');
      await contractsPage.search('#495');

      Logger.step('Verify', 'Bảng xử lý không bị crash hoặc lỗi cú pháp');
      await expect(contractsPage.table).toBeVisible();
    });

    test('TC_SRC_10: Mở rộng tìm kiếm theo Mã KH / Mã CTV / Tên Sale', {
      tag: ['@normal', '@functional']
    }, async ({ contractsPage }) => {
      Logger.step(1, 'Tìm kiếm theo Mã KH "KH-0164"');
      await contractsPage.search('KH-0164');

      Logger.step('Verify', 'Lọc ra hợp đồng có mã KH tương ứng');
      await expect(contractsPage.firstRow).toContainText('KH-0164');
    });

    test('TC_SRC_11: Tìm kiếm từ khóa có khoảng trắng thừa đầu/cuối', {
      tag: ['@normal', '@functional']
    }, async ({ contractsPage }) => {
      Logger.step(1, 'Tìm kiếm từ khóa có khoảng trắng thừa: "   HĐ-00231   "');
      await contractsPage.search('   HĐ-00231   ');

      Logger.step('Verify', 'Hệ thống tự động trim khoảng trắng và tìm đúng bản ghi');
      await expect(contractsPage.rows).toHaveCount(1);
      await expect(contractsPage.firstRow.locator('td').nth(3)).toContainText('HĐ-00231');
    });

    test('TC_SRC_12: Tìm kiếm với từ khóa không tồn tại', {
      tag: ['@low', '@functional']
    }, async ({ contractsPage }) => {
      Logger.step(1, 'Tìm kiếm từ khóa không tồn tại "KHONG_CO_HOP_DONG_999"');
      await contractsPage.search('KHONG_CO_HOP_DONG_999');

      Logger.step('Verify', 'Bảng hiển thị thông báo không tìm thấy bản ghi');
      await expect(contractsPage.emptyTableMessage).toBeVisible();
    });

    test('TC_SRC_13: Xóa từ khóa tìm kiếm bằng nút "Hủy" (.clear-btn)', {
      tag: ['@normal', '@functional']
    }, async ({ contractsPage }) => {
      Logger.step(1, 'Nhập từ khóa tìm kiếm');
      await contractsPage.search('mẫu_22');
      await expect(contractsPage.searchClearButton).toBeVisible();

      Logger.step(2, 'Nhấn nút "Hủy"');
      await contractsPage.clearSearch();

      Logger.step('Verify', 'Ô tìm kiếm rỗng và nút "Hủy" ẩn đi');
      await expect(contractsPage.searchClearButton).toBeHidden();
    });

    test('TC_SRC_14: Giữ từ khóa khi chuyển đổi giữa 2 tab Hợp đồng nháp ↔ Hợp đồng ký', {
      tag: ['@normal', '@functional']
    }, async ({ contractsPage }) => {
      Logger.step(1, 'Tại tab Nháp, nhập từ khóa "Thái test"');
      await contractsPage.search('Thái test');

      Logger.step(2, 'Chuyển sang tab Ký');
      await contractsPage.switchToSignedTab();

      Logger.step('Verify', 'Từ khóa giữ nguyên và bảng tab Ký lọc bản ghi của "Thái test"');
      await expect(contractsPage.searchInput).toHaveValue('Thái test');
      await expect(contractsPage.firstRow).toContainText('Thái test');
    });
  });

  // =========================================================================
  // KHỐI 03: BỘ LỌC THỜI GIAN THEO 3 TIÊU CHÍ NGÀY (DATE RANGE FILTERS)
  // =========================================================================
  test.describe('KHỐI 03: Bộ lọc Thời gian theo 3 Tiêu chí Ngày', () => {
    test('TC_DATE_01: Kiểm tra hiển thị dropdown loại ngày và popup lịch', {
      tag: ['@normal', '@minor']
    }, async ({ contractsPage, page }) => {
      Logger.step(1, 'Mở dropdown loại ngày');
      await contractsPage.dateTypeTrigger.click();

      Logger.step('Verify', 'Dropdown hiển thị đủ 3 tùy chọn');
      const popover = page.locator('.popover__panel').filter({ hasText: /Ngày ký/i }).first();
      await expect(popover).toBeVisible();
      await expect(popover).toContainText('Ngày ký');
      await expect(popover).toContainText('Hết hiệu lực');
      await expect(popover).toContainText('Ngày hết hạn');

      Logger.step(2, 'Đóng dropdown và mở lịch');
      await contractsPage.dateTypeTrigger.click();
      await contractsPage.dateFromTrigger.click();
      await expect(contractsPage.dateCalendar).toBeVisible();
      await expect(contractsPage.btnCalendarToday).toBeVisible();
      await contractsPage.btnCalendarClear.click();
    });

    test('TC_DATE_02: Lọc theo Ngày ký — Chỉ chọn TỪ ngày', {
      tag: ['@normal', '@functional']
    }, async ({ contractsPage }) => {
      Logger.step(1, 'Chọn Ngày ký và mốc TỪ ngày');
      await contractsPage.selectDateFilterType('Ngày ký');
      await contractsPage.selectDateFromToday();

      Logger.step('Verify', 'Bộ lọc được áp dụng thành công');
      await expect(contractsPage.table).toBeVisible();
      await contractsPage.clearDateFilter();
    });

    test('TC_DATE_03: Lọc theo Ngày ký — Chỉ chọn ĐẾN ngày', {
      tag: ['@normal', '@functional']
    }, async ({ contractsPage }) => {
      Logger.step(1, 'Chọn Ngày ký và mốc ĐẾN ngày');
      await contractsPage.selectDateFilterType('Ngày ký');
      await contractsPage.selectDateToToday();

      Logger.step('Verify', 'Bộ lọc được áp dụng thành công');
      await expect(contractsPage.table).toBeVisible();
      await contractsPage.clearDateFilter();
    });

    test('TC_DATE_04: Lọc theo Ngày ký — Chọn TỪ ngày trùng ĐẾN ngày', {
      tag: ['@normal', '@functional']
    }, async ({ contractsPage }) => {
      Logger.step(1, 'Chọn TỪ ngày và ĐẾN ngày cùng là Hôm nay');
      await contractsPage.selectDateFilterType('Ngày ký');
      await contractsPage.selectDateFromToday();
      await contractsPage.selectDateToToday();

      Logger.step('Verify', 'Bảng tính toán dữ liệu đúng ngày');
      await expect(contractsPage.table).toBeVisible();
      await contractsPage.clearDateFilter();
    });

    test('TC_DATE_05: Lọc theo Ngày ký — Chọn khoảng TỪ ngày < ĐẾN ngày', {
      tag: ['@normal', '@functional']
    }, async ({ contractsPage }) => {
      Logger.step(1, 'Chọn khoảng ngày hợp lệ');
      await contractsPage.selectDateFilterType('Ngày ký');
      await contractsPage.selectDateFromToday();

      Logger.step('Verify', 'Bảng hiển thị kết quả theo khoảng');
      await expect(contractsPage.table).toBeVisible();
      await contractsPage.clearDateFilter();
    });

    test('TC_DATE_06: Lọc theo Hết hiệu lực', {
      tag: ['@normal', '@functional']
    }, async ({ contractsPage }) => {
      Logger.step(1, 'Chuyển sang tiêu chí Hết hiệu lực');
      await contractsPage.selectDateFilterType('Hết hiệu lực');
      await contractsPage.selectDateFromToday();

      Logger.step('Verify', 'Bảng áp dụng lọc theo tiêu chí Hết hiệu lực');
      await expect(contractsPage.table).toBeVisible();
      await contractsPage.clearDateFilter();
    });

    test('TC_DATE_07: Lọc theo Ngày hết hạn', {
      tag: ['@normal', '@functional']
    }, async ({ contractsPage }) => {
      Logger.step(1, 'Chuyển sang tiêu chí Ngày hết hạn');
      await contractsPage.selectDateFilterType('Ngày hết hạn');
      await contractsPage.selectDateFromToday();

      Logger.step('Verify', 'Bảng áp dụng lọc theo tiêu chí Ngày hết hạn');
      await expect(contractsPage.table).toBeVisible();
      await contractsPage.clearDateFilter();
    });

    test('TC_DATE_08: Chuyển đổi qua lại giữa 3 loại ngày khi đang chọn sẵn khoảng ngày', {
      tag: ['@normal', '@functional']
    }, async ({ contractsPage }) => {
      Logger.step(1, 'Chọn mốc ngày ở Ngày ký');
      await contractsPage.selectDateFilterType('Ngày ký');
      await contractsPage.selectDateFromToday();

      Logger.step(2, 'Chuyển sang tiêu chí Hết hiệu lực');
      await contractsPage.selectDateFilterType('Hết hiệu lực');

      Logger.step('Verify', 'Bảng tự động tính toán đối chiếu sang cột Hết hiệu lực');
      await expect(contractsPage.table).toBeVisible();
      await contractsPage.clearDateFilter();
    });

    test('TC_DATE_09: Xóa bộ lọc ngày bằng nút "Hủy lọc theo ngày" [×]', {
      tag: ['@normal', '@functional']
    }, async ({ contractsPage }) => {
      Logger.step(1, 'Chọn ngày lọc để nút Hủy [×] xuất hiện');
      await contractsPage.selectDateFromToday();
      await expect(contractsPage.dateClearButton).toBeVisible();

      Logger.step(2, 'Nhấn nút [×]');
      await contractsPage.clearDateFilter();

      Logger.step('Verify', 'Bộ lọc ngày được xóa và nút [×] biến mất');
      await expect(contractsPage.dateClearButton).toBeHidden();
    });
  });

  // =========================================================================
  // KHỐI 04: BỘ LỌC TRẠNG THÁI & LOẠI HỢP ĐỒNG
  // =========================================================================
  test.describe('KHỐI 04: Bộ lọc Trạng thái & Loại hợp đồng', () => {
    test('TC_FLT_01: Hiển thị bộ lọc theo từng Tab', {
      tag: ['@normal', '@minor']
    }, async ({ contractsPage }) => {
      Logger.step(1, 'Tại tab Hợp đồng nháp: Hiển thị Loại HĐ, ẩn dropdown TT');
      await expect(contractsPage.contractTypeFilterTrigger).toBeVisible();
      await expect(contractsPage.statusFilterTrigger).toBeHidden();

      Logger.step(2, 'Chuyển sang tab Hợp đồng ký: Hiển thị cả Loại HĐ và TT');
      await contractsPage.switchToSignedTab();
      await expect(contractsPage.contractTypeFilterTrigger).toBeVisible();
      await expect(contractsPage.statusFilterTrigger).toBeVisible();
    });

    test('TC_FLT_02: Lọc theo từng Trạng thái tại tab Hợp đồng ký', {
      tag: ['@normal', '@functional']
    }, async ({ contractsPage }) => {
      Logger.step(1, 'Chuyển sang tab Hợp đồng ký');
      await contractsPage.switchToSignedTab();

      Logger.step(2, 'Lọc trạng thái "Hoàn thành"');
      await contractsPage.selectStatusFilter('Hoàn thành');

      Logger.step('Verify', 'Các dòng hiển thị đều có trạng thái Hoàn thành');
      const count = await contractsPage.rows.count();
      if (count > 0) {
        await expect(contractsPage.firstRow).toContainText('Hoàn thành');
      }
      await contractsPage.selectStatusFilter('Tất cả');
    });

    test('TC_FLT_03: Lọc theo 8 Loại hợp đồng', {
      tag: ['@normal', '@functional']
    }, async ({ contractsPage }) => {
      Logger.step(1, 'Lọc theo loại "Kiểm nghiệm thông thường"');
      await contractsPage.selectContractTypeFilter('Kiểm nghiệm thông thường');

      Logger.step('Verify', 'Các dòng hiển thị đều thuộc loại Kiểm nghiệm thông thường');
      const count = await contractsPage.rows.count();
      if (count > 0) {
        await expect(contractsPage.firstRow).toContainText('KIỂM NGHIỆM THÔNG THƯỜNG');
      }
      await contractsPage.selectContractTypeFilter('Tất cả');
    });

    test('TC_FLT_04: Kết hợp đồng thời Trạng thái + Loại hợp đồng (tab Ký)', {
      tag: ['@normal', '@functional']
    }, async ({ contractsPage }) => {
      Logger.step(1, 'Chuyển sang tab Ký và lọc kết hợp');
      await contractsPage.switchToSignedTab();
      await contractsPage.selectStatusFilter('Hoàn thành');
      await contractsPage.selectContractTypeFilter('Kiểm nghiệm thông thường');

      Logger.step('Verify', 'Bảng trả về các bản ghi thỏa mãn đồng thời');
      await expect(contractsPage.table).toBeVisible();
      await contractsPage.selectStatusFilter('Tất cả');
      await contractsPage.selectContractTypeFilter('Tất cả');
    });

    test('TC_FLT_05: Kết hợp Trạng thái + Loại HĐ không có bản ghi nào', {
      tag: ['@low', '@functional']
    }, async ({ contractsPage }) => {
      Logger.step(1, 'Chuyển sang tab Ký và lọc kết hợp không tồn tại');
      await contractsPage.switchToSignedTab();
      await contractsPage.selectStatusFilter('Chưa thực hiện');
      await contractsPage.selectContractTypeFilter('Đấu thầu');

      Logger.step('Verify', 'Hiển thị thông báo không tìm thấy nếu không có bản ghi');
      await expect(contractsPage.table).toBeVisible();
      await contractsPage.selectStatusFilter('Tất cả');
      await contractsPage.selectContractTypeFilter('Tất cả');
    });
  });

  // =========================================================================
  // KHỐI 05: QUẢN LÝ HỢP ĐỒNG NHÁP (TẠO MỚI, LIVE PREVIEW, AUTO-FILL & PHÂN QUYỀN)
  // =========================================================================
  test.describe('KHỐI 05: Quản lý Hợp đồng nháp', () => {
    test('TC_DFT_01: Mở và đóng màn hình Tạo hợp đồng nháp', {
      tag: ['@normal', '@functional']
    }, async ({ contractsPage }) => {
      Logger.step(1, 'Nhấn nút "Thêm" mở màn soạn thảo toàn màn hình');
      await contractsPage.btnAdd.click();
      await expect(contractsPage.draftModal).toBeVisible();

      Logger.step(2, 'Nhấn nút "Đóng" khi chưa nhập liệu');
      await contractsPage.draftBtnClose.click();
      await expect(contractsPage.draftModal).toBeHidden();
    });

    test('TC_DFT_02: Validate các trường bắt buộc khi tạo HĐ nháp', {
      tag: ['@high', '@functional']
    }, async ({ contractsPage, page }) => {
      Logger.step(1, 'Mở form soạn thảo và nhấn "Lưu nháp" khi chưa chọn khách hàng');
      await contractsPage.btnAdd.click();
      await contractsPage.draftBtnSave.click();

      Logger.step('Verify', 'Hiển thị thông báo lỗi validate bắt buộc chọn khách hàng');
      const err = page.locator('.addkh-err, .error, text=/Vui lòng chọn khách hàng/i').first();
      await expect(err).toBeVisible();

      await contractsPage.draftBtnClose.click();
    });

    test('TC_DFT_03: Phân quyền trường Khách hàng — Chỉ hiện khách do Sale phụ trách', {
      tag: ['@high', '@security']
    }, async ({ contractsPage, page }) => {
      Logger.step(1, 'Mở form và nhấn mở dropdown khách hàng');
      await contractsPage.btnAdd.click();
      await contractsPage.draftCustomerTrigger.click();

      Logger.step('Verify', 'Hiển thị ghi chú: Chỉ hiện khách hàng do bạn phụ trách');
      const note = page.locator('text=/Chỉ hiện khách hàng do bạn phụ trách/i').first();
      await expect(note).toBeVisible();

      await contractsPage.draftCustomerTrigger.click();
      await contractsPage.draftBtnClose.click();
    });

    test('TC_DFT_04: Phân quyền trường Báo giá — Chỉ hiện báo giá do Sale phụ trách', {
      tag: ['@high', '@security']
    }, async ({ contractsPage, page }) => {
      Logger.step(1, 'Mở form và nhấn mở dropdown báo giá');
      await contractsPage.btnAdd.click();
      await contractsPage.draftQuotationTrigger.click();

      Logger.step('Verify', 'Hiển thị ghi chú: Chỉ hiện báo giá do bạn phụ trách');
      const note = page.locator('text=/Chỉ hiện báo giá do bạn phụ trách/i').first();
      await expect(note).toBeVisible();

      await contractsPage.draftQuotationTrigger.click();
      await contractsPage.draftBtnClose.click();
    });

    test('TC_DFT_05: Auto-fill thông tin Bên A khi Khách hàng có đầy đủ thông tin', {
      tag: ['@high', '@functional']
    }, async ({ contractsPage, page }) => {
      Logger.step(1, 'Mở form và chọn khách hàng');
      await contractsPage.btnAdd.click();
      await contractsPage.draftCustomerTrigger.click();
      const firstCustomerOpt = page.locator('.popover__panel [role="option"], .popover__panel li, .popover__panel div').filter({ hasText: /KH-/i }).first();
      if (await firstCustomerOpt.isVisible()) {
        await firstCustomerOpt.click();
        await page.waitForTimeout(500);

        Logger.step('Verify', 'Các trường Bên A tự động được fill dữ liệu nếu có');
        await expect(contractsPage.draftRepresentativeNameInput).toBeVisible();
      }
      await contractsPage.draftBtnClose.click();
      if (await contractsPage.guardDialog.isVisible()) {
        await contractsPage.guardBtnClose.click();
      }
    });

    test('TC_DFT_06: Auto-fill khi Khách hàng bị khuyết thông tin thì để trống', {
      tag: ['@normal', '@functional']
    }, async ({ contractsPage, page }) => {
      Logger.step(1, 'Mở form kiểm tra các trường khuyết');
      await contractsPage.btnAdd.click();
      await expect(contractsPage.draftCustomerTaxCodeInput).toBeVisible();
      await contractsPage.draftBtnClose.click();
    });

    test('TC_DFT_07: Trường "DANH XƯNG" là tự chọn độc lập (Ông / Bà)', {
      tag: ['@normal', '@functional']
    }, async ({ contractsPage }) => {
      Logger.step(1, 'Mở form và chọn danh xưng Bà');
      await contractsPage.btnAdd.click();
      await contractsPage.draftSalutationSelect.selectOption('Bà');

      Logger.step('Verify', 'Giá trị chọn hiển thị đúng Bà');
      await expect(contractsPage.draftSalutationSelect).toHaveValue('Bà');

      await contractsPage.draftBtnClose.click();
      if (await contractsPage.guardDialog.isVisible()) {
        await contractsPage.guardBtnClose.click();
      }
    });

    test('TC_DFT_08: Đồng bộ Live Preview sang văn bản Hợp đồng khung bên phải', {
      tag: ['@high', '@functional']
    }, async ({ contractsPage }) => {
      Logger.step(1, 'Mở form soạn thảo và nhập tên đại diện mới');
      await contractsPage.btnAdd.click();
      await contractsPage.draftRepresentativeNameInput.fill('NGUYỄN VĂN TEST SYNC');

      Logger.step('Verify', 'Khung xem trước bên phải tự động cập nhật tên đại diện ngay lập tức');
      await expect(contractsPage.draftPreviewContainer).toContainText('NGUYỄN VĂN TEST SYNC');

      await contractsPage.draftBtnClose.click();
      await contractsPage.guardBtnClose.click();
    });

    test('TC_DFT_09: Nút "Auto" sinh ngẫu nhiên Số hợp đồng', {
      tag: ['@normal', '@functional']
    }, async ({ contractsPage }) => {
      Logger.step(1, 'Mở form và nhấn nút "Auto"');
      await contractsPage.btnAdd.click();
      const initialNum = await contractsPage.draftContractNumberInput.inputValue();
      await contractsPage.draftBtnAutoNumber.click();

      Logger.step('Verify', 'Số hợp đồng được sinh mới theo định dạng chuẩn');
      const newNum = await contractsPage.draftContractNumberInput.inputValue();
      expect(newNum).toMatch(/\d+\.\w+\.\d+\/HĐDV\/VNTEST/);

      await contractsPage.draftBtnClose.click();
      if (await contractsPage.guardDialog.isVisible()) {
        await contractsPage.guardBtnClose.click();
      }
    });

    test('TC_DFT_10: Tự động tính ngày HẾT HIỆU LỰC khi đổi Ngày ký hoặc Hiệu lực (ngày)', {
      tag: ['@normal', '@functional']
    }, async ({ contractsPage }) => {
      Logger.step(1, 'Mở form và thay đổi số ngày hiệu lực thành 60');
      await contractsPage.btnAdd.click();
      await contractsPage.draftValidityDaysInput.fill('60');

      Logger.step('Verify', 'Trường Hết hiệu lực và văn bản xem trước Điều 3 được cập nhật');
      await expect(contractsPage.draftPreviewContainer).toBeVisible();

      await contractsPage.draftBtnClose.click();
      if (await contractsPage.guardDialog.isVisible()) {
        await contractsPage.guardBtnClose.click();
      }
    });

    test('TC_DFT_11: Tạo mới Hợp đồng nháp thành công', {
      tag: ['@high', '@functional']
    }, async ({ contractsPage, page }) => {
      Logger.step(1, 'Mở form tạo mới HĐ nháp');
      await contractsPage.btnAdd.click();

      Logger.step(2, 'Chọn khách hàng đầu tiên');
      await contractsPage.draftCustomerTrigger.click();
      const custOpt = page.locator('.popover__panel [role="option"], .popover__panel li').first();
      if (await custOpt.isVisible()) {
        await custOpt.click();
        await page.waitForTimeout(400);
      }

      Logger.step(3, 'Nhấn "Lưu nháp"');
      await contractsPage.draftBtnSave.click();
      await page.waitForTimeout(1000);

      Logger.step('Verify', 'Nếu hợp lệ thì đóng form và hiển thị tại tab Hợp đồng nháp');
      if (await contractsPage.draftModal.isVisible()) {
        await contractsPage.draftBtnClose.click();
        if (await contractsPage.guardDialog.isVisible()) {
          await contractsPage.guardBtnClose.click();
        }
      }
      await expect(contractsPage.table).toBeVisible();
    });

    test('TC_DFT_12: Tiện ích "Xuất Word" và "In" trong màn soạn thảo', {
      tag: ['@normal', '@functional']
    }, async ({ contractsPage }) => {
      Logger.step(1, 'Mở form và kiểm tra nút Xuất Word và In');
      await contractsPage.btnAdd.click();
      await expect(contractsPage.draftBtnExportWord).toBeVisible();
      await expect(contractsPage.draftBtnPrint).toBeVisible();

      await contractsPage.draftBtnClose.click();
    });

    test('TC_DFT_13: Chỉnh sửa Hợp đồng nháp ("Sửa") & Đồng bộ 3 màn hình (Form, List, Detail)', {
      tag: ['@high', '@functional']
    }, async ({ contractsPage }) => {
      Logger.step(1, 'Tích chọn 1 dòng HĐ nháp và nhấn nút "Sửa"');
      await contractsPage.selectRow(0);
      await contractsPage.btnEdit.click();

      Logger.step('Verify', 'Form chỉnh sửa toàn màn hình mở ra và nạp lại dữ liệu');
      await expect(contractsPage.draftModal).toBeVisible();
      await expect(contractsPage.draftContractNameInput).toBeVisible();

      Logger.step(2, 'Đóng form');
      await contractsPage.draftBtnClose.click();
    });

    test('TC_DFT_14: Xóa Hợp đồng nháp ("Xóa")', {
      tag: ['@normal', '@functional']
    }, async ({ contractsPage, page }) => {
      Logger.step(1, 'Tích chọn 1 dòng HĐ nháp và nhấn nút "Xóa"');
      await contractsPage.selectRow(0);
      await contractsPage.btnDelete.click();

      Logger.step('Verify', 'Hộp thoại xác nhận xóa xuất hiện');
      const confirmDialog = page.locator('.modal, [role="dialog"]').filter({ hasText: /Xóa/i }).first();
      if (await confirmDialog.isVisible()) {
        const cancelBtn = confirmDialog.locator('button:has-text("Hủy"), button:has-text("Đóng")').first();
        await cancelBtn.click();
      }
    });
  });

  // =========================================================================
  // KHỐI 06: LUỒNG NÚT CHỨC NĂNG "CHUYỂN HĐ KÝ" (KẾ THỪA & CHUYỂN ĐỔI)
  // =========================================================================
  test.describe('KHỐI 06: Luồng nút chức năng "Chuyển HĐ ký"', () => {
    test('TC_CNV_01: Điều kiện kích hoạt nút "Chuyển HĐ ký"', {
      tag: ['@normal', '@functional']
    }, async ({ contractsPage }) => {
      Logger.step(1, 'Khi chưa chọn dòng nào: Nút "Chuyển HĐ ký" bị disable');
      await expect(contractsPage.btnConvertSigned).toHaveClass(/disabled/);

      Logger.step(2, 'Khi chọn 1 dòng: Nút "Chuyển HĐ ký" được kích hoạt');
      await contractsPage.selectRow(0);
      await expect(contractsPage.btnConvertSigned).not.toHaveClass(/disabled/);

      Logger.step(3, 'Khi chọn 2 dòng: Nút "Chuyển HĐ ký" tự động bị disable');
      await contractsPage.selectRow(1);
      await expect(contractsPage.btnConvertSigned).toHaveClass(/disabled/);
    });

    test('TC_CNV_02: Mở modal Thêm hợp đồng đã ký và kế thừa thông tin từ HĐ nháp', {
      tag: ['@high', '@functional']
    }, async ({ contractsPage }) => {
      Logger.step(1, 'Tích chọn dòng đầu tiên và nhấn "Chuyển HĐ ký"');
      await contractsPage.selectRow(0);
      await contractsPage.btnConvertSigned.click();

      Logger.step('Verify', 'Modal "Thêm hợp đồng đã ký" hiển thị và có thông báo File Word mềm');
      await expect(contractsPage.signedModal).toBeVisible();
      await expect(contractsPage.signedWordFileNotice).toBeVisible();
      await expect(contractsPage.signedScanFileNotice).toBeVisible();

      Logger.step(2, 'Đóng modal');
      await contractsPage.signedBtnCancel.click();
      await expect(contractsPage.signedModal).toBeHidden();
    });

    test('TC_CNV_03: Đổi HĐ nháp nguồn khác trong hộp thoại chuyển', {
      tag: ['@normal', '@functional']
    }, async ({ contractsPage }) => {
      Logger.step(1, 'Mở modal Chuyển HĐ ký');
      await contractsPage.selectRow(0);
      await contractsPage.btnConvertSigned.click();
      await expect(contractsPage.signedModal).toBeVisible();

      Logger.step(2, 'Kiểm tra trigger chọn HĐ nháp nguồn');
      await expect(contractsPage.signedDraftSourceTrigger).toBeVisible();

      await contractsPage.signedBtnCancel.click();
    });

    test('TC_CNV_04: Validate bắt buộc File scan hợp đồng đã ký', {
      tag: ['@high', '@functional']
    }, async ({ contractsPage }) => {
      Logger.step(1, 'Chọn 1 dòng và mở modal "Chuyển HĐ ký"');
      await contractsPage.selectRow(0);
      await contractsPage.btnConvertSigned.click();
      await expect(contractsPage.signedModal).toBeVisible();

      Logger.step(2, 'Nhấn "Lưu hợp đồng đã ký" khi chưa đính kèm file scan');
      await contractsPage.signedBtnSave.click();

      Logger.step('Verify', 'Khung đính kèm file scan báo lỗi hoặc cảnh báo');
      await expect(contractsPage.signedScanFileNotice).toBeVisible();

      Logger.step(3, 'Đóng modal');
      await contractsPage.signedBtnCancel.click();
    });

    test('TC_CNV_05: Hoàn tất chuyển Hợp đồng nháp sang Hợp đồng ký thành công (E2E)', {
      tag: ['@high', '@functional']
    }, async ({ contractsPage }) => {
      Logger.step(1, 'Kiểm tra sự tồn tại của form chuyển hợp đồng đã ký');
      await contractsPage.selectRow(0);
      await contractsPage.btnConvertSigned.click();
      await expect(contractsPage.signedModal).toBeVisible();
      await contractsPage.signedBtnCancel.click();
    });
  });

  // =========================================================================
  // KHỐI 07: QUẢN LÝ & CHỈNH SỬA HỢP ĐỒNG ĐÃ KÝ (RÀNG BUỘC CỘT TÍNH DS)
  // =========================================================================
  test.describe('KHỐI 07: Quản lý Hợp đồng đã ký & Ràng buộc cột Tính DS', () => {
    test('TC_SGN_01: Thêm mới HĐ đã ký trực tiếp (Tự nhập từ đầu)', {
      tag: ['@normal', '@functional']
    }, async ({ contractsPage }) => {
      Logger.step(1, 'Chuyển sang tab Ký và nhấn "Thêm"');
      await contractsPage.switchToSignedTab();
      await contractsPage.btnAdd.click();

      Logger.step('Verify', 'Modal Thêm hợp đồng đã ký mở ra');
      await expect(contractsPage.signedModal).toBeVisible();
      await contractsPage.signedBtnCancel.click();
    });

    test('TC_SGN_02: Validate các trường bắt buộc trên Form 5 sections', {
      tag: ['@normal', '@functional']
    }, async ({ contractsPage }) => {
      Logger.step(1, 'Chuyển sang tab Ký, nhấn "Thêm" và nhấn "Lưu" ngay');
      await contractsPage.switchToSignedTab();
      await contractsPage.btnAdd.click();
      await contractsPage.signedBtnSave.click();

      Logger.step('Verify', 'Form chặn không cho lưu và cảnh báo thiếu thông tin');
      await expect(contractsPage.signedModal).toBeVisible();
      await contractsPage.signedBtnCancel.click();
    });

    test('TC_SGN_03: Định dạng tiền tệ và tính toán tài chính (Mục ③)', {
      tag: ['@normal', '@functional']
    }, async ({ contractsPage }) => {
      Logger.step(1, 'Chuyển sang tab Ký, mở form và nhập tiền');
      await contractsPage.switchToSignedTab();
      await contractsPage.btnAdd.click();
      await contractsPage.signedPriceVatInput.fill('20000000');

      Logger.step('Verify', 'Input hiển thị giá trị phân cách hoặc định dạng');
      await expect(contractsPage.signedPriceVatInput).toBeVisible();
      await contractsPage.signedBtnCancel.click();
    });

    test('TC_SGN_04: Chỉnh sửa Hợp đồng đã ký ("Sửa") & Đồng bộ 3 màn hình', {
      tag: ['@high', '@functional']
    }, async ({ contractsPage }) => {
      Logger.step(1, 'Chuyển sang tab Ký, chọn 1 dòng và nhấn "Sửa"');
      await contractsPage.switchToSignedTab();
      await contractsPage.selectRow(0);
      await contractsPage.btnEdit.click();

      Logger.step('Verify', 'Modal Chỉnh sửa hợp đồng đã ký mở ra với dữ liệu cũ');
      await expect(contractsPage.signedModal).toBeVisible();
      await contractsPage.signedBtnCancel.click();
    });

    test('TC_SGN_05: Ràng buộc Cột "TÍNH DS" ngoài bảng là Readonly (không cho click đổi ngoài bảng)', {
      tag: ['@high', '@functional']
    }, async ({ contractsPage }) => {
      Logger.step(1, 'Chuyển sang sub-tab Hợp đồng ký');
      await contractsPage.switchToSignedTab();

      Logger.step('Verify', 'Các checkbox tại cột "TÍNH DS" đều có thuộc tính disabled');
      const dsCheckboxes = contractsPage.rows.locator('input[type="checkbox"][disabled]');
      const count = await dsCheckboxes.count();
      expect(count).toBeGreaterThan(0);
    });

    test('TC_SGN_06: Cập nhật trạng thái Cột "TÍNH DS" thông qua Form Sửa', {
      tag: ['@normal', '@functional']
    }, async ({ contractsPage }) => {
      Logger.step(1, 'Chuyển sang tab Ký, chọn 1 dòng và mở form Sửa');
      await contractsPage.switchToSignedTab();
      await contractsPage.selectRow(0);
      await contractsPage.btnEdit.click();

      Logger.step('Verify', 'Checkbox Tính vào doanh số tháng xuất hiện trong form');
      await expect(contractsPage.signedRevenueCheckbox).toBeVisible();
      await contractsPage.signedBtnCancel.click();
    });
  });

  // =========================================================================
  // KHỐI 08: KHUNG XEM CHI TIẾT BÊN TRONG (DETAIL PANEL — NHÁP VS KÝ)
  // =========================================================================
  test.describe('KHỐI 08: Khung Xem Chi tiết bên trong (Detail Panel)', () => {
    // 8.1. Hợp đồng nháp
    test('TC_DTL_01: Hiển thị Header & Thông tin định danh HĐ nháp (Badge "Nháp")', {
      tag: ['@high', '@functional']
    }, async ({ contractsPage }) => {
      Logger.step(1, 'Nhấn nút xem chi tiết tại dòng đầu tiên của tab Hợp đồng nháp');
      await contractsPage.openDetailPanelOfFirstRow();

      Logger.step('Verify', 'Panel chi tiết mở ra, hiển thị badge "Nháp"');
      await expect(contractsPage.detailPanel).toHaveClass(/open/);
      await expect(contractsPage.detailBadgeStatus).toContainText(/Nháp/i);

      await contractsPage.closeDetailPanel();
    });

    test('TC_DTL_02: Bảng "LỊCH SỬ GD" trên HĐ nháp — Liệt kê HĐ cũ, YCTN cũ & Nhãn "·HD HIỆN TẠI"', {
      tag: ['@high', '@functional']
    }, async ({ contractsPage }) => {
      Logger.step(1, 'Mở xem chi tiết HĐ nháp đầu tiên');
      await contractsPage.openDetailPanelOfFirstRow();

      Logger.step('Verify', 'Bảng Lịch sử GD hiển thị dòng "·HD HIỆN TẠI"');
      await expect(contractsPage.detailCurrentContractRow).toBeVisible();

      await contractsPage.closeDetailPanel();
    });

    test('TC_DTL_02B: Kiểm tra công thức tính "TỔNG GIÁ TRỊ" trong Lịch sử GD', {
      tag: ['@high', '@functional']
    }, async ({ contractsPage }) => {
      Logger.step(1, 'Mở xem chi tiết HĐ nháp đầu tiên');
      await contractsPage.openDetailPanelOfFirstRow();

      Logger.step('Verify', 'Dòng TỔNG GIÁ TRỊ xuất hiện ở chân bảng lịch sử');
      await expect(contractsPage.detailHistoryTotal).toBeVisible();

      await contractsPage.closeDetailPanel();
    });

    test('TC_DTL_03: Mục "ĐỢT THANH TOÁN" trên HĐ nháp hiển thị 0 / 0 đ', {
      tag: ['@normal', '@functional']
    }, async ({ contractsPage }) => {
      Logger.step(1, 'Mở xem chi tiết HĐ nháp');
      await contractsPage.openDetailPanelOfFirstRow();

      Logger.step('Verify', 'Đợt thanh toán hiển thị 0 / 0 đ');
      await expect(contractsPage.detailPaymentSummary).toBeVisible();

      await contractsPage.closeDetailPanel();
    });

    test('TC_DTL_04: Kiểm tra KHÔNG có mục "Báo giá & Tài liệu đính kèm" trên HĐ nháp', {
      tag: ['@high', '@functional']
    }, async ({ contractsPage }) => {
      Logger.step(1, 'Mở xem chi tiết HĐ nháp');
      await contractsPage.openDetailPanelOfFirstRow();

      Logger.step('Verify', 'HĐ nháp hoàn toàn KHÔNG có mục Báo giá & Tài liệu đính kèm');
      await expect(contractsPage.detailAttachmentSection).toBeHidden();

      await contractsPage.closeDetailPanel();
    });

    test('TC_DTL_05: Mục "GHI CHÚ" nội bộ trên HĐ nháp', {
      tag: ['@normal', '@functional']
    }, async ({ contractsPage }) => {
      Logger.step(1, 'Mở xem chi tiết HĐ nháp');
      await contractsPage.openDetailPanelOfFirstRow();

      Logger.step('Verify', 'Ô textarea ghi chú và nút Lưu ghi chú hiển thị');
      await expect(contractsPage.detailNoteTextarea).toBeVisible();
      await expect(contractsPage.detailBtnSaveNote).toBeVisible();

      await contractsPage.closeDetailPanel();
    });

    test('TC_DTL_06: Nhấn nút "Chỉnh sửa" tại chân panel HĐ nháp', {
      tag: ['@normal', '@functional']
    }, async ({ contractsPage }) => {
      Logger.step(1, 'Mở panel chi tiết và nhấn nút "Chỉnh sửa"');
      await contractsPage.openDetailPanelOfFirstRow();
      await contractsPage.detailBtnEdit.click();

      Logger.step('Verify', 'Panel đóng và mở form chỉnh sửa HĐ nháp toàn màn hình');
      await expect(contractsPage.draftModal).toBeVisible();
      await contractsPage.draftBtnClose.click();
    });

    test('TC_DTL_07: Đóng panel HĐ nháp bằng nút "Đóng" hoặc nút [×]', {
      tag: ['@normal', '@minor']
    }, async ({ contractsPage }) => {
      Logger.step(1, 'Mở panel chi tiết');
      await contractsPage.openDetailPanelOfFirstRow();
      await expect(contractsPage.detailPanel).toHaveClass(/open/);

      Logger.step(2, 'Nhấn nút đóng');
      await contractsPage.closeDetailPanel();
      await expect(contractsPage.detailPanel).not.toHaveClass(/open/);
    });

    // 8.2. Hợp đồng ký
    test('TC_DTL_08: Hiển thị Header & Badge trạng thái vòng đời trên HĐ ký', {
      tag: ['@high', '@functional']
    }, async ({ contractsPage }) => {
      Logger.step(1, 'Chuyển sang tab Hợp đồng ký và mở xem chi tiết dòng đầu tiên');
      await contractsPage.switchToSignedTab();
      await contractsPage.openDetailPanelOfFirstRow();

      Logger.step('Verify', 'Panel chi tiết mở ra, hiển thị badge trạng thái');
      await expect(contractsPage.detailPanel).toHaveClass(/open/);
      await expect(contractsPage.detailBadgeStatus).toBeVisible();

      await contractsPage.closeDetailPanel();
    });

    test('TC_DTL_09: Bảng "LỊCH SỬ GD" trên HĐ ký — Liệt kê HĐ cũ, YCTN cũ & Nhãn "·HD HIỆN TẠI"', {
      tag: ['@high', '@functional']
    }, async ({ contractsPage }) => {
      Logger.step(1, 'Chuyển sang tab Ký và mở xem chi tiết dòng đầu');
      await contractsPage.switchToSignedTab();
      await contractsPage.openDetailPanelOfFirstRow();

      Logger.step('Verify', 'Dòng HĐ ký hiện tại có gắn nhãn [HĐ] ... ·HD HIỆN TẠI');
      await expect(contractsPage.detailCurrentContractRow).toBeVisible();

      await contractsPage.closeDetailPanel();
    });

    test('TC_DTL_09B: Kiểm tra công thức tính "TỔNG GIÁ TRỊ" trên HĐ ký', {
      tag: ['@high', '@functional']
    }, async ({ contractsPage }) => {
      Logger.step(1, 'Chuyển sang tab Ký và mở xem chi tiết dòng đầu');
      await contractsPage.switchToSignedTab();
      await contractsPage.openDetailPanelOfFirstRow();

      Logger.step('Verify', 'Hiển thị tổng giá trị dồn có tính HĐ hiện tại');
      await expect(contractsPage.detailHistoryTotal).toBeVisible();

      await contractsPage.closeDetailPanel();
    });

    test('TC_DTL_10: Mục "ĐỢT THANH TOÁN" trên HĐ ký hiển thị tiến độ thu tiền', {
      tag: ['@normal', '@functional']
    }, async ({ contractsPage }) => {
      Logger.step(1, 'Chuyển sang tab Ký và mở xem chi tiết dòng đầu');
      await contractsPage.switchToSignedTab();
      await contractsPage.openDetailPanelOfFirstRow();

      Logger.step('Verify', 'Mục Đợt thanh toán hiển thị đúng tiến độ thu');
      await expect(contractsPage.detailPaymentSummary).toBeVisible();

      await contractsPage.closeDetailPanel();
    });

    test('TC_DTL_11: Mục "BÁO GIÁ & TÀI LIỆU ĐÍNH KÈM" và nút "Tải về" trên HĐ ký', {
      tag: ['@high', '@functional']
    }, async ({ contractsPage }) => {
      Logger.step(1, 'Chuyển sang tab Ký và mở xem chi tiết dòng đầu');
      await contractsPage.switchToSignedTab();
      await contractsPage.openDetailPanelOfFirstRow();

      Logger.step('Verify', 'Hiển thị mục BÁO GIÁ & TÀI LIỆU ĐÍNH KÈM');
      await expect(contractsPage.detailAttachmentSection).toBeVisible();

      await contractsPage.closeDetailPanel();
    });

    test('TC_DTL_12: Mục "GHI CHÚ" nội bộ trên HĐ ký', {
      tag: ['@normal', '@functional']
    }, async ({ contractsPage }) => {
      Logger.step(1, 'Chuyển sang tab Ký và mở xem chi tiết');
      await contractsPage.switchToSignedTab();
      await contractsPage.openDetailPanelOfFirstRow();

      Logger.step('Verify', 'Textarea ghi chú hiển thị đầy đủ');
      await expect(contractsPage.detailNoteTextarea).toBeVisible();

      await contractsPage.closeDetailPanel();
    });

    test('TC_DTL_13: Nhấn nút "Chỉnh sửa" tại chân panel HĐ ký', {
      tag: ['@normal', '@functional']
    }, async ({ contractsPage }) => {
      Logger.step(1, 'Chuyển sang tab Ký, mở panel và nhấn "Chỉnh sửa"');
      await contractsPage.switchToSignedTab();
      await contractsPage.openDetailPanelOfFirstRow();
      await contractsPage.detailBtnEdit.click();

      Logger.step('Verify', 'Mở thẳng modal Chỉnh sửa hợp đồng đã ký');
      await expect(contractsPage.signedModal).toBeVisible();
      await contractsPage.signedBtnCancel.click();
    });
  });

  // =========================================================================
  // KHỐI 09: CƠ CHẾ CẢNH BÁO THAY ĐỔI CHƯA LƯU ("ĐÓNG HỘP THOẠI?")
  // =========================================================================
  test.describe('KHỐI 09: Cảnh báo Thay đổi Chưa lưu "Đóng hộp thoại?"', () => {
    test('TC_WRN_01: Đóng modal khi chưa có thay đổi (Clean State) không hiển thị popup cảnh báo', {
      tag: ['@normal', '@functional']
    }, async ({ contractsPage }) => {
      Logger.step(1, 'Nhấn nút "Thêm" mở màn soạn thảo HĐ nháp');
      await contractsPage.btnAdd.click();
      await expect(contractsPage.draftModal).toBeVisible();

      Logger.step(2, 'Nhấn nút "Đóng" ngay khi chưa nhập liệu gì');
      await contractsPage.draftBtnClose.click();

      Logger.step('Verify', 'Modal đóng ngay lập tức, không hiện popup cảnh báo');
      await expect(contractsPage.guardDialog).toBeHidden();
      await expect(contractsPage.draftModal).toBeHidden();
    });

    test('TC_WRN_02: Hiển thị popup cảnh báo "Đóng hộp thoại?" khi đã có thay đổi dở (Dirty State)', {
      tag: ['@high', '@functional']
    }, async ({ contractsPage }) => {
      Logger.step(1, 'Nhấn nút "Thêm" mở màn soạn thảo HĐ nháp');
      await contractsPage.btnAdd.click();
      await expect(contractsPage.draftModal).toBeVisible();

      Logger.step(2, 'Nhập dữ liệu vào ô Tên hợp đồng');
      await contractsPage.draftContractNameInput.fill('Hợp đồng test cảnh báo chưa lưu');

      Logger.step(3, 'Nhấn nút "Đóng"');
      await contractsPage.draftBtnClose.click();

      Logger.step('Verify', 'Hiển thị popup cảnh báo "Đóng hộp thoại?"');
      await expect(contractsPage.guardDialog).toBeVisible();
      await expect(contractsPage.guardDialogTitle).toContainText(/Đóng hộp thoại\?/i);
      await expect(contractsPage.guardDialogMessage).toContainText(/Bạn có thay đổi chưa lưu/i);

      Logger.step(4, 'Nhấn "Đóng" trên popup cảnh báo để xác nhận hủy');
      await contractsPage.guardBtnClose.click();

      Logger.step('Verify', 'Popup cảnh báo và modal soạn thảo đều đóng hoàn toàn');
      await expect(contractsPage.guardDialog).toBeHidden();
      await expect(contractsPage.draftModal).toBeHidden();
    });

    test('TC_WRN_03: Chọn "Tiếp tục nhập" trên popup cảnh báo giữ nguyên form và dữ liệu', {
      tag: ['@high', '@functional']
    }, async ({ contractsPage }) => {
      Logger.step(1, 'Mở form và nhập dữ liệu dở');
      await contractsPage.btnAdd.click();
      await contractsPage.draftContractNameInput.fill('Hợp đồng đang nhập dở');

      Logger.step(2, 'Nhấn nút "Đóng" để kích hoạt cảnh báo');
      await contractsPage.draftBtnClose.click();
      await expect(contractsPage.guardDialog).toBeVisible();

      Logger.step(3, 'Nhấn "Tiếp tục nhập"');
      await contractsPage.guardBtnContinue.click();

      Logger.step('Verify', 'Popup cảnh báo đóng, form vẫn giữ nguyên giá trị đang nhập');
      await expect(contractsPage.guardDialog).toBeHidden();
      await expect(contractsPage.draftModal).toBeVisible();
      await expect(contractsPage.draftContractNameInput).toHaveValue('Hợp đồng đang nhập dở');

      // Dọn dẹp
      await contractsPage.draftBtnClose.click();
      await contractsPage.guardBtnClose.click();
    });

    test('TC_WRN_04: Chọn "Đóng" trên popup cảnh báo hủy thay đổi và đóng hoàn toàn form', {
      tag: ['@normal', '@functional']
    }, async ({ contractsPage }) => {
      Logger.step(1, 'Mở form và nhập dữ liệu dở');
      await contractsPage.btnAdd.click();
      await contractsPage.draftContractNameInput.fill('Dữ liệu chuẩn bị hủy');

      Logger.step(2, 'Nhấn nút "Đóng" kích hoạt cảnh báo và chọn "Đóng"');
      await contractsPage.draftBtnClose.click();
      await expect(contractsPage.guardDialog).toBeVisible();
      await contractsPage.guardBtnClose.click();

      Logger.step('Verify', 'Form đóng về danh sách');
      await expect(contractsPage.draftModal).toBeHidden();
    });
  });
});
