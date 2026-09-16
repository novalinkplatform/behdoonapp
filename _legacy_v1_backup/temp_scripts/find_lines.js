const fs = require('fs');
const code = fs.readFileSync('src/frontend.js', 'utf8');
const lines = code.split('\n');

lines.forEach((line, idx) => {
    if (line.includes('id="requestModal"')) {
        console.log('requestModal at line:', idx + 1);
    }
    if (line.includes('function openModal')) {
        console.log('openModal at line:', idx + 1);
    }
    if (line.includes('function openRequestModal')) {
        console.log('openRequestModal at line:', idx + 1);
    }
    if (line.includes('DOMContentLoaded') && line.includes('ثبت درخواست')) {
        console.log('interceptor at line:', idx + 1);
    }
});
