export type BadgeTier = 'seedling' | 'bronze' | 'silver' | 'gold' | 'rainbow';

export type BadgeCategory = 'speed' | 'accuracy' | 'streak' | 'game' | 'milestone';

export interface Badge {
  id: string;
  name: string;
  title: string;
  category: BadgeCategory;
  tier: BadgeTier;
  emoji: string;
  desc: string;
  voicePrompt: string; // Nội dung câu nói động viên tiếng Việt
  audioFile?: string;  // Đường dẫn file wav/mp3 trong /public/audio
  wpmRequirement?: number;
  accuracyRequirement?: number;
  color: string;       // Tailwind color classes cho border/bg/text
}
