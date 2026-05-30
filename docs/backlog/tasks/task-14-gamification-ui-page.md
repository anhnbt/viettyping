## Parent

[PRD-GameController-Refactor](../PRD-GameController-Refactor.md)

## Cần xây dựng (What to build)

- Loại bỏ hoàn toàn các hook Context hoặc các side-effect còn sót lại khỏi `LessonRunner`.
- Tái cấu trúc `src/app/lesson/games/page.tsx` đóng vai trò là một Adapter. Cụ thể phải làm:
  - Lấy/Truyền dữ liệu cấu hình JSON cho `LessonRunner`.
  - Xử lý callback `onAllGamesComplete`.
  - Gọi an toàn hàm cộng điểm (`addXP`) và các cờ hoàn thành vào `LessonContext`.
  - Kích hoạt hiệu ứng pháo hoa (Confetti), âm thanh, và hiển thị Popup Hoàn thành.
- Bước này đảm bảo phần Ngữ cảnh Gamification (Gamification Context) được tách biệt hoàn toàn khỏi Game Engine.

## Tiêu chí nghiệm thu (Acceptance criteria)

- [x] `LessonRunner` không import bất kỳ Context hook hay thư viện side-effect nào.
- [x] `page.tsx` xử lý chính xác hàm `onAllGamesComplete`.
- [x] XP và Huy hiệu được cập nhật đáng tin cậy vào Context mà không xảy ra race conditions.
- [x] Giao diện Gamification (Confetti/Popup) hoạt động chính xác như trước.
- [x] HITL: Review lại các chuyển cảnh của page và các Side-effects của Gamification để đảm bảo không rò rỉ bộ nhớ (memory leaks).

## Phụ thuộc (Blocked by)

- [task-11-core-engine-matching.md](./task-11-core-engine-matching.md)
- [task-12-true-false-spin-wheel.md](./task-12-true-false-spin-wheel.md)
- [task-13-fill-blank-multi-choice.md](./task-13-fill-blank-multi-choice.md)
