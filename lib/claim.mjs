// Members claim their own card with Discord. Nothing is taken from Discord unless the member signs in:
// the sign in asks only for "identify" and "guilds.members.read", which lets us read the member's name and picture
// in the Optimum server. The name must match the card; the picture is copied to our store so the page never loads
// anything from Discord. We keep a keyed hash of the Discord ID (to know who may remove the picture), never the ID.
import crypto from 'node:crypto';
import { keyOf } from './register.mjs';

export const GUILD = '1354818163879182519'; // the Optimum Discord server
const API = 'https://discord.com/api/v10';
const CDN = 'https://cdn.discordapp.com';

export const discordReady = (env) => Boolean(env.DISCORD_CLIENT_ID && env.DISCORD_CLIENT_SECRET);
const secretOf = (env) => `${env.DISCORD_CLIENT_SECRET}|${env.RATE_SALT || ''}`;
const sign = (env, data) => crypto.createHmac('sha256', secretOf(env)).update(data).digest('base64url');
const same = (a, b) => { const x = Buffer.from(String(a)), y = Buffer.from(String(b)); return x.length === y.length && crypto.timingSafeEqual(x, y); };

export function makeState(env, data, now) {
  const p = Buffer.from(JSON.stringify({ ...data, exp: now + 600e3 })).toString('base64url');
  return p + '.' + sign(env, p);
}
export function readState(env, s, now) {
  const [p, sig] = String(s || '').split('.');
  if (!p || !sig || !same(sig, sign(env, p))) return null;
  try { const d = JSON.parse(Buffer.from(p, 'base64url').toString()); return d.exp > now ? d : null; } catch { return null; }
}
export const idHash = (env, id) => crypto.createHmac('sha256', secretOf(env)).update('discord:' + id).digest('hex').slice(0, 32);

export async function getClaims(store) { return (store && (await store.get('claims/index', { type: 'json' }).catch(() => null))) || {}; }

// the card matches when the member's name in the Optimum server (or their Discord display name) folds to one of
// the names the card was announced under
export function nameMatches(m, names) {
  const keys = new Set(m.names.map(keyOf));
  return names.filter(Boolean).some((n) => keys.has(keyOf(n)));
}

export function authorizeUrl(env, redirect, state) {
  const q = new URLSearchParams({ client_id: env.DISCORD_CLIENT_ID, response_type: 'code', redirect_uri: redirect, scope: 'identify guilds.members.read', state, prompt: 'consent' });
  return 'https://discord.com/oauth2/authorize?' + q;
}

// code -> { user, member } ; member is null when the account is not in the Optimum server
export async function discordProfile(env, code, redirect, fetchImpl) {
  const t = await fetchImpl(API + '/oauth2/token', { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ client_id: env.DISCORD_CLIENT_ID, client_secret: env.DISCORD_CLIENT_SECRET, grant_type: 'authorization_code', code, redirect_uri: redirect }) });
  if (!t.ok) throw new Error('token ' + t.status);
  const { access_token: tok } = await t.json();
  const h = { authorization: 'Bearer ' + tok };
  const u = await fetchImpl(API + '/users/@me', { headers: h });
  if (!u.ok) throw new Error('user ' + u.status);
  const user = await u.json();
  const g = await fetchImpl(`${API}/users/@me/guilds/${GUILD}/member`, { headers: h });
  const member = g.ok ? await g.json() : null;
  // the token is not kept; revoke it so it cannot be used again
  fetchImpl(API + '/oauth2/token/revoke', { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ client_id: env.DISCORD_CLIENT_ID, client_secret: env.DISCORD_CLIENT_SECRET, token: tok }) }).catch(() => {});
  return { user, member };
}

// the server picture when the member set one, otherwise the account picture; PNG, 256 px
export async function fetchAvatar(user, member, fetchImpl) {
  const url = member?.avatar ? `${CDN}/guilds/${GUILD}/users/${user.id}/avatars/${member.avatar}.png?size=256`
    : user.avatar ? `${CDN}/avatars/${user.id}/${user.avatar}.png?size=256` : null;
  if (!url) return null;
  const r = await fetchImpl(url);
  if (!r.ok) return null;
  const buf = await r.arrayBuffer();
  return buf.byteLength < 1.5e6 && new Uint8Array(buf.slice(0, 4)).join() === '137,80,78,71' ? buf : null;
}

// the picture types we accept and serve, told by their first bytes rather than by name
export function imageType(buf) {
  const b = new Uint8Array(buf.slice(0, 12));
  if (b[0] === 137 && b[1] === 80 && b[2] === 78 && b[3] === 71) return 'image/png';
  if (b[0] === 255 && b[1] === 216 && b[2] === 255) return 'image/jpeg';
  if (String.fromCharCode(...b.slice(0, 4)) === 'RIFF' && String.fromCharCode(...b.slice(8, 12)) === 'WEBP') return 'image/webp';
  return null;
}
