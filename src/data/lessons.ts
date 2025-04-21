export interface Lesson {
  id: string;
  level: 'basic' | 'intermediate' | 'advanced';
  title: string;
  description: string;
  content: string;
  targetWPM: number;
  minAccuracy: number;
}

export const lessons: Lesson[] = [
  {
    id: 'basic-1',
    level: 'basic',
    title: 'Các phím cơ bản - Hàng giữa',
    description: 'Tập gõ các phím ở hàng giữa: A S D F G H J K L',
    content: 'asdf fdsa jkl; ;lkj asdf jkl; fdsa ;lkj',
    targetWPM: 20,
    minAccuracy: 90,
  },
  {
    id: 'basic-2',
    level: 'basic',
    title: 'Dấu tiếng Việt cơ bản',
    description: 'Luyện gõ các dấu cơ bản trong tiếng Việt',
    content: 'á à ả ã ạ ấ ầ ẩ ẫ ậ ắ ằ ẳ ẵ ặ',
    targetWPM: 15,
    minAccuracy: 85,
  },
  {
    id: 'intermediate-1',
    level: 'intermediate',
    title: 'Từ đơn tiếng Việt',
    description: 'Luyện gõ các từ đơn tiếng Việt thông dụng',
    content: 'nhà cửa xe đạp học sinh công việc bánh mì',
    targetWPM: 30,
    minAccuracy: 90,
  },
  {
    id: 'advanced-1',
    level: 'advanced',
    title: 'Câu văn hoàn chỉnh',
    description: 'Luyện gõ các câu văn tiếng Việt hoàn chỉnh',
    content: 'Hôm nay trời đẹp quá. Tôi thích đi dạo trong công viên vào buổi sáng sớm.',
    targetWPM: 45,
    minAccuracy: 95,
  },
];
