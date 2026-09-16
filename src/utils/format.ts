import { toPersianDigits } from './jalali.ts';
import { pick } from '../i18n/lang.ts';

export function formatToman(amount: number): string {
  const rounded = Math.round(amount / 1000) * 1000;
  const withSeparators = rounded.toLocaleString('en-US');
  return `${toPersianDigits(withSeparators)} ${pick('تومان', 'Toman')}`;
}
