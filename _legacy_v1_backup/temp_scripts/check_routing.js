const fs = require('fs');
let content = fs.readFileSync('worker.js', 'utf8');

// Find all else if statements
const regex = /else if[^{]*{/g;
let match;
while ((match = regex.exec(content)) !== null) {
    console.log(match[0]);
}

console.log('---');

// Also print the start of fetch
console.log(content.substring(0, 500));
