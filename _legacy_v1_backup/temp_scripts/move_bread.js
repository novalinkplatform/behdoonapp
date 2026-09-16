const fs = require('fs');
let content = fs.readFileSync('worker.js', 'utf8');

const target = '<nav class="flex text-sm text-slate-500 mb-6 justify-end" aria-label="Breadcrumb">';
const replacement = '<nav class="flex text-sm text-slate-500 mb-6 justify-start" aria-label="Breadcrumb">';

if (content.includes(target)) {
    content = content.replace(target, replacement);
    fs.writeFileSync('worker.js', content);
    console.log('Breadcrumbs moved to the right (justify-start in RTL)!');
} else {
    console.log('Target not found!');
}
