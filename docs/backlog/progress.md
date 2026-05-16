# Tiến Độ Dự Án VietTyping (Sprint Planning)

*Cập nhật lần cuối: 2026-05-16*

Dự án VietTyping là hệ thống Web App học tiếng Việt tương tác cao dành cho trẻ 6 tuổi, dựa trên cấu trúc Lesson Config (JSON) định nghĩa bởi AI và quản lý bởi Admin. Để dễ dàng quản lý, công việc được chia thành các Sprint.

---

## 🏁 SPRINT 1: Kiến trúc cốt lõi & Giao diện cơ bản (Foundation & Core UI)
**Trạng thái:** ✅ Đã hoàn thành

- [x] **Quyết định kiến trúc:** Sử dụng "Offline AI Lesson Generation" (ADR-0001). Web app sẽ chạy dựa trên file tĩnh JSON thay vì gọi API AI real-time.
- [x] **Cấu trúc Dữ liệu:** Thiết kế thành công schema JSON chuẩn trong `SYSTEM_PROMPT.md`.
- [x] **Dữ liệu mẫu:** Tạo file `src/data/sample_lesson.json` với chủ đề "Làm quen với chữ B và vần BA".
- [x] **Tài sản (Assets):** Sinh hình ảnh 2D Vector Art thực tế và lưu trữ thành công vào `public/assets/`.
- [x] **Core UI - Flashcard:** Hiệu ứng lật 3D sống động (`framer-motion`) và tích hợp Text-to-Speech.
- [x] **Core UI - Lesson Layout:** Thiết kế Glassmorphism, hiển thị thanh trạng thái, tích hợp Carousel lật thẻ.
- [x] **Màn hình Chính:** Cập nhật Hero Section, Call-to-action chuyển hướng người dùng.
- [x] **DevOps & Tài liệu:** Xuất bản PRD lên GitHub Issue #4, sửa lỗi ESLint, cấu hình `lucide-react`, Build Production thành công.

---

## 🏃‍♂️ SPRINT 2: State Management & Cốt lõi Gamification
**Trạng thái:** 🚧 Đang thực hiện

- [x] **[Task 01]** Xây dựng State Management & Game Controller ([Chi tiết](./tasks/task-01-state-management.md))
  - [x] Khởi tạo `LessonContext` (hoặc Zustand) để quản lý `currentXP`, `streak`, `progress`, `completedGames`.
  - [x] Dựng khung màn hình chơi game (`/lesson/games`) với vai trò "Game Controller".
- [x] **[Task 07]** Gamification & Rewards ([Chi tiết](./tasks/task-07-gamification-rewards.md))
  - [x] Xây dựng **Progress Bar** động ở header.
  - [x] Kích hoạt hiệu ứng bắn pháo hoa (`canvas-confetti`) và Popup mở khóa Huy hiệu.
  - [x] Bổ sung âm thanh hiệu ứng (Ting! cho câu trả lời đúng, Buzz! cho câu sai).

---

## 📅 SPRINT 3: Lõi Mini Games (Phần 1 - Nền tảng)
**Trạng thái:** ⏳ Kế hoạch (To Do)

- [x] **[Task 02]** Matching Game ([Chi tiết](./tasks/task-02-matching-game.md))
  - [x] Logic kéo thả nối từ vựng với hình ảnh sử dụng `@dnd-kit/core`.
- [x] **[Task 03]** True/False Game ([Chi tiết](./tasks/task-03-true-false-game.md))
  - [x] Hiển thị câu hỏi/hình ảnh và yêu cầu trẻ chọn Đúng hoặc Sai.

---

## 📅 SPRINT 4: Lõi Mini Games (Phần 2 - Nâng cao)
**Trạng thái:** ⏳ Kế hoạch (To Do)

- [x] **[Task 04]** Spin Wheel Game ([Chi tiết](./tasks/task-04-spin-wheel-game.md))
  - [x] Vòng quay may mắn chọn chữ/vần kèm hiệu ứng quay và phát âm.
- [x] **[Task 05]** Fill in the Blank ([Chi tiết](./tasks/task-05-fill-blank-game.md))
  - [x] Cung cấp bàn phím ảo, xử lý logic điền ký tự bị khuyết.
- [x] **[Task 06]** Multiple Choice ([Chi tiết](./tasks/task-06-multiple-choice-game.md))
  - [x] Trắc nghiệm hiển thị đáp án đúng trộn lẫn với các phương án nhiễu.

---

## 📅 SPRINT 5: Kiểm thử & Tối ưu hoá (Testing & Polishing)
**Trạng thái:** ✅ Đã hoàn thành

- [x] **[Task 08]** Kiểm thử phần mềm (Testing) ([Chi tiết](./tasks/task-08-setup-testing.md))
  - [x] Cài đặt framework test (Jest / React Testing Library).
  - [x] Viết Unit Tests cho các hàm tính toán XP và logic của Game Engine.
  - [x] Viết kiểm thử cho State Management để đảm bảo tiến trình bài học không bị lỗi.
- [x] **[Task 09]** Tối ưu hóa UI/UX (Polishing) ([Chi tiết](./tasks/task-09-ui-ux-optimization.md))
  - [x] Tối ưu hóa UI/UX, thêm các vi hiệu ứng (micro-animations) để tăng độ mượt mà.
