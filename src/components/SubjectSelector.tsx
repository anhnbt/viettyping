import React from 'react';
import { Subject } from '@/data/subjects';
import { useProgress } from '@/hooks/useProgress';
import { useSound } from '@/contexts/SoundContext';
import { motion } from 'framer-motion';
import { ChevronRight, Star } from 'lucide-react';
import { Be_Vietnam_Pro } from 'next/font/google';

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700', '800', '900']
});

interface SubjectSelectorProps {
  subjects: Subject[];
  onSelectSubject: (subject: Subject) => void;
}

const SubjectSelector: React.FC<SubjectSelectorProps> = ({
  subjects,
  onSelectSubject,
}) => {
  const { getTopicProgress, isLoaded } = useProgress();
  const { playSound } = useSound();

  if (!isLoaded) return null;

  // Stagger container animation
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 12
      }
    }
  };

  return (
    <div className={`max-w-6xl mx-auto px-6 py-10 ${beVietnamPro.className}`}>
      {/* Title section */}
      <div className="text-center mb-10">
        <motion.h2 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-4xl md:text-5xl font-black text-indigo-950 mb-3 drop-shadow-sm tracking-wide"
        >
          🎒 Lớp Học Kỳ Diệu
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-indigo-700/80 font-bold"
        >
          Bé hãy chọn một môn học để bắt đầu chuyến phiêu lưu tri thức nhé! 🚀
        </motion.p>
      </div>

      {/* Grid of subjects */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
      >
        {subjects.map((subject) => {
          const rawProgress = getTopicProgress(subject.topics.flatMap(t => t.activities.map(a => a.id)));
          const progress = Math.min(100, Math.max(0, rawProgress)); // Đảm bảo luôn nằm trong khoảng 0-100
          
          return (
            <motion.div
              key={subject.id}
              variants={itemVariants}
              whileHover={{ 
                y: -6,
                rotate: [0, -1, 1, 0],
                transition: { duration: 0.3 }
              }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                playSound('click');
                onSelectSubject(subject);
              }}
              className={`relative overflow-hidden rounded-[28px] bg-gradient-to-br ${subject.color} p-6 text-white cursor-pointer border-b-[6px] border-black/20 shadow-[6px_6px_0px_0px_#1e1b4b]/15 group transition-shadow duration-300 hover:shadow-[8px_8px_0px_0px_#1e1b4b]/20`}
            >
              <div className="relative z-10 flex flex-col h-full justify-between min-h-[190px]">
                <div>
                  {/* Icon with white circular background */}
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-4xl mb-4 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 border border-white/30 shadow-inner">
                    {subject.icon}
                  </div>
                  
                  {/* Subject Name */}
                  <h3 className="text-xl md:text-2xl font-black mb-1.5 tracking-wide drop-shadow-sm">
                    {subject.name}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-sm opacity-90 font-medium line-clamp-2 leading-relaxed mb-4">
                    {subject.description}
                  </p>
                </div>

                <div>
                  {/* Extra info & Progress */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    {subject.grade && (
                      <span className="inline-flex items-center gap-1 bg-white/25 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-black tracking-wide border border-white/20">
                        {subject.grade}
                      </span>
                    )}
                    <span className="text-xs font-bold opacity-90">
                      {subject.topics.length} chủ đề
                    </span>
                  </div>

                  {/* Progress Bar Container */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[10px] font-black tracking-wide uppercase opacity-90">
                      <span>Tiến độ</span>
                      <span className="flex items-center gap-0.5">
                        {progress > 0 && <Star className="w-3 h-3 text-yellow-300 fill-yellow-300 animate-pulse" />}
                        {progress}%
                      </span>
                    </div>
                    <div className="w-full bg-black/25 h-3.5 rounded-full p-0.5 overflow-hidden border border-black/10">
                      <motion.div
                        className="bg-gradient-to-r from-yellow-300 to-amber-400 h-full rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating circular detail button */}
              <div className="absolute top-4 right-4 bg-white/15 hover:bg-white/25 rounded-full p-2 border border-white/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-sm">
                <ChevronRight className="w-5 h-5 text-white" />
              </div>

              {/* Playful background design curves */}
              <div className="absolute -bottom-10 -right-10 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform duration-500"></div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Encouragement message banner */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-14 text-center"
      >
        <div className="inline-flex items-center gap-2 bg-indigo-50 border-2 border-indigo-100 rounded-full px-6 py-3.5 shadow-sm hover:scale-102 transition-transform">
          <div className="w-3.5 h-3.5 bg-emerald-500 rounded-full animate-ping"></div>
          <span className="text-indigo-900 font-black text-sm md:text-base">
            Tất cả các môn đều có phần thưởng Sao Vàng và Huy Hiệu đang chờ bé! ⭐
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default SubjectSelector;


