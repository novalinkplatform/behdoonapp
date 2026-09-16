const fs = require('fs');
let content = fs.readFileSync('worker.js', 'utf8');

const target = 'grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-10 w-full max-w-4xl mx-auto';
const replacement = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10 w-full max-w-6xl mx-auto';

if (content.includes(target)) {
    content = content.replace(target, replacement);
    fs.writeFileSync('worker.js', content);
    console.log('Footer grid columns updated.');
} else {
    console.log('Target grid class not found.');
}
