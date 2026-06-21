'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Volume2, Mic, Check, ChevronLeft, ChevronRight, 
  Sparkles, Trophy, RotateCcw, BookOpen, Star, X, Award
} from 'lucide-react';
import { useSound } from '@/contexts/SoundContext';
import { useStudent } from '@/contexts/StudentContext';
import { useWebSpeech } from '@/hooks/useWebSpeech';
import confetti from 'canvas-confetti';
import VisualWorldBackground from '@/components/VisualWorldBackground';

// Kiểu dữ liệu cho ví dụ từ vựng
interface AlphabetExample {
  word: string;
  emoji: string;
  sentence: string;
}

// Kiểu dữ liệu cho mỗi chữ cái
interface AlphabetLetter {
  id: string;
  letter: string;
  uppercase: string;
  word: string;
  emoji: string;
  spelling: string;
  sentence: string;
  tip: string;
  color: string;
  borderColor: string;
  examples: AlphabetExample[];
}

// 29 chữ cái tiếng Việt cùng hình ảnh và câu ví dụ sinh động
const ALPHABET_DATA: AlphabetLetter[] = [
  { 
    id: 'a', letter: 'a', uppercase: 'A', word: 'quả na', emoji: '🍈', spelling: 'a - n - a - na', sentence: 'Bé ăn quả na chín ngọt.', tip: 'Bụng tròn xoe, nét móc ngắn bên phải.', color: 'from-pink-100 to-pink-200 text-pink-700', borderColor: 'border-pink-300',
    examples: [
      { word: 'quả na', emoji: '🍈', sentence: 'Bé ăn quả na chín ngọt.' },
      { word: 'con cá', emoji: '🐟', sentence: 'Con cá bơi lội dưới làn nước.' },
      { word: 'cái ca', emoji: '🥤', sentence: 'Bé uống nước bằng cái ca.' }
    ]
  },
  { 
    id: 'aw', letter: 'ă', uppercase: 'Ă', word: 'con tằm', emoji: '🐛', spelling: 'ă - t - tăm - huyền - tằm', sentence: 'Con tằm ăn lá dâu tơ.', tip: 'Đội thêm vầng trăng khuyết ngửa.', color: 'from-orange-100 to-orange-200 text-orange-700', borderColor: 'border-orange-300',
    examples: [
      { word: 'con tằm', emoji: '🐛', sentence: 'Con tằm ăn lá dâu tơ.' },
      { word: 'khăn tay', emoji: '🧣', sentence: 'Bé tự lau tay bằng khăn.' },
      { word: 'mắt bé', emoji: '👀', sentence: 'Mắt bé tròn xoe lấp lánh.' }
    ]
  },
  { 
    id: 'aa', letter: 'â', uppercase: 'Â', word: 'cái cân', emoji: '⚖️', spelling: 'â - c - ân - cân', sentence: 'Cái cân dùng đo cân nặng.', tip: 'Đội nón úp giống như cái mái nhà.', color: 'from-amber-100 to-amber-200 text-amber-700', borderColor: 'border-amber-300',
    examples: [
      { word: 'cái cân', emoji: '⚖️', sentence: 'Cái cân dùng đo cân nặng.' },
      { word: 'quả mận', emoji: '🍒', sentence: 'Quả mận chín đỏ ngọt thơm.' },
      { word: 'đôi chân', emoji: '👣', sentence: 'Đôi chân bé đi lon ton.' }
    ]
  },
  { 
    id: 'b', letter: 'b', uppercase: 'B', word: 'quả bơ', emoji: '🥑', spelling: 'bờ - ơ - bơ', sentence: 'Quả bơ sáp béo ngậy thơm ngon.', tip: 'Nét đứng cao, bụng tròn to bên phải.', color: 'from-yellow-100 to-yellow-200 text-yellow-700', borderColor: 'border-yellow-300',
    examples: [
      { word: 'quả bơ', emoji: '🥑', sentence: 'Quả bơ sáp béo ngậy thơm ngon.' },
      { word: 'con bò', emoji: '🐄', sentence: 'Con bò ăn cỏ trên đồng.' },
      { word: 'quả bóng', emoji: '⚽', sentence: 'Bé chơi đá bóng cùng bạn.' }
    ]
  },
  { 
    id: 'c', letter: 'c', uppercase: 'C', word: 'con cá', emoji: '🐟', spelling: 'cờ - a - ca - sắc - cá', sentence: 'Con cá bơi lội dưới làn nước.', tip: 'Cong cong như vầng trăng khuyết mở rộng.', color: 'from-lime-100 to-lime-200 text-lime-700', borderColor: 'border-lime-300',
    examples: [
      { word: 'con cá', emoji: '🐟', sentence: 'Con cá bơi lội dưới làn nước.' },
      { word: 'cái ca', emoji: '🥤', sentence: 'Bé uống nước bằng cái ca.' },
      { word: 'con cò', emoji: '🦩', sentence: 'Con cò bay lả bay la.' }
    ]
  },
  { 
    id: 'd', letter: 'd', uppercase: 'D', word: 'con dê', emoji: '🐐', spelling: 'dờ - ê - dê', sentence: 'Con dê trắng kêu he he ăn cỏ.', tip: 'Bụng tròn bên trái, nét đứng cao bên phải.', color: 'from-green-100 to-green-200 text-green-700', borderColor: 'border-green-300',
    examples: [
      { word: 'con dê', emoji: '🐐', sentence: 'Con dê trắng kêu he he ăn cỏ.' },
      { word: 'quả dừa', emoji: '🥥', sentence: 'Quả dừa xiêm ngọt lịm.' },
      { word: 'cây dù', emoji: '☂️', sentence: 'Bé đi dù che nắng.' }
    ]
  },
  { 
    id: 'dd', letter: 'đ', uppercase: 'Đ', word: 'quả đu đủ', emoji: '🥭', spelling: 'đờ - u - đu - dờ - u - du', sentence: 'Quả đu đủ chín vàng ngọt mát.', tip: 'Giống chữ d nhưng có thêm gạch ngang.', color: 'from-emerald-100 to-emerald-200 text-emerald-700', borderColor: 'border-emerald-300',
    examples: [
      { word: 'quả đu đủ', emoji: '🥭', sentence: 'Quả đu đủ chín vàng ngọt mát.' },
      { word: 'đèn pin', emoji: '🔦', sentence: 'Đèn pin chiếu sáng trong bóng đêm.' },
      { word: 'đường đi', emoji: '🛣️', sentence: 'Bé đi học trên đường làng.' }
    ]
  },
  { 
    id: 'e', letter: 'e', uppercase: 'E', word: 'em bé', emoji: '👶', spelling: 'e - m - em - bờ - ê - bê - sắc - bé', sentence: 'Em bé cười tươi chào ông bà.', tip: 'Vòng thắt đầu rồi cong tròn sang trái.', color: 'from-teal-100 to-teal-200 text-teal-700', borderColor: 'border-teal-300',
    examples: [
      { word: 'em bé', emoji: '👶', sentence: 'Em bé cười tươi chào ông bà.' },
      { word: 'quả me', emoji: '🫛', sentence: 'Quả me chua chua ngọt ngọt.' },
      { word: 'xe tre', emoji: '🎋', sentence: 'Mẹ mua cho bé xe tre.' }
    ]
  },
  { 
    id: 'ee', letter: 'ê', uppercase: 'Ê', word: 'con ếch', emoji: '🐸', spelling: 'ê - ch - ếch - sắc - ếch', sentence: 'Con ếch nhảy nhót dưới trời mưa.', tip: 'Giống chữ e nhưng đội nón xuôi xinh xắn.', color: 'from-cyan-100 to-cyan-200 text-cyan-700', borderColor: 'border-cyan-300',
    examples: [
      { word: 'con ếch', emoji: '🐸', sentence: 'Con ếch nhảy nhót dưới trời mưa.' },
      { word: 'cái ghế', emoji: '🪑', sentence: 'Bé ngồi học bài trên cái ghế.' },
      { word: 'bê con', emoji: '🐂', sentence: 'Chú bê con lon ton theo mẹ.' }
    ]
  },
  { 
    id: 'g', letter: 'g', uppercase: 'G', word: 'con gà', emoji: '🐓', spelling: 'gờ - a - ga - huyền - gà', sentence: 'Con gà trống gáy vang ó ó o.', tip: 'Cái đầu tròn trịa, đuôi dài cong xuống dưới.', color: 'from-sky-100 to-sky-200 text-sky-700', borderColor: 'border-sky-300',
    examples: [
      { word: 'con gà', emoji: '🐓', sentence: 'Con gà trống gáy vang ó ó o.' },
      { word: 'cái gương', emoji: '🪞', sentence: 'Bé soi gương cười tươi rói.' },
      { word: 'viên gạch', emoji: '🧱', sentence: 'Bố dùng gạch xây nhà.' }
    ]
  },
  { 
    id: 'h', letter: 'h', uppercase: 'H', word: 'bông hoa', emoji: '🌸', spelling: 'hờ - oa - hoa', sentence: 'Bông hoa hồng nở rực rỡ.', tip: 'Nét đứng cao nối liền nét móc xuôi tròn.', color: 'from-blue-100 to-blue-200 text-blue-700', borderColor: 'border-blue-300',
    examples: [
      { word: 'bông hoa', emoji: '🌸', sentence: 'Bông hoa hồng nở rực rỡ.' },
      { word: 'cái hộp', emoji: '📦', sentence: 'Bé cất đồ chơi vào cái hộp.' },
      { word: 'con hạc', emoji: '🦩', sentence: 'Con hạc giấy màu hồng.' }
    ]
  },
  { 
    id: 'i', letter: 'i', uppercase: 'I', word: 'viên bi', emoji: '🔮', spelling: 'bờ - i - bi', sentence: 'Bé chơi bi ve tròn xoe.', tip: 'Nét đứng ngắn có chấm tròn hạt ngọc.', color: 'from-indigo-100 to-indigo-200 text-indigo-700', borderColor: 'border-indigo-300',
    examples: [
      { word: 'viên bi', emoji: '🔮', sentence: 'Bé chơi bi ve tròn xoe.' },
      { word: 'cái ti', emoji: '🍼', sentence: 'Bình sữa của em bé có cái ti.' },
      { word: 'quả thị', emoji: '🍊', sentence: 'Quả thị thơm cô Tấm bước ra.' }
    ]
  },
  { 
    id: 'k', letter: 'k', uppercase: 'K', word: 'cây kem', emoji: '🍦', spelling: 'cờ - em - kem', sentence: 'Cây kem dâu tây mát lạnh.', tip: 'Nét đứng cao kèm hai nét xiên như răng nhỏ.', color: 'from-violet-100 to-violet-200 text-violet-700', borderColor: 'border-violet-300',
    examples: [
      { word: 'cây kem', emoji: '🍦', sentence: 'Cây kem dâu tây mát lạnh.' },
      { word: 'cái kéo', emoji: '✂️', sentence: 'Bé dùng cái kéo cắt giấy màu.' },
      { word: 'cái kính', emoji: '👓', sentence: 'Bà đeo kính đọc báo.' }
    ]
  },
  { 
    id: 'l', letter: 'l', uppercase: 'L', word: 'quả lê', emoji: '🍐', spelling: 'lờ - ê - lê', sentence: 'Quả lê ngọt mát mọng nước.', tip: 'Một nét khuyết xuôi cao vút như chiếc gậy.', color: 'from-purple-100 to-purple-200 text-purple-700', borderColor: 'border-purple-300',
    examples: [
      { word: 'quả lê', emoji: '🍐', sentence: 'Quả lê ngọt mát mọng nước.' },
      { word: 'lá cây', emoji: '🍃', sentence: 'Lá cây xanh rì rào trong gió.' },
      { word: 'cái lọ', emoji: '🏺', sentence: 'Mẹ cắm hoa vào cái lọ.' }
    ]
  },
  { 
    id: 'm', letter: 'm', uppercase: 'M', word: 'con mèo', emoji: '🐱', spelling: 'mờ - eo - meo - huyền - mèo', sentence: 'Con mèo lười sưởi nắng ấm áp.', tip: 'Hai nét móc xuôi nối liền nhau tròn trịa.', color: 'from-fuchsia-100 to-fuchsia-200 text-fuchsia-700', borderColor: 'border-fuchsia-300',
    examples: [
      { word: 'con mèo', emoji: '🐱', sentence: 'Con mèo lười sưởi nắng ấm áp.' },
      { word: 'quả mơ', emoji: '🍑', sentence: 'Quả mơ chín có vị chua.' },
      { word: 'đám mây', emoji: '☁️', sentence: 'Đám mây trắng bay lơ lửng.' }
    ]
  },
  { 
    id: 'n', letter: 'n', uppercase: 'N', word: 'quả nho', emoji: '🍇', spelling: 'nhờ - o - nho', sentence: 'Chùm quả nho chín tím mọng.', tip: 'Một nét móc xuôi đơn giản, dễ thương.', color: 'from-pink-100 to-pink-200 text-pink-700', borderColor: 'border-pink-300',
    examples: [
      { word: 'quả nho', emoji: '🍇', sentence: 'Chùm quả nho chín tím mọng.' },
      { word: 'cái nơ', emoji: '🎀', sentence: 'Bé gái cài cái nơ hồng.' },
      { word: 'ngôi nhà', emoji: '🏠', sentence: 'Ngôi nhà của bé rất ấm cúng.' }
    ]
  },
  { 
    id: 'o', letter: 'o', uppercase: 'O', word: 'con ong', emoji: '🐝', spelling: 'o - ng - ong', sentence: 'Con ong vàng chăm chỉ hút mật.', tip: 'Tròn xoe như quả trứng gà.', color: 'from-rose-100 to-rose-200 text-rose-700', borderColor: 'border-rose-300',
    examples: [
      { word: 'con ong', emoji: '🐝', sentence: 'Con ong vàng chăm chỉ hút mật.' },
      { word: 'quả nho', emoji: '🍇', sentence: 'Chùm quả nho chín tím mọng.' },
      { word: 'củ tỏi', emoji: '🧄', sentence: 'Mẹ dùng củ tỏi để nấu ăn.' }
    ]
  },
  { 
    id: 'oo', letter: 'ô', uppercase: 'Ô', word: 'cái ô', emoji: '🌂', spelling: 'ô', sentence: 'Cái ô đỏ che bóng mát cho bé.', tip: 'Giống chữ o nhưng đội nón úp che đầu.', color: 'from-orange-100 to-orange-200 text-orange-700', borderColor: 'border-orange-300',
    examples: [
      { word: 'cái ô', emoji: '🌂', sentence: 'Cái ô đỏ che bóng mát cho bé.' },
      { word: 'hộp số', emoji: '🔢', sentence: 'Bé học đếm các chữ số.' },
      { word: 'con hổ', emoji: '🐅', sentence: 'Con hổ gầm vang trong rừng sâu.' }
    ]
  },
  { 
    id: 'ow', letter: 'ơ', uppercase: 'Ơ', word: 'lá cờ', emoji: '🚩', spelling: 'cờ - ơ - cơ - huyền - cờ', sentence: 'Lá cờ đỏ sao vàng bay phất phơ.', tip: 'Giống chữ o nhưng có thêm chiếc râu nhỏ.', color: 'from-amber-100 to-amber-200 text-amber-700', borderColor: 'border-amber-300',
    examples: [
      { word: 'lá cờ', emoji: '🚩', sentence: 'Lá cờ đỏ sao vàng bay phất phơ.' },
      { word: 'quả mơ', emoji: '🍑', sentence: 'Quả mơ chín có vị chua.' },
      { word: 'cái chợ', emoji: '🏪', sentence: 'Bà đi chợ mua rau tươi.' }
    ]
  },
  { 
    id: 'p', letter: 'p', uppercase: 'P', word: 'đèn pin', emoji: '🔦', spelling: 'đờ - en - đen - huyền - đèn - p - in - pin', sentence: 'Đèn pin chiếu sáng trong đêm tối.', tip: 'Nét đứng kéo xuống, bụng tròn bên phải.', color: 'from-yellow-100 to-yellow-200 text-yellow-700', borderColor: 'border-yellow-300',
    examples: [
      { word: 'đèn pin', emoji: '🔦', sentence: 'Đèn pin chiếu sáng trong đêm tối.' },
      { word: 'súp lơ', emoji: '🥦', sentence: 'Bé ăn súp lơ xanh giòn ngon.' },
      { word: 'cặp da', emoji: '💼', sentence: 'Bố xách cặp da đi làm.' }
    ]
  },
  { 
    id: 'q', letter: 'q', uppercase: 'Q', word: 'quả quýt', emoji: '🍊', spelling: 'quờ - yt - quýt - sắc - quýt', sentence: 'Quả quýt chua ngọt nhiều vitamin.', tip: 'Bụng tròn bên trái, nét đứng dài bên phải.', color: 'from-lime-100 to-lime-200 text-lime-700', borderColor: 'border-lime-300',
    examples: [
      { word: 'quả quýt', emoji: '🍊', sentence: 'Quả quýt chua ngọt nhiều vitamin.' },
      { word: 'cây quạt', emoji: '🪭', sentence: 'Cây quạt giấy xua tan nóng nực.' },
      { word: 'quà tặng', emoji: '🎁', sentence: 'Bé nhận quà tặng sinh nhật.' }
    ]
  },
  { 
    id: 'r', letter: 'r', uppercase: 'R', word: 'con rùa', emoji: '🐢', spelling: 'rờ - ua - rua - huyền - rùa', sentence: 'Con rùa con bò chậm chạp.', tip: 'Nét đứng ngắn có chiếc tai nhỏ vểnh phải.', color: 'from-green-100 to-green-200 text-green-700', borderColor: 'border-green-300',
    examples: [
      { word: 'con rùa', emoji: '🐢', sentence: 'Con rùa con bò chậm chạp.' },
      { word: 'rổ tre', emoji: '🧺', sentence: 'Mẹ đựng quả chín vào rổ tre.' },
      { word: 'cái rìu', emoji: '🪓', sentence: 'Tiều phu dùng rìu đốn củi.' }
    ]
  },
  { 
    id: 's', letter: 's', uppercase: 'S', word: 'ngôi sao', emoji: '⭐', spelling: 'sờ - ao - sao', sentence: 'Ngôi sao lấp lánh trên trời cao.', tip: 'Uốn lượn cong cong như chú rắn nhỏ.', color: 'from-teal-100 to-teal-200 text-teal-700', borderColor: 'border-teal-300',
    examples: [
      { word: 'ngôi sao', emoji: '⭐', sentence: 'Ngôi sao lấp lánh trên trời cao.' },
      { word: 'củ sả', emoji: '🧄', sentence: 'Củ sả có mùi thơm dễ chịu.' },
      { word: 'hoa sen', emoji: '🪷', sentence: 'Bông hoa sen nở thơm ngát hồ.' }
    ]
  },
  { 
    id: 't', letter: 't', uppercase: 'T', word: 'quả táo', emoji: '🍎', spelling: 'tờ - ao - tao - sắc - táo', sentence: 'Quả táo đỏ giòn ngọt thơm phức.', tip: 'Nét đứng thẳng có gạch ngang ở ngực.', color: 'from-cyan-100 to-cyan-200 text-cyan-700', borderColor: 'border-cyan-300',
    examples: [
      { word: 'quả táo', emoji: '🍎', sentence: 'Quả táo đỏ giòn ngọt thơm phức.' },
      { word: 'cái tai', emoji: '👂', sentence: 'Bé dùng đôi tai để nghe nhạc.' },
      { word: 'con tôm', emoji: '🦐', sentence: 'Con tôm nhảy tanh tách dưới sông.' }
    ]
  },
  { 
    id: 'u', letter: 'u', uppercase: 'U', word: 'cái mũ', emoji: '👒', spelling: 'mờ - u - mu - ngã - mũ', sentence: 'Cái mũ vải bảo vệ đầu bé.', tip: 'Cái móc dưới rộng rãi mở lên trên.', color: 'from-sky-100 to-sky-200 text-sky-700', borderColor: 'border-sky-300',
    examples: [
      { word: 'cái mũ', emoji: '👒', sentence: 'Cái mũ vải bảo vệ đầu bé.' },
      { word: 'quả đu đủ', emoji: '🥭', sentence: 'Quả đu đủ chín ngọt bổ dưỡng.' },
      { word: 'hộp sữa', emoji: '🥛', sentence: 'Bé uống một hộp sữa mỗi sáng.' }
    ]
  },
  { 
    id: 'uw', letter: 'ư', uppercase: 'Ư', word: 'con hươu', emoji: '🦌', spelling: 'hờ - ươu - hươu', sentence: 'Con hươu sao ăn lá non trong rừng.', tip: 'Giống chữ u nhưng có chiếc râu nhỏ bên phải.', color: 'from-blue-100 to-blue-200 text-blue-700', borderColor: 'border-blue-300',
    examples: [
      { word: 'con hươu', emoji: '🦌', sentence: 'Con hươu sao ăn lá non trong rừng.' },
      { word: 'lá thư', emoji: '✉️', sentence: 'Bé viết lá thư gửi tặng ông bà.' },
      { word: 'cử tạ', emoji: '🏋️', sentence: 'Vận động viên đang cử tạ khỏe mạnh.' }
    ]
  },
  { 
    id: 'v', letter: 'v', uppercase: 'V', word: 'con vịt', emoji: '🦆', spelling: 'vờ - yt - vịt - nặng - vịt', sentence: 'Con vịt kêu cạp cạp tìm mồi.', tip: 'Hai nét xiên gặp nhau ở dưới đáy nhọn.', color: 'from-indigo-100 to-indigo-200 text-indigo-700', borderColor: 'border-indigo-300',
    examples: [
      { word: 'con vịt', emoji: '🦆', sentence: 'Con vịt kêu cạp cạp tìm mồi.' },
      { word: 'ví da', emoji: '👛', sentence: 'Mẹ đựng tiền trong chiếc ví da.' },
      { word: 'vẽ tranh', emoji: '🎨', sentence: 'Bé thích vẽ tranh phong cảnh.' }
    ]
  },
  { 
    id: 'x', letter: 'x', uppercase: 'X', word: 'cái xô', emoji: '🪣', spelling: 'sờ - ô - xô', sentence: 'Cái xô nhựa dùng đựng nước.', tip: 'Hai nét xiên chéo nhau như chiếc kéo.', color: 'from-violet-100 to-violet-200 text-violet-700', borderColor: 'border-violet-300',
    examples: [
      { word: 'cái xô', emoji: '🪣', sentence: 'Cái xô nhựa dùng đựng nước.' },
      { word: 'xe lu', emoji: '🚜', sentence: 'Xe lu làm đường phẳng lì.' },
      { word: 'cái xẻng', emoji: '♠️', sentence: 'Bé dùng xẻng xúc cát xây lâu đài.' }
    ]
  },
  { 
    id: 'y', letter: 'y', uppercase: 'Y', word: 'y tá', emoji: '🧑‍⚕️', spelling: 'y - tờ - a - ta - sắc - tá', sentence: 'Cô y tá dịu dàng chăm sóc bé.', tip: 'Nét xiên ngắn trái và nét xiên dài có đuôi.', color: 'from-purple-100 to-purple-200 text-purple-700', borderColor: 'border-purple-300',
    examples: [
      { word: 'y tá', emoji: '🧑‍⚕️', sentence: 'Cô y tá dịu dàng chăm sóc bé.' },
      { word: 'chim yến', emoji: '🐦', sentence: 'Đàn chim yến bay lượn trên trời.' },
      { word: 'cái yếm', emoji: '👶', sentence: 'Em bé đeo yếm để ăn bột.' }
    ]
  }
];

// Định nghĩa các trang của cuốn sách: 6 item trên 1 tờ giấy (trang) - Grid 2x3 cực kỳ thoáng và cân đối
const SPREADS = [
  { 
    left: [ALPHABET_DATA[0], ALPHABET_DATA[1], ALPHABET_DATA[2], ALPHABET_DATA[3], ALPHABET_DATA[4], ALPHABET_DATA[5]], // a ă â b c d
    right: [ALPHABET_DATA[6], ALPHABET_DATA[7], ALPHABET_DATA[8], ALPHABET_DATA[9], ALPHABET_DATA[10], ALPHABET_DATA[11]] // đ e ê g h i
  },
  { 
    left: [ALPHABET_DATA[12], ALPHABET_DATA[13], ALPHABET_DATA[14], ALPHABET_DATA[15], ALPHABET_DATA[16], ALPHABET_DATA[17]], // k l m n o ô
    right: [ALPHABET_DATA[18], ALPHABET_DATA[19], ALPHABET_DATA[20], ALPHABET_DATA[21], ALPHABET_DATA[22], ALPHABET_DATA[23]] // ơ p q r s t
  },
  { 
    left: [ALPHABET_DATA[24], ALPHABET_DATA[25], ALPHABET_DATA[26]], // u ư v
    right: [ALPHABET_DATA[27], ALPHABET_DATA[28]] // x y
  }
];

export default function AlphabetBookPage() {
  const router = useRouter();
  const { playSound, playAudio } = useSound();
  const { studentInfo, queueProgress, xp } = useStudent();
  
  // States quản lý sách và hiệu ứng lật trang 3D Flipbook
  const [currentSpreadIndex, setCurrentSpreadIndex] = useState(0);
  const [targetSpreadIndex, setTargetSpreadIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev' | null>(null);

  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const [exploredLetters, setExploredLetters] = useState<Record<string, boolean>>({});
  const [activeListeningId, setActiveListeningId] = useState<string | null>(null);
  const [isBookCompleted, setIsBookCompleted] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [speakSuccessId, setSpeakSuccessId] = useState<string | null>(null);
  const [speakErrorId, setSpeakErrorId] = useState<string | null>(null);

  // States quản lý Bản đồ tư duy từ vựng (Mindmap)
  const [activeMindmapLetter, setActiveMindmapLetter] = useState<AlphabetLetter | null>(null);
  const [selectedExampleIndex, setSelectedExampleIndex] = useState<number>(0);
  const [masteredBranches, setMasteredBranches] = useState<Record<string, boolean>>({});

  // Số lượng chữ cái đã khám phá và phần trăm tiến độ
  const exploredCount = ALPHABET_DATA.filter(item => exploredLetters[item.id]).length;
  const progressPercent = Math.round((exploredCount / ALPHABET_DATA.length) * 100);

  // Đánh dấu chữ cái bé đã học
  const markLetterAsExplored = (id: string) => {
    setExploredLetters(prev => {
      const updated = { ...prev, [id]: true };
      localStorage.setItem('viettyping_explored_letters', JSON.stringify(updated));
      
      // Kiểm tra xem đã học hết 29 chữ cái chưa
      const allExplored = ALPHABET_DATA.every(item => updated[item.id]);
      if (allExplored && !isBookCompleted) {
        setIsBookCompleted(true);
        localStorage.setItem('viettyping_alphabet_book_completed', 'true');
        setTimeout(() => {
          playSound('tada');
          setShowCompletionModal(true);
        }, 1500);
      }
      
      return updated;
    });
  };

  // Khởi động Web Speech
  const {
    isSpeechSupported,
    isListening,
    transcript,
    error: speechError,
    speak,
    stopSpeaking,
    startListening,
    stopListening
  } = useWebSpeech({ lang: 'vi-VN', rate: 0.82, pitch: 1.15 });

  // Tải danh sách chữ cái bé đã từng tương tác ở local
  useEffect(() => {
    try {
      const savedExplored = localStorage.getItem('viettyping_explored_letters');
      if (savedExplored) {
        setExploredLetters(JSON.parse(savedExplored));
      }
      
      const savedBookComplete = localStorage.getItem('viettyping_alphabet_book_completed');
      if (savedBookComplete === 'true') {
        setIsBookCompleted(true);
      }

      const savedMastered = localStorage.getItem('viettyping_mastered_branches');
      if (savedMastered) {
        setMasteredBranches(JSON.parse(savedMastered));
      }
    } catch (e) {
      console.error('Lỗi đọc tiến trình sách:', e);
    }
  }, []);

  // Xử lý Speech Recognition khi bé luyện đọc
  useEffect(() => {
    if (!transcript || !activeListeningId) return;

    const isMindmapListen = activeListeningId.startsWith('mindmap-');
    let currentLetter: AlphabetLetter | undefined;
    let targetSentence = '';
    let targetWord = '';
    let exampleIndex = 0;

    if (isMindmapListen) {
      const parts = activeListeningId.split('-');
      const letterId = parts[1];
      exampleIndex = parseInt(parts[2], 10);
      currentLetter = ALPHABET_DATA.find(item => item.id === letterId);
      if (currentLetter && currentLetter.examples[exampleIndex]) {
        targetSentence = currentLetter.examples[exampleIndex].sentence;
        targetWord = currentLetter.examples[exampleIndex].word;
      }
    } else {
      currentLetter = ALPHABET_DATA.find(item => item.id === activeListeningId);
      if (currentLetter) {
        targetSentence = currentLetter.sentence;
        targetWord = currentLetter.word;
      }
    }

    if (!currentLetter || !targetSentence) return;

    const cleanString = (str: string) => {
      return str
        .toLowerCase()
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
        .replace(/\s+/g, " ")
        .trim();
    };

    const cleanTranscript = cleanString(transcript);
    const cleanTarget = cleanString(targetSentence);

    // Kiểm tra độ tương đồng
    const targetWords = cleanTarget.split(' ');
    const spokenWords = cleanTranscript.split(' ');
    
    let matchCount = 0;
    targetWords.forEach(w => {
      if (spokenWords.includes(w)) matchCount++;
    });

    const isMatch = (matchCount / targetWords.length) >= 0.65 || cleanTranscript.includes(cleanString(targetWord));

    if (isMatch) {
      setSpeakSuccessId(activeListeningId);
      playSound('correct');
      
      confetti({
        particleCount: 30,
        spread: 60,
        origin: { y: 0.75 }
      });

      if (isMindmapListen) {
        const letterId = currentLetter.id;
        const branchKey = `${letterId}-${exampleIndex}`;
        
        if (!masteredBranches[branchKey]) {
          // Thưởng 5 XP cho nhánh này
          queueProgress('viettyping_alphabet_book', progressPercent, 5, xp + 5);
          
          setMasteredBranches(prev => {
            const updated = { ...prev, [branchKey]: true };
            localStorage.setItem('viettyping_mastered_branches', JSON.stringify(updated));
            
            // Kiểm tra xem đã làm chủ cả 3 nhánh chưa
            const has0 = !!updated[`${letterId}-0`];
            const has1 = !!updated[`${letterId}-1`];
            const has2 = !!updated[`${letterId}-2`];
            
            if (has0 && has1 && has2) {
              setTimeout(() => {
                playSound('tada');
                confetti({
                  particleCount: 80,
                  spread: 80,
                  origin: { y: 0.6 }
                });
              }, 600);
              
              // Đánh dấu đã học chữ cái
              markLetterAsExplored(letterId);
            }
            
            return updated;
          });
        }
      } else {
        markLetterAsExplored(currentLetter.id);
      }

      setTimeout(() => {
        setSpeakSuccessId(null);
        if (!isMindmapListen) {
          setTimeout(() => {
            setFlippedCards(prev => ({ ...prev, [activeListeningId]: false }));
          }, 1000);
        }
        setActiveListeningId(null);
      }, 2500);
    } else {
      setSpeakErrorId(activeListeningId);
      playSound('wrong');
      
      setTimeout(() => {
        setSpeakErrorId(null);
      }, 2500);
    }
  }, [transcript, activeListeningId, masteredBranches, progressPercent, xp, queueProgress, playSound, markLetterAsExplored]);



  // Phát âm chữ cái ngắn gọn: "A - quả na"
  const handlePlayAudio = (e: React.MouseEvent, letter: AlphabetLetter) => {
    e.stopPropagation();
    stopSpeaking();
    stopListening();
    setActiveListeningId(null);
    
    const textToSpeak = `${letter.uppercase}, ${letter.word}.`;
    speak(textToSpeak, 'vi-VN');
    markLetterAsExplored(letter.id);
  };

  // Phát âm câu ví dụ
  const handlePlaySentence = (e: React.MouseEvent, letter: AlphabetLetter) => {
    e.stopPropagation();
    stopSpeaking();
    speak(letter.sentence, 'vi-VN');
  };

  // Kích hoạt Micro luyện đọc
  const handleStartMic = (e: React.MouseEvent, letter: AlphabetLetter) => {
    e.stopPropagation();
    if (activeListeningId === letter.id && isListening) {
      stopListening();
      setActiveListeningId(null);
      playSound('click');
    } else {
      playSound('click');
      setActiveListeningId(letter.id);
      startListening('vi-VN');
    }
  };

  // Lật card 3D
  const handleCardFlip = (id: string) => {
    if (activeListeningId) {
      stopListening();
      setActiveListeningId(null);
    }
    playSound('pop');
    setFlippedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Kích hoạt hiệu ứng lật trang 3D Flipbook
  const changeSpread = (direction: 'next' | 'prev') => {
    if (isFlipping) return;

    stopSpeaking();
    stopListening();
    setActiveListeningId(null);

    const nextIndex = direction === 'next' ? currentSpreadIndex + 1 : currentSpreadIndex - 1;
    if (nextIndex < 0 || nextIndex >= SPREADS.length) return;

    playSound('click');
    
    setFlipDirection(direction);
    setIsFlipping(true);
    setTargetSpreadIndex(nextIndex);

    setTimeout(() => {
      setCurrentSpreadIndex(nextIndex);
    }, 300);

    setTimeout(() => {
      setIsFlipping(false);
      setFlipDirection(null);
    }, 600);
  };

  // Hoàn thành cuốn sách, nhận thưởng 200 XP
  const handleClaimReward = () => {
    playSound('coin');
    queueProgress('viettyping_alphabet_book', 100, 20, 100);
    setShowCompletionModal(false);
    router.push('/');
  };

  // Học lại từ đầu
  const handleResetProgress = () => {
    if (confirm('Bé có muốn học lại Cuốn Sách Chữ Cái từ đầu không?')) {
      playSound('click');
      setExploredLetters({});
      setFlippedCards({});
      setIsBookCompleted(false);
      localStorage.removeItem('viettyping_explored_letters');
      localStorage.removeItem('viettyping_alphabet_book_completed');
      setCurrentSpreadIndex(0);
      setTargetSpreadIndex(0);
    }
  };



  // Render các chữ cái trên một trang (Lưới 2x3 rộng rãi thoải mái)
  const renderPageSide = (letters: AlphabetLetter[], pageNum: number, isRightPage: boolean) => {
    return (
      <div className={`flex flex-col justify-between h-full p-5 md:p-7 bg-amber-50/20 rounded-2xl relative select-none ${isRightPage ? 'border-l border-stone-200' : ''}`}>
        
        {/* Lưới 6 chữ cái trong trang sách - Grid 2x3 cực thoáng */}
        <div className="grid grid-cols-3 gap-4 md:gap-6 flex-1 items-stretch py-2">
          {letters.map((item) => {
            const isFlipped = !!flippedCards[item.id];
            const isExplored = !!exploredLetters[item.id];
            const isMastered = !!masteredBranches[`${item.id}-0`] && 
                               !!masteredBranches[`${item.id}-1`] && 
                               !!masteredBranches[`${item.id}-2`];
            const isListeningThis = activeListeningId === item.id;
            const isSuccess = speakSuccessId === item.id;
            const isError = speakErrorId === item.id;

            return (
              <div 
                key={item.id}
                className="h-full w-full perspective-1000 cursor-pointer"
                onClick={() => handleCardFlip(item.id)}
              >
                <motion.div
                  className="w-full h-full relative preserve-3d transition-transform duration-500"
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  
                  {/* MẶT TRƯỚC: Grid chứa chữ cái, hình ảnh, từ vựng và câu ví dụ hiển thị rõ ràng */}
                  <div
                    className={`absolute inset-0 backface-hidden rounded-3xl p-3 md:p-4 flex flex-col items-center justify-between border-3 bg-gradient-to-b ${item.color} ${item.borderColor} shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)]`}
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    {/* Badge đã học hoặc Đã Làm Chủ */}
                    {isMastered ? (
                      <span className="absolute top-2 right-2 text-yellow-500 bg-white border-2 border-yellow-400 rounded-full p-0.5 shadow-md text-xs animate-bounce" title="Bé đã làm chủ chữ cái!">
                        <Star size={12} className="fill-yellow-400 stroke-yellow-650" />
                      </span>
                    ) : isExplored ? (
                      <span className="absolute top-2 right-2 text-emerald-500 bg-white border border-emerald-300 rounded-full p-0.5 shadow-sm text-xs" title="Bé đã học xong">
                        <Check size={11} className="stroke-[3]" />
                      </span>
                    ) : null}

                    {/* Chữ cái in hoa + in thường */}
                    <div className="text-center">
                      <span className="text-4xl sm:text-5xl md:text-6xl font-black tracking-wide drop-shadow-sm select-none">
                        {item.uppercase} {item.letter}
                      </span>
                    </div>

                    {/* Hình ảnh Emoji lớn rõ nét */}
                    <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-white/80 rounded-full border border-white/60 flex items-center justify-center text-4xl sm:text-5xl md:text-6xl shadow-inner transform hover:scale-105 transition-transform select-none">
                      {item.emoji}
                    </div>

                    {/* Từ khóa + Nút phát âm */}
                    <div className="w-full flex items-center justify-between px-1 shrink-0">
                      <span className="text-xs sm:text-sm md:text-base font-black text-slate-800 tracking-wide capitalize truncate max-w-[80%]">
                        {item.word}
                      </span>
                      <motion.button
                        onClick={(e) => handlePlayAudio(e, item)}
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-1.5 bg-white rounded-full text-slate-700 border border-slate-200 shadow-sm flex items-center justify-center hover:bg-slate-50 cursor-pointer"
                        title="Nghe phát âm"
                      >
                        <Volume2 size={12} className="stroke-[2.5]" />
                      </motion.button>
                    </div>

                    {/* Câu ví dụ hiển thị to rõ nét ở mặt trước */}
                    <div className="w-full bg-white/40 border border-white/50 rounded-xl px-2 py-1 text-center shrink-0 min-h-[36px] md:min-h-[42px] flex items-center justify-center">
                      <p className="text-xs sm:text-sm font-bold text-slate-700 leading-snug line-clamp-2">
                        {item.sentence}
                      </p>
                    </div>
                  </div>

                  {/* MẶT SAU: Bento Grid Đánh vần, Mẹo nhớ và Nút Mở Mindmap */}
                  <div
                    className="absolute inset-0 backface-hidden rounded-3xl p-3 flex flex-col justify-between border-3 bg-white border-indigo-200 shadow-[3px_3px_0px_0px_rgba(99,102,241,0.1)]"
                    style={{ 
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)' 
                    }}
                  >
                    {/* Khối Bento 1: Mẹo nhớ & Đánh vần (Viền nét đứt màu cam ấm) */}
                    <div className="border-2 border-dashed border-amber-400 bg-amber-50/50 rounded-2xl p-2.5 shrink-0 flex flex-col gap-1.5">
                      <div className="text-[10px] sm:text-xs font-black text-amber-800 leading-snug">
                        💡 <span className="text-amber-600 uppercase font-extrabold">Mẹo nhớ:</span> {item.tip}
                      </div>
                      <div className="text-[10px] sm:text-xs font-black text-indigo-800 border-t border-dashed border-amber-300 pt-1.5">
                        🗣️ <span className="text-indigo-600 uppercase font-extrabold">Đánh vần:</span> <span className="text-rose-600 underline decoration-wavy decoration-rose-300">{item.spelling}</span>
                      </div>
                    </div>

                    {/* Phần giữa: Giới thiệu ngắn về Kho báu từ vựng */}
                    <div className="flex-1 flex flex-col items-center justify-center my-1.5 p-1.5 bg-indigo-50/30 border border-dashed border-indigo-100 rounded-2xl">
                      <span className="text-[9px] font-black text-indigo-500 uppercase tracking-wider mb-0.5">🗺️ Bản đồ từ vựng:</span>
                      <p className="text-[10px] font-bold text-slate-650 text-center leading-tight">
                        Chứa 3 ví dụ thú vị để bé khám phá và nhận sao vàng!
                      </p>
                    </div>

                    {/* Nút lớn mở Modal Mindmap */}
                    <div className="shrink-0 pb-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedExampleIndex(0);
                          setActiveMindmapLetter(item);
                          playSound('click');
                          markLetterAsExplored(item.id);
                        }}
                        className="w-full py-2.5 px-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-black text-xs rounded-xl shadow-md border-2 border-indigo-600 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer animate-pulse"
                      >
                        <span>Thám Hiểm Từ Vựng 🗺️</span>
                      </button>
                    </div>
                  </div>

                </motion.div>
              </div>
            );
          })}
        </div>

        {/* Số trang sách */}
        <div className={`text-[10px] font-bold text-slate-400 absolute bottom-2 ${isRightPage ? 'right-6' : 'left-6'}`}>
          Trang {pageNum}
        </div>
      </div>
    );
  };

  const currentSpread = SPREADS[currentSpreadIndex];
  const targetSpread = SPREADS[targetSpreadIndex];

  return (
    <VisualWorldBackground>
      <div className="min-h-screen text-[var(--color-foreground)] flex flex-col pb-6 relative z-10">
        
        {/* Navigation Sticky Header - Gom toàn bộ thông tin chỉ số và hướng dẫn học lên đây */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b-4 border-slate-800 px-4 md:px-6 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                playSound('click');
                router.push('/');
              }}
              className="w-10 h-10 rounded-xl border-2 border-slate-800 bg-white flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
              title="Quay lại trang chủ"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
            </button>
            <div>
              <h1 className="text-xs md:text-sm font-black uppercase tracking-wide text-slate-800 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                <span>SÁCH CHỮ CÁI KỲ THÚ</span>
              </h1>
              {/* Dòng hướng dẫn chạy phụ nhỏ */}
              <p className="hidden md:block text-[9px] font-bold text-slate-500 mt-0.5 leading-none">
                Bé bấm chữ nghe Dino đọc mẫu (ví dụ: <strong className="text-amber-600">"A, quả na"</strong>). Lật card để luyện nói!
              </p>
            </div>
          </div>

          {/* Khối Tiến trình học của bé tích hợp ngay trung tâm Header */}
          <div className="hidden lg:flex flex-col items-center gap-1.5 flex-1 max-w-sm px-6">
            <div className="flex justify-between w-full text-[10px] font-black text-slate-700 leading-none">
              <span>🎒 Bé đã học: <strong className="text-indigo-660">{exploredCount} / 29</strong> chữ cái</span>
              <span className="text-indigo-600">{progressPercent}%</span>
            </div>
            {/* Progress Bar tinh xảo nằm gọn trong Header */}
            <div className="w-full bg-slate-100 border-2 border-slate-800 rounded-full h-3 p-0.5 overflow-hidden shadow-inner relative">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-teal-400 to-indigo-500"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.3 }}
              />
              {progressPercent > 0 && (
                <div 
                  className="absolute top-1/2 -translate-y-1/2 -mt-0.5 text-[10px] transition-all duration-300 select-none pointer-events-none animate-bounce"
                  style={{ left: `calc(${progressPercent}% - 6px)` }}
                >
                  ⭐
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3 shrink-0">
            {/* Điểm XP */}
            <span className="text-xs font-black bg-yellow-100 border-2 border-slate-800 px-2.5 py-1.5 rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-0.5">
              <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
              <span>{xp} XP</span>
            </span>

            {/* Học lại */}
            <button
              onClick={handleResetProgress}
              className="px-2.5 py-1.5 border-2 border-slate-800 rounded-xl bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-600 font-bold text-xs flex items-center gap-0.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[1px] active:shadow-none cursor-pointer"
              title="Học lại từ đầu"
            >
              <RotateCcw size={11} />
              <span className="hidden sm:inline">Học lại</span>
            </button>
          </div>
        </header>

        {/* Nội dung chính: Thiết kế FLUID khổng lồ, để quyển sách nổi bật nhất chiếm trọn trung tâm */}
        <main className="flex-1 w-full max-w-[95vw] lg:max-w-[90vw] mx-auto px-1 md:px-4 pt-4 pb-2 flex flex-col justify-center items-center relative">
          
          {/* Lớp hiển thị tiến độ trên mobile (nếu màn hình nhỏ hơn lg) */}
          <div className="lg:hidden flex items-center justify-between w-full max-w-xl bg-white/70 backdrop-blur-sm border-2 border-slate-800 rounded-xl px-3 py-1.5 mb-3 text-[10px] font-black text-slate-700 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] shrink-0">
            <span>🎒 Bé học: <strong className="text-indigo-600">{exploredCount}/29</strong> chữ</span>
            <div className="w-24 bg-slate-100 border border-slate-800 rounded-full h-2 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-400 to-indigo-500" style={{ width: `${progressPercent}%` }} />
            </div>
            <span>{progressPercent}%</span>
          </div>

          {/* QUYỂN SÁCH MỞ ĐÔI FLUID KHỔNG LỒ */}
          <div className="w-full flex items-stretch h-[calc(100vh-160px)] min-h-[500px] max-h-[800px] relative">
            
            {/* Nút lật trang trái absolute ở rìa trái sách */}
            <div className="absolute left-1 md:-left-6 top-1/2 -translate-y-1/2 z-30">
              <motion.button
                whileHover={{ scale: currentSpreadIndex > 0 ? 1.08 : 1 }}
                whileTap={{ scale: currentSpreadIndex > 0 ? 0.92 : 1 }}
                onClick={() => changeSpread('prev')}
                disabled={currentSpreadIndex === 0 || isFlipping}
                className={`w-11 h-11 sm:w-14 sm:h-14 bg-white border-3 border-slate-800 rounded-full flex items-center justify-center text-slate-800 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-[1px] active:shadow-none hover:bg-indigo-50 transition-all cursor-pointer ${
                  currentSpreadIndex === 0 || isFlipping ? 'opacity-30 cursor-not-allowed shadow-none border-slate-300 text-slate-300 bg-slate-50' : ''
                }`}
                title="Trang trước"
              >
                <ChevronLeft size={24} className="stroke-[3]" />
              </motion.button>
            </div>

            {/* Vỏ bìa sách giả lập gỗ dày dặn */}
            <div className="bg-[#783e16] p-2 md:p-3 rounded-[30px] shadow-[0_24px_56px_rgba(0,0,0,0.3)] border-4 border-amber-950/80 w-full h-full flex relative overflow-hidden z-10">
              
              {/* Trang ruột sách giấy cổ điển mở đôi */}
              <div className="bg-[#fdf9f4] border-4 border-amber-900 rounded-[20px] w-full h-full flex flex-col md:flex-row overflow-hidden relative shadow-inner">
                
                {/* TRANG TRÁI TĨNH */}
                <div className="flex-1 h-full md:block">
                  <div className="md:hidden w-full h-full">
                    {renderPageSide(currentSpread.left, currentSpreadIndex * 2 + 1, false)}
                  </div>
                  <div className="hidden md:block w-full h-full">
                    {renderPageSide(currentSpread.left, currentSpreadIndex * 2 + 1, false)}
                  </div>
                </div>

                {/* GÁY SÁCH Ở GIỮA */}
                <div className="hidden md:flex w-7.5 bg-gradient-to-r from-stone-200 via-stone-400 to-stone-200 border-l border-r border-stone-300/80 flex-col items-center justify-between py-8 shrink-0 relative z-30">
                  <div className="absolute inset-y-0 left-1/2 w-0.5 bg-amber-900/20 border-dashed border-r border-amber-900/10" />
                  <div className="w-2.5 h-2.5 bg-slate-500/80 rounded-full border border-slate-650 shadow-md" />
                  <div className="w-2.5 h-2.5 bg-slate-500/80 rounded-full border border-slate-650 shadow-md" />
                  <div className="w-2.5 h-2.5 bg-slate-500/80 rounded-full border border-slate-650 shadow-md" />
                  <div className="w-2.5 h-2.5 bg-slate-500/80 rounded-full border border-slate-650 shadow-md" />
                  <div className="w-2.5 h-2.5 bg-slate-500/80 rounded-full border border-slate-650 shadow-md" />
                </div>

                {/* TRANG PHẢI TĨNH */}
                <div className="flex-1 h-full hidden md:block">
                  {currentSpread.right ? renderPageSide(currentSpread.right, currentSpreadIndex * 2 + 2, true) : null}
                </div>

                {/* TRANG GIẤY LẬT 3D GIẢ LẬP (FLIPPING PAGE) */}
                <AnimatePresence>
                  {isFlipping && flipDirection && (
                    <motion.div
                      className="absolute top-0 bottom-0 z-20 pointer-events-none hidden md:block"
                      style={{
                        left: '50%',
                        width: '50%',
                        transformStyle: 'preserve-3d',
                        originX: 0,
                      }}
                      initial={{ rotateY: flipDirection === 'next' ? 0 : -180 }}
                      animate={{ rotateY: flipDirection === 'next' ? -180 : 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.6, ease: 'easeInOut' }}
                    >
                      {/* Mặt trước của trang lật */}
                      <div 
                        className="absolute inset-0 bg-[#fdf9f4] rounded-r-[20px] border-r-4 border-amber-900 backface-hidden"
                        style={{ 
                          backfaceVisibility: 'hidden',
                          transformStyle: 'preserve-3d'
                        }}
                      >
                        {flipDirection === 'next' 
                          ? (SPREADS[targetSpreadIndex - 1].right ? renderPageSide(SPREADS[targetSpreadIndex - 1].right, (targetSpreadIndex - 1) * 2 + 2, true) : null)
                          : renderPageSide(SPREADS[targetSpreadIndex].left, targetSpreadIndex * 2 + 1, false)
                        }
                      </div>

                      {/* Mặt sau của trang lật */}
                      <div 
                        className="absolute inset-0 bg-[#fdf9f4] rounded-l-[20px] border-l-4 border-amber-900 backface-hidden"
                        style={{ 
                          backfaceVisibility: 'hidden',
                          transform: 'rotateY(180deg) scaleX(-1)',
                          transformStyle: 'preserve-3d'
                        }}
                      >
                        {flipDirection === 'next'
                          ? renderPageSide(SPREADS[targetSpreadIndex].left, targetSpreadIndex * 2 + 1, false)
                          : (SPREADS[targetSpreadIndex + 1]?.right ? renderPageSide(SPREADS[targetSpreadIndex + 1].right, (targetSpreadIndex + 1) * 2 + 2, true) : null)
                        }
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            </div>

            {/* Nút lật trang phải absolute ở rìa phải sách */}
            <div className="absolute right-1 md:-right-6 top-1/2 -translate-y-1/2 z-30">
              <motion.button
                whileHover={{ scale: currentSpreadIndex < SPREADS.length - 1 ? 1.08 : 1 }}
                whileTap={{ scale: currentSpreadIndex < SPREADS.length - 1 ? 0.92 : 1 }}
                onClick={() => changeSpread('next')}
                disabled={currentSpreadIndex === SPREADS.length - 1 || isFlipping}
                className={`w-11 h-11 sm:w-14 sm:h-14 bg-white border-3 border-slate-800 rounded-full flex items-center justify-center text-slate-800 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-[1px] active:shadow-none hover:bg-indigo-50 transition-all cursor-pointer ${
                  currentSpreadIndex === SPREADS.length - 1 || isFlipping ? 'opacity-30 cursor-not-allowed shadow-none border-slate-300 text-slate-300 bg-slate-50' : ''
                }`}
                title="Trang tiếp"
              >
                <ChevronRight size={24} className="stroke-[3]" />
              </motion.button>
            </div>

          </div>

        </main>

        {/* MODAL BẢN ĐỒ TỪ VỰNG MINDMAP (Thám hiểm 3 ví dụ) */}
        <AnimatePresence>
          {activeMindmapLetter && (
            <div className="fixed inset-0 z-40 flex items-center justify-center p-3 md:p-4">
              {/* Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => {
                  stopSpeaking();
                  stopListening();
                  setActiveListeningId(null);
                  setActiveMindmapLetter(null);
                }}
                className="absolute inset-0 bg-slate-900/70 backdrop-blur-md cursor-pointer"
              />

              {/* Modal Container */}
              <motion.div
                initial={{ scale: 0.9, y: 30, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 30, opacity: 0 }}
                transition={{ type: 'spring', damping: 22, stiffness: 280 }}
                className="relative w-full max-w-4xl h-[92vh] max-h-[780px] bg-[#fdf9f4] border-4 border-slate-800 rounded-[36px] p-4 md:p-6 text-center shadow-[0_24px_56px_rgba(0,0,0,0.3)] overflow-hidden z-10 flex flex-col justify-between"
              >
                {/* Header Modal */}
                <div className="flex items-center justify-between border-b-4 border-slate-800 pb-3 mb-2 shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl md:text-3xl">🗺️</span>
                    <h3 className="text-base md:text-xl font-black text-slate-800 uppercase tracking-wide">
                      Bản đồ từ vựng chữ <span className="text-rose-500 font-extrabold">{activeMindmapLetter.uppercase}</span>
                    </h3>
                  </div>
                  <button
                    onClick={() => {
                      playSound('click');
                      stopSpeaking();
                      stopListening();
                      setActiveListeningId(null);
                      setActiveMindmapLetter(null);
                    }}
                    className="w-10 h-10 rounded-full bg-rose-100 hover:bg-rose-200 border-2 border-slate-800 text-rose-700 hover:text-rose-800 flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
                    title="Đóng bản đồ"
                  >
                    <X size={18} className="stroke-[3]" />
                  </button>
                </div>

                {/* Khu vực Mindmap Vẽ đường nối SVG */}
                <div className="flex-1 w-full relative min-h-[220px] md:min-h-[300px] bg-sky-50/40 border-3 border-dashed border-sky-200 rounded-[28px] overflow-hidden my-2">
                  
                  {/* SVG vẽ các đường cong uốn lượn nối các bong bóng */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 800 400" preserveAspectRatio="none">
                    {/* Định nghĩa các gradient */}
                    <defs>
                      <linearGradient id="selected-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ec4899" />
                        <stop offset="100%" stopColor="#a855f7" />
                      </linearGradient>
                      <linearGradient id="mastered-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#059669" />
                      </linearGradient>
                    </defs>
                    
                    {/* Nhánh 0: Tâm (400, 200) -> Trái (180, 280) */}
                    <motion.path
                      d="M 400 200 Q 290 240, 180 280"
                      fill="none"
                      stroke={
                        selectedExampleIndex === 0
                          ? 'url(#selected-grad)'
                          : !!masteredBranches[`${activeMindmapLetter.id}-0`]
                            ? 'url(#mastered-grad)'
                            : '#cbd5e1'
                      }
                      strokeWidth={selectedExampleIndex === 0 ? '6' : '4'}
                      strokeDasharray={!!masteredBranches[`${activeMindmapLetter.id}-0`] ? '0' : '8,6'}
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.8 }}
                    />
                    
                    {/* Nhánh 1: Tâm (400, 200) -> Trên (400, 75) */}
                    <motion.path
                      d="M 400 200 L 400 75"
                      fill="none"
                      stroke={
                        selectedExampleIndex === 1
                          ? 'url(#selected-grad)'
                          : !!masteredBranches[`${activeMindmapLetter.id}-1`]
                            ? 'url(#mastered-grad)'
                            : '#cbd5e1'
                      }
                      strokeWidth={selectedExampleIndex === 1 ? '6' : '4'}
                      strokeDasharray={!!masteredBranches[`${activeMindmapLetter.id}-1`] ? '0' : '8,6'}
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.8 }}
                    />
                    
                    {/* Nhánh 2: Tâm (400, 200) -> Phải (620, 280) */}
                    <motion.path
                      d="M 400 200 Q 510 240, 620 280"
                      fill="none"
                      stroke={
                        selectedExampleIndex === 2
                          ? 'url(#selected-grad)'
                          : !!masteredBranches[`${activeMindmapLetter.id}-2`]
                            ? 'url(#mastered-grad)'
                            : '#cbd5e1'
                      }
                      strokeWidth={selectedExampleIndex === 2 ? '6' : '4'}
                      strokeDasharray={!!masteredBranches[`${activeMindmapLetter.id}-2`] ? '0' : '8,6'}
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.8 }}
                    />
                  </svg>

                  {/* NÚT TÂM: Chữ cái khổng lồ */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className={`absolute top-[42%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-slate-800 bg-white flex flex-col items-center justify-center shadow-[4px_4px_0_0_rgba(0,0,0,1)] select-none bg-gradient-to-br ${activeMindmapLetter.color}`}
                  >
                    <span className="text-4xl md:text-5xl font-black drop-shadow-sm leading-none">
                      {activeMindmapLetter.uppercase}
                    </span>
                    <span className="text-xl md:text-2xl font-extrabold leading-none mt-1">
                      {activeMindmapLetter.letter}
                    </span>
                  </motion.div>

                  {/* NHÁNH 0: BÊN TRÁI */}
                  <div className="absolute bottom-[18%] left-[6%] md:left-[12%] -translate-y-1/2 z-20">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setSelectedExampleIndex(0);
                        stopSpeaking();
                        stopListening();
                        setActiveListeningId(null);
                        playSound('pop');
                      }}
                      className={`w-20 h-20 md:w-28 md:h-28 rounded-full border-4 flex flex-col items-center justify-center cursor-pointer transition-all shadow-[4px_4px_0_0_rgba(0,0,0,0.15)] relative ${
                        selectedExampleIndex === 0
                          ? 'border-pink-500 bg-pink-100 scale-105 shadow-pink-200 shadow-md ring-4 ring-pink-200'
                          : !!masteredBranches[`${activeMindmapLetter.id}-0`]
                            ? 'border-emerald-500 bg-emerald-50'
                            : 'border-slate-300 bg-white'
                      }`}
                    >
                      {/* Sao làm chủ */}
                      {!!masteredBranches[`${activeMindmapLetter.id}-0`] && (
                        <span className="absolute -top-1.5 -right-1.5 text-yellow-500 bg-white border border-yellow-300 rounded-full p-0.5 animate-bounce shadow-sm">
                          <Star size={11} className="fill-yellow-400" />
                        </span>
                      )}
                      <span className="text-3xl md:text-4xl select-none">{activeMindmapLetter.examples[0].emoji}</span>
                      <span className="text-[10px] md:text-xs font-black text-slate-800 mt-1 capitalize">{activeMindmapLetter.examples[0].word}</span>
                    </motion.div>
                  </div>

                  {/* NHÁNH 1: TRÊN GIỮA */}
                  <div className="absolute top-[8%] left-1/2 -translate-x-1/2 z-20">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setSelectedExampleIndex(1);
                        stopSpeaking();
                        stopListening();
                        setActiveListeningId(null);
                        playSound('pop');
                      }}
                      className={`w-20 h-20 md:w-28 md:h-28 rounded-full border-4 flex flex-col items-center justify-center cursor-pointer transition-all shadow-[4px_4px_0_0_rgba(0,0,0,0.15)] relative ${
                        selectedExampleIndex === 1
                          ? 'border-pink-500 bg-pink-100 scale-105 shadow-pink-200 shadow-md ring-4 ring-pink-200'
                          : !!masteredBranches[`${activeMindmapLetter.id}-1`]
                            ? 'border-emerald-500 bg-emerald-50'
                            : 'border-slate-300 bg-white'
                      }`}
                    >
                      {/* Sao làm chủ */}
                      {!!masteredBranches[`${activeMindmapLetter.id}-1`] && (
                        <span className="absolute -top-1.5 -right-1.5 text-yellow-500 bg-white border border-yellow-300 rounded-full p-0.5 animate-bounce shadow-sm">
                          <Star size={11} className="fill-yellow-400" />
                        </span>
                      )}
                      <span className="text-3xl md:text-4xl select-none">{activeMindmapLetter.examples[1].emoji}</span>
                      <span className="text-[10px] md:text-xs font-black text-slate-800 mt-1 capitalize">{activeMindmapLetter.examples[1].word}</span>
                    </motion.div>
                  </div>

                  {/* NHÁNH 2: BÊN PHẢI */}
                  <div className="absolute bottom-[18%] right-[6%] md:right-[12%] -translate-y-1/2 z-20">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setSelectedExampleIndex(2);
                        stopSpeaking();
                        stopListening();
                        setActiveListeningId(null);
                        playSound('pop');
                      }}
                      className={`w-20 h-20 md:w-28 md:h-28 rounded-full border-4 flex flex-col items-center justify-center cursor-pointer transition-all shadow-[4px_4px_0_0_rgba(0,0,0,0.15)] relative ${
                        selectedExampleIndex === 2
                          ? 'border-pink-500 bg-pink-100 scale-105 shadow-pink-200 shadow-md ring-4 ring-pink-200'
                          : !!masteredBranches[`${activeMindmapLetter.id}-2`]
                            ? 'border-emerald-500 bg-emerald-50'
                            : 'border-slate-300 bg-white'
                      }`}
                    >
                      {/* Sao làm chủ */}
                      {!!masteredBranches[`${activeMindmapLetter.id}-2`] && (
                        <span className="absolute -top-1.5 -right-1.5 text-yellow-500 bg-white border border-yellow-300 rounded-full p-0.5 animate-bounce shadow-sm">
                          <Star size={11} className="fill-yellow-400" />
                        </span>
                      )}
                      <span className="text-3xl md:text-4xl select-none">{activeMindmapLetter.examples[2].emoji}</span>
                      <span className="text-[10px] md:text-xs font-black text-slate-800 mt-1 capitalize">{activeMindmapLetter.examples[2].word}</span>
                    </motion.div>
                  </div>

                </div>

                {/* BẢNG ĐIỀU KHIỂN CHI TIẾT TỪ VỰNG DƯỚI ĐÁY */}
                {activeMindmapLetter.examples[selectedExampleIndex] && (() => {
                  const example = activeMindmapLetter.examples[selectedExampleIndex];
                  const listenId = `mindmap-${activeMindmapLetter.id}-${selectedExampleIndex}`;
                  const isListeningThis = activeListeningId === listenId;
                  const isSuccess = speakSuccessId === listenId;
                  const isError = speakErrorId === listenId;
                  const isBranchMastered = !!masteredBranches[`${activeMindmapLetter.id}-${selectedExampleIndex}`];

                  // Nghe phát âm từ vựng ngắn
                  const handlePlayWordAudio = (e: React.MouseEvent) => {
                    e.stopPropagation();
                    stopSpeaking();
                    stopListening();
                    setActiveListeningId(null);
                    speak(example.word, 'vi-VN');
                  };

                  // Nghe phát âm cả câu ví dụ
                  const handlePlaySentenceAudio = (e: React.MouseEvent) => {
                    e.stopPropagation();
                    stopSpeaking();
                    stopListening();
                    setActiveListeningId(null);
                    speak(example.sentence, 'vi-VN');
                  };

                  // Luyện nói micro
                  const handleStartMicLocal = (e: React.MouseEvent) => {
                    e.stopPropagation();
                    if (isListeningThis && isListening) {
                      stopListening();
                      setActiveListeningId(null);
                      playSound('click');
                    } else {
                      playSound('click');
                      setActiveListeningId(listenId);
                      startListening('vi-VN');
                    }
                  };

                  return (
                    <div className="bg-white border-3 border-slate-800 rounded-3xl p-3 md:p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] shrink-0">
                      
                      {/* Trái: Tên từ vựng */}
                      <div className="flex items-center gap-3 text-left w-full md:w-auto">
                        <span className="text-4xl md:text-5xl bg-slate-100 rounded-2xl w-14 h-14 md:w-16 md:h-16 flex items-center justify-center border border-slate-200">
                          {example.emoji}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-lg md:text-xl font-black text-slate-800 capitalize leading-none">{example.word}</span>
                            {isBranchMastered && (
                              <span className="bg-emerald-100 border border-emerald-300 text-emerald-700 text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                                <Star size={8} className="fill-emerald-500 animate-pulse" />
                                <span>Làm chủ</span>
                              </span>
                            )}
                          </div>
                          <button
                            onClick={handlePlayWordAudio}
                            className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5 mt-1 hover:underline cursor-pointer"
                          >
                            <Volume2 size={11} />
                            <span>Nghe phát âm từ</span>
                          </button>
                        </div>
                      </div>

                      {/* Giữa: Câu ví dụ để luyện nói */}
                      <div className="flex-1 bg-indigo-50/30 border border-indigo-100 rounded-2xl p-2.5 w-full text-center md:text-left">
                        <span className="text-[9px] font-black text-indigo-500 uppercase tracking-wider block mb-0.5">📖 Câu luyện đọc của bé:</span>
                        <p className="text-xs md:text-sm font-black text-slate-800 leading-snug">
                          "{example.sentence}"
                        </p>
                      </div>

                      {/* Phải: Các nút Micro và Phát âm mẫu */}
                      <div className="flex items-center justify-center gap-3 w-full md:w-auto shrink-0">
                        {/* Nghe mẫu câu */}
                        <button
                          onClick={handlePlaySentenceAudio}
                          className="w-10 h-10 rounded-full border-2 border-slate-200 bg-slate-50 text-slate-650 flex items-center justify-center shadow-sm hover:bg-slate-100 active:scale-95 cursor-pointer"
                          title="Nghe câu mẫu"
                        >
                          <Volume2 size={16} className="stroke-[2.5]" />
                        </button>

                        {/* Mic ghi âm */}
                        {isSpeechSupported && (
                          <button
                            onClick={handleStartMicLocal}
                            className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-md active:scale-95 transition-all cursor-pointer relative ${
                              isListeningThis
                                ? 'bg-rose-500 ring-4 ring-rose-200 animate-pulse'
                                : isSuccess
                                  ? 'bg-emerald-500'
                                  : isError
                                    ? 'bg-amber-500'
                                    : 'bg-indigo-600 hover:bg-indigo-700'
                            }`}
                            title="Bấm để ghi âm luyện đọc"
                          >
                            {isSuccess ? (
                              <Check size={20} className="stroke-[3]" />
                            ) : (
                              <>
                                <Mic size={20} />
                                {isListeningThis && (
                                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                  </span>
                                )}
                              </>
                            )}
                          </button>
                        )}
                        
                        {/* Phản hồi trạng thái */}
                        <div className="w-24 text-center leading-tight">
                          {isListeningThis && <span className="text-[9px] text-red-500 font-extrabold animate-pulse block">⚡ Bé hãy đọc to...</span>}
                          {isSuccess && <span className="text-[9px] text-emerald-600 font-black animate-bounce block">✨ Bé đọc giỏi quá! (+5 XP)</span>}
                          {isError && <span className="text-[9px] text-amber-600 font-bold block">😅 Bé hãy đọc lại câu trên nhé!</span>}
                          {!isListeningThis && !isSuccess && !isError && (
                            <span className="text-[9px] text-slate-450 font-bold block">
                              {isBranchMastered ? '✨ Đã làm chủ' : '🎙️ Nhấn để đọc'}
                            </span>
                          )}
                        </div>
                      </div>

                    </div>
                  );
                })()}

              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* MODAL HOÀN THÀNH HỌC TẬP (Claim 200 XP) */}
        <AnimatePresence>
          {showCompletionModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
              />

              <motion.div
                initial={{ scale: 0.9, y: 30, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 30, opacity: 0 }}
                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                className="relative w-full max-w-md bg-amber-50 border-4 border-slate-800 rounded-[32px] p-6 text-center shadow-[0_24px_48px_rgba(0,0,0,0.2)] overflow-hidden z-10"
              >
                <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-yellow-200/50 to-transparent pointer-events-none" />

                <div className="relative mx-auto w-24 h-24 bg-gradient-to-tr from-yellow-400 via-orange-400 to-pink-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-yellow-250 animate-bounce">
                  <Trophy className="text-white w-12 h-12" />
                </div>

                <h3 className="text-2xl font-black text-slate-800 mb-2">
                  Tuyệt Vời Ông Mặt Trời!
                </h3>
                
                <p className="text-sm font-extrabold text-slate-500 leading-relaxed mb-6 px-2">
                  Chào {studentInfo?.nickname || 'Dũng Sĩ'}! Bé đã hoàn thành đọc và luyện nói toàn bộ 29 chữ cái Tiếng Việt một cách xuất sắc rồi đó!
                </p>

                <div className="bg-yellow-100 border-2 border-dashed border-yellow-400 rounded-2xl p-4 flex items-center justify-center gap-3 mb-6 shadow-inner">
                  <span className="text-3xl">🎁</span>
                  <div className="text-left">
                    <p className="text-[10px] font-black text-yellow-600 uppercase tracking-wider">Phần thưởng của bé</p>
                    <p className="text-lg font-black text-slate-800">+200 Điểm Kinh Nghiệm (XP)</p>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleClaimReward}
                  className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 border-2 border-slate-800 text-white font-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles size={20} className="animate-spin" />
                  <span>Nhận thưởng thôi! 🚀</span>
                </motion.button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </VisualWorldBackground>
  );
}
