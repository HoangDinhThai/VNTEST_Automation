import { test, expect } from '@playwright/test';
import { Logger } from '../../utils/logger';
import { TestDataGenerator } from '../../utils/test-data-generator';

test.describe('Module Kiểm tra Khung Framework Playwright', () => {
  test('Khởi chạy trình duyệt và truy cập trang chủ thành công', async ({ page }) => {
    Logger.step(1, 'Điều hướng tới trang Playwright Demo');
    await page.goto('https://demo.playwright.dev/todomvc/');

    Logger.step(2, 'Kiểm tra tiêu đề trang và header');
    await expect(page.getByRole('heading', { name: 'todos' })).toBeVisible();

    Logger.step(3, 'Tạo công việc mới với dữ liệu sinh động duy nhất');
    const todoTitle = TestDataGenerator.generateCode('TODO', 4);
    const newTodoInput = page.getByPlaceholder('What needs to be done?');
    await newTodoInput.fill(todoTitle);
    await newTodoInput.press('Enter');

    Logger.step('Verify', 'Kiểm tra công việc vừa tạo hiển thị trong danh sách');
    const todoItem = page.getByTestId('todo-title').filter({ hasText: todoTitle });
    await expect(todoItem).toBeVisible();
  });
});

