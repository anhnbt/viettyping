export interface Topic {
  id: string;
  title: string;
  description: string;
  content: string;
  activities: Activity[];
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: number; // phút
}

export interface Activity {
  id: string;
  type:
  | 'typing'
  | 'quiz'
  | 'drawing'
  | 'listening'
  | 'reading'
  | 'math'
  | 'game';
  title: string;
  content: string;
  instructions: string;
  targetScore?: number;
  timeLimit?: number; // giây
  options?: string[];
  correctAnswer?: string;
  imageUrl?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
}

export interface Subject {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  topics: Topic[];
  grade?: string; // lớp học
  thumbnailUrl?: string; // ảnh bìa môn học
}
