const fs = require('fs');
let content = fs.readFileSync('worker.js', 'utf8');

const sIdx = content.indexOf('const html = `');
console.log('Start index:', sIdx);

// Find the first occurrence of `; after sIdx
let eIdx = content.indexOf('`;', sIdx);
console.log('End index:', eIdx);

console.log(content.substring(eIdx - 200, eIdx + 200));
