"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/utils/supabase";
import { 
  Plus, 
  Edit, 
  Trash2, 
  BookOpen, 
  FolderOpen, 
  X, 
  Save, 
  Sparkles,
  Search
} from "lucide-react";
import { useSound } from "@/contexts/SoundContext";

interface DbSubject {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  grade: string | null;
  thumbnail_url: string | null;
}

export default function AdminSubjects() {
  const { playSound } = useSound();
  const [subjects, setSubjects] = useState<DbSubject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<DbSubject | null>(null);
  const [formId, setFormId] = useState("");
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formIcon, setFormIcon] = useState("📚");
  const [formColor, setFormColor] = useState("indigo");
  const [formGrade, setFormGrade] = useState("Lớp 1");
  const [formThumbnailUrl, setFormThumbnailUrl] = useState("");

  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchSubjects = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("subjects")
        .select("*")
        .order("id");
      if (error) throw error;
      setSubjects(data || []);
    } catch (err: any) {
      console.error("Lỗi tải môn học:", err);
      showNotification("error", "Không thể tải danh sách môn học");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const openAddModal = () => {
    playSound("click");
    setEditingSubject(null);
    setFormId("");
    setFormName("");
    setFormDescription("");
    setFormIcon("📚");
    setFormColor("indigo");
    setFormGrade("Lớp 1");
    setFormThumbnailUrl("");
    setIsModalOpen(true);
  };

  const openEditModal = (subject: DbSubject) => {
    playSound("click");
    setEditingSubject(subject);
    setFormId(subject.id);
    setFormName(subject.name);
    setFormDescription(subject.description || "");
    setFormIcon(subject.icon || "📚");
    setFormColor(subject.color || "indigo");
    setFormGrade(subject.grade || "Lớp 1");
    setFormThumbnailUrl(subject.thumbnail_url || "");
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    playSound("incorrect");
    if (!confirm(`Bạn có chắc chắn muốn xóa môn học "${name}"? Thao tác này sẽ xóa toàn bộ chủ đề và hoạt động liên quan!`)) {
      return;
    }

    try {
      // Vì có CASCADE foreign key, nên khi xóa subject, các topic và activity có thể bị ảnh hưởng.
      // Chúng ta sẽ delete trực tiếp trên supabase.
      const { error } = await supabase
        .from("subjects")
        .delete()
        .eq("id", id);

      if (error) throw error;
      playSound("tada");
      showNotification("success", `Đã xóa môn học "${name}" thành công!`);
      fetchSubjects();
    } catch (err: any) {
      console.error("Lỗi khi xóa môn học:", err);
      showNotification("error", "Lỗi: Không thể xóa môn học này.");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formId.trim() || !formName.trim()) {
      showNotification("error", "Vui lòng nhập đầy đủ Mã và Tên môn học");
      return;
    }

    // Validate ID format (chỉ cho phép chữ thường, số, dấu gạch ngang)
    if (!/^[a-z0-9-]+$/.test(formId)) {
      showNotification("error", "Mã môn học chỉ được chứa chữ thường, số và dấu gạch ngang (-)");
      return;
    }

    try {
      const subjectData = {
        id: formId,
        name: formName,
        description: formDescription,
        icon: formIcon,
        color: formColor,
        grade: formGrade,
        thumbnail_url: formThumbnailUrl,
        updated_at: new Date().toISOString()
      };

      if (editingSubject) {
        // Update
        const { error } = await supabase
          .from("subjects")
          .update(subjectData)
          .eq("id", editingSubject.id);

        if (error) throw error;
        showNotification("success", `Đã cập nhật môn học "${formName}" thành công!`);
      } else {
        // Insert
        // Kiểm tra xem ID đã tồn tại chưa
        const { data: existing } = await supabase
          .from("subjects")
          .select("id")
          .eq("id", formId)
          .single();

        if (existing) {
          showNotification("error", "Mã môn học này đã tồn tại!");
          return;
        }

        const { error } = await supabase
          .from("subjects")
          .insert(subjectData);

        if (error) throw error;
        showNotification("success", `Đã thêm môn học "${formName}" thành công!`);
      }

      playSound("tada");
      setIsModalOpen(false);
      fetchSubjects();
    } catch (err: any) {
      console.error("Lỗi khi lưu môn học:", err);
      showNotification("error", "Lỗi: Không thể lưu thông tin môn học");
    }
  };

  const filteredSubjects = subjects.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <h2 className="text-3xl font-black text-slate-800 tracking-wide">Quản lý Môn học</h2>
          <p className="text-slate-500 font-medium">Xem danh sách, chỉnh sửa cấu hình môn học và chuyển hướng quản lý chủ đề.</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md shadow-indigo-600/10 active:translate-y-0.5 transition-all text-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Môn học mới</span>
        </button>
      </div>

      {/* Search & Actions */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
        <Search className="w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Tìm kiếm môn học theo tên hoặc mã..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-transparent border-none text-slate-850 font-semibold placeholder-slate-400 focus:outline-none"
        />
      </div>

      {/* Table & Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-white border border-slate-200 rounded-3xl h-48 p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-100"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-100 rounded w-1/2"></div>
                  <div className="h-3 bg-slate-100 rounded w-1/4"></div>
                </div>
              </div>
              <div className="h-10 bg-slate-100 rounded-xl"></div>
            </div>
          ))}
        </div>
      ) : filteredSubjects.length === 0 ? (
        <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 p-12 text-center">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 font-bold">Không tìm thấy môn học nào</p>
          <p className="text-slate-400 text-xs mt-1">Vui lòng điều chỉnh từ khóa tìm kiếm hoặc tạo môn học mới.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubjects.map((subject) => (
            <div 
              key={subject.id} 
              className="bg-white border border-slate-200 rounded-3xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between overflow-hidden relative"
            >
              {/* Card Ribbon for grade */}
              <div className="absolute top-4 right-4 px-3 py-1 bg-slate-100 text-slate-650 font-extrabold text-[10px] rounded-full uppercase tracking-wider">
                {subject.grade || "Lớp 1"}
              </div>

              <div className="p-6 space-y-4">
                {/* Header info */}
                <div className="flex items-start gap-4">
                  <span className="text-4xl p-2.5 bg-slate-50 border border-slate-100 rounded-2xl">
                    {subject.icon || "📚"}
                  </span>
                  <div>
                    <h3 className="font-black text-slate-800 text-lg leading-snug">{subject.name}</h3>
                    <code className="text-xs text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded">
                      ID: {subject.id}
                    </code>
                  </div>
                </div>

                {/* Description */}
                <p className="text-slate-500 text-sm font-medium line-clamp-2 h-10">
                  {subject.description || "Chưa có mô tả cho môn học này."}
                </p>

                {/* Color preview */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400">Màu chủ đạo:</span>
                  <span className="px-2.5 py-0.5 text-xs font-black rounded-lg text-white capitalize" style={{ backgroundColor: subject.color || "indigo" }}>
                    {subject.color || "indigo"}
                  </span>
                </div>
              </div>

              {/* Bottom actions */}
              <div className="bg-slate-50 border-t border-slate-100 px-6 py-4 flex items-center justify-between gap-3">
                <Link
                  href={`/admin/subjects/${subject.id}/topics`}
                  onClick={() => playSound("click")}
                  className="flex-1 flex items-center justify-center gap-2 py-2 bg-indigo-55 text-indigo-700 hover:bg-indigo-100 rounded-xl font-bold text-xs transition-colors"
                >
                  <FolderOpen className="w-4 h-4" />
                  <span>Quản lý Chủ đề</span>
                </Link>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(subject)}
                    className="p-2 bg-white hover:bg-slate-100 text-slate-600 rounded-xl border border-slate-200 hover:text-slate-800 transition-colors"
                    title="Chỉnh sửa"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(subject.id, subject.name)}
                    className="p-2 bg-white hover:bg-rose-50 text-rose-500 rounded-xl border border-slate-200 hover:text-rose-700 transition-colors"
                    title="Xóa"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <div 
            onClick={() => setIsModalOpen(false)}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />

          {/* Modal Box */}
          <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600 fill-indigo-100" />
                <span>{editingSubject ? "Chỉnh sửa Môn học" : "Thêm Môn học Mới"}</span>
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="overflow-y-auto p-6 space-y-4 custom-scrollbar">
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-650 uppercase tracking-wide">
                  Mã môn học (ID)
                </label>
                <input
                  type="text"
                  placeholder="toan-hoc, tieng-viet, english..."
                  value={formId}
                  onChange={(e) => setFormId(e.target.value)}
                  disabled={!!editingSubject}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-bold disabled:opacity-50 disabled:bg-slate-100 focus:outline-none focus:border-indigo-650"
                  required
                />
                {!editingSubject && (
                  <p className="text-[10px] text-slate-400 font-medium">
                    Nhập chữ thường không dấu, không khoảng trắng, chỉ dùng dấu gạch ngang (ví dụ: `giao-tiep`).
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-650 uppercase tracking-wide">
                  Tên Môn Học
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Toán Học Lớp 1"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-850 font-bold focus:outline-none focus:border-indigo-650"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-650 uppercase tracking-wide">
                  Mô Tả
                </label>
                <textarea
                  placeholder="Mô tả nội dung học tập của môn học này..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold focus:outline-none focus:border-indigo-650 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-650 uppercase tracking-wide">
                    Icon đại diện (Emoji)
                  </label>
                  <input
                    type="text"
                    placeholder="Ví dụ: 🦖, 📐, 📚, ✍️"
                    value={formIcon}
                    onChange={(e) => setFormIcon(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-850 font-bold text-center text-xl focus:outline-none focus:border-indigo-650"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-650 uppercase tracking-wide">
                    Khối Lớp
                  </label>
                  <select
                    value={formGrade}
                    onChange={(e) => setFormGrade(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-850 font-bold focus:outline-none focus:border-indigo-650"
                  >
                    <option value="Lớp 1">Lớp 1</option>
                    <option value="Lớp 2">Lớp 2</option>
                    <option value="Lớp 3">Lớp 3</option>
                    <option value="Lớp 4">Lớp 4</option>
                    <option value="Lớp 5">Lớp 5</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-650 uppercase tracking-wide">
                  Màu chủ đạo (Hex hoặc CSS Color Name)
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder="Ví dụ: #ff4500, #4f46e5, teal, orange"
                    value={formColor}
                    onChange={(e) => setFormColor(e.target.value)}
                    className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-bold focus:outline-none focus:border-indigo-650"
                  />
                  <div 
                    className="w-10 h-10 border border-slate-300 rounded-xl shadow-sm"
                    style={{ backgroundColor: formColor || "indigo" }}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-650 uppercase tracking-wide">
                  URL ảnh thu nhỏ (Thumbnail Image URL)
                </label>
                <input
                  type="text"
                  placeholder="/assets/thumbnails/toan.png"
                  value={formThumbnailUrl}
                  onChange={(e) => setFormThumbnailUrl(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-bold focus:outline-none focus:border-indigo-650"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50/50 -mx-6 -mb-6 p-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-600 rounded-xl border border-slate-250 font-bold text-xs transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md shadow-indigo-600/10 active:translate-y-0.5 transition-all text-xs cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingSubject ? "Cập nhật" : "Lưu môn học"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
