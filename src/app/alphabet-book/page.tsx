'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Check, RotateCcw, BookOpen, Star, X, Award, Trophy, Sparkles
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

const VIETNAMESE_LETTER_SOUNDS: Record<string, string> = {
  'A': 'a',
  'Ă': 'ă',
  'Â': 'â',
  'B': 'bờ',
  'C': 'cờ',
  'D': 'dờ',
  'Đ': 'đờ',
  'E': 'e',
  'Ê': 'ê',
  'G': 'gờ',
  'H': 'hờ',
  'I': 'i',
  'K': 'k',
  'L': 'lờ',
  'M': 'mờ',
  'N': 'nờ',
  'O': 'o',
  'Ô': 'ô',
  'Ơ': 'ơ',
  'P': 'pờ',
  'Q': 'quờ',
  'R': 'rờ',
  'S': 'sờ',
  'T': 'tờ',
  'U': 'u',
  'Ư': 'ư',
  'V': 'vờ',
  'X': 'xờ',
  'Y': 'i'
};

export default function AlphabetBookPage() {
  const router = useRouter();
  const { playSound } = useSound();
  const { studentInfo, queueProgress, xp } = useStudent();

  const [exploredLetters, setExploredLetters] = useState<Record<string, boolean>>({});
  const [activeListeningId, setActiveListeningId] = useState<string | null>(null);
  const [isBookCompleted, setIsBookCompleted] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  // States quản lý Bản đồ tư duy từ vựng (Mindmap)
  const [activeMindmapLetter, setActiveMindmapLetter] = useState<AlphabetLetter | null>(null);
  const [selectedExampleIndex, setSelectedExampleIndex] = useState<number>(0);
  const [masteredBranches, setMasteredBranches] = useState<Record<string, boolean>>({});

  // Hook phát âm web-speech tiếng Việt
  const { speak, stopSpeaking, stopListening } = useWebSpeech();

  // Load tiến trình đã học từ localStorage
  useEffect(() => {
    try {
      const savedExplored = localStorage.getItem('viettyping_explored_letters');
      if (savedExplored) {
        setExploredLetters(JSON.parse(savedExplored));
      }

      const savedMastered = localStorage.getItem('viettyping_mastered_branches');
      if (savedMastered) {
        setMasteredBranches(JSON.parse(savedMastered));
      }

      const savedCompleted = localStorage.getItem('viettyping_alphabet_book_completed');
      if (savedCompleted === 'true') {
        setIsBookCompleted(true);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

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
          confetti({
            particleCount: 150,
            spread: 90,
            origin: { y: 0.5 }
          });
        }, 1200);
      }

      // Đồng bộ tiến trình lên Firebase/StudentContext
      const currentPercent = Math.round((Object.keys(updated).length / ALPHABET_DATA.length) * 100);
      queueProgress('viettyping_alphabet_book', currentPercent, 10, xp + 10);

      return updated;
    });
  };

  // Chọn ví dụ trong Mindmap và Tự động phát âm ngay
  const handleSelectExample = (letterId: string, index: number, word: string, sentence: string) => {
    setSelectedExampleIndex(index);
    playSound('pop');

    // Tự động phát âm từ và câu ví dụ
    speak(`${word}. ${sentence}`, 'vi-VN');

    // Đánh dấu đã làm chủ nhánh này
    const branchKey = `${letterId}-${index}`;
    if (!masteredBranches[branchKey]) {
      setMasteredBranches(prev => {
        const updated = { ...prev, [branchKey]: true };
        localStorage.setItem('viettyping_mastered_branches', JSON.stringify(updated));

        // Cộng 5 XP cho bé
        const updatedExploredCount = ALPHABET_DATA.filter(item => exploredLetters[item.id]).length;
        const currentProgressPercent = Math.round((updatedExploredCount / ALPHABET_DATA.length) * 100);
        queueProgress('viettyping_alphabet_book', currentProgressPercent, 5, xp + 5);

        // Kiểm tra xem đã làm chủ cả 3 nhánh chưa
        const has0 = !!updated[`${letterId}-0`];
        const has1 = !!updated[`${letterId}-1`];
        const has2 = !!updated[`${letterId}-2`];

        if (has0 && has1 && has2) {
          setTimeout(() => {
            playSound('tada');
            confetti({
              particleCount: 85,
              spread: 80,
              origin: { y: 0.6 }
            });
            markLetterAsExplored(letterId);
          }, 800);
        }

        return updated;
      });
    }
  };

  // Tự động ghi nhận làm chủ nhánh đầu tiên khi mở bản đồ từ vựng (không phát âm để tránh tranh chấp âm thanh)
  useEffect(() => {
    if (activeMindmapLetter) {
      const branchKey = `${activeMindmapLetter.id}-0`;
      if (!masteredBranches[branchKey]) {
        setMasteredBranches(prev => {
          const updated = { ...prev, [branchKey]: true };
          localStorage.setItem('viettyping_mastered_branches', JSON.stringify(updated));
          
          const updatedExploredCount = ALPHABET_DATA.filter(item => exploredLetters[item.id]).length;
          const currentProgressPercent = Math.round((updatedExploredCount / ALPHABET_DATA.length) * 100);
          queueProgress('viettyping_alphabet_book', currentProgressPercent, 5, xp + 5);
          
          return updated;
        });
      }
    }
  }, [activeMindmapLetter]);

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
      setIsBookCompleted(false);
      localStorage.removeItem('viettyping_explored_letters');
      localStorage.removeItem('viettyping_alphabet_book_completed');
      localStorage.removeItem('viettyping_mastered_branches');
      setMasteredBranches({});
    }
  };

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
                Bé chạm vào từng chữ cái để nghe phát âm và thám hiểm Bản đồ từ vựng nhé!
              </p>
            </div>
          </div>

          {/* Khối Tiến trình học của bé tích hợp ngay trung tâm Header */}
          <div className="hidden lg:flex flex-col items-center gap-1.5 flex-1 max-w-sm px-6">
            <div className="flex justify-between w-full text-[10px] font-black text-slate-700 leading-none">
              <span>🎒 Bé đã học: <strong className="text-indigo-600">{exploredCount} / 29</strong> chữ cái</span>
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

        {/* Nội dung chính: Thiết kế phẳng, tối giản để bé tập trung vào chữ cái */}
        <main className="flex-1 w-full max-w-[95vw] lg:max-w-[90vw] mx-auto px-1 md:px-4 pt-4 pb-2 flex flex-col justify-center items-center relative">

          {/* Lớp hiển thị tiến độ trên mobile (nếu màn hình nhỏ hơn lg) */}
          <div className="lg:hidden flex items-center justify-between w-full max-w-xl bg-white/70 backdrop-blur-sm border-2 border-slate-800 rounded-xl px-3 py-1.5 mb-3 text-[10px] font-black text-slate-700 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] shrink-0">
            <span>🎒 Bé học: <strong className="text-indigo-600">{exploredCount} / 29</strong> chữ</span>
            <div className="w-24 bg-slate-100 border border-slate-800 rounded-full h-2 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-400 to-indigo-500" style={{ width: `${progressPercent}%` }} />
            </div>
            <span>{progressPercent}%</span>
          </div>

          {/* LƯỚI CHỮ CÁI PHẲNG TRÀN MÀN HÌNH */}
          <div className="w-full overflow-y-auto max-h-[calc(100vh-180px)] pr-2 py-2">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-4 sm:gap-6 w-full justify-center">
              {ALPHABET_DATA.map((item) => {
                const isExplored = !!exploredLetters[item.id];
                const isMastered = !!masteredBranches[`${item.id}-0`] &&
                  !!masteredBranches[`${item.id}-1`] &&
                  !!masteredBranches[`${item.id}-2`];

                return (
                  <motion.div
                    key={item.id}
                    whileHover={{ scale: 1.05, y: -4 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      stopSpeaking();
                      stopListening();
                      setActiveListeningId(null);

                      // Phát âm chữ cái và từ chính
                      const letterSound = VIETNAMESE_LETTER_SOUNDS[item.uppercase] || item.letter;
                      speak(`${letterSound}, ${item.word}.`, 'vi-VN');
                      markLetterAsExplored(item.id);

                      // Mở thẳng Bản đồ từ vựng Mindmap
                      setSelectedExampleIndex(0);
                      setActiveMindmapLetter(item);
                      playSound('click');
                    }}
                    className={`relative rounded-[24px] p-4 flex flex-col items-center justify-between border-3 bg-gradient-to-b ${item.color} ${item.borderColor} shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)] cursor-pointer select-none transition-all duration-300 min-h-[150px] sm:min-h-[170px]`}
                  >
                    {/* Badge đã học hoặc Đã Làm Chủ */}
                    {isMastered ? (
                      <span className="absolute top-2.5 right-2.5 text-yellow-500 bg-white border-2 border-yellow-400 rounded-full p-0.5 shadow-md text-xs animate-bounce" title="Bé đã làm chủ chữ cái!">
                        <Star size={11} className="fill-yellow-400 stroke-yellow-650" />
                      </span>
                    ) : isExplored ? (
                      <span className="absolute top-2.5 right-2.5 text-emerald-500 bg-white border border-emerald-300 rounded-full p-0.5 shadow-sm text-xs" title="Bé đã học xong">
                        <Check size={10} className="stroke-[3]" />
                      </span>
                    ) : null}

                    {/* Chữ cái in hoa + in thường */}
                    <div className="text-center mt-1">
                      <span className="text-3xl sm:text-4xl md:text-5xl font-black tracking-wide drop-shadow-sm">
                        {item.uppercase} {item.letter}
                      </span>
                    </div>

                    {/* Hình ảnh Emoji lớn rõ nét */}
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/80 rounded-full border border-white/60 flex items-center justify-center text-3xl sm:text-4xl shadow-inner transform hover:scale-105 transition-transform">
                      {item.emoji}
                    </div>

                    {/* Từ khóa */}
                    <div className="w-full text-center shrink-0 mb-1">
                      <span className="text-[11px] sm:text-xs md:text-sm font-black text-slate-800 tracking-wide capitalize truncate block max-w-full">
                        {item.word}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
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
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      playSound('click');
                      const letterSound = VIETNAMESE_LETTER_SOUNDS[activeMindmapLetter.uppercase] || activeMindmapLetter.letter;
                      speak(`${letterSound}, ${activeMindmapLetter.word}.`, 'vi-VN');
                    }}
                    className={`absolute top-[42%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-slate-800 bg-white flex flex-col items-center justify-center shadow-[4px_4px_0_0_rgba(0,0,0,1)] select-none bg-gradient-to-br ${activeMindmapLetter.color} cursor-pointer`}
                    title="Nghe lại chữ cái chính"
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
                      onClick={() => handleSelectExample(
                        activeMindmapLetter.id,
                        0,
                        activeMindmapLetter.examples[0].word,
                        activeMindmapLetter.examples[0].sentence
                      )}
                      className={`w-20 h-20 md:w-28 md:h-28 rounded-full border-4 flex flex-col items-center justify-center cursor-pointer transition-all shadow-[4px_4px_0_0_rgba(0,0,0,0.15)] relative ${selectedExampleIndex === 0
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
                      onClick={() => handleSelectExample(
                        activeMindmapLetter.id,
                        1,
                        activeMindmapLetter.examples[1].word,
                        activeMindmapLetter.examples[1].sentence
                      )}
                      className={`w-20 h-20 md:w-28 md:h-28 rounded-full border-4 flex flex-col items-center justify-center cursor-pointer transition-all shadow-[4px_4px_0_0_rgba(0,0,0,0.15)] relative ${selectedExampleIndex === 1
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
                      onClick={() => handleSelectExample(
                        activeMindmapLetter.id,
                        2,
                        activeMindmapLetter.examples[2].word,
                        activeMindmapLetter.examples[2].sentence
                      )}
                      className={`w-20 h-20 md:w-28 md:h-28 rounded-full border-4 flex flex-col items-center justify-center cursor-pointer transition-all shadow-[4px_4px_0_0_rgba(0,0,0,0.15)] relative ${selectedExampleIndex === 2
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
                      <span className="text-[10px] md:text-xs font-black text-slate-850 mt-1 capitalize">{activeMindmapLetter.examples[2].word}</span>
                    </motion.div>
                  </div>

                </div>

                {/* BẢNG ĐIỀU KHIỂN CHI TIẾT TỪ VỰNG DƯỚI ĐÁY */}
                {activeMindmapLetter.examples[selectedExampleIndex] && (() => {
                  const example = activeMindmapLetter.examples[selectedExampleIndex];
                  const isBranchMastered = !!masteredBranches[`${activeMindmapLetter.id}-${selectedExampleIndex}`];

                  return (
                    <div className="bg-white border-3 border-slate-800 rounded-3xl p-3 md:p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] shrink-0">

                      {/* Trái: Tên từ vựng */}
                      <div className="flex items-center gap-3 text-left w-full sm:w-auto">
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            speak(`${example.word}. ${example.sentence}`, 'vi-VN');
                          }}
                          className="text-4xl md:text-5xl bg-slate-100 rounded-2xl w-14 h-14 md:w-16 md:h-16 flex items-center justify-center border border-slate-200 cursor-pointer hover:scale-105 active:scale-95 transition-all shadow-inner select-none"
                          title="Bấm để nghe lại phát âm"
                        >
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
                          <span className="text-[10px] font-bold text-slate-400 mt-1 block">💡 Bé bấm vào hình để nghe lại</span>
                        </div>
                      </div>

                      {/* Giữa: Câu ví dụ */}
                      <div className="flex-1 bg-indigo-50/30 border border-indigo-100 rounded-2xl p-2.5 w-full text-center sm:text-left">
                        <span className="text-[9px] font-black text-indigo-500 uppercase tracking-wider block mb-0.5">📖 Câu ví dụ của bé:</span>
                        <p className="text-sm md:text-base font-black text-slate-850 leading-snug">
                          "{example.sentence}"
                        </p>
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
