"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/utils/supabase";
import { 
  Users, 
  BookOpen, 
  Layers, 
  Award,
  Sparkles,
  TrendingUp,
  Activity,
  ArrowRight
} from "lucide-react";
import { useSound } from "@/contexts/SoundContext";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  colorClass: string;
  bgClass: string;
}

function StatCard({ icon, label, value, colorClass, bgClass }: StatCardProps) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
      <div className={`p-4 rounded-xl ${bgClass} ${colorClass}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-bold text-slate-400">{label}</p>
        <h3 className="text-3xl font-black text-slate-800 mt-1">{value}</h3>
      </div>
    </div>
  );
}

interface Student {
  id: string;
  name: string;
  nickname: string;
  grade: string;
  avatar: string;
  xp: number;
  streak: number;
  avg_wpm?: number;
  avg_accuracy?: number;
}

export default function AdminDashboard() {
  const { playSound } = useSound();
  const [stats, setStats] = useState({
    students: 0,
    subjects: 0,
    topics: 0,
    activities: 0,
  });
  const [recentStudents, setRecentStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        // Fetch counts
        const [
          { count: studentsCount },
          { count: subjectsCount },
          { count: topicsCount },
          { count: activitiesCount }
        ] = await Promise.all([
          supabase.from("student_profiles").select("*", { count: "exact", head: true }),
          supabase.from("subjects").select("*", { count: "exact", head: true }),
          supabase.from("topics").select("*", { count: "exact", head: true }),
          supabase.from("activities").select("*", { count: "exact", head: true })
        ]);

        setStats({
          students: studentsCount || 0,
          subjects: subjectsCount || 0,
          topics: topicsCount || 0,
          activities: activitiesCount || 0,
        });

        // Fetch recent students
        const { data: studentsData, error: studentsError } = await supabase
          .from("student_profiles")
          .select("*")
          .order("updated_at", { ascending: false })
          .limit(5);

        if (studentsError) throw studentsError;
        if (studentsData) {
          setRecentStudents(studentsData);
        }
      } catch (err) {
        console.error("Lỗi tải dữ liệu Dashboard:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Title block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-wide">Tổng quan Hệ thống</h2>
          <p className="text-slate-500 font-medium">Báo cáo hoạt động học tập và quản lý dữ liệu giảng dạy.</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/subjects"
            onClick={() => playSound("click")}
            className="flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md shadow-indigo-600/10 active:translate-y-0.5 transition-all text-sm"
          >
            <BookOpen className="w-4 h-4" />
            <span>Tạo bài học mới</span>
          </Link>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<Users className="w-6 h-6" />}
          label="Tổng số Học sinh"
          value={isLoading ? "..." : stats.students}
          colorClass="text-emerald-600"
          bgClass="bg-emerald-50"
        />
        <StatCard
          icon={<BookOpen className="w-6 h-6" />}
          label="Môn học đang chạy"
          value={isLoading ? "..." : stats.subjects}
          colorClass="text-indigo-600"
          bgClass="bg-indigo-50"
        />
        <StatCard
          icon={<Layers className="w-6 h-6" />}
          label="Chủ đề bài học"
          value={isLoading ? "..." : stats.topics}
          colorClass="text-amber-600"
          bgClass="bg-amber-50"
        />
        <StatCard
          icon={<Award className="w-6 h-6" />}
          label="Hoạt động tương tác"
          value={isLoading ? "..." : stats.activities}
          colorClass="text-rose-600"
          bgClass="bg-rose-50"
        />
      </div>

      {/* Content blocks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent students */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-600" />
              <span>Học viên hoạt động gần đây</span>
            </h3>
            <Link
              href="/admin/students"
              onClick={() => playSound("click")}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <span>Xem tất cả</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold text-xs">
                  <th className="pb-3 font-semibold">Tên / Biệt danh</th>
                  <th className="pb-3 font-semibold">Lớp</th>
                  <th className="pb-3 font-semibold">XP tích lũy</th>
                  <th className="pb-3 font-semibold text-center">Chuỗi Streak</th>
                  <th className="pb-3 font-semibold text-right">WPM / Accuracy</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <tr key={i} className="animate-pulse border-b border-slate-50">
                      <td className="py-4"><div className="h-4 bg-slate-100 rounded w-2/3"></div></td>
                      <td className="py-4"><div className="h-4 bg-slate-100 rounded w-12"></div></td>
                      <td className="py-4"><div className="h-4 bg-slate-100 rounded w-16"></div></td>
                      <td className="py-4"><div className="h-4 bg-slate-100 rounded w-8 mx-auto"></div></td>
                      <td className="py-4"><div className="h-4 bg-slate-100 rounded w-20 ml-auto"></div></td>
                    </tr>
                  ))
                ) : recentStudents.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400 font-medium">
                      Chưa có học sinh nào hoạt động.
                    </td>
                  </tr>
                ) : (
                  recentStudents.map((student) => (
                    <tr key={student.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 flex items-center gap-3">
                        <span className="text-2xl">{student.avatar}</span>
                        <div>
                          <div className="font-bold text-slate-800 text-sm">{student.nickname}</div>
                          {student.name && <div className="text-xs text-slate-400">{student.name}</div>}
                        </div>
                      </td>
                      <td className="py-4 text-slate-600 font-bold text-xs">{student.grade}</td>
                      <td className="py-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 font-bold rounded-lg text-xs border border-amber-200">
                          <Sparkles className="w-3.5 h-3.5 fill-amber-400" />
                          <span>{student.xp} XP</span>
                        </span>
                      </td>
                      <td className="py-4 text-center font-black text-rose-500 text-sm">🔥 {student.streak}</td>
                      <td className="py-4 text-right">
                        <span className="font-bold text-slate-700 text-sm">
                          {student.avg_wpm !== undefined ? `${student.avg_wpm} WPM` : "-"}
                        </span>
                        <div className="text-[10px] text-slate-400 font-medium">
                          {student.avg_accuracy !== undefined ? `Độ chính xác: ${student.avg_accuracy}%` : ""}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Analytics widget */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              <span>Phân tích Nhanh</span>
            </h3>
            <p className="text-slate-500 text-sm font-medium leading-relaxed">
              Tỷ lệ hoàn thành hoạt động trung bình của các môn học lớp 1 hiện đang đạt **84%**.
            </p>
            <div className="space-y-3 pt-2">
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-650 mb-1">
                  <span>Tiếng Việt</span>
                  <span>92%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: "92%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-650 mb-1">
                  <span>Toán học</span>
                  <span>78%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: "78%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-650 mb-1">
                  <span>Luyện gõ Telex</span>
                  <span>65%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: "65%" }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 mt-6">
            <Link
              href="/admin/students"
              onClick={() => playSound("click")}
              className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <span>Xem phân tích chi tiết</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
