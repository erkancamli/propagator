// Every page on propagator.news, rendered on request and cached at the edge.
import { getStore } from '@netlify/blobs';
import { ASSETS } from '../../lib/manifest.mjs';
import * as R from '../../lib/render.mjs';
import { listIssues, getIssue, getPulse } from '../../lib/data.mjs';
import { LANGS, CODES } from '../../lib/i18n.mjs';

const ROUTES = ['/', '/weekly/', '/daily/', '/learn/', '/builders/', '/people/', '/pulse/', '/about/', '/submit/'];

export async function handle(req, { store, now = Date.now(), preview = false }) {
  const url = new URL(req.url);
  let path = url.pathname;
  // folder style URLs everywhere: /learn -> /learn/
  if (!path.endsWith('/') && !/\.(xml|txt)$/.test(path)) return Response.redirect(new URL(path + '/' + url.search, url), 301);
  let lang = 'en';
  const pre = path.match(/^\/([a-z]{2,3})(\/.*)$/);
  if (pre && pre[1] !== 'en' && CODES.includes(pre[1])) { lang = pre[1]; path = pre[2]; }
  const today = new Date(now).toISOString().slice(0, 10);
  const html = (page, status = 200, cache = 'public, max-age=0, must-revalidate') => new Response(R.layout({ lang, path, assets: ASSETS, ...page }), {
    status, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': cache, 'netlify-cdn-cache-control': status === 200 && !page.noindex ? 'public, s-maxage=300, stale-while-revalidate=86400' : 'no-store', 'netlify-cache-tag': 'pages' },
  });
  const text = (body, type) => new Response(body, { headers: { 'content-type': type, 'cache-control': 'public, max-age=0, must-revalidate', 'netlify-cdn-cache-control': 'public, s-maxage=600, stale-while-revalidate=86400', 'netlify-cache-tag': 'pages' } });

  if (path === '/robots.txt') return text(`User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /preview/\n\nSitemap: ${R.SITE}/sitemap.xml\n`, 'text/plain; charset=utf-8');
  if (path === '/sitemap.xml') {
    const [w, d] = await Promise.all([listIssues(store, 'weekly'), listIssues(store, 'daily')]);
    const urls = [...ROUTES.filter((r) => r !== '/submit/').map((p) => [p, today]), ...w.map((x) => [`/weekly/${x.id}/`, x.date]), ...d.map((x) => [`/daily/${x.id}/`, x.date])];
    const alts = (p) => LANGS.map((l) => `<xhtml:link rel="alternate" hreflang="${l.hreflang || l.code}" href="${R.SITE}${R.href(l.code, p)}"/>`).join('') + `<xhtml:link rel="alternate" hreflang="x-default" href="${R.SITE}${p}"/>`;
    const row = (p, mod) => LANGS.map((l) => `<url><loc>${R.SITE}${R.href(l.code, p)}</loc><lastmod>${mod}</lastmod>${alts(p)}</url>`).join('');
    return text(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.map(([p, m]) => row(p, m)).join('\n')}\n</urlset>\n`, 'application/xml; charset=utf-8');
  }
  if (path === '/feed.xml') {
    const [w, d] = await Promise.all([listIssues(store, 'weekly'), listIssues(store, 'daily')]);
    return text(R.feed(lang, [...w, ...d].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 40)), 'application/rss+xml; charset=utf-8');
  }

  if (path === '/') {
    const [w, d, pulse] = await Promise.all([listIssues(store, 'weekly'), listIssues(store, 'daily'), getPulse(store)]);
    const weekly = w[0] && await getIssue(store, 'weekly', w[0].id);
    const daily = d[0] && await getIssue(store, 'daily', d[0].id);
    if (!weekly) return html(R.notFound(lang), 404);
    return html(R.home(lang, { weekly, daily, pulse, assets: ASSETS, today }));
  }
  let m;
  if ((m = path.match(/^\/(weekly|daily)\/$/))) return html(R.archive(lang, m[1], await listIssues(store, m[1])));
  // drafts are reachable only under /preview/ with the editor's token, and never indexed
  if ((m = path.match(/^\/(preview\/)?(weekly|daily)\/([\w-]{1,20})\/$/))) {
    const isPreview = Boolean(m[1]), kind = m[2], id = m[3];
    const issue = await getIssue(store, kind, id);
    if (!issue || (issue.status !== 'published' && !(isPreview && preview))) return html(R.notFound(lang), 404);
    if (kind === 'daily') return html({ ...R.dailyPage(lang, issue), noindex: isPreview });
    const list = await listIssues(store, 'weekly');
    const i = list.findIndex((x) => x.id === id);
    return html({ ...R.weeklyPage(lang, issue, { prev: list[i + 1], next: i > 0 ? list[i - 1] : null }), noindex: isPreview });
  }
  if (path === '/learn/') return html(R.learnPage(lang));
  if (path === '/people/') return html(R.peoplePage(lang));
  if (path === '/builders/') return html(R.buildersPage(lang, today));
  if (path === '/about/') return html(R.aboutPage(lang));
  if (path === '/submit/') return html(R.submitPage(lang));
  if (path === '/pulse/') {
    const pulse = await getPulse(store);
    return html(R.pulsePage(lang, pulse, pulse?.series?.filter((x) => x.day >= '2026-06-25')));
  }
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
