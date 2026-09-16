const fs = require('fs');
let code = fs.readFileSync('src/frontend.js', 'utf8');
code = code.replace(/const WHATSAPP = \\'https:\/\/wa\.me\/989120000000\\';\\n/, '');
code = "const WHATSAPP = 'https://wa.me/989120000000';\n" + code;
fs.writeFileSync('src/frontend.js', code);
