/**
 * Checks if a string contains Vietnamese diacritics or special characters.
 * Detects tonal marks (sắc, huyền, hỏi, ngã, nặng) and
 * special Vietnamese characters (ă, â, ê, ô, ơ, ư, đ).
 */
export function hasVietnameseDiacritics(text: string): boolean {
    // Vietnamese-specific characters: ă â ê ô ơ ư đ, and vowels with any tonal marks
    const vietnameseRegex =
        /[àáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđ]/i;
    return vietnameseRegex.test(text);
}
