"use client";

import React, { useState, useEffect } from "react";
import { Cloud, CloudOff, RefreshCw, AlertTriangle, CheckCircle } from "lucide-react";
import { useStudent } from "@/contexts/StudentContext";
import { useSound } from "@/contexts/SoundContext";

export default function SyncStatusIndicator() {
  const { playSound } = useSound();
  const { isSyncing, syncError, lastSyncedAt, queueLength, syncQueueLocally } = useStudent();
  const [isOnline, setIsOnline] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);

  // Theo dõi trạng thái mạng của trình duyệt
  useEffect(() => {
    if (typeof window === "undefined") return;
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Xử lý khi nhấn vào đám mây để buộc đồng bộ thủ công
  const handleSyncClick = () => {
    if (!isOnline) {
      playSound("incorrect");
      return;
    }
    playSound("click");
    syncQueueLocally();
  };

  // Xác định trạng thái, màu sắc và nội dung hiển thị
  let statusColor = "text-emerald-500 bg-emerald-50 border-emerald-300";
  let statusIcon = <Cloud className="w-5 h-5 text-emerald-500 fill-emerald-100" />;
  let tooltipText = "Đồng bộ thành công! Tiến trình của bé đã được lưu trữ an toàn.";
  let badgeCount = null;

  if (!isOnline) {
    statusColor = "text-amber-500 bg-amber-50 border-amber-300";
    statusIcon = <CloudOff className="w-5 h-5 text-amber-500" />;
    tooltipText = "Đang ngoại tuyến. Tiến trình học sẽ lưu tạm trên máy và đồng bộ lại khi có mạng.";
    if (queueLength > 0) {
      badgeCount = queueLength;
    }
  } else if (isSyncing) {
    statusColor = "text-indigo-500 bg-indigo-50 border-indigo-300";
    statusIcon = <RefreshCw className="w-5 h-5 text-indigo-500 animate-spin" />;
    tooltipText = "Đang lưu giữ tiến trình học của bé lên đám mây...";
  } else if (syncError) {
    statusColor = "text-rose-500 bg-rose-50 border-rose-300";
    statusIcon = <AlertTriangle className="w-5 h-5 text-rose-500" />;
    tooltipText = `Lỗi lưu trữ: ${syncError}. Nhấp để thử lại.`;
    if (queueLength > 0) {
      badgeCount = queueLength;
    }
  } else if (queueLength > 0) {
    statusColor = "text-indigo-500 bg-indigo-50 border-indigo-300";
    statusIcon = <Cloud className="w-5 h-5 text-indigo-500 fill-indigo-100 animate-pulse" />;
    tooltipText = `Có ${queueLength} bài học chưa đồng bộ. Nhấp để lưu lên máy chủ.`;
    badgeCount = queueLength;
  }

  return (
    <div 
      className="relative select-none"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Nút mây đồng bộ thiết kế Brutalist đáng yêu */}
      <button
        onClick={handleSyncClick}
        disabled={isSyncing}
        className={`flex items-center gap-1.5 px-3 py-1.5 border-2 border-slate-800 rounded-2xl shadow-[2.5px_2.5px_0px_0px_#1e293b] active:translate-y-[1px] active:shadow-[1.5px_1.5px_0px_0px_#1e293b] transition-all cursor-pointer ${statusColor}`}
      >
        {statusIcon}
        
        {badgeCount !== null && (
          <span className="bg-rose-500 text-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center -mr-1 shadow-sm border border-white animate-bounce">
            {badgeCount}
          </span>
        )}

        <span className="hidden sm:inline text-[10px] font-black uppercase tracking-wider">
          {!isOnline ? "Ngoại tuyến" : isSyncing ? "Đang lưu" : syncError ? "Lỗi lưu" : "Đã lưu"}
        </span>
      </button>

      {/* Tooltip giải thích trực quan, sinh động */}
      {showTooltip && (
        <div className="absolute right-0 top-full mt-2 z-50 bg-slate-800 text-white px-3 py-2 rounded-xl shadow-lg text-xs font-semibold w-52 leading-relaxed text-center pointer-events-none transition-all">
          <div className="absolute bottom-full right-6 border-6 border-transparent border-b-slate-800" />
          <p>{tooltipText}</p>
          {lastSyncedAt && !isSyncing && (
            <p className="text-[9px] text-slate-400 mt-1">
              Đồng bộ lúc: {new Date(lastSyncedAt).toLocaleTimeString("vi-VN")}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
