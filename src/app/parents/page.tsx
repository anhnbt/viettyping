'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useProgress } from '@/hooks/useProgress';
import { subjects } from '@/data/subjects';
import { IoArrowBack, IoStatsChart, IoTime, IoWarning, IoCheckmarkCircle } from 'react-icons/io5';

export default function ParentsPage() {
  const { progress, isLoaded } = useProgress();

  const stats = useMemo(() => {
    if (!isLoaded) return null;

    let totalActivities = 0;
    let completedActivities = 0;
    let totalScore = 0;

    const subjectStats = subjects.map(subject => {
      let subjectTotalActivities = 0;
      let subjectCompletedActivities = 0;
      let subjectScore = 0;

      subject.topics.forEach(topic => {
        topic.activities.forEach(activity => {
          subjectTotalActivities++;
          const activityProgress = progress[activity.id];
          if (activityProgress) {
            subjectCompletedActivities++;
            subjectScore += activityProgress.score;
          }
        });
      });

      totalActivities += subjectTotalActivities;
      completedActivities += subjectCompletedActivities;
      totalScore += subjectScore;

      return {
        ...subject,
        progress: subjectTotalActivities === 0 ? 0 : Math.round((subjectCompletedActivities / subjectTotalActivities) * 100),
        averageScore: subjectCompletedActivities === 0 ? 0 : Math.round(subjectScore / subjectCompletedActivities),
        completedCount: subjectCompletedActivities,
        totalCount: subjectTotalActivities
      };
    });

    const overallProgress = totalActivities === 0 ? 0 : Math.round((completedActivities / totalActivities) * 100);
    const averageScore = completedActivities === 0 ? 0 : Math.round(totalScore / completedActivities);

    // Get recent activities
    const recentActivities = Object.entries(progress)
      .map(([id, data]) => {
        // Find activity info
        let activityInfo: { title: string; subjectName: string } | null = null;
        for (const s of subjects) {
          for (const t of s.topics) {
            const act = t.activities.find(a => a.id === id);
            if (act) {
              activityInfo = { title: act.title, subjectName: s.name };
              break;
            }
          }
          if (activityInfo) break;
        }
        return {
          id,
          ...data,
          ...activityInfo
        };
      })
      .filter(item => item.title) // Filter out unknown activities
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 5);

    return {
      overallProgress,
      averageScore,
      subjectStats,
      recentActivities
    };
  }, [progress, isLoaded]);

  if (!isLoaded) {
    return <div className="p-8 text-center">Đang tải dữ liệu...</div>;
  }

  if (!stats) return null;

  return (
    <main className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            <IoArrowBack className="text-xl" />
            <span>Quay lại</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">Báo cáo học tập</h1>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-4 mb-2">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
                <IoCheckmarkCircle className="text-2xl" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Tiến độ tổng thể</div>
                <div className="text-2xl font-bold text-gray-800">{stats.overallProgress}%</div>
              </div>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 mt-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${stats.overallProgress}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 text-green-600 rounded-full">
                <IoStatsChart className="text-2xl" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Điểm trung bình</div>
                <div className="text-2xl font-bold text-gray-800">{stats.averageScore}/100</div>
              </div>
            </div>
             <p className="text-xs text-gray-400 mt-3">Trên các bài tập đã hoàn thành</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
             <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 text-purple-600 rounded-full">
                <IoTime className="text-2xl" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Hoạt động gần nhất</div>
                <div className="text-lg font-bold text-gray-800">
                    {stats.recentActivities.length > 0
                        ? new Date(stats.recentActivities[0].timestamp).toLocaleDateString('vi-VN')
                        : 'Chưa có'}
                </div>
              </div>
            </div>
             <p className="text-xs text-gray-400 mt-3">
                {stats.recentActivities.length > 0 ? stats.recentActivities[0].title : ''}
             </p>
          </div>
        </div>

        {/* Subject Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Tiến độ theo môn học</h2>
            <div className="space-y-6">
              {stats.subjectStats.map(subject => (
                <div key={subject.id}>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                        <span className="text-xl">{subject.icon}</span>
                        <span className="font-medium text-gray-700">{subject.name}</span>
                    </div>
                    <span className="text-sm font-bold text-gray-600">{subject.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full bg-gradient-to-r ${subject.color}`}
                      style={{ width: `${subject.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity Log */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Hoạt động gần đây</h2>
            {stats.recentActivities.length > 0 ? (
                <div className="space-y-4">
                {stats.recentActivities.map((activity, idx) => (
                    <div key={activity.id + idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                            <div className="font-medium text-gray-800">{activity.title}</div>
                            <div className="text-xs text-gray-500">{activity.subjectName}</div>
                        </div>
                        <div className="text-right">
                            <div className={`font-bold ${activity.score >= 80 ? 'text-green-600' : activity.score >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                                {activity.score} điểm
                            </div>
                            <div className="text-xs text-gray-400">
                                {new Date(activity.timestamp).toLocaleDateString('vi-VN')}
                            </div>
                        </div>
                    </div>
                ))}
                </div>
            ) : (
                <div className="text-center py-10 text-gray-400 flex flex-col items-center">
                    <IoWarning className="text-4xl mb-2 opacity-50" />
                    <p>Chưa có hoạt động nào được ghi nhận</p>
                </div>
            )}
          </div>
        </div>

        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 text-center">
            <h3 className="font-bold text-blue-800 mb-2">Góc Phụ Huynh</h3>
            <p className="text-blue-600">
                Đây là nơi ba mẹ có thể theo dõi quá trình học tập của bé.
                Hãy khuyến khích bé học đều các môn để phát triển toàn diện nhé!
            </p>
        </div>
      </div>
    </main>
  );
}
