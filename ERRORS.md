# Nhật ký Lỗi và Sự cố (ERRORS.md)

## [2026-05-12 08:45] - Lỗi Dropdown Danh mục trống (Critical)

- **Type**: Logic / Integration
- **Severity**: Critical
- **File**: `backend/src/main/java/com/example/demo/service/CategoryService.java`
- **Agent**: Antigravity
- **Root Cause**: Backend không khởi tạo danh mục mặc định cho người dùng mới đăng ký, dẫn đến frontend không có dữ liệu để chọn khi tạo giao dịch.
- **Error Message**: 
  ```
  Validation error: category name is required
  ```
- **Fix Applied**: Thêm phương thức `createDefaultCategories` và gọi trong `AuthService.register`.
- **Prevention**: Sử dụng cơ chế khởi tạo dữ liệu mặc định (Data Seeding) cho người dùng mới.
- **Status**: Fixed

---

## [2026-05-12 09:02] - Xung đột Port 8081 (Deployment)

- **Type**: Process / Infrastructure
- **Severity**: High
- **File**: N/A (Backend Startup)
- **Agent**: Antigravity
- **Root Cause**: Tiến trình Java cũ không được giải phóng hoàn toàn, chiếm dụng port 8081.
- **Error Message**: 
  ```
  Web server failed to start. Port 8081 was already in use.
  ```
- **Fix Applied**: Sử dụng lệnh `Stop-Process -Force` để kill process treo.
- **Prevention**: Cải thiện quy trình shutdown và sử dụng containerization (Docker).
- **Status**: Fixed

---

## [2026-05-12 09:10] - Dữ liệu Form rò rỉ (UX)

- **Type**: UI / State Management
- **Severity**: Medium
- **File**: `frontend/src/pages/Login.jsx`, `frontend/src/pages/Register.jsx`
- **Agent**: Antigravity
- **Root Cause**: React state không được reset khi chuyển đổi giữa các trang authentication.
- **Error Message**: N/A (Residual data in input fields)
- **Fix Applied**: Thêm `useEffect` để reset state khi mount component.
- **Prevention**: Luôn thực hiện dọn dẹp state cho các trang form nhạy cảm.
- **Status**: Fixed

---

## [2026-05-12 09:15] - Lỗi Thiếu Thư Viện Kiểm Thử Frontend (DevOps)

- **Type**: Configuration / CI
- **Severity**: Medium
- **File**: `frontend/package.json`, `frontend/vitest.config.js`
- **Agent**: Antigravity
- **Root Cause**: Dự án không có sẵn môi trường kiểm thử cho frontend, thiếu devDependencies cần thiết.
- **Error Message**: 
  ```
  sh: vitest: command not found
  ```
- **Fix Applied**: Cài đặt `vitest`, `jsdom`, `@testing-library/react` và cấu hình file script.
- **Prevention**: Khởi tạo project với bộ Testing Suite đầy đủ.
- **Status**: Fixed

---

## [2026-05-12 09:20] - Lỗi Logic Test Case Backend (QA)

- **Type**: Logic / Testing
- **Severity**: Low
- **File**: `backend/src/test/java/com/example/demo/service/UserServiceTest.java`
- **Agent**: Antigravity
- **Root Cause**: Sử dụng `assertNull` cho kiểu dữ liệu trả về là `boolean` (false).
- **Error Message**: 
  ```
  org.opentest4j.AssertionFailedError: expected: <null> but was: <false>
  ```
- **Fix Applied**: Sửa thành `assertFalse`.
- **Prevention**: Kiểm tra kỹ kiểu trả về của method trước khi viết test assertion.
- **Status**: Fixed

---

## [2026-05-12 09:25] - Cảnh báo Kích thước Biểu đồ (UI/UX)

- **Type**: UI / Performance
- **Severity**: Low
- **File**: `frontend/src/components/Dashboard/OverviewChart.jsx`
- **Agent**: Antigravity
- **Root Cause**: Chart.js render trước khi container có kích thước (thường gặp trong Flex/Grid layout chưa hoàn tất).
- **Error Message**: 
  ```
  [Chart.js] Canvas container has 0 height or width, canvas will be rendered as 0x0
  ```
- **Fix Applied**: Quy định kích thước container cố định hoặc sử dụng ResizeHandler.
- **Prevention**: Luôn đảm bảo container của canvas có kích thước xác định trước khi khởi tạo chart.
- **Status**: Fixed
---

## [2026-05-12 10:35] - Incident 07: Lỗi Cập nhật Giao dịch (Method Not Supported)

- **Type**: Backend API
- **Severity**: High
- **Layer**: L3: Backend
- **File**: `backend/src/main/java/com/example/demo/controller/TransactionController.java`
- **Agent**: Antigravity
- **Root Cause**: Thiếu endpoint `@PutMapping` trong Controller và server không tự động nạp lại code mới do thiếu DevTools dẫn đến lỗi 405 (Method Not Allowed) bị map thành 500.
- **Error Message**: 
  ```
  {"message":"Da x?y ra l?i khng mong mu?n: Request method 'PUT' is not supported","status":500}
  ```
- **Fix Applied**: Thêm `@PutMapping`, cài đặt `spring-boot-devtools` và restart server.
- **Prevention**: Sử dụng hot-reload và luôn chạy bộ Test API trước khi bàn giao.
- **Status**: Fixed
