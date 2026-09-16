const fs = require('fs');
let content = fs.readFileSync('worker.js', 'utf8');

const sIdx = content.indexOf('<header class="fixed top-3 left-1/2');
const eIdx = content.indexOf('</header>') + 9;

if (sIdx === -1 || eIdx === -1) {
    console.log("Could not find header");
    process.exit(1);
}

const newHeader = `<!-- ================= HEADER WRAPPER ================= -->
    <div class="fixed top-3 left-1/2 -translate-x-1/2 w-[calc(100%-1rem)] max-w-6xl z-50 flex items-center justify-between md:justify-center md:gap-4 pointer-events-none">
        
        <!-- MAIN ISLAND -->
        <header class="pointer-events-auto w-full md:w-auto glass-panel shadow-md rounded-full transition-all border border-slate-200">
            <div class="px-4 md:px-5 py-2 flex items-center justify-between md:justify-center md:gap-8 relative">
                
                <a href="/" onclick="window.location.href='/'; return false;" class="flex items-center gap-3 cursor-pointer">
                    <div class="bg-brand-500 text-white p-2 rounded-full shadow-md">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                    </div>
                    <div class="flex flex-col pr-1">
                        <span class="text-xl font-black text-brand-500 tracking-tight leading-none">بهدون</span>
                        <span class="text-[10px] font-bold text-brand-400 mt-1">خدمات حرفه‌ای ساختمان</span>
                    </div>
                </a>
                
                <nav class="hidden md:flex items-center gap-6 lg:gap-8 font-bold text-slate-600 text-sm">
                    <a href="#services" class="hover:text-brand-500 transition-colors">انواع خدمات</a>
                    <a href="#magazine" class="hover:text-brand-500 transition-colors">مجله آموزشی</a>
                    <a href="#about-us" class="hover:text-brand-500 transition-colors">درباره ما</a>
                </nav>

                <div class="hidden md:flex items-center gap-2 lg:gap-3">
                    <a href="/#services" class="flex items-center gap-2 bg-[#8B1C31] text-white px-4 lg:px-5 py-2.5 rounded-full font-bold hover:bg-[#701627] shadow-md shadow-[#8B1C31]/20 transition-colors text-sm border border-[#701627]">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                        ثبت درخواست
                    </a>
                    
                    <a href="#" class="w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-500 rounded-full hover:bg-brand-50 hover:text-brand-600 border border-slate-200 transition-colors shadow-sm ml-2" title="پروفایل کاربری">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                    </a>
                </div>

                <!-- Mobile Hamburger -->
                <button class="md:hidden p-2 text-brand-500 bg-brand-50 rounded-full" onclick="document.getElementById('mobile-menu').classList.toggle('hidden')">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                </button>

                <!-- Mobile Menu Dropdown -->
                <div id="mobile-menu" class="hidden absolute top-[120%] left-0 w-full bg-white rounded-3xl shadow-xl border border-slate-200 flex flex-col overflow-hidden py-2">
                    <a href="#" class="px-6 py-4 border-b border-slate-100 font-bold text-slate-700 flex items-center justify-center gap-2" onclick="document.getElementById('mobile-menu').classList.add('hidden')">
                        <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                        پروفایل کاربری
                    </a>
                    <a href="#services" class="px-6 py-4 border-b border-slate-100 font-bold text-slate-700 flex items-center justify-center gap-2" onclick="document.getElementById('mobile-menu').classList.add('hidden')">خدمات بهدون</a>
                    <a href="#magazine" class="px-6 py-4 border-b border-slate-100 font-bold text-slate-700 flex items-center justify-center gap-2" onclick="document.getElementById('mobile-menu').classList.add('hidden')">مجله آموزشی</a>
                    <a href="#about-us" class="px-6 py-4 border-b border-slate-100 font-bold text-slate-700 flex items-center justify-center gap-2" onclick="document.getElementById('mobile-menu').classList.add('hidden')">درباره ما</a>
                    <a href="/#services" class="px-6 py-4 font-bold text-white flex items-center justify-center gap-2 bg-[#8B1C31] hover:bg-[#701627] transition-colors" onclick="document.getElementById('mobile-menu').classList.add('hidden')">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                        ثبت درخواست
                    </a>
                </div>
            </div>
        </header>

        <!-- PHONE ISLAND (Desktop only) -->
        <a href="tel:\${PHONE}" class="hidden md:flex pointer-events-auto items-center gap-2 bg-success-600 text-white px-5 lg:px-6 py-2.5 rounded-full font-bold shadow-md shadow-success-600/30 animate-heartbeat hover:bg-success-700 transition-all border border-success-500 text-sm shrink-0">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 512 512"><path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"/></svg>
            <span dir="ltr">\${PHONE_DISPLAY}</span>
        </a>
    </div>`;

content = content.substring(0, sIdx) + newHeader + content.substring(eIdx);

// Let's also update the "ثبت درخواست" in the Services grid to have the crimson text color
content = content.replace(/text-brand-600 text-sm font-bold">\s*ثبت درخواست/g, 'text-[#8B1C31] text-sm font-bold">\n                                    ثبت درخواست');

// Also update the "ثبت درخواست" in the Footer to be Crimson background
// Let's find the footer "Submit Request" button.
// It looks like: class="bg-brand-50 border border-brand-200 rounded-2xl p-5 flex items-center gap-4 hover:bg-brand-100 hover:shadow-md transition-all group"
// with "ثبت درخواست" inside.
// Instead of complex regex, let's just do a manual replace for the specific block.
const footerTarget = `<div class="w-14 h-14 shrink-0 rounded-xl bg-white border border-brand-100 flex items-center justify-center text-brand-600 group-hover:scale-110 transition-transform">
                            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                        </div>
                        <div class="flex flex-col">
                            <span class="text-xs text-brand-600/70 mb-0.5">خدمات بهدون</span>
                            <span class="font-bold text-base text-brand-700 transition-colors">ثبت درخواست</span>
                        </div>`;

const footerReplacement = `<div class="w-14 h-14 shrink-0 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-[#8B1C31] group-hover:scale-110 group-hover:bg-[#8B1C31] group-hover:text-white transition-all">
                            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                        </div>
                        <div class="flex flex-col">
                            <span class="text-xs text-rose-600/70 mb-0.5">سریع و آسان</span>
                            <span class="font-bold text-base text-[#8B1C31] transition-colors">ثبت درخواست</span>
                        </div>`;

content = content.replace(footerTarget, footerReplacement);

const footerTargetA = `<!-- Submit Request -->
                    <a href="/#services" class="bg-brand-50 border border-brand-200 rounded-2xl p-5 flex items-center gap-4 hover:bg-brand-100 hover:shadow-md transition-all group">`;

const footerReplacementA = `<!-- Submit Request -->
                    <a href="/#services" class="bg-rose-50/50 border border-rose-100 rounded-2xl p-5 flex items-center gap-4 hover:border-rose-300 hover:shadow-md transition-all group">`;

content = content.replace(footerTargetA, footerReplacementA);

fs.writeFileSync('worker.js', content);
console.log('Update complete.');
