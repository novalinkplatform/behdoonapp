import http from 'node:http';
import https from 'node:https';
import net from 'node:net';
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

// Clean Cloudflare anycast IPs that connect directly without ISP DPI filtering
const ips = ['104.19.192.174', '104.19.192.175', '104.19.193.29', '104.19.192.176'];
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
  console.log(`[Proxy Direct] ${clientReq.method} ${targetUrl.pathname}`);
  const headers = { ...clientReq.headers, host: 'api.cloudflare.com' };
  delete headers.connection;

  const proxyReq = https.request(targetUrl, {
    method: clientReq.method,
    headers,
    lookup: customLookup,
    timeout: 180000,
  }, (proxyRes) => {
    console.log(`[Proxy Direct] Response: ${proxyRes.statusCode} for ${targetUrl.pathname}`);
    clientRes.writeHead(proxyRes.statusCode || 200, proxyRes.headers);
    proxyRes.pipe(clientRes);
  });

  proxyReq.on('error', (err) => {
    console.error(`[Proxy Direct Error] ${targetUrl.pathname}:`, err.message);
    if (!clientRes.headersSent) {
      clientRes.writeHead(502, { 'Content-Type': 'text/plain' });
      clientRes.end(err.message);
    }
  });

  clientReq.pipe(proxyReq);
});

// Handle HTTP CONNECT tunneling for HTTPS_PROXY
server.on('connect', (req, clientSocket, head) => {
  const parts = req.url.split(':');
  const port = parseInt(parts[1], 10) || 443;
  const ip = ips[ipIdx++ % ips.length];

  console.log(`[Proxy CONNECT Tunnel] ${req.url} -> connecting to clean IP ${ip}:${port}`);

  const targetSocket = net.connect(port, ip, () => {
    clientSocket.write('HTTP/1.1 200 Connection Established\r\n\r\n');
    if (head && head.length > 0) {
      targetSocket.write(head);
    }
    targetSocket.pipe(clientSocket);
    clientSocket.pipe(targetSocket);
  });

  targetSocket.on('error', (err) => {
    console.error(`[Proxy CONNECT Target Error] ${req.url}:`, err.message);
    clientSocket.destroy();
  });

  clientSocket.on('error', (err) => {
    targetSocket.destroy();
  });
});

server.on('error', (err) => {
  console.error('[Server Error]', err);
});

server.listen(8788, '127.0.0.1', () => {
  console.log('CF API Proxy & Tunnel running on http://127.0.0.1:8788 with direct Cloudflare clean IPs');

  const env = {
    ...process.env,
    CLOUDFLARE_API_TOKEN: cfToken,
    CLOUDFLARE_API_BASE_URL: 'http://127.0.0.1:8788/client/v4',
    CF_API_BASE_URL: 'http://127.0.0.1:8788/client/v4',
    CLOUDFLARE_BASE_URL: 'http://127.0.0.1:8788/client/v4',
    HTTP_PROXY: 'http://127.0.0.1:8788',
    HTTPS_PROXY: 'http://127.0.0.1:8788',
    http_proxy: 'http://127.0.0.1:8788',
    https_proxy: 'http://127.0.0.1:8788',
    WRANGLER_SEND_METRICS: 'false',
    CI: 'true',
  };

  const cachedWrangler = 'C:\\Users\\Siamak\\AppData\\Local\\npm-cache\\_npx\\32026684e21afda6\\node_modules\\.bin\\wrangler.cmd';
  const bin = fs.existsSync(cachedWrangler) ? cachedWrangler : 'npx.cmd';
  const args = bin === 'npx.cmd' ? ['--no-install', 'wrangler', 'deploy'] : ['deploy'];

  console.log(`Executing ${bin} with args:`, args);

  const child = spawn(bin, args, {
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
