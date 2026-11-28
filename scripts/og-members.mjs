// Share images for the Optimum Register: one card per member, drawn with the site's own credential and stylesheet.
//   node scripts/og-members.mjs [outDir] [slug ...]
// Without slugs it renders every member into public/og/m-<slug>.jpg. Run `npm run build` first (it needs dist/assets).
// For members added later through the admin API, the weekly task renders their cards and uploads them with
// PUT /api/admin/og/m-<slug>.jpg.
//   node scripts/og-members.mjs --claimed [outDir]
// draws the cards whose owners added their Discord picture (read from the live site) as m-<slug>-p<version>.jpg;
// with EDITOR_TOKEN set it uploads each one, and the member page switches its share image to it.
import { readFile, readdir, writeFile, mkdir, rm } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { register } from '../lib/register.mjs';
import { OG_FONTS, ogMember } from '../lib/ogtext.mjs';
import { credential, OPTIMUM_WORDMARK } from '../lib/render.mjs';
import { UI } from '../lib/t.mjs';
const { chromium } = createRequire(import.meta.url)('playwright');

const ROOT = new URL('../', import.meta.url).pathname;
const argv = process.argv.slice(2), claimed = argv[0] === '--claimed';
const [outDir = 'public/og', ...only] = claimed ? argv.slice(1) : argv;
const LIVE = 'https://propagator.news';
const css = (await readdir(ROOT + 'dist/assets')).find((f) => /^site-\w+\.css$/.test(f));
const style = (await readFile(ROOT + 'dist/assets/' + css, 'utf8')).replaceAll('url(/assets/fonts/', 'url(file://' + ROOT + 'public/assets/fonts/');
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const R = UI('en').reg;

const page = (m, reg) => `<!doctype html><html lang="en"><head><meta charset="utf-8"><style>${style}${OG_FONTS}
body{margin:0;width:1200px;height:630px;overflow:hidden;background:radial-gradient(900px 520px at 30% 50%,rgba(184,124,255,.20),transparent 65%),#0a0b0e;display:grid;grid-template-columns:600px 1fr;align-items:center;font-family:var(--sans);color:#eef0f4}
.card{display:grid;place-items:center}.card .cred{width:500px}.card .cred-name{font-size:30px;max-width:330px}.card .cred-in{padding:24px 26px}
.side{padding-right:64px}.side h1{font-size:${m.name.length > 16 ? 50 : 62}px;line-height:1.04;letter-spacing:-.035em;margin:18px 0 14px;overflow-wrap:anywhere}
.side p{margin:0;font-size:24px;color:#a8afba}.side .rb{font-size:18px;padding:6px 14px}.brand{display:flex;align-items:center;gap:12px;font:650 24px Geist;letter-spacing:-.01em;color:#eef0f4}.brand .opt-wm{height:24px;width:auto;color:#eef0f4}.brand span{padding-left:12px;border-left:2px solid rgba(238,240,244,.35)}
.purl{margin-top:30px !important;font:500 20px 'Geist Mono',monospace;color:#808894}</style></head><body>
<div class="card">${credential('en', ogMember(m), { big: true })}</div>
<div class="side"><div class="brand">${OPTIMUM_WORDMARK}<span>Register</span></div>
<h1>${esc(ogMember(m).name)}</h1><p><span class="rb rb-${m.holder ? 'treasure' : m.role.toLowerCase().replace(/[^a-z]/g, '')}">${esc(m.role)}</span>&nbsp; ${esc(m.holder ? R.holderLine : R.since(new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(m.since + 'T12:00:00Z'))))}</p>
<p class="purl">propagator.news/m/${esc(m.slug)}</p></div></body></html>`;

const reg = await register(null);
const everyone = [...reg.members, ...(reg.holders || [])];
let list = only.length ? everyone.filter((m) => only.includes(m.slug)) : everyone;
const file = (m) => (m.v ? `m-${m.slug}-p${m.v}.jpg` : `m-${m.slug}.jpg`);
if (claimed) {
  const c = await (await fetch(LIVE + '/api/claims')).json();
  list = list.filter((m) => c[m.slug]?.photo && !c[m.slug].og?.endsWith(`-p${c[m.slug].v}.jpg`)).map((m) => ({ ...m, v: c[m.slug].v, photo: `${LIVE}/avatar/${m.slug}.png?v=${c[m.slug].v}` }));
}
await mkdir(outDir, { recursive: true });
const tmp = ROOT + '.og-member.html';
const browser = await chromium.launch();
const p = await browser.newPage({ viewport: { width: 1200, height: 630 } });
let n = 0;
for (const m of list) {
  await writeFile(tmp, page(m, reg));
  await p.goto('file://' + tmp, { waitUntil: 'load' });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForLoadState('networkidle');
  await p.screenshot({ path: `${outDir}/${file(m)}`, type: 'jpeg', quality: 86 });
  if (claimed && process.env.EDITOR_TOKEN) {
    const r = await fetch(`${LIVE}/api/admin/og/${file(m)}`, { method: 'PUT', headers: { authorization: 'Bearer ' + process.env.EDITOR_TOKEN, 'content-type': 'image/jpeg' }, body: await readFile(`${outDir}/${file(m)}`) });
    console.log(file(m), r.status);
  }
  if (++n % 50 === 0) console.log(n);
}
await browser.close();
await rm(tmp, { force: true });
console.log(`member cards: ${n} in ${outDir}`);
