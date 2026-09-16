const fs = require('fs');
let content = fs.readFileSync('worker.js', 'utf8');

const sIdx = content.indexOf('<!-- ================= FOOTER ================= -->');
const eIdx = content.indexOf('</footer>');
console.log(content.substring(sIdx, eIdx + 9));
