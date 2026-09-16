const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

export function toPersianDigits(value: number | string): string {
  return String(value).replace(/[0-9]/g, (digit) => PERSIAN_DIGITS[Number(digit)]);
}

export function formatToman(amount: number): string {
  const withSeparators = Math.round(amount).toLocaleString('en-US');
  return `${toPersianDigits(withSeparators)} تومان`;
}
