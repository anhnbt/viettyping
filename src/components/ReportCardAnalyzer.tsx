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
  BrainCircuit,
  Activity,
  Globe,
  Heart,
  Eye,
  Star,
  GraduationCap
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

const SAMPLE_COMMENT = `| Môn học / Hoạt động giáo dục | Nhận xét chi tiết của giáo viên |
| :--- | :--- |
| **Tiếng Việt** | Đọc to, rõ ràng; hiểu được nội dung bài đọc; lưu ý viết đúng tốc độ. |
| **Toán** | Tính toán cẩn thận, chính xác; vận dụng kĩ năng giải toán phù hợp với thực tế. |
| **Ngoại ngữ / Tiếng Anh** | Con học tốt trong học kỳ 2; nắm vững kiến thức và hoàn thành bài xuất sắc; tiếp tục phát huy. |
| **Đạo đức** | Thực hiện tốt các hành vi đã học; vận dụng linh hoạt các hành vi đạo đức vào cuộc sống. |
| **Tự nhiên và xã hội** | Hiểu tốt nội dung bài học; vận dụng tốt kiến thức đã học vào cuộc sống. |
| **Giáo dục thể chất** | Em đã thực hiện cơ bản nội dung, động tác đã học, cần cố gắng hơn trong tập luyện. |
| **Nghệ thuật (Âm nhạc)** | Rèn hát đúng giai điệu các bài hát và các bài đọc nhạc. |
| **Nghệ thuật (Mĩ thuật)** | Vẽ đúng khung hình, tô màu còn chưa đều. |
| **Hoạt động trải nghiệm** | Thực hiện được một số yêu cầu cơ bản của chủ đề đã học; cần tập trung hơn trong giờ học. |

=== ĐÁNH GIÁ SỰ HÌNH THÀNH VÀ PHÁT TRIỂN NĂNG LỰC, PHẨM CHẤT ===

* **Phẩm chất:** Yêu nước, nhân ái, chăm chỉ, trung thực, trách nhiệm. Yêu quý thầy cô, giúp đỡ bạn bè; chăm học, thực hiện tốt nội quy lớp học; hăng hái phát biểu xây dựng bài.
* **Năng lực:** Tự chủ và tự học, giao tiếp và hợp tác, giải quyết vấn đề sáng tạo. Tự giác, chủ động trong học tập, phối hợp tốt với các bạn trong nhóm; biết giải quyết một số tình huống.`;

// Helper functions to parse basic markdown to JSX without external libraries
function renderBoldText(text: string): React.ReactNode[] {
  const parts = text.split(/\*\*([^*]+)\*\*/g);
  return parts.map((part, idx) => {
    if (idx % 2 === 1) {
      return <strong key={idx} className="font-black text-slate-800">{part}</strong>;
    }
    return part;
  });
}

function renderTableJSX(headers: string[], rows: string[][], keyIndex: number) {
  return (
    <div key={keyIndex} className="w-full overflow-x-auto border-3 border-[var(--color-foreground)] rounded-[20px] shadow-[3px_3px_0px_0px_var(--color-foreground)] my-5 bg-[var(--color-surface)] max-w-full">
      <table className="w-full text-left border-collapse text-sm min-w-[500px]">
        <thead>
          <tr className="bg-[var(--color-primary)] text-[var(--color-on-primary-container)] border-b-3 border-[var(--color-foreground)] font-black">
            {headers.map((h, idx) => (
              <th key={idx} className="p-3 md:p-3.5 font-black uppercase tracking-wider text-sm">
                {renderBoldText(h)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--color-foreground)]/20">
          {rows.map((row, rowIdx) => (
            <tr 
              key={rowIdx} 
              className={`font-semibold hover:bg-slate-50/50 transition-colors ${
                rowIdx % 2 === 1 ? 'bg-slate-50/30' : 'bg-white'
              }`}
            >
              {row.map((cell, cellIdx) => (
                <td key={cellIdx} className="p-3 md:p-3.5 text-slate-700 leading-relaxed text-sm">
                  {renderBoldText(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function parseMarkdownToJSX(text: string) {
  if (!text) return null;
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  
  let inTable = false;
  let tableHeaders: string[] = [];
  let tableRows: string[][] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip table divider row
    if (line.startsWith('|') && (line.includes('---') || line.includes(':---'))) {
      continue;
    }
    
    // If it is a table row
    if (line.startsWith('|') && line.endsWith('|')) {
      const cells = line.split('|').map(c => c.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
      if (!inTable) {
        inTable = true;
        tableHeaders = cells;
      } else {
        tableRows.push(cells);
      }
      continue;
    } else {
      // If table ended, render accumulated table
      if (inTable) {
        elements.push(renderTableJSX(tableHeaders, tableRows, i - 1));
        inTable = false;
        tableHeaders = [];
        tableRows = [];
      }
    }
    
    if (line === '') {
      continue;
    }

    // Title divider e.g. === HEADER ===
    if (line.startsWith('===') && line.endsWith('===')) {
      const titleText = line.replace(/===/g, '').trim();
      elements.push(
        <div key={i} className="my-5 p-3 bg-[var(--color-surface-container)] border-l-4 border-[var(--color-primary)] border-y border-r border-[var(--color-foreground)] rounded-r-xl text-[var(--color-foreground)] font-black text-sm uppercase tracking-wider flex items-center gap-2 shadow-[2px_2px_0px_0px_var(--color-foreground)]">
          <span>{titleText}</span>
        </div>
      );
      continue;
    }

    // Bullet list e.g. * **Item:** text
    if (line.startsWith('*')) {
      const content = line.substring(1).trim();
      elements.push(
        <div key={i} className="flex items-start gap-2 my-2 pl-1.5">
          <Sparkles className="w-4 h-4 text-amber-500 mt-1 shrink-0" />
          <span className="text-slate-700 text-sm font-semibold leading-relaxed">
            {renderBoldText(content)}
          </span>
        </div>
      );
      continue;
    }

    // Standard paragraph
    elements.push(
      <p key={i} className="text-slate-600 text-sm my-1.5 font-medium leading-relaxed">
        {renderBoldText(line)}
      </p>
    );
  }

  // Handle case where table is at the end of the text
  if (inTable) {
    elements.push(renderTableJSX(tableHeaders, tableRows, lines.length));
  }

  return elements;
}

export default function ReportCardAnalyzer() {
  const router = useRouter();
  const { playSound } = useSound();
  const [commentText, setCommentText] = useState('');
  const [inputMode, setInputMode] = useState<'edit' | 'preview'>('edit');
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
            recommendation: 'Ba mẹ ơi, đừng giục bé gõ nhanh kẻo bé bị căng thẳng nha. Hãy khuyến khích con gõ đều tay, xem việc vượt thử thách 25 từ/phút (WPM) như một trò chơi thú vị thôi nè.',
            icon: 'book',
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
            recommendation: 'Hãy khuyến khích bé đếm kỹ các món đồ xinh xắn hiển thị trên màn hình trước khi gõ đáp án nha ba mẹ. Cách này vừa rèn tính cẩn thận, vừa giúp con liên hệ toán học với thực tế siêu tốt đó.',
            icon: 'math',
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
            recommendation: 'Hãy cùng con phát âm thật to và rõ các từ vựng khi gõ nha ba mẹ. Vừa học vừa tương tác thế này sẽ giúp bé nhớ bài siêu nhanh và tăng tính gắn kết gia đình nữa nè!',
            icon: 'english',
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
          recommendation: 'Ba mẹ hãy dành lời khen cho những hành động nhỏ siêu dễ thương như giúp đỡ bạn bè hay lễ phép hôm nay của bé nha. Trò chuyện cùng con về tình thương gia đình sẽ tiếp thêm năng lượng tích cực cho con đó.',
          icon: 'heart',
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
            recommendation: 'Sau mỗi 15 phút học, ba mẹ nhớ cùng bé tập vài động tác duỗi tay nhẹ nhàng hoặc nhắm mắt chơi trò "trốn tìm" 5 phút nha. Việc này giúp bé giải tỏa năng lượng và bảo vệ đôi mắt cho con yêu nè.',
            icon: 'run',
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
            recommendation: 'Ba mẹ có thể bật bài nhạc thiếu nhi con thích, rồi khuyến khích bé vừa nghe vừa hát theo khi gõ phím nha. Âm nhạc sẽ biến giờ học gõ phím thành một buổi hòa nhạc siêu vui vẻ luôn!',
            icon: 'music',
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
            recommendation: 'Hãy khen ngợi nỗ lực chọn và phối màu cực sáng tạo của con thay vì đòi hỏi tô thật hoàn hảo ba mẹ nhé. Ba mẹ hướng dẫn nhẹ nhàng cách con di chuột hoặc chạm tay đều tay là được rồi nè.',
            icon: 'palette',
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
            recommendation: 'Ba mẹ thử áp dụng mẹo "Pomodoro nhí" nha: chia nhỏ giờ học thành các chặng 10-15 phút, tắt tivi hay điện thoại để tránh xao nhãng và nhớ khen ngợi khi con kiên trì hoàn thành bài nhé!',
            icon: 'target',
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
      let title = 'Ngôi Sao Lớp Một';
      if (strengths.length > 5) {
        title = 'Siêu Nhân Học Tập Toàn Năng';
      } else if (weaknesses.length === 0) {
        title = 'Học Sinh Xuất Sắc Toàn Diện';
      } else if (weaknesses.length > 4) {
        title = 'Ngôi Sao Triển Vọng Đang Tỏa Sáng';
      }

      // Tạo gợi ý dựa trên Tâm lý học trẻ em (Piaget, SDT, Growth Mindset)
      parentTips.push('Khen ngợi nỗ lực, không khen thông minh: Ba mẹ nhớ khen quá trình kiên trì gõ phím hoặc tập trung của con thay vì chỉ nhìn điểm số nha (Ví dụ: "Mẹ rất vui vì hôm nay con đã tự gõ hết những từ khó này luôn!").');
      parentTips.push('Tôn trọng sự tự chủ của con yêu: Hãy để con tự quyết định bài học mình thích hoặc tự đổi hình đại diện dễ thương. Trải nghiệm tự chọn giúp con hứng thú tự học hơn nhiều đó.');
      parentTips.push('Trải nghiệm trực quan là chìa khóa: Bé 6 tuổi học qua hình ảnh và phản xạ thực tế. Ba mẹ hãy để bé tự gõ, tuyệt đối không gõ hộ kẻo mất tính chủ động của con nhé.');

      if (weaknesses.length > 0) {
        parentTips.push('Làm bạn với lỗi sai: Khi con gõ nhầm, ba mẹ hãy mỉm cười xoa đầu con: "Không sao nè, lỗi sai chính là cách bộ não của con đang học cách sửa để thông minh hơn đó!" để con luôn tự tin nha.');
      } else {
        parentTips.push('Cùng con chinh phục thử thách mới: Bé đang làm rất tốt và học siêu đều luôn! Ba mẹ hãy khuyến khích con tự thử sức với các bài học khó hơn một xíu để kích thích tính tò mò khám phá của con nha.');
      }

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

  const getTaskIcon = (iconName: string) => {
    switch (iconName) {
      case 'book': return <BookOpen className="w-6 h-6" />;
      case 'math': return <BrainCircuit className="w-6 h-6" />;
      case 'english': return <Globe className="w-6 h-6" />;
      case 'heart': return <Heart className="w-6 h-6 text-rose-500" />;
      case 'run': return <Activity className="w-6 h-6" />;
      case 'music': return <Music className="w-6 h-6" />;
      case 'palette': return <Palette className="w-6 h-6" />;
      case 'target': return <Target className="w-6 h-6" />;
      default: return <GraduationCap className="w-6 h-6" />;
    }
  };

  const handleStartTask = (subjectId: string, topicId: string) => {
    playSound('tada');
    router.push(`/subjects/${subjectId}/topics/${topicId}`);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Input Section */}
      <div className="bg-[var(--color-surface)] p-6 md:p-8 rounded-[24px] border-4 border-[var(--color-foreground)] shadow-[6px_6px_0px_0px_var(--color-foreground)] mb-8 relative overflow-hidden transition-colors">
        <div className="absolute top-0 right-0 p-4 bg-[var(--color-background)] border-b-2 border-l-2 border-[var(--color-foreground)] text-[var(--color-primary-depth)] rounded-bl-3xl">
          <BrainCircuit className="w-6 h-6 animate-pulse" />
        </div>
        
        <h2 className="text-2xl font-black text-[var(--color-foreground)] mb-2 flex items-center gap-2">
          <span>Phân Tích Nhận Xét Của Cô Giáo</span>
          <Sparkles className="w-5 h-5 text-[var(--color-accent)] animate-spin" style={{ animationDuration: '6s' }} />
        </h2>
        <p className="text-[var(--color-foreground)] opacity-80 text-sm md:text-base mb-6 font-semibold leading-relaxed">
          Dán nhận xét học kỳ hoặc tổng kết của giáo viên vào ô bên dưới. Trí tuệ nhân tạo của VietTyping sẽ phân tích và lập kế hoạch rèn luyện các kỹ năng bé còn yếu thông qua trò chơi tương tác.
        </p>

        {/* Markdown Tabs Selector */}
        <div className="flex border-b-2 border-[var(--color-foreground)] mb-4 gap-2">
          <button
            type="button"
            onClick={() => setInputMode('edit')}
            className={`px-4 py-2 font-black text-sm border-b-4 transition-all cursor-pointer ${
              inputMode === 'edit'
                ? 'border-[var(--color-foreground)] text-[var(--color-foreground)]'
                : 'border-transparent text-[var(--color-foreground)] opacity-50 hover:opacity-100'
            }`}
          >
            <span className="flex items-center gap-1.5"><PenTool className="w-4 h-4" />Nhập nhận xét</span>
          </button>
          <button
            type="button"
            disabled={!commentText.trim()}
            onClick={() => {
              setInputMode('preview');
              playSound('click');
            }}
            className={`px-4 py-2 font-black text-sm border-b-4 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
              inputMode === 'preview'
                ? 'border-[var(--color-foreground)] text-[var(--color-foreground)]'
                : 'border-transparent text-[var(--color-foreground)] opacity-50 hover:opacity-100'
            }`}
          >
            <span className="flex items-center gap-1.5"><Eye className="w-4 h-4" />Xem trước học bạ</span>
          </button>
        </div>

        {/* Text Area vs Markdown Preview Render */}
        {inputMode === 'edit' ? (
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Dán nhận xét học bạ của bé tại đây... Ví dụ: Tiếng Việt đọc to rõ ràng, cần viết đúng tốc độ. Toán tính toán cẩn thận..."
            className="w-full h-52 p-4 border-3 border-[var(--color-foreground)] bg-[var(--color-background)] rounded-[20px] focus:outline-none focus:ring-4 focus:ring-[var(--color-primary-container)] transition-all font-bold text-[var(--color-foreground)] placeholder-slate-400 text-sm md:text-base resize-none mb-4"
          />
        ) : (
          <div className="w-full h-52 p-5 border-3 border-dashed border-[var(--color-foreground)] rounded-[20px] bg-[var(--color-background)] mb-4 overflow-y-auto custom-scrollbar">
            {parseMarkdownToJSX(commentText)}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
          <button
            type="button"
            onClick={handleFillSample}
            className="keycap-btn-surface px-5 py-2.5 text-sm flex items-center gap-2 w-full sm:w-auto"
          >
            <ClipboardList className="w-4 h-4" />
            <span>Điền nhận xét mẫu của cô</span>
          </button>

          <button
            type="button"
            onClick={handleAnalyze}
            disabled={!commentText.trim() || isAnalyzing}
            className={`keycap-btn-primary w-full sm:w-auto px-8 py-3.5 flex items-center justify-center gap-2 ${
              (!commentText.trim() || isAnalyzing) ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''
            }`}
          >
            {isAnalyzing ? (
              <>
                <div className="w-5 h-5 border-3 border-current border-t-transparent rounded-full animate-spin" />
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
            <div className="bg-[var(--color-accent)] border-4 border-[var(--color-foreground)] p-6 md:p-8 rounded-[24px] text-[var(--color-foreground)] shadow-[6px_6px_0px_0px_var(--color-foreground)] text-center relative overflow-hidden transition-colors">
              <div className="absolute -left-10 -top-10 w-40 h-40 bg-white/15 rounded-full blur-xl pointer-events-none" />
              
              <div className="inline-block p-3 bg-[var(--color-surface)] border-2 border-[var(--color-foreground)] rounded-2xl mb-4 animate-bounce shadow-[2px_2px_0px_0px_var(--color-foreground)]">
                <Trophy className="w-10 h-10" />
              </div>
              <h3 className="text-sm font-black uppercase tracking-wider opacity-75 mb-1">Đánh giá chung cho bé</h3>
              <h1 className="text-3xl md:text-4xl font-black mb-3 text-[var(--color-foreground)]">{analysisResult.title}</h1>
              <p className="opacity-90 font-black max-w-xl mx-auto text-sm md:text-base leading-relaxed">
                Cô giáo đã ghi nhận sự cố gắng lớn của bé! Hãy cùng VietTyping hoàn thành lộ trình bên dưới để giúp con phát triển hoàn hảo hơn nhé!
              </p>
            </div>

            {/* Strengths and Weaknesses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Điểm mạnh */}
              <div className="bg-[var(--color-surface)] border-4 border-[var(--color-foreground)] p-6 rounded-[24px] shadow-[4px_4px_0px_0px_var(--color-foreground)] transition-colors">
                <h4 className="text-lg font-black text-[var(--color-foreground)] mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[var(--color-primary-depth)]" />
                  <span>Điểm Mạnh Của Bé ({analysisResult.strengths.length})</span>
                </h4>
                <ul className="space-y-3">
                  {analysisResult.strengths.map((str, idx) => (
                    <motion.li
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      key={idx} 
                      className="flex items-start gap-2 text-sm md:text-base font-black text-[var(--color-foreground)]/90"
                    >
                      <Star className="w-4 h-4 text-amber-500 mt-1 shrink-0 fill-amber-500" />
                      <span>{str}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Điểm cần lưu ý */}
              <div className="bg-[var(--color-surface)] border-4 border-[var(--color-foreground)] p-6 rounded-[24px] shadow-[4px_4px_0px_0px_var(--color-foreground)] transition-colors">
                <h4 className="text-lg font-black text-[var(--color-foreground)] mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[var(--color-tertiary)]" />
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
                        className="flex items-start gap-2 text-sm md:text-base font-black text-[var(--color-foreground)]/90"
                      >
                        <Lightbulb className="w-4 h-4 text-[var(--color-tertiary)] mt-1 shrink-0" />
                        <span>{weak}</span>
                      </motion.li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-6 text-[var(--color-primary)] font-black text-sm">
                    Bé học đều và xuất sắc ở mọi mặt! Không có lưu ý đáng ngại nào.
                  </div>
                )}
              </div>
            </div>

            {/* Personalized Roadmap (Lộ trình học tập) */}
            <div className="bg-[var(--color-surface)] p-6 md:p-8 rounded-[24px] border-4 border-[var(--color-foreground)] shadow-[6px_6px_0px_0px_var(--color-foreground)] transition-colors">
              <h3 className="text-2xl font-black text-[var(--color-foreground)] mb-6 flex items-center gap-2">
                <Target className="w-6 h-6 text-[var(--color-primary-depth)] animate-pulse" />
                <span>Lộ Trình Học Tập Thiết Kế Riêng Cho Bé</span>
              </h3>

              <div className="space-y-6">
                {analysisResult.tasks.map((task, idx) => (
                  <motion.div
                     initial={{ opacity: 0, y: 15 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: idx * 0.15 }}
                     key={task.id}
                     className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-[var(--color-background)] border-2 border-[var(--color-foreground)] shadow-[2px_2px_0px_0px_var(--color-foreground)] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_var(--color-foreground)] transition-all group"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${task.color} text-white flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_var(--color-foreground)] border-2 border-[var(--color-foreground)]`}>
                        {getTaskIcon(task.icon)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-black px-2 py-0.5 rounded-full bg-[var(--color-surface)] border border-[var(--color-foreground)] text-[var(--color-foreground)] uppercase">
                            {task.subjectName}
                          </span>
                          <span className={`text-sm font-black px-1.5 py-0.5 rounded-full uppercase border border-[var(--color-foreground)] ${
                            task.difficulty === 'easy' ? 'bg-[var(--color-primary-container)] text-[var(--color-foreground)]' :
                            task.difficulty === 'medium' ? 'bg-[var(--color-secondary-container)] text-[var(--color-foreground)]' : 'bg-red-200 text-red-950'
                          }`}>
                            {task.difficulty === 'easy' ? 'Dễ' : task.difficulty === 'medium' ? 'Vừa' : 'Thử thách'}
                          </span>
                        </div>
                        <h4 className="text-lg font-black text-[var(--color-foreground)] group-hover:text-[var(--color-primary-depth)] transition-colors">
                          {task.taskTitle}
                        </h4>
                        <p className="text-[var(--color-foreground)] opacity-95 text-sm mt-1 font-semibold leading-relaxed">
                          <span className="text-[var(--color-primary-depth)] font-black">Lý do:</span> {task.reason}
                        </p>
                        <p className="text-sm text-[var(--color-foreground)] opacity-70 mt-1.5 font-bold italic">
                          Lời khuyên: {task.recommendation}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleStartTask(task.subjectId, task.topicId)}
                      className="keycap-btn-primary px-5 py-3 text-sm shrink-0 w-full md:w-auto"
                    >
                      <span className="flex items-center gap-2">
                        <span>Luyện tập ngay</span>
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Parent Guide Tips */}
            <div className="bg-[var(--color-surface-container)] p-6 md:p-8 rounded-[24px] border-4 border-[var(--color-foreground)] shadow-[4px_4px_0px_0px_var(--color-foreground)] relative overflow-hidden transition-colors">
              <div className="absolute -right-6 -bottom-6 opacity-15 text-[var(--color-foreground)] pointer-events-none">
                <Lightbulb className="w-32 h-32 animate-pulse" />
              </div>

              <h4 className="text-lg font-black text-[var(--color-foreground)] mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-[var(--color-primary-depth)]" />
                <span>Gợi Ý Cho Ba Mẹ Để Đồng Hành Cùng Bé</span>
              </h4>
              <ul className="space-y-3">
                {analysisResult.parentTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm md:text-base font-black text-[var(--color-foreground)]/90">
                    <Sparkles className="w-4 h-4 text-amber-500 mt-1 shrink-0" />
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
