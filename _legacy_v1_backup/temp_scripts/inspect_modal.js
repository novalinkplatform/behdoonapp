const fs = require('fs');

const content = fs.readFileSync('src/frontend.js', 'utf8');

const mIdx = content.indexOf('requestModal');
const mIdx2 = content.indexOf('openRequestModal');

console.log('mIdx:', mIdx, 'mIdx2:', mIdx2);

if (mIdx !== -1) {
    console.log('requestModal snippet:');
    console.log(content.substring(mIdx - 100, mIdx + 1500));
}
