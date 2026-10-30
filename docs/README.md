# TÀI LIỆU CÁC LUỒNG CHUẨN HỆ THỐNG VNTEST LIMS

Thư mục này chứa toàn bộ tài liệu đặc tả các luồng kiểm thử chuẩn (Standard Test Flows Specification) tương ứng với từng màn hình đã được viết script automation trong hệ thống **VNTEST LIMS**.

Tất cả các tài liệu đều được định dạng chuẩn theo mẫu đặc tả 8 phần, sử dụng biểu đồ Mermaid trực quan, bảng ma trận phân khu giao diện (UI Layout Matrix) chống vỡ khung, và ma trận 100% test cases tự động hóa bằng Playwright.

---

## 📑 Danh Mục Màn Hình & Trạng Thái Hoàn Thành (17 Phân Hệ — 645 Test Cases)

| STT | Mã Module | Tên Màn Hình / Chức Năng | File Tài Liệu | Số Test Cases | Trạng Thái |
| :---: | :--- | :--- | :--- | :---: | :---: |
| 01 | **AUTH** | Đăng nhập & Xác thực hệ thống | [01_login.md](file:///home/thai.hoang.dinh/VNTEST_Automation/docs/01_login.md) | 14 | ✅ Đã hoàn thành |
| 02 | **CONTRACTS** | Quản lý Hợp đồng | [02_contracts.md](file:///home/thai.hoang.dinh/VNTEST_Automation/docs/02_contracts.md) | 78 | ✅ Đã hoàn thành |
| 03 | **TEST_REQUESTS** | Báo giá & Yêu cầu thử nghiệm | [03_test_requests.md](file:///home/thai.hoang.dinh/VNTEST_Automation/docs/03_test_requests.md) | 47 | ✅ Đã hoàn thành |
| 04 | **RECEPTION** | Tiếp nhận YCTN & Bàn giao mẫu | [04_test_request_reception.md](file:///home/thai.hoang.dinh/VNTEST_Automation/docs/04_test_request_reception.md) | 28 | ✅ Đã hoàn thành |
| 05 | **ASSIGNMENT** | Giao việc thử nghiệm | [05_task_assignment.md](file:///home/thai.hoang.dinh/VNTEST_Automation/docs/05_task_assignment.md) | 30 | ✅ Đã hoàn thành |
| 06 | **HO_SO_TN** | Hồ sơ TN / Nhật ký thử nghiệm | [06_ho_so_tn.md](file:///home/thai.hoang.dinh/VNTEST_Automation/docs/06_ho_so_tn.md) | 24 | ✅ Đã hoàn thành |
| 07 | **TRUONG_BP** | Trưởng BP Kiểm tra | [07_truong_bp_ktra.md](file:///home/thai.hoang.dinh/VNTEST_Automation/docs/07_truong_bp_ktra.md) | 25 | ✅ Đã hoàn thành |
| 08 | **RA_SOAT_KQ** | Rà soát kết quả | [08_ra_soat_kq.md](file:///home/thai.hoang.dinh/VNTEST_Automation/docs/08_ra_soat_kq.md) | 116 | ✅ Đã hoàn thành |
| 09 | **DUYET_PKQ** | Duyệt Phiếu Kết Quả | [09_duyet_pkq.md](file:///home/thai.hoang.dinh/VNTEST_Automation/docs/09_duyet_pkq.md) | 48 | ✅ Đã hoàn thành |
| 10 | **DK_SCAN** | Đính kèm Scan & Tra cứu kết quả | [10_dinh_kem_scan.md](file:///home/thai.hoang.dinh/VNTEST_Automation/docs/10_dinh_kem_scan.md) | 57 | ✅ Đã hoàn thành |
| 11 | **CUSTOMERS** | Quản lý Khách hàng | [11_customers.md](file:///home/thai.hoang.dinh/VNTEST_Automation/docs/11_customers.md) | 41 | ✅ Đã hoàn thành |
| 12 | **LEADS** | Quản lý Lead / Cơ hội | [12_leads.md](file:///home/thai.hoang.dinh/VNTEST_Automation/docs/12_leads.md) | 17 | ✅ Đã hoàn thành |
| 13 | **PARTNERS** | Quản lý Đối tác Doanh nghiệp | [13_partners.md](file:///home/thai.hoang.dinh/VNTEST_Automation/docs/13_partners.md) | 18 | ✅ Đã hoàn thành |
| 14 | **COLLAB** | Quản lý Cộng tác viên Cá nhân | [14_collaborators.md](file:///home/thai.hoang.dinh/VNTEST_Automation/docs/14_collaborators.md) | 18 | ✅ Đã hoàn thành |
| 15 | **PERSONNEL** | Quản lý Nhân sự & Phân quyền | [15_personnel.md](file:///home/thai.hoang.dinh/VNTEST_Automation/docs/15_personnel.md) | 27 | ✅ Đã hoàn thành |
| 16 | **FORMULA** | Quản lý Công thức tính toán | [16_formula.md](file:///home/thai.hoang.dinh/VNTEST_Automation/docs/16_formula.md) | 40 | ✅ Đã hoàn thành |
| 17 | **CRITERIA** | Quản lý Chỉ tiêu lẻ & Nền mẫu | [17_single_criteria.md](file:///home/thai.hoang.dinh/VNTEST_Automation/docs/17_single_criteria.md) | 17 | ✅ Đã hoàn thành |
| **TỔNG** | **17 MODULES** | **TOÀN BỘ HỆ THỐNG VNTEST LIMS** | **17 FILE SPECS** | **645** | **✅ 100% HOÀN THÀNH** |

---

## 🏗️ Cấu Trúc Khung Mẫu Đặc Tả Chuẩn (8 Phần Bắt Buộc)

Mỗi file tài liệu đều tuân thủ nghiêm ngặt 8 phần đặc tả kỹ thuật:
1. **Thông tin định danh tài liệu & Metadata:** Mã tài liệu, Đường dẫn URL, Đối tượng sử dụng, Cơ sở dữ liệu liên kết, Test Script Playwright, Page Object Model (POM), File Test Data.
2. **Mục lục điều hướng nhanh (Quick Navigation Table of Contents):** 8 anchor links tiện lợi cho việc tra cứu.
3. **Phần 1: Định vị màn hình & Tổng quan tính năng (Overview & UI Layout Matrix):** Mục đích cốt lõi, Biểu đồ luồng bố cục Mermaid kết hợp Bảng ma trận phân khu (Section, Vị trí, Thành phần chính, Nghiệp vụ) chống vỡ khung trên giao diện di động/màn hình nhỏ.
4. **Phần 2: Sơ đồ phân tích luồng trực quan (Mermaid Flowcharts):** Sơ đồ Master Flow, sơ đồ chu trình xử lý trạng thái và sơ đồ luồng chi tiết từng tính năng trọng yếu.
5. **Phần 3: Phân quyền & Điều kiện kích hoạt (Access & Permissions):** Ma trận RBAC Matrix cho các vai trò và ràng buộc điều kiện chuyển trạng thái.
6. **Phần 4: Đặc tả chi tiết các Use Cases chức năng (Functional Use Cases):** Từng Use Case (UC-01, UC-02...) nêu rõ Tác nhân, Tiền điều kiện, Luồng sự kiện chính, Ngoại lệ và Hậu điều kiện.
7. **Phần 5: Đặc tả chi tiết trường dữ liệu (Field Specifications Matrix):** Bảng chi tiết toàn bộ các trường (STT, Tên hiển thị, Phân loại, Bắt buộc, Ràng buộc validation).
8. **Phần 6: Ma trận nút bấm & Tương tác giao diện (Action Buttons Matrix):** Bảng chi tiết tất cả các nút bấm/icon thao tác (Trạng thái mặc định, Điều kiện kích hoạt, Hành vi hệ thống).
9. **Phần 7: Quy tắc nghiệp vụ & Luồng xử lý lỗi (Business Rules & Error Handling):** Danh sách Business Rules cốt lõi (BR-01, BR-02...) và Bảng ma trận xử lý lỗi/ngoại lệ (Mã lỗi, Nguyên nhân, Phản hồi, Hướng xử lý).
10. **Phần 8: Kế hoạch kiểm thử & Ma trận Test Cases Automation:** Bảng thống kê độ phủ các nhóm và Bảng chi tiết từng Test Case (Mã TC, Phân nhóm luồng, Tên kịch bản, Thao tác thực hiện, Kết quả mong đợi, Mức độ ưu tiên, Mapping Page Object).
