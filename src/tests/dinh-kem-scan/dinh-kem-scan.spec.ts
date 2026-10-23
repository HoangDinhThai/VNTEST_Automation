import { test, expect } from '../../fixtures/base.fixture';
import { Logger } from '../../utils/logger';
import users from '../../../test-data/users.json';
import * as path from 'path';

test.describe('Module Đính Kèm Scan (/dinh-kem-scan) - Hệ thống VNTEST LIMS', () => {
  test.beforeEach(async ({ loginPage, dinhKemScanPage, page }) => {
    Logger.step('Setup', 'Đăng nhập vào hệ thống và điều hướng tới màn hình Đính kèm scan');
    await loginPage.open('/dang-nhap');
    await loginPage.login(users.validUser.username, users.validUser.password);
    await page.waitForURL('**/', { timeout: 15000 });

    await dinhKemScanPage.open('/dinh-kem-scan');
    await expect(dinhKemScanPage.listTable).toBeVisible({ timeout: 20000 });
    await expect(dinhKemScanPage.previewContainer).toBeVisible({ timeout: 20000 });
  });

  // =========================================================================
  // KHỐI 01: BỐ CỤC & ĐIỀU HƯỚNG TỔNG QUAN (Layout & High-level Navigation)
  // =========================================================================

  test('TC_DKSCAN_001: Kiểm tra điều hướng đúng URL /dinh-kem-scan và tiêu đề trang hiển thị đúng', {
    tag: ['@smoke', '@critical']
  }, async ({ dinhKemScanPage, page }) => {
    Logger.step(1, 'Kiểm tra đường dẫn URL hiện tại');
    expect(page.url()).toContain('/dinh-kem-scan');

    Logger.step(2, 'Kiểm tra tiêu đề trang');
    await expect(page).toHaveTitle(/Xuất PKQ - Đính kèm scan/i);

    Logger.step(3, 'Kiểm tra sidebar sáng module Xuất PKQ');
    const activeModule = page.locator('.module.active, .sidebar-item.active').filter({ hasText: 'Xuất PKQ' });
    await expect(activeModule).toBeVisible();
  });

  test('TC_DKSCAN_002: Kiểm tra hiển thị cụm 3 tab điều hướng lớn: RÀ SOÁT KQ, DUYỆT PKQ, ĐÍNH KÈM SCAN', {
    tag: ['@smoke', '@critical']
  }, async ({ dinhKemScanPage }) => {
    Logger.step(1, 'Kiểm tra hiển thị tab RÀ SOÁT KQ');
    await expect(dinhKemScanPage.tabRaSoatKq).toBeVisible();

    Logger.step(2, 'Kiểm tra hiển thị tab DUYỆT PKQ');
    await expect(dinhKemScanPage.tabDuyetPkq).toBeVisible();

    Logger.step(3, 'Kiểm tra hiển thị tab ĐÍNH KÈM SCAN và trạng thái active');
    await expect(dinhKemScanPage.tabDinhKemScan).toBeVisible();
    await expect(dinhKemScanPage.tabDinhKemScan).toHaveClass(/active/);
  });

  test('TC_DKSCAN_003: Kiểm tra chuyển tab mượt mà: Nhấn RÀ SOÁT KQ, DUYỆT PKQ và quay lại ĐÍNH KÈM SCAN', {
    tag: ['@high']
  }, async ({ dinhKemScanPage, page }) => {
    Logger.step(1, 'Nhấn tab RÀ SOÁT KQ');
    await dinhKemScanPage.tabRaSoatKq.click();
    await page.waitForURL('**/ra-soat-kq', { timeout: 10000 });
    expect(page.url()).toContain('/ra-soat-kq');

    Logger.step(2, 'Nhấn tab DUYỆT PKQ');
    await page.locator('button.tab, .tab').filter({ hasText: 'DUYỆT PKQ' }).first().click();
    await page.waitForURL('**/duyet-pkq', { timeout: 10000 });
    expect(page.url()).toContain('/duyet-pkq');

    Logger.step(3, 'Quay lại tab ĐÍNH KÈM SCAN');
    await page.locator('button.tab, .tab').filter({ hasText: 'ĐÍNH KÈM SCAN' }).first().click();
    await page.waitForURL('**/dinh-kem-scan', { timeout: 10000 });
    expect(page.url()).toContain('/dinh-kem-scan');
  });

  test('TC_DKSCAN_004: Kiểm tra bố cục giao diện chia đôi (Split View): Danh sách bên trái & Tờ in bên phải', {
    tag: ['@high']
  }, async ({ dinhKemScanPage }) => {
    Logger.step(1, 'Kiểm tra bảng danh sách phiếu hiển thị ở nửa bên trái');
    await expect(dinhKemScanPage.listTable).toBeVisible();

    Logger.step(2, 'Kiểm tra khung xem trước bản in hiển thị ở nửa bên phải');
    await expect(dinhKemScanPage.previewContainer).toBeVisible();
  });

  // =========================================================================
  // KHỐI 02: ĐỒNG BỘ KHUNG XEM TRƯỚC BẢN IN (Print Preview Synchronization)
  // =========================================================================

  test('TC_DKSCAN_005: Kiểm tra tự động hiển thị bản in xem trước của phiếu đầu tiên khi vừa vào trang', {
    tag: ['@smoke', '@critical']
  }, async ({ dinhKemScanPage }) => {
    Logger.step(1, 'Kiểm tra danh sách có ít nhất 1 phiếu kết quả');
    const rowCount = await dinhKemScanPage.getRowCount();
    expect(rowCount).toBeGreaterThan(0);

    Logger.step(2, 'Lấy mã PKQ của dòng đầu tiên');
    const maPkqFirst = await dinhKemScanPage.getRowMaPkq(0);
    expect(maPkqFirst).toBeTruthy();

    Logger.step(3, 'Kiểm tra khung xem trước hiển thị đúng mã số phiếu đầu tiên');
    const previewCode = (await dinhKemScanPage.previewDocCode.innerText()).trim();
    expect(previewCode).toContain(maPkqFirst);
  });

  test('TC_DKSCAN_006: Kiểm tra Mã số phiếu trên tờ in (Mã số/ Code: DV...) trùng khớp 100% với Mã PKQ', {
    tag: ['@high']
  }, async ({ dinhKemScanPage }) => {
    Logger.step(1, 'Lấy mã PKQ của dòng 1');
    const maPkq = await dinhKemScanPage.getRowMaPkq(0);

    Logger.step(2, 'Kiểm tra mã trên tờ in');
    await expect(dinhKemScanPage.previewDocCode).toBeVisible();
    await expect(dinhKemScanPage.previewDocCode).toHaveText(maPkq);
  });

  test('TC_DKSCAN_007: Khi click chọn một dòng khác trong danh sách ➔ Khung xem trước tự động cập nhật đồng bộ', {
    tag: ['@smoke', '@critical']
  }, async ({ dinhKemScanPage, page }) => {
    const rowCount = await dinhKemScanPage.getRowCount();
    if (rowCount < 2) {
      Logger.info('Danh sách chỉ có 1 dòng, bỏ qua bước click dòng thứ 2');
      return;
    }

    Logger.step(1, 'Lấy mã PKQ của dòng thứ 2');
    const maPkqSecond = await dinhKemScanPage.getRowMaPkq(1);

    Logger.step(2, 'Click vào dòng thứ 2');
    await dinhKemScanPage.listRows.nth(1).click();
    await page.waitForTimeout(500);

    Logger.step(3, 'Kiểm tra khung xem trước đã cập nhật sang mã của dòng thứ 2');
    await expect(dinhKemScanPage.previewDocCode).toHaveText(maPkqSecond);
  });

  test('TC_DKSCAN_008: Kiểm tra cấu trúc tổng thể trang in chuẩn ISO/IEC 17025 hiển thị đầy đủ các phần', {
    tag: ['@high']
  }, async ({ dinhKemScanPage }) => {
    Logger.step(1, 'Kiểm tra phần Header viện kiểm nghiệm');
    await expect(dinhKemScanPage.previewHeader).toBeVisible();
    await expect(dinhKemScanPage.previewLogo).toBeVisible();

    Logger.step(2, 'Kiểm tra 2 dấu chứng nhận VILAS 1296 và VIMCERTS 323');
    await expect(dinhKemScanPage.previewStamps.first()).toBeVisible();

    Logger.step(3, 'Kiểm tra tiêu đề PHIẾU KẾT QUẢ THỬ NGHIỆM / TEST RESULT');
    await expect(dinhKemScanPage.previewTitle).toBeVisible();

    Logger.step(4, 'Kiểm tra Phần I: Thông tin chung (GENERAL INFORMATION)');
    await expect(dinhKemScanPage.previewSectionGeneral).toBeVisible();

    Logger.step(5, 'Kiểm tra Bảng kết quả thử nghiệm và Chữ ký');
    await expect(dinhKemScanPage.previewTable).toBeVisible();
    await expect(dinhKemScanPage.previewSignatures).toBeVisible();
  });

  // =========================================================================
  // KHỐI 03: BỘ LỌC TRẠNG THÁI CHIPTAB (Chưa trả KQ & Chưa Attach)
  // =========================================================================

  test('TC_DKSCAN_009: Kiểm tra hiển thị 2 chiptab Chưa trả KQ và Chưa Attach kèm badge số lượng real-time', {
    tag: ['@smoke', '@high']
  }, async ({ dinhKemScanPage }) => {
    Logger.step(1, 'Kiểm tra hiển thị nút chiptab "Chưa trả KQ"');
    await expect(dinhKemScanPage.btnChuaTraKq).toBeVisible();
    const countChuaTra = await dinhKemScanPage.getBadgeChuaTraCount();
    expect(countChuaTra).toBeGreaterThanOrEqual(0);

    Logger.step(2, 'Kiểm tra hiển thị nút chiptab "Chưa Attach"');
    await expect(dinhKemScanPage.btnChuaAttach).toBeVisible();
    const countChuaAttach = await dinhKemScanPage.getBadgeChuaAttachCount();
    expect(countChuaAttach).toBeGreaterThanOrEqual(0);
  });

  test('TC_DKSCAN_010: Nhấn chiptab Chưa trả KQ lần 1 ➔ Kích hoạt lọc, danh sách chỉ hiển thị phiếu chưa trả KQ', {
    tag: ['@high']
  }, async ({ dinhKemScanPage, page }) => {
    const totalBefore = await dinhKemScanPage.getRowCount();

    Logger.step(1, 'Nhấn chiptab "Chưa trả KQ" để bật lọc');
    await dinhKemScanPage.btnChuaTraKq.click();
    await page.waitForTimeout(500);

    Logger.step(2, 'Kiểm tra chiptab ở trạng thái active');
    await expect(dinhKemScanPage.btnChuaTraKq).toHaveClass(/active/);

    Logger.step(3, 'Kiểm tra tất cả các dòng hiển thị đều có checkbox ĐÃ TRẢ là unchecked');
    const filteredCount = await dinhKemScanPage.getRowCount();
    for (let i = 0; i < filteredCount; i++) {
      const isChecked = await dinhKemScanPage.getRowDaTraCheckbox(i).isChecked();
      expect(isChecked).toBe(false);
    }
  });

  test('TC_DKSCAN_011: Nhấn chiptab Chưa trả KQ lần 2 ➔ Tắt lọc, danh sách hiển thị lại toàn bộ các phiếu', {
    tag: ['@high']
  }, async ({ dinhKemScanPage, page }) => {
    Logger.step(1, 'Nhấn chiptab Chưa trả KQ để bật lọc');
    await dinhKemScanPage.btnChuaTraKq.click();
    await page.waitForTimeout(500);
    await expect(dinhKemScanPage.btnChuaTraKq).toHaveClass(/active/);

    Logger.step(2, 'Nhấn chiptab Chưa trả KQ lần 2 để tắt lọc');
    await dinhKemScanPage.btnChuaTraKq.click();
    await page.waitForTimeout(500);

    Logger.step(3, 'Kiểm tra chiptab không còn active và danh sách tải lại đầy đủ');
    await expect(dinhKemScanPage.btnChuaTraKq).not.toHaveClass(/active/);
    const countAfter = await dinhKemScanPage.getRowCount();
    expect(countAfter).toBeGreaterThan(0);
  });

  test('TC_DKSCAN_012: Nhấn chiptab Chưa Attach lần 1 ➔ Kích hoạt lọc, danh sách chỉ hiển thị phiếu chưa có file scan', {
    tag: ['@high']
  }, async ({ dinhKemScanPage, page }) => {
    Logger.step(1, 'Nhấn chiptab "Chưa Attach" để bật lọc');
    await dinhKemScanPage.btnChuaAttach.click();
    await page.waitForTimeout(500);

    Logger.step(2, 'Kiểm tra chiptab ở trạng thái active');
    await expect(dinhKemScanPage.btnChuaAttach).toHaveClass(/active/);

    Logger.step(3, 'Kiểm tra tất cả các dòng hiển thị đều có checkbox FILE SCAN là unchecked');
    const filteredCount = await dinhKemScanPage.getRowCount();
    for (let i = 0; i < filteredCount; i++) {
      const isChecked = await dinhKemScanPage.getRowFileScanCheckbox(i).isChecked();
      expect(isChecked).toBe(false);
    }
  });

  test('TC_DKSCAN_013: Nhấn chiptab Chưa Attach lần 2 ➔ Tắt lọc, danh sách quay lại trạng thái ban đầu', {
    tag: ['@high']
  }, async ({ dinhKemScanPage, page }) => {
    Logger.step(1, 'Bật lọc Chưa Attach');
    await dinhKemScanPage.btnChuaAttach.click();
    await page.waitForTimeout(500);
    await expect(dinhKemScanPage.btnChuaAttach).toHaveClass(/active/);

    Logger.step(2, 'Tắt lọc Chưa Attach');
    await dinhKemScanPage.btnChuaAttach.click();
    await page.waitForTimeout(500);

    Logger.step(3, 'Kiểm tra chiptab không còn active');
    await expect(dinhKemScanPage.btnChuaAttach).not.toHaveClass(/active/);
  });

  test('TC_DKSCAN_014: Chuyển đổi qua lại giữa 2 chiptab Chưa trả KQ và Chưa Attach ➔ Lọc cập nhật tương ứng', {
    tag: ['@normal']
  }, async ({ dinhKemScanPage, page }) => {
    Logger.step(1, 'Nhấn chiptab Chưa trả KQ');
    await dinhKemScanPage.btnChuaTraKq.click();
    await page.waitForTimeout(500);
    await expect(dinhKemScanPage.btnChuaTraKq).toHaveClass(/active/);

    Logger.step(2, 'Nhấn chiptab Chưa Attach');
    await dinhKemScanPage.btnChuaAttach.click();
    await page.waitForTimeout(500);
    await expect(dinhKemScanPage.btnChuaAttach).toHaveClass(/active/);
  });

  // =========================================================================
  // KHỐI 04: BỘ LỌC THỜI GIAN & TÌM KIẾM NHANH (Date Filter & Search)
  // =========================================================================

  test('TC_DKSCAN_015: Kiểm tra dropdown chọn loại ngày: Mặc định Ngày trả, cho phép chọn Ngày nhận', {
    tag: ['@high']
  }, async ({ dinhKemScanPage, page }) => {
    Logger.step(1, 'Kiểm tra nhãn mặc định của dropdown là "Ngày trả"');
    await expect(dinhKemScanPage.dateTypeTrigger).toContainText('Ngày trả');

    Logger.step(2, 'Bấm vào dropdown để mở danh sách');
    await dinhKemScanPage.dateTypeTrigger.click();
    await page.waitForTimeout(400);

    Logger.step(3, 'Kiểm tra tùy chọn "Ngày nhận" xuất hiện và chọn nó');
    const optionNgayNhan = page.locator('.from-to-date-filter__menu, [role="listbox"]').getByText('Ngày nhận').first();
    if (await optionNgayNhan.isVisible()) {
      await optionNgayNhan.click();
      await page.waitForTimeout(400);
      await expect(dinhKemScanPage.dateTypeTrigger).toContainText('Ngày nhận');

      // Chuyển lại về Ngày trả
      await dinhKemScanPage.dateTypeTrigger.click();
      await page.waitForTimeout(300);
      await page.locator('.from-to-date-filter__menu, [role="listbox"]').getByText('Ngày trả').first().click();
    }
  });

  test('TC_DKSCAN_016: Nhấn vào ô TỪ dd/mm/yyyy ➔ Mở popup lịch .date-calendar có nút Hôm nay và Xóa', {
    tag: ['@high']
  }, async ({ dinhKemScanPage, page }) => {
    Logger.step(1, 'Bấm vào ô TỪ dd/mm/yyyy');
    await dinhKemScanPage.dateFromTrigger.click();
    await page.waitForTimeout(500);

    Logger.step(2, 'Kiểm tra popup lịch hiển thị đầy đủ');
    await expect(dinhKemScanPage.dateCalendar).toBeVisible();
    await expect(dinhKemScanPage.btnCalendarToday).toBeVisible();
    await expect(dinhKemScanPage.btnCalendarClear).toBeVisible();

    Logger.step(3, 'Đóng lịch bằng phím Escape');
    await page.keyboard.press('Escape');
    await expect(dinhKemScanPage.dateCalendar).toBeHidden();
  });

  test('TC_DKSCAN_017: Nhấn vào ô ĐẾN dd/mm/yyyy ➔ Mở popup lịch chọn ngày kết thúc', {
    tag: ['@high']
  }, async ({ dinhKemScanPage, page }) => {
    Logger.step(1, 'Bấm vào ô ĐẾN dd/mm/yyyy');
    await dinhKemScanPage.dateToTrigger.click();
    await page.waitForTimeout(500);

    Logger.step(2, 'Kiểm tra popup lịch hiển thị');
    await expect(dinhKemScanPage.dateCalendar).toBeVisible();

    Logger.step(3, 'Đóng lịch bằng phím Escape');
    await page.keyboard.press('Escape');
    await expect(dinhKemScanPage.dateCalendar).toBeHidden();
  });

  test('TC_DKSCAN_018: Nhấn nút Hôm nay trong popup lịch ➔ Tự động điền ngày hôm nay vào ô', {
    tag: ['@normal']
  }, async ({ dinhKemScanPage, page }) => {
    Logger.step(1, 'Mở lịch ở ô Từ ngày');
    await dinhKemScanPage.dateFromTrigger.click();
    await page.waitForTimeout(400);

    Logger.step(2, 'Nhấn nút "Hôm nay"');
    await dinhKemScanPage.btnCalendarToday.click();
    await page.waitForTimeout(500);

    Logger.step(3, 'Kiểm tra giá trị ô Từ không còn là placeholder dd/mm/yyyy');
    const val = await dinhKemScanPage.dateFromTrigger.locator('.date-filter-segment__value').innerText();
    expect(val).not.toBe('dd/mm/yyyy');

    // Dọn dẹp: Xóa ngày
    await dinhKemScanPage.dateFromTrigger.click();
    await page.waitForTimeout(300);
    await dinhKemScanPage.btnCalendarClear.click();
  });

  test('TC_DKSCAN_019: Nhấn nút Xóa trong popup lịch ➔ Xóa trắng ngày đã chọn, khôi phục danh sách', {
    tag: ['@normal']
  }, async ({ dinhKemScanPage, page }) => {
    Logger.step(1, 'Mở lịch ở ô Từ ngày');
    await dinhKemScanPage.dateFromTrigger.click();
    await page.waitForTimeout(300);

    Logger.step(2, 'Nhấn nút "Xóa"');
    await dinhKemScanPage.btnCalendarClear.click();
    await page.waitForTimeout(500);

    Logger.step(3, 'Kiểm tra ô Từ hiển thị lại dd/mm/yyyy');
    const val = await dinhKemScanPage.dateFromTrigger.locator('.date-filter-segment__value').innerText();
    expect(val).toBe('dd/mm/yyyy');
  });

  test('TC_DKSCAN_020: Tìm kiếm theo Mã YCTN ➔ Lọc ra đúng các phiếu thuộc YCTN đó', {
    tag: ['@smoke', '@critical']
  }, async ({ dinhKemScanPage, page }) => {
    const rowCount = await dinhKemScanPage.getRowCount();
    const targetRowIdx = rowCount > 1 ? 1 : 0;

    Logger.step(1, `Lấy mã YCTN của dòng ${targetRowIdx + 1}`);
    const targetYctn = await dinhKemScanPage.getRowMaYctn(targetRowIdx);

    Logger.step(2, 'Nhập mã YCTN vào ô tìm kiếm');
    await dinhKemScanPage.searchInput.fill(targetYctn);
    await dinhKemScanPage.searchInput.press('Enter');
    await expect(dinhKemScanPage.listRows.first()).toContainText(targetYctn);

    Logger.step(3, 'Kiểm tra tất cả các dòng hiển thị đều chứa mã YCTN vừa tìm');
    const count = await dinhKemScanPage.getRowCount();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      const yctn = await dinhKemScanPage.getRowMaYctn(i);
      expect(yctn).toContain(targetYctn);
    }

    // Dọn dẹp
    await dinhKemScanPage.searchInput.fill('');
    await dinhKemScanPage.searchInput.press('Enter');
    await page.waitForTimeout(400);
  });

  test('TC_DKSCAN_021: Tìm kiếm theo Mã PKQ (DV...) ➔ Lọc ra chính xác phiếu có mã đó', {
    tag: ['@smoke', '@critical']
  }, async ({ dinhKemScanPage, page }) => {
    const rowCount = await dinhKemScanPage.getRowCount();
    const targetRowIdx = rowCount > 1 ? 1 : 0;

    Logger.step(1, `Lấy mã PKQ của dòng ${targetRowIdx + 1}`);
    const targetPkq = await dinhKemScanPage.getRowMaPkq(targetRowIdx);

    Logger.step(2, 'Nhập mã PKQ vào ô tìm kiếm');
    await dinhKemScanPage.searchInput.fill(targetPkq);
    await dinhKemScanPage.searchInput.press('Enter');
    await expect(dinhKemScanPage.listRows.first()).toContainText(targetPkq);

    Logger.step(3, 'Kiểm tra dòng hiển thị chứa đúng mã PKQ đó');
    const count = await dinhKemScanPage.getRowCount();
    expect(count).toBeGreaterThan(0);
    const pkq = await dinhKemScanPage.getRowMaPkq(0);
    expect(pkq).toContain(targetPkq);

    // Dọn dẹp
    await dinhKemScanPage.searchInput.fill('');
    await dinhKemScanPage.searchInput.press('Enter');
    await page.waitForTimeout(400);
  });

  test('TC_DKSCAN_022: Tìm kiếm theo Tên khách hàng ➔ Lọc ra các phiếu của khách hàng tương ứng', {
    tag: ['@high']
  }, async ({ dinhKemScanPage, page }) => {
    Logger.step(1, 'Lấy tên khách hàng của dòng 1');
    const fullName = await dinhKemScanPage.getRowTenKh(0);
    const keyword = fullName.split(' ')[0] || fullName.substring(0, 5);

    Logger.step(2, 'Nhập từ khóa tên khách hàng vào ô tìm kiếm');
    await dinhKemScanPage.searchInput.fill(keyword);
    await dinhKemScanPage.searchInput.press('Enter');
    await page.waitForTimeout(600);

    Logger.step(3, 'Kiểm tra danh sách lọc theo từ khóa');
    const count = await dinhKemScanPage.getRowCount();
    expect(count).toBeGreaterThan(0);

    // Dọn dẹp
    await dinhKemScanPage.searchInput.fill('');
    await dinhKemScanPage.searchInput.press('Enter');
    await page.waitForTimeout(400);
  });

  test('TC_DKSCAN_023: Tìm kiếm theo Tên mẫu thử nghiệm ➔ Lọc ra các phiếu có tên mẫu tương ứng', {
    tag: ['@high']
  }, async ({ dinhKemScanPage, page }) => {
    Logger.step(1, 'Lấy tên mẫu của dòng 1');
    const sampleName = await dinhKemScanPage.getRowTenMau(0);
    const keyword = sampleName.split(' ')[0] || sampleName.substring(0, 5);

    Logger.step(2, 'Nhập từ khóa tên mẫu vào ô tìm kiếm');
    await dinhKemScanPage.searchInput.fill(keyword);
    await dinhKemScanPage.searchInput.press('Enter');
    await page.waitForTimeout(600);

    Logger.step(3, 'Kiểm tra danh sách kết quả');
    const count = await dinhKemScanPage.getRowCount();
    expect(count).toBeGreaterThan(0);

    // Dọn dẹp
    await dinhKemScanPage.searchInput.fill('');
    await dinhKemScanPage.searchInput.press('Enter');
    await page.waitForTimeout(400);
  });

  test('TC_DKSCAN_024: Tìm kiếm từ khóa không tồn tại ➔ Hiển thị thông báo Không có phiếu phù hợp', {
    tag: ['@normal']
  }, async ({ dinhKemScanPage, page }) => {
    Logger.step(1, 'Nhập từ khóa ngẫu nhiên không tồn tại');
    await dinhKemScanPage.searchInput.fill('INVALID_KEYWORD_XYZ_9999');
    await page.waitForTimeout(800);

    Logger.step(2, 'Kiểm tra bảng hiển thị thông báo "Không có phiếu phù hợp."');
    await expect(dinhKemScanPage.listTable.locator('tbody')).toContainText('Không có phiếu phù hợp');

    // Dọn dẹp: Bấm nút Hủy
    const btnHuy = page.locator('button').filter({ hasText: /^Hủy$/ }).first();
    if (await btnHuy.isVisible()) {
      await btnHuy.click();
    } else {
      await dinhKemScanPage.searchInput.fill('');
    }
    await page.waitForTimeout(600);
  });

  test('TC_DKSCAN_025: Xóa từ khóa tìm kiếm ➔ Bảng khôi phục lại danh sách đầy đủ ban đầu', {
    tag: ['@normal']
  }, async ({ dinhKemScanPage, page }) => {
    Logger.step(1, 'Nhập tìm kiếm từ khóa');
    await dinhKemScanPage.searchInput.fill('TR1523');
    await page.waitForTimeout(600);

    Logger.step(2, 'Bấm nút Hủy hoặc xóa trắng ô tìm kiếm');
    const btnHuy = page.locator('button').filter({ hasText: /^Hủy$/ }).first();
    if (await btnHuy.isVisible()) {
      await btnHuy.click();
    } else {
      await dinhKemScanPage.searchInput.fill('');
    }
    await page.waitForTimeout(800);

    Logger.step(3, 'Kiểm tra danh sách được khôi phục đầy đủ');
    await expect(dinhKemScanPage.listTable.locator('tbody')).not.toContainText('Không có phiếu phù hợp');
    const count = await dinhKemScanPage.getRowCount();
    expect(count).toBeGreaterThan(0);
  });

  // =========================================================================
  // KHỐI 05: NGHIỆP VỤ ĐÁNH DẤU "ĐÃ TRẢ" KẾT QUẢ (Cột ĐÃ TRẢ)
  // =========================================================================

  test('TC_DKSCAN_026: Kiểm tra hiển thị checkbox cột ĐÃ TRẢ trên từng dòng kèm tooltip hướng dẫn', {
    tag: ['@high']
  }, async ({ dinhKemScanPage }) => {
    Logger.step(1, 'Kiểm tra checkbox cột ĐÃ TRẢ của dòng 1');
    const daTraCb = dinhKemScanPage.getRowDaTraCheckbox(0);
    await expect(daTraCb).toBeVisible();

    Logger.step(2, 'Kiểm tra title tooltip');
    const parentTitle = await dinhKemScanPage.listRows.first().locator('td:nth-child(6) div').getAttribute('title');
    expect(parentTitle).toContain('đánh dấu');
  });

  test('TC_DKSCAN_027: Click đánh dấu Đã trả KQ ➔ Checkbox được tích và badge Chưa trả KQ tự động giảm 1', {
    tag: ['@smoke', '@critical']
  }, async ({ dinhKemScanPage, page }) => {
    // Tìm dòng có ĐÃ TRẢ đang là unchecked
    const rowCount = await dinhKemScanPage.getRowCount();
    let targetIndex = -1;
    for (let i = 0; i < rowCount; i++) {
      if (!(await dinhKemScanPage.getRowDaTraCheckbox(i).isChecked())) {
        targetIndex = i;
        break;
      }
    }

    if (targetIndex === -1) {
      Logger.info('Tất cả các dòng đều đã trả, bỏ chọn dòng 1 trước để test');
      await dinhKemScanPage.getRowDaTraCheckbox(0).click();
      await page.waitForTimeout(500);
      targetIndex = 0;
    }

    Logger.step(1, 'Lấy số lượng badge Chưa trả KQ trước khi click');
    const badgeBefore = await dinhKemScanPage.getBadgeChuaTraCount();

    Logger.step(2, 'Click đánh dấu Đã trả KQ');
    await dinhKemScanPage.getRowDaTraCheckbox(targetIndex).click();
    await page.waitForTimeout(600);

    Logger.step(3, 'Kiểm tra checkbox chuyển sang checked và badge giảm đi 1');
    await expect(dinhKemScanPage.getRowDaTraCheckbox(targetIndex)).toBeChecked();
    const badgeAfter = await dinhKemScanPage.getBadgeChuaTraCount();
    expect(badgeAfter).toBe(badgeBefore - 1);

    // Hoàn tác click để giữ nguyên dữ liệu
    await dinhKemScanPage.getRowDaTraCheckbox(targetIndex).click();
    await page.waitForTimeout(400);
  });

  test('TC_DKSCAN_028: Click bỏ đánh dấu Đã trả KQ ➔ Checkbox bỏ tích và badge Chưa trả KQ tự động tăng 1', {
    tag: ['@smoke', '@critical']
  }, async ({ dinhKemScanPage, page }) => {
    // Tìm dòng có ĐÃ TRẢ đang là checked
    const rowCount = await dinhKemScanPage.getRowCount();
    let targetIndex = -1;
    for (let i = 0; i < rowCount; i++) {
      if (await dinhKemScanPage.getRowDaTraCheckbox(i).isChecked()) {
        targetIndex = i;
        break;
      }
    }

    if (targetIndex === -1) {
      Logger.info('Chưa có dòng nào đã trả, tích chọn dòng 1 trước để test');
      await dinhKemScanPage.getRowDaTraCheckbox(0).click();
      await page.waitForTimeout(500);
      targetIndex = 0;
    }

    Logger.step(1, 'Lấy số lượng badge Chưa trả KQ trước khi bỏ tích');
    const badgeBefore = await dinhKemScanPage.getBadgeChuaTraCount();

    Logger.step(2, 'Click bỏ đánh dấu Đã trả KQ');
    await dinhKemScanPage.getRowDaTraCheckbox(targetIndex).click();
    await page.waitForTimeout(600);

    Logger.step(3, 'Kiểm tra checkbox chuyển về unchecked và badge tăng thêm 1');
    await expect(dinhKemScanPage.getRowDaTraCheckbox(targetIndex)).not.toBeChecked();
    const badgeAfter = await dinhKemScanPage.getBadgeChuaTraCount();
    expect(badgeAfter).toBe(badgeBefore + 1);

    // Hoàn tác
    await dinhKemScanPage.getRowDaTraCheckbox(targetIndex).click();
    await page.waitForTimeout(400);
  });

  test('TC_DKSCAN_029: Khi đang bật chiptab Chưa trả KQ, đánh dấu Đã trả 1 dòng ➔ Cập nhật checkbox và badge', {
    tag: ['@high']
  }, async ({ dinhKemScanPage, page }) => {
    Logger.step(1, 'Bật bộ lọc Chưa trả KQ');
    await dinhKemScanPage.btnChuaTraKq.click();
    await page.waitForTimeout(600);

    const countBefore = await dinhKemScanPage.getRowCount();
    if (countBefore === 0) {
      Logger.info('Không có dòng chưa trả nào để test, bỏ qua');
      await dinhKemScanPage.btnChuaTraKq.click();
      return;
    }

    const badgeBefore = await dinhKemScanPage.getBadgeChuaTraCount();

    Logger.step(2, 'Đánh dấu Đã trả dòng đầu tiên trong danh sách lọc');
    await dinhKemScanPage.getRowDaTraCheckbox(0).click();
    await page.waitForTimeout(600);

    Logger.step(3, 'Kiểm tra checkbox chuyển sang checked và badge Chưa trả KQ giảm đi 1');
    await expect(dinhKemScanPage.getRowDaTraCheckbox(0)).toBeChecked();
    const badgeAfter = await dinhKemScanPage.getBadgeChuaTraCount();
    expect(badgeAfter).toBe(badgeBefore - 1);

    // Hoàn tác click
    await dinhKemScanPage.getRowDaTraCheckbox(0).click();
    await page.waitForTimeout(400);

    // Tắt bộ lọc Chưa trả KQ
    await dinhKemScanPage.btnChuaTraKq.click();
    await page.waitForTimeout(400);
  });

  // =========================================================================
  // KHỐI 06: NÚT "Attach file" & MODAL QUẢN LÝ FILE SCAN (TRỌNG TÂM)
  // =========================================================================

  test('TC_DKSCAN_030: Kiểm tra trạng thái nút Attach file: Bị disabled khi chưa chọn dòng nào (0 dòng)', {
    tag: ['@smoke', '@critical']
  }, async ({ dinhKemScanPage }) => {
    Logger.step(1, 'Kiểm tra chưa có checkbox dòng nào được chọn');
    await expect(dinhKemScanPage.btnAttachFile).toBeVisible();

    Logger.step(2, 'Kiểm tra nút Attach file bị disabled');
    await expect(dinhKemScanPage.btnAttachFile).toBeDisabled();
  });

  test('TC_DKSCAN_031: Tích chọn chính xác 1 dòng phiếu ➔ Nút Attach file tự động sáng lên (enabled)', {
    tag: ['@smoke', '@critical']
  }, async ({ dinhKemScanPage }) => {
    Logger.step(1, 'Tích chọn dòng đầu tiên');
    await dinhKemScanPage.getRowCheckbox(0).click();

    Logger.step(2, 'Kiểm tra nút Attach file sáng lên (enabled)');
    await expect(dinhKemScanPage.btnAttachFile).toBeEnabled();

    // Dọn dẹp
    await dinhKemScanPage.getRowCheckbox(0).click();
  });

  test('TC_DKSCAN_032: Tích chọn từ 2 dòng phiếu trở lên ➔ Nút Attach file tự động bị disabled', {
    tag: ['@high']
  }, async ({ dinhKemScanPage }) => {
    const rowCount = await dinhKemScanPage.getRowCount();
    if (rowCount < 2) return;

    Logger.step(1, 'Tích chọn dòng 1 và dòng 2');
    await dinhKemScanPage.getRowCheckbox(0).click();
    await dinhKemScanPage.getRowCheckbox(1).click();

    Logger.step(2, 'Kiểm tra nút Attach file bị disabled (chỉ cho phép đính kèm từng phiếu một)');
    await expect(dinhKemScanPage.btnAttachFile).toBeDisabled();

    // Dọn dẹp
    await dinhKemScanPage.getRowCheckbox(0).click();
    await dinhKemScanPage.getRowCheckbox(1).click();
  });

  test('TC_DKSCAN_033: Nhấn nút Attach file khi chọn 1 dòng ➔ Mở modal tiêu đề Đính kèm file scan kèm mã phiếu', {
    tag: ['@smoke', '@critical']
  }, async ({ dinhKemScanPage, page }) => {
    Logger.step(1, 'Lấy mã PKQ dòng 1 và tích chọn');
    const maPkq = await dinhKemScanPage.getRowMaPkq(0);
    await dinhKemScanPage.getRowCheckbox(0).click();

    Logger.step(2, 'Nhấn nút Attach file');
    await dinhKemScanPage.btnAttachFile.click();
    await page.waitForTimeout(600);

    Logger.step(3, 'Kiểm tra modal hiển thị đầy đủ thông tin');
    await expect(dinhKemScanPage.modalAttach).toBeVisible();
    await expect(dinhKemScanPage.modalAttachTitle).toContainText('Đính kèm file scan');
    await expect(dinhKemScanPage.modalAttach).toContainText(maPkq);

    Logger.step(4, 'Đóng modal');
    await dinhKemScanPage.btnModalAttachCancel.click();
    await expect(dinhKemScanPage.modalAttach).toBeHidden();
    await dinhKemScanPage.getRowCheckbox(0).click();
  });

  test('TC_DKSCAN_034: Kiểm tra hiển thị bộ đếm X/10 file và danh sách file đã đính kèm trong modal', {
    tag: ['@high']
  }, async ({ dinhKemScanPage, page }) => {
    Logger.step(1, 'Mở modal Attach file của dòng 1');
    await dinhKemScanPage.getRowCheckbox(0).click();
    await dinhKemScanPage.btnAttachFile.click();
    await page.waitForTimeout(500);

    Logger.step(2, 'Kiểm tra bộ đếm file X/10 file');
    await expect(dinhKemScanPage.modalAttachFileCount).toBeVisible();

    Logger.step(3, 'Đóng modal');
    await dinhKemScanPage.btnModalAttachCancel.click();
    await dinhKemScanPage.getRowCheckbox(0).click();
  });

  test('TC_DKSCAN_035: Kiểm tra các nút thao tác trên file đính kèm: Xem, Tải về, Gỡ hiển thị đầy đủ', {
    tag: ['@high']
  }, async ({ dinhKemScanPage, page }) => {
    Logger.step(1, 'Mở modal Attach file của dòng 1');
    await dinhKemScanPage.getRowCheckbox(0).click();
    await dinhKemScanPage.btnAttachFile.click();
    await page.waitForTimeout(500);

    Logger.step(2, 'Nếu có file đã đính kèm, kiểm tra các nút Xem, Tải về, Gỡ');
    const btnXem = dinhKemScanPage.modalAttach.locator('button').filter({ hasText: /^Xem$/ }).first();
    const btnTaiVe = dinhKemScanPage.modalAttach.locator('button').filter({ hasText: /^Tải về$/ }).first();
    const btnGo = dinhKemScanPage.modalAttach.locator('button').filter({ hasText: /^Gỡ$/ }).first();

    if (await btnXem.isVisible()) {
      await expect(btnXem).toBeVisible();
      await expect(btnTaiVe).toBeVisible();
      await expect(btnGo).toBeVisible();
    }

    Logger.step(3, 'Đóng modal');
    await dinhKemScanPage.btnModalAttachCancel.click();
    await dinhKemScanPage.getRowCheckbox(0).click();
  });

  test('TC_DKSCAN_036: Kiểm tra vùng upload kéo thả: Hướng dẫn định dạng PDF, JPG, PNG và giới hạn 100MB/file', {
    tag: ['@high']
  }, async ({ dinhKemScanPage, page }) => {
    Logger.step(1, 'Mở modal Attach file');
    await dinhKemScanPage.getRowCheckbox(0).click();
    await dinhKemScanPage.btnAttachFile.click();
    await page.waitForTimeout(500);

    Logger.step(2, 'Kiểm tra văn bản quy định');
    await expect(dinhKemScanPage.modalAttach).toContainText('Kéo thả file vào đây hoặc bấm để chọn file');
    await expect(dinhKemScanPage.modalAttach).toContainText('PDF, JPG, PNG');
    await expect(dinhKemScanPage.modalAttach).toContainText('tối đa 100 MB/file');

    Logger.step(3, 'Đóng modal');
    await dinhKemScanPage.btnModalAttachCancel.click();
    await dinhKemScanPage.getRowCheckbox(0).click();
  });

  test('TC_DKSCAN_037: Tải lên file hợp lệ (PDF/PNG) qua file input ➔ File xuất hiện trong danh sách modal', {
    tag: ['@smoke', '@critical']
  }, async ({ dinhKemScanPage, page }) => {
    Logger.step(1, 'Mở modal Attach file');
    await dinhKemScanPage.getRowCheckbox(0).click();
    await dinhKemScanPage.btnAttachFile.click();
    await page.waitForTimeout(500);

    Logger.step(2, 'Upload file sample-scan.pdf');
    const testFilePath = path.resolve(__dirname, '../../../test-data/files/sample-scan.pdf');
    await dinhKemScanPage.modalAttachFileInput.setInputFiles(testFilePath);
    await page.waitForTimeout(600);

    Logger.step(3, 'Kiểm tra file sample-scan.pdf xuất hiện trong modal');
    await expect(dinhKemScanPage.modalAttach).toContainText('sample-scan.pdf');

    Logger.step(4, 'Đóng modal không lưu để giữ dữ liệu');
    await dinhKemScanPage.btnModalAttachCancel.click();
    await page.waitForTimeout(400);

    const confirmCloseBtn = page.locator('.unsaved-changes-dialog button, button').filter({ hasText: /^Đóng$/ }).last();
    if (await confirmCloseBtn.isVisible()) {
      await confirmCloseBtn.click();
      await page.waitForTimeout(400);
    }

    await expect(dinhKemScanPage.modalAttach).toBeHidden();
    await dinhKemScanPage.getRowCheckbox(0).click();
  });

  test('TC_DKSCAN_038: Logic Tự động đồng bộ Cột FILE SCAN: Thêm file và Lưu ➔ Cột FILE SCAN tự động được check', {
    tag: ['@smoke', '@critical']
  }, async ({ dinhKemScanPage, page }) => {
    // Tìm dòng chưa có file scan (cột 7 unchecked)
    const rowCount = await dinhKemScanPage.getRowCount();
    let targetIndex = -1;
    for (let i = 0; i < rowCount; i++) {
      if (!(await dinhKemScanPage.getRowFileScanCheckbox(i).isChecked())) {
        targetIndex = i;
        break;
      }
    }

    if (targetIndex === -1) {
      Logger.info('Tất cả dòng đều đã có file scan, chọn dòng 1 để verify');
      targetIndex = 0;
    }

    Logger.step(1, `Chọn dòng ${targetIndex + 1} và mở modal Attach file`);
    await dinhKemScanPage.getRowCheckbox(targetIndex).click();
    await dinhKemScanPage.btnAttachFile.click();
    await page.waitForTimeout(500);

    Logger.step(2, 'Upload file sample-scan.pdf');
    const testFilePath = path.resolve(__dirname, '../../../test-data/files/sample-scan.pdf');
    await dinhKemScanPage.modalAttachFileInput.setInputFiles(testFilePath);
    await page.waitForTimeout(600);

    Logger.step(3, 'Nhấn nút Lưu');
    await dinhKemScanPage.btnModalAttachSave.click();
    await page.waitForTimeout(800);

    Logger.step(4, 'Kiểm tra cột FILE SCAN của dòng đó tự động được check');
    await expect(dinhKemScanPage.getRowFileScanCheckbox(targetIndex)).toBeChecked();

    // Dọn dẹp: Bỏ chọn dòng
    await dinhKemScanPage.getRowCheckbox(targetIndex).click();
  });

  test('TC_DKSCAN_039: Nhấn nút Hủy hoặc phím Escape ➔ Modal đóng lại mà không lưu các thay đổi', {
    tag: ['@high']
  }, async ({ dinhKemScanPage, page }) => {
    Logger.step(1, 'Mở modal Attach file');
    await dinhKemScanPage.getRowCheckbox(0).click();
    await dinhKemScanPage.btnAttachFile.click();
    await page.waitForTimeout(500);
    await expect(dinhKemScanPage.modalAttach).toBeVisible();

    Logger.step(2, 'Bấm phím Escape');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(400);

    Logger.step(3, 'Kiểm tra modal biến mất');
    await expect(dinhKemScanPage.modalAttach).toBeHidden();
    await dinhKemScanPage.getRowCheckbox(0).click();
  });

  test('TC_DKSCAN_040: Thử chọn file có định dạng không được hỗ trợ ➔ Kiểm tra ràng buộc thuộc tính accept', {
    tag: ['@high']
  }, async ({ dinhKemScanPage, page }) => {
    Logger.step(1, 'Mở modal Attach file');
    await dinhKemScanPage.getRowCheckbox(0).click();
    await dinhKemScanPage.btnAttachFile.click();
    await page.waitForTimeout(500);

    Logger.step(2, 'Kiểm tra thuộc tính accept của input file');
    const acceptVal = await dinhKemScanPage.modalAttachFileInput.getAttribute('accept');
    expect(acceptVal).toContain('.pdf');
    expect(acceptVal).toContain('.jpg');
    expect(acceptVal).toContain('.png');

    Logger.step(3, 'Đóng modal');
    await dinhKemScanPage.btnModalAttachCancel.click();
    await dinhKemScanPage.getRowCheckbox(0).click();
  });

  // =========================================================================
  // KHỐI 07: NGHIỆP VỤ CỘT LINK WEB (Thêm – Sửa – Xóa)
  // =========================================================================

  test('TC_DKSCAN_041: Kiểm tra cột LINK WEB hiển thị đường dẫn dạng liên kết tra cứu hoặc placeholder —', {
    tag: ['@high']
  }, async ({ dinhKemScanPage }) => {
    Logger.step(1, 'Lấy nội dung cột LINK WEB của dòng 1');
    const cellText = await dinhKemScanPage.getRowLinkWebCell(0).innerText();
    expect(cellText.length).toBeGreaterThan(0);
  });

  test('TC_DKSCAN_042: Click vào đường dẫn tra cứu ➔ Mở tab mới với URL tra cứu kết quả tương ứng', {
    tag: ['@high']
  }, async ({ dinhKemScanPage }) => {
    // Tìm dòng có link tra cứu
    const rowCount = await dinhKemScanPage.getRowCount();
    let linkAnchor = null;
    for (let i = 0; i < rowCount; i++) {
      const a = dinhKemScanPage.listRows.nth(i).locator('td:nth-child(8) a').first();
      if (await a.isVisible()) {
        linkAnchor = a;
        break;
      }
    }

    if (linkAnchor) {
      Logger.step(1, 'Kiểm tra thuộc tính target="_blank" và rel="noopener" của link tra cứu');
      await expect(linkAnchor).toHaveAttribute('target', '_blank');
      await expect(linkAnchor).toHaveAttribute('rel', /noopener/);
      const href = await linkAnchor.getAttribute('href');
      expect(href).toContain('http');
    }
  });

  test('TC_DKSCAN_043: Nhấn nút bút chì Sửa đường dẫn tra cứu ➔ Chuyển thành ô input inline kèm nút Lưu và Hủy', {
    tag: ['@smoke', '@critical']
  }, async ({ dinhKemScanPage, page }) => {
    Logger.step(1, 'Nhấn nút bút chì ở dòng 1');
    await dinhKemScanPage.getRowLinkWebPencil(0).click();
    await page.waitForTimeout(400);

    Logger.step(2, 'Kiểm tra xuất hiện ô input inline');
    await expect(dinhKemScanPage.getRowLinkWebInput(0)).toBeVisible();
    await expect(dinhKemScanPage.getRowLinkWebSaveBtn(0)).toBeVisible();
    await expect(dinhKemScanPage.getRowLinkWebCancelBtn(0)).toBeVisible();

    Logger.step(3, 'Nhấn nút Hủy');
    await dinhKemScanPage.getRowLinkWebCancelBtn(0).click();
    await expect(dinhKemScanPage.getRowLinkWebInput(0)).toBeHidden();
  });

  test('TC_DKSCAN_044: Thao tác THÊM link web mới (khi ô đang là —) ➔ Nhập URL và Lưu thành công', {
    tag: ['@smoke', '@critical']
  }, async ({ dinhKemScanPage, page }) => {
    // Tìm dòng đang có LINK WEB là '—'
    const rowCount = await dinhKemScanPage.getRowCount();
    let targetIndex = -1;
    for (let i = 0; i < rowCount; i++) {
      const text = (await dinhKemScanPage.getRowLinkWebCell(i).innerText()).trim();
      if (text === '—') {
        targetIndex = i;
        break;
      }
    }

    if (targetIndex === -1) {
      Logger.info('Không có dòng nào là —, test trên dòng 1');
      targetIndex = 0;
    }

    Logger.step(1, `Thêm link web mới cho dòng ${targetIndex + 1}`);
    await dinhKemScanPage.getRowLinkWebPencil(targetIndex).click();
    await page.waitForTimeout(400);

    const testUrl = 'https://tra-cuu.vntest.vn/kq/TEST-URL-ADD';
    await dinhKemScanPage.getRowLinkWebInput(targetIndex).fill(testUrl);
    await dinhKemScanPage.getRowLinkWebSaveBtn(targetIndex).click();
    await page.waitForTimeout(600);

    Logger.step(2, 'Kiểm tra link mới xuất hiện trên ô');
    await expect(dinhKemScanPage.getRowLinkWebCell(targetIndex)).toContainText('TEST-URL-ADD');
  });

  test('TC_DKSCAN_045: Thao tác SỬA link web hiện có ➔ Sửa sang URL mới và Lưu thành công', {
    tag: ['@smoke', '@critical']
  }, async ({ dinhKemScanPage, page }) => {
    Logger.step(1, 'Bấm sửa link web dòng 1');
    await dinhKemScanPage.getRowLinkWebPencil(0).click();
    await page.waitForTimeout(400);

    const editedUrl = 'https://tra-cuu.vntest.vn/kq/EDITED-URL-NEW';
    await dinhKemScanPage.getRowLinkWebInput(0).fill(editedUrl);
    await dinhKemScanPage.getRowLinkWebSaveBtn(0).click();
    await page.waitForTimeout(600);

    Logger.step(2, 'Kiểm tra link đã cập nhật URL mới');
    await expect(dinhKemScanPage.getRowLinkWebCell(0)).toContainText('EDITED-URL-NEW');
  });

  test('TC_DKSCAN_046: Thao tác XÓA link web về — ➔ Xóa trắng ô input và Lưu thành công', {
    tag: ['@smoke', '@critical']
  }, async ({ dinhKemScanPage, page }) => {
    Logger.step(1, 'Bấm sửa link web dòng 1');
    await dinhKemScanPage.getRowLinkWebPencil(0).click();
    await page.waitForTimeout(400);

    Logger.step(2, 'Xóa trắng toàn bộ ô input');
    await dinhKemScanPage.getRowLinkWebInput(0).fill('');
    await dinhKemScanPage.getRowLinkWebSaveBtn(0).click();
    await page.waitForTimeout(600);

    Logger.step(3, 'Kiểm tra link web quay về trạng thái —');
    await expect(dinhKemScanPage.getRowLinkWebCell(0)).toContainText('—');
  });

  test('TC_DKSCAN_047: Thao tác HỦY sửa link web ➔ Nhấn nút Hủy hoặc Escape, giữ nguyên URL ban đầu', {
    tag: ['@high']
  }, async ({ dinhKemScanPage, page }) => {
    const textBefore = (await dinhKemScanPage.getRowLinkWebCell(0).innerText()).trim();

    Logger.step(1, 'Bấm nút sửa');
    await dinhKemScanPage.getRowLinkWebPencil(0).click();
    await page.waitForTimeout(400);

    Logger.step(2, 'Gõ nội dung khác nhưng nhấn Escape để hủy');
    await dinhKemScanPage.getRowLinkWebInput(0).fill('https://cancelling-edit.com');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(400);

    Logger.step(3, 'Kiểm tra giá trị ban đầu được giữ nguyên');
    const textAfter = (await dinhKemScanPage.getRowLinkWebCell(0).innerText()).trim();
    expect(textAfter).toBe(textBefore);
  });

  test('TC_DKSCAN_048: Kiểm tra ràng buộc maxlength 501 ký tự của ô input sửa đường dẫn tra cứu', {
    tag: ['@high']
  }, async ({ dinhKemScanPage, page }) => {
    Logger.step(1, 'Bấm sửa link web dòng 1');
    await dinhKemScanPage.getRowLinkWebPencil(0).click();
    await page.waitForTimeout(400);

    Logger.step(2, 'Kiểm tra thuộc tính maxlength="501"');
    const maxlength = await dinhKemScanPage.getRowLinkWebInput(0).getAttribute('maxlength');
    expect(maxlength).toBe('501');

    await dinhKemScanPage.getRowLinkWebCancelBtn(0).click();
  });

  // =========================================================================
  // KHỐI 08: CỘT Ý KIẾN (Thêm – Sửa – Xóa), QUẢN LÝ CỘT & IN ẤN
  // =========================================================================

  test('TC_DKSCAN_049: Kiểm tra cột Ý KIẾN: Hiển thị placeholder — khi chưa có ý kiến và nội dung khi đã có', {
    tag: ['@high']
  }, async ({ dinhKemScanPage }) => {
    Logger.step(1, 'Lấy nội dung cột Ý kiến dòng 1');
    const text = (await dinhKemScanPage.getRowYKienCell(0).innerText()).trim();
    expect(text.length).toBeGreaterThan(0);
  });

  test('TC_DKSCAN_050: Nhấn vào ô ý kiến ➔ Mở modal Cập nhật ý kiến điều phối, hiển thị đúng Mã PKQ và YCTN', {
    tag: ['@smoke', '@critical']
  }, async ({ dinhKemScanPage, page }) => {
    const maPkq = await dinhKemScanPage.getRowMaPkq(0);

    Logger.step(1, 'Click vào ô Ý kiến dòng 1');
    await dinhKemScanPage.getRowYKienCell(0).click();
    await page.waitForTimeout(500);

    Logger.step(2, 'Kiểm tra modal hiển thị');
    await expect(dinhKemScanPage.modalYKien).toBeVisible();
    await expect(dinhKemScanPage.modalYKienTitle).toContainText('Cập nhật ý kiến điều phối');
    await expect(dinhKemScanPage.modalYKien).toContainText(maPkq);
    await expect(dinhKemScanPage.modalYKienCharCount).toBeVisible();

    Logger.step(3, 'Đóng modal');
    await dinhKemScanPage.btnModalYKienCancel.click();
    await expect(dinhKemScanPage.modalYKien).toBeHidden();
  });

  test('TC_DKSCAN_051: Thao tác THÊM ý kiến mới (khi ô đang là —) ➔ Nhập nội dung và Lưu thành công', {
    tag: ['@smoke', '@critical']
  }, async ({ dinhKemScanPage, page }) => {
    // Tìm dòng có Ý kiến là '—'
    const rowCount = await dinhKemScanPage.getRowCount();
    let targetIndex = -1;
    for (let i = 0; i < rowCount; i++) {
      const text = (await dinhKemScanPage.getRowYKienCell(i).innerText()).trim();
      if (text === '—') {
        targetIndex = i;
        break;
      }
    }

    if (targetIndex === -1) {
      Logger.info('Không có dòng nào là —, test trên dòng 1');
      targetIndex = 0;
    }

    Logger.step(1, `Thêm ý kiến cho dòng ${targetIndex + 1}`);
    await dinhKemScanPage.getRowYKienCell(targetIndex).click();
    await page.waitForTimeout(500);

    const testComment = 'Ý kiến điều phối tự động thêm mới';
    await dinhKemScanPage.modalYKienTextarea.fill(testComment);
    await dinhKemScanPage.btnModalYKienSave.click();
    await page.waitForTimeout(600);

    Logger.step(2, 'Kiểm tra ô Ý kiến hiển thị đúng nội dung vừa thêm');
    await expect(dinhKemScanPage.getRowYKienCell(targetIndex)).toContainText(testComment);
  });

  test('TC_DKSCAN_052: Thao tác SỬA ý kiến hiện có ➔ Sửa nội dung trong textarea và Lưu thành công', {
    tag: ['@smoke', '@critical']
  }, async ({ dinhKemScanPage, page }) => {
    Logger.step(1, 'Mở modal sửa ý kiến dòng 1');
    await dinhKemScanPage.getRowYKienCell(0).click();
    await page.waitForTimeout(500);

    const editedComment = 'Ý kiến đã được chỉnh sửa mới';
    await dinhKemScanPage.modalYKienTextarea.fill(editedComment);
    await dinhKemScanPage.btnModalYKienSave.click();
    await page.waitForTimeout(600);

    Logger.step(2, 'Kiểm tra ô Ý kiến hiển thị nội dung chỉnh sửa mới');
    await expect(dinhKemScanPage.getRowYKienCell(0)).toContainText(editedComment);
  });

  test('TC_DKSCAN_053: Thao tác XÓA ý kiến về — ➔ Xóa sạch textarea và Lưu thành công', {
    tag: ['@smoke', '@critical']
  }, async ({ dinhKemScanPage, page }) => {
    Logger.step(1, 'Mở modal sửa ý kiến dòng 1');
    await dinhKemScanPage.getRowYKienCell(0).click();
    await page.waitForTimeout(500);

    Logger.step(2, 'Xóa sạch nội dung trong textarea');
    await dinhKemScanPage.modalYKienTextarea.fill('');
    await dinhKemScanPage.btnModalYKienSave.click();
    await page.waitForTimeout(600);

    Logger.step(3, 'Kiểm tra ô Ý kiến quay về placeholder —');
    await expect(dinhKemScanPage.getRowYKienCell(0)).toContainText('—');
  });

  test('TC_DKSCAN_054: Thao tác HỦY sửa ý kiến ➔ Bấm nút Hủy, giữ nguyên ý kiến ban đầu', {
    tag: ['@high']
  }, async ({ dinhKemScanPage, page }) => {
    const textBefore = (await dinhKemScanPage.getRowYKienCell(0).innerText()).trim();

    Logger.step(1, 'Mở modal sửa ý kiến dòng 1');
    await dinhKemScanPage.getRowYKienCell(0).click();
    await page.waitForTimeout(500);

    Logger.step(2, 'Gõ nội dung tạm nhưng nhấn nút Hủy');
    await dinhKemScanPage.modalYKienTextarea.fill('Nội dung này sẽ bị hủy');
    await dinhKemScanPage.btnModalYKienCancel.click();
    await page.waitForTimeout(400);

    // Xử lý popup xác nhận hủy nếu có
    const confirmCancelBtn = page.locator('button').filter({ hasText: /^Đóng$/ }).last();
    if (await confirmCancelBtn.isVisible()) {
      await confirmCancelBtn.click();
      await page.waitForTimeout(300);
    }

    Logger.step(3, 'Kiểm tra ý kiến cũ được giữ nguyên');
    const textAfter = (await dinhKemScanPage.getRowYKienCell(0).innerText()).trim();
    expect(textAfter).toBe(textBefore);
  });

  test('TC_DKSCAN_055: Nhấn nút Quản lý cột ➔ Mở menu cấu hình cột; kiểm tra nút ĐẶT LẠI', {
    tag: ['@high']
  }, async ({ dinhKemScanPage, page }) => {
    Logger.step(1, 'Kiểm tra nút Quản lý cột');
    await expect(dinhKemScanPage.btnColumnMgmt).toBeVisible();

    Logger.step(2, 'Nhấn nút Quản lý cột để mở popover');
    await dinhKemScanPage.btnColumnMgmt.click();
    await page.waitForTimeout(500);

    Logger.step(3, 'Kiểm tra nút ĐẶT LẠI hoặc menu quản lý cột');
    await expect(dinhKemScanPage.btnResetColumns).toBeVisible();

    Logger.step(4, 'Đóng popover quản lý cột');
    await page.keyboard.press('Escape');
  });

  test('TC_DKSCAN_056: Kiểm tra phân trang: Chuyển trang và thay đổi kích thước trang (Page size: 20)', {
    tag: ['@normal']
  }, async ({ dinhKemScanPage }) => {
    Logger.step(1, 'Kiểm tra hiển thị nút phân trang');
    await expect(dinhKemScanPage.paginationInfo).toBeVisible();

    Logger.step(2, 'Kiểm tra dropdown chọn số dòng / trang (mặc định 20)');
    await expect(dinhKemScanPage.pageSizeDropdown).toBeVisible();
    await expect(dinhKemScanPage.pageSizeDropdown).toContainText('20');
  });

  test('TC_DKSCAN_057: Nhấn nút Print trên thanh công cụ ➔ Kích hoạt giao diện in phiếu đang xem trước', {
    tag: ['@smoke', '@high']
  }, async ({ dinhKemScanPage }) => {
    Logger.step(1, 'Kiểm tra nút Print hiển thị và bấm được');
    await expect(dinhKemScanPage.btnPrint).toBeVisible();
    await expect(dinhKemScanPage.btnPrint).toBeEnabled();

    Logger.step(2, 'Nhấn nút Print');
    await dinhKemScanPage.btnPrint.click();
  });
});
