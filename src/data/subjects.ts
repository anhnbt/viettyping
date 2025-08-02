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
}

export interface Subject {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  topics: Topic[];
  grade?: string; // lớp học
}

export const subjects: Subject[] = [
  {
    id: 'dao-duc',
    name: 'Đạo đức',
    description: 'Học về những giá trị đạo đức, phẩm chất tốt',
    icon: '❤️',
    color: 'from-red-400 to-red-600',
    grade: 'Lớp 1-5',
    topics: [
      {
        id: 'dao-duc-1',
        title: 'Yêu thương gia đình',
        description: 'Học cách yêu thương và tôn trọng gia đình',
        difficulty: 'easy',
        estimatedTime: 15,
        content:
          'Gia đình là nơi quan trọng nhất. Con cần yêu thương bố mẹ, anh chị em.',
        activities: [
          {
            id: 'dd-1-1',
            type: 'typing',
            title: 'Gõ từ về gia đình',
            content: 'bố mẹ gia đình yêu thương',
            instructions: 'Hãy gõ các từ về gia đình',
          },
          {
            id: 'dd-1-2',
            type: 'quiz',
            title: 'Câu hỏi về gia đình',
            content: 'Ai là người quan trọng nhất với con?',
            instructions: 'Chọn đáp án đúng',
          },
        ],
      },
      {
        id: 'dao-duc-2',
        title: 'Chăm sóc sức khỏe',
        description: 'Học cách giữ gìn sức khỏe',
        difficulty: 'easy',
        estimatedTime: 20,
        content:
          'Chăm sóc sức khỏe là việc rất quan trọng. Con cần ăn uống đủ chất, tập thể dục.',
        activities: [
          {
            id: 'dd-2-1',
            type: 'typing',
            title: 'Gõ từ về sức khỏe',
            content: 'sức khỏe ăn uống tập thể dục',
            instructions: 'Gõ các từ về chăm sóc sức khỏe',
          },
        ],
      },
    ],
  },
  {
    id: 'am-nhac',
    name: 'Âm nhạc',
    description: 'Học hát, nhạc cụ và cảm thụ âm nhạc',
    icon: '🎵',
    color: 'from-purple-400 to-purple-600',
    grade: 'Lớp 1-5',
    topics: [
      {
        id: 'am-nhac-1',
        title: 'Các nốt nhạc cơ bản',
        description: 'Học 7 nốt nhạc: Đồ Rê Mi Fa Sol La Si',
        difficulty: 'easy',
        estimatedTime: 25,
        content: 'Có 7 nốt nhạc cơ bản: Đồ, Rê, Mi, Fa, Sol, La, Si',
        activities: [
          {
            id: 'an-1-1',
            type: 'typing',
            title: 'Gõ tên các nốt nhạc',
            content: 'Đồ Rê Mi Fa Sol La Si',
            instructions: 'Gõ tên 7 nốt nhạc',
          },
          {
            id: 'an-1-2',
            type: 'listening',
            title: 'Nghe và nhận biết nốt nhạc',
            content: 'Nghe âm thanh và chọn nốt nhạc đúng',
            instructions: 'Lắng nghe và chọn nốt nhạc',
          },
        ],
      },
    ],
  },
  {
    id: 'toan',
    name: 'Toán',
    description: 'Học số học, hình học và giải toán',
    icon: '🔢',
    color: 'from-blue-400 to-blue-600',
    grade: 'Lớp 1-5',
    topics: [
      {
        id: 'toan-1',
        title: 'Đếm từ 1 đến 10',
        description: 'Học đếm và nhận biết các số từ 1 đến 10',
        difficulty: 'easy',
        estimatedTime: 20,
        content: 'Các số từ 1 đến 10: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10',
        activities: [
          {
            id: 't-1-1',
            type: 'typing',
            title: 'Gõ số từ 1 đến 10',
            content: '1 2 3 4 5 6 7 8 9 10',
            instructions: 'Gõ các số từ 1 đến 10',
          },
          {
            id: 't-1-2',
            type: 'math',
            title: 'Bài tập đếm',
            content: 'Đếm số lượng vật thể',
            instructions: 'Đếm và chọn số đúng',
          },
        ],
      },
      {
        id: 'toan-2',
        title: 'Phép cộng cơ bản',
        description: 'Học phép cộng với các số nhỏ',
        difficulty: 'medium',
        estimatedTime: 30,
        content: 'Phép cộng: 1 + 1 = 2, 2 + 2 = 4, 3 + 2 = 5',
        activities: [
          {
            id: 't-2-1',
            type: 'math',
            title: 'Bài tập phép cộng',
            content: 'Giải các phép cộng đơn giản',
            instructions: 'Tính toán và điền kết quả',
          },
        ],
      },
      {
        id: 'toan-3',
        title: 'Phép trừ cơ bản',
        description: 'Học phép trừ với các số nhỏ',
        difficulty: 'medium',
        estimatedTime: 25,
        content: 'Phép trừ: 5 - 2 = 3, 10 - 5 = 5, 8 - 3 = 5',
        activities: [
          {
            id: 't-3-1',
            type: 'math',
            title: 'Bài tập phép trừ',
            content: 'Giải các phép trừ đơn giản',
            instructions: 'Tính toán và điền kết quả',
          },
        ],
      },
      {
        id: 'toan-4',
        title: 'Hình học cơ bản',
        description: 'Học về các hình: vuông, tròn, tam giác',
        difficulty: 'easy',
        estimatedTime: 20,
        content: 'Hình vuông có 4 cạnh bằng nhau. Hình tròn không có góc.',
        activities: [
          {
            id: 't-4-1',
            type: 'quiz',
            title: 'Nhận biết hình dạng',
            content: 'Hình nào có 3 cạnh?',
            instructions: 'Chọn hình đúng',
          },
        ],
      },
    ],
  },
  {
    id: 'tieng-viet',
    name: 'Tiếng Việt',
    description: 'Học đọc, viết và gõ tiếng Việt',
    icon: '📚',
    color: 'from-green-400 to-green-600',
    grade: 'Lớp 1-5',
    topics: [
      {
        id: 'tv-1',
        title: 'Bảng chữ cái',
        description: 'Học 29 chữ cái tiếng Việt',
        difficulty: 'easy',
        estimatedTime: 25,
        content: 'A Ă Â B C D Đ E Ê G H I K L M N O Ô Ơ P Q R S T U Ư V X Y',
        activities: [
          {
            id: 'tv-1-1',
            type: 'typing',
            title: 'Gõ bảng chữ cái',
            content:
              'A Ă Â B C D Đ E Ê G H I K L M N O Ô Ơ P Q R S T U Ư V X Y',
            instructions: 'Gõ các chữ cái tiếng Việt',
          },
        ],
      },
      {
        id: 'tv-2',
        title: 'Từ đơn giản',
        description: 'Học gõ các từ tiếng Việt đơn giản',
        difficulty: 'easy',
        estimatedTime: 20,
        content: 'mẹ bố em con nhà trường',
        activities: [
          {
            id: 'tv-2-1',
            type: 'typing',
            title: 'Gõ từ đơn giản',
            content: 'mẹ bố em con nhà trường',
            instructions: 'Gõ các từ tiếng Việt đơn giản',
          },
        ],
      },
    ],
  },
  {
    id: 'hoat-dong-trai-nghiem',
    name: 'Hoạt động trải nghiệm',
    description: 'Các hoạt động thực hành và trải nghiệm',
    icon: '🎯',
    color: 'from-orange-400 to-orange-600',
    grade: 'Lớp 1-5',
    topics: [
      {
        id: 'hdtn-1',
        title: 'Chăm sóc cây xanh',
        description: 'Học cách trồng và chăm sóc cây',
        difficulty: 'medium',
        estimatedTime: 30,
        content: 'Cây cần ánh sáng, nước và chất dinh dưỡng để phát triển.',
        activities: [
          {
            id: 'hdtn-1-1',
            type: 'reading',
            title: 'Đọc về cây xanh',
            content: 'Cây xanh có vai trò quan trọng trong cuộc sống',
            instructions: 'Đọc và hiểu nội dung',
          },
        ],
      },
    ],
  },
  {
    id: 'tieng-anh',
    name: 'Tiếng Anh',
    description: 'Học từ vựng và giao tiếp tiếng Anh cơ bản',
    icon: '🌍',
    color: 'from-indigo-400 to-indigo-600',
    grade: 'Lớp 1-5',
    topics: [
      {
        id: 'ta-1',
        title: 'Bảng chữ cái tiếng Anh',
        description: 'Học 26 chữ cái tiếng Anh',
        difficulty: 'easy',
        estimatedTime: 20,
        content: 'A B C D E F G H I J K L M N O P Q R S T U V W X Y Z',
        activities: [
          {
            id: 'ta-1-1',
            type: 'typing',
            title: 'Gõ bảng chữ cái tiếng Anh',
            content: 'A B C D E F G H I J K L M N O P Q R S T U V W X Y Z',
            instructions: 'Gõ các chữ cái tiếng Anh',
          },
        ],
      },
      {
        id: 'ta-2',
        title: 'Từ vựng cơ bản',
        description: 'Học từ vựng tiếng Anh đơn giản',
        difficulty: 'easy',
        estimatedTime: 25,
        content: 'hello goodbye thank you please',
        activities: [
          {
            id: 'ta-2-1',
            type: 'typing',
            title: 'Gõ từ vựng cơ bản',
            content: 'hello goodbye thank you please',
            instructions: 'Gõ các từ tiếng Anh cơ bản',
          },
        ],
      },
    ],
  },
  {
    id: 'tu-nhien-xa-hoi',
    name: 'Tự nhiên và xã hội',
    description: 'Tìm hiểu về thiên nhiên và xã hội xung quanh',
    icon: '🌱',
    color: 'from-emerald-400 to-emerald-600',
    grade: 'Lớp 1-5',
    topics: [
      {
        id: 'tnxh-1',
        title: 'Các loài động vật',
        description: 'Tìm hiểu về động vật xung quanh',
        difficulty: 'easy',
        estimatedTime: 25,
        content: 'Có nhiều loài động vật: chó, mèo, gà, vịt, bò, heo',
        activities: [
          {
            id: 'tnxh-1-1',
            type: 'typing',
            title: 'Gõ tên động vật',
            content: 'chó mèo gà vịt bò heo',
            instructions: 'Gõ tên các loài động vật',
          },
        ],
      },
    ],
  },
  {
    id: 'my-thuat',
    name: 'Mỹ thuật',
    description: 'Học vẽ, tô màu và cảm thụ nghệ thuật',
    icon: '🎨',
    color: 'from-pink-400 to-pink-600',
    grade: 'Lớp 1-5',
    topics: [
      {
        id: 'mt-1',
        title: 'Các màu cơ bản',
        description: 'Học về màu sắc cơ bản',
        difficulty: 'easy',
        estimatedTime: 20,
        content:
          'Có 7 màu cơ bản: đỏ, cam, vàng, xanh lá, xanh dương, chàm, tím',
        activities: [
          {
            id: 'mt-1-1',
            type: 'typing',
            title: 'Gõ tên các màu',
            content: 'đỏ cam vàng xanh lá xanh dương chàm tím',
            instructions: 'Gõ tên các màu cơ bản',
          },
          {
            id: 'mt-1-2',
            type: 'drawing',
            title: 'Tô màu',
            content: 'Chọn màu và tô vào hình',
            instructions: 'Sử dụng các màu để tô hình',
          },
        ],
      },
    ],
  },
];
