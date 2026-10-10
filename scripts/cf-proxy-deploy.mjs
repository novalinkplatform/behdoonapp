import http from 'node:http';
import https from 'node:https';
import dns from 'node:dns';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';

let cfToken = process.env.CLOUDFLARE_API_TOKEN || process.env.CF_API_TOKEN || '';
if (!cfToken) {
  try {
    const envPath = path.resolve(process.cwd(), '.env.deploy');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      const match = content.match(/CLOUDFLARE_API_TOKEN\s*=\s*([^\r\n]+)/);
      if (match) cfToken = match[1].trim();
    }
  } catch {}
}

let ips = ['104.19.192.174', '104.19.192.175', '104.19.192.176', '104.19.193.29'];
try {
  const resolved = await dns.promises.resolve4('api.cloudflare.com');
  if (resolved && resolved.length > 0) {
    ips = resolved;
  }
} catch {
  console.log('[DNS] Using fallback IPs for api.cloudflare.com');
}

let ipIdx = 0;
function customLookup(hostname, options, callback) {
  const cb = typeof options === 'function' ? options : callback;
  const opts = typeof options === 'object' ? options : {};
  if (hostname === 'api.cloudflare.com') {
    const ip = ips[ipIdx++ % ips.length];
    if (opts.all) {
      return cb(null, [{ address: ip, family: 4 }]);
    }
    return cb(null, ip, 4);
  }
  return dns.lookup(hostname, options, cb);
}

const server = http.createServer((clientReq, clientRes) => {
  const targetUrl = new URL(clientReq.url, 'https://api.cloudflare.com');
  console.log(`[Proxy] ${clientReq.method} ${targetUrl.pathname}`);
  const headers = { ...clientReq.headers, host: 'api.cloudflare.com' };
  delete headers.connection;

  const proxyReq = https.request(targetUrl, {
    method: clientReq.method,
    headers,
    lookup: customLookup,
    timeout: 180000,
  }, (proxyRes) => {
    console.log(`[Proxy] Response: ${proxyRes.statusCode} for ${targetUrl.pathname}`);
    clientRes.writeHead(proxyRes.statusCode || 200, proxyRes.headers);
    proxyRes.pipe(clientRes);
  });

  proxyReq.on('error', (err) => {
    console.error(`[Proxy Error] ${targetUrl.pathname}:`, err.message);
    if (!clientRes.headersSent) {
      clientRes.writeHead(502, { 'Content-Type': 'text/plain' });
      clientRes.end(err.message);
    }
  });

  clientReq.pipe(proxyReq);
});

server.listen(8788, '127.0.0.1', () => {
  console.log('CF API Proxy running on http://127.0.0.1:8788 with custom DNS lookup');

  const env = {
    ...process.env,
    CLOUDFLARE_API_TOKEN: cfToken,
    CLOUDFLARE_API_BASE_URL: 'http://127.0.0.1:8788/client/v4',
    CF_API_BASE_URL: 'http://127.0.0.1:8788/client/v4',
    CLOUDFLARE_BASE_URL: 'http://127.0.0.1:8788/client/v4',
    WRANGLER_SEND_METRICS: 'false',
    CI: 'true',
  };

  const child = spawn('npx.cmd', ['wrangler', 'deploy'], {
    env,
    stdio: 'inherit',
    shell: true,
  });

  child.on('close', (code) => {
    console.log(`Wrangler deploy process exited with code ${code}`);
    server.close();
    process.exit(code || 0);
  });
});
