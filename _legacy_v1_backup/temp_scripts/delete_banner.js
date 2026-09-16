const fs = require('fs');
let content = fs.readFileSync('worker.js', 'utf8');

const bannerMarker = '<!-- Why Choose Us Banner (HOMEPAGE ONLY) -->';
const sIdx = content.indexOf(bannerMarker);
if (sIdx !== -1) {
    const eIdx = content.indexOf('</div>', content.indexOf('</span>', content.indexOf('</span>', content.indexOf('</span>', sIdx)))) + 6;
    // Actually wait, let's just use string replace for the whole div
    const divStart = content.lastIndexOf('<div class="bg-white border border-slate-200', sIdx + 150);
    // Let's use regex that matches the whole banner block:
    const regex = /<!-- Why Choose Us Banner \(HOMEPAGE ONLY\) -->[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;
    
    // Instead of complex regex, let's just find the exact block and slice it:
    const textToCut = content.substring(sIdx, sIdx + 4500); 
    const endOfBannerIdx = textToCut.indexOf('<!-- Card 1: HVAC -->') - 100;
    
    // The banner is exactly before the grid: `<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4...`
    const gridIdx = content.indexOf('<div class="grid grid-cols-1 sm:grid-cols-2', sIdx);
    
    if (gridIdx !== -1) {
        content = content.substring(0, sIdx) + content.substring(gridIdx);
        fs.writeFileSync('worker.js', content);
        console.log('Successfully deleted the top banner!');
    } else {
        console.log('Could not find grid after banner');
    }
} else {
    console.log('Banner not found!');
}
