const fs = require('fs');
let content = fs.readFileSync('worker.js', 'utf8');

const idx = content.indexOf('<section class="py-10 md:py-16 relative z-20 -mt-16 md:-mt-24" id="services">');
if (idx !== -1) {
    console.log(content.substring(idx, idx + 2000));
} else {
    console.log('Services section not found');
}
