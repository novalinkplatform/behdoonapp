const fs = require('fs');
let code = fs.readFileSync('src/admin.js', 'utf8');

code = code.replace('<th class="p-4 font-bold w-1/4">نام مشتری</th>', '<th class="p-4 font-bold w-1/4">اطلاعات درخواست</th>');

const newCell = '<td class="p-4"><div class="font-bold text-slate-700 text-sm">کد: \\${req.tracking_code || \'-\'}</div><div class="text-xs text-slate-500 max-w-[200px] truncate" title="\\${req.description}">\\${req.description || \'بدون توضیح\'}</div><div class="text-xs text-blue-500 mt-1"><a href="https://www.google.com/maps?q=\\${req.lat},\\${req.lng}" target="_blank">مشاهده نقشه</a></div></td>';

code = code.replace('<td class="p-4 font-bold text-slate-700">\\${req.name}</td>', newCell);

fs.writeFileSync('src/admin.js', code);
