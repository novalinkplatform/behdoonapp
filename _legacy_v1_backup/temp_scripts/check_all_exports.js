const fs = require('fs');
const content = fs.readFileSync('src/frontend.js', 'utf8');

const exportsList = [
    'export const headerHTML',
    'export const footerHTML',
    'export const html',
    'export const trackHTML',
    'export const magazineHTML',
    'export const singleArticleHTML',
    'export const servicesData',
    'function renderServicePage',
    'export function renderServicePage',
    'export function renderSubServicePage'
];

for (const exp of exportsList) {
    const idx = content.indexOf(exp);
    console.log(exp, 'index:', idx);
}
