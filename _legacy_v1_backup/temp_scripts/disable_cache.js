const fs = require('fs');
let content = fs.readFileSync('worker.js', 'utf8');

content = content.replace('"Cache-Control": "public, max-age=3600"', '"Cache-Control": "no-cache, no-store, must-revalidate"');

fs.writeFileSync('worker.js', content);
console.log('Cache-Control updated!');
