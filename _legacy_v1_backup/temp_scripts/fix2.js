const fs = require('fs');
let code = fs.readFileSync('update_admin_ui.js', 'utf8');
code = code.replace(/indexOf\('const adminHTML = [^']*'\)/g, 'indexOf("const adminHTML = `")');
fs.writeFileSync('update_admin_ui.js', code);
console.log('Fixed adminHTML search');
