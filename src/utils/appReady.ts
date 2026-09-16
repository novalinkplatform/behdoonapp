// صدا زده می‌شود بلافاصله بعد از اینکه renderApp محتوای واقعی و استایل‌شده را داخل #app گذاشت —
// نسخه‌ی خام سمت‌سرور (برای خزنده‌ها) را نمایان می‌کند و لودینگ برندی روی آن را محو می‌کند.
// دیدن styles/app-loading.css برای قانون visibility مربوط به این کلاس‌ها.
export function markAppReady(): void {
  document.getElementById('app')?.classList.add('app-ready');
  const overlay = document.querySelector<HTMLElement>('.app-loading-overlay');
  if (overlay) window.setTimeout(() => overlay.remove(), 250);
}
