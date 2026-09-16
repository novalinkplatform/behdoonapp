const fs = require('fs');
const content = fs.readFileSync('src/frontend.js', 'utf8');

const mStart = content.indexOf('export const magazineHTML');
const mEnd = content.indexOf('export const singleArticleHTML');
console.log('magazineHTML:');
console.log(content.substring(mStart, mEnd));

const sStart = content.indexOf('export const singleArticleHTML');
const sEnd = content.indexOf('export const servicesData');
console.log('singleArticleHTML:');
console.log(content.substring(sStart, sEnd));
