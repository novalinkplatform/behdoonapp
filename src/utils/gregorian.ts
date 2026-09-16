// برای حالت انگلیسی سایت، تقویم میلادی واقعی (نه فقط برچسب انگلیسی روی تقویم شمسی) نمایش داده می‌شود —
// چون Date بومی جاوااسکریپت خودش حساب سال کبیسه/تعداد روز ماه را انجام می‌دهد، نیازی به الگوریتم دستی نیست.

export interface GregorianDate {
  y: number;
  m: number;
  d: number;
}

export const GREGORIAN_MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const GREGORIAN_WEEKDAY_SHORT = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export function gregorianMonthLength(y: number, m: number): number {
  return new Date(y, m, 0).getDate();
}

export function gregorianWeekday(y: number, m: number, d: number): number {
  return new Date(y, m - 1, d).getDay();
}

export function todayGregorian(): GregorianDate {
  const now = new Date();
  return { y: now.getFullYear(), m: now.getMonth() + 1, d: now.getDate() };
}

export function addDaysGregorian(date: GregorianDate, days: number): GregorianDate {
  const d = new Date(date.y, date.m - 1, date.d);
  d.setDate(d.getDate() + days);
  return { y: d.getFullYear(), m: d.getMonth() + 1, d: d.getDate() };
}

export function formatGregorianDate(date: GregorianDate): string {
  return `${GREGORIAN_MONTH_NAMES[date.m - 1]} ${date.d}, ${date.y}`;
}
