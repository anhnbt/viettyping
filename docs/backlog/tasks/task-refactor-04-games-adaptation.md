## Parent

[PRD-GameEngine-Orchestration-Refactor.md](file:///Users/wanbi/Code/oss/projects/viettyping/docs/PRD-GameEngine-Orchestration-Refactor.md)

## What to build

Di chuyển và nâng cấp tất cả các trò chơi mini-game còn lại (`MatchingGame`, `SpinWheelGame`, `FillInTheBlankGame`, `MultipleChoiceGame`) để tuân thủ interface `GameAdapterProps`. 

Tích hợp hoàn chỉnh tất cả các game này vào hàm render của `LessonCoordinator` dựa trên thuộc tính cấu hình trò chơi nhận được từ `LessonConfig`.

## Acceptance criteria

- [x] Các component `MatchingGame`, `SpinWheelGame`, `FillInTheBlankGame` và `MultipleChoiceGame` được refactor để sử dụng kiểu `GameAdapterProps` và trả về đúng `TelemetryPayload` khi kết thúc.
- [x] Hàm `renderCurrentGame` trong `LessonCoordinator` được cập nhật để render chính xác tất cả các loại game này theo đúng thứ tự cấu hình của bài học.
- [x] Tất cả các game khi chạy thử nghiệm đều chuyển tiếp thành công sang game tiếp theo sau khi gửi telemetry hoàn thành.

## Blocked by

- [task-refactor-03-typing-integration.md](file:///Users/wanbi/Code/oss/projects/viettyping/docs/backlog/tasks/task-refactor-03-typing-integration.md)
