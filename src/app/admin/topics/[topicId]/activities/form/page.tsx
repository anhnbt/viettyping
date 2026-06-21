"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/utils/supabase";
import { 
  Save, 
  ArrowLeft, 
  Sparkles,
  Eye,
  Settings,
  HelpCircle,
  Plus,
  Trash2,
  AlertTriangle
} from "lucide-react";
import { useSound } from "@/contexts/SoundContext";

// Import actual activity components for Live Preview
import { 
  QuizActivity, 
  DrawingActivity, 
  TypingActivity,
  MathActivity
} from "@/components/activities";

import MatchingGame from "@/components/MatchingGame";
import TrueFalseGame from "@/components/TrueFalseGame";
import SpinWheelGame from "@/components/SpinWheelGame";
import FillInTheBlankGame from "@/components/FillInTheBlankGame";
import MultipleChoiceGame from "@/components/MultipleChoiceGame";

interface DbTopic {
  id: string;
  subject_id: string;
  title: string;
}

export default function AdminActivityForm({ params }: { params: Promise<{ topicId: string }> }) {
  const { topicId } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const activityId = searchParams.get("id"); // Exist for Edit Mode
  const { playSound } = useSound();

  const [topic, setTopic] = useState<DbTopic | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form Field States
  const [id, setId] = useState("");
  const [type, setType] = useState<string>("typing");
  const [title, setTitle] = useState("");
  const [instructions, setInstructions] = useState("");
  const [sortOrder, setSortOrder] = useState(1);

  // Dynamic Fields
  const [content, setContent] = useState("");
  const [targetScore, setTargetScore] = useState<number>(100);
  const [timeLimit, setTimeLimit] = useState<number>(0);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  
  // Multiple Choice Quiz options
  const [options, setOptions] = useState<string[]>(["", "", ""]);

  // Math fields
  const [mathSubtype, setMathSubtype] = useState("vertical");
  const [mathOperand1, setMathOperand1] = useState(5);
  const [mathOperand2, setMathOperand2] = useState(3);
  const [mathOperator, setMathOperator] = useState("+");

  // Drawing fields
  const [drawOutline, setDrawOutline] = useState("heart");
  const [drawTargetCoverage, setDrawTargetCoverage] = useState(70);

  // Game Subtype fields
  const [gameSubtype, setGameSubtype] = useState("matching");
  // Simple JSON text editor for complex game configuration data
  const [gameDataRaw, setGameDataRaw] = useState(`{
  "flashcards": [
    { "word": "bóng", "image": "/assets/games/ball.png" },
    { "word": "bàn", "image": "/assets/games/table.png" }
  ],
  "items": [
    { "word": "bóng", "image": "/assets/games/ball.png" },
    { "word": "bàn", "image": "/assets/games/table.png" }
  ]
}`);

  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        setIsLoading(true);

        // Fetch Topic details
        const { data: topicData, error: topicError } = await supabase
          .from("topics")
          .select("id, subject_id, title")
          .eq("id", topicId)
          .single();

        if (topicError) throw topicError;
        setTopic(topicData);

        if (activityId) {
          // Edit mode: fetch activity details
          const { data: act, error: actError } = await supabase
            .from("activities")
            .select("*")
            .eq("id", activityId)
            .single();

          if (actError) throw actError;

          if (act) {
            setId(act.id);
            setType(act.type);
            setTitle(act.title);
            setInstructions(act.instructions || "");
            setSortOrder(act.sort_order);
            setContent(act.content || "");
            setTargetScore(act.target_score || 100);
            setTimeLimit(act.time_limit || 0);
            setCorrectAnswer(act.correct_answer || "");
            setImageUrl(act.image_url || "");
            if (act.options) {
              setOptions(act.options);
            }

            // Sub-type specific parsing
            if (act.type === "math" && act.data) {
              setMathSubtype(act.data.subtype || "vertical");
              setMathOperand1(act.data.operand1 ?? 5);
              setMathOperand2(act.data.operand2 ?? 3);
              setMathOperator(act.data.operator ?? "+");
            } else if (act.type === "drawing" && act.data) {
              setDrawOutline(act.data.outlineSvgName || "heart");
              setDrawTargetCoverage(act.data.targetCoveragePercent || 70);
            } else if (act.type === "game" && act.data) {
              setGameSubtype(act.data.subtype || "matching");
              setGameDataRaw(JSON.stringify(act.data, null, 2));
            }
          }
        } else {
          // Create mode: fetch current activities to get sort order
          const { data: acts } = await supabase
            .from("activities")
            .select("sort_order")
            .eq("topic_id", topicId);
          
          setSortOrder((acts?.length || 0) + 1);
          setId(`activity-${(acts?.length || 0) + 1}`);
        }
      } catch (err: any) {
        console.error("Lỗi khi tải biểu mẫu:", err);
        showNotification("error", "Không thể tải cấu hình bài học");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetadata();
  }, [topicId, activityId]);

  // Construct mock Activity object for Live Preview
  const getPreviewActivity = (): any => {
    let finalData: any = {};
    if (type === "math") {
      finalData = {
        subtype: mathSubtype,
        operand1: mathOperand1,
        operand2: mathOperand2,
        operator: mathOperator
      };
    } else if (type === "drawing") {
      finalData = {
        outlineSvgName: drawOutline,
        targetCoveragePercent: drawTargetCoverage
      };
    } else if (type === "game") {
      try {
        finalData = JSON.parse(gameDataRaw);
        finalData.subtype = gameSubtype;
      } catch (e) {
        finalData = { subtype: gameSubtype, items: [], flashcards: [] };
      }
    }

    return {
      id: id || "preview-id",
      type,
      title: title || "Tiêu đề bài học xem trước",
      instructions: instructions || "Xem hướng dẫn hiển thị ở đây",
      content,
      correctAnswer,
      imageUrl,
      options: options.filter(o => o !== ""),
      data: finalData
    };
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id.trim() || !title.trim()) {
      showNotification("error", "Vui lòng nhập Mã và Tiêu đề bài tập");
      return;
    }

    if (!/^[a-z0-9-]+$/.test(id)) {
      showNotification("error", "Mã bài tập chỉ được chứa chữ thường, số và dấu gạch ngang (-)");
      return;
    }

    setIsSaving(true);

    try {
      // Build data field
      let finalData: any = null;
      if (type === "math") {
        finalData = {
          subtype: mathSubtype,
          operand1: mathOperand1,
          operand2: mathOperand2,
          operator: mathOperator
        };
      } else if (type === "drawing") {
        finalData = {
          outlineSvgName: drawOutline,
          targetCoveragePercent: drawTargetCoverage
        };
      } else if (type === "game") {
        try {
          finalData = JSON.parse(gameDataRaw);
          finalData.subtype = gameSubtype;
        } catch (e) {
          showNotification("error", "Dữ liệu JSON của Trò chơi không hợp lệ!");
          setIsSaving(false);
          return;
        }
      }

      const activityData = {
        id,
        topic_id: topicId,
        type,
        title,
        instructions,
        sort_order: sortOrder,
        content: type === "typing" || type === "quiz" ? content : null,
        target_score: targetScore || null,
        time_limit: timeLimit || null,
        correct_answer: type === "quiz" ? correctAnswer : null,
        options: type === "quiz" ? options.filter(o => o.trim() !== "") : null,
        image_url: type === "quiz" && imageUrl.trim() !== "" ? imageUrl : null,
        data: finalData,
        updated_at: new Date().toISOString()
      };

      if (activityId) {
        // Edit Mode
        const { error } = await supabase
          .from("activities")
          .update(activityData)
          .eq("id", activityId);

        if (error) throw error;
        showNotification("success", "Cập nhật bài tập thành công!");
      } else {
        // Create Mode: Check if ID already exists
        const { data: existing } = await supabase
          .from("activities")
          .select("id")
          .eq("id", id)
          .single();

        if (existing) {
          showNotification("error", "Mã bài tập này đã tồn tại!");
          setIsSaving(false);
          return;
        }

        const { error } = await supabase
          .from("activities")
          .insert(activityData);

        if (error) throw error;
        showNotification("success", "Thêm bài tập thành công!");
      }

      playSound("tada");
      setTimeout(() => {
        router.push(`/admin/topics/${topicId}/activities`);
      }, 1000);
    } catch (err: any) {
      console.error("Lỗi khi lưu bài tập:", err);
      showNotification("error", "Lỗi: Không thể lưu thông tin bài tập.");
      setIsSaving(false);
    }
  };

  const addOption = () => {
    playSound("click");
    setOptions([...options, ""]);
  };

  const removeOption = (index: number) => {
    playSound("click");
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleOptionChange = (index: number, val: string) => {
    const updated = [...options];
    updated[index] = val;
    setOptions(updated);
  };

  const renderLivePreview = () => {
    const previewAct = getPreviewActivity();

    switch (type) {
      case "typing":
        return (
          <TypingActivity
            activity={previewAct}
            onComplete={(tel) => alert(`Luyện gõ hoàn thành! Điểm: ${tel.score}`)}
            onProgressUpdate={() => {}}
          />
        );
      case "quiz":
        return (
          <QuizActivity
            activity={previewAct}
            onComplete={(tel) => alert(`Câu đố hoàn thành! Điểm: ${tel.score}`)}
            onProgressUpdate={() => {}}
          />
        );
      case "math":
        return (
          <MathActivity
            activity={previewAct}
            onComplete={(tel) => alert(`Toán hoàn thành! Điểm: ${tel.score}`)}
            onProgressUpdate={() => {}}
          />
        );
      case "drawing":
        return (
          <DrawingActivity
            activity={previewAct}
            onComplete={(tel) => alert(`Tô màu hoàn thành! Điểm: ${tel.score}`)}
            onProgressUpdate={() => {}}
          />
        );
      case "game":
        switch (gameSubtype) {
          case "matching":
            return (
              <MatchingGame
                gameConfig={{ id: "preview", type: "matching_game", items: previewAct.data.items || [] }}
                flashcards={previewAct.data.flashcards}
                onComplete={(tel) => alert(`Nối hình hoàn thành! Điểm: ${tel.score}`)}
              />
            );
          case "true_false":
            return (
              <TrueFalseGame
                gameConfig={{ id: "preview", type: "true_false_game", items: previewAct.data.items || [] }}
                flashcards={previewAct.data.flashcards}
                onComplete={(tel) => alert(`Đúng Sai hoàn thành! Điểm: ${tel.score}`)}
              />
            );
          case "spinwheel":
            return (
              <SpinWheelGame
                gameConfig={{ id: "preview", type: "spin_wheel_items", items: previewAct.data.items || [] }}
                flashcards={previewAct.data.flashcards}
                onComplete={(tel) => alert(`Vòng quay hoàn thành! Điểm: ${tel.score}`)}
              />
            );
          case "fill_in_the_blank":
            return (
              <FillInTheBlankGame
                gameConfig={{ id: "preview", type: "fill_in_the_blank", items: previewAct.data.items || [] }}
                flashcards={previewAct.data.flashcards}
                onComplete={(tel) => alert(`Điền từ hoàn thành! Điểm: ${tel.score}`)}
              />
            );
          case "multiple_choice":
            return (
              <MultipleChoiceGame
                gameConfig={{ id: "preview", type: "multiple_choice", items: previewAct.data.items || [] }}
                flashcards={previewAct.data.flashcards}
                onComplete={(tel) => alert(`Trắc nghiệm hoàn thành! Điểm: ${tel.score}`)}
              />
            );
          default:
            return <div className="text-slate-500 font-bold p-8 text-center">Trò chơi này đang phát triển preview.</div>;
        }
      default:
        return <div className="text-slate-500 font-bold p-8 text-center">Không hỗ trợ preview cho thể loại này.</div>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-6 py-3.5 rounded-2xl shadow-xl border font-bold text-sm transition-all animate-bounce ${
          notification.type === "success" 
            ? "bg-emerald-50 text-emerald-800 border-emerald-200" 
            : "bg-rose-50 text-rose-800 border-rose-200"
        }`}>
          <span>{notification.type === "success" ? "🎉" : "⚠️"}</span>
          <span>{notification.message}</span>
        </div>
      )}

      {/* Header & Go Back */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/topics/${topicId}/activities`}
            onClick={() => playSound("click")}
            className="p-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-650 hover:text-slate-800 transition-colors"
            title="Quay lại"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-wide">
              {activityId ? "Sửa bài tập" : "Thêm bài tập mới"}
            </h2>
            <p className="text-slate-500 text-xs font-semibold">
              Chủ đề: {topic ? topic.title : "..."}
            </p>
          </div>
        </div>

        {/* Tab Controls for Desktop Split Screen */}
        <div className="bg-slate-100 p-1 rounded-xl flex gap-1 border border-slate-200">
          <button
            onClick={() => { playSound("click"); setActiveTab("edit"); }}
            className={`px-4 py-2 rounded-lg font-bold text-xs transition-all ${
              activeTab === "edit" ? "bg-white text-slate-800 shadow" : "text-slate-500 hover:text-slate-850"
            }`}
          >
            Cấu hình (Form)
          </button>
          <button
            onClick={() => { playSound("click"); setActiveTab("preview"); }}
            className={`px-4 py-2 rounded-lg font-bold text-xs transition-all flex items-center gap-1.5 ${
              activeTab === "preview" ? "bg-white text-slate-850 shadow" : "text-slate-500 hover:text-slate-850"
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>Xem trước (Preview)</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="animate-pulse bg-white border border-slate-200 rounded-3xl h-[60vh]" />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left panel: Form editor */}
          <div className={`bg-white border border-slate-200 rounded-3xl p-6 shadow-sm ${
            activeTab === "edit" ? "block" : "hidden lg:block"
          }`}>
            <form onSubmit={handleSave} className="space-y-4">
              <h3 className="font-black text-slate-800 text-lg border-b border-slate-100 pb-3 flex items-center gap-2">
                <Settings className="w-5 h-5 text-indigo-650" />
                <span>Chi tiết bài tập</span>
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-650 uppercase tracking-wide">
                    Mã hoạt động (ID)
                  </label>
                  <input
                    type="text"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    disabled={!!activityId}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-bold disabled:opacity-50 focus:outline-none focus:border-indigo-650"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-650 uppercase tracking-wide">
                    Thứ tự bài học (`sort_order`)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={sortOrder}
                    onChange={(e) => setSortOrder(parseInt(e.target.value, 10))}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-850 font-bold focus:outline-none focus:border-indigo-650"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-650 uppercase tracking-wide">
                  Tiêu Đề Bài Tập (Hiển thị cho trẻ)
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Bé hãy gõ lại từ: BA"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-850 font-bold focus:outline-none focus:border-indigo-650"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-650 uppercase tracking-wide">
                  Hướng Dẫn / Yêu Cầu Học Tập
                </label>
                <textarea
                  placeholder="Gợi ý chi tiết cách làm bài cho học sinh..."
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold focus:outline-none focus:border-indigo-650 resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-650 uppercase tracking-wide">
                  Loại Bài Học (Type)
                </label>
                <select
                  value={type}
                  onChange={(e) => { playSound("click"); setType(e.target.value); }}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-850 font-bold focus:outline-none focus:border-indigo-650"
                >
                  <option value="typing">Luyện gõ bàn phím (Typing Practice)</option>
                  <option value="quiz">Câu đố Trắc nghiệm (Quiz)</option>
                  <option value="math">Toán Học (Math Component)</option>
                  <option value="drawing">Tô Màu & Vẽ Tranh (Drawing canvas)</option>
                  <option value="game">Trò Chơi Tương Tác (Mini Games)</option>
                </select>
              </div>

              {/* Type specific config forms */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-4">
                <h4 className="font-extrabold text-sm text-slate-700 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-600 fill-indigo-100" />
                  <span>Cấu hình chi tiết loại bài học</span>
                </h4>

                {/* 1. TYPING */}
                {type === "typing" && (
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-slate-600 uppercase">Nội dung trẻ cần gõ</label>
                      <textarea
                        placeholder="Nhập từ, câu hoặc đoạn văn bản bé cần thực hành gõ..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 font-bold focus:outline-none focus:border-indigo-650 resize-none"
                        required
                      />
                    </div>
                  </div>
                )}

                {/* 2. QUIZ */}
                {type === "quiz" && (
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-slate-600 uppercase">Câu hỏi / Gợi ý</label>
                      <input
                        type="text"
                        placeholder="Ví dụ: Đâu là hình ảnh quả táo?"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 font-bold focus:outline-none"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-slate-600 uppercase">Link ảnh minh họa (URL)</label>
                      <input
                        type="text"
                        placeholder="/assets/quiz/apple.png"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 font-semibold focus:outline-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-600 uppercase block">Các đáp án lựa chọn</label>
                      {options.map((opt, i) => (
                        <div key={i} className="flex gap-2 items-center">
                          <input
                            type="text"
                            placeholder={`Đáp án ${i + 1}`}
                            value={opt}
                            onChange={(e) => handleOptionChange(i, e.target.value)}
                            className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 font-bold focus:outline-none text-sm"
                            required
                          />
                          {options.length > 2 && (
                            <button
                              type="button"
                              onClick={() => removeOption(i)}
                              className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addOption}
                        className="flex items-center gap-1.5 py-1.5 text-indigo-650 hover:text-indigo-800 font-bold text-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Thêm đáp án</span>
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-slate-600 uppercase">Đáp án đúng chính xác</label>
                      <input
                        type="text"
                        placeholder="Nhập chính xác 1 trong các đáp án trên..."
                        value={correctAnswer}
                        onChange={(e) => setCorrectAnswer(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-emerald-700 font-black border-emerald-200 focus:outline-none"
                        required
                      />
                    </div>
                  </div>
                )}

                {/* 3. MATH */}
                {type === "math" && (
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-slate-600 uppercase">Dạng bài Toán</label>
                      <select
                        value={mathSubtype}
                        onChange={(e) => setMathSubtype(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-850 font-bold focus:outline-none"
                      >
                        <option value="vertical">Đặt tính hàng dọc (Vertical column math)</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-500 uppercase">Số thứ 1</label>
                        <input
                          type="number"
                          value={mathOperand1}
                          onChange={(e) => setMathOperand1(parseInt(e.target.value, 10))}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 font-bold text-center"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-500 uppercase">Phép tính</label>
                        <select
                          value={mathOperator}
                          onChange={(e) => setMathOperator(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 font-bold text-center"
                        >
                          <option value="+">+</option>
                          <option value="-">-</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-500 uppercase">Số thứ 2</label>
                        <input
                          type="number"
                          value={mathOperand2}
                          onChange={(e) => setMathOperand2(parseInt(e.target.value, 10))}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 font-bold text-center"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. DRAWING */}
                {type === "drawing" && (
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-slate-600 uppercase">Hình mẫu viền vẽ tranh</label>
                      <select
                        value={drawOutline}
                        onChange={(e) => setDrawOutline(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-850 font-bold focus:outline-none"
                      >
                        <option value="heart">Trái tim (Heart)</option>
                        <option value="star">Ngôi sao (Star)</option>
                        <option value="house">Ngôi nhà (House)</option>
                        <option value="fish">Con cá (Fish)</option>
                        <option value="sun">Ông mặt trời (Sun)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-slate-600 uppercase">Tỷ lệ tô màu mục tiêu để hoàn thành (%)</label>
                      <input
                        type="number"
                        min={10}
                        max={100}
                        value={drawTargetCoverage}
                        onChange={(e) => setDrawTargetCoverage(parseInt(e.target.value, 10))}
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 font-bold focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* 5. GAME */}
                {type === "game" && (
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-slate-650 uppercase">Thể loại Mini Game</label>
                      <select
                        value={gameSubtype}
                        onChange={(e) => setGameSubtype(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-850 font-bold focus:outline-none"
                      >
                        <option value="matching">Kéo thả Nối hình & Chữ (Matching Game)</option>
                        <option value="true_false">Chọn Đúng hoặc Sai (True/False Game)</option>
                        <option value="spinwheel">Vòng quay may mắn (Spin Wheel)</option>
                        <option value="fill_in_the_blank">Điền vần còn khuyết (Fill Blank)</option>
                        <option value="multiple_choice">Luyện gõ Trắc nghiệm (Multiple Choice)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-black text-slate-600 uppercase">Cấu hình dữ liệu game (JSON)</label>
                        <span className="text-[10px] bg-indigo-50 text-indigo-650 px-2 py-0.5 rounded font-black">
                          Discriminated Union Data
                        </span>
                      </div>
                      <textarea
                        placeholder="Cấu hình JSON cho game..."
                        value={gameDataRaw}
                        onChange={(e) => setGameDataRaw(e.target.value)}
                        rows={6}
                        className="w-full px-4 py-2.5 bg-slate-900 border border-slate-850 text-emerald-400 font-mono text-xs rounded-xl focus:outline-none resize-none"
                        required
                      />
                      <p className="text-[10px] text-slate-400 font-medium">
                        Cần đảm bảo định dạng JSON hợp lệ bao gồm danh sách các từ/hình ảnh.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => router.push(`/admin/topics/${topicId}/activities`)}
                  className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-650 rounded-xl border border-slate-250 font-bold text-xs transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md shadow-indigo-600/10 active:translate-y-0.5 transition-all text-xs cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? "Đang lưu..." : activityId ? "Cập nhật" : "Lưu bài tập"}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right panel: Live Preview screen */}
          <div className={`space-y-4 ${activeTab === "preview" ? "block" : "hidden lg:block"}`}>
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="font-black text-slate-800 text-lg border-b border-slate-100 pb-3 flex items-center gap-2">
                <Eye className="w-5 h-5 text-emerald-600" />
                <span>Xem trước Giao diện (Live Preview)</span>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded font-black uppercase">
                  Real-time Play-test
                </span>
              </h3>

              {/* Display warning if JSON validation fails for game */}
              {type === "game" && (() => {
                try {
                  JSON.parse(gameDataRaw);
                  return null;
                } catch (e) {
                  return (
                    <div className="text-xs font-bold text-rose-500 bg-rose-50 border border-rose-100 px-4 py-3 rounded-xl flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                      <span>Cảnh báo: Dữ liệu JSON bị lỗi cú pháp. Không thể hiển thị Preview!</span>
                    </div>
                  );
                }
              })()}

              {/* The Live Sandbox Screen Container */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 overflow-hidden relative min-h-[350px] flex items-center justify-center">
                <div className="w-full max-w-full overflow-hidden">
                  {renderLivePreview()}
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-250 rounded-xl text-amber-800 text-[10px] font-bold">
                💡 **Mẹo sư phạm:** Màn hình này render trực tiếp các component UX của trẻ em 6 tuổi. Bạn có thể tương tác, click trả lời thử để kiểm tra xem bài tập hiển thị và phát ra âm thanh như thế nào trước khi lưu!
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
