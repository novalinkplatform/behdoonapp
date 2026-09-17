import { todayJalaali } from './jalali.ts';

/**
 * شماره پیگیری اختصاصی ۸ رقمی بهدون
 * الگوریتم:
 * - دو رقم اول: سال شاهنشاهی (امسال ۲۵۸۵ -> ۸۵، سال بعد ۲۵۸۶ -> ۸۶)
 * - دو رقم دوم: ماه خورشیدی (۰۱ تا ۱۲)
 * - دو رقم سوم: روز خورشیدی (۰۱ تا ۳۱)
 * - دو رقم آخر (یا ۳ رقمی در صورت بیش از ۹۹ سفارش): شماره ترتیب سفارش در آن روز (۰۱، ۰۲ و ...)
 * مثال: 85021701
 */
export function getShahanshahiDateKey(date?: { jy: number; jm: number; jd: number }): string {
  const j = date || todayJalaali();
  // سال شاهنشاهی = سال جلالی + ۱۱۸۰
  const imperialYear = (j.jy + 1180) % 100;
  const yy = String(imperialYear).padStart(2, '0');
  const mm = String(j.jm).padStart(2, '0');
  const dd = String(j.jd).padStart(2, '0');
  return `${yy}${mm}${dd}`;
}

export function generateShahanshahiTrackingCode(): string {
  const dateKey = getShahanshahiDateKey();
  const storageKey = `behdoon_order_counter_${dateKey}`;
  let counter = 1;
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      counter = parseInt(saved, 10) + 1;
    }
    localStorage.setItem(storageKey, String(counter));
  } catch {
    counter = Math.floor(1 + Math.random() * 9);
  }

  const cc = counter < 100 ? String(counter).padStart(2, '0') : String(counter);
  return `${dateKey}${cc}`;
}
