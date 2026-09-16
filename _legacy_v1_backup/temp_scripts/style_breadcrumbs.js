const fs = require('fs');
let content = fs.readFileSync('worker.js', 'utf8');

// Update breadcrumb wrapper to move to the left (justify-end in RTL)
content = content.replace(
    '<nav class="flex text-sm text-slate-500 mb-6 justify-center" aria-label="Breadcrumb">',
    '<nav class="flex text-sm text-slate-500 mb-6 justify-end" aria-label="Breadcrumb">'
);

// Add box styling (border, padding, rounded, shadow, bg-white) to the ordered list
content = content.replace(
    '<ol class="inline-flex items-center space-x-1 space-x-reverse md:space-x-3">',
    '<ol class="inline-flex items-center space-x-1 space-x-reverse md:space-x-3 bg-white border border-slate-200 shadow-sm rounded-2xl px-5 py-3">'
);

fs.writeFileSync('worker.js', content);
console.log('Breadcrumbs moved to left and boxed.');
