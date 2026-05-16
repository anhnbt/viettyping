# Task 05: Fill in the Blank (Điền vào chỗ trống)

## Tiêu đề
Phát triển Fill in the Blank Game - Luyện gõ và ghi nhớ mặt chữ

## Mô tả (Description)
JSON cấu hình cung cấp `full_word`, `missing_char`, và `sentence`. Trò chơi sẽ hiển thị một câu hoặc một từ bị khuyết một ký tự/dấu. Trẻ em cần chọn (hoặc gõ) đúng ký tự còn thiếu vào ô trống.

## Mục tiêu (Objectives)
- Tạo component `FillInTheBlankGame.tsx`.
- Hiển thị `sentence` với một ô input nổi bật thay thế cho vị trí bị khuyết.
- Cung cấp một bàn phím ảo đơn giản (chứa `missing_char` và 2-3 ký tự nhiễu) ở phía dưới để trẻ bấm thay vì phải dùng bàn phím thật (do đối tượng là trẻ 6 tuổi).
- Xử lý logic so sánh ký tự trẻ nhập vào với `missing_char`.
- Hiển thị animation chúc mừng và đọc Text-to-Speech `full_word` khi điền đúng.

## Kỹ thuật (Tech Stack)
- React, TypeScript
- Tailwind CSS
- `framer-motion` (hiệu ứng pop-in cho bàn phím ảo)
