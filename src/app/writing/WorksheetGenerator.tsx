'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Printer, FileDown, AlignCenter, AlignLeft, Grid, Type, Check, RefreshCw, ZoomIn, Info } from 'lucide-react';
import { useSound } from '@/contexts/SoundContext';

// Danh sách các màu ô ly phổ biến
const GRID_COLORS = [
  { name: 'Xanh dương nhạt', value: '#a3d8f4' },
  { name: 'Hồng phấn', value: '#f4c3d8' },
  { name: 'Lục nhạt', value: '#a3f4c3' },
  { name: 'Xám thanh lịch', value: '#d1d5db' }
];

// Danh sách các màu chữ viết mẫu
const TEXT_COLORS = [
  { name: 'Đen carbon', value: '#231a11' },
  { name: 'Xanh viết máy', value: '#1e3a8a' },
  { name: 'Xám tập đồ (Tracing)', value: '#888888' },
  { name: 'Xám nhạt (Tập tô)', value: '#b3b3b3' }
];

export default function WorksheetGenerator() {
  const { playSound } = useSound();

  // Cấu hình nội dung phiếu
  const [sheetTitle, setSheetTitle] = useState('BÀI TẬP VIẾT');
  const [showStudentInfo, setShowStudentInfo] = useState(true);
  const [subTitle, setSubTitle] = useState('Luyện viết chữ đẹp');
  const [content, setContent] = useState('a ă â b c d đ e ê g h i k l m n o ô ơ p q r s t u ư v x y');
  
  // Cấu hình font & kiểu hiển thị
  const [fontFamily, setFontFamily] = useState<'HP001' | 'UNITapviet'>('HP001');
  const [textStyle, setTextStyle] = useState<'solid' | 'dashed' | 'outline'>('dashed');
  const [textColor, setTextColor] = useState('#888888');
  
  // Cấu hình ô ly
  const [gridType, setGridType] = useState<'4' | '5'>('4');
  const [showVerticalLines, setShowVerticalLines] = useState(true);
  const [gridColor, setGridColor] = useState('#a3d8f4');
  const [emptyLinesCount, setEmptyLinesCount] = useState(2);
  
  // Tinh chỉnh hiển thị để khớp ly hoàn hảo
  const [cellSize, setCellSize] = useState(20); // 1 ly = 20px
  const [fontScale, setFontScale] = useState(3.8); // Hệ số scale font so với cellSize
  const [textOffsetY, setTextOffsetY] = useState(2); // Offset dịch chữ theo chiều dọc
  const [letterSpacing, setLetterSpacing] = useState(1.2); // Khoảng cách chữ

  const printAreaRef = useRef<HTMLDivElement>(null);

  // Quyết định số hàng ô ly cho mỗi block dòng (4 cho 4-ly, 5 cho 5-ly)
  const gridRows = gridType === '4' ? 4 : 5;
  const lineTotalHeight = gridRows * cellSize;
  // Baseline đặt ở dòng kẻ dưới cùng của ô ly
  const baselineY = gridRows * cellSize;

  // Tách nội dung thành các dòng viết
  const contentLines = content.split('\n').filter(line => line.trim() !== '');

  // Lấy tên class font chữ tương ứng
  const getFontClass = () => {
    if (fontFamily === 'HP001') {
      return textStyle === 'dashed' ? 'font-hp001-dashed' : 'font-hp001';
    } else {
      return 'font-unitapviet0';
    }
  };

  // Xác định các thuộc tính fill/stroke cho chữ dựa theo kiểu chữ
  const getTextAttributes = () => {
    // UNITapviet không có font nét đứt sẵn, ta dùng stroke-dasharray của SVG để giả lập
    const isUnitapvietDashed = fontFamily === 'UNITapviet' && textStyle === 'dashed';
    
    if (textStyle === 'outline') {
      return {
        fill: 'none',
        stroke: textColor,
        strokeWidth: 1.2,
      };
    } else if (isUnitapvietDashed) {
      return {
        fill: 'none',
        stroke: textColor,
        strokeWidth: 1.5,
        strokeDasharray: '3,3',
      };
    } else {
      return {
        fill: textColor,
        stroke: 'none',
      };
    }
  };

  // Hàm vẽ các đường kẻ ô ly cho một dòng SVG
  const drawGridLines = (width: number) => {
    const lines = [];
    const marginCells = 3; // Lề trái 3 ô ly (margin width)
    const marginWidth = marginCells * cellSize;
    
    // Đường kẻ ngang (toàn bộ chiều rộng)
    for (let i = 0; i <= gridRows; i++) {
      const y = i * cellSize;
      // Đường đậm: Biên trên cùng (0) và baseline dưới cùng (gridRows)
      const isBold = i === 0 || i === gridRows;
      
      lines.push(
        <line
          key={`h-${i}`}
          x1={0}
          y1={y}
          x2={width}
          y2={y}
          stroke={gridColor}
          strokeWidth={isBold ? 1.5 : 0.6}
          strokeOpacity={isBold ? 0.85 : 0.4}
        />
      );
    }

    // Đường kẻ dọc (chỉ bắt đầu vẽ từ lề đỏ sang bên phải)
    if (showVerticalLines) {
      const colsCount = Math.floor(width / cellSize);
      for (let j = marginCells; j <= colsCount; j++) {
        const x = j * cellSize;
        // Mỗi 4 hoặc 5 ô ly kẻ một đường dọc đậm hơn chút
        const isBoldCol = (j - marginCells) % (gridType === '4' ? 4 : 5) === 0;
        lines.push(
          <line
            key={`v-${j}`}
            x1={x}
            y1={0}
            x2={x}
            y2={lineTotalHeight}
            stroke={gridColor}
            strokeWidth={isBoldCol ? 0.8 : 0.5}
            strokeOpacity={isBoldCol ? 0.4 : 0.25}
          />
        );
      }
    }

    // Đường biên lề màu đỏ thẳng đứng đặc trưng
    lines.push(
      <line
        key="vertical-red-margin"
        x1={marginWidth}
        y1={0}
        x2={marginWidth}
        y2={lineTotalHeight}
        stroke="#ef4444"
        strokeWidth={1.8}
        strokeOpacity={0.8}
      />
    );

    return lines;
  };

  // Kích hoạt tính năng in trình duyệt (In PDF)
  const handlePrint = () => {
    playSound('click');
    window.print();
  };

  // Tạo và tải tệp Microsoft Word (.doc) chứa lưới ô ly dạng ảnh SVG
  const handleDownloadWord = () => {
    playSound('click');
    if (!printAreaRef.current) return;

    // Lấy nội dung HTML của vùng in
    const printHtml = printAreaRef.current.innerHTML;

    // Địa chỉ base url để MS Word tải font chữ từ xa
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://viettyping.vercel.app';

    // Tạo template Word HTML đặc biệt
    const wordTemplate = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8">
        <title>${sheetTitle}</title>
        <style>
          @font-face {
            font-family: 'HP001';
            src: url('${origin}/fonts/HP001_4_hang_normal.ttf') format('truetype');
          }
          @font-face {
            font-family: 'HP001Dashed';
            src: url('${origin}/fonts/HP001TD4H.ttf') format('truetype');
          }
          @font-face {
            font-family: 'UNITapviet0';
            src: url('${origin}/fonts/UNITapviet_0_ly.ttf') format('truetype');
          }
          .font-hp001 { font-family: 'HP001', cursive, sans-serif; }
          .font-hp001-dashed { font-family: 'HP001Dashed', cursive, sans-serif; }
          .font-unitapviet0 { font-family: 'UNITapviet0', cursive, sans-serif; }
          
          body {
            font-family: sans-serif;
            background: white;
            padding: 20px;
          }
          .a4-page {
            width: 100%;
            max-width: 800px;
            margin: 0 auto;
            background: white;
          }
          .text-center { text-align: center; }
          .flex { display: flex; }
          .justify-between { justify-content: space-between; }
          .mb-6 { margin-bottom: 24px; }
          .text-2xl { font-size: 24px; }
          .font-black { font-weight: 900; }
          
          /* Đường lề đỏ vở học sinh */
          .border-red-margin {
            border-left: 2px solid #ef4444;
            padding-left: 10px;
          }
        </style>
      </head>
      <body>
        <div class="a4-page">
          ${printHtml}
        </div>
      </body>
      </html>
    `;

    // Xuất file blob dạng doc
    const blob = new Blob(['\ufeff' + wordTemplate], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${sheetTitle.toLowerCase().replace(/\s+/g, '_')}_on_grid.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Khôi phục cài đặt hiển thị mặc định
  const handleResetSettings = () => {
    playSound('click');
    setCellSize(20);
    setFontScale(3.8);
    setTextOffsetY(2);
    setLetterSpacing(1.2);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start w-full">
      {/* CỘT CẤU HÌNH (NO-PRINT) */}
      <div className="w-full lg:w-96 flex flex-col gap-6 no-print shrink-0">
        
        {/* Hộp cấu hình chính */}
        <div className="bg-[var(--color-surface)] border-3 border-[var(--color-foreground)] p-5 rounded-[24px] shadow-[4px_4px_0px_0px_var(--color-foreground)]">
          <h3 className="text-lg font-black text-[var(--color-foreground)] mb-4 flex items-center gap-2 border-b-2 border-[var(--color-foreground)]/10 pb-2">
            <Grid className="w-5 h-5 text-[var(--color-primary)]" />
            <span>Cấu hình Phiếu Tập Viết</span>
          </h3>

          <div className="space-y-4 text-sm font-bold text-[var(--color-foreground)]/80">
            {/* Tên phiếu */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="sheet-title">Tên tiêu đề phiếu</label>
              <input
                id="sheet-title"
                type="text"
                value={sheetTitle}
                onChange={(e) => setSheetTitle(e.target.value)}
                className="w-full h-11 px-3 py-2 border-2 border-[var(--color-foreground)] rounded-xl font-semibold bg-[var(--color-background)] focus:outline-none"
                placeholder="Ví dụ: BÀI TẬP VIẾT"
              />
            </div>

            {/* Tiêu đề phụ */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="subtitle">Nội dung phụ đề</label>
              <input
                id="subtitle"
                type="text"
                value={subTitle}
                onChange={(e) => setSubTitle(e.target.value)}
                className="w-full h-11 px-3 py-2 border-2 border-[var(--color-foreground)] rounded-xl font-semibold bg-[var(--color-background)] focus:outline-none"
                placeholder="Ví dụ: Luyện viết chữ đẹp"
              />
            </div>

            {/* Checkbox hiện thông tin học sinh */}
            <div className="flex items-center gap-2 py-1">
              <input
                id="show-student-info"
                type="checkbox"
                checked={showStudentInfo}
                onChange={(e) => setShowStudentInfo(e.target.checked)}
                className="w-5 h-5 rounded border-2 border-[var(--color-foreground)] accent-[var(--color-primary)]"
              />
              <label htmlFor="show-student-info" className="cursor-pointer">Hiển thị ô Họ tên & Lớp</label>
            </div>

            {/* Văn bản tập viết */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="sheet-content">Nội dung chữ luyện viết (Xuống dòng tạo dòng mới)</label>
              <textarea
                id="sheet-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={5}
                className="w-full px-3 py-2 border-2 border-[var(--color-foreground)] rounded-xl font-medium bg-[var(--color-background)] focus:outline-none font-sans text-base leading-relaxed"
                placeholder="Nhập chữ cái, từ hoặc thơ..."
              />
            </div>

            {/* Số dòng kẻ ly trống bên dưới dòng viết mẫu */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="empty-lines">Số dòng viết trống cho mỗi chữ mẫu</label>
              <select
                id="empty-lines"
                value={emptyLinesCount}
                onChange={(e) => setEmptyLinesCount(Number(e.target.value))}
                className="w-full h-11 px-3 py-2 border-2 border-[var(--color-foreground)] rounded-xl font-semibold bg-[var(--color-background)] focus:outline-none"
              >
                <option value={0}>Không tạo dòng trống</option>
                <option value={1}>1 dòng trống</option>
                <option value={2}>2 dòng trống (Khuyên dùng)</option>
                <option value={3}>3 dòng trống</option>
                <option value={4}>4 dòng trống</option>
              </select>
            </div>

            {/* Chọn Font chữ */}
            <div className="flex flex-col gap-1.5">
              <label>Lựa chọn Font chữ</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'HP001', label: 'Font HP001' },
                  { id: 'UNITapviet', label: 'Font Unitapviet' }
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFontFamily(f.id as any)}
                    className={`py-2 px-3 rounded-xl border-2 font-black transition-all cursor-pointer text-center text-sm ${
                      fontFamily === f.id
                        ? 'bg-[var(--color-primary)] text-white border-[var(--color-foreground)] shadow-[2px_2px_0px_var(--color-foreground)]'
                        : 'bg-[var(--color-background)] border-[var(--color-foreground)]/15 text-[var(--color-foreground)] hover:border-[var(--color-foreground)]'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Chọn Kiểu chữ */}
            <div className="flex flex-col gap-1.5">
              <label>Kiểu hiển thị nét chữ</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'solid', label: 'Nét liền' },
                  { id: 'dashed', label: 'Nét đứt' },
                  { id: 'outline', label: 'Viền rỗng' }
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setTextStyle(s.id as any)}
                    className={`py-2 px-1.5 rounded-xl border-2 font-black transition-all cursor-pointer text-center text-sm ${
                      textStyle === s.id
                        ? 'bg-[var(--color-primary)] text-white border-[var(--color-foreground)] shadow-[2px_2px_0px_var(--color-foreground)]'
                        : 'bg-[var(--color-background)] border-[var(--color-foreground)]/15 text-[var(--color-foreground)] hover:border-[var(--color-foreground)]'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Màu ô ly */}
            <div className="flex flex-col gap-1.5">
              <label>Màu đường lưới ô ly</label>
              <div className="flex gap-2">
                {GRID_COLORS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setGridColor(c.value)}
                    className="w-8 h-8 rounded-full border-2 border-[var(--color-foreground)] relative transition-all cursor-pointer hover:scale-110"
                    style={{ backgroundColor: c.value }}
                    title={c.name}
                  >
                    {gridColor === c.value && (
                      <Check className="w-4 h-4 text-slate-800 absolute inset-0 m-auto font-bold" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Màu nét chữ */}
            <div className="flex flex-col gap-1.5">
              <label>Màu nét chữ mẫu</label>
              <div className="flex gap-2">
                {TEXT_COLORS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setTextColor(c.value)}
                    className="w-8 h-8 rounded-full border-2 border-[var(--color-foreground)] relative transition-all cursor-pointer hover:scale-110"
                    style={{ backgroundColor: c.value }}
                    title={c.name}
                  >
                    {textColor === c.value && (
                      <Check className="w-4 h-4 text-white absolute inset-0 m-auto font-bold" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Lưới dọc */}
            <div className="flex items-center gap-2 py-1">
              <input
                id="show-vertical"
                type="checkbox"
                checked={showVerticalLines}
                onChange={(e) => setShowVerticalLines(e.target.checked)}
                className="w-5 h-5 rounded border-2 border-[var(--color-foreground)] accent-[var(--color-primary)]"
              />
              <label htmlFor="show-vertical" className="cursor-pointer">Hiển thị đường lưới dọc</label>
            </div>
          </div>
        </div>

        {/* Bảng tinh chỉnh kích cỡ ô ly/chữ (Nâng cao) */}
        <div className="bg-[var(--color-surface)] border-3 border-[var(--color-foreground)] p-5 rounded-[24px] shadow-[4px_4px_0px_0px_var(--color-foreground)]">
          <h3 className="text-sm font-black text-[var(--color-foreground)] mb-3 flex items-center justify-between">
            <span>🔧 Tinh chỉnh Ly & Font</span>
            <button
              onClick={handleResetSettings}
              className="text-sm text-[var(--color-primary)] hover:underline flex items-center gap-1 font-bold"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reset
            </button>
          </h3>

          <div className="space-y-4 text-sm font-bold text-[var(--color-foreground)]/70">
            {/* Kích thước ô ly */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between">
                <label htmlFor="cell-size">Kích thước 1 ô ly: {cellSize}px</label>
              </div>
              <input
                id="cell-size"
                type="range"
                min={15}
                max={30}
                value={cellSize}
                onChange={(e) => setCellSize(Number(e.target.value))}
                className="w-full accent-[var(--color-primary)]"
              />
            </div>

            {/* Tỷ lệ font chữ */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between">
                <label htmlFor="font-scale">Cỡ chữ (Tỷ lệ): {fontScale}</label>
              </div>
              <input
                id="font-scale"
                type="range"
                min={2.5}
                max={5.5}
                step={0.1}
                value={fontScale}
                onChange={(e) => setFontScale(Number(e.target.value))}
                className="w-full accent-[var(--color-primary)]"
              />
            </div>

            {/* Dịch chuyển chữ đứng */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between">
                <label htmlFor="offset-y">Vị trí chữ đứng (Y-offset): {textOffsetY > 0 ? `+${textOffsetY}` : textOffsetY}px</label>
              </div>
              <input
                id="offset-y"
                type="range"
                min={-15}
                max={15}
                value={textOffsetY}
                onChange={(e) => setTextOffsetY(Number(e.target.value))}
                className="w-full accent-[var(--color-primary)]"
              />
            </div>

            {/* Khoảng cách chữ */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between">
                <label htmlFor="letter-spacing">Khoảng cách chữ: {letterSpacing}em</label>
              </div>
              <input
                id="letter-spacing"
                type="range"
                min={0.5}
                max={2.5}
                step={0.1}
                value={letterSpacing}
                onChange={(e) => setLetterSpacing(Number(e.target.value))}
                className="w-full accent-[var(--color-primary)]"
              />
            </div>
            
            <div className="bg-blue-50 border border-blue-200 p-2.5 rounded-xl flex items-start gap-2 text-blue-800 text-sm leading-relaxed font-semibold">
              <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <span>Nút tinh chỉnh nâng cao giúp bạn căn lề chữ ngồi chuẩn chỉnh đúng đường kẻ Baseline của từng loại font trên các trình duyệt khác nhau.</span>
            </div>
          </div>
        </div>

        {/* Nút hành động chính */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
          <button
            onClick={handlePrint}
            className="w-full h-13 rounded-2xl font-black border-2 border-[var(--color-foreground)] bg-[var(--color-primary)] text-white hover:opacity-95 transition-all cursor-pointer shadow-[3px_3px_0px_var(--color-foreground)] active:translate-y-[2px] active:shadow-[1px_1px_0px_var(--color-foreground)] text-sm flex items-center justify-center gap-2"
          >
            <Printer className="w-5 h-5" />
            <span>In Phiếu / Xuất PDF</span>
          </button>
          
          <button
            onClick={handleDownloadWord}
            className="w-full h-13 rounded-2xl font-black border-2 border-[var(--color-foreground)] bg-blue-600 text-white hover:bg-blue-700 transition-all cursor-pointer shadow-[3px_3px_0px_var(--color-foreground)] active:translate-y-[2px] active:shadow-[1px_1px_0px_var(--color-foreground)] text-sm flex items-center justify-center gap-2"
          >
            <FileDown className="w-5 h-5" />
            <span>Tải Tệp Word (.doc)</span>
          </button>
        </div>
      </div>

      {/* CỘT PREVIEW BẢN IN A4 (MẪU GIẤY 4 Ô LY CHUẨN) */}
      <div className="flex-1 w-full flex flex-col items-center justify-start overflow-auto p-2 bg-slate-100 rounded-3xl border-3 border-dashed border-slate-300">
        
        {/* Khung giấy mô phỏng trang A4 */}
        <div 
          ref={printAreaRef}
          className="print-container w-[210mm] min-h-[297mm] bg-white border-2 border-slate-300 shadow-lg p-[15mm] relative box-border flex flex-col justify-start text-black font-serif select-none"
          style={{ width: '210mm', height: 'auto' }}
        >
          {/* Đầu trang: Tên phiếu, Họ tên học sinh */}
          <div className="w-full mb-6 z-10 font-sans print-area">
            <div className="flex justify-between items-start">
              {/* Bên trái: Thông tin học sinh */}
              {showStudentInfo ? (
                <div className="text-sm font-semibold space-y-2 text-slate-800">
                  <div>Họ và tên: ..............................................................</div>
                  <div>Lớp: ...........................................................................</div>
                </div>
              ) : <div />}

              {/* Bên phải: Tiêu đề phiếu */}
              <div className="text-right">
                <h1 className="text-xl font-extrabold text-slate-900 tracking-wider m-0 uppercase">
                  {sheetTitle}
                </h1>
                <p className="text-sm italic text-slate-500 mt-1 m-0">
                  {subTitle}
                </p>
              </div>
            </div>
          </div>

          {/* Thân trang: Vẽ các dòng viết ô ly và văn bản */}
          <div className="w-full flex-1 flex flex-col gap-0 z-10 print-area">
            {contentLines.map((lineText, lineIdx) => {
              const svgWidth = 650; // Chiều rộng bản xem trước
              const textAttrs = getTextAttributes();
              
              // Tạo các dòng kẻ ô ly
              const renderSvgLineBlock = (showText: boolean, keyPrefix: string) => (
                <div 
                  key={keyPrefix} 
                  className="w-full relative flex items-center justify-end"
                  style={{ height: `${lineTotalHeight}px` }}
                >
                  {/* Đường lề đỏ phụ (nếu viết lệch sang lề phải) */}
                  <svg 
                    width={svgWidth} 
                    height={lineTotalHeight} 
                    viewBox={`0 0 ${svgWidth} ${lineTotalHeight}`} 
                    className="overflow-visible select-none"
                  >
                    {/* Vẽ lưới ngang dọc */}
                    {drawGridLines(svgWidth)}

                    {/* Hiển thị Chữ viết mẫu */}
                    {showText && (
                      <text
                        x={3 * cellSize + 20}
                        y={baselineY + textOffsetY}
                        className={`${getFontClass()} select-none`}
                        fontSize={cellSize * fontScale}
                        letterSpacing={`${letterSpacing}em`}
                        {...textAttrs}
                      >
                        {lineText}
                      </text>
                    )}
                  </svg>
                </div>
              );

              // Gom nhóm: 1 dòng mẫu + N dòng kẻ ly trống để bé sao chép
              const lineBlocks = [renderSvgLineBlock(true, `line-${lineIdx}-model`)];
              
              for (let i = 0; i < emptyLinesCount; i++) {
                lineBlocks.push(renderSvgLineBlock(false, `line-${lineIdx}-empty-${i}`));
              }

              return (
                <div key={`group-${lineIdx}`} className="w-full flex flex-col gap-0 border-red-margin">
                  {lineBlocks}
                </div>
              );
            })}
          </div>
          
          {/* Chân trang đóng dấu thương hiệu nhỏ nhẹ */}
          <div className="w-full text-center text-sm text-slate-400 mt-10 font-sans border-t border-slate-100 pt-3 flex justify-between select-none">
            <span>Phiếu tập viết tạo tự động bởi Việt Typing</span>
            <span>https://viettyping.vercel.app</span>
          </div>
        </div>
      </div>
    </div>
  );
}
