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
import { getStore } from '@netlify/blobs';
import { purgeCache } from '@netlify/functions';
import crypto from 'node:crypto';
import { getPulse, putIssue, getIssue, listIssues } from '../../lib/data.mjs';
import { sendConfirm, sendWeekly, mailReady } from '../../lib/mail.mjs';
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

export async function handle(req, { store, env, ip = '', now = Date.now(), purge = async () => {} }) {
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

  if (!path.startsWith('/api/admin/')) return json({ error: 'not found' }, 404);
  if (!isEditor && path !== '/api/admin/publish') return json({ error: 'unauthorized' }, 401); // the approval page handles its own auth


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
  if ((mo = path.match(/^\/api\/admin\/og\/((?:weekly|daily)-[\w-]{1,20}-[a-z]{2,3}\.png)$/)) && req.method === 'PUT') {
    const buf = await req.arrayBuffer();
    if (buf.byteLength > 2e6 || new Uint8Array(buf.slice(0, 4)).join() !== '137,80,78,71') return json({ error: 'a PNG under 2 MB is required' }, 400);
    await store.set('og/' + mo[1], buf);
    return json({ ok: true });
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
