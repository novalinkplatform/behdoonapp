const fs = require('fs');
let content = fs.readFileSync('worker.js', 'utf8');

// The banner inside renderServicePage starts with <!-- Why Choose Us Banner -->
const sIdx = content.indexOf('<!-- Why Choose Us Banner -->', content.indexOf('renderServicePage'));
const endMarker = '<div class="flex flex-wrap justify-center gap-3 md:gap-4 pb-4">';
const eIdx = content.indexOf(endMarker, sIdx);

if (sIdx !== -1 && eIdx !== -1) {
    content = content.substring(0, sIdx) + content.substring(eIdx);
    fs.writeFileSync('worker.js', content);
    console.log('Removed banner from service page!');
} else {
    console.log('Banner not found in service page');
}
