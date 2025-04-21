import React from 'react';
import { IoHandLeftOutline, IoHandRightOutline } from 'react-icons/io5';

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

// Define which hand and finger should press each key
const fingerMap: Record<string, { hand: 'left' | 'right'; finger: number }> = {
  '`': { hand: 'left', finger: 0 },
  '1': { hand: 'left', finger: 0 },
  '2': { hand: 'left', finger: 1 },
  '3': { hand: 'left', finger: 2 },
  '4': { hand: 'left', finger: 3 },
  '5': { hand: 'left', finger: 3 },
  '6': { hand: 'right', finger: 0 },
  '7': { hand: 'right', finger: 0 },
  '8': { hand: 'right', finger: 1 },
  '9': { hand: 'right', finger: 2 },
  '0': { hand: 'right', finger: 3 },
  '-': { hand: 'right', finger: 3 },
  '=': { hand: 'right', finger: 3 },
  'q': { hand: 'left', finger: 0 },
  'w': { hand: 'left', finger: 1 },
  'e': { hand: 'left', finger: 2 },
  'r': { hand: 'left', finger: 3 },
  't': { hand: 'left', finger: 3 },
  'y': { hand: 'right', finger: 0 },
  'u': { hand: 'right', finger: 0 },
  'i': { hand: 'right', finger: 1 },
  'o': { hand: 'right', finger: 2 },
  'p': { hand: 'right', finger: 3 },
  'a': { hand: 'left', finger: 0 },
  's': { hand: 'left', finger: 1 },
  'd': { hand: 'left', finger: 2 },
  'f': { hand: 'left', finger: 3 },
  'g': { hand: 'left', finger: 3 },
  'h': { hand: 'right', finger: 0 },
  'j': { hand: 'right', finger: 0 },
  'k': { hand: 'right', finger: 1 },
  'l': { hand: 'right', finger: 2 },
  ';': { hand: 'right', finger: 3 },
  '\'': { hand: 'right', finger: 3 },
  'z': { hand: 'left', finger: 0 },
  'x': { hand: 'left', finger: 1 },
  'c': { hand: 'left', finger: 2 },
  'v': { hand: 'left', finger: 3 },
  'b': { hand: 'left', finger: 3 },
  'n': { hand: 'right', finger: 0 },
  'm': { hand: 'right', finger: 0 },
  ',': { hand: 'right', finger: 1 },
  '.': { hand: 'right', finger: 2 },
  '/': { hand: 'right', finger: 3 }
};

function Hand({ side, activeKey }: { side: 'left' | 'right'; activeKey: string | null }) {
  const fingerPositions = Array(4).fill(false);
  
  if (activeKey && fingerMap[activeKey]?.hand === side) {
    fingerPositions[fingerMap[activeKey].finger] = true;
  }

  const HandIcon = side === 'left' ? IoHandLeftOutline : IoHandRightOutline;
  const transform = side === 'left' ? 'rotate-[-30deg]' : 'rotate-[30deg]';

  return (
    <div className={`relative ${transform}`}>
      <HandIcon className={`text-6xl ${side === 'left' ? 'mr-4' : 'ml-4'}`} />
      <div className="absolute top-0 left-0 w-full h-full">
        {fingerPositions.map((isActive, index) => (
          <div
            key={index}
            className={`absolute w-2 h-2 rounded-full
              ${isActive ? 'bg-blue-500' : 'bg-transparent'}
              transition-colors duration-100`}
            style={{
              top: `${20 + index * 15}%`,
              left: side === 'left' ? '70%' : '20%'
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function VirtualKeyboard({ pressedKey, highlightKey }: Props) {
  const getKeyDisplay = (key: string) => {
    switch (key) {
      case ' ': return 'Space';
      case '⌫': return '⌫';
      default: return key;
    }
  };

  return (
    <div className="mt-8">
      <div className="flex justify-center items-center mb-8 space-x-20">
        <Hand side="left" activeKey={pressedKey} />
        <Hand side="right" activeKey={pressedKey} />
      </div>

      <div className="bg-gray-100 p-4 rounded-lg shadow-inner max-w-4xl mx-auto">
        {keyboardLayout.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center mb-2 last:mb-0">
            {row.map((key, keyIndex) => {
              const displayKey = getKeyDisplay(key);
              const isPressed = key === ' ' ? pressedKey === ' ' || pressedKey === 'space' :
                               pressedKey === key.toLowerCase();
              const shouldHighlight = key === ' ' ? highlightKey === ' ' || highlightKey === 'space' :
                                     highlightKey === key.toLowerCase();
              const width = 
                key === ' ' ? 'w-64' :
                key === '⌫' ? 'w-14' :
                key === 'Tab' ? 'w-16' :
                key === 'Caps' ? 'w-18' :
                key === 'Enter' ? 'w-18' :
                key === 'Shift' ? 'w-20' :
                'w-10';

              return (
                <div
                  key={keyIndex}
                  className={`${width} h-10 m-0.5 rounded flex items-center justify-center 
                    ${isPressed ? 'bg-blue-500 text-white' : 'bg-white'}
                    ${shouldHighlight ? 'ring-2 ring-blue-400' : ''}
                    ${key === ' ' ? 'mx-2' : ''}
                    shadow transition-all duration-100 select-none text-sm
                    hover:bg-gray-50`}
                >
                  {displayKey}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
