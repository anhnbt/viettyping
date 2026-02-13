import React from 'react';

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

const fingerMap: Record<string, string> = {
  // Left Hand
  '`': 'pinky-left', '1': 'pinky-left', 'q': 'pinky-left', 'a': 'pinky-left', 'z': 'pinky-left',
  '2': 'ring-left', 'w': 'ring-left', 's': 'ring-left', 'x': 'ring-left',
  '3': 'middle-left', 'e': 'middle-left', 'd': 'middle-left', 'c': 'middle-left',
  '4': 'index-left', '5': 'index-left', 'r': 'index-left', 't': 'index-left', 'f': 'index-left', 'g': 'index-left', 'v': 'index-left', 'b': 'index-left',

  // Right Hand
  '6': 'index-right', '7': 'index-right', 'y': 'index-right', 'u': 'index-right', 'h': 'index-right', 'j': 'index-right', 'n': 'index-right', 'm': 'index-right',
  '8': 'middle-right', 'i': 'middle-right', 'k': 'middle-right', ',': 'middle-right',
  '9': 'ring-right', 'o': 'ring-right', 'l': 'ring-right', '.': 'ring-right',
  '0': 'pinky-right', '-': 'pinky-right', '=': 'pinky-right', 'p': 'pinky-right', '[': 'pinky-right', ']': 'pinky-right', '\\': 'pinky-right', ';': 'pinky-right', '\'': 'pinky-right', '/': 'pinky-right',

  // Special Keys
  ' ': 'thumb',
  'Shift': 'pinky-left', // Default to left shift for simplicity in display, ideally context dependent
  'Enter': 'pinky-right',
  'Tab': 'pinky-left',
  'Caps': 'pinky-left',
  'Ctrl': 'pinky-left',
  'Win': 'thumb',
  'Alt': 'thumb',
  'Menu': 'thumb',
  '⌫': 'pinky-right'
};

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

export default function VirtualKeyboard({ pressedKey, highlightKey }: Props) {
  const getKeyDisplay = (key: string) => {
    switch (key) {
      case ' ': return 'Space';
      case '⌫': return '⌫';
      default: return key;
    }
  };

  const getFingerColor = (key: string) => {
    const finger = fingerMap[key.toLowerCase()] || fingerMap[key];
    return finger ? fingerColors[finger] : 'bg-white border-gray-200';
  };

  return (
    <div className="mt-8">
      <div className="bg-gray-50 p-6 rounded-xl shadow-lg max-w-5xl mx-auto border border-gray-200">
        <div className="mb-4 text-center text-sm text-gray-500 italic">
          Màu sắc giúp bé đặt ngón tay đúng vị trí
        </div>
        {keyboardLayout.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center mb-2 last:mb-0 gap-1">
            {row.map((key, keyIndex) => {
              const displayKey = getKeyDisplay(key);

              const isPressed = key === ' ' ? pressedKey === ' ' || pressedKey === 'space' :
                               pressedKey === key.toLowerCase();

              const shouldHighlight = key === ' ' ? highlightKey === ' ' || highlightKey === 'space' :
                                     highlightKey === key.toLowerCase();

              const baseColor = getFingerColor(key);

              const width = 
                key === ' ' ? 'w-80' :
                key === '⌫' ? 'w-16' :
                key === 'Tab' ? 'w-20' :
                key === 'Caps' ? 'w-24' :
                key === 'Enter' ? 'w-24' :
                key === 'Shift' ? 'w-28' :
                'w-12';

              return (
                <div
                  key={keyIndex}
                  className={`${width} h-12 rounded-lg flex items-center justify-center
                    border-b-4 active:border-b-0 active:translate-y-1
                    ${isPressed ? 'bg-blue-500 text-white border-blue-600' : `${baseColor} hover:brightness-95`}
                    ${shouldHighlight ? 'ring-4 ring-blue-400 z-10 scale-105 transition-transform' : ''}
                    font-medium text-gray-700 shadow-sm transition-all duration-75 select-none text-base`}
                >
                  {displayKey}
                </div>
              );
            })}
          </div>
        ))}
      </div>

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
