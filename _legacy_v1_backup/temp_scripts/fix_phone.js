const fs = require('fs');
let code = fs.readFileSync('src/frontend.js', 'utf8');

const constants = `const PHONE = '02122345678';\nconst PHONE_DISPLAY = '021 - 22345678';\n\n`;
code = constants + code;

fs.writeFileSync('src/frontend.js', code);
