const fs = require('fs');
let content = fs.readFileSync('worker.js', 'utf8');

const sIdx = content.indexOf('سریع و آسان');
if (sIdx !== -1) {
    const start = Math.max(0, sIdx - 300);
    console.log(content.substring(start, start + 600));
} else {
    console.log('Not found');
}
