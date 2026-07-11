# Spec: App demo "Vui Học Bảng Chữ" (tập dượt brainstorm lần 2, 11/07/2026)

**Trạng thái:** Đã chốt qua brainstorm thật, dùng prompt mở đầu rút gọn ở [workbook mục 4](2026-07-03-vibe-coding-workshop-buoi1-workbook-design.md). Dùng làm nội dung prompt cho Stitch + Google AI Studio, không phải đặc tả kỹ thuật cố định — stack/cấu trúc code do AI Studio sinh ra quyết định.

**Bối cảnh:** Đây là lần tập dượt thứ 2 cho phần brainstorm của Workshop Vibe Coding 14/07/2026, dùng đúng câu prompt rút gọn "Mình muốn làm một app nhỏ giúp các bé học sinh lớp 1 vừa chơi vừa học. Bạn hỏi mình để chốt ý tưởng nhé." Kết quả hội tụ **khác** với bản demo lần 1 ([2026-07-07-workshop-demo-3-minigames-design.md](2026-07-07-workshop-demo-3-minigames-design.md)) — đơn giản hơn (1 minigame thay vì 3) và đổi chủ đề (chữ cái tiếng Việt thay vì màu/hình tiếng Anh). Đây là bản demo rút gọn, tách biệt hoàn toàn khỏi source code sản phẩm VietTyping chính — không tái sử dụng component nào của repo `viettyping`.

## 1. Mục đích & phạm vi

Chứng minh vòng lặp "ý tưởng → sản phẩm chạy được" bằng AI trước khán giả workshop.

- 1 màn hình chơi duy nhất, không đăng nhập, không lưu tiến trình giữa các lần chơi, không giới hạn thời gian.
- Nội dung: làm quen 5 chữ cái tiếng Việt — `a`, `b`, `c`, `o`, `ô`.

## 2. Màn chơi — "Nghe đọc, chọn đúng chữ"

- App phát âm to 1 trong 5 chữ cái theo **âm đọc phô-nic** (bờ, cờ, a, o, ô — không phải tên chữ như "bê", "xê"), dùng Web Speech API (`SpeechSynthesisUtterance`, `lang: "vi-VN"`).
- Hiển thị 5 nút lựa chọn dạng chữ cái to (`a`, `b`, `c`, `o`, `ô`), không kèm hình minh họa.
- Bấm đúng chữ: hiệu ứng phản hồi tích cực (bounce/sáng lên), +10 XP, chuyển sang câu đố tiếp theo.
- Bấm sai chữ: nút rung nhẹ 0.3s rồi trở lại bình thường, không trừ điểm, không chuyển câu — bé thử lại ngay trên cùng câu đố.
- Một lượt chơi gồm 5 câu đố, dùng cơ chế "túi không hoàn lại": mỗi chữ trong 5 chữ làm câu hỏi đúng 1 lần, thứ tự xáo trộn ngẫu nhiên khi bắt đầu lượt.
- Đoán đúng hết 5/5 câu đố → lượt chơi hoàn thành.

## 3. Gamification

- 1 bộ đếm XP hiển thị ở header, cộng dồn trong suốt lượt chơi (không cần lưu vĩnh viễn).
- Mỗi câu đố đoán đúng: +10 XP.
- Hoàn thành lượt (5/5 đúng): confetti lớn + hiện tổng XP lượt này + nút "Chơi lại" (xáo lại túi 5 câu đố, XP reset về 0 cho lượt mới).

## 4. Phong cách UI

Playful/hoạt hình, màu sắc rực rỡ, bo tròn lớn, nút bấm có shadow 3D tactile (đổ bóng đậm kiểu neubrutalism) — không mascot 3D.

## 5. Ngoài phạm vi

Đăng nhập, lưu điểm/tiến trình vĩnh viễn (localStorage hay database), đồng hồ đếm giờ, hình minh họa cho từng lựa chọn chữ, nhiều màn hình/minigame khác ngoài màn chơi chính, âm thanh thu sẵn (chỉ dùng TTS trình duyệt), mở rộng ra ngoài 5 chữ cái đã chốt.

## 6. Cách dùng spec này

Nội dung mục 1–5 dùng làm prompt đầu vào cho:
1. **Stitch** — thiết kế giao diện màn chơi theo mục 4 (phong cách UI).
2. **Google AI Studio** — đồng bộ thiết kế từ Stitch, sinh code theo luật chơi ở mục 2–3.

Sau khi tải source về và cài đặt local, Claude Code sẽ hoàn thiện phần gamification (mục 3) nếu AI Studio sinh chưa đầy đủ.

## 7. Prompt rút gọn (copy-paste live)

### 7.1 Prompt cho Stitch (thiết kế UI)

```
Thiết kế 1 web app cho trẻ em (học sinh lớp 1) tên "Vui Học Bảng Chữ", phong cách playful/hoạt hình, màu sắc rực rỡ, bo tròn lớn, nút bấm có shadow 3D tactile (đổ bóng đậm kiểu neubrutalism).

1 màn hình chơi duy nhất: ở giữa trên cùng là nút loa lớn để nghe lại âm chữ cái vừa đọc, bên dưới là 5 nút lớn bo tròn hiển thị chữ cái to: a, b, c, o, ô. Header hiển thị 1 bộ đếm XP (ngôi sao + số) và tiến độ câu đố hiện tại (ví dụ "Câu 2/5").
```

### 7.2 Prompt cho Google AI Studio (sinh code, sau khi đồng bộ thiết kế từ Stitch)

```
Xây dựng đầy đủ chức năng cho app "Vui Học Bảng Chữ" theo thiết kế đã đồng bộ. Nội dung: 5 chữ cái tiếng Việt a, b, c, o, ô.

Luật chơi:
- Khi vào màn chơi (hoặc bấm nút loa), phát âm to chữ cái hiện tại theo ÂM ĐỌC PHÔ-NIC (không phải tên chữ): a → "a", b → "bờ", c → "cờ", o → "o", ô → "ô". Dùng Web Speech API (SpeechSynthesisUtterance, lang "vi-VN").
- Hiển thị 5 nút lựa chọn là chữ cái to: a, b, c, o, ô.
- Bấm đúng chữ (khớp với âm vừa đọc): hiệu ứng tích cực (bounce/sáng lên), cộng 10 XP, tự động chuyển sang câu đố tiếp theo (phát âm chữ mới).
- Bấm sai chữ: nút đó rung nhẹ 0.3s rồi trở lại bình thường, không trừ điểm, không chuyển câu, bé được thử lại ngay.
- Một lượt chơi gồm 5 câu đố, dùng cơ chế "túi không hoàn lại": xáo ngẫu nhiên thứ tự 5 chữ khi bắt đầu lượt, mỗi chữ chỉ làm câu hỏi đúng 1 lần trong 1 lượt.
- Đoán đúng hết 5/5 câu đố → hiện màn hoàn thành: confetti lớn + tổng XP đã tích lũy trong lượt + nút "Chơi lại" (xáo lại túi 5 câu, XP reset về 0).

Không cần đăng nhập, không cần lưu trữ dữ liệu vĩnh viễn (localStorage hay database), không cần đồng hồ đếm giờ, không cần hình minh họa cho từng lựa chọn, không cần âm thanh thu sẵn (chỉ dùng Web Speech API).
```

## 8. Nhật ký tập dượt (bổ sung cho mục 10 của workbook)

- **Lần 2 (11/07/2026)** — dùng đúng prompt rút gọn ở [workbook mục 4](2026-07-03-vibe-coding-workshop-buoi1-workbook-design.md), chạy phần brainstorm thật:
  - Tổng cộng **10 câu hỏi tuần tự** trước khi trình bày thiết kế lần đầu (liên hệ VietTyping, nội dung học, số lượng chữ, danh sách chữ cụ thể, cấu trúc chơi, cách chơi minigame, luật khi sai, điều kiện hoàn thành, phần thưởng, phong cách UI, phạm vi đăng nhập/lưu trữ, cách đọc âm, hiển thị lựa chọn, tên app — một số câu gộp chung 1 vòng hỏi). Không phát sinh vòng phản hồi/tinh chỉnh thêm — người dùng duyệt thẳng bằng cách gọi `/writing-plans`.
  - **So sánh với lần 1:** kết quả hội tụ khác hẳn — lần 1 ra 3 minigame màu/hình tiếng Anh, lần 2 ra 1 minigame duy nhất về chữ cái tiếng Việt. Xác nhận đúng dự đoán ở workbook mục 10: "ít ràng buộc hơn [ở bản prompt rút gọn] đồng nghĩa Claude nhiều khả năng sẽ hỏi thêm để bù" — và kết quả cũng phân kỳ theo hướng khác so với lần 1, không hội tụ về cùng 1 spec.
  - **Visual companion:** được đề nghị đúng lúc (just-in-time) khi đến câu hỏi phong cách UI — người dùng chọn trả lời bằng text, không mở tab trình duyệt.
  - **Việc chưa xong:** chạy prompt Stitch/AI Studio thật với nội dung mục 7 này, tải source, cài local, hoàn thiện bằng Claude Code, commit checkpoint vào repo dự phòng `~/Code/oss/projects/viettyping-workshop-demo`.
