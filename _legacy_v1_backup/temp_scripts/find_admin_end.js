const fs = require('fs');
const w = fs.readFileSync('worker.js', 'utf8');

const aIdx = w.indexOf('adminHTML');
console.log('aIdx:', aIdx);

// Look for lines after aIdx
const lines = w.substring(aIdx, aIdx + 25000).split('\n');
console.log('Total lines in block:', lines.length);

for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('export default') || lines[i].includes('async fetch') || lines[i].includes('export function') || lines[i].includes('const ')) {
        console.log(`Line ${i}:`, lines[i]);
    }
}
