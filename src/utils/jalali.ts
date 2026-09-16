export interface JalaaliDate {
  jy: number;
  jm: number;
  jd: number;
}

interface GregorianDate {
  gy: number;
  gm: number;
  gd: number;
}

function div(a: number, b: number): number {
  return ~~(a / b);
}

function mod(a: number, b: number): number {
  return a - ~~(a / b) * b;
}

const BREAKS = [
  -61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 2060, 2097, 2192, 2262, 2324, 2394,
  2456, 3178,
];

function jalCal(jy: number): { leap: number; gy: number; march: number } {
  const breaksLength = BREAKS.length;
  const gy = jy + 621;
  let leapJ = -14;
  let jp = BREAKS[0];

  if (jy < jp || jy >= BREAKS[breaksLength - 1]) {
    throw new Error(`Invalid Jalaali year ${jy}`);
  }

  let jump = 0;
  for (let i = 1; i < breaksLength; i += 1) {
    const jm = BREAKS[i];
    jump = jm - jp;
    if (jy < jm) break;
    leapJ = leapJ + div(jump, 33) * 8 + div(mod(jump, 33), 4);
    jp = jm;
  }

  let n = jy - jp;
  leapJ = leapJ + div(n, 33) * 8 + div(mod(n, 33) + 3, 4);
  if (mod(jump, 33) === 4 && jump - n === 4) {
    leapJ += 1;
  }

  const leapG = div(gy, 4) - div((div(gy, 100) + 1) * 3, 4) - 150;
  const march = 20 + leapJ - leapG;

  if (jump - n < 6) {
    n = n - jump + div(jump, 33) * 33;
  }
  let leap = mod(mod(n + 1, 33) - 1, 4);
  if (leap === -1) {
    leap = 4;
  }

  return { leap, gy, march };
}

function g2d(gy: number, gm: number, gd: number): number {
  let d =
    div((gy + div(gm - 8, 6) + 100100) * 1461, 4) + div(153 * mod(gm + 9, 12) + 2, 5) + gd - 34840408;
  d = d - div(div(gy + 100100 + div(gm - 8, 6), 100) * 3, 4) + 752;
  return d;
}

function d2g(jdn: number): GregorianDate {
  let j = 4 * jdn + 139361631;
  j = j + div(div(4 * jdn + 183187720, 146097) * 3, 4) * 4 - 3908;
  const i = div(mod(j, 1461), 4) * 5 + 308;
  const gd = div(mod(i, 153), 5) + 1;
  const gm = mod(div(i, 153), 12) + 1;
  const gy = div(j, 1461) - 100100 + div(8 - gm, 6);
  return { gy, gm, gd };
}

function j2d(jy: number, jm: number, jd: number): number {
  const r = jalCal(jy);
  return g2d(r.gy, 3, r.march) + (jm - 1) * 31 - div(jm, 7) * (jm - 7) + jd - 1;
}

function d2j(jdn: number): JalaaliDate {
  const gy = d2g(jdn).gy;
  let jy = gy - 621;
  const r = jalCal(jy);
  const jdn1f = g2d(r.gy, 3, r.march);
  let k = jdn - jdn1f;
  let jm: number;
  let jd: number;

  if (k >= 0) {
    if (k <= 185) {
      jm = 1 + div(k, 31);
      jd = mod(k, 31) + 1;
      return { jy, jm, jd };
    }
    k -= 186;
  } else {
    jy -= 1;
    k += 179;
    if (r.leap === 1) k += 1;
  }
  jm = 7 + div(k, 30);
  jd = mod(k, 30) + 1;
  return { jy, jm, jd };
}

export function isLeapJalaaliYear(jy: number): boolean {
  return jalCal(jy).leap === 0;
}

export function jalaaliMonthLength(jy: number, jm: number): number {
  if (jm <= 6) return 31;
  if (jm <= 11) return 30;
  return isLeapJalaaliYear(jy) ? 30 : 29;
}

export function gregorianToJalaali(date: Date): JalaaliDate {
  return d2j(g2d(date.getFullYear(), date.getMonth() + 1, date.getDate()));
}

export function jalaaliToGregorian(jy: number, jm: number, jd: number): Date {
  const { gy, gm, gd } = d2g(j2d(jy, jm, jd));
  return new Date(gy, gm - 1, gd);
}

export function jalaaliWeekday(jy: number, jm: number, jd: number): number {
  const gregorianWeekday = jalaaliToGregorian(jy, jm, jd).getDay();
  return (gregorianWeekday + 1) % 7;
}

import { getLang, localeDigits } from '../i18n/lang.ts';

export const PERSIAN_MONTH_NAMES = [
  'فروردین',
  'اردیبهشت',
  'خرداد',
  'تیر',
  'مرداد',
  'شهریور',
  'مهر',
  'آبان',
  'آذر',
  'دی',
  'بهمن',
  'اسفند',
];

export const PERSIAN_MONTH_NAMES_EN = [
  'Farvardin',
  'Ordibehesht',
  'Khordad',
  'Tir',
  'Mordad',
  'Shahrivar',
  'Mehr',
  'Aban',
  'Azar',
  'Dey',
  'Bahman',
  'Esfand',
];

export const PERSIAN_WEEKDAY_SHORT = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];
export const PERSIAN_WEEKDAY_SHORT_EN = ['Sa', 'Su', 'Mo', 'Tu', 'We', 'Th', 'Fr'];

export function toPersianDigits(value: number | string): string {
  return localeDigits(value);
}

export function currentWeekdayShort(): string[] {
  return getLang() === 'fa' ? PERSIAN_WEEKDAY_SHORT : PERSIAN_WEEKDAY_SHORT_EN;
}

export function formatJalaaliDate(date: JalaaliDate): string {
  const lang = getLang();
  const months = lang === 'fa' ? PERSIAN_MONTH_NAMES : PERSIAN_MONTH_NAMES_EN;
  const day = toPersianDigits(date.jd);
  const year = toPersianDigits(date.jy);
  return lang === 'fa' ? `${months[date.jm - 1]} ${day}، ${year}` : `${months[date.jm - 1]} ${day}, ${year}`;
}

export function isSameJalaaliDate(a: JalaaliDate, b: JalaaliDate): boolean {
  return a.jy === b.jy && a.jm === b.jm && a.jd === b.jd;
}

export function todayJalaali(): JalaaliDate {
  return gregorianToJalaali(new Date());
}

export function addDaysJalaali(date: JalaaliDate, days: number): JalaaliDate {
  const gregorian = jalaaliToGregorian(date.jy, date.jm, date.jd);
  gregorian.setDate(gregorian.getDate() + days);
  return gregorianToJalaali(gregorian);
}

export function formatIranianDate(input?: string | Date | null): string {
  if (!input) input = new Date();
  let date: Date;
  if (typeof input === 'string') {
    const trimmed = input.trim();
    if (/^(14\d\d|۱۴\d\d)/.test(trimmed) || PERSIAN_MONTH_NAMES.some((m) => trimmed.includes(m))) {
      return toPersianDigits(trimmed);
    }
    date = new Date(trimmed.includes(' ') && !trimmed.includes('T') ? trimmed.replace(' ', 'T') : trimmed);
  } else {
    date = input;
  }
  if (isNaN(date.getTime())) {
    return toPersianDigits(String(input));
  }
  const j = gregorianToJalaali(date);
  const jy = toPersianDigits(j.jy);
  const jm = toPersianDigits(String(j.jm).padStart(2, '0'));
  const jd = toPersianDigits(String(j.jd).padStart(2, '0'));
  return `${jy}/${jm}/${jd}`;
}

export function formatIranianDateFull(input?: string | Date | null): string {
  if (!input) input = new Date();
  let date: Date;
  if (typeof input === 'string') {
    const trimmed = input.trim();
    if (/^(14\d\d|۱۴\d\d)/.test(trimmed) || PERSIAN_MONTH_NAMES.some((m) => trimmed.includes(m))) {
      return toPersianDigits(trimmed);
    }
    date = new Date(trimmed.includes(' ') && !trimmed.includes('T') ? trimmed.replace(' ', 'T') : trimmed);
  } else {
    date = input;
  }
  if (isNaN(date.getTime())) {
    return toPersianDigits(String(input));
  }
  const j = gregorianToJalaali(date);
  const monthName = PERSIAN_MONTH_NAMES[j.jm - 1];
  return `${toPersianDigits(j.jd)} ${monthName} ${toPersianDigits(j.jy)}`;
}

