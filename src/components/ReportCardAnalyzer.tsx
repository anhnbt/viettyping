'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Sparkles, 
  BookOpen, 
  Trophy, 
  Lightbulb, 
  ArrowRight, 
  Smile, 
  CheckCircle2, 
  TrendingUp, 
  ClipboardList, 
  Music, 
  Palette, 
  Activity as HeartIcon, 
  Target,
  PenTool,
  BrainCircuit
} from 'lucide-react';
import { useSound } from '@/contexts/SoundContext';

interface StudyTask {
  id: string;
  subjectId: string;
  topicId: string;
  subjectName: string;
  taskTitle: string;
  reason: string;
  recommendation: string;
  icon: string;
  color: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

const SAMPLE_COMMENT = `1. Tiếng Việt: Đọc to, rõ ràng; hiểu được nội dung bài đọc; lưu ý viết đúng tốc độ
2. Toán: Tính toán cẩn thận, chính xác; vận dụng kĩ năng giải toán phù hợp với thực tế
3. Ngoại ngữ/Tiếng Anh: Con học tốt trong học kỳ 2; nắm vững kiến thức và hoàn thành bài xuất sắc; tiếp tục phát huy
4. Đạo đức: Thực hiện tốt các hành vi đã học; vận dụng linh hoạt các hành vi đạo đức vào cuộc sống
5. Tự nhiên và xã hội: Hiểu tốt nội dung bài học; vận dụng tốt kiến thức đã học vào cuộc sống
6. Giáo dục thể chất: Em đã thực hiện cơ bản nội dung, động tác đã học, cần cố gắng hơn trong tập luyện.
7. Nghệ thuật (âm nhạc): Rèn hát đúng giai điệu các bài hát và các bài đọc nhạc.
8. Nghệ thuật (mĩ thuật): Vẽ đúng khung hình, tô màu còn chưa đều.
9. Hoạt động trải nghiệm: Thực hiện được một số yêu cầu cơ bản của chủ đề đã học; cần tập trung hơn trong giờ học.
===
Phẩm chất: Yêu nước, nhân ái, chăm chỉ, trung thực, trách nhiệm.
Yêu quý thầy cô, giúp đỡ bạn bè; chăm học, thực hiện tốt nội quy lớp học; hăng hái phát biểu xây dựng bài.
===
Năng lực : Tự chủ và tự học, giao tiếp và hợp tác, giải quyết vấn đề sáng tạo.
Tự giác, chủ động trong học tập, phối hợp tốt với các bạn trong nhóm; biết giải quyết một số tình huống`;

export default function ReportCardAnalyzer() {
  const router = useRouter();
  const { playSound } = useSound();
  const [commentText, setCommentText] = useState('');
  const [analysisResult, setAnalysisResult] = useState<{
    title: string;
    strengths: string[];
    weaknesses: string[];
    tasks: StudyTask[];
    parentTips: string[];
  } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleFillSample = () => {
    playSound('click');
    setCommentText(SAMPLE_COMMENT);
  };

  const handleAnalyze = () => {
    if (!commentText.trim()) return;
    
    playSound('click');
    setIsAnalyzing(true);
    
    // Simulate premium analysis animation
    setTimeout(() => {
      playSound('tada');
      const text = commentText.toLowerCase();
      const strengths: string[] = [];
      const weaknesses: string[] = [];
      const tasks: StudyTask[] = [];
      const parentTips: string[] = [];

      // 1. Tiếng Việt
      if (text.includes('tiếng việt') || text.includes('đọc') || text.includes('tốc độ')) {
        if (text.includes('đọc to') || text.includes('hiểu tốt') || text.includes('hiểu được nội dung')) {
          strengths.push('Tiếng Việt: Đọc to, rõ ràng và có khả năng đọc hiểu rất tốt.');
        }
        if (text.includes('tốc độ') || text.includes('chậm') || text.includes('viết đúng tốc độ')) {
          weaknesses.push('Tiếng Việt: Cần rèn luyện tốc độ viết và gõ phím để bắt kịp bài giảng.');
          tasks.push({
            id: 'task-tv',
            subjectId: 'tieng-viet',
            topicId: 'tv-toc-do',
            subjectName: 'Tiếng Việt',
            taskTitle: 'Luyện gõ đúng tốc độ & Đọc hiểu',
            reason: 'Rèn luyện tốc độ gõ phím nhanh và rèn luyện đọc hiểu cốt truyện Rùa và Thỏ.',
            recommendation: 'Đặt mục tiêu gõ đều tay, tập trung và nâng tốc độ lên trên 25 từ/phút (WPM).',
            icon: '📚',
            color: 'from-green-400 to-emerald-500 shadow-green-100',
            difficulty: 'medium'
          });
        }
      }

      // 2. Toán
      if (text.includes('toán') || text.includes('tính toán')) {
        if (text.includes('chính xác') || text.includes('học tốt toán')) {
          strengths.push('Toán: Có tư duy tính toán chính xác.');
        }
        if (text.includes('cẩn thận') || text.includes('thực tế') || text.includes('nhầm')) {
          weaknesses.push('Toán: Cần rèn tính cẩn thận, tránh sai sót nhỏ và áp dụng toán vào thực tế.');
          tasks.push({
            id: 'task-toan',
            subjectId: 'toan',
            topicId: 'toan-thuc-te',
            subjectName: 'Toán học',
            taskTitle: 'Toán học thực tế & Cẩn thận',
            reason: 'Áp dụng phép toán cộng trừ vào bài toán đi chợ mua quả và gõ biểu thức số học.',
            recommendation: 'Khuyến khích bé đếm kỹ các đồ vật trước khi gõ đáp án để rèn tính cẩn thận.',
            icon: '🔢',
            color: 'from-blue-400 to-indigo-500 shadow-blue-100',
            difficulty: 'medium'
          });
        }
      }

      // 3. Tiếng Anh
      if (text.includes('ngoại ngữ') || text.includes('tiếng anh') || text.includes('tiếng anh')) {
        if (text.includes('học tốt') || text.includes('xuất sắc') || text.includes('hoàn thành bài')) {
          strengths.push('Tiếng Anh: Hoàn thành xuất sắc nhiệm vụ học tập, nắm vững kiến thức.');
          // Tiếng Anh học tốt nên thử thách gõ từ vựng nâng cao
          tasks.push({
            id: 'task-ta',
            subjectId: 'tieng-anh',
            topicId: 'ta-2',
            subjectName: 'Tiếng Anh',
            taskTitle: 'Luyện gõ từ vựng tiếng Anh',
            reason: 'Thách thức bé gõ các từ vựng tiếng Anh giao tiếp cơ bản để tiếp tục phát huy.',
            recommendation: 'Giúp bé phát âm từ vựng to rõ khi gõ để khắc sâu trí nhớ.',
            icon: '🌍',
            color: 'from-indigo-400 to-purple-500 shadow-indigo-100',
            difficulty: 'easy'
          });
        }
      }

      // 4. Đạo đức
      if (text.includes('đạo đức')) {
        if (text.includes('thực hiện tốt') || text.includes('vận dụng linh hoạt')) {
          strengths.push('Đạo đức: Nhận biết và thực hiện rất tốt các hành vi đạo đức, yêu quý mọi người.');
        }
        tasks.push({
          id: 'task-dd',
          subjectId: 'dao-duc',
          topicId: 'dao-duc-1',
          subjectName: 'Đạo đức',
          taskTitle: 'Yêu thương gia đình',
          reason: 'Luyện gõ và trả lời các tình huống về tình yêu thương gia đình, thầy cô và bạn bè.',
          recommendation: 'Trò chuyện cùng bé về những việc tốt bé đã làm hôm nay để củng cố phẩm chất nhân ái.',
          icon: '❤️',
          color: 'from-red-400 to-pink-500 shadow-red-100',
          difficulty: 'easy'
        });
      }

      // 5. Thể chất
      if (text.includes('thể chất') || text.includes('thể dục') || text.includes('động tác')) {
        if (text.includes('cố gắng hơn') || text.includes('chưa đều') || text.includes('cần cố gắng')) {
          weaknesses.push('Giáo dục thể chất: Thực hiện ở mức cơ bản, cần năng nổ vận động hơn.');
          tasks.push({
            id: 'task-td',
            subjectId: 'the-duc',
            topicId: 'td-1',
            subjectName: 'Thể dục & Sức khỏe',
            taskTitle: 'Tư thế ngồi gõ phím đúng cách',
            reason: 'Học cách ngồi thẳng lưng, bảo vệ mắt và các quy tắc nghỉ ngơi vận động khi học tập.',
            recommendation: 'Cùng bé tập bài tập duỗi tay và nhắm mắt thư giãn sau mỗi 20 phút học.',
            icon: '🏃',
            color: 'from-amber-400 to-orange-500 shadow-amber-100',
            difficulty: 'easy'
          });
        }
      }

      // 6. Âm nhạc
      if (text.includes('âm nhạc') || text.includes('hát') || text.includes('nhạc')) {
        if (text.includes('rèn hát đúng') || text.includes('chưa đúng giai điệu') || text.includes('đọc nhạc')) {
          weaknesses.push('Âm nhạc: Cần rèn luyện hát đúng giai điệu bài hát và nhận biết nốt nhạc.');
          tasks.push({
            id: 'task-an',
            subjectId: 'am-nhac',
            topicId: 'am-nhac-hat',
            subjectName: 'Âm nhạc',
            taskTitle: 'Rèn hát đúng giai điệu & Nốt nhạc',
            reason: 'Gõ lời bài hát thiếu nhi quen thuộc và lắng nghe nhận biết nốt Sol trong nhạc lí.',
            recommendation: 'Mở nhạc bài hát "Cả nhà thương nhau" cho bé nghe và hát theo khi gõ phím.',
            icon: '🎵',
            color: 'from-purple-400 to-fuchsia-500 shadow-purple-100',
            difficulty: 'medium'
          });
        }
      }

      // 7. Mỹ thuật
      if (text.includes('mĩ thuật') || text.includes('mỹ thuật') || text.includes('tô màu') || text.includes('vẽ')) {
        if (text.includes('tô màu còn chưa đều') || text.includes('chưa đều') || text.includes('khung hình')) {
          weaknesses.push('Mỹ thuật: Vẽ đúng khung hình tốt nhưng tô màu còn chưa đều tay.');
          tasks.push({
            id: 'task-mt',
            subjectId: 'my-thuat',
            topicId: 'mt-khung-hinh',
            subjectName: 'Mỹ thuật',
            taskTitle: 'Bố cục khung hình & Tô màu đều',
            reason: 'Học cách nhận biết bố cục cân đối và trò chơi tô màu kỹ thuật số đều tay.',
            recommendation: 'Hướng dẫn bé cách di chuột/chạm tay đều đặn khi chơi game tô màu.',
            icon: '🎨',
            color: 'from-pink-400 to-rose-500 shadow-pink-100',
            difficulty: 'easy'
          });
        }
      }

      // 8. Hoạt động trải nghiệm (Tập trung)
      if (text.includes('trải nghiệm') || text.includes('tập trung')) {
        if (text.includes('cần tập trung hơn') || text.includes('chưa tập trung')) {
          weaknesses.push('Hoạt động trải nghiệm: Cần rèn luyện độ tập trung và chú ý hơn trong giờ học.');
          tasks.push({
            id: 'task-hdtn',
            subjectId: 'hoat-dong-trai-nghiem',
            topicId: 'hdtn-tap-trung',
            subjectName: 'Trải nghiệm',
            taskTitle: 'Rèn luyện sự tập trung chú ý',
            reason: 'Bài tập gõ các cụm từ học tập chăm chỉ và quiz nhận diện hành vi tập trung trong lớp.',
            recommendation: 'Thiết lập không gian học yên tĩnh và khen ngợi sự tập trung của bé sau khi gõ xong.',
            icon: '🎯',
            color: 'from-orange-400 to-red-500 shadow-orange-100',
            difficulty: 'hard'
          });
        }
      }

      // 9. Năng lực & Phẩm chất chung
      if (text.includes('chăm học') || text.includes('chăm chỉ')) {
        strengths.push('Phẩm chất: Bé rất chăm học, thực hiện tốt các nội quy của lớp học.');
      }
      if (text.includes('hăng hái phát biểu') || text.includes('giao tiếp')) {
        strengths.push('Năng lực: Hăng hái phát biểu xây dựng bài, hợp tác tốt với bạn bè.');
      }
      if (text.includes('tự giác') || text.includes('chủ động')) {
        strengths.push('Năng lực: Tự giác, chủ động trong học tập, biết tự chủ.');
      }

      // Phân tích danh hiệu học tập
      let title = 'Ngôi Sao Lớp Một 🌟';
      if (strengths.length > 5) {
        title = 'Siêu Nhân Học Tập Toàn Năng 🏆';
      } else if (weaknesses.length === 0) {
        title = 'Học Sinh Xuất Sắc Toàn Diện 🥇';
      } else if (weaknesses.length > 4) {
        title = 'Ngôi Sao Triển Vọng Đang Tỏa Sáng 🚀';
      }

      // Tạo gợi ý chung cho Phụ huynh
      parentTips.push('Thiết lập khung giờ học cố định từ 15-20 phút mỗi ngày để tạo thói quen tốt.');
      parentTips.push('Luôn khen ngợi sự nỗ lực của bé thay vì chỉ chú trọng vào điểm số (Khen: "Mẹ thấy con hôm nay rất tập trung gõ phím đấy!").');
      parentTips.push('Để bé tự gõ, không gõ hộ, hãy kiên nhẫn hướng dẫn bé đặt ngón tay đúng vị trí.');

      setAnalysisResult({
        title,
        strengths,
        weaknesses,
        tasks,
        parentTips
      });
      setIsAnalyzing(false);
    }, 1500);
  };

  const handleStartTask = (subjectId: string, topicId: string) => {
    playSound('tada');
    router.push(`/subjects/${subjectId}/topics/${topicId}`);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Input Section */}
      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-[6px_6px_0px_0px_#e2e8f0] border-2 border-slate-100 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 bg-indigo-50 text-indigo-500 rounded-bl-3xl">
          <BrainCircuit className="w-6 h-6 animate-pulse" />
        </div>
        
        <h2 className="text-2xl font-black text-slate-800 mb-2 flex items-center gap-2">
          <span>Phân Tích Nhận Xét Của Cô Giáo</span>
          <Sparkles className="w-5 h-5 text-amber-500" />
        </h2>
        <p className="text-slate-500 text-sm md:text-base mb-6 font-medium leading-relaxed">
          Dán nhận xét học kỳ hoặc tổng kết của giáo viên vào ô bên dưới. Trí tuệ nhân tạo của VietTyping sẽ phân tích và lập kế hoạch rèn luyện các kỹ năng bé còn yếu thông qua trò chơi tương tác.
        </p>

        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Dán nhận xét học bạ của bé tại đây... Ví dụ: Tiếng Việt đọc to rõ ràng, cần viết đúng tốc độ. Toán tính toán cẩn thận..."
          className="w-full h-48 p-4 border-2 border-slate-200 rounded-[20px] focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all font-medium text-slate-700 placeholder-slate-400 text-sm md:text-base resize-none mb-4"
        />

        <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
          <button
            type="button"
            onClick={handleFillSample}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-full text-sm font-bold transition-colors cursor-pointer"
          >
            <ClipboardList className="w-4 h-4" />
            <span>Điền nhận xét mẫu của cô 📝</span>
          </button>

          <button
            type="button"
            onClick={handleAnalyze}
            disabled={!commentText.trim() || isAnalyzing}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-black px-8 py-3.5 rounded-[20px] border-b-4 border-indigo-800 shadow-[3px_3px_0px_0px_#c7d2fe] transition-all hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none active:border-b-0 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isAnalyzing ? (
              <>
                <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                <span>Đang phân tích bài học...</span>
              </>
            ) : (
              <>
                <BrainCircuit className="w-5 h-5" />
                <span>Lập Lộ Trình Học Tập</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results Section */}
      <AnimatePresence mode="wait">
        {analysisResult && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5, type: 'spring' }}
            className="space-y-8"
          >
            {/* Header Result */}
            <div className="bg-gradient-to-r from-amber-400 to-orange-500 p-6 md:p-8 rounded-3xl text-white shadow-[6px_6px_0px_0px_#fed7aa] text-center relative overflow-hidden">
              <div className="absolute -left-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="inline-block p-4 bg-white/20 rounded-2xl mb-4 animate-bounce">
                <Trophy className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold uppercase tracking-wider text-amber-100 mb-1">Đánh giá chung cho bé</h3>
              <h1 className="text-3xl md:text-4xl font-black mb-3 drop-shadow-md">{analysisResult.title}</h1>
              <p className="text-white/90 font-semibold max-w-xl mx-auto text-sm md:text-base">
                Cô giáo đã ghi nhận sự cố gắng lớn của bé! Hãy cùng VietTyping hoàn thành lộ trình bên dưới để giúp con phát triển hoàn hảo hơn nhé!
              </p>
            </div>

            {/* Strengths and Weaknesses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Điểm mạnh */}
              <div className="bg-emerald-50/60 border-2 border-emerald-100 p-6 rounded-3xl shadow-[5px_5px_0px_0px_#d1fae5]">
                <h4 className="text-lg font-black text-emerald-800 mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Điểm Mạnh Của Bé ({analysisResult.strengths.length})</span>
                </h4>
                <ul className="space-y-3">
                  {analysisResult.strengths.map((str, idx) => (
                    <motion.li
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      key={idx} 
                      className="flex items-start gap-2 text-sm md:text-base font-semibold text-emerald-700"
                    >
                      <span className="text-emerald-500 mt-1">⭐</span>
                      <span>{str}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Điểm cần lưu ý */}
              <div className="bg-rose-50/60 border-2 border-rose-100 p-6 rounded-3xl shadow-[5px_5px_0px_0px_#ffe4e6]">
                <h4 className="text-lg font-black text-rose-800 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-rose-600" />
                  <span>Cần Cải Thiện & Lưu Ý ({analysisResult.weaknesses.length})</span>
                </h4>
                {analysisResult.weaknesses.length > 0 ? (
                  <ul className="space-y-3">
                    {analysisResult.weaknesses.map((weak, idx) => (
                      <motion.li
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        key={idx} 
                        className="flex items-start gap-2 text-sm md:text-base font-semibold text-rose-700"
                      >
                        <span className="text-rose-500 mt-1">📌</span>
                        <span>{weak}</span>
                      </motion.li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-6 text-rose-500 font-bold">
                    🎉 Bé học đều và xuất sắc ở mọi mặt! Không có lưu ý đáng ngại nào.
                  </div>
                )}
              </div>
            </div>

            {/* Personalized Roadmap (Lộ trình học tập) */}
            <div className="bg-white p-6 md:p-8 rounded-3xl border-2 border-slate-100 shadow-[6px_6px_0px_0px_#f1f5f9]">
              <h3 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-2">
                <Target className="w-6 h-6 text-indigo-500 animate-pulse" />
                <span>Lộ Trình Học Tập Thiết Kế Riêng Cho Bé</span>
              </h3>

              <div className="space-y-6">
                {analysisResult.tasks.map((task, idx) => (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.15 }}
                    key={task.id}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-100 hover:bg-slate-50/50 transition-all group"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${task.color} text-white flex items-center justify-center text-2xl shrink-0 shadow-lg`}>
                        {task.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-black px-2 py-0.5 rounded-full bg-slate-200 text-slate-600 uppercase">
                            {task.subjectName}
                          </span>
                          <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full uppercase ${
                            task.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                            task.difficulty === 'medium' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {task.difficulty === 'easy' ? 'Dễ' : task.difficulty === 'medium' ? 'Vừa' : 'Thử thách'}
                          </span>
                        </div>
                        <h4 className="text-lg font-black text-slate-800 group-hover:text-indigo-600 transition-colors">
                          {task.taskTitle}
                        </h4>
                        <p className="text-slate-600 text-sm mt-1 font-semibold leading-relaxed">
                          <span className="text-indigo-600 font-bold">Lý do:</span> {task.reason}
                        </p>
                        <p className="text-xs text-slate-400 mt-1.5 font-medium italic">
                          💡 Lời khuyên: {task.recommendation}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleStartTask(task.subjectId, task.topicId)}
                      className="w-full md:w-auto shrink-0 flex items-center justify-center gap-2 bg-white text-indigo-600 border-2 border-indigo-500 hover:bg-indigo-50 font-black px-5 py-3 rounded-xl transition-all cursor-pointer shadow-sm"
                    >
                      <span>Luyện tập ngay</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Parent Guide Tips */}
            <div className="bg-indigo-50/50 p-6 md:p-8 rounded-3xl border-2 border-indigo-100/60 shadow-[5px_5px_0px_0px_#e0e7ff] relative overflow-hidden">
              <div className="absolute -right-6 -bottom-6 opacity-10 text-indigo-900 pointer-events-none">
                <Lightbulb className="w-32 h-32" />
              </div>

              <h4 className="text-lg font-black text-indigo-900 mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-indigo-600" />
                <span>Gợi Ý Cho Ba Mẹ Để Đồng Hành Cùng Bé</span>
              </h4>
              <ul className="space-y-3">
                {analysisResult.parentTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm md:text-base font-semibold text-indigo-800">
                    <span className="text-indigo-500 mt-1">☀️</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
