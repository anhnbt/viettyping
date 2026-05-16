# VietTyping Lesson Generator

Prompt system dùng để tạo dữ liệu bài học tiếng Việt cho trẻ em thông qua AI, phục vụ cho một ứng dụng phần mềm/web giáo dục.

## Language

**Lesson Config** (Cấu hình Bài học):
Cấu trúc dữ liệu chuẩn (định dạng JSON) được AI sinh ra. Đây là dữ liệu thô (raw data) chứa nội dung bài học, cấu hình minigame và phần thưởng mặc định. Quản trị viên (Admin) sẽ import dữ liệu này vào hệ thống. Ở Phase 1, nó được lưu thành file JSON. Ở Phase 2, nó sẽ được lưu vào Database.
_Avoid_: Bài học văn bản, tài liệu Markdown, kịch bản đọc.

**Web App** (Ứng dụng Web):
Phần mềm thực tế mà học sinh/phụ huynh sẽ tương tác, có khả năng xử lý Lesson Data để hiển thị các trò chơi và hoạt động.
_Avoid_: Bản in giấy.

**Image Prompt**:
Câu mô tả chi tiết (ưu tiên tiếng Anh) do AI sinh ra trong Lesson Config, dùng để developer tự tạo hình ảnh bằng AI và lưu vào thư mục assets.
_Avoid_: Mô tả hình ảnh tiếng Việt dài dòng, URL tĩnh không tồn tại.

**Distractor**:
Các phương án sai/gây nhiễu hợp lý (về chính tả, dấu câu) do AI tự suy nghĩ và tạo ra ngay trong lúc sinh Lesson Config.
_Avoid_: Bóp méo từ tự động bằng code thuật toán của Web App.

## Relationships

- **Web App** đọc **Lesson Config** để hiển thị nội dung và trò chơi.
- AI sinh ra **Lesson Config** dựa trên System Prompt, trong đó chứa các **Image Prompt** và cấu hình **Rewards**.
- Developer chạy System Prompt trên các nền tảng AI (ChatGPT, Gemini) offline để sinh ra **Lesson Config** và lưu thành tệp JSON vào một thư mục dữ liệu (hoặc import vào Database ở Phase 2).
- **Web App** là phần mềm tĩnh/động, đọc các tệp JSON hoặc truy vấn DB để render ứng dụng, không kết nối gọi API AI trong thời gian thực (real-time).
- Developer dùng **Image Prompt** (có trong JSON) để tự tạo ảnh thật và đặt vào thư mục assets, sau đó trỏ đường dẫn ảnh vào Lesson Config.

## Example dialogue

> **Dev:** "Web App sẽ tự gọi API của ChatGPT để tạo bài học lúc bé đang học đúng không?"
> **Domain expert:** "Không, Web App chỉ đọc các tệp JSON. Tôi (Developer) sẽ tự dùng prompt này gọi AI offline để sinh ra các tệp JSON và bỏ vào thư mục câu hỏi của Web App trước."
> **Dev:** "Thế các câu trả lời sai (ví dụ chữ thiếu dấu) thì Web App tự sinh ra à?"
> **Domain expert:** "Không, AI sẽ sinh sẵn các **Distractor** vào trong tệp JSON. Web App chỉ việc lấy ra hiển thị."

## Flagged ambiguities

- "Bài học" ban đầu được hiểu nhầm là văn bản Markdown để phụ huynh đọc tự dạy con. Đã giải quyết: Đây là **Lesson Data** dạng cấu trúc dùng cho phần mềm.
