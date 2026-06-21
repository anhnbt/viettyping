import rawData from './writingData.json';

export interface Point {
  x: number;
  y: number;
}

export interface WritingStroke {
  id: string;
  name: string;
  // SVG Path đại diện cho hình dáng đầy đặn (nét chữ có độ dày)
  path: string;
  // Đường xương (skeleton) là mảng tọa độ [x, y] để làm chỉ dẫn và so khớp hướng viết
  medians: Point[];
}

export interface AlphabetWritingData {
  id: string;
  letter: string;
  uppercase: string;
  word: string;
  emoji: string;
  strokes: WritingStroke[];
}

// 29 chữ cái tiếng Việt cùng hình ảnh và bộ nét vẽ chuẩn Bộ Giáo Dục được đọc từ file JSON tối ưu hóa
export const WRITING_ALPHABET_DATA = rawData as AlphabetWritingData[];
