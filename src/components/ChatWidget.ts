import { icons } from './icons.ts';
import { pick } from '../i18n/lang.ts';
import { API_BASE_URL } from '../data/config.ts';
import { toPersianDigits } from '../utils/jalali.ts';

const TOKEN_KEY = 'behdoon_chat_token';
const LEGACY_TOKEN_KEY = 'behbar_chat_token';
const NAME_KEY = 'behdoon_chat_name';
const LEGACY_NAME_KEY = 'behbar_chat_name';
const POLL_MS = 4000;

interface ChatMessage {
  id: number;
  sender: 'customer' | 'staff';
  staffName: string | null;
  staffAvatar: string | null;
  text: string;
  type: 'text' | 'image' | 'location';
  createdAt: string;
}

interface AssignedStaff {
  name: string;
  avatarUrl: string | null;
}

function messageTimeLabel(createdAt: string): string {
  const d = new Date(createdAt);
  if (Number.isNaN(d.getTime())) return '';
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return toPersianDigits(`${hh}:${mm}`);
}

function avatarHtml(name: string, avatarUrl: string | null): string {
  if (avatarUrl) return `<img class="chat-avatar" src="${avatarUrl}" alt="${name}" />`;
  return `<span class="chat-avatar chat-avatar-fallback">${(name.trim().charAt(0) || '؟')}</span>`;
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
      /* malformed — fall through to empty href, link stays inert */
    }
    if (!mapHref) return `<p>${pick('موقعیت نامعتبر', 'Invalid location')}</p>`;
    return `<a class="chat-bubble-location" href="${mapHref}" target="_blank" rel="noopener"><span class="icon">${icons.pin}</span><span>${pick('مشاهده موقعیت روی نقشه', 'View location on map')}</span></a>`;
  }
  return `<p>${m.text.replace(/</g, '&lt;')}</p>`;
}

function getChatToken(): string {
  let token = localStorage.getItem(TOKEN_KEY) || localStorage.getItem(LEGACY_TOKEN_KEY);
  if (!token) {
    token = crypto.randomUUID();
    localStorage.setItem(TOKEN_KEY, token);
  }
  return token;
}

export function renderChatWidget(): string {
  return `
    <button type="button" class="chat-widget-button" id="chat-widget-toggle" aria-label="${pick('چت با پشتیبانی', 'Chat with support')}" aria-expanded="false">
      <span class="chat-widget-icon-wrap">
        <span class="icon">${icons.chat}</span>
      </span>
      <span class="chat-widget-label">${pick('پیام برخط با پشتیبانی', 'Live chat with support')}</span>
    </button>
    <div class="chat-widget-panel" id="chat-widget-panel" hidden>
      <div class="chat-widget-header">
        <div class="chat-widget-header-info">
          <span id="chat-widget-header-avatar" hidden></span>
          <span id="chat-widget-header-title">${pick('گفتگو با پشتیبانی بهدون', 'Chat with Behdoon support')}</span>
        </div>
        <button type="button" class="chat-widget-close" id="chat-widget-close" aria-label="${pick('بستن', 'Close')}">
          <span class="icon">${icons.close}</span>
        </button>
      </div>
      <div class="chat-widget-messages" id="chat-widget-messages"></div>
      <p class="chat-widget-notice" id="chat-widget-notice" hidden></p>
      <form class="chat-widget-input-row" id="chat-widget-form">
        <input type="file" accept="image/*" id="chat-widget-image-input" hidden />
        <button type="button" class="chat-widget-attach-btn" id="chat-widget-attach-btn" aria-label="${pick('ارسال عکس', 'Send photo')}">
          <span class="icon">${icons.image}</span>
        </button>
        <button type="button" class="chat-widget-location-btn" id="chat-widget-location-btn" aria-label="${pick('ارسال موقعیت', 'Send location')}">
          <span class="icon">${icons.pin}</span>
        </button>
        <input type="text" id="chat-widget-input" placeholder="${pick('پیام خود را بنویسید...', 'Type your message...')}" autocomplete="off" />
        <button type="submit" class="chat-widget-send" aria-label="${pick('ارسال', 'Send')}">
          <span class="icon">${icons.telegram}</span>
        </button>
      </form>
    </div>
  `;
}

export function initChatWidget(): void {
  const toggleBtn = document.getElementById('chat-widget-toggle');
  const closeBtn = document.getElementById('chat-widget-close');
  const panel = document.getElementById('chat-widget-panel');
  const headerAvatar = document.getElementById('chat-widget-header-avatar');
  const headerTitle = document.getElementById('chat-widget-header-title');
  const messagesEl = document.getElementById('chat-widget-messages');
  const form = document.getElementById('chat-widget-form') as HTMLFormElement | null;
  const input = document.getElementById('chat-widget-input') as HTMLInputElement | null;
  const notice = document.getElementById('chat-widget-notice');
  const attachBtn = document.getElementById('chat-widget-attach-btn') as HTMLButtonElement | null;
  const imageInput = document.getElementById('chat-widget-image-input') as HTMLInputElement | null;
  const locationBtn = document.getElementById('chat-widget-location-btn') as HTMLButtonElement | null;
  if (
    !toggleBtn ||
    !closeBtn ||
    !panel ||
    !headerAvatar ||
    !headerTitle ||
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

  function renderMessages(messages: ChatMessage[]): void {
    if (!messages.length) {
      messagesEl!.innerHTML = `<p class="chat-widget-empty">${pick('پیامی هنوز ثبت نشده؛ اولین پیام را بفرستید!', 'No messages yet — send the first one!')}</p>`;
      return;
    }
    const wasNearBottom = messagesEl!.scrollHeight - messagesEl!.scrollTop - messagesEl!.clientHeight < 40;
    messagesEl!.innerHTML = messages
      .map((m, i) => {
        const staffLabel = m.staffName ?? pick('پشتیبانی', 'Support');
        // پیام‌های پیاپی از یک فرستنده (مثل تلگرام) چسبیده‌تر به هم نمایش داده می‌شوند و نام/آواتار
        // فقط روی اولین پیام آن گروه تکرار می‌شود، نه هر حباب.
        const prev = messages[i - 1];
        const grouped = prev?.sender === m.sender;
        return `
      <div class="chat-bubble chat-bubble-${m.sender}${grouped ? ' chat-bubble-grouped' : ''}">
        ${m.sender === 'staff' && !grouped ? `<span class="chat-bubble-author">${avatarHtml(staffLabel, m.staffAvatar)}<span>${staffLabel}</span></span>` : ''}
        ${renderMessageBody(m)}
        <span class="chat-bubble-time">${messageTimeLabel(m.createdAt)}</span>
      </div>
    `;
      })
      .join('');
    if (wasNearBottom) messagesEl!.scrollTop = messagesEl!.scrollHeight;
  }

  function renderHeader(assignedStaff: AssignedStaff | null): void {
    if (assignedStaff) {
      headerAvatar!.hidden = false;
      headerAvatar!.innerHTML = avatarHtml(assignedStaff.name, assignedStaff.avatarUrl);
      headerTitle!.textContent = assignedStaff.name;
    } else {
      headerAvatar!.hidden = true;
      headerAvatar!.innerHTML = '';
      headerTitle!.textContent = pick('گفتگو با پشتیبانی بهدون', 'Chat with Behdoon support');
    }
  }

  async function load(): Promise<void> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/chat/${token}`);
      const body = await res.json().catch(() => ({}));
      renderMessages((body?.messages ?? []) as ChatMessage[]);
      renderHeader((body?.conversation?.assignedStaff ?? null) as AssignedStaff | null);
    } catch {
      /* silent — polling will retry */
    }
  }

  const isMobileFullScreen = (): boolean => window.matchMedia('(max-width: 768px)').matches;

  function openPanel(): void {
    isOpen = true;
    panel!.hidden = false;
    toggleBtn!.setAttribute('aria-expanded', 'true');
    // روی موبایل چت یک صفحه‌ی کامل و مستقل است -- مثل باز شدن یک صفحه‌ی جدید، پشتش نباید اسکرول شود.
    if (isMobileFullScreen()) document.body.style.overflow = 'hidden';
    void load();
    if (pollTimer === undefined) pollTimer = window.setInterval(() => void load(), POLL_MS);
  }

  function closePanel(): void {
    isOpen = false;
    panel!.hidden = true;
    toggleBtn!.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    if (pollTimer !== undefined) {
      window.clearInterval(pollTimer);
      pollTimer = undefined;
    }
  }

  toggleBtn.addEventListener('click', () => (isOpen ? closePanel() : openPanel()));
  closeBtn.addEventListener('click', closePanel);

  async function sendMessage(payload: Record<string, unknown>): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/chat/${token}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerName: localStorage.getItem(NAME_KEY) || localStorage.getItem(LEGACY_NAME_KEY) || undefined, ...payload }),
      });
      if (!res.ok) return false;
      await load();
      return true;
    } catch {
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
    await sendMessage({ text });
  });
}
