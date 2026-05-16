# Task 02: Matching Game (Trò chơi ghép hình/từ)

## Tiêu đề
Phát triển Matching Game - Nối từ vựng với hình ảnh

## Mô tả (Description)
Theo `SYSTEM_PROMPT.md`, ứng dụng cần một trò chơi kéo thả để trẻ em nối từ vựng hiển thị với hình ảnh minh họa tương ứng. Đây là mini-game đầu tiên trong chuỗi trò chơi của bài học.

## Mục tiêu (Objectives)
- Tạo component `MatchingGame.tsx`.
- Hiển thị danh sách các thẻ từ vựng và danh sách các hình ảnh dựa trên mảng `matching_game` trong JSON.
- Tích hợp thư viện kéo thả (`@dnd-kit/core` hoặc `react-beautiful-dnd`) để cho phép kéo từ vựng thả vào ô hình ảnh (hoặc ngược lại).
- Thêm hiệu ứng âm thanh (Ting/Buzz) và hiệu ứng hình ảnh (đổi màu xanh khi đúng, đỏ rung lắc khi sai bằng `framer-motion`).
- Cập nhật state hoàn thành trò chơi lên `LessonContext`.

## Kỹ thuật (Tech Stack)
- `@dnd-kit/core`
- `framer-motion`
- Tailwind CSS
