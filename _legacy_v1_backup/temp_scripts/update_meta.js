const fs = require('fs');

let frontendCode = fs.readFileSync('src/frontend.js', 'utf8');
const metaTags = `
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
    <meta http-equiv="Pragma" content="no-cache">
    <meta http-equiv="Expires" content="0">
`;

frontendCode = frontendCode.replace('<meta charset="UTF-8">', '<meta charset="UTF-8">' + metaTags);
fs.writeFileSync('src/frontend.js', frontendCode);
