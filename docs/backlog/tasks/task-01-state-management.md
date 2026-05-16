# Task 01: State Management & Game Controller

## Tiêu đề
Xây dựng hệ thống quản lý trạng thái học tập (State Management) và bộ điều khiển trò chơi (Game Controller)

## Mô tả (Description)
Dựa trên yêu cầu từ `SYSTEM_PROMPT.md`, ứng dụng cần quản lý tiến trình của một bài học, bao gồm điểm XP, chuỗi thắng (streak), và tiến độ hoàn thành các mini-game. Cần một bộ điều khiển (Game Controller) để chuyển đổi giữa các màn chơi (Flashcard -> Matching -> True/False...) theo file JSON cấu hình.

## Mục tiêu (Objectives)
- Thiết lập `LessonContext` sử dụng React Context API (hoặc Zustand) để lưu trữ state cục bộ của bài học: `currentXP`, `streak`, `progress`, `completedGames`.
- Tạo `GameController` component (`/lesson/games/page.tsx` hoặc tương tự) chịu trách nhiệm đọc dữ liệu JSON và render đúng mini-game hiện tại.
- Viết logic tính toán thanh tiến độ dựa trên tổng số activity trong `sample_lesson.json`.

## Kỹ thuật (Tech Stack)
- React Context API / Custom Hooks
- TypeScript Interfaces (cập nhật type cho State)
