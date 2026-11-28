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
        var ok = (!q || li._n.indexOf(q) !== -1) && (!role || li.dataset.role === role || (' ' + (li.dataset.b || '') + ' ').indexOf(' ' + role + ' ') !== -1);
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

  // home search: names appear as you type; arrows move, Enter opens the highlighted member or the full results
  var hq = document.querySelector('#q[role=combobox]');
  if (hq && window.fetch) (function () {
    var box = document.getElementById('q-list'), form = hq.form, data = null, items = [], active = -1;
    var fold = function (s) { return s.normalize('NFKC').toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, ''); };
    var load = function () { if (!data) data = fetch('/api/members').then(function (r) { return r.json(); }).then(function (list) { list.forEach(function (m) { m.f = fold(m.a); m.k = fold(m.n).replace(/^[^\p{L}\p{N}]+/u, ''); }); return list; }).catch(function () { data = null; return []; }); return data; };
    var close = function () { box.hidden = true; hq.setAttribute('aria-expanded', 'false'); hq.removeAttribute('aria-activedescendant'); active = -1; };
    var mark = function (i) {
      active = i;
      items.forEach(function (el, k) { el.setAttribute('aria-selected', String(k === i)); });
      if (i >= 0) { hq.setAttribute('aria-activedescendant', items[i].id); items[i].scrollIntoView({ block: 'nearest' }); } else hq.removeAttribute('aria-activedescendant');
    };
    var render = function () {
      var q = fold(hq.value.trim());
      if (!q) { close(); return; }
      load().then(function (list) {
        if (fold(hq.value.trim()) !== q) return;
        var hits = list.filter(function (m) { return m.f.indexOf(q) !== -1; });
        // names that start with the query first, then the rest
        hits.sort(function (a, b) { return (b.k.indexOf(q) === 0) - (a.k.indexOf(q) === 0) || a.k.localeCompare(b.k); });
        box.innerHTML = '';
        hits.slice(0, 6).forEach(function (m, i) {
          var li = document.createElement('li'); li.id = 'q-opt-' + i; li.setAttribute('role', 'option');
          var a = document.createElement('a'); a.href = box.dataset.base + m.s + '/'; a.tabIndex = -1;
          var av = document.createElement(m.p ? 'img' : 'span'); av.className = 'q-av q-' + m.r.toLowerCase();
          if (m.p) { av.src = m.p; av.alt = ''; } else av.textContent = (m.n.normalize('NFKC').match(/[\p{L}\p{N}]/u) || ['?'])[0].toUpperCase();
          var nm = document.createElement('span'); nm.className = 'q-n'; nm.textContent = m.n;
          var meta = document.createElement('span'); meta.className = 'q-m'; meta.lang = 'en'; meta.textContent = m.r + '  No. ' + String(m.no).padStart(3, '0');
          a.append(av, nm, meta); li.appendChild(a); box.appendChild(li);
        });
        var foot = document.createElement('li'); foot.className = 'q-foot'; foot.setAttribute('role', 'option'); foot.id = 'q-opt-more';
        if (hits.length) { var all = document.createElement('a'); all.href = form.action + '?q=' + encodeURIComponent(hq.value.trim()); all.tabIndex = -1; all.textContent = box.dataset.more.replace('{0}', new Intl.NumberFormat(document.documentElement.lang).format(hits.length)); foot.appendChild(all); }
        else { foot.textContent = box.dataset.none; foot.setAttribute('aria-disabled', 'true'); }
        box.appendChild(foot);
        items = [].slice.call(box.querySelectorAll('[role=option]')).filter(function (el) { return el.querySelector('a'); });
        box.hidden = false; hq.setAttribute('aria-expanded', 'true'); mark(-1);
      });
    };
    hq.addEventListener('focus', load, { once: true });
    hq.addEventListener('input', render);
    hq.addEventListener('keydown', function (e) {
      if (box.hidden) return;
      if (e.key === 'ArrowDown') { e.preventDefault(); mark(Math.min(items.length - 1, active + 1)); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); mark(Math.max(-1, active - 1)); }
      else if (e.key === 'Escape') { close(); }
      else if (e.key === 'Enter' && active >= 0) { e.preventDefault(); location.href = items[active].querySelector('a').href; }
    });
    box.addEventListener('mousedown', function (e) { e.preventDefault(); });
    document.addEventListener('click', function (e) { if (!form.contains(e.target)) close(); });
    hq.addEventListener('blur', function () { setTimeout(close, 150); });
  })();

  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var fold = function (s) { return String(s).normalize('NFKC').toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, ''); };

  // ---- the side menu: kept open or folded to icons on wide screens, a drawer on phones ----
  var side = document.querySelector('.side'), pin = document.querySelector('.side-pin'), mbtn = document.querySelector('.menu-btn');
  var scrim = document.querySelector('.scrim'), sx = document.querySelector('.side-x'), narrow = window.matchMedia('(max-width: 900px)');
  if (side) {
    var syncPin = function () { if (pin) pin.setAttribute('aria-pressed', String(root.getAttribute('data-side') !== 'rail')); };
    syncPin();
    if (pin) pin.addEventListener('click', function () {
      var next = root.getAttribute('data-side') === 'rail' ? 'pinned' : 'rail';
      root.setAttribute('data-side', next); syncPin();
      try { localStorage.setItem('pg-side', next); } catch (e) {}
      if (next === 'rail') pin.blur();
    });
    var drawer = function (open) {
      root.classList.toggle('side-open', open);
      if (scrim) scrim.hidden = !open;
      if (mbtn) mbtn.setAttribute('aria-expanded', String(open));
      side.inert = narrow.matches && !open;
      document.body.style.overflow = open ? 'hidden' : '';
      if (open && sx) sx.focus(); else if (!open && mbtn && narrow.matches) mbtn.focus();
    };
    var syncNarrow = function () { side.inert = narrow.matches && !root.classList.contains('side-open'); if (!narrow.matches && root.classList.contains('side-open')) drawer(false); };
    syncNarrow();
    (narrow.addEventListener ? narrow.addEventListener('change', syncNarrow) : narrow.addListener(syncNarrow));
    if (mbtn) mbtn.addEventListener('click', function () { drawer(true); });
    if (sx) sx.addEventListener('click', function () { drawer(false); });
    if (scrim) scrim.addEventListener('click', function () { drawer(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && root.classList.contains('side-open')) drawer(false); });
  }

  // the top bar gains a hairline once the page moves
  var onScroll = function () { root.classList.toggle('scrolled', window.scrollY > 4); };
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // ---- search everywhere: pages and members, from the bar, Ctrl K or / ----
  var dlg = document.querySelector('dialog.find'), fbtn = document.querySelector('.find-btn');
  if (dlg && dlg.showModal) (function () {
    var input = dlg.querySelector('input'), list = dlg.querySelector('.find-list'), pages = [], data = null, items = [], active = -1;
    try { pages = JSON.parse(dlg.dataset.pages); } catch (e) {}
    var nf = new Intl.NumberFormat(dlg.dataset.lang);
    var load = function () { if (!data) data = fetch('/api/members').then(function (r) { return r.json(); }).then(function (l) { l.forEach(function (m) { m.f = fold(m.a || m.n); m.k = fold(m.n).replace(/^[^\p{L}\p{N}]+/u, ''); }); return l; }).catch(function () { data = null; return []; }); return data; };
    var iconFor = function (href) { var a = side && side.querySelector('a[href="' + href + '"] svg'); return a ? a.cloneNode(true) : null; };
    var mark = function (i) {
      active = i;
      items.forEach(function (el, k) { el.setAttribute('aria-selected', String(k === i)); });
      if (i >= 0) { input.setAttribute('aria-activedescendant', items[i].id); items[i].scrollIntoView({ block: 'nearest' }); } else input.removeAttribute('aria-activedescendant');
    };
    var row = function (id, href, iconEl, name, meta) {
      var li = document.createElement('li'); li.id = id; li.setAttribute('role', 'option');
      var a = document.createElement('a'); a.href = href; a.tabIndex = -1;
      var n = document.createElement('span'); n.className = 'fn'; n.textContent = name;
      var m = document.createElement('span'); m.className = 'fm'; m.textContent = meta || '';
      a.append(iconEl, n, m); li.appendChild(a); return li;
    };
    var head = function (t) { var li = document.createElement('li'); li.className = 'fg'; li.setAttribute('role', 'presentation'); li.textContent = t; return li; };
    var render = function () {
      var q = fold(input.value.trim());
      var ps = pages.filter(function (p) { return !q || fold(p[0]).indexOf(q) !== -1; });
      var paint = function (members) {
        if (fold(input.value.trim()) !== q) return;
        list.innerHTML = ''; var n = 0;
        if (members.length) {
          list.appendChild(head(dlg.dataset.tMembers));
          members.slice(0, 7).forEach(function (m) {
            var av = document.createElement(m.p ? 'img' : 'span'); av.className = 'fi q-av q-' + String(m.r).toLowerCase();
            if (m.p) { av.src = m.p; av.alt = ''; } else av.textContent = (m.n.normalize('NFKC').match(/[\p{L}\p{N}]/u) || ['?'])[0].toUpperCase();
            list.appendChild(row('find-o' + n++, dlg.dataset.base + m.s + '/', av, m.n, m.r + '  No. ' + String(m.no).padStart(3, '0')));
          });
          if (members.length > 7) { var more = document.createElement('span'); more.className = 'fi'; more.textContent = '+'; list.appendChild(row('find-o' + n++, dlg.dataset.dir + '?q=' + encodeURIComponent(input.value.trim()), more, dlg.dataset.tAll, nf.format(members.length))); }
        }
        if (ps.length) {
          list.appendChild(head(dlg.dataset.tPages));
          ps.forEach(function (p) { var ic = iconFor(p[1]) || document.createElement('span'); var box = document.createElement('span'); box.className = 'fi'; box.appendChild(ic); list.appendChild(row('find-o' + n++, p[1], box, p[0], '')); });
        }
        if (!n) { var e = document.createElement('li'); e.className = 'fe'; e.textContent = dlg.dataset.tNone; list.appendChild(e); }
        items = [].slice.call(list.querySelectorAll('[role=option]'));
        mark(items.length ? 0 : -1);
      };
      if (!q) { paint([]); return; }
      load().then(function (all) {
        var hits = all.filter(function (m) { return m.f.indexOf(q) !== -1; });
        hits.sort(function (a, b) { return (b.k.indexOf(q) === 0) - (a.k.indexOf(q) === 0) || a.k.localeCompare(b.k); });
        paint(hits);
      });
    };
    var open = function () { if (dlg.open) return; input.value = ''; render(); dlg.showModal(); input.focus(); load(); };
    if (fbtn) fbtn.addEventListener('click', open);
    document.addEventListener('keydown', function (e) {
      var typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName) || document.activeElement.isContentEditable;
      if ((e.key === 'k' || e.key === 'K') && (e.ctrlKey || e.metaKey)) { e.preventDefault(); dlg.open ? dlg.close() : open(); }
      else if (e.key === '/' && !typing && !dlg.open) { e.preventDefault(); open(); }
    });
    input.addEventListener('input', render);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); mark(Math.min(items.length - 1, active + 1)); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); mark(Math.max(0, active - 1)); }
      else if (e.key === 'Enter') { e.preventDefault(); if (active >= 0) location.href = items[active].querySelector('a').href; }
    });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
    list.addEventListener('mousemove', function (e) { var li = e.target.closest('[role=option]'); if (li) { var i = items.indexOf(li); if (i !== active) mark(i); } });
  })();

  // ---- GIFs: filter by maker ----
  var gchips = document.querySelectorAll('.chip[data-g]');
  gchips.forEach(function (c) { c.addEventListener('click', function () {
    gchips.forEach(function (x) { x.setAttribute('aria-pressed', String(x === c)); });
    document.querySelectorAll('.gifs li').forEach(function (li) { li.hidden = Boolean(c.dataset.g) && li.dataset.by !== c.dataset.g; });
  }); });

  // ---- the gateway checklist: ticks stay in this browser ----
  document.querySelectorAll('.gw-check input[data-k]').forEach(function (c) {
    try { c.checked = localStorage.getItem('pg-' + c.dataset.k) === '1'; } catch (e) {}
    c.addEventListener('change', function () { try { localStorage.setItem('pg-' + c.dataset.k, c.checked ? '1' : '0'); } catch (e) {} });
  });

  // ---- copy buttons on code blocks ----
  document.querySelectorAll('.code .copy').forEach(function (b) {
    var label = b.textContent;
    b.addEventListener('click', function () {
      var t = b.parentNode.querySelector('code').textContent;
      var done = function () { b.textContent = b.dataset.copied; b.classList.add('done'); setTimeout(function () { b.textContent = label; b.classList.remove('done'); }, 1600); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(done, function () {});
      else { var r = document.createRange(); r.selectNodeContents(b.parentNode.querySelector('code')); var sel = getSelection(); sel.removeAllRanges(); sel.addRange(r); }
    });
  });

  // ---- the credential: tilt, foil and glare follow the pointer ----
  if (fine && !reduce) document.querySelectorAll('[data-card]').forEach(function (card) {
    var raf = 0, ev = null;
    var apply = function () {
      raf = 0; var r = card.getBoundingClientRect(), x = (ev.clientX - r.left) / r.width, y = (ev.clientY - r.top) / r.height;
      x = Math.min(1, Math.max(0, x)); y = Math.min(1, Math.max(0, y));
      card.style.setProperty('--px', (x * 100).toFixed(1) + '%'); card.style.setProperty('--py', (y * 100).toFixed(1) + '%');
      card.style.setProperty('--rx', ((0.5 - y) * 14).toFixed(2) + 'deg'); card.style.setProperty('--ry', ((x - 0.5) * 18).toFixed(2) + 'deg');
      card.style.setProperty('--hov', '1');
    };
    card.addEventListener('pointerenter', function () { card.classList.add('live'); });
    card.addEventListener('pointermove', function (e) { ev = e; if (!raf) raf = requestAnimationFrame(apply); });
    card.addEventListener('pointerleave', function () {
      cancelAnimationFrame(raf); raf = 0; card.classList.remove('live');
      ['--px', '--py', '--rx', '--ry', '--hov'].forEach(function (k) { card.style.removeProperty(k); });
    });
  });

  // ---- a soft light under the pointer on cards that are links ----
  if (fine) {
    document.querySelectorAll('.b-link, .icard, .dir a, .lord-cards a, .ccard, .voice, .team-teaser a, .pager a, .mbadges a').forEach(function (el) { el.classList.add('glow'); });
    document.addEventListener('pointermove', function (e) {
      var el = e.target.closest && e.target.closest('.glow'); if (!el) return;
      var r = el.getBoundingClientRect(); el.style.setProperty('--gx', (e.clientX - r.left) + 'px'); el.style.setProperty('--gy', (e.clientY - r.top) + 'px');
    }, { passive: true });
  }

  // ---- numbers count up once, when they come into view ----
  var counters = [].slice.call(document.querySelectorAll('[data-count], .stat-tiles dd'));
  if (counters.length && !reduce && 'IntersectionObserver' in window) {
    var cf = new Intl.NumberFormat(root.lang);
    var io2 = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return; io2.unobserve(e.target);
        var el = e.target, to = Number(el.dataset.count || el.textContent.replace(/[^\d]/g, ''));
        if (!(to > 3) || /[^\d\s.,  ']/.test(el.textContent)) return;
        var t0 = performance.now(), final = el.textContent;
        var step = function (now) { var k = Math.min(1, (now - t0) / 1100), v = Math.round(to * (1 - Math.pow(1 - k, 3))); el.textContent = k < 1 ? cf.format(v) : final; if (k < 1) requestAnimationFrame(step); };
        requestAnimationFrame(step);
      });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { io2.observe(c); });
  }

  // ---- the weekly chart rises when it is first seen ----
  if (!reduce && 'IntersectionObserver' in window) document.querySelectorAll('.weeks').forEach(function (w) {
    var io3 = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { io3.disconnect(); w.querySelectorAll('.wk').forEach(function (a, i) { a.querySelectorAll('.wb').forEach(function (b) { b.style.setProperty('--i', i); }); }); w.classList.add('grow'); } }, { threshold: 0.25 });
    io3.observe(w);
  });

  // ---- the propagation field: one block at a time spreads over a turning network ----
  // Every node waits for coded pieces from two neighbours before it has the block, like RLNC needing enough pieces.
  var cv = document.querySelector('canvas.field');
  if (cv && cv.getContext) (function () {
    var g = cv.getContext('2d'), N = 132, P = [], E = [], adj = [];
    for (var i = 0; i < N; i++) { var y = 1 - (i / (N - 1)) * 2, rr = Math.sqrt(1 - y * y), th = i * 2.399963; P.push({ x: Math.cos(th) * rr, y: y, z: Math.sin(th) * rr, t: Infinity }); adj.push([]); }
    var seen = {};
    P.forEach(function (p, i) {
      var d = P.map(function (q, j) { return { j: j, d: (p.x - q.x) * (p.x - q.x) + (p.y - q.y) * (p.y - q.y) + (p.z - q.z) * (p.z - q.z) }; }).sort(function (a, b) { return a.d - b.d; });
      for (var k = 1; k <= 3; k++) { var j = d[k].j, key = Math.min(i, j) + ':' + Math.max(i, j); if (!seen[key]) { seen[key] = 1; var w = 130 + ((i * 7919 + j * 104729) % 120); E.push({ a: i, b: j, w: w }); adj[i].push({ j: j, w: w }); adj[j].push({ j: i, w: w }); } }
    });
    var C = {}, colors = function () { var cs = getComputedStyle(root); C = { acc: cs.getPropertyValue('--accent').trim(), ink: cs.getPropertyValue('--ink').trim(), soft: cs.getPropertyValue('--soft').trim(), line: cs.getPropertyValue('--line-2').trim() }; };
    var W = 0, H = 0, R = 0, cx = 0, cy = 0, dpr = 1, rotY = 0.6, rotX = -0.35, tY = 0, tX = 0, T0 = 0, span = 0, src = 0, raf = 0, last = 0, on = false;
    var size = function () { var b = cv.getBoundingClientRect(); dpr = Math.min(2, window.devicePixelRatio || 1); W = b.width; H = b.height; cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); R = Math.min(W, H) * 0.56; cx = W * 0.52; cy = H * 0.5; };
    var block = function (s, now) {
      src = s; P.forEach(function (p) { p.t = Infinity; }); P[s].t = 0;
      // each node's arrival is the second earliest piece from its neighbours
      for (var it = 0; it < 60; it++) {
        var moved = false;
        for (var i2 = 0; i2 < N; i2++) { if (i2 === s) continue; var ts = adj[i2].map(function (e) { return P[e.j].t + e.w; }).sort(function (a, b) { return a - b; }); var v = ts.length > 1 ? ts[1] : ts[0]; if (v < P[i2].t - 0.5) { P[i2].t = v; moved = true; } }
        if (!moved) break;
      }
      span = Math.max.apply(null, P.map(function (p) { return isFinite(p.t) ? p.t : 0; }));
      T0 = now; colors();
    };
    var proj = function (p) {
      var cyA = Math.cos(rotY + tY), syA = Math.sin(rotY + tY), cxA = Math.cos(rotX + tX), sxA = Math.sin(rotX + tX);
      var x = p.x * cyA + p.z * syA, z = -p.x * syA + p.z * cyA, y = p.y * cxA - z * sxA; z = p.y * sxA + z * cxA;
      var k = 1 / (1.9 - z * 0.45);
      return { x: cx + x * R * k * 1.5, y: cy + y * R * k * 1.5, z: z, k: k };
    };
    var hex = function (c, a) { g.globalAlpha = a; g.fillStyle = c; g.strokeStyle = c; };
    var draw = function (now) {
      var t = (now - T0) * 0.75, S = P.map(proj);
      g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, W, H);
      g.lineWidth = 1;
      E.forEach(function (e) {
        var a = S[e.a], b = S[e.b], depth = (a.z + b.z + 2) / 4, lit = P[e.a].t <= t && P[e.b].t <= t;
        hex(lit ? C.acc : C.soft, lit ? 0.16 + depth * 0.5 : 0.05 + depth * 0.2);
        g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.stroke();
        [[e.a, e.b], [e.b, e.a]].forEach(function (d) {
          var from = P[d[0]].t, f = (t - from) / e.w;
          if (f > 0 && f < 1 && P[d[1]].t > from) { var p = S[d[0]], q = S[d[1]]; hex(C.acc, 0.5 + depth * 0.5); g.beginPath(); g.arc(p.x + (q.x - p.x) * f, p.y + (q.y - p.y) * f, 1.4 + depth * 1.6, 0, 6.2832); g.fill(); }
        });
      });
      S.forEach(function (s, i) {
        var depth = (s.z + 1) / 2, got = P[i].t <= t, r = (1.3 + depth * 2.2) * s.k * 1.6;
        if (got) {
          var age = t - P[i].t;
          if (age < 700) { hex(C.acc, (1 - age / 700) * 0.5 * (0.4 + depth)); g.beginPath(); g.arc(s.x, s.y, r + age / 700 * 14, 0, 6.2832); g.lineWidth = 1.2; g.stroke(); }
          hex(C.acc, 0.45 + depth * 0.55); g.beginPath(); g.arc(s.x, s.y, r * (i === src ? 1.8 : 1.1), 0, 6.2832); g.fill();
        } else { hex(C.soft, 0.18 + depth * 0.5); g.beginPath(); g.arc(s.x, s.y, r * 0.8, 0, 6.2832); g.fill(); }
      });
      g.globalAlpha = 1;
      return t;
    };
    var pick = function () { var best = 0, bz = -9; P.forEach(function (p, i) { var s = proj(p); var score = s.z + Math.random() * 0.6; if (score > bz) { bz = score; best = i; } }); return best; };
    var loop = function (now) {
      var dt = last ? Math.min(50, now - last) : 16; last = now;
      rotY += dt * 0.00009;
      var t = draw(now);
      if (t > span + 1600) block(pick(), now);
      raf = requestAnimationFrame(loop);
    };
    var start = function () { if (on || reduce) return; on = true; last = 0; raf = requestAnimationFrame(loop); };
    var stop = function () { on = false; cancelAnimationFrame(raf); };
    size(); colors(); block(pick(), performance.now());
    if (reduce) { T0 = performance.now() - span * 0.7 / 0.75; draw(performance.now()); }
    if ('ResizeObserver' in window) new ResizeObserver(function () { size(); if (!on) draw(performance.now()); }).observe(cv);
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { es[0].isIntersecting ? start() : stop(); }).observe(cv); else start();
    document.addEventListener('visibilitychange', function () { if (document.hidden) stop(); });
    var stage = cv.parentNode;
    if (fine) stage.addEventListener('pointermove', function (e) { var b = stage.getBoundingClientRect(); tY = ((e.clientX - b.left) / b.width - 0.5) * 0.8; tX = ((e.clientY - b.top) / b.height - 0.5) * -0.5; });
    cv.addEventListener('click', function (e) {
      var b = cv.getBoundingClientRect(), mx = e.clientX - b.left, my = e.clientY - b.top, best = 0, bd = Infinity;
      P.forEach(function (p, i) { var s = proj(p); var d = (s.x - mx) * (s.x - mx) + (s.y - my) * (s.y - my) - s.z * 400; if (d < bd) { bd = d; best = i; } });
      block(best, performance.now()); if (reduce) { T0 = performance.now() - span * 0.7 / 0.75; draw(performance.now()); }
    });
    var tb = document.querySelector('.theme'); if (tb) tb.addEventListener('click', function () { setTimeout(function () { colors(); if (!on) draw(performance.now()); }, 30); });
  })();
})();
