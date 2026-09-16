import { icons } from './icons.ts';
import { phoneNumberDisplay, resolveContact } from '../data/contact.ts';
import { pick } from '../i18n/lang.ts';
import type { SiteSettings } from '../utils/dynamicContent.ts';

export function renderFloatingCallButton(settings?: SiteSettings): string {
  const contact = resolveContact(settings?.contact);
  return `
    <a class="floating-call" href="${contact.phoneTelHref}" aria-label="${pick('تماس با بهدون', 'Call Behdoon')}">
      <span class="floating-call-icon-wrap">
        <span class="floating-call-wave"></span>
        <span class="floating-call-wave floating-call-wave-delay"></span>
        <span class="icon">${icons.phone}</span>
      </span>
      <span class="floating-call-number" dir="ltr">${phoneNumberDisplay(contact)}</span>
    </a>
  `;
}
