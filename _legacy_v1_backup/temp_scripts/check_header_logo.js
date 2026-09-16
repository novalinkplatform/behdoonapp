const fs = require('fs');
const content = fs.readFileSync('src/frontend.js', 'utf8');

const hStart = content.indexOf('export const headerHTML');
const hEnd = content.indexOf('export const footerHTML');
const header = content.substring(hStart, hEnd);

const logoMatches = header.match(/<!-- Logo -->[\s\S]*?<\/a>/);
if (logoMatches) {
    console.log('Logo in headerHTML:');
    console.log(logoMatches[0]);
} else {
    console.log('Logo comment not found in headerHTML');
}
