-- 1. Thêm cột last_active_date để lưu ngày hoạt động gần nhất của học sinh (YYYY-MM-DD)
ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS last_active_date DATE;

-- 2. Đảm bảo cột role tồn tại trong bảng student_profiles
ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'student';

-- 3. Thêm cột total_lessons để lưu tổng số lượt bài học đã hoàn thành
ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS total_lessons INTEGER DEFAULT 0;
