const fs = require('fs');

let content = fs.readFileSync('src/frontend.js', 'utf8');

// Replace in headerHTML
const targetHeader = `<div>
                        <div class="font-black text-xl text-brand-600 tracking-tight">بهدون</div>
                        <div class="text-[10px] text-slate-500 font-bold tracking-wider">خدمات حرفه‌ای ساختمان</div>
                    </div>`;

const replaceHeader = `<div class="flex items-center gap-2">
                        <span class="font-black text-lg md:text-xl text-brand-600 tracking-tight">بهدون</span>
                        <span class="text-slate-300 text-xs">|</span>
                        <span class="text-[10px] md:text-[11px] text-slate-500 font-medium whitespace-nowrap">خدمات حرفه‌ای ساختمان در تهران</span>
                    </div>`;

if (content.includes(targetHeader)) {
    content = content.replace(targetHeader, replaceHeader);
    fs.writeFileSync('src/frontend.js', content, 'utf8');
    console.log('Successfully replaced logo in headerHTML!');
} else {
    console.warn('targetHeader still not matched in src/frontend.js');
}
