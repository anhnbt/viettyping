# Workbook: Vibe Coding Workshop — Buổi 1 (14/07/2026)

**Trạng thái:** Bản nháp v2, dùng để tập dượt trước — cập nhật sau mỗi lần thử.

## 1. Bối cảnh & mục tiêu

Sự kiện: "VIBE CODING WORKSHOP [DAY 1] — BUILD APP THỰC CHIẾN" do CodeGym tổ chức, 20h00–21h50 ngày 14/07/2026, Google Meet. Diễn giả: Nguyễn Bá Tuấn Anh.

Ba trụ cột sự kiện:
- **Khám phá** — hiểu làn sóng Vibe Coding và tư duy AI-Native.
- **Thực chiến** — thấy AI được áp dụng trực tiếp vào quá trình xây dựng sản phẩm.
- **Cơ hội** — giao lưu cộng đồng, Q&A cùng mentor (không kèm CTA bán khoá học).

Ba cam kết cụ thể của buổi (theo mô tả sự kiện):
1. Build một ứng dụng từ ý tưởng đến sản phẩm cùng AI.
2. Giải thích từng bước để khán giả hiểu AI đang hỗ trợ như thế nào.
3. Trải nghiệm các công cụ AI đang được sử dụng trong thực tế.

Mục tiêu buổi 1: live-build lại ý tưởng cốt lõi của VietTyping (app luyện gõ phím cho trẻ em) **từ con số 0**, trong 60 phút, trước khán giả trình độ hỗn hợp (mới học lập trình → đã biết code cơ bản → có kinh nghiệm). Khán giả quan sát (không hands-on). Sản phẩm không cần đầy đủ tính năng như bản gốc — chỉ cần chứng minh vòng lặp "ý tưởng → sản phẩm chạy được" bằng AI là có thật, và cho thấy nhiều công cụ AI thực tế phối hợp với nhau (không chỉ một công cụ duy nhất).

**Toolchain trình diễn:** Claude (brainstorm) → Stitch MCP (thiết kế giao diện) → Google AI Studio (đồng bộ thiết kế, sinh code) → tải source về local → Claude Code (hoàn thiện, thêm gamification).

## 2. Khung thời gian (60 phút build + 30 phút Q&A)

| Phút | Nội dung |
|---|---|
| 0–6 | Vibe Coding là gì, tư duy AI-Native, đặt kỳ vọng cho 60 phút tới |
| 6–24 | Brainstorm + tinh chỉnh cùng Claude — gọi thật skill `/brainstorming`, **không giới hạn cứng số câu hỏi** (xem mục 4), đi hết vòng hỏi-đáp đầu tới khi Claude trình bày thiết kế, rồi phản hồi để tinh chỉnh tới khi khớp đặc tả mục 5 |
| 24–32 | Thiết kế giao diện bằng Stitch, dựa trên spec vừa chốt |
| 32–40 | Đồng bộ thiết kế từ Stitch sang Google AI Studio, sinh code |
| 40–44 | Tải source về local, mở bằng editor (dùng bản đã cài đặt sẵn từ lần tập dượt để tránh chờ cài đặt) |
| 44–54 | Hoàn thiện bằng Claude Code: thêm/chỉnh gamification (XP, confetti) |
| 54–60 | Demo trực tiếp, mời khán giả xem — có thể rút ngắn nếu các phần trước tràn giờ |
| +30 | Q&A tự do cùng mentor, bắt đầu đúng giờ đã hẹn dù các phần trước có tràn — **không CTA** |

**Nguồn của khung giờ mới:** tập dượt lần 1 (07/07/2026, xem mục 10) cho thấy brainstorm + tinh chỉnh thật tốn tới 13 vòng hỏi-đáp, không phải 2-3 như giả định ban đầu. Khung 6–24 (18 phút) là ước tính suy ra từ số vòng đó — **nhưng tập dượt 1 dùng bản prompt mở đầu chi tiết hơn bản hiện tại ở mục 4** (đã rút gọn sau đó vì đọc trên sân khấu quá giống kịch bản soạn sẵn). Với bản prompt rút gọn mới, số vòng hỏi-đáp nhiều khả năng sẽ khác — khung giờ này **chưa được đo lại**, cần tập dượt lần 2 có bấm giờ, dùng đúng prompt rút gọn ở mục 4, để hiệu chỉnh lại con số trước ngày diễn.

**Chính sách tràn giờ:** nếu bất kỳ bước nào (đặc biệt là brainstorm ở mục 6–24, vì gọi skill thật không giới hạn cứng thời gian) chạy quá dự kiến, thứ tự cắt giảm là: (1) rút ngắn demo (54–60) trước, (2) giữ nguyên phần build (24–54) vì đó là nơi truyền tải giá trị giáo dục, (3) không bao giờ lùi giờ bắt đầu Q&A.

## 3. Talking points — Khám phá (phút 0–6)

- Mở đầu bằng câu hỏi cho khán giả: "Ai đã từng nhờ AI viết giúp một đoạn code chưa?"
- Vibe Coding: lập trình bằng cách *trò chuyện* với AI để mô tả điều mình muốn, thay vì tự gõ từng dòng cú pháp — AI lo phần "dịch ý tưởng thành code".
- Tư duy AI-Native: kỹ năng quan trọng nhất không còn là "thuộc cú pháp" mà là biết đặt câu hỏi đúng, biết đọc/review kết quả AI đưa ra, và biết lặp lại nhanh khi chưa đúng ý.
- Nhấn mạnh sẽ thấy **nhiều công cụ AI thực tế phối hợp với nhau**, đúng tinh thần "trải nghiệm các công cụ AI đang được sử dụng trong thực tế": Claude để tư duy & brainstorm, Stitch để thiết kế giao diện, Google AI Studio để sinh code, quay lại Claude Code để hoàn thiện.
- Đặt kỳ vọng rõ ràng (quản lý rủi ro lệch kỳ vọng): "60 phút tới, mình sẽ dựng **lõi** (core loop) của một app thật đang chạy — VietTyping, một app luyện gõ phím cho trẻ em. Bản đầy đủ có nhiều tháng phát triển với mascot 3D, âm thanh, hàng chục mini-game — hôm nay ta tập trung vào lõi để thấy tốc độ AI mang lại."

## 4. Brainstorm cùng Claude (phút 6–24)

Gọi **thật** skill `/brainstorming` của Claude trên sân khấu (không phải kịch bản hỏi-đáp giả lập) — để đúng nghĩa "trải nghiệm công cụ AI thực tế". Câu gõ mở đầu — **bản rút gọn tối thiểu, CHƯA kiểm chứng bằng tập dượt** (bản chi tiết đã test ở tập dượt 1 bị thay vì cảm giác đọc trên sân khấu quá giống kịch bản soạn sẵn; bản mới này ưu tiên tự nhiên hơn, đổi lại số vòng hỏi-đáp thực tế chưa biết trước):

```
/brainstorming Mình muốn làm một app nhỏ giúp các bé học sinh lớp 1 vừa chơi vừa học. Bạn hỏi mình để chốt ý tưởng nhé.
```

**Không giới hạn cứng số câu hỏi.** Kế hoạch ban đầu "2-3 câu hỏi" đã bị bỏ. Tập dượt 1 (dùng bản prompt chi tiết hơn, xem mục 10) cho ra ~8 câu hỏi trước khi Claude trình bày thiết kế lần đầu, rồi thêm một vòng phản hồi/tinh chỉnh nữa — tổng ~13 vòng. **Số vòng này KHÔNG áp dụng cho bản prompt rút gọn ở trên** vì ít ràng buộc hơn đồng nghĩa Claude nhiều khả năng sẽ hỏi thêm để bù (ví dụ có cần đăng nhập không, giới hạn màn hình...) — cần chạy tập dượt lần 2 với đúng câu prompt rút gọn này để đo lại số vòng và cập nhật khung giờ mục 2 cho chính xác.

**Nguyên tắc nhất quán (quan trọng):** người trình bày đã tự chạy thử phiên brainstorm này trước (mục 7), biết trước các câu hỏi Claude có khả năng hỏi và trả lời đúng như lần tập dượt — để kết quả live hội tụ về đúng spec đã dùng làm input cho Stitch/AI Studio ở bản dự phòng (mục 8). Không ứng biến câu trả lời khác đi. Danh sách câu hỏi/trả lời đầy đủ đã dùng ở tập dượt 1 nằm ở mục 10 — ôn lại trước giờ diễn.

Kết quả mong đợi: hội tụ về đúng đặc tả chức năng ở mục 5.

## 5. Đặc tả sản phẩm demo (nội dung dùng làm prompt cho Stitch & AI Studio)

**Đã cập nhật sau brainstorm thật (tập dượt lần 1, 07/07/2026)** — spec đầy đủ + prompt rút gọn copy-paste sẵn cho Stitch/AI Studio nằm ở file riêng: [2026-07-07-workshop-demo-3-minigames-design.md](2026-07-07-workshop-demo-3-minigames-design.md). Tóm tắt:

**Phạm vi:** 1 màn Menu → chọn 1 trong 3 minigame, không đăng nhập, không lưu tiến trình, không âm thanh thu sẵn (chỉ TTS trình duyệt).

**Dữ liệu (5 mục):** red, blue, yellow (màu hiển thị ô màu thật) + circle, star (icon hình khối).

**3 minigame:**
1. **Vòng quay may mắn** — quay ngẫu nhiên ra 1 mục (túi không hoàn lại), popup + TTS đọc to, +10 XP/lượt. Hết 5 lượt → hoàn thành.
2. **Ghép hình kéo thả** — kéo 5 thẻ chữ vào đúng 5 ô màu/hình, sai thì rung nhẹ không phạt. Ghép đúng hết → hoàn thành.
3. **Đúng hay Sai** — hỏi 1 ô màu/hình + 1 từ, bấm Đúng/Sai. Trả lời sai bị đưa xuống cuối hàng đợi hỏi lại (yếu tố EdTech — ôn lại từ sai). Trả lời đúng hết hàng đợi → hoàn thành.

Mỗi minigame hoàn thành → confetti + tổng XP + nút "Chơi lại"/"Về Menu". 1 bộ đếm XP dùng chung xuyên suốt 3 minigame.

**⚠️ Thay đổi định vị cần lưu ý:** bản demo này **không còn yếu tố gõ phím** (khác với mô tả "app luyện gõ phím cho trẻ em" ở mục 1 và 3) — quyết định có chủ đích để ưu tiên khoe đa dạng minigame trong 60 phút. **Mục 1 và mục 3 (talking points) chưa được cập nhật theo thay đổi này** — cần điều chỉnh lại phần giới thiệu mục tiêu buổi diễn trước khi dùng bản nháp này để trình bày, tránh nói "app luyện gõ phím" rồi demo ra sản phẩm không có gõ phím.

**Stack & cấu trúc code:** không ràng buộc trước — theo đúng những gì Google AI Studio sinh ra từ thiết kế Stitch.

## 6. Nguyên tắc vận hành toolchain

- **Các bước "sáng tạo" diễn ra live thật:** gọi skill brainstorm, viết prompt thiết kế cho Stitch, bấm đồng bộ sang AI Studio — đây là phần khán giả cần thấy đang xảy ra thật.
- **Các bước "chờ đợi/cơ học" được rút gọn bằng bản pre-bake:** cài đặt dependencies, tải file, mở project lần đầu — dùng bản đã chuẩn bị sẵn từ lần tập dượt thay vì chờ live.
- **Prompt live phải giống hệt prompt đã dùng khi tập dượt** — không ứng biến — để nếu cần chuyển sang bản dự phòng giữa chừng, không bị lệch tông với những gì vừa trình bày.
- **Đăng nhập tài khoản Google (Stitch, AI Studio) và giữ phiên còn hiệu lực trước giờ diễn** — tránh rủi ro màn hình đăng nhập/xác thực xuất hiện giữa lúc live.

## 7. Chuẩn bị trước giờ (không làm trên sân khấu)

- [ ] Đăng nhập sẵn tài khoản Google cho Stitch và AI Studio, xác nhận phiên đăng nhập còn hiệu lực gần sát giờ diễn. *(Đã xác nhận đăng nhập sẵn trong lần tập dượt 07/07 — cần xác nhận lại lần nữa gần sát giờ diễn thật, phiên có thể hết hạn.)*
- [ ] Tự chạy thử toàn bộ pipeline 1 lần: brainstorm (skill thật) → Stitch → AI Studio → tải source về → cài đặt local → mở bằng Claude Code → thêm gamification. Ghi lại chính xác các prompt/câu trả lời đã dùng ở mỗi bước. *(Mới hoàn thành phần brainstorm + viết prompt, xem mục 10. Còn thiếu: Stitch, AI Studio, tải source, cài local, Claude Code hoàn thiện.)*
- [ ] Giữ lại bản source đã tải về + cài đặt sẵn từ lần tập dượt làm bản dự phòng, xác nhận chạy được và có gamification hoàn chỉnh. *(Chưa có source — repo dự phòng `~/Code/oss/projects/viettyping-workshop-demo` đã `git init` nhưng còn trống.)*
- [ ] Commit git checkpoint trên bản dự phòng ngay sau khi gamification hoàn chỉnh, để có thể checkout nhanh nếu bước hoàn thiện live bị lỗi.
- [ ] Mở sẵn 1 tab trình duyệt chạy bản dự phòng, dùng làm phương án cuối nếu sự cố kỹ thuật xảy ra lúc live.

## 8. Lưới an toàn

| Tình huống | Xử lý |
|---|---|
| Stitch/AI Studio treo, lỗi mạng, hoặc màn hình đăng nhập xuất hiện lúc live | Chuyển ngay sang bản dự phòng đã tải về + cài đặt sẵn, nói "để tiết kiệm thời gian, mình dùng lại bản đã chuẩn bị này", tiếp tục từ bước hoàn thiện (Claude Code) trên bản đó |
| Claude Code hoàn thiện gamification bị lỗi/AI sinh sai giữa chừng | `git checkout` về checkpoint đã commit sau khi tập dượt (mục 7) |
| Brainstorm skill thật tràn giờ | Áp dụng chính sách tràn giờ ở mục 2 (cắt demo trước) |

## 9. Rủi ro đã xác định & cách xử lý

| Rủi ro | Mức độ | Xử lý |
|---|---|---|
| Đăng nhập Google/lỗi mạng lúc live (Stitch, AI Studio) | Trung bình | Đăng nhập & giữ phiên trước giờ; bản dự phòng sẵn sàng (mục 7, 8) |
| Kết quả live lệch nhiều so với bản tập dượt do quên dùng đúng prompt | Trung bình | Dùng đúng prompt đã chuẩn bị, không ứng biến (mục 4, 6) |
| Brainstorm dùng skill thật tràn giờ | Cao (đã chấp nhận) | Cắt vào phần demo trước, giữ nguyên build và giờ Q&A (mục 2) |
| Khán giả so sánh với bản VietTyping đầy đủ, thấy bản demo "đơn giản hơn" | Trung bình | Nói rõ phạm vi ngay từ phút đầu (mục 3) |
| Nội dung "gõ từ vựng cho trẻ" có thể thiếu "wow" với người đã biết code | Thấp–Trung bình | Gamification (XP/streak/confetti) đã bù một phần; có thể thêm 1 chi tiết bất ngờ nhỏ nếu còn thời gian dư |

## 10. Nhật ký tập dượt

*(Điền sau mỗi lần thử: thời gian thực tế từng đoạn, chỗ vấp, câu nói cần chỉnh.)*

- **Lần 1 (07/07/2026)** — chỉ chạy phần brainstorm + viết spec/prompt, chưa chạy Stitch/AI Studio/Claude Code hoàn thiện:
  - Gọi `/brainstorming` thật, để tự nhiên không ép 2-3 câu như quy định thời gian thật — thực tế cần khoảng **9 câu hỏi tuần tự** mới hội tụ xong spec (chọn chủ đề mới thay vì tái dùng 8 từ cũ, rút còn 5 từ, chốt luật sai, thêm yếu tố EdTech, rồi phát sinh thêm 1 vòng brainstorm phụ về việc tích hợp 3 minigame từ sản phẩm gốc thay vì 1 màn hình gõ phím). **Ghi chú thời gian:** nếu giữ nguyên số câu hỏi này trên sân khấu thật, riêng brainstorm sẽ vượt xa khung 7 phút (mục 2) — cần cân nhắc rút gọn kịch bản câu hỏi trước giờ diễn, hoặc chấp nhận cắt bớt demo cuối theo chính sách tràn giờ.
  - **Chỗ vấp lớn nhất:** kết quả brainstorm tự do **lệch hẳn** so với đặc tả cũ ở mục 5 (đổi từ "1 màn hình gõ từ vựng" sang "Menu chọn 1 trong 3 minigame, bỏ hẳn gõ phím") — đúng như rủi ro đã lường trước ở mục 9 ("Kết quả live lệch nhiều so với bản tập dượt do quên dùng đúng prompt"). Vì đây chính là *lần tập dượt đầu tiên* nên chưa có "prompt chuẩn" để bám theo — bản ghi câu hỏi/trả lời ở trên giờ trở thành kịch bản chuẩn cho các lần sau, phải dùng lại đúng nguyên văn (mục 4, 6).
  - **Câu hỏi cần chuẩn bị sẵn câu trả lời cho lần diễn thật** (đúng thứ tự đã hỏi): (1) nguồn từ vựng — tái dùng hay chủ đề mới; (2) chủ đề mới cụ thể là gì; (3) số lượng từ; (4) chốt danh sách từ; (5) luật khi gõ/chọn sai; (6) có giới hạn thời gian không; (7) phong cách UI; (8) màn hoàn thành hiện gì. Sau khi xem danh sách minigame có sẵn của VietTyping, phát sinh thêm: (9) gõ phím có bắt buộc giữ không; (10) cấu trúc demo (1 màn hay menu nhiều minigame); (11) chọn cụ thể 3 minigame nào.
  - **Quyết định gây bất ngờ nhất:** bỏ hoàn toàn yếu tố gõ phím khỏi demo để đổi lấy 3 minigame đa dạng — xem cảnh báo ⚠️ ở mục 5. Cần quyết định trước lần tập dượt kế tiếp: có giữ quyết định này không, và nếu giữ thì phải viết lại mục 1 + mục 3 (talking points) cho khớp.
  - **Việc đã xong:** spec đầy đủ + prompt rút gọn cho Stitch/AI Studio đã ghi vào [2026-07-07-workshop-demo-3-minigames-design.md](2026-07-07-workshop-demo-3-minigames-design.md) và commit vào repo `viettyping`. Repo dự phòng `~/Code/oss/projects/viettyping-workshop-demo` đã tạo (git init), còn trống.
  - **Việc chưa xong (cho lần tập dượt kế tiếp):** chạy prompt Stitch thật (dự kiến qua trình duyệt claude-in-chrome, không qua Stitch MCP — MCP `stitch` bị lỗi `tools fetch failed: can't resolve reference #/$defs/ScreenInstance`, chưa rõ có phải lỗi tạm thời từ phía Google hay không), đồng bộ sang AI Studio, tải source vào repo dự phòng, mở bằng Claude Code hoàn thiện gamification, rồi commit checkpoint.
