// The weekly run. Keeps the repository in step with the live site and draws every image the week needs.
//   node scripts/weekly.mjs            (needs network; then run the tests, commit and push)
// 1. role calls pasted on the live site (/api/rolecalls) are written to content/roles/<date>.json
// 2. the site is rebuilt, and share cards are drawn for members who have none yet
// 3. cards whose owners added a picture (/api/claims) are drawn again with the picture, as m-<slug>-p<version>.jpg
// 4. every role call without a weekly image gets one (public/og/class-<id>.jpg), and the front page image is redrawn
// 5. weekly-report.md lists what changed and the post drafts for X
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const LIVE = 'https://propagator.news';
const ROOT = new URL('../', import.meta.url).pathname;
const run = (...args) => execFileSync('node', args, { cwd: ROOT, stdio: ['ignore', 'pipe', 'inherit'] }).toString().trim();
const report = [];

// 1. role calls
const pasted = await fetch(LIVE + '/api/rolecalls').then((r) => (r.ok ? r.json() : [])).catch(() => []);
const have = new Set((await readdir(ROOT + 'content/roles')).map((f) => f.replace(/\.json$/, '')));
const added = [];
for (const c of pasted) if (!have.has(c.id)) { await writeFile(`${ROOT}content/roles/${c.id}.json`, JSON.stringify(c, null, 2) + '\n'); added.push(c.id); }
report.push(`Role calls added to the repository: ${added.length ? added.join(', ') : 'none'}`);

// 2. rebuild, then cards for members without one
run('scripts/build.mjs');
const { register } = await import(ROOT + 'lib/register.mjs?' + Date.now());
const reg = await register(null);
const missing = reg.members.filter((m) => !existsSync(`${ROOT}public/og/m-${m.slug}.jpg`)).map((m) => m.slug);
if (missing.length) run('scripts/og-members.mjs', 'public/og', ...missing);
report.push(`Member cards drawn: ${missing.length}`);

// 3. picture cards
const claims = await (await fetch(LIVE + '/api/claims')).json();
const pics = Object.entries(claims).filter(([slug, c]) => c.photo && reg.bySlug.has(slug) && !existsSync(`${ROOT}public/og/m-${slug}-p${c.v}.jpg`)).map(([slug]) => slug);
if (pics.length) run('scripts/og-members.mjs', '--claimed', 'public/og', ...pics);
report.push(`Picture cards drawn: ${pics.length ? pics.join(', ') : 'none'} (${Object.keys(claims).length} cards linked in all)`);

// 4. weekly images and the front page image
const classes = reg.calls.filter((c) => !existsSync(`${ROOT}public/og/class-${c.id}.jpg`)).map((c) => c.id);
if (classes.length) run('scripts/og-class.mjs', ...classes);
run('scripts/og-home.mjs');
run('scripts/build.mjs');
report.push(`Role call images drawn: ${classes.length ? classes.join(', ') : 'none'}`);

// 5. drafts for X
const c = reg.calls[0];
const names = c.groups.flatMap((g) => g.names).map((n) => n.replace(/[^\p{L}\p{N}\s._|!-]/gu, '').replace(/\s*\|?\s*MUM.*$/i, '').trim());
const total = names.length, head = c.groups.length === 1 ? `${total} new ${c.groups[0].role}` : `${total} role upgrades`;
report.push('', `Latest role call: ${c.id} (${c.groups.map((g) => `${g.names.length} ${g.role}`).join(', ')})`, `Image: public/og/class-${c.id}.jpg`, '', 'Draft for X:', '',
  `${head} in the @get_optimum community this week`, '', names.join(', '), '', 'Every name now has its own page and card. Find yours:', '', `propagator.news/class/${c.id}/`);
await writeFile(ROOT + 'weekly-report.md', report.join('\n') + '\n');
console.log(report.join('\n'));
