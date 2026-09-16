const fs = require('fs');

const replacement = `<!-- CATEGORIES GRID UNDER HERO -->
                <div class="mt-8 border-t border-slate-200/50 pt-8 pb-4" id="services">
                    <div class="flex items-center justify-center gap-4 mb-8">
                        <div class="h-[2px] bg-gradient-to-r from-transparent to-brand-300 w-12 md:w-24 rounded-full"></div>
                        <h2 class="text-xl md:text-2xl font-black text-slate-800">انواع خدمات ساختمان</h2>
                        <div class="h-[2px] bg-gradient-to-l from-transparent to-brand-300 w-12 md:w-24 rounded-full"></div>
                    </div>
                    
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto px-4 md:px-0">
                        <!-- Category 1 -->
                        <a href="#services-detail" class="group bg-white p-6 rounded-[1.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100 flex flex-col gap-4 hover:border-brand-300 hover:shadow-[0_8px_30px_rgb(19,52,88,0.15)] hover:-translate-y-1 transition-all duration-300 text-right">
                            <div class="flex items-center gap-4 border-b border-slate-100 pb-4">
                                <div class="w-16 h-16 shrink-0 bg-slate-50 rounded-full flex items-center justify-center shadow-inner group-hover:bg-brand-50 transition-colors duration-300 p-3">
                                    <img src="https://img.icons8.com/color/96/plumbing.png" alt="تأسیسات" class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300 drop-shadow-sm" />
                                </div>
                                <h3 class="text-[17px] font-black text-slate-800 group-hover:text-brand-600 transition-colors leading-tight">تأسیسات ساختمان</h3>
                            </div>
                            <p class="text-[13px] text-slate-600 leading-relaxed font-bold">
                                <strong class="text-brand-600 text-[14px]">شامل:</strong> لوله‌کشی آب و فاضلاب و تعمیرات سیستم‌های سرمایشی و گرمایشی.
                            </p>
                        </a>

                        <!-- Category 2 -->
                        <a href="#services-detail" class="group bg-white p-6 rounded-[1.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100 flex flex-col gap-4 hover:border-amber-300 hover:shadow-[0_8px_30px_rgb(245,158,11,0.15)] hover:-translate-y-1 transition-all duration-300 text-right">
                            <div class="flex items-center gap-4 border-b border-slate-100 pb-4">
                                <div class="w-16 h-16 shrink-0 bg-slate-50 rounded-full flex items-center justify-center shadow-inner group-hover:bg-amber-50 transition-colors duration-300 p-3">
                                    <img src="https://img.icons8.com/color/96/idea.png" alt="برق‌کشی" class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300 drop-shadow-sm" />
                                </div>
                                <h3 class="text-[17px] font-black text-slate-800 group-hover:text-amber-500 transition-colors leading-tight">برق‌کشی و روشنایی</h3>
                            </div>
                            <p class="text-[13px] text-slate-600 leading-relaxed font-bold">
                                <strong class="text-amber-500 text-[14px]">شامل:</strong> سیم‌کشی ساختمان، رفع اتصالی، نصب کلید و پریز و نورپردازی.
                            </p>
                        </a>

                        <!-- Category 3 -->
                        <a href="#magazine" class="group bg-white p-6 rounded-[1.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100 flex flex-col gap-4 hover:border-success-300 hover:shadow-[0_8px_30px_rgb(37,211,102,0.15)] hover:-translate-y-1 transition-all duration-300 text-right">
                            <div class="flex items-center gap-4 border-b border-slate-100 pb-4">
                                <div class="w-16 h-16 shrink-0 bg-slate-50 rounded-full flex items-center justify-center shadow-inner group-hover:bg-success-50 transition-colors duration-300 p-3">
                                    <img src="https://img.icons8.com/color/96/paint-roller.png" alt="بازسازی و دکوراسیون" class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300 drop-shadow-sm" />
                                </div>
                                <h3 class="text-[17px] font-black text-slate-800 group-hover:text-success-600 transition-colors leading-tight">بازسازی و دکوراسیون</h3>
                            </div>
                            <p class="text-[13px] text-slate-600 leading-relaxed font-bold">
                                <strong class="text-success-600 text-[14px]">شامل:</strong> نقاشی ساختمان، گچ‌کاری، کاشی‌کاری، کناف‌کاری و طراحی داخلی.
                            </p>
                        </a>

                        <!-- Category 4 -->
                        <a href="#magazine" class="group bg-white p-6 rounded-[1.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100 flex flex-col gap-4 hover:border-indigo-300 hover:shadow-[0_8px_30px_rgb(99,102,241,0.15)] hover:-translate-y-1 transition-all duration-300 text-right">
                            <div class="flex items-center gap-4 border-b border-slate-100 pb-4">
                                <div class="w-16 h-16 shrink-0 bg-slate-50 rounded-full flex items-center justify-center shadow-inner group-hover:bg-indigo-50 transition-colors duration-300 p-3">
                                    <img src="https://img.icons8.com/color/96/brick-wall.png" alt="خدمات بنایی و عمرانی" class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300 drop-shadow-sm" />
                                </div>
                                <h3 class="text-[17px] font-black text-slate-800 group-hover:text-indigo-500 transition-colors leading-tight">خدمات بنایی و عمرانی</h3>
                            </div>
                            <p class="text-[13px] text-slate-600 leading-relaxed font-bold">
                                <strong class="text-indigo-500 text-[14px]">شامل:</strong> تخریب، دیوارکشی، سیمان‌کاری و استحکام‌بنا.
                            </p>
                        </a>
                    </div>
                </div>

            </div>
        </section>

        <!-- ================= FEATURES (No White Box) ================= -->`;

let content = fs.readFileSync('worker.js', 'utf8');
const startMarker = '<!-- CATEGORIES GRID UNDER HERO -->';
const endMarker = '<!-- ================= FEATURES (No White Box) ================= -->';

let startIndex = content.indexOf(startMarker);
let endIndex = content.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
    let newContent = content.substring(0, startIndex) + replacement + content.substring(endIndex + endMarker.length);
    fs.writeFileSync('worker.js', newContent);
    console.log('Successfully applied changes!');
} else {
    console.log('Could not find markers in worker.js');
}
