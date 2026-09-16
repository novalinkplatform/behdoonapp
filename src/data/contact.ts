import { localeDigits } from '../i18n/lang.ts';
import type { ContactSettings } from '../utils/dynamicContent.ts';

const FALLBACK_CONTACT: ContactSettings = {
  phoneDisplay: '021-22345678',
  phoneTelHref: 'tel:02122345678',
  socialLinks: [
    { id: 'wa1', platform: 'whatsapp', label: 'واتساپ', url: 'https://wa.me/989333256885' },
    { id: 'tg1', platform: 'telegram', label: 'تلگرام', url: 'https://t.me/behdoon' },
    { id: 'ig1', platform: 'instagram', label: 'اینستاگرام', url: 'https://instagram.com/behdoon.ir' },
    { id: 'em1', platform: 'mail', label: 'ایمیل', url: 'mailto:info@behdoon.ir' },
  ],
};

export function resolveContact(contact?: ContactSettings): ContactSettings {
  if (!contact) return FALLBACK_CONTACT;
  return { ...contact, socialLinks: contact.socialLinks ?? FALLBACK_CONTACT.socialLinks };
}

export function phoneNumberDisplay(contact?: ContactSettings): string {
  return localeDigits(resolveContact(contact).phoneDisplay);
}
