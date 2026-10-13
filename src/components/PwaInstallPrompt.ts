import '../styles/pwa.css';
import {
  isPwaInstalled,
  shouldShowPwaBanner,
  dismissPwaBanner,
  triggerPwaInstall,
  getDeferredPrompt,
} from '../utils/pwa.ts';

export function renderPwaInstallModal(): string {
  return `
    <!-- Manual Install Guide Modal (Fallback for browsers needing manual add-to-homescreen) -->
    <div id="pwa-manual-guide-modal" class="pwa-guide-modal-backdrop" dir="rtl" aria-hidden="true" role="dialog" aria-modal="true">
      <div class="pwa-guide-modal-card">
        <button type="button" id="pwa-close-guide-btn" class="pwa-guide-close-btn" aria-label="بستن راهنما" title="بستن">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>

        <div class="pwa-guide-logo-wrap">
          <img src="/favicon.svg" alt="بهدون" />
        </div>

        <h3 class="pwa-guide-title">راهنمای نصب اپلیکیشن بهدون</h3>
        <p class="pwa-guide-desc">
          برای نصب مستقیم روی صفحه اصلی گوشی و دسترسی بدون نیاز به فیلترشکن، مراحل ۳گانه زیر را طی نمایید:
        </p>

        <div class="pwa-guide-steps">
          <div class="pwa-guide-step-item">
            <span class="pwa-guide-step-num">۱</span>
            <p class="pwa-guide-step-text">منوی مرورگر کروم یا سامسونگ اینترنت (<strong>علامت سه نقطه ⋮</strong> در بالا یا پایین صفحه) را لمس فرمایید.</p>
          </div>
          <div class="pwa-guide-step-item">
            <span class="pwa-guide-step-num">۲</span>
            <p class="pwa-guide-step-text">گزینه <strong class="highlight-crimson">«نصب برنامه»</strong> یا <strong class="highlight-crimson">«افزودن به صفحه اصلی» (Add to Home screen)</strong> را انتخاب کنید.</p>
          </div>
          <div class="pwa-guide-step-item">
            <span class="pwa-guide-step-num">۳</span>
            <p class="pwa-guide-step-text">دکمه <strong>«نصب» (Install)</strong> را تایید نمایید تا آیکون بهدون روی صفحه گوشی شما قرار گیرد.</p>
          </div>
        </div>

        <button type="button" id="pwa-guide-ok-btn" class="pwa-guide-confirm-btn">
          متوجه شدم
        </button>
      </div>
    </div>

    <!-- PWA Bottom Floating Banner (Android / Mobile) -->
    <div id="pwa-install-banner" class="pwa-install-banner" dir="rtl" aria-hidden="true">
      <div class="pwa-banner-card">
        <!-- Logo -->
        <div class="pwa-banner-logo-wrap">
          <img src="/icon-192.png" alt="بهدون" />
          <span class="pwa-banner-badge-dot">
            <svg fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
          </span>
        </div>

        <!-- Text -->
        <div class="pwa-banner-info">
          <div class="pwa-banner-title-row">
            <h4 class="pwa-banner-title">وب‌اپلیکیشن بهدون (PWA)</h4>
            <span class="pwa-banner-tag">اندروید</span>
          </div>
          <p class="pwa-banner-desc">
            نصب سریع روی گوشی؛ دسترسی فوری و بدون فیلترشکن
          </p>
        </div>

        <!-- Buttons -->
        <div class="pwa-banner-actions">
          <button type="button" id="pwa-install-btn" class="pwa-banner-install-btn">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
            <span>نصب</span>
          </button>
          <button type="button" id="pwa-dismiss-btn" class="pwa-banner-dismiss-btn" title="بستن" aria-label="بستن">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
      </div>
    </div>
  `;
}

export function initPwaInstallPrompt(): void {
  if (typeof window === 'undefined') return;

  const banner = document.getElementById('pwa-install-banner');
  const installBtn = document.getElementById('pwa-install-btn');
  const dismissBtn = document.getElementById('pwa-dismiss-btn');
  const guideModal = document.getElementById('pwa-manual-guide-modal');
  const closeGuideBtn = document.getElementById('pwa-close-guide-btn');
  const guideOkBtn = document.getElementById('pwa-guide-ok-btn');

  function showBanner() {
    if (isPwaInstalled() || !shouldShowPwaBanner() || !banner) return;
    banner.classList.add('is-visible');
    banner.setAttribute('aria-hidden', 'false');
  }

  function hideBanner() {
    if (!banner) return;
    banner.classList.remove('is-visible');
    banner.setAttribute('aria-hidden', 'true');
  }

  function openGuideModal() {
    if (!guideModal) return;
    guideModal.classList.add('is-open');
    guideModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeGuideModal() {
    if (!guideModal) return;
    guideModal.classList.remove('is-open');
    guideModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Dismiss button handler
  dismissBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    dismissPwaBanner();
    hideBanner();
  });

  // Guide close handlers
  closeGuideBtn?.addEventListener('click', closeGuideModal);
  guideOkBtn?.addEventListener('click', closeGuideModal);
  guideModal?.addEventListener('click', (e) => {
    if (e.target === guideModal) {
      closeGuideModal();
    }
  });

  // Install button handler
  installBtn?.addEventListener('click', async (e) => {
    e.stopPropagation();
    if (getDeferredPrompt()) {
      const outcome = await triggerPwaInstall();
      if (outcome === 'accepted') {
        hideBanner();
      }
    } else {
      openGuideModal();
    }
  });

  // Listen for beforeinstallprompt
  window.addEventListener('pwa-installable', () => {
    showBanner();
  });

  // Listen for successful install
  window.addEventListener('pwa-installed', () => {
    hideBanner();
    closeGuideModal();
  });

  // Also bind any global install buttons (e.g. data-action="pwa-install")
  document.addEventListener('click', (e) => {
    const target = (e.target as HTMLElement).closest('[data-action="pwa-install"]');
    if (target) {
      e.preventDefault();
      if (getDeferredPrompt()) {
        triggerPwaInstall();
      } else {
        openGuideModal();
      }
    }
  });

  // Show after 3.5 seconds if installable or user hasn't dismissed recently
  setTimeout(() => {
    if (shouldShowPwaBanner()) {
      showBanner();
    }
  }, 3500);
}
