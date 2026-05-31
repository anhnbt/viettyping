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

export const subjects: Subject[] = [
  {
    id: 'luyen-go-10-ngon',
    name: 'Luyện gõ 10 ngón',
    description: 'Bài tập luyện gõ 10 ngón cơ bản cho bé',
    icon: '⌨️',
    color: 'from-cyan-400 to-cyan-600',
    grade: 'Cơ bản',
    thumbnailUrl: '/assets/thumbnails/luyen_go.png',
    topics: [
      {
        id: 'lg-1',
        title: 'Hàng cơ sở (Home Row)',
        description: 'Làm quen với các phím chính: A S D F J K L ;',
        difficulty: 'easy',
        estimatedTime: 15,
        content: 'a s d f j k l ;',
        activities: [
          {
            id: 'lg-1-1',
            type: 'typing',
            title: 'Ngón trỏ: F và J',
            content: 'f j f f j j fj jf f j',
            instructions: 'Đặt ngón trỏ trái lên F, ngón trỏ phải lên J',
          },
          {
            id: 'lg-1-2',
            type: 'typing',
            title: 'Ngón giữa: D và K',
            content: 'd k d d k k dk kd d k',
            instructions: 'Đặt ngón giữa trái lên D, ngón giữa phải lên K',
          },
          {
            id: 'lg-1-3',
            type: 'typing',
            title: 'Kết hợp F J D K',
            content: 'fd jk df kj fjdk',
            instructions: 'Gõ kết hợp các phím đã học',
          },
          {
            id: 'lg-1-4',
            type: 'typing',
            title: 'Ngón áp út: S và L',
            content: 's l s s l l sl ls s l',
            instructions: 'Ngón áp út trái S, ngón áp út phải L',
          },
          {
            id: 'lg-1-5',
            type: 'typing',
            title: 'Ngón út: A và ;',
            content: 'a ; a a ; ; a; ;a a ;',
            instructions: 'Ngón út trái A, ngón út phải ;',
          },
          {
            id: 'lg-1-6',
            type: 'typing',
            title: 'Ôn tập Hàng cơ sở',
            content: 'asdf jkl; a s d f j k l ;',
            instructions: 'Gõ tất cả các phím hàng cơ sở',
          },
        ],
      },
      {
        id: 'lg-2',
        title: 'Hàng trên (Top Row)',
        description: 'Các phím hàng trên: Q W E R T Y U I O P',
        difficulty: 'medium',
        estimatedTime: 20,
        content: 'q w e r t y u i o p',
        activities: [
          {
            id: 'lg-2-1',
            type: 'typing',
            title: 'Ngón trỏ vươn lên: R T Y U',
            content: 'r t y u rt yu tr uy',
            instructions: 'Vươn ngón trỏ lên hàng trên',
          },
          {
            id: 'lg-2-2',
            type: 'typing',
            title: 'Ngón giữa vươn lên: E I',
            content: 'e i e e i i ei ie',
            instructions: 'Vươn ngón giữa lên E và I',
          },
          {
            id: 'lg-2-3',
            type: 'typing',
            title: 'Ngón áp út vươn lên: W O',
            content: 'w o w w o o wo ow',
            instructions: 'Vươn ngón áp út lên W và O',
          },
          {
            id: 'lg-2-4',
            type: 'typing',
            title: 'Ngón út vươn lên: Q P',
            content: 'q p q q p p qp pq',
            instructions: 'Vươn ngón út lên Q và P',
          },
        ]
      },
      {
        id: 'lg-3',
        title: 'Hàng dưới (Bottom Row)',
        description: 'Các phím hàng dưới: Z X C V B N M , . /',
        difficulty: 'medium',
        estimatedTime: 20,
        content: 'z x c v b n m , . /',
        activities: [
          {
            id: 'lg-3-1',
            type: 'typing',
            title: 'Luyện tập hàng dưới',
            content: 'z x c v b n m , . /',
            instructions: 'Gõ các phím hàng dưới',
          },
        ]
      },
      {
        id: 'lg-4',
        title: 'Dấu Tiếng Việt (Telex)',
        description: 'Các dấu: Sắc (s), Huyền (f), Hỏi (r), Ngã (x), Nặng (j)',
        difficulty: 'medium',
        estimatedTime: 25,
        content: 's f r x j',
        activities: [
          {
            id: 'lg-4-1',
            type: 'typing',
            title: 'Các dấu cơ bản',
            content: 's f r x j cais caf car cax caj',
            instructions: 'Gõ dấu bằng kiểu Telex',
          },
          {
            id: 'lg-4-2',
            type: 'typing',
            title: 'Chữ cái đặc biệt',
            content: 'â ă ê ô ơ đ â ă ê ô ơ đ',
            instructions: 'Gõ các chữ cái đặc biệt bằng kiểu Telex',
          },
        ]
      },
      {
        id: 'lg-5',
        title: 'Từ vựng đơn giản',
        description: 'Luyện gõ các từ thân thuộc',
        difficulty: 'medium',
        estimatedTime: 15,
        content: 'ba mẹ ông bà',
        activities: [
          {
            id: 'lg-5-1',
            type: 'typing',
            title: 'Gia đình',
            content: 'ba mẹ ông bà anh chị em',
            instructions: 'Gõ các từ chỉ người thân',
          },
          {
            id: 'lg-5-2',
            type: 'typing',
            title: 'Con vật',
            content: 'chó mèo gà vịt cá heo',
            instructions: 'Gõ tên các con vật',
          },
        ]
      },
      {
        id: 'lg-6',
        title: 'Thơ và Ca dao',
        description: 'Luyện gõ câu ngắn',
        difficulty: 'hard',
        estimatedTime: 20,
        content: 'công cha như núi thái sơn',
        activities: [
          {
            id: 'lg-6-1',
            type: 'typing',
            title: 'Công cha nghĩa mẹ',
            content: 'công cha như núi thái sơn nghĩa mẹ như nước trong nguồn chảy ra',
            instructions: 'Gõ câu ca dao quen thuộc',
          },
          {
            id: 'lg-6-2',
            type: 'typing',
            title: 'Bầu ơi thương lấy bí cùng',
            content: 'bầu ơi thương lấy bí cùng tuy rằng khác giống nhưng chung một giàn',
            instructions: 'Gõ câu ca dao về tình thương',
          },
        ]
      }
    ],
  },
  {
    id: 'dao-duc',
    name: 'Đạo đức',
    description: 'Học về những giá trị đạo đức, phẩm chất tốt',
    icon: '❤️',
    color: 'from-red-400 to-red-600',
    grade: 'Lớp 1-5',
    thumbnailUrl: '/assets/thumbnails/dao_duc.png',
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
            content: 'Ai là người sinh ra và nuôi dưỡng con?',
            instructions: 'Chọn đáp án đúng nhất',
            options: ['Bố mẹ', 'Bạn bè', 'Thầy cô'],
            correctAnswer: 'Bố mẹ'
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
    thumbnailUrl: '/assets/thumbnails/am_nhac.png',
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
            data: {
              notes: [
                { name: 'Đồ (C)', frequency: 261.63 },
                { name: 'Rê (D)', frequency: 293.66 },
                { name: 'Mi (E)', frequency: 329.63 },
                { name: 'Fa (F)', frequency: 349.23 },
                { name: 'Sol (G)', frequency: 392.00 },
                { name: 'La (A)', frequency: 440.00 },
                { name: 'Si (B)', frequency: 493.88 },
              ]
            }
          },
        ],
      },
      {
        id: 'am-nhac-hat',
        title: 'Rèn hát đúng giai điệu & Nốt nhạc',
        description: 'Học cách cảm thụ giai điệu và gõ lời các ca khúc thiếu nhi quen thuộc',
        difficulty: 'medium',
        estimatedTime: 20,
        content: 'Ba thương con vì con giống mẹ. Mẹ thương con vì con giống ba.',
        activities: [
          {
            id: 'an-hat-1',
            type: 'typing',
            title: 'Gõ lời ca khúc: Cả nhà thương nhau',
            content: 'ba thuong con vi con giong me me thuong con vi con giong ba ca nha ta cung thuong yeu nhau xa la nho gap nhau la cuoi',
            instructions: 'Hãy gõ lời bài hát để vừa nhớ chữ vừa nhẩm theo giai điệu vui tươi nhé!',
          },
          {
            id: 'an-hat-2',
            type: 'listening',
            title: 'Nghe giai điệu nốt nhạc',
            content: 'Nghe nốt Sol và chọn nốt đúng',
            instructions: 'Lắng nghe âm thanh và chọn nốt nhạc tương ứng',
            data: {
              notes: [
                { name: 'Sol (G)', frequency: 392.00 }
              ]
            }
          }
        ]
      }
    ],
  },
  {
    id: 'toan',
    name: 'Toán',
    description: 'Học số học, hình học và giải toán',
    icon: '🔢',
    color: 'from-blue-400 to-blue-600',
    grade: 'Lớp 1-5',
    thumbnailUrl: '/assets/thumbnails/toan_hoc.png',
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
            content: '🍎 🍎 🍎 🍎 🍎 🍎',
            instructions: 'Bé hãy đếm xem có bao nhiêu quả táo và chọn số đúng nhé!',
            options: ['4', '5', '6', '7'],
            correctAnswer: '6'
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
            content: '3 + 4 = ?',
            instructions: 'Tính toán và chọn kết quả đúng nhé!',
            options: ['6', '7', '8', '9'],
            correctAnswer: '7'
          },
          {
            id: 't-2-2',
            type: 'math',
            title: 'Đặt tính rồi tính: 15 + 8',
            content: '15 + 8 = ?',
            instructions: 'Bé hãy đặt tính rồi tính phép cộng hàng dọc nhé!',
            data: {
              subtype: 'vertical',
              operand1: 15,
              operand2: 8,
              operator: '+'
            }
          }
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
            content: '5 - 2 = ?',
            instructions: 'Tính toán và chọn kết quả đúng',
            options: ['2', '3', '4'],
            correctAnswer: '3'
          },
          {
            id: 't-3-2',
            type: 'math',
            title: 'Đặt tính rồi tính: 23 - 8',
            content: '23 - 8 = ?',
            instructions: 'Bé hãy đặt tính rồi tính phép trừ hàng dọc có mượn nhé!',
            data: {
              subtype: 'vertical',
              operand1: 23,
              operand2: 8,
              operator: '-'
            }
          }
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
            content: 'Bạn hình tam giác đáng yêu trong tranh có màu gì thế bé nhỉ?',
            instructions: 'Bé hãy nhìn vào bức tranh bên trên và chọn màu sắc đúng nhé!',
            imageUrl: '/assets/shapes.png',
            options: ['Màu đỏ 🟥', 'Màu vàng 🟡', 'Màu xanh da trời 💙'],
            correctAnswer: 'Màu xanh da trời 💙'
          },
        ],
      },
      {
        id: 'toan-thuc-te',
        title: 'Toán học thực tế & Cẩn thận',
        description: 'Giải toán có lời văn thực tế và rèn luyện tính toán chính xác',
        difficulty: 'medium',
        estimatedTime: 20,
        content: 'Vận dụng phép cộng, phép trừ vào các bài toán thực tế hàng ngày.',
        activities: [
          {
            id: 't-thucte-1',
            type: 'quiz',
            title: 'Đi chợ mua quả',
            content: 'Mẹ mua 5 quả táo, ba mua thêm 3 quả táo nữa. Hỏi nhà mình có tất cả bao nhiêu quả táo?',
            instructions: 'Hãy suy nghĩ cẩn thận và chọn đáp án chính xác nhé!',
            options: ['6 quả', '8 quả', '10 quả'],
            correctAnswer: '8 quả'
          },
          {
            id: 't-thucte-2',
            type: 'typing',
            title: 'Gõ phép tính cẩn thận',
            content: '5 + 3 = 8; 10 - 4 = 6; 7 - 2 = 5; 6 + 4 = 10',
            instructions: 'Gõ thật cẩn thận và chính xác từng số và dấu phép tính!',
          }
        ]
      },
      {
        id: 'toan-hinh-khoi',
        title: 'Hình khối quanh bé',
        description: 'Bé nhận biết hình cầu, hình lập phương, hình hộp chữ nhật trong thực tế',
        difficulty: 'easy',
        estimatedTime: 15,
        content: 'Hình cầu tròn trịa như viên bi. Hình lập phương vuông vắn như cục xúc xắc.',
        activities: [
          {
            id: 't-hk-1',
            type: 'quiz',
            title: 'Hình cầu xinh xắn',
            content: 'Đồ vật nào dưới đây có dạng hình cầu giống như viên bi hay Trái Đất của chúng ta?',
            instructions: 'Bé hãy suy nghĩ và chọn đáp án có dạng hình tròn trịa nhé!',
            options: ['Hộp sữa giấy', 'Quả bóng đá tròn ⚽', 'Hộp bút màu'],
            correctAnswer: 'Quả bóng đá tròn ⚽'
          },
          {
            id: 't-hk-2',
            type: 'quiz',
            title: 'Hình lập phương vuông vắn',
            content: 'Cục xúc xắc xinh xắn bé dùng để chơi cá ngựa có dạng hình gì nhỉ?',
            instructions: 'Chọn hình dạng vuông vắn có 6 mặt bằng nhau nhé bé!',
            options: ['Hình cầu', 'Hình lập phương', 'Hình hộp chữ nhật'],
            correctAnswer: 'Hình lập phương'
          },
          {
            id: 't-hk-3',
            type: 'quiz',
            title: 'Hình hộp chữ nhật quen thuộc',
            content: 'Chiếc tủ quần áo cao lớn ở trong phòng bé có hình dạng giống hình khối nào nhất?',
            instructions: 'Bé hãy nhìn tủ quần áo và chọn khối hình phù hợp nhé!',
            options: ['Hình hộp chữ nhật', 'Hình cầu', 'Hình lập phương'],
            correctAnswer: 'Hình hộp chữ nhật'
          }
        ]
      },
      {
        id: 'toan-cong-hoa-qua',
        title: 'Phép cộng hoa quả sinh động',
        description: 'Luyện đếm hoa quả và thực hiện phép cộng vui tươi',
        difficulty: 'easy',
        estimatedTime: 15,
        content: 'Cộng hoa quả giúp bé đếm nhanh và chính xác hơn.',
        activities: [
          {
            id: 't-chq-1',
            type: 'quiz',
            title: 'Phép cộng táo đỏ',
            content: '🍎 🍎 + 🍎 = ? Bé hãy đếm xem có tất cả bao nhiêu quả táo đỏ?',
            instructions: 'Hãy đếm tổng số lượng táo ở cả hai bên và chọn đáp án đúng nhé!',
            options: ['2 quả táo', '3 quả táo', '4 quả táo'],
            correctAnswer: '3 quả táo'
          },
          {
            id: 't-chq-2',
            type: 'quiz',
            title: 'Phép cộng chuối vàng',
            content: '🍌 🍌 🍌 + 🍌 🍌 = ? Bé hãy đếm xem có tất cả bao nhiêu quả chuối vàng?',
            instructions: 'Đếm tất cả số quả chuối và chọn đáp án chính xác nhé!',
            options: ['4 quả chuối', '5 quả chuối', '6 quả chuối'],
            correctAnswer: '5 quả chuối'
          },
          {
            id: 't-chq-3',
            type: 'typing',
            title: 'Gõ phép tính hoa quả',
            content: '2 + 1 = 3; 3 + 2 = 5; 4 + 4 = 8',
            instructions: 'Gõ lại các phép tính bé vừa học thật chính xác nhé!',
          }
        ]
      }
    ],
  },
  {
    id: 'tieng-viet',
    name: 'Tiếng Việt',
    description: 'Học đọc, viết và gõ tiếng Việt',
    icon: '📚',
    color: 'from-green-400 to-green-600',
    grade: 'Lớp 1-5',
    thumbnailUrl: '/assets/thumbnails/tieng_viet.png',
    topics: [
      {
        id: 'tv-1',
        title: 'Bảng chữ cái',
        description: 'Học 29 chữ cái tiếng Việt',
        difficulty: 'easy',
        estimatedTime: 20,
        content: 'a ă â b c d đ e ê g h i k l m n o ô ơ p q r s t u ư v x y',
        activities: [
          {
            id: 'tv-1-1',
            type: 'typing',
            title: 'Gõ bảng chữ cái',
            content: 'a ă â b c d đ e ê g h i k l m n o ô ơ p q r s t u ư v x y',
            instructions: 'Hãy gõ các chữ cái tiếng Việt viết thường thật chính xác nhé!',
          },
          {
            id: 'tv-1-2',
            type: 'quiz',
            title: 'Chữ hoa và chữ thường',
            content: 'Bé hãy chọn chữ viết thường tương ứng với chữ viết hoa "A"',
            instructions: 'Chọn đáp án đúng nhất để giúp bạn Ong vàng tìm chữ thường nhé!',
            options: ['a', 'ă', 'â'],
            correctAnswer: 'a',
          },
          {
            id: 'tv-1-3',
            type: 'quiz',
            title: 'Chữ hoa và chữ thường',
            content: 'Bé hãy chọn chữ viết hoa tương ứng với chữ viết thường "ê"',
            instructions: 'Chọn đáp án đúng nhất để giúp bạn Ong vàng nhé!',
            options: ['E', 'Ê', 'Â'],
            correctAnswer: 'Ê',
          },
        ],
      },
      {
        id: 'tv-2',
        title: 'Từ đơn giản',
        description: 'Luyện gõ các từ đơn giản gần gũi không dấu hoặc dấu đơn',
        difficulty: 'easy',
        estimatedTime: 15,
        content: 'ba mẹ bố bé cá gà nhà',
        activities: [
          {
            id: 'tv-2-1',
            type: 'typing',
            title: 'Gõ từ gần gũi',
            content: 'ba mẹ bố bé cá gà nhà',
            instructions: 'Gõ các từ tiếng Việt đơn giản chỉ gia đình và con vật quen thuộc',
          },
          {
            id: 'tv-2-2',
            type: 'quiz',
            title: 'Đố vui Telex: Dấu Sắc',
            content: 'Để gõ từ "cá", con cần gõ phím "c", phím "a" và phím nào để có dấu sắc?',
            instructions: 'Gợi ý: Dấu Sắc trong Telex được gõ bằng phím nào?',
            options: ['s', 'f', 'r'],
            correctAnswer: 's',
          },
          {
            id: 'tv-2-3',
            type: 'quiz',
            title: 'Đố vui Telex: Dấu Huyền',
            content: 'Để gõ từ "gà", con cần gõ phím "g", phím "a" và phím nào để có dấu huyền?',
            instructions: 'Gợi ý: Dấu Huyền trong Telex được gõ bằng phím nào?',
            options: ['s', 'f', 'x'],
            correctAnswer: 'f',
          },
        ],
      },
      {
        id: 'tv-3',
        title: 'Từ ghép và vần phức tạp',
        description: 'Học gõ các từ ghép có vần phức tạp hơn',
        difficulty: 'medium',
        estimatedTime: 20,
        content: 'học hành trường học cô giáo bạn bè sách vở',
        activities: [
          {
            id: 'tv-3-1',
            type: 'typing',
            title: 'Gõ từ ghép trường học',
            content: 'học hành trường học cô giáo bạn bè sách vở',
            instructions: 'Hãy gõ thật nắn nót các từ ghép chỉ trường lớp thân thương nhé!',
          },
          {
            id: 'tv-3-2',
            type: 'quiz',
            title: 'Đố vui Telex: Chữ Ê',
            content: 'Để gõ chữ "ê" trong từ "bè bạn" hay "cô giáo", con cần gõ như thế nào?',
            instructions: 'Chọn phím kết hợp đúng nhất',
            options: ['e e', 'e w', 'e s'],
            correctAnswer: 'e e',
          },
          {
            id: 'tv-3-3',
            type: 'quiz',
            title: 'Đố vui Telex: Chữ Đ',
            content: 'Để gõ chữ viết thường "đ", bé cần nhấn phím chữ nào 2 lần?',
            instructions: 'Nhấn phím nào liên tiếp để ra chữ đ?',
            options: ['d', 'a', 'o'],
            correctAnswer: 'd',
          },
        ],
      },
      {
        id: 'tv-toc-do',
        title: 'Luyện gõ đúng tốc độ & Đọc hiểu',
        description: 'Rèn luyện kỹ năng đọc hiểu và đạt tốc độ gõ phím tiêu chuẩn',
        difficulty: 'medium',
        estimatedTime: 20,
        content: 'Rùa bò chậm chạp nhưng kiên trì. Thỏ chạy nhanh nhưng ham chơi. Cuối cùng rùa đã về đích trước.',
        activities: [
          {
            id: 'tv-tocdo-read',
            type: 'reading',
            title: 'Đọc truyện: Rùa và Thỏ',
            content: 'Con rùa và con thỏ chạy thi. Rùa bò rất chậm chạp nhưng kiên trì. Thỏ chạy rất nhanh nhưng kiêu ngạo ham chơi. Kết quả, rùa đã về đích trước và chiến thắng thỏ.',
            instructions: 'Bé hãy đọc to câu chuyện trên để chuẩn bị luyện gõ nhé!',
          },
          {
            id: 'tv-tocdo-1',
            type: 'typing',
            title: 'Luyện gõ đúng tốc độ: Rùa và Thỏ',
            content: 'Rùa bò chậm chạp nhưng kiên trì. Thỏ chạy nhanh nhưng ham chơi. Cuối cùng rùa đã về đích trước.',
            instructions: 'Hãy gõ thật đều tay và giữ lưng thẳng nhé!',
          },
          {
            id: 'tv-tocdo-2',
            type: 'quiz',
            title: 'Đọc hiểu: Ai là người chiến thắng?',
            content: 'Trong câu chuyện Rùa và Thỏ chạy thi, ai đã giành chiến thắng chung cuộc?',
            instructions: 'Chọn con vật đã kiên trì để giành chiến thắng nhé!',
            options: ['Con Thỏ', 'Con Rùa', 'Cả hai cùng về đích'],
            correctAnswer: 'Con Rùa',
          },
        ],
      },
      {
        id: 'tv-dong-dao',
        title: 'Đồng dao & Ca dao nhịp điệu',
        description: 'Luyện gõ câu ngắn có nhịp điệu vui tươi và dễ nhớ',
        difficulty: 'medium',
        estimatedTime: 15,
        content: 'dung dang dung de dat tre di choi',
        activities: [
          {
            id: 'tv-dongdao-1',
            type: 'typing',
            title: 'Gõ đồng dao: Dung dăng dung dẻ',
            content: 'dung dăng dung dẻ dắt trẻ đi chơi đến cửa nhà trời',
            instructions: 'Gõ các câu đồng dao ngắn theo nhịp điệu vui tươi',
          },
          {
            id: 'tv-dongdao-2',
            type: 'quiz',
            title: 'Bé hiểu đồng dao',
            content: 'Trong bài đồng dao trên, các bạn nhỏ đang dắt nhau đi đâu chơi?',
            instructions: 'Đọc kỹ câu đầu tiên để tìm đáp án',
            options: ['Đi học', 'Đi chơi', 'Đi ngủ'],
            correctAnswer: 'Đi chơi',
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
    thumbnailUrl: '/assets/thumbnails/trai_nghiem.png',
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
      {
        id: 'hdtn-tap-trung',
        title: 'Rèn luyện sự tập trung chú ý',
        description: 'Rèn luyện khả năng chú ý và tập trung cao độ trong giờ học',
        difficulty: 'hard',
        estimatedTime: 15,
        content: 'Tập trung học tập giúp con hiểu bài nhanh và nhớ lâu hơn.',
        activities: [
          {
            id: 'hdtn-taptrung-1',
            type: 'typing',
            title: 'Gõ nhanh luyện tập trung',
            content: 'chu y lang nghe hoc tap cham chi tu giac phat bieu',
            instructions: 'Gõ nhanh và chính xác các từ này mà không nhìn bàn phím nhé!',
          },
          {
            id: 'hdtn-taptrung-2',
            type: 'quiz',
            title: 'Hành vi tập trung trong lớp',
            content: 'Hành động nào dưới đây thể hiện sự tập trung nghe giảng trong giờ học?',
            instructions: 'Chọn hành vi đúng đắn nhất',
            options: ['Nói chuyện riêng với bạn bên cạnh', 'Chăm chú lắng nghe cô giáo và hăng hái phát biểu', 'Vẽ bậy ra sách vở'],
            correctAnswer: 'Chăm chú lắng nghe cô giáo và hăng hái phát biểu'
          }
        ]
      },
      {
        id: 'hdtn-tiet-kiem',
        title: 'Tiết kiệm năng lượng, thịnh vượng tương lai',
        description: 'Bé học cách tiết kiệm 3% điện năng, sử dụng điện mặt trời và tắt điện giờ cao điểm để bảo vệ môi trường.',
        difficulty: 'medium',
        estimatedTime: 15,
        content: 'Chung tay tiết kiệm điện năm 2026. Hãy sử dụng điện mặt trời và tắt bớt thiết bị điện giờ cao điểm nhé bé!',
        activities: [
          {
            id: 'hdtn-tk-1',
            type: 'typing',
            title: 'Gõ từ khóa năng lượng sạch',
            content: 'điện mặt trời tiết kiệm ba phần trăm giờ cao điểm lối sống xanh',
            instructions: 'Bé hãy gõ các từ khóa về tiết kiệm điện thật chính xác nhé!',
          },
          {
            id: 'hdtn-tk-2',
            type: 'reading',
            title: 'Đọc truyện: Dũng sĩ tiết kiệm điện tí hon',
            content: 'Năm 2026, cả nước chung tay tiết kiệm ba phần trăm điện năng ⚡. Nhà bé Nam đã lắp các tấm pin điện mặt trời ☀️ trên mái nhà. Bố mẹ cũng dạy Nam tắt bớt thiết bị điện vào giờ cao điểm từ bốn giờ đến bảy giờ tối ⏰. Nam luôn tự giác tắt quạt và đèn khi ra khỏi phòng. Nam là một dũng sĩ tiết kiệm điện tí hon! 🦸‍♂️',
            instructions: 'Bé hãy đọc to câu chuyện về ngôi nhà xanh của bạn Nam nhé!',
          },
          {
            id: 'hdtn-tk-3',
            type: 'quiz',
            title: 'Bé học về điện mặt trời',
            content: 'Để tạo ra nguồn điện sạch từ ánh nắng, nhà bạn Nam đã lắp thiết bị gì trên mái nhà?',
            instructions: 'Bé hãy nhớ lại câu chuyện vừa đọc và chọn đáp án đúng nhé!',
            imageUrl: '/assets/solar_rooftop.png',
            options: [
              'Bể bơi mini giải nhiệt',
              'Tấm pin điện mặt trời đón nắng ☀️',
              'Cột thu lôi tránh sét'
            ],
            correctAnswer: 'Tấm pin điện mặt trời đón nắng ☀️'
          },
          {
            id: 'hdtn-tk-4',
            type: 'quiz',
            title: 'Bé chọn hành động xanh',
            content: 'Hành động nào dưới đây giúp gia đình bé tiết kiệm điện năng hiệu quả nhất?',
            instructions: 'Bé chọn hành động thông minh nhất để bảo vệ Trái Đất nhé!',
            imageUrl: '/assets/save_energy.png',
            options: [
              'Mở cửa tủ lạnh liên tục để làm mát phòng',
              'Bật tivi cả ngày cho chú cún xem cùng',
              'Hẹn giờ tắt điều hòa khi ngủ và dùng quạt nhẹ ⏰'
            ],
            correctAnswer: 'Hẹn giờ tắt điều hòa khi ngủ và dùng quạt nhẹ ⏰'
          },
          {
            id: 'hdtn-tk-5',
            type: 'math',
            title: 'Làm toán dũng sĩ nhỏ',
            content: 'Nam tắt 2 chiếc bóng đèn ở phòng khách và 2 chiếc bóng đèn ở phòng học khi đi chơi. Hỏi Nam đã giúp gia đình tắt tổng cộng bao nhiêu chiếc bóng đèn?',
            instructions: 'Bé hãy cộng số bóng đèn Nam đã tắt giúp bố mẹ nhé!',
            options: [
              '3 chiếc bóng đèn',
              '4 chiếc bóng đèn 💡',
              '5 chiếc bóng đèn'
            ],
            correctAnswer: '4 chiếc bóng đèn 💡'
          },
          {
            id: 'hdtn-tk-6',
            type: 'drawing',
            title: 'Tô màu Cây xanh yêu thương',
            content: 'Bé hãy tô màu cho cây xanh thật đẹp để hưởng ứng lối sống xanh nhé!',
            instructions: 'Chọn các màu sắc trong hộp sáp để tô kín hình cây xanh nhé bé!',
            data: {
              outlineSvgName: 'tree',
              targetCoveragePercent: 70
            }
          }
        ]
      }
    ],
  },
  {
    id: 'tieng-anh',
    name: 'Tiếng Anh',
    description: 'Học từ vựng và giao tiếp tiếng Anh cơ bản',
    icon: '🌍',
    color: 'from-indigo-400 to-indigo-600',
    grade: 'Lớp 1-5',
    thumbnailUrl: '/assets/thumbnails/tieng_anh.png',
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
      {
        id: 'ta-animals',
        title: 'Từ vựng Con vật vui nhộn',
        description: 'Học từ vựng con vật: dog, cat, pig, duck, bird qua trò chơi sinh động',
        difficulty: 'easy',
        estimatedTime: 20,
        content: 'dog cat pig duck bird',
        activities: [
          {
            id: 'ta-ani-1',
            type: 'typing',
            title: 'Luyện gõ từ vựng con vật',
            content: 'dog cat pig duck bird',
            instructions: 'Bé hãy gõ các từ vựng tiếng Anh chỉ con vật thật chính xác nhé!',
          },
          {
            id: 'ta-ani-2',
            type: 'game',
            title: 'Vòng quay từ vựng con vật',
            content: 'Vòng quay kỳ diệu con vật',
            instructions: 'Bé hãy quay vòng quay và gõ từ vựng của con vật trúng thưởng nhé!',
            data: {
              subtype: 'spinwheel',
              items: ['dog', 'cat', 'pig', 'duck', 'bird'],
              flashcards: [
                { word: 'dog', image_url: '/assets/animals/dog.png' },
                { word: 'cat', image_url: '/assets/animals/cat.png' },
                { word: 'pig', image_url: '/assets/animals/pig.png' },
                { word: 'duck', image_url: '/assets/animals/duck.png' },
                { word: 'bird', image_url: '/assets/animals/bird.png' }
              ]
            }
          },
          {
            id: 'ta-ani-3',
            type: 'game',
            title: 'Ghép nối con vật',
            content: 'Nối từ tiếng Anh với hình ảnh đúng',
            instructions: 'Bé kéo thả các từ tiếng Anh nối với hình ảnh con vật tương ứng nhé!',
            data: {
              subtype: 'matching',
              items: [
                { word: 'dog', image_url: '/assets/animals/dog.png' },
                { word: 'cat', image_url: '/assets/animals/cat.png' },
                { word: 'pig', image_url: '/assets/animals/pig.png' },
                { word: 'duck', image_url: '/assets/animals/duck.png' },
                { word: 'bird', image_url: '/assets/animals/bird.png' }
              ]
            }
          }
        ]
      },
      {
        id: 'ta-family',
        title: 'Gia đình yêu thương',
        description: 'Học từ vựng về gia đình: dad, mom, baby qua trò chơi ghép hình',
        difficulty: 'easy',
        estimatedTime: 15,
        content: 'dad mom baby',
        activities: [
          {
            id: 'ta-fam-1',
            type: 'typing',
            title: 'Luyện gõ từ vựng gia đình',
            content: 'dad mom baby',
            instructions: 'Gõ các từ vựng chỉ người thân yêu trong gia đình!',
          },
          {
            id: 'ta-fam-2',
            type: 'game',
            title: 'Ghép tranh gia đình',
            content: 'Nối từ với hình ảnh người thân',
            instructions: 'Bé hãy kéo thả các từ tiếng Anh nối với đúng hình ảnh người thân yêu nhé!',
            data: {
              subtype: 'matching',
              items: [
                { word: 'dad', image_url: '/assets/family/dad.png' },
                { word: 'mom', image_url: '/assets/family/mom.png' },
                { word: 'baby', image_url: '/assets/family/baby.png' }
              ]
            }
          }
        ]
      },
    ],
  },
  {
    id: 'tu-nhien-xa-hoi',
    name: 'Tự nhiên và xã hội',
    description: 'Tìm hiểu về thiên nhiên và xã hội xung quanh',
    icon: '🌱',
    color: 'from-emerald-400 to-emerald-650',
    grade: 'Lớp 1-5',
    thumbnailUrl: '/assets/thumbnails/tu_nhien_xa_hoi.png',
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
      {
        id: 'tnxh-bon-mua',
        title: 'Bốn mùa kỳ diệu',
        description: 'Bé khám phá các đặc điểm của 4 mùa Xuân, Hạ, Thu, Đông',
        difficulty: 'easy',
        estimatedTime: 15,
        content: 'Bốn mùa quanh năm: mùa xuân ấm áp, mùa hè nóng nực, mùa thu mát mẻ, mùa đông lạnh giá.',
        activities: [
          {
            id: 'tnxh-bm-1',
            type: 'typing',
            title: 'Gõ tên các mùa',
            content: 'xuan ha thu dong',
            instructions: 'Bé hãy gõ tên các mùa trong năm nhé!',
          },
          {
            id: 'tnxh-bm-2',
            type: 'quiz',
            title: 'Thời tiết mùa đông',
            content: 'Mùa đông thường có tuyết rơi trắng xóa và thời tiết rất lạnh giá. Điều này đúng hay sai hả bé?',
            instructions: 'Bé chọn Đúng hoặc Sai nhé!',
            options: ['Đúng thế ❄️', 'Sai rồi ❌'],
            correctAnswer: 'Đúng thế ❄️'
          },
          {
            id: 'tnxh-bm-3',
            type: 'quiz',
            title: 'Mùa hè rực rỡ',
            content: 'Mùa nào trong năm bé thường được nghỉ học, đi tắm biển và ăn kem mát lạnh nhỉ?',
            instructions: 'Bé chọn mùa có ánh nắng rực rỡ nhất nhé!',
            options: ['Mùa xuân', 'Mùa hè ☀️', 'Mùa đông'],
            correctAnswer: 'Mùa hè ☀️'
          }
        ]
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
    thumbnailUrl: '/assets/thumbnails/my_thuat.png',
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
      {
        id: 'mt-khung-hinh',
        title: 'Bố cục khung hình & Tô màu đều',
        description: 'Học cách nhận biết khung hình đẹp và tô màu đều tay',
        difficulty: 'easy',
        estimatedTime: 15,
        content: 'Bức tranh đẹp cần vẽ đúng khung hình và tô màu thật đều tay.',
        activities: [
          {
            id: 'mt-khunghinh-1',
            type: 'quiz',
            title: 'Nhận biết khung hình đúng',
            content: 'Khi vẽ một ngôi nhà, chúng ta nên vẽ ngôi nhà ở vị trí nào của tờ giấy để cân đối nhất?',
            instructions: 'Chọn đáp án thể hiện bố cục cân đối nhất',
            options: ['Nằm lệch hoàn toàn sang góc trái', 'Nằm chính giữa tờ giấy', 'Nằm sát mép dưới tờ giấy'],
            correctAnswer: 'Nằm chính giữa tờ giấy'
          },
          {
            id: 'mt-khunghinh-2',
            type: 'drawing',
            title: 'Tập tô màu đều tay',
            content: 'Tô màu đỏ cho mái ngói và màu vàng cho tường nhà',
            instructions: 'Hãy di chuyển chuột hoặc ngón tay để tô màu thật đều trong khung hình nhé!',
            data: {
              outlineSvgName: 'house',
              targetCoveragePercent: 70
            }
          }
        ]
      },
      {
        id: 'mt-to-mau-gau',
        title: 'Tô màu chú gấu con đáng yêu',
        description: 'Bé tập tô màu đều tay cho chú gấu dễ thương',
        difficulty: 'easy',
        estimatedTime: 15,
        content: 'Tô màu giúp rèn luyện sự khéo léo của đôi bàn tay.',
        activities: [
          {
            id: 'mt-tmg-1',
            type: 'typing',
            title: 'Quy tắc tô màu đẹp',
            content: 'to mau deu tay khong lem ra ngoai phoi mau hai hoa',
            instructions: 'Bé gõ các quy tắc để tô màu thật đẹp nhé!',
          },
          {
            id: 'mt-tmg-2',
            type: 'drawing',
            title: 'Tô màu bạn gấu con',
            content: 'Tô màu cho chú gấu con đáng yêu',
            instructions: 'Bé di chuyển chuột hoặc ngón tay để tô các màu sắc yêu thích cho chú gấu con nhé!',
            data: {
              outlineSvgName: 'bear',
              targetCoveragePercent: 70
            }
          }
        ]
      }
    ],
  },
  {
    id: 'the-duc',
    name: 'Giáo dục thể chất',
    description: 'Rèn luyện sức khỏe, các động tác cơ bản và tư thế học tập',
    icon: '🏃',
    color: 'from-amber-400 to-amber-600',
    grade: 'Lớp 1-5',
    thumbnailUrl: '/assets/thumbnails/the_duc.png',
    topics: [
      {
        id: 'td-1',
        title: 'Tư thế ngồi gõ phím & Sức khỏe',
        description: 'Học cách ngồi thẳng lưng, bảo vệ mắt và rèn luyện thể chất',
        difficulty: 'easy',
        estimatedTime: 15,
        content: 'Ngồi thẳng lưng, mắt cách màn hình 30cm, nghỉ ngơi sau 20 phút.',
        activities: [
          {
            id: 'td-1-1',
            type: 'typing',
            title: 'Quy tắc ngồi gõ phím đúng cách',
            content: 'ngoi thang lung mat cach man hinh ba muoi xentimet giu vai tha long thu gian tay',
            instructions: 'Gõ các quy tắc ngồi đúng tư thế khi học máy tính',
          },
          {
            id: 'td-1-2',
            type: 'quiz',
            title: 'Chọn tư thế ngồi đúng',
            content: 'Khi ngồi học trên máy tính, lưng của chúng ta nên như thế nào?',
            instructions: 'Chọn tư thế ngồi tốt nhất cho cột sống của con',
            options: ['Còng lưng sát vào màn hình', 'Ngồi thẳng lưng thoải mái', 'Nằm ra bàn học'],
            correctAnswer: 'Ngồi thẳng lưng thoải mái'
          }
        ]
      }
    ]
  }
];
