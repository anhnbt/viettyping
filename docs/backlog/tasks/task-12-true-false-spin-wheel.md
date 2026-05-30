## Parent

[PRD-GameController-Refactor](../PRD-GameController-Refactor.md)

## Cần xây dựng (What to build)

- Mở rộng cấu trúc Discriminated Unions trong `src/types/lesson.ts` để hỗ trợ `TrueFalseItem` và `SpinWheelItem`.
- Cập nhật `sample_lesson.json` để thêm các game này vào mảng `mini_games`.
- Tích hợp các component `TrueFalseGame` và `SpinWheelGame` vào bộ điều phối `LessonRunner`.

## Tiêu chí nghiệm thu (Acceptance criteria)

- [x] Các Types cho True/False và Spin Wheel đã được định nghĩa và thêm vào Union.
- [x] Dữ liệu JSON cho các game này tuân thủ đúng cấu trúc Mảng (Array) mới.
- [x] `LessonRunner` xử lý chuyển đổi mượt mà vào và ra khỏi các game này.

## Phụ thuộc (Blocked by)

- [task-11-core-engine-matching.md](./task-11-core-engine-matching.md)
