import { wordToTelexKeys, stringToTelexKeys, buildCharMappings, validateInput, getNextHighlightKey, getPossiblePaths, getCharColorStates } from '../telex';

describe('Telex Translation Utilities', () => {
  describe('wordToTelexKeys', () => {
    test('should decompose simple characters with tone marks', () => {
      expect(wordToTelexKeys('á')).toEqual(['a', 's']);
      expect(wordToTelexKeys('à')).toEqual(['a', 'f']);
      expect(wordToTelexKeys('ả')).toEqual(['a', 'r']);
      expect(wordToTelexKeys('ã')).toEqual(['a', 'x']);
      expect(wordToTelexKeys('ạ')).toEqual(['a', 'j']);
    });

    test('should decompose characters with circumflex/breve and tone marks', () => {
      expect(wordToTelexKeys('ấ')).toEqual(['a', 'a', 's']);
      expect(wordToTelexKeys('ầ')).toEqual(['a', 'a', 'f']);
      expect(wordToTelexKeys('ắ')).toEqual(['a', 'w', 's']);
      expect(wordToTelexKeys('ặ')).toEqual(['a', 'w', 'j']);
      expect(wordToTelexKeys('đ')).toEqual(['d', 'd']);
    });

    test('should place tone mark at the end of simple words', () => {
      expect(wordToTelexKeys('ná')).toEqual(['n', 'a', 's']);
      expect(wordToTelexKeys('nà')).toEqual(['n', 'a', 'f']);
      expect(wordToTelexKeys('lá')).toEqual(['l', 'a', 's']);
      expect(wordToTelexKeys('là')).toEqual(['l', 'a', 'f']);
    });

    test('should handle complex Vietnamese words with tone mark after the vowel', () => {
      expect(wordToTelexKeys('thuyền')).toEqual(['t', 'h', 'u', 'y', 'e', 'e', 'f', 'n']);
      expect(wordToTelexKeys('đường')).toEqual(['d', 'd', 'u', 'w', 'o', 'w', 'f', 'n', 'g']);
      expect(wordToTelexKeys('học')).toEqual(['h', 'o', 'j', 'c']);
    });

    test('should handle words with punctuation marks at the end', () => {
      expect(wordToTelexKeys('học.')).toEqual(['h', 'o', 'j', 'c', '.']);
      expect(wordToTelexKeys('cơm,')).toEqual(['c', 'o', 'w', 'm', ',']);
      expect(wordToTelexKeys('Tôi')).toEqual(['T', 'o', 'o', 'i']);
      expect(wordToTelexKeys('để')).toEqual(['d', 'd', 'e', 'e', 'r']);
      expect(wordToTelexKeys('dịch')).toEqual(['d', 'i', 'j', 'c', 'h']);
      expect(wordToTelexKeys('kiểm')).toEqual(['k', 'i', 'e', 'e', 'r', 'm']);
    });

    test('should normalize NFD Unicode (decomposed) input correctly', () => {
      const nfdWord = 'đê\u0309'; // "để" ở dạng tổ hợp NFD
      expect(wordToTelexKeys(nfdWord)).toEqual(['d', 'd', 'e', 'e', 'r']);
    });
  });

  describe('stringToTelexKeys', () => {
    test('should convert simple sentences', () => {
      expect(stringToTelexKeys('á à')).toEqual(['a', 's', ' ', 'a', 'f']);
      expect(stringToTelexKeys('ná nà lá là')).toEqual([
        'n', 'a', 's', ' ', 'n', 'a', 'f', ' ',
        'l', 'a', 's', ' ', 'l', 'a', 'f'
      ]);
    });
  });

  describe('buildCharMappings', () => {
    test('should map characters to correct telex indices for simple text', () => {
      const mappings = buildCharMappings('ná nà');
      
      expect(mappings).toHaveLength(5); // 'n', 'á', ' ', 'n', 'à'
      
      // 'n'
      expect(mappings[0]).toEqual({
        char: 'n',
        telexKeys: ['n'],
        startIndex: 0,
        endIndex: 1
      });

      // 'á'
      expect(mappings[1]).toEqual({
        char: 'á',
        telexKeys: ['a', 's'],
        startIndex: 1,
        endIndex: 3
      });

      // ' '
      expect(mappings[2]).toEqual({
        char: ' ',
        telexKeys: [' '],
        startIndex: 3,
        endIndex: 4
      });

      // 'n'
      expect(mappings[3]).toEqual({
        char: 'n',
        telexKeys: ['n'],
        startIndex: 4,
        endIndex: 5
      });

      // 'à'
      expect(mappings[4]).toEqual({
        char: 'à',
        telexKeys: ['a', 'f'],
        startIndex: 5,
        endIndex: 7
      });
    });
  });

  describe('validateInput', () => {
    test('should validate correct typing paths for "toàn"', () => {
      // Cách 1: Gõ dấu giữa từ (t-o-a-f-n)
      expect(validateInput('toàn', 'toa')).toEqual({ isValid: true, errorWordIndex: -1, firstErrorTelexIndex: -1, currentProgressIndex: 3 });
      expect(validateInput('toàn', 'toà')).toEqual({ isValid: true, errorWordIndex: -1, firstErrorTelexIndex: -1, currentProgressIndex: 4 });
      expect(validateInput('toàn', 'toàn')).toEqual({ isValid: true, errorWordIndex: -1, firstErrorTelexIndex: -1, currentProgressIndex: 5 });

      // Cách 2: Gõ dấu cuối từ (t-o-a-n-f)
      expect(validateInput('toàn', 'toan')).toEqual({ isValid: true, errorWordIndex: -1, firstErrorTelexIndex: -1, currentProgressIndex: 4 });
      
      // Trường hợp gõ sai
      expect(validateInput('toàn', 'toam')).toEqual({ isValid: false, errorWordIndex: 0, firstErrorTelexIndex: 3, currentProgressIndex: 3 });
    });

    test('should validate sentences with spaces', () => {
      const sentence = 'học sinh';
      expect(validateInput(sentence, 'họ')).toEqual({ isValid: true, errorWordIndex: -1, firstErrorTelexIndex: -1, currentProgressIndex: 3 });
      expect(validateInput(sentence, 'học')).toEqual({ isValid: true, errorWordIndex: -1, firstErrorTelexIndex: -1, currentProgressIndex: 4 });
      expect(validateInput(sentence, 'học ')).toEqual({ isValid: true, errorWordIndex: -1, firstErrorTelexIndex: -1, currentProgressIndex: 5 });
      expect(validateInput(sentence, 'học si')).toEqual({ isValid: true, errorWordIndex: -1, firstErrorTelexIndex: -1, currentProgressIndex: 7 });
      expect(validateInput(sentence, 'học sin')).toEqual({ isValid: true, errorWordIndex: -1, firstErrorTelexIndex: -1, currentProgressIndex: 8 });
      expect(validateInput(sentence, 'học sinh')).toEqual({ isValid: true, errorWordIndex: -1, firstErrorTelexIndex: -1, currentProgressIndex: 9 });
      expect(validateInput(sentence, 'học sinh ')).toEqual({ isValid: false, errorWordIndex: 2, firstErrorTelexIndex: 9, currentProgressIndex: 9 }); // dư khoảng trắng
    });
  });

  describe('getNextHighlightKey', () => {
    test('should suggest next key correctly for "toàn"', () => {
      expect(getNextHighlightKey('toàn', '')).toBe('t');
      expect(getNextHighlightKey('toàn', 't')).toBe('o');
      expect(getNextHighlightKey('toàn', 'to')).toBe('a');
      // Khi gõ "toa", mặc định gợi ý gõ dấu thanh 'f'
      expect(getNextHighlightKey('toàn', 'toa')).toBe('f');
      // Nếu người dùng chọn gõ "toan" (chữ cái trước dấu sau), gợi ý phím tiếp theo phải là 'f'
      expect(getNextHighlightKey('toàn', 'toan')).toBe('f');
      // Khi hoàn thành từ thì không gợi ý thêm phím cho từ này
      expect(getNextHighlightKey('toàn', 'toàn')).toBeNull();
    });

    test('should suggest backspace when there is an error', () => {
      expect(getNextHighlightKey('toàn', 'toam')).toBe('⌫');
    });

    test('should suggest space after completing a word in a sentence', () => {
      expect(getNextHighlightKey('học sinh', 'học')).toBe(' ');
    });
  });

  describe('getPossiblePaths', () => {
    test('should generate correct paths and mappings for "toàn"', () => {
      const paths = getPossiblePaths('toàn');
      expect(paths).toHaveLength(2);

      // Path 1 (Dấu huyền ngay sau 'a')
      expect(paths[0].keys).toEqual(['t', 'o', 'a', 'f', 'n']);
      expect(paths[0].charToKeyIndices[0]).toEqual([0]); // t
      expect(paths[0].charToKeyIndices[1]).toEqual([1]); // o
      expect(paths[0].charToKeyIndices[2]).toEqual([2, 3]); // à
      expect(paths[0].charToKeyIndices[3]).toEqual([4]); // n

      // Path 2 (Dấu huyền ở cuối từ)
      expect(paths[1].keys).toEqual(['t', 'o', 'a', 'n', 'f']);
      expect(paths[1].charToKeyIndices[0]).toEqual([0]); // t
      expect(paths[1].charToKeyIndices[1]).toEqual([1]); // o
      expect(paths[1].charToKeyIndices[2]).toEqual([2, 4]); // à
      expect(paths[1].charToKeyIndices[3]).toEqual([3]); // n
    });
  });

  describe('getCharColorStates', () => {
    test('should return correct color states when typing "toàn" in different ways', () => {
      // Khi chưa gõ gì
      expect(getCharColorStates('toàn', '')).toEqual(['current', 'none', 'none', 'none']);

      // Gõ "toa"
      expect(getCharColorStates('toàn', 'toa')).toEqual(['correct', 'correct', 'current', 'none']);

      // Gõ "toan" (chưa gõ dấu huyền) -> chữ 'à' phải là current, chữ 'n' phải là none
      expect(getCharColorStates('toàn', 'toan')).toEqual(['correct', 'correct', 'current', 'none']);

      // Gõ hoàn chỉnh "toàn"
      expect(getCharColorStates('toàn', 'toàn')).toEqual(['correct', 'correct', 'correct', 'correct']);
      expect(getCharColorStates('toàn', 'toanf')).toEqual(['correct', 'correct', 'correct', 'correct']);

      // Gõ sai "toam" -> chữ 'à' phải là incorrect
      expect(getCharColorStates('toàn', 'toam')).toEqual(['correct', 'correct', 'incorrect', 'none']);
    });

    test('should return correct color states for multi-word sentences', () => {
      const sentence = 'học sinh';
      
      // Gõ "họ" (từ thứ nhất chưa xong) -> 'h', 'ọ' (correct) + 'c' (current) + khoảng trắng (none) + 'sinh' (4 none)
      expect(getCharColorStates(sentence, 'họ')).toEqual([
        'correct', 'correct', // họ
        'current', // c (ký tự hiện tại)
        'none', // khoảng trắng (không được highlight)
        'none', 'none', 'none', 'none' // sinh
      ]);

      // Gõ "học" (chưa gõ khoảng trắng) -> 'học' (3 correct) + khoảng trắng (current) + 'sinh' (4 none)
      expect(getCharColorStates(sentence, 'học')).toEqual([
        'correct', 'correct', 'correct', // học
        'current', // khoảng trắng
        'none', 'none', 'none', 'none' // sinh
      ]);

      // Gõ "học " (gõ xong khoảng trắng) -> 'học' (3 correct) + khoảng trắng (correct) + 's' (current) + 'inh' (3 none)
      expect(getCharColorStates(sentence, 'học ')).toEqual([
        'correct', 'correct', 'correct', // học
        'correct', // khoảng trắng
        'current', // s
        'none', 'none', 'none' // inh
      ]);

      // Gõ "học s" -> 'học' (3) + ' ' (1) + 's' (1) = 5 correct, 1 current ('i'), 2 none ('nh')
      expect(getCharColorStates(sentence, 'học s')).toEqual([
        'correct', 'correct', 'correct', // học (3 ký tự)
        'correct', // khoảng trắng
        'correct', // s
        'current', // i
        'none', 'none' // nh
      ]);
    });
  });
});

