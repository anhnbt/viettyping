## Parent

[PRD-Pedagogical-Improvements.md](file:///Users/wanbi/Code/oss/projects/viettyping/docs/PRD-Pedagogical-Improvements.md)

## What to build

Cài đặt cơ chế tính toán tốc độ gõ phím thời gian thực (WPM - Words Per Minute) và chế độ thử thách thời gian (Time Attack) trong cấu phần gõ phím của `LessonCoordinator`.

Trẻ sẽ nhìn thấy một thước đo tốc độ dễ thương với hình ảnh các loài vật (Rùa, Thỏ, Báo) chạy nhanh hay chậm tùy thuộc vào tốc độ gõ của trẻ. Đồng thời tích hợp thanh thời gian đếm ngược trực quan để trẻ hoàn thành câu trước khi thời gian cạn kiệt.

## Acceptance criteria

- [ ] Thu thập thời gian bắt đầu gõ và số ký tự/từ gõ đúng để tính WPM theo thời gian thực.
- [ ] Xây dựng component `TypingSpeedMeter` dạng hoạt ảnh con vật:
  - Tốc độ dưới 10 WPM: Con rùa 🐢 bò chậm rãi.
  - Tốc độ từ 10 đến 25 WPM: Con thỏ 🐰 nhảy lò cò.
  - Tốc độ trên 25 WPM: Con báo 🐆 chạy rất nhanh.
- [ ] Tích hợp thanh thời gian đếm ngược dạng màu sắc thay đổi động: Xanh lá (nhiều thời gian) -> Vàng (trung bình) -> Đỏ (sắp hết giờ).
- [ ] Gửi thông tin `wpm` và `accuracy` vào thuộc tính `metadata` của `TelemetryPayload` khi hoàn thành hoạt động luyện gõ phím.
- [ ] Viết Unit Test cho hàm tính toán WPM đảm bảo tính đúng đắn khi gõ ngắt quãng.

## Blocked by

Không có
