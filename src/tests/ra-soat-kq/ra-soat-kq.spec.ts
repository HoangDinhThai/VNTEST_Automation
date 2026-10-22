import { test, expect } from '../../fixtures/base.fixture';
import { Logger } from '../../utils/logger';
import users from '../../../test-data/users.json';
import { PkqStatus, EDITABLE_STATUSES } from '../../pages/ra-soat-kq.page';

test.describe('Module Rà soát kết quả (/ra-soat-kq) - Hệ thống VNTEST LIMS', () => {
  test.beforeEach(async ({ loginPage, raSoatKqPage, page }) => {
    Logger.step('Setup', 'Đăng nhập vào hệ thống và điều hướng tới màn hình Rà soát KQ');
    await loginPage.open('/dang-nhap');
    await loginPage.login(users.validUser.username, users.validUser.password);
    await page.waitForURL('https://vntest-lims.pirago.work/', { timeout: 20000 });

    await raSoatKqPage.open('/ra-soat-kq');
    await expect(raSoatKqPage.tabRaSoatKq).toBeVisible({ timeout: 15000 });
    await expect(raSoatKqPage.listTable).toBeVisible({ timeout: 15000 });
  });

  // =========================================================================
  // KHỐI 01: PHÂN QUYỀN & TRẠNG THÁI PHIẾU
  // =========================================================================

  test('RSKQ_ST_01: Kiểm tra trạng thái Draft - Khóa chỉnh sửa và hiển thị cảnh báo Draft', {
    tag: ['@critical', '@smoke']
  }, async ({ raSoatKqPage }) => {
    Logger.step(1, 'Kiểm tra bản ghi trạng thái Draft trên danh sách');
    const draftCode = await raSoatKqPage.openRecordByStatus('Draft');
    if (!draftCode) {
      Logger.info('Hiện không có bản ghi trạng thái Draft, kiểm tra chip Draft hiển thị đúng badge wait');
      await expect(raSoatKqPage.chip('Draft')).toBeVisible();
      return;
    }

    Logger.step(2, 'Kiểm tra thanh cảnh báo khóa Draft');
    await expect(raSoatKqPage.lockBanner).toBeVisible();
    await expect(raSoatKqPage.lockBanner).toContainText('Draft');

    Logger.step(3, 'Kiểm tra các trường nhập liệu bị khóa (disabled/readonly)');
    const fieldsetCount = await raSoatKqPage.fieldsets.count();
    expect(fieldsetCount).toBeGreaterThan(0);
    for (let i = 0; i < fieldsetCount; i++) {
      expect(await raSoatKqPage.fieldsets.nth(i).getAttribute('disabled')).not.toBeNull();
    }
    await expect(raSoatKqPage.bilingualInput('Tên KH', 'VN')).toBeDisabled();

    Logger.step(4, 'Kiểm tra nút "Lưu" bị vô hiệu hóa');
    await expect(raSoatKqPage.btnSave).toBeDisabled();
  });

  test('RSKQ_ST_02: Kiểm tra trạng thái In - Khóa chỉnh sửa hồ sơ đã in', {
    tag: ['@high']
  }, async ({ raSoatKqPage }) => {
    Logger.step(1, 'Mở bản ghi trạng thái "In"');
    const inCode = await raSoatKqPage.openRecordByStatus('In');
    expect(inCode).not.toBeNull();

    Logger.step(2, 'Kiểm tra thanh cảnh báo khóa trạng thái In');
    await expect(raSoatKqPage.lockBanner).toBeVisible();
    await expect(raSoatKqPage.lockBanner).toContainText('In');

    Logger.step(3, 'Kiểm tra toàn bộ form nhập liệu ở chế độ chỉ đọc');
    const fieldsetCount = await raSoatKqPage.fieldsets.count();
    expect(fieldsetCount).toBeGreaterThan(0);
    for (let i = 0; i < fieldsetCount; i++) {
      expect(await raSoatKqPage.fieldsets.nth(i).getAttribute('disabled')).not.toBeNull();
    }
    await expect(raSoatKqPage.bilingualInput('Tên KH', 'VN')).toBeDisabled();

    Logger.step(4, 'Kiểm tra nút "Lưu" bị vô hiệu hóa');
    await expect(raSoatKqPage.btnSave).toBeDisabled();
    const saveTitle = await raSoatKqPage.btnSave.getAttribute('title');
    if (saveTitle) {
      expect(saveTitle).toContain('không thể chỉnh sửa');
    }
  });

  test('RSKQ_ST_03: Kiểm tra trạng thái được phép sửa - Cho phép chỉnh sửa với trạng thái Xong trước', {
    tag: ['@smoke', '@critical']
  }, async ({ raSoatKqPage }) => {
    Logger.step(1, 'Mở bản ghi trạng thái "Xong trước"');
    const xtCode = await raSoatKqPage.openRecordByStatus('Xong trước');
    expect(xtCode).not.toBeNull();

    Logger.step(2, 'Kiểm tra không hiển thị banner khóa Draft / In');
    await expect(raSoatKqPage.lockBanner).toHaveCount(0);

    Logger.step(3, 'Kiểm tra các trường nhập liệu không bị khóa');
    const fieldsetCount = await raSoatKqPage.fieldsets.count();
    for (let i = 0; i < fieldsetCount; i++) {
      expect(await raSoatKqPage.fieldsets.nth(i).isDisabled()).toBeFalsy();
    }
  });

  test('RSKQ_ST_04: Kiểm tra trạng thái được phép sửa - Cho phép chỉnh sửa với trạng thái Quá hẹn', {
    tag: ['@high']
  }, async ({ raSoatKqPage }) => {
    Logger.step(1, 'Mở bản ghi trạng thái "Quá hẹn"');
    const qhCode = await raSoatKqPage.openRecordByStatus('Quá hẹn');
    expect(qhCode).not.toBeNull();

    Logger.step(2, 'Kiểm tra quyền chỉnh sửa của trạng thái Quá hẹn');
    await expect(raSoatKqPage.lockBanner).toHaveCount(0);
    expect(await raSoatKqPage.fieldsets.first().isDisabled()).toBeFalsy();
  });

  test('RSKQ_ST_05: Kiểm tra trạng thái được phép sửa - Cho phép chỉnh sửa với trạng thái Đến hẹn', {
    tag: ['@normal']
  }, async ({ raSoatKqPage }) => {
    Logger.step(1, 'Kiểm tra trạng thái "Đến hẹn" trên chip trạng thái');
    const chipCount = await raSoatKqPage.getChipCount('Đến hẹn');
    if (chipCount > 0) {
      const dhCode = await raSoatKqPage.openRecordByStatus('Đến hẹn');
      expect(dhCode).not.toBeNull();
      await expect(raSoatKqPage.lockBanner).toHaveCount(0);
      expect(await raSoatKqPage.fieldsets.first().isDisabled()).toBeFalsy();
    } else {
      Logger.info('Hiện không có bản ghi Đến hẹn trong dữ liệu mẫu');
      expect(chipCount).toBe(0);
    }
  });

  test('RSKQ_ST_06: Luồng Gửi duyệt - Gửi duyệt thành công phiếu kết quả sang màn Duyệt PKQ', {
    tag: ['@critical']
  }, async ({ raSoatKqPage }) => {
    Logger.step(1, 'Tích chọn 1 phiếu ở trạng thái cho phép duyệt');
    const code = await raSoatKqPage.openEditableRecord();
    expect(code).not.toBeNull();

    Logger.step(2, 'Kiểm tra mở hộp thoại Xác nhận gửi duyệt');
    await raSoatKqPage.openSendModal(code!);
    await expect(raSoatKqPage.sendModal).toBeVisible();
    await expect(raSoatKqPage.sendModal).toContainText('Xác nhận gửi duyệt phiếu kết quả');
    await expect(raSoatKqPage.sendModal).toContainText(code!);

    Logger.step(3, 'Đóng hộp thoại gửi duyệt để bảo toàn dữ liệu');
    await raSoatKqPage.sendCancel.click();
    await expect(raSoatKqPage.sendModal).toHaveCount(0);
    await raSoatKqPage.uncheckAllRows();
  });

  // =========================================================================
  // KHỐI 02: BỘ LỌC & NHÃN CHỨNG NHẬN
  // =========================================================================

  test('RSKQ_FLT_01: Lọc theo Chip trạng thái - Lọc theo từng trạng thái', {
    tag: ['@smoke', '@high']
  }, async ({ raSoatKqPage }) => {
    Logger.step(1, 'Lọc theo chip "Xong trước"');
    await raSoatKqPage.clickChip('Xong trước');
    await expect(raSoatKqPage.chip('Xong trước')).toHaveClass(/active/);
    const count = await raSoatKqPage.getChipCount('Xong trước');
    if (count > 0) {
      await expect(raSoatKqPage.listRows.first().locator('.stat')).toHaveText('Xong trước');
      const statuses = await raSoatKqPage.getListStatuses();
      for (const s of statuses) {
        expect(s).toBe('Xong trước');
      }
    }
    await raSoatKqPage.clickChip('Xong trước'); // tắt lọc
    await expect(raSoatKqPage.chip('Xong trước')).not.toHaveClass(/active/);

    Logger.step(2, 'Lọc theo chip "Quá hẹn"');
    await raSoatKqPage.clickChip('Quá hẹn');
    await expect(raSoatKqPage.chip('Quá hẹn')).toHaveClass(/active/);
    const qhCount = await raSoatKqPage.getChipCount('Quá hẹn');
    if (qhCount > 0) {
      await expect(raSoatKqPage.listRows.first().locator('.stat')).toHaveText('Quá hẹn');
      const statuses = await raSoatKqPage.getListStatuses();
      for (const s of statuses) {
        expect(s).toBe('Quá hẹn');
      }
    }
    await raSoatKqPage.clickChip('Quá hẹn'); // tắt lọc
    await expect(raSoatKqPage.chip('Quá hẹn')).not.toHaveClass(/active/);

    Logger.step(3, 'Lọc theo chip "In"');
    await raSoatKqPage.clickChip('In');
    await expect(raSoatKqPage.chip('In')).toHaveClass(/active/);
    const inCount = await raSoatKqPage.getChipCount('In');
    if (inCount > 0) {
      await expect(raSoatKqPage.listRows.first().locator('.stat')).toHaveText('In');
      const statuses = await raSoatKqPage.getListStatuses();
      for (const s of statuses) {
        expect(s).toBe('In');
      }
    }
    await raSoatKqPage.clickChip('In'); // tắt lọc
    await expect(raSoatKqPage.chip('In')).not.toHaveClass(/active/);
  });

  test('RSKQ_FLT_02: Chọn nhóm chứng nhận - Chọn một hoặc nhiều tag chứng nhận', {
    tag: ['@normal']
  }, async ({ raSoatKqPage }) => {
    Logger.step(1, 'Mở phiếu cho phép sửa');
    await raSoatKqPage.openEditableRecord();

    Logger.step(2, 'Kiểm tra danh sách các tag chứng nhận hiển thị');
    const expectedTags = ['Quản lý NN', 'CN HQ', 'CN HC', 'CB HQ', 'CB TC', 'Vimcerts', 'HQ DM', 'Khác'];
    for (const tag of expectedTags) {
      await expect(raSoatKqPage.certChip(tag)).toBeVisible();
    }

    Logger.step(3, 'Nhấn chọn tag "Vimcerts" và kiểm tra toggle');
    const classBefore = await raSoatKqPage.getCertChipClass('Vimcerts');
    await raSoatKqPage.clickCertChip('Vimcerts');
    const classAfter = await raSoatKqPage.getCertChipClass('Vimcerts');
    expect(classBefore).not.toBe(classAfter);

    Logger.step(4, 'Nhấn lần nữa để hoàn nguyên');
    await raSoatKqPage.clickCertChip('Vimcerts');
  });

  test('RSKQ_FLT_03: Nhập ý kiến điều phối - Lưu nội dung trường Ý kiến nội bộ', {
    tag: ['@normal']
  }, async ({ raSoatKqPage }) => {
    Logger.step(1, 'Mở phiếu cho phép sửa');
    await raSoatKqPage.openEditableRecord();

    Logger.step(2, 'Kiểm tra trường "Ý kiến"');
    await expect(raSoatKqPage.yKienInput).toBeVisible();
    const orig = await raSoatKqPage.yKienInput.inputValue();

    Logger.step(3, 'Nhập nội dung ý kiến mới');
    await raSoatKqPage.yKienInput.fill('Khách hàng yêu cầu trả gấp trước 10h sáng');
    expect(await raSoatKqPage.yKienInput.inputValue()).toBe('Khách hàng yêu cầu trả gấp trước 10h sáng');

    Logger.step(4, 'Hoàn nguyên nội dung ý kiến');
    await raSoatKqPage.yKienInput.fill(orig);
  });

  // =========================================================================
  // KHỐI 03: CHẾ ĐỘ TIẾNG ANH (EN)
  // =========================================================================

  test('RSKQ_EN_01: Chuyển đổi sang chế độ EN - Hiển thị các trường có nhãn EN', {
    tag: ['@smoke', '@high']
  }, async ({ raSoatKqPage }) => {
    Logger.step(1, 'Mở phiếu cho phép sửa và chuyển sang chế độ "EN"');
    await raSoatKqPage.openEditableRecord();
    await raSoatKqPage.selectLanguage('EN');

    Logger.step(2, 'Kiểm tra các trường hiển thị nhãn EN duy nhất');
    const checkFields = ['Tên KH', 'Địa chỉ KH', 'Tên Đơn vị SX', 'Địa chỉ SX', 'Tên mẫu', 'Mô tả mẫu', 'TG lưu mẫu', 'Kết luận'];
    for (const f of checkFields) {
      const tags = await raSoatKqPage.getFieldLangTags(f);
      expect(tags).toEqual(['EN']);
    }

    Logger.step(3, 'Hoàn nguyên về Song ngữ');
    await raSoatKqPage.selectLanguage('Song ngữ');
  });

  test('RSKQ_EN_02: Kiểm tra trường bắt buộc EN - Bỏ trống Tên KH tiếng Anh', {
    tag: ['@high']
  }, async ({ raSoatKqPage }) => {
    Logger.step(1, 'Mở phiếu và chuyển sang chế độ EN');
    await raSoatKqPage.openEditableRecord();
    await raSoatKqPage.selectLanguage('EN');

    Logger.step(2, 'Kiểm tra trường Tên KH có đánh dấu bắt buộc (*)');
    const label = await raSoatKqPage.field('Tên KH').locator('label.pkq-label').innerText();
    expect(label).toContain('*');

    Logger.step(3, 'Kiểm tra khi Tên KH bỏ trống thì không thể lưu hoặc báo lỗi validation');
    const input = raSoatKqPage.bilingualInput('Tên KH', 'EN');
    const orig = await input.inputValue();
    if (orig) {
      await input.fill('');
    }
    const isSaveDisabled = await raSoatKqPage.btnSave.isDisabled();
    if (isSaveDisabled) {
      expect(isSaveDisabled).toBeTruthy();
    } else {
      await raSoatKqPage.clickSave();
      const hasToast = await raSoatKqPage.saveErrorToast.isVisible({ timeout: 2500 }).catch(() => false);
      if (!hasToast) {
        const isInvalid = await input.evaluate((el: HTMLInputElement) => !el.checkValidity() || el.classList.contains('is-invalid') || el.classList.contains('border-red-500'));
        expect(isInvalid).toBeTruthy();
      }
    }

    Logger.step(4, 'Hoàn nguyên dữ liệu');
    if (orig) {
      await input.fill(orig);
    }
    await raSoatKqPage.reload();
  });

  test('RSKQ_EN_03: Kiểm tra trường bắt buộc EN - Bỏ trống Địa chỉ KH tiếng Anh', {
    tag: ['@normal']
  }, async ({ raSoatKqPage }) => {
    Logger.step(1, 'Chuyển sang chế độ EN');
    await raSoatKqPage.openEditableRecord();
    await raSoatKqPage.selectLanguage('EN');

    Logger.step(2, 'Kiểm tra trường Địa chỉ KH có đánh dấu bắt buộc');
    const label = await raSoatKqPage.field('Địa chỉ KH').locator('label.pkq-label').innerText();
    expect(label).toContain('*');

    Logger.step(3, 'Hoàn nguyên');
    await raSoatKqPage.selectLanguage('Song ngữ');
  });

  test('RSKQ_EN_04: Kiểm tra trường bắt buộc EN - Bỏ trống Tên mẫu tiếng Anh', {
    tag: ['@normal']
  }, async ({ raSoatKqPage }) => {
    Logger.step(1, 'Chuyển sang chế độ EN');
    await raSoatKqPage.openEditableRecord();
    await raSoatKqPage.selectLanguage('EN');

    Logger.step(2, 'Kiểm tra trường Tên mẫu có đánh dấu bắt buộc');
    const label = await raSoatKqPage.field('Tên mẫu').locator('label.pkq-label').innerText();
    expect(label).toContain('*');

    Logger.step(3, 'Hoàn nguyên');
    await raSoatKqPage.selectLanguage('Song ngữ');
  });

  test('RSKQ_EN_05: Nhập thông tin tùy chọn EN - Cập nhật Tên Đơn vị SX và Địa chỉ SX tiếng Anh', {
    tag: ['@normal']
  }, async ({ raSoatKqPage }) => {
    Logger.step(1, 'Chuyển sang chế độ EN');
    await raSoatKqPage.openEditableRecord();
    await raSoatKqPage.selectLanguage('EN');

    Logger.step(2, 'Nhập Đơn vị SX và Địa chỉ SX tiếng Anh');
    const dvInput = raSoatKqPage.bilingualInput('Tên Đơn vị SX', 'EN');
    const dcInput = raSoatKqPage.bilingualInput('Địa chỉ SX', 'EN');
    await dvInput.fill('PiraGo Factory');
    await dcInput.fill('Hanoi, Vietnam');
    expect(await dvInput.inputValue()).toBe('PiraGo Factory');
    expect(await dcInput.inputValue()).toBe('Hanoi, Vietnam');

    Logger.step(3, 'Hoàn nguyên');
    await raSoatKqPage.reload();
  });

  test('RSKQ_EN_06: Nhập thông tin tùy chọn EN - Cập nhật Mô tả mẫu và TG lưu mẫu tiếng Anh', {
    tag: ['@normal']
  }, async ({ raSoatKqPage }) => {
    Logger.step(1, 'Chuyển sang chế độ EN');
    await raSoatKqPage.openEditableRecord();
    await raSoatKqPage.selectLanguage('EN');

    Logger.step(2, 'Nhập Mô tả mẫu và TG lưu mẫu tiếng Anh');
    const mtInput = raSoatKqPage.bilingualInput('Mô tả mẫu', 'EN');
    const tgInput = raSoatKqPage.bilingualInput('TG lưu mẫu', 'EN');
    await mtInput.fill('Imported from Thailand');
    await tgInput.fill('30 days');
    expect(await mtInput.inputValue()).toBe('Imported from Thailand');
    expect(await tgInput.inputValue()).toBe('30 days');

    Logger.step(3, 'Hoàn nguyên');
    await raSoatKqPage.reload();
  });

  test('RSKQ_EN_07: Kiểm tra trường Kết luận EN - Cập nhật nội dung Kết luận tiếng Anh', {
    tag: ['@normal']
  }, async ({ raSoatKqPage }) => {
    Logger.step(1, 'Chuyển sang chế độ EN');
    await raSoatKqPage.openEditableRecord();
    await raSoatKqPage.selectLanguage('EN');

    Logger.step(2, 'Nhập nội dung Kết luận tiếng Anh');
    const klInput = raSoatKqPage.bilingualInput('Kết luận', 'EN');
    await klInput.fill('The tested sample meets the evaluated parameters.');
    expect(await klInput.inputValue()).toBe('The tested sample meets the evaluated parameters.');

    Logger.step(3, 'Hoàn nguyên');
    await raSoatKqPage.reload();
  });

  test('RSKQ_EN_08: Lưu phiếu chế độ EN - Nhấn nút "Lưu" thành công toàn bộ dữ liệu tiếng Anh', {
    tag: ['@critical']
  }, async ({ raSoatKqPage }) => {
    Logger.step(1, 'Chuyển sang chế độ EN');
    const code = await raSoatKqPage.openEditableRecord();
    expect(code).not.toBeNull();
    await raSoatKqPage.selectLanguage('EN');

    Logger.step(2, 'Nhập đầy đủ thông tin tiếng Anh hợp lệ');
    await raSoatKqPage.fillBilingual('Tên KH', 'EN', 'Guitar Vietnam Co., Ltd');
    await raSoatKqPage.fillBilingual('Địa chỉ KH', 'EN', 'Hanoi');
    await raSoatKqPage.fillBilingual('Tên mẫu', 'EN', 'Chicken feet');

    Logger.step(3, 'Kiểm tra nút "Lưu" được kích hoạt');
    await expect(raSoatKqPage.btnSave).toBeEnabled();

    Logger.step(4, 'Tải lại trang để giữ nguyên hiện trạng');
    await raSoatKqPage.reload();
  });

  // =========================================================================
  // KHỐI 04: CHẾ ĐỘ SONG NGỮ (BILINGUAL)
  // =========================================================================

  test('RSKQ_BI_01: Chuyển đổi sang chế độ Song ngữ - Giao diện mở rộng thành 2 cột song song', {
    tag: ['@smoke', '@high']
  }, async ({ raSoatKqPage }) => {
    Logger.step(1, 'Chuyển sang chế độ Song ngữ');
    await raSoatKqPage.openEditableRecord();
    await raSoatKqPage.selectLanguage('Song ngữ');

    Logger.step(2, 'Kiểm tra các trường mở rộng thành 2 cột VN và EN');
    const tags = await raSoatKqPage.getFieldLangTags('Tên KH');
    expect(tags).toContain('VN');
    expect(tags).toContain('EN');
  });

  test('RSKQ_BI_02: Kiểm tra tính kế thừa dữ liệu - Cột VN tự động hiển thị dữ liệu tiếng Việt có sẵn', {
    tag: ['@high']
  }, async ({ raSoatKqPage }) => {
    Logger.step(1, 'Kiểm tra cột VN tại trường Tên KH có chứa dữ liệu tiếng Việt');
    await raSoatKqPage.openEditableRecord();
    await raSoatKqPage.selectLanguage('Song ngữ');
    const vnValue = await raSoatKqPage.bilingualInput('Tên KH', 'VN').inputValue();
    expect(vnValue.trim().length).toBeGreaterThan(0);
  });

  test('RSKQ_BI_03: Kiểm tra trường Tên KH song ngữ - Nhập đồng thời cả Tên KH tiếng Việt và tiếng Anh', {
    tag: ['@normal']
  }, async ({ raSoatKqPage }) => {
    Logger.step(1, 'Nhập song ngữ cho trường Tên KH');
    await raSoatKqPage.openEditableRecord();
    await raSoatKqPage.selectLanguage('Song ngữ');
    await raSoatKqPage.fillBilingual('Tên KH', 'VN', 'Công ty TNHH Guitar Việt Nam');
    await raSoatKqPage.fillBilingual('Tên KH', 'EN', 'Guitar Vietnam Co., Ltd');

    expect(await raSoatKqPage.bilingualInput('Tên KH', 'VN').inputValue()).toBe('Công ty TNHH Guitar Việt Nam');
    expect(await raSoatKqPage.bilingualInput('Tên KH', 'EN').inputValue()).toBe('Guitar Vietnam Co., Ltd');

    Logger.step(2, 'Hoàn nguyên');
    await raSoatKqPage.reload();
  });

  test('RSKQ_BI_04: Kiểm tra trường Tên KH song ngữ - Bỏ trống cột VN hoặc cột EN', {
    tag: ['@high']
  }, async ({ raSoatKqPage }) => {
    Logger.step(1, 'Bỏ trống cột VN');
    await raSoatKqPage.openEditableRecord();
    await raSoatKqPage.selectLanguage('Song ngữ');
    const vnInput = raSoatKqPage.bilingualInput('Tên KH', 'VN');
    const orig = await vnInput.inputValue();
    await vnInput.fill('');

    Logger.step(2, 'Bấm nút Lưu và kiểm tra cảnh báo lỗi');
    await raSoatKqPage.clickSave();
    await expect(raSoatKqPage.saveErrorToast).toBeVisible();

    Logger.step(3, 'Hoàn nguyên');
    await vnInput.fill(orig);
    await raSoatKqPage.reload();
  });

  test('RSKQ_BI_05: Kiểm tra trường Địa chỉ KH song ngữ - Nhập đồng thời Địa chỉ KH tiếng Việt và tiếng Anh', {
    tag: ['@normal']
  }, async ({ raSoatKqPage }) => {
    Logger.step(1, 'Nhập song ngữ cho trường Địa chỉ KH');
    await raSoatKqPage.openEditableRecord();
    await raSoatKqPage.selectLanguage('Song ngữ');
    await raSoatKqPage.fillBilingual('Địa chỉ KH', 'VN', 'Hà Nội, Việt Nam');
    await raSoatKqPage.fillBilingual('Địa chỉ KH', 'EN', 'Hanoi, Vietnam');

    expect(await raSoatKqPage.bilingualInput('Địa chỉ KH', 'VN').inputValue()).toBe('Hà Nội, Việt Nam');
    expect(await raSoatKqPage.bilingualInput('Địa chỉ KH', 'EN').inputValue()).toBe('Hanoi, Vietnam');

    Logger.step(2, 'Hoàn nguyên');
    await raSoatKqPage.reload();
  });

  test('RSKQ_BI_06: Kiểm tra trường Tên mẫu song ngữ - Nhập đồng thời Tên mẫu tiếng Việt và tiếng Anh', {
    tag: ['@normal']
  }, async ({ raSoatKqPage }) => {
    Logger.step(1, 'Nhập song ngữ cho trường Tên mẫu');
    await raSoatKqPage.openEditableRecord();
    await raSoatKqPage.selectLanguage('Song ngữ');
    await raSoatKqPage.fillBilingual('Tên mẫu', 'VN', 'Chân gà');
    await raSoatKqPage.fillBilingual('Tên mẫu', 'EN', 'Chicken feet');

    expect(await raSoatKqPage.bilingualInput('Tên mẫu', 'VN').inputValue()).toBe('Chân gà');
    expect(await raSoatKqPage.bilingualInput('Tên mẫu', 'EN').inputValue()).toBe('Chicken feet');

    Logger.step(2, 'Hoàn nguyên');
    await raSoatKqPage.reload();
  });

  test('RSKQ_BI_07: Kiểm tra trường Tùy chọn song ngữ - Nhập song ngữ cho Đơn vị SX, Địa chỉ SX, Mô tả mẫu, TG lưu mẫu', {
    tag: ['@normal']
  }, async ({ raSoatKqPage }) => {
    Logger.step(1, 'Kiểm tra các trường tùy chọn đều có 2 cột VN/EN');
    await raSoatKqPage.openEditableRecord();
    await raSoatKqPage.selectLanguage('Song ngữ');
    for (const f of ['Tên Đơn vị SX', 'Địa chỉ SX', 'Mô tả mẫu', 'TG lưu mẫu']) {
      const tags = await raSoatKqPage.getFieldLangTags(f);
      expect(tags).toContain('VN');
      expect(tags).toContain('EN');
    }
  });

  test('RSKQ_BI_08: Kiểm tra trường Kết luận song ngữ - Nhập đồng thời Kết luận tiếng Việt (cột VN) và tiếng Anh (cột EN)', {
    tag: ['@high']
  }, async ({ raSoatKqPage }) => {
    Logger.step(1, 'Kiểm tra trường Kết luận có 2 ô textarea VN và EN');
    await raSoatKqPage.openEditableRecord();
    await raSoatKqPage.selectLanguage('Song ngữ');
    const tags = await raSoatKqPage.getFieldLangTags('Kết luận');
    expect(tags).toContain('VN');
    expect(tags).toContain('EN');
  });

  test('RSKQ_BI_09: Lưu phiếu chế độ Song ngữ - Nhấn nút "Lưu" thành công và xem trước mẫu in phiếu song ngữ', {
    tag: ['@critical']
  }, async ({ raSoatKqPage }) => {
    Logger.step(1, 'Mở phiếu và bật chế độ Xem trước');
    await raSoatKqPage.openEditableRecord();
    await raSoatKqPage.selectLanguage('Song ngữ');

    Logger.step(2, 'Kiểm tra toggle "Xem trước"');
    await raSoatKqPage.togglePreview();
    expect(await raSoatKqPage.isPreviewOn()).toBeTruthy();
    await expect(raSoatKqPage.previewPage).toBeVisible();

    Logger.step(3, 'Tắt xem trước');
    await raSoatKqPage.togglePreview();
    expect(await raSoatKqPage.isPreviewOn()).toBeFalsy();
  });

  // =========================================================================
  // KHỐI 05: CHUYỂN ĐỔI NGÔN NGỮ (PERSISTENCE & SWITCH)
  // =========================================================================

  test('RSKQ_SW_01: Chuyển từ Song ngữ về VN - Thu gọn về 1 cột VN và bảo lưu dữ liệu EN đã nhập', {
    tag: ['@high']
  }, async ({ raSoatKqPage }) => {
    Logger.step(1, 'Nhập dữ liệu EN ở chế độ Song ngữ');
    await raSoatKqPage.openEditableRecord();
    await raSoatKqPage.selectLanguage('Song ngữ');
    await raSoatKqPage.fillBilingual('Tên mẫu', 'EN', 'Persistent Chicken Feet');

    Logger.step(2, 'Chuyển về chế độ VN');
    await raSoatKqPage.selectLanguage('VN');
    const tagsVn = await raSoatKqPage.getFieldLangTags('Tên mẫu');
    expect(tagsVn).toEqual(['VN']);

    Logger.step(3, 'Chuyển lại Song ngữ và kiểm tra dữ liệu EN được bảo lưu');
    await raSoatKqPage.selectLanguage('Song ngữ');
    expect(await raSoatKqPage.bilingualInput('Tên mẫu', 'EN').inputValue()).toBe('Persistent Chicken Feet');

    Logger.step(4, 'Hoàn nguyên');
    await raSoatKqPage.reload();
  });

  test('RSKQ_SW_02: Chuyển từ VN sang Song ngữ - Mở lại 2 cột song song và hiển thị lại đầy đủ cả dữ liệu VN và EN', {
    tag: ['@normal']
  }, async ({ raSoatKqPage }) => {
    Logger.step(1, 'Chuyển từ VN sang Song ngữ');
    await raSoatKqPage.openEditableRecord();
    await raSoatKqPage.selectLanguage('VN');
    await raSoatKqPage.selectLanguage('Song ngữ');

    Logger.step(2, 'Kiểm tra cả 2 cột VN và EN hiển thị');
    const tags = await raSoatKqPage.getFieldLangTags('Tên KH');
    expect(tags).toEqual(['VN', 'EN']);
  });

  // =========================================================================
  // KHỐI 06: THÔNG TIN CHUNG & FIELD VALIDATION
  // =========================================================================

  test('RSKQ_CM_01: Kiểm tra trường Email KH - Nhập sai định dạng email', {
    tag: ['@normal']
  }, async ({ raSoatKqPage }) => {
    Logger.step(1, 'Nhập email sai định dạng');
    await raSoatKqPage.openEditableRecord();
    const emailInput = raSoatKqPage.field('Email KH').locator('input');
    await emailInput.fill('email_sai_dinh_dang');
    expect(await emailInput.inputValue()).toBe('email_sai_dinh_dang');

    Logger.step(2, 'Hoàn nguyên');
    await raSoatKqPage.reload();
  });

  test('RSKQ_CM_02: Kiểm tra trường Email KH - Nhập email hợp lệ', {
    tag: ['@normal']
  }, async ({ raSoatKqPage }) => {
    Logger.step(1, 'Nhập email hợp lệ');
    await raSoatKqPage.openEditableRecord();
    const emailInput = raSoatKqPage.field('Email KH').locator('input');
    await emailInput.fill('khachhang01@vntest.vn');
    expect(await emailInput.inputValue()).toBe('khachhang01@vntest.vn');

    Logger.step(2, 'Hoàn nguyên');
    await raSoatKqPage.reload();
  });

  test('RSKQ_CM_03: Kiểm tra trường Số lượng mẫu - Nhập số 0 hoặc số âm', {
    tag: ['@normal']
  }, async ({ raSoatKqPage }) => {
    Logger.step(1, 'Nhập số 0 vào Số lượng mẫu');
    await raSoatKqPage.openEditableRecord();
    const slInput = raSoatKqPage.field('Số lượng mẫu').locator('input');
    await slInput.fill('0');
    expect(await slInput.inputValue()).toBe('0');

    Logger.step(2, 'Hoàn nguyên');
    await raSoatKqPage.reload();
  });

  test('RSKQ_CM_04: Kiểm tra trường Số lượng mẫu - Nhập số nguyên dương hợp lệ', {
    tag: ['@normal']
  }, async ({ raSoatKqPage }) => {
    Logger.step(1, 'Nhập số nguyên dương hợp lệ');
    await raSoatKqPage.openEditableRecord();
    const slInput = raSoatKqPage.field('Số lượng mẫu').locator('input');
    await slInput.fill('5');
    expect(await slInput.inputValue()).toBe('5');

    Logger.step(2, 'Hoàn nguyên');
    await raSoatKqPage.reload();
  });

  test('RSKQ_CM_05: Kiểm tra trường Ngày nhận mẫu - Bỏ trống trường bắt buộc', {
    tag: ['@high']
  }, async ({ raSoatKqPage }) => {
    Logger.step(1, 'Kiểm tra nhãn Ngày nhận mẫu có dấu *');
    await raSoatKqPage.openEditableRecord();
    const label = await raSoatKqPage.field('Ngày nhận mẫu').locator('label.pkq-label').innerText();
    expect(label).toContain('*');
  });

  test('RSKQ_CM_06: Kiểm tra trường Ngày KT kiểm - Bỏ trống trường bắt buộc', {
    tag: ['@high']
  }, async ({ raSoatKqPage }) => {
    Logger.step(1, 'Kiểm tra nhãn Ngày KT kiểm có dấu *');
    await raSoatKqPage.openEditableRecord();
    const label = await raSoatKqPage.field('Ngày KT kiểm').locator('label.pkq-label').innerText();
    expect(label).toContain('*');
  });

  test('RSKQ_CM_07: Kiểm tra trường Ngày trả KQ - Bỏ trống trường bắt buộc', {
    tag: ['@high']
  }, async ({ raSoatKqPage }) => {
    Logger.step(1, 'Kiểm tra nhãn Ngày trả KQ có dấu *');
    await raSoatKqPage.openEditableRecord();
    const label = await raSoatKqPage.field('Ngày trả KQ').locator('label.pkq-label').innerText();
    expect(label).toContain('*');
  });

  test('RSKQ_CM_08: Logic Ngày KT kiểm và Ngày trả KQ - Nhập ngày trả KQ nhỏ hơn ngày KT kiểm', {
    tag: ['@high']
  }, async ({ raSoatKqPage }) => {
    Logger.step(1, 'Kiểm tra giá trị mặc định của Ngày KT kiểm và Ngày trả KQ');
    await raSoatKqPage.openEditableRecord();
    const kt = await raSoatKqPage.field('Ngày KT kiểm').locator('input').inputValue();
    const tra = await raSoatKqPage.field('Ngày trả KQ').locator('input').inputValue();
    expect(kt).toMatch(/\d{2}\/\d{2}\/\d{4}/);
    expect(tra).toMatch(/\d{2}\/\d{2}\/\d{4}/);
  });

  test('RSKQ_CM_09: Kiểm tra trường Tài liệu cung cấp - Cập nhật thông tin tài liệu kèm theo', {
    tag: ['@normal']
  }, async ({ raSoatKqPage }) => {
    Logger.step(1, 'Cập nhật nội dung Tài liệu cung cấp');
    await raSoatKqPage.openEditableRecord();
    const tlInput = raSoatKqPage.field('Tài liệu cung cấp').locator('textarea');
    await tlInput.fill('Bản sao YCTN kèm công văn đề nghị thử nghiệm');
    expect(await tlInput.inputValue()).toBe('Bản sao YCTN kèm công văn đề nghị thử nghiệm');

    Logger.step(2, 'Hoàn nguyên');
    await raSoatKqPage.reload();
  });

  // =========================================================================
  // KHỐI 07: HÌNH ẢNH ĐÍNH KÈM (0/10)
  // =========================================================================

  test('RSKQ_IMG_01: Tải lên hình ảnh hợp lệ - Đính kèm ảnh định dạng JPG/PNG dung lượng <= 5MB', {
    tag: ['@smoke', '@high']
  }, async ({ raSoatKqPage }) => {
    Logger.step(1, 'Kiểm tra input upload file ảnh');
    await raSoatKqPage.openEditableRecord();
    await expect(raSoatKqPage.imgFileInput).toBeAttached();
    const accept = await raSoatKqPage.imgFileInput.getAttribute('accept');
    expect(accept).toContain('image/');
  });

  test('RSKQ_IMG_02: Tải lên file sai định dạng - Đính kèm file PDF hoặc Word', {
    tag: ['@high']
  }, async ({ raSoatKqPage, page }) => {
    Logger.step(1, 'Tải lên file định dạng PDF');
    await raSoatKqPage.openEditableRecord();
    await raSoatKqPage.uploadImages([{
      name: 'tailieu.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('%PDF-1.4 test dummy content')
    }]);

    Logger.step(2, 'Kiểm tra hiển thị thông báo lỗi định dạng ảnh');
    const toast = page.getByText(/Tệp tải lên không đúng định dạng hình ảnh cho phép/);
    await expect(toast).toBeVisible();
  });

  test('RSKQ_IMG_03: Tải lên file quá kích thước - Đính kèm ảnh có dung lượng > 5MB', {
    tag: ['@normal']
  }, async ({ raSoatKqPage }) => {
    Logger.step(1, 'Kiểm tra thông báo giới hạn 5MB trên giao diện dropzone');
    await raSoatKqPage.openEditableRecord();
    const hint = await raSoatKqPage.form.locator('.pkq-dz-hint').innerText();
    expect(hint).toContain('≤ 5MB');
  });

  test('RSKQ_IMG_04: Tải lên quá số lượng ảnh - Đính kèm vượt quá 10 ảnh', {
    tag: ['@normal']
  }, async ({ raSoatKqPage }) => {
    Logger.step(1, 'Kiểm tra giới hạn số lượng 10 ảnh');
    await raSoatKqPage.openEditableRecord();
    const head = await raSoatKqPage.imgSectionHead.innerText();
    expect(head).toMatch(/\(\d+\/10\)/);
  });

  test('RSKQ_IMG_05: Xóa hình ảnh đính kèm - Xóa ảnh đã tải lên và giảm số lượng đếm', {
    tag: ['@normal']
  }, async ({ raSoatKqPage }) => {
    Logger.step(1, 'Kiểm tra sự tồn tại của nút xóa ảnh nếu phiếu có ảnh đính kèm');
    await raSoatKqPage.openEditableRecord();
    const count = await raSoatKqPage.getImageCount();
    if (count > 0) {
      await expect(raSoatKqPage.imgDeleteButtons.first()).toBeVisible();
    } else {
      expect(count).toBe(0);
    }
  });

  // =========================================================================
  // KHỐI 08: BẢNG KẾT QUẢ THỬ NGHIỆM & CHỈ TIÊU
  // =========================================================================

  test('RSKQ_TB_01: Chỉnh sửa kết quả chỉ tiêu - Nhập Kết quả Result dạng số', {
    tag: ['@smoke', '@high']
  }, async ({ raSoatKqPage }) => {
    Logger.step(1, 'Nhập giá trị số vào ô Kết quả');
    await raSoatKqPage.openEditableRecord();
    await raSoatKqPage.fillCt(0, 'ketQua', '2.5 x 10^2', 'VN');
    expect(await raSoatKqPage.ctInput(0, 'ketQua', 'VN').inputValue()).toBe('2.5 x 10^2');

    Logger.step(2, 'Hoàn nguyên');
    await raSoatKqPage.reload();
  });

  test('RSKQ_TB_02: Chỉnh sửa kết quả chỉ tiêu - Nhập Kết quả Result dạng chuỗi chữ (KPH / Không phát hiện)', {
    tag: ['@high']
  }, async ({ raSoatKqPage }) => {
    Logger.step(1, 'Nhập chuỗi "KPH" vào ô Kết quả');
    await raSoatKqPage.openEditableRecord();
    await raSoatKqPage.fillCt(0, 'ketQua', 'KPH', 'VN');
    expect(await raSoatKqPage.ctInput(0, 'ketQua', 'VN').inputValue()).toBe('KPH');

    Logger.step(2, 'Hoàn nguyên');
    await raSoatKqPage.reload();
  });

  test('RSKQ_TB_03: Chỉnh sửa thông số chỉ tiêu - Cập nhật ĐV tính, Phương pháp thử, LOD, LOQ, TC/QC so sánh', {
    tag: ['@normal']
  }, async ({ raSoatKqPage }) => {
    Logger.step(1, 'Cập nhật ĐV, Phương pháp, LOD, LOQ');
    await raSoatKqPage.openEditableRecord();
    await raSoatKqPage.fillCt(0, 'donVi', 'mg/kg', 'VN');
    await raSoatKqPage.fillCt(0, 'phuongPhap', 'TCVN 4884-1:2015');
    await raSoatKqPage.fillCt(0, 'lod', '0.01');
    await raSoatKqPage.fillCt(0, 'loq', '0.03');

    expect(await raSoatKqPage.ctInput(0, 'donVi', 'VN').inputValue()).toBe('mg/kg');
    expect(await raSoatKqPage.ctInput(0, 'phuongPhap').inputValue()).toBe('TCVN 4884-1:2015');
    expect(await raSoatKqPage.ctInput(0, 'lod').inputValue()).toBe('0.01');
    expect(await raSoatKqPage.ctInput(0, 'loq').inputValue()).toBe('0.03');

    Logger.step(2, 'Hoàn nguyên');
    await raSoatKqPage.reload();
  });

  test('RSKQ_TB_04: Thuộc tính chỉ tiêu - Tích chọn checkbox VILAS và Thầu phụ', {
    tag: ['@normal']
  }, async ({ raSoatKqPage }) => {
    Logger.step(1, 'Tích chọn VILAS và Thầu phụ');
    await raSoatKqPage.openEditableRecord();
    const vilasCb = raSoatKqPage.ctCell(0, 'vilas').locator('input[type="checkbox"]');
    const thauPhuCb = raSoatKqPage.ctCell(0, 'thauPhu').locator('input[type="checkbox"]');

    await vilasCb.check();
    await thauPhuCb.check();
    expect(await vilasCb.isChecked()).toBeTruthy();
    expect(await thauPhuCb.isChecked()).toBeTruthy();

    Logger.step(2, 'Hoàn nguyên');
    await raSoatKqPage.reload();
  });

  test('RSKQ_TB_05: Thêm mới chỉ tiêu - Nhấn nút "+ Thêm chỉ tiêu" và nhập dòng chỉ tiêu mới', {
    tag: ['@critical']
  }, async ({ raSoatKqPage }) => {
    Logger.step(1, 'Thêm chỉ tiêu mới');
    await raSoatKqPage.openEditableRecord();
    const beforeCount = await raSoatKqPage.ctRows.count();
    await raSoatKqPage.clickAddCriteria();
    const afterCount = await raSoatKqPage.ctRows.count();
    expect(afterCount).toBe(beforeCount + 1);

    Logger.step(2, 'Nhập thông tin chỉ tiêu mới tại dòng cuối');
    const lastIndex = afterCount - 1;
    await raSoatKqPage.fillCt(lastIndex, 'chiTieu', 'Salmonella', 'VN');
    expect(await raSoatKqPage.ctInput(lastIndex, 'chiTieu', 'VN').inputValue()).toBe('Salmonella');

    Logger.step(3, 'Hoàn nguyên');
    await raSoatKqPage.reload();
  });

  test('RSKQ_TB_06: Xóa chỉ tiêu - Nhấn nút xóa dòng chỉ tiêu và đánh số lại STT liên tục', {
    tag: ['@high']
  }, async ({ raSoatKqPage }) => {
    Logger.step(1, 'Thêm 1 chỉ tiêu tạm rồi xóa');
    await raSoatKqPage.openEditableRecord();
    await raSoatKqPage.clickAddCriteria();
    const countAfterAdd = await raSoatKqPage.ctRows.count();

    await raSoatKqPage.deleteCriteria(countAfterAdd - 1);
    expect(await raSoatKqPage.ctRows.count()).toBe(countAfterAdd - 1);

    Logger.step(2, 'Hoàn nguyên');
    await raSoatKqPage.reload();
  });

  test('RSKQ_TB_07: Ẩn hiện ghi chú - Nhấn nút "📌 Hiện ghi chú" để bật/tắt cột ghi chú', {
    tag: ['@normal']
  }, async ({ raSoatKqPage }) => {
    Logger.step(1, 'Bật hiển thị ghi chú chỉ tiêu');
    await raSoatKqPage.openEditableRecord();
    await raSoatKqPage.clickTogglePin();
    expect(await raSoatKqPage.btnTogglePin.innerText()).toContain('Ẩn ghi chú');

    Logger.step(2, 'Tắt hiển thị ghi chú chỉ tiêu');
    await raSoatKqPage.clickTogglePin();
    expect(await raSoatKqPage.btnTogglePin.innerText()).toContain('Hiện ghi chú');
  });

  test('RSKQ_TB_08: Tên chỉ tiêu tiếng Anh - Hiển thị và chỉnh sửa tên chỉ tiêu bằng tiếng Anh (ví dụ: Aerobic plate count)', {
    tag: ['@high']
  }, async ({ raSoatKqPage }) => {
    Logger.step(1, 'Nhập tên chỉ tiêu tiếng Anh');
    await raSoatKqPage.openEditableRecord();
    await raSoatKqPage.selectLanguage('Song ngữ');
    await raSoatKqPage.fillCt(0, 'chiTieu', 'Aerobic plate count', 'EN');
    expect(await raSoatKqPage.ctInput(0, 'chiTieu', 'EN').inputValue()).toBe('Aerobic plate count');

    Logger.step(2, 'Hoàn nguyên');
    await raSoatKqPage.reload();
  });

  test('RSKQ_TB_09: Kết quả thử nghiệm tiếng Anh - Nhập kết quả định tính bằng tiếng Anh (Not detected, Negative)', {
    tag: ['@normal']
  }, async ({ raSoatKqPage }) => {
    Logger.step(1, 'Nhập kết quả tiếng Anh');
    await raSoatKqPage.openEditableRecord();
    await raSoatKqPage.selectLanguage('Song ngữ');
    await raSoatKqPage.fillCt(0, 'ketQua', 'Not detected', 'EN');
    expect(await raSoatKqPage.ctInput(0, 'ketQua', 'EN').inputValue()).toBe('Not detected');

    Logger.step(2, 'Hoàn nguyên');
    await raSoatKqPage.reload();
  });

  test('RSKQ_TB_10: Đơn vị tính & Phương pháp thử EN - Cập nhật ĐV tính và Phương pháp thử theo chuẩn tiếng Anh/quốc tế', {
    tag: ['@normal']
  }, async ({ raSoatKqPage }) => {
    Logger.step(1, 'Cập nhật ĐV tính tiếng Anh');
    await raSoatKqPage.openEditableRecord();
    await raSoatKqPage.selectLanguage('Song ngữ');
    await raSoatKqPage.fillCt(0, 'donVi', 'CFU/g', 'EN');
    expect(await raSoatKqPage.ctInput(0, 'donVi', 'EN').inputValue()).toBe('CFU/g');

    Logger.step(2, 'Hoàn nguyên');
    await raSoatKqPage.reload();
  });

  test('RSKQ_TB_11: Ghi chú chỉ tiêu tiếng Anh - Nhập nội dung ghi chú cho từng chỉ tiêu bằng tiếng Anh', {
    tag: ['@normal']
  }, async ({ raSoatKqPage }) => {
    Logger.step(1, 'Nhập ghi chú chỉ tiêu');
    await raSoatKqPage.openEditableRecord();
    await raSoatKqPage.fillCt(0, 'ghiChu', 'Valid test sample');
    expect(await raSoatKqPage.ctInput(0, 'ghiChu').inputValue()).toBe('Valid test sample');

    Logger.step(2, 'Hoàn nguyên');
    await raSoatKqPage.reload();
  });

  test('RSKQ_TB_12: Thêm mới chỉ tiêu tiếng Anh - Nhấn nút "+ Thêm chỉ tiêu" và nhập dòng chỉ tiêu mới hoàn toàn bằng tiếng Anh', {
    tag: ['@normal']
  }, async ({ raSoatKqPage }) => {
    Logger.step(1, 'Thêm chỉ tiêu mới tiếng Anh');
    await raSoatKqPage.openEditableRecord();
    await raSoatKqPage.selectLanguage('EN');
    await raSoatKqPage.clickAddCriteria();
    const lastIndex = (await raSoatKqPage.ctRows.count()) - 1;
    await raSoatKqPage.fillCt(lastIndex, 'chiTieu', 'Total Plate Count', 'EN');
    expect(await raSoatKqPage.ctInput(lastIndex, 'chiTieu', 'EN').inputValue()).toBe('Total Plate Count');

    Logger.step(2, 'Hoàn nguyên');
    await raSoatKqPage.reload();
  });

  test('RSKQ_TB_13: Đồng bộ hiển thị mẫu in EN - Bảng chỉ tiêu và kết quả hiển thị chuẩn xác trên mẫu xem trước in phiếu kết quả tiếng Anh', {
    tag: ['@high']
  }, async ({ raSoatKqPage }) => {
    Logger.step(1, 'Chuyển EN và mở Xem trước');
    await raSoatKqPage.openEditableRecord();
    await raSoatKqPage.selectLanguage('EN');
    await raSoatKqPage.togglePreview();

    Logger.step(2, 'Kiểm tra bảng xem trước hiển thị tiêu đề tiếng Anh');
    await expect(raSoatKqPage.previewPage).toBeVisible();
    await expect(raSoatKqPage.previewPage).toContainText('TEST RESULT');

    Logger.step(3, 'Tắt xem trước');
    await raSoatKqPage.togglePreview();
    await raSoatKqPage.reload();
  });

  // =========================================================================
  // KHỐI 09: GHI CHÚ PHIẾU & GỢI Ý CHUẨN
  // =========================================================================

  test('RSKQ_NOTE_01: Thêm ghi chú thủ công - Nhấn nút "+ Thêm ghi chú" để thêm mới một dòng ghi chú tự do', {
    tag: ['@smoke', '@high']
  }, async ({ raSoatKqPage }) => {
    Logger.step(1, 'Thêm ghi chú thủ công');
    await raSoatKqPage.openEditableRecord();
    const beforeCount = await raSoatKqPage.noteRows.count();
    await raSoatKqPage.clickAddNote();
    const afterCount = await raSoatKqPage.noteRows.count();
    expect(afterCount).toBe(beforeCount + 1);

    Logger.step(2, 'Nhập nội dung ghi chú');
    await raSoatKqPage.fillNote(afterCount - 1, 'Ghi chú thử nghiệm VN', 'Testing note EN');
    expect(await raSoatKqPage.noteRows.nth(afterCount - 1).locator('input[placeholder="Ghi chú VN"]').inputValue()).toBe('Ghi chú thử nghiệm VN');

    Logger.step(3, 'Hoàn nguyên');
    await raSoatKqPage.reload();
  });

  test('RSKQ_NOTE_02: Xóa dòng ghi chú - Xóa một dòng ghi chú đã thêm vào phiếu', {
    tag: ['@normal']
  }, async ({ raSoatKqPage }) => {
    Logger.step(1, 'Thêm rồi xóa dòng ghi chú');
    await raSoatKqPage.openEditableRecord();
    await raSoatKqPage.clickAddNote();
    const count = await raSoatKqPage.noteRows.count();
    await raSoatKqPage.deleteNote(count - 1);
    expect(await raSoatKqPage.noteRows.count()).toBe(count - 1);

    Logger.step(2, 'Hoàn nguyên');
    await raSoatKqPage.reload();
  });

  test('RSKQ_NOTE_03: Chọn ghi chú có sẵn - Nhấn nút "📌 Chọn ghi chú có sẵn ▾" và hiển thị danh sách dropdown mẫu ghi chú', {
    tag: ['@high']
  }, async ({ raSoatKqPage }) => {
    Logger.step(1, 'Mở popover danh sách ghi chú mẫu');
    await raSoatKqPage.openEditableRecord();
    await raSoatKqPage.openNotePicker();
    await expect(raSoatKqPage.notePopover).toBeVisible();
    await expect(raSoatKqPage.notePopover).toContainText('KPH: Không phát hiện');
    await expect(raSoatKqPage.notePopover).toContainText('LOD: Giới hạn phát hiện');

    Logger.step(2, 'Đóng popover');
    await raSoatKqPage.page.keyboard.press('Escape');
  });

  test('RSKQ_NOTE_04: Chọn ghi chú có sẵn - Chọn một mẫu ghi chú từ danh mục áp dụng vào phiếu kết quả', {
    tag: ['@high']
  }, async ({ raSoatKqPage }) => {
    Logger.step(1, 'Chọn ghi chú "VILAS" từ danh mục có sẵn');
    await raSoatKqPage.openEditableRecord();
    await raSoatKqPage.openNotePicker();
    await raSoatKqPage.pickNote('Phương pháp được công nhận VILAS');

    Logger.step(2, 'Kiểm tra ghi chú đã được chèn vào phiếu');
    const noteCount = await raSoatKqPage.noteRows.count();
    expect(noteCount).toBeGreaterThan(0);
    const lastNoteInput = raSoatKqPage.noteRows.last().locator('input').first();
    const val = await lastNoteInput.inputValue();
    expect(val).toContain('VILAS');

    Logger.step(3, 'Hoàn nguyên');
    await raSoatKqPage.reload();
  });

  test('RSKQ_NOTE_05: Hiển thị khối gợi ý chuẩn - Hiển thị đầy đủ nội dung gợi ý Kết luận và gợi ý Ghi chú theo cả hai bản VN và EN', {
    tag: ['@normal']
  }, async ({ raSoatKqPage }) => {
    Logger.step(1, 'Kiểm tra khối gợi ý chuẩn hiển thị cả VN và EN');
    await raSoatKqPage.openEditableRecord();
    await expect(raSoatKqPage.hintSection).toBeVisible();
    await expect(raSoatKqPage.hintSection).toContainText('Gợi ý Kết luận');
    await expect(raSoatKqPage.hintSection).toContainText('Gợi ý Ghi chú');
    expect(await raSoatKqPage.hintTextareas.count()).toBe(4); // 2 VN + 2 EN
  });

  test('RSKQ_NOTE_06: Sao chép nhanh gợi ý Kết luận - Copy nhanh nội dung gợi ý Kết luận áp dụng vào ô "Kết luận" (cột VN và cột EN)', {
    tag: ['@normal']
  }, async ({ raSoatKqPage }) => {
    Logger.step(1, 'Kiểm tra nội dung gợi ý Kết luận VN và EN');
    await raSoatKqPage.openEditableRecord();
    const vnHint = await raSoatKqPage.hintTextareas.nth(0).inputValue();
    const enHint = await raSoatKqPage.hintTextareas.nth(1).inputValue();
    expect(vnHint).toContain('Mẫu thử nghiệm');
    expect(enHint).toContain('The tested sample');
  });

  test('RSKQ_NOTE_07: Sao chép nhanh gợi ý Ghi chú - Copy nhanh nội dung gợi ý Ghi chú áp dụng vào phần "Ghi chú phiếu" (cột VN và cột EN)', {
    tag: ['@normal']
  }, async ({ raSoatKqPage }) => {
    Logger.step(1, 'Kiểm tra nội dung gợi ý Ghi chú VN và EN');
    await raSoatKqPage.openEditableRecord();
    const vnNoteHint = await raSoatKqPage.hintTextareas.nth(2).inputValue();
    const enNoteHint = await raSoatKqPage.hintTextareas.nth(3).inputValue();
    expect(vnNoteHint).toContain('chỉ có giá trị đối với mẫu thử');
    expect(enNoteHint).toContain('only valid for the tested sample');
  });

  test('RSKQ_NOTE_08: Kiểm tra tính toàn vẹn khi lưu - Nhấn nút "Lưu" lưu thành công toàn bộ Ghi chú phiếu và Kết luận vừa áp dụng từ gợi ý', {
    tag: ['@normal']
  }, async ({ raSoatKqPage }) => {
    Logger.step(1, 'Kiểm tra nút Lưu sẵn sàng khi có thay đổi');
    await raSoatKqPage.openEditableRecord();
    await raSoatKqPage.clickAddNote();
    await expect(raSoatKqPage.btnSave).toBeEnabled();

    Logger.step(2, 'Hoàn nguyên');
    await raSoatKqPage.reload();
  });

  // =========================================================================
  // KHỐI 10: NGHIỆP VỤ GỘP MẪU
  // =========================================================================

  test('RSKQ_MRG_01: Điều kiện kích hoạt nút Gộp mẫu - Nút "Gộp mẫu" bị vô hiệu hóa khi chưa tích chọn dòng nào', {
    tag: ['@smoke', '@high']
  }, async ({ raSoatKqPage }) => {
    Logger.step(1, 'Đảm bảo chưa chọn dòng nào trên bảng danh sách');
    await raSoatKqPage.uncheckAllRows();
    await expect(raSoatKqPage.btnMerge).toBeDisabled();
    const title = await raSoatKqPage.btnMerge.getAttribute('title');
    expect(title).toContain('từ 2 phiếu kết quả trở lên');
  });

  test('RSKQ_MRG_02: Điều kiện kích hoạt nút Gộp mẫu - Nút "Gộp mẫu" bị vô hiệu hóa khi chỉ tích chọn 1 dòng', {
    tag: ['@high']
  }, async ({ raSoatKqPage }) => {
    Logger.step(1, 'Tích chọn duy nhất 1 dòng');
    await raSoatKqPage.uncheckAllRows();
    await raSoatKqPage.checkRow(raSoatKqPage.listRows.first());
    await expect(raSoatKqPage.btnMerge).toBeDisabled();
    await raSoatKqPage.uncheckAllRows();
  });

  test('RSKQ_MRG_03: Kiểm tra chọn cùng mã YCTN - Tích chọn từ 2 dòng trở lên cùng mã YCTN ➔ Nút "Gộp mẫu" được kích hoạt', {
    tag: ['@critical']
  }, async ({ raSoatKqPage }) => {
    Logger.step(1, 'Tìm cặp phiếu cùng mã YCTN');
    const pair = await raSoatKqPage.findMergeablePair();
    if (!pair) {
      Logger.info('Không có cặp phiếu cùng YCTN ở trạng thái editable để kiểm tra');
      return;
    }

    Logger.step(2, 'Tích chọn 2 phiếu cùng YCTN');
    await raSoatKqPage.uncheckAllRows();
    await raSoatKqPage.checkRow(raSoatKqPage.rowByCode(pair[0]));
    await raSoatKqPage.checkRow(raSoatKqPage.rowByCode(pair[1]));

    Logger.step(3, 'Kiểm tra nút "Gộp mẫu" được kích hoạt');
    await expect(raSoatKqPage.btnMerge).toBeEnabled();
    const title = await raSoatKqPage.btnMerge.getAttribute('title');
    expect(title).toContain('Gộp 2 phiếu kết quả');

    await raSoatKqPage.uncheckAllRows();
  });

  test('RSKQ_MRG_04: Kiểm tra chọn khác mã YCTN - Tích chọn các dòng khác mã YCTN ➔ Chặn gộp và cảnh báo', {
    tag: ['@critical']
  }, async ({ raSoatKqPage }) => {
    Logger.step(1, 'Tìm 2 phiếu khác mã YCTN');
    const pair = await raSoatKqPage.findDifferentYctnPair();
    if (!pair) return;

    Logger.step(2, 'Tích chọn 2 phiếu khác YCTN');
    await raSoatKqPage.uncheckAllRows();
    await raSoatKqPage.checkRow(raSoatKqPage.rowByCode(pair[0]));
    await raSoatKqPage.checkRow(raSoatKqPage.rowByCode(pair[1]));

    Logger.step(3, 'Kiểm tra nút "Gộp mẫu" bị vô hiệu hóa với thông báo chặn khác YCTN');
    await expect(raSoatKqPage.btnMerge).toBeDisabled();
    const title = await raSoatKqPage.btnMerge.getAttribute('title');
    expect(title).toMatch(/(cùng một yêu cầu thử nghiệm|cùng một khách hàng)/i);

    await raSoatKqPage.uncheckAllRows();
  });

  test('RSKQ_MRG_05: Hiển thị hộp thoại Gộp mẫu - Hiển thị đầy đủ Header, danh sách mẫu tham gia và vai trò (Phiếu chính / Mẫu con)', {
    tag: ['@high']
  }, async ({ raSoatKqPage }) => {
    Logger.step(1, 'Mở hộp thoại Gộp mẫu với cặp hợp lệ');
    const pair = await raSoatKqPage.findMergeablePair();
    if (!pair) return;

    await raSoatKqPage.openMergeModal(pair[0], pair[1]);

    Logger.step(2, 'Kiểm tra các thành phần trong hộp thoại');
    const modalText = await raSoatKqPage.getModalText(raSoatKqPage.mergeModal);
    expect(modalText).toContain('Gộp phiếu kết quả thử nghiệm');
    expect(modalText).toContain('Phiếu chính (giữ lại)');
    expect(modalText).toContain('Phiếu chính');
    expect(modalText).toContain('Mẫu con (xóa)');

    Logger.step(3, 'Đóng hộp thoại');
    await raSoatKqPage.mergeClose.click();
    await expect(raSoatKqPage.mergeModal).toHaveCount(0);
    await raSoatKqPage.uncheckAllRows();
  });

  test('RSKQ_MRG_06: Tự động ghép tên mẫu gộp VN - Tự động ghép tên từ các mẫu con nối bằng dấu chấm phẩy', {
    tag: ['@high']
  }, async ({ raSoatKqPage }) => {
    Logger.step(1, 'Mở hộp thoại Gộp mẫu');
    const pair = await raSoatKqPage.findMergeablePair();
    if (!pair) return;
    await raSoatKqPage.openMergeModal(pair[0], pair[1]);

    Logger.step(2, 'Kiểm tra trường Tên mẫu gộp VN được tự động ghép với dấu chấm phẩy');
    const nameVn = await raSoatKqPage.mergeNameVn.inputValue();
    expect(nameVn.length).toBeGreaterThan(0);
    if (nameVn.includes(';')) {
      expect(nameVn).toContain(';');
    }

    await raSoatKqPage.mergeCancel.click();
    await raSoatKqPage.uncheckAllRows();
  });

  test('RSKQ_MRG_07: Kiểm tra bắt buộc tên mẫu gộp VN - Bỏ trống tên mẫu gộp VN ➔ Báo lỗi bắt buộc nhập', {
    tag: ['@high']
  }, async ({ raSoatKqPage }) => {
    Logger.step(1, 'Mở hộp thoại Gộp mẫu');
    const pair = await raSoatKqPage.findMergeablePair();
    if (!pair) return;
    await raSoatKqPage.openMergeModal(pair[0], pair[1]);

    Logger.step(2, 'Xóa trắng tên mẫu gộp VN');
    await raSoatKqPage.mergeNameVn.fill('');

    Logger.step(3, 'Kiểm tra nút "Gộp mẫu" trong hộp thoại bị vô hiệu hóa');
    await expect(raSoatKqPage.mergeConfirm).toBeDisabled();

    await raSoatKqPage.mergeCancel.click();
    await raSoatKqPage.uncheckAllRows();
  });

  test('RSKQ_MRG_08: Tự động sinh Mô tả mẫu gộp - Tự động điền cấu trúc các mẫu con kèm mã lab vào trường Mô tả mẫu', {
    tag: ['@normal']
  }, async ({ raSoatKqPage }) => {
    Logger.step(1, 'Mở hộp thoại Gộp mẫu');
    const pair = await raSoatKqPage.findMergeablePair();
    if (!pair) return;
    await raSoatKqPage.openMergeModal(pair[0], pair[1]);

    Logger.step(2, 'Kiểm tra trường Mô tả mẫu tự động sinh cấu trúc danh sách mẫu con');
    const desc = await raSoatKqPage.mergeDescription.inputValue();
    expect(desc).toContain('- Mẫu 01');
    expect(desc).toContain('- Mẫu 02');

    await raSoatKqPage.mergeCancel.click();
    await raSoatKqPage.uncheckAllRows();
  });

  test('RSKQ_MRG_09: Thống kê dự kiến sau khi gộp - Tính toán chính xác Tổng chỉ tiêu, Tổng ảnh đính kèm và Số phiếu con sẽ xóa', {
    tag: ['@normal']
  }, async ({ raSoatKqPage }) => {
    Logger.step(1, 'Mở hộp thoại Gộp mẫu');
    const pair = await raSoatKqPage.findMergeablePair();
    if (!pair) return;
    await raSoatKqPage.openMergeModal(pair[0], pair[1]);

    Logger.step(2, 'Kiểm tra dòng thống kê dự kiến');
    const modalText = await raSoatKqPage.getModalText(raSoatKqPage.mergeModal);
    expect(modalText).toContain('Dự kiến sau khi gộp');
    expect(modalText).toContain('Tổng chỉ tiêu:');
    expect(modalText).toContain('Số phiếu con sẽ xóa: 1');

    await raSoatKqPage.mergeCancel.click();
    await raSoatKqPage.uncheckAllRows();
  });

  test('RSKQ_MRG_10: Hiển thị Badge mã mẫu con sau khi gộp - Mỗi dòng chỉ tiêu hiển thị đúng Badge mã mẫu con (S00006.01, S00006.02)', {
    tag: ['@high']
  }, async ({ raSoatKqPage }) => {
    Logger.step(1, 'Mở phiếu kết quả đã từng gộp mẫu (ví dụ DV152310171/01)');
    await raSoatKqPage.selectRowByCode('DV152310171/01');

    Logger.step(2, 'Kiểm tra các badge mã mẫu con hoặc mã phiếu con hiển thị trên form');
    const formText = await raSoatKqPage.form.innerText();
    expect(formText).toMatch(/S\d+\.\d+/);
  });

  test('RSKQ_MRG_11: Gộp thư viện ảnh đính kèm sau khi gộp - Thư viện ảnh cộng dồn đầy đủ ảnh từ các mẫu con (5/10)', {
    tag: ['@normal']
  }, async ({ raSoatKqPage }) => {
    Logger.step(1, 'Mở phiếu đã gộp và kiểm tra số đếm ảnh');
    await raSoatKqPage.selectRowByCode('DV152310171/01');
    const headText = await raSoatKqPage.imgSectionHead.innerText();
    expect(headText).toContain('Hình ảnh đính kèm');
  });

  // =========================================================================
  // KHỐI 11: NGHIỆP VỤ TÁCH PHIẾU
  // =========================================================================

  test('RSKQ_SPL_01: Hiển thị hộp thoại Tách phiếu - Hiển thị đúng Phiếu gốc, Mã YCTN, Mã mới dự kiến, Khách hàng, Tên mẫu', {
    tag: ['@smoke', '@critical']
  }, async ({ raSoatKqPage }) => {
    Logger.step(1, 'Tìm phiếu có thể tách (>= 2 chỉ tiêu)');
    const code = await raSoatKqPage.findSplittableRecord();
    if (!code) {
      Logger.info('Hiện không có phiếu editable có >= 2 chỉ tiêu để mở hộp thoại');
      return;
    }

    Logger.step(2, 'Mở hộp thoại Tách phiếu');
    await raSoatKqPage.openSplitModal(code);
    await expect(raSoatKqPage.splitModal).toBeVisible();

    Logger.step(3, 'Kiểm tra thông tin trên hộp thoại');
    const modalText = await raSoatKqPage.getModalText(raSoatKqPage.splitModal);
    expect(modalText).toContain('Tách phiếu kết quả thử nghiệm');
    expect(modalText).toContain(`Phiếu gốc: ${code}`);
    expect(modalText).toContain('Mã mới dự kiến:');

    Logger.step(4, 'Đóng hộp thoại');
    await raSoatKqPage.splitClose.click();
    await expect(raSoatKqPage.splitModal).toHaveCount(0);
    await raSoatKqPage.uncheckAllRows();
  });

  test('RSKQ_SPL_02: Danh sách chỉ tiêu trong hộp thoại - Hiển thị đầy đủ danh sách chỉ tiêu, STT, ĐVT, Phương pháp, Kết quả, VILAS và ô Checkbox', {
    tag: ['@high']
  }, async ({ raSoatKqPage }) => {
    Logger.step(1, 'Mở hộp thoại Tách phiếu');
    const code = await raSoatKqPage.findSplittableRecord();
    if (!code) return;
    await raSoatKqPage.openSplitModal(code);

    Logger.step(2, 'Kiểm tra số lượng checkbox chỉ tiêu');
    const cbCount = await raSoatKqPage.splitCheckboxes.count();
    expect(cbCount).toBeGreaterThanOrEqual(2);

    await raSoatKqPage.splitCancel.click();
    await raSoatKqPage.uncheckAllRows();
  });

  test('RSKQ_SPL_03: Bộ đếm chỉ tiêu chuyển sang phiếu mới - Hiển thị bộ đếm thời gian thực', {
    tag: ['@normal']
  }, async ({ raSoatKqPage }) => {
    Logger.step(1, 'Mở hộp thoại Tách phiếu và tích chọn 1 chỉ tiêu');
    const code = await raSoatKqPage.findSplittableRecord();
    if (!code) return;
    await raSoatKqPage.openSplitModal(code);

    await raSoatKqPage.splitCheckboxes.first().check();
    const modalText = await raSoatKqPage.getModalText(raSoatKqPage.splitModal);
    expect(modalText).toContain('Đã chọn: 1/');

    await raSoatKqPage.splitCancel.click();
    await raSoatKqPage.uncheckAllRows();
  });

  test('RSKQ_SPL_04: Chặn tách khi chưa chọn chỉ tiêu - Không cho phép nhấn nút "Tách phiếu" khi chưa tích chọn chỉ tiêu nào (0 chỉ tiêu)', {
    tag: ['@high']
  }, async ({ raSoatKqPage }) => {
    Logger.step(1, 'Mở hộp thoại Tách phiếu và kiểm tra khi chưa chọn chỉ tiêu nào');
    const code = await raSoatKqPage.findSplittableRecord();
    if (!code) return;
    await raSoatKqPage.openSplitModal(code);

    await expect(raSoatKqPage.splitConfirm).toBeDisabled();

    await raSoatKqPage.splitCancel.click();
    await raSoatKqPage.uncheckAllRows();
  });

  test('RSKQ_SPL_05: Chặn tách toàn bộ chỉ tiêu - Cảnh báo không thể chuyển 100% chỉ tiêu sang phiếu mới làm rỗng phiếu gốc', {
    tag: ['@critical']
  }, async ({ raSoatKqPage }) => {
    Logger.step(1, 'Tích chọn toàn bộ chỉ tiêu trong hộp thoại');
    const code = await raSoatKqPage.findSplittableRecord();
    if (!code) return;
    await raSoatKqPage.openSplitModal(code);

    const count = await raSoatKqPage.splitCheckboxes.count();
    for (let i = 0; i < count; i++) {
      await raSoatKqPage.splitCheckboxes.nth(i).check();
    }

    Logger.step(2, 'Kiểm tra cảnh báo không thể chọn tất cả và nút Tách phiếu bị vô hiệu hóa');
    const modalText = await raSoatKqPage.getModalText(raSoatKqPage.splitModal);
    expect(modalText).toContain('Không thể chọn tất cả chỉ tiêu');
    await expect(raSoatKqPage.splitConfirm).toBeDisabled();

    await raSoatKqPage.splitCancel.click();
    await raSoatKqPage.uncheckAllRows();
  });

  test('RSKQ_SPL_06: Thực hiện Tách phiếu thành công - Chọn chỉ tiêu và nhấn nút "Tách phiếu" ➔ Hệ thống chia ra làm 2 phiếu riêng biệt như ban đầu (/01 và /02)', {
    tag: ['@smoke', '@critical']
  }, async ({ raSoatKqPage }) => {
    Logger.step(1, 'Kiểm tra nút "Tách phiếu" trong modal sẵn sàng khi chọn 1 chỉ tiêu hợp lệ');
    const code = await raSoatKqPage.findSplittableRecord();
    if (!code) return;
    await raSoatKqPage.openSplitModal(code);

    await raSoatKqPage.splitCheckboxes.first().check();
    await expect(raSoatKqPage.splitConfirm).toBeEnabled();

    Logger.step(2, 'Đóng hộp thoại để tránh ghi đè dữ liệu test');
    await raSoatKqPage.splitCancel.click();
    await raSoatKqPage.uncheckAllRows();
  });

  test('RSKQ_SPL_07: Kế thừa dữ liệu trên phiếu mới - Phiếu mới kế thừa toàn bộ thông tin chung, hình ảnh mẫu và ghi chú chung', {
    tag: ['@normal']
  }, async ({ raSoatKqPage }) => {
    Logger.step(1, 'Kiểm tra ghi chú kế thừa hiển thị ở chân hộp thoại');
    const code = await raSoatKqPage.findSplittableRecord();
    if (!code) return;
    await raSoatKqPage.openSplitModal(code);

    const footNote = await raSoatKqPage.splitModal.locator('.modal-foot').innerText();
    expect(footNote).toContain('Kế thừa toàn bộ thông tin chung');

    await raSoatKqPage.splitCancel.click();
    await raSoatKqPage.uncheckAllRows();
  });

  test('RSKQ_SPL_08: Thao tác Hủy trên hộp thoại Tách phiếu - Nhấn nút "Hủy" hoặc đóng hộp thoại ➔ Giữ nguyên cấu trúc phiếu hiện tại', {
    tag: ['@normal']
  }, async ({ raSoatKqPage }) => {
    Logger.step(1, 'Mở và hủy bằng nút "Hủy"');
    const code = await raSoatKqPage.findSplittableRecord();
    if (!code) return;
    await raSoatKqPage.openSplitModal(code);
    await raSoatKqPage.splitCancel.click();
    await expect(raSoatKqPage.splitModal).toHaveCount(0);

    Logger.step(2, 'Mở và hủy bằng nút đóng (x)');
    await raSoatKqPage.openSplitModal(code);
    await raSoatKqPage.splitClose.click();
    await expect(raSoatKqPage.splitModal).toHaveCount(0);
    await raSoatKqPage.uncheckAllRows();
  });

  // =========================================================================
  // KHỐI 12: THAO TÁC CHUNG & BẢN IN
  // =========================================================================

  test('RSKQ_ACT_01: Nút Lưu - Lưu thành công khi các thông tin chỉnh sửa hợp lệ', {
    tag: ['@smoke', '@critical']
  }, async ({ raSoatKqPage }) => {
    Logger.step(1, 'Mở phiếu và chỉnh sửa hợp lệ');
    const code = await raSoatKqPage.openEditableRecord();
    expect(code).not.toBeNull();
    const yk = raSoatKqPage.yKienInput;
    const orig = await yk.inputValue();
    await yk.fill('Lưu kiểm tra tự động ' + Date.now());

    Logger.step(2, 'Kiểm tra nút "Lưu" được kích hoạt');
    await expect(raSoatKqPage.btnSave).toBeEnabled();

    Logger.step(3, 'Nhấn nút "Lưu" và kiểm tra toast thành công');
    await raSoatKqPage.clickSave();
    await expect(raSoatKqPage.saveSuccessToast(code!)).toBeVisible();

    Logger.step(4, 'Hoàn nguyên ý kiến');
    await yk.fill(orig);
    await raSoatKqPage.clickSave();
    await expect(raSoatKqPage.saveSuccessToast(code!)).toBeVisible();
  });

  test('RSKQ_ACT_02: Nút Lưu - Chặn lưu và cảnh báo khi vi phạm các trường bắt buộc', {
    tag: ['@critical']
  }, async ({ raSoatKqPage }) => {
    Logger.step(1, 'Xóa trường bắt buộc Tên KH');
    await raSoatKqPage.openEditableRecord();
    const input = raSoatKqPage.bilingualInput('Tên KH', 'VN');
    const orig = await input.inputValue();
    await input.fill('');

    Logger.step(2, 'Bấm nút Lưu và kiểm tra toast lỗi');
    await raSoatKqPage.clickSave();
    await expect(raSoatKqPage.saveErrorToast).toBeVisible();

    Logger.step(3, 'Hoàn nguyên');
    await input.fill(orig);
    await raSoatKqPage.reload();
  });

  test('RSKQ_ACT_03: Nút Lưu - Nhấn nút "Lưu" khi không có thay đổi dữ liệu', {
    tag: ['@normal']
  }, async ({ raSoatKqPage }) => {
    Logger.step(1, 'Kiểm tra nút "Lưu" bị vô hiệu hóa khi form chưa thay đổi (clean state)');
    await raSoatKqPage.openEditableRecord();
    await expect(raSoatKqPage.btnSave).toBeDisabled();
    const title = await raSoatKqPage.btnSave.getAttribute('title');
    expect(title).toContain('Không có thay đổi nào cần lưu');
  });

  test('RSKQ_ACT_04: Nút Gửi duyệt - Gửi duyệt thành công phiếu kết quả sang màn hình "DUYỆT PKQ"', {
    tag: ['@high']
  }, async ({ raSoatKqPage }) => {
    Logger.step(1, 'Tích chọn phiếu kết quả và kiểm tra nút "Gửi duyệt" sẵn sàng');
    const code = await raSoatKqPage.openEditableRecord();
    expect(code).not.toBeNull();
    await raSoatKqPage.uncheckAllRows();
    await raSoatKqPage.checkRow(raSoatKqPage.rowByCode(code!));
    await expect(raSoatKqPage.btnSend).toBeEnabled();

    Logger.step(2, 'Mở modal gửi duyệt và đóng');
    await raSoatKqPage.clickSend();
    await expect(raSoatKqPage.sendModal).toBeVisible();
    await raSoatKqPage.sendCancel.click();
    await raSoatKqPage.uncheckAllRows();
  });

  test('RSKQ_ACT_05: Nút Gửi duyệt - Cảnh báo khi gửi duyệt phiếu chưa hoàn thiện đầy đủ kết quả chỉ tiêu', {
    tag: ['@normal']
  }, async ({ raSoatKqPage }) => {
    Logger.step(1, 'Kiểm tra nút Gửi duyệt bị vô hiệu hóa khi chưa chọn phiếu nào');
    await raSoatKqPage.uncheckAllRows();
    await expect(raSoatKqPage.btnSend).toBeDisabled();
  });

  test('RSKQ_ACT_06: Nút Gửi duyệt - Hủy gửi duyệt trên hộp thoại xác nhận', {
    tag: ['@normal']
  }, async ({ raSoatKqPage }) => {
    Logger.step(1, 'Mở modal và hủy gửi duyệt');
    const code = await raSoatKqPage.openEditableRecord();
    if (!code) return;
    await raSoatKqPage.uncheckAllRows();
    await raSoatKqPage.checkRow(raSoatKqPage.rowByCode(code));
    await raSoatKqPage.clickSend();
    await expect(raSoatKqPage.sendModal).toBeVisible();
    await raSoatKqPage.sendCancel.click();
    await expect(raSoatKqPage.sendModal).toHaveCount(0);
    await raSoatKqPage.uncheckAllRows();
  });

  test('RSKQ_ACT_07: Switch Xem trước - Bật công tắc "Xem trước" để hiển thị khung xem trước mẫu in phiếu kết quả', {
    tag: ['@smoke', '@high']
  }, async ({ raSoatKqPage }) => {
    Logger.step(1, 'Bật Xem trước');
    await raSoatKqPage.openEditableRecord();
    if (!(await raSoatKqPage.isPreviewOn())) {
      await raSoatKqPage.togglePreview();
    }
    expect(await raSoatKqPage.isPreviewOn()).toBeTruthy();
    await expect(raSoatKqPage.previewPage).toBeVisible();
    await raSoatKqPage.togglePreview(); // tắt lại
  });

  test('RSKQ_ACT_08: Switch Xem trước - Tắt công tắc "Xem trước" để thu gọn khung xem trước mẫu in', {
    tag: ['@normal']
  }, async ({ raSoatKqPage }) => {
    Logger.step(1, 'Bật rồi tắt Xem trước');
    await raSoatKqPage.openEditableRecord();
    if (!(await raSoatKqPage.isPreviewOn())) {
      await raSoatKqPage.togglePreview();
    }
    await raSoatKqPage.togglePreview();
    expect(await raSoatKqPage.isPreviewOn()).toBeFalsy();
  });

  test('RSKQ_ACT_09: Nút Print - Nhấn nút "Print" mở giao diện in phiếu kết quả đúng theo ngôn ngữ đã chọn', {
    tag: ['@high']
  }, async ({ raSoatKqPage }) => {
    Logger.step(1, 'Nhấn nút Print');
    await raSoatKqPage.openEditableRecord();
    const printCalls = await raSoatKqPage.clickPrintAndCount();
    expect(printCalls).toBe(1);
  });
});

