const toneMarks = {
  'á': { char: 'a', mark: 's' }, 'ấ': { char: 'â', mark: 's' }, 'ắ': { char: 'ă', mark: 's' },
  'é': { char: 'e', mark: 's' }, 'ế': { char: 'ê', mark: 's' }, 'í': { char: 'i', mark: 's' },
  'ó': { char: 'o', mark: 's' }, 'ố': { char: 'ô', mark: 's' }, 'ớ': { char: 'ơ', mark: 's' },
  'ú': { char: 'u', mark: 's' }, 'ứ': { char: 'ư', mark: 's' }, 'ý': { char: 'y', mark: 's' },
  'Á': { char: 'A', mark: 's' }, 'Ấ': { char: 'Â', mark: 's' }, 'Ắ': { char: 'Ă', mark: 's' },
  'É': { char: 'E', mark: 's' }, 'Ế': { char: 'Ê', mark: 's' }, 'Í': { char: 'I', mark: 's' },
  'Ó': { char: 'O', mark: 's' }, 'Ố': { char: 'Ô', mark: 's' }, 'Ớ': { char: 'Ơ', mark: 's' },
  'Ú': { char: 'U', mark: 's' }, 'Ứ': { char: 'Ư', mark: 's' }, 'Ý': { char: 'Y', mark: 's' },
  'à': { char: 'a', mark: 'f' }, 'ầ': { char: 'â', mark: 'f' }, 'ằ': { char: 'ă', mark: 'f' },
  'è': { char: 'e', mark: 'f' }, 'ề': { char: 'ê', mark: 'f' }, 'ì': { char: 'i', mark: 'f' },
  'ò': { char: 'o', mark: 'f' }, 'ồ': { char: 'ô', mark: 'f' }, 'ờ': { char: 'ơ', mark: 'f' },
  'ù': { char: 'u', mark: 'f' }, 'ừ': { char: 'ư', mark: 'f' }, 'ỳ': { char: 'y', mark: 'f' },
  'À': { char: 'A', mark: 'f' }, 'Ầ': { char: 'Â', mark: 'f' }, 'Ằ': { char: 'Ă', mark: 'f' },
  'È': { char: 'E', mark: 'f' }, 'Ề': { char: 'Ê', mark: 'f' }, 'Ì': { char: 'I', mark: 'f' },
  'Ò': { char: 'O', mark: 'f' }, 'Ờ': { char: 'Ơ', mark: 'f' }, 'Ù': { char: 'U', mark: 'f' },
  'Ừ': { char: 'Ư', mark: 'f' }, 'Ý': { char: 'Y', mark: 'f' },
  'ả': { char: 'a', mark: 'r' }, 'ẩ': { char: 'â', mark: 'r' }, 'ẳ': { char: 'ă', mark: 'r' },
  'ẻ': { char: 'e', mark: 'r' }, 'ể': { char: 'ê', mark: 'r' }, 'ỉ': { char: 'i', mark: 'r' },
  'ỏ': { char: 'o', mark: 'r' }, 'ổ': { char: 'ô', mark: 'r' }, 'ở': { char: 'ơ', mark: 'r' },
  'ủ': { char: 'u', mark: 'r' }, 'ử': { char: 'ư', mark: 'r' }, 'ỷ': { char: 'y', mark: 'r' },
  'Ả': { char: 'A', mark: 'r' }, 'Ẩ': { char: 'Â', mark: 'r' }, 'Ẳ': { char: 'Ă', mark: 'r' },
  'Ẻ': { char: 'E', mark: 'r' }, 'Ể': { char: 'Ê', mark: 'r' }, 'Ỉ': { char: 'I', mark: 'r' },
  'Ỏ': { char: 'O', mark: 'r' }, 'Ở': { char: 'Ơ', mark: 'r' }, 'Ủ': { char: 'U', mark: 'r' },
  'Ử': { char: 'Ư', mark: 'r' }, 'Ý': { char: 'Y', mark: 'r' },
  'ã': { char: 'a', mark: 'x' }, 'ẫ': { char: 'â', mark: 'x' }, 'ẵ': { char: 'ă', mark: 'x' },
  'ẽ': { char: 'e', mark: 'x' }, 'ễ': { char: 'ê', mark: 'x' }, 'ĩ': { char: 'i', mark: 'x' },
  'õ': { char: 'o', mark: 'x' }, 'ỗ': { char: 'ô', mark: 'x' }, 'ỡ': { char: 'ơ', mark: 'x' },
  'ũ': { char: 'u', mark: 'x' }, 'ữ': { char: 'ư', mark: 'x' }, 'ỹ': { char: 'y', mark: 'x' },
  'Ã': { char: 'A', mark: 'x' }, 'Ẫ': { char: 'Â', mark: 'x' }, 'Ẵ': { char: 'Ă', mark: 'x' },
  'Ẽ': { char: 'E', mark: 'x' }, 'Ễ': { char: 'Ê', mark: 'x' }, 'Ĩ': { char: 'I', mark: 'x' },
  'Õ': { char: 'O', mark: 'x' }, 'Ỗ': { char: 'Ô', mark: 'x' }, 'Ỡ': { char: 'Ơ', mark: 'x' },
  'Ũ': { char: 'U', mark: 'x' }, 'Ữ': { char: 'Ư', mark: 'x' }, 'Ý': { char: 'Y', mark: 'x' },
  'ạ': { char: 'a', mark: 'j' }, 'ậ': { char: 'â', mark: 'j' }, 'ặ': { char: 'ă', mark: 'j' },
  'ẹ': { char: 'e', mark: 'j' }, 'ệ': { char: 'ê', mark: 'j' }, 'ị': { char: 'i', mark: 'j' },
  'ọ': { char: 'o', mark: 'j' }, 'ộ': { char: 'ô', mark: 'j' }, 'ợ': { char: 'ơ', mark: 'j' },
  'ụ': { char: 'u', mark: 'j' }, 'ự': { char: 'ư', mark: 'j' }, 'ỵ': { char: 'y', mark: 'j' },
  'Ạ': { char: 'A', mark: 'j' }, 'Ậ': { char: 'Â', mark: 'j' }, 'Ặ': { char: 'Ă', mark: 'j' },
  'Ẹ': { char: 'E', mark: 'j' }, 'Ệ': { char: 'Ê', mark: 'j' }, 'Ị': { char: 'I', mark: 'j' },
  'Ọ': { char: 'O', mark: 'j' }, 'Ộ': { char: 'Ô', mark: 'j' }, 'Ợ': { char: 'Ơ', mark: 'j' },
  'Ụ': { char: 'U', mark: 'j' }, 'Ự': { char: 'Ư', mark: 'j' }, 'Ý': { char: 'Y', mark: 'j' }
};

const diacriticMarks = {
  'â': ['a', 'a'], 'ă': ['a', 'w'], 'ê': ['e', 'e'],
  'ô': ['o', 'o'], 'ơ': ['o', 'w'], 'ư': ['u', 'w'],
  'đ': ['d', 'd'],
  'Â': ['A', 'a'], 'Ă': ['A', 'w'], 'Ê': ['E', 'e'],
  'Ô': ['O', 'o'], 'Ơ': ['O', 'w'], 'Ư': ['U', 'w'],
  'Đ': ['D', 'd']
};

function wordToTelexKeys(word) {
  if (!word) return [];
  const normalizedWord = word.normalize('NFC');
  const match = normalizedWord.match(/^([\p{L}]+)([^\p{L}]*)$/u);
  if (!match) {
    return normalizedWord.split('');
  }
  const alphaPart = match[1];
  const puncPart = match[2];
  const keys = [];
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

function getPossibleTelexKeys(word) {
  if (!word) return [[]];
  const normalizedWord = word.normalize('NFC');
  const match = normalizedWord.match(/^([\p{L}]+)([^\p{L}]*)$/u);
  if (!match) {
    return [normalizedWord.split('')];
  }
  const alphaPart = match[1];
  const puncPart = match[2];
  const keys1 = [];
  const keys2 = [];
  let toneMark = null;
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

function validateInput(targetText, inputText) {
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

function getLongestCommonPrefixLength(possibleKeysList, inputKeys) {
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

function arraysEqual(a, b) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

function startsWithArray(target, prefix) {
  if (prefix.length > target.length) return false;
  for (let i = 0; i < prefix.length; i++) {
    if (prefix[i] !== target[i]) return false;
  }
  return true;
}

const content = '5 + 3 = 8; 10 - 4 = 6; 7 - 2 = 5; 6 + 4 = 10';
const inputs = [
  '5',
  '5 ',
  '5 +',
  '5 + ',
  '5 + 3',
  '5 + 3 ',
  '5 + 3 =',
  '5 + 3 = ',
  '5 + 3 = 8',
  '5 + 3 = 8;',
  '5 + 3 = 8; ',
  '5 + 3 = 8; 1',
  '5 + 3 = 8; 10',
  '5 + 3 = 8; 10 ',
  '5 + 3 = 8; 10 - 4 = 6; 7 - 2 = 5; 6 + 4 = 10'
];

inputs.forEach(input => {
  const result = validateInput(content, input);
  console.log(`Input: "${input}" -> isValid: ${result.isValid}, errorWordIndex: ${result.errorWordIndex}`);
});
