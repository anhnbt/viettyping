## Parent

[PRD-GameController-Refactor](../PRD-GameController-Refactor.md)

## Cần xây dựng (What to build)

- Mở rộng cấu trúc Discriminated Unions trong `src/types/lesson.ts` để hỗ trợ `FillInTheBlankItem` và `MultipleChoiceItem`.
- Cập nhật `sample_lesson.json` để thêm các game này vào mảng `mini_games`.
- Tích hợp các component `FillInTheBlankGame` và `MultipleChoiceGame` vào bộ điều phối `LessonRunner`.
- Đảm bảo toàn bộ vòng lặp từ game số 1 đến game thứ N chạy trơn tru, không gặp lỗi.

## Tiêu chí nghiệm thu (Acceptance criteria)

- [x] Các Types cho Fill in the Blank và Multiple Choice đã được định nghĩa và thêm vào Union.
- [x] Dữ liệu JSON cho các game này tuân thủ đúng cấu trúc Mảng (Array) mới.
- [x] `LessonRunner` chuyển đổi chính xác qua tất cả 5 loại game trong cùng một bài học.

## Phụ thuộc (Blocked by)

- [task-11-core-engine-matching.md](./task-11-core-engine-matching.md)
