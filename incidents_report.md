# BÁO CÁO SỰ CỐ (INCIDENT REPORT) - EXPENSE TRACKER PROJECT

Dưới đây là 3 sự cố kỹ thuật xảy ra trong quá trình triển khai hệ thống và cách đã xử lý.

---

### Incident 1: Lỗi kết nối Docker Daemon trên Windows
- **Hiện tượng:** Khi chạy `docker-compose up --build`, terminal báo lỗi: `open //./pipe/dockerDesktopLinuxEngine: The system cannot find the file specified`.
- **Log:** `unable to get image 'mysql:8.0': error during connect: Get ...`
- **Layer:** L1 - Infrastructure (Hạ tầng).
- **Nguyên nhân:** Ứng dụng Docker Desktop chưa được khởi động hoặc dịch vụ Docker Engine bị treo, dẫn đến việc CLI không thể giao tiếp với Docker daemon qua Named Pipe.
- **Cách fix:** Khởi động Docker Desktop, chờ trạng thái chuyển sang "Running". Chạy `docker version` để kiểm tra kết nối trước khi chạy lại compose.
- **Cách phòng tránh:** Luôn kiểm tra trạng thái Docker Desktop trước khi thực hiện các lệnh liên quan đến container.

---

### Incident 2: Lỗi Push code lên GitHub (Refspec Error)
- **Hiện tượng:** Sau khi `git init` và tạo remote, lệnh `git push -u origin main` bị từ chối.
- **Log:** `error: src refspec main does not match any`.
- **Layer:** L1 - Infrastructure (Quản lý mã nguồn).
- **Nguyên nhân:** Người dùng thực hiện lệnh push khi chưa có bất kỳ commit nào được tạo ra trong repository địa phương (Local Repository).
- **Cách fix:** Thực hiện chuỗi lệnh: `git add .` -> `git commit -m "Initial commit"` -> `git push -u origin main`.
- **Cách phòng tránh:** Luôn đảm bảo đã `commit` ít nhất một lần trước khi thực hiện `push` lần đầu tiên.

---

### Incident 3: Lỗi khởi động Backend (Invalid Spring Boot Version)
- **Hiện tượng:** Lệnh `./mvnw spring-boot:run` bị lỗi ngay khi vừa bắt đầu, không thể tải dependencies.
- **Log:** `[ERROR] [Help 1] http://cwiki.apache.org/confluence/display/MAVEN/MojoExecutionException` và log Spring Boot hiện phiên bản `v4.0.6`.
- **Layer:** L3 - Backend.
- **Nguyên nhân:** File `pom.xml` cấu hình sai phiên bản Spring Boot (4.0.6 không tồn tại) và sử dụng các tên starter không chuẩn (như `spring-boot-starter-webmvc`).
- **Cách fix:** Hạ cấp (Downgrade) phiên bản Spring Boot về bản ổn định `3.4.5` và sửa lại các tên starter về chuẩn (ví dụ: `spring-boot-starter-web`).
- **Cách phòng tránh:** Sử dụng Spring Initializr để tạo dự án hoặc tham chiếu tài liệu chính thức để chọn đúng phiên bản ổn định (GA versions).
