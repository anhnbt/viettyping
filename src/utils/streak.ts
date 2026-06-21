/**
 * Lấy chuỗi ngày YYYY-MM-DD theo múi giờ địa phương cụ thể
 */
export const getDateStringInTimezone = (timestamp: number, timezone: string): string => {
  try {
    const formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    return formatter.format(new Date(timestamp)); // Trả về dạng YYYY-MM-DD
  } catch (e) {
    // Fallback sang định dạng UTC
    const date = new Date(timestamp);
    return date.toISOString().split("T")[0];
  }
};

/**
 * Trả về đối tượng Date ở mốc nửa đêm (midnight) UTC cho ngày theo múi giờ cụ thể
 */
export const getDateMidnightInTimezone = (timestamp: number, timezone: string): Date => {
  const dateStr = getDateStringInTimezone(timestamp, timezone);
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
};

/**
 * Tính số ngày chênh lệch giữa 2 Date ở dạng mốc nửa đêm UTC
 */
export const getDaysDiff = (date1: Date, date2: Date): number => {
  const diffTime = date2.getTime() - date1.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Tính toán Streak và ngày hoạt động mới dựa vào ngày hoạt động cuối cùng và thời gian hiện tại
 */
export const calculateStreak = (
  currentStreak: number,
  lastActiveDateStr: string | null | undefined,
  currentTimestamp: number,
  timezone: string
): { newStreak: number; newActiveDateStr: string } => {
  const currentDateStr = getDateStringInTimezone(currentTimestamp, timezone);

  if (!lastActiveDateStr) {
    // Lần đầu tiên hoạt động
    return { newStreak: 1, newActiveDateStr: currentDateStr };
  }

  try {
    const [ly, lm, ld] = lastActiveDateStr.split("-").map(Number);
    const lastActiveMidnight = new Date(Date.UTC(ly, lm - 1, ld));
    const currentMidnight = getDateMidnightInTimezone(currentTimestamp, timezone);

    const daysDiff = getDaysDiff(lastActiveMidnight, currentMidnight);

    if (daysDiff === 0) {
      // Bé đã học ngày hôm nay rồi, giữ nguyên streak
      return { newStreak: currentStreak || 1, newActiveDateStr: lastActiveDateStr };
    } else if (daysDiff === 1) {
      // Học ngày tiếp theo, tăng streak thêm 1
      return { newStreak: (currentStreak || 0) + 1, newActiveDateStr: currentDateStr };
    } else {
      // Bị ngắt chuỗi học tập (daysDiff >= 2 hoặc âm), reset về 1
      return { newStreak: 1, newActiveDateStr: currentDateStr };
    }
  } catch (err) {
    console.error("Lỗi tính toán streak, reset về 1:", err);
    return { newStreak: 1, newActiveDateStr: currentDateStr };
  }
};
export default calculateStreak;
