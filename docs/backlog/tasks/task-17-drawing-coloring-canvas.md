## Parent

[PRD-Pedagogical-Improvements.md](file:///Users/wanbi/Code/oss/projects/viettyping/docs/PRD-Pedagogical-Improvements.md)

## What to build

Phát triển trò chơi Tô màu tương tác (Coloring Canvas Activity) sử dụng HTML5 Canvas để rèn luyện kỹ năng vận động tinh (tô màu đều, không lem ngoài viền) cho trẻ.

Trò chơi sẽ hiển thị các khung vẽ SVG khép kín. Trẻ sẽ chọn cọ màu và tô vào các vùng trống. Hệ thống sẽ đo lường tỷ lệ tô màu đều (coverage) và tỷ lệ màu bị lem ra ngoài viền vẽ sẵn (bleed) để đưa ra phản hồi phù hợp.

## Acceptance criteria

- [ ] Tích hợp HTML5 Canvas render các đường viền SVG rỗng của nhân vật hoạt họa quen thuộc.
- [ ] Xây dựng công cụ cọ vẽ (brush) và bảng màu rực rỡ, bắt mắt cho trẻ em.
- [ ] Triển khai thuật toán kiểm tra pixel thời gian thực:
  - Tính toán `colorCoveragePercent`: Tỷ lệ phần trăm diện tích khép kín đã được tô màu đầy đủ.
  - Tính toán `colorBleedPercent`: Tỷ lệ phần trăm pixel màu bị vẽ lấn ra ngoài ranh giới cho phép của SVG.
- [ ] Phát âm thanh bong bóng vỡ vui nhộn khi di chuyển cọ vẽ và hiển thị các vi hiệu ứng pháo hoa nhỏ khi trẻ tô kín thành công một vùng lớn.
- [ ] Trả về các thông số `colorCoveragePercent` và `colorBleedPercent` trong `TelemetryPayload`.

## Blocked by

Không có
