(function () {
  'use strict';
  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // theme: dark unless the reader picks light
  var themeBtn = document.querySelector('.theme');
  if (themeBtn) themeBtn.addEventListener('click', function () {
    var dark = root.getAttribute('data-theme') !== 'light';
    var next = dark ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('pg-theme', next); } catch (e) {}
    document.querySelectorAll('.race').forEach(function (r) { if (r._redraw) r._redraw(); });
  });

  // the slot race: the same 96 nodes receive one block over mump2p and over gossipsub.
  // Arrival times follow each route's measured spread (first node to the 95th percentile node), slowed 8 times.
  var SLOW = 8;
  function seeded(n) { var s = 7, out = []; for (var i = 0; i < n; i++) { s = (s * 16807) % 2147483647; out.push((s - 1) / 2147483646); } return out; }
  document.querySelectorAll('.race').forEach(function (race) {
    var mump = parseFloat(race.dataset.mump), lib = parseFloat(race.dataset.lib);
    if (!(mump > 0 && lib > 0)) return;
    var lanes = [
      { key: 'm', spread: mump, canvas: race.querySelector('canvas[data-lane="m"]'), out: race.querySelector('[data-ms="m"]') },
      { key: 'l', spread: lib, canvas: race.querySelector('canvas[data-lane="l"]'), out: race.querySelector('[data-ms="l"]') },
    ];
    var N = 96, u = seeded(N);
    // node i sits at a fixed spot; its arrival is spread * (u/0.95)^1.5, so 95% of nodes have it by "spread"
    var arrive = function (spread) { return u.map(function (x) { return spread * Math.pow(x / 0.95, 1.5); }); };
    lanes.forEach(function (l) { l.t = arrive(l.spread); });
    var end = lib * 1.12, t0 = 0, raf = 0, visible = false;
    function colors() { var cs = getComputedStyle(root); return { pkt: cs.getPropertyValue('--pkt').trim(), gos: cs.getPropertyValue('--gossip').trim(), line: cs.getPropertyValue('--line-2').trim(), soft: cs.getPropertyValue('--soft').trim() }; }
    var C = colors();
    function draw(ms) {
      lanes.forEach(function (l) {
        var cv = l.canvas, dpr = Math.min(2, window.devicePixelRatio || 1), w = cv.clientWidth, h = cv.clientHeight;
        if (!w) return;
        if (cv.width !== Math.round(w * dpr)) { cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); }
        var g = cv.getContext('2d'); g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, w, h);
        // x axis is time: 0 at the left, the slower route's p95 at the right edge
        var span = lib, rows = 3, pad = 8;
        for (var i = 0; i < N; i++) {
          var at = l.t[i], x = pad + Math.min(1, at / span) * (w - pad * 2), y = pad + ((i % rows) + 0.5) * ((h - pad * 2) / rows);
          var got = at <= ms;
          g.beginPath(); g.arc(x, y + ((i * 37) % 7) - 3, got ? 3.2 : 2.2, 0, 6.2832);
          if (got) { g.fillStyle = l.key === 'm' ? C.pkt : C.gos; g.fill(); }
          else { g.strokeStyle = C.line; g.lineWidth = 1; g.stroke(); }
        }
        // the wavefront
        var fx = pad + Math.min(1, Math.min(ms, l.spread) / span) * (w - pad * 2);
        if (ms > 0 && ms < end) { g.fillStyle = l.key === 'm' ? C.pkt : C.soft; g.globalAlpha = 0.18; g.fillRect(0, 0, fx, h); g.globalAlpha = 1; }
        var shown = Math.min(ms, l.spread);
        if (l.out) l.out.textContent = Math.round(shown).toLocaleString(root.lang === 'tr' ? 'tr-TR' : 'en-GB');
      });
      race.classList.toggle('done', ms >= lib);
    }
    function frame(now) {
      if (!t0) t0 = now;
      var ms = (now - t0) / SLOW;
      draw(ms);
      if (ms < end) { raf = requestAnimationFrame(frame); }
      else { t0 = 0; setTimeout(function () { if (visible) raf = requestAnimationFrame(frame); }, 2600); }
    }
    race._redraw = function () { C = colors(); if (reduce) draw(end); };
    if (reduce || !('IntersectionObserver' in window)) { draw(end); window.addEventListener('resize', function () { draw(end); }); return; }
    draw(0);
    new IntersectionObserver(function (es) {
      es.forEach(function (e) { visible = e.isIntersecting; cancelAnimationFrame(raf); if (visible) { t0 = 0; raf = requestAnimationFrame(frame); } });
    }, { threshold: 0.3 }).observe(race);
  });

  // YouTube: load the player only when asked, from the privacy enhanced domain
  document.querySelectorAll('.yt[data-yt]').forEach(function (b) {
    b.addEventListener('click', function () {
      var f = document.createElement('iframe');
      f.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(b.dataset.yt) + '?autoplay=1&rel=0';
      f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen'; f.title = b.getAttribute('aria-label') || 'Video';
      var box = document.createElement('div'); box.className = 'yt'; box.appendChild(f); b.replaceWith(box);
    });
  });

  // member directory: search by name and filter by role, from the box on the front page too (?q=)
  var dq = document.querySelector('[data-dir-q]');
  if (dq) {
    var rows = [].slice.call(document.querySelectorAll('.dir li')), empty = document.querySelector('.dir-empty'), role = '';
    var fold = function (s) { return s.normalize('NFKC').toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, ''); };
    rows.forEach(function (li) { li._n = fold(li.dataset.n || ''); });
    var apply = function () {
      var q = fold(dq.value.trim()), shown = 0;
      rows.forEach(function (li) { var ok = (!q || li._n.indexOf(q) !== -1) && (!role || li.dataset.role === role); li.hidden = !ok; if (ok) shown++; });
      if (empty) empty.hidden = shown > 0;
    };
    try { var q0 = new URLSearchParams(location.search).get('q'); if (q0) dq.value = q0; } catch (e) {}
    dq.addEventListener('input', apply);
    document.querySelectorAll('.dir-tools .chip').forEach(function (c, i, all) {
      c.addEventListener('click', function () { all.forEach(function (x) { x.setAttribute('aria-pressed', String(x === c)); }); role = c.dataset.role; apply(); });
    });
    apply();
  }

  // builders filter
  var chips = document.querySelectorAll('.filters .chip');
  chips.forEach(function (c) {
    c.addEventListener('click', function () {
      chips.forEach(function (x) { x.setAttribute('aria-pressed', String(x === c)); });
      var f = c.dataset.f;
      document.querySelectorAll('.b-grid-all .b-card').forEach(function (card) { card.hidden = Boolean(f) && card.dataset.kind !== f; });
    });
  });

  // submissions
  var form = document.querySelector('form.submit');
  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault();
    var msg = form.querySelector('.form-msg'), btn = form.querySelector('button[type="submit"]');
    var data = Object.fromEntries(new FormData(form).entries());
    btn.disabled = true;
    fetch('/api/submit', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(data) })
      .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
      .then(function (r) { msg.textContent = r.ok ? form.dataset.ok : (r.j && r.j.error) || form.dataset.err; if (r.ok) form.reset(); })
      .catch(function () { msg.textContent = form.dataset.err; })
      .finally(function () { btn.disabled = false; });
  });

  // email subscription
  document.querySelectorAll('form.sub-form').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var msg = f.querySelector('.form-msg'), btn = f.querySelector('button[type="submit"]');
      var data = Object.fromEntries(new FormData(f).entries());
      btn.disabled = true;
      fetch('/api/subscribe', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(data) })
        .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
        .then(function (r) { msg.textContent = r.ok ? (r.j.confirm ? f.dataset.ok : f.dataset.queued) : f.dataset.err; if (r.ok) f.reset(); })
        .catch(function () { msg.textContent = f.dataset.err; })
        .finally(function () { btn.disabled = false; });
    });
  });

  // table of contents follows the reader
  var toc = document.querySelectorAll('.toc a[href^="#"]');
  if (toc.length && 'IntersectionObserver' in window) {
    var map = {}; toc.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting && map[e.target.id]) { toc.forEach(function (a) { a.classList.remove('on'); }); map[e.target.id].classList.add('on'); } });
    }, { rootMargin: '-20% 0px -70% 0px' });
    Object.keys(map).forEach(function (id) { var el = document.getElementById(id); if (el) io.observe(el); });
  }
})();
