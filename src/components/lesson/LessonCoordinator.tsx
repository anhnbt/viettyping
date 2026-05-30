"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { IoChevronBack, IoChevronForward, IoPlay, IoRibbon, IoWalkOutline, IoMusicalNotesOutline, IoTimeOutline } from "react-icons/io5";
import { LessonConfig, LessonStep, ActivityResult, LessonSummary, TelemetryPayload, MiniGameConfig } from "@/types/lesson";
import Flashcard from "@/components/Flashcard";
import ProgressBar from "@/components/ProgressBar";
import TrueFalseGame from "@/components/TrueFalseGame";
import MatchingGame from "@/components/MatchingGame";
import SpinWheelGame from "@/components/SpinWheelGame";
import FillInTheBlankGame from "@/components/FillInTheBlankGame";
import MultipleChoiceGame from "@/components/MultipleChoiceGame";
import TypingPractice from "@/components/TypingPractice";
import RealWorldMathGame from "@/components/RealWorldMathGame";
import ColoringCanvas from "@/components/ColoringCanvas";

export interface LessonCoordinatorProps {
  config: LessonConfig;
  onActivityComplete?: (activityId: string, telemetry: TelemetryPayload) => void;
  onAllActivitiesComplete: (summary: LessonSummary) => void;
  initialStep?: LessonStep;
}

export default function LessonCoordinator({
  config,
  onActivityComplete,
  onAllActivitiesComplete,
  initialStep = "flashcards",
}: LessonCoordinatorProps) {
  const [step, setStep] = useState<LessonStep>(initialStep);
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [typingPracticeIndex, setTypingPracticeIndex] = useState(0);
  const [gameIndex, setGameIndex] = useState(0);
  const [results, setResults] = useState<ActivityResult[]>([]);

  // Pomodoro & Focus Mode states
  const [pomodoroState, setPomodoroState] = useState<"FOCUS" | "BREAK">("FOCUS");
  const [pomodoroTimeLeft, setPomodoroTimeLeft] = useState(0);
  const [focusProgress, setFocusProgress] = useState(0); // seed growth progress (0 to 100)
  const [idleTime, setIdleTime] = useState(0);
  const [showIdleReminder, setShowIdleReminder] = useState(false);
  const [breakType, setBreakType] = useState<"stretch" | "music">("stretch");

  const pomodoroIntervalRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Timers for tracking duration
  const stepStartTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    // Reset timer whenever step changes
    stepStartTimeRef.current = Date.now();
  }, [step, gameIndex, typingPracticeIndex]);

  useEffect(() => {
    const isDev = typeof window !== 'undefined' && window.location.search.includes('dev');
    const FOCUS_LIMIT = isDev ? 15 : 15 * 60;
    const BREAK_LIMIT = isDev ? 5 : 3 * 60;

    if (pomodoroTimeLeft === 0) {
      setPomodoroTimeLeft(pomodoroState === "FOCUS" ? FOCUS_LIMIT : BREAK_LIMIT);
    }

    // Activity tracking for idle reminder
    const resetIdle = () => {
      setIdleTime(0);
      setShowIdleReminder(false);
    };

    window.addEventListener("mousemove", resetIdle);
    window.addEventListener("keydown", resetIdle);
    window.addEventListener("click", resetIdle);
    window.addEventListener("touchstart", resetIdle);

    // Idle Checker Interval
    const idleInterval = setInterval(() => {
      if (pomodoroState === "FOCUS") {
        setIdleTime((prev) => {
          if (prev >= 30) {
            setShowIdleReminder(true);
          }
          return prev + 1;
        });
      }
    }, 1000);

    // Pomodoro Timer Interval
    pomodoroIntervalRef.current = setInterval(() => {
      setPomodoroTimeLeft((prev) => {
        if (pomodoroState === "FOCUS") {
          const progress = ((FOCUS_LIMIT - prev) / FOCUS_LIMIT) * 100;
          setFocusProgress(progress);

          if (prev <= 1) {
            setPomodoroState("BREAK");
            setBreakType(Math.random() > 0.5 ? "stretch" : "music");
            try {
              const audio = new Audio('/ting.mp3');
              audio.play().catch(() => {});
            } catch {}
            return BREAK_LIMIT;
          }
          return prev - 1;
        } else {
          if (prev <= 1) {
            setPomodoroState("FOCUS");
            setFocusProgress(0);
            try {
              const audio = new Audio('/ting.mp3');
              audio.play().catch(() => {});
            } catch {}
            return FOCUS_LIMIT;
          }
          return prev - 1;
        }
      });
    }, 1000);

    return () => {
      window.removeEventListener("mousemove", resetIdle);
      window.removeEventListener("keydown", resetIdle);
      window.removeEventListener("click", resetIdle);
      window.removeEventListener("touchstart", resetIdle);
      clearInterval(idleInterval);
      clearInterval(pomodoroIntervalRef.current);
    };
  }, [pomodoroState]);

  const { flashcards, typing_practice, mini_games } = config;
  const totalActivities = 1 + (typing_practice?.length || 0) + (mini_games?.length || 0);

  // 1. Calculate overall progress percentage
  let progressPercent = 0;
  if (step === "flashcards") {
    const fcCount = flashcards?.length || 1;
    progressPercent = (flashcardIndex / fcCount) * (1 / totalActivities) * 100;
  } else if (step === "typing_practice") {
    progressPercent = ((1 + typingPracticeIndex) / totalActivities) * 100;
  } else if (step === "mini_games") {
    progressPercent = ((1 + (typing_practice?.length || 0) + gameIndex) / totalActivities) * 100;
  } else if (step === "summary") {
    progressPercent = 100;
  }

  // 2. Handle completing Flashcards step
  const handleFlashcardsComplete = () => {
    const duration = Math.round((Date.now() - stepStartTimeRef.current) / 1000);
    
    // Save flashcard step result
    const flashcardResult: ActivityResult = {
      activityId: "flashcards",
      type: "flashcards",
      score: 100, // Watching flashcards awards max score
      durationSeconds: duration,
      passed: true,
    };

    const updatedResults = [...results, flashcardResult];
    setResults(updatedResults);

    if (onActivityComplete) {
      onActivityComplete("flashcards", {
        score: 100,
        durationSeconds: duration,
      });
    }

    // Go to typing practice if available, otherwise mini games, otherwise summary
    if (typing_practice && typing_practice.length > 0) {
      setStep("typing_practice");
      setTypingPracticeIndex(0);
    } else if (mini_games && mini_games.length > 0) {
      setStep("mini_games");
      setGameIndex(0);
    } else {
      setStep("summary");
      triggerAllActivitiesComplete(updatedResults);
    }
  };

  // 2b. Handle completing typing practice step
  const handleTypingComplete = (telemetry: TelemetryPayload) => {
    const typingResult: ActivityResult = {
      activityId: `typing_${typingPracticeIndex}`,
      type: "typing_practice",
      score: telemetry.score,
      durationSeconds: telemetry.durationSeconds,
      passed: telemetry.score >= 50,
      errors: telemetry.errors,
    };

    const updatedResults = [...results, typingResult];
    setResults(updatedResults);

    if (onActivityComplete) {
      onActivityComplete(`typing_${typingPracticeIndex}`, telemetry);
    }

    if (typing_practice && typingPracticeIndex < typing_practice.length - 1) {
      setTypingPracticeIndex((prev) => prev + 1);
    } else if (mini_games && mini_games.length > 0) {
      setStep("mini_games");
      setGameIndex(0);
    } else {
      setStep("summary");
      triggerAllActivitiesComplete(updatedResults);
    }
  };

  // 3. Handle completing an individual game
  const handleGameComplete = (gameId: string, telemetry: TelemetryPayload) => {
    const gameResult: ActivityResult = {
      activityId: gameId,
      type: "mini_game",
      score: telemetry.score,
      durationSeconds: telemetry.durationSeconds,
      passed: telemetry.score >= 50,
      errors: telemetry.errors,
    };

    const updatedResults = [...results, gameResult];
    setResults(updatedResults);

    if (onActivityComplete) {
      onActivityComplete(gameId, telemetry);
    }

    if (gameIndex < mini_games.length - 1) {
      setGameIndex((prev) => prev + 1);
    } else {
      setStep("summary");
      triggerAllActivitiesComplete(updatedResults);
    }
  };

  // Helper to calculate total summary and trigger callback
  const triggerAllActivitiesComplete = (finalResults: ActivityResult[]) => {
    const totalScore = finalResults.reduce((sum, r) => sum + r.score, 0);
    const totalDuration = finalResults.reduce((sum, r) => sum + r.durationSeconds, 0);

    onAllActivitiesComplete({
      totalScore,
      totalDuration,
      activityResults: finalResults,
    });
  };

  // Render components according to step
  const renderContent = () => {
    switch (step) {
      case "flashcards": {
        if (!flashcards || flashcards.length === 0) {
          return (
            <div className="text-center p-8 bg-white/80 rounded-3xl shadow-xl">
              <p className="text-gray-500 font-bold">Không có thẻ flashcard nào.</p>
              <button
                onClick={handleFlashcardsComplete}
                className="mt-4 bg-purple-600 text-white font-bold px-6 py-3 rounded-full"
              >
                Tiếp tục
              </button>
            </div>
          );
        }

        const currentFc = flashcards[flashcardIndex];

        return (
          <motion.div
            key={`flashcard-${flashcardIndex}`}
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -50, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="w-full flex flex-col items-center"
          >
            <div className="w-80 h-[380px] md:h-[420px] mb-8">
              <Flashcard
                word={currentFc.word}
                wordUppercase={currentFc.word_uppercase}
                spellingGuide={currentFc.spelling_guide}
                exampleSentence={currentFc.example_sentence}
                imagePrompt={currentFc.image_prompt}
                imageUrl={currentFc.image_url}
              />
            </div>

            {/* Flashcard Navigation */}
            <div className="flex items-center gap-6 bg-white/80 backdrop-blur-md px-6 py-3 rounded-full shadow-lg border border-purple-100">
              <motion.button
                data-testid="prev-fc-btn"
                whileHover={{ scale: flashcardIndex > 0 ? 1.1 : 1 }}
                whileTap={{ scale: flashcardIndex > 0 ? 0.9 : 1 }}
                onClick={() => flashcardIndex > 0 && setFlashcardIndex((prev) => prev - 1)}
                disabled={flashcardIndex === 0}
                className={`w-12 h-12 rounded-full flex items-center justify-center text-purple-600 transition-all ${
                  flashcardIndex === 0
                    ? "opacity-30 cursor-not-allowed bg-gray-100"
                    : "bg-purple-100 hover:bg-purple-200"
                }`}
              >
                <IoChevronBack size={24} />
              </motion.button>

              <span className="font-black text-purple-700 text-xl tracking-wider min-w-[60px] text-center">
                {flashcardIndex + 1} / {flashcards.length}
              </span>

              {flashcardIndex < flashcards.length - 1 ? (
                <motion.button
                  data-testid="next-fc-btn"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setFlashcardIndex((prev) => prev + 1)}
                  className="w-12 h-12 bg-purple-100 hover:bg-purple-200 rounded-full flex items-center justify-center text-purple-600 transition-all"
                >
                  <IoChevronForward size={24} />
                </motion.button>
              ) : (
                <motion.button
                  data-testid="play-game-btn"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleFlashcardsComplete}
                  className="bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white font-black px-6 py-3 rounded-full flex items-center gap-2 shadow-md shadow-emerald-200"
                >
                  <IoPlay size={20} />
                  Chơi game!
                </motion.button>
              )}
            </div>
          </motion.div>
        );
      }

      case "typing_practice": {
        if (!typing_practice || typing_practice.length === 0) {
          return null;
        }

        const currentTask = typing_practice[typingPracticeIndex];

        return (
          <motion.div
            key={`typing-${typingPracticeIndex}`}
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -30 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-4xl bg-white/80 backdrop-blur-md rounded-3xl shadow-xl p-6 md:p-8 flex flex-col items-center min-h-[500px] justify-center text-center border border-white/40"
          >
            <h2 className="text-2xl md:text-3xl font-black text-purple-700 mb-2 capitalize tracking-wide">
              Luyện gõ: {currentTask.type === "word" ? "Từ vựng" : "Câu"}
            </h2>
            <p className="text-lg text-purple-600 mb-6 font-medium bg-purple-100 px-4 py-1 rounded-full">
              {currentTask.description}
            </p>
            
            <div className="w-full flex-1">
              <TypingPractice
                task={currentTask}
                onComplete={handleTypingComplete}
              />
            </div>
          </motion.div>
        );
      }

      case "mini_games": {
        const currentGame = mini_games[gameIndex];
        if (!currentGame) return null;

        // Render appropriate game
        const renderGame = () => {
          switch (currentGame.type) {
            case "true_false_game": {
              const tfItems = currentGame.items.map((item) => {
                const flashcard = flashcards.find((f) => f.word === item.correct_word);
                return {
                  correct_word: item.correct_word,
                  distractor_word: item.distractor_word,
                  image_url: flashcard?.image_url || "/assets/placeholder.png",
                };
              });

              const tfConfig = {
                id: currentGame.id,
                items: tfItems,
              };

              return (
                <TrueFalseGame
                  gameConfig={tfConfig}
                  onComplete={(telemetry) => handleGameComplete(currentGame.id, telemetry)}
                />
              );
            }

            case "matching_game": {
              const matchingGameItems = currentGame.items.map((item) => {
                const flashcard = flashcards.find((f) => f.word === item.word);
                return {
                  word: item.word,
                  image_url: flashcard?.image_url || "/assets/placeholder.png",
                };
              });
              const matchingConfig = {
                id: currentGame.id,
                items: matchingGameItems,
              };
              return (
                <MatchingGame
                  gameConfig={matchingConfig}
                  onComplete={(telemetry) => handleGameComplete(currentGame.id, telemetry)}
                />
              );
            }

            case "spin_wheel_items": {
              const spinConfig = {
                id: currentGame.id,
                items: currentGame.items,
              };
              return (
                <SpinWheelGame
                  gameConfig={spinConfig}
                  onComplete={(telemetry) => handleGameComplete(currentGame.id, telemetry)}
                />
              );
            }

            case "fill_in_the_blank": {
              const fillBlankItems = currentGame.items.map((item) => ({
                full_word: item.full_word,
                missing_char: item.missing_char,
                sentence: item.sentence,
              }));
              const fillConfig = {
                id: currentGame.id,
                items: fillBlankItems,
              };
              return (
                <FillInTheBlankGame
                  gameConfig={fillConfig}
                  onComplete={(telemetry) => handleGameComplete(currentGame.id, telemetry)}
                />
              );
            }

            case "multiple_choice": {
              const mcItems = currentGame.items.map((item) => ({
                question: item.question,
                correct_answer: item.correct_answer,
                distractors: item.distractors,
              }));
              const mcConfig = {
                id: currentGame.id,
                items: mcItems,
              };
              return (
                <MultipleChoiceGame
                  gameConfig={mcConfig}
                  onComplete={(telemetry) => handleGameComplete(currentGame.id, telemetry)}
                />
              );
            }

            case "math_realworld_dragdrop": {
              return (
                <RealWorldMathGame
                  gameConfig={currentGame}
                  onComplete={(telemetry) => handleGameComplete(currentGame.id, telemetry)}
                />
              );
            }

            case "drawing_coloring_canvas": {
              return (
                <ColoringCanvas
                  gameConfig={currentGame}
                  onComplete={(telemetry) => handleGameComplete(currentGame.id, telemetry)}
                />
              );
            }

            default:
              return (
                <div className="text-center p-6 bg-white/85 rounded-3xl shadow-lg border border-purple-100 max-w-md w-full">
                  <p className="text-gray-600 mb-6 text-lg font-bold">
                    Trò chơi này chưa được hỗ trợ giao diện!
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      handleGameComplete((currentGame as MiniGameConfig).id, {
                        score: 100,
                        durationSeconds: Math.round((Date.now() - stepStartTimeRef.current) / 1000),
                      })
                    }
                    className="bg-purple-600 hover:bg-purple-700 text-white font-black text-lg px-8 py-3 rounded-full shadow-lg shadow-purple-200 transition-all"
                  >
                    Bỏ qua game này
                  </motion.button>
                </div>
              );
          }
        };

        const formattedType = currentGame.type.replace(/_/g, " ");

        return (
          <motion.div
            key={`game-${currentGame.id}`}
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -30 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-4xl bg-white/80 backdrop-blur-md rounded-3xl shadow-xl p-6 md:p-8 flex flex-col items-center min-h-[420px] justify-center text-center border border-white/40"
          >
            <h2 className="text-2xl md:text-3xl font-black text-purple-700 mb-6 capitalize tracking-wide">
              Trò chơi: {formattedType}
            </h2>
            {renderGame()}
          </motion.div>
        );
      }

      case "summary": {
        const totalScore = results.reduce((sum, r) => sum + r.score, 0);
        const totalDuration = results.reduce((sum, r) => sum + r.durationSeconds, 0);
        const completionXp = config.base_rewards?.completion_xp || 100;
        const badgeName = config.base_rewards?.badge_name_vi || "Huy hiệu xuất sắc";

        return (
          <motion.div
            key="summary"
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -100, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 80, damping: 12 }}
            className="bg-white/95 backdrop-blur-md rounded-3xl p-8 max-w-md w-full text-center shadow-2xl border-4 border-yellow-400 relative overflow-hidden"
          >
            {/* Background Sparkles / Decorative stars */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-yellow-200/40 to-transparent pointer-events-none" />
            
            {/* Celebration Icon with rotation and floating effects */}
            <motion.div
              initial={{ rotate: -180, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 100, damping: 10, delay: 0.2 }}
              className="mx-auto w-24 h-24 bg-gradient-to-tr from-yellow-400 via-orange-400 to-pink-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-yellow-400/40 relative"
            >
              <IoRibbon className="text-white text-5xl animate-pulse" />
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border-4 border-dashed border-white/30"
              />
            </motion.div>

            <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500 mb-2">
              Bé đã hoàn thành!
            </h2>
            <p className="text-gray-600 mb-6 font-bold text-lg">
              {config.summary_config?.celebration_message || "Chúc mừng bé yêu gõ chữ rất giỏi!"}
            </p>

            {/* Rewards Display (Badge & XP) */}
            <div className="flex flex-col gap-4 mb-6">
              {/* Badge reward */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-4 text-white shadow-md flex items-center gap-4 border border-purple-300/20"
              >
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-3xl">
                  🏆
                </div>
                <div className="text-left">
                  <div className="text-xs text-purple-200 font-bold uppercase tracking-wider">Huy hiệu mới</div>
                  <div className="text-lg font-black">{badgeName}</div>
                </div>
              </motion.div>

              {/* XP reward */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-yellow-50 rounded-2xl p-4 border border-yellow-200 flex items-center gap-4 shadow-sm"
              >
                <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center text-white text-2xl shadow-inner font-bold">
                  ★
                </div>
                <div className="text-left flex-1">
                  <div className="text-xs text-yellow-600 font-bold uppercase tracking-wider">Điểm kinh nghiệm</div>
                  <div className="text-2xl font-black text-yellow-700">+{completionXp} XP</div>
                </div>
              </motion.div>
            </div>

            {/* Performance Stats */}
            <div className="bg-purple-50 rounded-2xl p-5 mb-6 border border-purple-100 flex flex-col gap-3 text-sm">
              <div className="flex justify-between items-center text-purple-700 font-bold">
                <span>Tổng số hoạt động:</span>
                <span className="text-base font-black bg-purple-200/50 px-3 py-1 rounded-full">{results.length}</span>
              </div>
              <div className="flex justify-between items-center text-purple-700 font-bold">
                <span>Tổng số điểm đạt được:</span>
                <span className="text-base font-black text-yellow-700 bg-yellow-100/60 px-3 py-1 rounded-full">{totalScore} sao</span>
              </div>
              <div className="flex justify-between items-center text-purple-700 font-bold">
                <span>Thời gian học tập:</span>
                <span className="text-base font-black bg-purple-200/50 px-3 py-1 rounded-full">{totalDuration} giây</span>
              </div>
            </div>

            {/* Navigation Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/"
                className="w-full inline-block bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white font-black text-lg py-3 rounded-2xl shadow-[0_6px_0_0_#059669] hover:shadow-[0_3px_0_0_#059669] transition-all hover:translate-y-[3px] active:shadow-none active:translate-y-[6px]"
              >
                Tuyệt vời! Quay lại trang chủ
              </Link>
            </motion.div>

            <p className="text-xs text-gray-400 mt-4 italic">
              Chúc mừng bé đã học xong bài: {config.lesson_title}
            </p>
          </motion.div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div className="w-full flex flex-col items-center relative">
      <AnimatePresence>
        {pomodoroState === "BREAK" ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-purple-900/90 backdrop-blur-lg text-white p-6 text-center select-none"
          >
            <div className="max-w-md bg-white/10 backdrop-blur-md rounded-[40px] p-8 border border-white/20 shadow-2xl flex flex-col items-center">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-8xl mb-6"
              >
                {breakType === "stretch" ? "🧘‍♀️" : "🎵"}
              </motion.div>
              
              <h2 className="text-3xl font-black mb-3 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-400">
                {breakType === "stretch" ? "Bé ơi, giải lao giãn cơ nhé!" : "Bé ơi, hát cùng nhạc nhé!"}
              </h2>
              
              <p className="text-sm text-slate-100 font-bold mb-6">
                {breakType === "stretch" 
                  ? "Hãy đứng dậy vươn vai thật cao, quay cổ nhẹ nhàng và chớp mắt 5 lần để đôi mắt bé được nghỉ ngơi nhé!"
                  : "Lắng nghe giai điệu vui tai dưới đây, lẩm nhẩm hát theo để rèn luyện giọng hát đúng giai điệu của bé!"
                }
              </p>

              {breakType === "music" && (
                <div className="w-full bg-white/10 rounded-2xl p-4 mb-6 border border-white/10 flex items-center justify-center gap-3">
                  <span className="text-2xl animate-bounce">🎵</span>
                  <div className="text-left flex-1 text-xs">
                    <div className="font-bold text-yellow-300">Đồ - Rê - Mi - Pha - Son - La - Si</div>
                    <div className="text-slate-300 italic">Bé tập đọc nốt nhạc theo nhịp nhé!</div>
                  </div>
                  <IoMusicalNotesOutline className="text-2xl text-yellow-300 animate-pulse" />
                </div>
              )}

              {breakType === "stretch" && (
                <div className="w-full bg-white/10 rounded-2xl p-4 mb-6 border border-white/10 flex flex-wrap justify-center gap-4 text-xs font-bold">
                  <span className="bg-white/15 px-3 py-1.5 rounded-full flex items-center gap-1">🙆‍♂️ Vươn vai</span>
                  <span className="bg-white/15 px-3 py-1.5 rounded-full flex items-center gap-1">👀 Nhắm mắt</span>
                  <span className="bg-white/15 px-3 py-1.5 rounded-full flex items-center gap-1">🚶‍♂️ Đứng dậy</span>
                </div>
              )}

              <div className="flex items-center gap-2 text-base font-black text-yellow-300 bg-white/5 px-6 py-2.5 rounded-full border border-white/10">
                <IoTimeOutline className="text-xl animate-spin" />
                <span>Học tiếp sau: {pomodoroTimeLeft} giây</span>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Growing seed widget in FOCUS state */}
      {pomodoroState === "FOCUS" && (
        <div className="absolute right-4 top-0 md:right-10 flex items-center gap-2 bg-gradient-to-br from-emerald-50 to-green-50 px-3 py-1.5 rounded-2xl border border-green-200/50 shadow-sm z-10">
          <span className="text-xl animate-bounce">
            {focusProgress < 30 ? "🌱" : focusProgress < 65 ? "🌿" : focusProgress < 90 ? "🌸" : "🌳"}
          </span>
          <span className="text-[10px] font-black text-green-700">
            Cây tập trung: {Math.round(focusProgress)}%
          </span>
        </div>
      )}

      {/* Idle distraction overlay */}
      <AnimatePresence>
        {showIdleReminder && pomodoroState === "FOCUS" && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-4 right-4 z-45 bg-white/95 backdrop-blur-md border-2 border-purple-200 rounded-3xl p-4 shadow-xl max-w-[280px] flex items-center gap-3"
          >
            <span className="text-4xl animate-bounce">🐶</span>
            <div className="text-left">
              <h5 className="font-black text-purple-700 text-xs mb-0.5">Bé ơi, bé đâu rồi?</h5>
              <p className="text-[10px] text-slate-500 leading-tight">
                Hãy gõ phím hoặc chạm màn hình tiếp tục học để nhận sao lấp lánh nhé!
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ProgressBar at the top of the container */}
      <div className="w-full max-w-4xl mb-8">
        <ProgressBar progress={progressPercent} />
      </div>

      <div className="w-full flex justify-center">
        <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
      </div>
    </div>
  );
}
