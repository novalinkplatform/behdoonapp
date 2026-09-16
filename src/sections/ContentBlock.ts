import { pick } from '../i18n/lang.ts';
import { icons } from '../components/icons.ts';
import { toPersianDigits } from '../utils/jalali.ts';
import type { HomepageSection, BlockItem, PublicTestimonial } from '../utils/dynamicContent.ts';
import { API_BASE_URL } from '../data/config.ts';

// این متن‌ها هرچند توسط کارمند (نه لزوماً مشتری) نوشته می‌شوند، مستقیم با innerHTML روی صفحه‌ی عمومی
// رندر می‌شوند — پس یک نقش کم‌اختیار (مثلاً فقط «homepage») می‌تواند با یک تگ آسیب‌پذیر، اسکریپت را
// روی مرورگر هر بازدیدکننده‌ی سایت اجرا کند؛ escape کردن این خروجی‌ها این مسیر را می‌بندد.
function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function heading(section: HomepageSection, fallback: string, fallbackEn: string): string {
  return escapeHtml(pick(section.heading || fallback, section.headingEn || section.heading || fallbackEn));
}

function subheadingHtml(section: HomepageSection): string {
  const text = pick(section.subheading ?? '', section.subheadingEn ?? section.subheading ?? '');
  return text ? `<p class="section-description">${escapeHtml(text)}</p>` : '';
}

function itemTitle(item: BlockItem): string {
  return escapeHtml(pick(item.title ?? '', item.titleEn ?? item.title ?? ''));
}

function itemText(item: BlockItem): string {
  return escapeHtml(pick(item.text ?? '', item.textEn ?? item.text ?? ''));
}

// عکس یا فیلم آیتم را برمی‌گرداند — فایل‌های ویدیویی مستقیم با <video> و بقیه (یوتیوب/آپارات و مشابه) با <iframe> نمایش داده می‌شوند.
function mediaHtml(item: BlockItem, className: string): string {
  if (item.videoUrl) {
    const isFile = /\.(mp4|webm|ogg)(\?|$)/i.test(item.videoUrl);
    const src = escapeHtml(item.videoUrl);
    return isFile
      ? `<video class="${className}" src="${src}" controls preload="metadata"></video>`
      : `<iframe class="${className}" src="${src}" loading="lazy" allowfullscreen></iframe>`;
  }
  if (item.imageUrl) return `<img class="${className}" src="${escapeHtml(item.imageUrl)}" alt="" loading="lazy" />`;
  return '';
}

// ===== steps =====

function renderStepItem(item: BlockItem, index: number): string {
  return `
    <li class="step-card" style="animation-delay: ${index * 120}ms">
      <span class="step-number">${toPersianDigits(index + 1)}</span>
      <h3>${itemTitle(item)}</h3>
      <p>${itemText(item)}</p>
    </li>
  `;
}

function renderSteps(section: HomepageSection): string {
  return `
    <ol class="steps-grid">
      ${(section.items ?? []).map(renderStepItem).join('')}
    </ol>
  `;
}

// ===== stats =====

function renderStatItem(item: BlockItem, index: number): string {
  return `
    <div class="stat-card" style="animation-delay: ${index * 120}ms">
      <span class="stat-number">${itemTitle(item)}</span>
      <span class="stat-label">${itemText(item)}</span>
    </div>
  `;
}

function renderStats(section: HomepageSection): string {
  return `
    <div class="stats-grid">
      ${(section.items ?? []).map(renderStatItem).join('')}
    </div>
  `;
}

// ===== accordion =====

function renderAccordionItem(section: HomepageSection, item: BlockItem, index: number): string {
  const triggerId = `${section.id}-trigger-${index}`;
  const panelId = `${section.id}-panel-${index}`;
  return `
    <li class="faq-item">
      <h3 class="faq-question">
        <button type="button" class="faq-trigger" id="${triggerId}" aria-expanded="false" aria-controls="${panelId}">
          <span>${itemTitle(item)}</span>
          <span class="icon faq-trigger-icon">${icons.chevronDown}</span>
        </button>
      </h3>
      <div class="faq-panel" id="${panelId}" role="region" aria-labelledby="${triggerId}" hidden>
        <p>${itemText(item)}</p>
      </div>
    </li>
  `;
}

function renderAccordion(section: HomepageSection): string {
  return `
    <ul class="faq-list">
      ${(section.items ?? []).map((item, i) => renderAccordionItem(section, item, i)).join('')}
    </ul>
  `;
}

export function initContentBlocks(): void {
  document.querySelectorAll<HTMLUListElement>('.faq-list').forEach((list) => {
    const triggers = Array.from(list.querySelectorAll<HTMLButtonElement>('.faq-trigger'));
    triggers.forEach((trigger) => {
      trigger.addEventListener('click', () => {
        const panelId = trigger.getAttribute('aria-controls');
        const panel = panelId ? document.getElementById(panelId) : null;
        if (!panel) return;
        const isOpen = trigger.getAttribute('aria-expanded') === 'true';

        // فقط یک پرسش در هر لحظه باز باشد — کل بخش یک آکاردئون واحد است، نه چند آکاردئون مستقل.
        triggers.forEach((other) => {
          if (other === trigger) return;
          const otherPanelId = other.getAttribute('aria-controls');
          const otherPanel = otherPanelId ? document.getElementById(otherPanelId) : null;
          other.setAttribute('aria-expanded', 'false');
          if (otherPanel) otherPanel.hidden = true;
          other.closest('.faq-item')?.classList.remove('is-open');
        });

        trigger.setAttribute('aria-expanded', String(!isOpen));
        panel.hidden = isOpen;
        trigger.closest('.faq-item')?.classList.toggle('is-open', !isOpen);
      });
    });
  });

  const toggleBtn = document.getElementById('testimonial-submit-toggle');
  const form = document.getElementById('testimonial-submit-form') as HTMLFormElement | null;
  if (toggleBtn && form) {
    toggleBtn.addEventListener('click', () => {
      form.hidden = !form.hidden;
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      void submitTestimonialForm(form);
    });
  }
}

async function submitTestimonialForm(form: HTMLFormElement): Promise<void> {
  const nameInput = document.getElementById('testimonial-submit-name') as HTMLInputElement;
  const ratingInput = document.getElementById('testimonial-submit-rating') as HTMLSelectElement;
  const textInput = document.getElementById('testimonial-submit-text') as HTMLTextAreaElement;
  const submitBtn = document.getElementById('testimonial-submit-btn') as HTMLButtonElement;
  const messageEl = document.getElementById('testimonial-submit-message') as HTMLParagraphElement;

  const customerName = nameInput.value.trim();
  const text = textInput.value.trim();
  if (!customerName || !text) return;

  submitBtn.disabled = true;
  messageEl.hidden = true;
  try {
    const res = await fetch(`${API_BASE_URL}/api/testimonials`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customerName, text, rating: Number(ratingInput.value) }),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : pick('ثبت نظر ناموفق بود.', 'Failed to submit your review.'));

    form.reset();
    document.getElementById('testimonial-submit-fields')!.setAttribute('hidden', '');
    messageEl.textContent = pick(
      'با تشکر از شما؛ نظرتان پس از بررسی نمایش داده می‌شود.',
      'Thanks! Your review will appear after being reviewed.',
    );
    messageEl.hidden = false;
  } catch (err) {
    messageEl.textContent = err instanceof Error ? err.message : pick('خطایی پیش آمد.', 'Something went wrong.');
    messageEl.hidden = false;
  } finally {
    submitBtn.disabled = false;
  }
}

// ===== grid =====

function renderGridItem(item: BlockItem, index: number): string {
  const icon = item.imageUrl ? `<img src="${escapeHtml(item.imageUrl)}" alt="" loading="lazy" />` : icons.checkCircle;
  const desc = itemText(item);
  return `
    <li class="trust-item" style="animation-delay: ${index * 90}ms">
      <span class="trust-icon">${icon}</span>
      <span class="trust-label">${itemTitle(item)}</span>
      ${desc ? `<span class="trust-desc">${desc}</span>` : ''}
    </li>
  `;
}

function renderGrid(section: HomepageSection): string {
  return `
    <ul class="trust-grid">
      ${(section.items ?? []).map(renderGridItem).join('')}
    </ul>
  `;
}

// ===== slider =====

function renderSlide(item: BlockItem): string {
  const media = mediaHtml(item, 'content-slide-media');
  const title = itemTitle(item);
  const text = itemText(item);
  return `
    <li class="content-slide">
      ${media}
      ${
        title || text || item.linkUrl
          ? `
        <div class="content-slide-body">
          ${title ? `<h3>${title}</h3>` : ''}
          ${text ? `<p>${text}</p>` : ''}
          ${item.linkUrl ? `<a class="content-slide-link" href="${escapeHtml(item.linkUrl)}">${pick('بیشتر بدانید', 'Learn more')}</a>` : ''}
        </div>
      `
          : ''
      }
    </li>
  `;
}

function renderSlider(section: HomepageSection): string {
  return `
    <ul class="content-slider-track">
      ${(section.items ?? []).map(renderSlide).join('')}
    </ul>
  `;
}

// ===== quote =====

function quoteInitial(name: string): string {
  return name.trim().slice(0, 1) || '؟';
}

function renderQuoteItem(item: BlockItem): string {
  const author = itemTitle(item);
  return `
    <li class="testimonial-card">
      <p class="testimonial-text">${itemText(item)}</p>
      ${
        author
          ? `
        <div class="testimonial-author">
          <span class="testimonial-avatar">
            ${item.imageUrl ? `<img src="${escapeHtml(item.imageUrl)}" alt="" loading="lazy" />` : `<span>${quoteInitial(author)}</span>`}
          </span>
          <span class="testimonial-name">${author}</span>
        </div>
      `
          : ''
      }
    </li>
  `;
}

function renderQuote(section: HomepageSection): string {
  const items = section.items ?? [];
  return `
    <div class="testimonials-viewport">
      <ul class="testimonials-track" style="--testimonial-count:${items.length}">
        ${items.map(renderQuoteItem).join('')}
      </ul>
    </div>
  `;
}

// ===== testimonials (پرکردن خودکار از مجموعه‌ی نظرات مشتریان تأییدشده) =====

function testimonialInitial(name: string): string {
  return name.trim().slice(0, 1) || '؟';
}

function starRow(rating: number): string {
  return Array.from({ length: 5 }, (_, i) => (i < rating ? '★' : '☆')).join('');
}

function renderTestimonialCard(t: PublicTestimonial): string {
  const name = escapeHtml(pick(t.customerName, t.customerNameEn || t.customerName));
  const text = escapeHtml(pick(t.text, t.textEn || t.text));
  return `
    <li class="testimonial-card">
      <p class="testimonial-stars" aria-hidden="true">${starRow(t.rating)}</p>
      <p class="testimonial-text">${text}</p>
      <div class="testimonial-author">
        <span class="testimonial-avatar">
          ${t.avatarUrl ? `<img src="${escapeHtml(t.avatarUrl)}" alt="" loading="lazy" />` : `<span>${testimonialInitial(name)}</span>`}
        </span>
        <span class="testimonial-name">${name}</span>
      </div>
    </li>
  `;
}

function renderTestimonials(testimonials: PublicTestimonial[]): string {
  if (!testimonials.length) return '';
  // برای جلوه‌ی حرکت پیوسته و بی‌درز، لیست را یک‌بار تکرار می‌کنیم.
  const looped = [...testimonials, ...testimonials];
  return `
    <div class="testimonials-viewport">
      <ul class="testimonials-track" style="--testimonial-count:${testimonials.length}">
        ${looped.map(renderTestimonialCard).join('')}
      </ul>
    </div>
  `;
}

// نظر ثبت‌شده از این فرم همیشه با status='draft' در سرور ذخیره می‌شود (سمت API) و تا وقتی
// کارمندی از پنل «نظرات مشتریان» آن را تأیید نکند، این‌جا دیده نمی‌شود — یعنی خودِ این فرم هیچ
// راه مستقیمی برای انتشار محتوای دلخواه روی سایت باز نمی‌کند.
function renderTestimonialSubmitCta(): string {
  return `
    <div class="testimonial-submit-cta container">
      <button type="button" class="btn btn-secondary" id="testimonial-submit-toggle">
        ${pick('ثبت نظر شما', 'Write a review')}
      </button>
      <form class="testimonial-submit-form" id="testimonial-submit-form" hidden>
        <div class="testimonial-submit-fields" id="testimonial-submit-fields">
          <div class="form-field">
            <label for="testimonial-submit-name">${pick('نام شما', 'Your name')}</label>
            <input type="text" id="testimonial-submit-name" maxlength="80" required />
          </div>
          <div class="form-field">
            <label for="testimonial-submit-rating">${pick('امتیاز', 'Rating')}</label>
            <select id="testimonial-submit-rating">
              <option value="5">★★★★★</option>
              <option value="4">★★★★☆</option>
              <option value="3">★★★☆☆</option>
              <option value="2">★★☆☆☆</option>
              <option value="1">★☆☆☆☆</option>
            </select>
          </div>
          <div class="form-field">
            <label for="testimonial-submit-text">${pick('متن نظر', 'Your review')}</label>
            <textarea id="testimonial-submit-text" maxlength="1000" rows="3" required></textarea>
          </div>
          <button type="submit" class="btn btn-primary" id="testimonial-submit-btn">${pick('ارسال', 'Submit')}</button>
        </div>
        <p class="testimonial-submit-message" id="testimonial-submit-message" hidden></p>
      </form>
    </div>
  `;
}

// ===== text =====

function renderText(section: HomepageSection): string {
  const body = pick(section.body ?? '', section.bodyEn ?? section.body ?? '');
  if (!body) return '';
  return `<div class="rich-text-body">${body.split('\n').filter(Boolean).map((p) => `<p>${escapeHtml(p)}</p>`).join('')}</div>`;
}

// ===== dispatch =====

const LAYOUT_DEFAULTS: Record<string, [string, string]> = {
  steps: ['', ''],
  accordion: ['', ''],
  grid: ['', ''],
  slider: ['', ''],
  quote: ['', ''],
  testimonials: ['نظرات مشتریان ما', 'What our customers say'],
  stats: ['', ''],
  text: ['', ''],
};

export function renderContentBlock(section: HomepageSection, testimonials: PublicTestimonial[]): string {
  const layout = section.layout ?? 'text';
  if (layout === 'testimonials' && !testimonials.length) return '';

  const [fallback, fallbackEn] = LAYOUT_DEFAULTS[layout] ?? ['', ''];
  const title = heading(section, fallback, fallbackEn);

  let body = '';
  switch (layout) {
    case 'steps':
      body = renderSteps(section);
      break;
    case 'accordion':
      body = renderAccordion(section);
      break;
    case 'grid':
      body = renderGrid(section);
      break;
    case 'slider':
      body = renderSlider(section);
      break;
    case 'quote':
      body = renderQuote(section);
      break;
    case 'testimonials':
      body = renderTestimonials(testimonials);
      break;
    case 'stats':
      body = renderStats(section);
      break;
    case 'text':
    default:
      body = renderText(section);
      break;
  }

  if (!title && !body) return '';

  const isEdgeToEdge = layout === 'slider' || layout === 'quote' || layout === 'testimonials';

  return `
    <section class="section content-block content-block-${layout}" id="${section.id}">
      <div class="container">
        ${title ? `<div class="section-header"><h2>${title}</h2>${subheadingHtml(section)}</div>` : ''}
        ${isEdgeToEdge ? '' : body}
      </div>
      ${isEdgeToEdge ? body : ''}
      ${layout === 'testimonials' ? renderTestimonialSubmitCta() : ''}
    </section>
  `;
}
