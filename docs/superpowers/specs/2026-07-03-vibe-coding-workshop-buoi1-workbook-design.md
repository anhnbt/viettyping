# Workbook: Vibe Coding Workshop — Buổi 1 (14/07/2026)

**Trạng thái:** Đã làm mịn sau tập dượt lần 1 — nội dung nhất quán trong toàn bộ workbook. Các hạng mục chưa kiểm chứng bằng tập dượt (khung giờ brainstorm, bước Claude Code hoàn thiện) được liệt kê rõ ở mục 9.

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

**Mục tiêu buổi 1:** live-build một app học tập nhỏ cho trẻ em, lấy cảm hứng từ VietTyping (app học tập đa môn kết hợp luyện gõ phím — xem README dự án), **từ con số 0**, trong 60 phút, trước khán giả trình độ hỗn hợp (mới học lập trình → đã biết code cơ bản → có kinh nghiệm). Khán giả quan sát (không hands-on).

**Phạm vi rõ ràng (đã chốt sau tập dượt lần 1):** bản demo hôm nay là 1 màn Menu + 3 minigame (Vòng quay may mắn, Ghép hình kéo thả, Đúng hay Sai) kèm gamification (XP, confetti) — **không bao gồm cơ chế luyện gõ phím** của bản VietTyping gốc. Đây là lựa chọn có chủ đích để vừa sức hoàn thành trong 60 phút và khoe được đa dạng minigame, không phải đại diện đầy đủ cho sản phẩm gốc. Đặc tả chi tiết ở mục 5.

Sản phẩm không cần đầy đủ tính năng như bản gốc — chỉ cần chứng minh vòng lặp "ý tưởng → sản phẩm chạy được" bằng AI là có thật, và cho thấy nhiều công cụ AI thực tế phối hợp với nhau (không chỉ một công cụ duy nhất).

**Toolchain trình diễn:** Claude, dùng skill mở nguồn `/brainstorming` (bộ [obra/superpowers](https://github.com/obra/superpowers)) → Stitch (thiết kế giao diện) → Google AI Studio (đồng bộ thiết kế, sinh code) → tải source về local → Claude Code, dùng skill `/writing-plans` + `/executing-plans` (cùng bộ obra/superpowers) để hoàn thiện gamification.

## 2. Khung thời gian (60 phút build + 30 phút Q&A)

| Phút | Nội dung |
|---|---|
| 0–6 | Vibe Coding là gì, tư duy AI-Native, đặt kỳ vọng cho 60 phút tới — dùng [slide mở đầu](../slides/vibe-coding-workshop-buoi1-slides.pptx) |
| 6–24 | Brainstorm + tinh chỉnh cùng Claude — gọi thật skill `/brainstorming` (mục 4), không giới hạn cứng số câu hỏi, đi hết vòng hỏi-đáp đầu tới khi Claude trình bày thiết kế, rồi phản hồi để tinh chỉnh tới khi khớp đặc tả mục 5 |
| 24–32 | Thiết kế giao diện bằng Stitch, dựa trên spec vừa chốt |
| 32–40 | Đồng bộ thiết kế từ Stitch sang Google AI Studio, sinh code |
| 40–44 | Tải source về local, mở bằng editor (dùng bản đã cài đặt sẵn từ lần tập dượt để tránh chờ cài đặt) |
| 44–54 | Hoàn thiện bằng Claude Code: `/writing-plans` → `/executing-plans` để thêm/chỉnh gamification (XP, confetti) — xem mục 6 |
| 54–60 | Demo trực tiếp, mời khán giả xem — có thể rút ngắn nếu các phần trước tràn giờ |
| +30 | Q&A tự do cùng mentor, bắt đầu đúng giờ đã hẹn dù các phần trước có tràn — **không CTA** |

Khung giờ 6–24 (18 phút) là ước tính suy ra từ tập dượt lần 1 (~13 vòng hỏi-đáp, xem mục 10) và **chưa được đo lại** với prompt mở đầu rút gọn hiện dùng ở mục 4 (khác bản đã test khi đó). Khung giờ 44–54 cho bước Claude Code cũng chưa từng tập dượt. Cả hai cần đo bằng đồng hồ thật ở tập dượt lần 2 — xem mục 9.

**Chính sách tràn giờ:** nếu bất kỳ bước nào chạy quá dự kiến, thứ tự cắt giảm là: (1) rút ngắn demo (54–60) trước, (2) giữ nguyên phần build (24–54) vì đó là nơi truyền tải giá trị giáo dục, (3) không bao giờ lùi giờ bắt đầu Q&A.

## 3. Talking points — Khám phá (phút 0–6)

Dùng kèm [slide mở đầu](../slides/vibe-coding-workshop-buoi1-slides.pptx) (5 slide, chỉ cho đoạn này — từ phút 6 trở đi là live-build trực tiếp, không dùng slide).

- Mở đầu bằng câu hỏi cho khán giả: "Ai đã từng nhờ AI viết giúp một đoạn code chưa?"
- Vibe Coding: lập trình bằng cách *trò chuyện* với AI để mô tả điều mình muốn, thay vì tự gõ từng dòng cú pháp — AI lo phần "dịch ý tưởng thành code".
- Tư duy AI-Native: kỹ năng quan trọng nhất không còn là "thuộc cú pháp" mà là biết đặt câu hỏi đúng, biết đọc và đánh giá kết quả AI đưa ra, và biết lặp lại nhanh khi chưa đúng ý.
- Nhấn mạnh sẽ thấy **nhiều công cụ AI thực tế phối hợp với nhau**: Claude để tư duy và brainstorm, Stitch để thiết kế giao diện, Google AI Studio để sinh code, quay lại Claude Code để hoàn thiện.
- Đặt kỳ vọng rõ ràng: "60 phút tới, mình sẽ dựng **lõi** (vòng lặp chơi cốt lõi) của một app học tập nhỏ cho trẻ em, lấy cảm hứng từ VietTyping — tập trung vào 3 minigame và gamification, **không bao gồm phần luyện gõ phím** của bản gốc. Bản VietTyping đầy đủ có nhiều tháng phát triển với mascot 3D, âm thanh, hàng chục mini-game (kể cả luyện gõ phím) — hôm nay ta tập trung vào lõi game và AI để thấy tốc độ AI mang lại."
- **Ghi nhận nguồn (khớp trụ cột "Cơ hội"):** các skill dùng hôm nay là mã nguồn mở thật — `/brainstorming`, `/writing-plans`, `/executing-plans` từ [obra/superpowers](https://github.com/obra/superpowers); riêng khâu lên kịch bản cho buổi workshop này, người trình bày còn dùng skill `/grill-me` của [mattpocock](https://www.skills.sh/mattpocock/skills/grill-me) (chỉ ở khâu chuẩn bị, không phải live demo). Khán giả có thể tự cài và dùng ngay sau buổi.

## 4. Brainstorm cùng Claude (phút 6–24)

Gọi **thật** skill `/brainstorming` của Claude trên sân khấu (không phải kịch bản hỏi-đáp giả lập). Câu gõ mở đầu — bản rút gọn, ưu tiên nghe tự nhiên trên sân khấu:

```
/brainstorming Mình muốn làm một app nhỏ giúp các bé học sinh lớp 1 vừa chơi vừa học. Bạn hỏi mình để chốt ý tưởng nhé.
```

**Chưa kiểm chứng bằng tập dượt** (xem mục 9): bản đã test ở tập dượt 1 dùng prompt chi tiết hơn và cho ra ~13 vòng hỏi-đáp; bản rút gọn này ít ràng buộc hơn nên nhiều khả năng số vòng sẽ khác.

**Không giới hạn cứng số câu hỏi** — kế hoạch ban đầu "2-3 câu hỏi" đã bị bỏ sau tập dượt lần 1.

**Nguyên tắc nhất quán (quan trọng):** người trình bày đã tự chạy thử phiên brainstorm này trước, biết trước các câu hỏi Claude có khả năng hỏi và trả lời đúng như lần tập dượt — để kết quả live hội tụ về đúng spec đã dùng làm input cho Stitch/AI Studio ở bản dự phòng (mục 7). Không ứng biến câu trả lời khác đi. Danh sách câu hỏi/trả lời đầy đủ đã dùng ở tập dượt 1 nằm ở mục 10 — ôn lại trước giờ diễn.

Kết quả mong đợi: hội tụ về đúng đặc tả chức năng ở mục 5.

## 5. Đặc tả sản phẩm demo (nội dung dùng làm prompt cho Stitch & AI Studio)

Spec đầy đủ + prompt rút gọn copy-paste sẵn cho Stitch/AI Studio nằm ở file riêng: [2026-07-07-workshop-demo-3-minigames-design.md](2026-07-07-workshop-demo-3-minigames-design.md). Tóm tắt:

**Phạm vi:** 1 màn Menu → chọn 1 trong 3 minigame, không đăng nhập, không lưu tiến trình, không âm thanh thu sẵn (chỉ TTS trình duyệt), không có gõ phím (xem mục 1).

**Dữ liệu (5 mục):** red, blue, yellow (màu hiển thị ô màu thật) + circle, star (icon hình khối).

**3 minigame:**
1. **Vòng quay may mắn** — quay ngẫu nhiên ra 1 mục (túi không hoàn lại), popup + TTS đọc to, +10 XP/lượt. Hết 5 lượt → hoàn thành.
2. **Ghép hình kéo thả** — kéo 5 thẻ chữ vào đúng 5 ô màu/hình, sai thì rung nhẹ không phạt. Ghép đúng hết → hoàn thành.
3. **Đúng hay Sai** — hỏi 1 ô màu/hình + 1 từ, bấm Đúng/Sai. Trả lời sai bị đưa xuống cuối hàng đợi hỏi lại (yếu tố EdTech — ôn lại từ sai). Trả lời đúng hết hàng đợi → hoàn thành.

Mỗi minigame hoàn thành → confetti + tổng XP + nút "Chơi lại"/"Về Menu". 1 bộ đếm XP dùng chung xuyên suốt 3 minigame.

**Stack & cấu trúc code:** không ràng buộc trước — theo đúng những gì Google AI Studio sinh ra từ thiết kế Stitch.

## 6. Nguyên tắc vận hành toolchain

- **Các bước "sáng tạo" diễn ra live thật:** gọi skill brainstorm, viết prompt thiết kế cho Stitch, bấm đồng bộ sang AI Studio — đây là phần khán giả cần thấy đang xảy ra thật.
- **Các bước "chờ đợi/cơ học" được rút gọn bằng bản pre-bake:** cài đặt dependencies, tải file, mở project lần đầu — dùng bản đã chuẩn bị sẵn từ lần tập dượt thay vì chờ live.
- **Prompt live phải giống hệt prompt đã dùng khi tập dượt** — không ứng biến — để nếu cần chuyển sang bản dự phòng giữa chừng, không bị lệch tông với những gì vừa trình bày.
- **Đăng nhập tài khoản Google (Stitch, AI Studio) và giữ phiên còn hiệu lực trước giờ diễn** — tránh rủi ro màn hình đăng nhập/xác thực xuất hiện giữa lúc live.
- **Bước hoàn thiện bằng Claude Code (phút 44–54) dùng đúng quy trình chuẩn obra/superpowers:** gọi `/writing-plans` trên source vừa tải về để tạo 1 plan ngắn cho phần gamification cần thêm/chỉnh, rồi gọi `/executing-plans` để thực thi — không tự sửa code tùy hứng ngoài quy trình 2 skill này. **Chưa được tập dượt** — xem mục 9.

## 7. Chuẩn bị trước giờ (không làm trên sân khấu)

- [ ] Đăng nhập sẵn tài khoản Google cho Stitch và AI Studio, xác nhận phiên đăng nhập còn hiệu lực gần sát giờ diễn. *(Đã xác nhận đăng nhập trong tập dượt lần 1 — cần xác nhận lại lần nữa gần sát giờ diễn thật, phiên có thể hết hạn.)*
- [ ] Tự chạy thử toàn bộ pipeline 1 lần: brainstorm → Stitch → AI Studio → tải source → cài local → Claude Code hoàn thiện. Ghi lại chính xác prompt/câu trả lời đã dùng ở mỗi bước. *(Mới xong phần brainstorm + spec/prompt, xem mục 10. Còn thiếu: Stitch, AI Studio, tải source, cài local, Claude Code hoàn thiện.)*
- [ ] Giữ lại bản source đã tải về + cài đặt sẵn làm bản dự phòng, xác nhận chạy được và có gamification hoàn chỉnh. *(Chưa có source — repo dự phòng `~/Code/oss/projects/viettyping-workshop-demo` đã `git init`, còn trống.)*
- [ ] Commit git checkpoint trên bản dự phòng ngay sau khi gamification hoàn chỉnh, để có thể checkout nhanh nếu bước hoàn thiện live bị lỗi.
- [ ] Mở sẵn 1 tab trình duyệt chạy bản dự phòng, dùng làm phương án cuối nếu sự cố kỹ thuật xảy ra lúc live.

## 8. Lưới an toàn

| Tình huống | Xử lý |
|---|---|
| Stitch/AI Studio treo, lỗi mạng, hoặc màn hình đăng nhập xuất hiện lúc live | Chuyển ngay sang bản dự phòng đã tải về + cài đặt sẵn, nói "để tiết kiệm thời gian, mình dùng lại bản đã chuẩn bị này", tiếp tục từ bước hoàn thiện (Claude Code) trên bản đó |
| Claude Code hoàn thiện gamification bị lỗi/AI sinh sai giữa chừng | `git checkout` về checkpoint đã commit sau khi tập dượt (mục 7) |
| Brainstorm skill thật tràn giờ | Áp dụng chính sách tràn giờ ở mục 2 (cắt demo trước) |
| `/writing-plans` + `/executing-plans` chưa kịp tập dượt trước giờ diễn, hoặc lỗi giữa chừng | Bỏ qua 2 skill này, để Claude Code sửa gamification tự do như phương án dự phòng |

## 9. Rủi ro đã xác định & cách xử lý

| Rủi ro | Mức độ | Xử lý |
|---|---|---|
| Đăng nhập Google/lỗi mạng lúc live (Stitch, AI Studio) | Trung bình | Đăng nhập & giữ phiên trước giờ; bản dự phòng sẵn sàng (mục 7, 8) |
| Kết quả live lệch nhiều so với bản tập dượt do quên dùng đúng prompt | Trung bình | Dùng đúng prompt đã chuẩn bị, không ứng biến (mục 4, 6) |
| Brainstorm dùng skill thật tràn giờ | Cao (đã chấp nhận) | Cắt vào phần demo trước, giữ nguyên build và giờ Q&A (mục 2) |
| Khán giả so sánh với bản VietTyping đầy đủ, thấy bản demo thiếu phần gõ phím | Trung bình | Nói rõ phạm vi (không có gõ phím) ngay từ phút đầu (mục 1, 3) |
| Prompt mở đầu brainstorm ở mục 4 (bản rút gọn) chưa từng tập dượt — số vòng hỏi-đáp và khung giờ mục 2 (18 phút) có thể sai lệch | Trung bình (chưa kiểm chứng) | Tập dượt lần 2 dùng đúng prompt rút gọn này, bấm giờ thật, cập nhật lại mục 2 |
| `/writing-plans` + `/executing-plans` ở bước Claude Code (phút 44–54) chưa từng tập dượt — có thể tốn nhiều/ít hơn 10 phút, hoặc plan không khớp trôi chảy với source do AI Studio sinh ra | Trung bình (chưa kiểm chứng) | Tập dượt lần 2 phải chạy hết bước này để đo thời gian thật; nếu không kịp, bỏ qua và để Claude Code sửa tự do (mục 8) |

## 10. Nhật ký tập dượt

*(Điền sau mỗi lần thử: thời gian thực tế từng đoạn, chỗ vấp, câu nói cần chỉnh.)*

- **Lần 1 (07/07/2026)** — chỉ chạy phần brainstorm + viết spec/prompt, chưa chạy Stitch/AI Studio/Claude Code hoàn thiện:
  - Gọi `/brainstorming` thật, để tự nhiên không ép 2-3 câu — thực tế cần khoảng 8 câu hỏi tuần tự mới hội tụ xong thiết kế đầu tiên (chọn chủ đề mới thay vì tái dùng 8 từ cũ, rút còn 5 từ, chốt luật sai, thêm yếu tố EdTech), sau đó thêm 1 vòng phản hồi/tinh chỉnh để tích hợp 3 minigame từ sản phẩm gốc thay vì 1 màn hình gõ phím — tổng khoảng 13 vòng.
  - **Chỗ vấp lớn nhất:** kết quả brainstorm tự do lệch hẳn so với đặc tả cũ ban đầu (đổi từ "1 màn hình gõ từ vựng" sang "Menu chọn 1 trong 3 minigame, bỏ hẳn gõ phím") — đúng như rủi ro đã lường trước ở mục 9. Vì là lần tập dượt đầu tiên nên chưa có "prompt chuẩn" để bám theo — bản ghi câu hỏi/trả lời ở đây giờ là kịch bản chuẩn cho các lần sau (mục 4, 6).
  - **Câu hỏi cần chuẩn bị sẵn câu trả lời cho lần diễn thật** (đúng thứ tự đã hỏi): (1) nguồn từ vựng — tái dùng hay chủ đề mới; (2) chủ đề mới cụ thể là gì; (3) số lượng từ; (4) chốt danh sách từ; (5) luật khi gõ/chọn sai; (6) có giới hạn thời gian không; (7) phong cách giao diện; (8) màn hoàn thành hiện gì; (9) gõ phím có bắt buộc giữ không; (10) cấu trúc demo (1 màn hay menu nhiều minigame); (11) chọn cụ thể 3 minigame nào.
  - **Quyết định bỏ gõ phím khỏi demo** (để đổi lấy 3 minigame đa dạng) đã được xác nhận giữ nguyên — mục 1, 3, 5 đã cập nhật khớp nhau, không còn mâu thuẫn.
  - **Việc đã xong:** spec đầy đủ + prompt rút gọn cho Stitch/AI Studio ([2026-07-07-workshop-demo-3-minigames-design.md](2026-07-07-workshop-demo-3-minigames-design.md)), slide mở đầu ([vibe-coding-workshop-buoi1-slides.pptx](../slides/vibe-coding-workshop-buoi1-slides.pptx)), và workbook này đã làm mịn. Repo dự phòng `~/Code/oss/projects/viettyping-workshop-demo` đã tạo (`git init`), còn trống.
  - **Việc chưa xong (cho lần tập dượt kế tiếp):** chạy prompt Stitch thật (dự kiến qua trình duyệt claude-in-chrome, không qua Stitch MCP — MCP `stitch` từng bị lỗi `tools fetch failed: can't resolve reference #/$defs/ScreenInstance`, chưa rõ đã hết lỗi chưa), đồng bộ sang AI Studio, tải source vào repo dự phòng, chạy `/writing-plans` + `/executing-plans` hoàn thiện gamification, rồi commit checkpoint. Đo giờ thật cho khung 6–24 và 44–54.
