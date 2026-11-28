// Server side rendering of every page. Pure functions: data in, HTML out.
import { LANGS, LANG, CODES } from './i18n.mjs';
import { UI, ABOUT, L, localeOf } from './t.mjs';
import { art } from './art.mjs';
import { slugOf as slugOfName, keyOf } from './register.mjs';
import { SEED } from './seed.mjs';
import { LEARN, GLOSSARY, TEAM, BUILDERS, KINDS, LINKS, EVENTS, TAKE_PART, FEATURED, featuredFor, BADGES, GATEWAY, GIFS, CALLS, CALL_THREADS } from './content.mjs';

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

// Propagator's mark: a P whose bowl is one continuous loop, like Optimum's, and whose stem breaks into coded pieces on the way down.
export const MARK = '<svg class="pmark" viewBox="0 0 32 32" aria-hidden="true"><path class="pm-p" d="M9 19.5V11.5a7.5 7.5 0 0 1 7.5-7.5h3a7.5 7.5 0 0 1 0 15H14.5"/><circle class="pm-a" cx="9" cy="24.4" r="2.2"/><circle class="pm-b" cx="9" cy="29.4" r="1.5"/></svg>';

const ICONS = {
  home: '<path d="M3.5 9.2 10 4l6.5 5.2V16a1 1 0 0 1-1 1h-3.2v-4.4H7.7V17H4.5a1 1 0 0 1-1-1z"/>',
  members: '<circle cx="7.6" cy="7.2" r="2.8"/><path d="M2.6 16.4c.6-2.8 2.6-4.4 5-4.4s4.4 1.6 5 4.4"/><circle cx="13.8" cy="6.6" r="2.2"/><path d="M14 11.4c1.9.2 3.2 1.5 3.6 3.6"/>',
  classes: '<path d="M3.5 8.4v3.2H6l6 3.6V4.8L6 8.4z"/><path d="M14.8 7.6a3.4 3.4 0 0 1 0 4.8"/>',
  stats: '<path d="M3.5 16.5h13M6 13.5v-4M10 13.5v-8M14 13.5v-6"/>',
  issues: '<rect x="3.5" y="3.5" width="13" height="13" rx="2.4"/><path d="M6.6 7.4h6.8M6.6 10.2h6.8M6.6 13h4"/>',
  learn: '<path d="M3.4 5.2c2.5-1 4.6-.9 6.6.6v10.6c-2-1.4-4.1-1.5-6.6-.6zM16.6 5.2c-2.5-1-4.6-.9-6.6.6v10.6c2-1.4 4.1-1.5 6.6-.6z"/>',
  builders: '<rect x="3.5" y="3.5" width="5.4" height="5.4" rx="1.4"/><rect x="11.1" y="3.5" width="5.4" height="5.4" rx="1.4"/><rect x="3.5" y="11.1" width="5.4" height="5.4" rx="1.4"/><rect x="11.1" y="11.1" width="5.4" height="5.4" rx="2.7"/>',
  people: '<circle cx="10" cy="7" r="3"/><path d="M4.2 16.8c.8-3.1 3-4.8 5.8-4.8s5 1.7 5.8 4.8"/>',
  submit: '<path d="M16.5 3.5 3.5 9l5.2 2.3L11 16.5z"/><path d="m8.7 11.3 7.8-7.8"/>',
  about: '<circle cx="10" cy="10" r="6.8"/><path d="M10 9.2v4.4M10 6.6v.01"/>',
  rss: '<path d="M4.6 4.6a10.8 10.8 0 0 1 10.8 10.8M4.6 9a6.4 6.4 0 0 1 6.4 6.4"/><circle cx="5.6" cy="14.4" r="1.1"/>',
  calls: '<path d="M10 3.5a2.5 2.5 0 0 1 2.5 2.5v3.5a2.5 2.5 0 0 1-5 0V6A2.5 2.5 0 0 1 10 3.5Z"/><path d="M5 9.5a5 5 0 0 0 10 0M10 14.5v2.5M7.5 17h5"/>',
  gifs: '<rect x="3.5" y="4.5" width="13" height="11" rx="2.4"/><path d="M7.6 8.4H6.5v3.2h1.6v-1.4M10 8.4v3.2M12.4 11.6V8.4h1.6M12.4 10h1.2"/>',
  gateway: '<rect x="3.5" y="4" width="13" height="5" rx="1.6"/><rect x="3.5" y="11" width="13" height="5" rx="1.6"/><path d="M6.5 6.5h.01M6.5 13.5h.01M10 6.5h3.5M10 13.5h3.5"/>',
  side: '<rect x="3" y="3.8" width="14" height="12.4" rx="2.4"/><path d="M8 3.8v12.4"/>',
  search: '<circle cx="9" cy="9" r="5.6"/><path d="m13.2 13.2 3.6 3.6"/>',
  menu: '<path d="M3.5 6h13M3.5 10h13M3.5 14h13"/>',
  close: '<path d="m5 5 10 10M15 5 5 15"/>',
};
export const icon = (k, cls = 'ic') => `<svg class="${cls}" viewBox="0 0 20 20" aria-hidden="true">${ICONS[k] || ''}</svg>`;

// ---------- layout ----------
// A side menu that can stay open or fold to icons (the reader's choice, kept in this browser), a slim bar on top
// with search, language and theme, and on phones the same menu as a drawer.
export function layout({ lang, path, title, desc, body, assets, jsonld, noindex, og }) {
  const T = UI(lang);
  const self = href(lang, path);
  const on = (p) => path === p || (p !== '/' && path.startsWith(p)) || (p === '/archive/' && /^\/weekly\//.test(path)) || (p === '/members/' && /^\/m\//.test(path)) || (p === '/classes/' && /^\/class\//.test(path));
  const item = (k, p, label, extra = '') => `<li><a href="${href(lang, p)}"${on(p) ? ' aria-current="page"' : ''}${extra} data-tip="${esc(label)}">${icon(k)}<span>${esc(label)}</span></a></li>`;
  const groups = [
    [['home', '/', T.nav.home], ['members', '/members/', T.nav.members], ['classes', '/classes/', T.nav.classes], ['stats', '/stats/', T.nav.stats]],
    [['issues', '/archive/', T.nav.issues], ['calls', '/calls/', T.nav.calls], ['learn', '/learn/', T.nav.learn], ['gateway', '/gateway/', T.nav.gateway]],
    [['builders', '/builders/', T.nav.builders], ['gifs', '/gifs/', T.nav.gifs], ['people', '/people/', T.nav.people]],
  ];
  const fullTitle = title ? `${title} | Propagator` : `Propagator: ${T.tagline}`;
  const ogImg = og || SITE + '/' + assets.og;
  return `<!doctype html>
<html lang="${LANG[lang].hreflang || lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
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
<meta name="theme-color" content="#eef1f4" media="(prefers-color-scheme: light)"><meta name="theme-color" content="#0c0e10" media="(prefers-color-scheme: dark)">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="alternate" type="application/rss+xml" title="Propagator" href="${href(lang, '/feed.xml')}">
<link rel="preload" href="/assets/fonts/${({ hi: 'noto-sans-devanagari-devanagari', ru: 'geist-cyrillic', uk: 'geist-cyrillic' })[lang] || 'geist-latin'}.woff2" as="font" type="font/woff2" crossorigin>
<script src="/${assets.theme}"></script>
<link rel="stylesheet" href="/${assets.css}">
${jsonld ? `<script type="application/ld+json">${JSON.stringify(jsonld).replace(/</g, '\\u003c')}</script>` : ''}
</head>
<body>
<svg class="vh" aria-hidden="true" focusable="false"><defs><linearGradient id="pg-chrome" gradientUnits="userSpaceOnUse" x1="0" y1="3" x2="0" y2="21"><stop offset="0" stop-color="#ffffff"/><stop offset=".38" stop-color="#dfe5ea"/><stop offset=".52" stop-color="#97a3ae"/><stop offset=".66" stop-color="#eef2f5"/><stop offset="1" stop-color="#b9c3cc"/></linearGradient></defs></svg>
<a class="skip" href="#main">${T.skip}</a>
<div class="shell">
<aside class="side" id="side" aria-label="${esc(T.mainNav)}">
  <div class="side-head">
    <a class="brand" href="${href(lang, '/')}">${MARK}<span class="brand-name">Propagator</span></a>
    <button type="button" class="side-pin" aria-pressed="true" aria-label="${esc(T.side.keep)}" data-keep="${esc(T.side.keep)}" data-fold="${esc(T.side.fold)}">${icon('side')}</button>
    <button type="button" class="side-x" aria-label="${esc(T.side.close)}">${icon('close')}</button>
  </div>
  <nav class="side-nav">${groups.map((g) => `<ul>${g.map(([k, p, l]) => item(k, p, l)).join('')}</ul>`).join('')}</nav>
  <div class="side-foot">
    <ul>${item('submit', '/submit/', T.footerLinks.submit)}${item('about', '/about/', T.footerLinks.about)}<li><a href="${href(lang, '/feed.xml')}" data-tip="${esc(T.footerLinks.rss)}">${icon('rss')}<span>${esc(T.footerLinks.rss)}</span></a></li></ul>
    <p class="side-opt">${esc(T.covering)} ${ext(LINKS.site, OPTIMUM_WORDMARK, 'opt-link')}</p>
  </div>
</aside>
<div class="scrim" hidden></div>
<div class="page">
<header class="top">
  <button type="button" class="menu-btn" aria-expanded="false" aria-controls="side" aria-label="${esc(T.side.open)}">${icon('menu')}</button>
  <a class="top-brand" href="${href(lang, '/')}">${MARK}<span>Propagator</span></a>
  <button type="button" class="find-btn" aria-haspopup="dialog" aria-label="${esc(T.find.label)}">${icon('search')}<span>${esc(T.find.label)}</span><kbd>Ctrl K</kbd></button>
  <div class="tools"><details class="langs"><summary aria-label="${esc(T.langLabel)}"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="7.5"/><path d="M2.5 10h15M10 2.5c2.2 2.3 2.2 12.7 0 15M10 2.5c-2.2 2.3-2.2 12.7 0 15"/></svg><span>${esc(LANG[lang].name)}</span></summary><ul>${LANGS.map((l) => `<li><a href="${href(l.code, path)}" hreflang="${l.hreflang || l.code}" lang="${l.hreflang || l.code}"${l.code === lang ? ' aria-current="true"' : ''}>${esc(l.name)}</a></li>`).join('')}</ul></details><button class="theme" type="button" aria-label="${esc(T.themeToggle)}" title="${esc(T.themeToggle)}"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="7.5"/><path d="M10 2.5a7.5 7.5 0 0 1 0 15z" class="fill"/></svg></button></div>
</header>
<main id="main">
${body}
</main>
<footer class="foot">
  <div class="foot-in">
    <p class="foot-brand">${MARK}<span>Propagator</span></p>
    <p class="foot-note">${esc(T.footer)}${lang !== 'en' ? ` ${esc(T.translated)}` : ''}</p>
    <p class="foot-links"><a href="${href(lang, '/stats/')}">${T.reg.st.title}</a><a href="${href(lang, '/people/')}">${T.nav.people}</a><a href="${href(lang, '/about/')}">${T.footerLinks.about}</a><a href="${href(lang, '/submit/')}">${T.footerLinks.submit}</a><a href="${href(lang, '/feed.xml')}">${T.footerLinks.rss}</a></p>
  </div>
</footer>
</div>
</div>
<dialog class="find" aria-label="${esc(T.find.label)}" data-lang="${lang}" data-base="${href(lang, '/m/')}" data-dir="${href(lang, '/members/')}" data-pages="${esc(JSON.stringify([...groups.flat(), ['submit', '/submit/', T.footerLinks.submit], ['about', '/about/', T.footerLinks.about]].map(([k, p, l]) => [l, href(lang, p), k])))}" data-t-pages="${esc(T.find.pages)}" data-t-members="${esc(T.find.members)}" data-t-none="${esc(T.find.none)}" data-t-all="${esc(T.find.all)}">
  <form method="dialog" class="find-box" role="search"><label class="vh" for="find-q">${esc(T.find.label)}</label>${icon('search')}<input id="find-q" type="search" placeholder="${esc(T.find.ph)}" autocomplete="off" spellcheck="false" role="combobox" aria-expanded="true" aria-controls="find-list" aria-autocomplete="list"><kbd>Esc</kbd></form>
  <ul class="find-list" id="find-list" role="listbox"></ul>
  <p class="find-hint">${esc(T.find.hint)}</p>
</dialog>
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

function spotlight(lang, s, label) {
  const T = UI(lang);
  return `<article class="spot${s.image ? '' : ' spot-noimg'}">
  ${s.image ? `<a class="spot-img" href="${esc(s.url)}" rel="noopener" target="_blank"><img src="${esc(s.image)}" alt="${esc(s.name)}" loading="lazy" width="1200" height="750"></a>` : ''}
  <div class="spot-text">
    <p class="kicker">${label || T.spotlight}</p>
    <h3>${esc(L(s.title, lang))}</h3>
    <p class="spot-by">${esc(s.name)}, ${T.by ? T.by + ' ' : ''}${s.handle ? ext('https://x.com/' + s.handle, esc(s.by) + ' (@' + esc(s.handle) + ')') : esc(s.by)}</p>
    <p>${esc(L(s.body, lang))}</p>
    <p class="actions">${s.url ? ext(s.url, esc(T.visit), 'btn') : ''}${s.post ? ext(s.post, esc(T.readThread), 'btn btn-ghost') : ''}</p>
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
const linkList = (lang, list, cls = 'reads') => `<ul class="${cls}">${list.map((x) => `<li>${ext(x.url, esc(L(x.text || x.title, lang)))}${x.who || x.where || x.date ? `<span>${esc([x.who, x.where && x.where.replace(/FullTime/g, 'Full time').replace(/PartTime/g, 'Part time')].filter(Boolean).join(', '))}${x.date ? (x.who || x.where ? ', ' : '') + shortDate(lang, x.date) : ''}</span>` : ''}</li>`).join('')}</ul>`;
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
    ${weekly.cover ? art(lang, weekly.cover, { w: 1200, h: 675, cls: 'art-cover' }) : ''}
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
  // back issues: one per month before the weekly issues began, written later from public sources
  const month = w.back ? fmtDate(lang, w.id + '-15', { month: 'long', year: 'numeric' }) : '';
  const label = w.back ? T.backIssue(month) : T.issue(no(lang, w.id));
  const evs = [...(w.events || []).map((id) => EVENTS.find((e) => e.id === id)).filter(Boolean), ...(w.eventItems || [])];
  const tocItems = `<li><a href="#note">${T.note}</a></li><li><a href="#stories">${T.stories}</a></li>${w.pulse ? `<li><a href="#numbers">${T.numbers}</a></li>` : ''}${w.claims ? `<li><a href="#claims">${T.claims}</a></li>` : ''}${w.spotlight ? `<li><a href="#spotlight">${T.spotlight}</a></li>` : ''}${w.video ? `<li><a href="#video">${T.video}</a></li>` : ''}${evs.length ? `<li><a href="#events">${T.eventsTitle}</a></li>` : ''}${w.roles ? `<li><a href="#roles">${T.roles}</a></li>` : ''}${w.voices?.length ? `<li><a href="#voices">${T.voices}</a></li>` : ''}${w.world?.length ? `<li><a href="#world">${T.world}</a></li>` : ''}${w.builders?.length || !w.back ? `<li><a href="#builders">${T.builders}</a></li>` : ''}${w.takePart?.length ? `<li><a href="#takepart">${T.takePart}</a></li>` : ''}${w.jobs?.length ? `<li><a href="#jobs">${T.jobs}</a></li>` : ''}${w.reads?.length ? `<li><a href="#reads">${T.reads}</a></li>` : ''}`;
  const body = `
<article class="issue">
  <header class="hero hero-issue">
    <p class="masthead"><span>${w.back ? T.backShort : label}</span><span>${w.back ? esc(month) : T.range(fmtDate(lang, w.range[0], { day: 'numeric', month: 'long' }), fmtDate(lang, w.range[1]))}</span><span>${T.min(Math.max(3, Math.round(words / 220)))}</span></p>
    <h1>${esc(L(w.title, lang))}</h1>
    <p class="dek">${esc(L(w.dek, lang))}</p>
    <p class="byline">${T.editedBy(ext('https://x.com/ekinoks_26', 'ecamli'))}</p>
    ${w.back ? `<p class="back-note">${esc(T.backNote)}</p>` : ''}
    ${tldrBox(lang, w)}
  </header>
  ${w.pulse ? race(lang, w.pulse) : ''}
  <details class="toc-m"><summary>${esc(T.inIssue)}</summary><ol>${tocItems}</ol></details>
  <div class="issue-body">
    <aside class="toc" aria-label="${esc(T.inIssue)}"><ol>${tocItems}</ol></aside>
    <div class="issue-main">
      ${section('note', T.note, `<div class="prose letter">${L(w.note, lang).map((p) => `<p>${esc(p)}</p>`).join('')}<p class="sig">ecamli</p></div>`)}
      ${section('stories', T.stories, `<div class="stories">${w.stories.map((s, i) => `<article class="story${s.art ? ' has-art' : ''}" id="s${i + 1}">${s.art ? `<figure class="story-art">${art(lang, s.art)}</figure>` : ''}<div class="story-text"><p class="story-meta"><b class="st-no">${String(i + 1).padStart(2, '0')}</b>${tagChip(lang, s.tag)}${claimChip(lang, s.claim)}</p><h3>${esc(L(s.title, lang))}</h3><p>${esc(L(s.body, lang))}</p>${srcList(s.sources)}</div></article>`).join('')}</div>`)}
      ${w.pulse ? section('numbers', T.numbers, `<p class="sec-intro">${T.pulseWeek(fmtDate(lang, w.pulse.window[0], { day: 'numeric', month: 'long' }), fmtDate(lang, w.pulse.window[1], { day: 'numeric', month: 'long' }))}. ${claimChip(lang, 'company')}</p>${pulseGrid(lang, w.pulse)}`) : ''}
      ${w.claims ? section('claims', T.claims, `<p class="sec-intro">${T.claimsIntro}</p>${claimsTable(lang, w.claims)}`) : ''}
      ${w.spotlight ? `<div id="spotlight">${spotlight(lang, w.spotlight, w.back ? T.spotlightM : '')}</div>` : ''}
      ${w.video ? section('video', w.back ? T.videoM : T.video, video(lang, w.video)) : ''}
      ${evs.length ? section('events', T.eventsTitle, eventList(lang, evs)) : ''}
      ${w.roles || !w.back ? section('roles', T.roles, rolesBlock(lang, w.roles)) : ''}
      ${w.voices?.length ? section('voices', T.voices, voices(lang, w.voices)) : ''}
      ${w.back && !w.builders?.length ? '' : section('builders', T.builders, `<ul class="b-grid">${(w.builders || []).map((id) => BUILDERS.find((b) => b.id === id)).filter(Boolean).map((b) => builderCard(lang, b)).join('')}</ul><p class="more"><a href="${href(lang, '/submit/')}">${T.yours}</a></p>`)}
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
  return { title: `${label}: ${L(w.title, lang)}`, desc: L(w.dek, lang), body, og: w.og ? `${SITE}/og/weekly-${w.id}-${lang}.png` : undefined, jsonld: { '@context': 'https://schema.org', '@type': 'NewsArticle', headline: L(w.title, lang), description: L(w.dek, lang), datePublished: w.date, inLanguage: lang, author: { '@type': 'Person', name: 'ecamli', url: 'https://x.com/ekinoks_26' }, publisher: { '@type': 'Organization', name: 'Propagator', url: SITE }, about: { '@type': 'Thing', name: 'Optimum', url: LINKS.site } } };
}

export function archivePage(lang, weekly) {
  const T = UI(lang);
  const cover = (x) => x.og ? `<img src="/og/weekly-${esc(x.id)}-${lang}.png" alt="" loading="lazy" width="1200" height="630">` : x.back ? `<span class="bi-plain bi-month" aria-hidden="true"><b>${esc(fmtDate(lang, x.id + '-15', { month: 'short' }))}</b><small>${x.id.slice(0, 4)}</small></span>` : `<span class="bi-plain" aria-hidden="true">${esc(no(lang, x.id))}</span>`;
  const item = (x) => `<li><a href="${href(lang, `/weekly/${x.id}/`)}"><span class="bi-cover">${cover(x)}</span><span class="a-date">${x.back ? T.backIssue(fmtDate(lang, x.id + '-15', { month: 'long', year: 'numeric' })) : `${T.issue(no(lang, x.id))}, ${fmtDate(lang, x.date)}`}</span><span class="a-title">${esc(L(x.title, lang))}</span>${x.dek ? `<span class="a-dek">${esc(L(x.dek, lang))}</span>` : ''}${x.n ? `<span class="a-n">${T.storiesN(x.n)}</span>` : ''}</a></li>`;
  const cur = weekly.filter((x) => !x.back), back = weekly.filter((x) => x.back);
  const years = [...new Set(back.map((x) => x.id.slice(0, 4)))];
  const backHtml = back.length ? `<section class="sec" id="back"><div class="sec-head"><h2>${T.backH}</h2></div><p class="sec-intro">${esc(T.backDek)}</p>${years.map((y) => `<h3 class="bi-year">${y}</h3><ol class="back-issues bi-months">${back.filter((x) => x.id.startsWith(y)).map(item).join('')}</ol>`).join('')}</section>` : '';
  const wk = weekly.length ? `${cur.length ? `<ol class="back-issues">${cur.map(item).join('')}</ol>` : ''}${backHtml}` : `<p class="empty">${T.archiveEmpty}</p>`;
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


// ---------- Optimum GIFs ----------
export function gifsPage(lang) {
  const T = UI(lang), G = UI(lang).gifs;
  const makers = [...new Set(GIFS.map((g) => g[3]))].sort((a, b) => GIFS.filter((g) => g[3] === b).length - GIFS.filter((g) => g[3] === a).length);
  const body = `
<header class="hero hero-small"><h1>${esc(G.title)}</h1><p class="dek">${esc(G.dek)}</p><p class="gif-count">${esc(G.count(num(lang, GIFS.length), num(lang, makers.length)))}</p></header>
<div class="filters" role="group" aria-label="${esc(G.all)}"><button type="button" class="chip" aria-pressed="true" data-g="">${esc(G.all)} <span>${num(lang, GIFS.length)}</span></button>${makers.map((m) => `<button type="button" class="chip" aria-pressed="false" data-g="${esc(m)}">${esc(m)} <span>${num(lang, GIFS.filter((g) => g[3] === m).length)}</span></button>`).join('')}</div>
<ul class="gifs">${GIFS.map(([slug, img, title, by, w, h]) => `<li data-by="${esc(by)}"><a href="https://tenor.com/view/${esc(slug)}" rel="noopener" target="_blank"><img src="${esc(img)}" alt="${esc(title)}" width="${w}" height="${h}" loading="lazy" decoding="async"><span class="gif-cap"><b>${esc(title)}</b><small>${esc(G.by(by))}</small></span></a></li>`).join('')}</ul>
<section class="sec"><div class="learn-cta"><div><h2>${esc(G.how)}</h2><p>${esc(G.howUse)}</p><p>${esc(G.howAdd)}</p></div><a class="btn" href="${href(lang, '/submit/')}">${esc(G.send)}</a></div></section>`;
  return { title: G.title, desc: G.dek, body };
}

// ---------- Community calls ----------
export function callsPage(lang) {
  const C = UI(lang).calls;
  const day = (d) => d.length === 10 ? fmtDate(lang, d, { day: 'numeric', month: 'long', year: 'numeric' }) : fmtDate(lang, d, { month: 'long', year: 'numeric' });
  const tags = Object.keys(C.tags).filter((t) => CALLS.some((c) => c.tags.includes(t)));
  const years = [...new Set(CALLS.map((c) => c.date.slice(0, 4)))];
  const first = CALLS[CALLS.length - 1].date, last = CALLS[0].date;
  const call = (c) => `<article class="call" id="c-${c.date}" data-tags="${c.tags.join(' ')}">
  <div class="call-date"><time datetime="${c.date}"><b>${c.date.length === 10 ? esc(fmtDate(lang, c.date, { day: 'numeric' })) : ''}</b><span>${esc(fmtDate(lang, c.date, c.date.length === 10 ? { month: 'short' } : { month: 'long' }))}</span></time></div>
  <div class="call-body"><h3><a href="#c-${c.date}" aria-label="${esc(C.link)}: ${esc(day(c.date))}">${esc(L(c.h, lang))}</a></h3>
  <p class="call-meta">${c.host ? `<span>${esc(C.host(c.host))}</span>` : ''}<span>${c.src.map(([n, u], i) => ext(u, esc(i ? n : C.recapBy(n)))).join(', ')}</span></p>
  <ul class="call-points">${c.points.map((x) => `<li>${esc(L(x, lang))}</li>`).join('')}</ul>
  <p class="call-tags">${c.tags.map((t) => `<span>${esc(C.tags[t])}</span>`).join('')}</p></div>
</article>`;
  const body = `
<header class="hero hero-small"><h1>${esc(C.title)}</h1><p class="dek">${esc(C.dek)}</p><p class="gif-count">${esc(C.count(num(lang, CALLS.length), day(first), day(last)))}</p></header>
<aside class="call-now"><span class="dot-live" aria-hidden="true"></span><p>${esc(C.now)}</p></aside>
<section class="sec call-threads-sec" aria-labelledby="threads"><h2 id="threads">${esc(C.threads)}</h2><p class="sec-dek">${esc(C.threadsDek)}</p>
<div class="call-threads">${CALL_THREADS.map((t) => `<div class="thread thread-${t.id}"><h3>${esc(L(t.h, lang))}</h3><ol>${t.steps.map(([d, x], i) => `<li${i === t.steps.length - 1 ? ' class="now"' : ''}><a href="#c-${d}"><time datetime="${d}">${esc(fmtDate(lang, d, { day: 'numeric', month: 'short', year: 'numeric' }))}</time></a><span>${esc(L(x, lang))}</span></li>`).join('')}</ol></div>`).join('')}</div></section>
<div class="filters" role="group" aria-label="${esc(C.all)}"><button type="button" class="chip" aria-pressed="true" data-ct="">${esc(C.all)} <span>${num(lang, CALLS.length)}</span></button>${tags.map((t) => `<button type="button" class="chip" aria-pressed="false" data-ct="${t}">${esc(C.tags[t])} <span>${num(lang, CALLS.filter((c) => c.tags.includes(t)).length)}</span></button>`).join('')}</div>
<div class="calls">${years.map((y) => `<section class="call-year" aria-label="${y}"><h2 class="call-y">${y}</h2>${CALLS.filter((c) => c.date.startsWith(y)).map(call).join('')}</section>`).join('')}</div>
<section class="sec"><div class="learn-cta"><div><p>${esc(C.note)}</p></div><a class="btn" href="${href(lang, '/submit/')}">${esc(C.send)}</a></div></section>`;
  return { title: C.title, desc: C.dek, body };
}

// ---------- Run a gateway ----------
const codeBlock = (lang, src, label = '') => `<div class="code"${label ? ` aria-label="${esc(label)}"` : ''}><button type="button" class="copy" data-copied="${esc(UI(lang).gw.copied)}">${esc(UI(lang).gw.copy)}</button><pre tabindex="0"><code>${esc(src)}</code></pre></div>`;
export function gatewayPage(lang) {
  const T = UI(lang), G = UI(lang).gw, D = GATEWAY;
  const p = (x) => `<p>${esc(L(x, lang))}</p>`;
  const toc = [['what', G.what], ['paths', G.paths], ['before', G.before], ['steps', G.steps], ['clients', G.clients], ['fixes', G.fixes], ['windows', G.windows], ['news', G.news], ['links', G.links]];
  const body = `
<header class="hero hero-gw"><p class="pill"><span class="dot-live" aria-hidden="true"></span>${esc(L(D.facts[0][0], lang))}: ${esc(L(D.facts[0][1], lang))}</p><h1>${esc(G.title)}</h1><p class="dek">${esc(G.dek)}</p>
<p class="actions">${ext('https://console.getoptimum.xyz/', esc(G.start), 'btn')}<a class="btn btn-ghost" href="#steps">${esc(G.steps)}</a></p>
<dl class="gw-facts">${D.facts.map(([a, b]) => `<div><dt>${esc(L(b, lang))}</dt><dd>${esc(L(a, lang))}</dd></div>`).join('')}</dl></header>
<div class="learn">
  <nav class="toc" aria-label="${esc(T.sections)}"><ol>${toc.map(([id, h]) => `<li><a href="#${id}">${esc(h)}</a></li>`).join('')}</ol></nav>
  <div class="learn-main gw">
    <section class="lsec" id="what"><h2>${esc(G.what)}</h2><div class="prose">${D.what.map(p).join('')}</div><aside class="gw-note"><b>${esc(G.measured)}</b><span>${esc(L(D.measured, lang))} <a href="${href(lang, '/weekly/2026-09/')}">${esc(T.reg.cBack(fmtDate(lang, '2026-09-15', { month: 'long', year: 'numeric' })))}</a></span></aside></section>
    <section class="lsec" id="paths"><h2>${esc(G.paths)}</h2><div class="gw-paths">${D.paths.map((x) => `<article class="gw-path gw-${x.id}"><h3>${esc(L(x.h, lang))}</h3><p>${esc(L(x.p, lang))}</p><p class="gw-who"><b>${esc(G.who)}</b> ${esc(L(x.who, lang))}</p></article>`).join('')}</div></section>
    <section class="lsec" id="before"><h2>${esc(G.before)}</h2><ul class="gw-check">${D.before.map((x, i) => `<li><label><input type="checkbox" data-k="gw-${i}"><span>${esc(L(x, lang))}</span></label></li>`).join('')}</ul></section>
    <section class="lsec" id="steps"><h2>${esc(G.steps)}</h2><ol class="gw-steps">${D.steps.map((x) => `<li><h3>${esc(L(x.h, lang))}</h3><p>${esc(L(x.p, lang))}${x.link ? ` ${ext(x.link, esc(x.link.replace(/^https:\/\//, '').replace(/\/$/, '')))}` : ''}</p>${x.code ? codeBlock(lang, D.code[x.code]) : ''}${x.code === 'run' ? `<p class="gw-sub">${esc(G.streamAdd)}</p>${codeBlock(lang, D.code.stream)}` : ''}</li>`).join('')}</ol></section>
    <section class="lsec" id="clients"><h2>${esc(G.clients)}</h2><div class="gw-table"><table><thead><tr><th>${esc(G.client)}</th><th>${esc(G.flag)}</th><th>${esc(G.notes)}</th></tr></thead><tbody>${D.clients.map(([c, f, n]) => `<tr><td>${esc(c)}</td><td><code>${esc(f)}</code></td><td>${esc(L(n, lang))}</td></tr>`).join('')}</tbody></table></div><p class="gw-sub">${esc(L(D.clientNote, lang))}</p></section>
    <section class="lsec" id="fixes"><h2>${esc(G.fixes)}</h2><dl class="gw-fixes">${D.fixes.map(([a, b]) => `<div><dt>${esc(L(a, lang))}</dt><dd>${esc(L(b, lang))}</dd></div>`).join('')}</dl></section>
    <section class="lsec" id="windows"><h2>${esc(G.windows)}</h2><p class="gw-sub">${esc(G.windowsBy(D.windowsBy))}</p><ul class="gw-notes">${D.windows.map((x) => `<li>${esc(L(x, lang))}</li>`).join('')}</ul>${codeBlock(lang, D.watchdog)}</section>
    <section class="lsec" id="news"><h2>${esc(G.news)}</h2><ol class="timeline">${[...D.news].reverse().map(([d, t, u]) => `<li><b>${esc(fmtDate(lang, d, { day: 'numeric', month: 'short', year: 'numeric' }))}</b><span>${u.startsWith('/') ? `<a href="${href(lang, u)}">${esc(L(t, lang))}</a>` : ext(u, esc(L(t, lang)))}</span></li>`).join('')}</ol></section>
    <section class="lsec" id="links"><h2>${esc(G.links)}</h2><ul class="official">${D.links.map(([n, u]) => `<li>${ext(u, esc(n))}</li>`).join('')}</ul><p class="gw-sub">${esc(G.checked(fmtDate(lang, D.checked), D.release))}</p><p class="actions"><a class="btn btn-ghost" href="${href(lang, '/submit/')}">${esc(G.tell)}</a></p></section>
  </div>
</div>`;
  return { title: G.title, desc: G.dek, body, jsonld: { '@context': 'https://schema.org', '@type': 'HowTo', name: G.title, description: G.dek, inLanguage: lang, step: D.steps.map((x, i) => ({ '@type': 'HowToStep', position: i + 1, name: L(x.h, lang), text: L(x.p, lang) })) } };
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

// a founder: portrait, role, a short line, the path that led to Optimum and the recognition along the way, with sources
const honourList = (h) => `<ol class="honours" lang="en">${h.map(([y, n]) => `<li>${y ? `<span class="h-y">${esc(y)}</span>` : '<span class="h-y"></span>'}<span>${esc(n)}</span></li>`).join('')}</ol>`;
function founderBlock(lang, f, i) {
  const T = UI(lang);
  return `<article class="founder" id="f${i + 1}">
  <div class="f-photo"><img src="${esc(f.img)}" alt="${esc(f.name)}" width="400" height="400" loading="lazy"></div>
  <div class="f-text">
    <h3>${esc(f.name)}</h3><p class="role">${esc(L(f.role, lang))}</p><p class="f-bio">${esc(L(f.bio, lang))}</p>
    ${f.career?.length ? `<h4>${esc(T.careerH)}</h4><ol class="career">${f.career.map((c) => `<li>${c.y ? `<span class="c-y">${esc(c.y)}</span>` : '<span class="c-y c-dot" aria-hidden="true"></span>'}<span>${esc(L(c, lang))}</span></li>`).join('')}</ol>` : ''}
    ${f.honours?.length ? `<h4>${esc(T.honoursH)} <span class="h-n">${num(lang, f.honours.length)}</span></h4>${honourList(f.honours)}` : ''}
    <p class="plinks">${f.links.map(([n, u]) => ext(u, n)).join('')}</p>
    ${srcList(f.src || [])}
  </div>
</article>`;
}

// the founders on the front page: faces, roles and one line each, with the way to the full page
function teamTeaser(lang) {
  const T = UI(lang);
  const line = (f) => f.honours?.length ? `${f.honours[0][1]}, ${f.honours[0][0]}` : L(f.career?.[f.teaser || 0] || f.role, lang); // teaser: which career line the home page shows
  return `<ul class="team-teaser">${TEAM.founders.map((f, i) => `<li><a href="${href(lang, '/people/')}#f${i + 1}"><img src="${esc(f.img)}" alt="" width="120" height="120" loading="lazy"><span><b>${esc(f.name)}</b><small>${esc(L(f.role, lang))}</small><em${f.honours?.length ? ' lang="en"' : ''}>${esc(line(f))}</em></span></a></li>`).join('')}</ul>`;
}

export function peoplePage(lang, jobs) {
  const T = UI(lang);
  const body = `
<header class="hero hero-small"><h1>${T.peopleTitle}</h1><p class="dek">${T.peopleDek}</p></header>
${section('founders', T.founders, `<div class="founders">${TEAM.founders.map((f, i) => founderBlock(lang, f, i)).join('')}</div>`)}
${section('advisors', T.advisors, `<ul class="advisors adv-rich">${TEAM.advisors.map((a) => `<li><h3>${esc(a.name)}</h3><p>${esc(L(a.bio, lang))}</p>${a.honours ? honourList(a.honours) : ''}${a.src ? srcList(a.src) : ''}</li>`).join('')}</ul>`)}

${section('wider', T.wider, `<p class="sec-intro">${esc(T.widerIntro)}</p><ul class="advisors">${TEAM.wider.map((a) => `<li><h3>${a.x ? ext('https://x.com/' + a.x, esc(a.name)) : esc(a.name)}</h3><p>${esc(L(a.role, lang))}</p>${srcList([a.src])}</li>`).join('')}</ul>`)}
${jobs?.length ? section('jobs', T.jobs, linkList(lang, jobs)) : ''}
<p class="more">${ext(LINKS.careers, esc(T.careers))}</p>`;
  return { title: T.peopleTitle, desc: T.peopleDek, body };
}

export function buildersPage(lang, today, reg) {
  const T = UI(lang);
  const kinds = [...new Set(BUILDERS.map((b) => b.kind))];
  const body = `
<header class="hero hero-small"><h1>${esc(T.nav.builders)}</h1><p class="dek">${esc(T.buildersDek)}</p><p class="actions"><a class="btn" href="${href(lang, '/submit/')}">${T.yours}</a></p></header>
${featuredBuilder(lang, reg, today)}
<div class="filters" role="group" aria-label="${esc(T.filterLabel)}"><button type="button" class="chip" aria-pressed="true" data-f="">${T.filterAll}</button>${kinds.map((k) => `<button type="button" class="chip" aria-pressed="false" data-f="${k}">${esc(L(KINDS[k], lang))}</button>`).join('')}</div>
<ul class="b-grid b-grid-all">${rotate(BUILDERS, today).map((b) => builderCard(lang, b)).join('')}</ul>
${section('takepart', T.takePart, takePart(lang, TAKE_PART))}`;
  return { title: T.nav.builders, desc: T.buildersDek, body };
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

// ---------- the Optimum Register ----------
const roleKey = (r) => ({ 'Optimum Newbie': 'newbie', Observer: 'observer', Refined: 'refined', Optimized: 'optimized', Chronicler: 'chronicler', 'Lord of the Treasure': 'treasure' })[r] || 'refined';
const hue = (s) => { let h = 2166136261; for (const c of String(s)) h = Math.imul(h ^ c.codePointAt(0), 16777619); return h >>> 0; };
// a generated avatar: two hues from the name and its first letter, so every member has a face without any upload
export function avatar(who, size = 40) {
  const name = typeof who === 'string' ? who : who.name;
  if (who?.photo) return `<img class="av av-img" src="${esc(who.photo)}" alt="" width="${size}" height="${size}" loading="lazy" decoding="async" style="--s:${size}px">`;
  const h = hue(name), a = h % 360, b = (a + 40 + (h >> 9) % 80) % 360;
  const clean = String(name).normalize('NFKC').replace(/[^\p{L}\p{N}]/gu, '');
  // prefer a letter from a common script: decorative names often open with hieroglyphs or symbols few fonts carry
  const common = clean.match(/[\p{Script=Latin}\p{Script=Cyrillic}\p{Script=Greek}\p{Script=Han}\p{Script=Hangul}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Devanagari}\p{Script=Bengali}\p{Script=Arabic}\p{N}]/u);
  const letter = (common ? common[0] : [...clean][0] || '·').toUpperCase();
  return `<span class="av" style="--a:${a};--b:${b};--s:${size}px" aria-hidden="true">${esc(letter)}</span>`;
}
// a display name with break points after separators ("MITHUNOP//MUM" breaks after the slashes, not inside a word)
const nm = (name) => esc(name).replace(/([\/._|:]+)(?=[^\s])/g, '$1<wbr>');
const badge = (role) => `<span class="rb rb-${roleKey(role)}" lang="en">${esc(role)}</span>`;
const mHref = (lang, m) => href(lang, `/m/${m.slug}/`);
const cHref = (lang, id) => href(lang, `/class/${id}/`);

// the credential: the one thing every member wants to show
// Optimum's loop, cut from its wordmark, for the hologram seal on the card
const OPT_LOOP = OPTIMUM_WORDMARK.match(/<path d="([^"]+)"/)[1];

// a coded signature for every member: 24 pieces drawn from their name, like the coded pieces of one block.
// The same name always gives the same strip, so it works as a visual fingerprint on the card and its share image.
function signature(seed) {
  let h = hue(seed + ':sig'), out = '';
  for (let i = 0; i < 24; i++) {
    h = Math.imul(h ^ (h >>> 13), 2654435761) >>> 0;
    const v = h % 5, x = i * 5 + 0.5;
    out += v === 0 ? `<rect class="e" x="${x + 0.6}" y="4.6" width="2.8" height="2.8" rx=".6"/>` : v === 1 ? `<circle cx="${x + 2}" cy="6" r="1.1"/>` : v === 2 ? `<rect x="${x + 0.5}" y="4.5" width="3" height="3" rx=".7"/>` : v === 3 ? `<rect x="${x + 0.5}" y="1.5" width="3" height="9" rx=".8"/>` : `<rect x="${x + 0.5}" y="3" width="3" height="6" rx=".8"/>`;
  }
  return `<svg viewBox="0 0 120 12" aria-hidden="true">${out}</svg>`;
}

export function credential(lang, m, { big = false, tilt = 0, first = '' } = {}) {
  const T = UI(lang).reg;
  // a card with the owner's picture becomes an ID card: the portrait fills the right side
  return `<div class="cred cred-${roleKey(m.holder ? 'Lord of the Treasure' : m.role)}${big ? ' cred-big' : ''}${m.photo ? ' cred-photo' : ''}"${tilt ? ` style="--tilt:${tilt}deg"` : ''} data-card>
  <div class="cred-in">${m.photo ? `<div class="cred-pic"><img src="${esc(m.photo)}" alt="" loading="lazy" decoding="async"></div>` : ''}
    <div class="cred-top"><span class="cred-brand">${OPTIMUM_WORDMARK}<span class="cred-reg" lang="en">Register</span></span><span class="cred-no">${m.holder ? esc(T.holderTag) : esc(T.no(String(m.no).padStart(3, '0')))}</span></div>
    <div class="cred-mid">${m.photo ? '' : avatar(m, big ? 64 : 44)}<div><p class="cred-role"${first ? '' : ' lang="en"'}>${esc(first || m.role)}</p><p class="cred-name" title="${esc(m.name)}">${nm(m.name)}</p>${m.badges && !m.holder ? `<p class="cred-badges" lang="en">${m.badges.map((x) => `<span>${esc(x.name)}</span>`).join('')}</p>` : ''}</div></div>
    <div class="cred-bot"><span>${m.holder ? esc(T.holderLine) : esc(T.since(fmtDate(lang, m.since)))}</span><span class="cred-sig">${signature(m.slug || m.name)}<span class="cred-site">propagator.news</span></span></div>
  </div>${m.photo ? '' : '<i class="cred-seal" aria-hidden="true"><svg viewBox="0 7 37 21"><path d="' + OPT_LOOP + '"/></svg></i>'}<i class="cred-foil" aria-hidden="true"></i><i class="cred-glare" aria-hidden="true"></i>
</div>`;
}

const chip = (lang, m) => `<a class="mchip" href="${mHref(lang, m)}">${avatar(m, 28)}<span>${esc(m.name)}</span></a>`;
const memberOf = (reg, name) => reg.members.find((m) => m.names.includes(name));

function weeksChart(lang, reg) {
  const T = UI(lang).reg;
  const calls = [...reg.calls].reverse(), totals = calls.map((c) => c.groups.reduce((n, g) => n + g.names.length, 0));
  const step = Math.max(...totals) > 40 ? 20 : 10, top = Math.ceil(Math.max(...totals) / step) * step;
  const W = 1100, H = 240, L0 = 40, P = 14, B = 28, bw = (W - L0 - P) / calls.length, ph = H - B - P;
  const y = (v) => H - B - (v / top) * ph;
  const grid = Array.from({ length: top / step + 1 }, (_, k) => k * step).map((v) => `<line class="wg" x1="${L0}" x2="${W - P}" y1="${y(v).toFixed(1)}" y2="${y(v).toFixed(1)}"/><text class="wy" x="${L0 - 8}" y="${(y(v) + 4).toFixed(1)}">${num(lang, v)}</text>`).join('');
  let lastMonth = '';
  const order = { Refined: 0, Chronicler: 1, Optimized: 2 };
  const bars = calls.map((c, i) => {
    const total = totals[i], x = L0 + i * bw;
    let yy = H - B;
    const segs = [...c.groups].sort((a, b) => (order[a.role] ?? 0) - (order[b.role] ?? 0)).map((g) => { const h = (g.names.length / top) * ph; yy -= h; return `<rect class="wb wb-${roleKey(g.role)}" x="${(x + 2).toFixed(1)}" y="${yy.toFixed(1)}" width="${(bw - 4).toFixed(1)}" height="${h.toFixed(1)}" rx="2.5"/>`; }).join('');
    const m = c.date.slice(0, 7), tick = m !== lastMonth ? `<text class="wt" x="${(x + 2).toFixed(1)}" y="${H - 8}">${esc(fmtDate(lang, c.date, { month: 'short' }))}</text>` : '';
    lastMonth = m;
    const title = T.classOf(fmtDate(lang, c.date)), split = c.groups.map((g) => `${num(lang, g.names.length)} ${g.role}`).join(', ');
    return `<a href="${cHref(lang, c.id)}" class="wk" aria-label="${esc(title)}: ${esc(T.people(num(lang, total)))}, ${esc(split)}" data-t="${esc(title)}" data-n="${esc(T.people(num(lang, total)))}" data-r="${esc(split)}"><rect class="wh" x="${x.toFixed(1)}" y="${P}" width="${bw.toFixed(1)}" height="${(H - B - P).toFixed(1)}"/>${segs}</a>${tick}`;
  }).join('');
  const roles = ['Refined', 'Optimized', 'Chronicler'];
  return `<div class="weeks"><ul class="wk-legend" aria-label="${esc(T.legend)}">${roles.map((r) => `<li><i class="wl wl-${roleKey(r)}" aria-hidden="true"></i><span lang="en">${esc(r)}</span></li>`).join('')}<li class="wk-axis">${esc(T.axis)}</li></ul><div class="weeks-scroll"><svg viewBox="0 0 ${W} ${H}" class="weeks-svg">${grid}${bars}</svg></div><div class="wk-tip" role="status" aria-live="polite" hidden></div></div>`;
}

// the builder of the week, large: the project and the person behind it, linked to their page in the register
function featuredBuilder(lang, reg, today) {
  const T = UI(lang);
  const F = featuredFor(today, BUILDERS); if (!F) return '';
  const b = BUILDERS.find((x) => x.id === F.id); if (!b) return '';
  const m = b.member === false ? null : reg?.bySlug.get(b.member || slugOfName(b.by));
  return `<article class="feat">
  <a class="feat-img" href="${esc(b.url)}" rel="noopener" target="_blank"><img src="/assets/shots/${esc(b.id)}.webp" alt="${esc(b.name)}" width="1200" height="750" loading="lazy"></a>
  <div class="feat-text">
    <p class="feat-kicker"><span class="dot-live" aria-hidden="true"></span>${esc(T.pick)}</p>
    <h3>${esc(b.name)}</h3>
    <p class="feat-by">${m ? `<a class="mchip" href="${mHref(lang, m)}">${avatar(m, 28)}<span>${esc(b.by)}</span></a>${badge(m.role)}` : esc(b.by)}${b.handle ? ext('https://x.com/' + b.handle, '@' + esc(b.handle), 'feat-x') : ''}</p>
    <p>${esc(L(b.what, lang))}</p>
    ${F.why ? `<p class="feat-why">${esc(L(F.why, lang))}</p>` : ''}
    <p class="actions">${ext(b.url, esc(T.visit), 'btn')}${b.post ? ext(b.post, esc(T.readThread), 'btn btn-ghost') : ''}</p>
  </div>
</article>`;
}

export function registerHome(lang, reg, { weekly, today }) {
  const T = UI(lang), R = T.reg;
  const latest = reg.calls[0];
  const latestPeople = latest.groups.flatMap((g) => g.names.map((n) => memberOf(reg, n))).filter(Boolean);
  // the hero shows the first person ever named to each role
  const fan = [['Chronicler', R.firstChron], ['Optimized', R.firstOpt], ['Refined', R.firstRef]].map(([r, label]) => { const m = reg.firsts[r] && reg.bySlug.get(reg.firsts[r].slug); return m && { m: { ...m, role: r, photo: null }, label }; }).filter(Boolean);
  const hall = (role, first) => `<div class="hall-col"><h3>${badge(role)} <span class="hall-n">${num(lang, reg.byRole[role])}</span></h3><ol class="hall-list">${reg.members.filter((m) => m.role === role).sort((a, b) => (a.since < b.since ? -1 : 1)).map((m) => `<li><a href="${mHref(lang, m)}">${avatar(m, 36)}<span><b title="${esc(m.name)}">${esc(m.name)}</b><small>${esc(R.since(fmtDate(lang, m.since)))}</small></span>${reg.firsts[role]?.slug === m.slug ? `<em class="first">${esc(first)}</em>` : ''}</a></li>`).join('')}</ol></div>`;
  const wHref = weekly ? href(lang, '/weekly/' + weekly.id + '/') : href(lang, '/archive/');
  const stat = (n, label, hint) => `<div><dt>${esc(label)}</dt><dd data-count="${n}">${num(lang, n)}</dd><dd class="rs-hint">${esc(hint)}</dd></div>`;
  const body = `
<section class="rhero">
  <div class="rhero-text">
    <p class="pill"><span class="dot-live" aria-hidden="true"></span>${esc(R.name)}</p>
    <h1>${esc(R.title)}</h1>
    <p class="dek">${esc(R.dek)}</p>
    <form class="rsearch" action="${href(lang, '/members/')}" method="get" role="search"><label class="vh" for="q">${esc(R.find)}</label><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="9" cy="9" r="6"/><path d="M13.5 13.5 18 18"/></svg><input id="q" name="q" type="search" placeholder="${esc(R.searchPh(num(lang, reg.stats.members)))}" autocomplete="off" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="q-list"><button class="btn" type="submit">${esc(R.find)}</button><ul class="q-list" id="q-list" role="listbox" hidden data-base="${href(lang, '/m/')}" data-more="${esc(R.seeAll('{0}'))}" data-none="${esc(R.noMatch)}"></ul></form>
    <p class="rhero-alt"><a class="btn btn-ghost" href="${wHref}">${esc(R.readLatest)}</a></p>
    <dl class="rstats">${stat(reg.stats.members, R.statMembers, R.statMembersHint)}${stat(reg.stats.upgrades, R.statUpgrades, R.statUpgradesHint)}${stat(reg.stats.calls, R.statCalls, R.statCallsHint)}</dl>
    <p class="rs-more"><a href="${href(lang, '/stats/')}">${esc(R.allNumbers)}</a></p>
  </div>
  <div class="stage"><canvas class="field" aria-hidden="true"></canvas><div class="fan" aria-hidden="true">${fan.map((f, i) => credential(lang, f.m, { tilt: [-7, 3, -2][i], first: f.label })).join('')}</div><p class="stage-cap">${esc(R.stageHint)}</p></div>
</section>
${section('week', R.thisWeek, `<div class="week">${latestCall(lang, reg, latest, latestPeople)}${weekly ? issueCard(lang, weekly) : ''}</div>`, `<a class="sec-link" href="${href(lang, '/classes/')}">${esc(T.nav.classes)}</a>`)}
${section('makers', T.builders, `${featuredBuilder(lang, reg, today)}<ul class="b-grid b-grid-4">${rotate(BUILDERS.filter((b) => b.id !== featuredFor(today, BUILDERS)?.id), today).slice(0, 4).map((b) => builderCard(lang, b)).join('')}</ul>`, `<a class="sec-link" href="${href(lang, '/builders/')}">${T.buildersAll}</a>`)}
${section('team', T.peopleTitle, `<p class="sec-intro">${esc(T.teamDek)}</p>${teamTeaser(lang)}`, `<a class="sec-link" href="${href(lang, '/people/')}">${esc(T.meetTeam)}</a>`)}
${section('hall', R.hall, `<p class="sec-intro">${esc(R.hallDek)}</p><div class="hall">${hall('Optimized', R.firstOpt)}${hall('Chronicler', R.firstChron)}</div>`)}
${section('weeks', R.weeksTitle(fmtDate(lang, reg.stats.since)), `<p class="sec-intro">${esc(R.weeksDek)}</p>${weeksChart(lang, reg)}`, `<a class="sec-link" href="${href(lang, '/stats/')}">${esc(R.st.title)}</a>`)}
${subscribeBox(lang)}`;
  return { title: '', desc: R.dek, body };
}

// the latest role call: the count beside the week's names, as small metal cards in a row that scrolls on narrow screens
function latestCall(lang, reg, c, people) {
  const R = UI(lang).reg;
  return `<div class="latest">
  <div class="lt-side">
    <p class="lt-date">${esc(fmtDate(lang, c.date))}</p>
    <ul class="lt-counts">${c.groups.map((g) => `<li class="lt-${roleKey(g.role)}"><b>${num(lang, g.names.length)}</b><span>${esc(R.named(g.role))}</span></li>`).join('')}</ul>
    <p class="lt-by">${esc(R.announced(c.by))}</p>
    <p><a class="btn btn-ghost" href="${cHref(lang, c.id)}">${esc(R.seeClass)}</a></p>
  </div>
  <div class="car" data-car>
    <div class="car-bar"><p class="car-label" id="car-l">${esc(R.explore(num(lang, people.length)))}</p><div class="car-btns"><button type="button" class="car-btn" data-dir="-1" aria-label="${esc(R.carPrev)}" aria-controls="car-list"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M12.5 4.5 7 10l5.5 5.5"/></svg></button><button type="button" class="car-btn" data-dir="1" aria-label="${esc(R.carNext)}" aria-controls="car-list"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M7.5 4.5 13 10l-5.5 5.5"/></svg></button></div></div>
    <ol class="lt-grid" id="car-list" tabindex="0" aria-labelledby="car-l">${people.map((m) => `<li><a class="lt-card lt-${roleKey(m.role)}" href="${mHref(lang, m)}"><span class="lt-top">${avatar(m, 34)}<span class="lt-no">${esc(R.no(String(m.no).padStart(3, '0')))}</span></span><span class="lt-name" title="${esc(m.name)}">${nm(m.name)}</span><span class="lt-role" lang="en">${esc(m.role)}</span></a></li>`).join('')}</ol>
    <div class="car-track" aria-hidden="true"><span class="car-thumb"></span></div>
  </div>
</div>`;
}

// the latest weekly issue, as an editorial card: cover, date, title, summary, and the way in
function issueCard(lang, w) {
  const T = UI(lang), u = href(lang, '/weekly/' + w.id + '/');
  const cover = w.og ? `<img src="/og/weekly-${esc(w.id)}-${lang}.png" alt="" width="1200" height="630" loading="lazy">` : `<span class="ic-plain" aria-hidden="true">${esc(no(lang, w.id))}</span>`;
  return `<article class="icard"><a class="ic-cover" href="${u}" tabindex="-1" aria-hidden="true">${cover}</a><div class="ic-text"><p class="ic-meta"><span>${T.issue(no(lang, w.id))}</span><time datetime="${esc(w.date)}">${esc(fmtDate(lang, w.date))}</time></p><h3><a href="${u}">${esc(L(w.title, lang))}</a></h3><p class="ic-dek">${esc(L(w.dek, lang))}</p><p><a class="btn" href="${u}">${T.readIssue(no(lang, w.id))}</a></p></div></article>`;
}

// Discord roles beyond the ladder (BADGES), on the Members page: holders with a card first, then everyone else
function badgeSections(lang, reg) {
  const T = UI(lang);
  return BADGES.map((bd) => {
  // the role's holders: members with a register card first, as cards; everyone else as a plain roll, since only
  // people named in a role call have a page here
  const base = (n) => n.replace(/\*$/, '').replace(/^@+/, '');
  const find = (n) => reg?.members.find((x) => x.badges?.includes(bd) && x.names.some((y) => keyOf(y) === keyOf(base(n)) || (n.endsWith('*') && keyOf(y).startsWith(keyOf(base(n))))));
  const rows = bd.names.map((n) => ({ name: base(n), m: find(n) || reg?.holders?.find((h) => h.badges.includes(bd) && keyOf(h.name) === keyOf(base(n))) }));
  const named = rows.filter((r) => r.m && !r.m.holder).sort((a, b) => a.m.no - b.m.no);
  const held = rows.filter((r) => r.m && r.m.holder).sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }));
  const card = ({ m }) => `<li><a href="${mHref(lang, m)}">${avatar(m, 40)}<span class="lc-text"><b>${nm(m.name)}</b><span>${m.holder ? `<i>${esc(T.reg.holderTag)}</i>` : `${badge(m.role)}<i>${esc(T.reg.no(String(m.no).padStart(3, '0')))}</i>`}</span></span></a></li>`;
  return section('badge-' + bd.id, bd.name, `<p class="sec-intro">${esc(T.badgeIntro(L(bd.what, lang), num(lang, bd.names.length)))}</p>
<div class="lords">
  <h3 class="lords-h">${esc(T.badgeCarded(num(lang, named.length)))}</h3>
  <ul class="lord-cards">${named.map(card).join('')}</ul>
  <h3 class="lords-h">${esc(T.badgeRest(num(lang, held.length)))}</h3>
  <p class="lords-note">${esc(T.badgeRestNote)}</p>
  <ul class="lord-cards lord-held">${held.map(card).join('')}</ul>
</div>`);
}).join('');
}

export function membersPage(lang, reg) {
  const T = UI(lang), R = T.reg;
  const roles = ['Chronicler', 'Optimized', 'Refined'].filter((r) => reg.byRole[r]);
  // newest first is the server order; data-o (register number) and data-a (folded name) let the page re-sort without a reload
  const body = `<header class="hero hero-small"><h1>${esc(T.nav.members)}</h1><p class="dek">${esc(R.membersDek)}</p></header>
<div class="dir-tools"><div class="rsearch rsearch-sm"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="9" cy="9" r="6"/><path d="M13.5 13.5 18 18"/></svg><label class="vh" for="dq">${esc(R.find)}</label><input id="dq" type="search" placeholder="${esc(R.searchPh(num(lang, reg.stats.members)))}" autocomplete="off" data-dir-q></div>
<div class="filters" role="group" aria-label="${esc(T.filterLabel)}"><button type="button" class="chip" aria-pressed="true" data-role="">${esc(T.filterAll)} <span>${num(lang, reg.stats.members)}</span></button>${roles.map((r) => `<button type="button" class="chip" aria-pressed="false" data-role="${roleKey(r)}" lang="en">${esc(r)} <span>${num(lang, reg.byRole[r])}</span></button>`).join('')}${BADGES.map((bd) => { const n = reg.members.filter((m) => m.badges?.includes(bd)).length; return n ? `<button type="button" class="chip chip-badge" aria-pressed="false" data-role="${bd.id}" lang="en">${esc(bd.name)} <span>${num(lang, n)}</span></button>` : ''; }).join('')}</div>
<label class="dir-sort"><span>${esc(R.sort)}</span><select data-dir-sort><option value="new">${esc(R.sortNew)}</option><option value="old">${esc(R.sortOld)}</option><option value="az">${esc(R.sortAz)}</option></select></label></div>
<p class="dir-status" role="status" aria-live="polite" data-showing="${esc(R.showing('{n}', '{t}'))}" data-for="${esc(R.forQuery('{q}'))}" data-total="${reg.stats.members}" data-lang="${locale(lang)}"><b>${num(lang, reg.stats.members)}</b> ${esc(T.nav.members)}</p>
<div class="dir-empty" hidden><p>${esc(R.noMatch)}</p><p><button type="button" class="btn btn-ghost btn-sm" data-dir-clear>${esc(R.clear)}</button></p></div>
<ol class="dir">${reg.members.map((m) => `<li data-role="${roleKey(m.role)}"${m.badges ? ` data-b="${m.badges.map((x) => x.id).join(' ')}"` : ''} data-o="${m.no}" data-s="${esc(m.since)}" data-a="${esc(m.name.normalize('NFKC').toLowerCase())}" data-n="${esc(m.names.join(' ').normalize('NFKC').toLowerCase())}"><a href="${mHref(lang, m)}">${avatar(m, 40)}<span class="dir-name" title="${esc(m.name)}">${esc(m.name)}${m.claimed ? `<svg class="linked" viewBox="0 0 16 16" role="img" aria-label="${esc(R.linked)}"><title>${esc(R.linked)}</title><path d="M8 1.5 9.8 3l2.3-.2.6 2.2 2 1.2-.9 2.1.9 2.1-2 1.2-.6 2.2-2.3-.2L8 14.5 6.2 13l-2.3.2-.6-2.2-2-1.2.9-2.1-.9-2.1 2-1.2.6-2.2 2.3.2z"/><path class="tick" d="m5.3 8.2 1.8 1.8 3.6-3.8"/></svg>` : ''}</span>${badge(m.role)}<span class="dir-since">${esc(fmtDate(lang, m.since, { day: 'numeric', month: 'short', year: 'numeric' }))}</span></a></li>`).join('')}</ol>
<p class="reg-note">${esc(R.note)}</p>
${badgeSections(lang, reg)}`;
  return { title: T.nav.members, desc: R.membersDek, body };
}

export function memberPage(lang, reg, m, { discord = false, issues = [], today = new Date().toISOString().slice(0, 10) } = {}) {
  const T = UI(lang), R = T.reg;
  const url = SITE + mHref(lang, m);
  const classmates = m.holder ? [] : reg.calls.filter((c) => c.id === m.events[m.events.length - 1].call).flatMap((c) => c.groups.flatMap((g) => g.names)).map((n) => memberOf(reg, n)).filter((x) => x && x.slug !== m.slug).slice(0, 18);
  const projects = BUILDERS.filter((b) => b.member !== false && (b.member || slugOfName(b.by)) === m.slug);
  // what this member did beyond the role: projects, weeks their project was featured, issues that covered their work
  const mine = new Set(projects.map((b) => b.id));
  const contrib = [
    ...projects.map((b) => ({ d: b.added || '', html: `${esc(R.cBuilt('{0}')).replace('{0}', `<a href="${esc(b.url)}" rel="noopener" target="_blank">${esc(b.name)}</a>`)}` })),
    ...FEATURED.filter((f) => mine.has(f.id) && f.from <= today).map((f) => ({ d: f.from, html: `${esc(R.cWeek(BUILDERS.find((b) => b.id === f.id).name, fmtDate(lang, f.from)))}` })),
    ...issues.filter((w) => (w.builders || []).some((id) => mine.has(id)) || (w.spotlight && slugOfName(w.spotlight.by || '') === m.slug)).map((w) => ({ d: w.date, html: `<a href="${href(lang, '/weekly/' + w.id + '/')}">${esc(w.back ? R.cBack(fmtDate(lang, w.id + '-15', { month: 'long', year: 'numeric' })) : R.cIssue(no(lang, w.id)))}</a>` })),
  ].sort((a, b) => (a.d < b.d ? 1 : -1));
  const shareText = m.holder ? R.shareHolder(m.name, m.role) : R.shareText(m.name, m.role, fmtDate(lang, m.since));
  const C = R.claim, start = `/api/discord/start?m=${encodeURIComponent(m.slug)}&amp;lang=${lang}`;
  const nf = 'rel="nofollow"';
  const claim = discord ? `<section class="own" aria-labelledby="own-h"><h2 class="h-small" id="own-h">${esc(C.customize)}</h2>${m.claimed
    ? `<p class="own-line">${esc(C.claimed)}</p><p class="own-actions"><a class="btn btn-sm" href="${start}&amp;upload=1" ${nf}>${esc(C.again)}</a><a class="btn btn-ghost btn-sm" href="${start}" ${nf}>${esc(C.useDiscord)}</a></p><p class="own-remove"><a href="${start}&amp;remove=1" ${nf}>${esc(C.remove)}</a></p>`
    : `<p class="own-hint">${esc(C.hint)}</p><p class="own-actions"><a class="btn btn-sm" href="${start}&amp;upload=1" ${nf}>${esc(C.upload)}</a><a class="btn btn-ghost btn-sm" href="${start}" ${nf}>${esc(C.btn)}</a></p>`}
    <form class="own-pick" hidden action="/api/own/photo" method="post" enctype="multipart/form-data">
      <p class="own-file"><label class="btn btn-ghost btn-sm"><input id="own-file" class="vh" type="file" name="photo" accept="image/jpeg,image/png,image/webp">${esc(C.choose)}</label><span class="own-hint">${esc(C.pick)}</span></p>
      <div class="crop" hidden><div class="crop-frame" tabindex="0" role="img" aria-label="${esc(C.cropHint)}"><canvas width="360" height="480"></canvas></div>
        <div class="crop-side"><p class="own-hint">${esc(C.cropHint)}</p><label class="crop-zoom"><span>${esc(C.zoom)}</span><input type="range" min="1" max="3" step="0.01" value="1"></label>
        <p class="own-actions"><button class="btn btn-sm" type="submit" data-saving="${esc(C.saving)}">${esc(C.save)}</button><button class="btn btn-ghost btn-sm" type="button" data-crop-cancel>${esc(C.cancel)}</button></p></div></div>
    </form>
    <p class="own-msg" role="status" hidden${['ok', 'nophoto', 'removed', 'nomatch', 'notmember', 'taken', 'other', 'denied', 'error', 'upload', 'uploaded', 'badfile', 'expired'].map((k) => ` data-${k}="${esc(k === 'upload' ? C.uploadMsg : C[k])}"`).join('')}></p></section>` : '';
  const og = m.og || `/og/m-${m.slug}.jpg`;
  const body = `
<section class="mhero">
  <div class="mhero-card">${credential(lang, m, { big: true })}</div>
  <div class="mhero-text">
    <p class="pill">${m.holder ? esc(R.holderTag) : esc(R.no(String(m.no).padStart(3, '0')))}</p>
    <h1>${esc(m.name)}</h1>
    <p class="mrole">${badge(m.role)} <span>${m.holder ? esc(R.holderLine) : esc(R.since(fmtDate(lang, m.since)))}</span></p>
    ${m.badges && !m.holder ? `<ul class="mbadges">${m.badges.map((x) => `<li><a href="${href(lang, '/members/')}#badge-${x.id}"><b lang="en">${esc(x.name)}</b><span>${esc(L(x.what, lang))}</span></a></li>`).join('')}</ul>` : ''}
    <p class="actions"><a class="btn" href="https://x.com/intent/post?text=${encodeURIComponent(shareText)}&amp;url=${encodeURIComponent(url)}" rel="noopener" target="_blank">${esc(R.share)}</a><a class="btn btn-ghost" href="${esc(og)}" download="optimum-register-${esc(m.slug)}.jpg">${esc(R.download)}</a></p>
    ${contrib.length ? `<h2 class="h-small">${esc(R.contrib)}</h2><ul class="contrib">${contrib.map((c) => `<li>${c.html}</li>`).join('')}</ul>` : ''}
    <h2 class="h-small">${esc(R.timeline)}</h2>
    ${m.holder ? `<p class="holder-note">${esc(R.holderNote(fmtDate(lang, m.since)))}</p>` : ''}<ol class="tl">${m.holder ? m.badges.map((b) => `<li><span class="tl-dot tl-treasure" aria-hidden="true"></span><div><p><b>${esc(R.holds(b.name))}</b></p><p class="tl-meta"><a href="${href(lang, '/members/')}#badge-${b.id}">${esc(L(b.what, lang))}</a></p></div></li>`).join('') : ''}${[...m.events].reverse().map((e) => { const c = reg.calls.find((x) => x.id === e.call); return `<li><span class="tl-dot tl-${roleKey(e.role)}" aria-hidden="true"></span><div><p><b>${esc(R.named(e.role))}</b></p><p class="tl-meta"><a href="${cHref(lang, e.call)}">${esc(R.classOf(fmtDate(lang, e.date)))}</a><span>${esc(R.announced(c?.by || 'Flash'))}</span></p></div></li>`; }).join('')}</ol>
    ${claim}
  </div>
</section>
${projects.length ? section('projects', R.projects, `<ul class="b-grid">${projects.map((b) => builderCard(lang, b)).join('')}</ul>`) : ''}
${classmates.length ? section('classmates', R.classmates, `<div class="chips">${classmates.map((x) => chip(lang, x)).join('')}</div>`) : ''}
<p class="reg-note">${esc(R.note)} <a href="${href(lang, '/submit/')}">${esc(R.correction)}</a></p>`;
  return { title: `${m.name}: ${m.role}`, desc: shareText, body, og: SITE + og };
}

export function classPage(lang, reg, id) {
  const T = UI(lang), R = T.reg;
  const i = reg.calls.findIndex((c) => c.id === id); const c = reg.calls[i];
  const newer = reg.calls[i - 1], older = reg.calls[i + 1];
  const total = c.groups.reduce((n, g) => n + g.names.length, 0);
  const img = (SEED.classCards || []).includes(c.id) ? `/og/class-${c.id}.jpg` : '';
  const body = `<header class="hero hero-small"><p class="masthead"><a href="${href(lang, '/classes/')}">${esc(T.nav.classes)}</a><span>${esc(R.announced(c.by))}</span></p><h1>${esc(R.classOf(fmtDate(lang, c.date)))}</h1><p class="dek">${esc(R.people(num(lang, total)))}</p>${img ? `<p class="actions"><a class="btn btn-ghost" href="${img}" download="optimum-role-call-${esc(c.id)}.jpg">${esc(R.dlImage)}</a></p>` : ''}</header>
${i === 0 ? `<p class="nudge">${esc(R.nudge)}</p>` : ''}
${c.groups.map((g) => `<section class="sec cgroup"><div class="sec-head"><h2>${badge(g.role)} <span class="cg-n">${num(lang, g.names.length)}</span></h2></div><div class="ccards">${g.names.map((n) => memberOf(reg, n)).filter(Boolean).map((m) => `<a class="lt-card lt-${roleKey(g.role)}" href="${mHref(lang, m)}"><span class="lt-top">${avatar(m, 34)}<span class="lt-no">${esc(R.no(String(m.no).padStart(3, '0')))}</span></span><span class="lt-name" title="${esc(m.name)}">${nm(m.name)}</span><span class="lt-role" lang="en">${esc(g.role)}</span></a>`).join('')}</div></section>`).join('')}
${c.note ? `<p class="sec-intro">${esc(L(c.note, lang))}</p>` : ''}
${srcList([c.src])}
<nav class="pager">${older ? `<a href="${cHref(lang, older.id)}">${esc(R.prev)}: ${esc(fmtDate(lang, older.date))}</a>` : '<span></span>'}${newer ? `<a href="${cHref(lang, newer.id)}">${esc(R.next)}: ${esc(fmtDate(lang, newer.date))}</a>` : ''}</nav>`;
  return { title: R.classOf(fmtDate(lang, c.date)), desc: R.people(String(total)), body, ...(img ? { og: SITE + img } : {}) };
}

export function classesPage(lang, reg) {
  const T = UI(lang), R = T.reg;
  const body = `<header class="hero hero-small"><h1>${esc(T.nav.classes)}</h1><p class="dek">${esc(R.classesDek)}</p></header>
${weeksChart(lang, reg)}
<ol class="clist">${reg.calls.map((c) => { const total = c.groups.reduce((n, g) => n + g.names.length, 0); return `<li><a href="${cHref(lang, c.id)}"><span class="cl-date">${esc(fmtDate(lang, c.date))}</span><span class="cl-roles">${c.groups.map((g) => badge(g.role) + ` <small>${num(lang, g.names.length)}</small>`).join(' ')}</span><span class="cl-n">${esc(R.people(num(lang, total)))}</span></a></li>`; }).join('')}</ol>`;
  return { title: T.nav.classes, desc: R.classesDek, body };
}

// the register in numbers: growth, how long the climb takes, the biggest weeks and the longest serving members
export function statsPage(lang, reg, { claims = 0 } = {}) {
  const T = UI(lang), R = T.reg, S = R.st;
  const calls = [...reg.calls].reverse();
  const DAY = 864e5, ms = (d) => Date.parse(d + 'T12:00:00Z');
  // members per week, cumulative, by first appearance
  let run = 0; const firstBy = {};
  for (const m of reg.members) firstBy[m.first] = (firstBy[m.first] || 0) + 1;
  const pts = calls.map((c) => ({ d: c.date, v: (run += firstBy[c.date] || 0) }));
  const W = 1100, H = 260, L0 = 48, P = 16, B = 28, top = Math.ceil(run / 100) * 100;
  const x = (i) => L0 + (i / Math.max(1, pts.length - 1)) * (W - L0 - P), y = (v) => H - B - (v / top) * (H - B - P);
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(p.v).toFixed(1)}`).join('');
  const grid = Array.from({ length: top / 100 + 1 }, (_, k) => k * 100).filter((v, k, a) => a.length < 8 || k % 2 === 0).map((v) => `<line class="wg" x1="${L0}" x2="${W - P}" y1="${y(v).toFixed(1)}" y2="${y(v).toFixed(1)}"/><text class="wy" x="${L0 - 8}" y="${(y(v) + 4).toFixed(1)}">${num(lang, v)}</text>`).join('');
  let lastM = ''; const ticks = pts.map((p, i) => { const mo = p.d.slice(0, 7); if (mo === lastM) return ''; lastM = mo; return `<text class="wt" x="${x(i).toFixed(1)}" y="${H - 8}">${esc(fmtDate(lang, p.d, { month: 'short' }))}</text>`; }).join('');
  const growth = `<div class="weeks stat-chart"><div class="weeks-scroll"><svg viewBox="0 0 ${W} ${H}" class="weeks-svg" role="img" aria-label="${esc(S.growthAria(num(lang, run), fmtDate(lang, calls[0].date)))}">${grid}<path class="sg-area" d="${line}L${x(pts.length - 1).toFixed(1)},${H - B}L${L0},${H - B}Z"/><path class="sg-line" d="${line}"/>${ticks}</svg></div></div>`;
  // the climb: days from first being named to Optimized or Chronicler
  const climbs = reg.members.filter((m) => m.role === 'Optimized' || m.role === 'Chronicler').map((m) => ({ m, days: Math.round((ms(m.since) - ms(m.first)) / DAY) })).sort((a, b) => a.days - b.days);
  const median = climbs.length ? climbs[Math.floor((climbs.length - 1) / 2)].days : 0;
  const biggest = [...reg.calls].map((c) => ({ c, n: c.groups.reduce((k, g) => k + g.names.length, 0) })).sort((a, b) => b.n - a.n || (a.c.date < b.c.date ? 1 : -1)).slice(0, 5);
  const longest = reg.members.filter((m) => m.role === 'Refined').sort((a, b) => (a.since < b.since ? -1 : a.since > b.since ? 1 : a.no - b.no)).slice(0, 10);
  const by = {}; for (const c of reg.calls) by[c.by] = (by[c.by] || 0) + 1;
  const tile = (n, label) => `<div><dt>${esc(label)}</dt><dd>${n}</dd></div>`;
  const person = (m, extra) => `<li><a href="${mHref(lang, m)}">${avatar(m, 32)}<span><b title="${esc(m.name)}">${esc(m.name)}</b><small>${extra}</small></span>${badge(m.role)}</a></li>`;
  const body = `<header class="hero hero-small"><h1>${esc(S.title)}</h1><p class="dek">${esc(S.dek)}</p></header>
<dl class="stat-tiles">${tile(num(lang, reg.stats.members), R.statMembers)}${tile(num(lang, reg.stats.upgrades), R.statUpgrades)}${tile(num(lang, reg.stats.calls), R.statCalls)}${tile(num(lang, reg.byRole.Optimized || 0), 'Optimized')}${tile(num(lang, reg.byRole.Chronicler || 0), 'Chronicler')}${tile(num(lang, claims), S.linked)}</dl>
${section('growth', S.growth, `<p class="sec-intro">${esc(S.growthDek)}</p>${growth}`)}
${section('climb', S.climb, `<p class="sec-intro">${esc(S.climbDek(num(lang, median)))}</p><ol class="hall-list stat-list">${climbs.map(({ m, days }) => person(m, esc(days ? S.days(num(lang, days)) : S.direct))).join('')}</ol>`)}
<div class="stat-two">
${section('biggest', S.biggest, `<ol class="stat-rank">${biggest.map(({ c, n }) => `<li><a href="${cHref(lang, c.id)}"><span>${esc(fmtDate(lang, c.date))}</span><b>${esc(R.people(num(lang, n)))}</b></a></li>`).join('')}</ol>`)}
${section('by', S.by, `<ol class="stat-rank">${Object.entries(by).sort((a, b) => b[1] - a[1]).map(([k, v]) => `<li><span>${esc(k)}</span><b>${esc(S.calls(num(lang, v)))}</b></li>`).join('')}</ol>`)}
</div>
${section('longest', S.longest, `<p class="sec-intro">${esc(S.longestDek)}</p><ol class="hall-list stat-list">${longest.map((m) => person(m, esc(R.since(fmtDate(lang, m.since))))).join('')}</ol>`)}
<p class="reg-note">${esc(S.note)}</p>`;
  return { title: S.title, desc: S.dek, body };
}
