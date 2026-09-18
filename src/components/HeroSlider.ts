import { icons } from './icons.ts';
import { pick } from '../i18n/lang.ts';
import type { SiteSettings } from '../utils/dynamicContent.ts';
import { type SliderConfig, type SlideItem, DEFAULT_SLIDER_CONFIG } from '../admin/utils/api.ts';

export function renderHeroSlider(settings: SiteSettings): string {
  const config = (settings.site_sliders as SliderConfig | undefined) || DEFAULT_SLIDER_CONFIG;
  if (config.enabled === false) return '';

  const validSlides = (config.slides || [])
    .filter((s: SlideItem) => s.isActive !== false && (s.target === 'both' || s.target === 'web'))
    .sort((a: SlideItem, b: SlideItem) => (a.sortOrder || 0) - (b.sortOrder || 0));

  if (validSlides.length === 0) return '';

  const slidesHtml = validSlides
    .map(
      (slide, idx) => `
      <div class="hero-slide ${idx === 0 ? 'is-active' : ''}" data-hero-slide="${idx}">
        <img class="hero-slide-bg" src="${slide.imageUrl}" alt="${pick(slide.title, slide.titleEn || slide.title)}" loading="${idx === 0 ? 'eager' : 'lazy'}" />
        <div class="hero-slide-overlay"></div>
        <div class="hero-slide-content">
          <div class="hero-slide-tag">
            <span class="icon" style="width: 14px; height: 14px;">${icons.bolt}</span>
            <span>${pick('خدمات تخصصی تضمینی بهدون', 'Guaranteed Behdoon Services')}</span>
          </div>
          <h2 class="hero-slide-title">${pick(slide.title, slide.titleEn || slide.title)}</h2>
          <p class="hero-slide-desc">${pick(slide.subtitle || '', slide.subtitleEn || slide.subtitle || '')}</p>
          ${
            slide.linkUrl
              ? `
            <a href="${slide.linkUrl}" class="hero-slide-btn ${slide.linkUrl.startsWith('#request') ? 'service-order-trigger' : ''}">
              <span>${pick(slide.buttonText || 'ثبت فوری درخواست', 'Request Online')}</span>
              <span class="icon" style="width: 18px; height: 18px;">${icons.chevronLeft}</span>
            </a>
          `
              : ''
          }
        </div>
      </div>
    `,
    )
    .join('');

  const dotsHtml = validSlides
    .map(
      (_, idx) => `
      <button type="button" class="hero-slider-dot ${idx === 0 ? 'is-active' : ''}" data-hero-dot="${idx}" aria-label="اسلاید ${idx + 1}"></button>
    `,
    )
    .join('');

  return `
    <section class="hero-slider-wrap" aria-label="اسلایدر ویژه بهدون">
      <div class="hero-slider-container" id="hero-slider-container">
        ${slidesHtml}
        
        <div class="hero-slider-nav">
          <button type="button" class="hero-slider-btn" id="hero-slider-prev" aria-label="اسلاید قبلی">
            <span class="icon" style="width: 18px; height: 18px;">${icons.chevronRight}</span>
          </button>
          
          ${config.showIndicators !== false ? `<div class="hero-slider-dots">${dotsHtml}</div>` : ''}

          <button type="button" class="hero-slider-btn" id="hero-slider-next" aria-label="اسلاید بعدی">
            <span class="icon" style="width: 18px; height: 18px;">${icons.chevronLeft}</span>
          </button>
        </div>
      </div>
    </section>
  `;
}

export function initHeroSlider(settings: SiteSettings): void {
  const container = document.getElementById('hero-slider-container');
  if (!container) return;

  const slides = container.querySelectorAll<HTMLElement>('.hero-slide');
  const dots = container.querySelectorAll<HTMLButtonElement>('[data-hero-dot]');
  const prevBtn = document.getElementById('hero-slider-prev');
  const nextBtn = document.getElementById('hero-slider-next');

  if (slides.length <= 1) {
    if (prevBtn) prevBtn.style.display = 'none';
    if (nextBtn) nextBtn.style.display = 'none';
    return;
  }

  const config = (settings.site_sliders as SliderConfig | undefined) || DEFAULT_SLIDER_CONFIG;
  const autoplay = config.autoplay !== false;
  const intervalMs = config.intervalMs || 5000;

  let currentIndex = 0;
  let timer: number | null = null;

  function goToSlide(index: number): void {
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;

    slides.forEach((s, idx) => {
      s.classList.toggle('is-active', idx === index);
    });
    dots.forEach((d, idx) => {
      d.classList.toggle('is-active', idx === index);
    });
    currentIndex = index;
  }

  function nextSlide(): void {
    goToSlide(currentIndex + 1);
  }

  function prevSlide(): void {
    goToSlide(currentIndex - 1);
  }

  function startAutoplay(): void {
    if (!autoplay || timer) return;
    timer = window.setInterval(nextSlide, intervalMs);
  }

  function stopAutoplay(): void {
    if (timer) {
      window.clearInterval(timer);
      timer = null;
    }
  }

  nextBtn?.addEventListener('click', () => {
    nextSlide();
    stopAutoplay();
    startAutoplay();
  });

  prevBtn?.addEventListener('click', () => {
    prevSlide();
    stopAutoplay();
    startAutoplay();
  });

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.dataset.heroDot || '0', 10);
      goToSlide(idx);
      stopAutoplay();
      startAutoplay();
    });
  });

  container.addEventListener('mouseenter', stopAutoplay);
  container.addEventListener('mouseleave', startAutoplay);

  // Touch Swipe Support
  let touchStartX = 0;
  let touchEndX = 0;

  container.addEventListener(
    'touchstart',
    (e) => {
      touchStartX = e.changedTouches[0].screenX;
      stopAutoplay();
    },
    { passive: true },
  );

  container.addEventListener(
    'touchend',
    (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
      startAutoplay();
    },
    { passive: true },
  );

  function handleSwipe(): void {
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        // Swiped right -> In RTL this is next or prev
        prevSlide();
      } else {
        // Swiped left
        nextSlide();
      }
    }
  }

  startAutoplay();
}
