"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";

export interface StudentInfo {
  name: string;      // Tên đầy đủ trên lớp
  nickname: string;  // Biệt danh / Tên gọi yêu thích
  grade: string;     // Lớp học (ví dụ: Lớp 1, Lớp 2...)
  avatar: string;    // Emoji avatar (ví dụ: 🦁)
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
        setStudentInfo(JSON.parse(savedProfile));
      }
    } catch (error) {
      console.error("Lỗi khi đọc thông tin học sinh từ localStorage:", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const updateStudentInfo = useCallback((info: StudentInfo) => {
    setStudentInfo(info);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(info));
    } catch (error) {
      console.error("Lỗi khi lưu thông tin học sinh vào localStorage:", error);
    }
  }, []);

  const clearStudentInfo = useCallback(() => {
    setStudentInfo(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
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
