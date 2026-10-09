import { icons } from './icons.ts';
import { pick } from '../i18n/lang.ts';
import { API_BASE_URL } from '../data/config.ts';
import { formatTelegramTime } from '../utils/jalali.ts';
import { getLocalCustomerInfo } from '../utils/customerAuth.ts';
import { toPersianDigits } from '../utils/format.ts';
import type { SiteSettings } from '../utils/dynamicContent.ts';

const TOKEN_KEY = 'behdoon_chat_token';
const LEGACY_TOKEN_KEY = 'behbar_chat_token';
const NAME_KEY = 'behdoon_chat_name';
const LEGACY_NAME_KEY = 'behbar_chat_name';
const PHONE_KEY = 'behdoon_chat_phone';
const POLL_MS = 4000;

interface ChatMessage {
  id: number;
  sender: 'customer' | 'staff';
  staffName: string | null;
  staffAvatar: string | null;
  text: string;
  type: 'text' | 'image' | 'location' | 'auto_reply';
  createdAt: string;
}

interface AssignedStaff {
  name: string;
  avatarUrl: string | null;
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function avatarHtml(name: string, avatarUrl: string | null): string {
  if (avatarUrl) return `<img class="chat-avatar" src="${avatarUrl}" alt="${escapeHtml(name)}" />`;
  return `<span class="chat-avatar">${escapeHtml(name.trim().charAt(0) || '؟')}</span>`;
}

function renderMessageBody(m: ChatMessage): string {
  if (m.type === 'image') {
    const src = `${API_BASE_URL}${m.text}`;
    return `<a href="${src}" target="_blank" rel="noopener"><img class="chat-bubble-image" src="${src}" alt="${pick('تصویر ارسالی', 'Sent image')}" loading="lazy" /></a>`;
  }
  if (m.type === 'location') {
    let mapHref = '';
    try {
      const pos = JSON.parse(m.text) as { lat?: unknown; lng?: unknown };
      if (typeof pos.lat === 'number' && typeof pos.lng === 'number') mapHref = `https://www.google.com/maps?q=${pos.lat},${pos.lng}`;
    } catch {
      /* malformed */
    }
    if (!mapHref) return `<p>${pick('موقعیت نامعتبر', 'Invalid location')}</p>`;
    return `<a class="chat-bubble-location" href="${mapHref}" target="_blank" rel="noopener"><span class="icon">${icons.pin}</span><span>${pick('مشاهده موقعیت روی نقشه', 'View location on map')}</span></a>`;
  }
  return `<p>${escapeHtml(m.text)}</p>`;
}

function normalizeDigits(str: string): string {
  return str
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 1776))
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 1632));
}

export function getStoredCustomer(): { name: string; phone: string; isRegistered: boolean } | null {
  // ۱. بررسی ورود فعال کاربر در سایت (پروفایل کاربر)
  try {
    const registered = getLocalCustomerInfo();
    if (registered && registered.phone) {
      const cleanPhone = normalizeDigits(registered.phone).replace(/\D/g, '');
      if (/^09\d{9}$/.test(cleanPhone)) {
        return {
          phone: cleanPhone,
          name: String(registered.fullName || '').trim() || 'کاربر بهدون',
          isRegistered: true,
        };
      }
    }
  } catch {}

  // ۲. بررسی اطلاعات ثبت‌شده در چت قبلی
  const chatPhoneRaw = localStorage.getItem(PHONE_KEY);
  if (chatPhoneRaw) {
    const cleanPhone = normalizeDigits(chatPhoneRaw).replace(/\D/g, '');
    if (/^09\d{9}$/.test(cleanPhone)) {
      const chatName = localStorage.getItem(NAME_KEY) || localStorage.getItem(LEGACY_NAME_KEY) || 'کاربر بهدون';
      return {
        phone: cleanPhone,
        name: chatName.trim() || 'کاربر بهدون',
        isRegistered: false,
      };
    }
  }

  return null;
}

function getChatToken(): string {
  let token = localStorage.getItem(TOKEN_KEY) || localStorage.getItem(LEGACY_TOKEN_KEY);
  if (!token) {
    token = crypto.randomUUID();
    localStorage.setItem(TOKEN_KEY, token);
  }
  return token;
}

export function renderChatButton(_settings?: SiteSettings): string {
  return '';
}

export function renderChatPanel(): string {
  return `
    <div class="chat-widget-panel" id="chat-widget-panel" hidden>
      <!-- هدر شیک و تمیز چت -->
      <div class="chat-widget-header">
        <div class="chat-widget-header-info">
          <div class="chat-header-avatar-circle" id="chat-header-avatar-box">
            <span class="icon">${icons.chat}</span>
            <span class="chat-header-online-dot" title="پشتیبانی آنلاین"></span>
          </div>
          <div class="chat-header-titles">
            <span class="chat-header-title" id="chat-widget-header-title">${pick('پشتیبانی برخط بهدون', 'Behdoon Live Support')}</span>
            <span class="chat-header-sub" id="chat-widget-header-sub">🟢 آنلاین • پاسخگویی سریع</span>
          </div>
        </div>
        <button type="button" class="chat-widget-close" id="chat-widget-close" aria-label="${pick('بستن', 'Close')}">
          ${icons.close}
        </button>
      </div>

      <!-- کارت اجباری دریافت نام و شماره برای کاربران ثبت‌نام نکرده -->
      <div class="chat-widget-onboarding" id="chat-widget-onboarding" hidden>
        <div class="chat-onboarding-icon">
          <span class="icon">${icons.chat}</span>
        </div>
        <h3 class="chat-onboarding-title">${pick('ثبت مشخصات جهت شروع گفتگو', 'Enter Info to Start Chat')}</h3>
        <p class="chat-onboarding-desc">${pick('جهت برقراری ارتباط با کارشناس و پیگیری پیام‌ها، لطفاً نام و شماره همراه خود را وارد کنید:', 'Please enter your name and mobile phone to connect with support:')}</p>
        <form class="chat-onboarding-form" id="chat-onboarding-form">
          <div class="chat-onboarding-field">
            <label for="chat-onboarding-name">${pick('نام و نام خانوادگی', 'Full Name')}</label>
            <input type="text" id="chat-onboarding-name" required placeholder="${pick('نام و نام خانوادگی شما', 'Your full name')}" autocomplete="name" />
          </div>
          <div class="chat-onboarding-field">
            <label for="chat-onboarding-phone">${pick('شماره همراه (الزامی)', 'Mobile Phone (Required)')}</label>
            <input type="tel" id="chat-onboarding-phone" required dir="ltr" inputmode="numeric" maxlength="11" placeholder="09123456789" autocomplete="tel" />
          </div>
          <p class="chat-onboarding-error" id="chat-onboarding-error" hidden></p>
          <button type="submit" class="chat-onboarding-btn">
            <span>${pick('تأیید و ورود به گفتگو', 'Confirm and Start Chat')}</span>
            <span class="icon">${icons.telegram}</span>
          </button>
        </form>
      </div>

      <!-- کالبد اصلی چت -->
      <div class="chat-widget-body" id="chat-widget-body">
        <!-- نوار نمایش هویت کاربر ثبت‌نام کرده / مشخصات جاری -->
        <div class="chat-customer-info-bar" id="chat-customer-info-bar"></div>

        <!-- پیام‌ها -->
        <div class="chat-widget-messages" id="chat-widget-messages"></div>
        <p class="chat-widget-notice" id="chat-widget-notice" hidden></p>

        <!-- نوار ورودی پایین -->
        <form class="chat-widget-input-row" id="chat-widget-form">
          <input type="file" accept="image/*" id="chat-widget-image-input" hidden />
          <div class="chat-widget-input-box">
            <input type="text" id="chat-widget-input" placeholder="${pick('پیام خود را بنویسید...', 'Type your message...')}" autocomplete="off" />
            <button type="button" class="chat-widget-attach-btn" id="chat-widget-attach-btn" title="${pick('ارسال عکس', 'Send photo')}">
              <span class="icon">${icons.image}</span>
            </button>
            <button type="button" class="chat-widget-location-btn" id="chat-widget-location-btn" title="${pick('ارسال موقعیت مکانی', 'Send location')}">
              <span class="icon">${icons.pin}</span>
            </button>
          </div>
          <button type="submit" class="chat-widget-send" aria-label="${pick('ارسال پیام', 'Send message')}">
            <span class="icon">${icons.telegram}</span>
          </button>
        </form>
      </div>
    </div>
  `;
}

export function renderChatWidget(settings?: SiteSettings): string {
  const chatMode = (settings?.contact as any)?.chatDisplayMode || 'header';
  if (chatMode === 'hidden') return '';
  return renderChatPanel();
}

export function initChatWidget(): void {
  const toggleBtns = document.querySelectorAll('.chat-widget-toggle, #chat-widget-toggle');
  const closeBtn = document.getElementById('chat-widget-close');
  const panel = document.getElementById('chat-widget-panel');
  const headerAvatarBox = document.getElementById('chat-header-avatar-box');
  const headerTitle = document.getElementById('chat-widget-header-title');
  const headerSub = document.getElementById('chat-widget-header-sub');
  const onboardingEl = document.getElementById('chat-widget-onboarding');
  const onboardingForm = document.getElementById('chat-onboarding-form') as HTMLFormElement | null;
  const onboardingNameInput = document.getElementById('chat-onboarding-name') as HTMLInputElement | null;
  const onboardingPhoneInput = document.getElementById('chat-onboarding-phone') as HTMLInputElement | null;
  const onboardingError = document.getElementById('chat-onboarding-error');
  const bodyEl = document.getElementById('chat-widget-body');
  const customerInfoBar = document.getElementById('chat-customer-info-bar');
  const messagesEl = document.getElementById('chat-widget-messages');
  const form = document.getElementById('chat-widget-form') as HTMLFormElement | null;
  const input = document.getElementById('chat-widget-input') as HTMLInputElement | null;
  const notice = document.getElementById('chat-widget-notice');
  const attachBtn = document.getElementById('chat-widget-attach-btn') as HTMLButtonElement | null;
  const imageInput = document.getElementById('chat-widget-image-input') as HTMLInputElement | null;
  const locationBtn = document.getElementById('chat-widget-location-btn') as HTMLButtonElement | null;

  if (
    !toggleBtns.length ||
    !closeBtn ||
    !panel ||
    !headerAvatarBox ||
    !headerTitle ||
    !headerSub ||
    !onboardingEl ||
    !onboardingForm ||
    !onboardingNameInput ||
    !onboardingPhoneInput ||
    !onboardingError ||
    !bodyEl ||
    !customerInfoBar ||
    !messagesEl ||
    !form ||
    !input ||
    !notice ||
    !attachBtn ||
    !imageInput ||
    !locationBtn
  )
    return;

  const token = getChatToken();
  let pollTimer: number | undefined;
  let isOpen = false;
  let noticeTimer: number | undefined;

  function showNotice(message: string): void {
    notice!.textContent = message;
    notice!.hidden = false;
    if (noticeTimer !== undefined) window.clearTimeout(noticeTimer);
    noticeTimer = window.setTimeout(() => {
      notice!.hidden = true;
    }, 4000);
  }

  function showOnboardingError(msg: string): void {
    onboardingError!.textContent = msg;
    onboardingError!.hidden = false;
  }

  function updateCustomerInfoBar(info: { name: string; phone: string; isRegistered: boolean }): void {
    customerInfoBar!.innerHTML = `
      <div class="chat-identity-badge">
        <span class="chat-identity-icon">${icons.user}</span>
        <span class="chat-identity-text">
          ${info.isRegistered ? '<span class="chat-user-status-tag">عضو سایت</span>' : ''}
          <span>گفتگو به عنوان: <strong>${escapeHtml(info.name)}</strong></span>
          <span class="chat-identity-phone" dir="ltr">(${toPersianDigits(info.phone)})</span>
        </span>
        ${!info.isRegistered ? `<button type="button" class="chat-identity-edit-btn" id="chat-identity-edit-btn" title="ویرایش اطلاعات">ویرایش</button>` : ''}
      </div>
    `;

    const editBtn = document.getElementById('chat-identity-edit-btn');
    editBtn?.addEventListener('click', () => {
      onboardingEl!.hidden = false;
      bodyEl!.hidden = true;
      onboardingNameInput!.value = info.name;
      onboardingPhoneInput!.value = info.phone;
      onboardingNameInput!.focus();
    });
  }

  function checkCustomerState(): boolean {
    // ۱. اولویت اول: بررسی کاربر وارد شده به حساب کاربری سایت
    try {
      const registered = getLocalCustomerInfo();
      if (registered && registered.phone) {
        const cleanPhone = normalizeDigits(registered.phone).replace(/\D/g, '');
        if (/^09\d{9}$/.test(cleanPhone)) {
          const fullName = String(registered.fullName || '').trim() || 'کاربر بهدون';
          localStorage.setItem(NAME_KEY, fullName);
          localStorage.setItem(PHONE_KEY, cleanPhone);
          onboardingEl!.hidden = true;
          bodyEl!.hidden = false;
          updateCustomerInfoBar({ name: fullName, phone: cleanPhone, isRegistered: true });
          return true;
        }
      }
    } catch {}

    // ۲. بررسی اطلاعات ثبت شده قبلی چت
    const stored = getStoredCustomer();
    if (stored && stored.phone && /^09\d{9}$/.test(stored.phone) && stored.name.trim().length >= 2) {
      onboardingEl!.hidden = true;
      bodyEl!.hidden = false;
      updateCustomerInfoBar({ name: stored.name, phone: stored.phone, isRegistered: stored.isRegistered });
      return true;
    }

    // در غیر این صورت، فرم اجباری وارد کردن نام و شماره نمایش داده می‌شود
    onboardingEl!.hidden = false;
    bodyEl!.hidden = true;
    return false;
  }

  function renderMessages(messages: ChatMessage[]): void {
    if (!messages.length) {
      messagesEl!.innerHTML = `<p class="chat-widget-empty">${pick('پیامی هنوز ثبت نشده است؛ اولین پیام خود را ارسال فرمایید!', 'No messages yet — send the first one!')}</p>`;
      return;
    }
    const wasNearBottom = messagesEl!.scrollHeight - messagesEl!.scrollTop - messagesEl!.clientHeight < 60;
    messagesEl!.innerHTML = messages
      .map((m) => {
        const isStaff = m.sender === 'staff';
        const isAutoReply = m.type === 'auto_reply';
        const staffLabel = m.staffName ?? pick('پشتیبانی بهدون', 'Support');

        return `
          <div class="chat-bubble ${isStaff ? 'chat-bubble-staff' : 'chat-bubble-customer'} ${isAutoReply ? 'chat-bubble-auto-reply' : ''}">
            ${
              isStaff
                ? `<div class="chat-bubble-author">
                    ${avatarHtml(staffLabel, m.staffAvatar)}
                    <span>${escapeHtml(staffLabel)}</span>
                    ${isAutoReply ? '<span class="chat-auto-tag">پیام خودکار</span>' : ''}
                  </div>`
                : ''
            }
            <div class="chat-bubble-content">
              ${renderMessageBody(m)}
            </div>
            <span class="chat-bubble-time">${formatTelegramTime(m.createdAt)}</span>
          </div>
        `;
      })
      .join('');
    if (wasNearBottom) messagesEl!.scrollTop = messagesEl!.scrollHeight;
  }

  function renderHeader(assignedStaff: AssignedStaff | null): void {
    if (assignedStaff && assignedStaff.name) {
      headerAvatarBox!.innerHTML = `
        ${avatarHtml(assignedStaff.name, assignedStaff.avatarUrl)}
        <span class="chat-header-online-dot" title="پاسخگو آنلاین"></span>
      `;
      headerTitle!.innerHTML = `
        <span class="chat-responder-badge">
          <span>پاسخگوی شما:</span>
          <strong>${escapeHtml(assignedStaff.name)}</strong>
        </span>
      `;
      headerSub!.textContent = '🟢 هم‌اکنون آنلاین و پاسخگوی شما';
    } else {
      headerAvatarBox!.innerHTML = `
        <span class="icon">${icons.chat}</span>
        <span class="chat-header-online-dot" title="پشتیبانی آنلاین"></span>
      `;
      headerTitle!.textContent = pick('پشتیبانی برخط بهدون', 'Behdoon Live Support');
      headerSub!.textContent = '🟢 آنلاین • معمولاً پاسخگویی سریع است';
    }
  }

  async function load(): Promise<void> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/chat/${token}`);
      const body = await res.json().catch(() => ({}));
      renderMessages((body?.messages ?? []) as ChatMessage[]);
      renderHeader((body?.conversation?.assignedStaff ?? null) as AssignedStaff | null);
    } catch {
      /* polling will retry */
    }
  }

  const isMobileFullScreen = (): boolean => window.matchMedia('(max-width: 768px)').matches;

  function openPanel(): void {
    isOpen = true;
    panel!.hidden = false;
    toggleBtns.forEach((b) => b.setAttribute('aria-expanded', 'true'));
    const drawer = document.getElementById('mobile-nav-drawer');
    const backdrop = document.getElementById('mobile-nav-backdrop');
    if (drawer) drawer.hidden = true;
    if (backdrop) backdrop.hidden = true;
    if (isMobileFullScreen()) document.body.style.overflow = 'hidden';

    const hasCustomer = checkCustomerState();
    if (hasCustomer) {
      void load();
      if (pollTimer === undefined) pollTimer = window.setInterval(() => void load(), POLL_MS);
      input?.focus();
    } else {
      onboardingNameInput?.focus();
    }
  }

  function closePanel(): void {
    isOpen = false;
    panel!.hidden = true;
    toggleBtns.forEach((b) => b.setAttribute('aria-expanded', 'false'));
    document.body.style.overflow = '';
    if (pollTimer !== undefined) {
      window.clearInterval(pollTimer);
      pollTimer = undefined;
    }
  }

  toggleBtns.forEach((b) =>
    b.addEventListener('click', (e) => {
      e.stopPropagation();
      isOpen ? closePanel() : openPanel();
    }),
  );
  closeBtn.addEventListener('click', closePanel);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) {
      closePanel();
    }
  });

  document.addEventListener('click', (e) => {
    if (!isOpen) return;
    const target = e.target as HTMLElement;
    if (panel!.contains(target)) return;
    for (const b of toggleBtns) {
      if (b.contains(target)) return;
    }
    closePanel();
  });

  onboardingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    onboardingError!.hidden = true;
    const name = onboardingNameInput!.value.trim();
    let phone = normalizeDigits(onboardingPhoneInput!.value).replace(/[\s\-_]/g, '');

    if (name.length < 2) {
      showOnboardingError(pick('لطفاً نام و نام خانوادگی خود را کامل وارد کنید.', 'Please enter your full name.'));
      return;
    }

    if (phone.startsWith('+98')) phone = '0' + phone.slice(3);
    if (phone.startsWith('98') && phone.length === 12) phone = '0' + phone.slice(2);
    if (phone.startsWith('9') && phone.length === 10) phone = '0' + phone;

    if (!/^09\d{9}$/.test(phone)) {
      showOnboardingError(pick('شماره همراه باید ۱۱ رقمی و با ۰۹ آغاز شود (مانند ۰۹۱۲۳۴۵۶۷۸۹).', 'Please enter a valid 11-digit mobile number.'));
      return;
    }

    localStorage.setItem(NAME_KEY, name);
    localStorage.setItem(PHONE_KEY, phone);

    onboardingEl!.hidden = true;
    bodyEl!.hidden = false;
    updateCustomerInfoBar({ name, phone, isRegistered: false });

    void load();
    if (pollTimer === undefined) pollTimer = window.setInterval(() => void load(), POLL_MS);
    input?.focus();
  });

  async function sendMessage(payload: Record<string, unknown>): Promise<boolean> {
    const customer = getStoredCustomer();
    if (!customer || !customer.phone || !/^09\d{9}$/.test(customer.phone)) {
      onboardingEl!.hidden = false;
      bodyEl!.hidden = true;
      onboardingNameInput?.focus();
      showOnboardingError(pick('پیش از ارسال پیام، لطفاً نام و شماره همراه خود را وارد کنید.', 'Please enter your name and phone number before sending messages.'));
      return false;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/chat/${token}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: customer.name,
          customerPhone: customer.phone,
          ...payload,
        }),
      });
      if (!res.ok) {
        showNotice(pick('ارسال پیام ناموفق بود. لطفاً دوباره تلاش کنید.', 'Failed to send message. Please try again.'));
        return false;
      }
      await load();
      return true;
    } catch {
      showNotice(pick('عدم برقراری ارتباط با سرور چت.', 'Could not connect to chat server.'));
      return false;
    }
  }

  attachBtn.addEventListener('click', () => imageInput.click());

  imageInput.addEventListener('change', async () => {
    const file = imageInput.files?.[0];
    imageInput.value = '';
    if (!file) return;
    attachBtn.disabled = true;
    try {
      const uploadRes = await fetch(`${API_BASE_URL}/api/chat/${token}/upload`, {
        method: 'POST',
        headers: { 'Content-Type': file.type },
        body: file,
      });
      if (!uploadRes.ok) {
        showNotice(pick('ارسال تصویر ناموفق بود.', 'Sending the image failed.'));
        return;
      }
      const { url } = (await uploadRes.json()) as { url: string };
      const ok = await sendMessage({ type: 'image', text: url });
      if (!ok) showNotice(pick('ارسال تصویر ناموفق بود.', 'Sending the image failed.'));
    } catch {
      showNotice(pick('ارسال تصویر ناموفق بود.', 'Sending the image failed.'));
    } finally {
      attachBtn.disabled = false;
    }
  });

  locationBtn.addEventListener('click', () => {
    if (!navigator.geolocation) {
      showNotice(pick('مرورگر شما از ارسال موقعیت پشتیبانی نمی‌کند.', 'Your browser does not support sharing location.'));
      return;
    }
    locationBtn.disabled = true;
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const ok = await sendMessage({ type: 'location', lat: position.coords.latitude, lng: position.coords.longitude });
        if (!ok) showNotice(pick('ارسال موقعیت ناموفق بود.', 'Sending the location failed.'));
        locationBtn.disabled = false;
      },
      () => {
        showNotice(pick('دسترسی به موقعیت مکانی رد شد یا در دسترس نیست.', 'Location access was denied or is unavailable.'));
        locationBtn.disabled = false;
      },
      { enableHighAccuracy: true, timeout: 8000 },
    );
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const text = input!.value.trim();
    if (!text) return;
    input!.value = '';
    const ok = await sendMessage({ text });
    if (!ok) {
      input!.value = text;
    }
  });
}
