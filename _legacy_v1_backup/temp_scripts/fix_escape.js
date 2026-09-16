const fs = require('fs');
let content = fs.readFileSync('worker.js', 'utf8');

// I need to escape the expressions that were mistakenly evaluated by the backend worker.
// These are currently literal `${req.name}` because I injected them using a script that didn't double-escape the `$`.
content = content.replace(/\$\{req\./g, '\\${req.');
content = content.replace(/\$\{date\}/g, '\\${date}');
content = content.replace(/\$\{statusBadge\}/g, '\\${statusBadge}');

fs.writeFileSync('worker.js', content);
console.log('Fixed escaping.');
