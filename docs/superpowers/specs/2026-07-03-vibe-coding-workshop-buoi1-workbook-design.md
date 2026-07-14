# Workbook: Vibe Coding Workshop — Buổi 1 (14/07/2026)

**Trạng thái:** Vừa làm mịn lại sau tập dượt lần 1, nội dung giờ khớp nhau xuyên suốt. Vẫn còn vài chỗ chưa kiểm chứng bằng tập dượt thật (khung giờ brainstorm, bước Claude Code) — xem mục 9 để biết cụ thể.

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

Buổi 1 sẽ live-build một app học tập nhỏ cho trẻ em, lấy cảm hứng từ VietTyping — app học tập đa môn kết hợp luyện gõ phím, xem README dự án — xây từ con số 0 trong 60 phút, trước khán giả trình độ hỗn hợp: có người mới học lập trình, có người đã biết code cơ bản, có người đã có kinh nghiệm. Khán giả ngồi xem, không tự tay làm theo.

Sau tập dượt lần 1, phạm vi demo đã rõ: 1 màn Menu dẫn vào 3 minigame (Vòng quay may mắn, Ghép hình kéo thả, Đúng hay Sai), có gamification là XP và confetti. Demo này không có phần luyện gõ phím của bản VietTyping gốc — đây là lựa chọn chủ động, để vừa sức làm xong trong 60 phút mà vẫn khoe được sự đa dạng của các minigame. Nó không đại diện đầy đủ cho sản phẩm thật, chỉ là một lát cắt để chứng minh cách làm. Đặc tả chi tiết nằm ở mục 5.

Sản phẩm không cần đầy đủ tính năng như bản gốc — chỉ cần chứng minh được vòng lặp "ý tưởng → sản phẩm chạy được" bằng AI là có thật, và cho khán giả thấy nhiều công cụ AI đang thực sự phối hợp với nhau, chứ không chỉ một công cụ duy nhất.

Chuỗi công cụ dùng để trình diễn: Claude (skill mở nguồn `/brainstorming`, bộ [obra/superpowers](https://github.com/obra/superpowers)) → Stitch (thiết kế giao diện) → Google AI Studio (đồng bộ thiết kế, sinh code) → tải source về máy → Claude Code (skill `/writing-plans` + `/executing-plans`, cùng bộ obra/superpowers) để hoàn thiện phần gamification.

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

Con số 18 phút cho đoạn 6–24 chỉ là ước tính, suy ra từ tập dượt lần 1 khi brainstorm mất khoảng 13 vòng hỏi-đáp (xem mục 10). Lúc đó dùng một prompt mở đầu chi tiết hơn bản rút gọn đang dùng ở mục 4, nên con số này chưa chắc còn đúng. Đoạn 44–54, bước Claude Code, thì chưa tập dượt lần nào cả. Cả hai cần bấm giờ thật ở lần tập dượt tới — chi tiết ở mục 9.

**Chính sách tràn giờ:** nếu bất kỳ bước nào chạy quá dự kiến, thứ tự cắt giảm là: (1) rút ngắn demo (54–60) trước, (2) giữ nguyên phần build (24–54) vì đó là nơi truyền tải giá trị giáo dục, (3) không bao giờ lùi giờ bắt đầu Q&A.

## 3. Talking points — Khám phá (phút 0–6)

Dùng kèm [slide mở đầu](../slides/vibe-coding-workshop-buoi1-slides.pptx) — 5 slide, chỉ cho đoạn này thôi, vì từ phút 6 trở đi là live-build trực tiếp, không dùng slide nữa.

- Mở đầu bằng câu hỏi cho khán giả: "Ai đã từng nhờ AI viết giúp một đoạn code chưa?"
- Vibe Coding: lập trình bằng cách *trò chuyện* với AI để mô tả điều mình muốn, thay vì tự gõ từng dòng cú pháp — AI lo phần "dịch ý tưởng thành code".
- Tư duy AI-Native: kỹ năng quan trọng nhất giờ không còn là "thuộc cú pháp" nữa, mà là biết đặt câu hỏi đúng, biết đọc và đánh giá kết quả AI đưa ra, và biết lặp lại thật nhanh khi chưa đúng ý.
- Nhấn mạnh sẽ thấy **nhiều công cụ AI thực tế phối hợp với nhau**: Claude để tư duy và brainstorm, Stitch để thiết kế giao diện, Google AI Studio để sinh code, quay lại Claude Code để hoàn thiện.
- Đặt kỳ vọng rõ ràng: "60 phút tới, mình sẽ dựng **lõi** — vòng lặp chơi cốt lõi — của một app học tập nhỏ cho trẻ em, lấy cảm hứng từ VietTyping. Hôm nay tập trung vào 3 minigame và gamification, **không có phần luyện gõ phím** của bản gốc. Bản VietTyping đầy đủ có nhiều tháng phát triển, với mascot 3D, âm thanh, hàng chục mini-game kể cả luyện gõ phím — hôm nay mình chỉ tập trung vào lõi game và AI, để mọi người thấy được tốc độ AI mang lại."
- **Ghi nhận nguồn:** các skill dùng hôm nay không phải hàng tự chế — `/brainstorming`, `/writing-plans`, `/executing-plans` đều lấy từ bộ mã nguồn mở [obra/superpowers](https://github.com/obra/superpowers), ai cũng cài được. Riêng lúc chuẩn bị kịch bản cho chính buổi này, mình còn dùng thêm skill `/grill-me` của [mattpocock](https://www.skills.sh/mattpocock/skills/grill-me) để tự hỏi-đáp trước — skill này không xuất hiện trong phần live, chỉ dùng ở hậu trường. Đây mới đúng là cái "cơ hội" các bạn mang về được sau buổi hôm nay, không chỉ ngồi xem trình diễn.

## 4. Brainstorm cùng Claude (phút 6–24)

Trên sân khấu, gọi thật skill `/brainstorming` của Claude — không diễn lại kịch bản hỏi-đáp giả. Câu gõ mở đầu, bản đã rút gọn để nghe tự nhiên hơn khi đọc trước đám đông:

```
/brainstorming Mình muốn làm một app nhỏ giúp các bé học sinh lớp 1 vừa chơi vừa học. Bạn hỏi mình để chốt ý tưởng nhé.
```

Lưu ý là câu này chưa được tập dượt (mục 9 có chi tiết) — bản đã test ở lần tập dượt 1 dài hơn và ra khoảng 13 vòng hỏi-đáp; bản rút gọn này thoáng hơn nên số vòng chắc sẽ khác đi, chưa biết chính xác bao nhiêu.

Không ép cứng số câu hỏi nữa — kế hoạch ban đầu định giới hạn 2-3 câu, nhưng sau tập dượt lần 1 thì bỏ luôn ý đó vì không thực tế.

Điều quan trọng nhất: vì đã tự chạy thử phiên này trước rồi, nên biết trước Claude có thể sẽ hỏi gì — cứ trả lời đúng như lần tập dượt, đừng ứng biến. Làm vậy thì kết quả live mới hội tụ về đúng cái spec đã dùng để làm bản dự phòng (mục 7). Trước giờ diễn, ôn lại nguyên văn danh sách câu hỏi/trả lời ở mục 10.

Kết quả mong đợi: hội tụ về đúng đặc tả chức năng ở mục 5.

## 5. Đặc tả sản phẩm demo (nội dung dùng làm prompt cho Stitch & AI Studio)

Spec đầy đủ và prompt rút gọn copy-paste sẵn cho Stitch/AI Studio nằm ở file riêng: [2026-07-07-workshop-demo-3-minigames-design.md](2026-07-07-workshop-demo-3-minigames-design.md). Tóm tắt lại ở đây:

**Phạm vi:** 1 màn Menu → chọn 1 trong 3 minigame, không đăng nhập, không lưu tiến trình, không âm thanh thu sẵn (chỉ TTS trình duyệt), không có gõ phím (xem mục 1).

**Dữ liệu (5 mục):** red, blue, yellow (màu hiển thị ô màu thật) + circle, star (icon hình khối).

**3 minigame:**
1. **Vòng quay may mắn** — quay ngẫu nhiên ra 1 mục (túi không hoàn lại), popup + TTS đọc to, +10 XP mỗi lượt. Hết 5 lượt là hoàn thành.
2. **Ghép hình kéo thả** — kéo 5 thẻ chữ vào đúng 5 ô màu/hình, sai thì rung nhẹ chứ không phạt gì. Ghép đúng hết là hoàn thành.
3. **Đúng hay Sai** — hỏi 1 ô màu/hình kèm 1 từ, bấm Đúng hoặc Sai. Trả lời sai thì câu đó bị đưa xuống cuối hàng đợi để hỏi lại sau — đây là yếu tố EdTech, giúp ôn lại đúng chỗ mình từng sai. Trả lời đúng hết hàng đợi (kể cả những câu từng sai) là hoàn thành.

Mỗi lần hoàn thành một minigame thì có confetti, hiện tổng XP, và 2 nút "Chơi lại" / "Về Menu". Cả 3 minigame dùng chung một bộ đếm XP xuyên suốt.

**Stack và cấu trúc code:** không ràng buộc trước, cứ để Google AI Studio sinh ra sao thì dùng vậy từ thiết kế của Stitch.

## 6. Nguyên tắc vận hành toolchain

- Các bước "sáng tạo" phải diễn ra live thật: gọi skill brainstorm, viết prompt thiết kế cho Stitch, bấm đồng bộ sang AI Studio — đây là phần khán giả cần thấy đang xảy ra trước mắt, không phải xem lại.
- Các bước "chờ đợi, cơ học" thì rút gọn bằng bản pre-bake: cài dependencies, tải file, mở project lần đầu — dùng luôn bản đã chuẩn bị sẵn từ lúc tập dượt, khỏi bắt khán giả ngồi chờ.
- Prompt live phải giống hệt prompt đã dùng khi tập dượt, không ứng biến — để nếu giữa chừng phải chuyển sang bản dự phòng thì không bị lệch tông với những gì vừa nói.
- Đăng nhập tài khoản Google cho Stitch và AI Studio, giữ phiên còn hiệu lực trước giờ diễn — tránh rủi ro màn hình đăng nhập hiện ra giữa lúc đang live.
- Ở bước Claude Code hoàn thiện (phút 44–54), làm đúng quy trình chuẩn của obra/superpowers thay vì sửa code tùy hứng: gọi `/writing-plans` trên source vừa tải về để ra một plan ngắn cho phần gamification cần thêm, rồi gọi `/executing-plans` để thực thi plan đó. Bước này chưa tập dượt lần nào — xem mục 9.

## 7. Chuẩn bị trước giờ (không làm trên sân khấu)

- [ ] Đăng nhập sẵn tài khoản Google cho Stitch và AI Studio, xác nhận phiên đăng nhập còn hiệu lực gần sát giờ diễn. *(Đã đăng nhập trong tập dượt lần 1 — nhưng gần giờ diễn thật nên xác nhận lại, phiên có thể hết hạn.)*
- [ ] Tự chạy thử toàn bộ pipeline 1 lần: brainstorm → Stitch → AI Studio → tải source → cài local → Claude Code hoàn thiện. Ghi lại đúng prompt và câu trả lời đã dùng ở từng bước. *(Mới xong phần brainstorm và spec/prompt, xem mục 10. Còn thiếu Stitch, AI Studio, tải source, cài local, và Claude Code hoàn thiện.)*
- [ ] Giữ lại bản source đã tải về, cài đặt sẵn làm bản dự phòng, xác nhận chạy được và gamification đã hoàn chỉnh. *(Chưa có source gì cả — repo dự phòng `~/Code/oss/projects/viettyping-workshop-demo` mới `git init`, còn trống trơn.)*
- [ ] Commit git checkpoint trên bản dự phòng ngay khi gamification xong, để lỡ bước hoàn thiện live bị lỗi thì còn checkout nhanh về được.
- [ ] Mở sẵn 1 tab trình duyệt chạy bản dự phòng, làm phương án cuối nếu có sự cố kỹ thuật lúc live.

## 8. Lưới an toàn

| Tình huống | Xử lý |
|---|---|
| Stitch/AI Studio treo, lỗi mạng, hoặc màn hình đăng nhập hiện ra lúc live | Chuyển ngay sang bản dự phòng đã tải và cài sẵn, nói "để tiết kiệm thời gian, mình dùng lại bản đã chuẩn bị này", rồi tiếp tục từ bước Claude Code hoàn thiện trên bản đó |
| Claude Code hoàn thiện gamification bị lỗi, AI sinh sai giữa chừng | `git checkout` về checkpoint đã commit sau tập dượt (mục 7) |
| Brainstorm skill thật tràn giờ | Áp dụng chính sách tràn giờ ở mục 2, cắt demo trước |
| `/writing-plans` + `/executing-plans` chưa kịp tập dượt trước giờ diễn, hoặc lỗi giữa chừng | Bỏ qua 2 skill này, để Claude Code sửa gamification tự do như phương án dự phòng |

## 9. Rủi ro đã xác định và cách xử lý

| Rủi ro | Mức độ | Xử lý |
|---|---|---|
| Đăng nhập Google/lỗi mạng lúc live (Stitch, AI Studio) | Trung bình | Đăng nhập và giữ phiên trước giờ; bản dự phòng đã sẵn sàng (mục 7, 8) |
| Kết quả live lệch nhiều so với bản tập dượt do quên dùng đúng prompt | Trung bình | Dùng đúng prompt đã chuẩn bị, không ứng biến (mục 4, 6) |
| Brainstorm dùng skill thật tràn giờ | Cao, đã chấp nhận | Cắt vào phần demo trước, giữ nguyên phần build và giờ Q&A (mục 2) |
| Khán giả so sánh với bản VietTyping đầy đủ, thấy demo thiếu phần gõ phím | Trung bình | Nói rõ phạm vi này (không có gõ phím) ngay từ phút đầu (mục 1, 3) |
| Prompt mở đầu brainstorm ở mục 4 (bản rút gọn) chưa từng tập dượt — số vòng hỏi-đáp và khung giờ 18 phút ở mục 2 có thể không còn đúng | Trung bình, chưa kiểm chứng | Tập dượt lần 2 dùng đúng prompt rút gọn này, bấm giờ thật, rồi cập nhật lại mục 2 |
| `/writing-plans` + `/executing-plans` ở bước Claude Code (phút 44–54) chưa tập dượt lần nào — có thể nhanh hơn hoặc chậm hơn 10 phút, hoặc plan không ăn khớp với source do AI Studio sinh ra | Trung bình, chưa kiểm chứng | Tập dượt lần 2 phải chạy hết bước này để đo thời gian thật; nếu không kịp thì bỏ qua và để Claude Code sửa tự do (mục 8) |

## 10. Nhật ký tập dượt

*(Điền sau mỗi lần thử: thời gian thực tế từng đoạn, chỗ vấp, câu nói cần chỉnh.)*

- **Lần 1 (07/07/2026)** — mới chạy được phần brainstorm và viết spec/prompt thôi, chưa đụng tới Stitch, AI Studio hay bước Claude Code hoàn thiện.
  - Gọi `/brainstorming` thật, cố tình không ép 2-3 câu như dự tính ban đầu — kết quả là mất khoảng 8 câu hỏi liên tiếp mới ra được thiết kế đầu tiên (đổi chủ đề từ vựng, rút còn 5 từ, chốt luật khi trả lời sai, thêm ý tưởng EdTech), rồi thêm một vòng góp ý nữa mới chốt được 3 minigame thay vì chỉ một màn gõ chữ. Tính ra khoảng 13 vòng hỏi-đáp tất cả.
  - Chỗ vấp lớn nhất: brainstorm tự do cho ra kết quả lệch hẳn so với ý tưởng ban đầu — từ "1 màn gõ từ vựng" thành "Menu chọn 1 trong 3 minigame, bỏ hẳn gõ phím". Đúng như đã lo trước ở mục 9. Nhưng vì đây là lần đầu thử nên chưa có gì làm chuẩn cả — giờ coi bản ghi câu hỏi/trả lời này chính là kịch bản chuẩn cho những lần sau (mục 4, 6).
  - Những câu hỏi cần nhớ sẵn câu trả lời cho hôm diễn thật, đúng thứ tự đã hỏi: (1) dùng lại 8 từ cũ hay đổi chủ đề mới; (2) chủ đề mới là gì; (3) bao nhiêu từ; (4) chốt danh sách từ; (5) luật khi trả lời sai; (6) có giới hạn thời gian không; (7) phong cách giao diện; (8) màn hoàn thành hiện gì; (9) có bắt buộc giữ gõ phím không; (10) demo là 1 màn hay có menu chọn nhiều minigame; (11) chọn cụ thể 3 minigame nào.
  - Quyết định bất ngờ nhất trong buổi tập dượt: bỏ hẳn gõ phím ra khỏi demo, đổi lại lấy 3 minigame đa dạng hơn. Giờ đã xác nhận giữ quyết định này — mục 1, 3, 5 đều sửa lại cho khớp nhau, không còn chỗ nào mâu thuẫn nữa.
  - Đã làm xong: spec đầy đủ và prompt rút gọn cho Stitch/AI Studio ([2026-07-07-workshop-demo-3-minigames-design.md](2026-07-07-workshop-demo-3-minigames-design.md)), slide mở đầu ([vibe-coding-workshop-buoi1-slides.pptx](../slides/vibe-coding-workshop-buoi1-slides.pptx)), và bản workbook này đã được làm mịn. Repo dự phòng `~/Code/oss/projects/viettyping-workshop-demo` đã tạo (`git init`) nhưng còn trống.
  - Còn phải làm ở lần tập dượt sau: chạy thử prompt Stitch thật — dự tính qua trình duyệt claude-in-chrome, vì MCP `stitch` từng báo lỗi `tools fetch failed: can't resolve reference #/$defs/ScreenInstance`, chưa rõ đã hết lỗi chưa — đồng bộ sang AI Studio, tải source vào repo dự phòng, chạy `/writing-plans` rồi `/executing-plans` để hoàn thiện gamification, và commit checkpoint. Nhớ bấm giờ thật cho đoạn 6–24 và 44–54.
