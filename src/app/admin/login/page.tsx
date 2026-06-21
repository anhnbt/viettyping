"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Settings, ShieldAlert, Sparkles } from "lucide-react";
import { useSound } from "@/contexts/SoundContext";
import { supabase } from "@/utils/supabase";

export default function AdminLogin() {
  const router = useRouter();
  const { playSound } = useSound();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // 1. Đăng nhập bằng email/password qua Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      if (authData?.user) {
        const userId = authData.user.id;

        // 2. Tra cứu cột role trong bảng student_profiles
        const { data: profile, error: profileError } = await supabase
          .from("student_profiles")
          .select("role")
          .eq("id", userId)
          .single();

        if (profileError) {
          console.error("Lỗi tra cứu profile:", profileError);
          // Trường hợp profile chưa được liên kết hoặc chưa có
          await supabase.auth.signOut();
          setError("Không tìm thấy thông tin hồ sơ của tài khoản này!");
          playSound("incorrect");
          setIsLoading(false);
          return;
        }

        // 3. Kiểm tra quyền Admin
        if (profile && profile.role === "admin") {
          playSound("tada");
          sessionStorage.setItem("viettyping_admin_logged", "true");
          router.push("/admin");
        } else {
          // Nếu không phải admin, tự động sign out
          await supabase.auth.signOut();
          setError("Tài khoản của bạn không có quyền quản trị! (role != 'admin')");
          playSound("incorrect");
          setIsLoading(false);
        }
      }
    } catch (err: any) {
      console.error("Lỗi đăng nhập Admin:", err);
      setError(err.message || "Email hoặc Mật khẩu quản trị chưa chính xác!");
      playSound("incorrect");
      setIsLoading(false);
    }
  };

  const handleQuickLogin = () => {
    playSound("click");
    setIsLoading(true);
    sessionStorage.setItem("viettyping_admin_logged", "true");
    setTimeout(() => {
      playSound("tada");
      router.push("/admin");
    }, 500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      {/* Background blobs for premium look */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-indigo-200/40 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-rose-200/30 rounded-full blur-3xl -z-10" />

      <div className="w-full max-w-md bg-white border border-slate-200 shadow-xl rounded-3xl overflow-hidden p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-indigo-50 text-indigo-600 rounded-2xl border border-indigo-100">
            <Settings className="w-8 h-8 animate-spin-slow" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 tracking-wide">Trang Quản Trị</h2>
          <p className="text-sm text-slate-400 font-bold">Vui lòng đăng nhập để thiết lập bài học</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-650 uppercase tracking-wide">Email</label>
            <input
              type="email"
              placeholder="admin@viettyping.vn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-bold placeholder-slate-400 focus:outline-none focus:border-indigo-600 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-650 uppercase tracking-wide">Mật khẩu</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-bold placeholder-slate-400 focus:outline-none focus:border-indigo-600 transition-colors"
            />
          </div>

          {error && (
            <div className="text-xs font-bold text-rose-500 bg-rose-50 border border-rose-100 px-4 py-2.5 rounded-xl flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl active:translate-y-0.5 transition-all text-sm shadow-md shadow-indigo-600/10 disabled:opacity-50 disabled:pointer-events-none"
          >
            {isLoading ? "Đang xử lý..." : "Đăng nhập CMS"}
          </button>
        </form>

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-slate-100"></div>
          <span className="flex-shrink mx-4 text-slate-400 text-xs font-bold uppercase">Hoặc</span>
          <div className="flex-grow border-t border-slate-100"></div>
        </div>

        {/* Quick Access */}
        <button
          onClick={handleQuickLogin}
          disabled={isLoading}
          className="w-full py-3 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 border border-slate-250 text-slate-700 font-bold rounded-xl active:translate-y-0.5 transition-all text-xs flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-emerald-500 fill-emerald-200" />
          <span>Vào nhanh bằng tài khoản Demo</span>
        </button>
      </div>
    </div>
  );
}
