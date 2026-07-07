# Spec: App demo "3 Minigame Màu & Hình" cho Workshop Vibe Coding (14/07/2026)

**Trạng thái:** Đã chốt qua brainstorm thật (tập dượt lần 1). Dùng làm nội dung prompt cho Stitch + Google AI Studio, không phải đặc tả kỹ thuật cố định — stack/cấu trúc code do AI Studio sinh ra quyết định.

**Bối cảnh:** Đây là sản phẩm sẽ được live-build trong 60 phút tại buổi Workshop Vibe Coding 14/07/2026 (xem [workbook](2026-07-03-vibe-coding-workshop-buoi1-workbook-design.md)), qua chuỗi công cụ Claude (brainstorm) → Stitch (thiết kế UI) → Google AI Studio (sinh code) → Claude Code (hoàn thiện gamification). Đây là bản demo rút gọn, tách biệt hoàn toàn khỏi source code sản phẩm VietTyping chính — không tái sử dụng component nào của repo `viettyping`.

## 1. Mục đích & phạm vi

Chứng minh vòng lặp "ý tưởng → sản phẩm chạy được" bằng AI trước khán giả workshop, đồng thời khoe được sự đa dạng minigame giống tinh thần sản phẩm VietTyping gốc.

- 1 màn hình Menu + 3 màn chơi con, không đăng nhập, không lưu tiến trình giữa các lần chơi.
- Dữ liệu dùng chung cho cả 3 minigame — 5 từ: `red`, `blue`, `yellow`, `circle`, `star` (3 màu hiển thị bằng ô màu thật, 2 hình hiển thị bằng icon hình khối), kèm nghĩa tiếng Việt tương ứng.

**Lưu ý định vị sản phẩm:** VietTyping gốc định vị "luyện gõ phím là cốt lõi" (README). Bản demo này **chủ động bỏ yếu tố gõ phím** để tập trung khoe đa dạng minigame trong thời lượng 60 phút build live — cần nói rõ điều này với khán giả ngay đầu bài trình bày (xem workbook mục 3), tránh gây hiểu lầm đây là đại diện đầy đủ của sản phẩm.

## 2. Màn Menu

3 thẻ minigame dạng bo tròn lớn, shadow 3D tactile, màu sắc rực rỡ — bấm vào thẻ để vào chơi. Mỗi màn chơi con có nút "Về Menu" để quay lại.

## 3. Minigame 1 — Vòng quay may mắn

- Bánh xe quay ngẫu nhiên chọn 1 trong 5 từ, dùng "túi không hoàn lại" (mỗi từ chỉ ra đúng 1 lần trong 1 lượt chơi trọn vẹn).
- Kết quả hiện trong popup: từ tiếng Anh to + nghĩa tiếng Việt, tự động đọc to bằng Web Speech API (TTS trình duyệt, giọng `vi-VN`), kèm confetti nhỏ. Mỗi lần quay ra từ mới: +10 XP (không có khái niệm đúng/sai ở minigame này, mỗi lượt quay đều tính XP).
- Quay đủ 5 lần (hết túi) → màn hoàn thành.

## 4. Minigame 2 — Ghép hình kéo thả

- 5 thẻ chữ (drag) và 5 ô màu/hình tương ứng (drop target), trẻ kéo thẻ chữ thả vào đúng ô.
- Ghép sai: ô rung nhẹ, không phạt, kéo lại được ngay.
- Ghép đúng hết 5 cặp → màn hoàn thành.

## 5. Minigame 3 — Đúng hay Sai

- Hiện 1 ô màu/hình + 1 từ tiếng Anh (50% là từ đúng, 50% là 1 trong 4 từ còn lại — sai có chủ đích), trẻ bấm nút "Đúng" hoặc "Sai".
- **Yếu tố EdTech (ôn lại từ sai):** câu trả lời sai bị đưa xuống cuối hàng đợi để hỏi lại sau; hàng đợi ban đầu có 5 câu.
- Trả lời đúng hết toàn bộ hàng đợi (kể cả câu từng trả lời sai) → màn hoàn thành.

## 6. Gamification

- 1 bộ đếm XP dùng chung xuyên suốt cả 3 minigame (không reset khi chuyển game), hiển thị ở header.
- Mỗi lượt đúng/khớp đúng (hoặc mỗi lượt quay ở Minigame 1, xem mục 3): +10 XP.
- Khi hoàn thành 1 minigame: confetti lớn + hiện tổng XP đã tích lũy + 2 nút "Chơi lại" (chơi lại đúng minigame đó) và "Về Menu".

## 7. Phong cách UI

Playful/hoạt hình, màu sắc rực rỡ, bo tròn lớn, shadow 3D tactile — đồng bộ tinh thần thiết kế hiện có của VietTyping nhưng đơn giản hóa (không mascot 3D).

## 8. Ngoài phạm vi

Gõ phím, đăng nhập, lưu điểm/tiến trình, đồng hồ đếm giờ, âm thanh thu sẵn (chỉ dùng TTS trình duyệt), nhiều màn hình ngoài Menu + 3 minigame.

## 9. Cách dùng spec này

Nội dung mục 1–8 dùng làm prompt đầu vào cho:
1. **Stitch** — thiết kế giao diện Menu + 3 màn chơi theo mục 7 (phong cách UI).
2. **Google AI Studio** — đồng bộ thiết kế từ Stitch, sinh code theo luật chơi ở mục 2–6.

Sau khi tải source về và cài đặt local, Claude Code sẽ hoàn thiện phần gamification (mục 6) nếu AI Studio sinh chưa đầy đủ.
