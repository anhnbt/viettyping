"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStudent, StudentInfo } from "@/contexts/StudentContext";
import { useSound } from "@/contexts/SoundContext";
import { X, Sparkles, User, GraduationCap, Heart } from "lucide-react";
import confetti from "canvas-confetti";

const AVATARS = [
  { emoji: "🦊", name: "Cáo Nhỏ" },
  { emoji: "🦁", name: "Sư Tử" },
  { emoji: "🐰", name: "Thỏ Ngọc" },
  { emoji: "🦖", name: "Khủng Long" },
  { emoji: "🐼", name: "Gấu Trúc" },
  { emoji: "🦄", name: "Kỳ Lân" },
  { emoji: "🐸", name: "Ếch Xanh" },
  { emoji: "🐱", name: "Mèo Ú" },
  { emoji: "🐯", name: "Hổ Con" },
  { emoji: "🐻", name: "Gấu Nâu" }
];

const GRADES = ["Lớp 1", "Lớp 2", "Lớp 3", "Lớp 4", "Lớp 5"];

export default function StudentConfigModal() {
  const { studentInfo, isConfigured, isOpenConfig, setIsOpenConfig, updateStudentInfo, isLoaded } = useStudent();
  const { playSound } = useSound();

  const [nickname, setNickname] = useState("");
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("Lớp 1");
  const [avatar, setAvatar] = useState("🦊");
  const [error, setError] = useState("");

  // Đồng bộ thông tin từ context khi mở modal
  useEffect(() => {
    if (studentInfo) {
      setNickname(studentInfo.nickname || "");
      setName(studentInfo.name || "");
      setGrade(studentInfo.grade || "Lớp 1");
      setAvatar(studentInfo.avatar || "🦊");
    } else {
      // Mặc định cho bé mới
      setNickname("");
      setName("");
      setGrade("Lớp 1");
      setAvatar("🦊");
    }
    setError("");
  }, [studentInfo, isOpenConfig]);

  // Tự động mở modal nếu bé chưa cấu hình và dữ liệu đã được load từ localStorage
  useEffect(() => {
    if (isLoaded && !isConfigured) {
      setIsOpenConfig(true);
    }
  }, [isLoaded, isConfigured, setIsOpenConfig]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nickname.trim()) {
      playSound("incorrect");
      setError("Bé hãy điền biệt danh hoặc tên gọi yêu thích nhé! 💕");
      return;
    }

    const updatedInfo: StudentInfo = {
      name: name.trim(),
      nickname: nickname.trim(),
      grade,
      avatar
    };

    updateStudentInfo(updatedInfo);
    playSound("tada");

    // Hiệu ứng pháo hoa ăn mừng
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ["#ff4500", "#ff8c00", "#ffd700", "#32cd32", "#1e90ff", "#da70d6"]
    });

    setIsOpenConfig(false);
  };

  const handleSelectAvatar = (emoji: string) => {
    playSound("tick");
    setAvatar(emoji);
  };

  const handleSelectGrade = (selectedGrade: string) => {
    playSound("click");
    setGrade(selectedGrade);
  };

  // Xác định xem có cho phép đóng modal bằng nút X hay click overlay hay không
  // Bắt buộc cấu hình nếu chưa từng có thông tin
  const canClose = isConfigured;

  if (!isLoaded || !isOpenConfig) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Overlay background */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            if (canClose) {
              playSound("click");
              setIsOpenConfig(false);
            }
          }}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
        />

        {/* Modal Box */}
        <motion.div
          initial={{ scale: 0.9, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 20, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 350 }}
          className="relative w-full max-w-lg max-h-[90vh] bg-amber-50 border-4 border-slate-800 rounded-[32px] shadow-[8px_8px_0px_0px_#1e293b] overflow-hidden z-10 flex flex-col"
        >
          {/* Nút Đóng (chỉ hiện khi đã cấu hình xong) */}
          {canClose && (
            <button
              onClick={() => {
                playSound("click");
                setIsOpenConfig(false);
              }}
              className="absolute top-4 right-4 p-2 bg-white hover:bg-rose-100 text-slate-700 hover:text-rose-650 border-2 border-slate-800 rounded-full shadow-[2px_2px_0px_0px_#1e293b] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer z-20"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          {/* Dải màu trang trí phía trên */}
          <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-red-400 via-yellow-400 to-indigo-400 z-20" />

          {/* Vùng nội dung cuộn */}
          <div className="overflow-y-auto p-6 md:p-8 pt-10 md:pt-10 w-full flex-1 custom-scrollbar">
            {/* Tiêu đề */}
            <div className="text-center mt-2 mb-6">
              <span className="text-5xl inline-block animate-bounce mb-2">🎉</span>
              <h2 className="text-3xl font-black text-indigo-950 tracking-wide flex items-center justify-center gap-2">
                <span>Hồ Sơ Của Bé</span>
                <Sparkles className="w-6 h-6 text-amber-500 fill-amber-300 animate-pulse" />
              </h2>
              <p className="text-slate-600 text-sm font-bold mt-1">
                {isConfigured ? "Cập nhật thông tin học tập của bé" : "Bé hãy điền thông tin để bắt đầu học nhé!"}
              </p>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              {/* Lựa chọn Avatar Emoji */}
              <div>
                <label className="block text-slate-800 font-extrabold text-base mb-2.5 flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-rose-500 fill-rose-350" />
                  <span>1. Chọn người bạn đồng hành của bé:</span>
                </label>
                <div className="grid grid-cols-5 gap-2.5 p-3 bg-white border-2 border-slate-800 rounded-2xl shadow-[3px_3px_0px_0px_rgba(0,0,0,0.05)]">
                  {AVATARS.map((item) => (
                    <button
                      key={item.emoji}
                      type="button"
                      onClick={() => handleSelectAvatar(item.emoji)}
                      className={`text-3xl p-2 rounded-xl transition-all relative border-2 cursor-pointer ${
                        avatar === item.emoji
                          ? "bg-amber-200 border-indigo-600 scale-110 shadow-sm"
                          : "bg-slate-50/50 hover:bg-slate-100 border-transparent hover:scale-105"
                      }`}
                    >
                      {avatar === item.emoji && (
                        <span className="absolute -top-1.5 -right-1.5 text-xs bg-indigo-600 text-white rounded-full w-4 h-4 flex items-center justify-center font-bold">
                          ✓
                        </span>
                      )}
                      <span className="block transform hover:rotate-12 transition-transform">{item.emoji}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Biệt danh / Tên ở nhà */}
              <div>
                <label className="block text-slate-800 font-extrabold text-base mb-2 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-indigo-500" />
                  <span>2. Tên ở nhà / Biệt danh của bé:</span>
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Bắp, Na, Tin Tin..."
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  maxLength={15}
                  className="w-full px-5 py-3.5 bg-white border-2 border-slate-800 rounded-2xl text-lg font-black text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-200/50 focus:border-indigo-600 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,0.05)]"
                />
              </div>

              {/* Tên đầy đủ trên lớp */}
              <div>
                <label className="block text-slate-800 font-extrabold text-base mb-2 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-indigo-500" />
                  <span>3. Tên đầy đủ trên lớp (tùy chọn):</span>
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Nguyễn Minh Khang"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={30}
                  className="w-full px-5 py-3.5 bg-white border-2 border-slate-800 rounded-2xl text-lg font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-200/50 focus:border-indigo-600 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,0.05)]"
                />
              </div>

              {/* Bé học lớp mấy */}
              <div>
                <label className="block text-slate-800 font-extrabold text-base mb-2 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-indigo-500" />
                  <span>4. Bé đang học lớp mấy nhỉ?</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {GRADES.map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => handleSelectGrade(g)}
                      className={`flex-1 min-w-[70px] py-2.5 rounded-xl text-sm font-black border-2 transition-all cursor-pointer ${
                        grade === g
                          ? "bg-indigo-600 text-white border-slate-850 shadow-[2px_2px_0px_0px_#1e293b]"
                          : "bg-white hover:bg-slate-100 text-slate-700 border-slate-800 shadow-[2px_2px_0px_0px_#1e293b] active:translate-y-[1px] active:shadow-none"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm font-bold text-rose-500 bg-rose-50 border-2 border-rose-200 px-4 py-2.5 rounded-xl"
                >
                  ⚠️ {error}
                </motion.div>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-650 text-white font-black text-xl rounded-2xl border-2 border-slate-850 shadow-[4px_4px_0px_0px_#1e293b] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_#1e293b] transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Bắt Đầu Học Thôi! 🚀</span>
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
