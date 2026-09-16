async function verify() {
    const res = await fetch('https://behdoon.ir/?_t=' + Date.now());
    const text = await res.text();
    console.log('Live Status:', res.status);
    console.log('Header has tagline:', text.includes('خدمات حرفه‌ای ساختمان در تهران'));
    
    const heroIdx = text.indexOf('HERO SECTION');
    const heroEnd = text.indexOf('id="services"');
    const heroSnippet = text.substring(heroIdx, heroEnd);
    console.log('Hero snippet under header:\n', heroSnippet.trim());
    console.log('Contains duplicate tagline under header:', heroSnippet.includes('خدمات حرفه‌ای ساختمان در تهران'));
}
verify();
