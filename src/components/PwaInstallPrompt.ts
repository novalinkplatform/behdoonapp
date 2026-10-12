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
    <div id="pwa-manual-guide-modal" class="fixed inset-0 z-[100] hidden items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm transition-all" dir="rtl">
      <div class="relative w-full max-w-sm overflow-hidden rounded-3xl bg-white p-6 shadow-2xl border border-slate-100 text-center animate-fade-in">
        <button type="button" id="pwa-close-guide-btn" class="absolute left-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>

        <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#133458] shadow-lg shadow-[#133458]/20 p-2.5">
          <img src="/favicon.svg" alt="بهدون" class="h-full w-full object-contain" />
        </div>

        <h3 class="text-lg font-black text-slate-900 mb-2">راهنمای نصب اپلیکیشن بهدون</h3>
        <p class="text-xs text-slate-600 leading-relaxed mb-5">
          برای نصب مستقیم روی صفحه اصلی گوشی و دسترسی بدون فیلترشکن، مراحل زیر را طی کنید:
        </p>

        <div class="space-y-3 text-right text-xs text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-200/70 mb-5">
          <div class="flex items-start gap-2.5">
            <span class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#133458] text-[10px] font-black text-white">۱</span>
            <p>منوی مرورگر کروم یا سامسونگ اینترنت (<span class="font-bold text-slate-900">سه نقطه ⋮</span> در بالا یا پایین صفحه) را لمس فرمایید.</p>
          </div>
          <div class="flex items-start gap-2.5">
            <span class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#133458] text-[10px] font-black text-white">۲</span>
            <p>گزینه <span class="font-bold text-[#8B1C31]">«نصب برنامه»</span> یا <span class="font-bold text-[#8B1C31]">«افزودن به صفحه اصلی» (Add to Home screen)</span> را انتخاب کنید.</p>
          </div>
          <div class="flex items-start gap-2.5">
            <span class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#133458] text-[10px] font-black text-white">۳</span>
            <p>دکمه <span class="font-bold text-slate-900">«نصب» (Install)</span> را تایید نمایید تا آیکون بهدون روی گوشی شما ایجاد شود.</p>
          </div>
        </div>

        <button type="button" id="pwa-guide-ok-btn" class="w-full rounded-xl bg-[#133458] py-3 text-xs font-bold text-white shadow-md hover:bg-[#1a4473] transition-colors">
          متوجه شدم
        </button>
      </div>
    </div>

    <!-- PWA Bottom Floating Banner (Android / Mobile) -->
    <div id="pwa-install-banner" class="fixed bottom-4 left-4 right-4 z-[85] hidden max-w-md mx-auto transition-all duration-300 transform translate-y-8 opacity-0" dir="rtl">
      <div class="flex items-center gap-3.5 rounded-2xl bg-slate-900/95 text-white p-3.5 shadow-2xl backdrop-blur-md border border-slate-700/60 ring-1 ring-white/10">
        <!-- Logo -->
        <div class="relative flex h-13 w-13 shrink-0 items-center justify-center rounded-xl bg-[#133458] p-2 shadow-md">
          <img src="/icon-192.png" alt="بهدون" class="h-full w-full object-contain" />
          <span class="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-slate-900">
            <svg class="h-2.5 w-2.5 text-white" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
          </span>
        </div>

        <!-- Text -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-1.5">
            <h4 class="text-xs font-black text-white truncate">وب‌اپلیکیشن بهدون (PWA)</h4>
            <span class="rounded bg-emerald-500/20 px-1.5 py-0.2 text-[9px] font-bold text-emerald-400">اندروید</span>
          </div>
          <p class="text-[11px] text-slate-300 leading-tight mt-0.5 truncate">
            نصب سریع روی گوشی؛ دسترسی فوری و بدون فیلترشکن
          </p>
        </div>

        <!-- Buttons -->
        <div class="flex items-center gap-1.5 shrink-0">
          <button type="button" id="pwa-install-btn" class="flex items-center gap-1 rounded-xl bg-gradient-to-r from-[#8B1C31] to-[#b3243f] px-3.5 py-2 text-xs font-black text-white shadow-lg shadow-[#8B1C31]/30 hover:brightness-110 active:scale-95 transition-all">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
            <span>نصب</span>
          </button>
          <button type="button" id="pwa-dismiss-btn" class="rounded-xl p-2 text-slate-400 hover:bg-white/10 hover:text-white transition-colors" title="بستن">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
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

  if (!banner || !installBtn) return;

  function showBanner() {
    if (isPwaInstalled() || !shouldShowPwaBanner()) return;
    banner?.classList.remove('hidden');
    // Allow slight delay for animation
    setTimeout(() => {
      banner?.classList.remove('translate-y-8', 'opacity-0');
      banner?.classList.add('translate-y-0', 'opacity-100');
    }, 150);
  }

  function hideBanner() {
    banner?.classList.remove('translate-y-0', 'opacity-100');
    banner?.classList.add('translate-y-8', 'opacity-0');
    setTimeout(() => {
      banner?.classList.add('hidden');
    }, 300);
  }

  function openGuideModal() {
    guideModal?.classList.remove('hidden');
    guideModal?.classList.add('flex');
  }

  function closeGuideModal() {
    guideModal?.classList.add('hidden');
    guideModal?.classList.remove('flex');
  }

  // Dismiss button handler
  dismissBtn?.addEventListener('click', () => {
    dismissPwaBanner();
    hideBanner();
  });

  // Guide close handlers
  closeGuideBtn?.addEventListener('click', closeGuideModal);
  guideOkBtn?.addEventListener('click', closeGuideModal);

  // Install button handler
  installBtn.addEventListener('click', async () => {
    if (getDeferredPrompt()) {
      const outcome = await triggerPwaInstall();
      if (outcome === 'accepted') {
        hideBanner();
      }
    } else {
      // Fallback for browsers without direct trigger (iOS or manual Android)
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
