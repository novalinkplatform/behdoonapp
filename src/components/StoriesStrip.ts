import { icons } from './icons.ts';
import { pick } from '../i18n/lang.ts';
import type { PublicStory } from '../utils/dynamicContent.ts';

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function renderStoriesStrip(stories: PublicStory[]): string {
  if (!stories.length) return '';

  return `
    <div class="stories-strip-wrap">
      <div class="container">
        <ul class="stories-strip" id="stories-strip">
          ${stories
            .map(
              (s, i) => `
            <li>
              <button type="button" class="story-bubble" data-story-index="${i}">
                <span class="story-bubble-ring"><img src="${escapeHtml(s.imageUrl)}" alt="" loading="lazy" /></span>
                <span class="story-bubble-caption">${escapeHtml(pick(s.caption, s.captionEn || s.caption) || pick('استوری', 'Story'))}</span>
              </button>
            </li>
          `,
            )
            .join('')}
        </ul>
      </div>
    </div>

    <div class="story-viewer" id="story-viewer" hidden>
      <button type="button" class="story-viewer-close" id="story-viewer-close" aria-label="${pick('بستن', 'Close')}">
        <span class="icon">${icons.close}</span>
      </button>
      <button type="button" class="story-viewer-nav story-viewer-prev" id="story-viewer-prev" aria-label="${pick('قبلی', 'Previous')}">
        <span class="icon">${icons.chevronRight}</span>
      </button>
      <div class="story-viewer-content" id="story-viewer-content"></div>
      <button type="button" class="story-viewer-nav story-viewer-next" id="story-viewer-next" aria-label="${pick('بعدی', 'Next')}">
        <span class="icon">${icons.chevronLeft}</span>
      </button>
    </div>
  `;
}

export function initStoriesStrip(stories: PublicStory[]): void {
  if (!stories.length) return;
  const strip = document.getElementById('stories-strip');
  const viewer = document.getElementById('story-viewer');
  const content = document.getElementById('story-viewer-content');
  const closeBtn = document.getElementById('story-viewer-close');
  const prevBtn = document.getElementById('story-viewer-prev');
  const nextBtn = document.getElementById('story-viewer-next');
  if (!strip || !viewer || !content || !closeBtn || !prevBtn || !nextBtn) return;

  let activeIndex = 0;

  function renderActive(): void {
    const s = stories[activeIndex];
    const caption = escapeHtml(pick(s.caption, s.captionEn || s.caption));
    content!.innerHTML = `
      <img src="${escapeHtml(s.imageUrl)}" alt="" />
      ${caption ? `<p class="story-viewer-caption">${caption}</p>` : ''}
      ${s.linkUrl ? `<a class="story-viewer-link" href="${escapeHtml(s.linkUrl)}" target="_blank" rel="noopener">${pick('مشاهده بیشتر', 'Learn more')}</a>` : ''}
    `;
    prevBtn!.style.visibility = activeIndex > 0 ? 'visible' : 'hidden';
    nextBtn!.style.visibility = activeIndex < stories.length - 1 ? 'visible' : 'hidden';
  }

  function open(index: number): void {
    activeIndex = index;
    renderActive();
    viewer!.hidden = false;
  }

  function close(): void {
    viewer!.hidden = true;
  }

  strip.querySelectorAll<HTMLButtonElement>('[data-story-index]').forEach((btn) => {
    btn.addEventListener('click', () => open(Number(btn.dataset.storyIndex)));
  });

  closeBtn.addEventListener('click', close);
  viewer.addEventListener('click', (e) => {
    if (e.target === viewer) close();
  });
  prevBtn.addEventListener('click', () => {
    if (activeIndex > 0) open(activeIndex - 1);
  });
  nextBtn.addEventListener('click', () => {
    if (activeIndex < stories.length - 1) open(activeIndex + 1);
  });
  document.addEventListener('keydown', (e) => {
    if (viewer!.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft' && activeIndex < stories.length - 1) open(activeIndex + 1);
    if (e.key === 'ArrowRight' && activeIndex > 0) open(activeIndex - 1);
  });
}
