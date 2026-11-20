import { test } from 'node:test';
import assert from 'node:assert/strict';
import { handle as site } from '../netlify/functions/site.mjs';
import { handle as api, validateIssue } from '../netlify/functions/api.mjs';
import { SEED } from '../lib/seed.mjs';
import { register, parseAnnouncement } from '../lib/register.mjs';
import { readFile } from 'node:fs/promises';

function memStore() {
  const m = new Map();
  return { async get(k, o = {}) { if (!m.has(k)) return null; const v = m.get(k); return o.type === 'arrayBuffer' ? v : JSON.parse(v); }, async setJSON(k, v) { m.set(k, JSON.stringify(v)); }, async set(k, v) { m.set(k, v); }, async delete(k) { m.delete(k); }, async list({ prefix = '' } = {}) { return { blobs: [...m.keys()].filter((k) => k.startsWith(prefix)).map((key) => ({ key })) }; } };
}
const env = { ADMIN_TOKEN: 'a'.repeat(32), EDITOR_TOKEN: 'e'.repeat(32) };
const req = (path, init = {}) => new Request('http://x' + path, init);
const pulse = { at: new Date().toISOString(), window: ['2026-11-13', '2026-11-20'], slots: 1, spread: { mump: 100, lib: 200, factor: 2 }, lead: 50, accel: 90, over4: { mump: 1, lib: 2, factor: 2 }, stake: { now: 3e6, weekAgo: 2e6, launch: 1e6 }, discord: null, series: [{ day: '2026-10-01', eth: 1 }, { day: '2026-11-20', eth: 2 }] };

test('every page renders in every language', async () => {
  const store = memStore(); await store.setJSON('pulse/latest', pulse);
  for (const p of ['/', '/members/', '/classes/', '/builders/', '/m/ecamli/', '/m/hanumd/', '/class/2026-11-09/', '/archive/', '/weekly/001/', '/learn/', '/people/', '/about/', '/submit/']) {
    for (const pre of ['', '/tr', '/vi', '/id', '/ru', '/uk', '/ko', '/hi', '/zh', '/ja']) {
      const r = await site(req(pre + p), { store });
      assert.equal(r.status, 200, pre + p);
      assert.match(r.headers.get('content-security-policy') || '', /script-src 'self'/, 'CSP on ' + pre + p);
      assert.equal(r.headers.get('x-frame-options'), 'SAMEORIGIN');
      const html = await r.text();
      assert.match(html, /<html lang="[a-zA-Z-]+">/);
      assert.ok(!html.includes('undefined'), 'no undefined on ' + pre + p);
      // Russian and Ukrainian grammar needs the dash; everywhere else the house style has none
      if (!['/ru', '/uk'].includes(pre)) assert.ok(!/\u2014|\u2013/.test(html.replace(/<svg[\s\S]*?<\/svg>/g, '')), 'no long dashes on ' + pre + p);
    }
  }
  assert.equal((await site(req('/nope/'), { store })).status, 404);
  assert.equal((await site(req('/learn'), { store })).status, 301);
  assert.match(await (await site(req('/sitemap.xml'), { store })).text(), /weekly\/001/);
});

test('retired pages redirect to where their content lives now', async () => {
  const store = memStore();
  for (const [p, to] of [['/weekly/', '/archive/'], ['/tr/daily/', '/tr/archive/'], ['/daily/2026-11-20/', '/archive/'], ['/community/', '/builders/'], ['/ja/events/', '/ja/builders/'], ['/videos/', '/learn/'], ['/pulse/', '/learn/']]) {
    const r = await site(req(p), { store });
    assert.equal(r.status, 301, p); assert.equal(r.headers.get('location'), to, p);
  }
  const html = await (await site(req('/archive/'), { store })).text();
  assert.match(html, /Month one on mainnet/); assert.match(html, /\d+ stories/); assert.match(html, /aria-current="page">Issues/);
  const nav = html.match(/<nav class="nav"[\s\S]*?<\/nav>/)[0];
  assert.equal((nav.match(/<a /g) || []).length, 5, 'five menu items');
  const builders = await (await site(req('/builders/'), { store })).text();
  for (const s of ['Optimum Pulse', 'Block Arena', 'How to take part']) assert.ok(builders.includes(s), s);
  const sitemap = await (await site(req('/sitemap.xml'), { store })).text();
  assert.ok(!/\/(daily|pulse|videos|events|community)\//.test(sitemap), 'retired pages are not in the sitemap');
  assert.ok(sitemap.includes('/m/ecamli/') && sitemap.includes('/class/2026-11-17/'), 'member and class pages are in the sitemap');
});

test('register: 37 role calls from the Discord archive, people matched across weeks', async () => {
  const reg = await register(null);
  assert.equal(reg.stats.calls, 37); assert.equal(reg.stats.upgrades, 476); assert.equal(reg.stats.members, 467);
  assert.deepEqual([reg.byRole.Optimized, reg.byRole.Chronicler], [2, 5]);
  const h = reg.bySlug.get('hanumd');
  assert.deepEqual(h.events.map((e) => e.role), ['Refined', 'Optimized'], 'a promotion lands on one page');
  assert.ok(reg.bySlug.get('hassan') && reg.bySlug.get('hassan-2'), 'two namesakes named Refined stay two people');
  assert.equal(reg.firsts.Chronicler.slug, 'marina'); assert.equal(reg.firsts.Optimized.slug, 'em3rald');
  const nos = reg.members.map((m) => m.no).sort((a, b) => a - b);
  assert.deepEqual(nos, Array.from({ length: 467 }, (_, i) => i + 1), 'register numbers are 1..n without gaps');
});

test('the announcement parser reads every archived post exactly like the seed', async () => {
  const txt = await readFile(new URL('./fixtures/role-announcements.txt', import.meta.url), 'utf8');
  const posts = txt.split(/\n(?=[^\n]+,?\s+—\s+\d{1,2}\.\d{2}\.\d{4} \d{1,2}:\d{2}\n)/);
  assert.equal(posts.length, 37);
  for (const p of posts) {
    const r = parseAnnouncement(p);
    const seed = SEED.rolecalls.find((c) => c.id === r.date);
    assert.ok(seed, r.date);
    assert.deepEqual([r.groups, r.note || null, r.by], [seed.groups, seed.note || null, seed.by], r.date);
  }
});

test('editor adds a role call by pasting the announcement; members and cards follow', async () => {
  const store = memStore();
  const text = 'Flash ⚡ [MUM],  — 24.11.2026 22:10\nNew Week New Role Upgrades!\nThis week, we’re proud to introduce our next @Optimized\n\n@ecamli congrats!!!\n\nCongratulations to:\n\n@New Person \n@Yuvi \n\nYou have been upgraded to the @Refined role!';
  let r = await api(req('/api/admin/rolecall', { method: 'PUT', body: JSON.stringify({ text }) }), { store, env });
  assert.equal(r.status, 401, 'needs a token');
  r = await api(req('/api/admin/rolecall', { method: 'PUT', headers: { authorization: 'Bearer ' + env.EDITOR_TOKEN }, body: JSON.stringify({ text }) }), { store, env });
  assert.equal(r.status, 200);
  const out = await r.json();
  assert.equal(out.call.date, '2026-11-24');
  assert.deepEqual(out.call.groups.map((g) => [g.role, g.names]), [['Optimized', ['ecamli']], ['Refined', ['New Person', 'Yuvi']]]);
  assert.deepEqual(out.members.filter((m) => m.new).map((m) => m.slug), ['new-person']);
  const page = await (await site(req('/m/ecamli/'), { store })).text();
  assert.match(page, /Named Optimized/); assert.match(page, /Named Refined/);
  assert.equal((await site(req('/m/new-person/'), { store })).status, 200);
  assert.equal((await site(req('/class/2026-11-24/'), { store })).status, 200);
  // the paste page: no secret in the URL, the token goes in the form
  r = await api(req('/api/admin/rolecall'), { store, env });
  assert.equal(r.status, 200); assert.match(await r.text(), /type="password" name="token"/);
  const form = (tok) => req('/api/admin/rolecall', { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ text: 'Flash ⚡ [MUM],  — 01.12.2026 21:00\nCongratulations to:\n@Form Person\nYou have been upgraded to the @Refined role!', token: tok }).toString() });
  assert.equal((await api(form('wrong'), { store, env })).status, 401);
  r = await api(form(env.EDITOR_TOKEN), { store, env });
  assert.equal(r.status, 303); assert.equal(r.headers.get('location'), '/class/2026-12-01/');
  assert.equal((await site(req('/m/form-person/'), { store })).status, 200);
  r = await api(req('/api/admin/rolecall', { method: 'PUT', headers: { authorization: 'Bearer ' + env.EDITOR_TOKEN }, body: JSON.stringify({ date: '2026-11-25', groups: [{ role: 'Wizard', names: ['x'] }] }) }), { store, env });
  assert.equal(r.status, 400, 'unknown roles are refused');
  const jpeg = new Uint8Array([255, 216, 255, 224, 0, 16]);
  r = await api(req('/api/admin/og/m-new-person.jpg', { method: 'PUT', headers: { authorization: 'Bearer ' + env.EDITOR_TOKEN }, body: jpeg }), { store, env });
  assert.equal(r.status, 200);
  r = await site(req('/og/m-new-person.jpg'), { store });
  assert.equal(r.status, 200); assert.equal(r.headers.get('content-type'), 'image/jpeg');
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

test('approval link asks for the admin token in a form, never needs it in the URL', async () => {
  const store = memStore();
  const w = { ...SEED.weekly[0], id: '003', date: '2026-12-04', title: { en: 'Secret draft title' } };
  await api(req('/api/admin/issue', { method: 'PUT', headers: { authorization: 'Bearer ' + env.EDITOR_TOKEN }, body: JSON.stringify(w) }), { store, env });
  let r = await api(req('/api/admin/publish?kind=weekly&id=003'), { store, env });
  assert.equal(r.status, 200);
  let html = await r.text();
  assert.match(html, /type="password" name="token"/);
  assert.ok(!html.includes('Secret draft title'), 'no draft content before auth');
  const form = (token) => req('/api/admin/publish', { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ kind: 'weekly', id: '003', token }).toString() });
  r = await api(form(env.EDITOR_TOKEN), { store, env });
  assert.equal(r.status, 401);
  assert.equal((await site(req('/weekly/003/'), { store })).status, 404, 'wrong token publishes nothing');
  r = await api(form(env.ADMIN_TOKEN), { store, env });
  assert.equal(r.status, 303);
  assert.equal(r.headers.get('location'), '/weekly/003/');
  r = await site(req('/weekly/003/'), { store });
  assert.equal(r.status, 200);
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

import { TM } from '../lib/tm.mjs';
import { sources } from '../scripts/i18n.mjs';
test('every language translates every text and keeps its placeholders', async () => {
  const src = await sources();
  for (const [lang, tm] of Object.entries(TM)) {
    for (const [k, en] of Object.entries(src)) {
      assert.ok(k in tm, `${lang} misses ${k}: ${en.slice(0, 60)}`);
      const want = (en.match(/\{\d\}/g) || []).sort().join(), got = (tm[k].match(/\{\d\}/g) || []).sort().join();
      assert.equal(got, want, `${lang} ${k} placeholders`);
    }
  }
});

test('members add their Discord picture themselves; name must match; they can remove it', async () => {
  const store = memStore();
  const denv = { ...env, DISCORD_CLIENT_ID: '123', DISCORD_CLIENT_SECRET: 's'.repeat(32), RATE_SALT: 'salt' };
  const png = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10, 1, 2, 3]).buffer;
  let nick = 'ecamli', userId = '42', inGuild = true; const seen = [];
  const fetchImpl = async (u, init = {}) => {
    seen.push(String(u));
    if (u.endsWith('/oauth2/token')) return Response.json({ access_token: 'tok' });
    if (u.endsWith('/oauth2/token/revoke')) return new Response('');
    if (u.endsWith('/users/@me')) return Response.json({ id: userId, username: 'someone', global_name: null, avatar: 'abc' });
    if (u.includes('/guilds/')) return inGuild ? Response.json({ nick, avatar: null }) : new Response('', { status: 404 });
    if (u.startsWith('https://cdn.discordapp.com/avatars/')) return new Response(png);
    return new Response('', { status: 404 });
  };
  const o = { store, env: denv, fetchImpl, now: Date.UTC(2026, 10, 20) };
  // without the Discord settings the page shows no button
  assert.ok(!(await (await site(req('/m/ecamli/'), { store })).text()).includes('discord/start'));
  assert.match(await (await site(req('/m/ecamli/'), { store, env: denv })).text(), /api\/discord\/start\?m=ecamli/);
  const go = async (slug, extra = '', cookieOverride) => {
    const s1 = await api(req(`/api/discord/start?m=${slug}&lang=tr${extra}`), o);
    assert.equal(s1.status, 302);
    const loc = new URL(s1.headers.get('location'));
    assert.equal(loc.origin, 'https://discord.com'); assert.equal(loc.searchParams.get('scope'), 'identify guilds.members.read');
    const cookie = cookieOverride ?? s1.headers.get('set-cookie').split(';')[0];
    const r = await api(req(`/api/discord/callback?code=c&state=${encodeURIComponent(loc.searchParams.get('state'))}`, { headers: { cookie } }), o);
    assert.equal(r.status, 303);
    return r.headers.get('location');
  };
  assert.equal((await api(req('/api/discord/start?m=nobody-here'), o)).status, 404);
  // a forged or replayed callback without the browser cookie changes nothing
  assert.match(await go('ecamli', '', 'pclaim=xyz'), /claim=error/);
  nick = 'Marina'; assert.equal(await go('ecamli'), '/tr/m/ecamli/?claim=nomatch');
  nick = 'ecamli'; inGuild = false; assert.match(await go('ecamli'), /claim=notmember/);
  inGuild = true; assert.match(await go('ecamli'), /claim=ok/);
  assert.ok(seen.some((u) => u.includes('/avatars/42/abc.png')));
  const claims = await (await api(req('/api/claims'), o)).json();
  assert.equal(claims.ecamli.photo, true); assert.ok(!JSON.stringify(await store.get('claims/index', { type: 'json' })).includes('"42"'), 'Discord ID is not stored');
  const page = await (await site(req('/m/ecamli/'), { store, env: denv })).text();
  assert.match(page, /class="cred-pic"><img src="\/avatar\/ecamli\.png\?v=/);
  const pic = await site(req('/avatar/ecamli.png'), { store });
  assert.equal(pic.headers.get('content-type'), 'image/png');
  // the same account cannot take a second card, and another account cannot take this one
  nick = 'Marina'; assert.match(await go('marina'), /claim=other/);
  userId = '43'; nick = 'ecamli'; assert.match(await go('ecamli'), /claim=taken/);
  // someone else cannot remove it; the owner can
  assert.match(await go('ecamli', '&remove=1'), /claim=removed/);
  assert.ok((await api(req('/api/claims'), o).then((r) => r.json())).ecamli);
  userId = '42'; assert.match(await go('ecamli', '&remove=1'), /claim=removed/);
  assert.equal((await api(req('/api/claims'), o).then((r) => r.json())).ecamli, undefined);
  assert.equal((await site(req('/avatar/ecamli.png'), { store })).status, 404);
  assert.ok(!(await (await site(req('/m/ecamli/'), { store, env: denv })).text()).includes("cred-pic"));

  // their own picture: Discord proves the card is theirs, then a short lived cookie allows one upload
  const s1 = await api(req('/api/discord/start?m=ecamli&upload=1'), o);
  const loc = new URL(s1.headers.get('location'));
  const cb = await api(req(`/api/discord/callback?code=c&state=${encodeURIComponent(loc.searchParams.get('state'))}`, { headers: { cookie: s1.headers.get('set-cookie').split(';')[0] } }), o);
  assert.equal(cb.headers.get('location'), '/m/ecamli/?claim=upload');
  const own = cb.headers.get('set-cookie').match(/pown=[\w.-]+/)[0];
  const up = (cookie, bytes) => { const fd = new FormData(); fd.append('photo', new Blob([bytes]), 'p.jpg'); return api(req('/api/own/photo', { method: 'POST', body: fd, headers: cookie ? { cookie } : {} }), o); };
  const jpg = new Uint8Array([255, 216, 255, 224, 0, 16, 74, 70, 73, 70]);
  assert.equal((await up('', jpg)).status, 401);
  assert.equal((await up(own, new TextEncoder().encode('<svg onload=alert(1)>'))).status, 400);
  const ok = await (await up(own, jpg)).json();
  assert.equal(ok.to, '/m/ecamli/?claim=uploaded');
  const pic2 = await site(req('/avatar/ecamli.png'), { store });
  assert.equal(pic2.headers.get('content-type'), 'image/jpeg');
  const page2 = await (await site(req('/m/ecamli/'), { store, env: denv })).text();
  assert.match(page2, /cred-pic/); assert.match(page2, /upload=1/);
  // a cookie for this card is useless once the card is released
  userId = '42'; await go('ecamli', '&remove=1');
  assert.equal((await up(own, jpg)).status, 401);
});
