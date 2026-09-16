const fs = require('fs');
let content = fs.readFileSync('worker.js', 'utf8');

// Replace "مشاهده جزئیات" with "ثبت درخواست" only inside the grid
// Let's replace it globally for the cards since it's the exact phrase.
content = content.replace(/مشاهده جزئیات/g, 'ثبت درخواست');

// Replace SVGs
// 1. HVAC SVG
const hvacRegex = /<svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 3v18m-4-14h8m-8 10h8M6 8a6 6 0 1112 0 6 6 0 01-12 0z"><\/path><\/svg>/g;
const newHvacSvg = `<svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19.5 17.25v2.25a2.25 2.25 0 01-2.25 2.25H6.75a2.25 2.25 0 01-2.25-2.25v-2.25m15 0v-5.25a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v5.25m15 0h-15M12 12.75v-3.75m0 0c0-1.243-.63-2.39-1.593-3.068a3.745 3.745 0 01-1.043-3.296m2.636 6.364c1.243 0 2.39-.63 3.068-1.593a3.746 3.746 0 003.296-1.043"></path></svg>`;
content = content.replace(hvacRegex, newHvacSvg);

// 2. Plumbing SVG
const plumbRegex = /<svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19.428 15.428a2 2 0 00-1.022-\.547l-2.387-\.477a6 6 0 00-3.86\.517l-\.318\.158a6 6 0 01-3.86\.517L6.05 15.21a2 2 0 00-1.806\.547M8 4h8l-1 1v5.172a2 2 0 00\.586 1.414l5 5c1.26 1.26\.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"><\/path><\/svg>/g;
const plumbRegexAlt = /<svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">[\s\S]*?M19\.428[\s\S]*?<\/svg>/g;
const newPlumbSvg = `<svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z"></path></svg>`;
content = content.replace(plumbRegexAlt, newPlumbSvg);

// 3. Electrical SVG (M13 10V3L4 14h7v7l9-11h-7z) -> Replace with a better lightning bolt or plug.
const elecRegex = /<svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">[\s\S]*?M13 10V3L4 14h7v7l9-11h-7z[\s\S]*?<\/svg>/g;
const newElecSvg = `<svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"></path></svg>`;
content = content.replace(elecRegex, newElecSvg);

// 4. Renovation SVG (M19 21V5a2 2 0 00-2-2H7...)
const renovRegex = /<svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">[\s\S]*?M19 21V5a2 2 0 00-2-2H7[\s\S]*?<\/svg>/g;
const newRenovSvg = `<svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z"></path></svg>`; 
// Wait, I reused the Wrench for Renovation? Let me use a Paint Roller for Renovation.
const rollerSvg = `<svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.879-3.879a3 3 0 10-4.242-4.242l-3.879 3.879a15.995 15.995 0 00-4.648 4.764M12 12l5.25-5.25"></path></svg>`; // Roller brush
content = content.replace(renovRegex, rollerSvg);

fs.writeFileSync('worker.js', content);
console.log('SVGs and Text updated.');
