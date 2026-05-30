# 🎨 Hệ Thống Thiết Kế VietTyping (KidLearn Design System)

Hệ thống thiết kế **VietTyping** kế thừa từ triết lý thiết kế **KidLearn**, hướng tới đối tượng người dùng là trẻ em từ 5-12 tuổi (trọng tâm là học sinh lớp 1 - 6 tuổi). 

Thiết kế ưu tiên các hình khối bo tròn, to rõ, dễ tương tác, độ nổi khối cao (Neobrutalism nhẹ) để trẻ có cảm giác như đang chơi đồ chơi thực tế. Màu sắc sử dụng tông tươi sáng, rực rỡ nhưng được cân bằng để không gây mỏi mắt hay quá tải thông tin.

---

## 📐 Nguyên Tắc Thiết Kế Cho Trẻ Em (Lớp 1)

1. **Target Tương Tác Lớn:** Mọi nút bấm, thẻ lựa chọn phải có vùng chạm tối thiểu **48px x 48px** (khuyên dùng **56px** trở lên) để tránh trẻ bấm nhầm.
2. **Thiết Kế Nổi Khối (Playful Depth):** Sử dụng các đường viền dày (border-2 hoặc border-4) kết hợp với bóng đổ phẳng (chunky flat shadow) lệch trục để tạo cảm giác nút nhấn cơ học trực quan.
3. **Phản Hồi Trực Quan & Âm Thanh:** Mỗi thao tác đúng/sai cần có hiệu ứng nảy (bounce), đổi màu rõ rệt, kết hợp hiệu ứng âm thanh (vui tươi khi đúng, nhẹ nhàng khích lệ khi chưa đúng).
4. **Tránh Áp Lực Thời Gian:** Không sử dụng các đồng hồ đếm ngược gấp gáp gây căng thẳng cho trẻ nhỏ, thay vào đó hãy dùng các thanh tiến độ (Progress Bar) mượt mà để khích lệ.
5. **Hình Ảnh Song Hành Với Chữ:** Trẻ lớp 1 đang tập đọc, vì vậy hãy luôn đi kèm Icon, hình minh họa hoặc Emoji cạnh các dòng văn bản hướng dẫn.

---

## 🎨 Bảng Màu (Color Tokens)

VietTyping sử dụng các sắc độ màu sắc vui tươi, thân thiện:

* **Primary (Đỏ dâu tây / Cam ấm):** Dùng cho các hành động quan trọng nhất, các phần nổi bật.
  * Tailwind class: `bg-rose-500 hover:bg-rose-600 text-white` hoặc `bg-orange-500 hover:bg-orange-600 text-white`
* **Secondary (Xanh da trời):** Dùng cho các tương tác phụ, liên kết, điều hướng.
  * Tailwind class: `bg-sky-500 hover:bg-sky-600 text-white`
* **Tertiary (Vàng mặt trời):** Tượng trưng cho phần thưởng, sao, cúp, huy hiệu, điểm XP.
  * Tailwind class: `bg-amber-400 text-amber-950`
* **Success (Xanh lá cây ngọc):** Dùng khi gõ đúng từ, hoàn thành câu, đạt kết quả tốt.
  * Tailwind class: `bg-emerald-500 text-white`
* **Error/Warning (Đỏ/Cam nhạt):** Gợi ý thử lại một cách nhẹ nhàng.
  * Tailwind class: `bg-amber-100 border-amber-400 text-amber-800` (Khuyên dùng trạng thái khích lệ "Thử lại nhé!" thay vì báo lỗi nghiêm trọng).
* **Nền Trang (Surface):** Sử dụng màu nền sáng ấm, hạn chế màu trắng tinh để giảm mỏi mắt.
  * Tailwind class: `bg-amber-50/50` hoặc `bg-slate-50`

---

## ✍️ Phông Chữ (Typography)

Dự án sử dụng phông chữ **Be Vietnam Pro** làm mặc định, hiển thị tiếng Việt cực kỳ tốt, nét chữ tròn trịa phù hợp với môi trường giáo dục:
* **Tiêu đề lớn (Hero Title):** Cực to, đậm, tạo sự hào hứng.
  * Tailwind class: `text-4xl md:text-5xl font-black tracking-wide text-slate-800`
* **Tiêu đề mục (Heading):**
  * Tailwind class: `text-2xl md:text-3xl font-extrabold text-slate-800`
* **Văn bản hướng dẫn / Câu gõ:** Nét chữ rõ ràng, khoảng cách dòng rộng rãi.
  * Tailwind class: `text-lg md:text-xl font-bold leading-relaxed text-slate-700`

---

## 🧱 Các Thành Phần Giao Diện Chuẩn (UI Components)

Để đồng bộ giao diện toàn bộ ứng dụng, các lập trình viên nên sử dụng các mẫu thiết kế Tailwind CSS sau đây:

### 1. Nút Bấm Chunky (Chunky Playful Button)
Nút bấm có viền đen đậm, bo góc tròn sâu, và có bóng đổ cứng tạo cảm giác nổi 3D cơ học. Khi bấm vào sẽ có hiệu ứng nhấn xuống (active:translate-y).

```tsx
<button className="
  px-6 py-3 
  text-lg font-bold text-white 
  bg-rose-500 hover:bg-rose-600 
  border-2 border-slate-800 
  rounded-2xl 
  shadow-[4px_4px_0px_0px_#1e293b] 
  active:translate-x-[2px] active:translate-y-[2px] 
  active:shadow-[2px_2px_0px_0px_#1e293b] 
  transition-all duration-100
">
  Bắt đầu ngay! 🚀
</button>
```

### 2. Thẻ Bài Học / Hoạt Động (Playful Card)
Thẻ hiển thị nội dung bài học, có hover dịch chuyển nhẹ lên trên và đổ bóng sâu hơn để thu hút trẻ tương tác.

```tsx
<div className="
  p-6 
  bg-white 
  border-2 border-slate-800 
  rounded-3xl 
  shadow-[6px_6px_0px_0px_#1e293b] 
  hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_#1e293b] 
  transition-all duration-200
">
  <h3 className="text-xl font-extrabold text-slate-800">Chủ đề 1: Bảng Chữ Cái</h3>
  <p className="mt-2 text-slate-600">Luyện gõ các chữ cái đơn giản có dấu.</p>
</div>
```

### 3. Chip Trạng Thái / Phần Thưởng (Pill Badge)
Nhỏ nhắn, bo tròn tuyệt đối (pill) dùng để gắn nhãn độ khó hoặc phần thưởng:

```tsx
// Chip Hoàn Thành (Success)
<span className="inline-flex items-center gap-1 px-3 py-1 text-sm font-extrabold text-emerald-800 bg-emerald-100 border border-emerald-300 rounded-full">
  ✨ Đã xong
</span>

// Chip Khóa (Locked)
<span className="inline-flex items-center gap-1 px-3 py-1 text-sm font-extrabold text-slate-400 bg-slate-100 border border-slate-200 rounded-full">
  🔒 Chưa mở
</span>
```

---

## ✨ Hiệu Ứng Chuyển Động (Animations)

Chúng ta sử dụng `framer-motion` cho các hiệu ứng chuyển động mượt mà của trẻ nhỏ:
* **Lật thẻ (Card Flip):** Khi trẻ học từ vựng qua Flashcard.
* **Thanh tiến độ (Progress Bar):** Tăng trưởng mượt mà (`layoutId` hoặc `spring` physics) để trẻ thấy thành quả rõ rệt.
* **Bắn pháo hoa (Confetti):** Khi hoàn thành bài học, sử dụng thư viện `canvas-confetti` để ăn mừng chiến thắng hoành tráng!

---

Hãy cùng giữ vững các tiêu chuẩn thiết kế này để mang lại một trải nghiệm vừa học vừa chơi an toàn, cuốn hút và trực quan nhất cho thế hệ tương lai! 💖
