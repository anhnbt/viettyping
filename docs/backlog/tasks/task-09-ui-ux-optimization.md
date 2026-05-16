# Task 09: Tối ưu hóa UI/UX & Micro-animations (Polishing)

## 🎯 Mục tiêu
Mang lại trải nghiệm rực rỡ, hấp dẫn và mượt mà nhất cho trẻ 6 tuổi, thông qua việc tinh chỉnh thiết kế và thêm các vi hiệu ứng (micro-animations) tạo cảm giác tương tác thật.

## 🛠 Tech Stack
- Tailwind CSS
- framer-motion

## 📝 Chi tiết công việc
1. **Tối ưu Component Buttons & Cards:**
   - Thêm hiệu ứng hover, tap scale (phóng to nhẹ khi bấm) bằng `framer-motion` cho toàn bộ nút bấm và Flashcards.
   - Tinh chỉnh shadow, glow effect để các thẻ bài và nút bấm nổi bật hơn (Glassmorphism).
2. **Micro-animations cho hành động đúng/sai:**
   - Tạo hiệu ứng rung lắc (shake) khi trẻ chọn sai.
   - Tạo hiệu ứng nhún nhảy (bounce) hoặc phát sáng (glow) khi trẻ chọn đúng.
3. **Chuyển cảnh mượt mà (Page/Component Transitions):**
   - Áp dụng `AnimatePresence` cho các layout chuyển đổi giữa các mini-game để tránh giật lag UI.
4. **Hiệu ứng âm thanh kết hợp (Audio-Visual Sync):**
   - Đảm bảo animation bắn pháo hoa khớp với âm thanh "Ting!" và popup chúc mừng.
   - Tránh hiện tượng giật âm thanh khi click quá nhanh.
5. **Responsive & Cảm ứng:**
   - Đảm bảo các khu vực kéo thả (drag-and-drop) thân thiện với ngón tay trẻ nhỏ trên màn hình tablet/mobile (Touch Targets đủ lớn).

## 🏆 Tiêu chí hoàn thành (DoD)
- [x] Không có giật lag khi chuyển đổi giữa các màn hình chơi game.
- [x] Các hiệu ứng hover, tap được đồng bộ và áp dụng trên toàn bộ ứng dụng.
- [x] Có hiệu ứng rõ rệt, sinh động khi trẻ trả lời đúng/sai.
- [x] Giao diện tương thích tốt, không bị vỡ layout trên cả thiết bị di động (iPad, tablet).
