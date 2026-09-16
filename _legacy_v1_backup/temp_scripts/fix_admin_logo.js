const fs = require('fs');
let code = fs.readFileSync('worker.js', 'utf8');

const target1 = '<div class="flex items-center gap-2 bg-white/80 p-2 px-3 rounded-xl shadow-sm">';
const replacement1 = '<a href="/admin" class="flex items-center gap-2 bg-white/80 p-2 px-3 rounded-xl shadow-sm hover:bg-slate-50 transition-colors" title="رفرش و بازگشت به داشبورد">';
code = code.replace(target1, replacement1);

const target2 = '<span class="text-xl font-black text-[#8B1C31] tracking-tight">بهدون</span>\n                </div>';
const replacement2 = '<span class="text-xl font-black text-[#8B1C31] tracking-tight">بهدون</span>\n                </a>';
code = code.replace(target2, replacement2);

// Let's also check if the user meant the frontend logo!
// Frontend logo: `<a href="/" class="flex items-center gap-2">` (it's already a link).

fs.writeFileSync('worker.js', code);
