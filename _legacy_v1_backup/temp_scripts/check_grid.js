const fs = require('fs');
let content = fs.readFileSync('worker.js', 'utf8');
const gridIdx = content.indexOf('<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">');
console.log(content.substring(gridIdx, gridIdx + 500));
