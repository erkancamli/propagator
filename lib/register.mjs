// The Optimum Register: every role call from #role-announcements, turned into members, classes and numbers.
// A role call is { id, date, by, groups: [{ role, names[] }], src: [label, url], note? }. Seed calls live in content/roles,
// new ones are added by the editor through the admin API and kept in the store under rolecalls/list.
import { SEED } from './seed.mjs';

// the Discord ladder, lowest first; Chronicler is the creative branch beside Optimized
export const ROLES = [
  { id: 'Optimum Newbie', key: 'newbie', rank: 0 },
  { id: 'Observer', key: 'observer', rank: 1 },
  { id: 'Refined', key: 'refined', rank: 2 },
  { id: 'Optimized', key: 'optimized', rank: 3 },
  { id: 'Chronicler', key: 'chronicler', rank: 3 },
];
export const ROLE = Object.fromEntries(ROLES.map((r) => [r.id, r]));

// One person, many spellings: Discord names drift between weeks (fancy Unicode letters, a "| MUM" tag added or dropped,
// emoji). The key folds those away so a member's Refined and Chronicler weeks land on one page.
const TAGS = /(?:^|[\s|/\\\[\](){}:·•-])(?:g?mum|mum\s*(?:bot|lover|maxi|arc)?|ur\s*mum|opti|bd|1st\s*mum)(?=$|[\s|/\\\[\](){}:·•-])/giu;
export function keyOf(name) {
  let k = String(name).normalize('NFKC').toLowerCase();
  k = k.replace(/\p{Extended_Pictographic}|\p{Regional_Indicator}|[\u{1F3FB}-\u{1F3FF}‍️]/gu, ' ');
  k = k.replace(TAGS, ' ').replace(TAGS, ' ');
  k = k.replace(/[|/\\\[\](){}⧉<>∞♾❖⨀✿࿐𓆩𓆪♛♡ঔৣ꧁꧂☾☽!~*_]+/gu, ' ').replace(/\s+/g, ' ').trim();
  return k || String(name).normalize('NFKC').toLowerCase().trim();
}
// a stable, readable address
export function slugOf(name) {
  const k = keyOf(name);
  const ascii = k.normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40);
  let h = 2166136261; for (const c of k) h = Math.imul(h ^ c.codePointAt(0), 16777619);
  const tag = (h >>> 0).toString(36).slice(0, 4);
  const latin = k.normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd');
  return ascii.length >= 3 && /^[\x20-\x7e]+$/.test(latin) ? ascii : (ascii ? ascii + '-' : 'm-') + tag;
}

export async function roleCalls(store) {
  const extra = store ? ((await store.get('rolecalls/list', { type: 'json' }).catch(() => null)) || []) : [];
  const byId = new Map();
  for (const c of [...(SEED.rolecalls || []), ...extra]) byId.set(c.id, c);
  return [...byId.values()].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.id.localeCompare(b.id)));
}

export function buildRegister(calls) {
  const members = new Map(), byKey = new Map();
  for (const c of [...calls].reverse()) {
    for (const g of c.groups) for (const name of g.names) {
      // the same display name is the same person; a similar name is the same person only when it is a promotion
      // (a new role), because two namesakes can both reach Refined but nobody is promoted to Refined twice
      const key = slugOf(name), cands = byKey.get(key) || [];
      let m = cands.find((x) => x.names.has(name)) || cands.find((x) => !x.events.some((e) => e.role === g.role));
      if (!m) {
        const slug = cands.length ? key + '-' + (cands.length + 1) : key;
        m = { slug, name, names: new Set(), events: [] };
        cands.push(m); byKey.set(key, cands); members.set(slug, m);
      }
      m.name = name; m.names.add(name);
      m.events.push({ date: c.date, role: g.role, call: c.id });
    }
  }
  for (const m of members.values()) {
    m.events.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : (ROLE[a.role]?.rank ?? 0) - (ROLE[b.role]?.rank ?? 0)));
    // current role: the highest rank reached, the latest one on a tie
    m.role = m.events.reduce((best, e) => ((ROLE[e.role]?.rank ?? 0) >= (ROLE[best.role]?.rank ?? 0) ? e : best)).role;
    m.since = [...m.events].reverse().find((e) => e.role === m.role).date;
    m.first = m.events[0].date;
    m.names = [...m.names];
  }
  // register number: order of first appearance, announcement order within a week
  let no = 0;
  for (const c of [...calls].reverse()) for (const g of c.groups) for (const name of g.names) {
    const m = [...members.values()].find((x) => x.names.includes(name) && x.first === c.date && x.no == null);
    if (m) m.no = ++no;
  }
  const firsts = {};
  for (const r of ['Optimized', 'Chronicler']) { const c = [...calls].reverse().find((c) => c.groups.some((g) => g.role === r)); if (c) firsts[r] = { date: c.date, slug: slugOf(c.groups.find((g) => g.role === r).names[0]) }; }
  const list = [...members.values()].sort((a, b) => (b.since > a.since ? 1 : b.since < a.since ? -1 : a.name.localeCompare(b.name)));
  const byRole = Object.fromEntries(ROLES.map((r) => [r.id, list.filter((m) => m.role === r.id).length]));
  const upgrades = calls.reduce((n, c) => n + c.groups.reduce((k, g) => k + g.names.length, 0), 0);
  return { calls, members: list, bySlug: members, byRole, firsts, stats: { members: list.length, upgrades, weeks: new Set(calls.map((c) => c.date)).size, calls: calls.length, since: calls[calls.length - 1]?.date } };
}

// cards their owners claimed with Discord (lib/claim.mjs) carry the picture and, once drawn, the share card with it
export async function register(store) {
  const reg = buildRegister(await roleCalls(store));
  const claims = (store && (await store.get('claims/index', { type: 'json' }).catch(() => null))) || {};
  for (const [slug, c] of Object.entries(claims)) {
    const m = reg.bySlug.get(slug); if (!m) continue;
    m.claimed = true;
    if (c.photo) m.photo = `/avatar/${slug}.png?v=${c.v}`;
    if (c.og) m.og = c.og;
    // a picture card drawn by the weekly run and shipped with the site
    else if (SEED.photoCards?.[slug + ':' + c.v]) m.og = SEED.photoCards[slug + ':' + c.v];
  }
  return reg;
}

// Turn a role announcement copied from Discord into a role call. Handles the shapes Flash and blockchainjeff used:
// a "Congratulations to" list for Refined, inline "first official @Chronicler @Name", "our first @Optimized @Name",
// and "welcoming another Chronicler ... applause for:" or "our next @Optimized" blocks followed by names.
export function parseAnnouncement(text, { date, by } = {}) {
  const lines = String(text).split(/\r?\n/);
  const head = lines.map((l) => l.trim().match(/^(.+?),?\s+[—-]\s+(\d{1,2})\.(\d{2})\.(\d{4})\s+\d{1,2}:\d{2}$/)).find(Boolean);
  if (head) { date = date || `${head[4]}-${head[3]}-${head[2].padStart(2, '0')}`; by = by || (/^flash/i.test(head[1]) ? 'Flash' : (head[1].match(/^[\w.]+/) || ['Flash'])[0]); }
  const groups = {}; let state = 'Refined'; let note = null;
  const add = (role, name) => { name = name.replace(/^@+/, '').replace(/\s*congrats!*$/i, '').trim(); if (name) (groups[role] ||= []).push(name); };
  for (const raw of lines) {
    const s = raw.trim(), low = s.toLowerCase();
    if (!s) continue;
    if (low.includes('first official @chronicler')) { const m = s.split('@Chronicler')[1].match(/@(.+?)(?:\s{2,}|$)/); if (m) add('Chronicler', m[1]); continue; }
    if (low.includes('first @optimized')) { const m = s.split('@Optimized')[1].match(/@(.+?)(?:\s{2,}|$)/); if (m) add('Optimized', m[1]); continue; }
    if (low.includes('chronicler') && (low.includes('applause') || low.includes('welcoming'))) { state = 'Chronicler'; continue; }
    if (low.includes('optimized') && low.includes('introduce')) { state = 'Optimized'; continue; }
    if (low.startsWith('congratulations to')) { state = 'Refined'; continue; }
    if (low.includes('mumbassadors carefully chose')) { note = { en: 'Selected by the Mumbassadors for activity, support and overall contribution.' }; continue; }
    if (s.startsWith('@') && !/^@(observer|refined|optimized|chronicler)\b/i.test(s)) add(state, s);
  }
  const order = { Optimized: 0, Chronicler: 1, Refined: 2 };
  const out = { id: date, date, by: by || 'Flash', groups: Object.entries(groups).map(([role, names]) => ({ role, names })).sort((a, b) => (order[a.role] ?? 9) - (order[b.role] ?? 9)), src: [`${by || 'Flash'} in #role-announcements, Optimum Discord, ${date}`, 'https://discord.gg/getoptimum'] };
  if (note) out.note = note;
  return out;
}
