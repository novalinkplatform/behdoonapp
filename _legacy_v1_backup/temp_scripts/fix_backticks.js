const fs = require('fs');
let code = fs.readFileSync('worker.js', 'utf8');

// The problematic lines:
// list.innerHTML += `
//     <div class="p-4 border border-slate-100 rounded-2xl shadow-sm bg-white flex flex-col md:flex-row md:items-center justify-between gap-4">
//         <div>
//             <h4 class="font-bold text-slate-800">${req.service_id}</h4>
//             <div class="text-xs text-slate-400 mt-1">ثبت شده در: ${date}</div>
//         </div>
//         <div class="px-4 py-1.5 rounded-full text-xs font-bold border ${statusColor} whitespace-nowrap text-center">
//             ${statusText}
//         </div>
//     </div>
// `;

let searchStr = "list.innerHTML += `";
let endStr = "</div>\n                            </div>\n                        `;";
let idx = code.indexOf(searchStr);
let endIdx = code.indexOf(endStr);
if (idx !== -1 && endIdx !== -1) {
    let replaced = "list.innerHTML += '<div class=\"p-4 border border-slate-100 rounded-2xl shadow-sm bg-white flex flex-col md:flex-row md:items-center justify-between gap-4\">' +\n" +
                   "'<div><h4 class=\"font-bold text-slate-800\">' + req.service_id + '</h4>' +\n" +
                   "'<div class=\"text-xs text-slate-400 mt-1\">ثبت شده در: ' + date + '</div></div>' +\n" +
                   "'<div class=\"px-4 py-1.5 rounded-full text-xs font-bold border ' + statusColor + ' whitespace-nowrap text-center\">' +\n" +
                   "statusText + '</div></div>';";
    
    code = code.substring(0, idx) + replaced + code.substring(endIdx + endStr.length);
    fs.writeFileSync('worker.js', code);
    console.log('Fixed backticks');
} else {
    console.log('Could not find block');
}
