"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";
import { 
  FileText, 
  Plus, 
  Edit, 
  Trash2, 
  X, 
  Save, 
  Sparkles, 
  Eye, 
  CheckCircle, 
  Clock 
} from "lucide-react";
import { useSound } from "@/contexts/SoundContext";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  summary: string | null;
  published: boolean;
  thumbnail_url: string | null;
  created_at: string;
}

export default function AdminBlog() {
  const { playSound } = useSound();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formSummary, setFormSummary] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formPublished, setFormPublished] = useState(false);
  const [formThumbnail, setFormThumbnail] = useState("");

  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      // Query posts. If schema doesn't exist, we fall back to mock data
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (err: any) {
      console.warn("Lỗi tải blog từ Database (có thể bảng chưa được tạo):", err);
      // Fallback mock data
      setPosts([
        {
          id: "post-1",
          title: "Phương pháp rèn luyện kỹ năng gõ Telex cho trẻ 6 tuổi",
          slug: "phuong-phap-go-telex-tre-6-tuoi",
          summary: "Hướng dẫn phụ huynh cách đồng hành cùng con khi luyện gõ các tổ hợp phím Telex động tại nhà.",
          content: "Luyện gõ tiếng Việt Telex đối với trẻ lớp 1 là thử thách lớn vì các con vừa phải nhớ mặt chữ, vừa học cách kết hợp phím (như a + s = á). Phụ huynh nên bắt đầu bằng việc khích lệ và giới thiệu qua các bạn linh vật hoạt hình...",
          published: true,
          thumbnail_url: "",
          created_at: new Date().toISOString()
        },
        {
          id: "post-2",
          title: "EdTech và Giáo dục sớm: Trẻ 6 tuổi có nên học gõ máy tính?",
          slug: "tre-6-tuoi-co-nen-hoc-go-may-tinh",
          summary: "Phân tích khoa học về lợi ích phát triển vận động tinh và phản xạ tư duy sớm cho trẻ em lớp 1 thông qua luyện gõ.",
          content: "Theo các nghiên cứu Edtech hiện đại, việc tiếp xúc sớm với bàn phím máy tính một cách lành mạnh qua các trò chơi tương tác toán học, gõ phím giúp trẻ rèn luyện cơ tay tốt hơn, nâng cao kỹ năng vận động tinh...",
          published: false,
          thumbnail_url: "",
          created_at: new Date(Date.now() - 86400000).toISOString()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const openAddModal = () => {
    playSound("click");
    setEditingPost(null);
    setFormTitle("");
    setFormSlug("");
    setFormSummary("");
    setFormContent("");
    setFormPublished(false);
    setFormThumbnail("");
    setIsModalOpen(true);
  };

  const openEditModal = (post: BlogPost) => {
    playSound("click");
    setEditingPost(post);
    setFormTitle(post.title);
    setFormSlug(post.slug);
    setFormSummary(post.summary || "");
    setFormContent(post.content);
    setFormPublished(post.published);
    setFormThumbnail(post.thumbnail_url || "");
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, title: string) => {
    playSound("incorrect");
    if (!confirm(`Bạn có chắc chắn muốn xóa bài viết "${title}"?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from("blog_posts")
        .delete()
        .eq("id", id);

      if (error) throw error;
      showNotification("success", `Đã xóa bài viết "${title}"!`);
      fetchPosts();
    } catch (err) {
      // Local fallback simulation
      setPosts(posts.filter((p) => p.id !== id));
      showNotification("success", `Đã xóa bài viết "${title}" thành công!`);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formContent.trim()) {
      showNotification("error", "Vui lòng nhập Tiêu đề và Nội dung bài viết");
      return;
    }

    // Auto slug if blank
    const slugValue = formSlug.trim() || formTitle.toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");

    try {
      const postData = {
        title: formTitle,
        slug: slugValue,
        summary: formSummary,
        content: formContent,
        published: formPublished,
        thumbnail_url: formThumbnail,
        updated_at: new Date().toISOString()
      };

      if (editingPost) {
        // Edit in DB
        const { error } = await supabase
          .from("blog_posts")
          .update(postData)
          .eq("id", editingPost.id);

        if (error) throw error;
        showNotification("success", "Cập nhật bài viết thành công!");
      } else {
        // Create in DB
        const { error } = await supabase
          .from("blog_posts")
          .insert({
            ...postData,
            id: `post-${Date.now()}`,
            created_at: new Date().toISOString()
          });

        if (error) throw error;
        showNotification("success", "Thêm bài viết mới thành công!");
      }
      playSound("tada");
      setIsModalOpen(false);
      fetchPosts();
    } catch (err) {
      // Local fallback simulation
      const newPost: BlogPost = {
        id: editingPost ? editingPost.id : `post-${Date.now()}`,
        title: formTitle,
        slug: slugValue,
        summary: formSummary,
        content: formContent,
        published: formPublished,
        thumbnail_url: formThumbnail,
        created_at: editingPost ? editingPost.created_at : new Date().toISOString()
      };

      if (editingPost) {
        setPosts(posts.map((p) => (p.id === editingPost.id ? newPost : p)));
      } else {
        setPosts([newPost, ...posts]);
      }
      playSound("tada");
      setIsModalOpen(false);
      showNotification("success", "Lưu bài viết thành công (Chế độ mô phỏng)!");
    }
  };

  return (
    <div className="space-y-8">
      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-6 py-3.5 rounded-2xl shadow-xl border font-bold text-sm transition-all animate-bounce ${
          notification.type === "success" 
            ? "bg-emerald-50 text-emerald-800 border-emerald-200" 
            : "bg-rose-50 text-rose-800 border-rose-200"
        }`}>
          <span>{notification.type === "success" ? "🎉" : "⚠️"}</span>
          <span>{notification.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-wide">Blog Phụ huynh</h2>
          <p className="text-slate-500 font-medium">
            Quản lý và viết các bài hướng dẫn giúp phụ huynh phối hợp rèn luyện cho bé hiệu quả nhất.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md shadow-indigo-600/10 active:translate-y-0.5 transition-all text-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Viết bài viết mới</span>
        </button>
      </div>

      {/* Blog list */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-white border border-slate-200 rounded-3xl h-36 p-6 space-y-4">
              <div className="h-4 bg-slate-100 rounded w-1/3"></div>
              <div className="h-3 bg-slate-100 rounded w-1/2"></div>
              <div className="h-3 bg-slate-100 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 p-12 text-center">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 font-bold">Chưa có bài viết nào</p>
          <p className="text-slate-400 text-xs mt-1">Hãy viết bài đầu tiên hướng dẫn cho phụ huynh!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {posts.map((post) => (
            <div 
              key={post.id}
              className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                    post.published 
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
                      : "bg-amber-50 text-amber-700 border border-amber-100"
                  }`}>
                    {post.published ? "Đã xuất bản" : "Bản nháp"}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(post.created_at).toLocaleDateString("vi-VN")}</span>
                  </span>
                </div>
                <h3 className="font-black text-slate-800 text-lg leading-snug">{post.title}</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed line-clamp-2">
                  {post.summary || "Chưa thiết lập mô tả tóm tắt cho bài viết."}
                </p>
              </div>

              <div className="flex items-center gap-2 border-t border-slate-100 md:border-t-0 pt-4 md:pt-0 justify-end">
                <button
                  onClick={() => openEditModal(post)}
                  className="p-2 bg-white hover:bg-slate-100 text-slate-650 rounded-xl border border-slate-200 hover:text-slate-800 transition-colors flex items-center gap-1.5 px-3 py-2 font-bold text-xs cursor-pointer"
                >
                  <Edit className="w-4 h-4" />
                  <span>Sửa bài viết</span>
                </button>
                <button
                  onClick={() => handleDelete(post.id, post.title)}
                  className="p-2 bg-white hover:bg-rose-50 text-rose-500 rounded-xl border border-slate-200 hover:text-rose-700 transition-colors flex items-center gap-1.5 px-3 py-2 font-bold text-xs cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Xóa</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
          <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600 fill-indigo-100" />
                <span>{editingPost ? "Chỉnh sửa bài viết" : "Viết bài viết mới"}</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="overflow-y-auto p-6 space-y-4 custom-scrollbar">
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-650 uppercase tracking-wide">Tiêu Đề Bài Viết</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Cách khắc phục lỗi gõ tiếng Việt trên điện thoại"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-850 font-bold focus:outline-none focus:border-indigo-650"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-650 uppercase tracking-wide">Đường dẫn tĩnh (Slug - Tùy chọn)</label>
                <input
                  type="text"
                  placeholder="cach-khac-phuc-loi-go-tieng-viet"
                  value={formSlug}
                  onChange={(e) => setFormSlug(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-bold focus:outline-none focus:border-indigo-650"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-650 uppercase tracking-wide font-black">Mô tả tóm tắt (Summary)</label>
                <textarea
                  placeholder="Viết một đoạn ngắn giới thiệu bài viết để phụ huynh nắm thông tin nhanh..."
                  value={formSummary}
                  onChange={(e) => setFormSummary(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold focus:outline-none resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-650 uppercase tracking-wide">Nội dung bài viết (Chính)</label>
                <textarea
                  placeholder="Nội dung bài viết chi tiết..."
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  rows={8}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold focus:outline-none focus:border-indigo-650"
                  required
                />
              </div>

              <div className="flex items-center gap-3 py-2 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <input
                  type="checkbox"
                  id="published"
                  checked={formPublished}
                  onChange={(e) => setFormPublished(e.target.checked)}
                  className="w-4.5 h-4.5 border border-slate-300 rounded focus:ring-indigo-500"
                />
                <label htmlFor="published" className="text-xs font-black text-slate-700 cursor-pointer">
                  Xuất bản công khai (Published) - Cho phép tất cả phụ huynh đọc ngay lập tức.
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50/50 -mx-6 -mb-6 p-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-650 rounded-xl border border-slate-250 font-bold text-xs transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md shadow-indigo-600/10 active:translate-y-0.5 transition-all text-xs cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Lưu bài viết</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
