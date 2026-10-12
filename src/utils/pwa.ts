/**
 * PWA Service Worker Registration & Installation Manager
 */

let deferredPrompt: any = null;
const DISMISS_KEY = 'behdoon_pwa_dismiss_timestamp';
const DISMISS_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export function isPwaInstalled(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true ||
    document.referrer.includes('android-app://')
  );
}

export function shouldShowPwaBanner(): boolean {
  if (typeof window === 'undefined') return false;
  if (isPwaInstalled()) return false;

  const dismissedAt = localStorage.getItem(DISMISS_KEY);
  if (dismissedAt) {
    const elapsed = Date.now() - Number(dismissedAt);
    if (elapsed < DISMISS_DURATION_MS) {
      return false;
    }
  }
  return true;
}

export function dismissPwaBanner(): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(DISMISS_KEY, Date.now().toString());
  }
}

export function getDeferredPrompt(): any {
  return deferredPrompt;
}

export async function triggerPwaInstall(): Promise<'accepted' | 'dismissed' | 'unavailable'> {
  if (!deferredPrompt) {
    return 'unavailable';
  }
  try {
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    deferredPrompt = null;
    return choice?.outcome || 'dismissed';
  } catch (err) {
    console.error('[PWA] Install prompt error:', err);
    return 'unavailable';
  }
}

export function initPwa(): void {
  if (typeof window === 'undefined') return;

  // 1. Capture beforeinstallprompt event
  window.addEventListener('beforeinstallprompt', (e: Event) => {
    e.preventDefault();
    deferredPrompt = e;
    window.dispatchEvent(new CustomEvent('pwa-installable'));
  });

  // 2. Track successful installation
  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    console.log('[PWA] Behdoon PWA was installed successfully');
    window.dispatchEvent(new CustomEvent('pwa-installed'));
  });

  // 3. Register Service Worker on supported browsers
  if ('serviceWorker' in navigator && (window.location.protocol === 'https:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          // Check for worker updates
          registration.addEventListener('updatefound', () => {
            const installingWorker = registration.installing;
            if (installingWorker) {
              installingWorker.addEventListener('statechange', () => {
                if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  console.log('[PWA] New version of Behdoon is available.');
                  window.dispatchEvent(new CustomEvent('pwa-update-available'));
                }
              });
            }
          });
        })
        .catch((err) => {
          console.warn('[PWA] Service Worker registration failed:', err);
        });
    });
  }
}
