import { test } from 'node:test';
import assert from 'node:assert/strict';
import { handle as site } from '../netlify/functions/site.mjs';
import { handle as api, validateIssue } from '../netlify/functions/api.mjs';
import { SEED } from '../lib/seed.mjs';

function memStore() {
  const m = new Map();
  return { async get(k) { return m.has(k) ? JSON.parse(m.get(k)) : null; }, async setJSON(k, v) { m.set(k, JSON.stringify(v)); }, async list({ prefix = '' } = {}) { return { blobs: [...m.keys()].filter((k) => k.startsWith(prefix)).map((key) => ({ key })) }; } };
}
const env = { ADMIN_TOKEN: 'a'.repeat(32), EDITOR_TOKEN: 'e'.repeat(32) };
const req = (path, init = {}) => new Request('http://x' + path, init);
const pulse = { at: new Date().toISOString(), window: ['2026-11-13', '2026-11-20'], slots: 1, spread: { mump: 100, lib: 200, factor: 2 }, lead: 50, accel: 90, over4: { mump: 1, lib: 2, factor: 2 }, stake: { now: 3e6, weekAgo: 2e6, launch: 1e6 }, discord: null, series: [{ day: '2026-10-01', eth: 1 }, { day: '2026-11-20', eth: 2 }] };

test('every page renders in both languages', async () => {
  const store = memStore(); await store.setJSON('pulse/latest', pulse);
  for (const p of ['/', '/weekly/', '/weekly/001/', '/daily/', '/daily/2026-11-20/', '/learn/', '/people/', '/builders/', '/pulse/', '/about/', '/submit/']) {
    for (const pre of ['', '/tr']) {
      const r = await site(req(pre + p), { store });
      assert.equal(r.status, 200, pre + p);
      const html = await r.text();
      assert.match(html, /<html lang="(en|tr)">/);
      assert.ok(!html.includes('undefined'), 'no undefined on ' + pre + p);
      assert.ok(!/—|–/.test(html.replace(/<svg[\s\S]*?<\/svg>/g, '')), 'no long dashes on ' + pre + p);
    }
  }
  assert.equal((await site(req('/nope/'), { store })).status, 404);
  assert.equal((await site(req('/learn'), { store })).status, 301);
  assert.match(await (await site(req('/sitemap.xml'), { store })).text(), /weekly\/001/);
});

test('seed issues are valid', () => {
  for (const x of [...SEED.weekly, ...SEED.daily]) assert.deepEqual(validateIssue(x), [], x.id);
});

test('editor drafts weekly, only admin publishes; drafts stay hidden', async () => {
  const store = memStore();
  const w = { ...SEED.weekly[0], id: '002', date: '2026-11-27', status: 'published' };
  let r = await api(req('/api/admin/issue', { method: 'PUT', headers: { authorization: 'Bearer ' + env.EDITOR_TOKEN }, body: JSON.stringify(w) }), { store, env });
  assert.equal(r.status, 200); assert.equal((await r.json()).status, 'draft');
  assert.equal((await site(req('/weekly/002/'), { store })).status, 404);
  assert.equal((await site(req('/preview/weekly/002/'), { store, preview: true })).status, 200);
  r = await api(req('/api/admin/publish', { method: 'POST', headers: { authorization: 'Bearer ' + env.EDITOR_TOKEN }, body: JSON.stringify({ kind: 'weekly', id: '002' }) }), { store, env });
  assert.equal(r.status, 403);
  r = await api(req('/api/admin/publish', { method: 'POST', headers: { authorization: 'Bearer ' + env.ADMIN_TOKEN }, body: JSON.stringify({ kind: 'weekly', id: '002' }) }), { store, env });
  assert.equal(r.status, 200);
  assert.equal((await site(req('/weekly/002/'), { store })).status, 200);
  const home = await (await site(req('/'), { store })).text();
  assert.match(home, /Issue 002/);
});

test('editor can publish a daily brief directly', async () => {
  const store = memStore();
  const d = { ...SEED.daily[0], id: '2026-11-21', date: '2026-11-21' };
  const r = await api(req('/api/admin/issue', { method: 'PUT', headers: { authorization: 'Bearer ' + env.EDITOR_TOKEN }, body: JSON.stringify(d) }), { store, env });
  assert.equal((await r.json()).status, 'published');
  assert.equal((await site(req('/daily/2026-11-21/'), { store })).status, 200);
});

test('auth and validation', async () => {
  const store = memStore();
  assert.equal((await api(req('/api/admin/inbox'), { store, env })).status, 401);
  assert.equal((await api(req('/api/admin/inbox', { headers: { authorization: 'Bearer wrong' } }), { store, env })).status, 401);
  const r = await api(req('/api/admin/issue', { method: 'PUT', headers: { authorization: 'Bearer ' + env.ADMIN_TOKEN }, body: JSON.stringify({ kind: 'weekly', id: 'x' }) }), { store, env });
  assert.equal(r.status, 400);
});

test('submissions: link required, honeypot, rate limit, inbox', async () => {
  const store = memStore();
  const post = (b) => api(req('/api/submit', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(b) }), { store, env, ip: '1.2.3.4' });
  assert.equal((await post({ url: 'javascript:alert(1)' })).status, 400);
  assert.equal((await post({ url: 'https://example.com', website: 'spam' })).status, 200);
  for (let i = 0; i < 6; i++) assert.equal((await post({ url: 'https://example.com/' + i, kind: 'project', note: 'hi' })).status, 200);
  assert.equal((await post({ url: 'https://example.com/7' })).status, 429);
  const inbox = await (await api(req('/api/admin/inbox', { headers: { authorization: 'Bearer ' + env.EDITOR_TOKEN } }), { store, env })).json();
  assert.equal(inbox.items.length, 6);
});

test('paste box adds Discord text to the wire with line breaks kept', async () => {
  const store = memStore();
  const r = await api(req('/api/admin/paste', { method: 'POST', headers: { authorization: 'Bearer ' + env.EDITOR_TOKEN, 'content-type': 'application/json' }, body: JSON.stringify({ kind: 'roles', text: 'Optimized\n@a @b\nChronicler\n@c' }) }), { store, env });
  assert.equal(r.status, 200);
  const wire = await (await api(req('/api/admin/wire?since=2000-01-01', { headers: { authorization: 'Bearer ' + env.EDITOR_TOKEN } }), { store, env })).json();
  assert.equal(wire.items[0].type, 'roles');
  assert.equal(wire.items[0].data.text, 'Optimized\n@a @b\nChronicler\n@c');
});
