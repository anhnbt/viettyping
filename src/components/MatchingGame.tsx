"use client";

import React, { useState, useEffect } from "react";
import { 
  DndContext, 
  useDraggable, 
  useDroppable, 
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { GameAdapterProps, TelemetryPayload, MatchingGameItem } from "@/types/lesson";
import { useSound } from "@/contexts/SoundContext";

export interface MappedMatchingItem {
  word: string;
  image_url: string;
}

export interface MatchingGameConfig {
  id: string;
  items: MappedMatchingItem[];
}

// Draggable Component
function DraggableWord({ id, word }: { id: string; word: string }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id });

  const style = transform
    ? {
        transform: CSS.Translate.toString(transform),
        zIndex: isDragging ? 50 : 1,
        position: isDragging ? ("relative" as const) : ("static" as const),
        touchAction: "none", // Prevent scrolling when dragging on mobile
      }
    : { touchAction: "none" };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <motion.div
        whileHover={!isDragging ? { scale: 1.05 } : {}}
        whileTap={!isDragging ? { scale: 0.95 } : {}}
        className={`cursor-grab px-6 py-4 bg-white rounded-2xl shadow-lg border-b-4 border-purple-200 text-3xl font-black text-purple-700 select-none ${
          isDragging ? "shadow-2xl border-purple-400 opacity-90 scale-105 rotate-3" : ""
        }`}
      >
        {word}
      </motion.div>
    </div>
  );
}

const isEmoji = (url: string) => {
  if (!url) return false;
  return !url.includes('/') && !url.includes('.') && url.length < 10;
};

// Droppable Component
function DroppableSlot({
  id,
  imageUrl,
  isMatched,
  isError,
}: {
  id: string;
  imageUrl: string;
  isMatched: boolean;
  isError: boolean;
}) {
  const { isOver, setNodeRef } = useDroppable({ id });

  return (
    <motion.div
      ref={setNodeRef}
      animate={isError ? { x: [-10, 10, -10, 10, 0] } : {}}
      transition={{ duration: 0.4 }}
      className={`relative w-40 h-40 md:w-48 md:h-48 rounded-3xl border-4 flex flex-col items-center justify-center overflow-hidden transition-all ${
        isMatched
          ? "border-green-400 bg-green-50 shadow-[0_0_20px_rgba(74,222,128,0.4)]"
          : isOver
          ? "border-purple-400 bg-purple-50 scale-105"
          : isError
          ? "border-red-400 bg-red-50"
          : "border-dashed border-gray-300 bg-white/50"
      }`}
    >
      {imageUrl && (
        isEmoji(imageUrl) ? (
          <div className={`w-full h-full flex items-center justify-center text-6xl md:text-7xl select-none transition-opacity duration-300 ${
            isMatched ? "opacity-35" : "opacity-100"
          }`}>
            {imageUrl}
          </div>
        ) : (
          <Image
            src={imageUrl}
            alt="Slot"
            fill
            className={`object-contain p-2 ${
              isMatched ? "opacity-40" : "opacity-100"
            }`}
          />
        )
      )}
      
      {/* Hiển thị text đè lên ảnh khi đã match thành công */}
      {isMatched && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring" }}
          className="absolute z-10 text-4xl font-black text-green-600 drop-shadow-md bg-white/80 px-4 py-2 rounded-2xl"
        >
          {id}
        </motion.div>
      )}
    </motion.div>
  );
}

export default function MatchingGame({ gameConfig, flashcards = [], onComplete }: GameAdapterProps<MatchingGameItem>) {
  const { id: gameId, items: rawItems } = gameConfig;
  const { playSound } = useSound();
  const [matches, setMatches] = useState<Record<string, string>>({}); // Slot ID -> Word ID
  const [unmatchedWords, setUnmatchedWords] = useState<string[]>([]);
  const [errorSlot, setErrorSlot] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Map rawItems to include image_url from flashcards
  const items = React.useMemo(() => {
    return rawItems.map((item) => {
      const flashcard = flashcards.find((f) => f.word.toLowerCase() === item.word.toLowerCase());
      return {
        word: item.word,
        image_url: flashcard?.image_url || "/assets/placeholder.png",
      };
    });
  }, [rawItems, flashcards]);

  // Telemetry state
  const startTimeRef = React.useRef<number>(Date.now());
  const failedAttemptsRef = React.useRef<Set<string>>(new Set());
  const errorsRef = React.useRef<Array<{ questionId: string; userAnswer: string; correctAnswer: string }>>([]);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 5,
      },
    })
  );

  // Reset telemetry and shuffle words when game config changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setIsClient(true);
    startTimeRef.current = Date.now();
    failedAttemptsRef.current = new Set();
    errorsRef.current = [];
    setMatches({});
    const shuffled = [...items].sort(() => Math.random() - 0.5);
    setUnmatchedWords(shuffled.map((i) => i.word));
  }, [gameId]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over) {
      const activeIdStr = active.id as string;
      const overIdStr = over.id as string;

      if (activeIdStr === overIdStr) {
        // Nối đúng
        setMatches((prev) => ({ ...prev, [overIdStr]: activeIdStr }));
        setUnmatchedWords((prev) => prev.filter((w) => w !== activeIdStr));
        
        // Play correct sound
        playSound('coin');

        // Kiểm tra xem đã hoàn thành tất cả chưa
        if (unmatchedWords.length === 1) {
          // Add a small delay so user can see the final match effect before completing
          setTimeout(() => {
            const durationSeconds = Math.round((Date.now() - startTimeRef.current) / 1000);
            const totalQuestions = items.length;
            const correctFirstTry = totalQuestions - failedAttemptsRef.current.size;
            const score = Math.round((correctFirstTry / totalQuestions) * 100);

            const telemetry: TelemetryPayload = {
              score,
              durationSeconds,
              errors: errorsRef.current.length > 0 ? errorsRef.current : undefined,
            };
            onComplete(telemetry);
          }, 1000);
        }
      } else {
        // Nối sai
        setErrorSlot(overIdStr);
        
        // Record failed attempt for telemetry
        if (!failedAttemptsRef.current.has(overIdStr)) {
          failedAttemptsRef.current.add(overIdStr);
          errorsRef.current.push({
            questionId: `${gameId}_slot_${overIdStr}`,
            userAnswer: activeIdStr,
            correctAnswer: overIdStr,
          });
        }

        // Play error sound
        playSound('boing');

        setTimeout(() => setErrorSlot(null), 500);
      }
    }
  };

  if (!isClient) return null;

  return (
    <div className="w-full flex flex-col items-center gap-10">
      <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
        
        {/* Vùng Hình Ảnh (Droppable Slots) */}
        <div className="flex flex-wrap justify-center gap-6 md:gap-12 w-full">
          {items.map((item) => (
            <DroppableSlot
              key={item.word}
              id={item.word}
              imageUrl={item.image_url}
              isMatched={!!matches[item.word]}
              isError={errorSlot === item.word}
            />
          ))}
        </div>

        {/* Vùng Các Từ (Draggable Items) */}
        <div className="flex flex-wrap justify-center gap-4 min-h-[100px] p-6 bg-white/40 rounded-3xl backdrop-blur-sm border-2 border-white/50 w-full max-w-2xl">
          <AnimatePresence>
            {unmatchedWords.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-2xl font-bold text-green-500"
              >
                Tuyệt vời! Bạn đã ghép đúng hết! 🎉
              </motion.div>
            )}
            
            {unmatchedWords.map((word) => (
              <motion.div
                key={word}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                layout
              >
                <DraggableWord id={word} word={word} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </DndContext>
    </div>
  );
}
