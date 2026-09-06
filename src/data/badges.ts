import { Badge } from '@/types/badge';

/**
 * Danh mục Huy hiệu Tốc độ Linh vật (Animal Mastery Speed Badges)
 * Khớp hoàn toàn với các mốc giọng đọc hiện có trong TypingPractice.tsx
 */
export const ANIMAL_SPEED_BADGES: Badge[] = [
  {
    id: 'speed_turtle',
    name: 'Rùa Con Đáng Yêu',
    title: 'Gõ chậm rãi và cẩn thận',
    category: 'speed',
    tier: 'seedling',
    emoji: '🐢',
    desc: 'Bé gõ nắn nót, kiên nhẫn từng phím một (< 10 WPM)',
    voicePrompt: 'Bé gõ chậm rãi và rất cẩn thận như chú rùa đáng yêu',
    audioFile: '/audio/be-go-cham-rai-va-rat-can-than-nhu-chu-rua-dang-yeu.wav',
    wpmRequirement: 5,
    color: 'bg-emerald-50 border-emerald-300 text-emerald-900 shadow-emerald-100'
  },
  {
    id: 'speed_bunny',
    name: 'Thỏ Con Tinh Nghịch',
    title: 'Gõ nhịp nhàng và nhanh nhẹn',
    category: 'speed',
    tier: 'bronze',
    emoji: '🐰',
    desc: 'Đạt tốc độ gõ nhịp nhàng từ 10 - 24 WPM',
    voicePrompt: 'Bé gõ nhịp nhàng và nhanh nhẹn như chú thỏ tinh nghịch',
    audioFile: '/audio/be-go-nhip-nhang-va-nhanh-nhen-nhu-chu-tho-tinh-nghich.wav',
    wpmRequirement: 10,
    color: 'bg-amber-50 border-amber-300 text-amber-900 shadow-amber-100'
  },
  {
    id: 'speed_leopard',
    name: 'Báo Gấm Dũng Mãnh',
    title: 'Siêu tốc độ vượt trội',
    category: 'speed',
    tier: 'gold',
    emoji: '🐆',
    desc: 'Đạt tốc độ thần tốc từ 25 WPM trở lên',
    voicePrompt: 'Bé gõ siêu tốc độ như chú báo dũng mãnh',
    audioFile: '/audio/be-go-sieu-toc-do-nhu-chu-bao-dung-manh.wav',
    wpmRequirement: 25,
    color: 'bg-rose-50 border-rose-300 text-rose-900 shadow-rose-100'
  }
];

/**
 * Danh mục Huy hiệu Thành tựu & Kỷ niệm Mini-game (Achievement & Activity Badges)
 * Khớp hoàn toàn với các audio khen thưởng xuất sắc và mini-game có sẵn
 */
export const ACHIEVEMENT_BADGES: Badge[] = [
  {
    id: 'first_lesson',
    name: 'Nhà Thám Hiểm Nhí',
    title: 'Hoàn thành bài học đầu tiên',
    category: 'milestone',
    tier: 'seedling',
    emoji: '🦖',
    desc: 'Hoàn thành bài luyện gõ đầu tiên của bé',
    voicePrompt: 'Chúc mừng bé yêu gõ chữ rất giỏi',
    audioFile: '/audio/chuc-mung-be-yeu-go-chu-rat-gioi.wav',
    color: 'bg-teal-50 border-teal-300 text-teal-900 shadow-teal-100'
  },
  {
    id: 'accuracy_100',
    name: 'Bách Phát Bách Trúng',
    title: 'Gõ chính xác 100%',
    category: 'accuracy',
    tier: 'gold',
    emoji: '🎯',
    desc: 'Gõ chuẩn xác tuyệt đối 100% trong bài tập',
    voicePrompt: 'Quá xuất sắc bé ơi!',
    audioFile: '/audio/xuat_sac.wav',
    accuracyRequirement: 100,
    color: 'bg-pink-50 border-pink-300 text-pink-900 shadow-pink-100'
  },
  {
    id: 'streak_3',
    name: 'Chiến Binh Chăm Chỉ',
    title: 'Chuỗi học 3 ngày liên tiếp',
    category: 'streak',
    tier: 'bronze',
    emoji: '🔥',
    desc: 'Giữ ngọn lửa học tập kiên trì từ 3 ngày trở lên',
    voicePrompt: 'Bé đang học rất giỏi, cố lên nhé',
    audioFile: '/audio/be-dang-hoc-rat-gioi-co-len-nhe.wav',
    color: 'bg-orange-50 border-orange-300 text-orange-900 shadow-orange-100'
  },
  {
    id: 'turtle_rescue',
    name: 'Hiệp Sĩ Đại Dương',
    title: 'Giải cứu Rùa Biển',
    category: 'game',
    tier: 'silver',
    emoji: '🌊',
    desc: 'Vượt qua thử thách giải cứu thành công bạn Rùa con',
    voicePrompt: 'Tuyệt vời, con làm tốt lắm',
    audioFile: '/audio/tuyet-voi-con-lam-tot-lam.wav',
    color: 'bg-sky-50 border-sky-300 text-sky-900 shadow-sky-100'
  },
  {
    id: 'game_matching',
    name: 'Bậc Thầy Ghép Thẻ',
    title: 'Nối chữ tài tình',
    category: 'game',
    tier: 'silver',
    emoji: '🧩',
    desc: 'Ghép đúng toàn bộ các cặp hình và chữ cái',
    voicePrompt: 'Tuyệt vời bạn đã ghép đúng hết',
    audioFile: '/audio/tuyet-voi-ban-da-ghep-dung-het.wav',
    color: 'bg-indigo-50 border-indigo-300 text-indigo-900 shadow-indigo-100'
  },
  {
    id: 'game_bubble',
    name: 'Thợ Săn Bong Bóng',
    title: 'Phản xạ chuột siêu nhạy',
    category: 'game',
    tier: 'silver',
    emoji: '🎈',
    desc: 'Rê chuột làm vỡ toàn bộ bong bóng bay trên màn hình',
    voicePrompt: 'Tuyệt vời bé đã làm vỡ toàn bộ bong bóng rồi',
    audioFile: '/audio/tuyet-voi-be-da-lam-vo-toan-bo-bong-bong-roi.wav',
    color: 'bg-purple-50 border-purple-300 text-purple-900 shadow-purple-100'
  },
  {
    id: 'practice_master',
    name: 'Bậc Thầy Mặt Trời',
    title: 'Xuất sắc mọi bài học',
    category: 'milestone',
    tier: 'rainbow',
    emoji: '🌟',
    desc: 'Hoàn thành trọn vẹn toàn bộ các phần luyện tập',
    voicePrompt: 'Tuyệt vời ông mặt trời, bé đã hoàn thành xuất sắc tất cả các bài luyện tập rồi đó',
    audioFile: '/audio/tuyet-voi-ong-mat-troi-be-da-hoan-thanh-xuat-sac-tat-ca-cac-bai-luyen-tap-roi-do.wav',
    color: 'bg-amber-50 border-amber-400 text-amber-950 shadow-amber-200'
  }
];

export const ALL_BADGES: Badge[] = [...ANIMAL_SPEED_BADGES, ...ACHIEVEMENT_BADGES];
