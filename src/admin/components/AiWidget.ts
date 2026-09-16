import { icons } from './icons.ts';
import {
  sendAiChatMessage,
  executeAiAction,
  fetchAiConversations,
  fetchAiConversation,
  createAiConversation,
  deleteAiConversation,
} from '../utils/api.ts';
import type { AiMessage, AiPendingAction, AiConversationSummary } from '../utils/api.ts';

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

const WELCOME_TEXT =
  'سلام! از من درباره‌ی مقاله‌ها، نظرات مشتریان، درخواست‌های همکاری، آمار یا تنظیمات سئو بپرس. برای هر تغییری، قبل از اجرا از تو تأیید می‌گیرم.';

// دستیار هوش مصنوعی یک ویجت شناور است (نه یک صفحه‌ی جدا در ناوبری)، چون در همه‌ی صفحات پنل در
// دسترس می‌ماند؛ اما با کلیک، کل صفحه را می‌گیرد (مثل چت‌جی‌پی‌تی) با یک نوار کناری از گفتگوهای
// جدا و تاریخچه‌ی مستقل هرکدام — نه یک ترد تک و ناپایدار که با رفرش پاک می‌شود.
export function renderAiWidget(): string {
  return `
    <button type="button" class="ai-widget-toggle" id="ai-widget-toggle" aria-label="دستیار هوش مصنوعی">
      <span class="icon">${icons.ai}</span>
    </button>
    <div class="ai-widget-overlay" id="ai-widget-panel" hidden>
      <aside class="ai-widget-sidebar">
        <div class="ai-widget-sidebar-header">
          <button type="button" class="btn btn-primary btn-block" id="ai-widget-new-chat-btn">
            <span class="icon">${icons.plusCircle}</span>
            گفتگوی جدید
          </button>
          <button type="button" class="ai-widget-close ai-widget-mobile-close" id="ai-widget-sidebar-close" aria-label="بستن" title="بستن">
            <span class="icon">${icons.close}</span>
          </button>
        </div>
        <div class="ai-widget-conversation-list" id="ai-widget-conversation-list"></div>
      </aside>
      <div class="ai-widget-main">
        <div class="ai-widget-header">
          <span class="ai-widget-title"><span class="icon">${icons.ai}</span> دستیار هوش مصنوعی</span>
          <button type="button" class="ai-widget-close" id="ai-widget-close" aria-label="بستن" title="بستن">
            <span class="icon">${icons.close}</span>
          </button>
        </div>
        <p class="error-text" id="ai-widget-error" hidden></p>
        <div class="chat-thread ai-widget-thread">
          <div class="chat-thread-messages" id="ai-widget-messages"></div>
          <form class="chat-thread-form" id="ai-widget-form">
            <textarea id="ai-widget-input" rows="1" placeholder="مثلاً: چند مقاله عنوان سئو ندارند؟"></textarea>
            <button type="submit" class="btn btn-primary" id="ai-widget-send-btn">
              <span class="icon">${icons.ai}</span>
              ارسال
            </button>
          </form>
        </div>
      </div>
    </div>
  `;
}

export function initAiWidget(): void {
  const toggleBtn = document.getElementById('ai-widget-toggle');
  const closeBtn = document.getElementById('ai-widget-close');
  const panel = document.getElementById('ai-widget-panel');
  const errorEl = document.getElementById('ai-widget-error');
  const messagesEl = document.getElementById('ai-widget-messages');
  const form = document.getElementById('ai-widget-form') as HTMLFormElement | null;
  const input = document.getElementById('ai-widget-input') as HTMLTextAreaElement | null;
  const sendBtn = document.getElementById('ai-widget-send-btn') as HTMLButtonElement | null;
  const newChatBtn = document.getElementById('ai-widget-new-chat-btn');
  const listEl = document.getElementById('ai-widget-conversation-list');
  if (!toggleBtn || !closeBtn || !panel || !errorEl || !messagesEl || !form || !input || !sendBtn || !newChatBtn || !listEl) return;

  let conversations: AiConversationSummary[] = [];
  let activeId: number | null = null;
  let messages: AiMessage[] = [];
  let pendingAction: AiPendingAction | null = null;
  let loaded = false;

  function showError(err: unknown): void {
    errorEl!.hidden = false;
    errorEl!.textContent = err instanceof Error ? err.message : 'خطایی پیش آمد.';
  }

  function renderConversationList(): void {
    listEl!.innerHTML = conversations.length
      ? conversations
          .map(
            (c) => `
        <div class="ai-widget-conversation-row ${c.id === activeId ? 'is-active' : ''}" data-conversation-id="${c.id}">
          <button type="button" class="ai-widget-conversation-title" data-select-conversation="${c.id}">${escapeHtml(c.title || 'گفتگوی جدید')}</button>
          <button type="button" class="ai-widget-conversation-delete" data-delete-conversation="${c.id}" title="حذف">حذف</button>
        </div>
      `,
          )
          .join('')
      : '<p class="ai-widget-empty-list">هنوز گفتگویی نداری.</p>';
  }

  function renderMessages(): void {
    const bubbles: string[] = [];
    if (!messages.length) {
      bubbles.push(`<div class="chat-bubble-admin chat-bubble-admin-customer"><div class="chat-bubble-body"><p>${escapeHtml(WELCOME_TEXT)}</p></div></div>`);
    }
    for (const m of messages) {
      if (m.role === 'user' && m.content) {
        bubbles.push(`<div class="chat-bubble-admin chat-bubble-admin-staff"><div class="chat-bubble-body"><p>${escapeHtml(m.content)}</p></div></div>`);
      } else if (m.role === 'assistant' && m.content) {
        bubbles.push(`<div class="chat-bubble-admin chat-bubble-admin-customer"><div class="chat-bubble-body"><p>${escapeHtml(m.content)}</p></div></div>`);
      }
    }
    if (pendingAction) {
      bubbles.push(`
        <div class="chat-bubble-admin chat-bubble-admin-customer">
          <div class="chat-bubble-body">
            <p>${escapeHtml(pendingAction.summary)}</p>
            <div class="staff-table-actions" style="margin-top: var(--space-2)">
              <button type="button" class="btn btn-primary btn-sm" id="ai-widget-confirm-btn">تأیید و اجرا</button>
              <button type="button" class="btn btn-ghost btn-sm" id="ai-widget-cancel-btn">لغو</button>
            </div>
          </div>
        </div>
      `);
    }
    messagesEl!.innerHTML = bubbles.join('');
    messagesEl!.scrollTop = messagesEl!.scrollHeight;

    document.getElementById('ai-widget-confirm-btn')?.addEventListener('click', () => void confirmPendingAction());
    document.getElementById('ai-widget-cancel-btn')?.addEventListener('click', cancelPendingAction);
  }

  function setBusy(busy: boolean): void {
    input!.disabled = busy;
    sendBtn!.disabled = busy;
    if (busy) {
      sendBtn!.textContent = 'در حال پاسخ...';
    } else {
      sendBtn!.innerHTML = `<span class="icon">${icons.ai}</span>ارسال`;
    }
  }

  async function selectConversation(id: number): Promise<void> {
    errorEl!.hidden = true;
    pendingAction = null;
    activeId = id;
    renderConversationList();
    try {
      const conv = await fetchAiConversation(id);
      messages = conv.messages;
      renderMessages();
    } catch (err) {
      showError(err);
    }
  }

  async function newChat(): Promise<void> {
    errorEl!.hidden = true;
    try {
      const id = await createAiConversation();
      conversations = [{ id, title: '', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, ...conversations];
      activeId = id;
      messages = [];
      pendingAction = null;
      renderConversationList();
      renderMessages();
      input!.focus();
    } catch (err) {
      showError(err);
    }
  }

  async function ensureLoaded(): Promise<void> {
    if (loaded) return;
    loaded = true;
    try {
      conversations = await fetchAiConversations();
      renderConversationList();
      if (conversations.length) {
        await selectConversation(conversations[0].id);
      } else {
        await newChat();
      }
    } catch (err) {
      showError(err);
    }
  }

  toggleBtn.addEventListener('click', () => {
    panel.hidden = !panel.hidden;
    if (!panel.hidden) {
      void ensureLoaded();
      input.focus();
    }
  });
  const hidePanel = () => {
    panel.hidden = true;
  };

  closeBtn.addEventListener('click', hidePanel);
  document.getElementById('ai-widget-sidebar-close')?.addEventListener('click', hidePanel);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !panel.hidden) {
      hidePanel();
    }
  });

  newChatBtn.addEventListener('click', () => void newChat());

  listEl.addEventListener('click', (event) => {
    const selectBtn = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-select-conversation]');
    if (selectBtn) {
      const id = Number(selectBtn.dataset.selectConversation);
      if (id !== activeId) void selectConversation(id);
      return;
    }
    const deleteBtn = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-delete-conversation]');
    if (deleteBtn) {
      const id = Number(deleteBtn.dataset.deleteConversation);
      if (!window.confirm('این گفتگو برای همیشه حذف شود؟')) return;
      void (async () => {
        try {
          await deleteAiConversation(id);
          conversations = conversations.filter((c) => c.id !== id);
          renderConversationList();
          if (id === activeId) {
            if (conversations.length) await selectConversation(conversations[0].id);
            else await newChat();
          }
        } catch (err) {
          showError(err);
        }
      })();
    }
  });

  async function sendMessage(text: string): Promise<void> {
    if (!activeId) await newChat();
    errorEl!.hidden = true;
    messages = [...messages, { role: 'user', content: text }];
    renderMessages();
    setBusy(true);
    try {
      const res = await sendAiChatMessage(messages, activeId!);
      messages = res.messages;
      pendingAction = res.pendingAction;
      renderMessages();
      // عنوان (از روی اولین پیام) و ترتیب گفتگو در نوار کناری ممکن است تازه تغییر کرده باشد.
      conversations = await fetchAiConversations().catch(() => conversations);
      renderConversationList();
    } catch (err) {
      showError(err);
    } finally {
      setBusy(false);
    }
  }

  async function confirmPendingAction(): Promise<void> {
    if (!pendingAction || !activeId) return;
    errorEl!.hidden = true;
    const action = pendingAction;
    pendingAction = null;
    setBusy(true);
    try {
      const res = await executeAiAction(messages, action, activeId);
      messages = res.messages;
      pendingAction = res.pendingAction;
      renderMessages();
    } catch (err) {
      showError(err);
    } finally {
      setBusy(false);
    }
  }

  function cancelPendingAction(): void {
    if (!pendingAction) return;
    messages = [...messages, { role: 'tool', tool_call_id: pendingAction.toolCallId, content: 'کارمند این اقدام را لغو کرد.' }];
    pendingAction = null;
    renderMessages();
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const text = input!.value.trim();
    if (!text) return;
    input!.value = '';
    void sendMessage(text);
  });

  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      form!.requestSubmit();
    }
  });
}
