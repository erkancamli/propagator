// The weekly share image for a role call: the count, the date and the new members' cards, 16:9 for X.
//   node scripts/og-class.mjs [id ...]   (run `npm run build` first; writes public/og/class-<id>.jpg, latest call if no id)
import { readFile, readdir, writeFile, rm } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { register } from '../lib/register.mjs';
import { OG_FONTS, ogMember } from '../lib/ogtext.mjs';
import { credential, OPTIMUM_WORDMARK } from '../lib/render.mjs';
const { chromium } = createRequire(import.meta.url)('playwright');

const ROOT = new URL('../', import.meta.url).pathname;
const css = (await readdir(ROOT + 'dist/assets')).find((f) => /^site-\w+\.css$/.test(f));
const style = (await readFile(ROOT + 'dist/assets/' + css, 'utf8')).replaceAll('url(/assets/fonts/', 'url(file://' + ROOT + 'public/assets/fonts/');
const reg = await register(null);
const ids = process.argv.slice(2).length ? process.argv.slice(2) : [reg.calls[0].id];
const date = (d) => new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(d + 'T12:00:00Z'));
const glow = { Refined: 'rgba(230,192,107,.20)', Optimized: 'rgba(196,161,247,.24)', Chronicler: 'rgba(132,220,198,.22)' };
const ink = { Refined: '#e8c26a', Optimized: '#c4a1f7', Chronicler: '#84dcc6' };
const b = await chromium.launch();
for (const id of ids) {
  const c = reg.calls.find((x) => x.id === id); if (!c) { console.log('no role call', id); continue; }
  const people = c.groups.flatMap((g) => g.names.map((n) => reg.members.find((m) => m.names.includes(n) && m.events.some((e) => e.call === c.id)))).filter(Boolean);
  const top = [...c.groups].sort((a, z) => z.names.length - a.names.length)[0].role;
  const head = c.groups.length === 1 ? `${people.length} new<b style="color:${ink[top]}">${c.groups[0].role}.</b>` : `${people.length} new<b style="color:${ink[top]}">upgrades.</b>`;
  const shown = people.slice(0, 11), more = people.length - shown.length;
  const rows = Math.ceil((shown.length + 1) / 3);
  const html = `<!doctype html><html lang="en" data-theme="dark"><head><meta charset="utf-8"><style>${style}${OG_FONTS}
*{box-sizing:border-box}body{margin:0;width:1600px;height:900px;overflow:hidden;color:#eef0f4;font-family:var(--sans);position:relative;background:radial-gradient(900px 700px at 74% 50%,${glow[top]},transparent 62%),#0b0c0f}
.lock{display:flex;align-items:center;gap:14px;font:650 28px Geist}.lock .opt-wm{height:28px;width:auto;color:#eef0f4}.lock span{padding-left:14px;border-left:2px solid rgba(238,240,244,.35)}
.l{position:absolute;left:88px;top:96px;width:470px}h1{font-size:${c.groups.length > 1 ? 96 : 118}px;line-height:.92;letter-spacing:-.055em;margin:60px 0 0}h1 b{display:block;font-weight:700}
.sub{font-size:28px;line-height:1.35;color:#a9afb8;margin:30px 0 0}.split{font-size:22px;color:#a9afb8;margin-top:14px;display:flex;flex-wrap:wrap;gap:4px 16px}.split span{white-space:nowrap}
.url{position:absolute;left:88px;bottom:88px;display:inline-flex;align-items:center;gap:12px;padding:14px 22px;border-radius:99px;background:#eef0f4;color:#0b0c0f;font:650 28px Geist}.url i{width:12px;height:12px;border-radius:50%;background:${ink[top]}}
.g{position:absolute;left:600px;top:${Math.max(46, (900 - rows * 195 - (rows - 1) * 16) / 2)}px;display:grid;grid-template-columns:repeat(3,300px);gap:16px 18px}
.g .cred{width:300px}.g .cred-in{padding:16px 18px}.g .cred-name{font-size:22px;max-width:none}.g .cred .av{width:38px;height:38px;font-size:15px}
.cta{width:300px;aspect-ratio:1.586;border-radius:16px;border:2px dashed rgba(238,240,244,.28);display:grid;place-content:center;text-align:center;gap:8px}.cta b{font:650 26px Geist}.cta span{font-size:18px;color:#a9afb8}
</style></head><body>
<div class="l"><div class="lock">${OPTIMUM_WORDMARK}<span>Register</span></div><h1>${head}</h1><p class="sub">Role call of ${date(c.date)}.<br>Every name now has its own card.</p>${c.groups.length > 1 ? `<p class="split">${c.groups.map((g) => `<span>${g.names.length} ${g.role}</span>`).join('')}</p>` : ''}</div>
<div class="url"><i></i>propagator.news</div>
<div class="g">${shown.map((m) => credential('en', ogMember(m), {})).join('')}<div class="cta">${more > 0 ? `<b>+${more} more</b><span>on the role call page</span>` : `<b>Find yours</b><span>Search ${reg.stats.members} members</span>`}</div></div></body></html>`;
  const tmp = ROOT + '.og-class.html'; await writeFile(tmp, html);
  const p = await b.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1.5 });
  await p.goto('file://' + tmp); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(200);
  await p.screenshot({ path: ROOT + `public/og/class-${c.id}.jpg`, type: 'jpeg', quality: 88 }); await p.close(); await rm(tmp, { force: true });
  console.log('role call image: public/og/class-' + c.id + '.jpg');
}
await b.close();
