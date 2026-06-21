import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

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

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ studentId: string }> }
) {
  const { studentId } = await props.params;

  // Kiểm tra định dạng UUID hợp lệ
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(studentId)) {
    return NextResponse.json({ error: "ID học sinh không hợp lệ hoặc yêu cầu đăng nhập" }, { status: 400 });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : undefined;
    const supabase = createSupabaseClient(token);

    // 1. Tải hồ sơ học sinh
    const { data: profile, error: profileError } = await supabase
      .from("student_profiles")
      .select("*")
      .eq("id", studentId)
      .single();

    if (profileError) {
      if (profileError.code === "PGRST116") {
        // Trả về 200 với thông tin profile trống để tránh trình duyệt báo đỏ lỗi 404 cho học sinh mới
        return NextResponse.json({
          profile: null,
          profileExists: false,
          xp: 0,
          streak: 0,
          avgWpm: 0,
          avgAccuracy: 0,
          totalLessons: 0,
          completedLessons: [],
          badges: [],
          progressMap: {},
        });
      }
      return NextResponse.json({ error: "Lỗi tải hồ sơ: " + profileError.message }, { status: 500 });
    }

    // 2. Tải tiến trình bài học đã làm
    const { data: progressData, error: progressError } = await supabase
      .from("student_progress")
      .select("activity_id, score, completed_at")
      .eq("student_id", studentId);

    if (progressError) {
      return NextResponse.json({ error: "Lỗi tải tiến trình học tập: " + progressError.message }, { status: 500 });
    }

    // 3. Tải danh sách huy hiệu
    const { data: badgesData, error: badgesError } = await supabase
      .from("student_badges")
      .select("badge_id")
      .eq("student_id", studentId);

    if (badgesError) {
      return NextResponse.json({ error: "Lỗi tải danh sách huy hiệu: " + badgesError.message }, { status: 500 });
    }

    const completedLessons = progressData ? progressData.map((p) => p.activity_id) : [];
    const badges = badgesData ? badgesData.map((b) => b.badge_id) : [];

    // Tạo bản đồ tiến trình học tập (progressMap) để dễ hợp nhất dưới client
    const progressMap: Record<string, { score: number; timestamp: number }> = {};
    if (progressData) {
      progressData.forEach((p) => {
        progressMap[p.activity_id] = {
          score: p.score,
          timestamp: new Date(p.completed_at).getTime(),
        };
      });
    }

    return NextResponse.json({
      profile: {
        name: profile.name,
        nickname: profile.nickname,
        grade: profile.grade,
        avatar: profile.avatar,
        theme: profile.theme,
      },
      xp: profile.xp || 0,
      streak: profile.streak || 0,
      avgWpm: profile.avg_wpm || 0,
      avgAccuracy: profile.avg_accuracy || 0,
      totalLessons: profile.total_lessons || 0,
      completedLessons,
      badges,
      progressMap,
    });
  } catch (err: any) {
    console.error("Lỗi khi tải tiến trình học tập của học sinh:", err);
    return NextResponse.json({ error: "Lỗi hệ thống: " + err.message }, { status: 500 });
  }
}
