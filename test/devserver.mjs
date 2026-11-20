// Local stand-in for Netlify: static files from dist/, then the API and page functions, with a store on disk.
import http from 'node:http';
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { handle as site } from '../netlify/functions/site.mjs';
import { handle as api } from '../netlify/functions/api.mjs';

export function fileStore(dir = '.data') {
  const f = (k) => `${dir}/${encodeURIComponent(k)}.json`;
  return {
    async get(k, o = {}) { try { const b = await readFile(f(k)); return o.type === 'arrayBuffer' ? b.buffer.slice(b.byteOffset, b.byteOffset + b.length) : JSON.parse(b.toString('utf8')); } catch { return null; } },
    async set(k, v) { await mkdir(dir, { recursive: true }); await writeFile(f(k), Buffer.from(v)); },
    async setJSON(k, v) { await mkdir(dir, { recursive: true }); await writeFile(f(k), JSON.stringify(v)); },
    async list({ prefix = '' } = {}) { try { return { blobs: (await readdir(dir)).map((n) => decodeURIComponent(n.replace(/\.json$/, ''))).filter((k) => k.startsWith(prefix)).map((key) => ({ key })) }; } catch { return { blobs: [] }; } },
  };
}

const store = fileStore(process.env.STORE_DIR || '.data');
const env = { ADMIN_TOKEN: 'dev-admin', EDITOR_TOKEN: 'dev-editor', URL: 'http://localhost:8800' };
const TYPES = { css: 'text/css', js: 'application/javascript', svg: 'image/svg+xml', png: 'image/png', webp: 'image/webp', json: 'application/json', xml: 'application/xml' };
const port = Number(process.env.PORT || 8800);
http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost:' + port);
  const body = await new Promise((r) => { let d = ''; req.on('data', (c) => (d += c)); req.on('end', () => r(d)); });
  const request = new Request(url, { method: req.method, headers: req.headers, body: ['GET', 'HEAD'].includes(req.method) ? undefined : body });
  let r;
  if (url.pathname.startsWith('/api/')) r = await api(request, { store, env, ip: req.socket.remoteAddress });
  else {
    try {
      const data = await readFile('dist' + decodeURIComponent(url.pathname));
      res.writeHead(200, { 'content-type': TYPES[url.pathname.split('.').pop()] || 'application/octet-stream' }); res.end(data); return;
    } catch {}
    const token = url.searchParams.get('token');
    r = await site(request, { store, preview: url.pathname.includes('/preview/') && [env.ADMIN_TOKEN, env.EDITOR_TOKEN].includes(token) });
  }
  const headers = Object.fromEntries(r.headers);
  res.writeHead(r.status, headers); res.end(Buffer.from(await r.arrayBuffer()));
}).listen(port, () => console.log('dev server on ' + port));
