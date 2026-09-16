const fs = require('fs');
let content = fs.readFileSync('worker.js', 'utf8');
const matches = content.match(/href="[^"]*#[^"]*"/g);
if (matches) {
    const unique = [...new Set(matches)];
    console.log(unique.join('\n'));
} else {
    console.log('No hash links found.');
}
