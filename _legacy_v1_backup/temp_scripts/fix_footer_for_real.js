const fs = require('fs');
let content = fs.readFileSync('worker.js', 'utf8');

const newFooterHTML = `
    <!-- ================= ISLAND FOOTER v2 ================= -->
    <footer class="bg-slate-50 pt-16 pb-28 md:pb-12 border-t border-slate-200 mt-10">
        <div class="container mx-auto px-4 max-w-6xl">
            
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
                
                <!-- Island 1: Intro (Spans 2 columns) -->
                <div class="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-200 lg:col-span-2 hover:shadow-md transition-shadow">
                    <div class="flex items-center gap-3 mb-6">
                        <div class="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-inner">ب</div>
                        <h2 class="text-[1.1rem] md:text-xl font-black text-slate-800 tracking-tight">بهدون | خدمات حرفه‌ای ساختمان در تهران</h2>
                    </div>
                    <div class="text-sm text-slate-600 leading-loose text-justify space-y-4">
                        <p>بهدون ارائه‌دهنده خدمات فنی و ساختمانی در تهران است. خدمات بهدون شامل تأسیسات ساختمان، لوله‌کشی آب و فاضلاب، رفع نشتی و نشت‌یابی، رفع نم و رطوبت، برق‌کشی و روشنایی، بازسازی و دکوراسیون و خدمات بنایی و عمرانی است.</p>
                        <p>هدف بهدون، ساده‌تر کردن دسترسی به خدمات فنی ساختمان و کمک به کاربران برای پیدا کردن راهکار مناسب برای مشکلات و نیازهای ساختمانی است.</p>
                    </div>
                </div>

                <!-- Island 4: Contact -->
                <div class="bg-gradient-to-br from-brand-600 to-brand-700 rounded-[2rem] p-8 shadow-md border border-brand-500 text-white flex flex-col justify-between hover:shadow-lg transition-shadow relative overflow-hidden">
                    <div class="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                    <div class="relative z-10">
                        <h2 class="text-lg font-black mb-4 flex items-center gap-2">
                            <svg class="w-5 h-5 text-brand-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                            تماس با بهدون
                        </h2>
                        <p class="text-sm text-brand-100 leading-relaxed mb-8">
                            برای دریافت خدمات فنی و ساختمانی در تهران و ثبت درخواست می‌توانید با بهدون در ارتباط باشید.
                        </p>
                    </div>
                    <div class="relative z-10 flex flex-col gap-4">
                        <a href="tel:\${PHONE}" class="text-3xl font-black text-white hover:text-brand-200 transition-colors text-center" dir="ltr">\${PHONE_DISPLAY}</a>
                        <a href="tel:\${PHONE}" class="bg-white text-brand-700 text-center py-3.5 rounded-xl font-bold text-sm hover:bg-brand-50 transition-colors shadow-sm">
                            درخواست خدمات
                        </a>
                    </div>
                </div>

                <!-- Island 2: Building Services -->
                <div class="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                    <h3 class="text-[1.05rem] font-bold text-slate-800 mb-5 border-b border-slate-100 pb-3 flex items-center gap-2">
                        <div class="w-2 h-2 rounded-full bg-amber-400"></div>
                        خدمات ساختمانی در تهران
                    </h3>
                    <ul class="space-y-4 text-sm text-slate-600 font-medium">
                        <li><a href="/#services" class="hover:text-brand-600 transition-colors flex items-center gap-2"><svg class="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg> تأسیسات ساختمان</a></li>
                        <li><a href="/#services" class="hover:text-brand-600 transition-colors flex items-center gap-2"><svg class="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg> برق‌کشی و روشنایی</a></li>
                        <li><a href="/#services" class="hover:text-brand-600 transition-colors flex items-center gap-2"><svg class="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg> بازسازی و دکوراسیون</a></li>
                        <li><a href="/#services" class="hover:text-brand-600 transition-colors flex items-center gap-2"><svg class="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg> خدمات بنایی و عمرانی</a></li>
                    </ul>
                </div>

                <!-- Island 3: Specialized Services -->
                <div class="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                    <h3 class="text-[1.05rem] font-bold text-slate-800 mb-5 border-b border-slate-100 pb-3 flex items-center gap-2">
                        <div class="w-2 h-2 rounded-full bg-purple-500"></div>
                        خدمات فنی ساختمان
                    </h3>
                    <ul class="grid grid-cols-2 gap-y-3 gap-x-2 text-[13px] text-slate-600 font-medium">
                        <li><a href="/#services" class="hover:text-brand-600 transition-colors flex items-center gap-1.5"><span class="text-slate-300 text-lg leading-none">•</span> لوله‌کشی آب و فاضلاب</a></li>
                        <li><a href="/#services" class="hover:text-brand-600 transition-colors flex items-center gap-1.5"><span class="text-slate-300 text-lg leading-none">•</span> رفع نشتی</a></li>
                        <li><a href="/#services" class="hover:text-brand-600 transition-colors flex items-center gap-1.5"><span class="text-slate-300 text-lg leading-none">•</span> نشت‌یابی</a></li>
                        <li><a href="/#services" class="hover:text-brand-600 transition-colors flex items-center gap-1.5"><span class="text-slate-300 text-lg leading-none">•</span> رفع نم و رطوبت</a></li>
                        <li><a href="/#services" class="hover:text-brand-600 transition-colors flex items-center gap-1.5"><span class="text-slate-300 text-lg leading-none">•</span> تعمیرات تأسیسات</a></li>
                        <li><a href="/#services" class="hover:text-brand-600 transition-colors flex items-center gap-1.5"><span class="text-slate-300 text-lg leading-none">•</span> سیم‌کشی ساختمان</a></li>
                        <li><a href="/#services" class="hover:text-brand-600 transition-colors flex items-center gap-1.5"><span class="text-slate-300 text-lg leading-none">•</span> رفع اتصالی</a></li>
                        <li><a href="/#services" class="hover:text-brand-600 transition-colors flex items-center gap-1.5"><span class="text-slate-300 text-lg leading-none">•</span> نقاشی ساختمان</a></li>
                        <li><a href="/#services" class="hover:text-brand-600 transition-colors flex items-center gap-1.5"><span class="text-slate-300 text-lg leading-none">•</span> گچ‌کاری</a></li>
                        <li><a href="/#services" class="hover:text-brand-600 transition-colors flex items-center gap-1.5"><span class="text-slate-300 text-lg leading-none">•</span> کاشی‌کاری</a></li>
                        <li><a href="/#services" class="hover:text-brand-600 transition-colors flex items-center gap-1.5"><span class="text-slate-300 text-lg leading-none">•</span> کناف‌کاری</a></li>
                    </ul>
                </div>

                <!-- Island 5: Areas -->
                <div class="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow flex flex-col justify-between">
                    <div>
                        <h3 class="text-[1.05rem] font-bold text-slate-800 mb-4 border-b border-slate-100 pb-3 flex items-center gap-2">
                            <div class="w-2 h-2 rounded-full bg-success-500"></div>
                            خدمات ساختمانی در تهران
                        </h3>
                        <p class="text-[13px] text-slate-600 leading-relaxed mb-6 text-justify">
                            بهدون خدمات فنی و ساختمانی را در مناطق مختلف تهران ارائه می‌دهد و تلاش می‌کند دسترسی کاربران به خدمات تخصصی ساختمان را ساده‌تر کند.
                        </p>
                    </div>
                    <div class="flex flex-wrap gap-2">
                        <span class="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-600">شمال تهران</span>
                        <span class="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-600">غرب تهران</span>
                        <span class="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-600">شرق تهران</span>
                        <span class="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-600">مرکز تهران</span>
                        <span class="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-600">جنوب تهران</span>
                    </div>
                </div>

            </div>

            <!-- Bottom General Links -->
            <div class="flex flex-wrap justify-center gap-5 md:gap-8 text-[13px] font-bold text-slate-500 mb-8 px-4">
                <a href="/#about-us" class="hover:text-brand-600 transition-colors">درباره بهدون</a>
                <a href="tel:\${PHONE}" class="hover:text-brand-600 transition-colors">تماس با ما</a>
                <a href="/#services" class="hover:text-brand-600 transition-colors">خدمات</a>
                <a href="/magazine" class="hover:text-brand-600 transition-colors">دانشنامه</a>
                <a href="#" class="hover:text-brand-600 transition-colors">قوانین و مقررات</a>
                <a href="#" class="hover:text-brand-600 transition-colors">حریم خصوصی</a>
            </div>

            <!-- Bottom Copyright Bar -->
            <div class="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200 text-xs font-medium text-slate-400">
                <div>© بهدون | خدمات حرفه‌ای ساختمان در تهران</div>
                <div class="flex gap-4">
                    <a href="#" class="hover:text-slate-600 transition-colors">حریم خصوصی</a>
                    <span>|</span>
                    <a href="#" class="hover:text-slate-600 transition-colors">قوانین و مقررات</a>
                </div>
            </div>

        </div>
    </footer>
`;

// Replace in homeHTML
const footerStartString = '<footer class="container mx-auto px-4 max-w-5xl my-10 mb-28 md:mb-12 relative z-10">';
const ctaString = '<!-- Mobile Sticky CTA -->';

const startIndex = content.indexOf(footerStartString);
if (startIndex !== -1) {
    const endIndex = content.indexOf(ctaString, startIndex);
    if (endIndex !== -1) {
        // We replace from startIndex to endIndex
        content = content.substring(0, startIndex) + newFooterHTML + '\n\n    ' + content.substring(endIndex);
        console.log('Successfully replaced old footer in homeHTML!');
    } else {
        console.log('Found start string but not Mobile Sticky CTA.');
    }
} else {
    console.log('Could not find start string in homeHTML.');
}

fs.writeFileSync('worker.js', content);
