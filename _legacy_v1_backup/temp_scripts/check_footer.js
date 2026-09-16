const fs = require('fs');
let content = fs.readFileSync('worker.js', 'utf8');

const sIdx = content.indexOf('bg-brand-50 border border-brand-200');
if (sIdx !== -1) {
    const start = Math.max(0, sIdx - 50);
    console.log("Found at:", sIdx);
    console.log(content.substring(start, start + 500));
} else {
    console.log('Not found');
}
