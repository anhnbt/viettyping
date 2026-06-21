"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { supabase } from "@/utils/supabase";
import { 
  Plus, 
  Edit, 
  Trash2, 
  FileText, 
  Sparkles,
  ArrowLeft,
  Settings,
  Keyboard,
  HelpCircle,
  Palette,
  Gamepad2,
  ListOrdered
} from "lucide-react";
import { useSound } from "@/contexts/SoundContext";

interface DbTopic {
  id: string;
  subject_id: string;
  title: string;
}

interface DbActivity {
  id: string;
  topic_id: string;
  type: string;
  title: string;
  instructions: string | null;
  sort_order: number;
}

const ACTIVITY_TYPE_ICONS: Record<string, React.ReactNode> = {
  typing: <Keyboard className="w-5 h-5 text-indigo-650" />,
  quiz: <HelpCircle className="w-5 h-5 text-amber-600" />,
  drawing: <Palette className="w-5 h-5 text-rose-500" />,
  game: <Gamepad2 className="w-5 h-5 text-emerald-600" />
};

export default function AdminActivities({ params }: { params: Promise<{ topicId: string }> }) {
  const { topicId } = use(params);
  const { playSound } = useSound();
  const [topic, setTopic] = useState<DbTopic | null>(null);
  const [activities, setActivities] = useState<DbActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchTopicAndActivities = async () => {
    try {
      setIsLoading(true);

      // 1. Fetch Topic
      const { data: topicData, error: topicError } = await supabase
        .from("topics")
        .select("id, subject_id, title")
        .eq("id", topicId)
        .single();

      if (topicError) throw topicError;
      setTopic(topicData);

      // 2. Fetch Activities of Topic
      const { data: activitiesData, error: activitiesError } = await supabase
        .from("activities")
        .select("id, topic_id, type, title, instructions, sort_order")
        .eq("topic_id", topicId)
        .order("sort_order", { ascending: true });

      if (activitiesError) throw activitiesError;
      setActivities(activitiesData || []);
    } catch (err: any) {
      console.error("Lỗi tải hoạt động:", err);
      showNotification("error", "Không thể tải danh sách hoạt động bài tập");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTopicAndActivities();
  }, [topicId]);

  const handleDelete = async (id: string, title: string) => {
    playSound("incorrect");
    if (!confirm(`Bạn có chắc chắn muốn xóa hoạt động "${title}"?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from("activities")
        .delete()
        .eq("id", id);

      if (error) throw error;
      playSound("tada");
      showNotification("success", `Đã xóa hoạt động "${title}"!`);
      fetchTopicAndActivities();
    } catch (err: any) {
      console.error("Lỗi khi xóa hoạt động:", err);
      showNotification("error", "Lỗi: Không thể xóa hoạt động này.");
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
        {topic && (
          <Link
            href={`/admin/subjects/${topic.subject_id}/topics`}
            onClick={() => playSound("click")}
            className="p-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-600 hover:text-slate-800 transition-colors"
            title="Quay lại danh sách chủ đề"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
        )}
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
          <Link href="/admin/subjects" className="hover:text-indigo-600">Môn học</Link>
          <span>/</span>
          {topic && (
            <Link href={`/admin/subjects/${topic.subject_id}/topics`} className="hover:text-indigo-600 truncate max-w-[150px]">
              Chủ đề
            </Link>
          )}
          <span>/</span>
          <span className="text-slate-600 truncate max-w-[150px]">{topic ? topic.title : "Đang tải..."}</span>
          <span>/</span>
          <span className="text-slate-850">Bài tập</span>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-wide">
            {topic ? `Các bài tập: ${topic.title}` : "Quản lý Hoạt động"}
          </h2>
          <p className="text-slate-500 font-medium">
            Thiết kế và quản lý chuỗi bài học tương tác gồm Flashcards, Luyện gõ phím, Câu đố toán học, Trò chơi và Vẽ màu.
          </p>
        </div>
        {topic && (
          <Link
            href={`/admin/topics/${topic.id}/activities/form`}
            onClick={() => playSound("click")}
            className="flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md shadow-indigo-600/10 active:translate-y-0.5 transition-all text-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm bài tập mới</span>
          </Link>
        )}
      </div>

      {/* Table & Cards */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-white border border-slate-200 rounded-3xl h-20 p-6 flex items-center justify-between">
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-100 rounded w-1/3"></div>
                <div className="h-3 bg-slate-100 rounded w-1/4"></div>
              </div>
              <div className="w-20 h-8 bg-slate-100 rounded-lg"></div>
            </div>
          ))}
        </div>
      ) : activities.length === 0 ? (
        <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 p-12 text-center">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 font-bold">Chưa có bài tập nào được tạo</p>
          <p className="text-slate-400 text-xs mt-1">Vui lòng nhấp vào nút "Thêm bài tập mới" để thiết lập nội dung học tập.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => (
            <div 
              key={activity.id} 
              className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              {/* Order and Info */}
              <div className="flex items-center gap-4 flex-1">
                <span className="flex-shrink-0 w-10 h-10 bg-slate-50 border border-slate-100 text-slate-650 rounded-2xl flex items-center justify-center font-black text-sm">
                  #{activity.sort_order}
                </span>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="p-1.5 bg-indigo-50 rounded-lg">
                      {ACTIVITY_TYPE_ICONS[activity.type] || <FileText className="w-5 h-5 text-indigo-600" />}
                    </span>
                    <h3 className="font-black text-slate-850 text-base leading-snug">{activity.title}</h3>
                    <span className="text-[10px] text-slate-500 font-bold bg-slate-100 px-2 py-0.5 rounded uppercase tracking-wider">
                      {activity.type}
                    </span>
                  </div>
                  {activity.instructions && (
                    <p className="text-slate-500 text-xs font-semibold">
                      Gợi ý: {activity.instructions}
                    </p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 bg-slate-50 md:bg-transparent -mx-6 -mb-6 p-4 md:p-0 md:m-0 border-t border-slate-100 md:border-t-0 justify-end">
                <Link
                  href={`/admin/topics/${topicId}/activities/form?id=${activity.id}`}
                  onClick={() => playSound("click")}
                  className="p-2 bg-white hover:bg-slate-100 text-slate-650 rounded-xl border border-slate-200 hover:text-slate-800 transition-colors flex items-center gap-1.5 px-3 py-2 font-bold text-xs"
                  title="Sửa bài tập"
                >
                  <Edit className="w-4 h-4" />
                  <span>Sửa</span>
                </Link>
                <button
                  onClick={() => handleDelete(activity.id, activity.title)}
                  className="p-2 bg-white hover:bg-rose-50 text-rose-500 rounded-xl border border-slate-200 hover:text-rose-700 transition-colors flex items-center gap-1.5 px-3 py-2 font-bold text-xs"
                  title="Xóa bài tập"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Xóa</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
