const fs = require('fs');
let content = fs.readFileSync('worker.js', 'utf8');
const sIdx = content.indexOf('<!-- CATEGORIES GRID UNDER HERO -->');
console.log(content.substring(sIdx, sIdx + 1000));
