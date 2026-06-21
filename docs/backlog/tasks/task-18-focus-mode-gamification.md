## Parent

[PRD-Pedagogical-Improvements.md](file:///Users/wanbi/Code/oss/projects/viettyping/docs/PRD-Pedagogical-Improvements.md)

## What to build

Cải tiến giao diện Siêu tập trung (Focus Mode UI) kết hợp vòng lặp Pomodoro tương tác (15 phút tập trung / 3 phút nghỉ ngơi) và bổ sung phần thưởng chuyên biệt rèn luyện sự tập trung cho học sinh 6 tuổi.

Ẩn các chi tiết điều hướng gây phân tâm, theo dõi thời gian nhàn rỗi (idle time) để nhắc nhở bé tập trung. Trong quá trình học, hiển thị hạt giống lớn dần thành cây. Khi hết 15 phút, kích hoạt màn hình giải lao 3 phút với hoạt động thể chất giãn cơ hoặc âm nhạc hát theo giúp bé nghỉ ngơi tích cực.

## Acceptance criteria

- [x] Thiết kế cờ cấu hình `focusMode` trong `LessonCoordinator` để ẩn Sidebar, Footer và các nút điều hướng ngoài luồng học.
- [x] Xây dựng bộ phát hiện nhàn rỗi (Idle Detector): Nếu trẻ không có tương tác nào trong vòng 30 giây, hiển thị một chú cún đáng yêu sủa nhẹ hoặc vẫy tay gọi bé tiếp tục học bài.
- [x] Thiết lập State Machine quản lý bộ đếm Pomodoro: `FOCUS` (15 phút) -> `BREAK` (3 phút) -> `FOCUS`.
- [x] Tạo widget hạt giống lớn dần thành cây (`FocusGardenWidget`) tương ứng với thời gian trôi qua trong trạng thái `FOCUS`.
- [x] Xây dựng màn hình `BreakScreen` khóa toàn bộ tương tác học và hiển thị:
  - Hoạt ảnh hướng dẫn bé tập thể dục giãn cơ/vận động nhẹ (hỗ trợ nâng cao thể chất).
  - Hoặc phát bài đọc nhạc/bài hát thiếu nhi vui nhộn để bé hát theo (luyện âm nhạc).
- [x] Bổ sung phần thưởng Huy hiệu "Ngôi sao tập trung" (Focus Star) khi con hoàn thành bài học với thời gian nhàn rỗi cực thấp và độ chính xác cao.
- [x] Ghi nhận điểm `focusScore` vào `TelemetryPayload` dựa trên tỷ lệ thời gian bé tập trung tương tác liên tục so với tổng thời gian làm bài.

## Blocked by

Không có
