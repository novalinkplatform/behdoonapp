const fs = require('fs');
let code = fs.readFileSync('worker.js', 'utf8');

// I want to clean up the `const html = ` string.
const start = code.indexOf('const html = `');
const end = code.indexOf('`;\n\nconst servicesData =');

let htmlPart = code.substring(start, end);

// Find all script tags in htmlPart
const scriptRegex = /<script>[\s\S]*?<\/script>/g;
htmlPart = htmlPart.replace(scriptRegex, (match) => {
    // If it contains updateStatus, it's the admin script, remove it!
    if(match.includes('updateStatus') || match.includes('loadRequests')) {
        return '';
    }
    return match;
});

code = code.substring(0, start) + htmlPart + code.substring(end);
fs.writeFileSync('worker.js', code);
console.log('Cleaned html');
