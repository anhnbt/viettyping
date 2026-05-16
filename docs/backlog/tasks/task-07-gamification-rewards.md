# Task 07: Gamification & Rewards

## Tiêu đề
Tích hợp Gamification - Hệ thống phần thưởng và động lực học tập

## Mô tả (Description)
Theo object `base_rewards` trong JSON, ứng dụng cần thưởng XP (`completion_xp`), mở khóa huy hiệu (`badge_unlock_id`, `badge_name_vi`), và kích hoạt hiệu ứng ăn mừng (`celebration_type`: "fireworks") sau khi trẻ hoàn thành bài học.

## Mục tiêu (Objectives)
- Xây dựng component **Progress Bar** trên Header (di chuyển theo % hoàn thành bài học).
- Tích hợp thư viện `canvas-confetti` vào màn hình Tổng kết Bài học (Lesson Summary Screen).
- Thiết kế UI Popup thông báo "Hoàn thành xuất sắc!" và "Bạn nhận được Huy hiệu: [Tên huy hiệu]".
- Cập nhật XP và Huy hiệu mới vào Global State (`LessonContext`).
- Bổ sung hiệu ứng âm thanh cổ vũ (vỗ tay, reo hò) khi kết thúc bài.

## Kỹ thuật (Tech Stack)
- `canvas-confetti`
- React Context (cập nhật state)
- `framer-motion` (hiệu ứng bật popup huy hiệu)
- HTML5 Audio API
