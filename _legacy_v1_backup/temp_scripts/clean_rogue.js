const fs = require('fs');
let code = fs.readFileSync('worker.js', 'utf8');

// There is a rogue <script> block that starts with:
// document.addEventListener('DOMContentLoaded', async () => {
// Let's find it.
const searchStr = "document.addEventListener('DOMContentLoaded', async () => {";
let idx = code.indexOf(searchStr);

while (idx !== -1) {
    // Find where the script tag started
    const scriptStart = code.lastIndexOf('<script>', idx);
    const scriptEnd = code.indexOf('</script>', idx) + 9;
    
    // Check if it's inside const html
    const htmlStart = code.indexOf('const html =');
    const adminHtmlStart = code.indexOf('const adminHTML =');
    
    if (scriptStart > htmlStart && scriptStart < adminHtmlStart) {
        console.log('Found rogue script inside html at index', scriptStart);
        code = code.substring(0, scriptStart) + code.substring(scriptEnd);
        // Find next one (after removing this one, idx shifts, but we'll just search from beginning)
        idx = code.indexOf(searchStr);
    } else {
        idx = code.indexOf(searchStr, idx + 1);
    }
}

// I also notice there's another one: `async function updateStatus`
const searchStr2 = "async function updateStatus(id, newStatus) {";
let idx2 = code.indexOf(searchStr2);

while (idx2 !== -1) {
    const scriptStart = code.lastIndexOf('<script>', idx2);
    // Wait, earlier the <script src="https://cdn.tailwindcss.com"> wasn't closed!
    // Ah!! That's why regex didn't match it!
    // The previous script tag was <script src="...tailwindcss.com"> (no closing tag maybe, or it enclosed everything!)
    // Let's just find the exact updateStatus block inside html.
    const adminHtmlStart = code.indexOf('const adminHTML =');
    if (idx2 < adminHtmlStart) {
        console.log('Found rogue updateStatus at index', idx2);
        const scriptStart = code.lastIndexOf('<script', idx2);
        const scriptEnd = code.indexOf('</script>', idx2) + 9;
        
        // Wait, if it's the tailwind script, we can't remove the <script src=...> part.
        // Let's just remove the JS code itself.
        const tailwindStart = code.lastIndexOf('<script src="https://cdn.tailwindcss.com"></script>', idx2);
        
        if (scriptStart !== -1) {
            code = code.substring(0, scriptStart) + '<script src="https://cdn.tailwindcss.com"></script>' + code.substring(scriptEnd);
            idx2 = code.indexOf(searchStr2);
            continue;
        }
    }
    idx2 = code.indexOf(searchStr2, idx2 + 1);
}

fs.writeFileSync('worker.js', code);
console.log('Cleaned worker.js');
