const fs = require('fs');
let content = fs.readFileSync('worker.js', 'utf8');

// We only want to modify within renderServicePage to avoid breaking homepage.
const startIdx = content.indexOf('function renderServicePage(serviceId) {');
const endIdx = content.indexOf('return customHeader + heroSection + subServicesHtml + contentSection + footerHTML;', startIdx);

if (startIdx === -1 || endIdx === -1) {
    console.error('Could not find renderServicePage bounds');
    process.exit(1);
}

let funcBody = content.substring(startIdx, endIdx);

// Fix hero padding
funcBody = funcBody.replace('pt-20 pb-16', 'pt-12 md:pt-16 pb-8 md:pb-12');
funcBody = funcBody.replace('mb-6 leading-snug', 'mb-4 md:mb-6 leading-snug');
funcBody = funcBody.replace('mb-10', 'mb-6 md:mb-8');

// Fix subServices
funcBody = funcBody.replace('flex overflow-x-auto gap-4 pb-4 snap-x hide-scrollbar md:grid md:grid-cols-3 lg:grid-cols-4', 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 pb-2');
funcBody = funcBody.replace('flex-none w-48 md:w-auto cursor-default', 'cursor-default');
funcBody = funcBody.replace('-mt-6 relative z-20 mb-16', '-mt-4 md:-mt-6 relative z-20 mb-8 md:mb-12');
funcBody = funcBody.replace('p-5 rounded-2xl', 'p-4 md:p-5 rounded-2xl');

// Fix contentSection
funcBody = funcBody.replace('mb-16 mt-8', 'mb-8 md:mb-12 mt-2 md:mt-6');
funcBody = funcBody.replace('p-8 md:p-12', 'p-6 md:p-10');
funcBody = funcBody.replace('p-6 md:p-10 mt-12', 'p-6 md:p-10 mt-8 md:mt-12'); // The FAQ section

// Put it back
content = content.substring(0, startIdx) + funcBody + content.substring(endIdx);
fs.writeFileSync('worker.js', content);
console.log('Layout updated with tighter, responsive spacing!');
