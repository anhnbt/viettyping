// src/types/lesson.ts

// --- Mini Games Interfaces ---

export interface MatchingGameItem {
  id: string;
  type: 'matching_game';
  items: { word: string; image_prompt: string }[];
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

export type MiniGameConfig = 
  | MatchingGameItem 
  | TrueFalseItem 
  | SpinWheelItem 
  | FillInTheBlankItem 
  | MultipleChoiceItem;

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
