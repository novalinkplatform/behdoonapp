const fs = require('fs');
let content = fs.readFileSync('worker.js', 'utf8');
const lines = content.split('\n');
const index = lines.findIndex(l => l.includes('id="magazine"'));
console.log(lines.slice(index - 5, index + 35).join('\n'));
