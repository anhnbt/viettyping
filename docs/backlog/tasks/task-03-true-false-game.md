# Task 03: True/False Game (Trò chơi Đúng/Sai)

## Tiêu đề
Phát triển True/False Game - Nhận diện từ đúng chính tả

## Mô tả (Description)
Từ cấu trúc JSON, `true_false_game` cung cấp `correct_word` (từ đúng) và `distractor_word` (từ sai chính tả). Trẻ em sẽ nhìn thấy hình ảnh và một từ (có thể là đúng hoặc sai), sau đó phải chọn nút "Đúng" hoặc "Sai".

## Mục tiêu (Objectives)
- Tạo component `TrueFalseGame.tsx`.
- Thiết kế UI hiển thị hình ảnh lớn ở giữa, bên dưới là một thẻ từ vựng ngẫu nhiên chọn từ `correct_word` hoặc `distractor_word`.
- Tạo 2 nút hành động lớn: "Đúng" (màu xanh lá, icon Check) và "Sai" (màu đỏ, icon X) dùng `lucide-react`.
- Xử lý logic kiểm tra kết quả: Nếu từ đang hiện là `correct_word` và bấm Đúng -> Thắng. Nếu từ là `distractor_word` và bấm Sai -> Thắng. Ngược lại -> Thua (yêu cầu thử lại).
- Hiệu ứng `framer-motion` cho thẻ từ vựng khi xuất hiện.

## Kỹ thuật (Tech Stack)
- React, TypeScript
- Tailwind CSS, `framer-motion`
- `lucide-react`
