const fs = require('fs');

let content = fs.readFileSync('worker.js', 'utf8');

const ctaRegex = /<div class="bg-white p-4 rounded-xl border border-slate-200 inline-block">[\s\S]*?0933 325 6885<\/a>\s*<\/div>/g;
const row4Regex = /<!-- ROW 4: Copyright & Legal -->[\s\S]*?قوانین و مقررات<\/a>\s*<\/div>\s*<\/div>/g;

let matchesCta = (content.match(ctaRegex) || []).length;
let matchesRow4 = (content.match(row4Regex) || []).length;

console.log('CTA matches:', matchesCta);
console.log('Row4 matches:', matchesRow4);

if (matchesCta > 0 && matchesRow4 > 0) {
    content = content.replace(ctaRegex, '');
    content = content.replace(row4Regex, '');
    fs.writeFileSync('worker.js', content);
    console.log('Removed from worker.js');
} else {
    console.log('Regex did not match everything properly!');
}
