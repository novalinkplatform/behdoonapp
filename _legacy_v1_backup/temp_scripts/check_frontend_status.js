const fs = require('fs');
const content = fs.readFileSync('src/frontend.js', 'utf8');

console.log('Total length:', content.length);
console.log('Contains servicesData:', content.includes('export const servicesData'));
console.log('Contains renderServicePage:', content.includes('renderServicePage'));
console.log('Contains renderSubServicePage:', content.includes('renderSubServicePage'));
console.log('Contains headerHTML:', content.includes('export const headerHTML'));
console.log('Contains footerHTML:', content.includes('export const footerHTML'));
console.log('Contains html:', content.includes('export const html'));

// Check servicesData keys
const sIndex = content.indexOf('export const servicesData');
if (sIndex !== -1) {
    const sSub = content.substring(sIndex, sIndex + 500);
    console.log('servicesData snippet:\n', sSub);
}

// Find where renderServicePage starts
const rIndex = content.indexOf('function renderServicePage');
console.log('renderServicePage index:', rIndex);
if (rIndex !== -1) {
    console.log('Context before renderServicePage:\n', content.substring(rIndex - 200, rIndex + 100));
}
