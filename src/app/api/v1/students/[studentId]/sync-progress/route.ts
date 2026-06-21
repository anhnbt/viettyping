import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { calculateStreak } from "@/utils/streak";

// Định nghĩa kiểu dữ liệu đồng bộ gửi lên từ client
interface SyncItem {
  id: string;
  studentId: string;
  lessonId: string;
  score: number;
  wpm: number;
  accuracy: number;
  timestamp: number;
  timezone: string;
}

// Khởi tạo Supabase client sử dụng token JWT từ client (nếu có)
const createSupabaseClient = (token?: string) => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "",
    token
      ? {
          global: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        }
      : undefined
  );
};

export async function POST(
  req: NextRequest,
  props: { params: Promise<{ studentId: string }> }
) {
  const { studentId } = await props.params;

  // Kiểm tra định dạng UUID hợp lệ
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(studentId)) {
    return NextResponse.json({ error: "ID học sinh không hợp lệ hoặc yêu cầu đăng nhập để đồng bộ" }, { status: 400 });
  }

  try {
    // 1. Trích xuất Authorization Token từ headers
    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : undefined;
    const supabase = createSupabaseClient(token);

    // 2. Parse body chứa danh sách SyncItem
    const items: SyncItem[] = await req.json();
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ message: "Hàng đợi trống hoặc không hợp lệ" }, { status: 200 });
    }

    // 3. Tra cứu profile học sinh hiện tại
    let { data: profile, error: profileError } = await supabase
      .from("student_profiles")
      .select("*")
      .eq("id", studentId)
      .single();

    if (profileError && profileError.code === "PGRST116") {
      // Nếu chưa có profile trong DB, tạo mới một profile mặc định
      const { data: newProfile, error: insertError } = await supabase
        .from("student_profiles")
        .insert({
          id: studentId,
          name: "Học Sinh Mới",
          nickname: "Dũng Sĩ",
          grade: "Lớp 1",
          avatar: "🦁",
          theme: "dino",
          xp: 0,
          streak: 0,
          avg_wpm: 0,
          avg_accuracy: 0,
          total_lessons: 0,
          last_active_date: null,
        })
        .select()
        .single();

      if (insertError) {
        return NextResponse.json({ error: "Không thể tạo hồ sơ học sinh: " + insertError.message }, { status: 500 });
      }
      profile = newProfile;
    } else if (profileError) {
      return NextResponse.json({ error: "Lỗi tải hồ sơ học sinh: " + profileError.message }, { status: 500 });
    }

    // 4. Sắp xếp các gói tin theo thời gian tăng dần (chronological order) để tính Streak chính xác
    const sortedItems = [...items].sort((a, b) => a.timestamp - b.timestamp);

    let currentXp = profile.xp || 0;
    let currentStreak = profile.streak || 0;
    let lastActiveDate = profile.last_active_date || null;
    let avgWpm = profile.avg_wpm || 0;
    let avgAccuracy = profile.avg_accuracy || 0;
    let totalLessons = profile.total_lessons || 0;

    const badgesToUnlock = new Set<string>();

    // 5. Xử lý từng gói tin đồng bộ
    for (const item of sortedItems) {
      const { lessonId, score, wpm, accuracy, timestamp, timezone } = item;

      // a. Lưu tiến trình vào bảng student_progress
      const completedAtStr = new Date(timestamp).toISOString();
      const { error: progressError } = await supabase
        .from("student_progress")
        .upsert(
          {
            student_id: studentId,
            activity_id: lessonId,
            score,
            completed_at: completedAtStr,
          },
          {
            onConflict: "student_id,activity_id",
          }
        );

      if (progressError) {
        console.error(`Lỗi khi lưu tiến trình bài học ${lessonId}:`, progressError);
        continue;
      }

      // b. Tính điểm XP thưởng dựa trên loại bài học và điểm số
      // Trò chơi Rùa con được 300 XP, các bài học thông thường được 150 XP (nếu >= 90) hoặc 100 XP
      const earnedXP = lessonId === "turtle_rescue" ? 300 : score >= 90 ? 150 : 100;
      currentXp += earnedXP;

      // c. Tích lũy số lượng bài học và cập nhật trung bình lũy tiến
      totalLessons += 1;
      if (wpm > 0) {
        avgWpm = Math.round((avgWpm * (totalLessons - 1) + wpm) / totalLessons);
      }
      avgAccuracy = Math.round((avgAccuracy * (totalLessons - 1) + accuracy) / totalLessons);

      // d. Kiểm tra điều kiện mở khóa Huy hiệu (Badges)
      if (score === 100) badgesToUnlock.add("accuracy_100");
      if (wpm >= 10) badgesToUnlock.add("speed_10");
      if (wpm >= 20) badgesToUnlock.add("speed_20");
      if (wpm >= 30) badgesToUnlock.add("speed_30");
      if (wpm >= 40) badgesToUnlock.add("speed_40");
      if (wpm >= 50) badgesToUnlock.add("speed_50");
      if (lessonId === "turtle_rescue") badgesToUnlock.add("turtle_rescue");

      // e. Tính toán Daily Streak phía máy chủ theo múi giờ địa phương của trẻ
      const streakResult = calculateStreak(currentStreak, lastActiveDate, timestamp, timezone);
      currentStreak = streakResult.newStreak;
      lastActiveDate = streakResult.newActiveDateStr;
    }

    // 6. Ghi nhận các huy hiệu mới mở khóa vào bảng student_badges
    if (badgesToUnlock.size > 0) {
      const badgeInserts = Array.from(badgesToUnlock).map((badgeId) => ({
        student_id: studentId,
        badge_id: badgeId,
        unlocked_at: new Date().toISOString(),
      }));

      await supabase.from("student_badges").upsert(badgeInserts, {
        onConflict: "student_id,badge_id",
      });
    }

    // 7. Cập nhật hồ sơ học sinh với các chỉ số tích lũy mới nhất
    const { error: updateError } = await supabase
      .from("student_profiles")
      .update({
        xp: currentXp,
        streak: currentStreak,
        avg_wpm: avgWpm,
        avg_accuracy: avgAccuracy,
        total_lessons: totalLessons,
        last_active_date: lastActiveDate,
        updated_at: new Date().toISOString(),
      })
      .eq("id", studentId);

    if (updateError) {
      return NextResponse.json({ error: "Lỗi cập nhật hồ sơ học sinh: " + updateError.message }, { status: 500 });
    }

    // 8. Lấy toàn bộ danh sách huy hiệu đã mở khóa của học sinh
    const { data: dbBadges } = await supabase
      .from("student_badges")
      .select("badge_id")
      .eq("student_id", studentId);

    const badges = dbBadges ? dbBadges.map((b) => b.badge_id) : [];

    // 9. Trả về kết quả đồng bộ thành công cho client
    return NextResponse.json({
      xp: currentXp,
      streak: currentStreak,
      avgWpm: avgWpm,
      avgAccuracy: avgAccuracy,
      level: Math.floor(currentXp / 1000) + 1,
      badges,
    });
  } catch (err: any) {
    console.error("Lỗi đồng bộ hóa tiến trình:", err);
    return NextResponse.json({ error: "Lỗi hệ thống: " + err.message }, { status: 500 });
  }
}
