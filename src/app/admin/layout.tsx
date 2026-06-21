"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  FileText, 
  LogOut, 
  ArrowLeft,
  Sparkles,
  Settings,
  Mail
} from "lucide-react";
import { useSound } from "@/contexts/SoundContext";
import { supabase } from "@/utils/supabase";

interface SidebarLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClickSound: () => void;
}

function SidebarLink({ href, icon, label, active, onClickSound }: SidebarLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClickSound}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-200 ${
        active
          ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20 translate-x-1"
          : "text-slate-650 hover:bg-slate-100 hover:text-slate-900"
      }`}
    >
      <div className={`transition-transform duration-200 ${active ? "scale-110" : ""}`}>
        {icon}
      </div>
      <span>{label}</span>
    </Link>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { playSound } = useSound();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    // Nếu là trang login thì bypass
    if (pathname === "/admin/login") {
      setCheckingAuth(false);
      return;
    }

    const checkAdminAuth = async () => {
      try {
        // 1. Kiểm tra session storage nhanh
        if (sessionStorage.getItem("viettyping_admin_logged") === "true") {
          setCheckingAuth(false);
          return;
        }

        // 2. Tra cứu Supabase Session
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          router.push("/admin/login");
          return;
        }

        // 3. Tra cứu role trong DB
        const { data: profile, error } = await supabase
          .from("student_profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();

        if (error || !profile || profile.role !== "admin") {
          await supabase.auth.signOut();
          sessionStorage.removeItem("viettyping_admin_logged");
          router.push("/admin/login");
        } else {
          sessionStorage.setItem("viettyping_admin_logged", "true");
          setCheckingAuth(false);
        }
      } catch (err) {
        console.error("Lỗi kiểm tra quyền admin:", err);
        router.push("/admin/login");
      }
    };

    checkAdminAuth();
  }, [pathname, router]);

  const handleLinkClick = () => {
    playSound("click");
  };

  const handleLogout = async () => {
    playSound("click");
    sessionStorage.removeItem("viettyping_admin_logged");
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  const navItems = [
    { href: "/admin", icon: <LayoutDashboard className="w-5 h-5" />, label: "Tổng quan" },
    { href: "/admin/subjects", icon: <BookOpen className="w-5 h-5" />, label: "Quản lý Bài học" },
    { href: "/admin/students", icon: <Users className="w-5 h-5" />, label: "Tiến độ Học sinh" },
    { href: "/admin/blog", icon: <FileText className="w-5 h-5" />, label: "Blog Phụ huynh" },
    { href: "/admin/email", icon: <Mail className="w-5 h-5" />, label: "Email & Thông báo" },
  ];

  // Bypass layout for login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (checkingAuth) {
    return (
      <div className="flex h-screen bg-slate-50 items-center justify-center">
        <div className="text-center space-y-4">
          <Settings className="w-12 h-12 animate-spin text-indigo-600 mx-auto" />
          <p className="text-slate-500 font-bold text-sm">Đang xác thực quyền Admin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col z-20">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <Link 
            href="/admin" 
            onClick={handleLinkClick}
            className="flex items-center gap-2"
          >
            <div className="bg-indigo-600 text-white p-2 rounded-xl">
              <Settings className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <h1 className="font-black text-lg text-slate-800 tracking-wide leading-none">VietTyping</h1>
              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Admin CMS</span>
            </div>
          </Link>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <SidebarLink
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={item.label}
                active={isActive}
                onClickSound={handleLinkClick}
              />
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-100 space-y-2">
          <Link
            href="/"
            onClick={handleLinkClick}
            className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-indigo-600 hover:bg-indigo-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Quay lại App Học</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-rose-605 hover:bg-rose-50 transition-colors text-left"
          >
            <LogOut className="w-5 h-5" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-10">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-800">Xin chào, Admin!</span>
            <Sparkles className="w-4 h-4 text-amber-500 fill-amber-300 animate-pulse" />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-150 border-2 border-indigo-600 flex items-center justify-center font-black text-indigo-700">
              A
            </div>
            <div className="text-right hidden sm:block">
              <div className="text-xs font-black text-slate-800 leading-tight">Quản trị viên</div>
              <div className="text-[10px] font-bold text-slate-450">admin@viettyping.vn</div>
            </div>
          </div>
        </header>

        {/* Main Body */}
        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}
