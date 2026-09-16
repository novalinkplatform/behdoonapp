const fs = require('fs');
let code = fs.readFileSync('worker.js', 'utf8');
code = code.replace(/\$\{data\.faq\.map/g, '${(data.faq || []).map');
fs.writeFileSync('worker.js', code);
console.log('Fixed faq!');
