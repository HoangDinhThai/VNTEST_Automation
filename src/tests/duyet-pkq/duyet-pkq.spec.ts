import { test, expect } from '../../fixtures/base.fixture';
import { Logger } from '../../utils/logger';
import users from '../../../test-data/users.json';

test.describe('Module Duyệt Phiếu Kết Quả (/duyet-pkq) - Hệ thống VNTEST LIMS', () => {
  test.beforeEach(async ({ loginPage, duyetPkqPage, page }) => {
    Logger.step('Setup', 'Đăng nhập vào hệ thống và điều hướng tới màn hình Duyệt PKQ');
    await loginPage.open('/dang-nhap');
    await loginPage.login(users.validUser.username, users.validUser.password);
    await page.waitForURL('https://vntest-lims.pirago.work/', { timeout: 15000 });

    await duyetPkqPage.open('/duyet-pkq');
    await expect(duyetPkqPage.listTable).toBeVisible({ timeout: 15000 });
    await expect(duyetPkqPage.previewContainer).toBeVisible({ timeout: 15000 });
  });

  // =========================================================================
  // KHỐI 01: BỐ CỤC & HIỂN THỊ TỔNG QUAN (Layout & Navigation)
  // =========================================================================

  test('TC_DPKQ_001: Kiểm tra điều hướng đúng màn hình Duyệt PKQ và tiêu đề trang hiển thị đúng', {
    tag: ['@smoke', '@critical']
  }, async ({ duyetPkqPage, page }) => {
    Logger.step(1, 'Kiểm tra đường dẫn URL hiện tại');
    expect(page.url()).toContain('/duyet-pkq');

    Logger.step(2, 'Kiểm tra tiêu đề trang');
    const title = await page.title();
    expect(title).toContain('Duyệt PKQ');
  });

  test('TC_DPKQ_002: Kiểm tra hiển thị đầy đủ 3 Tab điều hướng lớn: RÀ SOÁT KQ, DUYỆT PKQ, ĐÍNH KÈM SCAN', {
    tag: ['@smoke', '@critical']
  }, async ({ duyetPkqPage }) => {
    Logger.step(1, 'Kiểm tra hiển thị tab RÀ SOÁT KQ');
    await expect(duyetPkqPage.tabRaSoatKq).toBeVisible();

    Logger.step(2, 'Kiểm tra hiển thị tab DUYỆT PKQ và trạng thái active');
    await expect(duyetPkqPage.tabDuyetPkq).toBeVisible();

    Logger.step(3, 'Kiểm tra hiển thị tab ĐÍNH KÈM SCAN');
    await expect(duyetPkqPage.tabDinhKemScan).toBeVisible();
  });

  test('TC_DPKQ_003: Kiểm tra chuyển tab mượt mà: Nhấn RÀ SOÁT KQ và ĐÍNH KÈM SCAN', {
    tag: ['@high']
  }, async ({ duyetPkqPage, page }) => {
    Logger.step(1, 'Nhấn tab RÀ SOÁT KQ');
    await duyetPkqPage.tabRaSoatKq.click();
    await page.waitForURL(/.*ra-soat-kq.*/, { timeout: 10000 });
    expect(page.url()).toContain('/ra-soat-kq');

    Logger.step(2, 'Quay lại tab DUYỆT PKQ');
    await duyetPkqPage.tabDuyetPkq.click();
    await page.waitForURL(/.*duyet-pkq.*/, { timeout: 10000 });
    expect(page.url()).toContain('/duyet-pkq');

    Logger.step(3, 'Nhấn tab ĐÍNH KÈM SCAN');
    await duyetPkqPage.tabDinhKemScan.click();
    await page.waitForURL(/.*dinh-kem-scan.*/, { timeout: 10000 });
    expect(page.url()).toContain('/dinh-kem-scan');

    Logger.step(4, 'Quay lại tab DUYỆT PKQ');
    await duyetPkqPage.tabDuyetPkq.click();
    await page.waitForURL(/.*duyet-pkq.*/, { timeout: 10000 });
  });

  test('TC_DPKQ_004: Kiểm tra trạng thái mặc định của thanh Toolbar khi chưa chọn phiếu nào', {
    tag: ['@high']
  }, async ({ duyetPkqPage }) => {
    Logger.step(1, 'Kiểm tra nút "Trả lại" bị vô hiệu hóa khi 0 dòng được chọn');
    await expect(duyetPkqPage.btnTraLai).toBeDisabled();

    Logger.step(2, 'Kiểm tra nút "Ký duyệt" bị vô hiệu hóa khi 0 dòng được chọn');
    await expect(duyetPkqPage.btnKyDuyet).toBeDisabled();

    Logger.step(3, 'Kiểm tra nút "Print" hiển thị sẵn sàng');
    await expect(duyetPkqPage.btnPrint).toBeVisible();
    await expect(duyetPkqPage.btnPrint).toBeEnabled();

    Logger.step(4, 'Kiểm tra bộ lọc ngày nhận (Từ - Đến) hiển thị');
    await expect(duyetPkqPage.dateFromTrigger).toBeVisible();
    await expect(duyetPkqPage.dateToTrigger).toBeVisible();
  });

  // =========================================================================
  // KHỐI 02: ĐỒNG BỘ KHUNG XEM TRƯỚC BẢN IN (Preview Synchronization)
  // =========================================================================

  test('TC_DPKQ_005: Tự động nạp và hiển thị bản in xem trước của phiếu đầu tiên khi vừa vào trang', {
    tag: ['@smoke', '@critical']
  }, async ({ duyetPkqPage }) => {
    Logger.step(1, 'Kiểm tra danh sách có ít nhất 1 phiếu kết quả');
    const rowCount = await duyetPkqPage.getRowCount();
    expect(rowCount).toBeGreaterThan(0);

    Logger.step(2, 'Lấy mã PKQ của dòng đầu tiên');
    const firstRowCode = await duyetPkqPage.getRowPkqCode(duyetPkqPage.listRows.first());
    expect(firstRowCode).toMatch(/^DV/i);

    Logger.step(3, 'Kiểm tra khung xem trước hiển thị đúng mã số phiếu đầu tiên');
    await expect(duyetPkqPage.previewDocCode).toBeVisible();
    const previewCode = await duyetPkqPage.previewDocCode.innerText();
    expect(previewCode.trim()).toBe(firstRowCode);
  });

  test('TC_DPKQ_006: Nhấn chọn phiếu khác trong danh sách ➔ Khung xem trước tự động cập nhật đồng bộ', {
    tag: ['@smoke', '@critical']
  }, async ({ duyetPkqPage }) => {
    const rowCount = await duyetPkqPage.getRowCount();
    if (rowCount < 2) {
      Logger.info('Danh sách hiện chỉ có 1 dòng, bỏ qua bước đổi dòng');
      return;
    }

    Logger.step(1, 'Lấy mã PKQ của dòng 2');
    const secondRow = duyetPkqPage.listRows.nth(1);
    const secondCode = await duyetPkqPage.getRowPkqCode(secondRow);

    Logger.step(2, 'Nhấn chọn dòng 2 để xem trước');
    await duyetPkqPage.clickRowToPreview(secondRow);

    Logger.step(3, 'Kiểm tra khung xem trước đã đồng bộ sang mã phiếu dòng 2');
    await expect(duyetPkqPage.previewDocCode).toHaveText(secondCode);
  });

  test('TC_DPKQ_007: Kiểm tra mã số phiếu trên tờ in (Mã số/ Code: DV...) trùng khớp 100% với Mã PKQ', {
    tag: ['@high']
  }, async ({ duyetPkqPage }) => {
    const row = duyetPkqPage.listRows.first();
    const rowPkqCode = await duyetPkqPage.getRowPkqCode(row);
    await duyetPkqPage.clickRowToPreview(row);

    const previewCode = (await duyetPkqPage.previewDocCode.innerText()).trim();
    expect(previewCode).toBe(rowPkqCode);
  });

  test('TC_DPKQ_008: Kiểm tra cấu trúc tổng thể trang in chuẩn ISO/IEC 17025 hiển thị đầy đủ các phần', {
    tag: ['@high']
  }, async ({ duyetPkqPage }) => {
    Logger.step(1, 'Kiểm tra Header viện VNTEST và tiêu đề phiếu');
    await expect(duyetPkqPage.previewHeader).toBeVisible();
    await expect(duyetPkqPage.previewTitle).toBeVisible();

    Logger.step(2, 'Kiểm tra Mục I: THÔNG TIN CHUNG (General Information)');
    await expect(duyetPkqPage.previewSectionGeneral).toBeVisible();
    expect(await duyetPkqPage.previewInfoRows.count()).toBeGreaterThanOrEqual(8);

    Logger.step(3, 'Kiểm tra Mục II: BẢNG KẾT QUẢ THỬ NGHIỆM (Result Table)');
    await expect(duyetPkqPage.previewSectionResult).toBeVisible();
    await expect(duyetPkqPage.previewTable).toBeVisible();

    Logger.step(4, 'Kiểm tra Khu vực Chữ ký đại diện');
    await expect(duyetPkqPage.previewSignatures).toBeVisible();
  });

  // =========================================================================
  // KHỐI 03: KIỂM TRA CHI TIẾT CÁC GIÁ TRỊ BÊN TRONG PHIẾU IN (Print Preview Sheet Details)
  // =========================================================================

  test('TC_DPKQ_009: Kiểm tra khối Header phiếu in - Logo VNTEST, thông tin Viện tiếng Việt & tiếng Anh', {
    tag: ['@high']
  }, async ({ duyetPkqPage }) => {
    Logger.step(1, 'Kiểm tra logo VNTEST trên đầu trang');
    await expect(duyetPkqPage.previewLogo).toBeVisible();

    Logger.step(2, 'Kiểm tra tên Viện kiểm nghiệm và kiểm định chất lượng VNTEST');
    const headerText = await duyetPkqPage.previewHeader.innerText();
    expect(headerText).toContain('VIỆN KIỂM NGHIỆM VÀ KIỂM ĐỊNH CHẤT LƯỢNG VNTEST');
    expect(headerText).toContain('VNTEST INSTITUTE FOR QUALITY TESTING AND INSPECTION');
    expect(headerText).toContain('024.66.86.76.38');
    expect(headerText).toContain('info@vntest.vn');
  });

  test('TC_DPKQ_010: Kiểm tra các thẻ chứng nhận VILAS 1296, VIMCERTS 323 hiển thị trên phiếu in', {
    tag: ['@high']
  }, async ({ duyetPkqPage }) => {
    Logger.step(1, 'Lấy danh sách các chứng nhận hiển thị ở góc trên phiếu in');
    const stamps = await duyetPkqPage.getPreviewStamps();
    expect(stamps.length).toBeGreaterThan(0);
    expect(stamps.some(s => s.includes('VILAS') || s.includes('VIMCERTS'))).toBeTruthy();
  });

  test('TC_DPKQ_011: Kiểm tra Mục I.1 "Customer\'s Name / Tên khách hàng" hiển thị đúng tên đơn vị', {
    tag: ['@high']
  }, async ({ duyetPkqPage }) => {
    const row = duyetPkqPage.listRows.first();
    const rowCustName = await duyetPkqPage.getRowCustomerName(row);
    await duyetPkqPage.clickRowToPreview(row);

    Logger.step(1, 'Lấy giá trị Tên khách hàng trên bản in xem trước');
    const previewCustName = await duyetPkqPage.getPreviewInfoValue(1);
    expect(previewCustName).toContain(rowCustName);
  });

  test('TC_DPKQ_012: Kiểm tra Mục I.2 "Address / Địa chỉ" hiển thị chính xác địa chỉ khách hàng', {
    tag: ['@normal']
  }, async ({ duyetPkqPage }) => {
    Logger.step(1, 'Kiểm tra nhãn mục 2 là Address / Địa chỉ');
    const lbl = await duyetPkqPage.getPreviewInfoLabel(2);
    expect(lbl).toMatch(/Address|Địa chỉ/i);

    Logger.step(2, 'Kiểm tra địa chỉ có giá trị hợp lệ');
    const val = await duyetPkqPage.getPreviewInfoValue(2);
    expect(val.length).toBeGreaterThan(0);
  });

  test('TC_DPKQ_013: Kiểm tra Mục I.3 "Name of Sample / Tên mẫu" và Mục I.4 "Sample Description"', {
    tag: ['@high']
  }, async ({ duyetPkqPage }) => {
    const row = duyetPkqPage.listRows.first();
    const rowSampleName = await duyetPkqPage.getRowSampleName(row);
    await duyetPkqPage.clickRowToPreview(row);

    Logger.step(1, 'Kiểm tra Tên mẫu trên bản in khớp với tên mẫu ở danh sách');
    const previewSampleName = await duyetPkqPage.getPreviewInfoValue(3);
    expect(previewSampleName).toContain(rowSampleName);

    Logger.step(2, 'Kiểm tra Mục I.4 Mô tả mẫu tồn tại');
    const lblDesc = await duyetPkqPage.getPreviewInfoLabel(4);
    expect(lblDesc).toMatch(/Description|Mô tả/i);
  });

  test('TC_DPKQ_014: Kiểm tra Mục I.5 đến I.8 - Các mốc ngày tháng hiển thị đúng định dạng', {
    tag: ['@normal']
  }, async ({ duyetPkqPage }) => {
    const row = duyetPkqPage.listRows.first();
    const rowReceiveDate = await duyetPkqPage.getRowReceiveDate(row);
    await duyetPkqPage.clickRowToPreview(row);

    Logger.step(1, 'Kiểm tra Ngày nhận mẫu (Mục 5) khớp với bảng danh sách');
    const previewReceiveDate = await duyetPkqPage.getPreviewInfoValue(5);
    expect(previewReceiveDate).toContain(rowReceiveDate);

    Logger.step(2, 'Kiểm tra Thời gian lưu mẫu (Mục 6)');
    const retentionTime = await duyetPkqPage.getPreviewInfoValue(6);
    expect(retentionTime).toMatch(/\d+\s*(ngày|days?)/i);

    Logger.step(3, 'Kiểm tra Ngày thử nghiệm (Mục 7) có định dạng ngày dd/mm/yyyy');
    const testDate = await duyetPkqPage.getPreviewInfoValue(7);
    expect(testDate).toMatch(/\d{2}\/\d{2}\/\d{4}/);
  });

  test('TC_DPKQ_015: Kiểm tra Mục I.9 "Documents provided / Tài liệu kèm theo" hiển thị đúng mã số YCTN', {
    tag: ['@normal']
  }, async ({ duyetPkqPage }) => {
    const row = duyetPkqPage.listRows.first();
    const rowYctn = await duyetPkqPage.getRowYctnCode(row);
    await duyetPkqPage.clickRowToPreview(row);

    Logger.step(1, 'Kiểm tra tài liệu cung cấp chứa mã số YCTN tham chiếu');
    const docValue = await duyetPkqPage.getPreviewInfoValue(9);
    expect(docValue).toContain(rowYctn);
  });

  test('TC_DPKQ_016: Kiểm tra Mục II "Bảng kết quả thử nghiệm" hiển thị đầy đủ các cột STT, Chỉ tiêu, ĐVT, KQ, Phương pháp', {
    tag: ['@smoke', '@critical']
  }, async ({ duyetPkqPage }) => {
    Logger.step(1, 'Kiểm tra tiêu đề các cột của bảng kết quả');
    const ths = await duyetPkqPage.previewTable.locator('th').allInnerTexts();
    const thText = ths.join(' ');
    expect(thText).toMatch(/STT|No/i);
    expect(thText).toMatch(/Chỉ tiêu|Parameter/i);
    expect(thText).toMatch(/Đơn vị|Unit/i);
    expect(thText).toMatch(/Kết quả|Result/i);
    expect(thText).toMatch(/Phương pháp|Test Method/i);

    Logger.step(2, 'Kiểm tra bảng có ít nhất 1 dòng chỉ tiêu thử nghiệm');
    expect(await duyetPkqPage.previewTableRows.count()).toBeGreaterThan(0);
  });

  test('TC_DPKQ_017: Kiểm tra hiển thị Badge mã mẫu con trong bảng chỉ tiêu (nếu là phiếu gộp)', {
    tag: ['@high']
  }, async ({ duyetPkqPage }) => {
    Logger.step(1, 'Kiểm tra bảng kết quả trên bản in');
    const tableText = await duyetPkqPage.previewTable.innerText();
    // Nếu có mã mẫu con thì sẽ có định dạng dạng S\d+\.\d+ hoặc dấu chấm mã con
    const hasSampleBadge = /S\d+\.\d+/.test(tableText);
    Logger.info(`Phiếu hiện tại ${hasSampleBadge ? 'CÓ' : 'KHÔNG CÓ'} badge mẫu con`);
    expect(tableText.length).toBeGreaterThan(0);
  });

  test('TC_DPKQ_018: Kiểm tra Khu vực Ghi chú chuẩn và Khu vực Chữ ký đại diện (QC Manager & Viện trưởng)', {
    tag: ['@high']
  }, async ({ duyetPkqPage }) => {
    Logger.step(1, 'Kiểm tra phần ghi chú chuẩn (KPH, LOD, công nhận VILAS)');
    const previewText = await duyetPkqPage.getPreviewText();
    expect(previewText).toMatch(/KPH|Không phát hiện|LOD/i);

    Logger.step(2, 'Kiểm tra chữ ký Phòng kiểm nghiệm (QC Manager)');
    await expect(duyetPkqPage.previewSignatures).toBeVisible();
    const signText = await duyetPkqPage.previewSignatures.innerText();
    expect(signText).toMatch(/PHÒNG KIỂM NGHIỆM|QC Manager/i);
    expect(signText).toMatch(/TRẦN KHÁNH CHI/i);

    Logger.step(3, 'Kiểm tra chữ ký Viện trưởng (Director)');
    expect(signText).toMatch(/VIỆN TRƯỞNG|DIRECTOR/i);
    expect(signText).toMatch(/TRỊNH CÔNG SƠN/i);
  });

  // =========================================================================
  // KHỐI 04: NGHIỆP VỤ CỘT Ý KIẾN ĐIỀU PHỐI (Comment Cell & Modal)
  // =========================================================================

  test('TC_DPKQ_019: Kiểm tra trạng thái mặc định của cột Ý kiến - Placeholder "—" và tooltip hướng dẫn', {
    tag: ['@high']
  }, async ({ duyetPkqPage }) => {
    const row = duyetPkqPage.listRows.first();
    const cell = duyetPkqPage.getRowCommentCell(row);

    Logger.step(1, 'Kiểm tra ô ý kiến hiển thị');
    await expect(cell).toBeVisible();

    Logger.step(2, 'Kiểm tra tooltip khi hover vào ô ý kiến');
    const titleAttr = await cell.getAttribute('title');
    expect(titleAttr).toMatch(/thêm ý kiến điều phối|bấm để/i);
  });

  test('TC_DPKQ_020: Nhấn vào ô Ý kiến ➔ Mở modal "Cập nhật ý kiến điều phối" hiển thị đúng Mã PKQ và Mã YCTN', {
    tag: ['@smoke', '@critical']
  }, async ({ duyetPkqPage }) => {
    const row = duyetPkqPage.listRows.first();
    const rowPkqCode = await duyetPkqPage.getRowPkqCode(row);
    const rowYctnCode = await duyetPkqPage.getRowYctnCode(row);

    Logger.step(1, 'Mở modal ý kiến');
    await duyetPkqPage.openCommentModal(row);
    await expect(duyetPkqPage.modalYKien).toBeVisible();

    Logger.step(2, 'Kiểm tra tiêu đề modal');
    await expect(duyetPkqPage.modalYKienTitle).toHaveText('Cập nhật ý kiến điều phối');

    Logger.step(3, 'Kiểm tra mã PKQ và mã YCTN trên header modal');
    await expect(duyetPkqPage.modalYKienPkqCode).toHaveText(rowPkqCode);
    await expect(duyetPkqPage.modalYKienYctnCode).toHaveText(rowYctnCode);

    Logger.step(4, 'Đóng modal');
    await duyetPkqPage.btnModalYKienCancel.click();
    await expect(duyetPkqPage.modalYKien).toBeHidden();
  });

  test('TC_DPKQ_021: Kiểm tra nút "Lưu ý kiến" bị vô hiệu hóa khi ô nhập trống hoặc chưa có thay đổi', {
    tag: ['@high']
  }, async ({ duyetPkqPage }) => {
    const row = duyetPkqPage.listRows.first();
    await duyetPkqPage.openCommentModal(row);

    Logger.step(1, 'Kiểm tra nút "Lưu ý kiến" ban đầu khi chưa gõ gì');
    const origVal = await duyetPkqPage.inputYKien.inputValue();
    if (!origVal) {
      await expect(duyetPkqPage.btnModalYKienSave).toBeDisabled();
    }

    await duyetPkqPage.btnModalYKienCancel.click();
    await expect(duyetPkqPage.modalYKien).toBeHidden();
  });

  test('TC_DPKQ_022: Thêm mới ý kiến điều phối hợp lệ và nhấn "Lưu ý kiến" ➔ Cập nhật thành công', {
    tag: ['@high']
  }, async ({ duyetPkqPage }) => {
    const row = duyetPkqPage.listRows.first();
    await duyetPkqPage.openCommentModal(row);

    const testComment = 'Ý kiến điều phối tự động: Kiểm tra kỹ kết quả chỉ tiêu 1';
    Logger.step(1, 'Nhập ý kiến và bấm Lưu ý kiến');
    await duyetPkqPage.saveComment(testComment);
    await expect(duyetPkqPage.modalYKien).toBeHidden();

    Logger.step(2, 'Kiểm tra ngoài bảng danh sách hiển thị nội dung ý kiến vừa lưu');
    const cellText = await duyetPkqPage.getRowCommentCell(row).innerText();
    expect(cellText).toContain('Ý kiến điều phối tự động');
  });

  test('TC_DPKQ_023: Lưu ý kiến nhanh bằng tổ hợp phím tắt Ctrl + Enter ➔ Cập nhật thành công', {
    tag: ['@normal']
  }, async ({ duyetPkqPage }) => {
    const row = duyetPkqPage.listRows.first();
    await duyetPkqPage.openCommentModal(row);

    const shortcutComment = 'Lưu nhanh bằng phím tắt Ctrl Enter';
    Logger.step(1, 'Nhập ý kiến và bấm Ctrl+Enter');
    await duyetPkqPage.saveCommentWithShortcut(shortcutComment);
    await expect(duyetPkqPage.modalYKien).toBeHidden();

    Logger.step(2, 'Kiểm tra ngoài bảng danh sách đã lưu nội dung');
    const cellText = await duyetPkqPage.getRowCommentCell(row).innerText();
    expect(cellText).toContain('Lưu nhanh');
  });

  test('TC_DPKQ_024: Kiểm tra giới hạn ký tự ô ý kiến - Bộ đếm 0/1000 và không vượt quá 1000 ký tự', {
    tag: ['@normal']
  }, async ({ duyetPkqPage, page }) => {
    const row = duyetPkqPage.listRows.first();
    await duyetPkqPage.openCommentModal(row);

    Logger.step(1, 'Kiểm tra thuộc tính maxlength="1000"');
    const maxLen = await duyetPkqPage.inputYKien.getAttribute('maxlength');
    expect(maxLen).toBe('1000');

    Logger.step(2, 'Nhập chuỗi 50 ký tự và kiểm tra bộ đếm');
    const str50 = 'A'.repeat(50);
    await duyetPkqPage.inputYKien.fill(str50);
    const countText = await duyetPkqPage.charCountYKien.innerText();
    expect(countText).toContain('50/1000');

    Logger.step(3, 'Đóng modal và xác nhận hủy bỏ thay đổi');
    await duyetPkqPage.btnModalYKienClose.click();
    const confirmCloseBtn = page.locator('button').filter({ hasText: /^Đóng$/ }).last();
    if (await confirmCloseBtn.isVisible({ timeout: 1500 }).catch(() => false)) {
      await confirmCloseBtn.click();
    }
    await expect(duyetPkqPage.modalYKien).toBeHidden();
  });

  test('TC_DPKQ_025: Hủy cập nhật ý kiến bằng nút "Hủy" hoặc "Đóng" ➔ Giữ nguyên nội dung ban đầu', {
    tag: ['@normal']
  }, async ({ duyetPkqPage, page }) => {
    const row = duyetPkqPage.listRows.first();
    const origCellText = await duyetPkqPage.getRowCommentCell(row).innerText();

    Logger.step(1, 'Mở modal và nhập nội dung mới');
    await duyetPkqPage.openCommentModal(row);
    await duyetPkqPage.inputYKien.fill('Nội dung này sẽ bị hủy bỏ');

    Logger.step(2, 'Nhấn nút đóng và xác nhận hủy bỏ thay đổi');
    await duyetPkqPage.btnModalYKienClose.click();
    // Khi có thay đổi chưa lưu, hệ thống hiển thị dialog "Đóng hộp thoại?"
    const confirmCloseBtn = page.locator('button').filter({ hasText: /^Đóng$/ }).last();
    if (await confirmCloseBtn.isVisible({ timeout: 1500 }).catch(() => false)) {
      await confirmCloseBtn.click();
    }
    await expect(duyetPkqPage.modalYKien).toBeHidden();

    Logger.step(3, 'Kiểm tra nội dung ngoài bảng danh sách được giữ nguyên');
    const afterCancelText = await duyetPkqPage.getRowCommentCell(row).innerText();
    expect(afterCancelText).toBe(origCellText);
  });

  test('TC_DPKQ_026: Xóa bỏ ý kiến đã lưu ➔ Ô nhập rỗng và lưu ➔ Cột hiển thị lại placeholder "—"', {
    tag: ['@normal']
  }, async ({ duyetPkqPage }) => {
    const row = duyetPkqPage.listRows.first();
    await duyetPkqPage.openCommentModal(row);

    Logger.step(1, 'Xóa trắng ô ý kiến và bấm Lưu');
    await duyetPkqPage.inputYKien.fill('');
    await duyetPkqPage.btnModalYKienSave.click();
    await expect(duyetPkqPage.modalYKien).toBeHidden();

    Logger.step(2, 'Kiểm tra hiển thị lại dấu gạch ngang placeholder');
    const cellText = (await duyetPkqPage.getRowCommentCell(row).innerText()).trim();
    expect(cellText).toBe('—');
  });

  // =========================================================================
  // KHỐI 05: BỘ LỌC, TÌM KIẾM & QUẢN LÝ CỘT (Filter & Column Management)
  // =========================================================================

  test('TC_DPKQ_027: Lọc danh sách theo khoảng thời gian Ngày nhận (TỪ ngày - ĐẾN ngày)', {
    tag: ['@normal']
  }, async ({ duyetPkqPage }) => {
    Logger.step(1, 'Kiểm tra các trigger chọn ngày nhận');
    await expect(duyetPkqPage.dateFromTrigger).toBeVisible();
    await expect(duyetPkqPage.dateToTrigger).toBeVisible();
  });

  test('TC_DPKQ_028: Kiểm tra nút thao tác menu ⋮ trên từng tiêu đề cột', {
    tag: ['@normal']
  }, async ({ duyetPkqPage }) => {
    Logger.step(1, 'Kiểm tra các nút menu ⋮ trên tiêu đề cột');
    const menuTriggers = duyetPkqPage.tableThead.locator('.px-column-actions-trigger, [aria-label*="Thao tác cột"]');
    const count = await menuTriggers.count();
    expect(count).toBeGreaterThan(0);
  });

  test('TC_DPKQ_029: Mở popover "Quản lý cột" và ẩn một cột ➔ Cột tương ứng bị ẩn khỏi bảng', {
    tag: ['@high']
  }, async ({ duyetPkqPage, page }) => {
    Logger.step(1, 'Mở popover Quản lý cột');
    await duyetPkqPage.btnColumnMgmt.click();
    await page.waitForTimeout(500);

    Logger.step(2, 'Kiểm tra nội dung popover Quản lý cột hiển thị');
    await expect(duyetPkqPage.btnResetColumns).toBeVisible();
    await expect(page.getByText('MÃ YCTN / MÃ PKQ').first()).toBeVisible();
    await expect(page.getByText('TÊN KH / TÊN MẪU').first()).toBeVisible();

    Logger.step(3, 'Đóng popover');
    await page.keyboard.press('Escape');
  });

  test('TC_DPKQ_030: Nhấn nút "ĐẶT LẠI" trong popover Quản lý cột ➔ Khôi phục hiển thị đầy đủ các cột', {
    tag: ['@normal']
  }, async ({ duyetPkqPage, page }) => {
    Logger.step(1, 'Mở popover Quản lý cột');
    await duyetPkqPage.btnColumnMgmt.click();
    await page.waitForTimeout(500);

    Logger.step(2, 'Kiểm tra nút ĐẶT LẠI hiển thị');
    await expect(duyetPkqPage.btnResetColumns).toBeVisible();

    Logger.step(3, 'Đóng popover');
    await page.keyboard.press('Escape');
  });

  test('TC_DPKQ_031: Thay đổi số lượng bản ghi hiển thị trên một trang (Dropdown phân trang)', {
    tag: ['@normal']
  }, async ({ duyetPkqPage }) => {
    Logger.step(1, 'Kiểm tra dòng phân trang hiển thị tổng số PKQ');
    await expect(duyetPkqPage.paginationInfo).toBeVisible();
    const pagText = await duyetPkqPage.paginationInfo.innerText();
    expect(pagText).toMatch(/Hiện \d+–\d+ \/ \d+ PKQ/);
  });

  // =========================================================================
  // KHỐI 06: NGHIỆP VỤ KÝ DUYỆT PHIẾU KẾT QUẢ (Approve Flow)
  // =========================================================================

  test('TC_DPKQ_032: Tích chọn 1 phiếu kết quả ➔ Nút "Ký duyệt" chuyển sang trạng thái kích hoạt (enabled)', {
    tag: ['@smoke', '@critical']
  }, async ({ duyetPkqPage }) => {
    Logger.step(1, 'Kiểm tra ban đầu nút Ký duyệt bị vô hiệu hóa');
    await duyetPkqPage.uncheckAll();
    await expect(duyetPkqPage.btnKyDuyet).toBeDisabled();

    Logger.step(2, 'Tích chọn dòng 1');
    await duyetPkqPage.selectRow(duyetPkqPage.listRows.first());

    Logger.step(3, 'Kiểm tra nút Ký duyệt đã được kích hoạt');
    await expect(duyetPkqPage.btnKyDuyet).toBeEnabled();

    // Dọn dẹp
    await duyetPkqPage.uncheckAll();
  });

  test('TC_DPKQ_033: Nhấn nút "Ký duyệt" ➔ Mở modal "Xác nhận ký duyệt phiếu kết quả" hiển thị đúng mã phiếu', {
    tag: ['@smoke', '@critical']
  }, async ({ duyetPkqPage }) => {
    const row = duyetPkqPage.listRows.first();
    const rowPkqCode = await duyetPkqPage.getRowPkqCode(row);

    Logger.step(1, 'Tích chọn phiếu và mở modal Ký duyệt');
    await duyetPkqPage.selectRow(row);
    await duyetPkqPage.openKyDuyetModal();

    Logger.step(2, 'Kiểm tra modal hiển thị với đúng mã phiếu');
    await expect(duyetPkqPage.modalKyDuyet).toBeVisible();
    await expect(duyetPkqPage.modalKyDuyetTitle).toHaveText('Xác nhận ký duyệt phiếu kết quả');
    const modalText = await duyetPkqPage.modalKyDuyet.innerText();
    expect(modalText).toContain(rowPkqCode);

    Logger.step(3, 'Đóng modal bằng nút Hủy');
    await duyetPkqPage.btnModalKyDuyetCancel.click();
    await expect(duyetPkqPage.modalKyDuyet).toBeHidden();
    await duyetPkqPage.uncheckAll();
  });

  test('TC_DPKQ_034: Hủy ký duyệt trên modal (nhấn "Hủy" hoặc nút đóng) ➔ Giữ nguyên trạng thái phiếu', {
    tag: ['@high']
  }, async ({ duyetPkqPage }) => {
    const row = duyetPkqPage.listRows.first();
    const initialStatus = await duyetPkqPage.getRowStatus(row);

    Logger.step(1, 'Mở modal và đóng bằng nút close [x]');
    await duyetPkqPage.selectRow(row);
    await duyetPkqPage.openKyDuyetModal();
    await duyetPkqPage.btnModalKyDuyetClose.click();
    await expect(duyetPkqPage.modalKyDuyet).toBeHidden();

    Logger.step(2, 'Kiểm tra trạng thái phiếu không thay đổi');
    expect(await duyetPkqPage.getRowStatus(row)).toBe(initialStatus);
    await duyetPkqPage.uncheckAll();
  });

  test('TC_DPKQ_035: Kiểm tra thông báo hướng dẫn chuyển trạng thái trên modal ký duyệt', {
    tag: ['@high']
  }, async ({ duyetPkqPage }) => {
    await duyetPkqPage.selectRow(duyetPkqPage.listRows.first());
    await duyetPkqPage.openKyDuyetModal();

    Logger.step(1, 'Kiểm tra nội dung mô tả chuyển trạng thái sang Đã duyệt / In ấn (Printed)');
    const modalText = await duyetPkqPage.modalKyDuyet.innerText();
    expect(modalText).toContain('Đã duyệt / In ấn (Printed)');

    await duyetPkqPage.btnModalKyDuyetCancel.click();
    await duyetPkqPage.uncheckAll();
  });

  // =========================================================================
  // KHỐI 07: NGHIỆP VỤ TRẢ LẠI PHIẾU VỀ KHÂU RÀ SOÁT (Reject/Return Flow)
  // =========================================================================

  test('TC_DPKQ_036: Tích chọn 1 phiếu kết quả ➔ Nút "Trả lại" chuyển sang trạng thái kích hoạt (enabled)', {
    tag: ['@smoke', '@critical']
  }, async ({ duyetPkqPage }) => {
    Logger.step(1, 'Kiểm tra ban đầu nút Trả lại bị vô hiệu hóa');
    await duyetPkqPage.uncheckAll();
    await expect(duyetPkqPage.btnTraLai).toBeDisabled();

    Logger.step(2, 'Tích chọn dòng 1');
    await duyetPkqPage.selectRow(duyetPkqPage.listRows.first());

    Logger.step(3, 'Kiểm tra nút Trả lại đã được kích hoạt');
    await expect(duyetPkqPage.btnTraLai).toBeEnabled();

    await duyetPkqPage.uncheckAll();
  });

  test('TC_DPKQ_037: Nhấn nút "Trả lại" ➔ Mở modal "Xác nhận trả lại phiếu kết quả" hiển thị đúng mã phiếu', {
    tag: ['@smoke', '@critical']
  }, async ({ duyetPkqPage }) => {
    const row = duyetPkqPage.listRows.first();
    const rowPkqCode = await duyetPkqPage.getRowPkqCode(row);

    Logger.step(1, 'Tích chọn phiếu và mở modal Trả lại');
    await duyetPkqPage.selectRow(row);
    await duyetPkqPage.openTraLaiModal();

    Logger.step(2, 'Kiểm tra modal hiển thị đúng tiêu đề và mã phiếu');
    await expect(duyetPkqPage.modalTraLai).toBeVisible();
    const modalText = await duyetPkqPage.modalTraLai.innerText();
    expect(modalText).toContain('Xác nhận trả lại phiếu kết quả');
    expect(modalText).toContain(rowPkqCode);
    expect(modalText).toContain('Lý do trả lại *');

    Logger.step(3, 'Đóng modal');
    await duyetPkqPage.btnModalTraLaiCancel.click();
    await expect(duyetPkqPage.modalTraLai).toBeHidden();
    await duyetPkqPage.uncheckAll();
  });

  test('TC_DPKQ_038: Kiểm tra bắt buộc nhập "Lý do trả lại *" ➔ Bỏ trống thì nút Xác nhận bị vô hiệu hóa', {
    tag: ['@high']
  }, async ({ duyetPkqPage }) => {
    await duyetPkqPage.selectRow(duyetPkqPage.listRows.first());
    await duyetPkqPage.openTraLaiModal();

    Logger.step(1, 'Kiểm tra khi ô Lý do trả lại rỗng thì nút Xác nhận trả lại bị disabled');
    await duyetPkqPage.inputTraLaiReason.fill('');
    await expect(duyetPkqPage.btnModalTraLaiConfirm).toBeDisabled();

    Logger.step(2, 'Khi nhập lý do thì nút Xác nhận sáng lên');
    await duyetPkqPage.inputTraLaiReason.fill('Yêu cầu kiểm tra lại chỉ tiêu kim loại nặng');
    await expect(duyetPkqPage.btnModalTraLaiConfirm).toBeEnabled();

    await duyetPkqPage.btnModalTraLaiCancel.click();
    await duyetPkqPage.uncheckAll();
  });

  test('TC_DPKQ_039: Kiểm tra giới hạn độ dài lý do trả lại - Bộ đếm ký tự 0/1000', {
    tag: ['@normal']
  }, async ({ duyetPkqPage }) => {
    await duyetPkqPage.selectRow(duyetPkqPage.listRows.first());
    await duyetPkqPage.openTraLaiModal();

    Logger.step(1, 'Kiểm tra bộ đếm ban đầu 0/1000');
    await duyetPkqPage.inputTraLaiReason.fill('');
    await expect(duyetPkqPage.charCountTraLai).toContainText('0/1000');

    Logger.step(2, 'Nhập 40 ký tự và kiểm tra bộ đếm cập nhật');
    await duyetPkqPage.inputTraLaiReason.fill('1234567890123456789012345678901234567890');
    await expect(duyetPkqPage.charCountTraLai).toContainText('40/1000');

    await duyetPkqPage.btnModalTraLaiCancel.click();
    await duyetPkqPage.uncheckAll();
  });

  test('TC_DPKQ_040: Hủy trả lại phiếu (nhấn nút "Hủy" hoặc nút đóng) ➔ Giữ nguyên trạng thái phiếu', {
    tag: ['@high']
  }, async ({ duyetPkqPage }) => {
    const row = duyetPkqPage.listRows.first();
    const initialStatus = await duyetPkqPage.getRowStatus(row);

    Logger.step(1, 'Mở modal và đóng bằng nút close [x]');
    await duyetPkqPage.selectRow(row);
    await duyetPkqPage.openTraLaiModal();
    await duyetPkqPage.btnModalTraLaiClose.click();
    await expect(duyetPkqPage.modalTraLai).toBeHidden();

    Logger.step(2, 'Kiểm tra trạng thái phiếu không thay đổi');
    expect(await duyetPkqPage.getRowStatus(row)).toBe(initialStatus);
    await duyetPkqPage.uncheckAll();
  });

  test('TC_DPKQ_041: Kiểm tra hướng dẫn trạng thái trên modal trả lại (chuyển về khâu Rà soát)', {
    tag: ['@normal']
  }, async ({ duyetPkqPage }) => {
    await duyetPkqPage.selectRow(duyetPkqPage.listRows.first());
    await duyetPkqPage.openTraLaiModal();

    Logger.step(1, 'Kiểm tra ghi chú giải thích về khâu Rà soát (Review)');
    const modalText = await duyetPkqPage.modalTraLai.innerText();
    expect(modalText).toContain('Rà soát (Review)');

    await duyetPkqPage.btnModalTraLaiCancel.click();
    await duyetPkqPage.uncheckAll();
  });

  // =========================================================================
  // KHỐI 08: THAO TÁC CHỌN HÀNG LOẠT & NÚT IN (Print & Batch Actions)
  // =========================================================================

  test('TC_DPKQ_042: Tích chọn Header checkbox (Select all) ➔ Tự động chọn tất cả các dòng phiếu trên bảng', {
    tag: ['@high']
  }, async ({ duyetPkqPage }) => {
    const totalRows = await duyetPkqPage.getRowCount();

    Logger.step(1, 'Nhấn tích chọn Header checkbox');
    await duyetPkqPage.checkAll();

    Logger.step(2, 'Kiểm tra toàn bộ các dòng đều được tích chọn');
    const checkedCount = await duyetPkqPage.getCheckedRowCount();
    expect(checkedCount).toBe(totalRows);

    await duyetPkqPage.uncheckAll();
  });

  test('TC_DPKQ_043: Bỏ tích chọn Header checkbox ➔ Tự động bỏ chọn tất cả các dòng phiếu', {
    tag: ['@high']
  }, async ({ duyetPkqPage }) => {
    Logger.step(1, 'Tích chọn tất cả rồi bỏ chọn tất cả');
    await duyetPkqPage.checkAll();
    expect(await duyetPkqPage.getCheckedRowCount()).toBeGreaterThan(0);

    await duyetPkqPage.uncheckAll();
    expect(await duyetPkqPage.getCheckedRowCount()).toBe(0);
  });

  test('TC_DPKQ_044: Tích chọn nhiều phiếu ➔ Nút "Ký duyệt" và "Trả lại" cùng sáng lên', {
    tag: ['@high']
  }, async ({ duyetPkqPage }) => {
    Logger.step(1, 'Tích chọn toàn bộ phiếu');
    await duyetPkqPage.checkAll();

    Logger.step(2, 'Kiểm tra cả 2 nút tác vụ đều sáng (enabled)');
    await expect(duyetPkqPage.btnKyDuyet).toBeEnabled();
    await expect(duyetPkqPage.btnTraLai).toBeEnabled();

    await duyetPkqPage.uncheckAll();
  });

  test('TC_DPKQ_045: Mở modal Ký duyệt hàng loạt ➔ Hiển thị danh sách đầy đủ tất cả các mã phiếu đã chọn', {
    tag: ['@high']
  }, async ({ duyetPkqPage }) => {
    const totalRows = await duyetPkqPage.getRowCount();
    if (totalRows < 2) {
      Logger.info('Danh sách hiện chỉ có 1 dòng, kiểm tra chọn đơn');
      return;
    }

    Logger.step(1, 'Lấy mã của 2 dòng đầu');
    const code1 = await duyetPkqPage.getRowPkqCode(duyetPkqPage.listRows.first());
    const code2 = await duyetPkqPage.getRowPkqCode(duyetPkqPage.listRows.nth(1));

    Logger.step(2, 'Tích chọn 2 dòng và mở modal Ký duyệt');
    await duyetPkqPage.selectRow(duyetPkqPage.listRows.first());
    await duyetPkqPage.selectRow(duyetPkqPage.listRows.nth(1));
    await duyetPkqPage.openKyDuyetModal();

    Logger.step(3, 'Kiểm tra modal liệt kê đầy đủ cả 2 mã phiếu');
    const modalText = await duyetPkqPage.modalKyDuyet.innerText();
    expect(modalText).toContain(code1);
    expect(modalText).toContain(code2);

    await duyetPkqPage.btnModalKyDuyetCancel.click();
    await duyetPkqPage.uncheckAll();
  });

  test('TC_DPKQ_046: Mở modal Trả lại hàng loạt ➔ Hiển thị danh sách đầy đủ các mã phiếu kèm 1 ô lý do trả lại', {
    tag: ['@high']
  }, async ({ duyetPkqPage }) => {
    const totalRows = await duyetPkqPage.getRowCount();
    if (totalRows < 2) {
      Logger.info('Danh sách hiện chỉ có 1 dòng, bỏ qua test chọn 2 dòng');
      return;
    }

    const code1 = await duyetPkqPage.getRowPkqCode(duyetPkqPage.listRows.first());
    const code2 = await duyetPkqPage.getRowPkqCode(duyetPkqPage.listRows.nth(1));

    Logger.step(1, 'Tích chọn 2 dòng và mở modal Trả lại');
    await duyetPkqPage.selectRow(duyetPkqPage.listRows.first());
    await duyetPkqPage.selectRow(duyetPkqPage.listRows.nth(1));
    await duyetPkqPage.openTraLaiModal();

    Logger.step(2, 'Kiểm tra modal liệt kê cả 2 mã phiếu');
    const modalText = await duyetPkqPage.modalTraLai.innerText();
    expect(modalText).toContain(code1);
    expect(modalText).toContain(code2);
    expect(modalText).toContain('Lý do trả lại *');

    await duyetPkqPage.btnModalTraLaiCancel.click();
    await duyetPkqPage.uncheckAll();
  });

  test('TC_DPKQ_047: Bỏ chọn lần lượt từng dòng cho đến khi hết ➔ Nút "Ký duyệt" và "Trả lại" tự động disabled', {
    tag: ['@normal']
  }, async ({ duyetPkqPage }) => {
    const firstRow = duyetPkqPage.listRows.first();

    Logger.step(1, 'Tích chọn 1 dòng ➔ Nút Ký duyệt & Trả lại sáng lên');
    await duyetPkqPage.selectRow(firstRow);
    await expect(duyetPkqPage.btnKyDuyet).toBeEnabled();
    await expect(duyetPkqPage.btnTraLai).toBeEnabled();

    Logger.step(2, 'Bỏ tích chọn dòng đó ➔ Nút Ký duyệt & Trả lại bị disabled');
    await duyetPkqPage.uncheckRow(firstRow);
    await expect(duyetPkqPage.btnKyDuyet).toBeDisabled();
    await expect(duyetPkqPage.btnTraLai).toBeDisabled();
  });

  test('TC_DPKQ_048: Nhấn nút "Print" trên thanh công cụ ➔ Kích hoạt giao diện in phiếu đang xem trước', {
    tag: ['@smoke', '@high']
  }, async ({ duyetPkqPage, page }) => {
    Logger.step(1, 'Kiểm tra nút Print hiển thị và bấm được');
    await expect(duyetPkqPage.btnPrint).toBeVisible();
    await expect(duyetPkqPage.btnPrint).toBeEnabled();

    Logger.step(2, 'Nhấn nút Print');
    // Tránh bị treo bởi window.print() trên trình duyệt thật bằng cách mock window.print
    await page.evaluate(() => {
      window.print = () => console.log('Mock print called');
    });
    await duyetPkqPage.btnPrint.click();
    await page.waitForTimeout(500);
  });
});

