import { test } from '../../fixtures/base.fixture';
import users from '../../../test-data/users.json';

test('Inspect THONG TIN KET QUA section on Truong BP Ktra', async ({ loginPage, page }) => {
  await loginPage.open('/dang-nhap');
  await loginPage.login(users.validUser.username, users.validUser.password);
  await page.waitForURL('https://vntest-lims.pirago.work/', { timeout: 15000 });

  await page.goto('https://vntest-lims.pirago.work/truong-bo-phan-kiem-tra');
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(2000);

  // Find the "THÔNG TIN KẾT QUẢ" section
  const section = page.locator('section, div, .card').filter({ hasText: 'THÔNG TIN KẾT QUẢ' }).first();
  console.log('Section exists:', await section.count());

  // Check the accordion header (e.g. TR152300019)
  const yctnHead = section.locator('.yctn-head, [class*="head"], [class*="accordion"], button, .cursor-pointer').first();
  console.log('Accordion head text:', await yctnHead.innerText());

  // Check Table 0 inputs
  const table0 = section.locator('table').first();
  const ths = await table0.locator('thead th').allInnerTexts();
  console.log('Table 0 THs:', ths);

  const inputs = await table0.locator('tbody tr input').all();
  console.log('Table 0 input count:', inputs.length);
  for (let i = 0; i < inputs.length; i++) {
    const val = await inputs[i].inputValue();
    const dis = await inputs[i].isDisabled();
    const cls = await inputs[i].getAttribute('class');
    console.log(`Table 0 Input ${i}: val="${val}", dis=${dis}, class="${cls}"`);
  }

  // Check if there are buttons inside or near this section (like Lưu kết quả, etc.)
  const buttons = await section.locator('button').allInnerTexts();
  console.log('Buttons inside section:', buttons);
});
