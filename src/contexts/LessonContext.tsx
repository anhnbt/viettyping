"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback } from "react";

interface LessonState {
  currentXP: number;
  streak: number;
  progress: number;
  completedActivities: string[]; // Store IDs of completed activities
  totalActivities: number;
  badges: string[]; // Store unlocked badge IDs
}

interface LessonContextType extends LessonState {
  addXP: (amount: number) => void;
  incrementStreak: () => void;
  resetStreak: () => void;
  markActivityCompleted: (activityId: string) => void;
  setTotalActivities: (total: number) => void;
  unlockBadge: (badgeId: string) => void;
}

const LessonContext = createContext<LessonContextType | undefined>(undefined);

export function LessonProvider({ children }: { children: ReactNode }) {
  const [currentXP, setCurrentXP] = useState(0);
  const [streak, setStreak] = useState(0);
  const [completedActivities, setCompletedActivities] = useState<string[]>([]);
  const [totalActivities, setTotalActivitiesState] = useState(1);
  const [badges, setBadges] = useState<string[]>([]);

  // Tính toán progress dựa trên completedActivities và totalActivities
  const progress = totalActivities > 0 ? (completedActivities.length / totalActivities) * 100 : 0;

  const addXP = useCallback((amount: number) => {
    setCurrentXP((prev) => prev + amount);
  }, []);

  const incrementStreak = useCallback(() => {
    setStreak((prev) => prev + 1);
  }, []);

  const resetStreak = useCallback(() => {
    setStreak(0);
  }, []);

  const markActivityCompleted = useCallback((activityId: string) => {
    setCompletedActivities((prev) => {
      if (!prev.includes(activityId)) {
        return [...prev, activityId];
      }
      return prev;
    });
  }, []);

  const setTotalActivities = useCallback((total: number) => {
    setTotalActivitiesState(total);
  }, []);

  const unlockBadge = useCallback((badgeId: string) => {
    setBadges((prev) => {
      if (!prev.includes(badgeId)) {
        return [...prev, badgeId];
      }
      return prev;
    });
  }, []);

  return (
    <LessonContext.Provider
      value={{
        currentXP,
        streak,
        progress,
        completedActivities,
        totalActivities,
        badges,
        addXP,
        incrementStreak,
        resetStreak,
        markActivityCompleted,
        setTotalActivities,
        unlockBadge,
      }}
    >
      {children}
    </LessonContext.Provider>
  );
}

export function useLesson() {
  const context = useContext(LessonContext);
  if (context === undefined) {
    throw new Error("useLesson must be used within a LessonProvider");
  }
  return context;
}
