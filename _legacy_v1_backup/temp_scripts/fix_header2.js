const fs = require('fs');
let content = fs.readFileSync('worker.js', 'utf8');

const regex = /<div class="hidden md:flex">[\s\S]*?<\/a>\s*<\/div>/;

const headerRightDesktopReplacement = `<div class="hidden md:flex items-center gap-2 lg:gap-3">
                <a href="/#services" class="flex items-center gap-2 bg-brand-50 text-brand-600 px-4 lg:px-5 py-2.5 rounded-full font-bold hover:bg-brand-100 transition-colors text-sm border border-brand-200">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                    ثبت درخواست
                </a>
                <a href="tel:09333256885" class="flex items-center gap-2 bg-success-600 text-white px-4 lg:px-5 py-2.5 rounded-full font-bold shadow-md shadow-success-600/20 animate-heartbeat hover:bg-success-700 transition-colors text-sm">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 512 512"><path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"/></svg>
                    <span dir="ltr">0933 325 6885</span>
                </a>
                <a href="#" class="w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-500 rounded-full hover:bg-brand-50 hover:text-brand-600 border border-slate-200 transition-colors shadow-sm ml-2" title="پروفایل کاربری">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                </a>
            </div>`;

if (content.match(regex)) {
    content = content.replace(regex, headerRightDesktopReplacement);
    console.log('Header desktop regex replaced.');
}

fs.writeFileSync('worker.js', content);
