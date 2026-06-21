import { calculateStreak, getDateStringInTimezone } from "../streak";

describe("calculateStreak", () => {
  const timezoneVn = "Asia/Ho_Chi_Minh";
  const timezoneNy = "America/New_York";

  test("lần đầu tiên hoàn thành bài học (chưa có streak cũ), trả về streak = 1", () => {
    // 19/06/2026 10:00:00 UTC (17:00:00 VN)
    const timestamp = Date.UTC(2026, 5, 19, 10, 0, 0); 
    const result = calculateStreak(0, null, timestamp, timezoneVn);

    expect(result.newStreak).toBe(1);
    expect(result.newActiveDateStr).toBe("2026-06-19");
  });

  test("học sinh hoàn thành thêm bài học trong cùng một ngày, giữ nguyên streak", () => {
    // 19/06/2026 10:00:00 UTC (17:00:00 VN)
    const firstTimestamp = Date.UTC(2026, 5, 19, 10, 0, 0);
    // 19/06/2026 15:00:00 UTC (22:00:00 VN) - cùng ngày VN
    const secondTimestamp = Date.UTC(2026, 5, 19, 15, 0, 0);

    const result = calculateStreak(1, "2026-06-19", secondTimestamp, timezoneVn);

    expect(result.newStreak).toBe(1);
    expect(result.newActiveDateStr).toBe("2026-06-19");
  });

  test("học sinh gõ phím vào ngày tiếp theo, streak tăng lên 1", () => {
    // 19/06/2026 10:00:00 UTC (17:00:00 VN)
    // 20/06/2026 09:00:00 UTC (16:00:00 VN) - cách 1 ngày VN
    const nextDayTimestamp = Date.UTC(2026, 5, 20, 9, 0, 0);

    const result = calculateStreak(1, "2026-06-19", nextDayTimestamp, timezoneVn);

    expect(result.newStreak).toBe(2);
    expect(result.newActiveDateStr).toBe("2026-06-20");
  });

  test("học sinh nghỉ học 2 ngày trở lên, reset streak về 1", () => {
    // Lần hoạt động cuối là 19/06/2026
    // Hoạt động mới lúc 22/06/2026 10:00:00 UTC (17:00:00 VN) - cách 3 ngày
    const gapTimestamp = Date.UTC(2026, 5, 22, 10, 0, 0);

    const result = calculateStreak(5, "2026-06-19", gapTimestamp, timezoneVn);

    expect(result.newStreak).toBe(1);
    expect(result.newActiveDateStr).toBe("2026-06-22");
  });

  test("kiểm tra streak hoạt động chính xác qua ranh giới múi giờ khác nhau", () => {
    // 19/06/2026 23:30:00 (múi giờ VN) tương đương 19/06/2026 16:30:00 UTC
    const eveningTimestamp = Date.UTC(2026, 5, 19, 16, 30, 0);
    expect(getDateStringInTimezone(eveningTimestamp, timezoneVn)).toBe("2026-06-19");

    // 20/06/2026 00:30:00 (múi giờ VN) tương đương 19/06/2026 17:30:00 UTC - chỉ cách 1 giờ thực tế nhưng đã sang ngày tiếp theo ở VN
    const midnightTimestamp = Date.UTC(2026, 5, 19, 17, 30, 0);
    expect(getDateStringInTimezone(midnightTimestamp, timezoneVn)).toBe("2026-06-20");

    // Dưới góc nhìn múi giờ VN, hai mốc này cách nhau đúng 1 ngày
    const resultVn = calculateStreak(3, "2026-06-19", midnightTimestamp, timezoneVn);
    expect(resultVn.newStreak).toBe(4);
    expect(resultVn.newActiveDateStr).toBe("2026-06-20");

    // Nhưng dưới góc nhìn New York (UTC-4), cả hai mốc này đều ở ngày 19/06 (12:30 trưa và 13:30 chiều)
    expect(getDateStringInTimezone(eveningTimestamp, timezoneNy)).toBe("2026-06-19");
    expect(getDateStringInTimezone(midnightTimestamp, timezoneNy)).toBe("2026-06-19");
    
    const resultNy = calculateStreak(3, "2026-06-19", midnightTimestamp, timezoneNy);
    expect(resultNy.newStreak).toBe(3); // Giữ nguyên streak vì vẫn là ngày 19/06
    expect(resultNy.newActiveDateStr).toBe("2026-06-19");
  });
});
