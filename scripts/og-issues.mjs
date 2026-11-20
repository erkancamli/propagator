// Share images for issues, one per language: node scripts/og-issues.mjs [outDir] [issue.json ...]
// Without issue files it renders every seed issue into public/og/. The editor runs the same script on new issues
// and uploads the PNGs with PUT /api/admin/og/<name>.png.
import { readFile, mkdir, readdir } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { LANGS } from '../lib/i18n.mjs';
import { UI, L } from '../lib/t.mjs';
import { fmtDate } from '../lib/render.mjs';
import { art } from '../lib/art.mjs';
import { writeFile } from 'node:fs/promises';
const { chromium } = createRequire(import.meta.url)('playwright');

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const no = (lang, id) => (['ja', 'ko', 'zh'].includes(lang) && /^\d+$/.test(id) ? String(Number(id)) : id);
const ROOT = new URL('../', import.meta.url).pathname;
// the share image is the issue's cover: the cover art on the right, the nameplate and the title in Propagator Serif
const SERIF = { ja: "'Noto Serif CJK JP','Noto Sans CJK JP'", ko: "'Noto Serif CJK KR','Noto Sans CJK KR'", zh: "'Noto Serif CJK SC','Noto Sans CJK SC'", hi: "'Noto Sans Devanagari'" };
function card(issue, lang, fontsCss) {
  const T = UI(lang);
  const title = L(issue.title, lang);
  const cjk = ['ja', 'ko', 'zh', 'hi'].includes(lang);
  // CJK titles are sized to their length so a short title stays on one line
  const size = cjk ? Math.max(48, Math.min(70, Math.floor(730 / Math.min(title.length, 14)))) : title.length > 48 ? 64 : title.length > 30 ? 76 : 88;
  const cover = art(lang, issue.cover || { type: 'network', seed: 'cover-' + issue.id, nodes: 60 }, { w: 640, h: 630 });
  return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><style>${fontsCss}
*{box-sizing:border-box}body{margin:0;width:1200px;height:630px;background:#1d1c19;color:#ecebe6;font-family:Geist,sans-serif;position:relative;overflow:hidden}
.art{position:absolute;right:0;top:0;width:640px;height:630px;--a-bg:#1d1c19;--a-line:#2f2d29;--a-violet:#b87cff}
.art .a-bg{fill:#1d1c19}.art .a-edge{stroke:#2f2d29;stroke-width:1.6;fill:none}.art .a-hot{stroke:#b87cff;stroke-width:2.6;fill:none;stroke-linecap:round}.art .a-node{fill:#3e3b36}.art .a-node-hot{fill:#b87cff;stroke:#1d1c19;stroke-width:3}.art .a-piece{fill:#b87cff}
.fade{position:absolute;inset:0;background:linear-gradient(90deg,#1d1c19 46%,rgba(29,28,25,.55) 70%,rgba(29,28,25,0))}
.text{position:absolute;left:64px;top:52px;bottom:56px;width:760px;display:flex;flex-direction:column;justify-content:space-between}
.flag{font:600 64px/1 'Propagator Serif',serif;letter-spacing:-.035em}
.folio{display:flex;gap:28px;margin-top:14px;padding-top:12px;border-top:3px solid #ecebe6;font:500 22px Geist,sans-serif;color:#c4c0b6;width:560px}.folio b{color:#c59bff;font-weight:600}
h1:lang(ja){word-break:auto-phrase}h1{margin:0;font:600 ${size}px/1.04 'Propagator Serif',${SERIF[lang] || 'serif'};letter-spacing:${cjk ? '0' : '-0.025em'};max-width:760px}</style></head>
<body>${cover}<div class="fade"></div><div class="text"><div><div class="flag">Propagator</div><div class="folio"><b>${esc(T.issue(no(lang, issue.id)))}</b><span>${esc(fmtDate(lang, issue.date))}</span></div></div><h1>${esc(title)}</h1></div></body></html>`;
}

const [outDir = 'public/og', ...files] = process.argv.slice(2);
const issues = [];
if (files.length) for (const f of files) issues.push(JSON.parse(await readFile(f, 'utf8')));
else for (const f of (await readdir('content/seed')).filter((f) => /^weekly-.*\.json$/.test(f))) issues.push(JSON.parse(await readFile('content/seed/' + f, 'utf8')));
await mkdir(outDir, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
// self hosted fonts, loaded from disk through a file page so the card uses exactly the site's type
const fontsCss = (await readFile(ROOT + 'public/assets/fonts.css', 'utf8')).replaceAll('url(/assets/fonts/', 'url(file://' + ROOT + 'public/assets/fonts/');
const tmp = ROOT + '.og-card.html';
for (const issue of issues) for (const { code } of LANGS) {
  await writeFile(tmp, card(issue, code, fontsCss));
  await page.goto('file://' + tmp, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: `${outDir}/${issue.kind}-${issue.id}-${code}.png` });
}
await browser.close();
await (await import('node:fs/promises')).rm(tmp, { force: true });
console.log(`share images: ${issues.length} issues x ${LANGS.length} languages in ${outDir}`);
