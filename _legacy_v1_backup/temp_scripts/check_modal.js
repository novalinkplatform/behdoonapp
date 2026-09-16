const fs = require('fs');
const frontend = fs.readFileSync('src/frontend.js', 'utf8');
const htmlStart = frontend.indexOf('export const html = `');
const mStart = frontend.indexOf('requestModal', htmlStart);
console.log(frontend.substring(mStart - 50, mStart + 500));
