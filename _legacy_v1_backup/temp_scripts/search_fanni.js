const fs = require('fs');
let content = fs.readFileSync('worker.js', 'utf8');
const lines = content.split('\n');
lines.forEach((line, i) => {
    if (line.includes('فنی')) {
        console.log(`Line ${i + 1}: ${line.trim()}`);
    }
});
