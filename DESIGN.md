# 🎨 Hệ Thống Thiết Kế Học Tập Phân Tầng Trực Quan (Tactile Tiered Learning)

Hệ thống thiết kế **VietTyping** được xây dựng dựa trên triết lý **Tactile Play (Chơi mà học trực quan)**. Nó cân bằng giữa tính chất ngộ nghĩnh của một ứng dụng giáo dục cho trẻ em với cấu trúc tinh tế của một sản phẩm EdTech cao cấp. Giao diện người dùng mang lại cảm giác giống như một món đồ chơi vật lý—thân thiện, phản hồi nhanh và kích thích trẻ chạm vào.

Phong cách trực quan là **Tactile / Skeuomorphic Modernism (Hiện đại hóa Skeuomorphic / Trực quan nổi khối)**. Thiết kế tận dụng các khối nổi 3D nhẹ, các nút bấm lấy cảm hứng từ phím cơ (keycaps), kết hợp bảng màu ấm áp để giảm mỏi mắt cho trẻ. Mục tiêu cốt lõi là thúc đẩy cảm giác tiến bộ và thành tích thông qua các phân cấp độ khó của linh vật **"Animal Mastery" (Làm chủ động vật)**, sử dụng sự thay đổi màu sắc chủ đạo rõ rệt để báo hiệu cấp độ và trạng thái tiến bộ của bé.

---

## 📐 Nguyên Tắc Thiết Kế Cho Trẻ Em (Lớp 1 - Lớp 5)

1. **Target Tương Tác Lớn & Nổi Khối:** Mọi nút bấm, thẻ lựa chọn phải có vùng tương tác lớn, kết hợp với bóng đổ phẳng (chunky flat shadow) lệch trục (độ dày offset từ 4px đến 8px) tạo hiệu ứng keycap 3D rõ nét để trẻ cảm nhận được độ lún khi bấm cơ học.
2. **Phản Hồi Xúc Giác Trực Quan:** Khi phần tử được nhấn, nó sẽ dịch chuyển theo trục Y xuống từ 2px-4px, đồng thời bóng đổ dưới chân thu nhỏ lại để tạo phản hồi chân thực.
3. **Màu Sắc Ấm Áp Giảm Mỏi Mắt:** Màu nền luôn sử dụng các tông màu ấm áp (Ivory/Cream), hạn chế màu trắng tinh nhằm bảo vệ mắt trẻ nhỏ và giảm thiểu ánh sáng xanh.
4. **Phân Tầng Theo Màu Sắc Động Vật:** Tốc độ và cấp độ được phản ánh sinh động qua 4 linh vật cốt lõi với 4 màu sắc chủ đề riêng biệt.

---

## 🎨 Bảng Màu (Color Tokens)

Hệ thống thiết kế này sử dụng kiến trúc **Tiered Primary Architecture (Kiến trúc Màu chủ đạo Phân tầng)**. Trong khi màu nền (surface) và văn bản (text) được giữ cố định để bảo đảm tính nhất quán thương hiệu và bảo vệ mắt, thì mã màu `primary` sẽ thay đổi động theo từng cấp độ linh vật:

- **Surface (Nền):** Màu kem ngà (Ivory base) ấm áp, thân thiện như trang giấy.
- **Text (Chữ):** Màu nâu than đậm (Deep Charcoal-Brown) tạo độ tương phản cao nhưng dịu mắt, tránh cảm giác khô khan của màu đen thuần.
- **Bảng phân tầng Tier System:**
  - 🐼 **PandaTyper:** Màu Đỏ May Mắn (Bắt đầu - Beginner) - Mã màu `#e03131`
  - 🐢 **TurtleTyper:** Màu Xanh Lá Cây Ngọc (Kiên trì - Steady) - Mã màu `#006d30`
  - 🐰 **BunnyTyper:** Màu Cam Ấm Áp (Nhanh nhẹn - Fast) - Mã màu `#8f4e00` (Container màu `#ff9f43`)
  - 🐆 **LeopardTyper:** Màu Vàng Gold (Thần tốc - Elite) - Mã màu `#7a5900`

---

## ✍️ Phông Chữ (Typography)

Dự án sử dụng phông chữ **Plus Jakarta Sans** làm mặc định trên toàn bộ hệ thống để đảm bảo nét chữ tròn trịa, hiện đại, hình học rõ ràng và dễ đọc đối với trẻ nhỏ đang tập chữ:

- **Tiêu đề siêu lớn (Display & Headlines):** Độ dày cực đậm (fontWeight: 700 - 800) tạo phân cấp chữ rõ ràng, bắt mắt giống như các sticker dán.
  - Cỡ chữ: `48px` (desktop), `24px` - `32px` (mobile).
- **Văn bản nội dung (Body):** Mặc định ở kích thước `18px` (body-lg) hoặc `16px` (body-md) để hiển thị sắc nét trên iPad/máy tính bảng và máy tính để bàn.
- **Nhãn chức năng (Labels):** Định dạng in hoa (label-caps / label-bold), đậm nét và giãn chữ nhẹ để tạo cảm giác giống nhãn dán trên các phím cơ vật lý.

---

## 🧱 Các Thành Phần Giao Giao Diện Cơ Bản (Tactile Components)

### 1. Nút bấm Keycap 3D
Nút bấm luôn có độ dày viền và bóng đổ lệch trục. Phản hồi nhún chân thực khi bấm chuột.
*   **Màu sắc:** Sử dụng màu primary của chủ đề hiện tại.
*   **Shadow:** Sử dụng mã màu đậm hơn 20% của màu primary hiện tại với độ dày 4px-8px.
*   **Chuyển động (Active):** Khi click hoặc gõ phím tương ứng, dịch chuyển Y-axis xuống 2px-4px.

### 2. Thẻ nội dung (Cards)
Sử dụng màu nền giấy ngà ấm áp với viền mỏng và bóng đổ nhẹ ở đáy (2px) để tạo cảm giác nổi trên mặt bàn học. Tất cả các thẻ đều được bo góc cực sâu với `rounded-xl` (16px).

### 3. Vùng nhập liệu & Bàn phím ảo
*   Bàn phím ảo phải mô phỏng trực quan các phím vật lý đang gõ.
*   Khi trẻ gõ đúng ký tự, phím ảo tương ứng sẽ chuyển màu `primary` của chủ đề hiện tại và nhún xuống.

### 4. Khung chứa Linh Vật (Animal Mascots)
Linh vật luôn được đặt trong các khung hình tròn, có hiệu ứng "pop-out" (phần đầu hoặc tai của linh vật hơi nhô ra ngoài viền khung) để tạo chiều sâu trực quan sinh động.
