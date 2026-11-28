// Email through Resend (https://resend.com). Nothing is sent unless RESEND_API_KEY and MAIL_FROM are set.
import { UI, L } from './t.mjs';
import { href, SITE, fmtDate } from './render.mjs';

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const mailReady = (env) => Boolean(env.RESEND_API_KEY && env.MAIL_FROM);

async function resend(env, path, body) {
  const r = await fetch('https://api.resend.com' + path, { method: 'POST', headers: { authorization: 'Bearer ' + env.RESEND_API_KEY, 'content-type': 'application/json' }, body: JSON.stringify(body) });
  if (!r.ok) throw new Error('resend ' + r.status + ' ' + (await r.text()).slice(0, 200));
  return r.json();
}

const shell = (lang, inner, unsub) => `<!doctype html><html lang="${lang}"><body style="margin:0;background:#f0f2f4;font:16px/1.6 -apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#16181a">
<div style="max-width:600px;margin:0 auto;padding:28px 20px">
<p style="font-weight:700;font-size:20px;letter-spacing:-.02em;margin:0 0 20px">Propagator</p>
<div style="background:#fff;border-radius:14px;padding:24px 22px">${inner}</div>
<p style="font-size:12px;color:#6a757f;margin:18px 4px 0">${esc(UI(lang).footer)}${unsub ? ` <a href="${unsub}" style="color:#6a757f">Unsubscribe</a>` : ''}</p>
</div></body></html>`;

export async function sendConfirm(env, sub) {
  const T = UI(sub.lang);
  const link = `${env.URL || SITE}/api/subscribe/confirm?t=${sub.token}`;
  return resend(env, '/emails', {
    from: env.MAIL_FROM, to: sub.email, subject: T.sub.title,
    html: shell(sub.lang, `<p style="margin:0 0 16px">${esc(T.sub.dek)}</p><p style="margin:0"><a href="${link}" style="display:inline-block;background:#16181a;color:#fff;text-decoration:none;font-weight:600;padding:12px 18px;border-radius:10px">${esc(T.sub.send)}</a></p>`),
  });
}

export function weeklyEmail(env, issue, lang, token) {
  const T = UI(lang), site = env.URL || SITE;
  const url = site + href(lang, `/weekly/${issue.id}/`);
  const unsub = `${site}/api/unsubscribe?t=${token}`;
  const stories = issue.stories.slice(0, 6).map((s) => `<h3 style="font-size:17px;margin:18px 0 4px">${esc(L(s.title, lang))}</h3><p style="margin:0;color:#474e55">${esc(L(s.body, lang))}</p>`).join('');
  const tldr = issue.tldr ? `<ul style="padding-left:18px;margin:0 0 8px">${L(issue.tldr, lang).map((x) => `<li style="margin:4px 0">${esc(x)}</li>`).join('')}</ul>` : '';
  return {
    from: env.MAIL_FROM, to: null,
    subject: `${T.issue(issue.id)}: ${L(issue.title, lang)}`,
    headers: { 'List-Unsubscribe': `<${unsub}>`, 'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click' },
    html: shell(lang, `<p style="font-size:13px;color:#6a757f;margin:0 0 6px">${esc(T.issue(issue.id))}, ${esc(fmtDate(lang, issue.date))}</p><h1 style="font-size:26px;line-height:1.15;letter-spacing:-.02em;margin:0 0 10px">${esc(L(issue.title, lang))}</h1><p style="color:#474e55;margin:0 0 14px">${esc(L(issue.dek, lang))}</p>${tldr}${stories}<p style="margin:22px 0 0"><a href="${url}" style="display:inline-block;background:#16181a;color:#fff;text-decoration:none;font-weight:600;padding:12px 18px;border-radius:10px">${esc(T.readIssue(issue.id))}</a></p>`, unsub),
  };
}

// Send a published weekly issue to every confirmed subscriber in their own language, 100 per request.
export async function sendWeekly(env, store, issue) {
  if (!mailReady(env)) return { sent: 0, skipped: 'mail not configured' };
  const { blobs } = await store.list({ prefix: 'sub/' });
  const subs = (await Promise.all(blobs.map((b) => store.get(b.key, { type: 'json' })))).filter((s) => s && s.status === 'active');
  let sent = 0;
  for (let i = 0; i < subs.length; i += 100) {
    const batch = subs.slice(i, i + 100).map((s) => ({ ...weeklyEmail(env, issue, s.lang, s.token), to: s.email }));
    await resend(env, '/emails/batch', batch);
    sent += batch.length;
  }
  return { sent };
}

// a note to the editor when a reader sends something in (EDITOR_EMAIL); the text is the reader's, so it is escaped
export async function notifyEditor(env, item) {
  if (!mailReady(env) || !env.EDITOR_EMAIL) return;
  const kinds = UI('en').kinds;
  const inner = `<p style="margin:0 0 12px"><b>${esc(kinds[item.kind] || item.kind)}</b> from ${esc(item.name || 'someone')}</p><p style="margin:0 0 12px"><a href="${esc(item.url)}">${esc(item.url)}</a></p>${item.note ? `<p style="margin:0 0 12px;white-space:pre-wrap">${esc(item.note)}</p>` : ''}<p style="margin:0;color:#6a757f;font-size:13px">Sent ${esc(item.at)} in ${esc(item.lang)}. It is in the editor inbox until marked done.</p>`;
  await resend(env, '/emails', { from: env.MAIL_FROM, to: [env.EDITOR_EMAIL], subject: `Propagator: ${kinds[item.kind] || 'submission'}`, html: shell('en', inner) });
}
