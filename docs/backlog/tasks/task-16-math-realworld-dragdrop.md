## Parent

[PRD-Pedagogical-Improvements.md](file:///Users/wanbi/Code/oss/projects/viettyping/docs/PRD-Pedagogical-Improvements.md)

## What to build

Xây dựng trò chơi Toán học thực tế tương tác cao dạng kéo thả (Drag and Drop) sử dụng `@dnd-kit/core`.

Trò chơi cho phép trẻ kéo các vật thể trực quan (như đồng xu, quả táo, viên kẹo) vào vùng mục tiêu (ví dụ: ví tiền, giỏ hàng, hộp quà) để giải quyết các phép toán cộng trừ cơ bản. Tích hợp cơ chế "Second Chance" giúp trẻ tự kiểm tra và chỉnh sửa lại khi tính toán sai thay vì ngay lập tức báo thất bại.

## Acceptance criteria

- [x] Thiết kế giao diện kéo thả mượt mà cho trẻ 6 tuổi với các mục tiêu và vật thể kéo thả to, rõ ràng, dễ bắt dính (snap).
- [x] Xử lý logic phép toán cộng trừ dựa trên số lượng vật thể được thả thành công vào vùng mục tiêu.
- [x] Triển khai hiệu ứng rung khung hình (Visual Shake) nhẹ nhàng và làm nổi bật các vật thể khi câu trả lời chưa đúng, nhắc nhở trẻ đếm lại cẩn thận.
- [x] Gửi thông số `mathRetries` (số lần thử lại) vào `TelemetryPayload` để theo dõi mức độ cẩn thận của trẻ.
- [x] Đảm bảo ứng dụng chạy mượt mà trên cả thiết bị di động (cảm ứng) và máy tính (di chuột).

## Blocked by

Không có
