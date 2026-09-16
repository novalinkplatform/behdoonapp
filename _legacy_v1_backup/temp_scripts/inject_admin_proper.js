const fs = require('fs');
let content = fs.readFileSync('worker.js', 'utf8');
const adminSrc = fs.readFileSync('admin_source.html', 'utf8');

const sIdx = content.indexOf('const adminHTML = `');
const eIdx = content.indexOf("let htmlResponse = '';");

// We need to double-escape backticks and dollar signs for the JS template string context in worker.js
const escapedAdminSrc = adminSrc.replace(/`/g, '\\`').replace(/\$/g, '\\$');

content = content.substring(0, sIdx) + 'const adminHTML = `\n' + escapedAdminSrc + '\n`;\n\n        ' + content.substring(eIdx);

fs.writeFileSync('worker.js', content);
console.log('Successfully injected properly escaped adminHTML');
