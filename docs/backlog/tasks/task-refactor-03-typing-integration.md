## Parent

[PRD-GameEngine-Orchestration-Refactor.md](file:///Users/wanbi/Code/oss/projects/viettyping/docs/PRD-GameEngine-Orchestration-Refactor.md)

## What to build

Tích hợp màn hình Luyện gõ phím (`TypingPractice.tsx`) trực tiếp vào trong bộ điều phối `LessonCoordinator` như một bước trong luồng bài học (tránh việc chuyển hướng trang routing sang `/lesson/typing`). 

Đồng thời, cập nhật cơ chế báo cáo kết quả của gõ phím để trả về `TelemetryPayload` chuẩn hóa (bao gồm các chỉ số WPM, độ chính xác Accuracy, và số ký tự/từ gõ sai) thông qua callback hoàn thành, thay vì sử dụng callback tùy chỉnh trước đây.

## Acceptance criteria

- [x] `LessonCoordinator` hỗ trợ bước luyện gõ phím (`typing_practice`) trong luồng chuyển cảnh của nó.
- [x] Component `TypingPractice` được tích hợp vào `LessonCoordinator` mà không bị vỡ giao diện, hỗ trợ hiển thị bàn phím ảo thích hợp.
- [x] Khi trẻ gõ xong hoặc hết giờ, `TypingPractice` gửi về đầy đủ dữ liệu telemetry thông qua callback tương thích với `TelemetryPayload`.
- [x] Tích hợp kiểm thử để đảm bảo sau khi hoàn thành phần Flashcards, `LessonCoordinator` chuyển sang bước Luyện gõ phím rồi mới sang phần Mini-games.

## Blocked by

- [task-refactor-02-lesson-coordinator.md](file:///Users/wanbi/Code/oss/projects/viettyping/docs/backlog/tasks/task-refactor-02-lesson-coordinator.md)
