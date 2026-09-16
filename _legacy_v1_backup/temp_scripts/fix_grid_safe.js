const fs = require('fs');
let content = fs.readFileSync('worker.js', 'utf8');

const sIdx = content.indexOf('<!-- Grid -->');
if (sIdx === -1) {
    console.log("Could not find Grid start");
    process.exit(1);
}

const rCardIdx = content.indexOf('<!-- Card 4: Renovation -->', sIdx);
if (rCardIdx === -1) {
    console.log("Could not find Card 4");
    process.exit(1);
}

const eIdx = content.indexOf('</section>', rCardIdx) + 10;

const newGridHtml = `<!-- Grid -->
                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto relative z-10">
                        <!-- Card 1: HVAC -->
                        <a href="/services/hvac" class="group block relative bg-white border border-slate-100 rounded-[2rem] p-6 hover:shadow-xl hover:border-brand-100 transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
                            <div class="absolute inset-0 bg-gradient-to-br from-brand-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div class="relative z-10">
                                <div class="w-14 h-14 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600 mb-6 group-hover:scale-110 transition-transform">
                                    <!-- Snowflake/Flame -->
                                    <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19.5 17.25v2.25a2.25 2.25 0 01-2.25 2.25H6.75a2.25 2.25 0 01-2.25-2.25v-2.25m15 0v-5.25a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v5.25m15 0h-15M12 12.75v-3.75m0 0c0-1.243-.63-2.39-1.593-3.068a3.745 3.745 0 01-1.043-3.296m2.636 6.364c1.243 0 2.39-.63 3.068-1.593a3.746 3.746 0 003.296-1.043"></path></svg>
                                </div>
                                <h3 class="text-xl font-bold text-slate-800 mb-3 group-hover:text-brand-600 transition-colors">سرمایش و گرمایش</h3>
                                <p class="text-sm text-slate-500 mb-6 line-clamp-2">تعمیر، سرویس و راه‌اندازی کولر آبی، گازی، پکیج و موتورخانه.</p>
                                <div class="flex items-center text-brand-600 text-sm font-bold">
                                    ثبت درخواست
                                    <svg class="w-4 h-4 mr-2 group-hover:-translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                                </div>
                            </div>
                        </a>

                        <!-- Card 2: Plumbing -->
                        <a href="/services/plumbing" class="group block relative bg-white border border-slate-100 rounded-[2rem] p-6 hover:shadow-xl hover:border-brand-100 transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
                            <div class="absolute inset-0 bg-gradient-to-br from-brand-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div class="relative z-10">
                                <div class="w-14 h-14 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600 mb-6 group-hover:scale-110 transition-transform">
                                    <!-- Wrench -->
                                    <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z"></path></svg>
                                </div>
                                <h3 class="text-xl font-bold text-slate-800 mb-3 group-hover:text-brand-600 transition-colors">لوله کشی</h3>
                                <p class="text-sm text-slate-500 mb-6 line-clamp-2">اجرای لوله‌کشی آب و فاضلاب، نشت‌یابی با دستگاه و رفع نم.</p>
                                <div class="flex items-center text-brand-600 text-sm font-bold">
                                    ثبت درخواست
                                    <svg class="w-4 h-4 mr-2 group-hover:-translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                                </div>
                            </div>
                        </a>

                        <!-- Card 3: Electrical -->
                        <a href="/services/electrical" class="group block relative bg-white border border-slate-100 rounded-[2rem] p-6 hover:shadow-xl hover:border-brand-100 transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
                            <div class="absolute inset-0 bg-gradient-to-br from-brand-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div class="relative z-10">
                                <div class="w-14 h-14 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600 mb-6 group-hover:scale-110 transition-transform">
                                    <!-- Lightning/Bolt -->
                                    <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"></path></svg>
                                </div>
                                <h3 class="text-xl font-bold text-slate-800 mb-3 group-hover:text-brand-600 transition-colors">برقکاری</h3>
                                <p class="text-sm text-slate-500 mb-6 line-clamp-2">سیم‌کشی کامل، رفع اتصالی، نصب کلید و پریز و طراحی نورپردازی.</p>
                                <div class="flex items-center text-brand-600 text-sm font-bold">
                                    ثبت درخواست
                                    <svg class="w-4 h-4 mr-2 group-hover:-translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                                </div>
                            </div>
                        </a>

                        <!-- Card 4: Renovation -->
                        <a href="/services/renovation" class="group block relative bg-white border border-slate-100 rounded-[2rem] p-6 hover:shadow-xl hover:border-brand-100 transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
                            <div class="absolute inset-0 bg-gradient-to-br from-brand-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div class="relative z-10">
                                <div class="w-14 h-14 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600 mb-6 group-hover:scale-110 transition-transform">
                                    <!-- Roller Brush -->
                                    <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.879-3.879a3 3 0 10-4.242-4.242l-3.879 3.879a15.995 15.995 0 00-4.648 4.764M12 12l5.25-5.25"></path></svg>
                                </div>
                                <h3 class="text-xl font-bold text-slate-800 mb-3 group-hover:text-brand-600 transition-colors">تعمیرات و بازسازی ساختمان</h3>
                                <p class="text-sm text-slate-500 mb-6 line-clamp-2">تخریب، دیوارکشی، نقاشی، کاشی‌کاری و نوسازی کامل فضاهای داخلی.</p>
                                <div class="flex items-center text-brand-600 text-sm font-bold">
                                    ثبت درخواست
                                    <svg class="w-4 h-4 mr-2 group-hover:-translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                                </div>
                            </div>
                        </a>
                    </div>
                </div>
            </section>
`;

content = content.substring(0, sIdx) + newGridHtml + content.substring(eIdx);

fs.writeFileSync('worker.js', content);
console.log('Grid updated cleanly.');
