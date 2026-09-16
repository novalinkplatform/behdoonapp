const fs = require('fs');

const content = fs.readFileSync('src/frontend.js', 'utf8');

function findMatches(term) {
    console.log(`=== Searching for "${term}" ===`);
    let pos = 0;
    let count = 0;
    while ((pos = content.indexOf(term, pos)) !== -1) {
        count++;
        console.log(`Match ${count} at pos ${pos}:`);
        console.log(content.substring(Math.max(0, pos - 150), Math.min(content.length, pos + term.length + 150)));
        console.log('--------------------------------------------------');
        pos += term.length;
    }
    console.log(`Total "${term}": ${count}\n`);
}

findMatches('بیمه');
findMatches('بارنامه');
