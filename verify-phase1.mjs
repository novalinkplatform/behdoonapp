import { chromium } from 'playwright';

const outDir = process.argv[2];
const browser = await chromium.launch();
const consoleErrors = [];

const desktop = await browser.newPage({ viewport: { width: 1280, height: 950 } });
desktop.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(`[desktop] ${m.text()}`); });
desktop.on('pageerror', (e) => consoleErrors.push(`[desktop] pageerror: ${e.message}`));
await desktop.goto('http://localhost:5173', { waitUntil: 'networkidle' });
await desktop.screenshot({ path: `${outDir}/p1-desktop-top.png` });

const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
mobile.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(`[mobile] ${m.text()}`); });
mobile.on('pageerror', (e) => consoleErrors.push(`[mobile] pageerror: ${e.message}`));
await mobile.goto('http://localhost:5173', { waitUntil: 'networkidle' });
await mobile.screenshot({ path: `${outDir}/p1-mobile-top.png` });
await mobile.screenshot({ path: `${outDir}/p1-mobile-full.png`, fullPage: true });

// check tel link works (href present)
const telHref = await mobile.locator('.floating-call').getAttribute('href');
console.log('floating call href:', telHref);
const bottomNavTel = await mobile.locator('.bottom-nav-item[href^="tel:"]').getAttribute('href');
console.log('bottom nav tel href:', bottomNavTel);

// check no #site-header references broken
const headerExists = await mobile.locator('header').count();
console.log('header elements remaining:', headerExists);

// check JSON-LD present
const jsonLd = await desktop.locator('script[type="application/ld+json"]').count();
console.log('json-ld scripts:', jsonLd);

await desktop.close();
await mobile.close();
await browser.close();

if (consoleErrors.length) { console.log('CONSOLE_ERRORS:'); consoleErrors.forEach(e => console.log(e)); }
else console.log('NO_CONSOLE_ERRORS');
