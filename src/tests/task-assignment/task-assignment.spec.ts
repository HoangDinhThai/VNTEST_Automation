import { test, expect } from '../../fixtures/base.fixture';
import users from '../../../test-data/users.json';

test.describe('Màn hình Giao việc (/giao-viec - Tab GIAO VIỆC)', () => {
  test.beforeEach(async ({ taskAssignmentPage }) => {
    await taskAssignmentPage.open('/giao-viec');
  });

  // =========================================================================
  // KHỐI 1: BỐ CỤC, HIỂN THỊ & ĐÓNG/MỞ THẺ YCTN (TC_GV_001 -> TC_GV_003)
  // =========================================================================

  test('TC_GV_001: Kiểm tra bố cục tổng thể màn hình Giao việc (Tabs, Toolbar, Chips, Bộ lọc ngày, Thẻ YCTN & Bảng 11 cột chỉ tiêu)', async ({
    taskAssignmentPage,
  }) => {
    // 1. Kiểm tra 4 tab điều hướng trên Header
    await expect(taskAssignmentPage.tabGiaoViec).toBeVisible();
    await expect(taskAssignmentPage.tabGiaoViec).toHaveClass(/active/);
    await expect(taskAssignmentPage.tabHoSoTN).toBeVisible();
    await expect(taskAssignmentPage.tabTruongBPKtra).toBeVisible();
    await expect(taskAssignmentPage.tabQlyCTTinh).toBeVisible();

    // 2. Kiểm tra 4 nút công cụ bên phải Header
    await expect(taskAssignmentPage.btnPrint).toBeVisible();
    await expect(taskAssignmentPage.btnImport).toBeVisible();
    await expect(taskAssignmentPage.btnExport).toBeVisible();
    await expect(taskAssignmentPage.btnHelp).toBeVisible();

    // 3. Kiểm tra 5 chip trạng thái lọc nhanh
    await expect(taskAssignmentPage.chipChuaGiaoViec).toBeVisible();
    await expect(taskAssignmentPage.chipDangLam).toBeVisible();
    await expect(taskAssignmentPage.chipTreHan).toBeVisible();
    await expect(taskAssignmentPage.chipKiemNhanh).toBeVisible();
    await expect(taskAssignmentPage.chipThieuHS).toBeVisible();

    // 4. Kiểm tra bộ lọc ngày, ô tìm kiếm, nút Hủy & nút Tạo hồ sơ NK mặc định disabled
    await expect(taskAssignmentPage.dateTypeTrigger).toBeVisible();
    await expect(taskAssignmentPage.dateFromTrigger).toBeVisible();
    await expect(taskAssignmentPage.dateToTrigger).toBeVisible();
    await expect(taskAssignmentPage.searchInput).toBeVisible();
    await expect(taskAssignmentPage.clearFilterButton).toBeDisabled();
    await expect(taskAssignmentPage.btnTaoHoSoNK).toHaveClass(/disabled/);

    // 5. Kiểm tra cấu trúc thẻ YCTN, khối Mẫu và bảng 11 cột chỉ tiêu
    const firstCard = taskAssignmentPage.yctnCards.first();
    await expect(firstCard.locator('.yctn-head .yctn-id')).toBeVisible();
    await expect(firstCard.locator('.sample-block').first()).toBeVisible();

    const headers = await firstCard.locator('table.ct-table').first().locator('thead th').allInnerTexts();
    expect(headers.map((h) => h.trim())).toEqual([
      'CHỈ TIÊU',
      'ĐVT',
      'PP THỬ',
      'KẾT QUẢ',
      'LOD',
      'LOQ',
      'VL',
      'TÊN KNV',
      '',
      'GHI CHÚ',
      'HS',
    ]);
  });

  test('TC_GV_002: Kiểm tra chức năng "▶ Thu gọn tất cả" và "▼ Mở tất cả" danh sách thẻ YCTN', async ({
    taskAssignmentPage,
  }) => {
    const initialSamplesCount = await taskAssignmentPage.sampleBlocks.count();
    expect(initialSamplesCount).toBeGreaterThan(0);

    // Nhấn "▶ Thu gọn tất cả"
    await taskAssignmentPage.btnCollapseAll.click();
    await expect(taskAssignmentPage.sampleBlocks).toHaveCount(0);

    // Nhấn "▼ Mở tất cả"
    await taskAssignmentPage.btnExpandAll.click();
    await expect
      .poll(async () => await taskAssignmentPage.sampleBlocks.count(), { timeout: 5000 })
      .toBeGreaterThan(0);
  });

  test('TC_GV_003: Kiểm tra đóng/mở (toggle) từng thẻ YCTN riêng lẻ khi nhấn vào tiêu đề thẻ (.yctn-head)', async ({
    taskAssignmentPage,
  }) => {
    const firstCard = taskAssignmentPage.yctnCards.nth(0);
    const secondCard = taskAssignmentPage.yctnCards.nth(1);

    await expect(firstCard.locator('.sample-block').first()).toBeVisible();
    await expect(secondCard.locator('.sample-block').first()).toBeVisible();

    // Nhấn vào tiêu đề thẻ YCTN đầu tiên để thu gọn riêng thẻ đó
    await firstCard.locator('.yctn-head').click();
    await expect(firstCard.locator('.sample-block')).toHaveCount(0);
    // Thẻ thứ 2 vẫn mở bình thường
    await expect(secondCard.locator('.sample-block').first()).toBeVisible();

    // Nhấn lại vào tiêu đề thẻ đầu tiên để mở rộng lại
    await firstCard.locator('.yctn-head').click();
    await expect(firstCard.locator('.sample-block').first()).toBeVisible();
  });

  // =========================================================================
  // KHỐI 2: TÌM KIẾM TỪ KHÓA & LỌC THEO 5 CHIP TRẠNG THÁI (TC_GV_004 -> TC_GV_011)
  // =========================================================================

  test('TC_GV_004: Tìm kiếm theo Mã YCTN (TR...) hợp lệ và xóa điều kiện lọc bằng nút "Hủy"', async ({
    taskAssignmentPage,
  }) => {
    const targetTrCode = (
      await taskAssignmentPage.yctnCards.first().locator('.yctn-id').innerText()
    ).trim();

    await taskAssignmentPage.searchByKeyword(targetTrCode);

    await expect(taskAssignmentPage.clearFilterButton).toBeEnabled();
    await expect(taskAssignmentPage.yctnCards).toHaveCount(1);
    await expect(taskAssignmentPage.yctnCards.first().locator('.yctn-id')).toHaveText(targetTrCode);

    // Nhấn nút Hủy để xóa tìm kiếm
    await taskAssignmentPage.clearAllFilters();
    await expect(taskAssignmentPage.searchInput).toHaveValue('');
    await expect(taskAssignmentPage.clearFilterButton).toBeDisabled();
    await expect
      .poll(async () => await taskAssignmentPage.yctnCards.count(), { timeout: 10000 })
      .toBeGreaterThan(1);
  });

  test('TC_GV_005: Tìm kiếm theo Mã mẫu (S...) hợp lệ', async ({ taskAssignmentPage }) => {
    const targetSampleCode = (
      await taskAssignmentPage.sampleBlocks.first().locator('.sample-title strong').innerText()
    ).trim();

    await taskAssignmentPage.searchByKeyword(targetSampleCode);

    await expect(taskAssignmentPage.clearFilterButton).toBeEnabled();
    expect(await taskAssignmentPage.yctnCards.count()).toBeGreaterThanOrEqual(1);
    await expect(
      taskAssignmentPage.sampleBlocks.filter({ hasText: targetSampleCode }).first()
    ).toBeVisible();

    await taskAssignmentPage.clearAllFilters();
  });

  test('TC_GV_006: Tìm kiếm với từ khóa không tồn tại hiển thị danh sách rỗng', async ({
    taskAssignmentPage,
  }) => {
    await taskAssignmentPage.searchByKeyword('TR_KHONG_TON_TAI_999999');

    await expect(taskAssignmentPage.clearFilterButton).toBeEnabled();
    await expect(taskAssignmentPage.yctnCards).toHaveCount(0);

    await taskAssignmentPage.clearAllFilters();
  });

  test('TC_GV_007: Lọc danh sách theo chip trạng thái "Chưa giao việc" (bật/tắt chip)', async ({
    taskAssignmentPage,
  }) => {
    await taskAssignmentPage.chipChuaGiaoViec.click();
    await expect(taskAssignmentPage.chipChuaGiaoViec).toHaveClass(/active/);
    await expect
      .poll(async () => await taskAssignmentPage.yctnCards.count(), { timeout: 10000 })
      .toBeGreaterThan(0);

    // Tắt lọc khi nhấn lại vào chip
    await taskAssignmentPage.chipChuaGiaoViec.click();
    await expect(taskAssignmentPage.chipChuaGiaoViec).not.toHaveClass(/active/);
    await expect
      .poll(async () => await taskAssignmentPage.yctnCards.count(), { timeout: 10000 })
      .toBeGreaterThan(0);
  });

  test('TC_GV_008: Lọc danh sách theo chip trạng thái "Đang làm" (bật/tắt chip)', async ({
    taskAssignmentPage,
  }) => {
    await taskAssignmentPage.chipDangLam.click();
    await expect(taskAssignmentPage.chipDangLam).toHaveClass(/active/);
    await expect
      .poll(async () => await taskAssignmentPage.yctnCards.count(), { timeout: 10000 })
      .toBeGreaterThan(0);

    await taskAssignmentPage.chipDangLam.click();
    await expect(taskAssignmentPage.chipDangLam).not.toHaveClass(/active/);
    await expect
      .poll(async () => await taskAssignmentPage.yctnCards.count(), { timeout: 10000 })
      .toBeGreaterThan(0);
  });

  test('TC_GV_009: Lọc danh sách theo chip trạng thái "Trễ hạn" (bật/tắt chip)', async ({
    taskAssignmentPage,
  }) => {
    await taskAssignmentPage.chipTreHan.click();
    await expect(taskAssignmentPage.chipTreHan).toHaveClass(/active/);
    await expect
      .poll(async () => await taskAssignmentPage.yctnCards.count(), { timeout: 10000 })
      .toBeGreaterThan(0);

    await taskAssignmentPage.chipTreHan.click();
    await expect(taskAssignmentPage.chipTreHan).not.toHaveClass(/active/);
    await expect
      .poll(async () => await taskAssignmentPage.yctnCards.count(), { timeout: 10000 })
      .toBeGreaterThan(0);
  });

  test('TC_GV_010: Lọc danh sách theo chip trạng thái "Kiểm nhanh" (bật/tắt chip)', async ({
    taskAssignmentPage,
  }) => {
    await taskAssignmentPage.chipKiemNhanh.click();
    await expect(taskAssignmentPage.chipKiemNhanh).toHaveClass(/active/);
    await expect
      .poll(async () => await taskAssignmentPage.yctnCards.count(), { timeout: 10000 })
      .toBeGreaterThan(0);

    await taskAssignmentPage.chipKiemNhanh.click();
    await expect(taskAssignmentPage.chipKiemNhanh).not.toHaveClass(/active/);
    await expect
      .poll(async () => await taskAssignmentPage.yctnCards.count(), { timeout: 10000 })
      .toBeGreaterThan(0);
  });

  test('TC_GV_011: Lọc danh sách theo chip trạng thái "Thiếu HS" (bật/tắt chip)', async ({
    taskAssignmentPage,
  }) => {
    await taskAssignmentPage.chipThieuHS.click();
    await expect(taskAssignmentPage.chipThieuHS).toHaveClass(/active/);
    await expect
      .poll(async () => await taskAssignmentPage.yctnCards.count(), { timeout: 10000 })
      .toBeGreaterThan(0);

    await taskAssignmentPage.chipThieuHS.click();
    await expect(taskAssignmentPage.chipThieuHS).not.toHaveClass(/active/);
    await expect
      .poll(async () => await taskAssignmentPage.yctnCards.count(), { timeout: 10000 })
      .toBeGreaterThan(0);
  });

  // =========================================================================
  // KHỐI 3: BỘ LỌC THEO NGÀY NHẬN & NGÀY TRẢ (TC_GV_012 -> TC_GV_019)
  // =========================================================================

  test('TC_GV_012: Lọc theo Ngày nhận - Chỉ nhập Từ ngày, không nhập Đến ngày', async ({
    taskAssignmentPage,
  }) => {
    await taskAssignmentPage.selectDateFilterType('Ngày nhận');
    await taskAssignmentPage.setFromDateDay(10);

    await expect(taskAssignmentPage.dateFromTrigger).toContainText('10/');
    await expect(taskAssignmentPage.dateToTrigger).toContainText('dd/mm/yyyy');
    await expect(taskAssignmentPage.dateClearButton).toBeVisible();

    await taskAssignmentPage.clearDateFilter();
    await expect(taskAssignmentPage.dateFromTrigger).toContainText('dd/mm/yyyy');
  });

  test('TC_GV_013: Lọc theo Ngày nhận - Chỉ nhập Đến ngày, không nhập Từ ngày', async ({
    taskAssignmentPage,
  }) => {
    await taskAssignmentPage.selectDateFilterType('Ngày nhận');
    await taskAssignmentPage.setToDateDay(20);

    await expect(taskAssignmentPage.dateFromTrigger).toContainText('dd/mm/yyyy');
    await expect(taskAssignmentPage.dateToTrigger).toContainText('20/');
    await expect(taskAssignmentPage.dateClearButton).toBeVisible();

    await taskAssignmentPage.clearDateFilter();
    await expect(taskAssignmentPage.dateToTrigger).toContainText('dd/mm/yyyy');
  });

  test('TC_GV_014: Lọc theo Ngày nhận - Nhập Từ ngày và Đến ngày cùng 1 ngày (Từ = Đến)', async ({
    taskAssignmentPage,
  }) => {
    await taskAssignmentPage.selectDateFilterType('Ngày nhận');
    await taskAssignmentPage.setFromDateDay(15);
    await taskAssignmentPage.setToDateDay(15);

    const fromText = (await taskAssignmentPage.dateFromTrigger.innerText()).replace(/^TỪ\s*/i, '').trim();
    const toText = (await taskAssignmentPage.dateToTrigger.innerText()).replace(/^ĐẾN\s*/i, '').trim();
    expect(fromText).toBe(toText);
    expect(fromText).toContain('15/');

    await taskAssignmentPage.clearDateFilter();
  });

  test('TC_GV_015: Lọc theo Ngày nhận - Nhập khoảng Từ ngày đến Đến ngày (Từ < Đến)', async ({
    taskAssignmentPage,
  }) => {
    await taskAssignmentPage.selectDateFilterType('Ngày nhận');
    await taskAssignmentPage.setFromDateDay(5);
    await taskAssignmentPage.setToDateDay(25);

    await expect(taskAssignmentPage.dateFromTrigger).toContainText('05/');
    await expect(taskAssignmentPage.dateToTrigger).toContainText('25/');
    await expect(taskAssignmentPage.dateClearButton).toBeVisible();

    await taskAssignmentPage.clearDateFilter();
  });

  test('TC_GV_016: Lọc theo Ngày trả - Chỉ nhập Từ ngày, không nhập Đến ngày', async ({
    taskAssignmentPage,
  }) => {
    await taskAssignmentPage.selectDateFilterType('Ngày trả');
    await taskAssignmentPage.setFromDateDay(10);

    await expect(taskAssignmentPage.dateTypeTrigger).toHaveText('Ngày trả');
    await expect(taskAssignmentPage.dateFromTrigger).toContainText('10/');
    await expect(taskAssignmentPage.dateToTrigger).toContainText('dd/mm/yyyy');

    await taskAssignmentPage.clearDateFilter();
  });

  test('TC_GV_017: Lọc theo Ngày trả - Chỉ nhập Đến ngày, không nhập Từ ngày', async ({
    taskAssignmentPage,
  }) => {
    await taskAssignmentPage.selectDateFilterType('Ngày trả');
    await taskAssignmentPage.setToDateDay(20);

    await expect(taskAssignmentPage.dateTypeTrigger).toHaveText('Ngày trả');
    await expect(taskAssignmentPage.dateFromTrigger).toContainText('dd/mm/yyyy');
    await expect(taskAssignmentPage.dateToTrigger).toContainText('20/');

    await taskAssignmentPage.clearDateFilter();
  });

  test('TC_GV_018: Lọc theo Ngày trả - Nhập Từ ngày và Đến ngày cùng 1 ngày (Từ = Đến)', async ({
    taskAssignmentPage,
  }) => {
    await taskAssignmentPage.selectDateFilterType('Ngày trả');
    await taskAssignmentPage.setFromDateDay(15);
    await taskAssignmentPage.setToDateDay(15);

    const fromText = (await taskAssignmentPage.dateFromTrigger.innerText()).replace(/^TỪ\s*/i, '').trim();
    const toText = (await taskAssignmentPage.dateToTrigger.innerText()).replace(/^ĐẾN\s*/i, '').trim();
    expect(fromText).toBe(toText);
    expect(fromText).toContain('15/');

    await taskAssignmentPage.clearDateFilter();
  });

  test('TC_GV_019: Lọc theo Ngày trả - Nhập khoảng Từ ngày đến Đến ngày (Từ < Đến)', async ({
    taskAssignmentPage,
  }) => {
    await taskAssignmentPage.selectDateFilterType('Ngày trả');
    await taskAssignmentPage.setFromDateDay(5);
    await taskAssignmentPage.setToDateDay(25);

    await expect(taskAssignmentPage.dateTypeTrigger).toHaveText('Ngày trả');
    await expect(taskAssignmentPage.dateFromTrigger).toContainText('05/');
    await expect(taskAssignmentPage.dateToTrigger).toContainText('25/');

    await taskAssignmentPage.clearDateFilter();
  });

  // =========================================================================
  // KHỐI 4: LUỒNG LIÊN THÔNG TỪ TIẾP NHẬN YCTN SANG GIAO VIỆC (TC_GV_020)
  // =========================================================================

  test('TC_GV_020: Kiểm tra bản ghi YCTN đã duyệt (TR...) từ màn Tiếp nhận YCTN được đẩy sang và hiển thị đầy đủ trên màn Giao việc', async ({
    testRequestReceptionPage,
    taskAssignmentPage,
  }) => {
    // 1. Điều hướng sang màn Tiếp nhận YCTN, lọc các bản ghi đã duyệt (YCTN DD) có mã TR...
    await testRequestReceptionPage.open('/tiep-nhan-yctn');
    await testRequestReceptionPage.chipYctnApproved.click();
    await testRequestReceptionPage.page.waitForTimeout(400);

    const approvedRow = testRequestReceptionPage.rows
      .filter({ hasText: /TR\d+/ })
      .first();
    await expect(approvedRow).toBeVisible();
    await approvedRow.click();

    const rowText = await approvedRow.innerText();
    const trMatch = rowText.match(/TR\d+/);
    expect(trMatch).not.toBeNull();
    const trCode = trMatch![0];

    // 2. Điều hướng sang màn Giao việc (/giao-viec) và tìm kiếm theo mã TR... đó
    await taskAssignmentPage.open('/giao-viec');
    await taskAssignmentPage.searchByKeyword(trCode);

    const card = taskAssignmentPage.yctnCards.filter({ hasText: trCode }).first();
    await expect(card).toBeVisible();
    await expect(card.locator('.yctn-id')).toHaveText(trCode);
    await expect(card.locator('.sample-block').first()).toBeVisible();
    await expect(card.locator('table.ct-table tbody tr').first()).toBeVisible();

    await taskAssignmentPage.clearAllFilters();
  });

  // =========================================================================
  // KHỐI 5: GÁN, THAY ĐỔI, XÓA KNV & CẢNH BÁO ĐỔI KNV (TC_GV_021 -> TC_GV_025)
  // =========================================================================

  test('TC_GV_021: Gán Kiểm nghiệm viên (KNV) cho chỉ tiêu đang "— chưa gán —" và kiểm tra highlight dòng của bạn (.mine-row)', async ({
    taskAssignmentPage,
  }) => {
    // Cố định index của dòng chỉ tiêu đang "— chưa gán —" và chưa có hồ sơ (.hs-none)
    const rowIdx = await taskAssignmentPage.findCriterionRowIndex({
      hsClass: 'hs-none',
      unassignedOnly: true,
    });
    expect(rowIdx).toBeGreaterThanOrEqual(0);
    const targetRow = taskAssignmentPage.ctRows.nth(rowIdx);
    await expect(targetRow).toBeVisible();

    await taskAssignmentPage.selectKnvForRow(targetRow, 'Admin User');

    await expect(targetRow.locator('.knv-select-search .select-search-value')).toHaveText(
      'Admin User'
    );
    await expect(targetRow.locator('.ct-name')).toHaveClass(/mine/);

    // Khôi phục lại trạng thái chưa gán để không ảnh hưởng dữ liệu
    await taskAssignmentPage.clearKnvForRow(targetRow);
    await expect(targetRow.locator('.knv-select-search')).toContainText('— chưa gán —');
  });

  test('TC_GV_022: Thay đổi sang KNV khác và xóa (hủy gán) KNV bằng nút × đối với chỉ tiêu chưa có hồ sơ nhật ký (Chưa có HS)', async ({
    taskAssignmentPage,
  }) => {
    const rowIdx = await taskAssignmentPage.findCriterionRowIndex({
      hsClass: 'hs-none',
      unassignedOnly: true,
    });
    expect(rowIdx).toBeGreaterThanOrEqual(0);
    const targetRow = taskAssignmentPage.ctRows.nth(rowIdx);
    await expect(targetRow).toBeVisible();

    // 1. Gán ban đầu cho Admin User
    await taskAssignmentPage.selectKnvForRow(targetRow, 'Admin User');
    await expect(targetRow.locator('.knv-select-search .select-search-value')).toHaveText(
      'Admin User'
    );

    // 2. Đổi sang KNV khác (Hoàng Thị Lan) -> cập nhật trực tiếp không hiện cảnh báo
    await taskAssignmentPage.selectKnvForRow(targetRow, 'Hoàng Thị Lan');
    await expect(taskAssignmentPage.reassignModal).toHaveCount(0);
    await expect(targetRow.locator('.knv-select-search .select-search-value')).toHaveText(
      'Hoàng Thị Lan'
    );

    // 3. Nhấn nút xóa × (.select-search-clear) -> quay về "— chưa gán —"
    await taskAssignmentPage.clearKnvForRow(targetRow);
    await expect(targetRow.locator('.knv-select-search')).toContainText('— chưa gán —');
  });

  test('TC_GV_023: Đổi KNV đối với chỉ tiêu đang có hồ sơ nhật ký (Đang làm NK - Ảnh 1) -> Hiện "Cảnh báo đổi kiểm nghiệm viên" -> Nhấn "Hủy"', async ({
    taskAssignmentPage,
  }) => {
    // Cố định index của dòng chỉ tiêu đang có hồ sơ nhật ký (.hs-red "Đang làm NK")
    const rowIdx = await taskAssignmentPage.findCriterionRowIndex({ hsClass: 'hs-red' });
    expect(rowIdx).toBeGreaterThanOrEqual(0);
    const redRow = taskAssignmentPage.ctRows.nth(rowIdx);
    await expect(redRow).toBeVisible();

    const criterionName = (await redRow.locator('.ct-name').innerText()).trim();
    const originalKnv = (
      await redRow.locator('.knv-select-search .select-search-value').innerText()
    ).trim();
    const newKnv = originalKnv === 'Hoàng Thị Lan' ? 'Admin User' : 'Hoàng Thị Lan';

    // Chọn KNV mới
    await taskAssignmentPage.selectKnvForRow(redRow, newKnv);

    // Kiểm tra hộp thoại "Cảnh báo đổi kiểm nghiệm viên" (Ảnh 1)
    await expect(taskAssignmentPage.reassignModal).toBeVisible();
    await expect(taskAssignmentPage.reassignTitle).toContainText('Cảnh báo đổi kiểm nghiệm viên');
    await expect(taskAssignmentPage.reassignMessage).toContainText(
      'Kiểm nghiệm viên cũ đã thực hiện phân tích và tạo nhật ký thử nghiệm. Bạn có chắc chắn muốn giao lại cho kiểm nghiệm viên khác làm lại từ đầu và hủy nhật ký thử nghiệm cũ không?'
    );
    await expect(taskAssignmentPage.reassignDetails).toContainText(criterionName);
    await expect(taskAssignmentPage.reassignDetails).toContainText('HS-');
    await expect(taskAssignmentPage.reassignDetails).toContainText(newKnv);

    // Nhấn nút "Hủy" -> đóng hộp thoại, giữ nguyên KNV cũ và chấm đỏ .hs-red
    await taskAssignmentPage.btnReassignCancel.click();
    await expect(taskAssignmentPage.reassignModal).toHaveCount(0);
    await expect(redRow.locator('.knv-select-search .select-search-value')).toHaveText(originalKnv);
    await expect(redRow.locator('.hs-red')).toBeVisible();
  });

  test('TC_GV_024: Đổi KNV đối với chỉ tiêu đang có hồ sơ nhật ký (Đang làm NK - Ảnh 1) -> Hiện "Cảnh báo đổi kiểm nghiệm viên" -> Nhấn "Đồng ý giao lại"', async ({
    taskAssignmentPage,
  }) => {
    const rowIdx = await taskAssignmentPage.findCriterionRowIndex({ hsClass: 'hs-red' });
    expect(rowIdx).toBeGreaterThanOrEqual(0);
    const redRow = taskAssignmentPage.ctRows.nth(rowIdx);
    await expect(redRow).toBeVisible();

    const originalKnv = (
      await redRow.locator('.knv-select-search .select-search-value').innerText()
    ).trim();
    const newKnv = originalKnv === 'Hoàng Thị Lan' ? 'Admin User' : 'Hoàng Thị Lan';

    await taskAssignmentPage.selectKnvForRow(redRow, newKnv);
    await expect(taskAssignmentPage.reassignModal).toBeVisible();

    // Nhấn nút "Đồng ý giao lại"
    await taskAssignmentPage.btnReassignConfirm.click();
    await expect(taskAssignmentPage.reassignModal).toHaveCount(0);

    // Kiểm tra tên KNV đã cập nhật sang KNV mới và hủy hồ sơ NK cũ (quay về .hs-none)
    await expect(redRow.locator('.knv-select-search .select-search-value')).toHaveText(newKnv);
    await expect(redRow.locator('.hs-none')).toBeVisible();

    // Khôi phục lại KNV ban đầu và tạo lại hồ sơ NK cho dòng đó để giữ nguyên dữ liệu mẫu
    await taskAssignmentPage.selectKnvForRow(redRow, originalKnv);
    if (await taskAssignmentPage.reassignModal.isVisible()) {
      await taskAssignmentPage.btnReassignConfirm.click();
    }
    const cb = redRow.locator('input.cb');
    if (await cb.isEnabled()) {
      await cb.check();
      await taskAssignmentPage.btnTaoHoSoNK.click();
      await expect(taskAssignmentPage.nkModal).toBeVisible();
      await taskAssignmentPage.btnNkConfirm.click();
      await expect(taskAssignmentPage.nkModal).toHaveCount(0);
    }
  });

  test('TC_GV_025: Kiểm tra trạng thái khóa (disabled) của ô chọn TÊN KNV và checkbox đối với chỉ tiêu đã phê duyệt hoàn tất (Đã duyệt HS)', async ({
    taskAssignmentPage,
  }) => {
    const approvedHsRow = taskAssignmentPage.ctRows
      .filter({ has: taskAssignmentPage.page.locator('.hs-green') })
      .first();
    await expect(approvedHsRow).toBeVisible();

    const knvSelect = approvedHsRow.locator('.knv-select-search');
    await expect(knvSelect).toHaveClass(/is-disabled/);
    await expect(knvSelect).toHaveAttribute(
      'title',
      /Chỉ tiêu đã được phê duyệt kết quả hoàn tất/
    );
    await expect(approvedHsRow.locator('input.cb')).toBeDisabled();
  });

  // =========================================================================
  // KHỐI 6: GOM CHỈ TIÊU & TẠO HỒ SƠ NHẬT KÝ - TẠO HỒ SƠ NK (TC_GV_026 -> TC_GV_030)
  // =========================================================================

  test('TC_GV_026: Kiểm tra cảnh báo chặn tạo hồ sơ khi tích chọn chỉ tiêu chưa gán KNV ("— chưa gán —") và nhấn Xác nhận tạo hồ sơ NK (Ảnh 2)', async ({
    taskAssignmentPage,
  }) => {
    await taskAssignmentPage.uncheckAllCriteria();

    const unassignedRow = taskAssignmentPage.ctRows
      .filter({ hasText: '— chưa gán —' })
      .first();
    await expect(unassignedRow).toBeVisible();

    await unassignedRow.locator('input.cb').check();
    await expect(taskAssignmentPage.btnTaoHoSoNK).toBeEnabled();

    await taskAssignmentPage.btnTaoHoSoNK.click();
    await expect(taskAssignmentPage.nkModal).toBeVisible();

    // Nhấn nút "Xác nhận tạo 1 hồ sơ NK" khi chỉ tiêu chưa gán KNV
    await taskAssignmentPage.btnNkConfirm.click();

    // Kiểm tra hiển thị cảnh báo đỏ chặn tạo hồ sơ như Ảnh 2
    await expect(taskAssignmentPage.nkModalAlert).toBeVisible();
    await expect(taskAssignmentPage.nkModalAlert).toContainText(
      'Không thể tạo hồ sơ: Phát hiện 1 chỉ tiêu chưa được phân công Kiểm nghiệm viên. Vui lòng kiểm tra các nhóm đánh dấu đỏ bên dưới.'
    );
    const errorGroup = taskAssignmentPage.nkGroups.first();
    await expect(errorGroup).toHaveClass(/has-error/);
    await expect(errorGroup.locator('.nk-badge-error')).toContainText('Chưa gán KNV');
    await expect(errorGroup.locator('.nk-item.item-error')).toBeVisible();
    await expect(taskAssignmentPage.btnNkConfirm).toBeDisabled();

    // Đóng hộp thoại và bỏ tích
    await taskAssignmentPage.btnNkCancel.click();
    await expect(taskAssignmentPage.nkModal).toHaveCount(0);
    await taskAssignmentPage.uncheckAllCriteria();
  });

  test('TC_GV_027: Kiểm tra nguyên tắc gộp chung vào 1 hồ sơ NK khi tích chọn 2 chỉ tiêu có cùng Mã/Tên chỉ tiêu và cùng KNV', async ({
    taskAssignmentPage,
  }) => {
    await taskAssignmentPage.uncheckAllCriteria();

    // Tìm 1 tên chỉ tiêu xuất hiện ít nhất 2 lần ở trạng thái chưa khóa checkbox
    const duplicateInfo = await taskAssignmentPage.page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('.gviec-body table.ct-table tbody tr'));
      const map = new Map<string, number[]>();
      rows.forEach((tr, idx) => {
        const cb = tr.querySelector('input.cb') as HTMLInputElement | null;
        const hsGreen = tr.querySelector('.hs-green');
        const nameEl = tr.querySelector('.ct-name');
        if (cb && !cb.disabled && !hsGreen && nameEl) {
          const name = nameEl.textContent?.trim() || '';
          if (name) {
            const arr = map.get(name) || [];
            arr.push(idx);
            map.set(name, arr);
          }
        }
      });
      for (const [name, indices] of map.entries()) {
        if (indices.length >= 2) {
          return { name, idx1: indices[0], idx2: indices[1] };
        }
      }
      return null;
    });

    expect(duplicateInfo).not.toBeNull();
    const row1 = taskAssignmentPage.ctRows.nth(duplicateInfo!.idx1);
    const row2 = taskAssignmentPage.ctRows.nth(duplicateInfo!.idx2);

    // Đảm bảo cả 2 dòng chỉ tiêu cùng gán cho 1 KNV ("Admin User")
    await taskAssignmentPage.selectKnvForRow(row1, 'Admin User');
    if (await taskAssignmentPage.reassignModal.isVisible()) {
      await taskAssignmentPage.btnReassignConfirm.click();
    }
    await taskAssignmentPage.selectKnvForRow(row2, 'Admin User');
    if (await taskAssignmentPage.reassignModal.isVisible()) {
      await taskAssignmentPage.btnReassignConfirm.click();
    }

    // Tích chọn cả 2 dòng chỉ tiêu trùng tên + trùng KNV
    await row1.locator('input.cb').check();
    await row2.locator('input.cb').check();

    await taskAssignmentPage.btnTaoHoSoNK.click();
    await expect(taskAssignmentPage.nkModal).toBeVisible();

    // Kiểm tra tự động gom chung 2 chỉ tiêu vào 1 hồ sơ NK duy nhất
    await expect(taskAssignmentPage.nkModalInfo).toContainText(
      'Gom 2 chỉ tiêu được chọn vào 1 hồ sơ NK.'
    );
    await expect(taskAssignmentPage.nkGroups).toHaveCount(1);
    await expect(taskAssignmentPage.nkGroups.first().locator('.nk-count')).toHaveText('2 mẫu');
    await expect(taskAssignmentPage.btnNkConfirm).toContainText('Xác nhận tạo 1 hồ sơ NK');

    await taskAssignmentPage.btnNkCancel.click();
    await taskAssignmentPage.uncheckAllCriteria();
  });

  test('TC_GV_028: Kiểm tra nguyên tắc tách riêng nhiều hồ sơ NK khi tích chọn 2 chỉ tiêu khác tên chỉ tiêu hoặc khác KNV', async ({
    taskAssignmentPage,
  }) => {
    await taskAssignmentPage.uncheckAllCriteria();

    // Tìm 2 dòng chỉ tiêu có tên chỉ tiêu khác nhau
    const diffIndices = await taskAssignmentPage.page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('.gviec-body table.ct-table tbody tr'));
      let firstIdx = -1;
      let firstName = '';
      for (let i = 0; i < rows.length; i++) {
        const cb = rows[i].querySelector('input.cb') as HTMLInputElement | null;
        const name = rows[i].querySelector('.ct-name')?.textContent?.trim() || '';
        if (cb && !cb.disabled && name) {
          if (firstIdx === -1) {
            firstIdx = i;
            firstName = name;
          } else if (name !== firstName) {
            return { idx1: firstIdx, idx2: i };
          }
        }
      }
      return null;
    });

    expect(diffIndices).not.toBeNull();
    const row1 = taskAssignmentPage.ctRows.nth(diffIndices!.idx1);
    const row2 = taskAssignmentPage.ctRows.nth(diffIndices!.idx2);

    await row1.locator('input.cb').check();
    await row2.locator('input.cb').check();

    await taskAssignmentPage.btnTaoHoSoNK.click();
    await expect(taskAssignmentPage.nkModal).toBeVisible();

    // Kiểm tra tách thành 2 hồ sơ NK riêng biệt
    await expect(taskAssignmentPage.nkModalInfo).toContainText(
      'Gom 2 chỉ tiêu được chọn vào 2 hồ sơ NK.'
    );
    await expect(taskAssignmentPage.nkGroups).toHaveCount(2);
    await expect(taskAssignmentPage.btnNkConfirm).toContainText('Xác nhận tạo 2 hồ sơ NK');

    await taskAssignmentPage.btnNkCancel.click();
    await taskAssignmentPage.uncheckAllCriteria();
  });

  test('TC_GV_029: Kiểm tra hiển thị cảnh báo tách hồ sơ cũ (.nk-modal-warning) khi tích chọn chỉ tiêu đang nằm trong hồ sơ nhật ký khác (Đang làm NK)', async ({
    taskAssignmentPage,
  }) => {
    await taskAssignmentPage.uncheckAllCriteria();

    const redRow = taskAssignmentPage.ctRows
      .filter({ has: taskAssignmentPage.page.locator('.hs-red') })
      .first();
    await expect(redRow).toBeVisible();

    await redRow.locator('input.cb').check();
    await taskAssignmentPage.btnTaoHoSoNK.click();

    await expect(taskAssignmentPage.nkModal).toBeVisible();
    await expect(taskAssignmentPage.nkModalWarning).toBeVisible();
    await expect(taskAssignmentPage.nkModalWarning).toContainText(
      'Trong các chỉ tiêu được chọn, có 1 chỉ tiêu đang nằm trong hồ sơ nhật ký khác. Việc tạo hồ sơ mới sẽ tách các chỉ tiêu này khỏi hồ sơ cũ để làm lại từ đầu.'
    );

    await taskAssignmentPage.btnNkCancel.click();
    await expect(taskAssignmentPage.nkModal).toHaveCount(0);
    await taskAssignmentPage.uncheckAllCriteria();
  });

  test('TC_GV_030: Tạo mới Hồ sơ Nhật ký thành công cho chỉ tiêu đã gán KNV (chỉnh sửa Số mẫu lặp và kiểm tra cột HS chuyển sang Đang làm NK)', async ({
    taskAssignmentPage,
  }) => {
    await taskAssignmentPage.uncheckAllCriteria();

    // Cố định index của 1 dòng chỉ tiêu chưa có hồ sơ (.hs-none)
    const rowIdx = await taskAssignmentPage.findCriterionRowIndex({ hsClass: 'hs-none' });
    expect(rowIdx).toBeGreaterThanOrEqual(0);
    const targetRow = taskAssignmentPage.ctRows.nth(rowIdx);
    await expect(targetRow).toBeVisible();

    // Đảm bảo dòng đó đã được gán KNV ("Admin User")
    const currentKnv = (await targetRow.locator('.knv-select-search').innerText()).trim();
    if (currentKnv.includes('chưa gán')) {
      await taskAssignmentPage.selectKnvForRow(targetRow, 'Admin User');
    }

    await targetRow.locator('input.cb').check();
    await taskAssignmentPage.btnTaoHoSoNK.click();
    await expect(taskAssignmentPage.nkModal).toBeVisible();

    // Chỉnh sửa Số mẫu lặp thành 3
    const replicateInput = taskAssignmentPage.nkModal.locator('input.nk-replicate-input').first();
    await expect(replicateInput).toBeVisible();
    await replicateInput.fill('3');
    await expect(replicateInput).toHaveValue('3');

    // Nhấn Xác nhận tạo 1 hồ sơ NK
    await taskAssignmentPage.btnNkConfirm.click();
    await expect(taskAssignmentPage.nkModal).toHaveCount(0);

    // Kiểm tra chấm trạng thái cột HS trên dòng chỉ tiêu chuyển sang màu đỏ (.hs-red "Đang làm NK")
    await expect(targetRow.locator('.hs-red')).toBeVisible({ timeout: 5000 });
  });
});

