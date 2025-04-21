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
