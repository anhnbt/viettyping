export interface SyncItem {
  id: string;
  studentId: string;
  lessonId: string;
  score: number;
  wpm: number;
  accuracy: number;
  timestamp: number;
  timezone: string;
}

export interface SyncResponse {
  xp: number;
  streak: number;
  avgWpm: number;
  avgAccuracy: number;
  badges: string[];
  level: number;
}

const QUEUE_KEY = "viettyping_sync_queue";

/**
 * Lấy danh sách các gói tin đang chờ đồng bộ từ localStorage
 */
export const getSyncQueue = (): SyncItem[] => {
  if (typeof window === "undefined") return [];
  try {
    const queue = localStorage.getItem(QUEUE_KEY);
    return queue ? JSON.parse(queue) : [];
  } catch (e) {
    console.error("Lỗi khi đọc hàng đợi đồng bộ:", e);
    return [];
  }
};

/**
 * Lưu danh sách hàng đợi đồng bộ vào localStorage
 */
export const saveSyncQueue = (queue: SyncItem[]): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  } catch (e) {
    console.error("Lỗi khi lưu hàng đợi đồng bộ:", e);
  }
};

/**
 * Thêm một gói tin tiến trình mới vào hàng đợi đồng bộ
 */
export const addToSyncQueue = (
  studentId: string,
  lessonId: string,
  score: number,
  wpm: number,
  accuracy: number
): SyncItem => {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Ho_Chi_Minh";
  const syncItem: SyncItem = {
    id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15),
    studentId,
    lessonId,
    score,
    wpm,
    accuracy,
    timestamp: Date.now(),
    timezone,
  };

  const queue = getSyncQueue();
  queue.push(syncItem);
  saveSyncQueue(queue);

  return syncItem;
};

/**
 * Xóa các gói tin đã đồng bộ thành công khỏi hàng đợi
 */
export const removeFromSyncQueue = (ids: string[]): void => {
  const queue = getSyncQueue();
  const filtered = queue.filter((item) => !ids.includes(item.id));
  saveSyncQueue(filtered);
};

/**
 * Xóa sạch hàng đợi đồng bộ
 */
export const clearSyncQueue = (): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(QUEUE_KEY);
  } catch (e) {
    console.error("Lỗi khi xóa hàng đợi đồng bộ:", e);
  }
};
