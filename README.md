# Hệ Thống Học Tập Cho Bé

Một ứng dụng web tương tác giúp trẻ em học tập các môn học cơ bản một cách thú vị và hiệu quả.

## 🎯 Tính năng chính

### 📚 8 Môn học được hỗ trợ:

1. **Đạo đức** - Giáo dục giá trị sống và đạo đức
2. **Âm nhạc** - Học nốt nhạc và cảm thụ âm nhạc
3. **Toán** - Số học và hình học cơ bản
4. **Tiếng Việt** - Bảng chữ cái và từ vựng
5. **Hoạt động trải nghiệm** - Các hoạt động thực hành
6. **Tiếng Anh** - Bảng chữ cái và từ vựng cơ bản
7. **Tự nhiên và xã hội** - Tìm hiểu thế giới xung quanh
8. **Mỹ thuật** - Màu sắc và nghệ thuật

### 🎮 Các loại hoạt động:

- **Gõ phím**: Luyện tập đánh máy với nội dung học tập
- **Trắc nghiệm**: Câu hỏi kiểm tra kiến thức
- **Vẽ**: Hoạt động sáng tạo với màu sắc
- **Nghe**: Luyện tập kỹ năng nghe
- **Đọc**: Đọc hiểu văn bản
- **Toán**: Bài tập tính toán
- **Trò chơi**: Học qua chơi

## 🚀 Cách sử dụng

1. **Khởi động**: Nhấn "Bắt đầu học ngay!" từ màn hình chào mừng
2. **Chọn chế độ**:
   - "📚 Học các môn" - Truy cập hệ thống học tập đa môn
   - "⌨️ Luyện gõ phím" - Tập trung vào luyện tập đánh máy
3. **Chọn môn học**: Bấm vào môn học bạn muốn học
4. **Chọn chủ đề**: Mỗi môn có nhiều chủ đề với độ khó khác nhau
5. **Hoàn thành hoạt động**: Làm các bài tập trong từng chủ đề
6. **Theo dõi tiến độ**: Xem tiến độ học tập của bạn

## 🎨 Đặc điểm nổi bật

- **Giao diện thân thiện**: Thiết kế đẹp mắt và dễ sử dụng cho trẻ em
- **Tương tác cao**: Nhiều loại hoạt động khác nhau
- **Phân cấp độ khó**: Từ dễ đến khó phù hợp với từng lứa tuổi
- **Theo dõi tiến độ**: Hiển thị tiến độ học tập rõ ràng
- **Responsive**: Hoạt động tốt trên mọi thiết bị

## 🛠️ Công nghệ sử dụng

- **Next.js 15** - Framework React cho web
- **TypeScript** - Ngôn ngữ lập trình có type-safe
- **Tailwind CSS** - Framework CSS utility-first
- **React Icons** - Thư viện icon cho React

## 📋 Yêu cầu hệ thống

- Node.js 18+
- npm hoặc yarn
- Trình duyệt web hiện đại

## 🏃‍♂️ Cài đặt và chạy

```bash
# Clone repository
git clone [repository-url]

# Di chuyển vào thư mục dự án
cd viettyping

# Cài đặt dependencies
npm install

# Chạy ứng dụng ở chế độ development
npm run dev

# Mở trình duyệt và truy cập http://localhost:3000
```

## 📚 Cấu trúc dữ liệu

### Môn học (Subject)

```typescript
interface Subject {
  id: string; // ID duy nhất
  name: string; // Tên môn học
  description: string; // Mô tả
  icon: string; // Emoji icon
  color: string; // Màu gradient
  topics: Topic[]; // Danh sách chủ đề
  grade?: string; // Khối lớp
}
```

### Chủ đề (Topic)

```typescript
interface Topic {
  id: string; // ID duy nhất
  title: string; // Tiêu đề chủ đề
  description: string; // Mô tả
  content: string; // Nội dung học
  activities: Activity[]; // Danh sách hoạt động
  difficulty: 'easy' | 'medium' | 'hard'; // Độ khó
  estimatedTime: number; // Thời gian ước tính (phút)
}
```

### Hoạt động (Activity)

```typescript
interface Activity {
  id: string; // ID duy nhất
  type:
    | 'typing'
    | 'quiz'
    | 'drawing'
    | 'listening'
    | 'reading'
    | 'math'
    | 'game';
  title: string; // Tiêu đề hoạt động
  content: string; // Nội dung
  instructions: string; // Hướng dẫn
  targetScore?: number; // Điểm mục tiêu
  timeLimit?: number; // Giới hạn thời gian (giây)
}
```

## 🎯 Lộ trình phát triển

- [x] Hệ thống môn học cơ bản
- [x] Hoạt động gõ phím
- [x] Hoạt động trắc nghiệm cơ bản
- [x] Giao diện responsive
- [x] Hệ thống âm thanh
- [x] Lưu tiến độ học tập
- [ ] Chế độ chơi nhóm
- [x] Báo cáo chi tiết cho phụ huynh
- [ ] Thêm animation và hiệu ứng
- [ ] Hỗ trợ offline

## 👨‍👩‍👧‍👦 Đối tượng sử dụng

- **Học sinh lớp 1-5**: Học tập các môn học cơ bản
- **Phụ huynh**: Hỗ trợ con em học tập tại nhà
- **Giáo viên**: Công cụ hỗ trợ giảng dạy

## 📞 Liên hệ

Nếu bạn có thắc mắc hoặc đề xuất, vui lòng tạo issue trên GitHub repository.

---

**Chúc các bé học tập vui vẻ và hiệu quả! 🎉**
