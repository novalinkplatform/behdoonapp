const fs = require('fs');
let code = fs.readFileSync('worker.js', 'utf8');

const correctHeader = `export default {
  async fetch(request, env, ctx) {
    const PHONE = "09333256885"; 
    const PHONE_DISPLAY = "0933 325 6885"; 
    const WHATSAPP = "989333256885"; `;

const htmlStart = code.indexOf('    const html = `<!DOCTYPE html>');
if (htmlStart !== -1) {
    code = correctHeader + '\n\n' + code.substring(htmlStart);
    fs.writeFileSync('worker.js', code);
    console.log('Fixed header');
} else {
    console.log('htmlStart not found');
}
