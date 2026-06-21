"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { supabase } from "@/utils/supabase";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Layers, 
  FolderOpen, 
  X, 
  Save, 
  Sparkles,
  ArrowLeft,
  Clock,
  Award
} from "lucide-react";
import { useSound } from "@/contexts/SoundContext";

interface DbSubject {
  id: string;
  name: string;
  icon: string | null;
}

interface DbTopic {
  id: string;
  subject_id: string;
  title: string;
  description: string | null;
  difficulty: "easy" | "medium" | "hard";
  estimated_time: number;
  content: string | null;
  sort_order: number;
}

export default function AdminTopics({ params }: { params: Promise<{ subjectId: string }> }) {
  const { subjectId } = use(params);
  const { playSound } = useSound();
  const [subject, setSubject] = useState<DbSubject | null>(null);
  const [topics, setTopics] = useState<DbTopic[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<DbTopic | null>(null);
  const [formId, setFormId] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formDifficulty, setFormDifficulty] = useState<"easy" | "medium" | "hard">("easy");
  const [formEstimatedTime, setFormEstimatedTime] = useState(15);
  const [formContent, setFormContent] = useState("");
  const [formSortOrder, setFormSortOrder] = useState(1);

  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchSubjectAndTopics = async () => {
    try {
      setIsLoading(true);

      // 1. Fetch Subject
      const { data: subjectData, error: subjectError } = await supabase
        .from("subjects")
        .select("id, name, icon")
        .eq("id", subjectId)
        .single();

      if (subjectError) throw subjectError;
      setSubject(subjectData);

      // 2. Fetch Topics of Subject
      const { data: topicsData, error: topicsError } = await supabase
        .from("topics")
        .select("*")
        .eq("subject_id", subjectId)
        .order("sort_order", { ascending: true });

      if (topicsError) throw topicsError;
      setTopics(topicsData || []);
    } catch (err: any) {
      console.error("Lỗi tải chủ đề:", err);
      showNotification("error", "Không thể tải danh sách chủ đề");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjectAndTopics();
  }, [subjectId]);

  const openAddModal = () => {
    playSound("click");
    setEditingTopic(null);
    setFormId("");
    setFormTitle("");
    setFormDescription("");
    setFormDifficulty("easy");
    setFormEstimatedTime(15);
    setFormContent("");
    setFormSortOrder(topics.length + 1);
    setIsModalOpen(true);
  };

  const openEditModal = (topic: DbTopic) => {
    playSound("click");
    setEditingTopic(topic);
    setFormId(topic.id);
    setFormTitle(topic.title);
    setFormDescription(topic.description || "");
    setFormDifficulty(topic.difficulty);
    setFormEstimatedTime(topic.estimated_time);
    setFormContent(topic.content || "");
    setFormSortOrder(topic.sort_order);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, title: string) => {
    playSound("incorrect");
    if (!confirm(`Bạn có chắc chắn muốn xóa chủ đề "${title}"? Thao tác này sẽ xóa toàn bộ các bài tập/hoạt động liên quan!`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from("topics")
        .delete()
        .eq("id", id);

      if (error) throw error;
      playSound("tada");
      showNotification("success", `Đã xóa chủ đề "${title}" thành công!`);
      fetchSubjectAndTopics();
    } catch (err: any) {
      console.error("Lỗi khi xóa chủ đề:", err);
      showNotification("error", "Lỗi: Không thể xóa chủ đề này.");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formId.trim() || !formTitle.trim()) {
      showNotification("error", "Vui lòng nhập đầy đủ Mã và Tiêu đề chủ đề");
      return;
    }

    if (!/^[a-z0-9-]+$/.test(formId)) {
      showNotification("error", "Mã chủ đề chỉ được chứa chữ thường, số và dấu gạch ngang (-)");
      return;
    }

    try {
      const topicData = {
        id: formId,
        subject_id: subjectId,
        title: formTitle,
        description: formDescription,
        difficulty: formDifficulty,
        estimated_time: formEstimatedTime,
        content: formContent,
        sort_order: formSortOrder,
        updated_at: new Date().toISOString()
      };

      if (editingTopic) {
        // Update
        const { error } = await supabase
          .from("topics")
          .update(topicData)
          .eq("id", editingTopic.id);

        if (error) throw error;
        showNotification("success", `Đã cập nhật chủ đề "${formTitle}" thành công!`);
      } else {
        // Insert
        // Kiểm tra xem ID đã tồn tại chưa
        const { data: existing } = await supabase
          .from("topics")
          .select("id")
          .eq("id", formId)
          .single();

        if (existing) {
          showNotification("error", "Mã chủ đề này đã tồn tại!");
          return;
        }

        const { error } = await supabase
          .from("topics")
          .insert(topicData);

        if (error) throw error;
        showNotification("success", `Đã thêm chủ đề "${formTitle}" thành công!`);
      }

      playSound("tada");
      setIsModalOpen(false);
      fetchSubjectAndTopics();
    } catch (err: any) {
      console.error("Lỗi khi lưu chủ đề:", err);
      showNotification("error", "Lỗi: Không thể lưu thông tin chủ đề");
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

      {/* Breadcrumb & Go Back */}
      <div className="flex items-center gap-2">
        <Link
          href="/admin/subjects"
          onClick={() => playSound("click")}
          className="p-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-600 hover:text-slate-800 transition-colors"
          title="Quay lại danh sách môn học"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
          <Link href="/admin/subjects" className="hover:text-indigo-600">Môn học</Link>
          <span>/</span>
          <span className="text-slate-600">{subject ? `${subject.icon || "📚"} ${subject.name}` : "Đang tải..."}</span>
          <span>/</span>
          <span className="text-slate-850">Chủ đề</span>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-wide">
            {subject ? `Chủ đề của: ${subject.name}` : "Quản lý Chủ đề"}
          </h2>
          <p className="text-slate-500 font-medium">
            Cấu hình các chương/chủ đề học tập thuộc môn học này, sắp xếp thứ tự giảng dạy cho bé.
          </p>
        </div>
        <button
          onClick={openAddModal}
          disabled={!subject}
          className="flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md shadow-indigo-600/10 active:translate-y-0.5 transition-all text-sm cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Chủ đề mới</span>
        </button>
      </div>

      {/* Table & Cards */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-white border border-slate-200 rounded-3xl h-24 p-6 flex items-center justify-between">
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-100 rounded w-1/3"></div>
                <div className="h-3 bg-slate-100 rounded w-1/4"></div>
              </div>
              <div className="w-24 h-8 bg-slate-100 rounded-lg"></div>
            </div>
          ))}
        </div>
      ) : topics.length === 0 ? (
        <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 p-12 text-center">
          <Layers className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 font-bold">Chưa có chủ đề nào được tạo</p>
          <p className="text-slate-400 text-xs mt-1">Vui lòng nhấp vào nút "Thêm Chủ đề mới" để bắt đầu thiết kế bài giảng.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {topics.map((topic) => (
            <div 
              key={topic.id} 
              className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              {/* Order and Info */}
              <div className="flex items-start gap-4 flex-1">
                <span className="flex-shrink-0 w-10 h-10 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-2xl flex items-center justify-center font-black text-sm">
                  #{topic.sort_order}
                </span>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-black text-slate-800 text-base leading-snug">{topic.title}</h3>
                    <code className="text-[10px] text-slate-500 font-bold bg-slate-100 px-2 py-0.5 rounded">
                      ID: {topic.id}
                    </code>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                      topic.difficulty === "easy"
                        ? "bg-emerald-50 text-emerald-700"
                        : topic.difficulty === "medium"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-rose-50 text-rose-700"
                    }`}>
                      {topic.difficulty}
                    </span>
                  </div>
                  <p className="text-slate-500 text-sm font-medium leading-normal">
                    {topic.description || "Chưa có mô tả cho chủ đề này."}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-slate-400 font-semibold pt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-350" />
                      <span>Thời lượng ước tính: {topic.estimated_time} phút</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 bg-slate-50 md:bg-transparent -mx-6 -mb-6 p-4 md:p-0 md:m-0 border-t border-slate-100 md:border-t-0 justify-end">
                <Link
                  href={`/admin/topics/${topic.id}/activities`}
                  onClick={() => playSound("click")}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-55 hover:bg-indigo-100 text-indigo-700 rounded-xl font-bold text-xs transition-colors"
                >
                  <FolderOpen className="w-4 h-4" />
                  <span>Quản lý Bài tập (Activities)</span>
                </Link>
                <button
                  onClick={() => openEditModal(topic)}
                  className="p-2 bg-white hover:bg-slate-100 text-slate-650 rounded-xl border border-slate-200 hover:text-slate-800 transition-colors"
                  title="Chỉnh sửa"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(topic.id, topic.title)}
                  className="p-2 bg-white hover:bg-rose-50 text-rose-500 rounded-xl border border-slate-200 hover:text-rose-700 transition-colors"
                  title="Xóa"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
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
                <span>{editingTopic ? "Chỉnh sửa Chủ đề" : "Thêm Chủ đề Mới"}</span>
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
                  Mã chủ đề (ID)
                </label>
                <input
                  type="text"
                  placeholder="lam-quen-chu-b, phep-cong-pham-vi-10..."
                  value={formId}
                  onChange={(e) => setFormId(e.target.value)}
                  disabled={!!editingTopic}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-bold disabled:opacity-50 disabled:bg-slate-100 focus:outline-none focus:border-indigo-650"
                  required
                />
                {!editingTopic && (
                  <p className="text-[10px] text-slate-400 font-medium">
                    Nhập chữ thường không dấu, không khoảng trắng, chỉ dùng dấu gạch ngang (ví dụ: `bai-1`).
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-650 uppercase tracking-wide">
                  Tiêu Đề Chủ Đề
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Làm quen với chữ B và vần BA"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-850 font-bold focus:outline-none focus:border-indigo-650"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-650 uppercase tracking-wide">
                  Mô Tả Chủ Đề
                </label>
                <textarea
                  placeholder="Mô tả tóm tắt nội dung chủ đề..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold focus:outline-none focus:border-indigo-650 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-650 uppercase tracking-wide">
                    Độ khó
                  </label>
                  <select
                    value={formDifficulty}
                    onChange={(e) => setFormDifficulty(e.target.value as any)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-850 font-bold focus:outline-none focus:border-indigo-650"
                  >
                    <option value="easy">Easy (Dễ)</option>
                    <option value="medium">Medium (Vừa)</option>
                    <option value="hard">Hard (Khó)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-650 uppercase tracking-wide">
                    Thời gian học (phút)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={120}
                    value={formEstimatedTime}
                    onChange={(e) => setFormEstimatedTime(parseInt(e.target.value, 10))}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-850 font-bold focus:outline-none focus:border-indigo-650"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-650 uppercase tracking-wide">
                    Thứ tự sắp xếp (`sort_order`)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formSortOrder}
                    onChange={(e) => setFormSortOrder(parseInt(e.target.value, 10))}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-850 font-bold focus:outline-none focus:border-indigo-650"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-650 uppercase tracking-wide">
                  Nội dung mở rộng / Lý thuyết (Content)
                </label>
                <textarea
                  placeholder="Nội dung văn bản, bài thơ hoặc lý thuyết bài giảng..."
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold focus:outline-none focus:border-indigo-650 resize-none"
                />
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
                  <span>{editingTopic ? "Cập nhật" : "Lưu chủ đề"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
