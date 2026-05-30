## Parent

[PRD-GameEngine-Orchestration-Refactor.md](file:///Users/wanbi/Code/oss/projects/viettyping/docs/PRD-GameEngine-Orchestration-Refactor.md)

## What to build

Xây dựng bộ điều phối trung tâm `LessonCoordinator` (Deep Module) để quản lý luồng bài học (Pedagogical Flow). Trong lát cắt này, coordinator sẽ nạp cấu hình `LessonConfig`, hiển thị bước giới thiệu Flashcards đầu tiên cho trẻ, sau đó chuyển cảnh mượt mà (`framer-motion`) sang chơi game Đúng/Sai (game đã cập nhật ở Task 1) ngay trên một màn hình duy nhất.

Tích hợp thanh tiến độ `ProgressBar` đồng bộ xuyên suốt bài học phản ánh vị trí hiện tại của trẻ. Viết Integration Test cho `LessonCoordinator` để kiểm tra luồng chuyển tiếp này.

## Acceptance criteria

- [x] Tạo mới component `LessonCoordinator` nhận props `config: LessonConfig`, `onActivityComplete`, và `onAllActivitiesComplete`.
- [x] Giao diện Flashcards hiển thị chính xác dựa trên cấu hình và có nút tiếp tục để chuyển sang game.
- [x] Khi nhấn tiếp tục ở Flashcards, hệ thống chuyển giao diện sang game Đúng/Sai (`TrueFalseGame`) một cách mượt mà thông qua hiệu ứng chuyển cảnh của `framer-motion`.
- [x] Thanh tiến độ `ProgressBar` hiển thị trên đầu màn hình cập nhật tỷ lệ hoàn thành chính xác khi trẻ đổi hoạt động.
- [x] Viết thành công Integration Test cho `LessonCoordinator` để xác minh luồng chuyển tiếp giao diện từ Flashcard sang Game hoạt động đúng như mong đợi.

## Blocked by

- [task-refactor-01-game-interface.md](file:///Users/wanbi/Code/oss/projects/viettyping/docs/backlog/tasks/task-refactor-01-game-interface.md)
