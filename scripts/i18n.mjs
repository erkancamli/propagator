// Translation memory tools.
//   node scripts/i18n.mjs extract   writes content/tm/_source.json: every English text that needs translating, by key
//   node scripts/i18n.mjs status    lists, per language, how many texts are missing
//   node scripts/i18n.mjs missing <lang>   prints the missing texts for one language as { key: english }
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { UI_EN, ABOUT_EN, LANGS } from '../lib/i18n.mjs';
import * as C from '../lib/content.mjs';
import { key } from '../lib/t.mjs';

export async function sources() {
  const out = new Map();
  const add = (s) => { if (typeof s === 'string' && /[A-Za-z]/.test(s)) out.set(key(s), s.replace(/\s+/g, ' ').trim()); };
  const walkUI = (n) => { if (typeof n === 'string') add(n); else if (Array.isArray(n)) n.forEach(walkUI); else Object.values(n).forEach(walkUI); };
  walkUI(UI_EN);
  for (const [h, ps] of ABOUT_EN) { add(h); ps.forEach(add); }
  // every { en: ... } object in the evergreen content and the seed issues
  const walk = (n) => {
    if (!n || typeof n !== 'object') return;
    if (Array.isArray(n)) return n.forEach(walk);
    if ('en' in n && (typeof n.en === 'string' || Array.isArray(n.en))) { [].concat(n.en).forEach(add); return; }
    Object.values(n).forEach(walk);
  };
  walk([C.LEARN, C.GLOSSARY, C.TEAM, C.BUILDERS, C.KINDS, C.FEATURED, C.TAKE_PART, C.BADGES]);
  for (const f of (await readdir('content/seed')).filter((f) => f.endsWith('.json'))) walk(JSON.parse(await readFile('content/seed/' + f, 'utf8')));
  return Object.fromEntries(out);
}
async function tm(code) { try { return JSON.parse(await readFile(`content/tm/${code}.json`, 'utf8')); } catch { return {}; } }

const [cmd, arg] = process.argv.slice(2);
if (cmd) {
  const src = await sources();
  if (cmd === 'extract') { await writeFile('content/tm/_source.json', JSON.stringify(src, null, 1)); console.log(Object.keys(src).length, 'texts'); }
  if (cmd === 'status') for (const l of LANGS.filter((l) => l.code !== 'en')) { const t = await tm(l.code); const miss = Object.keys(src).filter((k) => !(k in t)); console.log(l.code.padEnd(3), 'missing', miss.length, 'of', Object.keys(src).length); }
  if (cmd === 'missing') { const t = await tm(arg); console.log(JSON.stringify(Object.fromEntries(Object.entries(src).filter(([k]) => !(k in t))), null, 1)); }
}
