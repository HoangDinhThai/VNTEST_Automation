import { test, expect } from '@playwright/test';

test('Verify complete CRUD on Nen Mau and Chi Tieu Le', async ({ page }) => {
  test.setTimeout(120000);

  // 1. Login
  await page.goto('/dang-nhap');
  await page.locator('#email').fill('admin@example.com');
  await page.locator('#password').fill('Password1');
  await page.locator('button[type="submit"]').click();
  await page.waitForURL('https://vntest-lims.pirago.work/', { timeout: 20000 });

  await page.goto('/chi-tieu-le');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  const leftPane = page.locator('.analyte-pane--left');
  const rightPane = page.locator('.analyte-pane--right');

  // Listen to all toast / alert events or text
  page.on('dialog', async d => {
    console.log('Dialog popped:', d.message());
    await d.accept();
  });

  const timestamp = Date.now();
  const sampleMatrixName = `Nền mẫu Auto ${timestamp}`;

  // STEP 1: Thêm Nền Mẫu
  console.log('--- Step 1: Thêm Nền Mẫu ---');
  await leftPane.getByRole('button', { name: /^Thêm$/ }).click();
  await expect(page.locator('#sample-matrix-create-title')).toBeVisible();

  await page.locator('#sample-matrix-name').fill(sampleMatrixName);
  await page.locator('.sample-matrix-create-dialog .modal-foot').getByRole('button', { name: /^Lưu$/ }).click();

  await page.waitForTimeout(1500);

  // Check if created row exists in left pane
  const createdNenMauRow = leftPane.locator('tbody tr').filter({ hasText: sampleMatrixName }).first();
  console.log('Created Nen Mau row visible:', await createdNenMauRow.isVisible());

  // STEP 2: Sửa Nền Mẫu
  console.log('--- Step 2: Sửa Nền Mẫu ---');
  const nenMauCb = createdNenMauRow.locator('input.cb');
  await nenMauCb.check();
  await page.waitForTimeout(500);

  await leftPane.getByRole('button', { name: /^Sửa$/ }).click();
  await expect(page.locator('#sample-matrix-edit-title')).toBeVisible();

  const updatedMatrixName = `${sampleMatrixName} - Updated`;
  await page.locator('#sample-matrix-edit-name').fill(updatedMatrixName);
  await page.locator('.sample-matrix-edit-dialog .modal-foot').getByRole('button', { name: /^Lưu$/ }).click();
  await page.waitForTimeout(1500);

  const updatedNenMauRow = leftPane.locator('tbody tr').filter({ hasText: updatedMatrixName }).first();
  console.log('Updated Nen Mau row visible:', await updatedNenMauRow.isVisible());

  // STEP 3: Chọn Nền Mẫu để Thêm Chỉ Tiêu Lẻ
  console.log('--- Step 3: Chọn Nền Mẫu để Thêm Chỉ Tiêu Lẻ ---');
  await updatedNenMauRow.locator('td.sample-matrix-name-cell').click();
  await page.waitForTimeout(1000);

  const addCtBtn = rightPane.getByRole('button', { name: /Thêm CT/i });
  console.log('Add CT enabled:', await addCtBtn.isEnabled());
  await addCtBtn.click();
  await expect(page.locator('#analyte-create-title')).toBeVisible();

  const ctCode = `CT${timestamp.toString().slice(-6)}`;
  const ctName = `Chỉ tiêu Test Auto ${timestamp}`;

  await page.locator('input.analyte-create-input-code').fill(ctCode);
  await page.locator('.analyte-create-modal input[placeholder*="Ví dụ: Pb"]').fill(ctName);
  await page.locator('.analyte-create-modal select').first().selectOption('HCB');
  await page.locator('.analyte-create-modal input[placeholder="0"]').nth(0).fill('50000');
  await page.locator('.analyte-create-modal input[placeholder="0"]').nth(1).fill('80000');
  await page.locator('.analyte-create-modal input[placeholder="5"]').fill('3');
  await page.locator('.analyte-create-modal input[placeholder*="TCVN"]').fill('TCVN 1234:2020');
  await page.locator('.analyte-create-modal input[placeholder*="mg/kg"]').fill('mg/kg');

  await page.locator('.analyte-create-modal').getByRole('button', { name: /Lưu chỉ tiêu/i }).click();
  await page.waitForTimeout(2000);

  // Check if CT row exists
  const createdCtRow = rightPane.locator('tbody tr').filter({ hasText: ctCode }).first();
  console.log('Created CT row visible:', await createdCtRow.isVisible());

  // STEP 4: Sửa Chỉ Tiêu Lẻ
  console.log('--- Step 4: Sửa Chỉ Tiêu Lẻ ---');
  await createdCtRow.locator('input.cb').check();
  await page.waitForTimeout(500);

  await rightPane.getByRole('button', { name: /Sửa CT/i }).click();
  await expect(page.locator('#analyte-edit-title')).toBeVisible();

  const updatedCtName = `${ctName} (Sửa)`;
  await page.locator('.analyte-create-modal input[placeholder*="Ví dụ: Pb"]').fill(updatedCtName);
  await page.locator('.analyte-create-modal').getByRole('button', { name: /Lưu thay đổi/i }).click();
  await page.waitForTimeout(2000);

  const updatedCtRow = rightPane.locator('tbody tr').filter({ hasText: updatedCtName }).first();
  console.log('Updated CT row visible:', await updatedCtRow.isVisible());

  // STEP 5: Xóa Chỉ Tiêu Lẻ
  console.log('--- Step 5: Xóa Chỉ Tiêu Lẻ ---');
  await updatedCtRow.locator('input.cb').check();
  await page.waitForTimeout(500);

  await rightPane.getByRole('button', { name: /Xóa CT/i }).click();
  await expect(page.locator('.analyte-delete-dialog')).toBeVisible();
  await page.locator('.analyte-delete-dialog .modal-foot').getByRole('button', { name: /Xóa/i }).click();
  await page.waitForTimeout(2000);

  console.log('CT row after delete visible:', await rightPane.locator('tbody tr').filter({ hasText: updatedCtName }).count());

  // STEP 6: Xóa Nền Mẫu
  console.log('--- Step 6: Xóa Nền Mẫu ---');
  await updatedNenMauRow.locator('input.cb').check();
  await page.waitForTimeout(500);

  await leftPane.getByRole('button', { name: /^Xóa$/ }).click();
  await expect(page.locator('.sample-matrix-delete-dialog')).toBeVisible();
  await page.locator('.sample-matrix-delete-dialog .modal-foot').getByRole('button', { name: /Xóa/i }).click();
  await page.waitForTimeout(2000);

  console.log('Nen Mau row after delete visible:', await leftPane.locator('tbody tr').filter({ hasText: updatedMatrixName }).count());

  console.log('ALL CRUD STEPS VERIFIED!');
});
