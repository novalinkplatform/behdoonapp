const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.js'));
for (const f of files) {
    const content = fs.readFileSync(f, 'utf8');
    if (content.includes('frontend.js')) {
        console.log('Found frontend.js in:', f);
    }
}
