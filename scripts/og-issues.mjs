// Share images for issues, one per language: node scripts/og-issues.mjs [outDir] [issue.json ...]
// Without issue files it renders every seed issue into public/og/. The editor runs the same script on new issues
// and uploads the PNGs with PUT /api/admin/og/<name>.png.
import { readFile, mkdir, readdir } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { LANGS } from '../lib/i18n.mjs';
import { UI, L } from '../lib/t.mjs';
import { fmtDate } from '../lib/render.mjs';
const { chromium } = createRequire(import.meta.url)('playwright');

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const FONTS = { ja: "'Noto Sans CJK JP'", ko: "'Noto Sans CJK KR'", zh: "'Noto Sans CJK SC'", hi: "'Noto Sans Devanagari'" };
const no = (lang, id) => (['ja', 'ko', 'zh'].includes(lang) && /^\d+$/.test(id) ? String(Number(id)) : id);

function lane(spread, lib, color) {
  let s = 7, out = '';
  for (let i = 0; i < 96; i++) {
    s = (s * 16807) % 2147483647; const u = (s - 1) / 2147483646;
    const at = spread * Math.pow(u / 0.95, 1.5), x = 8 + Math.min(1, at / lib) * 584, y = 9 + ((i % 3) + 0.5) * 16 + ((i * 37) % 7) - 3;
    out += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.6" fill="${color}"/>`;
  }
  return out;
}

function card(issue, lang) {
  const T = UI(lang);
  const head = issue.kind === 'weekly' ? `${T.issue(no(lang, issue.id))}` : T.dailyBrief;
  const title = L(issue.title, lang);
  const p = issue.pulse;
  const race = p ? `<div class="race"><div class="ln"><span class="m">mump2p</span><svg width="600" height="66" class="tr">${lane(p.spread.mump, p.spread.lib, '#b87cff')}</svg><b class="m">${Math.round(p.spread.mump)} ms</b></div>
  <div class="ln"><span>gossipsub</span><svg width="600" height="66" class="tr">${lane(p.spread.lib, p.spread.lib, '#6a757f')}</svg><b>${Math.round(p.spread.lib)} ms</b></div></div>` : '';
  const size = title.length > 60 ? 54 : title.length > 36 ? 64 : 76;
  return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@500;700&family=Geist+Mono:wght@500${lang === 'hi' ? '&family=Noto+Sans+Devanagari:wght@500;700' : ''}&display=block" rel="stylesheet">
<style>*{box-sizing:border-box}body{margin:0;width:1200px;height:630px;background:#16181a;color:#f0f2f4;font-family:Geist,${FONTS[lang] || 'sans-serif'},sans-serif;padding:56px 64px;display:flex;flex-direction:column;justify-content:space-between}
.top{display:flex;align-items:center;justify-content:space-between;font-size:24px;color:#bcc0c3}.brand{display:flex;align-items:center;gap:14px;font-weight:700;color:#f0f2f4;font-size:30px;letter-spacing:-.02em}
h1{font-size:${size}px;line-height:1.08;letter-spacing:${FONTS[lang] ? '0' : '-0.035em'};margin:0;max-width:1060px;font-weight:700}
.race{display:grid;gap:10px}.ln{display:grid;grid-template-columns:120px 600px 1fr;align-items:center;gap:18px;font:500 20px 'Geist Mono',monospace;color:#8d9ca9}.tr{background:#1e2124;border-radius:10px}.m{color:#c59bff}b{color:#f0f2f4;font-weight:500;font-size:26px}b.m{color:#c59bff}</style></head>
<body><div class="top"><span class="brand"><svg width="40" height="40" viewBox="0 0 32 32"><rect x="2" y="4" width="9" height="9" rx="2" fill="#f0f2f4"/><rect x="2" y="19" width="9" height="9" rx="2" fill="#f0f2f4" opacity=".55"/><rect x="13" y="11.5" width="9" height="9" rx="2" fill="#f0f2f4" opacity=".8"/><rect x="21" y="9" width="9" height="14" rx="2.5" fill="#b87cff"/></svg>Propagator</span><span>${esc(head)}, ${esc(fmtDate(lang, issue.date))}</span></div>
<h1>${esc(title)}</h1>${race}</body></html>`;
}

const [outDir = 'public/og', ...files] = process.argv.slice(2);
const issues = [];
if (files.length) for (const f of files) issues.push(JSON.parse(await readFile(f, 'utf8')));
else for (const f of (await readdir('content/seed')).filter((f) => /^(weekly|daily)-.*\.json$/.test(f))) issues.push(JSON.parse(await readFile('content/seed/' + f, 'utf8')));
await mkdir(outDir, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
for (const issue of issues) for (const { code } of LANGS) {
  await page.setContent(card(issue, code), { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: `${outDir}/${issue.kind}-${issue.id}-${code}.png` });
}
await browser.close();
console.log(`share images: ${issues.length} issues x ${LANGS.length} languages in ${outDir}`);
