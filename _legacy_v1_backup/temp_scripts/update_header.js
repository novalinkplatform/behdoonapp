const fs = require('fs');
let content = fs.readFileSync('worker.js', 'utf8');

// The home header has:
// <div class="flex items-center gap-3">
//    <div class="bg-brand-500 text-white p-2 rounded-full shadow-md">

content = content.replace(
    /<div class="flex items-center gap-3">\s*<div class="bg-brand-500 text-white p-2 rounded-full shadow-md">([\s\S]*?)<span class="text-\[10px\] font-bold text-brand-400 mt-1">خدمات حرفه‌ای ساختمان<\/span>\s*<\/div>\s*<\/div>/g,
    `<a href="/" onclick="window.location.href='/'; return false;" class="flex items-center gap-3 cursor-pointer">
        <div class="bg-brand-500 text-white p-2 rounded-full shadow-md">$1<span class="text-[10px] font-bold text-brand-400 mt-1">خدمات حرفه‌ای ساختمان</span></div>
    </a>`
);

// We should also check the headerHTML variable where I might have added it.
// The new header uses:
// <a href="/" class="flex items-center gap-2 group">
content = content.replace(
    /<a href="\/" class="flex items-center gap-2 group">/g,
    `<a href="/" onclick="window.location.href='/'; return false;" class="flex items-center gap-2 group">`
);

fs.writeFileSync('worker.js', content);
console.log('Done.');
