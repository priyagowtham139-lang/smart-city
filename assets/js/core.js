/* =========================================================
   STACKLY SMART CITY - core.js
   Chrome: loader, header, hamburger menu, footer
   ========================================================= */
(function () {
  'use strict';
  var W = window, D = document, H = D.documentElement;
  var $ = function (s, c) { return (c || D).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || D).querySelectorAll(s)); };
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
    sget: function (k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    sset: function (k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} },
    sdel: function (k) { try { sessionStorage.removeItem(k); } catch (e) {} }
  };
  var page = (H.getAttribute('data-page') || D.body.getAttribute('data-page') || 'index');
  var chrome = D.body.getAttribute('data-chrome') || 'site';
  var ICON = function (n, extra) { return '<i class="fa-solid ' + n + (extra ? ' ' + extra : '') + '" aria-hidden="true"></i>'; };

  var Stk = W.Stk = { $: $, $$: $$, store: store, page: page, ICON: ICON };

  var NAV = [
    { k: 'index', href: 'index.html', label: 'Home', icon: 'fa-house' },
    { k: 'about', href: 'about.html', label: 'About', icon: 'fa-landmark' },
    { k: 'services', href: 'services.html', label: 'Services', icon: 'fa-layer-group' },
    { k: 'projects', href: 'projects.html', label: 'Projects', icon: 'fa-city' },
    { k: 'sustainability', href: 'sustainability.html', label: 'Sustainability', icon: 'fa-leaf' },
    { k: 'contact', href: 'contact.html', label: 'Contact', icon: 'fa-headset' }
  ];
  var SOCIAL = [
    { i: 'fa-brands fa-facebook-f', n: 'Facebook' }, { i: 'fa-brands fa-x-twitter', n: 'X' },
    { i: 'fa-brands fa-linkedin-in', n: 'LinkedIn' }, { i: 'fa-brands fa-instagram', n: 'Instagram' },
    { i: 'fa-brands fa-youtube', n: 'YouTube' }, { i: 'fa-brands fa-github', n: 'GitHub' }
  ];
  Stk.NAV = NAV;

  /* ---------- toast ---------- */
  var toastBox;
  Stk.toast = function (msg, type) {
    if (!toastBox) { toastBox = D.createElement('div'); toastBox.className = 'toasts'; toastBox.setAttribute('aria-live', 'polite'); D.body.appendChild(toastBox); }
    var t = D.createElement('div'); t.className = 'toast' + (type === 'err' ? ' err' : '');
    t.innerHTML = '<i class="fa-solid ' + (type === 'err' ? 'fa-triangle-exclamation' : 'fa-check') + '"></i><span></span>';
    t.lastChild.textContent = msg; toastBox.appendChild(t);
    setTimeout(function () { t.classList.add('out'); setTimeout(function () { t.remove(); }, 420); }, 3200);
  };

  /* ---------- session helpers ---------- */
  Stk.session = function () { return store.get('stk_session', null); };
  Stk.dashFor = function (s) { return s && s.role === 'admin' ? 'admin-dashboard.html' : 'user-dashboard.html'; };

  /* ---------- loader ---------- */
  function loaderHTML(short) {
    var bl = [[0, 40, 26, 50], [30, 18, 30, 72], [64, 30, 24, 60], [92, 4, 34, 86], [130, 26, 28, 64], [162, 12, 32, 78], [198, 34, 24, 56], [226, 20, 30, 70], [260, 36, 22, 54], [286, 14, 34, 76]];
    var sky = '', i, b, wi;
    for (i = 0; i < bl.length; i++) {
      b = bl[i];
      sky += '<rect class="b" pathLength="1" style="--i:' + i + '" x="' + b[0] + '" y="' + (100 - b[3]) + '" width="' + b[2] + '" height="' + b[3] + '"/>';
      for (wi = 0; wi < 3; wi++) sky += '<rect class="w" style="--i:' + (i * 3 + wi) + '" x="' + (b[0] + 6 + (wi % 2) * 12) + '" y="' + (100 - b[3] + 8 + wi * 14) + '" width="5" height="6" rx="1"/>';
    }
    return '<div class="ld-panel ld-a"></div><div class="ld-panel ld-b"></div>' +
      '<div class="ld-c">' +
      '<div class="ld-emblem"><svg viewBox="0 0 200 200" aria-hidden="true"><defs><linearGradient id="ldg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#38d5f5"/><stop offset="1" stop-color="#7b8cff"/></linearGradient></defs><circle class="r1" cx="100" cy="100" r="88"/><circle class="r2" cx="100" cy="100" r="88"/><circle class="r3" cx="100" cy="100" r="72"/><circle class="dot" cx="100" cy="12" r="5"/></svg><img class="ld-mark" src="assets/img/logo-mark.svg" alt="" width="54" height="63"></div>' +
      '<svg class="ld-sky" viewBox="0 0 320 104" aria-hidden="true">' + sky + '<line class="g" x1="0" y1="101" x2="320" y2="101"/></svg>' +
      '<div class="ld-txt"><span class="m">Starting Stackly</span><small>Connecting city services</small></div>' +
      '<div class="ld-bar"><i></i></div><div class="ld-pct">0%</div></div>';
  }
  function runLoader() {
    var mode = W.__stkLoaderMode || 'full';
    var ld = $('#loader');
    if (!ld) { H.classList.remove('js-loading'); return Stk.ready(); }
    if (mode === 'none') { ld.remove(); H.classList.remove('js-loading'); return; }
    var short = mode === 'short';
    ld.className = 'loader run' + (short ? ' short' : ''); ld.setAttribute('aria-hidden', 'true');
    ld.innerHTML = loaderHTML(short);
    var bar = $('.ld-bar i', ld), pct = $('.ld-pct', ld), msg = $('.ld-txt .m', ld), sub = $('.ld-txt small', ld);
    var steps = [[0, 'Starting Stackly', 'Connecting city services'], [.28, 'Syncing sensors', 'Traffic, air and energy feeds'], [.58, 'Loading city data', 'Districts, projects and services'], [.85, 'Almost ready', 'Preparing your smart city']];
    var dur = short ? 950 : 3000, t0 = performance.now(), loaded = D.readyState === 'complete', finished = false, last = -1;
    W.addEventListener('load', function () { loaded = true; });
    function done() {
      if (finished) return; finished = true;
      bar.style.width = '100%'; pct.textContent = '100%';
      ld.classList.add('done'); H.classList.remove('js-loading');
      store.sset('stk_seen', '1');
      setTimeout(function () { if (ld.parentNode) ld.remove(); }, 1200);
      Stk.ready();
    }
    function tick(now) {
      if (finished) return;
      var p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      var shown = loaded ? e : Math.min(e, .9);
      bar.style.width = (shown * 100).toFixed(1) + '%'; pct.textContent = Math.round(shown * 100) + '%';
      for (var i = steps.length - 1; i >= 0; i--) if (shown >= steps[i][0]) { if (last !== i) { last = i; msg.textContent = steps[i][1]; sub.textContent = steps[i][2]; } break; }
      if ((p >= 1 && loaded) || now - t0 > 6500) return done();
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    setTimeout(done, 8000);
  }
  var readyFns = [], isReady = false;
  Stk.onReady = function (fn) { isReady ? fn() : readyFns.push(fn); };
  Stk.ready = function () { if (isReady) return; isReady = true; readyFns.forEach(function (f) { try { f(); } catch (e) { console.error(e); } }); D.dispatchEvent(new Event('stk:ready')); };

  /* ---------- chrome markup ---------- */
  function navLinks(cls) {
    return NAV.map(function (n, i) {
      return '<li style="--i:' + i + '"><a href="' + n.href + '" class="' + (n.k === page ? 'is-active' : '') + '"' + (n.k === page ? ' aria-current="page"' : '') + '>' + (cls === 'm' ? '<span class="mi">' + ICON(n.icon) + '</span><span>' + n.label + '</span>' + ICON('fa-chevron-right', 'go') : ICON(n.icon) + '<span>' + n.label + '</span>') + '</a></li>';
    }).join('');
  }
  function siteHeaderHTML() {
    var s = Stk.session();
    var sign = s ? '<a class="btn btn-sm btn-signin" href="' + Stk.dashFor(s) + '">' + ICON('fa-gauge-high') + '<span>Dashboard</span></a>' : '<a class="btn btn-sm btn-signin" href="login.html">' + ICON('fa-right-to-bracket') + '<span>Sign in</span></a>';
    return '<header class="site-header" id="siteHeader"><div class="hdr-progress"></div><div class="wrap"><div class="hdr-row">' +
      '<div class="hdr-left"><a class="hdr-logo" href="index.html" aria-label="Stackly home"><img src="assets/img/logo_white.webp" alt="Stackly" width="192" height="56"></a></div>' +
      '<nav class="hdr-nav" aria-label="Main navigation"><ul>' + navLinks('d') + '</ul></nav>' +
      '<div class="hdr-right">' + sign +
      '<button class="burger" type="button" data-open="menu" aria-label="Open menu" aria-expanded="false" aria-controls="mnav"><span></span><span></span><span></span></button></div></div></div></header>';
  }
  function menuHTML() {
    var s = Stk.session();
    var act = s ? '<a class="btn btn-block" href="' + Stk.dashFor(s) + '">' + ICON('fa-gauge-high') + 'My dashboard</a><button type="button" class="btn btn-ghost btn-block" data-logout>' + ICON('fa-right-from-bracket') + 'Sign out</button>' :
      '<a class="btn btn-block" href="login.html">' + ICON('fa-right-to-bracket') + 'Sign in</a><a class="btn btn-ghost btn-block" href="login.html#signup">' + ICON('fa-user-plus') + 'Sign up</a>';
    return '<div class="sheet-back" data-close></div><aside class="sheet-panel" role="dialog" aria-modal="true" aria-label="Site menu">' +
      '<div class="sheet-head"><img src="assets/img/logo_white.webp" alt="Stackly" width="192" height="56"><button class="sheet-close" type="button" data-close aria-label="Close menu">' + ICON('fa-xmark') + '</button></div>' +
      '<div class="sheet-body"><ul class="m-list" role="list">' + navLinks('m') + '</ul>' +
      '<div class="m-actions">' + act + '</div>' +
      '<div class="m-contact"><div>' + ICON('fa-phone-volume') + ' 7010792745</div><div>' + ICON('fa-envelope') + ' hello@stackly.city</div></div>' +
      '</div></div></aside>';
  }
  function drawerHTML(kind) {
    var title = kind === 'cart' ? 'Your cart' : 'Your wishlist', ic = kind === 'cart' ? 'fa-cart-shopping' : 'fa-heart';
    return '<div class="sheet-back" data-close></div><aside class="sheet-panel" role="dialog" aria-modal="true" aria-label="' + title + '">' +
      '<div class="sheet-head"><h3>' + ICON(ic) + title + '</h3><button class="sheet-close" type="button" data-close aria-label="Close ' + kind + '">' + ICON('fa-xmark') + '</button></div>' +
      '<div class="sheet-body" data-list="' + kind + '"></div><div class="sheet-foot" data-foot="' + kind + '"></div></aside>';
  }
  function footerHTML() {
    var cols = '<div class="ft-cols"><div><h4>' + ICON('fa-location-dot') + 'Visit us</h4><div class="ft-addr"><div>' + ICON('fa-building-columns') + '<span>Stackly Smart City Authority<br>MMR Complex, Periyakollappatty, Chinna Thirupathi<br>Salem, Tamil Nadu 636008</span></div><div>' + ICON('fa-phone') + '<span>Helpline 7010792745</span></div><div>' + ICON('fa-envelope') + '<span>hello@stackly.city</span></div><div>' + ICON('fa-clock') + '<span>Mon to Sat, 9:00 to 18:00</span></div></div></div>' +
      '<div><h4>' + ICON('fa-compass') + 'Explore</h4><ul>' + NAV.map(function (n) { return '<li><a href="' + n.href + '">' + ICON('fa-chevron-right') + n.label + '</a></li>'; }).join('') + '</ul></div>' +
      '<div><h4>' + ICON('fa-layer-group') + 'Services</h4><ul><li><a href="404.html">' + ICON('fa-chevron-right') + 'Smart mobility</a></li><li><a href="404.html">' + ICON('fa-chevron-right') + 'Energy and utilities</a></li><li><a href="404.html">' + ICON('fa-chevron-right') + 'Water management</a></li><li><a href="404.html">' + ICON('fa-chevron-right') + 'E-governance</a></li><li><a href="404.html">' + ICON('fa-chevron-right') + 'Citizen sign in</a></li></ul></div>' +
      '<div class="ft-news"><h4>' + ICON('fa-paper-plane') + 'City bulletin</h4><p class="muted" style="font-size:.93rem">Weekly updates on projects, outages and new services.</p><form data-newsletter data-sub-link="404.html" novalidate><input type="email" placeholder="Your email" aria-label="Email for city bulletin" required><button type="submit">Join</button><span class="nws-msg" role="alert"></span></form></div></div>';
    return '<footer class="site-footer" id="siteFooter"><div class="ft-top"></div><div class="wrap">' +
      '<div class="ft-bar"><div class="ft-brand"><a href="index.html" aria-label="Stackly home"><img src="assets/img/logo_white.webp" alt="Stackly" width="192" height="56"></a><p>Stackly is the digital front door of our smart city. We connect roads, energy, water, health and public services so every resident gets faster, fairer and greener city life.</p>' +
      '<div class="ft-social">' + SOCIAL.map(function (s) { return '<a href="404.html" aria-label="' + s.n + '" title="' + s.n + '"><i class="' + s.i + '"></i></a>'; }).join('') + '</div></div>' +
      '<div><button class="ft-toggle" type="button" aria-expanded="false" aria-controls="ftMore"><span class="tt">' + ICON('fa-address-card') + '<span>Address, links and contacts</span></span>' + ICON('fa-chevron-down', 'ch') + '</button><p class="ft-help">Open this panel for our office address, quick links and the city bulletin.</p></div></div>' +
      '<div class="ft-more" id="ftMore"><div class="in">' + cols + '</div></div>' +
      '<div class="ft-copy"><span>&copy; 2026 Stackly Smart City Authority. All rights reserved.</span><nav aria-label="Legal"><a href="contact.html#form">Privacy</a><a href="contact.html#form">Terms</a><a href="contact.html#help">Accessibility</a></nav></div></div></footer>' +
      '<button class="totop" type="button" aria-label="Back to top"><svg viewBox="0 0 52 52" aria-hidden="true"><circle class="tr" cx="26" cy="26" r="22.2"/><circle class="tp" cx="26" cy="26" r="22.2"/></svg>' + ICON('fa-chevron-up') + '</button>';
  }

  function buildChrome() {
    if (page === 'login' || page === '404' || chrome === 'auth') return;
    if (chrome === 'site') {
      var ld = $('#loader');
      var frag = D.createElement('div'); frag.innerHTML = siteHeaderHTML();
      var anchor = ld ? ld.nextSibling : D.body.firstChild;
      while (frag.firstChild) D.body.insertBefore(frag.firstChild, anchor);
      var m = D.createElement('div'); m.className = 'sheet'; m.id = 'mnav'; m.innerHTML = menuHTML(); D.body.appendChild(m);
      ['cart', 'wish'].forEach(function (k) { var d = D.createElement('div'); d.className = 'sheet'; d.id = 'sheet-' + k; d.innerHTML = drawerHTML(k); D.body.appendChild(d); });
      var f = D.createElement('div'); f.innerHTML = footerHTML();
      var scripts = $('script[src*="core.js"]');
      while (f.firstChild) D.body.insertBefore(f.firstChild, scripts);
    }
  }

  /* ---------- sheets ---------- */
  var openSheetEl = null, lastFocus = null;
  function openSheet(el, opener) {
    if (!el) return; closeSheet(true);
    lastFocus = opener || D.activeElement; el.classList.add('open'); openSheetEl = el;
    H.classList.add('no-scroll'); D.body.classList.add('no-scroll');
    $$('[data-open="menu"]').forEach(function (b) { b.setAttribute('aria-expanded', 'true'); });
    setTimeout(function () { var c = $('.sheet-close', el); if (c) c.focus({ preventScroll: true }); }, 60);
  }
  function closeSheet(quiet) {
    if (!openSheetEl) return;
    openSheetEl.classList.remove('open'); openSheetEl = null;
    H.classList.remove('no-scroll'); D.body.classList.remove('no-scroll');
    $$('[data-open="menu"]').forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
    if (!quiet && lastFocus && lastFocus.focus) try { lastFocus.focus({ preventScroll: true }); } catch (e) {}
  }
  Stk.openSheet = openSheet; Stk.closeSheet = closeSheet;

  function bindSheets() {
    D.addEventListener('click', function (e) {
      var o = e.target.closest && e.target.closest('[data-open]');
      if (o) { var k = o.getAttribute('data-open'); openSheet(k === 'menu' ? $('#mnav') : $('#sheet-' + k), o); return; }
      if (e.target.closest && e.target.closest('[data-close]')) closeSheet();
    });
    D.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { closeSheet(); }
      if (e.key === 'Tab' && openSheetEl) {
        var f = $$('a[href],button:not([disabled]),input,select,textarea', openSheetEl).filter(function (x) { return x.offsetParent !== null; });
        if (!f.length) return; var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && D.activeElement === first) { e.preventDefault(); last.focus(); } else if (!e.shiftKey && D.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    W.addEventListener('resize', function () { if (openSheetEl && openSheetEl.id === 'mnav' && W.innerWidth >= 1024) closeSheet(true); });
    // highlight the tapped page in the hamburger menu instantly, close if it is the current page
    var mnav = $('#mnav');
    if (mnav) mnav.addEventListener('click', function (e) {
      var a = e.target.closest('.m-list a'); if (!a) return;
      $$('.m-list a', mnav).forEach(function (x) { x.classList.remove('is-active'); x.removeAttribute('aria-current'); });
      a.classList.add('is-active'); a.setAttribute('aria-current', 'page');
      var href = a.getAttribute('href');
      if (href === (page === 'index' ? 'index.html' : page + '.html')) { e.preventDefault(); closeSheet(); }
    });
    D.addEventListener('click', function (e) {
      var lo = e.target.closest && e.target.closest('[data-logout]');
      if (lo) { store.set('stk_session', null); Stk.toast('You have been signed out'); setTimeout(function () { location.href = 'index.html'; }, 500); }
    });
  }

  /* ---------- header scroll behaviour ---------- */
  function bindScroll() {
    var hdr = $('#siteHeader'), prog = $('.hdr-progress'), top = $('.totop'), ring = top && $('.tp', top), ticking = false;
    function upd() {
      var y = W.pageYOffset || H.scrollTop, max = Math.max(1, H.scrollHeight - H.clientHeight), p = Math.min(1, y / max);
      if (hdr) hdr.classList.toggle('scrolled', y > 24);
      if (prog) prog.style.transform = 'scaleX(' + p.toFixed(4) + ')';
      if (top) { top.classList.toggle('show', y > 700); ring.style.strokeDashoffset = (139.6 * (1 - p)).toFixed(1); }
      ticking = false;
    }
    W.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(upd); } }, { passive: true });
    W.addEventListener('resize', upd); upd();
    if (top) top.addEventListener('click', function () { W.scrollTo({ top: 0, behavior: 'smooth' }); });
    var fs = store.get('stk_fs', null);
    if (fs) H.style.fontSize = fs + '%';
  }

  /* ---------- cart & wishlist ---------- */
  var money = function (n) { return '$' + Number(n).toFixed(2).replace(/\.00$/, ''); };
  function getCart() { return store.get('stk_cart', []); }
  function getWish() { return store.get('stk_wish', []); }
  function paintCounts() {
    var c = getCart().reduce(function (a, i) { return a + i.qty; }, 0), w = getWish().length;
    $$('[data-cart-count]').forEach(function (b) { b.textContent = c; b.classList.toggle('show', c > 0); });
    $$('[data-wish-count]').forEach(function (b) { b.textContent = w; b.classList.toggle('show', w > 0); });
  }
  function bump(sel) { $$(sel).forEach(function (b) { b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump'); }); }
  function paintLists() {
    var cart = getCart(), wish = getWish(), cl = $('[data-list="cart"]'), wl = $('[data-list="wish"]');
    if (cl) {
      cl.innerHTML = cart.length ? cart.map(function (i) { return '<div class="d-item"><div class="di">' + ICON(i.icon || 'fa-box') + '</div><div><h4>' + i.name + '</h4><small>Qty ' + i.qty + '</small> <span class="price">' + money(i.price * i.qty) + '</span></div><button class="rm" type="button" data-rm-cart="' + i.id + '" aria-label="Remove ' + i.name + '">' + ICON('fa-trash-can') + '</button></div>'; }).join('') :
        '<div class="d-empty">' + ICON('fa-cart-shopping') + '<b>Your cart is empty</b><span>Add a service pass or subscription from the marketplace.</span><a class="btn btn-sm" href="services.html#marketplace">Browse marketplace</a></div>';
      var f = $('[data-foot="cart"]');
      var total = cart.reduce(function (a, i) { return a + i.price * i.qty; }, 0);
      f.innerHTML = cart.length ? '<div class="d-total"><span>Total</span><b>' + money(total) + '</b></div><button class="btn btn-block" type="button" data-checkout>' + ICON('fa-lock') + 'Checkout securely</button>' : '';
    }
    if (wl) {
      wl.innerHTML = wish.length ? wish.map(function (i) { return '<div class="d-item"><div class="di">' + ICON(i.icon || 'fa-box') + '</div><div><h4>' + i.name + '</h4><span class="price">' + money(i.price) + '</span></div><button class="rm" type="button" data-rm-wish="' + i.id + '" aria-label="Remove ' + i.name + '">' + ICON('fa-xmark') + '</button></div>'; }).join('') :
        '<div class="d-empty">' + ICON('fa-heart') + '<b>No saved items</b><span>Tap the heart on any service to save it here.</span></div>';
      var wf = $('[data-foot="wish"]');
      wf.innerHTML = wish.length ? '<button class="btn btn-block" type="button" data-wish-to-cart>' + ICON('fa-cart-plus') + 'Move all to cart</button>' : '';
    }
    $$('[data-wish]').forEach(function (b) {
      var on = wish.some(function (i) { return i.id === b.getAttribute('data-id'); });
      b.classList.toggle('on', on); b.setAttribute('aria-pressed', String(on));
      var ic = $('i', b); if (ic) { ic.className = (on ? 'fa-solid' : 'fa-regular') + ' fa-heart'; }
    });
  }
  function bindShop() {
    D.addEventListener('click', function (e) {
      var t = e.target, b;
      if ((b = t.closest('[data-cart]'))) {
        var cart = getCart(), id = b.getAttribute('data-id'), it = cart.filter(function (i) { return i.id === id; })[0];
        if (it) it.qty++; else cart.push({ id: id, name: b.getAttribute('data-name'), price: parseFloat(b.getAttribute('data-price')), icon: b.getAttribute('data-icon'), qty: 1 });
        store.set('stk_cart', cart); paintCounts(); paintLists(); bump('[data-cart-count]'); Stk.toast(b.getAttribute('data-name') + ' added to cart');
      } else if ((b = t.closest('[data-wish]'))) {
        var w = getWish(), wid = b.getAttribute('data-id'), idx = -1; w.forEach(function (i, n) { if (i.id === wid) idx = n; });
        if (idx > -1) { w.splice(idx, 1); Stk.toast('Removed from wishlist'); } else { w.push({ id: wid, name: b.getAttribute('data-name'), price: parseFloat(b.getAttribute('data-price')), icon: b.getAttribute('data-icon') }); Stk.toast('Saved to wishlist'); bump('[data-wish-count]'); }
        store.set('stk_wish', w); paintCounts(); paintLists();
      } else if ((b = t.closest('[data-rm-cart]'))) {
        store.set('stk_cart', getCart().filter(function (i) { return i.id !== b.getAttribute('data-rm-cart'); })); paintCounts(); paintLists();
      } else if ((b = t.closest('[data-rm-wish]'))) {
        store.set('stk_wish', getWish().filter(function (i) { return i.id !== b.getAttribute('data-rm-wish'); })); paintCounts(); paintLists();
      } else if (t.closest('[data-wish-to-cart]')) {
        var c2 = getCart(); getWish().forEach(function (wi) { var f = c2.filter(function (x) { return x.id === wi.id; })[0]; if (f) f.qty++; else c2.push({ id: wi.id, name: wi.name, price: wi.price, icon: wi.icon, qty: 1 }); });
        store.set('stk_cart', c2); store.set('stk_wish', []); paintCounts(); paintLists(); Stk.toast('Wishlist moved to cart');
      } else if (t.closest('[data-checkout]')) {
        if (!Stk.session()) { Stk.toast('Please sign in to check out', 'err'); setTimeout(function () { location.href = 'login.html'; }, 900); return; }
        store.set('stk_cart', []); paintCounts(); paintLists(); closeSheet(); Stk.toast('Order placed. A receipt is in your dashboard.');
      }
    });
    paintCounts(); paintLists();
  }

  /* ---------- footer ---------- */
  function bindFooter() {
    var f = $('#siteFooter'); if (!f) return;
    var btn = $('.ft-toggle', f);
    function set(open) { f.classList.toggle('open', open); btn.setAttribute('aria-expanded', String(open)); }
    set(W.innerWidth >= 900);
    btn.addEventListener('click', function () { set(!f.classList.contains('open')); });
  }
  Stk.footerOpen = function () { var f = $('#siteFooter'); return f ? f.classList.contains('open') : null; };
  Stk.setFooter = function (o) { var f = $('#siteFooter'); if (f && o !== null) { f.classList.toggle('open', !!o); $('.ft-toggle', f).setAttribute('aria-expanded', String(!!o)); } };

  Stk.initChrome = function () { buildChrome(); bindSheets(); bindScroll(); bindShop(); bindFooter(); };
  Stk.runLoader = runLoader;
})();
/* ---------- effects ---------- */
(function () {
  'use strict';
  var W = window, D = document, Stk = W.Stk, $ = Stk.$, $$ = Stk.$$;
  var reduce = W.matchMedia && W.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var el = function (tag, cls, html) { var e = D.createElement(tag); if (cls) e.className = cls; if (html) e.innerHTML = html; return e; };
  var rng = function (seed) { var a = seed >>> 0; return function () { a += 0x6D2B79F5; var t = a; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; };
  var I = Stk.ICON;

  /* reveal on scroll (+ auto stagger) */
  function reveal() {
    $$('[data-stagger]').forEach(function (c) {
      var kind = c.getAttribute('data-stagger') || 'up', step = parseInt(c.getAttribute('data-step') || '90', 10);
      Array.prototype.forEach.call(c.children, function (k, i) {
        if (!k.hasAttribute('data-anim')) {
          var kk = kind;
          if (kind === 'lr') kk = i % 2 ? 'right' : 'left';
          if (kind === 'ud') kk = i % 2 ? 'down' : 'up';
          k.setAttribute('data-anim', kk); k.style.setProperty('--d', (i % 6) * step + 'ms');
        }
      });
    });
    var items = $$('[data-anim]');
    items.forEach(function (n) { var d = n.getAttribute('data-d'); if (d) n.style.setProperty('--d', d + 'ms'); });
    if (!('IntersectionObserver' in W)) { items.forEach(function (n) { n.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    items.forEach(function (n) { io.observe(n); });
  }

  /* counters */
  function counters() {
    var els = $$('[data-count]'); if (!els.length) return;
    function run(n) {
      var to = parseFloat(n.getAttribute('data-count')), dec = parseInt(n.getAttribute('data-dec') || '0', 10), pre = n.getAttribute('data-prefix') || '', suf = n.getAttribute('data-suffix') || '';
      var dur = 1800, t0 = performance.now();
      function f(now) {
        var p = Math.min(1, (now - t0) / dur), e = p === 1 ? 1 : 1 - Math.pow(2, -10 * p), v = to * e;
        n.textContent = pre + v.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + suf;
        if (p < 1) requestAnimationFrame(f);
      }
      if (reduce) n.textContent = pre + to.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + suf; else requestAnimationFrame(f);
    }
    if (!('IntersectionObserver' in W)) { els.forEach(run); return; }
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { run(e.target); io.unobserve(e.target); } }); }, { threshold: 0.4 });
    els.forEach(function (n) { io.observe(n); });
  }

  /* hover spotlight + tilt (mouse / pen only) */
  function pointerFx() {
    D.addEventListener('pointermove', function (e) {
      if (e.pointerType === 'touch') return;
      var grid = e.target.closest && e.target.closest('.spot-grid');
      if (grid) { $$('.spot', grid).forEach(function (c) { var r = c.getBoundingClientRect(); c.style.setProperty('--mx', (e.clientX - r.left) + 'px'); c.style.setProperty('--my', (e.clientY - r.top) + 'px'); }); }
      else { var s = e.target.closest && e.target.closest('.spot'); if (s) { var r2 = s.getBoundingClientRect(); s.style.setProperty('--mx', (e.clientX - r2.left) + 'px'); s.style.setProperty('--my', (e.clientY - r2.top) + 'px'); } }
      var t = e.target.closest && e.target.closest('.tilt');
      if (t) {
        if (!t.classList.contains('tilting')) t.classList.add('tilting');
        var r3 = t.getBoundingClientRect(), x = (e.clientX - r3.left) / r3.width, y = (e.clientY - r3.top) / r3.height;
        t.style.transform = 'perspective(900px) rotateX(' + ((.5 - y) * 12).toFixed(2) + 'deg) rotateY(' + ((x - .5) * 14).toFixed(2) + 'deg) translateZ(0)';
        t.style.setProperty('--gx', (x * 100) + '%'); t.style.setProperty('--gy', (y * 100) + '%');
      }
    }, { passive: true });
    D.addEventListener('pointerout', function (e) { var t = e.target.closest && e.target.closest('.tilt'); if (t && !t.contains(e.relatedTarget)) t.style.transform = ''; });
    $$('.tilt').forEach(function (t) { if (!$('.glare', t)) t.appendChild(el('span', 'glare')); });
  }

  /* marquees (horizontal + vertical) */
  function marquees() {
    var target = Math.max(1600, (W.screen && W.screen.width || 1400) * 1.15);
    $$('.marq-track').forEach(function (tr) {
      var kids = Array.prototype.slice.call(tr.children), guard = 0;
      while (tr.scrollWidth < target && guard++ < 8) kids.forEach(function (k) { tr.appendChild(k.cloneNode(true)); });
      Array.prototype.slice.call(tr.children).forEach(function (k) { var c = k.cloneNode(true); c.setAttribute('aria-hidden', 'true'); tr.appendChild(c); });
    });
    $$('.vm-col').forEach(function (col) {
      var kids = Array.prototype.slice.call(col.children), guard = 0;
      while (col.scrollHeight < 1500 && guard++ < 6) kids.forEach(function (k) { col.appendChild(k.cloneNode(true)); });
      Array.prototype.slice.call(col.children).forEach(function (k) { var c = k.cloneNode(true); c.setAttribute('aria-hidden', 'true'); c.setAttribute('tabindex', '-1'); col.appendChild(c); });
    });
  }

  /* decorative shapes injected per section */
  var POS = [[6, 10], [86, 8], [92, 62], [3, 72], [48, 88], [70, 30], [22, 40], [60, 6], [95, 88], [35, 92], [80, 50], [12, 92]];
  var SIZE = { hex: 84, tri: 70, ring: 110, dots: 120, plus: 30, diamond: 46, blob: 240, arc: 96, cube: 64 };
  function shapes() {
    $$('[data-shapes]').forEach(function (sec, si) {
      var list = sec.getAttribute('data-shapes').split(','), box = el('div', 'shapes'), r = rng(si * 97 + 13);
      list.forEach(function (t, i) {
        t = t.trim(); var p = POS[(i * 5 + si * 3) % POS.length], s = SIZE[t] || 60, sz = s * (0.8 + r() * 0.6);
        var n = el('span', 'sh sh-' + t);
        n.style.left = p[0] + '%'; n.style.top = p[1] + '%';
        n.style.width = 'min(' + sz.toFixed(0) + 'px,' + (sz / 9).toFixed(1) + 'vw)'; n.style.height = n.style.width;
        n.style.setProperty('--t', (8 + r() * 8).toFixed(1) + 's'); n.style.setProperty('--dl', (-r() * 8).toFixed(1) + 's');
        n.style.setProperty('--dx', ((r() - .5) * 40).toFixed(0) + 'px'); n.style.setProperty('--dy', (-14 - r() * 26).toFixed(0) + 'px'); n.style.setProperty('--r0', (r() * 40 - 20).toFixed(0) + 'deg');
        if (t === 'cube') { n.style.setProperty('--h', 'calc(' + n.style.width + ' / 2)'); n.innerHTML = '<div class="cb"><i></i><i></i><i></i><i></i><i></i><i></i></div>'; }
        if (t === 'plus') n.style.height = n.style.width;
        box.appendChild(n);
      });
      sec.insertBefore(box, sec.firstChild);
    });
  }

  /* circuit traces */
  function circuits() {
    $$('[data-circuit]').forEach(function (host, hi) {
      var r = rng(hi * 31 + 5), NS = 'http://www.w3.org/2000/svg', svg = D.createElementNS(NS, 'svg');
      svg.setAttribute('class', 'circuit'); svg.setAttribute('viewBox', '0 0 1200 700'); svg.setAttribute('preserveAspectRatio', 'xMidYMid slice'); svg.setAttribute('aria-hidden', 'true');
      var html = '';
      for (var i = 0; i < 11; i++) {
        var x = r() < .5 ? -20 : 1220, y = 40 + r() * 620, d = 'M' + x + ' ' + y.toFixed(0), dir = x < 0 ? 1 : -1, steps = 4 + Math.floor(r() * 3);
        for (var s = 0; s < steps; s++) {
          var len = 60 + r() * 150; x += dir * len; d += ' L' + x.toFixed(0) + ' ' + y.toFixed(0);
          var dy = (r() < .5 ? -1 : 1) * (40 + r() * 90); if (y + dy < 20 || y + dy > 680) dy = -dy; x += dir * Math.abs(dy) * .6; y += dy; d += ' L' + x.toFixed(0) + ' ' + y.toFixed(0);
        }
        html += '<path d="' + d + '"/><circle cx="' + x.toFixed(0) + '" cy="' + y.toFixed(0) + '" r="3.5"/><path class="pl' + (i % 4 === 0 ? ' gd' : '') + '" pathLength="1400" d="' + d + '" style="--d:' + (5 + r() * 6).toFixed(1) + 's;--dl:' + (-r() * 8).toFixed(1) + 's"/>';
      }
      svg.innerHTML = html; host.insertBefore(svg, host.firstChild);
    });
  }

  /* 3D city */
  function city() {
    $$('[data-city]').forEach(function (root) {
      var seed = parseInt(root.getAttribute('data-seed') || '7', 10), r = rng(seed), N = 5, cell = 6, html = '';
      var cls = ['', 'g', 'g2', 'g g2', '', 'g'];
      for (var gx = 0; gx < N; gx++) for (var gy = 0; gy < N; gy++) {
        var c = (gx === 2 && gy === 2), w = c ? 3.6 : 2 + r() * 2.2, dd = c ? 3.6 : 2 + r() * 2.2;
        if (!c && r() < .14) continue;
        var dist = Math.abs(gx - 2) + Math.abs(gy - 2), h = c ? 15 : Math.max(2.4, (9 - dist * 1.5) * (.55 + r() * .8));
        var extra = c ? 'tw g' : (r() < .12 ? 'gn' : r() < .1 ? 'tw' : cls[Math.floor(r() * cls.length)]);
        html += '<div class="b ' + extra + '" style="left:' + (gx * cell + (cell - w) / 2).toFixed(2) + 'em;top:' + (gy * cell + (cell - dd) / 2).toFixed(2) + 'em;width:' + w.toFixed(2) + 'em;height:' + dd.toFixed(2) + 'em;--h:' + h.toFixed(2) + 'em"><i class="t"></i><i class="f"></i><i class="k"></i><i class="l"></i><i class="r"></i></div>';
      }
      var roads = '', k;
      for (k = 1; k < N; k++) roads += '<line x1="' + (k * 60) + '" y1="0" x2="' + (k * 60) + '" y2="300" stroke="rgba(56,213,245,.35)" stroke-width="1.5" stroke-dasharray="6 8"><animate attributeName="stroke-dashoffset" from="0" to="-56" dur="' + (2 + k * .4) + 's" repeatCount="indefinite"/></line><line x1="0" y1="' + (k * 60) + '" x2="300" y2="' + (k * 60) + '" stroke="rgba(255,200,87,.3)" stroke-width="1.5" stroke-dasharray="4 10"><animate attributeName="stroke-dashoffset" from="0" to="-56" dur="' + (2.6 + k * .3) + 's" repeatCount="indefinite"/></line>';
      var cars = '';
      for (k = 0; k < 5; k++) { var lane = 60 * (1 + Math.floor(r() * 4)), rev = r() < .5; cars += '<circle r="3" fill="' + (k % 2 ? '#ffc857' : '#38d5f5') + '"><animate attributeName="' + (k % 2 ? 'cx' : 'cy') + '" values="' + (rev ? '300;0' : '0;300') + '" dur="' + (4 + r() * 4).toFixed(1) + 's" repeatCount="indefinite"/><set attributeName="' + (k % 2 ? 'cy' : 'cx') + '" to="' + lane + '"/></circle>'; }
      var pulse = '<circle cx="150" cy="150" r="10" fill="none" stroke="#38d5f5" stroke-width="2"><animate attributeName="r" values="10;140" dur="4s" repeatCount="indefinite"/><animate attributeName="opacity" values=".8;0" dur="4s" repeatCount="indefinite"/></circle>';
      var tags = (root.getAttribute('data-tags') || 'fa-tower-broadcast|IoT nodes|fa-wind|Air: Good|fa-traffic-light|Traffic flow').split('|'), pos = [['4em', '-4em', '19em'], ['24em', '10em', '15em'], ['-6em', '22em', '11em']], bills = '';
      for (k = 0; k < 3; k++) bills += '<div class="bill" style="--x:' + pos[k][0] + ';--y:' + pos[k][1] + ';--z:' + pos[k][2] + '"><div class="chip3d">' + I(tags[k * 2]) + tags[k * 2 + 1] + '</div></div>';
      root.classList.add('scene'); root.setAttribute('aria-hidden', 'true');
      root.innerHTML = '<div class="glow"></div><div class="world"><div class="ground"><svg viewBox="0 0 300 300">' + roads + pulse + cars + '</svg></div>' + html + bills + '</div>';
    });
  }

  /* other 3D objects */
  function objects() {
    $$('[data-obj]').forEach(function (root) {
      var t = root.getAttribute('data-obj'), ic = (root.getAttribute('data-icons') || '').split(','), out = '';
      if (t === 'gyro') out = '<div class="glow"></div><div class="gyro"><i class="gy a"></i><i class="gy b2"></i><i class="gy c"></i></div><div class="core">' + I(ic[0] || 'fa-layer-group') + '</div>';
      if (t === 'cube') out = '<div class="glow"></div><div class="cube3d">' + [0, 1, 2, 3, 4, 5].map(function (i) { return '<div>' + I(ic[i % ic.length] || 'fa-city') + '</div>'; }).join('') + '</div><div class="cube-shadow"></div>';
      if (t === 'stack') out = '<div class="glow"></div><div class="stack"><div class="slab s1">' + I(ic[0] || 'fa-road') + '</div><div class="slab s2">' + I(ic[1] || 'fa-bolt') + '</div><div class="slab s3">' + I(ic[2] || 'fa-wifi') + '</div></div>';
      if (t === 'globe') out = '<div class="glow"></div><div class="globe"><i class="ln"></i><i class="ln"></i><i class="ln"></i><i class="ln"></i><span class="lt" style="top:30%"></span><span class="lt" style="top:50%"></span><span class="lt" style="top:70%"></span><span class="land" style="left:18%;top:26%;width:26%;height:18%"></span><span class="land" style="left:40%;top:52%;width:22%;height:22%;animation-delay:-5s"></span><span class="land" style="left:8%;top:60%;width:16%;height:12%;animation-delay:-9s"></span></div><div class="orbit">' + ic.slice(0, 3).map(function (n, i) { return '<i style="' + (i === 0 ? '' : 'left:' + (i === 1 ? '90%' : '10%') + ';top:' + (i === 1 ? '70%' : '78%')) + '">' + I(n) + '</i>'; }).join('') + '</div>';
      root.classList.add('scene'); root.setAttribute('aria-hidden', 'true'); root.innerHTML = out;
    });
  }

  /* video players */
  function videos() {
    $$('[data-video]').forEach(function (box) {
      var v = $('video', box), btn = $('[data-vplay]', box), mute = $('[data-vmute]', box), userPaused = false;
      if (!v) return;
      v.muted = true; v.loop = true; v.setAttribute('playsinline', ''); v.playsInline = true;
      function sync() { if (btn) { var ic = $('i', btn); ic.className = 'fa-solid ' + (v.paused ? 'fa-play' : 'fa-pause'); btn.setAttribute('aria-label', v.paused ? 'Play video' : 'Pause video'); } }
      function play() { var p = v.play(); if (p && p.catch) p.catch(function () { }); }
      if (btn) btn.addEventListener('click', function () { if (v.paused) { userPaused = false; play(); } else { userPaused = true; v.pause(); } sync(); });
      if (mute) mute.addEventListener('click', function () { v.muted = !v.muted; var ic = $('i', mute); ic.className = 'fa-solid ' + (v.muted ? 'fa-volume-xmark' : 'fa-volume-high'); mute.setAttribute('aria-label', v.muted ? 'Unmute' : 'Mute'); });
      v.addEventListener('play', sync); v.addEventListener('pause', sync);
      if ('IntersectionObserver' in W) new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { if (!userPaused && !reduce) play(); } else v.pause(); }); }, { threshold: 0.25 }).observe(box);
      else if (!reduce) play();
      sync();
    });
  }

  /* slider */
  function sliders() {
    $$('[data-slider]').forEach(function (sl) {
      var track = $('.slides', sl), slides = $$('.slide', track), dotsBox = $('.dots', sl), idx = 0, per = 3, timer, sx = null;
      function calc() { per = W.innerWidth >= 1024 ? 3 : W.innerWidth >= 640 ? 2 : 1; sl.style.setProperty('--per', per); build(); go(Math.min(idx, slides.length - per)); }
      function pages() { return Math.max(1, slides.length - per + 1); }
      function build() { dotsBox.innerHTML = ''; for (var i = 0; i < pages(); i++) { (function (i) { var b = el('button'); b.type = 'button'; b.setAttribute('aria-label', 'Go to slide ' + (i + 1)); b.addEventListener('click', function () { go(i); restart(); }); dotsBox.appendChild(b); })(i); } }
      function go(i) { idx = (i + pages()) % pages(); track.style.transform = 'translateX(' + (-idx * 100 / per) + '%)'; $$('button', dotsBox).forEach(function (b, n) { b.classList.toggle('on', n === idx); }); }
      function restart() { clearInterval(timer); if (!reduce) timer = setInterval(function () { go(idx + 1); }, 6000); }
      var pv = $('[data-prev]', sl), nx = $('[data-next]', sl);
      if (pv) pv.addEventListener('click', function () { go(idx - 1); restart(); });
      if (nx) nx.addEventListener('click', function () { go(idx + 1); restart(); });
      sl.addEventListener('mouseenter', function () { clearInterval(timer); }); sl.addEventListener('mouseleave', restart);
      track.addEventListener('pointerdown', function (e) { sx = e.clientX; });
      W.addEventListener('pointerup', function (e) { if (sx === null) return; var dx = e.clientX - sx; sx = null; if (Math.abs(dx) > 50) { go(idx + (dx < 0 ? 1 : -1)); restart(); } });
      W.addEventListener('resize', calc); calc(); restart();
    });
  }

  /* tabs / filters / accordion / pins */
  function ui() {
    $$('[data-filters]').forEach(function (g) {
      var scope = $(g.getAttribute('data-filters')) || D;
      $$('[data-filter]', g).forEach(function (b) {
        b.addEventListener('click', function () {
          $$('[data-filter]', g).forEach(function (x) { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', String(x === b)); });
          var f = b.getAttribute('data-filter');
          $$('[data-cat]', scope).forEach(function (c) { var show = f === 'all' || c.getAttribute('data-cat').split(' ').indexOf(f) > -1; c.classList.toggle('hide', !show); if (show) { c.classList.remove('pop'); void c.offsetWidth; c.classList.add('pop'); c.classList.add('in'); } });
        });
      });
    });
    $$('[data-tabs]').forEach(function (g) {
      var scope = $(g.getAttribute('data-tabs')) || D;
      $$('[data-tab]', g).forEach(function (b) {
        b.addEventListener('click', function () {
          $$('[data-tab]', g).forEach(function (x) { x.classList.toggle('on', x === b); x.setAttribute('aria-selected', String(x === b)); });
          $$('[data-panel]', scope).forEach(function (p) { p.classList.toggle('on', p.getAttribute('data-panel') === b.getAttribute('data-tab')); });
        });
      });
    });
    $$('.acc-q').forEach(function (q) {
      q.addEventListener('click', function () { var it = q.parentNode, open = !it.classList.contains('open'); var grp = it.parentNode; $$('.acc-item.open', grp).forEach(function (o) { if (o !== it) { o.classList.remove('open'); $('.acc-q', o).setAttribute('aria-expanded', 'false'); } }); it.classList.toggle('open', open); q.setAttribute('aria-expanded', String(open)); });
    });
    $$('.pin>button').forEach(function (b) { b.addEventListener('click', function (e) { e.stopPropagation(); var p = b.parentNode, on = !p.classList.contains('on'); $$('.pin.on').forEach(function (x) { x.classList.remove('on'); }); p.classList.toggle('on', on); }); });
    D.addEventListener('click', function () { $$('.pin.on').forEach(function (x) { x.classList.remove('on'); }); });
  }

  /* generic forms + newsletter + pledge */
  function forms() {
    function check(f) {
      var ok = true;
      $$('.field', f).forEach(function (fl) {
        var i = $('input,select,textarea', fl); if (!i) return; var v = i.value.trim(), bad = false, m = $('.msg', fl);
        if (i.required && !v) bad = true; if (i.type === 'email' && v && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) bad = true;
        if (i.type === 'email' && v && i.getAttribute('data-gmail-only') !== null && !/^[^\s@]+@gmail\.com$/i.test(v)) { bad = true; if (m) m.textContent = 'Only Gmail addresses are allowed'; }
        else if (i.type === 'email' && m && m.textContent === 'Only Gmail addresses are allowed') m.textContent = 'Enter a valid email address.';
        if (i.getAttribute('data-alpha-only') !== null && v && !/^[A-Za-z\s'-]+$/.test(v)) { bad = true; if (m) m.textContent = 'Only alphabets are allowed'; }
        else if (i.getAttribute('data-alpha-only') !== null && m && m.textContent === 'Only alphabets are allowed') m.textContent = 'Please enter your name.';
        if (i.type === 'checkbox' && i.required && !i.checked) bad = true;
        fl.classList.toggle('err', bad); fl.classList.toggle('ok', !bad && !!v); if (bad) ok = false;
      });
      return ok;
    }
    $$('form[data-form]').forEach(function (f) {
      f.setAttribute('novalidate', '');
      $$('input,select,textarea', f).forEach(function (i) { i.addEventListener('input', function () { var fl = i.closest('.field'); if (fl && fl.classList.contains('err')) check(f); }); });
      f.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!check(f)) { Stk.toast('Please check the highlighted fields', 'err'); var b = $('.field.err input,.field.err select,.field.err textarea', f); if (b) b.focus(); return; }
        location.href = '404.html';
      });
    });
    $$('form[data-newsletter]').forEach(function (f) {
      var msg = $('.nws-msg', f);
      function setMsg(t) { if (msg) { msg.textContent = t || ''; msg.classList.toggle('show', !!t); } }
      f.addEventListener('submit', function (e) {
        e.preventDefault(); var i = $('input', f); var v = i.value.trim();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) { setMsg('Enter a valid email address'); i.focus(); return; }
        if (!/^[^\s@]+@gmail\.com$/i.test(v)) { setMsg('Only Gmail addresses are allowed'); i.focus(); return; }
        setMsg(''); location.href = f.getAttribute('data-sub-link') || '404.html';
      });
      if (f.classList.contains('news-form') || f.closest('.ft-news')) { $('input', f).addEventListener('input', function () { if (msg && msg.classList.contains('show')) setMsg(''); }); }
    });
    $$('[data-pledge]').forEach(function (b) {
      var out = $(b.getAttribute('data-pledge')), base = 18420, mine = Stk.store.get('stk_pledged', false);
      function paint() { if (out) out.textContent = (base + (mine ? 1 : 0)).toLocaleString('en-US'); b.disabled = mine; if (mine) b.innerHTML = I('fa-circle-check') + 'Thank you for pledging'; }
      b.addEventListener('click', function () { location.href = '404.html'; });
      paint();
    });
  }


  /* password eye toggle: exactly one per field, identical in every browser */
  function pwToggles() {
    $$('.inp.pw').forEach(function (wrap) {
      var btns = $$('.pw-btn', wrap); btns.slice(1).forEach(function (b) { b.remove(); });
      var input = $('input', wrap), btn = btns[0]; if (!input || !btn) return;
      btn.addEventListener('mousedown', function (e) { e.preventDefault(); });
      btn.addEventListener('click', function () {
        var show = input.type === 'password', s = input.selectionStart, e = input.selectionEnd;
        input.type = show ? 'text' : 'password';
        try { input.setSelectionRange(s, e); } catch (x) {}
        $('i', btn).className = 'fa-solid ' + (show ? 'fa-eye-slash' : 'fa-eye');
        btn.setAttribute('aria-pressed', String(show)); btn.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
        input.focus({ preventScroll: true });
      });
    });
  }
  Stk.pwToggles = pwToggles;

  Stk.fx = function () {
    pwToggles();
    shapes(); circuits(); city(); objects(); marquees(); pointerFx(); ui(); forms(); sliders(); videos();
    Stk.onReady(function () { reveal(); counters(); });
  };
})();
/* ---------- return-to-section (404 go back) + init ---------- */
(function () {
  'use strict';
  var W = window, D = document, H = D.documentElement, Stk = W.Stk, $ = Stk.$, $$ = Stk.$$, store = Stk.store;

  function saveReturn() {
    var y = W.pageYOffset || H.scrollTop, hdr = $('#siteHeader'), hh = hdr ? hdr.offsetHeight : 0, best = null;
    $$('main section[id]').forEach(function (s) { if (s.getBoundingClientRect().top + y <= y + hh + 4) best = s; });
    var st = {
      page: Stk.page, url: location.href, y: y, w: W.innerWidth,
      sec: best ? best.id : '', off: best ? y - (best.getBoundingClientRect().top + y) : 0,
      ft: Stk.footerOpen(), t: Date.now()
    };
    store.sset('stk_return', JSON.stringify(st));
  }
  // any link that leads to the 404 page remembers exactly where the visitor was
  D.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (a && /(^|\/)404\.html(#.*)?$/.test(a.getAttribute('href'))) saveReturn();
  }, true);

  function applyRestore(st, hidden) {
    H.classList.add('no-smooth');
    if (st.ft !== null && st.ft !== undefined) Stk.setFooter(st.ft);
    function target() {
      if (st.w === W.innerWidth || !st.sec) return st.y;
      var s = D.getElementById(st.sec);
      return s ? s.getBoundingClientRect().top + (W.pageYOffset || 0) + st.off : st.y;
    }
    function go() { W.scrollTo(0, target()); }
    go();
    $$('[data-anim]').forEach(function (n) { if (n.getBoundingClientRect().top < W.innerHeight * 1.05) n.classList.add('in'); });
    if (hidden) Stk.ready();
    var n = 0; (function loop() { go(); if (++n < 8) setTimeout(loop, 90); })();
    W.addEventListener('load', go);
    if (D.fonts && D.fonts.ready) D.fonts.ready.then(go);
    setTimeout(function () {
      go(); H.classList.remove('is-restoring'); H.classList.remove('no-smooth'); store.sdel('stk_restore');
      D.dispatchEvent(new Event('scroll'));
    }, hidden ? 650 : 100);
  }

  // page restored from the back/forward cache
  W.addEventListener('pageshow', function (e) {
    if (!e.persisted) return;
    var raw = store.sget('stk_restore'), st = null; try { st = JSON.parse(raw); } catch (x) {}
    if (st && st.page === Stk.page) applyRestore(st, false);
  });

  // 404 page: go back to the exact previous section
  function bindGoBack() {
    $$('[data-goback]').forEach(function (b) {
      b.addEventListener('click', function (e) {
        e.preventDefault();
        var raw = store.sget('stk_return'), st = null; try { st = JSON.parse(raw); } catch (x) {}
        if (st && st.url && Date.now() - (st.t || 0) < 30 * 60 * 1000) {
          store.sset('stk_restore', raw);
          if (W.history.length > 1) {
            W.history.back();
            setTimeout(function () { if (Stk.page === '404') W.location.replace(st.url); }, 900);
          } else W.location.replace(st.url);
        } else if (W.history.length > 1) { W.history.back(); setTimeout(function () { W.location.href = 'index.html'; }, 900); }
        else W.location.href = 'index.html';
      });
    });
  }

  Stk.init = function () {
    Stk.initChrome(); Stk.fx(); bindGoBack();
    Stk.runLoader();
    if (W.__stkRestore) applyRestore(W.__stkRestore, true);
  };
  if (D.readyState === 'loading') D.addEventListener('DOMContentLoaded', Stk.init); else Stk.init();
})();
