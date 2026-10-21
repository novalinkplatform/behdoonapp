import https from 'node:https';

function getUrl(path, host = 'behdoon.ir') {
  return new Promise((resolve) => {
    const req = https.request({
      host: '188.114.97.3',
      port: 443,
      path,
      headers: { 'Host': host, 'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)' },
      servername: host
    }, (res) => {
      let b = '';
      res.on('data', c => b += c);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: b }));
    });
    req.on('error', e => resolve({ error: e.message }));
    req.end();
  });
}

async function verify() {
  console.log('--- TEST 1: Google Verification Endpoint ---');
  const gTest = await getUrl('/google1234567890abcdef.html');
  console.log('Status:', gTest.status, 'Body:', gTest.body);

  console.log('\n--- TEST 2: WWW to Non-WWW 301 Redirect ---');
  const wTest = await getUrl('/', 'www.behdoon.ir');
  console.log('Status:', wTest.status, 'Location:', wTest.headers?.location);

  console.log('\n--- TEST 3: Pre-rendered Magazine Article ---');
  const mTest = await getUrl('/magazine/hvac');
  console.log('Status:', mTest.status, 'Bytes:', mTest.body?.length);
  console.log('Body snippet:\n', mTest.body?.slice(0, 400));
  console.log('Has Article Title?', mTest.body?.includes('راهنمای جامع نگهداری، تعمیرات'));
  console.log('Has Article Schema?', mTest.body?.includes('"@type":"Article"'));
  console.log('Has X-Robots-Tag?', mTest.headers?.['x-robots-tag']);

  console.log('\n--- TEST 4: Pre-rendered Service Category ---');
  const sTest = await getUrl('/services/hvac');
  console.log('Status:', sTest.status, 'Bytes:', sTest.body?.length);
  console.log('Has Category Title?', sTest.body?.includes('سرمایش و گرمایش'));
  console.log('Has Sub-Services?', sTest.body?.includes('کولر آبی') || sTest.body?.includes('پکیج'));

  console.log('\n--- TEST 5: Robots.txt & Sitemap.xml ---');
  const rTest = await getUrl('/robots.txt');
  console.log('Robots Status:', rTest.status, 'Contains Sitemap?', rTest.body?.includes('https://behdoon.ir/sitemap.xml'));
  const smTest = await getUrl('/sitemap.xml');
  console.log('Sitemap Status:', smTest.status, 'Bytes:', smTest.body?.length, 'URLs Count:', (smTest.body?.match(/<loc>/g) || []).length);
}
verify();
