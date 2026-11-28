# Helpers for writing back issues (one per month before the weekly issues began).
# Each month file defines ISSUE with plain English strings; this wraps them into the seed format.
import json, calendar

X = 'https://x.com/get_optimum/status/'

def en(v):
    return {'en': v}

def story(tag, title, body, sources, claim=None, art=None):
    s = {'tag': tag, 'title': en(title), 'body': en(body), 'sources': sources}
    if claim: s['claim'] = claim
    if art: s['art'] = art
    return s

def event(id, start, city, name, url, kind, what, src, end=None):
    e = {'id': id, 'start': start, 'city': city, 'name': name, 'url': url, 'kind': kind, 'what': en(what), 'src': src}
    if end: e['end'] = end
    return e

def claim(text, status, note):
    return {'claim': en(text), 'status': status, 'note': en(note)}

def write(month, title, dek, note, tldr, stories, **extra):
    y, m = map(int, month.split('-'))
    last = calendar.monthrange(y, m)[1]
    first = extra.pop('first', f'{month}-01')
    end = extra.pop('last', f'{month}-{last:02d}')
    issue = {
        'kind': 'weekly', 'id': month, 'back': True, 'status': 'published', 'date': end, 'range': [first, end],
        'title': en(title), 'dek': en(dek), 'note': en(note), 'tldr': en(tldr), 'stories': stories,
        'cover': {'type': 'network', 'seed': 'cover-' + month, 'nodes': 40},
    }
    for k in ('spotlight',):
        if k in extra and extra[k]:
            s = extra[k]; s['title'] = en(s['title']); s['body'] = en(s['body'])
    if 'video' in extra and extra['video'] and isinstance(extra['video'].get('why'), str):
        extra['video']['why'] = en(extra['video']['why'])
    for k in ('takePart',):
        if k in extra: extra[k] = [{'text': en(t), 'url': u} for t, u in extra[k]]
    if 'roles' in extra and extra['roles'] and isinstance(extra['roles'].get('note'), str):
        extra['roles']['note'] = en(extra['roles']['note'])
    issue.update({k: v for k, v in extra.items() if v})
    with open(f'content/seed/back-{month}.json', 'w') as f:
        json.dump(issue, f, ensure_ascii=False, indent=1)
    words = len(json.dumps([note, tldr, [s['body']['en'] for s in stories]]).split())
    print(month, len(stories), 'stories', words, 'words')

def month_roles(month, extra_note='', until=None):
    """Every role call posted in #role-announcements during the month, merged into one list."""
    import glob
    calls = [json.load(open(f)) for f in sorted(glob.glob(f'content/roles/{month}-*.json'))]
    if until: calls = [c for c in calls if c['date'] <= until]
    if not calls: return None
    items = []
    for c in calls:
        for g in c['groups']:
            items += [{'name': n, 'role': g['role']} for n in g['names']]
    days = [str(int(c['date'][8:])) for c in calls]
    who = sorted({c['by'] for c in calls})
    dates = ', '.join(days[:-1]) + ' and ' + days[-1] if len(days) > 1 else days[0]
    mname = calendar.month_name[int(month[5:])]
    note = f'{len(calls)} role calls in {mname}, posted on {dates} {mname} by {" and ".join(who)} in #role-announcements. Every member named has a page on the register.'
    if extra_note: note += ' ' + extra_note
    return {'items': items, 'note': note, 'src': ['Optimum Discord, #role-announcements', 'https://discord.gg/getoptimum']}
