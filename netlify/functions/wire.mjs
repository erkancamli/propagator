// The wire: every hour, collect what changed in the Optimum world from public sources and keep it for the editor.
// Sources: YouTube, the Optimum blog, GitHub releases and new repos, docs pages that changed, news search,
// Discord announcement channels followed into our own server (when a bot token is set), and X posts linked from those.
import { getStore } from '@netlify/blobs';
import { getPulse } from '../../lib/data.mjs';

const UA = { 'user-agent': 'propagator.news wire (+https://propagator.news/about/)' };
const KEEP = 600;

async function get(url, { ms = 7000, type = 'text', headers = {} } = {}) {
  const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), ms);
  try { const r = await fetch(url, { signal: ctl.signal, headers: { ...UA, ...headers } }); if (!r.ok) throw new Error(`${r.status} ${url}`); return type === 'json' ? await r.json() : await r.text(); } finally { clearTimeout(t); }
}
const tag = (s, name) => (s.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`)) || [])[1]?.replace(/<!\[CDATA\[|\]\]>/g, '').trim() || '';
const decode = (s) => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&#x27;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');

export const collectors = {
  async youtube(prev, env, store) {
    const xml = await get('https://www.youtube.com/feeds/videos.xml?channel_id=UCZwrSiUZzX5QMgSimeW5xgA');
    const list = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map(([, e]) => ({ id: tag(e, 'yt:videoId'), date: tag(e, 'published').slice(0, 10), title: decode(tag(e, 'title')) })).filter((v) => v.id);
    if (store && list.length) await store.setJSON('yt/list', list);
    return [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].slice(0, 15).map(([, e]) => ({ id: 'yt:' + tag(e, 'yt:videoId'), type: 'video', source: 'YouTube', title: decode(tag(e, 'title')), url: `https://www.youtube.com/watch?v=${tag(e, 'yt:videoId')}`, at: tag(e, 'published'), data: { videoId: tag(e, 'yt:videoId'), views: +(e.match(/views="(\d+)"/) || [])[1] || null } }));
  },
  async blog() {
    const html = await get('https://www.getoptimum.xyz/blog');
    const slugs = [...new Set([...html.matchAll(/href="(\/blog\/[a-z0-9-]+)"/g)].map((m) => m[1]))].slice(0, 30);
    return slugs.map((p) => ({ id: 'blog:' + p, type: 'blog', source: 'Optimum blog', title: decode(p.split('/').pop().replace(/-+/g, ' ')), url: 'https://www.getoptimum.xyz' + p, at: null }));
  },
  async github(prev, env) {
    // anonymous GitHub API calls share a small hourly limit per IP; a read-only token (GITHUB_TOKEN) avoids it
    const gh = { accept: 'application/vnd.github+json', ...(env?.GITHUB_TOKEN ? { authorization: 'Bearer ' + env.GITHUB_TOKEN } : {}) };
    const repos = await get('https://api.github.com/orgs/getoptimum/repos?sort=pushed&per_page=30', { type: 'json', headers: gh });
    const out = repos.map((r) => ({ id: 'repo:' + r.full_name, type: 'repo', source: 'GitHub', title: r.full_name, url: r.html_url, at: r.created_at, data: { description: r.description, pushed: r.pushed_at, stars: r.stargazers_count } }));
    const recent = repos.filter((r) => Date.now() - Date.parse(r.pushed_at) < 3 * 86400e3).slice(0, 6);
    const rel = await Promise.allSettled(recent.map((r) => get(`https://api.github.com/repos/${r.full_name}/releases?per_page=3`, { type: 'json', headers: gh })));
    rel.forEach((x, i) => { if (x.status === 'fulfilled') for (const v of x.value) out.push({ id: 'rel:' + recent[i].full_name + '@' + v.tag_name, type: 'release', source: 'GitHub', title: `${recent[i].name} ${v.tag_name}${v.name && v.name !== v.tag_name ? ': ' + v.name : ''}`, url: v.html_url, at: v.published_at, data: { body: (v.body || '').slice(0, 1500) } }); });
    return out;
  },
  async docs(prev) {
    const xml = await get('https://docs.getoptimum.xyz/sitemap.xml');
    const now = Object.fromEntries([...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(([, u]) => [tag(u, 'loc'), tag(u, 'lastmod') || '']));
    const before = prev?.docsMap || {};
    const changed = Object.keys(before).length ? Object.entries(now).filter(([u, m]) => !(u in before) || (m && m !== before[u])) : [];
    return { items: changed.map(([u, m]) => ({ id: 'docs:' + u + '@' + (m || 'new'), type: 'docs', source: 'Optimum docs', title: u.replace('https://docs.getoptimum.xyz', ''), url: u, at: m || null, data: { isNew: !(u in before) } })), state: { docsMap: now } };
  },
  async jobs(prev, env, store) {
    const d = await get('https://api.ashbyhq.com/posting-api/job-board/optimum', { type: 'json' });
    const jobs = (d.jobs || []).map((j) => ({ title: j.title, where: [j.location, j.employmentType].filter(Boolean).join(', '), date: (j.publishedAt || '').slice(0, 10), url: j.jobUrl }));
    if (store) await store.setJSON('jobs/list', jobs);
    return jobs.map((j) => ({ id: 'job:' + j.url, type: 'job', source: 'Optimum careers', title: j.title, url: j.url, at: j.date || null, data: j }));
  },
  async news() {
    const q = encodeURIComponent('"mump2p" OR "getoptimum" OR "Optimum" "RLNC" OR "Muriel Médard" Optimum');
    const xml = await get(`https://news.google.com/rss/search?q=${q}&hl=en-US&gl=US&ceid=US:en`);
    return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].slice(0, 25).map(([, e]) => ({ id: 'news:' + tag(e, 'link'), type: 'news', source: decode(tag(e, 'source')) || 'News', title: decode(tag(e, 'title')), url: tag(e, 'link'), at: new Date(tag(e, 'pubDate')).toISOString() }));
  },
  // Optimum's public announcement channels, followed into our own server with Discord's Follow button.
  async discord(prev, env) {
    if (!env.DISCORD_BOT_TOKEN || !env.DISCORD_CHANNELS) return { items: [], state: {} };
    const after = prev?.discordAfter || {};
    const items = [], state = { discordAfter: { ...after } };
    for (const ch of env.DISCORD_CHANNELS.split(',').map((s) => s.trim()).filter(Boolean)) {
      const msgs = await get(`https://discord.com/api/v10/channels/${ch}/messages?limit=50${after[ch] ? '&after=' + after[ch] : ''}`, { type: 'json', headers: { authorization: 'Bot ' + env.DISCORD_BOT_TOKEN } });
      for (const m of msgs) {
        const text = [m.content, ...(m.embeds || []).map((e) => [e.title, e.description].filter(Boolean).join('\n'))].filter(Boolean).join('\n').slice(0, 4000);
        items.push({ id: 'dc:' + m.id, type: 'discord', source: 'Discord: ' + (m.author?.username || 'announcement'), title: text.split('\n')[0].slice(0, 160), url: `https://discord.com/channels/${m.guild_id || '@me'}/${ch}/${m.id}`, at: m.timestamp, data: { text, images: [...(m.attachments || []).map((a) => a.url), ...(m.embeds || []).map((e) => e.image?.url).filter(Boolean)] } });
        if (!state.discordAfter[ch] || BigInt(m.id) > BigInt(state.discordAfter[ch])) state.discordAfter[ch] = m.id;
      }
    }
    return { items, state };
  },
};

// X posts: expand any x.com status link found by the other collectors into text, author and media.
export async function hydrateTweets(items) {
  const ids = new Set();
  for (const it of items) for (const m of JSON.stringify(it.data || {}).concat(it.url).matchAll(/(?:x|twitter)\.com\/\w+\/status\/(\d{8,25})/g)) ids.add(m[1]);
  const out = [];
  for (const id of [...ids].slice(0, 20)) {
    try {
      const d = await get(`https://cdn.syndication.twimg.com/tweet-result?id=${id}&token=a`, { type: 'json' });
      out.push({ id: 'x:' + id, type: 'tweet', source: 'X: @' + d.user.screen_name, title: d.text.slice(0, 160), url: `https://x.com/${d.user.screen_name}/status/${id}`, at: d.created_at, data: { handle: d.user.screen_name, name: d.user.name, avatar: d.user.profile_image_url_https, text: d.text, likes: d.favorite_count, media: d.photos?.[0]?.url || d.video?.poster || null } });
    } catch {}
  }
  return out;
}

export async function runWire({ store, env = {}, now = Date.now() }) {
  const state = (await store.get('wire/state', { type: 'json' }).catch(() => null)) || {};
  const status = { at: new Date(now).toISOString(), ok: [], failed: {} };
  const found = [];
  await Promise.all(Object.entries(collectors).map(async ([name, fn]) => {
    try {
      const r = await fn(state, env, store);
      const items = Array.isArray(r) ? r : r.items;
      if (!Array.isArray(r)) Object.assign(state, r.state);
      found.push(...items); status.ok.push(name);
    } catch (e) { status.failed[name] = String(e.message || e).slice(0, 200); }
  }));
  // reader submissions can carry X links too
  const { blobs } = await store.list({ prefix: 'inbox/' }).catch(() => ({ blobs: [] }));
  const inbox = (await Promise.all(blobs.slice(-50).map((b) => store.get(b.key, { type: 'json' }).catch(() => null)))).filter((x) => x && !x.done);
  found.push(...await hydrateTweets([...found.filter((f) => f.type === 'discord'), ...inbox.map((i) => ({ url: i.url, data: {} }))]));
  try { await getPulse(store); status.ok.push('pulse'); } catch (e) { status.failed.pulse = String(e.message); }

  const wire = (await store.get('wire/items', { type: 'json' }).catch(() => null)) || [];
  const known = new Set(wire.map((w) => w.id));
  const first = !state.seeded; // the first run records what already exists without flagging it as news
  const seen = new Date(now).toISOString();
  let added = 0;
  for (const it of found) if (!known.has(it.id)) { wire.unshift({ ...it, seen, backfill: first || undefined }); known.add(it.id); added++; }
  state.seeded = true;
  status.added = added;
  await store.setJSON('wire/items', wire.slice(0, KEEP));
  await store.setJSON('wire/state', state);
  await store.setJSON('wire/status', status);
  return status;
}

export default async () => {
  const status = await runWire({ store: getStore({ name: 'propagator', consistency: 'strong' }), env: process.env });
  console.log('wire', JSON.stringify(status));
};

export const config = { schedule: '@hourly' };
