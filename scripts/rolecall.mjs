// Role calls read straight from the Optimum Discord #role-announcements channel.
//   node scripts/rolecall.mjs messages.json          (writes new role calls to content/roles/<date>.json)
//   node scripts/rolecall.mjs messages.json --check  (writes nothing, only reports)
// messages.json is a list of { id, t, u, c } read from the channel page in the browser:
//   id = Discord message id, t = the message time (ISO, from <time datetime>), u = author, c = message text.
// The date of a role call is the day in Istanbul when it was posted, the same rule the register has always used.
// A role call that is already in content/roles is never overwritten; if its names differ, that is reported.
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { parseAnnouncement, keyOf } from '../lib/register.mjs';

const ROOT = new URL('../', import.meta.url).pathname;
const GUILD = '1354818163879182519', CHANNEL = '1479411441030402068';
const [file, flag] = process.argv.slice(2);
if (!file) { console.error('usage: node scripts/rolecall.mjs messages.json [--check]'); process.exit(2); }
const check = flag === '--check';
const msgs = JSON.parse(await readFile(file, 'utf8'));

const local = (iso) => {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Istanbul', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
    .formatToParts(new Date(iso)).map((x) => [x.type, x.value]));
  return { date: `${p.year}-${p.month}-${p.day}`, stamp: `${p.day}.${p.month}.${p.year} ${p.hour}:${p.minute}` };
};
const clean = (c) => String(c).split('\n')
  .filter((l) => !/^\d{1,2}\s+\S+\s+\d{4}\s+\S+\s+\d{1,2}:\d{2}$/.test(l.trim())) // the edited date Discord prints under an edited post
  .map((l) => l.replace(/\s*\((düzenlendi|edited)\)\s*$/i, ''))
  .join('\n');
const flat = (g) => g.flatMap((x) => x.names.map((n) => `${x.role}:${keyOf(n)}`)).sort().join('|'); // spelling of emoji and spaces aside

const have = new Map();
for (const f of await readdir(ROOT + 'content/roles')) have.set(f.replace(/\.json$/, ''), JSON.parse(await readFile(`${ROOT}content/roles/${f}`, 'utf8')));
const near = (date) => [...have.keys()].find((d) => Math.abs(Date.parse(d) - Date.parse(date)) <= 86400000);

const out = { added: [], same: [], differs: [], skipped: [] };
for (const m of msgs) {
  const text = clean(m.c);
  if (!/upgraded to|role upgrades|@chronicler|@optimized/i.test(text)) { out.skipped.push(m.id); continue; }
  const { date, stamp } = local(m.t);
  const by = /^flash/i.test(String(m.u || '').trim()) ? 'Flash' : (String(m.u || '').trim().match(/^[\w.]+/) || ['Flash'])[0];
  const call = parseAnnouncement(`${by}, — ${stamp}\n${text}`, { date, by });
  call.src = [`${by} in #role-announcements, Optimum Discord, ${date}`, `https://discord.com/channels/${GUILD}/${CHANNEL}/${m.id}`];
  const n = call.groups.reduce((a, g) => a + g.names.length, 0);
  if (!n) { out.skipped.push(`${m.id} (no names found)`); continue; }
  const old = have.get(date) || have.get(near(date));
  if (old) { (flat(old.groups) === flat(call.groups) ? out.same : out.differs).push(`${old.id} (${n} names in the post)`); continue; }
  if (!check) await writeFile(`${ROOT}content/roles/${date}.json`, JSON.stringify(call, null, 2) + '\n');
  have.set(date, call);
  out.added.push(`${date}: ${call.groups.map((g) => `${g.names.length} ${g.role}`).join(', ')}`);
}
console.log(JSON.stringify(out, null, 2));
