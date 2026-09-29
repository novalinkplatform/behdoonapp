import { icons } from '../components/icons.ts';
import {
  fetchChatConversations,
  fetchChatMessages,
  sendChatMessage,
  updateChatConversationStatus,
  assignChatConversation,
  archiveChatConversation,
  deleteChatConversation,
  fetchChatAgents,
  fetchRequestsByPhone,
  fetchRequestById,
  updateRequestStatus,
  assignRequest,
  fetchProviders,
} from '../utils/api.ts';
import type { ChatConversation, ChatMessage, ChatAgent, OrderRecord, ProviderRecord } from '../utils/api.ts';
import { getStaff } from '../utils/auth.ts';
import { toPersianDigits, formatToman } from '../utils/format.ts';
import { STATUS_LABELS } from '../data/status.ts';
import { API_BASE_URL } from '../data/config.ts';
import {
  formatTelegramTime,
  formatTelegramDatePill,
  formatTelegramConversationDate,
} from '../utils/jalali.ts';
import { openAdminInvoiceModal } from '../utils/invoice.ts';

const POLL_MS = 4000;

let activeIntervalId: number | undefined;

type Filter = 'all' | 'mine' | 'unassigned' | 'archived';

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

const TG_AVATAR_GRADIENTS = [
  'linear-gradient(135deg, #ef4444, #dc2626)', // Red
  'linear-gradient(135deg, #f97316, #ea580c)', // Orange
  'linear-gradient(135deg, #f59e0b, #d97706)', // Amber
  'linear-gradient(135deg, #10b981, #059669)', // Emerald
  'linear-gradient(135deg, #06b6d4, #0891b2)', // Cyan
  'linear-gradient(135deg, #3b82f6, #2563eb)', // Blue
  'linear-gradient(135deg, #6366f1, #4f46e5)', // Indigo
  'linear-gradient(135deg, #8b5cf6, #7c3aed)', // Purple
  'linear-gradient(135deg, #ec4899, #db2777)', // Pink
];

function getTelegramAvatarGradient(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = (hash << 5) - hash + str.charCodeAt(i);
  const idx = Math.abs(hash) % TG_AVATAR_GRADIENTS.length;
  return TG_AVATAR_GRADIENTS[idx];
}

function avatarHtml(
  name: string | null,
  avatarUrl: string | null,
  size: 'sm' | 'md' | 'lg' = 'sm',
  isOnline = false,
): string {
  const label = (name || 'کاربر').trim();
  const initial = label.charAt(0) || 'ک';
  const cls = `tg-avatar tg-avatar-${size}`;
  const onlineDot = isOnline ? `<span class="tg-avatar-online-dot" title="آنلاین"></span>` : '';
  if (avatarUrl) {
    return `
      <div class="${cls}">
        <img src="${avatarUrl}" alt="${escapeHtml(label)}" loading="lazy" />
        ${onlineDot}
      </div>
    `;
  }
  const bg = getTelegramAvatarGradient(label);
  return `
    <div class="${cls}" style="background: ${bg};">
      <span>${escapeHtml(initial)}</span>
      ${onlineDot}
    </div>
  `;
}

function conversationPreviewText(c: ChatConversation): string {
  if (c.lastMessageType === 'image') return '📷 تصویر ارسالی';
  if (c.lastMessageType === 'location') return '📍 موقعیت مکانی';
  return c.lastMessage || 'گفتگوی جدید آغاز شد';
}

function renderMessageBody(m: ChatMessage): string {
  if (m.type === 'image') {
    const src = `${API_BASE_URL}${m.text}`;
    return `
      <div class="tg-msg-media-wrap">
        <a href="${src}" target="_blank" rel="noopener">
          <img class="tg-msg-image" src="${src}" alt="تصویر ارسالی" loading="lazy" />
        </a>
      </div>
    `;
  }
  if (m.type === 'location') {
    let mapHref = '';
    try {
      const pos = JSON.parse(m.text) as { lat?: unknown; lng?: unknown };
      if (typeof pos.lat === 'number' && typeof pos.lng === 'number') {
        mapHref = `https://www.google.com/maps?q=${pos.lat},${pos.lng}`;
      }
    } catch {
      /* malformed */
    }
    if (!mapHref) return `<p class="tg-msg-text">📍 موقعیت مکانی نامعتبر</p>`;
    return `
      <a class="tg-msg-location-card" href="${mapHref}" target="_blank" rel="noopener">
        <span class="tg-loc-icon">${icons.pin}</span>
        <div class="tg-loc-details">
          <strong>موقعیت مکانی ثبت‌شده</strong>
          <span>مشاهده مستقیم روی نقشه گوگل</span>
        </div>
      </a>
    `;
  }
  return `<p class="tg-msg-text">${escapeHtml(m.text)}</p>`;
}

export function renderChatView(): string {
  return `
    <div class="view-header tg-view-top-header">
      <div class="view-header-title">
        <h1>مرکز پیام و پشتیبانی برخط بهدون</h1>
        <span class="chat-header-badge">سیستم مکاتبات هوشمند و بررسی لحظه‌ای سفارش‌ها</span>
      </div>
    </div>
    <p class="error-text" id="chat-error" hidden></p>

    <!-- کانتینر اصلی برنامه چت سبک تلگرام وب -->
    <div class="tg-app-container">
      
      <!-- ۱. ستون گفتگوها (Telegram Sidebar) -->
      <aside class="tg-sidebar" id="tg-sidebar">
        <!-- جعبه جستجو -->
        <div class="tg-search-bar">
          <div class="tg-search-input-wrap">
            <span class="tg-search-icon">${icons.seo}</span>
            <input type="text" id="chat-search-input" placeholder="جستجوی نام یا شماره همراه..." autocomplete="off" />
          </div>
        </div>

        <!-- تب‌های پوشه‌ای تلگرام -->
        <nav class="tg-tabs-nav" id="chat-filter-tabs" aria-label="فیلتر گفتگوها">
          <button type="button" class="tg-tab-btn is-active" data-filter="all">همه</button>
          <button type="button" class="tg-tab-btn" data-filter="mine">پاسخگوی من</button>
          <button type="button" class="tg-tab-btn" data-filter="unassigned">بدون پاسخگو</button>
          <button type="button" class="tg-tab-btn" data-filter="archived">بایگانی</button>
        </nav>

        <!-- فهرست گفتگوها -->
        <div class="tg-dialogs-list" id="chat-conversation-list" role="region" aria-label="لیست گفتگوها"></div>
      </aside>

      <!-- ۲. پنجره اصلی چت (Telegram Chat Area) -->
      <main class="tg-main-chat" id="chat-thread">
        <!-- حالت بدون انتخاب گفتگو -->
        <div class="tg-empty-state" id="chat-thread-empty">
          <div class="tg-empty-badge">
            <span class="icon">${icons.telegram}</span>
          </div>
          <h3>گفتگویی انتخاب نشده است</h3>
          <p>از ستون سمت راست یک گفتگو را انتخاب کنید تا پیام‌ها، مشخصات مشتری و سفارش‌های او نمایش داده شود.</p>
        </div>

        <!-- حالت گفتگوی فعال -->
        <div class="tg-thread-active" id="chat-thread-active" hidden>
          <!-- هدر گفتگو به سبک تلگرام وب -->
          <header class="tg-thread-header">
            <div class="tg-header-lead">
              <button type="button" class="tg-btn-back-list" id="chat-back-mobile-btn" title="بازگشت به فهرست گفتگوها" aria-label="بازگشت">
                ${icons.arrowRight}
              </button>
              <div class="tg-header-avatar" id="chat-thread-avatar-wrap"></div>
              <div class="tg-header-meta">
                <div class="tg-header-name-row">
                  <h2 id="chat-thread-name"></h2>
                  <span class="tg-status-tag" id="chat-thread-status-badge"></span>
                </div>
                <div class="tg-header-sub-row">
                  <span class="tg-header-online-text" id="chat-thread-online-status">🟢 آنلاین</span>
                  <span class="tg-bullet">•</span>
                  <span id="chat-thread-phone-wrap"></span>
                  <span class="tg-assigned-hero-badge" id="chat-thread-assigned-tag" hidden></span>
                </div>
              </div>
            </div>

            <!-- دکمه‌ها و ابزارهای بالای چت -->
            <div class="tg-header-tools">
              <!-- دکمه برجسته بررسی سفارش‌ها -->
              <button type="button" class="tg-header-order-btn" id="chat-header-orders-btn" title="بررسی سفارش‌های کاربر">
                <span class="icon">${icons.fileText}</span>
                <span class="label">بررسی سفارش‌ها</span>
                <span class="badge" id="chat-header-orders-count">۰</span>
              </button>

              <!-- تغییر پاسخگو -->
              <div class="tg-assign-box" title="تعیین پاسخگوی گفتگو">
                <select class="tg-assign-select" id="chat-assign-select"></select>
              </div>

              <!-- تغییر وضعیت و عملیات -->
              <button type="button" class="tg-header-action-btn" id="chat-thread-status-btn" title="تغییر وضعیت گفتگو"></button>
              <button type="button" class="tg-header-action-btn" id="chat-thread-archive-btn" title="بایگانی یا خروج"></button>
              <button type="button" class="tg-header-action-btn tg-btn-trash" id="chat-thread-delete-btn" title="حذف گفتگو">
                ${icons.trash}
              </button>

              <!-- سوییچ باز/بستن پنل کناری مشتری -->
              <button type="button" class="tg-header-action-btn tg-btn-drawer is-active" id="chat-drawer-toggle-btn" title="نمایش/عدم‌نمایش سفارش‌ها و مشخصات کاربر">
                ${icons.user}
              </button>
            </div>
          </header>

          <!-- نوار پاسخگویان چندگانه -->
          <div class="tg-responders-strip" id="chat-responders-row" hidden></div>

          <!-- بوم پیام‌ها (Messages Scroll Area) -->
          <div class="tg-messages-viewport" id="chat-thread-messages"></div>

          <!-- نوار پایین نوشتن پیام سبک تلگرام -->
          <footer class="tg-composer-footer">
            <form class="tg-composer-form" id="chat-thread-form">
              <div class="tg-composer-bar">
                <button type="button" class="tg-btn-attach" id="chat-quick-templates-btn" title="قالب‌های پاسخ سریع">
                  ${icons.paperclip}
                </button>
                <textarea id="chat-thread-input" rows="1" placeholder="پیام خود را بنویسید... (Enter جهت ارسال سریع، Shift+Enter خط جدید)" autocomplete="off"></textarea>
                <button type="submit" class="tg-btn-send" id="chat-send-btn" title="ارسال پیام">
                  <span class="icon">${icons.telegram}</span>
                </button>
              </div>
              <div class="tg-composer-meta">
                <span class="tg-kbd-tip">💡 ارسال سریع با <strong>Enter</strong> | خط جدید با <strong>Shift + Enter</strong></span>
              </div>
            </form>
          </footer>
        </div>
      </main>

      <!-- ۳. ستون سوم: پنل اطلاعات مشتری و سفارش‌ها (Telegram Info Drawer) -->
      <aside class="tg-drawer" id="chat-info-panel">
        <div class="tg-drawer-top">
          <div class="tg-drawer-heading">
            <span class="icon">${icons.user}</span>
            <span>مشخصات و سفارش‌های کاربر</span>
          </div>
          <button type="button" class="tg-drawer-close" id="chat-drawer-close-btn" aria-label="بستن پنل">✕</button>
        </div>
        <div class="tg-drawer-body" id="chat-request-card"></div>
      </aside>

    </div>

    <!-- مودال اختصاصی بررسی و مدیریت سفارش از داخل چت -->
    <div class="chat-modal-overlay" id="chat-order-inspect-modal" hidden>
      <div class="chat-modal-container chat-inspect-modal">
        <div class="chat-modal-header">
          <div class="chat-inspect-header-title">
            <span class="chat-inspect-icon">${icons.fileText}</span>
            <div>
              <h3 id="chat-inspect-title">بررسی و مدیریت سفارش</h3>
              <p id="chat-inspect-subtitle" class="chat-inspect-sub"></p>
            </div>
          </div>
          <button type="button" class="chat-modal-close-btn" id="chat-inspect-close" aria-label="بستن">✕</button>
        </div>
        <div class="chat-modal-body" id="chat-inspect-body"></div>
      </div>
    </div>
  `;
}

export function initChatView(): void {
  const errorEl = document.getElementById('chat-error');
  const filterTabs = document.getElementById('chat-filter-tabs');
  const searchInput = document.getElementById('chat-search-input') as HTMLInputElement | null;
  const listEl = document.getElementById('chat-conversation-list');
  const threadEmpty = document.getElementById('chat-thread-empty');
  const threadActive = document.getElementById('chat-thread-active');
  const backMobileBtn = document.getElementById('chat-back-mobile-btn');
  const avatarWrap = document.getElementById('chat-thread-avatar-wrap');
  const nameEl = document.getElementById('chat-thread-name');
  const statusBadge = document.getElementById('chat-thread-status-badge');
  const onlineStatusEl = document.getElementById('chat-thread-online-status');
  const phoneWrap = document.getElementById('chat-thread-phone-wrap');
  const assignedTagEl = document.getElementById('chat-thread-assigned-tag');
  const headerOrdersBtn = document.getElementById('chat-header-orders-btn') as HTMLButtonElement | null;
  const headerOrdersCount = document.getElementById('chat-header-orders-count');
  const assignSelect = document.getElementById('chat-assign-select') as HTMLSelectElement | null;
  const statusBtn = document.getElementById('chat-thread-status-btn') as HTMLButtonElement | null;
  const archiveBtn = document.getElementById('chat-thread-archive-btn') as HTMLButtonElement | null;
  const deleteBtn = document.getElementById('chat-thread-delete-btn') as HTMLButtonElement | null;
  const drawerToggleBtn = document.getElementById('chat-drawer-toggle-btn') as HTMLButtonElement | null;
  const drawerCloseBtn = document.getElementById('chat-drawer-close-btn') as HTMLButtonElement | null;
  const respondersRow = document.getElementById('chat-responders-row');
  const infoPanel = document.getElementById('chat-info-panel');
  const requestCard = document.getElementById('chat-request-card');
  const messagesEl = document.getElementById('chat-thread-messages');
  const form = document.getElementById('chat-thread-form') as HTMLFormElement | null;
  const input = document.getElementById('chat-thread-input') as HTMLTextAreaElement | null;
  const quickTemplatesBtn = document.getElementById('chat-quick-templates-btn');

  // عناصر مودال بررسی سفارش
  const inspectModal = document.getElementById('chat-order-inspect-modal') as HTMLElement | null;
  const inspectTitle = document.getElementById('chat-inspect-title') as HTMLElement | null;
  const inspectSubtitle = document.getElementById('chat-inspect-subtitle') as HTMLElement | null;
  const inspectClose = document.getElementById('chat-inspect-close') as HTMLButtonElement | null;
  const inspectBody = document.getElementById('chat-inspect-body') as HTMLElement | null;

  if (
    !errorEl ||
    !filterTabs ||
    !listEl ||
    !threadEmpty ||
    !threadActive ||
    !nameEl ||
    !phoneWrap ||
    !assignSelect ||
    !statusBtn ||
    !archiveBtn ||
    !deleteBtn ||
    !respondersRow ||
    !infoPanel ||
    !requestCard ||
    !messagesEl ||
    !form ||
    !input
  ) {
    return;
  }

  const me = getStaff();
  let conversations: ChatConversation[] = [];
  let currentLinkedRequests: OrderRecord[] = [];
  let agents: ChatAgent[] = [];
  let activeId: number | null = null;
  let filter: Filter = 'all';
  let searchQuery = '';
  let drawerVisible = true;

  function visibleConversations(): ChatConversation[] {
    let list = conversations;
    if (filter === 'archived') {
      list = list.filter((c) => c.archivedAt !== null);
    } else {
      const notArchived = list.filter((c) => c.archivedAt === null);
      if (filter === 'mine') list = notArchived.filter((c) => c.assignedStaffId === me?.id);
      else if (filter === 'unassigned') list = notArchived.filter((c) => c.assignedStaffId === null);
      else list = notArchived;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(
        (c) =>
          (c.customerName || '').toLowerCase().includes(q) ||
          (c.customerPhone || '').toLowerCase().includes(q) ||
          (c.lastMessage || '').toLowerCase().includes(q),
      );
    }

    return list;
  }

  function renderList(): void {
    const visible = visibleConversations();
    listEl!.innerHTML = visible.length
      ? visible
          .map((c) => {
            const isActive = c.id === activeId;
            const timeFormatted = formatTelegramConversationDate(c.lastMessageAt || c.createdAt);
            const isOpen = c.status === 'open';
            const customerName = c.customerName || 'کاربر مهمان';
            const preview = conversationPreviewText(c);

            return `
              <div class="tg-dialog-item ${isActive ? 'is-active' : ''}" data-conversation-id="${c.id}" role="button" tabindex="0">
                <div class="tg-dialog-avatar">
                  ${avatarHtml(customerName, null, 'md', isOpen)}
                </div>
                <div class="tg-dialog-main">
                  <div class="tg-dialog-row-top">
                    <span class="tg-dialog-name">${escapeHtml(customerName)}</span>
                    <span class="tg-dialog-time">${timeFormatted}</span>
                  </div>
                  <div class="tg-dialog-row-mid">
                    <p class="tg-dialog-snippet">${escapeHtml(preview)}</p>
                  </div>
                  <div class="tg-dialog-row-bottom">
                    <span class="tg-pill-status ${isOpen ? 'status-open' : 'status-closed'}">
                      ${isOpen ? '🟢 باز' : '⚪ پایان'}
                    </span>
                    ${c.unreadCount > 0 ? `<span class="tg-badge-unread">${toPersianDigits(c.unreadCount)}</span>` : ''}
                    <div class="tg-dialog-assigned">
                      ${
                        c.assignedStaffId
                          ? `<span class="tg-assigned-agent" title="پاسخگوی گفتگو: ${escapeHtml(c.assignedStaffName ?? '')}">${avatarHtml(c.assignedStaffName, c.assignedStaffAvatar, 'sm')}<span>${escapeHtml(c.assignedStaffName ?? '')}</span></span>`
                          : `<span class="tg-unassigned-tag">بدون پاسخگو</span>`
                      }
                    </div>
                  </div>
                </div>
                <button type="button" class="tg-dialog-delete-btn" data-delete-conversation="${c.id}" title="حذف این گفتگو" aria-label="حذف">
                  ${icons.close}
                </button>
              </div>
            `;
          })
          .join('')
      : '<div class="tg-empty-list"><span class="icon">🔍</span><p>گفتگویی مطابق فیلتر یافت نشد.</p></div>';

    listEl!.querySelectorAll<HTMLElement>('[data-conversation-id]').forEach((row) => {
      row.addEventListener('click', (event) => {
        if ((event.target as HTMLElement).closest('[data-delete-conversation]')) return;
        selectConversation(Number(row.dataset.conversationId));
      });
      row.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          selectConversation(Number(row.dataset.conversationId));
        }
      });
    });

    listEl!.querySelectorAll<HTMLButtonElement>('[data-delete-conversation]').forEach((btn) => {
      btn.addEventListener('click', async (event) => {
        event.stopPropagation();
        const id = Number(btn.dataset.deleteConversation);
        if (!window.confirm('آیا از حذف کامل این گفتگو اطمینان دارید؟')) return;
        btn.disabled = true;
        try {
          await deleteChatConversation(id);
          if (activeId === id) {
            activeId = null;
            threadActive!.hidden = true;
            threadEmpty!.hidden = false;
            infoPanel!.hidden = true;
          }
          await loadConversations();
        } catch (err) {
          errorEl!.hidden = false;
          errorEl!.textContent = err instanceof Error ? err.message : 'حذف گفتگو ناموفق بود.';
          btn.disabled = false;
        }
      });
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      searchQuery = searchInput.value;
      renderList();
    });
  }

  function renderAssignSelect(active: ChatConversation | undefined): void {
    const options = [
      `<option value="">-- بدون پاسخگو --</option>`,
      ...agents.map(
        (a) =>
          `<option value="${a.id}" ${a.id === active?.assignedStaffId ? 'selected' : ''}>${escapeHtml(a.fullName)}${a.id === me?.id ? ' (من)' : ''}</option>`,
      ),
    ];
    assignSelect!.innerHTML = options.join('');
    if (!active?.assignedStaffId) assignSelect!.value = '';
  }

  async function loadAgents(): Promise<void> {
    try {
      agents = await fetchChatAgents();
    } catch {
      /* ignore */
    }
  }

  let previousTotalUnread = -1;
  let isFirstLoad = true;

  function playTelegramChime(): void {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, now);
      gain1.gain.setValueAtTime(0.12, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.22);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(880, now + 0.08);
      gain2.gain.setValueAtTime(0.15, now + 0.08);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.08);
      osc2.stop(now + 0.35);
    } catch {}
  }

  async function loadConversations(): Promise<void> {
    try {
      conversations = await fetchChatConversations();
      renderList();

      const totalUnread = conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);
      if (!isFirstLoad && previousTotalUnread !== -1 && totalUnread > previousTotalUnread) {
        playTelegramChime();
      }
      previousTotalUnread = totalUnread;
      isFirstLoad = false;

      if (totalUnread > 0) {
        document.title = `(${toPersianDigits(totalUnread)}) پیام جدید | چت بهدون`;
      } else {
        document.title = 'مرکز پشتیبانی و پیام بهدون';
      }

      if (activeId !== null) {
        const active = conversations.find((c) => c.id === activeId);
        if (active) {
          updateHeaderInfo(active);
        }
      }
    } catch (err) {
      errorEl!.hidden = false;
      errorEl!.textContent = err instanceof Error ? err.message : 'خطا در بارگذاری گفتگوها.';
    }
  }

  function updateHeaderInfo(c: ChatConversation): void {
    nameEl!.textContent = c.customerName || 'کاربر مهمان';
    const isOpen = c.status === 'open';

    if (avatarWrap) {
      avatarWrap.innerHTML = avatarHtml(c.customerName || 'مهمان', null, 'md', isOpen);
    }

    if (statusBadge) {
      statusBadge.className = `tg-status-tag ${isOpen ? 'status-open' : 'status-closed'}`;
      statusBadge.textContent = isOpen ? '🟢 فعال' : '⚪ پایان‌یافته';
    }

    if (onlineStatusEl) {
      onlineStatusEl.textContent = isOpen ? 'آنلاین' : 'پایان‌یافته';
      onlineStatusEl.className = `tg-header-online-text ${isOpen ? 'is-online' : 'is-offline'}`;
    }

    if (phoneWrap) {
      phoneWrap.innerHTML = c.customerPhone
        ? `<a href="tel:${escapeHtml(c.customerPhone)}" class="tg-phone-link" dir="ltr" title="تماس مستقیم با کاربر">${icons.phone} <span>${escapeHtml(c.customerPhone)}</span></a>`
        : `<span class="tg-no-phone">بدون شماره تماس</span>`;
    }

    if (assignedTagEl) {
      if (c.assignedStaffName) {
        assignedTagEl.hidden = false;
        assignedTagEl.innerHTML = `پاسخگوی شما: <strong>${escapeHtml(c.assignedStaffName)}</strong>`;
      } else {
        assignedTagEl.hidden = true;
        assignedTagEl.innerHTML = '';
      }
    }

    statusBtn!.textContent = isOpen ? 'بستن گفتگو' : 'بازکردن گفتگو';
    archiveBtn!.textContent = c.archivedAt ? 'خروج از بایگانی' : 'بایگانی';
    renderAssignSelect(c);
  }

  function renderMessages(messages: ChatMessage[]): void {
    const activeConversation = conversations.find((c) => c.id === activeId);
    const customerLabel = activeConversation?.customerName || 'کاربر مهمان';

    let lastDatePill = '';
    const itemsHtml: string[] = [];

    for (const m of messages) {
      const datePill = formatTelegramDatePill(m.createdAt);
      if (datePill !== lastDatePill) {
        itemsHtml.push(`
          <div class="tg-date-divider-wrap">
            <span class="tg-date-divider-pill">${escapeHtml(datePill)}</span>
          </div>
        `);
        lastDatePill = datePill;
      }

      const isStaff = m.sender === 'staff';
      const timeStr = formatTelegramTime(m.createdAt);
      const ticksHtml = isStaff
        ? `<span class="tg-msg-status" title="ارسال شده">${icons.doubleCheck}</span>`
        : '';

      itemsHtml.push(`
        <div class="tg-msg-row ${isStaff ? 'is-out' : 'is-in'}">
          <div class="tg-bubble ${isStaff ? 'tg-bubble-out' : 'tg-bubble-in'}">
            ${
              isStaff
                ? `<div class="tg-bubble-author tg-author-staff">
                     <span class="tg-author-badge">پاسخگو:</span>
                     <strong>${escapeHtml(m.staffName || 'پشتیبان بهدون')}</strong>
                   </div>`
                : `<div class="tg-bubble-author tg-author-customer">
                     <strong>${escapeHtml(customerLabel)}</strong>
                   </div>`
            }
            <div class="tg-bubble-content">
              ${renderMessageBody(m)}
            </div>
            <div class="tg-bubble-meta">
              <span class="tg-msg-time">${timeStr}</span>
              ${ticksHtml}
            </div>
          </div>
        </div>
      `);
    }

    messagesEl!.innerHTML = itemsHtml.join('');
    messagesEl!.scrollTop = messagesEl!.scrollHeight;
    renderResponders(messages);
  }

  function renderResponders(messages: ChatMessage[]): void {
    const distinct: { name: string; avatar: string | null }[] = [];
    const seenNames = new Set<string>();
    for (const m of messages) {
      if (m.sender !== 'staff' || !m.staffName || seenNames.has(m.staffName)) continue;
      seenNames.add(m.staffName);
      distinct.push({ name: m.staffName, avatar: m.staffAvatar });
    }
    if (!distinct.length) {
      respondersRow!.hidden = true;
      respondersRow!.innerHTML = '';
      return;
    }
    respondersRow!.hidden = false;
    respondersRow!.innerHTML =
      '<span class="tg-responders-lead">کارشناسان پاسخگو:</span>' +
      distinct
        .map(
          (r) => `
        <span class="tg-responder-chip">
          ${avatarHtml(r.name, r.avatar, 'sm')}
          <span>${escapeHtml(r.name)}</span>
        </span>
      `,
        )
        .join('');
  }

  async function loadActiveMessages(): Promise<void> {
    if (activeId === null) return;
    try {
      const messages = await fetchChatMessages(activeId);
      renderMessages(messages);
    } catch (err) {
      errorEl!.hidden = false;
      errorEl!.textContent = err instanceof Error ? err.message : 'خطا در بارگذاری پیام‌ها.';
    }
  }

  async function openOrderInspectModal(orderId: number): Promise<void> {
    if (!inspectModal || !inspectBody) return;
    inspectModal.hidden = false;
    inspectBody.innerHTML = `
      <div class="chat-inspect-loading">
        <span class="chat-spinner"></span>
        <span>در حال بارگذاری جزئیات کامل سفارش...</span>
      </div>
    `;

    try {
      const [order, providers] = await Promise.all([
        fetchRequestById(orderId),
        fetchProviders().catch(() => [] as ProviderRecord[]),
      ]);

      if (inspectTitle) inspectTitle.textContent = `بررسی سفارش #${toPersianDigits(order.trackingCode)}`;
      if (inspectSubtitle) inspectSubtitle.textContent = `${order.serviceLabel} — مشتری: ${order.customerName || 'کاربر مهمان'}`;

      function renderInspectContent(curOrder: OrderRecord) {
        inspectBody!.innerHTML = `
          <div class="chat-inspect-content">
            <!-- نوار وضعیت و فرم تغییر وضعیت -->
            <div class="chat-inspect-card chat-inspect-status-box">
              <div class="chat-inspect-status-row">
                <div class="chat-inspect-current-status">
                  <span class="chat-inspect-label">وضعیت فعلی سفارش:</span>
                  <span class="order-status-pill status-${curOrder.status}">${escapeHtml(STATUS_LABELS[curOrder.status] ?? curOrder.status)}</span>
                </div>
                <div class="chat-inspect-track">
                  <span class="chat-inspect-label">کد رهگیری:</span>
                  <span class="tracking-pill" dir="ltr">#${toPersianDigits(curOrder.trackingCode)}</span>
                </div>
              </div>

              <form class="chat-inspect-form" id="chat-inspect-status-form">
                <label for="chat-inspect-status-select"><strong>تغییر وضعیت سفارش:</strong></label>
                <div class="chat-inspect-inline-row">
                  <select id="chat-inspect-status-select" class="chat-select">
                    <option value="submitted" ${curOrder.status === 'submitted' ? 'selected' : ''}>ثبت شده (در انتظار بررسی اولیه)</option>
                    <option value="under_review" ${curOrder.status === 'under_review' ? 'selected' : ''}>در حال بررسی کارشناس</option>
                    <option value="provider_assigned" ${curOrder.status === 'provider_assigned' ? 'selected' : ''}>تخصیص یافته به متخصص</option>
                    <option value="scheduled" ${curOrder.status === 'scheduled' ? 'selected' : ''}>زمان‌بندی و هماهنگ‌شده</option>
                    <option value="in_progress" ${curOrder.status === 'in_progress' ? 'selected' : ''}>در حال انجام کار در محل</option>
                    <option value="completed" ${curOrder.status === 'completed' ? 'selected' : ''}>تکمیل شده و تحویل نهایی</option>
                    <option value="cancelled" ${curOrder.status === 'cancelled' ? 'selected' : ''}>لغو شده</option>
                  </select>
                  <button type="submit" class="chat-btn-save-status">ثبت تغییر وضعیت</button>
                </div>
                <p class="chat-inspect-msg" id="chat-inspect-status-msg" hidden></p>
              </form>
            </div>

            <!-- مشخصات مشتری، آدرس و خدمت -->
            <div class="chat-inspect-grid">
              <div class="chat-inspect-card">
                <h4>${icons.user} مشخصات مشتری و موقعیت</h4>
                <div class="chat-inspect-meta-list">
                  <div class="chat-inspect-meta-item">
                    <span>نام مشتری:</span>
                    <strong>${escapeHtml(curOrder.customerName || 'کاربر مهمان')}</strong>
                  </div>
                  <div class="chat-inspect-meta-item">
                    <span>شماره همراه:</span>
                    <a href="tel:${escapeHtml(curOrder.phone)}" class="chat-customer-call-btn" dir="ltr">${icons.phone} ${escapeHtml(curOrder.phone)}</a>
                  </div>
                  <div class="chat-inspect-meta-item">
                    <span>شهر و منطقه:</span>
                    <strong>${escapeHtml(curOrder.originCity || 'تهران')}${curOrder.originDistrict ? ` — محله ${escapeHtml(curOrder.originDistrict)}` : ''}</strong>
                  </div>
                  <div class="chat-inspect-meta-item">
                    <span>آدرس و توضیحات:</span>
                    <p class="chat-inspect-address-text">${escapeHtml(curOrder.originNotes || 'آدرس متنی درج نشده است.')}</p>
                  </div>
                  ${
                    curOrder.originFloor
                      ? `
                  <div class="chat-inspect-meta-item">
                    <span>طبقه / آسانسور:</span>
                    <span>طبقه ${toPersianDigits(curOrder.originFloor)} ${curOrder.originElevator ? '(دارای آسانسور)' : '(بدون آسانسور)'}</span>
                  </div>`
                      : ''
                  }
                </div>
              </div>

              <div class="chat-inspect-card">
                <h4>${icons.wrench} خدمت و مالی</h4>
                <div class="chat-inspect-meta-list">
                  <div class="chat-inspect-meta-item">
                    <span>خدمت:</span>
                    <strong>${escapeHtml(curOrder.serviceLabel)}</strong>
                  </div>
                  <div class="chat-inspect-meta-item">
                    <span>تاریخ مراجعه:</span>
                    <strong>${escapeHtml(curOrder.scheduledDate || 'امروز')}</strong>
                  </div>
                  <div class="chat-inspect-meta-item">
                    <span>ساعت مراجعه:</span>
                    <strong>${toPersianDigits(curOrder.scheduledTime || 'فوری')}</strong>
                  </div>
                  <div class="chat-inspect-meta-item">
                    <span>سطح فوریت:</span>
                    <span class="chat-urgency-badge ${curOrder.urgency === 'urgent' ? 'is-urgent' : ''}">${curOrder.urgency === 'urgent' ? '⚡ فوری' : 'عادی'}</span>
                  </div>
                  <div class="chat-inspect-meta-item">
                    <span>برآورد اولیه:</span>
                    <strong class="price-val">${formatToman(curOrder.estimateAvg)}</strong>
                  </div>
                  ${
                    (curOrder as any).finalPrice
                      ? `
                  <div class="chat-inspect-meta-item">
                    <span>مبلغ قطعی:</span>
                    <strong class="price-val">${formatToman((curOrder as any).finalPrice)}</strong>
                  </div>`
                      : ''
                  }
                </div>
              </div>
            </div>

            <!-- تخصیص تکنسین / متخصص -->
            <div class="chat-inspect-card">
              <h4>${icons.wrench} تخصیص و هماهنگی متخصص</h4>
              <div class="chat-inspect-meta-list" style="margin-bottom:0.75rem;">
                <div class="chat-inspect-meta-item">
                  <span>متخصص فعال فعلی:</span>
                  <strong>${(curOrder as any).providerName ? `${escapeHtml((curOrder as any).providerName)} (${(curOrder as any).providerPhone ? escapeHtml((curOrder as any).providerPhone) : 'بدون شماره'})` : 'هنوز متخصصی تعیین نشده'}</strong>
                </div>
              </div>
              <form class="chat-inspect-form" id="chat-inspect-assign-form">
                <label for="chat-inspect-provider-select"><strong>انتخاب متخصص از سامانه:</strong></label>
                <div class="chat-inspect-inline-row">
                  <select id="chat-inspect-provider-select" class="chat-select">
                    <option value="">-- فاقد تکنسین (لغو تخصیص) --</option>
                    ${providers
                      .map(
                        (p) => `
                      <option value="${p.id}" ${(curOrder as any).providerId === p.id ? 'selected' : ''}>
                        ${escapeHtml(p.fullName)} - ${escapeHtml(p.phone)} (${escapeHtml(p.city)})
                      </option>
                    `,
                      )
                      .join('')}
                  </select>
                  <button type="submit" class="chat-btn-save-assign">ثبت تکنسین</button>
                </div>
                <p class="chat-inspect-msg" id="chat-inspect-assign-msg" hidden></p>
              </form>
            </div>

            <!-- ابزارهای فاکتور و ارسال پیام در چت -->
            <div class="chat-inspect-card chat-inspect-footer-actions">
              <h4>عملیات تکمیلی</h4>
              <div class="chat-inspect-buttons-row">
                <button type="button" class="chat-btn-modal-action chat-btn-invoice" id="chat-btn-inspect-invoice">
                  <span class="icon">${icons.fileText}</span>
                  <span>مشاهده و چاپ فاکتور تفکیکی بهدون</span>
                </button>
                <button type="button" class="chat-btn-modal-action chat-btn-chat-update" id="chat-btn-inspect-chat-update">
                  <span class="icon">${icons.telegram}</span>
                  <span>ارسال خلاصه وضعیت در چت کاربر</span>
                </button>
              </div>
            </div>
          </div>
        `;

        // Wire up status form
        const statusForm = document.getElementById('chat-inspect-status-form') as HTMLFormElement | null;
        const statusSelect = document.getElementById('chat-inspect-status-select') as HTMLSelectElement | null;
        const statusMsg = document.getElementById('chat-inspect-status-msg') as HTMLElement | null;

        statusForm?.addEventListener('submit', async (e) => {
          e.preventDefault();
          if (!statusSelect) return;
          const newStatus = statusSelect.value;
          const submitBtn = statusForm.querySelector('button[type="submit"]') as HTMLButtonElement | null;
          if (submitBtn) submitBtn.disabled = true;
          try {
            await updateRequestStatus(curOrder.id, newStatus);
            curOrder.status = newStatus;
            if (statusMsg) {
              statusMsg.hidden = false;
              statusMsg.textContent = '✅ وضعیت سفارش با موفقیت به‌روزرسانی شد.';
              statusMsg.className = 'chat-inspect-msg is-success';
            }
            const active = conversations.find((c) => c.id === activeId);
            if (active?.customerPhone) void loadLinkedRequests(active.customerPhone);
            setTimeout(() => {
              renderInspectContent(curOrder);
            }, 600);
          } catch (err: any) {
            if (statusMsg) {
              statusMsg.hidden = false;
              statusMsg.textContent = err.message || 'خطا در ثبت وضعیت.';
              statusMsg.className = 'chat-inspect-msg is-error';
            }
          } finally {
            if (submitBtn) submitBtn.disabled = false;
          }
        });

        // Wire up assign form
        const assignForm = document.getElementById('chat-inspect-assign-form') as HTMLFormElement | null;
        const providerSelect = document.getElementById('chat-inspect-provider-select') as HTMLSelectElement | null;
        const assignMsg = document.getElementById('chat-inspect-assign-msg') as HTMLElement | null;

        assignForm?.addEventListener('submit', async (e) => {
          e.preventDefault();
          if (!providerSelect) return;
          const pVal = providerSelect.value;
          const providerId = pVal ? Number(pVal) : null;
          const submitBtn = assignForm.querySelector('button[type="submit"]') as HTMLButtonElement | null;
          if (submitBtn) submitBtn.disabled = true;
          try {
            await assignRequest(curOrder.id, providerId);
            const foundP = providers.find((p) => p.id === providerId);
            (curOrder as any).providerId = providerId;
            (curOrder as any).providerName = foundP ? foundP.fullName : null;
            (curOrder as any).providerPhone = foundP ? foundP.phone : null;
            if (assignMsg) {
              assignMsg.hidden = false;
              assignMsg.textContent = '✅ تغییر تکنسین با موفقیت انجام شد.';
              assignMsg.className = 'chat-inspect-msg is-success';
            }
            const active = conversations.find((c) => c.id === activeId);
            if (active?.customerPhone) void loadLinkedRequests(active.customerPhone);
            setTimeout(() => {
              renderInspectContent(curOrder);
            }, 600);
          } catch (err: any) {
            if (assignMsg) {
              assignMsg.hidden = false;
              assignMsg.textContent = err.message || 'خطا در تخصیص تکنسین.';
              assignMsg.className = 'chat-inspect-msg is-error';
            }
          } finally {
            if (submitBtn) submitBtn.disabled = false;
          }
        });

        // Wire up invoice button
        const invoiceBtn = document.getElementById('chat-btn-inspect-invoice');
        invoiceBtn?.addEventListener('click', () => {
          openAdminInvoiceModal(curOrder, () => {
            void openOrderInspectModal(curOrder.id);
          });
        });

        // Wire up chat update button
        const chatUpdateBtn = document.getElementById('chat-btn-inspect-chat-update');
        chatUpdateBtn?.addEventListener('click', () => {
          const statusText = STATUS_LABELS[curOrder.status] ?? curOrder.status;
          const providerText = (curOrder as any).providerName ? ` | تکنسین شما: ${(curOrder as any).providerName}` : '';
          const msg = `مشتری گرامی، وضعیت سفارش شما برای «${curOrder.serviceLabel}» با شماره پیگیری #${curOrder.trackingCode} بررسی شد: ${statusText}${providerText}. در صورت نیاز به هرگونه راهنمایی، در همین گفتگو در خدمت شما هستیم.`;
          if (input) {
            input.value = msg;
            input.focus();
            input.style.height = 'auto';
            input.style.height = `${Math.min(input.scrollHeight, 140)}px`;
          }
          if (inspectModal) inspectModal.hidden = true;
        });
      }

      renderInspectContent(order);
    } catch (err: any) {
      inspectBody!.innerHTML = `<p class="chat-inspect-error">دریافت اطلاعات سفارش ناموفق بود: ${escapeHtml(err.message || 'خطای سرور')}</p>`;
    }
  }

  function renderRequestCard(requests: OrderRecord[]): void {
    currentLinkedRequests = requests;
    const active = conversations.find((c) => c.id === activeId);
    const phone = active?.customerPhone;
    const name = active?.customerName || 'کاربر مهمان';

    if (headerOrdersCount) {
      headerOrdersCount.textContent = toPersianDigits(requests.length);
    }

    if (!requests.length) {
      requestCard!.innerHTML = `
        <div class="tg-drawer-user-card">
          <div class="tg-drawer-user-avatar">${avatarHtml(name, null, 'lg')}</div>
          <h3 class="tg-drawer-user-name">${escapeHtml(name)}</h3>
          ${phone ? `<a href="tel:${escapeHtml(phone)}" class="tg-drawer-call-btn" dir="ltr">${icons.phone} <span>تماس با کاربر</span></a>` : ''}
          <div class="tg-drawer-specs">
            <div class="tg-drawer-spec-item">
              <span>وضعیت گفتگو:</span>
              <strong class="${active?.status === 'open' ? 'status-open' : 'status-closed'}">${active?.status === 'open' ? '🟢 باز' : '⚪ پایان‌یافته'}</strong>
            </div>
            <div class="tg-drawer-spec-item">
              <span>شماره همراه:</span>
              <strong dir="ltr">${phone ? escapeHtml(phone) : 'ثبت نشده'}</strong>
            </div>
          </div>
        </div>
        <div class="tg-drawer-orders-section">
          <h4>سفارش‌های کاربر (۰)</h4>
          <div class="tg-drawer-empty-orders">
            <span class="icon">📦</span>
            <p>سفارشی برای این شماره در سامانه ثبت نشده است.</p>
          </div>
        </div>
      `;
      return;
    }

    requestCard!.innerHTML = `
      <div class="tg-drawer-user-card">
        <div class="tg-drawer-user-avatar">${avatarHtml(name, null, 'lg')}</div>
        <h3 class="tg-drawer-user-name">${escapeHtml(name)}</h3>
        ${phone ? `<a href="tel:${escapeHtml(phone)}" class="tg-drawer-call-btn" dir="ltr">${icons.phone} <span>تماس با کاربر</span></a>` : ''}
        <div class="tg-drawer-specs">
          <div class="tg-drawer-spec-item">
            <span>شماره همراه:</span>
            <strong dir="ltr">${phone ? escapeHtml(phone) : 'ثبت نشده'}</strong>
          </div>
          <div class="tg-drawer-spec-item">
            <span>تعداد کل سفارش‌ها:</span>
            <strong>${toPersianDigits(requests.length)} سفارش</strong>
          </div>
        </div>
      </div>
      <div class="tg-drawer-orders-section">
        <div class="tg-drawer-orders-title-row">
          <h4>سفارش‌های ثبت‌شده (${toPersianDigits(requests.length)})</h4>
          <span class="tg-drawer-badge">${toPersianDigits(requests.length)} سفارش</span>
        </div>
        <div class="tg-orders-cards-list">
          ${requests
            .map(
              (r) => `
            <div class="tg-order-card">
              <div class="tg-order-card-header">
                <span class="tracking-pill" dir="ltr">#${toPersianDigits(r.trackingCode)}</span>
                <span class="order-status-pill status-${r.status}">${escapeHtml(STATUS_LABELS[r.status] ?? r.status)}</span>
              </div>
              <strong class="tg-order-service-title">${escapeHtml(r.serviceLabel)}</strong>
              <div class="tg-order-card-specs">
                <div class="tg-order-spec-row">
                  <span>زمان مراجعه:</span>
                  <span>${escapeHtml(r.scheduledDate || 'امروز')} — ${toPersianDigits(r.scheduledTime || 'فوری')}</span>
                </div>
                <div class="tg-order-spec-row">
                  <span>شهر و منطقه:</span>
                  <span>${escapeHtml(r.originCity || 'تهران')}${r.originDistrict ? ` (${escapeHtml(r.originDistrict)})` : ''}</span>
                </div>
                <div class="tg-order-spec-row">
                  <span>برآورد هزینه:</span>
                  <strong class="price-val">${formatToman(r.estimateAvg)}</strong>
                </div>
                <div class="tg-order-spec-row">
                  <span>متخصص:</span>
                  <span>${(r as any).providerName ? escapeHtml((r as any).providerName) : '<span class="tg-no-tech">فاقد تکنسین</span>'}</span>
                </div>
              </div>
              <button type="button" class="tg-btn-inspect-order" data-inspect-order-id="${r.id}">
                <span class="icon">${icons.edit}</span>
                <span>بررسی و مدیریت کامل سفارش</span>
              </button>
            </div>
          `,
            )
            .join('')}
        </div>
      </div>
    `;

    // Attach click listeners to inspect buttons
    requestCard!.querySelectorAll<HTMLButtonElement>('[data-inspect-order-id]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const orderId = Number(btn.dataset.inspectOrderId);
        if (orderId) void openOrderInspectModal(orderId);
      });
    });
  }

  async function loadLinkedRequests(phone: string | null): Promise<void> {
    if (!phone) {
      renderRequestCard([]);
      return;
    }
    try {
      const requests = await fetchRequestsByPhone(phone);
      renderRequestCard(requests);
    } catch {
      requestCard!.innerHTML = `<h3>سفارش‌های کاربر</h3><p class="chat-request-empty">دریافت اطلاعات سفارش‌ها ناموفق بود.</p>`;
    }
  }

  function selectConversation(id: number): void {
    activeId = id;
    threadEmpty!.hidden = true;
    threadActive!.hidden = false;

    // Responsive toggle: on mobile, show chat main
    const appEl = document.querySelector('.tg-app-container');
    if (appEl) appEl.classList.add('mobile-chat-open');

    const c = conversations.find((x) => x.id === id);
    if (c) {
      updateHeaderInfo(c);
    }
    renderList();
    void loadActiveMessages();
    void loadLinkedRequests(c?.customerPhone ?? null);
  }

  // Mobile back button
  backMobileBtn?.addEventListener('click', () => {
    const appEl = document.querySelector('.tg-app-container');
    if (appEl) appEl.classList.remove('mobile-chat-open');
  });

  // Drawer Toggle Button
  drawerToggleBtn?.addEventListener('click', () => {
    drawerVisible = !drawerVisible;
    infoPanel.classList.toggle('is-collapsed', !drawerVisible);
    drawerToggleBtn.classList.toggle('is-active', drawerVisible);
  });

  drawerCloseBtn?.addEventListener('click', () => {
    drawerVisible = false;
    infoPanel.classList.add('is-collapsed');
    drawerToggleBtn?.classList.remove('is-active');
  });

  // Header Orders Button Click Handler
  headerOrdersBtn?.addEventListener('click', () => {
    if (currentLinkedRequests.length === 1) {
      void openOrderInspectModal(currentLinkedRequests[0].id);
    } else {
      // Ensure drawer is open & visible
      drawerVisible = true;
      infoPanel.classList.remove('is-collapsed');
      drawerToggleBtn?.classList.add('is-active');
      if (currentLinkedRequests.length > 0) {
        void openOrderInspectModal(currentLinkedRequests[0].id);
      }
    }
  });

  // Auto-grow textarea
  input.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = `${Math.min(input.scrollHeight, 140)}px`;
  });

  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      form.requestSubmit();
    }
  });

  // Quick templates button
  quickTemplatesBtn?.addEventListener('click', () => {
    const templates = [
      'سلام و احترام، در خدمت شما هستم. چطور می‌توانم کمکتان کنم؟',
      'سفارش شما در سامانه ثبت و به متخصص مربوطه ارجاع داده شد.',
      'متخصص ما به‌زودی جهت هماهنگی با شماره همراه شما تماس خواهد گرفت.',
      'کارشناسان ما هم‌اکنون در حال پیگیری درخواست شما هستند.',
      'در صورت نیاز به راهنمایی بیشتر، پاسخگوی شما در همین گفتگو هستیم.',
    ];
    const picked = window.prompt(
      'یک قالب پاسخ سریع انتخاب کنید یا عدد آن را وارد نمایید:\n' +
        templates.map((t, idx) => `${toPersianDigits(idx + 1)}. ${t}`).join('\n'),
      '1',
    );
    if (picked) {
      const idx = parseInt(picked, 10) - 1;
      if (templates[idx]) {
        input.value = templates[idx];
        input.focus();
        input.style.height = 'auto';
        input.style.height = `${Math.min(input.scrollHeight, 140)}px`;
      }
    }
  });

  filterTabs.querySelectorAll<HTMLButtonElement>('[data-filter]').forEach((tab) => {
    tab.addEventListener('click', () => {
      filter = tab.dataset.filter as Filter;
      filterTabs!.querySelectorAll('[data-filter]').forEach((t) => t.classList.toggle('is-active', t === tab));
      renderList();
    });
  });

  assignSelect.addEventListener('change', async () => {
    if (activeId === null) return;
    const value = assignSelect!.value;
    const staffId = value ? Number(value) : null;
    assignSelect!.disabled = true;
    try {
      await assignChatConversation(activeId, staffId);
      await loadConversations();
    } catch (err) {
      errorEl!.hidden = false;
      errorEl!.textContent = err instanceof Error ? err.message : 'خطایی پیش آمد.';
    } finally {
      assignSelect!.disabled = false;
    }
  });

  statusBtn.addEventListener('click', async () => {
    if (activeId === null) return;
    const c = conversations.find((x) => x.id === activeId);
    const nextStatus = c?.status === 'open' ? 'closed' : 'open';
    try {
      await updateChatConversationStatus(activeId, nextStatus);
      await loadConversations();
    } catch (err) {
      errorEl!.hidden = false;
      errorEl!.textContent = err instanceof Error ? err.message : 'خطایی پیش آمد.';
    }
  });

  archiveBtn.addEventListener('click', async () => {
    if (activeId === null) return;
    const c = conversations.find((x) => x.id === activeId);
    const nextArchived = !c?.archivedAt;
    try {
      await archiveChatConversation(activeId, nextArchived);
      await loadConversations();
    } catch (err) {
      errorEl!.hidden = false;
      errorEl!.textContent = err instanceof Error ? err.message : 'خطایی پیش آمد.';
    }
  });

  deleteBtn.addEventListener('click', async () => {
    if (activeId === null) return;
    if (!window.confirm('این گفتگو برای همیشه حذف شود؟')) return;
    try {
      await deleteChatConversation(activeId);
      activeId = null;
      threadEmpty!.hidden = false;
      threadActive!.hidden = true;
      infoPanel!.hidden = true;
      await loadConversations();
    } catch (err) {
      errorEl!.hidden = false;
      errorEl!.textContent = err instanceof Error ? err.message : 'حذف ناموفق بود.';
    }
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (activeId === null) return;
    const text = input!.value.trim();
    if (!text) return;
    input!.value = '';
    input!.style.height = 'auto';
    try {
      await sendChatMessage(activeId, text);
      await loadActiveMessages();
      await loadConversations();
    } catch (err) {
      errorEl!.hidden = false;
      errorEl!.textContent = err instanceof Error ? err.message : 'ارسال ناموفق بود.';
    }
  });

  // رویدادهای بستن مودال بررسی سفارش
  inspectClose?.addEventListener('click', () => {
    if (inspectModal) inspectModal.hidden = true;
  });
  inspectModal?.addEventListener('click', (e) => {
    if (e.target === inspectModal) inspectModal.hidden = true;
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && inspectModal && !inspectModal.hidden) {
      inspectModal.hidden = true;
    }
  });

  void loadAgents();
  void loadConversations();

  if (activeIntervalId !== undefined) window.clearInterval(activeIntervalId);
  activeIntervalId = window.setInterval(() => {
    void loadConversations();
    if (activeId !== null) void loadActiveMessages();
  }, POLL_MS);
}
