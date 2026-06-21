"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStudent, StudentInfo } from "@/contexts/StudentContext";
import { useSound } from "@/contexts/SoundContext";
import { X } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import confettiActual from "canvas-confetti";

const THEME_TO_EMOJI: Record<string, string> = {
  dino: "🦖",
  turtle: "🐢",
  bunny: "🐰",
  panda: "🐼",
  leopard: "🐆"
};

const GRADES = ["Lớp 1", "Lớp 2", "Lớp 3", "Lớp 4", "Lớp 5"];

const MASCOTS = [
  { id: "dino", name: "Khủng Long", emoji: "🦖", desc: "Khủng long xanh lá" },
  { id: "turtle", name: "Rùa Con", emoji: "🐢", desc: "Rùa con đại dương" },
  { id: "bunny", name: "Thỏ Ngọc", emoji: "🐰", desc: "Thỏ con cà rốt" },
  { id: "panda", name: "Gấu Trúc", emoji: "🐼", desc: "Gấu trúc thông minh" },
  { id: "leopard", name: "Báo Đốm", emoji: "🐆", desc: "Báo đốm thần tốc" }
];

export default function StudentConfigModal() {
  const router = useRouter();
  const pathname = usePathname();
  const { studentInfo, isConfigured, isOpenConfig, setIsOpenConfig, updateStudentInfo, isLoaded } = useStudent();
  const { playSound } = useSound();

  const [nickname, setNickname] = useState("");
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("Lớp 1");
  const [theme, setTheme] = useState<'dino' | 'turtle' | 'bunny' | 'panda' | 'leopard'>("dino");
  const [error, setError] = useState("");
  const [unlockedMascots, setUnlockedMascots] = useState<string[]>(["dino", "turtle"]);

  // Đồng bộ thông tin từ context khi mở modal
  useEffect(() => {
    if (studentInfo) {
      setNickname(studentInfo.nickname || "");
      setName(studentInfo.name || "");
      setGrade(studentInfo.grade || "Lớp 1");
      setTheme(studentInfo.theme || "dino");
    } else {
      // Mặc định cho bé mới
      setNickname("");
      setName("");
      setGrade("Lớp 1");
      setTheme("dino");
    }
    setError("");
  }, [studentInfo, isOpenConfig]);

  // Đọc danh sách mascot đã mở khóa từ localStorage khi mở modal
  useEffect(() => {
    if (isOpenConfig) {
      try {
        const savedUnlocked = localStorage.getItem("viettyping_unlocked_mascots");
        if (savedUnlocked) {
          setUnlockedMascots(JSON.parse(savedUnlocked));
        } else {
          setUnlockedMascots(["dino", "turtle"]);
        }
      } catch (e) {
        console.error("Lỗi đọc danh sách linh vật đã mở khóa:", e);
      }
    }
  }, [isOpenConfig]);

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
      setError("Vui lòng điền biệt danh hoặc tên gọi yêu thích!");
      return;
    }

    const updatedInfo: StudentInfo = {
      name: name.trim(),
      nickname: nickname.trim(),
      grade,
      avatar: THEME_TO_EMOJI[theme] || "🦖",
      theme
    };

    updateStudentInfo(updatedInfo);
    playSound("tada");

    // Hiệu ứng pháo hoa ăn mừng
    confettiActual({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ["#ff4500", "#ff8c00", "#ffd700", "#32cd32", "#1e90ff", "#da70d6"]
    });

    setIsOpenConfig(false);
  };

  const handleSelectGrade = (selectedGrade: string) => {
    playSound("click");
    setGrade(selectedGrade);
  };

  // Xác định xem có cho phép đóng modal bằng nút X hay click overlay hay không
  // Bắt buộc cấu hình nếu chưa từng có thông tin
  const canClose = isConfigured;

  if (!isLoaded || !isOpenConfig || pathname?.startsWith("/admin")) return null;

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

        <motion.div
          initial={{ scale: 0.9, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 20, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 350 }}
          className="relative w-full max-w-lg max-h-[90vh] bg-amber-50/98 backdrop-blur-md border border-amber-200/80 rounded-[32px] shadow-[0_24px_48px_-12px_rgba(30,41,59,0.15)] overflow-hidden z-10 flex flex-col"
        >
          {/* Nút Đóng (chỉ hiện khi đã cấu hình xong) */}
          {canClose && (
            <button
              onClick={() => {
                playSound("click");
                setIsOpenConfig(false);
              }}
              className="absolute top-4 right-4 p-2 bg-white/90 hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200/60 rounded-full shadow-sm hover:shadow active:scale-95 transition-all cursor-pointer z-20"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          {/* Vùng nội dung cuộn */}
          <div className="overflow-y-auto p-6 md:p-8 pt-10 md:pt-10 w-full flex-1 custom-scrollbar">
            {/* Tiêu đề */}
            <div className="text-center mt-2 mb-6">
              <h2 className="text-2xl font-bold text-slate-800 tracking-wide">
                Hồ Sơ Của Bé
              </h2>
              <p className="text-slate-500 text-xs mt-1">
                {isConfigured ? "Cập nhật thông tin học tập của bé" : "Vui lòng hoàn thành thông tin để bắt đầu"}
              </p>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              {/* Lựa chọn Bạn đồng hành & Theme */}
              <div>
                <label className="block text-slate-700 font-bold text-sm mb-2">
                  1. Chọn bạn đồng hành và giao diện:
                </label>
                <div className="grid grid-cols-3 gap-3 p-3 bg-white/80 border border-slate-200/60 rounded-2xl shadow-sm">
                  {MASCOTS.map((m) => {
                    const isUnlocked = unlockedMascots.includes(m.id);
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => {
                          if (!isUnlocked) {
                            playSound("incorrect");
                            if (confirm(`Linh vật ${m.name} đang bị khóa. Bé có muốn ghé thăm Cửa hàng để mở khóa bằng điểm XP không?`)) {
                              setIsOpenConfig(false);
                              router.push("/shop");
                            }
                          } else {
                            playSound("click");
                            setTheme(m.id as any);
                          }
                        }}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all relative border ${
                          !isUnlocked
                            ? "bg-slate-100/50 opacity-60 border-slate-200/60 cursor-pointer"
                            : theme === m.id
                              ? "bg-amber-100 border-2 border-amber-400 scale-105 shadow-md shadow-amber-200/60"
                              : "bg-slate-50/50 hover:bg-white/95 border-transparent hover:border-slate-200/50 hover:scale-105"
                        }`}
                        title={isUnlocked ? m.desc : `${m.name} - Bị khóa (Mở ở Cửa hàng)`}
                      >
                        {isUnlocked && theme === m.id && (
                          <span className="absolute -top-1.5 -right-1.5 text-xs bg-indigo-600 text-white rounded-full w-4 h-4 flex items-center justify-center font-bold shadow-sm">
                            ✓
                          </span>
                        )}
                        {!isUnlocked && (
                          <span className="absolute -top-1.5 -right-1.5 text-xs bg-slate-100 border border-slate-350 text-slate-500 rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-sm">
                            🔒
                          </span>
                        )}
                        <span className={`text-4xl mb-1 transform hover:rotate-12 transition-transform ${!isUnlocked ? "grayscale" : ""}`}>
                          {m.emoji}
                        </span>
                        <span className="text-xs font-bold text-slate-700 text-center leading-tight w-full mt-1">{m.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Biệt danh / Tên ở nhà */}
              <div>
                <label className="block text-slate-700 font-bold text-sm mb-2">
                  2. Biệt danh của bé:
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Bắp, Na, Tin Tin..."
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  maxLength={15}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-base font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all shadow-sm"
                />
              </div>

              {/* Tên đầy đủ trên lớp */}
              <div>
                <label className="block text-slate-700 font-bold text-sm mb-2">
                  3. Họ và tên đầy đủ (tùy chọn):
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Nguyễn Minh Khang"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={30}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-base font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all shadow-sm"
                />
              </div>

              {/* Bé học lớp mấy */}
              <div>
                <label className="block text-slate-700 font-bold text-sm mb-2">
                  4. Lớp học của bé:
                </label>
                <div className="flex flex-wrap gap-2">
                  {GRADES.map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => handleSelectGrade(g)}
                      className={`flex-1 min-w-[70px] py-2 rounded-xl text-sm font-bold transition-all cursor-pointer border ${
                        grade === g
                          ? "bg-indigo-600 text-white border-indigo-700 shadow-md shadow-indigo-100 scale-102"
                          : "bg-white text-slate-650 border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-sm active:translate-y-0.5"
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
                  className="text-sm font-semibold text-rose-600 bg-rose-50 border border-rose-200/80 px-4 py-2.5 rounded-xl"
                >
                  {error}
                </motion.div>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 text-base rounded-xl cursor-pointer flex items-center justify-center gap-2 text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm hover:shadow transition-all font-bold"
                >
                  <span>Lưu hồ sơ</span>
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
