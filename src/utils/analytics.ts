import { API_BASE_URL } from '../data/config.ts';

const VISITOR_KEY = 'behdoon_visitor_id';
const LEGACY_VISITOR_KEY = 'behbar_visitor_id';
const SESSION_KEY = 'behdoon_session_id';
const LEGACY_SESSION_KEY = 'behbar_session_id';

export function getVisitorId(): string {
  let id = localStorage.getItem(VISITOR_KEY) || localStorage.getItem(LEGACY_VISITOR_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(VISITOR_KEY, id);
  }
  return id;
}

export function getSessionId(): string {
  let sid = sessionStorage.getItem(SESSION_KEY) || sessionStorage.getItem(LEGACY_SESSION_KEY);
  if (!sid) {
    sid = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, sid);
  }
  return sid;
}

// هرگز نباید رندر صفحه را کند یا مسدود کند یا خطایی نشان دهد — کاملاً fire-and-forget.
export function trackPageView(): void {
  try {
    const referrerHostname = document.referrer ? new URL(document.referrer).hostname : '';
    const referrer = referrerHostname && referrerHostname !== location.hostname ? referrerHostname : '';

    void fetch(`${API_BASE_URL}/api/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visitorId: getVisitorId(), path: location.pathname, referrer }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* silent */
  }
}

export function trackEvent(eventType: string, eventData?: Record<string, unknown>): void {
  try {
    void fetch(`${API_BASE_URL}/api/track/event`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        visitorId: getVisitorId(),
        sessionId: getSessionId(),
        eventType,
        eventData,
        path: location.pathname,
      }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* silent */
  }
}

let behaviorTrackingInitialized = false;

export function initBehaviorTracking(): void {
  if (behaviorTrackingInitialized) return;
  behaviorTrackingInitialized = true;

  trackPageView();

  // پایش کلیک روی شماره تماس و واتس‌اپ
  document.addEventListener('click', (ev) => {
    const target = ev.target as HTMLElement | null;
    const link = target?.closest('a') as HTMLAnchorElement | null;
    if (!link) return;

    const href = link.getAttribute('href') || '';
    if (href.startsWith('tel:')) {
      trackEvent('call_click', { phone: href.replace('tel:', '') });
    } else if (href.includes('wa.me') || href.includes('whatsapp.com') || href.includes('api.whatsapp.com')) {
      trackEvent('whatsapp_click', { target: href });
    }
  }, { passive: true });

  // ضربان آنلاین بودن کاربر هر ۳ دقیقه یک‌بار
  window.setInterval(() => {
    if (document.visibilityState === 'visible') {
      trackPageView();
    }
  }, 180000);

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      trackPageView();
    }
  });
}
