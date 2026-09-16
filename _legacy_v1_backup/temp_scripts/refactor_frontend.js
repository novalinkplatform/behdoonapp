const fs = require('fs');

let code = fs.readFileSync('src/frontend.js', 'utf8');

// 1. Update category cards in the homepage to say "مشاهده خدمات و زیردسته‌ها" instead of "ثبت درخواست"
code = code.replace(
    /<div class="flex items-center text-\[#8B1C31\] text-sm font-bold">\s*ثبت درخواست\s*<svg/g,
    '<div class="flex items-center text-brand-600 text-sm font-bold">مشاهده خدمات و زیردسته‌ها <svg'
);

// 2. Add prominent Request button inside renderServicePage tabs
const oldTabPlaceholder = '<div class="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-8 md:p-12 text-center">';
const newTabContent = `
                <div class="bg-slate-50 border border-slate-200 rounded-3xl p-6 md:p-10 text-center shadow-sm">
                    <div class="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm text-brand-600 border border-slate-100">
                        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="\${sub.icon}"></path></svg>
                    </div>
                    <h3 class="text-xl font-black text-slate-800 mb-3">خدمات تخصصی \${sub.name} در تهران</h3>
                    <p class="text-sm text-slate-600 max-w-xl mx-auto leading-relaxed mb-6">
                        تیم تکنسین‌های مجرب بهدون آماده ارائه کلیه خدمات «\${sub.name}» با تجهیزات استاندارد، قطعات اصل و ضمانت کتبی کیفیت در تمامی مناطق تهران هستند.
                    </p>
                    <div class="flex flex-wrap items-center justify-center gap-3">
                        <button type="button" onclick="openRequestModal('\${sub.name}')" class="inline-flex items-center justify-center gap-2 bg-[#8B1C31] hover:bg-[#701627] text-white px-7 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-[#8B1C31]/20 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                            <span>ثبت آنلاین درخواست \${sub.name}</span>
                        </button>
                        <a href="tel:02122345678" class="inline-flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-6 py-3 rounded-2xl font-bold text-sm transition-colors">
                            <svg class="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 512 512"><path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"/></svg>
                            <span>مشاوره تلفنی رایگان</span>
                        </a>
                    </div>
                </div>
`;

// Replace tab content in renderServicePage if exists
if (code.includes(oldTabPlaceholder)) {
    // Find the placeholder block inside renderServicePage and replace it
    const pStart = code.indexOf(oldTabPlaceholder);
    const pEnd = code.indexOf('</div>\n            </div>', pStart);
    if (pStart !== -1 && pEnd !== -1) {
        code = code.substring(0, pStart) + newTabContent.trim() + '\n            </div>' + code.substring(pEnd + 23);
    }
}

fs.writeFileSync('src/frontend.js', code);
console.log('Homepage cards and service page tabs updated.');
