"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";

export interface StudentInfo {
  name: string;      // Tên đầy đủ trên lớp
  nickname: string;  // Biệt danh / Tên gọi yêu thích
  grade: string;     // Lớp học (ví dụ: Lớp 1, Lớp 2...)
  avatar: string;    // Emoji avatar (ví dụ: 🦁)
  theme?: 'dino' | 'turtle' | 'bunny' | 'pig' | 'leopard'; // Theme giao diện của bé
}

interface StudentContextType {
  studentInfo: StudentInfo | null;
  isConfigured: boolean;
  isOpenConfig: boolean;
  isLoaded: boolean;
  updateStudentInfo: (info: StudentInfo) => void;
  setIsOpenConfig: (isOpen: boolean) => void;
  clearStudentInfo: () => void;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

const STORAGE_KEY = "viettyping_student_profile";

export function StudentProvider({ children }: { children: ReactNode }) {
  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null);
  const [isOpenConfig, setIsOpenConfig] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Đọc thông tin từ localStorage khi component mount ở client-side
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem(STORAGE_KEY);
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile) as StudentInfo;
        setStudentInfo(parsed);
        if (parsed.theme) {
          document.documentElement.setAttribute('data-theme', parsed.theme);
        } else {
          document.documentElement.setAttribute('data-theme', 'dino');
        }
      } else {
        document.documentElement.setAttribute('data-theme', 'dino');
      }
    } catch (error) {
      console.error("Lỗi khi đọc thông tin học sinh từ localStorage:", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const updateStudentInfo = useCallback((info: StudentInfo) => {
    const infoWithTheme: StudentInfo = {
      ...info,
      theme: info.theme || 'dino'
    };
    setStudentInfo(infoWithTheme);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(infoWithTheme));
      if (infoWithTheme.theme) {
        document.documentElement.setAttribute('data-theme', infoWithTheme.theme);
      }
    } catch (error) {
      console.error("Lỗi khi lưu thông tin học sinh vào localStorage:", error);
    }
  }, []);

  const clearStudentInfo = useCallback(() => {
    setStudentInfo(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
      document.documentElement.setAttribute('data-theme', 'dino');
    } catch (error) {
      console.error("Lỗi khi xóa thông tin học sinh:", error);
    }
  }, []);

  const isConfigured = studentInfo !== null && studentInfo.nickname.trim() !== "";

  return (
    <StudentContext.Provider
      value={{
        studentInfo,
        isConfigured,
        isOpenConfig,
        isLoaded,
        updateStudentInfo,
        setIsOpenConfig,
        clearStudentInfo,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
}

export function useStudent() {
  const context = useContext(StudentContext);
  if (context === undefined) {
    throw new Error("useStudent must be used within a StudentProvider");
  }
  return context;
}
