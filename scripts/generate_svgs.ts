import * as fs from 'fs';
import * as path from 'path';
import rawData from '../src/app/writing/writingData.json';

const WRITING_ALPHABET_DATA = rawData;

const OUTPUT_DIR = path.join(__dirname, '../public/debug/writing');

// Tạo thư mục đầu ra nếu chưa có
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Bảng màu cho các nét viết khác nhau
const strokeColors = [
  '#ef4444', // Đỏ (Nét 1)
  '#3b82f6', // Xanh dương (Nét 2)
  '#10b981', // Xanh lá (Nét 3)
  '#f59e0b', // Cam/Vàng (Nét 4)
  '#8b5cf6', // Tím (Nét 5)
];

// Hàm tạo nội dung SVG cho mỗi chữ cái
function generateSVG(charData: typeof WRITING_ALPHABET_DATA[0]): string {
  const width = 500;
  const height = 500;

  let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" style="background: #ffffff; border: 2px solid #cbd5e1; border-radius: 8px; font-family: system-ui, -apple-system, sans-serif;">
  <!-- Định nghĩa lưới nền học sinh tiểu học (Grid) -->
  <defs>
    <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
      <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#f1f5f9" stroke-width="1" />
      <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#e2e8f0" stroke-width="1.5" />
    </pattern>
  </defs>
  
  <!-- Lưới ô ly nền -->
  <rect width="100%" height="100%" fill="url(#grid)" />
  
  <!-- Tiêu đề debug chữ cái -->
  <text x="20" y="35" font-size="20" font-weight="bold" fill="#1e293b">Chữ: ${charData.letter.toUpperCase()} (${charData.letter})</text>
  <text x="20" y="55" font-size="12" fill="#64748b">Từ ví dụ: ${charData.word} ${charData.emoji}</text>
  
  <!-- Trục hướng dẫn chuẩn (Chính giữa) -->
  <line x1="250" y1="0" x2="250" y2="500" stroke="#cbd5e1" stroke-dasharray="4 4" stroke-width="1" />
  <line x1="0" y1="250" x2="500" y2="250" stroke="#cbd5e1" stroke-dasharray="4 4" stroke-width="1" />
`;

  // Vẽ các nét chữ
  charData.strokes.forEach((stroke, strokeIdx) => {
    const strokeColor = strokeColors[strokeIdx % strokeColors.length];
    
    svgContent += `
  <!-- ==================== Nét ${strokeIdx + 1}: ${stroke.name} (${stroke.id}) ==================== -->
  <g id="stroke_${stroke.id}">
    <!-- 1. Đường hình dáng nét chữ chuẩn (độ dày thực tế, bán trong suốt) -->
    <path d="${stroke.path}" fill="${strokeColor}" fill-opacity="0.15" stroke="${strokeColor}" stroke-opacity="0.4" stroke-width="2" />
    
    <!-- 2. Đường xương chỉ hướng (Medians Skeleton) -->
`;

    // Tạo chuỗi đường dẫn medians
    if (stroke.medians.length > 0) {
      let mediansPathD = `M ${stroke.medians[0].x} ${stroke.medians[0].y}`;
      for (let i = 1; i < stroke.medians.length; i++) {
        mediansPathD += ` L ${stroke.medians[i].x} ${stroke.medians[i].y}`;
      }
      
      svgContent += `    <path d="${mediansPathD}" fill="none" stroke="${strokeColor}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />\n`;
      
      // Vẽ các điểm mốc medians cùng số thứ tự
      stroke.medians.forEach((point, ptIdx) => {
        const isStart = ptIdx === 0;
        const isEnd = ptIdx === stroke.medians.length - 1;
        
        // Điểm đặt bút (bắt đầu) có định dạng nổi bật hơn
        if (isStart) {
          svgContent += `    <!-- Điểm bắt đầu (đặt bút) -->
    <circle cx="${point.x}" cy="${point.y}" r="8" fill="#eab308" stroke="#1e293b" stroke-width="2" />
    <circle cx="${point.x}" cy="${point.y}" r="3" fill="#1e293b" />
`;
        } else if (isEnd) {
          svgContent += `    <!-- Điểm kết thúc (dừng bút) -->
    <circle cx="${point.x}" cy="${point.y}" r="6" fill="#ef4444" stroke="#ffffff" stroke-width="1.5" />
`;
        } else {
          svgContent += `    <!-- Điểm trung gian ${ptIdx} -->
    <circle cx="${point.x}" cy="${point.y}" r="5" fill="${strokeColor}" stroke="#ffffff" stroke-width="1.5" />
`;
        }

        // Nhãn số thứ tự
        svgContent += `    <text x="${point.x}" y="${point.y - 10}" font-size="11" font-weight="bold" fill="#1e293b" text-anchor="middle" style="paint-order: stroke; stroke: #ffffff; stroke-width: 3px; stroke-linejoin: round;">${ptIdx}</text>\n`;
      });
    }

    svgContent += `  </g>\n`;
  });

  // Chú thích các nét ở góc dưới
  svgContent += `
  <!-- Chú thích nét vẽ (Legend) -->
  <g transform="translate(20, 440)">
    <rect width="460" height="45" fill="#f8fafc" rx="6" stroke="#e2e8f0" stroke-width="1" />
    <text x="10" y="27" font-size="12" font-weight="bold" fill="#475569">Các nét:</text>
`;

  charData.strokes.forEach((stroke, strokeIdx) => {
    const strokeColor = strokeColors[strokeIdx % strokeColors.length];
    const offset = 75 + strokeIdx * 125;
    svgContent += `    <g transform="translate(${offset}, 15)">
      <circle cx="10" cy="12" r="6" fill="${strokeColor}" />
      <text x="22" y="16" font-size="11" fill="#475569">${stroke.name.length > 18 ? stroke.name.slice(0, 16) + '..' : stroke.name}</text>
    </g>\n`;
  });

  svgContent += `  </g>\n</svg>`;
  return svgContent;
}

// Xuất từng chữ cái ra file SVG
WRITING_ALPHABET_DATA.forEach((charData) => {
  const svgString = generateSVG(charData);
  const filePath = path.join(OUTPUT_DIR, `${charData.id}.svg`);
  fs.writeFileSync(filePath, svgString, 'utf8');
  console.log(`Đã tạo file SVG: ${filePath}`);
});

console.log('Hoàn thành việc tách các file SVG!');
