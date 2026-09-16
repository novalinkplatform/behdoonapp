const fs = require('fs');
let content = fs.readFileSync('worker.js', 'utf8');
const lines = content.split('\n');
for(let i=100; i<300; i++){
    if(lines[i].includes('تأسیسات') || lines[i].includes('بازسازی') || lines[i].includes('خدمات')){
        console.log('Line ' + i + ': ' + lines[i].trim());
    }
}
