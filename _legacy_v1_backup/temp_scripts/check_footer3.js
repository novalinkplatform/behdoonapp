const fs = require('fs');
let content = fs.readFileSync('worker.js', 'utf8');

const matches = [...content.matchAll(/ثبت درخواست/g)];
if (matches.length > 0) {
    const last = matches[matches.length - 1];
    const start = Math.max(0, last.index - 300);
    console.log(content.substring(start, start + 600));
} else {
    console.log('Not found');
}
