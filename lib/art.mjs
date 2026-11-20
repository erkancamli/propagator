// Editorial art for every story, drawn from a small spec in the issue JSON. One visual language for the whole magazine:
// an always dark panel, slate lines, violet for the mump2p path, big figures in Propagator Serif. The art carries only
// numbers, dates and symbols, formatted for each language, so it needs no translation; the story text explains it.
import { localeOf } from './t.mjs';

const W = 800, H = 600;
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const nf = (lang, v, d = 0) => new Intl.NumberFormat(localeOf(lang), { minimumFractionDigits: d, maximumFractionDigits: d }).format(v);
const pct = (lang, v, d = 0, sign = false) => (sign && v > 0 ? '+' : '') + new Intl.NumberFormat(localeOf(lang), { style: 'percent', minimumFractionDigits: d, maximumFractionDigits: d }).format(v / 100).replace('-', '−');
const day = (lang, iso) => new Intl.DateTimeFormat(localeOf(lang), { day: 'numeric', month: 'short', timeZone: 'UTC' }).format(new Date(iso + 'T12:00:00Z'));
// a value is a number with a format, or a literal string
const val = (lang, v) => typeof v === 'string' ? v : v.pct != null ? pct(lang, v.pct, v.d || 0, v.sign) : nf(lang, v.n, v.d || 0).replace('-', '−') + (v.unit ? (v.tight ? '' : ' ') + v.unit : '');

// deterministic random numbers from a seed string
function rng(seed) {
  let h = 2166136261; for (const c of String(seed)) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return () => { h += 0x6D2B79F5; let t = h; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

const frame = (inner, w = W, h = H, cls = '') => `<svg class="art${cls ? ' ' + cls : ''}" viewBox="0 0 ${w} ${h}" aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid slice"><rect class="a-bg" width="${w}" height="${h}"/>${inner}</svg>`;

// a gossip mesh with coded pieces travelling along the violet path
function network(lang, s, w = W, h = H) {
  const r = rng(s.seed || 'net'), n = s.nodes || 34, m = 46;
  const pts = [];
  for (let tries = 0; pts.length < n && tries < 4000; tries++) {
    const p = [m + r() * (w - 2 * m), m + r() * (h - 2 * m)];
    if (pts.every((q) => Math.hypot(p[0] - q[0], p[1] - q[1]) > Math.min(w, h) / Math.sqrt(n) * 0.72)) pts.push(p);
  }
  const edges = new Set();
  pts.forEach((p, i) => pts.map((q, j) => [j, Math.hypot(p[0] - q[0], p[1] - q[1])]).filter(([j]) => j !== i).sort((a, b) => a[1] - b[1]).slice(0, 3).forEach(([j]) => edges.add(i < j ? i + '-' + j : j + '-' + i)));
  // a path of lit nodes: walk from the left-most node by nearest unvisited neighbours toward the right
  const lit = [pts.reduce((b, p, i) => (p[0] < pts[b][0] ? i : b), 0)];
  while (lit.length < Math.min(9, n)) {
    const cur = pts[lit[lit.length - 1]];
    const next = pts.map((q, j) => [j, Math.hypot(cur[0] - q[0], cur[1] - q[1]) - (q[0] - cur[0]) * 0.35]).filter(([j]) => !lit.includes(j)).sort((a, b) => a[1] - b[1])[0];
    if (!next) break; lit.push(next[0]);
  }
  const litE = new Set(lit.slice(1).map((j, k) => { const i = lit[k]; return i < j ? i + '-' + j : j + '-' + i; }));
  let out = [...edges].map((e) => { const [i, j] = e.split('-').map(Number); return `<line class="${litE.has(e) ? 'a-hot' : 'a-edge'}" x1="${pts[i][0].toFixed(1)}" y1="${pts[i][1].toFixed(1)}" x2="${pts[j][0].toFixed(1)}" y2="${pts[j][1].toFixed(1)}"/>`; }).join('');
  // coded pieces: small squares part way along the hot edges
  out += lit.slice(1).map((j, k) => { const a = pts[lit[k]], b = pts[j], t = 0.35 + r() * 0.3; const x = a[0] + (b[0] - a[0]) * t, y = a[1] + (b[1] - a[1]) * t; return `<rect class="a-piece" x="${(x - 6).toFixed(1)}" y="${(y - 6).toFixed(1)}" width="12" height="12" rx="2" transform="rotate(${Math.round(r() * 40 - 20)} ${x.toFixed(1)} ${y.toFixed(1)})"/>`; }).join('');
  out += pts.map((p, i) => `<circle class="${lit.includes(i) ? 'a-node-hot' : 'a-node'}" cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="${lit.includes(i) ? 6.5 : 4.5}"/>`).join('');
  if (s.stat) out += `<text class="a-big a-halo" x="48" y="140">${esc(val(lang, s.stat))}</text><text class="a-big" x="48" y="140">${esc(val(lang, s.stat))}</text>`;
  return out;
}

// n of total, as a grid of squares
function waffle(lang, s) {
  const cols = s.cols || 10, rows = Math.ceil(s.total / cols), size = Math.min(s.total <= 24 ? 52 : 34, 380 / Math.max(cols, rows)), gap = size * 0.28;
  const gw = cols * size + (cols - 1) * gap, gh = rows * size + (rows - 1) * gap, x0 = 56, y0 = (H - gh) / 2;
  let out = '';
  for (let i = 0; i < s.total; i++) { const c = i % cols, rr = Math.floor(i / cols); out += `<rect class="${i < s.filled ? 'a-fill' : 'a-empty'}" x="${(x0 + c * (size + gap)).toFixed(1)}" y="${(y0 + rr * (size + gap)).toFixed(1)}" width="${size.toFixed(1)}" height="${size.toFixed(1)}" rx="${(size * 0.18).toFixed(1)}"/>`; }
  const tx = x0 + gw + 48;
  out += `<text class="a-big" x="${tx}" y="${H / 2 + 34}">${esc(s.big ? val(lang, s.big) : nf(lang, s.filled) + '/' + nf(lang, s.total))}</text>`;
  return out;
}

// horizontal bars: label (a date or a literal), bar, value
function bars(lang, s) {
  const items = s.items, max = s.max || Math.max(...items.map((i) => i.v)) * 1.08, x0 = 200, bw = W - x0 - 64, rowH = Math.min(150, (H - 140) / items.length);
  const y0 = (H - rowH * items.length) / 2;
  let out = items.map((it, k) => {
    const y = y0 + k * rowH, len = Math.max(6, (it.v / max) * bw), label = it.date ? day(lang, it.date) : it.label;
    return `<text class="a-label" x="${x0 - 22}" y="${y + rowH / 2 + 8}" text-anchor="end">${esc(label)}</text>
<rect class="${it.hot ? 'a-fill' : 'a-gossip'}" x="${x0}" y="${(y + rowH * 0.2).toFixed(1)}" width="${len.toFixed(1)}" height="${(rowH * 0.6).toFixed(1)}" rx="8"/>
<text class="a-val${len > bw - 210 ? (it.hot ? ' a-val-on-hot' : ' a-val-on-gossip') : it.hot ? ' a-val-hot' : ''}" x="${(x0 + len + (len > bw - 210 ? -18 : 18)).toFixed(1)}" y="${y + rowH / 2 + 12}"${len > bw - 210 ? ' text-anchor="end"' : ''}>${esc(val(lang, it.show))}</text>`;
  }).join('');
  if (s.delta) out += `<text class="a-delta" x="${x0}" y="${H - 44}">${esc(val(lang, s.delta))}</text>`;
  return out;
}

// two or three big figures, each with an arrow
function stats(lang, s) {
  const n = s.items.length, colW = W / n;
  return s.items.map((it, k) => {
    const cx = colW * k + colW / 2, up = it.dir === 'up';
    const arrow = up ? `M${cx - 22} ${H / 2 - 92} L${cx} ${H / 2 - 128} L${cx + 22} ${H / 2 - 92}` : `M${cx - 22} ${H / 2 - 128} L${cx} ${H / 2 - 92} L${cx + 22} ${H / 2 - 128}`;
    return `<path class="${up ? 'a-arrow-up' : 'a-arrow-down'}" d="${arrow}"/><text class="a-big a-mid" x="${cx}" y="${H / 2 + 20}" text-anchor="middle">${esc(val(lang, it.v))}</text>${k ? `<line class="a-edge" x1="${colW * k}" y1="${H / 2 - 150}" x2="${colW * k}" y2="${H / 2 + 80}"/>` : ''}`;
  }).join('');
}

// a release strip: unsupported, upgrade, current
function versions(lang, s) {
  const n = s.items.length, gap = 18, bw = (W - 112 - gap * (n - 1)) / n, y = H / 2 - 70;
  return s.items.map((it, k) => {
    const x = 56 + k * (bw + gap), cur = it.s === 'current', glyph = { no: '×', up: '!', current: '✓' }[it.s];
    return `<rect class="${cur ? 'a-fill' : it.s === 'no' ? 'a-empty' : 'a-warn-box'}" x="${x.toFixed(1)}" y="${y}" width="${bw.toFixed(1)}" height="140" rx="14"/>
<text class="a-ver${cur ? ' a-ver-cur' : ''}" x="${(x + bw / 2).toFixed(1)}" y="${y + 70}" text-anchor="middle">${esc(it.v)}</text>
<text class="a-glyph a-glyph-${it.s}" x="${(x + bw / 2).toFixed(1)}" y="${y + 118}" text-anchor="middle">${glyph}</text>${it.s === 'no' ? `<line class="a-strike" x1="${(x + 16).toFixed(1)}" y1="${y + 62}" x2="${(x + bw - 16).toFixed(1)}" y2="${y + 62}"/>` : ''}`;
  }).join('') + (s.date ? `<text class="a-label" x="56" y="${y + 210}">${esc(day(lang, s.date))}</text>` : '');
}

// erasure coding: a block is cut into pieces, coded pieces travel, some are lost, any k rebuild it
function pieces(lang, s) {
  const k = s.k || 4, n = s.n || 7, lost = new Set(s.lost || [1, 4]);
  const bx = 56, by = H / 2 - 90, bs = 44;
  let out = `<rect class="a-block" x="${bx - 10}" y="${by - 10}" width="${bs + 20}" height="${k * (bs + 8) + 12}" rx="10"/>`;
  for (let i = 0; i < k; i++) out += `<rect class="a-fill" x="${bx}" y="${by + i * (bs + 8)}" width="${bs}" height="${bs}" rx="6"/>`;
  const mx = W / 2 - 22, my0 = H / 2 - (n * 56) / 2;
  for (let j = 0; j < n; j++) {
    const y = my0 + j * 56, gone = lost.has(j);
    out += `<path class="${gone ? 'a-edge' : 'a-hot'}" d="M${bx + bs + 12} ${by + (k * (bs + 8)) / 2} C ${W / 3} ${by + (k * (bs + 8)) / 2}, ${mx - 60} ${y + 22}, ${mx} ${y + 22}"/>`;
    out += gone ? `<rect class="a-empty" x="${mx}" y="${y}" width="44" height="44" rx="6"/><path class="a-x" d="M${mx + 12} ${y + 12} L${mx + 32} ${y + 32} M${mx + 32} ${y + 12} L${mx + 12} ${y + 32}"/>`
      : `<rect class="a-piece-big" x="${mx}" y="${y}" width="44" height="44" rx="6"/><path class="a-hot" d="M${mx + 56} ${y + 22} C ${mx + 140} ${y + 22}, ${W - 260} ${H / 2}, ${W - 170} ${H / 2}"/>`;
  }
  out += `<rect class="a-block a-block-out" x="${W - 168}" y="${by - 10}" width="${bs + 20}" height="${k * (bs + 8) + 12}" rx="10"/>`;
  for (let i = 0; i < k; i++) out += `<rect class="a-fill" x="${W - 158}" y="${by + i * (bs + 8)}" width="${bs}" height="${bs}" rx="6"/>`;
  return out;
}

const TYPES = { network, waffle, bars, stats, versions, pieces };

export function art(lang, spec, opts = {}) {
  if (!spec || !TYPES[spec.type]) return '';
  if (spec.type === 'network' && opts.w) return frame(network(lang, spec, opts.w, opts.h), opts.w, opts.h, opts.cls);
  return frame(TYPES[spec.type](lang, spec), W, H, opts.cls);
}
