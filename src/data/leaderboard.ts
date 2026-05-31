export interface LeaderboardUser {
  id: string;
  nickname: string;
  avatar: string;
  xp: number;
  streak: number;
  rank?: number;
}

export const weeklyLeaderboard: LeaderboardUser[] = [
  { id: 'wl-1', nickname: 'Khủng Long Con 🦖', avatar: '🦖', xp: 1250, streak: 8 },
  { id: 'wl-2', nickname: 'Gấu Trúc Nhỏ 🐼', avatar: '🐼', xp: 1100, streak: 6 },
  { id: 'wl-3', nickname: 'Mèo Máy Dora 🐱', avatar: '🐱', xp: 950, streak: 5 },
  { id: 'wl-4', nickname: 'Cáo Thông Thái 🦊', avatar: '🦊', xp: 820, streak: 4 },
  { id: 'wl-5', nickname: 'Chú Ong Chăm Chỉ 🐝', avatar: '🐝', xp: 750, streak: 12 },
  { id: 'wl-6', nickname: 'Sóc Siêu Quậy 🐿️', avatar: '🐿️', xp: 680, streak: 3 },
  { id: 'wl-7', nickname: 'Thỏ Bảy Màu 🐰', avatar: '🐰', xp: 600, streak: 5 },
  { id: 'wl-8', nickname: 'Sư Tử Nhí 🦁', avatar: '🦁', xp: 520, streak: 2 },
  { id: 'wl-9', nickname: 'Cánh Cụt Pingu 🐧', avatar: '🐧', xp: 450, streak: 4 },
  { id: 'wl-10', nickname: 'Heo Hồng Peppa 🐷', avatar: '🐷', xp: 400, streak: 7 },
  { id: 'wl-11', nickname: 'Khỉ Năng Động 🐵', avatar: '🐵', xp: 320, streak: 1 },
  { id: 'wl-12', nickname: 'Sâu Nhỏ 🐛', avatar: '🐛', xp: 250, streak: 3 }
];

export const allTimeLeaderboard: LeaderboardUser[] = [
  { id: 'at-1', nickname: 'Chú Ong Chăm Chỉ 🐝', avatar: '🐝', xp: 15400, streak: 45 },
  { id: 'at-2', nickname: 'Cáo Thông Thái 🦊', avatar: '🦊', xp: 12800, streak: 32 },
  { id: 'at-3', nickname: 'Khủng Long Con 🦖', avatar: '🦖', xp: 9800, streak: 15 },
  { id: 'at-4', nickname: 'Gấu Trúc Nhỏ 🐼', avatar: '🐼', xp: 8500, streak: 12 },
  { id: 'at-5', nickname: 'Mèo Máy Dora 🐱', avatar: '🐱', xp: 7600, streak: 8 },
  { id: 'at-6', nickname: 'Thỏ Bảy Màu 🐰', avatar: '🐰', xp: 6200, streak: 10 },
  { id: 'at-7', nickname: 'Sóc Siêu Quậy 🐿️', avatar: '🐿️', xp: 5400, streak: 5 },
  { id: 'at-8', nickname: 'Cánh Cụt Pingu 🐧', avatar: '🐧', xp: 4100, streak: 6 },
  { id: 'at-9', nickname: 'Voi Con Ngốc Nghếch 🐘', avatar: '🐘', xp: 3900, streak: 3 },
  { id: 'at-10', nickname: 'Heo Hồng Peppa 🐷', avatar: '🐷', xp: 3500, streak: 9 },
  { id: 'at-11', nickname: 'Sư Tử Nhí 🦁', avatar: '🦁', xp: 3200, streak: 4 },
  { id: 'at-12', nickname: 'Khỉ Năng Động 🐵', avatar: '🐵', xp: 2800, streak: 2 }
];
