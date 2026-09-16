const fs = require('fs');
let content = fs.readFileSync('worker.js', 'utf8');

const regex = /<span class="text-xs text-slate-500 mb-0.5">شبکه‌های اجتماعی<\/span>\s*<span class="font-bold text-base text-slate-800 group-hover:text-pink-600 transition-colors">اینستاگرام بهدون<\/span>/g;

const replacement = `<span class="text-xs text-slate-500 mb-0.5">پیج اینستاگرام</span>
                            <span class="font-bold text-base text-slate-800 group-hover:text-pink-600 transition-colors dir-ltr text-left">behdoon.ir</span>`;

const matches = content.match(regex);
console.log('Matches:', matches ? matches.length : 0);

if (matches && matches.length > 0) {
    content = content.replace(regex, replacement);
    fs.writeFileSync('worker.js', content);
    console.log('Replaced successfully.');
}
