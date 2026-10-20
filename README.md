# VNTEST Automation Framework (Playwright + TypeScript)

Dự án Automation Test hoàn chỉnh xây dựng trên nền tảng **Playwright**, **TypeScript**, áp dụng mô hình **Page Object Model (POM)** chuẩn dự án VNTEST.

---

## 📁 Cấu Trúc Dự Án

```
VNTEST_Automation/
├── .agent/                     # AI Skills, Rules & Workflows
│   ├── skills/                 # 22 Custom Skills
│   ├── rules/                  # Playwright, Selenium, Appium & Manual Testing rules
│   └── workflows/              # 16 Quy trình automation
├── .github/
│   └── workflows/
│       └── playwright.yml      # CI/CD Pipeline GitHub Actions
├── src/
│   ├── fixtures/
│   │   └── base.fixture.ts     # Playwright Test mở rộng với Page Objects
│   ├── pages/                  # Page Object classes (POM)
│   │   ├── base.page.ts        # Base Page chứa hành động chung
│   │   ├── login.page.ts       # Page Object Đăng nhập
│   │   └── dashboard.page.ts   # Page Object Bảng điều khiển / Trang chủ
│   ├── utils/                  # Tiện ích bổ trợ
│   │   ├── env.config.ts       # Đọc biến môi trường từ .env
│   │   ├── logger.ts           # Structured Logger
│   │   ├── test-data-generator.ts # Sinh dữ liệu duy nhất [prefix]_[testName]_[timestamp]
│   │   └── wait-helper.ts      # Smart Wait helpers
│   └── tests/                  # Kịch bản kiểm thử (Test specs)
│       ├── auth/
│       │   └── login.spec.ts   # Test suite Đăng nhập
│       └── example/
│           └── sample.spec.ts  # Test suite mẫu chạy kiểm tra framework
├── test-data/                  # Dữ liệu kiểm thử cố định
│   └── users.json              # Dữ liệu tài khoản test
├── .env.example                # File mẫu cấu hình biến môi trường
├── .env                        # File cấu hình môi trường thực tế
├── .gitignore                  # Bỏ qua node_modules, reports, credentials
├── package.json                # Quản lý thư viện và scripts
├── playwright.config.ts        # Cấu hình Playwright chuẩn 1920x1080
├── tsconfig.json               # Cấu hình TypeScript & path aliases
├── GEMINI.md                   # Quy chuẩn AI & UI Debugging
├── RULE_GLOBAL.md              # Quy tắc dọn dẹp và an toàn dữ liệu
└── TIPS_QUOTA.md               # Cẩm nang tối ưu Quota
```

---

## 🚀 Hướng Dẫn Cài Đặt & Sử Dụng

### 1. Cài đặt thư viện dependencies

```bash
npm install
```

### 2. Cài đặt Browser Playwright

```bash
npx playwright install chromium
# Hoặc cài toàn bộ browser:
npx playwright install
```

### 3. Cấu hình biến môi trường

Chỉnh sửa file `.env` theo môi trường test của bạn:

```ini
BASE_URL=https://your-app-url.com
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_password
ENV=staging
```

---

## 🧪 Các Lệnh Chạy Test

| Lệnh | Mục đích |
|---|---|
| `npm test` | Chạy toàn bộ test suites |
| `npm run test:headed` | Chạy test ở chế độ có giao diện (headed mode - chuẩn debug) |
| `npm run test:ui` | Mở Playwright UI Mode trực quan |
| `npm run test:debug` | Debug từng bước bằng Playwright Inspector |
| `npm run test:auth` | Chạy riêng module Authentication / Login |
| `npm run report` | Mở báo cáo HTML Playwright Report |
| `npm run allure:generate` | Sinh báo cáo Allure Report |
| `npm run allure:open` | Mở báo cáo Allure Report trên trình duyệt |

---

## 🎯 Quy Chuẩn Viết Test Trong Dự Án

1. **Mô hình Page Object Model (POM):**
   - **Page classes:** Chỉ khai báo Locators và các phương thức thao tác UI. **TUYỆT ĐỐI KHÔNG** đặt assertion trong Page classes.
   - **Test classes:** Chứa logic luồng test và toàn bộ Assertions (`expect()`).
2. **Thứ tự ưu tiên Locators (Semantic):**
   - `getByRole()` ➔ `getByLabel()` ➔ `getByPlaceholder()` ➔ `getByText()` ➔ `getByTestId()` ➔ `locator()`.
3. **Chiến lược Wait:**
   - Sử dụng auto-waiting mặc định và Web-First Assertions (`await expect(locator).toBeVisible()`).
   - **NGHIÊM CẤM** dùng `page.waitForTimeout()` hoặc `setTimeout`.
4. **Dữ liệu kiểm thử:**
   - Dùng `TestDataGenerator` để sinh dữ liệu duy nhất và có thể truy vết (`auto_createCustomer_20260402_A3F2@vntest.vn`).
5. **Viewport:**
   - Mặc định toàn bộ test chạy với Desktop Viewport chuẩn **`1920x1080`**.

