const fs = require('fs');
let content = fs.readFileSync('worker.js', 'utf8');

// Change justify-end to justify-start to align the breadcrumbs to the right
content = content.replace(
    '<nav class="flex text-sm text-slate-500 mb-6 justify-end" aria-label="Breadcrumb">',
    '<nav class="flex text-sm text-slate-500 mb-6 justify-start" aria-label="Breadcrumb">'
);

fs.writeFileSync('worker.js', content);
console.log('Breadcrumbs moved to the right.');
