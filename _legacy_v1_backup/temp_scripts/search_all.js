const fs = require('fs');
const path = require('path');

function searchDir(dir) {
    const files = fs.readdirSync(dir);
    for (const f of files) {
        const full = path.join(dir, f);
        if (f === 'node_modules' || f === '.git' || f === '.wrangler') continue;
        const stat = fs.statSync(full);
        if (stat.isDirectory()) {
            searchDir(full);
        } else {
            try {
                const content = fs.readFileSync(full, 'utf8');
                if (content.includes('بیمه') || content.includes('بارنامه')) {
                    console.log(`Found match in file: ${full}`);
                    const lines = content.split('\n');
                    lines.forEach((l, idx) => {
                        if (l.includes('بیمه') || l.includes('بارنامه')) {
                            console.log(`  Line ${idx + 1}: ${l.trim()}`);
                        }
                    });
                }
            } catch(e) {}
        }
    }
}

searchDir('.');
