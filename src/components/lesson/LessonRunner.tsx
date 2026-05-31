import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LessonConfig } from "@/types/lesson";
import MatchingGame from "@/components/MatchingGame";
import TrueFalseGame from "@/components/TrueFalseGame";
import SpinWheelGame from "@/components/SpinWheelGame";
import FillInTheBlankGame from "@/components/FillInTheBlankGame";
import MultipleChoiceGame from "@/components/MultipleChoiceGame";
import { IoCheckmarkCircle } from "react-icons/io5";

export interface LessonRunnerProps {
  config: LessonConfig;
  onGameComplete?: (gameId: string, score: number, duration: number) => void;
  onAllGamesComplete: (summary: {
    totalScore: number;
    totalDuration: number;
    gameResults: Array<{ gameId: string; passed: boolean }>;
  }) => void;
  initialGameIndex?: number;
}

export default function LessonRunner({
  config,
  onGameComplete,
  onAllGamesComplete,
  initialGameIndex = 0,
}: LessonRunnerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialGameIndex);
  const [gameStartTime, setGameStartTime] = useState(Date.now());
  const [gameResults, setGameResults] = useState<Array<{ gameId: string; passed: boolean }>>([]);
  
  const { mini_games, flashcards } = config;
  const currentGame = mini_games[currentIndex];

  useEffect(() => {
    // Reset timer when game changes
    setGameStartTime(Date.now());
  }, [currentIndex]);

  const handleCurrentGameComplete = () => {
    const duration = Math.round((Date.now() - gameStartTime) / 1000);
    const score = 100; // Mock score per game for now
    
    if (onGameComplete && currentGame) {
      onGameComplete(currentGame.id, score, duration);
    }

    if (!currentGame) return;

    const newResults = [...gameResults, { gameId: currentGame.id, passed: true }];
    setGameResults(newResults);

    if (currentIndex < mini_games.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      onAllGamesComplete({
        totalScore: newResults.length * score,
        totalDuration: duration,
        gameResults: newResults,
      });
    }
  };

  const renderCurrentGame = () => {
    if (!currentGame) return null;

    switch (currentGame.type) {
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
            onComplete={(telemetry) => handleCurrentGameComplete()}
          />
        );
      }
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
          items: tfItems
        };

        return (
          <TrueFalseGame
            gameConfig={tfConfig}
            onComplete={(telemetry) => {
              console.log("[TrueFalseGame Telemetry]:", telemetry);
              handleCurrentGameComplete();
            }}
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
            flashcards={flashcards}
            onComplete={(telemetry) => handleCurrentGameComplete()}
          />
        );
      }
      case "fill_in_the_blank": {
        const fillBlankItems = currentGame.items.map((item) => ({
          full_word: item.full_word,
          missing_char: item.missing_char,
          sentence: item.sentence
        }));
        const fillConfig = {
          id: currentGame.id,
          items: fillBlankItems,
        };
        return (
          <FillInTheBlankGame
            gameConfig={fillConfig}
            onComplete={(telemetry) => handleCurrentGameComplete()}
          />
        );
      }
      case "multiple_choice": {
        const mcItems = currentGame.items.map((item) => ({
          question: item.question,
          correct_answer: item.correct_answer,
          distractors: item.distractors
        }));
        const mcConfig = {
          id: currentGame.id,
          items: mcItems,
        };
        return (
          <MultipleChoiceGame
            gameConfig={mcConfig}
            flashcards={flashcards}
            onComplete={(telemetry) => handleCurrentGameComplete()}
          />
        );
      }
      default:
        return (
          <>
            <p className="text-gray-600 mb-8 text-lg">
              (Giao diện game này chưa được hỗ trợ)
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCurrentGameComplete}
              className="bg-green-500 hover:bg-green-400 text-white font-black text-xl px-8 py-4 rounded-full shadow-[0_6px_0_0_#166534] hover:shadow-[0_3px_0_0_#166534] hover:translate-y-1 transition-all flex items-center gap-2"
            >
              <IoCheckmarkCircle size={28} />
              Hoàn Thành Game Này!
            </motion.button>
          </>
        );
    }
  };

  const formattedType = currentGame ? currentGame.type.replace(/_/g, " ") : "";

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentGame?.id || currentIndex}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.2 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-4xl bg-white/80 backdrop-blur-md rounded-3xl shadow-xl p-8 flex flex-col items-center min-h-[400px] justify-center text-center"
      >
        <h2 className="text-3xl font-black text-purple-700 mb-6 capitalize">
          Đang chơi: {formattedType}
        </h2>
        
        {renderCurrentGame()}
      </motion.div>
    </AnimatePresence>
  );
}
