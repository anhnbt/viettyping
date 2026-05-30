# VietTyping

## Mục tiêu & Vision
Xây dựng một ứng dụng web giáo dục tương tác cao, tập trung chuyên sâu vào kỹ năng **luyện gõ phím (typing practice)** dành cho học sinh lớp 1 (6 tuổi). Điểm nổi bật là ứng dụng bao quát **đa dạng các môn học** trong chương trình lớp 1 (Toán, Tiếng Việt, Tự nhiên & Xã hội...), giúp trẻ vừa rèn luyện phản xạ gõ phím thành thạo, vừa ôn tập kiến thức thông qua các bài học được số hóa dưới dạng mini-game sinh động.

## Users & Personas
- **Học sinh (Trẻ em 6 tuổi - Lớp 1):** Người dùng chính, học kiến thức toàn diện các môn học và luyện gõ phím máy tính thông qua việc tương tác với các mini-game rực rỡ, âm thanh vui nhộn, và nhận phần thưởng XP/Badge.
- **Quản trị viên (Admin) / Giáo viên:** Những người không có chuyên môn về lập trình. Họ sử dụng giao diện Form UI (Admin Dashboard) thân thiện để tự thiết kế và tạo nội dung bài học.

## Tech Stack & Rationale
- **Framework/Core:** Next.js (App Router), React, TypeScript.
- **Backend (Phase 2):** Java Spring Boot cung cấp REST API cho cả Web App (Client) và Admin Dashboard.
- **Database (Phase 2):** MySQL lưu trữ tiến trình học tập, tài khoản và nội dung bài học.
- **Styling:** Tailwind CSS (thiết kế rực rỡ, bo góc, màu sắc tươi sáng, glassmorphism).
- **Animations:** `framer-motion` (cho các hiệu ứng lật thẻ flashcard, thanh tiến độ mượt mà, hiệu ứng lên cấp).
- **Drag & Drop:** `@dnd-kit/core` hoặc `react-beautiful-dnd` (cho mini-game tìm mảnh ghép).
- **Gamification/Effects:** `canvas-confetti` (hiệu ứng bắn pháo hoa khi chiến thắng).
- **State Management:** React Context API (quản lý XP, Streak, và Progress).

## Constrains (time, resource)
- **Offline AI:** Dữ liệu bài học (kể cả phương án nhiễu) được tạo trước offline thông qua các mô hình AI (ChatGPT, Gemini) và lưu dưới dạng JSON. Web App không gọi API AI real-time.
- **Tài nguyên tĩnh:** Hình ảnh minh họa được developer tạo ra dựa trên Image Prompt do AI sinh ra và lưu tĩnh trong thư mục `assets`. Ở Phase 1, toàn bộ dữ liệu nằm trong tệp JSON. Phase 2 mới lưu vào Database.

## Glossary
- **Subject** (Môn học): Khái niệm cấp cao nhất, ví dụ: Toán, Tiếng Việt, Tiếng Anh.
- **Topic** (Chủ đề): Một phần nhỏ trong môn học, bao gồm nhiều bài học (Lesson) cùng chủ đề.
- **Lesson** / **Lesson Config**: Tập hợp các Activity có cùng mục tiêu học tập. Dữ liệu bài học được tạo qua Form UI trên Admin Dashboard, lưu trữ ở MySQL và trả về dạng JSON.
- **Activity**: Đơn vị học tập nhỏ nhất mà học sinh tương tác trực tiếp (Atomic Unit of Learning). Gồm các dạng: Quiz, Typing, Drawing, Game (các Mini-game như Matching, True/False bản chất là một loại Activity).
- **Web App** (Ứng dụng Web Client): Phần mềm hiển thị trò chơi và hoạt động học tập cho học sinh, tiêu thụ dữ liệu từ backend API.
- **Admin Dashboard** (Màn hình Quản trị): Giao diện web dành riêng cho Admin (giáo viên/phụ huynh) thiết kế nội dung bài học.
- **Image Prompt**: Câu mô tả chi tiết do AI sinh ra trong Lesson Config để developer tự tạo hình ảnh.
- **Distractor**: Các phương án sai/gây nhiễu do AI sinh sẵn trong Lesson Config.

## Decisions Log
- **Kiến trúc dữ liệu:** Web App chỉ đọc tệp JSON (hoặc DB sau này), hoàn toàn không kết nối API AI theo thời gian thực để đảm bảo tốc độ và an toàn nội dung.
- **Quản lý đáp án sai:** AI sẽ sinh sẵn các Distractor thay vì thuật toán Web App tự sinh.
- **Loại hình bài học:** Xác định đây là Lesson Data (dữ liệu cấu trúc dành cho ứng dụng chạy mini-game), hoàn toàn không phải văn bản Markdown để phụ huynh đọc chay.
- **Kiến trúc Admin Dashboard (Phase 2):** Gộp chung giao diện Admin vào dự án Next.js hiện tại (route `/admin`) để tái sử dụng UI component và hỗ trợ tính năng Live Preview cho người tạo nội dung.
- **Chiến lược Fetch Data (Phase 2):** Dùng SSR / Incremental Static Regeneration (ISR) thông qua Next.js Server Components để gọi API đến Backend Java Spring Boot, nhằm tối ưu tốc độ tải trang cho học sinh, thay vì dùng `useEffect` ở client-side.
- **Data Structure cho Mini-games:** Cấu trúc `mini_games` trong Lesson Config là một **Array** thay vì Object. Điều này đảm bảo Pedagogical Flow (thứ tự xuất hiện của game) và hỗ trợ Multi-instance (nhiều game cùng loại trong một bài học). Được bảo vệ chặt chẽ bằng **Discriminated Unions** trong TypeScript.
- **Kiến trúc Game Engine (Separation of Concerns):** `LessonRunner` được thiết kế là một **Pure Orchestrator**, chỉ làm nhiệm vụ render game và quản lý state `currentIndex`. Tuyệt đối không gọi Context API hay trigger Gamification effects (Confetti, Audio). Việc lưu điểm (XP) và vinh danh được giao cho Route Page Adapter (`page.tsx`) xử lý qua callback `onAllGamesComplete` nhằm tránh Race Conditions và dễ dàng Unit Test/Tái sử dụng cho tính năng Admin Preview.

## Links & Resources
- Tài liệu cấu trúc bài học: `SYSTEM_PROMPT.md`
- Kế hoạch tiến độ: `docs/backlog/progress.md`
- PRD Kiến trúc Game Engine: `docs/PRD-GameController-Refactor.md`
