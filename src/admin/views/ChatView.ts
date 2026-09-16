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
} from '../utils/api.ts';
import type { ChatConversation, ChatMessage, ChatAgent, OrderRecord } from '../utils/api.ts';
import { getStaff } from '../utils/auth.ts';
import { toPersianDigits, formatToman } from '../utils/format.ts';
import { STATUS_LABELS } from '../data/status.ts';
import { API_BASE_URL } from '../data/config.ts';
import { formatMessageTimestamp } from '../utils/jalali.ts';

const POLL_MS = 5000;

let activeIntervalId: number | undefined;

type Filter = 'all' | 'mine' | 'unassigned' | 'archived';

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function conversationPreviewText(c: ChatConversation): string {
  if (c.lastMessageType === 'image') return '📷 تصویر';
  if (c.lastMessageType === 'location') return '📍 موقعیت مکانی';
  return c.lastMessage || '';
}

function renderMessageBody(m: ChatMessage): string {
  if (m.type === 'image') {
    const src = `${API_BASE_URL}${m.text}`;
    return `<a href="${src}" target="_blank" rel="noopener"><img class="chat-bubble-image" src="${src}" alt="تصویر ارسالی" loading="lazy" /></a>`;
  }
  if (m.type === 'location') {
    let mapHref = '';
    try {
      const pos = JSON.parse(m.text) as { lat?: unknown; lng?: unknown };
      if (typeof pos.lat === 'number' && typeof pos.lng === 'number') mapHref = `https://www.google.com/maps?q=${pos.lat},${pos.lng}`;
    } catch {
      /* malformed — fall through to empty href, link stays inert */
    }
    if (!mapHref) return `<p>موقعیت نامعتبر</p>`;
    return `<a class="chat-bubble-location" href="${mapHref}" target="_blank" rel="noopener"><span class="icon">${icons.pin}</span><span>مشاهده موقعیت روی نقشه</span></a>`;
  }
  return `<p>${escapeHtml(m.text)}</p>`;
}

function avatarHtml(name: string | null, avatarUrl: string | null, size: 'sm' | 'md' = 'sm'): string {
  const label = name ?? '؟';
  const cls = `chat-avatar chat-avatar-${size}`;
  if (avatarUrl) return `<img class="${cls}" src="${avatarUrl}" alt="${escapeHtml(label)}" />`;
  return `<span class="${cls} chat-avatar-fallback">${escapeHtml(label.trim().charAt(0) || '؟')}</span>`;
}

export function renderChatView(): string {
  return `
    <div class="view-header">
      <h1>چت پشتیبانی</h1>
    </div>
    <p class="error-text" id="chat-error" hidden></p>
    <div class="chat-layout">
      <div class="chat-sidebar">
        <div class="chat-filter-tabs" id="chat-filter-tabs">
          <button type="button" class="chat-filter-tab is-active" data-filter="all">همه</button>
          <button type="button" class="chat-filter-tab" data-filter="mine">پاسخگوی من</button>
          <button type="button" class="chat-filter-tab" data-filter="unassigned">بدون پاسخگو</button>
          <button type="button" class="chat-filter-tab" data-filter="archived">بایگانی</button>
        </div>
        <div class="chat-conversation-list" id="chat-conversation-list"></div>
      </div>
      <div class="chat-thread" id="chat-thread">
        <p class="chat-thread-empty" id="chat-thread-empty">یک گفتگو را از فهرست انتخاب کنید.</p>
        <div class="chat-thread-active" id="chat-thread-active" hidden>
          <div class="chat-thread-header">
            <div class="chat-thread-header-info">
              <strong id="chat-thread-name"></strong>
              <span class="chat-thread-phone" id="chat-thread-phone"></span>
              <div class="chat-responders-row" id="chat-responders-row" hidden></div>
            </div>
            <div class="chat-thread-header-actions">
              <select class="chat-assign-select" id="chat-assign-select"></select>
              <button type="button" class="btn btn-secondary btn-sm" id="chat-thread-status-btn"></button>
              <button type="button" class="btn btn-secondary btn-sm" id="chat-thread-archive-btn"></button>
              <button type="button" class="btn btn-ghost btn-sm" id="chat-thread-delete-btn">حذف</button>
            </div>
          </div>
          <div class="chat-thread-messages" id="chat-thread-messages"></div>
          <form class="chat-thread-form" id="chat-thread-form">
            <textarea id="chat-thread-input" rows="1" placeholder="پاسخ خود را بنویسید..."></textarea>
            <button type="submit" class="btn btn-primary">
              <span class="icon">${icons.plusCircle}</span>
              ارسال
            </button>
          </form>
        </div>
      </div>
      <div class="editor-sidebar chat-info-panel" id="chat-info-panel" hidden>
        <div class="editor-sidebar-card" id="chat-request-card"></div>
      </div>
    </div>
  `;
}

export function initChatView(): void {
  const errorEl = document.getElementById('chat-error');
  const filterTabs = document.getElementById('chat-filter-tabs');
  const listEl = document.getElementById('chat-conversation-list');
  const threadEmpty = document.getElementById('chat-thread-empty');
  const threadActive = document.getElementById('chat-thread-active');
  const nameEl = document.getElementById('chat-thread-name');
  const phoneEl = document.getElementById('chat-thread-phone');
  const assignSelect = document.getElementById('chat-assign-select') as HTMLSelectElement | null;
  const statusBtn = document.getElementById('chat-thread-status-btn') as HTMLButtonElement | null;
  const archiveBtn = document.getElementById('chat-thread-archive-btn') as HTMLButtonElement | null;
  const deleteBtn = document.getElementById('chat-thread-delete-btn') as HTMLButtonElement | null;
  const respondersRow = document.getElementById('chat-responders-row');
  const infoPanel = document.getElementById('chat-info-panel');
  const requestCard = document.getElementById('chat-request-card');
  const messagesEl = document.getElementById('chat-thread-messages');
  const form = document.getElementById('chat-thread-form') as HTMLFormElement | null;
  const input = document.getElementById('chat-thread-input') as HTMLTextAreaElement | null;

  if (
    !errorEl ||
    !filterTabs ||
    !listEl ||
    !threadEmpty ||
    !threadActive ||
    !nameEl ||
    !phoneEl ||
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
  let agents: ChatAgent[] = [];
  let activeId: number | null = null;
  let filter: Filter = 'all';

  function visibleConversations(): ChatConversation[] {
    if (filter === 'archived') return conversations.filter((c) => c.archivedAt !== null);
    const notArchived = conversations.filter((c) => c.archivedAt === null);
    if (filter === 'mine') return notArchived.filter((c) => c.assignedStaffId === me?.id);
    if (filter === 'unassigned') return notArchived.filter((c) => c.assignedStaffId === null);
    return notArchived;
  }

  function renderList(): void {
    const visible = visibleConversations();
    listEl!.innerHTML = visible.length
      ? visible
          .map(
            (c) => `
        <div class="chat-conversation-item ${c.id === activeId ? 'is-active' : ''}" data-conversation-id="${c.id}" role="button" tabindex="0">
          <div class="chat-conversation-item-top">
            <span>${escapeHtml(c.customerName || 'مهمان')}</span>
            <span class="chat-conversation-item-top-end">
              <span class="chat-conversation-time">${formatMessageTimestamp(c.lastMessageAt)}</span>
              <button type="button" class="chat-conversation-delete" data-delete-conversation="${c.id}" title="حذف کامل این گفتگو" aria-label="حذف کامل این گفتگو">${icons.close}</button>
            </span>
          </div>
          <p class="chat-conversation-preview">${escapeHtml(conversationPreviewText(c))}</p>
          <div class="chat-conversation-item-bottom">
            <span class="article-status-badge article-status-${c.status === 'open' ? 'published' : 'draft'}">${c.status === 'open' ? 'باز' : 'بسته'}</span>
            ${c.unreadCount > 0 ? `<span class="chat-unread-badge">${toPersianDigits(c.unreadCount)}</span>` : ''}
            <span class="chat-conversation-agent">
              ${
                c.assignedStaffId
                  ? `${avatarHtml(c.assignedStaffName, c.assignedStaffAvatar, 'sm')}<span>${escapeHtml(c.assignedStaffName ?? '')}</span>`
                  : `<span class="chat-conversation-unassigned">بدون پاسخگو</span>`
              }
            </span>
          </div>
        </div>
      `,
          )
          .join('')
      : '<p class="pipeline-empty">گفتگویی در این فهرست نیست.</p>';

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
        if (!window.confirm('این گفتگو برای همیشه حذف شود؟')) return;
        btn.disabled = true;
        try {
          await deleteChatConversation(id);
          if (activeId === id) {
            activeId = null;
            threadActive!.hidden = true;
            threadEmpty!.hidden = false;
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

  function renderAssignSelect(active: ChatConversation | undefined): void {
    const options = [
      `<option value="">بدون پاسخگو</option>`,
      ...agents.map((a) => `<option value="${a.id}" ${a.id === active?.assignedStaffId ? 'selected' : ''}>${escapeHtml(a.fullName)}${a.id === me?.id ? ' (من)' : ''}</option>`),
    ];
    assignSelect!.innerHTML = options.join('');
    if (!active?.assignedStaffId) assignSelect!.value = '';
  }

  async function loadAgents(): Promise<void> {
    try {
      agents = await fetchChatAgents();
    } catch {
      /* اگر دریافت فهرست پشتیبان‌ها ناموفق باشد، فقط واگذاری غیرفعال می‌ماند؛ بقیه‌ی چت کار می‌کند. */
    }
  }

  async function loadConversations(): Promise<void> {
    try {
      conversations = await fetchChatConversations();
      renderList();
      if (activeId !== null) {
        const active = conversations.find((c) => c.id === activeId);
        if (active) {
          nameEl!.textContent = active.customerName || 'مهمان';
          phoneEl!.textContent = active.customerPhone || '';
          statusBtn!.textContent = active.status === 'open' ? 'بستن گفتگو' : 'بازکردن گفتگو';
          archiveBtn!.textContent = active.archivedAt ? 'خروج از بایگانی' : 'بایگانی';
          renderAssignSelect(active);
        }
      }
    } catch (err) {
      errorEl!.hidden = false;
      errorEl!.textContent = err instanceof Error ? err.message : 'خطایی پیش آمد.';
    }
  }

  function renderMessages(messages: ChatMessage[]): void {
    const activeConversation = conversations.find((c) => c.id === activeId);
    const customerLabel = activeConversation?.customerName || 'مهمان';
    messagesEl!.innerHTML = messages
      .map(
        (m) => `
      <div class="chat-bubble-admin chat-bubble-admin-${m.sender}">
        <span class="chat-bubble-author">${
          m.sender === 'staff'
            ? `${avatarHtml(m.staffName, m.staffAvatar, 'sm')}<span>${escapeHtml(m.staffName ?? '')}</span>`
            : `<span>${escapeHtml(customerLabel)}</span>`
        }</span>
        ${renderMessageBody(m)}
        <span class="chat-bubble-timestamp">${formatMessageTimestamp(m.createdAt)}</span>
      </div>
    `,
      )
      .join('');
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
      '<span class="chat-responders-label">پاسخ‌دهندگان:</span>' +
      distinct.map((r) => `<span class="chat-responder-chip">${avatarHtml(r.name, r.avatar, 'sm')}<span>${escapeHtml(r.name)}</span></span>`).join('');
  }

  async function loadActiveMessages(): Promise<void> {
    if (activeId === null) return;
    try {
      const messages = await fetchChatMessages(activeId);
      renderMessages(messages);
    } catch (err) {
      errorEl!.hidden = false;
      errorEl!.textContent = err instanceof Error ? err.message : 'خطایی پیش آمد.';
    }
  }

  function renderRequestCard(requests: OrderRecord[]): void {
    if (!requests.length) {
      requestCard!.innerHTML = `<h3>درخواست‌های ثبت‌شده</h3><p class="chat-request-empty">درخواستی برای این شماره ثبت نشده است.</p>`;
      return;
    }
    const [latest, ...older] = requests;
    requestCard!.innerHTML = `
      <h3>درخواست‌های ثبت‌شده (${toPersianDigits(requests.length)})</h3>
      <div class="chat-request-latest">
        <div class="chat-request-row"><span>کد رهگیری</span><span dir="ltr">#${toPersianDigits(latest.trackingCode)}</span></div>
        <div class="chat-request-row"><span>خدمت</span><span>${escapeHtml(latest.serviceLabel)}</span></div>
        <div class="chat-request-row"><span>مسیر</span><span>${escapeHtml(latest.originCity)} ← ${escapeHtml(latest.destinationCity)}</span></div>
        <div class="chat-request-row"><span>زمان</span><span>${escapeHtml(latest.scheduledDate)} — ${toPersianDigits(latest.scheduledTime)}</span></div>
        <div class="chat-request-row"><span>وضعیت</span><span>${escapeHtml(STATUS_LABELS[latest.status] ?? latest.status)}</span></div>
        <div class="chat-request-row"><span>برآورد هزینه</span><span>${formatToman(latest.estimateAvg)}</span></div>
      </div>
      ${
        older.length
          ? `<div class="chat-request-older"><span>${toPersianDigits(older.length)} درخواست قدیمی‌تر:</span>${older
              .map((o) => `<span class="chat-request-older-item" dir="ltr">#${toPersianDigits(o.trackingCode)}</span>`)
              .join('')}</div>`
          : ''
      }
    `;
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
      requestCard!.innerHTML = `<h3>درخواست‌های ثبت‌شده</h3><p class="chat-request-empty">دریافت اطلاعات ناموفق بود.</p>`;
    }
  }

  function selectConversation(id: number): void {
    activeId = id;
    threadEmpty!.hidden = true;
    threadActive!.hidden = false;
    infoPanel!.hidden = false;
    const c = conversations.find((x) => x.id === id);
    nameEl!.textContent = c?.customerName || 'مهمان';
    phoneEl!.textContent = c?.customerPhone || '';
    statusBtn!.textContent = c?.status === 'open' ? 'بستن گفتگو' : 'بازکردن گفتگو';
    archiveBtn!.textContent = c?.archivedAt ? 'خروج از بایگانی' : 'بایگانی';
    renderAssignSelect(c);
    renderList();
    void loadActiveMessages();
    void loadLinkedRequests(c?.customerPhone ?? null);
  }

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
    try {
      await sendChatMessage(activeId, text);
      await loadActiveMessages();
      await loadConversations();
    } catch (err) {
      errorEl!.hidden = false;
      errorEl!.textContent = err instanceof Error ? err.message : 'ارسال ناموفق بود.';
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
