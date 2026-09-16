import type { BrandingSettings } from './dynamicContent.ts';

// عنوان صفحه، og:site_name/og:title/twitter:title و name داخل JSON-LD همه به‌صورت ثابت «بهدون» در سورس
// نوشته شده‌اند (چون این‌ها فقط در همان بارگذاری اول صفحه معنا دارند و pick() برایشان به کار نمی‌رود) —
// اگر خریدار نام سایت را عوض کرده باشد، همین‌جا با جایگزینی مستقیم رشته اصلاح می‌شوند.
export function applySiteNameEverywhere(siteName?: { fa?: string; en?: string }): void {
  const name = siteName?.fa?.trim();
  if (!name || name === 'بهدون') return;

  if (document.title.includes('بهدون')) document.title = document.title.replace(/بهدون/g, name);

  document.querySelectorAll<HTMLMetaElement>('meta[property="og:site_name"], meta[property="og:title"], meta[name="twitter:title"]').forEach(
    (meta) => {
      const content = meta.getAttribute('content');
      if (content?.includes('بهدون')) meta.setAttribute('content', content.replace(/بهدون/g, name));
    },
  );

  document.querySelectorAll<HTMLScriptElement>('script[type="application/ld+json"]').forEach((script) => {
    try {
      const data = JSON.parse(script.textContent ?? '') as Record<string, unknown>;
      let changed = false;
      if (data.name === 'بهدون') {
        data.name = name;
        changed = true;
      }
      const isPartOf = data.isPartOf as Record<string, unknown> | undefined;
      if (isPartOf?.name === 'بهدون') {
        isPartOf.name = name;
        changed = true;
      }
      if (changed) script.textContent = JSON.stringify(data);
    } catch {
      /* JSON-LD نامعتبر — نادیده گرفته می‌شود */
    }
  });

  if (typeof document !== 'undefined' && document.body) {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_SKIP;
        const tag = parent.tagName;
        if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'CODE') {
          return NodeFilter.FILTER_SKIP;
        }
        return node.nodeValue?.includes('بهدون') ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
      },
    });

    const nodesToReplace: Text[] = [];
    while (walker.nextNode()) {
      nodesToReplace.push(walker.currentNode as Text);
    }
    for (const node of nodesToReplace) {
      node.nodeValue = (node.nodeValue || '').replace(/بهدون/g, name);
    }
  }
}

// پیش‌فرض همیشه همین فایل باندل‌شده است؛ اگر خریدار در تنظیمات لوگوی خودش را گذاشته باشد، همین‌جا
// جایگزین می‌شود — هم لوگوی داخل صفحه (هدر/فوتر) و هم فاوآیکن.
export function applyBranding(branding?: BrandingSettings): void {
  if (!branding) return;

  if (branding.logoUrl) {
    document.querySelectorAll<HTMLImageElement>('.header-logo img, .logo-mark').forEach((img) => {
      img.src = branding.logoUrl as string;
    });
  }

  const faviconUrl = branding.faviconUrl || branding.logoUrl;
  if (faviconUrl) {
    document.querySelectorAll<HTMLLinkElement>('link[rel="icon"], link[rel="apple-touch-icon"]').forEach((link) => {
      link.href = faviconUrl;
    });
  }
}
