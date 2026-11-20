# Share image: python3 scripts/og.py  -> public/og.png (1200x630)
from playwright.sync_api import sync_playwright
import random
random.seed(7)
def lane(spread, lib, color):
    dots = []
    for i in range(96):
        u = random.random()
        at = spread * (u / 0.95) ** 1.5
        x = 8 + min(1, at / lib) * 784
        y = 10 + (i % 3 + .5) * 18 + (i * 37 % 7) - 3
        dots.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="4" fill="{color}"/>')
    return ''.join(dots)
random.seed(7); m = lane(182.2, 391.9, '#b87cff')
random.seed(7); l = lane(391.9, 391.9, '#6a757f')
html = f'''<html><head><link href="https://fonts.googleapis.com/css2?family=Geist:wght@500;700&family=Geist+Mono:wght@500&display=swap" rel="stylesheet">
<style>body{{margin:0;width:1200px;height:630px;background:#16181a;color:#f0f2f4;font-family:Geist;display:flex;flex-direction:column;justify-content:space-between;padding:64px 72px;box-sizing:border-box}}
.b{{display:flex;align-items:center;gap:18px}} .n{{font-size:64px;font-weight:700;letter-spacing:-0.04em}} .t{{font-size:30px;color:#bcc0c3;margin-top:14px;max-width:900px;line-height:1.3}}
.lanes{{display:grid;gap:14px}} .lane{{display:grid;grid-template-columns:130px 800px 1fr;align-items:center;gap:20px;font-family:'Geist Mono';font-size:22px;color:#8d9ca9}}
.track{{background:#1e2124;border-radius:12px;box-shadow:inset 0 0 0 1px #2c3135}} .m{{color:#c59bff}} b{{color:#f0f2f4;font-weight:500}}</style></head><body>
<div><div class="b"><svg width="58" height="58" viewBox="0 0 32 32"><rect x="2" y="4" width="9" height="9" rx="2" fill="#f0f2f4"/><rect x="2" y="19" width="9" height="9" rx="2" fill="#f0f2f4" opacity=".55"/><rect x="13" y="11.5" width="9" height="9" rx="2" fill="#f0f2f4" opacity=".8"/><rect x="21" y="9" width="9" height="14" rx="2.5" fill="#b87cff"/></svg><span class="n">Propagator</span></div>
<div class="t">Daily briefs, a weekly issue and live network numbers for the Optimum community.</div></div>
<div class="lanes"><div class="lane"><span class="m">mump2p</span><svg class="track" width="800" height="72">{m}</svg><span><b class="m">182</b> ms</span></div>
<div class="lane"><span>gossipsub</span><svg class="track" width="800" height="72">{l}</svg><span><b>392</b> ms</span></div></div>
</body></html>'''
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width': 1200, 'height': 630})
    pg.set_content(html); pg.wait_for_timeout(1500); pg.screenshot(path='public/og.png'); b.close()
print('og ok')
