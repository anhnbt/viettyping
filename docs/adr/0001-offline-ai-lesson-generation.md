# ADR 0001: Offline Generative AI for Lesson Config

**Trạng thái:** ✅ Đã duyệt & Triển khai (Approved & Implemented)

## Bối cảnh (Context)
Trong giai đoạn đầu phát triển ứng dụng VietTyping dành cho trẻ em 6 tuổi, chúng ta cần một lượng học liệu phong phú và đa dạng. Nếu gọi trực tiếp API của các mô hình Generative AI (như OpenAI GPT hoặc Google Gemini) theo thời gian thực (real-time) khi trẻ đang làm bài, ứng dụng sẽ đối mặt với các rủi ro:
1. Độ trễ (Latency) cao ảnh hưởng đến sự tập trung của trẻ.
2. Chi phí API lớn và khó kiểm soát.
3. Nội dung sinh ra ngẫu nhiên có thể chứa lỗi chính tả hoặc không phù hợp với chuẩn sư phạm lớp 1.

## Quyết định (Decision)
Chúng ta quyết định sử dụng Generative AI hoàn toàn ở chế độ offline (thủ công bởi Quản trị viên/Admin) để sinh ra các tệp cấu hình bài học (Lesson Config) dưới định dạng JSON, thay vì tích hợp AI trực tiếp vào Web App trong thời gian thực khi trẻ đang học.
- **Giai đoạn 1**: Web App đọc trực tiếp từ các file JSON tĩnh được lưu trữ cục bộ.
- **Giai đoạn 2**: Nhập toàn bộ dữ liệu cấu hình JSON này vào Database (Supabase) để dễ dàng quản trị động thông qua Admin CMS Dashboard.

## Hệ quả (Consequences)
- **Ưu điểm**:
  * Đảm bảo nội dung giáo dục an toàn 100% và được kiểm duyệt trước khi xuất bản.
  * Web App hoạt động mượt mà với độ trễ bằng không do không phải chờ AI sinh nội dung.
  * Tiết kiệm và tối ưu hóa hoàn toàn chi phí vận hành API.
- **Nhược điểm**: Admin cần mất thời gian thao tác sinh dữ liệu và import ban đầu, nhưng điều này đã được giải quyết thông qua Form UI trực quan của Admin Dashboard.
