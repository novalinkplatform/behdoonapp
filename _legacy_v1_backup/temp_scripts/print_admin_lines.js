const fs = require('fs');
const w = fs.readFileSync('worker.js', 'utf8');

const aIdx = w.indexOf('adminHTML');
const lines = w.substring(aIdx, aIdx + 25000).split('\n');
console.log(lines.slice(215, 285).join('\n'));
