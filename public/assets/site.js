(function () {
  'use strict';
  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // theme: the system setting, unless the reader picked one
  var themeBtn = document.querySelector('.theme');
  if (themeBtn) themeBtn.addEventListener('click', function () {
    var set = root.getAttribute('data-theme');
    var dark = set ? set === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
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
    var list = document.querySelector('.dir'), rows = [].slice.call(list.children), empty = document.querySelector('.dir-empty'), status = document.querySelector('.dir-status');
    var sortSel = document.querySelector('[data-dir-sort]'), roleChips = [].slice.call(document.querySelectorAll('.dir-tools .chip')), role = '';
    var fold = function (s) { return s.normalize('NFKC').toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, ''); };
    var nf = new Intl.NumberFormat(status.dataset.lang), total = Number(status.dataset.total), allText = status.innerHTML;
    rows.forEach(function (li) { li._n = fold(li.dataset.n || ''); var a = fold(li.dataset.a || ''); li._a = a.replace(/^[^\p{L}\p{N}]+/u, '') || a; });
    var sorters = {
      new: function (a, b) { return a.dataset.s < b.dataset.s ? 1 : a.dataset.s > b.dataset.s ? -1 : a._a.localeCompare(b._a); },
      old: function (a, b) { return Number(a.dataset.o) - Number(b.dataset.o); },
      az: function (a, b) { return a._a.localeCompare(b._a, undefined, { sensitivity: 'base', numeric: true }); }
    };
    var esc = function (t) { return t.replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
    // the search, the role and the order live in the address, so the back button from a profile returns to the same list
    var save = function () {
      var p = new URLSearchParams();
      if (dq.value.trim()) p.set('q', dq.value.trim());
      if (role) p.set('role', role);
      if (sortSel.value !== 'new') p.set('sort', sortSel.value);
      var qs = p.toString();
      try { history.replaceState(null, '', location.pathname + (qs ? '?' + qs : '')); } catch (e) {}
    };
    var apply = function (keep) {
      var q = fold(dq.value.trim()), shown = 0;
      rows.sort(sorters[sortSel.value] || sorters.new).forEach(function (li) {
        var ok = (!q || li._n.indexOf(q) !== -1) && (!role || li.dataset.role === role);
        li.hidden = !ok; if (ok) shown++; list.appendChild(li);
      });
      empty.hidden = shown > 0;
      var filtered = q || role;
      var text = filtered ? status.dataset.showing.replace('{n}', '<b>' + nf.format(shown) + '</b>').replace('{t}', nf.format(total)) : allText;
      var tags = '';
      if (role) { var rc = roleChips.filter(function (c) { return c.dataset.role === role; })[0]; tags += '<span class="ds-tag">' + esc(rc.firstChild.textContent.trim()) + '</span>'; }
      if (q) tags += '<span class="ds-tag">' + esc(status.dataset.for.replace('{q}', dq.value.trim())) + '</span>';
      status.innerHTML = text + tags;
      status.classList.toggle('is-filtered', Boolean(filtered));
      if (!keep) save();
    };
    var setRole = function (r) { role = r; roleChips.forEach(function (x) { x.setAttribute('aria-pressed', String(x.dataset.role === r)); }); };
    try {
      var p0 = new URLSearchParams(location.search);
      if (p0.get('q')) dq.value = p0.get('q');
      if (p0.get('role') && roleChips.some(function (c) { return c.dataset.role === p0.get('role'); })) setRole(p0.get('role'));
      if (sorters[p0.get('sort')]) sortSel.value = p0.get('sort');
    } catch (e) {}
    dq.addEventListener('input', function () { apply(); });
    sortSel.addEventListener('change', function () { apply(); });
    roleChips.forEach(function (c) { c.addEventListener('click', function () { setRole(c.dataset.role); apply(); }); });
    document.querySelector('[data-dir-clear]').addEventListener('click', function () { dq.value = ''; setRole(''); sortSel.value = 'new'; apply(); dq.focus(); });
    apply(true);
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

  // result of the Discord sign in on a member page: show the message once, then drop it from the address
  var cm = document.querySelector('.own-msg'), pick = document.querySelector('.own-pick');
  var say = function (r) { if (!cm || !cm.dataset[r]) return; cm.textContent = cm.dataset[r]; cm.hidden = false; cm.className = 'own-msg ' + (/^(ok|removed|nophoto|upload|uploaded)$/.test(r) ? 'good' : 'bad'); };
  if (cm) {
    try {
      var r = new URLSearchParams(location.search).get('claim');
      if (r && /^[a-z]+$/.test(r) && cm.dataset[r]) {
        say(r);
        if (r === 'upload' && pick) { pick.hidden = false; pick.scrollIntoView({ block: 'center', behavior: reduce ? 'auto' : 'smooth' }); pick.querySelector('input').focus(); }
        history.replaceState(null, '', location.pathname + location.hash);
      }
    } catch (e) {}
  }
  // the owner's own picture: choose, place and zoom it in a 3:4 frame, see it on the card, then save a 600x800 JPEG
  if (pick && window.createImageBitmap) (function () {
    var input = pick.querySelector('#own-file'), crop = pick.querySelector('.crop'), frame = pick.querySelector('.crop-frame');
    var cv = pick.querySelector('canvas'), ctx = cv.getContext('2d'), zoom = pick.querySelector('.crop input[type=range]');
    var save = pick.querySelector('button[type=submit]'), card = document.querySelector('.mhero-card .cred'), before = card ? card.outerHTML : '';
    var img = null, z = 1, ox = 0, oy = 0, raf = 0;
    var W = cv.width, H = cv.height;
    function base() { return Math.max(W / img.width, H / img.height); }
    function clamp() { var k = base() * z, w = img.width * k, h = img.height * k; ox = Math.min(0, Math.max(W - w, ox)); oy = Math.min(0, Math.max(H - h, oy)); }
    function draw(out, ow, oh) { var k = base() * z, sx = ow / W; out.drawImage(img, ox * sx, oy * sx, img.width * k * sx, img.height * k * sx); }
    function preview() {
      raf = 0; ctx.clearRect(0, 0, W, H); draw(ctx, W, H);
      var live = document.querySelector('.mhero-card .cred'); if (!live) return;
      live.classList.add('cred-photo');
      var pic = live.querySelector('.cred-pic');
      if (!pic) { pic = document.createElement('div'); pic.className = 'cred-pic'; pic.appendChild(document.createElement('img')); live.querySelector('.cred-in').prepend(pic); }
      pic.querySelector('img').src = cv.toDataURL('image/jpeg', .82);
    }
    function redraw() { clamp(); if (!raf) raf = requestAnimationFrame(preview); }
    function restore() { var live = document.querySelector('.mhero-card .cred'); if (live && before) live.outerHTML = before; }
    input.addEventListener('change', function () {
      var f = input.files[0]; if (!f) return;
      createImageBitmap(f).then(function (b) {
        img = b; z = 1; zoom.value = 1;
        var k = base(); ox = (W - img.width * k) / 2; oy = (H - img.height * k) / 2;
        crop.hidden = false; redraw(); frame.focus();
      }).catch(function () { say('badfile'); });
    });
    zoom.addEventListener('input', function () {
      // zoom around the centre of the frame
      var k0 = base() * z, cx = (W / 2 - ox) / k0, cy = (H / 2 - oy) / k0;
      z = Number(zoom.value); var k1 = base() * z; ox = W / 2 - cx * k1; oy = H / 2 - cy * k1; redraw();
    });
    var drag = null;
    frame.addEventListener('pointerdown', function (e) { if (!img) return; drag = { x: e.clientX, y: e.clientY, ox: ox, oy: oy, r: W / frame.getBoundingClientRect().width }; frame.setPointerCapture(e.pointerId); });
    frame.addEventListener('pointermove', function (e) { if (!drag) return; ox = drag.ox + (e.clientX - drag.x) * drag.r; oy = drag.oy + (e.clientY - drag.y) * drag.r; redraw(); });
    frame.addEventListener('pointerup', function () { drag = null; });
    frame.addEventListener('pointercancel', function () { drag = null; });
    frame.addEventListener('keydown', function (e) {
      if (!img) return;
      var d = e.shiftKey ? 40 : 12, k = { ArrowLeft: [d, 0], ArrowRight: [-d, 0], ArrowUp: [0, d], ArrowDown: [0, -d] }[e.key];
      if (k) { e.preventDefault(); ox += k[0]; oy += k[1]; redraw(); }
      if (e.key === '+' || e.key === '=' || e.key === '-') { e.preventDefault(); zoom.value = Math.min(3, Math.max(1, Number(zoom.value) + (e.key === '-' ? -.1 : .1))); zoom.dispatchEvent(new Event('input')); }
    });
    pick.querySelector('[data-crop-cancel]').addEventListener('click', function () { restore(); img = null; input.value = ''; crop.hidden = true; cm.hidden = true; });
    pick.addEventListener('submit', function (ev) {
      ev.preventDefault();
      if (!img) { input.click(); return; }
      var out = document.createElement('canvas'); out.width = 600; out.height = 800; draw(out.getContext('2d'), 600, 800);
      var label = save.textContent; save.disabled = true; save.textContent = save.dataset.saving;
      new Promise(function (ok) { out.toBlob(ok, 'image/jpeg', .9); }).then(function (blob) {
        var fd = new FormData(); fd.append('photo', blob, 'photo.jpg');
        return fetch(pick.action, { method: 'POST', body: fd, credentials: 'same-origin', headers: { accept: 'application/json' } });
      }).then(function (res) { return res.json(); }).then(function (j) {
        if (j.ok) { location.href = j.to; return; }
        say(j.error === 'expired' ? 'expired' : 'badfile'); save.disabled = false; save.textContent = label;
      }).catch(function () { say('badfile'); save.disabled = false; save.textContent = label; });
    });
  })();

  // carousels: the buttons scroll the list, the bar follows the real position, both ends disable their button
  document.querySelectorAll('[data-car]').forEach(function (car) {
    var list = car.querySelector('.lt-grid'), btns = car.querySelectorAll('.car-btn'), thumb = car.querySelector('.car-thumb'), bar = car.querySelector('.car-bar');
    if (!list) return;
    function sync() {
      var max = list.scrollWidth - list.clientWidth, x = list.scrollLeft;
      var scrollable = max > 2;
      car.classList.toggle('car-static', !scrollable);
      btns[0].disabled = !scrollable || x <= 2;
      btns[1].disabled = !scrollable || x >= max - 2;
      if (thumb) { var w = Math.max(.12, list.clientWidth / list.scrollWidth); thumb.style.width = (w * 100) + '%'; thumb.style.transform = 'translateX(' + (max > 0 ? (x / max) * ((1 - w) / w) * 100 : 0) + '%)'; }
    }
    btns.forEach(function (b) { b.addEventListener('click', function () {
      var step = Math.max(160, list.clientWidth * .85) * Number(b.getAttribute('data-dir'));
      list.scrollBy({ left: step, behavior: reduce ? 'auto' : 'smooth' });
    }); });
    list.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    sync();
  });

  // weekly chart: a tip with the date, the total and the roles, on hover, on keyboard focus and on a first tap
  document.querySelectorAll('.weeks').forEach(function (box) {
    var tip = box.querySelector('.wk-tip'); if (!tip) return;
    var shown = null;
    function show(a) {
      shown = a;
      tip.innerHTML = '<b></b><span></span><small></small>';
      tip.children[0].textContent = a.dataset.t; tip.children[1].textContent = a.dataset.n; tip.children[2].textContent = a.dataset.r;
      tip.hidden = false;
      var r = a.getBoundingClientRect(), b = box.getBoundingClientRect(), w = tip.offsetWidth;
      var left = Math.min(Math.max(8, r.left - b.left + r.width / 2 - w / 2), b.width - w - 8);
      tip.style.left = left + 'px'; tip.style.top = Math.max(4, r.top - b.top - tip.offsetHeight + 18) + 'px';
      box.querySelectorAll('.wk').forEach(function (x) { x.classList.toggle('on', x === a); });
    }
    function hide() { shown = null; tip.hidden = true; box.querySelectorAll('.wk.on').forEach(function (x) { x.classList.remove('on'); }); }
    box.querySelectorAll('.wk').forEach(function (a) {
      a.addEventListener('mouseenter', function () { if (!a._touch) show(a); });
      a.addEventListener('focus', function () { if (!a._touch) show(a); });
      a.addEventListener('blur', hide);
      a.addEventListener('pointerdown', function (e) { if (e.pointerType === 'touch') a._touch = true; });
      a.addEventListener('touchstart', function () { a._touch = true; }, { passive: true });
      a.addEventListener('click', function (e) { if (a._touch && shown !== a) { e.preventDefault(); show(a); } a._touch = false; });
    });
    box.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') hide(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') hide(); });
  });

  // the section menu on small screens closes once a section is chosen
  document.querySelectorAll('.toc-m a').forEach(function (a) { a.addEventListener('click', function () { a.closest('details').open = false; }); });
})();
