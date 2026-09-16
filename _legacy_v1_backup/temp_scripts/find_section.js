const fs = require('fs');
let content = fs.readFileSync('worker.js', 'utf8');

const idx = content.indexOf('راهنمای جامع خدمات تخصصی');
if (idx !== -1) {
    console.log(content.substring(idx - 1000, idx + 2000));
}
