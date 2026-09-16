const fs = require('fs');
let code = fs.readFileSync('src/frontend.js', 'utf8');

const oldStr = '<div><h4 class="font-bold text-slate-800">\' + req.service_id + \'</h4>\' +';
const newStr = '<div><h4 class="font-bold text-slate-800">\' + req.service_id + \'</h4><div class="text-xs font-bold mt-1 text-slate-500">کد پیگیری: \' + (req.tracking_code || \'ندارد\') + \'</div>\' +';
code = code.replace(oldStr, newStr);

fs.writeFileSync('src/frontend.js', code);
