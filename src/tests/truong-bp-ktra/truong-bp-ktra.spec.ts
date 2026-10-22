import { test, expect } from '../../fixtures/base.fixture';
import { Logger } from '../../utils/logger';
import users from '../../../test-data/users.json';

test.describe('Module Trưởng BP Kiểm tra (/truong-bo-phan-kiem-tra) - Hệ thống VNTEST LIMS', () => {
  test.beforeEach(async ({ loginPage, truongBpKtraPage, page }) => {
    Logger.step('Setup', 'Đăng nhập vào hệ thống và điều hướng tới màn hình Trưởng BP kiểm tra');
    await loginPage.open('/dang-nhap');
    await loginPage.login(users.validUser.username, users.validUser.password);
    await page.waitForURL('https://vntest-lims.pirago.work/', { timeout: 15000 });

    await truongBpKtraPage.open('/truong-bo-phan-kiem-tra');
    await expect(truongBpKtraPage.tabTruongBPKtra).toBeVisible({ timeout: 15000 });
    await expect(truongBpKtraPage.hsTable).toBeVisible({ timeout: 15000 });
  });

  // =========================================================================
  // KHỐI 01: THÔNG TIN KẾT QUẢ (TOP SECTION)
  // =========================================================================

  test('TC_TBP_001: Hiển thị khối THÔNG TIN KẾT QUẢ, thông tin YCTN, thẻ mẫu và tiến độ chỉ tiêu', {
    tag: ['@smoke', '@critical']
  }, async ({ truongBpKtraPage }) => {
    Logger.step(1, 'Kiểm tra khối tiêu đề "THÔNG TIN KẾT QUẢ"');
    await expect(truongBpKtraPage.ttkqSection).toBeVisible();

    Logger.step(2, 'Kiểm tra hiển thị thông tin YCTN trên thanh Accordion');
    await expect(truongBpKtraPage.yctnAccordionHead).toBeVisible();
    const yctnText = await truongBpKtraPage.yctnAccordionHead.innerText();
    expect(yctnText).toMatch(/TR\d+/i);
    expect(yctnText).toContain('mẫu');

    Logger.step(3, 'Kiểm tra thông tin thẻ mẫu chi tiết (Mã mẫu, Nền mẫu, Tiến độ chỉ tiêu)');
    await expect(truongBpKtraPage.sampleBadgeM1).toBeVisible();
    await expect(truongBpKtraPage.sampleCodeText).toBeVisible();
  });

  test('TC_TBP_002: Kiểm tra thao tác đóng/mở (accordion) thẻ YCTN', {
    tag: ['@normal']
  }, async ({ truongBpKtraPage, page }) => {
    Logger.step(1, 'Kiểm tra bảng chỉ tiêu hiển thị ban đầu');
    await expect(truongBpKtraPage.ctTable).toBeVisible();

    Logger.step(2, 'Nhấn vào thanh tiêu đề YCTN để thu gọn (collapse)');
    await truongBpKtraPage.toggleYctnAccordion();
    await page.waitForTimeout(500);

    Logger.step(3, 'Nhấn vào thanh tiêu đề YCTN lần nữa để mở lại (expand)');
    await truongBpKtraPage.toggleYctnAccordion();
    await page.waitForTimeout(500);
    await expect(truongBpKtraPage.ctTable).toBeVisible();
  });

  test('TC_TBP_003: Hiển thị đầy đủ các cột của bảng chỉ tiêu trên thẻ mẫu', {
    tag: ['@smoke', '@high']
  }, async ({ truongBpKtraPage, page }) => {
    Logger.step(1, 'Đảm bảo hồ sơ đầu tiên được chọn để nạp bảng chỉ tiêu');
    if (!(await truongBpKtraPage.ctTable.isVisible()) && (await truongBpKtraPage.hsTableRows.count()) > 0) {
      await truongBpKtraPage.selectHsRow(0);
      await page.waitForTimeout(500);
    }

    Logger.step(2, 'Kiểm tra các cột tiêu đề của bảng chỉ tiêu (Table 0)');
    await expect(truongBpKtraPage.ctTable).toBeVisible();
    const headers = await truongBpKtraPage.ctTableHeaders.allInnerTexts();
    const cleanHeaders = headers.map(h => h.trim()).filter(h => h.length > 0);

    expect(cleanHeaders).toContain('CHỈ TIÊU');
    expect(cleanHeaders).toContain('ĐVT');
    expect(cleanHeaders).toContain('PP THỬ');
    expect(cleanHeaders).toContain('KẾT QUẢ');
    expect(cleanHeaders).toContain('LOD');
    expect(cleanHeaders).toContain('LOQ');
    expect(cleanHeaders).toContain('VL');
    expect(cleanHeaders).toContain('TÊN KNV');
  });

  test('TC_TBP_004: Kiểm tra các ô ĐVT, PP THỬ và KẾT QUẢ trên dòng chỉ tiêu của mẫu', {
    tag: ['@normal']
  }, async ({ truongBpKtraPage, page }) => {
    Logger.step(1, 'Đảm bảo hồ sơ đầu tiên được chọn');
    if (!(await truongBpKtraPage.ctTable.isVisible()) && (await truongBpKtraPage.hsTableRows.count()) > 0) {
      await truongBpKtraPage.selectHsRow(0);
      await page.waitForTimeout(500);
    }

    Logger.step(2, 'Kiểm tra sự tồn tại của ô ĐVT, PP THỬ và KẾT QUẢ trên dòng đầu tiên');
    await expect(truongBpKtraPage.ctRowDvt).toBeVisible();
    await expect(truongBpKtraPage.ctRowPpThu).toBeVisible();
    await expect(truongBpKtraPage.ctRowKq).toBeVisible();

    Logger.step(3, 'Kiểm tra các cột tham số LOD, LOQ, VL hiển thị ký hiệu');
    await expect(truongBpKtraPage.ctRowLod).toBeVisible();
    await expect(truongBpKtraPage.ctRowLoq).toBeVisible();
    await expect(truongBpKtraPage.ctRowVl).toBeVisible();
  });

  // =========================================================================
  // KHỐI 02: DANH SÁCH HỒ SƠ TN, CHIP TRẠNG THÁI & TÌM KIẾM / LỌC
  // =========================================================================

  test('TC_TBP_005: Hiển thị 3 chip trạng thái (Chờ duyệt, Đã duyệt, Trả lại) kèm số lượng đếm', {
    tag: ['@smoke', '@critical']
  }, async ({ truongBpKtraPage }) => {
    Logger.step(1, 'Kiểm tra hiển thị chip "Chờ duyệt"');
    await expect(truongBpKtraPage.chipChoDuyet).toBeVisible();
    const choDuyetText = await truongBpKtraPage.chipChoDuyet.innerText();
    expect(choDuyetText).toMatch(/Chờ duyệt/i);

    Logger.step(2, 'Kiểm tra hiển thị chip "Đã duyệt"');
    await expect(truongBpKtraPage.chipDaDuyet).toBeVisible();
    const daDuyetText = await truongBpKtraPage.chipDaDuyet.innerText();
    expect(daDuyetText).toMatch(/Đã duyệt/i);

    Logger.step(3, 'Kiểm tra hiển thị chip "Trả lại"');
    await expect(truongBpKtraPage.chipTraLai).toBeVisible();
    const traLaiText = await truongBpKtraPage.chipTraLai.innerText();
    expect(traLaiText).toMatch(/Trả lại/i);
  });

  test('TC_TBP_006: Chuyển đổi giữa các chip trạng thái và nạp danh sách tương ứng', {
    tag: ['@high']
  }, async ({ truongBpKtraPage, page }) => {
    Logger.step(1, 'Nhấn chọn chip "Đã duyệt"');
    await truongBpKtraPage.selectStatusChip('da-duyet');
    await page.waitForTimeout(500);
    await expect(truongBpKtraPage.hsTable).toBeVisible();

    Logger.step(2, 'Nhấn chọn chip "Trả lại"');
    await truongBpKtraPage.selectStatusChip('tra-lai');
    await page.waitForTimeout(500);
    await expect(truongBpKtraPage.hsTable).toBeVisible();

    Logger.step(3, 'Nhấn chọn quay lại chip "Chờ duyệt"');
    await truongBpKtraPage.selectStatusChip('cho-duyet');
    await page.waitForTimeout(500);
    await expect(truongBpKtraPage.hsTable).toBeVisible();
  });

  test('TC_TBP_007: Hiển thị đúng 6 cột tiêu đề của bảng danh sách hồ sơ TN bên trái', {
    tag: ['@smoke', '@normal']
  }, async ({ truongBpKtraPage }) => {
    Logger.step(1, 'Kiểm tra tiêu đề các cột của bảng hồ sơ');
    const headers = await truongBpKtraPage.hsTableHeaders.allInnerTexts();
    const cleanHeaders = headers.map(h => h.replace(/\n|⋮/g, ' ').trim());

    expect(cleanHeaders).toContain('MÃ PKQ');
    expect(cleanHeaders).toContain('MÃ HỒ SƠ TN');
    expect(cleanHeaders).toContain('TÊN CHỈ TIÊU');
    expect(cleanHeaders).toContain('TÊN KNV');
    expect(cleanHeaders).toContain('TRẠNG THÁI');
  });

  test('TC_TBP_008: Tìm kiếm hồ sơ TN theo từ khóa hợp lệ (Mã HS / Tên chỉ tiêu)', {
    tag: ['@high']
  }, async ({ truongBpKtraPage, page }) => {
    Logger.step(1, 'Nhập từ khóa tìm kiếm "Protein" vào thanh tìm kiếm');
    await truongBpKtraPage.search('Protein');
    await page.waitForTimeout(500);

    Logger.step(2, 'Verify các dòng hiển thị đều chứa thông tin khớp với từ khóa');
    const rowCount = await truongBpKtraPage.hsTableRows.count();
    if (rowCount > 0) {
      const firstRowText = await truongBpKtraPage.hsTableRows.first().innerText();
      expect(firstRowText).toContain('Protein');
    }
  });

  test('TC_TBP_009: Tìm kiếm với từ khóa không tồn tại hiển thị bảng trống hoặc không có dòng khớp', {
    tag: ['@normal']
  }, async ({ truongBpKtraPage }) => {
    Logger.step(1, 'Nhập từ khóa không tồn tại "KEYWORD_KHONG_TON_TAI_9999"');
    await truongBpKtraPage.search('KEYWORD_KHONG_TON_TAI_9999');

    Logger.step(2, 'Verify bảng không có dòng kết quả nào hoặc hiển thị trạng thái rỗng');
    await expect(truongBpKtraPage.hsTableRows).toHaveCount(0, { timeout: 10000 });
  });

  test('TC_TBP_010: Nhấn nút "Hủy" xóa từ khóa tìm kiếm và phục hồi danh sách ban đầu', {
    tag: ['@normal']
  }, async ({ truongBpKtraPage, page }) => {
    Logger.step(1, 'Tìm kiếm từ khóa "Protein"');
    await truongBpKtraPage.search('Protein');
    await page.waitForTimeout(500);

    Logger.step(2, 'Nhấn nút "Hủy" để xóa bộ lọc');
    await truongBpKtraPage.clearSearch();
    await page.waitForTimeout(500);

    Logger.step(3, 'Verify ô tìm kiếm được xóa trắng và danh sách được phục hồi');
    await expect(truongBpKtraPage.searchInput).toHaveValue('');
    const count = await truongBpKtraPage.hsTableRows.count();
    expect(count).toBeGreaterThan(0);
  });

  // =========================================================================
  // KHỐI 03: BIÊN BẢN THỬ NGHIỆM CHI TIẾT – THÊM / SỬA GIÁ TRỊ
  // =========================================================================

  test('TC_TBP_011: Hiển thị Biên bản thử nghiệm đầy đủ các khối chức năng', {
    tag: ['@smoke', '@critical']
  }, async ({ page }) => {
    Logger.step(1, 'Kiểm tra hiển thị tiêu đề "BIÊN BẢN THỬ NGHIỆM"');
    await expect(page.locator('text=BIÊN BẢN THỬ NGHIỆM').first()).toBeVisible();

    Logger.step(2, 'Kiểm tra hiển thị các phân mục chính của Biên bản');
    await expect(page.locator('text=/THÔNG TIN CHUNG/i').first()).toBeVisible();
    await expect(page.locator('text=/HÓA CHẤT.*SỬ DỤNG/i').first()).toBeVisible();
    await expect(page.locator('text=/CÔNG THỨC TÍNH/i').first()).toBeVisible();
    await expect(page.locator('text=/BẢNG KẾT QUẢ/i').first()).toBeVisible();
  });

  test('TC_TBP_012: Kiểm tra bảng Hóa chất / chất chuẩn sử dụng và nút "+ Thêm hóa chất"', {
    tag: ['@normal']
  }, async ({ truongBpKtraPage }) => {
    Logger.step(1, 'Kiểm tra bảng Hóa chất (Table 2) hiển thị');
    await expect(truongBpKtraPage.chemicalTable).toBeVisible();

    Logger.step(2, 'Kiểm tra các cột tiêu đề của bảng Hóa chất');
    const headers = await truongBpKtraPage.chemicalTable.locator('thead th').allInnerTexts();
    expect(headers).toContain('STT');
    expect(headers).toContain('TÊN HÓA CHẤT / CHẤT CHUẨN');
    expect(headers).toContain('NỒNG ĐỘ');
    expect(headers).toContain('CODE / LOT');
    expect(headers).toContain('HSD');
    expect(headers).toContain('GHI CHÚ');
  });

  test('TC_TBP_013: Kiểm tra bộ chọn Công thức tính và hiển thị diễn giải công thức', {
    tag: ['@high']
  }, async ({ truongBpKtraPage, page }) => {
    Logger.step(1, 'Kiểm tra dropdown Chọn công thức tồn tại');
    await expect(truongBpKtraPage.formulaSelect).toBeVisible();

    Logger.step(2, 'Kiểm tra khung diễn giải công thức tính toán');
    await expect(page.locator('text=/Kết quả tính = ROUND/i').first()).toBeVisible();
    await expect(page.locator('text=/Biến số:/i').first()).toBeVisible();
  });

  test('TC_TBP_014: Kiểm tra ô nhập "Làm tròn số" với các giá trị thập phân từ 0 đến 10', {
    tag: ['@high']
  }, async ({ truongBpKtraPage }) => {
    Logger.step(1, 'Kiểm tra ô nhập Làm tròn số có mặt và có giá trị mặc định');
    await expect(truongBpKtraPage.decimalInput).toBeVisible();
    const defaultVal = await truongBpKtraPage.decimalInput.inputValue();
    expect(Number(defaultVal)).toBeGreaterThanOrEqual(0);
    expect(Number(defaultVal)).toBeLessThanOrEqual(10);

    Logger.step(2, 'Kiểm tra trạng thái có thể chỉnh sửa của ô làm tròn số');
    const isEditable = await truongBpKtraPage.decimalInput.isEditable();
    if (isEditable) {
      await truongBpKtraPage.setDecimalRounding(3);
      await expect(truongBpKtraPage.decimalInput).toHaveValue('3');
      await truongBpKtraPage.setDecimalRounding(2);
      await expect(truongBpKtraPage.decimalInput).toHaveValue('2');
    }
  });

  test('TC_TBP_015: Kiểm tra các cột tiêu đề trong Bảng kết quả thử nghiệm (Table 3)', {
    tag: ['@smoke', '@high']
  }, async ({ truongBpKtraPage }) => {
    Logger.step(1, 'Kiểm tra bảng kết quả (Table 3) hiển thị');
    await expect(truongBpKtraPage.sampleResultTable).toBeVisible();

    Logger.step(2, 'Kiểm tra các cột tiêu đề của bảng kết quả');
    const headers = await truongBpKtraPage.sampleResultHeaders.allInnerTexts();
    expect(headers).toContain('#');
    expect(headers).toContain('MÃ MẪU');
    expect(headers).toContain('TÊN CHẤT');
    expect(headers).toContain('KẾT QUẢ TÍNH');
    expect(headers).toContain('GHI CHÚ');
  });

  test('TC_TBP_016: Trưởng BP có thể chỉnh sửa các tham số và ghi chú trong Bảng kết quả', {
    tag: ['@high']
  }, async ({ truongBpKtraPage, page }) => {
    Logger.step(1, 'Kiểm tra các ô nhập tham số trên dòng mẫu đầu tiên');
    const inputs = truongBpKtraPage.sampleResultTable.locator('input.hs-inp.mono');
    const inputCount = await inputs.count();
    if (inputCount > 0 && (await inputs.first().isEditable())) {
      Logger.step(2, 'Nhập giá trị tham số thử nghiệm mới');
      await inputs.first().fill('12.5');
      await expect(inputs.first()).toHaveValue('12.5');
    }

    Logger.step(3, 'Kiểm tra ô Ghi chú của dòng mẫu');
    const noteInputs = truongBpKtraPage.sampleResultTable.locator('input[placeholder="Ghi chú"], input.hs-inp:not(.mono)');
    if (await noteInputs.count() > 0 && (await noteInputs.first().isEditable())) {
      await noteInputs.first().fill('Trưởng BP kiểm tra mẫu lặp');
      await expect(noteInputs.first()).toHaveValue('Trưởng BP kiểm tra mẫu lặp');
    }
  });

  test('TC_TBP_017: Kiểm tra hiển thị dòng trung bình cộng μ (TB) trong Bảng kết quả', {
    tag: ['@high']
  }, async ({ truongBpKtraPage }) => {
    Logger.step(1, 'Kiểm tra sự hiện diện của dòng trung bình μ (TB)');
    await expect(truongBpKtraPage.averageRow).toBeVisible();
    const avgText = await truongBpKtraPage.averageRow.innerText();
    expect(avgText).toContain('TB');
    expect(avgText).toContain('AVG');
  });

  // =========================================================================
  // KHỐI 04: TÀI LIỆU, ẢNH ĐÍNH KÈM & NHẬN XÉT, KÝ SỐ
  // =========================================================================

  test('TC_TBP_018: Kiểm tra hiển thị nút "+ Tải ảnh chữ ký" và khu vực Nhận xét & Ký', {
    tag: ['@smoke', '@normal']
  }, async ({ truongBpKtraPage, page }) => {
    Logger.step(1, 'Kiểm tra mục 6. NHẬN XÉT & KÝ');
    await expect(page.locator('text=/NHẬN XÉT & KÝ/i').first()).toBeVisible();

    Logger.step(2, 'Kiểm tra nút "+ Tải ảnh chữ ký"');
    await expect(truongBpKtraPage.btnSignatureUpload).toBeVisible();
  });

  // =========================================================================
  // KHỐI 05: HÀNH ĐỘNG LƯU, TRẢ LẠI & PHÊ DUYỆT HỒ SƠ
  // =========================================================================

  test('TC_TBP_019: Nút "Duyệt" và nút "Trả lại" bị vô hiệu hóa khi chưa chọn hồ sơ nào', {
    tag: ['@high', '@critical']
  }, async ({ truongBpKtraPage }) => {
    Logger.step(1, 'Đảm bảo không có checkbox nào được chọn');
    const checkedCount = await truongBpKtraPage.rowCheckboxes.evaluateAll((cbs: HTMLInputElement[]) =>
      cbs.filter(c => c.checked).length
    );
    expect(checkedCount).toBe(0);

    Logger.step(2, 'Verify nút "Duyệt" và nút "Trả lại" ở trạng thái disabled');
    await expect(truongBpKtraPage.btnApprove).toBeDisabled();
    await expect(truongBpKtraPage.btnReject).toBeDisabled();
  });

  test('TC_TBP_020: Tích chọn checkbox 1 hồ sơ kích hoạt nút "Duyệt" và nút "Trả lại"', {
    tag: ['@high', '@critical']
  }, async ({ truongBpKtraPage, page }) => {
    Logger.step(1, 'Tích chọn checkbox của hồ sơ đầu tiên');
    const count = await truongBpKtraPage.rowCheckboxes.count();
    if (count > 0) {
      await truongBpKtraPage.checkHsRow(0);
      await page.waitForTimeout(300);

      Logger.step(2, 'Verify nút "Duyệt" và nút "Trả lại" chuyển sang enabled');
      await expect(truongBpKtraPage.btnApprove).toBeEnabled();
      await expect(truongBpKtraPage.btnReject).toBeEnabled();

      Logger.step(3, 'Bỏ tích chọn checkbox và verify các nút trở lại disabled');
      await truongBpKtraPage.uncheckHsRow(0);
      await page.waitForTimeout(300);
      await expect(truongBpKtraPage.btnApprove).toBeDisabled();
      await expect(truongBpKtraPage.btnReject).toBeDisabled();
    }
  });

  test('TC_TBP_021: Tích chọn checkbox "Chọn tất cả" trên tiêu đề bảng hồ sơ', {
    tag: ['@normal']
  }, async ({ truongBpKtraPage, page }) => {
    Logger.step(1, 'Nhấn checkbox Select All trên thead');
    const rowCount = await truongBpKtraPage.rowCheckboxes.count();
    if (rowCount > 0) {
      await truongBpKtraPage.toggleSelectAllCheckbox();
      await page.waitForTimeout(300);

      Logger.step(2, 'Verify tất cả các checkbox dòng đều được tích chọn');
      const allChecked = await truongBpKtraPage.rowCheckboxes.evaluateAll((cbs: HTMLInputElement[]) =>
        cbs.every(c => c.checked)
      );
      expect(allChecked).toBeTruthy();
      await expect(truongBpKtraPage.btnApprove).toBeEnabled();

      Logger.step(3, 'Bỏ chọn Select All');
      await truongBpKtraPage.toggleSelectAllCheckbox();
      await page.waitForTimeout(300);
      await expect(truongBpKtraPage.btnApprove).toBeDisabled();
    }
  });

  test('TC_TBP_022: Nhấn nút "Trả lại" mở popup "Trả lại hồ sơ thử nghiệm"', {
    tag: ['@high', '@critical']
  }, async ({ truongBpKtraPage, page }) => {
    Logger.step(1, 'Tích chọn checkbox hồ sơ đầu tiên');
    const count = await truongBpKtraPage.rowCheckboxes.count();
    if (count > 0) {
      await truongBpKtraPage.checkHsRow(0);
      await page.waitForTimeout(300);

      Logger.step(2, 'Nhấn nút "Trả lại"');
      await truongBpKtraPage.clickReject();
      await page.waitForTimeout(500);

      Logger.step(3, 'Verify popup Trả lại hồ sơ thử nghiệm hiển thị');
      await expect(truongBpKtraPage.returnModal).toBeVisible();
      await expect(truongBpKtraPage.returnModalTitle).toHaveText('Trả lại hồ sơ thử nghiệm');
      await expect(truongBpKtraPage.returnReasonTextarea).toBeVisible();
      await expect(truongBpKtraPage.btnReturnConfirm).toBeVisible();

      Logger.step(4, 'Đóng popup để dọn dẹp');
      await truongBpKtraPage.closeRejectModal();
      await page.waitForTimeout(300);
      await expect(truongBpKtraPage.returnModal).not.toBeVisible();
    }
  });

  test('TC_TBP_023: Đóng popup trả lại bằng nút "Đóng" hoặc nút icon "×"', {
    tag: ['@normal']
  }, async ({ truongBpKtraPage, page }) => {
    const count = await truongBpKtraPage.rowCheckboxes.count();
    if (count > 0) {
      await truongBpKtraPage.checkHsRow(0);
      await truongBpKtraPage.clickReject();
      await page.waitForTimeout(500);

      Logger.step(1, 'Đóng popup bằng nút icon "×"');
      await truongBpKtraPage.btnReturnClose.click();
      await page.waitForTimeout(300);
      await expect(truongBpKtraPage.returnModal).not.toBeVisible();
    }
  });

  test('TC_TBP_024: Kiểm tra nhập lý do và đếm ký tự trong popup trả lại', {
    tag: ['@high']
  }, async ({ truongBpKtraPage, page }) => {
    const count = await truongBpKtraPage.rowCheckboxes.count();
    if (count > 0) {
      await truongBpKtraPage.checkHsRow(0);
      await truongBpKtraPage.clickReject();
      await page.waitForTimeout(500);

      Logger.step(1, 'Kiểm tra placeholder và nhãn trường Lý do trả lại *');
      await expect(truongBpKtraPage.returnReasonTextarea).toHaveAttribute('placeholder', /Nhập lý do trả lại hồ sơ/i);

      Logger.step(2, 'Nhập lý do phản hồi cho KNV');
      const reason = 'Số liệu lặp chênh lệch lớn, yêu cầu KNV đo lại mẫu số 2';
      await truongBpKtraPage.fillRejectReason(reason);
      await expect(truongBpKtraPage.returnReasonTextarea).toHaveValue(reason);

      Logger.step(3, 'Đóng popup trả lại');
      await truongBpKtraPage.closeRejectModal();
    }
  });

  test('TC_TBP_025: Kiểm tra nút "Lưu" trên biên bản thử nghiệm', {
    tag: ['@smoke', '@critical']
  }, async ({ truongBpKtraPage }) => {
    Logger.step(1, 'Kiểm tra sự hiện diện của nút "Lưu"');
    await expect(truongBpKtraPage.btnSave).toBeVisible();

    Logger.step(2, 'Verify ban đầu nút "Lưu" hiển thị trạng thái chưa có thay đổi để lưu');
    await expect(truongBpKtraPage.btnSave).toHaveAttribute('title', /Chưa có thay đổi cần lưu/i);
    await expect(truongBpKtraPage.btnSave).toBeDisabled();
  });
});
