export interface CharMapping {
  char: string;
  telexKeys: string[];
  startIndex: number;
  endIndex: number;
}

const toneMarks: Record<string, { char: string; mark: string }> = {
  // Sắc
  'á': { char: 'a', mark: 's' }, 'ấ': { char: 'â', mark: 's' }, 'ắ': { char: 'ă', mark: 's' },
  'é': { char: 'e', mark: 's' }, 'ế': { char: 'ê', mark: 's' }, 'í': { char: 'i', mark: 's' },
  'ó': { char: 'o', mark: 's' }, 'ố': { char: 'ô', mark: 's' }, 'ớ': { char: 'ơ', mark: 's' },
  'ú': { char: 'u', mark: 's' }, 'ứ': { char: 'ư', mark: 's' }, 'ý': { char: 'y', mark: 's' },
  'Á': { char: 'A', mark: 's' }, 'Ấ': { char: 'Â', mark: 's' }, 'Ắ': { char: 'Ă', mark: 's' },
  'É': { char: 'E', mark: 's' }, 'Ế': { char: 'Ê', mark: 's' }, 'Í': { char: 'I', mark: 's' },
  'Ó': { char: 'O', mark: 's' }, 'Ố': { char: 'Ô', mark: 's' }, 'Ớ': { char: 'Ơ', mark: 's' },
  'Ú': { char: 'U', mark: 's' }, 'Ứ': { char: 'Ư', mark: 's' }, 'Ý': { char: 'Y', mark: 's' },

  // Huyền
  'à': { char: 'a', mark: 'f' }, 'ầ': { char: 'â', mark: 'f' }, 'ằ': { char: 'ă', mark: 'f' },
  'è': { char: 'e', mark: 'f' }, 'ề': { char: 'ê', mark: 'f' }, 'ì': { char: 'i', mark: 'f' },
  'ò': { char: 'o', mark: 'f' }, 'ồ': { char: 'ô', mark: 'f' }, 'ờ': { char: 'ơ', mark: 'f' },
  'ù': { char: 'u', mark: 'f' }, 'ừ': { char: 'ư', mark: 'f' }, 'ỳ': { char: 'y', mark: 'f' },
  'À': { char: 'A', mark: 'f' }, 'Ầ': { char: 'Â', mark: 'f' }, 'Ằ': { char: 'Ă', mark: 'f' },
  'È': { char: 'E', mark: 'f' }, 'Ề': { char: 'Ê', mark: 'f' }, 'Ì': { char: 'I', mark: 'f' },
  'Ò': { char: 'O', mark: 'f' }, 'Ồ': { char: 'Ô', mark: 'f' }, 'Ờ': { char: 'Ơ', mark: 'f' },
  'Ù': { char: 'U', mark: 'f' }, 'Ừ': { char: 'Ư', mark: 'f' }, 'Ỳ': { char: 'Y', mark: 'f' },

  // Hỏi
  'ả': { char: 'a', mark: 'r' }, 'ẩ': { char: 'â', mark: 'r' }, 'ẳ': { char: 'ă', mark: 'r' },
  'ẻ': { char: 'e', mark: 'r' }, 'ể': { char: 'ê', mark: 'r' }, 'ỉ': { char: 'i', mark: 'r' },
  'ỏ': { char: 'o', mark: 'r' }, 'ổ': { char: 'ô', mark: 'r' }, 'ở': { char: 'ơ', mark: 'r' },
  'ủ': { char: 'u', mark: 'r' }, 'ử': { char: 'ư', mark: 'r' }, 'ỷ': { char: 'y', mark: 'r' },
  'Ả': { char: 'A', mark: 'r' }, 'Ẩ': { char: 'Â', mark: 'r' }, 'Ẳ': { char: 'Ă', mark: 'r' },
  'Ẻ': { char: 'E', mark: 'r' }, 'Ể': { char: 'Ê', mark: 'r' }, 'Ỉ': { char: 'I', mark: 'r' },
  'Ỏ': { char: 'O', mark: 'r' }, 'Ở': { char: 'Ơ', mark: 'r' }, 'Ủ': { char: 'U', mark: 'r' },
  'Ử': { char: 'Ư', mark: 'r' }, 'Ỷ': { char: 'Y', mark: 'r' },

  // Ngã
  'ã': { char: 'a', mark: 'x' }, 'ẫ': { char: 'â', mark: 'x' }, 'ẵ': { char: 'ă', mark: 'x' },
  'ẽ': { char: 'e', mark: 'x' }, 'ễ': { char: 'ê', mark: 'x' }, 'ĩ': { char: 'i', mark: 'x' },
  'õ': { char: 'o', mark: 'x' }, 'ỗ': { char: 'ô', mark: 'x' }, 'ỡ': { char: 'ơ', mark: 'x' },
  'ũ': { char: 'u', mark: 'x' }, 'ữ': { char: 'ư', mark: 'x' }, 'ỹ': { char: 'y', mark: 'x' },
  'Ã': { char: 'A', mark: 'x' }, 'Ẫ': { char: 'Â', mark: 'x' }, 'Ẵ': { char: 'Ă', mark: 'x' },
  'Ẽ': { char: 'E', mark: 'x' }, 'Ễ': { char: 'Ê', mark: 'x' }, 'Ĩ': { char: 'I', mark: 'x' },
  'Õ': { char: 'O', mark: 'x' }, 'Ỗ': { char: 'Ô', mark: 'x' }, 'Ỡ': { char: 'Ơ', mark: 'x' },
  'Ũ': { char: 'U', mark: 'x' }, 'Ữ': { char: 'Ư', mark: 'x' }, 'Ỹ': { char: 'Y', mark: 'x' },

  // Nặng
  'ạ': { char: 'a', mark: 'j' }, 'ậ': { char: 'â', mark: 'j' }, 'ặ': { char: 'ă', mark: 'j' },
  'ẹ': { char: 'e', mark: 'j' }, 'ệ': { char: 'ê', mark: 'j' }, 'ị': { char: 'i', mark: 'j' },
  'ọ': { char: 'o', mark: 'j' }, 'ộ': { char: 'ô', mark: 'j' }, 'ợ': { char: 'ơ', mark: 'j' },
  'ụ': { char: 'u', mark: 'j' }, 'ự': { char: 'ư', mark: 'j' }, 'ỵ': { char: 'y', mark: 'j' },
  'Ạ': { char: 'A', mark: 'j' }, 'Ậ': { char: 'Â', mark: 'j' }, 'Ặ': { char: 'Ă', mark: 'j' },
  'Ẹ': { char: 'E', mark: 'j' }, 'Ệ': { char: 'Ê', mark: 'j' }, 'Ị': { char: 'I', mark: 'j' },
  'Ọ': { char: 'O', mark: 'j' }, 'Ộ': { char: 'Ô', mark: 'j' }, 'Ợ': { char: 'Ơ', mark: 'j' },
  'Ụ': { char: 'U', mark: 'j' }, 'Ự': { char: 'Ư', mark: 'j' }, 'Ỵ': { char: 'Y', mark: 'j' }
};

const diacriticMarks: Record<string, string[]> = {
  'â': ['a', 'a'], 'ă': ['a', 'w'], 'ê': ['e', 'e'],
  'ô': ['o', 'o'], 'ơ': ['o', 'w'], 'ư': ['u', 'w'],
  'đ': ['d', 'd'],
  'Â': ['A', 'a'], 'Ă': ['A', 'w'], 'Ê': ['E', 'e'],
  'Ô': ['O', 'o'], 'Ơ': ['O', 'w'], 'Ư': ['U', 'w'],
  'Đ': ['D', 'd']
};

export function wordToTelexKeys(word: string): string[] {
  if (!word) return [];

  const normalizedWord = word.normalize('NFC');

  // Tách từ thành phần chữ cái tiếng Việt và phần dấu câu ở cuối (ví dụ "học." -> "học" và ".")
  const match = normalizedWord.match(/^([\p{L}]+)([^\p{L}]*)$/u);

  if (!match) {
    return normalizedWord.split('');
  }

  const alphaPart = match[1];
  const puncPart = match[2];

  const keys: string[] = [];

  for (let i = 0; i < alphaPart.length; i++) {
    const char = alphaPart[i];
    if (toneMarks[char]) {
      const toneMark = toneMarks[char].mark;
      const cleanChar = toneMarks[char].char;
      if (diacriticMarks[cleanChar]) {
        keys.push(...diacriticMarks[cleanChar]);
      } else {
        keys.push(cleanChar);
      }
      keys.push(toneMark);
    } else if (diacriticMarks[char]) {
      keys.push(...diacriticMarks[char]);
    } else {
      keys.push(char);
    }
  }

  if (puncPart) {
    keys.push(...puncPart.split(''));
  }

  return keys;
}

export function stringToTelexKeys(text: string): string[] {
  if (!text) return [];
  
  const normalizedText = text.normalize('NFC');
  const words = normalizedText.split(' ');
  const result: string[] = [];

  for (let i = 0; i < words.length; i++) {
    if (i > 0) {
      result.push(' ');
    }
    result.push(...wordToTelexKeys(words[i]));
  }

  return result;
}

export function buildCharMappings(text: string): CharMapping[] {
  if (!text) return [];

  const normalizedText = text.normalize('NFC');
  const words = normalizedText.split(' ');
  const mappings: CharMapping[] = [];
  let currentTelexIndex = 0;

  for (let w = 0; w < words.length; w++) {
    if (w > 0) {
      mappings.push({
        char: ' ',
        telexKeys: [' '],
        startIndex: currentTelexIndex,
        endIndex: currentTelexIndex + 1
      });
      currentTelexIndex += 1;
    }

    const word = words[w];
    const match = word.match(/^([\p{L}]+)([^\p{L}]*)$/u);

    if (!match) {
      for (let i = 0; i < word.length; i++) {
        const char = word[i];
        mappings.push({
          char,
          telexKeys: [char],
          startIndex: currentTelexIndex,
          endIndex: currentTelexIndex + 1
        });
        currentTelexIndex += 1;
      }
      continue;
    }

    const alphaPart = match[1];
    const puncPart = match[2];

    let toneMark: string | null = null;
    let toneMarkCharIndex = -1;

    const alphaCharsTelex: string[][] = [];
    for (let i = 0; i < alphaPart.length; i++) {
      const char = alphaPart[i];
      if (toneMarks[char]) {
        toneMark = toneMarks[char].mark;
        toneMarkCharIndex = i;
        const cleanChar = toneMarks[char].char;
        if (diacriticMarks[cleanChar]) {
          alphaCharsTelex.push([...diacriticMarks[cleanChar]]);
        } else {
          alphaCharsTelex.push([cleanChar]);
        }
      } else if (diacriticMarks[char]) {
        alphaCharsTelex.push([...diacriticMarks[char]]);
      } else {
        alphaCharsTelex.push([char]);
      }
    }

    if (toneMark && toneMarkCharIndex !== -1) {
      alphaCharsTelex[toneMarkCharIndex].push(toneMark);
    }

    for (let i = 0; i < alphaPart.length; i++) {
      const char = alphaPart[i];
      const keys = alphaCharsTelex[i];
      mappings.push({
        char,
        telexKeys: keys,
        startIndex: currentTelexIndex,
        endIndex: currentTelexIndex + keys.length
      });
      currentTelexIndex += keys.length;
    }

    if (puncPart) {
      for (let i = 0; i < puncPart.length; i++) {
        const char = puncPart[i];
        mappings.push({
          char,
          telexKeys: [char],
          startIndex: currentTelexIndex,
          endIndex: currentTelexIndex + 1
        });
        currentTelexIndex += 1;
      }
    }
  }

  return mappings;
}

export function getPossibleTelexKeys(word: string): string[][] {
  if (!word) return [[]];
  
  const normalizedWord = word.normalize('NFC');
  const match = normalizedWord.match(/^([\p{L}]+)([^\p{L}]*)$/u);
  
  if (!match) {
    return [normalizedWord.split('')];
  }
  
  const alphaPart = match[1];
  const puncPart = match[2];
  
  const keys1: string[] = []; // dấu sau nguyên âm
  const keys2: string[] = []; // dấu cuối phần chữ cái
  
  let toneMark: string | null = null;
  
  for (let i = 0; i < alphaPart.length; i++) {
    const char = alphaPart[i];
    if (toneMarks[char]) {
      toneMark = toneMarks[char].mark;
      const cleanChar = toneMarks[char].char;
      if (diacriticMarks[cleanChar]) {
        keys1.push(...diacriticMarks[cleanChar]);
        keys2.push(...diacriticMarks[cleanChar]);
      } else {
        keys1.push(cleanChar);
        keys2.push(cleanChar);
      }
      keys1.push(toneMark);
    } else if (diacriticMarks[char]) {
      keys1.push(...diacriticMarks[char]);
      keys2.push(...diacriticMarks[char]);
    } else {
      keys1.push(char);
      keys2.push(char);
    }
  }
  
  if (toneMark) {
    keys2.push(toneMark);
  }
  
  const puncKeys = puncPart ? puncPart.split('') : [];
  keys1.push(...puncKeys);
  keys2.push(...puncKeys);
  
  if (!toneMark) {
    return [keys1];
  }
  
  return [keys1, keys2];
}

export interface ValidationResult {
  isValid: boolean;
  errorWordIndex: number;
  firstErrorTelexIndex: number;
  currentProgressIndex: number;
}

export function validateInput(targetText: string, inputText: string): ValidationResult {
  const normalizedTarget = targetText.normalize('NFC');
  const normalizedInput = inputText.normalize('NFC');
  
  const targetWords = normalizedTarget.split(' ');
  const inputWords = normalizedInput.split(' ');
  
  let isValid = true;
  let errorWordIndex = -1;
  let firstErrorTelexIndex = -1;
  let correctKeysCount = 0;
  
  for (let i = 0; i < inputWords.length; i++) {
    const inputWord = inputWords[i];
    const targetWord = targetWords[i];
    
    if (targetWord === undefined) {
      isValid = false;
      errorWordIndex = i;
      firstErrorTelexIndex = correctKeysCount > 0 ? correctKeysCount - 1 : 0;
      correctKeysCount = firstErrorTelexIndex;
      break;
    }
    
    const possibleKeysList = getPossibleTelexKeys(targetWord);
    const inputKeys = wordToTelexKeys(inputWord);
    
    if (i < inputWords.length - 1) {
      const matchingKeys = possibleKeysList.find(keys => arraysEqual(inputKeys, keys));
      
      if (!matchingKeys) {
        isValid = false;
        errorWordIndex = i;
        const matchLen = getLongestCommonPrefixLength(possibleKeysList, inputKeys);
        firstErrorTelexIndex = correctKeysCount + matchLen;
        correctKeysCount += matchLen;
        break;
      }
      correctKeysCount += matchingKeys.length + 1; // cộng 1 khoảng trắng
    } else {
      const matchingKeys = possibleKeysList.find(keys => startsWithArray(keys, inputKeys));
      
      if (!matchingKeys) {
        isValid = false;
        errorWordIndex = i;
        const matchLen = getLongestCommonPrefixLength(possibleKeysList, inputKeys);
        firstErrorTelexIndex = correctKeysCount + matchLen;
        correctKeysCount += matchLen;
        break;
      }
      correctKeysCount += inputKeys.length;
    }
  }
  
  return {
    isValid,
    errorWordIndex,
    firstErrorTelexIndex,
    currentProgressIndex: correctKeysCount
  };
}

function getLongestCommonPrefixLength(possibleKeysList: string[][], inputKeys: string[]): number {
  let maxLength = 0;
  for (const keys of possibleKeysList) {
    let length = 0;
    const minLen = Math.min(keys.length, inputKeys.length);
    for (let i = 0; i < minLen; i++) {
      if (keys[i] === inputKeys[i]) {
        length++;
      } else {
        break;
      }
    }
    if (length > maxLength) {
      maxLength = length;
    }
  }
  return maxLength;
}


export function getNextHighlightKey(targetText: string, inputText: string): string | null {
  const { isValid } = validateInput(targetText, inputText);
  
  if (!isValid) {
    return '⌫';
  }
  
  const normalizedTarget = targetText.normalize('NFC');
  const normalizedInput = inputText.normalize('NFC');
  
  const targetWords = normalizedTarget.split(' ');
  const inputWords = normalizedInput.split(' ');
  
  const lastInputWordIndex = inputWords.length - 1;
  const targetWord = targetWords[lastInputWordIndex];
  
  if (!targetWord) return null;
  
  const inputWord = inputWords[lastInputWordIndex];
  const possibleKeysList = getPossibleTelexKeys(targetWord);
  const inputKeys = wordToTelexKeys(inputWord);
  
  const matchingKeys = possibleKeysList.find(keys => startsWithArray(keys, inputKeys)) || possibleKeysList[0];
  
  if (inputKeys.length < matchingKeys.length) {
    return matchingKeys[inputKeys.length];
  }
  
  if (lastInputWordIndex < targetWords.length - 1) {
    return ' ';
  }
  
  return null;
}

function arraysEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

function startsWithArray(target: string[], prefix: string[]): boolean {
  if (prefix.length > target.length) return false;
  for (let i = 0; i < prefix.length; i++) {
    if (prefix[i] !== target[i]) return false;
  }
  return true;
}

export interface PossiblePath {
  keys: string[];
  charToKeyIndices: Record<number, number[]>;
}

export function getPossiblePaths(word: string): PossiblePath[] {
  if (!word) return [{ keys: [], charToKeyIndices: {} }];
  
  const normalizedWord = word.normalize('NFC');
  const match = normalizedWord.match(/^([\p{L}]+)([^\p{L}]*)$/u);
  
  if (!match) {
    const keys = normalizedWord.split('');
    const charToKeyIndices: Record<number, number[]> = {};
    keys.forEach((_, idx) => {
      charToKeyIndices[idx] = [idx];
    });
    return [{ keys, charToKeyIndices }];
  }
  
  const alphaPart = match[1];
  const puncPart = match[2];
  
  // Sinh Path 1: Dấu ngay sau nguyên âm
  const keys1: string[] = [];
  const charToKeyIndices1: Record<number, number[]> = {};
  
  for (let i = 0; i < alphaPart.length; i++) {
    const char = alphaPart[i];
    const startIndex = keys1.length;
    
    if (toneMarks[char]) {
      const toneMark = toneMarks[char].mark;
      const cleanChar = toneMarks[char].char;
      if (diacriticMarks[cleanChar]) {
        keys1.push(...diacriticMarks[cleanChar]);
      } else {
        keys1.push(cleanChar);
      }
      keys1.push(toneMark);
    } else if (diacriticMarks[char]) {
      keys1.push(...diacriticMarks[char]);
    } else {
      keys1.push(char);
    }
    
    const endIndex = keys1.length;
    const indices: number[] = [];
    for (let k = startIndex; k < endIndex; k++) {
      indices.push(k);
    }
    charToKeyIndices1[i] = indices;
  }
  
  // Sinh Path 2: Dấu ở cuối phần chữ cái
  const keys2: string[] = [];
  const charToKeyIndices2: Record<number, number[]> = {};
  let toneMark: string | null = null;
  let toneMarkCharIndex = -1;
  
  for (let i = 0; i < alphaPart.length; i++) {
    const char = alphaPart[i];
    const startIndex = keys2.length;
    
    if (toneMarks[char]) {
      toneMark = toneMarks[char].mark;
      toneMarkCharIndex = i;
      const cleanChar = toneMarks[char].char;
      if (diacriticMarks[cleanChar]) {
        keys2.push(...diacriticMarks[cleanChar]);
      } else {
        keys2.push(cleanChar);
      }
    } else if (diacriticMarks[char]) {
      keys2.push(...diacriticMarks[char]);
    } else {
      keys2.push(char);
    }
    
    const endIndex = keys2.length;
    const indices: number[] = [];
    for (let k = startIndex; k < endIndex; k++) {
      indices.push(k);
    }
    charToKeyIndices2[i] = indices;
  }
  
  if (toneMark && toneMarkCharIndex !== -1) {
    const toneMarkIndex = keys2.length;
    keys2.push(toneMark);
    charToKeyIndices2[toneMarkCharIndex].push(toneMarkIndex);
  }
  
  // Thêm phần dấu câu vào cuối
  const puncKeys = puncPart ? puncPart.split('') : [];
  if (puncKeys.length > 0) {
    const startIdx1 = keys1.length;
    keys1.push(...puncKeys);
    puncKeys.forEach((_, idx) => {
      charToKeyIndices1[alphaPart.length + idx] = [startIdx1 + idx];
    });
    
    const startIdx2 = keys2.length;
    keys2.push(...puncKeys);
    puncKeys.forEach((_, idx) => {
      charToKeyIndices2[alphaPart.length + idx] = [startIdx2 + idx];
    });
  }
  
  if (!toneMark) {
    return [{ keys: keys1, charToKeyIndices: charToKeyIndices1 }];
  }
  
  return [
    { keys: keys1, charToKeyIndices: charToKeyIndices1 },
    { keys: keys2, charToKeyIndices: charToKeyIndices2 }
  ];
}

export function getCharColorStates(targetText: string, inputText: string): ('correct' | 'incorrect' | 'current' | 'none')[] {
  const normalizedTarget = targetText.normalize('NFC');
  const normalizedInput = inputText.normalize('NFC');
  
  const targetWords = normalizedTarget.split(' ');
  const inputWords = normalizedInput.split(' ');
  
  const { isValid, errorWordIndex } = validateInput(targetText, inputText);
  
  const states: ('correct' | 'incorrect' | 'current' | 'none')[] = [];
  
  for (let w = 0; w < targetWords.length; w++) {
    const targetWord = targetWords[w];
    const inputWord = inputWords[w];
    
    // Thêm khoảng trắng trước từ
    if (w > 0) {
      let spaceState: 'correct' | 'incorrect' | 'current' | 'none' = 'none';
      
      if (errorWordIndex !== -1 && w - 1 >= errorWordIndex) {
        if (w - 1 === errorWordIndex && inputWords.length > w && inputWords[w - 1] !== undefined) {
          spaceState = 'incorrect';
        } else {
          spaceState = 'none';
        }
      } else {
        if (w < inputWords.length) {
          spaceState = 'correct';
        } else if (w === inputWords.length && isValid) {
          // Chỉ gán current cho dấu cách nếu từ ngay trước đó đã được hoàn thành
          const prevWord = targetWords[w - 1];
          const prevInput = inputWords[w - 1];
          if (prevInput !== undefined) {
            const prevPossible = getPossibleTelexKeys(prevWord);
            const prevInputKeys = wordToTelexKeys(prevInput);
            const isPrevComplete = prevPossible.some(keys => arraysEqual(prevInputKeys, keys));
            if (isPrevComplete) {
              spaceState = 'current';
            }
          }
        }
      }
      states.push(spaceState);
    }
    
    const possiblePaths = getPossiblePaths(targetWord);
    
    if (inputWord === undefined) {
      for (let c = 0; c < targetWord.length; c++) {
        states.push('none');
      }
    } else if (errorWordIndex !== -1 && w === errorWordIndex) {
      const inputKeys = wordToTelexKeys(inputWord);
      
      let bestPath = possiblePaths[0];
      let maxMatchLen = 0;
      
      for (const path of possiblePaths) {
        let matchLen = 0;
        const minLen = Math.min(path.keys.length, inputKeys.length);
        for (let k = 0; k < minLen; k++) {
          if (path.keys[k] === inputKeys[k]) {
            matchLen++;
          } else {
            break;
          }
        }
        if (matchLen > maxMatchLen) {
          maxMatchLen = matchLen;
          bestPath = path;
        }
      }
      
      let stopCorrect = false;
      let hasIncorrectSet = false;
      
      for (let c = 0; c < targetWord.length; c++) {
        const keyIndices = bestPath.charToKeyIndices[c] || [];
        const isAllKeysCorrect = keyIndices.length > 0 && keyIndices.every(idx => idx < maxMatchLen);
        
        if (isAllKeysCorrect && !stopCorrect) {
          states.push('correct');
        } else {
          stopCorrect = true;
          const isErrorChar = keyIndices.includes(maxMatchLen);
          
          if (isErrorChar && !hasIncorrectSet) {
            states.push('incorrect');
            hasIncorrectSet = true;
          } else {
            states.push('none');
          }
        }
      }
    } else if (errorWordIndex !== -1 && w > errorWordIndex) {
      for (let c = 0; c < targetWord.length; c++) {
        states.push('none');
      }
    } else {
      const inputKeys = wordToTelexKeys(inputWord);
      const isLastWord = w === inputWords.length - 1;
      
      let bestPath = possiblePaths[0];
      if (isLastWord) {
        bestPath = possiblePaths.find(path => startsWithArray(path.keys, inputKeys)) || possiblePaths[0];
      } else {
        bestPath = possiblePaths.find(path => arraysEqual(path.keys, inputKeys)) || possiblePaths[0];
      }
      
      let stopCorrect = false;
      let hasCurrentSet = false;
      
      for (let c = 0; c < targetWord.length; c++) {
        const keyIndices = bestPath.charToKeyIndices[c] || [];
        const isAllKeysCorrect = keyIndices.length > 0 && keyIndices.every(idx => idx < inputKeys.length);
        
        if (isAllKeysCorrect && !stopCorrect) {
          states.push('correct');
        } else {
          stopCorrect = true;
          if (isLastWord && !hasCurrentSet && (states.length === 0 || states[states.length - 1] === 'correct')) {
            states.push('current');
            hasCurrentSet = true;
          } else {
            states.push('none');
          }
        }
      }
    }
  }
  
  return states;
}

