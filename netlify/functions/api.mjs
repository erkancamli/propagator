// Propagator API.
//   GET  /api/pulse                      live network numbers (cached 20 min)
//   POST /api/submit                     reader submissions: { kind, url, name, note, lang }
// Editor and admin routes (Authorization: Bearer <token>):
//   GET  /api/admin/wire?since=ISO       everything the collector found, newest first   (editor)
//   GET  /api/admin/inbox                reader submissions                            (editor)
//   POST /api/admin/inbox/done           { id } marks a submission handled            (editor)
//   PUT  /api/admin/issue                store an issue. Editor: daily may publish, weekly is always a draft.
//                                        Admin: anything.
//   GET  /api/admin/issues?kind=weekly   list including drafts                         (editor)
//   GET  /api/admin/publish?kind=&id=&token=   confirmation page with a Publish button  (admin)
//   POST /api/admin/publish              { kind, id } publishes a draft                (admin)
//   GET|POST /api/admin/paste            paste box for Discord announcements and role lists (editor)
//   POST /api/subscribe                  { email, lang, consent } double opt in; GET /api/subscribe/confirm?t=, GET /api/unsubscribe?t=
//   GET  /api/admin/subscribers          counts by language and status; ?format=csv exports (admin)
//   POST /api/admin/subscribers/confirm-pending   re-sends confirmation emails to pending addresses (admin)
// Members (Discord sign in, see lib/claim.mjs):
//   GET  /api/discord/start?m=<slug>&lang=&remove=1|upload=1   sends the member to Discord to claim (or release) a card;
//                                        upload=1 proves ownership and then lets them upload a picture of their own
//   POST /api/own/photo                  the owner's own picture (JPEG, PNG or WebP); needs the cookie set after sign in
//   GET  /api/discord/callback                        Discord returns here; back to the card with ?claim=<result>
//   GET  /api/claims                                  claimed cards: { slug: { v, photo, og } }
//   GET  /api/members                                 every member in brief, for search as you type
//   GET  /api/rolecalls                               role calls added through the paste page (public data)
import { getStore } from '@netlify/blobs';
import { purgeCache } from '@netlify/functions';
import crypto from 'node:crypto';
import { getPulse, putIssue, getIssue, listIssues } from '../../lib/data.mjs';
import { sendConfirm, sendWeekly, mailReady, notifyEditor } from '../../lib/mail.mjs';
import { register, parseAnnouncement, ROLE } from '../../lib/register.mjs';
import { discordReady, makeState, readState, idHash, getClaims, nameMatches, authorizeUrl, discordProfile, fetchAvatar, imageType } from '../../lib/claim.mjs';
import { CODES } from '../../lib/i18n.mjs';
import { TM } from '../../lib/tm.mjs';
import { key as tmKey } from '../../lib/t.mjs';

const json = (body, status = 200, extra = {}) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...extra } });
const safeEq = (a, b) => { const x = Buffer.from(String(a)), y = Buffer.from(String(b)); return x.length === y.length && crypto.timingSafeEqual(x, y); };
const KINDS = ['project', 'content', 'event', 'correction', 'other'];
const clip = (v, n) => String(v ?? '').replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, n);
const isDay = (d) => /^\d{4}-\d{2}-\d{2}$/.test(d) && !Number.isNaN(Date.parse(d));
const bi = (o) => o && typeof o.en === 'string' && o.en.trim().length > 0;

// Which languages are missing for which texts: a text counts as translated when it carries that language inline
// or the translation memory knows its English. The editor is expected to send every language inline.
export function missingLanguages(x) {
  const miss = {};
  const walk = (n, path) => {
    if (!n || typeof n !== 'object') return;
    if (Array.isArray(n)) return n.forEach((v, i) => walk(v, path + '[' + i + ']'));
    if (typeof n.en === 'string' || Array.isArray(n.en)) {
      for (const l of CODES) if (l !== 'en' && n[l] == null && [].concat(n.en).some((e) => !TM[l]?.[tmKey(e)])) (miss[l] ||= []).push(path);
      return;
    }
    for (const [k, v] of Object.entries(n)) walk(v, path ? path + '.' + k : k);
  };
  walk(x, '');
  return miss;
}

export function validateIssue(x) {
  const errs = [];
  if (!x || !['weekly', 'daily'].includes(x.kind)) errs.push('kind must be weekly or daily');
  if (!/^[\w-]{1,20}$/.test(x?.id || '')) errs.push('id');
  if (!isDay(x?.date || '')) errs.push('date');
  if (!bi(x?.title)) errs.push('title needs en');
  if (x?.kind === 'daily' && (!Array.isArray(x.items) || !x.items.length || !x.items.every((i) => bi(i.text)))) errs.push('daily items need text.en');
  if (x?.kind === 'weekly' && (!bi(x.dek) || !Array.isArray(x.stories) || !x.stories.every((s) => bi(s.title) && bi(s.body)))) errs.push('weekly needs dek and stories with en');
  if (JSON.stringify(x || {}).length > 200000) errs.push('too large');
  return errs;
}

export async function handle(req, { store, env, ip = '', now = Date.now(), purge = async () => {}, fetchImpl = globalThis.fetch }) {
  const url = new URL(req.url);
  const path = url.pathname.replace(/\/+$/, '');
  const bearer = (req.headers.get('authorization') || '').replace(/^Bearer\s+/i, '') || url.searchParams.get('token') || '';
  const isAdmin = Boolean(env.ADMIN_TOKEN) && safeEq(bearer, env.ADMIN_TOKEN);
  const isEditor = isAdmin || (Boolean(env.EDITOR_TOKEN) && safeEq(bearer, env.EDITOR_TOKEN));
  const body = async () => { try { const t = await req.text(); if (t.length > 250000) return null; if ((req.headers.get('content-type') || '').includes('application/x-www-form-urlencoded')) return Object.fromEntries(new URLSearchParams(t)); return JSON.parse(t || '{}'); } catch { return null; } };

  if (path === '/api/pulse' && req.method === 'GET') {
    const p = await getPulse(store);
    if (!p) return json({ error: 'pulse unavailable' }, 503);
    const { series, ...rest } = p;
    return json(rest, 200, { 'cache-control': 'public, max-age=60', 'netlify-cdn-cache-control': 'public, s-maxage=300, stale-while-revalidate=600' });
  }

  if (path === '/api/submit' && req.method === 'POST') {
    const b = await body();
    if (!b) return json({ error: 'bad request' }, 400);
    if (b.website) return json({ ok: true }); // honeypot: bots fill the hidden field
    let link; try { link = new URL(clip(b.url, 400)); } catch { return json({ error: 'a valid link is required' }, 400); }
    if (!/^https?:$/.test(link.protocol)) return json({ error: 'a valid link is required' }, 400);
    const ipKey = 'rate/' + crypto.createHash('sha256').update(ip + (env.RATE_SALT || 'p')).digest('hex').slice(0, 24);
    const rate = (await store.get(ipKey, { type: 'json' }).catch(() => null)) || { n: 0, t: now };
    if (now - rate.t > 3600e3) { rate.n = 0; rate.t = now; }
    if (rate.n >= 6) return json({ error: 'too many messages, try again in an hour' }, 429);
    rate.n++; await store.setJSON(ipKey, rate);
    const item = { id: now.toString(36) + crypto.randomBytes(3).toString('hex'), at: new Date(now).toISOString(), kind: KINDS.includes(b.kind) ? b.kind : 'other', url: link.href, name: clip(b.name, 80), note: clip(b.note, 800), lang: /^[a-z]{2,3}$/.test(b.lang || '') ? b.lang : 'en', done: false };
    await store.setJSON('inbox/' + item.id, item);
    await notifyEditor(env, item).catch((e) => console.log('notify', String(e)));
    return json({ ok: true });
  }


  // ---- email subscriptions (double opt in) ----
  const subKey = (email) => 'sub/' + crypto.createHash('sha256').update(email).digest('hex').slice(0, 32);
  const langPath = (l) => (l && l !== 'en' ? '/' + l : '');
  if (path === '/api/subscribe' && req.method === 'POST') {
    const b = await body();
    if (!b) return json({ error: 'bad request' }, 400);
    if (b.website) return json({ ok: true, queued: true });
    const email = clip(b.email, 200).toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return json({ error: 'a valid email is required' }, 400);
    if (!(b.consent === true || b.consent === 'yes' || b.consent === 'on')) return json({ error: 'consent is required' }, 400);
    const ipKey = 'rate/sub/' + crypto.createHash('sha256').update(ip + (env.RATE_SALT || 'p')).digest('hex').slice(0, 24);
    const rate = (await store.get(ipKey, { type: 'json' }).catch(() => null)) || { n: 0, t: now };
    if (now - rate.t > 3600e3) { rate.n = 0; rate.t = now; }
    if (rate.n >= 5) return json({ error: 'too many attempts, try again in an hour' }, 429);
    rate.n++; await store.setJSON(ipKey, rate);
    const key = subKey(email);
    const prev = await store.get(key, { type: 'json' }).catch(() => null);
    const lang = CODES.includes(b.lang) ? b.lang : 'en';
    const sub = prev?.status === 'active' ? { ...prev, lang } : { email, lang, status: 'pending', token: crypto.randomBytes(18).toString('base64url'), at: new Date(now).toISOString(), consent: new Date(now).toISOString() };
    await store.setJSON(key, sub);
    await store.setJSON('subtok/' + sub.token, { key });
    if (sub.status === 'active') return json({ ok: true, already: true });
    if (mailReady(env)) { try { await sendConfirm(env, sub); return json({ ok: true, confirm: true }); } catch (e) { console.log('confirm mail failed', String(e)); } }
    return json({ ok: true, queued: true });
  }
  if ((path === '/api/subscribe/confirm' || path === '/api/unsubscribe') && req.method === 'GET') {
    const t = url.searchParams.get('t') || '';
    let hit = null;
    if (/^[\w-]{16,64}$/.test(t)) { const ref = await store.get('subtok/' + t, { type: 'json' }).catch(() => null); const s = ref && await store.get(ref.key, { type: 'json' }); if (s && safeEq(s.token, t)) hit = [ref.key, s]; }
    if (!hit) return new Response(null, { status: 303, headers: { location: '/subscribed/bad/' } });
    const [k, s] = hit;
    s.status = path === '/api/unsubscribe' ? 'left' : 'active'; s[s.status + 'At'] = new Date(now).toISOString();
    await store.setJSON(k, s);
    return new Response(null, { status: 303, headers: { location: `${langPath(s.lang)}/subscribed/${s.status === 'active' ? 'confirmed' : 'left'}/` } });
  }
  if (path === '/api/unsubscribe' && req.method === 'POST') return json({ ok: true }); // one click unsubscribe header; the GET above does the work

  // ---- members claim their card with Discord ----
  // the directory in brief, for search as you type: slug, display name, every spelling, role, register number, picture
  if (path === '/api/members' && req.method === 'GET') {
    const reg = await register(store);
    return json(reg.members.map((m) => ({ s: m.slug, n: m.name, a: m.names.join(' '), r: m.role, no: m.no, p: m.photo || undefined })), 200, { 'cache-control': 'public, max-age=300', 'netlify-cache-tag': 'pages' });
  }
  // role calls added through the paste page, so the weekly run can keep them in the repository too
  if (path === '/api/rolecalls' && req.method === 'GET') {
    return json((await store.get('rolecalls/list', { type: 'json' }).catch(() => null)) || [], 200, { 'cache-control': 'public, max-age=60' });
  }
  if (path === '/api/claims' && req.method === 'GET') {
    const c = await getClaims(store);
    return json(Object.fromEntries(Object.entries(c).map(([k, v]) => [k, { v: v.v, photo: Boolean(v.photo), og: v.og || null }])), 200, { 'cache-control': 'public, max-age=60' });
  }
  if ((path === '/api/discord/start' || path === '/api/discord/callback') && req.method === 'GET') {
    const lp = (l) => (l && l !== 'en' && CODES.includes(l) ? '/' + l : '');
    const back = (d, result) => new Response(null, { status: 303, headers: { location: `${lp(d?.lang)}/m/${d?.m || ''}/?claim=${result}`, 'cache-control': 'no-store', 'set-cookie': 'pclaim=; Path=/api/discord; Max-Age=0; HttpOnly; Secure; SameSite=Lax' } });
    if (!discordReady(env)) return json({ error: 'Discord sign in is not set up' }, 503);
    const redirect = env.DISCORD_REDIRECT || url.origin + '/api/discord/callback';
    if (path === '/api/discord/start') {
      const m = clip(url.searchParams.get('m'), 70), lang = clip(url.searchParams.get('lang'), 3);
      const reg = await register(store);
      if (!reg.bySlug.has(m)) return json({ error: 'no such card' }, 404);
      const n = crypto.randomBytes(12).toString('base64url');
      const state = makeState(env, { m, lang: CODES.includes(lang) ? lang : 'en', remove: url.searchParams.get('remove') === '1', upload: url.searchParams.get('upload') === '1', n }, now);
      return new Response(null, { status: 302, headers: { location: authorizeUrl(env, redirect, state), 'cache-control': 'no-store', 'set-cookie': `pclaim=${n}; Path=/api/discord; Max-Age=600; HttpOnly; Secure; SameSite=Lax` } });
    }
    const d = readState(env, url.searchParams.get('state'), now);
    const cookie = (req.headers.get('cookie') || '').match(/(?:^|;\s*)pclaim=([\w-]+)/)?.[1];
    if (!d || !cookie || !safeEq(cookie, d.n)) return d ? back(d, 'error') : new Response(null, { status: 303, headers: { location: '/members/' } });
    if (url.searchParams.get('error') || !url.searchParams.get('code')) return back(d, 'denied');
    let prof; try { prof = await discordProfile(env, url.searchParams.get('code'), redirect, fetchImpl); } catch (e) { console.log('discord', String(e)); return back(d, 'error'); }
    const h = idHash(env, prof.user.id);
    const claims = await getClaims(store);
    if (d.remove) {
      if (claims[d.m]?.h === h) { const old = claims[d.m]; delete claims[d.m]; await store.setJSON('claims/index', claims); await store.delete?.('avatar/' + d.m); if (old.og) await store.delete?.('og/' + old.og.replace(/^\/og\//, '')); await purge(); }
      return back(d, 'removed');
    }
    if (!prof.member) return back(d, 'notmember');
    const reg = await register(store), m = reg.bySlug.get(d.m);
    if (!m) return back(d, 'error');
    if (!nameMatches(m, [prof.member.nick, prof.user.global_name, prof.user.username])) return back(d, 'nomatch');
    if (claims[d.m] && claims[d.m].h !== h) return back(d, 'taken');
    if (Object.entries(claims).some(([k, v]) => k !== d.m && v.h === h)) return back(d, 'other');
    if (d.upload) {
      // ownership proven; keep any picture already there and let the owner upload one for the next 30 minutes
      if (!claims[d.m]) { claims[d.m] = { h, v: now.toString(36), photo: false, at: new Date(now).toISOString() }; await store.setJSON('claims/index', claims); }
      const r = back(d, 'upload');
      r.headers.append('set-cookie', `pown=${makeState(env, { m: d.m, h, lang: d.lang }, now + 1200e3)}; Path=/api/own; Max-Age=1800; HttpOnly; Secure; SameSite=Lax`);
      return r;
    }
    const pic = await fetchAvatar(prof.user, prof.member, fetchImpl).catch(() => null);
    if (pic) await store.set('avatar/' + d.m, pic); else await store.delete?.('avatar/' + d.m);
    claims[d.m] = { h, v: now.toString(36), photo: Boolean(pic), at: claims[d.m]?.at || new Date(now).toISOString() };
    await store.setJSON('claims/index', claims); await purge();
    return back(d, pic ? 'ok' : 'nophoto');
  }

  if (path === '/api/own/photo' && req.method === 'POST') {
    const page = (req.headers.get('accept') || '').includes('text/html'); // a plain form post, without the page script
    const reply = (b, st) => (page ? new Response(null, { status: 303, headers: { location: b.to || '/members/', 'cache-control': 'no-store' } }) : json(b, st));
    const cookie = (req.headers.get('cookie') || '').match(/(?:^|;\s*)pown=([\w.-]+)/)?.[1];
    const d = discordReady(env) && readState(env, cookie, now);
    if (!d) return reply({ error: 'expired' }, 401);
    const claims = await getClaims(store);
    const back = (r) => `${d.lang && d.lang !== 'en' ? '/' + d.lang : ''}/m/${d.m}/?claim=${r}`;
    if (claims[d.m]?.h !== d.h) return reply({ error: 'expired', to: back('expired') }, 401);
    let file; try { file = (await req.formData()).get('photo'); } catch { file = null; }
    const buf = file && typeof file.arrayBuffer === 'function' ? await file.arrayBuffer() : null;
    if (!buf || buf.byteLength > 5e6 || !imageType(buf)) return reply({ error: 'badfile', to: back('badfile') }, 400);
    await store.set('avatar/' + d.m, buf);
    claims[d.m] = { ...claims[d.m], v: now.toString(36), photo: true, own: true }; delete claims[d.m].og;
    await store.setJSON('claims/index', claims); await purge();
    return reply({ ok: true, to: back('uploaded') });
  }

  if (!path.startsWith('/api/admin/')) return json({ error: 'not found' }, 404);
  if (!isEditor && path !== '/api/admin/publish' && !(path === '/api/admin/rolecall' && req.method !== 'PUT')) return json({ error: 'unauthorized' }, 401); // the approval page handles its own auth


  if (path === '/api/admin/subscribers' && req.method === 'GET') {
    if (!isAdmin) return json({ error: 'only the admin can see subscribers' }, 403);
    const { blobs } = await store.list({ prefix: 'sub/' });
    const subs = (await Promise.all(blobs.map((b) => store.get(b.key, { type: 'json' })))).filter(Boolean);
    if (url.searchParams.get('format') === 'csv') return new Response('email,lang,status,since\n' + subs.map((s) => [s.email, s.lang, s.status, s.at].join(',')).join('\n'), { headers: { 'content-type': 'text/csv; charset=utf-8', 'cache-control': 'no-store' } });
    const count = {}; for (const s of subs) { count[s.status] ||= {}; count[s.status][s.lang] = (count[s.status][s.lang] || 0) + 1; }
    return json({ total: subs.length, mail: mailReady(env), count });
  }
  if (path === '/api/admin/subscribers/confirm-pending' && req.method === 'POST') {
    if (!isAdmin) return json({ error: 'only the admin can do this' }, 403);
    if (!mailReady(env)) return json({ error: 'set RESEND_API_KEY and MAIL_FROM first' }, 409);
    const { blobs } = await store.list({ prefix: 'sub/' });
    let n = 0; for (const b of blobs) { const s = await store.get(b.key, { type: 'json' }); if (s?.status === 'pending') { await sendConfirm(env, s); n++; } }
    return json({ ok: true, sent: n });
  }

  if (path === '/api/admin/wire' && req.method === 'GET') {
    const since = url.searchParams.get('since') || new Date(now - 2 * 86400e3).toISOString();
    const wire = (await store.get('wire/items', { type: 'json' }).catch(() => null)) || [];
    return json({ since, items: wire.filter((w) => (w.seen || w.at) >= since), runs: await store.get('wire/status', { type: 'json' }).catch(() => null) });
  }
  if (path === '/api/admin/inbox' && req.method === 'GET') {
    const { blobs } = await store.list({ prefix: 'inbox/' });
    const items = (await Promise.all(blobs.map((b) => store.get(b.key, { type: 'json' })))).filter(Boolean).sort((a, b) => (a.at < b.at ? 1 : -1));
    return json({ items: url.searchParams.get('all') ? items : items.filter((i) => !i.done) });
  }
  if (path === '/api/admin/inbox/done' && req.method === 'POST') {
    const b = await body(); const it = b && await store.get('inbox/' + clip(b.id, 40), { type: 'json' });
    if (!it) return json({ error: 'not found' }, 404);
    it.done = true; await store.setJSON('inbox/' + it.id, it); return json({ ok: true });
  }
  // Paste box for Discord announcements and role lists: the editor picks them up from the wire.
  if (path === '/api/admin/paste' && req.method === 'GET') {
    return new Response(`<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Paste to the wire</title><style>body{font:16px system-ui;max-width:680px;margin:6vh auto;padding:0 16px;background:#16181a;color:#f0f2f4}textarea,select,input{width:100%;font:15px system-ui;padding:10px;border-radius:10px;border:1px solid #3a4146;background:#1e2124;color:#f0f2f4;box-sizing:border-box;margin:6px 0 14px}button{font:600 16px system-ui;padding:12px 20px;border-radius:10px;border:0;background:#b87cff;color:#16181a;cursor:pointer}</style><h1>Paste to the wire</h1><form method="post" action="/api/admin/paste?token=${encodeURIComponent(bearer)}"><label>What is it<select name="kind"><option value="discord">Discord announcement</option><option value="roles">Role distribution</option><option value="event">Event</option><option value="note">Other note</option></select></label><label>Text (paste as is)<textarea name="text" rows="14" required></textarea></label><label>Link (optional)<input name="url" type="url" placeholder="https://discord.com/channels/..."></label><button>Add to the wire</button></form>`, { headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' } });
  }
  if (path === '/api/admin/paste' && req.method === 'POST') {
    const b = await body();
    const text = String(b?.text || '').replace(/\r/g, '').replace(/[\u0000-\u0009\u000b-\u001f]/g, ' ').slice(0, 8000).trim();
    if (!text) return json({ error: 'text is required' }, 400);
    const kind = ['discord', 'roles', 'event', 'note'].includes(b.kind) ? b.kind : 'note';
    const wire = (await store.get('wire/items', { type: 'json' }).catch(() => null)) || [];
    const at = new Date(now).toISOString();
    wire.unshift({ id: 'paste:' + now.toString(36), type: kind === 'discord' ? 'discord' : kind, source: 'Pasted by the admin', title: text.split('\n')[0].slice(0, 160), url: /^https?:\/\//.test(b.url || '') ? clip(b.url, 400) : null, at, seen: at, data: { text } });
    await store.setJSON('wire/items', wire.slice(0, 600));
    if ((req.headers.get('content-type') || '').includes('form')) return new Response('<!doctype html><meta charset="utf-8"><body style="font:16px system-ui;background:#16181a;color:#f0f2f4;padding:40px">Added to the wire. <a style="color:#c59bff" href="javascript:history.back()">Paste another</a>', { headers: { 'content-type': 'text/html; charset=utf-8' } });
    return json({ ok: true });
  }
  let mo;
  if ((mo = path.match(/^\/api\/admin\/og\/((?:weekly|daily)-[\w-]{1,20}-[a-z]{2,3}\.png|m-[\w-]{1,60}\.jpg)$/)) && req.method === 'PUT') {
    const buf = await req.arrayBuffer(), head = new Uint8Array(buf.slice(0, 4)).join();
    const okType = mo[1].endsWith('.png') ? head === '137,80,78,71' : head.startsWith('255,216,255');
    if (buf.byteLength > 2e6 || !okType) return json({ error: 'a PNG (issues) or JPEG (member cards) under 2 MB is required' }, 400);
    await store.set('og/' + mo[1], buf);
    const pc = mo[1].match(/^m-([\w-]+)-p([a-z0-9]+)\.jpg$/);
    if (pc) { const claims = await getClaims(store), c = claims[pc[1]]; if (c && c.v === pc[2]) { c.og = '/og/' + mo[1]; await store.setJSON('claims/index', claims); await purge(); } }
    return json({ ok: true });
  }
  // the same, as a page: open /api/admin/rolecall, paste the announcement, enter the editor token
  if (path === '/api/admin/rolecall' && (req.method === 'GET' || (req.method === 'POST' && (req.headers.get('content-type') || '').includes('form')))) {
    const esc = (x) => String(x).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    const page = (msg = '', status = 200) => new Response(`<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Add a role call</title><style>body{font:16px/1.5 system-ui;max-width:640px;margin:6vh auto;padding:0 16px;background:#0a0b0e;color:#eef0f4}textarea,input{font:15px ui-monospace,monospace;width:100%;box-sizing:border-box;padding:12px;border-radius:10px;border:1px solid #2f333b;background:#13151a;color:#eef0f4;margin:0 0 12px}textarea{height:320px}button{font:600 16px system-ui;padding:12px 20px;border-radius:10px;border:0;background:#eef0f4;color:#0a0b0e;cursor:pointer}.m{color:#f0b360}</style><h1>Add a role call</h1><p>Copy Flash's post from #role-announcements, including the line with the name and date, and paste it here.</p>${msg ? `<p class="m">${esc(msg)}</p>` : ''}<form method="post" action="/api/admin/rolecall"><textarea name="text" required placeholder="Flash ⚡ [MUM],  — 24.11.2026 22:10&#10;New Week New Role Upgrades!&#10;Congratulations to:&#10;@Name"></textarea><label>Editor token<input type="password" name="token" autocomplete="current-password" required></label><button>Add to the register</button></form>`, { status, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store', 'referrer-policy': 'no-referrer', 'x-frame-options': 'DENY' } });
    if (req.method === 'GET') return page();
    const b = await body();
    const ok = (Boolean(env.EDITOR_TOKEN) && safeEq(b?.token || '', env.EDITOR_TOKEN)) || (Boolean(env.ADMIN_TOKEN) && safeEq(b?.token || '', env.ADMIN_TOKEN));
    if (!ok) return page('That token is not an editor token.', 401);
    const call = parseAnnouncement(String(b.text || '').slice(0, 20000));
    if (!/^\d{4}-\d{2}-\d{2}$/.test(call.date || '') || !call.groups.length) return page('No date or names found. Include the line with the name and date, and the @names.', 400);
    const list = ((await store.get('rolecalls/list', { type: 'json' }).catch(() => null)) || []).filter((c) => c.id !== call.id);
    list.push(call); await store.setJSON('rolecalls/list', list); await purge();
    return new Response(null, { status: 303, headers: { location: `/class/${call.id}/` } });
  }
  // a weekly role call: paste Flash's announcement as { text }, or send the parsed { date, by, groups } yourself
  if (path === '/api/admin/rolecall' && req.method === 'PUT') {
    const b = await body();
    const call = b?.text ? parseAnnouncement(String(b.text).slice(0, 20000), { date: b.date, by: b.by }) : b;
    const errs = [];
    if (!call || !/^\d{4}-\d{2}-\d{2}$/.test(call.date || '')) errs.push('date must be YYYY-MM-DD (or paste the Discord header line with the date)');
    if (!Array.isArray(call?.groups) || !call.groups.length || call.groups.some((g) => !ROLE[g.role] || !Array.isArray(g.names) || !g.names.length || g.names.some((n) => typeof n !== 'string' || !n.trim() || n.length > 80))) errs.push('groups must be [{ role, names[] }] with known roles and non empty names');
    if (errs.length) return json({ error: 'invalid role call', details: errs }, 400);
    call.id = call.date; call.by = call.by || 'Flash';
    call.src = call.src || [`${call.by} in #role-announcements, Optimum Discord, ${call.date}`, 'https://discord.gg/getoptimum'];
    const before = new Set((await register(store)).members.map((m) => m.slug));
    const list = ((await store.get('rolecalls/list', { type: 'json' }).catch(() => null)) || []).filter((c) => c.id !== call.id);
    list.push(call); await store.setJSON('rolecalls/list', list); await purge();
    const after = await register(store);
    const changed = call.groups.flatMap((g) => g.names).map((n) => after.members.find((m) => m.names.includes(n))).filter(Boolean);
    return json({ ok: true, call, members: changed.map((m) => ({ slug: m.slug, name: m.name, role: m.role, new: !before.has(m.slug) })), cards: changed.map((m) => `/api/admin/og/m-${m.slug}.jpg`) });
  }
  if (path === '/api/admin/issues' && req.method === 'GET') {
    const kind = url.searchParams.get('kind') === 'daily' ? 'daily' : 'weekly';
    return json({ items: await listIssues(store, kind, { drafts: true }) });
  }
  if (path === '/api/admin/issue' && req.method === 'PUT') {
    const issue = await body();
    const errs = validateIssue(issue);
    if (errs.length) return json({ error: 'invalid issue', details: errs }, 400);
    if (issue.kind === 'weekly' && !isAdmin) issue.status = 'draft';
    if (!['draft', 'published'].includes(issue.status)) issue.status = 'draft';
    const prev = await getIssue(store, issue.kind, issue.id);
    if (prev?.status === 'published' && issue.kind === 'weekly' && !isAdmin) return json({ error: 'this weekly issue is already published; only the admin can change it' }, 409);
    issue.updated = new Date(now).toISOString();
    await putIssue(store, issue);
    if (issue.status === 'published') await purge();
    const site = env.URL || 'https://propagator.news';
    return json({ ok: true, status: issue.status, missingLanguages: missingLanguages(issue), preview: `${site}/preview/${issue.kind}/${issue.id}/?token=${encodeURIComponent(bearer)}`, publish: issue.status === 'draft' ? `${site}/api/admin/publish?kind=${issue.kind}&id=${issue.id}` : null });
  }
  if (path === '/api/admin/publish') {
    // The approval link carries no secret: opened without the admin token, the page asks for it and sends it in the form body, never in the URL.
    const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    const page = (inner, status = 200) => new Response(`<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Publish</title><style>body{font:16px/1.5 system-ui;max-width:560px;margin:10vh auto;padding:0 16px;background:#16181a;color:#f0f2f4}a{color:#d3dbe2}input{font:16px system-ui;width:100%;box-sizing:border-box;padding:12px;border-radius:10px;border:1px solid #3a4046;background:#0f1113;color:#f0f2f4;margin:0 0 12px}button{font:600 16px system-ui;padding:12px 20px;border-radius:10px;border:0;background:#b87cff;color:#16181a;cursor:pointer}.err{color:#ff9c8a}</style>${inner}`, { status, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store', 'referrer-policy': 'no-referrer', 'x-frame-options': 'DENY' } });
    const form = (kind, id, err = '') => `<h1>Publish ${esc(kind)} ${esc(id)}</h1>${err ? `<p class="err">${esc(err)}</p>` : ''}<form method="post" action="/api/admin/publish"><input type="hidden" name="kind" value="${esc(kind)}"><input type="hidden" name="id" value="${esc(id)}"><label>Admin token<input type="password" name="token" autocomplete="current-password" required></label><button>Publish now</button></form>`;
    if (req.method === 'GET') {
      const kind = url.searchParams.get('kind') === 'daily' ? 'daily' : 'weekly', id0 = clip(url.searchParams.get('id') || '', 20);
      if (!isAdmin) return page(form(kind, id0));
      const issue = await getIssue(store, kind, id0);
      if (!issue) return new Response('Issue not found', { status: 404 });
      return page(`<h1>${esc(issue.title.en)}</h1><p>${esc(kind)} ${esc(issue.id)}, status <b>${esc(issue.status)}</b></p><p><a href="/preview/${esc(kind)}/${esc(issue.id)}/?token=${encodeURIComponent(bearer)}">Read the preview</a> · <a href="/tr/preview/${esc(kind)}/${esc(issue.id)}/?token=${encodeURIComponent(bearer)}">Türkçe önizleme</a></p><form method="post" action="/api/admin/publish"><input type="hidden" name="kind" value="${esc(kind)}"><input type="hidden" name="id" value="${esc(issue.id)}"><input type="hidden" name="token" value="${esc(bearer)}"><button>Publish now</button></form>`);
    }
    if (req.method === 'POST') {
      const b = await body();
      const isForm = (req.headers.get('content-type') || '').includes('form');
      const admin = isAdmin || (Boolean(env.ADMIN_TOKEN) && typeof b?.token === 'string' && safeEq(b.token, env.ADMIN_TOKEN));
      if (!admin) return isForm ? page(form(b?.kind === 'daily' ? 'daily' : 'weekly', clip(b?.id || '', 20), 'That token is not the admin token.'), 401) : json({ error: 'only the admin can publish' }, 403);
      const issue = b && await getIssue(store, b.kind, clip(b.id, 20));
      if (!issue) return json({ error: 'not found' }, 404);
      issue.status = 'published'; issue.publishedAt = new Date(now).toISOString();
      await putIssue(store, issue); await purge();
      if (issue.kind === 'weekly' && !issue.mailedAt) { try { const r = await sendWeekly(env, store, issue); if (r.sent) { issue.mailedAt = new Date(now).toISOString(); issue.mailedTo = r.sent; await putIssue(store, issue); } } catch (e) { console.log('weekly mail failed', String(e)); } }
      if (isForm) return new Response(null, { status: 303, headers: { location: `/${issue.kind}/${issue.id}/` } });
      return json({ ok: true });
    }
    return json({ error: 'method not allowed' }, 405);
  }
  return json({ error: 'not found' }, 404);
}

export default async (req, context) => handle(req, {
  store: getStore({ name: 'propagator', consistency: 'strong' }),
  env: process.env,
  ip: context?.ip || '',
  purge: async () => { try { await purgeCache({ tags: ['pages'] }); } catch {} },
});

export const config = { path: '/api/*' };
