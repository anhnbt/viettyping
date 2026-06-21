-- ====================================================================
-- SCRIPT TỐI ƯU HÓA CHÍNH SÁCH RLS (ROW LEVEL SECURITY)
-- Áp dụng cho các bảng: student_profiles, student_progress, student_badges
-- Hướng dẫn: Copy toàn bộ nội dung script này và chạy trong SQL Editor của Supabase
-- ====================================================================

-- --------------------------------------------------------------------
-- 1. BẢNG student_profiles (Hồ sơ học sinh)
-- --------------------------------------------------------------------
-- Kích hoạt RLS
ALTER TABLE student_profiles ENABLE ROW LEVEL SECURITY;

-- Xóa các chính sách cũ nếu có để tránh xung đột
DROP POLICY IF EXISTS "Allow public read on student_profiles" ON student_profiles;
DROP POLICY IF EXISTS "Allow individual update on student_profiles" ON student_profiles;
DROP POLICY IF EXISTS "Allow individual insert on student_profiles" ON student_profiles;
DROP POLICY IF EXISTS "Allow admin all on student_profiles" ON student_profiles;

-- CHÍNH SÁCH SELECT: Cho phép tất cả người dùng đã xác thực (kể cả ẩn danh) đọc hồ sơ
-- Mục đích: Để hiển thị bảng xếp hạng (Leaderboard) công khai giữa các học sinh
CREATE POLICY "Allow public read on student_profiles" ON student_profiles
    FOR SELECT
    TO authenticated, anon
    USING (true);

-- CHÍNH SÁCH INSERT: Chỉ cho phép người dùng tự tạo hồ sơ của chính mình
CREATE POLICY "Allow individual insert on student_profiles" ON student_profiles
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = id);

-- CHÍNH SÁCH UPDATE: Chỉ chủ sở hữu hồ sơ (hoặc admin) mới được cập nhật
CREATE POLICY "Allow individual update on student_profiles" ON student_profiles
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- CHÍNH SÁCH DELETE: Chỉ Admin mới có quyền xóa hồ sơ học sinh
CREATE POLICY "Allow admin delete on student_profiles" ON student_profiles
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM student_profiles
            WHERE student_profiles.id = auth.uid() AND student_profiles.role = 'admin'
        )
    );


-- --------------------------------------------------------------------
-- 2. BẢNG student_progress (Tiến trình bài học)
-- --------------------------------------------------------------------
-- Kích hoạt RLS
ALTER TABLE student_progress ENABLE ROW LEVEL SECURITY;

-- Xóa các chính sách cũ nếu có
DROP POLICY IF EXISTS "Allow individual read progress" ON student_progress;
DROP POLICY IF EXISTS "Allow individual write progress" ON student_progress;
DROP POLICY IF EXISTS "Allow admin all progress" ON student_progress;

-- CHÍNH SÁCH SELECT: Học sinh chỉ được xem tiến trình học tập của chính mình
CREATE POLICY "Allow individual read progress" ON student_progress
    FOR SELECT
    TO authenticated
    USING (auth.uid() = student_id);

-- CHÍNH SÁCH INSERT/UPDATE (ALL): Chỉ học sinh sở hữu mới được thêm/sửa tiến trình của mình
CREATE POLICY "Allow individual write progress" ON student_progress
    FOR ALL
    TO authenticated
    USING (auth.uid() = student_id)
    WITH CHECK (auth.uid() = student_id);


-- --------------------------------------------------------------------
-- 3. BẢNG student_badges (Huy hiệu đạt được)
-- --------------------------------------------------------------------
-- Kích hoạt RLS
ALTER TABLE student_badges ENABLE ROW LEVEL SECURITY;

-- Xóa các chính sách cũ nếu có
DROP POLICY IF EXISTS "Allow public read badges" ON student_badges;
DROP POLICY IF EXISTS "Allow individual write badges" ON student_badges;
DROP POLICY IF EXISTS "Allow admin all badges" ON student_badges;

-- CHÍNH SÁCH SELECT: Cho phép xem huy hiệu của tất cả mọi người để hiển thị trên Leaderboard/Profile
CREATE POLICY "Allow public read badges" ON student_badges
    FOR SELECT
    TO authenticated, anon
    USING (true);

-- CHÍNH SÁCH INSERT/UPDATE (ALL): Chỉ học sinh sở hữu mới được tự mở khóa huy hiệu cho chính mình
CREATE POLICY "Allow individual write badges" ON student_badges
    FOR ALL
    TO authenticated
    USING (auth.uid() = student_id)
    WITH CHECK (auth.uid() = student_id);
