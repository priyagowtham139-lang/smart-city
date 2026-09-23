/* =========================================================
   STACKLY - auth.js : sign in, sign up, role tabs, password eye toggle
   Demo only: accounts live in this browser's localStorage.
   ========================================================= */
(function () {
  'use strict';
  var Stk = window.Stk, D = document, $ = Stk.$, $$ = Stk.$$, store = Stk.store;
  var DEMO = [
    { name: 'Citizen Demo', email: 'user.demo@gmail.com', pass: 'User@123', role: 'user' },
    { name: 'Admin Demo', email: 'admin.demo@gmail.com', pass: 'Admin@123', role: 'admin' }
  ];
  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var GMAIL = /^[^\s@]+@gmail\.com$/i;
  var role = 'user';

  /* ---- mode tabs ---- */
  var tabIn = $('#tabIn'), tabUp = $('#tabUp'), paneIn = $('#paneIn'), paneUp = $('#paneUp');
  function mode(m, updateHash) {
    var up = m === 'signup';
    tabIn.classList.toggle('on', !up); tabUp.classList.toggle('on', up);
    tabIn.setAttribute('aria-selected', String(!up)); tabUp.setAttribute('aria-selected', String(up));
    paneIn.classList.toggle('on', !up); paneUp.classList.toggle('on', up);
    D.title = (up ? 'Sign up' : 'Sign in') + ' | Stackly Smart City';
    if (updateHash) try { history.replaceState(null, '', up ? '#signup' : '#signin'); } catch (e) {}
  }
  tabIn.addEventListener('click', function () { mode('signin', true); });
  tabUp.addEventListener('click', function () { mode('signup', true); });
  $$('[data-switch]').forEach(function (a) { a.addEventListener('click', function (e) { e.preventDefault(); mode(a.getAttribute('data-switch'), true); }); });
  window.addEventListener('hashchange', function () { if (location.hash === '#signup') mode('signup'); else if (location.hash === '#signin') mode('signin'); });
  if (location.hash === '#signup') mode('signup');

  /* ---- role tabs ---- */
  var seg = $('.seg'), inBtnLabel = $('#inBtn span');
  $$('[data-role-btn]', seg).forEach(function (b) {
    b.addEventListener('click', function () {
      role = b.getAttribute('data-role-btn'); seg.setAttribute('data-role', role);
      $$('[data-role-btn]', seg).forEach(function (x) { var on = x === b; x.classList.toggle('on', on); x.setAttribute('aria-checked', String(on)); });
      inBtnLabel.textContent = 'Sign in as ' + (role === 'admin' ? 'Admin' : 'User');
      showErr($('#inError'), '');
    });
  });

  /* ---- helpers ---- */
  function showErr(box, msg) { box.hidden = !msg; box.innerHTML = msg ? '<i class="fa-solid fa-circle-exclamation"></i><span>' + msg + '</span>' : ''; }
  function fieldState(input, bad) { var f = input.closest('.field'); if (f) { f.classList.toggle('err', bad); f.classList.toggle('ok', !bad && !!input.value); } return !bad; }
  function users() { return store.get('stk_users', []).concat(DEMO); }
  function find(email) { email = email.toLowerCase(); return users().filter(function (u) { return u.email.toLowerCase() === email; })[0]; }
  function loading(btn, on, label) {
    btn.disabled = on; var ic = $('i', btn), sp = $('span', btn);
    if (on) { btn.dataset.ic = ic.className; ic.className = 'fa-solid fa-spinner'; btn.dataset.tx = sp.textContent; sp.textContent = label; }
    else { ic.className = btn.dataset.ic || ic.className; sp.textContent = btn.dataset.tx || sp.textContent; }
  }
  function startSession(acct, r) {
    store.set('stk_session', { name: acct.name, email: acct.email, role: r, t: Date.now() });
    Stk.toast('Welcome, ' + acct.name.split(' ')[0] + '. Opening your ' + (r === 'admin' ? 'admin' : 'user') + ' dashboard.');
    setTimeout(function () { location.href = Stk.dashFor({ role: r }); }, 900);
  }

  /* ---- sign in ---- */
  var fIn = $('#formIn'), inEmail = $('#inEmail'), inPass = $('#inPass');
  var remembered = store.get('stk_remember', ''); if (remembered) { inEmail.value = remembered; $('#remember').checked = true; }
  [inEmail, inPass].forEach(function (i) { i.addEventListener('input', function () { showErr($('#inError'), ''); validateIn(); }); });
  function validateIn() {
    var ev = inEmail.value.trim();
    var a = fieldState(inEmail, !GMAIL.test(ev));
    if (a === false) { var m = $('.msg', inEmail.closest('.field')); if (m) m.textContent = 'Only Gmail addresses are allowed.'; }
    var b = fieldState(inPass, inPass.value.length < 6);
    return a && b;
  }
  fIn.addEventListener('submit', function (e) {
    e.preventDefault(); var err = $('#inError'); showErr(err, '');
    if (!validateIn()) return;
    var acct = { name: inEmail.value.trim().split('@')[0], email: inEmail.value.trim(), pass: inPass.value, role: role };
    store.set('stk_remember', $('#remember').checked ? acct.email : '');
    loading($('#inBtn'), true, 'Signing in'); setTimeout(function () { startSession(acct, role); }, 700);
  });
  $('#demoFill').addEventListener('click', function () {
    var d = DEMO.filter(function (x) { return x.role === role; })[0];
    inEmail.value = d.email; inPass.value = d.pass; showErr($('#inError'), ''); validateIn(); Stk.toast('Demo ' + role + ' credentials filled in');
  });
  $('#forgot').addEventListener('click', function (e) {
    e.preventDefault();
    if (!GMAIL.test(inEmail.value.trim())) { fieldState(inEmail, true); var m = $('.msg', inEmail.closest('.field')); if (m) m.textContent = 'Only Gmail addresses are allowed.'; inEmail.focus(); Stk.toast('Enter a Gmail address first', 'err'); return; }
    Stk.toast('If this email is registered, a reset link has been sent.');
  });

  /* ---- sign up ---- */
  var fUp = $('#formUp'), upName = $('#upName'), upEmail = $('#upEmail'), upPass = $('#upPass'), upPass2 = $('#upPass2'), upTerms = $('#upTerms'), strength = $('#strength');
  function score(p) { var s = 0; if (p.length >= 8) s++; if (/[a-z]/.test(p) && /[A-Z]/.test(p)) s++; if (/\d/.test(p)) s++; if (/[^A-Za-z0-9]/.test(p) || p.length >= 14) s++; return p ? Math.max(1, s) : 0; }
  upPass.addEventListener('input', function () {
    var s = score(upPass.value); strength.className = 'strength' + (s ? ' s' + s : '');
    $('span', strength).textContent = ['Enter a password', 'Weak', 'Fair', 'Good', 'Strong'][s];
  });
  function validateUp() {
    var ok = true;
    var nv = upName.value.trim(), ev = upEmail.value.trim();
    function setMsg(input, txt) { var m = $('.msg', input.closest('.field')); if (m) m.textContent = txt; }
    var nameBad = nv.length < 2 || !/^[A-Za-z\s'-]+$/.test(nv);
    fieldState(upName, nameBad); if (nameBad) setMsg(upName, nv && /\d/.test(nv) ? 'Only alphabets are allowed' : 'Please enter your name.'); ok = !nameBad && ok;
    var emailBad = !/^[^\s@]+@gmail\.com$/i.test(ev);
    fieldState(upEmail, emailBad); if (emailBad) setMsg(upEmail, ev && EMAIL.test(ev) ? 'Only Gmail addresses are allowed' : 'Enter a valid email address.'); ok = !emailBad && ok;
    var s = score(upPass.value);
    var passBad = s < 4;
    fieldState(upPass, passBad); if (passBad) setMsg(upPass, 'Use a strong password (uppercase, number and symbol).'); ok = !passBad && ok;
    var pass2Bad = !upPass2.value || upPass2.value !== upPass.value;
    fieldState(upPass2, pass2Bad); if (pass2Bad) setMsg(upPass2, pass2Bad ? 'Passwords do not match.' : 'Use a strong password.'); ok = !pass2Bad && ok;
    var t = upTerms.closest('.field'); t.classList.toggle('err', !upTerms.checked); ok = upTerms.checked && ok;
    return ok;
  }
  $$('input', fUp).forEach(function (i) { i.addEventListener('input', function () { showErr($('#upError'), ''); validateUp(); }); });
  upTerms.addEventListener('change', function () { var t = upTerms.closest('.field'); t.classList.toggle('err', !upTerms.checked); if (!upTerms.checked) { var m = $('.msg', t); if (m) m.textContent = 'Please accept the privacy policy and terms and conditions.'; } });
  fUp.addEventListener('submit', function (e) {
    e.preventDefault(); var err = $('#upError'); showErr(err, '');
    if (!validateUp()) return;
    var at = upTerms.closest('.field'), am = $('.msg', at);
    if (!upTerms.checked) { at.classList.add('err'); if (am) am.textContent = 'Please accept the privacy policy and terms and conditions.'; var chk = $('.chk', at); if (chk) chk.scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
    location.href = '404.html';
  });

  /* ---- already signed in ---- */
  var s = Stk.session();
  if (s) {
    var box = $('#signedIn'); box.hidden = false;
    $('#signedAs').textContent = s.email + ' (' + s.role + ')'; $('#signedGo').href = Stk.dashFor(s);
  }
})();
