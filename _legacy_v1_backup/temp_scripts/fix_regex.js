const fs = require('fs');
let content = fs.readFileSync('worker.js', 'utf8');
content = content.replace(/\/\<body\[\^>\]\*>\\[\\\\s\\\\S\\]\*<\\\\\/body>\/i/, '/<body[^>]*>[\\\\s\\\\S]*<\\\\/body>/i');
fs.writeFileSync('worker.js', content);
console.log('Fixed regex.');
