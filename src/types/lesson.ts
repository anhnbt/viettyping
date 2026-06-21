// src/types/lesson.ts

import { Activity } from "./subject";

// --- Traditional Typing Lesson Interface ---
export interface Lesson {
  id: string;
  level: 'basic' | 'intermediate' | 'advanced';
  title: string;
  description: string;
  content: string;
  targetWPM: number;
  minAccuracy: number;
}

// --- Mini Games Interfaces ---

export interface MatchingGameItem {
  id: string;
  type: 'matching_game';
  items: { word: string; image_prompt: string; image_url?: string }[];
}

export interface TrueFalseItem {
  id: string;
  type: 'true_false_game';
  items: { correct_word: string; distractor_word: string; image_prompt: string }[];
}

export interface SpinWheelItem {
  id: string;
  type: 'spin_wheel_items';
  items: string[];
}

export interface FillInTheBlankItem {
  id: string;
  type: 'fill_in_the_blank';
  items: { full_word: string; missing_char: string; sentence: string }[];
}

export interface MultipleChoiceItem {
  id: string;
  type: 'multiple_choice';
  items: { question: string; correct_answer: string; distractors: string[] }[];
}

export interface RealWorldMathGameItem {
  id: string;
  type: 'math_realworld_dragdrop';
  items: { 
    question: string; 
    targetNum: number; 
    itemType: 'apple' | 'candy' | 'coin'; 
    sentence: string;
    targetsCount?: number;
    targetNames?: string[];
  }[];
}

export interface ColoringCanvasItem {
  id: string;
  type: 'drawing_coloring_canvas';
  items: { outlineSvgName: string; title: string; targetCoveragePercent: number }[];
}

export interface TraditionalActivityItem {
  id: string;
  type: 'traditional_activity';
  activity: Activity;
}

export interface MousePracticeItem {
  id: string;
  type: 'mouse_practice';
}

export type MiniGameConfig = 
  | MatchingGameItem 
  | TrueFalseItem 
  | SpinWheelItem 
  | FillInTheBlankItem 
  | MultipleChoiceItem
  | RealWorldMathGameItem
  | ColoringCanvasItem
  | TraditionalActivityItem
  | MousePracticeItem;

// --- Lesson Config Interfaces ---

export interface Flashcard {
  word: string;
  word_uppercase: string;
  spelling_guide: string;
  example_sentence: string;
  image_prompt: string;
  image_url: string;
}

export interface TypingPractice {
  content: string;
  type: 'word' | 'sentence';
  description: string;
  time_limit_seconds: number;
}

export interface BaseRewards {
  completion_xp: number;
  badge_unlock_id: string;
  badge_name_vi: string;
  celebration_type: string;
}

export interface LessonConfig {
  lesson_title: string;
  topic: string;
  flashcards: Flashcard[];
  typing_practice: TypingPractice[];
  summary_config: {
    show_typing_summary: boolean;
    celebration_message: string;
  };
  mini_games: MiniGameConfig[];
  base_rewards: BaseRewards;
}

// --- Unified Game Seam & Telemetry Interfaces ---

export interface TelemetryPayload {
  score: number;
  durationSeconds: number;
  errors?: Array<{
    questionId: string;
    userAnswer: string;
    correctAnswer: string;
  }>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: Record<string, any>;
}

export interface GameAdapterProps<T> {
  gameConfig: T;
  flashcards?: Flashcard[];
  onComplete: (telemetry: TelemetryPayload) => void;
  onProgressUpdate?: (percent: number) => void;
}

export type LessonStep = "flashcards" | "typing_practice" | "mini_games" | "summary";

export interface ActivityResult {
  activityId: string;
  type: "flashcards" | "typing_practice" | "mini_game";
  score: number;
  durationSeconds: number;
  passed: boolean;
  errors?: Array<{
    questionId: string;
    userAnswer: string;
    correctAnswer: string;
  }>;
}

export interface LessonSummary {
  totalScore: number;
  totalDuration: number;
  activityResults: ActivityResult[];
}


