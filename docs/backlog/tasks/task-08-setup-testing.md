# Task 08: Thiết lập Framework Test & Unit Tests

## 🎯 Mục tiêu
Đảm bảo độ ổn định và chính xác của các logic tính toán (XP, streak, progress) và State Management trong quá trình trẻ học bài và chơi mini-games. Hạn chế tối đa bug khi tích hợp các tính năng mới.

## 🛠 Tech Stack
- Jest
- React Testing Library

## 📝 Chi tiết công việc
1. **Cài đặt & Cấu hình:**
   - Cài đặt Jest, React Testing Library và các dependencies liên quan cho Next.js App Router.
   - Thiết lập cấu hình `jest.config.js` hoặc `jest.config.ts`.
2. **Kiểm thử Hàm Tính Toán (Game Engine/Utils):**
   - Viết Unit Tests cho logic cộng/trừ XP.
   - Viết Unit Tests cho logic tính Streak (chuỗi ngày học, chuỗi câu trả lời đúng).
3. **Kiểm thử State Management (LessonContext):**
   - Đảm bảo trạng thái (state) bài học được cập nhật đúng sau mỗi hành động của người dùng.
   - Kiểm thử việc lưu/đọc state vào/từ Local Storage (nếu có).
4. **Kiểm thử Component cơ bản:**
   - Đảm bảo các component hiển thị điểm số và tiến độ render đúng dựa trên state truyền vào.

## 🏆 Tiêu chí hoàn thành (DoD)
- [x] Chạy `npm run test` thành công không có lỗi.
- [x] Coverage của các hàm logic lõi (utils, hooks) đạt mức tối thiểu (vd: 80%).
- [x] Mọi thay đổi về state (XP, streak) đều có test case đi kèm và pass toàn bộ.
