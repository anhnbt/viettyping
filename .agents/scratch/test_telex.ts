import { validateInput, getNextHighlightKey, stringToTelexKeys, getPossibleTelexKeys } from '../../src/utils/telex';

const content = '5 + 3 = 8; 10 - 4 = 6; 7 - 2 = 5; 6 + 4 = 10';

console.log('--- PHÂN TÍCH CHUỖI MẪU ---');
const words = content.split(' ');
words.forEach((w, i) => {
  console.log(`Từ ${i}: "${w}" -> Telex keys:`, getPossibleTelexKeys(w));
});

console.log('\n--- MÔ PHỎNG QUÁ TRÌNH GÕ ---');
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
  '5 + 3 = 8; 10 '
];

inputs.forEach(input => {
  const result = validateInput(content, input);
  const nextKey = getNextHighlightKey(content, input);
  console.log(`Input: "${input}"`);
  console.log(`  - isValid: ${result.isValid}`);
  console.log(`  - errorWordIndex: ${result.errorWordIndex}`);
  console.log(`  - firstErrorTelexIndex: ${result.firstErrorTelexIndex}`);
  console.log(`  - currentProgressIndex: ${result.currentProgressIndex}`);
  console.log(`  - getNextHighlightKey: "${nextKey}"`);
});
