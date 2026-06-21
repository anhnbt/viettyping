"use client";
import React, { useState } from "react";
import { 
  Mail, 
  Send, 
  Settings, 
  Sparkles, 
  CheckCircle, 
  Bell, 
  BookOpen, 
  Users,
  Eye
} from "lucide-react";
import { useSound } from "@/contexts/SoundContext";

interface EmailTemplate {
  id: string;
  name: string;
  trigger: string;
  subject: string;
  active: boolean;
  recipients: string;
}

export default function AdminEmail() {
  const { playSound } = useSound();
  const [activeTab, setActiveTab] = useState<"newsletter" | "automated">("newsletter");
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Newsletter Form State
  const [newsSubject, setNewsSubject] = useState("");
  const [newsTarget, setNewsTarget] = useState("all-parents");
  const [newsContent, setNewsContent] = useState("");
  const [isSending, setIsSending] = useState(false);

  // Automated templates state
  const [templates, setTemplates] = useState<EmailTemplate[]>([
    {
      id: "weekly-report",
      name: "Báo cáo học tập tuần",
      trigger: "Tự động gửi vào 20:00 tối Chủ Nhật hàng tuần",
      subject: "Báo cáo kết quả luyện gõ của bé trong tuần qua",
      active: true,
      recipients: "Phụ huynh"
    },
    {
      id: "streak-alert",
      name: "Cảnh báo ngắt chuỗi học tập",
      trigger: "Khi bé không học bài quá 48 giờ",
      subject: "Nhắc nhở bé Dino cùng quay lại đảo gõ phím thôi bố mẹ ơi!",
      active: true,
      recipients: "Phụ huynh"
    },
    {
      id: "badge-unlocked",
      name: "Chúc mừng mở khóa Huy hiệu mới",
      trigger: "Tức thì sau khi bé nhận huy hiệu mới",
      subject: "Bé yêu vừa đạt được Huy hiệu danh giá trong VietTyping! 🎉",
      active: false,
      recipients: "Phụ huynh & Học sinh"
    }
  ]);

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSendNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsSubject.trim() || !newsContent.trim()) {
      showNotification("error", "Vui lòng điền tiêu đề và nội dung newsletter");
      return;
    }

    setIsSending(true);
    playSound("click");

    // Giả lập gửi email qua API
    setTimeout(() => {
      setIsSending(false);
      playSound("tada");
      showNotification("success", "Newsletter đã được gửi thành công đến toàn bộ phụ huynh! 🚀");
      setNewsSubject("");
      setNewsContent("");
    }, 2000);
  };

  const handleToggleTemplate = (id: string) => {
    playSound("click");
    setTemplates(
      templates.map((t) => (t.id === id ? { ...t, active: !t.active } : t))
    );
    showNotification("success", "Cập nhật cấu hình thông báo tự động thành công!");
  };

  const handleSaveAutomatedSettings = () => {
    playSound("tada");
    showNotification("success", "Đã lưu tất cả các thiết lập email tự động!");
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
          <h2 className="text-3xl font-black text-slate-800 tracking-wide">Email & Thông báo</h2>
          <p className="text-slate-500 font-medium">
            Gửi bản tin newsletter định kỳ cho phụ huynh và quản lý các luồng thông báo tự động qua Email.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="bg-slate-100 p-1 rounded-xl flex gap-1 border border-slate-200 self-start md:self-auto">
          <button
            onClick={() => { playSound("click"); setActiveTab("newsletter"); }}
            className={`px-4 py-2 rounded-lg font-bold text-xs transition-all flex items-center gap-1.5 ${
              activeTab === "newsletter" ? "bg-white text-slate-850 shadow" : "text-slate-500 hover:text-slate-850"
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Gửi Newsletter</span>
          </button>
          <button
            onClick={() => { playSound("click"); setActiveTab("automated"); }}
            className={`px-4 py-2 rounded-lg font-bold text-xs transition-all flex items-center gap-1.5 ${
              activeTab === "automated" ? "bg-white text-slate-855 shadow" : "text-slate-500 hover:text-slate-850"
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Email tự động (Cron)</span>
          </button>
        </div>
      </div>

      {activeTab === "newsletter" ? (
        /* NEWSLETTER TAB */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Form Soạn Thảo */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="font-black text-slate-800 text-lg border-b border-slate-100 pb-3 flex items-center gap-2">
              <Mail className="w-5 h-5 text-indigo-650" />
              <span>Soạn bản tin gửi phụ huynh</span>
            </h3>

            <form onSubmit={handleSendNewsletter} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-650 uppercase tracking-wide">
                    Nhóm người nhận
                  </label>
                  <select
                    value={newsTarget}
                    onChange={(e) => setNewsTarget(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-850 font-bold focus:outline-none focus:border-indigo-650"
                  >
                    <option value="all-parents">Tất cả phụ huynh ({`@parent`})</option>
                    <option value="grade-1-parents">Phụ huynh học sinh Lớp 1</option>
                    <option value="inactive-parents">Phụ huynh có con ngừng học trên 3 ngày</option>
                    <option value="high-achievers">Phụ huynh của các bé Top 10 bảng vàng</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-650 uppercase tracking-wide">
                    Phương thức gửi
                  </label>
                  <div className="px-4 py-2.5 bg-slate-100/75 border border-slate-200 rounded-xl text-slate-500 font-bold text-sm">
                    Gửi hàng loạt (Supabase Queue & Resend API)
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-650 uppercase tracking-wide">
                  Tiêu Đề Email
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Bí quyết giúp bé học nhanh và giữ chuỗi Streak 7 ngày học tập"
                  value={newsSubject}
                  onChange={(e) => setNewsSubject(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-850 font-bold focus:outline-none focus:border-indigo-650"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-650 uppercase tracking-wide">
                  Nội Dung Email (Markdown hỗ trợ)
                </label>
                <textarea
                  placeholder="Viết nội dung bản tin cẩm nang hoặc thông báo ở đây..."
                  value={newsContent}
                  onChange={(e) => setNewsContent(e.target.value)}
                  rows={8}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold focus:outline-none focus:border-indigo-650"
                  required
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="submit"
                  disabled={isSending}
                  className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md shadow-indigo-600/10 active:translate-y-0.5 transition-all text-xs cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSending ? "Đang gửi bản tin..." : "Gửi bản tin ngay 🚀"}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Hướng dẫn & Xem trước */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
            <h3 className="font-black text-slate-800 text-lg border-b border-slate-100 pb-3 flex items-center gap-2">
              <Eye className="w-5 h-5 text-indigo-600" />
              <span>Xem trước nhanh Email</span>
            </h3>

            <div className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50 text-xs">
              <div className="bg-slate-100 p-3 border-b border-slate-200 space-y-1">
                <div><span className="font-bold text-slate-400">Từ:</span> admin@viettyping.vn</div>
                <div><span className="font-bold text-slate-400">Tới:</span> {newsTarget === "all-parents" ? "Tất cả phụ huynh" : "Phụ huynh nhóm chọn lọc"}</div>
                <div>
                  <span className="font-bold text-slate-400">Tiêu đề:</span>{" "}
                  <span className="text-slate-800 font-bold">{newsSubject || "(Chưa nhập tiêu đề)"}</span>
                </div>
              </div>
              <div className="p-4 bg-white min-h-[160px] text-slate-700 space-y-3 font-medium leading-relaxed max-h-[300px] overflow-y-auto custom-scrollbar whitespace-pre-wrap">
                {newsContent || "Nội dung email sẽ hiển thị xem trước ở đây khi bạn soạn thảo..."}
              </div>
              <div className="bg-slate-50 p-3 text-center border-t border-slate-150 text-[10px] text-slate-400 font-semibold">
                Đây là email hệ thống gửi tự động từ VietTyping.vn
              </div>
            </div>

            <div className="bg-indigo-50/50 border border-indigo-100 p-4 rounded-2xl space-y-2">
              <h4 className="font-black text-indigo-900 text-sm flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-650" />
                <span>Mẹo viết newsletter hiệu quả</span>
              </h4>
              <p className="text-xs text-indigo-950 font-medium leading-relaxed">
                Nên đính kèm các số liệu tích cực, động viên như chuỗi Streak của bé, bảng điểm XP hoặc hướng dẫn bé cách sử dụng ngón tay gõ Telex tại nhà. Phụ huynh đánh giá rất cao sự đồng hành này.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* AUTOMATED EMAIL TAB */
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-black text-slate-800 text-lg flex items-center gap-2">
              <Bell className="w-5 h-5 text-indigo-650" />
              <span>Thiết lập kích hoạt Email tự động (Cron-triggers)</span>
            </h3>
            <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-0.5 rounded-full font-black uppercase">
              Hệ thống đang chạy
            </span>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {templates.map((tmpl) => (
              <div
                key={tmpl.id}
                className={`p-5 rounded-2xl border-2 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  tmpl.active
                    ? "bg-slate-55/10 border-indigo-100 hover:border-indigo-305"
                    : "bg-slate-50/50 border-slate-150 opacity-70"
                }`}
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-black text-slate-850 text-base leading-none">{tmpl.name}</h4>
                    <span className="text-[9px] bg-slate-150 text-slate-600 px-2 py-0.5 rounded font-black uppercase">
                      {tmpl.recipients}
                    </span>
                  </div>
                  <p className="text-xs font-black text-indigo-600 flex items-center gap-1">
                    <span>Kích hoạt:</span>
                    <span className="text-slate-500 font-semibold">{tmpl.trigger}</span>
                  </p>
                  <p className="text-xs text-slate-500 font-medium">
                    <span className="font-bold text-slate-450">Tiêu đề mẫu:</span> {tmpl.subject}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
                    <input
                      type="checkbox"
                      id={`active-${tmpl.id}`}
                      checked={tmpl.active}
                      onChange={() => handleToggleTemplate(tmpl.id)}
                      className="w-4.5 h-4.5 border border-slate-300 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    />
                    <label
                      htmlFor={`active-${tmpl.id}`}
                      className="text-xs font-black text-slate-700 cursor-pointer select-none"
                    >
                      {tmpl.active ? "Kích hoạt" : "Tạm dừng"}
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-slate-100 flex justify-end">
            <button
              onClick={handleSaveAutomatedSettings}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md shadow-indigo-600/10 active:translate-y-0.5 transition-all text-xs cursor-pointer"
            >
              Lưu cấu hình email tự động
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
