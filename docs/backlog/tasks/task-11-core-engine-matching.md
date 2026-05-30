## Parent

[PRD-GameController-Refactor](../PRD-GameController-Refactor.md)

## Cần xây dựng (What to build)

- Định nghĩa Type theo kiểu Discriminated Unions cho `MiniGameConfig` và `LessonConfig` trong `src/types/lesson.ts`.
- Tái cấu trúc file `sample_lesson.json` sao cho `mini_games` là một Mảng (Array).
- Tạo component `LessonRunner` tinh gọn (Game Engine).
- Đảm bảo `MatchingGame` tích hợp đúng và chạy mượt mà từ đầu đến cuối bên trong engine.
- Tác vụ này thiết lập nền móng kiến trúc (Yêu cầu có sự tham gia của con người - HITL).

## Tiêu chí nghiệm thu (Acceptance criteria)

- [x] `src/types/lesson.ts` được định kiểu đầy đủ sử dụng Discriminated Unions.
- [x] `sample_lesson.json` sử dụng cấu trúc Mảng (Array) cho `mini_games`.
- [x] `LessonRunner` là một component thuần túy (pure component - chỉ nhận props, quản lý `currentIndex`, không chứa side effects).
- [x] `LessonRunner` render chính xác `MatchingGame` dựa trên thứ tự trong mảng.
- [x] HITL: Review kiến trúc props của `LessonRunner` và cấu trúc Type Definitions.

## Phụ thuộc (Blocked by)

Không có - có thể bắt đầu ngay lập tức
