# Task 04: Spin Wheel Game (Vòng quay may mắn)

## Tiêu đề
Phát triển Spin Wheel Game - Vòng quay chọn chữ/vần

## Mô tả (Description)
Yêu cầu từ `SYSTEM_PROMPT.md` có đề cập đến `spin_wheel_items` là danh sách các chữ hoặc vần. Trò chơi này mang tính chất giải trí cao, cho trẻ quay vòng quay để nhận được một chữ cái/vần và học cách phát âm nó.

## Mục tiêu (Objectives)
- Tạo component `SpinWheelGame.tsx`.
- Dựng UI Vòng quay có thể chứa số lượng item linh hoạt dựa vào mảng `spin_wheel_items` từ JSON.
- Tạo hiệu ứng quay mượt mà (sử dụng CSS Transform hoặc thư viện chuyên dụng, kết hợp `framer-motion`).
- Thêm âm thanh khi đang quay (tích tắc) và khi dừng lại (tada).
- Khi vòng quay dừng lại ở chữ/vần nào, hiển thị Popup lớn kèm nút phát âm Text-to-Speech chữ đó.

## Kỹ thuật (Tech Stack)
- React, TypeScript
- `framer-motion` cho hiệu ứng quay
- Web Speech API
