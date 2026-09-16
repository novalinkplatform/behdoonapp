const fs = require('fs');
let code = fs.readFileSync('worker.js', 'utf8');

// The bottom nav block is already in the file. Let's find it and add it to footerHTML too.
const searchStr = '<!-- Mobile Bottom Navigation';
const endStr = '</script>';

const idx = code.indexOf(searchStr);
const endIdx = code.indexOf(endStr, idx) + 9;

if (idx !== -1 && endIdx !== -1) {
    const navCode = code.substring(idx, endIdx);
    
    // Find footerHTML's </footer>
    const footerHtmlStart = code.indexOf('const footerHTML = `');
    const footerHtmlEnd = code.indexOf('</footer>', footerHtmlStart);
    
    if (footerHtmlEnd !== -1) {
        code = code.substring(0, footerHtmlEnd) + '</footer>\n' + navCode + code.substring(footerHtmlEnd + 9);
        fs.writeFileSync('worker.js', code);
        console.log('Added to footerHTML');
    }
}
