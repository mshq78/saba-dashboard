/**
 * Utility functions for Persian digits formatting with Vazir font styling
 */

const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

/**
 * Converts English digits (0-9) to Persian digits (۰-۹)
 */
export function toPersianDigits(input: string | number | null | undefined): string {
  if (input === null || input === undefined) return '';
  return String(input).replace(/[0-9]/g, (digit) => PERSIAN_DIGITS[parseInt(digit, 10)]);
}

/**
 * Formats a floating number to fixed decimals and converts to Persian digits
 */
export function toPersianFixed(value: number | string | null | undefined, decimals: number = 2): string {
  if (value === null || value === undefined) return '';
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return toPersianDigits(value);
  return toPersianDigits(num.toFixed(decimals));
}

/**
 * Formats percentage with Persian digits
 */
export function toPersianPercent(value: number | string | null | undefined, decimals: number = 0): string {
  if (value === null || value === undefined) return '';
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return `${toPersianDigits(value)}٪`;
  return `${toPersianDigits(decimals > 0 ? num.toFixed(decimals) : Math.round(num))}٪`;
}
