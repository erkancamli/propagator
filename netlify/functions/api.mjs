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
import { getStore } from '@netlify/blobs';
import { purgeCache } from '@netlify/functions';
import crypto from 'node:crypto';
import { getPulse, putIssue, getIssue, listIssues } from '../../lib/data.mjs';

const json = (body, status = 200, extra = {}) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...extra } });
const safeEq = (a, b) => { const x = Buffer.from(String(a)), y = Buffer.from(String(b)); return x.length === y.length && crypto.timingSafeEqual(x, y); };
const KINDS = ['project', 'content', 'event', 'correction', 'other'];
const clip = (v, n) => String(v ?? '').replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, n);
const isDay = (d) => /^\d{4}-\d{2}-\d{2}$/.test(d) && !Number.isNaN(Date.parse(d));
const bi = (o) => o && typeof o.en === 'string' && typeof o.tr === 'string';

export function validateIssue(x) {
  const errs = [];
  if (!x || !['weekly', 'daily'].includes(x.kind)) errs.push('kind must be weekly or daily');
  if (!/^[\w-]{1,20}$/.test(x?.id || '')) errs.push('id');
  if (!isDay(x?.date || '')) errs.push('date');
  if (!bi(x?.title)) errs.push('title needs en and tr');
  if (x?.kind === 'daily' && (!Array.isArray(x.items) || !x.items.length || !x.items.every((i) => bi(i.text)))) errs.push('daily items need text.en and text.tr');
  if (x?.kind === 'weekly' && (!bi(x.dek) || !Array.isArray(x.stories) || !x.stories.every((s) => bi(s.title) && bi(s.body)))) errs.push('weekly needs dek and stories with en and tr');
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
    const item = { id: now.toString(36) + crypto.randomBytes(3).toString('hex'), at: new Date(now).toISOString(), kind: KINDS.includes(b.kind) ? b.kind : 'other', url: link.href, name: clip(b.name, 80), note: clip(b.note, 800), lang: b.lang === 'tr' ? 'tr' : 'en', done: false };
    await store.setJSON('inbox/' + item.id, item);
    return json({ ok: true });
  }

  if (!path.startsWith('/api/admin/')) return json({ error: 'not found' }, 404);
  if (!isEditor) return json({ error: 'unauthorized' }, 401);

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
    return json({ ok: true, status: issue.status, preview: `${site}/preview/${issue.kind}/${issue.id}/?token=${encodeURIComponent(bearer)}`, publish: issue.status === 'draft' ? `${site}/api/admin/publish?kind=${issue.kind}&id=${issue.id}` : null });
  }
  if (path === '/api/admin/publish') {
    if (!isAdmin) return json({ error: 'only the admin can publish' }, 403);
    const kind = (req.method === 'GET' ? url.searchParams.get('kind') : null), id0 = req.method === 'GET' ? url.searchParams.get('id') : null;
    if (req.method === 'GET') {
      const issue = await getIssue(store, kind, id0 || '');
      if (!issue) return new Response('Issue not found', { status: 404 });
      const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
      return new Response(`<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Publish</title><style>body{font:16px system-ui;max-width:560px;margin:10vh auto;padding:0 16px;background:#16181a;color:#f0f2f4}a{color:#d3dbe2}button{font:600 16px system-ui;padding:12px 20px;border-radius:10px;border:0;background:#b87cff;color:#16181a;cursor:pointer}</style><h1>${esc(issue.title.en)}</h1><p>${esc(kind)} ${esc(issue.id)}, status <b>${esc(issue.status)}</b></p><p><a href="/preview/${esc(kind)}/${esc(issue.id)}/?token=${encodeURIComponent(bearer)}">Read the preview</a> · <a href="/tr/preview/${esc(kind)}/${esc(issue.id)}/?token=${encodeURIComponent(bearer)}">Türkçe önizleme</a></p><form method="post" action="/api/admin/publish?token=${encodeURIComponent(bearer)}"><input type="hidden" name="kind" value="${esc(kind)}"><input type="hidden" name="id" value="${esc(issue.id)}"><button>Publish now</button></form>`, { headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' } });
    }
    if (req.method === 'POST') {
      const b = await body(); const issue = b && await getIssue(store, b.kind, clip(b.id, 20));
      if (!issue) return json({ error: 'not found' }, 404);
      issue.status = 'published'; issue.publishedAt = new Date(now).toISOString();
      await putIssue(store, issue); await purge();
      if ((req.headers.get('content-type') || '').includes('form')) return new Response(null, { status: 303, headers: { location: `/${issue.kind}/${issue.id}/` } });
      return json({ ok: true });
    }
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
