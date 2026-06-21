"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";
import { 
  Users, 
  Search, 
  Sparkles, 
  Award, 
  Flame, 
  TrendingUp, 
  CheckCircle,
  Clock
} from "lucide-react";
import { useSound } from "@/contexts/SoundContext";

interface StudentProfile {
  id: string;
  name: string | null;
  nickname: string;
  grade: string | null;
  avatar: string | null;
  xp: number;
  streak: number;
  avg_wpm: number | null;
  avg_accuracy: number | null;
  updated_at: string | null;
}

export default function AdminStudents() {
  const { playSound } = useSound();
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"xp" | "streak" | "nickname">("xp");
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null);

  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("student_profiles")
        .select("*")
        .order("xp", { ascending: false });

      if (error) throw error;
      setStudents(data || []);
    } catch (err: any) {
      console.error("Lỗi khi tải thông tin học sinh:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleStudentClick = (student: StudentProfile) => {
    playSound("click");
    setSelectedStudent(student);
  };

  const handleSortChange = (newSortBy: "xp" | "streak" | "nickname") => {
    playSound("click");
    setSortBy(newSortBy);
  };

  // Filter and sort students
  const processedStudents = students
    .filter(
      (s) =>
        s.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.name && s.name.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === "xp") return b.xp - a.xp;
      if (sortBy === "streak") return b.streak - a.streak;
      return a.nickname.localeCompare(b.nickname);
    });

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h2 className="text-3xl font-black text-slate-800 tracking-wide">Tiến độ Học viên</h2>
        <p className="text-slate-500 font-medium">
          Theo dõi hành trình học tập, XP tích lũy, streak chuyên cần và tốc độ gõ phím của học sinh.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Student List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Controls */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1 flex items-center gap-3 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100">
              <Search className="w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm học sinh theo tên, biệt danh..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none text-slate-850 font-semibold placeholder-slate-400 focus:outline-none text-sm"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 whitespace-nowrap">Sắp xếp theo:</span>
              <div className="bg-slate-100 p-1 rounded-xl flex gap-1 border border-slate-200">
                <button
                  onClick={() => handleSortChange("xp")}
                  className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
                    sortBy === "xp" ? "bg-white text-slate-850 shadow" : "text-slate-500 hover:text-slate-850"
                  }`}
                >
                  XP cao nhất
                </button>
                <button
                  onClick={() => handleSortChange("streak")}
                  className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
                    sortBy === "streak" ? "bg-white text-slate-850 shadow" : "text-slate-500 hover:text-slate-850"
                  }`}
                >
                  Streak 🔥
                </button>
                <button
                  onClick={() => handleSortChange("nickname")}
                  className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
                    sortBy === "nickname" ? "bg-white text-slate-850 shadow" : "text-slate-500 hover:text-slate-850"
                  }`}
                >
                  Tên A-Z
                </button>
              </div>
            </div>
          </div>

          {/* Student Table */}
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-150 bg-slate-50 text-slate-450 font-black text-xs uppercase tracking-wider">
                    <th className="p-6">Học sinh</th>
                    <th className="p-6">Lớp</th>
                    <th className="p-6">Điểm XP</th>
                    <th className="p-6 text-center">Streak</th>
                    <th className="p-6 text-right">WPM / Accuracy</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                      <tr key={i} className="animate-pulse border-b border-slate-50">
                        <td className="p-6"><div className="h-5 bg-slate-100 rounded w-2/3"></div></td>
                        <td className="p-6"><div className="h-4 bg-slate-100 rounded w-12"></div></td>
                        <td className="p-6"><div className="h-5 bg-slate-100 rounded w-16"></div></td>
                        <td className="p-6"><div className="h-5 bg-slate-100 rounded w-10 mx-auto"></div></td>
                        <td className="p-6"><div className="h-5 bg-slate-100 rounded w-24 ml-auto"></div></td>
                      </tr>
                    ))
                  ) : processedStudents.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-12 text-center text-slate-400 font-bold">
                        Không tìm thấy thông tin học sinh nào.
                      </td>
                    </tr>
                  ) : (
                    processedStudents.map((student) => (
                      <tr 
                        key={student.id}
                        onClick={() => handleStudentClick(student)}
                        className={`border-b border-slate-100 hover:bg-indigo-50/20 transition-colors cursor-pointer ${
                          selectedStudent?.id === student.id ? "bg-indigo-50/30" : ""
                        }`}
                      >
                        <td className="p-6 flex items-center gap-3">
                          <span className="text-3xl p-1 bg-slate-50 border border-slate-100 rounded-xl">
                            {student.avatar || "🦁"}
                          </span>
                          <div>
                            <div className="font-black text-slate-800 text-sm leading-snug">{student.nickname}</div>
                            {student.name && <div className="text-xs text-slate-400 font-semibold">{student.name}</div>}
                          </div>
                        </td>
                        <td className="p-6 text-slate-500 font-bold text-xs">{student.grade || "Lớp 1"}</td>
                        <td className="p-6">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 font-bold rounded-lg text-xs border border-amber-250">
                            <Sparkles className="w-3.5 h-3.5 fill-amber-400" />
                            <span>{student.xp} XP</span>
                          </span>
                        </td>
                        <td className="p-6 text-center font-black text-rose-500 text-sm">🔥 {student.streak}</td>
                        <td className="p-6 text-right">
                          <span className="font-bold text-slate-700 text-sm">
                            {student.avg_wpm !== null ? `${student.avg_wpm} WPM` : "-"}
                          </span>
                          <div className="text-[10px] text-slate-400 font-bold">
                            {student.avg_accuracy !== null ? `Độ chính xác: ${student.avg_accuracy}%` : "Chưa hoàn thành bài"}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Detailed View */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
          <h3 className="font-black text-slate-800 text-lg border-b border-slate-100 pb-3 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            <span>Chi tiết Tiến trình</span>
          </h3>

          {selectedStudent ? (
            <div className="space-y-6">
              {/* Profile Card Summary */}
              <div className="text-center space-y-3 pb-6 border-b border-slate-100">
                <span className="text-6xl inline-block p-4 bg-indigo-50/50 rounded-full border-2 border-indigo-100 shadow-inner">
                  {selectedStudent.avatar || "🦁"}
                </span>
                <div>
                  <h4 className="text-xl font-black text-slate-800">{selectedStudent.nickname}</h4>
                  <p className="text-xs text-slate-400 font-bold">
                    {selectedStudent.name || "Chưa cập nhật tên đầy đủ"}
                  </p>
                  <span className="inline-block mt-2 px-3 py-1 bg-slate-100 text-slate-600 text-xs font-black rounded-full">
                    {selectedStudent.grade || "Lớp 1"}
                  </span>
                </div>
              </div>

              {/* Stats Block */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-center space-y-1">
                  <Flame className="w-6 h-6 text-rose-500 mx-auto fill-rose-100" />
                  <div className="text-xs text-slate-400 font-bold">Chuỗi học tập</div>
                  <div className="text-xl font-black text-rose-600">{selectedStudent.streak} ngày</div>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-center space-y-1">
                  <Award className="w-6 h-6 text-amber-500 mx-auto fill-amber-100" />
                  <div className="text-xs text-slate-400 font-bold">Tích lũy XP</div>
                  <div className="text-xl font-black text-amber-700">{selectedStudent.xp} XP</div>
                </div>
              </div>

              {/* Skills Metrics */}
              <div className="space-y-3">
                <h5 className="text-xs font-black text-slate-650 uppercase tracking-wider">Chỉ số Kỹ năng gõ</h5>
                <div className="space-y-2.5">
                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                      <span>Tốc độ trung bình (WPM)</span>
                      <span className="font-extrabold text-slate-700">{selectedStudent.avg_wpm || 0} WPM</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-indigo-600 rounded-full" 
                        style={{ width: `${Math.min((selectedStudent.avg_wpm || 0) * 3, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                      <span>Độ chính xác (%)</span>
                      <span className="font-extrabold text-slate-700">{selectedStudent.avg_accuracy || 0}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 rounded-full" 
                        style={{ width: `${selectedStudent.avg_accuracy || 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Meta Info */}
              <div className="pt-4 border-t border-slate-150 text-[10px] text-slate-400 font-bold space-y-1.5">
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Trạng thái: Hoạt động bình thường</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-350" />
                  <span>Cập nhật cuối: {selectedStudent.updated_at ? new Date(selectedStudent.updated_at).toLocaleString("vi-VN") : "N/A"}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-450 space-y-2">
              <Users className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="font-bold text-sm">Chưa chọn học sinh</p>
              <p className="text-xs text-slate-400 max-w-[200px] mx-auto leading-normal">
                Bấm vào một học sinh trong danh sách bên cạnh để xem báo cáo chi tiết.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
