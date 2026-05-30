## Parent

[PRD-GameEngine-Orchestration-Refactor.md](file:///Users/wanbi/Code/oss/projects/viettyping/docs/PRD-GameEngine-Orchestration-Refactor.md)

## What to build

Định nghĩa kiểu dữ liệu và ranh giới (Seam) chung cho tất cả các trò chơi (Mini-games) thông qua interface `TelemetryPayload` và `GameAdapterProps`. Cập nhật game Đúng/Sai (`TrueFalseGame`) để tuân thủ interface mới này, đảm bảo khi trẻ hoàn thành trò chơi, component sẽ thu thập và gửi về đầy đủ dữ liệu đo lường (thời gian chơi, điểm số, các câu trả lời sai nếu có) thông qua callback `onComplete`.

Viết Unit Test độc lập cho game Đúng/Sai để xác minh hành vi đầu ra và định dạng dữ liệu telemetry.

## Acceptance criteria

- [x] Định nghĩa kiểu `TelemetryPayload` và interface `GameAdapterProps` chuẩn trong file type.
- [x] Component `TrueFalseGame` được cập nhật để sử dụng và tuân thủ đúng interface `GameAdapterProps`.
- [x] Khi hoàn thành trò chơi Đúng/Sai, sự kiện `onComplete` được kích hoạt và truyền đúng đối tượng `TelemetryPayload` chứa điểm số, thời gian làm bài thực tế và danh sách câu trả lời sai.
- [x] Viết thành công Unit Test bằng Jest / React Testing Library cho `TrueFalseGame` để xác minh component phát ra đúng telemetry khi kết thúc.

## Blocked by

None - can start immediately
