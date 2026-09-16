const fs = require('fs');
const readline = require('readline');

const file = 'C:/Users/Administrator/.gemini/antigravity/brain/eae08ade-921b-4f2d-b04f-9b80bcb702e4/.system_generated/logs/transcript.jsonl';

const rl = readline.createInterface({
    input: fs.createReadStream(file),
    crlfDelay: Infinity
});

let lineNum = 0;
rl.on('line', (line) => {
    lineNum++;
    try {
        const obj = JSON.parse(line);
        if (obj.type === 'USER_INPUT') {
            console.log(`[USER_INPUT #${lineNum}]:`, obj.content);
        }
        if (line.includes('بیمه') || line.includes('بارنامه')) {
            console.log(`[MATCH at line ${lineNum}]:`, line.substring(0, 300));
        }
    } catch(e) {}
});
