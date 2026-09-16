import { icons } from './icons.ts';
import { resolveContact } from '../data/contact.ts';
import { pick } from '../i18n/lang.ts';
import type { SiteSettings } from '../utils/dynamicContent.ts';

// برخلاف دکمه‌ی تماس (که همیشه با شماره‌ی پیش‌فرض نمایش داده می‌شود)، این دکمه فقط وقتی رندر می‌شود
// که مدیر واقعاً یک لینک واتس‌اپ در تنظیمات ← شبکه‌های اجتماعی ثبت کرده باشد — همان لینکی که خودِ
// آیکون واتس‌اپ فوتر هم از آن استفاده می‌کند؛ فیلد جدا یا سوییچ جداگانه‌ای اضافه نشده است.
export function renderFloatingWhatsAppButton(settings?: SiteSettings): string {
  const contact = resolveContact(settings?.contact);
  const whatsapp = contact.socialLinks?.find((s) => s.platform === 'whatsapp' && s.url && s.url !== '#');
  if (!whatsapp) return '';

  return `
    <a class="floating-whatsapp" href="${whatsapp.url}" target="_blank" rel="noopener noreferrer" aria-label="${pick('پیام در واتساپ', 'Message on WhatsApp')}">
      <span class="floating-whatsapp-icon-wrap">
        <span class="floating-whatsapp-wave"></span>
        <span class="floating-whatsapp-wave floating-whatsapp-wave-delay"></span>
        <span class="icon">${icons.whatsapp}</span>
      </span>
      <span class="floating-whatsapp-label">${pick('واتساپ', 'WhatsApp')}</span>
    </a>
  `;
}
