# PRD: Đồng bộ hóa Tiến trình Học tập & Hệ thống Streak Server-Side (Phase 3)

## Problem Statement

Hiện tại, toàn bộ tiến trình học tập của học sinh bao gồm điểm kinh nghiệm (XP), Cấp độ (Level), chuỗi ngày học tập liên tục (Streak), và danh sách bài học đã hoàn thành chỉ được lưu trữ cục bộ trên trình duyệt thông qua `localStorage`. Điều này dẫn đến hai vấn đề lớn:
1. **Mất dữ liệu & Không đồng bộ đa thiết bị:** Khi trẻ chuyển đổi từ học trên máy tính của bố mẹ sang iPad, hoặc khi phụ huynh xóa dữ liệu duyệt web, toàn bộ tiến trình học của bé sẽ biến mất hoàn toàn. Phụ huynh cũng không thể theo dõi tiến trình của con từ xa.
2. **Logic tính Streak chưa chuẩn xác:** Hiện trạng logic Streak tăng lên $+1$ sau mỗi bài học được hoàn thành mà không kiểm tra ngày thực tế. Điều này cho phép trẻ hoàn thành $10$ bài trong $10$ phút và đạt chuỗi "Streak 10 ngày", làm mất đi ý nghĩa sư phạm của việc rèn luyện thói quen học tập đều đặn mỗi ngày (Daily Habit).

## Solution

Chuyển đổi hệ thống quản lý tiến trình sang mô hình **Offline-First Hybrid Synchronization** kết nối với Backend **Java Spring Boot**. 
1. **Hệ thống Đồng bộ hóa Tiến trình (Progress Sync Engine):** Lưu trữ tạm thời ở LocalStorage khi không có kết nối internet và tự động đẩy dữ liệu lên cơ sở dữ liệu MySQL thông qua API RESTful khi trực tuyến.
2. **Hệ thống Tính toán Streak Server-Side (Daily Streak Engine):** Server sẽ chịu trách nhiệm tính toán chuỗi ngày học dựa trên múi giờ địa phương của trẻ và thời gian nộp bài học cuối cùng để đảm bảo tính chính xác và nhất quán.

## User Stories

1. As a (Là một) Học sinh (6 tuổi), I want (tôi muốn) tiến trình học (XP, Level, Huy hiệu) của mình tự động lưu lại, so that (để) tôi có thể học tiếp trên iPad của mẹ hoặc máy tính của bố mà không bị mất cấp độ.
2. As a Học sinh, I want (tôi muốn) chuỗi Streak (ngày học liên tiếp) của mình chỉ tăng thêm 1 ngày khi tôi hoàn thành bài học đầu tiên trong ngày đó, so that (để) tôi thực sự rèn luyện được thói quen học đều đặn mỗi ngày.
3. As a Học sinh, I want (tôi muốn) điểm XP và Streak của tôi vẫn được ghi nhận khi mất mạng đột ngột và được đồng bộ lại khi có internet, so that (để) tôi không bị mất công sức học tập.
4. As a Phụ huynh, I want (tôi muốn) xem bảng điểm và chuỗi Streak của con mình cập nhật tức thời trên màn hình Góc Phụ Huynh từ xa, so that (để) tôi có thể động viên con kịp thời.
5. As a Developer, I want (tôi muốn) có API đồng bộ tiến trình thông qua queue offline-first rõ ràng, so that (để) tôi có thể dễ dàng xử lý các trường hợp mạng yếu hoặc lỗi mất kết nối mà không làm gián đoạn trải nghiệm học của trẻ.

## Implementation Decisions

- **Architectural Decisions (Quyết định Kiến trúc):**
  - **Mô hình Offline-First:** Next.js Frontend sẽ duy trì một hàng đợi đồng bộ (`Sync Queue`) trong LocalStorage. Khi một sự kiện ghi nhận XP/Streak xảy ra, nó sẽ được đẩy vào queue này trước, sau đó một Service Worker hoặc Hook sẽ định kỳ cố gắng gửi dữ liệu lên Server.
  - **Cách tính Daily Streak ở Server:**
    - Khi nhận yêu cầu hoàn thành bài tập, Server sẽ dựa trên múi giờ (Timezone) của Client gửi lên để xác định ngày hiện tại của trẻ (ví dụ: `Asia/Ho_Chi_Minh`).
    - So sánh ngày hiện tại với ngày hoàn thành bài học gần nhất (`last_active_date`).
    - *Quy tắc:*
      - Nếu trùng ngày: Giữ nguyên Streak (đã hoàn thành chỉ tiêu ngày hôm nay).
      - Nếu cách đúng 1 ngày: Cộng thêm 1 ngày vào Streak.
      - Nếu cách từ 2 ngày trở lên: Reset Streak về 1 (bé đã bị ngắt chuỗi học tập).

- **Modules Built/Modified:**
  - `src/utils/syncQueue.ts` [NEW]: Quản lý hàng đợi offline-first, lưu trữ các gói tin đồng bộ chưa gửi thành công và thực hiện cơ chế tự động gửi lại (retry exponential backoff).
  - `src/contexts/StudentContext.tsx` [MODIFY]: Tích hợp thêm trạng thái đồng bộ (`isSyncing`, `lastSyncedAt`) và các phương thức đồng bộ thông tin cấu hình từ Server.
  - `src/app/typing/[lessonId]/page.tsx` và `src/app/typing/turtle-rescue/page.tsx` [MODIFY]: Chuyển đổi từ việc tăng trực tiếp XP/Streak ở client sang việc gọi qua `syncQueue`.

- **API Contracts (Khái niệm):**
  - `POST /api/v1/students/{studentId}/sync-progress`: Gửi danh sách các gói tin tiến trình đã làm (id bài học, điểm số, timestamp, timezone). Phản hồi trạng thái XP, Level, Streak và danh sách Huy hiệu mới nhất từ Server.
  - `GET /api/v1/students/{studentId}/progress`: Lấy toàn bộ tiến trình học tập để phục hồi lại dữ liệu LocalStorage khi trẻ chuyển sang trình duyệt/thiết bị mới.

## Testing Decisions

- **Kiểm thử hành vi (Behavioral Testing):**
  - **Mất mạng (Offline Simulation):** Giả lập ngắt kết nối mạng (`navigator.onLine = false`), cho trẻ hoàn thành 2 bài học (XP tăng từ 1000 lên 1300). Sau đó giả lập có mạng trở lại, kiểm tra xem client có tự động gửi request đồng bộ và server có trả về cấp độ chính xác không.
  - **Tính toán Streak qua múi giờ:** Test giả lập các mốc thời gian hoàn thành bài học khác nhau (cuối ngày hôm nay lúc 23:59 và đầu ngày mai lúc 00:01) xem Streak có tăng chính xác lên $+1$ ngày hay không.

## Out of Scope

- Triển khai chi tiết code Java Spring Boot và Database MySQL (các phần này thuộc phạm vi tài liệu Backend).
- Đồng bộ hóa thời gian thực (Real-time sync) qua WebSockets hoặc Server-Sent Events. Việc đồng bộ qua HTTP REST API dựa trên sự kiện và hàng đợi là đủ đáp ứng nhu cầu.

## Further Notes

- Vì các bé sử dụng thiết bị của phụ huynh (có thể là các máy tính bảng cũ, mạng 3G/4G chập chờn khi di chuyển), thiết kế Offline-first là bắt buộc để đảm bảo trẻ không gặp màn hình xoay tròn (loading) gây ức chế khi đang học.
