const fs = require('fs');
const content = fs.readFileSync('worker.js', 'utf8');
const wIdx = content.indexOf('<!-- Why Choose Us Banner -->');
console.log(content.substring(wIdx - 200, wIdx + 3000));
