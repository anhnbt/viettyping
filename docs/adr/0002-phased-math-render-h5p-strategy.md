# ADR 0002: Phased Strategy for Math Render and H5P Integration

**Trạng thái:** ✅ Đã duyệt & Triển khai (Approved & Implemented)

## Bối cảnh (Context)
Khi xây dựng các hoạt động học toán tương tác cho trẻ lớp 1, chúng ta cần quyết định phương pháp hiển thị ký hiệu toán học và các tương tác trò chơi. Có hai giải pháp phổ biến là tích hợp thư viện Math Render (KaTeX/MathJax) và sử dụng hệ thống học liệu tương tác H5P.
Tuy nhiên, trẻ em 6 tuổi (lớp 1) chỉ học các phép toán cộng trừ cơ bản đơn giản (không chứa phân số, căn thức phức tạp) và đòi hỏi giao diện kéo thả trực quan, hoạt họa rực rỡ, hấp dẫn (Neo-brutalism/Gamification) hơn là các công thức toán học khô khan.

## Quyết định (Decision)
Chúng ta quyết định hoãn việc cấu hình Math Render (như KaTeX/MathJax) và H5P Server ở Giai đoạn 1 (Lớp 1 - trẻ 6 tuổi). Thay vào đó, chúng ta xây dựng các custom React components tương tác cao (như kéo thả quả táo, đồng xu bằng `@dnd-kit/core` và `framer-motion`) để tối ưu hóa hiệu năng, bảo trì dễ dàng và tùy biến giao diện hoạt họa rực rỡ.
Việc tích hợp KaTeX và H5P Server sẽ được dời sang các giai đoạn sau (Lớp 2 - 5) khi trẻ bắt đầu tiếp xúc với các ký hiệu toán học phức tạp và khối lượng học liệu tương tác lớn hơn.

## Hệ quả (Consequences)
- **Ưu điểm**:
  * Tùy biến tối đa giao diện EdTech rực rỡ, âm thanh sinh động kích thích tinh thần học tập của trẻ 6 tuổi.
  * Giảm dung lượng bundle size của frontend Next.js do không phải gánh thêm KaTeX/MathJax hay iframe H5P nặng nề.
  * Tránh sự phức tạp khi dựng và vận hành H5P Server ở giai đoạn đầu.
- **Nhược điểm**: Khi mở rộng quy mô lên các lớp lớn hơn, cần phát triển thêm adapter để render KaTeX hoặc tích hợp H5P.
