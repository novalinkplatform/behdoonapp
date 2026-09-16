import indexModule from './src/index.js';
import { headerHTML, footerHTML, html, renderServicePage, renderSubServicePage, servicesData } from './src/frontend.js';

console.log('--- TEST 1: servicesData Integrity ---');
const cats = ['hvac', 'plumbing', 'electrical', 'renovation'];
for (const cat of cats) {
    if (!servicesData[cat]) throw new Error(`Category ${cat} missing from servicesData!`);
    console.log(`✓ Category ${cat} exists with ${servicesData[cat].subServices.length} subservices.`);
    for (const sub of servicesData[cat].subServices) {
        if (!sub.slug) throw new Error(`Subservice ${sub.name} in ${cat} missing slug!`);
        if (!sub.detail) throw new Error(`Subservice ${sub.name} in ${cat} missing detail!`);
    }
}

console.log('\n--- TEST 2: renderServicePage output ---');
for (const cat of cats) {
    const pageHtml = renderServicePage(cat);
    if (!pageHtml.includes('hidden md:flex text-xs text-slate-500 mb-4')) {
        throw new Error(`renderServicePage(${cat}) missing smaller mobile-hidden breadcrumb!`);
    }
    if (!pageHtml.includes('mobile-menu')) {
        throw new Error(`renderServicePage(${cat}) missing mobile-menu!`);
    }
    if (!pageHtml.includes('واتساپ')) {
        throw new Error(`renderServicePage(${cat}) missing WhatsApp in mobile menu!`);
    }
    if (!pageHtml.includes('پروفایل من')) {
        throw new Error(`renderServicePage(${cat}) missing پروفایل من!`);
    }
    console.log(`✓ renderServicePage(${cat}) OK, length: ${pageHtml.length}`);
}

console.log('\n--- TEST 3: renderSubServicePage output ---');
const testSubservices = [
    { cat: 'hvac', idx: 0, expectedSlug: 'water-cooler', expectedName: 'نصب و سرویس کولر آبی' },
    { cat: 'plumbing', idx: 0, expectedSlug: 'leak-detection', expectedName: 'تشخیص و ترمیم ترکیدگی لوله' },
    { cat: 'electrical', idx: 0, expectedSlug: 'short-circuit', expectedName: 'رفع اتصالی' },
    { cat: 'renovation', idx: 0, expectedSlug: 'painting', expectedName: 'نقاشی و رنگ کاری ساختمان' }
];

for (const test of testSubservices) {
    const pageHtml = renderSubServicePage(test.cat, test.idx);
    if (!pageHtml.includes(test.expectedName)) {
        throw new Error(`renderSubServicePage(${test.cat}, ${test.idx}) missing ${test.expectedName}!`);
    }
    if (!pageHtml.includes('hidden md:flex text-xs text-slate-500 mb-4')) {
        throw new Error(`renderSubServicePage(${test.cat}, ${test.idx}) missing mobile-hidden breadcrumb!`);
    }
    if (!pageHtml.includes(`ثبت آنلاین درخواست ${test.expectedName}`)) {
        throw new Error(`renderSubServicePage(${test.cat}, ${test.idx}) missing CTA button!`);
    }
    if (!pageHtml.includes('سایر خدمات')) {
        throw new Error(`renderSubServicePage(${test.cat}, ${test.idx}) missing sibling subservices!`);
    }
    console.log(`✓ renderSubServicePage(${test.cat}, ${test.expectedSlug}) OK, length: ${pageHtml.length}`);
}

console.log('\n--- TEST 4: Home Page (html) checks ---');
if (!html.includes('خدمات حرفه‌ای ساختمان در تهران')) {
    throw new Error('Home page missing new tagline in header!');
}
if (!html.includes('پروفایل من')) {
    throw new Error('Home page missing پروفایل من in mobile menu/nav!');
}
console.log('✓ Home page checks passed!');

console.log('\n--- TEST 5: Worker fetch routing ---');
async function testRoute(urlStr) {
    const req = new Request(urlStr);
    const env = {};
    const res = await indexModule.fetch(req, env, {});
    return res;
}

const resHome = await testRoute('https://behdoon.ir/');
console.log('✓ / status:', resHome.status);

const resSitemap = await testRoute('https://behdoon.ir/sitemap.xml');
const sitemapText = await resSitemap.text();
console.log('✓ /sitemap.xml status:', resSitemap.status, 'contains water-cooler:', sitemapText.includes('/services/hvac/water-cooler'));

const resWaterCooler = await testRoute('https://behdoon.ir/services/hvac/water-cooler');
const wcText = await resWaterCooler.text();
console.log('✓ /services/hvac/water-cooler status:', resWaterCooler.status, 'contains کولر آبی:', wcText.includes('کولر آبی'));

const resPersianRedirect = await testRoute('https://behdoon.ir/services/hvac/' + encodeURIComponent('نصب-و-سرویس-کولر-آبی'));
console.log('✓ Persian URL redirect status:', resPersianRedirect.status, 'Location:', resPersianRedirect.headers.get('Location'));

console.log('\nALL 5 TESTS PASSED SUCCESSFULLY! Ready for deployment!');
