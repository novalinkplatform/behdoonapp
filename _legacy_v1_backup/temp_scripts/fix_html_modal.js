const fs = require('fs');

let code = fs.readFileSync('src/frontend.js', 'utf8');

// Read requestModalHTML from apply_full_upgrade.js or write it directly
const upgradeScript = fs.readFileSync('apply_full_upgrade.js', 'utf8');
const mStart = upgradeScript.indexOf('const requestModalHTML = `');
const mEnd = upgradeScript.indexOf('`;\n\n// --- 2. LOAD FRONTEND.JS ---', mStart);
const modalCode = upgradeScript.substring(mStart + 26, mEnd);

const hOldModalStart = code.indexOf('<!-- Submit Request Modal -->');
const trackStart = code.indexOf('export const trackHTML');

if (hOldModalStart !== -1 && trackStart !== -1) {
    const before = code.substring(0, hOldModalStart);
    const after = code.substring(trackStart);
    code = before + modalCode + '\n</body>\n</html>\n`;\n' + after;
    fs.writeFileSync('src/frontend.js', code);
    console.log('Homepage old modal replaced successfully!');
} else {
    console.log('Could not find boundaries:', { hOldModalStart, trackStart });
}
