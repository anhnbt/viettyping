-- 1. Thêm cột phân quyền vào bảng student_profiles
ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'student';

-- Cập nhật tài khoản admin đầu tiên nếu có (Ví dụ)
-- UPDATE student_profiles SET role = 'admin' WHERE id = 'ID-ADMIN-CUA-BAN';

-- 2. Tạo bảng danh mục bài viết Blog
CREATE TABLE IF NOT EXISTS blog_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Tạo bảng bài viết Blog cho Phụ huynh
CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    content TEXT NOT NULL,
    summary TEXT,
    thumbnail_url TEXT,
    author_id UUID REFERENCES auth.users(id),
    category_id UUID REFERENCES blog_categories(id) ON DELETE SET NULL,
    published BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Bật RLS (Row Level Security) cho các bảng Blog
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- 5. Tạo chính sách RLS cho blog_categories
-- Ai cũng có thể đọc
CREATE POLICY "Allow public read on blog_categories" ON blog_categories
    FOR SELECT USING (true);

-- Chỉ admin mới có quyền ghi
CREATE POLICY "Allow admin write on blog_categories" ON blog_categories
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM student_profiles
            WHERE student_profiles.id = auth.uid() AND student_profiles.role = 'admin'
        )
    );

-- 6. Tạo chính sách RLS cho blog_posts
-- Ai cũng có thể đọc bài viết đã xuất bản
CREATE POLICY "Allow public read on published blog_posts" ON blog_posts
    FOR SELECT USING (published = true);

-- Admin hoặc tác giả có thể xem bài viết nháp
CREATE POLICY "Allow author or admin read all blog_posts" ON blog_posts
    FOR SELECT USING (
        auth.uid() = author_id OR 
        EXISTS (
            SELECT 1 FROM student_profiles
            WHERE student_profiles.id = auth.uid() AND student_profiles.role = 'admin'
        )
    );

-- Chỉ admin mới có quyền tạo/sửa/xóa bài viết
CREATE POLICY "Allow admin write on blog_posts" ON blog_posts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM student_profiles
            WHERE student_profiles.id = auth.uid() AND student_profiles.role = 'admin'
        )
    );
