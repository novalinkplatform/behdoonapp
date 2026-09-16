const fs = require('fs');
let code = fs.readFileSync('update_admin_ui.js', 'utf8');
code = code.replace(/const eIdx = currentWorker\.indexOf.*/, "const eIdx = currentWorker.indexOf(\"let htmlResponse = '';\");");
fs.writeFileSync('update_admin_ui.js', code);
console.log('Fixed');
