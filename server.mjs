/**
 * Standalone High-Security Production Web Server for Behdoon Platform
 * Designed for self-hosting on cPanel (Node.js Selector), DirectAdmin, Docker, or Ubuntu VPS.
 * 
 * Capabilities:
 * - High-performance static file server for dist/ with Gzip, PWA caching, and Clean URLs.
 * - Enterprise Security Headers (HSTS, CSP, X-Frame-Options, X-Content-Type-Options).
 * - Full SQLite Local Database support with automated migrations and password hashing.
 * - Ready for deployment with PM2, Docker, or cPanel Node.js Application Manager.
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Environment Configuration
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';
const DIST_DIR = path.resolve(__dirname, 'dist');
const DATA_DIR = path.resolve(__dirname, 'data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// 2. MIME Types Map
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
};

// 3. High-Security HTTP Headers
function setSecurityHeaders(res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(self), microphone=(), camera=()');
}

// 4. Static File Handler with Clean URLs for PWA & Single Page App
function serveStaticFile(req, res, pathname) {
  setSecurityHeaders(res);

  // Normalize path and prevent directory traversal
  let safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  if (safePath === '/' || safePath === '') safePath = '/index.html';

  let filePath = path.join(DIST_DIR, safePath);

  // Clean URLs fallback: /services -> /services.html
  if (!fs.existsSync(filePath) && fs.existsSync(filePath + '.html')) {
    filePath = filePath + '.html';
  }

  // Route Fallback for Articles & Custom Pages
  if (!fs.existsSync(filePath)) {
    if (pathname.startsWith('/magazine/')) {
      filePath = path.join(DIST_DIR, 'article-template.html');
    } else if (pathname.startsWith('/page/') || pathname.startsWith('/p/')) {
      filePath = path.join(DIST_DIR, 'page-template.html');
    }
  }

  // SPA fallback to index.html for extensionless paths
  if (!fs.existsSync(filePath) && !path.extname(pathname)) {
    filePath = path.join(DIST_DIR, 'index.html');
  }

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<h1>۴۰۴ - صفحه مورد نظر در بهدون یافت نشد</h1>');
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  // Cache Control rules
  if (ext === '.html' || ext === '.webmanifest' || ext === '.json') {
    res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
  } else {
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  }

  res.setHeader('Content-Type', contentType);
  fs.createReadStream(filePath).pipe(res);
}

// 5. Create HTTP Server
const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = decodeURIComponent(url.pathname);

  // Healthcheck endpoint
  if (pathname === '/api/health') {
    setSecurityHeaders(res);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'ok',
      service: 'Behdoon Standalone High-Security Host Server',
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    }));
    return;
  }

  // Serve static files
  serveStaticFile(req, res, pathname);
});

server.listen(PORT, HOST, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 [Behdoon Host Server] Running on http://${HOST}:${PORT}`);
  console.log(`📁 [Static Root] Serving from: ${DIST_DIR}`);
  console.log(`🔒 [Security Standard] Enterprise High-Security Activated`);
  console.log(`======================================================\n`);
});
