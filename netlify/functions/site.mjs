// Every page on propagator.news, rendered on request and cached at the edge.
import { getStore } from '@netlify/blobs';
import { ASSETS } from '../../lib/manifest.mjs';
import * as R from '../../lib/render.mjs';
import { listIssues, getIssue } from '../../lib/data.mjs';
import { LANGS, CODES } from '../../lib/i18n.mjs';

const ROUTES = ['/', '/archive/', '/learn/', '/community/', '/people/', '/about/', '/submit/'];
// pages that were folded into others when Propagator became a weekly magazine with a community page
const MOVED = { '/weekly/': '/archive/', '/daily/': '/archive/', '/builders/': '/community/', '/events/': '/community/', '/videos/': '/learn/', '/pulse/': '/learn/' };

const SECURITY = { 'x-content-type-options': 'nosniff', 'referrer-policy': 'strict-origin-when-cross-origin', 'x-frame-options': 'SAMEORIGIN', 'permissions-policy': 'camera=(), microphone=(), geolocation=()', 'content-security-policy': "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data: https://i.ytimg.com https://pbs.twimg.com; frame-src https://www.youtube-nocookie.com; connect-src 'self'; frame-ancestors 'self'; base-uri 'self'; form-action 'self'" };

export async function handle(req, { store, now = Date.now(), preview = false }) {
  const url = new URL(req.url);
  let path = url.pathname;
  // folder style URLs everywhere: /learn -> /learn/
  if (!path.endsWith('/') && !/\.(xml|txt|png)$/.test(path)) return Response.redirect(new URL(path + '/' + url.search, url), 301);
  let lang = 'en', m0;
  const pre = path.match(/^\/([a-z]{2,3})(\/.*)$/);
  if (pre && pre[1] !== 'en' && CODES.includes(pre[1])) { lang = pre[1]; path = pre[2]; }
  const today = new Date(now).toISOString().slice(0, 10);
  const html = (page, status = 200, cache = 'public, max-age=0, must-revalidate') => new Response(R.layout({ lang, path, assets: ASSETS, ...page }), {
    status, headers: { ...SECURITY, 'content-type': 'text/html; charset=utf-8', 'cache-control': cache, 'netlify-cdn-cache-control': status === 200 && !page.noindex ? 'public, s-maxage=300, stale-while-revalidate=86400' : 'no-store', 'netlify-cache-tag': 'pages' },
  });
  const text = (body, type) => new Response(body, { headers: { 'content-type': type, 'cache-control': 'public, max-age=0, must-revalidate', 'netlify-cdn-cache-control': 'public, s-maxage=600, stale-while-revalidate=86400', 'netlify-cache-tag': 'pages' } });

  // share images uploaded by the editor for issues that live in the store (seed images are static files)
  if ((m0 = path.match(/^\/og\/((?:weekly|daily)-[\w-]{1,20}-[a-z]{2,3})\.png$/))) {
    const buf = await store.get('og/' + m0[1] + '.png', { type: 'arrayBuffer' }).catch(() => null);
    return buf ? new Response(buf, { headers: { 'content-type': 'image/png', 'cache-control': 'public, max-age=86400' } }) : new Response('not found', { status: 404 });
  }
  if (path === '/robots.txt') return text(`User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /preview/\n\nSitemap: ${R.SITE}/sitemap.xml\n`, 'text/plain; charset=utf-8');
  if (path === '/sitemap.xml') {
    const w = await listIssues(store, 'weekly');
    const urls = [...ROUTES.filter((r) => r !== '/submit/').map((p) => [p, today]), ...w.map((x) => [`/weekly/${x.id}/`, x.date])];
    const alts = (p) => LANGS.map((l) => `<xhtml:link rel="alternate" hreflang="${l.hreflang || l.code}" href="${R.SITE}${R.href(l.code, p)}"/>`).join('') + `<xhtml:link rel="alternate" hreflang="x-default" href="${R.SITE}${p}"/>`;
    const row = (p, mod) => LANGS.map((l) => `<url><loc>${R.SITE}${R.href(l.code, p)}</loc><lastmod>${mod}</lastmod>${alts(p)}</url>`).join('');
    return text(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.map(([p, m]) => row(p, m)).join('\n')}\n</urlset>\n`, 'application/xml; charset=utf-8');
  }
  if (path === '/feed.xml') {
    return text(R.feed(lang, (await listIssues(store, 'weekly')).slice(0, 40)), 'application/rss+xml; charset=utf-8');
  }

  const latestWeekly = async () => { const w = await listIssues(store, 'weekly'); return w[0] && getIssue(store, 'weekly', w[0].id); };
  if (path === '/') {
    const weekly = await latestWeekly();
    if (!weekly) return html(R.notFound(lang), 404);
    return html(R.home(lang, { weekly, today }));
  }
  let m;
  const moved = MOVED[path] || (/^\/daily\/[\w-]{1,20}\/$/.test(path) ? '/archive/' : null);
  if (moved) return new Response(null, { status: 301, headers: { location: R.href(lang, moved), 'cache-control': 'public, max-age=3600' } });
  if (path === '/archive/') return html(R.archivePage(lang, await listIssues(store, 'weekly')));
  // drafts are reachable only under /preview/ with the editor's token, and never indexed
  if ((m = path.match(/^\/(preview\/)?weekly\/([\w-]{1,20})\/$/))) {
    const isPreview = Boolean(m[1]), id = m[2];
    const issue = await getIssue(store, 'weekly', id);
    if (!issue || (issue.status !== 'published' && !(isPreview && preview))) return html(R.notFound(lang), 404);
    const list = await listIssues(store, 'weekly');
    const i = list.findIndex((x) => x.id === id);
    return html({ ...R.weeklyPage(lang, issue, { prev: list[i + 1], next: i > 0 ? list[i - 1] : null }), noindex: isPreview });
  }
  if (path === '/learn/') return html(R.learnPage(lang));
  if (path === '/community/') return html(R.communityPage(lang, today, await latestWeekly()));
  if (path === '/people/') return html(R.peoplePage(lang, (await store.get('jobs/list', { type: 'json' }).catch(() => null)) || (await latestWeekly())?.jobs));
  if (path === '/about/') return html(R.aboutPage(lang));
  if ((m = path.match(/^\/subscribed\/(confirmed|left|bad)\/$/))) return html({ ...R.subscribedPage(lang, m[1]), noindex: true });
  if (path === '/submit/') return html(R.submitPage(lang));
  return html(R.notFound(lang), 404);
}

export default async (req) => {
  const store = getStore({ name: 'propagator', consistency: 'strong' });
  const url = new URL(req.url);
  const token = url.searchParams.get('token') || '';
  const preview = /^(\/[a-z]{2,3})?\/preview\//.test(url.pathname) && Boolean(process.env.EDITOR_TOKEN) && [process.env.EDITOR_TOKEN, process.env.ADMIN_TOKEN].includes(token);
  return handle(req, { store, preview });
};

export const config = { path: '/*', preferStatic: true };
