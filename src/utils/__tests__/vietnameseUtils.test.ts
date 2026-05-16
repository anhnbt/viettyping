import { hasVietnameseDiacritics } from '../vietnameseUtils';

describe('vietnameseUtils', () => {
  describe('hasVietnameseDiacritics', () => {
    it('should return true for words with Vietnamese diacritics', () => {
      expect(hasVietnameseDiacritics('chào')).toBe(true);
      expect(hasVietnameseDiacritics('bạn')).toBe(true);
      expect(hasVietnameseDiacritics('khỏe')).toBe(true);
      expect(hasVietnameseDiacritics('không')).toBe(true);
      expect(hasVietnameseDiacritics('đường')).toBe(true);
      expect(hasVietnameseDiacritics('Đường')).toBe(true);
    });

    it('should return false for words without Vietnamese diacritics', () => {
      expect(hasVietnameseDiacritics('chao')).toBe(false);
      expect(hasVietnameseDiacritics('ban')).toBe(false);
      expect(hasVietnameseDiacritics('khoe')).toBe(false);
      expect(hasVietnameseDiacritics('khong')).toBe(false);
      expect(hasVietnameseDiacritics('duong')).toBe(false);
      expect(hasVietnameseDiacritics('hello')).toBe(false);
      expect(hasVietnameseDiacritics('world')).toBe(false);
      expect(hasVietnameseDiacritics('123')).toBe(false);
      expect(hasVietnameseDiacritics('!@#')).toBe(false);
    });
  });
});
