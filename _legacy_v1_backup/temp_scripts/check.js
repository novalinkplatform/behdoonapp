const fs = require('fs');
const content = fs.readFileSync('worker.js', 'utf8');
const hIdx = content.indexOf('خدمات بهدون</h2>');
console.log(content.substring(hIdx - 800, hIdx + 500));
