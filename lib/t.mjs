// Translation lookup. A text is either a plain English string or an object { en, tr, ... }.
// Missing languages come from the translation memory (content/tm/<code>.json, bundled into lib/tm.mjs),
// keyed by key(english). Anything still missing falls back to English.
import { TM } from './tm.mjs';
import { UI_EN, ABOUT_EN, LANG } from './i18n.mjs';

// FNV-1a over the normalised English text, as 8 hex characters
export function key(s) {
  let h = 0x811c9dc5;
  for (const ch of String(s).replace(/\s+/g, ' ').trim()) { h ^= ch.codePointAt(0); h = Math.imul(h, 0x01000193) >>> 0; }
  return h.toString(16).padStart(8, '0');
}
export const tx = (en, lang) => (lang === 'en' || en == null || en === '' ? en : TM[lang]?.[key(en)] ?? en);
export const L = (o, lang) => {
  if (o == null) return o;
  if (typeof o === 'string') return tx(o, lang);
  if (Array.isArray(o)) return o.map((x) => L(x, lang));
  if (typeof o === 'object' && 'en' in o) {
    if (o[lang] != null) return o[lang];
    const en = o.en;
    return Array.isArray(en) ? en.map((p) => tx(p, lang)) : tx(en, lang);
  }
  return o;
};
const fill = (tpl, args) => String(tpl).replace(/\{(\d)\}/g, (_, i) => args[+i] ?? '');
function build(node, lang) {
  if (typeof node === 'string') { const s = tx(node, lang); return /\{\d\}/.test(node) ? (...a) => fill(s, a) : s; }
  if (Array.isArray(node)) return node.map((n) => build(n, lang));
  return Object.fromEntries(Object.entries(node).map(([k, v]) => [k, build(v, lang)]));
}
const cache = {};
export const UI = (lang) => (cache[lang] ||= build(UI_EN, lang));
export const ABOUT = (lang) => ABOUT_EN.map(([h, ps]) => [tx(h, lang), ps.map((p) => tx(p, lang))]);
export const localeOf = (lang) => LANG[lang]?.locale || 'en-GB';
