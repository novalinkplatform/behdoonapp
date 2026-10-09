import { icons } from '../components/icons.ts';
import {
  sendAiChatMessage,
  fetchAiConversations,
  fetchAiConversation,
  createAiConversation,
  deleteAiConversation,
} from '../utils/api.ts';
import type { AiMessage, AiConversationSummary } from '../utils/api.ts';

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function renderMarkdown(text: string): string {
  if (!text) return '';
  let out = escapeHtml(text);

  // 1. Code blocks (```lang\n...\n```)
  out = out.replace(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g, (_match, lang, code) => {
    const l = lang ? lang.trim() : 'کد';
    const cleanCode = code.replace(/^\n+|\n+$/g, '');
    return `<div class="ai-code-block">
      <div class="ai-code-header">
        <span class="ai-code-lang">${l}</span>
        <button type="button" class="ai-copy-code-btn" data-copy-code="${encodeURIComponent(cleanCode)}">
          <span class="icon">${icons.copy}</span>
          <span>کپی کد</span>
        </button>
      </div>
      <pre><code>${cleanCode}</code></pre>
    </div>`;
  });

  // 2. Inline code (`code`)
  out = out.replace(/`([^`\n]+)`/g, '<code class="ai-inline-code">$1</code>');

  // 3. Headings (###, ##, #)
  out = out.replace(/^### (.*$)/gim, '<h4 class="ai-md-h3">$1</h4>');
  out = out.replace(/^## (.*$)/gim, '<h3 class="ai-md-h2">$1</h3>');
  out = out.replace(/^# (.*$)/gim, '<h2 class="ai-md-h1">$1</h2>');

  // 4. Blockquotes (> quote)
  out = out.replace(/^> (.*$)/gim, '<blockquote class="ai-md-quote">$1</blockquote>');

  // 5. Bold (**text**) & Italic (*text*)
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  out = out.replace(/\*([^*]+)\*/g, '<em>$1</em>');

  // 6. Unordered lists (- or * item)
  out = out.replace(/^[\*\-] (.+)$/gim, '<li class="ai-md-li">$1</li>');
  out = out.replace(/(<li class="ai-md-li">[\s\S]*?<\/li>)/gim, '<ul class="ai-md-ul">$1</ul>');
  out = out.replace(/<\/ul>\s*<ul class="ai-md-ul">/g, '');

  // 7. Numbered lists (1. item)
  out = out.replace(/^\d+\. (.+)$/gim, '<li class="ai-md-oli">$1</li>');
  out = out.replace(/(<li class="ai-md-oli">[\s\S]*?<\/li>)/gim, '<ol class="ai-md-ol">$1</ol>');
  out = out.replace(/<\/ol>\s*<ol class="ai-md-ol">/g, '');

  // 8. Paragraphs and linebreaks
  out = out.replace(/\n\n+/g, '</p><p class="ai-md-p">');
  out = out.replace(/\n/g, '<br/>');

  return `<p class="ai-md-p">${out}</p>`
    .replace(/<p class="ai-md-p"><\/p>/g, '')
    .replace(/<p class="ai-md-p">(<div class="ai-code-block">[\s\S]*?<\/div>)<\/p>/g, '$1')
    .replace(/<p class="ai-md-p">(<ul class="ai-md-ul">[\s\S]*?<\/ul>)<\/p>/g, '$1')
    .replace(/<p class="ai-md-p">(<ol class="ai-md-ol">[\s\S]*?<\/ol>)<\/p>/g, '$1')
    .replace(/<p class="ai-md-p">(<h[2-4][^>]*>.*?<\/h[2-4]>)<\/p>/g, '$1')
    .replace(/<p class="ai-md-p">(<blockquote[^>]*>.*?<\/blockquote>)<\/p>/g, '$1');
}

const PROMPT_SUGGESTIONS = [
  {
    title: 'تحلیل سفارش‌ها و درآمد',
    desc: 'وضعیت سفارش‌های امروز و گزارش خط فروش را تحلیل کن',
    prompt: 'وضعیت سفارش‌های امروز، درآمدهای تحقق‌یافته و سفارش‌های نیازمند اقدام فوری را تحلیل و گزارش کن.',
    icon: icons.chart,
  },
  {
    title: 'استعلام و وضعیت تکنسین‌ها',
    desc: 'تکنسین‌های فعال در مناطق تهران و ظرفیت خدمات',
    prompt: 'وضعیت تکنسین‌های فعال پلتفرم، مناطق تحت پوشش آن‌ها در تهران و ظرفیت پذیرش سفارش‌های جدید را بررسی کن.',
    icon: icons.wrench,
  },
  {
    title: 'ایده‌پردازی و سئو وبلاگ',
    desc: '۳ ایده مقاله با تیتر جذاب و کلمات کلیدی برای تأسیسات',
    prompt: '۳ عنوان مقاله کاربردی و سئومحور در حوزه خدمات تأسیسات ساختمانی برای مجله بهدون به همراه کلمات کلیدی هدف پیشنهاد بده.',
    icon: icons.article,
  },
  {
    title: 'پیش‌نویس پیام پشتیبانی',
    desc: 'متن محترمانه برای هماهنگی زمان اعزام متخصص به منزل',
    prompt: 'یک متن پیامک رسمی و محترمانه جهت اعلام اعزام تکنسین به منزل مشتری به همراه کد رهگیری آماده کن.',
    icon: icons.chat,
  },
];

export function renderAiView(): string {
  return `
    <div class="ai-chatgpt-container" id="ai-view-panel">
      <!-- نوار کناری تاریخچه گفتگوها (ChatGPT Sidebar) -->
      <aside class="ai-chatgpt-sidebar" id="ai-chatgpt-sidebar">
        <div class="ai-sidebar-top">
          <button type="button" class="ai-new-chat-btn" id="ai-new-chat-btn">
            <span class="icon">${icons.plusCircle}</span>
            <span>گفتگوی جدید</span>
          </button>
        </div>

        <div class="ai-sidebar-history-header">
          <span>تاریخچه گفتگوها</span>
        </div>

        <div class="ai-sidebar-list" id="ai-conversation-list"></div>

        <div class="ai-sidebar-footer">
          <div class="ai-sidebar-model-badge">
            <span class="ai-model-status-dot"></span>
            <div class="ai-model-info">
              <span class="ai-model-name">هوشواره ۲.۰</span>
              <span class="ai-model-sub">دستیار هوشمند بهدون</span>
            </div>
          </div>
          <button type="button" class="ai-sidebar-settings-btn" id="ai-sidebar-settings-btn" title="تنظیمات هوش مصنوعی (کلیدهای API)">
            <span class="icon">${icons.settings}</span>
            <span>تنظیمات افزونه</span>
          </button>
        </div>
      </aside>

      <!-- بخش اصلی چت (Main Chat Area) -->
      <main class="ai-chatgpt-main">
        <header class="ai-chatgpt-header">
          <div class="ai-header-start">
            <button type="button" class="ai-header-btn ai-sidebar-toggle-btn" id="ai-sidebar-toggle-btn" title="تغییر وضعیت نوار کناری">
              <span class="icon">${icons.sidebarToggle}</span>
            </button>
            <div class="ai-header-title-box">
              <span class="ai-header-title">هوشواره</span>
              <span class="ai-header-badge">دستیار رسمی مدیریت</span>
            </div>
          </div>
          <div class="ai-header-end">
            <button type="button" class="ai-header-btn" id="ai-quick-new-chat-btn" title="گفتگوی تازه">
              <span class="icon">${icons.plusCircle}</span>
              <span class="ai-header-btn-text">گفتگوی جدید</span>
            </button>
            <button type="button" class="ai-header-btn" id="ai-quick-settings-btn" title="تنظیمات افزونه‌ها">
              <span class="icon">${icons.settings}</span>
            </button>
          </div>
        </header>

        <div class="ai-error-banner" id="ai-chat-error" hidden></div>

        <!-- پیام‌ها و جریان چت -->
        <div class="ai-chatgpt-scroll-area" id="ai-scroll-area">
          <div class="ai-chatgpt-thread" id="ai-chat-thread">
            <!-- پیام‌ها یا صفحه خوش‌آمدگویی اینجا تزریق می‌شوند -->
          </div>
        </div>

        <!-- باکس شناور ورودی (ChatGPT Floating Input Bar) -->
        <div class="ai-chatgpt-input-wrapper">
          <form class="ai-chatgpt-input-box" id="ai-chat-form">
            <textarea
              class="ai-chatgpt-textarea"
              id="ai-chat-input"
              rows="1"
              placeholder="از هوشواره بپرسید... (Shift+Enter برای خط جدید)"
              dir="auto"
            ></textarea>
            <button
              type="submit"
              class="ai-chatgpt-send-btn"
              id="ai-chat-send-btn"
              aria-label="ارسال پیام"
              disabled
            >
              <span class="icon">${icons.sendArrow}</span>
            </button>
          </form>
          <div class="ai-chatgpt-disclaimer">
            <span>هوشواره یک دستیار هوش مصنوعی است؛ برای تصمیم‌گیری‌های حیاتی داده‌ها را در پنل بازبینی کنید.</span>
          </div>
        </div>
      </main>
    </div>
  `;
}

export function initAiView(onNavigate?: (screen: string) => void): void {
  const panel = document.getElementById('ai-view-panel');
  const sidebar = document.getElementById('ai-chatgpt-sidebar');
  const sidebarToggleBtn = document.getElementById('ai-sidebar-toggle-btn');
  const errorEl = document.getElementById('ai-chat-error');
  const threadEl = document.getElementById('ai-chat-thread');
  const scrollArea = document.getElementById('ai-scroll-area');
  const form = document.getElementById('ai-chat-form') as HTMLFormElement | null;
  const input = document.getElementById('ai-chat-input') as HTMLTextAreaElement | null;
  const sendBtn = document.getElementById('ai-chat-send-btn') as HTMLButtonElement | null;
  const newChatBtn = document.getElementById('ai-new-chat-btn');
  const quickNewChatBtn = document.getElementById('ai-quick-new-chat-btn');
  const listEl = document.getElementById('ai-conversation-list');
  const sidebarSettingsBtn = document.getElementById('ai-sidebar-settings-btn');
  const quickSettingsBtn = document.getElementById('ai-quick-settings-btn');

  if (!panel || !errorEl || !threadEl || !scrollArea || !form || !input || !sendBtn || !listEl) {
    return;
  }

  let conversations: AiConversationSummary[] = [];
  let activeId: number | null = null;
  let messages: AiMessage[] = [];
  let isBusy = false;
  let isLoaded = false;

  const navigateToSettings = () => {
    if (onNavigate) onNavigate('plugins');
  };
  sidebarSettingsBtn?.addEventListener('click', navigateToSettings);
  quickSettingsBtn?.addEventListener('click', navigateToSettings);

  // تغییر وضعیت نوار کناری (Sidebar collapse toggle)
  sidebarToggleBtn?.addEventListener('click', () => {
    sidebar?.classList.toggle('is-collapsed');
    panel.classList.toggle('sidebar-collapsed');
  });

  function showError(err: unknown): void {
    if (!errorEl) return;
    errorEl.hidden = false;
    errorEl.textContent = err instanceof Error ? err.message : 'خطایی در ارتباط با دستیار رخ داد.';
  }

  function hideError(): void {
    if (!errorEl) return;
    errorEl.hidden = true;
    errorEl.textContent = '';
  }

  function scrollToBottom(smooth = true): void {
    if (!scrollArea) return;
    requestAnimationFrame(() => {
      scrollArea.scrollTo({
        top: scrollArea.scrollHeight,
        behavior: smooth ? 'smooth' : 'auto',
      });
    });
  }

  function updateSendButtonState(): void {
    if (!input || !sendBtn) return;
    const hasText = input.value.trim().length > 0;
    sendBtn.disabled = !hasText || isBusy;
  }

  function adjustTextareaHeight(): void {
    if (!input) return;
    input.style.height = 'auto';
    const newHeight = Math.min(input.scrollHeight, 180);
    input.style.height = `${Math.max(newHeight, 44)}px`;
    updateSendButtonState();
  }

  function renderConversationList(): void {
    if (!listEl) return;
    if (!conversations.length) {
      listEl.innerHTML = '<div class="ai-empty-history">هنوز گفتگویی ایجاد نشده است.</div>';
      return;
    }

    listEl.innerHTML = conversations
      .map((c) => {
        const isActive = c.id === activeId;
        const title = escapeHtml(c.title || 'گفتگوی جدید');
        return `
          <div class="ai-conversation-item ${isActive ? 'is-active' : ''}" data-conv-id="${c.id}">
            <button type="button" class="ai-conversation-item-btn" data-select-conv="${c.id}">
              <span class="icon">${icons.chat}</span>
              <span class="ai-conv-title">${title}</span>
            </button>
            <button type="button" class="ai-conversation-delete-btn" data-delete-conv="${c.id}" title="حذف گفتگو">
              <span class="icon">${icons.trash}</span>
            </button>
          </div>
        `;
      })
      .join('');
  }

  function renderMessages(): void {
    if (!threadEl) return;

    // در صورتی که گفتگوی فعلی هیچ پیامی نداشته باشد -> صفحه شروع شبیه ChatGPT
    if (!messages.length) {
      threadEl.innerHTML = `
        <div class="ai-hero-empty-state">
          <div class="ai-hero-avatar">
            <span class="icon">${icons.sparkles}</span>
          </div>
          <h2 class="ai-hero-title">چطور می‌توانم امروز کمکتان کنم؟</h2>
          <p class="ai-hero-subtitle">دستیار هوشمند مدیریت پلتفرم بهدون برای تحلیل داده‌ها، مدیریت سفارش‌ها و سئو</p>

          <div class="ai-suggestions-grid">
            ${PROMPT_SUGGESTIONS.map(
              (s) => `
              <div class="ai-suggestion-card" data-prompt-text="${escapeHtml(s.prompt)}">
                <div class="ai-suggestion-icon"><span class="icon">${s.icon}</span></div>
                <div class="ai-suggestion-content">
                  <div class="ai-suggestion-title">${escapeHtml(s.title)}</div>
                  <div class="ai-suggestion-desc">${escapeHtml(s.desc)}</div>
                </div>
              </div>
            `,
            ).join('')}
          </div>
        </div>
      `;

      // اتصال کلیک روی کارت‌های پیشنهادی
      threadEl.querySelectorAll<HTMLElement>('[data-prompt-text]').forEach((card) => {
        card.addEventListener('click', () => {
          const prompt = card.getAttribute('data-prompt-text');
          if (prompt) {
            void sendMessage(prompt);
          }
        });
      });

      scrollToBottom(false);
      return;
    }

    // رندر پیام‌ها با طراحی مدرن چت‌جی‌پی‌تی
    const itemsHtml: string[] = [];
    for (let i = 0; i < messages.length; i++) {
      const m = messages[i];
      if (m.role === 'user') {
        itemsHtml.push(`
          <div class="ai-row ai-row-user">
            <div class="ai-bubble ai-bubble-user">
              <div class="ai-user-text">${escapeHtml(m.content)}</div>
            </div>
          </div>
        `);
      } else if (m.role === 'assistant') {
        const bodyHtml = renderMarkdown(m.content);
        itemsHtml.push(`
          <div class="ai-row ai-row-assistant">
            <div class="ai-assistant-avatar" title="هوشواره">
              <span class="icon">${icons.sparkles}</span>
            </div>
            <div class="ai-bubble ai-bubble-assistant">
              <div class="ai-markdown-body">${bodyHtml}</div>
              <div class="ai-assistant-actions">
                <button type="button" class="ai-action-btn ai-copy-msg-btn" data-copy-index="${i}" title="کپی متن">
                  <span class="icon">${icons.copy}</span>
                  <span class="ai-action-label">کپی پاسخ</span>
                </button>
              </div>
            </div>
          </div>
        `);
      }
    }

    // اضافه کردن وضعیت تفکر و تایپینگ در صورت فعال بودن
    if (isBusy) {
      itemsHtml.push(`
        <div class="ai-row ai-row-assistant ai-row-thinking">
          <div class="ai-assistant-avatar" title="هوشواره">
            <span class="icon">${icons.sparkles}</span>
          </div>
          <div class="ai-bubble ai-bubble-assistant">
            <div class="ai-thinking-indicator">
              <span class="ai-dot"></span>
              <span class="ai-dot"></span>
              <span class="ai-dot"></span>
              <span class="ai-thinking-label">هوشواره در حال تفکر است...</span>
            </div>
          </div>
        </div>
      `);
    }

    threadEl.innerHTML = itemsHtml.join('');

    // اتصال دکمه‌های کپی پاسخ
    threadEl.querySelectorAll<HTMLButtonElement>('.ai-copy-msg-btn').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const idx = Number(btn.dataset.copyIndex);
        const msg = messages[idx];
        if (msg && msg.content) {
          try {
            await navigator.clipboard.writeText(msg.content);
            const label = btn.querySelector('.ai-action-label');
            const originalText = label ? label.textContent : '';
            if (label) label.textContent = 'کپی شد!';
            btn.classList.add('is-copied');
            setTimeout(() => {
              if (label) label.textContent = originalText;
              btn.classList.remove('is-copied');
            }, 2000);
          } catch {}
        }
      });
    });

    // اتصال دکمه‌های کپی کد در قطعات کد
    threadEl.querySelectorAll<HTMLButtonElement>('.ai-copy-code-btn').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const rawCode = decodeURIComponent(btn.dataset.copyCode || '');
        if (rawCode) {
          try {
            await navigator.clipboard.writeText(rawCode);
            const span = btn.querySelector('span:last-child');
            if (span) span.textContent = 'کپی شد!';
            setTimeout(() => {
              if (span) span.textContent = 'کپی کد';
            }, 2000);
          } catch {}
        }
      });
    });

    scrollToBottom();
  }

  function setBusy(busy: boolean): void {
    isBusy = busy;
    if (input) input.disabled = busy;
    updateSendButtonState();
    renderMessages();
  }

  async function selectConversation(id: number): Promise<void> {
    hideError();
    activeId = id;
    renderConversationList();
    try {
      const conv = await fetchAiConversation(id);
      messages = conv.messages || [];
      renderMessages();
      input?.focus();
    } catch (err) {
      showError(err);
    }
  }

  async function newChat(): Promise<void> {
    hideError();
    try {
      const id = await createAiConversation();
      conversations = [
        { id, title: 'گفتگوی جدید', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        ...conversations,
      ];
      activeId = id;
      messages = [];
      renderConversationList();
      renderMessages();
      if (input) {
        input.value = '';
        adjustTextareaHeight();
        input.focus();
      }
    } catch (err) {
      showError(err);
    }
  }

  newChatBtn?.addEventListener('click', () => void newChat());
  quickNewChatBtn?.addEventListener('click', () => void newChat());

  listEl.addEventListener('click', (event) => {
    const selectBtn = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-select-conv]');
    if (selectBtn) {
      const id = Number(selectBtn.dataset.selectConv);
      if (id !== activeId) void selectConversation(id);
      return;
    }

    const deleteBtn = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-delete-conv]');
    if (deleteBtn) {
      const id = Number(deleteBtn.dataset.deleteConv);
      if (!window.confirm('این گفتگو به طور کامل حذف شود؟')) return;
      void (async () => {
        try {
          await deleteAiConversation(id);
          conversations = conversations.filter((c) => c.id !== id);
          renderConversationList();
          if (id === activeId) {
            if (conversations.length) {
              await selectConversation(conversations[0].id);
            } else {
              await newChat();
            }
          }
        } catch (err) {
          showError(err);
        }
      })();
    }
  });

  async function sendMessage(text: string): Promise<void> {
    if (!text.trim() || isBusy) return;
    hideError();

    if (!activeId) {
      await newChat();
    }

    const trimmed = text.trim();
    messages = [...messages, { role: 'user', content: trimmed }];
    if (input) {
      input.value = '';
      adjustTextareaHeight();
    }
    setBusy(true);

    try {
      const res = await sendAiChatMessage(messages, activeId!);
      messages = res.messages || [];
      // به‌روزرسانی عنوان در نوار کناری
      conversations = await fetchAiConversations().catch(() => conversations);
      renderConversationList();
    } catch (err) {
      showError(err);
    } finally {
      setBusy(false);
      input?.focus();
    }
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!input) return;
    const val = input.value.trim();
    if (!val) return;
    void sendMessage(val);
  });

  input.addEventListener('input', adjustTextareaHeight);

  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      form.requestSubmit();
    }
  });

  // بارگذاری اولیه گفتگوها
  (async function init() {
    if (isLoaded) return;
    isLoaded = true;
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
  })();
}
