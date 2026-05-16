"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { IoChevronBack, IoStar, IoCheckmarkCircle, IoRibbon } from "react-icons/io5";
import confetti from "canvas-confetti";
import lessonData from "@/data/sample_lesson.json";
import { useLesson } from "@/contexts/LessonContext";
import ProgressBar from "@/components/ProgressBar";
import MatchingGame from "@/components/MatchingGame";
import TrueFalseGame from "@/components/TrueFalseGame";
import SpinWheelGame from "@/components/SpinWheelGame";
import FillInTheBlankGame from "@/components/FillInTheBlankGame";
import MultipleChoiceGame from "@/components/MultipleChoiceGame";

export default function GameController() {
  const { mini_games, base_rewards } = lessonData;
  const gameTypes = Object.keys(mini_games); // e.g. ["matching_game", "true_false_game", ...]
  const [currentGameIndex, setCurrentGameIndex] = useState(0);
  const [showCompletionPopup, setShowCompletionPopup] = useState(false);
  const router = useRouter();

  const { currentXP, progress, addXP, markActivityCompleted, unlockBadge } = useLesson();

  const currentGameType = gameTypes[currentGameIndex];

  const handleGameComplete = () => {
    // Phân bổ XP (tùy chỉnh sau nếu muốn từng game có điểm riêng)
    const xpPerGame = Math.round(base_rewards.completion_xp / gameTypes.length);
    addXP(xpPerGame);
    markActivityCompleted(currentGameType);

    if (currentGameIndex < gameTypes.length - 1) {
      setCurrentGameIndex((prev) => prev + 1);
    } else {
      // Hoàn thành tất cả mini games
      // 1. Confetti
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff']
      });

      // 2. Play Cheer Sound
      try {
        const cheerAudio = new Audio('/cheer.mp3');
        cheerAudio.volume = 0.5;
        cheerAudio.play().catch(e => console.warn("Audio play failed:", e));
      } catch (error) {
        console.warn("Audio not supported", error);
      }

      // 3. Unlock Badge
      unlockBadge(base_rewards.badge_unlock_id);

      // 4. Show Popup
      setShowCompletionPopup(true);
    }
  };

  const handleFinishLesson = () => {
    setShowCompletionPopup(false);
    router.push("/");
  };

  const renderCurrentGame = () => {
    switch (currentGameType) {
      case "matching_game": {
        const matchingGameItems = mini_games.matching_game.map((item: { word: string }) => {
          const flashcard = lessonData.flashcards.find((f) => f.word === item.word);
          return {
            word: item.word,
            image_url: flashcard?.image_url || "/assets/placeholder.png",
          };
        });
        return <MatchingGame items={matchingGameItems} onComplete={handleGameComplete} />;
      }
      case "true_false_game": {
        const tfItems = mini_games.true_false_game.map((item: { correct_word: string, distractor_word: string }) => {
          const flashcard = lessonData.flashcards.find((f) => f.word === item.correct_word);
          return {
            correct_word: item.correct_word,
            distractor_word: item.distractor_word,
            image_url: flashcard?.image_url || "/assets/placeholder.png",
          };
        });
        return <TrueFalseGame items={tfItems} onComplete={handleGameComplete} />;
      }
      case "spin_wheel_items": {
        const spinItems = mini_games.spin_wheel_items as string[];
        return <SpinWheelGame items={spinItems} onComplete={handleGameComplete} />;
      }
      case "fill_in_the_blank": {
        const fillBlankItems = mini_games.fill_in_the_blank.map((item: { full_word: string, missing_char: string, sentence: string }) => ({
          full_word: item.full_word,
          missing_char: item.missing_char,
          sentence: item.sentence
        }));
        return <FillInTheBlankGame items={fillBlankItems} onComplete={handleGameComplete} />;
      }
      case "multiple_choice": {
        const mcItems = mini_games.multiple_choice.map((item: { question: string, correct_answer: string, distractors: string[] }) => ({
          question: item.question,
          correct_answer: item.correct_answer,
          distractors: item.distractors
        }));
        return <MultipleChoiceGame items={mcItems} onComplete={handleGameComplete} />;
      }
      default:
        return (
          <>
            <p className="text-gray-600 mb-8 text-lg">
              (Giao diện game cụ thể sẽ được hiện thực ở các task sau)
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGameComplete}
              className="bg-green-500 hover:bg-green-400 text-white font-black text-xl px-8 py-4 rounded-full shadow-[0_6px_0_0_#166534] hover:shadow-[0_3px_0_0_#166534] hover:translate-y-1 transition-all flex items-center gap-2 active:shadow-none active:translate-y-2"
            >
              <IoCheckmarkCircle size={28} />
              Hoàn Thành Game Này!
            </motion.button>
          </>
        );
    }
  };

  // Convert progress sang string format `w-[x%]` thì Tailwind không support dynamic kiểu width-${progress}%. 
  // Cách tốt nhất là dùng style={{ width: `${progress}%` }} cho motion.div

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 font-sans overflow-hidden flex flex-col">
      {/* Header with Progress Bar */}
      <header className="p-4 md:p-6 flex flex-col gap-4 relative z-10">
        <div className="flex items-center justify-between">
          <Link
            href="/lesson"
            className="flex items-center gap-2 bg-white/70 backdrop-blur-md px-4 py-2 rounded-2xl text-purple-700 font-bold hover:bg-white/90 transition-all shadow-sm"
          >
            <IoChevronBack size={24} />
            Quay lại
          </Link>
          <div className="flex items-center gap-2 bg-white/70 backdrop-blur-md px-4 py-2 rounded-2xl shadow-sm">
            <IoStar className="text-yellow-400 text-2xl" />
            <span className="font-black text-purple-700 text-xl">{currentXP} XP</span>
          </div>
        </div>

        {/* Progress Bar */}
        <ProgressBar progress={progress} />
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentGameType}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-4xl bg-white/80 backdrop-blur-md rounded-3xl shadow-xl p-8 flex flex-col items-center min-h-[400px] justify-center text-center"
          >
            <h2 className="text-3xl font-black text-purple-700 mb-6 capitalize">
              Đang chơi: {currentGameType.replace(/_/g, " ")}
            </h2>
            
            {renderCurrentGame()}
          </motion.div>
        </AnimatePresence>
      </main>
      
      {/* Background Decor */}
      <div className="fixed top-20 left-10 w-32 h-32 bg-yellow-300/30 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-20 right-10 w-48 h-48 bg-pink-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl pointer-events-none" />

      {/* Completion Popup */}
      <AnimatePresence>
        {showCompletionPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: 50 }}
              transition={{ type: "spring", bounce: 0.5 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl border-4 border-yellow-400 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-yellow-200/50 to-transparent pointer-events-none" />
              
              <motion.div 
                initial={{ rotate: -180, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="mx-auto w-24 h-24 bg-gradient-to-tr from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-yellow-400/40"
              >
                <IoRibbon className="text-white text-5xl" />
              </motion.div>

              <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500 mb-2">
                Hoàn thành xuất sắc!
              </h2>
              
              <p className="text-gray-600 mb-6 font-medium">
                Bạn nhận được Huy hiệu:<br/>
                <span className="text-xl font-bold text-purple-600 block mt-2">
                  {base_rewards.badge_name_vi}
                </span>
              </p>

              <div className="bg-purple-50 rounded-2xl p-4 mb-6">
                <div className="text-sm text-purple-600 font-bold mb-1">Phần thưởng XP</div>
                <div className="text-3xl font-black text-purple-700">+{base_rewards.completion_xp} XP</div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleFinishLesson}
                className="w-full bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white font-black text-xl px-8 py-4 rounded-2xl shadow-[0_6px_0_0_#065f46] hover:shadow-[0_3px_0_0_#065f46] transition-all hover:translate-y-1 active:shadow-none active:translate-y-2"
              >
                Tuyệt vời!
              </motion.button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
