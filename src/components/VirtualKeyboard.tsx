import React from 'react';
import FingersVisualizer from './FingersVisualizer';
import { fingerMap } from './keyboardConstants';

interface Props {
  pressedKey: string | null;
  highlightKey: string | null;
}

const keyboardLayout = [
  ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', '⌫'],
  ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
  ['Caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\'', 'Enter'],
  ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'Shift'],
  ['Ctrl', 'Win', 'Alt', ' ', 'Alt', 'Win', 'Menu', 'Ctrl']
];



const fingerColors: Record<string, string> = {
  'pinky-left': 'bg-red-100 border-red-200',
  'ring-left': 'bg-orange-100 border-orange-200',
  'middle-left': 'bg-yellow-100 border-yellow-200',
  'index-left': 'bg-green-100 border-green-200',
  'thumb': 'bg-gray-100 border-gray-200',
  'index-right': 'bg-emerald-100 border-emerald-200',
  'middle-right': 'bg-blue-100 border-blue-200',
  'ring-right': 'bg-indigo-100 border-indigo-200',
  'pinky-right': 'bg-purple-100 border-purple-200',
};

const shiftKeyMap: Record<string, string> = {
  '+': '=',
  '_': '-',
  ')': '0',
  '(': '9',
  '*': '8',
  '&': '7',
  '^': '6',
  '%': '5',
  '$': '4',
  '#': '3',
  '@': '2',
  '!': '1',
  '~': '`',
  '{': '[',
  '}': ']',
  '|': '\\',
  ':': ';',
  '"': '\'',
  '<': ',',
  '>': '.',
  '?': '/'
};

export default function VirtualKeyboard({ pressedKey, highlightKey }: Props) {
  // Chuẩn hóa props thành string | null để tránh lỗi crash khi truyền kiểu số (number) hoặc đối tượng khác
  const highlightKeyStr = highlightKey !== null && highlightKey !== undefined ? String(highlightKey) : null;
  const pressedKeyStr = pressedKey !== null && pressedKey !== undefined ? String(pressedKey) : null;

  const getKeyDisplay = (key: string) => {
    switch (key) {
      case ' ': return 'Space';
      case '⌫': return '⌫';
      default: return key;
    }
  };

  const shouldHighlightKey = (key: string, rowIndex: number, keyIndex: number) => {
    if (!highlightKeyStr) return false;

    const isLeftShift = rowIndex === 3 && keyIndex === 0;
    const isRightShift = rowIndex === 3 && keyIndex === 11;

    // Kiểm tra xem highlightKeyStr có phải là chữ viết hoa hoặc ký tự cần Shift
    const isShiftRequired = /[A-ZÀ-ỸĐ]/.test(highlightKeyStr) || highlightKeyStr in shiftKeyMap;

    if (isShiftRequired) {
      const baseChar = /[A-ZÀ-ỸĐ]/.test(highlightKeyStr) 
        ? highlightKeyStr.toLowerCase() 
        : shiftKeyMap[highlightKeyStr];
      
      // Nếu phím hiện tại là phím cơ bản tương ứng
      if (key.toLowerCase() === baseChar.toLowerCase()) return true;

      // Nếu phím hiện tại là phím Shift tương ứng
      if (key === 'Shift') {
        const finger = fingerMap[baseChar];
        const isLeftHand = finger && finger.includes('left');
        
        if (isLeftHand && isRightShift) return true;
        if (!isLeftHand && isLeftShift) return true;
      }
      
      return false;
    }

    if (key === ' ') {
      return highlightKeyStr === ' ' || highlightKeyStr === 'space';
    }
    
    return highlightKeyStr.toLowerCase() === key.toLowerCase();
  };

  const getFingerColor = (key: string) => {
    const finger = fingerMap[key.toLowerCase()] || fingerMap[key];
    return finger ? fingerColors[finger] : 'bg-white border-gray-200';
  };

  return (
    <div className="mt-2">
      <div className="bg-white p-2 rounded-xl border border-gray-100">
        {keyboardLayout.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center mb-1 last:mb-0 gap-1">
            {row.map((key, keyIndex) => {
              const displayKey = getKeyDisplay(key);

              const isPressed = key === ' ' ? pressedKeyStr === ' ' || pressedKeyStr === 'space' :
                pressedKeyStr === key.toLowerCase();

              const shouldHighlight = shouldHighlightKey(key, rowIndex, keyIndex);

              const baseColor = getFingerColor(key);

              const width =
                key === ' ' ? 'w-64' :
                  key === '⌫' ? 'w-14' :
                    key === 'Tab' ? 'w-16' :
                      key === 'Caps' ? 'w-20' :
                        key === 'Enter' ? 'w-20' :
                          key === 'Shift' ? 'w-24' :
                            'w-10';

              const keyBgColor = isPressed 
                ? 'bg-blue-500 text-white border-blue-600 font-black' 
                : shouldHighlight 
                  ? 'bg-amber-400 text-amber-950 border-amber-500 font-black animate-pulse shadow-[0_0_15px_#fbbf24] scale-110 z-20 transition-transform' 
                  : `${baseColor} hover:brightness-95 font-medium`;

              return (
                <div
                  key={keyIndex}
                  className={`${width} h-10 rounded-[10px] flex items-center justify-center
                    border-b-2 active:border-b-0 active:translate-y-0.5
                    ${keyBgColor}
                    text-gray-700 shadow-sm transition-all duration-100 select-none text-sm`}
                >
                  {displayKey}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <FingersVisualizer highlightKey={highlightKeyStr} pressedKey={pressedKeyStr} />

      {/* Legend for Fingers */}
      <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs text-gray-600">
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-red-100 border border-red-200"></div> Ngón út trái</div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-orange-100 border border-orange-200"></div> Ngón áp út trái</div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-yellow-100 border border-yellow-200"></div> Ngón giữa trái</div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-green-100 border border-green-200"></div> Ngón trỏ trái</div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-gray-100 border border-gray-200"></div> Ngón cái</div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-emerald-100 border border-emerald-200"></div> Ngón trỏ phải</div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-blue-100 border border-blue-200"></div> Ngón giữa phải</div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-indigo-100 border border-indigo-200"></div> Ngón áp út phải</div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-purple-100 border border-purple-200"></div> Ngón út phải</div>
      </div>
    </div>
  );
}
