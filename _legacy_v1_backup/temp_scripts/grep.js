const fs = require('fs');
const code = fs.readFileSync('src/frontend.js', 'utf8');
const lines = code.split('\n');
lines.forEach((l, i) => {
    if (l.includes('href="/services/')) {
        console.log(i, l.trim());
    }
});
