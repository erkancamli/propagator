// Server side rendering of every page. Pure functions: data in, HTML out.
import { LANGS, LANG, CODES } from './i18n.mjs';
import { UI, ABOUT, L, localeOf } from './t.mjs';
import { art } from './art.mjs';
import { LEARN, GLOSSARY, TEAM, BUILDERS, KINDS, LINKS, EVENTS, TAKE_PART } from './content.mjs';

export const SITE = 'https://propagator.news';
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const href = (lang, p) => (lang === 'en' ? p : '/' + lang + p);
const locale = localeOf;
export const fmtDate = (lang, iso, opts = { day: 'numeric', month: 'long', year: 'numeric' }) => (iso ? new Intl.DateTimeFormat(locale(lang), { ...opts, timeZone: 'UTC' }).format(new Date(iso + (iso.length === 10 ? 'T00:00:00Z' : ''))) : '');
const shortDate = (lang, iso) => fmtDate(lang, iso, { day: 'numeric', month: 'short' });
export const num = (lang, n, d = 0) => new Intl.NumberFormat(locale(lang), { minimumFractionDigits: d, maximumFractionDigits: d }).format(n);
// CJK readers expect 第1号 / 제1호, not zero padded numbers
const no = (lang, id) => (['ja', 'ko', 'zh'].includes(lang) && /^\d+$/.test(String(id)) ? String(Number(id)) : id);
const ext = (url, text, cls = '') => `<a href="${esc(url)}" rel="noopener" target="_blank"${cls ? ` class="${cls}"` : ''}>${text}</a>`;

// Optimum's official wordmark (mark + "ptimum"), used only when we refer to Optimum itself.
export const OPTIMUM_WORDMARK = '<svg class="opt-wm" viewBox="0 0 162 35" role="img" aria-label="Optimum"><path d="M26.5069 7.47463C24.3635 7.47463 22.3781 8.1536 20.7529 9.30953C19.2285 10.3935 17.1897 10.3421 15.6585 9.26869C13.9191 8.04968 11.7729 7.37362 9.46493 7.48625C4.37345 7.73493 0.249521 11.8778 0.0112662 16.9842C-0.257012 22.721 4.30081 27.4564 9.96172 27.4564C12.1051 27.4564 14.0915 26.7774 15.7157 25.6215C17.2392 24.5374 19.2788 24.5889 20.81 25.6623C22.5505 26.8813 24.6958 27.5574 27.0047 27.4447C32.0952 27.197 36.2191 23.0532 36.4584 17.9468C36.7266 12.21 32.1688 7.47463 26.5078 7.47463H26.5069ZM31.7156 17.7739C31.6429 19.3368 30.9872 20.8162 29.8696 21.9381C28.7519 23.061 27.2788 23.7205 25.7204 23.7973C25.6149 23.8021 25.5073 23.8051 25.4018 23.8051C24.1001 23.8051 22.8507 23.4116 21.7892 22.6676C20.7277 21.9245 19.49 21.5311 18.2077 21.5311C16.9253 21.5311 15.7379 21.9148 14.7162 22.6413C13.646 23.4019 12.384 23.8041 11.0668 23.8041C9.32256 23.8041 7.69834 23.1067 6.49257 21.84C5.28868 20.5743 4.67078 18.9114 4.75311 17.1561C4.82574 15.5932 5.48144 14.1138 6.59908 12.9919C7.71676 11.8691 9.18988 11.2095 10.7482 11.1337C10.8537 11.1288 10.9612 11.1259 11.0668 11.1259C12.3685 11.1259 13.6179 11.5194 14.6794 12.2634C15.7399 13.0065 16.9786 13.3999 18.261 13.3999C19.5239 13.3999 20.7306 13.0162 21.7524 12.2896C22.8226 11.5291 24.0846 11.1269 25.4018 11.1269C27.1461 11.1269 28.7712 11.8243 29.9761 13.091C31.1799 14.3567 31.7979 16.0196 31.7156 17.7749V17.7739Z" fill="currentColor"/><path d="M38.8109 7.88153H43.5567V8.7402C43.5567 9.32494 43.5179 9.83295 43.4008 10.613C44.6065 8.58381 46.6298 7.25793 49.6252 7.25793C54.6433 7.25793 57.9507 11.4716 57.9507 17.5193C57.9507 23.567 54.2547 27.6243 49.4309 27.6243C46.2404 27.6243 44.6065 26.2586 43.4008 24.3081C43.517 25.0881 43.5567 25.5961 43.5567 26.142V34.8813H38.8109V7.88153ZM48.2637 23.8778C51.1806 23.8778 53.1265 21.2639 53.1265 17.4397C53.1265 13.6154 51.2982 11.0413 48.2637 11.0413C45.424 11.0413 43.362 13.4999 43.362 17.4397C43.362 21.3795 45.3852 23.8778 48.2637 23.8778Z" fill="currentColor"/><path d="M62.7889 20.991V11.666H58.4713V7.88162H62.7889V1.01411H67.5345V7.88065H72.203V11.665H67.5345V20.2878C67.5345 22.2771 68.3122 23.4485 70.3357 23.4485C70.8024 23.4485 71.3082 23.4097 71.7749 23.331V26.9202C71.3082 27.0765 70.1795 27.2708 68.9737 27.2708C64.9286 27.2708 62.7879 25.2417 62.7879 20.9891L62.7889 20.991Z" fill="currentColor"/><path d="M73.8841 0H78.8246V4.99375H73.8841V0ZM73.9622 7.88159H78.7084V26.9211H73.9622V7.88159Z" fill="currentColor"/><path d="M82.224 7.88153H86.9696V8.7402C86.9696 9.32494 86.9306 9.98837 86.8134 10.613C87.7473 8.93543 89.4984 7.25793 92.2991 7.25793C94.6722 7.25793 96.5781 9.09182 97.2786 10.8082C98.3682 8.97429 100.664 7.25793 103.425 7.25793C107.276 7.25793 109.96 10.3012 109.96 14.9442V26.922H105.215V15.6465C105.215 12.8762 104.125 11.0423 102.063 11.0423C100.001 11.0423 98.4459 12.9539 98.4459 15.8418V26.922H93.6997V15.6465C93.6997 12.8762 92.6887 11.0423 90.549 11.0423C88.4097 11.0423 86.9706 12.8762 86.9706 15.8418V26.922H82.2249V7.88153H82.224Z" fill="currentColor"/><path d="M113.115 19.976V7.88063H117.9V19.2348C117.9 21.8876 119.067 23.8002 121.362 23.8002C123.774 23.8002 125.486 22.0051 125.486 19.196V7.88165H130.232V26.9212H125.525V26.1412C125.525 25.5564 125.602 24.893 125.72 24.3072C124.747 26.1412 123.075 27.6234 119.923 27.6234C116.111 27.6234 113.115 25.0095 113.115 19.976Z" fill="currentColor"/><path d="M133.779 7.88153H138.525V8.7402C138.525 9.32494 138.486 9.98837 138.369 10.613C139.303 8.93543 141.054 7.25793 143.855 7.25793C146.228 7.25793 148.133 9.09182 148.834 10.8082C149.923 8.97429 152.219 7.25793 154.98 7.25793C158.831 7.25793 161.516 10.3012 161.516 14.9442V26.922H156.77V15.6465C156.77 12.8762 155.68 11.0423 153.618 11.0423C151.556 11.0423 150.001 12.9539 150.001 15.8418V26.922H145.255V15.6465C145.255 12.8762 144.244 11.0423 142.104 11.0423C139.965 11.0423 138.526 12.8762 138.526 15.8418V26.922H133.78V7.88153H133.779Z" fill="currentColor"/></svg>';

// Propagator's own mark: three coded pieces converging into one block.
const MARK = '<svg class="pmark" viewBox="0 0 32 32" aria-hidden="true"><rect x="2" y="4" width="9" height="9" rx="2"/><rect x="2" y="19" width="9" height="9" rx="2" opacity=".55"/><rect x="13" y="11.5" width="9" height="9" rx="2" opacity=".8"/><rect x="21" y="9" width="9" height="14" rx="2.5" class="pmark-b"/></svg>';

// ---------- layout ----------
export function layout({ lang, path, title, desc, body, assets, jsonld, noindex, og }) {
  const T = UI(lang);
  const self = href(lang, path);
  const navItem = (key, p) => `<a href="${href(lang, p)}"${path === p || (p !== '/' && path.startsWith(p)) || (p === '/archive/' && /^\/weekly\//.test(path)) ? ' aria-current="page"' : ''}>${T.nav[key]}</a>`;
  const fullTitle = title ? `${title} | Propagator` : `Propagator: ${T.tagline}`;
  const ogImg = og || SITE + '/' + assets.og;
  return `<!doctype html>
<html lang="${LANG[lang].hreflang || lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(desc)}">
${noindex ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${SITE}${self}">
${LANGS.map((l) => `<link rel="alternate" hreflang="${l.hreflang || l.code}" href="${SITE}${href(l.code, path)}">`).join('\n')}
<link rel="alternate" hreflang="x-default" href="${SITE}${path}">`}
<meta property="og:type" content="website">
<meta property="og:locale" content="${LANG[lang].locale.replace('-', '_')}">
<meta property="og:site_name" content="Propagator">
<meta property="og:title" content="${esc(fullTitle)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${SITE}${self}">
<meta property="og:image" content="${esc(ogImg)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="${esc(ogImg)}">
<meta name="theme-color" content="#16181a">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="alternate" type="application/rss+xml" title="Propagator" href="${href(lang, '/feed.xml')}">
<link rel="preload" href="/assets/fonts/${({ hi: 'noto-sans-devanagari-devanagari', ru: 'geist-cyrillic', uk: 'geist-cyrillic' })[lang] || 'geist-latin'}.woff2" as="font" type="font/woff2" crossorigin>
${['ja', 'zh', 'ko', 'hi'].includes(lang) ? '' : `<link rel="preload" href="/assets/fonts/propagator-serif-normal-${({ ru: 'cyrillic', uk: 'cyrillic', vi: 'vietnamese' })[lang] || 'latin'}.woff2" as="font" type="font/woff2" crossorigin>`}
<script src="/${assets.theme}"></script>
<link rel="stylesheet" href="/${assets.css}">
${jsonld ? `<script type="application/ld+json">${JSON.stringify(jsonld).replace(/</g, '\\u003c')}</script>` : ''}
</head>
<body>
<a class="skip" href="#main">${T.skip}</a>
<header class="top">
  <div class="top-in">
    <a class="brand" href="${href(lang, '/')}">${MARK}<span class="brand-name">Propagator</span><span class="brand-tag">${esc(T.tagline)}</span></a>
    <nav class="nav" aria-label="${esc(T.mainNav)}">${navItem('issues', '/archive/')}${navItem('learn', '/learn/')}${navItem('community', '/community/')}${navItem('people', '/people/')}</nav>
    <div class="tools"><details class="langs"><summary aria-label="${esc(T.langLabel)}"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="7.5"/><path d="M2.5 10h15M10 2.5c2.2 2.3 2.2 12.7 0 15M10 2.5c-2.2 2.3-2.2 12.7 0 15"/></svg><span>${esc(LANG[lang].name)}</span></summary><ul>${LANGS.map((l) => `<li><a href="${href(l.code, path)}" hreflang="${l.hreflang || l.code}" lang="${l.hreflang || l.code}"${l.code === lang ? ' aria-current="true"' : ''}>${esc(l.name)}</a></li>`).join('')}</ul></details><button class="theme" type="button" aria-label="${esc(T.themeToggle)}" title="${esc(T.themeToggle)}"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="7.5"/><path d="M10 2.5a7.5 7.5 0 0 1 0 15z" class="fill"/></svg></button></div>
  </div>
</header>
<main id="main">
${body}
</main>
<footer class="foot">
  <div class="foot-in">
    <p class="foot-brand">${MARK}<span>Propagator</span></p>
    <p class="foot-note">${esc(T.footer)}${lang !== 'en' ? ` ${esc(T.translated)}` : ''}</p>
    <p class="foot-links"><a href="${href(lang, '/about/')}">${T.footerLinks.about}</a><a href="${href(lang, '/submit/')}">${T.footerLinks.submit}</a><a href="${href(lang, '/feed.xml')}">${T.footerLinks.rss}</a></p>
    <p class="foot-opt">${esc(T.covering)} ${ext(LINKS.site, OPTIMUM_WORDMARK, 'opt-link')}</p>
  </div>
</footer>
<script src="/${assets.js}" defer></script>
</body>
</html>`;
}

// ---------- components ----------
const tagChip = (lang, tag) => tag ? `<span class="tag tag-${esc(tag)}">${esc(UI(lang).tag[tag] || tag)}</span>` : '';
const claimChip = (lang, c) => c ? `<span class="claim claim-${c}">${esc(UI(lang).status[c])}</span>` : '';
const srcList = (sources) => sources?.length ? `<p class="srcs">${sources.map(([label, url]) => ext(url, esc(label))).join('')}</p>` : '';

export function race(lang, pulse) {
  const T = UI(lang);
  const m = pulse.spread.mump, l = pulse.spread.lib;
  const pct = (v) => (v / l * 100).toFixed(1);
  return `<section class="race" aria-label="${esc(T.raceLabel)}" data-mump="${m}" data-lib="${l}">
  <div class="race-lanes">
    <div class="lane lane-m"><span class="lane-name">mump2p</span><div class="lane-track"><canvas data-lane="m"></canvas><i class="lane-end" style="--x:${pct(m)}%"></i></div><span class="lane-ms"><b data-ms="m">${num(lang, m, 0)}</b> ms</span></div>
    <div class="lane lane-l"><span class="lane-name">gossipsub</span><div class="lane-track"><canvas data-lane="l"></canvas><i class="lane-end" style="--x:100%"></i></div><span class="lane-ms"><b data-ms="l">${num(lang, l, 0)}</b> ms</span></div>
  </div>
  <p class="race-cap">${esc(T.raceCaption(num(lang, m, 0), num(lang, l, 0)))} <a href="${LINKS.hub}" rel="noopener" target="_blank">${esc(T.raceSource)}</a>.</p>
</section>`;
}

function video(lang, v) {
  const T = UI(lang);
  return `<figure class="video">
  <button class="yt" type="button" data-yt="${esc(v.id)}" aria-label="${esc(T.playVideo)}: ${esc(undash(v.title))}">
    <img src="https://i.ytimg.com/vi/${esc(v.id)}/hqdefault.jpg" alt="" loading="lazy" width="480" height="360">
    <span class="yt-play" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></span>
  </button>
  <figcaption><b>${esc(undash(v.title))}</b><span>${fmtDate(lang, v.date)}</span>${v.why ? `<span class="why">${esc(L(v.why, lang))}</span>` : ''}</figcaption>
</figure>`;
}

function spotlight(lang, s) {
  const T = UI(lang);
  return `<article class="spot">
  <a class="spot-img" href="${esc(s.url)}" rel="noopener" target="_blank"><img src="${esc(s.image)}" alt="${esc(s.name)}" loading="lazy" width="1200" height="750"></a>
  <div class="spot-text">
    <p class="kicker">${T.spotlight}</p>
    <h3>${esc(L(s.title, lang))}</h3>
    <p class="spot-by">${esc(s.name)}, ${T.by ? T.by + ' ' : ''}${s.handle ? ext('https://x.com/' + s.handle, esc(s.by) + ' (@' + esc(s.handle) + ')') : esc(s.by)}</p>
    <p>${esc(L(s.body, lang))}</p>
    <p class="actions">${ext(s.url, esc(T.visit), 'btn')}${s.post ? ext(s.post, esc(T.readThread), 'btn btn-ghost') : ''}</p>
  </div>
</article>`;
}

export function pulseGrid(lang, p, { live = false } = {}) {
  const T = UI(lang);
  const cell = (key, value, unit, sub, claim = 'company') => `<div class="metric" data-k="${key}"><p class="m-label">${esc(T.m[key][0])}</p><p class="m-val"><b>${value}</b>${unit ? `<span>${unit}</span>` : ''}</p><p class="m-sub">${sub}</p></div>`;
  const stakeDelta = p.stake.now - p.stake.weekAgo;
  return `<div class="metrics${live ? ' live' : ''}">
  ${cell('spread', num(lang, p.spread.mump, 0), 'ms', T.mSub.spread(num(lang, p.spread.lib, 0), num(lang, p.spread.factor, 2)))}
  ${cell('lead', num(lang, p.lead, 0), 'ms', T.mSub.lead)}
  ${cell('accel', num(lang, p.accel, 1), '%', T.mSub.accel(num(lang, p.slots)))}
  ${cell('over4', num(lang, p.over4.mump), '', T.mSub.over4(num(lang, p.over4.lib), num(lang, p.over4.factor, 1)))}
  ${cell('stake', num(lang, p.stake.now / 1e6, 2), 'M ETH', T.mSub.stake((stakeDelta >= 0 ? '+' : '') + num(lang, stakeDelta)))}
  ${p.discord ? cell('discord', num(lang, p.discord.members), '', T.mSub.discord(num(lang, p.discord.online))) : ''}
</div>`;
}

const rotate = (list, seed) => {
  const h = (s) => { let x = 2166136261; for (const c of s) x = Math.imul(x ^ c.charCodeAt(0), 16777619); return x >>> 0; };
  return [...list].sort((a, b) => h(seed + a.id) - h(seed + b.id));
};

function builderCard(lang, b) {
  const T = UI(lang);
  const shot = b.sourceOnly ? `<div class="b-shot b-shot-src" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16"/></svg></div>` : `<img class="b-shot" src="/assets/shots/${esc(b.id)}-600.webp" srcset="/assets/shots/${esc(b.id)}-600.webp 600w, /assets/shots/${esc(b.id)}.webp 1200w" sizes="(max-width: 560px) 100vw, (max-width: 1000px) 50vw, 400px" alt="" loading="lazy" width="600" height="375">`;
  return `<li class="b-card" data-kind="${esc(b.kind)}">
  <a class="b-link" href="${esc(b.url)}" rel="noopener" target="_blank">${shot}
    <span class="b-meta"><span class="b-kind">${esc(L(KINDS[b.kind], lang))}</span>${b.sourceOnly ? `<span class="b-flag">${esc(T.sourceOnly)}</span>` : ''}${b.own ? `<span class="b-flag b-own">${esc(T.editorOwn)}</span>` : ''}</span>
    <span class="b-name">${esc(b.name)}</span>
  </a>
  <p class="b-what">${esc(L(b.what, lang))}</p>
  <p class="b-by">${b.handle ? ext('https://x.com/' + b.handle, esc(b.by) + ' <span>@' + esc(b.handle) + '</span>') : esc(b.by)}</p>
</li>`;
}

function claimsTable(lang, claims) {
  const T = UI(lang);
  return `<div class="claims">${claims.map((c) => `<div class="c-row"><p class="c-claim">“${esc(L(c.claim, lang))}”</p>${claimChip(lang, c.status)}<p class="c-note">${esc(L(c.note, lang))}</p></div>`).join('')}</div>`;
}

function voices(lang, list) {
  return `<ul class="voices">${list.map((v) => `<li><a class="voice" href="https://x.com/${esc(v.handle)}/status/${esc(v.id)}" rel="noopener" target="_blank">
  <span class="v-head"><img src="${esc(v.avatar)}" alt="" width="36" height="36" loading="lazy"><span><b>${esc(v.name)}</b><span>@${esc(v.handle)}, ${shortDate(lang, v.date)}</span></span></span>
  <span class="v-text">${esc(v.text).replace(/\n/g, '<br>')}</span>
  ${v.media ? `<img class="v-media" src="${esc(v.media)}" alt="" loading="lazy" width="640" height="360">` : ''}
</a></li>`).join('')}</ul>`;
}

function rolesBlock(lang, roles) {
  const T = UI(lang);
  if (!roles?.items?.length) return `<div class="roles roles-empty"><p>${esc(L(roles?.note, lang) || T.emptyRoles)}</p><ol class="ladder-mini">${TEAM.ladder.map(([n]) => `<li>${esc(n)}</li>`).join('')}</ol></div>`;
  const by = {};
  for (const r of roles.items) (by[r.role] ||= []).push(r.name);
  return `<div class="roles">${Object.entries(by).map(([role, names]) => `<div class="r-group"><h3>${esc(role)} <span class="r-count">${names.length}</span></h3><ul class="r-names">${names.map((n) => `<li>${esc(n)}</li>`).join('')}</ul></div>`).join('')}${roles.note ? `<p class="r-note">${esc(L(roles.note, lang))}</p>` : ''}${roles.src ? srcList([roles.src]) : ''}</div>`;
}

const section = (id, title, inner, extra = '') => `<section class="sec" id="${id}" aria-labelledby="h-${id}"><div class="sec-head"><h2 id="h-${id}">${title}</h2>${extra}</div>${inner}</section>`;


// ---------- newer components ----------
const tldrBox = (lang, w) => w.tldr ? `<div class="tldr"><p class="kicker">${UI(lang).tldr}</p><ul>${L(w.tldr, lang).map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>` : '';
const evDate = (lang, e) => {
  if (!e.end || e.end === e.start) return fmtDate(lang, e.start);
  // same month: "3 to 6 November 2026"; across months: "29 October to 1 November 2026"
  const sameMonth = e.start.slice(0, 7) === e.end.slice(0, 7);
  return UI(lang).range(fmtDate(lang, e.start, sameMonth && !['ja', 'zh', 'ko'].includes(lang) ? { day: 'numeric' } : { day: 'numeric', month: 'long' }), fmtDate(lang, e.end));
};
function eventList(lang, list) {
  const T = UI(lang);
  return `<ol class="events">${list.map((e) => `<li class="event"><p class="ev-when"><b>${esc(evDate(lang, e))}</b><span>${esc(e.city)}${e.kind ? ', ' + esc(T.eventKind[e.kind] || e.kind) : ''}</span></p><div><h3>${ext(e.url, esc(e.name))}</h3><p>${esc(L(e.what, lang))}</p>${srcList(e.src)}</div></li>`).join('')}</ol>`;
}
const linkList = (lang, list, cls = 'reads') => `<ul class="${cls}">${list.map((x) => `<li>${ext(x.url, esc(L(x.text || x.title, lang)))}${x.who || x.where || x.date ? `<span>${esc([x.who, x.where].filter(Boolean).join(', '))}${x.date ? (x.who || x.where ? ', ' : '') + shortDate(lang, x.date) : ''}</span>` : ''}</li>`).join('')}</ul>`;
const takePart = (lang, list) => `<ol class="steps">${list.map((x) => `<li>${x.url.startsWith('/') ? `<a href="${href(lang, x.url)}">${esc(L(x.text, lang))}</a>` : ext(x.url, esc(L(x.text, lang)))}</li>`).join('')}</ol>`;
export function subscribeBox(lang) {
  const T = UI(lang);
  return `<section class="subscribe" aria-labelledby="sub-h"><div><h2 id="sub-h">${esc(T.sub.title)}</h2><p>${esc(T.sub.dek)}</p></div>
<form class="sub-form" method="post" action="/api/subscribe" data-ok="${esc(T.sub.ok)}" data-queued="${esc(T.sub.queued)}" data-err="${esc(T.sub.err)}">
  <label class="sub-email"><span class="vh">${esc(T.sub.email)}</span><input type="email" name="email" required autocomplete="email" placeholder="${esc(T.sub.email)}" maxlength="200"></label>
  <button class="btn" type="submit">${esc(T.sub.send)}</button>
  <label class="sub-consent"><input type="checkbox" name="consent" value="yes" required><span>${esc(T.sub.consent)}</span></label>
  <input type="hidden" name="lang" value="${lang}"><input type="text" name="website" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">
  <p class="form-msg" role="status" aria-live="polite"></p>
</form></section>`;
}
// external titles keep their words; the house style swaps a spaced long dash for a colon
const undash = (t) => String(t).replace(/\s+[\u2013\u2014]\s+/g, ': ').replace(/[\u2013\u2014]/g, ', ');
// ---------- pages ----------
export function home(lang, { weekly, today }) {
  const T = UI(lang);
  // front page preview: rotation, and at most one project by Propagator's own editor
  let ownShown = 0;
  const builders = rotate(BUILDERS, today).filter((b) => !b.own || ownShown++ < 1).slice(0, 4);
  const issueUrl = href(lang, '/weekly/' + weekly.id + '/');
  const body = `
<section class="flag">
  <p class="flag-name" aria-hidden="true">Propagator</p>
  <p class="folio"><span>${esc(T.nameplate)}</span><a href="${issueUrl}">${T.issue(no(lang, weekly.id))}</a><span>${fmtDate(lang, weekly.date)}</span></p>
</section>
<section class="cover">
  <div class="cover-main${weekly.cover ? ' cover-on-art' : ''}">
    ${weekly.cover ? art(lang, weekly.cover, { w: 1200, h: 900, cls: 'art-cover' }) : ''}
    <div class="cover-text">
    <h1>${esc(L(weekly.title, lang))}</h1>
    <p class="dek">${esc(L(weekly.dek, lang))}</p>
    <p class="actions"><a class="btn" href="${issueUrl}">${T.readIssue(no(lang, weekly.id))}</a><a class="btn btn-ghost" href="${href(lang, '/learn/')}">${T.learnTeaser}</a></p>
    </div>
  </div>
  <nav class="cover-lines" aria-labelledby="h-intoc"><h2 id="h-intoc">${T.inIssue}</h2><ol>${weekly.stories.map((st, i) => `<li><a href="${issueUrl}#s${i + 1}"><b>${String(i + 1).padStart(2, '0')}</b><span>${esc(L(st.title, lang))}</span></a></li>`).join('')}</ol></nav>
</section>
${weekly.tldr ? `<section class="band" aria-labelledby="h-tldr"><h2 id="h-tldr" class="kicker">${T.tldr}</h2><ul>${L(weekly.tldr, lang).map((x) => `<li>${esc(x)}</li>`).join('')}</ul></section>` : ''}
${weekly.claims ? section('claims', T.claims, `<p class="sec-intro">${T.claimsIntro}</p>${claimsTable(lang, weekly.claims)}`, `<a class="sec-link" href="${issueUrl}#claims">${T.readIssue(no(lang, weekly.id))}</a>`) : ''}
${weekly.spotlight ? spotlight(lang, weekly.spotlight) : ''}
${section('builders', T.builders, `<ul class="b-grid b-grid-4">${builders.map((b) => builderCard(lang, b)).join('')}</ul>`, `<a class="sec-link" href="${href(lang, '/community/')}">${T.buildersAll}</a>`)}
${weekly.roles?.items?.length ? section('roles', T.roles, rolesBlock(lang, weekly.roles)) : ''}
${subscribeBox(lang)}
<section class="learn-cta"><div><h2>${T.learnTeaser}</h2><p>${esc(T.learnDek)}</p></div><a class="btn" href="${href(lang, '/learn/')}">${T.learnGo}</a></section>`;
  return { title: '', desc: L(weekly.dek, lang), body };
}

export function weeklyPage(lang, w, { prev, next }) {
  const T = UI(lang);
  const words = JSON.stringify([w.note, w.stories]).split(/\s+/).length;
  const body = `
<article class="issue">
  <header class="hero hero-issue">
    <p class="masthead"><span>${T.issue(no(lang, w.id))}</span><span>${T.range(fmtDate(lang, w.range[0], { day: 'numeric', month: 'long' }), fmtDate(lang, w.range[1]))}</span><span>${T.min(Math.max(3, Math.round(words / 220)))}</span></p>
    <h1>${esc(L(w.title, lang))}</h1>
    <p class="dek">${esc(L(w.dek, lang))}</p>
    <p class="byline">${T.editedBy(ext('https://x.com/ekinoks_26', 'ecamli'))}</p>
    ${tldrBox(lang, w)}
  </header>
  ${w.pulse ? race(lang, w.pulse) : ''}
  <div class="issue-body">
    <aside class="toc" aria-label="${esc(T.inIssue)}"><ol>
      <li><a href="#note">${T.note}</a></li><li><a href="#stories">${T.stories}</a></li>${w.pulse ? `<li><a href="#numbers">${T.numbers}</a></li>` : ''}${w.claims ? `<li><a href="#claims">${T.claims}</a></li>` : ''}${w.spotlight ? `<li><a href="#spotlight">${T.spotlight}</a></li>` : ''}${w.video ? `<li><a href="#video">${T.video}</a></li>` : ''}${w.events?.length ? `<li><a href="#events">${T.eventsTitle}</a></li>` : ''}<li><a href="#roles">${T.roles}</a></li>${w.voices?.length ? `<li><a href="#voices">${T.voices}</a></li>` : ''}${w.world?.length ? `<li><a href="#world">${T.world}</a></li>` : ''}<li><a href="#builders">${T.builders}</a></li>${w.takePart?.length ? `<li><a href="#takepart">${T.takePart}</a></li>` : ''}${w.jobs?.length ? `<li><a href="#jobs">${T.jobs}</a></li>` : ''}${w.reads?.length ? `<li><a href="#reads">${T.reads}</a></li>` : ''}
    </ol></aside>
    <div class="issue-main">
      ${section('note', T.note, `<div class="prose letter">${L(w.note, lang).map((p) => `<p>${esc(p)}</p>`).join('')}<p class="sig">ecamli</p></div>`)}
      ${section('stories', T.stories, `<div class="stories">${w.stories.map((s, i) => `<article class="story${s.art ? ' has-art' : ''}" id="s${i + 1}">${s.art ? `<figure class="story-art">${art(lang, s.art)}</figure>` : ''}<div class="story-text"><p class="story-meta"><b class="st-no">${String(i + 1).padStart(2, '0')}</b>${tagChip(lang, s.tag)}${claimChip(lang, s.claim)}</p><h3>${esc(L(s.title, lang))}</h3><p>${esc(L(s.body, lang))}</p>${srcList(s.sources)}</div></article>`).join('')}</div>`)}
      ${w.pulse ? section('numbers', T.numbers, `<p class="sec-intro">${T.pulseWeek(fmtDate(lang, w.pulse.window[0], { day: 'numeric', month: 'long' }), fmtDate(lang, w.pulse.window[1], { day: 'numeric', month: 'long' }))}. ${claimChip(lang, 'company')}</p>${pulseGrid(lang, w.pulse)}`) : ''}
      ${w.claims ? section('claims', T.claims, `<p class="sec-intro">${T.claimsIntro}</p>${claimsTable(lang, w.claims)}`) : ''}
      ${w.spotlight ? `<div id="spotlight">${spotlight(lang, w.spotlight)}</div>` : ''}
      ${w.video ? section('video', T.video, video(lang, w.video)) : ''}
      ${w.events?.length ? section('events', T.eventsTitle, eventList(lang, w.events.map((id) => EVENTS.find((e) => e.id === id)).filter(Boolean))) : ''}
      ${section('roles', T.roles, rolesBlock(lang, w.roles))}
      ${w.voices?.length ? section('voices', T.voices, voices(lang, w.voices)) : ''}
      ${section('builders', T.builders, `<ul class="b-grid">${(w.builders || []).map((id) => BUILDERS.find((b) => b.id === id)).filter(Boolean).map((b) => builderCard(lang, b)).join('')}</ul><p class="more"><a href="${href(lang, '/submit/')}">${T.yours}</a></p>`)}
      ${w.world?.length ? section('world', T.world, `<p class="sec-intro">${T.worldIntro}</p>${linkList(lang, w.world)}`) : ''}
      ${w.takePart?.length ? section('takepart', T.takePart, takePart(lang, w.takePart)) : ''}
      ${w.jobs?.length ? section('jobs', T.jobs, linkList(lang, w.jobs)) : ''}
      ${w.reads?.length ? section('reads', T.reads, `<ul class="reads">${w.reads.map(([t, src, d, u]) => `<li>${ext(u, esc(t))}<span>${esc(src)}${d ? ', ' + shortDate(lang, d) : ''}</span></li>`).join('')}</ul>`) : ''}
      ${w.quote ? `<figure class="quote"><blockquote lang="en">${esc(w.quote.text)}</blockquote><figcaption>${ext(w.quote.url, esc(w.quote.who))}</figcaption></figure>` : ''}
      ${subscribeBox(lang)}
      <nav class="pager">${prev ? `<a href="${href(lang, '/weekly/' + prev.id + '/')}">${T.prev}: ${esc(L(prev.title, lang))}</a>` : '<span></span>'}${next ? `<a href="${href(lang, '/weekly/' + next.id + '/')}">${T.next}: ${esc(L(next.title, lang))}</a>` : ''}</nav>
    </div>
  </div>
</article>`;
  return { title: `${T.issue(no(lang, w.id))}: ${L(w.title, lang)}`, desc: L(w.dek, lang), body, og: w.og ? `${SITE}/og/weekly-${w.id}-${lang}.png` : undefined, jsonld: { '@context': 'https://schema.org', '@type': 'NewsArticle', headline: L(w.title, lang), description: L(w.dek, lang), datePublished: w.date, inLanguage: lang, author: { '@type': 'Person', name: 'ecamli', url: 'https://x.com/ekinoks_26' }, publisher: { '@type': 'Organization', name: 'Propagator', url: SITE }, about: { '@type': 'Thing', name: 'Optimum', url: LINKS.site } } };
}

export function archivePage(lang, weekly) {
  const T = UI(lang);
  const cover = (x) => x.og ? `<img src="/og/weekly-${esc(x.id)}-${lang}.png" alt="" loading="lazy" width="1200" height="630">` : `<span class="bi-plain" aria-hidden="true">${esc(no(lang, x.id))}</span>`;
  const wk = weekly.length ? `<ol class="back-issues">${weekly.map((x) => `<li><a href="${href(lang, `/weekly/${x.id}/`)}"><span class="bi-cover">${cover(x)}</span><span class="a-date">${T.issue(no(lang, x.id))}, ${fmtDate(lang, x.date)}</span><span class="a-title">${esc(L(x.title, lang))}</span>${x.dek ? `<span class="a-dek">${esc(L(x.dek, lang))}</span>` : ''}${x.n ? `<span class="a-n">${T.storiesN(x.n)}</span>` : ''}</a></li>`).join('')}</ol>` : `<p class="empty">${T.archiveEmpty}</p>`;
  return { title: T.nav.issues, desc: T.archiveDek, body: `<header class="hero hero-small"><h1>${T.nav.issues}</h1><p class="dek">${T.archiveDek}</p></header>${wk}` };
}

export function learnPage(lang) {
  const T = UI(lang);
  const body = `
<header class="hero hero-learn"><p class="masthead">${ext(LINKS.site, OPTIMUM_WORDMARK, 'opt-link opt-big')}</p><h1>${T.learnTitle}</h1><p class="dek">${T.learnDek}</p></header>
<div class="learn">
  <nav class="toc" aria-label="${esc(T.sections)}"><ol>${LEARN.map((s) => `<li><a href="#${s.id}">${esc(L(s.h, lang))}</a></li>`).join('')}<li><a href="#glossary">${T.glossary}</a></li><li><a href="#timeline">${T.timeline}</a></li></ol></nav>
  <div class="learn-main">
    ${LEARN.map((s, i) => `<section class="lsec" id="${s.id}"><h2><span class="lnum">${i + 1}</span>${esc(L(s.h, lang))}</h2>${s.id === 'rlnc' ? codedFigure(lang) : ''}<div class="prose">${L(s.p, lang).map((p) => `<p>${esc(p)}</p>`).join('')}</div>${srcList(s.src)}</section>`).join('')}
    <section class="lsec" id="glossary"><h2>${T.glossary}</h2><dl class="gloss">${GLOSSARY.map(([w, d]) => `<div><dt>${esc(w)}</dt><dd>${esc(L(d, lang))}</dd></div>`).join('')}</dl></section>
    <section class="lsec" id="timeline"><h2>${T.timeline}</h2><ol class="timeline">${TEAM.timeline.map(([y, t]) => `<li><b>${esc(y)}</b><span>${esc(L(t, lang))}</span></li>`).join('')}</ol>${srcList([['getoptimum.xyz/team', LINKS.team]])}</section>
    <section class="lsec" id="official"><h2>${T.official}</h2><ul class="official">${[['Website', LINKS.site], ['Docs', LINKS.docs], ['Blog', LINKS.blog], ['Hub', LINKS.hub], ['X', LINKS.x], ['Discord', LINKS.discord], ['YouTube', LINKS.youtube], ['GitHub', LINKS.github]].map(([n, u]) => `<li>${ext(u, esc(n))}</li>`).join('')}</ul></section>
  </div>
</div>`;
  return { title: T.learnTitle, desc: T.learnDek, body, jsonld: { '@context': 'https://schema.org', '@type': 'Article', headline: T.learnTitle, description: T.learnDek, inLanguage: lang, about: { '@type': 'Thing', name: 'Optimum', url: LINKS.site } } };
}

// The plain words diagram: a block split into pieces, mixed into coded pieces, any enough of them rebuild it.
function codedFigure(lang) {
  const T = UI(lang);
  const cap = T.coded.cap;
  const box = (x, y, w, h, cls, txt = '') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" class="${cls}"/>${txt ? `<text x="${x + w / 2}" y="${y + h / 2 + 5}" text-anchor="middle">${txt}</text>` : ''}`;
  const pieces = ['a', 'b', 'c', 'd'];
  // over GF(2): a+c, b+d, a+b+d and c+d are linearly independent (rank 4), so those four rebuild a, b, c, d
  const coded = [['a+c', 1], ['b+d', 1], ['a+b+d', 1], ['c+d', 1], ['a+d', 0], ['b+c', 0]];
  return `<figure class="coded"><svg viewBox="0 0 640 200" role="img" aria-label="${esc(cap)}">
  ${box(10, 60, 90, 80, 'blk', esc(T.coded.block))}
  ${pieces.map((p, i) => box(140, 18 + i * 42, 52, 34, 'pc', p)).join('')}
  ${coded.map(([t, got], i) => box(250 + (i % 3) * 96, 30 + Math.floor(i / 3) * 80, 84, 40, got ? 'cp cp-got' : 'cp', t)).join('')}
  ${box(548, 60, 82, 80, 'blk blk-out', esc(T.coded.block))}
  <path d="M100 100 H130 M192 100 H240 M538 100 H520" class="ln"/>
</svg><figcaption>${esc(cap)}</figcaption></figure>`;
}

export function peoplePage(lang, jobs) {
  const T = UI(lang);
  const body = `
<header class="hero hero-small"><h1>${T.peopleTitle}</h1><p class="dek">${T.peopleDek}</p></header>
${section('founders', T.founders, `<ul class="people">${TEAM.founders.map((f) => `<li class="person"><img src="${esc(f.img)}" alt="${esc(f.name)}" width="400" height="400" loading="lazy"><h3>${esc(f.name)}</h3><p class="role">${esc(L(f.role, lang))}</p><p>${esc(L(f.bio, lang))}</p><p class="plinks">${f.links.map(([n, u]) => ext(u, n)).join('')}</p></li>`).join('')}</ul>${srcList([['getoptimum.xyz/team', LINKS.team]])}`)}
${section('advisors', T.advisors, `<ul class="advisors">${TEAM.advisors.map((a) => `<li><h3>${esc(a.name)}</h3><p>${esc(L(a.bio, lang))}</p></li>`).join('')}</ul>`)}
${section('wider', T.wider, `<p class="sec-intro">${esc(T.widerIntro)}</p><ul class="advisors">${TEAM.wider.map((a) => `<li><h3>${a.x ? ext('https://x.com/' + a.x, esc(a.name)) : esc(a.name)}</h3><p>${esc(L(a.role, lang))}</p>${srcList([a.src])}</li>`).join('')}</ul>`)}
${jobs?.length ? section('jobs', T.jobs, linkList(lang, jobs)) : ''}
<p class="more">${ext(LINKS.careers, esc(T.careers))}</p>`;
  return { title: T.peopleTitle, desc: T.peopleDek, body };
}

export function communityPage(lang, today, latest) {
  const T = UI(lang);
  const kinds = [...new Set(BUILDERS.map((b) => b.kind))];
  const body = `
<header class="hero hero-small"><h1>${T.nav.community}</h1><p class="dek">${esc(T.communityDek)}</p><p class="actions"><a class="btn" href="${href(lang, '/submit/')}">${T.yours}</a><a class="btn btn-ghost" href="${LINKS.discord}" rel="noopener" target="_blank">discord.gg/getoptimum</a></p></header>
${section('builders', T.builders, `<p class="sec-intro">${esc(T.buildersDek)}</p>
<div class="filters" role="group" aria-label="${esc(T.filterLabel)}"><button type="button" class="chip" aria-pressed="true" data-f="">${T.filterAll}</button>${kinds.map((k) => `<button type="button" class="chip" aria-pressed="false" data-f="${k}">${esc(L(KINDS[k], lang))}</button>`).join('')}</div>
<ul class="b-grid b-grid-all">${rotate(BUILDERS, today).map((b) => builderCard(lang, b)).join('')}</ul>`)}
<div class="split">
${latest?.roles?.items?.length ? section('roles', T.roles, rolesBlock(lang, latest.roles), `<a class="sec-link" href="${href(lang, '/weekly/' + latest.id + '/')}#roles">${T.issue(no(lang, latest.id))}</a>`) : ''}
${section('takepart', T.takePart, takePart(lang, TAKE_PART))}
</div>
<div class="split">
${section('people', T.community, `<ul class="advisors">${TEAM.community.map((c) => `<li><h3>${esc(c.name)}</h3><p>${esc(L(c.role, lang))}</p></li>`).join('')}</ul>`)}
${section('ladder', T.ladder, `<ol class="ladder">${TEAM.ladder.map(([n, d]) => `<li><b>${esc(n)}</b><span>${esc(L(d, lang))}</span></li>`).join('')}</ol>`)}
</div>`;
  return { title: T.nav.community, desc: T.communityDek, body };
}

export function aboutPage(lang) {
  const T = UI(lang);
  const body = `<header class="hero hero-small"><h1>${T.aboutTitle}</h1></header><div class="about">${ABOUT(lang).map(([h, ps]) => `<section><h2>${esc(h)}</h2>${ps.map((p) => `<p>${esc(p)}</p>`).join('')}</section>`).join('')}</div>`;
  return { title: T.aboutTitle, desc: ABOUT(lang)[0][1][0], body };
}

export function submitPage(lang) {
  const T = UI(lang);
  const body = `<header class="hero hero-small"><h1>${T.submitTitle}</h1><p class="dek">${T.submitDek}</p></header>
<form class="submit" method="post" action="/api/submit" data-ok="${esc(T.f.sent)}" data-err="${esc(T.f.err)}">
  <fieldset><legend>${T.f.kind}</legend>${Object.entries(T.kinds).map(([k, v], i) => `<label class="radio"><input type="radio" name="kind" value="${k}"${i ? '' : ' checked'}><span>${esc(v)}</span></label>`).join('')}</fieldset>
  <label>${T.f.url}<input name="url" type="url" required placeholder="https://" maxlength="400"></label>
  <label>${T.f.name}<input name="name" maxlength="80" autocomplete="nickname"></label>
  <label>${T.f.note}<textarea name="note" rows="4" maxlength="800"></textarea></label>
  <input type="text" name="website" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">
  <input type="hidden" name="lang" value="${lang}">
  <button class="btn" type="submit">${T.f.send}</button>
  <p class="form-msg" role="status" aria-live="polite"></p>
</form>`;
  return { title: T.submitTitle, desc: T.submitDek, body };
}

export function subscribedPage(lang, state) {
  const T = UI(lang);
  return { title: T.sub.title, desc: T.sub.dek, body: `<header class="hero hero-small"><h1>${esc(T.sub[state])}</h1><p class="actions"><a class="btn" href="${href(lang, '/')}">${T.home}</a></p></header>` };
}

export function notFound(lang) {
  const T = UI(lang);
  return { title: '404', desc: T.notFound, body: `<header class="hero hero-small"><h1>${T.notFound}</h1><p class="actions"><a class="btn" href="${href(lang, '/')}">${T.home}</a></p></header>` };
}

export function feed(lang, items) {
  const T = UI(lang);
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel><title>Propagator</title><link>${SITE}${href(lang, '/')}</link><description>${esc(T.tagline)}</description><language>${lang}</language>
${items.map((x) => `<item><title>${esc((x.kind === 'weekly' ? T.issue(no(lang, x.id)) + ': ' : '') + L(x.title, lang))}</title><link>${SITE}${href(lang, `/${x.kind}/${x.id}/`)}</link><guid>${SITE}${href(lang, `/${x.kind}/${x.id}/`)}</guid><pubDate>${new Date(x.date + 'T06:00:00Z').toUTCString()}</pubDate></item>`).join('\n')}
</channel></rss>`;
}
