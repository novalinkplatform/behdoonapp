const fs = require('fs');
let content = fs.readFileSync('worker.js', 'utf8');
const matches = content.match(/"name": "[^"]+"/g);
if (matches) {
    console.log(matches.join('\n'));
} else {
    console.log('No matches');
}
