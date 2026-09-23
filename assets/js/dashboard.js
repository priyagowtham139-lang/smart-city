/* =========================================================
   STACKLY - dashboard.js : shared shell + user and admin panels
   Demo data lives in this browser only (localStorage).
   ========================================================= */
(function () {
  'use strict';
  var W = window, D = document, Stk = W.Stk, $ = Stk.$, $$ = Stk.$$, store = Stk.store, C = Stk.charts, I = Stk.ICON;
  var role = D.body.getAttribute('data-role');
  var sess = Stk.session();
  if (!sess) { location.replace('login.html'); return; }
  if (sess.role !== role) { location.replace(Stk.dashFor(sess)); return; }
  var el = function (t, c, h) { var e = D.createElement(t); if (c) e.className = c; if (h) e.innerHTML = h; return e; };
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var initials = function (n) { return n.split(/\s+/).map(function (w) { return w[0]; }).join('').slice(0, 2).toUpperCase(); };
  var money = function (n) { return '$' + Number(n).toFixed(2).replace(/\.00$/, ''); };
  var bind = function (k, v) { $$('[data-bind="' + k + '"]').forEach(function (n) { n.textContent = v; }); };
  var rnd = function (a, b) { return a + Math.random() * (b - a); };

  /* ---------------- shell ---------------- */
  var dash = $('#dash'), main = $('#main'), panels = $$('.dpanel', main);
  var nav = panels.map(function (p) { return { id: p.id, title: p.getAttribute('data-title'), icon: p.getAttribute('data-icon') }; });
  function navHTML() {
    return nav.map(function (n, i) { return '<li style="--i:' + i + '"><a href="#' + n.id + '" data-nav="' + n.id + '"><span class="mi">' + I(n.icon) + '</span><span>' + n.title + '</span>' + I('fa-chevron-right', 'go') + '</a></li>'; }).join('');
  }
  var roleLabel = role === 'admin' ? 'Administrator' : 'Citizen', roleIcon = role === 'admin' ? 'fa-user-shield' : 'fa-user';
  var userBlock = '<div class="side-user"><span class="av">' + initials(sess.name) + '</span><div><b>' + esc(sess.name) + '</b><small>' + esc(sess.email) + '</small></div></div>';

  var side = el('aside', 'dash-side');
  side.setAttribute('aria-label', 'Dashboard navigation');
  side.innerHTML = '<span class="side-role">' + I(roleIcon) + roleLabel + ' account</span>' + userBlock + '<ul class="m-list" role="list">' + navHTML() + '</ul>' +
    '<div class="side-foot"><a class="btn btn-ghost btn-sm" href="index.html">' + I('fa-globe') + 'Back to website</a><button class="btn btn-sm" type="button" data-logout>' + I('fa-right-from-bracket') + 'Sign out</button></div>';

  var top = el('header', 'dash-top');
  top.innerHTML = '<div class="ttl"><h1 id="dTitle">Overview</h1></div>' +
    '<a class="logo" href="index.html" aria-label="Stackly home"><img src="assets/img/logo_white.webp" alt="Stackly" width="192" height="56"></a>' +
    '<div class="right"><button class="ibtn" type="button" data-open="notes" aria-label="Notifications" style="position:relative">' + I('fa-bell') + '<span class="dot-badge"></span></button>' +
    '<button class="burger" type="button" data-open="menu" aria-label="Open menu" aria-expanded="false" aria-controls="mnav"><span></span><span></span><span></span></button></div>';

  var wrap = el('div', 'dash-main'); dash.insertBefore(wrap, main); wrap.appendChild(top); wrap.appendChild(main); dash.insertBefore(side, wrap);

  var m = el('div', 'sheet'); m.id = 'mnav';
  m.innerHTML = '<div class="sheet-back" data-close></div><aside class="sheet-panel" role="dialog" aria-modal="true" aria-label="Dashboard menu"><div class="sheet-head"><img src="assets/img/logo_white.webp" alt="Stackly" width="192" height="56"><button class="sheet-close" type="button" data-close aria-label="Close menu">' + I('fa-xmark') + '</button></div>' +
    '<div class="sheet-body"><span class="side-role" style="margin-bottom:14px">' + I(roleIcon) + roleLabel + ' account</span>' + userBlock + '<ul class="m-list" style="margin-top:16px" role="list">' + navHTML() + '</ul>' +
    '<div class="m-actions"><a class="btn btn-ghost btn-block" href="index.html">' + I('fa-globe') + 'Website</a><button class="btn btn-block" type="button" data-logout>' + I('fa-right-from-bracket') + 'Sign out</button></div></div></aside>';
  D.body.appendChild(m);

  var notes = role === 'admin' ?
    [['fa-triangle-exclamation', 'Sensor S-4471 offline', 'Riverside water pressure, 12 minutes ago'], ['fa-user-plus', '38 new registrations', 'Since yesterday evening'], ['fa-ticket', '7 requests near deadline', 'Assign an officer today']] :
    [['fa-bolt', 'Planned power work', 'Greenfield, Thursday 10:00 to 13:00'], ['fa-file-invoice-dollar', 'Water bill due soon', 'Due 28 September'], ['fa-circle-check', 'Request STK-26-3011 updated', 'A crew has been assigned']];
  var ns = el('div', 'sheet'); ns.id = 'sheet-notes';
  ns.innerHTML = '<div class="sheet-back" data-close></div><aside class="sheet-panel" role="dialog" aria-modal="true" aria-label="Notifications"><div class="sheet-head"><h3>' + I('fa-bell') + 'Notifications</h3><button class="sheet-close" type="button" data-close aria-label="Close notifications">' + I('fa-xmark') + '</button></div><div class="sheet-body">' +
    notes.map(function (n) { return '<div class="note-item">' + I(n[0]) + '<div><b>' + n[1] + '</b><small>' + n[2] + '</small></div></div>'; }).join('') + '</div></aside>';
  D.body.appendChild(ns);

  $$('[data-user-first]').forEach(function (n) { n.textContent = sess.name.split(' ')[0]; });

  function show(id) {
    var p = panels.filter(function (x) { return x.id === id; })[0] || panels[0]; id = p.id;
    panels.forEach(function (x) { x.classList.toggle('on', x === p); });
    $$('[data-nav]').forEach(function (a) { var on = a.getAttribute('data-nav') === id; a.classList.toggle('is-active', on); if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
    $('#dTitle').textContent = p.getAttribute('data-title'); D.title = p.getAttribute('data-title') + ' | Stackly Smart City';
    D.documentElement.classList.add('no-smooth'); W.scrollTo(0, 0); setTimeout(function () { D.documentElement.classList.remove('no-smooth'); }, 60);
    Stk.closeSheet();
  }
  D.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a || a.getAttribute('href').length < 2) return;
    var id = a.getAttribute('href').slice(1); if (!panels.some(function (x) { return x.id === id; })) return;
    e.preventDefault(); if (location.hash !== '#' + id) history.pushState(null, '', '#' + id); show(id);
  });
  W.addEventListener('popstate', function () { show(location.hash.slice(1)); });
  W.addEventListener('hashchange', function () { show(location.hash.slice(1)); });

  /* action buttons + form submits go to 404 (demo staging) */
  var keepNav = function (t) { return t.hasAttribute('data-logout') || t.hasAttribute('data-close') || t.getAttribute('href') === 'index.html'; };
  D.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('.btn');
    if (!t || keepNav(t)) return;
    e.preventDefault();
    setTimeout(function () { location.href = '404.html'; }, 300);
  });
  D.addEventListener('submit', function (e) {
    var f = e.target.closest && e.target.closest('form');
    if (!f || ['reqForm', 'profForm', 'adminPassForm'].indexOf(f.id) === -1) return;
    e.preventDefault();
    setTimeout(function () { location.href = '404.html'; }, 300);
  });

  /* generic helpers */
  function pill(text, cls) { return '<span class="pill ' + (cls || '') + '">' + text + '</span>'; }
  function toastOk(t) { Stk.toast(t); }

  /* ---------------- USER ---------------- */
  function userDash() {
    var bills = store.get('stk_bills', [
      { id: 'B-2091', name: 'Electricity', icon: 'fa-bolt', period: 'Aug 2026', amt: 48, due: '30 Sep 2026', paid: false },
      { id: 'B-2092', name: 'Water', icon: 'fa-droplet', period: 'Aug 2026', amt: 21, due: '28 Sep 2026', paid: false },
      { id: 'B-2093', name: 'Waste service', icon: 'fa-recycle', period: 'Q3 2026', amt: 9, due: '05 Oct 2026', paid: false },
      { id: 'B-2088', name: 'Metro and bus pass', icon: 'fa-train-subway', period: 'Sep 2026', amt: 32, due: '01 Sep 2026', paid: true },
      { id: 'B-2075', name: 'Property tax', icon: 'fa-house-chimney', period: 'Q3 2026', amt: 118, due: '15 Aug 2026', paid: true },
      { id: 'B-2061', name: 'Electricity', icon: 'fa-bolt', period: 'Jul 2026', amt: 44, due: '31 Aug 2026', paid: true }
    ]);
    var reqs = store.get('stk_requests', [
      { id: 'STK-26-3011', type: 'Streetlight or road fault', text: 'Streetlight out near Lake View Road', step: 3, date: '16 Sep' },
      { id: 'STK-26-2984', type: 'Waste collection', text: 'Bulky item pickup requested', step: 2, date: '12 Sep' },
      { id: 'STK-26-2790', type: 'Certificate or permit', text: 'Residence certificate copy', step: 4, date: '2 Sep' }
    ]);
    var STEP = ['Received', 'Assigned', 'In progress', 'Resolved'];
    function totals() {
      var due = 0, cnt = 0, paid = 0; bills.forEach(function (b) { if (b.paid) paid += b.amt; else { due += b.amt; cnt++; } });
      bind('due', money(due)); bind('dueCount', cnt); bind('paid', money(paid)); bind('openReq', reqs.filter(function (r) { return r.step < 4; }).length);
    }
    function paintBills() {
      $('#billRows').innerHTML = bills.map(function (b) {
        return '<tr><td data-label="Bill"><span class="who"><span class="av" style="width:36px;height:36px;border-radius:11px">' + I(b.icon) + '</span><span><b style="color:var(--head);display:block;line-height:1.2">' + b.name + '</b><small class="muted">' + b.id + '</small></span></span></td><td data-label="Period">' + b.period + '</td><td data-label="Amount"><b style="color:var(--head)">' + money(b.amt) + '</b></td><td data-label="Due date">' + b.due + '</td><td data-label="Status">' + (b.paid ? pill('Paid', 'green') : pill('Due', 'gold')) + '</td><td data-label="Action">' + (b.paid ? '<button class="btn btn-ghost btn-sm" type="button" data-receipt="' + b.id + '">' + I('fa-download') + 'Receipt</button>' : '<button class="btn btn-sm" type="button" data-pay="' + b.id + '">' + I('fa-credit-card') + 'Pay now</button>') + '</td></tr>';
      }).join('');
      totals(); store.set('stk_bills', bills);
    }
    D.addEventListener('click', function (e) {
      var p = e.target.closest('[data-pay]'), r = e.target.closest('[data-receipt]');
      if (p) { var b = bills.filter(function (x) { return x.id === p.getAttribute('data-pay'); })[0]; b.paid = true; paintBills(); toastOk(b.name + ' bill paid. Thank you.'); }
      if (r) toastOk('Receipt downloaded (demo)');
    });
    paintBills();

    function paintReqs() {
      $('#reqList').innerHTML = reqs.map(function (r) {
        var cls = r.step >= 4 ? 'm' : r.step >= 2 ? '' : 'g';
        return '<li style="grid-template-columns:42px minmax(0,1fr) auto"><span class="ic ' + cls + '">' + I(r.step >= 4 ? 'fa-circle-check' : 'fa-ticket') + '</span><div><b>' + esc(r.type) + '</b><small>' + esc(r.text) + '<br>' + r.id + ' &middot; ' + r.date + '</small><div class="stepper">' + [1, 2, 3, 4].map(function (n) { return '<i class="' + (n <= r.step ? 'on' : '') + '"></i>'; }).join('') + '</div></div>' + pill(STEP[r.step - 1], r.step >= 4 ? 'green' : r.step >= 2 ? '' : 'gold') + '</li>';
      }).join('');
      totals(); store.set('stk_requests', reqs);
    }
    paintReqs();
    var rf = $('#reqForm');
    rf.setAttribute('novalidate', '');
    rf.addEventListener('submit', function (e) {
      e.preventDefault(); var t = $('#rType'), x = $('#rText'), ok = true;
      [t, x].forEach(function (i) { var bad = !i.value.trim(); i.closest('.field').classList.toggle('err', bad); if (bad) ok = false; });
      if (!ok) { Stk.toast('Please complete both fields', 'err'); return; }
      var n = 3012 + reqs.length; reqs.unshift({ id: 'STK-26-' + n, type: t.value, text: x.value.trim(), step: 1, date: 'Today' });
      paintReqs(); rf.reset(); toastOk('Request STK-26-' + n + ' submitted');
    });

    var svc = [
      ['fa-square-parking', 'Smart Parking Pass', 'Active', 'green', 'Renews 30 Sep', true], ['fa-train-subway', 'Metro and Bus Pass', 'Active', 'green', 'Renews 1 Oct', true],
      ['fa-charging-station', 'EV Charging Plan', 'Paused', 'gold', 'Resume any time', false], ['fa-plug-circle-bolt', 'Home Energy Kit', 'Active', 'green', 'Installed 12 Aug', true],
      ['fa-recycle', 'Waste Pickup Plus', 'Active', 'green', 'Next pickup Tuesday', true], ['fa-heart-pulse', 'Health Card', 'Active', 'green', 'Valid to Mar 2027', true]
    ];
    $('#mySvc').innerHTML = svc.map(function (s, i) { return '<article class="card lift" style="display:grid;gap:10px"><div style="display:flex;justify-content:space-between;align-items:start;gap:10px"><div class="icon-box" style="margin:0">' + I(s[0]) + '</div>' + pill(s[2], s[3]) + '</div><h3 style="margin:0">' + s[1] + '</h3><p style="margin:0">' + s[4] + '</p><div class="set-row" style="padding:12px 0 0;border:0;border-top:1px dashed var(--line)"><div><b style="font-size:.92rem">Auto-renew</b></div><label class="sw"><input type="checkbox" ' + (s[5] ? 'checked' : '') + ' aria-label="Auto-renew ' + s[1] + '"><span></span></label></div></article>'; }).join('');

    var buses = [{ no: '42', to: 'Airport', via: 'via Civic Square', eta: 180, load: 62 }, { no: '17', to: 'Greenfield', via: 'via Old Town', eta: 420, load: 35 }, { no: 'M3', to: 'Harbour Ward', via: 'Metro Line 3', eta: 95, load: 78 }, { no: '8', to: 'Riverside', via: 'via Lake View', eta: 660, load: 24 }];
    var bl = $('#busList');
    function paintBus() {
      bl.innerHTML = buses.map(function (b) { var mins = Math.max(0, Math.ceil(b.eta / 60)); return '<div class="bus"><span class="no">' + b.no + '</span><div><b>To ' + b.to + '</b><small>' + b.via + '</small><div class="meter" style="height:6px;margin-top:8px;--mc:' + (b.load > 70 ? 'var(--grad-warm)' : 'var(--grad)') + '"><i style="width:' + b.load + '%"></i></div></div><div class="eta">' + (mins === 0 ? 'Now' : mins) + '<small>' + (mins === 0 ? 'arriving' : 'min') + '</small></div></div>'; }).join('');
    }
    paintBus();
    setInterval(function () { if (D.hidden) return; buses.forEach(function (b) { b.eta -= 2; if (b.eta < -20) { b.eta = Math.round(rnd(300, 900)); b.load = Math.round(rnd(20, 85)); } }); paintBus(); }, 2000);

    var users = store.get('stk_users', []), me = users.filter(function (u) { return u.email === sess.email; })[0];
    $('#pName').value = sess.name; $('#pEmail').value = sess.email; $('#pPhone').value = store.get('stk_phone_' + sess.email, '');
    $('#profForm').addEventListener('submit', function (e) {
      e.preventDefault(); var n = $('#pName'); var bad = n.value.trim().length < 2; n.closest('.field').classList.toggle('err', bad); if (bad) return;
      sess.name = n.value.trim(); store.set('stk_session', sess); store.set('stk_phone_' + sess.email, $('#pPhone').value.trim());
      if (me) { me.name = sess.name; if ($('#pPass').value.length >= 8) me.pass = $('#pPass').value; store.set('stk_users', users); }
      $$('.side-user b').forEach(function (b) { b.textContent = sess.name; }); $$('.av').forEach(function (a) { a.textContent = initials(sess.name); }); $$('[data-user-first]').forEach(function (x) { x.textContent = sess.name.split(' ')[0]; });
      toastOk('Profile saved');
    });

    C.line($('#uEnergy'), { label: 'Daily energy use', labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'], series: [{ name: 'kWh', color: '#38d5f5', data: [8.2, 7.6, 7.9, 8.8, 7.1, 6.9, 7.4, 8.1, 7.0, 6.6, 6.8, 6.4] }] });
    C.donut($('#uSpend'), [{ v: 62, c: '#38d5f5' }, { v: 48, c: '#ffc857' }, { v: 21, c: '#7b8cff' }, { v: 9, c: '#5eead4' }], { big: '$140', small: 'this month', label: 'Spending by service' });
  }

  /* ---------------- ADMIN ---------------- */
  function adminDash() {
    var seed = [['Meera Iyer', 'meera.iyer@mail.city', 'user', 'Jan 2025', 1], ['Daniel Okoye', 'daniel@okoye-bakery.city', 'user', 'Mar 2025', 1], ['Priya Nair', 'priya.nair@mail.city', 'user', 'Apr 2025', 1], ['Dr. Arjun Rao', 'arjun.rao@stackly.city', 'admin', 'Jun 2019', 1], ['Sofia Marin', 'sofia.marin@mail.city', 'user', 'Jul 2025', 0], ['Kwame Boateng', 'kwame.b@mail.city', 'user', 'Aug 2025', 1], ['Lena Fischer', 'lena.fischer@mail.city', 'user', 'Oct 2025', 1], ['Ravi Menon', 'ravi.menon@stackly.city', 'admin', 'Feb 2021', 1], ['Aisha Khan', 'aisha.khan@mail.city', 'user', 'Nov 2025', 0], ['Tomas Novak', 'tomas.novak@mail.city', 'user', 'Dec 2025', 1], ['Chen Wei', 'chen.wei@mail.city', 'user', 'Jan 2026', 1], ['Grace Mwangi', 'grace.m@mail.city', 'user', 'Feb 2026', 1]];
    var list = store.get('stk_admin_users', null);
    if (!list) { list = seed.map(function (s) { return { name: s[0], email: s[1], role: s[2], joined: s[3], active: !!s[4] }; }); store.get('stk_users', []).forEach(function (u) { list.unshift({ name: u.name, email: u.email, role: u.role, joined: 'Today', active: true }); }); }
    var usearch = $('#uSearch'), urole = $('#uRole');
    function paintUsers() {
      var q = usearch.value.trim().toLowerCase(), r = urole.value;
      var rows = list.filter(function (u) { return (r === 'all' || u.role === r) && (!q || (u.name + ' ' + u.email).toLowerCase().indexOf(q) > -1); });
      $('#userRows').innerHTML = rows.length ? rows.map(function (u) {
        var i = list.indexOf(u);
        return '<tr><td class="cell-who"><span class="who"><span class="av">' + initials(u.name) + '</span><span><b>' + esc(u.name) + '</b><small>' + esc(u.email) + '</small></span></span></td><td data-label="Role">' + pill(u.role === 'admin' ? 'Admin' : 'Citizen', u.role === 'admin' ? 'gold' : '') + '</td><td data-label="Joined">' + u.joined + '</td><td data-label="Status">' + pill(u.active ? 'Active' : 'Suspended', u.active ? 'green' : 'red') + '</td><td data-label="Actions"><span class="acts"><button class="btn btn-ghost btn-sm" type="button" data-toggle-user="' + i + '">' + I(u.active ? 'fa-user-lock' : 'fa-user-check') + (u.active ? 'Suspend' : 'Activate') + '</button><button class="btn btn-ghost btn-sm" type="button" data-del-user="' + i + '" aria-label="Remove ' + esc(u.name) + '">' + I('fa-trash-can') + '</button></span></td></tr>';
      }).join('') : '<tr><td class="empty-row" colspan="5">No users match this search.</td></tr>';
      store.set('stk_admin_users', list);
    }
    usearch.addEventListener('input', paintUsers); urole.addEventListener('change', paintUsers);
    D.addEventListener('click', function (e) {
      var t = e.target.closest('[data-toggle-user]'), d = e.target.closest('[data-del-user]');
      if (t) { var u = list[+t.getAttribute('data-toggle-user')]; u.active = !u.active; paintUsers(); toastOk(u.name + (u.active ? ' reactivated' : ' suspended')); }
      if (d) { var x = list.splice(+d.getAttribute('data-del-user'), 1)[0]; paintUsers(); toastOk(x.name + ' removed'); }
    });
    paintUsers();

    var cats = ['Streetlight fault', 'Water leak', 'Power outage', 'Waste collection', 'Road repair', 'Noise complaint', 'Permit query'], dist = ['Riverside', 'Old Town', 'Greenfield', 'Harbour Ward', 'Civic Square', 'North Hills'], pr = ['Low', 'Medium', 'High'];
    var reqs = store.get('stk_admin_reqs', null);
    if (!reqs) { reqs = []; for (var i = 0; i < 14; i++) reqs.push({ id: 'STK-26-' + (3100 - i * 7), cat: cats[i % cats.length], dist: dist[(i * 5) % dist.length], pri: pr[(i * 2) % 3], st: ['open', 'progress', 'done', 'progress', 'open', 'done', 'open'][i % 7] }); }
    var STL = { open: 'Open', progress: 'In progress', done: 'Resolved' };
    var status = C.donut($('#aStatus'), [{ v: 1, c: '#ffc857' }], { big: '0', small: 'requests', label: 'Requests by status' });
    function counts() { var c = { open: 0, progress: 0, done: 0 }; reqs.forEach(function (r) { c[r.st]++; }); return c; }
    function refreshStats() {
      var c = counts(); bind('adminOpen', c.open + c.progress); bind('stOpen', c.open); bind('stProg', c.progress); bind('stDone', c.done);
      status.set([{ v: c.open || .001, c: '#ffc857' }, { v: c.progress || .001, c: '#38d5f5' }, { v: c.done || .001, c: '#5eead4' }], { big: String(reqs.length), small: 'requests', label: 'Requests by status' });
    }
    function paintReqs() {
      $('#aReqRows').innerHTML = reqs.map(function (r, i) {
        return '<tr data-cat="' + r.st + '"><td data-label="Ref"><b style="color:var(--head)">' + r.id + '</b></td><td data-label="Category">' + r.cat + '</td><td data-label="District">' + r.dist + '</td><td data-label="Priority">' + pill(r.pri, r.pri === 'High' ? 'red' : r.pri === 'Medium' ? 'gold' : '') + '</td><td data-label="Status"><select data-req="' + i + '" aria-label="Status for ' + r.id + '">' + Object.keys(STL).map(function (k) { return '<option value="' + k + '"' + (k === r.st ? ' selected' : '') + '>' + STL[k] + '</option>'; }).join('') + '</select></td></tr>';
      }).join('');
      var act = $('#reqTable [data-filter].on'); if (act && act.getAttribute('data-filter') !== 'all') act.click();
      store.set('stk_admin_reqs', reqs); refreshStats();
    }
    D.addEventListener('change', function (e) { var s = e.target.closest('[data-req]'); if (!s) return; var r = reqs[+s.getAttribute('data-req')]; r.st = s.value; store.set('stk_admin_reqs', reqs); var row = s.closest('tr'); row.setAttribute('data-cat', r.st); refreshStats(); toastOk(r.id + ' marked ' + STL[r.st].toLowerCase()); });
    paintReqs();

    var days = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
    C.line($('#aReq'), { label: 'Requests received and resolved', labels: days, series: [{ name: 'Received', color: '#38d5f5', data: [64, 71, 58, 80, 76, 69, 84, 90, 77, 82, 95, 88] }, { name: 'Resolved', color: '#5eead4', data: [52, 60, 55, 68, 72, 66, 75, 84, 74, 80, 88, 86] }] });
    C.line($('#aVisits'), { label: 'Portal visits per week', labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10', 'W11', 'W12'], series: [{ name: 'Visits', color: '#7b8cff', data: [310, 335, 322, 360, 372, 390, 388, 415, 430, 452, 470, 495] }] });
    C.bars($('#aUsage'), { label: 'Service usage', labels: ['Transit', 'Bills', 'Permits', 'Health', 'Parking', 'Waste'], data: [820, 640, 310, 270, 460, 220], colors: ['#38d5f5', '#ffc857', '#7b8cff', '#ff6b8a', '#5eead4', '#4ade80'] });
    C.donut($('#aChan'), [{ v: 48, c: '#38d5f5' }, { v: 36, c: '#ffc857' }, { v: 10, c: '#7b8cff' }, { v: 6, c: '#5eead4' }], { big: '48%', small: 'web portal', label: 'Channel share' });
    C.gauge($('#aSat'), 94, 'Satisfied residents', '#34d399');

    var sensors = [['Air PM2.5', 'ug/m3', 13, 60], ['Traffic count', 'veh/min', 84, 160], ['Grid load', 'MW', 642, 800], ['Water pressure', 'bar', 4.2, 6], ['Noise level', 'dB', 58, 100], ['Temperature', 'C', 29, 50], ['Soil moisture', '%', 41, 100], ['Solar output', 'MW', 318, 450], ['Bin fill level', '%', 63, 100], ['Streetlights on', '%', 72, 100], ['River level', 'cm', 118, 300], ['Free parking', 'spaces', 1420, 2400]];
    var st = sensors.map(function (s) { return { n: s[0], u: s[1], v: s[2], max: s[3], dec: s[2] % 1 ? 1 : 0, off: false }; }); st[3].off = true;
    $('#sensorGrid').innerHTML = st.map(function (s, i) { return '<div class="card sensor" data-anim="up" style="--d:' + (i % 4) * 80 + 'ms"><div class="top"><span>' + s.n + '</span><span class="led" data-led="' + i + '"></span></div><b data-sv="' + i + '"></b><small class="muted">' + s.u + '</small><div class="meter" style="height:6px"><i data-sm="' + i + '" style="width:0"></i></div></div>'; }).join('');
    function paintSensors() {
      st.forEach(function (s, i) {
        if (!s.off) s.v = Math.max(0, Math.min(s.max, s.v + (Math.random() - .5) * s.max * .04));
        var pct = Math.round(s.v / s.max * 100), led = $('[data-led="' + i + '"]');
        $('[data-sv="' + i + '"]').textContent = s.off ? 'Offline' : s.v.toFixed(s.dec).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        $('[data-sm="' + i + '"]').style.width = (s.off ? 0 : pct) + '%'; led.className = 'led' + (s.off ? ' off' : pct > 85 ? ' warn' : '');
      });
    }
    paintSensors(); setInterval(function () { if (!D.hidden) paintSensors(); }, 2500);

    var feedMsgs = [['fa-user-plus', 'New citizen registered', 'g'], ['fa-ticket', 'Request resolved in Riverside', 'm'], ['fa-bolt', 'Grid load balanced by solar', ''], ['fa-credit-card', 'Property tax payment received', 'g'], ['fa-droplet', 'Leak sensor alert, Old Town', 'r'], ['fa-shield-halved', 'Security scan passed', 'm'], ['fa-bus', 'Bus 42 delay cleared', ''], ['fa-file-signature', 'Certificate issued digitally', 'g']];
    var feed = $('#feed');
    function addFeed(m, t) { var li = el('li', '', '<span class="ic ' + m[2] + '">' + I(m[0]) + '</span><div><b>' + m[1] + '</b><small>' + t + '</small></div>' + pill('Live', m[2] === 'r' ? 'red' : 'green')); feed.insertBefore(li, feed.firstChild); while (feed.children.length > 10) feed.removeChild(feed.lastChild); }
    for (var f = 5; f >= 0; f--) addFeed(feedMsgs[f], f * 3 + 1 + ' min ago');
    setInterval(function () { if (!D.hidden) addFeed(feedMsgs[Math.floor(Math.random() * feedMsgs.length)], 'just now'); }, 4500);

    var S = store.get('stk_settings', {});
    $$('[data-setting]').forEach(function (c) {
      var k = c.getAttribute('data-setting'); if (k in S) c.checked = !!S[k];
      c.addEventListener('change', function () { S[k] = c.checked; store.set('stk_settings', S); toastOk('Setting updated'); });
    });
    $('#adminPassForm').addEventListener('submit', function (e) {
      e.preventDefault(); var n = $('#apNew'), bad = n.value.length < 8; n.closest('.field').classList.toggle('err', bad);
      if (bad) { Stk.toast('New password is too short', 'err'); return; } toastOk('Administrator password updated (demo)'); e.target.reset();
    });
    $('#resetDemo').addEventListener('click', function () {
      ['stk_admin_users', 'stk_admin_reqs', 'stk_settings', 'stk_users', 'stk_bills', 'stk_requests', 'stk_cart', 'stk_wish'].forEach(function (k) { try { localStorage.removeItem(k); } catch (x) {} });
      toastOk('Demo data reset'); setTimeout(function () { location.reload(); }, 700);
    });
  }

  role === 'admin' ? adminDash() : userDash();
  $$('[data-spark]').forEach(function (h) { C.spark(h, h.getAttribute('data-spark').split(',').map(Number), h.getAttribute('data-color') || '#38d5f5'); });
  show(location.hash.slice(1));
})();
