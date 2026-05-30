## Parent

[PRD-GameEngine-Orchestration-Refactor.md](file:///Users/wanbi/Code/oss/projects/viettyping/docs/PRD-GameEngine-Orchestration-Refactor.md)

## What to build

Cài đặt luồng tổng kết kết quả học tập và cơ chế vinh danh (Gamification & Rewards Flow). Khi trẻ hoàn thành toàn bộ hoạt động trong `LessonCoordinator`, module này sẽ kích hoạt sự kiện `onAllActivitiesComplete` truyền thông tin tổng hợp về trang route cha `/lesson/page.tsx` (trang route hoạt động như một Adapter).

Trang route cha sẽ đảm nhận trách nhiệm cập nhật Context API (`useLesson`) để cộng điểm XP, lưu trạng thái bài học, mở khóa huy hiệu (Badge), đồng thời kích hoạt hiệu ứng pháo hoa `canvas-confetti` và âm thanh reo hò chúc mừng. Sau đó, hiển thị màn hình chúc mừng vinh danh trẻ.

## Acceptance criteria

- [x] Cài đặt màn hình chúc mừng vinh danh đẹp mắt, rực rỡ, sử dụng hiệu ứng lướt từ dưới lên của `framer-motion`.
- [x] Sự kiện bắn pháo hoa confetti và âm thanh reo hò chúc mừng hoạt động đồng bộ ngay sau khi hoàn thành tất cả các bước bài học.
- [x] Context `useLesson` được cập nhật chính xác tổng điểm XP từ bài học và mở khóa đúng Huy hiệu được cấu hình trong `base_rewards`.
- [x] Đơn giản hóa toàn bộ các route cũ `/lesson/typing` và `/lesson/games` để chuyển hướng hoặc chạy tập trung tại `/lesson` bằng component `LessonCoordinator`.
- [x] Trình duyệt chạy trơn tru toàn bộ luồng bài học từ đầu đến cuối không lỗi, không trễ.

## Blocked by

- [task-refactor-04-games-adaptation.md](file:///Users/wanbi/Code/oss/projects/viettyping/docs/backlog/tasks/task-refactor-04-games-adaptation.md)
