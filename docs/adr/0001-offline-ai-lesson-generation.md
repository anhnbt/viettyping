# Offline Generative AI for Lesson Config

Chúng ta quyết định sử dụng Generative AI (như ChatGPT, Gemini) hoàn toàn ở chế độ offline (thủ công bởi Quản trị viên/Admin) để sinh ra các tệp cấu hình bài học (Lesson Config) dưới định dạng JSON, thay vì tích hợp AI trực tiếp vào Web App trong thời gian thực khi trẻ đang học.

Quyết định này đảm bảo rằng nội dung bài học (bao gồm các phương án sai/distractors, yêu cầu sinh ảnh/image prompts, và phần thưởng cơ bản) luôn có thể được Admin kiểm duyệt trước, đảm bảo an toàn giáo dục. Đồng thời, Web App sẽ hoạt động mượt mà, không gặp độ trễ (latency) hoặc chi phí gọi API AI mỗi lần người dùng tương tác. Ở Phase 1, Web App sẽ đọc trực tiếp từ các file JSON. Ở Phase 2, các JSON này sẽ được import vào Database.
