// Data access: issues (weekly and daily) and live pulse numbers.
// Issues live in Netlify Blobs; seed issues bundled with the site are the fallback and the first content.
import { SEED } from './seed.mjs';

const HUB = 'https://console.getoptimum.xyz/api/public';
const PULSE_TTL = 20 * 60 * 1000;

export const issueKey = (kind, id) => `issue/${kind}/${id}`;

// index rows: { id, date, title, status }
// what an archive row needs: no full issue reads to draw the list
const row = (i) => ({ id: i.id, date: i.date, title: i.title, dek: i.dek || null, n: (i.stories || i.items || []).length, og: Boolean(i.og), status: i.status, kind: i.kind, ...(i.back ? { back: true, range: i.range } : {}) });
export async function listIssues(store, kind, { drafts = false } = {}) {
  const idx = (await store.get(`index/${kind}`, { type: 'json' }).catch(() => null)) || [];
  const rows = new Map();
  for (const s of SEED[kind] || []) rows.set(s.id, row(s));
  for (const r of idx) rows.set(r.id, { ...r, kind });
  return [...rows.values()].filter((r) => drafts || r.status === 'published').sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : b.id.localeCompare(a.id)));
}

export async function getIssue(store, kind, id) {
  const stored = await store.get(issueKey(kind, id), { type: 'json' }).catch(() => null);
  return stored || (SEED[kind] || []).find((s) => s.id === id) || null;
}

export async function putIssue(store, issue) {
  const kind = issue.kind;
  await store.setJSON(issueKey(kind, issue.id), issue);
  const idx = ((await store.get(`index/${kind}`, { type: 'json' }).catch(() => null)) || []).filter((r) => r.id !== issue.id);
  idx.push(row(issue));
  await store.setJSON(`index/${kind}`, idx);
}

async function getJSON(url, ms = 5000) {
  const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), ms);
  try { const r = await fetch(url, { signal: ctl.signal, headers: { accept: 'application/json', 'user-agent': 'propagator.news' } }); if (!r.ok) throw new Error(url + ' ' + r.status); return await r.json(); } finally { clearTimeout(t); }
}

// Live numbers from Optimum's public Hub API, plus Discord member counts from the public invite.
export async function fetchPulse() {
  const [perf, stake, invite] = await Promise.allSettled([
    getJSON(`${HUB}/network-performance`), getJSON(`${HUB}/fleet-stake`), getJSON('https://discord.com/api/v10/invites/getoptimum?with_counts=true'),
  ]);
  if (perf.status !== 'fulfilled' || stake.status !== 'fulfilled') throw new Error('hub unavailable');
  const p = perf.value, s = stake.value.series.filter((x) => Number.isFinite(x.eth));
  const now = s[s.length - 1], weekAgo = s[Math.max(0, s.length - 8)];
  const launch = s.find((x) => x.day >= '2026-10-21') || s[0];
  return {
    at: new Date().toISOString(),
    window: [p.window.start_utc.slice(0, 10), p.window.end_utc.slice(0, 10)],
    slots: p.spread.slots_compared,
    spread: { mump: p.spread.mump2p_ms, lib: p.spread.libp2p_ms, factor: p.spread.speed_factor },
    lead: p.headline.lead_ms,
    accel: p.headline.slots_accelerated_pct,
    over4: { mump: p.headline.over_4s_mump2p_slots, lib: p.headline.over_4s_libp2p_slots, factor: p.headline.over_4s_factor },
    stake: { now: now.eth, weekAgo: weekAgo.eth, launch: launch.eth, day: now.day },
    observers: { gateways: p.observers?.gateways, xatu: p.observers?.xatu_sentries },
    discord: invite.status === 'fulfilled' ? { members: invite.value.approximate_member_count, online: invite.value.approximate_presence_count } : null,
    series: s.map((x) => ({ day: x.day, eth: x.eth })),
  };
}

// Cached pulse: refreshed at most every 20 minutes, falls back to the last good copy, then to the latest issue.
export async function getPulse(store, { refresh = true } = {}) {
  const cached = await store.get('pulse/latest', { type: 'json' }).catch(() => null);
  if (cached && Date.now() - Date.parse(cached.at) < PULSE_TTL) return cached;
  if (refresh) {
    try { const fresh = await fetchPulse(); await store.setJSON('pulse/latest', fresh); return fresh; } catch {}
  }
  if (cached) return cached;
  const latest = (SEED.weekly || []).find((w) => w.pulse);
  return latest ? { ...latest.pulse, at: latest.date } : null;
}
