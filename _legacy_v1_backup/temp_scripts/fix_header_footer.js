const fs = require('fs');
let content = fs.readFileSync('worker.js', 'utf8');

// --- 1. Update Header ---
// Desktop Header currently has:
/*
            <div class="hidden md:flex">
                <a href="tel:${PHONE}" class="flex items-center gap-2 bg-success-600 text-white px-5 py-2.5 rounded-full font-bold shadow-md shadow-success-600/20 animate-heartbeat hover:bg-success-700 transition-colors text-sm">
                    ...
                </a>
            </div>
*/
const headerRightDesktopTarget = `<div class="hidden md:flex">
                <a href="tel:\${PHONE}" class="flex items-center gap-2 bg-success-600 text-white px-5 py-2.5 rounded-full font-bold shadow-md shadow-success-600/20 animate-heartbeat hover:bg-success-700 transition-colors text-sm">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 512 512"><path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"/></svg>
                    <span dir="ltr">\${PHONE_DISPLAY}</span>
                </a>
            </div>`;

const headerRightDesktopReplacement = `<div class="hidden md:flex items-center gap-2 lg:gap-3">
                <a href="/#services" class="flex items-center gap-2 bg-brand-50 text-brand-600 px-4 lg:px-5 py-2.5 rounded-full font-bold hover:bg-brand-100 transition-colors text-sm border border-brand-200">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                    ثبت درخواست
                </a>
                <a href="tel:\${PHONE}" class="flex items-center gap-2 bg-success-600 text-white px-4 lg:px-5 py-2.5 rounded-full font-bold shadow-md shadow-success-600/20 animate-heartbeat hover:bg-success-700 transition-colors text-sm">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 512 512"><path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"/></svg>
                    <span dir="ltr">\${PHONE_DISPLAY}</span>
                </a>
                <a href="#" class="w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-500 rounded-full hover:bg-brand-50 hover:text-brand-600 border border-slate-200 transition-colors shadow-sm ml-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                </a>
            </div>`;

if (content.includes(headerRightDesktopTarget)) {
    content = content.replace(headerRightDesktopTarget, headerRightDesktopReplacement);
    console.log('Header desktop updated.');
} else {
    console.log('Header desktop target not found.');
}

// Mobile Menu Dropdown update
const mobileMenuTarget = `<div id="mobile-menu" class="hidden absolute top-[120%] left-0 w-full bg-white rounded-3xl shadow-xl border border-slate-200 flex flex-col overflow-hidden py-2">
                <a href="#services" class="px-6 py-4 border-b border-slate-100 font-bold text-slate-700 text-center" onclick="document.getElementById('mobile-menu').classList.add('hidden')">خدمات بهدون</a>
                <a href="#magazine" class="px-6 py-4 border-b border-slate-100 font-bold text-slate-700 text-center" onclick="document.getElementById('mobile-menu').classList.add('hidden')">مجله آموزشی</a>
                <a href="#about-us" class="px-6 py-4 font-bold text-slate-700 text-center" onclick="document.getElementById('mobile-menu').classList.add('hidden')">درباره ما</a>
            </div>`;

const mobileMenuReplacement = `<div id="mobile-menu" class="hidden absolute top-[120%] left-0 w-full bg-white rounded-3xl shadow-xl border border-slate-200 flex flex-col overflow-hidden py-2">
                <a href="#" class="px-6 py-4 border-b border-slate-100 font-bold text-slate-700 flex items-center justify-center gap-2" onclick="document.getElementById('mobile-menu').classList.add('hidden')">
                    <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                    پروفایل کاربری
                </a>
                <a href="#services" class="px-6 py-4 border-b border-slate-100 font-bold text-slate-700 flex items-center justify-center gap-2" onclick="document.getElementById('mobile-menu').classList.add('hidden')">خدمات بهدون</a>
                <a href="#magazine" class="px-6 py-4 border-b border-slate-100 font-bold text-slate-700 flex items-center justify-center gap-2" onclick="document.getElementById('mobile-menu').classList.add('hidden')">مجله آموزشی</a>
                <a href="#about-us" class="px-6 py-4 border-b border-slate-100 font-bold text-slate-700 flex items-center justify-center gap-2" onclick="document.getElementById('mobile-menu').classList.add('hidden')">درباره ما</a>
                <a href="/#services" class="px-6 py-4 font-bold text-brand-600 flex items-center justify-center gap-2 bg-brand-50" onclick="document.getElementById('mobile-menu').classList.add('hidden')">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                    ثبت درخواست
                </a>
            </div>`;

if (content.includes(mobileMenuTarget)) {
    content = content.replace(mobileMenuTarget, mobileMenuReplacement);
    console.log('Mobile menu updated.');
} else {
    // try a more generic replace
    content = content.replace(/<div id="mobile-menu"[\s\S]*?<\/div>/, mobileMenuReplacement);
}


// --- 2. Update Footer Contact Grid ---
// Currently it's `<div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-10 w-full max-w-4xl mx-auto">`
// We want to make it 4 columns and add "ثبت درخواست".
const footerGridTarget = '<div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-10 w-full max-w-4xl mx-auto">';
const footerGridReplacement = '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10 w-full max-w-5xl mx-auto">';

if (content.includes(footerGridTarget)) {
    content = content.replace(footerGridTarget, footerGridReplacement);
}

// Find the Instagram block to insert Submit Request after it.
// The Instagram block ends with: `</a>` and then `</div>` or `<!-- ROW 3 -->`.
const instaStart = content.indexOf('<!-- Instagram -->');
if (instaStart !== -1) {
    const instaEnd = content.indexOf('</a>', instaStart) + 4;
    
    const submitRequestBox = `
                    
                    <!-- Submit Request -->
                    <a href="/#services" class="bg-brand-50 border border-brand-200 rounded-2xl p-5 flex items-center gap-4 hover:bg-brand-100 hover:shadow-md transition-all group">
                        <div class="w-14 h-14 shrink-0 rounded-xl bg-white border border-brand-100 flex items-center justify-center text-brand-600 group-hover:scale-110 transition-transform">
                            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                        </div>
                        <div class="flex flex-col">
                            <span class="text-xs text-brand-600/70 mb-0.5">خدمات بهدون</span>
                            <span class="font-bold text-base text-brand-700 transition-colors">ثبت درخواست</span>
                        </div>
                    </a>`;
                    
    content = content.substring(0, instaEnd) + submitRequestBox + content.substring(instaEnd);
    console.log('Footer Submit Request added.');
}

fs.writeFileSync('worker.js', content);
