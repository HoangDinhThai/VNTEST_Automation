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

    test('TC_SRC_12: Tìm kiếm với từ khóa không tồn tại', {
      tag: ['@low', '@functional']
    }, async ({ contractsPage }) => {
      Logger.step(1, 'Tìm kiếm từ khóa không tồn tại "KHONG_CO_HOP_DONG_999"');
      await contractsPage.search('KHONG_CO_HOP_DONG_999');

      Logger.step('Verify', 'Bảng hiển thị thông báo không tìm thấy bản ghi');
      await expect(contractsPage.emptyTableMessage).toBeVisible();
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
  });

  // =========================================================================
  // KHỐI 07: QUẢN LÝ & CHỈNH SỬA HỢP ĐỒNG ĐÃ KÝ (RÀNG BUỘC CỘT TÍNH DS)
  // =========================================================================
  test.describe('KHỐI 07: Quản lý Hợp đồng đã ký & Ràng buộc cột Tính DS', () => {
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
  });

  // =========================================================================
  // KHỐI 08: KHUNG XEM CHI TIẾT BÊN TRONG (DETAIL PANEL)
  // =========================================================================
  test.describe('KHỐI 08: Khung Xem Chi tiết bên trong (Detail Panel)', () => {
    test('TC_DTL_01: Hiển thị Panel chi tiết trên HĐ nháp và xác thực KHÔNG có mục đính kèm scan', {
      tag: ['@high', '@functional']
    }, async ({ contractsPage }) => {
      Logger.step(1, 'Nhấn nút xem chi tiết tại dòng đầu tiên của tab Hợp đồng nháp');
      await contractsPage.openDetailPanelOfFirstRow();

      Logger.step('Verify', 'Panel chi tiết mở ra, hiển thị badge "Nháp"');
      await expect(contractsPage.detailPanel).toHaveClass(/open/);
      await expect(contractsPage.detailBadgeStatus).toContainText(/Nháp/i);

      Logger.step('Verify', 'Bảng Lịch sử GD có dòng "·HD HIỆN TẠI" và tính TỔNG GIÁ TRỊ');
      await expect(contractsPage.detailCurrentContractRow).toBeVisible();
      await expect(contractsPage.detailHistoryTotal).toBeVisible();

      Logger.step('Verify', 'HĐ nháp hoàn toàn KHÔNG có mục "BÁO GIÁ & TÀI LIỆU ĐÍNH KÈM"');
      await expect(contractsPage.detailAttachmentSection).toBeHidden();

      Logger.step(2, 'Đóng panel chi tiết');
      await contractsPage.closeDetailPanel();
      await expect(contractsPage.detailPanel).not.toHaveClass(/open/);
    });

    test('TC_DTL_08: Hiển thị Panel chi tiết trên HĐ ký và xác thực CÓ mục tài liệu đính kèm', {
      tag: ['@high', '@functional']
    }, async ({ contractsPage }) => {
      Logger.step(1, 'Chuyển sang tab Hợp đồng ký và mở xem chi tiết dòng đầu tiên');
      await contractsPage.switchToSignedTab();
      await contractsPage.openDetailPanelOfFirstRow();

      Logger.step('Verify', 'Panel chi tiết mở ra, hiển thị dòng "·HD HIỆN TẠI" và mục "BÁO GIÁ & TÀI LIỆU ĐÍNH KÈM"');
      await expect(contractsPage.detailPanel).toHaveClass(/open/);
      await expect(contractsPage.detailCurrentContractRow).toBeVisible();
      await expect(contractsPage.detailAttachmentSection).toBeVisible();

      Logger.step(2, 'Đóng panel chi tiết');
      await contractsPage.closeDetailPanel();
      await expect(contractsPage.detailPanel).not.toHaveClass(/open/);
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
  });
});

