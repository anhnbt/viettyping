# Task 21: Server-Side Sync & Daily Streak Engine

## Tiêu đề
Đồng bộ hóa tiến trình học tập Server-side & Xây dựng công cụ tính Streak chính xác

## Mô tả (Description)
Thay thế hệ thống lưu trữ tiến trình cục bộ thô sơ bằng cơ chế Offline-First kết nối với Java Spring Boot Backend. Cung cấp API đồng bộ hóa điểm XP, trạng thái mở khóa bài học, Huy hiệu và thuật toán tính Streak hàng ngày (Daily Streak) dựa trên thời gian thực tế và múi giờ của người dùng.

## Mục tiêu (Objectives)
- Thiết lập module `syncQueue.ts` để lưu trữ tạm các gói tin tiến độ khi mất mạng và đồng bộ lại khi có mạng trực tuyến.
- Cập nhật `StudentContext.tsx` để xử lý các cuộc gọi API đồng bộ, tự động hợp nhất (merge) dữ liệu cục bộ với dữ liệu server khi bé đổi thiết bị.
- Loại bỏ logic cộng Streak tự động ở client (`currentStreak + 1` mỗi bài học). Thay thế bằng logic gọi API đồng bộ tiến trình để server phản hồi chuỗi Streak chuẩn xác.
- Tích hợp trạng thái đồng bộ (`isSyncing`, `syncError`) trên UI Header để thông báo trực quan (ví dụ: Icon đám mây xanh khi đã đồng bộ, icon đám mây gạch chéo màu vàng khi đang offline).

## Kỹ thuật (Tech Stack)
- Next.js Client REST Client (Fetch API / Axios)
- React Context API
- LocalStorage (Hàng đợi offline)
- Navigator Online API (theo dõi trạng thái kết nối mạng)
