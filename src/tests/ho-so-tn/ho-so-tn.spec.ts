import { test, expect } from '../../fixtures/base.fixture';
import { Logger } from '../../utils/logger';
import users from '../../../test-data/users.json';

test.describe('Module Hồ sơ TN (/ho-so-tn) - Hệ thống VNTEST LIMS', () => {
  test.beforeEach(async ({ loginPage, hoSoTnPage, page }) => {
    Logger.step('Setup', 'Đăng nhập vào hệ thống và điều hướng tới màn hình Hồ sơ TN');
    await loginPage.open('/dang-nhap');
    await loginPage.login(users.validUser.username, users.validUser.password);
    await page.waitForURL('https://vntest-lims.pirago.work/', { timeout: 15000 });

    await hoSoTnPage.open('/ho-so-tn');
    await expect(hoSoTnPage.tabHoSoTN).toBeVisible({ timeout: 15000 });
    await expect(hoSoTnPage.table).toBeVisible({ timeout: 15000 });
  });

  // ==========================================
  // KHỐI 01: BỐ CỤC & HIỂN THỊ GIAO DIỆN
  // ==========================================

  test('TC_HSTN_001: Hiển thị đầy đủ 4 tab điều hướng Header, nút tiện ích, 4 chip trạng thái và bộ lọc bộ phận', {
    tag: ['@smoke', '@high', '@critical']
  }, async ({ hoSoTnPage }) => {
    Logger.step(1, 'Kiểm tra 4 tab điều hướng trên Header và tab "HỒ SƠ TN" đang active');
    await expect(hoSoTnPage.tabGiaoViec).toBeVisible();
    await expect(hoSoTnPage.tabHoSoTN).toBeVisible();
    await expect(hoSoTnPage.tabHoSoTN).toHaveClass(/active/);
    await expect(hoSoTnPage.tabTruongBPKtra).toBeVisible();
    await expect(hoSoTnPage.tabQlyCTTinh).toBeVisible();

    Logger.step(2, 'Kiểm tra 3 nút tiện ích trên thanh Header (Print, Import, Export)');
    await expect(hoSoTnPage.btnPrint).toBeVisible();
    await expect(hoSoTnPage.btnImport).toBeVisible();
    await expect(hoSoTnPage.btnExport).toBeVisible();

    Logger.step(3, 'Kiểm tra 4 chip trạng thái và bộ chọn Bộ phận');
    await expect(hoSoTnPage.chipDangTH).toBeVisible();
    await expect(hoSoTnPage.chipDaHT).toBeVisible();
    await expect(hoSoTnPage.chipChoDuyet).toBeVisible();
    await expect(hoSoTnPage.chipTraLai).toBeVisible();
    await expect(hoSoTnPage.bpFilterTrigger).toBeVisible();
  });

  test('TC_HSTN_002: Hiển thị đúng 6 cột tiêu đề của bảng danh sách hồ sơ bên trái', {
    tag: ['@smoke', '@normal', '@minor']
  }, async ({ hoSoTnPage }) => {
    Logger.step(1, 'Kiểm tra các cột tiêu đề của bảng danh sách hồ sơ');
    const headers = await hoSoTnPage.tableHeaders.allInnerTexts();
    const cleanHeaders = headers.map(h => h.replace(/\n|⋮/g, ' ').trim());

    expect(cleanHeaders[0]).toBe(''); // Checkbox
    expect(cleanHeaders[1]).toContain('MÃ HS / MÃ PKQ');
    expect(cleanHeaders[2]).toContain('NỀN MẪU / CHỈ TIÊU');
    expect(cleanHeaders[3]).toContain('NGÀY TH / NGÀY TKQ');
    expect(cleanHeaders[4]).toContain('TT / SL');
    expect(cleanHeaders[5]).toContain('BP PHÂN TÍCH');
  });

  test('TC_HSTN_003: Hiển thị khung chi tiết bên phải khi chọn hồ sơ', {
    tag: ['@smoke', '@normal', '@major']
  }, async ({ hoSoTnPage }) => {
    Logger.step(1, 'Chọn hồ sơ đầu tiên trong bảng');
    await hoSoTnPage.selectRow(0);

    Logger.step('Verify', 'Khung chi tiết bên phải hiển thị đầy đủ các thành phần');
    await expect(hoSoTnPage.detailContainer).toBeVisible();
    await expect(hoSoTnPage.formulaSelect).toBeVisible();
    await expect(hoSoTnPage.chemicalTable).toBeVisible();
    await expect(hoSoTnPage.sampleTable).toBeVisible();
    await expect(hoSoTnPage.btnBlank).toBeVisible();
    await expect(hoSoTnPage.btnQC).toBeVisible();
    await expect(hoSoTnPage.btnTC).toBeVisible();
    await expect(hoSoTnPage.btnThemMau).toBeVisible();
  });

  // ==========================================
  // KHỐI 02: LUỒNG LIÊN KẾT GIAO VIỆC ➔ HỒ SƠ TN (E2E)
  // ==========================================

  test('TC_HSTN_004: Giao việc 1 chỉ tiêu đơn lẻ tại tab Giao việc ➔ Hiển thị bản ghi mới tại tab Hồ sơ TN', {
    tag: ['@high', '@critical']
  }, async ({ taskAssignmentPage, hoSoTnPage, page }) => {
    Logger.step(1, 'Điều hướng sang tab Giao việc');
    await hoSoTnPage.tabGiaoViec.click();
    await expect(page).toHaveURL(/.*\/giao-viec/);

    Logger.step(2, 'Tìm chỉ tiêu chưa gán hoặc gán KNV cho chỉ tiêu đầu tiên');
    const targetRow = taskAssignmentPage.ctRows.first();
    const currentKnv = await targetRow.locator('td').nth(7).innerText();
    if (currentKnv.includes('chưa gán')) {
      await taskAssignmentPage.selectKnvForRow(targetRow, 'Admin User');
    }

    Logger.step(3, 'Tích chọn chỉ tiêu và tạo hồ sơ NK');
    await targetRow.locator('input.cb').check();
    await expect(taskAssignmentPage.btnTaoHoSoNK).toBeEnabled();
    await taskAssignmentPage.btnTaoHoSoNK.click();
    await expect(taskAssignmentPage.nkModal).toBeVisible();

    Logger.step(4, 'Xác nhận tạo hồ sơ');
    await taskAssignmentPage.btnNkConfirm.click();
    await expect(taskAssignmentPage.nkModal).toHaveCount(0);

    Logger.step(5, 'Chuyển sang tab Hồ sơ TN để kiểm tra');
    await taskAssignmentPage.tabHoSoTN.click();
    await expect(page).toHaveURL(/.*\/ho-so-tn/);

    Logger.step('Verify', 'Bản ghi hồ sơ mới tạo hiển thị ở đầu bảng bên trái');
    const firstHsRow = hoSoTnPage.tableRows.first();
    await expect(firstHsRow).toBeVisible();
    await expect(firstHsRow).toContainText('HS-');
    await expect(firstHsRow).toContainText('Đang TH');
  });

  test('TC_HSTN_005: Giao việc gom nhóm 2 chỉ tiêu cùng tên + cùng KNV ➔ Gom chung 1 hồ sơ 2 mẫu tại tab Hồ sơ TN', {
    tag: ['@high', '@major']
  }, async ({ taskAssignmentPage, hoSoTnPage, page }) => {
    Logger.step(1, 'Điều hướng sang tab Giao việc');
    await hoSoTnPage.tabGiaoViec.click();
    await expect(page).toHaveURL(/.*\/giao-viec/);

    Logger.step(2, 'Tìm 2 chỉ tiêu trùng tên và cùng KNV');
    const pair = await taskAssignmentPage.page.evaluate(() => {
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
    test.skip(!pair, 'Không có 2 chỉ tiêu trùng tên trong dữ liệu hiện tại để gom nhóm');

    const row1 = taskAssignmentPage.ctRows.nth(pair!.idx1);
    const row2 = taskAssignmentPage.ctRows.nth(pair!.idx2);

    await row1.locator('input.cb').check();
    await row2.locator('input.cb').check();
    await taskAssignmentPage.btnTaoHoSoNK.click();
    await expect(taskAssignmentPage.nkModal).toBeVisible();

    Logger.step(3, 'Xác nhận gom chung vào 1 hồ sơ');
    await expect(taskAssignmentPage.nkModalInfo).toContainText('Gom 2 chỉ tiêu được chọn vào 1 hồ sơ NK');
    await taskAssignmentPage.btnNkConfirm.click();
    await expect(taskAssignmentPage.nkModal).toHaveCount(0);

    Logger.step(4, 'Chuyển sang tab Hồ sơ TN và kiểm tra số lượng mẫu');
    await taskAssignmentPage.tabHoSoTN.click();
    await hoSoTnPage.selectRow(0);

    const firstRow = hoSoTnPage.tableRows.first();
    await expect(firstRow).toContainText('2 mẫu');
  });

  test('TC_HSTN_006: Giao việc chỉ tiêu chưa gán KNV ➔ Chặn không sinh hồ sơ sang Hồ sơ TN', {
    tag: ['@normal', '@major']
  }, async ({ taskAssignmentPage, hoSoTnPage, page }) => {
    Logger.step(1, 'Lấy tổng số lượng hồ sơ hiện tại ở tab Hồ sơ TN');
    const initialCount = await hoSoTnPage.tableRows.count();

    Logger.step(2, 'Sang tab Giao việc và chọn chỉ tiêu chưa gán KNV');
    await hoSoTnPage.tabGiaoViec.click();
    await expect(page).toHaveURL(/.*\/giao-viec/);

    const unassignedRow = taskAssignmentPage.ctRows
      .filter({ hasText: '— chưa gán —' })
      .first();
    test.skip(await unassignedRow.count() === 0, 'Không có chỉ tiêu nào ở trạng thái chưa gán KNV');

    await unassignedRow.locator('input.cb').check();
    await taskAssignmentPage.btnTaoHoSoNK.click();
    await expect(taskAssignmentPage.nkModal).toBeVisible();

    Logger.step(3, 'Nhấn xác nhận tạo và kiểm tra cảnh báo chặn');
    await taskAssignmentPage.btnNkConfirm.click();
    await expect(taskAssignmentPage.nkModalAlert).toBeVisible();
    await expect(taskAssignmentPage.nkModalAlert).toContainText('Không thể tạo hồ sơ: Phát hiện 1 chỉ tiêu chưa được phân công');

    Logger.step(4, 'Đóng hộp thoại và quay lại tab Hồ sơ TN');
    await taskAssignmentPage.btnNkCancel.click();
    await taskAssignmentPage.tabHoSoTN.click();

    Logger.step('Verify', 'Số lượng hồ sơ bên tab Hồ sơ TN không bị thay đổi');
    const currentCount = await hoSoTnPage.tableRows.count();
    expect(currentCount).toBe(initialCount);
  });

  // ==========================================
  // KHỐI 03: TƯƠNG TÁC DANH SÁCH HỒ SƠ
  // ==========================================

  test('TC_HSTN_007: Chọn hồ sơ bên bảng trái để tải chi tiết tương ứng bên khung phải', {
    tag: ['@high', '@major']
  }, async ({ hoSoTnPage }) => {
    Logger.step(1, 'Nhấn chọn dòng hồ sơ đầu tiên');
    await hoSoTnPage.selectRow(0);
    const hsCode1 = await hoSoTnPage.tableRows.nth(0).locator('td').nth(1).innerText();

    Logger.step(2, 'Nhấn chuyển sang dòng hồ sơ thứ hai');
    if (await hoSoTnPage.tableRows.count() > 1) {
      await hoSoTnPage.selectRow(1);
      const hsCode2 = await hoSoTnPage.tableRows.nth(1).locator('td').nth(1).innerText();
      expect(hsCode1).not.toBe(hsCode2);
    }
  });

  test('TC_HSTN_008: Chuyển trang (Pagination) trên bảng danh sách hồ sơ', {
    tag: ['@normal', '@minor']
  }, async ({ hoSoTnPage }) => {
    Logger.step(1, 'Kiểm tra nếu có trang 2 thì chuyển sang trang 2');
    const page2Btn = hoSoTnPage.paginationPageBtns.filter({ hasText: '2' });
    if (await page2Btn.count() > 0) {
      await page2Btn.click();
      await expect(page2Btn).toHaveClass(/active/);
      await expect(hoSoTnPage.tableRows.first()).toBeVisible();
    }
  });

  test('TC_HSTN_009: Quản lý ẩn/hiện cột hiển thị bằng nút "Quản lý cột"', {
    tag: ['@low', '@minor']
  }, async ({ hoSoTnPage }) => {
    Logger.step(1, 'Nhấn nút "Quản lý cột"');
    await hoSoTnPage.btnManageColumns.click();

    Logger.step('Verify', 'Popover quản lý cột hiển thị');
    const popover = hoSoTnPage.page.locator('.popover, .dropdown-menu, .px-column-manager-menu').first();
    await expect(popover).toBeVisible();

    Logger.step(2, 'Đóng lại popover');
    await hoSoTnPage.page.keyboard.press('Escape');
  });

  // ==========================================
  // KHỐI 04: BỘ LỌC & TÌM KIẾM HỒ SƠ (SEARCH & FILTERS)
  // ==========================================

  test('TC_HSTN_010: Tìm kiếm chính xác theo Mã hồ sơ', {
    tag: ['@smoke', '@high', '@major']
  }, async ({ hoSoTnPage }) => {
    Logger.step(1, 'Lấy mã hồ sơ của dòng đầu tiên');
    const fullText = await hoSoTnPage.tableRows.first().locator('td').nth(1).innerText();
    const hsCode = fullText.split('\n')[0].trim();

    Logger.step(2, 'Tìm kiếm theo mã hồ sơ');
    await hoSoTnPage.search(hsCode);

    Logger.step('Verify', 'Bảng chỉ hiển thị các dòng chứa mã hồ sơ đó');
    const count = await hoSoTnPage.tableRows.count();
    expect(count).toBeGreaterThan(0);
    await expect(hoSoTnPage.tableRows.first()).toContainText(hsCode);
  });

  test('TC_HSTN_011: Tìm kiếm theo Tên chỉ tiêu', {
    tag: ['@high', '@major']
  }, async ({ hoSoTnPage }) => {
    Logger.step(1, 'Tìm kiếm từ khóa "Protein"');
    await hoSoTnPage.search('Protein');

    Logger.step('Verify', 'Các hồ sơ hiển thị đều có chứa từ khóa hoặc danh sách trống hợp lệ');
    const count = await hoSoTnPage.tableRows.count();
    if (count > 0) {
      await expect(hoSoTnPage.tableRows.first()).toContainText(/Protein/i);
    }
  });

  test('TC_HSTN_012: Tìm kiếm với từ khóa không tồn tại', {
    tag: ['@normal', '@minor']
  }, async ({ hoSoTnPage }) => {
    Logger.step(1, 'Tìm kiếm chuỗi không tồn tại');
    await hoSoTnPage.search('@@@ZZZ999_KHONG_TON_TAI');

    Logger.step('Verify', 'Bảng không có dòng nào');
    await expect(hoSoTnPage.tableRows).toHaveCount(0);
  });

  test('TC_HSTN_013: Xóa tìm kiếm và bộ lọc bằng nút "Hủy"', {
    tag: ['@smoke', '@normal', '@minor']
  }, async ({ hoSoTnPage }) => {
    Logger.step(1, 'Nhập từ khóa tìm kiếm để nút Hủy kích hoạt');
    await hoSoTnPage.search('HS-2026');
    await expect(hoSoTnPage.btnClearFilter).toBeEnabled();

    Logger.step(2, 'Nhấn nút "Hủy"');
    await hoSoTnPage.clearFilter();

    Logger.step('Verify', 'Ô tìm kiếm được xóa và nút Hủy trở về disabled');
    await expect(hoSoTnPage.searchInput).toHaveValue('');
    await expect(hoSoTnPage.btnClearFilter).toBeDisabled();
  });

  test('TC_HSTN_014: Lọc theo Chip trạng thái "Đang TH"', {
    tag: ['@smoke', '@high', '@major']
  }, async ({ hoSoTnPage }) => {
    Logger.step(1, 'Nhấn chip "Đang TH"');
    await hoSoTnPage.chipDangTH.click();

    Logger.step('Verify', 'Toàn bộ các dòng đều có trạng thái "Đang TH"');
    const count = await hoSoTnPage.tableRows.count();
    for (let i = 0; i < count; i++) {
      await expect(hoSoTnPage.tableRows.nth(i)).toContainText('Đang TH');
    }
  });

  test('TC_HSTN_015: Lọc theo Chip trạng thái "Đã HT"', {
    tag: ['@normal', '@major']
  }, async ({ hoSoTnPage }) => {
    Logger.step(1, 'Nhấn chip "Đã HT"');
    await hoSoTnPage.chipDaHT.click();

    Logger.step('Verify', 'Toàn bộ các dòng đều có trạng thái "Đã HT"');
    const count = await hoSoTnPage.tableRows.count();
    for (let i = 0; i < count; i++) {
      await expect(hoSoTnPage.tableRows.nth(i)).toContainText('Đã HT');
    }
  });

  test('TC_HSTN_016: Lọc theo Bộ phận phân tích', {
    tag: ['@normal', '@major']
  }, async ({ hoSoTnPage }) => {
    Logger.step(1, 'Nhấn bộ chọn Bộ phận');
    await hoSoTnPage.bpFilterTrigger.click();

    const popover = hoSoTnPage.page.locator('.popover, .dropdown-menu').first();
    await expect(popover).toBeVisible();

    Logger.step(2, 'Đóng lại popover');
    await hoSoTnPage.page.keyboard.press('Escape');
  });

  test('TC_HSTN_017: Kết hợp tìm kiếm từ khóa với Chip trạng thái "Đang TH"', {
    tag: ['@high', '@major']
  }, async ({ hoSoTnPage }) => {
    Logger.step(1, 'Lọc chip "Đang TH"');
    await hoSoTnPage.chipDangTH.click();

    Logger.step(2, 'Tìm kiếm từ khóa "HS"');
    await hoSoTnPage.search('HS');

    Logger.step('Verify', 'Các bản ghi vừa là "Đang TH" vừa chứa "HS"');
    const count = await hoSoTnPage.tableRows.count();
    for (let i = 0; i < count; i++) {
      await expect(hoSoTnPage.tableRows.nth(i)).toContainText('Đang TH');
      await expect(hoSoTnPage.tableRows.nth(i)).toContainText('HS');
    }
  });

  // ==========================================
  // KHỐI 05: KHUNG CHI TIẾT & BỘ 3 NÚT LƯU, GỬI DUYỆT, HỦY HS
  // ==========================================

  test('TC_HSTN_018: Chọn công thức tính từ dropdown và kiểm tra bảng kết quả sinh động các cột tham số', {
    tag: ['@smoke', '@high', '@critical']
  }, async ({ hoSoTnPage }) => {
    Logger.step(1, 'Lọc hồ sơ Đang TH và chọn dòng đầu tiên');
    await hoSoTnPage.chipDangTH.click();
    await hoSoTnPage.selectRow(0);

    Logger.step(2, 'Chọn công thức tính đầu tiên trong danh sách');
    const optionsCount = await hoSoTnPage.formulaSelect.locator('option').count();
    if (optionsCount > 1) {
      await hoSoTnPage.selectFormula(1);

      Logger.step('Verify', 'Bảng mẫu thử nghiệm hiển thị cột KẾT QUẢ TÍNH');
      await expect(hoSoTnPage.sampleTable.locator('thead')).toContainText(/KẾT QUẢ TÍNH/i);
    }
  });

  test('TC_HSTN_019: Thêm các dòng mẫu kiểm chuẩn (+ Blank, + QC, + TC) vào bảng mẫu', {
    tag: ['@high', '@major']
  }, async ({ hoSoTnPage }) => {
    Logger.step(1, 'Chọn hồ sơ Đang TH');
    await hoSoTnPage.chipDangTH.click();
    await hoSoTnPage.selectRow(0);

    Logger.step(2, 'Nhấn lần lượt 3 nút kiểm chuẩn');
    await hoSoTnPage.addBlankSample();
    await hoSoTnPage.addQCSample();
    await hoSoTnPage.addTCSample();

    Logger.step('Verify', 'Bảng mẫu xuất hiện 3 dòng BLANK, QC, TC');
    await expect(hoSoTnPage.sampleTable.locator('tbody tr', { hasText: 'BLANK' })).toBeVisible();
    await expect(hoSoTnPage.sampleTable.locator('tbody tr', { hasText: 'QC' })).toBeVisible();
    await expect(hoSoTnPage.sampleTable.locator('tbody tr', { hasText: 'TC' })).toBeVisible();
  });

  test('TC_HSTN_020: Kiểm tra trạng thái kích hoạt của nút "Lưu" khi thay đổi thông số thử nghiệm', {
    tag: ['@high', '@major']
  }, async ({ hoSoTnPage }) => {
    Logger.step(1, 'Chọn hồ sơ Đang TH');
    await hoSoTnPage.chipDangTH.click();
    await hoSoTnPage.selectRow(0);

    Logger.step(2, 'Kiểm tra ban đầu nút Lưu bị vô hiệu hóa');
    await expect(hoSoTnPage.btnSave).toHaveClass(/disabled/);

    Logger.step(3, 'Nhập giá trị vào ô thông số thử nghiệm');
    const inputs = hoSoTnPage.sampleTable.locator('input.hs-inp.mono, input[placeholder="…"]');
    if (await inputs.count() > 0) {
      await inputs.first().fill('12.5');

      Logger.step('Verify', 'Nút Lưu chuyển sang trạng thái kích hoạt');
      await expect(hoSoTnPage.btnSave).not.toHaveClass(/disabled/);
    }
  });

  test('TC_HSTN_021: Thực hiện Lưu kết quả hồ sơ thành công', {
    tag: ['@high', '@critical']
  }, async ({ hoSoTnPage }) => {
    Logger.step(1, 'Chọn hồ sơ Đang TH và nhập thông số để kích hoạt nút Lưu');
    await hoSoTnPage.chipDangTH.click();
    await hoSoTnPage.selectRow(0);

    const inputs = hoSoTnPage.sampleTable.locator('input.hs-inp.mono, input[placeholder="…"]');
    if (await inputs.count() > 0) {
      await inputs.first().fill('10');
      await expect(hoSoTnPage.btnSave).not.toHaveClass(/disabled/);

      Logger.step(2, 'Nhấn nút "Lưu"');
      await hoSoTnPage.clickSave();

      Logger.step('Verify', 'Sau khi lưu, nút Lưu trở về trạng thái vô hiệu hóa');
      await expect(hoSoTnPage.btnSave).toHaveClass(/disabled/);
    }
  });

  test('TC_HSTN_022: Kiểm tra trạng thái và tooltip nút "Gửi duyệt" (chưa tích checkbox vs đã tích checkbox)', {
    tag: ['@smoke', '@high', '@major']
  }, async ({ hoSoTnPage }) => {
    Logger.step(1, 'Khi chưa tích chọn checkbox, nút Gửi duyệt bị vô hiệu hóa kèm tooltip nhắc nhở');
    await expect(hoSoTnPage.btnSubmit).toBeDisabled();
    await expect(hoSoTnPage.btnSubmit).toHaveAttribute('title', /Vui lòng chọn ít nhất một hồ sơ/i);

    Logger.step(2, 'Lọc hồ sơ Đang TH và tích chọn dòng đầu tiên');
    await hoSoTnPage.chipDangTH.click();
    await hoSoTnPage.checkRowCheckbox(0);

    Logger.step('Verify', 'Nút Gửi duyệt chuyển sang sáng màu xanh (enabled)');
    await expect(hoSoTnPage.btnSubmit).toBeEnabled();
    await expect(hoSoTnPage.btnSubmit).toHaveAttribute('title', 'Gửi duyệt');

    Logger.step(3, 'Bỏ tích chọn checkbox');
    await hoSoTnPage.uncheckRowCheckbox(0);
    await expect(hoSoTnPage.btnSubmit).toBeDisabled();
  });

  test('TC_HSTN_023: Kiểm tra nút "Hủy HS" mở hộp thoại xác nhận hủy và hủy thao tác bằng nút "Đóng"', {
    tag: ['@smoke', '@high', '@major']
  }, async ({ hoSoTnPage }) => {
    Logger.step(1, 'Khi chưa tích chọn checkbox, nút Hủy HS bị vô hiệu hóa');
    await expect(hoSoTnPage.btnCancelHS).toBeDisabled();

    Logger.step(2, 'Tích chọn dòng đầu tiên');
    await hoSoTnPage.checkRowCheckbox(0);
    await expect(hoSoTnPage.btnCancelHS).toBeEnabled();

    Logger.step(3, 'Nhấn nút "Hủy HS" để mở hộp thoại xác nhận');
    await hoSoTnPage.clickCancelHS();

    Logger.step('Verify', 'Hộp thoại hiển thị đúng tiêu đề và thông điệp cảnh báo');
    await expect(hoSoTnPage.cancelModal).toBeVisible();
    await expect(hoSoTnPage.cancelModal).toContainText('Xác nhận hủy hồ sơ thử nghiệm');
    await expect(hoSoTnPage.cancelModal).toContainText('Hành động này sẽ giải phóng chỉ tiêu');

    Logger.step(4, 'Nhấn nút "Đóng" để đóng hộp thoại mà không hủy');
    await hoSoTnPage.btnModalClose.click();
    await expect(hoSoTnPage.cancelModal).toHaveCount(0);

    Logger.step(5, 'Bỏ tích checkbox');
    await hoSoTnPage.uncheckRowCheckbox(0);
  });

  // ==========================================
  // KHỐI 06: ĐIỀU HƯỚNG HEADER TABS
  // ==========================================

  test('TC_HSTN_024: Điều hướng qua lại giữa tab "GIAO VIỆC" và "HỒ SƠ TN"', {
    tag: ['@smoke', '@high', '@minor']
  }, async ({ hoSoTnPage, page }) => {
    Logger.step(1, 'Nhấn tab "GIAO VIỆC"');
    await hoSoTnPage.tabGiaoViec.click();
    await expect(page).toHaveURL(/.*\/giao-viec/);
    await expect(hoSoTnPage.tabGiaoViec).toHaveClass(/active/);

    Logger.step(2, 'Nhấn lại tab "HỒ SƠ TN"');
    await hoSoTnPage.tabHoSoTN.click();
    await expect(page).toHaveURL(/.*\/ho-so-tn/);
    await expect(hoSoTnPage.tabHoSoTN).toHaveClass(/active/);
  });
});
