const fs = require('fs');
let content = fs.readFileSync('worker.js', 'utf8');

const scriptToInject = `
<script>
document.addEventListener('DOMContentLoaded', () => {
    // Clean URL if loaded with hash
    if (window.location.hash) {
        const targetId = window.location.hash.substring(1);
        const target = document.getElementById(targetId);
        if (target) {
            setTimeout(() => {
                target.scrollIntoView({ behavior: 'smooth' });
                history.replaceState(null, null, window.location.pathname);
            }, 50);
        } else {
            history.replaceState(null, null, window.location.pathname);
        }
    }

    // Intercept clicks on links containing hashes
    document.querySelectorAll('a').forEach(a => {
        const href = a.getAttribute('href');
        if (!href) return;
        
        if (href.startsWith('#')) {
            a.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.getElementById(href.substring(1));
                if (target) target.scrollIntoView({ behavior: 'smooth' });
            });
        } else if (href.startsWith('/#') && window.location.pathname === '/') {
            a.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.getElementById(href.substring(2));
                if (target) target.scrollIntoView({ behavior: 'smooth' });
            });
        }
    });
});
</script>
</body>`;

// Inject into footerHTML before </body>
content = content.replace('</body>', scriptToInject);

// Let's also fix the duplicate /#about vs #about-us if needed, 
// actually let's just let the script handle it gracefully.

fs.writeFileSync('worker.js', content);
console.log('Injected URL hash cleaner script!');
