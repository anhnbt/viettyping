# Task 06: Multiple Choice (Trắc nghiệm)

## Tiêu đề
Phát triển Multiple Choice Game - Trắc nghiệm củng cố kiến thức

## Mô tả (Description)
Dựa trên mảng `multiple_choice`, trò chơi sẽ đưa ra một câu hỏi (question), một đáp án đúng (correct_answer) và các đáp án gây nhiễu (distractors).

## Mục tiêu (Objectives)
- Tạo component `MultipleChoiceGame.tsx`.
- Hiển thị câu hỏi ở khu vực trên cùng (font chữ to, rõ ràng).
- Trộn lẫn `correct_answer` và `distractors` thành một mảng lựa chọn ngẫu nhiên.
- Tạo UI dạng danh sách các nút bấm lớn (Card button) cho các lựa chọn.
- Xử lý tương tác chọn đáp án: highlight màu xanh lá nếu đúng, đỏ nếu sai và vô hiệu hóa các nút khác.
- Sau khi chọn đúng, chuyển sang câu tiếp theo hoặc hoàn thành game.

## Kỹ thuật (Tech Stack)
- React, TypeScript
- Tailwind CSS
- Tiện ích trộn mảng (Shuffle array utility)
