import React from "react";
import { LessonProvider } from "@/contexts/LessonContext";

export default function LessonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LessonProvider>{children}</LessonProvider>;
}
