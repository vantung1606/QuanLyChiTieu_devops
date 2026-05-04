# AI Skill: Chuyên Gia Triển Khai Dự Án Full-Stack & DevOps (Standard 2026)

Bộ kỹ năng này được thiết kế để đảm bảo mọi dự án đều đạt điểm tối đa theo thang đo DevOps chuyên nghiệp và tránh các lỗi "Fail ngay".

## 1. NGUYÊN TẮC KHỞI TẠO (CHƯƠNG 1 & 2)
- **Mục tiêu:** Luôn hướng tới hệ thống chạy trên Production (Render/Vercel/VPS).
- **Kiến trúc:** 
  - Layer: User → Frontend (React) → Backend (Spring Boot/Node) → Database (MySQL/Postgres).
  - Luôn vẽ sơ đồ luồng dữ liệu và luồng CI/CD trước khi code.

## 2. QUY TRÌNH TRIỂN KHAI KỸ THUẬT (CHƯƠNG 3)
### 2.1 Backend & Frontend
- Không Hardcode: Mọi cấu hình (URL, Port, DB Credential) phải dùng Biến môi trường.
- Health Check: Bắt buộc có `GET /api/health` trả về JSON `{ "status": "UP" }`.
- Console Clean: Frontend không được để lại lỗi đỏ hoặc `console.log` thừa.

### 2.2 Docker (20 Điểm)
- Dockerfile: Sử dụng Multi-stage build để tối ưu dung lượng ảnh.
- Docker Compose: Phải có `healthcheck` cho Database để Backend chờ DB sẵn sàng.
- Logs: Phải cấu hình để dễ dàng truy xuất `docker logs`.

### 2.3 Git & Branching
- Luôn tuân thủ: `main` (Production), `develop` (Integration), `feature/*` (Phát triển chức năng).
- Lịch sử commit: Phải có ít nhất 5-10 commit thể hiện tiến độ, không commit gộp 1 lần.

### 2.4 CI/CD - GitHub Actions (15 Điểm)
- File `.github/workflows/ci.yml` phải đủ 4 bước: Install → Lint → Test → Build.
- Không Bypass: Pipeline fail là code không được merge.

## 3. QUY TRÌNH QUẢN LÝ SỰ CỐ (INCIDENT - CHƯƠNG 5)
Mỗi khi gặp lỗi trong quá trình hỗ trợ User, AI phải ghi lại theo format:
- **Incident X:** [Tên lỗi]
- **Hiện tượng:** [Mô tả lỗi trên màn hình]
- **Log:** [Snippet log lỗi]
- **Layer:** [L1-Infrastructure / L2-DB / L3-BE / L4-FE]
- **Nguyên nhân:** [Tại sao lỗi xảy ra]
- **Cách fix:** [Các lệnh/code đã dùng để sửa]
- **Cách phòng tránh:** [Làm sao để không bị lại]

## 4. TIÊU CHÍ NGHIỆM THU (CHECKLIST)
- [ ] Có Docker & Docker Compose chạy ổn định.
- [ ] Có CI/CD pass (Xanh trên GitHub).
- [ ] Đã Deploy lên URL công khai (Render/Vercel).
- [ ] Đã có ít nhất 3 Incident được ghi lại.
- [ ] Không có thông tin nhạy cảm (Password/Key) trong code commit.

---
**CẢNH BÁO TIÊU CHÍ FAIL NGAY:**
1. Không có Docker.
2. Chỉ chạy Local, không có link Public.
3. Không có CI/CD.
4. Hardcode cấu hình.
