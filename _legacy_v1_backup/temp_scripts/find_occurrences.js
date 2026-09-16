const fs = require('fs');
const content = fs.readFileSync('src/frontend.js', 'utf8');

const query = 'خدمات حرفه‌ای ساختمان در تهران';
let pos = 0;
let count = 0;
while ((pos = content.indexOf(query, pos)) !== null && pos !== -1) {
    count++;
    console.log(`Occurrence ${count} at pos ${pos}:`);
    console.log(content.substring(Math.max(0, pos - 100), Math.min(content.length, pos + query.length + 100)));
    console.log('-------------------------------------------');
    pos += query.length;
}
console.log('Total occurrences:', count);
