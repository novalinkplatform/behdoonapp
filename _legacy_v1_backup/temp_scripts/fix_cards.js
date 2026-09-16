const fs = require('fs');
let content = fs.readFileSync('worker.js', 'utf8');

const sIdx = content.indexOf('<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto px-4 md:px-0">');
const fIdx = content.indexOf('</section>', sIdx);

console.log('sIdx:', sIdx, 'fIdx:', fIdx);

const newCards = `
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto px-4 md:px-0">
                        <!-- Card 1: HVAC -->
                        <a href="/services/hvac" class="group block relative bg-white border border-slate-100 rounded-[2rem] p-6 hover:shadow-xl hover:border-brand-100 transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
                            <div class="absolute inset-0 bg-gradient-to-br from-brand-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div class="relative z-10">
                                <div class="w-14 h-14 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600 mb-6 group-hover:scale-110 transition-transform">
                                    <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 3v18m-4-14h8m-8 10h8M6 8a6 6 0 1112 0 6 6 0 01-12 0z"></path></svg>
                                </div>
                                <h3 class="text-xl font-bold text-slate-800 mb-3 group-hover:text-brand-600 transition-colors">سرمایش و گرمایش</h3>
                                <p class="text-sm text-slate-500 mb-6 line-clamp-2">تعمیر، سرویس و راه‌اندازی کولر آبی، گازی، پکیج و موتورخانه.</p>
                                <div class="flex items-center text-brand-600 text-sm font-bold">
                                    مشاهده جزئیات
                                    <svg class="w-4 h-4 mr-2 group-hover:-translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                                </div>
                            </div>
                        </a>

                        <!-- Card 2: Plumbing -->
                        <a href="/services/plumbing" class="group block relative bg-white border border-slate-100 rounded-[2rem] p-6 hover:shadow-xl hover:border-brand-100 transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
                            <div class="absolute inset-0 bg-gradient-to-br from-brand-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div class="relative z-10">
                                <div class="w-14 h-14 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600 mb-6 group-hover:scale-110 transition-transform">
                                    <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                                </div>
                                <h3 class="text-xl font-bold text-slate-800 mb-3 group-hover:text-brand-600 transition-colors">لوله کشی</h3>
                                <p class="text-sm text-slate-500 mb-6 line-clamp-2">اجرای لوله‌کشی آب و فاضلاب، نشت‌یابی با دستگاه و رفع نم.</p>
                                <div class="flex items-center text-brand-600 text-sm font-bold">
                                    مشاهده جزئیات
                                    <svg class="w-4 h-4 mr-2 group-hover:-translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                                </div>
                            </div>
                        </a>

                        <!-- Card 3: Electrical -->
                        <a href="/services/electrical" class="group block relative bg-white border border-slate-100 rounded-[2rem] p-6 hover:shadow-xl hover:border-brand-100 transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
                            <div class="absolute inset-0 bg-gradient-to-br from-brand-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div class="relative z-10">
                                <div class="w-14 h-14 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600 mb-6 group-hover:scale-110 transition-transform">
                                    <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                                </div>
                                <h3 class="text-xl font-bold text-slate-800 mb-3 group-hover:text-brand-600 transition-colors">برقکاری</h3>
                                <p class="text-sm text-slate-500 mb-6 line-clamp-2">سیم‌کشی کامل، رفع اتصالی، نصب کلید و پریز و طراحی نورپردازی.</p>
                                <div class="flex items-center text-brand-600 text-sm font-bold">
                                    مشاهده جزئیات
                                    <svg class="w-4 h-4 mr-2 group-hover:-translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                                </div>
                            </div>
                        </a>

                        <!-- Card 4: Renovation -->
                        <a href="/services/renovation" class="group block relative bg-white border border-slate-100 rounded-[2rem] p-6 hover:shadow-xl hover:border-brand-100 transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
                            <div class="absolute inset-0 bg-gradient-to-br from-brand-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div class="relative z-10">
                                <div class="w-14 h-14 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600 mb-6 group-hover:scale-110 transition-transform">
                                    <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                                </div>
                                <h3 class="text-xl font-bold text-slate-800 mb-3 group-hover:text-brand-600 transition-colors">تعمیرات و بازسازی ساختمان</h3>
                                <p class="text-sm text-slate-500 mb-6 line-clamp-2">تخریب، دیوارکشی، نقاشی، کاشی‌کاری و نوسازی کامل فضاهای داخلی.</p>
                                <div class="flex items-center text-brand-600 text-sm font-bold">
                                    مشاهده جزئیات
                                    <svg class="w-4 h-4 mr-2 group-hover:-translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                                </div>
                            </div>
                        </a>
                    </div>`;

if (sIdx !== -1 && fIdx !== -1) {
    content = content.substring(0, sIdx) + newCards + '\n                </div>\n            ' + content.substring(fIdx);
    fs.writeFileSync('worker.js', content);
    console.log('Cards successfully updated in worker.js!');
}
