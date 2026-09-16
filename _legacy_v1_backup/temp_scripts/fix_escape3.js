const fs = require('fs');

const adminSrc = fs.readFileSync('admin_source.html', 'utf8');

// The goal is to insert adminSrc exactly as a string into a JS template literal.
// So we must escape \ -> \\
// then ` -> \`
// then $ -> \$
const escaped = adminSrc
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$/g, '\\$');

let content = fs.readFileSync('worker.js', 'utf8');

// Because I messed up worker.js earlier and we don't know exactly how many \` are there,
// let's just find the start: `const adminHTML = `
const startTag = 'const adminHTML = `';
const endTag = "let htmlResponse = '';";

const sIdx = content.indexOf(startTag);
const eIdx = content.indexOf(endTag);

content = content.substring(0, sIdx) + startTag + '\n' + escaped + '\n`;\n\n        ' + content.substring(eIdx);

fs.writeFileSync('worker.js', content);
console.log('Admin UI correctly injected');
