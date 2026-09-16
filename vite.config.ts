import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

const input: Record<string, string> = {
  main: fileURLToPath(new URL('./index.html', import.meta.url)),
  magazine: fileURLToPath(new URL('./magazine.html', import.meta.url)),
  article: fileURLToPath(new URL('./article-template.html', import.meta.url)),
  page: fileURLToPath(new URL('./page-template.html', import.meta.url)),
  about: fileURLToPath(new URL('./about.html', import.meta.url)),
  terms: fileURLToPath(new URL('./terms.html', import.meta.url)),
  privacy: fileURLToPath(new URL('./privacy.html', import.meta.url)),
  orders: fileURLToPath(new URL('./orders.html', import.meta.url)),
  profile: fileURLToPath(new URL('./profile.html', import.meta.url)),
  careers: fileURLToPath(new URL('./careers.html', import.meta.url)),
};

// صفحه‌ی فروش قالب («خرید بهبار») فقط تبلیغ خودمان است، نه بخشی از محصولی که خریدار تحویل می‌گیرد.
// برخلاف نشان‌های شناور (که با شرط جاوااسکریپت مخفی می‌مانند)، این‌جا اصلاً کل ورودی بیلد شرطی است —
// یعنی در بیلد عادی خریدار (بدون VITE_DEMO_SALE_URL) نه‌فقط رندر نمی‌شود، بلکه sale.html/sale-main.ts
// و هرچه فقط همان‌ها import می‌کنند (SaleView.ts، sale.css) اصلاً توسط Rollup پردازش/کپی نمی‌شوند.
if (process.env.VITE_DEMO_SALE_URL) {
  input.sale = fileURLToPath(new URL('./sale.html', import.meta.url));
}

export default defineConfig({
  build: {
    rollupOptions: { input },
  },
});
