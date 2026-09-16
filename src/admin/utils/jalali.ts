// نسخه‌ی خلاصه‌شده‌ی Behbar/src/utils/jalali.ts — فقط تبدیل میلادی به جلالی و قالب‌بندی،
// چون این پنل کاملاً فارسی است و نیازی به شاخه‌بندی زبان ندارد.

export interface JalaaliDate {
  jy: number;
  jm: number;
  jd: number;
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

interface GregorianDate {
  gy: number;
  gm: number;
  gd: number;
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

export function gregorianToJalaali(date: Date): JalaaliDate {
  return d2j(g2d(date.getFullYear(), date.getMonth() + 1, date.getDate()));
}

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

const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

export function toPersianDigits(value: number | string): string {
  return String(value).replace(/[0-9]/g, (d) => PERSIAN_DIGITS[Number(d)]);
}

export function formatJalaaliDate(date: JalaaliDate): string {
  return `${PERSIAN_MONTH_NAMES[date.jm - 1]} ${toPersianDigits(date.jd)}، ${toPersianDigits(date.jy)}`;
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

/**
 * SQLite `datetime('now')` رشته‌هایی مثل "2026-08-27 14:46:40" (بدون منطقه‌ی زمانی، UTC) برمی‌گرداند.
 * برای مقایسه با «امروز» باید همان‌طور بدون Z تفسیر شود، نه با تبدیل ضمنی به زمان محلی مرورگر.
 */
function parseSqliteDatetime(value: string): Date {
  return new Date(value.replace(' ', 'T') + 'Z');
}

export function formatMessageTimestamp(sqliteDatetime: string): string {
  // پارس به‌عنوان UTC (چون SQLite همین‌طور ذخیره می‌کند)، اما نمایش با ساعت/تاریخ محلی مرورگر —
  // هم برای زمان و هم برای «امروز بودن» باید یک مرجع زمانی استفاده شود، نه ترکیبی از UTC و محلی.
  const date = parseSqliteDatetime(sqliteDatetime);
  const now = new Date();
  const jToday = gregorianToJalaali(now);
  const jDate = gregorianToJalaali(date);
  const hh = toPersianDigits(String(date.getHours()).padStart(2, '0'));
  const mm = toPersianDigits(String(date.getMinutes()).padStart(2, '0'));
  const time = `${hh}:${mm}`;
  if (jToday.jy === jDate.jy && jToday.jm === jDate.jm && jToday.jd === jDate.jd) {
    return `امروز، ${time}`;
  }
  return `${formatJalaaliDate(jDate)}، ${time}`;
}
