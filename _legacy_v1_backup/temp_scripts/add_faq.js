const fs = require('fs');

let content = fs.readFileSync('worker.js', 'utf8');

const homeFAQHtml = `
    <!-- General FAQ Section -->
    <div class="py-20 bg-white border-t border-slate-100 relative" id="faq">
        <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNlMmU4ZjAiLz48L3N2Zz4=')] opacity-30"></div>
        <div class="container mx-auto px-4 max-w-4xl relative z-10">
            <div class="text-center mb-12">
                <h2 class="text-2xl md:text-3xl font-black text-slate-800 mb-4 tracking-tight">سؤالات متداول شما</h2>
                <p class="text-slate-500 text-sm">پاسخ به پرتکرارترین پرسش‌ها درباره نحوه ارائه خدمات بهدون</p>
            </div>
            
            <div class="space-y-4">
                
                <details class="group bg-slate-50 border border-slate-200 rounded-2xl shadow-sm hover:border-brand-300 transition-colors [&_summary::-webkit-details-marker]:hidden">
                    <summary class="flex cursor-pointer items-center justify-between gap-1.5 p-5 md:p-6 text-slate-800 font-bold select-none">
                        <h3 class="text-[15px] md:text-base">محدوده خدمت‌رسانی بهدون کجاست؟</h3>
                        <span class="relative size-5 shrink-0 text-brand-500">
                            <svg class="absolute inset-0 size-5 opacity-100 group-open:opacity-0 transition-opacity" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"></path></svg>
                            <svg class="absolute inset-0 size-5 opacity-0 group-open:opacity-100 transition-opacity" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12h-15"></path></svg>
                        </span>
                    </summary>
                    <div class="px-5 md:px-6 pb-6 text-slate-600 leading-loose text-[14px]">
                        <p>خدمات بهدون در حال حاضر تمامی مناطق شمال، جنوب، شرق، غرب و مرکز تهران را پوشش می‌دهد. پس از ثبت درخواست، تکنسین‌های ما از نزدیک‌ترین پایگاه به محل شما اعزام می‌شوند.</p>
                    </div>
                </details>

                <details class="group bg-slate-50 border border-slate-200 rounded-2xl shadow-sm hover:border-brand-300 transition-colors [&_summary::-webkit-details-marker]:hidden">
                    <summary class="flex cursor-pointer items-center justify-between gap-1.5 p-5 md:p-6 text-slate-800 font-bold select-none">
                        <h3 class="text-[15px] md:text-base">آیا خدمات فنی و تعمیرات بهدون ضمانت دارد؟</h3>
                        <span class="relative size-5 shrink-0 text-brand-500">
                            <svg class="absolute inset-0 size-5 opacity-100 group-open:opacity-0 transition-opacity" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"></path></svg>
                            <svg class="absolute inset-0 size-5 opacity-0 group-open:opacity-100 transition-opacity" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12h-15"></path></svg>
                        </span>
                    </summary>
                    <div class="px-5 md:px-6 pb-6 text-slate-600 leading-loose text-[14px]">
                        <p>بله، شفافیت و کیفیت اصول اولیه ماست. تمامی خدمات ارائه شده توسط تکنسین‌های بهدون، چه در بخش تأسیسات و برق و چه در بازسازی، پس از انجام کار تست شده و با فاکتور رسمی و ضمانت کیفیت به شما تحویل داده می‌شود.</p>
                    </div>
                </details>

                <details class="group bg-slate-50 border border-slate-200 rounded-2xl shadow-sm hover:border-brand-300 transition-colors [&_summary::-webkit-details-marker]:hidden">
                    <summary class="flex cursor-pointer items-center justify-between gap-1.5 p-5 md:p-6 text-slate-800 font-bold select-none">
                        <h3 class="text-[15px] md:text-base">هزینه خدمات چگونه محاسبه می‌شود؟</h3>
                        <span class="relative size-5 shrink-0 text-brand-500">
                            <svg class="absolute inset-0 size-5 opacity-100 group-open:opacity-0 transition-opacity" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"></path></svg>
                            <svg class="absolute inset-0 size-5 opacity-0 group-open:opacity-100 transition-opacity" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12h-15"></path></svg>
                        </span>
                    </summary>
                    <div class="px-5 md:px-6 pb-6 text-slate-600 leading-loose text-[14px]">
                        <p>هزینه‌ها در بهدون کاملاً شفاف و بر اساس نرخ‌نامه منصفانه است. پیش از شروع هرگونه تعمیرات، تکنسین بررسی اولیه را انجام داده و برآورد دقیقی از هزینه‌ها (شامل دستمزد و قطعات در صورت نیاز) را به شما اعلام می‌کند.</p>
                    </div>
                </details>

                <details class="group bg-slate-50 border border-slate-200 rounded-2xl shadow-sm hover:border-brand-300 transition-colors [&_summary::-webkit-details-marker]:hidden">
                    <summary class="flex cursor-pointer items-center justify-between gap-1.5 p-5 md:p-6 text-slate-800 font-bold select-none">
                        <h3 class="text-[15px] md:text-base">ساعات کاری و پاسخگویی بهدون به چه صورت است؟</h3>
                        <span class="relative size-5 shrink-0 text-brand-500">
                            <svg class="absolute inset-0 size-5 opacity-100 group-open:opacity-0 transition-opacity" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"></path></svg>
                            <svg class="absolute inset-0 size-5 opacity-0 group-open:opacity-100 transition-opacity" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12h-15"></path></svg>
                        </span>
                    </summary>
                    <div class="px-5 md:px-6 pb-6 text-slate-600 leading-loose text-[14px]">
                        <p>تیم پشتیبانی ما همه روزه آماده پاسخگویی به شماست. در موارد اورژانسی مانند ترکیدگی لوله، نشتی شدید یا اتصالی برق، تلاش می‌کنیم اعزام تکنسین در سریع‌ترین زمان ممکن انجام شود.</p>
                    </div>
                </details>

            </div>
        </div>
    </div>
`;

// Inject into home page before Mobile CTA Space Filler
if (content.includes('<!-- Mobile CTA Space Filler -->') && !content.includes('<!-- General FAQ Section -->')) {
    content = content.replace('<!-- Mobile CTA Space Filler -->', homeFAQHtml + '\n\n    <!-- Mobile CTA Space Filler -->');
    console.log('Injected general FAQ to home page.');
}

// Update the service pages FAQ design to use interactive details/summary
const oldServiceFaqRegex = /<div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">[\s\S]*?<h3 class="font-bold text-slate-800 mb-2 flex items-start gap-2">[\s\S]*?<svg.*?<\/svg>[\s\S]*?\$\{f\.q\}[\s\S]*?<\/h3>[\s\S]*?<p class="text-sm text-slate-600 pr-7">\$\{f\.a\}<\/p>[\s\S]*?<\/div>/;

const newServiceFaqHtml = `
                        <details class="group bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-brand-300 transition-colors [&_summary::-webkit-details-marker]:hidden">
                            <summary class="flex cursor-pointer items-center justify-between gap-1.5 p-5 md:p-6 text-slate-800 font-bold select-none">
                                <h3 class="text-[15px] md:text-base">\${f.q}</h3>
                                <span class="relative size-5 shrink-0 text-brand-500">
                                    <svg class="absolute inset-0 size-5 opacity-100 group-open:opacity-0 transition-opacity" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"></path></svg>
                                    <svg class="absolute inset-0 size-5 opacity-0 group-open:opacity-100 transition-opacity" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12h-15"></path></svg>
                                </span>
                            </summary>
                            <div class="px-5 md:px-6 pb-6 text-slate-600 leading-loose text-[14px]">
                                <p>\${f.a}</p>
                            </div>
                        </details>
`;

if (oldServiceFaqRegex.test(content)) {
    content = content.replace(oldServiceFaqRegex, newServiceFaqHtml.trim());
    console.log('Updated service pages FAQ to interactive accordion.');
} else {
    console.log('Could not find old service FAQ pattern. Maybe it was already updated or regex failed.');
}

fs.writeFileSync('worker.js', content);
