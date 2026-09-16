const fs = require('fs');
let content = fs.readFileSync('src/frontend.js', 'utf8');

const regex = /(<a href="\/" onclick="window\.location\.href='\/'; return false;" class="flex items-center gap-2 group">[\s\S]*?<div class="w-12 h-12[^>]*>[\s\S]*?<\/div>)\s*<div>[\s\S]*?<\/div>(\s*<\/a>)/;

const replaceWith = `$1
                    <div class="flex items-center gap-2">
                        <span class="font-black text-lg md:text-xl text-brand-600 tracking-tight">بهدون</span>
                        <span class="text-slate-300 text-xs">|</span>
                        <span class="text-[10px] md:text-[11px] text-slate-500 font-medium whitespace-nowrap">خدمات حرفه‌ای ساختمان در تهران</span>
                    </div>$2`;

if (regex.test(content)) {
    content = content.replace(regex, replaceWith);
    fs.writeFileSync('src/frontend.js', content, 'utf8');
    console.log('Successfully updated logo in headerHTML with regex!');
} else {
    console.warn('Regex did not match in headerHTML');
}
