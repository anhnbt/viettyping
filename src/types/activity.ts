import { Activity } from "@/types/subject";

export interface ActivityTelemetry {
  score: number;
  duration: number; // Thời gian hoàn thành (giây)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rawPayload?: Record<string, any>; // Lưu chi tiết: danh sách câu sai, nét vẽ (JSON), log gõ phím...
}

export interface ActivityAdapterProps {
  activity: Activity;
  onComplete: (telemetry: ActivityTelemetry) => void;
  onProgressUpdate?: (currentProgress: number) => void; // Dành cho Coordinator cập nhật Progress bar
}
