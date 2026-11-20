// The share image for the front page: the headline and three credentials, from the live register.
//   node scripts/og-home.mjs   (run `npm run build` first; writes public/og.png)
import { readFile, readdir, writeFile, rm } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { register } from '../lib/register.mjs';
import { credential, OPTIMUM_WORDMARK } from '../lib/render.mjs';
import { UI } from '../lib/t.mjs';
const { chromium } = createRequire(import.meta.url)('playwright');

const ROOT = new URL('../', import.meta.url).pathname;
const css = (await readdir(ROOT + 'dist/assets')).find((f) => /^site-\w+\.css$/.test(f));
const style = (await readFile(ROOT + 'dist/assets/' + css, 'utf8')).replaceAll('url(/assets/fonts/', 'url(file://' + ROOT + 'public/assets/fonts/');
const reg = await register(null), R = UI('en').reg;
const pick = [reg.members.find((m) => m.role === 'Chronicler'), reg.members.find((m) => m.role === 'Optimized'), reg.members.find((m) => m.role === 'Refined')];
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><style>${style}
body{margin:0;width:1200px;height:630px;overflow:hidden;background:radial-gradient(800px 500px at 80% 40%,rgba(184,124,255,.22),transparent 65%),#0a0b0e;color:#eef0f4;font-family:Geist,sans-serif}
.l{position:absolute;left:64px;top:60px;width:560px}.brand{display:flex;align-items:center;gap:12px;font:650 26px Geist;letter-spacing:-.01em;color:#eef0f4}.brand .opt-wm{height:26px;width:auto;color:#eef0f4}.brand span{padding-left:12px;border-left:2px solid rgba(238,240,244,.35)}
h1{font-size:56px;line-height:1.04;letter-spacing:-.04em;margin:34px 0 0}.st{display:flex;gap:34px;margin-top:40px}.st b{display:block;font:650 40px Geist;letter-spacing:-.03em}.st span{font-size:18px;color:#808894}
.f{position:absolute;left:640px;top:40px;width:520px;height:560px}.f .cred{position:absolute;width:400px}.f .cred:nth-child(1){left:0;top:0}.f .cred:nth-child(2){left:50px;top:175px;z-index:2}.f .cred:nth-child(3){left:100px;top:350px;z-index:3}</style></head><body>
<div class="l"><div class="brand">${OPTIMUM_WORDMARK}<span>Register</span></div>
<h1>${R.title}</h1><div class="st"><div><b>${reg.stats.members}</b><span>${R.members}</span></div><div><b>${reg.stats.upgrades}</b><span>${R.upgrades}</span></div><div><b>${reg.stats.weeks}</b><span>${R.weeks}</span></div></div></div>
<div class="f">${pick.map((m, i) => credential('en', m, { tilt: [-7, 3, -2][i] })).join('')}</div></body></html>`;
const tmp = ROOT + '.og-home.html';
await writeFile(tmp, html);
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
await p.goto('file://' + tmp); await p.evaluate(() => document.fonts.ready);
await p.screenshot({ path: ROOT + 'public/og.png' });
await b.close(); await rm(tmp, { force: true });
console.log('front page share image: public/og.png');
